# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # tsc -b && vite build
npm run lint         # ESLint with auto-fix
npm run lint:check   # ESLint check-only (CI)
npm run format       # Prettier write
npm run format:check # Prettier check-only (CI)
npx tsc --noEmit src/path/to/file.ts  # Single-file type check
```

`npm run test` is currently mapped to `npm run build` — there is no unit test runner.

CI (GitHub Actions) enforces `format:check`, `lint:check`, and `build` on PRs and pushes to main. Pre-commit hooks run build + lint-staged (Prettier then ESLint --fix on staged files).

## Architecture

**Stack:** Vite + React 19 + TypeScript, Three.js via `@react-three/fiber` and `@react-three/drei`, Tailwind CSS (via Vite plugin), Zustand for state, React Router v7.

**Two routes:**
- `/` → `src/pages/home/Home.tsx` — landing page with canvas starfield and facts carousel
- `/engine` → `src/pages/engine/Engine.tsx` — full-screen React Three Fiber canvas

**3D scene flow:** `Engine.tsx` mounts a `<Canvas>` → `<Scene>` orchestrates all celestial bodies, `Stars`, and `OrbitControls`. Each planet is its own component (e.g. `Sun.tsx`, `Earth.tsx`) that loads its texture from `src/assets/textures/` and renders a sphere + a `<PlanetBillboard>` HTML overlay.

**Camera focus system** (`Scene.tsx`): clicking a planet's billboard sets it as `focusedPlanet`; `useFrame` lerps the camera toward that planet each frame (factor 0.12). OrbitControls are constrained: no pan, zoom range 8–320.

**`PlanetBillboard.tsx`:** drag threshold of 6px distinguishes a click (focus) from an orbit drag. The billboard hides when its planet is focused.

**State:** `src/store/useStore.ts` is a Zustand placeholder — currently empty, ready for expansion.

**Barrel export:** `src/components/index.ts` re-exports all components.

## Design System

The full visual identity is in `docs/visual-identity.md`. Key rules:

- **Backgrounds:** warm dark neutrals (`#0C0B09`, `#141210`, `#1C1A17`) — never blue
- **Accent:** amber/orange (`#E8761A`) — strictly for active states and CTAs, not decoration
- **Typography — three families with distinct roles:**
  - Display/UI labels: `CS Daine Mono` (fallback: `Courier Prime`)
  - Reading/descriptions: `Source Serif 4`
  - Numeric data/units: `IBM Plex Mono`
- **Border radius:** max 6px (panels), 3px (buttons/inputs), 2px (badges)
- **Avoid:** pure white (`#FFFFFF`), purple/violet, serif for numbers, mono for paragraphs, blue backgrounds

CSS custom properties for all tokens are defined in `docs/visual-identity.md` §6 and should be used rather than hard-coding hex values.
