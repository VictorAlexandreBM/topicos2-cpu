package org.acme.cpu.cliente.services.token;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.acme.cpu.cliente.dtos.usuario.UsuarioLogadoResponseDTO;
import org.acme.cpu.cliente.models.Usuario;

public interface TokenService {

    UsuarioLogadoResponseDTO gerarInfoToken(Usuario usuario);

    UsuarioLogadoResponseDTO validarRefreshToken(String refreshToken);

    void invalidarRefreshToken(String refreshToken);
}
