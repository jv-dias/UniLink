# Projeto UniLink

**Autor:** Gabriel Barros de Oliveira, Jo�o Victor da Silva Dias

## 1. Sobre o Projeto

O UniLink � uma aplica��o web desenvolvida como projeto acad�mico, com o objetivo de demonstrar a aplica��o pr�tica de Design Patterns e princ�pios de arquitetura de software em um ambiente moderno.

A aplica��o funciona como um agregador de links, permitindo que usu�rios se cadastrem e criem uma p�gina de perfil �nica que agrupa todos os seus links importantes (redes sociais, portf�lios, etc.). A solu��o resolve o problema comum da limita��o de um �nico link nas biografias de redes sociais.

## 2. Tecnologias Utilizadas

### 2.1. Backend
* **Framework:** API RESTful construída com C# e .NET 8.
* **Banco de Dados:** MySQL 8.1.
* **Gerenciamento de Banco:** phpMyAdmin.
* **Arquitetura de Banco de Dados:** Database-First, utilizando Entity Framework Core para o mapeamento objeto-relacional (ORM).
* **Autenticação:** JWT (JSON Web Tokens).
* **Documentação da API:** Swagger/OpenAPI.
* **Containerização:** Docker e Docker Compose para garantir um ambiente de desenvolvimento consistente e portátil.

#### Estrutura do Backend

```
backend/UniLink.Api/
├── Controllers/                   # Controladores da API (endpoints)
│   ├── AuthController.cs          # Autenticação (login, registro)
│   ├── LinksController.cs         # CRUD de links
│   ├── ProfileController.cs       # Gerenciamento de perfil
│   └── UsersController.cs         # Gerenciamento de usuários
├── Data/                          # Contexto do banco de dados
│   └── AppDbContext.cs            # DbContext do Entity Framework
├── Decorators/                    # Padrão Decorator
│   ├── ILinkClickService.cs       # Interface do serviço
│   └── LinkClickService.cs        # Implementação base
├── Dtos/                          # Data Transfer Objects
│   ├── CreateLinkDto.cs           # DTO para criação de link
│   ├── LinkDto.cs                 # DTO de link
│   ├── LoginDto.cs                # DTO de login
│   ├── PublicProfileDto.cs        # DTO de perfil público
│   ├── RegisterDto.cs             # DTO de registro
│   ├── UpdateLinkDto.cs           # DTO para atualização de link
│   ├── UpdateProfileDto.cs        # DTO para atualização de perfil
│   └── UpdateUserDto.cs           # DTO para atualização de usuário
├── Models/                        # Modelos de domínio (entidades)
│   ├── Link.cs                    # Entidade Link
│   ├── Page.cs                    # Entidade Page (perfil público)
│   └── User.cs                    # Entidade User
├── Services/                      # Serviços da aplicação
│   └── JwtTokenService.cs         # Serviço de geração de tokens JWT (Singleton)
├── Strategies/                    # Padrão Strategy
│   ├── ILinkValidationStrategy.cs # Interface da estratégia
│   ├── FreePlanStrategy.cs        # Estratégia para plano gratuito
│   └── ProPlanStrategy.cs         # Estratégia para plano profissional
├── Properties/
│   └── launchSettings.json        # Configurações de execução
├── appsettings.json               # Configurações da aplicação
├── appsettings.Development.json   # Configurações de desenvolvimento
├── Program.cs                     # Entry point da aplicação
└── UniLink.Api.csproj             # Arquivo de projeto .NET
```

### 2.2. Frontend
* **Framework:** React 19.1.1 com TypeScript.
* **Build Tool:** Vite (para desenvolvimento e build otimizado).
* **Estilização:** Tailwind CSS 4.1.14 (framework CSS utility-first).
* **Roteamento:** React Router DOM 6.30.1 (SPA - Single Page Application).
* **Biblioteca de Componentes:** shadcn/ui com Radix UI (componentes acessíveis e customizáveis).
* **Ícones:** Tabler Icons React e Lucide React.
* **Validação:** Zod 4.1.12 (validação de schemas TypeScript-first).
* **Drag & Drop:** @dnd-kit (biblioteca para funcionalidades de arrastar e soltar).
* **Gráficos:** Recharts (para visualização de dados no dashboard).
* **Gerenciamento de Estado:** React Context API.

### 2.3. Estrutura do Frontend

