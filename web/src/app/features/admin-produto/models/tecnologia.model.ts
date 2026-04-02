export interface Tecnologia {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface TecnologiaFormRequest {
  nome: string;
  descricao: string;
}
