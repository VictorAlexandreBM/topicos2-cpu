import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tecnologia, TecnologiaFormRequest} from '../models/tecnologia.model';
import {delay, Observable} from 'rxjs';
import {RespostaPaginada} from '../../../core/models/resposta-paginada.model';
import {ParametrosListagem} from '../../../core/models/parametros-lista.model';
import BaseCrudService from '../../../core/services/base-crud.service';

@Injectable({
  providedIn: 'root',
})
export default class TecnologiaService extends BaseCrudService<Tecnologia, TecnologiaFormRequest> {
  protected readonly recurso = 'tecnologias';
}
