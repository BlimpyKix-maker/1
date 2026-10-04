// ---------------- Decisions, up top ----------------
// Anything waiting on you sits in one box at the top of the screen, whatever page you're on: the situation, then
// the choices side by side with their odds. One at a time, with a pager when several are waiting; it can be folded
// away to a single line and opened again.
function decisionBoxHTML() {
  if (UI.building || !S.me || typeof careerActive !== 'function' || !careerActive()) return '';
  const L = pending(); if (!L.length) return '';
  const i = clamp(UI.decI || 0, 0, L.length - 1), it = L[i];
  if (UI.decMin) return `<div class="decbox min"><button class="dec-open" data-decmin="0">❗ ${L.length} decision${L.length > 1 ? 's' : ''} waiting: <b>${esc(it.title)}</b> <span>Open ▾</span></button></div>`;
  return `<section class="decbox" aria-live="polite"><div class="dec-top"><span class="dec-k">❗ ${L.length > 1 ? `Decision ${i + 1} of ${L.length}` : 'Your decision'}</span><span class="dec-nav">${L.length > 1 ? `<button class="linkish" data-decnav="-1" ${i === 0 ? 'disabled' : ''}>‹ Previous</button><button class="linkish" data-decnav="1" ${i === L.length - 1 ? 'disabled' : ''}>Next ›</button>` : ''}<button class="linkish" data-decmin="1" title="Fold this away">Hide ▴</button></span></div><div class="dec-body">${inboxCard(it)}</div></section>`;
}
function decideClick(t) {
  if (!S.me) return false;
  if (t.dataset.decmin !== undefined) { UI.decMin = t.dataset.decmin === '1'; render(true); return true; }
  if (t.dataset.decnav) { UI.decI = clamp((UI.decI || 0) + +t.dataset.decnav, 0, Math.max(0, pending().length - 1)); render(true); return true; }
  if (t.dataset.pick) UI.decMin = false;
  return false;
}
