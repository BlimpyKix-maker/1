// ================= Story DNA in the game (Round 24) =================
// Where the story engine shows up: the new-script form ("where it comes from"), the Scriptwriter's Story tab (the DNA,
// with the structure and the ending yours to choose) and its Read tab (beat sheet, synopsis, sample pages, the
// reader's notes), film pages ("The story"), critics, trailers, awards speeches, the fashion for a structure that a
// hit starts, sequels, and the works pages (lyrics with a playable chord chart, plays, musicals, podcasts, videos).

// ---- starting a script: the DNA is made here, once, from the choice of source ----
{ const _ns = newScript; newScript = function (a) {
  const n0 = (S.me.scripts || []).length, ok = _ns.apply(this, arguments);
  if (ok && (S.me.scripts || []).length > n0) { const sc = S.me.scripts[S.me.scripts.length - 1], src = DNA_SOURCES[a.src] ? a.src : 'mix'; sc.src = src; sc.dna = dnaMakeScript(sc, src);
    if (sc.dna.life.length) diary(`${sc.title} starts from your own life: ${sc.dna.life[0]}`); }
  return ok; }; }
// the structure and the ending are the writer's to choose while the draft is open
ACT_HOOKS.swdna = a => {
  const sc = scriptOf(a.id); if (!sc || sc.stage !== 'writing') return false;
  const d = sc.dna || (sc.dna = dnaMakeScript(sc, 'invent'));
  if (DNA_TRICK_KEYS.includes(a.trick)) { d.trick = sc.trickK = a.trick; }
  if (DNA_END_KEYS.includes(a.end) && a.end !== d.endK) { d.endK = sc.endK = a.end; d.end = dnaPick(hashRand(d.seed + a.end.length * 17), DNA_POOLS.ends[a.end]); }
  return true;
};
CLICK_HOOKS.swdna = id => { const v = k => ($('#' + k) || {}).value || ''; doAct({ t: 'swdna', id: +id, trick: v('dna-trick'), end: v('dna-end') }); render(true); };

// the source choice on the new-script form
{ const _wd = writingDesk; writingDesk = function () {
  const h = _wd.apply(this, arguments); if (typeof h !== 'string' || !h.includes('data-newscript="1"')) return h;
  const sel0 = `<label class="ns-src">Where it comes from ${sel('ns-src', Object.entries(DNA_SOURCES), 'mix')}<span class="muted small"> Your own life puts the people you know, your old jobs, your city, your pets and your losses on the page.</span></label>`;
  return h.replace('<button class="btn-s" data-newscript="1">', sel0 + '<button class="btn-s" data-newscript="1">');
}; }

