# 🦕 DinoKids — Sistema Educacional Gamificado
## Plano de Ação Completo para o Desenvolvedor

---

## 1. CONTEXTO E OBJETIVO

### Perfil do Usuário Final
- **Nome/Idade:** Criança de 4 anos, sexo masculino
- **Nível escolar:** Pré-alfabetização (em processo)
- **Experiência com tecnologia:** Zero contato prévio com PC/Notebook
- **Interesses:** Dinossauros, jogos de corrida, vídeos do YouTube de jogos
- **Desafio motor:** Coordenação motora em desenvolvimento (sem experiência com mouse/teclado)
- **Dispositivo de entrada principal:** Mouse USB com fio (cabo) — sem touchpad, sem touch screen

### Objetivo do Sistema
Criar um sistema web educacional offline/local, lúdico e progressivo que:
1. Introduza a criança ao uso do mouse e do teclado de forma gradual
2. Desenvolva raciocínio lógico através de puzzles e minijogos
3. Familiarize com conceitos básicos de programação (sequência, condição, repetição) de forma visual e implícita
4. Motive através de temas que a criança ama: dinossauros, fazendinha e animais

---

## 2. REFERÊNCIAS DE PLATAFORMAS ANALISADAS

| Plataforma | Faixa etária | Abordagem | Relevância para o projeto |
|---|---|---|---|
| **Code.org (Hora do Código)** | 4+ anos | Arrastar e soltar, sem precisar ler | Alta — referência de UX |
| **Scratch (MIT)** | 8+ anos | Programação em blocos | Média — inspiração de blocos visuais |
| **Blockly (Google)** | Sem limite | Blocos lógicos | Alta — inspiração de lógica visual |
| **CodeSpark Academy** | 5–9 anos | Sem texto, intuitivo | Alta — UX ideal para não-alfabetizado |
| **Code Karts** | 4+ anos | Pré-programação com sequências | Alta — muito próximo do objetivo |
| **KidloLand** | 1–5 anos | Atividades motoras e cognitivas | Alta — coordenação motora |
| **JogosGratisParaCriancas.com** | 2–5 anos | Click, arrastar, causa e efeito | Alta — modelo de interação |

**Conclusão da análise:** O sistema deve combinar a leveza de interação do Code Karts e KidloLand com a progressão de dificuldade do Code.org, tudo rodando localmente sem necessidade de internet.

---

## 3. ARQUITETURA TÉCNICA

### Stack Recomendada (compatível com Windows 7 / 2 GB RAM / HDD)

| Componente | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + JavaScript puro | Sem dependências, roda em qualquer browser |
| **Engine de jogos** | Phaser 3 (JS) | Leve, bem documentado, suporte a drag & drop, sons e animações |
| **Áudio** | Web Audio API / arquivos .mp3 locais | Sem streaming, sem internet |
| **Persistência** | localStorage | Salva progresso sem banco de dados |
| **Empacotamento** | Electron (opcional) | Transforma em .exe para Windows 7 |
| **Fonte** | Google Fonts embutidas localmente | Sem chamada externa |
| **Ícones/Sprites** | SVG + PNG otimizados | Levíssimos, sem precisar de GPU |

### Requisitos do Ambiente
- **Browser mínimo:** Chrome 49+ ou Firefox 52+ (compatíveis com Windows 7)
- **Resolução base:** 1024×768 (mínimo padrão para notebooks antigos)
- **RAM em uso pelo jogo:** máximo 150 MB
- **Armazenamento:** pasta local com todos os assets (aprox. 50–100 MB)
- **Sem internet:** 100% offline após instalado

### ⚠️ Configurações Específicas para Mouse USB com Fio

Este é um ponto crítico do projeto. A criança nunca usou mouse antes, e o mouse USB com fio tem características físicas e de software que devem ser configuradas e consideradas no desenvolvimento.

#### Configurações do Windows 7 recomendadas (orientar o pai)
O pai deve ajustar estas configurações antes de a criança usar, via `Painel de Controle > Mouse`:

