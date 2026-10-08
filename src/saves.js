// ---------------- Saves: snapshots, autosaves and save slots ----------------
// A save is the state of your life, not a recording of it. The world is rebuilt from its seed (that part never
// changes), and the save holds only what's different since the day you arrived: every person, film and company
// that changed, your own life whole, and where the dice are. So a save made on an older version of the game loads
// on a newer one. Saves live in this browser (IndexedDB), compressed. Autosaves come on a schedule you choose and
// the five most recent are kept; up to fifty manual saves sit beside them. Between saves, a short journal of what
// you did since is kept too, so closing the tab loses nothing.
const SNAP_V = 1, BUILD_ID = 'b67', MAX_MANUAL = 50, MAX_AUTO = 5, JOURNAL_KEY = 'applebox-journal-v1', AUTO_PREF = 'applebox-autosave';
const AUTO_EVERY = { week: 'Every week', month: 'Every month', half: 'Every six months', year: 'Every year', five: 'Every five years', off: 'Never' };
let BASE = null;   // what the world looked like as it was built, before you arrived: hashes, field by field
function fnv(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
// numbers to four decimals: one fast pass over the finished text (an exact save skips it, for the tests)
function snapRoundText(str) { return str.replace(/(\d\.\d{4})\d+/g, '$1'); }
const SNAP_SETS = ['people', 'films', 'companies'];
const KEYIDX = new Map(), KEYS = [];
function keyId(k) { let i = KEYIDX.get(k); if (i === undefined) { i = KEYS.length; KEYS.push(k); KEYIDX.set(k, i); } return i; }
// called once the world is built (new game or before a load)
function snapBaseline() {
  const b = { n: {}, h: {}, fk: {}, fh: {}, tk: [], tv: [], sig: 0 };
  for (const set of SNAP_SETS) {
    const L = S[set], n = L.length, H = new Uint32Array(n), FK = new Array(n), FH = new Array(n);
    for (let i = 0; i < n; i++) {
      const e = L[i], ks = Object.keys(e), fk = new Uint16Array(ks.length), fh = new Uint32Array(ks.length); let h = 0;
      for (let j = 0; j < ks.length; j++) { const k = ks[j]; fk[j] = keyId(k); fh[j] = fnv(JSON.stringify(e[k]) || 'u'); h = (Math.imul(h, 31) + fh[j] + fk[j]) >>> 0; }
      H[i] = h; FK[i] = fk; FH[i] = fh; b.sig = (b.sig + h) >>> 0;
      if (set === 'people') { const t = e.ties || {}, tk = Object.keys(t); b.tk[i] = Int32Array.from(tk, Number); b.tv[i] = Float32Array.from(tk, x => t[x]); }
    }
    b.n[set] = n; b.h[set] = H; b.fk[set] = FK; b.fh[set] = FH;
  }
  BASE = b; return b;
}
// one entity against its baseline: the fields that changed (ties entry by entry), or null if none did
function entDiff(set, i, e) {
  const fk = BASE.fk[set][i], fh = BASE.fh[set][i], out = {}; let any = false;
  const ks = Object.keys(e), seen = new Set();
  for (const k of ks) {
    const id = keyId(k); seen.add(id); const j = fk.indexOf(id), js = JSON.stringify(e[k]);
    if (j >= 0 && fnv(js || 'u') === fh[j]) continue;
    if (set === 'people' && k === 'ties' && j >= 0) {
      const t = e.ties, d = {}, bk = BASE.tk[i], bv = BASE.tv[i], had = new Set();
      for (let q = 0; q < bk.length; q++) { const x = bk[q]; had.add(x); if (!(x in t)) d[x] = null; else if (Math.fround(t[x]) !== bv[q]) d[x] = t[x]; }
      for (const x in t) if (!had.has(+x)) d[x] = t[x];
      out['~ties'] = d; any = true; continue;
    }
    out[k] = e[k] === undefined ? null : e[k]; any = true;
  }
  const gone = []; for (let j = 0; j < fk.length; j++) if (!seen.has(fk[j])) gone.push(KEYS[fk[j]]);
  if (gone.length) { out['~gone'] = gone; any = true; }
  return any ? out : null;
}
// the save itself, as a string
function snapData(exact) {
  if (!BASE) throw new Error('no baseline');
  const d = { v: SNAP_V, build: BUILD_ID, seed: S.seed, year: S.startYear, depth: S.depth, sig: BASE.sig, base: BASE.n, n: {}, ch: {}, r: R.s, pr: S.me && S.me.rng ? S.me.rng.s : null };
  for (const set of SNAP_SETS) {
    const L = S[set], nb = BASE.n[set], out = []; d.n[set] = L.length;
    for (let i = 0; i < L.length; i++) {
      if (i >= nb) { out.push(i, L[i]); continue; }
      const x = entDiff(set, i, L[i]); if (x) out.push(i, x);
    }
    d.ch[set] = out;
  }
  const rest = {}; for (const k in S) if (!SNAP_SETS.includes(k) && k !== 'log' && k !== 'me') rest[k] = S[k];
  d.rest = rest;
  const str = JSON.stringify(d);
  // your own life is small and kept exact, so the journal replays onto exactly the numbers you left
  const me = JSON.stringify(S.me === undefined ? null : S.me);
  return '{"me":' + me + ',' + (exact ? str : snapRoundText(str)).slice(1);
}
// put a save into the freshly built world
function snapApply(str) {
  const d = JSON.parse(str);
  if (d.v !== SNAP_V) throw new Error('save format ' + d.v);
  const rest = d.rest;
  if ('me' in d) rest.me = d.me;
  for (const set of SNAP_SETS) {
    const L = S[set], ch = d.ch[set], nb = d.base[set];
    for (let q = 0; q < ch.length; q += 2) {
      const i = ch[q], x = ch[q + 1];
      if (i >= nb || !L[i]) { L[i] = x; continue; }
      const e = L[i];
      for (const k in x) {
        if (k === '~gone') { for (const g of x[k]) delete e[g]; continue; }
        if (k === '~ties') { const t = e.ties = e.ties || {}; for (const id in x[k]) { if (x[k][id] === null) delete t[id]; else t[id] = x[k][id]; } continue; }
        e[k] = x[k];
      }
    }
    L.length = d.n[set];
  }
  const keep = { people: S.people, films: S.films, companies: S.companies };
  S = Object.assign({}, rest, keep, { log: [] });   // a new object: every cache keyed on the old world lets go
  R = mulberry(d.r);
  if (S.me && d.pr !== null) S.me.rng = mulberry(d.pr);
  snapResetCaches();
  return d;
}
function snapResetCaches() {
  try { AB_CACHE = AB_FOR = AW_IDX = null; AW_KEY = ''; PRIZE_RX = PRIZE_MAP = PRIZE_FOR = null; SM_CACHE = null; SM_KEY = ''; ARCH = {}; ARCH_S = null; NUMC = null; WFC = null; STORYC = {}; AMB_MEMO = {}; REEL_CACHE = { k: null, rows: null }; JOB_UNION = null; } catch (e) { /* a cache that isn't there */ }
}
function snapLabel() { const me = S.me && ME(); return me ? `${me.name} · ${fmtDate(S.week, true)}` : fmtDate(S.week, true); }

// ---- storage: IndexedDB, compressed where the browser can ----
let IDB = null;
function idb() {
  if (IDB) return IDB;
  IDB = new Promise((ok, no) => { try { const q = indexedDB.open('applebox-saves', 1); q.onupgradeneeded = () => { const db = q.result; db.createObjectStore('meta', { keyPath: 'id' }); db.createObjectStore('data'); }; q.onsuccess = () => ok(q.result); q.onerror = () => no(q.error); } catch (e) { no(e); } });
  return IDB;
}
function idbDo(store, mode, fn) { return idb().then(db => new Promise((ok, no) => { const t = db.transaction(store, mode), st = t.objectStore(store); let res; const r = fn(st); if (r) r.onsuccess = () => { res = r.result; }; t.oncomplete = () => ok(res); t.onerror = () => no(t.error); t.onabort = () => no(t.error); })); }
async function pack(str) {
  if (typeof CompressionStream === 'undefined') return { z: 0, data: str };
  const blob = await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).blob();
  return { z: 1, data: blob };
}
async function unpack(rec) { return rec.z ? await new Response(rec.data.stream().pipeThrough(new DecompressionStream('gzip'))).text() : rec.data; }
function saveList() { return idbDo('meta', 'readonly', st => st.getAll()).then(L => (L || []).sort((a, b) => b.when - a.when)).catch(() => []); }
async function writeSlot(kind, name, id) {
  const str = snapData(), j0 = JOURNAL ? JOURNAL.log.length : 0;   // what's done from here on belongs after this save
  const p = await pack(str), size = p.z ? p.data.size : str.length;
  const meta = { id: id || kind + '-' + Date.now().toString(36), kind, name: name || '', when: Date.now(), seed: S.seed, year: S.startYear, depth: S.depth, week: S.week, label: snapLabel(), build: BUILD_ID, size };
  await idbDo('data', 'readwrite', st => st.put(p, meta.id));
  await idbDo('meta', 'readwrite', st => st.put(meta));
  const after = JOURNAL ? JOURNAL.log.slice(j0) : [];
  journalReset(meta.id); if (after.length) { JOURNAL.log = after; journalWrite(); }
  if (kind === 'auto') { const L = (await saveList()).filter(x => x.kind === 'auto'); for (const x of L.slice(MAX_AUTO)) await deleteSlot(x.id); }
  return meta;
}
async function deleteSlot(id) { await idbDo('data', 'readwrite', st => st.delete(id)); await idbDo('meta', 'readwrite', st => st.delete(id)); }
async function readSlot(id) { const rec = await idbDo('data', 'readonly', st => st.get(id)); return rec ? unpack(rec) : null; }

