// ---------------- Your own week, kept ----------------
// Changes you make block by block are actions like any other (so saves replay them), and they can be pinned: a
// pinned block survives autopilot, which plans around it every week. Whole weeks can be saved as named plans and
// put back with one click. Jobs and study sessions still take their blocks when the week runs.
function calOk(d, b, k) { return d >= 0 && d < 7 && b >= 0 && b < 3 && k !== 'work' && (BLOCK_ACTS[k] || (b === 2 && typeof venueAsEvening === 'function' && venueAsEvening(k))); }
function calSetAct(a) {
  const M = S.me, d = +a.d, b = +a.b, k = String(a.k || ''); if (!calOk(d, b, k)) return false;
  calOf()[d][b] = k;
  if (M.calPinAll) (M.calPins = M.calPins || {})[d + '-' + b] = k;
  return true;
}
function calPinAct(a) {
  const M = S.me, key = String(a.key || '');
  if (a.all !== undefined) { M.calPinAll = !!a.all; if (M.calPinAll) { M.calPins = M.calPins || {}; const c = calOf(); if (a.snap) for (let d = 0; d < 7; d++) for (let b = 0; b < 3; b++) if (c[d][b] !== 'work') M.calPins[d + '-' + b] = c[d][b]; } return true; }
  if (a.clear) { M.calPins = {}; M.calPinAll = false; return true; }
  if (!/^[0-6]-[0-2]$/.test(key)) return false;
  M.calPins = M.calPins || {};
  if (M.calPins[key] !== undefined) delete M.calPins[key]; else { const [d, b] = key.split('-').map(Number); M.calPins[key] = calOf()[d][b]; }
  return true;
}
function calPresetAct(a) {
  const M = S.me, L = M.calPresets = M.calPresets || [];
  if (a.op === 'save') { const name = String(a.name || '').replace(/\s+/g, ' ').trim().slice(0, 28) || `Plan ${L.length + 1}`; if (L.length >= 6) return false; L.push({ name, cal: calOf().map(r => r.slice()) }); return true; }
  const i = +a.i; if (!L[i]) return false;
  if (a.op === 'del') { L.splice(i, 1); return true; }
  if (a.op === 'use') { M.cal = L[i].cal.map(r => r.map(k => k === 'work' ? 'rest' : k)); if (M.focus) M.focus.auto = false; if (a.pin) { M.calPins = {}; for (let d = 0; d < 7; d++) for (let b = 0; b < 3; b++) M.calPins[d + '-' + b] = M.cal[d][b]; } return true; }
  return false;
}
// autopilot plans the week, then puts your pinned blocks back
function applyPins(cal) { const P0 = S.me.calPins || {}; for (const key in P0) { const [d, b] = key.split('-').map(Number); if (cal[d] && calOk(d, b, P0[key])) cal[d][b] = P0[key]; } return cal; }
function diaryKeepHTML() {
  const M = S.me, pins = Object.keys(M.calPins || {}).length, L = M.calPresets || [];
  return `<div class="dk"><label class="dk-t" title="Every block you change is pinned, and autopilot plans around it each week"><input type="checkbox" data-calpinall="1" ${M.calPinAll ? 'checked' : ''}>📌 Keep my changes</label>${pins ? `<span class="muted">${pins} pinned · <button class="linkish" data-calpinclear="1">unpin</button></span>` : ''}<span class="dk-sep">·</span>${L.length ? `<select id="cal-use" aria-label="Saved weeks"><option value="">Saved weeks…</option>${L.map((p, i) => `<option value="${i}">${esc(p.name)}</option>`).join('')}</select><button class="linkish" data-caluse2="1">load</button><button class="linkish dk-x" data-caldel2="1">delete</button>` : ''}${L.length < 6 ? (UI.calnaming ? `<input id="cal-pname" maxlength="28" placeholder="Name it" class="dk-in"><button class="linkish" data-calsave="1">save</button><button class="linkish" data-calname="0">cancel</button>` : `<button class="linkish" data-calname="1" title="Save this week's plan to load again later">save this week</button>`) : ''}</div>`;
}
function diary2Click(t) {
  if (!S.me) return false;
  const d = t.dataset;
  if (d.calpin) { doAct({ t: 'calpin', key: d.calpin }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinall) { doAct({ t: 'calpin', all: t.checked }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinsnap) { doAct({ t: 'calpin', all: true, snap: 1 }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinclear) { doAct({ t: 'calpin', clear: 1 }); render(true); return true; }
  if (d.calname !== undefined) { UI.calnaming = d.calname === '1'; UI.fineOpen = true; render(true); const el = document.getElementById('cal-pname'); if (el) el.focus(); return true; }
  if (d.calsave) { const el = document.getElementById('cal-pname'); doAct({ t: 'calpreset', op: 'save', name: el ? el.value : '' }); UI.calnaming = false; UI.fineOpen = true; render(true); return true; }
  if (d.caluse2 || d.caldel2) { const el = document.getElementById('cal-use'), i = el && el.value !== '' ? +el.value : -1; if (i >= 0) doAct({ t: 'calpreset', op: d.caluse2 ? 'use' : 'del', i }); UI.fineOpen = true; render(true); return true; }
  if (d.caluse !== undefined) { doAct({ t: 'calpreset', op: 'use', i: +d.caluse, pin: d.calpinuse ? 1 : 0 }); UI.fineOpen = true; render(true); return true; }
  if (d.caldel !== undefined) { doAct({ t: 'calpreset', op: 'del', i: +d.caldel }); render(true); return true; }
  return false;
}
