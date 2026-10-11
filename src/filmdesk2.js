// ---------------- The Film Desk, for everyone ----------------
// The desk was empty until you had a film of your own, and even then it didn't say what any of it meant. Now:
//  · A seat. Observer, Talent, Producer, Mogul: what you can do here depends on where you are, and the strip says
//    what gets you the next seat, with a button for each step.
//  · A desk log: the countdowns that matter (the next film market, the critics' circles, your own films' dates,
//    your open calls).
//  · A desk note on every tab: what someone who does this for a living would do next, from your actual numbers.
//  · The world first. Every tab opens on the industry's own films when you have none: what the studios' test
//    screenings are leaking, what travels abroad and which territories are buying, the release calendar and how
//    last month's openers did. Empty tabs say why they're empty, show what goes there, and offer the next step.
//  · Call it. Anyone can call the industry's next releases over or under the desk's own forecast. Calls are graded
//    when the film opens. Being right is noticed (a little standing), and a good record over enough calls gets
//    you a weekly box-office column in the trades, which you keep while you stay sharp. The line is the desk's
//    median, so a coin flip wins half the time; the edge is in reading tracking, the date and the competition.
//  · The trade's words are underlined where they appear: hover or tab to one for what it means. The Glossary tab
//    lists them all, with your own numbers where you have them.
const GLOSS = {
  t2b: ['Top-two-box', 'The share of a test audience rating the film "excellent" or "very good". Studios want 70% or more before they stop changing the cut.'],
  rec: ['Definite recommend', 'The share who say they\'d definitely tell friends to see it: word of mouth in one number.'],
  mg: ['Minimum guarantee (MG)', 'What a foreign buyer pays for a territory: 10% on signing, 90% on delivery. They keep that territory\'s box office and pay you half of anything past 125% of the MG.'],
  presale: ['Pre-sales', 'Selling territories before the film is finished, to help pay for it. Safer money, smaller upside.'],
  pa: ['P&A', 'Prints and advertising: what it costs to put a film in cinemas and tell people. It lifts the opening, with diminishing returns.'],
  window: ['Window', 'How long a film plays only in cinemas before home release. A shorter window trades some cinema gross for earlier home money.'],
  dnd: ['Day-and-date', 'Cinemas and streaming on the same day.'],
  comps: ['Comps', 'Comparable films: same market, genre and size, released recently. Forecasts start from what they did.'],
  be: ['Break-even', 'The gross a film needs before the distributor\'s share of ticket sales covers its cost and its P&A.'],
  prec: ['Precursors', 'Critics\' circles and guild prizes in December. Voters watch them before the big ceremonies.'],
  tracking: ['Tracking', 'Polling of awareness and interest before release. From about a month out it predicts the opening better than comps.'],
  rentals: ['Rentals', 'The distributor\'s share of ticket sales: about half at home, less abroad.'],
  lic: ['Licence', 'A streamer pays to show a film for a period. Exclusive pays more.'],
  line: ['The line', 'The desk\'s median forecast for a film\'s gross. A call says whether the real figure lands over or under it.']
};
const GLOSS_FORMS = [['top-two-box', 't2b'], ['TOP-TWO-BOX', 't2b'], ['definite recommend', 'rec'], ['DEFINITE RECOMMEND', 'rec'], ['minimum guarantee', 'mg'], ['(MG)', 'mg'], ['pre-sales', 'presale'], ['P&amp;A', 'pa'], ['Window:', 'window'], ['day-and-date', 'dnd'], ['comparable films', 'comps'], ['COMPARABLE FILMS', 'comps'], ['break-even', 'be'], ['BREAK-EVEN', 'be'], ['precursors', 'prec'], ['tracking', 'tracking'], ['Rentals', 'rentals'], ['licence', 'lic'], ['the line', 'line']];
function glossify(html) {
  const done = new Set(), SKIP = /^<\/?(svg|button|title|option|textarea|abbr|a|select)\b/i; let skip = 0;
  return html.split(/(<[^>]+>)/).map(seg => { if (!seg) return seg; if (seg[0] === '<') { const m = seg.match(SKIP); if (m && !/\/>$/.test(seg)) skip += seg[1] === '/' ? -1 : 1; return seg; } if (skip > 0) return seg;
    for (const [form, k] of GLOSS_FORMS) { if (done.has(k)) continue; const i = seg.indexOf(form); if (i < 0) continue; done.add(k);
      seg = seg.slice(0, i) + `<abbr class="gl" tabindex="0" data-tip="${esc(GLOSS[k][1])}">${form}</abbr>` + seg.slice(i + form.length); }
    return seg; }).join('');
}

