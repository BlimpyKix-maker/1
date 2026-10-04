// ---------------- Press, next moves, ambitions ----------------
// The trades start writing about you when you give them a reason; you keep the clippings. A small advisor reads your
// situation and suggests what to do next. And a ladder of ambitions gives the early years some direction, with a
// little reward for each rung. None of it rolls dice: press picks its paper and words by hash.
const PRESS_HEAD = {
  prize: ['{n} takes the prize', 'And the winner is… {n}', 'A night to remember for {n}', '{n} walks off with the honours'],
  credit: ['New name to know: {n}', 'Fresh on the call sheet: {n}', '{n} lands a screen credit'],
  level: ['On the rise: {n}', 'Ones to watch: {n}', 'The quiet ascent of {n}', '{n} is suddenly everywhere'],
  film: ['{n}\'s latest finds an audience', 'A hit, and {n} was on it', 'The film nobody expected, and {n}'],
  agent: ['{n} signs with new representation', 'Agency snaps up {n}'],
  feud: ['Bad blood: {n} and a falling-out', 'Frosty on set: what happened with {n}?'],
  company: ['{n}\'s company is growing', 'Small outfit, big plans: {n}']
};
function pressAboutYou(m) {
  const M = S.me, me = ME(); if (!M || !me) return;
  let kind = null;
  if (m.kind === 'prize') kind = 'prize';
  else if (m.kind === 'credit' && (/^First screen credit/.test(m.t) || me.standing >= 25)) kind = 'credit';
  else if (m.kind === 'level' && /level [2-5]/.test(m.t)) kind = 'level';
  else if (m.kind === 'film' && /became a hit/.test(m.t)) kind = 'film';
  else if (m.kind === 'agent' && me.standing >= 18) kind = 'agent';
  else if (/^Fell out with/.test(m.t) && me.standing >= 15) kind = 'feud';
  else if (/mid-sized company/.test(m.t)) kind = 'company';
  if (!kind) return;
  if (kind === 'feud' && (M.press || []).some(c => c.kind === 'feud' && S.week - c.w < 26)) return;   // the gossip columns don't run the same story twice
  const r = hashRand(S.week * 31 + (M.milestones || []).length * 7 + me.id), L = PRESS_HEAD[kind];
  const h = L[Math.floor(r() * L.length)].replace('{n}', me.name), paper = PAPERS[Math.floor(r() * PAPERS.length)];
  (M.press = M.press || []).push({ w: S.week, paper, h, sub: m.t, kind, ni: S.news.length });
  if (M.press.length > 60) M.press.shift();
  news(kind === 'prize' ? 'Award' : 'People', `${h}. ${m.t}.`, { person: me.id });
}
// the article behind a clipping (older saves didn't keep its index: find it by its headline)
function clipNi(c) {
  if (c.ni !== undefined && S.news[c.ni]) return c.ni;
  for (let i = S.news.length - 1; i >= 0 && S.news[i].w >= c.w; i--) if (S.news[i].w === c.w && S.news[i].text.startsWith(c.h)) return (c.ni = i);
  return null;
}
// Everything the papers have run about someone, newest first, each opening the article.
function pressAboutHTML(id, n = 8) {
  const out = [];
  for (let i = S.news.length - 1; i >= 0 && out.length < n; i--) { const x = S.news[i]; if (x.ref && x.ref.person === id) out.push(i); }
  if (!out.length) return '';
  return `<section class="panel"><h3>In the press</h3><ul class="plain">${out.map(i => { const x = S.news[i]; return `<li><span class="muted small">${fmtDate(x.w, true)}</span> ${chip(x.type, 't-' + x.type)} <a href="#" class="lk" data-go="article:${i}">${esc(x.text.length > 140 ? x.text.slice(0, 137) + '…' : x.text)}</a></li>`; }).join('')}</ul></section>`;
}
function clippingsHTML() {
  const L = (S.me.press || []).slice().reverse();
  if (!L.length) return '';
  return `<section class="panel clips"><h3>Press clippings</h3><div class="cliplist">${L.slice(0, 12).map(c => `<div class="clip"><span class="eyebrow">${esc(c.paper)} · ${fmtDate(c.w, true)}</span><b>${clipNi(c) !== null ? `<a href="#" class="lk" data-go="article:${clipNi(c)}">${esc(c.h)}</a>` : esc(c.h)}</b><p class="small muted">${linkPrizes(esc(c.sub))}</p></div>`).join('')}</div></section>`;
}
// ---- next moves: what would help most right now ----
function nextMoves() {
  const M = S.me, me = ME(), out = [], add = (t, tab, why) => out.push({ t, tab, why });
  const pend = pending();
  if (pend.length) add(`Decide: ${pend[0].title}`, 'feed', 'Waiting on you');
  if (M.burnout) add('Rest. Your body has called time this week.', 'diary', 'Burnt out');
  else if (M.energy < 35) add('Book a couple of evenings in: you\'re running on fumes.', 'diary', `Energy ${Math.round(M.energy)}`);
  if ((M.grind || 0) >= 8) add('Take a weekend away to reset the grind.', 'life', `${M.grind} weeks without a break`);
  const rent = usd(ORIGIN.life[M.life].rent);
  if (M.cash < rent * 2) add('Money is tight: add side-hustle blocks or cheaper housing.', 'diary', `${fmtCash(M.cash)} left`);
  if (!M.jobs.length && M.board.length && lookingForWork()) { const best = M.board.filter(p => !blockedFrom(tmplOf(p))).map(p => [p, hireOdds(p)]).sort((a, b) => b[1] - a[1])[0]; if (best) add(`Apply: ${best[0].t} (${Math.round(best[1] * 100)}% odds)`, 'work', 'Between jobs'); }
  const B = Object.keys(M.black || {}); if (B.length) add(`Try to make peace with ${P(+B[0]).name}.`, 'people', 'Bad blood is costing you');
  if (typeof campaignSeason === 'function' && campaignSeason() && campaignFilms().some(f => !(f.campLog || []).length)) add('Awards season: campaign for your film.', 'compete', 'October to December');
  if (typeof COMPS !== 'undefined') { const c = COMPS.find(c => compOpen(c) && !compEntered(c) && compFits(c) && (c.need !== 'script' || (M.scripts || []).some(s => s.grade))); if (c) add(`Enter ${c.name}.`, 'compete', 'Fits you, open now'); }
  if (typeof mentorCandidates === 'function' && !M.mentor) { const c = mentorCandidates().find(p => S.week - ((M.mAsk || {})[p.id] ?? -99) >= 26); if (c) add(`Ask ${c.name} to mentor you.`, 'people', 'Senior, and likes you'); }
  if (!M.agent && careerLevel() >= 2) add('You could interest an agent now.', 'work', 'Level ' + careerLevel());
  if (phoneUnread() >= 3) add('Reply to your texts: people notice.', 'phone', `${phoneUnread()} unread`);
  if (!(M.scripts || []).length && me.mind.vis >= 11) add('Start writing a script: you have the eye for it.', 'create', 'Vision ' + Math.round(me.mind.vis));
  return out.slice(0, 3);
}
function nextMovesHTML() {
  const L = nextMoves();
  return L.length ? `<section class="panel"><h4>Next moves</h4><ul class="plain small moves">${L.map(m => `<li><button class="linkish" data-dtab="${m.tab}">${esc(m.t)}</button><br><span class="muted">${esc(m.why)}</span></li>`).join('')}</ul></section>` : '';
}
// ---- ambitions: a ladder for the early years ----
const AMBITIONS = [
  { k: 'contacts', t: 'Know ten people in the business', p: () => [Object.keys(S.me.known).length, 10], rw: 1 },
  { k: 'firstjob', t: 'Land your first paid job', p: () => [S.me.past.length + S.me.jobs.length, 1], rw: 1 },
  { k: 'cushion', t: 'Save three months\' rent', p: () => [Math.max(0, S.me.cash), usd(ORIGIN.life[S.me.life].rent) * 3], rw: 1, money: 1 },
  { k: 'credit', t: 'Earn a screen credit', p: () => [ME().credits.length + S.me.past.filter(x => x.credited).length > 0 ? 1 : 0, 1], rw: 2 },
  { k: 'script', t: 'Finish a script', p: () => [(S.me.scripts || []).filter(s => s.grade).length, 1], rw: 1 },
  { k: 'contest', t: 'Place in a competition', p: () => [(S.me.comps || []).filter(e => e.told && e.place !== 'out').length, 1], rw: 1 },
  { k: 'level2', t: 'Reach level 2: credits to your name', p: () => [careerLevel(), 2], rw: 2 },
  { k: 'agent', t: 'Sign with an agent', p: () => [S.me.agent ? 1 : 0, 1], rw: 2 },
  { k: 'corner', t: 'Have someone in your corner', p: () => [Object.keys(S.me.champ || {}).length, 1], rw: 2 },
  { k: 'five', t: 'Five screen credits', p: () => [S.me.past.filter(x => x.credited).length, 5], rw: 2 },
  { k: 'senior', t: 'Work a senior job', p: () => [S.me.past.concat(S.me.jobs).some(j => typeof jobTier === 'function' && jobTier(j) >= 4) ? 1 : 0, 1], rw: 3 },
  { k: 'level3', t: 'Reach level 3: working professional', p: () => [careerLevel(), 3], rw: 3 },
  { k: 'ownfilm', t: 'Get a film of your own made', p: () => [((S.me.scripts || []).filter(s => s.made !== undefined).length + (S.me.holdings || []).filter(h => h.made !== undefined).length), 1], rw: 3 },
  { k: 'festival', t: 'Have a film selected at a festival', p: () => [(S.me.milestones || []).some(m => /selected for|official selection|won the/.test(m.t)) ? 1 : 0, 1], rw: 3 },
  { k: 'level4', t: 'Reach level 4: in demand', p: () => [careerLevel(), 4], rw: 4 },
  { k: 'award', t: 'Win a national award', p: () => [ME().awards.length, 1], rw: 5 }
];
function ambitionWeek() {
  const M = S.me, me = ME(); M.amb = M.amb || {};
  const got = [];
  if (typeof ambFresh === 'function') ambFresh();
  for (const A of AMBITIONS) {
    if (M.amb[A.k] !== undefined) continue;
    let c = 0, n = 1; try { [c, n] = A.p(); } catch (e) { continue; } if (!(c >= n)) continue;
    M.amb[A.k] = S.week; got.push(A);
  }
  if (got.length === 1) inbox('note', `Ambition reached: ${got[0].t.toLowerCase()}`, `${pickLine(['One more rung. You feel it: a little steadier, a little more sure you belong.', 'You tick it off in your head on the walk home, and allow yourself a small, private grin.', 'Nobody else knows it happened. You do.', 'Proof, if you needed it, that this is going somewhere.', 'A small win. They add up.'], S.week)} Your reward is waiting on the Standing page.`);
  else if (got.length > 1) inbox('note', `${got.length} ambitions reached`, `${got.slice(0, 8).map(A => A.t).join(' · ')}${got.length > 8 ? ` and ${got.length - 8} more` : ''}. The rewards are waiting on the Standing page.`);
}
function ambitionsHTML() {
  if (typeof ambFresh === 'function') ambFresh();
  const M = S.me, done = AMBITIONS.filter(A => (M.amb || {})[A.k] !== undefined), next = AMBITIONS.filter(A => (M.amb || {})[A.k] === undefined).slice(0, 3);
  return `<section class="panel amb"><h3>Ambitions <span class="count">${done.length} of ${AMBITIONS.length}</span></h3>${next.map(A => { const [c, n] = A.p(), pct = clamp(c / n, 0, 1); return `<div class="ambrow"><span>${linkPrizes(esc(A.t))}</span><span class="tbar"><i style="width:${Math.round(pct * 100)}%"></i></span><span class="small muted">${A.money ? fmtCash(Math.min(c, n)) + ' / ' + fmtCash(n) : Math.min(c, n) + ' / ' + n}</span></div>`; }).join('')}
   ${done.length ? `<p class="small muted">Done: ${done.map(A => esc(A.t.toLowerCase())).join(' · ')}</p>` : ''}</section>`;
}
