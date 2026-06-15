import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import type { PlanetData } from '../data/planets';

interface PlanetProps {
  data: PlanetData;
  isFocused?: boolean;
  onSelect?: () => void;
}

/**
 * Generic celestial body. Renders a textured sphere, an optional ring and
 * point light, plus the clickable billboard. All bodies in the scene are
 * driven from `PLANETS` data through this single component.
 */
export function Planet({ data, isFocused, onSelect }: PlanetProps) {
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
  const ring = useLoader(TextureLoader, ringTexture ?? texture);

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

      {ringTexture && (
        <mesh>
          <cylinderGeometry args={[radius * 2, 0]} />
          <meshStandardMaterial map={ring} />
        </mesh>
      )}

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
