package org.acme.cpu.pedido.dtos.cupom;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.acme.cpu.pedido.models.enums.TipoDesconto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CupomRequestDTO(
        @NotBlank String codigo,
        @NotNull @Positive BigDecimal valor,
        @NotNull TipoDesconto tipo,
        @NotNull LocalDateTime dataValidade,
        @NotNull Boolean ativo,
        @Positive Integer limiteUsos,
        @Positive BigDecimal valorMinimoPedido
) {}