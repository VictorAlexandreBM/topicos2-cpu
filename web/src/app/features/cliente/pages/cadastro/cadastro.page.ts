import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { UsuarioCadastroRequest } from '../../models/usuario.model';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

@Component({
  selector: 'app-cadastro-page',
  standalone: true,
  templateUrl: './cadastro.page.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FieldErrorPipe
  ]
})
export default class CadastroPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  protected estaCarregando = signal(false);
  protected mostrarSenha = false;

  protected readonly primeiroNomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(50)]);
  protected readonly sobrenomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly emailCtrl = this.fb.control('', [Validators.required, Validators.email, Validators.maxLength(150)]);
  protected readonly confirmarEmailCtrl = this.fb.control('', [Validators.required]);
  protected readonly senhaCtrl = this.fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]);
  protected readonly confirmarSenhaCtrl = this.fb.control('', [Validators.required]);

  protected readonly telefonesArray = this.fb.array([this.criarLinhaTelefone()], [Validators.required, Validators.minLength(1)]);

  protected readonly cadastroForm = this.fb.group({
    primeiroNome: this.primeiroNomeCtrl,
    sobrenome: this.sobrenomeCtrl,
    email: this.emailCtrl,
    confirmarEmail: this.confirmarEmailCtrl,
    senha: this.senhaCtrl,
    confirmarSenha: this.confirmarSenhaCtrl,
    telefones: this.telefonesArray
  }, { validators: [this.validarEmails, this.validarSenhas] });

  private criarLinhaTelefone() {
    return this.fb.group({
      numero: ['', [Validators.required, Validators.pattern('^\\d{8,9}$')]],
      principal: [false]
    });
  }

  protected adicionarTelefone(): void {
    this.telefonesArray.push(this.criarLinhaTelefone());
  }

  protected removerTelefone(index: number): void {
    if (this.telefonesArray.length > 1) {
      this.telefonesArray.removeAt(index);
    }
  }

  protected cadastrar(): void {
    if (this.cadastroForm.invalid) return;

    this.estaCarregando.set(true);
    const dadosFormulario = this.cadastroForm.getRawValue();

    const request: UsuarioCadastroRequest = {
      primeiroNome: dadosFormulario.primeiroNome.trim(),
      sobrenome: dadosFormulario.sobrenome.trim(),
      email: dadosFormulario.email.trim(),
      confirmarEmail: dadosFormulario.confirmarEmail.trim(),
      senha: dadosFormulario.senha,
      confirmarSenha: dadosFormulario.confirmarSenha,
      telefones: dadosFormulario.telefones
    };

    this.authService.cadastrar(request).subscribe({
      next: () => {
        this.estaCarregando.set(false);
        this.snackbarService.alertar('Cadastro efetuado com sucesso! Faça login para continuar.');
        void this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.tratarErros(err);
      }
    });
  }

  private validarEmails(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email')?.value;
    const confirmarEmail = control.get('confirmarEmail')?.value;

    if (email !== confirmarEmail) {
      control.get('confirmarEmail')?.setErrors({ emailsDiferentes: true });
      return { emailsDiferentes: true };
    }
    return null;
  }

  private validarSenhas(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      control.get('confirmarSenha')?.setErrors({ senhasDiferentes: true });
      return { senhasDiferentes: true };
    }
    return null;
  }

  private tratarErros(err: HttpErrorResponse): void {
    if (err.error?.errors) {
      err.error.errors.forEach((e: ValidationError<string>) => {
        const control = this.cadastroForm.get(e.field);
        if (control) {
          control.setErrors({ backend: e.message });
        } else {
          this.snackbarService.alertar(`Erro em ${e.field}: ${e.message}`);
        }
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar('Erro ao realizar cadastro: ' + (erro?.detail || 'Ocorreu um erro inesperado.'));
    }
  }
}
