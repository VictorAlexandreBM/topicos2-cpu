package org.acme.cpu.pedido.repository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.pedido.models.Pedido;
import org.acme.cpu.pedido.models.enums.StatusPedido;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class PedidoRepository implements PanacheRepository<Pedido> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "dataCriacao", "total", "status");

    public List<Pedido> findByUsuario(Usuario usuario) {
        return find("usuario", usuario).list();
    }

    public PanacheQuery<Pedido> findBytxid(String txid) {
        return find("SELECT p FROM Pedido p, PagamentoPix pix WHERE p.pagamento = pix AND pix.txid = ?1", txid);
    }

    private PanacheQuery<Pedido> construirQueryListar(String filtro, StatusPedido status, LocalDate dataInicio, LocalDate dataFim, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();
        StringBuilder q = new StringBuilder("1=1");

        if (filtro != null && !filtro.isBlank()) {
            q.append(" AND (CAST(id AS string) LIKE :pesquisa OR LOWER(usuario.primeiroNome) LIKE LOWER(:pesquisa) OR LOWER(usuario.sobrenome) LIKE LOWER(:pesquisa) OR LOWER(usuario.email) LIKE LOWER(:pesquisa))");
            mapaParametros.put("pesquisa", "%" + filtro + "%");
        }

        if (status != null) {
            q.append(" AND status = :status");
            mapaParametros.put("status", status);
        }

        if (dataInicio != null) {
            q.append(" AND dataCriacao >= :dataInicio");
            mapaParametros.put("dataInicio", dataInicio.atStartOfDay());
        }

        if (dataFim != null) {
            q.append(" AND dataCriacao <= :dataFim");
            mapaParametros.put("dataFim", dataFim.atTime(23, 59, 59));
        }

        Direction direcaoFinal = "asc".equalsIgnoreCase(direcao) ? Direction.Ascending : Direction.Descending;
        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao))
                ? campoOrdenacao : "dataCriacao"; // Ordenação padrão: mais recentes primeiro

        return this.find(q.toString(), Sort.by(campoOrdenacaoFinal, direcaoFinal), mapaParametros);
    }

    public List<Pedido> listar(Integer pagina, Integer tamanho, String filtro, StatusPedido status, LocalDate dataInicio, LocalDate dataFim, String campoOrdenacao, String direcao) {
        PanacheQuery<Pedido> query = construirQueryListar(filtro, status, dataInicio, dataFim, campoOrdenacao, direcao);

        if (pagina == null || tamanho == null) {
            return query.list();
        }
        return query.page(pagina, tamanho).list();
    }

    public long countListar(String filtro, StatusPedido status, LocalDate dataInicio, LocalDate dataFim) {
        return construirQueryListar(filtro, status, dataInicio, dataFim, null, null).count();
    }
}