// ══════════════════════════════════════════════
// UAP DRONE CAM / AI CODEGEN
// ══════════════════════════════════════════════
const ufoCanvas = document.getElementById('ufo-cam');
const ufoCtx = ufoCanvas.getContext('2d');
const ufoCode = document.getElementById('ufo-code');
const ufoStatus = document.getElementById('ufo-status');
const ufoOverlay = document.getElementById('ufo-overlay');
const ufoRetargetBtn = document.getElementById('ufo-retarget');
const ufoJamBtn = document.getElementById('ufo-jam');

const UAP_TARGETS = ['ORB-7', 'DISC-12', 'TIC_TAC-3', 'PYRAMID-9', 'JELLYFISH-4'];
const UAP_LOCATIONS = ['SECTOR 7B', 'LOW EARTH LARP', 'CHICAGO SKYBOX', 'ATLANTIC GRID', 'MOON VIBES'];
const CODE_LINES = [
  () => `<span class="ufo-code-comment"># inference: silhouette confidence rising</span>`,
  () => `<span class="ufo-code-func">def</span> classify_contact(frame):`,
  () => `    return "uap" <span class="ufo-code-warn">if</span> frame["vibes"] > <span class="ufo-code-num">9000</span> else "weather balloon"`,
  () => `trajectory.append(sample(lat=<span class="ufo-code-num">${rand(31, 54).toFixed(3)}</span>, lon=<span class="ufo-code-num">${rand(-124, 28).toFixed(3)}</span>))`,
  () => `model.prompt("explain why this orb is tax funded")`,
  () => `camera.lock_target("${pick(UAP_TARGETS)}")`,
  () => `threat_score += <span class="ufo-code-num">${randi(1, 4)}</span>  <span class="ufo-code-comment"># operator says this seems bad</span>`,
  () => `if object.turn_rate > <span class="ufo-code-num">${randi(70, 140)}</span>: panic()`,
  () => `emit_report("AWACS says skill issue, over")`,
  () => `orbital_guess = "${pick(['not a plane', 'probably aliens', 'definitely Raytheon', 'space invader boss'])}"`,
  () => `for packet in sigint_stream: redact(packet)`,
  () => `heatmap["${pick(UAP_LOCATIONS)}"] += <span class="ufo-code-num">${randi(2, 9)}</span>`,
];

let ufoTarget = pick(UAP_TARGETS);
let ufoLoc = pick(UAP_LOCATIONS);
let ufoJamUntil = 0;
const ufoState = {
  x: 0.26,
  y: 0.36,
  vx: 0.0014,
  vy: 0.0011,
  t: 0,
};

function resizeUfoCam() {
  const rect = ufoCanvas.getBoundingClientRect();
  ufoCanvas.width = Math.max(10, Math.floor(rect.width));
  ufoCanvas.height = Math.max(10, Math.floor(rect.height));
}

function pushCodeLine(forceText) {
  const line = document.createElement('span');
  line.className = 'ufo-code-line';
  line.innerHTML = forceText || pick(CODE_LINES)();
  ufoCode.appendChild(line);
  while(ufoCode.children.length > 20) ufoCode.removeChild(ufoCode.firstChild);
  ufoCode.scrollTop = ufoCode.scrollHeight;
}

function retargetUfo() {
  ufoTarget = pick(UAP_TARGETS);
  ufoLoc = pick(UAP_LOCATIONS);
  ufoStatus.textContent = `TRACKING: ${ufoTarget}`;
  ufoOverlay.textContent = `LIVE FEED · ${ufoLoc} · CLASSIFIED`;
  ufoState.vx = rand(-0.0022, 0.0022);
  ufoState.vy = rand(-0.0018, 0.0018);
  pushCodeLine(`retarget("${ufoTarget}", sector="${ufoLoc}")`);
}

function jamFeed() {
  ufoJamUntil = Date.now() + 1800;
  pushCodeLine(`<span class="ufo-code-warn">feed_state = "jammed"</span>`);
}

function drawUfoCam() {
  const W = ufoCanvas.width;
  const H = ufoCanvas.height;
  const now = Date.now();
  ufoState.t += 1;
  ufoState.x += ufoState.vx;
  ufoState.y += ufoState.vy;

  if(ufoState.x < 0.16 || ufoState.x > 0.84) ufoState.vx *= -1;
  if(ufoState.y < 0.18 || ufoState.y > 0.78) ufoState.vy *= -1;

  ufoCtx.clearRect(0, 0, W, H);
  ufoCtx.fillStyle = '#020704';
  ufoCtx.fillRect(0, 0, W, H);

  for(let i = 0; i < 10; i++) {
    const alpha = 0.03 + (i % 3) * 0.02;
    ufoCtx.fillStyle = `rgba(0,255,65,${alpha})`;
    ufoCtx.fillRect(0, (i * 17 + now / 32) % H, W, 1);
  }

  const tx = W * ufoState.x;
  const ty = H * ufoState.y;
  const glow = 0.45 + 0.25 * Math.sin(now / 190);

  ufoCtx.strokeStyle = 'rgba(0,255,65,0.24)';
  ufoCtx.beginPath();
  ufoCtx.moveTo(tx - 30, ty);
  ufoCtx.lineTo(tx + 30, ty);
  ufoCtx.moveTo(tx, ty - 24);
  ufoCtx.lineTo(tx, ty + 24);
  ufoCtx.stroke();

  ufoCtx.fillStyle = `rgba(170,255,220,${0.35 + glow * 0.35})`;
  ufoCtx.shadowColor = '#91ffd0';
  ufoCtx.shadowBlur = 18;
  ufoCtx.beginPath();
  ufoCtx.ellipse(tx, ty, 20, 8, 0, 0, Math.PI * 2);
  ufoCtx.fill();
  ufoCtx.beginPath();
  ufoCtx.arc(tx, ty - 4, 7, 0, Math.PI * 2);
  ufoCtx.fill();
  ufoCtx.shadowBlur = 0;

  if(now < ufoJamUntil) {
    for(let i = 0; i < 24; i++) {
      ufoCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ufoCtx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
  }

  requestAnimationFrame(drawUfoCam);
}

ufoRetargetBtn.addEventListener('click', retargetUfo);
ufoJamBtn.addEventListener('click', jamFeed);
ufoCanvas.addEventListener('click', retargetUfo);
window.addEventListener('resize', resizeUfoCam);

resizeUfoCam();
retargetUfo();
for(let i = 0; i < 10; i++) pushCodeLine();
setInterval(() => pushCodeLine(), 850);
setInterval(() => {
  if(Math.random() < 0.45) retargetUfo();
}, 9000);
drawUfoCam();