| Configuração | Valor recomendado | Motivo |
|---|---|---|
| **Velocidade do ponteiro** | 3/11 (bem lento) | Mão pequena faz movimentos amplos sem querer |
| **Precisão do ponteiro (aceleração)** | **DESATIVADA** | Aceleração confunde crianças — movimento deve ser 1:1 |
| **Velocidade do clique duplo** | Mínima | Evitar clique duplo acidental |
| **Tamanho do cursor** | Extra grande (via Acessibilidade) | Cursor maior = mais fácil de localizar visualmente |
| **Cor do cursor** | Preto com borda branca grande | Contraste alto facilita rastrear na tela |
| **Trails do cursor** | Ativar (rastro longo) | Ajuda a criança a ver para onde o cursor está indo |

#### Configuração via código no jogo (CSS)
```css
/* Cursor personalizado grande e temático dentro do jogo */
* {
  cursor: url('assets/cursor/dino_pata.png') 16 16, auto;
}

/* Cursor especial em zonas clicáveis */
.clickable {
  cursor: url('assets/cursor/dino_pata_hover.png') 16 16, pointer;
}
```

#### Considerações de hardware do mouse USB
- **Resolução do sensor (DPI):** A maioria dos mouses USB básicos opera entre 800–1200 DPI. O desenvolvedor deve testar e calibrar as zonas de clique no jogo com base nisso.
- **Fio USB:** Orientar o pai a passar o cabo atrás do notebook para não atrapalhar o movimento — cabos soltos confundem crianças.
- **Superfície:** Recomendar uso de mousepad liso e claro. Mouses ópticos perdem rastreamento em superfícies escuras, espelhadas ou muito texturizadas.
- **Tamanho do mouse:** Mouses adultos são grandes para mãos de 4 anos. Se possível, usar um mouse pequeno/infantil. Caso não haja, o jogo deve compensar com alvos maiores (mínimo 120×120px em vez de 80×80px).

#### Adaptações no código do jogo para mouse físico

```javascript
// 1. ZONA DE TOLERÂNCIA AMPLIADA para drag & drop
// Crianças pequenas com mouse físico soltam antes da hora
const SNAP_TOLERANCE = 80; // px — bem mais largo que o padrão (30px)

function isNearTarget(piece, target) {
  const dist = Phaser.Math.Distance.Between(piece.x, piece.y, target.x, target.y);
  return dist < SNAP_TOLERANCE;
}

// 2. DEAD ZONE para movimento acidental
// Ignorar micro-movimentos involuntários durante o clique
const CLICK_DEAD_ZONE = 10; // px — se moveu menos que isso, conta como clique
let mouseDownPos = { x: 0, y: 0 };

this.input.on('pointerdown', (pointer) => {
  mouseDownPos = { x: pointer.x, y: pointer.y };
});

this.input.on('pointerup', (pointer) => {
  const moved = Phaser.Math.Distance.Between(
    mouseDownPos.x, mouseDownPos.y, pointer.x, pointer.y
  );
  if (moved < CLICK_DEAD_ZONE) {
    handleClick(pointer); // Só registra clique se não tremeu muito
  }
});

// 3. DEBOUNCE de clique — evitar duplo clique acidental
let lastClickTime = 0;
const CLICK_DEBOUNCE = 600; // ms

function handleClick(pointer) {
  const now = Date.now();
  if (now - lastClickTime < CLICK_DEBOUNCE) return; // Ignora clique muito rápido
  lastClickTime = now;
  // processar clique...
}

// 4. CURSOR VISUAL AMPLIADO dentro do canvas Phaser
// Substituir cursor nativo por sprite grande e animado
this.customCursor = this.add.image(0, 0, 'cursor_dino').setDepth(999);
this.input.on('pointermove', (pointer) => {
  this.customCursor.setPosition(pointer.x, pointer.y);
});
this.input.setDefaultCursor('none'); // Esconde cursor nativo
```

#### Fases de adaptação ao mouse (sugeridas para o Módulo 0)
O onboarding deve ter uma etapa extra especificamente para apresentar o mouse físico:

