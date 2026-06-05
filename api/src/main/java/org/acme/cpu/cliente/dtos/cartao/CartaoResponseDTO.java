package org.acme.cpu.cliente.dtos.cartao;

import org.acme.cpu.pedido.models.Cartao;

public record CartaoResponseDTO(
        Long id,
        String ultimos4,
        String bandeira,
        Integer mesExpiracao,
        Integer anoExpiracao,
        String titular
) {
    public CartaoResponseDTO(Cartao c) {
        this(
                c.getId(),
                c.getUltimos4(),
                c.getBandeira(),
                c.getMesExpiracao(),
                c.getAnoExpiracao(),
                c.getTitular()
        );
    }
}