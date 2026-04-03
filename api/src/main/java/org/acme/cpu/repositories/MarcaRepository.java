package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Marca;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class MarcaRepository implements PanacheRepository<Marca> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "nome");

    private PanacheQuery<Marca> construirQueryListar(String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();
        String q = "ativo = :ativo";
        mapaParametros.put("ativo", ativo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND LOWER(nome) LIKE LOWER(:pesquisa)";
            mapaParametros.put("pesquisa", "%" + filtro + "%");
        }

        Direction direcaoFinal = "desc".equalsIgnoreCase(direcao) ? Direction.Descending : Direction.Ascending;
        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao.toLowerCase()))
                ? campoOrdenacao.toLowerCase() : "id";

        return this.find(q, Sort.by(campoOrdenacaoFinal, direcaoFinal), mapaParametros);
    }

    public List<Marca> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        PanacheQuery<Marca> query = construirQueryListar(filtro, ativo, campoOrdenacao, direcao);

        if (pagina == null || tamanho == null) {
            return query.list();
        }
        return query.page(pagina, tamanho).list();
    }

    public long countListar(String filtro, Boolean ativo) {
        return construirQueryListar(filtro, ativo, null, null).count();
    }

    public Marca buscarAtivaPorNome(String nome) {
        return this.find("nome = ?1 AND ativo = ?2", nome, true).firstResult();
    }
}