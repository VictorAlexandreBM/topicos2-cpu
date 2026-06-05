package org.acme.cpu.cliente.repositories;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.pedido.models.Cartao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class CartaoRepository implements PanacheRepository<Cartao> {
}
