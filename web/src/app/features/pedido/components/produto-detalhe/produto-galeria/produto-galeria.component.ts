import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CpuDetail } from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-produto-galeria',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-[400px]">
      @if (cpu().imagemUrl) {
        <img [src]="cpu().imagemUrl"
             [alt]="cpu().nomeComercial"
             class="max-w-full h-auto max-h-[350px] object-contain rounded-md drop-shadow-sm mix-blend-darken" />
      } @else {
        <div class="flex flex-col items-center text-gray-300">
          <mat-icon class="!w-32 !h-32 !text-[8rem] mb-4">memory</mat-icon>
          <span class="text-sm font-medium">Imagem indisponível</span>
        </div>
      }
    </div>
  `
})
export class ProdutoGaleriaComponent {
  public readonly cpu = input.required<CpuDetail>();
}
