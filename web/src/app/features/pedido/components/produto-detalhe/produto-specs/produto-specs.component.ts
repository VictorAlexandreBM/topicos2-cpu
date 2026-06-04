import { Component, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {CpuDetail} from '@features/admin-produto/models/cpu.model';

@Component({
  selector: 'app-produto-specs',
  standalone: true,
  imports: [MatTabsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 overflow-hidden">
      <mat-tab-group animationDuration="0ms">

        <mat-tab label="Especificações Técnicas">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações do Processador</h3>
            <ul class="space-y-3 text-sm text-gray-700">
              <li><span class="font-semibold w-32 inline-block">Socket:</span> {{ cpu().modelo.socket?.tipo || 'N/A' }}</li>
              <li><span class="font-semibold w-32 inline-block">TDP:</span> {{ cpu().modelo.fichaTecnica?.tdpBaseW || 'N/A' }} W</li>
            </ul>
          </div>
        </mat-tab>

        <mat-tab label="Tecnologias Suportadas">
          <div class="p-6">
            <p class="text-sm text-gray-600">Lista de tecnologias suportadas virá aqui.</p>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `
})
export class ProdutoSpecsComponent {
  public readonly cpu = input.required<CpuDetail>();
}
