import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroEarth } from '../../components/HeroEarth';
import { PLANETS } from '../../data/planets';

const HEADLINE = 'Sidereus';
const SUBTITLE =
  'Explore os astros do nosso sistema solar de forma interativa e educativa. Mergulhe em uma experiência visual que traz a grandiosidade do cosmos para suas mãos.';
const STAR_SYMBOLS = ['✦', '✱', '✸'] as const;

export function Home() {
  const navigate = useNavigate();

  // Typing animation
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [caretLine, setCaretLine] = useState<1 | 2>(1);
  const [caretOn, setCaretOn] = useState(true);
  const [starIdx, setStarIdx] = useState(0);

  // Curiosities carousel — data comes from the same planets.ts used by the engine
  const [displayIdx, setDisplayIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  const mountedRef = useRef(true);
  const carIdxRef = useRef(0);
  const carStartRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Typing effect — caretLine initialises to 1 in state, no synchronous setState needed
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    let j = 0;

    const typeH = () => {
      if (!mountedRef.current) return;
      setTyped1(HEADLINE.slice(0, i));
      if (i < HEADLINE.length) {
        i++;
        t = setTimeout(typeH, 135);
      } else {
        t = setTimeout(() => {
          if (!mountedRef.current) return;
          setCaretLine(2);
          const typeS = () => {
            if (!mountedRef.current) return;
            setTyped2(SUBTITLE.slice(0, j));
            if (j < SUBTITLE.length) {
              j++;
              t = setTimeout(typeS, 22);
            } else {
              setCaretLine(1);
            }
          };
          typeS();
        }, 520);
      }
    };

    typeH();
    return () => clearTimeout(t);
  }, []);

  // Caret blink
  useEffect(() => {
    const id = setInterval(
      () => mountedRef.current && setCaretOn((v) => !v),
      530
    );
    return () => clearInterval(id);
  }, []);

  // Star symbol cycle
  useEffect(() => {
    const id = setInterval(
      () => mountedRef.current && setStarIdx((v) => (v + 1) % 3),
      720
    );
    return () => clearInterval(id);
  }, []);

  // Tip transition — only uses refs and stable setState, no state deps needed
  const goTip = useCallback((i: number) => {
    if (i === carIdxRef.current) {
      carStartRef.current = performance.now();
      setProgress(0);
      return;
    }
    setTipVisible(false);
    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      carIdxRef.current = i;
      carStartRef.current = performance.now();
      setDisplayIdx(i);
      setProgress(0);
      setTipVisible(true);
    }, 180);
  }, []);

  // Carousel auto-advance — start time is set when the effect mounts (not during render)
  useEffect(() => {
    carStartRef.current = performance.now();
    const id = setInterval(() => {
      if (!mountedRef.current) return;
      const p = Math.min(1, (performance.now() - carStartRef.current) / 8000);
      setProgress(p);
      if (p >= 1) goTip((carIdxRef.current + 1) % PLANETS.length);
    }, 60);
    return () => clearInterval(id);
  }, [goTip]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      mountedRef.current = false;
      clearTimeout(fadeTimerRef.current);
    },
    []
  );

  const planet = PLANETS[displayIdx];
  const caret1On = caretLine === 1 && caretOn;
  const caret2On = caretLine === 2 && caretOn;

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
        {/* Real 3D Earth — reuses texture from planets.ts and R3F pipeline */}
        <HeroEarth />

        {/* Radial vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'radial-gradient(125% 95% at 50% 64%, rgba(12,11,9,0) 38%, rgba(12,11,9,0.5) 100%)',
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
              'linear-gradient(180deg, rgba(12,11,9,0.72) 0%, rgba(12,11,9,0) 26%, rgba(12,11,9,0) 64%, rgba(12,11,9,0.96) 100%)',
          }}
        />

        {/* Hero copy */}
        <div
          style={{
            position: 'absolute',
            zIndex: 5,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-52%)',
            width: 'min(760px,90vw)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(54px,8vw,116px)',
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.08,
              textShadow: '0 2px 48px rgba(0,0,0,0.9)',
            }}
          >
            {typed1}
            <span
              style={{
                opacity: caret1On ? 1 : 0,
                color: 'var(--color-accent)',
                marginLeft: 1,
                transition: 'opacity .1s',
              }}
            >
              ▍
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(14px,1.2vw,18px)',
              lineHeight: 1.66,
              color: 'var(--color-text-secondary)',
              margin: '20px auto 0',
              maxWidth: 540,
              minHeight: '3.3em',
              textShadow: '0 1px 16px rgba(0,0,0,0.6)',
            }}
          >
            {typed2}
            <span
              style={{
                opacity: caret2On ? 1 : 0,
                color: 'var(--color-accent)',
                marginLeft: 1,
                transition: 'opacity .1s',
              }}
            >
              ▍
            </span>
          </p>

          <div
            style={{
              marginTop: 'clamp(30px,4.4vh,46px)',
              pointerEvents: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <a
              href="/engine"
              onClick={(e) => {
                e.preventDefault();
                navigate('/engine');
              }}
              style={{
                background: 'var(--color-accent)',
                color: '#0c0b09',
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(16px,1.35vw,20px)',
                letterSpacing: '0.1em',
                textTransform: 'capitalize',
                padding: '18px 44px',
                borderRadius: '10px',
                border: '1px solid var(--color-accent-warm)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
                transition:
                  'box-shadow .22s ease, filter .22s ease, transform .22s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.filter = 'brightness(1.12)';
                el.style.boxShadow =
                  '0 0 32px rgba(232,118,26,0.55), 0 0 8px #f4a340';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.filter = '';
                el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
                el.style.transform = '';
              }}
            >
              Conheça os Astros
              <span style={{ fontSize: '1.15em', lineHeight: 1 }}>
                {STAR_SYMBOLS[starIdx]}
              </span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 'clamp(20px,3.4vh,38px)',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 9,
            pointerEvents: 'none',
            animation: 'sid-bob 2.4s ease-in-out infinite',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(11px,0.85vw,13px)',
              letterSpacing: '0.18em',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Role para explorar
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>
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
                  fontSize: 'clamp(12px,0.95vw,14px)',
                  letterSpacing: '0.16em',
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
                fontSize: 'clamp(12px,0.95vw,14px)',
                letterSpacing: '0.16em',
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
              gap: 'clamp(16px,2vw,24px)',
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
                  borderRadius: 8,
                  padding: 'clamp(26px,3vw,38px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  transition:
                    'border-color .2s ease, transform .2s ease, box-shadow .2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--color-accent-dim)';
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = '0 0 22px rgba(232,118,26,0.1)';
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
                    fontSize: 'clamp(14px,1.1vw,17px)',
                    letterSpacing: '0.12em',
                    color: 'var(--color-accent)',
                  }}
                >
                  {n}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(18px,1.55vw,23px)',
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
              fontSize: 'clamp(12px,0.95vw,14px)',
              letterSpacing: '0.16em',
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
          <a
            href="/engine"
            onClick={(e) => {
              e.preventDefault();
              navigate('/engine');
            }}
            style={{
              background: 'var(--color-accent)',
              color: '#0c0b09',
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(12px,1vw,14px)',
              letterSpacing: '0.12em',
              textTransform: 'capitalize',
              padding: '18px 42px',
              borderRadius: '10px',
              border: '1px solid var(--color-accent-warm)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              transition:
                'box-shadow .18s ease, filter .18s ease, transform .18s ease',
              boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = 'brightness(1.12)';
              el.style.boxShadow =
                '0 0 28px rgba(232,118,26,0.5), 0 0 6px #f4a340';
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.filter = '';
              el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
              el.style.transform = '';
            }}
          >
            Conheça os Astros <span style={{ opacity: 0.85 }}>›</span>
          </a>
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
                  fontSize: 'clamp(12px,0.95vw,14px)',
                  letterSpacing: '0.16em',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Curiosidades do cosmos
              </span>
            </div>

            <div style={{ marginTop: 'clamp(16px,2.6vh,24px)', minHeight: 96 }}>
              <div
                style={{
                  opacity: tipVisible ? 1 : 0,
                  transform: tipVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity .35s ease, transform .35s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginBottom: 11,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'clamp(16px,1.3vw,20px)',
                      letterSpacing: '0.14em',
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {planet.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'clamp(10px,0.8vw,12px)',
                      letterSpacing: '0.12em',
                      color: 'var(--color-text-secondary)',
                      textTransform: 'capitalize',
                      border: '1px solid var(--color-border)',
                      borderRadius: 6,
                      padding: '4px 10px',
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
                    lineHeight: 1.62,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {PLANETS.map((p, i) => {
                  const active = i === displayIdx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => goTip(i)}
                      aria-label={`Ver ${p.name}`}
                      style={{
                        position: 'relative',
                        width: active ? 30 : 14,
                        height: 3,
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        overflow: 'hidden',
                        background: active
                          ? 'var(--color-accent-dim)'
                          : 'var(--color-border)',
                        transition: 'width .3s ease, background .3s ease',
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
                            transition: 'width .12s linear',
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
                  fontSize: 'clamp(12px,0.95vw,14px)',
                  letterSpacing: '0.14em',
                  color: 'var(--color-accent)',
                  textTransform: 'capitalize',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
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
                  el.style.gap = '13px';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = 'var(--color-accent)';
                  el.style.gap = '9px';
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
            padding: 'clamp(18px,3vh,26px) clamp(24px,6vw,80px)',
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
                fontSize: 'clamp(16px,1.4vw,19px)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.005em',
              }}
            >
              Sidereus
            </span>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(10px,0.8vw,12px)',
                letterSpacing: '0.16em',
                color: 'var(--color-text-muted)',
                textTransform: 'capitalize',
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
