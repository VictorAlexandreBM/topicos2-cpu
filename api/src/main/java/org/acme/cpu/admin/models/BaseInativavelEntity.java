package org.acme.cpu.admin.models;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseInativavelEntity extends BaseEntity {
    protected Boolean ativo = true;

    public Boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

}
