# Sidereus Dataset

This document describes the comprehensive Solar System dataset used in the Sidereus visualization engine.

## Data Source

All celestial body measurements are sourced from the **NASA Planetary Fact Sheet**:
https://nssdc.gsfc.nasa.gov/planetary/factsheet/

The dataset includes 26 bodies: 1 star, 8 planets, and 17 moons. Physical properties are current as of 2024 and reflect the latest astronomical observations and discoveries.

## Celestial Bodies Reference Table

| Name | Type | Radius (km) | Mass (kg) | Orbital Period | Semi-Major Axis | Axial Tilt (°) | Mean Temp (°C) |
|------|------|-----------|----------|---|---|---|---|
| **Sol** | Star | 696,340 | 1.989e30 | — | — | 7.25 | 5,505 |
| **Mercúrio** | Rocky Planet | 2,439.7 | 3.301e23 | 87.97 dias | 0.387 AU | 0.034 | 167 |
| **Vênus** | Rocky Planet | 6,051.8 | 4.867e24 | 224.7 dias | 0.723 AU | 177.4 | 462 |
| **Terra** | Rocky Planet | 6,371 | 5.972e24 | 365.25 dias | 1.0 AU | 23.44 | 15 |
| **Marte** | Rocky Planet | 3,389.5 | 6.417e23 | 686.97 dias | 1.524 AU | 25.19 | -60 |
| **Júpiter** | Gas Giant | 69,911 | 1.898e27 | 4,332.59 dias (11.9 anos) | 5.203 AU | 3.13 | -110 |
| **Saturno** | Gas Giant | 58,232 | 5.683e26 | 10,759.22 dias (29.5 anos) | 9.537 AU | 26.73 | -140 |
| **Urano** | Ice Giant | 25,362 | 8.681e25 | 30,688.5 dias (84 anos) | 19.191 AU | 97.77 | -195 |
| **Netuno** | Ice Giant | 24,622 | 1.024e26 | 60,195.0 dias (165 anos) | 30.069 AU | 28.32 | -200 |
| **Lua** | Moon (Terra) | 1,737.4 | 7.342e22 | 27.32 dias | 384,400 km | 6.68 | -20 |
| **Fobos** | Moon (Marte) | 11.267 | 1.066e16 | 0.319 dias | 9,376 km | — | -40 |
| **Deimos** | Moon (Marte) | 6.2 | 1.48e15 | 1.263 dias | 23,463 km | — | -40 |
| **Io** | Moon (Júpiter) | 1,821.6 | 8.932e22 | 1.769 dias | 421,700 km | — | -130 |
| **Europa** | Moon (Júpiter) | 1,560.8 | 4.8e22 | 3.551 dias | 671,100 km | — | -160 |
| **Ganimedes** | Moon (Júpiter) | 2,634.1 | 1.482e23 | 7.155 dias | 1,070,400 km | — | -163 |
| **Calisto** | Moon (Júpiter) | 2,410.3 | 1.076e23 | 16.69 dias | 1,882,700 km | — | -139 |
| **Titã** | Moon (Saturno) | 2,574.7 | 1.345e23 | 15.945 dias | 1,221,870 km | — | -179 |
| **Titânia** | Moon (Urano) | 788.4 | 3.527e21 | 8.706 dias | 435,910 km | — | -203 |
| **Oberon** | Moon (Urano) | 761.4 | 3.014e21 | 13.463 dias | 583,520 km | — | -203 |
| **Tritão** | Moon (Netuno) | 1,353.4 | 2.139e22 | 5.877 dias (retrograde) | 354,759 km | — | -235 |

## Scale System: Why Two Independent Scales?

The Solar System presents an extraordinary range of scales: the Sun's radius is ~696,000 km, while some moons are barely 6 km across. Orbital distances range from 9 million km (Mercury) to 4.5 billion km (Neptune). Rendering these on a single linear scale would make planets invisible dots orbiting a massive sun billions of units away.

Sidereus solves this using **two independent power-law scales**:

### 1. Orbital Distance Scale (Linear)
- **Formula:** `sceneDistance = auDistance × 10`
- **Rationale:** Orbital geometry is already compressionable—Neptune at ~30 AU becomes ~300 scene units, which fits comfortably in a viewport. No power-law needed.
- **Examples:**
  - Mercury (0.387 AU) → ~3.9 scene units
  - Earth (1.0 AU) → 10 scene units
  - Neptune (30.069 AU) → ~301 scene units

