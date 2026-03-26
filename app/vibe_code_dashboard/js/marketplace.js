// ══════════════════════════════════════════════
// MARKETPLACE WATCH
// ══════════════════════════════════════════════
const fbFeed = document.getElementById('fb-feed');
const marketItemLabel = document.getElementById('market-item-label');
const marketPlatformLabel = document.getElementById('market-platform-label');
const marketTabs = Array.from(document.querySelectorAll('.market-tab'));

const PLATFORM_STYLES = {
  'FB Marketplace': { color:'var(--amber)', accent:'FBM' },
  'eBay': { color:'var(--cyan)', accent:'EBY' },
  'Craigslist': { color:'var(--green)', accent:'CL' },
};

const CONVOS = {
  'FB Marketplace': [
    {
      item: '2019 Harley Sportster 883 :: ASK: $8,500 FIRM',
      messages: [
        {system:true, text:'── INITIATING AUTOMATED LOWBALL ──'},
        {bot:true, text:'$200 cash.'},
        {seller:'harley_guy_69', text:'It says $8,500 firm.'},
        {bot:true, text:'$250 and i have a sick vape.'},
        {seller:'harley_guy_69', text:'No.'},
        {bot:true, text:'its for my daughter she has a condition. needs a harley.'},
        {seller:'harley_guy_69', text:'Blocking you.'},
      ]
    },
    {
      item: 'PS5 Disc Edition - barely used :: ASK: $450',
      messages: [
        {system:true, text:'── INITIATING AUTOMATED LOWBALL ──'},
        {bot:true, text:'will u take $100'},
        {seller:'gamer_dude99', text:'No way.'},
        {bot:true, text:'my son is crying now. $105 and a broken xbox controller'},
        {seller:'gamer_dude99', text:'Not my problem bro.'},
        {bot:true, text:'i promised him for his birthday'},
        {seller:'gamer_dude99', text:'Still $450.'},
        {bot:true, text:'ur ruining christmas'}
      ]
    },
    {
      item: 'Sectional Couch - MUST GO :: ASK: $300',
      messages: [
        {system:true, text:'── INITIATING AUTOMATED LOWBALL ──'},
        {bot:true, text:'u deliver?'},
        {seller:'moving_out_sarah', text:'Pickup only.'},
        {bot:true, text:'ok i will give u $50 if u deliver it 40 miles'},
        {seller:'moving_out_sarah', text:'Are you serious?'},
        {bot:true, text:'im doing u a favor taking it off ur hands'},
        {seller:'moving_out_sarah', text:'Absolutely not.'}
      ]
    }
  ],
  'eBay': [
    {
      item: 'M2 MacBook Air - Mint :: ASK: $850',
      messages: [
        {system:true, text:'── SENDING SELLER INQUIRY ──'},
        {bot:true, text:'would you take $200 right now'},
        {seller:'tech_flipper', text:'Price is fixed.'},
        {bot:true, text:'i can pay paypal friends and family. no fees for u'},
        {seller:'tech_flipper', text:'That violates eBay TOS.'},
        {bot:true, text:'dont be a cop. $215 final offer'}
      ]
    },
    {
      item: 'Rolex Submariner 116610LN :: ASK: $10,500',
      messages: [
        {system:true, text:'── SENDING SELLER INQUIRY ──'},
        {bot:true, text:'Trade for a 2004 Toyota Camry?'},
        {seller:'luxury_resell', text:'Watch only. No trades.'},
        {bot:true, text:'it has a new alternator'},
        {seller:'luxury_resell', text:'No thanks.'},
        {bot:true, text:'ill throw in the title for my neighbors jetski'},
        {seller:'luxury_resell', text:'Please stop messaging me.'}
      ]
    }
  ],
  'Craigslist': [
    {
      item: 'Fender Stratocaster American :: ASK: $900',
      messages: [
        {system:true, text:'── DISPATCHING SMS SCRIPT ──'},
        {bot:true, text:'trade for an exotic snake?'},
        {seller:'shredder_dan', text:'Cash only.'},
        {bot:true, text:'the snake is worth 2k'},
        {seller:'shredder_dan', text:'I don\'t want a snake.'},
        {bot:true, text:'he is very polite. his name is kevin'},
        {seller:'shredder_dan', text:'Do not contact this number again.'}
      ]
    },
    {
      item: 'YZ250F Dirtbike :: ASK: $3,200',
      messages: [
        {system:true, text:'── DISPATCHING SMS SCRIPT ──'},
        {bot:true, text:'$400 and a 30-rack of busch light'},
        {seller:'moto_x_bro', text:'Make it a 30-rack of coors and $3k'},
        {bot:true, text:'$405 and half a pack of marlboros'},
        {seller:'moto_x_bro', text:'Lose my number.'},
        {bot:true, text:'what if i throw in my cousin. he knows about bikes.'}
      ]
    }
  ]
};

