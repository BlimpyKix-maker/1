// ---------------- The Bourse, the economy and the bank, grown up ----------------
// One market: every listed company in the game, studios and labels and networks and streamers and theatres, in a
// single table you can filter by industry and sort however you like. Tips come from somewhere: people you actually
// know (and what they'd know), published analysts, tracking surveys and plain hearsay, and every source keeps a
// track record you can check. The economy page says what the weather in the markets means for you. The bank grows a
// private side once you're worth something: a credit line against your portfolio, and the angels and family offices
// who put money into films, if you can get a meeting and make the case.

// ---- one market ----
function mktRows() {
  const M = S.me, rows = [];
  for (const c of listedCos()) rows.push({ k: 'c' + c.id, co: c.id, tk: tickerOf(c), name: c.name, ind: 'Film studios', px: mktPrice(c), d1: chg(c, 1), d52: chg(c, 52), cap: mcap(c), y: c.tier === 1 ? 2.4 : 0, own: (M.port || {})[c.id] || 0, spark: spark(c) });
  for (const s of SECTORS.map(x => SECTOR[x[0]]).filter(sectorOpen)) rows.push({ k: 's' + s.k, sk: s.k, tk: s.tk, name: s.name, ind: s.sec, px: sectorPrice(s), d1: sChg(s, 1), d52: sChg(s, 52), cap: null, y: sYield(s) * 100, own: (M.sport || {})[s.k] || 0, spark: sSpark(s), s });
  return rows;
}
function allMarketHTML() {
  const T = UI.mkt, M = S.me, R = mktRows(), inds = {}; for (const r of R) inds[r.ind] = (inds[r.ind] || 0) + 1;
  const f = UI.mkf || 'all', srt = UI.mks || 'cap', q = (UI.mkq || '').toLowerCase().trim();
  let L = R.filter(r => (f === 'all' || r.ind === f) && (!q || r.tk.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)));
  const key = { cap: r => r.cap ?? r.px * 2, d1: r => r.d1, d52: r => r.d52, px: r => r.px, y: r => r.y, name: r => r.name };
  L.sort((a, b) => srt === 'name' ? a.name.localeCompare(b.name) : key[srt](b) - key[srt](a));
  const movers = R.slice().sort((a, b) => b.d1 - a.d1), byInd = Object.keys(inds).map(k => { const G = R.filter(r => r.ind === k); return [k, G.reduce((t, r) => t + r.d52, 0) / G.length]; }).sort((a, b) => b[1] - a[1]);
  const trade = r => r.co !== undefined ? `<button class="btn-s" data-mkt="buy:${r.co}">Buy</button>${r.own ? ` <button class="btn-s ghost" data-mkt="sell:${r.co}">Sell</button>` : ''}` : `<button class="btn-s" data-sec="buy:${r.sk}">Buy</button>${r.own ? ` <button class="btn-s ghost" data-sec="sell:${r.sk}">Sell</button>` : ''}`;
  const nm = r => r.co !== undefined ? `<a href="#" class="lk" data-mkt="sel:${r.co}"><b>${esc(r.tk)}</b></a>` : `<b>${esc(r.tk)}</b>`;
  return `<div class="mk-sum"><div><span class="muted small">Best industry this year</span><b>${esc(byInd[0][0])} ${pctS(byInd[0][1])}</b></div><div><span class="muted small">Worst</span><b>${esc(byInd[byInd.length - 1][0])} ${pctS(byInd[byInd.length - 1][1])}</b></div><div><span class="muted small">Top movers this week</span><b class="small">${movers.slice(0, 3).map(r => `${esc(r.tk)} ${pctS(r.d1)}`).join(' · ')}</b></div></div>
   <div class="filt"><label class="filt-q"><span>Search</span><input id="mkq" type="search" placeholder="Ticker or company…" value="${esc(UI.mkq || '')}"></label><label><span>Industry</span>${sel('mk-ind', [['all', `Everything (${R.length})`], ...Object.entries(inds).sort((a, b) => b[1] - a[1]).map(([k, n]) => [k, `${k} (${n})`])], f)}</label><label><span>Sort</span>${sel('mk-sort', [['cap', 'Biggest'], ['d1', 'This week'], ['d52', 'This year'], ['y', 'Dividend yield'], ['px', 'Price'], ['name', 'Name']], srt)}</label><label><span>Shares a trade</span><input id="mkt-q" type="number" min="1" value="${T.q || 10}"></label></div>
   <div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th>Industry</th><th>6M</th><th class="n">Price</th><th class="n">1W</th><th class="n">1Y</th><th class="n">Yield</th><th class="n">Own</th><th></th></tr></thead><tbody>${L.slice(0, 120).map(r => `<tr><td>${nm(r)}</td><td class="small">${esc(r.name)}</td><td class="small muted">${esc(r.ind)}</td><td>${r.spark}</td><td class="n">$${r.px.toFixed(2)}</td><td class="n">${pctS(r.d1)}</td><td class="n">${pctS(r.d52)}</td><td class="n small">${r.y ? r.y.toFixed(1) + '%' : '–'}</td><td class="n">${r.own || ''}</td><td>${trade(r)}</td></tr>`).join('')}</tbody></table></div>
   <p class="small muted">${L.length} listings${L.length > 120 ? ', showing 120' : ''}. Studio tickers open their own page. Every company pays its dividend quarterly where it has one.</p>`;
}
function mktChange(e) { const id = e.target.id, v = e.target.value; if (id === 'mk-ind') { UI.mkf = v; render(true); return true; } if (id === 'mk-sort') { UI.mks = v; render(true); return true; } if (id === 'mkq') { UI.mkq = v; render(true); return true; } return false; }

