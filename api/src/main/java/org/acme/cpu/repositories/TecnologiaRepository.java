package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import org.acme.cpu.models.Tecnologia;

import java.util.List;
import java.util.Set;

@ApplicationScoped
public class TecnologiaRepository implements PanacheRepository<Tecnologia> {
    public List<Tecnologia> listar() {
        return this.listAll();
    }
}
