// ---------------- Money that moves: the economy, sector stocks, tips, and a real bank ----------------
// The market now has weather. A macro factor runs under every price: the real crashes land on their real dates (1929,
// 1987, the dot-com bust, 2008, the 2020 lockdown, the 2023 strikes), fictional booms and busts fill the years between,
// and each stock feels them according to its beta. Beyond the studios you can trade the businesses around the films:
// cinema chains, popcorn, cameras, toys, streaming pipes, labels, billboards. Tips arrive every week; some are right.
// The bank pays interest at the era's rates, locks money away for better ones, lends against your worth, and fate
// takes a turn now and then. Prices stay pure functions of the world (replays agree); only your own luck uses your dice.
// ---- the economy ----
const RATE_PATH = [[1900, 4], [1920, 4.5], [1929, 5], [1932, 1.5], [1940, 1], [1950, 1.8], [1960, 3.5], [1969, 8], [1974, 10], [1977, 5.5], [1980, 15], [1983, 9], [1989, 9.5], [1993, 3], [2000, 6.4], [2002, 1.7], [2006, 5.2], [2009, .2], [2016, .4], [2019, 2.2], [2020, .1], [2022, 2], [2023, 5.3], [2025, 4.3], [2030, 3.5], [2100, 3.5]];
function rateAt(y) { for (let i = 1; i < RATE_PATH.length; i++) { const [y1, r1] = RATE_PATH[i]; if (y <= y1) { const [y0, r0] = RATE_PATH[i - 1]; return r0 + (r1 - r0) * (y - y0) / Math.max(1, y1 - y0); } } return 3.5; }
// real shocks: [year, month, size per week, weeks, name, story]
const MACRO_REAL = [
  [1929, 9, -.06, 6, 'The Great Crash', 'Panic on the exchange; paper fortunes vanish in days.'], [1930, 5, -.02, 20, 'The Depression deepens', 'Breadlines, closed banks, empty cinemas on weekday nights.'],
  [1933, 3, .03, 10, 'The New Deal rally', 'Bank holidays end and money comes back out of mattresses.'], [1941, 11, -.03, 4, 'War', 'The country goes to war; markets wobble, then the factories hum.'],
  [1946, 0, .015, 20, 'The post-war boom', 'Cinema attendance hits its all-time peak.'], [1948, 4, -.02, 10, 'The studios lose their cinemas', 'The government orders the majors to sell their theatre chains.'],
  [1953, 0, -.01, 30, 'Television arrives', 'Living rooms get a screen of their own; cinema audiences halve within a decade.'], [1962, 4, -.03, 6, 'The flash crash', 'A sharp spring sell-off.'],
  [1973, 10, -.025, 20, 'The oil shock', 'Petrol queues and stagflation; the blockbuster is about to be born.'], [1975, 5, .02, 10, 'The summer blockbuster', 'A shark film changes how studios release films and how Wall Street sees them.'],
  [1980, 1, -.015, 12, 'Rates at 20%', 'Money is the most expensive it has ever been.'], [1982, 7, .025, 20, 'The bull market begins', 'Video stores sprout everywhere; studios find a second window.'],
  [1987, 9, -.22, 1, 'Black Monday', 'The market falls 22% in a single day.'], [1995, 7, .02, 30, 'The dot-com boom', 'Anything with ".com" in its name doubles.'],
  [2000, 2, -.04, 16, 'The dot-com bust', 'The bubble bursts; tech and media fall together.'], [2001, 8, -.08, 2, 'September', 'Markets close for a week; travel and entertainment stocks are hit hardest.'],
  [2007, 10, -.015, 14, 'The writers\' strike', 'Television goes dark; studios burn through their stockpiles.'], [2008, 8, -.07, 8, 'The financial crisis', 'A bank fails and the system nearly follows it.'],
  [2009, 2, .03, 20, 'The recovery rally', 'Free money and a decade-long bull market.'], [2013, 0, .01, 40, 'The streaming gold rush', 'Investors reward subscribers, not profits.'],
  [2020, 2, -.12, 3, 'The lockdown', 'Cinemas close worldwide; streaming soars.'], [2020, 4, .04, 20, 'The stay-at-home rally', 'Stocks you can use from your sofa boom.'],
  [2022, 3, -.02, 20, 'The streaming reckoning', 'A streamer loses subscribers and the whole sector is repriced.'], [2023, 4, -.02, 20, 'The double strike', 'Writers and actors both strike; production stops for months.'],
  [2025, 0, .01, 30, 'Merger season', 'Studios combine, buy each other and get bought.']
];
const MACRO_FICT = [['A ratings scandal', -.02, 'A ratings agency is caught fiddling the numbers.'], ['A box-office boom', .02, 'Queues round the block all summer.'], ['A credit crunch', -.03, 'Banks stop lending to film financiers.'], ['A merger frenzy', .02, 'Rumours of takeovers lift every studio.'], ['An advertising slump', -.02, 'Brands cut their budgets; TV and online suffer.'], ['A tax-break bonanza', .015, 'New incentives make production cheap.'], ['A union showdown', -.015, 'Crews threaten to walk out.'], ['A blockbuster drought', -.02, 'A run of expensive flops spooks investors.'], ['A new format craze', .02, 'Everyone wants the new screens.'], ['A piracy panic', -.015, 'A leak puts a summer tentpole online before release.']];
function macroEventsOfYear(y) {
  const out = MACRO_REAL.filter(e => e[0] === y).map(e => ({ y, m: e[1], size: e[2], n: e[3], name: e[4], d: e[5], real: 1 }));
  if (y > 1900 && !out.some(e => Math.abs(e.size) >= .03)) { const r = hashRand(y * 4217 + 11); if (r() < .55) { const F = MACRO_FICT[Math.floor(r() * MACRO_FICT.length)]; out.push({ y, m: Math.floor(r() * 12), size: F[1], n: 4 + Math.floor(r() * 10), name: F[0], d: F[2] }); } }
  return out;
}
let MACC = { S: null, m: new Map() };
function macroShock(w) {
  if (MACC.S !== S) MACC = { S, m: new Map() };
  if (MACC.m.has(w)) return MACC.m.get(w);
  const d = dateOf(w), y = d.getUTCFullYear(), mo = d.getUTCMonth();
  let s = (hashRand(w * 911 + 7)() - .5) * .014;
  for (const yy of [y, y - 1]) for (const e of macroEventsOfYear(yy)) { const start = weekOfYear(e.y) + Math.round(e.m * 4.35); if (w >= start && w < start + e.n) s += e.size; }
  MACC.m.set(w, s); return s;
}
// the market level: last year's shocks, fading
const MACAT = { S: null, m: new Map() };
function macroAt(w) { if (MACAT.S !== S) { MACAT.S = S; MACAT.m = new Map(); } if (MACAT.m.has(w)) return MACAT.m.get(w); let v = 1; for (let i = 0; i < 52; i++) v += macroShock(w - i) * Math.pow(.955, i); const out = Math.max(.35, v); MACAT.m.set(w, out); return out; }
function betaOf(c) { return [1, 1, 1.25, 1.5][c.tier] * (.85 + hashRand(c.id * 37 + 5)() * .3); }
function macroNow() { const d = dateOf(S.week), y = d.getUTCFullYear(); return [...macroEventsOfYear(y), ...macroEventsOfYear(y - 1)].filter(e => { const start = weekOfYear(e.y) + Math.round(e.m * 4.35); return S.week >= start && S.week < start + e.n + 8; }); }
// ---- sector stocks: the businesses around the films ----
// [key, ticker, name, sector, from, driver, beta, start price, story]
const SECTORS = [
  ['cine', 'AMV', 'AMV Theatres', 'Cinema chains', 1920, 'box', 1.4, 18, 'The biggest cinema chain: lives and dies by the box office and the release window.'],
  ['regal', 'RGLX', 'Royal Regal Cinemas', 'Cinema chains', 1930, 'box', 1.2, 14, 'Multiplexes in the suburbs and an expensive popcorn habit.'],
  ['pop', 'POPC', 'Popcorn Holdings', 'Concessions', 1930, 'box', .7, 22, 'Supplies the popcorn, the syrup and the cups. A steady little earner.'],
  ['cam', 'PNVZ', 'Panavisionary', 'Cameras & gear', 1954, 'prod', 1.1, 30, 'Rents cameras and lenses to every big shoot. Follows how many films are being made.'],
  ['kod', 'KDK', 'Kodaking Film Co.', 'Film stock', 1900, 'film', 1, 40, 'Sells the film the films are shot on. Digital is coming for it.'],
  ['toy', 'MTL', 'Mattelic Toys', 'Toys & merch', 1945, 'kids', 1.2, 16, 'Turns animated and superhero hits into lunchboxes and action figures.'],
  ['label', 'SPNY', 'Spinly Music Group', 'Music', 1950, 'music', 1.1, 12, 'Records, publishing and, later, streaming royalties.'],
  ['pipe', 'STRM', 'Streamworks Networks', 'Streaming & cable', 1980, 'video', 1.6, 8, 'The pipes into the living room: cable first, streaming later.'],
  ['ad', 'BILL', 'Billboard & Buzz Agency', 'Advertising', 1925, 'box', 1.3, 20, 'Sells the posters, trailers and campaigns. Ad budgets are the first thing cut in a downturn.'],
  ['vfxco', 'PIXL', 'Pixelforge VFX', 'Visual effects', 1985, 'prod', 1.7, 6, 'Effects shots by the thousand. Thin margins, huge contracts.'],
  ['pod', 'PODH', 'Podhaus Audio', 'Audio', 2005, 'pod', 1.8, 5, 'Podcasts and audiobooks. Growing fast, from nothing.'],
  ['gold', 'GLDX', 'Gold Bullion Trust', 'Safe haven', 1900, 'gold', -.4, 35, 'Gold. Goes up when everything else goes down. Pays nothing.']
];
const SECTOR = Object.fromEntries(SECTORS.map(s => [s[0], { k: s[0], tk: s[1], name: s[2], sec: s[3], from: s[4], drv: s[5], beta: s[6], p0: s[7], d: s[8] }]));
function sectorOpen(s) { return S.year >= s.from; }
function sectorDriver(s, w) {
  const y = yearOf(w);
  if (s.drv === 'box') return Math.max(.2, typeof fieldIndex === 'function' ? fieldIndex('box', w) : 1);
  if (s.drv === 'music') return Math.max(.3, fieldIndex('music', w) || .5);
  if (s.drv === 'video') return Math.max(.3, y < 2005 ? 1 + (y - 1980) * .04 : fieldIndex('video', w) * .2 + 2);
  if (s.drv === 'pod') return Math.max(.2, fieldIndex('pod', w) || .2);
  if (s.drv === 'film') return y < 2005 ? 1 + (y - 1950) * .02 : Math.max(.15, 2.1 - (y - 2005) * .25);
  if (s.drv === 'kids') return 1 + Math.max(0, y - 1975) * .03;
  if (s.drv === 'prod') return Math.max(.4, S.active.length / 60);
  // the wider business: broadcast peaks then fades, cable rises and falls, streaming arrives, games crash and boom
  if (s.drv === 'broadcast') return y < 1990 ? .6 + (y - 1950) * .02 : Math.max(.45, 1.4 - (y - 1990) * .025);
  if (s.drv === 'cable') return y < 1980 ? .4 : y < 2010 ? .4 + (y - 1980) * .045 : Math.max(.6, 1.75 - (y - 2010) * .06);
  if (s.drv === 'stream') return y < 2007 ? .3 : .3 + Math.min(2.6, (y - 2007) * .2);
  if (s.drv === 'games') return y < 1983 ? .4 + Math.max(0, y - 1975) * .1 : y < 1986 ? .4 : .5 + (y - 1986) * .05;
  if (s.drv === 'parks') return Math.max(.3, (1 + (y - 1955) * .02) * Math.pow(Math.max(.2, fieldIndex('box', w) || 1), .3));
  if (s.drv === 'live') return Math.max(.3, (1 + (y - 1960) * .015) * Math.pow(Math.max(.3, fieldIndex('music', w) || .5), .4));
  if (s.drv === 'stage') return 1 + (y - 1950) * .008;
  if (s.drv === 'books') return y < 2008 ? 1 + (y - 1950) * .01 : Math.max(.7, 1.58 - (y - 2008) * .02);
  if (s.drv === 'creator') return y < 2008 ? .2 : .2 + Math.min(2.5, (y - 2008) * .18);
  return 1 + (y - 1950) * .01;
}
let SBC = { S: null, m: new Map() };
function sectorBar(s, w) {
  if (SBC.S !== S) SBC = { S, m: new Map() };
  const key = s.k + ':' + w; if (SBC.m.has(key)) return SBC.m.get(key);
  let wander = 0; for (let i = 0; i < 6; i++) wander += (hashRand((s.seed || s.k.length * 7919 + s.tk.charCodeAt(0) * 13) + (w - i) * 31)() - .5) * (s.vol || .05) * (1 - i / 7);
  const mf = s.beta >= 0 ? Math.pow(macroAt(w), s.beta) : Math.pow(macroAt(w), s.beta);
  // real growth on top of inflation, as listed companies have had over the long run (gold just keeps its value);
  // anchored at 2026 so today's prices are where they were and the past is cheaper
  const grow = Math.pow(1 + sGrowth(s), (w - weekOfYear(2026)) / 52);
  const c = Math.max(.05, s.p0 * Math.pow(sectorDriver(s, w), .6) * mf * (1 + wander) * grow * (typeof cpi === 'function' ? cpi(yearOf(w)) / cpi(2000) : 1));
  const r = hashRand(s.tk.charCodeAt(1) * 977 + w)(), o = c / (1 + (r - .5) * .04);
  const bar = { w, o, c, h: Math.max(o, c) * 1.01, l: Math.min(o, c) * .99, v: Math.round(1e5 * (1 + r)), ev: [] };
  SBC.m.set(key, bar); return bar;
}
function sectorPrice(s, w = S.week) { return sectorBar(s, w).c; }
// Real price growth a year, and the dividend yield, by kind of business: steady payers in radio, publishing and
// cinemas, growth companies that pay nothing in streaming, games and creators, and gold that pays nothing at all.
const S_YIELD = { 'Safe haven': 0, 'Streaming': 0, 'Online video': 0, 'Audio': 0, 'Video games': .008, 'Radio': .045, 'Publishing': .03, 'Music publishing': .025, 'TV networks': .035, 'Cable TV': .03, 'Premium TV': .02, 'Theme parks': .012, 'Ticketing': 0, 'Live events': 0 };
function sYield(s) { return S_YIELD[s.sec] !== undefined ? S_YIELD[s.sec] : s.beta > 1.5 ? .005 : .02; }
function sGrowth(s) { return s.drv === 'gold' || s.sec === 'Safe haven' ? .004 : .035 - sYield(s) * .5; }
// each quarter the payers pay; the index fund passes on what its studios pay
function sectorDivWeek() {
  const M = S.me; if (!M || !M.sport || S.week % 13 !== 6) return;
  let tot = 0; const by = [];
  for (const [k, n] of Object.entries(M.sport)) { if (n <= 0) continue; const s = SECTOR[k], y = k === 'box50' ? .018 : s ? sYield(s) : 0; if (!y) continue; const d = Math.round((k === 'box50' ? fundPrice() : sectorPrice(s)) * n * y / 4); if (d > 0) { tot += d; by.push(s ? s.tk : 'BOX50'); } }
  if (tot > 0) { M.cash += tot; (M.divs = M.divs || {})[S.year] = ((M.divs || {})[S.year] || 0) + tot; mail('news', 'Your broker', 'Dividends paid', `Quarterly dividends from ${by.slice(0, 5).join(', ')}${by.length > 5 ? ` and ${by.length - 5} more` : ''}: ${fmtCash(tot)}.`); }
}
function sChg(s, n) { return (sectorPrice(s) / sectorPrice(s, S.week - n) - 1) * 100; }
function sSpark(s, n = 26, W = 80, H = 22) { const P0 = Array.from({ length: n }, (_, i) => sectorPrice(s, S.week - (n - 1 - i))), hi = Math.max(...P0), lo = Math.min(...P0), up = P0[n - 1] >= P0[0]; return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><polyline fill="none" stroke="${up ? 'var(--good)' : 'var(--bad)'}" stroke-width="1.5" points="${P0.map((v, i) => `${(i / (n - 1) * W).toFixed(1)},${(2 + (hi - v) / Math.max(1e-6, hi - lo) * (H - 4)).toFixed(1)}`).join(' ')}"/></svg>`; }
// the index fund tracks the BOX-50
function fundPrice(w = S.week) { return Math.max(.5, (typeof indexVal === 'function' ? indexVal(w) : 100) / 10); }
function sTrade(a) {
  const M = S.me, s = SECTOR[a.s], fund = a.s === 'box50'; if (!fund && (!s || !sectorOpen(s))) return false;
  const px = fund ? fundPrice() : sectorPrice(s), n = Math.round(a.n), fee = 5; M.sport = M.sport || {}; M.scost = M.scost || {};
  if (n > 0) { const cost = Math.round(px * n) + fee; if (M.cash < cost) return false; M.cash -= cost; M.sport[a.s] = (M.sport[a.s] || 0) + n; M.scost[a.s] = (M.scost[a.s] || 0) + cost; }
  else { const have = M.sport[a.s] || 0, k = Math.min(have, -n); if (!k) return false; M.cash += Math.round(px * k) - fee; M.scost[a.s] = Math.round((M.scost[a.s] || 0) * (have - k) / have); M.sport[a.s] = have - k; }
  (M.trades = M.trades || []).push({ w: S.week, s: a.s, n, px: +px.toFixed(2) }); if (M.trades.length > 80) M.trades.shift();
  if (M.tipsActed && M.tipsActed[a.s] === undefined) {} // sector trades are never insider trades
  return true;
}
function sectorValue() { const M = S.me; return Object.entries(M.sport || {}).reduce((t, [k, n]) => t + (n > 0 ? (k === 'box50' ? fundPrice() : SECTOR[k] ? sectorPrice(SECTOR[k]) : 0) * n : 0), 0); }
// ---- tips: right, wrong, and occasionally illegal ----
const TIP_SRC = [['a man at the gym', .45, 0], ['a cousin who works in marketing', .55, 0], ['an online forum', .5, 0], ['a trade reporter, off the record', .7, 0], ['a tracking-survey leak', .75, 0], ['a friend in the finance department', .88, 1]];
function tipsThisWeek() {
  const out = [], r = hashRand(S.week * 2357 + 3), up = S.films.filter(f => f.rel !== null ? false : f.stage === 3 && f.co !== null && S.companies[f.co] && S.companies[f.co].closed === null && f.stageEnd - S.week <= 4 && f.stageEnd >= S.week);
  for (let i = 0; i < 4 && up.length; i++) {
    const f = up.splice(Math.floor(r() * up.length), 1)[0], src = TIP_SRC[Math.floor(r() * TIP_SRC.length)], c = S.companies[f.co];
    const truth = (f.q !== undefined ? f.q : 55) >= 62 ? 1 : (f.q !== undefined ? f.q : 55) < 48 ? -1 : 0, right = r() < src[1];
    const claim = truth === 0 ? (r() < .5 ? 1 : -1) : right ? truth : -truth;
    out.push({ f: f.id, co: c.id, src: src[0], rel: src[1], insider: src[2], claim, opens: f.stageEnd });
  }
  return out;
}
// ---- the bank ----
function bankOf(M) { return M.bank || (M.bank = { sav: 0, cds: [], loan: 0, lrate: 0, score: 650, hist: [] }); }
function savRate() { return Math.max(.05, rateAt(S.year) - 1.2); }
function cdRate(weeks) { return Math.max(.2, rateAt(S.year) - .3 + (weeks >= 104 ? .6 : weeks >= 52 ? .3 : 0)); }
function loanRate(M) { const B = bankOf(M); return rateAt(S.year) + 4 + Math.max(0, (720 - B.score) / 25); }
function creditLimit(M) { const nw = typeof osNetWorth === 'function' ? osNetWorth().total : M.cash, inc = Math.max(0, (M.jobs || []).reduce((t, j) => t + j.rate * j.days, 0)); return Math.max(0, Math.round((Math.max(0, nw) * .5 + inc * 20) * (bankOf(M).score / 700))); }
function bankAct(a) {
  const M = S.me, B = bankOf(M), amt = Math.round(+a.amt || 0);
  if (a.k === 'deposit') { if (amt <= 0 || M.cash < amt) return false; M.cash -= amt; B.sav += amt; }
  else if (a.k === 'withdraw') { if (amt <= 0 || B.sav < amt) return false; B.sav -= amt; M.cash += amt; }
  else if (a.k === 'cd') { const wk = [26, 52, 104][+a.term || 0]; if (amt <= 0 || M.cash < amt) return false; M.cash -= amt; B.cds.push({ amt, rate: cdRate(wk), from: S.week, due: S.week + wk }); }
  else if (a.k === 'breakcd') { const i = +a.i, c = B.cds[i]; if (!c) return false; M.cash += Math.round(c.amt * .97); B.cds.splice(i, 1); B.hist.push({ w: S.week, t: 'Broke a term deposit early (3% penalty)' }); }
  else if (a.k === 'borrow') { if (amt <= 0 || B.loan + amt > creditLimit(M)) return false; B.loan += amt; B.lrate = loanRate(M); M.cash += amt; B.hist.push({ w: S.week, t: `Borrowed ${fmtCash(amt)} at ${B.lrate.toFixed(1)}%` }); }
  else if (a.k === 'repay') { let k = Math.min(amt, B.loan, M.cash); if (k <= 0 && B.sbl > 0) { k = Math.min(amt, B.sbl, M.cash); if (k <= 0) return false; M.cash -= k; B.sbl -= k; B.hist.push({ w: S.week, t: `Repaid ${fmtCash(k)} on the credit line` }); return true; } if (k <= 0) return false; M.cash -= k; B.loan -= k; B.score = clamp(B.score + 2, 300, 850); }
  else if (a.k === 'sbl') { const lim = typeof sblLimit === 'function' ? sblLimit(M) - (B.sbl || 0) : 0; if (amt <= 0 || amt > lim) return false; B.sbl = (B.sbl || 0) + amt; M.cash += amt; B.hist.push({ w: S.week, t: `Drew ${fmtCash(amt)} against your portfolio` }); }
  else return false;
  return true;
}
// ---- tax ----
// Earnings are taxed the way a single filer's are: payroll, federal and state together, so the effective rate climbs
// from almost nothing on a first job to about two-fifths on a chief executive's pay. It's worked out on the year's
// running total in 2027 dollars, so a big cheque is taxed at the rate it pushes you into. There was no income tax
// before 1913, and much less of it before the war.
const TAX_EFF = [[0, 0], [15000, .08], [40000, .17], [80000, .24], [150000, .29], [400000, .36], [1e6, .41], [1e7, .44]];
function taxEff(I) { if (I <= 0) return 0; for (let i = 1; i < TAX_EFF.length; i++) { const [b, rb] = TAX_EFF[i]; if (I <= b) { const [a, ra] = TAX_EFF[i - 1]; return ra + (rb - ra) * (I - a) / (b - a); } } return .44; }
function taxEra(y) { return y < 1913 ? 0 : y < 1941 ? .35 : 1; }
function taxYear(M) {
  const T = M.taxYr || (M.taxYr = { y: S.year, inc: 0, paid: 0 });
  if (T.y !== S.year) { if (T.paid > 0) { (M.taxHist = M.taxHist || []).push({ y: T.y, inc: T.inc, paid: T.paid }); if (M.taxHist.length > 60) M.taxHist.shift(); mail('news', 'The tax office', `Your ${T.y} tax year`, `You earned ${fmtCash(Math.round(T.earned || 0))} in ${T.y} and paid ${fmtCash(Math.round(T.paid))} in tax along the way, ${Math.round(T.paid / Math.max(1, T.earned || 1) * 100)}% of it. Nothing more is owed.`); } Object.assign(T, { y: S.year, inc: 0, paid: 0, earned: 0 }); }
  return T;
}
// the tax on money just earned (wages, fees, bonuses, royalties): what to hold back from it
function taxOn(amt) {
  const M = S.me; if (!M || !(amt > 0)) return 0;
  const T = taxYear(M), f = Math.max(1e-6, wageF(M.hub)), real = amt / f, e = taxEra(S.year);
  const due = Math.round(((T.inc + real) * taxEff(T.inc + real) - T.inc * taxEff(T.inc)) * f * e);
  T.inc += real; T.earned = (T.earned || 0) + amt; T.paid += due;
  return Math.max(0, Math.min(due, Math.round(amt * .5)));
}
// Weekly: interest, maturities, loan payments, and fate.
const FATE = [
  ['A bank error in your favour', .4, 'A clerical slip lands in your account. The bank, to its credit, lets you keep it.'], ['An aunt you barely knew leaves you something', .8, 'The will is read; your name is on it.'],
  ['A parking ticket from a city you\'ve never visited', -.05, 'You pay it; arguing would cost more.'], ['Your phone falls in a canal', -.08, 'A new phone, and a lesson about canals.'],
  ['A burst pipe in the flat', -.15, 'The insurer pays half. Eventually.'], ['A tax audit', -.25, 'The auditor finds a receipt you forgot. And another you didn\'t keep.'],
  ['A scratch card wins', .12, 'Not life-changing; nicely week-changing.'], ['An old residual cheque', .1, 'A forgotten credit pays out after a television rerun.'],
  ['A friend repays a loan you\'d written off', .1, 'With interest, and an apology.'], ['Identity fraud', -.2, 'Someone in another country had a lovely week on your card.'],
  ['A lawsuit over a scene you shot years ago', -.3, 'Settled out of court. Your lawyer is delighted.'], ['A sponsor sends a cheque by mistake, then lets you keep it', .2, 'Their accounts department is having a bad year.']
];
function bankWeek() {
  const M = S.me; if (!M) return; const B = bankOf(M);
  sectorDivWeek(); taxYear(M);
  if (B.sav > 0) { const i = Math.round(B.sav * savRate() / 100 / 52 * 100) / 100; B.sav += i; B.earned = (B.earned || 0) + i; }
  for (let k = B.cds.length - 1; k >= 0; k--) { const c = B.cds[k]; if (S.week >= c.due) { const pay = Math.round(c.amt * (1 + c.rate / 100 * (c.due - c.from) / 52)); M.cash += pay; B.cds.splice(k, 1); mail('news', 'Your bank', 'Term deposit matured', `${fmtCash(c.amt)} at ${c.rate.toFixed(2)}% has matured: ${fmtCash(pay)} has been paid into your account.`); } }
  if (B.sbl > 0) {   // the portfolio line: weekly interest, and a margin call if the shares fall too far
    const int = Math.round(B.sbl * (rateAt(S.year) + 1.5) / 100 / 52); M.cash -= int;
    const nw = osNetWorth(); if (B.sbl > nw.shares * .7 && M.port) { let need = B.sbl - nw.shares * .5; for (const id in M.port) { if (need <= 0) break; const c = S.companies[+id], n = M.port[id]; if (!c || !n) continue; const px = mktPrice(c), k = Math.min(n, Math.ceil(need / px)); M.port[id] -= k; B.sbl = Math.max(0, B.sbl - k * px); need -= k * px; } mail('news', 'Your bank', 'Margin call', 'Your shares fell below the level the credit line needs. The bank sold some of them to cover it.'); B.hist.push({ w: S.week, t: 'Margin call: shares sold to cover the credit line' }); }
  }
  if (B.loan > 0) {
    const int = B.loan * B.lrate / 100 / 52, pay = Math.max(int * 1.3, B.loan * .01);
    if (M.cash >= pay) { M.cash -= Math.round(pay); B.loan = Math.max(0, B.loan + int - pay); if (S.week % 13 === 0) B.score = clamp(B.score + 3, 300, 850); }
    else { B.loan += int + 25; B.score = clamp(B.score - 15, 300, 850); B.missed = (B.missed || 0) + 1; if (B.missed % 4 === 1) mail('inbox', 'Your bank', 'Missed loan payment', `You missed this week's payment of ${fmtCash(Math.round(pay))}. A late fee has been added and your credit score has dropped to ${B.score}.`); }
  }
  if (prnd() < .012) { const F = FATE[Math.floor(prnd() * FATE.length)], base = Math.max(usd(400), Math.abs(M.cash) * .05 + usd(300)), amt = Math.round(base * F[1] * (1 + prnd())); M.cash += amt; diary(`Money: ${F[0]} (${amt >= 0 ? '+' : ''}${fmtCash(amt)})`); inbox('note', F[0], `${F[2]} ${amt >= 0 ? '+' : ''}${fmtCash(amt)}.`); }
  // insider trading has consequences
  for (const t of (M.insider || []).filter(x => !x.done && S.week >= x.w + 6)) { t.done = 1; if (prnd() < .3) { const fine = Math.round(Math.max(usd(2000), t.gain * 3)); M.cash -= fine; ME().standing = clamp(ME().standing - 6, 0, 100); news('Industry', `${ME().name} fined by the securities regulator over a well-timed share trade.`, { person: ME().id }); inbox('note', 'The securities regulator calls', `They noticed your trade before the opening weekend, and who you'd been talking to. The fine is ${fmtCash(fine)}, and the trades write it up.`); } }
}
// a trade right after an insider tip gets remembered
function noteInsider(co, n) { const M = S.me, tip = tipsThisWeek().find(t => t.insider && t.co === co); if (tip && n > 0 && M.tipsSeen && M.tipsSeen.includes(S.week + ':' + co)) (M.insider = M.insider || []).push({ w: S.week, co, gain: Math.abs(n) * mktPrice(S.companies[co]) * .1 }); }
// ---- app pieces ----
function sectorsHTML() {
  const L = SECTORS.map(s => SECTOR[s[0]]).filter(sectorOpen), M = S.me;
  const row = s => `<tr><td><b>${esc(s.tk)}</b></td><td class="small">${esc(s.name)}<br><span class="muted">${esc(s.sec)}</span></td><td>${sSpark(s)}</td><td class="n">$${sectorPrice(s).toFixed(2)}</td><td class="n">${pctS(sChg(s, 1))}</td><td class="n">${pctS(sChg(s, 52))}</td><td class="n">${(M.sport || {})[s.k] || 0}</td><td><button class="btn-s" data-sec="buy:${s.k}">Buy</button> ${(M.sport || {})[s.k] ? `<button class="btn-s ghost" data-sec="sell:${s.k}">Sell</button>` : ''}</td></tr>`;
  return `<p class="small muted">The businesses that live off the films. Each follows its own driver (the box office, how many films are shooting, music, streaming, kids' merchandise) plus the economy.</p>
   <div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th>6M</th><th class="n">Price</th><th class="n">1W</th><th class="n">1Y</th><th class="n">Own</th><th></th></tr></thead><tbody>${L.map(row).join('')}
   <tr><td><b>BOX50</b></td><td class="small">BOX-50 index fund<br><span class="muted">Every listed studio at once</span></td><td></td><td class="n">$${fundPrice().toFixed(2)}</td><td class="n">${pctS((fundPrice() / fundPrice(S.week - 1) - 1) * 100)}</td><td class="n">${pctS((fundPrice() / fundPrice(S.week - 52) - 1) * 100)}</td><td class="n">${(M.sport || {}).box50 || 0}</td><td><button class="btn-s" data-sec="buy:box50">Buy</button> ${(M.sport || {}).box50 ? '<button class="btn-s ghost" data-sec="sell:box50">Sell</button>' : ''}</td></tr></tbody></table></div><p class="small muted">Trades use the share count in the box on the stock page (${(UI.mkt && UI.mkt.q) || 10} shares).</p>`;
}
function economyHTML() {
  const ev = macroNow(), lvl = macroAt(S.week), lvlY = macroAt(S.week - 52);
  return `<div class="kpis mini"><div><span>Interest rate</span><b>${rateAt(S.year).toFixed(2)}%</b></div><div><span>Market mood</span><b class="${lvl >= 1 ? 'good' : 'bad'}">${lvl >= 1.08 ? 'Euphoric' : lvl >= 1.02 ? 'Bullish' : lvl >= .98 ? 'Calm' : lvl >= .9 ? 'Nervous' : 'Panic'}</b></div><div><span>Over the year</span><b>${pctS((lvl / lvlY - 1) * 100)}</b></div></div>
   ${ev.length ? `<ul class="plain small">${ev.map(e => `<li><b>${esc(e.name)}</b>${e.real ? '' : ''} <span class="muted">${esc(e.d)}</span></li>`).join('')}</ul>` : '<p class="small muted">No big story moving the market right now.</p>'}`;
}
function tipsHTML() {
  const M = S.me, T = tipsThisWeek(); M.tipsSeen = M.tipsSeen || []; for (const t of T) { const k = S.week + ':' + t.co; if (!M.tipsSeen.includes(k)) M.tipsSeen.push(k); } if (M.tipsSeen.length > 60) M.tipsSeen.splice(0, M.tipsSeen.length - 60);
  return `<p class="small muted">What people are saying about the films opening soon. Sources vary; some are wrong, and one kind is a crime to trade on.</p><ul class="plain mnews">${T.map(t => { const f = S.films[t.f], c = S.companies[t.co]; return `<li>${t.insider ? '🤫' : '💬'} <b>${esc(t.src[0].toUpperCase() + t.src.slice(1))}</b> says ${fl(f.id)} (${esc(tickerOf(c))}) will <b class="${t.claim > 0 ? 'good' : 'bad'}">${t.claim > 0 ? 'open big' : 'flop'}</b>. <span class="muted small">Opens ${fmtDate(t.opens, true)} · source usually right ${Math.round(t.rel * 100)}% of the time${t.insider ? ' · trading on this is insider dealing' : ''}</span> <a href="#" class="lk" data-mkt="sel:${c.id}">Trade ›</a></li>`; }).join('') || '<li class="muted">Quiet week. Nothing big opening soon.</li>'}</ul>`;
}
function bankHTML() {
  const M = S.me, B = bankOf(M), lim = creditLimit(M);
  return `<div class="os-grid">${osCard('Savings', `<p class="os-big">${fmtCash(Math.round(B.sav))}</p><p class="small muted">${savRate().toFixed(2)}% a year, paid weekly. Earned so far ${fmtCash(Math.round(B.earned || 0))}.</p><div class="bank-f"><input id="bk-amt" type="number" min="1" placeholder="Amount" value="${UI.bkamt || ''}"><button class="os-btn" data-bank="deposit">Deposit</button><button class="os-btn" data-bank="withdraw">Withdraw</button></div>`)}
   ${osCard('Term deposits', `<p class="small">Lock money away for a better rate: 6 months ${cdRate(26).toFixed(2)}%, 1 year ${cdRate(52).toFixed(2)}%, 2 years ${cdRate(104).toFixed(2)}%. Breaking early costs 3%.</p><div class="bank-f"><button class="os-btn" data-bank="cd:0">6 months</button><button class="os-btn" data-bank="cd:1">1 year</button><button class="os-btn" data-bank="cd:2">2 years</button></div>${B.cds.length ? `<ul class="os-list">${B.cds.map((c, i) => `<li><b>${fmtCash(c.amt)}</b><span class="muted">${c.rate.toFixed(2)}% · matures ${fmtDate(c.due, true)}</span><button class="linkish" data-bank="breakcd:${i}">Break</button></li>`).join('')}</ul>` : ''}`)}
   ${osCard('Tax', (() => { const T0 = M.taxYr, T = T0 && T0.y === S.year ? T0 : { y: S.year, inc: 0, paid: 0, earned: 0 }, H = (M.taxHist || []).slice(-1)[0]; return `<p class="small">This year you've earned <b>${fmtCash(Math.round(T.earned || 0))}</b> and paid <b>${fmtCash(Math.round(T.paid))}</b> in tax${T.earned ? ` (${Math.round(T.paid / T.earned * 100)}%)` : ''}. It comes out as you're paid, so nothing is owed at the end.</p>${H ? `<p class="small muted">Last year: ${fmtCash(Math.round(H.paid))} on ${fmtCash(Math.round(H.inc * wageF(M.hub)))}.</p>` : ''}<p class="small muted">Investment gains and dividends aren't taxed here.</p>`; })())}
   ${osCard('Borrowing', `<p class="small">Credit score <b>${B.score}</b> · limit ${fmtCash(lim)} · rate ${loanRate(M).toFixed(1)}%</p>${B.loan > 0 ? `<p>You owe <b class="bad">${fmtCash(Math.round(B.loan))}</b> at ${B.lrate.toFixed(1)}%. Payments come out weekly.</p>` : ''}<div class="bank-f"><button class="os-btn" data-bank="borrow">Borrow</button>${B.loan > 0 ? '<button class="os-btn" data-bank="repay">Repay</button>' : ''}</div><p class="small muted">Use loans to fund a film, a home or a bet on the market. Miss payments and the score falls, the rate rises and the limit shrinks.</p>`)}
   ${osCard('Credit score', `<p class="os-big">${B.score}</p><p class="small muted">${B.score >= 740 ? 'Excellent: the best rates and limits.' : B.score >= 670 ? 'Good.' : B.score >= 580 ? 'Fair: rates are higher.' : 'Poor: borrowing is expensive and limited.'} It rises with on-time payments and repaying early; it falls with missed payments.</p>`)}
   ${osCard('Statement', (B.hist || []).length ? `<ul class="os-list">${B.hist.slice(-8).reverse().map(h => `<li><span class="muted">${fmtDate(h.w, true)}</span><span>${esc(h.t)}</span></li>`).join('')}</ul>` : '<p class="small muted">Nothing unusual on the account.</p>')}</div>
   ${typeof privateBankHTML === 'function' ? '<h4>Private banking</h4>' + privateBankHTML() : ''}`;
}
function bankClick(t) {
  const d = t.dataset;
  if (d.bank) { const [k, v] = d.bank.split(':'), amt = +((document.getElementById('bk-amt') || {}).value || 0); UI.bkamt = amt || ''; doAct(k === 'cd' ? { t: 'bank', k: 'cd', term: +v, amt } : k === 'breakcd' ? { t: 'bank', k, i: +v } : { t: 'bank', k, amt }); render(true); return true; }
  if (d.secf) { UI.secf = d.secf; render(true); return true; }
  if (d.sec) { const [k, s] = d.sec.split(':'), q = Math.max(1, Math.round(+(document.getElementById('mkt-q') || {}).value || (UI.mkt && UI.mkt.q) || 10)); doAct({ t: 'strade', s, n: k === 'buy' ? q : -q }); render(true); return true; }
  return false;
}
