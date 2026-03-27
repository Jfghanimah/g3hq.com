// ══════════════════════════════════════════════
// HEADER COMMAND CONSOLE
// ══════════════════════════════════════════════

(function() {
  const input = document.getElementById('cmd-console-input');
  const suggestionsEl = document.getElementById('cmd-console-suggestions');
  const statusEl = document.getElementById('cmd-console-status');
  if(!input || !suggestionsEl || !statusEl) return;
  let selectedSuggestionIndex = 0;
  const history = [];
  let historyIndex = -1;

  const setStatus = (text, color = '#7bd88f') => {
    statusEl.textContent = text;
    statusEl.style.color = color;
  };

  const commandSpecs = [
    { key:'help', run:() => {
      setStatus('CMDS :: ' + commandSpecs.map(cmd => cmd.key).join(' · '), 'var(--cyan)');
      toast('CONSOLE READY :: TAB TO AUTOFILL :: ENTER TO EXECUTE', 'var(--cyan)', true);
    }},
    { key:'funding', run:() => typeof showFundingModal === 'function' && showFundingModal() },
    { key:'league ff', run:() => typeof showLeaguePopup === 'function' && showLeaguePopup('ff') },
    { key:'league baron', run:() => typeof showLeaguePopup === 'function' && showLeaguePopup('baron') },
    { key:'crash random', run:() => {
      const candidates = typeof PLANES !== 'undefined' ? PLANES.filter(plane => !crashedPlanes.has(plane.id)) : [];
      if(!candidates.length) return setStatus('CRASH BLOCKED :: NO ACTIVE AIRCRAFT', 'var(--red)');
      triggerCrash(pick(candidates));
    }},
    { key:'crash bigyahu', run:() => triggerPlaneCrash('bigyahu') },
    { key:'crash dadatrump', run:() => triggerPlaneCrash('dadatrump') },
    { key:'crash taylorswift', run:() => triggerPlaneCrash('taylorswift') },
    { key:'crash pthiel', run:() => triggerPlaneCrash('pthiel') },
    { key:'radar defcon', run:() => typeof triggerDefconFlash === 'function' && triggerDefconFlash() },
    { key:'radar pizza', run:() => typeof triggerPizzaMode === 'function' && triggerPizzaMode() },
    { key:'reddit post', run:() => typeof postPropaganda === 'function' && postPropaganda() },
    { key:'slop reddit', run:() => typeof switchSlop === 'function' && switchSlop('reddit') },
    { key:'slop 4chan', run:() => typeof switchSlop === 'function' && switchSlop('4chan') },
    { key:'slop dm', run:() => typeof switchSlop === 'function' && switchSlop('dm') },
    { key:'gamble bj', run:() => typeof switchGamble === 'function' && switchGamble('bj') },
    { key:'gamble slots', run:() => typeof switchGamble === 'function' && switchGamble('slots') },
    { key:'gamble trade', run:() => typeof switchGamble === 'function' && switchGamble('trade') },
    { key:'toast audit', run:() => toast('IRS AUDIT DRILL :: RECEIPTS NOW CLASSIFIED', 'var(--red)') },
    { key:'toast bait', run:() => toast('CLICK SOMETHING IRRESPONSIBLE :: SYSTEM RECOMMENDATION', 'var(--amber)') },
    { key:'suggest', run:() => typeof openSuggestModal === 'function' && openSuggestModal() },
    { key:'grass', run:() => {
      toast('ERROR :: EXTERNAL WORLD MODULE NOT INSTALLED', 'var(--green)', true);
      setStatus('GRASS TOUCH ATTEMPT FAILED', 'var(--amber)');
    }},
    { key:'sudo rm taxes', run:() => {
      toast('PERMISSION DENIED :: IRS THREAD LEVEL INCREASED', 'var(--red)');
      if(typeof spikeIRS === 'function') spikeIRS(12);
    }},
    { key:'mohan', run:() => {
      toast('MOHAN LOCATED :: STILL INTING IN CHICAGO', '#ffd700');
      if(typeof selectPlane === 'function') selectPlane('mohan');
    }},
  ];

  function triggerPlaneCrash(planeId) {
    if(typeof PLANES === 'undefined') return;
    const plane = PLANES.find(entry => entry.id === planeId);
    if(!plane) return setStatus(`UNKNOWN AIRFRAME :: ${planeId}`, 'var(--red)');
    if(typeof triggerCrash === 'function') triggerCrash(plane);
  }

  function getMatches(value) {
    const query = value.trim().toLowerCase();
    if(!query) return commandSpecs.slice(0, 8);
    const prefixMatches = commandSpecs.filter(cmd => cmd.key.startsWith(query));
    const containsMatches = commandSpecs.filter(cmd => !cmd.key.startsWith(query) && cmd.key.includes(query));
    return [...prefixMatches, ...containsMatches];
  }

  function renderSuggestions(matches, activeIndex = 0) {
    suggestionsEl.innerHTML = '';
    matches.slice(0, 8).forEach((match, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'cmd-suggestion' + (idx === activeIndex ? ' active' : '');
      chip.textContent = match.key;
      chip.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = match.key;
        executeCommand(match.key);
        input.focus();
        input.select();
      });
      suggestionsEl.appendChild(chip);
    });
  }

  function executeCommand(rawValue) {
    const query = rawValue.trim().toLowerCase();
    if(!query) return;
    const exact = commandSpecs.find(cmd => cmd.key === query);
    const matches = getMatches(query);
    const target = exact || (matches.length === 1 ? matches[0] : null);
    if(!target) {
      setStatus(`UNKNOWN :: ${query} :: TRY HELP`, 'var(--red)');
      toast(`UNKNOWN COMMAND :: ${query}`, 'var(--red)', true);
      return;
    }
    input.value = target.key;
    target.run();
    if(history[history.length - 1] !== target.key) history.push(target.key);
    if(history.length > 24) history.shift();
    historyIndex = history.length;
    setStatus(`EXECUTED :: ${target.key}`, 'var(--green)');
    renderSuggestions(getMatches(''));
  }

  function syncSuggestions(activeIndex = 0) {
    const matches = getMatches(input.value);
    selectedSuggestionIndex = Math.max(0, Math.min(activeIndex, Math.max(0, matches.length - 1)));
    renderSuggestions(matches, selectedSuggestionIndex);
    if(matches.length) {
      const active = matches[selectedSuggestionIndex] || matches[0];
      setStatus(`MATCHES :: ${active.key}${matches.length > 1 ? ` +${matches.length - 1}` : ''}`, '#7bd88f');
    } else if(input.value.trim()) {
      setStatus(`NO MATCHES :: ${input.value.trim()}`, 'var(--red)');
    } else {
      setStatus('READY :: TAB AUTOFILL ENABLED', '#7bd88f');
    }
    return matches;
  }

  input.addEventListener('focus', () => syncSuggestions(selectedSuggestionIndex));
  input.addEventListener('input', () => {
    historyIndex = history.length;
    syncSuggestions(0);
  });
  input.addEventListener('keydown', e => {
    const matches = getMatches(input.value);
    if(e.key === 'Tab') {
      e.preventDefault();
      if(!matches.length) return;
      input.value = matches[selectedSuggestionIndex].key;
      renderSuggestions(matches, selectedSuggestionIndex);
      setStatus(`AUTOFILL :: ${matches[selectedSuggestionIndex].key}`, 'var(--cyan)');
      return;
    }
    if(e.key === 'ArrowDown') {
      e.preventDefault();
      if(matches.length) return syncSuggestions((selectedSuggestionIndex + 1) % matches.length);
      if(history.length) {
        historyIndex = Math.min(history.length - 1, historyIndex + 1);
        input.value = history[historyIndex] || '';
        syncSuggestions(0);
      }
      return;
    }
    if(e.key === 'ArrowUp') {
      e.preventDefault();
      if(matches.length && input.value.trim()) {
        return syncSuggestions((selectedSuggestionIndex - 1 + matches.length) % matches.length);
      }
      if(history.length) {
        historyIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
        input.value = history[historyIndex] || history[0];
        syncSuggestions(0);
      }
      return;
    }
    if(e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input.value);
      input.select();
      return;
    }
    if(e.key === 'Escape') {
      input.value = '';
      historyIndex = history.length;
      renderSuggestions(getMatches(''));
      setStatus('READY :: TAB AUTOFILL ENABLED', '#7bd88f');
    }
  });

  renderSuggestions(getMatches(''));
})();
