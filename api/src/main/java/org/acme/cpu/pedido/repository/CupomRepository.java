package org.acme.cpu.pedido.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.pedido.models.Cupom;

import io.quarkus.panache.common.Sort;
import java.util.List;

@ApplicationScoped
public class CupomRepository implements PanacheRepository<Cupom> {

    public Cupom findByCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) return null;
        return find("UPPER(codigo)", codigo.trim().toUpperCase()).firstResult();
    }

    public List<Cupom> listarTodos() {
        return listAll(Sort.by("dataValidade").descending());
    }
}