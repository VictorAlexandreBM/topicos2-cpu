import { EnderecoDetail } from '@features/cliente/models/endereco.model';
import { CartaoDetail } from '@features/cliente/models/cartao.model';


export type StatusPedido = 'Aguardando Pagamento' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface ItemPedidoRequest {
  cpuId: number;
  quantidade: number;
}

export interface PagamentoPixRequest {
  forma: 'PIX';
}

export interface PagamentoCreditoRequest {
  forma: 'CREDITO';
  cartaoId: number;
  parcelas: number;
}

export interface PagamentoDebitoRequest {
  forma: 'DEBITO';
  cartaoId: number;
}

export type PagamentoRequest = PagamentoPixRequest | PagamentoCreditoRequest | PagamentoDebitoRequest;

export interface PedidoFormRequest {
  enderecoId: number;
  itens: ItemPedidoRequest[];
  pagamento: PagamentoRequest;
  codigoCupom?: string;
}


interface PagamentoBase {
  id: number;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Estornado' | 'Cancelado';
  valor: number;
}

export interface PagamentoPixResponse extends PagamentoBase {
  forma: 'Pix';
  codigoCopiaECola: string;
  txid?: string;
}

export interface PagamentoDebitoResponse extends PagamentoBase {
  forma: 'Débito';
  cartao: CartaoDetail;
  autenticacao3DS: boolean;
}

export interface PagamentoCreditoResponse extends PagamentoBase {
  forma: 'Crédito';
  cartao: CartaoDetail;
  parcelas: number;
  jurosAplicados: number;
}

export type PagamentoResponse =
  PagamentoPixResponse |
  PagamentoCreditoResponse |
  PagamentoDebitoResponse;

export interface ItemPedidoResponse {
  id: number;
  cpuId: number;
  nomeComercial: string;
  imagemUrl?: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PedidoResponse {
  id: number;
  status: StatusPedido;
  total: number;
  descontoAplicado?: number;
  dataCriacao: string;
  enderecoEntrega: EnderecoDetail;
  itens: ItemPedidoResponse[];
  pagamento: PagamentoResponse;
}

export interface PedidoResumoResponse {
  id: number;
  status: StatusPedido;
  total: number;
  dataCriacao: string;
  itens: ItemPedidoResponse[];
}
