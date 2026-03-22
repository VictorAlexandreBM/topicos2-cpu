package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Tecnologia extends BaseEntity {

    @Column(unique = true, nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String nome;

    @Column(nullable = true)
    @Size(max = 255)
    private String descricao;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
