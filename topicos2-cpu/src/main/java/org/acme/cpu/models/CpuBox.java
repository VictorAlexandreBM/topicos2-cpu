package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@DiscriminatorValue("box")
public class CpuBox extends Cpu {
    @NotNull
    @Column(nullable = false)
    private boolean incluiCooler;

    @NotNull
    @Column(nullable = false)
    @PositiveOrZero
    private Double pesoEmbalagemGramas;
}
