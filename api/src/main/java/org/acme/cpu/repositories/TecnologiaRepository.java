package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Tecnologia;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class TecnologiaRepository implements PanacheRepository<Tecnologia> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "nome", "descricao");

    public List<Tecnologia> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();
        String q = "ativo = :ativo";

        mapaParametros.put("ativo", ativo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND (LOWER(nome) LIKE LOWER(:pesquisa) OR LOWER(descricao) LIKE LOWER(:pesquisa))";
            String pesquisa = "%" + filtro + "%";
            mapaParametros.put("pesquisa", pesquisa);
        }

        Direction direcaoFinal = "desc".equalsIgnoreCase(direcao) ? Direction.Descending : Direction.Ascending;

        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao.toLowerCase()))
                ? campoOrdenacao.toLowerCase() : "id";

        Sort sort = Sort.by(campoOrdenacaoFinal, direcaoFinal);

        var panacheQuery = this.find(q, sort, mapaParametros);

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
