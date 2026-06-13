package org.acme.cpu.pedido.dtos.cupom;

import org.acme.cpu.pedido.models.Cupom;
import org.acme.cpu.pedido.models.enums.TipoDesconto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CupomResponseDTO(
        Long id,
        String codigo,
        BigDecimal valor,
        TipoDesconto tipo,
        LocalDateTime dataValidade,
        boolean ativo,
        Integer limiteUsos,
        BigDecimal valorMinimoPedido
) {
    public CupomResponseDTO(Cupom c) {
        this(
                c.getId(), c.getCodigo(), c.getValor(), c.getTipo(),
                c.getDataValidade(), c.isAtivo(), c.getLimiteUsos(), c.getValorMinimoPedido()
        );
    }
}