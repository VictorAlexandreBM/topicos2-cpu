package org.acme.cpu.cliente.services.usuario;


import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.security.ForbiddenException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.admin.dto.cpu.CpuBoxListDTO;
import org.acme.cpu.admin.dto.cpu.CpuListDTO;
import org.acme.cpu.admin.dto.cpu.CpuTrayListDTO;
import org.acme.cpu.admin.models.Cpu;
import org.acme.cpu.admin.models.CpuBox;
import org.acme.cpu.admin.models.CpuTray;
import org.acme.cpu.admin.repositories.CpuRepository;
import org.acme.cpu.cliente.dtos.usuario.*;
import org.acme.cpu.cliente.models.Telefone;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.models.enums.Perfil;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.cliente.services.token.TokenService;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.core.exception.ValidationException;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class UsuarioServiceImpl implements UsuarioService {

    @Inject
    Logger LOG;

    @Inject
    UsuarioRepository repository;
    @Inject
    CpuRepository cpuRepository;

    @Inject
    TokenService tokenService;

    @Inject
    JsonWebToken jwt;

    @Override
    public UsuarioResponseDTO findByLogin(String email) {
        LOG.debugf("Buscando dados do usuário: %s", email);

        Usuario usuario = repository.findByLogin(email);

        if (usuario == null) {
            LOG.debugf("Usuário %s não encontrado na busca por login.", email);
            throw new NotFoundException("Usuário não encontrado");
        }

        return new UsuarioResponseDTO(usuario);
    }


    @Transactional
    @Override
    public UsuarioResponseDTO cadastrar(UsuarioCadastroDTO dto) {

        if (repository.findByLogin(dto.email()) != null){
            LOG.warnf("Tentativa de cadastro de cliente com email já existente: %s", dto.email());
            throw ValidationException.of("email", "email já existe");
        }

        if (!dto.senha().equals(dto.confirmarSenha())) {
            throw ValidationException.of("senha", "Senha de confirmação não é igual à senha original");
        }

        if (!dto.email().equals(dto.confirmarEmail())) {
            throw ValidationException.of("email", "E-mail de confirmação não é igual ao e-mail original");
        }

        Usuario usuario = new Usuario();
        usuario.setPrimeiroNome(dto.primeiroNome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setEmail(dto.email());

        usuario.setTelefones(
                dto.telefones().stream()
                        .map(Telefone::fromDTO)
                        .collect(Collectors.toSet())
        );

        String senhaCriptografada = BcryptUtil.bcryptHash(dto.senha());
        usuario.setSenha(senhaCriptografada);

        Perfil perfilClientePadrao = Perfil.CLIENTE;
        usuario.setPerfil(perfilClientePadrao);
        repository.persist(usuario);

        LOG.infof("Cliente cadastrado com sucesso: %s (Nome: %s, ID: %d)",
                usuario.getEmail(), usuario.getNomeCompleto(), usuario.getId());

        return new UsuarioResponseDTO(usuario);
    }


    private Usuario getUsuarioLogado() {
        String emailLogado = jwt.getName();

        Usuario u = repository.findByLogin(emailLogado);

        if (u == null) {
            LOG.errorf("Token válido para %s, mas usuário não encontrado no banco.", emailLogado);
            throw new NotFoundException("Cliente não encontrado!");
        }

        return u;
    }

    @Override
    @Transactional
    public UsuarioLogadoResponseDTO logar(UsuarioLoginDTO dto) {
        Usuario usuario = repository.findByLogin(dto.email());

        if (usuario == null || !BcryptUtil.matches(dto.senha(), usuario.getSenha())) {
            LOG.warnf("Falha de login: Credenciais inválidas para o email %s", dto.email());
            throw new NotFoundException("Usuário ou senha incorretos");
        }

        if (!usuario.isAtivo()) {
            LOG.warnf("Login bloqueado: Usuário %s tentou logar mas está com conta inativa", dto.email());
            throw new ForbiddenException("Sua conta está inativa. Entre em contato com o suporte");
        }

        LOG.infof("Login realizado com sucesso: %s", usuario.getEmail());

        return tokenService.gerarInfoToken(usuario);
    }


    @Transactional
    @Override
    public UsuarioResponseDTO atualizar(UsuarioUpdateDTO dto) {
        Usuario usuario = getUsuarioLogado();

        // 1. Validação de Segurança
        if (!BcryptUtil.matches(dto.senhaAtual(), usuario.getSenha())) {
            LOG.warnf("Tentativa de atualização de perfil negada. Senha incorreta para %s", usuario.getEmail());
            throw ValidationException.of("senhaAtual", "Senha atual incorreta.");
        }

        // 2. Atualização dos Dados
        usuario.setPrimeiroNome(dto.nome());
        usuario.setSobrenome(dto.sobrenome());
        usuario.setTelefones(dto.telefones().stream().map(Telefone::fromDTO).collect(Collectors.toSet()));

        LOG.infof("Cliente %s atualizou seus dados pessoais.", usuario.getEmail());

        return new UsuarioResponseDTO(usuario);
    }

    // ========================================================================
    // MÉTODOS ADMINISTRATIVOS
    // ========================================================================

    @Override
    public RespostaPaginadaDTO<UsuarioListDTO> listarUsuarios(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {

        List<UsuarioListDTO> dados = repository.listar(pagina, tamanho, filtro, ativo, campoOrdenacao, direcao)
                .stream()
                .map(UsuarioListDTO::new)
                .toList();

        long total = repository.countListar(filtro, ativo);

        return new RespostaPaginadaDTO<>(dados, total);
    }

    @Transactional
    @Override
    public void alterarStatus(Long id, boolean ativo) {
        Usuario usuarioAlvo = repository.findById(id);
        if (usuarioAlvo == null) {
            throw new NotFoundException("Usuário não encontrado.");
        }

        // Trava de Segurança: Não permitir que o Admin desative a si mesmo
        String emailLogado = jwt.getName();
        if (usuarioAlvo.getEmail().equals(emailLogado) && !ativo) {
            throw new ForbiddenException("Você não pode inativar sua própria conta.");
        }

        usuarioAlvo.setAtivo(ativo);
        LOG.infof("Admin alterou o status do usuário %d para ativo=%b", id, ativo);
    }

    @Transactional
    @Override
    public void alterarPerfil(Long id, char siglaPerfil) {
        Usuario usuarioAlvo = repository.findById(id);
        if (usuarioAlvo == null) {
            throw new NotFoundException("Usuário não encontrado.");
        }

        // Trava de Segurança: Não permitir que o Admin rebaixe seu próprio perfil
        String emailLogado = jwt.getName();
        if (usuarioAlvo.getEmail().equals(emailLogado) && siglaPerfil != 'A') {
            throw new ForbiddenException("Você não pode alterar o próprio perfil administrativo.");
        }

        Perfil novoPerfil = Perfil.fromSigla(siglaPerfil);
        usuarioAlvo.setPerfil(novoPerfil);

        LOG.infof("Admin alterou o perfil do usuário %d para %s", id, novoPerfil.getTipo());
    }

    @Transactional
    @Override
    public void adicionarFavorito(Long cpuId) {
        Usuario usuario = getUsuarioLogado();
        org.acme.cpu.admin.models.Cpu cpu = cpuRepository.findById(cpuId);

        if (cpu == null) {
            throw new NotFoundException("Processador não encontrado");
        }

        usuario.getListaDesejos().add(cpu);
    }

    @Transactional
    @Override
    public void removerFavorito(Long cpuId) {
        Usuario usuario = getUsuarioLogado();
        org.acme.cpu.admin.models.Cpu cpu = cpuRepository.findById(cpuId);

        if (cpu == null) {
            throw new NotFoundException("Processador não encontrado");
        }

        usuario.getListaDesejos().remove(cpu);
    }

    @Override
    public List<CpuListDTO> listarFavoritos() {
        Usuario usuario = getUsuarioLogado();

        return usuario.getListaDesejos().stream()
                .map(this::mapToDto)
                .toList();
    }


    private CpuListDTO mapToDto(Cpu c) {
        if (c instanceof CpuBox box) {
            return new CpuBoxListDTO(
                    box.getId(),
                    box.getSku(),
                    box.getPreco(),
                    box.getEstoque(),
                    box.getModelo().getNome(),
                    box.getNomeComercial(),
                    box.getModelo().getMarca().getNome(),
                    box.isEmVenda(),
                    box.getImagemUrl(),
                    "BOX"
            );
        } else if (c instanceof CpuTray tray) {
            return new CpuTrayListDTO(
                    tray.getId(),
                    tray.getSku(),
                    tray.getPreco(),
                    tray.getEstoque(),
                    tray.getModelo().getNome(),
                    tray.getNomeComercial(),
                    tray.getModelo().getMarca().getNome(),
                    tray.isEmVenda(),
                    tray.getImagemUrl(),
                    "TRAY"
            );
        }
        throw new IllegalArgumentException("Tipo de CPU desconhecido: " + c.getClass().getName());
    }

//    @Transactional
//    @Override
//    public void trocarPropriaSenha(UsuarioResetPropriaSenhaDTO dto) {
//
//        Usuario usuario = getUsuarioLogado(); // você define como buscar
//
//        if (!BcryptUtil.matches(dto.senhaAntiga(), usuario.getSenha())) {
//            LOG.warnf("Senha antiga incorreta ao trocar senha de %s.", usuario.getEmail());
//            throw new BadRequestException("Senha antiga incorreta!");
//        }
//
//        if (BcryptUtil.matches(dto.senhaNova(), usuario.getSenha())) {
//            LOG.warnf("Usuário %s tentou trocar a senha pela mesma senha.", usuario.getEmail());
//            throw new BadRequestException("Nova senha igual à atual!");
//        }
//
//        usuario.setSenha(BcryptUtil.bcryptHash(dto.senhaNova()));
//
//        LOG.infof("Senha do usuário %s atualizada com sucesso.", usuario.getEmail());
//    }

}