**Etapa 0.0 — "Conhecendo o Mouse"**
- Rex aparece e diz: *"Veja esse amiguinho! Mova ele e olhe o que acontece na tela!"*
- Cursor personalizado grande aparece com trilha de estrelinhas
- Qualquer movimento do mouse gera estrelinhas animadas no canvas
- Sem objetivo — pura exploração por 60 segundos
- Em seguida: *"Agora clique no botão! Pressione e solte!"*

### Estrutura de Pastas
```
dinokids/
├── index.html              ← Menu principal
├── assets/
│   ├── sprites/            ← Personagens e cenários (PNG/SVG)
│   │   ├── dino/
│   │   ├── fazenda/
│   │   └── animais/
│   ├── audio/              ← Sons, músicas, vozes (.mp3)
│   ├── fonts/              ← Fontes locais
│   └── backgrounds/        ← Cenários
├── js/
│   ├── phaser.min.js       ← Engine local
│   ├── game.js             ← Lógica central
│   ├── scenes/             ← Cada fase/módulo
│   └── progress.js         ← Sistema de progresso
├── css/
│   └── main.css
└── README.md
```

---

## 4. SISTEMA DE PROGRESSÃO E GAMIFICAÇÃO

### Moeda do Jogo: "Estrelinhas 🌟"
A criança ganha estrelinhas ao completar atividades. Com 10 estrelinhas, ela "alimenta" o dino mascote (animação de recompensa). Com 30 estrelinhas, desbloqueia novo tema.

### Mascote: "Dino Rex" 🦕
Um dinossauro amigável que aparece em todas as telas como guia. Ele:
- Faz gestos indicando o que fazer (sem texto obrigatório)
- Comemora com animação quando a criança acerta
- Incentiva suavemente quando erra ("Tente de novo! Você consegue! 💪")
- Evolui visualmente conforme o progresso (filhote → jovem → adulto)

### Temas Disponíveis (desbloqueáveis)
| Tema | Cenário | Personagens |
|---|---|---|
| 🦕 Mundo dos Dinossauros | Vale Jurássico | Rex, Braqui, Tricê |
| 🐄 Fazendinha | Campo verde | Vaca, Galinha, Porquinho |
| 🐘 Floresta dos Animais | Selva colorida | Leão, Elefante, Macaco |
| 🚀 Espaço (bônus) | Galáxia | Alien-Dino |

---

## 5. MÓDULOS DO SISTEMA (ETAPAS DE APRENDIZAGEM)

---

### MÓDULO 0 — "Olá, Mundo!" (Onboarding)
**Objetivo:** Primeira interação com o PC. Ensinar que a tela responde ao toque/clique.

**Mecânica:**
- Dino Rex aparece no centro da tela piscando
- Narrador em voz (PT-BR) diz: *"Oi! Eu sou o Rex! Clique em mim!"*
- Ao clicar, Rex dá um rugido fofo e pula
- Repete com 3 personagens diferentes para reforçar o conceito de "clicar"

**Habilidade desenvolvida:** Clicar com o mouse (botão esquerdo)
**Duração estimada:** 2–5 min
**Critério de avanço:** 5 cliques corretos

---

### MÓDULO 1 — "Movendo o Mouse" 🖱️
**Objetivo:** Entender que o mouse controla o cursor na tela.

**Atividade 1.1 — Siga o Dino:**
- Rex corre pelo cenário e a criança deve mover o cursor para "tocá-lo"
- Velocidade muito lenta inicialmente
- Efeito visual e sonoro ao tocar Rex (partículas coloridas + rugido)

**Atividade 1.2 — Labirinto do Rex:**
- Labirinto bem largo e simples (3–4 caminhos)
- Criança deve levar o cursor do início ao fim sem sair do caminho
- Detecção de colisão suave (pausa + som gentil ao errar, sem punição severa)

**Habilidade desenvolvida:** Controle do mouse, coordenação olho-mão
**Duração estimada:** 5–10 min por atividade
**Critério de avanço:** Completar labirinto 3 vezes

---

### MÓDULO 2 — "Clique Certeiro" 🎯
**Objetivo:** Precisão do clique em alvos de tamanho progressivamente menor.

