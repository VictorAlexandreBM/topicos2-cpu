import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-checkout-resumo',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">

      <div class="flex items-center gap-2 mb-6">
        <mat-icon class="text-blue-600">receipt_long</mat-icon>
        <h2 class="text-xl font-bold text-gray-900 m-0">Resumo do Pedido</h2>
      </div>

      <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
        @if (cupomAplicado()) {
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2 text-green-700 font-medium">
              <mat-icon class="!w-5 !h-5 !text-[20px]">local_offer</mat-icon>
              Cupom "{{ cupomAplicado() }}" aplicado!
            </div>
            <button mat-icon-button color="warn" class="!w-8 !h-8" (click)="removerCupom.emit()" matTooltip="Remover Cupom">
              <mat-icon class="!text-lg">close</mat-icon>
            </button>
          </div>
        } @else {
          <div class="flex gap-2 items-start">
            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="flex-1">
              <mat-label>Cupom de Desconto</mat-label>
              <input matInput [(ngModel)]="codigoInput" placeholder="Ex: CABUM10" (keyup.enter)="tentarAplicarCupom()" [disabled]="processandoCupom()">
            </mat-form-field>
            <button mat-flat-button color="primary" class="!h-[40px]" (click)="tentarAplicarCupom()" [disabled]="!codigoInput || processandoCupom()">
              Aplicar
            </button>
          </div>
        }
      </div>

      <div class="space-y-4 mb-6">
        <div class="flex justify-between text-gray-600">
          <span>Produtos ({{ quantidadeItens() }} {{ quantidadeItens() === 1 ? 'item' : 'itens' }})</span>
          <span class="font-medium">{{ valorSubtotal() | currency:'BRL' }}</span>
        </div>

        @if (valorDesconto() > 0) {
          <div class="flex justify-between text-green-600 font-medium">
            <span>Desconto</span>
            <span>- {{ valorDesconto() | currency:'BRL' }}</span>
          </div>
        }

        <div class="flex justify-between text-gray-600">
          <span>Portes de Envio</span>
          <span class="text-sm font-medium text-green-600">Grátis</span>
        </div>
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
        {{ processando() ? 'A processar...' : 'Finalizar Pedido' }}
      </button>

      @if (!podeFinalizar() && !processando()) {
        <div class="mt-4 p-3 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 text-center flex items-start gap-2">
          <mat-icon class="!w-4 !h-4 !text-base text-gray-400 shrink-0">info</mat-icon>
          <span>Selecione uma morada de entrega e um método de pagamento válido para finalizar.</span>
        </div>
      }
    </div>
  `
})
export class CheckoutResumoComponent {
  public readonly quantidadeItens = input.required<number>();
  public readonly valorSubtotal = input.required<number>();
  public readonly valorDesconto = input.required<number>();
  public readonly valorTotal = input.required<number>();

  public readonly cupomAplicado = input<string | null>(null);
  public readonly processandoCupom = input<boolean>(false);

  public readonly podeFinalizar = input.required<boolean>();
  public readonly processando = input<boolean>(false);

  public readonly confirmarPedido = output<void>();
  public readonly aplicarCupom = output<string>();
  public readonly removerCupom = output<void>();

  protected codigoInput = '';

  protected tentarAplicarCupom(): void {
    if (this.codigoInput.trim()) {
      this.aplicarCupom.emit(this.codigoInput.trim());
      this.codigoInput = ''; // Limpa o input após enviar
    }
  }
}
