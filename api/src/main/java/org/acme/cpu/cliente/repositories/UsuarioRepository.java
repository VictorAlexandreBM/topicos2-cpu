package org.acme.cpu.cliente.repositories;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import io.quarkus.panache.common.Sort.Direction;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.cliente.models.Usuario;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of("id", "primeiroNome", "sobrenome", "email", "perfil");

    public Usuario findByLogin(String login) {
        return find("email", login).firstResult();
    }

    public Usuario findByRefreshToken(String refreshToken) {
        return find("refreshToken = ?1", refreshToken).firstResult();
    }

    private PanacheQuery<Usuario> construirQueryListar(String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        Map<String, Object> mapaParametros = new HashMap<>();

        boolean filtrarAtivo = (ativo != null) ? ativo : true;

        String q = "ativo = :ativo";
        mapaParametros.put("ativo", filtrarAtivo);

        if (filtro != null && !filtro.isBlank()) {
            q += " AND (LOWER(primeiroNome) LIKE LOWER(:pesquisa) OR LOWER(sobrenome) LIKE LOWER(:pesquisa) OR LOWER(email) LIKE LOWER(:pesquisa))";
            mapaParametros.put("pesquisa", "%" + filtro + "%");
        }

        Direction direcaoFinal = "desc".equalsIgnoreCase(direcao) ? Direction.Descending : Direction.Ascending;
        String campoOrdenacaoFinal = (campoOrdenacao != null && CAMPOS_ORDENAVEIS.contains(campoOrdenacao))
                ? campoOrdenacao : "id";

        return this.find(q, Sort.by(campoOrdenacaoFinal, direcaoFinal), mapaParametros);
    }

    public List<Usuario> listar(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        PanacheQuery<Usuario> query = construirQueryListar(filtro, ativo, campoOrdenacao, direcao);

        if (pagina == null || tamanho == null) {
            return query.list();
        }
        return query.page(pagina, tamanho).list();
    }

    public long countListar(String filtro, Boolean ativo) {
        return construirQueryListar(filtro, ativo, null, null).count();
    }
}