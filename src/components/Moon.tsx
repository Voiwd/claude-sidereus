import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { radiusToScene } from '../engine/scale';
import type { CelestialBody } from '../data/bodies';
import type { Mesh } from 'three';

interface MoonProps {
  data: CelestialBody;
  position: [number, number, number];
}

function MoonComponent({ data, position }: MoonProps) {
  const { radiusKm, rotationPeriodHours } = data;

  const radius = radiusToScene(radiusKm);
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Gentle rotation: always positive and fast for visual effect
    const absHours = Math.abs(rotationPeriodHours) || 1;
    // Rotate: rad/s = 2π / (hours * 3600)
    // Multiply by 10 for visible speed at normal time scale
    meshRef.current.rotation.y +=
      ((delta * 2 * Math.PI) / (absHours * 3600)) * 86400 * 10;
  });

  return (
    <group position={position}>
      {/* Moon sphere with flat gray-beige color */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#aaa8a2" />
      </mesh>
    </group>
  );
}

/** Memoized moon component: renders as a simple sphere with rotation. */
export const Moon = memo(MoonComponent);
