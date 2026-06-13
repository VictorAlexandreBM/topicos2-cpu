import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@features/cliente/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.usuarioAtual();

  if (usuario && (usuario as any).perfil === 'A') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
