// ══════════════════════════════════════════════
// TRADING TERMINAL — GBM STOCKS
// ══════════════════════════════════════════════

const STOCKS = [
  { sym:'HRLYCOIN', name:'Harley Davidson DeFi',    price:8.50,  mu:-0.0008, sigma:0.032, color:'#ff6600' },
  { sym:'COPE.INC', name:'Cope Industries Corp',    price:4.20,  mu:0.0004,  sigma:0.028, color:'#b44dff' },
  { sym:'PLTR',     name:'Palantir Technologies',   price:22.00, mu:0.0010,  sigma:0.018, color:'#00d4ff' },
  { sym:'SIGMA',    name:'Sigma Grindset ETF',       price:13.00, mu:-0.0004, sigma:0.030, color:'#ffd700' },
  { sym:'DOGE2',    name:'DogeCoin 2 (Reloaded)',    price:0.69,  mu:0.0015,  sigma:0.055, color:'#00ff41' },
  { sym:'GMBL',     name:'GamblerMax Holdings',      price:3.47,  mu:-0.0018, sigma:0.040, color:'#ff3333' },
];

const tradeAdvices = [
  '▶ DIAMOND HANDS (STATISTICALLY SUBOPTIMAL)',
  '▶ BUY THE DIP (IT KEEPS DIPPING)',
  '▶ TECHNICAL ANALYSIS: VIBES-BASED',
  '▶ THIS IS FINE. THE PORTFOLIO IS FINE.',
  '▶ SELL SIGNAL: IGNORED',
  '▶ DCA-ING INTO BANKRUPTCY',
  '▶ WARREN BUFFETT WOULD NOT APPROVE',
  '▶ YOLO MENTALITY: ENGAGED',
  '▶ BUY HIGH, SELL LOW (YOU WILL)',
  '▶ LOSS IS JUST A GAIN IN DISGUISE (IT IS NOT)',
  '▶ CHARTS ARE FOR CLOSERS',
  '▶ LINE GOING DOWN: BULLISH ACTUALLY',
  '▶ COPE AND HOLD',
  '▶ MARGIN CALL: PENDING',
  '▶ STOP LOSS: DISABLED (BAD IDEA)',
  '▶ THE LINE WILL RECOVER (HRLYCOIN WILL NOT)',
];

// Init price history
STOCKS.forEach(s => {
  s.history = [s.price];
  s.openPrice = s.price;
});

let currentStock = STOCKS[0];
const tradePositions = {};
STOCKS.forEach(s => { tradePositions[s.sym] = { shares: 0, avgCost: 0 }; });

// Box-Muller standard normal
function randn() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function gbmTick() {
  STOCKS.forEach(s => {
    const z = randn();
    s.price = Math.max(0.0001, s.price * Math.exp(s.mu + s.sigma * z));
    s.history.push(s.price);
    if(s.history.length > 80) s.history.shift();
  });
  updateTradeUI();
  drawTradeChart();
}

