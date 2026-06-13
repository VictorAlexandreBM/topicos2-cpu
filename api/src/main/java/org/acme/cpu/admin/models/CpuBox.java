package org.acme.cpu.admin.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@DiscriminatorValue("box")
public class CpuBox extends Cpu {
    @Column(nullable = true)
    private boolean incluiCooler;

    @Column(nullable = true)
    @PositiveOrZero
    private Double pesoEmbalagemGramas;

    public boolean isIncluiCooler() {
        return incluiCooler;
    }

    public void setIncluiCooler(boolean incluiCooler) {
        this.incluiCooler = incluiCooler;
    }

    public Double getPesoEmbalagemGramas() {
        return pesoEmbalagemGramas;
    }

    public void setPesoEmbalagemGramas(Double pesoEmbalagemGramas) {
        this.pesoEmbalagemGramas = pesoEmbalagemGramas;
    }
}
