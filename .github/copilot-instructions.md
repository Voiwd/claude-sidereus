# Copilot instructions for Sidereus

Purpose: quick reference for Copilot sessions to navigate, build, and reason about the repository.

Build, test, and lint commands

- Install: npm ci
- Dev server: npm run dev
- Build (production): npm run build  # runs `tsc -b` then `vite build`
- Preview build: npm run preview
- Lint (auto-fix): npm run lint
- Lint (check only): npm run lint:check
- Format: npm run format
- Format check: npm run format:check
- Test: npm run test (currently mapped to `npm run build` — no unit test runner configured)
- Single-file TypeScript check: npx tsc --noEmit path/to/file.ts

High-level architecture

- Frontend single-page app using Vite + React + TypeScript.
- 3D rendering via Three.js through @react-three/fiber and @react-three/drei.
- Global, minimal state via zustand (src/store/useStore.ts).
- Public static assets live in public/; app entry at src/main.tsx and top-level UI in src/App.tsx.
- CSS: Tailwind is configured via the Vite plugin.
- CI pipeline (GitHub Actions) enforces format:check, lint:check, and build. Node version used in CI: 22.

Key conventions and repository-specific patterns

- ESLint targets TypeScript files only (files: **/*.{ts,tsx}). Use npm run lint or lint-staged on commits.
- Pre-commit: husky runs npm test (build) and lint-staged. lint-staged runs Prettier then ESLint --fix on staged files.
- Code formatting: Prettier is authoritative. Use npm run format for fixes and format:check in CI.
- TypeScript build is run before Vite build (tsc -b) — ensure TypeScript project references/tsconfig are respected before producing build artifacts.
- Scripts assume npm (package-lock.json present). CI caches npm and sets Node 22 — mirror locally when reproducing CI results.

Other assistant configs scanned

- No CLAUDE.md, .cursorrules, AGENTS.md, or similar assistant config files detected in the repository root.

Notes for Copilot sessions

- Prefer reading src/main.tsx, src/App.tsx, and src/store/useStore.ts when tracing app initialization or global state.
- When suggesting changes that affect CI, update format:check and lint:check expectations and verify npm run build still succeeds locally.

