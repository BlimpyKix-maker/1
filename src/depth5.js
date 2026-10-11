// ---------------- The board's confidence ----------------
// From head of a division up, a company job comes with a verdict that runs all the time: the board's confidence in
// you. It's built from what you can see: what the company's films have earned against what they cost this year, its
// hits, what your boss thinks of you, and whether the company's money is growing or shrinking. Every quarter there's a
// review: you can spend confidence (ask for a bigger budget for the slate, or protect a film you believe in), or bank
// it. Let it fall far enough and you're asked to clear your desk, with a parachute if you negotiated one on the way in.
function confJob() { const j = typeof corpJob === 'function' ? corpJob() : null; return j && jobRung(j) >= 4 ? j : null; }
function confParts(j) {
  const M = S.me, c = S.companies[j.co], L = c ? S.films.filter(f => f.co === c.id && f.rel !== null && f.rel > S.week - 52 && f.cost > 0) : [];
  const cost = L.reduce((t, f) => t + f.cost, 0), gross = L.reduce((t, f) => t + (f.total || 0), 0), R = cost > 0 ? gross / cost : null, hits = L.filter(f => f.total >= f.cost * 2.5).length;
  const boss = j.head !== null && j.head !== undefined && P(j.head) ? opinion(j.head) : 0, cash0 = (M.conf && M.conf.cash0) || (c ? c.cash : 0), trend = c && cash0 ? (c.cash - cash0) / Math.max(1, Math.abs(cash0)) : 0;
  return [['Results', R === null ? 0 : clamp((R - 1.5) * 25, -25, 25), R === null ? 'nothing released yet this year' : `the slate earned ×${R.toFixed(2)} its cost`], ['Hits', Math.min(15, hits * 6), `${hits} hit${hits === 1 ? '' : 's'}`], ['Your boss', clamp(boss / 4, -12, 12), `opinion ${Math.round(boss)}`], ['The money', clamp(trend * 30, -12, 12), `company cash ${trend >= 0 ? 'up' : 'down'} ${Math.abs(Math.round(trend * 100))}% since you started`], ['Credit you\'ve spent', -((M.conf && M.conf.spent) || 0), 'asks granted']];
}
function confScore(j) { return clamp(55 + confParts(j).reduce((t, p) => t + p[1], 0), 0, 100); }
function confWeek() {
  const M = S.me, j = confJob(); if (!M) return;
  if (!j) { if (M.conf && !M.jobs.some(x => x.id === M.conf.job)) M.conf = null; return; }
  if (!M.conf || M.conf.job !== j.id) { const c = S.companies[j.co]; M.conf = { job: j.id, w: S.week, cash0: c ? c.cash : 0, spent: 0, next: S.week + 13, para: 0 };
    inbox('conf', `The board's expectations at ${c ? c.name : 'the company'}`, `The chair takes you to lunch. The board wants the slate to earn well over what it costs, a hit or two, and no surprises. "We'll review every quarter." Your lawyer says now is the moment to ask for a golden parachute, before you need one.`, { job: j.id, choices: [{ k: 'cf_para', label: `Negotiate a parachute · ${checkLabel('pack', 13)}`, check: ['pack', 13] }, { k: 'cf_none', label: 'Don\'t ask: it looks like you expect to fail' }] }); return; }
  if (S.week < M.conf.next || pending().some(it => it.kind === 'conf')) return;
  M.conf.next = S.week + 13; const sc = confScore(j), P0 = confParts(j), c = S.companies[j.co];
  const rep = P0.map(([l, v, d]) => `${l}: ${v >= 0 ? '+' : ''}${Math.round(v)} (${d})`).join(' · ');
  if (sc < 20) { inbox('conf', 'The board has lost confidence', `Confidence ${Math.round(sc)}/100. ${rep}. The chair asks you to come in on Monday. Everyone knows what that means.`, { job: j.id, low: 1, choices: [{ k: 'cf_case', label: `Make your case · ${checkLabel('cha', 15)}`, check: ['cha', 15] }, { k: 'cf_go', label: 'Resign before they ask' }] }); return; }
  inbox('conf', `Quarterly review: confidence ${Math.round(sc)}/100`, `${rep}.${sc < 35 ? ' The chair says "we need to see a turnaround". It is a warning.' : sc > 75 ? ' The board is delighted. This is the time to ask for something.' : ''}`, { job: j.id, choices: [{ k: 'cf_budget', label: 'Ask for a bigger budget for the slate (spends 10)', dis: sc < 30 ? 'Not with confidence this low' : undefined }, { k: 'cf_protect', label: 'Protect a film you believe in (spends 8)', dis: sc < 25 ? 'Not with confidence this low' : undefined }, { k: 'cf_bank', label: 'Ask for nothing; keep your head down' }] });
}
function confPick(it, k) {
  if (it.kind !== 'conf') return false; it.done = true; const M = S.me, me = ME(), j = M.jobs.find(x => x.id === it.job), C = M.conf; if (!j || !C) { it.result = { t: 'It no longer matters.' }; return true; }
  const c = S.companies[j.co];
  if (k === 'cf_para') { const ok = roll('pack', 13); if (ok) C.para = 26; it.result = { ok, roll: M.lastRoll, t: ok ? 'Six months\' salary if they ever let you go. The chair smiles thinly: "Of course."' : 'They decline, politely. You\'ve shown them you\'re thinking about leaving.' }; if (!ok && j.head != null && P(j.head)) addTie(me, P(j.head), -2); return true; }
  if (k === 'cf_none') { it.result = { t: 'You shake hands. No safety net.' }; return true; }
  if (k === 'cf_budget') { C.spent += 10; if (c) c.cash += Math.max(5, slateOf(c).reduce((t, f) => t + f.budget, 0) * .1); it.result = { t: 'Granted: ten per cent more for the slate. They\'ll remember they gave it.' }; return true; }
  if (k === 'cf_protect') { C.spent += 8; const f = c ? slateOf(c)[0] : null; if (f) { f.qBonus = (f.qBonus || 0) + 2; f.hook = clamp((f.hook || 50) + 3, 5, 99); } it.result = { t: f ? `${f.title} gets its full schedule and its marketing. If it works, you look like a genius.` : 'Nothing on the slate to protect right now.' }; return true; }
  if (k === 'cf_bank') { C.spent = Math.max(0, C.spent - 4); it.result = { t: 'You keep your head down. The board likes executives who don\'t ask for things, for a while.' }; return true; }
  if (k === 'cf_case') { const ok = roll('cha', 15); if (ok) { C.spent = Math.max(0, C.spent - 10); C.next = S.week + 13; it.result = { ok, roll: M.lastRoll, t: 'You walk them through the next twelve months, film by film. They give you two more quarters.' }; return true; } }
  // out
  const sev = C.para ? j.rate * 5 * C.para : 0; finishJob(j, null, true); M.cash += sev; me.standing = clamp(me.standing - 3, 0, 100); M.stress = clamp(M.stress + 15, 0, 100); M.conf = null;
  milestone(`Pushed out at ${c ? c.name : 'the company'}`, 'work'); news('Industry', `${me.name} is out at ${c ? c.name : 'their company'} after a difficult year.`);
  it.result = { t: `You clear your desk on a Friday.${sev ? ` The parachute opens: ${fmtCash(sev)}.` : ' No parachute.'} Your phone is very quiet for a week, and then it isn't.` }; return true;
}
// the confidence panel sits with your company job
function confHTML() { const j = confJob(); if (!j || !S.me.conf) return ''; const sc = confScore(j), P0 = confParts(j);
  return `<section class="panel"><h3>The board's confidence <span class="${sc < 35 ? 'bad' : sc > 70 ? 'good' : ''}">${Math.round(sc)}/100</span></h3><div class="tk-bars">${P0.map(([l, v, d]) => `<div class="ambrow"><span class="small">${esc(l)}</span><span class="tbar"><i style="width:${clamp(50 + v * 2, 0, 100)}%"></i></span><b class="small ${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${Math.round(v)}</b><span class="small muted">${esc(d)}</span></div>`).join('')}</div><p class="small muted">Reviewed every quarter (next ${fmtDate(S.me.conf.next, true)}). Below 20 at a review, you're out${S.me.conf.para ? `, with a ${S.me.conf.para}-week parachute` : ', with nothing'}.</p></section>`; }
{ const _wk = OS_VIEWS.work; if (_wk) OS_VIEWS.work = () => confHTML() + _wk(); }
