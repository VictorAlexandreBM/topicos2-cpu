import {Component, OnDestroy, output} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-tecnologia-filtro',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon
  ],
  templateUrl: './tecnologia-filtro.component.html'
})
export class TecnologiaFiltroComponent implements OnDestroy {

  public filtroAlterado = output<string>();

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

  ngOnDestroy() {
    this.filtroSubject.complete();
  }

}
