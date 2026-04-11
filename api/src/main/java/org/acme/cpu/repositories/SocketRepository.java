package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.models.Socket;
import org.acme.cpu.models.Tecnologia;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class SocketRepository implements PanacheRepository<Socket> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "tipo");

    private PanacheQuery<Socket> construirQueryListar(String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();

        boolean filtrarAtivo = (ativo != null) ? ativo : true;
        
        String q = "ativo = :ativo";
        mapaParametros.put("ativo", filtrarAtivo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND LOWER(tipo) LIKE LOWER(:pesquisa)";
            mapaParametros.put("pesquisa", "%" + filtro + "%");
        }

        Direction direcaoFinal = "desc".equalsIgnoreCase(direcao) ? Direction.Descending : Direction.Ascending;
        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao.toLowerCase()))
                ? campoOrdenacao.toLowerCase() : "id";

        return this.find(q, Sort.by(campoOrdenacaoFinal, direcaoFinal), mapaParametros);
    }

    public List<Socket> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        PanacheQuery<Socket> query = construirQueryListar(filtro, ativo, campoOrdenacao, direcao);

        if (pagina == null || tamanho == null) {
            return query.list();
        }
        return query.page(pagina, tamanho).list();
    }


    public List<Socket> listar(Boolean ativo) {
        return listar(null, null, null, ativo, null, null);
    }

    public long countListar(String filtro, Boolean ativo) {
        return construirQueryListar(filtro, ativo, null, null).count();
    }

    public Socket buscarAtivaPorTipo(String tipo) {
        return this.find("tipo = ?1 AND ativo = ?2", tipo, true).firstResult();
    }

    public Socket findByIdAtivo(Long id) {
        return this.find("id = ?1 AND ativo = ?2", id, true).firstResult();
    }
}