**Atividade 2.1 — Acorda o Ovo!:**
- Ovos de dinossauro grandes aparecem na tela (150×150px)
- Criança clica para "chocá-los" e um dino bebê nasce
- A cada fase, os ovos ficam um pouco menores

**Atividade 2.2 — Borboletas na Fazenda:**
- Borboletas coloridas voam suavemente
- Criança deve clicar nas de cor solicitada pelo narrador
- Treina coordenação + início de reconhecimento de cores

**Habilidade desenvolvida:** Clique preciso, distinção visual
**Duração estimada:** 5–10 min
**Critério de avanço:** 10 acertos consecutivos no nível atual

---

### MÓDULO 3 — "Arrastar e Soltar" 🧩 (Puzzle Estilo Tetris)
**Objetivo:** Mecânica de drag & drop — encaixar peças no lugar correto.

**Atividade 3.1 — Montar o Dino:**
- Silhueta de um dinossauro no centro
- 3 peças soltas ao redor (cabeça, corpo, rabo)
- Criança arrasta cada peça para o encaixe correto
- Animação de "clique" quando encaixa na posição certa
- Sons de encaixe satisfatórios

**Atividade 3.2 — Quebra-cabeça da Fazenda:**
- Imagem de fazenda dividida em 4 peças simples
- Dragão das peças disponíveis → posição correta
- Progressão: 4 peças → 6 peças → 9 peças

**Atividade 3.3 — Complete o Padrão (Tetris Simples):**
- Grade 4×4 com espaços vazios formando uma forma simples
- 1 ou 2 peças do tipo correto disponíveis
- Criança arrasta a peça para preencher o espaço
- Peça "encaixa" com animação satisfatória quando no local certo
- Erros: peça retorna suavemente ao ponto de origem

**Implementação drag & drop:**
```javascript
// Exemplo com Phaser 3
this.piece.setInteractive();
this.input.setDraggable(this.piece);

this.input.on('dragstart', (pointer, gameObject) => {
  gameObject.setScale(1.1); // Feedback visual
});

this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
  gameObject.x = dragX;
  gameObject.y = dragY;
});

this.input.on('dragend', (pointer, gameObject) => {
  if (isNearTarget(gameObject, target)) {
    snapToTarget(gameObject, target); // Encaixe
    playSuccessSound();
  } else {
    returnToOrigin(gameObject); // Volta ao lugar
  }
});
```

**Habilidade desenvolvida:** Drag & drop, raciocínio espacial, lógica de encaixe
**Duração estimada:** 10–15 min
**Critério de avanço:** Completar 5 puzzles sem ajuda

---

### MÓDULO 4 — "Sequência Lógica" 🔢
**Objetivo:** Introdução implícita ao conceito de sequência (base da programação).

**Atividade 4.1 — Alimentar o Rex:**
- Rex está com fome. Mostrar sequência: 🥩 → 🌿 → 🥩
- Bagunçar a ordem e pedir para a criança reorganizar
- Narrador: *"O Rex precisa comer na ordem certa! Qual vem primeiro?"*

**Atividade 4.2 — Trilha do Dino:**
- Grade de caminho com setas direcionais simples (↑ ↓ ← →)
- Rex precisa chegar à comida
- Criança escolhe 3–4 setas para formar o caminho
- Ao clicar "Ir!", Rex percorre as instruções

**Habilidade desenvolvida:** Pensamento sequencial, lógica de programação visual
**Duração estimada:** 10–15 min
**Critério de avanço:** Completar 5 trilhas com sucesso

---

### MÓDULO 5 — "Conhecendo o Teclado" ⌨️
**Objetivo:** Primeiro contato com o teclado — teclas específicas e simples.

**Atividade 5.1 — Rex Corre!:**
- Rex parado no cenário
- Tecla de seta direita (→) faz Rex correr
- Narrador: *"Aperta a setinha para o Rex correr!"*
- Personagem corre com animação enquanto tecla pressionada

