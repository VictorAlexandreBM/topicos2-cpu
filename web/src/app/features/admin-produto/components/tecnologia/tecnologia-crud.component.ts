import {Component, inject, signal} from '@angular/core';
import {TecnologiaFormComponent} from './tecnologia-form/tecnologia-form.component';
import TecnologiaService from '../../services/tecnologia.service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import TecnologiaTableComponent from './tecnologia-table/tecnologia-table.component';
import {switchMap} from 'rxjs';

@Component(
  {
    selector: 'app-tecnologia-crud',
    templateUrl: './tecnologia-crud.component.html'
  }
)
export class TecnologiaCrudComponent {

}
