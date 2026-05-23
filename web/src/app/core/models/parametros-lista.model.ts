import {SortDirection} from '@angular/material/sort';

export interface ParametrosListagem {
  pagina?: number;
  tamanho?: number;
  filtro?: string;
  ativo?: boolean;
  emVenda?: boolean;
  campoOrdenacao?: string;
  direcao?: SortDirection;
}
