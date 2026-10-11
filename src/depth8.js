// ---------------- The decade, the desk, rust, an ageing audience and the household ----------------
//  · Life verdicts (BitLife, Reigns' reign summaries): at 30, 40, 50, 60 and 70 the game adds up the decade: the work,
//    money, love, friends, health and the dream, each with the numbers behind it. Then you choose what the next
//    decade is for. Each choice is a standing condition with a stated upside and cost.
//  · The desk (Reigns): an executive, or the owner of a company with films in work, gets three cards a week about
//    those films and people. Every card shows exactly what each side does before you choose; nothing is rolled.
//  · Rust (Cultist Simulator's decay): a skill you haven't used for a year slowly slips, never below four-fifths
//    of its best. Using it stops the slide.
//  · An ageing audience: fans who found you fifteen years ago turn out less on opening weekend, and older fans
//    follow you into dramas more readily than into anything else.
//  · The household (Papers, Please): when money is tight and people depend on you, the month's bills are a choice.
//  · Mood-shaped learning: very stressed, you learn more slowly; calm and rested, a little faster.
// Every chance shown is the chance rolled; every effect shown is the effect applied.

function myRent() { const L = ORIGIN.life[S.me.life]; return usd(L ? L.rent : 400); }
// ---- mood-shaped learning ----
function moodLearn() { const M = S.me; if (!M) return 1; return M.stress >= 65 ? .85 : M.stress <= 15 && M.energy >= 70 ? 1.1 : 1; }
{ const _cm = condMul; condMul = function () { return _cm() * moodLearn(); }; }

// ---- life verdicts ----
const DECADE = {
  work: ['The work', 'Craft learning ×1.10; stress builds 1 a week faster when you\'re working', { adv: [] }],
  people: ['The people', 'Close friends and family drift away half as fast; advantage on Collaboration', { adv: ['col'] }],
  money: ['Getting your money right', 'Advantage on finance; disadvantage on Vision (you play it safe)', { adv: ['fin'], dis: ['vis'] }],
  change: ['A change of course', 'Your dream becomes the field you\'re in now; advantage on Vision for two years', { adv: ['vis'] }]
};
function verdictParts() {
  const M = S.me, me = ME(), nw = typeof osNetWorth === 'function' ? osNetWorth().total : M.cash, rent = myRent();
  const close = Object.keys(M.known || {}).map(Number).filter(id => P(id) && !P(id).dead && opinion(id) >= 40).length, sp = typeof famSpouse === 'function' ? famSpouse() : null, kids = (M.kids || []).length;
  const recent = (me.credits || []).filter(id => S.films[id] && S.films[id].rel !== null && S.films[id].rel > S.week - 520).length;
  const dreamField = DREAM_BY && DREAM_BY[M.dream] ? DREAM_BY[M.dream].field : M.field;
  return [
    ['The work', clamp(recent * 12, 0, 100), `${recent} credit${recent === 1 ? '' : 's'} in ten years; ${me.credits.length} in all`],
    ['Money', nw <= 0 ? clamp(20 + nw / Math.max(1, rent * 52) * 10, 0, 20) : clamp(40 + Math.log10(1 + nw / Math.max(1, rent * 52)) * 40, 0, 100), nw <= 0 ? `in debt: ${fmtCash(nw)}` : `worth ${fmtCash(nw)}, about ${(nw / Math.max(1, rent * 52)).toFixed(1)} years of rent`],
    ['Love', sp !== null ? 80 + Math.min(20, kids * 7) : (typeof partnerOf === 'function' && partnerOf() !== null) ? 60 : 25, sp !== null ? `married${kids ? `, ${kids} child${kids > 1 ? 'ren' : ''}` : ''}` : (typeof partnerOf === 'function' && partnerOf() !== null) ? 'with someone' : 'on your own'],
    ['Friends', clamp(close * 14, 0, 100), `${close} people who think well of you`],
    ['Health', clamp(100 - M.stress, 0, 100), `stress ${Math.round(M.stress)}, energy ${Math.round(M.energy)}`],
    ['The dream', dreamField === M.field ? 75 + Math.min(25, me.standing / 4) : 30, dreamField === M.field ? `still in ${M.field}` : `you meant to be in ${dreamField}; you're in ${M.field}`]
  ];
}
function verdictWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return; const a = ageOf(me), V = M.verdicts = M.verdicts || {};
  if (a < 30 || a % 10 || a > 70 || V[a] || pending().some(it => it.kind === 'verdict')) return;
  const P0 = verdictParts(), tot = Math.round(avg(P0.map(p => p[1]))); V[a] = { w: S.week, tot };
  inbox('verdict', `Turning ${a}: the decade, added up`, `${P0.map(([l, v, d]) => `${l} ${Math.round(v)}/100 (${d})`).join(' · ')}. Overall ${tot}/100. What is the next ten years for?`, { age: a,
    choices: Object.entries(DECADE).map(([k, [l, d]]) => ({ k: 'dv_' + k, label: `${l}: ${d}` })) });
}
function verdictPick(it, k) {
  if (it.kind !== 'verdict') return false; it.done = true; const M = S.me, me = ME(), x = k.slice(3); if (!DECADE[x]) return true;
  M.decade = { k: x, w: S.week, until: S.week + 520 };
  if (x === 'change' && typeof DREAMS !== 'undefined') { const d = DREAMS.find(d => d.field === M.field && d.role === me.role) || DREAMS.find(d => d.field === M.field); if (d) M.dream = d.k; M.decade.vis = S.week + 104; }
  diary(`At ${it.age} you decide the next ten years are for ${DECADE[x][0].toLowerCase()}.`); milestone(`Turned ${it.age}: chose ${DECADE[x][0].toLowerCase()}`, 'life');
  it.result = { t: { work: 'You clear the diary of everything that isn\'t the work. It feels like the right kind of tired.', people: 'You start saying yes to dinners. The work can wait an evening.', money: 'You open a spreadsheet and look at it properly for the first time in years.', change: 'You stop pretending the old plan is the plan.' }[x] }; return true;
}
{ const _cm = condMul; condMul = function () { const v = _cm(), D = S.me && S.me.decade; return D && D.k === 'work' && S.week < D.until ? v * 1.1 : v; }; }

