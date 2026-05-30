package org.acme.cpu.cliente.models.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.acme.cpu.cliente.models.enums.Perfil;

@Converter(autoApply = true)
public class PerfilConverter implements AttributeConverter<Perfil, Character> {

    @Override
    public Character convertToDatabaseColumn(Perfil perfil) {
        return (perfil == null) ? null : perfil.getSigla();
    }

    @Override
    public Perfil convertToEntityAttribute(Character i) {
        return (i == null) ? null : Perfil.fromSigla(i);
    }
}
