import { Component, OnDestroy, output } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-socket-filtro',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatCheckbox
  ],
  templateUrl: './socket-filtro.component.html'
})
export class SocketFiltroComponent implements OnDestroy {

  public filtroAlterado = output<string>();
  public mostrarInativos = output<boolean>();

  protected filtroSubject = new Subject<string>();

  constructor() {
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(f => this.filtroAlterado.emit(f));
  }

  aoDigitar(e: Event) {
    const valor = (e.target as HTMLInputElement).value;
    this.filtroSubject.next(valor);
  }

  aoMudarInativos(mostrarInativos: boolean) {
    this.mostrarInativos.emit(mostrarInativos);
  }

  ngOnDestroy() {
    this.filtroSubject.complete();
  }
}
