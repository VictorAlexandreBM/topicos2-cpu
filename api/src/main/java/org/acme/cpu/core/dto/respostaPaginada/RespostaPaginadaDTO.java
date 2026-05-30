package org.acme.cpu.core.dto.respostaPaginada;

import java.util.Collection;
import java.util.List;

public record   RespostaPaginadaDTO<T>(
        List<T> dados,
        Long total
) {}
