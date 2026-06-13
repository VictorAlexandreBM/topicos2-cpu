package org.acme.cpu.cliente.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import org.acme.cpu.admin.models.BaseEntity;

@Entity
public class Endereco extends BaseEntity {

    @Column(length = 8, nullable = false)
    @Pattern(regexp = "^\\d{8}$")
    private String cep;

    @Column(length = 255, nullable = false)
    private String logradouro;

    @Column(length = 20, nullable = false)
    private String numero;

    @Column(length = 100)
    private String complemento;

    @Column(length = 100, nullable = false)
    private String quadra;

    @Column(length = 100, nullable = false)
    private String bairro;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "cidade_id", nullable = false)
    private Cidade cidade;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Endereco other = (Endereco) obj;
        return cep.equals(other.cep)
                && numero.equals(other.numero)
                && bairro.equals(other.bairro)
                && cidade.getId().equals(other.cidade.getId());
    }

    @Override
    public int hashCode() {
        return cep.hashCode() + numero.hashCode() + bairro.hashCode() + cidade.getId().hashCode();
    }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getQuadra() { return quadra; }
    public void setQuadra(String quadra) { this.quadra = quadra; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public Cidade getCidade() { return cidade; }
    public void setCidade(Cidade cidade) { this.cidade = cidade; }
}