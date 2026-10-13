// ================= Real history, as a shape: film output by country and decade =================
// Round 22. tools/wikidata_films.js counts, once at build time, the feature films Wikidata records for each country
// in each decade (CC0; counts only). Wikidata knows far more recent films than old ones, so each country's count is
// turned into a share of the decade's total before it is used. That share, against the country's own average,
// says when its industry boomed and when it shrank: Italy in the sixties, Hong Kong in the eighties, Korea and
// Nigeria in the 2000s. Each city's production curve is bent halfway towards that shape (never more than ×1.6 or
// below ×0.6), so the generated history keeps its own levels but rises and falls when the real one did.
const WD_HUB = { hollywood: ['US'], newyork: ['US'], toronto: ['CA'], mexico: ['MX'], london: ['GB'], paris: ['FR'], rome: ['IT'], berlin: ['DE', 'DD'], madrid: ['ES'], hongkong: ['HK'], taipei: ['TW'], tokyo: ['JP'], seoul: ['KR'], beijing: ['CN'], mumbai: ['IN'], chennai: ['IN'], kolkata: ['IN'], sydney: ['AU'], wellington: ['NZ'], lagos: ['NG'], cairo: ['EG'], rio: ['BR'], buenosaires: ['AR'], moscow: ['RU', 'SU'], stockholm: ['SE'], copenhagen: ['DK'], prague: ['CZ', 'CS'], warsaw: ['PL'], budapest: ['HU'], helsinki: ['FI'], istanbul: ['TR'], tehran: ['IR'], dakar: ['SN'], manila: ['PH'], bangkok: ['TH'], hochiminh: ['VN'], bogota: ['CO'], jakarta: ['ID'], johannesburg: ['ZA'] };
const WD_DECS = [1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
let WD_SHAPE = null;
const WD_SKIP = new Set(['lagos']);   // Nollywood's home-video boom is barely recorded in Wikidata; its own curve is closer to the truth
function wdShapes() {
  if (WD_SHAPE || typeof WD_FILMS === 'undefined') return WD_SHAPE;
  const tot = {}; for (const k in WD_FILMS) for (const d of WD_DECS) tot[d] = (tot[d] || 0) + (WD_FILMS[k][d] || 0);
  WD_SHAPE = {};
  for (const h in WD_HUB) { const share = WD_DECS.map(d => WD_HUB[h].reduce((t, k) => t + ((WD_FILMS[k] || {})[d] || 0), 0) / Math.max(1, tot[d]));
    const L = share.filter((x, i) => WD_DECS[i] >= 1950), avg = L.reduce((t, x) => t + x, 0) / Math.max(1, L.length);
    if (avg <= 0) continue; WD_SHAPE[h] = share.map(x => x / avg); }
  return WD_SHAPE;
}
// the game's own curve, against its own average over the same years
const WD_GAVG = {};
function wdGameAvg(h) { if (WD_GAVG[h] == null) { let t = 0, n = 0; for (let y = 1955; y <= 2025; y += 10) { t += era(HUBS[h].prod, y); n++; } WD_GAVG[h] = t / n; } return WD_GAVG[h]; }
function wdFactor(h, y) {
  const Sh = wdShapes(); if (!Sh || !Sh[h] || y < 1930 || !HUBS[h] || WD_SKIP.has(h)) return 1;
  const t = clamp((y - 1935) / 10, 0, WD_DECS.length - 1), i = Math.floor(t), f = t - i, real = Sh[h][i] * (1 - f) + Sh[h][Math.min(WD_DECS.length - 1, i + 1)] * f;
  const game = era(HUBS[h].prod, y) / Math.max(.01, wdGameAvg(h));
  return clamp(Math.sqrt(Math.max(.05, real) / Math.max(.05, game)), .6, 1.6);
}
{ const _hp = hubProd; hubProd = function (h, y) { return _hp.apply(this, arguments) * wdFactor(h, y); }; }
// the almanac: where the world's films came from, decade by decade
function wdAlmanacHTML() {
  if (typeof WD_FILMS === 'undefined') return '';
  const NAME = { US: 'United States', CA: 'Canada', MX: 'Mexico', GB: 'United Kingdom', FR: 'France', IT: 'Italy', DE: 'Germany', DD: 'East Germany', ES: 'Spain', HK: 'Hong Kong', TW: 'Taiwan', JP: 'Japan', KR: 'South Korea', CN: 'China', IN: 'India', AU: 'Australia', NZ: 'New Zealand', NG: 'Nigeria', EG: 'Egypt', BR: 'Brazil', AR: 'Argentina', RU: 'Russia', SU: 'Soviet Union', SE: 'Sweden', DK: 'Denmark', CZ: 'Czechia', CS: 'Czechoslovakia', PL: 'Poland', HU: 'Hungary', FI: 'Finland', TR: 'Turkey', IR: 'Iran', SN: 'Senegal', PH: 'Philippines', TH: 'Thailand', VN: 'Vietnam', CO: 'Colombia', ID: 'Indonesia', ZA: 'South Africa' };
  const rows = WD_DECS.filter(d => d <= Math.floor(S.year / 10) * 10).map(d => { const L = Object.keys(WD_FILMS).map(k => [k, WD_FILMS[k][d] || 0]).sort((a, b) => b[1] - a[1]), tot = L.reduce((t, x) => t + x[1], 0) || 1;
    return `<tr><td>${d}s</td><td class="small">${L.slice(0, 5).map(([k, n]) => `${esc(NAME[k] || k)} <span class="muted">${Math.round(n / tot * 100)}%</span>`).join(' · ')}</td></tr>`; }).join('');
  return `<section class="panel"><h3>Where the world's films came from</h3><table class="grid small"><thead><tr><th>Decade</th><th>Largest producers (share of recorded features)</th></tr></thead><tbody>${rows}</tbody></table><p class="small muted">Real history, from Wikidata's records of feature films by country of origin (counts only). Older and smaller industries are under-recorded. The cities of this world rise and fall with these shapes.</p></section>`;
}
if (typeof OS_VIEWS !== 'undefined' && OS_VIEWS.world) { const _ow = OS_VIEWS.world; OS_VIEWS.world = function () { return _ow.apply(this, arguments) + wdAlmanacHTML(); }; }
