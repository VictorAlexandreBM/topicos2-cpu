package org.acme.cpu.admin.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;
import org.acme.cpu.admin.dto.cpu.CpuBoxListDTO;
import org.acme.cpu.admin.dto.cpu.CpuListDTO;
import org.acme.cpu.admin.dto.cpu.CpuTrayListDTO;
import org.acme.cpu.admin.models.Cpu;
import org.acme.cpu.admin.models.CpuBox;
import org.acme.cpu.admin.models.CpuTray;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class CpuRepository implements PanacheRepository<Cpu> {

    public List<CpuListDTO> listarResumido(Integer pagina, Integer tamanho, String filtro, Boolean emVenda, String campoOrdenacao, String direcao) {
        StringBuilder q = new StringBuilder("""
                SELECT c FROM Cpu c
                JOIN FETCH c.modelo m
                JOIN FETCH m.marca ma
                WHERE c.emVenda = :emVenda
                """);

        Map<String, Object> params = new HashMap<>();
        params.put("emVenda", emVenda != null ? emVenda : true);

        if (filtro != null && !filtro.isBlank()) {
            q.append(" AND (LOWER(c.sku) LIKE LOWER(:pesquisa) OR LOWER(c.nomeComercial) LIKE LOWER(:pesquisa)) ");
            params.put("pesquisa", "%" + filtro + "%");
        }

        if (campoOrdenacao != null && !campoOrdenacao.isBlank()) {
            String dir = "desc".equalsIgnoreCase(direcao) ? "DESC" : "ASC";
            String orderField = switch (campoOrdenacao.toLowerCase()) {
                case "sku" -> "c.sku";
                case "preco" -> "c.preco";
                case "modelo" -> "m.nome";
                default -> "c.id";
            };
            q.append(" ORDER BY ").append(orderField).append(" ").append(dir);
        } else {
            q.append(" ORDER BY c.id ASC");
        }

        TypedQuery<Cpu> query = getEntityManager().createQuery(q.toString(), Cpu.class);

        for (Map.Entry<String, Object> param : params.entrySet()) {
            query.setParameter(param.getKey(), param.getValue());
        }

        if (pagina != null && tamanho != null) {
            query.setFirstResult(pagina * tamanho);
            query.setMaxResults(tamanho);
        }

        return query.getResultList().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<CpuListDTO> listarResumido(Boolean emVenda) {
        return listarResumido(null, null, null, emVenda, null, null);
    }

    public long countListar(String filtro, Boolean emVenda) {
        StringBuilder q = new StringBuilder("emVenda = :emVenda");
        Map<String, Object> params = new HashMap<>();
        params.put("emVenda", emVenda != null ? emVenda : true);

        if (filtro != null && !filtro.isBlank()) {
            q.append(" AND (LOWER(sku) LIKE LOWER(:pesquisa) OR LOWER(nomeComercial) LIKE LOWER(:pesquisa))");
            params.put("pesquisa", "%" + filtro + "%");
        }

        return this.find(q.toString(), params).count();
    }

    public Cpu findByIdWithDetails(Long id) {
        return find("""
            SELECT c FROM Cpu c 
            JOIN FETCH c.modelo m
            JOIN FETCH m.marca ma
            JOIN FETCH m.fichaTecnica
            JOIN FETCH m.clustersNucleo
            WHERE c.id = ?1
            """, id).firstResult();
    }

    private CpuListDTO mapToDto(Cpu c) {
        if (c instanceof CpuBox b) {
            return new CpuBoxListDTO(
                    b.getId(), b.getSku(), b.getPreco(), b.getEstoque(),
                    b.getModelo().getNome(), b.getNomeComercial(),
                    b.getModelo().getMarca().getNome(),
                    b.isEmVenda(), "BOX"
            );
        } else if (c instanceof CpuTray t) {
            return new CpuTrayListDTO(
                    t.getId(), t.getSku(), t.getPreco(), t.getEstoque(),
                    t.getModelo().getNome(), t.getNomeComercial(),
                    t.getModelo().getMarca().getNome(),
                    t.isEmVenda(), "TRAY"
            );
        }
        throw new IllegalStateException("Tipo de CPU desconhecido");
    }
}