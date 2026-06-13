import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoResponse } from '@features/pedido/models/pedido.model';

@Component({
  selector: 'app-pedido-detalhe-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    DatePipe,
    CurrencyPipe
  ],
  template: `
    <h2 mat-dialog-title class="!font-bold !text-xl border-b border-gray-200 !pb-4">
      Detalhes do Pedido #{{ pedido.id }}
      <span class="ml-2 text-sm font-normal text-gray-500">
        {{ pedido.dataCriacao | date:'dd/MM/yyyy HH:mm' }}
      </span>
    </h2>

    <mat-dialog-content class="!py-4 !min-w-[700px]">

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            Endereço de Entrega
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ pedido.enderecoEntrega.logradouro }}, {{ pedido.enderecoEntrega.numero }}<br>
            @if (pedido.enderecoEntrega.complemento) {
              {{ pedido.enderecoEntrega.complemento }}<br>
            }
            {{ pedido.enderecoEntrega.bairro }}<br>
            {{ pedido.enderecoEntrega.cidade }} - {{ pedido.enderecoEntrega.estado }}<br>
            CEP: {{ pedido.enderecoEntrega.cep }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 class="font-semibold text-gray-800 mb-2">Informações de Pagamento</h3>
          <div class="text-sm text-gray-600 flex flex-col gap-1">
            <p><span class="font-medium text-gray-700">Método:</span> {{ pedido.pagamento.forma }}</p>
            <p><span class="font-medium text-gray-700">Status:</span> {{ pedido.pagamento.status }}</p>

            @if (pedido.pagamento.forma === 'Pix') {
              <p><span class="font-medium text-gray-700">TXID:</span> {{ pedido.pagamento.txid || 'N/A' }}</p>
            }

            @if (pedido.pagamento.forma === 'Crédito') {
              <p><span class="font-medium text-gray-700">Cartão:</span> **** {{ pedido.pagamento.cartao.ultimos4 }}</p>
              <p><span class="font-medium text-gray-700">Parcelas:</span> {{ pedido.pagamento.parcelas }}x</p>
            }

            @if (pedido.pagamento.forma === 'Débito') {
              <p><span class="font-medium text-gray-700">Cartão:</span> **** {{ pedido.pagamento.cartao.ultimos4 }}</p>
              <p><span class="font-medium text-gray-700">3DS:</span> {{ pedido.pagamento.autenticacao3DS ? 'Sim' : 'Não' }}</p>
            }
          </div>
        </div>
      </div>

      <h3 class="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Itens Solicitados</h3>

      <table mat-table [dataSource]="pedido.itens" class="w-full border border-gray-200 rounded">
        <ng-container matColumnDef="cpuId">
          <th mat-header-cell *matHeaderCellDef class="w-16"> Ref. </th>
          <td mat-cell *matCellDef="let item" class="text-gray-500"> {{ item.cpuId }} </td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef> Produto </th>
          <td mat-cell *matCellDef="let item" class="font-medium"> {{ item.nomeComercial }} </td>
        </ng-container>

        <ng-container matColumnDef="precoUnitario">
          <th mat-header-cell *matHeaderCellDef> Val. Unitário </th>
          <td mat-cell *matCellDef="let item"> {{ item.precoUnitario | currency:'BRL' }} </td>
        </ng-container>

        <ng-container matColumnDef="quantidade">
          <th mat-header-cell *matHeaderCellDef class="text-center"> Qtd. </th>
          <td mat-cell *matCellDef="let item" class="text-center"> {{ item.quantidade }} </td>
        </ng-container>

        <ng-container matColumnDef="subtotal">
          <th mat-header-cell *matHeaderCellDef class="text-right"> Subtotal </th>
          <td mat-cell *matCellDef="let item" class="text-right font-medium">
            {{ (item.precoUnitario * item.quantidade) | currency:'BRL'}}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunasItens" class="bg-gray-50"></tr>
        <tr mat-row *matRowDef="let row; columns: colunasItens;" class="hover:bg-gray-50"></tr>
      </table>

      <div class="mt-4 text-right">
        <span class="text-gray-600 mr-4">Total do Pedido:</span>
        <span class="text-xl font-bold text-blue-600">{{ pedido.total | currency:'BRL' }}</span>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end" class="!px-6 !pb-4 !pt-0">
      <button mat-flat-button mat-dialog-close color="primary">Fechar</button>
    </mat-dialog-actions>
  `
})
export class PedidoDetalheModalComponent {
  public pedido: PedidoResponse = inject(MAT_DIALOG_DATA);
  protected readonly colunasItens = ['cpuId', 'nome', 'precoUnitario', 'quantidade', 'subtotal'];
}
