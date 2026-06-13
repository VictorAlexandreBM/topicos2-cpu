package org.acme.cpu.cliente.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Estado;

@ApplicationScoped
public class EstadoRepository implements PanacheRepository<Estado> {

    public Estado findBySigla(String sigla) {
        return find("sigla", sigla.toUpperCase()).firstResult();
    }
}