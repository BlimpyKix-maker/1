// ---------------- Streaming: the business behind the services ----------------
// The services used to be a subscriber curve and a list of shows. Now each one is a business, calibrated against the
// research in docs/RESEARCH.md (Round 20): a DVD-by-mail company that adds streaming in 2007 and originals in 2013 and
// becomes the biggest channel in the world; shopping and phone companies that bundle a service with something else;
// studio-owned services from 2019 that spend billions to catch up, lose money for years and pivot to profit.
//  · Every quarter each service adds and loses subscribers. Adds follow the real growth path, scaled by its appeal:
//    the quality of what it has on (its shows and the films it licensed), its price against the others, and its
//    mood (a land grab spends; a profit pivot cuts). Price rises cost a quarter of adds; a password crackdown, once a
//    service is huge, brings a surge. Ad tiers arrive in 2022.
//  · Money: subscribers × revenue per subscriber, content spend by mood, years of losses paid for with debt.
//  · The share price moves on the surprise in subscriber adds (2.5× the miss, capped at ±35% a day), and a fall of a
//    fifth raises the bar for greenlights across the service; a land grab lowers it.
//  · Studios feel it: what the services pay for films rises in a land grab and falls in a pivot (licences in
//    afterlife, the pay-window bids in distrib.js). Cinemas feel the shrinking window.
//  · You can work inside one (eight jobs with their own decisions every fortnight), sell to one (cost-plus offers
//    that buy your backend, overall deals that want a show a year), be bumped by one (an old show found by millions)
//    and be tempted by the worst of it (bought streams). The Streamboard app shows the whole market.
// World numbers run on the world's dice (wstream, per quarter); your decisions on yours.
const SVC_META = {
  netflicks: { on: 2007, dvd: 1997, lead: 1, who: 'independent', p0: 7.99 },
  hula: { on: 2008, who: 'network joint venture', p0: 7.99 },
  prime: { on: 2011, who: 'shopping company (bundled)', p0: 8.99, bundle: 1 },
  dizplus: { on: 2019.85, who: 'studio-owned', p0: 6.99, studio: 1 },
  peartv: { on: 2019.85, who: 'tech company', p0: 4.99, tech: 1 },
  lantern: { on: 2020.4, who: 'studio-owned', p0: 4.99, studio: 1 },
  summit: { on: 2021.2, who: 'studio-and-network', p0: 4.99, studio: 1 }
};
// two more studio-owned services, as networks so they commission shows and bid for films like the others
if (typeof TV_NETS !== 'undefined') {
  TV_NETS.lantern = TV_NETS.lantern || { k: 'lantern', name: 'Lantern+', kind: 'streaming', hub: 'hollywood', founded: 2020, orig: 2020, per: 2, d: 'A studio\'s own service, built on a century of its films and the shows it stopped licensing to everyone else.' };
  TV_NETS.summit = TV_NETS.summit || { k: 'summit', name: 'Summit+', kind: 'streaming', hub: 'newyork', founded: 2021, orig: 2021, per: 1, d: 'A studio and a network merged their services: sport, reality and a deep library.' };
}
// the real growth paths (global subscribers, millions) the adds follow when appeal is average
const SVC_PATH = {
  netflicks: [[1999, .1], [2002, .8], [2005, 4], [2007, 7.5], [2009, 12], [2011, 24], [2014, 57], [2017, 117], [2019, 167], [2022, 231], [2024, 302], [2027, 360], [2035, 430]],
  hula: [[2008, .2], [2012, 3], [2015, 9], [2019, 28], [2022, 46], [2024, 51], [2030, 60]],
  prime: [[2011, 3], [2014, 25], [2016, 60], [2020, 150], [2024, 200], [2030, 230]],
  dizplus: [[2019.85, 1], [2020, 26], [2020.5, 57], [2021, 95], [2022, 150], [2024, 150], [2030, 180]],
  peartv: [[2019.85, 1], [2020.5, 10], [2022, 20], [2024, 45], [2030, 60]],
  lantern: [[2020.4, 1], [2021, 25], [2022, 70], [2024, 110], [2030, 140]],
  summit: [[2021.2, 1], [2022, 40], [2023, 60], [2024, 70], [2030, 85]]
};
const SVC_PRICE = { netflicks: [[2007, 8.99], [2011, 7.99], [2014, 8.99], [2017, 10.99], [2019, 12.99], [2022, 15.49], [2025, 17.99], [2026, 19.99]] };
const svcYear = w => 2000 + (w - weekOfYear(2000)) / 52;
function svcInterp(P, y) { if (y <= P[0][0]) return P[0][1] * Math.max(0, (y - (P[0][0] - 1))); for (let i = 1; i < P.length; i++) if (y <= P[i][0]) { const [a, va] = P[i - 1], [b, vb] = P[i]; return va + (vb - va) * (y - a) / (b - a); } const [a, va] = P[P.length - 2], [b, vb] = P[P.length - 1]; return vb + (vb - va) * Math.min(1, (y - b) / 10) * .5; }
function svcAll() { return S.svc = S.svc || {}; }
function svcOf(k) { return svcAll()[k] || null; }
function svcLive(y = svcYear(S.week)) { return Object.keys(SVC_META).filter(k => SVC_META[k].on <= y && TV_NETS[k] && !(svcOf(k) || {}).closed); }

