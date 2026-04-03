package org.acme.cpu.dto.Tecnologia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.acme.cpu.models.Tecnologia;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TecnologiaResponseDTO(

        Long id,
        String nome,
        String descricao,
        Boolean ativo,
        LocalDateTime dataCriacao
) {
    public TecnologiaResponseDTO(Tecnologia t) {
        this(t.getId(), t.getNome(), t.getDescricao(), t.isAtivo(), t.getDataCriacao());
    }
}
