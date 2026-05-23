import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const ASTRO_CURIOSITIES = [
  {
    title: 'SOL',
    fact: 'O Sol contém 99,86% de toda a massa do Sistema Solar. A cada segundo, converte 620 milhões de toneladas de hidrogênio em hélio.',
  },
  {
    title: 'MERCÚRIO',
    fact: 'Mercúrio é o planeta mais rápido do Sistema Solar, orbitando o Sol a cada 88 dias terrestres. Apesar de ser o mais próximo do Sol, não é o mais quente.',
  },
  {
    title: 'VÊNUS',
    fact: 'Vênus é o planeta mais quente do Sistema Solar com temperaturas de até 462°C. Sua atmosfera é 92 vezes mais densa que a da Terra.',
  },
  {
    title: 'TERRA',
    fact: 'A Terra é o único planeta conhecido com vida. Nosso planeta completa uma volta ao redor do Sol a cada 365,25 dias.',
  },
  {
    title: 'MARTE',
    fact: 'Marte é conhecido como o "Planeta Vermelho" devido ao óxido de ferro em sua superfície. Um dia em Marte dura 24 horas e 37 minutos.',
  },
  {
    title: 'JÚPITER',
    fact: 'Júpiter é o maior planeta do Sistema Solar. Uma tempestade chamada Grande Mancha Vermelha roda em sua atmosfera há mais de 300 anos.',
  },
  {
    title: 'SATURNO',
    fact: 'Saturno é famoso por seus anéis deslumbrantes, compostos por bilhões de partículas de gelo e rocha. É o segundo maior planeta.',
  },
  {
    title: 'URANO',
    fact: 'Urano rotaciona de lado, provavelmente devido a uma colisão há bilhões de anos. Tem uma cor azul-verde devido ao metano em sua atmosfera.',
  },
  {
    title: 'NETUNO',
    fact: 'Netuno é o planeta mais distante do Sol e tem os ventos mais fortes do Sistema Solar, atingindo 2.100 km/h.',
  },
  {
    title: 'SISTEMA SOLAR',
    fact: 'O Sistema Solar tem aproximadamente 4,6 bilhões de anos. Toda a vida que conhecemos existe em um raio de apenas 4,37 anos-luz.',
  },
];

export function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentCuriosityIndex, setCurrentCuriosityIndex] = useState(0);

  // Rotacionar curiosidades
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCuriosityIndex((prev) => (prev + 1) % ASTRO_CURIOSITIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Animação de estrelas de fundo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawStars = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.6;

      for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillRect(x, y, size, size);
      }

      ctx.globalAlpha = 1;
    };

    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const currentCuriosity = ASTRO_CURIOSITIES[currentCuriosityIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col">
      {/* Canvas de fundo com estrelas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />

      {/* Conteúdo principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8">
        {/* Header com menu */}
        <div className="w-full flex justify-between items-center mb-12 md:mb-16 absolute top-8 md:top-12">
          {/* Logo/Título à esquerda */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-mono font-bold text-white tracking-wider">
              Sidereus
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-mono italic">
              Sistema Solar Interativo
            </p>
          </div>
        </div>

        {/* Descrição principal */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl">
          <p className="text-gray-300 text-sm md:text-lg font-mono leading-relaxed mb-8">
            Visualização Interativa do Sistema Solar
          </p>
          <p className="text-gray-400 text-xs md:text-base font-mono leading-relaxed">
            Explore os astros do nosso sistema solar de forma interativa e
            educativa. Mergulhe em uma experiência visual que traz a
            grandiosidade do cosmos para suas mãos.
          </p>
        </div>

        {/* CTA Principal - Botão grande */}
        <button
          onClick={() => navigate('/engine')}
          className="px-10 md:px-16 py-4 md:py-6 bg-orange-500 hover:bg-orange-600 text-black font-mono font-bold text-base md:text-2xl rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
        >
          CONHEÇA OS ASTROS
        </button>
      </div>

      {/* Curiosidade na base - Estilo "Death Screen" */}
      <div className="relative z-20 bg-gradient-to-b from-transparent to-black border-t border-gray-700 px-4 md:px-8 py-4 md:py-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          {/* Título da curiosidade */}
          <div className="mb-2 md:mb-3">
            <h3 className="text-orange-500 text-xs md:text-sm font-mono font-bold uppercase tracking-wider">
              {currentCuriosity.title}
            </h3>
          </div>

          {/* Texto da curiosidade */}
          <p className="text-gray-300 text-xs md:text-sm font-mono leading-relaxed mb-3 md:mb-4">
            {currentCuriosity.fact}
          </p>

          {/* Controles - Próxima curiosidade */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {ASTRO_CURIOSITIES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-2 rounded-full transition-all duration-300 ${
                    index === currentCuriosityIndex
                      ? 'bg-orange-500 w-4'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentCuriosityIndex(
                  (prev) => (prev + 1) % ASTRO_CURIOSITIES.length
                )
              }
              className="ml-auto text-orange-500 hover:text-orange-400 text-xs md:text-sm font-mono font-bold transition flex items-center gap-2"
            >
              PRÓXIMA DICA
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Efeito de orbs no fundo */}
      <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-orange-500 opacity-5 blur-3xl" />
      <div className="absolute bottom-40 left-5 w-40 h-40 md:w-64 md:h-64 rounded-full bg-blue-500 opacity-5 blur-3xl" />
    </div>
  );
}
