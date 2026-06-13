package org.acme.cpu.pedido.dtos.Pedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoDTO;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoResponseDTO;

import java.util.List;

public record PedidoDTO(
        @NotNull
        @Positive
        Long enderecoId,

        @NotNull
        @Valid
        PagamentoDTO pagamento,

        @NotNull
        @Valid
        List<ItemPedidoDTO> itens,

        String codigoCupom
) {
}
