import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import {
  UsuarioCadastroRequest,
  UsuarioDetail,
  UsuarioLogadoResponse,
  UsuarioLoginRequest,
  UsuarioUpdateRequest
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly recurso = 'usuarios';

  private readonly ACCESS_TOKEN_KEY = 'cabum_access_token';
  private readonly REFRESH_TOKEN_KEY = 'cabum_refresh_token';
  private readonly USER_EMAIL_KEY = 'cabum_user_email';

  #accessToken = signal<string | null>(null);
  #refreshToken = signal<string | null>(null);
  #emailLogado = signal<string | null>(null);
  #usuarioAtual = signal<UsuarioDetail | null>(null);

  public readonly accessToken = this.#accessToken.asReadonly();
  public readonly usuarioAtual = this.#usuarioAtual.asReadonly();
  public readonly estaAutenticado = computed(() => !!this.#accessToken());

  constructor() {
    // Executa a limpeza preventiva no boot da aplicação se o token estiver expirado
    const tokenSalvo = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (tokenSalvo && this.isTokenExpirado(tokenSalvo)) {
      this.limparSessaoLocal();
    } else {
      // Se estiver válido, inicializa os signals com os valores do storage
      this.#accessToken.set(tokenSalvo);
      this.#refreshToken.set(localStorage.getItem(this.REFRESH_TOKEN_KEY));
      this.#emailLogado.set(localStorage.getItem(this.USER_EMAIL_KEY));
    }
  }

  /**
   * Decodifica o payload do JWT e valida o tempo de expiração ('exp')
   */
  private isTokenExpirado(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const tempoAtual = Math.floor(Date.now() / 1000);
      return tempoAtual >= payload.exp;
    } catch {
      return true; // Se o token estiver corrompido, considera expirado
    }
  }

  /**
   * Tornei PÚBLICO para que interceptores de Erro (401) possam limpar o estado de qualquer lugar
   */
  public limparSessaoLocal(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);

    this.#accessToken.set(null);
    this.#refreshToken.set(null);
    this.#emailLogado.set(null);
    this.#usuarioAtual.set(null);
  }

  login(credenciais: UsuarioLoginRequest): Observable<UsuarioDetail> {
    return this.http.post<UsuarioLogadoResponse>(`${this.recurso}/login`, credenciais).pipe(
      tap((res) => this.definirSessao(res)),
      switchMap(() => this.carregarUsuarioAtual())
    );
  }

  cadastrar(dados: UsuarioCadastroRequest): Observable<UsuarioDetail> {
    return this.http.post<UsuarioDetail>(this.recurso, dados);
  }

  refresh(): Observable<UsuarioLogadoResponse> {
    const payload = {
      email: this.#emailLogado(),
      refreshToken: this.#refreshToken()
    };

    return this.http.post<UsuarioLogadoResponse>(`${this.recurso}/refresh`, payload).pipe(
      tap((res) => this.definirSessao(res))
    );
  }

  logout(): Observable<void> {
    const payload = {
      email: this.#emailLogado(),
      refreshToken: this.#refreshToken()
    };

    return this.http.post<void>(`${this.recurso}/logout`, payload).pipe(
      catchError(() => EMPTY),
      tap({
        finalize: () => {
          this.limparSessaoLocal();
          void this.router.navigate(['/login']);
        }
      })
    );
  }

  carregarUsuarioAtual(): Observable<UsuarioDetail> {
    return this.http.get<UsuarioDetail>(`${this.recurso}/eu`).pipe(
      tap((usuario) => this.#usuarioAtual.set(usuario))
    );
  }

  verificarAutenticacao(): Observable<any> {
    if (!this.#accessToken()) {
      this.limparSessaoLocal();
      return EMPTY;
    }

    return this.carregarUsuarioAtual().pipe(
      catchError(() => {
        this.limparSessaoLocal();
        return EMPTY;
      })
    );
  }

  atualizarPerfil(dados: UsuarioUpdateRequest): Observable<UsuarioDetail> {
    return this.http.patch<void>(`${this.recurso}/eu`, dados).pipe(
      switchMap(() => this.carregarUsuarioAtual())
    );
  }

  private definirSessao(authInfo: UsuarioLogadoResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, authInfo.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authInfo.refreshToken);
    localStorage.setItem(this.USER_EMAIL_KEY, authInfo.email);

    this.#accessToken.set(authInfo.accessToken);
    this.#refreshToken.set(authInfo.refreshToken);
    this.#emailLogado.set(authInfo.email);
  }

  obterTokenSincrono(): string | null {
    return this.#accessToken();
  }
}
