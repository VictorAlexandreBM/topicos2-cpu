package org.acme.cpu.cliente.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Usuario;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    public Usuario findByLogin(String email) {
        return find("email = ?1", email).firstResult();
    }

    public Usuario findByRefreshToken(String refreshToken) {
        return find("refreshToken = ?1", refreshToken).firstResult();
    }
}
