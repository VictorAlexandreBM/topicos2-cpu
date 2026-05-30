package org.acme.cpu.cliente.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Perfil {
    VISITANTE("Visitante", 'V'),
    CLIENTE("Cliente", 'C'),
    ADMINISTRADOR("Administrador", 'A');

    private final String tipo;
    private final char sigla;

    Perfil(String tipo, char sigla){
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

    public static Perfil fromTipo(String tipo) {
        for (Perfil p : Perfil.values()) {
            if (p.getTipo().equalsIgnoreCase(tipo)) {
                return p;
            }
        }

        throw new IllegalArgumentException("Perfil inválido: " + tipo);
    }

    @JsonCreator
    public static Perfil fromSigla(char sigla) {
        for (Perfil p : Perfil.values()) {
            if (p.getSigla() == sigla) {
                return p;
            }
        }
        throw new IllegalArgumentException("Sigla de perfil inválida: " + sigla);
    }
}
