// ══════════════════════════════════════════════
// FLIGHT TRACKER
// ══════════════════════════════════════════════
const FC = document.getElementById('flight-canvas');
const FX = FC.getContext('2d');
const flightMapImage = new Image();
flightMapImage.src = 'image.png';
flightMapImage.onload = () => drawFlightMap();
const MAP_Y_SCALE = 0.9;
const MAP_Y_OFFSET = 0.06;

const proj = (lon,lat,W,H) => ({
  x: ((lon+180)/360)*W,
  y: ((((90-lat)/180) * MAP_Y_SCALE) + MAP_Y_OFFSET) * H
});

// Simplified continent polygons [lon, lat]
const LAND = [
  [[-168,72],[-55,50],[-55,25],[-83,8],[-110,20],[-126,50]],
  [[-82,12],[-34,5],[-38,-55],[-75,-55]],
  [[-12,36],[40,36],[40,60],[30,72],[-12,65]],
  [[-18,38],[52,30],[50,-10],[35,-36],[18,-36],[-18,-20]],
  [[25,40],[77,40],[77,8],[25,8]],
  [[25,56],[145,56],[145,78],[25,78]],
  [[65,36],[145,36],[145,0],[100,-9],[65,8]],
  [[113,-12],[155,-12],[155,-44],[113,-44]],
  [[-57,60],[-18,62],[-18,84],[-57,84]],
  [[-8,50],[2,50],[2,60],[-3,60]],
  [[130,30],[142,30],[145,44],[130,44]],
];

const CITIES = {
  'TEL AVIV':     {lon:34.8,  lat:32.1},
  'WASHINGTON':   {lon:-77.0, lat:38.9},
  'MAR-A-LAGO':   {lon:-80.1, lat:26.7},
  'LONDON':       {lon:-0.1,  lat:51.5},
  'RIYADH':       {lon:46.7,  lat:24.7},
  'ZURICH':       {lon:8.5,   lat:47.4},
  'BEDMINSTER':   {lon:-74.6, lat:40.6},
  'DOHA':         {lon:51.5,  lat:25.3},
  'GOLF COURSE':  {lon:-4.2,  lat:57.4},
  'NEW YORK':     {lon:-74.0, lat:40.7},
  'MOSCOW':       {lon:37.6,  lat:55.7},
  'LOS ANGELES':  {lon:-118.2,lat:34.1},
  'NASHVILLE':    {lon:-86.8, lat:36.2},
  'TOKYO':        {lon:139.7, lat:35.7},
  'SYDNEY':       {lon:151.2, lat:-33.9},
  'AUCKLAND':     {lon:174.8, lat:-36.9},
  'CHICAGO':      {lon:-87.6, lat:41.9},
  'PHOENIX':      {lon:-112.1,lat:33.4},
  'SAN FRANCISCO':{lon:-122.4,lat:37.8},
  'MIAMI':        {lon:-80.2, lat:25.8},
  'PARIS':        {lon:2.3,   lat:48.9},
  'AUSTIN':       {lon:-97.7, lat:30.3},
  'DUBAI':        {lon:55.3,  lat:25.2},
  'BEIJING':      {lon:116.4, lat:39.9},
  'SINGAPORE':    {lon:103.8, lat:1.3},
  'TORONTO':      {lon:-79.4, lat:43.7},
  'BERLIN':       {lon:13.4,  lat:52.5},
  'JOHANNESBURG': {lon:28.0,  lat:-26.2},
  'MUMBAI':       {lon:72.8,  lat:19.1},
  'RIO':          {lon:-43.2, lat:-22.9},
  'ISTANBUL':     {lon:29.0,  lat:41.0},
};

