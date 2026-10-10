// ---------------- Film futures, bankability and the waterfall ----------------
// A box-office futures market, after the Hollywood Stock Exchange: every big film in post-production lists ten weeks
// out at the market's forecast of its worldwide gross ($M). The forecast is built from comparable releases (same tier
// and genre, last three years), the cast's bankability, the hook and the year's genre heat, and it wanders with
// tracking noise that narrows as release gets close. Buy long or sell short; contracts settle on the real gross four
// weeks after release ($100 per $1M per contract). Trading a film you worked on is insider trading: profitable, and
// sometimes investigated.
// Bankability (0–100) is how much a name moves money: the box office of their last five films relative to cost.
// Every released film's page shows where its money went: gross → cinemas' share → rentals → P&A → cost → net.
const FUT_K = 100;   // dollars per $1M per contract
const FUT_SPREAD = .035;   // half the bid/ask spread
const FUT_MAX = 30;   // contracts per film
function bankability(p) {
  if (!p) return 0; const L = (p.credits || []).map(i => S.films[i]).filter(f => f && f.rel !== null && f.cost > 0 && ((f.cast || []).slice(0, 2).includes(p.id) || f.dir === p.id)).slice(-5);
  if (!L.length) return Math.round(clamp((p.fame || 0) * .3, 0, 30));
  const r = L.reduce((t, f) => t + Math.log2(Math.max(.1, f.total / f.cost)), 0) / L.length;
  return Math.round(clamp(22 + r * 14 + (p.fame || 0) * .35, 0, 99));
}
function futComps(f) {
  const k = f.tier + ':' + f.genre + ':' + S.year, A = (FUT_C.k === S.week ? FUT_C : (FUT_C.k = S.week, FUT_C.m = {}, FUT_C)).m;
  if (A[k] !== undefined) return A[k];
  let L = S.films.filter(x => x.rel !== null && x.tier === f.tier && x.genre === f.genre && S.year - yearOf(x.rel) <= 3 && x.cost > 0);
  if (L.length < 4) L = S.films.filter(x => x.rel !== null && x.tier === f.tier && S.year - yearOf(x.rel) <= 3 && x.cost > 0);
  const ratio = L.length ? L.reduce((t, x) => t + x.total / x.cost, 0) / L.length : 2;
  return (A[k] = ratio);
}
const FUT_C = { k: -1, m: {} };
function futModel(f) {
  const star = ((f.cast || []).slice(0, 2).map(id => bankability(P(id))).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(2, (f.cast || []).length))) || 30;
  const heat = typeof genreHeat === 'function' ? genreHeat(f.genre) : 1;
  return Math.max(.05, f.cost * futComps(f) * Math.pow((f.hook || 50) / 60, .7) * (.75 + star / 200) * heat);
}
// tracking: audience appeal from the hook, the cast's fame, marketing muscle and the market's taste for the genre, scaled
// by what similar appeal earned in that market lately. Better than comps (median miss ~22% vs ~55%), but it ignores
// quality, legs, weather and timing, which only show on the night.
function futW(f) {
  const C = (f.cast || []).map(P), d = P(f.dir), pr = P(f.prod); if (!C[0] || !d || !pr) return 0;
  const st = C[0].fame * .5 + (C[1] || C[0]).fame * .25 + (C[2] || C[0]).fame * .15 + d.fame * .1, mkt = clamp([0, 70, 45, 20][f.tier] + pr.sk.mkt, 0, 100);
  const A = appetite(f.m, f.genre, f.rel !== null ? yearOf(f.rel) : S.year) * (.4 * (f.hook || 50) + .35 * st + .25 * mkt);
  return Math.pow(A / 50, 2.4) * [0, 1, .6, .3][f.tier];
}
function futTrack(f) {
  const w = futW(f); if (!w) return futModel(f);
  const k = f.m + ':' + f.tier, A = (FUT_C.k === S.week ? FUT_C : (FUT_C.k = S.week, FUT_C.m = {}, FUT_C)).m;
  if (A['t' + k] === undefined) { const R = S.films.filter(x => x.rel !== null && x.m === f.m && x.tier === f.tier && x.cost > 0 && S.year - yearOf(x.rel) <= 3).slice(-80).map(x => x.total / (futW(x) || 1e9)).filter(v => v > 0).sort((a, b) => a - b); A['t' + k] = R.length >= 5 ? R[R.length >> 1] : 0; }
  const wob = 1 + (hashRand(f.id * 104729 + S.week * 17)() - .5) * .3;   // tracking surveys wobble ±15% week to week
  return A['t' + k] ? Math.max(.05, A['t' + k] * w * wob) : futModel(f);
}
// the market's consensus: comps-heavy far out, tracking-heavy near release
function futFair(f, w = S.week) { const left = clamp((f.stageEnd || w) - w, 0, 10), k = .97 - left * .03; return Math.exp((1 - k) * Math.log(futModel(f)) + k * Math.log(futTrack(f))); }
function genreHeat(g) { const A = (FUT_C.k === S.week ? FUT_C : (FUT_C.k = S.week, FUT_C.m = {}, FUT_C)).m; if (A['h' + g] === undefined) A['h' + g] = genreHeat0(g); return A['h' + g]; }
function genreHeat0(g) { const y = S.year, by = yy => { let a = 0, t = 0; for (const f of S.films) if (f.rel !== null && yearOf(f.rel) === yy) { t += f.total || 0; if (f.genre === g) a += f.total || 0; } return t ? a / t : 0; }; const a = by(y), b = by(y - 1); return b ? clamp(a / b, .7, 1.4) : 1; }
function futList() {
  return S.films.filter(f => f.rel === null && f.stage === 3 && f.tier <= 2 && (f.stageEnd || 0) - S.week <= 10 && (f.stageEnd || 0) >= S.week).sort((a, b) => b.cost - a.cost).slice(0, 16);
}
function futPrice(f, w = S.week) {
  if (f.rel !== null && f.rel <= w) return f.total;
  const base = futFair(f, w), left = Math.max(0, (f.stageEnd || w) - w), sig = .06 + left * .025;
  let n = 0; for (let i = 0; i < 5; i++) n += (hashRand(f.id * 7919 + (w - i) * 31)() - .5) * sig * (1 - i / 6);
  return Math.max(.05, base * (1 + n));
}
function futPos(fid) { return ((S.me.fut || {})[fid]) || null; }
function futAct(a) {
  const M = S.me, f = S.films[+a.film]; if (!f || f.rel !== null || !futList().includes(f)) return false;
  const n = Math.round(+a.n); if (!n) return false; M.fut = M.fut || {};
  const P0 = M.fut[f.id] || { n: 0, cost: 0, own: false }, nn = P0.n + n; if (Math.abs(nn) > FUT_MAX) return false;
  const px = futPrice(f) * (n > 0 ? 1 + FUT_SPREAD : 1 - FUT_SPREAD), cash = n * px * FUT_K;   // you buy at the ask, sell at the bid
  if (n > 0 && M.cash < cash) return false; if (n < 0 && M.cash < Math.abs(nn) * px * FUT_K * .5) return false;   // shorts need margin
  M.cash -= cash; P0.n = nn; P0.cost += cash; P0.own = P0.own || (typeof crRolesFor === 'function' && crRolesFor(f).length > 0) || M.jobs.some(j => j.film === f.id);
  if (P0.n === 0) { (M.futLog = M.futLog || []).push({ w: S.week, film: f.id, pnl: -P0.cost, early: 1 }); delete M.fut[f.id]; } else M.fut[f.id] = P0;
  return true;
}
function futWeek() {
  const M = S.me; if (!M || !M.fut) return;
  for (const [fid, P0] of Object.entries(M.fut)) {
    const f = S.films[+fid]; if (!f) { delete M.fut[fid]; continue; }
    if (f.stage < 0) { M.cash += P0.cost; delete M.fut[fid]; inbox('note', `${f.title}: contracts voided`, `${f.title} collapsed before release. Your futures are refunded at cost.`); continue; }
    if (f.rel === null || S.week < f.rel + 4) continue;
    const pay = P0.n * f.total * FUT_K, pnl = pay - P0.cost; M.cash += pay; delete M.fut[fid];
    (M.futLog = M.futLog || []).push({ w: S.week, film: f.id, pnl, n: P0.n, settle: f.total }); if (M.futLog.length > 40) M.futLog.shift();
    let t = `${f.title} settles at ${fmtM(f.total)}. Your ${P0.n > 0 ? 'long' : 'short'} position of ${Math.abs(P0.n)} contract${Math.abs(P0.n) > 1 ? 's' : ''} ${pnl >= 0 ? 'makes' : 'loses'} ${fmtCash(Math.abs(pnl))}.`;
    if (P0.own && pnl > 0 && prnd() < .3) { const fine = Math.round(pnl * .5); M.cash -= fine; ME().standing = clamp(ME().standing - 2.5, 0, 100); t += ` Then the letter arrives: a compliance inquiry into trading on a film you worked on. A ${fmtCash(fine)} settlement, and people talk.`; milestone(`Fined for trading futures on ${f.title}`, 'money'); }
    inbox('note', `Futures: ${f.title}`, t);
  }
}
function futPanel() {
  const M = S.me, L = futList();
  const row = f => { const px = futPrice(f), p1 = futPrice(f, S.week - 1), pos = futPos(f.id), mine = typeof crRolesFor === 'function' && crRolesFor(f).length > 0, wk = Math.max(0, (f.stageEnd || S.week) - S.week);
    return `<tr${mine ? ' class="tk-mine"' : ''}><td>${fl(f.id)}${mine ? ' <span class="tk-mut">(yours)</span>' : ''}</td><td class="n">${px.toFixed(1)}</td><td class="n tk-mut">${futTrack(f).toFixed(1)}</td><td class="n ${px >= p1 ? 'up' : 'dn'}">${fmtPct((px / p1 - 1) * 100)}</td><td class="n tk-mut">±${Math.round((.06 + wk * .025) * 100)}%</td><td class="n">${wk}w</td><td class="n">${pos ? (pos.n > 0 ? '+' : '') + pos.n : ''}</td><td class="nowrap"><button class="tk-chip" data-fut="${f.id}:5">+5</button><button class="tk-chip" data-fut="${f.id}:-5">−5</button></td></tr>`; };
  const log = (M.futLog || []).slice(-4).reverse();
  return `<section class="tk-p tk-wide"><h4>FILM FUTURES <span class="tk-sub">forecast worldwide gross, $M · $${FUT_K} per $1M per contract · spread ±${+(FUT_SPREAD * 100).toFixed(1)}% · settles 4 weeks after release</span></h4>
   <table class="tk-t"><thead><tr><th>Film</th><th class="n">Px</th><th class="n" title="Tracking: appeal-based forecast">Trk</th><th class="n">1w</th><th class="n">Band</th><th class="n">Out</th><th class="n">Pos</th><th></th></tr></thead><tbody>${L.map(row).join('') || '<tr><td colspan="8" class="tk-mut">Nothing listed this week.</td></tr>'}</tbody></table>
   ${log.length ? `<p class="tk-foot">${log.map(x => `${esc((S.films[x.film] || {}).title || '?')} <span class="${x.pnl >= 0 ? 'up' : 'dn'}">${x.pnl >= 0 ? '+' : '−'}${fmtCash(Math.abs(x.pnl))}</span>`).join(' · ')}</p>` : '<p class="tk-foot">Px leans on comparable films far out and on tracking (Trk) near release: the gap between them is the trade. Reviews, legs and opening-weekend weather are what nobody can see. Trading your own films is insider trading.</p>'}</section>`;
}
function starPanel() {
  const M = S.me, mkt = (HUBS[M.hub] || {}).m, L = S.people.filter(p => !p.dead && !p.retired && p.role === 'actor' && (HUBS[p.hub] || {}).m === mkt && (p.credits || []).length >= 2).map(p => [p, bankability(p)]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const me = ME(), mine = bankability(me);
  return `<section class="tk-p"><h4>BANKABILITY <span class="tk-sub">who moves money in ${esc(MARKETS[mkt] ? MARKETS[mkt].name : mkt)} · you: ${mine}</span></h4><div class="tk-bars">${L.map(([p, b]) => `<div class="tk-bar"><span><a href="#" class="lk" data-go="person:${p.id}">${esc(p.name.split(' ').slice(-1)[0])}</a></span><i style="width:${b}%"></i><b>${b}</b><span class="tk-mut">${(p.credits || []).length} cr</span></div>`).join('')}</div></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + futPanel() + starPanel() + h.slice(i); }; }
function futClick(t) { const d = t.dataset.fut; if (!d) return false; const [id, n] = d.split(':'); const ok = doAct({ t: 'fut', film: +id, n: +n }); if (!ok) inbox('note', 'Order rejected', `Not enough cash or margin, the position limit (${FUT_MAX}) is reached, or the film is no longer listed.`); render(true); return true; }
// where the money went
function waterfallSVG(f) {
  if (f.rel === null || !f.total) return '';
  const g = f.total, rent = f.rentals || g * .5, pa = f.pa || 0, cost = f.cost || 0, back = f.backend || 0, net = rent - pa - cost - back;
  const steps = [['Gross', g, 'base'], ['Cinemas keep', -(g - rent), 'neg'], ['P&A', -pa, 'neg'], ['Budget', -cost, 'neg'], ['Talent back end', -back, 'neg'], ['Net', net, net >= 0 ? 'pos' : 'loss']];
  const W = 520, rowH = 22, mx = Math.max(g, cost + pa, 1), X = v => 130 + v / mx * (W - 210); let run = 0;
  const bars = steps.map(([l, v, k], i) => { let x0, x1; if (k === 'base') { x0 = 0; x1 = v; run = v; } else if (k === 'neg') { x1 = run; x0 = run + v; run = x0; } else { x0 = Math.min(0, v); x1 = Math.max(0, v); }
    const y = 4 + i * rowH; return `<text x="0" y="${y + 14}" class="wf-l">${l}</text><rect x="${X(Math.min(x0, x1))}" y="${y + 3}" width="${Math.max(1, Math.abs(X(x1) - X(x0)))}" height="14" class="wf-${k}"/><text x="${W - 4}" y="${y + 14}" text-anchor="end" class="wf-v">${v < 0 ? '−' : ''}${fmtM(Math.abs(v))}</text>`; }).join('');
  return `<section class="panel"><h3>Where the money went</h3><svg class="wf" viewBox="0 0 ${W} ${steps.length * rowH + 8}" width="${W}" style="width:${W}px;max-width:100%;height:auto">${bars}</svg><p class="small muted">Cinemas keep roughly half the gross; the distributor recoups prints and advertising first, then the budget, then any talent back end. What's left is profit.</p></section>`;
}
{ const _vf = viewFilm; viewFilm = function (id) { const h = _vf(id), f = S.films[id]; if (!f || f.rel === null) return h; return h + waterfallSVG(f); }; }
// why it opened where it did: what tracking said the week before, and the inputs that drive audience appeal
{ const _rl = release; release = function (f) {
  if (S.me && f.tier <= 3) { try { const C = (f.cast || []).map(P), d = P(f.dir), pr = P(f.prod);
    if (C[0] && d && pr) f.why = { trk: +futFair(f).toFixed(2), hook: f.hook || 50, st: Math.round(C[0].fame * .5 + (C[1] || C[0]).fame * .25 + (C[2] || C[0]).fame * .15 + d.fame * .1), mkt: Math.round(clamp([0, 70, 45, 20][f.tier] + pr.sk.mkt, 0, 100)), app: +appetite(f.m, f.genre, S.year).toFixed(2) }; } catch (e) { /* a breakdown is optional */ } }
  return _rl.apply(this, arguments); }; }
function whyPanel(f) {
  const y = f.why; if (!y || !f.total) return '';
  const d = f.total / Math.max(.01, y.trk) - 1, row = (l, v, max, note) => `<div class="rep"><span>${l}</span>${bar(v, max, 'data')}<b>${typeof v === 'number' && v % 1 ? v.toFixed(2) : Math.round(v)}</b><small class="muted">${note}</small></div>`;
  const q = f.q || 50, legs = q >= 70 ? 'strong legs' : q >= 45 ? 'average legs' : 'front-loaded', rev = f.reviews != null ? `reviews ${f.reviews}` : '';
  return `<section class="panel"><h3>Why it did that</h3><p><b>Tracked ${fmtM(y.trk)}</b> the week before release · <b>finished ${fmtM(f.total)}</b> · <span class="${d >= 0 ? 'good' : 'bad'}">${d >= 0 ? 'beat' : 'missed'} tracking by ${Math.abs(Math.round(d * 100))}%</span></p>
   ${row('Hook', y.hook, 100, '40% of appeal')}${row('Star power', y.st, 100, '35%: lead, second, third, director')}${row('Marketing', y.mkt, 100, '25%: tier and the producer’s reach')}${row('Genre appetite', y.app, 2, 'how much this market wants the genre this year')}
   <p class="small muted">What tracking can’t see: quality (${Math.round(q)}, ${legs}${rev ? ', ' + rev : ''}), the opening-weekend weather and timing, and how far it travelled abroad (${fmtM(f.foreign || 0)} outside its home market). Appeal is raised to the power 2.4, so small edges in the inputs become big gaps in the gross.</p></section>`;
}
{ const _vf2 = viewFilm; viewFilm = function (id) { const h = _vf2(id), f = S.films[id]; if (!f || f.rel === null || !f.why) return h; return h + whyPanel(f); }; }
