import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import ChipsetService from '../../services/chipset.service';
import { Chipset } from '../../models/chipset.model';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import ChipsetTableComponent from '../../components/chipset/chipset-table/chipset-table.component';
import { ChipsetFormComponent } from '../../components/chipset/chipset-form/chipset-form.component';
import { ChipsetFiltroComponent } from '../../components/chipset/chipset-filtro/chipset-filtro.component';

@Component({
  selector: 'app-chipset-page',
  templateUrl: './chipset.page.html',
  imports: [
    ChipsetTableComponent,
    MatIcon,
    ChipsetFiltroComponent,
    MatButton
  ]
})
export default class ChipsetPage {
  private readonly service = inject(ChipsetService);
  private dialog = inject(MatDialog);

  // Ordenação padrão ajustada para 'tipo'
  private refreshTrigger = signal<ParametrosListagem>({ pagina: 0, tamanho: 10, filtro: '', ativo: true, campoOrdenacao: 'tipo', direcao: 'asc' });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);
  protected chipsetEmEdicao = signal<Chipset | null>(null);

  private readonly chipsetsResponse$ = toObservable(this.refreshTrigger).pipe(
    tap(() => {
      this.estaCarregando.set(true);
      this.erroGerado.set(null);
    }),
    switchMap(r =>
      this.service.listar(r).pipe(
        finalize(() => this.estaCarregando.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.erroGerado.set(err);
          return throwError(() => err);
        })
      ))
  );

  protected readonly chipsetsResponse = toSignal(this.chipsetsResponse$);

  refreshChipsets() {
    this.refreshTrigger.update((r) => ({ ...r }));
  }

  handleEdicao(c: Chipset | null) {
    this.chipsetEmEdicao.set(c);
    if (!c) {
      this.abrirFormulario();
      return;
    }
    this.abrirFormulario(c);
  }

  handleDelecao(chipset: Chipset) {
    this.refreshChipsets();
    if (this.chipsetEmEdicao() === chipset) {
      this.chipsetEmEdicao.set(null);
      this.dialog.closeAll();
    }
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handleEstadoAlterado(chipset: Chipset) {
    this.refreshChipsets();
    if (this.chipsetEmEdicao() === chipset) {
      this.chipsetEmEdicao.set(null);
    }
  }

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro }));
  }

  handleMostrarInativos(mostrarInativos: boolean) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, ativo: !mostrarInativos }));
  }

  abrirFormulario(chipset?: Chipset) {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(ChipsetFormComponent, {
      width: '500px',
      maxWidth: '95vw',
      hasBackdrop: true,
      disableClose: false,
      data: chipset
    });

    const subCadastro = dialogRef.componentInstance.chipsetCadastrado.subscribe(() => {
      this.refreshChipsets();
      this.chipsetEmEdicao.set(null);
      dialogRef.close();
    });

    const subAtualizacao = dialogRef.componentInstance.chipsetAtualizado.subscribe(() => {
      this.refreshChipsets();
      this.chipsetEmEdicao.set(null);
      dialogRef.close();
    });

    const subCancelado = dialogRef.componentInstance.cadastroCancelado.subscribe(() => {
      this.chipsetEmEdicao.set(null);
    });

    dialogRef.afterClosed().subscribe(() => {
      subAtualizacao.unsubscribe();
      subCadastro.unsubscribe();
      subCancelado.unsubscribe();
      this.chipsetEmEdicao.set(null);
    });
  }
}
