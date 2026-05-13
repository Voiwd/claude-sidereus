import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { PlanetProps } from './types';

export function Uranus({ position, texture, radius }: PlanetProps) {
  const TEXTURE = useLoader(TextureLoader, texture);
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={TEXTURE} />
    </mesh>
  );
}
