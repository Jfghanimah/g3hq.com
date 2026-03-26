// ══════════════════════════════════════════════
// REDDIT + 4CHAN SLOP
// ══════════════════════════════════════════════
const rFeed=document.getElementById('reddit-feed');
const cFeed=document.getElementById('chan-feed');
let slopMode='reddit';

const SUBS=['r/AITA','r/tifu','r/AmIOverreacting','r/relationship_advice','r/wallstreetbets','r/personalfinance','r/mildlyinfuriating','r/confession','r/gaming','r/pcmasterrace','r/conspiracy','r/antiwork','r/LinkedInLunatics','r/PublicFreakout','r/unpopularopinion','r/teenagers','r/legaladvice','r/survivinginfidelity'];
const ANIMALS=['iguana','harley','ferret','bearded dragon','emotional support peacock','axolotl','therapy hamster','miniature horse'];
const FOODS=['soup','pasta','casserole','lasagna','chili','risotto','protein shake','emotional support lasagna'];
const AMF=['24M','27M','31M','19M','34M','22M','29M','41M','45M'];
const AFF=['23F','26F','29F','21F','33F','25F','28F','38F','19F'];
const ADJS=['mid','basic','cringe','sus','lowkey fire','not it','unhinged','giving red flag','chronically online','main character'];
const VERDICTS=['YTA','NTA','ESH','NAH','YTA/NTA war in comments','INFO needed','Soft YTA','Gentle NTA'];

const BOARDS=['/pol/','biz/','/g/','/v/','/fit/'];
const PROPAGANDA_PROMPTS=[
  "🚀 MUSK MEDIA: 'Government waste is literally theft from your paycheck. RT this.'",
  "💡 FACT CHECK NEEDED: 'Does anyone else think regulations are just [CENSORED BY ESTABLISHMENT]?'",
  "🔥 HOT TAKE: 'The problem is nobody will just SAY IT anymore. But here it is.'",
  "📊 DATA SHOWS: '87% of [STATISTICS] are [STATISTICALLY DUBIOUS]. Share this.'",
  "⚠️ BREAKING: 'Mainstream media won't cover this simple LIFE HACK for [VAGUE TOPIC].'",
  "🎯 WAKE UP: 'If you still believe [COMMON BELIEF], you haven\'t been paying attention.'",
  "💰 ECON 101: 'Inflation is caused by [OVERSIMPLIFIED]. Here\'s how to fix it.'",
  "🛑 CENSORSHIP: 'They deleted my post about [UNVERIFIED CLAIM]. Can\'t silence the truth.'",
];

