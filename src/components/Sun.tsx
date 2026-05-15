import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetProps } from './types';

export function Sun({
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
        <meshStandardMaterial
          map={TEXTURE}
          emissive={'orange'}
          emissiveIntensity={0.5}
        />
      </mesh>

      <pointLight color="white" intensity={20000} distance={3000} />
      <PlanetBillboard
        hidden={isFocused}
        label={name}
        radius={radius}
        onSelect={onClick}
      />
    </group>
  );
}
