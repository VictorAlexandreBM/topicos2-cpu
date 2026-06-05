package org.acme.cpu.pedido.dtos.Pagamento;

import org.acme.cpu.pedido.models.Pagamento;
import org.acme.cpu.pedido.models.PagamentoCredito;
import org.acme.cpu.pedido.models.PagamentoDebito;
import org.acme.cpu.pedido.models.PagamentoPix;
import org.acme.cpu.pedido.models.enums.StatusPagamento;
import java.math.BigDecimal;

public sealed interface PagamentoResponseDTO permits PagamentoDebitoResponseDTO, PagamentoCreditoResponseDTO, PagamentoPixResponseDTO {
    Long id();
    String status();
    BigDecimal valor();
    String forma();

    static PagamentoResponseDTO fromEntity(Pagamento pagamento) {
        if (pagamento == null) {
            return null;
        }

        return switch (pagamento) {
            case PagamentoCredito c -> new PagamentoCreditoResponseDTO(c);
            case PagamentoDebito d -> new PagamentoDebitoResponseDTO(d);
            case PagamentoPix p -> new PagamentoPixResponseDTO(p);
            default -> throw new IllegalArgumentException("Tipo de pagamento desconhecido: " + pagamento.getClass());
        };
    }
}