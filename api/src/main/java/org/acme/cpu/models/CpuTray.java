package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@DiscriminatorValue("tray")
public class CpuTray extends Cpu {

    @PositiveOrZero
    @NotNull
    @Column(nullable = false)
    private String loteFabricacao;
}
