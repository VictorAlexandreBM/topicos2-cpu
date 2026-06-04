import { Component, input } from '@angular/core';
import {CpuDetail} from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-produto-galeria',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-[400px]">
      <img [src]="'https://ui-avatars.com/api/?name=CPU+' + cpu().modelo.marca.nome + '&background=e0e7ff&color=4338ca&size=400&font-size=0.3'"
           [alt]="cpu().nomeComercial"
           class="max-w-full h-auto object-contain rounded-md" />
    </div>
  `
})
export class ProdutoGaleriaComponent {
  public readonly cpu = input.required<CpuDetail>();
}
