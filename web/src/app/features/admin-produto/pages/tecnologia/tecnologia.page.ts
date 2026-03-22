import TecnologiaService from '../../services/tecnologia.service';
import {Component, inject, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import TecnologiaTableComponent from '../../components/tecnologia/tecnologia-table/tecnologia-table.component';
import {TecnologiaFormComponent} from '../../components/tecnologia/tecnologia-form/tecnologia-form.component';
import {TecnologiaCrudComponent} from '../../components/tecnologia/tecnologia-crud.component';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-tecnologia-page',
  templateUrl: './tecnologia.page.html',
  imports: [
    TecnologiaTableComponent,
    TecnologiaFormComponent,
    TecnologiaCrudComponent
  ]
})
export default class TecnologiaPage {
  private readonly service = inject(TecnologiaService)

  private refreshTrigger = signal<number>(0);

  protected readonly tecnologiasResponse$ = toObservable(this.refreshTrigger).pipe(
    switchMap(() => this.service.listar())
  )

  protected readonly tecnologiasResponse = toSignal(this.tecnologiasResponse$);

  refreshTecnologias() {
    this.refreshTrigger.update((v) => v + 1);
  }

}
