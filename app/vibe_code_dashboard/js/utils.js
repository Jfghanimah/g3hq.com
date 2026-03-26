// ══ UTILS ══
const rand  = (a,b) => Math.random()*(b-a)+a;
const randi = (a,b) => Math.floor(rand(a,b+1));
const pick  = arr  => arr[Math.floor(Math.random()*arr.length)];
const pad2  = n    => String(n).padStart(2,'0');

const DASH_VOLUME_KEY = 'vibe-dashboard-volume';
const DEFAULT_DASH_VOLUME = 0.18;
const AUDIO_HEADROOM = 0.45;
let dashVolume = Number(localStorage.getItem(DASH_VOLUME_KEY) ?? DEFAULT_DASH_VOLUME);
if(Number.isNaN(dashVolume)) dashVolume = DEFAULT_DASH_VOLUME;

let audioCtx;
let audioUnlocked = false;

function getAudioContext() {
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function getMusicElement() {
  return document.getElementById('bg-music');
}

function getMusicBaseVolume() {
  return Math.max(0, Math.min(1, dashVolume * 0.07));
}

function setDashVolume(nextVolume) {
  dashVolume = Math.max(0, Math.min(1, nextVolume));
  localStorage.setItem(DASH_VOLUME_KEY, String(dashVolume));
  const slider = document.getElementById('master-volume');
  const label = document.getElementById('master-volume-val');
  if(slider) slider.value = String(Math.round(dashVolume * 100));
  if(label) label.textContent = `${Math.round(dashVolume * 100)}%`;
  const music = getMusicElement();
  if(music) music.volume = getMusicBaseVolume();
}

function unlockAudio() {
  if(audioUnlocked) return;
  audioUnlocked = true;
  getAudioContext().resume().catch(() => {});
  const music = getMusicElement();
  if(music) {
    music.volume = getMusicBaseVolume();
    music.play().catch(() => {});
  }
}

function getOutputVolume(level = 1) {
  return Math.max(0, Math.min(1, level * dashVolume * AUDIO_HEADROOM));
}

function playAudioClip(src, {
  volume = 0.25,
  delay = 0,
  startTime = 0,
  maxDuration = 0,
  fadeOutDuration = 0,
  duckMusic = 0,
} = {}) {
  if(!dashVolume || !audioUnlocked) return;
  const startPlayback = () => {
    if(!audioUnlocked) return;
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = getOutputVolume(volume);
    const music = getMusicElement();
    let restoreMusicTimer = null;
    let began = false;

    if(music && duckMusic > 0) {
      music.volume = Math.max(0, getMusicBaseVolume() * (1 - duckMusic));
    }

    const stopPlayback = () => {
      audio.pause();
      audio.currentTime = 0;
      if(restoreMusicTimer) clearTimeout(restoreMusicTimer);
      if(music && duckMusic > 0) music.volume = getMusicBaseVolume();
    };

    if(maxDuration > 0) {
      if(fadeOutDuration > 0 && fadeOutDuration <= maxDuration) {
        const fadeStart = Math.max(0, maxDuration - fadeOutDuration) * 1000;
        setTimeout(() => {
          const initialVolume = audio.volume;
          const steps = 10;
          let step = 0;
          const fadeTimer = setInterval(() => {
            step++;
            audio.volume = Math.max(0, initialVolume * (1 - step / steps));
            if(step >= steps) {
              clearInterval(fadeTimer);
              stopPlayback();
            }
          }, (fadeOutDuration * 1000) / steps);
        }, fadeStart);
      } else {
        setTimeout(stopPlayback, maxDuration * 1000);
      }
    }

    const begin = () => {
      if(began) return;
      began = true;
      if(startTime > 0) {
        try {
          audio.currentTime = Math.min(startTime, Number.isFinite(audio.duration) ? Math.max(0, audio.duration - 0.05) : startTime);
        } catch {}
      }
      audio.play().catch(() => {});
      if(music && duckMusic > 0 && maxDuration > 0) {
        restoreMusicTimer = setTimeout(() => {
          music.volume = getMusicBaseVolume();
        }, maxDuration * 1000);
      }
    };

    audio.addEventListener('loadedmetadata', begin, { once:true });
    audio.load();
    if(audio.readyState >= 1) begin();
  };

  if(delay > 0) {
    setTimeout(startPlayback, delay * 1000);
  } else {
    startPlayback();
  }
}

function playTone(freq, duration, {
  type = 'sine',
  volume = 0.4,
  delay = 0,
  attack = 0.01,
  release = 0.12,
} = {}) {
  if(!dashVolume || !audioUnlocked) return;
  const ctx = getAudioContext();
  const startAt = ctx.currentTime + delay;
  const stopAt = startAt + duration;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(getOutputVolume(volume), startAt + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopAt + release);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(stopAt + release);
}

function playUiSound(kind = 'toast') {
  if(!audioUnlocked) return;
  switch(kind) {
    case 'modal-open':
      playTone(392, 0.12, { type:'triangle', volume:0.18 });
      playTone(523.25, 0.14, { type:'triangle', volume:0.22, delay:0.06 });
      playTone(659.25, 0.18, { type:'sine', volume:0.18, delay:0.14 });
      break;
    case 'approve':
    case 'cash':
      // cash register cha-ching
      playTone(980,  0.025, { type:'square', volume:0.10 });
      playTone(760,  0.03,  { type:'square', volume:0.08, delay:0.035 });
      playTone(1220, 0.035, { type:'square', volume:0.11, delay:0.075 });
      playTone(1568, 0.06,  { type:'triangle', volume:0.11, delay:0.12 });
      playTone(2093, 0.18,  { type:'sine', volume:0.15, delay:0.18, release:0.26 });
      break;
    case 'deny':
      playTone(330, 0.08, { type:'sawtooth', volume:0.12 });
      playTone(247, 0.18, { type:'sawtooth', volume:0.16, delay:0.07 });
      break;
    case 'block':
      playTone(220, 0.06, { type:'square', volume:0.1 });
      playTone(180, 0.1, { type:'square', volume:0.14, delay:0.05 });
      break;
    case 'neutralize':
      playTone(740, 0.05, { type:'square', volume:0.09 });
      playTone(880, 0.08, { type:'square', volume:0.12, delay:0.04 });
      break;
    case 'crash-alert':
      // emergency alarm sweep
      playTone(880, 0.08, { type:'sawtooth', volume:0.18 });
      playTone(440, 0.08, { type:'sawtooth', volume:0.20, delay:0.10 });
      playTone(880, 0.08, { type:'sawtooth', volume:0.18, delay:0.20 });
      playTone(440, 0.18, { type:'sawtooth', volume:0.20, delay:0.30 });
      break;
    case 'crash-investigate':
      // curious ascending pings
      playTone(440,  0.07, { type:'sine', volume:0.12 });
      playTone(587,  0.07, { type:'sine', volume:0.13, delay:0.10 });
      playTone(784,  0.10, { type:'sine', volume:0.14, delay:0.20 });
      playTone(1047, 0.12, { type:'sine', volume:0.13, delay:0.32, release:0.2 });
      break;
    case 'crash-coverup':
      // descending ominous tones
      playTone(330, 0.10, { type:'sawtooth', volume:0.13 });
      playTone(277, 0.10, { type:'sawtooth', volume:0.15, delay:0.09 });
      playTone(220, 0.22, { type:'sawtooth', volume:0.16, delay:0.18, release:0.3 });
      break;
    case 'bj-deal':
      playTone(800,  0.025, { type:'square', volume:0.07 });
      playTone(1000, 0.025, { type:'square', volume:0.08, delay:0.07 });
      break;
    case 'bj-hit':
      playTone(900, 0.02, { type:'square', volume:0.08 });
      break;
    case 'bj-win':
      playTone(440, 0.06, { type:'sine', volume:0.13 });
      playTone(554, 0.07, { type:'sine', volume:0.14, delay:0.07 });
      playTone(659, 0.12, { type:'sine', volume:0.16, delay:0.15, release:0.2 });
      break;
    case 'bj-loss':
      playTone(330, 0.08, { type:'sine', volume:0.10 });
      playTone(262, 0.14, { type:'sine', volume:0.12, delay:0.09, release:0.2 });
      break;
    case 'bj-bust':
      playTone(440, 0.04, { type:'sawtooth', volume:0.10 });
      playTone(330, 0.04, { type:'sawtooth', volume:0.12, delay:0.06 });
      playTone(220, 0.14, { type:'sawtooth', volume:0.14, delay:0.12, release:0.2 });
      break;
    case 'slots-spin':
      for(let i=0;i<7;i++) playTone(180+i*22, 0.02, {type:'square', volume:0.05, delay:i*0.035});
      break;
    case 'slots-stop':
      playTone(500, 0.04, { type:'square', volume:0.09 });
      break;
    case 'slots-win':
      playTone(523, 0.07, { type:'sine', volume:0.13 });
      playTone(659, 0.07, { type:'sine', volume:0.14, delay:0.09 });
      playTone(784, 0.11, { type:'sine', volume:0.15, delay:0.18 });
      break;
    case 'slots-jackpot':
      playTone(523,  0.06, { type:'triangle', volume:0.16 });
      playTone(659,  0.06, { type:'triangle', volume:0.17, delay:0.07 });
      playTone(784,  0.06, { type:'triangle', volume:0.18, delay:0.14 });
      playTone(1047, 0.06, { type:'triangle', volume:0.18, delay:0.21 });
      playTone(1319, 0.16, { type:'sine',     volume:0.20, delay:0.29, release:0.3 });
      break;
    case 'slots-curse':
      playTone(220, 0.10, { type:'sawtooth', volume:0.14 });
      playTone(185, 0.10, { type:'sawtooth', volume:0.16, delay:0.11 });
      playTone(147, 0.22, { type:'sawtooth', volume:0.18, delay:0.22, release:0.3 });
      break;
    case 'plane-depart':
      // brief upward whoosh
      playTone(587, 0.05, { type:'sine', volume:0.08 });
      playTone(784, 0.08, { type:'sine', volume:0.10, delay:0.07 });
      break;
    case 'league-alert':
      playTone(698.46, 0.08, { type:'triangle', volume:0.13 });
      playTone(932.33, 0.10, { type:'triangle', volume:0.16, delay:0.07 });
      break;
    case 'league-confirm':
      playTone(587.33, 0.06, { type:'triangle', volume:0.12 });
      playTone(783.99, 0.08, { type:'triangle', volume:0.14, delay:0.05 });
      playTone(987.77, 0.10, { type:'sine', volume:0.15, delay:0.11 });
      break;
    default:
      playTone(523.25, 0.06, { type:'sine', volume:0.08 });
      break;
  }
}

function bootEnter() {
  const splash = document.getElementById('boot-splash');
  if(splash) {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  }
  unlockAudio();
}

document.addEventListener('pointerdown', unlockAudio, { once:true });
document.addEventListener('keydown', e => { if(document.getElementById('boot-splash')) bootEnter(); else unlockAudio(); }, { once:true });
setDashVolume(dashVolume);

const volumeSlider = document.getElementById('master-volume');
if(volumeSlider) {
  volumeSlider.addEventListener('input', e => {
    setDashVolume(Number(e.target.value) / 100);
  });
}

let toastTimer;
function toast(msg, color='var(--green)', silent=false) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.borderColor = color; el.style.color = color;
  el.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 5000);
  if(!silent) playUiSound('toast');
}
