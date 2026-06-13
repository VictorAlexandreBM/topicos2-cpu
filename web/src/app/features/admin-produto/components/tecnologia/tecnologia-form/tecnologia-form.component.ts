import {Component, effect, inject, output} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import TecnologiaService from '../../../services/tecnologia.service';
import { Tecnologia, TecnologiaFormRequest } from '../../../models/tecnologia.model';
import { FieldErrorPipe } from '../../../../../core/pipes/field-error.pipe';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { BackendError, ValidationError } from '../../../../../core/models/backend-error.model';

type CamposFormularioTecnologia = 'nome' | 'descricao';

@Component({
  selector: 'app-tecnologia-form',
  templateUrl: './tecnologia-form.component.html',
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
export class TecnologiaFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(TecnologiaService);
  private readonly snackbarService = inject(SnackbarService);

  readonly tecnologiaCadastrada = output<Tecnologia>();
  readonly tecnologiaAtualizada  = output<Tecnologia>();
  readonly cadastroCancelado = output<void>();

  public readonly tecnologiaEmEdicao = inject<Tecnologia | null>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<TecnologiaFormComponent>);

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly descricaoCtrl = this.fb.control('', [Validators.maxLength(255)]);

  protected readonly tecnologiaForm = this.fb.group({
    nome: this.nomeCtrl,
    descricao: this.descricaoCtrl,
  });

  constructor() {
    if (this.tecnologiaEmEdicao) {
      this.tecnologiaForm.patchValue(this.tecnologiaEmEdicao);
    }
  }

  fechar(sucesso: boolean = false) {
    this.cadastroCancelado.emit();
    this.dialogRef.close(sucesso);
  }

  cadastrar() {
    const dadosTratados = this.tratarDados(this.tecnologiaForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (t) => {
        this.snackbarService.alertar('Tecnologia cadastrada com sucesso!');
        this.tecnologiaCadastrada.emit(t);
        this.tecnologiaForm.reset();
        },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao cadastrar tecnologia')
    });
  }

  atualizar() {
    const dadosTratados = this.tratarDados(this.tecnologiaForm.value);

    this.service.atualizar(this.tecnologiaEmEdicao!.id, dadosTratados).subscribe({
      next: () => {
        this.snackbarService.alertar('Tecnologia atualizada com sucesso!');
        this.tecnologiaAtualizada.emit(this.tecnologiaEmEdicao!);
        this.tecnologiaForm.reset();
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err, 'Erro ao atualizar tecnologia')
    });
  }

  private tratarDados(dados: object) {
    return dados as TecnologiaFormRequest;
  }

  private tratarErros(err: HttpErrorResponse, mensagem: string): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<CamposFormularioTecnologia>[] = err.error.errors;

      erros.forEach((erro) => {
        const control = this.tecnologiaForm.get(erro.field);
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