// ---- where you sit ----
function fdSeat() {
  const c = typeof myCo === 'function' ? myCo() : null, me = ME();
  if (c && c.films.length >= 3 && c.films.some(i => S.films[i] && S.films[i].rel !== null)) return 3;
  if (c) return 2;
  if ((me.credits || []).some(id => { const f = S.films[id]; return f && (f.rel === null || f.rel > S.week - 26); })) return 1;
  return 0;
}
const FD_SEATS = [['Observer', 'Watch the business and call it'], ['Talent', 'A film of yours is in the works'], ['Producer', 'Your company makes films'], ['Mogul', 'A slate of your own']];
function fdNextSteps(seat) {
  const c = typeof myCo === 'function' ? myCo() : null, n = c ? c.films.length : 0;
  if (seat === 0) return [['Get a credit on a film in production', 'computer:work', '🧰 Job board'], ['Or fund your own script', 'computer:create', '🎨 Create']];
  if (seat === 1) return [['Found a company to produce', 'computer:create', '🎨 Create'], ['Raise money in the Deal Room', 'computer:deals', '🤝 Deal Room']];
  if (seat === 2) return [[`Make three films with your company (${n}/3), one released`, 'computer:create', '🎬 Make one']];
  return [];
}
function fdLog() {
  const M = S.me, out = [], k = woy(), mk = mktNow();
  if (mk) out.push(['🎪', `${mk.n.replace(/^the /, '').replace(/ \(.*\)/, '')}: on now, ${mk.wk[1] - k + 1} wk left`, 'tab:sales']); else { const [n, w] = mktNext(); out.push(['🎪', `${n.n.replace(/^the /, '').replace(/ \(.*\)/, '')} in ${w} wk`, 'tab:sales']); }
  out.push(['🏆', k < 49 ? `Critics' circles in ${49 - k} wk` : k === 49 ? 'Critics\' circles vote this week' : 'Ceremonies in January', 'tab:awards']);
  const c = typeof myCo === 'function' ? myCo() : null;
  if (c) for (const f of c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage >= 0).slice(0, 3)) out.push(['🎬', `${f.title}: ${f.stage === 3 ? `opens in ${Math.max(0, f.stageEnd - S.week)} wk` : ['in development', 'in pre-production', 'shooting'][f.stage] || 'in the works'}`, f.stage === 3 ? 'tab:screen' : 'tab:release']);
  const C = fdCalls(); if (C.open.length) out.push(['🎯', `${C.open.length} call${C.open.length > 1 ? 's' : ''} open`, 'tab:calls']);
  if (typeof pending === 'function' && pending().some(x => x.kind === 'lic')) out.push(['📺', 'A licence offer is waiting', 'tab:stream']);
  return out;
}
// what someone who does this for a living would say, from the numbers in front of you
function fdNote(t) {
  const M = S.me, m = HUBS[M.hub].m, c = typeof myCo === 'function' ? myCo() : null;
  if (t === 'screen') { const f = S.films.find(f => f.rel === null && f.stage === 3 && fdOwn(f)); if (!f) return 'Nothing of yours is in the cutting room. Below: what the studios\' own screenings are telling them, as leaked to the trades.';
    const st = f.scr || { n: 0 }, C = st.last; if (!C) return `Screen ${f.title} before you lock it: the first card costs ${fmtM(f.budget * .004)} and tells you which act is weakest.`;
    if (st.locked) return `${f.title} is locked. From here it's the trailer, the date and the campaign.`;
    return C.t2b < 70 && st.n < 4 ? `${C.t2b}% top-two-box is under the 70% studios aim for. The ${C.weak} is weakest: a recut is the cheapest fix; screen again after.` : `${C.t2b}% is a cut that works. Lock it and spend on the trailer and the campaign instead.`; }
  if (t === 'sales') { const mk = mktNow(), own = c ? c.films.map(i => S.films[i]).filter(salesOK) : [], top = fdTerrHeat().slice(0, 3).map(x => MARKETS[x.m].name).join(', ');
    if (mk && own.length) return `${mk.n[0].toUpperCase() + mk.n.slice(1)} is on. Go yourself to counter offers (a deal-making roll), or send an agent for 12% if you can't spare the weeks.`;
    return `${own.length ? 'Your films are ready for market. ' : ''}The territories buying most this year: ${top || 'none yet'}. Genres that travel, a lead with a name abroad and a good test screening all lift offers.`; }
  if (t === 'awards') { const R = raceOdds(m, 'film'), f0 = R[0]; return f0 ? `${f0[0].title} leads Best Film at ${Math.round(f0[1] * 100)}%. ${campaignSeason() ? 'Trade ads are cheapest early; a publicist pays off only when a nomination looks likely.' : 'Campaign season opens in October.'}` : 'No eligible films yet this year.'; }
  if (t === 'release') { const own = c ? c.films.map(i => S.films[i]).find(f => f && f.rel === null && f.stage >= 1) : null;
    if (own) { const p = dPlan(own), best = Object.keys(PA_SIZE).map(k => [k, dForecast(own, k, p.mix, p.win).net]).sort((a, b) => b[1] - a[1])[0]; return `For ${own.title}, the tables below put a ${PA_SIZE[best[0]][1].toLowerCase()} campaign highest on net. A genre-fit mix (✓) works about 10% harder.`; }
    const W = fdCal(); const busy = W.slice().sort((a, b) => b.L.length - a.L.length)[0]; return busy && busy.L.length ? `${W.reduce((t, x) => t + x.L.length, 0)} films open here in the next eight weeks; the week of ${fmtDate(busy.w, true)} is the most crowded (${busy.L.length}).` : 'A quiet calendar ahead.'; }
  if (t === 'stream') return S.year < 2013 ? 'Streaming is years away. For now, a film\'s second life is home video and television.' : 'Licence fees follow the cinema gross and quality. Holding out for a better bid can pay, but the offer may not come back.';
  if (t === 'forecast') { const sc = fcScore(); return sc.n ? `The desk was within 50% on ${Math.round(sc.hit * 100)}% of last year's releases here. Tracking narrows it from about a month out.` : 'Not enough releases yet to score the desk.'; }
  if (t === 'calls') { const C = fdCalls(), R = fdRecord(), sc = fcScore(); return R.n ? `Your record: ${R.ok} of ${R.n} (${Math.round(R.ok / R.n * 100)}%).${M.callCol ? ' The column runs while you stay above 50% over your last ten.' : R.n < 12 ? ` ${12 - R.n} more graded calls and the trades will look at your record.` : R.ok / R.n < .65 ? ' The trades want 65% before they offer a column.' : ''}` : `Call films over or under the desk's median. A coin flip wins half the time; the desk itself is within 50% on ${sc.hit !== null ? Math.round(sc.hit * 100) + '%' : 'most'} of films.`; }
  return '';
}
function fdFrame(t) {
  const s = fdSeat(), steps = fdNextSteps(s);
  return `<div class="fd-frame"><div class="fd-seat"><span class="fd-k">SEAT</span>${FD_SEATS.map(([n, d], i) => `<span class="fd-s${i === s ? ' on' : i < s ? ' past' : ''}" title="${esc(d)}">${n}</span>`).join('<i>›</i>')}${steps.length ? `<span class="fd-nx">Next: ${steps.map(([l, go, b]) => `<button class="tk-chip" data-jump="${go}" title="${esc(l)}">${b}</button> <span class="tk-mut">${esc(l)}</span>`).join(' · ')}</span>` : ''}</div>
   <div class="fd-log">${fdLog().map(([i, l, go]) => `<button class="fd-lg" data-fd="${go}">${i} ${esc(l)}</button>`).join('')}</div>${(() => { const n = fdNote(t); return n ? `<p class="fd-note"><b>DESK NOTE</b> ${esc(n)}</p>` : ''; })()}</div>`;
}
function fdEmpty(why, what, steps) {
  return `<div class="fd-empty"><div><b>Why it's empty</b><p>${why}</p></div><div><b>What goes here</b><p>${what}</p></div><div><b>Next step</b><p>${steps.map(([l, go]) => `<button class="tk-chip" data-jump="${go}">${l}</button>`).join(' ')}</p></div></div>`;
}

