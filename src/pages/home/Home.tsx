import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLANETS, getPlanetById } from '../../data/planets';

const HEADLINE = 'Sidereus';
const SUBTITLE =
  'Explore os astros do nosso sistema solar de forma interativa e educativa. Mergulhe em uma experiência visual que traz a grandiosidade do cosmos para suas mãos.';
const CTA_LABEL = 'Conheça os Astros';
const STAR_SYMBOLS = ['✦', '✱', '✸'];
const CAROUSEL_SECONDS = 8;
const ROTATION_SPEED = 0.04;
const PARALLAX = 1;

// Single source of truth: the curiosities carousel reuses the same celestial-body
// data the /engine scene renders from, so descriptions stay in sync across the app.
const ASTROS = PLANETS.map((p) => ({
  name: p.name,
  kind: p.type,
  text: p.description,
}));

// The hero globe loads the very same Earth texture the engine uses for its Terra.
const EARTH_TEXTURE = getPlanetById('terra')!.texture;

/** WebGL Earth globe (engine's Terra texture) with a parallaxing star field, painted only while the hero is visible. */
function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mobile = window.innerWidth < 760;
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 4000);
    camera.position.set(0, 0, 640);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
    );
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    // lights — lit day-earth, consistent with the /engine scene
    scene.add(new THREE.AmbientLight(0x3a4456, 0.55));
    const dir = new THREE.DirectionalLight(0xfff2dc, 1.7);
    dir.position.set(1, 0.35, 0.7);
    scene.add(dir);

    // earth
    const R = 152;
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (23.5 * Math.PI) / 180;
    earthGroup.position.set(0, -150, 0);
    scene.add(earthGroup);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x223044,
      metalness: 0.05,
      roughness: 0.92,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), mat);
    earth.rotation.y = 2.4;
    earthGroup.add(earth);

    const loader = new THREE.TextureLoader();
    loader.load(EARTH_TEXTURE, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.color = new THREE.Color(0xffffff);
      mat.needsUpdate = true;
    });

    // atmosphere — single smooth blue rim on the limb
    const atmVert =
      'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vP=mv.xyz; gl_Position=projectionMatrix*mv; }';
    const atmFrag =
      'varying vec3 vN; varying vec3 vP; uniform vec3 gc; uniform float power; uniform float intensity; void main(){ vec3 vd=normalize(-vP); float f=pow(1.0-abs(dot(vN,vd)),power); gl_FragColor=vec4(gc, f*intensity); }';
    const makeAtm = (
      scale: number,
      color: number,
      power: number,
      intensity: number
    ) => {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          gc: { value: new THREE.Color(color) },
          power: { value: power },
          intensity: { value: intensity },
        },
        vertexShader: atmVert,
        fragmentShader: atmFrag,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(R * scale, 64, 64),
        m
      );
      earthGroup.add(mesh);
      return mesh;
    };
    makeAtm(1.14, 0x4f93e6, 2.7, 0.82);

    // stars — full sphere distribution; the earth depth buffer occludes those behind it
    const starGroup = new THREE.Group();
    scene.add(starGroup);
    const palette = [
      new THREE.Color(0xede9e3),
      new THREE.Color(0xede9e3),
      new THREE.Color(0xede9e3),
      new THREE.Color(0xa9c0ff),
      new THREE.Color(0xd0aef0),
      new THREE.Color(0xffd9a8),
    ];
    const makeStars = (
      count: number,
      rMin: number,
      rMax: number,
      size: number,
      opacity: number
    ) => {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let k = 0; k < count; k++) {
        const u = Math.random() * 2 - 1;
        const t = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(1 - u * u);
        const rad = rMin + Math.random() * (rMax - rMin);
        pos[k * 3] = Math.cos(t) * rr * rad;
        pos[k * 3 + 1] = u * rad;
        pos[k * 3 + 2] = Math.sin(t) * rr * rad;
        const c = palette[(Math.random() * palette.length) | 0];
        col[k * 3] = c.r;
        col[k * 3 + 1] = c.g;
        col[k * 3 + 2] = c.b;
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const m = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        depthWrite: false,
        depthTest: true,
      });
      const p = new THREE.Points(g, m);
      starGroup.add(p);
      return p;
    };
    makeStars(mobile ? 700 : 1400, 520, 980, 1.5, 0.7);
    makeStars(mobile ? 320 : 640, 360, 700, 2.3, 0.85);
    const near = makeStars(mobile ? 110 : 190, 260, 480, 3.4, 1.0);

    // interaction — parallax target
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const onResize = () => {
      const nw = el.clientWidth || window.innerWidth;
      const nh = el.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let last = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      earth.rotation.y += ROTATION_SPEED * dt;

      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      camera.position.x = cur.x * 26 * PARALLAX;
      camera.position.y = -cur.y * 16 * PARALLAX;
      near.position.x = -cur.x * 14 * PARALLAX;
      near.position.y = cur.y * 9 * PARALLAX;
      camera.lookAt(0, 0, 0);

      // only paint while the hero is on screen
      const heroH = el.clientHeight || window.innerHeight;
      if (window.scrollY < heroH + 140) renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch {
        // ignore disposal errors
      }
      if (renderer.domElement.parentNode === el)
        el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  letterSpacing: '0.16em',
  color: 'var(--color-accent)',
  textTransform: 'uppercase',
  fontSize: 'clamp(12px,0.95vw,14px)',
};

