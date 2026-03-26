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

const proj = (lon, lat, W, H) => ({
  x: ((lon + 180) / 360) * W,
  y: ((((90 - lat) / 180) * MAP_Y_SCALE) + MAP_Y_OFFSET) * H,
});

const CITIES = {
  'TEL AVIV':      { lon: 34.8, lat: 32.1 },
  'WASHINGTON':    { lon: -77.0, lat: 38.9 },
  'MAR-A-LAGO':    { lon: -80.1, lat: 26.7 },
  'LONDON':        { lon: -0.1, lat: 51.5 },
  'RIYADH':        { lon: 46.7, lat: 24.7 },
  'ZURICH':        { lon: 8.5, lat: 47.4 },
  'BEDMINSTER':    { lon: -74.6, lat: 40.6 },
  'DOHA':          { lon: 51.5, lat: 25.3 },
  'GOLF COURSE':   { lon: -4.2, lat: 57.4 },
  'NEW YORK':      { lon: -74.0, lat: 40.7 },
  'MOSCOW':        { lon: 37.6, lat: 55.7 },
  'LOS ANGELES':   { lon: -118.2, lat: 34.1 },
  'NASHVILLE':     { lon: -86.8, lat: 36.2 },
  'TOKYO':         { lon: 139.7, lat: 35.7 },
  'SYDNEY':        { lon: 151.2, lat: -33.9 },
  'AUCKLAND':      { lon: 174.8, lat: -36.9 },
  'CHICAGO':       { lon: -87.6, lat: 41.9 },
  'SAN FRANCISCO': { lon: -122.4, lat: 37.8 },
  'MIAMI':         { lon: -80.2, lat: 25.8 },
  'PARIS':         { lon: 2.3, lat: 48.9 },
  'DUBAI':         { lon: 55.3, lat: 25.2 },
  'SINGAPORE':     { lon: 103.8, lat: 1.3 },
  'TORONTO':       { lon: -79.4, lat: 43.7 },
  'BERLIN':        { lon: 13.4, lat: 52.5 },
  'MUMBAI':        { lon: 72.8, lat: 19.1 },
  'RIO':           { lon: -43.2, lat: -22.9 },
  'ISTANBUL':      { lon: 29.0, lat: 41.0 },
  'BUENOS AIRES':  { lon: -58.4, lat: -34.6 },
  'MELBOURNE':     { lon: 144.9, lat: -37.8 },
  'PERTH':         { lon: 115.9, lat: -31.9 },
};

