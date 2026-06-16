# Identidade Visual — Sidereus

> **Versão 1.2 · MVP**  
> Referência visual oficial do projeto. Todos os componentes de UI devem seguir este guia.  
> Se algo precisar ser revisado, abra uma discussão antes de alterar.

---

![Preview](/public/preview.png)

## 1. Direção criativa

**Espacial gamificado** — a estética do Sidereus parte do espaço como cenário e abraça a linguagem visual de jogos retro: pixel fonts, animações de interação expressivas, feedback visual imediato. Não é um dashboard científico frio, nem um site infantil de astronomia. É a sensação de explorar o cosmos em um jogo — preciso nos dados, expressivo na interação.

A interface tem duas camadas de linguagem visual que coexistem:
- **Interface / HUD** — títulos, labels, CTAs: Dogica (pixel), o marcador visual mais forte da identidade gamificada
- **Leitura / dados contextuais** — descrições e valores numéricos: lenia-mono-demo (serifada mono, legível em blocos)
- **Labels e metadados** — unidades, rótulos de campo, HUD técnico: Xanmono (geométrica, marcante)

### Animações de interação (obrigatórias)

- **Text streaming**: títulos e descrições entram caractere a caractere (efeito "digitando") — 30–60ms por char
- **Flash no hover de CTAs**: botões principais pulsam com brilho (`brightness` + `box-shadow`) ao receber hover
- **Terra girando na landing page**: canvas Three.js com `Earth.tsx` existente em `autoRotate`
- **Pós-processamento 3D**: `Bloom` no Sol, `Vignette` global, `Scanlines` sutis para reforçar o estilo CRT/retro — via `@react-three/postprocessing`

---

## 2. Paleta de cores

### 2.1 Cores base

| Token               | Hex       | Uso                                                   |
| ------------------- | --------- | ----------------------------------------------------- |
| `--color-bg`        | `#0C0B09` | Fundo global da aplicação (neutro escuro quente)      |
| `--color-surface`   | `#141210` | Superfícies elevadas (painel lateral, modais, HUD)    |
| `--color-surface-2` | `#1C1A17` | Superfícies de segundo nível (hover de cards, inputs) |
| `--color-border`    | `#2A2620` | Bordas sutis de separação                             |

> Fundos neutros quentes (marrom muito escuro) em vez de azul-escuro — respiram junto com o accent âmbar sem competir.

### 2.2 Texto

| Token                    | Hex       | Uso                                           |
| ------------------------ | --------- | --------------------------------------------- |
| `--color-text-primary`   | `#EDE9E3` | Títulos, labels principais, nomes de planetas |
| `--color-text-secondary` | `#8A8176` | Dados secundários, descrições, metadados      |
| `--color-text-muted`     | `#4A4540` | Placeholders, rótulos desabilitados           |

> Texto primário levemente creme — nunca branco puro.

### 2.3 Destaque (accent)

| Token                 | Hex                        | Uso                                                        |
| --------------------- | -------------------------- | ---------------------------------------------------------- |
| `--color-accent`      | `#E8761A`                  | CTA principal, estado selecionado, highlights ativos       |
| `--color-accent-warm` | `#F4A340`                  | Hover do accent, glow de botão, flash de interação         |
| `--color-accent-dim`  | `#6B3510`                  | Accent em baixa intensidade (badge, borda de estado ativo) |
| `--color-accent-glow` | `rgba(232, 118, 26, 0.18)` | Glow/sombra suave em elementos com accent                  |

> Reservar o accent para significado (ativo, selecionado, CTA). No flash de hover, o `--color-accent-warm` pode aparecer brevemente como pico de brilho.

### 2.4 Estados semânticos

| Token             | Hex       | Uso                      |
| ----------------- | --------- | ------------------------ |
| `--color-success` | `#3DAB7B` | Confirmações, status OK  |
| `--color-warning` | `#D4882A` | Alertas não críticos     |
| `--color-error`   | `#C04A3F` | Erros, estados inválidos |

---

## 3. Tipografia

> **v1.2 — mudança:** sistema de três famílias customizadas, todas locais (`src/assets/fonts/`). A direção gamificada usa pixel font para display e fontes mono para todo o resto — sem serif clássica.

### 3.1 Famílias

| Papel               | Fonte             | Fallback              | Uso                                                     |
| ------------------- | ----------------- | --------------------- | ------------------------------------------------------- |
| **Display / UI**    | `Dogica`          | `'Press Start 2P'`    | Nome do produto, títulos de seção, texto do CTA         |
| **Leitura / Corpo** | `lenia-mono-demo` | `'Courier Prime'`     | Descrições de planetas, textos corridos, painéis de info|
| **Labels / Dados**  | `Xanmono`         | `'IBM Plex Mono'`     | Valores numéricos, unidades, labels de HUD, metadados   |

