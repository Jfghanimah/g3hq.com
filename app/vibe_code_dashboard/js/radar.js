// ══════════════════════════════════════════════
// RADAR
// ══════════════════════════════════════════════
const rCanvas = document.getElementById('radar-canvas');
const rCtx = rCanvas.getContext('2d');
let rAngle = 0;
let blips = [];
let threatCount = 0;
const radarLog = document.getElementById('radar-log');
const MAX_BLIPS = 7;

const radarDefcon = document.getElementById('radar-defcon');
const radarAirspace = document.getElementById('radar-airspace');
const radarBogeys = document.getElementById('radar-bogeys');
const radarSigint = document.getElementById('radar-sigint');

const THREATS = [
  // classic
  'KAREN DETECTED','ANOTHER CHAD','HARLEY SELLER [OFFENDED]',
  'CRYPTO BRO: LURKING','VALID EXCUSE: 0','UNSOLICITED ADVICE',
  'DEBT: VISIBLE','OVERCONFIDENCE: MAX','EX: ONLINE',
  'MOTIVATION: MISSING','COPE: INCOMING','RATIO: IMMINENT',
  'SIGMA: UNVERIFIED','RED FLAG: WAVING','BOOMER: ACTIVATED',
  'LOWBALLER DETECTED','NFT BRO APPROACHING','MARTINGALE USER',
  'RENT: UNPAID','DELUSION: CRITICAL','MAIN CHARACTER: CONFIRMED',
  'HELICOPTER PARENT: CIRCLING','CASSEROLE CRITIC DETECTED',
  'EMOTIONAL SUPPORT IGUANA: ESCAPED','DIET COKE REQUEST: PENDING',
  // schizo mode
  'CHEMTRAILS: CONFIRMED','5G SIGNAL: ACTIVE','THEY ARE IN THE WALLS',
  'SHADOW BAN: INCOMING','GLOBALISTS: LURKING','THEY ARE ONTO US',
  'MICROCHIP DETECTED','FLUORIDE: ACTIVE','THE SIMULATION: GLITCHING',
  'TARGETED INDIVIDUAL: CONFIRMED','CRISIS ACTOR: APPROACHING',
  'DEEP STATE: ONLINE','MATRIX: UPDATED','TIMELINE: SHIFTED',
  // gamer brain
  'SKILL ISSUE: CONFIRMED','AFK PLAYER DETECTED','TEAM: THROWING',
  'GAMER RAGE: BUILDING','TWITCH BAN: INCOMING','NO SCOPE: LOADING',
  'SPEEDRUNNER APPROACHING','STREAM SNIPER: DETECTED','GG EZ INCOMING',
  'FINAL BOSS: UNLOCKED','RESPAWN: DENIED','CLIP IT: YIKES',
  'MOD: AWAKE','LAG SPIKE DETECTED','RAGE QUIT: IMMINENT',
  // hustle/chud/internet
  'LINKEDIN BRO: POSTING','PODCAST BRO: CIRCLING','HUSTLE: TOXIC',
  'BASED OPINION DETECTED','NPC BEHAVIOR: CONFIRMED','GRINDSET: FAILING',
  'MORNING ROUTINE: INCOMING','COLD PLUNGE: INCOMING','ALPHA: UNVERIFIED',
  'GOYIM: NOTICING','NORMIE: APPROACHING','MIDWIT: DETECTED',
  'IRONY: POISONED','PARASOCIAL: ACTIVATED','DOOMER: ONLINE',
  // military / aircraft / terminal weirdness
  'AIR FORCE ONE: DRIFTING','NUCLEAR FOOTBALL: UNACCOUNTED FOR','SCRAMBLE ORDER: PENDING',
  'B-2 ECHO: RETURNING','ICBM LARP DETECTED','AIRSPACE BREACH: QUESTIONABLE',
  'AWACS BLIP: CIRCLING','MISSILE SILO DISCOURSE','STEALTH CONTACT: PROBABLY FINE',
  'UNIDENTIFIED FORMATION: APPROACHING','PIXEL ANOMALY: DESCENDING','ORBITAL INTRUSION DETECTED',
  'SATELLITE DEBRIS: ANNOYED','NUCLEAR SUB TWEETED','AIR RAID VIBES: IMMACULATE',
  // government waste
  'CONTRACTOR: BILLING','SUBSIDY: REQUESTED','AUDIT: NEVER',
  'TAXPAYER DOLLAR: MISSING','BUDGET: UNLIMITED','OVERSIGHT: ABSENT',
  'BIG YAHU: REQUESTING','MAGA-1: APPROACHING','PLTR: WATCHING',
  // inside jokes
  'DrDoughnut: AFK AGAIN','MORK: DREADLESS','GOAT GAMERS: GAMING',
  'WADDUP DOE DETECTED','EPSTEIN LIST: UNSEALED','GOAT GAMERS: THROWING',
  'MORK: HAIR SITUATION CRITICAL','DrDoughnut: STILL AFK',
  'RIOT GAMES: SUING SOMEONE','LEAGUE CLIENT: CRASHED',
  'CHUD DETECTED: MAXXING','GOY: NOTICING','SKILL ISSUE: GOAT GAMERS',
  'DrDoughnut: HAS NOT MOVED','DREADLOCK COUNT: 0 (MORK)',
  'GOAT GAMERS GAMING: GOATING','WADDUP DOE: WADDUP',
];