**Atividade 5.2 — Controle do Dino:**
- Rex em campo aberto, 4 setas direcionais disponíveis
- Guiar Rex até a comida espalhada pelo mapa
- Limite de tempo suave (barra visual, sem punição rigorosa)

**Atividade 5.3 — Tecla Certa:**
- Letra ou número aparece na tela em tamanho grande
- Criança deve apertar a tecla correspondente no teclado
- Feedback: letra "se ilumina" e som de acerto
- Iniciar com: A, S, D (teclas confortáveis para mão esquerda) e setas

**Habilidade desenvolvida:** Uso do teclado, coordenação bimanual (mouse + teclado)
**Duração estimada:** 10–20 min
**Critério de avanço:** 10 acertos consecutivos

---

### MÓDULO 6 — "Criando com o Dino" 🎨 (Bônus Criativo)
**Objetivo:** Exploração livre — recompensa e estímulo criativo.

**Atividade 6.1 — Pinte o Dino:**
- Silhueta do Rex em branco
- Paleta de cores simples (8 cores)
- Criança clica na cor e depois clica no dino para pintar
- Pode salvar a imagem (screenshot local)

**Atividade 6.2 — Monte Sua Fazenda:**
- Área de campo em branco
- Arrasta animais, árvores, celeiros e os posiciona livremente
- Sem objetivo — pura exploração criativa
- Narrador comenta cada elemento colocado com fato divertido

**Habilidade desenvolvida:** Criatividade, expressão, consolidação motora
**Duração estimada:** Tempo livre

---

## 6. INTERFACE E DESIGN

### Princípios de UX para 4 anos com Mouse USB
1. **Sem texto obrigatório** — toda instrução deve ser por voz ou ícone
2. **Alvos extra grandes** — mínimo **120×120px** para cliques (não 80px — mão pequena + mouse físico exige mais margem); **160×160px** para drag zones
3. **Feedback imediato** — toda ação deve gerar resposta visual E sonora
4. **Sem punição** — erros geram mensagem encorajadora, nunca "X vermelho" ou som agressivo
5. **Progresso visível** — barra de estrelinhas sempre visível no topo
6. **Sessões curtas** — cada atividade máximo 10 min; timer interno para sugerir pausa
7. **Cores vivas** — paleta primária saturada (crianças respondem melhor)
8. **Fonte arredondada** — usar Nunito, Baloo ou Fredoka One (localmente embutida)
9. **Cursor personalizado** — substituir cursor padrão do OS por sprite de patinha de dino grande e animado dentro do canvas
10. **Tolerância de snap ampla** — peças de drag & drop encaixam com até 80px de distância do alvo (compensar tremor e imprecisão do mouse físico)
11. **Debounce de clique** — 600ms entre cliques registrados (evitar duplo clique involuntário)
12. **Sem scroll** — toda atividade cabe em uma tela; nunca exigir rolar a página com mouse

### Layout Padrão de Tela
```
┌─────────────────────────────────────────────────┐
│  [🦕 Rex] [⭐⭐⭐☆☆] [🔊] [🏠 Menu]           │  ← Header fixo
├─────────────────────────────────────────────────┤
│                                                 │
│          ÁREA DO JOGO / ATIVIDADE               │  ← 80% da tela
│         (cenário temático animado)              │
│                                                 │
├─────────────────────────────────────────────────┤
│  [← Anterior]   [Dica 💡]   [Próximo →]        │  ← Footer simples
└─────────────────────────────────────────────────┘
```

### Paleta de Cores por Tema
| Tema | Primária | Secundária | Fundo |
|---|---|---|---|
| Dinossauros | #4CAF50 (verde) | #FF9800 (laranja) | #E8F5E9 |
| Fazendinha | #8BC34A (verde claro) | #FFEB3B (amarelo) | #F9FBE7 |
| Floresta | #009688 (verde-água) | #FF5722 (coral) | #E0F2F1 |

---

## 7. SISTEMA DE ÁUDIO

