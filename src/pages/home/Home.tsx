import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ASTRO_CURIOSITIES } from '../../data/facts';

export function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentCuriosityIndex, setCurrentCuriosityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCuriosityIndex((prev) => (prev + 1) % ASTRO_CURIOSITIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderStars();
    };

    const renderStars = () => {
      ctx.fillStyle = '#0c0b09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ede9e3';
      ctx.globalAlpha = 0.5;

      for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillRect(x, y, size, size);
      }

      ctx.globalAlpha = 1;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const currentCuriosity = ASTRO_CURIOSITIES[currentCuriosityIndex];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: 'var(--color-bg)' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-bg) 0%, transparent 30%, transparent 70%, var(--color-bg) 100%)',
          opacity: 0.7,
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8">
        <div className="w-full flex justify-between items-center mb-12 md:mb-16 absolute top-8 md:top-12">
          <div className="text-left">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 6vw, var(--text-display))',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.12em',
                margin: 0,
              }}
            >
              Sidereus
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-micro)',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                margin: '4px 0 0',
                letterSpacing: '0.06em',
              }}
            >
              Sistema Solar Interativo
            </p>
          </div>
        </div>

        <div className="text-center mb-12 md:mb-16 max-w-3xl">
          <p
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.04em',
              marginBottom: '2rem',
            }}
          >
            Visualização Interativa do Sistema Solar
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Explore os astros do nosso sistema solar de forma interativa e
            educativa. Mergulhe em uma experiência visual que traz a
            grandiosidade do cosmos para suas mãos.
          </p>
        </div>

        <button
          onClick={() => navigate('/engine')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--color-bg)',
            background: 'var(--color-accent)',
            border: '1px solid var(--color-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 40px',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-accent-warm)';
            e.currentTarget.style.boxShadow =
              '0 0 24px var(--color-accent-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-accent)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--color-accent)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
          type="button"
        >
          CONHEÇA OS ASTROS
        </button>
      </div>

      <div
        className="relative z-20 px-4 md:px-8 py-4 md:py-6"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: `linear-gradient(to bottom, transparent, var(--color-bg))`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 md:mb-3">
            <h3
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-label)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--color-accent)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              {currentCuriosity.title}
            </h3>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              marginBottom: '12px',
            }}
          >
            {currentCuriosity.fact}
          </p>

          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {ASTRO_CURIOSITIES.map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: '3px',
                    width: index === currentCuriosityIndex ? '16px' : '8px',
                    borderRadius: 'var(--radius-sm)',
                    background:
                      index === currentCuriosityIndex
                        ? 'var(--color-accent)'
                        : 'var(--color-border)',
                    transition: 'width 0.3s, background 0.3s',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentCuriosityIndex(
                  (prev) => (prev + 1) % ASTRO_CURIOSITIES.length
                )
              }
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-label)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-warm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid var(--color-accent)';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              type="button"
            >
              PRÓXIMA DICA <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