// ---- the journal: what you've done since the last save, replayed on top of it ----
let JOURNAL = null;
function journalReset(snapId) { JOURNAL = { snap: snapId, build: BUILD_ID, seed: S.seed, year: S.startYear, depth: S.depth, log: [], t: Date.now() }; journalWrite(); }
function journalWrite() { try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(JOURNAL)); } catch (e) { /* storage full or unavailable: the autosaves still hold */ } }
function journalRead() { try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || 'null'); } catch (e) { return null; } }
function journalAdd(a) { if (!JOURNAL) return; JOURNAL.log.push(a); JOURNAL.t = Date.now(); journalWrite(); }
function journalClear() { JOURNAL = null; try { localStorage.removeItem(JOURNAL_KEY); } catch (e) { /* nothing to clear */ } }
// Replaying is forgiving: if the game has changed since a step was taken and the step no longer fits (a choice
// that isn't there, a week that won't end with something waiting), it settles what's waiting and carries on.
function replayOne(a) {
  const adv = a.t === 'end' || a.t === 'day' || a.t === 'next';
  if (adv && a._w !== undefined && S.week > a._w) return true;   // already past the week this step was taken in
  let ok = false;
  try { ok = applyAct(a); } catch (e) { ok = false; }
  if (!ok && adv && (a._w === undefined || S.week <= a._w)) {
    try { for (let g = 0; g < 10 && pending().length; g++) for (const it of pending()) applyAct({ t: 'pick', id: it.id, k: it.kind === 'offer' ? 'no' : (it.choices.find(c => !c.dis) || it.choices[0]).k }); ok = applyAct(a); } catch (e) { ok = false; }
  }
  if (ok) (S.log = S.log || []).push(a);
  return ok;
}
function replayForgiving(log) { let miss = 0; for (const a of log) if (!replayOne(a)) miss++; return miss; }