### 2. Body Radius Scale (Power-Law)
- **Formula:** `sceneRadius = 0.035 × radiusKm^0.45`, clamped to min 0.15
- **Rationale:** Raw radii span 6 orders of magnitude. A linear scale would make the Sun (696,340 km) ~24 million units—impossibly large. A power-law exponent of 0.45 compresses this while preserving relative size ordering.
- **Examples:**
  - Sun (696,340 km) → ~14.8 scene units
  - Jupiter (69,911 km) → ~5.6 scene units
  - Earth (6,371 km) → ~1.8 scene units
  - Moon (1,737.4 km) → ~0.97 scene units
  - Phobos (11.267 km) → 0.15 scene units (clamped minimum)

### 3. Moon Orbital Scale (Independent Power-Law)
- **Formula:** `sceneDistance = 0.007 × distanceKm^0.55`, clamped to min 2.5
- **Rationale:** Moon distances (9,000 km to 1.8 million km) are too small to use the planetary scale. An independent power-law with a shallower base and higher exponent ensures Phobos orbits at ~2.5 units while Callisto reaches ~18.8 units—all visible relative to their parent planet.
- **Examples:**
  - Phobos (9,376 km) → 2.5 scene units (clamped minimum)
  - Moon (384,400 km) → ~8.0 scene units
  - Titan (1,221,870 km) → ~15.7 scene units
  - Callisto (1,882,700 km) → ~18.8 scene units

## Scale Constants (src/engine/scale.ts)

```typescript
// Orbital distance: 1 AU = 10 scene units
export const AU_UNIT = 10;

// Body radius scale
const BODY_K = 0.035;       // Coefficient
const BODY_EXP = 0.45;      // Power (exponent)
export const MIN_BODY_RADIUS = 0.15;

// Moon orbital scale
const MOON_K = 0.007;       // Coefficient (smaller than BODY_K)
const MOON_EXP = 0.55;      // Power (higher than BODY_EXP for sharper scaling)
export const MIN_MOON_ORBIT = 2.5;
```

## Implementation Details

### CelestialBody Interface (src/data/bodies.ts)

Each body is represented as a `CelestialBody` object with:
- **Identification:** `id` (stable identifier), `name`, `type`, `kind` (star/planet/moon)
- **Hierarchy:** `parentId` (for moons, which planet or star they orbit)
- **Physical properties:** radius (km), mass (kg), surface gravity (m/s²), density (g/cm³)
- **Orbital characteristics:** semi-major axis (AU or km), orbital period (days), eccentricity, inclination, axial tilt
- **Environment:** mean surface temperature (°C), atmosphere composition, moon count
- **Render data:** texture URL, optional ring texture, emissive properties (for the Sun), point light definition

### Texture Loading

Textures are loaded using Vite's `import.meta.glob()` at build time, matching the pattern in `src/assets/textures/**/*.{jpg,png}`. This ensures all textures are bundled and their URLs resolved to hashed asset paths.

Note: The Jupiter textures folder is spelled "jupter" in the codebase (a historical typo preserved for compatibility).

## Helper Functions

```typescript
export function getBodyById(id: string): CelestialBody | undefined
export function getMoons(parentId: string): CelestialBody[]
export function getPlanets(): CelestialBody[]
export function formatPeriod(days: number): string
```

- **getBodyById(id):** Quick lookup by stable identifier.
- **getMoons(parentId):** Fetch all moons orbiting a given parent (e.g., all Jovian moons).
- **getPlanets():** Filter all 8 planets from the full BODIES array.
- **formatPeriod(days):** Human-readable orbital/rotation period formatter. Outputs hours for sub-1-day periods, days for sub-year periods, years for longer periods.

## Future Enhancements

The current dataset is a Phase 1 foundation supporting:
- Static visualization of the Solar System with accurate orbital and physical properties
- Billboard-based clickable labels and info panels
- Texture-based rendering of all major bodies

Planned enhancements (Phase 2+):
- **Orbital mechanics:** Animated orbits using Kepler's equations
- **Real-time simulation:** Clock-driven body positions (epoch-based ephemeris)
- **Additional moons:** The dataset currently includes the major moons; dwarf planets and asteroids can be added by extending the BODIES array
- **Texture variants:** Ring systems for other ice giants; cloud layer textures for atmospheric bodies
- **Performance:** LOD (level-of-detail) systems for bodies distant from the camera
