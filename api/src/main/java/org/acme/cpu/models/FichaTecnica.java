package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Embeddable
public class FichaTecnica {

    @Column(nullable = true)
    @NotBlank
    private String descricaoComercial;

    @Column(nullable = true)
    @Positive
    private Integer tdpBaseW;

    @Column(nullable = true)
    private Double cacheL2MB;

    @Column(nullable = true)
    private Double cacheL3MB;

}