const PLANES = [
  {
    id: 'bigyahu', callsign: 'IAF-001', name: 'BIG YAHU', color: '#00d4ff',
    baseAlt: 37000, baseSpd: 520, co2Base: 1200,
    routes: [
      ['TEL AVIV', 'WASHINGTON'], ['WASHINGTON', 'TEL AVIV'],
      ['TEL AVIV', 'RIYADH'], ['RIYADH', 'ZURICH'],
      ['ZURICH', 'LONDON'], ['LONDON', 'TEL AVIV'],
      ['TEL AVIV', 'DOHA'], ['DOHA', 'DUBAI'],
      ['DUBAI', 'TEL AVIV'], ['TEL AVIV', 'MOSCOW'],
      ['MOSCOW', 'BERLIN'], ['BERLIN', 'TEL AVIV'],
      ['TEL AVIV', 'ISTANBUL'], ['ISTANBUL', 'LONDON'],
    ],
    statuses: ['EVADING JOURNALISTS', 'REQUESTING MORE AID', 'CALLING SENATOR', 'DIPLOMATIC IMMUNITY: ACTIVE', 'ITINERARY: CLASSIFIED', 'LAWYER: ON HOLD', 'COALITION: COLLAPSING', 'DENYING EVERYTHING', 'PRESS CONFERENCE: CANCELLED', 'REQUESTING RESUPPLY'],
    routeIdx: 0, t: 0.15,
  },
  {
    id: 'dadatrump', callsign: 'MAGA-1', name: 'DADA TRUMP', color: '#ff6600',
    baseAlt: 35000, baseSpd: 490, co2Base: 1100,
    routes: [
      ['MAR-A-LAGO', 'WASHINGTON'], ['WASHINGTON', 'BEDMINSTER'],
      ['BEDMINSTER', 'GOLF COURSE'], ['GOLF COURSE', 'MAR-A-LAGO'],
      ['MAR-A-LAGO', 'DOHA'], ['DOHA', 'WASHINGTON'],
      ['WASHINGTON', 'NEW YORK'], ['NEW YORK', 'MAR-A-LAGO'],
      ['MAR-A-LAGO', 'RIYADH'], ['RIYADH', 'DUBAI'],
      ['DUBAI', 'MAR-A-LAGO'], ['WASHINGTON', 'TORONTO'],
      ['TORONTO', 'BEDMINSTER'], ['NEW YORK', 'MIAMI'],
    ],
    statuses: ['EN ROUTE TO GOLF', 'AVOIDING BRIEFINGS', 'TWEETING IN AIR', 'DEAL-MAKING MODE: ON', 'NEEDS DIET COKE: CRITICAL', 'GOLF HANDICAP: DISPUTED', 'TARIFF IDEAS: FORMING', 'PRESS CONFERENCE: UNLIKELY', 'POSTING ON SOCIAL MEDIA', 'DECLASSIFYING SOMETHING'],
    routeIdx: 2, t: 0.4,
  },
  {
    id: 'taylorswift', callsign: 'N898TS', name: 'T-SWIFT', color: '#ff0080',
    baseAlt: 41000, baseSpd: 540, co2Base: 2200,
    routes: [
      ['LOS ANGELES', 'NASHVILLE'], ['NASHVILLE', 'NEW YORK'],
      ['NEW YORK', 'LONDON'], ['LONDON', 'PARIS'],
      ['PARIS', 'TOKYO'], ['TOKYO', 'SYDNEY'],
      ['SYDNEY', 'SINGAPORE'], ['SINGAPORE', 'LOS ANGELES'],
      ['LOS ANGELES', 'NEW YORK'], ['NEW YORK', 'MIAMI'],
      ['MIAMI', 'NASHVILLE'], ['NASHVILLE', 'BERLIN'],
      ['BERLIN', 'LONDON'], ['LONDON', 'NEW YORK'],
      ['TOKYO', 'RIO'], ['RIO', 'LOS ANGELES'],
    ],
    statuses: ['CARBON FOOTPRINT: CATASTROPHIC', 'PRIVATE JET HRS: 178/MONTH', 'CLIMATE SPEECH: SCHEDULED', 'ERAS TOUR: BOARDING', 'SPOTIFY STREAMS: UPLOADING', 'BLOCKING PAPARAZZI', 'SQUAD ASSEMBLED', 'RELEASING ANOTHER ALBUM', 'BOYFRIEND TRACKING: ACTIVE', 'CO2: ASTRONOMICAL', 'CARBON CREDITS: MAXED OUT', 'GREENWASHING: IN PROGRESS'],
    routeIdx: 0, t: 0.3,
  },
  {
    id: 'pthiel', callsign: 'PLTR-PRIV', name: 'P. THIEL', color: '#9d4edd',
    baseAlt: 43000, baseSpd: 475, co2Base: 900,
    routes: [
      ['SAN FRANCISCO', 'NEW YORK'], ['NEW YORK', 'WASHINGTON'],
      ['WASHINGTON', 'LONDON'], ['LONDON', 'ZURICH'],
      ['ZURICH', 'AUCKLAND'], ['AUCKLAND', 'SAN FRANCISCO'],
      ['SAN FRANCISCO', 'WASHINGTON'], ['WASHINGTON', 'AUCKLAND'],
      ['AUCKLAND', 'SINGAPORE'], ['SINGAPORE', 'ZURICH'],
      ['ZURICH', 'SAN FRANCISCO'], ['LONDON', 'BERLIN'],
      ['BERLIN', 'WASHINGTON'], ['MUMBAI', 'AUCKLAND'],
    ],
    statuses: ['SOURCING YOUNG BLOOD', 'DEMOCRACY: STILL BAD', 'IMMORTALITY: STEP 4', 'SURVEILLANCE CAPITALISM: GOOD', 'BACKING WEIRD CANDIDATE', 'NZ BUNKER: FULLY STOCKED', 'ANTI-AGING PROTOCOL: ACTIVE', 'MONITORING EVERYTHING', 'THIEL FELLOWSHIP CALL', 'DATA MINING: YOUR DATA', 'WATCHING YOU RIGHT NOW', 'EPSTEIN ISLAND: NO COMMENT'],
    routeIdx: 3, t: 0.6,
  },
];

