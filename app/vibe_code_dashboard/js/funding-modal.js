// ══════════════════════════════════════════════
// FUNDING REQUEST MODAL
// ══════════════════════════════════════════════
const FUNDING_REQUESTS = [
  {from:'BIG YAHU',org:'STATE OF ISRAEL',title:'EMERGENCY DEFENSE SUPPLEMENTAL REQUEST',amount:'$14,300,000,000',reason:'Current iron dome inventory insufficient. Additional dome required. Also: new compound (defense purposes). Legal team needs retaining. Journalists need evading.',urgency:'CRITICAL',color:'#00d4ff',emoji:'🇮🇱'},
  {from:'DADA TRUMP',org:'TRUMP ENTERTAINMENT & GOVERNANCE LLC',title:'TARIFF REVENUE EMERGENCY REDISTRIBUTION ACT',amount:'$3,800,000,000',reason:'Golf course maintenance, ongoing legal fees (47 cases), Truth Social server costs, diet Coke procurement (classified quantity), Air Force One snack budget.',urgency:'URGENT',color:'#ff6600',emoji:'🦅'},
  {from:'TRUMP CORP',org:'MAGA FINANCIAL SERVICES LLC',title:'PRESIDENTIAL PROPERTY OPERATING SUBSIDY',amount:'$1,200,000,000',reason:'Mar-a-Lago reclassified as official government facility per executive memo (self-issued). Taxpayer covers full operating costs. Golf cart fleet requires upgrade.',urgency:'VERY URGENT',color:'#ffb300',emoji:'🏌️'},
  {from:'PALANTIR / PLTR',org:'PETER THIEL ENTERPRISE GROUP',title:'ENHANCED POPULATION SURVEILLANCE GRANT',amount:'$8,700,000,000',reason:'We need to monitor more of you. For your safety. Data is the new oil. You are the oil. Peter says hi and asks what you had for breakfast (we already know).',urgency:'CLASSIFIED',color:'#b44dff',emoji:'👁️'},
  {from:'PETER THIEL',org:'THIEL CAPITAL / ANTI-DEATH INITIATIVE',title:'IMMORTALITY RESEARCH TAXPAYER SUBSIDY REQUEST',amount:'$2,100,000,000',reason:'Young blood procurement costs have exceeded projections by 400%. Democracy is a distraction from longevity. Results: pending. Side effects: unknown. Consent: optional.',urgency:'PERSONAL',color:'#ff0080',emoji:'🧛'},
  {from:'ELON MUSK / D.O.G.E.',org:'DEPARTMENT OF GOVERNMENT EFFICIENCY',title:'EFFICIENCY CONSULTING FEE (FINAL INVOICE)',amount:'$6,900,000,000',reason:'We fired everyone and now nothing works. This invoice covers the consulting report explaining why nothing works. Follow-up report: $4B. Next steps: tweet about it.',urgency:'EFFICIENT',color:'#00ff41',emoji:'🚀'},
  {from:'RAYTHEON TECHNOLOGIES',org:'RTX CORP / FREEDOM DELIVERY DIVISION',title:'Q4 FREEDOM DELIVERY SYSTEMS PURCHASE ORDER',amount:'$23,400,000,000',reason:'Standard quarterly order. Democracy promotion bundle (expedited shipping). Includes: missiles, think tank report, PR campaign, bipartisan photo op.',urgency:'ROUTINE',color:'#ff3333',emoji:'💣'},
  {from:'LOCKHEED MARTIN',org:'LOCKHEED MARTIN CORP.',title:'F-35 ONGOING MAINTENANCE CONTRACT (STILL BROKEN)',amount:'$41,000,000,000',reason:'Software patch #847 did not resolve the stealth issue. Neither did #848-#1203. The plane is technically flying. Budget remains unlimited. ETA: undefined. Status: cope.',urgency:'AS ALWAYS',color:'#ff6600',emoji:'✈️'},
  {from:'JEFF BEZOS',org:'AMAZON WEB SERVICES / BLUE ORIGIN',title:'AWS GOVERNMENT CONTRACT RENEWAL (PRICE INCREASE)',amount:'$19,000,000,000',reason:'CIA, NSA, and 47 other agencies now fully dependent on AWS. Switching costs estimated at $900B. Price increased 340%. You have no choice. Thank you for your business.',urgency:'CONTRACTUAL',color:'#ffb300',emoji:'📦'},
  {from:'MAGA FINANCIAL LLC',org:'TRUMP DIGITAL TRADING CARDS INC.',title:'NATIONAL DIGITAL COLLECTIBLES STRATEGIC RESERVE ACT',amount:'$500,000,000',reason:'Creating national reserve of commemorative presidential NFTs. Critical infrastructure. $99 per card. Limited supply (print-on-demand). Strategic value: TBD.',urgency:'HISTORIC',color:'#ff6600',emoji:'🃏'},
  {from:'BLACKROCK INC.',org:'BLACKROCK / FINK CAPITAL',title:'SYSTEMIC RISK MANAGEMENT SUBSIDY (PREEMPTIVE)',amount:'$7,200,000,000',reason:'We own enough of the economy that our problems become your problems. This is called "systemic importance." Preventive bailout. Standard procedure. Larry sends regards.',urgency:'SYSTEMIC',color:'#purple',emoji:'🏦'},
  {from:'BOEING',org:'BOEING COMMERCIAL / DEFENSE',title:'QUALITY CONTROL IMPROVEMENT INITIATIVE',amount:'$11,000,000,000',reason:'Several doors fell off. Some bolts were loose. Whistleblowers have been managed. New initiative: hire someone to check the bolts. Requesting funds for the bolt-checker.',urgency:'EVENTUALLY',color:'#cyan',emoji:'🚪'},
];

