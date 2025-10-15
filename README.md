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
    A geração de tokens JWT requer configurações que são carregadas uma única vez (chave secreta, emissor) e não mudam. Criar um novo objeto `JwtSecurityTokenHandler` a cada login seria ineficiente.

* **Como foi implementado?**
    O `JwtTokenService` tem um construtor privado e um método estático `GetInstance()`. Isso garante que apenas uma única instância deste serviço exista em toda a aplicação. O `AuthController` pede por esta instância global para gerar os tokens, garantindo eficiência e um ponto único de controle.

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
    3.  A classe `ClickTrackingDecorator` (a ser criada) irá "embrulhar" (`wrap`) uma instância do `LinkClickService`. Ao ser chamado, o decorador primeiro executará sua própria lógica (incrementar um contador de cliques) e depois delegará a chamada ao objeto original para obter a URL.

### 3.3. Padrão Comportamental: Strategy

* **Onde foi aplicado?**
    Na lógica de validação para a criação de novos links, baseada no plano do usuário (`Free` vs. `Pro`). A implementação está na pasta `Strategies/`.

* **Qual problema resolve?**
    As regras de negócio para usuários de planos diferentes podem mudar. Um usuário `Free` tem um limite de links, enquanto um `Pro` não tem. Codificar essa lógica com `if/else` diretamente no controlador o tornaria rígido e difícil de estender.

* **Como foi implementado?**
    1.  Foi criada uma interface `ILinkValidationStrategy` que define um método `CanUserAddLink(User user)`.
    2.  Foram criadas duas implementações concretas: `FreePlanStrategy` (que verifica se `user.Links.Count < 5`) e `ProPlanStrategy` (que sempre retorna `true`).
    3.  No `LinksController`, antes de criar um novo link, o código seleciona a estratégia apropriada com base na propriedade `user.Plan` e a executa. Isso desacopla o controlador das regras de negócio específicas de cada plano.

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

1.  **Clone o repositório** para a sua máquina.
2.  **Inicie os containers**: Navegue até a pasta raiz do projeto no terminal e execute:
    ```bash
    docker-compose up -d
    ```
    *Este comando irá iniciar o MySQL e o phpMyAdmin. Na primeira execução, o banco será automaticamente populado com as tabelas através do script `database/initial_schema.sql`.*

3.  **Inicie a API**: Navegue até a pasta do backend (`cd backend/UniLink.Api`) e execute:
    ```bash
    dotnet run
    ```
    A documentação interativa (Swagger UI) estará disponível em: **`https://localhost:7061/swagger`** (a porta pode variar).

### 4.3. Testando a API (via Swagger UI)

Siga este fluxo completo para testar todas as funcionalidades.

#### 1. Registro e Autenticação

1.  **Registre um usuário:**
    * Use o endpoint `POST /api/auth/register`.
    * Forneça um `username`, `email` e `password` (mínimo de 8 caracteres).
    * **Resultado Esperado:** `201 Created`.

2.  **Faça o Login:**
    * Use o endpoint `POST /api/auth/login` com as credenciais que acabou de criar.
    * **Resultado Esperado:** `200 OK` com um **token JWT**.
    * **Ação:** Copie o token completo.

3.  **Autorize o Swagger:**
    * Clique no botão **"Authorize"** no topo direito.
    * Na janela, digite `Bearer ` (com um espaço no final) e cole o seu token.
    * Clique em "Authorize" e "Close". O cadeado ficará fechado.

#### 2. Gerenciando Links (CRUD)

1.  **Criar Links:**
    * Use o `POST /api/links` para criar 5 links diferentes.
    * **Resultado Esperado:** `201 Created` para cada um.

2.  **Listar Links:**
    * Use o `GET /api/links`.
    * **Resultado Esperado:** `200 OK` com uma lista contendo os 5 links que você criou. Copie o `id` de um deles para os próximos passos.

3.  **Atualizar um Link:**
    * Use o `PUT /api/links/{id}`. Cole o `id` que você copiou.
    * No corpo da requisição, altere o `title` e a `url`.
    * **Resultado Esperado:** `204 No Content`. Verifique a alteração listando os links novamente.

4.  **Deletar um Link:**
    * Use o `DELETE /api/links/{id}` com o `id` de um link.
    * **Resultado Esperado:** `204 No Content`. Verifique a remoção listando os links novamente.

#### 3. Testando o Padrão Strategy (Free vs. Pro)

1.  **Teste o Limite do Plano `Free`:**
    * Use `POST /api/links` para tentar criar um **sexto link**.
    * **Resultado Esperado:** `400 Bad Request` com a mensagem "Limite de links atingido...", provando que a `FreePlanStrategy` está em ação.

2.  **Faça o Upgrade para `Pro`:**
    * Use o `PATCH /api/users/{id}/upgrade`. O `id` do seu usuário é `1`.
    * **Resultado Esperado:** `200 OK` com a mensagem de sucesso.

3.  **Teste o Plano `Pro`:**
    * Tente criar o **sexto link** novamente usando `POST /api/links`.
    * **Resultado Esperado:** `201 Created`. A requisição agora passa, provando que a API trocou dinamicamente para a `ProPlanStrategy`.

#### 4. Gerenciando seu Perfil e Conta

1.  **Atualizar Perfil:**
    * Use o `PUT /api/profile/me`.
    * No corpo da requisição, adicione um `displayName` e uma `bio`.
    * **Resultado Esperado:** `204 No Content`.

2.  **Verificar Perfil:**
    * Use o `GET /api/profile/me`.
    * **Resultado Esperado:** `200 OK` com os dados do perfil que você acabou de salvar.

3.  **Deletar Conta (Teste Opcional):**
    * Use o `DELETE /api/users/{id}` com o `id` do seu usuário (`1`).
    * **Resultado Esperado:** `204 No Content`. Após isso, qualquer tentativa de login com essas credenciais falhará.

#### 5. Testando a Página Pública

1.  **Acesse o Perfil Público:**
    * Use o endpoint `GET /api/profile/{username}` (não precisa de autorização).
    * No campo `username`, digite o nome de usuário que você registrou.
    * **Resultado Esperado:** `200 OK` com um JSON contendo os dados do seu perfil (`displayName`, `bio`) e a lista completa dos seus links ativos.