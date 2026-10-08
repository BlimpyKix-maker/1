// ---------------- How a film is paid for, and how it falls apart ----------------
// A film is rarely one cheque. Your own company's films are built from a capital stack, as real independents are:
// the government's production incentive (cash-flowed by a bank against the rebate to come), foreign pre-sales (a
// distributor's promise to pay on delivery, which a bank lends against), a gap loan against the rights still unsold,
// equity investors who recoup first and then split the profit, and whatever your company can put in. Bank money
// needs a completion bond, and every production carries insurance. Then the film walks the real road, Development
// and financing, Pre-production, Shooting, Post-production, Release, and at any point it can wobble: a star walks,
// a financier's cheque bounces, a buyer goes bust, a storm flattens the set. Some wobbles you can buy your way out
// of. Some end the film. You can also put money into other people's films, and ride their luck.

// production incentives, by city: [from year, share of qualifying spend]. About three-quarters of a budget qualifies.
const INCENTIVE = {
  hollywood: [[2009, .2], [2015, .25]], newyork: [[2004, .25], [2014, .3]], toronto: [[1997, .2], [2009, .28]], mexico: [[2006, .12], [2019, 0]],
  london: [[1997, .12], [2007, .2], [2024, .255]], paris: [[2009, .2], [2016, .3]], rome: [[2008, .25], [2017, .4]], berlin: [[2007, .2], [2017, .25]],
  madrid: [[2015, .2], [2019, .3]], tokyo: [[2019, .2]], seoul: [[2010, .2]], sydney: [[2007, .3]], wellington: [[2004, .15], [2014, .4]],
  johannesburg: [[2004, .25]], prague: [[2010, .2]], budapest: [[2004, .2], [2009, .3]], warsaw: [[2019, .3]], helsinki: [[2017, .25]],
  stockholm: [[2022, .25]], copenhagen: [[2025, .25]], bogota: [[2013, .4]], istanbul: [[2020, .3]], bangkok: [[2017, .15]], manila: [[2023, .2]]
};
function incentiveOf(hub, y = S.year) { let r = 0; for (const [from, v] of INCENTIVE[hub] || []) if (y >= from) r = v; return r; }
// genres that sell abroad on a poster and a name, and the ones that don't travel
const TRAVEL = { Action: .1, Horror: .1, Thriller: .07, 'Sci-fi': .08, Superhero: .1, Animation: .08, Fantasy: .06, 'Martial arts': .08, Comedy: -.04, Musical: -.03, Documentary: -.05 };
// what the foreign buyers would advance, as a share of the budget: they pay for a face and a genre
function presaleShare(genre, lead, dir) {
  const fame = lead !== undefined ? P(lead).fame || 0 : 0, dst = dir !== undefined && dir !== null ? P(dir).standing : 0;
  if (fame < 25 && dst < 45) return 0;   // no names, no pre-sales
  const era = S.year < 1970 ? .3 : S.year < 1985 ? .7 : 1;
  return clamp(.06 + fame / 220 + dst / 400 + (TRAVEL[genre] || 0), 0, .45) * era;
}
function presaleDC(genre, lead) { return Math.round(clamp(17 - (lead !== undefined ? (P(lead).fame || 0) / 12 : 0) - ME().standing / 25 - (S.me.agent ? 1 : 0), 7, 19)); }
// The plan for one film: each piece of money, what it costs, and how much is left for the company and investors.
function finPlan(budget, o) {
  const parts = [], fees = [];
  const reb = o.rb ? incentiveOf(S.me.hub) * .75 * budget : 0;
  if (reb > 0) { parts.push({ k: 'rebate', label: `${hubName(S.me.hub)} production incentive (${Math.round(incentiveOf(S.me.hub) * 100)}% of local spend)`, amt: reb * .9 }); fees.push(['Bank discount on the incentive', reb * .1]); }
  const ps = o.ps ? presaleShare(o.genre, o.lead, o.dir) * budget : 0;
  if (ps > 0) { parts.push({ k: 'presale', label: 'Foreign pre-sales (paid on delivery; the bank lends against them)', amt: ps * .92, mg: ps }); fees.push(['Interest on the pre-sale loan', ps * .08]); }
  const gap = o.gap && ps > 0 ? budget * .15 : 0;
  if (gap > 0) parts.push({ k: 'gap', label: 'Gap loan against the unsold home rights (repaid with 12% from the first money in)', amt: gap });
  const bonded = ps > 0 || gap > 0;
  if (bonded) fees.push(['Completion bond (the guarantor\'s fee)', budget * .025]);
  fees.push(['Production insurance', budget * .02]);
  const feeT = fees.reduce((t, x) => t + x[1], 0), outside = parts.reduce((t, x) => t + x.amt, 0);
  return { parts, fees, feeT, bonded, reb, ps, gap, equity: Math.max(0, budget + feeT - outside) };
}

