export enum TipoNucleo {
  PERFORMANCE = "Performance",
  EFICIENCIA = "Eficiência"
}

export interface ClusterNucleo {
  frequenciaBase: number | null;
  frequenciaMaxima: number | null;
  quantidadeNucleos: number | null;
  tipoNucleo: TipoNucleo | null;
}

export interface ClusterNucleoFormRequest {
  frequenciaBase: number;
  frequenciaMaxima: number;
  quantidadeNucleos: number;
  tipoNucleo: TipoNucleo;
}
