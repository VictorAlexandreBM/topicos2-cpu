package org.acme.cpu.dto.socket;

import org.acme.cpu.models.Socket;
import org.acme.cpu.models.Tecnologia;

import java.time.LocalDateTime;

public record SocketResponseDTO(

        Long id,
        String tipo,
        Boolean ativo,
        LocalDateTime dataCriacao
) {
    public SocketResponseDTO(Socket s) {
        this(s.getId(), s.getTipo(), s.isAtivo(), s.getDataCriacao());
    }
}
