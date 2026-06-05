import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { CarrinhoService } from '../../services/carrinho.service';
import {CarrinhoListaComponent} from '@features/pedido/components/carrinho/carrinho-lista/carrinho-lista.component';
import {CarrinhoResumoComponent} from '@features/pedido/components/carrinho/carrinho-resumo/carrinho-resumo.component';

@Component({
  selector: 'app-carrinho-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CarrinhoListaComponent,
    CarrinhoResumoComponent,
    CarrinhoListaComponent,
    CarrinhoResumoComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center gap-4 mb-8">
          <a mat-icon-button routerLink="/vitrine" aria-label="Voltar para a loja">
            <mat-icon>arrow_back</mat-icon>
          </a>
          <h1 class="text-3xl font-bold text-gray-900 m-0">Meu Carrinho</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div class="lg:col-span-8">
            <app-carrinho-lista
              [itens]="carrinhoService.itens()"
              [todosSelecionados]="carrinhoService.todosSelecionados()"
              (alternarTodos)="carrinhoService.alternarSelecaoTodos($event)"
              (alternarItem)="carrinhoService.alternarSelecao($event)"
              (atualizarQtd)="carrinhoService.atualizarQuantidade($event.id, $event.qtd)"
              (remover)="carrinhoService.removerItem($event)">
            </app-carrinho-lista>
          </div>

          <div class="lg:col-span-4">
            <app-carrinho-resumo
              [quantidadeSelecionada]="carrinhoService.quantidadeSelecionada()"
              [valorTotal]="carrinhoService.valorTotalSelecionado()"
              (avancarCheckout)="irParaCheckout()">
            </app-carrinho-resumo>
          </div>

        </div>

      </div>
    </div>
  `
})
export default class CarrinhoPage {
  // Injeção direta no template e na classe
  protected readonly carrinhoService = inject(CarrinhoService);
  private readonly router = inject(Router);

  protected irParaCheckout(): void {
    // Aqui você navegará para a página onde o usuário escolhe endereço e tipo de pagamento
    this.router.navigate(['/checkout']);
  }
}
