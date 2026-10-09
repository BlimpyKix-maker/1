// ---------------- The deal room: producing and investing as a negotiation, and as a process ----------------
// Real film money is never "here's a cheque". It's terms: how much, how it's paid back, who gets a credit, who gets a
// say, what happens next time. This is the trade screen of the business:
//  - Producer deals. When a company says yes to your project, it makes an offer: a fee and nothing else. You can take
//    it, or negotiate: a bigger fee, backend points, creative control, a bigger budget. They have a limit, and every
//    rejected offer costs patience; push too far and they walk.
//  - Investing. Films raising money list their terms. You build an offer (amount, recoupment premium, profit split,
//    an executive producer credit, a say, a first look at the next one) and see how they'll take it, and what it's
//    likely to be worth, from how comparable films actually did.
//  - The process. Once you're in, the film comes to you: producer's calls at every stage that move its quality and
//    its commercial chances (rolls you can see the odds of), set visits, buyout offers for your stake, the streamer
//    who wants to buy the whole thing, statements with the full waterfall.
// Everything that changes the world goes through doAct and rolls on the player RNG when it happens; the screens
// compute but never roll.

// ---- the comparables: how films like this one have actually paid their investors ----
// multiple = what equity got back (recoupment at 120%, then half the profit) over what it put in
// what reaches the equity: rentals after the sales and distribution fees (15% on an independent, 10% mid-size; a
// studio's own films settle pro rata after its fee instead),
// less prints and advertising and the talent's backend, plus half of television, streaming and home video
function eqFee(f) { return f.tier === 1 && f.co !== null ? 0 : f.tier === 2 ? .1 : .15; }
function eqPool(f) { const fee = eqFee(f); return Math.max(0, f.rentals * (1 - fee) - f.pa - f.backend) + (f.afterTotal || 0) * .5 * (1 - fee); }
function eqMultiple(f) {
  if (f.rel === null || f.rentals === undefined) return null;
  const eq = eqShare(f) * f.cost; if (eq <= 0) return null;
  const pool = eqPool(f);
  if (f.tier === 1 && f.co !== null) return pool * .85 / eq;   // a slate deal: pro rata after the studio's fee
  return (Math.min(pool, eq * 1.2) + Math.max(0, pool - eq * 1.2) * .5) / eq;
}
function comparables(f) {
  const A = archive(), key = `${f.tier}|${f.genre}|${S.year}`; A.comps = A.comps || {};
  if (A.comps[key]) return A.comps[key];
  let L = S.films.filter(g => g.rel !== null && g.tier === f.tier && g.rentals !== undefined && g.ry >= S.year - 25 && !g.archive);
  const same = L.filter(g => g.genre === f.genre);
  if (same.length >= 12) L = same;
  const m = L.slice(-160).map(eqMultiple).filter(x => x !== null).sort((a, b) => a - b);
  const q = p => m.length ? m[Math.min(m.length - 1, Math.floor(p * m.length))] : 1;
  return A.comps[key] = { n: m.length, lose: m.length ? m.filter(x => x < 1).length / m.length : .6, p10: q(.1), p50: q(.5), p90: q(.9), genre: same.length >= 12 ? f.genre : null };
}
// how this one looks before anyone has seen it: the script, the director, the star and the buzz move it off the median
function filmOutlook(f) {
  const pq = typeof preQ === 'function' ? preQ(f) : 55, hook = f.hook || 50;
  return clamp(1 + (pq - 55) / 80 + (hook - 50) / 120, .55, 1.6);
}

// ---- deals ----
const dealsOf = () => S.me.talks || [];   // (S.me.deals belongs to the boardroom's tenders and mergers)
const dealBy = id => dealsOf().find(d => d.id === id);
const pick5 = v => Math.round(v * 20) / 20;
function roundCash(v) { const st = v >= 1e6 ? 25000 : v >= 1e5 ? 5000 : v >= 2e4 ? 1000 : 250; return Math.max(st, Math.round(v / st) * st); }
// how badly a film needs money: a stable fraction of its equity still unraised, more as the shoot approaches
function filmNeed(f) { const r = hashRand(f.id * 977 + 3)(); return clamp(.08 + r * .42 + (f.stage === 1 ? .1 : 0) - Math.max(0, f.stageEnd - S.week - 6) * .01, .05, .6); }
function eqUSD(f) { return f.cost * 1e6 * eqShare(f); }
function investAsk(f) { return { amt: roundCash(eqUSD(f) * .1), prem: 1.2, split: .5, ep: 0, say: 0, first: 0 }; }
// The other side's view of an offer: positive is good for them. Their slack is how much they'll give.
function dealSlack(d) {
  const M = S.me, me = ME();
  if (d.kind === 'invest') {
    const f = S.films[d.f], pr = P(f.prod), studio = f.tier === 1 && f.co !== null;
    return 1 + filmNeed(f) * 2.4 + (me.standing - (pr ? pr.standing : 40)) / 40 + (pr ? opinion(pr.id) / 40 : 0) + (M.agent ? .2 : 0) - (studio ? 1.2 : 0) + ((M.firstLook || {})[f.prod] ? .8 : 0);
  }
  const co = S.companies[d.co];
  return 1.6 + ((d.score || 60) - 60) / 12 + me.standing / 30 + (M.agent ? .4 : 0) + (co ? (co.tier === 3 ? .6 : co.tier === 1 ? -.8 : 0) : 0);
}
function dealCost(d, t) {
  if (d.kind === 'invest') {
    const f = S.films[d.f], studio = f.tier === 1 && f.co !== null, share = t.amt / Math.max(1, eqUSD(f)), gap = filmNeed(f);
    const money = share <= gap ? -share / gap * 1.6 : -1.6 + (share - gap) / gap * 1.4;   // they need some money; past that, they'd have to turn others away
    const c = (t.prem - 1.2) * 10 + (t.split - .5) * 12 + t.ep * (share < .06 ? 1.6 : share < .15 ? .5 : 0) + t.say * (studio ? 3 : 1.1) + t.first * .8;
    return (studio ? c * 1.8 : c) + money;
  }
  const a = d.ask;
  return (t.fee / a.fee - 1) * 3 + t.pts * .35 + [0, .8, 2.6][t.ctrl] + t.bud * 2;
}
function dealOdds(d, t) { return clamp(logistic(1.6 * (dealSlack(d) - dealCost(d, t)) - .4), .02, .98); }
function dealMood(p) { return p >= .85 ? ['Delighted', 'good'] : p >= .6 ? ['Interested', 'good'] : p >= .35 ? ['On the fence', ''] : p >= .12 ? ['Unlikely', 'warm'] : ['Insulted', 'bad']; }
// what an investment returns at a given multiple of the film's equity, under these terms
function investReturn(f, t, mult) {
  const eq = eqUSD(f), studio = f.tier === 1 && f.co !== null;
  // the film's equity pool as money, from what the standard terms would have paid
  const pool = mult <= 1.2 ? mult * eq : (1.2 + (mult - 1.2) * 2) * eq;
  const mine = studio ? pool * .85 : Math.min(pool, eq * t.prem) + Math.max(0, pool - eq * t.prem) * t.split;
  return Math.round(mine * t.amt / Math.max(1, eq));
}
function investProjection(f, t) {
  const C = comparables(f), o = filmOutlook(f);
  return { lo: investReturn(f, t, C.p10 * o), mid: investReturn(f, t, C.p50 * o), hi: investReturn(f, t, C.p90 * o), lose: C.lose, n: C.n, genre: C.genre };
}
function produceProjection(d, t) {
  const f = { budget: d.budget * (t.bud ? 1.15 : 1) }, prof = [-.4, .15, 1.2].map(x => Math.max(0, x) * f.budget * 1e6);
  return { now: t.fee, lo: Math.round(prof[0] * t.pts / 100), mid: Math.round(prof[1] * t.pts / 100), hi: Math.round(prof[2] * t.pts / 100) };
}

