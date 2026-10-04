// ---------------- The boardroom: seats, packages, takeovers and mergers ----------------
// The late game. Own enough of a listed company, or matter enough in the business, and you're asked onto its board:
// quarterly fees, and a vote every quarter on what the company does next (a tentpole, the chief executive's pay,
// whether to fire them, a rival to buy). Climb to president or chief executive and you negotiate a real package:
// bonus, shares that vest, a parachute. With serious money you can make a tender offer for control, and with control
// you can merge companies: an offer to the target's board, a regulator's review, a shareholder vote, and a new name
// on the trades' front page. Everything rides on the world's own numbers (cash in millions, share prices, market caps).
const BOARD_FEE = [0, 350000, 180000, 90000];   // a director's yearly fee, 2027 dollars, by company tier
function stakeOf(c) { const n = ((S.me && S.me.port) || {})[c.id] || 0; return n / (sharesOf(c) * 1e6); }
const myBoards = () => (S.me.boards = S.me.boards || {});
const myCtrl = () => (S.me.ctrl = S.me.ctrl || {});
const onBoard = c => !!myBoards()[c.id];
const controls = c => !!myCtrl()[c.id] || (S.me.company !== undefined && S.me.company === c.id);
const bpct = v => (v * 100).toFixed(v < .1 ? 1 : 0) + '%';
// The other directors: fixed by the company and the year, refreshed as terms end.
const BOARD_BIOS = ['former chief financial officer of a rival studio', 'a retired senator', 'founder of a cable network', 'a private-equity partner', 'a former head of a talent agency', 'an economist from the business school', 'the founding family\'s representative', 'a former studio chairman', 'a tech executive', 'a pension fund\'s nominee', 'a celebrated producer', 'a former treasury official', 'chief executive of a theme-park group', 'a media lawyer', 'an activist investor\'s nominee'];
function boardOf(c) {
  const term = Math.floor(S.year / 3), r = hashRand(c.id * 7919 + term * 31 + 3), N = NAMES[(HUBS[c.hub] || HUBS.hollywood).lang] || NAMES.en, out = [];
  for (let i = 0; i < 9; i++) { const g = r() < .32 ? 'F' : 'M'; out.push({ name: `${N[g][Math.floor(r() * N[g].length)]} ${N.L[Math.floor(r() * N.L.length)]}`, bio: i === 0 ? 'chair of the board' : BOARD_BIOS[Math.floor(r() * BOARD_BIOS.length)] }); }
  return out;
}
function ceoName(c) {
  const H = typeof headsOf === 'function' ? headsOf(c) : []; if (H.length) return H[0].name || (P(H[0].id) || {}).name || 'the chief executive';
  const R = coRef('f' + c.id), O = R && orgChart(R); return O ? staffAt(R, O.D[0].start).name : 'the chief executive';
}

