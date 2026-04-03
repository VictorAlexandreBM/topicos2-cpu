import {Component, inject, input, output, signal} from '@angular/core';
import {Tecnologia} from '../../../models/tecnologia.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import TecnologiaService from '../../../services/tecnologia.service';
import {SnackbarService} from '../../../../../core/services/snackbar.service';
import {ConfirmDialogService} from '../../../../../core/services/confirm-dialog.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {HttpErrorResponse} from '@angular/common/http';
import {BackendError, ValidationError} from '../../../../../core/models/backend-error.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-tecnologia-table',
  templateUrl: './tecnologia-table.component.html',
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
export default class TecnologiaTableComponent {
  public tecnologias = input.required<Tecnologia[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public tecnologiaDeletada = output<Tecnologia>();
  public tecnologiaEditada = output<Tecnologia>();
  public tecnologiaAlteradaEstado = output<Tecnologia>();
  public tecnologiaEmEdicao = input<Tecnologia | null>(null);

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();

  private service = inject(TecnologiaService);
  private snackbarService = inject(SnackbarService);
  private readonly dialogService   = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'nome', 'descricao', 'dataCriacao'];

  protected async deletar(t: Tecnologia){

    const confirmado = await this.dialogService.alertar('Deletar tecnologia', 'Deseja realmente deletar esta tecnologia?');

    if (!confirmado) return;

    this.service.deletar(t.id).subscribe({
      next: _ => {
        this.tecnologiaDeletada.emit(t);
        this.snackbarService.alertar('Tecnologia deletada com sucesso!')
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar tecnologia: ' + erro.detail);
      }
    })
  }


  protected async alterarEstado(t: Tecnologia, ativo: boolean)
  {
    if (!ativo){
      const confirmado = await this.dialogService.alertar('Desativar tecnologia', 'Deseja realmente desativar esta tecnologia?');

      if (!confirmado) return;

    }

    this.service.alterarEstado(t.id, ativo).subscribe({
      next: _ => {
        this.tecnologiaAlteradaEstado.emit(t);
        this.snackbarService.alertar(`Tecnologia ${ativo ? 'Ativada' : 'Desativada'} com sucesso!`)
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao desativar tecnologia: ' + erro.detail);
      }
    })
  }

  protected emitirEdicao(t: Tecnologia){
    if (this.tecnologiaEmEdicao()?.id === t.id) {
      this.tecnologiaEditada.emit(null as any);
    } else {
      this.tecnologiaEditada.emit(t);
    }
  }

  paginar(event: PageEvent) {
    console.log(event);
    this.mudancaPagina.emit(event);
  }


  ordenar(event: Sort) {
    this.mudancaOrdem.emit(event);
  }
}
