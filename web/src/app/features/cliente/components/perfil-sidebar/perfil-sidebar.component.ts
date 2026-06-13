import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-perfil-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIcon, MatListModule],
  templateUrl: './perfil-sidebar.component.html'
})
export class PerfilSidebarComponent {
  public readonly usuarioId = input.required<string>();

  protected readonly menuItems = [
    { label: 'Informações Pessoais', icone: 'person', rota: 'informacoes' },
    { label: 'Meus Endereços', icone: 'location_on', rota: 'enderecos' },
    { label: 'Lista de Desejos', icone: 'favorite', rota: 'desejos' },
    { label: 'Meus Pedidos', icone: 'local_shipping', rota: 'pedidos' },
    { label: 'Formas de Pagamento', icone: 'credit_card', rota: 'pagamentos' },
  ];
}
