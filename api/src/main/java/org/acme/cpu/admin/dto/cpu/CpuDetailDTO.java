package org.acme.cpu.admin.dto.cpu;

import org.acme.cpu.admin.dto.modeloCpu.ModeloCpuDetailDTO;
import java.math.BigDecimal;
import java.time.LocalDate;

public sealed interface CpuDetailDTO permits CpuBoxDetailDTO, CpuTrayDetailDTO {
    Long id();
    String sku();
    BigDecimal preco();
    Integer estoque();
    LocalDate dataInclusao();
    boolean emVenda();
    String nomeComercial();
    ModeloCpuDetailDTO modelo();
    String tipo();
}