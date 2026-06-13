import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import CupomService from '@features/pedido/services/cupom.service';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { CupomResponse } from '@features/pedido/models/cupom.model';
import CupomTableComponent from '@features/admin-produto/components/cupom/cupom-table/cupom-table.component';
import {CupomFormComponent} from '@features/admin-produto/components/cupom/cupom-form/cupom-form.component';


@Component({
  selector: 'app-cupom-page',
  standalone: true,
  templateUrl: './cupom.page.html',
  imports: [
    CupomTableComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export default class CupomPage {
  private readonly service = inject(CupomService);
  private readonly dialog = inject(MatDialog);

  private refreshTrigger = signal<ParametrosListagem>({
    pagina: 0,
    tamanho: 10
  });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);

  private readonly cuponsResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(params => {
      this.estaCarregando.set(true);
      this.erroGerado.set(null);
      return this.service.listar(params).pipe(
        finalize(() => this.estaCarregando.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.erroGerado.set(err);
          return throwError(() => err);
        })
      );
    })
  );

  protected readonly cuponsResponse = toSignal(this.cuponsResponse$);

  handleRefresh() {
    this.refreshTrigger.update(r => ({ ...r }));
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }


  abrirModalFormulario(cupomExistente?: CupomResponse) {
  const dialogRef = this.dialog.open(CupomFormComponent, {
    width: '600px',
    data: cupomExistente || null,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(sucesso => {
    if (sucesso) this.handleRefresh();
  });
}
}
