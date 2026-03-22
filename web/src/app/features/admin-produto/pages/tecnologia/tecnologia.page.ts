import TecnologiaService from '../../services/tecnologia.service';
import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import TecnologiaTableComponent from '../../components/tecnologia/tecnologia-table/tecnologia-table.component';
import {TecnologiaFormComponent} from '../../components/tecnologia/tecnologia-form/tecnologia-form.component';

@Component({
  selector: 'app-tecnologia-page',
  templateUrl: './tecnologia.page.html',
  imports: [
    TecnologiaTableComponent,
    TecnologiaFormComponent
  ]
})
export default class TecnologiaPage {

  private readonly service = inject(TecnologiaService)

  protected readonly tecnologiasResponse = toSignal(this.service.listar());
}
