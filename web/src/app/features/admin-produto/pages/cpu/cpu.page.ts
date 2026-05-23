import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import CpuService from '../../services/cpu.service';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import CpuTableComponent from '../../components/cpu/cpu-table/cpu-table.component';
import { CpuFiltroComponent } from '../../components/cpu/cpu-filtro/cpu-filtro.component';

@Component({
  selector: 'app-cpu-page',
  standalone: true,
  templateUrl: './cpu.page.html',
  imports: [
    CpuTableComponent,
    CpuFiltroComponent,
    MatIcon,
    MatButton
  ]
})
export default class CpuPage {
  private readonly service = inject(CpuService);
  private readonly router = inject(Router);

  private refreshTrigger = signal<ParametrosListagem>({
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

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro }));
  }

  handleMostrarIndisponiveis(indisponiveis: boolean) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, emVenda: !indisponiveis }));
  }

  novoCpu() {
    void this.router.navigate(['/admin/cpu/criar']);
  }
}
