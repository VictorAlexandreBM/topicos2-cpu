package org.acme.cpu.admin.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;
import org.acme.cpu.admin.dto.cpu.CpuBoxListDTO;
import org.acme.cpu.admin.dto.cpu.CpuFilterDTO;
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

    public List<CpuListDTO> listarResumido(Integer pagina, Integer tamanho, CpuFilterDTO filtro, String campoOrdenacao, String direcao) {
        StringBuilder q = new StringBuilder("SELECT DISTINCT c FROM Cpu c ");
        q.append("JOIN FETCH c.modelo m ");
        q.append("JOIN FETCH m.marca ma ");

        // Aplica os JOINs extras apenas se necessário pelos filtros, sem FETCH para evitar problemas de paginação
        aplicarJoinsDinamicos(q, filtro);

        q.append("WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        aplicarCondicoesWhere(q, params, filtro);

        if (campoOrdenacao != null && !campoOrdenacao.isBlank()) {
            String dir = "desc".equalsIgnoreCase(direcao) ? "DESC" : "ASC";
            String orderField = switch (campoOrdenacao.toLowerCase()) {
                case "sku" -> "c.sku";
                case "preco" -> "c.preco";
                case "dataCriacao" -> "c.dataCriacao";
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

    public long countListar(CpuFilterDTO filtro) {
        StringBuilder q = new StringBuilder("SELECT COUNT(DISTINCT c) FROM Cpu c ");
        q.append("JOIN c.modelo m ");
        q.append("JOIN m.marca ma ");

        aplicarJoinsDinamicos(q, filtro);

        q.append("WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        aplicarCondicoesWhere(q, params, filtro);

        TypedQuery<Long> query = getEntityManager().createQuery(q.toString(), Long.class);
        for (Map.Entry<String, Object> param : params.entrySet()) {
            query.setParameter(param.getKey(), param.getValue());
        }

        return query.getSingleResult();
    }

    private void aplicarJoinsDinamicos(StringBuilder q, CpuFilterDTO filtro) {
        if (filtro == null) return;

        if (filtro.socketId() != null && !filtro.socketId().isEmpty()) {
            q.append("JOIN m.socket s ");
        }
        if (filtro.chipsetsId() != null && !filtro.chipsetsId().isEmpty()) {
            q.append("JOIN m.chipsets chip "); // Atenção: Ajuste nome se for chipsetsCompativeis
        }
        if (filtro.tecnologiasId() != null && !filtro.tecnologiasId().isEmpty()) {
            q.append("JOIN m.tecnologias tec ");
        }
        if (filtro.minCores() != null || filtro.maxCores() != null || filtro.minFreq() != null || filtro.maxFreq() != null || filtro.tdpBase() != null) {
            q.append("JOIN m.fichaTecnica ft ");
        }
    }

    private void aplicarCondicoesWhere(StringBuilder q, Map<String, Object> params, CpuFilterDTO filtro) {
        if (filtro == null) return;

        if (filtro.emVenda() != null) {
            q.append(" AND c.emVenda = :emVenda ");
            params.put("emVenda", filtro.emVenda());
        }
        if (filtro.marcaId() != null && !filtro.marcaId().isEmpty()) {
            q.append(" AND ma.id IN (:marcaId) ");
            params.put("marcaId", filtro.marcaId());
        }
        if (filtro.socketId() != null && !filtro.socketId().isEmpty()) {
            q.append(" AND s.id IN (:socketId) ");
            params.put("socketId", filtro.socketId());
        }
        if (filtro.chipsetsId() != null && !filtro.chipsetsId().isEmpty()) {
            q.append(" AND chip.id IN (:chipsetsId) ");
            params.put("chipsetsId", filtro.chipsetsId());
        }
        if (filtro.tecnologiasId() != null && !filtro.tecnologiasId().isEmpty()) {
            q.append(" AND tec.id IN (:tecnologiasId) ");
            params.put("tecnologiasId", filtro.tecnologiasId());
        }
        if (filtro.tipoCPU() != null && !filtro.tipoCPU().isBlank()) {
            if (filtro.tipoCPU().equalsIgnoreCase("BOX")) {
                q.append(" AND TYPE(c) = CpuBox ");
            } else if (filtro.tipoCPU().equalsIgnoreCase("TRAY")) {
                q.append(" AND TYPE(c) = CpuTray ");
            }
        }
        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            q.append(" AND LOWER(c.nomeComercial) LIKE LOWER(:nome) ");
            params.put("nome", "%" + filtro.nome() + "%");
        }
        if (filtro.nomeModelo() != null && !filtro.nomeModelo().isBlank()) {
            q.append(" AND LOWER(m.nome) LIKE LOWER(:nomeModelo) ");
            params.put("nomeModelo", "%" + filtro.nomeModelo() + "%");
        }
        if (filtro.minPreco() != null) {
            q.append(" AND c.preco >= :minPreco ");
            params.put("minPreco", filtro.minPreco());
        }
        if (filtro.maxPreco() != null) {
            q.append(" AND c.preco <= :maxPreco ");
            params.put("maxPreco", filtro.maxPreco());
        }

        if (filtro.minCores() != null) {
            q.append(" AND (SELECT SUM(cn.quantidadeNucleos) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn WHERE m_sub = m) >= :minCores ");
            params.put("minCores", filtro.minCores().longValue()); // SUM no JPA retorna Long
        }
        if (filtro.maxCores() != null) {
            q.append(" AND (SELECT SUM(cn.quantidadeNucleos) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn WHERE m_sub = m) <= :maxCores ");
            params.put("maxCores", filtro.maxCores().longValue());
        }

        if (filtro.minFreq() != null) {
            q.append(" AND (SELECT MIN(cn.frequenciaBase) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn WHERE m_sub = m) >= :minFreq ");
            params.put("minFreq", filtro.minFreq());
        }
        if (filtro.maxFreq() != null) {
            // A sua regra: freq máxima é a MAIOR freq máxima encontrada entre os clusters
            q.append(" AND (SELECT MAX(cn.frequenciaMaxima) FROM ModeloCpu m_sub JOIN m_sub.clustersNucleo cn WHERE m_sub = m) <= :maxFreq ");
            params.put("maxFreq", filtro.maxFreq());
        }
        if (filtro.tdpBase() != null) {
            q.append(" AND ft.tdp = :tdpBase ");
            params.put("tdpBase", filtro.tdpBase());
        }
    }

    public Cpu findByIdWithDetails(Long id) {
        return find("""
            SELECT c FROM Cpu c 
            JOIN FETCH c.modelo m
            JOIN FETCH m.marca ma
            JOIN FETCH m.fichaTecnica ft
            LEFT JOIN FETCH m.clustersNucleo cn
            WHERE c.id = ?1
            """, id).firstResult();
    }

    private CpuListDTO mapToDto(Cpu c) {
        if (c instanceof CpuBox b) {
            return new CpuBoxListDTO(
                    b.getId(), b.getSku(), b.getPreco(), b.getEstoque(),
                    b.getModelo().getNome(), b.getNomeComercial(),
                    b.getModelo().getMarca().getNome(),
                    b.isEmVenda(), b.getImagemUrl(),"BOX"
            );
        } else if (c instanceof CpuTray t) {
            return new CpuTrayListDTO(
                    t.getId(), t.getSku(), t.getPreco(), t.getEstoque(),
                    t.getModelo().getNome(), t.getNomeComercial(),
                    t.getModelo().getMarca().getNome(),
                    t.isEmVenda(), t.getImagemUrl(), "TRAY"
            );
        }
        throw new IllegalStateException("Tipo de CPU desconhecido");
    }
}