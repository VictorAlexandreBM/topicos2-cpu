import { Component, inject, input, output } from '@angular/core';
import { Chipset } from '../../../models/chipset.model';
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
import ChipsetService from '../../../services/chipset.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendError } from '@core/models/backend-error.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chipset-table',
  templateUrl: './chipset-table.component.html',
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
export default class ChipsetTableComponent {
  public chipsets = input.required<Chipset[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public chipsetDeletado = output<Chipset>();
  public chipsetEditado = output<Chipset | null>();
  public chipsetAlteradoEstado = output<Chipset>();
  public chipsetEmEdicao = input<Chipset | null>(null);

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();

  private service = inject(ChipsetService);
  private snackbarService = inject(SnackbarService);
  private readonly dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'tipo', 'dataCriacao'];

  protected async deletar(c: Chipset) {
    const confirmado = await this.dialogService.alertar('Deletar chipset', 'Deseja realmente deletar este chipset?');

    if (!confirmado) return;

    this.service.deletar(c.id).subscribe({
      next: () => {
        this.chipsetDeletado.emit(c);
        this.snackbarService.alertar('Chipset deletado com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar chipset: ' + erro.detail);
      }
    });
  }

  protected async alterarEstado(c: Chipset, ativo: boolean) {
    if (!ativo) {
      const confirmado = await this.dialogService.alertar('Desativar chipset', 'Deseja realmente desativar este chipset?');
      if (!confirmado) return;
    }

    this.service.alterarEstado(c.id, ativo).subscribe({
      next: () => {
        this.chipsetAlteradoEstado.emit(c);
        this.snackbarService.alertar(`Chipset ${ativo ? 'ativado' : 'desativado'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar estado do chipset: ' + erro.detail);
      }
    });
  }

  protected emitirEdicao(c: Chipset) {
    if (this.chipsetEmEdicao()?.id === c.id) {
      this.chipsetEditado.emit(null);
    } else {
      this.chipsetEditado.emit(c);
    }
  }

  paginar(event: PageEvent) {
    this.mudancaPagina.emit(event);
  }

  ordenar(event: Sort) {
    this.mudancaOrdem.emit(event);
  }
}
