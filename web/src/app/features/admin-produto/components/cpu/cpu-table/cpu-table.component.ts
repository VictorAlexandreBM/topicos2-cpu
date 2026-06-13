import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCellDef, MatCell, MatRowDef, MatHeaderRowDef, MatHeaderRow, MatRow } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

import { CpuList } from '@features/admin-produto/models/cpu.model';
import CpuService from '@features/admin-produto/services/cpu.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { BackendError } from '@core/models/backend-error.model';

@Component({
  selector: 'app-cpu-table',
  standalone: true,
  templateUrl: './cpu-table.component.html',
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
    CurrencyPipe,
    RouterLink,
    NgClass
  ]
})
export default class CpuTableComponent {
  public cpus = input.required<CpuList[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();
  public cpuDeletado = output<CpuList>();
  public cpuAlteradoEstado = output<CpuList>();

  private service = inject(CpuService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'imagem', 'sku', 'nomeComercial', 'nomeModelo', 'marca', 'preco', 'estoque', 'tipo'];

  protected async alterarEstadoVenda(cpu: CpuList, emVenda: boolean) {
    const titulo = emVenda ? 'Colocar à venda' : 'Retirar de venda';
    const mensagem = `Deseja realmente ${emVenda ? 'disponibilizar' : 'remover'} a CPU ${cpu.sku} do catálogo?`;

    const confirmado = await this.dialogService.alertar(titulo, mensagem);
    if (!confirmado) return;

    this.service.alterarEstadoVenda((cpu as any).id, emVenda).subscribe({
      next: () => {
        this.cpuAlteradoEstado.emit(cpu);
        this.snackbarService.alertar(`Status de venda da CPU ${cpu.sku} atualizado!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar status de venda: ' + (erro?.detail || 'Erro desconhecido'));
      }
    });
  }

  protected async deletar(cpu: CpuList) {
    const confirmado = await this.dialogService.alertar(
      'Deletar CPU',
      `Deseja realmente deletar a CPU ${cpu.sku}? Esta ação é irreversível.`
    );

    if (!confirmado) return;

    this.service.deletar((cpu as any).id).subscribe({
      next: () => {
        this.cpuDeletado.emit(cpu);
        this.snackbarService.alertar('CPU deletada com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar CPU: ' + (erro?.detail || 'Erro desconhecido'));
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

