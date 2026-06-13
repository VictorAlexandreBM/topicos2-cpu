export interface Marca {
  id: number;
  nome: string;
  dataCriacao: string;
  ativo: boolean;
}

export interface MarcaFormRequest {
  nome: string;
}
