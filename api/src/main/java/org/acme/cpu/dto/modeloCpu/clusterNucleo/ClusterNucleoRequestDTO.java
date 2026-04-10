package org.acme.cpu.dto.modeloCpu.clusterNucleo;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.acme.cpu.models.enums.TipoNucleo;

public record ClusterNucleoRequestDTO(

        @PositiveOrZero
        @NotNull
        Double frequenciaBase,

        @PositiveOrZero
        @NotNull
        Double frequenciaMaxima,

        @Positive
        @NotNull
        Integer quantidadeNucleos,

        @NotNull
        TipoNucleo tipoNucleo
) {
}