```
frontend/UniLink.App/
├── public/                        # Arquivos estáticos
├── src/
│   ├── assets/                    # Imagens e outros assets
│   ├── components/                # Componentes reutilizáveis globais
│   │   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── app-sidebar.tsx        # Sidebar da aplicação
│   │   ├── site-header.tsx        # Header do site
│   │   ├── link-form.tsx          # Formulário de links
│   │   ├── link-list.tsx          # Lista de links
│   │   └── ...
│   ├── features/                  # Features organizadas por domínio
│   │   ├── auth/                  # Autenticação (login, registro)
│   │   │   ├── components/        # Componentes de autenticação
│   │   │   ├── context/           # Context da autenticação
│   │   │   ├── pages/             # Páginas de login e registro
│   │   │   └── services/          # Serviços de autenticação
│   │   ├── dashboard/             # Dashboard com métricas
│   │   ├── links/                 # Gerenciamento de links
│   │   ├── profile/               # Gerenciamento de perfil
│   │   ├── public-profile/        # Visualização pública do perfil
│   │   └── not-found/             # Página 404
│   ├── hooks/                     # React hooks customizados
│   ├── lib/                       # Serviços e utilitários
│   │   ├── utils.ts               # Funções utilitárias
│   │   └── ...
│   ├── shared/                    # Código compartilhado
│   │   ├── api/                   # Cliente HTTP (axios/fetch)
│   │   ├── layout/                # Layouts compartilhados
│   │   └── types/                 # Tipos TypeScript compartilhados
│   ├── App.tsx                    # Setup do roteamento principal
│   ├── main.tsx                   # Entry point da aplicação
│   └── index.css                  # Estilos globais e configuração do Tailwind
├── components.json                # Configuração do shadcn/ui
├── vite.config.ts                 # Configuração do Vite
├── tailwind.config.js             # Configuração do Tailwind CSS
├── tsconfig.json                  # Configuração do TypeScript
└── package.json                   # Dependências e scripts
```

## 3. Design Patterns Implementados

Este projeto implementa tr�s Design Patterns cl�ssicos do cat�logo "Gang of Four", cada um de uma categoria diferente, para resolver problemas espec�ficos da aplica��o.

### 3.1. Padr�o Criacional: Singleton

* **Onde foi aplicado?**
    Na classe `JwtTokenService`, localizada em `Services/JwtTokenService.cs`.

* **Qual problema resolve?**
    A gera��o de tokens JWT requer configura��es que s�o carregadas uma �nica vez (chave secreta, emissor) e n�o mudam. Criar um novo objeto `JwtSecurityTokenHandler` a cada login seria ineficiente.

* **Como foi implementado?**
    O `JwtTokenService` tem um construtor privado e um m�todo est�tico `GetInstance()`. Isso garante que apenas uma �nica inst�ncia deste servi�o exista em toda a aplica��o. O `AuthController` pede por esta inst�ncia global para gerar os tokens, garantindo efici�ncia e um ponto �nico de controle.

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
    3.  A classe `ClickTrackingDecorator` (a ser criada) ir� "embrulhar" (`wrap`) uma inst�ncia do `LinkClickService`. Ao ser chamado, o decorador primeiro executar� sua pr�pria l�gica (incrementar um contador de cliques) e depois delegar� a chamada ao objeto original para obter a URL.

### 3.3. Padr�o Comportamental: Strategy

* **Onde foi aplicado?**
    Na l�gica de valida��o para a cria��o de novos links, baseada no plano do usu�rio (`Free` vs. `Pro`). A implementa��o est� na pasta `Strategies/`.

* **Qual problema resolve?**
    As regras de neg�cio para usu�rios de planos diferentes podem mudar. Um usu�rio `Free` tem um limite de links, enquanto um `Pro` n�o tem. Codificar essa l�gica com `if/else` diretamente no controlador o tornaria r�gido e dif�cil de estender.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkValidationStrategy` que define um m�todo `CanUserAddLink(User user)`.
    2.  Foram criadas duas implementa��es concretas: `FreePlanStrategy` (que verifica se `user.Links.Count < 5`) e `ProPlanStrategy` (que sempre retorna `true`).
    3.  No `LinksController`, antes de criar um novo link, o c�digo seleciona a estrat�gia apropriada com base na propriedade `user.Plan` e a executa. Isso desacopla o controlador das regras de neg�cio espec�ficas de cada plano.

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
* [Node.js](https://nodejs.org/) (versão 18 ou superior) e npm instalados.

### 4.2. Configuração e Execução

1.  **Clone o repositório** para a sua máquina.

2.  **Inicie os containers**: Navegue até a pasta raiz do projeto no terminal e execute:
    ```bash
    docker-compose up -d
    ```
    *Este comando irá iniciar o MySQL e o phpMyAdmin. Na primeira execução, o banco será automaticamente populado com as tabelas através do script `database/initial_schema.sql`.*

3.  **Inicie a API (Backend)**: Navegue até a pasta do backend e execute:
    ```bash
    cd backend/UniLink.Api
    dotnet run
    ```
    A documentação interativa (Swagger UI) estará disponível em: **`https://localhost:7061/swagger`** (a porta pode variar).

