package org.acme.cpu.cliente.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Pattern;
import org.acme.cpu.admin.models.BaseInativavelEntity;
import org.acme.cpu.cliente.dtos.telefone.TelefoneDTO;

@Entity
public class Telefone extends BaseInativavelEntity {

    @Column(nullable = false, length = 9)
    @Pattern(regexp = "^\\d{8,9}$")
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

}