// ---- the state when the world first needs it (history before the simulated years is the real path) ----
function svcBirth(k, y) {
  const m = SVC_META[k], subs = Math.max(.1, svcInterp(SVC_PATH[k], y)), price = SVC_PRICE[k] ? svcInterp(SVC_PRICE[k], y) : Math.min(svcPriceLead(y) * .85, m.p0 * Math.pow(1.12, Math.max(0, y - m.on)));
  const rev = subs * price * .72 * 12;
  return { k, subs, price, adOn: 0, ad: 0, churn: m.lead ? .022 : .05, cash: rev * .1, debt: m.lead ? Math.max(0, (y - 2012) * 1800 - Math.max(0, y - 2019) * 4000) : m.studio ? 2000 * Math.max(0, y - m.on) : 0,
    spend: rev * (y - m.on < 4 ? (m.studio ? 1 : .75) : .5), amort: rev * (y - m.on < 4 ? (m.studio ? .95 : .7) : .48), stock: 100, mood: y - m.on < (m.lead ? 9 : 4) ? 'land grab' : 'steady', bar: 1, lossY: 0, lastRise: S.week - 40, crack: 0,
    adds: [], exp: 0, boost: 0, sport: 0, h: [{ w: S.week, subs: +subs.toFixed(1), price: +price.toFixed(2), rev: Math.round(rev), op: 0, stock: 100 }] };
}
function svcPriceLead(y) { return svcInterp(SVC_PRICE.netflicks, y); }
// appeal 0..1: what's on, the price against the others, and the mood
function svcAppeal(k, s) {
  const net = TV_NETS[k], y = S.year, shows = typeof tvAll === 'function' ? tvAll().filter(x => x.net === k && x.y >= y - 2) : [];
  const showQ = shows.length ? shows.reduce((t, x) => t + x.q, 0) / shows.length / 100 : .5;
  const T = typeof strm === 'function' ? strm().t.filter(t => t.sv === k && S.week - t.w0 < 52) : [], lib = Math.min(1, T.length / 40);
  const L = svcLive().map(svcOf).filter(Boolean), avgP = L.reduce((t, x) => t + x.price, 0) / Math.max(1, L.length), priceComp = clamp(1 - (s.price - avgP) / Math.max(1, avgP), .3, 1.3) / 1.3;
  return clamp(.35 * showQ + .25 * lib + .2 * priceComp + .2 * (s.mood === 'land grab' ? .8 : s.mood === 'profit pivot' ? .35 : .55) + s.boost + (rnd() - .5) * .12, .05, 1);
}
// ---- every quarter ----
function svcQuarter() {
  const y = svcYear(S.week), A = svcAll(); R = wstream('svc', S.week);
  for (const k of Object.keys(SVC_META)) if (SVC_META[k].on <= y && !A[k] && TV_NETS[k]) { A[k] = svcBirth(k, y); if (S.year >= S.startYear) svcNews(`${TV_NETS[k].name} launches at $${A[k].price.toFixed(2)} a month. ${SVC_META[k].studio ? 'Its parent stops licensing films to everyone else.' : SVC_META[k].lead ? 'The DVD-by-mail company now streams too, at no extra cost.' : ''}`); }
  const live = svcLive(y).map(svcOf).filter(Boolean); if (!live.length) return;
  const lead = A.netflicks;
  for (const s of live) {
    const m = SVC_META[s.k], path = SVC_PATH[s.k], pathAdds = svcInterp(path, y + .25) - svcInterp(path, y), ap = svcAppeal(s.k, s);
    let mul = clamp(ap / .5, .3, 1.8);
    if (S.week - s.lastRise < 13) mul *= .6;   // the month after a price rise
    if (s.crack && S.week - s.crack < 39) mul *= 2.2;   // the crackdown surge
    if (s.sport && S.week - s.sport < 52) mul *= 1.05;
    const adds = pathAdds * mul + (pathAdds < .5 ? 0 : (rnd() - .5) * pathAdds * .2);
    const exp = pathAdds * (s.expMul || 1);   // the market knows the growth path; it prices the surprise against it
    s.subs = Math.max(.1, s.subs + adds); s.adds.push(+adds.toFixed(2)); if (s.adds.length > 8) s.adds.shift();
    // price: a rise every year and a half or two, sooner once dominant or in a pivot
    const share = s.subs / live.reduce((t, x) => t + x.subs, 0);
    if (S.week - s.lastRise >= 78 && y >= 2011 && rnd() < (share > .3 || s.mood === 'profit pivot' ? .5 : .25)) { const d = rnd() < .5 ? 1 : 2; s.price += d; s.lastRise = S.week; svcNews(`${TV_NETS[s.k].name} raises its price by $${d} to $${s.price.toFixed(2)} a month.`); }
    if (y >= 2022.75 && !s.adOn && !m.bundle && (m.lead || m.studio)) { s.adOn = S.week; svcNews(`${TV_NETS[s.k].name} launches a cheaper plan with ads at $${(s.price * .45).toFixed(2)}.`); }
    if (s.adOn) s.ad = Math.min(.45, s.ad + .05);
    if (m.lead && !s.crack && y >= 2023 && s.subs >= 200) { s.crack = S.week; s.boost -= .02; svcNews(`${TV_NETS[s.k].name} ends password sharing outside the household. Sign-ups hit a record within days.`); }
    // money ($ millions, real scale)
    const arpu = s.price * .72 * (1 - s.ad) + s.ad * (s.price * .45 * .72 + Math.min(6, 2 + Math.max(0, y - 2023) * 1.2)), rev = s.subs * arpu * 3;
    const rate = s.mood === 'land grab' ? (m.studio ? 1.0 : m.lead && y < 2016 ? .8 : .75) : s.mood === 'profit pivot' ? .4 : .5;
    const spend = rev * rate * (s.sport && S.week - s.sport < 52 ? 1.1 : 1);
    s.amort = s.amort * .75 + spend * .25; const other = rev * .22, op = rev - s.amort - other;
    s.cash += rev - spend - other - s.debt * .015; if (s.cash < 0) { s.debt += -s.cash; s.cash = 0; }
    s.debt = Math.max(0, s.debt - Math.max(0, s.cash - rev) * .5); if (s.cash > rev) s.cash = rev;
    s.rev = rev; s.op = op; s.spend = spend;
    // the market: the surprise in adds (or, once a giant stops reporting them, in revenue)
    const surprise = m.lead && y >= 2025 ? (rev / Math.max(1, s.prevRev || rev) - 1.015) * 3 : (adds - exp) / Math.max(.5, Math.abs(exp)); s.expMul = (s.expMul || 1) * .6 + mul * .4;
    const ret = clamp(2.5 * surprise * .4, -.35, .35) + .015 + (s.op > 0 ? .005 : -.005) + (rnd() - .5) * .06; s.prevRev = rev;
    const before = s.stock; s.stock = Math.max(3, s.stock * (1 + ret));
    if (ret <= -.2) { s.bar *= 1.25; svcNews(`${TV_NETS[s.k].name} misses its subscriber forecast. The shares fall ${Math.round(-ret * 100)}% and every project without a start date is frozen.`); }
    else if (ret >= .15) svcNews(`${TV_NETS[s.k].name} beats forecasts by ${Math.abs(adds - exp).toFixed(1)}M subscribers; shares jump ${Math.round(ret * 100)}%.`);
    if (s.mood === 'land grab' && adds > s.subs * .04) s.bar *= .92;
    s.bar = 1 + (s.bar - 1) * .85;
    // moods: a land grab for the first years, then steady; years of losses force a pivot
    if (Math.floor(y) !== Math.floor(y - .25)) { s.lossY = s.op * 4 < 0 ? s.lossY + 1 : 0; }
    if (s.mood === 'land grab' && y - m.on >= (m.lead ? 9 : 4)) { s.mood = 'steady'; svcNews(`${TV_NETS[s.k].name} says growth now has to pay for itself.`); }
    if (s.mood !== 'profit pivot' && (s.lossY >= 2 || s.debt > rev * 16) && y >= 2021) { s.mood = 'profit pivot'; s.pivot = S.week; s.boost -= .03; svcNews(`${TV_NETS[s.k].name} pivots to profit: fewer shows, a higher price, and ${10 + Math.floor(rnd() * 30)} titles pulled and written off.`); svcPivotHits(s); }
    if (s.mood === 'profit pivot' && s.op > 0 && S.week - (s.pivot || 0) > 104) s.mood = 'steady';
    s.boost *= .6;
    s.h.push({ w: S.week, subs: +s.subs.toFixed(1), price: +s.price.toFixed(2), rev: Math.round(rev), op: Math.round(op), stock: +s.stock.toFixed(1), ad: +s.ad.toFixed(2) }); if (s.h.length > 160) s.h.shift();
  }
  // sport: once a year a package goes to whoever bids most
  if (S.week % 52 < 13 && y >= 2017 && rnd() < .3) { const b = live.filter(s => s.cash > 500 || SVC_META[s.k].lead || SVC_META[s.k].bundle).sort((a, c) => c.subs - a.subs)[Math.floor(rnd() * 2)]; if (b) { b.sport = S.week; svcNews(`${TV_NETS[b.k].name} wins a live sports package for $${(.5 + rnd() * 2).toFixed(1)}B a year.`); } }
  // consolidation: two small studio-owned services merge after three years in the leader's shadow
  if (lead && y >= 2023) { const small = live.filter(s => SVC_META[s.k].studio && s.subs < lead.subs * .4); for (const s of small) s.small = (s.small || 0) + 1;
    const ripe = small.filter(s => s.small >= 12).sort((a, c) => a.subs - c.subs); if (ripe.length >= 2 && rnd() < .15) { const [a, b] = ripe; b.subs += a.subs * .8; a.closed = S.week; a.into = b.k; svcNews(`${TV_NETS[a.k].name} folds into ${TV_NETS[b.k].name}. The combined service keeps four in five of its subscribers and a third of its staff.`); } }
}
function svcNews(t) { const N = S.svcNews = S.svcNews || []; N.push({ w: S.week, t }); if (N.length > 60) N.shift(); if (!S.archiving) news('Streaming', t, {}); }
// a pivot pulls titles: if one of yours goes, you hear about it
function svcPivotHits(s) {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  const mine = (typeof strm === 'function' ? strm().t : []).filter(t => t.sv === s.k && S.films[t.f] && (ME().credits || []).includes(t.f)).slice(0, 1);
  for (const t of mine) inbox('note', `${S.films[t.f].title} is pulled`, `${TV_NETS[s.k].name} removes ${S.films[t.f].title} in its profit pivot and writes off what it paid. It turns up a month later on a free channel with ads. Your residuals drop to almost nothing.`);
}
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments); const q = Math.floor(S.week / 13); if (S.svcQ !== q) { S.svcQ = q; svcQuarter(); } return r; }; }

