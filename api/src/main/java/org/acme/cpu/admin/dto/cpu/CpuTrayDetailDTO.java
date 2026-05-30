package org.acme.cpu.admin.dto.cpu;

import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.admin.models.CpuTray;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CpuTrayDetailDTO(
        Long id, String sku, BigDecimal preco, Integer estoque,
        LocalDate dataInclusao, boolean emVenda, String nomeComercial,
        ModeloCpuDetailDTO modelo, String loteFabricacao, String tipo
) implements CpuDetailDTO {
    public CpuTrayDetailDTO(CpuTray t) {
        this(t.getId(), t.getSku(), t.getPreco(), t.getEstoque(),
                t.getDataInclusao(), t.isEmVenda(), t.getNomeComercial(),
                new ModeloCpuDetailDTO(t.getModelo()), t.getLoteFabricacao(), "TRAY");
    }
    @Override public String tipo() { return "TRAY"; }
}