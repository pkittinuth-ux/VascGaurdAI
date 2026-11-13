// Web Audio API Synthesizer for VascGuard AI Robot Companion
// 100% client-side, zero external audio assets required

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioEnabled(enabled) {
  soundEnabled = enabled;
}

export function isAudioEnabled() {
  return soundEnabled;
}

// Gentle pleasant click/tap sound
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

// Robot startup friendly ascending chime (C5 -> E5 -> G5 -> C6)
export function playRobotStartSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
  });
}

// Soft hospital heart pulse blip
export function playHeartbeatSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz standard medical pulse blip
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// Joyful completion fanfare melody (Robot Happy Dance)
export function playCelebrationSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 523.25, dur: 0.12, start: 0.0 },   // C5
    { freq: 659.25, dur: 0.12, start: 0.12 },  // E5
    { freq: 783.99, dur: 0.12, start: 0.24 },  // G5
    { freq: 1046.5, dur: 0.28, start: 0.36 },  // C6
    { freq: 880.00, dur: 0.14, start: 0.66 },  // A5
    { freq: 1046.5, dur: 0.40, start: 0.82 },  // C6 hold
  ];

  melody.forEach(note => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + note.start);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + note.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.start + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + note.start);
    osc.stop(ctx.currentTime + note.start + note.dur + 0.05);
  });
}

