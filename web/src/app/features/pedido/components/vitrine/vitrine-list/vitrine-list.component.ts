import { Component, effect, inject, input, signal } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {CpuFilter, CpuList} from '@features/admin-produto/models/cpu.model';
import CpuService from '@features/admin-produto/services/cpu.service';
import {AuthService} from '@features/cliente/services/auth.service';
import {SnackbarService} from '@core/services/snackbar.service';


@Component({
  selector: 'app-vitrine-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './vitrine-list.component.html'
})
export class VitrineListComponent {
  public readonly filtros = input<CpuFilter>({});

  private readonly cpuService = inject(CpuService);
  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);

  protected readonly cpus = signal<CpuList[]>([]);
  protected readonly totalCpus = signal(0);
  protected readonly carregando = signal(true);

  protected readonly paginaAtual = signal(0);
  protected readonly tamanhoPagina = signal(12);


  constructor() {
    effect(() => {
      this.carregarCpus(this.filtros(), this.paginaAtual(), this.tamanhoPagina());
    });
  }

  private carregarCpus(filtros: CpuFilter, pagina: number, tamanho: number): void {
    this.carregando.set(true);

    const params = {
      ...filtros,
      pagina,
      tamanho,
      emVenda: true
    };

    this.cpuService.listar(params).subscribe({
      next: (resposta) => {
        this.cpus.set(resposta.dados);
        this.totalCpus.set(resposta.total);
        this.carregando.set(false);
      },
      error: () => {
        this.cpus.set([]);
        this.carregando.set(false);
      }
    });
  }

  protected mudarPagina(event: PageEvent): void {
    this.paginaAtual.set(event.pageIndex);
    this.tamanhoPagina.set(event.pageSize);
  }

  protected isFavorito(cpuId: number): boolean {
    return this.authService.favoritosIds().has(cpuId);
  }

  protected toggleFavorito(cpuId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.estaAutenticado()) {
      this.snackbarService.alertar('Faça login para adicionar à lista de desejos.');
      void this.router.navigate(['/login']);
      return;
    }

    const isFav = this.isFavorito(cpuId);
    this.authService.toggleFavorito(cpuId, isFav).subscribe({
      next: () => this.snackbarService.alertar(isFav ? 'Removido da lista de desejos.' : 'Adicionado à lista de desejos!'),
      error: () => this.snackbarService.alertar('Erro ao atualizar lista de desejos.')
    });
  }
}
