import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoFormRequest, PedidoResponse } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly recurso = 'pedidos';

  realizarPedido(dados: PedidoFormRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.recurso, dados);
  }

  listar(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.recurso);
  }

  get(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.recurso}/${id}`);
  }

  cancelar(id: number): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.recurso}/${id}/cancelar`, {});
  }
}
