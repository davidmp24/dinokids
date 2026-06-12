// ============================================================
//  DinoKids — audio.js
//  Sistema de áudio via Web Audio API (100% offline)
// ============================================================

const Audio = {
  ctx: null,
  muted: false,
  volume: 0.7,

  init(settings) {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { /* sem suporte */ }
    if (settings) {
      this.muted  = settings.muted  || false;
      this.volume = settings.volume !== undefined ? settings.volume : 0.7;
    }
  },

  _play(freq, type, duration, vol) {
    if (this.muted || !this.ctx) return;
    try {
      this.ctx.resume();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime((vol || 0.4) * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) { /* silencioso */ }
  },

  _chord(notes, type, dur) {
    notes.forEach((f, i) => setTimeout(() => this._play(f, type, dur, 0.3), i * 60));
  },

  click()       { this._play(440, 'sine', 0.1, 0.3); },
  hover()       { this._play(660, 'sine', 0.08, 0.15); },
  success()     { this._chord([523, 659, 784, 1047], 'triangle', 0.35); },
  error()       { this._play(220, 'sawtooth', 0.3, 0.25); },
  snap()        { this._chord([392, 523, 659], 'sine', 0.25); },
  celebrate()   { this._chord([523, 659, 784, 1047, 1319], 'sine', 0.6); },
  star()        { this._chord([880, 1109, 1319], 'triangle', 0.4); },
  rexRoar()     { this._play(180, 'sawtooth', 0.4, 0.5); },
  levelUp()     { [262,330,392,523].forEach((f,i)=>setTimeout(()=>this._play(f,'sine',0.3,0.4),i*120)); },

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
};
