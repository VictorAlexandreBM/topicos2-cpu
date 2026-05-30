package org.acme.cpu.pedido.models.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.acme.cpu.pedido.models.enums.StatusPedido;

@Converter(autoApply = true)
public class StatusPedidoConverter implements AttributeConverter<StatusPedido, Character> {

    @Override
    public Character convertToDatabaseColumn(StatusPedido statusPedido) {
        return (statusPedido == null) ? null : statusPedido.getSigla();
    }

    @Override
    public StatusPedido convertToEntityAttribute(Character i) {
        return (i == null) ? null : StatusPedido.fromSigla(i);
    }
}
