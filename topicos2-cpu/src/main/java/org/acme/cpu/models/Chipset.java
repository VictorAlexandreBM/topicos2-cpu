package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Chipset extends BaseEntity {
    @Column(unique = true, nullable = false, length = 100)
    @NotBlank
    private String tipo;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;

        if (!(obj instanceof Chipset other)) return false;

        return tipo != null && other.tipo.equals(this.tipo);
    }

    @Override
    public int hashCode() {
        return tipo.hashCode();
    }
}
