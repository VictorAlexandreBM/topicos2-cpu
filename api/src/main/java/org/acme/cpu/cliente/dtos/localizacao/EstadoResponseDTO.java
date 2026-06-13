package org.acme.cpu.cliente.dtos.localizacao;

import org.acme.cpu.cliente.models.Estado;

public record EstadoResponseDTO(Long id, String sigla, String nome) {

    public EstadoResponseDTO(Estado estado) {
        this(estado.getId(), estado.getSigla(), estado.getNome());
    }
}