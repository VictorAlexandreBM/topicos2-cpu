import { Component, inject, input, output } from '@angular/core';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ModeloCpuList } from '@features/admin-produto/models/modelo-cpu/modelo-cpu.model';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { BackendError } from '@core/models/backend-error.model';
import ModeloCpuService from '@features/admin-produto/services/modelo-cpu.service';

@Component({
  selector: 'app-modelo-cpu-table',
  standalone: true,
  templateUrl: './modelo-cpu-table.component.html',
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
    DecimalPipe,
    RouterLink,
    NgClass
  ]
})
export default class ModeloCpuTableComponent {
  public modelos = input.required<ModeloCpuList[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();
  public modeloDeletado = output<ModeloCpuList>();
  public modeloAlteradoEstado = output<ModeloCpuList>();

  private service = inject(ModeloCpuService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'nome', 'nomeMarca', 'tipoSocket', 'quantNucleos', 'frequenciaMaxima'];

  protected async alterarEstado(m: ModeloCpuList, ativo: boolean) {
    if (!ativo) {
      const confirmado = await this.dialogService.alertar('Desativar modelo', 'Deseja realmente desativar este modelo de CPU?');
      if (!confirmado) return;
    }

    this.service.alterarEstado(m.id, ativo).subscribe({
      next: () => {
        this.modeloAlteradoEstado.emit(m);
        this.snackbarService.alertar(`Modelo de CPU ${ativo ? 'ativado' : 'desativado'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar estado do modelo de CPU: ' + erro.detail);
      }
    });
  }

  protected async deletar(m: ModeloCpuList) {
    const confirmado = await this.dialogService.alertar('Deletar modelo', 'Deseja realmente deletar este modelo de CPU?');

    if (!confirmado) return;

    this.service.deletar(m.id).subscribe({
      next: () => {
        this.modeloDeletado.emit(m);
        this.snackbarService.alertar('Modelo de CPU deletado com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar modelo de CPU: ' + erro.detail);
      }
    });
  }

  paginar(event: PageEvent) {
    this.mudancaPagina.emit(event);
  }

  ordenar(event: Sort) {
    this.mudancaOrdem.emit(event);
  }
}