const AMBIENT_TRACKS = [
  { label:'AF1', x:-0.62, y:-0.18, vx:0.0018, vy:0.0005, color:'#7fd3ff', kind:'plane' },
  { label:'NUKE', x:0.48, y:-0.54, vx:-0.0011, vy:0.0013, color:'#ff6666', kind:'missile' },
  { label:'ECHO-1', x:-0.22, y:0.67, vx:0.0014, vy:-0.001, color:'#ff00ff', kind:'missile' },
  { label:'AWACS', x:0.68, y:0.18, vx:-0.0012, vy:-0.0007, color:'#ffd166', kind:'plane' },
  { label:'SAT-7', x:0.1, y:-0.74, vx:0.0008, vy:0.0015, color:'#00ffaa', kind:'sat' },
  { label:'DrDoughnut [AFK]', x:-0.35, y:0.42, vx:0.0, vy:0.0, color:'#ff9900', kind:'sat' },
];

function setupRadar() {
  const panel = document.getElementById('panel-radar');
  const titleH = 36;
  const hudH = 42;
  const logH = 84;
  const avail = panel.clientHeight - titleH - hudH - logH - 10;
  const size = Math.min(panel.clientWidth - 4, avail);
  rCanvas.width = panel.clientWidth;
  rCanvas.height = Math.max(size, 260);
}

function wrapTrack(track) {
  if(track.x > 0.88) track.x = -0.88;
  if(track.x < -0.88) track.x = 0.88;
  if(track.y > 0.88) track.y = -0.88;
  if(track.y < -0.88) track.y = 0.88;
}

function drawAmbientTrack(track, cx, cy, R, now) {
  const bx = cx + track.x * R;
  const by = cy + track.y * R;
  const heading = Math.atan2(track.vy, track.vx);
  const pulse = 0.55 + 0.45 * Math.sin(now / 280 + bx * 0.02);

  rCtx.save();
  rCtx.translate(bx, by);
  rCtx.rotate(heading);
  rCtx.strokeStyle = track.color;
  rCtx.fillStyle = track.color;
  rCtx.globalAlpha = 0.45 + pulse * 0.35;
  rCtx.lineWidth = 1.4;

  if(track.kind === 'plane') {
    rCtx.beginPath();
    rCtx.moveTo(9, 0);
    rCtx.lineTo(-5, -4);
    rCtx.lineTo(-1, 0);
    rCtx.lineTo(-5, 4);
    rCtx.closePath();
    rCtx.fill();
  } else if(track.kind === 'missile') {
    rCtx.beginPath();
    rCtx.moveTo(10, 0);
    rCtx.lineTo(-4, -3);
    rCtx.lineTo(-7, 0);
    rCtx.lineTo(-4, 3);
    rCtx.closePath();
    rCtx.fill();
  } else {
    rCtx.beginPath();
    rCtx.arc(0, 0, 4, 0, Math.PI * 2);
    rCtx.fill();
  }

  rCtx.globalAlpha = 0.22;
  rCtx.beginPath();
  rCtx.moveTo(-14, 0);
  rCtx.lineTo(-4, 0);
  rCtx.stroke();
  rCtx.restore();

  rCtx.fillStyle = `${track.color}`;
  rCtx.font = 'bold 10px Share Tech Mono,monospace';
  rCtx.fillText(track.label, bx + 8, by - 8);
}

