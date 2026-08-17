// High-quality procedural Web Audio synthesizer for tactile kiosk feedback
// Zero external mp3 dependencies, ultra-low latency, and reliable offline operation

let audioCtx = null;
let isMuted = false;
let pourOsc = null;
let pourGain = null;
let pourFilter = null;
let pourInterval = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = muted;
  if (isMuted && pourOsc) {
    stopPourSound();
  }
}

export function getMuted() {
  return isMuted;
}

/**
 * Soft tactile click / tap
 */
export function playTapSound() {
  if (isMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }, 0);
}

/**
 * Melodic item select chime
 */
export function playSelectSound(pitch = 1) {
  if (isMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 523.25 * pitch; // C5 * pitch

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    osc2.frequency.setValueAtTime(baseFreq * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }, 0);
}

/**
 * Payment confirmation / scan chime
 */
export function playSuccessChime() {
  if (isMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const startTime = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }, 0);
}

/**
 * Procedural continuous liquid stream / pouring sound generator
 */
export function startPourSound() {
  if (isMuted || pourGain) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    pourFilter = ctx.createBiquadFilter();
    pourFilter.type = 'bandpass';
    pourFilter.frequency.setValueAtTime(650, ctx.currentTime);
    pourFilter.Q.setValueAtTime(3.5, ctx.currentTime);

    pourGain = ctx.createGain();
    pourGain.gain.setValueAtTime(0.01, ctx.currentTime);
    pourGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);

    whiteNoise.connect(pourFilter);
    pourFilter.connect(pourGain);
    pourGain.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
    pourOsc = whiteNoise;

    // Gentle water droplet modulation
    pourInterval = setInterval(() => {
      if (!pourFilter || !audioCtx) return;
      const rndFreq = 500 + Math.random() * 350;
      try {
        pourFilter.frequency.setTargetAtTime(rndFreq, audioCtx.currentTime, 0.05);
      } catch (e) {
        // ignore
      }
    }, 120);
  }, 0);
}

export function stopPourSound() {
  if (pourInterval) {
    clearInterval(pourInterval);
    pourInterval = null;
  }
  if (pourGain && audioCtx) {
    try {
      pourGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      setTimeout(() => {
        if (pourOsc) {
          try { pourOsc.stop(); } catch (e) {}
          pourOsc.disconnect();
          pourOsc = null;
        }
        if (pourGain) {
          pourGain.disconnect();
          pourGain = null;
        }
        if (pourFilter) {
          pourFilter.disconnect();
          pourFilter = null;
        }
      }, 450);
    } catch (e) {
      pourGain = null;
      pourOsc = null;
      pourFilter = null;
    }
  } else {
    pourGain = null;
    pourOsc = null;
    pourFilter = null;
  }
}

/**
 * Grand finish / Ready celebratory chime
 */
export function playDrinkReadyChime() {
  if (isMuted) return;
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.1 },  // E5
      { freq: 783.99, time: 0.2 },  // G5
      { freq: 1046.50, time: 0.3 }, // C6
      { freq: 1318.51, time: 0.45 } // E6
    ];

    chords.forEach(({ freq, time }) => {
      const startTime = ctx.currentTime + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }, 0);
}