// ---- the weekly road: incidents on your own films ----
function finFilms() { const c = myCo(); return c ? c.films.map(i => S.films[i]).filter(f => f.fin && !f.fin.over) : []; }
function finLog(f, t, tone = '') { f.fin.log.push({ w: S.week, t, tone }); }
function finCost(f, pct, god) {
  const add = f.budget * pct; f.cost += add;
  let back = 0; if (god && f.fin.insured) { back = add * .7; myCo().cash += back; }
  return back;
}
function finQ(f, v) { f.qBonus = (f.qBonus || 0) + v; }
function finDelay(f, w) { f.stageEnd += w; for (const p of keyPeople(f)) if (p.busy >= S.week) p.busy += w; }
// when the money runs past the contingency, the completion guarantor steps in, pays the rest, and takes the film
function finBond(f) {
  if (!f.fin.bonded || f.fin.bondTook || f.cost <= f.budget * 1.1) return '';
  f.fin.bondTook = 1; const over = f.cost - f.budget * 1.1; f.cost = f.budget * 1.1; finQ(f, -2);
  finLog(f, `Over the contingency: the completion guarantor takes control, pays the last ${fmtM(over)} and finishes the film its own way.`, 'bad');
  return ` The overrun blows through the contingency, and the completion guarantor takes over the production. They pay the last ${fmtM(over)}; in return they make the decisions, and you lose final cut.`;
}
// the end of a film: what's unspent comes back, the banks are repaid first, the investors get what's left
function finCollapse(f, why, god) {
  const c = myCo(), F = f.fin, spent = [.2, .45, .8, .95][Math.max(0, f.stage)] || .95;
  const R = f.budget * (1 - spent) + (god && F.insured ? f.cost * spent * .6 : 0);
  const loans = (F.ps && !F.psGone ? F.ps * .92 : 0) + (F.reb ? F.reb * .9 : 0) + (F.gap || 0);
  const left = R - loans, inv = f.investors ? Math.max(0, left) * f.investors.share : 0;
  c.cash += left - inv;
  if (f.investors) f.investors.paid = inv;
  f.status = 'Abandoned'; f.stage = -1; S.active = S.active.filter(i => i !== f.id); freeFilm(f); F.over = 'collapsed'; F.dead = why;
  if (f.dist) delete f.dist.intl;
  const j = S.me.jobs.find(x => x.film === f.id); if (j) finishJob(j, null, true);
  ME().standing = clamp(ME().standing - 2, 0, 100);
  finLog(f, `The film collapses: ${why}.`, 'bad');
  milestone(`${f.title} collapsed`, 'work');
  news('Industry', `${f.title}, from ${c.name}, has shut down for good: ${why}.`, { film: f.id });
  return ` ${f.title} is over. ${god && F.insured ? 'The insurers pay part of what was spent. ' : ''}${loans > 0 ? `The banks are repaid first (${fmtM(loans)}). ` : ''}${f.investors ? `The investors get ${inv > 0 ? fmtM(inv) : 'nothing'} back. ` : ''}The company is left with ${left - inv >= 0 ? fmtM(left - inv) + ' back' : 'a ' + fmtM(inv - left) + ' hole'}.`;
}
const FIN_PLACE = { hollywood: 'a wildfire', newyork: 'a blizzard', toronto: 'an ice storm', london: 'a month of rain', mumbai: 'the monsoon', chennai: 'a cyclone', manila: 'a typhoon', tokyo: 'an earthquake', sydney: 'bushfires', hongkong: 'a typhoon', bangkok: 'floods', jakarta: 'floods', rio: 'mudslides', istanbul: 'an earthquake', lagos: 'floods', dakar: 'a sandstorm' };
const FIN_WALK = ['another film\'s dates have moved onto yours', 'creative differences over the script', 'a stint in rehab', 'a new agent who wants double', 'cold feet about the role', 'a family crisis'];
const FIN_INC = [
  { k: 'walk', st: [0, 1], kind: 'people', w: f => 1 + keyPeople(f).filter(p => has(p, 'Difficult') || has(p, 'Volatile')).length * .6,
    title: f => `${P(f.cast[0]).name} drops out of ${f.title}`, text: f => `${P(f.cast[0]).name} has pulled out, citing ${pickLine(FIN_WALK, f.id + S.week)}.${f.fin.ps && !f.fin.psGone ? ' The foreign buyers bought the film on that name, and they are asking what happens now.' : ''}`,
    opts: [{ k: 'pay', label: f => `Pay what it takes to keep them (${fmtM(f.budget * .06)})`, go: f => { finCost(f, .06); return 'They stay, for a price. The deal memo now has a second page.' + finBond(f); } },
      { k: 'recast', label: () => 'Recast the part', check: ['pack', 13], go: (f, ok) => { finQ(f, ok ? -1 : -3); let t = ok ? 'You find someone hungry and good. It\'s a different film now, maybe not a worse one.' : 'The replacement is fine. Fine is the word everyone uses.'; if (f.fin.ps && !f.fin.psGone) { const cut = f.fin.ps * (ok ? .2 : .4); f.fin.ps -= cut; myCo().cash -= cut * .92; t += ` The foreign buyers re-price the film without the name: ${fmtM(cut)} less, and the bank wants it back now.`; } return t; } },
      { k: 'wait', label: () => 'Push the start date and wait for them', go: f => { finDelay(f, 8); finCost(f, .03); if (prnd() < .55) return 'Eight weeks later they\'re back, apologetic and ready. The delay cost money, and some of the crew moved on.'; finQ(f, -2); return 'Eight weeks, and they never come back. You recast in a hurry.'; } }] },
  { k: 'money', st: [0, 1], kind: 'money', w: f => f.investors ? 1.6 : 0,
    title: f => `An investor in ${f.title} pulls out`, text: f => `${pickLine(['The fund behind the equity is being wound up after a bad year.', 'The investor\'s divorce has frozen every account.', 'The regulator is asking where the investor\'s money came from, and the lawyers say don\'t touch it.', 'The investor has read the script again, and wants to make a different film.'], f.id + S.week)} ${fmtM(f.investors.amount * .5)} of the money has gone.`,
    opts: [{ k: 'cover', label: f => `Cover it from the company (${fmtM(f.investors.amount * .5)})`, go: f => { myCo().cash -= f.investors.amount * .5; f.investors.share *= .55; return 'You cover the hole. Less of the film belongs to other people now; more of the risk is yours.'; } },
      { k: 'find', label: () => 'Find new money, fast', check: ['fin', 15], go: (f, ok) => { if (ok) { f.investors.share = clamp(f.investors.share * 1.2, .1, .85); finDelay(f, 2); return 'A new backer in nine days, on worse terms. The film goes on.'; } finDelay(f, 4); if (prnd() < .5) return finCollapse(f, 'the money never came') ; myCo().cash -= f.investors.amount * .5; return 'Nobody bites. In the end you cover it yourself, a month late.'; } },
      { k: 'shut', label: () => 'Shut it down before it costs more', go: f => finCollapse(f, 'the financing fell apart') }] },
  { k: 'bust', st: [1, 2, 3], kind: 'money', w: f => f.fin.ps && !f.fin.psGone ? .7 : 0,
    title: f => `A buyer for ${f.title} goes bust`, text: f => `One of the foreign distributors who pre-bought ${f.title} has filed for bankruptcy. Their guarantee is worthless, and the bank that lent against it wants its money.`,
    opts: [{ k: 'pay', label: f => `Repay the bank (${fmtM(f.fin.ps * .5 * .92)})`, go: f => { const v = f.fin.ps * .5; myCo().cash -= v * .92; f.fin.ps -= v; if (f.dist && f.dist.intl) f.dist.intl.mg = f.fin.ps; return 'Half the foreign money is gone. Those territories are unsold again; a festival might sell them.'; } }] },
  { k: 'storm', st: [2], kind: 'god', w: f => FIN_PLACE[f.hub] ? 1.3 : .8,
    title: f => `${(FIN_PLACE[f.hub] || 'a storm').replace(/^./, m => m.toUpperCase())} hits the ${f.title} shoot`, text: f => `${(FIN_PLACE[f.hub] || 'A storm').replace(/^./, m => m.toUpperCase())} takes out the main location: sets, generators, a week of schedule.${f.fin.insured ? ' The insurers will pay most of the damage, eventually.' : ''}`,
    opts: [{ k: 'rebuild', label: f => `Rebuild and reshoot (${fmtM(f.budget * .14)})`, go: f => { const b = finCost(f, .14, 1); finDelay(f, 3); return `You rebuild. ${b ? `Insurance covers ${fmtM(b)}.` : ''}` + finBond(f); } },
      { k: 'stage', label: f => `Move it onto a soundstage (${fmtM(f.budget * .07)})`, go: f => { const b = finCost(f, .07, 1); finQ(f, -1); return `It looks a little like a set now, because it is one.${b ? ` Insurance covers ${fmtM(b)}.` : ''}` + finBond(f); } },
      { k: 'write', label: () => 'Rewrite around it', check: ['tas', 13], go: (f, ok) => { finQ(f, ok ? 1 : -2); return ok ? 'The rewrite is better than the scene you lost. Nobody will ever know.' : 'The hole in the story shows.'; } }] },
  { k: 'ill', st: [1, 2], kind: 'god', w: () => .6,
    title: f => `${P(f.cast[0]).name} is seriously ill`, text: f => `${P(f.cast[0]).name} is in hospital. The doctors say weeks, not days.${f.fin.insured ? ' The cast insurance kicks in.' : ''}`,
    opts: [{ k: 'wait', label: () => 'Shut down and wait', go: f => { finDelay(f, 7); const b = finCost(f, .1, 1); return `Seven weeks of nothing, then back to work.${b ? ` Insurance covers ${fmtM(b)}.` : ''}` + finBond(f); } },
      { k: 'around', label: () => 'Shoot around them with a double', check: ['pack', 14], go: (f, ok) => { finDelay(f, 2); finCost(f, .04, 1); finQ(f, ok ? 0 : -3); return ok ? 'Backs of heads, long lenses, a clever edit. It works.' : 'You can tell. The critics will tell everyone else.'; } }] },
  { k: 'virus', st: [1, 2], kind: 'god', w: () => S.year >= 2020 && S.year <= 2022 ? 4 : .15,
    title: f => `An outbreak shuts down ${f.title}`, text: f => `A virus goes through the unit, then the city. Production stops by order.${S.year >= 2021 ? ' Insurers stopped covering pandemics last year.' : ''}`,
    opts: [{ k: 'wait', label: () => 'Wait it out', go: f => { finDelay(f, 12); finCost(f, .16, S.year < 2021); return 'Twelve weeks. Then testing, masks and a smaller crew, and it costs more to do less.' + finBond(f); } },
      { k: 'shut', label: () => 'Close it down for good', go: f => finCollapse(f, 'the shutdown never ended', S.year < 2021) }] },
  { k: 'accident', st: [2], kind: 'god', w: f => .4 + (f.genre === 'Action' || f.genre === 'War' || f.genre === 'Superhero' ? .8 : 0),
    title: f => `An accident on the set of ${f.title}`, text: f => 'A stunt goes wrong. Nobody is killed, but people are hurt, and the safety inspectors close the set while they investigate.',
    opts: [{ k: 'cooperate', label: () => 'Co-operate fully and make it right', go: f => { finDelay(f, 4); const b = finCost(f, .08, 1); ME().standing = clamp(ME().standing + .5, 0, 100); return `Four weeks, new rules, and a crew that trusts you more.${b ? ` Insurance covers ${fmtM(b)}.` : ''}` + finBond(f); } },
      { k: 'push', label: () => 'Fight the closure and push on', check: ['cha', 15], go: (f, ok) => { if (ok) { finDelay(f, 1); return 'You\'re back in a week. Some of the crew won\'t look at you.'; } ME().standing = clamp(ME().standing - 3, 0, 100); finDelay(f, 6); finCost(f, .1); return 'The inspectors don\'t like being pushed. Six weeks, a fine, and a story in the trades.' + finBond(f); } }] },
  { k: 'feud', st: [2], kind: 'people', w: f => .6 + keyPeople(f).filter(p => has(p, 'Difficult') || has(p, 'Volatile') || has(p, 'Perfectionist')).length * .8,
    title: f => `War on the set of ${f.title}`, text: f => `${P(f.dir).name} and ${P(f.cast[0]).name} have stopped speaking. The schedule is slipping and everybody is choosing sides.`,
    opts: [{ k: 'back', label: f => `Back ${P(f.dir).name}`, check: ['cha', 13], go: (f, ok) => { finQ(f, ok ? 1 : -2); if (!ok) finCost(f, .04); return ok ? 'The star sulks, then delivers. Anger looks good on camera.' : 'The star phones it in for the rest of the shoot.'; } },
      { k: 'fire', label: f => `Fire ${P(f.dir).name}`, check: ['pack', 14], go: (f, ok) => { finDelay(f, ok ? 3 : 6); finCost(f, ok ? .05 : .1); finQ(f, ok ? -1 : -4); addTie(ME(), P(f.dir), -20); return (ok ? 'A safe pair of hands finishes the film. It\'s coherent, which is something.' : 'The replacement hates the footage, and it shows.') + finBond(f); } },
      { k: 'mediate', label: () => 'Get them in a room', check: ['cha', 14], go: (f, ok) => { if (ok) return 'Two hours, one bottle of wine, and a handshake. Nobody will speak of it again.'; finQ(f, -2); finCost(f, .03); return 'It gets worse. Shouting is heard through two walls.'; } }] },
  { k: 'overrun', st: [2], kind: 'money', w: f => .8 + (has(P(f.dir), 'Perfectionist') ? 1.5 : 0),
    title: f => `${f.title} is falling behind`, text: f => `${P(f.dir).name} is shooting fourteen takes of everything, and the schedule is a week behind.`,
    opts: [{ k: 'cut', label: () => 'Cut pages from the script', go: f => { finQ(f, -2); return 'Six pages go. The director calls it butchery, to anyone who\'ll listen.'; } },
      { k: 'pay', label: f => `Approve the overtime (${fmtM(f.budget * .08)})`, go: f => { finCost(f, .08); return 'You pay. The days get longer.' + finBond(f); } },
      { k: 'trust', label: f => `Let them shoot (${fmtM(f.budget * .15)} or more)`, go: f => { finCost(f, .15); finQ(f, 2); return 'You let them. The footage is extraordinary. So is the bill.' + finBond(f); } }] },
  { k: 'audit', st: [3], kind: 'money', w: f => f.fin.reb ? .8 : 0,
    title: f => `The incentive auditors query ${f.title}`, text: f => `The film office says some of the spend didn't qualify. They want ${fmtM(f.fin.reb * .2)} of the incentive back.`,
    opts: [{ k: 'pay', label: () => 'Pay it', go: f => { myCo().cash -= f.fin.reb * .2; return 'You pay and resolve to keep better receipts.'; } },
      { k: 'fight', label: () => 'Argue every line', check: ['fin', 14], go: (f, ok) => { if (ok) return 'Your accountant wins on every line. The film office apologises, in writing.'; myCo().cash -= f.fin.reb * .3; return 'You lose, and pay their costs too.'; } }] },
  { k: 'lab', st: [2, 3], kind: 'god', w: () => .35,
    title: f => `Footage lost on ${f.title}`, text: f => S.year < 2005 ? 'A lab accident ruins three days of negative.' : 'A drive fails and the backup was never made: three days of footage are gone.',
    opts: [{ k: 'reshoot', label: f => `Reshoot (${fmtM(f.budget * .06)})`, go: f => { const b = finCost(f, .06, 1); finDelay(f, 2); return `You get the days back.${b ? ` Insurance covers ${fmtM(b)}.` : ''}` + finBond(f); } },
      { k: 'cheat', label: () => 'Cheat it in the edit', check: ['tas', 14], go: (f, ok) => { finQ(f, ok ? 0 : -2); return ok ? 'The editor works a miracle. Nobody notices.' : 'The scene doesn\'t quite join up, and it shows.'; } }] },
  // good news happens too
  { k: 'market', st: [1, 2, 3], kind: 'luck', w: f => f.fin.ps ? .6 : .25,
    title: f => `A buyer at the film market wants ${f.title}`, text: f => 'A sales agent shows ten minutes of footage at the market, and a buyer from a territory you hadn\'t sold makes an offer on the spot.',
    opts: [{ k: 'take', label: f => `Take it (${fmtM(f.budget * .06)})`, go: f => { myCo().cash += f.budget * .06; f.fin.ps = (f.fin.ps || 0) + f.budget * .06; return 'Sold. One more flag on the map in the office.'; } }] }
];
function finWeek() {
  const c = myCo(); if (!c) return;
  for (const f of finFilms()) {
    const F = f.fin;
    if (f.rel !== null) {   // released: repay the gap loan, and the film is out of the woods
      if (F.gap && !F.gapPaid) { F.gapPaid = 1; c.cash -= F.gap * 1.12; finLog(f, `Gap loan repaid with interest: ${fmtM(F.gap * 1.12)}.`); }
      F.over = 'released'; continue;
    }
    if (f.stage < 0) { F.over = 'collapsed'; continue; }
    if (F.pend || (F.last && S.week - F.last < 5)) continue;
    const hz = [.025, .03, .045, .02][f.stage] || 0;
    if (prnd() >= hz) continue;
    const L = FIN_INC.filter(x => x.st.includes(f.stage) && !(F.seen || []).includes(x.k) && x.w(f) > 0), x = L.length ? wpickP(L, y => y.w(f)) : null; if (!x) continue;
    F.pend = x.k; F.last = S.week; (F.seen = F.seen || []).push(x.k);
    inbox('fin', x.title(f), x.text(f), { film: f.id, inc: x.k, choices: x.opts.map(o => ({ k: o.k, label: o.label(f), check: o.check })) });
  }
  coinvWeek();
}
function wpickP(L, w) { const t = L.reduce((s, x) => s + w(x), 0); let r = prnd() * t; for (const x of L) { r -= w(x); if (r <= 0) return x; } return L[L.length - 1]; }
function finPick(it, k) {
  if (it.kind !== 'fin' || it.coinv !== undefined) return false;
  const f = S.films[it.film], x = FIN_INC.find(y => y.k === it.inc), o = x && x.opts.find(y => y.k === k);
  it.done = true; it.picked = k; if (f && f.fin) f.fin.pend = null;
  if (!f || !o || f.stage < 0 || f.rel !== null) { it.result = { t: 'It has sorted itself out.' }; return true; }
  const ok = o.check ? roll(o.check[0], o.check[1]) : null;
  const t = o.go(f, ok);
  const lab = o.label(f).replace(/ \(.*\)$/, '');
  finLog(f, `${x.title(f)}: ${lab[0].toLowerCase() + lab.slice(1)}.`, x.kind === 'luck' ? 'good' : '');
  it.result = { ok, roll: ok !== null ? S.me.lastRoll : undefined, t };
  return true;
}

