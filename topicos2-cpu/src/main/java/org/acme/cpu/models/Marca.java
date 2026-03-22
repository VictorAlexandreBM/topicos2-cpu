package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Marca extends BaseEntity {

    @Column(unique = true, nullable = false, length = 100)
    @NotBlank
    @Size(max = 100)
    private String nome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
