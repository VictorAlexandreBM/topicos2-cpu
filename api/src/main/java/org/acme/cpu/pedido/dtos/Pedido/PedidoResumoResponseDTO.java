package org.acme.cpu.pedido.dtos.Pedido;

import org.acme.cpu.pedido.dtos.Pagamento.PagamentoResponseDTO;
import org.acme.cpu.pedido.dtos.enderecoEntrega.EnderecoEntregaResponseDTO;
import org.acme.cpu.pedido.models.Pedido;
import org.acme.cpu.pedido.models.enums.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResumoResponseDTO(
        Long id,
        List<ItemPedidoResponseDTO> itens,
        String status,
        BigDecimal total,
        LocalDateTime dataCriacao
) {
    public PedidoResumoResponseDTO(Pedido p) {
        this(
                p.getId(),
                p.getItens().stream().map(ItemPedidoResponseDTO::new).toList(),
                p.getStatus().getTipo(),
                p.getTotal(),
                p.getDataCriacao()
        );
    }
}
