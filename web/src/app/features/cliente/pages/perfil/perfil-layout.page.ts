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
  // O Angular injeta o :id da URL automaticamente aqui
  public readonly id = input<string>();

  private readonly authService = inject(AuthService);
  protected readonly usuarioAtual = this.authService.usuarioAtual;

  // Lógica inicial para validar se o perfil acessado é do próprio usuário logado
  get isPerfilProprio(): boolean {
    const idRota = this.id();
    const idLogado = this.usuarioAtual()?.id?.toString();
    return !!idRota && !!idLogado && idRota === idLogado;
  }
}