### Estrutura de Sons Necessários
```
audio/
├── narrador/
│   ├── instrucoes/        ← Explicações de cada atividade (PT-BR)
│   ├── incentivos/        ← "Muito bem!", "Tente de novo!", "Incrível!"
│   └── introducoes/       ← Falas do Rex apresentando cada módulo
├── efeitos/
│   ├── clique.mp3
│   ├── encaixe.mp3        ← Som satisfatório de peça encaixando
│   ├── acerto.mp3
│   ├── erro_suave.mp3     ← Som gentil, não agressivo
│   └── celebracao.mp3     ← Fanfarra de recompensa
├── ambiente/
│   ├── selva.mp3          ← Loop suave
│   ├── fazenda.mp3
│   └── floresta.mp3
└── personagens/
    ├── rex_rugido.mp3
    ├── vaca_moo.mp3
    └── ...
```

### Implementação de Voz
Opção A (recomendada para offline): Gravar arquivos MP3 com voz humana infantil em PT-BR
Opção B: Web Speech API (requer internet, não recomendado)
Opção C: ResponsiveVoice embutido (biblioteca JS local, funciona offline)

---

## 8. SISTEMA DE PROGRESSO E PERFIL

### Dados Salvos (localStorage)
```javascript
const playerProgress = {
  name: "Pedrinho",            // Definido no primeiro acesso
  avatar: "dino_filhote",      // Evolui com progresso
  stars: 45,                   // Total de estrelinhas
  modules: {
    module0: { completed: true, stars: 5 },
    module1: { completed: true, stars: 8, activity_1: true, activity_2: false },
    module2: { completed: false, stars: 2 },
    // ...
  },
  themes_unlocked: ["dino", "fazenda"],
  sessions: [
    { date: "2025-01-15", duration_min: 12, activities_done: 3 }
  ],
  settings: {
    volume: 0.8,
    narrator_speed: 0.9      // Velocidade da narração
  }
};
```

### Tela de Perfil (para o pai ver)
- Gráfico simples de progresso por módulo
- Tempo total jogado
- Atividades completadas
- Próximas etapas recomendadas

---

## 9. FLUXO COMPLETO DO SISTEMA

```
INÍCIO
  │
  ▼
[Tela de Boas-vindas]
  Rex aparece, pede nome da criança (digitado pelo pai na 1ª vez)
  │
  ▼
[Menu Principal — Mapa de Ilhas]
  Cada ilha = 1 módulo
  Ilhas bloqueadas aparecem cinzas
  Rex guia visualmente qual a próxima
  │
  ├──► [Módulo 0: Olá, Mundo!]
  │         └──► [Módulo 1: Movendo o Mouse]
  │                   └──► [Módulo 2: Clique Certeiro]
  │                             └──► [Módulo 3: Arrastar e Soltar] ★ CORE
  │                                       └──► [Módulo 4: Sequência Lógica]
  │                                                 └──► [Módulo 5: Teclado]
  │                                                           └──► [Módulo 6: Criativo]
  │
  └──► [Tela de Recompensa]
            Rex evolui, nova skin desbloqueada, celebração
```

---

## 10. CRITÉRIOS DE ACESSIBILIDADE E SEGURANÇA INFANTIL

- **Sem anúncios** — 100% livre de publicidade
- **Sem compras in-app** — tudo local e gratuito
- **Sem câmera/microfone** — privacidade total
- **Sem internet obrigatória** — funciona 100% offline
- **Sem violência ou conteúdo inadequado**
- **Modo escuro opcional** — para uso em ambientes com pouca luz
- **Timer de sessão** — após 20 min, Rex sugere pausa: *"Vamos descansar os olhinhos!"*
- **Controles de pai:** botão oculto (clique 5× no logo) abre painel de configurações e progresso

---

## 11. ROADMAP DE DESENVOLVIMENTO

### Fase 1 — MVP (4–6 semanas)
- [ ] Estrutura de pastas e arquitetura base
- [ ] Módulo 0 completo (onboarding)
- [ ] Módulo 1 completo (mouse básico)
- [ ] Módulo 3.1 e 3.2 (puzzles simples)
- [ ] Sistema de estrelinhas
- [ ] Mascote Rex com animações básicas
- [ ] 1 tema: Dinossauros

