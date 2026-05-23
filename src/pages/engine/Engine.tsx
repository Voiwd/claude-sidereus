import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Scene } from '../../components';

export function Engine() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-zinc-950 relative">
      {/* Botão para voltar à home */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition"
      >
        ← Voltar
      </button>

      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
