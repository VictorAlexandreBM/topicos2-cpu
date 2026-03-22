package org.acme.cpu.models.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TipoNucleo {
    PERFORMANCE("Performance", 'P'),
    EFICIENCIA("Eficiência", 'E');

    private final String tipo;
    private final char sigla;

    TipoNucleo(String tipo, char sigla){
        this.tipo = tipo;
        this.sigla = sigla;
    }

    @JsonProperty("sigla")
    public char getSigla() {
        return sigla;
    }

    @JsonProperty("tipo")
    public String getNome() {
        return tipo;
    }

    public static TipoNucleo fromTipo(String tipo) {
        for (TipoNucleo n : TipoNucleo.values()) {
            if (n.getNome().equalsIgnoreCase(tipo)) {
                return n;
            }
        }

        throw new IllegalArgumentException("Tipo de Núcleo inválido: " + tipo);
    }

    public static TipoNucleo fromSigla(char sigla) {
        for (TipoNucleo n : TipoNucleo.values()) {
            if (n.getSigla() == sigla) {
                return n;
            }
        }
        throw new IllegalArgumentException("Sigla de Núcleo inválida: " + sigla);
    }
}