const PLANES = [
  {
    id:'bigyahu', callsign:'IAF-001', name:'BIG YAHU', color:'#00d4ff',
    baseAlt:37000, baseSpd:520, co2Base:1200,
    routes:[
      ['TEL AVIV','WASHINGTON'],['WASHINGTON','TEL AVIV'],
      ['TEL AVIV','RIYADH'],['RIYADH','ZURICH'],
      ['ZURICH','LONDON'],['LONDON','TEL AVIV'],
      ['TEL AVIV','DOHA'],['DOHA','DUBAI'],
      ['DUBAI','TEL AVIV'],['TEL AVIV','MOSCOW'],
      ['MOSCOW','BERLIN'],['BERLIN','TEL AVIV'],
      ['TEL AVIV','ISTANBUL'],['ISTANBUL','LONDON'],
    ],
    statuses:['EVADING JOURNALISTS','REQUESTING MORE AID','CALLING SENATOR','DIPLOMATIC IMMUNITY: ACTIVE','ITINERARY: CLASSIFIED','LAWYER: ON HOLD','COALITION: COLLAPSING','DENYING EVERYTHING','PRESS CONFERENCE: CANCELLED','REQUESTING RESUPPLY'],
    routeIdx:0, t:0.15,
  },
  {
    id:'dadatrump', callsign:'MAGA-1', name:'DADA TRUMP', color:'#ff6600',
    baseAlt:35000, baseSpd:490, co2Base:1100,
    routes:[
      ['MAR-A-LAGO','WASHINGTON'],['WASHINGTON','BEDMINSTER'],
      ['BEDMINSTER','GOLF COURSE'],['GOLF COURSE','MAR-A-LAGO'],
      ['MAR-A-LAGO','DOHA'],['DOHA','WASHINGTON'],
      ['WASHINGTON','NEW YORK'],['NEW YORK','MAR-A-LAGO'],
      ['MAR-A-LAGO','RIYADH'],['RIYADH','DUBAI'],
      ['DUBAI','MAR-A-LAGO'],['WASHINGTON','TORONTO'],
      ['TORONTO','BEDMINSTER'],['NEW YORK','MIAMI'],
    ],
    statuses:['EN ROUTE TO GOLF','AVOIDING BRIEFINGS','TWEETING IN AIR','DEAL-MAKING MODE: ON','NEEDS DIET COKE: CRITICAL','GOLF HANDICAP: DISPUTED','TARIFF IDEAS: FORMING','PRESS CONFERENCE: UNLIKELY','POSTING ON SOCIAL MEDIA','DECLASSIFYING SOMETHING'],
    routeIdx:2, t:0.4,
  },
  {
    id:'taylorswift', callsign:'N898TS', name:'T-SWIFT', color:'#ff0080',
    baseAlt:41000, baseSpd:540, co2Base:2200,
    routes:[
      ['LOS ANGELES','NASHVILLE'],['NASHVILLE','NEW YORK'],
      ['NEW YORK','LONDON'],['LONDON','PARIS'],
      ['PARIS','TOKYO'],['TOKYO','SYDNEY'],
      ['SYDNEY','SINGAPORE'],['SINGAPORE','LOS ANGELES'],
      ['LOS ANGELES','NEW YORK'],['NEW YORK','MIAMI'],
      ['MIAMI','NASHVILLE'],['NASHVILLE','BERLIN'],
      ['BERLIN','LONDON'],['LONDON','NEW YORK'],
      ['TOKYO','RIO'],['RIO','LOS ANGELES'],
    ],
    statuses:['CARBON FOOTPRINT: CATASTROPHIC','PRIVATE JET HRS: 178/MONTH','CLIMATE SPEECH: SCHEDULED','ERAS TOUR: BOARDING','SPOTIFY STREAMS: UPLOADING','BLOCKING PAPARAZZI','SQUAD ASSEMBLED','RELEASING ANOTHER ALBUM','BOYFRIEND TRACKING: ACTIVE','CO2: ASTRONOMICAL','CARBON CREDITS: MAXED OUT','GREENWASHING: IN PROGRESS'],
    routeIdx:0, t:0.3,
  },
  {
    id:'pthiel', callsign:'PLTR-PRIV', name:'P. THIEL', color:'#9d4edd',
    baseAlt:43000, baseSpd:475, co2Base:900,
    routes:[
      ['SAN FRANCISCO','NEW YORK'],['NEW YORK','WASHINGTON'],
      ['WASHINGTON','LONDON'],['LONDON','ZURICH'],
      ['ZURICH','AUCKLAND'],['AUCKLAND','SAN FRANCISCO'],
      ['SAN FRANCISCO','WASHINGTON'],['WASHINGTON','AUCKLAND'],
      ['AUCKLAND','SINGAPORE'],['SINGAPORE','ZURICH'],
      ['ZURICH','SAN FRANCISCO'],['LONDON','BERLIN'],
      ['BERLIN','WASHINGTON'],['MUMBAI','AUCKLAND'],
    ],
    statuses:['SOURCING YOUNG BLOOD','DEMOCRACY: STILL BAD','IMMORTALITY: STEP 4','SURVEILLANCE CAPITALISM: GOOD','BACKING WEIRD CANDIDATE','NZ BUNKER: FULLY STOCKED','ANTI-AGING PROTOCOL: ACTIVE','MONITORING EVERYTHING','THIEL FELLOWSHIP CALL','DATA MINING: YOUR DATA','WATCHING YOU RIGHT NOW','EPSTEIN ISLAND: NO COMMENT'],
    routeIdx:3, t:0.6,
  },
  {
    id:'ckirk', callsign:'TPUSA-1', name:'C. KIRK', color:'#ff4400',
    baseAlt:29000, baseSpd:440, co2Base:750,
    routes:[
      ['PHOENIX','AUSTIN'],['AUSTIN','NASHVILLE'],
      ['NASHVILLE','NEW YORK'],['NEW YORK','WASHINGTON'],
      ['WASHINGTON','PHOENIX'],['PHOENIX','LOS ANGELES'],
      ['LOS ANGELES','MIAMI'],['MIAMI','WASHINGTON'],
      ['WASHINGTON','NASHVILLE'],['NASHVILLE','PHOENIX'],
      ['PHOENIX','TORONTO'],['TORONTO','WASHINGTON'],
      ['WASHINGTON','AUSTIN'],['MIAMI','PHOENIX'],
    ],
    statuses:['OWNING THE LIBS','DEBATING 14 STUDENTS','CAMPUS SPEECH: CANCELLED','BOOK SIGNING: 3 ATTENDEES','TWEET DRAFTED: UNSENT','FUNDRAISING: SUCCESSFUL','TINY NECK: CONFIRMED','BLAMING UNIVERSITIES','TPUSA TOUR: SLIGHTLY DELAYED','FACTS DONT CARE: CONFIRMED'],
    routeIdx:1, t:0.5,
  },
];