const GROUND_UNITS = [
  {
    id: 'mohan', name: 'MOHAN RAVAL', callsign: 'EKKO MAIN', color: '#ffd700',
    city: 'CHICAGO', locLabel: 'CHICAGO WAGE CAGE',
    statuses: ['INTING ON THE RIFT', 'EKKO DIFF · UNACCEPTABLE', 'REFUSED TO FLASH (AGAIN)', '0/9/2 · BLAMING TEAMMATES', 'WAGE CAGE: CHICAGO · DAY 847', 'MISSING EVERY SKILLSHOT', 'FARMING UNDER TOWER', 'AFK IN BASE · AGAIN', 'BUILDING WRONG ITEMS (CONFIRMED)', 'PERMA-CAMPED BY JUNGLER', 'TILTED · DO NOT ENGAGE', 'HARD STUCK IRON IV'],
  },
  {
    id: 'ckirkbunker', name: 'PATAGONIA BUNKER', callsign: 'BK-ARG-1', color: '#ff8844',
    city: 'BUENOS AIRES', locLabel: 'ARGENTINA SAFEHOUSE',
    statuses: ['CAMPUS TOUR: REMOTE ONLY', 'BUNKER PODCAST: RECORDING', 'SUPPLY TUNNEL: SEALED', 'DONOR DINNER: BELOW GROUND', 'PANIC ROOM WIFI: STABLE'],
  },
  {
    id: 'epsteinbunker', name: 'OUTBACK BUNKER', callsign: 'BK-AUS-9', color: '#d18cff',
    city: 'MELBOURNE', locLabel: 'AUSTRALIA DEEP STORAGE',
    statuses: ['RUNWAY LIGHTS: OFF', 'ARCHIVE ROOM: LOCKED', 'VISITORS DENIED', 'HANGAR DOOR: SEALED', 'OPERATORS: UNDISCLOSED'],
  },
  {
    id: 'subatlantic', name: 'NUCLEAR SUB ATLANTIC', callsign: 'SUB-ATL-3', color: '#00d4ff',
    lon: -24, lat: -31, locLabel: 'SOUTH ATLANTIC',
    statuses: ['THERMOCLINE MASKING: ACTIVE', 'BALLISTIC PACKAGE: ARMED', 'PING SENT: "hello :)"', 'NOISE DISCIPLINE: ON', 'PERISCOPE DEPTH: DENIED'],
  },
  {
    id: 'subcoral', name: 'NUCLEAR SUB CORAL', callsign: 'SUB-AUS-7', color: '#00ffb3',
    lon: 153, lat: -19, locLabel: 'CORAL SEA',
    statuses: ['SONAR GHOSTING: CLEAN', 'REACTOR HUM: NORMAL', 'COURSE UNKNOWN', 'TRACKING FREIGHT TRAFFIC', 'COMMS WINDOW: 12 SEC'],
  },
];

const crashedPlanes = new Set();
let activeCrash = null;
const manualFlightNotes = {};
let crashAutoTimer = null;
let selectedPlaneId = null;

const lerp = (a, b, t) => a + (b - a) * t;
const lerpPoint = (a, b, t) => ({ lon: lerp(a.lon, b.lon, t), lat: lerp(a.lat, b.lat, t) });

function bezierPoint(path, t) {
  const inv = 1 - t;
  return {
    lon: inv * inv * path.start.lon + 2 * inv * t * path.control.lon + t * t * path.end.lon,
    lat: inv * inv * path.start.lat + 2 * inv * t * path.control.lat + t * t * path.end.lat,
  };
}

function bezierTangent(path, t) {
  return {
    lon: 2 * (1 - t) * (path.control.lon - path.start.lon) + 2 * t * (path.end.lon - path.control.lon),
    lat: 2 * (1 - t) * (path.control.lat - path.start.lat) + 2 * t * (path.end.lat - path.control.lat),
  };
}

function sampleCurve(path, steps = 28) {
  const pts = [];
  for(let i = 0; i <= steps; i++) pts.push(bezierPoint(path, i / steps));
  return pts;
}

function getPlaneRoute(plane) {
  return plane.routes[plane.routeIdx];
}

function getPlaneStartPoint(plane) {
  const route = getPlaneRoute(plane);
  return plane.path ? plane.path.start : CITIES[route[0]];
}

function getPlaneEndPoint(plane) {
  const route = getPlaneRoute(plane);
  return plane.path ? plane.path.end : CITIES[route[1]];
}

