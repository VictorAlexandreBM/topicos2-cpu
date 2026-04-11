import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { toSignal } from '@angular/core/rxjs-interop';
import {Chipset} from '@features/admin-produto/models/chipset.model';

@Component({
  selector: 'app-chipset-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './chipset-select.component.html'
})
export class ChipsetSelectComponent {
  public readonly control = input.required<FormControl<number[] | null>>();
  public readonly chipsets = input.required<Chipset[]>();

  protected readonly filtroCtrl = new FormControl('');

  private readonly filtroSignal = toSignal(this.filtroCtrl.valueChanges, {
    initialValue: ''
  });

  protected readonly chipsetsFiltrados = computed(() => {
    const lista = this.chipsets();
    const busca = (this.filtroSignal() ?? '').toLowerCase();

    if (!busca) return lista;
    return lista.filter(c => c.tipo.toLowerCase().includes(busca));
  });
}
