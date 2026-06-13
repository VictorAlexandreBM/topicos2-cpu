package org.acme.cpu.pedido.models.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

@Converter(autoApply = true)
public class StatusPagamentoConverter implements AttributeConverter<StatusPagamento, Character> {

    @Override
    public Character convertToDatabaseColumn(StatusPagamento statusPagamento) {
        return (statusPagamento == null) ? null : statusPagamento.getSigla();
    }

    @Override
    public StatusPagamento convertToEntityAttribute(Character i) {
        return (i == null) ? null : StatusPagamento.fromSigla(i);
    }
}