function getPlanePointLonLat(plane) {
  const start = getPlaneStartPoint(plane);
  if(plane.path) return bezierPoint(plane.path, plane.t);
  const end = getPlaneEndPoint(plane);
  return lerpPoint(start, end, plane.t);
}

function getPlaneHeadingVector(plane) {
  if(plane.path) return bezierTangent(plane.path, plane.t);
  const start = getPlaneStartPoint(plane);
  const end = getPlaneEndPoint(plane);
  return { lon: end.lon - start.lon, lat: end.lat - start.lat };
}

function planePos(plane, W, H) {
  const p = getPlanePointLonLat(plane);
  return proj(p.lon, p.lat, W, H);
}

function planeHdg(plane) {
  const v = getPlaneHeadingVector(plane);
  return Math.atan2(-v.lat, v.lon);
}

function getDisplayOrigin(plane) {
  return plane.path?.originLabel || getPlaneRoute(plane)[0];
}

function getUnitPos(unit, W, H) {
  if(typeof unit.lon === 'number' && typeof unit.lat === 'number') return proj(unit.lon, unit.lat, W, H);
  const city = CITIES[unit.city];
  return city ? proj(city.lon, city.lat, W, H) : null;
}

function updateFlightSummary() {
  const el = document.getElementById('ft-status');
  if(el) el.textContent = `${PLANES.length} AIRCRAFT + ${GROUND_UNITS.length} CONTACTS MONITORED`;
}

function triggerCrash(plane) {
  if(crashedPlanes.has(plane.id)) return;
  crashedPlanes.add(plane.id);
  activeCrash = plane;
  const route = getPlaneRoute(plane);
  document.getElementById('crash-callsign').textContent = plane.callsign + ' · ' + plane.name;
  document.getElementById('crash-name').textContent = '⚠ SIGNAL LOST ⚠';
  document.getElementById('crash-location').textContent = `LAST KNOWN: ${getDisplayOrigin(plane)} → ${route[1]} · ${Math.round(plane.t * 100)}% COMPLETE`;
  document.getElementById('crash-evidence').textContent =
    `BLACK BOX: ${pick(['RECOVERED', 'MISSING', 'CLASSIFIED', 'ENCRYPTED'])} · ` +
    `WITNESSES: ${randi(0, 3)} · ` +
    `SURVIVORS: ${pick(['UNKNOWN', 'CLASSIFIED', '0 (OFFICIAL)', 'PENDING VERIFICATION'])} · ` +
    `COVERUP POTENTIAL: ${pick(['HIGH', 'VERY HIGH', 'ASTRONOMICAL', 'UNPRECEDENTED'])} · ` +
    `EPSTEIN LINK: ${pick(['UNCONFIRMED', 'BEING INVESTIGATED', 'NO COMMENT', 'CLASSIFIED'])}`;
  document.getElementById('crash-modal').classList.add('show');
  playUiSound('crash-alert');
  toast(`⚠ ${plane.callsign} :: SIGNAL LOST OVER ${route[1]} REGION`, plane.color, true);
  clearTimeout(crashAutoTimer);
  crashAutoTimer = setTimeout(() => {
    document.getElementById('crash-modal').classList.remove('show');
    activeCrash = null;
  }, 15000);
  setTimeout(() => {
    crashedPlanes.delete(plane.id);
    plane.t = 0;
    plane.path = null;
    delete manualFlightNotes[plane.id];
    if(selectedPlaneId === plane.id) selectedPlaneId = null;
    plane.routeIdx = randi(0, plane.routes.length - 1);
    updateFlightInfo();
    toast(`📡 ${plane.callsign} :: SIGNAL REACQUIRED. OFFICIAL EXPLANATION: WEATHER.`, plane.color, true);
  }, 50000);
}

function investigateCrash() {
  clearTimeout(crashAutoTimer);
  document.getElementById('crash-modal').classList.remove('show');
  if(!activeCrash) return;
  playUiSound('crash-investigate');
  toast(pick([
    'BLACK BOX ANALYSIS COMPLETE: EVERYTHING IS FINE. NOTHING TO SEE HERE. MOVE ALONG.',
    `INVESTIGATION: ${activeCrash.name} WAS NEVER ON THIS FLIGHT. THE FLIGHT DIDN'T EXIST. YOU IMAGINED IT.`,
    'NTSB REPORT: CAUSE OF CRASH — TOO MUCH DEMOCRACY. CASE CLOSED. HAVE A GREAT DAY.',
    'WHISTLEBLOWER LOCATED. STATUS: MANAGED. INVESTIGATION: CONCLUDED. RESULTS: CLASSIFIED.',
    'BLACK BOX CONTENTS: CLASSIFIED UNDER NATIONAL SECURITY ACT §69.420. SORRY. NOT SORRY.',
    'FINDINGS: PILOT ERROR. PILOT: NOT AVAILABLE FOR COMMENT. COINCIDENCE: CONFIRMED.',
  ]), 'var(--cyan)');
  activeCrash = null;
}

