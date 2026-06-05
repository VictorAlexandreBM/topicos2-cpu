import { Component, inject, OnInit, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import MarcaService from '@features/admin-produto/services/marca.service';
import SocketService from '@features/admin-produto/services/socket.service';
import ChipsetService from '@features/admin-produto/services/chipset.service';
import TecnologiaService from '@features/admin-produto/services/tecnologia.service';
import {CpuFilter} from '@features/admin-produto/models/cpu.model';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-vitrine-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './vitrine-filter.component.html'
})
export class VitrineFilterComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  // Injeta os serviços para popular as listas do filtro
  private readonly marcaService = inject(MarcaService);
  private readonly socketService = inject(SocketService);
  private readonly chipsetService = inject(ChipsetService);
  private readonly tecnologiaService = inject(TecnologiaService);

  // Emissor de eventos para o Angular 17+
  public readonly filtrosMudaram = output<CpuFilter>();

  // Armazena as opções de filtro vindas do backend
  protected readonly marcasDisponiveis = signal<any[]>([]);
  protected readonly socketsDisponiveis = signal<any[]>([]);
  protected readonly chipsetsDisponiveis = signal<any[]>([]);
  protected readonly tecnologiasDisponiveis = signal<any[]>([]);

  // Formulário Reativo contendo a estrutura exata do CpuFilter
  protected readonly filtroForm = this.fb.group({
    nome: [''],
    nomeModelo: [''],
    tipoCPU: [''], // '' | 'BOX' | 'TRAY'
    ordenacao: ['maisRecentes'], // 'maisRecentes' | 'precoCrescente' | 'precoDecrescente'
    marcaId: [[] as number[]],
    socketId: [[] as number[]],
    chipsetsId: [[] as number[]],
    tecnologiasId: [[] as number[]],
    minPreco: this.fb.control<number | null>(null),
    maxPreco: this.fb.control<number | null>(null),
    minCores: this.fb.control<number | null>(null),
    maxCores: this.fb.control<number | null>(null),
    minFreq: this.fb.control<number | null>(null),
    maxFreq: this.fb.control<number | null>(null),
    tdpBase: this.fb.control<number | null>(null),
    emVenda: this.fb.control<boolean | null>(null)
  });

  ngOnInit(): void {
    this.carregarOpcoesDeFiltro();
    this.monitorarMudancas();
  }

  private carregarOpcoesDeFiltro(): void {
    this.marcaService.listar().subscribe({
      next: (res: any) => {
        this.marcasDisponiveis.set(res.dados || []);
      },
      error: () => this.marcasDisponiveis.set([])
    });

    this.socketService.listar().subscribe({
      next: (res: any) => {
        this.socketsDisponiveis.set(res.dados || []);
      },
      error: () => this.socketsDisponiveis.set([])
    });

    this.chipsetService.listar().subscribe({
      next: (res: any) => {
        this.chipsetsDisponiveis.set(res.dados || []);
      },
      error: () => this.chipsetsDisponiveis.set([])
    });

    this.tecnologiaService.listar().subscribe({
      next: (res: any) => {
        this.tecnologiasDisponiveis.set(res.dados || []);
      },
      error: () => this.tecnologiasDisponiveis.set([])
    });
  }

  private monitorarMudancas(): void {
    // Escuta mudanças no formulário, aguarda 400ms após o usuário parar de digitar/clicar, e emite.
    this.filtroForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe((valores) => {
        const filtrosLimpos = this.limparFiltrosVazios(valores as any);
        this.filtrosMudaram.emit(filtrosLimpos);
      });
  }

  /**
   * Remove chaves vazias ou nulas para não poluir a URL de requisição no backend
   */
  private limparFiltrosVazios(valores: Partial<CpuFilter>): CpuFilter {
    const limpo: any = {};
    Object.entries(valores).forEach(([key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        limpo[key] = value;
      }
    });
    return limpo as CpuFilter;
  }

  protected limparTudo(): void {
    this.filtroForm.reset();
  }
}
