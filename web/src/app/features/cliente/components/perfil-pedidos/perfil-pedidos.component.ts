import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { PedidoService } from '@features/pedido/services/pedido.service';
import { PedidoResponse } from '@features/pedido/models/pedido.model';

@Component({
  selector: 'app-perfil-pedidos',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './perfil-pedidos.component.html'
})
export default class PerfilPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);

  protected readonly pedidos = signal<PedidoResponse[]>([]);
  protected readonly estaCarregando = signal(true);

  ngOnInit(): void {
    this.carregarPedidos();
  }

  private carregarPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (dados) => {
        // Ordena para exibir o pedido mais recente primeiro no acordeão
        const ordenados = dados.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
        this.pedidos.set(ordenados);
        this.estaCarregando.set(false);
      },
      error: () => {
        this.estaCarregando.set(false);
      }
    });
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'Aguardando Pagamento': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Pago': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Enviado': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Entregue': return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  protected getStatusIcon(status: string): string {
    switch (status) {
      case 'Aguardando Pagamento': return 'schedule';
      case 'Pago': return 'check_circle';
      case 'Enviado': return 'local_shipping';
      case 'Entregue': return 'inventory_2';
      case 'Cancelado': return 'cancel';
      default: return 'info';
    }
  }
}
