package org.acme.cpu.pedido.dtos.cartao;

import org.acme.cpu.pedido.models.Cartao;

public record CartaoResponseDTO(
        Long id,
        String ultimos4,
        String bandeira,
        Integer mesExpiracao,
        Integer anoExpiracao,
        Boolean ativo,
        String titular
) {
    public CartaoResponseDTO(Cartao c) {
        this(
                c.getId(),
                c.getUltimos4(),
                c.getBandeira(),
                c.getMesExpiracao(),
                c.getAnoExpiracao(),
                c.getAtivo(),
                c.getTitular()
        );
    }
}
