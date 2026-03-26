// ══════════════════════════════════════════════
// BLACKJACK + SLOTS
// ══════════════════════════════════════════════

// ── Tab switching ──────────────────────────────
function switchGamble(game) {
  document.querySelectorAll('.gamble-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.game === game);
  });
  document.getElementById('bj-stats-block').style.display = game === 'bj' ? '' : 'none';
  document.getElementById('bj-area-block').style.display  = game === 'bj' ? '' : 'none';
  document.getElementById('slots-area').classList.toggle('active', game === 'slots');
  const tradeEl = document.getElementById('trade-area');
  if(tradeEl) tradeEl.classList.toggle('active', game === 'trade');
  if(game === 'trade' && typeof drawTradeChart === 'function') drawTradeChart();
}

// ══ BLACKJACK ══════════════════════════════════
let bjWins=3, bjLosses=847, bjWagered=14230, bjBet=100;
let playerCards=[], dealerCards=[], gameOver=true;
const SUITS=['♠','♣','♥','♦'], REDS=['♥','♦'];
const VALS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const advices=[
  '▶ HIT ON 17 (TRUST)','▶ SPLIT 10s (BIG BRAIN)',
  '▶ BET YOUR RENT MONEY','▶ PRAYER.EXE RUNNING...',
  '▶ DOUBLE DOWN ON 5 (FEEL IT)','▶ NEVER STAND (COWARD MOVE)',
  '▶ THE DEALER IS AFRAID OF YOU','▶ MARTINGALE: ACTIVATED',
  '▶ JUST ONE MORE HAND','▶ VIBES OVER MATH',
  '▶ CHAOS IS A STRATEGY','▶ DEALER IS BLUFFING (NOT HOW THIS WORKS)',
  '▶ HIT ON 20 (TRUST THE PROCESS)','▶ THE CARDS OWE YOU ONE',
  '▶ FULL SEND MODE: ENGAGED','▶ STATISTICALLY DUE FOR A WIN',
];
const confidences=['UNSHAKEN','LOCKED IN','GALAXY BRAINED','COOKING RN','DIFFERENT BREED','INEVITABLE','SIGMA GRINDSET','STATISTICALLY DUE','MENTALLY STRONG','BUILT DIFFERENT'];
const winPhrases=['LETS GOOO','DIFFERENT BREED','CALCULATED','W','PAYOUT','SKILL DIFF','INEVITABLY','CANT STOP ME'];
const lossPhrases=['RIGGED','VARIANCE','L+RATIO','NOT REAL','NEXT HAND','COPE','HOUSE CHEATING','IMPOSSIBLE'];

