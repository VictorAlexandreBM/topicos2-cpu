import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoDetail, EnderecoFormRequest } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private readonly http = inject(HttpClient);
  private readonly recurso = 'enderecos';

  criar(dados: EnderecoFormRequest): Observable<EnderecoDetail> {
    return this.http.post<EnderecoDetail>(this.recurso, dados);
  }

  atualizar(id: number, dados: EnderecoFormRequest): Observable<EnderecoDetail> {
    return this.http.put<EnderecoDetail>(`${this.recurso}/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recurso}/${id}`);
  }
}
