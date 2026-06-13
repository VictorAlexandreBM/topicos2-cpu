import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CpuList } from '@features/admin-produto/models/cpu.model';
import CpuService from '@features/admin-produto/services/cpu.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="bg-gray-100 min-h-screen flex flex-col font-sans">

      <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white py-16 px-6 relative overflow-hidden shadow-inner">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent"></div>

        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div class="max-w-xl text-center md:text-left">
            <span class="bg-orange-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              UPGRADE INSANO
            </span>
            <h1 class="text-4xl md:text-6xl font-black tracking-tight mt-4 leading-tight">
              SEMANA DA <br><span class="text-orange-500">COMPUTAÇÃO</span>
            </h1>
            <p class="text-gray-300 mt-4 text-base md:text-lg leading-relaxed">
              Os melhores processadores do mercado com descontos implacáveis. Garanta a máxima performance para o seu setup hoje mesmo.
            </p>
            <div class="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <a mat-flat-button color="primary" routerLink="/" class="!h-12 !px-8 !text-base !font-bold shadow-lg shadow-orange-600/30">
                APROVEITAR OFERTAS
              </a>
              <a mat-stroked-button class="!h-12 !px-8 !text-base !font-bold !text-white !border-white/30 hover:!bg-white/10">
                MONTAR SETUP
              </a>
            </div>
          </div>

          <div class="hidden md:flex bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-80 flex-col items-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
            <mat-icon class="!w-24 !h-24 !text-[96px] text-orange-500 opacity-80 mb-4">memory</mat-icon>
            <h3 class="text-lg font-bold text-center">Linha Premium Next-Gen</h3>
            <p class="text-xs text-gray-400 text-center mt-1">Arquitetura híbrida de núcleos de alta eficiência.</p>
            <span class="text-orange-400 font-mono text-xs mt-4 tracking-widest">ATÉ 40% OFF</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 text-white py-4 px-6 shadow-md border-b border-orange-600/30">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <h2 class="text-lg font-black uppercase tracking-wider text-orange-500 flex items-center gap-2">
              <mat-icon class="scale-90">bolt</mat-icon> OFERTAS NINJA
            </h2>
          </div>

          <div class="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 shadow-inner">
            <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Termina em:</span>
            <span class="font-mono text-xl font-black text-orange-400 tracking-widest">{{ cronometro() }}</span>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div class="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Destaques em Hardware</h2>
            <p class="text-sm text-gray-500 mt-1">Os modelos mais procurados pelos utilizadores nas últimas horas.</p>
          </div>
          <a mat-button color="primary" routerLink="/" class="!font-bold !text-sm">
            Ver Todos <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </a>
        </div>

        @if (carregando()) {
          <div class="flex justify-center items-center min-h-[300px]">
            <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (cpu of cpus(); track cpu.id) {
              <div class="bg-white border border-gray-200 hover:border-orange-500/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group relative">

                <span class="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md z-10 shadow-sm">
                  OFERTA
                </span>

                <div class="h-48 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100 relative overflow-hidden shrink-0">
                  @if (cpu.imagemUrl) {
                    <img [src]="cpu.imagemUrl"
                         [alt]="cpu.nomeComercial"
                         class="max-h-full object-contain mix-blend-darken transition-transform duration-300 group-hover:scale-110" />
                  } @else {
                    <mat-icon class="!w-16 !h-16 !text-6xl text-gray-300 group-hover:text-orange-400 transition-colors">memory</mat-icon>
                  }
                </div>

                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {{ cpu.marca }} • {{ cpu.tipo }}
                    </span>
                    <h3 class="text-slate-800 font-bold text-sm mt-1 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors" [title]="cpu.nomeComercial">
                      {{ cpu.nomeComercial }}
                    </h3>
                  </div>

                  <div class="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-1">
                    <span class="text-xs text-gray-400 line-through">{{ (cpu.preco * 1.15) | currency:'BRL' }}</span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-2xl font-black text-blue-600 group-hover:text-orange-600 transition-colors">
                        {{ cpu.preco | currency:'BRL' }}
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400 uppercase font-medium">À vista no Pix</span>
                  </div>
                </div>

                <div class="px-5 pb-5 bg-white">
                  <a mat-flat-button color="primary" class="w-full !rounded-xl !h-11 !text-sm !font-bold" [routerLink]="['/produto', cpu.id]">
                    COMPRAR <mat-icon iconPositionEnd>shopping_cart</mat-icon>
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export default class HomePage implements OnInit, OnDestroy {
  private readonly cpuService = inject(CpuService);

  protected readonly cpus = signal<CpuList[]>([]);
  protected readonly carregando = signal(true);
  protected readonly cronometro = signal('00:00:00');

  private timerId: any;

  ngOnInit(): void {
    this.carregarDestaques();
    this.inicializarCronometro();
  }

  private carregarDestaques(): void {
    this.carregando.set(true);

    // Solicita apenas a primeira página com 4 elementos ativos para a montagem da Home
    this.cpuService.listar({ pagina: 0, tamanho: 4, emVenda: true }).subscribe({
      next: (resposta) => {
        this.cpus.set(resposta.dados);
        this.carregando.set(false);
      },
      error: () => {
        this.cpus.set([]);
        this.carregando.set(false);
      }
    });
  }

  private inicializarCronometro(): void {
    // Cria uma contagem decrescente falsa com base no final do dia atual
    const agora = new Date();
    const fimDoDia = new Date();
    fimDoDia.setHours(23, 59, 59, 999);

    let diferencaRestante = Math.floor((fimDoDia.getTime() - agora.getTime()) / 1000);

    const atualizarString = () => {
      if (diferencaRestante <= 0) {
        this.cronometro.set('00:00:00');
        return;
      }
      const horas = Math.floor(diferencaRestante / 3600);
      const minutos = Math.floor((diferencaRestante % 3600) / 60);
      const segundos = diferencaRestante % 60;

      const hStr = String(horas).padStart(2, '0');
      const mStr = String(minutos).padStart(2, '0');
      const sStr = String(segundos).padStart(2, '0');

      this.cronometro.set(`${hStr}:${mStr}:${sStr}`);
      diferencaRestante--;
    };

    atualizarString();
    this.timerId = setInterval(atualizarString, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
