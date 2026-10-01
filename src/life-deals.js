// ---------------- Deals: options and your film getting made ----------------
// A finished script can be optioned: a producer pays for the exclusive right to try to get it made, usually for
// eighteen months. Offers come from people who read it and loved it, from a contest win, or from an agent who
// shops it. While the option runs, the producer is out there trying; if they succeed the film goes into production
// in the world like any other, with your name on it as writer, and its quality leans on your script's.
const OPTION_WEEKS = 78;
function canProduce(id) { const q = P(id); return !q.dead && !q.retired && (q.role === 'producer' || q.role === 'director' || q.standing >= 35); }
function optionOffer(sc, pid, why) {
  const M = S.me;
  const held = (M.scripts || []).filter(x => x.option && !x.made);
  if (!sc || !sc.grade || sc.option || sc.made !== undefined || held.length >= 2 || held.some(x => x.option.by === pid) || pending().some(x => x.kind === 'option')) return false;
  const q = P(pid), fee = Math.max(usd(500), Math.round(usd(1200 + sc.score * 45 + q.standing * 35) / 50) * 50);
  meet(pid, null);
  inbox('option', `${q.name} wants ${sc.title}`, `${why} ${q.name} offers ${fmtCash(fee)} for an eighteen-month option: the exclusive right to try to get ${sc.title} made. If it goes into production you'll be paid as its writer and get the credit. If not, the rights come back to you.`, { person: pid, script: sc.id, fee, choices: [{ k: 'yes', label: `Take ${fmtCash(fee)}` }, { k: 'push', label: 'Push for more', check: ['cha', 13] }, { k: 'no', label: 'Keep it for now' }] });
  sms(pid, pickLine(['read your script. we should talk. today?', 'I want to make your film. call me', 'can\'t stop thinking about your script'], pid + S.week), 'tip');
  return true;
}
function dealPick(it, k) {
  if (it.kind !== 'option') return false;
  const M = S.me, me = ME(), sc = (M.scripts || []).find(x => x.id === it.script), q = P(it.person);
  it.done = true; it.picked = k;
  if (!sc || sc.option || sc.made) { it.result = { t: 'The moment has passed.' }; return true; }
  if (k === 'no') { addTie(me, q, -1); it.result = { t: `You thank ${q.name} and keep ${sc.title} in the drawer. For now.` }; return true; }
  let fee = it.fee, extra = '';
  if (k === 'push') {
    const c = it.choices.find(x => x.k === 'push'), ok = roll(c.check[0], c.check[1]);
    if (ok) { fee = Math.round(fee * 1.5 / 50) * 50; extra = ' They grumble, then agree.'; } else { addTie(me, q, -3); extra = ' They hold firm, and you take it anyway.'; }
    it.result = { ok, roll: M.lastRoll };
  }
  M.cash += fee;
  sc.option = { by: it.person, from: S.week, to: S.week + OPTION_WEEKS, fee };
  addTie(me, q, 4);
  milestone(`${sc.title} optioned by ${q.name} for ${fmtCash(fee)}`, 'write');
  it.result = Object.assign(it.result || {}, { t: `${fmtCash(fee)} and a contract. ${q.name} has eighteen months to get ${sc.title} made.${extra}` });
  return true;
}
// Weekly: offers from agents, options lapsing, producers getting films off the ground, your film's progress.
function dealsWeek() {
  const M = S.me, me = ME();
  for (const sc of M.scripts || []) {
    if (!sc.grade) continue;
    if (sc.option && !sc.made) {
      const O = sc.option, q = P(O.by);
      if (q.dead || S.week >= O.to) { sc.option = null; sc.lapsed = (sc.lapsed || 0) + 1; inbox('note', `The option on ${sc.title} lapses`, `${q.dead ? q.name + ' has died, and' : 'Eighteen months and'} no green light. The rights to ${sc.title} come back to you. Plenty of films took three tries.`); continue; }
      const p = .002 + Math.max(0, sc.score - 60) / 12000 + q.standing / 20000 + (sc.won ? .003 : 0);   // most options lapse
      if (prnd() < p) {
        const co = S.companies.find(c => c.hub === M.hub && c.closed === null && (c.favors[O.by] || 0) > 0);
        const f = greenlight(M.hub, { genre: sc.genre, wri: [me.id], title: sc.title, prod: q.role === 'producer' ? O.by : undefined, co: co ? co.id : undefined, score: sc.score });
        sc.made = f.id; f.xc = f.xc || {}; f.xc[me.id] = 'Screenplay';
        const pay = clamp(Math.round(f.budget * 1e6 * .012 / 100) * 100, usd(20000), usd(300000));
        M.cash += pay; me.standing = clamp(me.standing + 3, 0, 100);
        milestone(`${sc.title} is going into production`, 'credit');
        inbox('news', `Green light: ${sc.title}`, `${q.name} has done it. ${f.title} goes into production with a ${fmtM(f.budget)} budget, directed by ${P(f.dir).name}, starring ${P(f.cast[0]).name}. Your writer's fee: ${fmtCash(pay)}. Your name is on it.`, { film: f.id });
        sms(O.by, 'WE ARE MAKING YOUR FILM', 'tip');
      }
    }
    if (sc.made !== undefined && !sc.toldRel) {
      const f = S.films[sc.made];
      if (f.stage < 0) { sc.toldRel = 1; inbox('note', `${f.title} falls apart`, 'The production collapses in development. It happens to most films. The script is still yours to try again.'); sc.made = undefined; sc.option = null; }
      else if (f.rel !== null) {
        sc.toldRel = 1;
        milestone(`Your film ${f.title} opened: ${f.reviews}/100 from critics, ${fmtM(f.total)} worldwide`, 'film');
        inbox('news', `${f.title} opens`, `Your film is in cinemas. Critics: ${f.reviews}/100. ${f.hitRatio > 2 ? 'It\'s a hit.' : f.hitRatio < .8 ? 'Audiences stay away.' : 'Steady business.'} Written by you.`, { film: f.id });
      }
    }
    // an agent who represents writers shops your best work
    if (!sc.option && !sc.made && M.agent && ['lit', 'all'].includes(M.agent.focus) && sc.score >= 62 && prnd() < .02) {
      const pr = bestIn(M.hub, ['producer'], q => q.standing - Math.abs(q.standing - 30 - sc.score / 4) + prnd() * 20) || null;
      if (pr) optionOffer(sc, pr.id, `${M.agent.name} sent ${sc.title} out.`);
    }
  }
}
// Someone who read your script and loved it might want it.
function shareMayOption(sc, id, score) {
  if (score >= 78 && canProduce(id) && prnd() < .3) optionOffer(sc, id, `${P(id).name} read ${sc.title} and won't stop talking about it.`);
}
function contestMayOption(sc) {
  const pr = bestIn(S.me.hub, ['producer'], q => q.standing + prnd() * 30);
  if (pr && prnd() < .6) optionOffer(sc, pr.id, `${pr.name} saw ${sc.title} on the contest list.`);
}
// ---- Awards night ----
// Each February your market's Film Awards hold their ceremony. If you worked on a nominee, wrote one, know a
// nominee well or have the standing, you're invited; otherwise you watch it on television like everyone else.
function awardsMarket() { return HUBS[S.me.hub].m; }
function awardsThisYear() { const mk = MARKETS[awardsMarket()].name; return (S.awards || []).filter(a => a.y === S.year && a.name.startsWith(mk + ' Film Awards')); }
function awardsNominees() {
  const m = awardsMarket(), L = S.films.filter(f => f.rel !== null && f.ry === S.year - 1 && f.m === m).sort((a, b) => b.q - a.q).slice(0, 5);
  for (const a of awardsThisYear()) if (!L.some(f => f.id === a.film)) L.push(S.films[a.film]);
  return L;
}
function awardsWeek() {
  const M = S.me, me = ME(), mo = dateOf(S.week).getUTCMonth();
  if (mo !== 1 || M.awardsY === S.year) return;
  const wins = awardsThisYear();
  if (!wins.length) return;
  M.awardsY = S.year;
  const noms = awardsNominees(), mine = noms.filter(f => M.past.some(p => p.film === f.id) || f.wri.includes(me.id) || keyIds(f).includes(me.id));
  const friend = noms.flatMap(f => [f.dir, f.prod, f.cast[0]]).find(id => M.known[id] && ['friend', 'close', 'partner', 'mentor'].includes(relOf(id)));
  const host = mine.length ? mine[0].prod : friend;
  const slot = freeSlot({ days: [5], blocks: [2], from: 0 });
  const mk = MARKETS[awardsMarket()].name;
  // the night itself is a week away: a nominee's team, a friend's plus-one, or a ticket your standing earns
  if (slot && (mine.length || friend !== undefined || me.standing >= 30 || (M.agent && M.agent.tier >= 2))) {
    const why = mine.length ? `${mine[0].title}, which you worked on, is nominated.` : friend !== undefined ? `${P(friend).name} is nominated and wants you as their plus-one.` : 'Your name is on the list now.';
    inbox('invite', `The ${mk} Film Awards`, `${why} The ceremony is ${slotLabel(slot)}. Black tie, a long night, and the whole business in one room.`, { person: host !== undefined && host !== null ? host : noms[0].prod, ev: 'awards', slot, what: `the ${mk} Film Awards`, choices: [{ k: 'yes', label: `Go (${slotLabel(slot)})` }, { k: 'no', label: 'Watch it at home' }] });
  } else {
    const best = wins.find(a => /Best Film/.test(a.name));
    inbox('note', `The ${mk} Film Awards`, `You watch on television with a takeaway.${best ? ` ${S.films[best.film].title} wins Best Film.` : ''} One day, you tell yourself.`);
  }
}
function awardsNight(x, L) {
  const M = S.me, me = ME(), wins = awardsThisYear();
  for (const a of wins) L.push(`${a.name.replace(/^.* Film Awards: /, '')}: ${S.films[a.film].title}${a.people.length ? ' (' + a.people.map(id => id === me.id ? 'you' : P(id).name).join(', ') + ')' : ''}.`);
  const mineWon = wins.filter(a => M.past.some(p => p.film === a.film && p.credited) || a.people.includes(me.id));
  for (const a of mineWon) {
    const self = a.people.includes(me.id);
    milestone(self ? `Won ${a.name} for ${S.films[a.film].title}` : `${S.films[a.film].title}, which you worked on, won ${a.name.replace(/^.* Film Awards: /, '')}`, 'prize');
    if (self) { me.fame = clamp((me.fame || 0) + 6, 0, 100); L.push('They call your name. You don\'t remember walking to the stage.'); }
    else me.standing = clamp(me.standing + 1, 0, 100);
  }
  const star = wins.length ? wins[0].people[0] : null;
  const ctx = { head: null, film: wins.length ? wins[0].film : null, mates: [], contact: x.who ?? null, star: star !== undefined && star !== me.id ? star : null };
  const s = SCENES.find(y => y.id === 'aw_night');
  inbox('scene', s.title, fillScene(s.text, ctx), { scene: s.id, ctx, choices: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) });
}
SCENES.push({ event: 1, jobs: [], id: 'aw_night', title: 'After the envelopes', text: 'The ceremony is over. {star} walks past your table holding the statue like it might bite. The after-party is starting upstairs.', opts: [
  { k: 'room', label: 'Work the after-party', check: ['cha', 13], ok: { meet: 1, stand: .6, tie: { contact: 2 } }, bad: { stress: 4 }, t: 'Three conversations that matter and one you\'ll be telling for years.', tb: 'You end up by the coat check talking to a waiter. A lovely waiter.' },
  { k: 'star', label: 'Congratulate {star}', check: ['com', 12], ok: { tie: { star: 8 }, tag: { star: 'Met at the awards' } }, bad: { tie: { star: 1 } }, t: '{star} actually stops. "Thank you. Who are you?" You tell them.', tb: 'A handshake, a glazed smile, gone.' },
  { k: 'table', label: 'Stay with the people who brought you', ok: { tie: { contact: 6 }, stress: -3 }, t: 'Loyalty, champagne and a long walk home in uncomfortable shoes.' }] });