// ---- opening talks ----
function dealOpenInvest(fid) {
  const M = S.me, f = S.films[fid];
  if (!f || f.rel !== null || f.stage < 0 || f.stage > 1 || dealsOf().some(d => d.f === fid && d.status === 'open') || (M.coinv || []).some(x => x.f === fid)) return false;
  const ask = investAsk(f);
  (M.talks = M.talks || []).push({ id: M.seq++, kind: 'invest', f: fid, who: f.prod, ask, t: Object.assign({}, ask), counter: null, patience: 3 + (opinion(f.prod) > 20 ? 1 : 0), rounds: [], status: 'open', w: S.week, until: Math.min(f.stageEnd, S.week + 6) });
  UI.dealView = M.talks[M.talks.length - 1].id;
  return true;
}
// a company has said yes to your project: the producer's deal is the next fight
function dealOpenProduce(h, co, fee, budget) {
  const M = S.me;
  const ask = { fee, pts: 0, ctrl: 0, bud: 0 };
  const d = { id: M.seq++, kind: 'produce', h: h.id, co: co.id, title: h.title, score: h.score, budget, ask, t: Object.assign({}, ask), counter: null, patience: 3, rounds: [], status: 'open', w: S.week, until: S.week + 4 };
  (M.talks = M.talks || []).push(d);
  inbox('pdeal', `${co.name} wants to make ${h.title}`, `${co.name} will make ${h.title} with a ${fmtM(budget)} budget, and they're offering you a producer's fee of ${fmtCash(fee)}. That's all: no backend, no say over the cut, the budget as it is. You can take it now, or open the Deal Room and negotiate (you have four weeks before they move on).`, { deal: d.id, choices: [{ k: 'take', label: `Take their offer: ${fmtCash(fee)}` }, { k: 'room', label: 'Negotiate in the Deal Room' }, { k: 'walk', label: 'Walk away: you\'ll find a better home' }] });
  return d;
}
function pdealPick(it, k) {
  if (it.kind !== 'pdeal') return false;
  const d = dealBy(it.deal); it.done = true;
  if (!d || d.status !== 'open') { it.result = { t: 'That deal has gone.' }; return true; }
  if (k === 'take') { dealClose(d, d.ask); it.result = { t: 'You sign. The lawyers do the rest.' }; return true; }
  if (k === 'walk') { d.status = 'walked'; it.result = { t: 'You thank them and take it elsewhere. Brave.' }; return true; }
  it.result = { t: 'Open the Deal Room (Money) to make your offer.' }; return true;
}

// ---- making an offer ----
function dealSend(a) {
  const M = S.me, d = dealBy(a.id); if (!d || d.status !== 'open') return false;
  const t = dealClean(d, a.terms); if (!t) return false;
  if (d.kind === 'invest' && M.cash < t.amt) return false;
  const p = dealOdds(d, t), r = prnd();
  d.rounds.push({ w: S.week, t, p: Math.round(p * 100) });
  if (r < p) { dealClose(d, t); d.rounds[d.rounds.length - 1].ok = 1; return true; }
  d.patience -= p < .12 ? 2 : 1;
  if (d.patience <= 0) { d.status = 'walked'; d.rounds[d.rounds.length - 1].walk = 1; dealWalked(d); return true; }
  // they come back with something in between
  const c = {}, last = d.counter || d.ask;
  for (const k in t) c[k] = typeof t[k] === 'number' ? last[k] + (t[k] - last[k]) * .45 : last[k];
  if (d.kind === 'invest') { c.amt = roundCash(c.amt); c.prem = pick5(c.prem); c.split = pick5(c.split); c.ep = dealCost(d, Object.assign({}, c, { ep: t.ep })) < dealSlack(d) - .3 ? t.ep : 0; c.say = t.say && dealCost(d, Object.assign({}, c, { say: 1 })) < dealSlack(d) - .4 ? 1 : 0; c.first = t.first; }
  else { c.fee = roundCash(c.fee); c.pts = Math.round(c.pts * 2) / 2; c.ctrl = Math.min(t.ctrl, (d.counter || d.ask).ctrl + (t.ctrl > 0 && p > .3 ? 1 : 0)); c.bud = t.bud && p > .4 ? 1 : 0; }
  d.counter = c;
  d.rounds[d.rounds.length - 1].counter = c;
  return true;
}
function dealClean(d, t) {
  if (!t) return null;
  if (d.kind === 'invest') {
    const f = S.films[d.f], eq = eqUSD(f);
    return { amt: roundCash(clamp(+t.amt || 0, eq * .02, eq * .45)), prem: clamp(pick5(+t.prem || 1.2), 1, 1.4), split: clamp(pick5(+t.split || .5), .3, .75), ep: t.ep ? 1 : 0, say: t.say ? 1 : 0, first: t.first ? 1 : 0 };
  }
  return { fee: roundCash(clamp(+t.fee || d.ask.fee, d.ask.fee * .5, d.ask.fee * 3)), pts: clamp(Math.round((+t.pts || 0) * 2) / 2, 0, 10), ctrl: clamp(+t.ctrl | 0, 0, 2), bud: t.bud ? 1 : 0 };
}
function dealTakeCounter(a) { const d = dealBy(a.id); if (!d || d.status !== 'open' || !d.counter) return false; if (d.kind === 'invest' && S.me.cash < d.counter.amt) return false; dealClose(d, d.counter); return true; }
function dealWalk(a) { const d = dealBy(a.id); if (!d || d.status !== 'open') return false; d.status = 'walked'; dealWalked(d, true); return true; }
function dealWalked(d, you) {
  if (d.kind === 'invest') { const f = S.films[d.f]; if (f && P(f.prod) && !you) addTie(ME(), P(f.prod), -3); inbox('note', you ? `You walk away from ${f.title}` : `${f.title}: talks are off`, you ? 'You tell them it\'s not for you. They find the money somewhere else.' : `${P(f.prod).name} calls it off: "We're too far apart." They raise the money elsewhere.`, { film: f.id }); }
  else { const co = S.companies[d.co]; inbox('note', `${co ? co.name : 'The company'} moves on`, you ? `You walk away from their offer on ${d.title}. You can pitch it elsewhere.` : `"We can't get there." ${co ? co.name : 'They'} pass on ${d.title}. You can pitch it elsewhere, but they won't take it again this year.`); }
}
function dealClose(d, t) {
  const M = S.me, me = ME();
  d.status = 'done'; d.final = t; d.wDone = S.week;
  if (d.kind === 'invest') {
    const f = S.films[d.f]; if (!f || f.rel !== null || f.stage < 0 || M.cash < t.amt) { d.status = 'walked'; return; }
    M.cash -= t.amt;
    (M.coinv = M.coinv || []).push({ f: f.id, amt: t.amt, w: S.week, paid: 0, ev: f.events.length, prem: t.prem, split: t.split, ep: t.ep, say: t.say, first: t.first, deal: d.id });
    if (t.ep) { f.xc = f.xc || {}; if (!f.xc[me.id]) f.xc[me.id] = 'Executive producer'; }
    if (t.first) (M.firstLook = M.firstLook || {})[f.prod] = S.week;
    if (P(f.prod)) { meet(f.prod, 'You invested in their film', 6); addTie(me, P(f.prod), 4); }
    diary(`Money: put ${fmtCash(t.amt)} into ${f.title}.`);
    milestone(`Invested ${fmtCash(t.amt)} in ${f.title}${t.ep ? ', executive producer' : ''}`, 'work');
    return;
  }
  // a producer's deal: now the film is made, on these terms
  const h = (M.holdings || []).find(x => x.id === d.h), co = S.companies[d.co];
  if (!h || h.made !== undefined || !co || co.closed !== null) { d.status = 'walked'; return; }
  const f = greenlight(M.hub, { genre: h.genre, wri: [h.writer], title: h.title, prod: me.id, co: co.id, score: h.score });
  if (t.bud) { const add = f.budget * .15; f.budget += add; f.cost += add; co.cash -= add; }
  h.made = f.id; f.xc = f.xc || {}; f.xc[me.id] = 'Producer'; (M.coYes = M.coYes || {})[co.id] = S.week;
  f.pdeal = { fee: t.fee, pts: t.pts, ctrl: t.ctrl, bud: t.bud, paid: 0, deal: d.id };
  M.cash += t.fee - taxOn(t.fee); me.standing = clamp(me.standing + 3, 0, 100);
  addTie(me, P(h.writer), 10);
  sms(h.writer, 'THEY SAID YES. WE\'RE MAKING IT', 'tip');
  milestone(`${co.name} greenlit ${f.title}: you're producing`, 'credit');
  inbox('news', `Green light: ${f.title}`, `${co.name} makes ${f.title}: a ${fmtM(f.budget)} budget, directed by ${P(f.dir).name}. Your deal: ${fmtCash(t.fee)} now${t.pts ? `, ${t.pts} points of the profit` : ''}${t.ctrl === 2 ? ', final say on the cut' : t.ctrl === 1 ? ', consulted on cast and cut' : ''}${t.bud ? ', and the extra 15% budget you fought for' : ''}.`, { film: f.id });
}
// talks that go nowhere end on their own
function dealRoomWeek() {
  const M = S.me;
  for (const d of dealsOf()) if (d.status === 'open' && S.week >= d.until) { d.status = 'lapsed'; if (d.kind === 'produce') inbox('note', `${(S.companies[d.co] || {}).name || 'The company'} moves on`, `Four weeks and no deal: they pass on ${d.title}.`); }
  M.talks = dealsOf().filter(d => d.status === 'open' || S.week - (d.wDone || d.w) < 104);
  prodCalls(); stakeEvents(); pointsStatements();
}

