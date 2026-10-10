// ---------------- The tax map and a deeper capital stack ----------------
// Where you shoot is a financing decision. Each city's production incentive refunds a share of the money spent
// there, and the rates move: every January some cities raise theirs to lure productions, some cut, a few programmes
// end and new ones open. Capped funds (Budapest, Prague, Wellington…) run dry partway through the year, and once
// they do there's no rebate until January. Shooting away from home costs travel and a local service company, local
// crews can be cheaper (or thinner), and every rebate is audited when the film comes out: a messy spend report means
// the bank wants part of its advance back.
// The stack gains two instruments:
//  - a mezzanine loan (10% of the budget, for names the money trusts), repaid with 20% before equity sees a cent;
//  - a streamer pre-buy (from 2012): a streamer buys the world outright for the budget plus a premium. No risk, no
//    box office, no upside.
// Everything random is hashed from the world seed (gH, guilds.js).
const INC_CAP = { budapest: 1, prague: 1, wellington: 1, bogota: 1, manila: 1, istanbul: 1, johannesburg: 1, warsaw: 1, helsinki: 1 };
FIN_COL.mezz = '#d0583a'; FIN_COL.stream = '#4fa3c7';
let FIN_O = null, FIN_LOC = null, LAST_PLAN = null;
{ const _io = incentiveOf; incentiveOf = function (hub, y = S.year) {
  if (FIN_LOC && S.me && hub === S.me.hub) hub = FIN_LOC;
  let r = _io(hub, y); const X = S.incX && S.incX[hub]; if (X) for (const [yy, v] of X) if (y >= yy) r = v; return r; }; }
