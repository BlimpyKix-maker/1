// The playtest troupe: many different players, each living a career for years through the same actions the buttons
// send, then saying what they thought. Every dream in the game gets a player; schooling, labs, contests, festivals,
// the short-film circuit, making work, producing and investing each get players who lean on them; play styles range
// from the grinder to the drifter who clicks anything.
// usage: node tools/troupe.js <index|list> [years] [outdir]   (index into PERSONAS; 'list' prints them)
// Each player writes <outdir>/troupe-<index>.json with:
//   - bugs: thrown errors, crashed pages and apps, stuck weeks, NaN stats;
//   - every action tried and how often the game said no;
//   - progress per year: level, credits, cash, the ladder rung in their field;
//   - path results: festivals, shorts, contests, labs, school, works;
//   - fun signals: quiet weeks, decisions per week, repeated messages;
//   - "opinions": complaints and praise derived from all of the above.
const fs = require('fs'), path = require('path');
const [ARG = '0', YEARS = 4, OUTDIR = '.'] = process.argv.slice(2);
const STYLES = ['grinder', 'social', 'maker', 'scholar', 'festival', 'contester', 'mogul', 'drifter', 'cautious', 'switcher'];
const HUBS = ['hollywood', 'newyork', 'london', 'paris', 'berlin', 'toronto', 'mumbai', 'seoul', 'tokyo', 'lagos', 'rio', 'sydney', 'mexico', 'stockholm', 'madrid', 'hongkong'];
const WEALTH = ['broke', 'scraping', 'gettingby', 'savings', 'comfortable', 'welloff', 'inheritance', 'trust', 'estranged', 'family'];
const EDU = ['self', 'filmdir', 'filmcam', 'filmpost', 'filmprod', 'drama', 'music', 'art', 'uni', 'business'];
const TRAITS = [['Charming', 'Workhorse'], ['Curious', 'Hustler'], ['Perfectionist', 'Loyal'], ['Bold', 'Charming'], ['Workhorse', 'Curious']];
// one player per dream, styles rotating; then players built around a path
function personas(dreams) {
  const L = dreams.map((d, i) => ({ dream: d, style: STYLES[i % STYLES.length], hub: HUBS[i % HUBS.length], wealth: WEALTH[(i * 3) % WEALTH.length], edu: EDU[(i * 7) % EDU.length] }));
  const add = (o) => L.push(Object.assign({ hub: HUBS[L.length % HUBS.length], wealth: WEALTH[(L.length * 3) % WEALTH.length], edu: EDU[(L.length * 7) % EDU.length] }, o));
  // schooling: each short programme, each university programme
  for (const p of ['short', 'cc', 'ba', 'mfa', 'union']) add({ dream: p === 'union' ? 'ad' : 'director', style: 'scholar', prog: p });
  for (const p of ['film', 'filmba', 'music', 'musicma', 'drama', 'animation', 'games', 'journalism', 'business']) add({ dream: { film: 'director', filmba: 'writer', music: 'musician', musicma: 'composer', drama: 'stageactor', animation: 'animator', games: 'gamedev', journalism: 'critic', business: 'producer' }[p], style: 'scholar', uni: p, wealth: 'comfortable' });
  // festivals and the short circuit, in every field that makes shorts or films
  for (const d of ['director', 'doc', 'animator', 'writer', 'dp', 'editor', 'mvdir', 'producer']) add({ dream: d, style: 'festival' });
  // competitions and contests
  for (const d of ['writer', 'showrunner', 'playwright', 'singer', 'podcaster', 'youtuber', 'standup', 'actor', 'composer', 'dp']) add({ dream: d, style: 'contester' });
  // labs and fellowships, in each field that has them
  for (const d of ['writer', 'director', 'actor', 'singer', 'composer', 'youtuber', 'podcaster', 'playwright', 'producer']) add({ dream: d, style: 'scholar', labs: 1 });
  // money styles at the extremes
  for (const w of ['broke', 'trust']) for (const d of ['actor', 'producer', 'rapper']) add({ dream: d, style: w === 'trust' ? 'mogul' : 'grinder', wealth: w });
  // chaos players
  for (const d of ['director', 'singer', 'streamer', 'magician', 'drag']) add({ dream: d, style: 'drifter' });
  return L;
}
const h = require(path.join(__dirname, 'harness.js')), r = s => h.run(s), J = s => JSON.parse(r(s));
const DREAMS = J('JSON.stringify(DREAMS.map(d => d.k))');
const P = personas(DREAMS);
if (ARG === 'list') { P.forEach((p, i) => console.log(i, JSON.stringify(p))); console.log(P.length, 'players'); process.exit(0); }
if (ARG === 'count') { console.log(P.length); process.exit(0); }
const idx = +ARG, T = P[idx]; if (!T) { console.error('no persona', idx); process.exit(1); }
let rs = 7 + idx * 7919; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647, pick = L => L[Math.floor(rnd() * L.length)];
const seed = 5000 + idx * 13;
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
// record what the player is shown
r(`globalThis.REC = [];
  const _inbox = inbox; inbox = function (kind, title, text, extra = {}) { const it = _inbox.apply(this, arguments); REC.push({ w: S.week, ch: 'inbox:' + kind, t: String((it && it.title) || title || '') + ' | ' + String((it && it.text) || text || '').slice(0, 200), dec: !!(extra.choices && extra.choices.length) }); return it; };
  const _sms = sms; sms = function (from, t, kind = 'text') { const out = _sms.apply(this, arguments); const m = S.me.phone[S.me.phone.length - 1]; if (m && from !== null && from !== undefined && from !== S.me.id) REC.push({ w: S.week, ch: 'text:' + kind, t: m.t }); return out; };
  const _mail = mail; mail = function (folder, from, subj, body, act) { REC.push({ w: S.week, ch: 'mail:' + folder, t: String(subj || '') + ' | ' + String(body || '').slice(0, 200), dec: !!act }); return _mail.apply(this, arguments); };`);
