# Sidereus

Base do projeto web do **Sidereus**.

## Stack

- Vite + React + TypeScript
- Three.js via `@react-three/fiber` e `@react-three/drei`
- Estado com `zustand`
- Estilo com Tailwind (plugin do Vite)
- Qualidade: ESLint + Prettier

## Requisitos

- Node.js (recomendado: versão LTS)
- npm

## Como rodar

```bash
npm ci
npm run dev
```

Depois acesse o endereço que o Vite imprimir no terminal (por padrão, `http://localhost:5173`).

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de produção (TypeScript + Vite)
- `npm run preview`: preview do build
- `npm run lint`: lint (com `--fix`) e falha com warnings
- `npm run format`: formata arquivos com Prettier

## Estrutura

- `src/`: código-fonte
- `public/`: assets públicos
- `docs/`: documentação do projeto
