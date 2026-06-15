// Centralized celestial-body data. Adding a new body to the scene should only
// require adding an entry here — no new component files, no JSX edits.

// Vite resolves these statically at build time; keys are the relative paths.
const textureModules = import.meta.glob('../assets/textures/**/*.{jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function texture(path: string): string {
  const key = `../assets/textures/${path}`;
  const url = textureModules[key];
  if (!url) {
    throw new Error(`Texture not found: ${key}`);
  }
  return url;
}

export interface PlanetData {
  /** Stable identifier used for focus state and lookups. */
  id: string;
  /** Display label shown on the billboard. */
  name: string;
  position: [number, number, number];
  radius: number;
  /** Resolved URL of the surface texture. */
  texture: string;
  /** Optional ring texture (Saturn). */
  ringTexture?: string;
  /** Emissive color for self-lit bodies (the Sun). */
  emissive?: string;
  emissiveIntensity?: number;
  /** Point light emitted by the body (the Sun). */
  light?: { color: string; intensity: number; distance: number };
}

export const PLANETS: PlanetData[] = [
  {
    id: 'sol',
    name: 'Sol',
    position: [100, 0, 0],
    radius: 30,
    texture: texture('sol/2k_sun.jpg'),
    emissive: 'orange',
    emissiveIntensity: 0.5,
    light: { color: 'white', intensity: 20000, distance: 3000 },
  },
  {
    id: 'mercurio',
    name: 'Mercúrio',
    position: [30, 0, 0],
    radius: 1,
    texture: texture('mercurio/2k_mercury.jpg'),
  },
  {
    id: 'venus',
    name: 'Vênus',
    position: [15, 0, 0],
    radius: 1.5,
    texture: texture('venus/2k_venus_surface.jpg'),
  },
  {
    id: 'terra',
    name: 'Terra',
    position: [0, 0, 0],
    radius: 4,
    texture: texture('terra/2k_earth_daymap.jpg'),
  },
  {
    id: 'marte',
    name: 'Marte',
    position: [-40, 0, 0],
    radius: 2,
    texture: texture('marte/2k_mars.jpg'),
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    position: [-80, 0, 0],
    radius: 2,
    texture: texture('jupter/2k_jupiter.jpg'),
  },
  {
    id: 'saturno',
    name: 'Saturno',
    position: [-130, 0, 0],
    radius: 5,
    texture: texture('saturno/2k_saturn.jpg'),
    ringTexture: texture('saturno/2k_saturn_ring_alpha.png'),
  },
  {
    id: 'urano',
    name: 'Urano',
    position: [-160, 0, 0],
    radius: 3,
    texture: texture('urano/2k_uranus.jpg'),
  },
  {
    id: 'netuno',
    name: 'Netuno',
    position: [-190, 0, 0],
    radius: 3,
    texture: texture('netuno/2k_neptune.jpg'),
  },
];