// Ground units — tracked but not flying
const GROUND_UNITS = [
  {
    id:'mohan', name:'MOHAN RAVAL', callsign:'EKKO MAIN', color:'#ffd700',
    city:'CHICAGO',
    statuses:['INTING ON THE RIFT','EKKO DIFF · UNACCEPTABLE','REFUSED TO FLASH (AGAIN)','0/9/2 · BLAMING TEAMMATES','WAGE CAGE: CHICAGO · DAY 847','MISSING EVERY SKILLSHOT','FARMING UNDER TOWER','AFK IN BASE · AGAIN','BUILDING WRONG ITEMS (CONFIRMED)','PERMA-CAMPED BY JUNGLER','TILTED · DO NOT ENGAGE','HARD STUCK IRON IV'],
  },
];

// Crash system
const crashedPlanes = new Set();
let activeCrash = null;
const manualFlightNotes = {};
let crashAutoTimer = null;
let selectedPlaneId = null;

function triggerCrash(plane) {
  if(crashedPlanes.has(plane.id)) return;
  crashedPlanes.add(plane.id);
  activeCrash = plane;
  const r = plane.routes[plane.routeIdx];
  document.getElementById('crash-callsign').textContent = plane.callsign + ' · ' + plane.name;
  document.getElementById('crash-name').textContent = '⚠ SIGNAL LOST ⚠';
  document.getElementById('crash-location').textContent = `LAST KNOWN: ${r[0]} → ${r[1]} · ${Math.round(plane.t*100)}% COMPLETE`;
  document.getElementById('crash-evidence').textContent =
    `BLACK BOX: ${pick(['RECOVERED','MISSING','CLASSIFIED','ENCRYPTED'])} · ` +
    `WITNESSES: ${randi(0,3)} · ` +
    `SURVIVORS: ${pick(['UNKNOWN','CLASSIFIED','0 (OFFICIAL)','PENDING VERIFICATION'])} · ` +
    `COVERUP POTENTIAL: ${pick(['HIGH','VERY HIGH','ASTRONOMICAL','UNPRECEDENTED'])} · ` +
    `EPSTEIN LINK: ${pick(['UNCONFIRMED','BEING INVESTIGATED','NO COMMENT','CLASSIFIED'])}`;
  document.getElementById('crash-modal').classList.add('show');
  playUiSound('crash-alert');
  toast(`⚠ ${plane.callsign} :: SIGNAL LOST OVER ${r[1]} REGION`, plane.color);
  clearTimeout(crashAutoTimer);
  crashAutoTimer = setTimeout(() => { document.getElementById('crash-modal').classList.remove('show'); activeCrash = null; }, 15000);
  // Auto-respawn after 50 seconds
  setTimeout(() => {
    crashedPlanes.delete(plane.id);
    plane.t = 0;
    plane.routeIdx = randi(0, plane.routes.length-1);
    toast(`📡 ${plane.callsign} :: SIGNAL REACQUIRED. OFFICIAL EXPLANATION: WEATHER.`, plane.color);
  }, 50000);
}