function coverupCrash() {
  clearTimeout(crashAutoTimer);
  document.getElementById('crash-modal').classList.remove('show');
  if(!activeCrash) return;
  playUiSound('crash-coverup');
  toast(pick([
    'COVERUP INITIATED. ALL RECORDS EXPUNGED. YOU SAW NOTHING. NOTHING SAW YOU.',
    `CLASSIFIED. ${activeCrash.name}'S PLANE? NEVER EXISTED. MANIFEST: SHREDDED. JOURNALISTS: AUDITED.`,
    'OMNIBUS BILL ATTACHED. FLIGHT RECORDS: DELETED. COST TO TAXPAYER: $4.7B. APPROVED UNANIMOUSLY.',
    'COVERUP COMPLETE. JOURNALIST ASKING QUESTIONS: AUDITED. REDDIT THREAD: REMOVED. SLEEP WELL.',
    `OPERATION ${activeCrash.id.toUpperCase()}_ERASURE: INITIATED. ETA: IMMEDIATE. COST: YOUR PROBLEM.`,
  ]), 'var(--red)');
  threatCount += randi(8, 20);
  document.getElementById('threat-count').textContent = threatCount;
  activeCrash = null;
}

function pickNextDestination(origin) {
  return pick(Object.keys(CITIES).filter(city => city !== origin));
}

function normalizeVec(v) {
  const mag = Math.hypot(v.lon, v.lat) || 1;
  return { lon: v.lon / mag, lat: v.lat / mag };
}

function makeTurnControl(start, end, heading) {
  const direct = normalizeVec({ lon: end.lon - start.lon, lat: end.lat - start.lat });
  const current = normalizeVec(heading);
  const blended = normalizeVec({
    lon: current.lon * 0.85 + direct.lon * 1.25,
    lat: current.lat * 0.85 + direct.lat * 1.25,
  });
  const perp = { lon: -direct.lat, lat: direct.lon };
  const cross = current.lon * direct.lat - current.lat * direct.lon;
  const side = cross === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(cross);
  const distance = Math.hypot(end.lon - start.lon, end.lat - start.lat);
  const forward = Math.min(42, distance * 0.38);
  const bend = Math.min(26, distance * 0.16);
  return {
    lon: start.lon + blended.lon * forward + perp.lon * side * bend,
    lat: start.lat + blended.lat * forward + perp.lat * side * bend,
  };
}