// a capped fund closes for the year once it's spent: the week of the year it runs out (52+ = it lasts the year)
function capWeek(hub, y = S.year) { return INC_CAP[hub] ? 24 + Math.floor(gH(hub, 'cap', y) * 40) : 99; }
function capOpen(hub) { return S.week - weekOfYear(S.year) < capWeek(hub); }
function capLabel(hub) { if (!INC_CAP[hub]) return ''; const left = capWeek(hub) - (S.week - weekOfYear(S.year)); return left <= 0 ? 'fund spent until January' : left <= 8 ? 'fund nearly spent' : left > 40 ? 'capped fund' : 'capped fund, open'; }
function travelPct(loc) { const h = S.me.hub; return !loc || loc === h ? 0 : HUBS[loc].m === HUBS[h].m ? .03 : .06; }
function crewSave(loc) { if (!loc || loc === S.me.hub) return 0; const ci = h => (MARKETS[HUBS[h].m].cost || [1, 1, 1])[2] || 1; return clamp(.4 * (1 - ci(loc) / ci(S.me.hub)) * .5, 0, .06); }
function thinCrews(loc) { if (!loc || loc === S.me.hub) return 0; return ((MARKETS[HUBS[loc].m].cost || [1, 1, 1])[2] < .3 ? 1.5 : 0) + (HUBS[loc].minor ? 1 : 0); }
function mezzOK(lead) { return (lead !== undefined && lead !== null && P(lead) && typeof bankability === 'function' && bankability(P(lead)) >= 45) || ME().standing >= 50; }
function streamPrem(src, lead) { return clamp(.06 + (((src && src.score) || 60) - 60) / 300 + (lead !== undefined && lead !== null && P(lead) ? (P(lead).fame || 0) / 1000 : 0), .03, .22); }
{ const _fp = finPlan; finPlan = function (budget, o) {
  const X = Object.assign({}, FIN_O || {}, o || {}), loc = X.loc && X.loc !== S.me.hub && HUBS[X.loc] ? X.loc : null;
  FIN_LOC = loc; let plan; try { plan = _fp(budget, o); } finally { FIN_LOC = null; }
  if (loc) {
    const rb = plan.parts.find(p => p.k === 'rebate');
    if (rb && !capOpen(loc)) { plan.parts = plan.parts.filter(p => p !== rb); plan.fees = plan.fees.filter(f => !/incentive/.test(f[0])); plan.reb = 0; plan.capped = 1; }
    else if (rb) rb.label = `${hubName(loc)} production incentive (${Math.round(incentiveOf(loc) * 100)}% of local spend)`;
    plan.fees.push(['Travel, per diems and a local service company', budget * travelPct(loc)]);
    const sv = crewSave(loc); if (sv > 0) plan.fees.push(['Cheaper local crews', -budget * sv]);
    plan.loc = loc;
  }
  if (X.sv && S.year >= 2012) {
    const prem = X.prem || .08; plan.parts = [{ k: 'stream', label: `A streamer buys the world outright: the budget plus ${Math.round(prem * 100)}%`, amt: budget * (1 + prem) }];
    plan.fees = plan.fees.filter(f => !/incentive|pre-sale|bond/i.test(f[0])); plan.reb = plan.ps = plan.gap = 0; plan.bonded = false; plan.sv = budget * (1 + prem);
  } else if (X.mz) { plan.parts.push({ k: 'mezz', label: 'Mezzanine loan: repaid with 20% from the first money in, before any equity', amt: budget * .1 }); plan.mezz = budget * .1; }
  plan.feeT = plan.fees.reduce((t, x) => t + x[1], 0);
  plan.equity = Math.max(0, budget + plan.feeT - plan.parts.reduce((t, x) => t + x.amt, 0));
  LAST_PLAN = plan; return plan; }; }
{ const _sf = selfFund; selfFund = function (a) {
  const M = S.me, src = a.src === 'script' ? (M.scripts || []).find(x => x.id === a.id) : (M.holdings || []).find(x => x.id === a.id), before = src ? src.made : undefined;
  FIN_O = { loc: a.loc && HUBS[a.loc] ? a.loc : null, mz: !!a.mz && mezzOK(a.lead), sv: !!a.sv && S.year >= 2012, prem: streamPrem(src, a.lead) }; LAST_PLAN = null;
  let r; try { r = _sf(a); } finally { FIN_O = null; }
  const plan = LAST_PLAN; if (!r || !src || src.made === undefined || src.made === before || !plan) return r;
  const f = S.films[src.made]; if (!f || !f.fin) return r;
  if (plan.loc) { f.shoot = plan.loc; f.fin.loc = plan.loc; const thin = thinCrews(plan.loc); if (thin) f.qBonus = (f.qBonus || 0) - thin;
    f.fin.log.push({ w: S.week, t: `Shooting in ${hubName(plan.loc)}${plan.reb ? ` for the ${Math.round(incentiveOf(plan.loc) * 100)}% incentive` : plan.capped ? ', though its incentive fund is spent for the year' : ''}${thin ? '; the local crews are thinner than at home' : ''}.`, tone: plan.reb ? 'good' : '' }); }
  if (plan.mezz) { f.fin.mezz = plan.mezz; f.fin.log.push({ w: S.week, t: `A mezzanine lender puts in ${fmtM(plan.mezz)}, to be repaid with 20% before the equity.` }); }
  if (plan.sv) { f.streamSold = plan.sv; f.fin.sv = plan.sv; f.fin.log.push({ w: S.week, t: `Sold to a streamer outright for ${fmtM(plan.sv)}: no box office risk, and no box office.`, tone: 'good' }); milestone(`Sold ${f.title} to a streamer before a frame was shot`, 'money'); }
  return r; }; }
// at release: the incentive is audited, and the mezzanine lender is paid first
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments);
  const F = f.fin, c = f.co !== undefined && f.co !== null ? S.companies[f.co] : null; if (!F || !c) return out;
  if (F.reb && !F.audited) { F.audited = 1; const share = clamp(.86 + gH(f.id, 'audit') * .16, .8, 1);
    if (share < .985) { const back = F.reb * .9 * (1 - share); c.cash -= back; F.log.push({ w: S.week, t: `The incentive audit disallows ${Math.round((1 - share) * 100)}% of the claimed spend: ${fmtM(back)} goes back to the bank.`, tone: 'bad' }); }
    else F.log.push({ w: S.week, t: 'The incentive audit clears the spend report in full.', tone: 'good' }); }
  if (F.mezz && !F.mezzPaid) { F.mezzPaid = 1; c.cash -= F.mezz * 1.2; F.log.push({ w: S.week, t: `The mezzanine lender is repaid first: ${fmtM(F.mezz * 1.2)}.` }); }
  return out; }; }
