# Documento de requisitos e casos de Usos


| Versão | Data       | Autor                        |
|--------|------------|------------------------------|
| 1.0.0  | 21/03/2026 | Victor Alexandre B. Milhomem |

## 1. Introdução

Este documento agrupa requisitos do projeto e seus casos de uso correspondente. Ele será versionado conforme as funcionalidades forem implementadas. Será utilizado principalmente para consulta durante desenvolvimento do que o sistema deve fazer e como deverá se comportar.

## 1.1 Atores

| Classe        | Descrição                                                                                                                              |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Administrador | Pessoas que serão responsável pelas vendas de cpu, no caso, apenas Caroline na primeira versão, futuramente podendo ser outras pessoas |
| Visitante     | Qualquer pessoa que entrar na aplicação, que não seja cadastrada ou logada                                                             |
| Cliente       | Pessoas que têm informações de login cadastradas, mas não necessariamente pessoais utilizadas em compras                               |

## 2. Requisitos Funcionais

  - RF01: Pesquisar por CPUS; 
    - UC01.1: Pesquisar por nome da CPU; ATORES: Administrador, Cliente, Visitante;
    - UC01.2: Escolher página de resultados; ATORES: Administrador, Cliente, Visitante;
  - RF02: Gerenciar Marcas;
    - UC02.1: Listar Marcas; ATORES: Administrador;
    - UC02.2: Cadastrar Marca; ATORES: Administrador;
    - UC02.3: Editar Marca; ATORES: Administrador;
    - UC02.4: Remover Marca; ATORES: Administrador;
    - UC02.5: Pesquisar Marca pelo nome; ATORES: Administrador;
  - RF03: Gerenciar Tecnologias;
    - UC03.1: Listar Tecnologias; ATORES: Administrador;
    - UC03.2: Cadastrar Tecnologia; ATORES: Administrador;
    - UC03.3: Editar Tecnologia; ATORES: Administrador;
    - UC03.4: Remover Tecnologia; ATORES: Administrador;
    - UC03.5: Pesquisar Tecnologia pelo nome; ATORES: Administrador;
  - RF04: Gerenciar Sockets;
    - UC04.1: Listar Sockets; ATORES: Administrador;
    - UC04.2: Cadastrar Socket; ATORES: Administrador;
    - UC04.3: Editar Socket; ATORES: Administrador;
    - UC04.4: Remover Socket; ATORES: Administrador;
    - UC04.5: Pesquisar Socket pelo nome; ATORES: Administrador;
  - RF05: Gerenciar Chipsets;
    - UC05.1: Listar Chipsets; ATORES: Administrador;
    - UC05.2: Cadastrar Chipset; ATORES: Administrador;
    - UC05.3: Editar Chipset; ATORES: Administrador;
    - UC05.4: Remover Chipset; ATORES: Administrador;
    - UC05.5: Pesquisar Chipset pelo nome; ATORES: Administrador;
  - RF06: Gerenciar Modelos de CPUs:
    - UC06.1: Listar Modelos de CPUs; ATORES: Administrador;
    - UC06.2: Cadastrar Modelo de CPU; ATORES: Administrador;
    - UC06.3: Editar Modelo de CPU; ATORES: Administrador;
    - UC06.4: Remover Modelo de CPU; ATORES: Administrador;
    - UC06.5: Pesquisar Modelo de CPU pelo nome; ATORES: Administrador;
  - RF07: Gerenciar CPUs:
    - UC07.1: Listar CPUs; ATORES: Administrador;
    - UC07.2: Cadastrar CPU; ATORES: Administrador;
    - UC07.3: Editar CPU; ATORES: Administrador;
    - UC07.4: Remover CPU; ATORES: Administrador;
    - UC07.5: Pesquisar CPU pelo nome; ATORES: Administrador;
    - UC07.6: Colocar CPU à venda; ATORES: Administrador;
  - RF08: Cadastrar e logar:
    - UC08.1: Cadastrar-se como cliente; ATORES: Visitante;
    - UC08.2: Logar como cliente; ATORES: Visitante;
    - UC08.3: Logar como administrador; ATORES: Visitante;
    - UC08.4: Realizar Logoff; ATORES: Cliente, Administrador;

## 3. Requisitos Não funcionais

## 3.1 Usabilidade

- RnF01: O administrador poderá cadastrar e continuar na tela de cadastro ou voltar para lista em qualquer formulário
- RnF02: A interface deve ser responsiva em celulares, tablets e computadores
- RnF03: A interface deverá manter um bom contraste entre cores
- RnF04: A quantidade de clicks para editar ou deletar algo não deve ultrapassar de 2
- RnF05: O sistema deverá ter mensagens de erro claras e informativas em campos de formulário
- Rnf06: Ações críticas como deleção devem ser perguntadas e confirmadas

## 3.2 Perfomance

- RnF07: O sistema deverá ter o tempo de resposta de no máximo 2 segundos
- RnF08: O sistema implementará paginação para listagens administrativas e para o catálogo do cliente

## 3.3 Segurança

- RnF09: Senhas devem salvas com incriptação no banco de dados
- RnF10: Todos os serviços da aplicação deverão apresentar logs de debug indicando a ação, junto a logs de erro e informação
- RnF11: A aplicação implementará autenticação com JWT
- RnF12: Deverá ter inicialmente um administrador inicial cadastrado no sistema
