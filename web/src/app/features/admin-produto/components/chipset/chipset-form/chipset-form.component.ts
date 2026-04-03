import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import ChipsetService from '../../../services/chipset.service';
import { Chipset, ChipsetFormRequest } from '../../../models/chipset.model';
import { FieldErrorPipe } from '@core/pipes/field-error.pipe';
import { SnackbarService } from '@core/services/snackbar.service';
import { BackendError, ValidationError } from '@core/models/backend-error.model';

type CamposFormularioChipset = 'tipo';

@Component({
  selector: 'app-chipset-form',
  templateUrl: './chipset-form.component.html',
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
export class ChipsetFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ChipsetService);
  private readonly snackbarService = inject(SnackbarService);

  readonly chipsetCadastrado = output<Chipset>();
  readonly chipsetAtualizado = output<Chipset>();
  readonly cadastroCancelado = output<void>();

  public readonly chipsetEmEdicao = inject<Chipset | null>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<ChipsetFormComponent>);

  protected readonly tipoCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);

  protected readonly chipsetForm = this.fb.group({
    tipo: this.tipoCtrl
  });

  constructor() {
    if (this.chipsetEmEdicao) {
      this.chipsetForm.patchValue(this.chipsetEmEdicao);
    }
  }

  fechar(sucesso: boolean = false) {
    this.cadastroCancelado.emit();
    this.dialogRef.close(sucesso);
  }

  cadastrar() {
    const dadosTratados = this.tratarDados(this.chipsetForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (c) => {
        this.snackbarService.alertar('Chipset cadastrado com sucesso!');
        this.chipsetCadastrado.emit(c);
        this.chipsetForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao cadastrar chipset')
    });
  }

  atualizar() {
    const dadosTratados = this.tratarDados(this.chipsetForm.value);

    this.service.atualizar(this.chipsetEmEdicao!.id, dadosTratados).subscribe({
      next: () => {
        this.snackbarService.alertar('Chipset atualizado com sucesso!');
        this.chipsetAtualizado.emit(this.chipsetEmEdicao!);
        this.chipsetForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao atualizar chipset')
    });
  }

  private tratarDados(dados: object) {
    return dados as ChipsetFormRequest;
  }

  private tratarErros(err: HttpErrorResponse, mensagem: string): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<CamposFormularioChipset>[] = err.error.errors;

      erros.forEach((erro) => {
        const control = this.chipsetForm.get(erro.field);
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
