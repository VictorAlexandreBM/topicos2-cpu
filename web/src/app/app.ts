import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

interface ItemMenuLateral {
  nome: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavContainer, MatSidenav, MatButton, RouterLink, RouterLinkActive, MatSidenavContent, MatIconButton, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('web');
  protected readonly itens = signal<ItemMenuLateral[]>([
    {
      nome: 'dashboard',
      label: 'Dashboard'
    },
    {
      nome: 'modelo',
      label: 'Modelos'
    },
    {
      nome: 'tecnologia',
      label: 'Tecnologias'
    },
    {
      nome: 'socket',
      label: 'Sockets'
    },
    {
      nome: 'marca',
      label: 'Marcas'
    },
    {
      nome: 'chipset',
      label: 'Chipsets'
    }
  ]);
}
