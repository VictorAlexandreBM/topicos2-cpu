package org.acme.cpu.cliente.dtos.cartao;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CartaoDTO(
        @NotBlank(message = "O token do gateway é obrigatório.")
        String gatewayToken,

        @NotBlank(message = "Os últimos 4 dígitos são obrigatórios.")
        @Pattern(regexp = "\\d{4}", message = "Deve conter exatamente 4 dígitos numéricos.")
        String ultimos4,

        @NotBlank(message = "A bandeira é obrigatória.")
        String bandeira,

        @NotNull(message = "O mês de expiração é obrigatório.")
        @Min(value = 1, message = "Mês inválido.")
        @Max(value = 12, message = "Mês inválido.")
        Integer mesExpiracao,

        @NotNull(message = "O ano de expiração é obrigatório.")
        Integer anoExpiracao,

        @NotBlank(message = "O titular é obrigatório.")
        String titular
) {
}