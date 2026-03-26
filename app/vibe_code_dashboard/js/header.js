// ══ BUILD NUMBER ══
fetch('/build-number')
  .then(r => r.json())
  .then(d => {
    const b = d.build;
    const hdr = document.getElementById('hdr-build');
    const boot = document.getElementById('boot-build');
    if (hdr) hdr.textContent = b;
    if (boot) boot.textContent = b;
  });

// ══ FULLSCREEN ══
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('fs-btn');
  if (btn) btn.textContent = document.fullscreenElement ? '[ ✕ FS ]' : '[ ⛶ FS ]';
});
document.addEventListener('keydown', e => {
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
});

// ══ CLOCK ══
function updateClock() {
  const n = new Date();
  document.getElementById('hdr-clock').textContent = pad2(n.getHours())+':'+pad2(n.getMinutes())+':'+pad2(n.getSeconds());
}
setInterval(updateClock,1000); updateClock();

// ══ HEADER BARS ══
function fluctBar(valId, barId, min, max) {
  const v = randi(min,max);
  const ve = document.getElementById(valId), be = document.getElementById(barId);
  if(ve) ve.textContent = v+'%';
  if(be) be.style.width = v+'%';
}
setInterval(()=>{
  fluctBar('cpu-val','cpu-bar',10,95);
  fluctBar('ram-val','ram-bar',40,97);
  fluctBar('sigma-val','sigma-bar',10,60);
  fluctBar('hopium-val','hopium-bar',80,99);
  fluctBar('cope-val','cope-bar',70,98);
},2000);

// ══ BANK ACCOUNT STATE ══
let checkingBalance = 5;
let savingsBalance = 0;
let creditCardBalance = 10000;
const creditCardLimit = 15000;

function updateBankUI() {
  const checkingEl = document.getElementById('bank-checking');
  const savingsEl = document.getElementById('bank-savings');
  const creditEl = document.getElementById('bank-cc');
  const netEl = document.getElementById('bank-net');
  const statusEl = document.getElementById('bank-status');

  if(checkingEl) checkingEl.textContent = '$' + checkingBalance.toFixed(2);
  if(savingsEl) savingsEl.textContent = '$' + savingsBalance.toFixed(2);
  if(creditEl) creditEl.textContent = `$${creditCardBalance.toLocaleString()}/$15k`;

  const netWorth = checkingBalance + savingsBalance + cryptoPortValue - creditCardBalance;
  if(netEl) {
    const netPrefix = netWorth >= 0 ? '$' : '-$';
    netEl.textContent = `${netPrefix}${Math.abs(netWorth).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    netEl.className = 'bank-val ' + (netWorth >= 0 ? 'v-green' : 'v-red');
  }

  if(statusEl) {
    const utilization = creditCardLimit ? creditCardBalance / creditCardLimit : 0;
    if(utilization >= 0.95) {
      statusEl.textContent = 'MAXED';
      statusEl.className = 'bank-val v-magenta pulse';
    } else if(utilization >= 0.75) {
      statusEl.textContent = 'DANGEROUS';
      statusEl.className = 'bank-val v-red pulse';
    } else if(utilization >= 0.5) {
      statusEl.textContent = 'COOKED';
      statusEl.className = 'bank-val v-amber';
    } else {
      statusEl.textContent = 'SURVIVING';
      statusEl.className = 'bank-val v-green';
    }
  }
}

function updateChecking() {
  checkingBalance = Math.max(0, Number(checkingBalance) || 0);
  updateBankUI();
}

function spendMoney(amount) {
  const cost = Math.max(0, Number(amount) || 0);
  const fromChecking = Math.min(checkingBalance, cost);
  checkingBalance -= fromChecking;
  const remainder = cost - fromChecking;
  if(remainder > 0) {
    creditCardBalance = Math.min(creditCardLimit, creditCardBalance + remainder);
  }
  updateBankUI();
}

function addMoney(amount) {
  checkingBalance += Math.max(0, Number(amount) || 0);
  updateBankUI();
}

// ══ IRS AUDIT LEVEL ══
let irsLevel = 0;
function spikeIRS(amount) {
  irsLevel = Math.min(irsLevel + (amount || randi(1,3)), 99);
  const el = document.getElementById('irs-level');
  if(el) el.textContent = 'LVL ' + irsLevel;
}

// ══ BANK ══
let cryptoPortValue = 69;
setInterval(()=>{
  cryptoPortValue = Math.max(1, cryptoPortValue + randi(-15,12));
  document.getElementById('crypto-port').textContent = '$'+cryptoPortValue;
  updateBankUI();
},4000);

updateBankUI();