// ---- co-investing in other people's films ----
// Equity is the riskiest money in a film and gets paid first: it recoups 120% before anyone else's profit, then
// splits what's left with the producers. On a studio film it's a slate deal, pro rata with the studio, and the
// studio takes a distribution fee first. Most films lose money; development is where they die.
function eqShare(f) { return f.tier === 1 && f.co !== null ? 1 : f.tier === 2 && f.co !== null ? .6 : .3 + hashRand(f.id * 41 + 7)() * .25; }
function coinvOpen() {
  const M = S.me, me = ME(), wide = me.standing >= 50 || M.cash >= usd(5e6);
  const mine = new Set((M.coinv || []).map(x => x.f)), own = M.company;
  return S.active.map(i => S.films[i]).filter(f => f.rel === null && (f.stage === 0 || f.stage === 1) && f.stageEnd - S.week >= 2 && f.co !== own && !mine.has(f.id) && (f.hub === M.hub || wide) && !keyIds(f).includes(me.id) && !(f.tier === 1 && f.co !== null && me.standing < 40))
    .sort((a, b) => (a.hub === M.hub ? 0 : 1) - (b.hub === M.hub ? 0 : 1) || hashRand(a.id + S.week * 7)() - hashRand(b.id + S.week * 7)()).slice(0, 8);
}
function coinvAct(a) {
  const M = S.me, f = S.films[a.f]; if (!f || f.rel !== null || f.stage < 0 || f.stage > 1) return false;
  const amt = Math.round(f.cost * 1e6 * eqShare(f) * [.05, .1, .25][+a.p || 0]);
  if (M.cash < amt || (M.coinv || []).some(x => x.f === f.id)) return false;
  M.cash -= amt; (M.coinv = M.coinv || []).push({ f: f.id, amt, w: S.week, paid: 0, ev: f.events.length });
  diary(`Money: put ${fmtCash(amt)} into ${f.title}.`);
  if (f.prod !== null && P(f.prod)) meet(f.prod, 'You invested in their film', 4);
  return true;
}
function coinvOwed(x) {
  const f = S.films[x.f]; if (f.rel === null || f.rentals === undefined) return 0;
  const eq = eqShare(f) * f.cost, pool = typeof eqPool === 'function' ? eqPool(f) : Math.max(0, f.rentals - f.pa - f.backend) + (f.afterTotal || 0) * .5;
  const prem = x.prem || 1.2, split = x.split || .5;   // the terms you negotiated (or the standard ones)
  let owed = Math.min(pool, eq * prem) + Math.max(0, pool - eq * prem) * split;
  if (f.tier === 1 && f.co !== null) owed = pool * .85;
  return Math.round(owed * x.amt / Math.max(1e-6, eq));   // owed and eq in millions, amt in dollars
}
function coinvWeek() {
  const M = S.me;
  // now and then someone with a film comes looking for money, if you look like you have some
  if (M.cash >= usd(400000) && prnd() < .025) { const o = coinvOpen()[0]; if (o && P(o.prod) && !P(o.prod).player) inbox('note', `${P(o.prod).name} is raising money for ${o.title}`, `${P(o.prod).name} is closing the financing on ${o.title}, ${o.genre.toLowerCase()} with ${P(o.cast[0]).name}, and wonders if you'd like a piece. Equity gets paid back first, if anything comes back. It's on your company page, under investing.`, { film: o.id, person: o.prod }); }
  for (const x of M.coinv || []) {
    if (x.done) continue;
    const f = S.films[x.f];
    if (f.stage < 0) { x.done = 1; x.lost = 1; inbox('note', `${f.title} is dead`, `${f.title} has been abandoned. Your ${fmtCash(x.amt)} went on development and lawyers, and none of it is coming back.`, { film: f.id }); continue; }
    if (f.events.length > x.ev) { const e = f.events[f.events.length - 1]; x.ev = f.events.length; mail('news', `${P(f.prod).name}`, `From the set of ${f.title}`, `A note to the investors: ${e.t}`); }
    if (f.rel === null && f.stage >= 1 && !x.call && prnd() < .006) { x.call = 1; inbox('fin', `A cash call on ${f.title}`, `${f.title} is over budget and the producers are asking every investor for 20% more. Pay, or see your share diluted.`, { film: f.id, coinv: f.id, choices: [{ k: 'pay', label: `Pay ${fmtCash(Math.round(x.amt * .2))}` }, { k: 'no', label: 'Decline and be diluted' }] }); }
    if (f.rel !== null && S.week >= f.rel + 10) {
      const due = [f.rel + 10, f.rel + 62, f.rel + 114, f.rel + 166].filter(w => S.week >= w).length;
      if (due > (x.stmt || 0)) {
        x.stmt = due; const owed = coinvOwed(x), pay = Math.max(0, owed - x.paid);
        if (pay > 0) { M.cash += pay; x.paid += pay; }
        inbox('note', `Statement: ${f.title}`, `${due === 1 ? 'The theatrical run is in.' : `Year ${due - 1} of television, streaming and home video.`} ${pay > 0 ? `Your share this time: ${fmtCash(pay)}.` : 'Nothing for the investors this time.'} So far you've had back ${fmtCash(x.paid)} on ${fmtCash(x.amt)}.`, { film: f.id });
        if (due >= 4) x.done = 1;
      }
    }
  }
}
function coinvPick(it, k) {
  if (it.kind !== 'fin' || it.coinv === undefined) return false;
  const M = S.me, x = (M.coinv || []).find(y => y.f === it.coinv); it.done = true; it.picked = k;
  if (!x) { it.result = { t: 'Nothing to do.' }; return true; }
  if (k === 'pay') { const v = Math.round(x.amt * .2); if (M.cash < v) { x.amt = Math.round(x.amt * .85); it.result = { t: 'You can\'t cover it. Your share is diluted.' }; return true; } M.cash -= v; x.amt += v; it.result = { t: 'You pay. The film goes on with your share intact.' }; }
  else { x.amt = Math.round(x.amt * .85); it.result = { t: 'Others cover it, and your slice of the film gets thinner.' }; }
  return true;
}

