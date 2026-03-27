import {Component, inject, input, output} from '@angular/core';
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
    MatFabButton
  ]
})
export default class TecnologiaTableComponent {
  public tecnologias = input.required<Tecnologia[]>();

  public tecnologiaDeletada = output<Tecnologia>();

  private service = inject(TecnologiaService);
  private snackbarService = inject(SnackbarService);

  protected readonly colunas = ['acao', 'nome', 'descricao'];

  protected deletar(t: Tecnologia){
    this.service.deletar(t.id).subscribe({
      next: _ => {
        this.tecnologiaDeletada.emit(t);
        this.snackbarService.alertar('Tecnologia deletada com sucesso!')
      }
    })
  }
}
