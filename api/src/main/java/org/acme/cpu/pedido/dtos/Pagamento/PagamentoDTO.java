package org.acme.cpu.pedido.dtos.Pagamento;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "forma"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PagamentoDebitoDTO.class, name = "DEBITO"),
        @JsonSubTypes.Type(value = PagamentoCreditoDTO.class, name = "CREDITO"),
        @JsonSubTypes.Type(value = PagamentoPixDTO.class, name = "PIX")
})
public sealed interface PagamentoDTO permits PagamentoDebitoDTO, PagamentoCreditoDTO, PagamentoPixDTO {
    String forma();
}
