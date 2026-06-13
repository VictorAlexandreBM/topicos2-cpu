import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PedidoService } from '@features/pedido/services/pedido.service';
import { PagamentoPixResponse, PagamentoResponse, PedidoResponse } from '@features/pedido/models/pedido.model';
import { AuthService } from '@features/cliente/services/auth.service';

@Component({
  selector: 'app-pedido-sucesso-page',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        @if (carregando()) {
          <div class="flex justify-center items-center py-20">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
        } @else if (erro() || !pedido()) {
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <mat-icon class="!w-16 !h-16 !text-6xl text-red-500 mb-4">error_outline</mat-icon>
            <h2 class="text-2xl font-bold text-gray-900">Pedido não encontrado</h2>
            <p class="text-gray-500 mt-2">Não conseguimos localizar as informações deste pedido.</p>
            <a mat-flat-button color="primary" routerLink="/" class="mt-6">Voltar para a Loja</a>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

            <div class="bg-green-50 border-b border-green-100 p-8 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <mat-icon class="!w-8 !h-8 !text-3xl text-green-600">check_circle</mat-icon>
              </div>
              <h1 class="text-3xl font-bold text-green-800">Pedido Confirmado!</h1>
              <p class="text-green-600 mt-2 text-lg">Obrigado pela sua compra. O número do seu pedido é <strong>#{{ pedido()!.id }}</strong></p>
            </div>

            <div class="p-8">

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                <div>
                  <span class="block text-gray-500">Data</span>
                  <span class="font-medium text-gray-900">{{ pedido()!.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div>
                  <span class="block text-gray-500">Total</span>
                  <span class="font-medium text-gray-900">{{ pedido()!.total | currency:'BRL' }}</span>
                </div>
                <div>
                  <span class="block text-gray-500">Status</span>
                  <span class="font-medium text-blue-600">{{ pedido()!.status }}</span>
                </div>
                <div>
                  <span class="block text-gray-500">Pagamento</span>
                  <span class="font-medium text-gray-900">{{ pedido()!.pagamento.status }}</span>
                </div>
              </div>

              @if (isPagamentoPix(pedido()!.pagamento)) {
                @if (pedido()!.pagamento.status === 'Pendente') {
                  <div class="mb-8 border border-teal-200 bg-teal-50 rounded-lg p-6 text-center">
                    <h3 class="text-lg font-bold text-teal-900 mb-2">Finalize seu pagamento via Pix</h3>
                    <p class="text-teal-700 text-sm mb-4">Escaneie o QR Code ou copie o código abaixo para pagar no aplicativo do seu banco.</p>

                    <div class="bg-white p-4 inline-block rounded-lg border border-teal-100 mb-4">
                      <mat-icon class="!w-32 !h-32 !text-[128px] text-gray-800">qr_code_2</mat-icon>
                    </div>

                    <div class="flex items-center gap-2 bg-white border border-teal-200 rounded p-2 max-w-lg mx-auto mb-6">
                      <input type="text" readonly [value]="($any(pedido()!.pagamento)).codigoCopiaECola"
                             class="flex-1 bg-transparent border-none text-sm text-gray-600 focus:ring-0 outline-none truncate" />
                      <button mat-flat-button color="primary" (click)="copiarPix()">Copiar</button>
                    </div>

                    <div class="border-t border-teal-200 pt-4">
                      <button mat-stroked-button color="primary" (click)="simularPagamentoPix()" [disabled]="simulandoPix()">
                        @if (simulandoPix()) {
                          <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner> Simulando...
                        } @else {
                          Simular Pagamento Pix
                        }
                      </button>
                    </div>
                  </div>
                } @else {
                  <div class="mb-8 border border-green-200 bg-green-50 rounded-lg p-6 text-center">
                    <mat-icon class="!w-12 !h-12 !text-[48px] text-green-600 mb-2">verified</mat-icon>
                    <h3 class="text-lg font-bold text-green-900">Pagamento Pix Confirmado!</h3>
                    <p class="text-green-700">O pagamento foi reconhecido e o seu pedido está em processamento.</p>
                  </div>
                }
              } @else {
                @if (pedido()!.pagamento.status === 'Aprovado') {
                  <div class="mb-8 border border-green-200 bg-green-50 rounded-lg p-6 text-center">
                    <mat-icon class="!w-12 !h-12 !text-[48px] text-green-600 mb-2">credit_score</mat-icon>
                    <h3 class="text-lg font-bold text-green-900">Pagamento Aprovado!</h3>
                    <p class="text-green-700">A transação com o seu cartão foi autorizada com sucesso.</p>
                  </div>
                } @else if (pedido()!.pagamento.status === 'Recusado') {
                  <div class="mb-8 border border-red-200 bg-red-50 rounded-lg p-6 text-center">
                    <mat-icon class="!w-12 !h-12 !text-[48px] text-red-600 mb-2">credit_card_off</mat-icon>
                    <h3 class="text-lg font-bold text-red-900">Pagamento Recusado</h3>
                    <p class="text-red-700">Houve um problema com a autorização do seu cartão. Verifique o limite ou utilize outra forma de pagamento.</p>
                  </div>
                } @else {
                  <div class="mb-8 text-center text-gray-600">
                    <p>O pagamento com o seu cartão está sendo processado.</p>
                    <p class="text-sm">Você receberá um e-mail com as atualizações do status da entrega.</p>
                  </div>
                }
              }

              <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t border-gray-100">
                <a mat-stroked-button class="!h-12 !text-base" [routerLink]="['/usuario', this.usuarioAtual()?.id, 'pedidos']">
                  Acompanhar Pedido
                </a>
                <a mat-flat-button color="primary" class="!h-12 !text-base" routerLink="/">
                  Continuar Comprando
                </a>
              </div>

            </div>
          </div>
        }
      </div>
    </div>
  `
})
export default class PedidoSucessoPage {
  public readonly id = input.required<string>();

  private readonly pedidoService = inject(PedidoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  protected readonly usuarioAtual = this.authService.usuarioAtual;

  protected readonly pedido = signal<PedidoResponse | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);
  protected readonly simulandoPix = signal(false);

  constructor() {
    effect(() => {
      const pedidoId = Number(this.id());
      if (pedidoId) {
        this.carregarPedido(pedidoId);
      }
    });
  }

  private carregarPedido(id: number): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.pedidoService.get(id).subscribe({
      next: (dados) => {
        this.pedido.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }

  protected copiarPix(): void {
    const pagamento = this.pedido()?.pagamento;

    if (pagamento && this.isPagamentoPix(pagamento)) {
      navigator.clipboard.writeText(pagamento.codigoCopiaECola)
        .then(() => {
          this.snackBar.open('Código Pix copiado!', 'Fechar', { duration: 3000 });
        });
    }
  }

  protected simularPagamentoPix(): void {
    const pagamento = this.pedido()?.pagamento;
    console.log(pagamento);
    if (!pagamento || !this.isPagamentoPix(pagamento)) return;
    console.log("È pagamento pix");

    const txid = (pagamento as any).txid;
    if (!txid) return;
    this.simulandoPix.set(true);
    this.pedidoService.simularWebhookPix(txid).subscribe({
      next: () => {
        this.snackBar.open('Webhook simulado: Pagamento confirmado!', 'Fechar', { duration: 3000 });
        this.carregarPedido(this.pedido()!.id);
        this.simulandoPix.set(false);
      },
      error: () => {
        this.snackBar.open('Falha ao simular confirmação via Webhook.', 'Fechar', { duration: 3000 });
        this.simulandoPix.set(false);
      }
    });
  }

  protected isPagamentoPix(pagamento: PagamentoResponse): pagamento is PagamentoPixResponse {
    return pagamento.forma === 'Pix';
  }
}
