# Projeto UniLink

**Autor:** Gabriel Barros de Oliveira, Jo�o Victor da Silva Dias

## 1. Sobre o Projeto

O UniLink � uma aplica��o web desenvolvida como projeto acad�mico, com o objetivo de demonstrar a aplica��o pr�tica de Design Patterns e princ�pios de arquitetura de software em um ambiente moderno.

A aplica��o funciona como um agregador de links, permitindo que usu�rios se cadastrem e criem uma p�gina de perfil �nica que agrupa todos os seus links importantes (redes sociais, portf�lios, etc.). A solu��o resolve o problema comum da limita��o de um �nico link nas biografias de redes sociais.

## 2. Tecnologias Utilizadas

* **Backend:** API RESTful constru�da com C# e .NET 8.
* **Banco de Dados:** MySQL 8.1.
* **Gerenciamento de Banco:** phpMyAdmin.
* **Arquitetura de Banco de Dados:** Database-First, utilizando Entity Framework Core para o mapeamento objeto-relacional (ORM).
* **Containeriza��o:** Docker e Docker Compose para garantir um ambiente de desenvolvimento consistente e port�vel.

## 3. Design Patterns Implementados

Este projeto implementa tr�s Design Patterns cl�ssicos do cat�logo "Gang of Four", cada um de uma categoria diferente, para resolver problemas espec�ficos da aplica��o.

### 3.1. Padr�o Criacional: Singleton

* **Onde foi aplicado?**
    Na classe `JwtTokenService`, localizada em `Services/JwtTokenService.cs`.

* **Qual problema resolve?**
    A gera��o de tokens JWT (JSON Web Tokens) requer configura��es que s�o carregadas uma �nica vez (chave secreta, emissor, audi�ncia) e n�o mudam durante a execu��o da aplica��o. Criar um novo objeto `JwtSecurityTokenHandler` e carregar essas configura��es a cada login seria ineficiente e desnecess�rio.

* **Como foi implementado?**
    O `JwtTokenService` foi implementado com um construtor privado e um m�todo est�tico `GetInstance()`. Isso garante que apenas uma �nica inst�ncia (um "singleton") deste servi�o exista em toda a aplica��o. O `AuthController` n�o cria uma nova inst�ncia; ele simplesmente pede pela inst�ncia global j� existente, garantindo efici�ncia e um ponto �nico de controle para a l�gica de gera��o de tokens.

    ```csharp
    // Exemplo de uso no AuthController.cs
    var tokenService = JwtTokenService.GetInstance(_configuration);
    var token = tokenService.GenerateToken(user);
    ```

### 3.2. Padr�o Estrutural: Decorator

* **Onde foi aplicado?**
    Na funcionalidade de **contagem de cliques** de um link. A estrutura est� em `Decorators/ILinkClickService.cs`.

* **Qual problema resolve?**
    A funcionalidade principal de um link � redirecionar para uma URL. A contagem de cliques � uma responsabilidade adicional que queremos adicionar dinamicamente, sem alterar a classe de servi�o principal.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkClickService` que define o contrato: `ProcessClickAndGetUrlAsync(linkId)`.
    2.  Uma classe base, `LinkClickService`, implementa a funcionalidade principal: buscar o link no banco e retornar a sua URL.
    3.  A classe `ClickTrackingDecorator` (a ser criada) ir� "embrulhar" (`wrap`) uma inst�ncia do `LinkClickService`. Ao ser chamado, o decorador primeiro executar� sua pr�pria l�gica (incrementar um contador de cliques no banco) e depois delegar� a chamada ao objeto original para obter a URL. Isso permite adicionar o comportamento de rastreamento de cliques de forma opcional e desacoplada.

### 3.3. Padr�o Comportamental: Strategy

* **Onde foi aplicado?**
    Na l�gica de valida��o para a cria��o de novos links, baseada no plano do usu�rio (`Free` vs. `Pro`). A implementa��o est� na pasta `Strategies/`.

* **Qual problema resolve?**
    As regras de neg�cio para usu�rios de planos diferentes podem mudar. Um usu�rio `Free` tem um limite de links, enquanto um `Pro` n�o tem. Codificar essa l�gica com `if/else` diretamente no controlador o tornaria r�gido e dif�cil de estender para novos planos no futuro.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkValidationStrategy` que define um m�todo `CanUserAddLink(User user)`.
    2.  Foram criadas duas implementa��es concretas: `FreePlanStrategy` (que verifica se `user.Links.Count < 5`) e `ProPlanStrategy` (que sempre retorna `true`).
    3.  No `LinksController`, antes de criar um novo link, o c�digo seleciona a estrat�gia apropriada com base na propriedade `user.Plan` e a executa. Isso desacopla o controlador das regras de neg�cio espec�ficas de cada plano, tornando o sistema extens�vel (Princ�pio Aberto/Fechado).

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

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execu��o.
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) instalado.

### 4.2. Configura��o e Execu��o

O ambiente de banco de dados � 100% containerizado e automatizado.

1.  **Clone o reposit�rio** para a sua m�quina.
2.  **Inicie os containers**: Navegue at� a pasta raiz do projeto no seu terminal e execute o comando:
    ```bash
    docker-compose up -d
    ```
    *Este comando ir� iniciar um container com o banco de dados MySQL e outro com o phpMyAdmin. Na primeira execu��o, o banco de dados ser� automaticamente populado com as tabelas necess�rias atrav�s do script `database/initial_schema.sql`.*

3.  **Inicie a API**: Navegue at� a pasta do backend (`cd backend/UniLink.Api`) e execute o comando:
    ```bash
    dotnet run
    ```
    A API estar� em execu��o e a documenta��o interativa (Swagger UI) estar� dispon�vel em: **`https://localhost:7061/swagger`** (a porta pode variar, verifique o output do terminal).

### 4.3. Testando a API (via Swagger UI)

Siga este fluxo para testar as funcionalidades principais:

1.  **Registre um novo usu�rio:**
    * Acesse a URL do Swagger UI.
    * Expanda o `AuthController` e o endpoint `POST /api/auth/register`.
    * Clique em "Try it out" e preencha o corpo da requisi��o com um `username`, `email` e `password` (m�nimo de 8 caracteres).
    * Execute. Voc� deve receber uma resposta `201 Created`.

2.  **Fa�a o Login e Obtenha o Token:**
    * Use o endpoint `POST /api/auth/login` com o email e a senha que acabou de registrar.
    * Execute. A resposta conter� um `token` JWT. **Copie este token completo.**

3.  **Autorize o Acesso:**
    * No topo direito da p�gina do Swagger, clique no bot�o **"Authorize"**.
    * Na janela que abrir, na caixa de texto, digite **`Bearer `** (a palavra "Bearer" seguida de um espa�o) e cole o token que voc� copiou.
    * Clique em "Authorize" e depois "Close". O cadeado ficar� fechado, indicando que voc� est� autenticado.

4.  **Teste o `LinksController` (Padr�o Strategy):**
    * Expanda o `LinksController`.
    * Use o endpoint `POST /api/links` para criar um novo link. Como seu usu�rio � `Free` por padr�o, voc� poder� criar at� 5 links.
    * Ao tentar criar o **sexto link**, a API deve retornar um erro `400 Bad Request` com a mensagem "Limite de links atingido para o plano Free.", demonstrando o padr�o **Strategy** em a��o.
    * Use o endpoint `GET /api/links` para listar todos os links que voc� criou.