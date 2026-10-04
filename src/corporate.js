// ---------------- Inside the companies: the ladder, recruiters, poaching and the dark arts ----------------
// Every company has a chain of command, from the assistant rolling calls to the chief executive, and real people in
// the town hold those chairs. You can join a company's ladder and climb it: promotions come with time, results and a
// boss who likes you. Headhunters call when you're good, rivals poach executives from each other, and near the top
// there are propositions a careful person turns down. Pay is a yearly salary, scaled by the size of the company.
// [title, base salary (2027 USD, major studio), duties, job tier]
const LADDER = [
  ['Executive assistant', 55000, 'Answer and roll calls, run the diary, read scripts over the weekend, learn who matters.', 1],
  ['Coordinator', 68000, 'Track every project, schedule meetings, write coverage and first notes.', 1],
  ['Creative executive', 95000, 'Find material, build relationships with writers and agents, give notes, champion projects in meetings.', 2],
  ['Director of development', 140000, 'Run a slate of projects in development, hire writers, steer drafts toward a greenlight.', 3],
  ['Vice president, production', 230000, 'Shepherd films through production, sit in greenlight meetings, solve problems on set.', 4],
  ['Senior vice president', 380000, 'Own a slate or a label, manage executives, negotiate the big talent deals.', 4],
  ['President of production', 1200000, 'Decide what gets made, hire the directors, answer to the chief executive for every hit and flop.', 5],
  ['Chief executive', 4000000, 'Run the company: money, strategy, the board, the share price.', 5]
];
const TIER_PAY = [0, 1, .6, .35];
const SEATS = [4, 3, 3, 3, 2, 2, 1, 1];
function rungPay(c, r) { return Math.round(LADDER[r][1] * TIER_PAY[c.tier] * (r === 7 && c.tier === 1 ? 5 : 1) / 1000) * 1000; }
for (let r = 0; r < LADDER.length; r++) { const t = { k: 'corp_' + r, t: LADDER[r][0], tier: LADDER[r][3], subs: r < 3 ? ['tas', 'eth'] : r < 6 ? ['tas', 'pack'] : ['pack', 'fin'], days: 5, rate: Math.round(LADDER[r][1] / 240), weeks: 104, biz: 'Company executive', fam: r >= 2 ? 'exec' : 'office', d: LADDER[r][2], corp: r }; ODD_JOBS.push(t); ODD_BY[t.k] = t; }
// ---- who holds the chairs: real people from the town, the same answer all year ----
// Worked out fresh from the town's people every time it's asked, so the simulation and the screen always agree.
function hubStaff(hub) {
  const cos = S.companies.filter(c => c.hub === hub && c.closed === null && c.owner === undefined).sort((a, b) => a.tier - b.tier || a.id - b.id);
  const pool = (S.pool[hub] ? [].concat(S.pool[hub].producer || [], (S.pool[hub].writer || []).filter(id => !P(id).catId && P(id).standing < 30)) : []).filter(id => P(id) && !P(id).dead && !P(id).player && (P(id).role === 'producer' || !P(id).catId));
  const order = pool.map(id => [id, P(id).standing + hashRand(id * 31 + S.year)() * 25]).sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(x => x[0]);
  const used = new Set(), M2 = {};
  for (const c of cos) {
    const seats = SEATS.map((n, i) => Math.max(i >= 6 ? 1 : 0, Math.round(n * [0, 1, .6, .34][c.tier]))), L = [];
    for (let rr = 7; rr >= 0; rr--) for (let s = 0; s < seats[rr]; s++) {
      const id = order.find(x => !used.has(x) && (rr >= 5 ? P(x).standing >= 45 : rr >= 3 ? P(x).standing >= 25 : P(x).standing < 30 && S.year - P(x).born < 40)) ?? null;
      if (id !== null) used.add(id);
      L.push({ r: rr, id });
    }
    M2[c.id] = L;
  }
  for (const x of S.poach || []) { for (const c in M2) M2[c] = M2[c].map(s => s.id === x.person && +c !== x.to ? { r: s.r, id: null } : s); if (M2[x.to]) { const seat = M2[x.to].find(s => s.r === x.r); if (seat) seat.id = x.person; } }
  return M2;
}
function staffOf(c) { return hubStaff(c.hub)[c.id] || []; }
function bossFor(c, r) { const L = staffOf(c), up = L.filter(s => s.r > r && s.id !== null).sort((a, b) => a.r - b.r)[0]; return up ? up.id : null; }
function corpJob() { return S.me.jobs.find(j => /^corp_/.test(j.k)); }
function ladderHTML(c) {
  if (c.closed !== null || c.owner !== undefined) return '';
  const L = staffOf(c), j = corpJob(), mineHere = j && j.co === c.id, heads = typeof headsOf === 'function' ? headsOf(c) : [];
  const rows = LADDER.map((x, r) => ({ r, x, who: L.filter(s => s.r === r && s.id !== null).map(s => s.id) })).reverse();
  return `<section class="panel ladder"><h3>The ladder</h3><p class="muted small">Who sits where, what they do and what it pays here. ${j && !mineHere ? `You're a ${esc(j.t.toLowerCase())} at ${esc(S.companies[j.co].name)}: the same chair here pays ${fmtCash(usd(rungPay(c, +j.k.slice(5))))}.` : ''}</p>
   <div class="tw"><table class="grid small"><thead><tr><th>Rung</th><th>Who</th><th class="n">Salary</th><th>What the job is</th></tr></thead><tbody>${rows.map(({ r, x, who }) => `<tr${mineHere && j.k === 'corp_' + r ? ' class="me"' : ''}><td data-v="${r}"><b>${esc(x[0])}</b>${mineHere && j.k === 'corp_' + r ? ' <span class="chip good">You</span>' : ''}</td><td>${r === 7 && heads.length ? headLink(heads[0]) : who.length ? who.map(pl).join(', ') : '<span class="muted">vacant</span>'}</td><td class="n" data-v="${rungPay(c, r)}">${fmtCash(usd(rungPay(c, r)))}</td><td class="small">${esc(x[2])}</td></tr>`).join('')}</tbody></table></div>
   <p class="muted small">Same chair, other companies: a major studio pays ${fmtCash(usd(Math.round(LADDER[3][1] * TIER_PAY[1])))} for a director of development, a mid-sized company ${fmtCash(usd(Math.round(LADDER[3][1] * TIER_PAY[2])))}, a small one ${fmtCash(usd(Math.round(LADDER[3][1] * TIER_PAY[3])))}. Jobs on the ladder appear on your board as companies hire.</p></section>`;
}
// ---- hiring onto the ladder ----
function corpPosts() {
  const M = S.me, L = tierLevel(), out = [];
  if (prnd() > .45) return out;
  const cos = S.companies.filter(c => c.hub === M.hub && c.closed === null && c.owner === undefined);
  if (!cos.length) return out;
  // where you come in depends on company experience, not on your film career: outsiders start near the bottom
  // (a seasoned film person might come in as a creative executive), insiders move sideways or one rung up
  const prev = typeof corpRung === 'function' ? corpRung() : -1, base = prev >= 0 ? prev : L >= 5 ? 2 : L >= 3 ? 1 : 0;
  // a step up only after real time served at your current rung; until then the offers are sideways moves
  const cj = corpJob(), served = cj ? S.week - (cj.rungW ?? cj.started ?? S.week) : 0, cap = prev < 0 ? 2 : cj && served >= 26 + prev * 6 ? Math.min(5, prev + 1) : prev;
  const c = ppick(cos), r = clamp(base + (prnd() < .3 ? 1 : 0), 0, cap), t = ODD_BY['corp_' + r];
  if (M.jobs.some(j => j.k === t.k)) return out;
  const p = makePost(t, null); p.co = c.id; p.rate = usd(Math.round(rungPay(c, r) / 240)); p.head = bossFor(c, r); p.mco = c.name;
  out.push(p);
  return out;
}
// ---- the weekly life of a company person ----
function corpWeek() {
  const M = S.me, me = ME(), j = corpJob();
  if (j) {
    const r = +j.k.slice(5), c = S.companies[j.co];
    if (j.co === undefined || !c || c.closed !== null) return;
    j.rungW = j.rungW ?? j.started;
    const due = Math.max(26 + r * 6, 30 + r * 10 - Math.max(0, (j.score || 0)) * 2), boss = j.head;
    if (r < 7 && S.week - j.rungW >= due && !pending().some(x => x.kind === 'corp') && (boss === null || boss === undefined || opinion(boss) >= 10) && (j.score || 0) >= -1 && hashRand(S.week * 7 + j.id)() < .25)
      inbox('corp', `A promotion at ${c.name}`, `${boss !== null && boss !== undefined ? P(boss).name + ' calls you in.' : 'The boss calls you in.'} "We'd like you to be our ${LADDER[r + 1][0].toLowerCase()}." ${fmtCash(usd(rungPay(c, r + 1)))} a year. ${LADDER[r + 1][2]}`, { act: 'promote', job: j.id, choices: [{ k: 'yes', label: 'Accept the promotion' }, { k: 'no', label: 'Stay where you are for now' }] });
    // headhunters: good people get calls
    if (r >= 1 && r < 6 && S.week - j.rungW >= 26 && S.week % 9 === (j.id % 9) && !pending().some(x => x.kind === 'corp') && me.standing + r * 6 >= 22 && hashRand(S.week * 11 + j.id)() < .5) {
      const rivals = S.companies.filter(x => x.closed === null && x.owner === undefined && x.id !== c.id && x.tier <= c.tier + (r >= 4 ? 0 : 1) && (x.hub === M.hub || r >= 4));
      if (rivals.length) { const x = rivals[Math.floor(hashRand(S.week + j.id)() * rivals.length)], nr = Math.min(7, r + 1), pay = Math.round(rungPay(x, nr) * 1.15);
        inbox('corp', `A headhunter calls`, `A recruiter from ${pickLine(['Vantage Search', 'Northbridge Partners', 'Halcyon Executive', 'Crowne & Lisle'], S.week)} has a client: ${x.name}${x.hub !== M.hub ? ' in ' + hubName(x.hub) : ''} wants a ${LADDER[nr][0].toLowerCase()}. ${fmtCash(usd(pay))} a year, more than you make now. They need an answer this week.`, { act: 'poach', job: j.id, to: x.id, r: nr, pay, choices: [{ k: 'take', label: `Take it: move to ${x.name}` }, { k: 'counter', label: 'Tell your boss and ask them to match', check: ['cha', 13] }, { k: 'no', label: 'Thank them and say no' }] }); }
    }
    // the dark arts: high rungs get offers a careful person refuses
    if (r >= 4 && S.week % 13 === (j.id % 13) && !pending().some(x => x.kind === 'corp')) { const sc = SCHEMES[Math.floor(hashRand(S.week * 3 + j.id)() * SCHEMES.length)]; inbox('corp', sc.title, sc.text.replace('{rival}', rivalOf(c).name), { act: 'scheme', s: sc.k, job: j.id, rival: rivalOf(c).id, choices: [{ k: 'do', label: sc.do, check: sc.check }, { k: 'no', label: 'Turn it down' }, { k: 'report', label: 'Report it to legal' }] }); }
  }
  // secrets have a way of coming out
  for (const x of (M.secrets || []).filter(x => !x.out)) if (hashRand(S.week * 17 + x.w)() < x.risk / 60) { x.out = S.week; me.standing = clamp(me.standing - 8, 0, 100); M.stress = clamp(M.stress + 20, 0, 100); news('People', `${me.name} at the centre of a scandal: ${x.what}.`, { person: me.id }); milestone(`Scandal: ${x.what}`, 'work'); const jj = corpJob(); if (jj && x.risk >= 6) { finishJob(jj, null, true); inbox('note', 'Let go', 'Legal walks you out with a cardboard box. The story is everywhere by lunchtime.'); } else inbox('note', 'It comes out', `The trades have it: ${x.what}. People stop returning calls for a while.`); }
  // the industry poaches its own: a few times a year, a rival lures an executive away
  if (S.week % 17 === 5) { const big = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier <= 2), rr = hashRand(S.week * 23); if (big.length >= 2) { const to = big[Math.floor(rr() * big.length)], from = big.filter(c => c.hub === to.hub && c.id !== to.id)[Math.floor(rr() * 3)]; if (from) { const seat = staffOf(from).filter(s => s.r >= 4 && s.r <= 6 && s.id !== null)[0]; if (seat) { (S.poach = S.poach || []).push({ y: S.year, w: S.week, person: seat.id, from: from.id, to: to.id, r: seat.r }); news('Company', `${to.name} poaches ${P(seat.id).name}, ${LADDER[seat.r][0].toLowerCase()} at ${from.name}. ${pickLine(['The rival is said to be furious.', 'A raid that signals new ambitions.', 'Three of their projects are expected to follow.'], seat.id)}`, { company: to.id, person: seat.id }); to.taste = Object.assign({}, to.taste, from.taste); } } } }
}
function rivalOf(c) { return S.companies.filter(x => x.closed === null && x.id !== c.id && x.hub === c.hub && x.owner === undefined).sort((a, b) => Math.abs(a.tier - c.tier) - Math.abs(b.tier - c.tier))[0] || c; }
const SCHEMES = [
  { k: 'leak', title: 'A test-screening leak', text: 'Someone in marketing has {rival}\'s disastrous test-screening scores. A friendly trades reporter would love them. Your own film opens the same weekend.', do: 'Leak the scores, anonymously', check: ['com', 14], win: 'The story runs. Their opening collapses; yours doesn\'t. Nobody knows it was you. Yet.', risk: 5, stand: 2, cash: 0, hurt: 4, what: 'leaking a rival\'s test scores' },
  { k: 'raid', title: 'Raid their director', text: '{rival}\'s star director is unhappy. Their agent says a fat overall deal would bring them across, and a slate of projects with them.', do: 'Make the offer, over budget', check: ['pack', 15], win: 'They sign. The trades call it the coup of the year. Your budget will hurt for a while.', risk: 1, stand: 4, cash: 0, hurt: 6, what: 'an aggressive talent raid' },
  { k: 'kickback', title: 'A vendor\'s envelope', text: 'An effects house wants your company\'s next three films. Their founder slides an envelope across the lunch table. "For your trouble."', do: 'Take the envelope', check: ['com', 12], win: 'Nobody notices a thing. The envelope pays your rent for a year.', risk: 9, stand: 0, cash: 40000, hurt: 0, what: 'taking a kickback from a vendor' },
  { k: 'bury', title: 'Bury the review', text: 'A critic\'s savage review of your film runs on Friday. Their editor owes you a favour.', do: 'Call in the favour', check: ['cha', 14], win: 'The review runs on page twelve, on Monday, cut in half. Your opening is fine.', risk: 4, stand: 1, cash: 0, hurt: 0, what: 'leaning on a newspaper to bury a review' },
  { k: 'takeover', title: 'The quiet takeover', text: '{rival} is wobbling. A banker you know says your company could buy a big stake before anyone notices, if you move the money this week.', do: 'Move the money', check: ['fin', 15], win: 'You own a fifth of them by Friday. The board knows your name now.', risk: 3, stand: 5, cash: 0, hurt: 8, what: 'a stealth stake in a rival studio' },
  { k: 'credit', title: 'Whose idea was it?', text: 'A junior executive\'s pitch is the best thing on the slate. Your boss assumes it was yours.', do: 'Let them assume', check: ['com', 11], win: 'The credit is yours. The junior executive doesn\'t say anything. They remember.', risk: 6, stand: 3, cash: 0, hurt: 0, what: 'taking credit for a junior\'s project' }
];
function corpPick(it, k) {
  if (it.kind !== 'corp') return false;
  const M = S.me, me = ME(), j = M.jobs.find(x => x.id === it.job); it.done = true;
  if (!j && it.act !== 'scheme') { it.result = { t: 'Too late: you\'ve moved on.' }; return true; }
  if (it.act === 'promote') {
    if (k !== 'yes') { it.result = { t: 'You stay put. They nod, and remember that you said no.' }; if (j.head != null) addTie(me, P(j.head), -1); return true; }
    const c = S.companies[j.co], r = +j.k.slice(5) + 1, t = ODD_BY['corp_' + r];
    Object.assign(j, { k: t.k, t: t.t, tier: t.tier, rate: usd(Math.round(rungPay(c, r) / 240)), weeks: j.done + 104, rungW: S.week, head: bossFor(c, r) });
    me.standing = clamp(me.standing + 1 + r * .4, 0, 100);
    milestone(`Promoted to ${t.t.toLowerCase()} at ${c.name}`, 'work');
    it.result = { t: `${t.t}. New business cards by Monday. ${LADDER[r][2]}` }; return true;
  }
  if (it.act === 'poach') {
    const x = S.companies[it.to];
    if (k === 'take') { finishJob(j, null, true); const t = ODD_BY['corp_' + it.r], p = makePost(t, null); Object.assign(p, { co: x.id, rate: usd(Math.round(it.pay / 240)), head: bossFor(x, it.r), mco: x.name, away: x.hub !== M.hub ? x.hub : undefined }); takeJob(p); milestone(`Hired away by ${x.name} as ${t.t.toLowerCase()}`, 'work'); it.result = { t: `You hand in your notice. The old boss is cold. ${x.name} sends flowers to your new office.` }; return true; }
    if (k === 'counter') { const ok = roll('cha', 13); if (ok) { j.rate = Math.round(j.rate * 1.15); it.result = { ok, roll: M.lastRoll, t: 'They match most of it. A raise, and a boss who now knows you have options.' }; } else { if (j.head != null) addTie(me, P(j.head), -4); it.result = { ok, roll: M.lastRoll, t: '"Then go," says your boss. You don\'t. It\'s awkward for weeks.' }; } return true; }
    it.result = { t: 'You say no. The recruiter says they\'ll keep you on file.' }; return true;
  }
  if (it.act === 'scheme') {
    const sc = SCHEMES.find(x => x.k === it.s), rival = S.companies[it.rival];
    if (k === 'no') { it.result = { t: 'You turn it down. You sleep fine.' }; return true; }
    if (k === 'report') { me.standing = clamp(me.standing + .5, 0, 100); (M.flags = M.flags || {}).whistle = S.week; it.result = { t: 'Legal thanks you. Someone, somewhere, now has it in for you.' }; return true; }
    const ok = roll(sc.check[0], sc.check[1]);
    if (ok) { me.standing = clamp(me.standing + sc.stand, 0, 100); if (sc.cash) M.cash += usd(sc.cash); if (rival && sc.hurt) rival.cash -= sc.hurt; (M.secrets = M.secrets || []).push({ w: S.week, risk: sc.risk, what: sc.what }); it.result = { ok, roll: M.lastRoll, t: sc.win }; }
    else { me.standing = clamp(me.standing - 4, 0, 100); M.stress = clamp(M.stress + 12, 0, 100); news('People', `${me.name} linked to ${sc.what}.`, { person: me.id }); it.result = { ok, roll: M.lastRoll, t: 'It goes wrong, loudly. The trades have your name by the afternoon.' }; if (sc.risk >= 6 && j) { finishJob(j, null, true); it.result.t += ' You\'re let go.'; } }
    return true;
  }
  return false;
}
