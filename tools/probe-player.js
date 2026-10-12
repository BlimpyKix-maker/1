// Player probe: plays a career with a policy bot and records what the player actually experiences each week.
// usage: node tools/probe-player.js <worldSeed> <policy> <role> <field> <hub> <weeks> <out.json> [salt] [focus] [wealth]
const [seed = 2027, policy = 'first', role = 'director', field = 'film', hub = 'hollywood', weeks = 156, out = 'p.json', salt = 1, focus = 'balanced', wealth = 'gettingby'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js'));
const r = c => h.run(c);
const t0 = Date.now();
r(`newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
r(`globalThis.__w0 = S.week; globalThis.__nf0 = S.films.length;`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Probe Person', role: '${role}', field: '${field}', hub: '${hub}', wealth: '${wealth}', salt: ${+salt}, traits: ['Curious', 'Hustler'] }) })`);
// bot rng (separate from the game's)
let rs = 99 + (+salt) * 7919; const brnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
h.ctx.__brnd = brnd; h.ctx.__policy = policy;
r(`globalThis.__pickK = function (it) {
  const L = (it.choices || []).filter(c => !c.dis); if (!L.length) return it.choices[it.choices.length - 1].k;
  if (it.kind === 'offer') { const y = L.find(c => c.k === 'yes'), n = L.find(c => c.k === 'no'); if (y && n) return (jobDays() + ((it.post || {}).days || 0) <= 5) ? 'yes' : 'no'; }
  const p = __policy;
  if (p === 'first') return L[0].k;
  if (p === 'last') return L[L.length - 1].k;
  if (p === 'random') return L[Math.floor(__brnd() * L.length)].k;
  const m = L.find(c => stanceOf(c.label) === p); return (m || L[Math.floor(__brnd() * L.length)]).k;
};
globalThis.__decide = function () { let n = 0; for (let g = 0; g < 30; g++) { const P0 = pending(); if (!P0.length) break; for (const it of P0) { const k = __pickK(it); if (!doAct({ t: 'pick', id: it.id, k })) { const alt = (it.choices.find(c => !c.dis) || it.choices[0]).k; doAct({ t: 'pick', id: it.id, k: alt }); } n++; (__rec.picks[it.kind] = __rec.picks[it.kind] || []).push(k); } } return n; };
globalThis.__rec = { picks: {} };`);
// party
for (let i = 0; i < 40 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); const L = sc.rooms || sc.opts; const i = __policy === 'first' ? 0 : __policy === 'last' ? L.length - 1 : Math.floor(__brnd() * L.length); return doAct({ t: 'party', k: L[i].k }); })()`);
r(`doAct({ t: 'focus', day: '${focus}', eve: '${policy === 'bold' ? 'social' : 'quiet'}', auto: true })`);
const W = [];
let lastInbox = 0, lastPhone = 0, lastMail = 0, err = null;
const tStart = Date.now();
for (let w = 0; w < +weeks && !r('S.me.over'); w++) {
  const a = Date.now();
  try {
    const nd0 = r(`__decide()`);
    r(`(() => { UI.apps = new Set(); if (lookingForWork() && jobDays() < 5) for (const [p] of rankedFits(appSlots())) UI.apps.add(p.id); if (S.me.focus && S.me.focus.auto) S.me.cal = autoCal(); })()`);
    // social initiative every third week, replies to anything replyable
    if (w % 3 === 0) r(`(() => { const ids = aliveKnown().sort((a, b) => opinion(b) - opinion(a)); const s = upcomingSlots(8)[2]; if (ids.length && s) doAct(Object.assign({ t: 'text', id: ids[S.week % Math.min(4, ids.length)], kind: ['coffee', 'drinks', 'hi'][S.week % 3] }, s)); })()`);
    r(`(() => { const m = (S.me.phone || []).slice().reverse().find(m => m.replyable && !m.replied && m.from >= 0); if (m) doAct({ t: 'reply', mid: m.id, kind: ['warm', 'funny', 'brief'][S.week % 3] }); })()`);
    const nd = r(`(() => { const w0 = S.week; let n = 0; for (let g = 0; g < 80 && S.week === w0 && !S.me.over; g++) { n += __decide(); doAct(endWeekAct('next')); } n += 0; return n; })()`) + nd0;
    const snap = JSON.parse(r(`(() => { const M = S.me, me = ME();
      const nb = M.inbox.filter(x => x.id > ${lastInbox}), np = (M.phone || []).filter(x => x.id > ${lastPhone}), nm = (M.mail || []).filter(x => (x.id || 0) > ${lastMail});
      return JSON.stringify({ week: S.week, li: M.seq - 1, lp: M.phoneN || 0, lm: Math.max(${lastMail}, ...(M.mail || []).map(x => x.id || 0)),
        kinds: nb.reduce((a, x) => (a[x.kind] = (a[x.kind] || 0) + 1, a), {}), scenes: nb.filter(x => x.kind === 'scene').map(x => x.scene), titles: nb.filter(x => x.kind !== 'scene' && x.kind !== 'note').map(x => x.kind + ':' + x.title),
        rolls: nb.filter(x => x.result && x.result.roll).map(x => x.result.ok ? 1 : 0),
        texts: np.filter(m => m.from !== -1).map(m => [m.from, m.kind, m.t]), mails: nm.map(m => (m.kind || '') + ':' + (m.subj || m.title || m.t || '').slice(0, 60)),
        lvl: careerLevel(), cash: Math.round(M.cash), stand: +me.standing.toFixed(1), fame: +(me.fame || 0).toFixed(1), en: Math.round(M.energy), st: Math.round(M.stress), jobs: M.jobs.map(j => j.t), credits: me.credits.length, known: Object.keys(M.known).length, school: !!M.school, agent: !!M.agent, hub: M.hub, co: M.company != null || M.co != null }); })()`));
    lastInbox = snap.li; lastPhone = snap.lp; lastMail = snap.lm;
    snap.dec = nd; snap.ms = Date.now() - a;
    W.push(snap);
  } catch (e) { err = { w, msg: e.message, stack: (e.stack || '').split('\n').slice(0, 6).join(' | ') }; break; }
}
const end = JSON.parse(r(`(() => { const M = S.me, me = ME(); const F = {}; for (let i = __nf0; i < S.films.length; i++) { const f = S.films[i]; F[i] = f.title + '|' + (f.rel === null ? 'x' : Math.round(f.q * 10) + ':' + Math.round(f.total * 1000)); }
  const Fo = {}; for (let i = 0; i < __nf0; i++) { const f = S.films[i]; if (f.rel !== null && f.rel > __w0) Fo[i] = Math.round(f.q * 10) + ':' + Math.round(f.total * 1000); }
  return JSON.stringify({ over: !!M.over, milestones: (M.milestones || []).map(m => m.t), past: M.past.map(p => p.t + (p.credited ? '*' : '')), rel: aliveKnown().reduce((a, id) => (a[relOf(id)] = (a[relOf(id)] || 0) + 1, a), {}),
    seenN: M.seenN || {}, stats: M.stats, filmsNew: F, filmsOld: Fo, cos: S.companies.map(c => Math.round(c.cash * 100) + (c.closed === null ? '' : 'x')), nPeople: S.people.length, topStand: S.people.slice(0, 4000).map(p => Math.round(p.standing * 10)), log: S.log.length, world: ((M.world || {}).ev || []).map(e => e.k), ach: (M.ach ? Object.keys(M.ach).length : 0), amb: (M.ambDone ? Object.keys(M.ambDone).length : 0), degrees: M.degrees, scripts: (M.scripts || []).length, works: (M.works || []).length }); })()`));
require('fs').writeFileSync(out, JSON.stringify({ cfg: { seed: +seed, policy, role, field, hub, weeks: +weeks, salt: +salt, focus, wealth }, buildMs: tStart - t0, runMs: Date.now() - tStart, err, picks: JSON.parse(r('JSON.stringify(__rec.picks)')), W, end }));
console.log(`${out}: weeks ${W.length} err ${err ? err.msg : 'none'} lvl ${W.length ? W[W.length - 1].lvl : '-'} cash ${W.length ? W[W.length - 1].cash : '-'} ${Date.now() - t0}ms`);
