package org.acme.cpu.admin.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuFilterDTO;
import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.admin.models.ModeloCpu;

import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ModeloCpuRepository implements PanacheRepository<ModeloCpu> {

    public List<ModeloCpuListDTO> listarResumido(Integer pagina, Integer tamanho, ModeloCpuFilterDTO filtro, String campoOrdenacao, String direcao) {
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
                WHERE 1=1
                """);

        Map<String, Object> params = new HashMap<>();

        aplicarCondicoesWhere(q, params, filtro);

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

    public long countListar(ModeloCpuFilterDTO filtro) {
        StringBuilder q = new StringBuilder("SELECT COUNT(DISTINCT m) FROM ModeloCpu m LEFT JOIN m.marca ma LEFT JOIN m.socket s WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        aplicarCondicoesWhere(q, params, filtro);

        TypedQuery<Long> query = getEntityManager().createQuery(q.toString(), Long.class);
        for (Map.Entry<String, Object> param : params.entrySet()) {
            query.setParameter(param.getKey(), param.getValue());
        }

        return query.getSingleResult();
    }

    private void aplicarCondicoesWhere(StringBuilder q, Map<String, Object> params, ModeloCpuFilterDTO filtro) {
        if (filtro == null) return;

        if (filtro.ativo() != null) {
            q.append(" AND m.ativo = :ativo ");
            params.put("ativo", filtro.ativo());
        }
        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            q.append(" AND LOWER(m.nome) LIKE LOWER(:nome) ");
            params.put("nome", "%" + filtro.nome() + "%");
        }
        if (filtro.marcaId() != null && !filtro.marcaId().isEmpty()) {
            q.append(" AND ma.id IN (:marcaId) ");
            params.put("marcaId", filtro.marcaId());
        }
        if (filtro.socketId() != null && !filtro.socketId().isEmpty()) {
            q.append(" AND s.id IN (:socketId) ");
            params.put("socketId", filtro.socketId());
        }

        if (filtro.minCores() != null) {
            q.append(" AND (SELECT SUM(cn_sub.quantidadeNucleos) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn_sub WHERE m_sub = m) >= :minCores ");
            params.put("minCores", filtro.minCores().longValue());
        }
        if (filtro.maxCores() != null) {
            q.append(" AND (SELECT SUM(cn_sub.quantidadeNucleos) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn_sub WHERE m_sub = m) <= :maxCores ");
            params.put("maxCores", filtro.maxCores().longValue());
        }
        if (filtro.minFreq() != null) {
            q.append(" AND (SELECT MIN(cn_sub.frequenciaBase) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn_sub WHERE m_sub = m) >= :minFreq ");
            params.put("minFreq", filtro.minFreq());
        }
        if (filtro.maxFreq() != null) {
            q.append(" AND (SELECT MAX(cn_sub.frequenciaMaxima) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn_sub WHERE m_sub = m) <= :maxFreq ");
            params.put("maxFreq", filtro.maxFreq());
        }
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