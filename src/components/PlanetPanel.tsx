import { useEffect } from 'react';
import { getPlanetById } from '../data/planets';
import { useStore } from '../store/useStore';

export function PlanetPanel() {
  const { focusedPlanetId, setFocusedPlanetId } = useStore();
  const planet = focusedPlanetId ? getPlanetById(focusedPlanetId) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusedPlanetId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setFocusedPlanetId]);

  if (!planet) return null;

  return (
    <div
      role="complementary"
      aria-label={`Informações sobre ${planet.name}`}
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 280,
        zIndex: 20,
        backgroundColor: 'rgba(20, 18, 16, 0.88)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.6)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {/* Header: name + close */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-title)',
              fontWeight: 700,
              color: 'var(--color-accent)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {planet.name.toUpperCase()}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-subtitle)',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0',
              fontStyle: 'italic',
            }}
          >
            {planet.type}
          </p>
        </div>
        <button
          onClick={() => setFocusedPlanetId(null)}
          aria-label="Fechar painel"
          title="Fechar (Esc)"
          style={{
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-micro)',
            cursor: 'pointer',
            padding: '2px 6px',
            flexShrink: 0,
            marginTop: 2,
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.borderColor = 'var(--color-accent-dim)';
            btn.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.borderColor = 'var(--color-border)';
            btn.style.color = 'var(--color-text-muted)';
          }}
        >
          ESC
        </button>
      </div>

      {/* Divider */}
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-border)',
          margin: 0,
        }}
      />

      {/* Data grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
        }}
      >
        {planet.distanceAU > 0 && (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-label)',
                color: 'var(--color-text-muted)',
                margin: '0 0 2px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Dist. ao Sol
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-data)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {planet.distanceAU} UA
            </p>
          </div>
        )}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-label)',
              color: 'var(--color-text-muted)',
              margin: '0 0 2px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Período Orbital
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {planet.orbitalPeriod}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-border)',
          margin: 0,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {planet.description}
      </p>
    </div>
  );
}
