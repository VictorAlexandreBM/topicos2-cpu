package org.acme.cpu.pedido.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.acme.cpu.admin.models.BaseInativavelEntity;
import org.acme.cpu.pedido.models.enums.TipoDesconto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Cupom extends BaseInativavelEntity {

    @Column(unique = true, nullable = false, length = 30)
    @NotBlank
    private String codigo;

    @Column(nullable = false)
    @NotNull
    @Positive
    private BigDecimal valor;

    @Column(nullable = false)
    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoDesconto tipo;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime dataValidade;

    @Column(nullable = true)
    @Positive
    private Integer limiteUsos;

    @Column(nullable = true)
    @Positive
    private BigDecimal valorMinimoPedido;

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo != null ? codigo.toUpperCase() : null; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public TipoDesconto getTipo() { return tipo; }
    public void setTipo(TipoDesconto tipo) { this.tipo = tipo; }

    public LocalDateTime getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDateTime dataValidade) { this.dataValidade = dataValidade; }

    public Integer getLimiteUsos() { return limiteUsos; }
    public void setLimiteUsos(Integer limiteUsos) { this.limiteUsos = limiteUsos; }

    public BigDecimal getValorMinimoPedido() { return valorMinimoPedido; }
    public void setValorMinimoPedido(BigDecimal valorMinimoPedido) { this.valorMinimoPedido = valorMinimoPedido; }
}