// ---- tips that come from somewhere ----
const ANALYSTS = ['Barnum & Wexley', 'Strand Securities', 'Quayle Partners', 'Mercer Hollis', 'Lindqvist Capital'];
const TIP_KIND = { insider: ['🤫', 'Someone on the film', .86], informed: ['🎬', 'Someone in the business', .66], analyst: ['📊', 'Analyst note', .7], tracking: ['📈', 'Tracking survey', .73], hearsay: ['💬', 'Hearsay', .47] };
function tipsThisWeek() {
  const M = S.me, out = [], r = hashRand(S.week * 2357 + 3), known = Object.keys(M.known || {}).map(Number).filter(id => P(id) && !P(id).dead);
  const up = S.films.filter(f => f.rel === null && f.stage === 3 && f.co !== null && S.companies[f.co] && S.companies[f.co].closed === null && S.companies[f.co].owner === undefined && f.stageEnd - S.week <= 4 && f.stageEnd >= S.week);
  for (let i = 0; i < 5 && up.length; i++) {
    const f = up.splice(Math.floor(r() * up.length), 1)[0], c = S.companies[f.co], q0 = f.q !== undefined ? f.q : 55, truth = q0 >= 62 ? 1 : q0 < 48 ? -1 : 0;
    const on = known.find(id => keyIds(f).includes(id)), inb = known.filter(id => P(id).hub === f.hub && opinion(id) > 0);
    const kind = on !== undefined && r() < .7 ? 'insider' : inb.length && r() < .45 ? 'informed' : ['analyst', 'tracking', 'hearsay', 'hearsay'][Math.floor(r() * 4)];
    const who = kind === 'insider' ? on : kind === 'informed' ? inb[Math.floor(r() * inb.length)] : null;
    const src = kind === 'insider' ? `${P(who).name}, who worked on it` : kind === 'informed' ? `${P(who).name}, who saw a test screening` : kind === 'analyst' ? `An analyst at ${ANALYSTS[Math.floor(r() * ANALYSTS.length)]}` : kind === 'tracking' ? 'Pre-release tracking' : pickLine(['Clapgram chatter', 'a man at the gym', 'an online forum', 'your cousin who "knows people"'], f.id);
    const rel = TIP_KIND[kind][2], right = r() < rel, claim = truth === 0 ? (r() < .5 ? 1 : -1) : right ? truth : -truth;
    const why = claim > 0 ? pickLine(['the test audience applauded at the end', 'word of mouth is building', 'the trailer numbers are huge', 'the pre-sales are strong'], f.id) : pickLine(['the test screening went badly', 'reshoots, and the studio is nervous', 'tracking is soft', 'nobody is talking about it'], f.id);
    out.push({ f: f.id, co: c.id, src, who, kind, rel, insider: kind === 'insider' ? 1 : 0, claim, why, opens: f.stageEnd });
  }
  // and one about the rest of the business: the numbers coming out next month
  const S2 = SECTORS.map(x => SECTOR[x[0]]).filter(sectorOpen); if (S2.length) { const s = S2[Math.floor(r() * S2.length)], fut = (sectorPrice(s, S.week + 4) / sectorPrice(s) - 1), kind = r() < .5 ? 'analyst' : 'hearsay', rel = TIP_KIND[kind][2], claim = (r() < rel ? 1 : -1) * (fut >= 0 ? 1 : -1);
    out.push({ s: s.k, src: kind === 'analyst' ? `An analyst at ${ANALYSTS[Math.floor(r() * ANALYSTS.length)]}` : 'A friend in the industry', kind, rel, insider: 0, claim, why: claim > 0 ? 'next month\'s numbers will beat expectations' : 'next month\'s numbers will disappoint', opens: S.week + 4 }); }
  return out;
}
function tipJudge(t) {
  if (t.s) { if (S.week < t.opens) return null; const s = SECTOR[t.s], ch = sectorPrice(s, t.opens) / sectorPrice(s, t.w) - 1; return (ch >= 0 ? 1 : -1) === t.claim; }
  const f = S.films[t.f]; if (!f || f.rel === null || S.week < f.rel + 2) return null; const truth = (f.hitRatio || 0) >= 1.4 ? 1 : (f.hitRatio || 0) < .8 ? -1 : 0; return truth === 0 ? null : truth === t.claim;
}
function tipsHTML() {
  const M = S.me, T = tipsThisWeek(); M.tipsSeen = M.tipsSeen || []; M.tipLog = M.tipLog || [];
  for (const t of T) { const k = S.week + ':' + (t.co ?? t.s); if (!M.tipsSeen.includes(k)) { M.tipsSeen.push(k); M.tipLog.push({ w: S.week, f: t.f, s: t.s, claim: t.claim, kind: t.kind, opens: t.opens }); } }
  if (M.tipsSeen.length > 60) M.tipsSeen.splice(0, M.tipsSeen.length - 60); if (M.tipLog.length > 200) M.tipLog.splice(0, M.tipLog.length - 200);
  const rec = {}; for (const t of M.tipLog) { const j = tipJudge(t); if (j === null) continue; const x = rec[t.kind] = rec[t.kind] || [0, 0]; x[1]++; if (j) x[0]++; }
  const line = t => { const k = TIP_KIND[t.kind]; if (t.s) { const s = SECTOR[t.s]; return `<li>${k[0]} <b>${esc(t.src)}</b>: ${esc(s.name)} (${esc(s.tk)}), ${esc(t.why)}. <span class="muted small">${esc(k[1])} · right about ${Math.round(t.rel * 100)}% of the time</span> <button class="linkish" data-sec="buy:${t.s}">Buy</button></li>`; }
    const f = S.films[t.f], c = S.companies[t.co]; return `<li>${k[0]} <b>${esc(t.src)}</b> says ${fl(f.id)} (${esc(tickerOf(c))}) will <b class="${t.claim > 0 ? 'good' : 'bad'}">${t.claim > 0 ? 'open big' : 'flop'}</b>: ${esc(t.why)}. <span class="muted small">Opens ${fmtDate(t.opens, true)} · ${esc(k[1])}, usually right ${Math.round(t.rel * 100)}% of the time${t.insider ? ' · <b class="bad">trading on this is insider dealing</b>' : ''}</span> <a href="#" class="lk" data-mkt="sel:${c.id}">Trade ›</a></li>`; };
  return `<p class="small muted">Where tips come from matters. People who worked on a film know the most, and trading on what they tell you is a crime the regulator does look for. Published analysts and tracking surveys are fair game. Hearsay is a coin toss with a story attached.</p>
   <ul class="plain mnews">${T.map(line).join('') || '<li class="muted">Quiet week. Nothing big opening soon.</li>'}</ul>
   <h4>Track record</h4><table class="grid small"><thead><tr><th>Source</th><th class="n">Right</th><th class="n">Called</th></tr></thead><tbody>${Object.entries(TIP_KIND).map(([k, v]) => { const x = rec[k] || [0, 0]; return `<tr><td>${v[0]} ${esc(v[1])}</td><td class="n">${x[1] ? Math.round(x[0] / x[1] * 100) + '%' : '–'}</td><td class="n">${x[1]}</td></tr>`; }).join('')}</tbody></table><p class="small muted">Tips you've seen, judged once the film opened or the numbers came out.</p>`;
}

