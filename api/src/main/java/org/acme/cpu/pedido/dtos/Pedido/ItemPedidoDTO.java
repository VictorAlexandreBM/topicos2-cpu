package org.acme.cpu.pedido.dtos.Pedido;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record ItemPedidoDTO(
        @NotNull
        @Positive
        Long cpuId,

        @NotNull
        @Positive
        Integer quantidade
) {
}
