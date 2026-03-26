// ══════════════════════════════════════════════
// UAP DRONE CAM / LIVE VIDEO FEED
// ══════════════════════════════════════════════
const ufoStatus = document.getElementById('ufo-status');
const ufoRetargetBtn = document.getElementById('ufo-retarget');
const ufoJamBtn = document.getElementById('ufo-jam');

const UAP_TARGETS = ['ORB-7', 'DISC-12', 'TIC_TAC-3', 'PYRAMID-9', 'JELLYFISH-4'];
const UAP_LOCATIONS = ['SECTOR 7B', 'LOW EARTH LARP', 'CHICAGO SKYBOX', 'ATLANTIC GRID', 'MOON VIBES'];

let ufoTarget = pick(UAP_TARGETS);
let ufoLoc = pick(UAP_LOCATIONS);

function retargetUfo() {
  ufoTarget = pick(UAP_TARGETS);
  ufoLoc = pick(UAP_LOCATIONS);
  ufoStatus.textContent = `TRACKING: ${ufoTarget} · ${ufoLoc}`;
}

function jamFeed() {
  ufoStatus.textContent = 'FEED JAMMED · SIGNAL LOSS';
  setTimeout(() => {
    retargetUfo();
  }, 3000);
}

ufoRetargetBtn.addEventListener('click', retargetUfo);
ufoJamBtn.addEventListener('click', jamFeed);

// Random retarget every ~9 seconds
setInterval(() => {
  if(Math.random() < 0.35) retargetUfo();
}, 9000);

retargetUfo();
