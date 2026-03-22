package org.acme.cpu.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo")
public abstract class Cpu extends BaseEntity {

    @Column(unique = true, nullable = false, length = 20)
    @NotBlank
    private String sku;

    @Column(nullable = false)
    @NotNull
    @PositiveOrZero
    private BigDecimal preco;

    @Column(nullable = false)
    @NotNull
    @PositiveOrZero
    private Integer estoque;

    @Column(nullable = true)
    private LocalDate dataInclusao;

    @Column(nullable = false)
    @NotNull
    private boolean emVenda;

    @ManyToOne(targetEntity = ModeloCpu.class)
    @JoinColumn(name = "modelo_id", nullable = false)
    @NotNull
    private ModeloCpu modelo;
}
