package org.acme.cpu.admin.dto.tecnologia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record TecnologiaDTO(

        @Schema(
                description = "Nome comercial ou técnico da tecnologia",
                example = "Intel® Hyper-Threading",
                required = true
        )
        @NotBlank(message = "O nome da tecnologia deve ser preenchido")
        @Size(max = 100, message = "O nome da tecnologia não pode passar de 100 caracteres!")
        String nome,

        @Schema(
                description = "Breve explicação do que a tecnologia faz (Útil para tooltips no Front-end)",
                example = "Permite que cada núcleo físico execute dois threads simultaneamente, melhorando multitarefa."
        )
        @Size(max = 255, message = "A descrição da tecnologia não pode passar de 255 caracteres!")
        String descricao
) {}