// ---- skill rust ----
{ const _gs = growSub; growSub = function (me, k, amt) { const g = _gs(me, k, amt); if (S.me && me === ME() && amt > 0) { const U = S.me.used = S.me.used || {}; U[k] = S.week; const B = S.me.best = S.me.best || {}; if (me.sk[k] !== undefined) B[k] = Math.max(B[k] || 0, me.sk[k]); } return g; }; }
function rustList() { const M = S.me, me = ME(), U = M.used || {}, B = M.best || {}; return Object.keys(me.sk).filter(k => (B[k] || 0) >= 10 && S.week - (U[k] !== undefined ? U[k] : M.startW || 0) > 52 && me.sk[k] > (B[k] || 0) * .8 + .01); }
function rustWeek() { const M = S.me, me = ME(); if (!M || woy() % 4) return; for (const k of rustList()) me.sk[k] = Math.max((M.best[k] || 0) * .8, me.sk[k] - .04); }

// ---- an ageing audience ----
{ const _rl = release; release = function (f) { const had = f && !f.fanIn, out = _rl.apply(this, arguments); const M = S.me; if (M && had && f.fanIn && M.fans) { const A = M.fanW = M.fanW || {}, F = M.fans; for (const g of Object.keys(F)) if (A[g] === undefined) A[g] = S.week; } return out; }; }
function fanAge(g) { const W = (S.me.fanW || {})[g]; return W === undefined ? 0 : (S.week - W) / 52; }
function fanAgeMul(g, target) { const y = fanAge(g); const turn = clamp(1 - (y - 15) / 40, .6, 1); return target === 'Drama' && y >= 15 ? Math.min(1, turn + .2) : turn; }
{ const _fh = fanHook; fanHook = function (genre) { const F = fansOf(); let n = 0; for (const [g, v] of Object.entries(F)) n += v * (g === genre ? 1 : (genre === 'Drama' && fanAge(g) >= 15 ? .5 : .2)) * fanAgeMul(g, genre); return n > 0 ? clamp(Math.log10(1 + n / 5000) * 4, 0, 10) : 0; }; }
{ const _fv = OS_VIEWS.standing; if (_fv) OS_VIEWS.standing = () => { const F = S.me.fans || {}, L = Object.keys(F).filter(g => S.me.fanW && S.me.fanW[g] !== undefined); const h = _fv(); if (!L.length) return h;
  const avgY = L.reduce((t, g) => t + fanAge(g) * F[g], 0) / Math.max(1, L.reduce((t, g) => t + F[g], 0));
  return `<p class="small muted panel">🎟️ Your audience has followed you for ${avgY.toFixed(1)} years on average. Fans who found you more than fifteen years ago turn out less on opening weekend (down to 60% at 31 years); older fans follow you into dramas half the time instead of a fifth.</p>` + h; }; }