// ---- what comes before the board each quarter ----
// Each item: who it suits, the text, the choices, and what passing does. q is the quality of the proposal (hidden).
const AGENDA = [
  { k: 'tentpole', when: c => c.cash > 0, t: c => `A tentpole for ${c.name}`, d: (c, x) => `Management wants to greenlight ${x.title}, a ${fmtM(x.amt)} franchise picture. The projections are ${x.q > .55 ? 'bullish' : 'optimistic in the way projections always are'}.`, pass: (c, x) => { c.cash -= x.amt * .3; (S.me.bets = S.me.bets || []).push({ co: c.id, w: S.week + 26, amt: x.amt, q: x.q, title: x.title, vote: x.vote }); } },
  { k: 'ceopay', t: c => `${ceoName(c)}'s new package`, d: (c, x) => `The compensation committee proposes ${fmtM(x.amt)} a year for ${ceoName(c)}, mostly in shares. The proxy advisers call it "generous".`, pass: (c, x) => { c.cash -= x.amt * .2; }, fail: (c, x) => { if (x.q < .4) news('Company', `${ceoName(c)} leaves ${c.name} after the board rejects a pay package.`, { company: c.id }); } },
  { k: 'fireceo', when: c => c.cash < 0 || (typeof chg === 'function' && chg(c, 52) < -15), t: c => `Replace ${ceoName(c)}?`, d: (c, x) => `A bad year: the shares are ${typeof chg === 'function' ? chg(c, 52).toFixed(0) : '?'}% over twelve months. Two directors want a new chief executive.`, pass: (c, x) => { news('Company', `${c.name} replaces its chief executive after a difficult year.`, { company: c.id }); if (corpRung() >= 6 || ME().standing >= 75) inbox('board', `${c.name} wants you to run it`, `The search committee has one name on its list: yours. The chief executive's chair at ${c.name}, ${fmtCash(usd(rungPay(c, 7)))} a year before the package.`, { act: 'ceooffer', co: c.id, choices: [{ k: 'yes', label: 'Take the job' }, { k: 'no', label: 'Decline' }] }); } },
  { k: 'acquire', when: c => c.cash > 20 && acqTarget(c), t: c => `Buy ${acqTarget(c).name}?`, d: (c, x) => { const T = acqTarget(c); return `${T.name} is for sale at about ${fmtM(x.amt)}. Management says the library alone is worth it.`; }, pass: (c, x) => { const T = acqTarget(c); if (T && T.closed === null) mergeInto(c, T, x.amt, 'buys'); } },
  { k: 'stream', when: c => c.tier === 1 && !c.stream && S.year >= 2007, t: c => `${c.name} launches a streaming service`, d: (c, x) => `A direct-to-consumer service: ${fmtM(x.amt)} to build, years of losses, and the library pulled from everyone else.`, pass: (c, x) => { c.stream = S.year; c.cash -= x.amt; (S.me.bets = S.me.bets || []).push({ co: c.id, w: S.week + 104, amt: x.amt * 1.2, q: x.q, title: 'the streaming service', vote: x.vote }); news('Company', `${c.name} announces its own streaming service.`, { company: c.id }); } },
  { k: 'dividend', when: c => c.cash > 30, t: c => `A special dividend from ${c.name}`, d: (c, x) => `Return ${fmtM(x.amt)} of cash to shareholders. Investors love it; the slate gets thinner.`, pass: (c, x) => { c.cash -= x.amt; const got = Math.round(x.amt * 1e6 * stakeOf(c)); if (got > 0) { S.me.cash += got; diary(`Money: a special dividend from ${c.name}, ${fmtCash(got)}.`); } } },
  { k: 'scandal', t: c => `A scandal at ${c.name}`, d: (c, x) => `A senior executive is accused of bullying staff. The trades have it tomorrow. Fire them, or stand by them pending an inquiry.`, pass: (c, x) => { news('Company', `${c.name} fires a senior executive after allegations of bullying.`, { company: c.id }); }, fail: (c, x) => { if (x.q < .5) { c.cash -= 4; news('Company', `${c.name} under fire for standing by an executive accused of bullying.`, { company: c.id }); } } },
  { k: 'layoffs', when: c => c.cash < 40, t: c => `Cut ${c.name}'s staff by a tenth?`, d: (c, x) => `Consultants say ${fmtM(x.amt)} a year in savings. The staff will know by Friday.`, pass: (c, x) => { c.cash += x.amt; news('Company', `${c.name} cuts a tenth of its staff.`, { company: c.id }); } }
];
function acqTarget(c) { return S.companies.filter(x => x !== c && x.closed === null && x.owner === undefined && HUBS[x.hub].m === HUBS[c.hub].m && x.tier >= c.tier && (x.tier > c.tier || x.cash < c.cash * .3)).sort((a, b) => (b.hits || 0) - (a.hits || 0))[0] || null; }
const PIC_A = ['Titan', 'Starfall', 'Iron', 'Crimson', 'Shadow', 'Thunder', 'Quantum', 'Last', 'Eternal', 'Dragon'], PIC_B = ['Rising', 'Legacy', 'Protocol', 'Reckoning', 'Frontier', 'Kingdom', 'Dawn', 'Requiem', 'Ascension', 'Odyssey'];
function boardMeeting(c) {
  const r = hashRand(c.id * 131 + S.week * 7 + 1), L = AGENDA.filter(A => !A.when || A.when(c)), A = L[Math.floor(r() * L.length)];
  const scale = [0, 1, .35, .1][c.tier], amt = Math.round(({ tentpole: 180, ceopay: 25, fireceo: 0, acquire: 0, stream: 400, dividend: Math.max(5, c.cash * .2), scandal: 0, layoffs: 30 })[A.k] * scale * 10) / 10 || 1;
  const x = { k: A.k, co: c.id, amt: A.k === 'acquire' ? Math.round(mcap(acqTarget(c)) * 1.3) : amt, q: r(), title: `${PIC_A[Math.floor(r() * 10)]} ${PIC_B[Math.floor(r() * 10)]}` };
  const ctl = controls(c), chair = (myBoards()[c.id] || {}).chair;
  inbox('board', `Board meeting: ${A.t(c)}`, `${A.d(c, x)}${ctl ? ' You control the company: your vote decides it.' : chair ? ' You chair the meeting: your vote carries extra weight.' : ' Nine directors vote; yours is one.'}`, { act: 'vote', co: c.id, ag: x, choices: [{ k: 'yes', label: 'Vote for it' }, { k: 'no', label: 'Vote against it' }, { k: 'lobbyyes', label: 'Vote for it, and work the room', check: ['cha', 14] }, { k: 'lobbyno', label: 'Vote against it, and work the room', check: ['cha', 14] }] });
}
function boardPick(it, k) {
  if (it.kind !== 'board') return false;
  const M = S.me, me = ME(); it.done = true;
  if (it.act === 'seat') {
    const c = S.companies[it.co]; if (!c || c.closed !== null) { it.result = { t: 'The company is gone.' }; return true; }
    if (k !== 'yes') { it.result = { t: 'You decline, politely. They\'ll ask someone else.' }; return true; }
    myBoards()[c.id] = { since: S.week, chair: 0 }; me.standing = clamp(me.standing + 2, 0, 100);
    milestone(`Joined the board of ${c.name}`, 'work'); news('Company', `${me.name} joins the board of ${c.name}.`, { company: c.id, person: me.id });
    it.result = { t: `You're a director of ${c.name}: ${fmtCash(usd(BOARD_FEE[c.tier]))} a year and a vote every quarter.` }; return true;
  }
  if (it.act === 'vote') {
    const c = S.companies[it.co], x = it.ag, A = AGENDA.find(a => a.k === x.k); if (!c || c.closed !== null || !A) { it.result = { t: 'The meeting never happens.' }; return true; }
    const mine = k === 'yes' || k === 'lobbyyes';
    let yes = 0; const r = hashRand(c.id * 977 + S.week * 13 + 5);
    for (let i = 0; i < 8; i++) if (r() < .25 + x.q * .5) yes++;
    let swing = 0, ok = null;
    if (k.startsWith('lobby')) { ok = roll('cha', 14); swing = ok ? 2 : -1; }
    yes += (mine ? 1 : 0) + (mine ? swing : -swing) * 1; if (myBoards()[c.id] && myBoards()[c.id].chair) yes += mine ? 1 : -1;
    const passes = controls(c) ? mine : yes > 4;
    x.vote = mine ? 'yes' : 'no';
    if (passes) A.pass(c, x); else if (A.fail) A.fail(c, x);
    (M.boardLog = M.boardLog || []).push({ w: S.week, co: c.id, k: x.k, t: A.t(c), mine: x.vote, passed: passes ? 1 : 0, yes: clamp(yes, 0, 9) });
    if (M.boardLog.length > 80) M.boardLog.shift();
    if (passes === mine) me.standing = clamp(me.standing + .3, 0, 100);
    it.result = { ok, roll: ok !== null ? M.lastRoll : undefined, t: `${passes ? 'Carried' : 'Defeated'}${controls(c) ? ', on your say-so' : `, ${clamp(yes, 0, 9)} to ${9 - clamp(yes, 0, 9)}`}. ${passes === mine ? 'The room went your way.' : 'You were on the losing side, and the minutes say so.'}` };
    return true;
  }
  if (it.act === 'pkg') {
    const j = typeof corpJob === 'function' ? corpJob() : null, c = j && S.companies[j.co]; if (!c) { it.result = { t: 'The job is gone.' }; return true; }
    const r = +j.k.slice(5), base = rungPay(c, r), P0 = { co: c.id, rung: r, since: S.week, salary: base, bonus: .5, grant: Math.round(base * 2 / Math.max(1, mktPrice(c))), vested: 0, para: 0, job: j.id };
    let ok = null;
    if (k === 'hard') { ok = roll('pack', 15); if (ok) Object.assign(P0, { bonus: 1, grant: P0.grant * 2, para: base * 2 }); else { P0.grant = Math.round(P0.grant * .8); ME().standing = clamp(ME().standing - 1, 0, 100); } }
    if (k === 'equity') { j.rate = Math.round(j.rate * .7); P0.salary = base * .7; P0.grant *= 3; }
    if (k === 'para') { ok = roll('cha', 13); if (ok) P0.para = base * 2.5; }
    M.pkg = P0;
    it.result = { ok, roll: ok !== null ? M.lastRoll : undefined, t: `Signed: ${fmtCash(usd(P0.salary))} a year, a bonus of up to ${Math.round(P0.bonus * 100)}% of salary on the share price, ${P0.grant.toLocaleString()} shares vesting over four years${P0.para ? `, and ${fmtCash(usd(P0.para))} if they ever let you go` : ''}.${ok === false ? ' The board remembers how hard you pushed.' : ''}` };
    milestone(`Negotiated an executive package at ${c.name}`, 'work');
    return true;
  }
  if (it.act === 'ceooffer') {
    const c = S.companies[it.co]; if (!c || c.closed !== null || k !== 'yes') { it.result = { t: 'You stay where you are.' }; return true; }
    const j0 = corpJob(); if (j0) finishJob(j0, null, true);
    const t = ODD_BY.corp_7, p = makePost(t, null); Object.assign(p, { co: c.id, rate: usd(Math.round(rungPay(c, 7) / 240)), head: null, mco: c.name, away: c.hub !== M.hub ? c.hub : undefined }); takeJob(p);
    milestone(`Became chief executive of ${c.name}`, 'work'); news('Company', `${me.name} named chief executive of ${c.name}.`, { company: c.id, person: me.id });
    it.result = { t: `You're the chief executive of ${c.name}. The board will send a package to negotiate.` }; return true;
  }
  if (it.act === 'antitrust') {
    const D = (M.deals || []).find(d => d.id === it.deal); if (!D) { it.result = { t: 'The deal is gone.' }; return true; }
    if (k === 'divest') { D.divest = 1; D.cleared = 1; it.result = { t: 'You agree to sell off a label. The regulator clears the deal, and the bankers take their cut of the sale.' }; }
    else if (k === 'fight') { const ok = roll('fin', 16); D.cleared = ok ? 1 : 0; if (!ok) D.dead = 'blocked by the regulator'; it.result = { ok, roll: M.lastRoll, t: ok ? 'The court sides with you. The deal goes ahead whole.' : 'The court sides with the regulator. The merger is blocked.' }; }
    else { D.dead = 'abandoned at the regulator'; it.result = { t: 'You walk away. The break fee stings.' }; }
    return true;
  }
  return false;
}
// ---- mergers: one company swallows another ----
function mergeInto(a, b, priceM, verb) {
  a.cash -= priceM; a.cash += b.cash;
  for (const f of S.films) { if (f.owner === b.id) f.owner = a.id; if (f.co === b.id && f.rel === null) { f.co = a.id; a.films.push(f.id); } }
  for (const k in b.favors || {}) a.favors[k] = (a.favors[k] || 0) + b.favors[k] * .5;
  a.hits = (a.hits || 0) + (b.hits || 0); if (b.tier < a.tier) a.tier = b.tier;
  b.closed = S.year; b.mergedInto = a.id; (a.acquired = a.acquired || []).push(b.id);
  // whatever the player owned of the target is bought out at the deal price
  const M = S.me, n = (M.port || {})[b.id] || 0; if (n) { const got = Math.round(n * mktPrice(b) * (priceM / Math.max(.01, mcap(b)))); M.cash += got; delete M.port[b.id]; diary(`Money: your ${n.toLocaleString()} shares in ${b.name} are bought out for ${fmtCash(got)}.`); }
  delete myCtrl()[b.id]; delete myBoards()[b.id];
  news('Company', `${a.name} ${verb || 'merges with'} ${b.name} for ${fmtM(priceM)}.`, { company: a.id });
}
// ---- the player's own moves: tender offers and mergers ----
const PREMS = [[.2, 'a 20% premium'], [.35, 'a 35% premium'], [.5, 'a 50% premium']];
function tenderCost(c, prem) { const need = Math.max(0, .51 - stakeOf(c)); return Math.round(need * sharesOf(c) * 1e6 * mktPrice(c) * (1 + prem)); }
function boardAct(a) {
  const M = S.me, me = ME(); M.deals = M.deals || [];
  if (a.k === 'tender') {
    const c = S.companies[a.co], prem = +a.prem; if (!c || c.closed !== null || controls(c) || !listedCos().includes(c) || !PREMS.some(p => p[0] === prem)) return false;
    if (M.deals.some(d => !d.done && (d.co === c.id || d.b === c.id))) return false;
    const cost = tenderCost(c, prem); if (M.cash < cost) return false;
    M.deals.push({ id: (M.dealN = (M.dealN || 0) + 1), kind: 'tender', co: c.id, prem, w: S.week, next: S.week + 2, stage: 0, cost });
    news('Company', `${me.name} launches a tender offer for ${c.name} at ${Math.round(prem * 100)}% over the market.`, { company: c.id, person: me.id });
    diary(`Deal: you offer to buy control of ${c.name}, about ${fmtCash(cost)}.`); return true;
  }
  if (a.k === 'merge') {
    const A = S.companies[a.a], B = S.companies[a.b], prem = +a.prem;
    if (!A || !B || A === B || A.closed !== null || B.closed !== null || !controls(A) || !PREMS.some(p => p[0] === prem)) return false;
    if (M.deals.some(d => !d.done && [d.a, d.b, d.co].some(x => x === A.id || x === B.id))) return false;
    const price = Math.round(mcap(B) * (1 + prem) * 10) / 10; if (A.cash < price * .4) return false;
    M.deals.push({ id: (M.dealN = (M.dealN || 0) + 1), kind: 'merge', a: A.id, b: B.id, prem, price, w: S.week, next: S.week + 3, stage: 0 });
    news('Company', `${A.name} makes an offer for ${B.name}: ${fmtM(price)}.`, { company: A.id });
    diary(`Deal: ${A.name} bids ${fmtM(price)} for ${B.name}.`); return true;
  }
  if (a.k === 'dividend') { const c = S.companies[a.co]; if (!c || !myCtrl()[c.id]) return false; (M.divPol = M.divPol || {})[c.id] = clamp(+a.v, 0, .35); return true; }
  if (a.k === 'chair') { const c = S.companies[a.co], B = myBoards()[a.co]; if (!c || !B || B.chair || !(controls(c) || stakeOf(c) >= .15 || ME().standing >= 80)) return false; B.chair = S.week; milestone(`Became chair of ${c.name}`, 'work'); return true; }
  if (a.k === 'resign') { if (!myBoards()[a.co] || myCtrl()[a.co]) return false; delete myBoards()[a.co]; diary(`You resign from the board of ${S.companies[a.co].name}.`); return true; }
  return false;
}
const DEAL_STAGES = { tender: ['Announced', 'The board responds', 'Shareholders tender', 'Done'], merge: ['Announced', 'Talks with the target\'s board', 'The regulator reviews it', 'Shareholders vote', 'Done'] };
function dealWeek(D) {
  const M = S.me, me = ME();
  if (D.kind === 'tender') {
    const c = S.companies[D.co]; if (!c || c.closed !== null) { D.done = 'the company is gone'; return; }
    if (D.stage === 0) { D.friendly = onBoard(c) || D.prem >= .5 || prnd() < .25 + D.prem; D.stage = 1; D.next = S.week + 4; inbox('note', `${c.name}'s board ${D.friendly ? 'recommends your offer' : 'calls your offer hostile'}`, D.friendly ? 'They tell shareholders to accept. The bankers start counting fees.' : 'They adopt a poison pill and call your premium "opportunistic". Shareholders will decide.'); return; }
    if (D.stage === 1) {
      const cost = tenderCost(c, D.prem), p = clamp(.25 + D.prem * 1.1 + (D.friendly ? .3 : 0) + stakeOf(c), .05, .95);
      if (M.cash < cost) { D.done = 'you could no longer pay for it'; inbox('note', 'The tender offer lapses', 'Your money isn\'t there when it\'s needed. The offer lapses, and the trades notice.'); me.standing = clamp(me.standing - 2, 0, 100); return; }
      if (prnd() < p) {
        const need = Math.max(0, Math.ceil((.51 - stakeOf(c)) * sharesOf(c) * 1e6)); M.cash -= cost; M.port = M.port || {}; M.port[c.id] = (M.port[c.id] || 0) + need; M.portCost = M.portCost || {}; M.portCost[c.id] = (M.portCost[c.id] || 0) + cost;
        myCtrl()[c.id] = S.week; myBoards()[c.id] = { since: S.week, chair: S.week }; D.done = 'won'; D.stage = 2;
        me.standing = clamp(me.standing + 5, 0, 100); milestone(`Took control of ${c.name}`, 'work'); news('Company', `${me.name} takes control of ${c.name}.`, { company: c.id, person: me.id });
        inbox('note', `${c.name} is yours`, `Shareholders tender ${bpct(.51)} of the company. You chair the board now: set the dividend, pick the chief executive, and if you like, start buying other companies with it.`);
      } else { D.done = 'shareholders refused'; M.cash -= Math.round(cost * .01); inbox('note', `The bid for ${c.name} fails`, 'Not enough shareholders tender. The bankers send their bill anyway (1%).'); news('Company', `${me.name}'s bid for ${c.name} fails.`, { company: c.id }); }
      return;
    }
  }
  if (D.kind === 'merge') {
    const A = S.companies[D.a], B = S.companies[D.b]; if (!A || !B || A.closed !== null || B.closed !== null) { D.done = 'one of the companies is gone'; return; }
    if (D.dead) { D.done = D.dead; A.cash -= D.price * .03; news('Company', `${A.name}'s deal for ${B.name} collapses: ${D.dead}.`, { company: A.id }); return; }
    if (D.stage === 0) { const ok = controls(B) || D.prem >= .5 || prnd() < .35 + D.prem; if (!ok) { D.dead = 'rejected by the target\'s board'; D.next = S.week; return; } D.stage = 1; D.next = S.week + 6; inbox('note', `${B.name} agrees terms`, `The boards shake hands on ${fmtM(D.price)}. Now the regulator gets a look.`); return; }
    if (D.stage === 1) {
      const big = A.tier === 1 && B.tier === 1 && HUBS[A.hub].m === HUBS[B.hub].m;
      if (big && D.cleared === undefined) { if (!pending().some(x => x.act === 'antitrust')) inbox('board', 'The regulator has concerns', `Two major studios in one market. The competition authority wants a remedy before it clears ${A.name}'s purchase of ${B.name}.`, { act: 'antitrust', deal: D.id, choices: [{ k: 'divest', label: 'Offer to sell a label' }, { k: 'fight', label: 'Fight it in court', check: ['fin', 16] }, { k: 'walk', label: 'Walk away' }] }); D.next = S.week + 2; return; }
      D.stage = 2; D.next = S.week + 4; return;
    }
    if (D.stage === 2) {
      if (prnd() < (controls(B) ? .97 : .8 - D.prem * .2 + D.prem * .5)) {
        mergeInto(A, B, D.price * (D.divest ? .8 : 1), 'completes its merger with');
        if (D.divest) A.cash -= D.price * .05;
        D.done = 'completed'; D.stage = 3; me.standing = clamp(me.standing + 6, 0, 100); milestone(`Merged ${B.name} into ${A.name}`, 'work');
        inbox('note', 'The merger closes', `${B.name} is part of ${A.name} now: its library, its slate and its staff. The trades call you a mogul. Some of them mean it kindly.`);
      } else D.dead = 'voted down by shareholders';
      return;
    }
  }
}
// ---- every week ----
function boardWeek() {
  const M = S.me, me = ME(), B = myBoards();
  // fees, quarterly
  if (S.week % 13 === 0) { let fee = 0; for (const id in B) { const c = S.companies[+id]; if (c && c.closed === null) fee += usd(BOARD_FEE[c.tier] / 4); } if (fee) { M.cash += fee; diary(`Money: director's fees, ${fmtCash(fee)}.`); } }
  // seats lapse when the company goes; control lapses when the stake drops
  for (const id in B) { const c = S.companies[+id]; if (!c || c.closed !== null) delete B[id]; }
  for (const id in myCtrl()) { const c = S.companies[+id]; if (!c || c.closed !== null || stakeOf(c) < .5) { delete myCtrl()[id]; if (c && c.closed === null) diary(`You no longer control ${c.name}.`); } }
  // invitations, once a quarter
  if (S.week % 13 === 3 && !pending().some(x => x.kind === 'board' && x.act === 'seat')) {
    const big = listedCos().filter(c => !onBoard(c) && stakeOf(c) >= .05)[0];
    if (big) inbox('board', `A seat on ${big.name}'s board`, `You own ${bpct(stakeOf(big))} of ${big.name}. Shareholders that size get a seat at the table, if they want one: ${fmtCash(usd(BOARD_FEE[big.tier]))} a year, four meetings, and a vote.`, { act: 'seat', co: big.id, choices: [{ k: 'yes', label: 'Take the seat' }, { k: 'no', label: 'Decline' }] });
    else if (Object.keys(B).length < 3 && me.standing >= 60 && (corpRung() >= 4 || (me.fame || 0) >= 35 || me.standing >= 75) && prnd() < .3) {
      const L = listedCos().filter(c => !onBoard(c) && HUBS[c.hub].m === HUBS[M.hub].m); if (L.length) { const c = L[Math.floor(prnd() * L.length)]; inbox('board', `An invitation from ${c.name}`, `The nominating committee would like you as an independent director: someone who knows how films actually get made. ${fmtCash(usd(BOARD_FEE[c.tier]))} a year and four meetings.`, { act: 'seat', co: c.id, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] }); }
    }
  }
  // meetings, each company on its own quarter
  for (const id in B) { const c = S.companies[+id]; if (c && S.week % 13 === (c.id % 13) && !pending().some(x => x.kind === 'board' && x.act === 'vote' && x.co === c.id)) boardMeeting(c); }
  // bets the board made come good or bad
  for (const b of (M.bets || []).filter(b => !b.done && S.week >= b.w)) { b.done = 1; const c = S.companies[b.co]; if (!c || c.closed !== null) continue; const good = prnd() < b.q; c.cash += good ? b.amt * .9 : -b.amt * .5; news('Company', good ? `${c.name}'s ${b.title} pays off handsomely.` : `${c.name}'s ${b.title} loses a fortune.`, { company: c.id }); if (b.vote) { const right = (b.vote === 'yes') === good; me.standing = clamp(me.standing + (right ? 1.5 : -1), 0, 100); if (onBoard(c)) inbox('note', `${b.title}: ${good ? 'a hit' : 'a write-off'}`, `${right ? 'You called it, and the other directors noticed.' : 'You voted the wrong way, and the minutes say so.'}`); } }
  // deals in progress
  for (const D of (M.deals || []).filter(d => !d.done && S.week >= d.next)) dealWeek(D);
  // controlled companies pay out what you set
  for (const id in M.divPol || {}) { const c = S.companies[+id], p = M.divPol[id]; if (!c || !myCtrl()[id] || !p || S.week % 13 !== 6 || c.cash <= 0) continue; const out = c.cash * p / 4; c.cash -= out; const got = Math.round(out * 1e6 * stakeOf(c)); M.cash += got; diary(`Money: ${c.name} pays you a dividend of ${fmtCash(got)}.`); }
  // an executive package: the letter, the vesting, the bonus, the parachute
  const j = typeof corpJob === 'function' ? corpJob() : null;
  if (j && +j.k.slice(5) >= 5 && (!M.pkg || M.pkg.job !== j.id) && !pending().some(x => x.act === 'pkg')) {
    const c = S.companies[j.co]; inbox('board', `Your package at ${c.name}`, `The compensation committee sends terms for the ${LADDER[+j.k.slice(5)][0].toLowerCase()}: salary, a bonus tied to the share price, and shares that vest over four years. You can sign, or you can negotiate.`, { act: 'pkg', choices: [{ k: 'sign', label: 'Sign the standard terms' }, { k: 'hard', label: 'Negotiate hard for more', check: ['pack', 15] }, { k: 'equity', label: 'Trade salary for shares' }, { k: 'para', label: 'Ask for a golden parachute', check: ['cha', 13] }] });
  }
  if (M.pkg) {
    const P0 = M.pkg, c = S.companies[P0.co], still = j && j.id === P0.job;
    if (still && c && c.closed === null && (S.week - P0.since) % 13 === 12 && P0.vested < 16) { const n = Math.round(P0.grant / 16); M.port = M.port || {}; M.port[c.id] = (M.port[c.id] || 0) + n; P0.vested++; diary(`Money: ${n.toLocaleString()} ${c.name} shares vest (${P0.vested} of 16).`); }
    if (still && c && (S.week - P0.since) % 52 === 51) { const perf = clamp(1 + chg(c, 52) / 100, 0, 2), b = Math.round(usd(P0.salary) * P0.bonus * perf * .5); if (b > 0) { M.cash += b; diary(`Money: your annual bonus at ${c.name}, ${fmtCash(b)} (the shares ${chg(c, 52) >= 0 ? 'rose' : 'fell'} ${Math.abs(chg(c, 52)).toFixed(0)}%).`); } }
    if (!still && !P0.over) { P0.over = S.week; if (P0.para && !(j && j.co === P0.co)) { const p = usd(P0.para); M.cash += p; diary(`Money: the golden parachute opens: ${fmtCash(p)}.`); } }
  }
}
// ---- the Boardroom app ----
function boardroomApp() {
  const M = S.me, tab = UI.brt || 'seats', B = myBoards();
  const tabs = [['seats', '🪑 Seats and stakes'], ['minutes', '📜 Minutes'], ['deals', '🤝 Deals'], ['buy', '🎯 Takeovers'], ['pkg', '💼 Your package']];
  let body = '';
  if (tab === 'seats') {
    const held = listedCos().filter(c => (M.port || {})[c.id]).concat(Object.keys(B).map(id => S.companies[+id]).filter(c => c && !(M.port || {})[c.id])).filter((c, i, L) => L.indexOf(c) === i);
    body = held.length ? `<div class="tw"><table class="grid small"><thead><tr><th>Company</th><th>Your stake</th><th>Value</th><th>Role</th><th></th></tr></thead><tbody>${held.map(c => { const s = stakeOf(c), b = B[c.id]; return `<tr><td>${cl(c.id)}</td><td>${bpct(s)}</td><td>${fmtCash(Math.round(((M.port || {})[c.id] || 0) * mktPrice(c)))}</td><td>${controls(c) ? '<b>Controlling shareholder</b>' : b ? (b.chair ? 'Chair' : 'Director') : s >= .05 ? 'Eligible for a seat' : 'Shareholder'}</td><td>${b && !b.chair && (controls(c) || s >= .15 || ME().standing >= 80) ? `<button class="btn-s ghost" data-board="chair:${c.id}">Take the chair</button>` : ''}${b && !myCtrl()[c.id] ? ` <button class="linkish" data-board="resign:${c.id}">Resign</button>` : ''}${myCtrl()[c.id] ? ` <label class="small">Dividend <select data-bdiv="${c.id}">${[0, .1, .2, .35].map(v => `<option value="${v}"${((M.divPol || {})[c.id] || 0) === v ? ' selected' : ''}>${Math.round(v * 100)}% of cash a year</option>`).join('')}</select></label>` : ''}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted">You don\'t own a piece of any listed company yet. Buy shares in the Ticker; 5% gets you a seat at the table, 51% gets you the table.</p>';
    body += `<p class="muted small">Boards also invite people who matter: standing 60 or more and a senior job, real fame, or standing 75. Directors earn ${fmtCash(usd(BOARD_FEE[1]))} a year at a major studio and vote on what it does every quarter.</p>`;
    const mine = Object.keys(B).map(id => S.companies[+id]).filter(Boolean);
    for (const c of mine.slice(0, 3)) body += `<h4>The board of ${esc(c.name)}</h4><ul class="plain small">${boardOf(c).map((d, i) => i === 8 ? `<li><b>${esc(ME().name)}</b> <span class="muted">· you${B[c.id].chair ? ', chair' : ''}</span></li>` : `<li>${esc(d.name)} <span class="muted">· ${esc(i === 0 && B[c.id].chair ? 'vice-chair' : d.bio)}</span></li>`).join('')}</ul>`;
  } else if (tab === 'minutes') {
    const L = (M.boardLog || []).slice().reverse();
    body = L.length ? `<table class="grid small"><thead><tr><th>When</th><th>Company</th><th>Motion</th><th>You</th><th>Result</th></tr></thead><tbody>${L.map(x => `<tr><td>${fmtDate(x.w, true)}</td><td>${cl(x.co)}</td><td>${esc(x.t)}</td><td>${x.mine}</td><td class="${x.passed ? 'good' : 'bad'}">${x.passed ? 'Carried' : 'Defeated'} ${x.yes}–${9 - x.yes}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No meetings yet.</p>';
  } else if (tab === 'deals') {
    const L = (M.deals || []).slice().reverse();
    body = L.length ? L.map(D => { const st = DEAL_STAGES[D.kind]; const name = D.kind === 'tender' ? `Tender offer for ${S.companies[D.co].name}` : `${S.companies[D.a].name} for ${S.companies[D.b].name}`; return `<div class="deal"><b>${esc(name)}</b> <span class="muted small">since ${fmtDate(D.w, true)} · ${Math.round(D.prem * 100)}% premium${D.price ? ' · ' + fmtM(D.price) : D.cost ? ' · ' + fmtCash(D.cost) : ''}</span><p class="small">${D.done ? `<b>${esc(D.done === 'won' || D.done === 'completed' ? 'Done: ' + D.done : 'Over: ' + D.done)}</b>` : st.map((s, i) => `<span class="${i < D.stage ? 'good' : i === D.stage ? '' : 'muted'}">${i < D.stage ? '✓' : i === D.stage ? '▶' : '·'} ${esc(s)}</span>`).join(' &nbsp; ')}</p></div>`; }).join('') : '<p class="muted">No deals yet.</p>';
  } else if (tab === 'buy') {
    const q = (UI.brq || '').toLowerCase(), L = listedCos().filter(c => !q || c.name.toLowerCase().includes(q)).sort((a, b) => mcap(b) - mcap(a)).slice(0, 40), mineCos = S.companies.filter(c => c.closed === null && controls(c));
    body = `<p class="small">A tender offer buys enough shares at a premium to take you to 51%. A friendly board helps; a hostile one adopts a poison pill. You pay only if shareholders tender. ${mineCos.length ? 'With control, your companies can bid for others.' : ''}</p><p><input id="brq" type="search" placeholder="Find a company…" value="${esc(UI.brq || '')}"></p>
     <div class="tw"><table class="grid small"><thead><tr><th>Company</th><th>Market cap</th><th>Your stake</th><th>Take control</th>${mineCos.length ? '<th>Merge into</th>' : ''}</tr></thead><tbody>${L.map(c => `<tr><td>${cl(c.id)} <span class="muted">t${c.tier} · ${esc(hubName(c.hub))}</span></td><td>${fmtM(mcap(c))}</td><td>${bpct(stakeOf(c))}</td><td>${controls(c) ? '<b>Yours</b>' : PREMS.map(([p]) => { const cost = tenderCost(c, p); return `<button class="btn-s ghost" data-board="tender:${c.id}:${p}" ${M.cash < cost ? 'disabled' : ''} title="+${Math.round(p * 100)}%">${fmtCash(cost)}</button>`; }).join(' ')}</td>${mineCos.length ? `<td>${controls(c) ? '' : mineCos.map(A => `<button class="btn-s ghost" data-board="merge:${A.id}:${c.id}:0.35" ${A.cash < mcap(c) * 1.35 * .4 ? 'disabled' : ''} title="${esc(A.name)} bids 35% over the market, ${fmtM(mcap(c) * 1.35)}">${esc(A.name.split(' ')[0])}</button>`).join(' ')}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;
  } else {
    const P0 = M.pkg;
    body = P0 ? `<p>At ${cl(P0.co)} since ${fmtDate(P0.since, true)}${P0.over ? ` (ended ${fmtDate(P0.over, true)})` : ''}.</p><ul class="plain"><li>Salary <b>${fmtCash(usd(P0.salary))}</b> a year</li><li>Bonus up to <b>${Math.round(P0.bonus * 100)}%</b> of salary, scaled by how the shares do</li><li><b>${P0.grant.toLocaleString()}</b> shares, ${P0.vested} of 16 quarterly tranches vested</li><li>Golden parachute: <b>${P0.para ? fmtCash(usd(P0.para)) : 'none'}</b></li></ul>` : '<p class="muted">No executive package yet. Reach president or chief executive on a company\'s ladder, or be asked to run one, and the board will send terms to negotiate.</p>';
  }
  return `<div class="boardroom"><p class="bf-row">${tabs.map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-brt="${k}">${l}</button>`).join('')}</p>${body}</div>`;
}
function boardroomClick(t) {
  const d = t.dataset;
  if (d.brt) { UI.brt = d.brt; render(true); return true; }
  if (d.board) { const [k, x, y, z] = d.board.split(':'); const a = k === 'tender' ? { t: 'board', k, co: +x, prem: +y } : k === 'merge' ? { t: 'board', k, a: +x, b: +y, prem: +z } : { t: 'board', k, co: +x }; doAct(a); render(true); return true; }
  return false;
}
function boardChange(e) { const v = e.target.dataset && e.target.dataset.bdiv; if (v === undefined) return false; doAct({ t: 'board', k: 'dividend', co: +v, v: +e.target.value }); render(true); return true; }
OS_EXTRA.boardroom = ['🏛️', 'Boardroom', 'Board seats, takeovers, mergers and your package'];
OS_VIEWS.boardroom = () => boardroomApp();
for (const g of OS_GROUPS) if (g[0] === 'Money') g[1].push('boardroom');
// ---- goals for the long game ----
amb('x_board1', 'power', 'Join a company\'s board', () => [Object.keys(myBoards()).length, 1], 5);
amb('x_board3', 'power', 'Sit on three boards at once', () => [Object.keys(myBoards()).length, 3], 8);
amb('x_chair', 'power', 'Chair a board', () => [Object.values(myBoards()).some(b => b.chair) ? 1 : 0, 1], 8);
amb('x_ctrl', 'power', 'Take control of a listed company', () => [Object.keys(myCtrl()).length, 1], 10);
amb('x_ctrl3', 'power', 'Control three companies', () => [Object.keys(myCtrl()).length, 3], 13);
amb('x_merge', 'power', 'Complete a merger', () => [(S.me.deals || []).filter(d => d.done === 'completed').length, 1], 11);
amb('x_pkg', 'power', 'Negotiate an executive package', () => [S.me.pkg ? 1 : 0, 1], 6);