// ---- the world's own films, for every tab ----
function fdProxyQ(f) { const d = P(f.dir), W = (f.wri || []).map(P).filter(Boolean), C = (f.cast || []).map(P).filter(Boolean), g = f.genre;
  const a = d ? gcraft(d, 'dir', g) : 10, b = W.length ? avg(W.map(w => gcraft(w, 'wri', g))) : 10, k = C.length ? avg(C.map(p => gcraft(p, 'act', g))) : 10; return clamp((a * .4 + b * .35 + k * .25) * 5, 10, 95); }
function fdWorldCuts() {
  const m = HUBS[S.me.hub].m, L = S.active.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3 && f.m === m && (f.tier || 3) <= 3).sort((a, b) => b.budget - a.budget).slice(0, 10);
  const row = f => { const leak = gH(f.id, 'leak') < .5, t2b = leak ? Math.round(clamp(fdProxyQ(f) * .85 + 12 + (gH(f.id, 'leak2') - .5) * 18, 20, 95)) : null, re = leak && t2b < 55 && gH(f.id, 'reshoot') < .6;
    return `<tr><td>${fl(f.id)}</td><td class="tk-mut">${f.co !== null && f.co !== undefined && S.companies[f.co] ? esc(S.companies[f.co].name) : ''}</td><td>${esc(f.genre)}</td><td class="n">${fmtM(f.budget)}</td><td class="n">${Math.max(0, f.stageEnd - S.week)} wk</td><td class="n ${t2b === null ? 'tk-mut' : t2b >= 70 ? 'up' : t2b < 55 ? 'dn' : ''}">${t2b === null ? 'no leak' : t2b + '%'}</td><td class="tk-mut">${re ? 'reshoot rumoured' : t2b !== null && t2b >= 75 ? 'studio thrilled' : ''}</td></tr>`; };
  return `<section class="tk-p tk-wide"><h4>THE CUTTING ROOMS <span class="tk-sub">films in post-production here · leaked test scores, unconfirmed</span></h4><table class="tk-t"><thead><tr><th>Film</th><th>Studio</th><th>Genre</th><th class="n">Budget</th><th class="n">Opens</th><th class="n">Top-two-box</th><th>Word</th></tr></thead><tbody>${L.map(row).join('') || '<tr><td colspan="7" class="tk-mut">Nobody is in post right now.</td></tr>'}</tbody></table><p class="tk-foot">Leaks come from people who were in the room; a leak that says "reshoot" usually means a studio unhappy with the ending. Call the openings on the Call it tab.</p></section>`;
}
function fdRecent() { if (FD_C.w !== S.week) { FD_C.w = S.week; FD_C.rec = null; FD_C.line = {}; FD_C.bias = {}; } return FD_C.rec || (FD_C.rec = S.films.filter(f => f.rel !== null && f.rel > S.week - 52 && f.total > 0)); }
const FD_C = { w: -1, rec: null, line: {}, bias: {} };
function fdTerrHeat() {
  const T = {}; for (const f of fdRecent()) for (const m in f.gross || {}) if (m !== f.m && f.gross[m] > 0) { const x = T[m] = T[m] || { m, v: 0, n: 0 }; x.v += f.gross[m]; x.n++; }
  return Object.values(T).sort((a, b) => b.v - a.v);
}
function fdDealSheet() {
  const L = fdRecent().filter(f => f.foreign > 0).sort((a, b) => b.foreign - a.foreign).slice(0, 10), H = fdTerrHeat().slice(0, 10), mx = H.length ? H[0].v : 1;
  const best = f => Object.entries(f.gross).filter(([m]) => m !== f.m).sort((a, b) => b[1] - a[1])[0];
  return `<section class="tk-p tk-wide"><h4>WHAT TRAVELLED <span class="tk-sub">the year's biggest earners outside their home market</span></h4><table class="tk-t"><thead><tr><th>Film</th><th>From</th><th>Genre</th><th class="n">Abroad</th><th class="n">Share</th><th>Best territory</th></tr></thead><tbody>${L.map(f => { const b = best(f); return `<tr><td>${fl(f.id)}</td><td class="tk-mut">${esc(MARKETS[f.m].name)}</td><td>${esc(f.genre)}</td><td class="n">${fmtM(f.foreign)}</td><td class="n">${Math.round(f.foreign / f.total * 100)}%</td><td class="tk-mut">${b ? `${esc(MARKETS[b[0]].name)} ${fmtM(b[1])}` : ''}</td></tr>`; }).join('') || '<tr><td colspan="6" class="tk-mut">Nothing yet this year.</td></tr>'}</tbody></table></section>
   <section class="tk-p"><h4>WHO'S BUYING <span class="tk-sub">imported films' gross, last 12 months</span></h4><div class="tk-bars">${H.map(x => `<div class="tk-bar"><span>${esc(MARKETS[x.m].name)}</span><i style="width:${(x.v / mx * 100).toFixed(0)}%"></i><b>${fmtM(x.v)}</b><span class="tk-mut">${x.n} films</span></div>`).join('')}</div><p class="tk-foot">A big importer pays bigger minimum guarantees. Offers follow the territory's size, how your genre travels there and the lead's name abroad.</p></section>`;
}
function fdCal() {
  const m = HUBS[S.me.hub].m, W = []; for (let i = 0; i < 8; i++) W.push({ w: S.week + i, L: [] });
  for (const f of S.active.map(i => S.films[i])) if (f && f.rel === null && f.stage === 3 && f.m === m && f.stageEnd >= S.week && f.stageEnd < S.week + 8) W[f.stageEnd - S.week].L.push(f);
  return W;
}
function fdRelCal() {
  const W = fdCal(), mx = Math.max(1, ...W.map(x => x.L.length)), m = HUBS[S.me.hub].m;
  const past = fdRecent().filter(f => f.rel > S.week - 6 && f.m === m && (f.tier || 3) <= 3).sort((a, b) => b.total - a.total).slice(0, 8);
  return `<section class="tk-p tk-wide"><h4>THE RELEASE CALENDAR <span class="tk-sub">${esc(MARKETS[m].name)}, the next eight weeks</span></h4><table class="tk-t"><thead><tr><th>Week of</th><th>Opening</th><th class="n">Crowding</th></tr></thead><tbody>${W.map(x => `<tr><td class="tk-mut nowrap">${esc(fmtDate(x.w, true))}</td><td>${x.L.sort((a, b) => b.budget - a.budget).slice(0, 4).map(f => `${fl(f.id)} <span class="tk-mut">${esc(f.genre)} · ${fmtM(f.budget)}</span>`).join('<br>') || '<span class="tk-mut">nothing wide</span>'}${x.L.length > 4 ? `<br><span class="tk-mut">+${x.L.length - 4} more</span>` : ''}</td><td class="n"><span class="fd-crowd"><i style="width:${(x.L.length / mx * 100).toFixed(0)}%"></i></span> ${x.L.length}</td></tr>`).join('')}</tbody></table></section>
   <section class="tk-p tk-wide"><h4>HOW LAST MONTH'S OPENERS DID <span class="tk-sub">gross against cost; under ×2 rarely makes money once P&amp;A is in</span></h4><table class="tk-t"><thead><tr><th>Film</th><th>Genre</th><th class="n">Cost</th><th class="n">Gross</th><th class="n">×</th><th class="n">Critics</th></tr></thead><tbody>${past.map(f => `<tr><td>${fl(f.id)}</td><td>${esc(f.genre)}</td><td class="n">${fmtM(f.cost)}</td><td class="n">${fmtM(f.total)}</td><td class="n ${f.total / f.cost >= 2 ? 'up' : 'dn'}">${(f.total / f.cost).toFixed(2)}</td><td class="n tk-mut">${f.reviews || ''}</td></tr>`).join('') || '<tr><td colspan="6" class="tk-mut">Nothing opened lately.</td></tr>'}</tbody></table></section>`;
}

