package org.acme.cpu.dto.modeloCpu;

import org.acme.cpu.models.ModeloCpu;

public record ModeloCpuListDTO(
        Long id,
        String nome,
        String nomeMarca,
        String tipoSocket,
        Long quantNucleos,
        Double frequenciaMaxima,
        Boolean ativo
) { }