const TMPLS=[
  ()=>`AITA for telling my roommate his emotional support ${pick(ANIMALS)} doesn't count as a "service animal" in my Prius?`,
  ()=>`TIFU by accidentally explaining the martingale strategy to my ${pick(['wife','girlfriend','mom','therapist','dog','Uber driver'])} during ${pick(['dinner','therapy','a funeral','Thanksgiving',"Applebee's",'my brother\'s wedding'])}`,
  ()=>`My boyfriend [${pick(AMF)}] said my ${pick(FOODS)} is "${pick(ADJS)}" and I [${pick(AFF)}] don't know what to do with this information`,
  ()=>`Someone offered $50 for my $0 free item on FB marketplace and then called ME unreasonable for declining`,
  ()=>`TIFU by buying a harley thinking it would ${pick(['go up in value','impress my ex','make me feel something','attract partners','fix my personality','complete me'])}`,
  ()=>`Am I overreacting that my ${pick(['coworker','roommate','dad','boyfriend','uber driver','dentist'])} said I have "main character energy" unironically?`,
  ()=>`AITA for refusing to let my ${pick(['cousin','neighbor','coworker','ex','stranger'])} borrow my ${pick(['car','PS5','emotional support animal','harley','therapist\'s number'])} after they offered ${pick(['$5','$12','a coupon','vibes','thoughts and prayers','a firm handshake'])}?`,
  ()=>`My [${pick(AMF)}] wife [${pick(AFF)}] found my blackjack stats (W:${bjWins} L:${bjLosses}) and says I have a "problem". NTA right?`,
  ()=>`UPDATE: I hit on 20, busted, but I want everyone to know I am FINE. Completely fine. Very fine. Please stop asking.`,
  ()=>`AITA for blocking ${randi(30,80)} people trying to sell my harley at asking price? They kept offering ${pick(['$200','$50','lawnmowers','prayers','dogecoin','emotional support'])}`,
  ()=>`TIFU by explaining to my date that ${pick(['crypto is the future','the martingale always works eventually','harley is an investment','doge is hitting $1','i have a system'])}`,
  ()=>`Is it normal for my checking account to have ${pick(['$3.47','negative $200','literally $0.12','enough for gas but not food','$69.00 (nice but also not nice)'])} at age ${pick(['24','27','31','34','38','42'])}?`,
  ()=>`AITA for telling my crypto-bro coworker that his portfolio going from $50k to $69 is NOT the market's fault`,
  ()=>`My [${pick(AMF)}] roommate explains ${pick(['NFTs','the metaverse','his harley investment','why dogecoin is different this time','sigma mindset'])} to me [${pick(AFF)}] every morning. AITA for moving out?`,
  ()=>`TIFU: I told my boss I was "working from home" but I was actually at the casino. Doing research. On probability.`,
  ()=>`AITA for laughing when my neighbor said his ${pick(['harley','nft','dogecoin portfolio','homemade crypto'])} was an "investment"?`,
  ()=>`I [${pick(AMF)}] have been hitting on 17 at blackjack for 3 years and my therapist says this is "symbolic." Is she right?`,
  ()=>`TIFU by letting a FB marketplace buyer "test drive" my harley. He has been gone for ${randi(2,96)} hours.`,
  ()=>`WIBTA if I told my friend that buying a harley to "invest" is the same as buying lottery tickets but louder?`,
  ()=>`Someone on FB marketplace offered me a lawnmower, $50, a gift card, AND their cousin in exchange for my $8,500 harley. I said no. AITA?`,
  ()=>`My [${pick(AFF)}] boyfriend [${pick(AMF)}] spent our rent money on blackjack using "the martingale system." He says he was "1 hand away." AITA for being upset?`,
  ()=>`TIFU: I explained to my in-laws that BIG YAHU's flight path "didn't make sense" using Google Maps. Dinner ended early.`,
  ()=>`Is it normal that I track two specific world leaders' private jets as a hobby? Asking for ${pick(['a friend','my therapist','my FBI agent','accountability'])}`,
  // GAMER BRAIN
  ()=>`AITA for telling my ${pick(['teammate','duo partner','raid group','guild'])} to "get good" after they ${pick(['died 14 times','went AFK','missed a shot','blamed lag'])}? They reported me.`,
  ()=>`TIFU by going AFK during a ranked match to ${pick(['answer the door','use the bathroom','feed my cat','touch grass'])}. My team lost. They found my address somehow.`,
  ()=>`My [${pick(AMF)}] girlfriend [${pick(AFF)}] said I spend too much time gaming. I said it's my "competitive career path." She left. AITA?`,
  ()=>`AITA for telling my coworker that his "${pick(['gaming setup','streaming pc','keyboard collection','chair'])}" isn't a tax writeoff because he has 4 viewers?`,
  ()=>`Is it normal that I've spent $${randi(1200,8400)} on ${pick(['skins','battle passes','gacha pulls','DLC','loot boxes'])} this year? My therapist said something. I said "skill diff."`,
  ()=>`TIFU: I 1v1'd a FB marketplace seller for his harley and lost. He said "gg ez" and listed it for $9,000.`,
  ()=>`AITA for leaving a ${pick(['1-star','2-star'])} review on a game because the difficulty was "skill-based" and not "vibe-based"?`,
  // SCHIZO / CONSPIRACY
  ()=>`Is it normal that my ${pick(['router','microwave','smart fridge','alexa','fitbit'])} seems to know what I'm going to say before I say it? Asking seriously.`,
  ()=>`TIFU by telling my family at dinner that ${pick(['chemtrails are real','the water is fluoridated intentionally','birds aren\'t real','the moon landing was filmed','5G causes the sleepies'])}. Holiday cancelled.`,
  ()=>`AITA for refusing to let ${pick(['my landlord','a repairman','the cable guy','a google car'])} inside because I'm "pretty sure they work for someone"?`,
  ()=>`My [${pick(AMF)}] roommate [${pick(AFF)}] put aluminum foil on all the windows "just in case." I asked in case of what. He said I wasn't ready. AITA for being concerned?`,
  ()=>`Is it weird that I've started checking the harley I bought on FB marketplace for tracking devices every morning? The previous seller seemed suspicious.`,
  // HUSTLE / LINKEDIN BRAIN
  ()=>`AITA for telling my coworker that waking up at 4am to cold plunge doesn't make him more productive, it makes him annoying?`,
  ()=>`TIFU by adding "chief vibes officer" to my LinkedIn and applying to ${randi(40,200)} jobs. ${randi(0,2)} callbacks. Manifesting.`,
  ()=>`My boss [${pick(['47M','52M','38F','44F'])}] said my "grindset" is affecting team morale. I work 14 hours a day and I send emails at 3am to "set the tone." AITA?`,
  ()=>`AITA for telling my friend that his harley motorcycle is NOT a "business asset" and he cannot write it off on taxes because he "might use it to get to meetings"?`,
  ()=>`TIFU: I turned down a $${randi(60,90)}k salary because it "didn't align with my personal brand." I am currently eating cereal for dinner. Day ${randi(40,200)}.`,
  // TECH BRO / GOVT
  ()=>`AITA for laughing when my coworker said Palantir is "basically harmless"? He owns ${randi(50,500)} shares. We no longer speak.`,
  ()=>`TIFU by reading a government defense contract out loud at a dinner party. Nobody finished their food. The number had ${randi(10,12)} digits.`,
  ()=>`Is it normal that ${pick(['Raytheon','Lockheed Martin','a defense contractor','a government subcontractor'])} billed $${randi(600,2400)} for a ${pick(['toilet seat','hammer','coffee mug','stapler','pen'])}? Asking for a friend (a senator).`,
  ()=>`My [${pick(AMF)}] friend [${pick(AMF)}] works at ${pick(['Palantir','a defense contractor','the pentagon','a 3-letter agency'])} and says his job is "helping democracy." He won't say how. AITA for being weirded out?`,
  ()=>`AITA for telling my nephew that "the government will pay for it" is not a financial plan, regardless of which government?`,
  // INSIDE JOKES
  ()=>`AITA for telling DrDoughnut that going AFK for ${randi(2,8)} hours mid-game is not a "strategic pause"? He said he was "handling something." He was not.`,
  ()=>`My [${pick(AMF)}] friend [${pick(AMF)}] known as "mork" cut off his dreads and has not recovered. It has been ${randi(3,18)} months. AITA for mentioning it?`,
  ()=>`Goat Gamers Gaming just lost their ${randi(5,20)}-game win streak to a team called "Two Guys and a Laptop." AITA for laughing?`,
  ()=>`TIFU: I said "waddup doe" to my boss in a performance review. He did not know what it meant. I did not explain. I was let go. Doe.`,
  ()=>`Is it normal that Riot Games has sent me ${randi(2,7)} cease and desist letters for "unsanctioned commentary"? I just said the client was bad. It is bad.`,
  ()=>`AITA for telling my teammate on League of Legends that his champion pick is "not it"? He said I wasn't ready. I was not. We lost.`,
  ()=>`My friend group has a guy who is "maxxing" something new every month. This month: looksmaxxing. Last month: sleepmaxxing. He is ${randi(5,14)}% improved, he says. AITA for the look I gave?`,
  ()=>`TIFU: DrDoughnut went AFK again. We have been waiting ${randi(20,90)} minutes. He said "one sec" ${randi(10,40)} minutes ago. One sec was a lie.`,
  ()=>`Epstein list dropped and my group chat has not stopped. ${randi(40,120)} messages in. Someone said "called it." It's been a day. AITA for muting?`,
  ()=>`WIBTA if I told mork that the dreadless look is actually fine and he needs to ${pick(['move on','touch grass','log off','seek closure','stop checking mirrors'])}?`,
  // MISC VARIETY
  ()=>`TIFU: I confidently explained the offside rule at a soccer game. I was wrong. I've never watched soccer. There were ${randi(20,80)} people around me.`,
  ()=>`My [${pick(AFF)}] boyfriend [${pick(AMF)}] eats plain rice for every meal because he's "cutting." He has been "cutting" for ${randi(2,4)} years. AITA for expressing concern?`,
  ()=>`AITA for telling my uncle that his cryptocurrency is a pyramid scheme at Thanksgiving? He had not finished explaining it yet. There were tears.`,
  ()=>`Is it normal to feel personally attacked when a blackjack dealer says "good luck" before dealing? Day ${randi(200,900)} of this journey.`,
  ()=>`TIFU: I told a guy on FB marketplace that his ${pick(['harley','jet ski','boat','ATV'])} was overpriced based on a 30-second google. He has not stopped calling.`,
  ()=>`AITA for blocking ${randi(40,90)} consecutive FB marketplace buyers? They all opened with "lowest u can go" before asking what the item was.`,
  ()=>`My [${pick(AMF)}] coworker [${pick(AMF)}] refers to every purchase as an "investment." His portfolio: ${pick(['3 harleys','2 jet skis','a comic collection','commemorative NFTs','a boat named after his ex'])}. AITA for the look I gave him?`,
];

