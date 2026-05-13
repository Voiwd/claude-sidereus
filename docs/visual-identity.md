# Identidade Visual — Sidereus

> **Versão 1.1 · MVP**  
> Referência visual oficial do projeto. Todos os componentes de UI devem seguir este guia.  
> Se algo precisar ser revisado, abra uma discussão antes de alterar.

---

![Preview](/public/preview.png)

## 1. Direção criativa

**Espacial poético** — a estética do Sidereus não é um painel de controle técnico, nem um site infantil de astronomia. É a sensação de olhar para o céu noturno com curiosidade: atmosférica, com profundidade, rica em contraste. Cada elemento de UI deve parecer que pertence a esse espaço — preciso quando em modo de dados, expressivo quando ativado.

A interface tem duas camadas de linguagem visual que coexistem: **interface/código** (labels, HUD, dados estruturados — tipografia display mono) e **leitura científica** (descrições, painéis de informação — tipografia serifada confortável). Essa dualidade é intencional e deve ser respeitada nos componentes.

---

## 2. Paleta de cores

> **v1.1 — mudança:** fundos revisados para menos azul. A nova paleta usa neutros quentes/escuros que harmonizam com o âmbar do logo sem criar tensão cromática com o laranja-accent.

### 2.1 Cores base

| Token               | Hex       | Uso                                                   |
| ------------------- | --------- | ----------------------------------------------------- |
| `--color-bg`        | `#0C0B09` | Fundo global da aplicação (neutro escuro quente)      |
| `--color-surface`   | `#141210` | Superfícies elevadas (painel lateral, modais, HUD)    |
| `--color-surface-2` | `#1C1A17` | Superfícies de segundo nível (hover de cards, inputs) |
| `--color-border`    | `#2A2620` | Bordas sutis de separação                             |

> **Lógica:** fundos agora são neutros quentes (marrom muito escuro, quase preto) em vez de azul-escuro. Isso cria uma base que "respira" junto com o accent âmbar, sem competir. A sensação de espaço vem da escuridão profunda, não da tonalidade azulada.

### 2.2 Texto

| Token                    | Hex       | Uso                                           |
| ------------------------ | --------- | --------------------------------------------- |
| `--color-text-primary`   | `#EDE9E3` | Títulos, labels principais, nomes de planetas |
| `--color-text-secondary` | `#8A8176` | Dados secundários, descrições, metadados      |
| `--color-text-muted`     | `#4A4540` | Placeholders, rótulos desabilitados           |

> Texto primário levemente creme (não branco puro) — mais confortável para leitura longa e alinhado com a paleta quente.

### 2.3 Destaque (accent)

| Token                 | Hex                        | Uso                                                        |
| --------------------- | -------------------------- | ---------------------------------------------------------- |
| `--color-accent`      | `#E8761A`                  | CTA principal, estado selecionado, highlights ativos       |
| `--color-accent-warm` | `#F4A340`                  | Hover do accent, variação suave para gradientes            |
| `--color-accent-dim`  | `#6B3510`                  | Accent em baixa intensidade (badge, borda de estado ativo) |
| `--color-accent-glow` | `rgba(232, 118, 26, 0.18)` | Glow/sombra suave em elementos com accent                  |

> Reservar o accent estritamente para significado (ativo, selecionado, CTA). Não usar como decoração.

### 2.4 Estados semânticos

| Token             | Hex       | Uso                      |
| ----------------- | --------- | ------------------------ |
| `--color-success` | `#3DAB7B` | Confirmações, status OK  |
| `--color-warning` | `#D4882A` | Alertas não críticos     |
| `--color-error`   | `#C04A3F` | Erros, estados inválidos |

---

## 3. Tipografia

> **v1.1 — mudança:** sistema de três famílias com papéis distintos. Títulos e UI: mono com personalidade (CS Daine Mono / substituto). Leitura e descrições: serifada confortável. Dados inline e labels: mono limpa.

### 3.1 Famílias

| Papel               | Família primária | Substituto Google Fonts | Uso                                            |
| ------------------- | ---------------- | ----------------------- | ---------------------------------------------- |
| **Display / UI**    | `CS Daine Mono`  | `Courier Prime`         | Nome do produto, títulos de painel, HUD labels |
| **Leitura / Corpo** | `Source Serif 4` | `Source Serif 4`        | Descrições, textos longos, dados contextuais   |
| **Dados inline**    | `IBM Plex Mono`  | `IBM Plex Mono`         | Valores numéricos, unidades, metadados         |

> **CS Daine Mono** é a fonte do logo.
>
> **Source Serif 4** é gratuita no Google Fonts e tem excelente legibilidade em corpos de texto — mesmo espírito serifado confortável do claude.ai.

### 3.2 Escala de tamanhos

