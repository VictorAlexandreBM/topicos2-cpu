import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { PedidoResponse } from '@features/pedido/models/pedido.model';

@Component({
  selector: 'app-usuario-pedidos-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <h2 mat-dialog-title class="!font-bold">Pedidos do Cliente</h2>

    <mat-dialog-content class="!pb-4 !min-w-[500px]">
      @if (pedidos.length === 0) {
        <p class="text-gray-500 py-4 text-center">Este usuário não possui pedidos registrados.</p>
      } @else {
        <table mat-table [dataSource]="pedidos" class="w-full mt-2 border border-gray-100 rounded">

          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let p" class="font-medium"> #{{ p.id }} </td>
          </ng-container>

          <ng-container matColumnDef="data">
            <th mat-header-cell *matHeaderCellDef> Data </th>
            <td mat-cell *matCellDef="let p"> {{ p.dataCriacao | date:'dd/MM/yyyy HH:mm' }} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let p"> {{ p.status }} </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef> Total </th>
            <td mat-cell *matCellDef="let p" class="font-semibold text-blue-600">
              {{ p.total | currency: 'BRL'  }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;" class="hover:bg-gray-50"></tr>
        </table>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-6 !pb-4">
      <button mat-flat-button mat-dialog-close color="primary">Fechar</button>
    </mat-dialog-actions>
  `
})
export class UsuarioPedidosModalComponent {
  public pedidos: PedidoResponse[] = inject(MAT_DIALOG_DATA);
  protected readonly colunas = ['id', 'data', 'status', 'total'];
}
