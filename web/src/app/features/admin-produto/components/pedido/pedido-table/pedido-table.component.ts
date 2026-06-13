import { Component, inject, input, output } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { PedidoResumoResponse } from '@features/pedido/models/pedido.model';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { BackendError } from '@core/models/backend-error.model';
import AdminPedidoService from '@features/admin-produto/services/admin-pedido.service';
import {MatDialog} from '@angular/material/dialog';
import {
  PedidoDetalheModalComponent
} from '@features/admin-produto/components/pedido/pedido-table/pedido-detalhe-modal.component';

@Component({
  selector: 'app-pedido-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    NgClass,
    DatePipe,
    CurrencyPipe
  ],
  template: `
    <div class="mat-elevation-z8 relative">
      <table mat-table [dataSource]="pedidos()" matSort (matSortChange)="ordenar($event)">

        <ng-container matColumnDef="acao">
          <th mat-header-cell *matHeaderCellDef class="w-[180px] text-center"> Ações </th>
          <td mat-cell *matCellDef="let p" class="text-center whitespace-nowrap">

            <button mat-icon-button color="primary" title="Ver Detalhes do Pedido" (click)="abrirModalDetalhes(p)">
              <mat-icon>visibility</mat-icon>
            </button>

            <button mat-icon-button class="text-blue-600"
                    [disabled]="p.status !== 'Pago'"
                    (click)="marcarComoEnviado(p)"
                    title="Marcar como Enviado">
              <mat-icon>local_shipping</mat-icon>
            </button>

            <button mat-icon-button class="text-green-600"
                    [disabled]="p.status !== 'Enviado'"
                    (click)="marcarComoEntregue(p)"
                    title="Marcar como Entregue">
              <mat-icon>check_circle</mat-icon>
            </button>

          </td>
        </ng-container>

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="id"> ID </th>
          <td mat-cell *matCellDef="let p" class="font-medium"> #{{ p.id }} </td>
        </ng-container>

        <ng-container matColumnDef="dataCriacao">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="dataCriacao"> Data </th>
          <td mat-cell *matCellDef="let p"> {{ p.dataCriacao | date:'dd/MM/yyyy HH:mm' }} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="status"> Status </th>
          <td mat-cell *matCellDef="let p">
            <span class="px-2 py-1 rounded text-xs font-semibold" [ngClass]="obterClasseStatus(p.status)">
              {{ p.status }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="total"> Total </th>
          <td mat-cell *matCellDef="let p" class="font-semibold text-gray-700">
            {{ p.total | currency:'BRL'}}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunas;" class="hover:bg-gray-50 transition-colors"></tr>
      </table>

      <mat-paginator
        [length]="total()"
        [pageSize]="10"
        [pageSizeOptions]="[5,10,20]"
        showFirstLastButtons
        (page)="paginar($event)">
      </mat-paginator>

      @if (estaCarregando()) {
        <div class="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
          <mat-progress-spinner mode="indeterminate" diameter="50" color="primary"></mat-progress-spinner>
        </div>
      }
    </div>
  `
})
export default class PedidoTableComponent {
  public pedidos = input.required<PedidoResumoResponse[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();
  public pedidoAlterado = output<PedidoResumoResponse>();

  private service = inject(AdminPedidoService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);
  private dialog = inject(MatDialog);

  protected readonly colunas = ['acao', 'id', 'dataCriacao', 'status', 'total'];

  protected obterClasseStatus(status: string): string {
    switch (status) {
      case 'Aguardando Pagamento': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Pago': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Enviado': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Entregue': return 'bg-green-200 text-green-900 border border-green-300';
      case 'Cancelado': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  protected async marcarComoEnviado(p: PedidoResumoResponse) {
    const confirmado = await this.dialogService.alertar(
      'Confirmar Envio',
      `Deseja marcar o pedido #${p.id} como Enviado?`
    );
    if (!confirmado) return;

    this.service.marcarComoEnviado(p.id).subscribe({
      next: () => {
        this.snackbarService.alertar('Pedido marcado como enviado com sucesso!');
        this.pedidoAlterado.emit(p);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao enviar pedido: ' + (erro?.detail || 'Erro na operação'));
      }
    });
  }

  protected async marcarComoEntregue(p: PedidoResumoResponse) {
    const confirmado = await this.dialogService.alertar(
      'Confirmar Entrega',
      `Deseja confirmar a entrega do pedido #${p.id}?`
    );
    if (!confirmado) return;

    this.service.marcarComoEntregue(p.id).subscribe({
      next: () => {
        this.snackbarService.alertar('Pedido marcado como entregue com sucesso!');
        this.pedidoAlterado.emit(p);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao entregar pedido: ' + (erro?.detail || 'Erro na operação'));
      }
    });
  }

// No método abrirModalDetalhes
  protected abrirModalDetalhes(p: PedidoResumoResponse) {
    this.service.get(p.id).subscribe({
      next: (pedidoCompleto) => {
        this.dialog.open(PedidoDetalheModalComponent, {
          data: pedidoCompleto,
          width: '1100px',      // Aumentado de 800px para 1100px
          maxWidth: '95vw',     // Garante que não quebre em telas menores que 1100px
          maxHeight: '90vh',    // Limita a altura para habilitar scroll interno se necessário
          autoFocus: false,
          panelClass: 'custom-order-modal' // Opcional: para estilos globais extras
        });
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao carregar detalhes: ' + (erro?.detail || 'Erro na operação'));
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
