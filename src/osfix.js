// ================= SlateOS: a window that scrolls like an app (Round 27) =================
// SlateOS used to grow with its content inside a page that also scrolled, with a sticky sidebar in between: the two
// scrollers fought, the sidebar snapped back to the top on every click (each render rebuilds it), and long apps stuck
// at points. Now the window has a fixed height that fills the screen; the sidebar and the app each scroll on their
// own (and don't hand the scroll to the page when they reach the end); both keep their position across renders,
// and the app's starts at the top only when you switch apps. The sidebar is easier to read: clearer group headings,
// the current app marked, a fade that says there's more below, and the current app kept in view.
// Also: "How this works" scrolls the help into view when you open it (desk guide and each app's own primer), and a
// disabled button no longer shows the "loading" cursor (a pet's weekly check-up looked stuck because of it).

const OSF = { side: 0, body: 0, app: null, win: 0 };
function osfCapture() {
  if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
  const sd = document.querySelector('.os-side'), bd = document.querySelector('.os-body');
  if (bd) OSF.body = bd.scrollTop;   // the sidebar's position is kept as you scroll it (below)
  OSF.app = typeof UI !== 'undefined' ? UI.app : null;
}
function osfRestore(appBefore) {
  if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
  const sd = document.querySelector('.os-side'), bd = document.querySelector('.os-body');
  if (sd) {
    OSF.restoring = 1; sd.scrollTop = OSF.side; setTimeout(() => { OSF.restoring = 0; }, 0);
    const on = sd.querySelector('.os-i.on');
    if (on) { const r = on.getBoundingClientRect(), b = sd.getBoundingClientRect(); if (r.bottom < b.top || r.top > b.bottom) sd.scrollTop += r.top - b.top - sd.clientHeight / 3; }
  }
  if (bd) bd.scrollTop = UI.app === appBefore ? OSF.body : 0;
}
{ const _rd = render; render = function () {
  osfCapture(); const app0 = OSF.app;
  const r = _rd.apply(this, arguments);
  try { osfRestore(app0); } catch (e) { /* no DOM */ }
  return r; }; }

// the sidebar's scroll position, as the player leaves it
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') document.addEventListener('scroll', e => { const t = e.target; if (t && t.classList && t.classList.contains('os-side') && !OSF.restoring) OSF.side = t.scrollTop; }, true);
// help that opens should be seen
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') document.addEventListener('click', e => {
  const t = e.target && e.target.closest ? e.target.closest('[data-guide],[data-primer]') : null; if (!t) return;
  setTimeout(() => {
    if (t.hasAttribute('data-guide')) { const g = document.querySelector('.panel.guide'); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else { const bd = document.querySelector('.os-body'), p = document.querySelector('.os-body .pr'); if (bd && p) bd.scrollTo({ top: Math.max(0, p.offsetTop - 12), behavior: 'smooth' }); }
  }, 30);
}, true);

(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.btn:disabled{cursor:not-allowed}
.os{grid-template-columns:232px minmax(0,1fr);align-items:stretch;scroll-margin-top:calc(var(--hdr,96px) + 12px)}
.os:not(.max){height:calc(100vh - var(--hdr,96px) - 28px);min-height:560px;max-height:none}
.os .os-side{overflow-anchor:none;position:relative;top:auto;align-self:stretch;max-height:none;height:100%;min-height:0;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:auto;padding:14px 10px 40px;
  -webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 36px),transparent)}
.os{background:linear-gradient(to right,var(--os-side) 231px,var(--os-line) 231px,var(--os-line) 232px,var(--os-bg) 232px)}
.os .os-main{min-height:0;height:100%;overflow:hidden;display:flex;flex-direction:column}
.os .os-head{flex:0 0 auto}
.os .os-body{overflow-anchor:none;flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:var(--os-line) transparent}
.os .os-g h6{margin:14px 8px 6px;padding-top:10px;border-top:1px solid color-mix(in srgb,var(--os-line) 70%,transparent);font:700 10.5px var(--f-body);letter-spacing:.14em;color:#AEB6C6;opacity:1}
.os .os-g:first-of-type h6{border-top:0;padding-top:0}
.os .os-i{padding:8px 10px;font-size:14.5px;line-height:1.2;transition:background .12s,color .12s}
.os .os-i .os-ic{font-size:17px}
.os .os-i.on{background:var(--accent-soft);color:#fff;box-shadow:inset 3px 0 0 var(--accent);font-weight:600}
.os .os-q{margin:0 2px 8px;width:calc(100% - 4px)}
.os .os-side::-webkit-scrollbar{width:8px}.os .os-side::-webkit-scrollbar-thumb{background:var(--os-line);border-radius:4px}
.os .os-body::-webkit-scrollbar{width:10px}.os .os-body::-webkit-scrollbar-thumb{background:var(--os-line);border-radius:5px}
@media (max-width:760px){.os:not(.max){height:auto;min-height:0}.os .os-side{height:auto;-webkit-mask-image:none;mask-image:none;padding:8px}.os .os-main{height:auto;overflow:visible}.os .os-body{overflow:visible}.os{background:var(--os-bg)}}`; document.head.appendChild(st); })();
