// ---------------- Your own cinema ----------------
// Buy a screen in your city and programme it yourself, week by week. What's for sale depends on the era: a
// nickelodeon (1905–15), a picture palace (from 1915), a drive-in (1945–85), an art house (from 1950), a video store
// (1978–2010) or a microcinema (from 2005), and always a neighbourhood single screen. Each week you choose what plays:
// a new release (the distributor takes most of the ticket money, but people come), a classic (a flat fee, a smaller
// crowd who love it), a cult film at midnight, your own work. Attendance depends on the film, how fresh it is, what
// your city likes, the weather, the era (television and then streaming empty seats), your cinema's reputation, and
// any event you put on: a Q&A with someone you know who made the film, a double bill, a members' night. Every week
// prints its own little profit and loss. A good cinema becomes a place: people in the business turn up, and the
// reputation it builds is yours too. A cinema bought through the old "A cinema for sale" offer can be run here.
const CIN_KINDS = {
  nickel: { n: 'Nickelodeon', from: 1905, to: 1915, seats: 120, screens: 1, price: 25000, upkeep: 750, tix: .6, appeal: .42, d: 'A shopfront, a sheet and a piano player. Five cents a show, all day.' },
  palace: { n: 'Picture palace', from: 1915, to: 9999, seats: 900, screens: 1, price: 4000000, upkeep: 30000, tix: 1, appeal: .17, d: 'Velvet, gilt and a balcony. Expensive to run, unforgettable when it\'s full.' },
  single: { n: 'Neighbourhood single screen', from: 1905, to: 9999, seats: 280, screens: 1, price: 1200000, upkeep: 10000, tix: 1, appeal: .19, d: 'Three hundred seats, a popcorn machine and regulars who know the projectionist.' },
  drivein: { n: 'Drive-in', from: 1945, to: 1985, seats: 400, screens: 1, price: 900000, upkeep: 7200, tix: .9, appeal: .24, d: 'A screen in a field, speakers on poles, summers only really.' },
  arthouse: { n: 'Art house', from: 1950, to: 9999, seats: 180, screens: 2, price: 1600000, upkeep: 13000, tix: 1.15, appeal: .21, d: 'Two screens, subtitles, a bar. Its audience reads the reviews.' },
  video: { n: 'Video store', from: 1978, to: 2010, seats: 400, screens: 2, price: 250000, upkeep: 5000, tix: .5, appeal: .36, d: 'Rentals by the night. New releases on the wall, classics in the back, staff picks by the till.' },
  micro: { n: 'Microcinema', from: 2005, to: 9999, seats: 60, screens: 1, price: 300000, upkeep: 3600, tix: 1.2, appeal: .38, d: 'Sixty seats above a bar. Programmed like a mixtape.' }
};
const CIN_EVENTS = { qa: ['A Q&A with someone who made it', 1.6], double: ['A double bill', 1.25], members: ['A members\' night', 1.15], midnight: ['A midnight screening', 1.3] };
function cinOf() { return S.me && S.me.cin; }
function cinEra() { const y = S.year; return y < 1950 ? 1 : y < 1960 ? .85 : y < 1980 ? .7 : y < 2000 ? .75 : y < 2015 ? .65 : .55; }   // television, then the sofa
function cinListings() {
  const M = S.me, mo = Math.floor(S.week / 8), r = hashRand((mo * 7919 + HUB_IDS.indexOf(M.hub) * 31) >>> 0);
  return Object.entries(CIN_KINDS).filter(([, K]) => S.year >= K.from && S.year <= K.to).filter(() => r() < .75).map(([k, K]) => ({ k, name: `${pickLine(['The Roxy', 'The Electric', 'The Rio', 'The Lux', 'The Plaza', 'The Regal', 'The Scala', 'The Ritzy', 'The Bijou', 'The Orpheum', 'The Odeon', 'The Gem'], mo * 13 + k.length)}`, price: Math.round(usd(K.price, M.hub) * (.8 + r() * .4) / 1000) * 1000 }));
}
function cinMoney(v, hub) { return usd(v * 1000, hub || (S.me.cin && S.me.cin.hub) || S.me.hub) / 1000; }   // today's dollars in the cinema's city, unrounded
function cinPrice(k) { return cinMoney(CIN_KINDS[k].tix * 12) * (S.year < 1950 ? .4 : 1); }
// what could play this week
function cinNew() { const m = HUBS[S.me.hub].m; return S.films.filter(f => f.rel !== null && f.rel > S.week - 10 && f.rel <= S.week && (f.m === m || (f.gross && f.gross[m] > 0)) && f.total > 0).sort((a, b) => (b.gross[m] || 0) - (a.gross[m] || 0)).slice(0, 8); }
function cinClassics() { const C = cinOf(), seen = new Set(((C && C.hist) || []).slice(-12).flatMap(h => h.films || [])); return S.films.filter(f => f.rel !== null && S.week - f.rel > 52 * 8 && (f.q || 0) >= 72 && !seen.has(f.id)).sort((a, b) => gH(b.id, 'cin' + Math.floor(S.week / 4)) * (b.q + (b.cult || 0) * .3) - gH(a.id, 'cin' + Math.floor(S.week / 4)) * (a.q + (a.cult || 0) * .3)).slice(0, 8); }
function cinMine() { const me = ME(), c = typeof myCo === 'function' ? myCo() : null; return S.films.filter(f => f.rel !== null && ((me.credits || []).includes(f.id) || (c && f.co === c.id))).slice(-4); }
function cinDraw(f) {
  const C = cinOf(), wk = S.week - f.rel, fresh = wk <= 10, bias = (HUBS[S.me.hub].bias || {})[f.genre] || 1;
  const base = fresh ? Math.pow((f.hook || 50) / 50, .7) * ((f.reviews || 55) / 60) * Math.pow(.86, wk) : Math.pow((f.q || 60) / 70, 2) * (.45 + (f.cult || 0) / 200) * .4;   // a revival draws a fraction of a new release
  return base * (1 + (bias - 1) * .6) * (C && C.k === 'arthouse' && !fresh ? 1.3 : 1) * (C && C.k === 'video' && !fresh ? 1.2 : 1);
}
// concessions are counted after their cost (about a fifth of the till)
function cinTerms(wk, k = (S.me.cin || {}).k) { return k === 'video' ? .4 : wk <= 2 ? .7 : wk <= 4 ? .6 : .5; }   // the distributor's share: a sliding scale, steepest on opening (a video store pays for its tapes, about 40% of what they rent for)
// what the distributor takes of a week's door: new releases on the sliding scale; repertory prints 35% or a minimum
function cinHire(C, f, gross) { const wk = S.week - f.rel; return wk <= 10 ? gross * cinTerms(wk, C.k) : C.k === 'video' ? gross * .15 : Math.max(cinMoney(250), gross * .35); }
function cinForecast(C, slots, ev) {
  const K = CIN_KINDS[C.k], appeal = K.appeal * (.7 + C.rep / 100) * cinEra(), wx = typeof wxCrowd === 'function' ? wxCrowd(S.me.hub, S.week).k : 1;
  return slots.map(fid => { const f = S.films[fid]; if (!f) return null; const evm = ev && ev.f === fid ? CIN_EVENTS[ev.k][1] : 1, occ = clamp(appeal * cinDraw(f) * evm * (C.k === 'drivein' ? (woy() >= 18 && woy() <= 38 ? 1.3 : .4) : wx), .02, .95);
    const seats = K.seats / K.screens * 7 * (C.k === 'video' ? 1 : 3), tix = Math.round(seats * occ), fresh = S.week - f.rel <= 10, gross = tix * cinPrice(C.k), hire = cinHire(C, f, gross);   // repertory prints: 35% or a minimum
    return { f: fid, tix, occ, gross, hire, conc: tix * cinMoney(C.k === 'video' ? .8 : 4.4) * (S.year < 1950 ? .4 : 1) }; }).filter(Boolean);
}
function cinAct(a) {
  const M = S.me, C = M.cin;
  if (a.k === 'buy') { if (C) return false; const L = cinListings().find(x => x.k === a.v); if (!L || M.cash < L.price) return false; M.cash -= L.price; M.cin = { k: L.k, hub: M.hub, name: L.name, paid: L.price, w: S.week, rep: 30, prog: [], hist: [] }; milestone(`Bought ${L.name}, a ${CIN_KINDS[L.k].n.toLowerCase()}`, 'money'); return true; }
  if (a.k === 'adopt') { if (C) return false; const H = (M.lateA || []).find(h => h.k === 'cinema'); if (!H) return false; M.lateA = M.lateA.filter(h => h !== H); M.cin = { k: S.year >= 1950 ? 'arthouse' : 'palace', hub: M.hub, name: 'Your cinema', paid: H.val, w: S.week, rep: 45, prog: [], hist: [] }; return true; }
  if (!C) return false; const K = CIN_KINDS[C.k];
  if (a.k === 'prog') { const f = S.films[a.film]; if (!f || f.rel === null || f.rel > S.week) return false; C.auto = 0; if (C.prog.includes(a.film)) { C.prog = C.prog.filter(x => x !== a.film); return true; } if (C.prog.length >= K.screens) C.prog.shift(); C.prog.push(a.film); return true; }
  if (a.k === 'event') { if (!CIN_EVENTS[a.v] || !C.prog.includes(a.film)) return false; if (a.v === 'qa' && !cinGuest(S.films[a.film])) return false; C.ev = C.ev && C.ev.k === a.v && C.ev.f === a.film ? null : { k: a.v, f: a.film }; return true; }
  if (a.k === 'name') { C.name = String(a.v || '').slice(0, 30) || C.name; return true; }
  if (a.k === 'sell') { const v = cinValue(); M.cash += v; milestone(`Sold ${C.name}`, 'money'); M.cin = null; return true; }
  return false;
}
function cinValue() { const C = cinOf(); return Math.round(C.paid * (.7 + C.rep / 200)); }
function cinGuest(f) { if (!f) return null; const ids = keyIds(f).filter(id => S.me.known[id] && P(id) && !P(id).dead && id !== ME().id); return ids.sort((a, b) => opinion(b) - opinion(a))[0] ?? null; }
function cinWeek() {
  const M = S.me, C = M && M.cin; if (!C) return; const K = CIN_KINDS[C.k], me = ME();
  if (!C.prog.length || C.auto) { const L = cinNew().concat(cinClassics()).sort((a, b) => cinDraw(b) * (.6 + gH(b.id, 'mgr' + S.week) * .4) - cinDraw(a) * (.6 + gH(a.id, 'mgr' + S.week) * .4)); C.prog = L.slice(0, K.screens).map(f => f.id); C.auto = 1; }   // the manager programmes it, week by week, until you take it back
  const R = cinForecast(C, C.prog, C.ev).map(x => Object.assign(x, { tix: Math.round(x.tix * (.85 + prnd() * .3)) }));
  let gross = 0, hire = 0, conc = 0, tix = 0; for (const x of R) { const g = x.tix * cinPrice(C.k); gross += g; hire += cinHire(C, S.films[x.f], g); conc += x.tix * cinMoney(C.k === 'video' ? .8 : 4.4) * (S.year < 1950 ? .4 : 1); tix += x.tix; }
  const upkeep = cinMoney(K.upkeep), net = Math.round(gross - hire + conc - upkeep - (C.ev ? cinMoney(300) : 0)); M.cash += net;
  const occ = tix / Math.max(1, K.seats * 7 * (C.k === 'video' ? 1 : 3)), q = avg(R.map(x => S.films[x.f].q || 60));
  C.rep = clamp(C.rep + (occ - .25) * 2 + (q - 65) / 80 + (C.ev ? .4 : 0) - (C.auto ? .12 : 0) - (C.rep - 40) * .02, 0, 100);   // reputation drifts back towards ordinary unless you keep earning it
  if (C.ev && C.ev.k === 'qa') { const g = cinGuest(S.films[C.ev.f]); if (g !== null) { addTie(me, P(g), 4); if (typeof remember === 'function') remember(g, 2, 'Did a Q&A at your cinema'); } }
  if (C.rep >= 55 && prnd() < C.rep / 900) { const q2 = typeof bestIn === 'function' ? bestIn(M.hub, ROLES, q => q.standing + prnd() * 25 - (M.known[q.id] ? 99 : 0)) : null; if (q2 && !M.known[q2.id]) { meet(q2.id, `Met at ${C.name}`, 6); diary(`${q2.name} stays after the screening at ${C.name} to talk about the film. You end up talking till closing.`); } }
  if (C.rep >= 70) me.standing = clamp(me.standing + .03, 0, 100);
  C.hist.push({ w: S.week, films: R.map(x => x.f), tix, gross: Math.round(gross), hire: Math.round(hire), conc: Math.round(conc), upkeep, net, ev: C.ev ? C.ev.k : null }); if (C.hist.length > 52) C.hist.shift();
  C.prog = C.prog.filter(fid => S.films[fid] && S.week - S.films[fid].rel < 12 || S.week - S.films[fid].rel > 52 * 8); C.ev = null;
}
function cinemaHTML() {
  const M = S.me, C = cinOf();
  if (!C) { const L = cinListings(), H = (M.lateA || []).find(h => h.k === 'cinema');
    return `${H ? `<p><b>You already own a cinema</b> through an old purchase. <button class="btn-s" data-cin="adopt">Run it yourself</button></p>` : ''}<h4>For sale in ${esc(HUBS[M.hub].name)}</h4><div class="bzgrid">${L.map(x => { const K = CIN_KINDS[x.k]; return `<div class="bzc"><b>${esc(x.name)}</b><span class="muted small">${esc(K.n)} · ${K.seats} seats${K.screens > 1 ? ` · ${K.screens} screens` : ''}</span><span class="small">${esc(K.d)}</span><span class="small">Running costs ${fmtCash(cinMoney(K.upkeep, M.hub))}/week · tickets ${fmtCash(cinPrice(x.k))}</span><span class="bzp">${fmtCash(x.price)}</span><button class="btn-s" data-cin="buy:${x.k}" ${M.cash < x.price ? 'disabled' : ''}>Buy it</button></div>`; }).join('') || '<p class="muted">Nothing for sale this month. Listings change every two months.</p>'}</div>`; }
  const K = CIN_KINDS[C.k], F = cinForecast(C, C.prog, C.ev), H = C.hist.slice(-8).reverse(), last = C.hist[C.hist.length - 1];
  const pick = (f, tag) => `<tr${C.prog.includes(f.id) ? ' class="tk-mine"' : ''}><td>${fl(f.id)}</td><td class="muted small">${esc(f.genre)} · ${yearOf(f.rel)}${tag ? ' · ' + tag : ''}</td><td class="n">${(cinDraw(f) * 100).toFixed(0)}</td><td><button class="btn-s${C.prog.includes(f.id) ? '' : ' ghost'}" data-cin="prog:${f.id}">${C.prog.includes(f.id) ? 'Playing ✓' : 'Book it'}</button></td></tr>`;
  const evs = C.prog.map(fid => `<p class="small">${fl(fid)}: ${Object.entries(CIN_EVENTS).map(([k, [l, m]]) => { const g = k === 'qa' ? cinGuest(S.films[fid]) : true; return `<button class="pill${C.ev && C.ev.k === k && C.ev.f === fid ? ' on' : ''}" data-cin="event:${k}:${fid}" ${g === null ? 'disabled title="You don\'t know anyone who made it"' : ''}>${esc(l)}${k === 'qa' && g !== null && g !== true ? ` (${esc(P(g).name)})` : ''} ×${m}</button>`; }).join(' ')}</p>`).join('');
  const fc = F.reduce((t, x) => ({ tix: t.tix + x.tix, net: t.net + x.gross - x.hire + x.conc }), { tix: 0, net: 0 });
  return `<div class="tk-kpis"><div class="tk-kpi"><span>REPUTATION</span><b class="tk-v">${Math.round(C.rep)}</b></div><div class="tk-kpi"><span>LAST WEEK</span><b class="tk-v ${last && last.net < 0 ? 'dn' : 'up'}">${last ? fmtCash(last.net) : '—'}</b></div><div class="tk-kpi"><span>THIS WEEK (FORECAST)</span><b class="tk-v">${fc.tix.toLocaleString()} seats · ${fmtCash(Math.round(fc.net - cinMoney(K.upkeep)))}</b></div><div class="tk-kpi"><span>WORTH</span><b class="tk-v">${fmtCash(cinValue())}</b></div></div>
   <p><b>${esc(C.name)}</b>, a ${esc(K.n.toLowerCase())}: ${K.seats} seats, ${K.screens} screen${K.screens > 1 ? 's' : ''}, running costs ${fmtCash(cinMoney(K.upkeep))} a week. ${C.prog.length ? `Playing: ${C.prog.map(fl).join(' and ')}${C.auto ? ' (the manager\'s picks: book a film yourself to take the programme back)' : ''}.` : 'Nothing booked: the manager will pick something safe every week until you book something yourself (it costs a little reputation).'}</p>
   ${evs ? `<h4>This week's event</h4>${evs}` : ''}
   <h4>New releases <span class="muted small">the distributor takes 70% of the tickets for the first fortnight, 60% for the next, then 50%; you keep the popcorn</span></h4><table class="grid small"><thead><tr><th>Film</th><th></th><th class="n">Draw</th><th></th></tr></thead><tbody>${cinNew().map(f => pick(f, `${S.week - f.rel} wk out`)).join('') || '<tr><td colspan="4" class="muted">Nothing new.</td></tr>'}</tbody></table>
   <h4>Classics <span class="muted small">35% of the door or ${fmtCash(cinMoney(250))} a print, whichever is more; a smaller crowd who love it</span></h4><table class="grid small"><tbody>${cinClassics().map(f => pick(f, f.cult >= 60 ? 'cult' : '')).join('')}</tbody></table>
   ${cinMine().length ? `<h4>Your own work</h4><table class="grid small"><tbody>${cinMine().map(f => pick(f, 'yours')).join('')}</tbody></table>` : ''}
   <h4>The books</h4><table class="grid small"><thead><tr><th>Week</th><th>Played</th><th class="n">Seats</th><th class="n">Tickets</th><th class="n">Distributor</th><th class="n">Concessions</th><th class="n">Costs</th><th class="n">Net</th></tr></thead><tbody>${H.map(h => `<tr><td class="muted">${esc(fmtDate(h.w, true))}</td><td class="small">${h.films.map(f => esc(S.films[f].title)).join(', ')}${h.ev ? ` <span class="chip small">${esc(CIN_EVENTS[h.ev][0].toLowerCase())}</span>` : ''}</td><td class="n">${h.tix.toLocaleString()}</td><td class="n">${fmtCash(h.gross)}</td><td class="n">−${fmtCash(h.hire)}</td><td class="n">${fmtCash(h.conc)}</td><td class="n">−${fmtCash(h.upkeep)}</td><td class="n ${h.net < 0 ? 'bad' : 'good'}">${fmtCash(h.net)}</td></tr>`).join('') || '<tr><td colspan="8" class="muted">The first week closes on Sunday.</td></tr>'}</tbody></table>
   <p class="small muted">Draw is how strongly a film pulls here: freshness, reviews, the hook, and what ${esc(HUBS[M.hub].name)} likes. Weather and the era (television, then streaming) move every film. A reputation over 55 brings people in the business through the door; over 70 it lifts your own standing. <button class="btn-s ghost" data-cin="sell">Sell it (${fmtCash(cinValue())})</button></p>`;
}
function cinClick(t) { const d = t.dataset && t.dataset.cin; if (!d) return false; const [k, v, f] = d.split(':'); const a = k === 'prog' ? { t: 'cin', k, film: +v } : k === 'event' ? { t: 'cin', k, v, film: +f } : { t: 'cin', k, v }; if (!doAct(a)) inbox('note', 'Not now', 'That can\'t be done right now.'); render(true); return true; }
OS_EXTRA.cinema = ['🎦', 'Cinema', 'Buy a screen and programme it: new releases, classics, Q&As, the books'];
OS_VIEWS.cinema = () => cinemaHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Money'); if (g && !g[1].includes('cinema')) g[1].push('cinema'); }
if (typeof APP_GUIDE !== 'undefined') APP_GUIDE.cinema = ['Your own cinema.', 'Buy a screen, then book what plays each week: new releases (the distributor takes most of the ticket money), classics (35% of the door or a minimum fee, a smaller loyal crowd), your own work. Add an event to pull a bigger crowd. Sunday closes the books.', 'Good programming builds a reputation; a cinema with a reputation brings the business to you.', [], () => !(S.me && S.me.cin)];
// the cinema stays in the family: an heir who plays on inherits it with its reputation and its books
{ const _ng = nextGenAct; nextGenAct = function () { const cin = S.me && S.me.cin; const ok = _ng(); const L = S.legacy && S.legacy[S.legacy.length - 1]; if (ok && cin && L && L.fam) L.fam.cin = cin; return ok; }; }
{ const _ha = heirAct; heirAct = function (a) { const L = S.legacy && S.legacy[S.legacy.length - 1], F = L && L.fam, ok = _ha(a); if (ok && F && F.cin && !F.cinTaken) { F.cinTaken = 1; S.me.cin = F.cin; diary(`${F.cin.name} comes to you too: the keys, the regulars and a projectionist who has opinions about how your parent ran it.`); } return ok; }; }