// ---- what the rest of the world sees ----
// subscribers: the live service when it exists, the old curve otherwise
{ const _sub = subs; subs = function (n, w = S.week) { const s = n && svcOf(n.k); if (!s || !s.h.length) return _sub.apply(this, arguments); if (s.closed && w >= s.closed) return 0;
  const H = s.h; if (w >= H[H.length - 1].w) return s.subs; for (let i = H.length - 1; i > 0; i--) if (H[i - 1].w <= w) { const a = H[i - 1], b = H[i]; return a.subs + (b.subs - a.subs) * (w - a.w) / Math.max(1, b.w - a.w); } return H[0].subs; }; }
{ const _st = streamers; streamers = function () { return _st.apply(this, arguments).filter(n => !(svcOf(n.k) || {}).closed); }; }
// what a service will pay: more in a land grab, less in a pivot, less when its greenlight bar is up
function svcBidMul(k) { const s = svcOf(k); if (!s) return 1; return (s.mood === 'land grab' ? 1.25 : s.mood === 'profit pivot' ? .7 : 1) / Math.sqrt(s.bar); }
function svcLicMul() { const L = svcLive().map(svcOf).filter(Boolean); if (!L.length) return 1; const w = L.reduce((t, s) => t + s.subs, 0); return clamp(L.reduce((t, s) => t + svcBidMul(s.k) * s.subs, 0) / Math.max(1, w), .82, 1.25); }
{ const _lb = licBids; licBids = function (f) { return _lb.apply(this, arguments).map(([n, v]) => [n, v * svcBidMul(n.k)]).sort((a, b) => b[1] - a[1]); }; }
// the share price on the Ticker follows the business
{ const _sd = sectorDriver; sectorDriver = function (s, w) { const v = s && s.k && s.k.startsWith('net_') && svcOf(s.k.slice(4)); if (!v || !v.h.length) return _sd.apply(this, arguments); const H = v.h; let x = H[0].stock; for (const p of H) if (p.w <= w) x = p.stock; return Math.max(.1, x / 50); }; }
// cinemas: the window shrinks and attendance with it
function cinemaWindow(y = S.year) { return y < 2020 ? 90 : y < 2022 ? 30 : y < 2026 ? 40 : 45; }
function cinemaIndex(y = S.year) { const L = svcLive(y + .5).map(svcOf).filter(Boolean), share = Math.min(.6, L.reduce((t, s) => t + s.subs, 0) / 2000); return clamp(1 - .03 * (90 - cinemaWindow(y)) / 10 - share * .25, .55, 1); }

