package org.acme.cpu.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum TipoNucleo {
    PERFORMANCE("Performance", 'P'),
    EFICIENCIA("Eficiência", 'E');

    private final String tipo;
    private final char sigla;

    TipoNucleo(String tipo, char sigla){
        this.tipo = tipo;
        this.sigla = sigla;
    }

    @JsonValue
    public char getSigla() {
        return sigla;
    }

    public String getTipo() {
        return tipo;
    }

    public static TipoNucleo fromTipo(String tipo) {
        for (TipoNucleo n : TipoNucleo.values()) {
            if (n.getTipo().equalsIgnoreCase(tipo)) {
                return n;
            }
        }

        throw new IllegalArgumentException("Tipo de Núcleo inválido: " + tipo);
    }

    @JsonCreator
    public static TipoNucleo fromSigla(char sigla) {
        for (TipoNucleo n : TipoNucleo.values()) {
            if (n.getSigla() == sigla) {
                return n;
            }
        }
        throw new IllegalArgumentException("Sigla de Núcleo inválida: " + sigla);
    }
}