// ---- the household ----
function billMul() { const B = S.me && S.me.billCut; return B && S.week < B.until ? B.mul : 1; }
function billWeek() {
  const M = S.me; if (!M || woy() % 4 !== 1) return; const kids = (M.kids || []).filter(k => !k.out && kidAge(k) < 18); if (!kids.length || pending().some(it => it.kind === 'bills')) return;
  const rent = myRent(), month = kids.reduce((t, k) => t + usd(kidAge(k) < 5 ? 250 : 150), 0) * 4; if (M.cash > rent * 4 + month) return;
  inbox('bills', 'The household this month', `Money is tight: ${fmtCash(M.cash)} in the bank, ${fmtCash(rent * 4)} of rent due this month and ${fmtCash(month)} for the children. Something has to give, or nothing does and you go further into the red.`, {
    month, choices: [{ k: 'bl_all', label: `Pay everything (${fmtCash(month)})` }, { k: 'bl_heat', label: `Keep the heating low (saves ${fmtCash(Math.round(month * .3))}; stress +6, a cold house)` }, { k: 'bl_extra', label: `No extras: no trips, no lessons (saves ${fmtCash(Math.round(month * .25))}; the children notice)` }, { k: 'bl_ask', label: `Ask family for help (${fmtCash(Math.round(month * .5))} now; stress +4, they will remember)` }] });
}
function billPick(it, k) {
  if (it.kind !== 'bills') return false; it.done = true; const M = S.me, me = ME();
  if (k === 'bl_heat') { M.billCut = { until: S.week + 4, mul: .7 }; M.stress = clamp(M.stress + 6, 0, 100); it.result = { t: 'Jumpers indoors. The children think it\'s an adventure for about a day.' }; }
  else if (k === 'bl_extra') { M.billCut = { until: S.week + 4, mul: .75 }; for (const c of M.kids || []) c.bond = (c.bond || 0) - 1; it.result = { t: 'No swimming lessons this month. Nobody says anything, which is worse.' }; }
  else if (k === 'bl_ask') { M.cash += Math.round(it.month * .5); M.stress = clamp(M.stress + 4, 0, 100); M.famDebt = (M.famDebt || 0) + Math.round(it.month * .5); it.result = { t: 'Your mother sends it the same day and doesn\'t mention it. Your sister mentions it twice.' }; }
  else it.result = { t: 'You pay it all. The account says what it says.' };
  return true;
}

