export interface Socket {
  id: number;
  tipo: string;
  dataCriacao: string;
  ativo: boolean;
}

export interface SocketFormRequest {
  tipo: string;
}