const CHAN_TMPLS=[
  ()=>`>be me\n>bought harley on FB marketplace\n>seller seemed sus\n>now it's "appreciating"\n>wife left\n>mfw this is good actually`,
  ()=>`>be me\n>invested in doge\n>only lost 40%\n>STILL HOLDING\n>diamond hands engage\n>wife wants divorce\n>HODL`,
  ()=>`>see government contract for toilet seat\n>$2400\n>for a TOILET SEAT\n>nobody cares\n>system is fine apparently\n>go back to sleep`,
  ()=>`>coworker won't shut up about grindset\n>wakes up at 4am\n>cold plunge\n>makes less than me\n>still talks about sigma\n>mfw`,
  ()=>`>tfw you realize birds aren't real\n>government tracking device list:\n>pigeons\n>drones\n>that one sparrow outside\n>pretty sure my toaster\n>should move to basement`,
  ()=>`>friend spent rent money on blackjack\n>said martingale system "always works"\n>he is now homeless\n>still convinced he's "1 hand away"\n>living in my closet\n>please help`,
  ()=>`>BREAKING NEWS\n>government billed $600 for hammer\n>nobody talking about this\n>society is collapsing\n>anyway back to scrolling\n>mfw`,
  ()=>`>my boss made chief vibes officer\n>sends emails at 3am\n>"grindset affects morale"\n>fired me\n>now i am the one affected\n>rip morale`,
  ()=>`>see random dude doing looksmaxxing\n>this is his 4th month of self-improvement\n>each time: different maxx\n>sleepmaxxing, sigma maxxing\n>up 8% he claims\n>its cope`,
  ()=>`>bitcoin up 2%\n>time to declare victory on main social\n>bitcoin down 3% next day\n>delete the post\n>pretend it never happened\n>repeat monthly`,
];

