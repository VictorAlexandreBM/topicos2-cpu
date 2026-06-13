import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import BaseCrudService from '@core/services/base-crud.service';
import { CupomResponse, CupomFormRequest } from '../models/cupom.model';
import { RespostaPaginada } from '@core/models/resposta-paginada.model';
import { ParametrosListagem } from '@core/models/parametros-lista.model';

@Injectable({
  providedIn: 'root',
})
export default class CupomService extends BaseCrudService<CupomResponse, CupomFormRequest> {
  protected readonly recurso = 'cupons';

  private readonly httpClient = inject(HttpClient);

  override listar(parametros?: ParametrosListagem): Observable<RespostaPaginada<CupomResponse[]>> {
    return this.httpClient.get<CupomResponse[]>(this.recurso).pipe(
      map(cupons => ({
        dados: cupons,
        total: cupons.length
      }))
    );
  }
}
