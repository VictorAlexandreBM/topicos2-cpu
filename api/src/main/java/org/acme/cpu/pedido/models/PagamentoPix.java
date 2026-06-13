package org.acme.cpu.pedido.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PIX")
public class PagamentoPix extends Pagamento {

    @Column(length = 200)
    private String chavePixDestino;

    @Column(length = 500)
    private String codigoCopiaECola;

    @Column(length = 100)
    private String txid;

    public String getChavePixDestino() {
        return chavePixDestino;
    }

    public void setChavePixDestino(String chavePixDestino) {
        this.chavePixDestino = chavePixDestino;
    }

    public String getCodigoCopiaECola() {
        return codigoCopiaECola;
    }

    public void setCodigoCopiaECola(String codigoCopiaECola) {
        this.codigoCopiaECola = codigoCopiaECola;
    }

    public String getTxid() {
        return txid;
    }

    public void setTxid(String txid) {
        this.txid = txid;
    }
}
