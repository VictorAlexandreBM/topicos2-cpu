package org.acme.cpu.pedido.models;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.acme.cpu.admin.models.BaseEntity;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.pedido.models.enums.StatusPedido;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido extends BaseEntity {
    @Column(nullable = false)
    private StatusPedido status;

    @Column(nullable = false, precision = 19, scale = 2)
    @NotNull
    @PositiveOrZero()
    @Digits(integer = 17, fraction = 2)
    private BigDecimal total;

    @Embedded
    @NotNull()
    @Valid
    private EnderecoEntrega enderecoEntrega;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull()
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "pagamento_id", nullable = false)
    @NotNull()
    @Valid
    private Pagamento pagamento;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "pedido")
    @NotEmpty()
    @Valid
    private List<ItemPedido> itens = new ArrayList<>();

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public EnderecoEntrega getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(EnderecoEntrega enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Pagamento getPagamento() {
        return pagamento;
    }

    public void setPagamento(Pagamento pagamento) {
        this.pagamento = pagamento;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}
