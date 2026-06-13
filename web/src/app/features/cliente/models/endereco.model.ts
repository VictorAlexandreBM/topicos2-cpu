export interface EnderecoDetail {
  id: number;
  cep: string;
  quadra: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidadeId: number;
  cidade: string;
  estado: string;
}

export interface EnderecoFormRequest {
  cep: string;
  logradouro: string;
  quadra: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidadeId: number;
}
