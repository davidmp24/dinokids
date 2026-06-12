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
      if (nextId <= 6 && Progress.data.modules[nextId].unlocked) loadModule(nextId.toString());
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
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦕', target.x, target.y);
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

// --- MÓDULO 4: SEQUÊNCIA ---
function initMod4() {
  const example = $('mod4-example');
  const player = $('mod4-player');
  let score = 0;
  $('mod4-counter').innerText = `🔢 Sequências: ${score} / 5`;

  const seqs = [
    ['🥩', '🌿', '🥩'],
    ['🥚', '🦕', '🦖'],
    ['🌱', '🌳', '🍎'],
    ['🚜', '🐄', '🥛'],
    ['☀️', '🌧️', '🌈']
  ];

  function loadSeq(idx) {
    if(idx >= seqs.length) return completeCurrentModule(5);
    const target = seqs[idx];
    example.innerHTML = '';
    player.innerHTML = '';

    // Show example
    target.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'seq-card';
      card.innerText = icon;
      example.appendChild(card);
    });

    // Player area with dragged logic
    const shuffled = [...target].sort(() => Math.random() - 0.5);
    let dragged = null;

    shuffled.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'seq-card';
      card.innerText = icon;
      card.draggable = true;
      card.ondragstart = () => { dragged = card; Audio.hover(); };
      card.ondragover = e => e.preventDefault();
      card.ondrop = e => {
        e.preventDefault();
        if(dragged && dragged !== card) {
          const parent = player;
          const all = Array.from(parent.children);
          const draggedIdx = all.indexOf(dragged);
          const dropIdx = all.indexOf(card);
          
          if (draggedIdx < dropIdx) card.after(dragged);
          else card.before(dragged);
          Audio.snap();
        }
      };
      player.appendChild(card);
    });

    $('btn-check-seq').onclick = () => {
      if (!debounceClick()) return;
      const current = Array.from(player.children).map(c => c.innerText);
      if (current.join('') === target.join('')) {
        Audio.success();
        score++;
        $('mod4-counter').innerText = `🔢 Sequências: ${score} / 5`;
        Array.from(player.children).forEach(c => c.classList.add('correct'));
        setTimeout(() => loadSeq(idx + 1), 1000);
      } else {
        Audio.error();
        Array.from(player.children).forEach(c => c.classList.add('wrong'));
        setTimeout(() => {
          Array.from(player.children).forEach(c => c.classList.remove('wrong'));
        }, 500);
      }
    };
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
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🦕', 175, 175);

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
    ctx.fillText('🦕', 175, 175);
  };

  $('btn-done-paint').onclick = () => {
    if (!debounceClick()) return;
    completeCurrentModule(5);
  };
}