let lbCount = 0;
let currentPlatform = 'FB Marketplace';

const platformStates = {
  'FB Marketplace': { cIdx: 0, mIdx: 0, feedNodes: [] },
  'eBay': { cIdx: 0, mIdx: 0, feedNodes: [] },
  'Craigslist': { cIdx: 0, mIdx: 0, feedNodes: [] }
};

function updateLowballCount() {
  document.getElementById('lb-count').textContent = lbCount;
}

function updateMarketplaceHeader() {
  const state = platformStates[currentPlatform];
  const convo = CONVOS[currentPlatform][state.cIdx];
  marketItemLabel.textContent = convo.item;
  marketPlatformLabel.textContent = currentPlatform;
  marketTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.platform === currentPlatform);
  });
}

function createMsgNode(msg, platform) {
  const div = document.createElement('div');
  const style = PLATFORM_STYLES[platform];
  if(msg.system) {
    div.className = 'fb-system';
    div.textContent = `[${style.accent}] ${msg.text}`;
  } else if(msg.bot) {
    div.className = 'fb-msg';
    div.innerHTML = `<span class="fb-platform" style="color:${style.color}">${style.accent}</span><span class="fb-user">AUTO-LOWBALLER:</span><span class="fb-text"> ${msg.text}</span>`;
    lbCount++;
    updateLowballCount();
  } else if(msg.seller) {
    div.className = 'fb-msg';
    div.innerHTML = `<span class="fb-platform" style="color:${style.color}">${style.accent}</span><span class="fb-seller">SELLER (${msg.seller}):</span><span class="fb-text"> ${msg.text}</span>`;
  }
  return div;
}

function setMarketplacePlatform(platform) {
  currentPlatform = platform;
  updateMarketplaceHeader();
  fbFeed.innerHTML = '';
  platformStates[currentPlatform].feedNodes.forEach(node => fbFeed.appendChild(node));
  fbFeed.scrollTop = fbFeed.scrollHeight;
  if (typeof playUiSound === 'function') playUiSound('modal-open');
}

function fbTick() {
  Object.keys(platformStates).forEach(platform => {
    const state = platformStates[platform];
    const convos = CONVOS[platform];
    let convo = convos[state.cIdx];

    if(state.mIdx < convo.messages.length) {
      const msg = convo.messages[state.mIdx];
      const node = createMsgNode(msg, platform);
      state.feedNodes.push(node);

      if(platform === currentPlatform) {
        fbFeed.appendChild(node);
        fbFeed.scrollTop = fbFeed.scrollHeight;
      }
      state.mIdx++;
    } else {
      state.cIdx = (state.cIdx + 1) % convos.length;
      state.mIdx = 0;
      convo = convos[state.cIdx];

      const divider = createMsgNode({ system: true, text: `── TARGET ACQUIRED: ${convo.item} ──` }, platform);
      state.feedNodes.push(divider);

      if(platform === currentPlatform) {
        updateMarketplaceHeader();
        fbFeed.appendChild(divider);
        fbFeed.scrollTop = fbFeed.scrollHeight;
      }
    }
  });
}

function initMarketplace() {
  Object.keys(platformStates).forEach(platform => {
    const state = platformStates[platform];
    const convo = CONVOS[platform][state.cIdx];
    const initialBurst = Math.min(3, convo.messages.length);
    for(let i=0; i<initialBurst; i++) {
      const msg = convo.messages[state.mIdx++];
      state.feedNodes.push(createMsgNode(msg, platform));
    }
  });
  setMarketplacePlatform('FB Marketplace');
  updateLowballCount();
}

marketTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setMarketplacePlatform(tab.dataset.platform);
  });
});

initMarketplace();
setInterval(fbTick, 2500);
