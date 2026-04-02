package org.acme.cpu.dto.respostaPaginada;

import java.util.Collection;
import java.util.List;

public record   RespostaPaginadaDTO<T>(
        List<T> dados,
        Long total
) {}
