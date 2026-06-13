import { Component, input, output, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CartaoDetail } from '@features/cliente/models/cartao.model';
import {UpperCasePipe} from '@angular/common';

export type FormaPagamento = 'PIX' | 'CREDITO' | 'DEBITO';

export interface SelecaoPagamento {
  forma: FormaPagamento;
  cartaoId?: number;
  parcelas?: number;
}

@Component({
  selector: 'app-checkout-pagamento',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    UpperCasePipe
  ],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-2 mb-6">
        <mat-icon class="text-blue-600">payment</mat-icon>
        <h2 class="text-xl font-bold text-gray-900 m-0">Forma de Pagamento</h2>
      </div>

      <mat-button-toggle-group class="w-full mb-6" [value]="metodo()" (change)="mudarMetodo($event.value)" aria-label="Método de Pagamento">
        <mat-button-toggle value="PIX" class="flex-1 text-center font-medium">Pix</mat-button-toggle>
        <mat-button-toggle value="CREDITO" class="flex-1 text-center font-medium">Cartão de Crédito</mat-button-toggle>
        <mat-button-toggle value="DEBITO" class="flex-1 text-center font-medium">Cartão de Débito</mat-button-toggle>
      </mat-button-toggle-group>

      <div class="min-h-[150px] p-4 bg-gray-50 rounded-lg border border-gray-100">

        @if (metodo() === 'PIX') {
          <div class="flex flex-col items-center justify-center text-center py-4">
            <mat-icon class="!w-12 !h-12 !text-5xl text-teal-500 mb-2">qr_code_2</mat-icon>
            <p class="text-gray-700 font-medium">O código Pix e o QR Code serão gerados após a finalização do pedido.</p>
            <p class="text-sm text-gray-500 mt-1">O pagamento é aprovado na hora.</p>
          </div>
        }

        @if (metodo() === 'CREDITO' || metodo() === 'DEBITO') {
          <div class="space-y-4">
            @if (cartoes().length === 0) {
              <div class="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 text-sm">
                Você não possui cartões cadastrados. Acesse seu perfil para adicionar um cartão.
              </div>
            } @else {
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Selecione um cartão salvo</mat-label>
                <mat-select [value]="cartaoIdSelecionado()" (selectionChange)="mudarCartao($event.value)">
                  @for (cartao of cartoes(); track cartao.id) {
                    <mat-option [value]="cartao.id">
                      {{ cartao.bandeira | uppercase }} terminado em {{ cartao.ultimos4 }} (Exp: {{ cartao.mesExpiracao }}/{{ cartao.anoExpiracao }})
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              @if (metodo() === 'CREDITO') {
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Número de parcelas</mat-label>
                  <mat-select [value]="parcelasSelecionadas()" (selectionChange)="mudarParcelas($event.value)" [disabled]="!cartaoIdSelecionado()">
                    @for (p of opcoesParcelamento; track p) {
                      <mat-option [value]="p">{{ p }}x sem juros</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }
            }
          </div>
        }
      </div>
    </div>
  `
})
export class CheckoutPagamentoComponent {
  public readonly cartoes = input.required<CartaoDetail[]>();

  public readonly pagamentoSelecionado = output<SelecaoPagamento | null>();

  protected readonly metodo = signal<FormaPagamento>('PIX');
  protected readonly cartaoIdSelecionado = signal<number | null>(null);
  protected readonly parcelasSelecionadas = signal<number>(1);
  protected readonly opcoesParcelamento = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor() {
    effect(() => {
      this.emitirEstadoValido();
    });
  }

  protected mudarMetodo(novoMetodo: FormaPagamento): void {
    this.metodo.set(novoMetodo);
    this.cartaoIdSelecionado.set(null);
    this.parcelasSelecionadas.set(1);
  }

  protected mudarCartao(id: number): void {
    this.cartaoIdSelecionado.set(id);
  }

  protected mudarParcelas(parcelas: number): void {
    this.parcelasSelecionadas.set(parcelas);
  }

  /**
   * Avalia as regras de negócio de cada método.
   * Só emite o objeto se todos os requisitos daquele método estiverem preenchidos.
   */
  private emitirEstadoValido(): void {
    const atual = this.metodo();
    const cartao = this.cartaoIdSelecionado();
    const parcelas = this.parcelasSelecionadas();

    if (atual === 'PIX') {
      this.pagamentoSelecionado.emit({ forma: 'PIX' });
      return;
    }

    if (atual === 'DEBITO') {
      if (cartao) {
        this.pagamentoSelecionado.emit({ forma: 'DEBITO', cartaoId: cartao });
      } else {
        this.pagamentoSelecionado.emit(null);
      }
      return;
    }

    if (atual === 'CREDITO') {
      if (cartao && parcelas > 0) {
        this.pagamentoSelecionado.emit({ forma: 'CREDITO', cartaoId: cartao, parcelas: parcelas });
      } else {
        this.pagamentoSelecionado.emit(null);
      }
    }
  }
}
