// ---------------- Birthdays ----------------
// Everyone has one. The people closest to you notice whether you remembered: a text is the minimum, a gift on the
// day counts double, and forgetting someone in your inner circle is noticed. Upcoming birthdays show in Up next.
function bday(id) { return Math.floor(gH(id, 'bday') * 52); }
function bdayPeople() { const M = S.me, IC = typeof innerCircle === 'function' ? innerCircle().filter(x => x[1] >= 2).map(x => x[0]) : []; return IC.concat(aliveKnown().filter(id => !IC.includes(id) && opinion(id) >= 60)).filter(id => P(id) && !P(id).dead && id !== ME().id).slice(0, 8); }
function bdayWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return; const k = woy(), IC = new Set(typeof innerCircle === 'function' ? innerCircle().filter(x => x[1] >= 2).map(x => x[0]) : []);
  // last week's birthdays: did you remember?
  for (const id of Object.keys(M.bdayDue || {}).map(Number)) { const d = M.bdayDue[id]; if (S.week - d.w >= 1) { if (!d.done && IC.has(id) && P(id)) { addTie(me, P(id), -3); if (typeof remember === 'function') remember(id, -2, 'Forgot their birthday'); } delete M.bdayDue[id]; } }
  for (const id of bdayPeople()) if (bday(id) === k && !(M.bdayDue || {})[id]) { (M.bdayDue = M.bdayDue || {})[id] = { w: S.week };
    inbox('bday', `${P(id).name.split(' ')[0]}'s birthday`, `It's ${P(id).name}'s birthday this week.${IC.has(id) ? ' They\'re in your inner circle: they\'ll notice either way.' : ''}${(M.bz || []).some(x => !x.sold && !x.used && (BZ_BY[x.k] || {}).gift) ? ' You have a gift you could give (Bazaar → Yours): this week it counts double.' : ''}`, { person: id, choices: [{ k: 'bd_text', label: 'Send a birthday text' }, { k: 'bd_call', label: 'Call them' }, { k: 'bd_skip', label: 'Let it pass' }] }); }
}
function bdayPick(it, k) {
  if (it.kind !== 'bday') return false; it.done = true; const M = S.me, me = ME(), id = it.person, q = P(id); if (!q) return true; const d = (M.bdayDue || {})[id];
  if (k === 'bd_skip') { it.result = { t: 'The week goes by.' }; return true; }
  if (d) d.done = 1; addTie(me, q, k === 'bd_call' ? 3 : 2); if (k === 'bd_call') M.energy = clamp(M.energy - 2, 0, 100); (M.known[id] || {}).seen = S.week;
  if (typeof sms === 'function') sms(id, k === 'bd_call' ? 'that call made my day. thank you' : pickLine(['thank you!! you remembered', 'aw thanks. drinks soon?', 'thank you ♥'], id + S.week));
  it.result = { t: k === 'bd_call' ? `Twenty minutes on the phone. ${q.name.split(' ')[0]} sounds genuinely pleased.` : 'A text, a heart back. Small things.' }; return true;
}
// a gift in the birthday week counts double
{ const _ga = giftAct; giftAct = function (a) { const M = S.me, me = ME(), q = P(a.to), before = q ? (me.ties[a.to] || 0) : 0, ok = _ga(a); if (ok && q && (M.bdayDue || {})[a.to] && S.week - M.bdayDue[a.to].w < 1) { const gain = (me.ties[a.to] || 0) - before; if (gain > 0) addTie(me, q, gain); M.bdayDue[a.to].done = 1; diary(`On ${q.name.split(' ')[0]}'s birthday, too.`); } return ok; }; }
// birthdays coming up go in the strip under your name
{ const _hn = typeof hpNext === 'function' ? hpNext : null; if (_hn) hpNext = function () { const L = _hn(), k = woy(); const b = bdayPeople().map(id => [id, (bday(id) - k + 52) % 52]).filter(x => x[1] <= 1).sort((a, b) => a[1] - b[1])[0]; if (b && L.length < 5) L.splice(Math.min(2, L.length), 0, { i: '🎂', t: `${P(b[0]).name.split(' ')[0]}'s birthday ${b[1] ? 'next week' : 'this week'}`, go: 'computer:bazaar' }); return L.slice(0, 4); }; }
