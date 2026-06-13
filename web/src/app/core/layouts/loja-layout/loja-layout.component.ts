import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@features/cliente/services/auth.service';
import { CarrinhoService } from '@features/pedido/services/carrinho.service';

@Component({
  selector: 'app-loja-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButton,
    MatIconButton,
    MatIcon,
    MatBadge,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">

      <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="flex justify-between items-center h-16 gap-4">

            <a routerLink="/home" class="flex items-center gap-2 shrink-0 group">
              <div class="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <mat-icon class="!w-6 !h-6 !text-[24px]">memory</mat-icon>
              </div>
              <span class="font-bold text-xl tracking-tight text-gray-900 hidden sm:block"><span class="text-orange-600">Ca</span><span class="text-blue-600">BuM</span></span>
            </a>


            <div class="flex items-center gap-1 sm:gap-3 shrink-0">

              <a mat-icon-button routerLink="/carrinho" class="text-gray-700 hover:text-blue-600 transition-colors">
                <mat-icon [matBadge]="carrinhoService.quantidadeItensCarrinho()"
                          [matBadgeHidden]="carrinhoService.quantidadeItensCarrinho() === 0"
                          matBadgeColor="warn">
                  shopping_cart
                </mat-icon>
              </a>

              <div class="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              @if (usuarioAtual(); as usuario) {
                <button mat-button [matMenuTriggerFor]="menuLogado" class="!px-3 !min-w-0 !rounded-full text-gray-700">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                      {{ getIniciais(usuario.nome) }}
                    </div>
                    <span class="hidden lg:block text-sm font-medium truncate max-w-[120px]">
                      {{ usuario.nome }}
                    </span>
                    <mat-icon class="hidden lg:block !text-gray-400">expand_more</mat-icon>
                  </div>
                </button>

                <mat-menu #menuLogado="matMenu" xPosition="before" class="!min-w-[200px]">
                  <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 mb-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ usuario.nome }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ usuario.email }}</p>
                  </div>

                  <a mat-menu-item [routerLink]="['/usuario', usuario.id]">
                    <mat-icon class="text-gray-500">person</mat-icon>
                    <span>Minha Conta</span>
                  </a>

                  <a mat-menu-item [routerLink]="['/usuario', usuario.id, 'pedidos']">
                    <mat-icon class="text-gray-500">local_shipping</mat-icon>
                    <span>Meus Pedidos</span>
                  </a>

                  @if(usuario.perfil === 'A') {
                    <a mat-menu-item routerLink="/admin" class="!text-blue-700 font-medium">
                      <mat-icon class="!text-blue-700">admin_panel_settings</mat-icon>
                      <span>Painel Administrativo</span>
                    </a>
                  }

                  <mat-divider class="!my-1"></mat-divider>

                  <button mat-menu-item (click)="sair()" class="!text-red-600">
                    <mat-icon class="!text-red-600">logout</mat-icon>
                    <span>Sair</span>
                  </button>
                </mat-menu>
              } @else {
                <div class="hidden sm:flex items-center gap-2">
                  <a mat-button routerLink="/login" class="!text-gray-700">Entrar</a>
                  <a mat-flat-button color="primary" routerLink="/cadastro" class="!rounded-full">Cadastrar</a>
                </div>
              }

            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-white border-t border-gray-200 py-8 mt-auto">
        <div class="max-w-[1600px] mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 CaBum. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  `
})
export class LojaLayoutComponent {
  private readonly authService = inject(AuthService);
  protected readonly carrinhoService = inject(CarrinhoService);

  protected readonly usuarioAtual = this.authService.usuarioAtual;

  protected sair(): void {
    this.authService.logout().subscribe();
  }

  protected getIniciais(nome?: string): string {
    if (!nome) return 'U';
    return nome.charAt(0).toUpperCase();
  }
}
