import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { AuthService } from './features/cliente/services/auth.service';

interface ItemMenuLateral {
  nome: string;
  rota: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly title = signal('web');
  protected secoes = signal([
    {
      label: 'Configurações Base',
      icone: 'settings',
      aberta: true,
      subItens: [
        { label: 'Tecnologias', rota: 'tecnologia' },
        { label: 'Sockets', rota: 'socket' },
        { label: 'Marcas', rota: 'marca' },
        { label: 'Chipsets', rota: 'chipset' }
      ]
    },
    {
      label: 'Hardware',
      icone: 'memory',
      aberta: false,
      subItens: [
        { label: 'Modelos de CPU', rota: 'modelo-cpu' },
        { label: 'Processadores', rota: 'cpu' }
      ]
    }
  ]);
  protected readonly Array = Array;

  protected sair(): void {
    this.authService.logout().subscribe();
  }
}
