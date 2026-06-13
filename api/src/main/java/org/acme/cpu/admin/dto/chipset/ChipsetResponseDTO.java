package org.acme.cpu.admin.dto.chipset;

import org.acme.cpu.admin.models.Chipset;

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
