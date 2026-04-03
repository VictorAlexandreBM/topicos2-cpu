import {Component, effect, inject, Input, input, model, output, signal} from '@angular/core';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import TecnologiaService from '../../../services/tecnologia.service';
import {Tecnologia, TecnologiaFormRequest} from '../../../models/tecnologia.model';
import {FieldErrorPipe} from '../../../../../core/pipes/field-error.pipe';
import {MatIcon} from '@angular/material/icon';
import {SnackbarService} from '../../../../../core/services/snackbar.service';
import {BackendValidationError} from '../../../../../core/models/backend-error.model';
import {HttpErrorResponse} from '@angular/common/http';

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
    MatError,
    FieldErrorPipe,
  ]
})
export class TecnologiaFormComponent {
  private readonly fb =   inject(NonNullableFormBuilder);
  private readonly service = inject(TecnologiaService);
  private readonly snackbarService = inject(SnackbarService);

  public tecnologiaEmEdicao = model.required<Tecnologia | null>();

  public readonly inDrawer = input<boolean>(false);

  readonly tecnologiaCadastrada = output<Tecnologia>();
  readonly tecnologiaAtualizada = output<Tecnologia>();

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly descricaoCtrl = this.fb.control('', [Validators.maxLength(255)]);

  protected readonly tecnologiaForm = this.fb.group({
    nome: this.nomeCtrl,
    descricao: this.descricaoCtrl,
  });

  constructor() {
    effect(() => {
      const tecnologia = this.tecnologiaEmEdicao();

      if (tecnologia) {
        this.tecnologiaForm.patchValue(tecnologia);
      } else {
        this.tecnologiaForm.reset();
      }
    })


  }

  redefinir() {
    this.tecnologiaEmEdicao.set(null);
    this.tecnologiaForm.reset();
  }

  cadastrar() {
    const dadosTratados = this.tratarDados(this.tecnologiaForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (t) => {
        this.tecnologiaCadastrada.emit(t);
        this.tecnologiaForm.reset();
        this.snackbarService.alertar('Tecnologia cadastrada com sucesso!')
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.alertar('Erro ao cadastrar tecnologia!');
        this.tratarErros(err);
      }
    })
  }

  atualizar() {
    const dadosTratados = this.tratarDados(this.tecnologiaForm.value);

    this.service.atualizar(this.tecnologiaEmEdicao()!.id, dadosTratados).subscribe({
      next: () => {
        this.tecnologiaAtualizada.emit(this.tecnologiaEmEdicao()!);
        this.redefinir()
        this.snackbarService.alertar('Tecnologia atualizada com sucesso!')
      },
      error: (err: HttpErrorResponse) => {
        this.snackbarService.alertar('Erro ao atualizar tecnologia!');
        this.tratarErros(err);
      }
    })
  }

  private tratarDados(dados: object) {
    return dados as TecnologiaFormRequest;
  }

  private tratarErros(err: HttpErrorResponse): void {
    const erros: BackendValidationError<CamposFormularioTecnologia>[] = err.error.errors;

    erros.forEach((erro) => {
      const control = this.tecnologiaForm.get(erro.field);
      if (control) {
        control.setErrors({ backend: erro.message });
      }
    });
  }
}