function investigateCrash() {
  clearTimeout(crashAutoTimer);
  document.getElementById('crash-modal').classList.remove('show');
  if(!activeCrash) return;
  playUiSound('crash-investigate');
  const outcomes = [
    `BLACK BOX ANALYSIS COMPLETE: EVERYTHING IS FINE. NOTHING TO SEE HERE. MOVE ALONG.`,
    `INVESTIGATION: ${activeCrash.name} WAS NEVER ON THIS FLIGHT. THE FLIGHT DIDN'T EXIST. YOU IMAGINED IT.`,
    `NTSB REPORT: CAUSE OF CRASH — TOO MUCH DEMOCRACY. CASE CLOSED. HAVE A GREAT DAY.`,
    `WHISTLEBLOWER LOCATED. STATUS: MANAGED. INVESTIGATION: CONCLUDED. RESULTS: CLASSIFIED.`,
    `BLACK BOX CONTENTS: CLASSIFIED UNDER NATIONAL SECURITY ACT §69.420. SORRY. NOT SORRY.`,
    `FINDINGS: PILOT ERROR. PILOT: NOT AVAILABLE FOR COMMENT. COINCIDENCE: CONFIRMED.`,
  ];
  toast(pick(outcomes), 'var(--cyan)');
  activeCrash = null;
}

function coverupCrash() {
  clearTimeout(crashAutoTimer);
  document.getElementById('crash-modal').classList.remove('show');
  if(!activeCrash) return;
  playUiSound('crash-coverup');
  const outcomes = [
    `COVERUP INITIATED. ALL RECORDS EXPUNGED. YOU SAW NOTHING. NOTHING SAW YOU.`,
    `CLASSIFIED. ${activeCrash.name}'S PLANE? NEVER EXISTED. MANIFEST: SHREDDED. JOURNALISTS: AUDITED.`,
    `OMNIBUS BILL ATTACHED. FLIGHT RECORDS: DELETED. COST TO TAXPAYER: $4.7B. APPROVED UNANIMOUSLY.`,
    `COVERUP COMPLETE. JOURNALIST ASKING QUESTIONS: AUDITED. REDDIT THREAD: REMOVED. SLEEP WELL.`,
    `OPERATION ${activeCrash.id.toUpperCase()}_ERASURE: INITIATED. ETA: IMMEDIATE. COST: YOUR PROBLEM.`,
  ];
  toast(pick(outcomes), 'var(--red)');
  threatCount += randi(8, 20);
  document.getElementById('threat-count').textContent = threatCount;
  activeCrash = null;
}

// ── Drawing ──────────────────────────────────

function planePos(plane,W,H){
  const r=plane.routes[plane.routeIdx];
  const f=CITIES[r[0]], t=CITIES[r[1]];
  return proj(f.lon+(t.lon-f.lon)*plane.t, f.lat+(t.lat-f.lat)*plane.t, W, H);
}
function planeHdg(plane){
  const r=plane.routes[plane.routeIdx];
  const f=CITIES[r[0]], t=CITIES[r[1]];
  return Math.atan2(-(t.lat-f.lat), t.lon-f.lon);
}

function pickNextDestination(origin) {
  const options = Object.keys(CITIES).filter(city => city !== origin);
  return pick(options);
}