// ---- jobs inside a service ----
const SV_JOBS = [
  { k: 'sv_coord', jid: 'sv_coordinator', t: 'Content coordinator (streaming)', tier: 1, subs: ['tas', 'eth'], days: 5, rate: 260, weeks: 20, fam: 'stream', sv: 1, d: 'Track every project, take notes in every meeting, write coverage on the scripts nobody else has time for.' },
  { k: 'sv_analyst', jid: 'sv_content_analyst', t: 'Content strategy analyst', tier: 2, subs: ['fin', 'tas'], days: 5, rate: 520, weeks: 26, fam: 'stream', sv: 1, d: 'Forecast what a pitch will be watched for, and tell the room after launch whether you were right: starters, completers, cost per view.' },
  { k: 'sv_prog', jid: 'sv_programming', t: 'Programming manager (homepage)', tier: 2, subs: ['tas', 'pack'], days: 5, rate: 480, weeks: 26, fam: 'stream', sv: 1, d: 'Decide what launches when, which title gets the big banner, and when to drop a season all at once or weekly.' },
  { k: 'sv_loc', jid: 'sv_localisation', t: 'Localisation manager', tier: 2, subs: ['pack', 'eth'], days: 5, rate: 420, weeks: 26, fam: 'stream', sv: 1, d: 'Thirty languages, one release date: commission the dubs and subtitles, cast the voices, check them all.' },
  { k: 'sv_art', jid: 'sv_key_art', t: 'Marketing and key art manager', tier: 2, subs: ['tas', 'cha'], days: 5, rate: 500, weeks: 26, fam: 'stream', sv: 1, d: 'Dozens of versions of every poster, tested on real viewers; trailers, social and the press tour.' },
  { k: 'sv_acq', jid: 'sv_acquisitions', t: 'Acquisitions manager', tier: 3, subs: ['tas', 'fin'], days: 5, rate: 900, weeks: 26, fam: 'stream', sv: 1, d: 'Festivals and markets: watch everything, model what each film is worth to the service, bid at midnight.' },
  { k: 'sv_ce', jid: 'sv_creative_exec', t: 'Creative executive (originals)', tier: 3, subs: ['struc', 'tas', 'pack'], days: 5, rate: 850, weeks: 30, fam: 'stream', sv: 1, d: 'Hear pitches, give notes on scripts and cuts, defend your projects in the greenlight meeting.' },
  { k: 'sv_ba', jid: 'sv_business_affairs', t: 'Business affairs director', tier: 4, subs: ['fin', 'pack', 'cha'], days: 5, rate: 1600, weeks: 30, fam: 'stream', sv: 1, d: 'Negotiate the deals: cost-plus premiums, overall deals, library licences, the guild rules.' },
  { k: 'sv_vp', jid: 'sv_vp_originals', t: 'VP, originals', tier: 5, subs: ['pack', 'fin', 'tas'], days: 5, rate: 3500, weeks: 40, fam: 'stream', sv: 1, d: 'Own a slate: the budget, the greenlights, the renewals, and the quarterly call with the people who run the service.' }
];
for (const t of SV_JOBS) if (!ODD_JOBS.some(x => x.k === t.k)) { ODD_JOBS.push(t); ODD_BY[t.k] = t; }
if (typeof FAM_TOPIC !== 'undefined') FAM_TOPIC.stream = 'stream';
function svcPosts() {
  const M = S.me, L = tierLevel(), y = svcYear(S.week), live = svcLive(y).filter(k => (HUBS[TV_NETS[k].hub] || {}).m === (HUBS[M.hub] || {}).m), out = [];
  if (!live.length || prnd() > .6) return out;
  const T = SV_JOBS.filter(t => t.tier <= L + 1 && t.tier >= L - 2 && (t.k !== 'sv_ce' && t.k !== 'sv_vp' || y >= 2013) && !M.jobs.some(j => j.k === t.k));
  for (let i = 0, n = 1 + (L >= 3 ? 1 : 0); i < n && T.length; i++) { const k = live[Math.floor(prnd() * live.length)], t = T[Math.floor(prnd() * T.length)], p = makePost(t, null);
    Object.assign(p, { t: `${t.t}, ${TV_NETS[k].name}`, mco: TV_NETS[k].name, sv: k }); out.push(p); }
  return out;
}
{ const _tp = tvPosts; tvPosts = function () { return _tp.apply(this, arguments).concat(svcPosts()); }; }
function svJob() { return S.me.jobs.find(j => /^sv_/.test(j.k)); }