const INSIDER_TIPS=[
  { ticker:'NVDA', action:'BUY', pct:'+14%', hint:'>uncle works at nvidia\n>Q3 numbers "not what people expect"\n>not saying buy\n>just saying my uncle drives a new lambo\n>do with that what you will\n>NOT FINANCIAL ADVICE' },
  { ticker:'AAPL', action:'SELL', pct:'-8%', hint:'>worked catering at a "product reveal" event\n>saw the slide deck by accident\n>it\'s just the same phone again\n>but thinner\n>and $200 more\n>SELL\n>trust me bro' },
  { ticker:'GME', action:'BUY', pct:'+340%', hint:'>they said it was dead\n>they were wrong before\n>check the short interest\n>i\'m not saying anything\n>i\'m just saying\n>🦍💎🚀\n>NOT FINANCIAL ADVICE' },
  { ticker:'TSLA', action:'SELL', pct:'-11%', hint:'>have a contact at a major rental fleet\n>they\'re returning 4,000 units\n>"range anxiety" issues\n>announcement drops friday\n>don\'t say i didn\'t warn you\n>source: trust me' },
  { ticker:'META', action:'BUY', pct:'+19%', hint:'>ad revenue numbers leaked internally\n>Q4 blew past estimates\n>metaverse is still cringe but somehow profitable\n>zuckerberg actually lizard AND genius\n>loading up calls\n>NOT FINANCIAL ADVICE' },
  { ticker:'DOGE', action:'BUY', pct:'+88%', hint:'>certain prominent individual\n>has been accumulating\n>wallet address ends in ...6969\n>announcement imminent\n>this is not a drill\n>i will be deleting this post' },
  { ticker:'AMZN', action:'BUY', pct:'+12%', hint:'>prime day numbers\n>internal memo says record-breaking\n>bezos texted someone\n>that someone texted me\n>i have one share and i am scared\n>NOT FINANCIAL ADVICE' },
  { ticker:'PLTR', action:'BUY', pct:'+27%', hint:'>government contract renewal\n>not public yet\n>amount has 10 digits\n>palantir sees everything apparently including gains\n>my dad works at the pentagon\n>anyway' },
];

