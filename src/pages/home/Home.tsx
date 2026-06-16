import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroEarth } from '../../components/HeroEarth';
import { PLANETS } from '../../data/planets';

const HEADLINE = 'Sidereus';
const SUBTITLE =
  'Explore os astros do nosso sistema solar de forma interativa e educativa. Mergulhe em uma experiência visual que traz a grandiosidade do cosmos para suas mãos.';
const STAR_SYMBOLS = ['✦', '✱', '✸'] as const;

function CtaButton({
  onClick,
  href,
  children,
  large,
}: {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  href: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: large ? 10 : 8,
        padding: large ? '13px 28px' : '11px 22px',
        background: 'var(--color-accent)',
        color: '#0c0b09',
        fontFamily: 'var(--font-ui)',
        fontSize: large ? 'clamp(13px,1.1vw,16px)' : 'clamp(12px,0.95vw,14px)',
        fontWeight: 400,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        borderRadius: '4px',
        border: '1px solid var(--color-accent-warm)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        boxShadow: '0 1px 12px rgba(0,0,0,0.3)',
        transition:
          'filter .18s ease, box-shadow .18s ease, transform .18s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.filter = 'brightness(1.15)';
        el.style.boxShadow =
          '0 0 24px rgba(232,118,26,0.5), 0 0 6px rgba(244,163,64,0.6)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.filter = '';
        el.style.boxShadow = '0 1px 12px rgba(0,0,0,0.3)';
        el.style.transform = '';
      }}
    >
      {children}
    </a>
  );
}

