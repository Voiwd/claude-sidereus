import { memo } from 'react';
import { useLoader } from '@react-three/fiber';
import { DoubleSide, TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetData } from '../data/planets';

interface RingProps {
  ringTexture: string;
  radius: number;
}

/** Loaded as a separate component so only Saturn pays the texture-load cost. */
function Ring({ ringTexture, radius }: RingProps) {
  const tex = useLoader(TextureLoader, ringTexture);
  return (
    // ringGeometry is in the XY plane by default; rotate -90° to lay it flat.
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.25, radius * 2.5, 64]} />
      <meshStandardMaterial map={tex} side={DoubleSide} transparent />
    </mesh>
  );
}

interface PlanetProps {
  data: PlanetData;
  isFocused?: boolean;
  onSelect?: () => void;
}

function PlanetComponent({ data, isFocused, onSelect }: PlanetProps) {
  const {
    position,
    radius,
    texture,
    ringTexture,
    emissive,
    emissiveIntensity,
    light,
    name,
  } = data;

  const surface = useLoader(TextureLoader, texture);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={surface}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {ringTexture && <Ring ringTexture={ringTexture} radius={radius} />}

      {light && (
        <pointLight
          color={light.color}
          intensity={light.intensity}
          distance={light.distance}
        />
      )}

      <PlanetBillboard
        hidden={isFocused}
        label={name}
        radius={radius}
        onSelect={onSelect}
      />
    </group>
  );
}

/** Memoized: re-renders only when isFocused changes or onSelect identity changes. */
export const Planet = memo(PlanetComponent);
