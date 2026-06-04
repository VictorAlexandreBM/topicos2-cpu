// Modelo retornado pelas consultas (espelha EnderecoResponseDTO)
export interface EnderecoDetail {
  id: number;
  cep: string;
  quadra: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Modelo de envio para criação/atualização (espelha EnderecoDTO)
export interface EnderecoFormRequest {
  cep: string;
  logradouro: string;
  quadra: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
}
