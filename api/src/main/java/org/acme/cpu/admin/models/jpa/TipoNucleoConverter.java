package org.acme.cpu.admin.models.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.acme.cpu.admin.models.enums.TipoNucleo;

@Converter(autoApply = true)
public class TipoNucleoConverter implements AttributeConverter<TipoNucleo, Character> {

    @Override
    public Character convertToDatabaseColumn(TipoNucleo tipoNucleo) {
        return (tipoNucleo == null) ? null : tipoNucleo.getSigla();
    }

    @Override
    public TipoNucleo convertToEntityAttribute(Character i) {
        return (i == null) ? null : TipoNucleo.fromSigla(i);
    }
}
