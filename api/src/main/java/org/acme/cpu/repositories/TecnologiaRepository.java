package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Marca;
import org.acme.cpu.models.Tecnologia;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class TecnologiaRepository implements PanacheRepository<Tecnologia> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "nome", "descricao");

    private PanacheQuery<Tecnologia> construirQueryListar(String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();

        boolean filtrarAtivo = (ativo != null) ? ativo : true;
        
        String q = "ativo = :ativo";
        mapaParametros.put("ativo", filtrarAtivo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND (LOWER(nome) LIKE LOWER(:pesquisa) OR LOWER(descricao) LIKE LOWER(:pesquisa))";
            mapaParametros.put("pesquisa", "%" + filtro + "%");
        }

        Direction direcaoFinal = "desc".equalsIgnoreCase(direcao) ? Direction.Descending : Direction.Ascending;
        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao.toLowerCase()))
                ? campoOrdenacao.toLowerCase() : "id";

        return this.find(q, Sort.by(campoOrdenacaoFinal, direcaoFinal), mapaParametros);
    }

    public List<Tecnologia> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        PanacheQuery<Tecnologia> query = construirQueryListar(filtro, ativo, campoOrdenacao, direcao);

        if (pagina == null || tamanho == null) {
            return query.list();
        }
        return query.page(pagina, tamanho).list();
    }

    public List<Tecnologia> listar(Boolean ativo) {
        return listar(null, null, null, ativo, null, null);
    }

    public long countListar(String filtro, Boolean ativo) {
        return construirQueryListar(filtro, ativo, null, null).count();
    }

    public Tecnologia buscarAtivaPorNome(String nome) {
        return this.find("nome = ?1 AND ativo = ?2", nome, true).firstResult();
    }
}
