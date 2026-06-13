import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import CupomService from '@features/pedido/services/cupom.service';
import { CupomResponse } from '@features/pedido/models/cupom.model';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { BackendError } from '@core/models/backend-error.model';

@Component({
  selector: 'app-cupom-table',
  standalone: true,
  templateUrl: './cupom-table.component.html',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
    NgClass
  ]
})
export default class CupomTableComponent {
  public cupons = input.required<CupomResponse[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public mudancaPagina = output<PageEvent>();
  public cupomDeletado = output<CupomResponse>();
  public cupomAlteradoEstado = output<CupomResponse>();
  public cupomEditado = output<CupomResponse>();

  private readonly service = inject(CupomService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialogService = inject(ConfirmDialogService);

  protected readonly colunas = ['acao', 'codigo', 'valor', 'validade', 'limite', 'minimo'];

  protected isExpirado(dataString: string): boolean {
    return new Date(dataString).getTime() < new Date().getTime();
  }

  protected editar(cupom: CupomResponse): void {
    this.cupomEditado.emit(cupom);
  }

  protected async alterarEstado(cupom: CupomResponse, ativo: boolean) {
    const titulo = ativo ? 'Ativar Cupom' : 'Desativar Cupom';
    const mensagem = `Deseja realmente ${ativo ? 'ativar' : 'desativar'} o cupom ${cupom.codigo}?`;

    const confirmado = await this.dialogService.alertar(titulo, mensagem);
    if (!confirmado) return;

    this.service.alterarEstado(cupom.id, ativo).subscribe({
      next: () => {
        this.cupomAlteradoEstado.emit(cupom);
        this.snackbarService.alertar(`Status do cupom ${cupom.codigo} atualizado!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar status: ' + (erro?.detail || 'Erro desconhecido'));
      }
    });
  }

  protected async deletar(cupom: CupomResponse) {
    const confirmado = await this.dialogService.alertar(
      'Deletar Cupom',
      `Deseja realmente deletar o cupom ${cupom.codigo}? Esta ação é irreversível.`
    );

    if (!confirmado) return;

    this.service.deletar(cupom.id).subscribe({
      next: () => {
        this.cupomDeletado.emit(cupom);
        this.snackbarService.alertar('Cupom deletado com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao deletar cupom: ' + (erro?.detail || 'Erro desconhecido'));
      }
    });
  }

  paginar(event: PageEvent) {
    this.mudancaPagina.emit(event);
  }
}
