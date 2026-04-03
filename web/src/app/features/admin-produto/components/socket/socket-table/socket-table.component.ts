import { Component, inject, input, output } from '@angular/core';
import { Socket } from '../../../models/socket.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import SocketService from '../../../services/socket.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendError } from '@core/models/backend-error.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-socket-table',
  templateUrl: './socket-table.component.html',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatIcon,
    MatPaginator,
    MatIconButton,
    MatProgressSpinner,
    MatSort,
    MatSortHeader,
    DatePipe
  ]
})
export default class SocketTableComponent {
  public sockets = input.required<Socket[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public socketDeletado = output<Socket>();
  public socketEditado = output<Socket | null>();
  public socketAlteradoEstado = output<Socket>();
  public socketEmEdicao = input<Socket | null>(null);

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();

  private service = inject(SocketService);
  private snackbarService = inject(SnackbarService);
  private readonly dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'tipo', 'dataCriacao'];

  protected async deletar(s: Socket) {
    const confirmado = await this.dialogService.alertar('Deletar socket', 'Deseja realmente deletar este socket?');

    if (!confirmado) return;

    this.service.deletar(s.id).subscribe({
      next: () => {
        this.socketDeletado.emit(s);
        this.snackbarService.alertar('Socket deletado com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar socket: ' + erro.detail);
      }
    });
  }

  protected async alterarEstado(s: Socket, ativo: boolean) {
    if (!ativo) {
      const confirmado = await this.dialogService.alertar('Desativar socket', 'Deseja realmente desativar este socket?');
      if (!confirmado) return;
    }

    this.service.alterarEstado(s.id, ativo).subscribe({
      next: () => {
        this.socketAlteradoEstado.emit(s);
        this.snackbarService.alertar(`Socket ${ativo ? 'ativado' : 'desativado'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar estado do socket: ' + erro.detail);
      }
    });
  }

  protected emitirEdicao(s: Socket) {
    if (this.socketEmEdicao()?.id === s.id) {
      this.socketEditado.emit(null);
    } else {
      this.socketEditado.emit(s);
    }
  }

  paginar(event: PageEvent) {
    this.mudancaPagina.emit(event);
  }

  ordenar(event: Sort) {
    this.mudancaOrdem.emit(event);
  }
}
