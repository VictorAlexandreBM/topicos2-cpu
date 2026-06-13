import { Component, inject, input, output } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioListDTO } from '@features/cliente/models/usuario.model';
import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { BackendError } from '@core/models/backend-error.model';
import AdminUsuarioService from '@features/admin-produto/services/admin-usuario.service';
import {MatDialog} from '@angular/material/dialog';
import {
  UsuarioPedidosModalComponent
} from '@features/admin-produto/components/usuario/usuario-table/usuario-pedidos-modal.component';

@Component({
  selector: 'app-usuario-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatMenuModule,
    RouterLink,
    NgClass,
    MatTooltipModule
  ],
  template: `
    <div class="mat-elevation-z8 relative">
      <table mat-table [dataSource]="usuarios()" matSort (matSortChange)="ordenar($event)">

        <ng-container matColumnDef="acao">
          <th mat-header-cell *matHeaderCellDef class="w-[200px] text-center"> Ações </th>
          <td mat-cell *matCellDef="let u" class="text-center whitespace-nowrap">

              <button mat-icon-button color="primary" (click)="abrirModalPedidos(u)" title="Ver Pedidos">
              <mat-icon>shopping_bag</mat-icon>
            </button>

            <button mat-icon-button (click)="alterarEstado(u, !u.ativo)" [title]="u.ativo ? 'Inativar Usuário' : 'Ativar Usuário'">
              <mat-icon>{{ u.ativo ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>

            <button mat-icon-button [matMenuTriggerFor]="perfilMenu" title="Alterar Perfil">
              <mat-icon>manage_accounts</mat-icon>
            </button>

            <mat-menu #perfilMenu="matMenu">
              <button mat-menu-item (click)="alterarPerfil(u, 'V')" [disabled]="u.perfil === 'V'">Tornar Visitante</button>
              <button mat-menu-item (click)="alterarPerfil(u, 'C')" [disabled]="u.perfil === 'C'">Tornar Cliente</button>
              <button mat-menu-item (click)="alterarPerfil(u, 'A')" [disabled]="u.perfil === 'A'">Tornar Administrador</button>
            </mat-menu>

          </td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="primeiroNome"> Nome </th>
          <td mat-cell *matCellDef="let u"> {{ u.nome }} {{ u.sobrenome }} </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="email"> E-mail </th>
          <td mat-cell *matCellDef="let u"> {{ u.email }} </td>
        </ng-container>

        <ng-container matColumnDef="perfil">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="perfil"> Perfil </th>
          <td mat-cell *matCellDef="let u">
            <span class="px-2 py-1 rounded text-xs font-semibold"
                  [ngClass]="{
                    'bg-gray-200 text-gray-800': u.perfil === 'V',
                    'bg-blue-200 text-blue-800': u.perfil === 'C',
                    'bg-red-200 text-red-800': u.perfil === 'A'
                  }">
              {{ formatarPerfil(u.perfil) }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunas;" [ngClass]="{'opacity-50': !row.ativo}"></tr>
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
export default class UsuarioTableComponent {
  public usuarios = input.required<UsuarioListDTO[]>();
  public total = input.required<number>();
  public estaCarregando = input.required<boolean>();

  public mudancaPagina = output<PageEvent>();
  public mudancaOrdem = output<Sort>();
  public usuarioAlterado = output<UsuarioListDTO>();

  private service = inject(AdminUsuarioService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);
  private dialog = inject(MatDialog); // INCLUSÃO

  protected readonly colunas = ['acao', 'nome', 'email', 'perfil'];

  protected formatarPerfil(sigla: string): string {
    const perfis: Record<string, string> = { 'V': 'Visitante', 'C': 'Cliente', 'A': 'Administrador' };
    return perfis[sigla] || 'Desconhecido';
  }

  protected async alterarEstado(u: UsuarioListDTO, ativo: boolean) {
    if (!ativo) {
      const confirmado = await this.dialogService.alertar('Inativar usuário', 'Deseja realmente inativar este usuário?');
      if (!confirmado) return;
    }

    this.service.alterarEstado(u.id, ativo).subscribe({
      next: () => {
        this.usuarioAlterado.emit(u);
        this.snackbarService.alertar(`Usuário ${ativo ? 'ativado' : 'inativado'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar estado do usuário: ' + (erro?.detail || 'Erro na operação'));
      }
    });
  }

  protected async alterarPerfil(u: UsuarioListDTO, novoPerfil: string) {
    const confirmado = await this.dialogService.alertar('Alterar Perfil', `Deseja alterar o perfil deste usuário para ${this.formatarPerfil(novoPerfil)}?`);
    if (!confirmado) return;

    this.service.alterarPerfil(u.id, novoPerfil).subscribe({
      next: () => {
        this.usuarioAlterado.emit(u);
        this.snackbarService.alertar('Perfil alterado com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao alterar perfil: ' + (erro?.detail || 'Erro na operação'));
      }
    });
  }

  protected abrirModalPedidos(u: UsuarioListDTO) {
    this.service.listarPedidosUsuario(u.id).subscribe({
      next: (pedidos) => {
        this.dialog.open(UsuarioPedidosModalComponent, {
          data: pedidos,
          width: '700px',
          autoFocus: false
        });
      },
      error: (err: HttpErrorResponse) => {
        const erro = err.error as BackendError;
        this.snackbarService.alertar('Erro ao buscar pedidos do usuário: ' + (erro?.detail || 'Erro na operação'));
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
