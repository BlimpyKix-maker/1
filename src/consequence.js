// ---------------- Consequences ----------------
// People remember. Everyone has a temperament: some forgive and drift back to fond, some are fair and let it go in
// time, some never forget. Push someone far enough and they blackball you: their close friends hear about it, and
// it shows when you apply to anyone in that circle. Win someone over and they champion you: they vouch for you and
// introduce you to the people they trust. Temperament comes from traits and a hash; the weekly check spends no dice.
const TEMPER = { grudge: { label: 'Holds a grudge', line: -15, drift: 0 }, fair: { label: 'Fair-minded', line: -25, drift: .25 }, forgive: { label: 'Forgiving', line: -40, drift: .6 } };
function temperOf(p) {
  if (p.traits.some(t => ['Difficult', 'Volatile', 'Stubborn', 'Ruthless', 'Sensitive'].includes(t))) return 'grudge';
  if (p.traits.some(t => ['Kind', 'Calm', 'Diplomatic', 'Humble', 'Beloved', 'Optimist'].includes(t))) return 'forgive';
  const r = hashRand(p.id * 911 + 5)();
  return r < .25 ? 'grudge' : r < .55 ? 'forgive' : 'fair';
}
function circleOf(p, n = 6) { return Object.entries(p.ties).filter(([k, v]) => v > 25 && P(+k) && !P(+k).dead && !P(+k).player).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => +k); }
function consequenceWeek() {
  const M = S.me, me = ME();
  M.black = M.black || {}; M.champ = M.champ || {};
  for (const id of aliveKnown()) {
    const p = P(id), T = temperOf(p), o = opinion(id), b = M.black[id];
    // time heals, depending on who it is
    if (o < 0 && !b && TEMPER[T].drift) addTie(me, p, TEMPER[T].drift);
    if (!b && o <= TEMPER[T].line) {
      M.black[id] = { w: S.week, t: T };
      const circle = circleOf(p);
      for (const q of circle) { addTie(me, P(q), -4); if (M.known[q] && !M.known[q].tags.includes('Heard bad things')) M.known[q].tags.push('Heard bad things'); }
      inbox('note', `${p.name} has it in for you`, `${p.name} (${ROLE_LABEL[p.role].toLowerCase()}) has decided you're trouble, and says so. ${circle.length ? `Their circle hears it first: ${circle.slice(0, 4).map(q => P(q).name).join(', ')}${circle.length > 4 ? ' and others' : ''}. Expect a cooler welcome there.` : 'Luckily they don\'t have many friends in the business.'} ${T === 'grudge' ? 'They are not the forgiving kind.' : T === 'fair' ? 'Give it time, or make amends.' : 'They\'ll probably come round.'}`, { person: id });
      milestone(`Fell out with ${p.name}`, 'life');
    } else if (b && (o >= -5 || (b.t !== 'grudge' && S.week - b.w > (b.t === 'forgive' ? 52 : 156)))) {
      delete M.black[id];
      inbox('note', `${p.name} lets it go`, `${o >= -5 ? 'Whatever happened between you is done.' : 'Enough time has passed.'} ${p.name}'s circle stops bringing it up.`, { person: id });
    }
    // champions: people of standing who rate you open their address book
    if (!M.champ[id] && o >= 45 && p.standing >= 35) {
      M.champ[id] = S.week;
      const circle = circleOf(p, 8).filter(q => q !== M.id);
      for (const q of circle) addTie(me, P(q), 2);
      const intro = circle.find(q => !M.known[q]);
      if (intro !== undefined) meet(intro, `Introduced by ${p.name}`, 8);
      inbox('note', `${p.name} is in your corner`, `${p.name} has started vouching for you.${intro !== undefined ? ` They introduce you to ${P(intro).name} (${ROLE_LABEL[P(intro).role].toLowerCase()}).` : ''} People in their circle take your calls a little faster now.`, { person: id });
      milestone(`${p.name} became a champion of your work`, 'life');
    } else if (M.champ[id] && o < 25) { delete M.champ[id]; inbox('note', `${p.name} has gone quiet`, `${p.name} doesn't mention you the way they used to.`, { person: id }); }
    else if (M.champ[id] && (S.week - M.champ[id]) % 26 === 25) { const intro = circleOf(p, 10).find(q => !M.known[q] && q !== M.id); if (intro !== undefined) { meet(intro, `Introduced by ${p.name}`, 6); sms(id, pickLine([`you should meet ${P(intro).name}. I've told them about you`, `${P(intro).name} is looking for people like you. call them`, `introducing you to ${P(intro).name}. be nice`], id + S.week), 'tip'); } }
  }
}
// What grudges and champions do to a job application.
function circleFactors(post) {
  const M = S.me, out = [];
  if (post.head === null || post.head === undefined || !P(post.head)) return out;
  const h = P(post.head), B = Object.keys(M.black || {}).map(Number), C = Object.keys(M.champ || {}).map(Number);
  if (B.includes(post.head)) out.push([`${h.name} has it in for you`, -1.8]);
  else { const b = B.find(id => tie(P(id), h) > 25); if (b !== undefined) out.push([`Heard about you from ${P(b).name}`, TEMPER[temperOf(P(b))].label === 'Holds a grudge' ? -.8 : -.5]); }
  if (C.includes(post.head)) out.push([`${h.name} is in your corner`, .9]);
  else { const c = C.find(id => tie(P(id), h) > 25); if (c !== undefined) out.push([`${P(c).name} vouched for you`, .55]); }
  return out;
}
// Making amends: a logged action with a roll. How hard depends on who you're apologising to.
function apologise(id) {
  const M = S.me, me = ME(), k = M.known[id], q = P(id);
  if (!k || q.dead || opinion(id) >= -5 || (k.sorryW !== undefined && S.week - k.sorryW < 8)) return false;
  k.sorryW = S.week;
  const T = temperOf(q), dc = { forgive: 9, fair: 12, grudge: 16 }[T];
  sms(-1, pickLine(['I owe you an apology. I got it wrong, and I\'m sorry', 'can we talk? I\'ve been thinking about what happened, and I was out of line', 'I\'m sorry. no excuses. I hope we can work together again one day'], id + S.week), 'mine', { to: id });
  if (roll('cha', dc)) { addTie(me, q, T === 'grudge' ? 8 : 14); k.trust = clamp(k.trust + 5, 0, 100); sms(id, pickLine(['...thank you for saying that. ok. we\'re ok', 'appreciated. let\'s start again', 'that means a lot. coffee sometime'], id), 'text'); }
  else { addTie(me, q, -2); sms(id, T === 'grudge' ? pickLine(['no.', 'too late for that', 'save it'], id) : pickLine(['I need some time', 'I hear you. not yet though', 'maybe one day'], id), 'text'); }
  return true;
}
function circleHTML() {
  const M = S.me, B = Object.entries(M.black || {}), C = Object.entries(M.champ || {});
  if (!B.length && !C.length) return '';
  return `<section class="panel"><h3>Who's for you, who's against you</h3>
   ${C.length ? `<p><b>In your corner:</b> ${C.map(([id]) => pl(+id)).join(', ')}</p>` : ''}
   ${B.length ? `<p><b>Has it in for you:</b> ${B.map(([id, b]) => `${pl(+id)} <span class="muted small">(${esc(TEMPER[b.t].label.toLowerCase())}, since ${fmtDate(b.w, true)})</span>`).join(', ')}</p><p class="muted small">Their close friends hear about it, and it counts against you when you apply to anyone in their circle. Text them an apology to try to make amends.</p>` : ''}</section>`;
}
