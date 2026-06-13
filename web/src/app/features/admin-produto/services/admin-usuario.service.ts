import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { RespostaPaginada } from '@core/models/resposta-paginada.model';
import { UsuarioListDTO } from '@features/cliente/models/usuario.model';
import { PedidoResponse } from '@features/pedido/models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export default class AdminUsuarioService {
  protected readonly recurso = 'admin/usuarios';
  protected readonly http = inject(HttpClient);

  listar(parametrosListagem?: ParametrosListagem): Observable<RespostaPaginada<UsuarioListDTO[]>> {
    const parametrosFiltrados = parametrosListagem ? Object.fromEntries(
      Object.entries(parametrosListagem).filter(([_, v]) =>
        (v !== undefined && v !== null && v !== '')
      )
    ) as { [key: string]: string | number | boolean } : {};

    return this.http.get<RespostaPaginada<UsuarioListDTO[]>>(this.recurso, {
      params: parametrosFiltrados
    });
  }

  alterarEstado(id: number, ativo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.recurso}/${id}/status`, null, {
      params: { ativo }
    });
  }

  alterarPerfil(id: number, perfil: string): Observable<void> {
    return this.http.patch<void>(`${this.recurso}/${id}/perfil`, null, {
      params: { perfil }
    });
  }

  listarPedidosUsuario(id: number): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.recurso}/${id}/pedidos`);
  }
}