// ---- the producer's calls: hands on, every stage ----
// [k, stage(s), title, text, options: [k, label, stat, dc, q, hook, cost (share of budget), delay (weeks)]]
const PCALLS = [
  ['rewrite', [0], 'The second act sags', 'Everyone agrees the script loses its way in the middle. Nobody agrees what to do.', [['doctor', 'Hire a script doctor', 'eye', 12, 3, 1, .015, 0], ['draft', 'One more draft from the writer', 'col', 11, 2, 0, 0, 3], ['shoot', 'Shoot it and fix it in the edit', null, 0, -1, 0, 0, 0]]],
  ['dirwrite', [0], 'The director wants to rewrite it', 'The director has done a pass on the script themselves, and the writer has found out.', [['let', 'Back the director', 'tas', 12, 2, 0, 0, 0], ['writer', 'Protect the writer\'s draft', 'talent', 12, 1, 0, 0, 0], ['merge', 'Lock them in a room until it\'s one script', 'cha', 13, 3, 1, 0, 2]]],
  ['title', [0, 1], 'Marketing hates the title', 'The title tested last of six. The writer says it\'s the whole point.', [['keep', 'Keep it', null, 0, 1, -2, 0, 0], ['test', 'Take the one that tested best', 'mkt', 11, -1, 5, 0, 0], ['third', 'Find a third title everyone can live with', 'orig', 12, 0, 4, 0, 0]]],
  ['gap', [0, 1], 'The budget doesn\'t close', 'You\'re eight percent short and the start date is real.', [['cut', 'Cut a set piece', 'bud', 11, -1, -1, -.06, 0], ['gapfin', 'Find gap financing', 'fin', 13, 0, 0, .01, 0], ['copro', 'Bring in a co-producer from abroad', 'pack', 12, 0, 3, -.04, 1]]],
  ['star', [0, 1], 'A star\'s agent calls', 'A genuinely famous actor has read it and wants the lead. It would mean recasting someone you promised.', [['chase', 'Chase the star', 'talent', 14, -1, 9, .08, 2], ['loyal', 'Keep your promise', 'eth', 10, 2, 0, 0, 0], ['both', 'Offer the star a different part', 'cha', 15, 1, 5, .04, 0]]],
  ['lead', [1], 'Two actors for the lead', 'The last two in the room: a name the buyers know, and someone unknown who made the room go quiet.', [['name', 'Cast the name', 'talent', 11, -1, 6, .03, 0], ['unknown', 'Cast the unknown', 'eye', 13, 3, -1, 0, 0], ['chem', 'Bring both back for a chemistry read', 'tas', 12, 2, 2, 0, 1]]],
  ['where', [1], 'Where to shoot', 'Shoot where the story is set, or two hours away where the tax break is.', [['real', 'Shoot where it\'s set', 'setm', 11, 2, 1, .04, 0], ['rebate', 'Take the tax break', 'fin', 10, -1, 0, -.06, 0], ['stage', 'Build it on a stage', 'bud', 12, 1, 0, .02, 1]]],
  ['dp', [1], 'The DP you wanted is booked', 'Your first-choice cinematographer just signed for a superhero film.', [['wait', 'Wait for them', null, 0, 2, 0, .01, 3], ['second', 'Take your second choice', 'eye', 11, 1, 0, 0, 0], ['poach', 'Make them a better offer', 'pack', 14, 2, 0, .02, 0]]],
  ['sched', [1], 'The schedule is too tight', 'The first AD says the schedule is fantasy: thirty-two days of work in twenty-six.', [['days', 'Pay for six more days', 'fin', 10, 2, 0, .04, 0], ['trim', 'Trim the script to fit', 'struc', 12, 0, 0, 0, 0], ['trust', 'Trust the director to be fast', 'tas', 14, 1, 0, 0, 0]]],
  ['insure', [1], 'The insurer won\'t cover the lead', 'The insurers want a premium nobody budgeted for, because of the lead\'s "history".', [['pay', 'Pay the premium', null, 0, 0, 0, .015, 0], ['bond', 'Lean on the bond company', 'fin', 13, 0, 0, 0, 0], ['recast', 'Recast', 'talent', 12, -1, -2, 0, 2]]],
  ['weather', [2], 'A week of rain', 'The exteriors are scheduled for a week of solid rain.', [['wait', 'Wait it out', null, 0, 1, 0, .03, 1], ['rewrite', 'Rewrite the scenes for rain', 'orig', 12, 3, 0, 0, 0], ['cover', 'Move to cover sets', 'bud', 11, 0, 0, 0, 0]]],
  ['over', [2], 'Eight days over', 'The shoot is running eight days over. The completion guarantor is asking questions.', [['pay', 'Find the money', 'fin', 12, 2, 0, .05, 0], ['cut', 'Cut two scenes', 'shape', 11, -1, 0, 0, 0], ['push', 'Push the director to go faster', 'cha', 13, 0, 0, .01, 0]]],
  ['tantrum', [2], 'The lead won\'t come out of their trailer', 'Your star is refusing to shoot until a scene is rewritten their way.', [['talk', 'Go in and talk them out', 'cha', 13, 1, 0, 0, 0], ['give', 'Give them the rewrite', null, 0, -1, 1, 0, 0], ['wait', 'Shoot around them for a day', 'bud', 11, 0, 0, .01, 0]]],
  ['improv', [2], 'The director is off the script', 'The director has started improvising whole scenes. The dailies are electric, or a mess.', [['let', 'Let them run', 'tas', 13, 3, 0, .01, 0], ['rein', 'Rein them in', 'cha', 12, 0, 0, 0, 0], ['both', 'Get the scripted version too', 'bud', 12, 1, 0, .02, 0]]],
  ['safety', [2], 'An accident on set', 'A rigging failure. Nobody is badly hurt, but the crew is shaken and the union rep is here.', [['stop', 'Stop for two days and fix it properly', 'eth', 9, 1, 0, .02, 1], ['carry', 'Carry on with a safety officer', 'bud', 12, 0, 0, .005, 0], ['hush', 'Keep it quiet', 'cha', 14, 1, 0, -.005, 0]]],
  ['dailies', [2], 'The dailies look flat', 'A week of footage and none of it has the life of the script.', [['reshoot', 'Reshoot the key scene', 'eye', 12, 3, 0, .02, 0], ['look', 'Change the look: new lenses, harder light', 'light', 13, 2, 0, .01, 0], ['trust', 'Trust it\'ll come together in the cut', null, 0, -1, 0, 0, 0]]],
  ['romance', [2], 'Rumours on set', 'The leads are rumoured to be together. The press is camped outside.', [['use', 'Let the rumours sell the film', 'mkt', 11, 0, 5, 0, 0], ['shield', 'Close the set', 'eth', 10, 1, 0, .005, 0], ['deny', 'Put out a statement', 'cha', 12, 0, 2, 0, 0]]],
  ['strike', [2], 'The crew threatens to walk', 'Fourteen-hour days, three weeks running. The crew wants turnaround respected, or they go.', [['agree', 'Agree to twelve-hour days', 'eth', 9, 1, 0, .03, 1], ['bonus', 'Pay a bonus to finish', 'fin', 11, 0, 0, .025, 0], ['hard', 'Hold the line', 'cha', 16, 0, 0, 0, 0]]],
  ['test', [3], 'The test screening', 'The test audience liked it, but the ending scored lowest of anything. The director won\'t change it.', [['recut', 'Recut the ending', 'shape', 12, -1, 6, .01, 1], ['back', 'Back the director', 'tas', 13, 3, -2, 0, 0], ['reshoot', 'Shoot a new ending', 'fin', 14, 1, 5, .04, 3]]],
  ['long', [3], 'The cut is three hours long', 'The director\'s cut runs three hours and four minutes. It is, they say, finished.', [['cut', 'Get it under two hours', 'shape', 13, 1, 4, 0, 1], ['keep', 'Release it long', 'tas', 14, 2, -4, 0, 0], ['two', 'Two versions: theatrical and director\'s cut', 'pack', 12, 1, 2, .01, 0]]],
  ['music', [3], 'The song you can\'t afford', 'The film ends on a famous song. The publisher wants more than the whole music budget.', [['pay', 'Pay it', 'pack', 12, 1, 2, .015, 0], ['new', 'Commission something new', 'theme', 12, 2, 0, .005, 1], ['sound', 'Find a sound-alike', null, 0, -1, 0, 0, 0]]],
  ['vfx', [3], 'The effects house goes bust', 'Your VFX vendor has gone into administration with forty shots unfinished.', [['split', 'Split the shots between two houses', 'bud', 12, 0, 0, .03, 1], ['cut', 'Cut the shots you can lose', 'shape', 11, -1, 0, 0, 0], ['prac', 'Shoot practical inserts', 'prac', 13, 2, 0, .02, 2]]],
  ['fest', [3], 'Festival first?', 'A major festival will take it, in competition. It could make the film, or be the end of it.', [['go', 'Premiere at the festival', 'tas', 12, 1, 6, .005, 0], ['wide', 'Straight to cinemas', 'mkt', 11, 0, 2, 0, 0], ['market', 'Sell it at the market instead', 'dist', 12, 0, 3, -.02, 0]]],
  ['date', [3], 'The release date', 'Distribution offers the summer weekend against a franchise, or the quiet autumn where critics have room.', [['summer', 'Summer, head on', 'mkt', 13, 0, 7, .02, 0], ['autumn', 'The autumn', 'dist', 11, 1, 2, 0, 0], ['spring', 'Early spring, alone', null, 0, 0, 1, 0, 0]]],
  ['angle', [3], 'The trailer gives away the twist', 'The trailer tests through the roof, because it gives away the ending.', [['keep', 'Use it: tickets are tickets', 'mkt', 10, -1, 6, 0, 0], ['recut', 'Recut it to keep the secret', 'rhythm', 12, 1, 3, .005, 0], ['teaser', 'Teaser only: mystery', 'tas', 13, 1, 4, 0, 0]]],
  ['pa', [3], 'The marketing spend', 'Marketing wants to double the spend. Finance wants to halve it.', [['double', 'Double it', 'mkt', 12, 0, 8, .06, 0], ['hold', 'Hold the plan', null, 0, 0, 1, 0, 0], ['smart', 'Spend it online, cleverly', 'mkt', 13, 0, 5, .01, 0]]]
];
const PCALL_BY = {}; for (const c of PCALLS) PCALL_BY[c[0]] = c;
// your films, and how much your word weighs on each
function prodFilms() {
  const M = S.me, me = ME(), out = [];
  for (const f of S.active.map(i => S.films[i])) {
    if (!f || f.rel !== null || f.stage < 0 || f.stage > 3) continue;
    if (f.co !== null && f.co === M.company) out.push([f, 1.2, 'Your company']);
    else if (f.prod === me.id && f.pdeal) out.push([f, [.75, 1, 1.3][f.pdeal.ctrl || 0], 'Producer']);
    else if (f.prod === me.id) out.push([f, .8, 'Producer']);
    else { const x = (M.coinv || []).find(y => y.f === f.id && y.say && !y.done); if (x) out.push([f, .5, 'Investor with a say']); }
  }
  return out;
}
function prodCalls() {
  const M = S.me; if (pending().some(it => it.kind === 'pcall')) return;
  const L = prodFilms().filter(([f]) => !(f.pc && S.week - f.pc.w < 4));
  if (!L.length || prnd() > .3) return;
  const [f, sw, as] = L[Math.floor(prnd() * L.length)];
  const seen = (f.pc && f.pc.seen) || [];
  const C = PCALLS.filter(c => c[1].includes(f.stage) && !seen.includes(c[0])); if (!C.length) return;
  const c = C[Math.floor(prnd() * C.length)];
  f.pc = { w: S.week, seen: seen.concat(c[0]) };
  inbox('pcall', `${f.title}: ${c[2].toLowerCase()}`, `${c[3]} ${as === 'Investor with a say' ? 'As an investor with a say, the producers want your view.' : 'It\'s your call.'}`, { film: f.id, call: c[0], sway: sw, choices: c[4].map(o => Object.assign({ k: o[0], label: o[1] + (o[6] > 0 ? ` (${fmtM(f.budget * o[6])})` : o[6] < 0 ? ` (saves ${fmtM(-f.budget * o[6])})` : '') + (o[7] ? ` · ${o[7]} wk` : '') }, o[2] ? { check: [o[2], o[3]] } : {})) });
}
function pcallPick(it, k) {
  if (it.kind !== 'pcall') return false;
  const M = S.me, me = ME(), f = S.films[it.film], c = PCALL_BY[it.call], o = c && c[4].find(x => x[0] === k); it.done = true;
  if (!f || !o || f.rel !== null || f.stage < 0) { it.result = { t: 'Too late: it was decided without you.' }; return true; }
  const [, label, stat, dc, q, hook, cost, delay] = o, sw = it.sway || 1;
  let ok = true, r = null; if (stat) { ok = roll(stat, dc); r = M.lastRoll; }
  const crit = r ? r.crit : 0;
  const dq = ok ? q * sw + (crit > 0 ? 1.5 : 0) : -Math.max(1, Math.abs(q)) * sw * .6 - (crit < 0 ? 1.5 : 0);
  const dh = ok ? hook * sw : -Math.max(1, Math.abs(hook)) * sw * .5;
  f.qBonus = (f.qBonus || 0) + dq; f.hook = clamp((f.hook || 50) + dh, 5, 99); f.you = (f.you || 0) + dq;
  if (cost) { const add = f.budget * cost * (ok ? 1 : 1.3); f.cost += add; if (f.co !== null && S.companies[f.co]) S.companies[f.co].cash -= add; }
  if (k === 'double' && ok) f.paMul = (f.paMul || 1) * 1.25;
  if (delay) { f.stageEnd += delay; for (const p of keyPeople(f)) if (p.busy >= S.week) p.busy += delay; }
  for (const s of [stat].filter(s => s && me.sk[s] !== undefined)) growSub(me, s, .08);
  (f.calls = f.calls || []).push({ w: S.week, who: M.id, call: c[2], pick: label, ok, dq: +dq.toFixed(1), dh: +dh.toFixed(1) });
  if (f.fin) finLog(f, `${c[2]}: ${label.toLowerCase()} (${ok ? 'it worked' : 'it didn\'t'}).`, ok ? 'good' : 'bad');
  it.result = { ok: stat ? ok : null, roll: r, t: `${ok ? pickLine(['It works. You can feel the film get better.', 'The right call, and everyone can see it.', 'It lands. The crew remembers who made it.'], S.week + f.id) : pickLine(['It doesn\'t work, and it costs you.', 'It goes wrong in a way nobody predicted.', 'Not your finest hour. The film will carry a scar.'], S.week + f.id)} ${dq >= 0 ? '+' : ''}${dq.toFixed(1)} quality, ${dh >= 0 ? '+' : ''}${dh.toFixed(1)} buzz.` };
  return true;
}

