import TecnologiaService from '../../services/tecnologia.service';
import {Component, inject, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import TecnologiaTableComponent from '../../components/tecnologia/tecnologia-table/tecnologia-table.component';
import {TecnologiaFormComponent} from '../../components/tecnologia/tecnologia-form/tecnologia-form.component';
import {switchMap} from 'rxjs';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Tecnologia} from '../../models/tecnologia.model';
import {PageEvent} from '@angular/material/paginator';
import {TecnologiaFiltroComponent} from '../../components/tecnologia/tecnologia-filtro/tecnologia-filtro.component';

@Component({
  selector: 'app-tecnologia-page',
  templateUrl: './tecnologia.page.html',
  styleUrl: 'tecnologia.page.css',
  imports: [
    TecnologiaTableComponent,
    TecnologiaFormComponent,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatIcon,
    MatFabButton,
    MatIconButton,
    TecnologiaFiltroComponent
  ]
})
export default class TecnologiaPage {
  private readonly service = inject(TecnologiaService)
  private refreshTrigger = signal({pagina: 0, tamanho: 2, filtro: ''});

  private readonly tecnologiasResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(r => this.service.listar(r.pagina, r.tamanho, r.filtro))
  )

  protected readonly tecnologiasResponse = toSignal(this.tecnologiasResponse$);

  protected tecnologiaEmEdicao = signal<Tecnologia | null>(null);

  refreshTecnologias() {
    this.refreshTrigger.update((r) => ({...r}));
  }

  handleEdicao(t: Tecnologia, drawer: MatDrawer) {
    this.tecnologiaEmEdicao.set(t);
    void drawer.open();
  }

  handleAtualizacao() {
    this.refreshTecnologias();
    this.tecnologiaEmEdicao.set(null);
  }

  handleDelecao(tecnologia: Tecnologia) {
    this.refreshTecnologias();
    if (this.tecnologiaEmEdicao() === tecnologia) {
      this.tecnologiaEmEdicao.set(null);
    }
  }

  handleMudancaPagina(event: PageEvent) {
    console.log(event);
    this.refreshTrigger.update(r => ({...r, pagina: event.pageIndex, tamanho: event.pageSize}));
  }

  handleEstadoAlterado(tecnologia: Tecnologia) {
    this.refreshTecnologias();
    if (this.tecnologiaEmEdicao() === tecnologia) {
      this.tecnologiaEmEdicao.set(null);
    }
  }

  handlePesquisa(filtro: string) {
    this.refreshTrigger.update(r => ({...r, pagina: 0, filtro}));
  }
}
