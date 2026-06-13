package org.acme.cpu.admin.dto.chipset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record ChipsetDTO(

        @Schema(
                description = "Tipo de chipset",
                example = "X670E",
                required = true
        )
        @NotBlank(message = "Este campo deve ser preenchido")
        @Size(max = 100, message = "Este campo não pode conter mais de 100 caracteres!")
        String tipo
) {}