function drawRadar() {
  const W = rCanvas.width;
  const H = rCanvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(cx, cy) - 10;
  const now = Date.now();

  rCtx.clearRect(0, 0, W, H);
  rCtx.save();
  rCtx.beginPath();
  rCtx.arc(cx, cy, R, 0, Math.PI * 2);
  rCtx.clip();

  rCtx.fillStyle = '#010801';
  rCtx.fillRect(0, 0, W, H);

  // moving terminal noise
  for(let i = 0; i < 26; i++) {
    const px = (now * 0.018 + i * 41) % W;
    const py = (i * 53 + now * 0.009) % H;
    rCtx.fillStyle = `rgba(0,255,65,${0.02 + (i % 5) * 0.01})`;
    rCtx.fillRect(px, py, 2, 2);
  }

  // concentric rings
  rCtx.strokeStyle = '#002a0a';
  rCtx.lineWidth = 1;
  for(let i = 1; i <= 4; i++) {
    rCtx.beginPath();
    rCtx.arc(cx, cy, R * i / 4, 0, Math.PI * 2);
    rCtx.stroke();
  }

  // crosshairs
  rCtx.strokeStyle = '#002008';
  rCtx.setLineDash([6, 6]);
  rCtx.beginPath();
  rCtx.moveTo(cx - R, cy);
  rCtx.lineTo(cx + R, cy);
  rCtx.moveTo(cx, cy - R);
  rCtx.lineTo(cx, cy + R);
  rCtx.stroke();
  rCtx.setLineDash([]);

  // moving sector wedges
  const sectorBase = now / 5000;
  for(let i = 0; i < 3; i++) {
    const start = sectorBase + i * (Math.PI * 0.67);
    const end = start + 0.23;
    rCtx.beginPath();
    rCtx.moveTo(cx, cy);
    rCtx.arc(cx, cy, R, start, end);
    rCtx.closePath();
    rCtx.fillStyle = 'rgba(0, 255, 65, 0.035)';
    rCtx.fill();
  }

  // sweep trail
  const trail = Math.PI * 0.62;
  for(let i = 0; i < 30; i++) {
    const a1 = rAngle - (trail * (i + 1) / 30);
    const a2 = rAngle - (trail * i / 30);
    rCtx.beginPath();
    rCtx.moveTo(cx, cy);
    rCtx.arc(cx, cy, R, a1, a2);
    rCtx.closePath();
    rCtx.fillStyle = `rgba(0,255,65,${(1 - i / 30) * 0.22})`;
    rCtx.fill();
  }

  // sweep line
  rCtx.strokeStyle = '#00ff41';
  rCtx.lineWidth = 2.5;
  rCtx.shadowColor = '#00ff41';
  rCtx.shadowBlur = 18;
  rCtx.beginPath();
  rCtx.moveTo(cx, cy);
  rCtx.lineTo(cx + Math.cos(rAngle) * R, cy + Math.sin(rAngle) * R);
  rCtx.stroke();
  rCtx.shadowBlur = 0;

  // ambient moving contacts
  AMBIENT_TRACKS.forEach(track => drawAmbientTrack(track, cx, cy, R, now));

  // blips
  blips.forEach(b => {
    const age = (now - b.born) / 1000;
    const alpha = Math.max(0, 1 - age / 8);
    if(alpha <= 0) return;
    const pulse = 0.5 + 0.5 * Math.sin(now / 180 + b.x * 5);
    const bx = cx + b.x * R;
    const by = cy + b.y * R;

    rCtx.strokeStyle = `rgba(255,0,255,${alpha * 0.28})`;
    rCtx.beginPath();
    rCtx.moveTo(bx - 12, by);
    rCtx.lineTo(bx + 12, by);
    rCtx.moveTo(bx, by - 12);
    rCtx.lineTo(bx, by + 12);
    rCtx.stroke();

    rCtx.fillStyle = `rgba(255,0,255,${alpha * (0.65 + 0.35 * pulse)})`;
    rCtx.shadowColor = '#ff00ff';
    rCtx.shadowBlur = 14 * alpha;
    rCtx.beginPath();
    rCtx.arc(bx, by, 7, 0, Math.PI * 2);
    rCtx.fill();
    rCtx.shadowBlur = 0;

    rCtx.fillStyle = `rgba(255,100,255,${alpha})`;
    rCtx.font = 'bold 11px Share Tech Mono,monospace';
    rCtx.fillText(b.label, bx + 10, by + 4);
  });

  rCtx.restore();

  rCtx.fillStyle = '#00aa30';
  rCtx.font = 'bold 13px Share Tech Mono,monospace';
  rCtx.textAlign = 'center';
  rCtx.fillText('N', cx, cy - R + 14);
  rCtx.fillText('S', cx, cy + R - 4);
  rCtx.textAlign = 'left';
  rCtx.fillText('E', cx + R - 14, cy + 5);
  rCtx.textAlign = 'right';
  rCtx.fillText('W', cx - R + 14, cy + 5);
  rCtx.textAlign = 'left';
}