// ---- the economy, explained ----
function economyHTML() {
  const ev = macroNow(), lvl = macroAt(S.week), lvlY = macroAt(S.week - 52), y = S.year, rate = rateAt(y), infl = (cpi(y) / cpi(y - 1) - 1) * 100, M = S.me;
  const prod = S.active.length, prodY = typeof fieldIndex === 'function' ? fieldIndex('box', S.week) / Math.max(.01, fieldIndex('box', S.week - 52)) : 1;
  const mood = lvl >= 1.08 ? 'Euphoric' : lvl >= 1.02 ? 'Bullish' : lvl >= .98 ? 'Calm' : lvl >= .9 ? 'Nervous' : 'Panic';
  const wfx = typeof worldFx === 'function' ? worldFx() : {};
  const rates = Array.from({ length: 21 }, (_, i) => [y - 20 + i, rateAt(y - 20 + i)]), rmax = Math.max(...rates.map(x => x[1]), 1);
  const advice = [];
  if (rate >= 4) advice.push('Rates are high: term deposits pay well and loans are expensive. Borrow only for something that earns more.');
  else if (rate <= 1.5) advice.push('Rates are low: savings earn little, borrowing is cheap. Good years to finance a film or buy property.');
  if (lvl < .92) advice.push('The market is in a panic. Prices are low for everyone, including good companies; patient money does well here.');
  if (lvl > 1.08) advice.push('The market is euphoric. Prices are stretched: a good time to take some profit, not to borrow to buy.');
  if (infl > 4) advice.push(`Inflation is running at ${infl.toFixed(1)}%: cash in a current account is quietly shrinking.`);
  if ((wfx.jobs || 1) < 1) advice.push('Fewer productions are hiring: apply widely, and keep side income going.');
  if ((wfx.jobs || 1) > 1) advice.push('Productions are hiring: a good moment to push for better jobs and better rates.');
  if (!advice.length) advice.push('Nothing unusual. Spread your money: some saved, some invested, some for the next opportunity.');
  return `<div class="kpis mini"><div><span>Interest rate</span><b>${rate.toFixed(2)}%</b></div><div><span>Inflation</span><b>${infl.toFixed(1)}%</b></div><div><span>Market mood</span><b class="${lvl >= 1 ? 'good' : 'bad'}">${mood}</b></div><div><span>Market, 1 year</span><b>${pctS((lvl / lvlY - 1) * 100)}</b></div><div><span>Box office, 1 year</span><b>${pctS((prodY - 1) * 100)}</b></div><div><span>Films in production</span><b>${prod.toLocaleString()}</b></div></div>
   <div class="cols two"><section><h4>What it means for you</h4><ul class="plain small">${advice.map(a => `<li>💡 ${esc(a)}</li>`).join('')}</ul>
    <h4>In the news</h4>${ev.length ? `<ul class="plain small">${ev.map(e => `<li><b>${esc(e.name)}</b> <span class="muted">${esc(e.d)}</span></li>`).join('')}</ul>` : '<p class="small muted">No big story moving the market right now.</p>'}</section>
   <section><h4>Interest rates, twenty years</h4><div class="eco-bars">${rates.map(([yy, v]) => `<div title="${yy}: ${v.toFixed(2)}%"><i style="height:${Math.round(v / rmax * 100)}%"></i><small>${yy % 5 === 0 ? yy : ''}</small></div>`).join('')}</div>
    <p class="small muted">Savings ${savRate().toFixed(2)}% · 1-year deposit ${cdRate(52).toFixed(2)}% · your loan rate ${loanRate(M).toFixed(1)}%.</p></section></div>`;
}

