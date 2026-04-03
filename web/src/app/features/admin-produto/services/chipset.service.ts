import { Injectable } from '@angular/core';
import BaseCrudService from '@core/services/base-crud.service';
import { Chipset, ChipsetFormRequest } from '../models/chipset.model';

@Injectable({
  providedIn: 'root',
})
export default class ChipsetService extends BaseCrudService<Chipset, ChipsetFormRequest> {
  protected readonly recurso = 'chipsets';
}
