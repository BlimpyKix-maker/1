// ---------------- Distribution: the P&A plan, release windows and streaming ----------------
// Three decisions on your company's films, on two new Film Desk tabs, and a streaming world that runs for every film:
//  1. P&A. How big a campaign (lean ×0.6 to saturation ×2 of the usual prints-and-advertising spend) and where it
//     goes (TV, digital, outdoor, press). Spend lifts the home opening with diminishing returns (gross ∝ spend^e, e = 0.22 + hook/400, and a wider release also pays about 6% of the home gross per extra unit),
//     and a mix that suits the genre works harder. The planner prices every option against the film's forecast.
//  2. Windows. Classic (about 90 days in cinemas before anything else), 45 days, 17 days to premium video on demand
//     (from 2020), or day-and-date on a streamer. Shorter windows cost some theatrical gross and earn more at home;
//     day-and-date gives up a third of the cinema run for a richer streaming deal up front.
//  3. Streaming. After the window, a film's streaming rights go to auction: the streamers bid, and you take the best
//     exclusive deal, split it between two (less each, more viewers), or hold out for better. Every film released in
//     the streaming era finds a streamer and earns weekly views (hours ÷ runtime); the Terminal keeps the chart, the
//     streamers publish an engagement report twice a year, and a title in the top fifth of its first 90 days pays a
//     success bonus, to the company and to the guild members who made it (the 2023 contracts' streaming bonus).
// Randomness is hashed (gH): none of it touches the world's or your dice.
const PA_SIZE = { lean: [.6, 'Lean'], std: [1, 'Standard'], wide: [1.4, 'Wide'], sat: [2, 'Saturation'] };
const PA_MIX = { tv: ['TV spots', ['Comedy', 'Family', 'Animation', 'Action', 'Romance']], digital: ['Digital and social', ['Horror', 'Sci-fi', 'Superhero', 'Thriller', 'Comedy']], outdoor: ['Billboards and buses', ['Superhero', 'Action', 'Fantasy', 'Animation']], press: ['Press and festivals', ['Drama', 'Documentary', 'Musical', 'Crime', 'Romance']] };
const WINDOWS = { classic: { n: 'Classic (~90 days)', th: 1, home: .12, wk: 13, from: 0 }, w45: { n: '45 days', th: .97, home: .16, wk: 7, from: 2020 }, w17: { n: '17 days to PVOD', th: .9, home: .22, wk: 3, from: 2020 }, dnd: { n: 'Day-and-date on a streamer', th: .65, home: .05, wk: 0, from: 2020 } };
function dOwn(f) { const c = typeof myCo === 'function' ? myCo() : null; return !!(c && f && f.co === c.id); }
function dPlan(f) { return f.dplan = f.dplan || { pa: 'std', mix: null, win: S.year >= 2022 ? 'w45' : 'classic' }; }
function paFit(f, mix) { return !mix ? 1 : PA_MIX[mix][1].includes(f.genre) ? 1.06 : .96; }
function paE(f) { return .22 + (f.hook || 50) / 400; }   // a film with a hook rewards a big push; a hard sell doesn't
function dMul(f) { const p = dPlan(f), w = WINDOWS[p.win] || WINDOWS.classic; return Math.pow(PA_SIZE[p.pa][0], paE(f)) * paFit(f, p.mix) * w.th; }   // on home gross
function homeVideoRate(y, win) { if (win !== 'classic') return WINDOWS[win].home; return y < 1980 ? 0 : y < 1997 ? .3 : y < 2012 ? .45 : .12; }
// the planner's forecast: what each option does to the film's money, given what tracking/comps expect
function dForecast(f, pa, mix, win) {
  const G0 = typeof futTrack === 'function' && f.tier <= 2 ? futTrack(f) : typeof futModel === 'function' ? futModel(f) : f.budget * 2;
  const h = .62, cur = dMul(f), p = { pa, mix, win }, m = Math.pow(PA_SIZE[pa][0], paE(f)) * paFit(f, mix) * WINDOWS[win].th;
  const home = G0 * h * m / cur, foreign = G0 * (1 - h), G = home + foreign;
  const paCost = f.budget * [0, .55, .4, .2][f.tier] * (PA_SIZE[pa][0] / PA_SIZE[dPlan(f).pa][0]) * (f.paMul || 1) * (.8 + ((P(f.prod) || { sk: { mkt: 10 } }).sk.mkt) / 50);
  const wider = G0 * h / cur * .06 * Math.max(0, PA_SIZE[pa][0] - 1);   // a wider release also pays for screens and prints
  const hv = home * homeVideoRate(S.year, win) * .7, dnd = win === 'dnd' ? licEst(f) * 1.3 : S.year >= 2013 ? G * .18 * (.8 + (f.q || 60) / 250) : 0;   // later windows still sell a licence, after the cinema run
  return { G, rent: home * .5 + foreign * .4, pa: paCost + wider, hv, dnd, net: home * .5 + foreign * .4 + hv + dnd - paCost - wider - f.cost };
}
function distAct(a) {
  const f = S.films[+a.film]; if (!f || !dOwn(f) || f.rel !== null || f.stage < 0) return false; const p = dPlan(f);
  if (a.k === 'pa' && PA_SIZE[a.v]) { p.pa = a.v; return true; }
  if (a.k === 'mix' && (PA_MIX[a.v] || a.v === 'none')) { p.mix = a.v === 'none' ? null : a.v; return true; }
  if (a.k === 'win' && WINDOWS[a.v] && S.year >= WINDOWS[a.v].from && !(a.v === 'dnd' && f.streamSold)) { p.win = a.v; return true; }
  return false;
}
// at release: the campaign and the window shape the home run
let DIST_CTX = null;
{ const _ai = appealIn; appealIn = function (f, m) { const a = _ai(f, m); return DIST_CTX && DIST_CTX.f === f && m === f.m ? clamp(a * DIST_CTX.k, 1, 99) : a; }; }
{ const _rl = release; release = function (f) {
  if (S.me && f.rel === null && !f.dplan && dOwn(f)) dPlan(f);   // your films get the default plan even if you never opened the planner
  if (!S.me || f.rel !== null || !f.dplan) return _rl.apply(this, arguments);
  const p = f.dplan; f.paMul = (f.paMul || 1) * PA_SIZE[p.pa][0];
  DIST_CTX = { f, k: Math.pow(dMul(f), 1 / 2.4) }; let out; try { out = _rl.apply(this, arguments); } finally { DIST_CTX = null; }
  const wider = (f.gross[f.m] || 0) * .06 * Math.max(0, PA_SIZE[p.pa][0] - 1); if (wider > 0) { f.pa += wider; const c = S.companies[f.co]; if (c && !f.streamSold) c.cash -= wider; }
  if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `Released with a ${PA_SIZE[p.pa][1].toLowerCase()} campaign${p.mix ? ` led by ${PA_MIX[p.mix][0].toLowerCase()}` : ''} (P&A ${fmtM(f.pa)}), window: ${WINDOWS[p.win].n.toLowerCase()}.` });
  if (p.win === 'dnd' && !f.streamSold) licSign(f, licBids(f)[0], 1.3, 'Day-and-date');
  return out; }; }
