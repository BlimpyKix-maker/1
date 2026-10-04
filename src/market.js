// ---------------- The Bourse: a stock market you can believe ----------------
// Weekly prices for every listed studio. The anchor is the company's real value from the simulation (cash, library,
// slate, hits), marked monthly; between marks the price wanders with its own volatility, jumps when a film opens big
// or bombs, and moves on quarterly earnings when the cash pile grows or shrinks. Everything is a pure function of
// the world, cached per company and week, so the app opens instantly and replays agree.
const MKT = { cache: new Map(), S: null };
function mktReset() { if (MKT.S !== S) { MKT.cache = new Map(); MKT.S = S; MKT.listed = null; MKT.lw = -1; } }
function listedCos() { mktReset(); if (MKT.listed && MKT.lw === S.week) return MKT.listed; MKT.lw = S.week; return MKT.listed = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier <= 2); }
function volOf(c) { return [0, .022, .038, .06][c.tier] * (.8 + hashRand(c.id * 71 + 3)() * .5); }
// the fundamental: the monthly mark nearest at or before week w (marks are monthly, newest last)
function libMap() { mktReset(); if (MKT.lib && MKT.libW === S.week) return MKT.lib; const lib = {}; for (const f of S.films) if (f.owner !== null && f.owner !== undefined && f.rel !== null && S.week - f.rel < 520) lib[f.owner] = (lib[f.owner] || 0) + libValue(f, S.year); MKT.libW = S.week; return MKT.lib = lib; }
function anchorAt(c, w) { const h = c.hist || []; if (!h.length) return companyWorth(c, libMap()); const back = Math.floor((S.week - w) / 4.35); return h[Math.max(0, h.length - 1 - back)]; }
// what moved this company this week: openings and earnings
function eventsAt(c, w) {
  const out = [];
  for (const i of c.films.slice(-40)) { const f = S.films[i]; if (f && f.rel === w && f.rel <= S.week) { const r = f.hitRatio || 1; out.push([f.title + (r > 2 ? ' opens big' : r < .7 ? ' bombs' : ' opens'), clamp((Math.log2(Math.max(.1, r))) * .05 * (f.budget / Math.max(1, anchorAt(c, w) * .1)) ** .3, -.12, .14)]); } }
  if (w % 13 === 7) { const h = c.hist || [], a = h[h.length - 1 - Math.floor((S.week - w) / 4.35)] || 1, b = h[h.length - 4 - Math.floor((S.week - w) / 4.35)] || a, g = (a - b) / Math.max(.1, b); out.push([g >= 0 ? 'Earnings beat' : 'Earnings miss', clamp(g * .5, -.08, .08)]); }
  return out;
}
function mktBar(c, w) {
  mktReset();
  const k = c.id + ':' + w + ':' + (c.hist || []).length;
  if (MKT.cache.has(k)) return MKT.cache.get(k);
  const r = hashRand(c.id * 7919 + w * 31), v = volOf(c), anchor = anchorAt(c, w) / sharesOf(c);
  // noise: a slow mean-reverting wander (sum of a few weekly shocks) plus this week's shock and its events
  let wander = 0; for (let i = 0; i < 6; i++) wander += (hashRand(c.id * 7919 + (w - i) * 31)() - .5) * v * (1 - i / 7);
  const ev = eventsAt(c, w), jump = ev.reduce((s, e) => s + e[1], 0);
  const close = Math.max(.05, anchor * (1 + wander + jump) * (typeof macroAt === 'function' ? Math.pow(macroAt(w), betaOf(c)) : 1)), open = Math.max(.05, close / (1 + (r() - .5) * v * 1.4 + jump));
  const high = Math.max(open, close) * (1 + r() * v * .6), low = Math.min(open, close) * (1 - r() * v * .6), vol = Math.round(sharesOf(c) * 1e6 * (.004 + r() * .01 + Math.abs(jump) * .2));
  const o = { w, o: open, c: close, h: high, l: low, v: vol, ev };
  MKT.cache.set(k, o); return o;
}
function mktPrice(c, w = S.week) { return mktBar(c, w).c; }
function chg(c, n) { const a = mktPrice(c, S.week - n), b = mktPrice(c); return (b / a - 1) * 100; }
function mcap(c) { return mktPrice(c) * sharesOf(c); }   // millions
function indexVal(w) { const L = listedCos(); return L.length ? L.reduce((s, c) => s + mktPrice(c, w) * sharesOf(c), 0) / 10 : 0; }
// ---- trading ----
function tradeAct(a) {
  const M = S.me, c = S.companies[a.co]; if (!c || c.closed !== null) return false;
  const px = mktPrice(c), n = Math.round(a.n), fee = 5;
  M.port = M.port || {}; M.portCost = M.portCost || {};
  if (n > 0) { const cost = Math.round(px * n) + fee; if (M.cash < cost || px <= 0) return false; M.cash -= cost; M.port[a.co] = (M.port[a.co] || 0) + n; M.portCost[a.co] = (M.portCost[a.co] || 0) + cost; }
  else { const have = M.port[a.co] || 0, k = Math.min(have, -n); if (!k) return false; M.cash += Math.round(px * k) - fee; M.portCost[a.co] = Math.round((M.portCost[a.co] || 0) * (have - k) / have); M.port[a.co] = have - k; }
  (M.trades = M.trades || []).push({ w: S.week, co: a.co, n: n > 0 ? n : -Math.min(M.port[a.co] + (-n), -n), px: +px.toFixed(2) }); if (M.trades.length > 60) M.trades.shift();
  if (n > 0 && typeof noteInsider === 'function') noteInsider(a.co, n);
  return true;
}
// dividends from the big studios, each quarter
function stockWeek() {
  const M = S.me; if (!M.port || S.week % 13 !== 0) return;
  let tot = 0; for (const id in M.port) { const n = M.port[id], c = S.companies[+id]; if (!n || !c || c.closed !== null || c.tier !== 1 || c.cash <= 0) continue; tot += Math.round(mktPrice(c) * n * .006); }
  if (tot > 0) { M.cash += tot; mail('news', 'Your broker', 'Dividends paid', `Quarterly dividends from your studio shares: ${fmtCash(tot)}.`); }
}
// ---- charts ----
function candles(c, n = 40, W = 560, H = 180) {
  const B = Array.from({ length: n }, (_, i) => mktBar(c, S.week - (n - 1 - i))), hi = Math.max(...B.map(b => b.h)), lo = Math.min(...B.map(b => b.l)), y = v => 8 + (hi - v) / Math.max(1e-6, hi - lo) * (H - 30), cw = W / n;
  const vmax = Math.max(...B.map(b => b.v));
  return `<svg class="candles" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Price chart">${[0, .5, 1].map(t => `<line x1="0" x2="${W}" y1="${8 + t * (H - 30)}" y2="${8 + t * (H - 30)}" stroke="var(--line)"/><text x="${W - 2}" y="${6 + t * (H - 30)}" text-anchor="end" font-size="9" fill="var(--muted)">$${(hi - t * (hi - lo)).toFixed(2)}</text>`).join('')}
   ${B.map((b, i) => { const x = i * cw + cw / 2, up = b.c >= b.o, col = up ? 'var(--good)' : 'var(--bad)'; return `<g><title>${fmtDate(b.w, true)}: open $${b.o.toFixed(2)}, close $${b.c.toFixed(2)}${b.ev.length ? ' · ' + b.ev.map(e => e[0]).join(', ') : ''}</title><rect x="${x - cw * .35}" y="${H - 18 - 14 * b.v / vmax}" width="${cw * .7}" height="${14 * b.v / vmax}" fill="var(--muted)" opacity=".25"/><line x1="${x}" x2="${x}" y1="${y(b.h)}" y2="${y(b.l)}" stroke="${col}"/><rect x="${x - cw * .3}" y="${y(Math.max(b.o, b.c))}" width="${cw * .6}" height="${Math.max(1, Math.abs(y(b.o) - y(b.c)))}" fill="${col}"/>${b.ev.length ? `<circle cx="${x}" cy="${y(b.h) - 6}" r="3" fill="var(--accent)"/>` : ''}</g>`; }).join('')}</svg>`;
}
function spark(c, n = 26, W = 80, H = 22) { const P0 = Array.from({ length: n }, (_, i) => mktPrice(c, S.week - (n - 1 - i))), hi = Math.max(...P0), lo = Math.min(...P0), up = P0[n - 1] >= P0[0]; return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><polyline fill="none" stroke="${up ? 'var(--good)' : 'var(--bad)'}" stroke-width="1.5" points="${P0.map((v, i) => `${(i / (n - 1) * W).toFixed(1)},${(2 + (hi - v) / Math.max(1e-6, hi - lo) * (H - 4)).toFixed(1)}`).join(' ')}"/></svg>`; }
const pctS = v => `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '▲' : '▼'}${Math.abs(v).toFixed(1)}%</span>`;
// ---- the app ----
function marketApp() {
  const M = S.me, T = UI.mkt = UI.mkt || { tab: 'market', sel: null, q: 10 }, L = listedCos();
  const idx = indexVal(S.week), idxW = indexVal(S.week - 1) || idx || 1, idxY = indexVal(S.week - 52) || idx || 1;
  const tabs = [['market', '📈 All markets'], ['studios', '🎬 Studios only'], ['watch', '★ Watchlist'], ['port', 'Portfolio'], ['tips', '💬 Tips'], ['econ', 'Economy'], ['news', 'Market news']];
  const head = `<div class="bourse-h"><span class="bourse-logo">BOURSE</span><span><b>BOX-50</b> ${idx.toFixed(1)} ${pctS((idx / idxW - 1) * 100)} <span class="muted small">1Y ${pctS((idx / Math.max(1e-6, idxY) - 1) * 100)}</span></span>${[['box', '🎬 Box office'], ['music', '🎵 Music'], ['video', '📺 Online video'], ['pod', '🎙️ Podcasts']].map(([k, l]) => { const a = fieldIndex(k, S.week - 4), b = fieldIndex(k, S.week); return a > 0 ? `<span class="small">${l} ${pctS((b / a - 1) * 100)}</span>` : ''; }).join('')}</div>
   <div class="bf-row">${tabs.map(([k, l]) => `<button class="pill${T.tab === k ? ' on' : ''}" data-mkt="tab:${k}">${l}</button>`).join('')}</div>`;
  if (T.sel !== null && S.companies[T.sel]) return head + stockPage(S.companies[T.sel]);
  const row = c => { const n = (M.port || {})[c.id] || 0, star = (M.watch || []).includes(c.id); return `<tr><td><button class="linkish" data-mkt="star:${c.id}" title="Watchlist">${star ? '★' : '☆'}</button> <a href="#" class="lk" data-mkt="sel:${c.id}"><b>${esc(tickerOf(c))}</b></a></td><td class="small">${esc(c.name)}</td><td>${spark(c)}</td><td class="n" data-v="${mktPrice(c)}">$${mktPrice(c).toFixed(2)}</td><td class="n" data-v="${chg(c, 1)}">${pctS(chg(c, 1))}</td><td class="n" data-v="${chg(c, 13)}">${pctS(chg(c, 13))}</td><td class="n" data-v="${chg(c, 52)}">${pctS(chg(c, 52))}</td><td class="n" data-v="${mcap(c)}">${fmtM(mcap(c))}</td><td class="n">${n || ''}</td></tr>`; };
  const table = list => `<div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th>6M</th><th class="n">Price</th><th class="n">1W</th><th class="n">3M</th><th class="n">1Y</th><th class="n">Mkt cap</th><th class="n">Own</th></tr></thead><tbody>${list.map(row).join('') || '<tr><td colspan="9" class="empty">Nothing here yet.</td></tr>'}</tbody></table></div>`;
  if (T.tab === 'watch') return head + table(L.filter(c => (M.watch || []).includes(c.id)));
  if (T.tab === 'sectors' && typeof sectorsHTML === 'function') return head + sectorsHTML();
  if (T.tab === 'tips' && typeof tipsHTML === 'function') return head + tipsHTML();
  if (T.tab === 'econ' && typeof economyHTML === 'function') return head + economyHTML();
  if (T.tab === 'port') {
    const pos = Object.entries(M.port || {}).filter(([, n]) => n > 0).map(([id, n]) => [S.companies[+id], n]), val = pos.reduce((t, [c, n]) => t + mktPrice(c) * n, 0), cost = pos.reduce((t, [c]) => t + ((M.portCost || {})[c.id] || 0), 0);
    return head + `<div class="kpis mini"><div><span>Value</span><b>${fmtCash(Math.round(val))}</b></div><div><span>Cost</span><b>${fmtCash(Math.round(cost))}</b></div><div><span>Gain</span><b class="${val >= cost ? 'good' : 'bad'}">${fmtCash(Math.round(val - cost))}</b></div><div><span>Cash</span><b>${fmtCash(M.cash)}</b></div></div>
     <div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th class="n">Shares</th><th class="n">Avg cost</th><th class="n">Price</th><th class="n">Value</th><th class="n">Gain</th></tr></thead><tbody>${pos.map(([c, n]) => { const cst = (M.portCost || {})[c.id] || 0, v = mktPrice(c) * n; return `<tr><td><a href="#" class="lk" data-mkt="sel:${c.id}">${esc(tickerOf(c))}</a></td><td class="n">${n}</td><td class="n">$${(cst / n).toFixed(2)}</td><td class="n">$${mktPrice(c).toFixed(2)}</td><td class="n">${fmtCash(Math.round(v))}</td><td class="n ${v >= cst ? 'good' : 'bad'}">${fmtCash(Math.round(v - cst))} (${((v / Math.max(1, cst) - 1) * 100).toFixed(1)}%)</td></tr>`; }).join('') || '<tr><td colspan="6" class="empty">No positions. Pick a stock in the Market tab.</td></tr>'}</tbody></table></div>
     ${typeof sectorsHeldHTML === 'function' ? sectorsHeldHTML() : ''}
     ${(M.trades || []).length ? `<h4>Recent trades</h4><ul class="plain small">${M.trades.slice(-8).reverse().map(t => `<li>${fmtDate(t.w, true)} · ${t.n > 0 ? 'Bought' : 'Sold'} ${Math.abs(t.n)} ${esc(tickerOf(S.companies[t.co]))} at $${t.px}</li>`).join('')}</ul>` : ''}`;
  }
  if (T.tab === 'news') { const N = []; for (const c of L) for (let w = S.week; w > S.week - 8; w--) for (const e of mktBar(c, w).ev) N.push([w, c, e]); N.sort((a, b) => b[0] - a[0] || Math.abs(b[2][1]) - Math.abs(a[2][1])); return head + `<ul class="plain small mnews">${N.slice(0, 30).map(([w, c, e]) => `<li><span class="muted">${fmtDate(w, true)}</span> <a href="#" class="lk" data-mkt="sel:${c.id}"><b>${esc(tickerOf(c))}</b></a> ${pctS(e[1] * 100)} · ${esc(e[0])}</li>`).join('') || '<li class="muted">A quiet market.</li>'}</ul>`; }
  if (T.tab === 'market' && typeof allMarketHTML === 'function') return head + allMarketHTML();
  const movers = L.map(c => [c, chg(c, 1)]).sort((a, b) => b[1] - a[1]);
  return head + `<p class="small">Top movers: ${movers.slice(0, 3).map(([c, v]) => `<a href="#" class="lk" data-mkt="sel:${c.id}">${esc(tickerOf(c))}</a> ${pctS(v)}`).join(' · ')} — ${movers.slice(-3).reverse().map(([c, v]) => `<a href="#" class="lk" data-mkt="sel:${c.id}">${esc(tickerOf(c))}</a> ${pctS(v)}`).join(' · ')}</p>` + table(L.slice().sort((a, b) => mcap(b) - mcap(a)).slice(0, 40));
}
function stockPage(c) {
  const M = S.me, n = (M.port || {})[c.id] || 0, px = mktPrice(c), q = UI.mkt.q || 10, b = mktBar(c, S.week), recent = c.films.map(i => S.films[i]).filter(f => f && f.rel !== null && S.week - f.rel < 26).sort((a, b2) => b2.rel - a.rel).slice(0, 4), slate = c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage >= 0).length;
  const maxBuy = Math.floor((M.cash - 5) / px);
  return `<p><button class="linkish" data-mkt="sel:">‹ All stocks</button></p><div class="stockh"><div><h3>${esc(tickerOf(c))} <span class="muted small">${esc(c.name)}</span></h3><p class="big">$${px.toFixed(2)} ${pctS(chg(c, 1))}</p><p class="small muted">Week range $${b.l.toFixed(2)}–$${b.h.toFixed(2)} · volume ${b.v.toLocaleString()} · market cap ${fmtM(mcap(c))} · ${['', 'major', 'mid-size', 'small'][c.tier]} · ${esc(hubName(c.hub))}</p></div>
   <div class="trade"><label class="small">Shares <input id="mkt-q" type="number" min="1" value="${q}"></label> <button class="btn-s" data-mkt="buy:${c.id}" ${maxBuy < 1 ? 'disabled' : ''}>Buy</button> <button class="btn-s ghost" data-mkt="buymax:${c.id}" ${maxBuy < 1 ? 'disabled' : ''}>Max (${Math.max(0, maxBuy)})</button>${n ? ` <button class="btn-s ghost" data-mkt="sell:${c.id}">Sell</button> <button class="btn-s ghost" data-mkt="sellall:${c.id}">Sell all ${n}</button>` : ''}<p class="muted small">$5 a trade. You own ${n}.${n ? ` Worth ${fmtCash(Math.round(n * px))}.` : ''}</p></div></div>
   ${candles(c)}
   <div class="cols two"><section><h4>What's driving it</h4><ul class="plain small">${recent.map(f => `<li>${fl(f.id)} ${f.hitRatio > 2 ? '<span class="good">hit</span>' : f.hitRatio < .7 ? '<span class="bad">flop</span>' : ''} · ${fmtM(f.total)} worldwide</li>`).join('') || '<li class="muted">No recent releases.</li>'}<li>${slate} film${slate === 1 ? '' : 's'} on the slate · ${c.hits} hits all time · cash ${fmtM(c.cash)}</li><li>Next earnings: ${fmtDate(S.week + ((7 - S.week % 13) + 13) % 13, true)}</li></ul></section>
   <section><h4>Analysts</h4><p class="small">${c.cash < 0 ? 'Debt is the story. A flop could break it.' : chg(c, 52) > 20 ? 'Momentum. Priced for more hits.' : chg(c, 52) < -20 ? 'Beaten down. Value hunters circling.' : 'Steady. Watch the next opening.'} ${c.tier === 1 ? 'Pays a quarterly dividend.' : 'No dividend.'}</p><p><a href="#" class="lk" data-go="co:${c.id}">Company page ›</a></p></section></div>${typeof tradePanelHTML === 'function' ? tradePanelHTML('c' + c.id) : ''}`;
}
function marketClick(t) {
  const d = t.dataset; if (!d.mkt) return false;
  const T = UI.mkt = UI.mkt || { tab: 'market', sel: null, q: 10 }, [k, v] = d.mkt.split(':'), q = Math.max(1, Math.round(+(document.getElementById('mkt-q') || {}).value || T.q || 10)); T.q = q;
  if (k === 'tab') { T.tab = v; T.sel = null; }
  else if (k === 'sel') T.sel = v === '' ? null : +v;
  else if (k === 'star') doAct({ t: 'watch', co: +v });
  else if (k === 'buy') doAct({ t: 'trade', co: +v, n: q });
  else if (k === 'buymax') { const c = S.companies[+v]; doAct({ t: 'trade', co: +v, n: Math.floor((S.me.cash - 5) / mktPrice(c)) }); }
  else if (k === 'sell') doAct({ t: 'trade', co: +v, n: -q });
  else if (k === 'sellall') doAct({ t: 'trade', co: +v, n: -((S.me.port || {})[+v] || 0) });
  render(true); return true;
}
function watchAct(a) { const M = S.me, L = M.watch = M.watch || []; const i = L.indexOf(a.co); if (i >= 0) L.splice(i, 1); else L.push(a.co); return true; }
