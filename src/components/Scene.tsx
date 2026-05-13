import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Mercury } from './Mercury';
import { Venus } from './Venus';
import { Earth } from './Earth';
import { Mars } from './Mars';
import { Jupiter } from './Jupiter';
import { Saturn } from './Saturn';
import { Uranus } from './Uranus';
import { Neptune } from './Neptune';

export function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />

      <Sun
        position={[100, 0, 0]}
        texture={
          new URL('../assets/textures/sol/2k_sun.jpg', import.meta.url).href
        }
        radius={30}
        name="Sol"
      />
      <Mercury
        position={[30, 0, 0]}
        texture={
          new URL('../assets/textures/mercurio/2k_mercury.jpg', import.meta.url)
            .href
        }
        radius={1}
        name="Mercury"
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
      />
      <Mars
        position={[-40, 0, 0]}
        texture={
          new URL('../assets/textures/marte/2k_mars.jpg', import.meta.url).href
        }
        radius={2}
        name="Mars"
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
      />
      <Uranus
        position={[-160, 0, 0]}
        texture={
          new URL('../assets/textures/urano/2k_uranus.jpg', import.meta.url)
            .href
        }
        radius={3}
        name="Uranus"
      />
      <Neptune
        position={[-190, 0, 0]}
        texture={
          new URL('../assets/textures/netuno/2k_neptune.jpg', import.meta.url)
            .href
        }
        radius={3}
        name="Neptune"
      />

      <OrbitControls />
    </>
  );
}
