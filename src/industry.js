// ---------------- A living industry ----------------
// Once a month: companies chase what's working (a hit genre makes every rival want one), genres heat up and cool off
// in the trade press, and a company sliding toward collapse can be bought by a richer rival instead. Each company has a
// readable strategy, worked out from what it actually makes. No dice: everything follows from results.
function heatOf(m, g) { const v = (S.app[m] || {})[g] || 0; return v > .35 ? 'hot' : v > .12 ? 'warm' : v < -.25 ? 'cold' : v < -.08 ? 'cool' : 'steady'; }
const HEAT_LABEL = { hot: '🔥 Hot', warm: '▲ Warm', steady: '— Steady', cool: '▼ Cooling', cold: '❄️ Cold' };
function industryMonth() {
  if (S.year < S.startYear) return;
  const recent = S.films.filter(f => f.rel !== null && S.week - f.rel < 26 && f.rel <= S.week);
  // copycats: a genre that's paying makes everyone want one; old tastes fade
  for (const c of S.companies) {
    if (c.closed !== null || c.owner !== undefined) continue;
    const m = HUBS[c.hub].m;
    for (const g in c.taste) c.taste[g] = 1 + (c.taste[g] - 1) * .97;
    for (const f of recent) if (f.m === m && f.hitRatio > 2 && f.co !== c.id) c.taste[f.genre] = Math.min(2.6, (c.taste[f.genre] || 1) + .12);
  }
  // genre heat in the trades
  S.heat = S.heat || {};
  for (const m of new Set(HUB_IDS.map(h => HUBS[h].m))) {
    S.heat[m] = S.heat[m] || {};
    for (const g of GENRES) {
      const h = heatOf(m, g), was = S.heat[m][g];
      S.heatNews = S.heatNews || {};
      if (was && was !== h && (h === 'hot' || h === 'cold') && !(S.week - (S.heatNews[m + g] ?? -99) < 26)) (S.heatNews[m + g] = S.week), news('Trend', h === 'hot' ? `${g} is hot in ${MARKETS[m].name}: audiences can't get enough, and every studio wants one.` : `${g} has gone cold in ${MARKETS[m].name}. Projects are being quietly shelved.`, {});
      S.heat[m][g] = h;
    }
  }
  // mergers: a company heading for the rocks can be bought by a healthy rival in the same market
  const scale = y => budgetScale(y) * era(MARKETS.US.cost, y);
  for (const c of S.companies) {
    if (c.closed !== null || c.owner !== undefined || c.cash > -[0, 20, 6, 1.5][c.tier] * scale(S.year) * .35) continue;
    const buyer = S.companies.filter(b => b !== c && b.closed === null && b.owner === undefined && HUBS[b.hub].m === HUBS[c.hub].m && b.tier <= c.tier && b.cash > -c.cash).sort((a, b) => b.cash - a.cash)[0];
    if (!buyer) continue;
    buyer.cash += c.cash * .5;
    for (const f of S.films) { if (f.owner === c.id) f.owner = buyer.id; if (f.co === c.id && f.rel === null) { f.co = buyer.id; buyer.films.push(f.id); } }
    for (const k in c.favors) buyer.favors[k] = (buyer.favors[k] || 0) + c.favors[k] * .5;
    c.closed = S.year; c.mergedInto = buyer.id; buyer.acquired.push(c.id);
    news('Company', `${buyer.name} buys ${c.name}, debts and all. Staff are told their jobs are "safe for now".`, { company: buyer.id });
  }
}
// What a company is about, read from what it makes and how it's doing.
function companyStrategy(c) {
  if (c.closed !== null) return c.mergedInto !== undefined ? `Absorbed by ${S.companies[c.mergedInto].name}` : 'Closed';
  if (c.owner !== undefined) return 'Founder-run';
  const films = c.films.map(i => S.films[i]).filter(f => f && f.rel !== null && S.week - f.rel < 260);
  const rev = films.length ? avg(films.map(f => f.reviews)) : 60, top = Object.entries(c.taste).sort((a, b) => b[1] - a[1])[0];
  if (c.cash < -[0, 20, 6, 1.5][c.tier] * budgetScale(S.year) * .3) return 'In survival mode';
  if (c.tier === 1 && top && ['Superhero', 'Action', 'Sci-fi', 'Fantasy', 'Animation'].includes(top[0])) return 'Franchise machine';
  if (rev >= 70) return c.tier === 3 ? 'Indie darling' : 'Prestige house';
  if (top && ['Horror', 'Comedy', 'Thriller', 'Crime'].includes(top[0]) && c.tier >= 2) return 'Genre factory';
  if (films.length && avg(films.map(f => f.cost)) < budgetFor(c.tier, c.hub, 'Drama', S.year) * .6) return 'Cost cutter';
  return 'Generalist';
}
function heatPanel(m) {
  const rows = GENRES.map(g => [g, (S.app[m] || {})[g] || 0]).sort((a, b) => b[1] - a[1]);
  return `<section class="panel"><h3>What audiences want in ${esc(MARKETS[m].name)}</h3><div class="heat">${rows.map(([g, v]) => `<div class="hrow"><span>${esc(g)}</span><span class="hbar"><i style="width:${Math.round(clamp((v + .6) / 2.1, .03, 1) * 100)}%" class="h-${heatOf(m, g)}"></i></span><span class="small">${HEAT_LABEL[heatOf(m, g)]}</span></div>`).join('')}</div><p class="muted small">Tastes drift with every hit and flop. Studios chase what's hot, so what's hot gets crowded.</p></section>`;
}
