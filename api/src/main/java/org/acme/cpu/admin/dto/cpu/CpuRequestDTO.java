package org.acme.cpu.admin.dto.cpu;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.math.BigDecimal;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CpuBoxRequestDTO.class, name = "BOX"),
        @JsonSubTypes.Type(value = CpuTrayRequestDTO.class, name = "TRAY")
})
public sealed interface CpuRequestDTO permits CpuBoxRequestDTO, CpuTrayRequestDTO {
    String sku();
    BigDecimal preco();
    Integer estoque();
    Long modeloId();
    String nomeComercial();
    boolean emVenda();
    String tipo();
}