// ============================================================
//  DinoKids — progress.js
//  Gerencia o progresso do jogador via localStorage
// ============================================================

const SAVE_KEY = 'dinokids_progress';

const defaultProgress = () => ({
  name: '',
  stars: 0,
  totalTime: 0,
  sessions: [],
  modules: {
    0: { unlocked: true,  completed: false, stars: 0 },
    1: { unlocked: false, completed: false, stars: 0 },
    2: { unlocked: false, completed: false, stars: 0 },
    3: { unlocked: false, completed: false, stars: 0 },
    4: { unlocked: false, completed: false, stars: 0 },
    5: { unlocked: false, completed: false, stars: 0 },
    6: { unlocked: false, completed: false, stars: 0 },
    7: { unlocked: false, completed: false, stars: 0 },
    8: { unlocked: false, completed: false, stars: 0 },
    bonus: { unlocked: false, completed: false, stars: 0 }
  },
  settings: { volume: 0.7, muted: false }
});

const Progress = {
  data: null,

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      this.data = raw ? JSON.parse(raw) : null;
    } catch(e) {
      this.data = null;
    }
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch(e) { /* ignore */ }
  },

  init(name) {
    this.data = defaultProgress();
    this.data.name = name;
    this.save();
    return this.data;
  },

  addStars(amount, module) {
    this.data.stars += amount;
    if (module !== undefined && this.data.modules[module]) {
      this.data.modules[module].stars += amount;
    }
    this.save();
  },

  completeModule(moduleId) {
    const next = moduleId + 1;
    if (this.data.modules[moduleId]) {
      this.data.modules[moduleId].completed = true;
    }
    if (this.data.modules[next] !== undefined) {
      this.data.modules[next].unlocked = true;
    }
    // Desbloquear bônus após módulo 8
    if (moduleId === 8) {
      this.data.modules['bonus'].unlocked = true;
    }
    this.save();
  },

  getModuleStars(moduleId) {
    return this.data.modules[moduleId]?.stars || 0;
  },

  addSession(durationMin, activitiesDone) {
    this.data.sessions.push({
      date: new Date().toLocaleDateString('pt-BR'),
      duration_min: durationMin,
      activities: activitiesDone
    });
    this.data.totalTime += durationMin;
    this.save();
  }
};
