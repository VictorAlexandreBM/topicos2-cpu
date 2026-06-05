import { TelefoneDetail, TelefoneFormRequest } from './telefone.model';
import { EnderecoDetail } from './endereco.model';
import {CartaoDetail} from '@features/cliente/models/cartao.model';

export type PerfilUsuario = 'V' | 'C' | 'A';


export interface UsuarioLoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioLogadoResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
  perfil: UsuarioDetail;
}

export interface UsuarioLogadoRequest {
  email: string;
  refreshToken: string;
}

export interface UsuarioDetail {
  id: number;
  email: string;
  nome: string;
  sobrenome: string;
  telefones: TelefoneDetail[];
  enderecos: EnderecoDetail[];
  cartoes: CartaoDetail[];
}

export interface UsuarioCadastroRequest {
  email: string;
  confirmarEmail: string;
  senha: string;
  confirmarSenha: string;
  primeiroNome: string;
  sobrenome: string;
  telefones: TelefoneFormRequest[];
}

export interface UsuarioUpdateRequest {
  nome: string;
  sobrenome: string;
  telefones: TelefoneFormRequest[];
}
