package org.acme.cpu.pedido.dtos.Pagamento;

import jakarta.validation.constraints.NotNull;

public record PagamentoDebitoDTO(
        @NotNull
        Long cartaoId,
        String forma
) implements PagamentoDTO {
}
