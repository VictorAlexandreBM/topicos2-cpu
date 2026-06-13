package org.acme.cpu.cliente.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Cidade;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CidadeRepository implements PanacheRepository<Cidade> {

    public List<Cidade> findByEstadoSigla(String sigla) {
        return list("estado.sigla = ?1 order by nome", sigla.toUpperCase());
    }

    public Optional<Cidade> findByNomeAndEstadoSigla(String nome, String sigla) {
        return find("nome = ?1 and estado.sigla = ?2", nome, sigla.toUpperCase()).firstResultOptional();
    }
}