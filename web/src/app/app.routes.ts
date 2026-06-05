import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
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
      }
    ]
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/cliente/pages/cadastro/cadastro.page')
  },
  {
    path: 'login',
    loadComponent: () => import('./features/cliente/pages/login/login.page')
  },
  {
    path: 'usuario/:id',
    loadComponent: () => import('./features/cliente/pages/perfil/perfil-layout.page'),
    children: [
      { path: '', redirectTo: 'informacoes', pathMatch: 'full' },
      { path: 'informacoes', loadComponent: () => import('@features/cliente/components/perfil-informacoes/perfil-informacoes.component') },
      { path: 'enderecos', loadComponent: () => import('@features/cliente/components/perfil-enderecos/perfil-enderecos.component') },
      { path: 'pagamentos', loadComponent: () => import('@features/cliente/components/perfil-cartoes/perfil-cartoes.component') }
    ]
  },
  {
    path: '',
    loadComponent: () => import('@features/pedido/pages/vitrine/vitrine.page'),
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
    loadComponent: () => import('@features/pedido/pages/checkout/checkout.page')
  },
  {
    path: 'pedido/sucesso/:id',
    loadComponent: () => import('@features/pedido/pages/pedido-sucesso/pedido-sucesso.page')
  },

];
