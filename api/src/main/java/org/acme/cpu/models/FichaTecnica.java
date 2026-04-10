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

    public String getDescricaoComercial() {
        return descricaoComercial;
    }

    public void setDescricaoComercial(String descricaoComercial) {
        this.descricaoComercial = descricaoComercial;
    }

    public Integer getTdpBaseW() {
        return tdpBaseW;
    }

    public void setTdpBaseW(Integer tdpBaseW) {
        this.tdpBaseW = tdpBaseW;
    }

    public Double getCacheL2MB() {
        return cacheL2MB;
    }

    public void setCacheL2MB(Double cacheL2MB) {
        this.cacheL2MB = cacheL2MB;
    }

    public Double getCacheL3MB() {
        return cacheL3MB;
    }

    public void setCacheL3MB(Double cacheL3MB) {
        this.cacheL3MB = cacheL3MB;
    }
}
