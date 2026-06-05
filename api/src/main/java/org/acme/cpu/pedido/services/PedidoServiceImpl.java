package org.acme.cpu.pedido.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.acme.cpu.admin.models.Cpu;
import org.acme.cpu.admin.repositories.CpuRepository;
import org.acme.cpu.cliente.models.Endereco;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.repositories.EnderecoRepository;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoDTO;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoPixDTO;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoCreditoDTO;
import org.acme.cpu.pedido.dtos.Pagamento.PagamentoDebitoDTO;

import org.acme.cpu.pedido.dtos.Pedido.ItemPedidoDTO;
import org.acme.cpu.pedido.dtos.Pedido.PedidoDTO;
import org.acme.cpu.pedido.dtos.Pedido.PedidoResponseDTO;
import org.acme.cpu.pedido.models.*;
import org.acme.cpu.pedido.models.enums.StatusPagamento;
import org.acme.cpu.pedido.models.enums.StatusPedido;
import org.acme.cpu.pedido.repository.CartaoRepository;
import org.acme.cpu.pedido.repository.PedidoRepository;
import org.acme.cpu.pedido.services.gatewayPagamento.GatewayPagamento;

import io.quarkus.scheduler.Scheduled;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PedidoServiceImpl {

    @Inject
    PedidoRepository repository;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    EnderecoRepository enderecoRepository;

    @Inject
    CpuRepository cpuRepository;

    @Inject
    CartaoRepository cartaoRepository;

    @Inject
    GatewayPagamento gatewayPagamento;

    private Pedido getPedidoEntity(Long id) {
        Pedido pedido = repository.findById(id);

        if (pedido == null) {
            throw new NotFoundException("Pedido não encontrado");
        }
        return pedido;
    }

    private void validarPropriedadePedido(Pedido pedido, Usuario usuario) {
        if (!pedido.getUsuario().getId().equals(usuario.getId())) {
            throw new ForbiddenException("Você não tem permissão para alterar este pedido.");
        }
    }

    public PedidoResponseDTO getPedido(Usuario usuario, Long id) {
        Pedido pedido = getPedidoEntity(id);

        validarPropriedadePedido(pedido, usuario);

        return new PedidoResponseDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO realizarPedido(Usuario usuario, PedidoDTO dto) {

        Pedido pedido = new Pedido();

        pedido.setStatus(StatusPedido.AGUARDANDO_PAGAMENTO);

        pedido.setUsuario(usuario);
        Endereco endereco = enderecoRepository.findById(dto.enderecoId());

        if (endereco == null) {
            throw new NotFoundException("Endereço não encontrado");
        }
        pedido.setEnderecoEntrega(EnderecoEntrega.fromEndereco(endereco));

        List<ItemPedido> itens = dto.itens().stream()
                .collect(Collectors.toMap(
                        ItemPedidoDTO::cpuId,
                        ItemPedidoDTO::quantidade,
                        Integer::sum
                ))
                .entrySet().stream()
                .map(itemEntry -> processarItem(itemEntry.getKey(), itemEntry.getValue(), pedido))
                .toList();

        pedido.setItens(itens);

        BigDecimal total = BigDecimal.ZERO;
        for (var i : itens) {
            total = total.add(i.getPrecoUnitario().multiply(new BigDecimal(i.getQuantidade())));
        }
        pedido.setTotal(total);
        Pagamento pagamento = criarPagamento(dto.pagamento(), total);
        pedido.setPagamento(pagamento);

        repository.persist(pedido);

        return new PedidoResponseDTO(pedido);
    }

    private ItemPedido processarItem(Long cpuId, Integer quantidade, Pedido pedido) {
        Cpu cpu = cpuRepository.findById(cpuId);

        if (cpu == null) {
            throw new NotFoundException("CPU não encontrado");
        }

        if (cpu.getEstoque() < quantidade) {
            throw new BadRequestException("Quantidade solicitada maior do que o estoque");
        }

        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setCpu(cpu);
        itemPedido.setQuantidade(quantidade);
        itemPedido.setPrecoUnitario(cpu.getPreco());

        cpu.setEstoque(cpu.getEstoque() - quantidade);

        itemPedido.setPedido(pedido);

        return itemPedido;
    }

    private Pagamento criarPagamento(PagamentoDTO infoPagamento, BigDecimal total) {
        return switch (infoPagamento) {

            case PagamentoPixDTO pixDto -> {
                var resultadoGateway = gatewayPagamento.gerarPix(total);

                PagamentoPix pix = new PagamentoPix();
                pix.setTxid(resultadoGateway.txid());
                pix.setCodigoCopiaECola(resultadoGateway.codigoCopiaECola());
                pix.setValor(total);
                pix.setStatusPagamento(StatusPagamento.PENDENTE);
                yield pix;
            }

            case PagamentoCreditoDTO creditoDto -> {
                Cartao cartao = cartaoRepository.findById(creditoDto.cartaoId());
                if (cartao == null || !cartao.getAtivo()) {
                    throw new BadRequestException("Cartão inválido ou inativo.");
                }

                var resultadoGateway = gatewayPagamento.processarCredito(cartao, total, creditoDto.parcelas());
                if (resultadoGateway.status() == StatusPagamento.RECUSADO) {
                    throw new BadRequestException("Pagamento recusado: " + resultadoGateway.mensagem());
                }

                PagamentoCredito credito = new PagamentoCredito();
                credito.setParcelas(creditoDto.parcelas());
                credito.setJurosAplicados(BigDecimal.ZERO);
                credito.setCartao(cartao);
                credito.setValor(total);
                credito.setStatusPagamento(resultadoGateway.status());
                yield credito;
            }

            case PagamentoDebitoDTO debitoDto -> {
                Cartao cartao = cartaoRepository.findById(debitoDto.cartaoId());
                if (cartao == null || !cartao.getAtivo()) {
                    throw new BadRequestException("Cartão inválido ou inativo.");
                }

                var resultadoGateway = gatewayPagamento.processarDebito(cartao, total);
                if (resultadoGateway.status() == StatusPagamento.RECUSADO) {
                    throw new BadRequestException("Pagamento recusado: " + resultadoGateway.mensagem());
                }

                PagamentoDebito debito = new PagamentoDebito();
                debito.setAutenticacao3DS(resultadoGateway.exige3DS());
                debito.setCartao(cartao);
                debito.setValor(total);
                debito.setStatusPagamento(resultadoGateway.status());
                yield debito;
            }

            default -> throw new BadRequestException("Tipo de pagamento não suportado.");
        };
    }

    public List<PedidoResponseDTO> listar(Usuario usuario) {
        List<Pedido> pedidos = repository.findByUsuario(usuario);

        return pedidos.stream().map(PedidoResponseDTO::new).toList();
    }

    @Transactional
    public PedidoResponseDTO cancelarPedido(Long pedidoId, Usuario usuario) {
        Pedido pedido = getPedidoEntity(pedidoId);

        validarPropriedadePedido(pedido, usuario);
        validarStatusCancelamento(pedido);

        cancelarPedidoInterno(pedido); // Reaproveita a lógica de estado e estoque

        return new PedidoResponseDTO(pedido);
    }

    private void validarStatusCancelamento(Pedido pedido) {
        if (pedido.getStatus() != StatusPedido.AGUARDANDO_PAGAMENTO &&
                pedido.getStatus() != StatusPedido.PAGO) {
            throw new BadRequestException("O pedido não pode ser cancelado no status atual: " + pedido.getStatus());
        }
    }

    private void estornarEstoque(List<ItemPedido> itens) {
        for (ItemPedido item : itens) {
            Cpu cpu = item.getCpu();
            cpu.setEstoque(cpu.getEstoque() + item.getQuantidade());
        }
    }

    @Transactional
    @Scheduled(every = "15m")
    public void cancelarPedidosPendentesExpirados() {
        // Define o tempo limite (ex: pedidos criados há mais de 30 minutos)
        LocalDateTime tempoLimite = LocalDateTime.now().minusMinutes(30);

        // Busca pedidos pendentes criados antes do tempo limite.
        // Assumo que sua BaseEntity possui um campo de data de criação chamado 'dataCriacao'.
        // Ajuste o nome do campo na query se for diferente (ex: createdAt, dataInclusao).
        List<Pedido> pedidosExpirados = repository.find(
                "status = ?1 and dataCriacao < ?2",
                StatusPedido.AGUARDANDO_PAGAMENTO,
                tempoLimite
        ).list();

        for (Pedido pedido : pedidosExpirados) {
            cancelarPedidoInterno(pedido);
        }
    }

    private void cancelarPedidoInterno(Pedido pedido) {

        estornarEstoque(pedido.getItens());
        pedido.setStatus(StatusPedido.CANCELADO);

        if (pedido.getPagamento() != null) {
            pedido.getPagamento().setStatusPagamento(StatusPagamento.CANCELADO);
        }

    }

    @Transactional
    public PedidoResponseDTO marcarComoEnviado(Long pedidoId) {
        Pedido pedido = getPedidoEntity(pedidoId);

        validarTransicao(pedido, StatusPedido.PAGO);

        pedido.setStatus(StatusPedido.ENVIADO);

        return new PedidoResponseDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO marcarComoEntregue(Long pedidoId) {
        Pedido pedido = getPedidoEntity(pedidoId);

        validarTransicao(pedido, StatusPedido.ENVIADO);

        pedido.setStatus(StatusPedido.ENTREGUE);

        return new PedidoResponseDTO(pedido);
    }

    private void validarTransicao(Pedido pedido, StatusPedido statusExigido) {
        if (pedido.getStatus() != statusExigido) {
            throw new BadRequestException("Operação inválida. O status atual do pedido é "
                    + pedido.getStatus() + ", mas deveria ser " + statusExigido + ".");
        }
    }

    @Transactional
    public PedidoResponseDTO confirmarPagamentoPix(String txid) {
        Pedido pedido = repository.findBytxid(txid).firstResult();

        if (pedido == null) {
            throw new NotFoundException("Nenhum pedido encontrado para o TXID informado.");
        }

        validarTransicao(pedido, StatusPedido.AGUARDANDO_PAGAMENTO);

        pedido.getPagamento().setStatusPagamento(StatusPagamento.APROVADO);
        pedido.setStatus(StatusPedido.PAGO);

        return new PedidoResponseDTO(pedido);
    }


}
