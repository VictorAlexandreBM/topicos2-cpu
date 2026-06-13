package org.acme.cpu.pedido.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.acme.cpu.admin.models.BaseEntity;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

import java.math.BigDecimal;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "forma")
public abstract class Pagamento extends BaseEntity {
    @Column(nullable = false, precision = 19, scale = 2)
    @NotNull
    @Positive(message = "O valor do pagamento deve ser maior que zero")
    @Digits(integer = 17, fraction = 2)
    private BigDecimal valor;

    private StatusPagamento statusPagamento;

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public StatusPagamento getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(StatusPagamento statusPagamento) {
        this.statusPagamento = statusPagamento;
    }
}
