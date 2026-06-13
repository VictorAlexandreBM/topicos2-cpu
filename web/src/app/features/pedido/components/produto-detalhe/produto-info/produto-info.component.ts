import { Component, input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CpuDetail } from '@features/admin-produto/models/cpu.model';
import { CarrinhoService } from '@features/pedido/services/carrinho.service';
import {AuthService} from '@features/cliente/services/auth.service';
import {Router} from '@angular/router'; // Ajuste o path se necessário

@Component({
  selector: 'app-produto-info',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">

      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ cpu().modelo.marca.nome }} • SKU: {{ cpu().sku }}</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-1">{{ cpu().nomeComercial }}</h1>
          <p class="text-sm text-gray-600 mt-2">Formato: <span class="font-semibold">{{ cpu().tipo|| 'Indisponível' }}</span></p>
        </div>

        <button mat-icon-button
                class="bg-gray-50 hover:bg-red-50 rounded-full transition-colors shrink-0"
                (click)="toggleFavorito()"
                [color]="isFavorito ? 'warn' : ''">
          <mat-icon>{{ isFavorito ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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

  protected get isFavorito(): boolean {
    return this.authService.favoritosIds().has(this.cpu().id);
  }

  protected toggleFavorito(): void {
    if (!this.authService.estaAutenticado()) {
      this.snackBar.open('Faça login para gerir a sua lista de desejos.', 'Fechar', { duration: 3000 });
      void this.router.navigate(['/login']);
      return;
    }

    const isFav = this.isFavorito;
    this.authService.toggleFavorito(this.cpu().id, isFav).subscribe({
      next: () => this.snackBar.open(isFav ? 'Removido da lista de desejos.' : 'Adicionado à lista de desejos!', 'Fechar', { duration: 3000 })
    });
  }
}
