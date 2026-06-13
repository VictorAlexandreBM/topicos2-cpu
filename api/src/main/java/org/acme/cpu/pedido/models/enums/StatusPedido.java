package org.acme.cpu.pedido.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum StatusPedido {
    AGUARDANDO_PAGAMENTO("Aguardando Pagamento", 'A'),
    PAGO("Pago", 'P'),
    ENVIADO("Enviado", 'E'),
    ENTREGUE("Entregue", 'G'),
    CANCELADO("Cancelado", 'C');

    private final String tipo;
    private final char sigla;

    StatusPedido(String tipo, char sigla){
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

    public static StatusPedido fromTipo(String tipo) {
        for (StatusPedido p : StatusPedido.values()) {
            if (p.getTipo().equalsIgnoreCase(tipo)) {
                return p;
            }
        }

        throw new IllegalArgumentException("Status de pedido inválido: " + tipo);
    }

    @JsonCreator
    public static StatusPedido fromSigla(char sigla) {
        for (StatusPedido p : StatusPedido.values()) {
            if (p.getSigla() == sigla) {
                return p;
            }
        }
        throw new IllegalArgumentException("Sigla de status de pedido inválida: " + sigla);
    }
}