// ---- the awards race, opened up: what each contender's score is made of ----
function fdRaceWhy() {
  const m = HUBS[S.me.hub].m, R = raceOdds(m, 'film').slice(0, 5); if (!R.length) return '';
  const parts = f => { const c = f.camp || 0, p = f.prec || 0, foc = f.campF === 'film' ? c * .5 : 0; return [['Quality', f.q || 0, 'q'], ['Campaign', c, 'c'], ['Precursors', p, 'p'], ['Pushed for Best Film', foc, 'f']]; };
  const mx = Math.max(...R.map(([f]) => parts(f).reduce((t, x) => t + x[1], 0)), 1);
  return `<section class="tk-p tk-wide"><h4>WHAT THE VOTES ARE MADE OF <span class="tk-sub">Best Film, ${esc(MARKETS[m].name)}: each contender's score, piece by piece</span></h4><div class="fd-why">${R.map(([f, o]) => { const P0 = parts(f), tot = P0.reduce((t, x) => t + x[1], 0);
    return `<div class="fd-wr"><span class="fd-wt">${fl(f.id)}</span><span class="fd-wb">${P0.filter(x => x[1] > .05).map(([l, v, k]) => `<i class="fd-w${k}" style="width:${(v / mx * 100).toFixed(1)}%" title="${esc(l)} ${v.toFixed(1)}"></i>`).join('')}</span><span class="fd-wn">${tot.toFixed(1)}</span><b class="fd-wo">${Math.round(o * 100)}%</b></div>`; }).join('')}</div>
   <p class="tk-foot"><span class="fd-key fd-wq"></span> quality <span class="fd-key fd-wc"></span> campaign <span class="fd-key fd-wp"></span> precursors <span class="fd-key fd-wf"></span> the category you push. Odds come from the gaps: every 3 points behind the leader divides a film's chances by about 2.7. Quality is fixed once the film is out; the rest is money, timing and December's critics.</p></section>`;
}

