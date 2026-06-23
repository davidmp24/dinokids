// ============================================================
//  DinoKids — game.js
//  Lógica principal e controle de estado
// ============================================================

// --- ESTADO GLOBAL ---
let currentModule = null;
let currentScore = 0;
let sessionStartTime = Date.now();
let timerInterval = null;
let clickDebounceTime = 0;

// Twemoji imagem para Canvas
const canvasDinoImg = new Image();
canvasDinoImg.src = 'assets/svg/1f995.svg';

// --- UTILS ---
const $ = id => document.getElementById(id);
const q = sel => document.querySelector(sel);
const qa = sel => document.querySelectorAll(sel);

function showToast(msg) {
  const t = $('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function updateHeader() {
  const data = Progress.data;
  if (!data) return;
  $('stars-display').innerText = data.stars;
  $('header-player-name').innerText = data.name || 'DinoKids';
}

function showScreen(id) {
  qa('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  if (id !== 'screen-welcome') $('header').style.display = 'flex';
  Audio.click();
}

function debounceClick() {
  const now = Date.now();
  if (now - clickDebounceTime < 600) return false;
  clickDebounceTime = now;
  return true;
}

// --- CURSOR MOUSE ---
document.addEventListener('mousemove', e => {
  const cursor = $('custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => $('custom-cursor').classList.add('clicking'));
document.addEventListener('mouseup', () => $('custom-cursor').classList.remove('clicking'));

// --- INICIALIZAÇÃO ---
window.addEventListener('load', () => {
  const data = Progress.load();
  Audio.init();

  if (data && data.name) {
    $('welcome-form').style.display = 'none';
    $('welcome-returning').style.display = 'flex';
    $('returning-greeting').innerText = `Oi de novo, ${data.name}!`;
  }

  $('btn-start').addEventListener('click', () => {
    if (!debounceClick()) return;
    const name = $('player-name-input').value.trim();
    if (!name) return showToast('Por favor, digite seu nome!');
    Progress.init(name);
    Audio.init(); // Context must resume on user interaction
    Audio.success();
    initMap();
  });

  $('btn-continue').addEventListener('click', () => {
    if (!debounceClick()) return;
    Audio.init();
    Audio.success();
    initMap();
  });

  $('btn-new-game').addEventListener('click', () => {
    if (!debounceClick()) return;
    $('welcome-returning').style.display = 'none';
    $('welcome-form').style.display = 'flex';
  });

  $('btn-home').addEventListener('click', () => {
    if (!debounceClick()) return;
    initMap();
  });

  $('btn-sound').addEventListener('click', () => {
    if (!debounceClick()) return;
    const muted = Audio.toggleMute();
    $('btn-sound').innerText = muted ? '🔇' : '🔊';
  });

  // Timer Session
  timerInterval = setInterval(() => {
    const min = Math.floor((Date.now() - sessionStartTime) / 60000);
    const sec = Math.floor(((Date.now() - sessionStartTime) % 60000) / 1000);
    $('session-timer').innerText = `🕐 ${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    if (min === 20 && sec === 0) showToast('Que tal descansar os olhinhos um pouco?');
  }, 1000);
});

// --- MAPA ---
function initMap() {
  showScreen('screen-map');
  updateHeader();
  const data = Progress.data;

  // Atualizar Ilhas
  Object.keys(data.modules).forEach(modId => {
    const mod = data.modules[modId];
    const btn = $(`island-${modId}`);
    if (!btn) return;
    
    if (mod.unlocked) {
      btn.classList.remove('locked');
      btn.onclick = () => loadModule(modId);
    } else {
      btn.classList.add('locked');
      btn.onclick = null;
    }

    const starsDisplay = $(`stars-${modId}`);
    if (starsDisplay) {
      const stars = mod.stars;
      starsDisplay.innerText = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }
  });
}

// --- CONTROLE DE MÓDULOS ---
function loadModule(modId) {
  if (!debounceClick()) return;
  currentModule = modId;
  currentScore = 0;
  showScreen(`screen-mod${modId}`);
  
  if (modId == '0') initMod0();
  else if (modId == '1') initMod1();
  else if (modId == '2') initMod2();
  else if (modId == '3') initMod3();
  else if (modId == '4') initMod4();
  else if (modId == '5') initMod5();
  else if (modId == '6') initMod6();
  else if (modId == '7') initMod7();
  else if (modId == '8') initMod8();
  else showToast('Módulo em desenvolvimento!');
}

function completeCurrentModule(starsEarned = 5) {
  Audio.levelUp();
  setTimeout(() => {
    showScreen('screen-reward');
    $('reward-stars').innerText = '⭐'.repeat(starsEarned);
    Progress.addStars(starsEarned, currentModule);
    Progress.completeModule(currentModule === 'bonus' ? 'bonus' : parseInt(currentModule));
    
    $('btn-reward-map').onclick = () => initMap();
    $('btn-reward-next').onclick = () => {
      let nextId = parseInt(currentModule) + 1;
      if (nextId <= 8 && Progress.data.modules[nextId] && Progress.data.modules[nextId].unlocked) loadModule(nextId.toString());
      else initMap();
    };
  }, 1000);
}

// --- MÓDULO 0: OLÁ MUNDO ---
function initMod0() {
  const rex = $('mod0-rex');
  const counter = $('mod0-counter');
  const reward = $('mod0-stars-reward');
  let clicks = 0;
  
  counter.innerText = `⭐ Cliques: ${clicks} / 5`;
  reward.style.display = 'none';
  
  rex.onclick = () => {
    if (!debounceClick()) return;
    Audio.rexRoar();
    clicks++;
    counter.innerText = `⭐ Cliques: ${clicks} / 5`;
    
    // Animate Rex
    rex.style.transform = 'scale(1.2)';
    setTimeout(() => rex.style.transform = '', 200);

    // Create star
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.innerText = '⭐';
    star.style.left = rex.getBoundingClientRect().left + 50 + 'px';
    star.style.top = rex.getBoundingClientRect().top + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);

    if (clicks >= 5) {
      rex.onclick = null;
      Audio.success();
      $('mod0-speech').innerText = 'Muito bem! Você é incrível!';
      reward.style.display = 'block';
      $('mod0-next').onclick = () => completeCurrentModule(5);
    }
  };
}

// --- MÓDULO 1: MOUSE ---
function initMod1() {
  const canvas = $('canvas-mod1');
  const ctx = canvas.getContext('2d');
  canvas.width = 600; canvas.height = 400;
  
  let target = { x: 300, y: 200, radius: 40 };
  let score = 0;
  let animId;
  $('mod1-counter').innerText = `⭐ Toques: ${score} / 10`;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFD600';
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
    if (canvasDinoImg.complete && canvasDinoImg.naturalWidth !== 0) {
      ctx.drawImage(canvasDinoImg, target.x - 25, target.y - 25, 50, 50);
    } else {
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦕', target.x, target.y);
    }
    animId = requestAnimationFrame(draw);
  }
  
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    const dist = Math.hypot(mx - target.x, my - target.y);
    if (dist < target.radius) {
      Audio.star();
      score++;
      $('mod1-counter').innerText = `⭐ Toques: ${score} / 10`;
      
      target.x = 50 + Math.random() * 500;
      target.y = 50 + Math.random() * 300;
      
      if (score >= 10) {
        canvas.onmousemove = null;
        cancelAnimationFrame(animId);
        completeCurrentModule(5);
      }
    }
  };
  
  draw();
}

// --- MÓDULO 2: CLIQUE CERTEIRO ---
function initMod2() {
  const area = $('eggs-area');
  area.innerHTML = '';
  let score = 0;
  $('mod2-counter').innerText = `⭐ Acertos: ${score} / 10`;

  function spawnEgg() {
    if (score >= 10) return;
    const egg = document.createElement('div');
    egg.className = 'dino-egg';
    egg.innerText = '🥚';
    
    egg.onmousedown = () => {
      if (!debounceClick()) return;
      Audio.snap();
      egg.classList.add('egg-cracking');
      setTimeout(() => egg.innerText = '🦕', 150);
      
      setTimeout(() => {
        egg.remove();
        score++;
        $('mod2-counter').innerText = `⭐ Acertos: ${score} / 10`;
        if (score >= 10) completeCurrentModule(5);
        else spawnEgg();
      }, 500);
    };
    area.appendChild(egg);
  }
  
  for(let i=0; i<3; i++) spawnEgg();
}

// --- MÓDULO 3: DRAG & DROP ---
function initMod3() {
  const tray = $('pieces-tray');
  const board = $('puzzle-board');
  tray.innerHTML = '';
  board.innerHTML = '';
  
  let score = 0;
  $('mod3-counter').innerText = `🧩 Puzzles: ${score} / 3`;

  const puzzles = [
    { pieces: ['🦖', '🦴', '🦕'] },
    { pieces: ['🐄', '🚜', '🌾'] },
    { pieces: ['🐘', '🌴', '🍌'] }
  ];

  function loadPuzzle(idx) {
    tray.innerHTML = '';
    board.innerHTML = '';
    const p = puzzles[idx];
    if(!p) return completeCurrentModule(5);
    
    let draggedPiece = null;

    // Shuffle pieces for tray
    const shuffled = [...p.pieces].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((icon, i) => {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.innerText = icon;
      piece.draggable = true;
      piece.dataset.icon = icon;
      
      piece.ondragstart = (e) => {
        draggedPiece = piece;
        piece.classList.add('dragging');
        Audio.hover();
      };
      piece.ondragend = () => {
        piece.classList.remove('dragging');
        qa('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
      };
      tray.appendChild(piece);
    });

    // Slots
    p.pieces.forEach(icon => {
      const slot = document.createElement('div');
      slot.className = 'puzzle-slot';
      slot.dataset.target = icon;
      
      slot.ondragover = (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      };
      slot.ondragleave = () => slot.classList.remove('drag-over');
      
      slot.ondrop = (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        if (!draggedPiece) return;
        
        if (draggedPiece.dataset.icon === slot.dataset.target && !slot.classList.contains('filled')) {
          Audio.snap();
          slot.innerText = draggedPiece.dataset.icon;
          slot.classList.add('filled');
          draggedPiece.remove();
          
          if (qa('.puzzle-piece').length === 0) {
            score++;
            $('mod3-counter').innerText = `🧩 Puzzles: ${score} / 3`;
            Audio.success();
            setTimeout(() => loadPuzzle(idx + 1), 1000);
          }
        } else {
          Audio.error();
        }
      };
      board.appendChild(slot);
    });
  }

  loadPuzzle(0);
}

// --- MÓDULO 4: SEQUÊNCIA (simplificado — "Qual vem depois?") ---
function initMod4() {
  const example = $('mod4-example');
  const player  = $('mod4-player');
  let score = 0;
  $('mod4-counter').innerText = `🔢 Sequências: ${score} / 5`;

  // Cada round: mostrar 2 itens da sequência e perguntar qual é o 3º
  const seqs = [
    { shown: ['🌱', '🌳'], answer: '🍎', wrong: ['🚜', '🐄'] },
    { shown: ['🥚', '🦕'], answer: '🦖', wrong: ['🐄', '🌾'] },
    { shown: ['☀️', '🌧️'], answer: '🌈', wrong: ['🌙', '❄️'] },
    { shown: ['🌱', '🌿'], answer: '🌳', wrong: ['🐛', '🦀'] },
    { shown: ['🥚', '🐣'], answer: '🐔', wrong: ['🐶', '🐟'] }
  ];

  function loadSeq(idx) {
    if (idx >= seqs.length) return completeCurrentModule(5);
    const round = seqs[idx];
    example.innerHTML = '';
    player.innerHTML = '';

    // Mostrar os 2 itens conhecidos
    round.shown.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'seq-card';
      card.innerText = icon;
      example.appendChild(card);
    });
    // Mostrar "?" como último
    const q = document.createElement('div');
    q.className = 'seq-card seq-question';
    q.innerText = '?';
    example.appendChild(q);

    // Montar opções de escolha: resposta certa + 2 erradas
    const options = [round.answer, ...round.wrong].sort(() => Math.random() - 0.5);
    options.forEach(icon => {
      const btn = document.createElement('div');
      btn.className = 'seq-card seq-option';
      btn.innerText = icon;
      btn.onclick = () => {
        if (icon === round.answer) {
          Audio.success();
          btn.classList.add('correct');
          score++;
          $('mod4-counter').innerText = `🔢 Sequências: ${score} / 5`;
          setTimeout(() => loadSeq(idx + 1), 900);
        } else {
          Audio.error();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      };
      player.appendChild(btn);
    });

    // Esconder botão de verificar (não usado mais)
    const checkBtn = $('btn-check-seq');
    if (checkBtn) checkBtn.style.display = 'none';
  }

  loadSeq(0);
}

// --- MÓDULO 5: TECLADO ---
function initMod5() {
  const display = $('key-display');
  let score = 0;
  $('mod5-counter').innerText = `⌨️ Acertos: ${score} / 10`;
  const keys = ['A', 'S', 'D', 'W', '1', '2', '3', 'ENTER', 'SPACE'];
  let currentKey = '';

  function nextKey() {
    if (score >= 10) {
      document.onkeydown = null;
      return completeCurrentModule(5);
    }
    currentKey = keys[Math.floor(Math.random() * keys.length)];
    display.innerText = currentKey === 'SPACE' ? 'ESPAÇO' : currentKey;
    display.style.transform = 'scale(0.8)';
    setTimeout(() => display.style.transform = 'scale(1)', 100);
  }

  document.onkeydown = (e) => {
    let key = e.key.toUpperCase();
    if (key === ' ') key = 'SPACE';
    
    if (key === currentKey) {
      Audio.snap();
      score++;
      $('mod5-counter').innerText = `⌨️ Acertos: ${score} / 10`;
      display.style.color = '#4CAF50';
      display.style.borderColor = '#4CAF50';
      setTimeout(() => {
        display.style.color = '';
        display.style.borderColor = '';
        nextKey();
      }, 300);
    } else {
      // Ignorar outras teclas ou tocar som de erro suave?
      // Melhor ignorar para não frustrar.
    }
  };

  nextKey();
}

// --- MÓDULO 6: CRIATIVO ---
function initMod6() {
  const canvas = $('canvas-paint');
  const ctx = canvas.getContext('2d');
  const palette = $('color-palette');
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw Dino Silhouette
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(175, 175, 80, 0, Math.PI * 2);
  ctx.stroke();
  if (canvasDinoImg.complete && canvasDinoImg.naturalWidth !== 0) {
    ctx.drawImage(canvasDinoImg, 175 - 40, 175 - 40, 80, 80);
  } else {
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦕', 175, 175);
  }

  let painting = false;
  let currentColor = '#FF0000';

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];
  palette.innerHTML = '';
  colors.forEach(c => {
    const btn = document.createElement('div');
    btn.style.width = '40px'; btn.style.height = '40px';
    btn.style.backgroundColor = c;
    btn.style.borderRadius = '50%';
    btn.style.border = '3px solid white';
    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    btn.onclick = () => { Audio.click(); currentColor = c; };
    palette.appendChild(btn);
  });

  canvas.onmousedown = (e) => { painting = true; draw(e); };
  canvas.onmouseup = () => { painting = false; ctx.beginPath(); };
  canvas.onmousemove = draw;

  function draw(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  $('btn-clear-paint').onclick = () => {
    if (!debounceClick()) return;
    Audio.error();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(175, 175, 80, 0, Math.PI * 2);
    ctx.stroke();
    if (canvasDinoImg.complete && canvasDinoImg.naturalWidth !== 0) {
      ctx.drawImage(canvasDinoImg, 175 - 40, 175 - 40, 80, 80);
    } else {
      ctx.font = '60px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦕', 175, 175);
    }
  };

  $('btn-done-paint').onclick = () => {
    if (!debounceClick()) return;
    completeCurrentModule(5);
  };
}

// --- MÓDULO 7: JOGO DA MEMÓRIA ---
function initMod7() {
  const grid = $('memory-grid');
  grid.innerHTML = '';
  let pairs = 0;
  let flipped = [];
  let locked = false;
  $('mod7-counter').innerText = `🧠 Pares: ${pairs} / 6`;

  const animals = ['🦕', '🦖', '🐄', '🐘', '🐣', '🦎'];
  // Duplicar e embaralhar
  const cards = [...animals, ...animals].sort(() => Math.random() - 0.5);

  cards.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.icon = icon;

    const front = document.createElement('div');
    front.className = 'memory-front';
    front.innerText = '?';

    const back = document.createElement('div');
    back.className = 'memory-back';
    back.innerText = icon;

    card.appendChild(front);
    card.appendChild(back);
    grid.appendChild(card);

    card.onclick = () => {
      if (locked || card.classList.contains('revealed') || card.classList.contains('matched')) return;
      Audio.click();
      card.classList.add('revealed');
      flipped.push(card);

      if (flipped.length === 2) {
        locked = true;
        const [a, b] = flipped;
        if (a.dataset.icon === b.dataset.icon) {
          Audio.snap();
          a.classList.add('matched');
          b.classList.add('matched');
          pairs++;
          $('mod7-counter').innerText = `🧠 Pares: ${pairs} / 6`;
          flipped = [];
          locked = false;
          if (pairs >= 6) {
            Audio.success();
            setTimeout(() => completeCurrentModule(5), 800);
          }
        } else {
          Audio.error();
          setTimeout(() => {
            a.classList.remove('revealed');
            b.classList.remove('revealed');
            flipped = [];
            locked = false;
          }, 900);
        }
      }
    };
  });
}

// --- MÓDULO 8: LABIRINTO ---
function initMod8() {
  let level = 0;
  let score = 0;
  $('mod8-counter').innerText = `🌿 Fases: ${score} / 3`;

  // Cada mapa: 0=vazio, 1=parede, S=início, E=saída
  const levels = [
    { rows: 5, cols: 5, walls: [[0,1],[1,1],[1,3],[2,1],[2,3],[3,1],[3,3],[4,3]], start:[0,0], end:[4,4] },
    { rows: 6, cols: 6, walls: [[0,2],[1,0],[1,2],[1,4],[2,2],[2,4],[3,0],[3,2],[4,0],[4,2],[4,4]], start:[0,0], end:[5,5] },
    { rows: 7, cols: 7, walls: [[0,3],[1,1],[1,3],[1,5],[2,1],[2,3],[2,5],[3,1],[3,3],[3,5],[4,1],[4,3],[5,1],[5,3],[5,5]], start:[0,0], end:[6,6] }
  ];

  function startLevel(idx) {
    if (idx >= levels.length) return completeCurrentModule(5);
    const lv = levels[idx];
    const mazeGrid = $('maze-grid');
    mazeGrid.innerHTML = '';
    mazeGrid.style.gridTemplateColumns = `repeat(${lv.cols}, 1fr)`;
    mazeGrid.style.gridTemplateRows = `repeat(${lv.rows}, 1fr)`;

    let playerPos = [...lv.start];

    const cells = [];
    for (let r = 0; r < lv.rows; r++) {
      cells[r] = [];
      for (let c = 0; c < lv.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'maze-cell';
        const isWall = lv.walls.some(w => w[0] === r && w[1] === c);
        if (isWall) cell.classList.add('maze-wall');
        if (r === lv.end[0] && c === lv.end[1]) cell.classList.add('maze-exit');
        cells[r][c] = cell;
        mazeGrid.appendChild(cell);
      }
    }

    function render() {
      for (let r = 0; r < lv.rows; r++)
        for (let c = 0; c < lv.cols; c++)
          cells[r][c].innerText = '';
      cells[playerPos[0]][playerPos[1]].innerText = '🦕';
    }

    function tryMove(dr, dc) {
      const nr = playerPos[0] + dr;
      const nc = playerPos[1] + dc;
      if (nr < 0 || nr >= lv.rows || nc < 0 || nc >= lv.cols) return;
      if (cells[nr][nc].classList.contains('maze-wall')) { Audio.error(); return; }
      Audio.click();
      playerPos = [nr, nc];
      render();
      if (nr === lv.end[0] && nc === lv.end[1]) {
        Audio.success();
        score++;
        $('mod8-counter').innerText = `🌿 Fases: ${score} / 3`;
        document.onkeydown = null;
        setTimeout(() => startLevel(idx + 1), 800);
      }
    }

    // Botões na tela
    $('maze-up').onclick    = () => tryMove(-1,  0);
    $('maze-down').onclick  = () => tryMove( 1,  0);
    $('maze-left').onclick  = () => tryMove( 0, -1);
    $('maze-right').onclick = () => tryMove( 0,  1);

    // Teclado também funciona
    document.onkeydown = (e) => {
      if (e.key === 'ArrowUp'    || e.key === 'w') tryMove(-1,  0);
      if (e.key === 'ArrowDown'  || e.key === 's') tryMove( 1,  0);
      if (e.key === 'ArrowLeft'  || e.key === 'a') tryMove( 0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd') tryMove( 0,  1);
    };

    render();
  }

  startLevel(0);
}
