// ══════════════════════════════════════════════
// REDDIT SLOP
// ══════════════════════════════════════════════
const rFeed=document.getElementById('reddit-feed');
const SUBS=['r/AITA','r/tifu','r/AmIOverreacting','r/relationship_advice','r/wallstreetbets','r/personalfinance','r/mildlyinfuriating','r/confession','r/gaming','r/pcmasterrace','r/conspiracy','r/antiwork','r/LinkedInLunatics','r/PublicFreakout','r/unpopularopinion','r/teenagers','r/legaladvice','r/survivinginfidelity'];
const ANIMALS=['iguana','harley','ferret','bearded dragon','emotional support peacock','axolotl','therapy hamster','miniature horse'];
const FOODS=['soup','pasta','casserole','lasagna','chili','risotto','protein shake','emotional support lasagna'];
const AMF=['24M','27M','31M','19M','34M','22M','29M','41M','45M'];
const AFF=['23F','26F','29F','21F','33F','25F','28F','38F','19F'];
const ADJS=['mid','basic','cringe','sus','lowkey fire','not it','unhinged','giving red flag','chronically online','main character'];
const VERDICTS=['YTA','NTA','ESH','NAH','YTA/NTA war in comments','INFO needed','Soft YTA','Gentle NTA'];

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

let postVotes={};
function makePost(){
  const sub=pick(SUBS), title=pick(TMPLS)();
  const ups=randi(300,62000), cmts=randi(80,4200);
  const verdict=pick(VERDICTS);
  const isYTA=verdict.startsWith('Y')||verdict.startsWith('E');
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
    </div>`;
  rFeed.insertBefore(div,rFeed.firstChild);
  while(rFeed.children.length>4) rFeed.removeChild(rFeed.lastChild);
}
function vote(pid,dir){
  if(!postVotes[pid]) return;
  postVotes[pid].up += dir==='up'?1:-1;
  const el=document.getElementById('ups-'+pid);
  if(el) el.textContent=postVotes[pid].up.toLocaleString();
  toast(dir==='up'?'▲ UPDOOTED':'▼ RATIO APPLIED', dir==='up'?'var(--amber)':'var(--purple)');
}
makePost(); makePost(); makePost();
setInterval(makePost,8000);