// ---- the streaming world ----
function streamers(y = S.year) { return typeof TV_NETS === 'undefined' ? [] : Object.values(TV_NETS).filter(n => n.kind === 'streaming' && n.founded <= y); }
function subs(n, w = S.week) { const t = (w - weekOfYear(n.founded)) / 52; return t <= 0 ? 0 : n.per * 45 * (1 - Math.exp(-t / 4)); }   // millions
function pull(f) { return (.5 + (f.q || 50) / 200) * (.6 + (f.hook || 50) / 125) * (1 + Math.log10(1 + (f.total || 0)) / 3) * (f.tier === 1 ? 1.3 : f.tier === 2 ? 1 : .7); }
function viewsAt(t, w) { const f = S.films[t.f], n = TV_NETS[t.sv]; if (!f || !n || w < t.w0) return 0; return subs(n, w) * .012 * pull(f) * Math.exp(-(w - t.w0) / (5 + (f.q || 50) / 25)) * (t.nx ? .7 : 1) * (t.dnd ? 1.25 : 1); }
function strm() { return S.strm = S.strm || { t: [], done: [], bonus: {} }; }
function strmAdd(f, sv, o = {}) { const T = strm(); if (T.t.some(x => x.f === f.id && x.sv === sv)) return; T.t.push(Object.assign({ f: f.id, sv, w0: S.week + 1, v: 0, v90: 0 }, o)); }
// what the streamers would pay for a film's pay window: a share of what it did in cinemas, more for quality, and
// more from the bigger services
function licEst(f) { const G = f.total || (typeof futModel === 'function' ? futModel(f) : f.budget * 2); return G * .18 * (.8 + (f.q || 60) / 250); }
function licBids(f) {
  return streamers().map(n => [n, licEst(f) * (.85 + gH(f.id, n.k, 'bid', Math.floor(S.week / 8)) * .3) * Math.pow(n.per / 6, .3)]).filter(x => subs(x[0]) > 1).sort((a, b) => b[1] - a[1]).slice(0, 4);
}
function licSign(f, bid, mul = 1, how = 'Exclusive', nx = false) {
  if (!bid) return; const [n, fee] = bid, c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null, v = fee * mul;
  if (c && c.closed === null) c.cash += v; f.after = f.after || {}; f.after['Streaming licence'] = (f.after['Streaming licence'] || 0) + v; f.afterTotal = (f.afterTotal || 0) + v;
  (f.lic = f.lic || []).push({ sv: n.k, fee: v, w: S.week, how }); strmAdd(f, n.k, { nx, dnd: how === 'Day-and-date', fee: v });
  if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `${how} streaming deal with ${n.name}: ${fmtM(v)}.`, tone: 'good' });
}
function licPick(it, k) {
  if (it.kind !== 'lic') return false; it.done = true; const f = S.films[it.film]; if (!f) return true; const B = licBids(f);
  if (k === 'lic_hold') { f.licHold = S.week; it.result = { t: 'You wait. In eight weeks the streamers will look at it again, and the numbers may have moved either way.' }; return true; }
  if (k === 'lic_nx' && B.length >= 2) { licSign(f, B[0], .5, 'Non-exclusive', true); licSign(f, B[1], .45, 'Non-exclusive', true); it.result = { t: `Two services share it: ${B[0][0].name} and ${B[1][0].name}. Less money each, twice the audience.` }; return true; }
  const i = +String(k).replace('lic_', '') || 0; licSign(f, B[i] || B[0]); it.result = { t: `${(B[i] || B[0])[0].name} takes it exclusively.` }; return true;
}
function licOffer(f) {
  const B = licBids(f); if (!B.length) return; f.licAsk = S.week;
  inbox('lic', `Streaming bids for ${f.title}`, `Its window is closing and the streamers are bidding for the pay window. ${B.map(([n, v]) => `${n.name}: ${fmtM(v)}`).join(' · ')}.`, { film: f.id, choices: B.map(([n, v], i) => ({ k: 'lic_' + i, label: `${n.name}, exclusive (${fmtM(v)}) · ${Math.round(subs(n))}M subscribers` })).concat(B.length >= 2 ? [{ k: 'lic_nx', label: `Non-exclusive with ${B[0][0].name} and ${B[1][0].name} (${fmtM(B[0][1] * .5 + B[1][1] * .45)}, more viewers)` }] : [], [{ k: 'lic_hold', label: 'Hold out eight weeks' }]) });
}
function distWeek() {
  if (!S.me) return; const T = strm(), c = typeof myCo === 'function' ? myCo() : null;
  // your films: home entertainment and the licence auction
  if (c) for (const id of c.films) { const f = S.films[id]; if (!f || f.rel === null || !f.dplan || f.streamSold) continue; const W = WINDOWS[f.dplan.win];
    if (!f.dHome && S.week >= f.rel + W.wk) { f.dHome = 1; f.hv = f.ry; const v = (f.gross[f.m] || 0) * homeVideoRate(f.ry, f.dplan.win) * .7; if (v > 0) { c.cash += v; f.after = f.after || {}; f.after['Home entertainment'] = (f.after['Home entertainment'] || 0) + v; f.afterTotal = (f.afterTotal || 0) + v; if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `Home entertainment (${W.n.toLowerCase()}): ${fmtM(v)}.` }); } }
    if (S.year >= 2013 && !(f.lic && f.lic.length) && f.dHome && (!f.licAsk || (f.licHold && S.week - f.licHold >= 8 && f.licAsk < f.licHold)) && !pending().some(x => x.kind === 'lic' && x.film === f.id)) licOffer(f);
    const open = pending().find(x => x.kind === 'lic' && x.film === f.id); if (open && S.week - open.w >= 4) licPick(open, 'lic_0'); }
  // everyone else's films find a streamer after their window
  if (S.year >= 2013) for (const x of (S.relLog || [])) { if (x.w !== S.week - 13 && x.w !== S.week - 1) continue; const f = S.films[x.id]; if (!f || f.lic || (x.w === S.week - 1) !== !!f.streamSold || (c && f.co === c.id && f.dplan && !f.streamSold)) continue;
    const L = streamers(); if (!L.length) continue; const n = L.map(n => [n, gH(f.id, n.k, 'home') * n.per]).sort((a, b) => b[1] - a[1])[0][0]; if (f.streamSold) f.lic = [{ sv: n.k, fee: f.streamSold, how: 'Pre-bought' }]; strmAdd(f, n.k, { fee: f.streamSold || 0 }); }
  // views, the 90-day mark and the success bonus
  for (const t of T.t) { const v = viewsAt(t, S.week); t.v += v; if (S.week - t.w0 < 13) t.v90 += v; t.last = v;
    if (S.week - t.w0 === 13 && !t.fin) { t.fin = 1; T.done.push({ w: S.week, v: t.v90 }); const L = T.done.filter(d => d.w > S.week - 52).map(d => d.v).sort((a, b) => a - b), cut = L[Math.floor(L.length * .8)] || Infinity;
      if (L.length >= 10 && t.v90 >= cut) strmBonus(S.films[t.f], t); } }
  T.t = T.t.filter(t => S.week - t.w0 < 60); if (T.done.length > 800) T.done = T.done.filter(d => d.w > S.week - 60);
  // the engagement report
  if (S.year >= 2014 && (woy() === 26 || woy() === 51)) for (const n of streamers()) { const top = T.t.filter(t => t.sv === n.k).sort((a, b) => b.v - a.v)[0]; if (top && top.v > .5 && n.per >= 3) news('Industry', `${n.name}'s engagement report: ${S.films[top.f].title} leads its films this half with ${top.v.toFixed(1)}M views.`, { film: top.f }); }
}
function strmBonus(f, t) {
  if (!f) return; const c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null, M = S.me, me = ME();
  if (c && c.closed === null && t.fee) c.cash += t.fee * .15;
  const mine = (me.credits || []).includes(f.id) || (f.xc && f.xc[me.id]);
  if (mine) { const g = typeof guildOfCraft === 'function' ? guildOfCraft(MAIN[me.role]) : null, v = usd(g ? 3000 + 1500 * careerLevel() : 1200 + 600 * careerLevel()); M.cash += v;
    inbox('note', `A streaming success bonus: ${f.title}`, `${f.title} is in the top fifth of streaming films for its first 90 days (${t.v90.toFixed(1)}M views on ${TV_NETS[t.sv].name}). ${g ? 'The guild contract pays a bonus residual' : 'A bonus'}: ${fmtCash(v)}.${c && c === (typeof myCo === 'function' ? myCo() : null) && t.fee ? ` The company gets ${fmtM(t.fee * .15)} on top of the licence.` : ''}`, { film: f.id }); }
}
// ---- the Film Desk tabs ----
function fdReleaseHTML() {
  const c = typeof myCo === 'function' ? myCo() : null, L = c ? c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage >= 1) : [];
  if (!L.length) return '<p class="tk-foot">Release planning opens for your company\'s films once they\'re in pre-production.</p>';
  return `<div class="tk-grid">${L.map(f => { const p = dPlan(f), wins = Object.entries(WINDOWS).filter(([k, w]) => S.year >= w.from && !(k === 'dnd' && f.streamSold));
    const rows = Object.keys(PA_SIZE).map(pa => { const x = dForecast(f, pa, p.mix, p.win); return [pa, x]; }), best = rows.slice().sort((a, b) => b[1].net - a[1].net)[0][0];
    const wrows = wins.map(([k]) => [k, dForecast(f, p.pa, p.mix, k)]), wbest = wrows.slice().sort((a, b) => b[1].net - a[1].net)[0][0];
    return `<section class="tk-p tk-wide"><h4>${fl(f.id)} <span class="tk-sub">${esc(f.genre)} · ${fmtM(f.budget)} · opens ${esc(fmtDate(f.stageEnd + (f.stage < 3 ? 12 : 0), true))}${f.stage < 3 ? ' (est.)' : ''}</span></h4>
     <p>Campaign: ${Object.entries(PA_SIZE).map(([k, [m, l]]) => `<button class="tk-chip${p.pa === k ? ' on' : ''}" data-fd="dist:${f.id}:pa:${k}">${l} ×${m}</button>`).join('')} · Lead with: ${Object.entries(PA_MIX).map(([k, [l, G]]) => `<button class="tk-chip${p.mix === k ? ' on' : ''}" data-fd="dist:${f.id}:mix:${k}" title="Works best for ${G.join(', ')}">${l}${G.includes(f.genre) ? ' ✓' : ''}</button>`).join('')}</p>
     <table class="tk-t"><thead><tr><th>Campaign</th><th class="n">P&amp;A</th><th class="n">Gross</th><th class="n">Rentals</th><th class="n">Net</th></tr></thead><tbody>${rows.map(([k, x]) => `<tr${k === p.pa ? ' class="tk-mine"' : ''}><td>${PA_SIZE[k][1]}${k === best ? ' <span class="up">best</span>' : ''}</td><td class="n">${fmtM(x.pa)}</td><td class="n">${fmtM(x.G)}</td><td class="n">${fmtM(x.rent)}</td><td class="n ${x.net >= 0 ? 'up' : 'dn'}">${fmtM(x.net)}</td></tr>`).join('')}</tbody></table>
     <p>Window: ${wins.map(([k, w]) => `<button class="tk-chip${p.win === k ? ' on' : ''}" data-fd="dist:${f.id}:win:${k}">${w.n}</button>`).join('')}</p>
     <table class="tk-t"><thead><tr><th>Window</th><th class="n">Cinemas</th><th class="n">Home ent.</th><th class="n">Streaming</th><th class="n">Net</th></tr></thead><tbody>${wrows.map(([k, x]) => `<tr${k === p.win ? ' class="tk-mine"' : ''}><td>${WINDOWS[k].n}${k === wbest ? ' <span class="up">best</span>' : ''}</td><td class="n">${fmtM(x.rent)}</td><td class="n">${fmtM(x.hv)}</td><td class="n">${x.dnd ? fmtM(x.dnd) + (k === 'dnd' ? ' now' : ' later') : ''}</td><td class="n ${x.net >= 0 ? 'up' : 'dn'}">${fmtM(x.net)}</td></tr>`).join('')}</tbody></table>
     <p class="tk-foot">Forecast from ${f.tier <= 2 && f.stage === 3 ? 'tracking' : 'comparable films'}; the real run adds the date, the reviews and luck. Spend lifts the home opening with diminishing returns; a mix that suits the genre (✓) works about 10% harder. After the window, the streamers bid for the pay window.</p></section>`; }).join('')}</div>`;
}
function fdStreamHTML() {
  const T = strm(), me = ME(), c = typeof myCo === 'function' ? myCo() : null;
  if (S.year < 2013) return '<p class="tk-foot">Streaming arrives in the 2010s. Until then a film\'s life after cinemas is home video and television.</p>';
  const top = T.t.filter(t => t.last > 0).sort((a, b) => b.last - a.last).slice(0, 10), mine = T.t.filter(t => { const f = S.films[t.f]; return f && ((c && f.co === c.id) || (me.credits || []).includes(f.id)); });
  const L = T.done.filter(d => d.w > S.week - 52).map(d => d.v).sort((a, b) => a - b), cut = L.length >= 10 ? L[Math.floor(L.length * .8)] : null;
  return `<div class="tk-grid"><section class="tk-p tk-wide"><h4>TOP 10 FILMS THIS WEEK <span class="tk-sub">views = hours watched ÷ runtime, millions</span></h4><table class="tk-t"><thead><tr><th>#</th><th>Film</th><th>Service</th><th class="n">Views</th><th class="n">Weeks</th><th class="n">Total</th></tr></thead><tbody>${top.map((t, i) => `<tr${mine.includes(t) ? ' class="tk-mine"' : ''}><td class="n">${i + 1}</td><td>${fl(t.f)}</td><td class="tk-mut">${esc(TV_NETS[t.sv].name)}${t.nx ? ' (shared)' : ''}</td><td class="n">${t.last.toFixed(2)}</td><td class="n">${S.week - t.w0 + 1}</td><td class="n">${t.v.toFixed(1)}</td></tr>`).join('') || '<tr><td colspan="6" class="tk-mut">Nothing streaming yet.</td></tr>'}</tbody></table></section>
   <section class="tk-p"><h4>THE SERVICES <span class="tk-sub">subscribers, millions</span></h4><div class="tk-bars">${streamers().map(n => `<div class="tk-bar"><span>${esc(n.name)}</span><i style="width:${Math.min(100, subs(n) / 2.7)}%"></i><b>${Math.round(subs(n))}</b><span class="tk-mut">${T.t.filter(t => t.sv === n.k).length} films</span></div>`).join('')}</div></section>
   <section class="tk-p"><h4>YOUR TITLES <span class="tk-sub">${cut ? `bonus line: ${cut.toFixed(1)}M in 90 days` : 'bonus line forms after ten titles'}</span></h4><table class="tk-t"><tbody>${mine.map(t => `<tr><td>${fl(t.f)}</td><td class="tk-mut">${esc(TV_NETS[t.sv].name)}</td><td class="n">${t.v90.toFixed(1)}M</td><td class="n ${cut && t.v90 >= cut ? 'up' : ''}">${S.week - t.w0 < 13 ? `day ${(S.week - t.w0) * 7}` : cut && t.v90 >= cut ? 'bonus' : ''}</td></tr>`).join('') || '<tr><td class="tk-mut">None of your films is streaming.</td></tr>'}</tbody></table></section></div>`;
}
{ const _fd = fdHTML; fdHTML = function () {
  const t = UI.fdT || 'screen'; if (t !== 'release' && t !== 'stream') return _fd().replace('<span class="tk-sp"></span>', `<span class="tk-sp"></span><button class="tk-chip" data-fd="tab:release">Release plan</button><button class="tk-chip" data-fd="tab:stream">Streaming</button>`);
  const h = _fd(); const i = h.indexOf('</div>', h.indexOf('class="tk-top"')); const head = h.slice(0, i).replace(/ on"/g, '"') + `<button class="tk-chip${t === 'release' ? ' on' : ''}" data-fd="tab:release">Release plan</button><button class="tk-chip${t === 'stream' ? ' on' : ''}" data-fd="tab:stream">Streaming</button></div>`;
  return head + (t === 'release' ? fdReleaseHTML() : fdStreamHTML()) + '</div>'; }; }
{ const _fc = fdClick; fdClick = function (t) { const d = t.dataset.fd; if (d && d.startsWith('dist:')) { const p = d.split(':'); if (!doAct({ t: 'dist', film: +p[1], k: p[2], v: p[3] })) inbox('note', 'Not now', 'That option isn\'t available for this film.'); render(true); return true; } return _fc(t); }; }
