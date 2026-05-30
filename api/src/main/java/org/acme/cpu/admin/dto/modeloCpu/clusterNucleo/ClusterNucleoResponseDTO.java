package org.acme.cpu.admin.dto.modeloCpu.clusterNucleo;

import org.acme.cpu.admin.models.ClusterNucleo;
import org.acme.cpu.admin.models.enums.TipoNucleo;

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
