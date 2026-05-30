package org.acme.cpu.pedido.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum StatusPagamento {
    EM_AGUARDO("Em Aguardo", 'A'),
    PAGO("Pago", 'P'),
    CANCELADO("Cancelado", 'C'),
    ESTORNADO("Estornado", 'E');

    private final String tipo;
    private final char sigla;

    StatusPagamento(String tipo, char sigla){
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

    public static StatusPagamento fromTipo(String tipo) {
        for (StatusPagamento p : StatusPagamento.values()) {
            if (p.getTipo().equalsIgnoreCase(tipo)) {
                return p;
            }
        }

        throw new IllegalArgumentException("Status de pagamento inválido: " + tipo);
    }

    @JsonCreator
    public static StatusPagamento fromSigla(char sigla) {
        for (StatusPagamento p : StatusPagamento.values()) {
            if (p.getSigla() == sigla) {
                return p;
            }
        }
        throw new IllegalArgumentException("Sigla de status de pagamento inválida: " + sigla);
    }
}