### Fase 2 — Expansão (4–6 semanas)
- [ ] Módulos 2, 4 e 5 completos
- [ ] Sistema de progresso persistente
- [ ] Tema Fazendinha
- [ ] Narração em voz
- [ ] Tela de perfil para pai

### Fase 3 — Polimento (2–3 semanas)
- [ ] Tema Floresta
- [ ] Módulo 6 (criativo)
- [ ] Otimização de performance (< 150 MB RAM)
- [ ] Teste em Windows 7 com 2 GB RAM
- [ ] Empacotamento com Electron (opcional .exe)
- [ ] Documentação de uso para o pai

---

## 12. CHECKLIST DO DESENVOLVEDOR

### Antes de começar:
- [ ] Instalar Node.js (v12 LTS — compatível com Windows 7)
- [ ] Instalar Phaser 3 ou baixar localmente
- [ ] Preparar banco de sprites (dinossauros, animais, cenários) — podem ser SVGs livres
- [ ] Gravar ou obter áudios em PT-BR com voz infantil amigável
- [ ] Testar browser no Windows 7 (Chrome 49 ou Firefox 52)
- [ ] Definir resolução base: 1024×768 com escalamento responsivo
- [ ] **Configurar mouse USB:** ajustar velocidade do ponteiro para lenta no Windows 7 e desativar aceleração
- [ ] **Criar sprite de cursor personalizado** (patinha de dino, mínimo 48×48px, fundo transparente)
- [ ] **Testar em mousepad** — verificar rastreamento do sensor óptico na superfície disponível
- [ ] Implementar dead zone de 10px e debounce de 600ms nos eventos de clique

### A cada módulo:
- [ ] UX testado com criança real (sessão de 10 min com pai presente)
- [ ] Sons de acerto/erro implementados
- [ ] Feedback visual em todas as interações
- [ ] Progresso salvo no localStorage
- [ ] Funciona sem internet

### Antes do lançamento:
- [ ] Teste completo em Windows 7 / 2 GB RAM
- [ ] RAM em uso < 150 MB durante gameplay
- [ ] Tempo de carregamento inicial < 5 segundos
- [ ] Sem erros de console no browser alvo
- [ ] Guia de uso para o pai (1 página simples)

---

## 13. RECURSOS EXTERNOS GRATUITOS SUGERIDOS

| Recurso | Tipo | Link |
|---|---|---|
| OpenGameArt.org | Sprites e sons livres | opengameart.org |
| Freepik (dinos) | Vetores temáticos | freepik.com |
| Phaser 3 | Engine de jogos JS | phaser.io |
| Nunito Font | Fonte arredondada infantil | Google Fonts (embutir local) |
| Howler.js | Biblioteca de áudio JS | howlerjs.com |
| Animate.css | Animações CSS simples | animate.style |

---

## 14. NOTAS FINAIS

Este sistema foi projetado para crescer junto com a criança. A estrutura modular permite adicionar novos temas e atividades sem refatoração. O foco em rodar localmente sem internet garante que funcione perfeitamente no hardware limitado disponível.

A progressão respeita o desenvolvimento neuromotor de crianças de 4 anos: começa com alvos grandes e interações simples, aumentando gradualmente a exigência de precisão e raciocínio sem nunca frustrar.

O uso de **mouse USB com fio** em vez do touchpad é uma decisão excelente — o mouse físico oferece feedback tátil, movimento mais intuitivo e não exige a coordenação refinada que o touchpad demanda. O fio também elimina problemas de bateria ou conexão. O sistema foi desenhado para compensar a imprecisão natural de mãos pequenas: alvos maiores, zonas de encaixe generosas e debounce de clique garantem que a criança sinta que está no controle, mesmo nos primeiros dias de uso.

O mascote Rex é o coração emocional do sistema — seu vínculo com a criança será o principal fator de motivação e retorno diário.

---

*Documento elaborado com base em análise de plataformas educacionais infantis de referência (Code.org, Scratch MIT, CodeSpark Academy, Code Karts, KidloLand) e boas práticas de UX para pré-escolares.*