// ---- Call it ----
function fdCalls() { const M = S.me; return M.calls = M.calls || { open: [], done: [] }; }
function fdRecord(n) { const D = fdCalls().done, L = n ? D.slice(-n) : D; return { n: L.length, ok: L.filter(x => x.ok).length }; }
function fdCallable() {
  const m = HUBS[S.me.hub].m, C = fdCalls(), taken = new Set(C.open.map(x => x.f).concat(C.done.map(x => x.f)));
  return S.active.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3 && (f.tier || 3) <= 3 && f.stageEnd >= S.week + 1 && f.stageEnd <= S.week + 8 && (f.m === m || f.tier === 1) && !taken.has(f.id) && !fdOwn(f)).sort((a, b) => b.budget - a.budget).slice(0, 12);
}
// the line: the desk's median, moved by how far the desk ran off in that market over the last year, so that about
// half of films land on each side of it
function fdBias(m) { fdRecent(); if (FD_C.bias[m] !== undefined) return FD_C.bias[m];
  const L = fdRecent().filter(f => f.m === m && f.cost > 0 && (f.tier || 3) <= 3).slice(-40), e = L.map(f => Math.log(f.total / Math.max(.01, fcRun({ id: f.id, m: f.m, genre: f.genre, tier: f.tier || 3, budget: f.budget, asOf: f.rel }).mid)));
  return (FD_C.bias[m] = e.length >= 6 ? clamp(Math.exp(fcQ(e, .5)), .5, 2.5) : 1); }
