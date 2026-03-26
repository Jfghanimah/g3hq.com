// ══ APP INIT ══
// Cross-module resize handler
window.addEventListener('resize', () => {
  setupRadar();
  drawFlightMap();
});

// ══ VIBE CODE DOCK ══
const DOCK_STATES = ['dock-mini', 'dock-mid', 'dock-full'];
let dockStateIdx = 1;
const dockEl = document.getElementById('vibe-code-dock');

function setDockState(idx) {
  DOCK_STATES.forEach(s => dockEl.classList.remove(s));
  if(idx !== 1) dockEl.classList.add(DOCK_STATES[idx]);
  dockStateIdx = idx;
}

document.getElementById('vibe-code-shrink').addEventListener('click', () => {
  setDockState(Math.max(0, dockStateIdx - 1));
});
document.getElementById('vibe-code-expand').addEventListener('click', () => {
  setDockState(Math.min(DOCK_STATES.length - 1, dockStateIdx + 1));
});

// Animate vibe code metrics
const VIBE_MODES = ['SHIP IT','YOLO PUSH','REFACTOR','VIBE ONLY','NO TESTS'];
const VIBE_STATUSES = ['GENERATING','HALLUCINATING','COMPILING','CRASHING','VIBING'];
setInterval(() => {
  document.getElementById('vibe-code-tokens').textContent = (Math.floor(Math.random()*9000)+1000).toLocaleString();
  document.getElementById('vibe-code-files').textContent = randi(1,24);
  if(Math.random() < 0.3) document.getElementById('vibe-code-mode').textContent = pick(VIBE_MODES);
  if(Math.random() < 0.4) document.getElementById('vibe-code-status').textContent = pick(VIBE_STATUSES);
}, 2200);

// ══ MCNUGGET TRACKER ══
const MCNUGGET_STAGES = [
  { text:'🍗 ORDER PLACED: 40PC MCNUGGET · EST. 22 MIN', color:'var(--cyan)' },
  { text:'🍗 RESTAURANT CONFIRMED · UPDATED ETA: 30 MIN', color:'var(--cyan)' },
  { text:'🍗 DRIVER ASSIGNED · ETA: 45 MIN (TRAFFIC)', color:'var(--amber)' },
  { text:'🍗 OUT FOR DELIVERY · ETA: 55 MIN (DETOUR)', color:'var(--amber)' },
  { text:'🍗 DRIVER NEARBY · ETA: 67 MIN (???)', color:'var(--amber)' },
  { text:'🍗 DRIVER HAS STOPPED MOVING · ETA: UNKNOWN', color:'var(--red)' },
  { text:'🍗 YOUR ORDER MAY BE DELAYED · ETA: RECALCULATING...', color:'var(--red)' },
  { text:'🍗 DRIVER\'S PHONE OFF · SUPPORT TICKET: OPENED', color:'var(--red)' },
  { text:'💀 DRIVER ATE YOUR FOOD. ORDER CLOSED. REFUND: DENIED.', color:'var(--red)' },
];
let mcnuggetStage = 0;
const mcnuggetEl = document.getElementById('mcnugget-tracker');
const mcnuggetText = document.getElementById('mcnugget-text');
const MCNUGGET_DELAYS = [0, 18000, 25000, 20000, 18000, 22000, 20000, 25000, 30000];

function advanceMcnugget() {
  if(mcnuggetStage >= MCNUGGET_STAGES.length) {
    setTimeout(() => { mcnuggetEl.classList.remove('show'); }, 8000);
    return;
  }
  const stage = MCNUGGET_STAGES[mcnuggetStage];
  mcnuggetText.textContent = stage.text;
  mcnuggetText.style.color = stage.color;
  mcnuggetEl.style.borderColor = stage.color;
  mcnuggetEl.classList.add('show');
  mcnuggetStage++;
  const delay = MCNUGGET_DELAYS[mcnuggetStage] || 30000;
  setTimeout(advanceMcnugget, delay);
}
// Start after ~90 seconds
setTimeout(advanceMcnugget, 90000);
