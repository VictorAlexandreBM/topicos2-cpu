package org.acme.cpu.pedido.dtos.Pagamento;

import org.acme.cpu.pedido.dtos.cartao.CartaoResponseDTO;
import org.acme.cpu.pedido.models.PagamentoCredito;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

import java.math.BigDecimal;

public record PagamentoCreditoResponseDTO(
        Long id,
        String status,
        BigDecimal valor,
        String forma,

        CartaoResponseDTO cartao,
        Integer parcelas,
        BigDecimal jurosAplicados

) implements PagamentoResponseDTO {
    public PagamentoCreditoResponseDTO(PagamentoCredito p) {
        this(
                p.getId(),
                p.getStatusPagamento().getTipo(),
                p.getValor(),
                "Crédito",
                new CartaoResponseDTO(p.getCartao()),
                p.getParcelas(),
                p.getJurosAplicados()
        );
    }
}
