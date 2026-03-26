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

// ══ CHECKING ACCOUNT BALANCE ══
let checkingBalance = 3.47;
function updateChecking() {
  const el = document.getElementById('bank-checking');
  if(el) el.textContent = '$' + Math.max(0, checkingBalance).toFixed(2);
}

// ══ IRS AUDIT LEVEL ══
let irsLevel = 0;
function spikeIRS(amount) {
  irsLevel = Math.min(irsLevel + (amount || randi(1,3)), 99);
  const el = document.getElementById('irs-level');
  if(el) el.textContent = 'LVL ' + irsLevel;
  if(irsLevel >= 10) toast('⚠ IRS AUDIT THREAT LEVEL: ' + irsLevel + ' — THEY ARE WATCHING', 'var(--red)');
}

// ══ BANK ══
let cryptoPortValue = 69;
setInterval(()=>{
  const cc = randi(14800,14999);
  document.getElementById('bank-cc').textContent = `$${cc.toLocaleString()}/$15k`;
  document.getElementById('bank-net').textContent = `-$${(cc-3).toLocaleString()}`;
  cryptoPortValue = Math.max(1, cryptoPortValue + randi(-15,12));
  document.getElementById('crypto-port').textContent = '$'+cryptoPortValue;
  updateChecking();
},4000);
