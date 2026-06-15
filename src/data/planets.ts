export interface PlanetConfig {
  id: string;
  name: string;
  texture: string;
  texture2?: string;
  radius: number;
  position: [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
  isLight?: boolean;
  ring?: { innerRadius: number; outerRadius: number };
}

export const PLANETS: PlanetConfig[] = [
  {
    id: 'sol',
    name: 'Sol',
    texture: new URL('../assets/textures/sol/2k_sun.jpg', import.meta.url).href,
    radius: 30,
    position: [100, 0, 0],
    emissive: '#e8761a',
    emissiveIntensity: 0.5,
    isLight: true,
  },
  {
    id: 'mercurio',
    name: 'Mercúrio',
    texture: new URL(
      '../assets/textures/mercurio/2k_mercury.jpg',
      import.meta.url
    ).href,
    radius: 1,
    position: [30, 0, 0],
  },
  {
    id: 'venus',
    name: 'Vênus',
    texture: new URL(
      '../assets/textures/venus/2k_venus_surface.jpg',
      import.meta.url
    ).href,
    radius: 1.5,
    position: [15, 0, 0],
  },
  {
    id: 'terra',
    name: 'Terra',
    texture: new URL(
      '../assets/textures/terra/2k_earth_daymap.jpg',
      import.meta.url
    ).href,
    radius: 2.5,
    position: [0, 0, 0],
  },
  {
    id: 'marte',
    name: 'Marte',
    texture: new URL('../assets/textures/marte/2k_mars.jpg', import.meta.url)
      .href,
    radius: 1.2,
    position: [-40, 0, 0],
  },
  {
    // diretório com typo no repo (jupter); corrigir com: git mv src/assets/textures/jupter src/assets/textures/jupiter
    id: 'jupter',
    name: 'Júpiter',
    texture: new URL(
      '../assets/textures/jupter/2k_jupiter.jpg',
      import.meta.url
    ).href,
    radius: 7,
    position: [-80, 0, 0],
  },
  {
    id: 'saturno',
    name: 'Saturno',
    texture: new URL(
      '../assets/textures/saturno/2k_saturn.jpg',
      import.meta.url
    ).href,
    texture2: new URL(
      '../assets/textures/saturno/2k_saturn_ring_alpha.png',
      import.meta.url
    ).href,
    radius: 5.5,
    position: [-130, 0, 0],
    ring: { innerRadius: 7, outerRadius: 11 },
  },
  {
    id: 'urano',
    name: 'Urano',
    texture: new URL('../assets/textures/urano/2k_uranus.jpg', import.meta.url)
      .href,
    radius: 3,
    position: [-160, 0, 0],
  },
  {
    id: 'netuno',
    name: 'Netuno',
    texture: new URL(
      '../assets/textures/netuno/2k_neptune.jpg',
      import.meta.url
    ).href,
    radius: 2.8,
    position: [-190, 0, 0],
  },
];