// ---- autosaves ----
function autoPref() { try { const v = localStorage.getItem(AUTO_PREF); return AUTO_EVERY[v] ? v : 'half'; } catch (e) { return 'half'; } }
function setAutoPref(v) { if (!AUTO_EVERY[v]) return; try { localStorage.setItem(AUTO_PREF, v); } catch (e) { /* this visit only */ } }
function autoPeriod(v = autoPref()) { const y = S.year, m = S.month || 0; return v === 'week' ? S.week : v === 'month' ? y * 12 + m : v === 'half' ? y * 2 + (m >= 6 ? 1 : 0) : v === 'year' ? y : v === 'five' ? Math.floor(y / 5) : null; }
let AUTO_AT = 'new', SAVING = false;   // 'new': a career that has never been saved saves as soon as it starts
function autoMark() { AUTO_AT = autoPeriod(); }
function autoCheck() {
  if (SAVING || !S.me || !S.me.party || !S.me.party.done || typeof indexedDB === 'undefined' || !BASE || UI.replaying) return;
  const p = autoPeriod(); if (p === null || (p === AUTO_AT && AUTO_AT !== 'new')) return;
  AUTO_AT = p; saveNow('auto');
}
// saves queue behind one another: a manual save asked for during an autosave waits for it, then happens
let SAVE_Q = Promise.resolve();
function saveNow(kind, name, id) { const p = SAVE_Q.then(() => saveRun(kind, name, id)); SAVE_Q = p.catch(() => null); return p; }
async function saveRun(kind, name, id) {
  if (!BASE || !S.me) return null;
  SAVING = true; UI.saveMsg = kind === 'auto' ? 'Autosaving…' : 'Saving…'; saveBadge();
  await new Promise(r => setTimeout(r, 30));
  try { const m = await writeSlot(kind, name, id); AUTO_AT = autoPeriod(); UI.saveMsg = `${kind === 'auto' ? 'Autosaved' : 'Saved'} · ${fmtDate(m.week, true)}`; UI.saveList = null; return m; }
  catch (e) { UI.saveMsg = 'Couldn\'t save: ' + ((e && e.name) || 'storage unavailable'); return null; }
  finally { SAVING = false; saveBadge(); setTimeout(() => { UI.saveMsg = ''; saveBadge(); }, 4000); }
}
function saveBadge() { const el = typeof document !== 'undefined' && document.getElementById('savebadge'); if (el) el.textContent = UI.saveMsg || ''; }

