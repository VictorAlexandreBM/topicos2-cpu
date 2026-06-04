import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosListagem } from '@core/models/parametros-lista.model';
import { RespostaPaginada } from '@core/models/resposta-paginada.model';
import { CpuDetail, CpuFilter, CpuFormRequest, CpuList } from '../models/cpu.model';

@Injectable({
  providedIn: 'root',
})
export default class CpuService {
  protected readonly recurso = 'cpus';
  protected readonly http = inject(HttpClient);

  listar(parametros?: ParametrosListagem & CpuFilter): Observable<RespostaPaginada<CpuList[]>> {

    let httpParams = new HttpParams();

    if (parametros) {
      Object.entries(parametros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {

          if (Array.isArray(value)) {
            if (value.length > 0) {
              value.forEach(item => {
                httpParams = httpParams.append(key, item.toString());
              });
            }
          } else {
            httpParams = httpParams.append(key, value.toString());
          }

        }
      });
    }

    return this.http.get<RespostaPaginada<CpuList[]>>(this.recurso, {
      params: httpParams
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