// ---- the work itself: a decision every fortnight, drawn from what your job does ----
const SV_DESK = {
  greenlight: { who: ['sv_ce', 'sv_vp', 'sv_analyst', 'sv_coord'], mk: (s, r) => { const f = (.7 + r() * .9).toFixed(2), bar = s.bar.toFixed(2); return { title: 'The greenlight meeting', text: `A ${pickLine(['heist series', 'family comedy', 'true-crime documentary', 'fantasy epic', 'local-language thriller', 'dating show'], S.week)} is up. The forecast puts it at ${f}× the service's efficiency bar of ${bar}; the room is split. ${+f < 1 ? 'The numbers say no. The showrunner\'s last show was loved by the people who saw it.' : 'The numbers say yes. Nobody in the room likes the script.'}`, eff: +f, opts: [['gl_numbers', 'Go with the forecast'], ['gl_gut', 'Go with your gut'], ['gl_cheap', 'Ask for a cheaper version']] }; } },
  renewal: { who: ['sv_ce', 'sv_vp', 'sv_analyst'], mk: (s, r) => { const c = 38 + Math.floor(r() * 26); return { title: 'The renewal memo', text: `A season-two show finished at ${c}% completion; the cast's new deals push the next season's cost up 20%. ${c >= 50 ? 'Above the line most services use.' : 'Below the 50% line most services use.'} The showrunner has already broken the story for season three.`, comp: c, opts: [['rn_renew', 'Renew it'], ['rn_final', 'Order a short final season'], ['rn_cancel', 'Cancel it']] }; } },
  billboard: { who: ['sv_prog', 'sv_vp'], mk: () => ({ title: 'The homepage banner', text: 'One slot at the top of the homepage this week. A new original with a big star, a licensed sitcom that keeps people subscribed, or an international hit that is quietly climbing the Top 10.', opts: [['bb_orig', 'The new original'], ['bb_comfort', 'The comfort sitcom'], ['bb_intl', 'The international hit']] }) },
  drop: { who: ['sv_prog'], mk: () => ({ title: 'All at once, or weekly?', text: 'A mystery series launches next month. All eight episodes at once makes a bigger first week; weekly keeps people talking (and subscribed) for two months.', opts: [['dr_binge', 'All at once'], ['dr_weekly', 'Weekly']] }) },
  art: { who: ['sv_art'], mk: () => ({ title: 'The key-art test', text: 'Seven versions of the poster went out to a slice of the audience. The one that tested best doesn\'t show the lead actor at all. Their agent has already called twice.', opts: [['ka_data', 'Use the winner'], ['ka_star', 'Keep the star'], ['ka_split', 'Different art in different regions']] }) },
  dub: { who: ['sv_loc'], mk: () => ({ title: 'Thirty languages', text: 'A local-language drama is testing well at home. Dubbing it into thirty languages for day one costs a fortune; subtitles cost almost nothing, and most people won\'t watch with them.', opts: [['db_full', 'Full dubs, day one'], ['db_sub', 'Subtitles only'], ['db_five', 'Dub the five biggest markets']] }) },
  festival: { who: ['sv_acq'], mk: (s, r) => { const v = 8 + Math.floor(r() * 25); return { title: 'Midnight at the festival', text: `The film everyone stood up for is being sold tonight. Two other services and an independent distributor are bidding; the price is near $${v}M for the world. The independent offers the filmmakers a real cinema release.`, v, opts: [['fs_win', `Bid $${Math.round(v * 1.2)}M for the world`], ['fs_theatre', 'Promise a cinema release too'], ['fs_walk', 'Walk away']] }; } },
  costplus: { who: ['sv_ba', 'sv_vp'], mk: (s, r) => { const p = 20 + Math.floor(r() * 4) * 5; return { title: 'The cost-plus offer', text: `A creator with two hits wants to make their next show with you. Standard is the budget plus ${p}% up front, and the service owns it forever: no backend. A studio has offered them less now and a share of the profits later.`, p, opts: [['cp_std', `Hold at ${p}%`], ['cp_up', `Go to ${p + 10}%`], ['cp_back', 'Offer a small backend instead']] }; } },
  price: { who: ['sv_vp'], mk: s => ({ title: 'The price memo', text: `Finance wants the price up $2, to $${(s.price + 2).toFixed(2)}. The last rise cost a quarter of growth for a few months; this one would pay for the slate.`, opts: [['pr_up', 'Raise it'], ['pr_hold', 'Hold it'], ['pr_ads', 'Push people to the plan with ads instead']] }) }
};
function svDeskWeek() {
  const M = S.me, j = svJob(); if (!j || S.week % 2 || pending().some(x => x.kind === 'svdesk')) return;
  const s = svcOf(j.sv || svcLive()[0]); if (!s) return;
  const keys = Object.keys(SV_DESK).filter(k => SV_DESK[k].who.includes(j.k) && !(k === 'renewal' && S.year < 2015)); if (!keys.length) return;
  const r = hashRand((M.id + 1) * 7919 + S.week), k = keys[Math.floor(r() * keys.length)], D = SV_DESK[k].mk(s, r);
  inbox('svdesk', D.title, D.text + ` (${TV_NETS[s.k].name})`, Object.assign({ desk: k, sv: s.k, job: j.id, choices: D.opts.map(([key, label]) => ({ k: key, label })) }, D, { title: D.title }));
}
function svDeskPick(it, k) {
  if (it.kind !== 'svdesk') return false; it.done = true; const M = S.me, me = ME(), s = svcOf(it.sv), j = M.jobs.find(x => x.id === it.job);
  const fx = (score, boost, t, ok) => { if (j && typeof jobScore === 'function') jobScore(j, score, it.title); if (s) s.boost += boost; if (score > 0) me.standing = clamp(me.standing + score * .3, 0, 100); it.result = { ok, roll: ok !== undefined ? M.lastRoll : undefined, t }; return true; };
  switch (k) {
    case 'gl_numbers': return it.eff >= 1 ? fx(1, .01, 'It goes ahead on the numbers. Six months later it does almost exactly what the forecast said, which nobody remembers as a triumph.') : fx(.5, 0, 'You pass. The showrunner takes it to a rival, where it does fine. Fine is not a hit.');
    case 'gl_gut': { const ok = roll('tas', 14); return ok ? fx(2, .03, 'Your gut was right: it is the most-talked-about show of the season, and your name is on the memo that saved it.', ok) : fx(-1, -.01, 'Your gut was wrong. The finance team circulates the forecast you ignored.', ok); }
    case 'gl_cheap': return fx(.8, .005, 'Eight episodes become six and the budget drops by a quarter. Everyone is a little unhappy, which means it was a fair deal.');
    case 'rn_renew': return it.comp >= 50 ? fx(1.2, .02, 'Renewed. The fans who finished it are loud and loyal.') : fx(-.5, -.01, 'Renewed against the numbers. The third season costs more and fewer people finish it.');
    case 'rn_final': return fx(1, .01, 'A six-episode final season. The fans get an ending; the service gets a show that was not cancelled on a cliffhanger.');
    case 'rn_cancel': return fx(it.comp < 50 ? 1 : -.3, it.comp < 50 ? 0 : -.01, it.comp < 50 ? 'Cancelled. The petition gets two hundred thousand signatures and changes nothing.' : 'Cancelled at a healthy completion rate. Someone leaks the memo.');
    case 'bb_orig': { const ok = roll('tas', 12); return fx(ok ? 1.2 : .2, ok ? .02 : 0, ok ? 'The original opens at number one in forty countries.' : 'The original opens at number seven. The star\'s team asks why.', ok); }
    case 'bb_comfort': return fx(.6, .01, 'Churn ticks down a fraction. Nobody outside the building notices; the finance team does.');
    case 'bb_intl': { const ok = roll('tas', 13); return fx(ok ? 1.5 : .3, ok ? .03 : 0, ok ? 'The international hit goes global. A show made for the price of one episode of the big original outdraws it.' : 'It stays a local hit. Lovely numbers in one country.', ok); }
    case 'dr_binge': return fx(.7, .01, 'A huge first week, then silence. By week three it is gone from the Top 10.');
    case 'dr_weekly': return fx(.9, .015, 'Two months of theories online. Fewer people cancel while it runs.');
    case 'ka_data': return fx(.9, .015, 'The art without the star wins the test and the launch. The star\'s agent stops returning your calls.');
    case 'ka_star': return fx(.4, 0, 'The star stays on the poster and is happy. The launch is fine.');
    case 'ka_split': { const ok = roll('pack', 12); return fx(ok ? 1.1 : .3, ok ? .015 : 0, ok ? 'Different art for different places. Everyone gets the poster that works on them.' : 'The regional versions leak side by side. The press has fun with it.', ok); }
    case 'db_full': { const ok = roll('pack', 13); return fx(ok ? 1.5 : 0, ok ? .03 : -.005, ok ? 'It travels: number one in thirty countries. Dubbing paid for itself in a week.' : 'The dubs are rushed and the reviews say so. It stays home.', ok); }
    case 'db_sub': return fx(.3, 0, 'Subtitles. It does well where people read them.');
    case 'db_five': return fx(.9, .01, 'Five big markets dubbed; it does well in four of them.');
    case 'fs_win': { const ok = roll('tas', 13); return fx(ok ? 1.4 : -.5, ok ? .02 : -.01, ok ? 'You win it. It becomes the service\'s first awards contender.' : 'You win it, for too much. It opens to polite reviews and is gone in a week.', ok); }
    case 'fs_theatre': { const ok = roll('cha', 13); return fx(ok ? 1.6 : .2, ok ? .02 : 0, ok ? 'The filmmakers choose you because you promised them cinemas. The award campaign writes itself.' : 'They choose the independent. They wanted a real release, and believed the one who has always done it.', ok); }
    case 'fs_walk': return fx(.4, 0, 'You walk. The film sells for twice your number and underperforms. You feel fine about it.');
    case 'cp_std': { const ok = roll('pack', 13); return fx(ok ? 1.2 : .3, ok ? .015 : 0, ok ? 'They sign. The show is yours forever; their next one may not be.' : 'They go to the studio for the backend.', ok); }
    case 'cp_up': return fx(1, .02, 'Ten points more and they sign on the spot. The service owns the hit; your finance team grumbles about the premium.');
    case 'cp_back': { const ok = roll('cha', 14); return fx(ok ? 1.5 : 0, ok ? .02 : 0, ok ? 'A small backend, unheard of here. They sign, and talk about it, and three other creators call.' : 'Legal blocks it: the service doesn\'t do backends.', ok); }
    case 'pr_up': if (s) { s.price += 2; s.lastRise = S.week; svcNews(`${TV_NETS[s.k].name} raises its price by $2 to $${s.price.toFixed(2)} a month.`); } return fx(.8, -.02, 'The price goes up. Growth stalls for a quarter; the money comes in.');
    case 'pr_hold': return fx(.4, .01, 'You hold. The quarter looks good; the next budget meeting does not.');
    case 'pr_ads': if (s && !s.adOn && S.year >= 2020) { s.adOn = S.week; svcNews(`${TV_NETS[s.k].name} launches a cheaper plan with ads.`); } return fx(1, .01, 'More people choose the plan with ads than anyone predicted. The ad sales team is hiring.');
  }
  it.result = { t: 'Noted.' }; return true;
}

