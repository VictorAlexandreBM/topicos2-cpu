export interface Tecnologia {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  ativo: boolean;
}

export interface TecnologiaFormRequest {
  nome: string;
  descricao: string;
}
