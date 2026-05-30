package org.acme.cpu.admin.dto.socket;

import org.acme.cpu.admin.models.Socket;

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