// ---- deals that come to you ----
function svDealsWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done || S.week % 13 !== 7) return;
  const live = svcLive().map(svcOf).filter(Boolean); if (!live.length) return;
  const grab = live.filter(s => s.mood !== 'profit pivot' && s.bar <= 1.15).sort((a, b) => b.cash - a.cash)[0];
  // a cost-plus offer for a film your company is finishing
  const c = typeof myCo === 'function' ? myCo() : null;
  if (grab && c && !pending().some(x => x.kind === 'svbuy')) { const f = S.films.find(f => f.co === c.id && f.rel === null && f.stage === 3 && !f.streamSold && !f.svOffer);
    if (f && prnd() < .35) { f.svOffer = S.week; const prem = .15 + prnd() * .25, fee = f.cost * (1 + prem);
      inbox('svbuy', `${TV_NETS[grab.k].name} wants ${f.title}`, `They will buy ${f.title} outright for ${fmtM(fee)}: its cost plus ${Math.round(prem * 100)}%, paid now. It goes straight to the service in every country. No cinemas, no box office, no backend; if it is a hit, the hit is theirs.`, { film: f.id, fee, sv: grab.k, choices: [{ k: 'sb_sell', label: `Sell it (${fmtM(fee)})` }, { k: 'sb_keep', label: 'Keep it for cinemas' }] }); } }
  // an overall deal for someone with a name
  const L = careerLevel(); if (grab && !M.overall && L >= 4 && ((me.fame || 0) >= 35 || me.standing >= 65) && ['writer', 'director', 'producer'].includes(me.role) && prnd() < .15 && !pending().some(x => x.kind === 'svoverall')) {
    const per = usd(Math.round(250000 * L * (1 + (me.fame || 0) / 50) / 50000) * 50000);
    inbox('svoverall', `An overall deal from ${TV_NETS[grab.k].name}`, `Three years, ${fmtCash(per)} a year, to make shows only for them. They expect at least one greenlit project a year: deals that produce nothing get "reviewed".`, { per, sv: grab.k, choices: [{ k: 'od_yes', label: 'Sign it' }, { k: 'od_no', label: 'Stay free' }] }); }
  // the overall deal's money, and its review
  const O = M.overall; if (O && !O.done) { const q = Math.round(O.per / 4); M.cash += q - taxOn(q); O.paid = (O.paid || 0) + q;
    if (S.week - O.w >= 52 && S.week - (O.chk || O.w) >= 52) { O.chk = S.week; const made = (M.shows || []).some(x => x.y === S.year || x.y === S.year - 1) || (me.credits || []).some(id => S.films[id] && S.films[id].gl > S.week - 52);
      if (!made) { O.dry = (O.dry || 0) + 1; if (O.dry >= 2 || prnd() < .5) { const buy = Math.round(O.per * (O.until - S.week) / 52 * .5); M.cash += buy - taxOn(buy); O.done = 1; inbox('note', 'Your deal is reviewed', `A year with nothing greenlit. ${TV_NETS[O.sv].name} buys out the rest of your deal at half: ${fmtCash(buy)}. You are free, and slightly less in demand.`); } } else O.dry = 0; }
    if (S.week >= O.until) { O.done = 1; diary(`Your overall deal with ${TV_NETS[O.sv].name} ends.`); } }
  // the streamer bump: an old show of yours found by millions
  if (S.week % 52 === 20) for (const sh of (M.shows || []).filter(x => x.status && /cancelled/.test(x.status) && S.year - (x.last || x.y) >= 5 && !x.bump)) { if (prnd() > .15) continue; sh.bump = S.year; const L1 = svcLive()[0], roy = usd(15000 * (sh.seas ? sh.seas.length : 1));
    M.cash += roy - taxOn(roy); me.fame = clamp((me.fame || 0) + 2, 0, 100); milestone(`${sh.title} found a new audience on streaming`, 'work');
    inbox('note', `${sh.title} is suddenly everywhere`, `${TV_NETS[L1].name} licensed ${sh.title} and it is the most-watched show of the summer, years after it was cancelled. Your fixed residual: ${fmtCash(roy)}. The views go up a thousand times; the residuals don't.`); }
  // the worst of it: bought streams
  const songs = (M.works || []).filter(w => w.type === 'song').length; if (songs >= 2 && !M.botOffer && followers('spinly') < 20000 && prnd() < .2) { M.botOffer = S.week;
    inbox('svbots', 'A million streams for $2,000', 'A stranger in your messages sells "promotion": a million plays on your next song, guaranteed, from accounts that never sleep. Playlists notice numbers. So do the platforms.', { choices: [{ k: 'bt_buy', label: 'Buy them' }, { k: 'bt_no', label: 'Block them' }] }); }
  if (M.bots && !M.bots.caught && S.week - M.bots.w > 8 && prnd() < .35) { M.bots.caught = S.week; for (const w of (M.works || []).filter(w => w.type === 'song' && w.rel >= M.bots.w)) { w.done = 1; w.units = Math.round(w.units * .2); }
    me.standing = clamp(me.standing - 5, 0, 100); if (M.deal) M.deal = null; milestone('Caught buying streams', 'life'); inbox('note', 'Taken down', 'The platform\'s fraud team removes your songs released since the purchase and withholds the royalties. If you had a label, you don\'t now. People in the business heard.'); }
}
function svPick(it, k) {
  const M = S.me, me = ME();
  if (it.kind === 'svbuy') { it.done = true; const f = S.films[it.film], c = typeof myCo === 'function' ? myCo() : null;
    if (k === 'sb_sell' && f && c && f.rel === null) { c.cash += it.fee; f.streamSold = S.week; f.svcBuyer = it.sv; f.cost = f.cost; it.result = { t: `Sold. ${fmtM(it.fee)} lands in the company's account. ${f.title} premieres on ${TV_NETS[it.sv].name} in every country at once.` }; }
    else it.result = { t: 'You keep it. It will live or die in cinemas, and the backend is yours.' }; return true; }
  if (it.kind === 'svoverall') { it.done = true; if (k === 'od_yes') { M.overall = { sv: it.sv, per: it.per, w: S.week, until: S.week + 156 }; milestone(`Signed an overall deal with ${TV_NETS[it.sv].name}`, 'money'); it.result = { t: 'You sign. Money every quarter; a parking space with your name on it; the feeling of being owned, a little.' }; } else it.result = { t: 'You stay free. You can sell to anyone.' }; return true; }
  if (it.kind === 'svbots') { it.done = true; if (k === 'bt_buy') { const c0 = usd(2000); M.cash -= c0; M.bots = { w: S.week }; it.result = { t: 'Paid. Your next song will have a very good first week.' }; } else it.result = { t: 'Blocked and reported. The account is gone by morning; so is the next one.' }; return true; }
  return false;
}
// bought streams inflate the next releases, until someone looks
{ const _rw = releaseWork; releaseWork = function (a) { const n0 = (S.me.works || []).length, ok = _rw.apply(this, arguments), w = ok && S.me.works[n0]; if (w && w.type === 'song' && S.me.bots && !S.me.bots.caught) w.v0 = Math.round(w.v0 * 3 + 50000); return ok; }; }
WEEK_HOOKS.push(svDeskWeek, svDealsWeek);
PICK_HOOKS.push(svDeskPick, svPick);
// what the afterlife licence pays depends on how hungry the services are (index.html afterlife)