function fdLine(f) { fdRecent(); return FD_C.line[f.id] ?? (FD_C.line[f.id] = fcRun({ id: f.id, f, m: f.m, genre: f.genre, tier: f.tier || 3, budget: f.budget, hook: null }).mid * fdBias(f.m)); }
function fdCallAct(a) {
  const f = S.films[a.film], C = fdCalls(); if (!f || f.rel !== null || !['over', 'under'].includes(a.side) || C.open.some(x => x.f === f.id) || C.done.some(x => x.f === f.id) || C.open.length >= 8) return false;
  C.open.push({ f: f.id, line: Math.round(fdLine(f) * 100) / 100, side: a.side, w: S.week }); return true;
}
function fdCallsWeek() {
  const M = S.me; if (!M || !M.calls) return; const C = M.calls, me = ME(); let right = 0, wrong = 0;
  for (const x of C.open.slice()) { const f = S.films[x.f]; if (!f || f.stage < 0) { C.open.splice(C.open.indexOf(x), 1); continue; } if (f.rel === null) continue;
    const ok = x.side === 'over' ? f.total > x.line : f.total < x.line; C.open.splice(C.open.indexOf(x), 1); C.done.push(Object.assign(x, { ok, total: f.total, gw: S.week })); if (ok) right++; else wrong++; }
  if (C.done.length > 120) C.done.splice(0, C.done.length - 120);
  if (M.callCol && (right || wrong)) me.standing = clamp(me.standing + clamp(right * .08 - wrong * .05, -.2, .3), 0, 100);   // in print, people remember who was right and who was loudly wrong
  // the column: offered on a good record, kept while you stay sharp
  const R = fdRecord(), R10 = fdRecord(10);
  if (!M.callCol && (!M.callColAsk || S.week - M.callColAsk > 26) && R.n >= 12 && R.ok / R.n >= .65) { M.callColAsk = S.week; inbox('callcol', 'The trades want your column', `Someone at the trades has noticed your calls: ${R.ok} right out of ${R.n}. They'd like a weekly box-office column under your name, paid by the piece. You keep it as long as you keep being right.`, { choices: [{ k: 'cc_yes', label: `Write it (${fmtCash(usd(350))} a week)` }, { k: 'cc_no', label: 'Not now' }] }); }
  if (M.callCol) { if (R10.n >= 10 && R10.ok < 5) { M.callCol = null; M.callColAsk = null; inbox('note', 'The column is dropped', 'Five wrong calls in your last ten, and the editor noticed before the readers did. The column goes to someone else. Get your record back up and they may come back.'); }
    else { M.cash += usd(350); M.callCol.n = (M.callCol.n || 0) + 1; if (M.callCol.n % 8 === 0) me.fame = (me.fame || 0) + .2; } }
}
function fdCallPick(it, k) {
  if (it.kind !== 'callcol') return false; it.done = true;
  if (k === 'cc_yes') { S.me.callCol = { since: S.week, n: 0 }; it.result = { t: 'Your first column runs on Friday. People who never answered your texts are suddenly quoting you.' }; }
  else it.result = { t: 'You pass. The offer may come round again if your record holds.' };
  return true;
}
function fdCallsHTML() {
  const C = fdCalls(), L = fdCallable(), R = fdRecord(), sc = fcScore();
  const open = C.open.map(x => { const f = S.films[x.f]; return f ? `<tr><td>${fl(f.id)}</td><td class="n">${fmtM(x.line)}</td><td><b class="${x.side === 'over' ? 'up' : 'dn'}">${x.side === 'over' ? '▲ over' : '▼ under'}</b></td><td class="tk-mut">opens ${esc(fmtDate(f.stageEnd, true))}</td></tr>` : ''; }).join('');
  const done = C.done.slice(-12).reverse().map(x => { const f = S.films[x.f]; return f ? `<tr><td>${fl(f.id)}</td><td class="n">${fmtM(x.line)}</td><td>${x.side === 'over' ? '▲ over' : '▼ under'}</td><td class="n">${fmtM(x.total)}</td><td class="${x.ok ? 'up' : 'dn'}">${x.ok ? '✓ right' : '✗ wrong'}</td></tr>` : ''; }).join('');
  const spark = C.done.length >= 3 ? (() => { let a = 0; return tSpark(C.done.slice(-30).map((x, i) => (a += x.ok ? 1 : 0, a / (i + 1) * 100)), 140, 26); })() : '';
  return `<div class="tk-grid"><section class="tk-p"><h4>YOUR RECORD</h4><div class="tk-kpis"><div class="tk-kpi"><span>CALLS</span><b class="tk-v">${R.n}</b></div><div class="tk-kpi"><span>RIGHT</span><b class="tk-v ${R.n && R.ok / R.n >= .5 ? 'up' : R.n ? 'dn' : ''}">${R.n ? Math.round(R.ok / R.n * 100) + '%' : '—'}</b></div><div class="tk-kpi"><span>COLUMN</span><b class="tk-v">${S.me.callCol ? 'running' : R.n >= 12 ? (S.me.callColAsk ? 'offered' : 'not yet') : `${R.n}/12`}</b></div></div>${spark}<p class="tk-foot">Twelve graded calls at 65% or better and the trades offer you a weekly column. It pays ${fmtCash(usd(350))} a week while you keep at least five of your last ten, and once you're in print every call moves your standing a little: up when you're right, down when you're loudly wrong.</p></section>
   <section class="tk-p tk-wide"><h4>ON THE BOARD <span class="tk-sub">opening in the next eight weeks · the line is the desk's median gross, corrected for how far it ran off last year (×${fdBias(HUBS[S.me.hub].m).toFixed(2)} here)</span></h4><table class="tk-t"><thead><tr><th>Film</th><th>Genre</th><th class="n">Budget</th><th class="n">The line</th><th>Opens</th><th></th></tr></thead><tbody>${L.map(f => `<tr><td>${fl(f.id)}</td><td>${esc(f.genre)}</td><td class="n">${fmtM(f.budget)}</td><td class="n">${fmtM(fdLine(f))}</td><td class="tk-mut nowrap">${esc(fmtDate(f.stageEnd, true))}</td><td class="nowrap"><button class="tk-chip" data-fd="call:${f.id}:over">▲ Over</button><button class="tk-chip" data-fd="call:${f.id}:under">▼ Under</button></td></tr>`).join('') || '<tr><td colspan="6" class="tk-mut">Nothing on the board this week.</td></tr>'}</tbody></table><p class="tk-foot">The desk was within 50% on ${sc.hit !== null ? Math.round(sc.hit * 100) + '%' : 'most'} of last year's releases. Check a film on the Forecast tab first: tracking, the date and what else opens that week are where an edge comes from.</p></section>
   <section class="tk-p tk-wide"><h4>OPEN CALLS</h4><table class="tk-t"><tbody>${open || '<tr><td class="tk-mut">None open. Up to eight at a time.</td></tr>'}</tbody></table></section>
   <section class="tk-p tk-wide"><h4>GRADED</h4><table class="tk-t"><thead><tr><th>Film</th><th class="n">Line</th><th>Your call</th><th class="n">Gross</th><th></th></tr></thead><tbody>${done || '<tr><td colspan="5" class="tk-mut">Calls are graded the week the film opens.</td></tr>'}</tbody></table></section></div>`;
}
function fdGlossHTML() {
  const M = S.me, c = typeof myCo === 'function' ? myCo() : null, F = c ? c.films.map(i => S.films[i]).filter(Boolean) : [];
  const mine = { mg: (() => { for (const f of F) for (const [m, s] of Object.entries(f.sales || {})) if (s.st === 'sold') return `Your ${f.title}: ${MARKETS[m].name} for ${fmtM(s.mg)}.`; return ''; })(),
    pa: (() => { const f = F.find(f => f.dplan); return f ? `Your ${f.title}: a ${PA_SIZE[f.dplan.pa][1].toLowerCase()} campaign.` : ''; })(),
    t2b: (() => { const f = F.find(f => f.scr && f.scr.last); return f ? `Your ${f.title} last tested at ${f.scr.last.t2b}%.` : ''; })(),
    line: (() => { const R = fdRecord(); return R.n ? `You've called ${R.n} lines and got ${R.ok} right.` : ''; })() };
  return `<section class="tk-p tk-wide"><h4>THE TRADE'S WORDS <span class="tk-sub">underlined wherever they appear on the desk</span></h4><dl class="fd-gloss">${Object.entries(GLOSS).map(([k, [n, d]]) => `<dt>${esc(n)}</dt><dd>${esc(d)}${mine[k] ? ` <span class="up">${esc(mine[k])}</span>` : ''}</dd>`).join('')}</dl></section>`;
}