// every January the map moves
function taxWeek() {
  if (!S.me || S.week !== weekOfYear(S.year) || S.incY === S.year) return; S.incY = S.year; S.incX = S.incX || {};
  const moved = [];
  for (const h of HUB_IDS) {
    const cur = incentiveOf(h), r = gH(h, 'inc', S.year); let v = null;
    if (cur > 0) { if (r < .06) v = Math.min(.45, cur + .05); else if (r < .11) v = Math.max(0, cur - .05); else if (r < .125) v = 0; }
    else if (S.year >= 1995 && r < .025) v = .2;
    if (v !== null && Math.abs(v - cur) > .001) { (S.incX[h] = S.incX[h] || []).push([S.year, +v.toFixed(3)]); moved.push([h, cur, v]); }
  }
  for (const [h, a, b] of moved) news('Industry', b === 0 ? `${hubName(h)} ends its production incentive.` : a === 0 ? `${hubName(h)} launches a ${Math.round(b * 100)}% production incentive to lure film shoots.` : `${hubName(h)} ${b > a ? 'raises' : 'cuts'} its production incentive to ${Math.round(b * 100)}%.`);
  const mine = moved.find(x => x[0] === S.me.hub); if (mine) inbox('note', `${hubName(mine[0])}'s incentive changes`, `${mine[2] > mine[1] ? 'Good news for anyone producing here' : 'Bad news for local producers'}: the city's production incentive goes from ${Math.round(mine[1] * 100)}% to ${Math.round(mine[2] * 100)}% this year.`);
}
// the make-film form: where to shoot, and the new instruments
{ const _mf = makeFilmForm; makeFilmForm = function (c, k, x) {
  const key = k + ':' + x.id, F = (UI.mk = UI.mk || {})[key] = UI.mk[key] || { micro: 1, dir: '', lead: '', inv: 0, rb: 1, ps: 0, gap: 0 }, lead = F.lead === '' || F.lead === undefined ? undefined : +F.lead;
  const loc = F.loc && HUBS[F.loc] && F.loc !== S.me.hub ? F.loc : null, mzOK = mezzOK(lead), svOK = S.year >= 2012, prem = streamPrem(x, lead);
  FIN_O = { loc, mz: +F.mz && mzOK, sv: +F.sv && svOK, prem }; LAST_PLAN = null;
  let h; try { h = _mf(c, k, x); } finally { FIN_O = null; }
  const plan = LAST_PLAN || {};
  const L = HUB_IDS.filter(hb => hb !== S.me.hub && incentiveOf(hb) > 0).sort((a, b) => incentiveOf(b) - incentiveOf(a)).slice(0, 16);
  const opt = hb => [hb, `${HUBS[hb].name.split(' and ')[0]} · ${Math.round(incentiveOf(hb) * 100)}%${INC_CAP[hb] ? (capOpen(hb) ? ' (capped)' : ' (spent)') : ''} · travel +${Math.round(travelPct(hb) * 100)}%${crewSave(hb) > .005 ? ` · crews −${Math.round(crewSave(hb) * 100)}%` : ''}${thinCrews(hb) ? ' · thin crews' : ''}`];
  const homeInc = Math.round(incentiveOf(S.me.hub) * 100);
  const where = `<div class="tx-row"><label>Shoot in ${sel('mk-loc-' + key, [['', `${HUBS[S.me.hub].name.split(' and ')[0]} (home) · ${homeInc}%`]].concat(L.map(opt)), F.loc || '')}</label>${loc ? `<span class="muted">${esc(capLabel(loc) || 'open fund')}${thinCrews(loc) ? ' · quality −' + thinCrews(loc) : ''}</span>` : ''}</div>`;
  const extra = `<label><input type="checkbox" data-mkfin="${key}:mz" ${+F.mz && mzOK ? 'checked' : ''} ${mzOK && !(+F.sv && svOK) ? '' : 'disabled'}> ${mzOK ? 'Mezzanine loan (10% of the budget; repaid with 20% before equity)' : 'Mezzanine loan: lenders want a bankable lead (45+) or standing 50+'}</label>
   <label><input type="checkbox" data-mkfin="${key}:sv" ${+F.sv && svOK ? 'checked' : ''} ${svOK ? '' : 'disabled'}> ${svOK ? `Sell the world to a streamer up front: budget + ${Math.round(prem * 100)}%, no box office` : 'Streamer pre-buys arrive in the 2010s'}</label>`;
  let H = h.replace('<div class="finplan small"><b>The money</b>', `$&${where}`);
  if (loc) H = H.replace(new RegExp(`<label><input type="checkbox" data-mkfin="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:rb"[\\s\\S]*?</label>`), `<label><input type="checkbox" data-mkfin="${key}:rb" ${+F.rb ? 'checked' : ''} ${incentiveOf(loc) && capOpen(loc) ? '' : 'disabled'}> ${incentiveOf(loc) && capOpen(loc) ? `Cash-flow the ${esc(hubName(loc))} incentive (${Math.round(incentiveOf(loc) * 100)}%)` : `No incentive to claim in ${esc(hubName(loc))} right now`}</label>`);
  const order = plan.sv ? 'The streamer owns it: you keep the premium, minus fees and any overrun.' : `Who's paid back first: ${['the banks (incentive, pre-sales, gap)', plan.mezz ? 'the mezzanine lender (+20%)' : '', 'equity investors', 'then the company'].filter(Boolean).join(' → ')}.`;
  H = H.replace(/(<span class="muted">Fees, bond and insurance:)/, `${extra}<span class="muted tx-order">${order}</span>$1`);
  if (plan.fees) { const pos = plan.fees.filter(f => f[1] > 0).reduce((t, f) => t + f[1], 0), neg = -plan.fees.filter(f => f[1] < 0).reduce((t, f) => t + f[1], 0);
    H = H.replace(/<span class="muted">Fees, bond and insurance: [^<.]*\./, `<span class="muted">Fees, bond, insurance and travel: ${fmtCash(Math.round(pos * 1e6))}${neg ? `; cheaper local crews save ${fmtCash(Math.round(neg * 1e6))}` : ''}.`); }
  return H; }; }