| Token             | Tamanho   | Peso | Família        | Uso                                            |
| ----------------- | --------- | ---- | -------------- | ---------------------------------------------- |
| `--text-display`  | 2.5rem    | 700  | Display (mono) | Nome do produto na tela inicial                |
| `--text-title`    | 1.375rem  | 700  | Display (mono) | Título do painel de planeta, seções da HUD     |
| `--text-subtitle` | 1rem      | 600  | Serif          | Subtítulos de seção, tipo de planeta           |
| `--text-body`     | 0.9375rem | 400  | Serif          | Descrições, textos de leitura no painel        |
| `--text-data`     | 0.875rem  | 400  | Mono dados     | Valores numéricos (distância, período orbital) |
| `--text-label`    | 0.6875rem | 400  | Mono dados     | Labels de HUD, rótulos de campo                |
| `--text-micro`    | 0.625rem  | 300  | Mono dados     | Unidades de medida, metadados                  |

### 3.3 Hierarquia de exemplo (painel de planeta)

```
MARTE                              ← text-title, Display mono, accent
Planeta Rochoso                    ← text-subtitle, Serif, text-secondary

Distância ao Sol                   ← text-label, Mono dados, text-muted
227,9 milhões km                   ← text-data, Mono dados, text-primary

Sobre Marte                        ← text-subtitle, Serif, text-secondary
"Marte é o quarto planeta..."      ← text-body, Serif, text-primary (leitura confortável)

Período Orbital                    ← text-label, Mono dados, text-muted
687 dias terrestres                ← text-data, Mono dados, text-primary
```

> A troca de família entre dado e descrição é intencional — cria ritmo visual e sinaliza ao leitor quando está consumindo dado estruturado vs. texto corrido.

---

## 4. Linguagem de componentes

### 4.1 Bordas e raios

| Elemento                | Border radius |
| ----------------------- | ------------- |
| Painel lateral / modais | `6px`         |
| Botões                  | `3px`         |
| Badges / tags           | `2px`         |
| Inputs                  | `3px`         |
| Tooltips                | `2px`         |

> Cantos pequenos e precisos — coerentes com a estética de interface técnica. Evitar arredondamentos maiores que 8px em qualquer elemento.

### 4.2 Bordas

- Bordas padrão: `1px solid var(--color-border)` → `#2A2620`
- Estado ativo/selecionado: `1px solid var(--color-accent-dim)` + box-shadow de glow
- Nunca usar `border: none` em elementos interativos — a borda define a presença do componente

### 4.3 Sombras e elevação

```css
/* Nível 1 — painéis flutuantes */
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);

/* Nível 2 — modais, overlays */
box-shadow: 0 8px 40px rgba(0, 0, 0, 0.75);

/* Glow accent — elemento selecionado */
box-shadow: 0 0 14px var(--color-accent-glow);
```

### 4.4 Espaçamento

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

### 4.5 Opacidade e camadas

- Overlays de fundo: `rgba(12, 11, 9, 0.88)`
- Superfícies sobre a cena 3D: `backdrop-filter: blur(10px)` sempre que possível
- Elementos desabilitados: `opacity: 0.38`

---

## 5. Estados de interação

| Estado   | Tratamento visual                                                        |
| -------- | ------------------------------------------------------------------------ |
| Default  | Cor base, borda `--color-border`                                         |
| Hover    | Background sobe para `--color-surface-2`, leve brilho em ícones          |
| Active   | Background `--color-surface-2` + borda `--color-accent-dim` + glow suave |
| Focus    | Outline `2px solid var(--color-accent)` com offset `2px`                 |
| Disabled | `opacity: 0.38`, `cursor: not-allowed`                                   |
| Selected | Background sutil com accent, label em `--color-accent`                   |

---

## 6. Variáveis CSS — referência completa

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
  --font-display: 'CS Daine Mono', 'Courier Prime', monospace;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-data: 'IBM Plex Mono', monospace;

  /* Escala */
  --text-display: 2.5rem;
  --text-title: 1.375rem;
  --text-subtitle: 1rem;
  --text-body: 0.9375rem;
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
  --radius-sm: 2px;
  --radius-md: 3px;
  --radius-lg: 6px;
}
```

---

## 7. O que evitar

- **Azul como tom de fundo** — fundos azulados conflitam com o calor do accent âmbar e criam identidade genérica de "app espacial". Os neutros quentes são intencionais.
- **Roxo/violeta** — não é o tom do Sidereus.
- **Branco puro (`#FFFFFF`)** — usar `--color-text-primary` (`#EDE9E3`); branco puro cria contraste excessivo e frio contra os neutros quentes.
- **Usar serif para dados numéricos** — a diferença de família entre dado (mono) e descrição (serif) é semântica. Misturar quebra a lógica visual.
- **Usar mono para textos longos de leitura** — confortável para dados curtos, cansativo em parágrafos. Reservar serif para textos corridos.
- **Gradientes horizontais coloridos** — parecem gamificados. Preferir gradientes radiais sutis centrados no accent quando necessário.
- **CS Daine Mono em produção sem licença** — usar Courier Prime como substituto até licença confirmada.

---

## 8. Referências de moodboard

- **Logo Sidereus** — o próprio logo é a referência primária: âmbar sobre fundo neutro escuro, linguagem técnica-astronômica, precisão nos traços.
- **NASA Eyes on the Solar System** — densidade de dados com interface espacial

---

## 9. Aprovação

> Preencher antes do início do Sprint 1. Aprovação do time completo é critério de aceite desta issue.
