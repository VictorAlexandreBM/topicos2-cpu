export interface FichaTecnica {
  descricaoComercial: string | null;
  tdpBaseW: number | null;
  cacheL2MB: number | null;
  cacheL3MB: number | null;
}

export interface FichaTecnicaFormRequest {
  descricaoComercial?: string;
  tdpBaseW?: number;
  cacheL2MB?: number;
  cacheL3MB?: number;
}
