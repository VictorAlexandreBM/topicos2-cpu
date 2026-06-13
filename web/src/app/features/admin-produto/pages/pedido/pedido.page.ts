import { Component, inject, signal, OnDestroy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, throwError, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import PedidoTableComponent from '@features/admin-produto/components/pedido/pedido-table/pedido-table.component';
import AdminPedidoService, {ParametrosListagemPedido} from '@features/admin-produto/services/admin-pedido.service';

@Component({
  selector: 'app-pedido-page',
  standalone: true,
  providers: [provideNativeDateAdapter()], // Necessário para o MatDatepicker funcionar
  imports: [
    PedidoTableComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    PedidoTableComponent
  ],
  template: `
    <div class="p-6 h-full flex flex-col">
      <div class="mb-6 pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard de Pedidos</h1>
        <p class="text-sm text-gray-500 mt-1">Acompanhe, filtre e gerencie o fluxo de entrega dos pedidos da loja.</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-4 bg-white p-4 rounded shadow-sm border border-gray-100">

        <mat-form-field appearance="outline" class="flex-1 min-w-[250px]" subscriptSizing="dynamic">
          <mat-label>Pesquisar ID, Nome ou E-mail</mat-label>
          <input matInput type="text" placeholder="Ex: 1042 ou joao@email.com" (input)="aoDigitar($event)" [value]="filtroTexto()">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-[220px]" subscriptSizing="dynamic">
          <mat-label>Status do Pedido</mat-label>
          <mat-select (selectionChange)="handleStatus($event.value)" [value]="statusAtual()">
            <mat-option [value]="null">Todos</mat-option>
            <mat-option value="Aguardando Pagamento">Aguardando Pagamento</mat-option>
            <mat-option value="Pago">Pago</mat-option>
            <mat-option value="Enviado">Enviado</mat-option>
            <mat-option value="Entregue">Entregue</mat-option>
            <mat-option value="Cancelado">Cancelado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-[280px]" subscriptSizing="dynamic">
          <mat-label>Período de Criação</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate placeholder="Data Início" (dateChange)="handleDataInicio($event.value)" [value]="dataInicioAtual()">
            <input matEndDate placeholder="Data Fim" (dateChange)="handleDataFim($event.value)" [value]="dataFimAtual()">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>

        <button mat-button color="warn" (click)="limparFiltros()">Limpar</button>
      </div>

      <app-pedido-table
        [pedidos]="pedidosResponse()?.dados ?? []"
        [total]="pedidosResponse()?.total ?? 0"
        [estaCarregando]="estaCarregando()"
        (mudancaPagina)="handleMudancaPagina($event)"
        (mudancaOrdem)="handleMudancaOrdem($event)"
        (pedidoAlterado)="handlePedidoAlterado()"
      />
    </div>
  `
})
export default class PedidoPage implements OnDestroy {
  private readonly service = inject(AdminPedidoService);

  // Sinais auxiliares para limpar visualmente os inputs
  protected filtroTexto = signal<string>('');
  protected statusAtual = signal<string | null>(null);
  protected dataInicioAtual = signal<Date | null>(null);
  protected dataFimAtual = signal<Date | null>(null);

  private refreshTrigger = signal<ParametrosListagemPedido>({
    pagina: 0,
    tamanho: 10,
    campoOrdenacao: 'dataCriacao',
    direcao: 'desc'
  });

  protected estaCarregando = signal(false);
  protected erroGerado = signal<HttpErrorResponse | null>(null);
  protected filtroSubject = new Subject<string>();

  private readonly pedidosResponse$ = toObservable(this.refreshTrigger).pipe(
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

  protected readonly pedidosResponse = toSignal(this.pedidosResponse$);

  constructor() {
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(f => {
      this.filtroTexto.set(f);
      this.refreshTrigger.update(r => ({ ...r, pagina: 0, filtro: f }));
    });
  }

  // --- Funções de formatação e eventos ---

  private formatarDataParaBackend(data: Date | null): string | null {
    if (!data) return null;
    const d = new Date(data);
    const mes = '' + (d.getMonth() + 1);
    const dia = '' + d.getDate();
    const ano = d.getFullYear();
    return [ano, mes.padStart(2, '0'), dia.padStart(2, '0')].join('-');
  }

  aoDigitar(e: Event) {
    const valor = (e.target as HTMLInputElement).value;
    this.filtroSubject.next(valor);
  }

  handleStatus(status: string | null) {
    this.statusAtual.set(status);
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, status: status }));
  }

  handleDataInicio(data: Date | null) {
    this.dataInicioAtual.set(data);
    const dataFormatada = this.formatarDataParaBackend(data);
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, dataInicio: dataFormatada }));
  }

  handleDataFim(data: Date | null) {
    this.dataFimAtual.set(data);
    const dataFormatada = this.formatarDataParaBackend(data);
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, dataFim: dataFormatada }));
  }

  limparFiltros() {
    this.filtroTexto.set('');
    this.statusAtual.set(null);
    this.dataInicioAtual.set(null);
    this.dataFimAtual.set(null);

    // Dispara a limpa no subject para não conflitar caso o usuário digite a mesma coisa depois
    this.filtroSubject.next('');

    this.refreshTrigger.update(r => ({
      ...r,
      pagina: 0,
      filtro: undefined,
      status: null,
      dataInicio: null,
      dataFim: null
    }));
  }

  // --- Funções de Tabela ---

  refresh() {
    this.refreshTrigger.update(r => ({ ...r }));
  }

  handleMudancaPagina(event: PageEvent) {
    this.refreshTrigger.update(r => ({ ...r, pagina: event.pageIndex, tamanho: event.pageSize }));
  }

  handleMudancaOrdem(event: Sort) {
    this.refreshTrigger.update(r => ({ ...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction }));
  }

  handlePedidoAlterado() {
    this.refresh();
  }

  ngOnDestroy() {
    this.filtroSubject.complete();
  }
}
