// ---------------- Release dates: seasons, crowded weekends and who blinks ----------------
// A film's home opening now depends on when it opens:
//  - the season: summer and the holidays bring bigger crowds, January and September smaller ones (`relSeason`);
//  - the competition: the audience appeal of everything opening the same weekend and the week either side, against
//    that market's usual week (`relComp`). A quiet week lifts a film; a weekend with two tentpoles crushes it.
// Together they scale the film's home appeal (and so its gross, which runs on appeal^2.4).
// Studios play chicken: when two big films in post-production land within a week of each other, the smaller one
// usually moves (hashed from the world seed, so it never touches the world's dice). If one of them is yours, you
// decide: hold your date, or move and pay to re-book the campaign. You can also move your own film at any time
// from the release calendar in the Terminal, which shows every coming weekend's crowding and, for your films, what
// each possible week is worth.
function woy(w = S.week) { return w - weekOfYear(yearOf(w)); }
function relSeason(w) { const k = woy(w); return k >= 21 && k <= 34 ? 1.08 : k >= 46 ? 1.06 : k <= 4 ? .82 : k >= 35 && k <= 39 ? .86 : k >= 10 && k <= 14 ? .98 : .93; }   // with competition, averages about 1 across a year
function relWt(f) { return typeof futW === 'function' ? futW(f) : 0; }
// the market's usual week of openings, from the last year of releases (rolling log while you play)
function relBase(m) {
  const L = S.relLog || []; const R = L.filter(x => x.m === m && x.w > S.week - 52);
  if (R.length >= 20) return Math.max(.05, R.reduce((t, x) => t + x.wt, 0) / Math.min(52, S.week - R[0].w + 1));
  const C = REL_C.k === S.week ? REL_C : (REL_C.k = S.week, REL_C.b = {}, REL_C);
  if (C.b[m] === undefined) { let t = 0, n = 0; for (let i = S.films.length - 1; i >= 0 && n < 4000; i--) { const f = S.films[i]; if (f.rel !== null && f.m === m && f.rel > S.week - 52) { t += relWt(f); n++; } } C.b[m] = Math.max(.05, t / 52); }
  return C.b[m];
}
const REL_C = { k: -1, b: {} };
// who else is out around week w in market m (released already, or dated in post-production)
function relRivals(f, w) {
  const out = [];
  for (const x of S.relLog || []) if (x.m === f.m && Math.abs(x.w - w) <= 1 && x.id !== f.id) out.push([S.films[x.id], x.wt]);
  for (const id of S.active) { const x = S.films[id]; if (x && x !== f && x.m === f.m && x.rel === null && x.stage === 3 && Math.abs((x.stageEnd || 0) - w) <= 1) out.push([x, relWt(x)]); }
  return out;
}
function relComp(f, w) {
  const R = relRivals(f, w), crowd = R.reduce((t, x) => t + x[1], 0), ratio = crowd / (relBase(f.m) * 3);
  return { k: clamp(Math.pow(1 / (.5 + .5 * ratio), .5), .72, 1.15), ratio, top: R.sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0].id) };
}
function relMul(f, w) { return relSeason(w) * relComp(f, w).k; }
// opening: the date's effect rides on home appeal
let REL_CTX = null;
{ const _ai = appealIn; appealIn = function (f, m) { const a = _ai(f, m); return REL_CTX && REL_CTX.f === f && m === f.m ? clamp(a * REL_CTX.k, 1, 99) : a; }; }
{ const _rl = release; release = function (f) {
  if (!S.me || f.rel !== null) return _rl.apply(this, arguments);
  const s = relSeason(S.week), c = relComp(f, S.week), mul = s * c.k;
  REL_CTX = { f, k: Math.pow(mul, 1 / 2.4) };
  let out; try { out = _rl.apply(this, arguments); } finally { REL_CTX = null; }
  f.relx = { s, c: +c.k.toFixed(3), ratio: +c.ratio.toFixed(2), vs: c.top };
  (S.relLog = S.relLog || []).push({ w: S.week, m: f.m, id: f.id, wt: relWt(f) }); if (S.relLog.length > 6000) S.relLog = S.relLog.filter(x => x.w > S.week - 60);
  return out; }; }
