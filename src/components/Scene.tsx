import { OrbitControls, Stars } from '@react-three/drei';
import { Planet } from './Planet';
import { Moon } from './Moon';
import {
  BODIES,
  getPlanets,
  getMoons,
  getBodyById,
  type CelestialBody,
} from '../data/bodies';
import {
  auToScene,
  focusDistanceForRadius,
  moonOrbitToScene,
  radiusToScene,
} from '../engine/scale';
import { useStore } from '../store/useStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const CAMERA_LERP = 0.12;
const CAMERA_EASE = 0.08;

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const {
    focusedPlanetId,
    setFocusedPlanetId,
    simTimeDays,
    setSimTimeDays,
    timeScale,
    paused,
  } = useStore();
  const [target, setTarget] = useState<{
    lookAt: Vector3;
    distance: number;
  } | null>(null);

  // Ref to avoid stale closure in useFrame
  const simTimeRef = useRef(0);
  useEffect(() => {
    simTimeRef.current = simTimeDays;
  }, [simTimeDays]);

  // Ref to store computed planet positions for camera focus tracking
  const planetPositionsRef = useRef<Map<string, [number, number, number]>>(
    new Map()
  );

  // Compute planet positions based on current simulation time
  const planets = getPlanets();
  const planetPositions = useMemo(() => {
    const positions = new Map<string, [number, number, number]>();
    planets.forEach((body, index) => {
      const phaseOffset = (index / planets.length) * 2 * Math.PI;
      const angle =
        phaseOffset + (2 * Math.PI * simTimeDays) / body.orbitalPeriodDays;
      const dist = auToScene(body.semiMajorAxisAU ?? 1);
      const planetPos: [number, number, number] = [
        dist * Math.cos(angle),
        0,
        dist * Math.sin(angle),
      ];
      positions.set(body.id, planetPos);

      // Compute moon positions relative to their parent planet
      const moons = getMoons(body.id);
      moons.forEach((moon, moonIndex) => {
        const moonPhase = (moonIndex / moons.length) * 2 * Math.PI;
        const moonAngle =
          moonPhase +
          (2 * Math.PI * simTimeDays) / Math.abs(moon.orbitalPeriodDays || 1);
        const moonDist = moonOrbitToScene(moon.semiMajorAxisKm ?? 10000);
        const moonLocalPos = [
          moonDist * Math.cos(moonAngle),
          0,
          moonDist * Math.sin(moonAngle),
        ];
        const moonWorldPos: [number, number, number] = [
          planetPos[0] + moonLocalPos[0],
          0,
          planetPos[2] + moonLocalPos[2],
        ];
        positions.set(moon.id, moonWorldPos);
      });
    });
    return positions;
  }, [simTimeDays, planets]);

  // Sync ref with computed positions
  useEffect(() => {
    planetPositionsRef.current = planetPositions;
  }, [planetPositions]);

  useFrame((_, delta) => {
    // Advance simulation time
    if (!paused) {
      simTimeRef.current += delta * timeScale;
      setSimTimeDays(simTimeRef.current);
    }

    // Handle camera focus on moving body
    if (!controlsRef.current?.target) return;

    const controlsTarget = controlsRef.current.target;
    let lerpTarget = target?.lookAt;

    // If a planet is focused, track its live position
    if (focusedPlanetId && planetPositionsRef.current.has(focusedPlanetId)) {
      const pos = planetPositionsRef.current.get(focusedPlanetId);
      if (pos) {
        lerpTarget = new Vector3(...pos);
      }
    }

    if (!lerpTarget) return;

    const previousTarget = controlsTarget.clone();
    controlsTarget.lerp(lerpTarget, CAMERA_LERP);

    const targetDelta = controlsTarget.clone().sub(previousTarget);
    camera.position.add(targetDelta);

    const offset = camera.position.clone().sub(controlsTarget);
    const nextDistance = target
      ? offset.length() + (target.distance - offset.length()) * CAMERA_EASE
      : offset.length();
    camera.position.copy(controlsTarget).add(offset.setLength(nextDistance));

    // Dynamic zoom: update minDistance based on focused body
    if (focusedPlanetId) {
      const body = getBodyById(focusedPlanetId);
      if (body) {
        controlsRef.current.minDistance = radiusToScene(body.radiusKm) * 1.2;
      }
    } else {
      controlsRef.current.minDistance = 5;
    }

    controlsRef.current.update();

    if (target && lerpTarget) {
      if (
        controlsTarget.distanceTo(lerpTarget) < 0.1 &&
        Math.abs(nextDistance - target.distance) < 0.1
      ) {
        setTarget(null);
      }
    }
  });

  // Stable across re-renders: setFocusedPlanetId is a Zustand action (stable
  // reference), and setTarget is a useState setter (also stable).
  const handleSelect = useCallback(
    (planet: CelestialBody, position: [number, number, number]) => {
      const [x, y, z] = position;
      setFocusedPlanetId(planet.id);
      setTarget({
        lookAt: new Vector3(x, y, z),
        distance: focusDistanceForRadius(planet.radiusKm),
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

      {/* Sol at origin */}
      <Planet
        key="sol"
        data={BODIES[0]}
        position={[0, 0, 0]}
        isFocused={focusedPlanetId === 'sol'}
        onSelect={() => handleSelect(BODIES[0], [0, 0, 0])}
      />

      {/* Planets with orbit rings and moons */}
      {planets.map((planet) => {
        const position = planetPositions.get(planet.id) || [0, 0, 0];
        const orbitRadius = auToScene(planet.semiMajorAxisAU ?? 1);
        const moons = getMoons(planet.id);

        return (
          <group key={planet.id}>
            {/* Orbit path ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[orbitRadius, 0.04, 2, 128]} />
              <meshBasicMaterial color="#3a3530" transparent opacity={0.5} />
            </mesh>

            {/* Planet */}
            <Planet
              data={planet}
              position={position}
              isFocused={focusedPlanetId === planet.id}
              onSelect={() => handleSelect(planet, position)}
            />

            {/* Moon orbit rings and moons */}
            {moons.map((moon) => {
              const moonPos = planetPositions.get(moon.id) || [0, 0, 0];
              const moonOrbitRadius = moonOrbitToScene(
                moon.semiMajorAxisKm ?? 10000
              );
              return (
                <group key={`moon-group-${moon.id}`}>
                  {/* Moon orbit ring at planet's position */}
                  <mesh
                    key={`moon-orbit-${moon.id}`}
                    position={position}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <torusGeometry args={[moonOrbitRadius, 0.02, 2, 64]} />
                    <meshBasicMaterial
                      color="#2a2520"
                      transparent
                      opacity={0.4}
                    />
                  </mesh>

                  {/* Moon */}
                  <Moon key={moon.id} data={moon} position={moonPos} />
                </group>
              );
            })}
          </group>
        );
      })}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        maxDistance={auToScene(35)}
        maxPolarAngle={Math.PI - 0.1}
        minDistance={5}
        minPolarAngle={0.1}
        zoomSpeed={0.8}
      />
    </>
  );
}
