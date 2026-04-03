import { Component, inject, input, output } from '@angular/core';
import { Marca } from '../../../models/marca.model';
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
import MarcaService from '../../../services/marca.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendError } from '@core/models/backend-error.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-marca-table',
  standalone: true,
  templateUrl: './marca-table.component.html',
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
export default class MarcaTableComponent {
  public marcas = input.required<Marca[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public marcaDeletada = output<Marca>();
  public marcaEditada = output<Marca | null>();
  public marcaAlteradaEstado = output<Marca>();
  public marcaEmEdicao = input<Marca | null>(null);

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();

  private service = inject(MarcaService);
  private snackbarService = inject(SnackbarService);
  private readonly dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'nome', 'dataCriacao'];

  protected async deletar(m: Marca) {
    const confirmado = await this.dialogService.alertar('Deletar marca', 'Deseja realmente deletar esta marca?');

    if (!confirmado) return;

    this.service.deletar(m.id).subscribe({
      next: () => {
        this.marcaDeletada.emit(m);
        this.snackbarService.alertar('Marca deletada com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar marca: ' + erro.detail);
      }
    });
  }

  protected async alterarEstado(m: Marca, ativo: boolean) {
    if (!ativo) {
      const confirmado = await this.dialogService.alertar('Desativar marca', 'Deseja realmente desativar esta marca?');
      if (!confirmado) return;
    }

    this.service.alterarEstado(m.id, ativo).subscribe({
      next: () => {
        this.marcaAlteradaEstado.emit(m);
        this.snackbarService.alertar(`Marca ${ativo ? 'ativada' : 'desativada'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar estado da marca: ' + erro.detail);
      }
    });
  }

  protected emitirEdicao(m: Marca) {
    if (this.marcaEmEdicao()?.id === m.id) {
      this.marcaEditada.emit(null);
    } else {
      this.marcaEditada.emit(m);
    }
  }

  paginar(event: PageEvent) {
    this.mudancaPagina.emit(event);
  }

  ordenar(event: Sort) {
    this.mudancaOrdem.emit(event);
  }
}
