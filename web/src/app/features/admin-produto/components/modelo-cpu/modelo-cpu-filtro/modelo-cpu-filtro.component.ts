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

import MarcaService from '@features/admin-produto/services/marca.service';
import SocketService from '@features/admin-produto/services/socket.service';

@Component({
  selector: 'app-modelo-cpu-filtro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './modelo-cpu-filtro.component.html'
})
export class ModeloCpuFiltroComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly marcaService = inject(MarcaService);
  private readonly socketService = inject(SocketService);

  public readonly filtrosMudaram = output<any>();

  protected readonly marcasDisponiveis = signal<any[]>([]);
  protected readonly socketsDisponiveis = signal<any[]>([]);

  // O formulário contém exatamente a estrutura do ModeloCpuFilterDTO
  protected readonly filtroForm = this.fb.group({
    nome: [''],
    marcaId: [[] as number[]],
    socketId: [[] as number[]],
    minCores: this.fb.control<number | null>(null),
    maxCores: this.fb.control<number | null>(null),
    minFreq: this.fb.control<number | null>(null),
    maxFreq: this.fb.control<number | null>(null),
    ativo: this.fb.control<boolean>(true) // Por padrão, busca apenas modelos ativos
  });

  // Controle isolado para a checkbox da UI, sincronizado com o campo 'ativo'
  protected mostrarInativosCtrl = this.fb.control(false);

  ngOnInit(): void {
    this.carregarOpcoesDeFiltro();
    this.monitorarMudancas();
  }

  private carregarOpcoesDeFiltro(): void {
    this.marcaService.listar().subscribe({
      next: (res: any) => this.marcasDisponiveis.set(res.dados || [])
    });

    this.socketService.listar().subscribe({
      next: (res: any) => this.socketsDisponiveis.set(res.dados || [])
    });
  }

  private monitorarMudancas(): void {
    this.mostrarInativosCtrl.valueChanges.subscribe(mostrarInativos => {
      this.filtroForm.patchValue({ ativo: !mostrarInativos }, { emitEvent: true });
    });

    this.filtroForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe((valores) => {
        const filtrosLimpos = this.limparFiltrosVazios(valores as any);
        this.filtrosMudaram.emit(filtrosLimpos);
      });
  }

  private limparFiltrosVazios(valores: any): any {
    const limpo: any = {};
    Object.entries(valores).forEach(([key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        limpo[key] = value;
      }
    });
    return limpo;
  }

  protected limparTudo(): void {
    this.filtroForm.reset({ ativo: true });
    this.mostrarInativosCtrl.setValue(false, { emitEvent: false });
  }
}
