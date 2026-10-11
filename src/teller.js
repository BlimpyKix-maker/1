// ---------------- The storyteller ----------------
// After RimWorld: something decides when life gets complicated, and you choose its personality.
//  - Steady Agent: money trouble and money luck in equal measure (audits, lawsuits, windfalls), and a long quiet
//    between them.
//  - Tabloid Chaos: fame's weather (photographers, stalkers, viral clips, lawsuits). Often, and mostly bad.
//  - Prestige Drama: reputation's weather (critical backlash, retrospectives, patrons, health scares).
// How often, and how big, scales with exposure: threat = log of net worth plus fame. A lawsuit against someone with
// nothing asks for little; against someone rich and famous it asks for a lot. After each incident the storyteller
// rests (shortest for Tabloid Chaos). Uses your dice (prnd), so replays match.
const TELLERS = {
  steady: { n: 'Steady Agent', rate: .7, rest: 10, bad: .5, d: 'Money trouble and money luck, evenly, with long quiet spells.' },
  tabloid: { n: 'Tabloid Chaos', rate: 1.3, rest: 5, bad: .65, d: 'Fame\'s weather: photographers, stalkers, viral clips, lawsuits. Often, and mostly bad.' },
  prestige: { n: 'Prestige Drama', rate: 1, rest: 8, bad: .55, d: 'Reputation\'s weather: backlash, retrospectives, patrons, health scares.' }
};
function netWorth() { const M = S.me; const port = Object.entries(M.port || {}).reduce((t, [id, n]) => t + (typeof mktPrice === 'function' && S.companies[+id] ? n * mktPrice(S.companies[+id]) : 0), 0); const c = typeof myCo === 'function' && myCo() ? Math.max(0, myCo().cash) * 1e6 * .5 : 0; return M.cash + port + c; }
function threat() { return Math.round(clamp(Math.log10(1 + Math.max(0, netWorth()) / usd(10000)) * 18 + (ME().fame || 0) * .4, 0, 100)); }
function tellerOf() { return TELLERS[S.me.teller] ? S.me.teller : 'steady'; }
// incidents: who tells them, which side, what they need, and the choices
const INCIDENTS = [
  { k: 'lawsuit', side: 'bad', w: { steady: 2, tabloid: 2, prestige: 1 }, need: () => netWorth() > usd(30000),
    make: tp => { const claim = Math.round(netWorth() * (.02 + tp / 2500)); return { title: 'You\'re being sued', text: `A former collaborator says you owe them for an idea, a credit or a handshake. They want ${fmtCash(claim)}.`, data: { claim }, choices: [{ k: 'settle', label: `Settle quietly (${fmtCash(Math.round(claim * .6))})` }, { k: 'fight', label: 'Fight it in court', check: ['fin', 13] }] }; },
    res: (k, d, ok) => { const M = S.me; if (k === 'settle') { M.cash -= Math.round(d.claim * .6); return 'You settle. It never makes the papers.'; } if (ok) { M.cash -= Math.round(d.claim * .1); return `The judge throws it out. Your lawyer's bill is still ${fmtCash(Math.round(d.claim * .1))}.`; } M.cash -= Math.round(d.claim * 1.3); ME().standing = clamp(ME().standing - 1, 0, 100); return 'You lose, with costs, and the trades report every detail.'; } },
  { k: 'audit', side: 'bad', w: { steady: 3, tabloid: 1, prestige: 1 }, need: () => S.me.cash > usd(20000),
    make: tp => { const owe = Math.round(S.me.cash * (.03 + tp / 3000)); return { title: 'A letter from the tax office', text: `An audit of your last three years. Their number: ${fmtCash(owe)} in back taxes and interest.`, data: { owe }, choices: [{ k: 'pay', label: `Pay it (${fmtCash(owe)})` }, { k: 'contest', label: 'Contest it with an accountant', check: ['fin', 13] }] }; },
    res: (k, d, ok) => { const M = S.me; if (k === 'pay') { M.cash -= d.owe; return 'Paid. The letter goes in a drawer you never open.'; } if (ok) { M.cash -= Math.round(d.owe * .15); return 'Your accountant finds the receipts. You owe the accountant instead.'; } M.cash -= Math.round(d.owe * 1.5); return 'They were right, and now there are penalties.'; } },
  { k: 'paps', side: 'bad', w: { steady: 0, tabloid: 4, prestige: 1 }, need: () => (ME().fame || 0) >= 20,
    make: () => ({ title: 'Long lens', text: 'Photographs of you on a bad night are on the front of a tabloid, with a headline that\'s nearly true.', choices: [{ k: 'statement', label: 'Put out a statement', check: ['cha', 12] }, { k: 'ignore', label: 'Say nothing' }] }),
    res: (k, d, ok) => { const me = ME(); if (k === 'ignore') { me.standing = clamp(me.standing - 1, 0, 100); me.fame = clamp((me.fame || 0) + 3, 0, 100); return 'It runs for a week and then it\'s somebody else\'s turn. More people know your name.'; } if (ok) { me.fame = clamp((me.fame || 0) + 2, 0, 100); return 'Funny, short and human. It becomes the story, and it\'s a good one.'; } me.standing = clamp(me.standing - 2.5, 0, 100); return 'The statement makes it worse.'; } },
  { k: 'stalker', side: 'bad', w: { steady: 0, tabloid: 2, prestige: 1 }, need: () => (ME().fame || 0) >= 40,
    make: () => { const cost = usd(3000 + (ME().fame || 0) * 120); return { title: 'Someone is following you', text: 'The same face outside the gym, the restaurant, your building. Letters that know too much.', data: { cost }, choices: [{ k: 'security', label: `Hire security (${fmtCash(cost)})` }, { k: 'endure', label: 'Change your routines and hope' }] }; },
    res: (k, d) => { const M = S.me; if (k === 'security') { M.cash -= d.cost; M.stress = clamp(M.stress + 3, 0, 100); return 'A large quiet man walks you everywhere. The letters stop.'; } M.stress = clamp(M.stress + 12, 0, 100); return 'You stop going to the places you liked. It doesn\'t feel like your life for a while.'; } },
  { k: 'backlash', side: 'bad', w: { steady: 0, tabloid: 1, prestige: 3 }, need: () => ME().credits.length >= 2,
    make: () => ({ title: 'The critics turn', text: 'A long essay in the serious press argues your work is overrated, and everyone shares it.', choices: [{ k: 'reply', label: 'Write a reply', check: ['tas', 13] }, { k: 'take', label: 'Take it on the chin' }] }),
    res: (k, d, ok) => { const me = ME(), M = S.me; if (k === 'take') { M.stress = clamp(M.stress + 5, 0, 100); me.standing = clamp(me.standing - .5, 0, 100); return 'You say nothing. It stings for a month.'; } if (ok) { me.standing = clamp(me.standing + 1.5, 0, 100); return 'Your reply is better than their essay. People notice.'; } me.standing = clamp(me.standing - 2, 0, 100); return 'You sound wounded. They write a second essay.'; } },
  { k: 'health', side: 'bad', w: { steady: 1, tabloid: 1, prestige: 2 }, need: () => S.me.stress >= 40 || ageOf(ME()) >= 45,
    make: () => ({ title: 'A health scare', text: 'Chest pains on a Tuesday. It turns out to be nothing serious, this time, and the doctor wants a word about how you live.', choices: [{ k: 'rest', label: 'Take two weeks off properly' }, { k: 'push', label: 'Push on', check: ['com', 12] }] }),
    res: (k, d, ok) => { const M = S.me; if (k === 'rest') { M.stress = clamp(M.stress - 15, 0, 100); M.energy = clamp(M.energy + 20, 0, 100); return 'Two weeks of sleep and walks. The world doesn\'t end.'; } if (ok) return 'You push on, and you\'re fine.'; M.energy = clamp(M.energy - 30, 0, 100); M.stress = clamp(M.stress + 10, 0, 100); return 'You push on, and it comes back worse.'; } },
  { k: 'windfall', side: 'good', w: { steady: 3, tabloid: 1, prestige: 1 }, need: () => true,
    make: tp => { const v = Math.max(usd(1500), Math.round(netWorth() * (.02 + tp / 4000))); return { title: 'A windfall', text: `Something you'd forgotten pays out: an old investment, a royalty cheque, a refund. ${fmtCash(v)}.`, data: { v }, choices: [{ k: 'bank', label: 'Bank it' }, { k: 'share', label: 'Take people out to celebrate (half of it)' }] }; },
    res: (k, d) => { const M = S.me; if (k === 'bank') { M.cash += d.v; return 'Banked.'; } M.cash += Math.round(d.v / 2); M.stress = clamp(M.stress - 6, 0, 100); return 'A long dinner for everyone who helped. Nobody forgets who paid.'; } },
  { k: 'viral', side: 'good', w: { steady: 0, tabloid: 3, prestige: 1 }, need: () => true,
    make: () => ({ title: 'You went viral', text: 'A clip of you, saying something you barely remember, has been watched eleven million times.', choices: [{ k: 'cash', label: 'Take the brand deal that follows' }, { k: 'ride', label: 'Ride the attention' }] }),
    res: (k) => { const M = S.me, me = ME(); me.fame = clamp((me.fame || 0) + 4, 0, 100); if (k === 'cash') { const v = usd(4000 + (me.fame || 0) * 200); M.cash += v; me.standing = clamp(me.standing - .5, 0, 100); return `${fmtCash(v)} for a sponsored post. Some people find it tacky.`; } me.standing = clamp(me.standing + .5, 0, 100); return 'You say yes to the interviews and no to the brands.'; } },
  { k: 'retro', side: 'good', w: { steady: 1, tabloid: 0, prestige: 3 }, need: () => ME().credits.length >= 4,
    make: () => ({ title: 'A retrospective', text: 'A cinema wants to show your work, with you there to talk about it.', choices: [{ k: 'go', label: 'Go and talk' }, { k: 'decline', label: 'Too soon for that' }] }),
    res: (k) => { const me = ME(), M = S.me; if (k === 'decline') return 'You thank them. Maybe in ten years.'; me.standing = clamp(me.standing + 2, 0, 100); me.fame = clamp((me.fame || 0) + 2, 0, 100); M.energy = clamp(M.energy - 10, 0, 100); const q = bestIn(M.hub, ROLES, q => q.standing + prnd() * 20); if (q) meet(q.id, 'At your retrospective', 6); return 'A full house, good questions, and a long drink afterwards with people who matter.'; } },
  { k: 'patron', side: 'good', w: { steady: 1, tabloid: 0, prestige: 2 }, need: () => !!(typeof myCo === 'function' && myCo()),
    make: tp => { const v = +(.2 + tp / 100).toFixed(2); return { title: 'A patron', text: `A wealthy admirer offers your company ${fmtM(v)} with almost no strings: they want to be invited to things.`, data: { v }, choices: [{ k: 'take', label: 'Take it' }, { k: 'no', label: 'Decline politely' }] }; },
    res: (k, d) => { if (k === 'take') { myCo().cash += d.v; return 'The money arrives. So do the invitations to their parties.'; } return 'You decline. They respect it, and say so to their friends.'; } }
];
function tellerWeek() {
  if (!S.me) return; const M = S.me, T = TELLERS[tellerOf()], tp = threat();
  if (S.week - (M.tellW || -99) < T.rest || pending().some(x => x.kind === 'teller')) return;
  if (prnd() > T.rate * (.012 + tp / 3500)) return;
  const side = prnd() < T.bad ? 'bad' : 'good', L = INCIDENTS.filter(e => e.side === side && (e.w[tellerOf()] || 0) > 0 && e.need() && (!(M.tellSeen || {})[e.k] || S.week - M.tellSeen[e.k] > 40));
  if (!L.length) return; let r = prnd() * L.reduce((t, e) => t + e.w[tellerOf()], 0), e = L[L.length - 1]; for (const x of L) { r -= x.w[tellerOf()]; if (r <= 0) { e = x; break; } }
  const m = e.make(tp); M.tellW = S.week; (M.tellSeen = M.tellSeen || {})[e.k] = S.week; (M.tellLog = M.tellLog || []).push({ w: S.week, k: e.k, side, tp }); if (M.tellLog.length > 30) M.tellLog.shift();
  inbox('teller', m.title, m.text, { inc: e.k, data: m.data || {}, choices: m.choices });
}
function tellerPick(it, k) {
  if (it.kind !== 'teller') return false; it.done = true; const e = INCIDENTS.find(x => x.k === it.inc), c = (it.choices || []).find(x => x.k === k);
  const ok = c && c.check ? roll(c.check[0], c.check[1]) : true; const t = e ? e.res(k, it.data || {}, ok) : '';
  it.result = { ok: c && c.check ? ok : null, roll: c && c.check ? S.me.lastRoll : null, t }; return true;
}
function tellerAct(a) { if (!TELLERS[a.v]) return false; S.me.teller = a.v; return true; }
function tellerPanel() {
  const M = S.me, k = tellerOf(), T = TELLERS[k], tp = threat(), p = T.rate * (.012 + tp / 3500);
  return `<section class="tk-p"><h4>STORYTELLER <span class="tk-sub">who decides when life gets complicated</span></h4><p>${Object.entries(TELLERS).map(([kk, x]) => `<button class="tk-chip${kk === k ? ' on' : ''}" data-teller="${kk}" title="${esc(x.d)}">${x.n}</button>`).join('')}</p>
   <div class="tk-kpis"><div class="tk-kpi"><span>THREAT</span><b class="tk-v">${tp}</b></div><div class="tk-kpi"><span>WEEKLY ODDS</span><b class="tk-v">${(p * 100).toFixed(1)}%</b></div><div class="tk-kpi"><span>RESTING</span><b class="tk-v">${Math.max(0, T.rest - (S.week - (M.tellW || -99)))}w</b></div></div>
   <p class="tk-foot">${esc(T.d)} Threat is net worth (log) plus fame: the more exposed you are, the more often and the bigger. ${Math.round(T.bad * 100)}% of incidents are trouble.</p>
   ${(M.tellLog || []).length ? `<ul class="plain small">${M.tellLog.slice(-4).reverse().map(x => `<li><span class="${x.side === 'bad' ? 'dn' : 'up'}">${x.side === 'bad' ? '▼' : '▲'}</span> ${esc((INCIDENTS.find(e => e.k === x.k) || {}).k || '')} <span class="tk-mut">${esc(fmtDate(x.w, true))} · threat ${x.tp}</span></li>`).join('')}</ul>` : ''}</section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + tellerPanel() + h.slice(i); }; }
function tellerClick(t) { const v = t.dataset.teller; if (!v) return false; doAct({ t: 'teller', v }); render(true); return true; }