function reroutePlane(planeId) {
  const plane = PLANES.find(p => p.id === planeId);
  if(!plane || crashedPlanes.has(plane.id)) return;
  const currentRoute = plane.routes[plane.routeIdx];
  const origin = currentRoute[0];
  const destination = pickNextDestination(origin);
  plane.routes[plane.routeIdx] = [origin, destination];
  plane.t = Math.min(plane.t, 0.12);
  manualFlightNotes[plane.id] = `MANUAL REROUTE → ${destination}`;
  toast(`REROUTED ${plane.name} TO ${destination}`, plane.color);
  updateFlightInfo();
  drawFlightMap();
}

function drawFlightLabel(text, x, y, fill, font) {
  FX.save();
  FX.font = font;
  FX.textAlign = 'center';
  FX.lineWidth = 3;
  FX.strokeStyle = 'rgba(0,0,0,0.88)';
  FX.strokeText(text, x, y);
  FX.fillStyle = fill;
  FX.fillText(text, x, y);
  FX.restore();
}

function drawFlightMap(){
  const panel = document.getElementById('panel-flight');
  const info  = document.getElementById('flight-info');
  const title = panel.querySelector('.panel-title');
  const W=FC.width  = panel.clientWidth;
  const H=FC.height = Math.max(250, panel.clientHeight - info.clientHeight - title.clientHeight);
  FX.clearRect(0,0,W,H);

  // Ocean
  FX.fillStyle='#020408'; FX.fillRect(0,0,W,H);
  if(flightMapImage.complete){
    FX.save();
    FX.globalAlpha=0.82;
    FX.drawImage(flightMapImage,0,0,W,H);
    FX.restore();
  }

  // Grid
  FX.strokeStyle='rgba(0,220,255,0.12)'; FX.lineWidth=0.5;
  for(let lat=-90;lat<=90;lat+=30){const y=proj(0,lat,W,H).y;FX.beginPath();FX.moveTo(0,y);FX.lineTo(W,y);FX.stroke();}
  for(let lon=-180;lon<=180;lon+=30){const x=proj(lon,0,W,H).x;FX.beginPath();FX.moveTo(x,0);FX.lineTo(x,H);FX.stroke();}

  // Equator
  FX.strokeStyle='rgba(0,255,65,0.18)';FX.lineWidth=0.5;FX.setLineDash([4,4]);
  const ey=proj(0,0,W,H).y;
  FX.beginPath();FX.moveTo(0,ey);FX.lineTo(W,ey);FX.stroke();FX.setLineDash([]);

  // City dots
  FX.font='8px Share Tech Mono,monospace';
  const activeCities=new Set(PLANES.filter(p=>!crashedPlanes.has(p.id)).flatMap(p=>p.routes[p.routeIdx]));
  Object.entries(CITIES).forEach(([name,c])=>{
    const p=proj(c.lon,c.lat,W,H);
    const active=activeCities.has(name);
    FX.fillStyle=active?'#00ff41':'#1a3a1a';
    FX.shadowColor=active?'#00ff41':'transparent';FX.shadowBlur=active?6:0;
    FX.beginPath();FX.arc(p.x,p.y,active?3:2,0,Math.PI*2);FX.fill();
    FX.shadowBlur=0;
    FX.fillStyle=active?'#006a20':'#0a1a0a';
    FX.textAlign='left';FX.fillText(name,p.x+5,p.y+3);
  });

  // Flight paths for active planes
  PLANES.forEach(plane=>{
    if(crashedPlanes.has(plane.id)) return;
    const r=plane.routes[plane.routeIdx];
    const f=CITIES[r[0]],t=CITIES[r[1]];
    const pf=proj(f.lon,f.lat,W,H),pt=proj(t.lon,t.lat,W,H);
    const pos=planePos(plane,W,H);
    FX.strokeStyle=plane.color+'40';FX.lineWidth=1.15;FX.setLineDash([4,4]);
    FX.beginPath();FX.moveTo(pf.x,pf.y);FX.lineTo(pt.x,pt.y);FX.stroke();FX.setLineDash([]);
    FX.strokeStyle=plane.color+'99';FX.lineWidth=1.9;
    FX.beginPath();FX.moveTo(pf.x,pf.y);FX.lineTo(pos.x,pos.y);FX.stroke();
  });

  // Plane icons
  PLANES.forEach(plane=>{
    if(crashedPlanes.has(plane.id)) return;
    const pos=planePos(plane,W,H);
    const hdg=planeHdg(plane);
    FX.save();
    FX.translate(pos.x,pos.y);FX.rotate(hdg);
    FX.fillStyle=plane.color;FX.shadowColor=plane.color;FX.shadowBlur=18;
    FX.beginPath();
    FX.moveTo(15,0);
    FX.lineTo(-7,-6);
    FX.lineTo(-2,0);
    FX.lineTo(-7,6);
    FX.closePath();
    FX.fill();
    FX.strokeStyle='rgba(255,255,255,0.45)';
    FX.lineWidth=1;
    FX.stroke();
    FX.shadowBlur=0;FX.restore();
    drawFlightLabel(plane.name, pos.x, pos.y - 22, plane.color, 'bold 13px Share Tech Mono,monospace');
    drawFlightLabel(plane.callsign, pos.x, pos.y - 9, '#f4f4f4', 'bold 10px Share Tech Mono,monospace');
  });

  // Ground units
  GROUND_UNITS.forEach(unit=>{
    const city=CITIES[unit.city];
    if(!city) return;
    const pos=proj(city.lon,city.lat,W,H);
    // Pulsing beacon
    const t2=(Date.now()%1200)/1200;
    const pulse=0.7+0.3*Math.sin(t2*Math.PI*2);
    FX.strokeStyle='rgba(255,215,0,0.55)';
    FX.lineWidth=2;
    FX.beginPath();
    FX.arc(pos.x,pos.y,12 + 5 * pulse,0,Math.PI*2);
    FX.stroke();
    FX.fillStyle=unit.color;
    FX.shadowColor=unit.color;
    FX.shadowBlur=18*pulse;
    FX.save();
    FX.translate(pos.x,pos.y);FX.rotate(Math.PI/4);
    FX.fillRect(-7*pulse,-7*pulse,14*pulse,14*pulse);
    FX.restore();
    FX.shadowBlur=0;
    drawFlightLabel(unit.name, pos.x, pos.y - 20, unit.color, 'bold 11px Share Tech Mono,monospace');
    drawFlightLabel(`[${unit.callsign}]`, pos.x, pos.y - 8, '#fff0a8', 'bold 9px Share Tech Mono,monospace');
    drawFlightLabel('⚔ INTING', pos.x, pos.y + 16, '#ff9d00', 'bold 9px Share Tech Mono,monospace');
  });
}

