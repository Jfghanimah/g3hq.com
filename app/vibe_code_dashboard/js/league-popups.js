// ══════════════════════════════════════════════
// LEAGUE POPUPS
// ══════════════════════════════════════════════
const leagueFFPopup = document.getElementById('league-ff-popup');
const leagueBaronPopup = document.getElementById('league-baron-popup');
const leagueFFVotes = Array.from(document.querySelectorAll('.league-ff-vote'));

const FF_SCENARIOS = [
  {
    status:'15:02 · TEAM MENTAL: COLLAPSING',
    body:'Your top laner is 0/7, your jungler is typing essays, and DrDoughnut is AFK near krugs.',
  },
  {
    status:'16:44 · MORK: DREADLESS',
    body:'Your support just typed "open mid" after losing a cannon. Riot would call this a close game.',
  },
  {
    status:'18:10 · GOAT GAMERS GAMING',
    body:'The scoreboard says comeback angle. Your chat log says otherwise.',
  },
];

const BARON_SCENARIOS = [
  {
    status:'SHOTCALLER: UNQUALIFIED',
    body:'Your duo wants to flip Baron with no vision, no smite, and full confidence.',
  },
  {
    status:'WADDUP DOE MACRO',
    body:'Four enemies are missing and someone still pinged Baron 11 times. Confidence remains unjustified.',
  },
  {
    status:'RIFT PLAN: QUESTIONABLE',
    body:'The call is "trust me bro" and Mohan is still inting on the rift from Chicago.',
  },
];

let activeLeaguePopup = null;
let leagueAutoTimer = null;

function renderFFVotes(yesVotes = 4) {
  leagueFFVotes.forEach((box, idx) => {
    box.classList.toggle('filled', idx < yesVotes);
  });
}

function showLeaguePopup(type) {
  if(activeLeaguePopup) return;
  const popup = type === 'ff' ? leagueFFPopup : leagueBaronPopup;
  const scenario = pick(type === 'ff' ? FF_SCENARIOS : BARON_SCENARIOS);
  document.getElementById(type === 'ff' ? 'league-ff-status' : 'league-baron-status').textContent = scenario.status;
  document.getElementById(type === 'ff' ? 'league-ff-body' : 'league-baron-body').textContent = scenario.body;
  if(type === 'ff') renderFFVotes(4);
  popup.classList.add('show');
  activeLeaguePopup = type;
  playUiSound('league-alert');
  clearTimeout(leagueAutoTimer);
  leagueAutoTimer = setTimeout(() => hideLeaguePopup(type), 15000);
  if(type === 'baron') {
    playAudioClip('audio_clips/LolQueuePop.mp3', {
      volume: 0.32,
      startTime: 2,
      maxDuration: 5,
      fadeOutDuration: 5,
      duckMusic: 0.65,
    });
  }
}

function hideLeaguePopup(type) {
  clearTimeout(leagueAutoTimer);
  const popup = type === 'ff' ? leagueFFPopup : leagueBaronPopup;
  popup.classList.remove('show');
  if(activeLeaguePopup === type) activeLeaguePopup = null;
}

function acceptLeagueFF() {
  playUiSound('league-confirm');
  toast('FF VOTE LOCKED: 4 YES, 1 DELUSIONAL NO', 'var(--amber)');
  hideLeaguePopup('ff');
}

function denyLeagueFF() {
  playUiSound('deny');
  toast('FF VOTE DENIED: WE SCALE (YOU DO NOT)', 'var(--red)');
  hideLeaguePopup('ff');
}

function acceptLeagueBaron() {
  playUiSound('league-confirm');
  toast('BARON CALL ACCEPTED: 50/50 FLIP INITIATED', 'var(--purple)');
  hideLeaguePopup('baron');
}

function denyLeagueBaron() {
  playUiSound('deny');
  toast('BARON CALL REJECTED: ACTUAL VISION USED', 'var(--cyan)');
  hideLeaguePopup('baron');
}

document.addEventListener('keydown', e => {
  if(e.key !== 'Escape' || !activeLeaguePopup) return;
  hideLeaguePopup(activeLeaguePopup);
});

function scheduleLeaguePopups() {
  setTimeout(() => {
    if(!activeLeaguePopup) showLeaguePopup('ff');
    scheduleLeaguePopups();
  }, randi(84000, 156000));

  setTimeout(() => {
    if(!activeLeaguePopup) showLeaguePopup('baron');
  }, randi(36000, 72000));
}

setTimeout(() => {
  showLeaguePopup(pick(['ff', 'baron']));
  scheduleLeaguePopups();
}, 66000);
