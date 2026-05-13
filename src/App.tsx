import { Canvas } from '@react-three/fiber';
import { Scene } from './components';

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