function updateFlightInfo(){
  PLANES.forEach(plane=>{
    const el=document.getElementById('plane-info-'+plane.id);
    if(!el) return;
    const isSelected = selectedPlaneId === plane.id;

    if(crashedPlanes.has(plane.id)){
      el.innerHTML=`
        <div class="pi-call" onclick="selectPlane('${plane.id}')">${plane.callsign}</div>
        <div class="pi-name" style="color:var(--red)">⚠ ${plane.name}</div>
        ${isSelected ? `
          <div class="pi-route" style="color:var(--red)">SIGNAL LOST</div>
          <div class="pi-status" style="color:var(--red)">INCIDENT UNDER INVESTIGATION</div>
          <div class="pi-stats" style="color:#550000">STATUS: CLASSIFIED · ETA: UNKNOWN</div>
          <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${Math.round(plane.t*100)}%;background:var(--red)"></div></div>
        ` : ''}`;
      el.classList.toggle('selected', isSelected);
      return;
    }
    const r=plane.routes[plane.routeIdx];
    const status=pick(plane.statuses);
    const note=manualFlightNotes[plane.id];
    const alt=plane.baseAlt+randi(-400,400);
    const spd=plane.baseSpd+randi(-20,20);
    const eta=Math.floor((1-plane.t)*randi(40,260));
    const pct=Math.round(plane.t*100);
    const co2=plane.co2Base+randi(-100,200);
    el.innerHTML=`
      <div class="pi-call" onclick="selectPlane('${plane.id}')">${plane.callsign}</div>
      <div class="pi-name" style="color:${plane.color}">${plane.name}</div>
      ${isSelected ? `
        <div class="pi-route">${r[0]} → ${r[1]}</div>
        <div class="pi-status">${note || status}</div>
        <div class="pi-stats">ALT:${alt.toLocaleString()}ft · SPD:${spd}kts · ETA:${eta}min</div>
        <div class="pi-stats" style="color:#ff6600">CO₂:${co2}kg/hr · OFFSET:LOL</div>
        <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${pct}%;background:${plane.color}"></div></div>
        <div class="pi-btns"><button class="pi-btn" onclick="reroutePlane('${plane.id}')">REROUTE</button></div>
      ` : ''}`;
    el.classList.toggle('selected', isSelected);
    delete manualFlightNotes[plane.id];
  });

  GROUND_UNITS.forEach(unit=>{
    const el=document.getElementById('plane-info-'+unit.id);
    if(!el) return;
    const isSelected = selectedPlaneId === unit.id;
    const status=pick(unit.statuses);
    const lp=randi(-400,-10);
    el.innerHTML=`
      <div class="pi-call" onclick="selectPlane('${unit.id}')">[GROUND UNIT · CHICAGO]</div>
      <div class="pi-name" style="color:${unit.color}">${unit.name}</div>
      ${isSelected ? `
        <div class="pi-route" style="color:#886633">📍 WAGE CAGE · NO ESCAPE</div>
        <div class="pi-status">${status}</div>
        <div class="pi-stats" style="color:#886633">CHAMP: EKKO · RANK: IRON IV · LP: ${lp}</div>
        <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${Math.max(0,100+lp/4)}%;background:${unit.color}"></div></div>
      ` : ''}`;
    el.classList.toggle('selected', isSelected);
  });
}

