package org.acme.cpu.core.dtos.respostaPaginada;

import java.util.List;

public record   RespostaPaginadaDTO<T>(
        List<T> dados,
        Long total
) {}
