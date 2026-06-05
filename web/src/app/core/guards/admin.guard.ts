import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@features/cliente/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.usuarioAtual();

  // Ajuste 'perfil' conforme o nome da propriedade que vem no seu DTO do frontend
  if (usuario && (usuario as any).perfil === 'A') {
    return true;
  }

  router.navigate(['/']); // Se não for admin, chuta pra vitrine
  return false;
};