function reroutePlane(planeId) {
  const plane = PLANES.find(p => p.id === planeId);
  if(!plane || crashedPlanes.has(plane.id)) return;
  const current = getPlanePointLonLat(plane);
  const route = getPlaneRoute(plane);
  const destination = pickNextDestination(route[1]);
  const end = CITIES[destination];
  // Reroutes originate from the asset's live 2D position and preserve heading via a curved turn.
  plane.path = {
    start: current,
    control: makeTurnControl(current, end, getPlaneHeadingVector(plane)),
    end,
    originLabel: 'CURRENT VECTOR',
  };
  plane.routes[plane.routeIdx] = [route[0], destination];
  plane.t = 0;
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

function drawCrosshair(x, y, color) {
  FX.save();
  FX.strokeStyle = color;
  FX.lineWidth = 1.8;
  FX.shadowColor = color;
  FX.shadowBlur = 12;
  FX.beginPath();
  FX.arc(x, y, 18, 0, Math.PI * 2);
  FX.moveTo(x - 30, y);
  FX.lineTo(x - 10, y);
  FX.moveTo(x + 10, y);
  FX.lineTo(x + 30, y);
  FX.moveTo(x, y - 30);
  FX.lineTo(x, y - 10);
  FX.moveTo(x, y + 10);
  FX.lineTo(x, y + 30);
  FX.stroke();
  FX.restore();
}

function drawFlightMap() {
  const panel = document.getElementById('panel-flight');
  const title = panel.querySelector('.panel-title');
  const W = FC.width = panel.clientWidth;
  // Flight details are an overlay; they should not steal height from the map canvas.
  const H = FC.height = Math.max(250, panel.clientHeight - title.clientHeight);
  FX.clearRect(0, 0, W, H);

  FX.fillStyle = '#020408';
  FX.fillRect(0, 0, W, H);
  if(flightMapImage.complete) {
    FX.save();
    FX.globalAlpha = 0.82;
    FX.drawImage(flightMapImage, 0, 0, W, H);
    FX.restore();
  }

  FX.strokeStyle = 'rgba(0,220,255,0.12)';
  FX.lineWidth = 0.5;
  for(let lat = -90; lat <= 90; lat += 30) {
    const y = proj(0, lat, W, H).y;
    FX.beginPath();
    FX.moveTo(0, y);
    FX.lineTo(W, y);
    FX.stroke();
  }
  for(let lon = -180; lon <= 180; lon += 30) {
    const x = proj(lon, 0, W, H).x;
    FX.beginPath();
    FX.moveTo(x, 0);
    FX.lineTo(x, H);
    FX.stroke();
  }

  FX.strokeStyle = 'rgba(0,255,65,0.18)';
  FX.lineWidth = 0.5;
  FX.setLineDash([4, 4]);
  const ey = proj(0, 0, W, H).y;
  FX.beginPath();
  FX.moveTo(0, ey);
  FX.lineTo(W, ey);
  FX.stroke();
  FX.setLineDash([]);

  FX.font = '8px Share Tech Mono,monospace';
  const activeCities = new Set(PLANES.filter(p => !crashedPlanes.has(p.id)).flatMap(p => getPlaneRoute(p)));
  Object.entries(CITIES).forEach(([name, city]) => {
    const p = proj(city.lon, city.lat, W, H);
    const active = activeCities.has(name);
    FX.fillStyle = active ? '#00ff41' : '#1a3a1a';
    FX.shadowColor = active ? '#00ff41' : 'transparent';
    FX.shadowBlur = active ? 6 : 0;
    FX.beginPath();
    FX.arc(p.x, p.y, active ? 3 : 2, 0, Math.PI * 2);
    FX.fill();
    FX.shadowBlur = 0;
    FX.fillStyle = active ? '#006a20' : '#0a1a0a';
    FX.textAlign = 'left';
    FX.fillText(name, p.x + 5, p.y + 3);
  });

  PLANES.forEach(plane => {
    if(crashedPlanes.has(plane.id)) return;
    const isSelected = selectedPlaneId === plane.id;
    const start = getPlaneStartPoint(plane);
    const end = getPlaneEndPoint(plane);
    const pos = planePos(plane, W, H);
    const startP = proj(start.lon, start.lat, W, H);
    const endP = proj(end.lon, end.lat, W, H);

    FX.strokeStyle = plane.color + '40';
    FX.lineWidth = 1.15;
    FX.setLineDash([4, 4]);
    FX.beginPath();
    if(plane.path) {
      const controlP = proj(plane.path.control.lon, plane.path.control.lat, W, H);
      FX.moveTo(startP.x, startP.y);
      FX.quadraticCurveTo(controlP.x, controlP.y, endP.x, endP.y);
    } else {
      FX.moveTo(startP.x, startP.y);
      FX.lineTo(endP.x, endP.y);
    }
    FX.stroke();
    FX.setLineDash([]);

    FX.strokeStyle = plane.color + 'bb';
    FX.lineWidth = isSelected ? 3.2 : 1.9;
    FX.beginPath();
    if(plane.path) {
      const partial = sampleCurve(plane.path, 24).slice(0, Math.max(2, Math.round(plane.t * 24) + 1));
      partial.forEach((pt, idx) => {
        const screen = proj(pt.lon, pt.lat, W, H);
        idx === 0 ? FX.moveTo(screen.x, screen.y) : FX.lineTo(screen.x, screen.y);
      });
    } else {
      FX.moveTo(startP.x, startP.y);
      FX.lineTo(pos.x, pos.y);
    }
    FX.stroke();
  });

  PLANES.forEach(plane => {
    if(crashedPlanes.has(plane.id)) return;
    const isSelected = selectedPlaneId === plane.id;
    const pos = planePos(plane, W, H);
    const hdg = planeHdg(plane);
    if(isSelected) drawCrosshair(pos.x, pos.y, plane.color);
    FX.save();
    FX.translate(pos.x, pos.y);
    FX.rotate(hdg);
    FX.fillStyle = plane.color;
    FX.shadowColor = plane.color;
    FX.shadowBlur = 18;
    FX.beginPath();
    FX.moveTo(15, 0);
    FX.lineTo(-7, -6);
    FX.lineTo(-2, 0);
    FX.lineTo(-7, 6);
    FX.closePath();
    FX.fill();
    FX.strokeStyle = 'rgba(255,255,255,0.45)';
    FX.lineWidth = 1;
    FX.stroke();
    FX.restore();
    drawFlightLabel(plane.name, pos.x, pos.y - 22, plane.color, isSelected ? 'bold 15px Share Tech Mono,monospace' : 'bold 13px Share Tech Mono,monospace');
    drawFlightLabel(plane.callsign, pos.x, pos.y - 9, '#f4f4f4', isSelected ? 'bold 11px Share Tech Mono,monospace' : 'bold 10px Share Tech Mono,monospace');
  });

  GROUND_UNITS.forEach(unit => {
    const pos = getUnitPos(unit, W, H);
    if(!pos) return;
    const isSelected = selectedPlaneId === unit.id;
    const t2 = (Date.now() % 1200) / 1200;
    const pulse = 0.7 + 0.3 * Math.sin(t2 * Math.PI * 2);
    if(isSelected) drawCrosshair(pos.x, pos.y, unit.color);
    FX.strokeStyle = isSelected ? unit.color : 'rgba(255,215,0,0.55)';
    FX.lineWidth = isSelected ? 3 : 2;
    FX.beginPath();
    FX.arc(pos.x, pos.y, (isSelected ? 16 : 12) + 5 * pulse, 0, Math.PI * 2);
    FX.stroke();
    FX.fillStyle = unit.color;
    FX.shadowColor = unit.color;
    FX.shadowBlur = 18 * pulse;
    FX.save();
    FX.translate(pos.x, pos.y);
    FX.rotate(Math.PI / 4);
    FX.fillRect(-7 * pulse, -7 * pulse, 14 * pulse, 14 * pulse);
    FX.restore();
    FX.shadowBlur = 0;
    drawFlightLabel(unit.name, pos.x, pos.y - 20, unit.color, isSelected ? 'bold 13px Share Tech Mono,monospace' : 'bold 11px Share Tech Mono,monospace');
    drawFlightLabel(`[${unit.callsign}]`, pos.x, pos.y - 8, '#fff0a8', 'bold 9px Share Tech Mono,monospace');
  });
}

function buildPlaneInfo(plane) {
  const route = getPlaneRoute(plane);
  const status = pick(plane.statuses);
  const note = manualFlightNotes[plane.id];
  const alt = plane.baseAlt + randi(-400, 400);
  const spd = plane.baseSpd + randi(-20, 20);
  const eta = Math.floor((1 - plane.t) * randi(40, 260));
  const pct = Math.round(plane.t * 100);
  const co2 = plane.co2Base + randi(-100, 200);
  return `
    <div class="pi-call" onclick="selectPlane('${plane.id}')">${plane.callsign}</div>
    <div class="pi-name" style="color:${plane.color}">${plane.name}</div>
    <div class="pi-route">${getDisplayOrigin(plane)} → ${route[1]}</div>
    <div class="pi-status">${note || status}</div>
    <div class="pi-stats">ALT:${alt.toLocaleString()}ft · SPD:${spd}kts · ETA:${eta}min</div>
    <div class="pi-stats" style="color:#ff6600">CO₂:${co2}kg/hr · TURN:${plane.path ? 'ARCING' : 'STRAIGHT'}</div>
    <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${pct}%;background:${plane.color}"></div></div>
    <div class="pi-btns"><button class="pi-btn" onclick="reroutePlane('${plane.id}')">REROUTE</button></div>
  `;
}

function buildCrashInfo(plane) {
  return `
    <div class="pi-call" onclick="selectPlane('${plane.id}')">${plane.callsign}</div>
    <div class="pi-name" style="color:var(--red)">⚠ ${plane.name}</div>
    <div class="pi-route" style="color:var(--red)">SIGNAL LOST</div>
    <div class="pi-status" style="color:var(--red)">INCIDENT UNDER INVESTIGATION</div>
    <div class="pi-stats" style="color:#550000">STATUS: CLASSIFIED · ETA: UNKNOWN</div>
    <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${Math.round(plane.t * 100)}%;background:var(--red)"></div></div>
  `;
}

function buildUnitInfo(unit) {
  const status = pick(unit.statuses);
  const lp = randi(-400, -10);
  const extra = unit.id === 'mohan'
    ? `CHAMP: EKKO · RANK: IRON IV · LP: ${lp}`
    : 'STATUS: BURIED DEEP · ACCESS: DENIED';
  return `
    <div class="pi-call" onclick="selectPlane('${unit.id}')">[CONTACT · ${unit.locLabel}]</div>
    <div class="pi-name" style="color:${unit.color}">${unit.name}</div>
    <div class="pi-route">📍 ${unit.locLabel}</div>
    <div class="pi-status">${status}</div>
    <div class="pi-stats" style="color:#886633">${extra}</div>
    <div class="pi-prog-wrap"><div class="pi-prog-fill" style="width:${Math.max(20, 100 + lp / 4)}%;background:${unit.color}"></div></div>
  `;
}

function updateFlightInfo() {
  const info = document.getElementById('flight-info');
  // Nothing selected means there is no detail card to refresh.
  if(!selectedPlaneId) {
    info.classList.remove('has-selection');
    return;
  }
  let hasSelection = false;

  PLANES.forEach(plane => {
    const el = document.getElementById('plane-info-' + plane.id);
    if(!el) return;
    const isSelected = selectedPlaneId === plane.id;
    if(!isSelected) {
      el.innerHTML = '';
      el.classList.remove('selected');
      return;
    }
    hasSelection = true;
    el.innerHTML = crashedPlanes.has(plane.id) ? buildCrashInfo(plane) : buildPlaneInfo(plane);
    el.classList.add('selected');
  });

  GROUND_UNITS.forEach(unit => {
    const el = document.getElementById('plane-info-' + unit.id);
    if(!el) return;
    const isSelected = selectedPlaneId === unit.id;
    if(!isSelected) {
      el.innerHTML = '';
      el.classList.remove('selected');
      return;
    }
    hasSelection = true;
    el.innerHTML = buildUnitInfo(unit);
    el.classList.add('selected');
  });

  info.classList.toggle('has-selection', hasSelection);
}

function selectPlane(planeId) {
  selectedPlaneId = selectedPlaneId === planeId ? null : planeId;
  updateFlightInfo();
  drawFlightMap();
}

function flightTick() {
  PLANES.forEach(plane => {
    if(crashedPlanes.has(plane.id)) return;
    plane.t += 0.00016 + Math.random() * 0.00006;
    if(Math.random() < 1 / 36000 && !activeCrash) {
      triggerCrash(plane);
      return;
    }
    if(plane.t >= 1) {
      const completedDestination = getPlaneRoute(plane)[1];
      plane.t = 0;
      plane.path = null;
      delete manualFlightNotes[plane.id];
      plane.routeIdx = (plane.routeIdx + 1) % plane.routes.length;
      plane.routes[plane.routeIdx] = [completedDestination, pickNextDestination(completedDestination)];
    }
  });
  drawFlightMap();
  requestAnimationFrame(flightTick);
}

FC.addEventListener('click', e => {
  const rect = FC.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const W = FC.width;
  const H = FC.height;
  let hit = null;
  let minD = 30;

  PLANES.forEach(plane => {
    if(crashedPlanes.has(plane.id)) return;
    const pos = planePos(plane, W, H);
    const d = Math.hypot(mx - pos.x, my - pos.y);
    if(d < minD) {
      minD = d;
      hit = plane.id;
    }
  });

  GROUND_UNITS.forEach(unit => {
    const pos = getUnitPos(unit, W, H);
    if(!pos) return;
    const d = Math.hypot(mx - pos.x, my - pos.y);
    if(d < minD) {
      minD = d;
      hit = unit.id;
    }
  });

  // Keep the current selection if the user clicks empty map space.
  if(!hit) return;
  selectedPlaneId = hit;
  updateFlightInfo();
  drawFlightMap();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') {
    document.getElementById('crash-modal').classList.remove('show');
    activeCrash = null;
    selectedPlaneId = null;
    updateFlightInfo();
    drawFlightMap();
  }
});

updateFlightSummary();
drawFlightMap();
flightTick();
setInterval(updateFlightInfo, 2000);
updateFlightInfo();
