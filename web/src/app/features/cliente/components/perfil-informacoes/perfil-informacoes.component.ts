import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SnackbarService } from '@core/services/snackbar.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError, ValidationError } from '@core/models/backend-error.model';
import {AuthService} from '@features/cliente/services/auth.service';
import {UsuarioUpdateRequest} from '@features/cliente/models/usuario.model';
import {TelefoneFormRequest} from '@features/cliente/models/telefone.model';

@Component({
  selector: 'app-perfil-informacoes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FieldErrorPipe
  ],
  templateUrl: './perfil-informacoes.component.html'
})
export default class PerfilInformacoesComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);

  protected estaCarregando = signal(false);
  protected ocultaSenha = signal(true);

  // E-mail configurado nativamente como desabilitado
  protected readonly emailCtrl = this.fb.control({ value: '', disabled: true });

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(50)]);
  protected readonly sobrenomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  private criarLinhaTelefone(numero: string = '', principal: boolean = false) {
    return this.fb.group({
      numero: [numero, [Validators.required, Validators.pattern('^\\d{10,11}$')]],
      principal: [principal]
    });
  }

  protected readonly senhaAtualCtrl = this.fb.control('', [Validators.required]);

  protected readonly telefonesArray = this.fb.array(
    [this.criarLinhaTelefone()],
    [Validators.required, Validators.minLength(1)]
  );

  protected readonly perfilForm = this.fb.group({
    nome: this.nomeCtrl,
    sobrenome: this.sobrenomeCtrl,
    telefones: this.telefonesArray,
    senhaAtual: this.senhaAtualCtrl // <-- Novo
  });

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    const usuario = this.authService.usuarioAtual();
    if (!usuario) return;

    this.emailCtrl.setValue(usuario.email);
    this.nomeCtrl.setValue(usuario.nome);
    this.sobrenomeCtrl.setValue(usuario.sobrenome);

    this.telefonesArray.clear();

    if (usuario.telefones && usuario.telefones.length > 0) {
      usuario.telefones.forEach(tel => {
        this.telefonesArray.push(this.criarLinhaTelefone(tel.numero, tel.principal));
      });
    } else {
      this.adicionarTelefone();
    }
  }

  protected adicionarTelefone(): void {
    this.telefonesArray.push(this.criarLinhaTelefone());
    this.perfilForm.markAsDirty(); // Força a liberação do botão Salvar
  }

  protected removerTelefone(index: number): void {
    if (this.telefonesArray.length > 1) {
      this.telefonesArray.removeAt(index);
      this.perfilForm.markAsDirty();
    }
  }

  protected salvar(): void {
    if (this.perfilForm.invalid) return;

    this.estaCarregando.set(true);

    const request: UsuarioUpdateRequest = {
      nome: this.nomeCtrl.value.trim(),
      sobrenome: this.sobrenomeCtrl.value.trim(),
      telefones: this.telefonesArray.getRawValue() as TelefoneFormRequest[],
      senhaAtual: this.senhaAtualCtrl.value // <-- Novo
    };

    this.authService.atualizarPerfil(request).subscribe({
      next: () => {
        this.estaCarregando.set(false);
        this.senhaAtualCtrl.reset(); // <-- Limpa a senha após sucesso
        this.perfilForm.markAsPristine();
        this.snackbarService.alertar('Informações atualizadas com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.tratarErros(err);
      }
    });
  }

  private tratarErros(err: HttpErrorResponse): void {
    if (err.error?.errors) {
      err.error.errors.forEach((e: ValidationError<string>) => {
        const control = this.perfilForm.get(e.field);
        if (control) {
          control.setErrors({ backend: e.message });
        } else {
          this.snackbarService.alertar(`Erro em ${e.field}: ${e.message}`);
        }
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar('Erro ao atualizar: ' + (erro?.detail || 'Ocorreu um erro inesperado.'));
    }
  }
}
