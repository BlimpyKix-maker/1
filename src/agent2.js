// ---------------- Agents who earn their ten per cent ----------------
// Ablation testing showed an agent was dead weight: their listings sat a level or two above you (long odds), they took
// a cut, and crew and writers never got approached at all (the offer needed a screen credit). Now:
//  - an agent books you: every so often a direct offer at your level lands without an application, more often with
//    a bigger agency and a hungrier style, less often when you're already working;
//  - crew, writers and anyone with a few paid jobs behind them get approached too, not only people with screen credits.
const AG_BOOK = { shark: .05, nurturer: .02, packager: .03, boutique: .025, quiet: 0 };
function agentBookOdds() {
  const M = S.me; if (!M || !M.agent) return 0;
  return clamp(.04 + .03 * M.agent.tier + (AG_BOOK[M.agent.style] || 0) - (M.jobs.some(craftJob) ? .05 : 0), .01, .25);
}
function agentBook() {
  const M = S.me; if (!M.agent || M.inbox.some(it => it.kind === 'offer' && !it.done) || S.week - (M.agent.bookW || -99) < 5) return;
  if (prnd() > agentBookOdds()) return;
  const L0 = tierLevel(), L = (M.board || []).filter(p => craftJob(p) && Math.abs((p.tier || 1) - L0) <= 1 && !blockedFrom(tmplOf(p)) && jobDays() + p.days <= 7 && !p.agentBooked);
  if (!L.length) return;
  L.sort((a, b) => (b.tier || 1) - (a.tier || 1) || b.rate - a.rate);
  const p = L[Math.floor(prnd() * Math.min(3, L.length))];
  p.agent = 1; p.agentBooked = 1; p.rate = Math.round(p.rate * (1.08 + .05 * M.agent.tier)); M.agent.bookW = S.week; M.agent.books = (M.agent.books || 0) + 1;
  const ag = M.agent.id !== undefined && P(M.agent.id) ? P(M.agent.id).name : M.agent.name;
  inbox('offer', `Booked: ${p.t}`, `${ag} calls. ${pickLine(['"Don\'t thank me, just turn up."', '"I put you up for it on Tuesday. It\'s yours if you want it."', '"They wanted someone else. I talked them out of it."', '"Three calls and a lunch. You start when they say."', '"It\'s not glamorous, but it pays, and it\'s the right people."'], S.week + p.id)} No interview: your agent's word is enough. ${offerText(p)} The agency takes ${Math.round(M.agent.cut * 100)}%.`, { post: p, person: M.agent.id, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] });
  M.stats.offers++;
}
{ const _aw = agentWeek; agentWeek = function () { _aw(); if (S.me && S.me.agent) agentBook(); }; }
// paid work counts, not only screen credits
{ const _ap = agentApproach; agentApproach = function () {
  _ap(); const M = S.me, me = ME();
  if (M.agent || pending().some(x => x.kind === 'agentoffer') || me.credits.length >= 1 || careerLevel() < 2 || me.standing < 12) return;
  if (prnd() > .02 + careerLevel() * .006) return;
  const L = agenciesIn(M.hub).filter(a => a.tier <= 1 + Math.floor(careerLevel() / 3) && agFits(a)); if (!L.length) return;
  const ag = ppick(L);
  inbox('agentoffer', `${ag.name} calls`, `Someone at ${ag.name} has heard about you from people you've worked with and wants to represent you. They book their clients directly, without the applications; ten per cent of everything.`, { ag: ag.i, choices: [{ k: 'yes', label: 'Sign with them' }, { k: 'no', label: 'Not yet' }] });
}; }