function selectPlane(planeId) {
  selectedPlaneId = selectedPlaneId === planeId ? null : planeId;
  updateFlightInfo();
}

function flightTick(){
  PLANES.forEach(plane=>{
    if(crashedPlanes.has(plane.id)) return;
    plane.t += 0.00024+Math.random()*0.0001;
    // Random crash chance (~1 in 36000 per frame ≈ much rarer)
    if(Math.random() < 1/36000 && !activeCrash){
      triggerCrash(plane);
      return;
    }
    if(plane.t >= 1){
      const completedRoute = plane.routes[plane.routeIdx];
      const nextOrigin = completedRoute[1];
      const nextDestination = pickNextDestination(nextOrigin);
      plane.t = 0;
      plane.routeIdx = (plane.routeIdx+1)%plane.routes.length;
      plane.routes[plane.routeIdx] = [nextOrigin, nextDestination];
    }
  });
  drawFlightMap();
  requestAnimationFrame(flightTick);
}

// Enhanced click — planes AND ground units
FC.addEventListener('click', e=>{
  const rect=FC.getBoundingClientRect();
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  const W=FC.width, H=FC.height;
  let hit=null, minD=30;

  PLANES.forEach(plane=>{
    if(crashedPlanes.has(plane.id)) return;
    const pos=planePos(plane,W,H);
    const d=Math.hypot(mx-pos.x,my-pos.y);
    if(d<minD){minD=d;hit={type:'plane',obj:plane};}
  });

  GROUND_UNITS.forEach(unit=>{
    const city=CITIES[unit.city];
    if(!city) return;
    const pos=proj(city.lon,city.lat,W,H);
    const d=Math.hypot(mx-pos.x,my-pos.y);
    if(d<minD){minD=d;hit={type:'ground',obj:unit};}
  });

  if(!hit) return;

  if(hit.type==='plane'){
    const plane=hit.obj;
    selectPlane(plane.id);
    const r=plane.routes[plane.routeIdx];
    const status=pick(plane.statuses);
    const co2=plane.co2Base+randi(-100,200);
    toast(`✈ [${plane.callsign}] ${plane.name} :: ${r[0]}→${r[1]} :: ${status} :: CO₂:${co2}kg/hr`, plane.color);
  } else {
    const unit=hit.obj;
    selectPlane(unit.id);
    const status=pick(unit.statuses);
    toast(`📍 [${unit.callsign}] ${unit.name} :: ${unit.city} :: ${status}`, unit.color);
  }
});

document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    document.getElementById('crash-modal').classList.remove('show');
    activeCrash=null;
  }
});

drawFlightMap(); flightTick();
setInterval(updateFlightInfo, 2000);
updateFlightInfo();
