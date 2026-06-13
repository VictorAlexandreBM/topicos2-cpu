import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { RespostaPaginada } from '@core/models/resposta-paginada.model';
import { PedidoResumoResponse, PedidoResponse, StatusPedido } from '@features/pedido/models/pedido.model';

export interface ParametrosListagemPedido extends ParametrosListagem {
  status?: StatusPedido | string | null;
  dataInicio?: string | null;
  dataFim?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export default class AdminPedidoService {
  protected readonly recurso = 'admin/pedidos';
  protected readonly http = inject(HttpClient);

  get(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.recurso}/${id}`);
  }

  listar(parametrosListagem?: ParametrosListagemPedido): Observable<RespostaPaginada<PedidoResumoResponse[]>> {
    const parametrosFiltrados = parametrosListagem ? Object.fromEntries(
      Object.entries(parametrosListagem).filter(([_, v]) =>
        (v !== undefined && v !== null && v !== '')
      )
    ) as { [key: string]: string | number | boolean } : {};

    return this.http.get<RespostaPaginada<PedidoResumoResponse[]>>(this.recurso, {
      params: parametrosFiltrados
    });
  }

  marcarComoEnviado(id: number): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.recurso}/${id}/enviar`, null);
  }

  marcarComoEntregue(id: number): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.recurso}/${id}/entregar`, null);
  }
}
