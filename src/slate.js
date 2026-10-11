// ---------------- Slate deals and negative pickups ----------------
// Slate deal (after Relativity's pacts with the big studios): once a year a major studio offers outside money a share
// of everything it greenlights for the next twelve months. The full slate takes every film, hits and misses alike;
// cherry-pick lets you choose film by film, but the studio holds back its biggest bets for itself (adverse
// selection). Each film costs your share of its budget when it's greenlit and pays back your share of its rentals
// after the studio's 10% distribution fee and the marketing, plus a share of the ancillaries (home entertainment,
// television), counted as half the gross. A film that collapses returns the unspent part of your money. One film is a bet; a slate is a portfolio.
// Negative pickup: a distributor commits to buy the home rights to your company's film on delivery for the budget
// plus 10%; a bank lends 85% of that now against the contract. You keep the foreign rights, and the home box office
// belongs to the distributor.
function slOffer() {
  const M = S.me, nw = typeof netWorth === 'function' ? netWorth() : M.cash, c = typeof myCo === 'function' ? myCo() : null;
  if (nw < usd(1.5e6) && !(c && c.cash >= 5)) return;
  const pool0 = (c && c.cash > 5 ? c.cash * 1e6 : 0) + Math.max(0, M.cash), tierWant = pool0 >= usd(5e7) ? 1 : 2;
  const cnt = {}; for (let i = S.films.length - 1, n = 0; i >= 0 && n < 6000; i--, n++) { const f = S.films[i]; if (f.co !== null && f.co !== undefined && f.rel !== null && S.year - yearOf(f.rel) <= 2) cnt[f.co] = (cnt[f.co] || 0) + 1; }
  const act = {}; for (const id of S.active) { const f = S.films[id]; if (f && f.rel === null && f.stage >= 0 && f.stage <= 2 && f.co !== null && f.co !== undefined) act[f.co] = (act[f.co] || 0) + 1; }
  const studios = S.companies.filter(x => x.closed === null && x.owner === undefined && x.tier === tierWant && (cnt[x.id] || 0) >= 4 && (act[x.id] || 0) >= 2);
  if (!studios.length) return; const st = studios.sort((a, b) => (act[b.id] || 0) - (act[a.id] || 0) || gH(a.id, S.year, 'slate') - gH(b.id, S.year, 'slate'))[0];
  const recent = S.films.filter(f => f.co === st.id && f.rel !== null && S.year - yearOf(f.rel) <= 2), n = Math.max(3, (act[st.id] || 0) + Math.round(recent.length / 4)), avgB = recent.length ? recent.reduce((t, f) => t + f.budget, 0) / recent.length : 40;
  const mult = f => f.budget > 0 ? ((f.rentals || 0) * .9 - (f.pa || 0) + (f.total || 0) * .5) / f.budget : 1, mh = recent.length ? recent.reduce((t, f) => t + mult(f), 0) / recent.length : 1.1, cut = +clamp(1 - 1.1 / Math.max(.1, mh), -.6, .7).toFixed(2);   // a hot studio charges for access; a cold one has to sweeten the deal
  const pool = (c && c.cash > 5 ? c.cash * 1e6 : 0) + Math.max(0, M.cash), share = clamp(Math.floor(pool * .4 / (n * avgB * 1e6) * 1000) / 1000, .005, .25), pct = +(share * 100).toFixed(1);
  inbox('slatedeal', `${st.name} offers a slate deal`, `${st.name} wants outside money for its pipeline: ${pct}% of every film it has in development or production, and of anything it greenlights in the next twelve months, about ${n} films at ${fmtM(avgB)} each on recent form, so roughly ${fmtCash(Math.round(share * n * avgB * 1e6))} over the year. Each film pays back your share of its rentals after a 10% fee and the marketing, plus ancillaries. Its recent films would have paid an investor back ×${mh.toFixed(2)}${cut > 0 ? `, so it keeps ${Math.round(cut * 100)}% of what comes back as the price of access` : cut < 0 ? `, so it sweetens the deal: you get back ${Math.round(-cut * 100)}% more than your share` : ''}. Cherry-picking lets you choose, but they'll hold back their tentpoles.`, { co: st.id, share, cut, choices: [{ k: 'sl_full', label: `The full slate (${pct}%)` }, { k: 'sl_pick', label: `Cherry-pick (${pct}%, you choose each film)` }, { k: 'sl_no', label: 'Pass' }] });
}
function slPick(it, k) {
  if (it.kind === 'slatefilm') { it.done = true; const f = S.films[it.film]; if (k === 'sf_in' && f) slJoin(f, S.me.slate); it.result = { t: k === 'sf_in' ? `You're in on ${f.title}.` : 'You sit this one out.' }; return true; }
  if (it.kind !== 'slatedeal') return false; it.done = true;
  if (k === 'sl_no') { it.result = { t: 'You pass. Maybe next year.' }; return true; }
  S.me.slate = { co: it.co, share: it.share, cut: it.cut || 0, from: S.week, to: S.week + 52, pick: k === 'sl_pick', films: [] };
  milestone(`Signed a slate deal with ${S.companies[it.co].name}`, 'money'); it.result = { t: `Signed. For the next year you own ${+(it.share * 100).toFixed(1)}% of ${S.companies[it.co].name}'s ${k === 'sl_pick' ? 'films you choose' : 'films'}.` }; return true;
}
function slPay(amt) { const M = S.me, c = typeof myCo === 'function' ? myCo() : null; if (c && c.cash * 1e6 >= amt) { c.cash -= amt / 1e6; return 'co'; } M.cash -= amt; return 'me'; }
function slJoin(f, D) { if (!D || D.films.some(x => x.f === f.id)) return; const amt = Math.round(D.share * f.budget * 1e6); const by = slPay(amt); D.films.push({ f: f.id, amt, by, w: S.week }); }
function slWeek() {
  if (!S.me) return; const M = S.me;
  if (woy() === 8 && M.slY !== S.year && !(M.slate && S.week < M.slate.to)) { M.slY = S.year; slOffer(); }
  const D = M.slate; if (!D) return;
  if (S.week < D.to) for (const id of S.active) { const f = S.films[id]; if (!f || f.co !== D.co || f.rel !== null || f.stage < 0 || f.stage > 2 || f.slSeen) continue; f.slSeen = 1;
    if (D.pick) { if (f.tier === 1 && f.budget >= 60 && gH(f.id, 'hold') < .6) { D.held = (D.held || 0) + 1; continue; } inbox('slatefilm', `Slate: ${f.title}`, `${S.companies[D.co].name} greenlights ${f.title} (${f.genre}, ${fmtM(f.budget)}${P(f.dir) ? `, directed by ${P(f.dir).name}` : ''}${f.cast && P(f.cast[0]) ? `, starring ${P(f.cast[0]).name}` : ''}). Your ${+(D.share * 100).toFixed(1)}% would cost ${fmtCash(Math.round(D.share * f.budget * 1e6))}.`, { film: f.id, choices: [{ k: 'sf_in', label: 'In' }, { k: 'sf_out', label: 'Out' }] }); }
    else slJoin(f, D); }
  // settle released films, and collapsed ones
  for (const x of D.films) { if (x.paid) continue; const f = S.films[x.f]; if (!f) continue;
    if (f.stage < 0) { x.paid = 1; x.back = Math.round(x.amt * ([.8, .55, .2, .05][x.st || 0] || 0)); if (x.by === 'co' && myCo()) myCo().cash += x.back / 1e6; else M.cash += x.back; inbox('note', `Slate: ${f.title} collapses`, `${f.title} is abandoned. What wasn't spent comes back: ${fmtCash(x.back)} of your ${fmtCash(x.amt)}.`, { film: f.id }); continue; }
    if (f.rel === null) x.st = Math.max(x.st || 0, f.stage);
    if (f.rel === null || S.week < f.rel + 6) continue;
    const back = Math.max(0, D.share * ((f.rentals || 0) * .9 - (f.pa || 0)) + D.share * (f.total || 0) * .5) * 1e6 * (1 - (D.cut || 0)); x.paid = 1; x.back = Math.round(back);
    if (x.by === 'co' && myCo()) myCo().cash += back / 1e6; else M.cash += back;
    inbox('note', `Slate: ${f.title} settles`, `${f.title} took ${fmtM(f.total || 0)}. Your ${+(D.share * 100).toFixed(1)}% put in ${fmtCash(x.amt)} and gets back ${fmtCash(x.back)} (${x.back >= x.amt ? '+' : ''}${Math.round((x.back / Math.max(1, x.amt) - 1) * 100)}%).`, { film: f.id }); }
}
// ---- negative pickup on your own films ----
let NP_CTX = null;
FIN_COL.pickup = '#7a9a3a';
function npOK() { const c = typeof myCo === 'function' ? myCo() : null; return ME().standing >= 40 || (c && c.hits >= 1); }
{ const _fp = finPlan; finPlan = function (budget, o) { const plan = _fp(budget, o); if (!NP_CTX || plan.sv) return plan;
  plan.parts.push({ k: 'pickup', label: 'Negative pickup: a bank lends 85% of the distributor\'s promise to buy the home rights for the budget + 10%', amt: budget * .85 }); plan.fees.push(['Interest on the pickup loan', budget * .85 * .08]); plan.np = budget;
  plan.feeT = plan.fees.reduce((t, x) => t + x[1], 0); plan.equity = Math.max(0, budget + plan.feeT - plan.parts.reduce((t, x) => t + x.amt, 0)); LAST_PLAN = plan; return plan; }; }
{ const _sf = selfFund; selfFund = function (a) {
  const M = S.me, src = a.src === 'script' ? (M.scripts || []).find(x => x.id === a.id) : (M.holdings || []).find(x => x.id === a.id), before = src ? src.made : undefined;
  const np = a.np && npOK() && !a.sv ? 1 : null; NP_CTX = np; let r; try { r = _sf(a); } finally { NP_CTX = null; }
  if (r && np && src && src.made !== undefined && src.made !== before) { const f = S.films[src.made]; if (f && f.fin) { f.fin.np = f.budget; f.fin.log.push({ w: S.week, t: `Negative pickup: the home rights are sold on delivery for ${fmtM(f.budget * 1.1)}; the bank advances ${fmtM(f.budget * .85)} now.` }); } }
  return r; }; }
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); const F = f.fin, c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null;
  if (F && F.np && !F.npPaid && c) { F.npPaid = 1; const home = (f.gross[f.m] || 0) * .5; c.cash += F.np * 1.1 - F.np * .85 - home; F.log.push({ w: S.week, t: `Delivered: the distributor pays ${fmtM(F.np * 1.1)}, the bank takes back ${fmtM(F.np * .85)}, and the home box office (${fmtM(home)} in rentals) is theirs.` }); }
  return out; }; }
{ const _ff = finStackOf; finStackOf = function (f) { const L = _ff(f); if (!f.fin || !f.fin.np) return L; const eq = L.find(x => x[2] === 'equity'); const v = f.fin.np * .85; if (eq) eq[1] = Math.max(0, eq[1] - v); return L.concat([['Negative pickup loan', v, 'pickup']]).filter(x => x[1] > 0); }; }
{ const _mf = makeFilmForm; makeFilmForm = function (c, k, x) {
  const key = k + ':' + x.id, F = (UI.mk = UI.mk || {})[key] = UI.mk[key] || { micro: 1, dir: '', lead: '', inv: 0, rb: 1, ps: 0, gap: 0 };
  NP_CTX = +F.np && npOK() && !+F.sv ? 1 : null; let h; try { h = _mf(c, k, x); } finally { NP_CTX = null; }
  const box = `<label><input type="checkbox" data-mkfin="${key}:np" ${+F.np && npOK() ? 'checked' : ''} ${npOK() && !+F.sv ? '' : 'disabled'}> ${npOK() ? 'Negative pickup: sell the home rights on delivery for the budget + 10%, borrow 85% now (the home box office goes to the distributor)' : 'Negative pickup: distributors want standing 40+ or a hit first'}</label>`;
  return h.replace(/(<span class="muted tx-order">)/, box + '$1'); }; }
