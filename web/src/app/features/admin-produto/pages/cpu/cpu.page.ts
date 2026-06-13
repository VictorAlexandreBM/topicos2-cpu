import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import CpuService from '../../services/cpu.service';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { CpuFilter } from '@features/admin-produto/models/cpu.model';
import CpuTableComponent from '../../components/cpu/cpu-table/cpu-table.component';
import { CpuFiltroComponent } from '../../components/cpu/cpu-filtro/cpu-filtro.component';

export interface CpuFilterParams extends ParametrosListagem, CpuFilter {}

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  templateUrl: './cpu.page.html',
  imports: [
    CpuTableComponent,
    CpuFiltroComponent,
    MatIconModule,
    MatButtonModule
  ]
})
export default class CpuPage {
  private readonly service = inject(CpuService);
  private readonly router = inject(Router);

  private refreshTrigger = signal<CpuFilterParams>({
    pagina: 0,
    tamanho: 10,
    emVenda: true,
    campoOrdenacao: 'sku',
    direcao: 'asc'
  });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);

  private readonly cpusResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(params => {
      this.estaCarregando.set(true);
      this.erroGerado.set(null);
      return this.service.listar(params).pipe(
        finalize(() => this.estaCarregando.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.erroGerado.set(err);
          return throwError(() => err);
        })
      );
    })
  );

  protected readonly cpusResponse = toSignal(this.cpusResponse$);

  handleRefresh() {
    this.refreshTrigger.update(r => ({ ...r }));
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handleFiltros(filtros: CpuFilter) {
    this.refreshTrigger.update(r => ({
      ...r,
      pagina: 0,
      nome: undefined, nomeModelo: undefined, tipoCPU: undefined, marcaId: undefined,
      socketId: undefined, chipsetsId: undefined, tecnologiasId: undefined,
      minPreco: undefined, maxPreco: undefined, minCores: undefined, maxCores: undefined,
      minFreq: undefined, maxFreq: undefined, tdpBase: undefined,
      ...filtros
    }));
  }

  novoCpu() {
    void this.router.navigate(['/admin/cpu/criar']);
  }
}
