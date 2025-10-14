# UniLink.App

UniLink.App é o frontend do projeto UniLink, inspirado em plataformas como Linktree, permitindo a criação de páginas de links personalizadas para usuários.

## Tecnologias Utilizadas

- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **@tabler/icons-react** (ícones)
- **react-router-dom** (roteamento SPA)
- **Zod** (validação)
- **@dnd-kit** (drag and drop)

## Estrutura do Projeto

```
UniLink.App/
├── public/                # Arquivos estáticos
├── src/
│   ├── assets/            # Imagens e outros assets
│   ├── components/        # Componentes reutilizáveis (UI, sidebar, header, etc)
│   ├── features/          # Features organizadas por domínio (auth, dashboard, links, etc)
│   ├── hooks/             # React hooks customizados
│   ├── lib/               # Serviços e utilitários
│   ├── pages/             # Rotas principais do app (SPA)
│   └── shared/            # Layouts e componentes compartilhados
├── App.tsx                # Setup do roteamento principal
├── main.tsx               # Entry point
├── tailwind.config.js     # Configuração do Tailwind
├── vite.config.ts         # Configuração do Vite
└── ...
```

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse em [http://localhost:5173](http://localhost:5173)

## Convenções

- Os componentes de UI ficam em `src/components/ui/`.
- As páginas/rotas principais ficam em `src/pages/`.
- Features mais complexas ficam em `src/features/`.
- O roteamento é feito via `react-router-dom`.
- O design é baseado em Tailwind CSS e shadcn/ui.

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — lint do código

## Sobre

Este projeto faz parte do UniLink, uma plataforma para gerenciamento e compartilhamento de links pessoais e profissionais.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