function updateRadarHud() {
  const activeThreats = blips.length;
  radarBogeys.textContent = String(activeThreats + AMBIENT_TRACKS.length);
  radarDefcon.textContent = activeThreats >= 5 ? '1' : activeThreats >= 3 ? '2' : '3';
  radarAirspace.textContent = activeThreats >= 4 ? 'SATURATED' : activeThreats >= 2 ? 'CROWDED' : 'TRACKING';
  radarSigint.textContent = pick(['ACTIVE', 'SPICY', 'CURSED', 'NOISY', 'SCHIZO']);
}

function addRadarLog(threat, neutralized) {
  const now = new Date();
  const ts = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = neutralized
    ? `<span class="ts">[${ts}]</span> <span class="neut">✓ NEUTRALIZED: ${threat}</span>`
    : `<span class="ts">[${ts}]</span> <span class="threat">▶ ${threat}</span>`;
  radarLog.appendChild(el);
  radarLog.scrollTop = radarLog.scrollHeight;
  while(radarLog.children.length > 18) radarLog.removeChild(radarLog.firstChild);
}

function radarTick() {
  rAngle += 0.02;
  if(rAngle > Math.PI * 2) rAngle -= Math.PI * 2;

  AMBIENT_TRACKS.forEach(track => {
    track.x += track.vx;
    track.y += track.vy;
    wrapTrack(track);
  });

  // Ultra-rare pizza delivery hijack (~0.03% per tick ≈ once every ~55 seconds)
  if(Math.random() < 0.0003 && !pizzaMode && blips.length > 0) triggerPizzaMode();

  if(Math.random() < 0.012 && blips.length < MAX_BLIPS) {
    const angle = rAngle + (Math.random() - 0.5) * 0.5;
    const dist = rand(0.18, 0.88);
    const threat = pizzaMode ? pick(PIZZA_LABELS) : pick(THREATS);
    blips.push({ x:Math.cos(angle) * dist, y:Math.sin(angle) * dist, label:threat, born:Date.now() });
    threatCount++;
    document.getElementById('threat-count').textContent = threatCount;
    addRadarLog(threat, false);
  }

  blips = blips.filter(b => Date.now() - b.born < 9000);
  updateRadarHud();
  drawRadar();
  requestAnimationFrame(radarTick);
}

// ── NORAD DOSSIER ──
let dossierBlip = null;
const DOSSIER_CLASSES = ['ALPHA','BRAVO','CHARLIE','DELTA','OMEGA','SIGMA','CURSED','CLASSIFIED'];
const DOSSIER_ORIGINS = ['UNKNOWN ORIGIN','DEEP STATE','SECTOR 7B','RUSSIAN ORIGIN','DOMESTIC','CYBERSPACE','LOW EARTH ORBIT','CLASSIFIED'];
const DOSSIER_ACTIONS = ['SCRAMBLE JETS','MONITOR ONLY','AUDIT IMMEDIATELY','DEPLOY COUNTER-MEMES','CALL LAWYER','NO ACTION (YET)','THOUGHTS AND PRAYERS','INVOKE ARTICLE §69'];

function showDossier(blip) {
  dossierBlip = blip;
  document.getElementById('dossier-class').textContent = 'CLASSIFICATION: ' + pick(DOSSIER_CLASSES);
  document.getElementById('dossier-id').textContent = 'DESIGNATION: ' + blip.label;
  document.getElementById('dossier-threat').textContent = 'THREAT LEVEL: ' + randi(1,10) + '/10';
  document.getElementById('dossier-origin').textContent = 'ORIGIN: ' + pick(DOSSIER_ORIGINS);
  document.getElementById('dossier-action').textContent = 'RECOMMENDED ACTION: ' + pick(DOSSIER_ACTIONS);
  document.getElementById('radar-dossier').classList.add('show');
  playUiSound('modal-open');
}
function neutralizeDossier() {
  if(!dossierBlip) return;
  blips = blips.filter(b => b !== dossierBlip);
  playUiSound('neutralize');
  addRadarLog(dossierBlip.label, true);
  dossierBlip = null;
  document.getElementById('radar-dossier').classList.remove('show');
}
function dismissDossier() {
  dossierBlip = null;
  document.getElementById('radar-dossier').classList.remove('show');
}

rCanvas.addEventListener('click', e => {
  const rect = rCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const cx = rCanvas.width / 2;
  const cy = rCanvas.height / 2;
  const R = Math.min(cx, cy) - 10;
  let closest = null;
  let minDist = 28;

  blips.forEach(b => {
    const d = Math.hypot(mx - (cx + b.x * R), my - (cy + b.y * R));
    if(d < minDist) {
      minDist = d;
      closest = b;
    }
  });

  if(closest) {
    showDossier(closest);
  }
});

