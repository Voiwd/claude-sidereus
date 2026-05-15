import { OrbitControls, Stars } from '@react-three/drei';
import { Sun } from './Sun';
import { Mercury } from './Mercury';
import { Venus } from './Venus';
import { Earth } from './Earth';
import { Mars } from './Mars';
import { Jupiter } from './Jupiter';
import { Saturn } from './Saturn';
import { Uranus } from './Uranus';
import { Neptune } from './Neptune';
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
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

  const handleSelect = (
    name: string,
    pos: [number, number, number],
    radius: number
  ) => {
    const lookAt = new Vector3(pos[0], pos[1], pos[2]);
    const distance = Math.max(radius * 3, 18);
    setFocusedPlanet(name);
    setTarget({ lookAt, distance });
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

      <Sun
        position={[100, 0, 0]}
        texture={
          new URL('../assets/textures/sol/2k_sun.jpg', import.meta.url).href
        }
        radius={30}
        name="Sol"
        isFocused={focusedPlanet === 'Sol'}
        onClick={() => handleSelect('Sol', [100, 0, 0], 30)}
      />
      <Mercury
        position={[30, 0, 0]}
        texture={
          new URL('../assets/textures/mercurio/2k_mercury.jpg', import.meta.url)
            .href
        }
        radius={1}
        name="Mercury"
        isFocused={focusedPlanet === 'Mercury'}
        onClick={() => handleSelect('Mercury', [30, 0, 0], 1)}
      />
      <Venus
        position={[15, 0, 0]}
        texture={
          new URL(
            '../assets/textures/venus/2k_venus_surface.jpg',
            import.meta.url
          ).href
        }
        radius={1.5}
        name="Venus"
        isFocused={focusedPlanet === 'Venus'}
        onClick={() => handleSelect('Venus', [15, 0, 0], 1.5)}
      />
      <Earth
        position={[0, 0, 0]}
        texture={
          new URL(
            '../assets/textures/terra/2k_earth_daymap.jpg',
            import.meta.url
          ).href
        }
        radius={4}
        name="Earth"
        isFocused={focusedPlanet === 'Earth'}
        onClick={() => handleSelect('Earth', [0, 0, 0], 4)}
      />
      <Mars
        position={[-40, 0, 0]}
        texture={
          new URL('../assets/textures/marte/2k_mars.jpg', import.meta.url).href
        }
        radius={2}
        name="Mars"
        isFocused={focusedPlanet === 'Mars'}
        onClick={() => handleSelect('Mars', [-40, 0, 0], 2)}
      />
      <Jupiter
        position={[-80, 0, 0]}
        texture={
          new URL('../assets/textures/jupter/2k_jupiter.jpg', import.meta.url)
            .href
        }
        texture2=""
        radius={2}
        name="Jupiter"
        isFocused={focusedPlanet === 'Jupiter'}
        onClick={() => handleSelect('Jupiter', [-80, 0, 0], 2)}
      />
      <Saturn
        position={[-130, 0, 0]}
        texture={
          new URL('../assets/textures/saturno/2k_saturn.jpg', import.meta.url)
            .href
        }
        texture2={
          new URL(
            '../assets/textures/saturno/2k_saturn_ring_alpha.png',
            import.meta.url
          ).href
        }
        radius={5}
        name="Saturn"
        isFocused={focusedPlanet === 'Saturn'}
        onClick={() => handleSelect('Saturn', [-130, 0, 0], 5)}
      />
      <Uranus
        position={[-160, 0, 0]}
        texture={
          new URL('../assets/textures/urano/2k_uranus.jpg', import.meta.url)
            .href
        }
        radius={3}
        name="Uranus"
        isFocused={focusedPlanet === 'Uranus'}
        onClick={() => handleSelect('Uranus', [-160, 0, 0], 3)}
      />
      <Neptune
        position={[-190, 0, 0]}
        texture={
          new URL('../assets/textures/netuno/2k_neptune.jpg', import.meta.url)
            .href
        }
        radius={3}
        name="Neptune"
        isFocused={focusedPlanet === 'Neptune'}
        onClick={() => handleSelect('Neptune', [-190, 0, 0], 3)}
      />

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
