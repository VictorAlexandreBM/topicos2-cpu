package org.acme.cpu.dto.tecnologia;

import org.acme.cpu.models.Tecnologia;

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
