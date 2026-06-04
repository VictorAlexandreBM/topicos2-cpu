import { Component, signal } from '@angular/core';
import { VitrineFilterComponent } from '../../components/vitrine/vitrine-filter/vitrine-filter.component';
import { VitrineListComponent } from '../../components/vitrine/vitrine-list/vitrine-list.component';
import {CpuFilter} from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-vitrine-page',
  standalone: true,
  imports: [VitrineFilterComponent, VitrineListComponent],
  templateUrl: './vitrine.page.html'
})
export default class VitrinePage {
  // O estado central dos filtros da vitrine. Inicia vazio.
  protected readonly filtrosAtuais = signal<CpuFilter>({});

  // Atualiza o Signal sempre que o componente de filtro emitir mudanças
  protected aplicarFiltros(novosFiltros: CpuFilter): void {
    this.filtrosAtuais.set(novosFiltros);
  }
}
