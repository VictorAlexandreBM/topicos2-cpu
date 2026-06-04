import { Component, effect, inject, input, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';


import { ProdutoGaleriaComponent } from '../../components/produto-detalhe/produto-galeria/produto-galeria.component';
import { ProdutoInfoComponent } from '../../components/produto-detalhe/produto-info/produto-info.component';
import { ProdutoSpecsComponent } from '../../components/produto-detalhe/produto-specs/produto-specs.component';
import CpuService from '@features/admin-produto/services/cpu.service';
import {CpuDetail} from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-produto-detalhe-page',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    ProdutoGaleriaComponent,
    ProdutoInfoComponent,
    ProdutoSpecsComponent
  ],
  templateUrl: './produto-detalhe.page.html'
})
export default class ProdutoDetalhePage {
  // Recebe o ID da rota via Input Binding (ex: /produto/5)
  public readonly id = input<string>();

  private readonly cpuService = inject(CpuService);

  protected readonly cpu = signal<CpuDetail | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  constructor() {
    effect(() => {
      const cpuId = this.id();
      if (cpuId) {
        this.carregarProduto(Number(cpuId));
      }
    });
  }

  private carregarProduto(id: number): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.cpuService.get(id).subscribe({
      next: (dados) => {
        this.cpu.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }
}
