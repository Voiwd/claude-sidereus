// Comprehensive dataset of Solar System bodies with scientific data.
// Source: NASA Planetary Fact Sheet (https://nssdc.gsfc.nasa.gov/planetary/factsheet/)

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

export type BodyKind = 'star' | 'planet' | 'moon';

export interface CelestialBody {
  id: string;
  name: string;
  type: string;
  kind: BodyKind;
  parentId?: string;
  description: string;
  radiusKm: number;
  massKg: number;
  gravityMs2: number;
  densityGcm3: number;
  semiMajorAxisAU?: number;
  semiMajorAxisKm?: number;
  orbitalPeriodDays: number;
  eccentricity: number;
  orbitalInclinationDeg: number;
  rotationPeriodHours: number;
  axialTiltDeg: number;
  meanTempC: number;
  moonCount: number;
  atmosphere?: string;
  render: {
    texture?: string;
    ringTexture?: string;
    emissive?: string;
    emissiveIntensity?: number;
    light?: { color: string; intensity: number; distance: number };
  };
}

export const BODIES: CelestialBody[] = [
  {
    id: 'sol',
    name: 'Sol',
    type: 'Estrela',
    kind: 'star',
    description:
      'O Sol contém 99,86% de toda a massa do Sistema Solar. A cada segundo, converte 620 milhões de toneladas de hidrogênio em hélio por fusão nuclear.',
    radiusKm: 696340,
    massKg: 1.989e30,
    gravityMs2: 274.0,
    densityGcm3: 1.41,
    orbitalPeriodDays: 0,
    eccentricity: 0,
    orbitalInclinationDeg: 0,
    rotationPeriodHours: 609.12,
    axialTiltDeg: 7.25,
    meanTempC: 5505,
    moonCount: 0,
    render: {
      texture: texture('sol/2k_sun.jpg'),
      emissive: 'orange',
      emissiveIntensity: 0.5,
      light: { color: 'white', intensity: 2.0, distance: 7000 },
    },
  },
  {
    id: 'mercurio',
    name: 'Mercúrio',
    type: 'Planeta Rochoso',
    kind: 'planet',
    description:
      'Mercúrio é o planeta mais rápido do Sistema Solar, orbitando o Sol a cada 88 dias terrestres. Apesar de ser o mais próximo do Sol, não é o mais quente.',
    radiusKm: 2439.7,
    massKg: 3.301e23,
    gravityMs2: 3.7,
    densityGcm3: 5.43,
    semiMajorAxisAU: 0.387,
    orbitalPeriodDays: 87.97,
    eccentricity: 0.206,
    orbitalInclinationDeg: 7.0,
    rotationPeriodHours: 1407.6,
    axialTiltDeg: 0.034,
    meanTempC: 167,
    moonCount: 0,
    atmosphere: 'Praticamente inexistente (sódio, oxigênio, hidrogênio)',
    render: { texture: texture('mercurio/2k_mercury.jpg') },
  },
  {
    id: 'venus',
    name: 'Vênus',
    type: 'Planeta Rochoso',
    kind: 'planet',
    description:
      'Vênus é o planeta mais quente do Sistema Solar com temperaturas de até 462°C. Sua atmosfera é 92 vezes mais densa que a da Terra.',
    radiusKm: 6051.8,
    massKg: 4.867e24,
    gravityMs2: 8.87,
    densityGcm3: 5.24,
    semiMajorAxisAU: 0.723,
    orbitalPeriodDays: 224.7,
    eccentricity: 0.007,
    orbitalInclinationDeg: 3.39,
    rotationPeriodHours: -5832.5,
    axialTiltDeg: 177.4,
    meanTempC: 462,
    moonCount: 0,
    atmosphere: 'CO₂ (96,5%), N₂ (3,5%)',
    render: { texture: texture('venus/2k_venus_surface.jpg') },
  },
  {
    id: 'terra',
    name: 'Terra',
    type: 'Planeta Rochoso',
    kind: 'planet',
    description:
      'A Terra é o único planeta conhecido com vida. Nosso planeta completa uma volta ao redor do Sol a cada 365,25 dias.',
    radiusKm: 6371,
    massKg: 5.972e24,
    gravityMs2: 9.807,
    densityGcm3: 5.51,
    semiMajorAxisAU: 1.0,
    orbitalPeriodDays: 365.25,
    eccentricity: 0.017,
    orbitalInclinationDeg: 0.0,
    rotationPeriodHours: 23.934,
    axialTiltDeg: 23.44,
    meanTempC: 15,
    moonCount: 1,
    atmosphere: 'N₂ (78%), O₂ (21%), Ar (0,9%)',
    render: { texture: texture('terra/2k_earth_daymap.jpg') },
  },
  {
    id: 'marte',
    name: 'Marte',
    type: 'Planeta Rochoso',
    kind: 'planet',
    description:
      'Marte é conhecido como o "Planeta Vermelho" devido ao óxido de ferro em sua superfície. Um dia em Marte dura 24 horas e 37 minutos.',
    radiusKm: 3389.5,
    massKg: 6.417e23,
    gravityMs2: 3.72,
    densityGcm3: 3.93,
    semiMajorAxisAU: 1.524,
    orbitalPeriodDays: 686.97,
    eccentricity: 0.093,
    orbitalInclinationDeg: 1.85,
    rotationPeriodHours: 24.623,
    axialTiltDeg: 25.19,
    meanTempC: -60,
    moonCount: 2,
    atmosphere: 'CO₂ (95,3%), N₂ (2,7%), Ar (1,6%)',
    render: { texture: texture('marte/2k_mars.jpg') },
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    type: 'Gigante Gasoso',
    kind: 'planet',
    description:
      'Júpiter é o maior planeta do Sistema Solar. Uma tempestade chamada Grande Mancha Vermelha roda em sua atmosfera há mais de 300 anos.',
    radiusKm: 69911,
    massKg: 1.898e27,
    gravityMs2: 24.79,
    densityGcm3: 1.33,
    semiMajorAxisAU: 5.203,
    orbitalPeriodDays: 4332.59,
    eccentricity: 0.049,
    orbitalInclinationDeg: 1.3,
    rotationPeriodHours: 9.925,
    axialTiltDeg: 3.13,
    meanTempC: -110,
    moonCount: 95,
    atmosphere: 'H₂ (89%), He (10%), CH₄, NH₃',
    render: { texture: texture('jupter/2k_jupiter.jpg') },
  },
  {
    id: 'saturno',
    name: 'Saturno',
    type: 'Gigante Gasoso',
    kind: 'planet',
    description:
      'Saturno é famoso por seus anéis deslumbrantes, compostos por bilhões de partículas de gelo e rocha. É o segundo maior planeta do Sistema Solar.',
    radiusKm: 58232,
    massKg: 5.683e26,
    gravityMs2: 10.44,
    densityGcm3: 0.69,
    semiMajorAxisAU: 9.537,
    orbitalPeriodDays: 10759.22,
    eccentricity: 0.057,
    orbitalInclinationDeg: 2.49,
    rotationPeriodHours: 10.656,
    axialTiltDeg: 26.73,
    meanTempC: -140,
    moonCount: 146,
    atmosphere: 'H₂ (96%), He (3%)',
    render: {
      texture: texture('saturno/2k_saturn.jpg'),
      ringTexture: texture('saturno/2k_saturn_ring_alpha.png'),
    },
  },
  {
    id: 'urano',
    name: 'Urano',
    type: 'Gigante de Gelo',
    kind: 'planet',
    description:
      'Urano rotaciona de lado, provavelmente devido a uma colisão há bilhões de anos. Tem uma cor azul-verde característica devido ao metano em sua atmosfera.',
    radiusKm: 25362,
    massKg: 8.681e25,
    gravityMs2: 8.69,
    densityGcm3: 1.27,
    semiMajorAxisAU: 19.191,
    orbitalPeriodDays: 30688.5,
    eccentricity: 0.046,
    orbitalInclinationDeg: 0.77,
    rotationPeriodHours: -17.24,
    axialTiltDeg: 97.77,
    meanTempC: -195,
    moonCount: 28,
    atmosphere: 'H₂ (83%), He (15%), CH₄ (2%)',
    render: { texture: texture('urano/2k_uranus.jpg') },
  },
  {
    id: 'netuno',
    name: 'Netuno',
    type: 'Gigante de Gelo',
    kind: 'planet',
    description:
      'Netuno é o planeta mais distante do Sol e tem os ventos mais fortes do Sistema Solar, atingindo 2.100 km/h. Um ano em Netuno equivale a 165 anos terrestres.',
    radiusKm: 24622,
    massKg: 1.024e26,
    gravityMs2: 11.15,
    densityGcm3: 1.64,
    semiMajorAxisAU: 30.069,
    orbitalPeriodDays: 60195.0,
    eccentricity: 0.01,
    orbitalInclinationDeg: 1.77,
    rotationPeriodHours: 16.11,
    axialTiltDeg: 28.32,
    meanTempC: -200,
    moonCount: 16,
    atmosphere: 'H₂ (80%), He (19%), CH₄ (1%)',
    render: { texture: texture('netuno/2k_neptune.jpg') },
  },
  {
    id: 'lua',
    name: 'Lua',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'terra',
    description:
      'A Lua é o único satélite natural da Terra e o quinto maior satélite do Sistema Solar. Sua gravidade causa as marés terrestres.',
    radiusKm: 1737.4,
    massKg: 7.342e22,
    gravityMs2: 1.62,
    densityGcm3: 3.34,
    semiMajorAxisKm: 384400,
    orbitalPeriodDays: 27.32,
    eccentricity: 0.055,
    orbitalInclinationDeg: 5.14,
    rotationPeriodHours: 655.7,
    axialTiltDeg: 6.68,
    meanTempC: -20,
    moonCount: 0,
    render: {},
  },
  {
    id: 'fobos',
    name: 'Fobos',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'marte',
    description:
      'Fobos é a maior e mais interna das duas luas de Marte. Orbita mais rápido do que Marte rotaciona.',
    radiusKm: 11.267,
    massKg: 1.066e16,
    gravityMs2: 0.0057,
    densityGcm3: 1.88,
    semiMajorAxisKm: 9376,
    orbitalPeriodDays: 0.319,
    eccentricity: 0.015,
    orbitalInclinationDeg: 1.093,
    rotationPeriodHours: 7.65,
    axialTiltDeg: 0,
    meanTempC: -40,
    moonCount: 0,
    render: {},
  },
  {
    id: 'deimos',
    name: 'Deimos',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'marte',
    description: 'Deimos é a menor e mais externa das duas luas de Marte.',
    radiusKm: 6.2,
    massKg: 1.48e15,
    gravityMs2: 0.003,
    densityGcm3: 1.47,
    semiMajorAxisKm: 23463,
    orbitalPeriodDays: 1.263,
    eccentricity: 0.0002,
    orbitalInclinationDeg: 0.93,
    rotationPeriodHours: 30.3,
    axialTiltDeg: 0,
    meanTempC: -40,
    moonCount: 0,
    render: {},
  },
  {
    id: 'io',
    name: 'Io',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'jupiter',
    description:
      'Io é o corpo geologicamente mais ativo do Sistema Solar, com centenas de vulcões ativos.',
    radiusKm: 1821.6,
    massKg: 8.932e22,
    gravityMs2: 1.796,
    densityGcm3: 3.53,
    semiMajorAxisKm: 421700,
    orbitalPeriodDays: 1.769,
    eccentricity: 0.004,
    orbitalInclinationDeg: 0.036,
    rotationPeriodHours: 42.46,
    axialTiltDeg: 0,
    meanTempC: -130,
    moonCount: 0,
    render: {},
  },
  {
    id: 'europa',
    name: 'Europa',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'jupiter',
    description:
      'Europa possui um oceano de água líquida sob sua crosta gelada, tornando-a um dos lugares mais promissores para vida extraterrestre.',
    radiusKm: 1560.8,
    massKg: 4.8e22,
    gravityMs2: 1.315,
    densityGcm3: 3.01,
    semiMajorAxisKm: 671100,
    orbitalPeriodDays: 3.551,
    eccentricity: 0.009,
    orbitalInclinationDeg: 0.464,
    rotationPeriodHours: 85.22,
    axialTiltDeg: 0,
    meanTempC: -160,
    moonCount: 0,
    render: {},
  },
  {
    id: 'ganimedes',
    name: 'Ganimedes',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'jupiter',
    description:
      'Ganimedes é o maior satélite do Sistema Solar, maior até que o planeta Mercúrio.',
    radiusKm: 2634.1,
    massKg: 1.482e23,
    gravityMs2: 1.428,
    densityGcm3: 1.94,
    semiMajorAxisKm: 1070400,
    orbitalPeriodDays: 7.155,
    eccentricity: 0.001,
    orbitalInclinationDeg: 0.177,
    rotationPeriodHours: 171.7,
    axialTiltDeg: 0,
    meanTempC: -163,
    moonCount: 0,
    render: {},
  },
  {
    id: 'calisto',
    name: 'Calisto',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'jupiter',
    description:
      'Calisto é a lua galileana mais externa de Júpiter e possui a superfície mais densamente craterizada do Sistema Solar.',
    radiusKm: 2410.3,
    massKg: 1.076e23,
    gravityMs2: 1.235,
    densityGcm3: 1.83,
    semiMajorAxisKm: 1882700,
    orbitalPeriodDays: 16.69,
    eccentricity: 0.007,
    orbitalInclinationDeg: 0.192,
    rotationPeriodHours: 400.5,
    axialTiltDeg: 0,
    meanTempC: -139,
    moonCount: 0,
    render: {},
  },
  {
    id: 'tita',
    name: 'Titã',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'saturno',
    description:
      'Titã é o maior satélite de Saturno e o único no Sistema Solar com uma atmosfera densa, rica em nitrogênio.',
    radiusKm: 2574.7,
    massKg: 1.345e23,
    gravityMs2: 1.352,
    densityGcm3: 1.88,
    semiMajorAxisKm: 1221870,
    orbitalPeriodDays: 15.945,
    eccentricity: 0.0288,
    orbitalInclinationDeg: 0.33,
    rotationPeriodHours: 382.7,
    axialTiltDeg: 0,
    meanTempC: -179,
    moonCount: 0,
    atmosphere: 'N₂ (94-98%), CH₄ (1-6%)',
    render: {},
  },
  {
    id: 'titania',
    name: 'Titânia',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'urano',
    description:
      'Titânia é o maior satélite de Urano, com imensos cânions e escarpas em sua superfície gelada.',
    radiusKm: 788.4,
    massKg: 3.527e21,
    gravityMs2: 0.379,
    densityGcm3: 1.711,
    semiMajorAxisKm: 435910,
    orbitalPeriodDays: 8.706,
    eccentricity: 0.001,
    orbitalInclinationDeg: 0.08,
    rotationPeriodHours: 208.9,
    axialTiltDeg: 0,
    meanTempC: -203,
    moonCount: 0,
    render: {},
  },
  {
    id: 'oberon',
    name: 'Oberon',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'urano',
    description:
      'Oberon é o segundo maior satélite de Urano, com craters e manchas escuras na superfície.',
    radiusKm: 761.4,
    massKg: 3.014e21,
    gravityMs2: 0.346,
    densityGcm3: 1.63,
    semiMajorAxisKm: 583520,
    orbitalPeriodDays: 13.463,
    eccentricity: 0.001,
    orbitalInclinationDeg: 0.068,
    rotationPeriodHours: 323.1,
    axialTiltDeg: 0,
    meanTempC: -203,
    moonCount: 0,
    render: {},
  },
  {
    id: 'tritao',
    name: 'Tritão',
    type: 'Satélite Natural',
    kind: 'moon',
    parentId: 'netuno',
    description:
      'Tritão é o maior satélite de Netuno e orbita em sentido retrógrado, indicando que foi capturado de outra região do Sistema Solar.',
    radiusKm: 1353.4,
    massKg: 2.139e22,
    gravityMs2: 0.779,
    densityGcm3: 2.059,
    semiMajorAxisKm: 354759,
    orbitalPeriodDays: -5.877,
    eccentricity: 0.000016,
    orbitalInclinationDeg: 156.885,
    rotationPeriodHours: -141.0,
    axialTiltDeg: 0,
    meanTempC: -235,
    moonCount: 0,
    atmosphere: 'N₂ (99%), CH₄ (0,01%)',
    render: {},
  },
];

export function getBodyById(id: string): CelestialBody | undefined {
  return BODIES.find((b) => b.id === id);
}

export function getMoons(parentId: string): CelestialBody[] {
  return BODIES.filter((b) => b.parentId === parentId);
}

export function getPlanets(): CelestialBody[] {
  return BODIES.filter((b) => b.kind === 'planet');
}

export function formatPeriod(days: number): string {
  const absDays = Math.abs(days);
  if (absDays === 0) return '—';
  if (absDays < 1) return `${(absDays * 24).toFixed(1)} h`;
  if (absDays < 365) return `${Math.round(absDays)} dias`;
  const years = absDays / 365.25;
  if (years < 100) return `${years.toFixed(1)} anos`;
  return `${Math.round(years)} anos`;
}
