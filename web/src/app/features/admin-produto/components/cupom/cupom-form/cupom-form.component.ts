import { Component, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import CupomService from '@features/pedido/services/cupom.service';
import {SnackbarService} from '@core/services/snackbar.service';
import {CupomFormRequest, CupomResponse, TipoDesconto} from '@features/pedido/models/cupom.model';
import {BackendError, ValidationError} from '@core/models/backend-error.model';
import {FieldErrorPipe} from '@core/pipes/field-error.pipe';


type CamposFormularioCupom = 'codigo' | 'valor' | 'tipo' | 'dataValidade' | 'ativo' | 'limiteUsos' | 'valorMinimoPedido';

@Component({
  selector: 'app-cupom-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  templateUrl: './cupom-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIconButton,
    MatIcon,
    MatError,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    FieldErrorPipe,
  ]
})
export class CupomFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(CupomService);
  private readonly snackbarService = inject(SnackbarService);

  public readonly cupomEmEdicao = inject<CupomResponse | null>(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<CupomFormComponent>);

  protected readonly cupomForm = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[A-Z0-9]+$/)]],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    tipo: ['PERCENTUAL' as TipoDesconto, [Validators.required]],
    dataValidade: [new Date(), [Validators.required]],
    ativo: [true],
    limiteUsos: this.fb.control<number | null>(null, [Validators.min(1)]),
    valorMinimoPedido: this.fb.control<number | null>(null, [Validators.min(0)]),
  });

  constructor() {
    if (this.cupomEmEdicao) {
      this.cupomForm.patchValue({
        ...this.cupomEmEdicao,
        dataValidade: new Date(this.cupomEmEdicao.dataValidade)
      });
    }
  }

  fechar(sucesso: boolean = false) {
    this.dialogRef.close(sucesso);
  }

  salvar() {
    if (this.cupomForm.invalid) return;

    const dados = this.tratarDados(this.cupomForm.value);
    const request = this.cupomEmEdicao
      ? this.service.atualizar(this.cupomEmEdicao.id, dados)
      : this.service.cadastrar(dados);

    request.subscribe({
      next: () => {
        this.snackbarService.alertar(`Cupom ${this.cupomEmEdicao ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.fechar(true);
      },
      error: (err: HttpErrorResponse) => this.tratarErros(err)
    });
  }

  private tratarDados(valores: any): CupomFormRequest {
    return {
      ...valores,
      codigo: valores.codigo.toUpperCase(),
      dataValidade: valores.dataValidade.toISOString()
    } as CupomFormRequest;
  }

  private tratarErros(err: HttpErrorResponse): void {
    if (err.error && Object.hasOwn(err.error, 'errors')) {
      const erros: ValidationError<CamposFormularioCupom>[] = err.error.errors;
      erros.forEach((erro) => {
        const control = this.cupomForm.get(erro.field);
        if (control) control.setErrors({ backend: erro.message });
      });
    } else {
      const erro = err.error as BackendError;
      this.snackbarService.alertar(`Erro: ${erro?.detail || 'Erro desconhecido'}`);
    }
  }

  get ctrl() { return this.cupomForm.controls; }
}
