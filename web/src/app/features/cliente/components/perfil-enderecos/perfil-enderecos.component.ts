import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';

import { BackendError, ValidationError } from '@core/models/backend-error.model';
import {AuthService} from '@features/cliente/services/auth.service';
import {EnderecoService} from '@features/cliente/services/endereco.service';
import {EnderecoDetail, EnderecoFormRequest} from '@features/cliente/models/endereco.model';

@Component({
  selector: 'app-perfil-enderecos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FieldErrorPipe
  ],
  templateUrl: './perfil-enderecos.component.html'
})
export default class PerfilEnderecosComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly enderecoService = inject(EnderecoService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmService = inject(ConfirmDialogService);

  // Lê os endereços diretamente do cache do perfil do usuário logado
  protected readonly enderecos = computed(() => this.authService.usuarioAtual()?.enderecos || []);

  protected mostrandoForm = signal(false);
  protected estaCarregando = signal(false);
  protected enderecoEmEdicao = signal<EnderecoDetail | null>(null);

  // Controles do Formulário
  protected readonly cepCtrl = this.fb.control('', [Validators.required, Validators.pattern('^\\d{5}-?\\d{3}$')]);
  protected readonly logradouroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(255)]);
  protected readonly quadraCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly numeroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(20)]);
  protected readonly complementoCtrl = this.fb.control('', [Validators.maxLength(100)]);
  protected readonly bairroCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly cidadeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly estadoCtrl = this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]);

  protected readonly enderecoForm = this.fb.group({
    cep: this.cepCtrl,
    logradouro: this.logradouroCtrl,
    quadra: this.quadraCtrl,
    numero: this.numeroCtrl,
    complemento: this.complementoCtrl,
    bairro: this.bairroCtrl,
    cidade: this.cidadeCtrl,
    estado: this.estadoCtrl
  });

  protected abrirFormulario(endereco?: EnderecoDetail): void {
    if (endereco) {
      this.enderecoEmEdicao.set(endereco);
      this.enderecoForm.patchValue(endereco);
    } else {
      this.enderecoEmEdicao.set(null);
      this.enderecoForm.reset();
    }
    this.mostrandoForm.set(true);
  }

  protected cancelarFormulario(): void {
    this.mostrandoForm.set(false);
    this.enderecoEmEdicao.set(null);
    this.enderecoForm.reset();
  }

  protected salvar(): void {
    if (this.enderecoForm.invalid) return;
    this.estaCarregando.set(true);

    const request: EnderecoFormRequest = this.enderecoForm.getRawValue();
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
    const confirmado = await this.confirmService.alertar('Excluir Endereço', 'Tem certeza que deseja excluir este endereço?')
    if (!confirmado) return;

    this.estaCarregando.set(true);
    this.enderecoService.deletar(id).subscribe({
      next: () => {
        this.snackbarService.alertar('Endereço excluído.');
        this.recarregarPerfil();
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.snackbarService.alertar('Erro ao excluir endereço.');
      }
    });
  }

  /**
   * Força a atualização do Signal `usuarioAtual` do AuthService
   * para refletir as mudanças (novo/editado/excluído) na lista.
   */
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
