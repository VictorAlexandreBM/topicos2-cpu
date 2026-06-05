import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkout-resumo',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatDividerModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">

      <div class="flex items-center gap-2 mb-6">
        <mat-icon class="text-blue-600">receipt_long</mat-icon>
        <h2 class="text-xl font-bold text-gray-900 m-0">Resumo do Pedido</h2>
      </div>

      <div class="space-y-4 mb-6">
        <div class="flex justify-between text-gray-600">
          <span>Produtos ({{ quantidadeItens() }} {{ quantidadeItens() === 1 ? 'item' : 'itens' }})</span>
          <span class="font-medium">{{ valorTotal() | currency:'BRL' }}</span>
        </div>

        <div class="flex justify-between text-gray-600">
          <span>Frete</span>
          <span class="text-sm font-medium text-green-600">Grátis</span> </div>
      </div>

      <mat-divider class="!mb-4"></mat-divider>

      <div class="flex justify-between items-center mb-6">
        <span class="text-lg font-bold text-gray-900">Total a pagar</span>
        <span class="text-2xl font-bold text-blue-600">{{ valorTotal() | currency:'BRL' }}</span>
      </div>

      <button mat-flat-button color="primary"
              class="w-full !h-14 !text-lg font-bold"
              [disabled]="!podeFinalizar() || processando()"
              (click)="confirmarPedido.emit()">
        {{ processando() ? 'Processando...' : 'Finalizar Pedido' }}
      </button>

      @if (!podeFinalizar() && !processando()) {
        <div class="mt-4 p-3 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 text-center flex items-start gap-2">
          <mat-icon class="!w-4 !h-4 !text-base text-gray-400 shrink-0">info</mat-icon>
          <span>Selecione um endereço de entrega e uma forma de pagamento válida para habilitar a finalização.</span>
        </div>
      }
    </div>
  `
})
export class CheckoutResumoComponent {
  // Dados financeiros
  public readonly quantidadeItens = input.required<number>();
  public readonly valorTotal = input.required<number>();

  // Controles de estado vindos da página orquestradora
  public readonly podeFinalizar = input.required<boolean>();
  public readonly processando = input<boolean>(false);

  // Ação final
  public readonly confirmarPedido = output<void>();
}
