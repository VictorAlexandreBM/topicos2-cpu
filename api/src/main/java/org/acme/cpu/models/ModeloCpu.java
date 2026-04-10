package org.acme.cpu.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
public class ModeloCpu extends BaseInativavelEntity {

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

    @ElementCollection
    @CollectionTable(name = "modelo_cpu_cluster_nucleo", joinColumns = @JoinColumn(name = "modelo_cpu_id"))
    private Set<ClusterNucleo> clustersNucleo = new HashSet<>();

    @ManyToOne(targetEntity = Socket.class)
    @JoinColumn(name = "socket_id")
    private Socket socket;

    @ManyToOne(targetEntity = Marca.class)
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public FichaTecnica getFichaTecnica() {
        return fichaTecnica;
    }

    public void setFichaTecnica(FichaTecnica fichaTecnica) {
        this.fichaTecnica = fichaTecnica;
    }

    public Set<Tecnologia> getTecnologias() {
        return tecnologias;
    }

    public void setTecnologias(Set<Tecnologia> tecnologias) {
        this.tecnologias = tecnologias;
    }

    public Set<Chipset> getChipsets() {
        return chipsets;
    }

    public void setChipsets(Set<Chipset> chipsets) {
        this.chipsets = chipsets;
    }

    public Set<ClusterNucleo> getClustersNucleo() {
        return clustersNucleo;
    }

    public void setClustersNucleo(Set<ClusterNucleo> clustersNucleo) {
        this.clustersNucleo = clustersNucleo;
    }

    public void addClusterNucleo(ClusterNucleo clusterNucleo) {
        this.clustersNucleo.add(clusterNucleo);
    }

    public Socket getSocket() {
        return socket;
    }

    public void setSocket(Socket socket) {
        this.socket = socket;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
}