// ---- the Scriptwriter ----
function dnaCard(d, sc) {
  const row = (k, v) => `<div class="dna-r"><span>${k}</span><span>${v}</span></div>`, f = s => esc(dnaFill(s, d)), tr = dnaTrickLine(d);
  const edit = sc && sc.stage === 'writing' ? `<div class="dna-ed"><label>Structure ${sel('dna-trick', DNA_TRICK_KEYS.map(k => [k, (DNA_POOLS.tricks[k] || [k])[0] + ((DNA_POOLS.trickFit[k] || []).includes(d.g) ? ' ★' : '')]), d.trick)}</label>
    <label>Ending ${sel('dna-end', DNA_END_KEYS.map(k => [k, DNA_END_LABEL[k] + (((DNA_TONE_END[d.tone] || {})[k] || 0) >= 3 ? ' ★' : '')]), d.endK)}</label><button class="btn-s ghost" data-hk="swdna:${sc.id}">Set</button>
    <span class="muted small">★ suits the genre or the tone. A structure that fights its genre is a risk the reader will notice.</span></div>` : '';
  return `<section class="dna"><h5>The story's DNA</h5>
   ${row('Hero', `<b>${esc(d.hero.n)}</b>, ${f(aAn(d.hero.job))} who ${f(d.hero.flaw)}. Wants to ${f(d.hero.want)}; needs ${f(d.hero.need)}. The wound: ${f(d.hero.wound)}.`)}
   ${row('Against', `<b>${esc(d.foe.n)}</b>, ${f(d.foe.who)}, who ${f(d.foe.want)}.`)}
   ${row('Beside', `<b>${esc(d.ally.n)}</b>, ${f(d.ally.who)}.`)}
   ${row('World', `${f(d.world.place)}, ${f(d.world.desc)}${d.world.city && !d.world.desc.includes(d.world.city) ? ' · ' + esc(d.world.city) : ''}`)}
   ${row('It starts', f(d.inc[1]))}${row('Midpoint', f(d.mid))}${row('Ending', `${esc(DNA_END_LABEL[d.endK])}: ${f(d.end)}`)}
   ${row('What it says', f(d.arg))}${row('The image', `${f(d.obj.o)}, ${f(d.obj.how)}`)}${row('How it\'s told', `<b>${esc(tr[0])}</b>. ${esc(tr[1])}`)}
   ${d.life.length ? `<div class="dna-life"><b>From your life</b><ul class="plain small">${d.life.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}${edit}</section>`;
}
{ const _ss = swStory; swStory = function (sc) { const d = dnaOfScript(sc); return (d ? dnaCard(d, sc) : '') + _ss.apply(this, arguments); }; }
if (!SW_TABS.some(t => t[0] === 'read')) SW_TABS.splice(SW_TABS.findIndex(t => t[0] === 'notes'), 0, ['read', '📖 Read']);
function dnaReadTab(sc) {
  const d = dnaOfScript(sc), c = scriptCraft(sc), done = !!sc.grade, prog = sc.pages / Math.max(1, sc.target);
  const beats = done ? [0, 1, 4, 7] : [0, ...(prog >= .2 ? [1] : []), ...(prog >= .5 ? [4] : []), ...(prog >= .8 ? [6] : [])];
  const pages = dnaPages(d, { c, draft: sc.draft, beats }), B = dnaBeats(d), N = dnaNotes(d, sc.score || Math.round(30 + c * 50), pages);
  const reached = done ? 8 : Math.max(1, Math.ceil(prog * 8));
  return `<p class="small muted">The draft as it stands, written by the game from the story's DNA at your level of craft (${c < .35 ? 'still learning: the lines say what they mean' : c < .65 ? 'competent' : 'sharp: the lines say more than they say'}). Rewrite, punch up and grow your skills, and the pages get better.</p>
   <p class="sw-log"><b>Logline:</b> ${esc(dnaLogline(d))}</p>
   <h5>Beat sheet</h5><ol class="small dna-beats">${B.map(([k, t], i) => `<li class="${i < reached ? '' : 'muted'}"><b>${k}.</b> ${i < reached ? esc(t) : '<i>not written yet</i>'}</li>`).join('')}</ol>
   ${done ? `<h5>Synopsis</h5><p class="small">${esc(dnaSynopsis(d))}</p>` : ''}
   <h5>Pages</h5><div class="fp">${fountain(pages)}</div>
   <h5>Reader's notes</h5><ul class="plain small dna-notes">${N.list.map(([g, k, t]) => `<li class="${g ? 'good' : 'bad'}">${g ? '✔' : '✖'} ${esc(t)}</li>`).join('')}</ul>${N.best ? `<p class="small">Best line on these pages: <q>${esc(N.best)}</q></p>` : ''}`;
}
{ const _cv = swCoverage; swCoverage = function (sc, done) { if (UI.swt === 'read' && sc) return dnaReadTab(sc); return _cv.apply(this, arguments); }; }
// the DNA counts: a structure that suits the genre, an ending that suits the tone and material from life lift the
// finished draft a little; a structure that fights the genre costs a little
{ const _fd = finishDraft; finishDraft = function (sc, L) {
  const r = _fd.apply(this, arguments); const d = sc.dna; if (!d || sc.score === undefined) return r;
  const adj = Math.round((dnaFit(d) - .45) * 14); if (!adj) return r;
  sc.score = clamp(sc.score + adj, 5, 98); sc.grade = sc.score >= 85 ? 'A' : sc.score >= 70 ? 'B' : sc.score >= 55 ? 'C' : sc.score >= 40 ? 'D' : 'F';
  if (sc.history && sc.history.length) sc.history[sc.history.length - 1] = sc.grade + ' ' + sc.score;
  if (L && L.push) L.push(adj > 0 ? `The way ${sc.title} is built works for it (${d.life.length ? 'and it\'s true to your life' : 'the shape suits the story'}): +${adj}.` : `The structure of ${sc.title} fights its genre: ${adj}.`);
  return r; }; }

// ---- films ----
{ const _ofm = dnaOfFilm; dnaOfFilm = function (f) {
  if (f && !f.dna && S.me) { const own = (S.me.scripts || []).find(x => x.made === f.id) || (S.me.holdings || []).find(x => x.made === f.id && x.genre); if (own) return dnaOfScript(own); }
  return _ofm.apply(this, arguments); }; }
{ const _fl = filmLogline; filmLogline = function (f) {
  if (f && !f.real && !(typeof storyLog === 'function' && storyLog(f))) { const M = S.me, own = M && (M.scripts || []).find(x => x.made === f.id); if (own && own.logline && !own.dna) return _fl.apply(this, arguments); const d = dnaOfFilm(f); if (d) return dnaLogline(d); }
  return _fl.apply(this, arguments); }; }
