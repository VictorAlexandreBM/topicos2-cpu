import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartaoDetail, CartaoFormRequest } from '../models/cartao.model';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private readonly http = inject(HttpClient);
  private readonly recurso = 'cartoes';

  listar(): Observable<CartaoDetail[]> {
    return this.http.get<CartaoDetail[]>(this.recurso);
  }

  criar(dados: CartaoFormRequest): Observable<CartaoDetail> {
    return this.http.post<CartaoDetail>(this.recurso, dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recurso}/${id}`);
  }
}
