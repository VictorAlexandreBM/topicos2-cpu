package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Tecnologia {

    @Column(unique = true, nullable = false)
    private String nome;

    @Column(nullable = true)
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
