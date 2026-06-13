export interface Chipset {
  id: number;
  tipo: string;
  dataCriacao: string;
  ativo: boolean;
}

export interface ChipsetFormRequest {
  tipo: string;
}
