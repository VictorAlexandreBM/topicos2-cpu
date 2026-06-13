import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CidadeDetail, EstadoDetail } from '../models/localizacao.model';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {
  private readonly http = inject(HttpClient);
  private readonly recurso = 'localizacao';

  listarEstados(): Observable<EstadoDetail[]> {
    return this.http.get<EstadoDetail[]>(`${this.recurso}/estados`);
  }

  listarCidades(sigla: string): Observable<CidadeDetail[]> {
    return this.http.get<CidadeDetail[]>(`${this.recurso}/estados/${sigla}/cidades`);
  }
}