// ---- the desk ----
const DESK_CARDS = [
  { k: 'days', need: f => f.stage <= 3, t: (f, c) => `${pl(f.dir)} wants two more shooting days on ${fl(f.id)}.`, L: ['Hold the schedule', f => ({ tie: [f.dir, -4], txt: 'tie with the director −4' })], R: ['Approve the days', f => ({ cost: f.budget * .03, q: 1, txt: `${fmtM(f.budget * .03)}; quality +1` })] },
  { k: 'mkt', need: f => f.stage >= 3, t: f => `Marketing wants more for ${fl(f.id)}'s campaign.`, L: ['Keep the budget', () => ({ txt: 'nothing changes' })], R: ['Spend it', f => ({ cost: f.budget * .06, hook: 3, txt: `${fmtM(f.budget * .06)}; hook +3` })] },
  { k: 'notes', need: f => f.stage <= 3, t: f => `The lead of ${fl(f.id)} wants to rewrite their big scene.`, L: ['Say no', f => ({ tie: [f.cast[0], -3], txt: 'tie with the lead −3' })], R: ['Let them', f => ({ q: -1, hook: 1, tie: [f.cast[0], 4], txt: 'quality −1, hook +1, tie with the lead +4' })] },
  { k: 'test', need: f => f.stage === 3, t: f => `The test screening of ${fl(f.id)} scored low on the ending.`, L: ['Release it as it is', () => ({ hook: -1, txt: 'hook −1' })], R: ['Reshoot the ending', f => ({ cost: f.budget * .05, q: 2, txt: `${fmtM(f.budget * .05)}; quality +2` })] },
  { k: 'quote', need: f => f.stage <= 3, t: f => `A trade reporter has heard ${fl(f.id)} is in trouble and wants a quote.`, L: ['No comment', () => ({ stand: -.5, txt: 'standing −0.5' })], R: ['Spin it hard', f => ({ stand: 1, tie: [f.dir, -2], txt: 'standing +1, tie with the director −2 (it was their trouble you spun)' })] },
  { k: 'nephew', need: () => true, t: () => 'A board member\'s nephew needs a job. "Anything at all."', L: ['There isn\'t one', () => ({ board: -3, txt: 'board credit −3' })], R: ['Find him something', () => ({ board: 3, stand: -.3, txt: 'board credit +3, standing −0.3' })] },
  { k: 'fest', need: f => f.stage === 3, t: f => `A festival wants ${fl(f.id)} as its closing night film.`, L: ['Hold it for a bigger one', () => ({ txt: 'nothing changes' })], R: ['Take the slot', f => ({ cost: f.budget * .005, hook: 2, stand: .5, txt: `${fmtM(f.budget * .005)} for the trip; hook +2, standing +0.5` })] },
  { k: 'crew', need: f => f.stage <= 3, t: f => `The crew on ${fl(f.id)} ask for a bonus after a run of night shoots.`, L: ['Thank them, no bonus', () => ({ stand: -.3, txt: 'standing −0.3 (it gets around)' })], R: ['Pay it', f => ({ cost: f.budget * .01, stand: .3, q: .5, txt: `${fmtM(f.budget * .01)}; standing +0.3, quality +0.5` })] }
];
function deskCo() { const j = typeof corpJob === 'function' ? corpJob() : null; if (j && jobRung(j) >= 3 && S.companies[j.co]) return S.companies[j.co]; const c = typeof myCo === 'function' ? myCo() : null; return c && c.closed === null ? c : null; }
function deskFilms(c) { return S.active.map(i => S.films[i]).filter(f => f && f.co === c.id && f.rel === null && f.stage < 5 && f.dir !== undefined); }
function deskWeek() {
  const M = S.me; if (!M) return; const c = deskCo(); if (!c) { M.desk = null; return; } const L = deskFilms(c); if (!L.length) { M.desk = null; return; }
  const out = []; for (let i = 0; i < 3; i++) { const f = L[Math.floor(prnd() * L.length)], C = DESK_CARDS.filter(x => x.need(f)); if (!C.length) continue; const x = C[Math.floor(prnd() * C.length)]; if (out.some(o => o.k === x.k && o.f === f.id)) continue; out.push({ k: x.k, f: f.id }); }
  M.desk = { w: S.week, co: c.id, cards: out };
}
function deskFx(f, side, x) { return (side === 'L' ? x.L : x.R)[1](f); }
ACT_HOOKS.desk = a => {
  const M = S.me, D = M.desk; if (!D || D.w !== S.week - 1 && D.w !== S.week) return false; const cd = D.cards[a.i]; if (!cd || cd.done) return false; const f = S.films[cd.f], x = DESK_CARDS.find(y => y.k === cd.k), c = S.companies[D.co]; if (!f || !x || !c) return false;
  const e = deskFx(f, a.side, x), me = ME();
  if (e.cost) { if (c.cash < e.cost) return false; c.cash -= e.cost; f.cost = (f.cost || 0) + e.cost; }
  if (e.q) f.qBonus = (f.qBonus || 0) + e.q; if (e.hook) f.hook = clamp((f.hook || 50) + e.hook, 5, 99);
  if (e.tie && P(e.tie[0])) addTie(me, P(e.tie[0]), e.tie[1]); if (e.stand) me.standing = clamp(me.standing + e.stand, 0, 100);
  if (e.board && M.conf) M.conf.spent = Math.max(0, (M.conf.spent || 0) - e.board);
  cd.done = a.side; (M.deskLog = M.deskLog || []).push({ w: S.week, f: f.id, k: x.k, side: a.side }); if (M.deskLog.length > 60) M.deskLog.shift(); return true;
};
CLICK_HOOKS.desk = v => { const [i, side] = v.split(':'); doAct({ t: 'desk', i: +i, side }); render(); };
function deskHTML() {
  const M = S.me, D = M.desk, c = deskCo();
  if (!c) return `<section class="panel"><p class="muted">The desk is for executives (head of a department or above) and for owners of a company with films in work. Three cards a week, about your own films.</p></section>`;
  if (!D || !D.cards.length) return `<section class="panel"><p class="muted">Nothing on the desk this week. Cards arrive when ${esc(c.name)} has films in development or production.</p></section>`;
  return `<section class="panel"><h3>The desk at ${esc(c.name)} <span class="muted small">company cash ${fmtM(c.cash)}${M.conf ? ` · board credit spent ${M.conf.spent}` : ''} · standing ${ME().standing.toFixed(1)}</span></h3>
  <div class="desk">${D.cards.map((cd, i) => { const f = S.films[cd.f], x = DESK_CARDS.find(y => y.k === cd.k); if (!f || !x) return ''; const l = deskFx(f, 'L', x), r = deskFx(f, 'R', x);
    return `<div class="desk-card${cd.done ? ' done' : ''}"><p>${x.t(f)}</p>${cd.done ? `<p class="small muted">You chose: ${esc((cd.done === 'L' ? x.L : x.R)[0])}.</p>` : `<div class="desk-opts"><button class="btn-s ghost" data-hk="desk:${i}:L">← ${esc(x.L[0])}<br><small>${l.txt}</small></button><button class="btn-s" data-hk="desk:${i}:R" ${r.cost && c.cash < r.cost ? 'disabled' : ''}>${esc(x.R[0])} →<br><small>${r.txt}</small></button></div>`}</div>`; }).join('')}</div>
  <p class="small muted">Each side shows everything it does. Nothing on the desk is rolled.</p></section>`;
}
OS_EXTRA.desk = ['🗂️', 'The Desk', 'Three cards a week about your films'];
OS_VIEWS.desk = () => deskHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Work'); if (g && !g[1].includes('desk')) g[1].push('desk'); }