// ---- the bank's private side ----
function sblLimit(M) { const nw = osNetWorth(); return Math.max(0, Math.round(nw.shares * .5)); }
// the people with money who back films
function angelsOf(hub) {
  const r = hashRand(HUB_IDS.indexOf(hub) * 9973 + 5), N = NAMES[HUBS[hub].lang] || NAMES.en, out = [], kinds = ['Family office', 'Tech founder', 'Hedge-fund manager', 'Old money', 'Retired studio head', 'Real-estate heir', 'Music mogul', 'Sports star'];
  const pk = L => L[Math.floor(r() * L.length)];
  for (let i = 0; i < 8; i++) { const g = r() < .5 ? 'M' : 'F', name = `${pk(N[g] || N.M)} ${pk(N.L)}`, likes = Object.keys(AMB).sort(() => r() - .5).slice(0, 2), worth = Math.round((20 + Math.pow(r(), 2) * 1500)) * 1e6;
    out.push({ i, name, kind: kinds[Math.floor(r() * kinds.length)], worth, likes, appetite: .3 + r() * .6, ticket: Math.round((.1 + r() * .9) * Math.min(worth * .01, 5e6) / 5e4) * 5e4 }); }
  return out;
}
function angelAct(a) {
  const M = S.me, me = ME(), c = typeof myCo === 'function' ? myCo() : null, A = angelsOf(M.hub)[+a.i]; if (!A || !c || c.closed !== null) return false;
  M.angelTry = M.angelTry || {}; if (S.week - (M.angelTry[A.i] ?? -999) < 26) return false; M.angelTry[A.i] = S.week;
  const nw = osNetWorth().total, dc = Math.round(clamp(18 - me.standing / 12 - c.hits * 2 - (nw > usd(1e6) ? 1 : 0) - A.appetite * 4 - ((M.love || []).some(g => A.likes.includes(g)) ? 1 : 0), 6, 19));
  const ok = roll('fin', dc), amt = usd(A.ticket);
  if (ok) { (M.angelFund = M.angelFund || []).push({ who: A.name, amt, w: S.week }); inbox('note', `${A.name} is in`, `Lunch runs to four hours. ${A.name} (${A.kind.toLowerCase()}) commits ${fmtCash(amt)} to your company's next film, for a share of what it earns. It's waiting when you greenlight.`, { result: { ok, roll: M.lastRoll, t: 'Committed.' } }); milestone(`${A.name} backs your next film`, 'work'); }
  else inbox('note', `${A.name} passes`, `"I like you. I don't like the risk." ${A.name} will take another meeting in six months, after your next hit.`, { result: { ok, roll: M.lastRoll, t: 'A pass.' } });
  return true;
}
// committed angel money goes into the next film's equity
function takeAngels() { const M = S.me, L = M.angelFund || []; if (!L.length) return 0; const t = L.reduce((s, x) => s + x.amt, 0); M.angelFund = []; return t; }
function privateBankHTML() {
  const M = S.me, B = bankOf(M), nw = osNetWorth(), lim = sblLimit(M), c = typeof myCo === 'function' ? myCo() : null, A = angelsOf(M.hub);
  const angels = A.map(a => { const wait = S.week - ((M.angelTry || {})[a.i] ?? -999) < 26; return `<tr><td><b>${esc(a.name)}</b><br><span class="muted small">${esc(a.kind)}</span></td><td class="n small">${fmtM(a.worth / 1e6)}</td><td class="small">${a.likes.map(esc).join(', ')}</td><td class="n small">${fmtCash(usd(a.ticket))}</td><td>${c && c.closed === null ? `<button class="btn-s ghost" data-angel="${a.i}" ${wait ? 'disabled' : ''}>${wait ? 'Recently met' : 'Ask for a meeting'}</button>` : '<span class="muted small">Needs a company</span>'}</td></tr>`; }).join('');
  return `<div class="os-grid">${osCard('Securities-backed credit', `<p class="small">Borrow against your shares at ${(rateAt(S.year) + 1.5).toFixed(1)}%, up to half their value: ${fmtCash(lim)} available. If the market falls far enough, the bank sells your shares to cover it.</p><div class="bank-f"><button class="os-btn" data-bank="sbl" ${lim < 1000 ? 'disabled' : ''}>Draw ${fmtCash(Math.min(lim, Math.round(+UI.bkamt || 0)))} from the line</button></div>${B.sbl ? `<p class="small">Drawn: <b>${fmtCash(Math.round(B.sbl))}</b>. Interest comes out weekly; repay with the Repay button on Borrowing.</p>` : ''}`)}
   ${osCard('Committed to your next film', (M.angelFund || []).length ? `<ul class="os-list">${M.angelFund.map(x => `<li><b>${esc(x.who)}</b><span>${fmtCash(x.amt)}</span></li>`).join('')}</ul><p class="small muted">It goes into the equity when you greenlight, and they take a share of what the film earns.</p>` : '<p class="small muted">Nothing committed yet.</p>')}</div>
   <h4>Angels and family offices in ${esc(hubName(M.hub))}</h4><p class="small muted">${nw.total >= usd(250000) || ME().standing >= 35 ? 'They\'ll take your call.' : 'They\'ll take your call when you\'re worth more or better known; you can still try.'} Each puts a cheque into a film they believe in, for a share of what it earns. The case you make rolls your Finance; hits, standing and shared taste help.</p>
   <div class="tw"><table class="grid small"><thead><tr><th>Who</th><th class="n">Worth</th><th>Likes</th><th class="n">Usual cheque</th><th></th></tr></thead><tbody>${angels}</tbody></table></div>`;
}
function fin2Click(t) { if (t.dataset.angel !== undefined) { const n0 = S.me.rollN || 0; doAct({ t: 'angel', i: +t.dataset.angel }); render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll); return true; } return false; }
