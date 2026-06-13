package org.acme.cpu.pedido.seeder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.admin.models.Cpu;
import org.acme.cpu.admin.repositories.CpuRepository;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.models.*;
import org.acme.cpu.pedido.models.enums.StatusPagamento;
import org.acme.cpu.pedido.models.enums.StatusPedido;
import org.acme.cpu.pedido.repository.PedidoRepository;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class PedidoSeedRunner {

    @Inject Logger LOG;
    @Inject ObjectMapper objectMapper;
    @Inject PedidoRepository pedidoRepository;
    @Inject UsuarioRepository usuarioRepository;
    @Inject CpuRepository cpuRepository;

    @Transactional
    public void onStart(@Observes @Priority(3) StartupEvent ev) {
        // Aguarda os outros Seeders. Só executa se houver usuários e CPUs, e se não houver pedidos.
        if (usuarioRepository.count() == 0 || cpuRepository.count() == 0) return;
        if (pedidoRepository.count() > 0) {
            LOG.info("[PedidoSeedRunner] Banco de pedidos já populado. Pulando Seeder.");
            return;
        }

        LOG.info("[PedidoSeedRunner] Iniciando lotação de pedidos históricos...");
        try {
            seedPedidos();
            LOG.info("[PedidoSeedRunner] Lotação de pedidos concluída com sucesso.");
        } catch (Exception e) {
            LOG.error("[PedidoSeedRunner] Falha ao popular a base de pedidos", e);
        }
    }

    private InputStream getStream(String filename) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("seeds/cliente/" + filename);
    }

    private void seedPedidos() throws Exception {
        JsonNode root = objectMapper.readTree(getStream("pedidos.json"));

        for (JsonNode node : root) {
            Pedido pedido = new Pedido();

            // 1. Vincula Usuário
            String email = node.get("emailCliente").asText();
            Usuario usuario = usuarioRepository.find("email", email).firstResult();
            if (usuario == null) continue;
            pedido.setUsuario(usuario);

            // 2. Vincula Endereço de Entrega (Pega o 1º do cliente)
            if (!usuario.getEnderecos().isEmpty()) {
                pedido.setEnderecoEntrega(EnderecoEntrega.fromEndereco(usuario.getEnderecos().iterator().next()));
            } else {
                continue; // Pula se o cliente não tiver endereço
            }

            // 3. Status e Data Retroativa
            pedido.setStatus(StatusPedido.valueOf(node.get("statusPedido").asText()));
            // ATENÇÃO: Se BaseEntity tiver @PrePersist sobrescrevendo a data, isso não terá efeito no BD,
            // mas tentaremos setar de qualquer forma.
            LocalDateTime dataHistorica = LocalDateTime.parse(node.get("dataCriacao").asText());
            pedido.setDataCriacao(dataHistorica);

            // 4. Processa Itens e Soma Total (SEM deduzir estoque)
            List<ItemPedido> itens = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;

            for (JsonNode itemNode : node.get("itens")) {
                Cpu cpu = cpuRepository.find("sku", itemNode.get("skuCpu").asText()).firstResult();
                if (cpu != null) {
                    ItemPedido item = new ItemPedido();
                    item.setCpu(cpu);
                    item.setQuantidade(itemNode.get("quantidade").asInt());
                    item.setPrecoUnitario(cpu.getPreco());
                    item.setPedido(pedido);
                    itens.add(item);

                    total = total.add(cpu.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade())));
                }
            }
            pedido.setItens(itens);
            pedido.setTotal(total);

            // 5. Instancia Subclasse de Pagamento
            JsonNode pagNode = node.get("pagamento");
            String forma = pagNode.get("forma").asText();
            Pagamento pagamento;

            if (forma.equals("PIX")) {
                PagamentoPix pix = new PagamentoPix();
                pix.setTxid(pagNode.get("txid").asText());
                pix.setCodigoCopiaECola(pagNode.get("codigoCopiaECola").asText());
                pagamento = pix;
            } else if (forma.equals("CREDITO")) {
                PagamentoCredito credito = new PagamentoCredito();
                credito.setParcelas(pagNode.get("parcelas").asInt());
                credito.setJurosAplicados(BigDecimal.ZERO);
                if (!usuario.getCartoes().isEmpty()) {
                    credito.setCartao(usuario.getCartoes().iterator().next());
                }
                pagamento = credito;
            } else {
                PagamentoDebito debito = new PagamentoDebito();
                debito.setAutenticacao3DS(pagNode.get("autenticacao3DS").asBoolean());
                if (!usuario.getCartoes().isEmpty()) {
                    debito.setCartao(usuario.getCartoes().iterator().next());
                }
                pagamento = debito;
            }

            pagamento.setValor(total);
            pagamento.setStatusPagamento(StatusPagamento.valueOf(pagNode.get("statusPagamento").asText()));
            pedido.setPagamento(pagamento);

            pedidoRepository.persist(pedido);
        }
    }
}