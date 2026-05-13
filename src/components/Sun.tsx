import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { PlanetProps } from './types';

export function Sun({ position, texture, radius }: PlanetProps) {
  const TEXTURE = useLoader(TextureLoader, texture);
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={TEXTURE}
        emissive={'orange'}
        emissiveIntensity={0.5}
      />

      <pointLight color="white" intensity={20000} distance={3000} />
    </mesh>
  );
}