function cardVal(v){if(v==='A')return 11;if(['J','Q','K'].includes(v))return 10;return parseInt(v);}
function total(cards){
  let t=0,a=0;
  cards.forEach(c=>{if(!c.hidden){t+=cardVal(c.value);if(c.value==='A')a++;}});
  while(t>21&&a>0){t-=10;a--;}
  return t;
}
function deal(hidden){return{value:pick(VALS),suit:pick(SUITS),hidden:!!hidden};}
function renderCards(id,cards){
  const el=document.getElementById(id); el.innerHTML='';
  cards.forEach((c,i)=>{
    const div=document.createElement('div');
    div.className='card'+(c.hidden?' hidden':REDS.includes(c.suit)?' red':' black')+(i===0&&id==='dealer-cards'?' dealer-c':'');
    if(!c.hidden) div.innerHTML=`<span>${c.value}</span><span>${c.suit}</span>`;
    el.appendChild(div);
  });
}
function dealNewHand(){
  bjBet=randi(50,500); bjWagered+=bjBet;
  playerCards=[deal(),deal()]; dealerCards=[deal(),deal(true)];
  gameOver=false;
  renderCards('player-cards',playerCards);
  renderCards('dealer-cards',dealerCards);
  document.getElementById('bj-result').textContent='';
  document.getElementById('bj-result').className='bj-result';
  document.getElementById('bj-advice').textContent=pick(advices);
  updateBJStats();
  playUiSound('bj-deal');
}
function finishHand(){
  if(gameOver) return; gameOver=true;
  dealerCards[1].hidden=false;
  while(total(dealerCards)<17) dealerCards.push(deal());
  renderCards('dealer-cards',dealerCards);
  const p=total(playerCards), d=total(dealerCards);
  const el=document.getElementById('bj-result');
  if(p>21){
    bjLosses++;
    el.textContent=pick(lossPhrases)+` (${p})`;
    el.className='bj-result result-loss';
    playUiSound('bj-bust');
    spendMoney(bjBet);
  } else if(d>21||p>d){
    bjWins++;
    el.textContent=pick(winPhrases)+` (${p})`;
    el.className='bj-result result-win';
    toast('WIN: '+el.textContent,'var(--green)');
    playUiSound('bj-win');
    if(typeof spikeIRS === 'function') spikeIRS(randi(2,5));
    addMoney(bjBet);
  } else if(p===d){
    el.textContent='PUSH (rigged tie)';
    el.className='bj-result'; el.style.color='var(--amber)';
    playUiSound('bj-loss');
  } else {
    bjLosses++;
    el.textContent=pick(lossPhrases)+` (${p})`;
    el.className='bj-result result-loss';
    playUiSound('bj-loss');
    spendMoney(bjBet);
  }
  updateBJStats();
  setTimeout(dealNewHand,3500);
}
function updateBJStats(){
  document.getElementById('bj-wins').textContent=bjWins;
  document.getElementById('bj-losses').textContent=bjLosses;
  document.getElementById('bj-wagered').textContent='$'+bjWagered.toLocaleString();
  document.getElementById('bj-conf').textContent=pick(confidences);
  document.getElementById('bj-streak').textContent='LOSING STREAK: '+bjLosses;
}
function bjHit(){
  if(gameOver){dealNewHand();return;}
  playUiSound('bj-hit');
  playerCards.push(deal()); renderCards('player-cards',playerCards);
  if(total(playerCards)>21) finishHand();
  else document.getElementById('bj-advice').textContent=pick(advices);
}
function bjStand(){if(!gameOver) finishHand();}
function bjDouble(){
  if(gameOver){dealNewHand();return;}
  bjWagered+=bjBet; bjBet*=2;
  toast('DOUBLE DOWN: FULL DEGENERACY UNLOCKED','var(--purple)');
  playUiSound('bj-hit');
  playerCards.push(deal()); renderCards('player-cards',playerCards);
  finishHand();
}
dealNewHand();

// ══ SLOTS ══════════════════════════════════════
const SLOT_SYMS  = ['7','♦','♣','₿','L','BAR','💀','W','DOGE','♥'];
const SLOT_COLORS = {
  '7':'#ffd700', '♦':'#00d4ff', '♣':'#00ff41', '₿':'#ff6600',
  'L':'#ff3333', 'BAR':'#ffb300', '💀':'#ff0080', 'W':'#00ff41',
  'DOGE':'#b44dff', '♥':'#ff3333',
};
const slotAdvices = [
  '▶ ONE MORE SPIN (TRUST)','▶ THE REELS ARE DEFINITELY NOT RIGGED',
  '▶ STATISTICALLY DUE FOR JACKPOT','▶ DOPAMINE DRIP: OPTIMAL',
  '▶ JUST VIBES, NO MATH','▶ MAX BET = MAX LUCK (FACT)',
  '▶ THE MACHINE LOVES YOU (IT DOESN\'T)','▶ JACKPOT IS IMMINENT (IT IS NOT)',
  '▶ CASINO MATH IS NOT YOUR FRIEND','▶ COPE AND SPIN AGAIN',
  '▶ TRIPLE 7 IS REAL AND IT WILL HAPPEN','▶ LOSS IS JUST DELAYED WIN (IT IS NOT)',
];
let slotsSpins=0, slotsWins=0, slotsJackpots=0, slotsNet=0;
let slotSpinning=false;

function slotSetReel(i, sym, cls='') {
  const el = document.getElementById('reel-'+i);
  if(!el) return;
  el.textContent = sym;
  el.style.color = SLOT_COLORS[sym] || '#aaa';
  el.className = 'reel' + (cls ? ' '+cls : '');
}

function slotSpinReel(i, finalSym, startDelay, onDone) {
  let count = 0;
  const maxCount = 14 + i * 7;
  setTimeout(() => {
    slotSetReel(i, pick(SLOT_SYMS), 'spinning');
    const iv = setInterval(() => {
      count++;
      slotSetReel(i, pick(SLOT_SYMS), 'spinning');
      if (count >= maxCount) {
        clearInterval(iv);
        slotSetReel(i, finalSym);
        playUiSound('slots-stop');
        if (onDone) onDone();
      }
    }, 75);
  }, startDelay);
}

