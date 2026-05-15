import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetProps } from './types';

export function Saturn({
  position,
  texture,
  texture2,
  radius,
  name,
  isFocused,
  onClick,
}: PlanetProps) {
  const TEXTURE = useLoader(TextureLoader, texture);
  const TEXTURE2 = useLoader(TextureLoader, texture2!);
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={TEXTURE} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius * 2, 0]} />
        <meshStandardMaterial map={TEXTURE2} />
      </mesh>
      <PlanetBillboard
        hidden={isFocused}
        label={name}
        radius={radius}
        onSelect={onClick}
      />
    </group>
  );
}
