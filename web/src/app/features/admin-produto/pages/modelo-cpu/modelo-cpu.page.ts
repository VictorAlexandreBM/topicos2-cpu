import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import ModeloCpuService from '../../services/modelo-cpu.service';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import ModeloCpuTableComponent from '../../components/modelo-cpu/modelo-cpu-table/modelo-cpu-table.component';
import { ModeloCpuFiltroComponent } from '../../components/modelo-cpu/modelo-cpu-filtro/modelo-cpu-filtro.component';

export interface ModeloCpuFilterParams extends ParametrosListagem {
  nome?: string;
  marcaId?: number[];
  socketId?: number[];
  minCores?: number;
  maxCores?: number;
  minFreq?: number;
  maxFreq?: number;
  ativo?: boolean;
}

@Component({
  selector: 'app-modelo-cpu-page',
  standalone: true,
  templateUrl: './modelo-cpu.page.html',
  imports: [
    ModeloCpuTableComponent,
    ModeloCpuFiltroComponent,
    MatIconModule,
    MatButtonModule
  ]
})
export default class ModeloCpuPage {
  private readonly service = inject(ModeloCpuService);
  private readonly router = inject(Router);

  private refreshTrigger = signal<ModeloCpuFilterParams>({
    pagina: 0,
    tamanho: 10,
    ativo: true,
    campoOrdenacao: 'nome',
    direcao: 'asc'
  });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);

  private readonly modelosResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(r => {
      this.estaCarregando.set(true);
      this.erroGerado.set(null);
      return this.service.listar(r).pipe(
        finalize(() => this.estaCarregando.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.erroGerado.set(err);
          return throwError(() => err);
        })
      );
    })
  );

  protected readonly modelosResponse = toSignal(this.modelosResponse$);

  refresh() {
    this.refreshTrigger.update(r => ({ ...r }));
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handleFiltros(filtros: any) {
    this.refreshTrigger.update(r => ({
      ...r,
      pagina: 0,
      // Limpa chaves antigas caso tenham sido apagadas na UI
      nome: undefined, marcaId: undefined, socketId: undefined,
      minCores: undefined, maxCores: undefined, minFreq: undefined, maxFreq: undefined,
      // Espalha as novas propriedades
      ...filtros
    }));
  }

  handleDelecao() {
    this.refresh();
  }

  handleEstadoAlterado() {
    this.refresh();
  }

  novoModelo() {
    void this.router.navigate(['/admin/modelo-cpu/criar']);
  }
}
