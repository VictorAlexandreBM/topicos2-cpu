package org.acme.cpu.admin.dto.cpu;

import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuDetailDTO;
import org.acme.cpu.admin.models.CpuBox;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CpuBoxDetailDTO(
        Long id, String sku, BigDecimal preco, Integer estoque,
        LocalDate dataInclusao, boolean emVenda, String nomeComercial,
        ModeloCpuDetailDTO modelo, Boolean incluiCooler, Double pesoEmbalagemGramas,
        String tipo
) implements CpuDetailDTO {
    public CpuBoxDetailDTO(CpuBox b) {
        this(b.getId(), b.getSku(), b.getPreco(), b.getEstoque(),
                b.getDataInclusao(), b.isEmVenda(), b.getNomeComercial(),
                new ModeloCpuDetailDTO(b.getModelo()), b.isIncluiCooler(), b.getPesoEmbalagemGramas(), "BOX");
    }
    @Override public String tipo() { return "BOX"; }
}