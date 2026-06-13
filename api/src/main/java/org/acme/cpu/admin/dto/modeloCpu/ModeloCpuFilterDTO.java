package org.acme.cpu.admin.dto.modeloCpu;

import org.jboss.resteasy.reactive.RestQuery;
import java.util.List;

public record ModeloCpuFilterDTO(
        @RestQuery String nome,
        @RestQuery List<Long> marcaId,
        @RestQuery List<Long> socketId,
        @RestQuery Integer minCores,
        @RestQuery Integer maxCores,
        @RestQuery Double minFreq,
        @RestQuery Double maxFreq,
        @RestQuery Boolean ativo
) {
}