4.  **Inicie o Frontend**: Abra um novo terminal, navegue até a pasta do frontend e execute:
    ```bash
    cd frontend/UniLink.App
    npm install
    npm run dev
    ```
    A aplicação frontend estará disponível em: **`http://localhost:5173`** (a porta pode variar, verifique no terminal).

### 4.3. Testando a API (via Swagger UI)

Siga este fluxo completo para testar todas as funcionalidades.

#### 1. Registro e Autentica��o

1.  **Registre um usu�rio:**
    * Use o endpoint `POST /api/auth/register`.
    * Forne�a um `username`, `email` e `password` (m�nimo de 8 caracteres).
    * **Resultado Esperado:** `201 Created`.

2.  **Fa�a o Login:**
    * Use o endpoint `POST /api/auth/login` com as credenciais que acabou de criar.
    * **Resultado Esperado:** `200 OK` com um **token JWT**.
    * **A��o:** Copie o token completo.

3.  **Autorize o Swagger:**
    * Clique no bot�o **"Authorize"** no topo direito.
    * Na janela, digite `Bearer ` (com um espa�o no final) e cole o seu token.
    * Clique em "Authorize" e "Close". O cadeado ficar� fechado.

#### 2. Gerenciando Links (CRUD)

1.  **Criar Links:**
    * Use o `POST /api/links` para criar 5 links diferentes.
    * **Resultado Esperado:** `201 Created` para cada um.

2.  **Listar Links:**
    * Use o `GET /api/links`.
    * **Resultado Esperado:** `200 OK` com uma lista contendo os 5 links que voc� criou. Copie o `id` de um deles para os pr�ximos passos.

3.  **Atualizar um Link:**
    * Use o `PUT /api/links/{id}`. Cole o `id` que voc� copiou.
    * No corpo da requisi��o, altere o `title` e a `url`.
    * **Resultado Esperado:** `204 No Content`. Verifique a altera��o listando os links novamente.

4.  **Deletar um Link:**
    * Use o `DELETE /api/links/{id}` com o `id` de um link.
    * **Resultado Esperado:** `204 No Content`. Verifique a remo��o listando os links novamente.

#### 3. Testando o Padr�o Strategy (Free vs. Pro)

1.  **Teste o Limite do Plano `Free`:**
    * Use `POST /api/links` para tentar criar um **sexto link**.
    * **Resultado Esperado:** `400 Bad Request` com a mensagem "Limite de links atingido...", provando que a `FreePlanStrategy` est� em a��o.

2.  **Fa�a o Upgrade para `Pro`:**
    * Use o `PATCH /api/users/{id}/upgrade`. O `id` do seu usu�rio � `1`.
    * **Resultado Esperado:** `200 OK` com a mensagem de sucesso.

3.  **Teste o Plano `Pro`:**
    * Tente criar o **sexto link** novamente usando `POST /api/links`.
    * **Resultado Esperado:** `201 Created`. A requisi��o agora passa, provando que a API trocou dinamicamente para a `ProPlanStrategy`.

#### 4. Gerenciando seu Perfil e Conta

1.  **Atualizar Perfil:**
    * Use o `PUT /api/profile/me`.
    * No corpo da requisi��o, adicione um `displayName` e uma `bio`.
    * **Resultado Esperado:** `204 No Content`.

2.  **Verificar Perfil:**
    * Use o `GET /api/profile/me`.
    * **Resultado Esperado:** `200 OK` com os dados do perfil que voc� acabou de salvar.

3.  **Deletar Conta (Teste Opcional):**
    * Use o `DELETE /api/users/{id}` com o `id` do seu usu�rio (`1`).
    * **Resultado Esperado:** `204 No Content`. Ap�s isso, qualquer tentativa de login com essas credenciais falhar�.

#### 5. Testando a P�gina P�blica

1.  **Acesse o Perfil P�blico:**
    * Use o endpoint `GET /api/profile/{username}` (n�o precisa de autoriza��o).
    * No campo `username`, digite o nome de usu�rio que voc� registrou.
    * **Resultado Esperado:** `200 OK` com um JSON contendo os dados do seu perfil (`displayName`, `bio`) e a lista completa dos seus links ativos.