package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Tecnologia;

import java.util.List;

@ApplicationScoped
public class TecnologiaRepository implements PanacheRepository<Tecnologia> {
    public List<Tecnologia> listar(Integer pagina, Integer tamanho, Boolean ativo) {
        if (pagina == null || tamanho == null) return this.find("ativo = ?1", ativo).list();

        Log.info("pagina: " + pagina + " tamanho: " + tamanho);
        return this.find("ativo = ?1", ativo).page(pagina, tamanho).list();
    }
}
