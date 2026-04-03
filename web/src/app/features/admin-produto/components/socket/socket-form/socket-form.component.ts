import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import SocketService from '../../../services/socket.service';
import { Socket, SocketFormRequest } from '../../../models/socket.model';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { SnackbarService } from '@core/services/snackbar.service';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

type CamposFormularioSocket = 'tipo';

@Component({
  selector: 'app-socket-form',
  templateUrl: './socket-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIconButton,
    MatIcon,
    MatError,
    FieldErrorPipe,
  ]
})
export class SocketFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(SocketService);
  private readonly snackbarService = inject(SnackbarService);

  readonly socketCadastrado = output<Socket>();
  readonly socketAtualizado = output<Socket>();
  readonly cadastroCancelado = output<void>();

  public readonly socketEmEdicao = inject<Socket | null>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<SocketFormComponent>);

  protected readonly tipoCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);

  protected readonly socketForm = this.fb.group({
    tipo: this.tipoCtrl
  });

  constructor() {
    if (this.socketEmEdicao) {
      this.socketForm.patchValue(this.socketEmEdicao);
    }
  }

  fechar(sucesso: boolean = false) {
    this.cadastroCancelado.emit();
    this.dialogRef.close(sucesso);
  }

  cadastrar() {
    const dadosTratados = this.tratarDados(this.socketForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (s) => {
        this.snackbarService.alertar('Socket cadastrado com sucesso!');
        this.socketCadastrado.emit(s);
        this.socketForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao cadastrar socket')
    });
  }

  atualizar() {
    const dadosTratados = this.tratarDados(this.socketForm.value);

    this.service.atualizar(this.socketEmEdicao!.id, dadosTratados).subscribe({
      next: () => {
        this.snackbarService.alertar('Socket atualizado com sucesso!');
        this.socketAtualizado.emit(this.socketEmEdicao!);
        this.socketForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao atualizar socket')
    });
  }

  private tratarDados(dados: object) {
    return dados as SocketFormRequest;
  }

  private tratarErros(err: HttpErrorResponse, mensagem: string): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<CamposFormularioSocket>[] = err.error.errors;

      erros.forEach((erro) => {
        const control = this.socketForm.get(erro.field);
        if (control) {
          control.setErrors({ backend: erro.message });
        }
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar(`${mensagem}: ${erro?.detail || 'Erro desconhecido'}`);
    }
  }
}
