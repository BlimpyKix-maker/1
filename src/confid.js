// ---------------- Confidants, and the habits that become your image ----------------
// Confidants (after Persona). Everything that brings you closer to someone (time together, a kind word, a gift, work
// done well side by side) also counts towards a rank with them, one to ten. Ranks open perks: at 2 they put in a
// word for you on their jobs, at 4 they owe you a favour every season, at 6 you start picking up their craft, at 8
// their word counts double, at 10 they'd follow you anywhere. At 3, 6 and 9 they need something from you by a date
// (an opening night, a move, a bad week). Be there and you're closer; say you can't and the rank stalls for six months.
// Fame quirks (after The Sims). Once people know your name, what you keep doing becomes what you're known for: the
// one always on their phone, the one at every festival, the generous one, the one at the tables. A quirk is a small
// advantage and a small cost on the rolls it touches; stop the habit for long enough and it fades.
const CFD_AT = [0, 6, 14, 24, 36, 50, 66, 84, 104, 126, 150];
const CFD_PERK = { 2: 'puts in a word on their jobs', 4: 'owes you a favour every season', 6: 'you pick up their craft', 8: 'their word counts double', 10: 'would follow you onto anything' };
function cfdOf() { return (S.me.cfd = S.me.cfd || {}); }
function cfdRank(id) { const c = (cfdOf()[id] || {}).p || 0; let r = 0; for (let i = 0; i < CFD_AT.length; i++) if (c >= CFD_AT[i]) r = i; return r; }
function cfdNext(id) { const r = cfdRank(id); return r >= 10 ? null : CFD_AT[r + 1]; }
// closeness counts towards a rank (only with people you know, only the good kind, and not while a rank is stalled)
{ const _at = addTie; addTie = function (a, b, v) {
  _at(a, b, v); const M = S.me; if (!M || !M.known || !(v > 0) || !a || !b) return; const me = ME(), other = a === me ? b : b === me ? a : null; if (!other || !M.known[other.id]) return;
  const c = cfdOf()[other.id] = cfdOf()[other.id] || { p: 0 }; if (c.stall && S.week < c.stall) return; const r0 = cfdRank(other.id); c.p += Math.min(v, 6) * .35;
  const r1 = cfdRank(other.id); if (r1 > r0) { c.up = S.week; if (r1 === 3 || r1 === 6 || r1 === 9) c.arc = r1; if (r1 >= 5) milestone(`${other.name} is a confidant (rank ${r1})`, 'love'); } }; }
const CFD_ARCS = { 3: ['their opening night', 'They have a first night on Friday week: a play, a gallery, a screening of their short. They\'d love you there.', 6], 6: ['moving house', 'They\'re moving on Saturday week and the van fell through. They hate asking.', 10], 9: ['a bad week', 'Something has gone badly wrong for them, the kind of week you don\'t text about. They ask if you can come round.', 14] };
function cfdWeek() {
  const M = S.me, me = ME(); if (!M || !M.cfd) return;
  for (const [id, c] of Object.entries(M.cfd)) { const q = P(+id); if (!q || q.dead) continue; const r = cfdRank(+id);
    if (c.arc && !pending().some(it => it.kind === 'cfd' && it.person === +id)) { const A = CFD_ARCS[c.arc]; inbox('cfd', `${q.name.split(' ')[0]}: ${A[0]}`, `${A[1]} It costs you the evening and the energy; saying no stalls things between you for six months.`, { person: +id, arc: c.arc, choices: [{ k: 'cf_be', label: `Be there (−${A[2]} energy)` }, { k: 'cf_cant', label: 'You can\'t make it' }] }); delete c.arc; }
    if (r >= 4 && S.week % 13 === (+id % 13) && M.known[id]) { M.known[id].due = Math.min(3, (M.known[id].due || 0) + 1); }
    if (r >= 6) { const sub = Object.keys((CRAFTS[MAIN[q.role]] || { subs: {} }).subs)[0]; if (sub && me.sk[sub] !== undefined) growSub(me, sub, .006); } }
}
function cfdPick(it, k) {
  if (it.kind !== 'cfd') return false; it.done = true; const M = S.me, me = ME(), q = P(it.person), c = cfdOf()[it.person] || {};
  if (k === 'cf_be') { M.energy = clamp(M.energy - CFD_ARCS[it.arc][2], 0, 100); c.p += 6; if (q) { addTie(me, q, 4); if (typeof remember === 'function') remember(it.person, 5, `Was there for ${CFD_ARCS[it.arc][0]}`); } it.result = { t: it.arc === 3 ? 'You\'re in the front row. They see you from the stage and nearly lose their place.' : it.arc === 6 ? 'Eleven boxes of books, a sofa that won\'t turn the corner, pizza on the floor. They won\'t forget it.' : 'You sit up with them until it gets light. You don\'t say much. It\'s the right amount.' }; return true; }
  c.p = Math.max(CFD_AT[it.arc], (c.p || 0) - 4); c.stall = S.week + 26; it.result = { t: '"No worries," they say. You can hear that there are.' }; return true;
}
{ const _hf = hireFactors; hireFactors = function (post) {
  const F = _hf(post); if (!S.me || !S.me.cfd) return F; const f = post.film !== null && post.film !== undefined ? S.films[post.film] : null, ids = new Set((f ? keyIds(f) : []).concat(post.head !== null && post.head !== undefined ? [post.head] : []));
  let best = 0, who = null; for (const id of ids) { const r = cfdRank(id); if (r > best) { best = r; who = id; } }
  if (best >= 2) F.push([`${P(who).name.split(' ')[0]} vouches for you (confidant ${best})`, best >= 10 ? 1.2 : best >= 8 ? .9 : best >= 5 ? .45 : .25]); return F; }; }
