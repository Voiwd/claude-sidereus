import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { bodyRadiusToScene } from '../engine/scale';
import { useStore } from '../store/useStore';
import type { CelestialBody } from '../data/bodies';
import type { Mesh } from 'three';

interface MoonProps {
  data: CelestialBody;
  position: [number, number, number];
}

function MoonComponent({ data, position }: MoonProps) {
  const { radiusKm, rotationPeriodHours } = data;

  const radius = bodyRadiusToScene(radiusKm);
  const meshRef = useRef<Mesh>(null);

  const absHours = Math.abs(rotationPeriodHours) || 1;

  useFrame(() => {
    if (!meshRef.current) return;
    // Absolute angle from sim time, so spin pauses/resets with the simulation.
    const simTimeDays = useStore.getState().simTimeDays;
    const rotations = (simTimeDays * 24) / absHours;
    meshRef.current.rotation.y = rotations * 2 * Math.PI;
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
