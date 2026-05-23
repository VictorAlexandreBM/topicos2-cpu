import { Component, OnDestroy, output } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-cpu-filtro',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatCheckbox
  ],
  templateUrl: './cpu-filtro.component.html'
})
export class CpuFiltroComponent implements OnDestroy {

  public filtroAlterado = output<string>();
  public mostrarIndisponiveis = output<boolean>();

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

  aoMudarIndisponiveis(mostrarIndisponiveis: boolean) {
    this.mostrarIndisponiveis.emit(mostrarIndisponiveis);
  }

  ngOnDestroy() {
    this.filtroSubject.complete();
  }
}
