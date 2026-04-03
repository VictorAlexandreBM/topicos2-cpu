package org.acme.cpu.dto.socket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record SocketDTO(

        @Schema(
                description = "Tipo de socket técnico da tecnologia",
                example = "LGA 775",
                required = true
        )
        @NotBlank(message = "Este campo deve ser preenchido")
        @Size(max = 100, message = "Este campo não pode conter mais de 100 caracteres!")
        String tipo
) {}
