export interface CartaoDetail {
  id: number;
  titular: string;
  ultimos4: string;
  bandeira: string;
  mesExpiracao: number;
  anoExpiracao: number;
}

export interface CartaoFormRequest {
  gatewayToken: string;
  titular: string;
  ultimos4: string;
  bandeira: string;
  mesExpiracao: number;
  anoExpiracao: number;
}