// ---- investors: the process, not just the cheque ----
function stakeEvents() {
  const M = S.me; if (pending().some(it => it.kind === 'stake')) return;
  const live = (M.coinv || []).filter(x => !x.done && !x.sold && S.films[x.f] && S.films[x.f].stage >= 0);
  if (!live.length || prnd() > .12) return;
  const x = live[Math.floor(prnd() * live.length)], f = S.films[x.f], o = filmOutlook(f), C = comparables(f);
  const seen = x.seen = x.seen || [];
  const L = [];
  if (f.rel === null && f.stage === 2 && !seen.includes('visit')) L.push('visit');
  if (f.rel === null && !seen.includes('buyout') && S.week - x.w >= 6) L.push('buyout');
  if (f.rel === null && f.stage === 3 && !seen.includes('stream') && f.tier !== 1) L.push('stream');
  if (f.rel !== null && !seen.includes('award') && f.reviews >= 75 && S.week - f.rel < 30) L.push('award');
  if (f.rel !== null && !seen.includes('late') && x.paid < x.amt && S.week - f.rel > 20) L.push('late');
  if (!L.length) return;
  const k = L[Math.floor(prnd() * L.length)]; seen.push(k);
  const lead = f.cast[0] !== undefined ? P(f.cast[0]) : null;
  if (k === 'visit') inbox('stake', `A set visit: ${f.title}`, `The producers invite the investors to set for a day. ${lead ? lead.name + ' is shooting the big scene.' : ''} Free lunch, a chair with no name on it, a lot of standing around.`, { film: f.id, stake: x.f, ev: k, choices: [{ k: 'go', label: 'Go (a day of your week)' }, { k: 'no', label: 'Send your regards' }] });
  if (k === 'buyout') {
    const mult = clamp(C.p50 * o * (.75 + prnd() * .35), .35, 2.2), price = roundCash(x.amt * mult);
    x.offer = price;
    inbox('stake', `Someone wants your piece of ${f.title}`, `A fund that buys stakes in films wants yours: ${fmtCash(price)} now, for the ${fmtCash(x.amt)} you put in. On the comparables, a film like this pays its investors ${C.p50.toFixed(2)}x at the median and ${Math.round(C.lose * 100)}% of them lose money.`, { film: f.id, stake: x.f, ev: k, choices: [{ k: 'sell', label: `Sell for ${fmtCash(price)}` }, { k: 'haggle', label: `Ask for ${fmtCash(roundCash(price * 1.25))}`, check: ['fin', 13] }, { k: 'hold', label: 'Hold: let it ride' }] });
  }
  if (k === 'stream') {
    const mult = clamp(1.05 + (o - 1) * .6 + prnd() * .35, 1.02, 1.7);
    x.smult = +mult.toFixed(2);
    const share = x.amt / Math.max(1, eqUSD(f)), you = share >= .25 || x.say;
    inbox('stake', `A streamer wants to buy ${f.title}`, `A streamer offers to buy the film outright before release: every investor gets ${mult.toFixed(2)}x their money back, guaranteed, and the film never plays in a cinema. ${you ? 'Your stake is big enough that your vote decides it.' : `You hold ${Math.round(share * 100)}% of the equity; the investors vote.`}`, { film: f.id, stake: x.f, ev: k, decide: you ? 1 : 0, choices: [{ k: 'yes', label: `Take the guaranteed ${mult.toFixed(2)}x` }, { k: 'no', label: 'Gamble on the cinemas' }] });
  }
  if (k === 'award') inbox('stake', `An awards campaign for ${f.title}`, `${f.title} got the reviews (${f.reviews}/100). The producers want the investors to fund an awards campaign: screenings, ads, dinners. ${fmtCash(roundCash(x.amt * .08))} from you.`, { film: f.id, stake: x.f, ev: k, choices: [{ k: 'yes', label: `Chip in ${fmtCash(roundCash(x.amt * .08))}` }, { k: 'no', label: 'The film can speak for itself' }] });
  if (k === 'late') inbox('stake', `A second life for ${f.title}?`, `${f.title} hasn't paid you back yet. A sales agent thinks a recut and a new campaign could sell it again to television abroad, if investors put in a little more.`, { film: f.id, stake: x.f, ev: k, choices: [{ k: 'yes', label: `Put in ${fmtCash(roundCash(x.amt * .1))}`, check: ['dist', 12] }, { k: 'no', label: 'Write it off' }] });
}
function stakePick(it, k) {
  if (it.kind !== 'stake') return false;
  const M = S.me, me = ME(), x = (M.coinv || []).find(y => y.f === it.stake), f = S.films[it.film]; it.done = true;
  if (!x || !f) { it.result = { t: 'Nothing to decide any more.' }; return true; }
  const ev = it.ev;
  if (ev === 'visit') {
    if (k === 'go') { M.energy = clamp(M.energy - 8, 0, 100); const lead = f.cast[0] !== undefined ? P(f.cast[0]) : null; if (lead) meet(lead.id, 'Met on set', 6); if (P(f.dir)) meet(f.dir, 'Met on set', 5); it.result = { t: `You stand behind the monitors, eat too many biscuits and watch ${lead ? lead.name : 'the lead'} do it nine times, each better. You meet the director, briefly.` }; }
    else it.result = { t: 'They send you a photo of the clapperboard.' };
    return true;
  }
  if (ev === 'buyout') {
    if (k === 'hold') { it.result = { t: 'You hold. Fortune favours the patient, or doesn\'t.' }; return true; }
    let price = x.offer || 0, r = null;
    if (k === 'haggle') { const ok = roll('fin', 13); r = M.lastRoll; if (!ok) { it.result = { ok, roll: r, t: 'They walk. The offer is off the table.' }; return true; } price = roundCash(price * 1.25); }
    x.sold = price; x.done = 1; x.paid += price; M.cash += price;
    milestone(`Sold your stake in ${f.title} for ${fmtCash(price)} (in for ${fmtCash(x.amt)})`, 'work');
    it.result = { ok: r ? true : null, roll: r, t: `Sold: ${fmtCash(price)}. ${price >= x.amt ? 'A profit, banked.' : 'A loss, but a known one.'}` };
    return true;
  }
  if (ev === 'stream') {
    const yes = it.decide ? k === 'yes' : prnd() < (k === 'yes' ? .65 : .35);
    if (yes) { const v = Math.round(x.amt * (x.smult || 1.1)); x.sold = v; x.done = 1; x.paid += v; M.cash += v; f.paMul = (f.paMul || 1) * .3; f.hook = clamp((f.hook || 50) - 10, 5, 99); milestone(`${f.title} sold to a streamer: you got ${fmtCash(v)} back on ${fmtCash(x.amt)}`, 'work'); it.result = { t: `The investors take the money. ${fmtCash(v)} lands in your account; the film goes straight to streaming.` }; }
    else it.result = { t: k === 'yes' ? 'You voted to sell, but the other investors want the cinemas. The gamble is on.' : 'The investors turn it down. The film goes to cinemas, and so does your money.' };
    return true;
  }
  if (ev === 'award') {
    if (k === 'yes') { const v = roundCash(x.amt * .08); if (M.cash < v) { it.result = { t: 'You can\'t cover it.' }; return true; } M.cash -= v; x.amt += v; f.awardPush = (f.awardPush || 0) + 1; me.standing = clamp(me.standing + .8, 0, 100); it.result = { t: 'The campaign runs: screenings with Q&As, ads in the trades, a dinner you go to. Whatever happens, people know your name is on it.' }; }
    else it.result = { t: 'The producers find the money elsewhere, or don\'t.' };
    return true;
  }
  if (ev === 'late') {
    if (k === 'yes') { const v = roundCash(x.amt * .1); if (M.cash < v) { it.result = { t: 'You can\'t cover it.' }; return true; } M.cash -= v; x.amt += v; const ok = roll('dist', 12), r = M.lastRoll; if (ok) { const back = roundCash(v * (1.5 + prnd() * 3)); M.cash += back; x.paid += back; it.result = { ok, roll: r, t: `The recut sells in eleven territories. ${fmtCash(back)} comes back to you.` }; } else it.result = { ok, roll: r, t: 'Nobody bites. The recut sits on a server.' }; }
    else it.result = { t: 'You write it off. Every investor has one.' };
    return true;
  }
  it.result = { t: 'Done.' }; return true;
}
// producer's points: statements after the run, then yearly, with the waterfall
function pointsStatements() {
  const M = S.me, me = ME();
  for (const f of S.films) {
    if (!f || !f.pdeal || f.prod !== me.id || f.rel === null || !f.pdeal.pts) continue;
    const due = [f.rel + 12, f.rel + 64, f.rel + 116].filter(w => S.week >= w).length;
    if (due <= (f.pdeal.stmt || 0)) continue;
    f.pdeal.stmt = due;
    const net = Math.max(0, f.rentals - f.pa - f.backend - f.cost + (f.afterTotal || 0) * .5);
    const owed = Math.round(net * 1e6 * f.pdeal.pts / 100), pay = Math.max(0, owed - (f.pdeal.paid || 0));
    if (pay > 0) { M.cash += pay; f.pdeal.paid = (f.pdeal.paid || 0) + pay; M.stats.earned += pay; }
    inbox('note', `Producer statement: ${f.title}`, pay > 0 ? `Your ${f.pdeal.pts} points pay ${fmtCash(pay)} this time (${fmtCash(f.pdeal.paid)} so far).` : `The film is ${net > 0 ? 'in profit, and you\'ve had your share' : 'still unrecouped on paper'}: nothing on your points this time.`, { film: f.id });
  }
}

