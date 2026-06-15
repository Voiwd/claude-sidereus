import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Scene } from '../../components';

export function Engine() {
  const navigate = useNavigate();

  return (
    <div
      className="w-screen h-screen relative"
      style={{ background: 'var(--color-bg)' }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-label)',
          letterSpacing: '0.08em',
          padding: '6px 12px',
          cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.borderColor = 'var(--color-accent-dim)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--color-accent)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        className="absolute top-4 left-4 z-10"
        type="button"
      >
        ← VOLTAR
      </button>

      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
