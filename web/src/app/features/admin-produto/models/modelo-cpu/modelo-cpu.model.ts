import {Marca} from '@features/admin-produto/models/marca.model';
import {Socket} from '@features/admin-produto/models/socket.model';
import {Chipset} from '@features/admin-produto/models/chipset.model';
import {Tecnologia} from '@features/admin-produto/models/tecnologia.model';
import {FichaTecnica, FichaTecnicaFormRequest} from '@features/admin-produto/models/modelo-cpu/ficha-tecnica.model';
import {ClusterNucleo, ClusterNucleoFormRequest} from '@features/admin-produto/models/modelo-cpu/cluster-nucleo.model';

export interface ModeloCpuDetail {
  id: number;
  nome: string;
  ativo: boolean;
  dataCriacao: string;
  marca: Marca;
  socket: Socket;
  chipsets: Chipset[] | null;
  tecnologias: Tecnologia[] | null;
  fichaTecnica: FichaTecnica;
  clustersNucleo: ClusterNucleo[];
}

export interface ModeloCpuList {
  id: number;
  nome: string;
  nomeMarca: string;
  tipoSocket: string;
  quantNucleos: number;
  frequenciaMaxima: number;
  ativo: boolean;
}

export interface ModeloCpuFormRequest {
  nome: string;

  marcaId: number;

  socketId?: number;

  fichaTecnica: FichaTecnicaFormRequest;

  clustersNucleo: ClusterNucleoFormRequest[];

  chipsetIds?: number[];

  tecnologiaIds?: number[];
}

export interface ModeloCpuOpcoesForm {
    marcas: Marca[];
    sockets: Socket[];
    tecnologias: Tecnologia[];
    chipsets: Chipset[];
}
