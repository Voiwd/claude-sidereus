import { OrbitControls, Stars } from '@react-three/drei';
import { Planet } from './Planet';
import { PLANETS, type PlanetData } from '../data/planets';
import { useStore } from '../store/useStore';
import { useCallback, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const { focusedPlanetId, setFocusedPlanetId } = useStore();
  const [target, setTarget] = useState<{
    lookAt: Vector3;
    distance: number;
  } | null>(null);

  useFrame(() => {
    if (!target || !controlsRef.current?.target) {
      return;
    }

    const controlsTarget = controlsRef.current.target as Vector3;
    const previousTarget = controlsTarget.clone();
    controlsTarget.lerp(target.lookAt, 0.12);

    const targetDelta = controlsTarget.clone().sub(previousTarget);
    camera.position.add(targetDelta);

    const offset = camera.position.clone().sub(controlsTarget);
    const nextDistance =
      offset.length() + (target.distance - offset.length()) * 0.08;
    camera.position.copy(controlsTarget).add(offset.setLength(nextDistance));
    controlsRef.current.update();

    if (
      controlsTarget.distanceTo(target.lookAt) < 0.1 &&
      Math.abs(nextDistance - target.distance) < 0.1
    ) {
      setTarget(null);
    }
  });

  // Stable across re-renders: setFocusedPlanetId is a Zustand action (stable
  // reference), and setTarget is a useState setter (also stable).
  const handleSelect = useCallback(
    (planet: PlanetData) => {
      const [x, y, z] = planet.position;
      setFocusedPlanetId(planet.id);
      setTarget({
        lookAt: new Vector3(x, y, z),
        distance: Math.max(planet.radius * 3, 18),
      });
    },
    [setFocusedPlanetId]
  );

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <ambientLight intensity={0.2} />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          isFocused={focusedPlanetId === planet.id}
          onSelect={() => handleSelect(planet)}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        maxDistance={320}
        maxPolarAngle={Math.PI - 0.1}
        minDistance={8}
        minPolarAngle={0.1}
      />
    </>
  );
}
