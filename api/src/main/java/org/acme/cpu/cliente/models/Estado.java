package org.acme.cpu.cliente.models;

import jakarta.persistence.*;
import org.acme.cpu.admin.models.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Estado extends BaseEntity {

    @Column(length = 2, nullable = false, unique = true)
    private String sigla;

    @Column(length = 100, nullable = false)
    private String nome;

    @OneToMany(mappedBy = "estado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cidade> cidades = new ArrayList<>();

    public String getSigla() { return sigla; }
    public void setSigla(String sigla) { this.sigla = sigla; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public List<Cidade> getCidades() { return cidades; }
    public void setCidades(List<Cidade> cidades) { this.cidades = cidades; }
}