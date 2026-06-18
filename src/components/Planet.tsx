import { memo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { DoubleSide, TextureLoader } from 'three';
import { PlanetBillboard } from './PlanetBillboard';
import { bodyRadiusToScene } from '../engine/scale';
import { useStore } from '../store/useStore';
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
    // meshBasicMaterial keeps the rings unlit — meshStandardMaterial would let
    // the Sun's pointLight shadow them, darkening the top face and lighting the
    // bottom, the opposite of how planetary rings read.
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.2, radius * 2.2, 128]} />
      <meshBasicMaterial
        map={tex}
        side={DoubleSide}
        transparent
        alphaTest={0.01}
      />
    </mesh>
  );
}

interface SurfaceProps {
  texture: string;
  radius: number;
  emissive?: string;
  emissiveIntensity?: number;
  rotationPeriodHours: number;
}

/**
 * The rotating textured sphere. Split out so useLoader only ever runs with a
 * real texture URL (loading '' fires an invalid request). Spin is derived from
 * the absolute simulation time, so it honors pause/reset and scales with the
 * active timeScale instead of free-running.
 */
function PlanetSurface({
  texture,
  radius,
  emissive,
  emissiveIntensity,
  rotationPeriodHours,
}: SurfaceProps) {
  const surface = useLoader(TextureLoader, texture);
  const meshRef = useRef<Mesh>(null);

  const rotDir = rotationPeriodHours >= 0 ? 1 : -1;
  const absHours = Math.abs(rotationPeriodHours) || 1;

  useFrame(() => {
    if (!meshRef.current) return;
    // Absolute angle from sim time (read transiently to avoid re-renders).
    const simTimeDays = useStore.getState().simTimeDays;
    const rotations = (simTimeDays * 24) / absHours;
    meshRef.current.rotation.y = rotDir * rotations * 2 * Math.PI;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={surface}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
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

  const radius = bodyRadiusToScene(radiusKm);
  const { texture, ringTexture, emissive, emissiveIntensity, light } = render;

  const tiltRad = (axialTiltDeg * Math.PI) / 180;

  return (
    <group position={position}>
      {/* Tilted group for axial rotation */}
      <group rotation={[0, 0, tiltRad]}>
        {texture && (
          <PlanetSurface
            texture={texture}
            radius={radius}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            rotationPeriodHours={rotationPeriodHours}
          />
        )}

        {ringTexture && <Ring ringTexture={ringTexture} radius={radius} />}
      </group>

      {light && (
        <pointLight
          decay={0}
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
