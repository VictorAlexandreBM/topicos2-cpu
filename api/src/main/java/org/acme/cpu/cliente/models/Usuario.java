package org.acme.cpu.cliente.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.acme.cpu.admin.models.BaseInativavelEntity;
import org.acme.cpu.cliente.models.enums.Perfil;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Usuario extends BaseInativavelEntity {
    @Column(unique = true, nullable = false, length = 150)
    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @Column(nullable = false, length = 255)
    @NotBlank
    @Size(max = 255)
    private String senha;

    @Column(nullable = false)
    private Perfil Perfil;

    @Column(nullable = false, length = 255)
    private String primeiroNome;

    @Column(nullable = false, length = 255)
    private String sobrenome;

    @OneToMany(targetEntity = Endereco.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "usuario_id")
    private Set<Endereco> enderecos = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "usuario_telefone", joinColumns = @JoinColumn(name = "usuario_id"))
    private Set<Telefone> telefones = new HashSet<>();

    @Column(name = "refresh_token", unique = true)
    private String refreshToken;

    @Column(name = "refresh_token_expiration")
    private LocalDateTime refreshTokenExpiration;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Perfil getPerfil() {
        return Perfil;
    }

    public void setPerfil(Perfil perfil) {
        Perfil = perfil;
    }

    public String getPrimeiroNome() {
        return primeiroNome;
    }

    public void setPrimeiroNome(String primeiroNome) {
        this.primeiroNome = primeiroNome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public Set<Endereco> getEnderecos() {
        return enderecos;
    }

    public void setEnderecos(Set<Endereco> enderecos) {
        this.enderecos = enderecos;
    }

    public Set<Telefone> getTelefones() {
        return telefones;
    }

    public void setTelefones(Set<Telefone> telefones) {
        this.telefones = telefones;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public LocalDateTime getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }

    public void setRefreshTokenExpiration(LocalDateTime refreshTokenExpiration) {
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String getNomeCompleto() {
        return primeiroNome + " " + sobrenome;
    }
}
