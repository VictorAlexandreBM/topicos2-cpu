import {inject, Injectable} from '@angular/core';
import BaseCrudService from '@core/services/base-crud.service';
import { Chipset, ChipsetFormRequest } from '../models/chipset.model';
import {
  ModeloCpuDetail,
  ModeloCpuFormRequest,
  ModeloCpuList,
  ModeloCpuOpcoesForm
} from '@features/admin-produto/models/modelo-cpu/modelo-cpu.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ParametrosListagem} from '@core/models/parametros-lista.model';
import {RespostaPaginada} from '@core/models/resposta-paginada.model';

@Injectable({
  providedIn: 'root',
})
export default class ModeloCpuService {
  protected readonly recurso = 'modelos-cpu';
  protected readonly http = inject(HttpClient);


  cadastrar(dados: ModeloCpuFormRequest): Observable<ModeloCpuDetail> {
    return this.http.post<ModeloCpuDetail>(this.recurso, dados);
  }

  listar(parametrosListagem?: ParametrosListagem): Observable<RespostaPaginada<ModeloCpuList[]>> {

    const parametrosFiltrados = parametrosListagem ? Object.fromEntries(
      Object.entries(parametrosListagem).filter(([_, v]) =>
        (v !== undefined && v !== null && v !== '')
      )
    ) as { [key: string]: string | number | boolean} : {}


    return this.http.get<RespostaPaginada<ModeloCpuList[]>>(this.recurso, {
      params: parametrosFiltrados
    });
  }

  get(id: number): Observable<ModeloCpuDetail> {
    return this.http.get<ModeloCpuDetail>(`${this.recurso}/${id}`);
  }

  atualizar(id: number, modeloCpuFormRequest: ModeloCpuFormRequest): Observable<void> {
    return this.http.put<void>(`${this.recurso}/${id}`, modeloCpuFormRequest);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${this.recurso}/${id}`);
  }

  alterarEstado(id: number, ativo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.recurso}/${id}`, {ativo});
  }
}
