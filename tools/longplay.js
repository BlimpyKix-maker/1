// Long playthroughs: lives a career for years the way a player would (autopilot on, answering decisions, texting
// friends, making things, investing once rich) and records everything the player is shown, to find what repeats,
// what never happens, and where weeks go quiet. Usage: node tools/longplay.js <archetype|index> [years] [outfile]
// Archetypes: crew, actor, writer, musician, creator, producer, student, heir. Writes a JSON report.
const fs = require('fs');
const [ARG = '0', YEARS = 20, OUT] = process.argv.slice(2);
const TYPES = {
  crew:     { role: 'dp', field: 'film', wealth: 'gettingby', edu: 'filmcam', hub: 'hollywood' },
  actor:    { role: 'actor', field: 'film', wealth: 'scraping', edu: 'drama', hub: 'london' },
  writer:   { role: 'writer', field: 'film', wealth: 'savings', edu: 'uni', hub: 'newyork', write: 1 },
  musician: { role: 'composer', field: 'music', wealth: 'broke', edu: 'music', hub: 'berlin', make: ['song', 'score', 'mv'] },
  creator:  { role: 'editor', field: 'creator', wealth: 'gettingby', edu: 'self', hub: 'seoul', make: ['video', 'blip'] },
  producer: { role: 'producer', field: 'film', wealth: 'comfortable', edu: 'business', hub: 'toronto', write: 1, produce: 1 },
  student:  { role: 'director', field: 'film', wealth: 'savings', edu: 'filmdir', hub: 'mumbai', school: 'mfa', make: ['short'] },
  heir:     { role: 'producer', field: 'stage', wealth: 'trust', edu: 'art', hub: 'paris', make: ['play'], invest: 1, produce: 1 },
};
const names = Object.keys(TYPES), kind = TYPES[ARG] ? ARG : names[+ARG % names.length], T = TYPES[kind];
const h = require('./harness.js'), r = s => h.run(s);
let rs = 99 + names.indexOf(kind) * 7919; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
const seed = 3000 + names.indexOf(kind) * 11;
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null; snapBaseline();`);
// record everything shown to the player
r(`globalThis.REC = []; globalThis.RECW = {};
  const _inbox = inbox; inbox = function (kind, title, text, extra = {}) { REC.push({ w: S.week, ch: 'inbox:' + kind, key: extra.scene || '', t: String(title || '') + ' | ' + String(text || ''), dec: !!(extra.choices && extra.choices.length) }); return _inbox.apply(this, arguments); };
  const _sms = sms; sms = function (from, t, kind = 'text', extra = {}) { const n = (S.me.phone || []).length; const out = _sms.apply(this, arguments); const m = S.me.phone[S.me.phone.length - 1]; if (m && from !== null && from !== undefined && from !== S.me.id) REC.push({ w: S.week, ch: 'text:' + kind, key: '', t: m.t }); return out; };
  const _mail = mail; mail = function (folder, from, subj, body, act) { REC.push({ w: S.week, ch: 'mail:' + folder, key: '', t: String(subj || '') + ' | ' + String(body || '').slice(0, 300), dec: !!act }); return _mail.apply(this, arguments); };
  const _diary = diary; diary = function (t) { REC.push({ w: S.week, ch: 'diary', key: '', t: String(t) }); return _diary.apply(this, arguments); };`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Long Player', role: '${T.role}', field: '${T.field}', wealth: '${T.wealth}', edu: '${T.edu}', hub: '${T.hub}', traits: ['Charming', 'Workhorse'], love: ['Drama', 'Horror'] }) })`);
