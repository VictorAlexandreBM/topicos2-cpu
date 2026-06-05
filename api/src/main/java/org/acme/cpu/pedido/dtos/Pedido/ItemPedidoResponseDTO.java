package org.acme.cpu.pedido.dtos.Pedido;

import org.acme.cpu.pedido.models.ItemPedido;

import java.math.BigDecimal;

public record ItemPedidoResponseDTO(
        Long id,
        Long cpuId,
        Integer quantidade,
        BigDecimal precoUnitario
) {
    public ItemPedidoResponseDTO(ItemPedido item) {
        this(
                item.getId(),
                item.getCpu().getId(),
                item.getQuantidade(),
                item.getPrecoUnitario()
        );
    }
}
