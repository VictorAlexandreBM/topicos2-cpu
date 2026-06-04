package org.acme.cpu.admin.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.admin.models.ModeloCpu;

import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ModeloCpuRepository implements PanacheRepository<ModeloCpu> {

    public List<ModeloCpuListDTO> listarResumido(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao) {
        StringBuilder q = new StringBuilder("""
                SELECT new org.acme.cpu.admin.dto.modeloCpu.ModeloCpuListDTO(
                    m.id,
                    m.nome,
                    ma.nome,
                    s.tipo,
                    SUM(cn.quantidadeNucleos),
                    MAX(cn.frequenciaMaxima),
                    m.ativo
                )
                FROM ModeloCpu m
                LEFT JOIN m.marca ma
                LEFT JOIN m.socket s
                LEFT JOIN m.clustersNucleo cn
                WHERE m.ativo = :ativo
                """);

        Map<String, Object> params = new HashMap<>();
        params.put("ativo", ativo != null ? ativo : true);

        if (filtro != null && !filtro.isBlank()) {
            q.append(" AND LOWER(m.nome) LIKE LOWER(:pesquisa) ");
            params.put("pesquisa", "%" + filtro + "%");
        }

        q.append(" GROUP BY m.id, m.nome, ma.nome, s.tipo, m.ativo ");

        if (campoOrdenacao != null && !campoOrdenacao.isBlank()) {
            String dir = "desc".equalsIgnoreCase(direcao) ? "DESC" : "ASC";
            String orderField = switch (campoOrdenacao.toLowerCase()) {
                case "nome" -> "m.nome";
                case "marca" -> "ma.nome";
                case "socket" -> "s.tipo";
                default -> "m.id";
            };
            q.append(" ORDER BY ").append(orderField).append(" ").append(dir);
        } else {
            q.append(" ORDER BY m.id ASC");
        }

        TypedQuery<ModeloCpuListDTO> query = getEntityManager().createQuery(q.toString(), ModeloCpuListDTO.class);

        for (Map.Entry<String, Object> param : params.entrySet()) {
            query.setParameter(param.getKey(), param.getValue());
        }

        if (pagina != null && tamanho != null) {
            query.setFirstResult(pagina * tamanho);
            query.setMaxResults(tamanho);
        }

        return query.getResultList();
    }

    public List<ModeloCpuListDTO> listarResumido(Boolean ativo) {
        return listarResumido(null, null, null, ativo, null, null);
    }

    public long countListar(String filtro, Boolean ativo) {
        StringBuilder q = new StringBuilder("ativo = :ativo");
        Map<String, Object> params = new HashMap<>();
        params.put("ativo", ativo != null ? ativo : true);

        if (filtro != null && !filtro.isBlank()) {
            q.append(" AND LOWER(nome) LIKE LOWER(:pesquisa)");
            params.put("pesquisa", "%" + filtro + "%");
        }

        return this.find(q.toString(), params).count();
    }

    public ModeloCpu findByIdWithDetails(Long id) {
        return find("""
            SELECT m FROM ModeloCpu m 
            LEFT JOIN FETCH m.marca 
            LEFT JOIN FETCH m.socket 
            LEFT JOIN FETCH m.fichaTecnica 
            LEFT JOIN FETCH m.chipsets 
            LEFT JOIN FETCH m.tecnologias 
            LEFT JOIN FETCH m.clustersNucleo 
            WHERE m.id = ?1
            """, id).firstResult();
    }
}