r(`partyAuto()`);
const pick = it => { let L = (it.choices || []).filter(c => !c.dis); if (!L.length) return null; if (it.kind === 'offer') return (L.find(c => c.k === 'yes') || L[0]).k; if (it.kind === 'broke') return (L.find(c => c.k === 'down') || L.find(c => c.k === 'borrow') || L[0]).k; const keep = L.filter(c => !/go home|give up|pack up|retire|leave the business|quit the business/i.test(c.label || '')); if (keep.length) L = keep; return (rnd() < .45 ? L[0] : L[Math.floor(rnd() * L.length)]).k; };
const answer = () => { for (let g = 0; g < 12; g++) { const P = JSON.parse(r(`JSON.stringify(pending().map(it => ({ id: it.id, kind: it.kind, choices: (it.choices || []).map(c => ({ k: c.k, dis: !!c.dis, label: c.label })) })))`)); if (!P.length) return; for (const it of P) { const k = pick(it); if (k) r(`doAct({ t: 'pick', id: ${JSON.stringify(it.id)}, k: ${JSON.stringify(k)} })`); } } };
const weekly = [], errors = [], snaps = [];
const t0 = Date.now(), WEEKS = YEARS * 52;
r(`doAct({ t: 'focus', auto: true, day: 'balanced', eve: 'social' })`);
if (T.school) r(`doAct({ t: 'enrol', prog: '${T.school}', craft: 'dir' })`);
for (let w = 0; w < WEEKS; w++) {
  if (r('!!S.me.over')) break;
  const n0 = r('REC.length');
  try {
    answer();
    if (rnd() < .35) r(`(() => { const ids = aliveKnown().sort((a, b) => opinion(b) - opinion(a)); const s = upcomingSlots(10)[${Math.floor(rnd() * 10)}]; if (ids.length && s) doAct(Object.assign({ t: 'text', id: ids[${Math.floor(rnd() * 8)} % ids.length], kind: '${['hi', 'coffee', 'drinks', 'mentor', 'hi'][Math.floor(rnd() * 5)]}' }, s)); })()`);
    if (rnd() < .6) r(`(() => { const m = (S.me.phone || []).slice().reverse().find(m => m.replyable && !m.replied && m.from >= 0); if (m) doAct({ t: 'reply', mid: m.id, kind: '${['warm', 'funny', 'brief', 'warm', 'own'][Math.floor(rnd() * 5)]}', text: '${['ha, same. how is the shoot going?', 'sorry, slammed this week. next week?', 'that is amazing news!!', 'ugh. want to grab a drink?'][Math.floor(rnd() * 4)]}' }); })()`);
    if (rnd() < .5) r(`(() => { const m = (S.me.mail || []).find(m => m.act && !m.done); if (m) doAct({ t: 'mail', id: m.id, k: '${rnd() < .6 ? 'yes' : 'no'}' }); })()`);
    if (T.write && rnd() < .06) r(`doAct({ t: 'newscript', genre: '${['Drama', 'Thriller', 'Comedy', 'Horror'][Math.floor(rnd() * 4)]}', theme: 'family', tone: 'dark', premise: 'A ferryman refuses one last crossing.', hero: 'an old ferryman', setting: 'a flooded valley', notes: 'He is afraid of the water. '.repeat(${1 + Math.floor(rnd() * 10)}) })`);
    if (T.write && rnd() < .08) r(`(() => { const sc = (S.me.scripts || []).find(x => x.grade && x.made === undefined); const L = COMPS.filter(c => compOpen(c) && !compEntered(c)); if (L.length) doAct({ t: 'compete', k: L[0].k, script: sc && sc.id }); })()`);
    if (T.make && rnd() < .2) r(`(() => { if (S.me.make && S.me.make.ready) doAct({ t: 'releasework', promo: 1 }); else if (!S.me.make) doAct({ t: 'startwork', type: '${(T.make || ['song'])[Math.floor(rnd() * (T.make || ['song']).length)]}' }); doAct({ t: 'session', score: ${4 + Math.floor(rnd() * 7)} }); })()`);
    if ((T.produce || T.invest) && rnd() < .05) r(`(() => { if (S.me.cash > 60000) { const c = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier <= 2)[${Math.floor(rnd() * 20)}]; if (c) doAct({ t: 'trade', co: c.id, n: 20 }); } })()`);
    if (T.produce && rnd() < .04) r(`(() => { if (!S.me.company && S.me.cash > 40000 && ME().standing >= 16) doAct({ t: 'found', name: 'Long Films' }); const sc = (S.me.scripts || []).find(x => x.grade && x.made === undefined); if (S.me.company && sc && S.me.cash > 80000) { const L = castOptions(sc.genre), D = dirOptions(sc.genre); doAct({ t: 'selffund', src: 'script', id: sc.id, micro: true, lead: L.length ? L[L.length - 1].id : undefined, dir: D.length ? D[0].id : undefined, inv: true }); } const x = (S.me.market || [])[0]; if (x && S.me.cash > 20000) doAct({ t: 'optionspec', id: x.id }); })()`);
    // live the week the way the space bar does: step until the week turns, answering whatever comes up on the way
    const w0 = r('S.week');
    const trace = [];
    for (let g = 0; g < 40 && r('S.week') === w0 && !r('S.me.over'); g++) {
      if (process.env.TRACE) trace.push(r('JSON.stringify([S.me.wk && S.me.wk.day, S.me.wk && S.me.wk.block, pending().map(x => x.id + ":" + x.title)])'));
      answer();
      r(`(() => { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0 && !S.me.over; g++) { autoBeforeStep(); if (pending().length) return; doAct(endWeekAct('next')); } })()`);
    }
    if (r('S.week') === w0 && !r('S.me.over') && process.env.TRACE) console.log('STUCK TRACE', w, trace.slice(0, 12).join('\n'));
    if (r('S.week') === w0 && !r('S.me.over')) errors.push({ w, msg: 'week stuck', stack: r('JSON.stringify(pending().map(x => [x.kind, x.id, x.title, (x.choices || []).map(c => c.k + (c.dis ? "(dis)" : "")).join("/"), doAct({ t: "pick", id: x.id, k: x.choices[0].k })]))') });
    if (w % 13 === 0) r('viewDesk(); viewYou();');
  } catch (e) { errors.push({ w, msg: e.message, stack: (e.stack || '').split('\n').slice(1, 5).join(' | ') }); if (errors.length > 30) break; }
  const recs = JSON.parse(r(`JSON.stringify(REC.slice(${n0}).map(x => [x.ch, x.dec ? 1 : 0]))`));
  weekly.push({ w: r('S.week'), n: recs.length, dec: recs.filter(x => x[1]).length, texts: recs.filter(x => x[0].startsWith('text')).length, mail: recs.filter(x => x[0].startsWith('mail')).length, scenes: recs.filter(x => x[0] === 'inbox:scene').length });
  if (w % 52 === 51) snaps.push(JSON.parse(r(`JSON.stringify({ y: S.year, age: ME().age, cash: Math.round(S.me.cash), level: careerLevel(), credits: ME().credits.length, standing: Math.round(ME().standing), jobs: S.me.jobs.map(j => j.t), known: Object.keys(S.me.known).length, stress: Math.round(S.me.stress), hold: (S.me.lateA || []).length, holdNet: Math.round((S.me.lateA || []).reduce((t, h) => t + (h.net || 0), 0)), works: (S.me.works || []).filter(w => w.rel !== undefined).length, arcs: (S.me.arcLog || []).length })`)));
}
const rec = JSON.parse(r('JSON.stringify(REC)'));
const final = JSON.parse(r(`JSON.stringify({ week: S.week, over: !!S.me.over, milestones: (S.me.milestones || []).map(m => m.t), seenSc: Object.keys(S.me.seenSc || {}).length, past: S.me.past.map(p => p.t), arcs: (S.me.arcLog || []).map(x => x.name + ': ' + x.end), nan: Object.entries(ME().sk).concat(Object.entries(ME().mind), [['cash', S.me.cash], ['standing', ME().standing], ['fame', ME().fame], ['energy', S.me.energy], ['stress', S.me.stress]]).filter(([k, v]) => typeof v !== 'number' || !isFinite(v)).map(([k]) => k) })`));
const out = OUT || `longplay-${kind}.json`;
// SAVE_OUT=<file.applebox>: also write the career as a save file the game can import (Saves page)
if (process.env.SAVE_OUT) {
  const snap = r('snapData()'), meta = JSON.parse(r(`JSON.stringify({ id: 'x', kind: 'manual', name: 'Long play: ${kind}', seed: S.seed, year: S.startYear, depth: S.depth, week: S.week, label: snapLabel() })`));
  fs.writeFileSync(process.env.SAVE_OUT, require('zlib').gzipSync(JSON.stringify({ applebox: 1, meta, snap })));
}
fs.writeFileSync(out, JSON.stringify({ kind, T, ms: Date.now() - t0, errors, weekly, snaps, final, rec }));
console.log(`${kind}: arcs ${final.arcs.length}, NaN [${final.nan}]; ${weekly.length} weeks in ${Math.round((Date.now() - t0) / 1000)}s, ${rec.length} messages, ${errors.length} errors -> ${out}`);
