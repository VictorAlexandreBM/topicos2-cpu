package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Tecnologia;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class TecnologiaRepository implements PanacheRepository<Tecnologia> {
    public List<Tecnologia> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo) {
        Map<String, Object> mapaParametros = new HashMap<>();
        String q = "ativo = :ativo";

        mapaParametros.put("ativo", ativo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND (LOWER(nome) LIKE LOWER(:pesquisa) OR LOWER(descricao) LIKE LOWER(:pesquisa))";
            String pesquisa = "%" + filtro + "%";
            mapaParametros.put("pesquisa", pesquisa);
        }

        var panacheQuery = this.find(q, mapaParametros);

        if (pagina == null || tamanho == null) return panacheQuery.list();

        return panacheQuery.page(pagina, tamanho).list();
    }

    public long countListar(String filtro, Boolean ativo) {
        Map<String, Object> mapaParametros = new HashMap<>();
        String q = "ativo = :ativo";

        mapaParametros.put("ativo", ativo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND (LOWER(nome) LIKE LOWER(:pesquisa) OR LOWER(descricao) LIKE LOWER(:pesquisa))";
            String pesquisa = "%" + filtro + "%";
            mapaParametros.put("pesquisa", pesquisa);
        }

        return this.count(q, mapaParametros);
    }

    public Tecnologia buscarAtivaPorNome(String nome) {
        return this.find("nome = ?1 AND ativo = ?2", nome, true).firstResult();
    }
}
