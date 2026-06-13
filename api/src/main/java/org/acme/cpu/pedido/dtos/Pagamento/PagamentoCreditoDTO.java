package org.acme.cpu.pedido.dtos.Pagamento;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.acme.cpu.pedido.dtos.cartao.CartaoDTO;

public record PagamentoCreditoDTO(
        String forma,
        @NotNull
        Long cartaoId,

        @NotNull @Min(1) Integer parcelas
) implements PagamentoDTO {
}
