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
  marketWeek(); holdingsWeek(); companyWeek(); festWeek();
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
      ownFilmOffer(sc);
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
// ---- A job on your own film ----
// When your script is in production, its people want you around: they offer the best job on it that fits your craft.
function ownFilmOffer(sc) {
  const M = S.me, me = ME(), f = S.films[sc.made];
  if (!f || f.stage < 0 || f.stage >= 4 || sc.jobStage === f.stage || M.jobs.some(j => j.film === f.id) || pending().some(x => x.kind === 'offer' && x.post.film === f.id)) return;
  sc.jobStage = f.stage;
  const craft = MAIN[me.role], L = careerLevel();
  const fit = t => (t.subs.some(k => SUB2C[k] === craft) ? 3 : 0) + (t.subs.some(k => SUB2C[k] === 'wri') ? 1 : 0) + Math.min(t.tier, L + 1) - (t.tier > L + 1 ? 4 : 0);
  const opts = POSTS.filter(t => !t.cat && t.st.includes(f.stage) && headOf(f, t.head) !== null && !blockedFrom(t)).sort((a, b) => fit(b) - fit(a));
  if (!opts.length || fit(opts[0]) < 1) return;
  const post = makePost(opts[0], f);
  inbox('offer', `${f.title} wants you on it`, `It's your script, and they want you in the room: ${offerText(post)}`, { post, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] });
}
// ---- Producing: option someone else's script and get it made ----
// Writers you know (and some you don't) have specs looking for a home. Read them, option the one you believe in,
// then pitch it to the companies in town. Your packaging and standing do the pitching; a yes means you produce.
function marketWeek() {
  const M = S.me, me = ME();
  M.market = (M.market || []).filter(x => S.week - x.w < 12);
  const keen = me.role === 'producer' || careerLevel() >= 2 || me.c.pro >= 9;
  if (M.market.length >= 4 || prnd() > (keen ? .22 : .08)) return;
  const known = aliveKnown().filter(id => (P(id).role === 'writer' || P(id).c.wri >= 10) && !M.market.some(x => x.writer === id));
  const w = known.length && prnd() < .6 ? P(ppick(known)) : bestIn(M.hub, ['writer'], q => q.c.wri + prnd() * 10);
  if (!w) return;
  const genre = ppick(tasteOf(w).genres), score = clamp(Math.round(w.c.wri * 3 + 12 + (prnd() - .5) * 40), 10, 95);
  M.market.push({ id: M.seq++, writer: w.id, title: titleFor(genre, M.hub), genre, theme: tasteOf(w).theme, score, price: Math.round(usd(700 + score * 35) / 50) * 50, w: S.week });
}
// How good you think it is: the sharper your Taste, the closer to the truth. Stable for each script.
function coverage(x) { const r = hashRand(x.id * 17 + 3)(), err = (r - .5) * 2 * Math.max(2, (20 - ME().mind.tas) * 2); return clamp(Math.round(x.score + err), 5, 99); }
function gradeOf(v) { return v >= 85 ? 'A' : v >= 70 ? 'B' : v >= 55 ? 'C' : v >= 40 ? 'D' : 'F'; }
function optionSpec(a) {
  const M = S.me, x = (M.market || []).find(y => y.id === a.id);
  if (!x || M.cash < x.price || (M.holdings || []).filter(h => h.made === undefined && !h.lapsed).length >= 2) return false;
  M.cash -= x.price; M.market = M.market.filter(y => y !== x);
  (M.holdings = M.holdings || []).push(Object.assign({}, x, { from: S.week, to: S.week + OPTION_WEEKS, pitched: {} }));
  meet(x.writer, 'You optioned their script', 6);
  sms(x.writer, pickLine(['you optioned my script?? I\'m crying', 'thank you for believing in it. truly', 'ok. let\'s make this thing'], x.id), 'tip');
  milestone(`Optioned ${x.title} by ${P(x.writer).name}`, 'work');
  return true;
}
function pitchDC(h, co) { return Math.round(clamp(({ 1: 21, 2: 18, 3: 16 }[co.tier] || 17) - (h.score - 60) / 10 - ME().standing / 25 - (S.me.agent ? 1 : 0), 8, 20)); }
// a company makes at most one of your pitches a year, and you can pitch once a week
function canPitch(h, co) { const M = S.me; return M.pitchW !== curW() && !(M.coYes || {})[co.id] && !(h.pitched[co.id] && S.week - h.pitched[co.id] < 8); }
function pitchSpec(a) {
  const M = S.me, me = ME(), h = (M.holdings || []).find(y => y.id === a.id), co = S.companies[a.co];
  if (!h || h.made !== undefined || !co || co.closed !== null || co.hub !== M.hub || !canPitch(h, co)) return false;
  h.pitched[co.id] = S.week; M.pitchW = curW();
  const ok = roll('pack', pitchDC(h, co)), r = M.lastRoll;
  if (!ok) { inbox('note', `${co.name} passes on ${h.title}`, `${pickLine(['"Not for us right now."', '"Love the writing, can\'t see the audience."', '"Bring it back with a star attached."', '"We have something too similar in development."'], h.id + co.id)} You can pitch it elsewhere.`, { result: { ok: false, roll: r, t: 'They pass.' } }); return true; }
  const f = greenlight(M.hub, { genre: h.genre, wri: [h.writer], title: h.title, prod: me.id, co: co.id, score: h.score });
  h.made = f.id; f.xc = f.xc || {}; f.xc[me.id] = 'Producer'; (M.coYes = M.coYes || {})[co.id] = S.week;
  const fee = clamp(Math.round(f.budget * 1e6 * .015 / 100) * 100, usd(15000), usd(400000));
  M.cash += fee; me.standing = clamp(me.standing + 3, 0, 100);
  addTie(me, P(h.writer), 10);
  sms(h.writer, 'THEY SAID YES. WE\'RE MAKING IT', 'tip');
  milestone(`${co.name} greenlit ${f.title}: you're producing`, 'credit');
  inbox('news', `Green light: ${f.title}`, `${co.name} says yes. ${f.title} goes into production with a ${fmtM(f.budget)} budget, directed by ${P(f.dir).name}. You're the producer; your fee is ${fmtCash(fee)}.`, { film: f.id, result: { ok: true, roll: r, t: 'They\'re in.' } });
  return true;
}
function holdingsWeek() {
  const M = S.me;
  for (const k in M.coYes || {}) if (S.week - M.coYes[k] >= 52) delete M.coYes[k];
  for (const h of M.holdings || []) {
    if (h.made === undefined && S.week >= h.to && !h.lapsed) { h.lapsed = 1; inbox('note', `Your option on ${h.title} lapses`, `Eighteen months and no green light. The rights go back to ${P(h.writer).name}.`); }
    if (h.made !== undefined && !h.told && S.films[h.made].rel !== null) { const f = S.films[h.made]; h.told = 1; milestone(`${f.title}, which you produced, opened: ${f.reviews}/100, ${fmtM(f.total)} worldwide`, 'film'); }
  }
  M.holdings = (M.holdings || []).filter(h => !h.lapsed || S.week - h.to < 8);
}
// ---- Your own company ----
// Found a production company and it becomes one of the city's companies: it has its own bank account (in the
// world's millions), makes the films you choose to finance, earns from them and can go bust like any other.
const FOUND_COST = 25000;
function myCo() { const M = S.me; return M.company !== undefined ? S.companies[M.company] : null; }
function canFound() { const me = ME(), M = S.me; return M.company === undefined && M.cash >= usd(FOUND_COST) && (me.standing >= 15 || me.credits.length > 0 || (M.holdings || []).length > 0); }
function foundCompany(a) {
  const M = S.me, me = ME();
  if (!canFound()) return false;
  const name = String(a.name || '').replace(/\s+/g, ' ').trim().slice(0, 40) || `${me.name.split(' ').pop()} Pictures`;
  const c = { id: S.companies.length, name, hub: M.hub, tier: 3, cash: 0, founded: S.year, closed: null, films: [], favors: {}, taste: Object.fromEntries((M.love || []).slice(0, 2).map(g => [g, 1.7])), hits: 0, libInc: 0, libIncLast: 0, acquired: [], owner: me.id };
  S.companies.push(c);
  M.cash -= usd(FOUND_COST); c.cash += usd(FOUND_COST) * .6 / 1e6;   // lawyers and an office take the rest
  M.company = c.id;
  milestone(`Founded ${name}`, 'work');
  news('Company', `${name} opens its doors in ${HUBS[M.hub].name}, founded by ${me.name}.`, { company: c.id });
  return true;
}
function coMoney(a) {
  const M = S.me, c = myCo(), amt = Math.round(+a.amount || 0);
  if (!c || c.closed !== null || !(amt > 0)) return false;
  if (a.t === 'invest') { if (M.cash < amt) return false; M.cash -= amt; c.cash += amt / 1e6; }
  else { if (c.cash * 1e6 < amt) return false; c.cash -= amt / 1e6; M.cash += amt; }
  return true;
}
// What a small film of this genre costs here, before the surprises.
function estBudget(genre) { return [0, 3, 1, .35][3] * budgetScale(S.year) * era(MARKETS[HUBS[S.me.hub].m].cost, S.year) * Math.pow(AMB[genre], .7); }
// Who you could cast or hire: people in town who are free, best fits first, people you know marked.
function castOptions(genre) {
  const M = S.me, ids = S.pool[M.hub].actor.filter(id => available(id) && id !== M.id);
  return ids.map(P).sort((a, b) => (gcraft(b, 'act', genre) * 2 + b.fame * .3 + (M.known[b.id] ? 6 : 0)) - (gcraft(a, 'act', genre) * 2 + a.fame * .3 + (M.known[a.id] ? 6 : 0))).slice(0, 10);
}
function dirOptions(genre) {
  const M = S.me, ids = S.pool[M.hub].director.filter(id => available(id) && id !== M.id);
  return ids.map(P).sort((a, b) => (gcraft(b, 'dir', genre) * 2 + b.standing * .2 + (M.known[b.id] ? 6 : 0)) - (gcraft(a, 'dir', genre) * 2 + a.standing * .2 + (M.known[a.id] ? 6 : 0))).slice(0, 8);
}
// A name costs money: a lead's fee grows with their fame.
function leadFee(id, genre, micro) { const q = P(id); return estBudget(genre) * (micro ? .25 : 1) * (.04 + Math.pow((q.fame || 0) / 100, 2) * .9); }
// Investors put up what your company can't, for a share of what the film brings back. Convincing them is a roll.
function investDC(src) { const c = myCo(), me = ME(); return Math.round(clamp(16 - me.standing / 20 - (c ? c.hits * 2 : 0) - (src.score - 60) / 10, 6, 19)); }
// Finance a film yourself: your own finished script or one you've optioned. Choose the size, the director (or
// yourself), the lead, and whether to bring in investors for the part your company can't cover.
function selfFund(a) {
  const M = S.me, me = ME(), c = myCo();
  if (!c || c.closed !== null) return false;
  const src = a.src === 'script' ? (M.scripts || []).find(x => x.id === a.id && x.grade && !x.option && x.made === undefined) : (M.holdings || []).find(x => x.id === a.id && x.made === undefined && !x.lapsed);
  if (!src) return false;
  const lead = a.lead !== undefined && a.lead !== null && P(a.lead) && P(a.lead).role === 'actor' && available(a.lead) ? a.lead : undefined;
  const direct = !!a.direct, dirPick = !direct && a.dir !== undefined && a.dir !== null && P(a.dir) && available(a.dir) ? a.dir : undefined;
  let budget = estBudget(src.genre) * (a.micro ? .25 : 1) + (lead !== undefined ? leadFee(lead, src.genre, a.micro) : 0);
  let share = 0, invest = 0;
  if (c.cash < budget * .9) {
    if (!a.inv || c.cash < budget * .25 || (src.invTry !== undefined && S.week - src.invTry < 4)) return false;
    src.invTry = S.week;
    if (!roll('fin', investDC(src))) { inbox('note', 'The investors pass', `Nobody wants to put money into ${src.title} yet. More standing, a hit or a better script would change that.`, { result: { ok: false, roll: M.lastRoll, t: 'They pass.' } }); return true; }
    invest = budget - Math.max(0, c.cash); share = clamp(invest / budget * 1.15, .1, .8); c.cash += invest;
  }
  const f = greenlight(M.hub, { genre: src.genre, wri: a.src === 'script' ? [me.id] : [src.writer], title: src.title, prod: direct ? undefined : me.id, co: c.id, score: src.score, dir: direct ? me.id : dirPick, budget, lead });
  src.made = f.id; f.xc = f.xc || {}; f.xc[me.id] = direct ? 'Director' : a.src === 'script' ? 'Writer-producer' : 'Producer';
  if (share) { f.investors = { share, amount: invest }; }
  if (direct) takeJob(makePost(POST_BY.owndir, f));
  if (lead !== undefined) meet(lead, 'Cast in your film', 6);
  if (dirPick !== undefined) meet(dirPick, 'Directing your film', 6);
  me.standing = clamp(me.standing + 1.5, 0, 100);
  if (a.src !== 'script') addTie(me, P(src.writer), 8);
  milestone(`${c.name} greenlights ${f.title}${direct ? ', and you\'ll direct it' : ''}`, 'credit');
  inbox('news', `${f.title} is a go`, `${c.name} puts ${fmtM(f.budget)} into ${f.title}${share ? `, ${fmtM(invest)} of it from investors who'll take ${Math.round(share * 100)}% of what it earns` : ''}. ${direct ? 'You\'re directing.' : `${P(f.dir).name} directs.`} Starring ${P(f.cast[0]).name}. It's your money on the line.`, { film: f.id, result: share ? { ok: true, roll: M.lastRoll, t: 'The investors are in.' } : undefined });
  return true;
}
// After release, investors take their share of what came back to the company.
function payInvestors() {
  const c = myCo(); if (!c) return;
  for (const id of c.films) { const f = S.films[id]; if (!f.investors || f.investors.paid || f.rel === null) continue; const back = Math.max(0, f.rentals - f.pa - f.backend); f.investors.paid = back * f.investors.share; c.cash -= f.investors.paid; if (f.investors.paid > 0) inbox('note', `Paying the investors on ${f.title}`, `${fmtCash(Math.round(f.investors.paid * 1e6))} goes to the people who backed ${f.title}.`, { film: f.id }); }
}
// Directing your own film is a job like any other: five days a week from development to the final mix.
POST_BY.owndir = { k: 'owndir', jid: 'owndir', t: 'Director', tier: 4, st: [0, 1, 2, 3], head: 'prod', subs: ['dact', 'vstory', 'tone', 'pace', 'setm'], days: 5, rate: 0, weeks: 90, cr: 1 };
POST_FAMILY.owndir = 'dir';
function companyWeek() {
  const M = S.me, c = myCo();
  if (!c) return;
  if (c.closed === null) c.cash -= usd([0, 12000, 5000, 1500][c.tier]) / 1e6;   // an office, an assistant, a lawyer on retainer
  payInvestors();
  if (c.closed !== null && !M.coClosedTold) { M.coClosedTold = 1; inbox('note', `${c.name} goes under`, 'The debts were bigger than the slate. Your company closes and its films go to whoever buys the library. You keep the stories.'); milestone(`${c.name} closed`, 'work'); }
  if (c.closed === null && c.tier === 3 && c.hits >= 2) { c.tier = 2; milestone(`${c.name} is now a mid-sized company`, 'work'); inbox('news', `${c.name} grows`, 'Two hits in, the phone rings differently. Agents send you better scripts; bigger names take meetings.'); }
}
// ---- Festivals ----
// Released films you're credited on can go to festivals within a year. Selection is about quality, and small,
// independent films get a little extra love. A prize is an award like any other, and a festival is a party you go to.
const FESTIVALS = [
  { k: 'mountain', name: 'the Mountain Film Festival', month: 0, bar: 62, fee: 60, prize: 'Grand Jury Prize', d: 'Snow, independents, buyers in parkas.' },
  { k: 'cote', name: 'the Festival de la Côte', month: 4, bar: 80, fee: 120, prize: 'Grand Prix', d: 'The most prestigious festival in the world. Red carpet, black tie.' },
  { k: 'lagoon', name: 'the Lagoon Film Festival', month: 8, bar: 74, fee: 100, prize: 'Golden Lion of the Lagoon', d: 'Old palazzos, new auteurs.' },
  { k: 'north', name: 'the Northern Lights Festival', month: 8, bar: 58, fee: 70, prize: 'Audience Award', d: 'A big public festival. The audience award has launched careers.' },
  { k: 'shorts', name: 'the Harbour Festival', month: 2, bar: 50, fee: 40, prize: 'Discovery Prize', d: 'Small, friendly, full of first films.' }
];
function myFilms() { const me = ME(), M = S.me; const ids = new Set(me.credits.concat(M.past.filter(p => p.credited && p.film !== null).map(p => p.film), (M.scripts || []).map(s => s.made), (M.holdings || []).map(h => h.made)).filter(x => x !== undefined && x !== null)); return [...ids].map(i => S.films[i]).filter(f => f && f.stage !== -1); }
function festEligible(f) { return f.rel !== null && S.week - f.rel < 52; }
function submitFest(a) {
  const M = S.me, f = S.films[a.film], F = FESTIVALS.find(x => x.k === a.k);
  if (!f || !F || !myFilms().includes(f) || !festEligible(f) || (M.fests || []).some(x => x.film === f.id && x.k === F.k) || M.cash < usd(F.fee)) return false;
  M.cash -= usd(F.fee);
  (M.fests = M.fests || []).push({ film: f.id, k: F.k, due: S.week + 5 + Math.floor(prnd() * 5) });
  return true;
}
function festWeek() {
  const M = S.me, me = ME();
  for (const e of (M.fests || []).filter(x => !x.done && x.due <= S.week)) {
    e.done = true;
    const f = S.films[e.film], F = FESTIVALS.find(x => x.k === e.k), small = f.tier === 3 || f.co === null;
    const v = f.q + (small ? 5 : 0) + (prnd() - .5) * 20;
    if (v < F.bar) { inbox('note', `${F.name}: not selected`, `${f.title} isn't in this year's line-up. ${pickLine(['Hundreds of films, a few dozen slots.', 'Next festival.', 'The programmers wanted something else this year.'], f.id + e.due)}`, { film: f.id }); continue; }
    e.sel = 1; f.cult = clamp((f.cult || 0) + 8, 0, 100); me.standing = clamp(me.standing + 1.5, 0, 100);
    let t = `${f.title} is in the official selection at ${F.name}. ${F.d}`;
    if (v >= F.bar + 14) { award(f, `${F.name.replace(/^the /, '')}: ${F.prize}`, [f.dir, f.prod].filter((x, i, A) => A.indexOf(x) === i)); me.fame = clamp((me.fame || 0) + 3, 0, 100); t += ` And it wins the ${F.prize}.`; milestone(`${f.title} won the ${F.prize} at ${F.name}`, 'prize'); }
    else milestone(`${f.title} selected for ${F.name}`, 'prize');
    inbox('news', `${F.name}`, t, { film: f.id });
    const slot = freeSlot({ days: [3, 4, 5], blocks: [2], from: 1 }), host = [f.prod, f.dir, f.cast[0]].find(id => id !== me.id);
    if (slot && host !== undefined) inbox('invite', `Go to ${F.name}?`, `Your film is screening. The premiere is ${slotLabel(slot)}: travel, a red carpet, and everyone who buys and sells films in one place.`, { person: host, ev: 'festival', slot, what: `the premiere at ${F.name}`, choices: [{ k: 'yes', label: `Go (${slotLabel(slot)})` }, { k: 'no', label: 'Stay home' }] });
  }
}