// ---- the pages ----
function waterfallHTML(f, x) {
  if (f.rel === null || f.rentals === undefined) return '';
  const eq = eqShare(f) * f.cost, pool = eqPool(f), fee = eqFee(f), prem = x && x.prem || 1.2, split = x && x.split || .5;
  const rec = Math.min(pool, eq * prem), prof = Math.max(0, pool - eq * prem) * split, frac = x ? x.amt / Math.max(1, eq * 1e6) : 0;
  const line = (t, v, cls = '') => `<tr><td>${t}</td><td class="n ${cls}">${fmtM(v)}</td></tr>`;
  return `<table class="grid small wf"><tbody>${line('Box office, worldwide', f.total)}${line('Rentals (what cinemas pass back)', f.rentals)}${line(`− Distribution fee (${Math.round(fee * 100)}%)`, -f.rentals * fee, 'bad')}${line('− Prints and advertising', -f.pa, 'bad')}${line('− Talent backend', -f.backend, 'bad')}${f.afterTotal ? line('+ Half of TV, streaming, home video so far (after fees)', (f.afterTotal || 0) * .5 * (1 - fee), 'good') : ''}${line('= The pool for the equity', pool)}${line(`Equity recoups (${Math.round(prem * 100)}% of ${fmtM(eq)})`, rec)}${line(`Profit to the equity (${Math.round(split * 100)}%)`, prof)}${x ? `<tr><td><b>Your slice (${(frac * 100).toFixed(1)}% of the equity)</b></td><td class="n"><b>${fmtCash(Math.round((rec + prof) * 1e6 * frac))}</b></td></tr>` : ''}</tbody></table>`;
}
function termSel(id, opts, cur) { return `<select data-dt="${id}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(cur) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`; }
function dealScreen(d) {
  const M = S.me, me = ME(), ed = (UI.dt = UI.dt || {})[d.id] || (UI.dt[d.id] = Object.assign({}, d.counter || d.t)), t = dealClean(d, ed) || d.ask;
  const p = dealOdds(d, t), [mood, cls] = dealMood(p), last = d.rounds[d.rounds.length - 1];
  const row = (label, theirs, mine, note) => `<tr><td>${label}</td><td class="muted">${theirs}</td><td>${mine}</td><td class="small muted">${note || ''}</td></tr>`;
  let head, rows, proj;
  if (d.kind === 'invest') {
    const f = S.films[d.f], eq = eqUSD(f), a = d.counter || d.ask, pr = investProjection(f, t);
    const amts = [.02, .04, .06, .08, .1, .15, .2, .25, .3, .4].map(x => roundCash(eq * x)).filter((v, i, L) => L.indexOf(v) === i);
    if (!amts.includes(t.amt)) amts.push(t.amt); amts.sort((x, y) => x - y);
    head = `<h4>${fl(f.id)} <span class="muted small">${esc(f.genre)} · ${fmtM(f.cost)} budget · equity ${fmtM(eq / 1e6)} · ${esc(f.status)} · producer ${pl(f.prod)}</span></h4>`;
    rows = row('Amount', fmtCash(a.amt), termSel('amt', amts.map(v => [v, `${fmtCash(v)} (${Math.round(v / eq * 100)}% of the equity)`]), t.amt), `They still need about ${Math.round(filmNeed(f) * 100)}% of the equity.`)
      + row('Recoupment', `${Math.round(a.prem * 100)}%`, termSel('prem', [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4].map(v => [v, Math.round(v * 100) + '% before profits']), t.prem), 'How much equity gets back before anyone shares a profit.')
      + row('Profit split', `${Math.round(a.split * 100)}% to equity`, termSel('split', [.3, .35, .4, .45, .5, .55, .6, .65, .7, .75].map(v => [v, Math.round(v * 100) + '% to equity']), t.split), 'After recoupment, the profit is split between the equity and the producers.')
      + row('Credit', a.ep ? 'Executive producer' : 'None', termSel('ep', [[0, 'No credit'], [1, 'Executive producer']], t.ep), 'A credit on screen and in the trades. Cheap for them if your cheque is big.')
      + row('A say', a.say ? 'Consulted' : 'None', termSel('say', [[0, 'Silent money'], [1, 'Consulted on the big calls']], t.say), 'You\'ll get the producer\'s calls on this film (cast, cut, release).')
      + row('First look', a.first ? 'Yes' : 'No', termSel('first', [[0, 'No'], [1, 'First look at their next film']], t.first), 'Their next one comes to you first, on better terms.');
    proj = `<p class="small">On the comparables (${pr.n} ${pr.genre ? esc(pr.genre.toLowerCase()) + ' ' : ''}films at this level), and how this one looks: <b class="bad">${fmtCash(pr.lo)}</b> back if it goes badly · <b>${fmtCash(pr.mid)}</b> in the middle · <b class="good">${fmtCash(pr.hi)}</b> if it hits, for ${fmtCash(t.amt)} in. ${Math.round(pr.lose * 100)}% of films like it lose their investors money.</p>`;
  } else {
    const a = d.counter || d.ask, pr = produceProjection(d, t), co = S.companies[d.co];
    const fees = [.8, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5].map(x => roundCash(d.ask.fee * x)).filter((v, i, L) => L.indexOf(v) === i); if (!fees.includes(t.fee)) fees.push(t.fee); fees.sort((x, y) => x - y);
    head = `<h4>${esc(d.title)} at ${co ? cl(co.id) : 'the company'} <span class="muted small">${fmtM(d.budget)} budget · your read on the script: ${gradeOf(d.score)}</span></h4>`;
    rows = row('Producer\'s fee', fmtCash(a.fee), termSel('fee', fees.map(v => [v, fmtCash(v)]), t.fee), 'Paid on the green light.')
      + row('Backend points', `${a.pts}`, termSel('pts', [0, 1, 2, 2.5, 3, 4, 5, 6, 7.5, 10].map(v => [v, v ? v + '% of the profit' : 'None']), t.pts), 'A share of the film\'s profit, paid in statements after release. Most films show none.')
      + row('Creative control', ['None', 'Consulted', 'Final say'][a.ctrl], termSel('ctrl', [[0, 'None'], [1, 'Consulted on cast and cut'], [2, 'Final say']], t.ctrl), 'How much your calls move the film.')
      + row('Budget', a.bud ? '+15%' : 'As offered', termSel('bud', [[0, 'As offered'], [1, '15% more']], t.bud), 'More money, a better-made film, and more for them to lose.');
    proj = `<p class="small">What you get: <b>${fmtCash(pr.now)}</b> now${t.pts ? `; on ${t.pts} points, <b class="bad">${fmtCash(pr.lo)}</b> if it flops, <b>${fmtCash(pr.mid)}</b> if it does modestly, <b class="good">${fmtCash(pr.hi)}</b> if it's a hit` : ''}. Plus the credit, and standing that follows the film.</p>`;
  }
  return `<div class="panel inset deal">${head}
   <div class="tw"><table class="grid deal"><thead><tr><th>Term</th><th>${d.counter ? 'Their counter' : 'Their offer'}</th><th>Your offer</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="dealmeter"><span>Their reaction</span><span class="bar"><i class="${cls}" style="width:${Math.round(p * 100)}%"></i></span><b class="${cls}">${mood} · ${Math.round(p * 100)}%</b> <span class="muted small">Patience: ${'●'.repeat(Math.max(0, d.patience))}${'○'.repeat(Math.max(0, 4 - d.patience))} · open until ${fmtDate(d.until, true)}</span></div>
   ${proj}
   ${last ? `<p class="small">${last.ok ? '<b class="good">Accepted.</b>' : last.walk ? '<b class="bad">They walked.</b>' : `Your last offer (${last.p}%) was turned down${last.counter ? '; they came back with the counter above' : ''}.`}</p>` : ''}
   <p><button class="btn-s" data-dealsend="${d.id}"${d.kind === 'invest' && M.cash < t.amt ? ' disabled title="Not enough in the bank"' : ''}>Send this offer</button> ${d.counter ? `<button class="btn-s ghost" data-dealtake="${d.id}">Accept their counter</button> ` : ''}<button class="btn-s ghost" data-dealwalk="${d.id}">Walk away</button></p></div>`;
}
function dealroomApp() {
  const M = S.me; if (!M || !careerActive()) return '<p class="muted">Start a career to use the Deal Room.</p>';
  const me = ME(), open = dealsOf().filter(d => d.status === 'open'), raising = coinvOpen(), stakes = (M.coinv || []).slice().reverse(), prods = S.films.filter(f => f && f.prod === me.id && (f.pdeal || f.co === M.company)).slice(-12).reverse();
  const view = UI.dealView ? dealBy(UI.dealView) : null;
  const raiseRow = f => { const C = comparables(f), o = filmOutlook(f), busy = dealsOf().some(d => d.f === f.id && d.status === 'open'); return `<tr><td>${fl(f.id)}<br><span class="muted small">${esc(f.genre)} · ${esc(hubName(f.hub))} · ${f.co !== null ? cl(f.co) : 'independent'}${(M.firstLook || {})[f.prod] ? ' · <b>first look</b>' : ''}</span></td><td class="small">${pl(f.prod)}<br>${pl(f.dir)}, ${pl(f.cast[0])}</td><td class="n">${fmtM(f.cost)}</td><td class="small">${Math.round(filmNeed(f) * 100)}% to raise</td><td class="small">median ${(C.p50 * o).toFixed(2)}x · ${Math.round(C.lose * 100)}% lose</td><td>${busy ? `<button class="btn-s ghost" data-dealv="${dealsOf().find(d => d.f === f.id && d.status === 'open').id}">In talks</button>` : `<button class="btn-s" data-dealopen="${f.id}">Open talks</button>`}</td></tr>`; };
  const stakeRow = x => { const f = S.films[x.f]; if (!f) return ''; const st = x.sold ? `<span class="${x.sold >= x.amt ? 'good' : 'bad'}">sold for ${fmtCash(x.sold)}</span>` : x.lost ? '<span class="bad">lost</span>' : f.rel === null ? esc(f.status) : `back ${fmtCash(x.paid)}`; return `<tr data-stakev="${x.f}" class="clickrow"><td>${fl(f.id)}</td><td class="n">${fmtCash(x.amt)}</td><td class="small">${x.prem ? Math.round(x.prem * 100) + '% · ' + Math.round(x.split * 100) + '%' : 'standard'}${x.ep ? ' · EP' : ''}${x.say ? ' · a say' : ''}</td><td>${st}</td><td class="n ${x.paid >= x.amt ? 'good' : ''}">${(x.paid / Math.max(1, x.amt)).toFixed(2)}x</td></tr>`; };
  const sv = UI.stakeView !== undefined && UI.stakeView !== null ? (M.coinv || []).find(x => x.f === +UI.stakeView) : null;
  return `<div class="dealroom"><section class="panel"><h3>The Deal Room</h3><p class="muted">Producing and investing are negotiations. Build an offer, see how they'll take it and what it's likely to be worth, then send it. Every rejection costs patience; push too far and they walk. Once you're in, the film keeps coming back to you: calls to make, offers for your stake, statements with the whole waterfall.</p>
   ${open.length ? `<h4>Open talks</h4><p>${open.map(d => `<button class="btn-s ${view && view.id === d.id ? '' : 'ghost'}" data-dealv="${d.id}">${esc(d.kind === 'invest' ? S.films[d.f].title : d.title)}${d.kind === 'produce' ? ' (your producer deal)' : ''}</button>`).join(' ')}</p>` : ''}
   ${view && view.status === 'open' ? dealScreen(view) : view ? `<p class="small">Talks on ${esc(view.kind === 'invest' ? S.films[view.f].title : view.title)}: <b>${view.status === 'done' ? 'deal done' : view.status}</b>.</p>` : ''}</section>
   <section class="panel"><h3>Films raising money</h3>${raising.length ? `<div class="tw"><table class="grid small"><thead><tr><th>Film</th><th>Producer · director, lead</th><th class="n">Budget</th><th>Need</th><th>Comparables</th><th></th></tr></thead><tbody>${raising.map(raiseRow).join('')}</tbody></table></div>` : '<p class="muted small">Nothing raising money that would take your call this week.</p>'}</section>
   ${prods.length ? `<section class="panel"><h3>Your producer deals</h3><div class="tw"><table class="grid small"><thead><tr><th>Film</th><th>Deal</th><th>Status</th><th class="n">Paid to you</th><th>Your calls</th></tr></thead><tbody>${prods.map(f => { const D = f.pdeal; const calls = (f.calls || []).filter(c => c.who === M.id); return `<tr><td>${fl(f.id)}</td><td>${D ? `${fmtCash(D.fee)} fee${D.pts ? ` · ${D.pts} pts` : ''}${D.ctrl ? ' · ' + ['', 'consulted', 'final say'][D.ctrl] : ''}${D.bud ? ' · +15% budget' : ''}` : 'your company'}</td><td>${esc(f.status)}${f.rel !== null ? ` · ${f.reviews}/100 · ${fmtM(f.total)}` : ''}</td><td class="n">${D ? fmtCash(D.fee + (D.paid || 0)) : '—'}</td><td class="small">${calls.length ? calls.slice(-3).map(c => `<span class="${c.ok ? 'good' : 'bad'}">${esc(c.call)}</span>`).join(', ') : '<span class="muted">none yet</span>'}</td></tr>`; }).join('')}</tbody></table></div></section>` : ''}
   ${stakes.length ? `<section class="panel"><h3>Your stakes</h3><div class="tw"><table class="grid small"><thead><tr><th>Film</th><th class="n">In</th><th>Terms</th><th>Status</th><th class="n">Multiple</th></tr></thead><tbody>${stakes.map(stakeRow).join('')}</tbody></table></div>${sv ? `<div class="panel inset"><h4>${fl(sv.f)} <button class="linkish" data-stakev="">close</button></h4>${S.films[sv.f].rel !== null ? waterfallHTML(S.films[sv.f], sv) : (() => { const f = S.films[sv.f], pr = investProjection(f, { amt: sv.amt, prem: sv.prem || 1.2, split: sv.split || .5 }); return `<p class="small">Not out yet (${esc(f.status)}). On the comparables: ${fmtCash(pr.lo)} / ${fmtCash(pr.mid)} / ${fmtCash(pr.hi)} back for your ${fmtCash(sv.amt)}.</p>`; })()}${(S.films[sv.f].calls || []).length ? `<p class="small">Calls made on this film: ${(S.films[sv.f].calls || []).slice(-6).map(c => `${esc(c.call)} (${esc(c.pick)}, ${c.ok ? 'worked' : 'didn\'t'})`).join('; ')}</p>` : ''}</div>` : '<p class="muted small">Click a stake for its waterfall.</p>'}</section>` : ''}
   <section class="panel"><h3>How the money works</h3><ul class="plain small"><li><b>Recoupment:</b> the equity gets its money back (plus the premium) before anyone sees a profit.</li><li><b>Profit split:</b> after that, profit is shared between the equity and the producers.</li><li><b>Backend points:</b> a producer's share of the film's profit. Paid in statements after the run, then yearly.</li><li><b>Studio films</b> are slate deals: pro rata with the studio, after its fee, and the studio doesn't negotiate much.</li><li><b>Most films lose money.</b> The comparables tell you how many.</li></ul></section></div>`;
}
OS_EXTRA.deals = ['🤝', 'Deal Room', 'Negotiate producer deals, invest in films, make the calls, read the waterfall'];
OS_VIEWS.deals = () => dealroomApp();
{ const g = OS_GROUPS.find(x => x[0] === 'Money'); if (g && !g[1].includes('deals')) g[1].unshift('deals'); }
function dealClick(t) {
  if (t.dataset.dealopen) { doAct({ t: 'dealopen', f: +t.dataset.dealopen }); UI.app = 'deals'; render(true); return true; }
  if (t.dataset.dealv !== undefined) { UI.dealView = t.dataset.dealv ? +t.dataset.dealv : null; render(true); return true; }
  if (t.dataset.dealsend) { const id = +t.dataset.dealsend, d = dealBy(id); if (d) { const terms = dealClean(d, (UI.dt || {})[id] || d.t); doAct({ t: 'dealsend', id, terms }); if (UI.dt) { const dd = dealBy(id); UI.dt[id] = Object.assign({}, dd.counter || terms); } } render(true); return true; }
  if (t.dataset.dealtake) { doAct({ t: 'dealtake', id: +t.dataset.dealtake }); render(true); return true; }
  if (t.dataset.dealwalk) { doAct({ t: 'dealwalk', id: +t.dataset.dealwalk }); render(true); return true; }
  if (t.dataset.stakev !== undefined) { UI.stakeView = t.dataset.stakev === '' ? null : +t.dataset.stakev; render(true); return true; }
  return false;
}
function dealChange(e) {
  const k = e.target.dataset && e.target.dataset.dt; if (!k) return false;
  const id = UI.dealView, d = dealBy(id); if (!d) return false;
  UI.dt = UI.dt || {}; UI.dt[id] = Object.assign({}, UI.dt[id] || d.counter || d.t, { [k]: +e.target.value });
  return true;
}