let postVotes={};
let propagandaOnCooldown=false;

function isRenderableSlopText(text) {
  if(!text) return false;
  return !/\[[A-Z][A-Z\s]{2,}\]/.test(text);
}

function pickRenderable(factoryList, attempts = 12) {
  for(let i = 0; i < attempts; i++) {
    const next = pick(factoryList)();
    if(isRenderableSlopText(next)) return next;
  }
  return null;
}

function switchSlop(mode){
  slopMode=mode;
  document.getElementById('reddit-feed').style.display=mode==='reddit'?'':'none';
  document.getElementById('chan-feed').style.display=mode==='4chan'?'':'none';
  document.getElementById('dm-feed').style.display=mode==='dm'?'':'none';
  document.getElementById('propaganda-bar').style.display=mode==='reddit'?'':'none';
  document.querySelectorAll('.reddit-tab').forEach(t=>t.classList.toggle('active', t.dataset.mode===mode));
}

function makePost(){
  if(slopMode!=='reddit') return;
  const sub=pick(SUBS), title=pickRenderable(TMPLS);
  if(!title) return;
  const ups=randi(300,62000), cmts=randi(80,4200);
  const verdict=pick(VERDICTS);
  const isYTA=verdict.startsWith('Y')||verdict.startsWith('E');
  const isHot=Math.random()<0.15;
  const pid='p'+Date.now();
  postVotes[pid]={up:ups};
  const div=document.createElement('div'); div.className='reddit-post'; div.id=pid;
  div.innerHTML=`
    <div class="rpost-sub">${sub}</div>
    <div class="rpost-title">${title}</div>
    <div class="rpost-meta">
      <button class="vote-btn vote-up" onclick="vote('${pid}','up')">▲</button>
      <span class="rpost-ups" id="ups-${pid}">${ups.toLocaleString()}</span>
      <button class="vote-btn vote-dn" onclick="vote('${pid}','dn')">▼</button>
      <span>${cmts.toLocaleString()} comments</span>
      <span class="${isYTA?'rpost-yta':'rpost-nta'}">${verdict}</span>
      ${isHot?'<span class="rpost-hot">🔥 HOT</span>':''}
      <button class="post-award-btn" onclick="awardPost('${pid}')">🏆</button>
      <button class="post-share-btn" onclick="sharePost()">📤</button>
    </div>`;
  rFeed.insertBefore(div,rFeed.firstChild);
  while(rFeed.children.length>5) rFeed.removeChild(rFeed.lastChild);
}

function makeChanPost(){
  const board=pick(BOARDS);
  const content=pick(CHAN_TMPLS)();
  const anonId='Anonymous '+randi(1000,9999);
  const replies=randi(2,240);
  const cid='c'+Date.now();
  const div=document.createElement('div'); div.className='chan-post'; div.id=cid;
  div.innerHTML=`
    <div class="chan-hdr">
      <span class="chan-board">${board}</span>
      <span class="chan-anon">${anonId}</span>
      <span class="chan-time">${Math.floor(Math.random()*24)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}</span>
    </div>
    <div class="chan-content">${content}</div>
    <div class="chan-footer">
      <span>${replies} replies</span>
      <span>pic unrelated</span>
    </div>`;
  cFeed.insertBefore(div,cFeed.firstChild);
  while(cFeed.children.length>6) cFeed.removeChild(cFeed.lastChild);
}

