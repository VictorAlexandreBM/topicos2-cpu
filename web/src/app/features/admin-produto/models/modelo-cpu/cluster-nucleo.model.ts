export enum TipoNucleo {
  PERFORMANCE = 'P',
  EFICIENCIA = 'E'
}

export const TipoNucleoDescricao: Record<TipoNucleo, string> = {
  [TipoNucleo.PERFORMANCE]: 'Performance',
  [TipoNucleo.EFICIENCIA]: 'Eficiência'
};

export const TipoNucleoOpcoes = [
  { valor: TipoNucleo.PERFORMANCE, descricao: TipoNucleoDescricao[TipoNucleo.PERFORMANCE] },
  { valor: TipoNucleo.EFICIENCIA, descricao: TipoNucleoDescricao[TipoNucleo.EFICIENCIA] }
];

export interface ClusterNucleo {
  frequenciaBase: number;
  frequenciaMaxima: number;
  quantidadeNucleos: number;
  tipoNucleo: TipoNucleo;
}

export interface ClusterNucleoFormRequest {
  frequenciaBase: number;
  frequenciaMaxima: number;
  quantidadeNucleos: number;
  tipoNucleo: TipoNucleo;
}
