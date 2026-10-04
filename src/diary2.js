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
  return `<div class="dk"><div class="dk-row"><label class="dk-t"><input type="checkbox" data-calpinall="1" ${M.calPinAll ? 'checked' : ''}> <b>📌 Keep my changes every week</b></label><span class="muted small">${M.calPinAll ? 'Every block you change from now on is pinned: autopilot plans around it each week.' : 'Tick it, or click 📌 on any block, and autopilot keeps your choices instead of replanning them.'}</span>
    ${pins ? `<span class="chip">${pins} pinned</span> <button class="linkish" data-calpinclear="1">Unpin all</button>` : ''}<button class="os-btn" data-calpinsnap="1" title="Pin every block of this week as it stands">Pin this whole week</button></div>
   <div class="dk-row"><b class="small">Saved weeks</b>${L.map((p, i) => `<span class="dk-p"><button class="os-btn" data-caluse="${i}" title="Load this plan into the diary">${esc(p.name)}</button><button class="linkish" data-caluse="${i}" data-calpinuse="1" title="Load it and pin every block">load + pin</button><button class="linkish dk-x" data-caldel="${i}" title="Delete">✕</button></span>`).join('') || '<span class="muted small">None yet.</span>'}
    ${L.length < 6 ? `<input id="cal-pname" maxlength="28" placeholder="Name this week…" value="${esc(UI.calpname || '')}"><button class="os-btn" data-calsave="1">Save this week</button>` : '<span class="muted small">Six saved: delete one to save another.</span>'}</div></div>`;
}
function diary2Click(t) {
  if (!S.me) return false;
  const d = t.dataset;
  if (d.calpin) { doAct({ t: 'calpin', key: d.calpin }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinall) { doAct({ t: 'calpin', all: t.checked }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinsnap) { doAct({ t: 'calpin', all: true, snap: 1 }); UI.fineOpen = true; render(true); return true; }
  if (d.calpinclear) { doAct({ t: 'calpin', clear: 1 }); render(true); return true; }
  if (d.calsave) { const el = document.getElementById('cal-pname'); doAct({ t: 'calpreset', op: 'save', name: el ? el.value : '' }); UI.calpname = ''; UI.fineOpen = true; render(true); return true; }
  if (d.caluse !== undefined) { doAct({ t: 'calpreset', op: 'use', i: +d.caluse, pin: d.calpinuse ? 1 : 0 }); UI.fineOpen = true; render(true); return true; }
  if (d.caldel !== undefined) { doAct({ t: 'calpreset', op: 'del', i: +d.caldel }); render(true); return true; }
  return false;
}
