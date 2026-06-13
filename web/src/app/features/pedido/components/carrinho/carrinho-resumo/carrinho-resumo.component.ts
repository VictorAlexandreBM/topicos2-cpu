import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-carrinho-resumo',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatDividerModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">

      <h2 class="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

      <div class="space-y-4 mb-6">
        <div class="flex justify-between text-gray-600">
          <span>Subtotal ({{ quantidadeSelecionada() }} {{ quantidadeSelecionada() === 1 ? 'item' : 'itens' }})</span>
          <span class="font-medium">{{ valorTotal() | currency:'BRL' }}</span>
        </div>

        <div class="flex justify-between text-gray-600">
          <span>Frete</span>
          <span class="text-sm">Calculado no checkout</span>
        </div>
      </div>

      <mat-divider class="!mb-4"></mat-divider>

      <div class="flex justify-between items-center mb-6">
        <span class="text-lg font-bold text-gray-900">Total</span>
        <span class="text-2xl font-bold text-blue-600">{{ valorTotal() | currency:'BRL' }}</span>
      </div>

      <button mat-flat-button color="primary"
              class="w-full !h-12 !text-base font-semibold"
              [disabled]="quantidadeSelecionada() === 0"
              (click)="avancarCheckout.emit()">
        Continuar para Pagamento
      </button>

      @if (quantidadeSelecionada() === 0) {
        <p class="text-xs text-red-500 text-center mt-3 font-medium">
          Selecione pelo menos um item para continuar.
        </p>
      }
    </div>
  `
})
export class CarrinhoResumoComponent {
  public readonly quantidadeSelecionada = input.required<number>();
  public readonly valorTotal = input.required<number>();

  public readonly avancarCheckout = output<void>();
}
