package org.acme.cpu.pedido.dtos.Pagamento;

import org.acme.cpu.pedido.models.PagamentoPix;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

import java.math.BigDecimal;

public record PagamentoPixResponseDTO(
        Long id,
        String status,
        BigDecimal valor,
        String forma,

        String codigoCopiaECola

) implements PagamentoResponseDTO {
    public PagamentoPixResponseDTO(PagamentoPix p) {
        this(
                p.getId(),
                p.getStatusPagamento().getTipo(),
                p.getValor(),
                "Pix",
                p.getCodigoCopiaECola()
        );
    }
}
