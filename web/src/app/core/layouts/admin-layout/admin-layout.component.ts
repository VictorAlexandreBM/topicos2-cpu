import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '@features/cliente/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
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
    MatExpansionPanelTitle,
    MatDivider
  ],
  template: `
    <mat-sidenav-container class="h-screen w-full bg-gray-100" [hasBackdrop]="false">

      <mat-sidenav #sidenav mode="side" [opened]="true" class="w-64 bg-white border-r shadow-sm">
        <nav class="px-3 flex flex-col h-full">
          <div class="h-16 pt-2 flex items-center justify-center border-b border-gray-100 mb-2">
            <span class="text-xl font-bold tracking-tight text-gray-800">
              ACME<span class="text-blue-600">Admin</span>
            </span>
          </div>

          <mat-accordion multi="true" displayMode="flat" class="flex-1 overflow-y-auto mt-2">
            @for (secao of secoes(); track secao.label) {
              <mat-expansion-panel [expanded]="secao.aberta" class="!shadow-none !bg-transparent border-none">
                <mat-expansion-panel-header class="!px-3 hover:bg-gray-50 !h-12 !rounded-md transition-colors">
                  <mat-panel-title class="flex items-center gap-3 text-gray-700 font-medium text-sm">
                    <mat-icon class="text-gray-500 !w-5 !h-5 !text-[20px]">{{ secao.icone }}</mat-icon>
                    {{ secao.label }}
                  </mat-panel-title>
                </mat-expansion-panel-header>

                <div class="flex flex-col gap-1 py-1 pl-2 border-l-2 border-gray-100 ml-4 mb-2">
                  @for (item of secao.subItens; track item.rota) {
                    <a mat-button [routerLink]="Array.isArray(item.rota) ? ['/admin'].concat(item.rota) : ['/admin', item.rota]"
                       routerLinkActive="!bg-blue-50 !text-blue-700 font-semibold before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600 before:rounded-r-md"
                       class="!w-full !justify-start !pl-6 !h-10 !text-gray-600 !text-sm relative !rounded-md transition-all hover:bg-gray-50">
                      {{ item.label }}
                    </a>
                  }
                </div>
              </mat-expansion-panel>
            }
          </mat-accordion>
        </nav>
      </mat-sidenav>

      <mat-sidenav-content class="flex flex-col h-full overflow-hidden bg-gray-50">

        <header class="h-16 bg-white flex items-center px-6 shrink-0 shadow-sm z-10 relative border-b border-gray-200">
          <button mat-icon-button (click)="sidenav.toggle()" aria-label="Alternar menu lateral" class="text-gray-600 hover:bg-gray-100">
            <mat-icon>menu</mat-icon>
          </button>

          <div class="ml-auto">
            <button mat-button [matMenuTriggerFor]="userMenu" class="!flex !items-center !gap-2 !rounded-full !px-3 hover:bg-gray-50">
              <span class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {{ getIniciais(usuarioAtual()?.nome) }}
              </span>
              <span class="text-sm font-medium text-gray-700 truncate max-w-[120px]">{{ usuarioAtual()?.nome }}</span>
              <mat-icon class="text-gray-400 !text-sm !ml-0">expand_more</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu" class="!min-w-[200px] !mt-2">
              <a mat-menu-item routerLink="/">
                <mat-icon class="text-blue-600">storefront</mat-icon>
                <span>Ir para Vitrine</span>
              </a>
              <mat-divider></mat-divider>
              <a mat-menu-item [routerLink]="['/usuario', usuarioAtual()?.id]">
                <mat-icon class="text-gray-500">person</mat-icon>
                <span>Meu Perfil</span>
              </a>
              <mat-divider class="!my-1"></mat-divider>
              <button mat-menu-item (click)="sair()" class="!text-red-600">
                <mat-icon class="!text-red-600">logout</mat-icon>
                <span>Sair</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-6 md:p-8">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  protected readonly usuarioAtual = this.authService.usuarioAtual;
  protected readonly Array = Array;

  protected getIniciais(nome?: string): string {
    return nome ? nome.charAt(0).toUpperCase() : 'A';
  }

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

  protected sair(): void {
    this.authService.logout().subscribe();
  }
}
