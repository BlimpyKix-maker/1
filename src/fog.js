// ---------------- Scouting fog ----------------
// After Football Manager: you don't know how good someone is until you find out. Skills show as a range whose width
// depends on what you know about them (level 0–3):
//  0 stranger ±6 · 1 a contact ±4 · 2 worked with them, or scouted ±2 · 3 scouted thoroughly: exact.
// The range isn't centred on the truth (a hashed offset per person and skill), so the middle of the range is a guess,
// not the answer. Negative traits (Difficult, Volatile, Lazy, Party animal…) stay hidden below level 2.
// Scouting (doAct `scout`) raises a person one level: asking around and watching their reel costs a little money and
// energy, three a week; a good agent makes it cheaper. The make-film form, crew pickers and person pages all show
// the fogged numbers; the simulation itself always uses the truth.
const FOG_U = [6, 4, 2, 0], FOG_HIDE = ['Difficult', 'Volatile', 'Lazy', 'Party animal', 'Showboat', 'Stubborn', 'Reckless', 'Gossip', 'Ruthless'];
function scoutLv(id) {
  const M = S.me; if (!M || id === M.id) return 3; const p = P(id); if (!p) return 0;
  let lv = (M.scout || {})[id] || 0; const k = M.known[id];
  if (k) lv = Math.max(lv, 1);
  if (k && ((k.tags || []).some(t => /Worked together|Your regular|Hired for your film|Cast in your film|Directing your film|crew/i.test(t)))) lv = Math.max(lv, 2);
  if ((ME().credits || []).some(i => (p.credits || []).includes(i))) lv = Math.max(lv, 2);
  return Math.min(3, lv);
}
function fogRange(id, v, key = '') {
  const u = FOG_U[scoutLv(id)]; if (!u) return [Math.round(v), Math.round(v)];
  const off = (gH(id, key, 'fog') - .5) * u;   // the truth sits somewhere inside, not in the middle
  return [Math.max(1, Math.round(v - u / 2 + off)), Math.min(20, Math.round(v + u / 2 + off))];
}
function fogNum(p, v, key = '') { const [lo, hi] = fogRange(p.id, v, key); return lo === hi ? String(lo) : `${lo}–${hi}`; }
// person pages: fog the skill cells and bars while a page renders
let FOG_P = null;
{ const _sc = skillCell; skillCell = function (v) { if (FOG_P === null || scoutLv(FOG_P) >= 3) return _sc(v); const [lo, hi] = fogRange(FOG_P, v, 'c' + Math.round(v * 7)); return `<span class="att fog" title="An estimate: scout them to narrow it">${lo}–${hi}</span>`; }; }
{ const _vp = viewPerson; viewPerson = function (id) {
  const p = P(id); if (!S.me || !p || id === S.me.id) return _vp(id);
  FOG_P = id; let h; try { h = _vp(id); } finally { FOG_P = null; }
  const lv = scoutLv(id);
  if (lv < 2) for (const t of FOG_HIDE) if (p.traits.includes(t)) h = h.replace(new RegExp(`<span class="chip trait" title="[^"]*">${t}</span>`), '<span class="chip trait fog" title="Something you\'d only learn by working with them, or scouting">?</span>');
  if (lv < 2) h = h.replace(/(Reputation in the business: )([^<.]*)/, (m, a, b) => { const L = b.split(/,\s*/).filter(w => !FOG_HIDE.some(t => t.toLowerCase() === w.trim().toLowerCase())); return a + (L.length ? L.join(', ') : 'hard to read'); });   // the trivia line mustn't give away what the chips hide
  if (lv < 3) h = h.replace(/(<div class="traits">)/, `<p class="small fogbar">Scouting: <b>${['a stranger', 'a contact', 'known', 'scouted'][lv]}</b> · skills shown as ranges (±${FOG_U[lv]}). <button class="btn-s" data-scout="${id}">Scout them (${fmtCash(scoutCost())})</button></p>$1`);
  return h; }; }
function scoutCost() { const M = S.me, t = M.agent ? M.agent.tier : 0; return usd(Math.max(80, 400 - t * 80)); }
function scoutAct(a) {
  const M = S.me, id = +a.id, p = P(id); if (!p || id === M.id || scoutLv(id) >= 3) return false;
  const wk = M.scoutW === S.week ? (M.scoutN || 0) : 0; if (wk >= 3 || M.cash < scoutCost()) return false;
  M.cash -= scoutCost(); M.energy = clamp(M.energy - 3, 0, 100); M.scoutW = S.week; M.scoutN = wk + 1;
  (M.scout = M.scout || {})[id] = scoutLv(id) + 1; return true;
}
function scoutClick(t) { const id = t.dataset.scout; if (id === undefined) return false; if (!doAct({ t: 'scout', id: +id })) inbox('note', 'Can\'t scout now', 'Three a week at most, and it costs a little. Some people you already know as well as you can.'); render(true); return true; }
{ const _b = bar; bar = function (v, max = 100, cls = '') { if (FOG_P === null || max !== 20 || scoutLv(FOG_P) >= 3) return _b(v, max, cls); const [lo, hi] = fogRange(FOG_P, v, 'c' + Math.round(v * 7)); return _b((lo + hi) / 2, max, cls + ' fog'); }; }
