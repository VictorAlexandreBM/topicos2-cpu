package org.acme.cpu.pedido.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.acme.cpu.admin.models.BaseEntity;
import org.acme.cpu.cliente.models.Endereco;

@Entity
@Table(name = "cartao")
public class Cartao extends BaseEntity {

    @Column(length = 255, nullable = false)
    private String gatewayToken;

    @Column(length = 4, nullable = false)
    private String ultimos4;

    @Column(length = 40, nullable = false)
    private String bandeira;

    @Column(nullable = false)
    private Integer mesExpiracao;

    @Column(nullable = false)
    private Integer anoExpiracao;

    @Column(nullable = false)
    private Boolean ativo = Boolean.TRUE;

    @Column(nullable = true)
    private String titular;

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Cartao other = (Cartao) obj;
        return gatewayToken.equals(other.gatewayToken) && ultimos4.equals(other.ultimos4) && bandeira.equals(other.bandeira);
    }

    @Override
    public int hashCode() {
        return gatewayToken.hashCode() + ultimos4.hashCode() + bandeira.hashCode();
    }

    public String getGatewayToken() {
        return gatewayToken;
    }

    public void setGatewayToken(String gatewayToken) {
        this.gatewayToken = gatewayToken;
    }

    public String getUltimos4() {
        return ultimos4;
    }

    public void setUltimos4(String ultimos4) {
        this.ultimos4 = ultimos4;
    }

    public String getBandeira() {
        return bandeira;
    }

    public void setBandeira(String bandeira) {
        this.bandeira = bandeira;
    }

    public Integer getMesExpiracao() {
        return mesExpiracao;
    }

    public void setMesExpiracao(Integer mesExpiracao) {
        this.mesExpiracao = mesExpiracao;
    }

    public Integer getAnoExpiracao() {
        return anoExpiracao;
    }

    public void setAnoExpiracao(Integer anoExpiracao) {
        this.anoExpiracao = anoExpiracao;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }
}
