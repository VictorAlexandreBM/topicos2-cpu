import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemCarrinho } from '@features/pedido/models/carrinho.model';

@Component({
  selector: 'app-carrinho-lista',
  standalone: true,
  imports: [CurrencyPipe, MatCheckboxModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

      <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <mat-checkbox
          [checked]="todosSelecionados()"
          [indeterminate]="algumMasNaoTodosSelecionados()"
          (change)="alternarTodos.emit($event.checked)"
          color="primary">
          <span class="font-medium text-gray-700">Selecionar Todos</span>
        </mat-checkbox>
      </div>

      <div class="divide-y divide-gray-100">
        @if (itens().length === 0) {
          <div class="p-8 text-center text-gray-500">
            <mat-icon class="!w-12 !h-12 !text-5xl text-gray-300 mb-2">shopping_cart</mat-icon>
            <p>Seu carrinho está vazio.</p>
          </div>
        }

        @for (item of itens(); track item.produto.id) {
          <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors hover:bg-gray-50">

            <div class="pt-2 sm:pt-0">
              <mat-checkbox
                [checked]="item.selecionado"
                (change)="alternarItem.emit(item.produto.id)"
                color="primary">
              </mat-checkbox>
            </div>

            <div class="w-20 h-20 shrink-0 bg-white border border-gray-200 rounded flex items-center justify-center p-1 overflow-hidden">
              @if (item.produto.imagemUrl) {
                <img [src]="item.produto.imagemUrl"
                     [alt]="item.produto.nomeComercial"
                     class="max-w-full max-h-full object-contain mix-blend-darken" />
              } @else {
                <mat-icon class="text-gray-300 !w-10 !h-10 !text-[40px]">memory</mat-icon>
              }
            </div>

            <div class="flex-1 min-w-0">
              <span class="text-xs font-bold text-gray-500 uppercase">{{ item.produto.modelo.marca.nome }}</span>
              <h3 class="text-base font-semibold text-gray-900 truncate">{{ item.produto.nomeComercial }}</h3>
              <p class="text-sm text-gray-500">SKU: {{ item.produto.sku }}</p>
            </div>

            <div class="text-right sm:w-32">
              <div class="font-bold text-gray-900">{{ item.produto.preco | currency:'BRL' }}</div>
            </div>

            <div class="flex items-center gap-2 border border-gray-300 rounded-md p-1 bg-white">
              <button mat-icon-button class="!w-8 !h-8"
                      (click)="atualizarQtd.emit({id: item.produto.id, qtd: item.quantidade - 1})"
                      [disabled]="item.quantidade <= 1">
                <mat-icon class="!text-sm">remove</mat-icon>
              </button>

              <span class="w-8 text-center font-medium text-sm">{{ item.quantidade }}</span>

              <button mat-icon-button class="!w-8 !h-8"
                      (click)="atualizarQtd.emit({id: item.produto.id, qtd: item.quantidade + 1})"
                      [disabled]="item.quantidade >= item.produto.estoque">
                <mat-icon class="!text-sm">add</mat-icon>
              </button>
            </div>

            <div class="ml-auto sm:ml-4">
              <button mat-icon-button color="warn" (click)="remover.emit(item.produto.id)" matTooltip="Remover item">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class CarrinhoListaComponent {
  public readonly itens = input.required<ItemCarrinho[]>();
  public readonly todosSelecionados = input.required<boolean>();

  protected algumMasNaoTodosSelecionados(): boolean {
    const selecionados = this.itens().filter(i => i.selecionado).length;
    return selecionados > 0 && selecionados < this.itens().length;
  }

  public readonly alternarTodos = output<boolean>();
  public readonly alternarItem = output<number>();
  public readonly atualizarQtd = output<{id: number, qtd: number}>();
  public readonly remover = output<number>();
}