// ── ATC CHATTER ──
const ATC_LINES = [
  'AWACS says skill issue, over.',
  'AF1 requesting priority routing — again — over.',
  'BOGEY ECHO-9 claims to be a Doordash driver. Denied.',
  'DrDoughnut contact unresponsive. AFK confirmed.',
  'NUKE track: probably fine. Probably. Over.',
  'GOAT GAMERS callsign rejected. Not a real squadron. Over.',
  'SECTOR 7 says waddup doe.',
  'Mork inbound. No dreads. Repeat: no dreads. Over.',
  'INV-1 is NOT in the system. Yet it persists. Over.',
  'CONTROL: we see it. We are choosing not to act.',
  'AWACS reports: "gg ez". This is unprofessional.',
  'Unidentified contact claiming to be a "sigma jet". Denied.',
  'B-2 pilot said "ratio" on the secure channel. Under review.',
  'Epstein manifest detected in airspace. Classification: pending.',
  'PLTR-1 is monitoring this channel. Hi Peter.',
  'League client update in progress. Radar offline momentarily.',
  'SCRAMBLE order issued. Pilots still in loading screen.',
  'DrDoughnut has been AFK since last transmission. Over.',
];
let atcIdx = 0;
function tickAtcChatter() {
  const el = document.getElementById('atc-text');
  if(el) el.textContent = ATC_LINES[atcIdx % ATC_LINES.length];
  atcIdx++;
}
tickAtcChatter();
setInterval(tickAtcChatter, 5000);

// ── DEFCON FLASH ──
let defconFlashActive = false;
function triggerDefconFlash() {
  if(defconFlashActive) return;
  defconFlashActive = true;
  const hdr1 = document.getElementById('hdr1');
  const hdr2 = document.getElementById('hdr2');
  hdr1.classList.add('defcon-flash');
  hdr2.classList.add('defcon-flash');
  // Spawn hostile contact wave
  for(let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const dist = rand(0.3, 0.82);
    blips.push({ x:Math.cos(angle)*dist, y:Math.sin(angle)*dist, label:'HOSTILE CONTACT', born:Date.now() });
    threatCount++;
  }
  document.getElementById('threat-count').textContent = threatCount;
  document.getElementById('radar-defcon').textContent = '1';
  document.getElementById('radar-defcon').style.color = 'var(--red)';
  toast('🚨 DEFCON 1 :: HOSTILE FORMATION :: SECTOR 7 COMPROMISED', 'var(--red)');
  playUiSound('crash-alert');
  setTimeout(() => {
    hdr1.classList.remove('defcon-flash');
    hdr2.classList.remove('defcon-flash');
    document.getElementById('radar-defcon').style.color = '';
    defconFlashActive = false;
  }, 3000);
}
function scheduleDefconFlash() {
  setTimeout(() => { triggerDefconFlash(); scheduleDefconFlash(); }, randi(90,180) * 1000);
}
scheduleDefconFlash();

// ── PIZZA DELIVERY EVENT ──
let pizzaMode = false;
const PIZZA_LABELS = [
  'PIZZA HUT (14 MIN LATE)','DOORDASH #6969 ARRIVING','DRIVER: 1.9 STARS',
  'WINGS · ETA: NEVER','WRONG ADDRESS: CONFIRMED','ORDER: MYSTERIOUSLY CANCELLED',
  'EXTRA NAPKINS: DENIED','40PC MCNUGGET (WARM-ISH)','DRIVER ATE THE FRIES',
  'GRUBHUB: LOCATION UNKNOWN','UBER EATS: IN WRONG CITY','REFUND: DENIED',
];
function triggerPizzaMode() {
  if(pizzaMode) return;
  pizzaMode = true;
  blips.forEach(b => { b._savedLabel = b.label; b.label = pick(PIZZA_LABELS); });
  toast('🍕 RADAR HIJACK: DOORDASH TOOK OVER SECTOR 7. EST. DELIVERY: NEVER.', '#ff6600');
  playUiSound('modal-open');
  setTimeout(() => {
    blips.forEach(b => { if(b._savedLabel) b.label = b._savedLabel; });
    pizzaMode = false;
    toast('📡 RADAR RESTORED. YOUR FOOD IS COLD. REFUND DENIED.', 'var(--green)');
  }, 10000);
}

setupRadar();
updateRadarHud();
radarTick();
