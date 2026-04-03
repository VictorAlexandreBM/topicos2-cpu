package org.acme.cpu.dto.chipset;

import org.acme.cpu.models.Chipset;
import org.acme.cpu.models.Socket;

import java.time.LocalDateTime;

public record ChipsetResponseDTO(

        Long id,
        String tipo,
        Boolean ativo,
        LocalDateTime dataCriacao
) {
    public ChipsetResponseDTO(Chipset c) {
        this(c.getId(), c.getTipo(), c.isAtivo(), c.getDataCriacao());
    }
}