// ---- what it's like, and how it's taught: the Craft Library topic ----
if (typeof CODEX !== 'undefined') CODEX.stream = ['The streaming business', 'fin',
  ['A subscription service lives on two numbers: how many people join each month and how many leave (churn). The leaders lose about 2% a month; weak services lose 7%.', 'Revenue per subscriber depends on where they live: a subscriber in a cheap market pays a fraction of an American one.', 'Original shows cost more than licensed ones but can\'t be taken away by a rival who owns them.'],
  ['A greenlight is a forecast of viewing divided by cost: the "efficiency" a service needs rises when its share price falls.', 'Cost-plus deals pay the budget plus a premium up front and buy out the backend: safe for creators, and a hit pays them no more.', 'Completion rate (how many who start a season finish it) decides renewals; around half is the usual line.'],
  ['Price rises cost a quarter of growth and pay for the slate; ad-supported plans win the price-sensitive back.', 'A studio that launches its own service stops licensing its films to others, and loses that money while the service grows.', 'Markets price a subscription company on subscriber growth: a miss of a few million can wipe a third off its value in a day.']];

// ---- the Streamboard: the whole market on one screen ----
function streamboardHTML() {
  const y = svcYear(S.week), L = svcLive(y).map(svcOf).filter(Boolean).sort((a, b) => b.subs - a.subs);
  if (!L.length) return `<div class="card"><h3>Streamboard</h3><p class="muted">No streaming services yet. ${S.year < 1997 ? 'The first one starts as a company that posts DVDs, in 1997.' : 'The DVD-by-mail company will start streaming in 2007.'}</p></div>`;
  const tot = L.reduce((t, s) => t + s.subs, 0), B = v => v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${Math.round(v)}M`;
  const spark = s => { const H = s.h.slice(-16), mx = Math.max(...H.map(p => p.stock)), mn = Math.min(...H.map(p => p.stock)); return `<svg width="80" height="20" viewBox="0 0 80 20"><polyline fill="none" stroke="currentColor" stroke-width="1.5" points="${H.map((p, i) => `${(i / Math.max(1, H.length - 1) * 78 + 1).toFixed(1)},${(19 - (p.stock - mn) / Math.max(1e-6, mx - mn) * 18).toFixed(1)}`).join(' ')}"/></svg>`; };
  const cols = ['#C0392B', '#1F4E79', '#C9971C', '#5B2D90', '#2D7A4C', '#8A5A12', '#6E7F95'];
  const rows = L.map((s, i) => { const n = TV_NETS[s.k], m = SVC_META[s.k], add = s.adds.length ? s.adds[s.adds.length - 1] : 0;
    return `<tr><td><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${cols[i % cols.length]}"></i> <b>${typeof netLink === 'function' ? netLink(s.k) : esc(n.name)}</b><br><span class="small muted">${esc(m.who)} · ${esc(s.mood)}</span></td><td class="n">${s.subs.toFixed(1)}M<br><span class="small ${add >= 0 ? 'good' : 'bad'}">${add >= 0 ? '+' : ''}${add.toFixed(1)}M</span></td><td class="n">$${s.price.toFixed(2)}${s.adOn ? `<br><span class="small muted">ads $${(s.price * .45).toFixed(2)} · ${Math.round(s.ad * 100)}%</span>` : ''}</td><td class="n">${B((s.rev || 0) * 4)}<br><span class="small ${s.op >= 0 ? 'good' : 'bad'}">${s.rev ? Math.round(s.op / s.rev * 100) : 0}% margin</span></td><td class="n">${B((s.spend || 0) * 4)}</td><td class="n">${s.debt > 1 ? B(s.debt) : '—'}</td><td class="n">${s.stock.toFixed(0)} ${spark(s)}</td><td class="n">${s.bar.toFixed(2)}</td></tr>`; }).join('');
  const N = (S.svcNews || []).slice(-8).reverse();
  return `<div class="card"><h3>Streamboard</h3><p class="small muted">Every service as a business: subscribers (global, millions), price a month, revenue and content spend a year, debt, the share price (100 at launch) and the efficiency a pitch needs to be greenlit (the bar).</p>
    <div class="finbar">${L.map((s, i) => `<span style="width:${(s.subs / tot * 100).toFixed(1)}%;background:${cols[i % cols.length]}" title="${esc(TV_NETS[s.k].name)}"></span>`).join('')}</div>
    <div class="tw"><table class="grid small"><thead><tr><th>Service</th><th>Subscribers</th><th>Price</th><th>Revenue</th><th>Content</th><th>Debt</th><th>Shares</th><th>Bar</th></tr></thead><tbody>${rows}</tbody></table></div>
    <h4>Cinemas</h4><p class="small">The exclusive cinema window is <b>${cinemaWindow()} days</b> (it was 90 before 2020). Cinema-going index: <b>${Math.round(cinemaIndex() * 100)}</b> (2019 = 100 before the services).</p>
    <h4>How the money works</h4><ul class="small"><li><b>Adds and churn.</b> A service grows when what it has on is better and cheaper than the rest. A price rise costs a quarter of growth; a password crackdown brings a surge.</li><li><b>Losses, then profit.</b> New services spend more than they earn for years, on debt. When the losses run two years, the owners pivot: fewer shows, higher prices, titles pulled and written off.</li><li><b>The market.</b> Shares move on the surprise in subscribers. A fall of a fifth freezes greenlights; a land grab lowers the bar and raises what services pay for films (yours included).</li><li><b>Deals.</b> Services buy finished films outright at cost plus a premium, and sign creators to overall deals that want a show a year.</li></ul>
    <h4>This quarter</h4><ul class="small">${N.map(x => `<li>${fmtDate(x.w, true)}: ${esc(x.t)}</li>`).join('') || '<li class="muted">Quiet.</li>'}</ul></div>`;
}
OS_EXTRA.stream = ['📡', 'Streamboard', 'The streaming services as businesses: subscribers, money, shares'];
OS_VIEWS.stream = () => streamboardHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Industry'); if (g && !g[1].includes('stream')) g[1].push('stream'); }
if (typeof APP_GUIDE !== 'undefined') APP_GUIDE.stream = ['The streaming services, as businesses.', 'Each service adds and loses subscribers every quarter, raises its price, borrows, pivots and is priced by the market on its growth. What it pays for films and shows follows its mood.', 'Sell to a service when it is hungry; a land grab pays more for your films, a pivot pulls them.', 'Look at who is growing and who is losing money: that is who is buying.'];
