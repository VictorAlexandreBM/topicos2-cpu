package org.acme.cpu.cliente.services.token;

import io.quarkus.security.ForbiddenException;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.cliente.dtos.usuario.UsuarioLogadoResponseDTO;
import org.acme.cpu.cliente.dtos.usuario.UsuarioResponseDTO;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class TokenServiceImpl implements TokenService {

    @Inject
    UsuarioRepository repository;

    @Inject
    Logger LOG;

    @Transactional
    @Override
    public UsuarioLogadoResponseDTO gerarInfoToken(Usuario usuario) {
        LOG.debugf("Iniciando geração de tokens para o usuário: %s", usuario.getEmail());

        String tokenAcesso = gerarTokenAcesso(usuario);
        String refreshToken = gerarRefreshToken();
        LocalDateTime expiracao = LocalDateTime.now().plusDays(7);

        usuario.setRefreshToken(refreshToken);
        usuario.setRefreshTokenExpiration(expiracao);

        repository.persist(usuario);

        LOG.infof("Login/Refresh realizado com sucesso para: %s. Refresh expira em: %s",
                usuario.getEmail(), expiracao);

        return new UsuarioLogadoResponseDTO(
                usuario.getEmail(),
                tokenAcesso,
                refreshToken,
                new UsuarioResponseDTO(usuario)
        );
    }

    @Override
    @Transactional
    public UsuarioLogadoResponseDTO validarRefreshToken(String refreshToken) {
        LOG.debug("Tentativa de renovação de token (Refresh Token Flow).");

        Usuario usuario = repository.findByRefreshToken(refreshToken);

        if (usuario == null) {
            LOG.warn("Falha no Refresh: Token não encontrado ou inválido.");
            throw new UnauthorizedException("Token inválido ou Usuário não encontrado");
        }

        if (!usuario.isAtivo()) {
            LOG.warnf("Falha no Refresh: Usuário %s está inativo", usuario.getEmail());

            usuario.setRefreshToken(null);
            throw new ForbiddenException("Sua conta está inativa, entre em contato com o suporte");
        }

        if (usuario.getRefreshTokenExpiration().isBefore(LocalDateTime.now())) {
            LOG.warnf("Falha no Refresh: Token expirado para o usuário %s.", usuario.getEmail());
            throw new UnauthorizedException("Refresh Token expirado");
        }

        return gerarInfoToken(usuario);
    }

    @Override
    @Transactional
    public void invalidarRefreshToken(String refreshToken) {
        LOG.debug("Solicitação de Logout (Invalidar Token).");

        Usuario usuario = repository.findByRefreshToken(refreshToken);

        if (usuario != null) {
            String email = usuario.getEmail(); // Guarda o email antes de limpar
            usuario.setRefreshToken(null);
            usuario.setRefreshTokenExpiration(null);

            LOG.infof("Logout realizado com sucesso. Token invalidado para o usuário: %s", email);
        } else {
            LOG.debug("Logout chamado com token já inexistente ou inválido.");
        }
    }

    private String gerarTokenAcesso(Usuario usuario) {

        LOG.debugf("Gerando JWT para %s com permissões: %s", usuario.getEmail(), usuario.getPerfil().getTipo());

        return Jwt.issuer("CPU")
                .upn(usuario.getEmail())
                .expiresAt(System.currentTimeMillis() / 1000 + 900) // 15 minutos
                .groups(String.valueOf(usuario.getPerfil().getSigla()))
                .sign();
    }

    private String gerarRefreshToken() {
        return UUID.randomUUID().toString();
    }
}
