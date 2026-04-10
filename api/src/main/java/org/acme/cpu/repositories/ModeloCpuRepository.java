package org.acme.cpu.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.dto.modeloCpu.ModeloCpuListDTO;
import org.acme.cpu.models.ModeloCpu;

import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ModeloCpuRepository implements PanacheRepository<ModeloCpu> {
    public List<ModeloCpuListDTO> listarResumido(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao){
        String q = """
                SELECT new org.acme.cpu.dto.modeloCpu.ModeloCpuListDTO(
                    m.id,
                    m.nome,
                    m.marca.nome,
                    m.socket.tipo,
                    SUM(cn.quantidadeNucleos),
                    MAX(cn.frequenciaMaxima),
                    m.ativo
                )
                FROM ModeloCpu m
                LEFT JOIN m.clustersNucleo cn
                WHERE m.ativo = :ativo
                GROUP BY m.id, m.nome, m.marca.nome, m.socket.tipo, m.ativo
                """;

        return getEntityManager()
                .createQuery(q, ModeloCpuListDTO.class)
                .setParameter("ativo", ativo)
                .getResultList();

    }

    public long countListar(String filtro, Boolean ativo) {
        String q = "ativo = :ativo";

        return this.find(q, Map.of("ativo", ativo)).count();
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
