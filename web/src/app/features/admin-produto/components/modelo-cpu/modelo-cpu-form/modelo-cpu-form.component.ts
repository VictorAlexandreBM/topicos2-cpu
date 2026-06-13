import { Component, effect, inject, input, output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError, ValidationError } from '@core/models/backend-error.model';
import { SnackbarService } from '@core/services/snackbar.service';

import { ModeloCpuDetail, ModeloCpuFormRequest } from '@features/admin-produto/models/modelo-cpu/modelo-cpu.model';
import { TipoNucleo, TipoNucleoOpcoes } from '@features/admin-produto/models/modelo-cpu/cluster-nucleo.model';
import { Marca } from '@features/admin-produto/models/marca.model';
import { Socket } from '@features/admin-produto/models/socket.model';
import SocketService from '@features/admin-produto/services/socket.service';
import { Chipset } from '@features/admin-produto/models/chipset.model';
import { Tecnologia } from '@features/admin-produto/models/tecnologia.model';
import ModeloCpuService from '@features/admin-produto/services/modelo-cpu.service';
import MarcaService from '@features/admin-produto/services/marca.service';
import TecnologiaService from '@features/admin-produto/services/tecnologia.service';
import ChipsetService from '@features/admin-produto/services/chipset.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { MarcaSelectComponent } from '@features/admin-produto/components/marca/marca-select/marca-select.component';
import { SocketSelectComponent } from '@features/admin-produto/components/socket/socket-select/socket-select.component';
import { TecnologiaSelectComponent } from '@features/admin-produto/components/tecnologia/tecnologia-select/tecnologia-select.component';
import { ChipsetSelectComponent } from '@features/admin-produto/components/chipset/chipset-select/chipset-select.component';

