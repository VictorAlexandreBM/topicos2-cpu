package org.acme.cpu.cliente.models;

import jakarta.persistence.*;
import org.acme.cpu.admin.models.BaseEntity;

@Entity
public class Cidade extends BaseEntity {

    @Column(length = 150, nullable = false)
    private String nome;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}