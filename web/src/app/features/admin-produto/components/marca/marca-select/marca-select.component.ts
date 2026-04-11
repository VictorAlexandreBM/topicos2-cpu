import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { toSignal } from '@angular/core/rxjs-interop';
import { Marca } from '@features/admin-produto/models/marca.model';

@Component({
  selector: 'app-marca-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './marca-select.component.html',
})
export class MarcaSelectComponent {
  // Inputs
  public readonly control = input.required<FormControl<number | null>>();
  public readonly marcas = input.required<Marca[]>();

  // Lógica interna de filtro
  protected readonly filtroCtrl = new FormControl('');

  private readonly filtroSignal = toSignal(this.filtroCtrl.valueChanges, {
    initialValue: ''
  });

  protected readonly marcasFiltradas = computed(() => {
    const lista = this.marcas();
    const busca = (this.filtroSignal() ?? '').toLowerCase();

    if (!busca) return lista;
    return lista.filter(m => m.nome.toLowerCase().includes(busca));
  });
}
