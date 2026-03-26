// ══ APP INIT ══
// Cross-module resize handler
window.addEventListener('resize', () => {
  setupRadar();
  drawFlightMap();
});

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
  // This intentionally escalates from normal delivery updates into a doomed-order bit.
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
