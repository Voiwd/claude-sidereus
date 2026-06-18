import { Fragment, useCallback, useMemo, useRef } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { Planet } from './Planet';
import { Moon } from './Moon';
import { getBodyById, getMoons, getPlanets } from '../data/bodies';
import type { CelestialBody } from '../data/bodies';
import {
  auToScene,
  bodyRadiusToScene,
  focusDistanceForBody,
  moonOrbitToScene,
  STARFIELD_RADIUS_U,
} from '../engine/scale';
import { useStore } from '../store/useStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const CAMERA_LERP = 0.12;
const CAMERA_EASE = 0.08;
const TWO_PI = Math.PI * 2;

// Orbit-path guide colors, light enough to read against the dark background.
const PLANET_ORBIT_COLOR = '#6b5e4e';
const MOON_ORBIT_COLOR = '#4a3f35';

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();

  // Granular selectors so per-frame simTime updates don't re-render the scene.
  const focusedPlanetId = useStore((s) => s.focusedPlanetId);
  const setFocusedPlanetId = useStore((s) => s.setFocusedPlanetId);

  const target = useRef<{ lookAt: Vector3; distance: number } | null>(null);

  // Live world positions of every body, used for camera focus tracking.
  const positions = useRef(new Map<string, [number, number, number]>());
  // Object3D handles for the moving groups, keyed by body id.
  const groups = useRef(new Map<string, Object3D>());

  const register = useCallback(
    (id: string) => (node: Object3D | null) => {
      if (node) groups.current.set(id, node);
      else groups.current.delete(id);
    },
    []
  );

  const sol = useMemo(() => getBodyById('sol'), []);

  // Precompute the orbital layout once: getPlanets/getMoons return fresh arrays
  // on every call, so deriving this in render (or per frame) defeats memoization.
  const system = useMemo(() => {
    const planets = getPlanets();
    return planets.map((body, index) => ({
      body,
      phaseOffset: (index / planets.length) * TWO_PI,
      orbitRadius: auToScene(body.semiMajorAxisAU ?? 1),
      moons: getMoons(body.id).map((moon, mi, arr) => ({
        moon,
        phaseOffset: (mi / arr.length) * TWO_PI,
        orbitRadius: moonOrbitToScene(moon.semiMajorAxisKm ?? 10000),
        period: moon.orbitalPeriodDays || 1,
      })),
    }));
  }, []);

  useFrame((_, delta) => {
    // Advance time transiently; only TimeControls subscribes to simTimeDays.
    const { simTimeDays, paused, timeScale, setSimTimeDays } =
      useStore.getState();
    const t = paused ? simTimeDays : simTimeDays + delta * timeScale;
    if (!paused) setSimTimeDays(t);

    // Position every body for this instant, applying transforms to the group
    // refs directly (no React re-render) and recording world positions.
    for (const { body, phaseOffset, orbitRadius, moons } of system) {
      const angle = phaseOffset + (TWO_PI * t) / body.orbitalPeriodDays;
      const px = orbitRadius * Math.cos(angle);
      const pz = orbitRadius * Math.sin(angle);
      positions.current.set(body.id, [px, 0, pz]);
      groups.current.get(body.id)?.position.set(px, 0, pz);

      for (const moon of moons) {
        const ma = moon.phaseOffset + (TWO_PI * t) / moon.period;
        const mx = moon.orbitRadius * Math.cos(ma);
        const mz = moon.orbitRadius * Math.sin(ma);
        // Group is a child of the planet, so its offset is local.
        groups.current.get(moon.moon.id)?.position.set(mx, 0, mz);
        positions.current.set(moon.moon.id, [px + mx, 0, pz + mz]);
      }
    }

    // Camera focus handling.
    if (!controlsRef.current?.target) return;
    const controlsTarget = controlsRef.current.target;

    let lerpTarget = target.current?.lookAt;
    const focusPos = focusedPlanetId
      ? positions.current.get(focusedPlanetId)
      : undefined;
    if (focusPos) lerpTarget = new Vector3(...focusPos);

    if (lerpTarget) {
      const previousTarget = controlsTarget.clone();
      controlsTarget.lerp(lerpTarget, CAMERA_LERP);

      const targetDelta = controlsTarget.clone().sub(previousTarget);
      camera.position.add(targetDelta);

      const offset = camera.position.clone().sub(controlsTarget);
      const nextDistance = target.current
        ? offset.length() +
          (target.current.distance - offset.length()) * CAMERA_EASE
        : offset.length();
      camera.position.copy(controlsTarget).add(offset.setLength(nextDistance));

      if (
        target.current &&
        controlsTarget.distanceTo(lerpTarget) < 0.1 &&
        Math.abs(nextDistance - target.current.distance) < 0.1
      ) {
        target.current = null;
      }
    }

    // Keep zoom from pushing the camera through the focused body.
    if (focusedPlanetId) {
      const body = getBodyById(focusedPlanetId);
      controlsRef.current.minDistance = body
        ? bodyRadiusToScene(body.radiusKm) * 1.2
        : 60;
    } else {
      // When nothing is focused, prevent diving inside Sol (radius ≈ 55.7u).
      controlsRef.current.minDistance = sol
        ? bodyRadiusToScene(sol.radiusKm)
        : 60;
    }

    controlsRef.current.update();
  });

  const handleSelect = useCallback(
    (planet: CelestialBody) => {
      setFocusedPlanetId(planet.id);
      const pos = positions.current.get(planet.id) ?? [0, 0, 0];
      target.current = {
        lookAt: new Vector3(...pos),
        distance: focusDistanceForBody(planet.radiusKm),
      };
    },
    [setFocusedPlanetId]
  );

  return (
    <>
      <Stars
        radius={STARFIELD_RADIUS_U}
        depth={200}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <ambientLight intensity={0.2} />

      {/* Sol at origin */}
      {sol && (
        <Planet
          data={sol}
          position={[0, 0, 0]}
          isFocused={focusedPlanetId === 'sol'}
          onSelect={() => handleSelect(sol)}
        />
      )}

      {/* Static heliocentric orbit guides */}
      {system.map(({ body, orbitRadius }) => (
        <mesh key={`orbit-${body.id}`} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[orbitRadius, 0.04, 2, 128]} />
          <meshBasicMaterial
            color={PLANET_ORBIT_COLOR}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Planets (positioned per frame via group refs) with their moons */}
      {system.map(({ body, moons }) => (
        <group key={body.id} ref={register(body.id)}>
          <Planet
            data={body}
            position={[0, 0, 0]}
            isFocused={focusedPlanetId === body.id}
            onSelect={() => handleSelect(body)}
          />

          {moons.map(({ moon, orbitRadius }) => (
            <Fragment key={moon.id}>
              {/* Moon orbit ring, centered on the planet (local origin) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[orbitRadius, 0.02, 2, 64]} />
                <meshBasicMaterial
                  color={MOON_ORBIT_COLOR}
                  transparent
                  opacity={0.5}
                />
              </mesh>

              <group ref={register(moon.id)}>
                <Moon data={moon} position={[0, 0, 0]} />
              </group>
            </Fragment>
          ))}
        </group>
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        maxDistance={auToScene(35)}
        maxPolarAngle={Math.PI - 0.1}
        minDistance={60}
        minPolarAngle={0.1}
        zoomSpeed={0.8}
      />
    </>
  );
}