// tracking sees the date too
{ const _ft = futTrack; futTrack = function (f) { const v = _ft(f); return f.rel === null && f.stage === 3 && f.stageEnd ? v * relMul(f, f.stageEnd) : v; }; }
// chicken
function relWeek() {
  if (!S.me) return; const M = S.me, myC = typeof myCo === 'function' ? myCo() : null;
  const L = S.active.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3 && f.tier <= 2 && f.stageEnd - S.week >= 3 && f.stageEnd - S.week <= 10);
  for (const a of L) for (const b of L) {
    if (a.id >= b.id || a.m !== b.m || Math.abs(a.stageEnd - b.stageEnd) > 1 || a.moved || b.moved) continue;
    const big = a.cost >= b.cost ? a : b, small = big === a ? b : a, mine = x => myC && x.co === myC.id;
    if (mine(small) || mine(big)) { const me = mine(small) ? small : big, them = me === small ? big : small;
      if (them === small && gH(them.id, me.id, 'blink') < .6) { const d = 3 + Math.floor(gH(them.id, 'd') * 4); them.stageEnd += d; them.moved = 1;
        inbox('note', `${them.title} blinks`, `${S.companies[them.co] ? S.companies[them.co].name : 'Its studio'} moves ${them.title} to ${fmtDate(them.stageEnd, true)}, out of ${me.title}'s way. Your weekend is clearer.`, { film: me.id }); continue; }
      if (!me.relAsk || S.week - me.relAsk > 6) { me.relAsk = S.week;
        inbox('reldate', `${them.title} is dated on your weekend`, `${S.companies[them.co] ? S.companies[them.co].name : 'A studio'} has put ${them.title} (${fmtM(them.cost)}) within a week of ${me.title}. Your date is worth ×${relMul(me, me.stageEnd).toFixed(2)} as things stand. ${me.cost < them.cost ? 'They are bigger: they will not move for you.' : 'You are the bigger film; they may blink first.'}`, { film: me.id, choices: [{ k: 'rd_hold', label: 'Hold the date' }, { k: 'rd_4', label: `Move four weeks later (${fmtM(me.budget * .02)} to re-book the campaign)` }, { k: 'rd_8', label: `Move eight weeks later (${fmtM(me.budget * .04)})` }] }); }
      continue; }
    if (gH(small.id, big.id, 'blink') < .7) { const d = 3 + Math.floor(gH(small.id, 'd') * 4); small.stageEnd += d; small.moved = 1;
      if (small.tier === 1 && (small.m === HUBS[M.hub].m || small.m === 'US')) news('Industry', `${small.title} moves to ${fmtDate(small.stageEnd, true)}, out of the way of ${big.title}.`, { film: small.id }); }
    else { a.moved = b.moved = 1; if (a.m === HUBS[M.hub].m || a.m === 'US') news('Industry', `Nobody blinks: ${big.title} and ${small.title} will open against each other.`, { film: big.id }); }
  }
}
function relMove(f, d) {
  const c = typeof myCo === 'function' ? myCo() : null; if (!c || f.co !== c.id || f.rel !== null || f.stage !== 3) return false;
  const to = f.stageEnd + d; if (to < S.week + 1 || to > S.week + 26) return false;
  const cost = d > 0 ? f.budget * .005 * d : f.budget * .02 * -d; c.cash -= cost; if (d < 0) f.qBonus = (f.qBonus || 0) + d * .7;   // pulling a film forward rushes the post
  f.stageEnd = to; f.moved = 1; if (f.fin) f.fin.log.push({ w: S.week, t: `Release moved ${d > 0 ? 'back' : 'up'} ${Math.abs(d)} week${Math.abs(d) > 1 ? 's' : ''} to ${fmtDate(to, true)} (${fmtM(cost)}${d < 0 ? ', and a rushed post' : ''}).` });
  return true;
}
function relAct(a) { const f = S.films[+a.film]; return !!f && relMove(f, Math.round(+a.d)); }
function relPick(it, k) {
  if (it.kind !== 'reldate') return false; it.done = true; const f = S.films[it.film];
  if (k === 'rd_hold') { it.result = { t: 'You hold. Somebody has to.' }; return true; }
  const d = k === 'rd_8' ? 8 : 4, cost = f.budget * .005 * d; relMove(f, d);
  it.result = { t: `${f.title} moves to ${fmtDate(f.stageEnd, true)}. ${fmtM(cost)} to re-book the trailers and posters, and a clear weekend for it.` }; return true;
}
// the Terminal's release calendar
function relPanel() {
  const M = S.me, m = HUBS[M.hub].m, c = typeof myCo === 'function' ? myCo() : null;
  const mine = c ? c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3) : [];
  const weeks = Array.from({ length: 14 }, (_, i) => S.week + 1 + i), base = relBase(m);
  const dated = w => S.active.map(i => S.films[i]).filter(f => f && f.m === m && f.rel === null && f.stage === 3 && f.stageEnd === w).sort((a, b) => relWt(b) - relWt(a));
  const rows = weeks.map(w => { const D = dated(w), crowd = D.reduce((t, f) => t + relWt(f), 0) / base, s = relSeason(w);
    const own = mine.map(f => { const k = relMul(f, w), here = f.stageEnd === w, d = w - f.stageEnd; return `<span class="${here ? 'tk-hi' : ''}" title="${esc(f.title)}">${here ? '● ' : ''}×${k.toFixed(2)}${!here && d && Math.abs(d) <= 8 ? ` <button class="tk-chip" data-rel="${f.id}:${d}">move</button>` : ''}</span>`; }).join(' ');
    return `<tr><td class="nowrap">${esc(fmtDate(w, true))}</td><td class="n ${s > 1.03 ? 'up' : s < .95 ? 'dn' : ''}">×${s.toFixed(2)}</td><td><span class="rl-bar"><i style="width:${Math.min(100, crowd * 33)}%"></i></span> <span class="tk-mut">${crowd.toFixed(1)}</span></td><td>${D.slice(0, 2).map(f => fl(f.id)).join(', ') || '<span class="tk-mut">—</span>'}${D.length > 2 ? ` <span class="tk-mut">+${D.length - 2}</span>` : ''}</td>${mine.length ? `<td class="nowrap">${own}</td>` : ''}</tr>`; }).join('');
  return `<section class="tk-p tk-wide"><h4>RELEASE CALENDAR <span class="tk-sub">${esc(MARKETS[m].name)} · season × competition sets the opening · crowd 1.0 = a normal week</span></h4>
   <table class="tk-t"><thead><tr><th>Week</th><th class="n">Season</th><th>Crowd</th><th>Dated</th>${mine.length ? `<th>Your film${mine.length > 1 ? 's' : ''} here</th>` : ''}</tr></thead><tbody>${rows}</tbody></table>
   <p class="tk-foot">${mine.length ? 'Moving later costs 0.5% of the budget a week to re-book the campaign; moving earlier costs 2% a week and rushes the post. ' : ''}Big films in post-production that land on each other usually see the smaller one blink.</p></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + relPanel() + h.slice(i); }; }
function relClick(t) { const d = t.dataset.rel; if (!d) return false; const [id, n] = d.split(':'); if (!doAct({ t: 'reldate', film: +id, d: +n })) inbox('note', 'Can\'t move it', 'Only your own films in post-production can move, up to six months out, and never into the past.'); render(true); return true; }
// "Why it did that" gains the date
{ const _wp = whyPanel; whyPanel = function (f) { const h = _wp(f); if (!h || !f.relx) return h; const x = f.relx, vs = (x.vs || []).map(id => S.films[id] && S.films[id].title).filter(Boolean);
  return h.replace('</section>', `<p class="small"><b>The date:</b> season ×${x.s.toFixed(2)}, competition ×${x.c.toFixed(2)} (${x.ratio < .7 ? 'a quiet weekend' : x.ratio > 1.6 ? 'a crowded weekend' : 'a normal weekend'}${vs.length ? `, against ${vs.map(esc).join(' and ')}` : ''}).</p></section>`); }; }
