package org.acme.cpu.pedido.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.pedido.models.ItemPedido;

@ApplicationScoped
public class ItemPedidoRepository implements PanacheRepository<ItemPedido>  { }
