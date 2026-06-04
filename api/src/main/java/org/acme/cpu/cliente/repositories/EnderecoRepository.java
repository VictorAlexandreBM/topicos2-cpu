package org.acme.cpu.cliente.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Endereco;

@ApplicationScoped
public class EnderecoRepository implements PanacheRepository<Endereco> {
}