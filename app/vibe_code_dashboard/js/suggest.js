// ══ SUGGESTION BOX ══
function openSuggestModal() {
  const modal = document.getElementById('suggest-modal');
  const input = document.getElementById('suggest-input');
  modal.style.display = 'flex';
  input.value = '';
  document.getElementById('suggest-counter').textContent = '0 / 500';
  input.focus();
}

function closeSuggestModal() {
  document.getElementById('suggest-modal').style.display = 'none';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSuggestModal();
});

document.getElementById('suggest-input').addEventListener('input', function() {
  document.getElementById('suggest-counter').textContent = this.value.length + ' / 500';
});

function submitSuggestion() {
  const input = document.getElementById('suggest-input');
  const text = input.value.trim();
  if (!text) {
    toast('⚠ SUGGESTION CANNOT BE EMPTY', 'var(--red)');
    return;
  }

  fetch('/dashboard-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestion: text }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        closeSuggestModal();
        toast('✓ SUGGESTION TRANSMITTED · LOGGED TO REQUESTS.TXT', 'var(--green)');
      } else {
        toast('✗ TRANSMISSION FAILED: ' + (data.error || 'unknown'), 'var(--red)');
      }
    })
    .catch(() => toast('✗ NETWORK ERROR · SUGGESTION LOST IN THE VOID', 'var(--red)'));
}
