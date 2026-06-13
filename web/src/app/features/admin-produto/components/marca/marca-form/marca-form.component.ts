import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import MarcaService from '../../../services/marca.service';
import { Marca, MarcaFormRequest } from '../../../models/marca.model';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { SnackbarService } from '@core/services/snackbar.service';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

type CamposFormularioMarca = 'nome';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  templateUrl: './marca-form.component.html',
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
export class MarcaFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(MarcaService);
  private readonly snackbarService = inject(SnackbarService);

  readonly marcaCadastrada = output<Marca>();
  readonly marcaAtualizada = output<Marca>();
  readonly cadastroCancelado = output<void>();

  public readonly marcaEmEdicao = inject<Marca | null>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<MarcaFormComponent>);

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);

  protected readonly marcaForm = this.fb.group({
    nome: this.nomeCtrl
  });

  constructor() {
    if (this.marcaEmEdicao) {
      this.marcaForm.patchValue(this.marcaEmEdicao);
    }
  }

  fechar(sucesso: boolean = false) {
    this.cadastroCancelado.emit();
    this.dialogRef.close(sucesso);
  }

  cadastrar() {
    const dadosTratados = this.tratarDados(this.marcaForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (m) => {
        this.snackbarService.alertar('Marca cadastrada com sucesso!');
        this.marcaCadastrada.emit(m);
        this.marcaForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao cadastrar marca')
    });
  }

  atualizar() {
    const dadosTratados = this.tratarDados(this.marcaForm.value);

    this.service.atualizar(this.marcaEmEdicao!.id, dadosTratados).subscribe({
      next: () => {
        this.snackbarService.alertar('Marca atualizada com sucesso!');
        this.marcaAtualizada.emit(this.marcaEmEdicao!);
        this.marcaForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao atualizar marca')
    });
  }

  private tratarDados(dados: object) {
    return dados as MarcaFormRequest;
  }

  private tratarErros(err: HttpErrorResponse, mensagem: string): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<CamposFormularioMarca>[] = err.error.errors;

      erros.forEach((erro) => {
        const control = this.marcaForm.get(erro.field);
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
