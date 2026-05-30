import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError } from '@core/models/backend-error.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login.page.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FieldErrorPipe
  ]
})
export default class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  protected estaCarregando = signal(false);
  protected mostrarSenha = false;

  // Declaração de controles isolados para evitar erros no strict mode do template
  protected readonly emailCtrl = this.fb.control('', [Validators.required, Validators.email]);
  protected readonly senhaCtrl = this.fb.control('', [Validators.required]);

  protected readonly loginForm = this.fb.group({
    email: this.emailCtrl,
    senha: this.senhaCtrl
  });

  protected logar(): void {
    if (this.loginForm.invalid) return;

    this.estaCarregando.set(true);

    const credenciais = {
      email: this.emailCtrl.value.trim(),
      senha: this.senhaCtrl.value
    };

    this.authService.login(credenciais).subscribe({
      next: (usuarioDetalhe) => {
        this.estaCarregando.set(false);
        this.snackbarService.alertar(`Bem-vindo de volta, ${usuarioDetalhe.nome}!`);

        // Redireciona o usuário para o painel administrativo ou página inicial após o login.
        // Ajuste a rota '/admin' conforme a necessidade do seu projeto.
        void this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.tratarErros(err);
      }
    });
  }

  private tratarErros(err: HttpErrorResponse): void {
    // Caso a API retorne erros específicos de campo (ex: validação)
    if (err.error?.errors) {
      err.error.errors.forEach((e: any) => {
        const control = this.loginForm.get(e.field);
        if (control) {
          control.setErrors({ backend: e.message });
        }
      });
    } else {
      // Caso seja um erro de "Não Autorizado / Not Found" geral
      const erro = err.error as BackendError;

      // Limpamos a senha para o usuário tentar novamente
      this.senhaCtrl.reset();

      this.snackbarService.alertar(erro?.detail || 'E-mail ou senha incorretos.');
    }
  }
}
