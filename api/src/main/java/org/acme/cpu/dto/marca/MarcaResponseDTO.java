package org.acme.cpu.dto.marca;

import org.acme.cpu.models.Marca;
import org.acme.cpu.models.Socket;

import java.time.LocalDateTime;

public record MarcaResponseDTO(
        Long id,
        String nome,
        Boolean ativo,
        LocalDateTime dataCriacao
) {
    public MarcaResponseDTO(Marca m) {
        this(m.getId(), m.getNome(), m.isAtivo(), m.getDataCriacao());
    }
}