function postPropaganda(){
  if(propagandaOnCooldown) return;
  const prompt = PROPAGANDA_PROMPTS[currentPropIdx];
  if(!isRenderableSlopText(prompt)) {
    toast('POST TEMPLATE REJECTED :: PLACEHOLDER TEXT DETECTED', 'var(--red)');
    playUiSound('deny');
    cyclePropaganda();
    return;
  }
  propagandaOnCooldown=true;
  document.getElementById('propaganda-btn').disabled=true;
  document.getElementById('propaganda-btn').textContent='[ ⏳ PROCESSING WIRE TRANSFER... ]';
  setTimeout(()=>{
    propagandaOnCooldown=false;
    document.getElementById('propaganda-btn').disabled=false;
    document.getElementById('propaganda-btn').textContent='[ POST IT ]';
  },15000);

  // Add as reddit post with insane upvotes
  const pid='prop'+Date.now();
  postVotes[pid]={up:999000};
  const div=document.createElement('div'); div.className='reddit-post rpost-pinned'; div.id=pid;
  div.innerHTML=`
    <div class="rpost-sub" style="color:var(--red)">📌 r/BREAKING</div>
    <div class="rpost-title">${prompt}</div>
    <div class="rpost-meta">
      <button class="vote-btn vote-up">▲</button>
      <span class="rpost-ups">${(999000).toLocaleString()}</span>
      <button class="vote-btn vote-dn">▼</button>
      <span>${randi(50000,400000).toLocaleString()} comments</span>
      <span style="color:var(--amber);font-weight:bold">📌 PINNED BY MOD</span>
    </div>`;
  rFeed.insertBefore(div,rFeed.firstChild);
  while(rFeed.children.length>5) rFeed.removeChild(rFeed.lastChild);

  // Add money
  checkingBalance+=1000;
  updateChecking();
  playUiSound('cash');
  toast('💰 ELON MUSK MEDIA GRANT: +$1,000. KEEP POSTING.', '#00ff41');
}

function makeInsiderPost(){
  const tip=pick(INSIDER_TIPS);
  const cid='insider'+Date.now();
  const anonId='Anonymous '+randi(1000,9999);
  const div=document.createElement('div'); div.className='chan-post chan-insider'; div.id=cid;
  div.innerHTML=`
    <div class="chan-hdr">
      <span class="chan-board">/biz/</span>
      <span class="chan-anon">${anonId}</span>
      <span class="chan-time">${Math.floor(Math.random()*24)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}</span>
      <span class="chan-insider-tag">⚠️ INSIDER</span>
    </div>
    <div class="chan-content">${tip.hint}</div>
    <div class="chan-footer"><span>${randi(40,600)} replies</span><span>i will delete this</span></div>`;
  cFeed.insertBefore(div,cFeed.firstChild);
  while(cFeed.children.length>6) cFeed.removeChild(cFeed.lastChild);

  // "Prediction comes true" follow-up after 30–60s
  const delay=randi(30,60)*1000;
  setTimeout(()=>{
    const fid='insider-confirm'+Date.now();
    const fdiv=document.createElement('div'); fdiv.className='chan-post chan-insider-confirm'; fdiv.id=fid;
    fdiv.innerHTML=`
      <div class="chan-hdr">
        <span class="chan-board">/biz/</span>
        <span class="chan-anon">Anonymous ${randi(1000,9999)}</span>
        <span class="chan-time">${Math.floor(Math.random()*24)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}</span>
        <span class="chan-insider-tag" style="color:var(--green)">✅ UPDATE</span>
      </div>
      <div class="chan-content">>be me\n>saw that ${tip.ticker} post earlier\n>bought immediately\n>${tip.ticker} just moved ${tip.pct}\n>I am crying\n>who WAS that guy\n>thread already deleted\n>I owe him my life</div>
      <div class="chan-footer"><span>${randi(200,2000)} replies</span><span>HOLY BASED</span></div>`;
    cFeed.insertBefore(fdiv,cFeed.firstChild);
    while(cFeed.children.length>6) cFeed.removeChild(cFeed.lastChild);
    toast(`📈 ${tip.ticker} ${tip.pct} — THE ANON WAS RIGHT`, 'var(--green)');
  }, delay);
}

function awardPost(_pid){}

function sharePost(){}

function vote(pid,dir){
  if(!postVotes[pid]) return;
  postVotes[pid].up += dir==='up'?1:-1;
  const el=document.getElementById('ups-'+pid);
  if(el) el.textContent=postVotes[pid].up.toLocaleString();
}

