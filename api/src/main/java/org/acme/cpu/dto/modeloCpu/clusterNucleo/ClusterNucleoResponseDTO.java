package org.acme.cpu.dto.modeloCpu.clusterNucleo;

import org.acme.cpu.models.ClusterNucleo;
import org.acme.cpu.models.enums.TipoNucleo;

public record ClusterNucleoResponseDTO(
        Double frequenciaBase,
        Double frequenciaMaxima,
        Integer quantidadeNucleos,
        TipoNucleo tipoNucleo
) {
    public ClusterNucleoResponseDTO(ClusterNucleo c) {
        this(
            c != null ? c.getFrequenciaBase() : null,
            c != null ? c.getFrequenciaMaxima() : null,
            c != null ? c.getQuantidadeNucleos() : null,
            c != null ? c.getTipoNucleo() : null
        );
    }
}
