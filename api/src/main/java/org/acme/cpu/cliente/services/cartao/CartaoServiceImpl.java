package org.acme.cpu.cliente.services.cartao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.cliente.dtos.cartao.CartaoDTO;
import org.acme.cpu.cliente.dtos.cartao.CartaoResponseDTO;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.models.Cartao;
import org.acme.cpu.pedido.repository.CartaoRepository;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CartaoServiceImpl implements CartaoService {

    @Inject
    CartaoRepository repository;

    @Inject
    UsuarioRepository usuarioRepository;

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
    public List<CartaoResponseDTO> listar() {
        Usuario usuario = getUsuarioLogado();

        return usuario.getCartoes().stream()
                .filter(Cartao::getAtivo) // Apenas cartões que não sofreram soft delete
                .map(CartaoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartaoResponseDTO criar(CartaoDTO dto) {
        Usuario usuario = getUsuarioLogado();

        Cartao cartao = new Cartao();
        cartao.setGatewayToken(dto.gatewayToken());
        cartao.setUltimos4(dto.ultimos4());
        cartao.setBandeira(dto.bandeira());
        cartao.setMesExpiracao(dto.mesExpiracao());
        cartao.setAnoExpiracao(dto.anoExpiracao());
        cartao.setTitular(dto.titular());
        cartao.setAtivo(true);

        repository.persist(cartao);

        usuario.getCartoes().add(cartao);
        usuarioRepository.persist(usuario);

        return new CartaoResponseDTO(cartao);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Cartao cartao = repository.findById(id);
        validarPertencimento(cartao);

        // Soft Delete: Inativa o cartão para que não apareça mais na listagem,
        // mas mantém a integridade dos pagamentos atrelados a pedidos antigos.
        cartao.setAtivo(false);
    }

    private void validarPertencimento(Cartao cartao) {
        if (cartao == null) {
            throw new NotFoundException("Cartão não encontrado.");
        }

        Usuario usuario = getUsuarioLogado();

        boolean pertenceAoUsuario = usuario.getCartoes().stream()
                .anyMatch(c -> c.getId().equals(cartao.getId()));

        if (!pertenceAoUsuario) {
            throw new ForbiddenException("Você não tem permissão para acessar este cartão.");
        }
    }
}