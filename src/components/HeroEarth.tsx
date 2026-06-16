import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { AdditiveBlending, BackSide, TextureLoader } from 'three';
import type { Group, Mesh } from 'three';
import { PLANETS } from '../data/planets';

const ATM_VERT = `
varying vec3 vN;
varying vec3 vP;
void main(){
  vN=normalize(normalMatrix*normal);
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  vP=mv.xyz;
  gl_Position=projectionMatrix*mv;
}`;

const ATM_FRAG = `
varying vec3 vN;
varying vec3 vP;
void main(){
  vec3 vd=normalize(-vP);
  float f=pow(1.0-abs(dot(vN,vd)),2.7);
  gl_FragColor=vec4(0.31,0.58,0.90,f*0.82);
}`;

const R = 2.8;
const TILT = (23.5 * Math.PI) / 180;
// Reuse the texture URL already resolved by planets.ts via import.meta.glob
const terraUrl = PLANETS.find((p) => p.id === 'terra')!.texture;

function EarthMesh() {
  const groupRef = useRef<Group>(null);
  const earthRef = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const tex = useLoader(TextureLoader, terraUrl);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += 0.04 * delta;
    cur.current.x += (mouse.current.x - cur.current.x) * 0.055;
    cur.current.y += (mouse.current.y - cur.current.y) * 0.055;
    state.camera.position.x = cur.current.x * 1.6;
    state.camera.position.y = -cur.current.y * 1.1;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]} rotation={[0, 0, TILT]}>
      <mesh ref={earthRef} rotation={[0, 2.4, 0]}>
        <sphereGeometry args={[R, 96, 96]} />
        <meshStandardMaterial map={tex} />
      </mesh>
      {/* Atmospheric rim — same shader as the landing prototype */}
      <mesh>
        <sphereGeometry args={[R * 1.07, 64, 64]} />
        <shaderMaterial
          vertexShader={ATM_VERT}
          fragmentShader={ATM_FRAG}
          side={BackSide}
          transparent={true}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function HeroEarth() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.25} color="#24344c" />
      <directionalLight
        position={[5, 1.5, 4]}
        intensity={1.1}
        color="#9fc0ff"
      />
      <Stars
        radius={120}
        depth={80}
        count={7000}
        factor={5}
        saturation={0}
        fade
      />
      <Suspense fallback={null}>
        <EarthMesh />
      </Suspense>
    </Canvas>
  );
}
