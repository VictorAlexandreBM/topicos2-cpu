package org.acme.cpu.pedido.services.gatewayPagamento;

import org.acme.cpu.pedido.models.Cartao;
import org.acme.cpu.pedido.models.enums.StatusPagamento;
import java.math.BigDecimal;

public interface GatewayPagamento {

    GatewayCreditoResult processarCredito(Cartao cartao, BigDecimal valor, Integer parcelas);

    GatewayDebitoResult processarDebito(Cartao cartao, BigDecimal valor);

    GatewayPixResult gerarPix(BigDecimal valor);

    // Records aninhados para os retornos do Gateway
    record GatewayCreditoResult(StatusPagamento status, String mensagem) {}
    record GatewayDebitoResult(StatusPagamento status, String mensagem, Boolean exige3DS) {}
    record GatewayPixResult(String txid, String codigoCopiaECola) {}
}