function cfdHTML() {
  const L = Object.entries(S.me.cfd || {}).map(([id, c]) => [+id, c]).filter(([id]) => P(id) && !P(id).dead && cfdRank(id) >= 1).sort((a, b) => b[1].p - a[1].p).slice(0, 10); if (!L.length) return '';
  return `<section class="panel"><h3>Confidants</h3><div class="tk-bars">${L.map(([id, c]) => { const r = cfdRank(id), nx = cfdNext(id), lo = CFD_AT[r], np = Object.keys(CFD_PERK).map(Number).find(x => x > r);
    return `<div class="ambrow"><span>${pl(id)} <b class="small">rank ${r}</b></span><span class="tbar"><i style="width:${nx ? Math.round((c.p - lo) / (nx - lo) * 100) : 100}%"></i></span><span class="small muted">${c.stall && S.week < c.stall ? `stalled until ${fmtDate(c.stall, true)}` : np ? `at ${np}: ${CFD_PERK[np]}` : 'as close as it gets'}</span><span class="small">${Object.keys(CFD_PERK).map(Number).filter(x => x <= r).map(x => '✓ ' + CFD_PERK[x]).slice(-2).join(' · ')}</span></div>`; }).join('')}</div><p class="small muted">Everything that brings you closer counts. At ranks 3, 6 and 9 they'll ask something of you; say no and the rank stalls for six months.</p></section>`;
}
{ const _pv = OS_VIEWS.people; if (_pv) OS_VIEWS.people = () => cfdHTML() + _pv(); }

// ---- fame quirks ----
const QUIRKS = {
  phone: ['Phone fanatic', a => a.cgpost + a.like >= 40, { adv: ['mkt'], dis: ['com'] }, 'Always posting. Advantage on marketing; disadvantage on composure.'],
  texter: ['Always reachable', a => a.text + a.reply >= 40, { adv: ['cha'], dis: ['eth'] }, 'Answers every message within minutes. Advantage on charisma; disadvantage on work ethic.'],
  gambler: ['Known at the tables', a => a.luck >= 12, { dis: ['com', 'fin'] }, 'The casinos know your name. Disadvantage on composure and finance.'],
  generous: ['Generous to a fault', a => a.gift >= 5, { adv: ['col'] }, 'Everyone has a present from you. Advantage on collaboration.'],
  festival: ['Festival regular', a => a.festival + a.trip >= 4, { adv: ['pack'] }, 'At every festival, every year. Advantage on packaging.'],
  candid: ['Says what they think', a => a.j_candid >= 2, { adv: ['com'], dis: ['cha'] }, 'Interviews you give become headlines. Advantage on composure; disadvantage on charisma.'],
  shy: ['Media-shy', a => a.j_deflect >= 2, { adv: ['tas'], dis: ['cha'] }, 'Rarely gives interviews. Advantage on taste; disadvantage on charisma.'],
  schemer: ['Has a reputation', a => a.scheme >= 3, { dis: ['col'] }, 'People wonder what you\'re up to. Disadvantage on collaboration.'],
  spender: ['Big spender', a => a.bazaar >= 10, { adv: ['pack'], dis: ['fin'] }, 'Always buying something. Advantage on packaging; disadvantage on finance.']
};
const QUIRK_KEYS = ['cgpost', 'like', 'text', 'reply', 'luck', 'gift', 'festival', 'trip', 'scheme', 'bazaar'];
{ const _aa = applyAct; applyAct = function (a) {
  const ok = _aa(a); const M = S.me; if (!ok || !M || !a) return ok;
  const k = a.t === 'pick' && /^j_/.test(a.k || '') ? a.k : QUIRK_KEYS.includes(a.t) ? a.t : null; if (k) { const L = (M.acts = M.acts || {})[k] = (M.acts[k] || []); L.push(S.week); if (L.length > 60) L.shift(); }
  return ok; }; }
function quirkCounts(span = 26) { const A = (S.me && S.me.acts) || {}, out = {}; for (const k of QUIRK_KEYS.concat(['j_candid', 'j_deflect'])) out[k] = (A[k] || []).filter(w => S.week - w < span).length; return out; }
function quirkWeek() {
  const M = S.me, me = ME(); if (!M || woy() % 4) return; const Q = M.quirks = M.quirks || {}, C = quirkCounts();
  for (const [k, [l, test]] of Object.entries(QUIRKS)) {
    if (!Q[k] && (me.fame || 0) >= 5 && test(C)) { Q[k] = S.week; news('People', `The trades have a word for ${me.name} now: ${l.toLowerCase()}.`); diary(`You notice people describing you as "${l.toLowerCase()}". It's stuck.`); }
    else if (Q[k] && S.week - Q[k] > 26 && !test(Object.fromEntries(Object.entries(C).map(([x, v]) => [x, v * 1.5])))) { delete Q[k]; diary(`Nobody calls you "${l.toLowerCase()}" any more.`); }
  }
}
{ const _co = conditionsOf; conditionsOf = function () { const C = _co(), M = S.me; if (!M || !M.quirks) return C; for (const k of Object.keys(M.quirks)) { const Q = QUIRKS[k]; if (Q) C.push(Object.assign({ k: 'q_' + k, label: `🎭 ${Q[0]}`, d: `A fame quirk. ${Q[3]}` }, Q[2])); } return C; }; }
