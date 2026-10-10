// ---------------- People remember: memories, a style of your own, and paths only that style opens ----------------
// Every choice that moves how someone feels about you leaves a memory with them: what happened, when, and which way
// it cut. The people closest to them hear about it too, more faintly. Memories fade slowly, and they come back:
// someone you covered for sends a job your way months later and says why; someone you burned tells the room. They
// count when you apply to work for that person, and when you turn up on the same set.
// Your choices also add up to a style on five axes. Hold one long enough and the business starts treating you as
// that kind of person, which opens a path nobody else gets: offers, perks and scenes that only that style reaches.

const STYLE_AXES = [
  ['gen', 'Generous', 'Self-first', 'Helping, covering, sharing, buying the round.'],
  ['bold', 'Bold', 'Cautious', 'Speaking up, pushing back, taking the swing.'],
  ['loyal', 'Loyal', 'Mercenary', 'Staying, standing by people, keeping your word.'],
  ['amb', 'Driven', 'Content', 'Pitching, chasing, asking for more.'],
  ['honest', 'Straight', 'Slippery', 'Telling the truth, owning it, not spinning.']
];
const AX_RE = {
  loyalP: /stand by|\bstay\b|stick|loyal|stand by|back them|defend|keep your word|keep the promise|turn (it|them) down|decline the offer|wish them well|finish the job|see it through/i,
  loyalN: /work is work|take it anyway|\bleave\b|quit|jump ship|walk away|walk out|take the other|poach|swap|sell|drop them|ghost/i,
  ambP: /pitch|ask for more|negotiat|demand|go for|push for|network|work the room|the meeting|introduce yourself|hard bargain|raise|promotion|lead|apply|chase|sell yourself/i,
  ambN: /\bpass\b|not now|rest|stay home|go home|sleep|let someone else|step back|turn down/i,
  honP: /admit|tell the truth|truth|own up|come clean|honest|confess|be straight|straight with|what you really think|own it|apologi|take the blame|on the record|say it straight/i,
  honN: /let it ride|\blie\b|lying|bluff|fake|pretend|spin|cover up|blame|take (the )?credit|exaggerat|\bpad\b|fudg|flatter|keep it quiet|deny|keep it secret|keep it to yourself|everyone steals|put your name on it|switch quietly|without giving anything away|psych|off the record|play along|let them think|white lie|smooth it over|throw them off/i
};
const AX_CAP = 30;
function memCount(k) { const N = (S.me.memN = S.me.memN || {}); N[k] = (N[k] || 0) + 1; return true; }
function memOf(id) { const M = S.me; M.mem = M.mem || {}; return M.mem[id] || (M.mem[id] = { v: 0, n: [] }); }
function styleOf() { const M = S.me; return M.style || (M.style = { gen: 0, bold: 0, loyal: 0, amb: 0, honest: 0 }); }
function memLabel(l) { return String(l || '').split(' · ')[0].replace(/\s*\(.*?\)\s*$/, '').trim(); }
function nudgeStyle(k, v, why) {
  if (!v) return; const St = styleOf(), M = S.me; St[k] = clamp(St[k] + v, -AX_CAP, AX_CAP);
  const L = (M.styleLog = M.styleLog || []), last = L[L.length - 1];
  if (last && last.w === S.week && last.why === why) { last.d[k] = (last.d[k] || 0) + v; return; }
  L.push({ w: S.week, why, d: { [k]: v } }); if (L.length > 40) L.shift();
}
// What a choice says about you. Judged by the words of the choice, never by how the roll went.
function classifyChoice(it, c) {
  const l = memLabel(c.label), st = typeof stanceOf === 'function' ? stanceOf(l) : 'plain', why = `${it.title}: ${l}`, out = {};
  if (st === 'generous') out.gen = 1; if (st === 'bold') out.bold = 1; if (st === 'careful') out.bold = -.6;
  if (AX_RE.loyalP.test(l)) out.loyal = 1; else if (AX_RE.loyalN.test(l) || c.k === 'swap') out.loyal = -1;
  if (AX_RE.ambP.test(l)) out.amb = 1; else if (AX_RE.ambN.test(l)) out.amb = -.5;
  if (AX_RE.honP.test(l)) out.honest = 1; else if (AX_RE.honN.test(l)) out.honest = -1;
  if (/\bkeep (it|the money)\b|for yourself|alone|go it alone|your cut/i.test(l)) out.gen = (out.gen || 0) - 1;
  for (const k in out) nudgeStyle(k, out[k], why);
  return out;
}
// Something happened between you and id: remember it, and let their circle hear.
function remember(id, d, t, quiet) {
  const M = S.me, q = P(id); if (!q || id === M.id || q.dead) return;
  const m = memOf(id), T = typeof temperOf === 'function' ? temperOf(q) : 'fair';
  const dv = clamp(d / 3, -3, 3) * (d < 0 && T === 'grudge' ? 1.4 : d < 0 && T === 'forgive' ? .7 : 1);
  m.v = clamp(m.v + dv, -12, 12); m.last = S.week;
  const li = m.n.findIndex(x => x.t === t && !x.via);
  if (li >= 0) { const ln = m.n.splice(li, 1)[0]; ln.w = S.week; ln.x = (ln.x || 1) + 1; ln.d = Math.sign(d) || ln.d; ln.m = Math.max(ln.m || 0, Math.abs(d)); m.n.push(ln); } else { m.n.push({ w: S.week, t, d: Math.sign(d), m: Math.abs(d) }); if (m.n.length > 5) m.n.splice(m.n.reduce((bi, x, i, A) => (x.m || 0) * (x.x || 1) < (A[bi].m || 0) * (A[bi].x || 1) ? i : bi, 0), 1); }
  if (quiet || Math.abs(d) < 3 || typeof circleOf !== 'function') return;
  for (const f of circleOf(q, 3)) {
    if (f === M.id) continue; const mf = memOf(f);
    mf.v = clamp(mf.v + dv * .3, -12, 12); mf.last = S.week;
    mf.n.push({ w: S.week, t: `Heard from ${q.name.split(' ')[0]}: ${t}`, d: Math.sign(d), m: Math.abs(d) * .3, via: id }); if (mf.n.length > 5) mf.n.shift();
    addTie(ME(), P(f), Math.round(d * .25));
  }
}
// the memory that matters most to them: the biggest thing, weighted by how often
function memNote(id, sign) { const m = (S.me.mem || {})[id]; if (!m) return null; const w = x => (x.m || 2) * Math.sqrt(x.x || 1) * (x.via ? .5 : 1); const L = m.n.filter(x => !sign || x.d === sign).sort((a, b) => w(b) - w(a)); return L[0] || null; }
function noteShort(n) { if (!n) return 'what happened'; const ti = n.t.replace(/^Heard from [^:]+: /, '').split(': you chose')[0].replace(/^[^\w“"']+/u, '').replace(/^📖\s*/u, '').trim(); return `“${ti}”`; }

// Watch every choice: who it moved, and what it says about you.
{ const _rp = resolvePick;
  resolvePick = function (it, k) {
    const M = S.me, me = ME(), c = (it.choices || []).find(x => x.k === k);
    if (!M || !c || c.dis || k === '_none') return _rp(it, k);
    const before = Object.assign({}, me.ties), r = memPick(it, k) || _rp(it, k);
    if (!r) return r;
    classifyChoice(it, c);
    const l = memLabel(c.label), t = `${it.title.replace(/\.$/, '')}: you chose “${l}”`;
    let net = 0;
    for (const id in me.ties) { const d = me.ties[id] - (before[id] || 0); net += d; if (Math.abs(d) >= 2) remember(+id, d, t); }
    if (net >= 5) nudgeStyle('gen', .25, `${it.title}: people warmed to you`); else if (net <= -5) nudgeStyle('gen', -.25, `${it.title}: people cooled on you`);
    (M.memN = M.memN || {}).picks = (M.memN.picks || 0) + 1;
    return r;
  };
}

// ---- paths only a style can reach ----
const STYLE_PATHS = {
  helper: { name: 'The Good Egg', icon: '🤲', need: 'Generous 8+', on: s => s.gen >= 8, keep: s => s.gen >= 4,
    d: 'Known as the one who helps. Crews vouch for you, and the people you helped send work back.', perk: 'Crews vouch for you on junior jobs (+), favours come back faster' },
  gambler: { name: 'The Wild Card', icon: '🎲', need: 'Bold 8+', on: s => s.bold >= 8, keep: s => s.bold >= 4,
    d: 'Known for nerve. Long-shot offers find you: jobs above your level, if you dare.', perk: 'Wild-card offers above your level' },
  climber: { name: 'The Climber', icon: '🧗', need: 'Driven 8+', on: s => s.amb >= 8, keep: s => s.amb >= 4,
    d: 'Known for wanting it. Power lunches with people well above you.', perk: 'Senior jobs take you a little more seriously (+), power lunches' },
  loyalist: { name: 'The Loyalist', icon: '🛡️', need: 'Loyal 8+', on: s => s.loyal >= 8, keep: s => s.loyal >= 4,
    d: 'Known for staying. People who\'ve worked with you hire you again, and friends put money and names behind you.', perk: 'Old bosses rehire you (+), friends vouch with their own name' },
  straight: { name: 'The Straight Shooter', icon: '🎯', need: 'Straight 8+', on: s => s.honest >= 8, keep: s => s.honest >= 4,
    d: 'Known for the truth. Journalists want you on the record, and your word counts.', perk: 'Standing grows a little each week, the press asks for you' },
  operator: { name: 'The Operator', icon: '🕴️', need: 'Slippery 5+ and Driven 5+', on: s => s.honest <= -5 && s.amb >= 5, keep: s => s.honest <= -2,
    d: 'Known for knowing how things really get done. Backroom offers, with heat attached.', perk: 'Backroom offers (+ on applications), but the heat builds' },
  confidant: { name: 'The Confidant', icon: '🤫', need: 'Loyal 6+ and Straight 6+', on: s => s.loyal >= 6 && s.honest >= 6, keep: s => s.loyal >= 3 && s.honest >= 3,
    d: 'The one people tell things to. You hear about jobs before they exist.', perk: 'Jobs whispered to you before they post' },
  firebrand: { name: 'The Firebrand', icon: '🔥', need: 'Bold 8+ and Self-first 3+', on: s => s.bold >= 8 && s.gen <= -3, keep: s => s.bold >= 4,
    d: 'Loud, sharp and good copy. The press loves you; some people won\'t work with you.', perk: 'Fame grows each week, public spats' }
};
const STYLE_WEEKS = 16;
function pathActive(k) { const M = S.me, p = (M.paths || {})[k]; return !!(p && p.on && STYLE_PATHS[k].keep(styleOf())); }
function memWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return;
  const St = styleOf();
  for (const k in St) St[k] = Math.abs(St[k]) < .05 ? 0 : St[k] * .993;
  for (const id in M.mem || {}) { const m = M.mem[id]; m.v *= .995; if (Math.abs(m.v) < .25 && S.week - (m.last || 0) > 52) delete M.mem[id]; }
  const ids = Object.keys(M.mem || {}); if (ids.length > 220) ids.sort((a, b) => Math.abs(M.mem[a].v) - Math.abs(M.mem[b].v)).slice(0, ids.length - 220).forEach(id => delete M.mem[id]);
  // paths: hold a style for twenty weeks and it becomes who you are
  M.paths = M.paths || {}; M.pathRun = M.pathRun || {};
  for (const k in STYLE_PATHS) {
    const P0 = STYLE_PATHS[k], on = P0.on(St);
    M.pathRun[k] = on ? (M.pathRun[k] || 0) + 1 : Math.max(0, (M.pathRun[k] || 0) - 2);
    if (on && M.pathRun[k] >= STYLE_WEEKS && !(M.paths[k] && M.paths[k].on)) {
      M.paths[k] = { on: S.week, n: 0 };
      inbox('note', `People have you down as ${P0.name.toLowerCase()}`, `Months of the same kind of choices, and the business has noticed. ${P0.d} It lasts as long as you keep it up.`);
      milestone(`Became known as ${P0.name.toLowerCase()}`, 'work');
    }
  }
  if (pathActive('straight')) me.standing = clamp(me.standing + .03, 0, 100);
  if (pathActive('firebrand')) me.fame = clamp((me.fame || 0) + .05, 0, 100);
  if (M.opHeat > 0) {
    M.opHeat = Math.max(0, M.opHeat - .02);
    if (prnd() < M.opHeat * .012) { const h = M.opHeat; M.opHeat = 0; me.standing = clamp(me.standing - 2 - h, 0, 100);
      for (const id of Object.keys(M.mem || {}).map(Number).filter(i => M.mem[i].op).slice(0, 4)) { addTie(me, P(id), -6); remember(id, -6, 'The backroom deal that came out', true); }
      inbox('note', 'It comes out', `Someone talks. The favours you traded in back rooms are all over the trade press this week, with your name in the first line. People who were in on it go quiet when you call.`);
      milestone('A backroom deal came out', 'work'); }
  }
  { const n = (M.secrets || []).length; if (n > (M.memSec || 0)) nudgeStyle('honest', -1.5 * (n - (M.memSec || 0)), 'Something to hide'); M.memSec = n; }
  memJobsWeek();
  if (pending().some(it => /^mem/.test(it.kind))) return;
  if (prnd() < .12 && memCallback()) return;
  const act = Object.keys(STYLE_PATHS).filter(pathActive);
  if (act.length && prnd() < .09) { pathEvent(act[Math.floor(prnd() * act.length)]); return; }
  if (prnd() < .07) crossroads();
}
// Small forks that say who you are. Nothing here is a test with a right answer: what you pick is the style,
// the dice and the people involved decide how it lands.
function crossroads() {
  const M = S.me, me = ME(), j = M.jobs.find(x => x.film !== null && x.film !== undefined && ((x.mates || []).length || x.head !== null)), kinds = [];
  if (j) kinds.push('credit');
  if (M.board.length) kinds.push('cv');
  const fr = aliveKnown().filter(id => opinion(id) >= 25 && (typeof circleOf === 'function')).find(id => Object.entries(P(id).ties).some(([x, v]) => v < -20 && liveFilmOf(+x) && +x !== M.id));
  if (fr !== undefined) kinds.push('rival');
  if (j && M.cash > 0) kinds.push('bonus');
  M.xW = M.xW || {}; const ks = kinds.filter(x => S.week - (M.xW[x] || -99) >= 30);
  if (!ks.length) return;
  const k = ks[Math.floor(prnd() * ks.length)]; M.xW[k] = S.week;
  if (k === 'credit') { const who = (j.mates || [])[0] !== undefined ? j.mates[0] : j.head, f = S.films[j.film]; memCount('x_credit');
    inbox('memx', 'Whose idea was it?', `On ${f.title}, an idea of ${P(who).name}'s fixes a scene, and somehow it reaches the top as yours. People are congratulating you.`, { x: k, person: who, job: j.id, choices: [{ k: 'give', label: `Tell the truth: it was ${P(who).name.split(' ')[0]}'s` }, { k: 'ride', label: 'Let it ride' }] }); return; }
  if (k === 'cv') { memCount('x_cv'); inbox('memx', 'Your CV, again', 'You\'re updating your CV. A couple of small jobs could be made to sound much bigger than they were. Everyone does it, apparently.', { x: k, choices: [{ k: 'pad', label: 'Polish it: exaggerate a little' }, { k: 'true', label: 'Keep it honest' }] }); return; }
  if (k === 'rival') { const foe = +Object.entries(P(fr).ties).find(([x, v]) => v < -20 && liveFilmOf(+x) && +x !== M.id)[0], f = liveFilmOf(foe); memCount('x_rival');
    inbox('memx', `${P(foe).name} wants you`, `${P(foe).name} has a job for you on ${f.title}. The catch: ${P(foe).name} and ${P(fr).name} can't stand each other, and ${P(fr).name.split(' ')[0]} has asked you, as a friend, not to.`, { x: k, person: fr, foe, film: f.id, choices: [{ k: 'take', label: 'Take it anyway: work is work' }, { k: 'stand', label: `Stand by ${P(fr).name.split(' ')[0]} and say no` }] }); return; }
  if (k === 'bonus') { const amt = usd(150 + Math.round(prnd() * 4) * 50); memCount('x_bonus');
    inbox('memx', 'A bonus nobody expected', `The producers on ${S.films[j.film].title} send you ${fmtCash(amt)} for going beyond the job. Half your department went beyond it too.`, { x: k, amt, job: j.id, choices: [{ k: 'keep', label: 'Keep it: you earned it' }, { k: 'share', label: 'Share it with the department' }] }); }
}
function crossPick(it, k) {
  const M = S.me, me = ME(), R = t => { it.result = { t }; return true; };
  if (it.x === 'credit') { const q = P(it.person), j = M.jobs.find(x => x.id === it.job);
    if (k === 'give') { addTie(me, q, 9); if (j) jobScore(j, .3, 'Gave credit where due'); return R(`${q.name} hears you said it. They don't say anything, but they bring you a coffee the next morning, and the morning after.`); }
    if (j) jobScore(j, 1, 'A good idea, apparently yours'); if (prnd() < .4) { addTie(me, q, -12); return R(`It works, for a week. Then ${q.name} hears how the story's being told.`); } return R('It rides. Nobody asks. You feel it a little, when the idea gets praised again.'); }
  if (it.x === 'cv') { if (k === 'pad') { M.cvPad = S.week + 8; return R('It reads well. Much better than the truth, frankly. For the next couple of months it opens doors, if nobody checks.'); } M.cvTrue = S.week + 8; return R('Accurate, a little modest. The people who check references will like what they find.'); }
  if (it.x === 'rival') { const q = P(it.person), f = S.films[it.film];
    if (k === 'take') { const p = f && f.stage < 3 ? makeLead(it.foe, f) : null; addTie(me, q, -10); return R(`${p ? `The ${p.t.toLowerCase()} job is on your board.` : 'The job evaporates anyway.'} ${q.name} finds out within a day.`); }
    addTie(me, q, 10); addTie(me, P(it.foe), -4); return R(`${q.name} doesn't forget it. ${P(it.foe).name} does, eventually.`); }
  if (it.x === 'bonus') { const j = M.jobs.find(x => x.id === it.job), f = j && S.films[j.film];
    if (k === 'keep') { M.cash += it.amt; return R(`${fmtCash(it.amt)}, all yours.`); }
    M.cash += Math.round(it.amt * .2); if (f) for (const id of [...slotsOf(f).keys()].slice(0, 6)) if (M.known[id]) addTie(me, P(id), 3); return R('You split it. The department takes you out on Friday and won\'t let you pay.'); }
  return false;
}
function liveFilmOf(id) { return S.active.map(i => S.films[i]).find(f => f && f.stage >= 0 && f.stage < 3 && f.hub === S.me.hub && slotsOf(f).has(id)) || null; }
function anyLiveFilm() { const L = S.active.map(i => S.films[i]).filter(f => f && f.stage >= 0 && f.stage < 3 && f.hub === S.me.hub); return L.length ? L[Math.floor(prnd() * L.length)] : null; }
// The past comes back: a favour returned, or a debt called in.
function memCallback() {
  const M = S.me, me = ME();
  const L = Object.keys(M.mem || {}).map(Number).filter(id => P(id) && !P(id).dead && !P(id).retired && S.week - (M.mem[id].cb || -99) > 26);
  const good = L.filter(id => M.mem[id].v >= (pathActive('helper') ? 3 : 4)).sort((a, b) => M.mem[b].v - M.mem[a].v);
  const bad = L.filter(id => M.mem[id].v <= -4).sort((a, b) => M.mem[a].v - M.mem[b].v);
  if (good.length && (!bad.length || prnd() < .65)) {
    const id = good[0], q = P(id), m = M.mem[id], n = memNote(id, 1), f = liveFilmOf(id); m.cb = S.week; memCount('favour');
    if (f && typeof makeLead === 'function') { const p = makeLead(id, f); if (p) { sms(id, pickLine([`I haven't forgotten ${noteShort(n)}. there's a ${p.t.toLowerCase()} job on ${f.title} and your name is already on it`, `remember ${noteShort(n)}? I do. ${f.title} needs a ${p.t.toLowerCase()}. I told them you`, `owed you one. ${f.title}, ${p.t.toLowerCase()}. it's yours if you want it`], id + S.week), 'tip'); diary(`${q.name} remembered ${noteShort(n)} and put you up for a job on ${f.title}.`); return true; } }
    const intro = (typeof circleOf === 'function' ? circleOf(q, 8) : []).find(x => !M.known[x] && x !== M.id);
    if (intro !== undefined) { meet(intro, `Introduced by ${q.name}`, 8); sms(id, pickLine([`you were good to me back when it counted (${noteShort(n)}). you should meet ${P(intro).name}. I've told them about you`, `${P(intro).name} needs someone like you. I said you're the real thing, because of ${noteShort(n)}`], id + S.week), 'tip'); return true; }
    M.freeRef = (M.freeRef || 0) + 1; sms(id, pickLine([`if anyone asks about you, I'm telling them about ${noteShort(n)}. use me as a reference`, `put my name down next time you apply. I mean it`], id + S.week), 'tip'); return true;
  }
  if (bad.length) {
    const id = bad[0], q = P(id), m = M.mem[id], n = memNote(id, -1); m.cb = S.week; memCount('payback');
    me.standing = clamp(me.standing - 1, 0, 100);
    const circ = typeof circleOf === 'function' ? circleOf(q, 3) : [];
    for (const x of circ) addTie(me, P(x), -2);
    inbox('membad', `${q.name} is telling people`, `Word reaches you: ${q.name} (${ROLE_LABEL[q.role].toLowerCase()}) has been telling the story of ${noteShort(n)}, and not kindly.${circ.length ? ` ${circ.map(x => P(x).name).join(', ')} ${circ.length > 1 ? 'have' : 'has'} heard it.` : ''}`, { person: id, choices: [
      { k: 'mend', label: `Call them and clear the air · ${checkLabel('cha', 13)}`, check: ['cha', 13] },
      { k: 'hit', label: `Tell your side, loudly · ${checkLabel('cha', 12)}`, check: ['cha', 12] },
      { k: 'spin', label: `Spin it: they're just bitter · ${checkLabel('cha', 14)}`, check: ['cha', 14] },
      { k: 'wait', label: 'Say nothing. It\'ll blow over' }] });
    return true;
  }
  return false;
}
// New job: who's on this set that remembers you?
function memJobsWeek() {
  const M = S.me;
  for (const j of M.jobs) {
    if (j.memChk || j.film === null || j.film === undefined) continue; j.memChk = 1;
    const f = S.films[j.film]; if (!f) continue;
    if ((M.cvPad || 0) > S.week && j.head !== null && j.head !== undefined && P(j.head) && prnd() < .15) { ME().standing = clamp(ME().standing - 2, 0, 100); addTie(ME(), P(j.head), -8); remember(j.head, -8, 'The CV that didn\'t match the reference'); M.cvPad = 0; memCount('cvcaught');
      inbox('note', 'Someone checked your CV', `${P(j.head).name} rang one of your references. The job you described and the job you did weren't quite the same. You keep the job; you lose a little of the room.`, { person: j.head }); }
    const there = [...slotsOf(f).keys()].filter(id => (M.mem || {})[id] && Math.abs(M.mem[id].v) >= 2.5);
    const fr = there.filter(id => M.mem[id].v > 0).sort((a, b) => M.mem[b].v - M.mem[a].v)[0], fo = there.filter(id => M.mem[id].v < 0).sort((a, b) => M.mem[a].v - M.mem[b].v)[0];
    if (fr !== undefined) { memCount('setfriend'); if (typeof jobScore === 'function') jobScore(j, 1, `${P(fr).name} vouched for you`); addTie(ME(), P(fr), 2);
      inbox('note', `A friendly face on ${f.title}`, `${P(fr).name} is on ${f.title} too, and remembers ${noteShort(memNote(fr, 1))}. They make sure the right people know you're good. It shows in your first days.`, { person: fr }); }
    if (fo !== undefined && !pending().some(it => it.kind === 'memset') && memCount('setfoe')) inbox('memset', `Bad blood on ${f.title}`, `${P(fo).name} is on ${f.title}. They haven't forgotten ${noteShort(memNote(fo, -1))}, and the whole set can feel it.`, { person: fo, job: j.id, choices: [
      { k: 'clear', label: `Take them aside and clear the air · ${checkLabel('cha', 12)}`, check: ['cha', 12] },
      { k: 'work', label: `Let the work talk · ${checkLabel('dis', 11)}`, check: ['dis', 11] },
      { k: 'avoid', label: 'Keep your distance' }] });
  }
}
function pathEvent(k) {
  const M = S.me, me = ME(), p = M.paths[k]; p.n++; memCount('path_' + k);
  if (k === 'helper' || k === 'confidant' || k === 'loyalist') {
    const L = Object.keys(M.mem || {}).map(Number).filter(id => M.mem[id].v > 1 && P(id) && !P(id).dead && liveFilmOf(id));
    const id = L.length ? L[Math.floor(prnd() * L.length)] : null;
    if (id === null) { if (k === 'loyalist') { M.freeRef = (M.freeRef || 0) + 1; inbox('note', 'Someone puts their name behind you', 'An old colleague tells you to use them as a reference, any time, for anything. That\'s what staying gets you.'); } return; }
    const f = liveFilmOf(id), lp = makeLead(id, f); if (!lp) return;
    const line = k === 'confidant' ? [`between us: ${f.title} needs a ${lp.t.toLowerCase()} and nobody knows yet. you're the first person I told`, `don't tell anyone I told you. ${f.title}. ${lp.t.toLowerCase()}. move fast`] : k === 'loyalist' ? [`you stuck with people when it was hard. ${f.title} needs a ${lp.t.toLowerCase()}, and I want someone who stays`, `we look after our own. ${lp.t.toLowerCase()} on ${f.title}, if you want it`] : [`the crew on ${f.title} asked for you by name. ${lp.t.toLowerCase()}. you helped half of them once`, `everyone says you're the one who helps. ${f.title} could use that. ${lp.t.toLowerCase()}?`];
    sms(id, pickLine(line, id + S.week), 'tip'); return;
  }
  if (k === 'gambler') { const f = anyLiveFilm(); if (!f) return; const h = f.prod !== undefined && f.prod !== null ? f.prod : f.dir;
    inbox('mempath', 'A wild-card offer', `${P(h).name} saw you take a big swing once and wants to see it again: a job on ${f.title} that's well above what anyone would normally offer you. You'd have to talk your way in.`, { path: k, film: f.id, person: h, choices: [{ k: 'leap', label: `Go for it · ${checkLabel('cha', 15)}`, check: ['cha', 15] }, { k: 'no', label: 'Not this one' }] }); return; }
  if (k === 'climber') { const q = S.people.filter(x => !x.dead && !x.retired && x.hub === M.hub && x.role === 'producer' && x.standing >= me.standing + 15 && x.id !== M.id).sort((a, b) => b.standing - a.standing)[Math.floor(prnd() * 5)]; if (!q) return;
    inbox('mempath', `Lunch with ${q.name}`, `You've been angling for rooms like this. ${q.name}, one of the producers people actually mean when they say "producer", has an hour and a table.`, { path: k, person: q.id, choices: [{ k: 'pitch', label: `Pitch yourself · ${checkLabel('cha', 14)}`, check: ['cha', 14] }, { k: 'listen', label: 'Ask questions and listen' }, { k: 'bill', label: `Pick up the bill (${fmtCash(usd(180))})` }] }); return; }
  if (k === 'straight') { inbox('mempath', 'A journalist wants you on the record', 'A trade reporter is writing about how the business really treats people, and was told you\'re the one who won\'t spin it.', { path: k, choices: [{ k: 'onrec', label: `Say it straight, on the record · ${checkLabel('cha', 12)}`, check: ['cha', 12] }, { k: 'offrec', label: 'Off the record only' }] }); return; }
  if (k === 'operator') { const f = anyLiveFilm(); if (!f) return; const h = f.prod !== undefined && f.prod !== null ? f.prod : f.dir;
    inbox('mempath', 'A quiet favour', `${P(h).name}'s people have a problem on ${f.title} that you can make go away. In return, a job on it, no questions. These things have a way of coming out.`, { path: k, film: f.id, person: h, choices: [{ k: 'deal', label: 'Do the favour, take the job' }, { k: 'no', label: 'Not this time' }] }); return; }
  if (k === 'firebrand') { const L = Object.keys(M.mem || {}).map(Number).filter(id => M.mem[id].v < 0 && P(id) && !P(id).dead); const id = L.length ? L[0] : null; const q = id !== null ? P(id) : S.people.find(x => !x.dead && x.hub === M.hub && x.standing > me.standing && x.id !== M.id); if (!q) return;
    inbox('mempath', `${q.name} takes a shot at you`, `In an interview, ${q.name} calls people like you "all noise". Everyone's waiting to see what you'll say.`, { path: k, person: q.id, choices: [{ k: 'fire', label: `Fire back · ${checkLabel('cha', 13)}`, check: ['cha', 13] }, { k: 'rise', label: 'Rise above it' }] }); }
}
function memPick(it, k) {
  if (!/^mem/.test(it.kind || '')) return false;
  const M = S.me, me = ME(), id = it.person, q = id !== undefined && id !== null ? P(id) : null; it.done = true;
  if (it.kind === 'memx') return crossPick(it, k);
  const R = (ok, t) => { it.result = { ok, roll: ok === null ? null : M.lastRoll, t }; return true; };
  if (it.kind === 'membad') {
    if (k === 'mend') { const ok = roll('cha', 13); if (ok) { memOf(id).v = Math.max(0, memOf(id).v); addTie(me, q, 8); return R(ok, `You call. It's awkward for a minute, then it isn't. ${q.name} stops telling the story.`); } memOf(id).v -= 1; addTie(me, q, -2); return R(ok, `${q.name} lets it ring out, then texts: "not interested."`); }
    if (k === 'hit') { const ok = roll('cha', 12); if (ok) { me.standing = clamp(me.standing + 1.5, 0, 100); addTie(me, q, -6); return R(ok, 'Your version lands better. People start asking ' + q.name + ' awkward questions.'); } me.standing = clamp(me.standing - 1.5, 0, 100); addTie(me, q, -6); return R(ok, 'It looks like a feud, and feuds look bad on everyone. Mostly on you.'); }
    if (k === 'spin') { const ok = roll('cha', 14); if (ok) { memOf(id).v -= 1; me.standing = clamp(me.standing + 1, 0, 100); return R(ok, `By Friday the story is about ${q.name}'s jealousy, not about you.`); } me.standing = clamp(me.standing - 2, 0, 100); addTie(me, q, -6); return R(ok, 'The spin is so obvious it becomes the story.'); }
    return R(null, 'You say nothing. The story does the rounds, then something else replaces it.');
  }
  if (it.kind === 'memset') {
    const j = M.jobs.find(x => x.id === it.job);
    if (k === 'clear') { const ok = roll('cha', 12); if (ok) { memOf(id).v = Math.max(0, memOf(id).v + 3); addTie(me, q, 8); return R(ok, `Five minutes by the trucks. You say what needed saying. ${q.name} nods. The set breathes again.`); } addTie(me, q, -3); if (j) jobScore(j, -.5, 'Bad blood on set'); return R(ok, 'It turns into round two, in front of the runners.'); }
    if (k === 'work') { const ok = roll('dis', 11); if (j) jobScore(j, ok ? 1 : -.5, ok ? 'Let the work talk' : 'Tension on set'); if (ok) addTie(me, q, 3); return R(ok, ok ? `You're so good this week that ${q.name} has nothing to say. Then, grudgingly, something nice.` : 'You try to keep your head down. It\'s hard with them glaring.'); }
    if (j) jobScore(j, -.3, 'Avoiding someone'); return R(null, 'You keep your distance. It works, mostly, at the cost of a little ease.');
  }
  if (it.kind === 'mempath') {
    const f = it.film !== undefined ? S.films[it.film] : null;
    if (k === 'leap') { const ok = roll('cha', 15); if (ok && f && f.stage < 3) { const p = makeLead(it.person, f); if (p) p.comp = Math.max(0, (p.comp || 0) - 1.5); me.fame = clamp((me.fame || 0) + 1, 0, 100); return R(ok, `You talk your way in. ${p ? `The ${p.t.toLowerCase()} job on ${f.title} is on your board, and it's yours to lose.` : ''}`); } me.standing = clamp(me.standing - .5, 0, 100); return R(ok, 'Too big a leap, this time. Nobody thinks less of you for trying, much.'); }
    if (k === 'pitch') { const ok = roll('cha', 14); meet(id, 'Power lunch', ok ? 8 : -2); if (ok) { const f2 = liveFilmOf(id); if (f2) makeLead(id, f2); M.freeRef = (M.freeRef || 0) + (f2 ? 0 : 1); return R(ok, `${q.name} likes how you think. ${f2 ? 'There\'s a lead on your board from them by the evening.' : '"Use my name," they say.'}`); } return R(ok, `${q.name} checks their phone during your best line.`); }
    if (k === 'listen') { meet(id, 'Power lunch', 5); trust(id, 6); growSub(me, 'talent', .5); return R(null, 'You learn more in an hour than in a month. They remember you as the one who listened.'); }
    if (k === 'bill') { M.cash -= usd(180); meet(id, 'Power lunch', 7); return R(null, `${q.name} lets you, and remembers.`); }
    if (k === 'onrec') { const ok = roll('cha', 12); if (ok) { me.standing = clamp(me.standing + 2, 0, 100); me.fame = clamp((me.fame || 0) + 1.5, 0, 100); return R(ok, 'The piece runs. Your quote is the one people share. You said what others only think.'); } const pr = S.people.find(x => !x.dead && x.hub === M.hub && x.role === 'producer' && x.standing > 40 && M.known[x.id]); if (pr) { addTie(me, pr, -8); remember(pr.id, -8, 'What you said in the trade press'); } return R(ok, `It comes out sharper in print than you meant.${pr ? ` ${pr.name} reads it as being about them.` : ''}`); }
    if (k === 'offrec') { nudgeStyle('honest', -.5, 'Off the record'); return R(null, 'You give them background. They thank you, a little disappointed.'); }
    if (k === 'deal') { if (f && f.stage < 3) { const p = makeLead(it.person, f); if (p) p.comp = Math.max(0, (p.comp || 0) - 2); } M.opHeat = (M.opHeat || 0) + 1; memOf(it.person).op = 1; addTie(me, P(it.person), 6); return R(null, 'A few calls, a favour returned. The job is on your board. Nobody writes anything down.'); }
    if (k === 'fire') { const ok = roll('cha', 13); if (ok) { me.fame = clamp((me.fame || 0) + 2.5, 0, 100); me.standing = clamp(me.standing + .5, 0, 100); return R(ok, 'Your reply goes everywhere. It\'s funnier than their shot, and meaner.'); } me.standing = clamp(me.standing - 1.5, 0, 100); return R(ok, 'Your reply reads as rattled. They win this round.'); }
    if (k === 'rise') { nudgeStyle('bold', -1, 'Rose above a public shot'); me.standing = clamp(me.standing + .5, 0, 100); return R(null, 'You say nothing. Some people notice that more than a reply.'); }
    return R(null, 'You pass.');
  }
  return false;
}
// How memories and your style count when you apply.
function memFactors(post) {
  const M = S.me, out = [];
  if (post.head !== null && post.head !== undefined && (M.mem || {})[post.head]) { const m = M.mem[post.head], n = memNote(post.head, Math.sign(m.v)); if (Math.abs(m.v) >= 1) out.push([`${P(post.head).name.split(' ')[0]} remembers ${noteShort(n)}`, clamp(m.v * .12, -1.3, 1)]); }
  if (post.head !== null && post.head !== undefined && P(post.head)) {
    let s = 0; for (const id in M.mem || {}) if (+id !== post.head && tie(P(+id), P(post.head)) > 25) s += M.mem[id].v;
    if (Math.abs(s) >= 2) out.push(['What their circle remembers about you', clamp(s * .04, -.8, .8)]);
  }
  if ((M.cvPad || 0) > S.week) out.push(['A polished CV', .4]);
  if ((M.cvTrue || 0) > S.week && post.tier >= 2) out.push(['References check out', .2]);
  if (pathActive('helper') && post.tier <= 2) out.push(['Crews vouch for you (The Good Egg)', .45]);
  if (pathActive('climber') && post.tier >= 2) out.push(['You want it, and it shows (The Climber)', .35]);
  if (pathActive('loyalist') && post.head !== null && post.head !== undefined && (M.mem || {})[post.head] && M.mem[post.head].v > 0) out.push(['They know you stay (The Loyalist)', .6]);
  if (pathActive('operator')) out.push(['You know who to call (The Operator)', .45]);
  if (pathActive('firebrand') && post.head !== null && post.head !== undefined && opinion(post.head) < 0) out.push(['Your mouth got there first (The Firebrand)', -.5]);
  if (pathActive('straight') && post.tier >= 2) out.push(['Your word counts (The Straight Shooter)', .25]);
  return out;
}
{ const _hf = hireFactors; hireFactors = function (post) { const F = _hf(post); if (S.me) F.push(...memFactors(post)); return F; }; }

// ---- the panel ----
function axisBar(v) { const w = Math.round(Math.abs(v) / AX_CAP * 50); return `<span class="axbar"><i class="${v >= 0 ? 'pos' : 'neg'}" style="${v >= 0 ? 'left:50%' : `left:${50 - w}%`};width:${w}%"></i></span>`; }
function memoryHTML() {
  const M = S.me; if (!M) return ''; const St = styleOf();
  const log = (M.styleLog || []).slice(-8).reverse();
  const nm = k => STYLE_AXES.find(a => a[0] === k);
  const mems = Object.entries(M.mem || {}).map(([id, m]) => [+id, m]).filter(([id, m]) => P(id) && !P(id).dead && Math.abs(m.v) >= 1);
  const good = mems.filter(x => x[1].v > 0).sort((a, b) => b[1].v - a[1].v).slice(0, 6), bad = mems.filter(x => x[1].v < 0).sort((a, b) => a[1].v - b[1].v).slice(0, 6);
  const memRow = ([id, m]) => { const n = memNote(id, Math.sign(m.v)); return `<li>${pl(id)} <span class="muted small">${esc(ROLE_LABEL[P(id).role].toLowerCase())}</span> <b class="${m.v > 0 ? 'good' : 'bad'}">${m.v > 0 ? '+' : ''}${m.v.toFixed(1)}</b><br><span class="small muted">${n ? esc(n.t) + (n.x > 1 ? ` ×${n.x}` : '') + ', ' + fmtDate(n.w, true) : ''}</span></li>`; };
  return `<section class="panel mempanel"><h3>Your style, and who remembers</h3>
   <p class="muted small">Every choice says something about you. Hold one style for ${STYLE_WEEKS} weeks and the business starts treating you as that kind of person, which opens a path only that style reaches. Styles fade slowly if you stop.</p>
   <div class="axes">${STYLE_AXES.map(([k, a, b, d]) => `<div class="axrow" title="${esc(d)}"><span class="axl">${b}</span>${axisBar(St[k])}<span class="axr">${a}</span><b class="small">${St[k] > 0 ? '+' : ''}${St[k].toFixed(1)}</b></div>`).join('')}</div>
   ${log.length ? `<h4>Lately</h4><ul class="plain small">${log.map(x => `<li>${esc(x.why)} <span class="muted">${Object.entries(x.d).map(([k, v]) => `${v > 0 ? nm(k)[1] : nm(k)[2]} ${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace(/\.0$/, '')}`).join(', ')} · ${fmtDate(x.w, true)}</span></li>`).join('')}</ul>` : ''}
   <h4>Paths</h4><div class="paths">${Object.entries(STYLE_PATHS).map(([k, p]) => { const P1 = (M.paths || {})[k], act = pathActive(k), run = Math.min(STYLE_WEEKS, (M.pathRun || {})[k] || 0);
     return `<div class="pathcard ${act ? 'on' : P1 && P1.on ? 'dorm' : ''}"><b>${p.icon} ${esc(p.name)}</b> <span class="small muted">${esc(p.need)}</span><p class="small">${esc(p.d)}</p>${act ? `<p class="small good">Active since ${fmtDate(P1.on, true)} · ${esc(p.perk)}</p>` : P1 && P1.on ? `<p class="small bad">Dormant: you've drifted from it. Get back to it to wake it up.</p>` : `<span class="tbar"><i style="width:${Math.round(run / STYLE_WEEKS * 100)}%"></i></span><span class="small muted">${run}/${STYLE_WEEKS} weeks${p.on(St) ? '' : ' (not holding it right now)'}</span>`}</div>`; }).join('')}</div>
   <div class="cols"><div><h4>Remember you fondly</h4>${good.length ? `<ul class="ties">${good.map(memRow).join('')}</ul>` : '<p class="muted small">Nobody yet. Help someone.</p>'}</div>
   <div><h4>Remember you badly</h4>${bad.length ? `<ul class="ties">${bad.map(memRow).join('')}</ul>` : '<p class="muted small">Nobody. Yet.</p>'}</div></div>
   <p class="muted small">What people remember counts when you apply to work for them or their friends, when you end up on the same set, and when they decide whether to send work your way or tell stories about you.</p></section>`;
}
{ const _sh = standingHTML; standingHTML = function () { const h = _sh(); const i = h.indexOf('</section>'); return i < 0 ? memoryHTML() + h : h.slice(0, i + 10) + memoryHTML() + h.slice(i + 10); }; }
// on someone's page: what they remember about you
function memPersonHTML(id) {
  const M = S.me, m = M && (M.mem || {})[id]; if (!m || !m.n.length) return '';
  return `<section class="panel"><h3>What ${esc(P(id).name.split(' ')[0])} remembers about you</h3><p>${m.v >= 1 ? '<b class="good">Fondly, on the whole.</b>' : m.v <= -1 ? '<b class="bad">Not fondly.</b>' : 'Nothing that sticks either way.'}</p><ul class="plain small">${m.n.slice().reverse().map(n => `<li>${n.d > 0 ? '👍' : '👎'} ${esc(n.t)}${n.x > 1 ? ` <b>×${n.x}</b>` : ''} <span class="muted">${fmtDate(n.w, true)}</span></li>`).join('')}</ul></section>`;
}
{ const _vp = viewPerson; viewPerson = function (id) { const h = _vp(id), x = memPersonHTML(id); if (!x) return h; const i = h.indexOf('<div class="cols">'); return i < 0 ? h + x : h.slice(0, i) + x + h.slice(i); }; }

// Choices aren't only in the inbox: what you do with your week says something too.
const ACT_STYLE = { favour: [['amb', .6, 'Called in a favour'], ['gen', -.3, 'Called in a favour']], pitch: [['amb', 1, 'Pitched something'], ['bold', .5, 'Pitched something']], share: [['gen', 1, 'Shared your script with someone']], mentor: [['gen', .5, 'Time with a mentor']], quit: [['loyal', -1.5, 'Walked off a job']] };
{ const _da = applyAct;
  applyAct = function (a) {
    const r = _da(a);
    if (r && S.me && a && ACT_STYLE[a.t]) for (const [k, v, why] of ACT_STYLE[a.t]) nudgeStyle(k, v, why);
    if (r && S.me && a && a.t === 'text' && a.id !== undefined && S.me.known[a.id] && S.week - (S.me.known[a.id].met || 0) > 26) nudgeStyle('loyal', .3, `Kept up with ${P(a.id).name}`);
    if (r && S.me && a && a.t === 'end' && (a.apps || []).length >= 3) nudgeStyle('amb', .15, 'Applied for everything going');
    return r;
  };
}
{ const _fj = finishJob;
  finishJob = function (j, a, quit) { const r = _fj.apply(this, arguments); if (S.me && !quit && j && j.film !== null && j.film !== undefined) { nudgeStyle('loyal', .8, `Saw ${j.t.toLowerCase()} through to the end`); if (j.head !== null && j.head !== undefined && P(j.head)) remember(j.head, 3 + Math.max(0, j.score || 0), `You saw the job through on ${S.films[j.film].title}`, true); } return r; };
}