// ── DM AUTO-RESPONDER ──
const DM_PLATFORMS=['Discord','Tinder','Instagram','Reddit DM','Twitter DM','Snapchat'];
const DM_SENDERS=[
  'xX_alpha_sigma_Xx','HarleyInvestor69','GrindsetGuru','CryptoKing2025',
  'MartingaleMan','DrDoughnut_Real','WokeCrusher99','NFTPhilosopher',
  'BasedAndPilled','FreedomEagle1776','GymRat_Philosophy','IQOver200',
  'RedactedTruth','DeltaForceVet','SkillIssueKing',
];
const DM_MSGS=[
  ()=>`bro your blackjack strategy is WRONG. you need to HIT on soft 17 unless the dealer shows a 6, and even then you should DOUBLE if your cards total ${randi(8,12)}. i have been doing this for ${randi(3,15)} years`,
  ()=>`wake up. the government puts ${pick(['fluoride','5G','microchips','chemicals'])} in ${pick(['the water','vaccines','chemtrails','fast food'])} to keep you compliant. i can explain more. do your research`,
  ()=>`my harley is NOT depreciating it's a COLLECTOR'S ITEM. i bought it for $${randi(9000,18000)} and it's going up. you don't understand the market`,
  ()=>`ratio + you fell off + cope + ${pick(['skill issue','L','no bitches','touch grass','down bad','not based'])}`,
  ()=>`i have an IQ of ${randi(140,200)} and i figured out that ${pick(['the matrix is real','birds aren\'t real','the simulation is glitching','Epstein didn\'t kill himself'])}. you should listen to me`,
  ()=>`your ${pick(['post','comment','opinion','take','profile'])} was ${pick(['cringe','mid','not it','giving red flag','actually kind of based ngl','unhinged'])} and i had to tell someone`,
  ()=>`actually the martingale strategy DOES work you just need ${pick(['infinite money','patience','the right casino','to believe in yourself','better vibes'])}`,
  ()=>`i'm not racist but ${pick(['have you considered','what if','hear me out','statistically speaking'])} ${pick(['the data','my uncle','a podcast','common sense'])} says—`,
  ()=>`ur so valid for this actually. i'm in my era of being ${pick(['hyper-independent','delusional','unbothered','sigma','on my grind'])} and this really resonated`,
  ()=>`i applied to ${randi(200,800)} jobs in ${randi(3,18)} months and got ${randi(0,2)} callbacks. my cover letter says "chief vibes officer." this is the system's fault`,
  ()=>`ok so ACTUALLY if you look at what Elon said in context it was clearly ${pick(['a joke','taken out of context','based','misrepresented by the media','based on data'])}`,
  ()=>`day ${randi(100,900)} of my self-improvement journey. ${pick(['looksmaxxing','sleepmaxxing','cold plunging','fasting','sigma grindset'])} has changed everything. anyway can you fund my ${pick(['podcast','crypto','nft project','startup','supplement brand'])}`,
];
const DM_REPLIES=['ratio','skill issue','ratio + skill issue','L','cope','not reading all that','bro really typed all this','noted. ignored.','ratio','skill issue lol','who asked','ratio + fell off','deleted. not read. gone.','blocked (but auto-replied first)'];

const dmFeed = document.getElementById('dm-feed');

function makeDmPost(){
  // This feed is intentionally one-sided: incoming nonsense, automatic "ratio/skill issue" reply.
  const sender=pick(DM_SENDERS);
  const platform=pick(DM_PLATFORMS);
  const msg=pick(DM_MSGS)();
  const reply=pick(DM_REPLIES);
  const did='dm'+Date.now();
  const div=document.createElement('div'); div.className='dm-post'; div.id=did;
  div.innerHTML=`
    <div class="dm-header">
      <span class="dm-sender">${sender}</span>
      <span class="dm-platform">${platform}</span>
    </div>
    <div class="dm-msg">${msg}</div>
    <div class="dm-reply">${reply}</div>`;
  dmFeed.insertBefore(div,dmFeed.firstChild);
  while(dmFeed.children.length>6) dmFeed.removeChild(dmFeed.lastChild);
}

// Propaganda cycling
let currentPropIdx=0;
function cyclePropaganda(){
  currentPropIdx=(currentPropIdx+1)%PROPAGANDA_PROMPTS.length;
  document.getElementById('propaganda-prompt').textContent='[ 📡 '+PROPAGANDA_PROMPTS[currentPropIdx]+' ]';
}
setInterval(cyclePropaganda, 90000);

// Initial posts
makePost(); makePost(); makePost();
makeChanPost(); makeChanPost(); makeChanPost();
makeDmPost(); makeDmPost(); makeDmPost();
setInterval(makePost, 8000);
setInterval(makeChanPost, 10000);
setInterval(makeDmPost, 12000);
// Insider tips drop every 2–3 minutes, first one after 45s
setTimeout(()=>{ makeInsiderPost(); setInterval(makeInsiderPost, randi(120,180)*1000); }, 45000);
