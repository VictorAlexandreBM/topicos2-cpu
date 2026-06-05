import { Injectable, computed, effect, signal } from '@angular/core';
import { ItemCarrinho } from '../models/carrinho.model';
import { CpuDetail } from '@features/admin-produto/models/cpu.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly STORAGE_KEY = 'acme_cpu_carrinho';

  // 1. O Estado Principal (Signal)
  public readonly itens = signal<ItemCarrinho[]>(this.carregarDoStorage());

  // 2. Estados Derivados Reativos (Computed Signals)

  // Total geral para mostrar no ícone (Header) - Ignora se está selecionado ou não
  public readonly quantidadeItensCarrinho = computed(() =>
    this.itens().reduce((acc, item) => acc + item.quantidade, 0)
  );

  // Totais apenas para os itens selecionados (Resumo do Pedido)
  public readonly quantidadeSelecionada = computed(() =>
    this.itens()
      .filter(i => i.selecionado)
      .reduce((acc, item) => acc + item.quantidade, 0)
  );

  public readonly valorTotalSelecionado = computed(() =>
    this.itens()
      .filter(i => i.selecionado)
      .reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0)
  );

  // Computado para controlar o checkbox "Selecionar Todos" na interface
  public readonly todosSelecionados = computed(() =>
    this.itens().length > 0 && this.itens().every(i => i.selecionado)
  );

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.itens()));
      }
    });
  }

  private carregarDoStorage(): ItemCarrinho[] {
    if (typeof window === 'undefined') return [];

    const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
    try {
      return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch (e) {
      console.error('Erro ao ler carrinho do LocalStorage', e);
      return [];
    }
  }

  // --- MÉTODOS DE AÇÃO ---

  public adicionarItem(produto: CpuDetail, quantidadeAdicionada: number = 1): void {
    this.itens.update(itensAtuais => {
      const indexExistente = itensAtuais.findIndex(i => i.produto.id === produto.id);

      if (indexExistente !== -1) {
        const item = itensAtuais[indexExistente];
        const novaQuantidade = item.quantidade + quantidadeAdicionada;

        if (novaQuantidade > produto.estoque) {
          console.warn(`Estoque insuficiente. Máximo disponível: ${produto.estoque}`);
          return itensAtuais;
        }

        return itensAtuais.map((item, index) =>
          // Se o item já existia, atualizamos a quantidade e garantimos que ele fique selecionado
          index === indexExistente ? { ...item, quantidade: novaQuantidade, selecionado: true } : item
        );
      }

      if (quantidadeAdicionada > produto.estoque) return itensAtuais;

      // Item novo entra com selecionado: true
      return [...itensAtuais, { produto, quantidade: quantidadeAdicionada, selecionado: true }];
    });
  }

  public atualizarQuantidade(produtoId: number, novaQuantidade: number): void {
    this.itens.update(itensAtuais => itensAtuais.map(item => {
      if (item.produto.id === produtoId) {
        const quantidadeValida = Math.max(1, Math.min(novaQuantidade, item.produto.estoque));
        return { ...item, quantidade: quantidadeValida };
      }
      return item;
    }));
  }

  public removerItem(produtoId: number): void {
    this.itens.update(itensAtuais => itensAtuais.filter(i => i.produto.id !== produtoId));
  }

  public alternarSelecao(produtoId: number): void {
    this.itens.update(itensAtuais => itensAtuais.map(item =>
      item.produto.id === produtoId ? { ...item, selecionado: !item.selecionado } : item
    ));
  }

  public alternarSelecaoTodos(selecionar: boolean): void {
    this.itens.update(itensAtuais => itensAtuais.map(item =>
      ({ ...item, selecionado: selecionar })
    ));
  }

  public limparCarrinho(): void {
    this.itens.set([]);
  }
}
