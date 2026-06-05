import { Component, input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CpuDetail } from '@features/admin-produto/models/cpu.model';
import { CarrinhoService } from '@features/pedido/services/carrinho.service'; // Ajuste o path se necessário

@Component({
  selector: 'app-produto-info',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">

      <div class="mb-4">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ cpu().modelo.marca.nome }} • SKU: {{ cpu().sku }}</span>
        <h1 class="text-2xl font-bold text-gray-900 mt-1">{{ cpu().nomeComercial }}</h1>
        <p class="text-sm text-gray-600 mt-2">Formato: <span class="font-semibold">{{ cpu().tipo|| 'Indisponível' }}</span></p>
      </div>

      <div class="mt-auto pt-6 border-t border-gray-100">
        <div class="mb-4">
          @if (cpu().estoque > 0) {
            <div class="text-3xl font-bold text-blue-600">{{ cpu().preco | currency:'BRL' }}</div>
            <div class="text-sm text-green-600 font-medium mt-1">Em estoque ({{ cpu().estoque }} unidades)</div>
          } @else {
            <div class="text-3xl font-bold text-gray-400">{{ cpu().preco | currency:'BRL' }}</div>
            <div class="text-sm text-red-600 font-medium mt-1">Produto esgotado</div>
          }
        </div>

        <button mat-flat-button color="primary" class="w-full !h-12 !text-lg"
                [disabled]="cpu().estoque <= 0"
                (click)="adicionarAoCarrinho()">
          <mat-icon>shopping_cart</mat-icon> Adicionar ao Carrinho
        </button>
      </div>

    </div>
  `
})
export class ProdutoInfoComponent {
  public readonly cpu = input.required<CpuDetail>();

  // Injeções
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly snackBar = inject(MatSnackBar);

  protected adicionarAoCarrinho(): void {
    // Adiciona 1 unidade ao carrinho
    this.carrinhoService.adicionarItem(this.cpu(), 1);

    // Exibe um alerta de sucesso no canto da tela
    this.snackBar.open(`${this.cpu().nomeComercial} adicionado ao carrinho!`, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