export function Home() {
  const navigate = useNavigate();

  // Typing animation
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [caretLine, setCaretLine] = useState<1 | 2>(1);
  const [caretOn, setCaretOn] = useState(false);
  const [starIdx, setStarIdx] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Curiosities carousel
  const [displayIdx, setDisplayIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  const carIdxRef = useRef(0);
  const carStartRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Typing effect — uses local `cancelled` flag to survive React StrictMode
  useEffect(() => {
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    let j = 0;

    const typeH = () => {
      if (cancelled) return;
      i++;
      setTyped1(HEADLINE.slice(0, i));
      if (i < HEADLINE.length) {
        t = setTimeout(typeH, 130);
      } else {
        t = setTimeout(() => {
          if (cancelled) return;
          setCaretLine(2);
          const typeS = () => {
            if (cancelled) return;
            j++;
            setTyped2(SUBTITLE.slice(0, j));
            if (j < SUBTITLE.length) {
              t = setTimeout(typeS, 18);
            } else {
              setCaretLine(1);
              t = setTimeout(() => {
                if (!cancelled) setButtonVisible(true);
              }, 200);
            }
          };
          typeS();
        }, 480);
      }
    };

    t = setTimeout(typeH, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Caret blink
  useEffect(() => {
    const id = setInterval(() => setCaretOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Star symbol cycle
  useEffect(() => {
    const id = setInterval(() => setStarIdx((v) => (v + 1) % 3), 800);
    return () => clearInterval(id);
  }, []);

  // Tip transition
  const goTip = useCallback((i: number) => {
    if (i === carIdxRef.current) {
      carStartRef.current = performance.now();
      setProgress(0);
      return;
    }
    setTipVisible(false);
    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      carIdxRef.current = i;
      carStartRef.current = performance.now();
      setDisplayIdx(i);
      setProgress(0);
      setTipVisible(true);
    }, 220);
  }, []);

  // Carousel auto-advance — local `alive` flag survives StrictMode
  useEffect(() => {
    let alive = true;
    carStartRef.current = performance.now();
    const id = setInterval(() => {
      if (!alive) return;
      const p = Math.min(1, (performance.now() - carStartRef.current) / 8000);
      setProgress(p);
      if (p >= 1) goTip((carIdxRef.current + 1) % PLANETS.length);
    }, 60);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [goTip]);

  useEffect(
    () => () => {
      clearTimeout(fadeTimerRef.current);
    },
    []
  );

  const planet = PLANETS[displayIdx];
  const caret1On = caretLine === 1 && caretOn && typed1.length > 0;
  const caret2On = caretLine === 2 && caretOn && typed2.length > 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          height: '100dvh',
          minHeight: 600,
          overflow: 'hidden',
        }}
      >
        <HeroEarth />

        {/* Radial vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'radial-gradient(125% 95% at 50% 64%, rgba(12,11,9,0) 38%, rgba(12,11,9,0.55) 100%)',
          }}
        />
        {/* Top/bottom fade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(12,11,9,0.76) 0%, rgba(12,11,9,0) 22%, rgba(12,11,9,0) 60%, rgba(12,11,9,0.97) 100%)',
          }}
        />

        {/* Project mark — top left */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(18px,3.2vh,28px)',
            left: 'clamp(20px,3.2vw,36px)',
            zIndex: 10,
          }}
        >
          <img
            src="/marksidereus.svg"
            alt="Sidereus"
            style={{ width: 32, height: 32, opacity: 0.9 }}
          />
        </div>

        {/* Hero copy */}
        <div
          style={{
            position: 'absolute',
            zIndex: 5,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-54%)',
            width: 'min(780px,90vw)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(56px,8.5vw,120px)',
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.06,
              textShadow: '0 2px 48px rgba(0,0,0,0.9)',
              minHeight: '1.06em',
            }}
          >
            {typed1}
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: '0.82em',
                marginLeft: 2,
                marginBottom: '-0.06em',
                verticalAlign: 'baseline',
                background: 'var(--color-accent)',
                opacity: caret1On ? 1 : 0,
                transition: 'opacity .08s',
                borderRadius: 1,
              }}
            />
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(14px,1.2vw,18px)',
              lineHeight: 1.68,
              color: 'var(--color-text-secondary)',
              margin: '18px auto 0',
              maxWidth: 520,
              minHeight: '3.36em',
              textShadow: '0 1px 16px rgba(0,0,0,0.6)',
            }}
          >
            {typed2}
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: '0.82em',
                marginLeft: 2,
                marginBottom: '-0.06em',
                verticalAlign: 'baseline',
                background: 'var(--color-accent)',
                opacity: caret2On ? 1 : 0,
                transition: 'opacity .08s',
                borderRadius: 1,
              }}
            />
          </p>

          <div
            style={{
              marginTop: 'clamp(28px,4vh,44px)',
              pointerEvents: 'auto',
              display: 'flex',
              justifyContent: 'center',
              opacity: buttonVisible ? 1 : 0,
              animation: buttonVisible
                ? 'sid-fade-up 0.55s ease forwards'
                : 'none',
            }}
          >
            <CtaButton
              href="/engine"
              onClick={(e) => {
                e.preventDefault();
                navigate('/engine');
              }}
              large
            >
              Conheça os Astros
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '1.1em',
                  lineHeight: 1,
                  animation: 'sid-star-spin 3.2s linear infinite',
                }}
              >
                {STAR_SYMBOLS[starIdx]}
              </span>
            </CtaButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 'clamp(20px,3.4vh,36px)',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            pointerEvents: 'none',
            opacity: buttonVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.3s',
            animation: buttonVisible
              ? 'sid-bob 2.4s ease-in-out 0.9s infinite'
              : 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(10px,0.8vw,12px)',
              letterSpacing: '0.2em',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Role para explorar
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            ↓
          </span>
        </div>
      </section>

      {/* ── O PROJETO ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          padding: 'clamp(72px,13vh,150px) clamp(24px,6vw,80px)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 'clamp(28px,5vw,72px)',
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 26,
                  height: 1,
                  background: 'var(--color-accent-dim)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(11px,0.9vw,13px)',
                  letterSpacing: '0.18em',
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                }}
              >
                O Projeto
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px,3.6vw,46px)',
                lineHeight: 1.18,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-primary)',
                margin: '20px 0 0',
              }}
            >
              Um observatório de bolso para o Sistema Solar.
            </h2>
          </div>
          <div style={{ paddingTop: 'clamp(4px,2vh,28px)' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 'clamp(16px,1.3vw,19px)',
                lineHeight: 1.72,
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Sidereus reúne os astros que nos cercam em uma única cena
              navegável. No lugar de tabelas e fotos estáticas, você orbita cada
              corpo celeste, compara escalas e lê os números que definem cada
              mundo — tudo em tempo real, direto no navegador.
            </p>
          </div>
        </div>
      </section>

      {/* ── RECURSOS ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--color-bg)',
          padding:
            'clamp(20px,2vh,40px) clamp(24px,6vw,80px) clamp(72px,13vh,150px)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 26,
                height: 1,
                background: 'var(--color-accent-dim)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(11px,0.9vw,13px)',
                letterSpacing: '0.18em',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
              }}
            >
              Recursos
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(238px, 1fr))',
              gap: 'clamp(14px,1.8vw,22px)',
              marginTop: 'clamp(34px,6vh,60px)',
            }}
          >
            {[
              {
                n: '01',
                title: 'Exploração em 3D',
                text: 'Aproxime, gire e orbite cada planeta com controles fluidos. A cena roda em tempo real, sem instalação.',
              },
              {
                n: '02',
                title: 'Dados reais',
                text: 'Período orbital, composição e curiosidades baseadas em medições astronômicas, prontos para consulta em cada astro.',
              },
              {
                n: '03',
                title: 'Feito para aprender',
                text: 'Uma porta de entrada visual para a astronomia — pensada tanto para a sala de aula quanto para a curiosidade de cada dia.',
              },
            ].map(({ n, title, text }) => (
              <div
                key={n}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: 'clamp(24px,2.8vw,36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition:
                    'border-color .2s ease, transform .2s ease, box-shadow .2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-accent-dim)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 0 20px rgba(232,118,26,0.08)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(12px,0.95vw,14px)',
                    letterSpacing: '0.14em',
                    color: 'var(--color-accent)',
                  }}
                >
                  {n}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(17px,1.45vw,22px)',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 'clamp(14px,1.05vw,15.5px)',
                    lineHeight: 1.62,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          padding: 'clamp(80px,15vh,160px) clamp(24px,6vw,80px)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 26,
              height: 1,
              background: 'var(--color-accent-dim)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(11px,0.9vw,13px)',
              letterSpacing: '0.18em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
            }}
          >
            Pronto para decolar?
          </span>
          <span
            style={{
              width: 26,
              height: 1,
              background: 'var(--color-accent-dim)',
              display: 'inline-block',
            }}
          />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(30px,4vw,52px)',
            lineHeight: 1.16,
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
            margin: '22px auto 0',
            maxWidth: 680,
          }}
        >
          Comece pela estrela mais próxima.
        </h2>
        <div
          style={{
            marginTop: 'clamp(34px,5vh,46px)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CtaButton
            href="/engine"
            onClick={(e) => {
              e.preventDefault();
              navigate('/engine');
            }}
          >
            Conheça os Astros <span style={{ opacity: 0.8 }}>›</span>
          </CtaButton>
        </div>
      </section>

      {/* ── FOOTER — curiosidades vindas do planets.ts ── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            padding:
              'clamp(30px,5vh,52px) clamp(24px,6vw,80px) clamp(22px,3.4vh,34px)',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 26,
                  height: 1,
                  background: 'var(--color-accent-dim)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(11px,0.9vw,13px)',
                  letterSpacing: '0.18em',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Curiosidades do cosmos
              </span>
            </div>

            <div
              style={{ marginTop: 'clamp(18px,2.8vh,26px)', minHeight: 108 }}
            >
              <div
                style={{
                  opacity: tipVisible ? 1 : 0,
                  transform: tipVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity .32s ease, transform .32s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'clamp(15px,1.25vw,19px)',
                      letterSpacing: '0.16em',
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {planet.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(10px,0.78vw,12px)',
                      letterSpacing: '0.08em',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 4,
                      padding: '3px 9px',
                    }}
                  >
                    {planet.type}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 'clamp(14px,1.15vw,17px)',
                    lineHeight: 1.65,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    maxWidth: 860,
                  }}
                >
                  {planet.description}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 18,
                flexWrap: 'wrap',
                marginTop: 'clamp(16px,2.4vh,22px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {PLANETS.map((p, i) => {
                  const active = i === displayIdx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => goTip(i)}
                      aria-label={`Ver ${p.name}`}
                      style={{
                        position: 'relative',
                        width: active ? 28 : 12,
                        height: 3,
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        overflow: 'hidden',
                        background: active
                          ? 'var(--color-accent-dim)'
                          : 'var(--color-border)',
                        transition: 'width .28s ease, background .28s ease',
                        flexShrink: 0,
                      }}
                    >
                      {active && (
                        <span
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'block',
                            background: 'var(--color-accent)',
                            borderRadius: 4,
                            width: `${progress * 100}%`,
                            transition: 'width .1s linear',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goTip((carIdxRef.current + 1) % PLANETS.length)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(11px,0.9vw,13px)',
                  letterSpacing: '0.16em',
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  transition: 'color .15s ease, gap .15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = 'var(--color-accent-warm)';
                  el.style.gap = '12px';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = 'var(--color-accent)';
                  el.style.gap = '8px';
                }}
              >
                Próxima dica <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: 'clamp(16px,2.8vh,24px) clamp(24px,6vw,80px)',
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(15px,1.3vw,18px)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.01em',
              }}
            >
              Sidereus
            </span>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(10px,0.78vw,12px)',
                letterSpacing: '0.16em',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Sistema Solar Interativo · Protótipo
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
