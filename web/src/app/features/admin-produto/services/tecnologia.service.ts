import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tecnologia, TecnologiaFormRequest} from '../models/tecnologia.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class TecnologiaService {

  private readonly http = inject(HttpClient);

  listar(): Observable<Tecnologia[]> {
    return this.http.get<Tecnologia[]>('tecnologias');
  }

  cadastrar(dados: TecnologiaFormRequest): Observable<Tecnologia> {
    return this.http.post<Tecnologia>('tecnologias', dados);
  }
}
