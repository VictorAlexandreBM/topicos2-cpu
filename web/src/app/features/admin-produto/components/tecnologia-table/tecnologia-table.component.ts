import {Component, input} from '@angular/core';
import {Tecnologia} from '../../models/tecnologia.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';

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
    MatRow
  ]
})
export default class TecnologiaTableComponent {
  public tecnologias = input.required<Tecnologia[]>();

  protected readonly colunas = ['nome', 'descricao'];

}
