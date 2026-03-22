package org.acme.cpu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.acme.cpu.models.enums.TipoNucleo;

@Entity
public class ClusterNucleo extends BaseEntity {
    @Column(nullable = false)
    @NotNull()
    @Positive()
    private Double frequenciaBase;

    @Column(nullable = false)
    @NotNull()
    @Positive()
    private Double frequenciaMaxima;

    @Column(nullable = false)
    @NotNull()
    @Positive()
    private Integer quantidadeNucleos;

    @Column(nullable = false)
    @NotNull()
    @Enumerated(EnumType.STRING)
    private TipoNucleo tipoNucleo;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;

        if (!(obj instanceof ClusterNucleo other)) return false;

        return tipoNucleo != null && tipoNucleo.equals(other.tipoNucleo);

    }

    @Override
    public int hashCode() {
        return tipoNucleo.hashCode();
    }

    public Double getFrequenciaBase() {
        return frequenciaBase;
    }

    public void setFrequenciaBase(Double frequenciaBase) {
        this.frequenciaBase = frequenciaBase;
    }

    public Double getFrequenciaMaxima() {
        return frequenciaMaxima;
    }

    public void setFrequenciaMaxima(Double frequenciaMaxima) {
        this.frequenciaMaxima = frequenciaMaxima;
    }

    public Integer getQuantidadeNucleos() {
        return quantidadeNucleos;
    }

    public void setQuantidadeNucleos(Integer quantidadeNucleos) {
        this.quantidadeNucleos = quantidadeNucleos;
    }

    public TipoNucleo getTipoNucleo() {
        return tipoNucleo;
    }

    public void setTipoNucleo(TipoNucleo tipoNucleo) {
        this.tipoNucleo = tipoNucleo;
    }
}
