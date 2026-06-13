package org.acme.cpu.cliente.dtos.localizacao;

import org.acme.cpu.cliente.models.Cidade;

public record CidadeResponseDTO(Long id, String nome) {

    public CidadeResponseDTO(Cidade cidade) {
        this(cidade.getId(), cidade.getNome());
    }
}