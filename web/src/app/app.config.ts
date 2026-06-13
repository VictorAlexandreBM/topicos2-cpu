import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
  provideAppInitializer
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, defaultIfEmpty, of } from 'rxjs';

import { routes } from './app.routes';
import { apiInterceptorFn } from './core/interpectors/api.interceptor';
import { jwtInterceptorFn } from './features/cliente/interceptor/jwt.interceptor';
import { AuthService } from './features/cliente/services/auth.service';

// Função fábrica que o Angular executará antes de montar a interface
export function inicializarAuth(authService: AuthService) {
  return () => authService.verificarAutenticacao().pipe(
    defaultIfEmpty(true),
    catchError(() => of(true))
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiInterceptorFn, jwtInterceptorFn])),
    {
      provide: APP_INITIALIZER,
      useFactory: inicializarAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
