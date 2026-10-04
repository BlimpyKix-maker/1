// ---------------- The whole market ----------------
// Every ticker gets a page: what the company does, its chart, the numbers that matter, who runs it (clickable, with a
// full staff directory) and every way to trade it: buy, sell, sell everything, short and cover, limit orders that
// fill when the price gets there, and stop-losses that sell when it falls. Shorts pay a weekly borrow fee and are
// closed by the broker if the loss outgrows your cash (a margin call). Orders are checked as each week closes.
// Keys: 'c<id>' a listed studio, 's<k>' a sector company.
function pxOf(key) { if (key[0] === 'c') { const c = S.companies[+key.slice(1)]; return c && c.closed === null ? mktPrice(c) : 0; } const s = SECTOR[key.slice(1)]; return s && sectorOpen(s) ? sectorPrice(s) : 0; }
function holdOf(key) { const M = S.me; return key[0] === 'c' ? (M.port || {})[+key.slice(1)] || 0 : (M.sport || {})[key.slice(1)] || 0; }
function tkName(key) { if (key[0] === 'c') { const c = S.companies[+key.slice(1)]; return c ? `${tickerOf(c)} · ${c.name}` : key; } const s = SECTOR[key.slice(1)]; return s ? `${s.tk} · ${s.name}` : key; }
function tradeKey(key, n) { return key[0] === 'c' ? tradeAct({ co: +key.slice(1), n }) : sTrade({ s: key.slice(1), n }); }
const SHORT_FEE = .0008;   // a week, on the value borrowed
function shortAct(a) {
  const M = S.me, key = String(a.key || ''), n = Math.round(+a.n), px = pxOf(key); if (!/^[cs]/.test(key) || !(n > 0) || n > 1e7 || px <= 0) return false;
  M.shorts = M.shorts || {}; const sh = M.shorts[key] || { n: 0, cost: 0 };
  if (a.op === 'open') {   // borrow and sell: half the value must sit in cash as margin
    const val = px * n; if (M.cash < val * .5 + 5) return false;
    M.cash += Math.round(val) - 5; sh.n += n; sh.cost += Math.round(val); M.shorts[key] = sh;
  } else if (a.op === 'cover') {
    const k = Math.min(n, sh.n); if (!k) return false; const cost = Math.round(px * k) + 5; M.cash -= cost; sh.cost = Math.round(sh.cost * (sh.n - k) / sh.n); sh.n -= k; if (sh.n) M.shorts[key] = sh; else delete M.shorts[key];
  } else return false;
  (M.trades = M.trades || []).push({ w: S.week, key, n: a.op === 'open' ? -n : n, px: +px.toFixed(2), short: 1 }); if (M.trades.length > 80) M.trades.shift();
  return true;
}
function orderAct(a) {
  const M = S.me, L = M.orders = M.orders || [];
  if (a.op === 'cancel') { const i = L.findIndex(o => o.id === +a.id); if (i < 0) return false; L.splice(i, 1); return true; }
  const key = String(a.key || ''), n = Math.round(+a.n), lim = +a.lim, kind = ['buy', 'sell', 'stop'].includes(a.kind) ? a.kind : null;
  if (!/^[cs]/.test(key) || !kind || !(n > 0) || !(lim > 0) || n > 1e7 || L.length >= 20 || pxOf(key) <= 0) return false;
  L.push({ id: M.seq++, key, kind, n, lim: Math.round(lim * 100) / 100, w: S.week, exp: S.week + 12 }); return true;
}
// as the week closes: fill orders, charge borrow fees, call margin
function market3Week() {
  const M = S.me; if (!M) return;
  for (const o of (M.orders || []).slice()) {
    const px = pxOf(o.key), L = M.orders;
    if (px <= 0 || S.week > o.exp) { L.splice(L.indexOf(o), 1); mail('news', 'Your broker', 'Order expired', `Your ${o.kind} order for ${o.n} ${tkName(o.key)} at $${o.lim.toFixed(2)} lapsed unfilled.`); continue; }
    const hit = o.kind === 'buy' ? px <= o.lim : o.kind === 'sell' ? px >= o.lim : px <= o.lim;
    if (!hit) continue;
    const n = o.kind === 'buy' ? o.n : -Math.min(o.n, holdOf(o.key)), ok = n !== 0 && tradeKey(o.key, n);
    L.splice(L.indexOf(o), 1);
    mail('news', 'Your broker', ok ? `${o.kind === 'stop' ? 'Stop-loss' : o.kind === 'buy' ? 'Buy order' : 'Sell order'} filled` : 'Order couldn\'t fill', ok ? `${o.kind === 'buy' ? 'Bought' : 'Sold'} ${Math.abs(n)} ${tkName(o.key)} at $${px.toFixed(2)} (your trigger was $${o.lim.toFixed(2)}).` : `The price reached $${px.toFixed(2)} but ${o.kind === 'buy' ? 'there wasn\'t enough cash' : 'you no longer hold the shares'}.`);
  }
  let fee = 0; for (const key in M.shorts || {}) { const sh = M.shorts[key], px = pxOf(key); if (px <= 0) { M.cash += sh.cost; delete M.shorts[key]; continue; } fee += px * sh.n * SHORT_FEE; }
  if (fee) M.cash -= Math.round(fee);
  for (const key in M.shorts || {}) { const sh = M.shorts[key], px = pxOf(key), loss = px * sh.n - sh.cost; if (loss > 0 && loss > M.cash * .9 + sh.cost * .5) { const cost = Math.round(px * sh.n) + 5; M.cash -= cost; delete M.shorts[key]; mail('news', 'Your broker', 'Margin call', `${tkName(key)} kept rising. We closed your short of ${sh.n} at $${px.toFixed(2)} (${fmtCash(cost)}).`); } }
}
// ---- the trade panel, on every ticker page ----
function tradePanelHTML(key) {
  const M = S.me, px = pxOf(key), have = holdOf(key), sh = (M.shorts || {})[key], q = Math.max(1, Math.round(+UI.tq || 10)), orders = (M.orders || []).filter(o => o.key === key);
  const val = px * q;
  return `<section class="os-card trade2"><h5>Trade ${esc(tkName(key).split(' · ')[0])} <small>$${px.toFixed(2)} a share</small></h5>
   <div class="tr-row"><label>Shares <input id="tq" type="number" min="1" step="1" value="${q}"></label><span class="muted small">≈ ${fmtCash(Math.round(val))} · fee $5</span></div>
   <div class="tr-row"><button class="btn-s" data-tr="buy:${key}" ${M.cash < val + 5 ? 'disabled title="Not enough cash"' : ''}>Buy ${q}</button><button class="btn-s ghost" data-tr="sell:${key}" ${have ? '' : 'disabled'}>Sell ${Math.min(q, have) || q}</button><button class="btn-s ghost" data-tr="sellall:${key}" ${have ? '' : 'disabled'}>Sell all ${have || ''}</button>
    <button class="btn-s ghost" data-tr="short:${key}" title="Borrow shares and sell them now; buy back later. You profit if the price falls. Half the value must sit in cash as margin.">Short ${q}</button>${sh ? `<button class="btn-s ghost" data-tr="cover:${key}">Cover ${sh.n}</button>` : ''}</div>
   <div class="tr-row"><label>Trigger price $<input id="tlim" type="number" min="0.01" step="0.01" value="${(+UI.tlim || +(px * .95).toFixed(2)).toFixed(2)}"></label><button class="btn-s ghost" data-tr="limbuy:${key}" title="Buy automatically if the price falls to this">Limit buy</button><button class="btn-s ghost" data-tr="limsell:${key}" ${have ? '' : 'disabled'} title="Sell automatically if the price rises to this">Limit sell</button><button class="btn-s ghost" data-tr="stop:${key}" ${have ? '' : 'disabled'} title="Sell automatically if the price falls to this">Stop-loss</button></div>
   <p class="small">You hold <b>${have}</b>${have ? ` worth ${fmtCash(Math.round(have * px))}` : ''}${sh ? ` · short <b>${sh.n}</b> (${px * sh.n < sh.cost ? 'up' : 'down'} ${fmtCash(Math.abs(Math.round(sh.cost - px * sh.n)))})` : ''}.</p>
   ${orders.length ? `<ul class="os-list">${orders.map(o => `<li><span>${o.kind === 'stop' ? 'Stop-loss' : o.kind === 'buy' ? 'Limit buy' : 'Limit sell'} ${o.n} at $${o.lim.toFixed(2)}</span><span class="muted small">until ${fmtDate(o.exp, true)}</span><button class="linkish" data-tr="cancel:${o.id}">cancel</button></li>`).join('')}</ul>` : ''}
   <p class="small muted">Orders are checked as each week closes and last twelve weeks. Shorts cost ${(SHORT_FEE * 100).toFixed(2)}% a week to borrow, and the broker closes them if the loss gets bigger than your cash can cover.</p></section>`;
}
function tradeClick(t) {
  if (!S.me || !t.dataset.tr) return false;
  const [op, key] = t.dataset.tr.split(':'), q = Math.max(1, Math.round(+((document.getElementById('tq') || {}).value || UI.tq || 10))), lim = +((document.getElementById('tlim') || {}).value || 0);
  UI.tq = q; if (lim) UI.tlim = lim;
  if (op === 'buy') doAct({ t: key[0] === 'c' ? 'trade' : 'strade', co: +key.slice(1), s: key.slice(1), n: q });
  else if (op === 'sell' || op === 'sellall') { const n = op === 'sellall' ? holdOf(key) : Math.min(q, holdOf(key)); doAct({ t: key[0] === 'c' ? 'trade' : 'strade', co: +key.slice(1), s: key.slice(1), n: -n }); }
  else if (op === 'short') doAct({ t: 'short', op: 'open', key, n: q });
  else if (op === 'cover') doAct({ t: 'short', op: 'cover', key, n: ((S.me.shorts || {})[key] || {}).n || 0 });
  else if (op === 'limbuy' || op === 'limsell' || op === 'stop') doAct({ t: 'order', key, kind: op === 'limbuy' ? 'buy' : op === 'limsell' ? 'sell' : 'stop', n: op === 'limbuy' ? q : Math.min(q, holdOf(key)), lim });
  else if (op === 'cancel') doAct({ t: 'order', op: 'cancel', id: +key });
  render(true); return true;
}
// ---- a page for every sector company ----
const SECTOR_KIND = { cine: 'cinema', regal: 'cinema', pop: 'cinema', cam: 'gear', kod: 'gear', toy: 'toys', label: 'label', pipe: 'stream', ad: 'ads', vfxco: 'vfx', pod: 'podcast', gold: 'fund' };
function sectorRef(k) {
  const s = SECTOR[k]; if (!s) return null;
  if (/^mco\d+$/.test(k) && typeof coRef === 'function') { const R = coRef('m' + k.slice(3)); if (R) return R; }
  const kind = SECTOR_KIND[k] || (/^net_/.test(k) ? 'stream' : 'corp');
  return { key: 'k' + k, name: s.name, kind, tier: k === 'gold' ? 3 : 1, hub: s.hub || 'hollywood', founded: s.from };
}
function bigChart(pts, W = 560, H = 160) {
  const hi = Math.max(...pts), lo = Math.min(...pts), up = pts[pts.length - 1] >= pts[0];
  const xy = pts.map((v, i) => `${(i / (pts.length - 1) * W).toFixed(1)},${(6 + (hi - v) / Math.max(1e-6, hi - lo) * (H - 12)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none" class="bigchart"><polyline fill="none" stroke="${up ? 'var(--good)' : 'var(--bad)'}" stroke-width="2" points="${xy}"/><polygon fill="${up ? 'var(--good)' : 'var(--bad)'}" opacity=".08" points="0,${H} ${xy} ${W},${H}"/></svg>`;
}
function tickerPageHTML(k) {
  const s = SECTOR[k]; if (!s || !sectorOpen(s)) return '<div class="os-empty"><span>📉</span><b>Not listed yet</b></div>';
  const span = +UI.tspan || 52, pts = Array.from({ length: span + 1 }, (_, i) => sectorPrice(s, S.week - span + i)), R = sectorRef(k), O = typeof orgChart === 'function' ? orgChart(R) : null;
  const leaders = O ? Array.from({ length: Math.min(8, O.H) }, (_, n) => staffAt(R, n)).filter(Boolean) : [];
  const y = sYield(s) * 100, px = sectorPrice(s), M = S.me;
  return `<div class="head"><p class="eyebrow">${esc(s.sec)} · listed since ${s.from} · ${esc(s.tk)}</p><h2>${esc(s.name)}</h2><p class="lede">${esc(s.d)}</p></div>
   <div class="kpis mini"><div><span>Price</span><b>$${px.toFixed(2)}</b></div><div><span>This week</span><b>${pctS(sChg(s, 1))}</b></div><div><span>This year</span><b>${pctS(sChg(s, 52))}</b></div><div><span>5 years</span><b>${pctS(sChg(s, 260))}</b></div><div title="Cash paid to shareholders each year, as a share of the price"><span>Dividend yield</span><b>${y ? y.toFixed(1) + '% a year' : 'None'}</b></div><div title="How hard it swings with the market: above 1 swings harder, below 1 calmer, below 0 moves against it"><span>Beta</span><b>${s.beta.toFixed(1)}</b></div></div>
   <div class="np-tabs">${[[13, '3M'], [52, '1Y'], [260, '5Y'], [520, '10Y']].map(([n, l]) => `<button class="${span === n ? 'on' : ''}" data-tspan="${n}">${l}</button>`).join('')}</div>${bigChart(pts)}
   <p class="small muted">${y ? `Pays ${y.toFixed(1)}% a year in quarterly dividends: at today's price, 100 shares pay about ${fmtCash(Math.round(px * 100 * y / 100))} a year.` : 'Pays no dividend: all the return is in the price.'}</p>
   <div class="cols two"><section class="panel"><h3>Who runs it</h3><ul class="plain mn-list">${leaders.map(e => `<li class="mn-p"><div><a href="#" class="lk" data-go="emp:${e.key}~${e.n}">${esc(e.name)}</a><br><span class="muted small">${esc(e.title)} · since ${e.since}</span></div></li>`).join('')}</ul>${O ? `<p><a href="#" class="lk" data-go="staff:${R.key}">All ${O.H.toLocaleString()} staff ›</a></p>` : ''}</section>
    <div>${tradePanelHTML('s' + k)}</div></div>`;
}
function market3Click(t) {
  if (!S.me) return false;
  if (t.dataset.tspan) { UI.tspan = +t.dataset.tspan; render(true); return true; }
  return tradeClick(t);
}