// ---- the frame around every tab ----
{ const _fd = fdHTML; fdHTML = function () {
  const t = UI.fdT || 'screen', own = t === 'calls' || t === 'gloss';
  let h; if (own) { UI.fdT = 'screen'; try { h = _fd(); } finally { UI.fdT = t; } const i = h.indexOf('</div>', h.indexOf('class="tk-top"')); h = h.slice(0, i).replace(/ on"/g, '"') + '</div>' + (t === 'calls' ? fdCallsHTML() : fdGlossHTML()) + '</div>'; }
  else h = _fd();
  const i = h.indexOf('</div>', h.indexOf('class="tk-top"'));
  h = h.slice(0, i) + `<button class="tk-chip${t === 'calls' ? ' on' : ''}" data-fd="tab:calls">🎯 Call it</button><button class="tk-chip${t === 'gloss' ? ' on' : ''}" data-fd="tab:gloss">? Glossary</button>` + h.slice(i);
  const j = h.indexOf('</div>', h.indexOf('class="tk-top"')) + 6;
  let body = h.slice(j);
  // empty tabs: why, what goes here, what to do, and then the world's own version of it
  body = body.replace('<p class="tk-foot">No film of yours is in post-production. Screenings open once a film you produce or direct finishes shooting.</p>',
    fdEmpty('Test screenings are for films you produce or direct, once the cameras stop.', 'Your film\'s scores (top-two-box, definite recommend, each act), and the fixes: recut, reshoot, a new trailer or lock it.', fdSeat() >= 2 ? [['🎬 Make a film', 'computer:create']] : [['🧰 Find work on a film', 'computer:work'], ['🎨 Fund your script', 'computer:create']]) + `<div class="tk-grid">${fdWorldCuts()}</div>`);
  body = body.replace('<p class="tk-foot">Pre-sales need a film your company is making that hasn\'t been sold abroad already (or to a streamer).</p>',
    fdEmpty('Pre-sales need a film your company is making that hasn\'t already been sold abroad or to a streamer.', 'Your film, territory by territory: what the desk thinks each is worth, the buyer\'s offer, and accept, counter or pass.', [['🎨 Start a company', 'computer:create'], ['🤝 Deal Room', 'computer:deals']]) + `<div class="tk-grid">${fdDealSheet()}</div>`);
  body = body.replace('<p class="tk-foot">Release planning opens for your company\'s films once they\'re in pre-production.</p>',
    fdEmpty('Release plans are for your company\'s films, from pre-production on.', 'The campaign size and what it leads with, the window, and the forecast net of each choice side by side.', [['🎨 Your company', 'computer:create']]) + `<div class="tk-grid">${fdRelCal()}</div>`);
  if (t === 'sales' && body.includes('<div class="tk-grid">') && !body.includes('WHAT TRAVELLED')) body = body.replace(/<\/div>\s*<p class="tk-foot">A minimum guarantee/, `${fdDealSheet()}</div>\n   <p class="tk-foot">A minimum guarantee`);
  if (t === 'awards') body = body.replace(/<div class="tk-grid">/, `<div class="tk-grid">${fdRaceWhy()}`);
  if (t === 'release' && !body.includes('THE RELEASE CALENDAR')) body = body.replace(/<\/div>$/, '') + `<div class="tk-grid">${fdRelCal()}</div></div>`;
  return h.slice(0, j) + fdFrame(t) + glossify(body);
}; }
{ const _fc = fdClick; fdClick = function (t) { const d = t.dataset.fd;
  if (d && d.startsWith('call:')) { const p = d.split(':'); if (!doAct({ t: 'call', film: +p[1], side: p[2] })) inbox('note', 'Not now', 'That call can\'t be made: it\'s taken, the film has opened, or you already have eight open.'); render(true); return true; }
  return _fc(t); }; }