// ---- the Terminal's slate panel ----
function slatePanel() {
  const D = S.me.slate; if (!D) return '';
  const rows = D.films.map(x => { const f = S.films[x.f]; return `<tr><td>${fl(x.f)}</td><td class="n">${fmtCash(x.amt)}</td><td>${f.rel !== null ? 'released' : f.stage < 0 ? '<span class="dn">collapsed</span>' : STAGES[f.stage]}</td><td class="n ${x.paid ? (x.back >= x.amt ? 'up' : 'dn') : ''}">${x.paid ? fmtCash(x.back) : ''}</td></tr>`; }).join('');
  const put = D.films.reduce((t, x) => t + x.amt, 0), got = D.films.filter(x => x.paid).reduce((t, x) => t + x.back, 0), paidIn = D.films.filter(x => x.paid).reduce((t, x) => t + x.amt, 0);
  return `<section class="tk-p tk-wide"><h4>SLATE <span class="tk-sub">${+(D.share * 100).toFixed(1)}% of ${esc(S.companies[D.co].name)} · ${D.pick ? 'cherry-pick' : 'full slate'}${D.cut > 0 ? ` · studio keeps ${Math.round(D.cut * 100)}%` : D.cut < 0 ? ` · sweetened +${Math.round(-D.cut * 100)}%` : ''} · ${S.week < D.to ? `${D.to - S.week} weeks left` : 'closed to new films'}${D.held ? ` · ${D.held} held back` : ''}</span></h4>
   <div class="tk-kpis"><div class="tk-kpi"><span>INVESTED</span><b class="tk-v">${fmtCash(put)}</b></div><div class="tk-kpi"><span>RETURNED</span><b class="tk-v">${fmtCash(got)}</b></div><div class="tk-kpi"><span>SETTLED P&amp;L</span><b class="tk-v ${got >= paidIn ? 'up' : 'dn'}">${got - paidIn >= 0 ? '+' : '−'}${fmtCash(Math.abs(got - paidIn))}</b></div></div>
   <table class="tk-t"><thead><tr><th>Film</th><th class="n">In</th><th>Status</th><th class="n">Back</th></tr></thead><tbody>${rows || '<tr><td class="tk-mut" colspan="4">No films yet.</td></tr>'}</tbody></table></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + slatePanel() + h.slice(i); }; }

// a collapsed film still owes its lenders: the pickup loan and the mezzanine loan are repaid from what's left
{ const _fc = finCollapse; finCollapse = function (f, why, god) {
  const F = f.fin, c = typeof myCo === 'function' ? myCo() : null, owe = F && c ? (F.np && !F.npPaid ? F.np * .85 : 0) + (F.mezz && !F.mezzPaid ? F.mezz : 0) : 0;
  const t = _fc(f, why, god); if (owe > 0) { c.cash -= owe; F.npPaid = F.mezzPaid = 1; F.log.push({ w: S.week, t: `The pickup and mezzanine lenders are repaid ${fmtM(owe)}.`, tone: 'bad' }); return t + ` The pickup and mezzanine lenders take back ${fmtM(owe)}.`; }
  return t; }; }
