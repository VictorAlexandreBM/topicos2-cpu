import { Routes } from '@angular/router';
import {authGuard} from '@core/guards/auth.guard';
import {adminGuard} from '@core/guards/admin.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('@core/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/cliente/pages/login/login.page') }
    ]
  },
  {
    path: 'cadastro',
    loadComponent: () => import('@core/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/cliente/pages/cadastro/cadastro.page') }
    ]
  },

  {
    path: '',
    loadComponent: () => import('@core/layouts/loja-layout/loja-layout.component').then(m => m.LojaLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('@features/cliente/pages/home/home.page')
      },
      {
        path: '',
        loadComponent: () => import('@features/pedido/pages/vitrine/vitrine.page')
      },
      {
        path: 'produto/:id',
        loadComponent: () => import('@features/pedido/pages/produto-detalhe/produto-detalhe.page')
      },
      {
        path: 'carrinho',
        loadComponent: () => import('@features/pedido/pages/carrinho/carrinho.page')
      },

      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('@features/pedido/pages/checkout/checkout.page')
      },
      {
        path: 'pedido/sucesso/:id',
        canActivate: [authGuard],
        loadComponent: () => import('@features/pedido/pages/pedido-sucesso/pedido-sucesso.page')
      },
      {
        path: 'usuario/:id',
        loadComponent: () => import('./features/cliente/pages/perfil/perfil-layout.page'),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'informacoes', pathMatch: 'full' },
          { path: 'informacoes', loadComponent: () => import('@features/cliente/components/perfil-informacoes/perfil-informacoes.component') },
          { path: 'enderecos', loadComponent: () => import('@features/cliente/components/perfil-enderecos/perfil-enderecos.component') },
          { path: 'pagamentos', loadComponent: () => import('@features/cliente/components/perfil-cartoes/perfil-cartoes.component') },
          { path: 'pedidos', loadComponent: () => import('@features/cliente/components/perfil-pedidos/perfil-pedidos.component') },
          { path: 'desejos', loadComponent: () => import('@features/cliente/components/perfil-lista-desejos/perfil-lista-desejos.component')}
        ]
      }
    ]
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('@core/layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'cpu', pathMatch: 'full' },

      {
        path: 'tecnologia',
        loadComponent: () => import('./features/admin-produto/pages/tecnologia/tecnologia.page')
      },
      {
        path: 'socket',
        loadComponent: () => import('./features/admin-produto/pages/socket/socket.page')
      },
      {
        path: 'marca',
        loadComponent: () => import('./features/admin-produto/pages/marca/marca.page')
      },
      {
        path: 'chipset',
        loadComponent: () => import('./features/admin-produto/pages/chipset/chipset.page')
      },
      {
        path: 'modelo-cpu',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin-produto/pages/modelo-cpu/modelo-cpu.page')
          },
          {
            path: 'criar',
            loadComponent: () => import('@features/admin-produto/components/modelo-cpu/modelo-cpu-form/modelo-cpu-form.component')
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('@features/admin-produto/components/modelo-cpu/modelo-cpu-form/modelo-cpu-form.component')
          }
        ]
      },
      {
        path: 'cpu',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin-produto/pages/cpu/cpu.page')
          },
          {
            path: 'criar',
            loadComponent: () => import('@features/admin-produto/components/cpu/cpu-form/cpu-form.component')
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('@features/admin-produto/components/cpu/cpu-form/cpu-form.component')
          }
        ]
      },
      {
        path: 'usuario',
        loadComponent: () => import('./features/admin-produto/pages/usuario/usuario.page')
      },
      {
        path: 'pedido',
        loadComponent: () => import('./features/admin-produto/pages/pedido/pedido.page')
      },
      {
        path: 'cupom',
        loadComponent: () => import('./features/admin-produto/pages/cupom/cupom.page')
      }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
