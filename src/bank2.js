// ---------------- Money, managed: history, saving on autopilot, and trade prices ----------------
// The bank remembers every week: what you had, what you were worth, what came in and went out, drawn as charts.
// You can tell it to sweep a share of every good week into savings. And the business
// rewards the people in it: working professionals get trade prices on gear and courses, and the more you know, the
// more you get out of good tools (a beginner can't use a cinema lens the way a veteran can).

// ---- trade prices and what the tools give back ----
const TRADE_CATS = ['gear', 'courses', 'books', 'software', 'kit', 'drops'];
function bzDiscount() { const L = careerLevel(); return L >= 6 ? .35 : L >= 5 ? .25 : L >= 3 ? .15 : 0; }
function bzPrice(B) { const base = usd(B.price), cat = B.cat || ''; return TRADE_CATS.includes(cat) || (!cat && !B.collect) ? Math.round(base * (1 - bzDiscount())) : base; }
function bzBang() { return .6 + careerLevel() * .12; }

// ---- the week ----
function bank2Week() {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  const B = bankOf(M), nw = osNetWorth(), L = M.ledger = M.ledger || [], last = L[L.length - 1];
  const d = last ? M.cash - last.cash : 0;
  // the sweep: a share of a good week goes straight to savings
  if (M.autoSave && d > 0) { const v = Math.round(d * M.autoSave / 100); if (v > 0 && M.cash >= v) { M.cash -= v; B.sav += v; (B.hist = B.hist || []).push({ w: S.week, t: `Automatic saving: ${fmtCash(v)} (${M.autoSave}% of the week)` }); } }
  L.push({ w: S.week, cash: Math.round(M.cash), nw: nw.total, d: Math.round(d) }); if (L.length > 520) L.shift();
}
function bank2Act(a) {
  const M = S.me;
  if (a.k === 'autosave') { M.autoSave = clamp(Math.round(+a.pct || 0), 0, 75); return true; }
  return false;
}

// ---- the pages ----
function lineChart(pts, W = 560, H = 120, col = '#4a9d7f') {
  if (pts.length < 2) return '<p class="muted small">A few more weeks and there\'ll be a chart.</p>';
  const lo = Math.min(...pts), hi = Math.max(...pts), sp = hi - lo || 1, x = i => 4 + i * (W - 8) / (pts.length - 1), y = v => H - 6 - (v - lo) / sp * (H - 16);
  const zero = lo < 0 && hi > 0 ? `<line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="currentColor" opacity=".25" stroke-dasharray="3 3"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none" aria-hidden="true">${zero}<path d="${pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')} L${x(pts.length - 1)} ${H} L${x(0)} ${H} Z" fill="${col}" opacity=".12"/><path d="${pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')}" stroke="${col}" stroke-width="2" fill="none"/></svg>`;
}
function flowBars(L, W = 560, H = 80) {
  if (!L.length) return '';
  const mx = Math.max(1, ...L.map(x => Math.abs(x.d))), bw = W / L.length;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}" stroke="currentColor" opacity=".2"/>${L.map((x, i) => { const h = Math.abs(x.d) / mx * (H / 2 - 2); return `<rect x="${i * bw + 1}" y="${x.d >= 0 ? H / 2 - h : H / 2}" width="${Math.max(1, bw - 2)}" height="${h}" fill="${x.d >= 0 ? '#4a9d7f' : '#c0504d'}"><title>${fmtDate(x.w, true)}: ${x.d >= 0 ? '+' : ''}${fmtCash(x.d)}</title></rect>`; }).join('')}</svg>`;
}
function moneyHistoryHTML() {
  const M = S.me, L = (M.ledger || []).slice(-(UI.ledSpan || 52)), ins = L.filter(x => x.d > 0).reduce((t, x) => t + x.d, 0), outs = L.filter(x => x.d < 0).reduce((t, x) => t - x.d, 0);
  const spans = [[13, '3M'], [52, '1Y'], [156, '3Y'], [520, 'All']];
  return `<section class="panel"><h3>Your money over time <span class="count">${spans.map(([n, l]) => `<button class="pill${(UI.ledSpan || 52) === n ? ' on' : ''}" data-ledspan="${n}">${l}</button>`).join(' ')}</span></h3>
   <div class="kpis mini"><div><span>Net worth</span><b>${fmtCash(osNetWorth().total)}</b>${L.length > 1 ? `<small class="${L[L.length - 1].nw >= L[0].nw ? 'good' : 'bad'}">${L[L.length - 1].nw >= L[0].nw ? '+' : ''}${fmtCash(L[L.length - 1].nw - L[0].nw)} over the period</small>` : ''}</div><div><span>Good weeks</span><b class="good">${fmtCash(ins)}</b></div><div><span>Bad weeks</span><b class="bad">${fmtCash(outs)}</b></div><div><span>Auto-saving</span><b>${M.autoSave ? M.autoSave + '%' : 'off'}</b></div></div>
   <h4>Net worth</h4>${lineChart(L.map(x => x.nw))}<h4>Week by week: cash in minus cash out</h4>${flowBars(L)}
   <p class="small">Sweep ${['0', '10', '20', '30', '50'].map(p => `<button class="pill${(M.autoSave || 0) === +p ? ' on' : ''}" data-autosave="${p}">${p === '0' ? 'off' : p + '%'}</button>`).join(' ')} of every good week into savings, automatically. <span class="muted">Savings earn interest; cash in your pocket doesn't.</span></p>
   ${bzDiscount() ? `<p class="small">🏷️ Trade prices: as a working professional you get ${Math.round(bzDiscount() * 100)}% off gear, books and courses in the Bazaar, and good tools do more for someone at your level (×${bzBang().toFixed(2)}).</p>` : `<p class="small muted">🏷️ Trade prices on gear and courses start when you're a working professional (level 3).</p>`}</section>`;
}
{ const _bank = bankHTML; bankHTML = function () { return (UI.bkSplit ? '' : moneyHistoryHTML()) + _bank(); }; }
function bank2Click(t) {
  const d = t.dataset;
  if (d.ledspan) { UI.ledSpan = +d.ledspan; render(true); return true; }
  if (d.autosave !== undefined) { doAct({ t: 'bank2', k: 'autosave', pct: +d.autosave }); render(true); return true; }
  return false;
}
function bank2Change(e) { return false; }