> **Dogica** é a fonte que define o tom gamificado — usar somente em textos curtos (títulos, botões, labels de até ~4 palavras). Em parágrafos, fica ilegível.
>
> **lenia-mono-demo** tem serifas dentro de grade mono — mantém o ritmo técnico mas com conforto de leitura. Ideal para blocos de descrição.
>
> **Xanmono** é geométrica e marcante — funciona bem em tamanhos menores para dados estruturados e HUD.

### 3.2 Escala de tamanhos

| Token             | Tamanho   | Peso | Família           | Uso                                             |
| ----------------- | --------- | ---- | ----------------- | ----------------------------------------------- |
| `--text-display`  | 2.5rem    | 700  | Dogica            | Nome do produto na tela inicial                 |
| `--text-title`    | 1.25rem   | 700  | Dogica            | Título do painel de planeta, seções da HUD      |
| `--text-subtitle` | 0.9375rem | 400  | lenia-mono-demo   | Subtítulos de seção, tipo de planeta            |
| `--text-body`     | 0.875rem  | 400  | lenia-mono-demo   | Descrições, textos de leitura no painel         |
| `--text-data`     | 0.875rem  | 400  | Xanmono           | Valores numéricos (distância, período orbital)  |
| `--text-label`    | 0.6875rem | 400  | Xanmono           | Labels de HUD, rótulos de campo                 |
| `--text-micro`    | 0.625rem  | 300  | Xanmono           | Unidades de medida, metadados                   |

> Dogica tem kerning generoso — em `--text-display`, aplicar `letter-spacing: 0.05em` para respirar. Em tamanhos menores que 0.75rem ela perde legibilidade — descer para Xanmono nesses casos.

### 3.3 Hierarquia de exemplo (painel de planeta)

```
MARTE                              ← text-title, Dogica, accent
Planeta Rochoso                    ← text-subtitle, lenia-mono-demo, text-secondary

Distância ao Sol                   ← text-label, Xanmono, text-muted
227,9 milhões km                   ← text-data, Xanmono, text-primary

Sobre Marte                        ← text-subtitle, lenia-mono-demo, text-secondary
"Marte é o quarto planeta..."      ← text-body, lenia-mono-demo, text-primary

Período Orbital                    ← text-label, Xanmono, text-muted
687 dias terrestres                ← text-data, Xanmono, text-primary
```

---

## 4. Linguagem de componentes

### 4.1 Bordas e raios

| Elemento                | Border radius |
| ----------------------- | ------------- |
| Painel lateral / modais | `4px`         |
| Botões                  | `2px`         |
| Badges / tags           | `1px`         |
| Inputs                  | `2px`         |
| Tooltips                | `1px`         |

> Cantos quase retos — coerentes com estética pixel/retro. Evitar qualquer arredondamento maior que 6px.

### 4.2 Bordas

- Bordas padrão: `1px solid var(--color-border)` → `#2A2620`
- Estado ativo/selecionado: `1px solid var(--color-accent-dim)` + box-shadow de glow
- Nunca usar `border: none` em elementos interativos — a borda define a presença do componente

### 4.3 Sombras, elevação e glow

```css
/* Nível 1 — painéis flutuantes */
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);

/* Nível 2 — modais, overlays */
box-shadow: 0 8px 40px rgba(0, 0, 0, 0.75);

/* Glow accent — elemento selecionado */
box-shadow: 0 0 14px var(--color-accent-glow);

/* Flash de hover em CTA — estado transitório */
box-shadow: 0 0 28px var(--color-accent-glow), 0 0 6px var(--color-accent-warm);
```

### 4.4 Animações de interação

```css
/* Flash de hover em botão CTA */
@keyframes cta-flash {
  0%   { box-shadow: 0 0 0 transparent; filter: brightness(1); }
  40%  { box-shadow: 0 0 28px var(--color-accent-glow); filter: brightness(1.2); }
  100% { box-shadow: 0 0 14px var(--color-accent-glow); filter: brightness(1.05); }
}
.cta-button:hover { animation: cta-flash 180ms ease-out forwards; }

/* Text streaming — aplicar via JS, não CSS puro */
/* Revelar um char a cada 35–55ms; cursor piscante após completar */
```

### 4.5 Espaçamento

Escala de 4px como base:

| Token        | Valor | Uso típico                                   |
| ------------ | ----- | -------------------------------------------- |
| `--space-1`  | 4px   | Gap interno mínimo                           |
| `--space-2`  | 8px   | Padding de labels, gaps                      |
| `--space-3`  | 12px  | Padding interno de botões                    |
| `--space-4`  | 16px  | Padding de painéis                           |
| `--space-6`  | 24px  | Separação entre seções                       |
| `--space-8`  | 32px  | Margens maiores                              |
| `--space-12` | 48px  | Separação entre blocos de conteúdo no painel |

