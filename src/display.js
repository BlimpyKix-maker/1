// ================= Full screen by default (Round 25) =================
// The game is best played full screen, so that's where it starts: the first click or key press asks the browser for
// full screen (browsers only allow it after a gesture). Esc or the corner button go
// windowed; the choice is remembered on this device.
const DISPLAY_KEY = 'ab-display';
function displayPref() { try { return localStorage.getItem(DISPLAY_KEY) === 'window' ? 'window' : 'full'; } catch (e) { return 'full'; } }
function displaySet(v) { try { localStorage.setItem(DISPLAY_KEY, v); } catch (e) { /* no storage: this visit only */ } }
function fsEl() { return typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement); }
function fsCan() { return typeof document !== 'undefined' && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); }
let FS_OURS = false;
function fsEnter() { if (!fsCan() || fsEl()) return; const d = document.documentElement, f = d.requestFullscreen || d.webkitRequestFullscreen; try { const p = f.call(d, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch (e) { /* refused */ } }
function fsExit() { if (!fsEl()) return; FS_OURS = true; const f = document.exitFullscreen || document.webkitExitFullscreen; try { const p = f.call(document); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ } }
function displayGo(v) { displaySet(v);  if (v === 'full') fsEnter(); else fsExit(); displayBtn(); if (typeof render === 'function') render(true); }
function displayBtn() {
  if (typeof document === 'undefined' || !document.body) return;
  let b = document.getElementById('ab-fs');
  if (!b) { b = document.createElement('button'); b.id = 'ab-fs'; b.type = 'button'; b.addEventListener('click', e => { e.stopPropagation(); displayGo(fsEl() || (displayPref() === 'full' && !fsCan()) ? 'window' : 'full'); }); document.body.appendChild(b); }
  const full = !!fsEl() || (displayPref() === 'full' && !fsCan());
  b.textContent = full ? '⤡ Windowed' : '⤢ Full screen'; b.title = full ? 'Play in a window' : 'Play full screen (recommended)';
}
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  const first = () => { document.removeEventListener('pointerdown', first, true); document.removeEventListener('keydown', first, true); if (displayPref() === 'full') fsEnter(); };
  document.addEventListener('pointerdown', first, true); document.addEventListener('keydown', first, true);
  const onChange = () => { if (!fsEl() && !FS_OURS && displayPref() === 'full') { displaySet('window'); if (typeof render === 'function') render(true); } FS_OURS = false; displayBtn(); };
  document.addEventListener('fullscreenchange', onChange); document.addEventListener('webkitfullscreenchange', onChange);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', displayBtn); else setTimeout(displayBtn, 0);
  try { const st = document.createElement('style'); st.textContent = `#ab-fs{position:fixed;right:10px;bottom:10px;z-index:9000;font:600 11px/1 var(--f-body,system-ui);letter-spacing:.04em;padding:7px 10px;border-radius:8px;border:1px solid var(--line,#ccc);background:color-mix(in srgb,var(--panel,#fff) 88%,transparent);color:var(--muted,#555);cursor:pointer;opacity:.55;transition:opacity .2s}#ab-fs:hover{opacity:1;color:var(--ink,#111)}@media print{#ab-fs{display:none}}`; (document.head || document.documentElement).appendChild(st); } catch (e) { /* no DOM */ }
}