// ---- loading ----
// The world for a save is built the usual way (same seed, year and depth); then the save goes on top.
async function loadSlotInto(id, resume) {
  const str = await readSlot(id); if (!str) throw new Error('missing');
  snapBaseline();
  const d = snapApply(str);
  const J = journalRead();
  let miss = 0;
  const carry = resume && J && J.snap === id && J.log.length;   // resuming: what you did after this save, too
  if (carry) miss = replayForgiving(J.log);
  journalReset(id);
  if (carry) { JOURNAL.log = J.log.slice(); journalWrite(); }
  autoMark();
  return { d, miss, sigOK: d.sig === BASE.sig };
}
// on start-up: what to resume (the newest save), and whether there's an old-style save to bring across
async function resumeTarget() { const L = await saveList(); return L[0] || null; }

// ---- the saves page ----
function savesHTML() {
  const L = UI.saveList;
  if (!L) { saveList().then(x => { UI.saveList = x; render(true); }); try { navigator.storage.estimate().then(e => { UI.saveQuota = [e.usage || 0, e.quota || 0]; }); } catch (e) { /* no estimate */ } return '<p class="muted">Looking for your saves…</p>'; }
  const man = L.filter(x => x.kind === 'manual'), auto = L.filter(x => x.kind === 'auto');
  const row = x => `<tr${x.seed !== S.seed || x.year !== S.startYear || x.depth !== S.depth ? ' class="muted"' : ''}><td><b>${esc(x.name || (x.kind === 'auto' ? 'Autosave' : 'Save'))}</b><br><span class="small muted">${esc(x.label)}</span></td><td class="small">${new Date(x.when).toLocaleString()}</td><td class="n small">${(x.size / 1e6).toFixed(1)} MB</td><td>${sBtn('sload', x.id, 'Load', 'Click again to load', '')} ${x.kind === 'manual' ? sBtn('sover', x.id, 'Overwrite', 'Click again to overwrite', ' ghost') + ' ' : ''}${sBtn('sdel', x.id, 'Delete', 'Click again to delete', ' ghost')} <button class="btn-s ghost" data-sexp="${x.id}" title="Download this save as a file, to keep or to open in another browser">Export</button></td></tr>`;
  return `<section class="panel"><h3>Save your life</h3>
   <div class="ccrow"><label>Name <input id="save-name" maxlength="40" placeholder="${esc(snapLabel())}" value="${esc(UI.saveName || '')}"></label> <button class="btn-s" data-snew="1" ${man.length >= MAX_MANUAL ? 'disabled' : ''}>Save now</button> <span class="muted small">${man.length} of ${MAX_MANUAL} manual saves${man.length >= MAX_MANUAL ? ': delete or overwrite one to save again' : ''}</span></div>
   <div class="ccrow"><label>Autosave ${sel('save-auto', Object.entries(AUTO_EVERY), autoPref())}</label> <span class="muted small">The ${MAX_AUTO} most recent autosaves are kept. ${autoPref() === 'week' ? 'Weekly autosaves take a moment each week.' : ''}</span></div>
   <div class="ccrow"><label class="btn-s ghost" style="cursor:pointer">Import a save file <input type="file" id="save-import" accept=".applebox,application/gzip" hidden></label> <span class="muted small">${esc(UI.saveIO || 'Export a save to keep a copy, or to carry your career to another browser or computer.')}</span></div>
   <p class="small muted">${UI.saveQuota ? `Using ${(UI.saveQuota[0] / 1e6).toFixed(0)} MB of the ${(UI.saveQuota[1] / 1e9).toFixed(1)} GB this browser allows. ` : ''}Saves live in this browser. A save made on an older version of the game loads on a newer one. Between saves, what you do is journalled, so closing the tab loses nothing.</p></section>
   <section class="panel"><h3>Manual saves <span class="count">${man.length}</span></h3>${man.length ? `<div class="tw"><table class="grid small"><tbody>${man.map(row).join('')}</tbody></table></div>` : '<p class="muted small">None yet.</p>'}</section>
   <section class="panel"><h3>Autosaves <span class="count">${auto.length}</span></h3>${auto.length ? `<div class="tw"><table class="grid small"><tbody>${auto.map(row).join('')}</tbody></table></div>` : '<p class="muted small">None yet. The first comes at the next turn of the schedule.</p>'}</section>`;
}
// destructive buttons ask twice, in the page (the artifact frame can block confirm())
function sBtn(k, id, label, sure, cls) { const on = UI.sAsk === k + ':' + id; return `<button class="btn-s${on ? '' : cls}" data-${k}="${id}">${on ? sure : label}</button>`; }
function sSure(k, id) { if (UI.sAsk === k + ':' + id) { UI.sAsk = null; return true; } UI.sAsk = k + ':' + id; render(true); return false; }
function savesClick(t) {
  const d = t.dataset;
  if (d.snew) { const nm = document.getElementById('save-name'); if (nm) UI.saveName = nm.value; saveNow('manual', (UI.saveName || '').trim()).then(() => { UI.saveName = ''; UI.saveList = null; render(true); }); return true; }
  if (d.sover) { if (!sSure('sover', d.sover)) return true; const old = (UI.saveList || []).find(x => x.id === d.sover); saveNow('manual', old ? old.name : '', d.sover).then(() => { UI.saveList = null; render(true); }); return true; }
  if (d.sdel) { if (!sSure('sdel', d.sdel)) return true; deleteSlot(d.sdel).then(() => { UI.saveList = null; render(true); }); return true; }
  if (d.sload) { const x = (UI.saveList || []).find(y => y.id === d.sload); if (!x || !sSure('sload', d.sload)) return true; loadFromSlot(x); return true; }
  if (d.sexp) { exportSlot(d.sexp); return true; }
  if (UI.sAsk) { UI.sAsk = null; render(true); }   // any other click calls off a pending "click again"
  return false;
}
// ---- save files: export one slot, import one into this browser ----
const SAVE_FILE_V = 1;
async function exportSlot(id) {
  const meta = (UI.saveList || []).find(x => x.id === id); if (!meta) return;
  UI.saveIO = 'Preparing the file…'; render(true);
  try {
    const str = await readSlot(id); if (!str) throw new Error('missing');
    const p = await pack(JSON.stringify({ applebox: SAVE_FILE_V, meta, snap: str }));
    const blob = p.z ? p.data : new Blob([p.data], { type: 'application/json' });
    const a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.href = url; a.download = (meta.name || meta.label || 'save').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) + '.applebox';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    UI.saveIO = `Exported "${meta.name || meta.label}" (${(blob.size / 1e6).toFixed(1)} MB). If no download appeared, open the game from its file to export.`;
  } catch (e) { UI.saveIO = 'Couldn\'t export that save.'; }
  render(true);
}
async function importSaveFile(file) {
  UI.saveIO = 'Reading ' + file.name + '…'; render(true);
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    const gz = buf[0] === 0x1f && buf[1] === 0x8b;
    if (gz && typeof DecompressionStream === 'undefined') throw new Error('This browser can\'t open compressed save files.');
    const txt = gz ? await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text() : new TextDecoder().decode(buf);
    let f = null; try { f = JSON.parse(txt); } catch (e) { f = null; }
    if (!f || f.applebox !== SAVE_FILE_V || !f.meta || typeof f.snap !== 'string') throw new Error('That isn\'t an Apple Box save file.');
    if (f.snap[0] !== '{') throw new Error('That save file is damaged.');
    const m = f.meta, id = 'manual-' + Date.now().toString(36), p = await pack(f.snap);
    const meta = { id, kind: 'manual', name: ('Imported: ' + (m.name || m.label || 'save')).slice(0, 40), when: Date.now(), seed: m.seed, year: m.year, depth: m.depth, week: m.week, label: m.label || '', build: m.build || BUILD_ID, size: p.z ? p.data.size : f.snap.length };
    if (meta.seed === undefined || !meta.year || !meta.depth) throw new Error('That save file is missing its world.');
    await idbDo('data', 'readwrite', st => st.put(p, id));
    await idbDo('meta', 'readwrite', st => st.put(meta));
    UI.saveIO = `Imported "${m.name || m.label}". It's in your manual saves: click Load to play it.`; UI.saveList = null;
  } catch (e) { UI.saveIO = (e && e.message && / /.test(e.message)) ? e.message : 'Couldn\'t read that file.'; }
  render(true);
}
function savesChange(e) { const id = e.target.id; if (id === 'save-name') { UI.saveName = e.target.value; return true; } if (id === 'save-import') { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) importSaveFile(f); return true; } if (id === 'save-auto') { setAutoPref(e.target.value); autoMark(); render(true); return true; } return false; }

