import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { CpuList } from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-perfil-lista-desejos',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Lista de Desejos</h2>
        <p class="mt-1 text-sm text-gray-500">Produtos guardados para compras futuras.</p>
      </div>

      @if (carregando()) {
        <div class="flex justify-center items-center h-48">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (favoritos().length === 0) {
        <div class="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded border border-dashed border-gray-300">
          <mat-icon class="!w-12 !h-12 !text-[48px] text-gray-300 mb-3">favorite_border</mat-icon>
          <h3 class="text-lg font-medium text-gray-900">A sua lista está vazia</h3>
          <p class="text-sm text-gray-500 mt-1">Navegue pela loja e adicione produtos à sua lista.</p>
          <a mat-stroked-button color="primary" routerLink="/" class="mt-4">Ir para Vitrine</a>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (item of favoritos(); track item.id) {
            <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">

              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-50 rounded flex items-center justify-center p-1 shrink-0">
                  @if (item.imagemUrl) {
                    <img [src]="item.imagemUrl" class="max-h-full object-contain mix-blend-darken" [alt]="item.nomeComercial">
                  } @else {
                    <mat-icon class="text-gray-300">memory</mat-icon>
                  }
                </div>

                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-500 uppercase">{{ item.marca }}</span>
                  <a [routerLink]="['/produto', item.id]" class="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {{ item.nomeComercial }}
                  </a>
                  <span class="text-sm font-bold text-blue-600 mt-1">{{ item.preco | currency:'BRL' }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                <a mat-flat-button color="primary" [routerLink]="['/produto', item.id]">Ver Produto</a>
                <button mat-icon-button color="warn" (click)="remover(item.id)" title="Remover da lista">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>

            </div>
          }
        </div>
      }
    </div>
  `
})
export default class PerfilListaDesejosComponent implements OnInit {
  private readonly authService = inject(AuthService);
  protected favoritos = signal<CpuList[]>([]);
  protected carregando = signal(true);

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.carregando.set(true);
    this.authService.carregarFavoritos().subscribe({
      next: (dados) => {
        this.favoritos.set(dados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  protected remover(id: number): void {
    this.authService.toggleFavorito(id, true).subscribe(() => this.carregarDados());
  }
}
