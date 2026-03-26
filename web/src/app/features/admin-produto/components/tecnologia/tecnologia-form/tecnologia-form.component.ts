import {Component, inject, output} from '@angular/core';
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import TecnologiaService from '../../../services/tecnologia.service';
import {Tecnologia, TecnologiaFormRequest} from '../../../models/tecnologia.model';
import {FieldErrorPipe} from '../../../../../core/pipes/field-error.pipe';

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

  readonly tecnologiaCadastrada = output<Tecnologia>();

  protected readonly nomeCtrl = this.fb.control('', [Validators.required, Validators.maxLength(100)]);
  protected readonly descricaoCtrl = this.fb.control('', [Validators.maxLength(255)]);

  protected readonly tecnologiaForm = this.fb.group({
    nome: this.nomeCtrl,
    descricao: this.descricaoCtrl,
  });

  cadastrar() {
    const dadosTratados = this.tratarDados(this.tecnologiaForm.value);

    this.service.cadastrar(dadosTratados).subscribe({
      next: (t) => {
        this.tecnologiaCadastrada.emit(t);
        this.tecnologiaForm.reset();
      },
      error: err => {
        console.error(err);
      }
    })
  }

  tratarDados(dados: object) {
    return dados as TecnologiaFormRequest;
  }
}