function filmStoryPanel(f) {
  const d = dnaOfFilm(f); if (!d) return '';
  const c = filmCraft(f), B = dnaBeats(d), pages = dnaPages(d, { c, beats: [0], draft: 1 }), tr = dnaTrickLine(d), rel = f.rel !== null;
  return `<section class="panel"><h3>The story</h3><p>${esc(dnaLogline(d))}</p>
   <p class="small"><b>How it's told:</b> ${esc(tr[0])}. ${esc(tr[1])} · <b>Ending:</b> ${esc(DNA_END_LABEL[d.endK])}${d.seq ? ' · <b>A sequel:</b> the same hero, the same world, a new story' : ''}</p>
   <details><summary>Beat sheet${rel ? '' : ' (as developed)'}</summary><ol class="small">${B.map(([k, t]) => `<li><b>${k}.</b> ${esc(t)}</li>`).join('')}</ol><p class="small"><i>${esc(dnaFill(d.arg, d))}</i></p></details>
   <details><summary>From the screenplay</summary><div class="fp">${fountain(pages)}</div></details>
   ${d.life && d.life.length ? `<p class="small muted">From the writer's life: ${esc(d.life.join(' '))}</p>` : ''}</section>`;
}
{ const _vf = viewFilm; viewFilm = function (id) { const h = _vf.apply(this, arguments), f = S.films[id]; if (!f || typeof h !== 'string') return h; const x = filmStoryPanel(f); if (!x) return h; const i = h.indexOf('<section class="panel"><h3>Story of the production</h3>'); return i >= 0 ? h.slice(0, i) + x + h.slice(i) : h + x; }; }
// critics talk about the story: its structure, its ending, its world, its hero
{ const _fr = filmReviews; filmReviews = function (f) {
  const R = _fr.apply(this, arguments); if (!R || R.dnaDone) return R; R.dnaDone = 1;
  const d = dnaOfFilm(f); if (!d) return R;
  const r = hashRand(f.id * 1231 + 9), used = new Set();
  for (const v of R.list) { if (v.famous || v.mine || v.sc === null || r() > .55) continue; const t = dnaCrit(d, v.sc, r, used); if (t) v.q = t.replace(/^./, c => c.toUpperCase()); }
  return R; }; }
// trailers: the lines are the film's own dialogue, and the voice-over is its world and its hero
{ const _tp = trailerPlan2; trailerPlan2 = function (f) {
  const plan = _tp.apply(this, arguments); if (!Array.isArray(plan) || (typeof storyOf === 'function' && storyOf(f))) return plan;
  const d = dnaOfFilm(f); if (!d) return plan;
  const r = hashRand(f.id * 4243 + 1), c = filmCraft(f), used = new Set(), lines = [];
  for (const tag of ['setup', 'conflict', 'turn', 'reveal', 'payoff']) { const ex = wlText('exch', tag, { g: d.g, tone: d.tone, c, r, used }); for (const l of String(ex).split('\n')) { const m = /^(H|R|A):\s*(\([^)]*\))?\s*(.+)$/.exec(l.trim()); if (m && m[3].length < 90 && m[3].length > 8) { lines.push(dnaFill(m[3], d)); break; } } }
  const vo = dnaVO(d, c, r); let li = 0, vi = 0;
  for (const s of plan) { if (s.sub && lines[li]) s.sub = lines[li++]; else if (s.vo && vo[vi]) { s.text = vo[vi++]; s.ms = Math.max(s.ms || 0, 1500 + s.text.length * 30); } }
  return plan; }; }

// ---- awards: the speech ----
{ const _ms = milestone; milestone = function (t, kind) {
  const r0 = _ms.apply(this, arguments);
  if (kind === 'prize' && /^Won /.test(String(t)) && S.me && ME() && typeof inbox === 'function') {
    const f = S.films.slice(-4000).reverse().find(x => x && String(t).includes(x.title) && (x.dir === S.me.id || (x.cast || []).includes(S.me.id) || (x.xc && x.xc[S.me.id]))), sc = (S.me.scripts || []).find(x => String(t).includes(x.title));
    const d = f ? dnaOfFilm(f) : sc ? dnaOfScript(sc) : dnaMake({ seed: S.week * 31 + 1, genre: 'Drama', source: 'invent' });
    if (d) { const sp = dnaSpeech(Object.assign({}, d, { hero: Object.assign({}, d.hero, { n: ME().name.split(' ')[0] }) }), hashRand(S.week * 977 + String(t).length)); if (sp) inbox('note', 'What you said up there', `${t}. You had a speech folded in your pocket and didn't use it. What came out instead: “${sp}”`); }
  }
  return r0; }; }

