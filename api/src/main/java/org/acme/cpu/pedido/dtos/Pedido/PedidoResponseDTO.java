package org.acme.cpu.pedido.dtos.Pedido;

import org.acme.cpu.pedido.dtos.Pagamento.PagamentoResponseDTO;
import org.acme.cpu.pedido.dtos.enderecoEntrega.EnderecoEntregaResponseDTO;
import org.acme.cpu.pedido.models.Pedido;
import org.acme.cpu.pedido.models.enums.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponseDTO(
        Long id,
        EnderecoEntregaResponseDTO enderecoEntrega,
        List<ItemPedidoResponseDTO> itens,
        String status,
        BigDecimal total,
        PagamentoResponseDTO pagamento,
        LocalDateTime dataCriacao

) {
    public PedidoResponseDTO(Pedido p) {
        this(
                p.getId(),
                new EnderecoEntregaResponseDTO(p.getEnderecoEntrega()),
                p.getItens().stream().map(ItemPedidoResponseDTO::new).toList(),
                p.getStatus().getTipo(),
                p.getTotal(),
                PagamentoResponseDTO.fromEntity(p.getPagamento()),
                p.getDataCriacao()
        );
    }
}
