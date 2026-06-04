package org.acme.cpu.cliente.services.endereco;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.cliente.dtos.endereco.EnderecoDTO;
import org.acme.cpu.cliente.dtos.endereco.EnderecoResponseDTO;
import org.acme.cpu.cliente.models.Endereco;
import org.acme.cpu.cliente.models.Usuario;
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
    JsonWebToken jwt; // Injeta o token para pegar o e-mail do usuário logado

    /**
     * Método utilitário para pegar a entidade do usuário atual
     */
    private Usuario getUsuarioLogado() {
        String email = jwt.getName();
        // Nota: Assumindo que seu repositório de usuário tem um método de busca por e-mail/login
        Usuario usuario = usuarioRepository.find("email", email).firstResult();

        if (usuario == null) {
            throw new NotFoundException("Usuário logado não encontrado.");
        }
        return usuario;
    }

    @Override
    public List<EnderecoResponseDTO> listar() {
        Usuario usuario = getUsuarioLogado();

        // Retorna APENAS os endereços do usuário logado
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

        // Salva o endereço no banco
        repository.persist(endereco);

        // Vincula o endereço à lista do usuário atual
        usuario.getEnderecos().add(endereco);
        usuarioRepository.persist(usuario); // Atualiza o usuário

        return new EnderecoResponseDTO(endereco);
    }

    @Override
    @Transactional
    public EnderecoResponseDTO atualizar(Long id, EnderecoDTO dto) {
        Endereco endereco = repository.findById(id);
        validarPertencimento(endereco); // Garante que o usuário logado é dono deste endereço

        mapearDados(endereco, dto);
        return new EnderecoResponseDTO(endereco);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Usuario usuario = getUsuarioLogado();
        Endereco endereco = repository.findById(id);
        validarPertencimento(endereco);

        // Remove a relação primeiro
        usuario.getEnderecos().remove(endereco);

        // Exclui do banco
        repository.delete(endereco);
    }

    /**
     * Garante que o endereço existe e pertence ao usuário logado
     */
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
        endereco.setCep(dto.cep().replace("-", ""));
        endereco.setLogradouro(dto.logradouro());
        endereco.setQuadra(dto.quadra());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCidade(dto.cidade());
        endereco.setEstado(dto.estado());
    }
}