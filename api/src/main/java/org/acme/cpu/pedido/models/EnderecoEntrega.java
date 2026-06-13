package org.acme.cpu.pedido.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.acme.cpu.cliente.models.Endereco;

@Embeddable
public class EnderecoEntrega {

    @Column(length = 8, nullable = false)
    @NotBlank
    @Size(max = 8)
    @Pattern(regexp = "^\\d{8}$")
    private String cep;

    @Column(length = 255, nullable = false)
    @NotBlank
    @Size(max = 255)
    private String logradouro;

    @Column(length = 20, nullable = false)
    @NotBlank
    @Size(max = 20)
    private String numero;

    @Column(length = 100)
    @Size(max = 100)
    private String complemento;

    @Column(length = 100, nullable = false)
    @NotBlank
    @Size(max = 100)
    private String bairro;

    @Column(length = 100, nullable = false)
    @NotBlank
    @Size(max = 100)
    private String cidade;

    @Column(length = 2, nullable = false)
    @NotBlank
    @Size(min = 2, max = 2)
    private String estado;

    public static EnderecoEntrega fromEndereco(Endereco endereco) {
        EnderecoEntrega e = new EnderecoEntrega();
        e.setBairro(endereco.getBairro());
        e.setCep(endereco.getCep());
        e.setCidade(endereco.getCidade().getNome());
        e.setComplemento(endereco.getComplemento());
        e.setEstado(endereco.getCidade().getEstado().getSigla());
        e.setLogradouro(endereco.getLogradouro());
        e.setNumero(endereco.getNumero());
        return e;
    }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}