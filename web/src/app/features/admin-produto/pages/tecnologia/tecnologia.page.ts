import TecnologiaService from '../../services/tecnologia.service';
import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import TecnologiaTableComponent from '../../components/tecnologia-table/tecnologia-table.component';

@Component({
  selector: 'app-tecnologia-page',
  templateUrl: './tecnologia.page.html',
  imports: [
    TecnologiaTableComponent
  ]
})
export default class TecnologiaPage {

  private readonly service = inject(TecnologiaService)

  protected readonly tecnologiasResponse = toSignal(this.service.listar());
}
