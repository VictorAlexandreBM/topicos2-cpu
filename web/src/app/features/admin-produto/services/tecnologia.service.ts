import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tecnologia, TecnologiaFormRequest} from '../models/tecnologia.model';
import {Observable} from 'rxjs';
import {RespostaPaginada} from '../../../core/models/resposta-paginada.model';

@Injectable({
  providedIn: 'root',
})
export default class TecnologiaService {

  private readonly http = inject(HttpClient);

  listar(pagina?: number, tamanho?: number): Observable<RespostaPaginada<Tecnologia[]>> {
    const parametros = {
      pagina,
      tamanho
    }

    const parametrosFiltrados = Object.fromEntries(
      Object.entries(parametros).filter(([_, v]) => v !== undefined)
    ) as { [key: string]: string | number | boolean}


    return this.http.get<RespostaPaginada<Tecnologia[]>>('tecnologias', {
      params: parametrosFiltrados
    });
  }

  cadastrar(dados: TecnologiaFormRequest): Observable<Tecnologia> {
    return this.http.post<Tecnologia>('tecnologias', dados);
  }

  deletar(id: number) {
    return this.http.delete(`tecnologias/${id}`);
  }

  alterarEstado(id: number, ativo: boolean) {
    return this.http.patch(`tecnologias/${id}`, {ativo});
  }

  atualizar(id: number, dados: TecnologiaFormRequest) {
    return this.http.put<Tecnologia>(`tecnologias/${id}`, dados);
  }
}
