import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

import { AuthService } from '@features/cliente/services/auth.service';
import { EnderecoService } from '@features/cliente/services/endereco.service';
import { LocalizacaoService } from '@features/cliente/services/localizacao.service';
import { EnderecoDetail, EnderecoFormRequest } from '@features/cliente/models/endereco.model';
import { CidadeDetail, EstadoDetail } from '@features/cliente/models/localizacao.model';

@Component({
  selector: 'app-perfil-enderecos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FieldErrorPipe
  ],
  templateUrl: './perfil-enderecos.component.html'
})
export default class PerfilEnderecosComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly enderecoService = inject(EnderecoService);
  private readonly localizacaoService = inject(LocalizacaoService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmService = inject(ConfirmDialogService);

  protected readonly enderecos = computed(() => this.authService.usuarioAtual()?.enderecos || []);

  protected mostrandoForm = signal(false);
  protected estaCarregando = signal(false);
  protected enderecoEmEdicao = signal<EnderecoDetail | null>(null);
  protected estados = signal<EstadoDetail[]>([]);
  protected cidades = signal<CidadeDetail[]>([]);

  protected readonly cepCtrl = this.fb.control('', [Validators.required, Validators.pattern('^\\d{5}-?\\d{3}$')]);
  protected readonly logradouroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(255)]);
  protected readonly quadraCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly numeroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(20)]);
  protected readonly complementoCtrl = this.fb.control('', [Validators.maxLength(100)]);
  protected readonly bairroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly estadoSiglaCtrl = this.fb.control('', [Validators.required]);
  protected readonly cidadeIdCtrl = new FormControl<number | null>(null, [Validators.required]);

  protected readonly enderecoForm = this.fb.group({
    cep: this.cepCtrl,
    logradouro: this.logradouroCtrl,
    quadra: this.quadraCtrl,
    numero: this.numeroCtrl,
    complemento: this.complementoCtrl,
    bairro: this.bairroCtrl,
    cidadeId: this.cidadeIdCtrl
  });

  ngOnInit(): void {
    this.localizacaoService.listarEstados().subscribe(estados => this.estados.set(estados));
  }

  protected onEstadoChange(sigla: string): void {
    this.cidadeIdCtrl.reset();
    this.cidades.set([]);
    if (sigla) {
      this.localizacaoService.listarCidades(sigla).subscribe(cidades => this.cidades.set(cidades));
    }
  }

  protected abrirFormulario(endereco?: EnderecoDetail): void {
    if (endereco) {
      this.enderecoEmEdicao.set(endereco);
      this.enderecoForm.patchValue({
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        quadra: endereco.quadra,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro
      });
      this.estadoSiglaCtrl.setValue(endereco.estado);

      this.localizacaoService.listarCidades(endereco.estado).subscribe(cidades => {
        this.cidades.set(cidades);
        this.cidadeIdCtrl.setValue(endereco.cidadeId);
      });
    } else {
      this.enderecoEmEdicao.set(null);
      this.enderecoForm.reset();
      this.estadoSiglaCtrl.reset();
      this.cidades.set([]);
    }
    this.mostrandoForm.set(true);
  }

  protected cancelarFormulario(): void {
    this.mostrandoForm.set(false);
    this.enderecoEmEdicao.set(null);
    this.enderecoForm.reset();
    this.estadoSiglaCtrl.reset();
    this.cidades.set([]);
  }

  protected salvar(): void {
    if (this.enderecoForm.invalid || this.estadoSiglaCtrl.invalid) return;
    this.estaCarregando.set(true);

    const v = this.enderecoForm.getRawValue();
    const request: EnderecoFormRequest = {
      cep: v.cep,
      logradouro: v.logradouro,
      quadra: v.quadra,
      numero: v.numero,
      complemento: v.complemento || null,
      bairro: v.bairro,
      cidadeId: v.cidadeId!
    };

    const idEdicao = this.enderecoEmEdicao()?.id;
    const operacao$ = idEdicao
      ? this.enderecoService.atualizar(idEdicao, request)
      : this.enderecoService.criar(request);

    operacao$.subscribe({
      next: () => {
        this.snackbarService.alertar(idEdicao ? 'Endereço atualizado!' : 'Endereço salvo!');
        this.recarregarPerfil();
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.tratarErros(err);
      }
    });
  }

  protected async excluir(id: number) {
    const confirmado = await this.confirmService.alertar('Excluir Endereço', 'Tem certeza que deseja excluir este endereço?');
    if (!confirmado) return;

    this.estaCarregando.set(true);
    this.enderecoService.deletar(id).subscribe({
      next: () => {
        this.snackbarService.alertar('Endereço excluído.');
        this.recarregarPerfil();
      },
      error: () => {
        this.estaCarregando.set(false);
        this.snackbarService.alertar('Erro ao excluir endereço.');
      }
    });
  }

  private recarregarPerfil(): void {
    this.authService.carregarUsuarioAtual().subscribe({
      next: () => {
        this.estaCarregando.set(false);
        this.cancelarFormulario();
      },
      error: () => this.estaCarregando.set(false)
    });
  }

  private tratarErros(err: HttpErrorResponse): void {
    if (err.error?.errors) {
      err.error.errors.forEach((e: ValidationError<string>) => {
        const control = this.enderecoForm.get(e.field);
        if (control) control.setErrors({ backend: e.message });
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar('Erro: ' + (erro?.detail || 'Falha ao salvar.'));
    }
  }
}
