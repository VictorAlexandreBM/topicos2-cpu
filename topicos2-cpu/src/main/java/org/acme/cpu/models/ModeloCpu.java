package org.acme.cpu.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
public class ModeloCpu extends BaseEntity {

    @Column(unique = true, nullable = false, length = 100)
    @NotBlank
    private String nome;

    @Embedded
    private FichaTecnica fichaTecnica;

    @ManyToMany(targetEntity = Chipset.class)
    @JoinTable(
            name = "modelo_cpu_chipset",
            joinColumns = @JoinColumn(name = "modelo_cpu_id"),
            inverseJoinColumns = @JoinColumn(name = "chipset_id")
    )
    private Set<Chipset> chipsets = new HashSet<>();

    @ManyToMany(targetEntity = Tecnologia.class)
    @JoinTable(
            name = "modelo_cpu_tecnologia",
            joinColumns = @JoinColumn(name = "modelo_cpu_id"),
            inverseJoinColumns = @JoinColumn(name = "tecnologia_id")
    )
    private Set<Tecnologia> tecnologias = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "modelo_cpu_id")
    private Set<ClusterNucleo> clustersNucleo = new HashSet<>();

    @ManyToOne(targetEntity = Socket.class)
    @JoinColumn(name = "socket_id")
    private Socket socket;

    @ManyToOne(targetEntity = Marca.class)
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

}
