import { CpuDetail } from '@features/admin-produto/models/cpu.model';

export interface ItemCarrinho {
  produto: CpuDetail;
  quantidade: number;
  selecionado: boolean;
}

// Interface auxiliar para o payload que enviaremos ao backend futuramente
export interface PedidoRequest {
  enderecoId: number;
  itens: ItemPedidoRequest[];
  pagamento: any; // Tiparemos o pagamento quando chegarmos na etapa de checkout
}

export interface ItemPedidoRequest {
  cpuId: number;
  quantidade: number;
}
