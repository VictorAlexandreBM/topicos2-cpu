package org.acme.cpu.admin.dto.cpu;

import java.math.BigDecimal;

public record CpuBoxListDTO(
        Long id,
        String sku,
        BigDecimal preco,
        Integer estoque,
        String nomeModelo,
        String nomeComercial,
        String marca,
        Boolean emVenda,
        String tipo

) implements CpuListDTO {
    @Override
    public String tipo() {
        return "BOX";
    }
}