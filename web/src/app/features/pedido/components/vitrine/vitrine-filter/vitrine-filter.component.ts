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
import {CpuFilter} from '@features/admin-produto/models/cpu.model';


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
    MatRadioModule
  ],
  templateUrl: './vitrine-filter.component.html'
})
export class VitrineFilterComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  // Injeta os serviços para popular as listas do filtro
  private readonly marcaService = inject(MarcaService);
  private readonly socketService = inject(SocketService);

  // Emissor de eventos para o Angular 17+
  public readonly filtrosMudaram = output<CpuFilter>();

  // Armazena as opções de filtro vindas do backend
  protected readonly marcasDisponiveis = signal<any[]>([]);
  protected readonly socketsDisponiveis = signal<any[]>([]);

  // Formulário Reativo contendo a estrutura exata do CpuFilter
  protected readonly filtroForm = this.fb.group({
    nome: [''],
    tipoCPU: [''], // '' | 'BOX' | 'TRAY'
    marcaId: [[] as number[]],
    socketId: [[] as number[]],
    minPreco: this.fb.control<number | null>(null),
    maxPreco: this.fb.control<number | null>(null)
  });

  ngOnInit(): void {
    this.carregarOpcoesDeFiltro();
    this.monitorarMudancas();
  }

  private carregarOpcoesDeFiltro(): void {
    this.marcaService.listar().subscribe({
      next: (res: any) => {
        // Agora extrai o array corretamente de dentro de 'dados'
        this.marcasDisponiveis.set(res.dados || []);
      },
      error: () => this.marcasDisponiveis.set([])
    });

    this.socketService.listar().subscribe({
      next: (res: any) => {
        // Agora extrai o array corretamente de dentro de 'dados'
        this.socketsDisponiveis.set(res.dados || []);
      },
      error: () => this.socketsDisponiveis.set([])
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