// Terminal: the incentive map
function taxPanel() {
  const W = 520, Ht = 220, X = lon => (lon + 170) / 350 * W, Y = lat => (68 - lat) / 115 * Ht, M = S.me;
  const L = HUB_IDS.filter(h => HUB_XY[h]).map(h => [h, incentiveOf(h)]);
  const dots = L.map(([h, r]) => { const [lon, lat] = HUB_XY[h], spent = INC_CAP[h] && !capOpen(h); return `<circle cx="${X(lon).toFixed(1)}" cy="${Y(lat).toFixed(1)}" r="${(2 + r * 22).toFixed(1)}" class="tx-dot${r ? '' : ' tx-none'}${spent ? ' tx-spent' : ''}${h === M.hub ? ' tx-home' : ''}"><title>${esc(HUBS[h].name)}: ${Math.round(r * 100)}%${INC_CAP[h] ? ' · ' + capLabel(h) : ''}</title></circle>`; }).join('');
  const grid = [-120, -60, 0, 60, 120].map(lon => `<line x1="${X(lon)}" y1="0" x2="${X(lon)}" y2="${Ht}"/>`).join('') + [-30, 0, 30, 60].map(lat => `<line x1="0" y1="${Y(lat)}" x2="${W}" y2="${Y(lat)}"/>`).join('');
  const top = L.filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const ch = h => { const X2 = (S.incX || {})[h]; const last = X2 && X2[X2.length - 1]; return last && last[0] === S.year ? (last[1] >= incentiveOf(h, S.year - 1) ? '<span class="up">new rate</span>' : '<span class="dn">cut</span>') : ''; };
  return `<section class="tk-p"><h4>INCENTIVE MAP <span class="tk-sub">share of local spend refunded · dot size = rate</span></h4><svg class="tx-map" viewBox="0 0 ${W} ${Ht}" width="100%"><g class="tx-grid">${grid}</g>${dots}</svg>
   <table class="tk-t"><thead><tr><th>City</th><th class="n">Rate</th><th>Fund</th><th></th></tr></thead><tbody>${top.map(([h, r]) => `<tr${h === M.hub ? ' class="tk-mine"' : ''}><td>${esc(HUBS[h].name.split(' and ')[0])}</td><td class="n">${Math.round(r * 100)}%</td><td class="tk-mut">${esc(capLabel(h) || 'open')}</td><td>${ch(h)}</td></tr>`).join('')}</tbody></table></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + taxPanel() + h.slice(i); }; }
// your films' stacks show the new money too
{ const _fs = finStackOf; finStackOf = function (f) {
  if (!f.fin || !(f.fin.mezz || f.fin.sv)) return _fs(f);
  if (f.fin.sv) return [['Streamer pre-buy', f.fin.sv, 'stream']];
  const L = _fs(f).filter(x => x[2] !== 'equity'); L.push(['Mezzanine loan', f.fin.mezz, 'mezz']); const rest = f.budget - L.reduce((s, x) => s + x[1], 0); if (rest > 0) L.push(['Your company', rest, 'equity']); return L; }; }
