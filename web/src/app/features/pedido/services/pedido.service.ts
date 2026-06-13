import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  simularWebhookPix(txid: string): Observable<void> {
    return this.http.post<void>(`webhooks/pix/${txid}/confirmar`, {});
  }

  validarCupom(codigo: string, total: number): Observable<{ desconto: number }> {
    const params = new HttpParams()
      .set('codigo', codigo)
      .set('total', total.toString());

    return this.http.get<{ desconto: number }>(`${this.recurso}/validar-cupom`, { params });
  }
}
