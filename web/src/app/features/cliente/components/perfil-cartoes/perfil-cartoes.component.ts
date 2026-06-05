import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'; // Usando lib de máscara comum no Angular

import { SnackbarService } from '@core/services/snackbar.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

import { AuthService } from '@features/cliente/services/auth.service';
import { CartaoService } from '@features/cliente/services/cartao.service';
import { CartaoFormRequest } from '@features/cliente/models/cartao.model';

@Component({
  selector: 'app-perfil-cartoes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FieldErrorPipe,
    UpperCasePipe,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './perfil-cartoes.component.html'
})
export default class PerfilCartoesComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartaoService = inject(CartaoService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmService = inject(ConfirmDialogService);

  // Lê os cartões ativos do usuário
  protected readonly cartoes = computed(() => this.authService.usuarioAtual()?.cartoes || []);

  protected mostrandoForm = signal(false);
  protected estaCarregando = signal(false);

  // Controles do Formulário Visual (Simulando o input real do usuário)
  protected readonly numeroCtrl = this.fb.control('', [Validators.required, Validators.minLength(16)]);
  protected readonly validadeCtrl = this.fb.control('', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])[0-9]{2}$')]); // Formato MMAA
  protected readonly cvvCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  protected readonly titularCtrl = this.fb.control('', [Validators.required]);

  protected readonly cartaoForm = this.fb.group({
    numero: this.numeroCtrl,
    validade: this.validadeCtrl,
    cvv: this.cvvCtrl,
    titular: this.titularCtrl
  });

  protected abrirFormulario(): void {
    this.cartaoForm.reset();
    this.mostrandoForm.set(true);
  }

  protected cancelarFormulario(): void {
    this.mostrandoForm.set(false);
    this.cartaoForm.reset();
  }

  protected salvar(): void {
    if (this.cartaoForm.invalid) return;
    this.estaCarregando.set(true);

    const dadosForm = this.cartaoForm.getRawValue();

    // 1. Lógica de Simulação de Gateway
    const numeroLimpo = dadosForm.numero.replace(/\D/g, '');
    const ultimos4 = numeroLimpo.slice(-4);

    // Simula detecção simples de bandeira pelo primeiro dígito
    let bandeira = 'Outra';
    if (numeroLimpo.startsWith('4')) bandeira = 'Visa';
    else if (numeroLimpo.startsWith('5')) bandeira = 'Mastercard';
    else if (numeroLimpo.startsWith('3')) bandeira = 'Amex';

    const mesStr = dadosForm.validade.substring(0, 2);
    const anoStr = dadosForm.validade.substring(2, 4);

    // 2. Monta o DTO de envio seguro para o backend
    const request: CartaoFormRequest = {
      gatewayToken: `sim_tok_${Math.random().toString(36).substring(2, 15)}`, // Token simulado
      ultimos4: ultimos4,
      bandeira: bandeira,
      mesExpiracao: parseInt(mesStr, 10),
      anoExpiracao: parseInt(`20${anoStr}`, 10),
      titular: dadosForm.titular
    };

    this.cartaoService.criar(request).subscribe({
      next: () => {
        this.snackbarService.alertar('Cartão adicionado com sucesso!');
        this.recarregarPerfil();
      },
      error: (err: HttpErrorResponse) => {
        this.estaCarregando.set(false);
        this.tratarErros(err);
      }
    });
  }

  protected async excluir(id: number) {
    const confirmado = await this.confirmService.alertar('Remover Cartão', 'Tem certeza que deseja remover este cartão? Isso não afetará os pedidos já realizados com ele.');
    if (!confirmado) return;

    this.estaCarregando.set(true);
    this.cartaoService.deletar(id).subscribe({
      next: () => {
        this.snackbarService.alertar('Cartão removido.');
        this.recarregarPerfil();
      },
      error: () => {
        this.estaCarregando.set(false);
        this.snackbarService.alertar('Erro ao remover cartão.');
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
        const control = this.cartaoForm.get(e.field);
        if (control) control.setErrors({ backend: e.message });
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar('Erro: ' + (erro?.detail || 'Falha ao processar cartão.'));
    }
  }
}
