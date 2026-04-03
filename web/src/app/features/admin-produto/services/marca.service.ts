import { Injectable } from '@angular/core';
import BaseCrudService from '@core/services/base-crud.service';
import { Marca, MarcaFormRequest } from '../models/marca.model';

@Injectable({
  providedIn: 'root',
})
export default class MarcaService extends BaseCrudService<Marca, MarcaFormRequest> {
  protected readonly recurso = 'marcas';
}
