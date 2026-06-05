package org.acme.cpu.admin.dto.cpu;

import java.math.BigDecimal;

public sealed interface CpuListDTO permits CpuTrayListDTO, CpuBoxListDTO {
    Long id();
    String sku();
    BigDecimal preco();
    Integer estoque();
    String nomeModelo();
    String nomeComercial();
    String marca();
    String tipo();
    String imagemUrl();
    Boolean emVenda();
}