// ---- conditions and hooks ----
{ const _co = conditionsOf; conditionsOf = function () {
  const C = _co(), M = S.me; if (!M || !M.party || !M.party.done) return C;
  const m = moodLearn(); if (m !== 1) C.push({ k: 'mood_learn', label: m > 1 ? '📚 Learning faster' : '📚 Learning slower', d: m > 1 ? 'Calm (stress 15 or less) and rested (energy 70 or more): skills grow ×1.10.' : 'Stress 65 or more: skills grow ×0.85.' });
  const D = M.decade; if (D && S.week < D.until && DECADE[D.k]) { const X = DECADE[D.k]; C.push(Object.assign({ k: 'decade', label: `🧭 ${X[0]}`, d: `What you chose this decade to be for, until ${fmtDate(D.until, true)}. ${X[1]}.` }, D.k === 'change' && !(D.vis && S.week < D.vis) ? {} : X[2])); }
  const R = rustList(); if (R.length) C.push({ k: 'rust', label: `🕸️ Rusty (${R.length})`, d: `Unused for a year, slipping a little each month (never below four-fifths of your best): ${R.slice(0, 6).map(k => SUB_LABEL(k)).join(', ')}${R.length > 6 ? '…' : ''}. Using a skill stops the slide.` });
  if (billMul() < 1) C.push({ k: 'bills', label: '🧾 Cutting back', d: `Household spending on the children is at ${Math.round(billMul() * 100)}% until ${fmtDate(S.me.billCut.until, true)}.` });
  return C; }; }
function decadeWeek() { const M = S.me, D = M && M.decade; if (!D || S.week >= D.until) return;
  if (D.k === 'work' && M.jobs.length) M.stress = clamp(M.stress + 1, 0, 100);
  if (D.k === 'people') for (const id of (typeof innerCircle === 'function' ? innerCircle().filter(x => x[1] >= 3).map(x => x[0]) : [])) { const k = M.known[id]; if (k && k.seen !== undefined && S.week - k.seen > 4 && S.week % 2 === 0) k.seen++; }   // half the drift: every other week counts as if you'd been in touch
}
WEEK_HOOKS.push(verdictWeek, rustWeek, billWeek, deskWeek, decadeWeek);
PICK_HOOKS.push(verdictPick, billPick);
if (typeof APP_GUIDE !== 'undefined') APP_GUIDE.desk = ['Running the slate, three cards at a time.', 'Each week the desk deals three decisions about your company\'s films in work: extra days, marketing money, a lead who wants rewrites, a reporter who has heard something. Each side shows exactly what it costs and what it changes.', 'Nothing here is rolled. The art is in what you can afford to say yes to.'];
