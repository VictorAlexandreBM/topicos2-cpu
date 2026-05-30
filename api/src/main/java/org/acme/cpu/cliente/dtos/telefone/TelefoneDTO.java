package org.acme.cpu.cliente.dtos.telefone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Dados de contato telefônico")
public record TelefoneDTO(

        @Schema(
                description = "Número do telefone (apenas dígitos). Aceita celular (9 dígitos) ou fixo (8 dígitos).",
                example = "984961810",
                pattern = "^\\d{8,9}$",
                required = true
        )
        @NotBlank(message = "O número é obrigatório")
        @Pattern(regexp = "^\\d{8,9}$", message = "O número deve conter 8 ou 9 dígitos numéricos")
        String numero,

        Boolean principal

) {}