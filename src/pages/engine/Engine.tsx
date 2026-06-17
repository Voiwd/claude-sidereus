import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { PlanetPanel, Scene, TimeControls } from '../../components';

export function Engine() {
  const navigate = useNavigate();

  return (
    <div
      className="w-screen h-screen relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          zIndex: 10,
          padding: 'var(--space-2) var(--space-4)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-label)',
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'background-color 200ms, border-color 200ms',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'var(--color-surface-2)';
          btn.style.borderColor = 'var(--color-accent-dim)';
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundColor = 'var(--color-surface)';
          btn.style.borderColor = 'var(--color-border)';
        }}
      >
        ← VOLTAR
      </button>

      <PlanetPanel />
      <TimeControls />

      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
