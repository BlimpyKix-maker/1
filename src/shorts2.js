// ---------------- The shorts scene: a class every year, and your place in it ----------------
// Every January a new class of emerging filmmakers appears in each film city: young directors, writers, actors and
// crew with almost no credits, and each director makes a short with people from their class. Those shorts go round
// the same festivals as yours, in the same line-ups. Winners collect laurels; in September the ones with real
// momentum break out (a first feature greenlit, a career-making part), and after three years the ones who never
// got a laurel start drifting home. Television hires from the breakouts.
// Your own shorts are made like real ones now: a kind, a budget, and collaborators from your own class who get
// credited, remember it, and rise (or don't) alongside you. A premiere is an event; a win can become a feature.
const SHORT_KINDS = { drama: ['Drama', 'Drama'], comedy: ['Comedy', 'Comedy'], horror: ['Horror', 'Horror'], doc: ['Documentary', 'Documentary'], anim: ['Animation', 'Animation'], exp: ['Experimental', 'Drama'] };
const SHORT_BUDGETS = [['Micro: friends, favours, one location', 400, 0], ['Standard: a real crew for a weekend', 1800, 4], ['Ambitious: a proper shoot, kit and a mix', 6000, 8]];
function scState() { return S.sc || (S.sc = { y: null, classes: {}, shorts: [], fests: {}, out: {}, broke: {} }); }
function scShortsBy(pid) { return scState().shorts.filter(x => x.by === pid || (x.crew || []).includes(pid)); }
function scClassOf(pid) { const C = scState().classes; for (const y in C) if (C[y].includes(pid)) return +y; return null; }
// a new class each year: the young and uncredited in every major city
function scMakeClass(y) {
  const sc = scState(); if (sc.classes[y]) return;
  const all = [];
  for (const h of HUB_IDS.filter(h => !HUBS[h].minor)) {
    const L = S.people.filter(p => p.hub === h && !p.dead && !p.retired && !p.player && S.year - p.born <= 32 && (p.credits || []).length <= 1 && ['director', 'writer', 'actor', 'dp', 'editor', 'composer'].includes(p.role) && !sc.out[p.id]);
    L.sort((a, b) => hashRand(a.id * 31 + y)() - hashRand(b.id * 31 + y)());
    const dirs = L.filter(p => p.role === 'director' || p.role === 'writer').slice(0, 4), rest = L.filter(p => !dirs.includes(p)).slice(0, 8);
    for (const d of dirs) {
      const r = hashRand(d.id * 977 + y), crew = rest.filter(() => r() < .35).slice(0, 3).map(p => p.id), kinds = Object.keys(SHORT_KINDS), kind = kinds[Math.floor(r() * kinds.length)];
      const sk = (d.c.dir || 8) * .6 + (d.c.wri || 8) * .4 + crew.reduce((t, id) => t + (P(id).sk ? 1 : 0), 0);
      const q = clamp(Math.round(sk * 3.3 + 18 + (r() - .5) * 30 + crew.length * 2), 15, 95);
      sc.shorts.push({ id: 'n' + y + '_' + d.id, by: d.id, crew, title: shortTitle(d.id * 13 + y), q, kind, hub: h, y, laur: [] });
      all.push(d.id, ...crew);
    }
  }
  sc.classes[y] = [...new Set(all)];
  // old, laurel-less records fall away
  sc.shorts = sc.shorts.filter(x => x.y >= y - 6 || x.laur.length);
  for (const k in sc.classes) if (+k < y - 12) delete sc.classes[k];
}
// festival line-ups: your short, if it got in, against the class
function scFestMonth() {
  const sc = scState(), M = S.me, mo = dateOf(S.week).getUTCMonth();
  for (const F of Object.values(SHORT_FEST)) {
    if (F.month !== mo || sc.fests[F.k + ':' + S.year] || F.founded > S.year) continue;
    // each short only goes to some festivals (mostly in its own region), and a short that has already won a lot starts to lose to the new thing
    const reg = h => (HUBS[h] || {}).region, entered = x => hashRand(x.by * 131 + F.k.charCodeAt(0) * 7 + F.k.length * 977 + x.y)() < (reg(x.hub) === reg(F.hub) ? .45 : .14);
    const cand = sc.shorts.filter(x => x.y >= S.year - 1 && (F.kind === 'all' || F.kind === 'student' || x.kind === F.kind || (F.kind === 'genre' && x.kind === 'horror') || (F.kind === 'comedy' && x.kind === 'comedy')) && x.q >= SF_BAR[F.tier] - 12 && entered(x));
    const score = x => x.q + (hashRand(x.by * 7 + F.k.length * 131 + S.year + F.month * 17)() - .5) * 30 - x.laur.filter(l => l.won).length * 5 + (reg(x.hub) === reg(F.hub) ? 3 : 0);
    const L = cand.map(x => [x, score(x)]).sort((a, b) => b[1] - a[1]).slice(0, [0, 8, 10, 12][F.tier]);
    // your entry, if it was selected there this year
    const mine = (M.works || []).filter(w => w.type === 'short' && w.circuit).map(w => [w, w.circuit.subs.find(s => s.k === F.k && s.done && S.year - yearOf(s.due) <= 0)]).find(([w, s]) => s && (s.res === 'selected' || s.res === 'won'));
    const youWon = mine && mine[1].res === 'won';
    const rec = { lineup: L.map(([x]) => x.id), winner: null, you: mine ? mine[0].id : null, youWon };
    if (L.length && !youWon) { const [x] = L[0]; rec.winner = x.id; x.laur.push({ k: F.k, won: 1, y: S.year }); const d = P(x.by); if (d) { d.standing = clamp(d.standing + [0, 3, 2, 1][F.tier], 0, 100); d.fame = clamp((d.fame || 0) + [0, 2, 1, .5][F.tier], 0, 100); }
      if (F.tier <= 2) news('Festival', `${x.title}, a short by ${d ? d.name : 'a newcomer'}, wins the ${F.prize} at ${F.name}.`, { person: x.by });
      // they beat you
      if (mine && d) { meet(d.id, `Beat you at ${F.name}`, -1); sms(d.id, pickLine([`we were in the same programme at ${F.name}! loved yours. sorry about the prize 😬`, `saw your short at ${F.name}. we should make something together`, `well that was a weird night. drink?`], d.id + S.week), 'text'); } }
    for (const [x] of L.slice(youWon ? 0 : 1)) x.laur.push({ k: F.k, y: S.year });
    sc.fests[F.k + ':' + S.year] = rec;
  }
}
// September: breakouts. January: the ones who drift away.
function scBreakouts() {
  const sc = scState(), M = S.me, me = ME();
  const hot = sc.shorts.filter(x => x.y >= S.year - 2 && !sc.broke[x.by] && (x.laur.filter(l => l.won).length >= 1 && x.laur.length >= 3 || x.laur.filter(l => l.won).length >= 2));
  for (const x of hot.slice(0, 12)) {
    const d = P(x.by); if (!d || d.dead || d.retired) continue; sc.broke[x.by] = S.year;
    d.standing = clamp(d.standing + 6, 0, 100); d.fame = clamp((d.fame || 0) + 4, 0, 100);
    if (d.role === 'director' || d.role === 'writer') { try { greenlight(x.hub, { dir: d.id, genre: SHORT_KINDS[x.kind][1] }); } catch (e) { /* a full slate: next year */ } }
    for (const id of x.crew) { const q = P(id); if (q) { q.standing = clamp(q.standing + 3, 0, 100); sc.broke[id] = sc.broke[id] || S.year; } }
    news('Career', `From shorts to features: ${d.name}, whose short ${x.title} swept the festivals, has a first feature greenlit.`, { person: d.id });
    if (M.known[d.id]) { const o = opinion(d.id); sms(d.id, o > 10 ? pickLine([`it's happening. they're letting me make a feature. I want people I trust on it. you in?`, `first feature!! greenlit!! I'm going to need you`], d.id + S.week) : `can't believe it. first feature. thanks for being part of the scene`, 'text');
      if (o > 10 && typeof makeLead === 'function') { const f = S.active.map(i => S.films[i]).find(f => f && f.dir === d.id && f.stage <= 2); if (f) makeLead(d.id, f); } }
  }
}
function scEbb() {
  const sc = scState();
  for (const y in sc.classes) { if (+y !== S.year - 3) continue;
    for (const id of sc.classes[y]) { const p = P(id); if (!p || p.dead || p.retired || sc.broke[id] || sc.out[id]) continue;
      const laur = scShortsBy(id).reduce((t, x) => t + x.laur.length, 0);
      if (laur || (p.credits || []).length >= 2 || hashRand(id * 53 + S.year)() > .4) continue;
      sc.out[id] = S.year; p.retired = true; p.retY = S.year;
      if (S.me.known[id] && opinion(id) > 0) sms(id, pickLine(['I\'m going home. gave it three years. no regrets, mostly', 'taking a teaching job back home. come visit?', 'I\'m out. it was fun. it was also rent'], id + S.week), 'text');
    } }
}
// your premieres
function scPremieres() {
  const M = S.me;
  for (const w of (M.works || []).filter(x => x.type === 'short' && x.circuit && !x.circuit.over)) for (const s of w.circuit.subs) {
    if (!s.done || s.prem || !(s.res === 'selected' || s.res === 'won')) continue; s.prem = 1;
    const F = SHORT_FEST[s.k]; if (!F || F.tier > 2 || pending().some(it => it.kind === 'premiere')) continue;
    inbox('premiere', `${w.title} at ${F.name}`, `${w.title} screens at ${F.name} in ${hubName(F.hub)}${s.res === 'won' ? ', and it won' : ''}. The programmers want you there for the Q&A.`, { work: w.id, fest: F.k, choices: [{ k: 'qa', label: `Go, and do the Q&A · ${checkLabel('cha', 12)}`, check: ['cha', 12] }, { k: 'net', label: 'Go, and work the parties' }, { k: 'skip', label: 'Stay home and work' }] });
  }
}
function scPick(it, k) {
  if (it.kind === 'premiere') { const M = S.me, me = ME(), F = SHORT_FEST[it.fest]; it.done = true;
    if (k === 'qa') { M.cash -= usd(F.hub === M.hub ? 80 : 700); const ok = roll('cha', 12); if (ok) { me.standing = clamp(me.standing + 1.5, 0, 100); me.fame = clamp((me.fame || 0) + 1, 0, 100); const q = youngNPC(F.hub, 'producer'); if (q) meet(q.id, `Saw your Q&A at ${F.name}`, 10); it.result = { ok, roll: M.lastRoll, t: `The room laughs in the right places. A producer finds you in the bar afterwards${q ? `: ${q.name}` : ''}.` }; } else it.result = { ok, roll: M.lastRoll, t: 'You freeze on the first question and ramble through the second. The film did the talking, at least.' }; return true; }
    if (k === 'net') { M.cash -= usd(F.hub === M.hub ? 80 : 700); M.energy = clamp(M.energy - 10, 0, 100); const L = (scState().classes[S.year] || []).filter(id => P(id) && !M.known[id]).slice(0, 2); for (const id of L) meet(id, `Met at ${F.name}`, 8); it.result = { t: L.length ? `Three parties, two hangovers, and new friends in your class: ${L.map(id => P(id).name).join(' and ')}.` : 'Three parties and a lot of business cards.' }; return true; }
    it.result = { t: 'You skip it. The film screens without you.' }; return true; }
  if (it.kind === 'shortfeat') { it.done = true; const M = S.me, me = ME(), w = (M.works || []).find(x => x.id === it.work);
    if (k === 'yes' && w) { scFeature(w); it.result = { t: `${w.title}: the feature is on your Create page. Write it, pitch it, or make it yourself.` }; } else it.result = { t: 'It stays a short.' }; return true; }
  return false;
}
function scFeature(w) { const M = S.me, me = ME(); if (w.featured) return; w.featured = 1;
  (M.holdings = M.holdings || []).push({ id: M.seq++, writer: me.id, title: w.title, genre: SHORT_KINDS[w.kind || 'drama'] ? SHORT_KINDS[w.kind || 'drama'][1] : 'Drama', theme: (topThemes(voiceOf())[0]) || 'love', score: clamp(w.q, 50, 95), price: 0, w: S.week, from: S.week, to: S.week + (typeof OPTION_WEEKS !== 'undefined' ? OPTION_WEEKS * 2 : 104), pitched: {}, fromShort: w.id });
  milestone(`${w.title} becomes a feature project`, 'work'); }
