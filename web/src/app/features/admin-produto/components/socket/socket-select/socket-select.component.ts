import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { toSignal } from '@angular/core/rxjs-interop';
import { Socket } from '@features/admin-produto/models/socket.model';

@Component({
  selector: 'app-socket-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './socket-select.component.html',
})
export class SocketSelectComponent {
  // Inputs
  public readonly control = input.required<FormControl<number | null>>();
  public readonly sockets = input.required<Socket[]>();

  // Lógica interna de filtro
  protected readonly filtroCtrl = new FormControl('');

  private readonly filtroSignal = toSignal(this.filtroCtrl.valueChanges, {
    initialValue: ''
  });

  protected readonly socketsFiltrados = computed(() => {
    const lista = this.sockets();
    const busca = (this.filtroSignal() ?? '').toLowerCase();

    if (!busca) return lista;
    return lista.filter(s => s.tipo.toLowerCase().includes(busca));
  });
}
