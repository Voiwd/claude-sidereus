import { useLoader } from '@react-three/fiber';
import { DoubleSide, TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetConfig } from '../data/planets';

interface RingProps {
  texture2: string;
  innerRadius: number;
  outerRadius: number;
}

function Ring({ texture2, innerRadius, outerRadius }: RingProps) {
  const texture = useLoader(TextureLoader, texture2);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial map={texture} side={DoubleSide} transparent />
    </mesh>
  );
}

interface PlanetProps extends PlanetConfig {
  isFocused?: boolean;
  onClick?: () => void;
}

export function Planet({
  position,
  texture,
  texture2,
  radius,
  name,
  emissive,
  emissiveIntensity,
  isLight,
  ring,
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
          emissive={emissive ?? 'black'}
          emissiveIntensity={emissiveIntensity ?? 0}
        />
      </mesh>

      {ring && texture2 && (
        <Ring
          texture2={texture2}
          innerRadius={ring.innerRadius}
          outerRadius={ring.outerRadius}
        />
      )}

      {isLight && (
        <pointLight color={0xf4a340} intensity={20000} distance={3000} />
      )}

      <PlanetBillboard
        hidden={isFocused}
        label={name}
        radius={radius}
        onSelect={onClick}
      />
    </group>
  );
}
