package org.acme.cpu.pedido.dtos.Pagamento;

import org.acme.cpu.pedido.dtos.cartao.CartaoResponseDTO;
import org.acme.cpu.pedido.models.PagamentoDebito;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

import java.math.BigDecimal;

public record PagamentoDebitoResponseDTO(
        Long id,
        String status,
        BigDecimal valor,
        String forma,

        CartaoResponseDTO cartao,
        Boolean autenticacao3DS
) implements PagamentoResponseDTO {
    public PagamentoDebitoResponseDTO(PagamentoDebito p) {
        this(
                p.getId(),
                p.getStatusPagamento().getTipo(),
                p.getValor(),
                "Débito",
                new CartaoResponseDTO(p.getCartao()),
                p.getAutenticacao3DS()
        );
    }
}
