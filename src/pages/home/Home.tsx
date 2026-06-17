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

    const drawStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = '#0c0b09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ede9e3';
      ctx.globalAlpha = 0.5;

      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillRect(x, y, size, size);
      }

      ctx.globalAlpha = 1;
    };

    drawStars();

    const handleResize = () => drawStars();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentCuriosity = ASTRO_CURIOSITIES[currentCuriosityIndex];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Canvas de fundo com estrelas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,11,9,0.7) 0%, transparent 40%, rgba(12,11,9,0.8) 100%)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-12 md:mb-16 absolute top-8 md:top-12">
          <div className="text-left">
            <h1
              className="font-bold tracking-wider"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              Sidereus
            </h1>
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-label)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Sistema Solar Interativo
            </p>
          </div>
        </div>

        <div className="text-center mb-12 md:mb-16 max-w-3xl">
          <p
            className="leading-relaxed mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-subtitle)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Visualização Interativa do Sistema Solar
          </p>
          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Explore os astros do nosso sistema solar de forma interativa e
            educativa. Mergulhe em uma experiência visual que traz a
            grandiosidade do cosmos para suas mãos.
          </p>
        </div>

        {/* CTA Principal */}
        <button
          onClick={() => navigate('/engine')}
          className="transition-all duration-300 hover:scale-105"
          style={{
            padding: '14px 48px',
            backgroundColor: 'var(--color-accent)',
            color: '#0c0b09',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-data)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 24px var(--color-accent-glow)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-accent-warm)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--color-accent)';
          }}
        >
          CONHEÇA OS ASTROS
        </button>
      </div>

      {/* Curiosidade na base */}
      <div
        className="relative z-20 px-4 md:px-8 py-4 md:py-6"
        style={{
          borderTop: '1px solid var(--color-border)',
          background:
            'linear-gradient(to bottom, transparent, rgba(12,11,9,0.95))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 md:mb-3">
            <h3
              className="uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-label)',
                fontWeight: 700,
                color: 'var(--color-accent)',
              }}
            >
              {currentCuriosity.title}
            </h3>
          </div>

          <p
            className="leading-relaxed mb-3 md:mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-data)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {currentCuriosity.fact}
          </p>

          {/* Controles do carrossel */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {ASTRO_CURIOSITIES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCuriosityIndex(index)}
                  aria-label={`Ver dica ${index + 1}`}
                  style={{
                    height: 4,
                    width: index === currentCuriosityIndex ? 16 : 8,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 300ms',
                    backgroundColor:
                      index === currentCuriosityIndex
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
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
              className="ml-auto flex items-center gap-2 transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-label)',
                fontWeight: 700,
                color: 'var(--color-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-accent-warm)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-accent)';
              }}
            >
              PRÓXIMA DICA <span style={{ fontSize: '1rem' }}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orb decorativo âmbar (único — removido o azul que violava o design) */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          top: 40,
          right: 40,
          width: 192,
          height: 192,
          backgroundColor: 'var(--color-accent)',
          opacity: 0.04,
        }}
      />
    </div>
  );
}
