import { useEffect, useState } from 'react';
import { getBodyById, formatPeriod } from '../data/bodies';
import { useStore } from '../store/useStore';

export function PlanetPanel() {
  const { focusedPlanetId, setFocusedPlanetId } = useStore();
  const planet = focusedPlanetId ? getBodyById(focusedPlanetId) : null;
  const [scienceOpen, setScienceOpen] = useState(false);

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
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-subtitle)',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0',
              fontStyle: 'italic',
            }}
          >
            {planet.type}
          </p>
          {planet.kind === 'star' && (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-micro)',
                color: 'var(--color-accent-dim)',
                margin: '6px 0 0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Coração do Sistema Solar
            </p>
          )}
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

      {/* Curated data grid: 2 cols x 3 rows */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
        }}
      >
        {/* Row 1: Distance to Sol, Orbital Period */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
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
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {planet.kind === 'star'
              ? '— UA'
              : planet.semiMajorAxisAU
                ? `${planet.semiMajorAxisAU.toFixed(3)} UA`
                : '—'}
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
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
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {formatPeriod(planet.orbitalPeriodDays)}
          </p>
        </div>

        {/* Row 2: Gravity, Mean Temperature */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-label)',
              color: 'var(--color-text-muted)',
              margin: '0 0 2px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Gravidade
          </p>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {planet.gravityMs2.toFixed(2)} m/s²
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-label)',
              color: 'var(--color-text-muted)',
              margin: '0 0 2px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Temperatura Média
          </p>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {planet.meanTempC}°C
          </p>
        </div>

        {/* Row 3: Day Duration, Moon Count */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-label)',
              color: 'var(--color-text-muted)',
              margin: '0 0 2px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Duração do Dia
          </p>
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {formatPeriod(Math.abs(planet.rotationPeriodHours) / 24)}
          </p>
        </div>
        {planet.kind !== 'moon' && (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-label)',
                color: 'var(--color-text-muted)',
                margin: '0 0 2px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Luas
            </p>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-data)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {planet.moonCount}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-border)',
          margin: 0,
        }}
      />

      {/* Collapsible Science Section */}
      <div>
        <button
          onClick={() => setScienceOpen(!scienceOpen)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-label)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = 'var(--color-accent-dim)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = 'var(--color-text-muted)';
          }}
        >
          Dados Científicos {scienceOpen ? '▾' : '▸'}
        </button>

        {scienceOpen && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Raio
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.radiusKm.toLocaleString('pt-BR')} km
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Massa
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.massKg.toExponential(2)} kg
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Densidade
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.densityGcm3} g/cm³
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Inclinação Axial
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.axialTiltDeg}°
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Excentricidade
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.eccentricity}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Inclinação Orbital
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-primary)',
                  margin: '2px 0 0',
                }}
              >
                {planet.orbitalInclinationDeg}°
              </p>
            </div>

            {planet.atmosphere && (
              <div style={{ gridColumn: '1 / -1' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 'var(--text-micro)',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Atmosfera
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 'var(--text-micro)',
                    color: 'var(--color-text-primary)',
                    margin: '2px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  {planet.atmosphere}
                </p>
              </div>
            )}
          </div>
        )}
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
          fontFamily: 'var(--font-serif)',
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
