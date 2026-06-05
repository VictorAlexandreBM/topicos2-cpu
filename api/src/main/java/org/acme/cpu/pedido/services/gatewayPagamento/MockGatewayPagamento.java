package org.acme.cpu.pedido.services.gatewayPagamento;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.cpu.pedido.models.Cartao;
import org.acme.cpu.pedido.models.enums.StatusPagamento;

import java.math.BigDecimal;
import java.util.UUID;

@ApplicationScoped
public class MockGatewayPagamento implements GatewayPagamento {

    // Regra de simulação: Falha se o valor terminar em .99
    private boolean simularFalha(BigDecimal valor) {
        return valor.remainder(BigDecimal.ONE).compareTo(new BigDecimal("0.99")) == 0;
    }

    @Override
    public GatewayCreditoResult processarCredito(Cartao cartao, BigDecimal valor, Integer parcelas) {
        if (simularFalha(valor)) {
            return new GatewayCreditoResult(StatusPagamento.RECUSADO, "Saldo insuficiente ou cartão bloqueado.");
        }
        return new GatewayCreditoResult(StatusPagamento.APROVADO, "Transação de crédito aprovada.");
    }

    @Override
    public GatewayDebitoResult processarDebito(Cartao cartao, BigDecimal valor) {
        if (simularFalha(valor)) {
            return new GatewayDebitoResult(StatusPagamento.RECUSADO, "Transação negada pelo emissor.", false);
        }
        // Simula que transações de débito acima de 5000 exigem autenticação 3DS
        boolean exige3DS = valor.compareTo(new BigDecimal("5000.00")) > 0;
        return new GatewayDebitoResult(StatusPagamento.APROVADO, "Transação de débito aprovada.", exige3DS);
    }

    @Override
    public GatewayPixResult gerarPix(BigDecimal valor) {
        String txid = UUID.randomUUID().toString().replace("-", "");
        String copiaECola = "00020126580014br.gov.bcb.pix0136" + txid + "5204000053039865802BR5913Acme CPU LTDA6009Sao Paulo62070503***6304ABCD";
        return new GatewayPixResult(txid, copiaECola);
    }
}