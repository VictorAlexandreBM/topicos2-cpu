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
      }
    ]
  }
];
