import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import MarcaService from '../../services/marca.service';
import { Marca } from '../../models/marca.model';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import MarcaTableComponent from '../../components/marca/marca-table/marca-table.component';
import { MarcaFormComponent } from '../../components/marca/marca-form/marca-form.component';
import { MarcaFiltroComponent } from '../../components/marca/marca-filtro/marca-filtro.component';

@Component({
  selector: 'app-marca-page',
  standalone: true,
  templateUrl: './marca.page.html',
  imports: [
    MarcaTableComponent,
    MatIcon,
    MarcaFiltroComponent,
    MatButton
  ]
})
export default class MarcaPage {
  private readonly service = inject(MarcaService);
  private dialog = inject(MatDialog);

  // Ordenação padrão ajustada para 'nome'
  private refreshTrigger = signal<ParametrosListagem>({ pagina: 0, tamanho: 10, filtro: '', ativo: true, campoOrdenacao: 'nome', direcao: 'asc' });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);
  protected marcaEmEdicao = signal<Marca | null>(null);

  private readonly marcasResponse$ = toObservable(this.refreshTrigger).pipe(
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

  protected readonly marcasResponse = toSignal(this.marcasResponse$);

  refreshMarcas() {
    this.refreshTrigger.update((r) => ({ ...r }));
  }

  handleEdicao(m: Marca | null) {
    this.marcaEmEdicao.set(m);
    if (!m) {
      this.abrirFormulario();
      return;
    }
    this.abrirFormulario(m);
  }

  handleDelecao(marca: Marca) {
    this.refreshMarcas();
    if (this.marcaEmEdicao() === marca) {
      this.marcaEmEdicao.set(null);
      this.dialog.closeAll();
    }
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handleEstadoAlterado(marca: Marca) {
    this.refreshMarcas();
    if (this.marcaEmEdicao() === marca) {
      this.marcaEmEdicao.set(null);
    }
  }

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro }));
  }

  handleMostrarInativos(mostrarInativos: boolean) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, ativo: !mostrarInativos }));
  }

  abrirFormulario(marca?: Marca) {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(MarcaFormComponent, {
      width: '500px',
      maxWidth: '95vw',
      hasBackdrop: true,
      disableClose: false,
      data: marca
    });

    const subCadastro = dialogRef.componentInstance.marcaCadastrada.subscribe(() => {
      this.refreshMarcas();
      this.marcaEmEdicao.set(null);
      dialogRef.close();
    });

    const subAtualizacao = dialogRef.componentInstance.marcaAtualizada.subscribe(() => {
      this.refreshMarcas();
      this.marcaEmEdicao.set(null);
      dialogRef.close();
    });

    const subCancelado = dialogRef.componentInstance.cadastroCancelado.subscribe(() => {
      this.marcaEmEdicao.set(null);
    });

    dialogRef.afterClosed().subscribe(() => {
      subAtualizacao.unsubscribe();
      subCadastro.unsubscribe();
      subCancelado.unsubscribe();
      this.marcaEmEdicao.set(null);
    });
  }
}
