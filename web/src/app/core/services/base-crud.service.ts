import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable} from 'rxjs';
import {ParametrosListagem} from '../models/parametros-lista.model';
import {RespostaPaginada} from '../models/resposta-paginada.model';

@Injectable({
  providedIn: 'root',
})
export default abstract class BaseCrudService<T extends {id: number}, TREQ> {

  protected abstract readonly recurso: string;
  private readonly http = inject(HttpClient);

  listar(parametrosListagem: ParametrosListagem): Observable<RespostaPaginada<T[]>> {

    const parametrosFiltrados = Object.fromEntries(
      Object.entries(parametrosListagem).filter(([_, v]) =>
        (v !== undefined && v !== null && v !== '')
      )
    ) as { [key: string]: string | number | boolean}


    return this.http.get<RespostaPaginada<T[]>>(this.recurso, {
      params: parametrosFiltrados
    });
  }

  cadastrar(dados: TREQ): Observable<T> {
    return this.http.post<T>(this.recurso, dados);
  }

  atualizar(id: number, dados: TREQ): Observable<T> {
    return this.http.put<T>(`${this.recurso}/${id}`, dados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recurso}/${id}`);
  }

  alterarEstado(id: number, ativo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.recurso}/${id}`, {ativo});
  }

}
