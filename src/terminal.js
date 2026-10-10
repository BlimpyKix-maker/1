// ---------------- The Terminal: your career as a trading desk ----------------
// Everything that moves, in one dense screen: what you're worth and how fast it's changing, your standing, fame,
// buzz and network as time series, the market and the box office, which genres are heating up, the best openings
// ranked by expected value, your book (positions, income, burn and runway), and the signals worth acting on.
// A ticker runs across the top of the computer, and Ctrl+K (or /) opens a command palette that goes anywhere.
// History is a weekly snapshot (`M.hist`); every number here is computed from the same state the game runs on.
function termWeek() {
  const M = S.me, me = ME(); if (!M) return;
  const nw = typeof osNetWorth === 'function' ? osNetWorth().total : M.cash;
  (M.hist = M.hist || []).push({ w: S.week, nw: Math.round(nw), cash: Math.round(M.cash), st: +me.standing.toFixed(2), fame: +(me.fame || 0).toFixed(2), buzz: Math.round(typeof starScore === 'function' ? starScore(me) : 0), known: Object.keys(M.known).length, stress: Math.round(M.stress), energy: Math.round(M.energy) });
  if (M.hist.length > 260) M.hist.shift();
}
const fmtK = v => { const a = Math.abs(v), s = v < 0 ? '−' : ''; return a >= 1e9 ? `${s}$${(a / 1e9).toFixed(2)}B` : a >= 1e6 ? `${s}$${(a / 1e6).toFixed(2)}M` : a >= 1e4 ? `${s}$${(a / 1e3).toFixed(1)}K` : `${s}$${Math.round(a).toLocaleString('en-US')}`; };
const fmtPct = v => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}%`;
function tSpark(vals, w = 96, h = 22, cls = '') {
  const L = vals.filter(v => isFinite(v)); if (L.length < 2) return `<svg class="spark ${cls}" width="${w}" height="${h}"></svg>`;
  const lo = Math.min(...L), hi = Math.max(...L), rg = hi - lo || 1, pts = L.map((v, i) => `${(i / (L.length - 1) * (w - 2) + 1).toFixed(1)},${(h - 2 - (v - lo) / rg * (h - 4)).toFixed(1)}`);
  const up = L[L.length - 1] >= L[0];
  return `<svg class="spark ${cls} ${up ? 'up' : 'dn'}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts.join(' ')}" fill="none" stroke-width="1.4"/><circle cx="${pts[pts.length - 1].split(',')[0]}" cy="${pts[pts.length - 1].split(',')[1]}" r="1.8"/></svg>`;
}
function dlt(v, f = x => x.toFixed(1)) { return `<span class="dl ${v > 0 ? 'up' : v < 0 ? 'dn' : ''}">${v > 0 ? '▲' : v < 0 ? '▼' : '•'} ${f(Math.abs(v))}</span>`; }
function histSeries(k, n = 52) { const H = (S.me.hist || []).slice(-n); return H.map(x => x[k]); }
function histDelta(k, n) { const H = S.me.hist || []; if (H.length < 2) return 0; const a = H[Math.max(0, H.length - 1 - n)][k], b = H[H.length - 1][k]; return b - a; }
function burnRate() { const H = (S.me.hist || []).slice(-9); if (H.length < 2) return 0; return (H[H.length - 1].cash - H[0].cash) / (H.length - 1); }
function postEV(p) { const o = hireOdds(p); return { o, ev: o * (p.rate || 0) * (p.days || 1) * Math.min(26, p.weeks || 4) }; }
function termKPIs() {
  const M = S.me, me = ME(), nw = osNetWorth(), burn = burnRate(), runway = burn < 0 ? Math.floor(M.cash / -burn) : null;
  const top = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead).map(id => opinion(id)).sort((a, b) => b - a).slice(0, 20), net = top.length ? top.reduce((a, b) => a + b, 0) / top.length : 0;
  const T = [
    ['NET WORTH', fmtK(nw.total), dlt(histDelta('nw', 1), fmtK), tSpark(histSeries('nw'))],
    ['CASH', fmtK(M.cash), `<span class="dl">${burn >= 0 ? '+' : '−'}${fmtK(Math.abs(burn)).replace('−', '')}/wk</span>`, tSpark(histSeries('cash'))],
    ['RUNWAY', runway === null ? '∞' : `${runway} wk`, `<span class="dl ${runway !== null && runway < 12 ? 'dn' : ''}">${runway === null ? 'cash-positive' : 'at current burn'}</span>`, ''],
    ['STANDING', me.standing.toFixed(1), dlt(histDelta('st', 4)), tSpark(histSeries('st'))],
    ['FAME', (me.fame || 0).toFixed(1), dlt(histDelta('fame', 4)), tSpark(histSeries('fame'))],
    ['BUZZ', String(Math.round(typeof starScore === 'function' ? starScore(me) : 0)), dlt(histDelta('buzz', 4), x => x.toFixed(0)), tSpark(histSeries('buzz'))],
    ['NETWORK', `${Object.keys(M.known).length}`, `<span class="dl">avg ${net >= 0 ? '+' : ''}${net.toFixed(0)} top-20</span>`, tSpark(histSeries('known'))],
    ['LEVEL', `${careerLevel()}`, `<span class="dl">${esc(LEVEL_NAME[careerLevel()] || '')}</span>`, '']
  ];
  return `<div class="tk-kpis">${T.map(([l, v, d, s]) => `<div class="tk-kpi"><span class="tk-l">${l}</span><b class="tk-v">${v}</b>${d}${s}</div>`).join('')}</div>`;
}
const TM_C = { w: -1 };
function termMarket() {
  if (typeof listedCos !== 'function') return '';
  if (TM_C.w !== S.week || TM_C.n !== S.companies.length) { TM_C.w = S.week; TM_C.n = S.companies.length; TM_C.L = listedCos().map(c => [c, mktPrice(c), chg(c, 1), chg(c, 13)]).sort((a, b) => Math.abs(b[2]) - Math.abs(a[2])).slice(0, 9); TM_C.idx = []; for (let i = 25; i >= 0; i--) TM_C.idx.push(indexVal(S.week - i)); }   // prices only move once a week
  const M = S.me, L = TM_C.L, idx = TM_C.idx;
  const iv = idx[idx.length - 1], ic = (iv / (idx[idx.length - 2] || iv) - 1) * 100;
  return `<section class="tk-p"><h4>MARKET <span class="tk-sub">AB-500 ${iv.toFixed(1)} ${dlt(ic, x => x.toFixed(2) + '%')}</span></h4>${tSpark(idx, 260, 34, 'wide')}
   <table class="tk-t"><thead><tr><th>Ticker</th><th class="n">Px</th><th class="n">1w</th><th class="n">13w</th><th class="n">You</th></tr></thead><tbody>${L.map(([c, px, d1, d13]) => `<tr><td><a href="#" class="lk" data-go="company:${c.id}">${esc(tTicker(c))}</a> <span class="tk-mut">${esc(c.name.slice(0, 18))}</span></td><td class="n">${px.toFixed(2)}</td><td class="n ${d1 >= 0 ? 'up' : 'dn'}">${fmtPct(d1)}</td><td class="n ${d13 >= 0 ? 'up' : 'dn'}">${fmtPct(d13)}</td><td class="n">${(M.port || {})[c.id] ? (M.port || {})[c.id] : ''}</td></tr>`).join('')}</tbody></table>
   <p class="tk-foot"><button class="linkish" data-app="ticker">Open the trading app ›</button></p></section>`;
}
function tTicker(c) { const w = c.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean); return (w.length > 1 ? w.map(x => x[0]).join('') : w[0] || 'XX').slice(0, 4).toUpperCase(); }
function termBox() {
  const L = S.films.filter(f => f.rel !== null && S.week - f.rel < 10 && f.rel <= S.week).map(f => { const k = S.week - f.rel; return [f, weeklyGross(f, k, null), k > 0 ? weeklyGross(f, k - 1, null) : 0, k]; }).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const mine = new Set((typeof myFilms === 'function' ? myFilms() : []).map(f => f.id));
  return `<section class="tk-p"><h4>BOX OFFICE <span class="tk-sub">this week, worldwide</span></h4><table class="tk-t"><thead><tr><th>#</th><th>Title</th><th class="n">Wk</th><th class="n">Gross</th><th class="n">Δ</th><th class="n">Cum</th></tr></thead><tbody>${L.map(([f, g, g0, k], i) => `<tr${mine.has(f.id) ? ' class="tk-mine"' : ''}><td>${i + 1}</td><td>${fl(f.id)}</td><td class="n">${k + 1}</td><td class="n">${fmtM(g)}</td><td class="n ${g >= g0 ? 'up' : 'dn'}">${k ? fmtPct((g / Math.max(.001, g0) - 1) * 100) : 'NEW'}</td><td class="n">${fmtM(f.total * Math.min(1, (k + 1) / 8))}</td></tr>`).join('')}</tbody></table></section>`;
}
function termGenres() {
  const y = S.year, by = (yy) => { const o = {}; for (const f of S.films) if (f.rel !== null && yearOf(f.rel) === yy) o[f.genre] = (o[f.genre] || 0) + (f.total || 0); return o; };
  const a = by(y), b = by(y - 1), tot = Object.values(a).reduce((s, v) => s + v, 0) || 1, totb = Object.values(b).reduce((s, v) => s + v, 0) || 1;
  const L = GENRES.map(g => [g, (a[g] || 0) / tot * 100, (b[g] || 0) / totb * 100]).filter(x => x[1] > 0 || x[2] > 0).sort((p, q) => q[1] - p[1]).slice(0, 10), mx = Math.max(...L.map(x => x[1]), 1);
  return `<section class="tk-p"><h4>GENRE HEAT <span class="tk-sub">share of ${y} grosses vs ${y - 1}</span></h4><div class="tk-bars">${L.map(([g, s, s0]) => `<div class="tk-bar"><span>${esc(g)}${S.me.love.includes(g) ? ' ♥' : ''}</span><i style="width:${(s / mx * 100).toFixed(0)}%"></i><b>${s.toFixed(1)}%</b>${dlt(s - s0, x => x.toFixed(1))}</div>`).join('')}</div></section>`;
}
function termOpps() {
  const M = S.me, B = M.board.map(p => [p, postEV(p)]).sort((a, b) => b[1].ev - a[1].ev).slice(0, 7), P0 = pending();
  return `<section class="tk-p"><h4>OPPORTUNITIES <span class="tk-sub">ranked by expected value (odds × pay × time)</span></h4><table class="tk-t"><thead><tr><th>Job</th><th class="n">Odds</th><th class="n">$/day</th><th class="n">EV</th></tr></thead><tbody>${B.map(([p, e]) => `<tr><td><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t.slice(0, 42))}</a></td><td class="n ${e.o >= .5 ? 'up' : e.o < .2 ? 'dn' : ''}">${Math.round(e.o * 100)}%</td><td class="n">${fmtCash(p.rate)}</td><td class="n">${fmtK(e.ev)}</td></tr>`).join('') || '<tr><td colspan="4" class="tk-mut">No openings on your board.</td></tr>'}</tbody></table>
   <p class="tk-foot">${P0.length ? `<b>${P0.length}</b> decision${P0.length > 1 ? 's' : ''} waiting · <button class="linkish" data-app="today">Decide ›</button>` : 'No decisions waiting.'} · <button class="linkish" data-app="work">Full board ›</button></p></section>`;
}
function termBook() {
  const M = S.me, nw = osNetWorth(), rows = [];
  const pay = M.jobs.reduce((t, j) => t + (j.rate || 0) * (j.days || 0), 0); if (pay) rows.push(['Jobs', `${M.jobs.length} running`, pay]);
  const pets = (M.pets || []).filter(p => !p.gone); if (pets.length) rows.push(['Pets', `${pets.length}`, -pets.reduce((t, p) => t + usd((PET_BY[p.kind] || {}).wk || 0), 0) - (M.petSitter ? usd(70) : 0)]);
  if (nw.shares) rows.push(['Shares', `${Object.keys(M.port || {}).length} positions`, null, nw.shares]);
  if (nw.banked) rows.push(['Bank', 'savings & CDs', null, nw.banked]);
  if (nw.things) rows.push(['Collectibles', 'kit, trophies', null, nw.things]);
  if ((M.holdings || []).length) rows.push(['Options', `${(M.holdings || []).filter(h => h.made === undefined && !h.lapsed).length} scripts held`, null, null]);
  const c = typeof myCo === 'function' ? myCo() : null; if (c && c.closed === null) rows.push([esc(c.name), `company cash`, null, Math.round(c.cash * 1e6)]);
  if ((M.resLog || []).length) rows.push(['Residuals', 'last cheque', M.resLog[M.resLog.length - 1].amt / 13]);
  if (nw.debt) rows.push(['Debt', '', null, -nw.debt]);
  return `<section class="tk-p"><h4>YOUR BOOK <span class="tk-sub">net ${fmtK(nw.total)}</span></h4><table class="tk-t"><thead><tr><th>Line</th><th></th><th class="n">Weekly</th><th class="n">Value</th></tr></thead><tbody>${rows.map(([a, b, wk, v]) => `<tr><td>${a}</td><td class="tk-mut">${esc(b)}</td><td class="n ${wk > 0 ? 'up' : wk < 0 ? 'dn' : ''}">${wk === null || wk === undefined ? '' : fmtK(wk)}</td><td class="n">${v === null || v === undefined ? '' : fmtK(v)}</td></tr>`).join('') || '<tr><td colspan="4" class="tk-mut">Nothing on the books yet.</td></tr>'}</tbody></table></section>`;
}
function termSignals() {
  const M = S.me, me = ME(), out = [];
  if (pending().length) out.push(['act', `${pending().length} decision${pending().length > 1 ? 's' : ''} waiting`, 'today']);
  if (M.stress > 70) out.push(['risk', `Stress ${Math.round(M.stress)}: performance and health at risk`, 'life']);
  if (M.energy < 25) out.push(['risk', `Energy ${Math.round(M.energy)}: rest before big checks`, 'week']);
  if (typeof ailNow === 'function' && ailNow()) out.push(['risk', `${AILMENTS[ailNow().k].label} until ${fmtDate(ailNow().until, true)}`, 'life']);
  for (const id of Object.keys(M.black || {}).slice(0, 2)) out.push(['risk', `${P(+id).name} has it in for you (−1.8 on their jobs)`, 'people']);
  for (const id of Object.keys(M.champ || {}).slice(0, 2)) out.push(['edge', `${P(+id).name} is in your corner (+0.9)`, 'people']);
  const due = Object.keys(M.known).map(Number).filter(id => M.known[id].due > 0 && P(id) && !P(id).dead); if (due.length) out.push(['edge', `${due.length} favour${due.length > 1 ? 's' : ''} owed to you`, 'people']);
  if (typeof STYLE_PATHS !== 'undefined') for (const [k, p] of Object.entries(STYLE_PATHS)) { const run = (M.pathRun || {})[k] || 0; if (!(M.paths || {})[k] && run >= STYLE_WEEKS - 5) out.push(['edge', `${p.name}: ${STYLE_WEEKS - run} weeks from unlocking`, 'standing']); }
  if ((M.opHeat || 0) > 0) out.push(['risk', `Backroom heat ${(M.opHeat || 0).toFixed(1)}: exposure risk ${((M.opHeat || 0) * 1.2).toFixed(1)}%/wk`, 'standing']);
  const c = typeof myCo === 'function' ? myCo() : null; if (c && c.closed === null && c.cash < 0) out.push(['risk', `${c.name} overdrawn by ${fmtK(-c.cash * 1e6)}`, 'create']);
  if (S.sc && S.sc.broke) { const L = Object.keys(S.sc.broke).map(Number).filter(id => M.known[id] && S.sc.broke[id] === S.year); if (L.length) out.push(['edge', `${L.length} contact${L.length > 1 ? 's' : ''} broke out this year: ask for work`, 'shorts']); }
  const mo = dateOf(S.week).getUTCMonth(); if (typeof TV_CAL !== 'undefined') out.push(['info', `TV: ${TV_CAL[mo][0].toLowerCase()}`, 'tv']);
  return `<section class="tk-p"><h4>SIGNALS</h4><ul class="tk-sig">${out.slice(0, 12).map(([k, t, app]) => `<li class="s-${k}"><button class="linkish" data-app="${app}">${esc(t)}</button></li>`).join('') || '<li class="tk-mut">All quiet.</li>'}</ul></section>`;
}
function terminalHTML() {
  if (!S.me) return '';
  const T = UI.tkTheme || 'amber';
  return `<div class="tk tk-${T}${UI.tkDense ? ' tk-dense' : ''}"><div class="tk-top"><span class="tk-brand">AB TERMINAL</span><span class="tk-sub">${esc(S.me && S.me.wk ? fmtDay(S.me.wk.day) : fmtDate(S.week, true))} · ${BLOCKS[S.me && S.me.wk ? S.me.wk.block : 0].toLowerCase()}</span><span class="tk-sp"></span>
   ${['amber', 'green', 'cyan', 'mono'].map(k => `<button class="tk-chip${T === k ? ' on' : ''}" data-tk="theme:${k}">${k}</button>`).join('')}<button class="tk-chip${UI.tkDense ? ' on' : ''}" data-tk="dense:1">dense</button><span class="tk-hint">Ctrl+K: go anywhere</span></div>
   ${termKPIs()}
   <div class="tk-grid">${termOpps()}${termSignals()}${termMarket()}${termBox()}${termGenres()}${termBook()}</div></div>`;
}
// ---- the ticker strip across the computer ----
function tickerStrip() {
  if (!S.me) return ''; const items = [];
  try {
    if (typeof indexVal === 'function') { const a = indexVal(S.week), b = indexVal(S.week - 1); items.push(`<b>AB-500</b> ${a.toFixed(1)} <i class="${a >= b ? 'up' : 'dn'}">${fmtPct((a / (b || a) - 1) * 100)}</i>`); }
    const nw = osNetWorth().total, d = histDelta('nw', 1); items.push(`<b>YOU</b> ${fmtK(nw)} <i class="${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '+' : '−'}${fmtK(Math.abs(d)).replace('−', '')}</i>`);
    items.push(`<b>STD</b> ${ME().standing.toFixed(1)} <i class="${histDelta('st', 1) >= 0 ? 'up' : 'dn'}">${histDelta('st', 1) >= 0 ? '+' : '−'}${Math.abs(histDelta('st', 1)).toFixed(2)}</i>`);
    if (typeof listedCos === 'function') for (const c of listedCos().map(c => [c, chg(c, 1)]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 6)) items.push(`<b>${esc(tTicker(c[0]))}</b> ${mktPrice(c[0]).toFixed(2)} <i class="${c[1] >= 0 ? 'up' : 'dn'}">${fmtPct(c[1])}</i>`);
    const bo = S.films.filter(f => f.rel !== null && f.rel <= S.week && S.week - f.rel < 4).map(f => [f, weeklyGross(f, S.week - f.rel, null)]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    for (const [f, g] of bo) items.push(`<b>${esc(f.title.toUpperCase().slice(0, 18))}</b> ${fmtM(g)}`);
  } catch (e) { /* the ticker never breaks a page */ }
  const row = items.map(x => `<span class="tks-i">${x}</span>`).join('<span class="tks-sep">│</span>');
  return `<div class="tks"><div class="tks-run">${row}<span class="tks-sep">│</span>${row}</div></div>`;
}
{ const _op = osPanel; osPanel = function () { const h = _op(); if (UI.noTicker) return h; const m = '<div class="os-main">', i = h.indexOf(m); return i < 0 ? h : h.slice(0, i + m.length) + `<div class="os-tickwrap">${tickerStrip()}</div>` + h.slice(i + m.length); }; }
OS_EXTRA.terminal = ['📈', 'Terminal', 'Everything that moves: worth, standing, market, box office, genre heat, openings by expected value, your book and signals'];
OS_VIEWS.terminal = () => terminalHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Today'); if (g && !g[1].includes('terminal')) g[1].splice(1, 0, 'terminal'); }
function termClick(t) { const d = t.dataset.tk; if (!d) return false; const [k, v] = d.split(':'); if (k === 'theme') UI.tkTheme = v; if (k === 'dense') UI.tkDense = !UI.tkDense; try { localStorage.setItem('ab-tk', JSON.stringify({ t: UI.tkTheme, d: UI.tkDense })); } catch (e) { /* preferences are optional */ } render(true); return true; }
try { const p = JSON.parse(localStorage.getItem('ab-tk') || 'null'); if (p) { UI.tkTheme = p.t; UI.tkDense = p.d; } } catch (e) { /* no stored preference */ }
// ---- the command palette: Ctrl+K or / ----
function paletteItems(q) {
  const out = [], Q = q.toLowerCase().trim(), M = S.me;
  for (const [k, a] of Object.entries(OS_EXTRA)) out.push({ t: `${a[0]} ${a[1]}`, d: a[2], attr: `data-app="${k}"`, s: a[1] + ' ' + a[2] });
  if (typeof APPS !== 'undefined') for (const a of APPS) if (!OS_EXTRA[a[0]]) out.push({ t: `${a[1]} ${a[2]}`, d: a[3] || '', attr: `data-app="${a[0]}"`, s: a[2] + ' ' + (a[3] || '') });
  if (M) {
    for (const id of Object.keys(M.known).map(Number).filter(id => P(id))) out.push({ t: `👤 ${P(id).name}`, d: (P(id).occ || ROLE_LABEL[P(id).role] || '') + ' · ' + hubName(P(id).hub), attr: `data-go="person:${id}"`, s: P(id).name + ' ' + (P(id).occ || '') });
    for (const f of (typeof myFilms === 'function' ? myFilms() : []).slice(0, 60)) out.push({ t: `🎬 ${f.title}`, d: `your film · ${f.genre}`, attr: `data-go="film:${f.id}"`, s: f.title + ' ' + f.genre });
    for (const f of S.films.filter(f => f.rel !== null && S.week - f.rel < 30).slice(-80)) out.push({ t: `🎞️ ${f.title}`, d: `${f.genre} · ${fmtM(f.total)}`, attr: `data-go="film:${f.id}"`, s: f.title });
    for (const c of S.companies.filter(c => c.closed === null).slice(0, 200)) out.push({ t: `🏢 ${c.name}`, d: hubName(c.hub), attr: `data-go="company:${c.id}"`, s: c.name });
  }
  if (!Q) return out.slice(0, 12);
  const sc = x => { const s = x.s.toLowerCase(); const i = s.indexOf(Q); if (i === 0) return 3; if (i > 0) return 2; return Q.split(' ').every(w => s.includes(w)) ? 1 : 0; };
  return out.map(x => [x, sc(x)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 14).map(x => x[0]);
}
function paletteOpen() {
  if (typeof document === 'undefined') return; let el = document.getElementById('ab-pal');
  if (!el) { el = document.createElement('div'); el.id = 'ab-pal'; document.body.appendChild(el); }
  el.innerHTML = `<div class="pal-box"><input id="pal-q" placeholder="Go to an app, a person, a film, a company…" autocomplete="off"><div id="pal-r"></div><p class="pal-h">↑↓ to move · Enter to open · Esc to close</p></div>`;
  el.className = 'on'; UI.palI = 0; paletteRender(''); const q = document.getElementById('pal-q'); q.focus();
  q.oninput = () => { UI.palI = 0; paletteRender(q.value); };
}
function paletteRender(q) { const L = paletteItems(q), R = document.getElementById('pal-r'); if (!R) return; UI.palL = L; R.innerHTML = L.map((x, i) => `<button class="pal-i${i === (UI.palI || 0) ? ' on' : ''}" ${x.attr}><b>${esc(x.t)}</b><span>${esc(x.d)}</span></button>`).join('') || '<p class="pal-h">Nothing matches.</p>'; }
function paletteClose() { const el = typeof document !== 'undefined' && document.getElementById('ab-pal'); if (el) { el.className = ''; el.innerHTML = ''; } }
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('keydown', e => {
    const open = document.getElementById('ab-pal') && document.getElementById('ab-pal').className === 'on';
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !open && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || ''))) { if (!S.me) return; e.preventDefault(); open ? paletteClose() : paletteOpen(); return; }
    if (!open) return;
    if (e.key === 'Escape') { paletteClose(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); UI.palI = clamp((UI.palI || 0) + (e.key === 'ArrowDown' ? 1 : -1), 0, Math.max(0, (UI.palL || []).length - 1)); paletteRender(document.getElementById('pal-q').value); return; }
    if (e.key === 'Enter') { const b = document.querySelectorAll('#pal-r .pal-i')[UI.palI || 0]; if (b) { b.click(); } }
  });
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('#ab-pal .pal-i'); if (b) setTimeout(paletteClose, 0); else if (e.target.id === 'ab-pal') paletteClose(); });
}
