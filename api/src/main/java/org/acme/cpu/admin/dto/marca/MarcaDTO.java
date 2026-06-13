package org.acme.cpu.admin.dto.marca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record MarcaDTO(

        @Schema(
                description = "Nome da marca",
                example = "Intel",
                required = true
        )
        @NotBlank(message = "Este campo deve ser preenchido")
        @Size(max = 100, message = "Este campo não pode conter mais de 100 caracteres!")
        String nome
) {}
