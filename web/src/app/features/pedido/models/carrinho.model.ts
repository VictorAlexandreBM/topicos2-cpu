import { CpuDetail } from '@features/admin-produto/models/cpu.model';

export interface ItemCarrinho {
  produto: CpuDetail;
  quantidade: number;
  selecionado: boolean;
}

export interface PedidoRequest {
  enderecoId: number;
  itens: ItemPedidoRequest[];
  pagamento: any;
}

export interface ItemPedidoRequest {
  cpuId: number;
  quantidade: number;
}
