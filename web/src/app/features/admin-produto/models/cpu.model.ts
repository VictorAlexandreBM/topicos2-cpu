import { ModeloCpuDetail } from '@features/admin-produto/models/modelo-cpu/modelo-cpu.model';

    interface CpuBase {
  sku: string;
  preco: number;
  estoque: number;
  nomeComercial?: string;
}

export interface CpuTrayList extends CpuBase {
  nomeModelo: string;
  marca: string;
  tipo: 'TRAY';
}

export interface CpuBoxList extends CpuBase {
  nomeModelo: string;
  marca: string;
  tipo: 'BOX';
}

export type CpuList = CpuTrayList | CpuBoxList;

export interface CpuDetailBase extends CpuBase {
  id: number;
  dataInclusao: string;
  emVenda: boolean;
  modelo: ModeloCpuDetail;
}

export interface CpuTrayDetail extends CpuDetailBase {
  loteFabricacao: string;
  tipo: 'TRAY';
}

export interface CpuBoxDetail extends CpuDetailBase {
  incluiCooler: boolean;
  pesoEmbalagemGramas: number;
  tipo: 'BOX';
}

export type CpuDetail = CpuTrayDetail | CpuBoxDetail;

export interface CpuFormRequestBase extends CpuBase {
  modeloId: number;
  emVenda: boolean;
}

export interface CpuTrayFormRequest extends CpuFormRequestBase {
  loteFabricacao: string;
  tipo: 'TRAY';
}

export interface CpuBoxFormRequest extends CpuFormRequestBase {
  incluiCooler: boolean;
  pesoEmbalagemGramas: number;
  tipo: 'BOX';
}

export type CpuFormRequest = CpuTrayFormRequest | CpuBoxFormRequest;
