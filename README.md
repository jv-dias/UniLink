# Projeto UniLink

**Autor:** Gabriel Barros de Oliveira, João Victor da Silva Dias

## 1. Sobre o Projeto

O UniLink é uma aplicação web desenvolvida como projeto acadêmico, com o objetivo de demonstrar a aplicação prática de Design Patterns e princípios de arquitetura de software em um ambiente moderno.

A aplicação funciona como um agregador de links, permitindo que usuários se cadastrem e criem uma página de perfil única que agrupa todos os seus links importantes (redes sociais, portfólios, etc.). A solução resolve o problema comum da limitação de um único link nas biografias de redes sociais.

## 2. Tecnologias Utilizadas

* **Backend:** API RESTful construída com C# e .NET 8.
* **Banco de Dados:** MySQL 8.1.
* **Gerenciamento de Banco:** phpMyAdmin.
* **Arquitetura de Banco de Dados:** Database-First, utilizando Entity Framework Core para o mapeamento objeto-relacional (ORM).
* **Containerização:** Docker e Docker Compose para garantir um ambiente de desenvolvimento consistente e portável.

## 3. Design Patterns Implementados

Este projeto implementa três Design Patterns clássicos do catálogo "Gang of Four", cada um de uma categoria diferente, para resolver problemas específicos da aplicação.

### 3.1. Padrão Criacional: Singleton

* **Onde foi aplicado?**
    Na classe `JwtTokenService`, localizada em `Services/JwtTokenService.cs`.

* **Qual problema resolve?**
    A geração de tokens JWT (JSON Web Tokens) requer configurações que são carregadas uma única vez (chave secreta, emissor, audiência) e não mudam durante a execução da aplicação. Criar um novo objeto `JwtSecurityTokenHandler` e carregar essas configurações a cada login seria ineficiente e desnecessário.

* **Como foi implementado?**
    O `JwtTokenService` foi implementado com um construtor privado e um método estático `GetInstance()`. Isso garante que apenas uma única instância (um "singleton") deste serviço exista em toda a aplicação. O `AuthController` não cria uma nova instância; ele simplesmente pede pela instância global já existente, garantindo eficiência e um ponto único de controle para a lógica de geração de tokens.

    ```csharp
    // Exemplo de uso no AuthController.cs
    var tokenService = JwtTokenService.GetInstance(_configuration);
    var token = tokenService.GenerateToken(user);
    ```

### 3.2. Padrão Estrutural: Decorator

* **Onde foi aplicado?**
    Na funcionalidade de **contagem de cliques** de um link. A estrutura está em `Decorators/ILinkClickService.cs`.

* **Qual problema resolve?**
    A funcionalidade principal de um link é redirecionar para uma URL. A contagem de cliques é uma responsabilidade adicional que queremos adicionar dinamicamente, sem alterar a classe de serviço principal.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkClickService` que define o contrato: `ProcessClickAndGetUrlAsync(linkId)`.
    2.  Uma classe base, `LinkClickService`, implementa a funcionalidade principal: buscar o link no banco e retornar a sua URL.
    3.  A classe `ClickTrackingDecorator` (a ser criada) irá "embrulhar" (`wrap`) uma instância do `LinkClickService`. Ao ser chamado, o decorador primeiro executará sua própria lógica (incrementar um contador de cliques no banco) e depois delegará a chamada ao objeto original para obter a URL. Isso permite adicionar o comportamento de rastreamento de cliques de forma opcional e desacoplada.

### 3.3. Padrão Comportamental: Strategy

* **Onde foi aplicado?**
    Na lógica de validação para a criação de novos links, baseada no plano do usuário (`Free` vs. `Pro`). A implementação está na pasta `Strategies/`.

* **Qual problema resolve?**
    As regras de negócio para usuários de planos diferentes podem mudar. Um usuário `Free` tem um limite de links, enquanto um `Pro` não tem. Codificar essa lógica com `if/else` diretamente no controlador o tornaria rígido e difícil de estender para novos planos no futuro.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkValidationStrategy` que define um método `CanUserAddLink(User user)`.
    2.  Foram criadas duas implementações concretas: `FreePlanStrategy` (que verifica se `user.Links.Count < 5`) e `ProPlanStrategy` (que sempre retorna `true`).
    3.  No `LinksController`, antes de criar um novo link, o código seleciona a estratégia apropriada com base na propriedade `user.Plan` e a executa. Isso desacopla o controlador das regras de negócio específicas de cada plano, tornando o sistema extensível (Princípio Aberto/Fechado).

    ```csharp
    // Exemplo de uso no LinksController.cs
    ILinkValidationStrategy validationStrategy = user.Plan == "Pro" 
        ? new ProPlanStrategy() 
        : new FreePlanStrategy();

    if (!validationStrategy.CanUserAddLink(user))
    {
        return BadRequest("Limite de links atingido para o plano Free.");
    }
    ```

## 4. Como Executar e Testar o Projeto

### 4.1. Requisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) instalado.

### 4.2. Configuração e Execução

O ambiente de banco de dados é 100% containerizado e automatizado.

1.  **Clone o repositório** para a sua máquina.
2.  **Inicie os containers**: Navegue até a pasta raiz do projeto no seu terminal e execute o comando:
    ```bash
    docker-compose up -d
    ```
    *Este comando irá iniciar um container com o banco de dados MySQL e outro com o phpMyAdmin. Na primeira execução, o banco de dados será automaticamente populado com as tabelas necessárias através do script `database/initial_schema.sql`.*

3.  **Inicie a API**: Navegue até a pasta do backend (`cd backend/UniLink.Api`) e execute o comando:
    ```bash
    dotnet run
    ```
    A API estará em execução e a documentação interativa (Swagger UI) estará disponível em: **`https://localhost:7061/swagger`** (a porta pode variar, verifique o output do terminal).

### 4.3. Testando a API (via Swagger UI)

Siga este fluxo para testar as funcionalidades principais:

1.  **Registre um novo usuário:**
    * Acesse a URL do Swagger UI.
    * Expanda o `AuthController` e o endpoint `POST /api/auth/register`.
    * Clique em "Try it out" e preencha o corpo da requisição com um `username`, `email` e `password` (mínimo de 8 caracteres).
    * Execute. Você deve receber uma resposta `201 Created`.

2.  **Faça o Login e Obtenha o Token:**
    * Use o endpoint `POST /api/auth/login` com o email e a senha que acabou de registrar.
    * Execute. A resposta conterá um `token` JWT. **Copie este token completo.**

3.  **Autorize o Acesso:**
    * No topo direito da página do Swagger, clique no botão **"Authorize"**.
    * Na janela que abrir, na caixa de texto, digite **`Bearer `** (a palavra "Bearer" seguida de um espaço) e cole o token que você copiou.
    * Clique em "Authorize" e depois "Close". O cadeado ficará fechado, indicando que você está autenticado.

4.  **Teste o `LinksController` (Padrão Strategy):**
    * Expanda o `LinksController`.
    * Use o endpoint `POST /api/links` para criar um novo link. Como seu usuário é `Free` por padrão, você poderá criar até 5 links.
    * Ao tentar criar o **sexto link**, a API deve retornar um erro `400 Bad Request` com a mensagem "Limite de links atingido para o plano Free.", demonstrando o padrão **Strategy** em ação.
    * Use o endpoint `GET /api/links` para listar todos os links que você criou.