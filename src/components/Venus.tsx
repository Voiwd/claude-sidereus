import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetProps } from './types';

export function Venus({
  position,
  texture,
  radius,
  name,
  isFocused,
  onClick,
}: PlanetProps) {
  const TEXTURE = useLoader(TextureLoader, texture);
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={TEXTURE} />
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
