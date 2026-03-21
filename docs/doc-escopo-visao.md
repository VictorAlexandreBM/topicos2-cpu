# Documento de Escopo e Visão
| Versão | Data | Autor |
| 1.0.0 | 21/03/2026 | Victor Alexandre B. Milhomem |

## 1. Requisitos do negócio

### 1.1 Background
Caroline Bumdoviski é uma engenheira elétrica extremamente experiente na fabricação de CPUs, ela conseguiu uma parceria distribuidores para vender e promover uma extensa quantidade de CPUs da Intel e AMD localmente a um preço acessível à comunidade localmente. Atualmente, ela promove seu negócio em redes sociais e em espaços públicos, e tem suporte de um sistema de frete.

### 1.2 Oportunidade de Negócio

Caroline quer expandir seu alcance de vendas, e ela requisitou ajuda a mim para tratar do desenvolvimento de um ecommerce para suas cpus. Ela quer que tenha diversos filtros para seus clientes, pois pela extensa quantidade de cpus em seu estoque, ela atrai gamers hardcore, analistas de infraestrutura e trabalhadores que querem o mínimo para usar sua suíte de escritório. 

### 1.3 Objetivos de Negócio

BO-1: Rastrear 100% das vendas e das quantidades de cpus em estoque.
BO-2: Disponibilizar no mínimo 90% dos produtos em estoque ao público após 1 mês.
BO-3: Aumentar taxa de vendas em até 40% 6 meses após o lançamento.
BO-4: Aumentar a atração de novos clientes em até 60% 6 meses após o lançamento. 

### 1.4 Declaração de Negócio
Para Caroline Bumdoviski, a plataforma CaBuM será um ecommerce ninchado com filtros avançados e com uma alta disponibilidade de CPUs. A vasta coleção para a nova e velha clientela agora estará completamente aberta.

### 1.7 Suposições de Negócio

- SU-1: A constante disponibilidade de um grande estoque de CPUs já estará consolidada devido a parcerias com fornecedores de Intel e AMD.
- SU-2: A cliente já terá um acordo com uma empresa de frete para entrega.

## 2. Escopo e Limitação

### 2.1 Principais funcionalidades

- FU-1: Consultar CPUs com diversos filtros
- FU-2: Gerenciar estoque e cadastro de cpus
- FU-3: Visualizar estatísticas de vendas e pagamento
- FU-4 Apresentar opinião, comentários e visão do público quanto aos produtos
- FU-5: Realizar e acompanhar pedidos e compras de uma ou múltiplas CPUs
- FU-6: Permitir acesso e cadastro de clientes e administradores

### 2.2 Escopo de Funcionalidades Principais
| Funcionalidades          | Lançamento 1                                                      | Lançamento 2                                             | Lançamento 3               |
|--------------------------|-------------------------------------------------------------------|----------------------------------------------------------|----------------------------|
| FU-1: Consulta CPU       | Apenas por nome das cpus                                          | Filtros Avançados completamente implementados            | Completamente implementado | 
| FU-2: Estoque e Cadastro | Parte de cadastro implementada, estoque parcialmente implementado | Estoque e cadastro completamente implementados           | Completamente implementado |
| FU-3: Estatísticas       | Não implementado                                                  | Não implementado                                         | Completamente implementado |
| FU-4: Comentarios        | Não implementado                                                  | Não implementado                                         | Completamente implementado |
| FU-5: Compras e pedidos  | Apenas listará o número de contato da vendedora                   | Sistema de compras implementado e pedido sem notificação | Completamente implementado |
| FU-6: Cadastro e Acesso  | Completamente Implementado                                        | Completamente Implementado                               | Completamente Implementado |

### 2.3 Limiações e Exclusões

- LI-1: O sistema não permitirá o cadastro de múltiplos fornecedores, apenas de múltiplos administradores

## 3. Contexto de Negócio

### 3.2 Prioridades de Projeto

| Dimensão            | Restrição                  | Catalisador                                                    | Grau de liberdade                                                  |
|---------------------|----------------------------|----------------------------------------------------------------|--------------------------------------------------------------------|
| **Funcionalidades** |                            |                                                                | Implementar ao menos até a fase de implementação 2                 |
| **Qualidade**       |                            |                                                                | Aceite de coverage de até 70% dos testes de lógica do backend      |
| **Cronograma**      | Fim do primeiro semestre de 2026 |                                                                |                                                                    |
| **Custo**           |                            |                      <br/>                                          | Gastar em uma plataforma barata de hospedagem VPS e domínio barato |
| **Pessoas**         |                            | Apenas uma pessoa como planejador, desenvolvedor e implantador |                                                                    |


