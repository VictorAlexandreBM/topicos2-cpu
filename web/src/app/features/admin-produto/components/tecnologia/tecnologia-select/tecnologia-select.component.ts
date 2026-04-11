import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tecnologia } from '@features/admin-produto/models/tecnologia.model';

@Component({
  selector: 'app-tecnologia-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './tecnologia-select.component.html'
})
export class TecnologiaSelectComponent {
  public readonly control = input.required<FormControl<number[] | null>>();
  public readonly tecnologias = input.required<Tecnologia[]>();

  protected readonly filtroCtrl = new FormControl('');

  private readonly filtroSignal = toSignal(this.filtroCtrl.valueChanges, {
    initialValue: ''
  });

  protected readonly tecnologiasFiltradas = computed(() => {
    const lista = this.tecnologias();
    const busca = (this.filtroSignal() ?? '').toLowerCase();

    if (!busca) return lista;
    return lista.filter(t => t.nome.toLowerCase().includes(busca));
  });
}
