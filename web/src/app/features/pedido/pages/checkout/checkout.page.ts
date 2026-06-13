import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CarrinhoService } from '@features/pedido/services/carrinho.service';
import { EnderecoService } from '@features/cliente/services/endereco.service';
import { CartaoService } from '@features/cliente/services/cartao.service';
import { PedidoService } from '@features/pedido/services/pedido.service';

import { EnderecoDetail } from '@features/cliente/models/endereco.model';
import { CartaoDetail } from '@features/cliente/models/cartao.model';
import { PedidoFormRequest, ItemPedidoRequest } from '@features/pedido/models/pedido.model';

import { CheckoutEnderecoComponent } from '@features/pedido/components/checkout/checkout-endereco/checkout-endereco.component';
import { CheckoutPagamentoComponent, SelecaoPagamento } from '@features/pedido/components/checkout/checkout-pagamento/checkout-pagamento.component';
import { CheckoutResumoComponent } from '@features/pedido/components/checkout/checkout-resumo/checkout-resumo.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    CheckoutEnderecoComponent,
    CheckoutPagamentoComponent,
    CheckoutResumoComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center gap-4 mb-8">
          <a mat-icon-button routerLink="/carrinho" aria-label="Voltar para o carrinho">
            <mat-icon>arrow_back</mat-icon>
          </a>
          <h1 class="text-3xl font-bold text-gray-900 m-0">Finalizar Compra</h1>
        </div>

        @if (carregandoDadosIniciais()) {
          <div class="flex justify-center items-center py-20">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div class="lg:col-span-8 flex flex-col gap-6">
              <app-checkout-endereco
                [enderecos]="enderecosUsuario()"
                (enderecoSelecionado)="enderecoSelecionadoId.set($event)">
              </app-checkout-endereco>

              <app-checkout-pagamento
                [cartoes]="cartoesUsuario()"
                (pagamentoSelecionado)="pagamentoSelecionado.set($event)">
              </app-checkout-pagamento>
            </div>

            <div class="lg:col-span-4">
              <app-checkout-resumo
                [quantidadeItens]="carrinhoService.quantidadeSelecionada()"
                [valorSubtotal]="valorSubtotal()"
                [valorDesconto]="valorDesconto()"
                [valorTotal]="valorTotalFinal()"
                [podeFinalizar]="podeFinalizar()"
                [processando]="processandoPedido()"
                [cupomAplicado]="codigoCupomAplicado()"
                [processandoCupom]="processandoCupom()"
                (aplicarCupom)="validarCupom($event)"
                (removerCupom)="removerCupom()"
                (confirmarPedido)="enviarPedido()">
              </app-checkout-resumo>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export default class CheckoutPage implements OnInit {
  protected readonly carrinhoService = inject(CarrinhoService);
  private readonly enderecoService = inject(EnderecoService);
  private readonly cartaoService = inject(CartaoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly carregandoDadosIniciais = signal(true);
  protected readonly processandoPedido = signal(false);
  protected readonly processandoCupom = signal(false);

  protected readonly enderecosUsuario = signal<EnderecoDetail[]>([]);
  protected readonly cartoesUsuario = signal<CartaoDetail[]>([]);

  protected readonly enderecoSelecionadoId = signal<number | null>(null);
  protected readonly pagamentoSelecionado = signal<SelecaoPagamento | null>(null);

  protected readonly codigoCupomAplicado = signal<string | null>(null);
  protected readonly valorDesconto = signal<number>(0);

  protected readonly valorSubtotal = computed(() => this.carrinhoService.valorTotalSelecionado());

  protected readonly valorTotalFinal = computed(() => {
    const total = this.valorSubtotal() - this.valorDesconto();
    return total > 0 ? total : 0;
  });

  protected readonly podeFinalizar = computed(() => {
    return this.enderecoSelecionadoId() !== null &&
      this.pagamentoSelecionado() !== null &&
      this.carrinhoService.quantidadeSelecionada() > 0;
  });

  ngOnInit(): void {
    if (this.carrinhoService.quantidadeSelecionada() === 0) {
      this.router.navigate(['/carrinho']);
      return;
    }
    this.carregarDadosDoUsuario();
  }

  private carregarDadosDoUsuario(): void {
    let carregados = 0;
    const checarCarregamento = () => {
      carregados++;
      if (carregados === 2) this.carregandoDadosIniciais.set(false);
    };

    this.enderecoService.listar().subscribe({
      next: (enderecos) => { this.enderecosUsuario.set(enderecos); checarCarregamento(); },
      error: () => checarCarregamento()
    });

    this.cartaoService.listar().subscribe({
      next: (cartoes) => { this.cartoesUsuario.set(cartoes); checarCarregamento(); },
      error: () => checarCarregamento()
    });
  }

  protected validarCupom(codigo: string): void {
    this.processandoCupom.set(true);

    this.pedidoService.validarCupom(codigo, this.valorSubtotal()).subscribe({
      next: (resposta) => {
        this.codigoCupomAplicado.set(codigo);
        this.valorDesconto.set(resposta.desconto);
        this.processandoCupom.set(false);
        this.snackBar.open('Cupom aplicado com sucesso!', 'Fechar', { duration: 3000, panelClass: ['bg-green-600', 'text-white'] });
      },
      error: (err) => {
        this.processandoCupom.set(false);
        this.removerCupom();
        const mensagem = err.error?.message || 'Cupom inválido ou expirado.';
        this.snackBar.open(mensagem, 'Fechar', { duration: 4000, panelClass: ['bg-red-600', 'text-white'] });
      }
    });
  }

  protected removerCupom(): void {
    this.codigoCupomAplicado.set(null);
    this.valorDesconto.set(0);
  }


  protected enviarPedido(): void {
    if (!this.podeFinalizar()) return;

    this.processandoPedido.set(true);

    const itensRequest: ItemPedidoRequest[] = this.carrinhoService.itens()
      .filter(i => i.selecionado)
      .map(i => ({ cpuId: i.produto.id, quantidade: i.quantidade }));

    const payload: PedidoFormRequest = {
      enderecoId: this.enderecoSelecionadoId()!,
      itens: itensRequest,
      pagamento: this.pagamentoSelecionado() as any,
      codigoCupom: this.codigoCupomAplicado() || undefined
    };

    this.pedidoService.realizarPedido(payload).subscribe({
      next: (resposta) => {
        this.processandoPedido.set(false);

        const itensComprados = this.carrinhoService.itens().filter(i => i.selecionado);
        for (const item of itensComprados) {
          this.carrinhoService.removerItem(item.produto.id);
        }

        this.snackBar.open('Pedido realizado com sucesso!', 'Fechar', { duration: 5000 });
        this.router.navigate(['/pedido/sucesso', resposta.id]);
      },
      error: (err) => {
        this.processandoPedido.set(false);
        const mensagem = err.error?.message || 'Erro ao processar o pagamento. Tente novamente.';
        this.snackBar.open(mensagem, 'Fechar', { duration: 5000, panelClass: ['bg-red-600', 'text-white'] });
      }
    });
  }
}
