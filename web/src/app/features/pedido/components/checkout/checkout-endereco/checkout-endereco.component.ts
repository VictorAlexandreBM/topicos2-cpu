import { Component, input, output, signal } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { EnderecoDetail } from '@features/cliente/models/endereco.model';

@Component({
  selector: 'app-checkout-endereco',
  standalone: true,
  imports: [MatRadioModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-2 mb-4">
        <mat-icon class="text-blue-600">local_shipping</mat-icon>
        <h2 class="text-xl font-bold text-gray-900 m-0">Endereço de Entrega</h2>
      </div>

      @if (enderecos().length === 0) {
        <div class="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 text-sm">
          Você ainda não possui endereços cadastrados. Por favor, adicione um endereço no seu perfil para continuar.
        </div>
      } @else {
        <mat-radio-group class="flex flex-col gap-3" [value]="selecionado()" (change)="onSelecaoMudou($event.value)">
          @for (endereco of enderecos(); track endereco.id) {
            <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                   [class.border-blue-500]="selecionado() === endereco.id"
                   [class.ring-1]="selecionado() === endereco.id"
                   [class.ring-blue-500]="selecionado() === endereco.id"
                   [class.border-gray-300]="selecionado() !== endereco.id">

              <mat-radio-button [value]="endereco.id" class="mr-2 mt-0.5"></mat-radio-button>

              <div class="flex flex-col">
                <span class="block text-sm font-medium text-gray-900">
                  {{ endereco.logradouro }}, {{ endereco.numero }} {{ endereco.complemento ? ' - ' + endereco.complemento : '' }}
                </span>
                <span class="block text-sm text-gray-500">
                  {{ endereco.bairro }}, {{ endereco.cidade }} - {{ endereco.estado }}
                </span>
                <span class="block text-sm text-gray-500">CEP: {{ endereco.cep }}</span>
              </div>
            </label>
          }
        </mat-radio-group>
      }
    </div>
  `
})
export class CheckoutEnderecoComponent {
  public readonly enderecos = input.required<EnderecoDetail[]>();

  public readonly enderecoSelecionado = output<number>();

  protected readonly selecionado = signal<number | null>(null);

  protected onSelecaoMudou(enderecoId: number): void {
    this.selecionado.set(enderecoId);
    this.enderecoSelecionado.emit(enderecoId);
  }
}
