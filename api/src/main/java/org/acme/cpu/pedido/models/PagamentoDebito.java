package org.acme.cpu.pedido.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@DiscriminatorValue("DEBITO")
public class PagamentoDebito extends Pagamento {

    @Column
    private Boolean autenticacao3DS;

    @ManyToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;

    public Boolean getAutenticacao3DS() {
        return autenticacao3DS;
    }

    public void setAutenticacao3DS(Boolean autenticacao3DS) {
        this.autenticacao3DS = autenticacao3DS;
    }

    public Cartao getCartao() {
        return cartao;
    }

    public void setCartao(Cartao cartao) {
        this.cartao = cartao;
    }
}