const D = J(`JSON.stringify(DREAM_BY['${T.dream}'])`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Troupe ${idx}', dream: '${T.dream}', role: '${D.role}', field: '${D.field}', wealth: '${T.wealth}', edu: '${T.edu}', hub: '${T.hub}', traits: ${JSON.stringify(TRAITS[idx % TRAITS.length])}, love: ['Drama', 'Comedy'] }) })`);
r(`partyAuto()`);
const bugs = [], acts = {};
// try an action: count the tries and the times the game said no
const act = (label, code) => { const a = acts[label] = acts[label] || { n: 0, ok: 0 }; a.n++; try { const v = r(code); if (v !== false && v !== 'false' && v !== undefined && v !== 'undefined' && v !== null) a.ok++; return v; } catch (e) { bugs.push({ w: weekNow(), kind: 'throw', where: label, msg: e.message, stack: String(e.stack || '').split('\n').slice(1, 4).join(' | ') }); return false; } };
const weekNow = () => { try { return +r('S.week'); } catch (e) { return -1; } };
const pickChoice = it => { const L = (it.choices || []).filter(c => !c.dis); if (!L.length) return null;
  if (it.kind === 'offer') return (T.style === 'cautious' && rnd() < .3 ? L.find(c => c.k === 'no') : L.find(c => c.k === 'yes')) ?.k || L[0].k;
  if (it.kind === 'broke') return (L.find(c => c.k === 'down') || L.find(c => c.k === 'borrow') || L[0]).k;
  const keep = L.filter(c => !/go home|give up|pack up|retire|leave the business|quit the business/i.test(c.label || ''));
  const M = keep.length ? keep : L; return (T.style === 'drifter' ? pick(M) : T.style === 'cautious' ? M[M.length - 1] : M[Math.floor(rnd() * Math.min(2, M.length))]).k; };
const answer = () => { for (let g = 0; g < 12; g++) { let L; try { L = J(`JSON.stringify(pending().map(it => ({ id: it.id, kind: it.kind, choices: (it.choices || []).map(c => ({ k: c.k, dis: !!c.dis, label: c.label })) })))`); } catch (e) { bugs.push({ w: weekNow(), kind: 'throw', where: 'pending', msg: e.message }); return; } if (!L.length) return; for (const it of L) { const k = pickChoice(it); if (k) act('decide:' + it.kind, `doAct({ t: 'pick', id: ${JSON.stringify(it.id)}, k: ${JSON.stringify(k)} })`); } } };
// open everything the player can open and look for crashes
const sweep = () => { try { const out = J(`(() => { const bad = []; const chk = (name, f) => { try { const s = String(f() || ''); const m = s.match(/(app|page) crashed: ([^<]*)/) || s.match(/Something broke[^<]*/); if (m) bad.push(name + ': ' + (m[2] || m[0])); } catch (e) { bad.push(name + ' THREW ' + e.message + ' ' + String(e.stack).split(String.fromCharCode(10))[1]); } };
    for (const [k] of APPS) chk('app:' + k, () => { UI.app = k; UI.osStack = []; UI.primer = { [k]: true }; return computerPanel(); });
    for (const k of Object.keys(APP_GUIDE)) chk('guide:' + k, () => { UI.primer = { [k]: true }; return primerHTML(k); });
    for (const t of ['today','feed','diary','phone','computer','work','create','compete','standing','life','people']) chk('tab:' + t, () => { UI.dtab = t; return viewDesk(); });
    chk('you', () => viewYou()); chk('me', () => viewPerson(S.me.id));
    for (const id of Object.keys(S.me.known).slice(0, 6)) chk('person', () => viewPerson(+id));
    for (const f of myFilms().slice(-3)) chk('film', () => viewFilm(f.id));
    if (S.me.company !== undefined && S.me.company !== null) chk('company', () => viewCompany(S.me.company));
    UI.app = null; UI.dtab = null; UI.primer = {}; return JSON.stringify(bad); })()`); for (const b of out) bugs.push({ w: weekNow(), kind: 'crash', msg: b }); } catch (e) { bugs.push({ w: weekNow(), kind: 'throw', where: 'sweep', msg: e.message }); } };
// the play styles
const DAY = { grinder: 'hunt', social: 'social', maker: 'make', scholar: 'craft', festival: 'make', contester: 'write', mogul: 'money', drifter: 'balanced', cautious: 'balanced', switcher: 'balanced' }[T.style];
const EVE = { grinder: 'grind', social: 'social', maker: 'culture', scholar: 'quiet', festival: 'culture', contester: 'quiet', mogul: 'social', drifter: 'social', cautious: 'quiet', switcher: 'social' }[T.style];
act('focus', `doAct({ t: 'focus', auto: true, day: '${DAY}', eve: '${EVE}' })`);
const workTypes = J(`JSON.stringify(Object.keys(WORK_TYPES).filter(k => { try { return workTypeOpen(k); } catch (e) { return false; } }))`);
const WEEKS = YEARS * 52, weekly = [], snaps = [], t0 = Date.now();
let enrolled = false, switched = 0;
for (let w = 0; w < WEEKS; w++) {
  if (r('!!S.me.over')) break;
  const n0 = +r('REC.length');
  answer();
  const style = T.style, M = s => r(s);
  // schooling
  if (T.prog && !enrolled && w >= 2) { enrolled = true; act('enrol:' + T.prog, `doAct({ t: 'enrol', prog: '${T.prog}', craft: ${T.prog === 'union' ? "'pro'" : 'MAIN[ME().role]'} })`); }
  if (T.uni && w % 13 === 3 && !r('!!S.me.school')) act('school:' + T.uni, `(() => { S.me.cash = Math.max(S.me.cash, 0); const L = SCHOOLS.filter(s => progsAt(s).includes('${T.uni}') && s[5] <= S.year); const s = L.find(s => s[1] === S.me.hub) || L[0]; if (!s) return false; return doAct({ t: 'school', school: s[0], prog: '${T.uni}', craft: SCHOOL_PROGS['${T.uni}'].crafts[0] }); })()`);
  if (style === 'scholar' && !T.prog && !T.uni && w % 26 === 5 && !r('!!S.me.school')) act('enrol:short', `doAct({ t: 'enrol', prog: 'short', craft: MAIN[ME().role] })`);
  // labs: anyone may try when one opens; scholars and lab players always do
  if ((T.labs || style === 'scholar' || style === 'festival' || rnd() < .25)) act('labapply', `(() => { const L = LABS.filter(l => labOpen(l) && labFits(l)); if (!L.length || S.me.lab) return null; return doAct({ t: 'labapply', k: L[0][0] }); })()`);
  // making work
  if (['maker', 'festival', 'contester', 'switcher'].includes(style) || rnd() < .15) {
    const pref = style === 'festival' ? ['short'] : workTypes;
    act('make', `(() => { if (S.me.make && S.me.make.ready) return doAct({ t: 'releasework', promo: ${style === 'cautious' ? 0 : 1} }); if (!S.me.make) { const ks = ${JSON.stringify(pref)}.filter(k => workTypeOpen(k)); if (!ks.length) return null; return doAct({ t: 'startwork', type: ks[${Math.floor(rnd() * 10)} % ks.length] }); } return doAct({ t: 'session', score: ${4 + Math.floor(rnd() * 7)} }); })()`);
  }
  // scripts for the writing-minded
  if ((['contester', 'maker'].includes(style) || ['writer', 'director', 'showrunner', 'playwright'].includes(T.dream)) && rnd() < .08) act('newscript', `doAct({ t: 'newscript', genre: '${pick(['Drama', 'Thriller', 'Comedy', 'Horror'])}', theme: 'family', tone: 'dark', premise: 'A ferryman refuses one last crossing.', hero: 'an old ferryman', setting: 'a flooded valley', notes: '${'He is afraid of the water. '.repeat(1 + Math.floor(rnd() * 12))}' })`);
  // competitions
  if (style === 'contester' || rnd() < .06) act('compete', `(() => { const L = COMPS.filter(c => compOpen(c) && !compEntered(c) && S.me.cash >= usd(c.fee)); if (!L.length) return null; const c = L[${Math.floor(rnd() * 50)} % L.length]; const sc = (S.me.scripts || []).find(x => x.grade); if (c.need === 'script' && !sc) return null; return doAct({ t: 'compete', k: c.k, script: sc && sc.id }); })()`);
  if (style === 'contester' && rnd() < .3) act('contest', `(() => { const sc = (S.me.scripts || []).find(x => x.grade); const C = CONTESTS.find(c => sc && !(sc.entered || []).includes(c.k)); if (!sc || !C) return null; return doAct({ t: 'contest', id: sc.id, c: C.k }); })()`);
  // festivals: shorts on the circuit, features at the big ones
  if (style === 'festival' || rnd() < .05) {
    act('shortsubmit', `(() => { const w = (S.me.works || []).filter(x => x.type === 'short' && x.circuit && S.week - x.rel <= 52).pop(); if (!w) return null; const F = Object.values(SHORT_FEST).filter(F => F.founded <= S.year && F.kind !== 'student' && !(F.kind === 'anim' && ME().sk.digi < 8) && !w.circuit.subs.some(s => s.k === F.k)); if (!F.length) return null; return doAct({ t: 'shortsubmit', w: w.id, fk: F.sort((a, b) => b.tier - a.tier)[0].k }); })()`);
    act('festival', `(() => { const f = myFilms().filter(f => festEligible(f)).pop(); if (!f) return null; const F = FESTIVALS.filter(F => (typeof festFits !== 'function' || festFits(F, f)) && !(S.me.fests || []).some(x => x.film === f.id && x.k === F.k)); if (!F.length) return null; return doAct({ t: 'festival', film: f.id, k: F[0].k }); })()`);
  }
  // producing and investing
  if (style === 'mogul' || T.dream === 'producer' || T.dream === 'mogul') {
    if (rnd() < .06) act('found', `(() => { if (S.me.company !== undefined && S.me.company !== null) return null; if (S.me.cash < 40000) return null; return doAct({ t: 'found', name: 'Troupe Pictures ${idx}' }); })()`);
    if (rnd() < .05) act('trade', `(() => { if (S.me.cash < 30000) return null; const c = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier <= 2)[${Math.floor(rnd() * 20)}]; if (!c) return null; return doAct({ t: 'trade', co: c.id, n: 10 }); })()`);
    if (rnd() < .04) act('selffund', `(() => { const sc = (S.me.scripts || []).find(x => x.grade && x.made === undefined); if (S.me.company === undefined || S.me.company === null || !sc || S.me.cash < 80000) return null; const L = castOptions(sc.genre), D = dirOptions(sc.genre); return doAct({ t: 'selffund', src: 'script', id: sc.id, micro: true, lead: L[0] && L[0].id, dir: D[0] && D[0].id }); })()`);
  }
  // people
  if ((style === 'social' ? .6 : style === 'grinder' ? .1 : .3) > rnd()) act('text', `(() => { const ids = aliveKnown().sort((a, b) => opinion(b) - opinion(a)); const s = upcomingSlots(10)[${Math.floor(rnd() * 10)}]; if (!ids.length || !s) return null; return doAct(Object.assign({ t: 'text', id: ids[${Math.floor(rnd() * 8)} % ids.length], kind: '${pick(['hi', 'coffee', 'drinks', 'mentor', 'hi'])}' }, s)); })()`);
  if (rnd() < .5) act('reply', `(() => { const m = (S.me.phone || []).slice().reverse().find(m => m.replyable && !m.replied && m.from !== null && m.from >= 0); if (!m) return null; const o = replyOptions(m); return doAct({ t: 'reply', mid: m.id, kind: o[${Math.floor(rnd() * 4)} % o.length] }); })()`);
  if (rnd() < .4) act('mail', `(() => { const m = (S.me.mail || []).find(m => m.act && !m.done); if (!m) return null; const o = m.act.opts ? m.act.opts.map(x => x[0]) : ['yes', 'yes', 'no']; return doAct({ t: 'mail', id: m.id, k: o[${Math.floor(rnd() * 3)} % o.length] }); })()`);
  // gigs and agents
  if (rnd() < .2) act('gigpitch', `(() => { const g = (S.me.briefs || []).find(b => !b.pitched); if (!g || S.me.gig) return null; return doAct({ t: 'gigpitch', id: g.id }); })()`);
  if (!r('!!S.me.agent') && rnd() < .05) act('query', `doAct({ t: 'query', ag: ${Math.floor(rnd() * 6)} })`);
  // style quirks
  if (style === 'drifter' && rnd() < .15) act('drift', `(() => { const k = ['move','vehicle','furnish','luck'][${Math.floor(rnd() * 4)}]; if (k === 'move') return doAct({ t: 'move', i: ${Math.floor(rnd() * 6)} }); if (k === 'vehicle') return doAct({ t: 'vehicle', v: '${pick(['bike', 'scooter', 'car', 'transit'])}' }); if (k === 'furnish') return doAct({ t: 'furnish', id: '${pick(['bed', 'desk', 'plant', 'poster', 'camera'])}' }); return null; })()`);
  if (style === 'switcher' && (w === 52 || w === 130) && switched < 2) { switched++; act('dream', `doAct({ t: 'dream', k: '${pick(DREAMS.filter(d => d !== T.dream))}' })`); }
  if (style === 'cautious' && w % 8 === 0) act('focus', `doAct({ t: 'focus', day: 'recover' })`), act('focus', `doAct({ t: 'focus', auto: true, day: 'balanced' })`);
  // live the week the way the space bar does
  const w0 = +r('S.week');
  for (let g = 0; g < 40 && +r('S.week') === w0 && !r('S.me.over'); g++) {
    answer();
    try { r(`(() => { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0 && !S.me.over; g++) { autoBeforeStep(); if (pending().length) return; doAct(endWeekAct('next')); } })()`); }
    catch (e) { bugs.push({ w, kind: 'throw', where: 'step', msg: e.message, stack: String(e.stack || '').split('\n').slice(1, 4).join(' | ') }); break; }
  }
  if (+r('S.week') === w0 && !r('S.me.over')) bugs.push({ w, kind: 'stuck', msg: r('JSON.stringify(pending().map(x => [x.kind, x.title]))') });
  if (w % 13 === 6) sweep();
  const nan = J(`JSON.stringify(['cash','energy','stress'].filter(k => !Number.isFinite(S.me[k])).concat(Number.isFinite(ME().standing) ? [] : ['standing']))`); if (nan.length) bugs.push({ w, kind: 'nan', msg: nan.join(',') });
  const recs = J(`JSON.stringify(REC.slice(${n0}).map(x => [x.ch, x.dec ? 1 : 0]))`);
  weekly.push({ n: recs.length, dec: recs.filter(x => x[1]).length + J(`JSON.stringify(0)`), cash: Math.round(+r('S.me.cash')) });
  if (w % 52 === 51) snaps.push(J(`JSON.stringify({ y: S.year, level: careerLevel(), credits: ME().credits.length, standing: Math.round(ME().standing), fame: Math.round(ME().fame || 0), cash: Math.round(S.me.cash), field: S.me.field, rung: typeof pathRung === 'function' ? pathRung(S.me.field || 'film') : null, works: (S.me.works || []).length, fol: Math.round(S.me.fol || 0), known: Object.keys(S.me.known).length, stress: Math.round(S.me.stress), energy: Math.round(S.me.energy) })`));
  if (bugs.length > 60) break;
}
sweep();
const final = J(`JSON.stringify((() => { const M = S.me, me = ME(); const shorts = (M.works || []).filter(w => w.type === 'short');
  return { week: S.week, over: !!M.over, field: M.field, dream: M.dream, level: careerLevel(), credits: me.credits.length, cash: Math.round(M.cash), standing: Math.round(me.standing),
    fests: { n: (M.fests || []).length, done: (M.fests || []).filter(x => x.done).length, sel: (M.fests || []).filter(x => x.sel).length, won: (M.fests || []).filter(x => x.won || x.prize).length },
    shorts: { made: shorts.length, subs: shorts.reduce((t, w) => t + ((w.circuit && w.circuit.subs) || []).length, 0), sel: shorts.reduce((t, w) => t + ((w.circuit && w.circuit.subs) || []).filter(s => s.sel || s.res === 'sel' || s.ok).length, 0), laurels: shorts.reduce((t, w) => t + ((w.circuit && w.circuit.laurels) || []).length, 0) },
    comps: { n: (M.comps || []).length, places: (M.comps || []).map(e => e.place || '-') }, contests: (M.contests || []).map(c => c.c + ':' + (c.res || c.place || c.result || '?')),
    labs: { tried: Object.keys(M.labTried || {}).length, done: (M.labs || []).length, now: M.lab ? M.lab.k : null },
    school: M.school ? M.school.prog || M.school.at : null, schoolApps: Object.keys(M.schoolApp || {}).length,
    works: (M.works || []).map(w => w.type + (w.rel !== undefined ? '' : '(unreleased)')), fol: Math.round(M.fol || 0), company: M.company,
    milestones: (M.milestones || []).map(m => m.t || m.title || m), agent: !!M.agent, pdeals: (M.pdeals || []).map(d => d.k), dreamLog: (M.dreamLog || []).map(d => d.k) }; })())`);
const rec = J('JSON.stringify(REC.map(x => x.t))');
// opinions: what this player would say, worked out from what happened to them
const shape = t => String(t).replace(/\$?[\d,.]+[kKmM%]?/g, '#').replace(/\b[A-Z][a-z]+( [A-Z][a-z]+)*/g, '@').toLowerCase().replace(/\s+/g, ' ').trim();
const counts = {}; for (const t of rec) { const s = shape(t); counts[s] = (counts[s] || 0) + 1; }
const repeats = Object.entries(counts).filter(([, n]) => n >= 6).sort((a, b) => b[1] - a[1]).slice(0, 8);
const quiet = weekly.filter(x => x.n === 0).length / Math.max(1, weekly.length), decPW = weekly.reduce((t, x) => t + x.dec, 0) / Math.max(1, weekly.length);
const broke = weekly.filter(x => x.cash < 0).length / Math.max(1, weekly.length);
const op = [];
const lv = snaps.map(s => s.level), rung = snaps.map(s => s.rung);
if (lv.length >= 2 && lv[lv.length - 1] === lv[0]) op.push(`Stuck at level ${lv[0]} for ${lv.length} years.`);
if (rung.length >= 2 && rung[rung.length - 1] === rung[0]) op.push(`Never climbed a step on the ${final.field} ladder.`);
if (broke > .25) op.push(`In the red ${Math.round(broke * 100)}% of weeks.`);
if (quiet > .2) op.push(`${Math.round(quiet * 100)}% of weeks nothing happened at all.`);
if (decPW < .3) op.push(`Few real decisions: ${decPW.toFixed(2)} a week.`);
for (const [k, a] of Object.entries(acts)) if (a.n >= 6 && a.ok / a.n < .15 && !/^decide/.test(k)) op.push(`Kept trying "${k}" (${a.n}x) and it almost never went through (${a.ok}).`);
if (T.style === 'festival' && final.shorts.made && !final.shorts.sel && final.shorts.subs >= 4) op.push(`Sent shorts to ${final.shorts.subs} festivals, never selected.`);
if (T.style === 'festival' && !final.shorts.made) op.push('Wanted the festival circuit but never got a short made.');
if (T.labs && final.labs.tried >= 3 && !final.labs.done && !final.labs.now) op.push(`Applied to ${final.labs.tried} labs, never got in.`);
if ((T.prog || T.uni) && !final.school && !final.milestones.some(m => /graduat|certificate|degree|diploma/i.test(m))) op.push('Tried to go to school and have nothing to show for it.');
if (T.style === 'contester' && final.comps.n >= 5 && !final.comps.places.some(p => p === 'win' || p === 'final' || p === 'place')) op.push(`Entered ${final.comps.n} competitions, never placed.`);
for (const [s, n] of repeats.slice(0, 3)) op.push(`Saw "${s.slice(0, 80)}" ${n} times.`);
if (!op.length) op.push('No complaints: it kept moving.');
const good = [];
if (lv.length && lv[lv.length - 1] > lv[0]) good.push(`Went from level ${lv[0]} to ${lv[lv.length - 1]}.`);
if (final.labs.done) good.push(`Got into ${final.labs.done} lab(s).`);
if (final.shorts.sel || final.shorts.laurels) good.push(`Shorts selected or laurelled: ${final.shorts.sel + final.shorts.laurels}.`);
if (final.fests.sel) good.push(`Festival selections: ${final.fests.sel}.`);
const out = path.join(OUTDIR, `troupe-${idx}.json`);
fs.writeFileSync(out, JSON.stringify({ idx, T, ms: Date.now() - t0, bugs, acts, snaps, final, quiet, decPW, broke, repeats, opinions: op, praise: good }, null, 1));
console.log(`#${idx} ${T.dream}/${T.style}${T.prog ? '/' + T.prog : ''}${T.uni ? '/' + T.uni : ''}: ${bugs.length} bugs, level ${final.level}, ${Math.round((Date.now() - t0) / 1000)}s | ${op.slice(0, 3).join(' ')}`);
