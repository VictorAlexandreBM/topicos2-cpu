export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export interface CupomResponse {
  id: number;
  codigo: string;
  valor: number;
  tipo: TipoDesconto;
  dataValidade: string;
  ativo: boolean;
  limiteUsos?: number;
  valorMinimoPedido?: number;
}

export interface CupomFormRequest {
  codigo: string;
  valor: number;
  tipo: TipoDesconto;
  dataValidade: string; // ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  ativo: boolean;
  limiteUsos?: number | null;
  valorMinimoPedido?: number | null;
}