function drawTradeChart() {
  const canvas = document.getElementById('trade-chart');
  if(!canvas || !canvas.parentElement) return;
  const W = canvas.parentElement.clientWidth - 16;
  const H = 65;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#010301';
  ctx.fillRect(0, 0, W, H);

  const hist = currentStock.history;
  if(hist.length < 2) return;

  const minP = Math.min(...hist) * 0.998;
  const maxP = Math.max(...hist) * 1.002;
  const range = maxP - minP || minP * 0.01 || 0.001;

  // Open price baseline
  const baseY = H - ((currentStock.openPrice - minP) / range) * H;
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(W, baseY); ctx.stroke();
  ctx.setLineDash([]);

  const isUp = currentStock.price >= currentStock.openPrice;
  const lineColor = isUp ? '#00ff41' : '#ff3333';

  // Fill under line
  ctx.beginPath();
  hist.forEach((p, i) => {
    const x = (i / (hist.length - 1)) * W;
    const y = H - ((p - minP) / range) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = isUp ? 'rgba(0,255,65,0.07)' : 'rgba(255,51,51,0.07)';
  ctx.fill();

  // Price line
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = lineColor;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  hist.forEach((p, i) => {
    const x = (i / (hist.length - 1)) * W;
    const y = H - ((p - minP) / range) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Current price dot
  const lastX = W;
  const lastY = H - ((currentStock.price - minP) / range) * H;
  ctx.fillStyle = lineColor;
  ctx.shadowColor = lineColor;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(lastX - 2, lastY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function fmtPrice(p) {
  return p < 1 ? p.toFixed(4) : p.toFixed(2);
}

function updateTradeUI() {
  const s = currentStock;
  const pos = tradePositions[s.sym];
  const pct = (s.price - s.openPrice) / s.openPrice * 100;
  const isUp = pct >= 0;

  const priceEl = document.getElementById('tr-price');
  const deltaEl = document.getElementById('tr-delta');
  const symEl   = document.getElementById('tr-sym');
  if(!priceEl) return;

  symEl.textContent  = s.sym;
  symEl.style.color  = s.color;
  priceEl.textContent = '$' + fmtPrice(s.price);
  priceEl.style.color = isUp ? 'var(--green)' : 'var(--red)';
  deltaEl.textContent = (isUp ? '▲' : '▼') + Math.abs(pct).toFixed(2) + '%';
  deltaEl.style.color = isUp ? 'var(--green)' : 'var(--red)';

  document.getElementById('tr-shares').textContent = pos.shares;
  document.getElementById('tr-avg').textContent = pos.shares > 0 ? '$' + fmtPrice(pos.avgCost) : '--';

  const pnl = pos.shares * (s.price - pos.avgCost);
  const pnlEl = document.getElementById('tr-pnl');
  pnlEl.textContent = (pnl >= 0 ? '+$' : '-$') + Math.abs(pnl).toFixed(2);
  pnlEl.className = 's-val ' + (pnl >= 0 ? 'v-green' : 'v-red');

  const cashEl = document.getElementById('tr-cash');
  if(cashEl && typeof checkingBalance !== 'undefined') {
    cashEl.textContent = '$' + Math.max(0, checkingBalance).toFixed(2);
  }

  // Update ticker buttons
  document.querySelectorAll('.tr-sym-btn').forEach(btn => {
    const st = STOCKS.find(st => st.sym === btn.dataset.sym);
    if(!st) return;
    const chg = (st.price - st.openPrice) / st.openPrice * 100;
    btn.querySelector('.tr-btn-price').textContent = '$' + fmtPrice(st.price);
    btn.style.color = chg >= 0 ? 'var(--green)' : 'var(--red)';
    btn.style.borderColor = chg >= 0 ? '#1a3a1a' : '#3a1a1a';
  });
}

function tradeBuy() {
  const s = currentStock;
  if(typeof checkingBalance === 'undefined') return;
  const availableFunds = checkingBalance + Math.max(0, creditCardLimit - creditCardBalance);
  if(availableFunds < s.price) {
    toast('INSUFFICIENT FUNDS :: BALANCE $' + checkingBalance.toFixed(2) + ' :: PRICE $' + fmtPrice(s.price), 'var(--red)');
    playUiSound('deny');
    return;
  }
  const pos = tradePositions[s.sym];
  const newTotal = pos.shares * pos.avgCost + s.price;
  pos.shares++;
  pos.avgCost = newTotal / pos.shares;
  spendMoney(s.price);
  updateTradeUI();
  playUiSound('cash');
  document.getElementById('tr-advice').textContent = pick(tradeAdvices);
  toast('BOUGHT 1 ' + s.sym + ' @ $' + fmtPrice(s.price), s.color);
}

function tradeSell() {
  const s = currentStock;
  const pos = tradePositions[s.sym];
  if(pos.shares <= 0) {
    toast('NOTHING TO SELL :: HOLD NOTHING, LOSE NOTHING (WRONG — YOU LOSE ANYWAY)', 'var(--amber)');
    playUiSound('deny');
    return;
  }
  const pnl = s.price - pos.avgCost;
  addMoney(s.price);
  pos.shares--;
  if(pos.shares === 0) pos.avgCost = 0;
  updateTradeUI();
  playUiSound(pnl >= 0 ? 'bj-win' : 'bj-loss');
  document.getElementById('tr-advice').textContent = pick(tradeAdvices);
  toast('SOLD 1 ' + s.sym + ' @ $' + fmtPrice(s.price) + ' :: P&L: ' + (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2), pnl >= 0 ? 'var(--green)' : 'var(--red)');
}

function tradeSellAll() {
  const s = currentStock;
  const pos = tradePositions[s.sym];
  if(pos.shares <= 0) {
    toast('NOTHING TO LIQUIDATE :: ALREADY BROKE', 'var(--amber)');
    playUiSound('deny');
    return;
  }
  const proceeds = pos.shares * s.price;
  const pnl = proceeds - pos.shares * pos.avgCost;
  addMoney(proceeds);
  pos.shares = 0;
  pos.avgCost = 0;
  updateTradeUI();
  playUiSound(pnl >= 0 ? 'slots-jackpot' : 'bj-bust');
  document.getElementById('tr-advice').textContent = pick(tradeAdvices);
  toast('LIQUIDATED ' + s.sym + ' :: PROCEEDS $' + proceeds.toFixed(2) + ' :: P&L ' + (pnl >= 0 ? '+' : '') + '$' + pnl.toFixed(2), pnl >= 0 ? 'var(--green)' : 'var(--red)');
}

function selectStock(sym) {
  currentStock = STOCKS.find(s => s.sym === sym);
  document.querySelectorAll('.tr-sym-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sym === sym);
  });
  updateTradeUI();
  drawTradeChart();
}

function initTradeUI() {
  const row = document.getElementById('trade-ticker-row');
  if(!row) return;
  STOCKS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'tr-sym-btn' + (s === currentStock ? ' active' : '');
    btn.dataset.sym = s.sym;
    btn.style.borderColor = s === currentStock ? 'var(--cyan)' : '#1a3a1a';
    btn.innerHTML = `<span class="tr-btn-sym">${s.sym}</span><span class="tr-btn-price">$${fmtPrice(s.price)}</span>`;
    btn.onclick = () => selectStock(s.sym);
    row.appendChild(btn);
  });
}

initTradeUI();
updateTradeUI();
setInterval(gbmTick, 2000);
