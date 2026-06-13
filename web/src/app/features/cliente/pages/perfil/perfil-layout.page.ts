import { Component, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import {PerfilSidebarComponent} from '@features/cliente/components/perfil-sidebar/perfil-sidebar.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-perfil-layout-page',
  standalone: true,
  imports: [RouterOutlet, PerfilSidebarComponent, NgIf, PerfilSidebarComponent, MatIcon],
  templateUrl: './perfil-layout.page.html'
})
export default class PerfilLayoutPage {
  public readonly id = input<string>();

  private readonly authService = inject(AuthService);
  protected readonly usuarioAtual = this.authService.usuarioAtual;

  get isPerfilProprio(): boolean {
    const idRota = this.id();
    const idLogado = this.usuarioAtual()?.id?.toString();
    return !!idRota && !!idLogado && idRota === idLogado;
  }
}
