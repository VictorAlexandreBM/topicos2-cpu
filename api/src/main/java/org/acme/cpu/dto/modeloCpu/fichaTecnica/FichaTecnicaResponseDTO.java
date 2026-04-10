package org.acme.cpu.dto.modeloCpu.fichaTecnica;

import org.acme.cpu.models.FichaTecnica;

public record FichaTecnicaResponseDTO(
        String descricaoComercial,
        Integer tdpBaseW,
        Double cacheL2MB,
        Double cacheL3MB
) {
    public FichaTecnicaResponseDTO(FichaTecnica f) {
        this(
            f != null ? f.getDescricaoComercial() : null,
            f != null ? f.getTdpBaseW() : null,
            f != null ? f.getCacheL2MB() : null,
            f != null ? f.getCacheL3MB() : null
        );
    }
}