// a dev deal on a short now actually starts the feature
{ const _sp = shortPick; shortPick = function (it, k) { const r = _sp(it, k); if (r && it.kind === 'shortdev' && k === 'yes') { const w = (S.me.works || []).find(x => x.id === it.work); if (w) scFeature(w); } return r; }; }
function shorts2Week() {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  const sc = scState(); if (sc.y !== S.year) { scMakeClass(S.year); sc.y = S.year; scEbb(); }
  if (dateOf(S.week).getUTCDate() <= 7) scFestMonth();
  if (dateOf(S.week).getUTCMonth() === 8 && dateOf(S.week).getUTCDate() <= 7 && sc.bY !== S.year) { sc.bY = S.year; scBreakouts(); }
  scPremieres();
  // a strong winner of yours can become a feature, even without a producer asking
  for (const w of (M.works || []).filter(x => x.type === 'short' && !x.featured && !x.featAsk && x.q >= 76 && x.circuit && x.circuit.laurels.some(l => l.won && SHORT_FEST[l.k] && SHORT_FEST[l.k].tier <= 2))) { w.featAsk = 1; inbox('shortfeat', `${w.title} could be a feature`, `${w.title} keeps winning. Everyone who sees it asks the same thing: what happens next? You could turn it into a feature project.`, { work: w.id, choices: [{ k: 'yes', label: 'Start the feature version' }, { k: 'no', label: 'Leave it as it is' }] }); }
}
// ---- making yours properly ----
function shortCrewCands() { const M = S.me; return aliveKnown().filter(id => { const p = P(id); return p && S.year - p.born <= 40 && ['actor', 'dp', 'editor', 'composer', 'writer', 'director', 'designer', 'sound'].includes(p.role); }).sort((a, b) => opinion(b) - opinion(a)).slice(0, 40); }
{ const _sw = startWork;
  startWork = function (a) {
    const ok = _sw(a); const M = S.me;
    if (ok && a.type === 'short' && a.plan) { const C = shortCrewCands(), pl = a.plan;
      M.make.plan = { kind: SHORT_KINDS[pl.kind] ? pl.kind : 'drama', budget: clamp(+pl.budget || 0, 0, 2), crew: (pl.crew || []).filter(c => C.includes(+c.id)).slice(0, 3).map(c => ({ id: +c.id, role: String(c.role).slice(0, 20) })) }; }
    return ok;
  };
}
{ const _rw = releaseWork;
  releaseWork = function (a) {
    const M = S.me, plan = M.make && M.make.type === 'short' ? M.make.plan : null, n0 = (M.works || []).length;
    if (plan && M.cash < usd(SHORT_BUDGETS[plan.budget][1]) - usd(1800)) return false;
    const r = _rw(a); if (!r || !plan) return r;
    const w = M.works[n0]; if (!w) return r;
    const extra = usd(SHORT_BUDGETS[plan.budget][1]) - usd(1800); M.cash -= extra; w.cost = (w.cost || 0) + extra;
    const crewQ = plan.crew.reduce((t, c) => { const p = P(c.id); return t + (p ? clamp(((p.c[MAIN[p.role]] || 8) - 9) * .9, -2, 6) : 0); }, 0);
    w.q = clamp(Math.round(w.q + SHORT_BUDGETS[plan.budget][2] + crewQ), 3, 98); w.kind = plan.kind; w.crew = plan.crew;
    // only festivals that take this kind of film
    if (w.circuit) { const n0 = w.circuit.subs.length; w.circuit.subs = w.circuit.subs.filter(x => { const F = SHORT_FEST[x.k]; return F && !(F.kind === 'anim' && w.kind !== 'anim') && !(F.kind === 'doc' && w.kind !== 'doc') && !(F.kind === 'genre' && !['horror', 'exp'].includes(w.kind)) && !(F.kind === 'comedy' && w.kind !== 'comedy'); }); M.cash += usd(45) * (n0 - w.circuit.subs.length); }
    for (const c of plan.crew) { const p = P(c.id); if (!p) continue; addTie(ME(), p, 6); meet(c.id, `Made ${w.title} together`, 0); if (typeof remember === 'function') remember(c.id, 8, `You made ${w.title} together`, true); p.standing = clamp(p.standing + .5, 0, 100); }
    return r;
  };
}
function shortMakeHTML() {
  const M = S.me, C = shortCrewCands(), sel2 = (id, label) => `<label><span>${label}</span><select id="${id}"><option value="">Nobody</option>${C.map(x => `<option value="${x}">${esc(P(x).name)} · ${esc((P(x).occ || ROLE_LABEL[P(x).role] || '').toLowerCase())}</option>`).join('')}</select></label>`;
  if (M.make) return `<p>You're making ${M.make.type === 'short' ? 'a short' : 'something'} already: <b>${esc(M.make.title)}</b>${M.make.plan ? ` (${SHORT_KINDS[M.make.plan.kind][0].toLowerCase()}, ${M.make.plan.crew.length} collaborator${M.make.plan.crew.length === 1 ? '' : 's'})` : ''}. Book "Make things" blocks in your week to finish it, then release it from Create.</p>`;
  return `<section class="panel"><h3>Make a short</h3><p class="small muted">Choose what kind, how much to spend, and who you make it with. Good collaborators lift the film, get a credit, and remember it: some of them will be running sets in five years.</p>
   <div class="filt"><label><span>Title</span><input id="sp-title" placeholder="Optional"></label><label><span>Kind</span><select id="sp-kind">${Object.entries(SHORT_KINDS).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>
   <label><span>Budget</span><select id="sp-budget">${SHORT_BUDGETS.map(([l, c], i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${esc(l)} (${fmtCash(usd(c))})</option>`).join('')}</select></label></div>
   <div class="filt">${sel2('sp-c1', 'Camera')}${sel2('sp-c2', 'Lead actor')}${sel2('sp-c3', 'Edit or music')}</div>
   ${C.length ? '' : '<p class="small muted">You don\'t know many people your age in the business yet. Festivals, classes and nights out fix that.</p>'}
   <p><button class="btn" data-spstart="1">Start shooting</button></p></section>`;
}
function sceneHTML() {
  const M = S.me, sc = scState(), y = S.year, cls = sc.classes[y] || [], mine = new Set([M.id]);
  const row = x => { const d = P(x.by), w = x.laur.filter(l => l.won).length; return `<tr><td>${d ? pl(x.by) : '—'}${M.known[x.by] ? ' <span class="chip small">you know them</span>' : ''}</td><td><i>${esc(x.title)}</i> <span class="muted small">${esc(SHORT_KINDS[x.kind][0].toLowerCase())}, ${esc(hubName(x.hub))}</span></td><td class="n">${x.q}</td><td class="n">${x.laur.length}${w ? ` <b class="good">(${w} won)</b>` : ''}</td><td class="small">${sc.broke[x.by] ? '<b class="good">broke out</b>' : sc.out[x.by] ? '<span class="muted">went home</span>' : 'on the circuit'}</td></tr>`; };
  const cur = sc.shorts.filter(x => x.y >= y - 1).sort((a, b) => b.laur.length - a.laur.length || b.q - a.q);
  const local = cur.filter(x => x.hub === M.hub), rest = cur.filter(x => x.hub !== M.hub).slice(0, 15);
  const brk = Object.entries(sc.broke).filter(([, yy]) => yy >= y - 3).map(([id]) => +id).filter(id => P(id)).slice(-12).reverse();
  const myS = (M.works || []).filter(w => w.type === 'short' && w.rel !== undefined && S.year - yearOf(w.rel) <= 1);
  const fests = Object.entries(sc.fests).filter(([k]) => k.endsWith(':' + y)).map(([k, r]) => [SHORT_FEST[k.split(':')[0]], r]).filter(([F]) => F);
  return `<section class="panel"><h3>The class of ${y}</h3><p class="small muted">${cls.length} young filmmakers across the major film cities, making shorts with each other this year. The ones who win break out in September; the ones who don't, after three years, start going home.</p>
   ${myS.length ? `<p>Your shorts this year: ${myS.map(w => `<b>${esc(w.title)}</b> (${w.q}${w.circuit ? `, ${w.circuit.laurels.length} laurel${w.circuit.laurels.length === 1 ? '' : 's'}` : ''})`).join(', ')}.</p>` : ''}
   <h4>In ${esc(hubName(M.hub))}</h4><div class="tw"><table class="grid small"><thead><tr><th>Filmmaker</th><th>Short</th><th class="n">Quality</th><th class="n">Laurels</th><th>Status</th></tr></thead><tbody>${local.map(row).join('') || '<tr><td colspan="5" class="empty">No class here yet.</td></tr>'}</tbody></table></div>
   <h4>Elsewhere</h4><div class="tw"><table class="grid small"><tbody>${rest.map(row).join('')}</tbody></table></div>
   ${fests.length ? `<details><summary><b>Line-ups this year</b> <span class="muted small">(${fests.length} festivals)</span></summary><ul class="plain small">${fests.map(([F, r]) => `<li><b>${esc(F.name)}</b>: ${r.youWon ? '<b class="good">you won</b>' : r.winner ? `won by <i>${esc((sc.shorts.find(x => x.id === r.winner) || {}).title || '?')}</i>${r.you !== null ? ' <span class="bad">(you were in it)</span>' : ''}` : 'no award'} · ${r.lineup.length} shorts</li>`).join('')}</ul></details>` : ''}
   ${brk.length ? `<h4>Recent breakouts</h4><p class="small">${brk.map(id => `${pl(id)} <span class="muted">(${esc(ROLE_LABEL[P(id).role].toLowerCase())}, ${sc.broke[id]})</span>`).join(' · ')}</p>` : ''}</section>`;
}
{ const _sa = shortsApp;
  shortsApp = function () {
    const t = UI.sht; const mineTab = t === 'scene' || t === 'make';
    if (mineTab) UI.sht = 'fests'; let h = _sa(); if (mineTab) UI.sht = t;
    const i = h.indexOf('<p class="bf-row">'), j = h.indexOf('</p>', i);
    let row = h.slice(i, j).replace(/ on"/g, '"');
    if (!mineTab) row = h.slice(i, j);
    row += `<button class="pill${t === 'scene' ? ' on' : ''}" data-sht="scene">🌱 The class</button><button class="pill${t === 'make' ? ' on' : ''}" data-sht="make">🎬 Make one</button>`;
    const body = mineTab ? (t === 'scene' ? sceneHTML() : shortMakeHTML()) : h.slice(j + 4, h.lastIndexOf('</div>'));
    return `<div class="shorts">${row}</p>${body}</div>`;
  };
}
function shorts2Click(t) {
  if (!t.dataset.spstart) return false; const v = id => ($('#' + id) || {}).value || '';
  const crew = [['sp-c1', 'Camera'], ['sp-c2', 'Lead actor'], ['sp-c3', 'Edit/music']].filter(([id]) => v(id)).map(([id, role]) => ({ id: +v(id), role }));
  const ok = doAct({ t: 'startwork', type: 'short', title: v('sp-title'), plan: { kind: v('sp-kind') || 'drama', budget: +v('sp-budget') || 0, crew } });
  if (!ok) inbox('note', 'Couldn\'t start it', 'You\'re already making something, or short films aren\'t open to you yet.');
  render(true); return true;
}
// their shorts on their own pages
{ const _vp = viewPerson; viewPerson = function (id) { const h = _vp(id), L = S.sc ? scShortsBy(id) : []; if (!L.length) return h; const x = `<section class="panel"><h3>Shorts</h3><ul class="plain small">${L.map(s => `<li><i>${esc(s.title)}</i> (${s.y}, ${esc(SHORT_KINDS[s.kind][0].toLowerCase())})${s.by === id ? '' : ' · crew'}${s.laur.length ? ` · ${s.laur.length} festival${s.laur.length > 1 ? 's' : ''}${s.laur.some(l => l.won) ? ', 🏆' : ''}` : ''}</li>`).join('')}</ul>${S.sc.broke[id] ? `<p class="small good">Broke out in ${S.sc.broke[id]}.</p>` : S.sc.out[id] ? `<p class="small muted">Left the business in ${S.sc.out[id]}.</p>` : scClassOf(id) ? `<p class="small muted">Class of ${scClassOf(id)}.</p>` : ''}</section>`; const i = h.indexOf('<h3>Filmography</h3>'); return i < 0 ? h + x : h.slice(0, i) + x + h.slice(i); }; }
