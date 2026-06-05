package org.acme.cpu.cliente.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.acme.cpu.admin.models.BaseInativavelEntity;
import org.acme.cpu.admin.models.ClusterNucleo;
import org.acme.cpu.cliente.dtos.telefone.TelefoneDTO;

@Embeddable
public class Telefone {

    @Column(nullable = false, length = 11)
    @Pattern(regexp = "^\\d{10,11}$")
    private String numero;

    @Column(nullable = false)
    private Boolean principal;

    public static Telefone fromDTO(TelefoneDTO dto){
        Telefone t = new Telefone();
        t.setNumero(dto.numero());
        t.setPrincipal(dto.principal());
        return t;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Boolean isPrincipal() {
        return principal;
    }

    public void setPrincipal(Boolean principal) {
        this.principal = principal;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Telefone other)) return false;

        return numero.equals(other.numero);
    }

    @Override
    public int hashCode() {
        return numero.hashCode();
    }
}