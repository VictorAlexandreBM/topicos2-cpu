import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';

import SocketService from '../../services/socket.service';
import { Socket } from '../../models/socket.model';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import SocketTableComponent from '../../components/socket/socket-table/socket-table.component';
import { SocketFormComponent } from '../../components/socket/socket-form/socket-form.component';
import { SocketFiltroComponent } from '../../components/socket/socket-filtro/socket-filtro.component';

@Component({
  selector: 'app-socket-page',
  templateUrl: './socket.page.html',
  imports: [
    SocketTableComponent,
    MatIcon,
    SocketFiltroComponent,
    MatButton
  ]
})
export default class SocketPage {
  private readonly service = inject(SocketService);
  private dialog = inject(MatDialog);

  // Ordenação padrão alterada para 'tipo'
  private refreshTrigger = signal<ParametrosListagem>({ pagina: 0, tamanho: 10, filtro: '', ativo: true, campoOrdenacao: 'tipo', direcao: 'asc' });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);
  protected socketEmEdicao = signal<Socket | null>(null);

  private readonly socketsResponse$ = toObservable(this.refreshTrigger).pipe(
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

  protected readonly socketsResponse = toSignal(this.socketsResponse$);

  refreshSockets() {
    this.refreshTrigger.update((r) => ({ ...r }));
  }

  handleEdicao(s: Socket | null) {
    this.socketEmEdicao.set(s);
    if (!s) {
      this.abrirFormulario();
      return;
    }
    this.abrirFormulario(s);
  }

  handleDelecao(socket: Socket) {
    this.refreshSockets();
    if (this.socketEmEdicao() === socket) {
      this.socketEmEdicao.set(null);
      this.dialog.closeAll();
    }
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handleEstadoAlterado(socket: Socket) {
    this.refreshSockets();
    if (this.socketEmEdicao() === socket) {
      this.socketEmEdicao.set(null);
    }
  }

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro }));
  }

  handleMostrarInativos(mostrarInativos: boolean) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, ativo: !mostrarInativos }));
  }

  abrirFormulario(socket?: Socket) {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(SocketFormComponent, {
      position: { right: '0', top: '0', bottom: '0' },
      height: '100vh',
      width: '400px',
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'slide-over-panel',
      data: socket
    });

    const subCadastro = dialogRef.componentInstance.socketCadastrado.subscribe(() => {
      this.refreshSockets();
      this.socketEmEdicao.set(null);
    });

    const subAtualizacao = dialogRef.componentInstance.socketAtualizado.subscribe(() => {
      this.refreshSockets();
      this.socketEmEdicao.set(null);
      this.abrirFormulario();
    });

    const subCancelado = dialogRef.componentInstance.cadastroCancelado.subscribe(() => {
      this.socketEmEdicao.set(null);
    });

    dialogRef.afterClosed().subscribe(() => {
      subAtualizacao.unsubscribe();
      subCadastro.unsubscribe();
      subCancelado.unsubscribe();
    });
  }
}