@Component({
  selector: 'app-modelo-cpu-form',
  standalone: true,
  templateUrl: './modelo-cpu-form.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIconButton,
    MatIcon,
    MatError,
    MatSelect,
    MatOption,
    FieldErrorPipe,
    MatSelectSearchComponent,
    MarcaSelectComponent,
    SocketSelectComponent,
    TecnologiaSelectComponent,
    ChipsetSelectComponent,
  ]
})
export default class ModeloCpuFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);

  private readonly service = inject(ModeloCpuService);
  private readonly marcaService = inject(MarcaService);
  private readonly socketService = inject(SocketService);
  private readonly tecnologiaService = inject(TecnologiaService);
  private readonly chipsetService = inject(ChipsetService);

  public readonly id = input<string>();
  public readonly modeloEmEdicao = input<ModeloCpuDetail | null>(null);

  protected readonly marcasResponse = toSignal(this.marcaService.listar());
  protected readonly socketsResponse = toSignal(this.socketService.listar());
  protected readonly tecnologiasResponse = toSignal(this.tecnologiaService.listar());
  protected readonly chipsetsResponse = toSignal(this.chipsetService.listar());

  readonly modeloCadastrado = output<ModeloCpuDetail>();
  readonly modeloAtualizado = output<{ id: number, dados: ModeloCpuFormRequest }>();
  readonly cadastroCancelado = output<void>();

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(200)]);
  protected readonly marcaIdCtrl = this.fb.control<number | null>(null, [Validators.required]);
  protected readonly socketIdCtrl = this.fb.control<number | null>(null, [Validators.min(0)]);
  protected readonly chipsetIdsCtrl = this.fb.control<number[] | null>(null);
  protected readonly tecnologiaIdsCtrl = this.fb.control<number[] | null>(null);

  protected readonly descricaoComercialCtrl = this.fb.control<string | null>(null, [Validators.maxLength(1000)]);
  protected readonly tdpBaseWCtrl = this.fb.control<number | null>(null, [Validators.min(0), Validators.pattern('^[0-9]*$')]);
  protected readonly cacheL2MBCtrl = this.fb.control<number | null>(null, [Validators.min(0), Validators.pattern('^[0-9]*[.,]?[0-9]+$')]);
  protected readonly cacheL3MBCtrl = this.fb.control<number | null>(null, [Validators.min(0), Validators.pattern('^[0-9]*[.,]?[0-9]+$')]);

  protected readonly fichaTecnicaGroup = this.fb.group({
    descricaoComercial: this.descricaoComercialCtrl,
    tdpBaseW: this.tdpBaseWCtrl,
    cacheL2MB: this.cacheL2MBCtrl,
    cacheL3MB: this.cacheL3MBCtrl,
  });

  protected novaLinhaCluster() {
    return this.fb.group({
      frequenciaBase: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*[.,]?[0-9]+$')]),
      frequenciaMaxima: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*[.,]?[0-9]+$')]),
      quantidadeNucleos: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
      tipoNucleo: this.fb.control<TipoNucleo | null>(null, [Validators.required])
    });
  }

  protected readonly clustersArray = this.fb.array([] as ReturnType<ModeloCpuFormComponent['novaLinhaCluster']>[], [Validators.required]);

  protected readonly modeloForm = this.fb.group({
    nome: this.nomeCtrl,
    marcaId: this.marcaIdCtrl,
    socketId: this.socketIdCtrl,
    fichaTecnica: this.fichaTecnicaGroup,
    clustersNucleo: this.clustersArray as FormArray,
    chipsetIds: this.chipsetIdsCtrl,
    tecnologiaIds: this.tecnologiaIdsCtrl,
  });

  public readonly tiposNucleoOpcoes = TipoNucleoOpcoes;

  get modoEdicao(): boolean {
    return !!(this.modeloEmEdicao() || this.id());
  }

  constructor() {
    effect(() => {
      const modelo = this.modeloEmEdicao();
      const routeId = this.id();

      if (modelo) {
        this.preencherFormularioComDetalhe(modelo);
      } else if (routeId) {
        this.service.get(Number(routeId)).subscribe({
          next: (detalhes: ModeloCpuDetail) => {
            this.preencherFormularioComDetalhe(detalhes);
          },
          error: () => {
            this.snackbarService.alertar('Erro ao carregar detalhes do modelo');
            this.voltarParaListagem();
          }
        });
      } else {
        if (this.clustersArray.length === 0) {
          this.adicionarCluster();
        }
      }
    });
  }

  adicionarCluster(): void {
    this.clustersArray.push(this.novaLinhaCluster());
  }

  removerCluster(index: number): void {
    if (index >= 0 && index < this.clustersArray.length) {
      this.clustersArray.removeAt(index);
    }
  }

  cancelar(): void {
    if (this.id()) {
      this.voltarParaListagem();
    } else {
      this.cadastroCancelado.emit();
    }
  }

  salvar(acao: 'voltar' | 'continuar'): void {
    if (this.modeloForm.invalid) return;

    if (this.modoEdicao) {
      this.atualizar(acao);
    } else {
      this.cadastrar(acao);
    }
  }

  private cadastrar(acao: 'voltar' | 'continuar'): void {
    const dadosTratados = this.tratarDados(this.modeloForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (m) => {
        this.snackbarService.alertar('Modelo cadastrado com sucesso!');
        this.modeloCadastrado.emit(m);

        if (acao === 'voltar') {
          this.voltarParaListagem();
        } else {
          this.resetarFormulario();
        }
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao cadastrar modelo CPU')
    });
  }

  private atualizar(acao: 'voltar' | 'continuar'): void {
    const idAtual = this.id() ? Number(this.id()) : this.modeloEmEdicao()?.id;
    if (!idAtual) return;

    const dados = this.tratarDados(this.modeloForm.value);

    this.service.atualizar(idAtual, dados).subscribe({
      next: () => {
        this.snackbarService.alertar('Modelo atualizado com sucesso!');
        this.modeloAtualizado.emit({ id: idAtual, dados });

        if (acao === 'voltar' && this.id()) {
          this.voltarParaListagem();
        }
      },
      error: (err) => this.tratarErros(err, 'Erro ao atualizar modelo')
    });
  }

  protected voltarParaListagem(): void {
    this.router.navigate(['/admin/modelo-cpu']);
  }

  private resetarFormulario(): void {
    this.modeloForm.reset();
    this.clustersArray.clear();
    this.adicionarCluster();

    Object.keys(this.modeloForm.controls).forEach(key => {
      const control = this.modeloForm.get(key);
      control?.setErrors(null);
    });
  }

  private tratarDados(dados: any): ModeloCpuFormRequest {
    const fichaTecnica = dados.fichaTecnica || {};

    const toNumber = (v: any): number | undefined => {
      if (v === null || v === undefined || v === '') return undefined;
      const s = typeof v === 'string' ? v.replace(',', '.').trim() : v;
      const n = Number(s);
      return isNaN(n) ? undefined : n;
    };

    return {
      nome: dados.nome?.trim(),
      marcaId: Number(dados.marcaId),
      socketId: dados.socketId != null ? Number(dados.socketId) : undefined,
      fichaTecnica: {
        descricaoComercial: fichaTecnica.descricaoComercial || undefined,
        tdpBaseW: toNumber(fichaTecnica.tdpBaseW),
        cacheL2MB: toNumber(fichaTecnica.cacheL2MB),
        cacheL3MB: toNumber(fichaTecnica.cacheL3MB),
      },
      clustersNucleo: (dados.clustersNucleo || []).map((c: any) => ({
        frequenciaBase: toNumber(c.frequenciaBase)!,
        frequenciaMaxima: toNumber(c.frequenciaMaxima)!,
        quantidadeNucleos: toNumber(c.quantidadeNucleos)!,
        tipoNucleo: c.tipoNucleo,
      })),
      chipsetIds: Array.isArray(dados.chipsetIds) && dados.chipsetIds.length ? dados.chipsetIds.map((n: any) => Number((typeof n === 'string' ? n.replace(',', '.') : n))) : undefined,
      tecnologiaIds: Array.isArray(dados.tecnologiaIds) && dados.tecnologiaIds.length ? dados.tecnologiaIds.map((n: any) => Number((typeof n === 'string' ? n.replace(',', '.') : n))) : undefined,
    };
  }

  public tratarErros(err: HttpErrorResponse, mensagemPadrao: string = 'Erro ao salvar modelo CPU'): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<string>[] = err.error.errors;

      erros.forEach((erro) => {
        const control = this.modeloForm.get(erro.field);
        if (control) {
          control.setErrors({ backend: erro.message });
        }
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar(`${mensagemPadrao}: ${erro?.detail || 'Erro desconhecido'}`);
    }
  }

  private preencherFormularioComDetalhe(modelo: ModeloCpuDetail): void {
    this.modeloForm.patchValue({
      nome: modelo.nome,
      marcaId: modelo.marca?.id ?? null,
      socketId: modelo.socket?.id ?? null,
      fichaTecnica: {
        descricaoComercial: modelo.fichaTecnica?.descricaoComercial ?? null,
        tdpBaseW: modelo.fichaTecnica?.tdpBaseW ?? null,
        cacheL2MB: modelo.fichaTecnica?.cacheL2MB ?? null,
        cacheL3MB: modelo.fichaTecnica?.cacheL3MB ?? null,
      },
      chipsetIds: Array.isArray(modelo.chipsets) ? modelo.chipsets.map(c => c.id) : null,
      tecnologiaIds: Array.isArray(modelo.tecnologias) ? modelo.tecnologias.map(t => t.id) : null,
    });

    this.clustersArray.clear();
    if (Array.isArray(modelo.clustersNucleo) && modelo.clustersNucleo.length) {
      modelo.clustersNucleo.forEach((c) => {
        const grupo = this.novaLinhaCluster();
        grupo.patchValue({
          frequenciaBase: c.frequenciaBase ?? null,
          frequenciaMaxima: c.frequenciaMaxima ?? null,
          quantidadeNucleos: c.quantidadeNucleos ?? null,
          tipoNucleo: c.tipoNucleo ?? null,
        });
        this.clustersArray.push(grupo);
      });
    } else {
      this.adicionarCluster();
    }
  }
}