const labelTick: React.CSSProperties = {
  width: 26,
  height: 1,
  background: 'var(--color-accent-dim)',
  display: 'inline-block',
};

export function Home() {
  const navigate = useNavigate();

  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [caretLine, setCaretLine] = useState(1);
  const [caretOn, setCaretOn] = useState(true);
  const [starIdx, setStarIdx] = useState(0);

  const [carIndex, setCarIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  const carStart = useRef(0);
  const carIndexRef = useRef(0);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const goTip = (i: number) => {
    if (i === carIndexRef.current) {
      carStart.current = performance.now();
      setProgress(0);
      return;
    }
    setTipVisible(false);
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      carIndexRef.current = i;
      carStart.current = performance.now();
      setCarIndex(i);
      setProgress(0);
      setTipVisible(true);
    }, 180);
  };

  // typing effect for headline + subtitle
  useEffect(() => {
    let alive = true;
    let i = 0;
    let j = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeH = () => {
      if (!alive) return;
      setTyped1(HEADLINE.slice(0, i));
      if (i < HEADLINE.length) {
        i++;
        timers.push(setTimeout(typeH, 135));
      } else {
        timers.push(
          setTimeout(() => {
            if (!alive) return;
            setCaretLine(2);
            const typeS = () => {
              if (!alive) return;
              setTyped2(SUBTITLE.slice(0, j));
              if (j < SUBTITLE.length) {
                j++;
                timers.push(setTimeout(typeS, 22));
              } else {
                setCaretLine(1);
              }
            };
            typeS();
          }, 520)
        );
      }
    };
    typeH();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  // blinking caret + cycling star symbol
  useEffect(() => {
    const caret = setInterval(() => setCaretOn((v) => !v), 530);
    const star = setInterval(
      () => setStarIdx((v) => (v + 1) % STAR_SYMBOLS.length),
      720
    );
    return () => {
      clearInterval(caret);
      clearInterval(star);
    };
  }, []);

  // carousel progress ticker
  useEffect(() => {
    carStart.current = performance.now();
    const dur = CAROUSEL_SECONDS * 1000;
    const timer = setInterval(() => {
      const p = Math.min(1, (performance.now() - carStart.current) / dur);
      setProgress(p);
      if (p >= 1) goTip((carIndexRef.current + 1) % ASTROS.length);
    }, 60);
    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer.current);
    };
  }, []);

  const onCta = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/engine');
  };

  const astro = ASTROS[carIndex];
  const caret1 = caretLine === 1 && caretOn ? 1 : 0;
  const caret2 = caretLine === 2 && caretOn ? 1 : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          height: '100dvh',
          minHeight: 600,
          overflow: 'hidden',
        }}
      >
        <HeroGlobe />
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
                opacity: caret1,
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
              color: '#9a9186',
              margin: '20px auto 0',
              maxWidth: 540,
              minHeight: '3.3em',
              textShadow: '0 1px 16px rgba(0,0,0,0.6)',
            }}
          >
            {typed2}
            <span
              style={{
                opacity: caret2,
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
            <HeroCta starSymbol={STAR_SYMBOLS[starIdx]} onClick={onCta} />
          </div>
        </div>

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
              color: '#8a8176',
              textTransform: 'uppercase',
            }}
          >
            Role para explorar
          </span>
          <span style={{ color: '#8a8176', fontSize: 15, lineHeight: 1 }}>
            ↓
          </span>
        </div>
      </section>

      {/* O PROJETO */}
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
            gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))',
            gap: 'clamp(28px,5vw,72px)',
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={labelTick} />
              <span style={sectionLabel}>O Projeto</span>
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
                textWrap: 'balance',
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
                color: '#b8b1a6',
                margin: 0,
                textWrap: 'pretty',
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

      {/* RECURSOS */}
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
            <span style={labelTick} />
            <span style={sectionLabel}>Recursos</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(238px,1fr))',
              gap: 'clamp(16px,2vw,24px)',
              marginTop: 'clamp(34px,6vh,60px)',
            }}
          >
            <FeatureCard
              n="01"
              title="Exploração em 3D"
              text="Aproxime, gire e orbite cada planeta com controles fluidos. A cena roda em tempo real, sem instalação."
            />
            <FeatureCard
              n="02"
              title="Dados reais"
              text="Período orbital, composição e curiosidades baseadas em medições astronômicas, prontos para consulta em cada astro."
            />
            <FeatureCard
              n="03"
              title="Feito para aprender"
              text="Uma porta de entrada visual para a astronomia — pensada tanto para a sala de aula quanto para a curiosidade de cada dia."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
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
          <span style={labelTick} />
          <span style={sectionLabel}>Pronto para decolar?</span>
          <span style={labelTick} />
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
            textWrap: 'balance',
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
          <FinalCta onClick={onCta} />
        </div>
      </section>

      {/* FOOTER — curiosities carousel */}
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
              <span style={labelTick} />
              <span style={{ ...sectionLabel, color: '#8a8176' }}>
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
                    {astro.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'clamp(10px,0.8vw,12px)',
                      letterSpacing: '0.12em',
                      color: '#8a8176',
                      textTransform: 'capitalize',
                      border: '1px solid var(--color-border)',
                      borderRadius: 6,
                      padding: '4px 10px',
                    }}
                  >
                    {astro.kind}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    fontSize: 'clamp(14px,1.15vw,17px)',
                    lineHeight: 1.62,
                    color: '#b8b1a6',
                    margin: 0,
                    maxWidth: 860,
                    textWrap: 'pretty',
                  }}
                >
                  {astro.text}
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
                {ASTROS.map((_, i) => {
                  const active = i === carIndex;
                  return (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        goTip(i);
                      }}
                      aria-label={`Ver curiosidade ${i + 1}`}
                      style={{
                        width: active ? 30 : 14,
                        height: 3,
                        borderRadius: 4,
                        background: active ? '#3a2412' : 'var(--color-border)',
                        overflow: 'hidden',
                        transition: 'width .3s ease, background .3s ease',
                        cursor: 'pointer',
                        flex: '0 0 auto',
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: active ? `${progress * 100}%` : '0%',
                          background: 'var(--color-accent)',
                          borderRadius: 4,
                          transition: active ? 'width .12s linear' : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goTip((carIndex + 1) % ASTROS.length);
                }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(12px,0.95vw,14px)',
                  letterSpacing: '0.14em',
                  color: 'var(--color-accent)',
                  textTransform: 'capitalize',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                Próxima dica<span>→</span>
              </a>
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

function HeroCta({
  starSymbol,
  onClick,
}: {
  starSymbol: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <a
      href="#"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        background: 'var(--color-accent)',
        color: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(16px,1.35vw,20px)',
        letterSpacing: '0.1em',
        textTransform: 'capitalize',
        padding: '18px 44px',
        borderRadius: 10,
        border: '1px solid var(--color-accent-warm)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        filter: hover ? 'brightness(1.12)' : 'none',
        transform: active
          ? 'translateY(0)'
          : hover
            ? 'translateY(-2px)'
            : 'translateY(0)',
        textShadow: hover ? '0 0 14px rgba(244,163,64,0.85)' : 'none',
        boxShadow: active
          ? '0 0 14px rgba(232,118,26,0.4)'
          : hover
            ? '0 0 32px rgba(232,118,26,0.55), 0 0 8px #f4a340'
            : '0 0 0 rgba(232,118,26,0), 0 2px 16px rgba(0,0,0,0.4)',
        transition:
          'box-shadow .22s ease, filter .22s ease, transform .22s ease, text-shadow .22s ease',
      }}
    >
      {CTA_LABEL}
      <span style={{ fontSize: '1.15em', lineHeight: 1 }}>{starSymbol}</span>
    </a>
  );
}

function FinalCta({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <a
      href="#"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        background: 'var(--color-accent)',
        color: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(12px,1vw,14px)',
        letterSpacing: '0.12em',
        textTransform: 'capitalize',
        padding: '18px 42px',
        borderRadius: 10,
        border: '1px solid var(--color-accent-warm)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        filter: hover ? 'brightness(1.12)' : 'none',
        transform: active
          ? 'translateY(0)'
          : hover
            ? 'translateY(-1px)'
            : 'translateY(0)',
        boxShadow: active
          ? '0 0 14px rgba(232,118,26,0.4)'
          : hover
            ? '0 0 28px rgba(232,118,26,0.5), 0 0 6px #f4a340'
            : '0 0 0 rgba(232,118,26,0), 0 2px 16px rgba(0,0,0,0.4)',
        transition:
          'box-shadow .18s ease, filter .18s ease, transform .18s ease',
      }}
    >
      {CTA_LABEL}
      <span style={{ opacity: 0.85 }}>›</span>
    </a>
  );
}

function FeatureCard({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${hover ? 'var(--color-accent-dim)' : 'var(--color-border)'}`,
        borderRadius: 8,
        padding: 'clamp(26px,3vw,38px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? '0 0 22px rgba(232,118,26,0.1)' : 'none',
        transition:
          'border-color .2s ease, transform .2s ease, box-shadow .2s ease',
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
          color: '#8a8176',
          margin: 0,
          textWrap: 'pretty',
        }}
      >
        {text}
      </p>
    </div>
  );
}
