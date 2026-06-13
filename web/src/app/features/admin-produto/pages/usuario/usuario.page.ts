import { Component, inject, signal, OnDestroy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ParametrosListagem } from '@core/models/parametros-lista.model';
import AdminUsuarioService from '@features/admin-produto/services/admin-usuario.service';
import UsuarioTableComponent from '@features/admin-produto/components/usuario/usuario-table/usuario-table.component';

@Component({
  selector: 'app-usuario-page',
  standalone: true,
  imports: [
    UsuarioTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="p-6 h-full flex flex-col">
      <div class="mb-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Gerência de Usuários</h1>
        <p class="text-sm text-gray-500 mt-1">Liste e gerencie os usuários, perfis de acesso e status da conta.</p>
      </div>

      <div class="flex items-center gap-4 mb-4">
        <mat-form-field appearance="outline" class="flex-1 max-w-[500px]" subscriptSizing="dynamic">
          <mat-label>Pesquisar por nome, sobrenome ou e-mail</mat-label>
          <input
            matInput
            type="text"
            placeholder="Ex: joao.silva@email.com"
            (input)="aoDigitar($event)"
          >
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-checkbox (change)="handleMostrarInativos($event.checked)">
          Mostrar Inativos
        </mat-checkbox>
      </div>

      <app-usuario-table
        [usuarios]="usuariosResponse()?.dados ?? []"
        [total]="usuariosResponse()?.total ?? 0"
        [estaCarregando]="estaCarregando()"
        (mudancaPagina)="handleMudancaPagina($event)"
        (mudancaOrdem)="handleMudancaOrdem($event)"
        (usuarioAlterado)="handleEstadoAlterado()"
      />
    </div>
  `
})
export default class UsuarioPage implements OnDestroy {
  private readonly service = inject(AdminUsuarioService);

  private refreshTrigger = signal<ParametrosListagem>({
    pagina: 0,
    tamanho: 10,
    ativo: true,
    campoOrdenacao: 'id',
    direcao: 'desc'
  });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);
  protected filtroSubject = new Subject<string>();

  private readonly usuariosResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(r => {
      this.estaCarregando.set(true);
      this.erroGerado.set(null);
      return this.service.listar(r).pipe(
        finalize(() => this.estaCarregando.set(false)),
        catchError((err: HttpErrorResponse) => {
          this.erroGerado.set(err);
          return throwError(() => err);
        })
      );
    })
  );

  protected readonly usuariosResponse = toSignal(this.usuariosResponse$);

  constructor() {
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(f => this.handlePesquisa(f));
  }

  aoDigitar(e: Event) {
    const valor = (e.target as HTMLInputElement).value;
    this.filtroSubject.next(valor);
  }

  refresh() {
    this.refreshTrigger.update(r => ({ ...r }));
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro }));
  }

  handleMostrarInativos(mostrarInativos: boolean) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, ativo: !mostrarInativos }));
  }

  handleEstadoAlterado() {
    this.refresh();
  }

  ngOnDestroy() {
    this.filtroSubject.complete();
  }
}