// What to open when the game starts: the newest save, unless there's a newer unsaved career in the journal, or an
// old-style save from before save slots existed.
async function bootTarget(legacy) {
  let slot = null; try { slot = await resumeTarget(); } catch (e) { slot = null; }
  const J = journalRead();
  if (J && J.snap === null && J.log && J.log.length && (!slot || (J.t || 0) > slot.when)) return { kind: 'journal', log: J.log, seed: J.seed, year: J.year, depth: J.depth };
  if (slot) return { kind: 'slot', resume: true, slot: slot.id, seed: slot.seed, year: slot.year, depth: slot.depth };
  if (legacy) return { kind: 'legacy', log: legacy.log, seed: legacy.seed, year: legacy.year, depth: legacy.depth };
  return null;
}
function loadFromSlot(x) { UI.boot = { kind: 'slot', slot: x.id, seed: x.seed, year: x.year, depth: x.depth }; UI.stack = []; build(x.year, x.seed, x.depth); }
// the world has been built for a boot target: put the career back
function bootFinish(T, done) {
  if (T.kind === 'slot') {
    loadSlotInto(T.slot, T.resume).then(r => { if (r.miss) inbox('note', 'Picked up where you left off', `A few things you did after your last save didn't fit the new version of the game (${r.miss} step${r.miss > 1 ? 's' : ''}), so the week may have gone a little differently.`); done(); })
      .catch(e => { console.error(e); UI.saveMsg = 'That save couldn\'t be opened.'; S.me = null; journalReset(null); done(); });
    return;
  }
  journalReset(null); JOURNAL.log = []; AUTO_AT = 'new';
  replayCareer(T.log, miss => {
    if (miss && S.me) inbox('note', 'Your career, carried across', `This career was saved by an older version of the game, so it was replayed under today's rules. ${miss} step${miss > 1 ? 's' : ''} no longer fit and were settled as best they could be: some things may have gone differently from how you remember. From now on your life is saved as it is, so updates won't change it.`);
    if (T.kind === 'legacy') { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nothing to clear */ } }
    if (S.me && S.me.party && S.me.party.done) saveNow('auto');
    done();
  });
}