// ---- the fashion for a structure ----
// When the year's biggest or best-reviewed films share a way of telling, the next year's films copy it.
function dnaTrendYear() {
  const y = S.year - 1, F = S.films.filter(f => f && f.rel !== null && !f.real && yearOf(f.rel) === y);
  if (F.length < 10) return;
  const top = F.slice().sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 15).concat(F.filter(f => (f.reviews || 0) >= 80).slice(0, 10)), n = {};
  for (const f of top) { const d = dnaOfFilm(f); if (d && d.trick !== 'linear') n[d.trick] = (n[d.trick] || 0) + 1; }
  const best = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] >= 3 && (!S.dnaTrend || S.dnaTrend.k !== best[0])) {
    S.dnaTrend = { k: best[0], y: S.year };
    const hit = top.find(f => dnaOfFilm(f) && dnaOfFilm(f).trick === best[0]);
    news('Business', `${(DNA_POOLS.tricks[best[0]] || [best[0]])[0]} is in fashion: after ${hit ? hit.title : 'last year\'s hits'}, the studios want films told that way.`, hit ? { film: hit.id } : undefined);
  } else if (S.dnaTrend && S.year - S.dnaTrend.y >= 3) S.dnaTrend = null;
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); if (!S.archiving) dnaTrendYear(); return r; }; }
{ const _gl = greenlight; greenlight = function (hub, o) {
  const f = _gl.apply(this, arguments);
  if (f && f.id !== undefined && !f.real && S.dnaTrend && hashRand(f.id * 389 + 77)() < .3) f.dt = S.dnaTrend.k;
  return f; }; }

// ---- works ----
// what a song is about is fixed at release: a theme from your voice and, when there is one, a person from your life
{ const _rw = releaseWork; releaseWork = function (a) {
  const M = S.me, n0 = (M.works || []).length, ok = _rw.apply(this, arguments);
  if (ok && (M.works || []).length > n0) {
    const w = M.works[M.works.length - 1], r = hashRand((w.id + 1) * 6007 + S.week);
    if (w.type === 'song' || w.type === 'musical') { const v = typeof voiceOf === 'function' ? voiceOf() : {}, top = Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]).filter(k => THEMES[k]); w.th = top.length && r() < .6 ? top[Math.floor(r() * top.length)] : THEME_KEYS[Math.floor(r() * THEME_KEYS.length)];
      const S0 = lifeSeeds().filter(s => s.id !== undefined); if (S0.length && r() < .55) { const s = S0[Math.floor(r() * S0.length)]; w.to = P(s.id).name.split(' ')[0]; w.toNote = s.note; } }
    if (w.type === 'play' || w.type === 'musical') w.dna = dnaMake({ seed: (w.id + 1) * 4409 + (M.id || 0), genre: w.type === 'musical' ? 'Musical' : r() < .4 ? 'Comedy' : 'Drama', source: 'mix', lang: (HUBS[M.hub] || {}).lang, city: (HUBS[M.hub] || {}).name });
  }
  return ok; }; }
