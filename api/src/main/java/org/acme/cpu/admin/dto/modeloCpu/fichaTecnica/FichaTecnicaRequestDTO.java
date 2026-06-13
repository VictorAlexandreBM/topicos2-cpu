package org.acme.cpu.admin.dto.modeloCpu.fichaTecnica;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record FichaTecnicaRequestDTO(

        @Size(max = 1000)
        String descricaoComercial,

        @PositiveOrZero
        Integer tdpBaseW,

        @PositiveOrZero
        Double cacheL2MB,

        @PositiveOrZero
        Double cacheL3MB
) {
}
