import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Planet } from './Planet';
import { PLANETS } from '../data/planets';

const CAMERA_LERP = 0.12;
const CAMERA_EASE = 0.08;
const FOCUS_DISTANCE_MIN = 18;
const FOCUS_DISTANCE_FACTOR = 3;

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    lookAt: Vector3;
    distance: number;
  } | null>(null);

  useFrame(() => {
    if (!target || !controlsRef.current?.target) return;

    const controlsTarget = controlsRef.current.target;
    const previousTarget = controlsTarget.clone();
    controlsTarget.lerp(target.lookAt, CAMERA_LERP);

    const targetDelta = controlsTarget.clone().sub(previousTarget);
    camera.position.add(targetDelta);

    const offset = camera.position.clone().sub(controlsTarget);
    const nextDistance =
      offset.length() + (target.distance - offset.length()) * CAMERA_EASE;
    camera.position.copy(controlsTarget).add(offset.setLength(nextDistance));
    controlsRef.current.update();

    if (
      controlsTarget.distanceTo(target.lookAt) < 0.1 &&
      Math.abs(nextDistance - target.distance) < 0.1
    ) {
      setTarget(null);
    }
  });

  const handleSelect = (
    id: string,
    pos: [number, number, number],
    radius: number
  ) => {
    setFocusedId(id);
    setTarget({
      lookAt: new Vector3(...pos),
      distance: Math.max(radius * FOCUS_DISTANCE_FACTOR, FOCUS_DISTANCE_MIN),
    });
  };

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
          {...planet}
          isFocused={focusedId === planet.id}
          onClick={() =>
            handleSelect(planet.id, planet.position, planet.radius)
          }
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