let fundingAutoTimer = null;
function showFundingModal() {
  const req = pick(FUNDING_REQUESTS);
  const modal = document.getElementById('funding-modal');
  document.getElementById('fund-from').textContent = 'FROM: '+req.from;
  document.getElementById('fund-from').style.color = req.color;
  document.getElementById('fund-org').textContent = req.org;
  document.getElementById('fund-title').textContent = req.title;
  document.getElementById('fund-amount').textContent = req.amount;
  document.getElementById('fund-amount').style.color = req.color;
  document.getElementById('fund-amount').style.textShadow = `0 0 24px ${req.color}`;
  document.getElementById('fund-urgency').textContent = `${req.emoji}  URGENCY: ${req.urgency}  ${req.emoji}`;
  document.getElementById('fund-urgency').style.color = req.color;
  document.getElementById('fund-reason').textContent = req.reason;
  document.getElementById('funding-box').style.borderColor = req.color;
  document.getElementById('funding-box').style.boxShadow = `0 0 60px ${req.color}55, 0 0 120px ${req.color}22`;
  modal.classList.add('show');
  window._fundReq = req;
  playUiSound('modal-open');
  clearTimeout(fundingAutoTimer);
  fundingAutoTimer = setTimeout(() => denyFunding(), 15000);
}
function approveFunding() {
  clearTimeout(fundingAutoTimer);
  document.getElementById('funding-modal').classList.remove('show');
  const req = window._fundReq;
  playUiSound('cash');
  toast(`✓ ${req.amount} APPROVED. IT COMES OUT OF YOUR CHECK. THANK YOU FOR YOUR SERVICE.`, 'var(--red)');
  document.getElementById('bank-checking').textContent = '$0.00';
  threatCount += randi(5,15);
  document.getElementById('threat-count').textContent = threatCount;
  if(typeof spikeIRS === 'function') spikeIRS(randi(5,12));
}
function denyFunding() {
  clearTimeout(fundingAutoTimer);
  document.getElementById('funding-modal').classList.remove('show');
  const req = window._fundReq;
  playUiSound('deny');
  const outcomes = [
    `REQUEST DENIED. ${req.from} HAS BEEN NOTIFIED. CONSEQUENCES: FORTHCOMING.`,
    `DENIED. ${req.from} SAYS "WE'LL FIND ANOTHER WAY." GOOD LUCK WITH THAT.`,
    `REQUEST REJECTED. AUTO-APPROVED 3 SECONDS LATER VIA OMNIBUS BILL. SORRY.`,
    `DENIED. YOUR CREDIT SCORE HAS BEEN NOTED. HAVE A GREAT DAY.`,
  ];
  toast(pick(outcomes), 'var(--amber)');
}
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') {
    document.getElementById('funding-modal').classList.remove('show');
    playUiSound('deny');
    toast('ESC PRESSED. REQUEST AUTO-APPROVED BY DEFAULT. SORRY. READ THE FINE PRINT.', 'var(--amber)');
  }
});
// Schedule funding modals
function scheduleFunding() {
  setTimeout(()=>{ showFundingModal(); scheduleFunding(); }, randi(210000,390000));
}
setTimeout(()=>{ showFundingModal(); scheduleFunding(); }, 84000);
