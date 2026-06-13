package org.acme.cpu.cliente.services.endereco;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.cliente.dtos.endereco.EnderecoDTO;
import org.acme.cpu.cliente.dtos.endereco.EnderecoResponseDTO;
import org.acme.cpu.cliente.models.Cidade;
import org.acme.cpu.cliente.models.Endereco;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.CidadeRepository;
import org.acme.cpu.cliente.repositories.EnderecoRepository;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EnderecoServiceImpl implements EnderecoService {

    @Inject
    EnderecoRepository repository;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    CidadeRepository cidadeRepository;

    @Inject
    JsonWebToken jwt;

    private Usuario getUsuarioLogado() {
        String email = jwt.getName();
        Usuario usuario = usuarioRepository.find("email", email).firstResult();

        if (usuario == null) {
            throw new NotFoundException("Usuário logado não encontrado.");
        }
        return usuario;
    }

    @Override
    public List<EnderecoResponseDTO> listar() {
        Usuario usuario = getUsuarioLogado();

        return usuario.getEnderecos().stream()
                .map(EnderecoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public EnderecoResponseDTO buscarPorId(Long id) {
        Endereco endereco = repository.findById(id);
        validarPertencimento(endereco);

        return new EnderecoResponseDTO(endereco);
    }

    @Override
    @Transactional
    public EnderecoResponseDTO criar(EnderecoDTO dto) {
        Usuario usuario = getUsuarioLogado();

        Endereco endereco = new Endereco();
        mapearDados(endereco, dto);

        repository.persist(endereco);

        usuario.getEnderecos().add(endereco);
        usuarioRepository.persist(usuario);

        return new EnderecoResponseDTO(endereco);
    }

    @Override
    @Transactional
    public EnderecoResponseDTO atualizar(Long id, EnderecoDTO dto) {
        Endereco endereco = repository.findById(id);
        validarPertencimento(endereco);

        mapearDados(endereco, dto);
        return new EnderecoResponseDTO(endereco);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Usuario usuario = getUsuarioLogado();
        Endereco endereco = repository.findById(id);
        validarPertencimento(endereco);

        usuario.getEnderecos().remove(endereco);
        repository.delete(endereco);
    }

    private void validarPertencimento(Endereco endereco) {
        if (endereco == null) {
            throw new NotFoundException("Endereço não encontrado.");
        }

        Usuario usuario = getUsuarioLogado();

        boolean pertenceAoUsuario = usuario.getEnderecos().stream()
                .anyMatch(e -> e.getId().equals(endereco.getId()));

        if (!pertenceAoUsuario) {
            throw new ForbiddenException("Você não tem permissão para acessar este endereço.");
        }
    }

    private void mapearDados(Endereco endereco, EnderecoDTO dto) {
        Cidade cidade = cidadeRepository.findById(dto.cidadeId());

        if (cidade == null) {
            throw new NotFoundException("Cidade não encontrada para o ID: " + dto.cidadeId());
        }

        endereco.setCep(dto.cep().replace("-", ""));
        endereco.setLogradouro(dto.logradouro());
        endereco.setQuadra(dto.quadra());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCidade(cidade);
    }
}