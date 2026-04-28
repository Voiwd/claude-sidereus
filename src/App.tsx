import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </>
  );
}

function App() {
  return (
    <div className="w-screen h-screen bg-zinc-950">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
