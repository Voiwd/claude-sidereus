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
  /** Display label shown on the billboard and panel. */
  name: string;
  /** Short classification, e.g. "Estrela", "Planeta Rochoso". */
  type: string;
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
  /** Approximate distance from the Sun in AU (0 for the Sun itself). */
  distanceAU: number;
  /** Orbital period as a human-readable string. */
  orbitalPeriod: string;
  /** Short descriptive paragraph shown in the info panel. */
  description: string;
}

export const PLANETS: PlanetData[] = [
  {
    id: 'sol',
    name: 'Sol',
    type: 'Estrela',
    position: [100, 0, 0],
    radius: 30,
    texture: texture('sol/2k_sun.jpg'),
    emissive: 'orange',
    emissiveIntensity: 0.5,
    light: { color: 'white', intensity: 20000, distance: 3000 },
    distanceAU: 0,
    orbitalPeriod: '—',
    description:
      'O Sol contém 99,86% de toda a massa do Sistema Solar. A cada segundo, converte 620 milhões de toneladas de hidrogênio em hélio por fusão nuclear.',
  },
  {
    id: 'mercurio',
    name: 'Mercúrio',
    type: 'Planeta Rochoso',
    position: [30, 0, 0],
    radius: 1,
    texture: texture('mercurio/2k_mercury.jpg'),
    distanceAU: 0.39,
    orbitalPeriod: '88 dias',
    description:
      'Mercúrio é o planeta mais rápido do Sistema Solar, orbitando o Sol a cada 88 dias terrestres. Apesar de ser o mais próximo do Sol, não é o mais quente.',
  },
  {
    id: 'venus',
    name: 'Vênus',
    type: 'Planeta Rochoso',
    position: [15, 0, 0],
    radius: 1.5,
    texture: texture('venus/2k_venus_surface.jpg'),
    distanceAU: 0.72,
    orbitalPeriod: '225 dias',
    description:
      'Vênus é o planeta mais quente do Sistema Solar com temperaturas de até 462°C. Sua atmosfera é 92 vezes mais densa que a da Terra.',
  },
  {
    id: 'terra',
    name: 'Terra',
    type: 'Planeta Rochoso',
    position: [0, 0, 0],
    radius: 4,
    texture: texture('terra/2k_earth_daymap.jpg'),
    distanceAU: 1.0,
    orbitalPeriod: '365,25 dias',
    description:
      'A Terra é o único planeta conhecido com vida. Nosso planeta completa uma volta ao redor do Sol a cada 365,25 dias.',
  },
  {
    id: 'marte',
    name: 'Marte',
    type: 'Planeta Rochoso',
    position: [-40, 0, 0],
    radius: 2,
    texture: texture('marte/2k_mars.jpg'),
    distanceAU: 1.52,
    orbitalPeriod: '687 dias',
    description:
      'Marte é conhecido como o "Planeta Vermelho" devido ao óxido de ferro em sua superfície. Um dia em Marte dura 24 horas e 37 minutos.',
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    type: 'Gigante Gasoso',
    position: [-80, 0, 0],
    radius: 2,
    texture: texture('jupter/2k_jupiter.jpg'),
    distanceAU: 5.2,
    orbitalPeriod: '12 anos',
    description:
      'Júpiter é o maior planeta do Sistema Solar. Uma tempestade chamada Grande Mancha Vermelha roda em sua atmosfera há mais de 300 anos.',
  },
  {
    id: 'saturno',
    name: 'Saturno',
    type: 'Gigante Gasoso',
    position: [-130, 0, 0],
    radius: 5,
    texture: texture('saturno/2k_saturn.jpg'),
    ringTexture: texture('saturno/2k_saturn_ring_alpha.png'),
    distanceAU: 9.58,
    orbitalPeriod: '29 anos',
    description:
      'Saturno é famoso por seus anéis deslumbrantes, compostos por bilhões de partículas de gelo e rocha. É o segundo maior planeta do Sistema Solar.',
  },
  {
    id: 'urano',
    name: 'Urano',
    type: 'Gigante de Gelo',
    position: [-160, 0, 0],
    radius: 3,
    texture: texture('urano/2k_uranus.jpg'),
    distanceAU: 19.2,
    orbitalPeriod: '84 anos',
    description:
      'Urano rotaciona de lado, provavelmente devido a uma colisão há bilhões de anos. Tem uma cor azul-verde característica devido ao metano em sua atmosfera.',
  },
  {
    id: 'netuno',
    name: 'Netuno',
    type: 'Gigante de Gelo',
    position: [-190, 0, 0],
    radius: 3,
    texture: texture('netuno/2k_neptune.jpg'),
    distanceAU: 30.05,
    orbitalPeriod: '165 anos',
    description:
      'Netuno é o planeta mais distante do Sol e tem os ventos mais fortes do Sistema Solar, atingindo 2.100 km/h. Um ano em Netuno equivale a 165 anos terrestres.',
  },
];

/** Look up a planet entry by its stable id. Returns undefined if not found. */
export function getPlanetById(id: string): PlanetData | undefined {
  return PLANETS.find((p) => p.id === id);
}
