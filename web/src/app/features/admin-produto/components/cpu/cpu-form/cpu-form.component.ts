import { Component, effect, inject, input, output } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';

import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError, ValidationError } from '@core/models/backend-error.model';
import { SnackbarService } from '@core/services/snackbar.service';

import { CpuDetail, CpuFormRequest } from '@features/admin-produto/models/cpu.model';
import CpuService from '@features/admin-produto/services/cpu.service';
import ModeloCpuService from '@features/admin-produto/services/modelo-cpu.service';

@Component({
  selector: 'app-cpu-form',
  standalone: true,
  templateUrl: './cpu-form.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIconButton,
    MatIcon,
    MatError,
    MatSelect,
    MatOption,
    MatCheckbox,
    FieldErrorPipe,
    NgClass
  ]
})
export default class CpuFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);

  private readonly service = inject(CpuService);
  private readonly modeloCpuService = inject(ModeloCpuService);

  public readonly id = input<string>();
  public readonly cpuEmEdicao = input<CpuDetail | null>(null);

  // Carrega opções de modelos para o select
  protected readonly modelosResponse = toSignal(this.modeloCpuService.listar({ tamanho: 100, ativo: true }));

  readonly cpuCadastrada = output<CpuDetail>();
  readonly cpuAtualizada = output<{ id: number, dados: CpuFormRequest }>();
  readonly cadastroCancelado = output<void>();

  // Controles Base
  protected readonly tipoCtrl = this.fb.control<'BOX' | 'TRAY'>('BOX', [Validators.required]);
  protected readonly skuCtrl = this.fb.control('', [Validators.required, Validators.maxLength(20)]);
  protected readonly precoCtrl = this.fb.control('', [Validators.required]);
  protected readonly estoqueCtrl = this.fb.control('', [Validators.required]);
  protected readonly modeloIdCtrl = this.fb.control<number | null>(null, [Validators.required]);
  protected readonly nomeComercialCtrl = this.fb.control('');
  protected readonly emVendaCtrl = this.fb.control(true);

  // Controles específicos de BOX
  protected readonly incluiCoolerCtrl = this.fb.control(true);
  protected readonly pesoEmbalagemGramasCtrl = this.fb.control('');

  // Controles específicos de TRAY
  protected readonly loteFabricacaoCtrl = this.fb.control('');

  protected readonly cpuForm = this.fb.group({
    tipo: this.tipoCtrl,
    sku: this.skuCtrl,
    preco: this.precoCtrl,
    estoque: this.estoqueCtrl,
    modeloId: this.modeloIdCtrl,
    nomeComercial: this.nomeComercialCtrl,
    emVenda: this.emVendaCtrl,
    incluiCooler: this.incluiCoolerCtrl,
    pesoEmbalagemGramas: this.pesoEmbalagemGramasCtrl,
    loteFabricacao: this.loteFabricacaoCtrl
  });

  get modoEdicao(): boolean {
    return !!(this.cpuEmEdicao() || this.id());
  }

  constructor() {
    // Monitora o tipo para aplicar validações dinâmicas
    this.tipoCtrl.valueChanges.subscribe(tipo => this.ajustarValidadoresEspecificos(tipo));

    effect(() => {
      const cpu = this.cpuEmEdicao();
      const routeId = this.id();

      if (cpu) {
        this.preencherFormularioComDetalhe(cpu);
      } else if (routeId) {
        this.service.get(Number(routeId)).subscribe({
          next: (detalhes) => this.preencherFormularioComDetalhe(detalhes),
          error: () => {
            this.snackbarService.alertar('Erro ao carregar detalhes da CPU');
            this.voltarParaListagem();
          }
        });
      }
    });
  }

  private ajustarValidadoresEspecificos(tipo: 'BOX' | 'TRAY' | null) {
    this.pesoEmbalagemGramasCtrl.clearValidators();
    this.loteFabricacaoCtrl.clearValidators();

    if (tipo === 'BOX') {
      this.pesoEmbalagemGramasCtrl.setValidators([Validators.required, Validators.min(0)]);
    } else if (tipo === 'TRAY') {
      this.loteFabricacaoCtrl.setValidators([Validators.required, Validators.maxLength(50)]);
    }

    this.pesoEmbalagemGramasCtrl.updateValueAndValidity();
    this.loteFabricacaoCtrl.updateValueAndValidity();
  }

  salvar(acao: 'voltar' | 'continuar'): void {
    if (this.cpuForm.invalid) return;

    if (this.modoEdicao) {
      this.atualizar(acao);
    } else {
      this.cadastrar(acao);
    }
  }

  private cadastrar(acao: 'voltar' | 'continuar'): void {
    const dados = this.tratarDados(this.cpuForm.getRawValue());

    this.service.cadastrar(dados).subscribe({
      next: (m) => {
        this.snackbarService.alertar('CPU cadastrada com sucesso!');
        this.cpuCadastrada.emit(m);
        acao === 'voltar' ? this.voltarParaListagem() : this.resetarFormulario();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err)
    });
  }

  private atualizar(acao: 'voltar' | 'continuar'): void {
    const idAtual = this.id() ? Number(this.id()) : (this.cpuEmEdicao() as any)?.id;
    const dados = this.tratarDados(this.cpuForm.getRawValue());

    this.service.atualizar(idAtual, dados).subscribe({
      next: () => {
        this.snackbarService.alertar('CPU atualizada com sucesso!');
        this.cpuAtualizada.emit({ id: idAtual, dados });
        if (acao === 'voltar') this.voltarParaListagem();
      },
      error: (err) => this.tratarErros(err)
    });
  }

  private tratarDados(values: any): CpuFormRequest {
    const common = {
      sku: values.sku.trim(),
      preco: Number(values.preco.toString().replace(',', '.')),
      estoque: Number(values.estoque),
      modeloId: Number(values.modeloId),
      nomeComercial: values.nomeComercial?.trim() || undefined,
      emVenda: !!values.emVenda,
      tipo: values.tipo
    };

    if (values.tipo === 'BOX') {
      return {
        ...common,
        tipo: 'BOX',
        incluiCooler: !!values.incluiCooler,
        pesoEmbalagemGramas: Number(values.pesoEmbalagemGramas.toString().replace(',', '.'))
      } as any;
    }

    return {
      ...common,
      tipo: 'TRAY',
      loteFabricacao: values.loteFabricacao?.trim()
    } as any;
  }

  private preencherFormularioComDetalhe(cpu: CpuDetail): void {
    this.cpuForm.patchValue({
      tipo: cpu.tipo,
      sku: cpu.sku,
      preco: cpu.preco.toString().replace('.', ','),
      estoque: cpu.estoque.toString(),
      modeloId: cpu.modelo?.id,
      nomeComercial: cpu.nomeComercial,
      emVenda: cpu.emVenda,
    });

    if (cpu.tipo === 'BOX') {
      this.cpuForm.patchValue({
        incluiCooler: cpu.incluiCooler,
        pesoEmbalagemGramas: cpu.pesoEmbalagemGramas.toString().replace('.', ',')
      });
    } else if (cpu.tipo === 'TRAY') {
      this.cpuForm.patchValue({
        loteFabricacao: cpu.loteFabricacao
      });
    }

    this.tipoCtrl.disable();
  }

  protected voltarParaListagem(): void {
    this.router.navigate(['/admin/cpu']);
  }

  private resetarFormulario(): void {
    this.cpuForm.reset({ tipo: 'BOX', emVenda: true, incluiCooler: true });
    Object.keys(this.cpuForm.controls).forEach(k => this.cpuForm.get(k)?.setErrors(null));
  }

  private tratarErros(err: HttpErrorResponse): void {
    if (err.error?.errors) {
      err.error.errors.forEach((e: ValidationError<string>) => {
        this.cpuForm.get(e.field)?.setErrors({ backend: e.message });
      });
    } else {
      this.snackbarService.alertar('Erro ao salvar CPU: ' + (err.error as BackendError)?.detail);
    }
  }

  public cancelar() {
    return this.id() ? this.voltarParaListagem() : this.cadastroCancelado.emit();
  }

}