// ---- pages ----
const FIN_COL = { equity: '#c9a227', rebate: '#4a9d7f', presale: '#4a7fbf', gap: '#9b6ab8', investors: '#c96a4a', studio: '#8a8f98', cofi: '#c9a227', defer: '#b0a070' };
function stackBar(L) { const t = L.reduce((s, x) => s + x[1], 0) || 1; return `<div class="finbar">${L.filter(x => x[1] > 0).map(x => `<span style="width:${(x[1] / t * 100).toFixed(1)}%;background:${FIN_COL[x[2]] || '#888'}" title="${esc(x[0])}"></span>`).join('')}</div><ul class="plain small finleg">${L.filter(x => x[1] > 0).map(x => `<li><i style="background:${FIN_COL[x[2]] || '#888'}"></i>${esc(x[0])} <b>${fmtM(x[1])}</b> <span class="muted">${Math.round(x[1] / t * 100)}%</span></li>`).join('')}</ul>`; }
// how any film in the world was paid for: your own films from their real plan, the rest from what's typical
function finStackOf(f) {
  if (f.fin) { const F = f.fin, L = []; if (F.reb) L.push(['Production incentive', F.reb, 'rebate']); if (F.ps) L.push(['Foreign pre-sales', F.ps, 'presale']); if (F.gap) L.push(['Gap loan', F.gap, 'gap']); if (f.investors) L.push(['Equity investors', f.investors.amount, 'investors']); const rest = f.budget - L.reduce((s, x) => s + x[1], 0); if (rest > 0) L.push(['Your company', rest, 'equity']); return L; }
  const r = hashRand(f.id * 131 + 5), b = f.budget, inc = incentiveOf(f.hub, f.ry || yearOf(f.gl)) * .75;
  if (f.co !== null && f.tier === 1) { const co = r() < .35 ? .25 + r() * .25 : 0; return [['Studio', b * (1 - co - inc), 'studio'], co ? ['Co-financing partner', b * co, 'cofi'] : null, inc ? ['Production incentive', b * inc, 'rebate'] : null].filter(Boolean); }
  const eq = eqShare(f), ps = (f.ry || 2000) >= 1975 ? clamp(.1 + r() * .3, 0, 1 - eq - inc) : 0, gap = ps > .15 && r() < .5 ? .1 : 0, rest = Math.max(0, 1 - eq - ps - gap - inc);
  return [[f.co !== null ? 'Company equity' : 'Private equity', b * eq, 'equity'], inc ? ['Production incentive', b * inc, 'rebate'] : null, ps ? ['Foreign pre-sales', b * ps, 'presale'] : null, gap ? ['Gap loan', b * gap, 'gap'] : null, rest > .01 ? [f.co !== null ? 'Distributor advance' : 'Deferred fees and favours', b * rest, f.co !== null ? 'cofi' : 'defer'] : null].filter(Boolean);
}
function finStackHTML(f) {
  if (!f || f.archive) return '';
  const L = finStackOf(f), F = f.fin;
  return `<section class="panel"><h3>How it was paid for</h3>${stackBar(L)}${F ? `<p class="small muted">${F.bonded ? 'Bonded' : 'Not bonded'}${F.bondTook ? ', and the guarantor took it over' : ''} · insured · ${F.over === 'collapsed' ? `<span class="bad">collapsed: ${esc(F.dead || '')}</span>` : esc(f.status)}</p>${F.log.length ? `<ul class="plain small">${F.log.slice(-8).reverse().map(e => `<li class="${e.tone}">${fmtDate(e.w, true)} · ${esc(e.t)}</li>`).join('')}</ul>` : ''}` : `<p class="small muted">${f.co !== null && f.tier === 1 ? 'Studio money, mostly: the studio pays and owns it, sometimes with a partner who takes a slice of the risk.' : 'Independent money: pre-sales, incentives, a loan and equity that gets paid back first, if anything comes back.'}</p>`}</section>`;
}
const ROAD = ['Development and financing', 'Pre-production', 'Shooting', 'Post-production', 'Release'];
function roadHTML(f) { return `<span class="road">${ROAD.map((s, i) => `<span class="${f.stage > i || f.rel !== null ? 'done' : f.stage === i ? 'on' : ''}">${s}</span>`).join('')}</span>`; }
function finPanelHTML() {
  const M = S.me, c = myCo(), mine = c ? c.films.map(i => S.films[i]).filter(f => f.fin && (f.rel === null || S.week - f.rel < 26)) : [];
  const own = mine.length ? `<h4>On the road</h4>${mine.map(f => `<div class="finfilm"><b>${fl(f.id)}</b> ${f.fin.over === 'collapsed' ? '<span class="chip bad">collapsed</span>' : ''}<br>${roadHTML(f)}${stackBar(finStackOf(f))}<p class="small muted">Budget ${fmtM(f.budget)}${f.cost > f.budget ? `, running at ${fmtM(f.cost)}` : ''}${f.fin.bonded ? ' · bonded' : ''}${f.fin.bondTook ? ' · <span class="bad">the guarantor has control</span>' : ''}</p>${f.fin.log.length ? `<ul class="plain small">${f.fin.log.slice(-4).reverse().map(e => `<li class="${e.tone}">${fmtDate(e.w, true)} · ${esc(e.t)}</li>`).join('')}</ul>` : ''}</div>`).join('')}` : '';
  const open = coinvOpen(), held = (M.coinv || []).slice().reverse().slice(0, 12);
  const offer = f => { const amts = [.05, .1, .25].map(p => Math.round(f.cost * 1e6 * eqShare(f) * p)); return `<tr><td>${fl(f.id)}<br><span class="muted small">${esc(f.genre)} · ${esc(hubName(f.hub))} · ${f.co !== null ? cl(f.co) : 'independent'}</span></td><td class="small">${pl(f.dir)}<br>${pl(f.cast[0])}</td><td class="n">${fmtM(f.cost)}</td><td class="small">${esc(f.status)}</td><td><button class="btn-s" data-dealopen="${f.id}">Open talks</button></td></tr>`; };
  return `${own}<h4>Invest in other people's films</h4><p class="small muted">Equity is the money that gets paid back first (120%, then half the profit), and the money that's lost first. On a studio film you're in a slate deal, pro rata, after the studio's fee. Most films lose money; development is where they die. Statements come after the run and then once a year for three years.</p>
   ${open.length ? `<div class="tw"><table class="grid small"><thead><tr><th>Film</th><th>Director, lead</th><th class="n">Budget</th><th>Stage</th><th></th></tr></thead><tbody>${open.map(offer).join('')}</tbody></table></div>` : '<p class="muted small">Nothing raising money in town this week.</p>'}
   ${held.length ? `<h4>Your stakes</h4><ul class="plain small">${held.map(x => { const f = S.films[x.f]; return `<li>${fl(f.id)} · in ${fmtCash(x.amt)} · ${x.lost ? '<span class="bad">lost</span>' : f.rel === null ? esc(f.status) : `back so far <b class="${x.paid >= x.amt ? 'good' : ''}">${fmtCash(x.paid)}</b>`}</li>`; }).join('')}</ul>` : ''}`;
}
function finClick(t) { if (t.dataset.coinv) { const [f, p] = t.dataset.coinv.split(':'); doAct({ t: 'coinv', f: +f, p: +p }); render(true); return true; } return false; }
