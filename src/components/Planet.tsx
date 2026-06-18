import { memo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { DoubleSide, TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import { radiusToScene } from '../engine/scale';
import type { CelestialBody } from '../data/bodies';
import type { Mesh } from 'three';

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
  data: CelestialBody;
  position: [number, number, number];
  isFocused?: boolean;
  onSelect?: () => void;
}

function PlanetComponent({ data, position, isFocused, onSelect }: PlanetProps) {
  const { radiusKm, render, name, rotationPeriodHours, axialTiltDeg } = data;

  const radius = radiusToScene(radiusKm);
  const texture = render.texture;
  const ringTexture = render.ringTexture;
  const emissive = render.emissive;
  const emissiveIntensity = render.emissiveIntensity;
  const light = render.light;

  // Always call useLoader, but pass a fallback if texture is not available
  const surface = useLoader(TextureLoader, texture || '');

  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Calculate rotation speed based on rotation period
    const rotDir = rotationPeriodHours >= 0 ? 1 : -1;
    const absHours = Math.abs(rotationPeriodHours) || 1;
    // Rotate: rad/s = 2π / (hours * 3600)
    // Multiply by 10 for visible speed at normal time scale
    meshRef.current.rotation.y +=
      rotDir * ((delta * 2 * Math.PI) / (absHours * 3600)) * 86400 * 10;
  });

  const tiltRad = (axialTiltDeg * Math.PI) / 180;

  return (
    <group position={position}>
      {/* Tilted group for axial rotation */}
      <group rotation={[0, 0, tiltRad]}>
        {texture && surface && (
          <mesh ref={meshRef}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
              map={surface}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )}

        {ringTexture && <Ring ringTexture={ringTexture} radius={radius} />}
      </group>

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
