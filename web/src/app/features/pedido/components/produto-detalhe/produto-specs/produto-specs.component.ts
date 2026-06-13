import { Component, input } from '@angular/core';
import {CpuDetail} from '@features/admin-produto/models/cpu.model';

// @ts-ignore
@Component({
  selector: 'app-produto-specs',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 overflow-hidden p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Especificações Técnicas</h2>

      <div class="mb-4 text-gray-700">
        <p><span>{{cpu().modelo.fichaTecnica.descricaoComercial}}</span></p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
        <div class="space-y-3">
          <p><span class="font-semibold w-40 inline-block">SKU:</span> {{ cpu().sku || 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Tipo:</span> {{ cpu().tipo || 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Marca:</span> {{ cpu().modelo.marca?.nome || 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Modelo:</span> {{ cpu().modelo.nome || 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Socket:</span> {{ cpu().modelo.socket?.tipo || 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">TDP Base:</span> {{ cpu().modelo.fichaTecnica?.tdpBaseW ? (cpu().modelo.fichaTecnica.tdpBaseW + ' W') : 'N/A' }}</p>
          <!-- <p><span class="font-semibold w-40 inline-block">Frequência Base:</span> {{ cpu().modelo.fichaTecnica?.frequenciaBaseGHz ? (cpu().modelo.fichaTecnica.frequenciaBaseGHz + ' GHz') : 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Frequência Máx. Turbo:</span> {{ cpu().modelo.fichaTecnica?.frequenciaMaxTurboGHz ? (cpu().modelo.fichaTecnica.frequenciaMaxTurboGHz + ' GHz') : 'N/A' }}</p> -->
          <p><span class="font-semibold w-40 inline-block">Cache L2:</span> {{ cpu().modelo.fichaTecnica?.cacheL2MB ? (cpu().modelo.fichaTecnica.cacheL2MB + ' MB') : 'N/A' }}</p>
          <p><span class="font-semibold w-40 inline-block">Cache L3:</span> {{ cpu().modelo.fichaTecnica?.cacheL3MB ? (cpu().modelo.fichaTecnica.cacheL3MB + ' MB') : 'N/A' }}</p>
        </div>

        <div class="space-y-3">
          @if (cpu().modelo.clustersNucleo && cpu().modelo.clustersNucleo.length > 0) {
            <div>
              <p class="font-semibold w-40 inline-block">Clusters de Núcleo:</p>
              <ul class="list-disc list-inside ml-4">
                @for (cluster of cpu().modelo.clustersNucleo; track $index) {
                  <li>{{ cluster.quantidadeNucleos }}x Núcleos {{ cluster.tipoNucleo }} ({{ cluster.frequenciaBase }} GHz, {{ cluster.frequenciaMaxima }} GHz)</li>
                }
              </ul>
            </div>
          }

          @if (cpu().modelo.tecnologias) {
            <div>
              <p class="font-semibold w-40 inline-block">Tecnologias:</p>
              <ul class="list-disc list-inside ml-4">
                @for (tecnologia of cpu().modelo.tecnologias; track tecnologia.id) {
                  <li>{{ tecnologia.nome }}</li>
                }
              </ul>
            </div>
          }

          @if (cpu().modelo.chipsets !== null) {
            <div>
              <p class="font-semibold w-40 inline-block">Chipsets Suportados:</p>
              <ul class="list-disc list-inside ml-4">
                @for (chipset of cpu().modelo.chipsets; track chipset.id) {
                  <li>{{ chipset.tipo }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProdutoSpecsComponent {
  public readonly cpu = input.required<CpuDetail>();
}
