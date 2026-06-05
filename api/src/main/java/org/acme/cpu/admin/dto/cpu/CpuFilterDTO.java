package org.acme.cpu.admin.dto.cpu;

import org.jboss.resteasy.reactive.RestQuery;
import java.math.BigDecimal;
import java.util.List;

public record CpuFilterDTO(
        @RestQuery("marcaId") List<Long> marcaId,
        @RestQuery("socketId") List<Long> socketId,
        @RestQuery("chipsetsId") List<Long> chipsetsId,
        @RestQuery("tecnologiasId") List<Long> tecnologiasId,
        @RestQuery("tipoCPU") String tipoCPU,
        @RestQuery("ordenacao") String ordenacao,
        @RestQuery("nome") String nome,
        @RestQuery("nomeModelo") String nomeModelo,
        @RestQuery("minPreco") BigDecimal minPreco,
        @RestQuery("maxPreco") BigDecimal maxPreco,
        @RestQuery("minCores") Integer minCores,
        @RestQuery("maxCores") Integer maxCores,
        @RestQuery("minFreq") Double minFreq,
        @RestQuery("maxFreq") Double maxFreq,
        @RestQuery("tdpBase") Integer tdpBase,
        @RestQuery("emVenda") Boolean emVenda
) {}