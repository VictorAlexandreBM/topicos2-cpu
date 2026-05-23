import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { RespostaPaginada } from '@core/models/resposta-paginada.model';
import { CpuDetail, CpuFormRequest, CpuList } from '../models/cpu.model';

@Injectable({
  providedIn: 'root',
})
export default class CpuService {
  protected readonly recurso = 'cpus';
  protected readonly http = inject(HttpClient);

  listar(parametrosListagem?: ParametrosListagem): Observable<RespostaPaginada<CpuList[]>> {
    const parametrosFiltrados = parametrosListagem ? Object.fromEntries(
      Object.entries(parametrosListagem).filter(([_, v]) =>
        (v !== undefined && v !== null && v !== '')
      )
    ) as { [key: string]: string | number | boolean } : {};

    return this.http.get<RespostaPaginada<CpuList[]>>(this.recurso, {
      params: parametrosFiltrados
    });
  }

  get(id: number): Observable<CpuDetail> {
    return this.http.get<CpuDetail>(`${this.recurso}/${id}`);
  }

  cadastrar(dados: CpuFormRequest): Observable<CpuDetail> {
    return this.http.post<CpuDetail>(this.recurso, dados);
  }

  atualizar(id: number, dados: CpuFormRequest): Observable<void> {
    return this.http.put<void>(`${this.recurso}/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recurso}/${id}`);
  }

  alterarEstadoVenda(id: number, emVenda: boolean): Observable<void> {
    return this.http.patch<void>(`${this.recurso}/${id}`, { emVenda });
  }
}
