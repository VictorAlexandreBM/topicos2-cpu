package org.acme.cpu.admin.dto.modeloCpu;

public record ModeloCpuListDTO(
        Long id,
        String nome,
        String nomeMarca,
        String tipoSocket,
        Long quantNucleos,
        Double frequenciaMaxima,
        Boolean ativo
) { }