### 4.6 Opacidade e camadas

- Overlays de fundo: `rgba(12, 11, 9, 0.88)`
- Superfícies sobre a cena 3D: `backdrop-filter: blur(10px)` sempre que possível
- Elementos desabilitados: `opacity: 0.38`

---

## 5. Estados de interação

| Estado   | Tratamento visual                                                                     |
| -------- | ------------------------------------------------------------------------------------- |
| Default  | Cor base, borda `--color-border`                                                      |
| Hover    | Background sobe para `--color-surface-2`; em CTAs: flash de glow (ver §4.4)          |
| Active   | Background `--color-surface-2` + borda `--color-accent-dim` + glow suave             |
| Focus    | Outline `2px solid var(--color-accent)` com offset `2px`                             |
| Disabled | `opacity: 0.38`, `cursor: not-allowed`                                                |
| Selected | Background sutil com accent, label em `--color-accent`                                |

---

## 6. Pós-processamento 3D

Aplicado via `@react-three/postprocessing` dentro do `<Canvas>` do `/engine`:

| Efeito              | Config recomendada                                         | Objetivo                           |
| ------------------- | ---------------------------------------------------------- | ---------------------------------- |
| `Bloom`             | `intensity: 0.5`, `luminanceThreshold: 0.55`              | Glow no Sol e planetas iluminados  |
| `Vignette`          | `darkness: 0.45`, `offset: 0.4`                           | Profundidade, foco no centro       |
| `Scanlines`         | `density: 1.2`, `opacity: 0.08`                           | Textura CRT sutil, reforça o retro |
| `ChromaticAberration` | `offset: [0.0008, 0.0008]`                              | Aberração óptica leve nas bordas   |

> Scanlines e ChromaticAberration devem ser sutis — visíveis ao procurar, não perturbadores. Testar em mobile: desabilitar ChromaticAberration em viewports < 768px se houver queda de performance.

---

## 7. Variáveis CSS — referência completa

```css
:root {
  /* Background (neutros quentes escuros) */
  --color-bg: #0c0b09;
  --color-surface: #141210;
  --color-surface-2: #1c1a17;
  --color-border: #2a2620;

  /* Texto */
  --color-text-primary: #ede9e3;
  --color-text-secondary: #8a8176;
  --color-text-muted: #4a4540;

  /* Accent âmbar */
  --color-accent: #e8761a;
  --color-accent-warm: #f4a340;
  --color-accent-dim: #6b3510;
  --color-accent-glow: rgba(232, 118, 26, 0.18);

  /* Semântico */
  --color-success: #3dab7b;
  --color-warning: #d4882a;
  --color-error: #c04a3f;

  /* Tipografia */
  --font-display: 'Dogica', 'Press Start 2P', monospace;
  --font-body: 'lenia-mono-demo', 'Courier Prime', monospace;
  --font-data: 'Xanmono', 'IBM Plex Mono', monospace;

  /* Escala */
  --text-display: 2.5rem;
  --text-title: 1.25rem;
  --text-subtitle: 0.9375rem;
  --text-body: 0.875rem;
  --text-data: 0.875rem;
  --text-label: 0.6875rem;
  --text-micro: 0.625rem;

  /* Espaçamento */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Raios */
  --radius-sm: 1px;
  --radius-md: 2px;
  --radius-lg: 4px;
}
```

---

## 8. O que evitar

- **Azul como tom de fundo** — os neutros quentes são intencionais e não negociáveis.
- **Roxo/violeta** — fora da identidade.
- **Branco puro (`#FFFFFF`)** — usar `--color-text-primary` (`#EDE9E3`).
- **Dogica em textos longos** — pixel font em parágrafos é ilegível. Máximo de ~6 palavras por instância.
- **Gradientes horizontais coloridos como decoração** — se usar gradiente, radial e sutil, centrado no accent.
- **Border radius maior que 6px** — cantos retos são parte da estética pixel.
- **Scanlines ou ChromaticAberration em intensidade alta** — o efeito deve ser subliminar, não o ponto focal.

---

## 9. Referências de moodboard

- **Logo Sidereus** — referência primária: âmbar sobre fundo neutro escuro, linguagem técnica-astronômica.
- **NASA Eyes on the Solar System** — densidade de dados com interface espacial.
- **Estética CRT/retrogaming** — scanlines, pixel fonts, flash de interação, texto "digitando".

---

## 10. Aprovação

> Preencher antes do início do Sprint 1. Aprovação do time completo é critério de aceite desta issue.