function slotSpin(bet) {
  if (slotSpinning) return;
  slotSpinning = true;
  const slotBet = bet || 100;
  slotsSpins++;
  slotsNet -= slotBet;
  spendMoney(slotBet);
  updateSlotsStats();
  playUiSound('slots-spin');

  const resEl = document.getElementById('slots-result');
  resEl.textContent = 'SPINNING...';
  resEl.className = 'slots-result';

  // Weighted symbol picker: 7 is rare (5%), 💀 slightly rare (8%), others equal
  function weightedSym() {
    const r = Math.random();
    if (r < 0.05) return '7';
    if (r < 0.13) return '💀';
    return pick(['♦','♣','₿','L','BAR','W','DOGE','♥']);
  }
  const results = [weightedSym(), weightedSym(), weightedSym()];

  // Reels stop sequentially with delays
  slotSpinReel(0, results[0], 0, () => {
    slotSpinReel(1, results[1], 160, () => {
      slotSpinReel(2, results[2], 160, () => {
        resolveSlots(results, slotBet);
      });
    });
  });
}

function resolveSlots(results, bet) {
  const [a, b, c] = results;
  let payout = 0, resultText = '', resultClass = 'sl-loss';

  if (a==='7' && b==='7' && c==='7') {
    payout = bet * 50;
    slotsJackpots++;
    slotsWins++;
    resultText = '🎰 JACKPOT :: +$' + payout.toLocaleString() + ' 🎰';
    resultClass = 'sl-jackpot';
    document.querySelectorAll('.reel').forEach(r => r.className='reel reel-jackpot');
    playUiSound('slots-jackpot');
    toast('🎰 JACKPOT! $'+payout.toLocaleString()+' WON. IRS HAS BEEN NOTIFIED.','#ffd700');
  } else if (a==='💀' && b==='💀' && c==='💀') {
    payout = -bet;
    slotsNet += payout;
    resultText = '💀 TRIPLE SKULL · CURSED · -$' + (bet*2);
    resultClass = 'sl-curse';
    playUiSound('slots-curse');
    toast('💀 CURSED. YOUR LUCK HAS BEEN FORMALLY REVOKED.','var(--pink)');
  } else if (a===b && b===c) {
    payout = bet * 5;
    slotsWins++;
    resultText = 'TRIPLE ' + a + ' · WIN · +$' + payout;
    resultClass = 'sl-win';
    document.querySelectorAll('.reel').forEach(r => r.className='reel reel-win');
    playUiSound('slots-win');
  } else if (a===b || b===c || a===c) {
    payout = Math.floor(bet * 0.5);
    slotsWins++;
    resultText = 'PAIR · SMALL WIN · +$' + payout;
    resultClass = 'sl-win';
    playUiSound('slots-win');
  } else if (results.filter(s=>s==='L').length >= 2) {
    resultText = 'LL · DOUBLE L · ' + pick(['VARIANCE','COPE','NOT REAL','BAD RNG']);
    playUiSound('bj-loss');
  } else {
    resultText = 'L · ' + pick(['VARIANCE','RIGGED','COPE','HOUSE WINS AGAIN','NOT REAL']);
    playUiSound('bj-loss');
  }

  slotsNet += payout;
  if(payout > 0) addMoney(payout);
  else if(payout < 0) spendMoney(Math.abs(payout));
  const resEl = document.getElementById('slots-result');
  resEl.textContent = resultText;
  resEl.className = 'slots-result ' + resultClass;
  document.getElementById('slots-advice').textContent = pick(slotAdvices);
  updateSlotsStats();
  slotSpinning = false;
}

function updateSlotsStats() {
  const spEl = document.getElementById('sl-spins');
  const wEl  = document.getElementById('sl-wins');
  const jpEl = document.getElementById('sl-jackpots');
  const netEl = document.getElementById('sl-net');
  if (spEl)  spEl.textContent  = slotsSpins;
  if (wEl)   wEl.textContent   = slotsWins;
  if (jpEl)  jpEl.textContent  = slotsJackpots;
  if (netEl) {
    netEl.textContent = (slotsNet >= 0 ? '+$' : '-$') + Math.abs(slotsNet).toLocaleString();
    netEl.className   = 's-val ' + (slotsNet >= 0 ? 'v-green' : 'v-red');
  }
}
