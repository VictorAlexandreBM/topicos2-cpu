package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Tecnologia extends BaseInativavelEntity {

    @Column(unique = true, nullable = false, length = 100)
    @NotBlank
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

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;

        if (!(obj instanceof Tecnologia other)) return false;

        return nome != null && nome.equals(other.nome);
    }

    @Override
    public int hashCode() {
        return nome.hashCode();
    }
}