function workCraft(w) { return clamp(((w.q || 50) - 25) / 65, 0, 1); }
function workStoryPanel(w) {
  const c = workCraft(w);
  if (w.type === 'song') {
    const L = songLyric(w, c), s = L.s, playing = SONG_PLAYER && SONG_PLAYER.w === w.id;
    return `<section class="panel"><h3>The song</h3><p class="small"><b>${esc(s.key)}</b> · ${s.bpm} bpm · ${esc(THEMES[s.th] || s.th)} · ${esc(TONES[s.mood] || s.mood)}${w.to ? ` · about ${esc(w.to)}` : ''}</p>
     <p class="chords">${s.chords.map(x => `<span class="chip">${esc(x)}</span>`).join(' ')} <span class="muted small">(${s.prog.join('–')})</span></p>
     <p><button class="btn-s" data-hk="songplay:${w.id}">${playing ? '■ Stop' : '▶ Play the chords'}</button></p>
     <div class="lyric">${L.parts.filter(p => p[1].length).map(([k, ls]) => `<p><b class="small muted">${k}</b><br>${ls.map(esc).join('<br>')}</p>`).join('')}</div>${w.toNote ? `<p class="small muted">${esc(w.toNote.replace(/The love interest has|The best friend is|The rival is|The mentor talks exactly like/, 'It\'s about'))}</p>` : ''}</section>`;
  }
  if (w.type === 'play' || w.type === 'musical') {
    const d = w.dna || dnaMake({ seed: (w.id + 1) * 4409, genre: w.type === 'musical' ? 'Musical' : 'Drama', source: 'invent' }), st = stageOf(w, d, c);
    return `<section class="panel"><h3>The play</h3><p>${esc(dnaLogline(d))}</p>${st.open ? `<p class="stage-dir"><i>${esc(st.open)}</i></p>` : ''}${st.mono ? `<blockquote class="mono"><b>${esc(d.hero.n.toUpperCase())}</b><br>${esc(st.mono)}</blockquote>` : ''}${st.dirs.map(x => `<p class="stage-dir small"><i>${esc(x)}</i></p>`).join('')}
     ${st.nums.length ? `<h4>The numbers</h4><ul class="plain small">${st.nums.filter(n => n[1]).map(([k, t]) => `<li><b>${{ open: 'Opening', want: 'The "I want" song', eleven: 'Eleven o\'clock number', finale: 'Finale' }[k]}:</b> ${esc(t)}</li>`).join('')}</ul>` : ''}
     <p class="small"><b>Ending:</b> ${esc(DNA_END_LABEL[d.endK])}. <i>${esc(dnaFill(d.arg, d))}</i></p>${d.life.length ? `<p class="small muted">From your life: ${esc(d.life.join(' '))}</p>` : ''}</section>`;
  }
  if (w.type === 'podcast') { const p = podOf(w, c); return `<section class="panel"><h3>The show</h3>${p.format ? `<p>${esc(p.format)}</p>` : ''}${p.hook ? `<p><b>This episode:</b> ${esc(p.hook)}</p>` : ''}${p.arc ? `<p class="small muted">The season: ${esc(p.arc)}</p>` : ''}</section>`; }
  if (w.type === 'video' || w.type === 'blip') { const v = vidOf(w, c); return `<section class="panel"><h3>The video</h3>${v.format ? `<p>${esc(v.format)}</p>` : ''}${v.hook ? `<p>It opens: <q>${esc(v.hook)}</q></p>` : ''}</section>`; }
  return '';
}
{ const _vw = viewWork; viewWork = function (id) { const h = _vw.apply(this, arguments), w = (S.me.works || []).find(x => x.id === +id); if (!w || typeof h !== 'string') return h; const x = workStoryPanel(w); if (!x) return h; const k = '<section class="panel"><h3>In the press</h3>'; return h.includes(k) ? h.replace(k, x + k) : h + x; }; }
CLICK_HOOKS.songplay = id => { const w = (S.me.works || []).find(x => x.id === +id); if (!w) return; if (SONG_PLAYER && SONG_PLAYER.w === w.id) songStop(); else songPlay(w); render(true); };
// leaving the song's page stops the music
{ const _rd = render; render = function () { const r = _rd.apply(this, arguments); if (SONG_PLAYER && typeof document !== 'undefined' && !document.querySelector(`[data-hk="songplay:${SONG_PLAYER.w}"]`)) songStop(); return r; }; }

// ---- styles ----
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.dna{border:1px solid var(--line,#ddd);border-radius:10px;padding:10px 12px;margin:0 0 14px;background:var(--panel2,transparent)}
.dna-r{display:grid;grid-template-columns:110px 1fr;gap:10px;padding:4px 0;border-top:1px dashed var(--line,#e5e5e5);font-size:13px}.dna-r:first-of-type{border-top:0}
.dna-r>span:first-child{color:var(--muted,#777);font-size:11px;text-transform:uppercase;letter-spacing:.06em;padding-top:2px}
.dna-life{margin-top:8px;padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--accent,#c84) 10%,transparent)}
.dna-ed{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}.dna-ed label{font-size:12px}
.dna-notes li{margin:4px 0}.lyric p{margin:0 0 10px;line-height:1.5}.chords .chip{font-weight:700}
.stage-dir{color:var(--muted,#666)}.mono{margin:10px 0;padding:8px 14px;border-left:3px solid var(--accent,#c84);font-family:Georgia,serif}
@media (max-width:560px){.dna-r{grid-template-columns:1fr;gap:2px}}`; document.head.appendChild(st); })();
