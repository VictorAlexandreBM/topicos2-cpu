package org.acme.cpu.pedido.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("CREDITO")
public class PagamentoCredito extends Pagamento {

    @Column
    private Integer parcelas;

    @Column(precision = 6, scale = 2)
    private BigDecimal jurosAplicados;

    @ManyToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;

    public Integer getParcelas() {
        return parcelas;
    }

    public void setParcelas(Integer parcelas) {
        this.parcelas = parcelas;
    }

    public BigDecimal getJurosAplicados() {
        return jurosAplicados;
    }

    public void setJurosAplicados(BigDecimal jurosAplicados) {
        this.jurosAplicados = jurosAplicados;
    }

    public Cartao getCartao() {
        return cartao;
    }

    public void setCartao(Cartao cartao) {
        this.cartao = cartao;
    }
}
