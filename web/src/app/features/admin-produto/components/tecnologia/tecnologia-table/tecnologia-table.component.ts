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
import {MatFabButton} from '@angular/material/button';
import TecnologiaService from '../../../services/tecnologia.service';
import {SnackbarService} from '../../../../../core/services/snackbar.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogService} from '../../../../../core/services/confirm-dialog.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {HttpErrorResponse} from '@angular/common/http';
import {BackendError, ValidationError} from '../../../../../core/models/backend-error.model';
import {MatProgressBar} from '@angular/material/progress-bar';

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
    MatFabButton,
    MatPaginator,
    MatProgressBar
  ]
})
export default class TecnologiaTableComponent {
  public tecnologias = input.required<Tecnologia[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();
  public mudancaPagina = output<PageEvent>();

  public tecnologiaDeletada = output<Tecnologia>();
  public tecnologiaEditada = output<Tecnologia>();
  public tecnologiaAlteradaEstado = output<Tecnologia>();
  public tecnologiaEmEdicao = input<Tecnologia | null>(null);

  private service = inject(TecnologiaService);
  private snackbarService = inject(SnackbarService);
  private readonly dialogService   = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'nome', 'descricao'];

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
}
