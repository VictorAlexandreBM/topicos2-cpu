import { Component, inject, OnInit, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import MarcaService from '@features/admin-produto/services/marca.service';
import SocketService from '@features/admin-produto/services/socket.service';
import ChipsetService from '@features/admin-produto/services/chipset.service';
import TecnologiaService from '@features/admin-produto/services/tecnologia.service';
import { CpuFilter } from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-cpu-filtro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './cpu-filtro.component.html'
})
export class CpuFiltroComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly marcaService = inject(MarcaService);
  private readonly socketService = inject(SocketService);
  private readonly chipsetService = inject(ChipsetService);
  private readonly tecnologiaService = inject(TecnologiaService);

  public readonly filtrosMudaram = output<CpuFilter>();

  protected readonly marcasDisponiveis = signal<any[]>([]);
  protected readonly socketsDisponiveis = signal<any[]>([]);
  protected readonly chipsetsDisponiveis = signal<any[]>([]);
  protected readonly tecnologiasDisponiveis = signal<any[]>([]);

  protected readonly filtroForm = this.fb.group({
    nome: [''],
    nomeModelo: [''],
    tipoCPU: [''],
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
    emVenda: this.fb.control<boolean>(true)
  });

  protected mostrarIndisponiveisCtrl = this.fb.control(false);

  ngOnInit(): void {
    this.carregarOpcoesDeFiltro();
    this.monitorarMudancas();
  }

  private carregarOpcoesDeFiltro(): void {
    this.marcaService.listar().subscribe({ next: (res: any) => this.marcasDisponiveis.set(res.dados || []) });
    this.socketService.listar().subscribe({ next: (res: any) => this.socketsDisponiveis.set(res.dados || []) });
    this.chipsetService.listar().subscribe({ next: (res: any) => this.chipsetsDisponiveis.set(res.dados || []) });
    this.tecnologiaService.listar().subscribe({ next: (res: any) => this.tecnologiasDisponiveis.set(res.dados || []) });
  }

  private monitorarMudancas(): void {
    this.mostrarIndisponiveisCtrl.valueChanges.subscribe(mostrarIndisponiveis => {
      this.filtroForm.patchValue({ emVenda: !mostrarIndisponiveis }, { emitEvent: true });
    });

    this.filtroForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe((valores) => {
        const filtrosLimpos = this.limparFiltrosVazios(valores as any);
        this.filtrosMudaram.emit(filtrosLimpos);
      });
  }

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
    this.filtroForm.reset({ emVenda: true, tipoCPU: '' });
    this.mostrarIndisponiveisCtrl.setValue(false, { emitEvent: false });
  }
}
