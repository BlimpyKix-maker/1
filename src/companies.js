// ---------------- Company terminal ----------------
// Each company reads like a market terminal: a ticker, a share price that tracks what the company is really worth
// (cash, the library's future earnings, the slate), its history month by month, a corporate structure, a logo,
// and the lore at the bottom. The worth is the simulation's own numbers, so a hit moves the price and a flop sinks it.
function tickerOf(c) { const w = c.name.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(x => x && !/^(the|and|of|films?|pictures?|studios?)$/i.test(x)); return (w.length >= 2 ? w.map(x => x[0]).join('') : (w[0] || c.name).slice(0, 4)).toUpperCase().slice(0, 4); }
function sharesOf(c) { return [0, 20, 4, .5][c.tier] * (0.6 + hashRand(c.id * 13 + 1)() * .8); }   // millions of shares
// What the company is worth, in the world's millions: cash, what its library will still earn, what's in the pipeline.
function companyWorth(c, libByOwner) {
  const lib = libByOwner ? libByOwner[c.id] || 0 : S.films.reduce((s, f) => s + (f.owner === c.id && f.rel !== null ? libValue(f, S.year) : 0), 0);
  const pipe = c.films.reduce((s, i) => { const f = S.films[i]; return s + (f.rel === null && f.stage >= 0 ? f.budget * .35 : 0); }, 0);
  return Math.max(.05, c.cash + lib * .6 + pipe + c.hits * .5);
}
// Once a month the market marks every company to its worth (no dice: the price is the worth plus a mood).
function markCompanies() {
  if (S.year < S.startYear) return;
  const lib = {};
  for (const f of S.films) if (f.owner !== null && f.owner !== undefined && f.rel !== null && S.week - f.rel < 520) lib[f.owner] = (lib[f.owner] || 0) + libValue(f, S.year);
  for (const c of S.companies) {
    if (c.closed !== null) continue;
    const mood = 1 + Math.sin((S.week + c.id * 7) / 9) * .04;   // the market's own weather
    (c.hist = c.hist || []).push(+(companyWorth(c, lib) * mood).toFixed(3));
    if (c.hist.length > 120) c.hist.shift();
  }
}
function priceOf(c, v) { return v / sharesOf(c); }
function sparkline(vals, w = 260, h = 60) {
  if (!vals || vals.length < 2) return '<p class="muted small">Not enough trading history yet.</p>';
  const lo = Math.min(...vals), hi = Math.max(...vals), sx = w / (vals.length - 1), sy = v => h - 4 - (v - lo) / Math.max(1e-9, hi - lo) * (h - 8);
  const up = vals[vals.length - 1] >= vals[0], pts = vals.map((v, i) => `${(i * sx).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Value history"><polyline points="${pts}" fill="none" stroke="${up ? 'var(--good)' : 'var(--bad)'}" stroke-width="2"/><polygon points="0,${h} ${pts} ${w},${h}" fill="${up ? 'var(--good)' : 'var(--bad)'}" opacity=".12"/></svg>`;
}
function logoSVG(c, s = 64) {
  const r = hashRand(c.id * 211 + 5), hues = ['#B3261E', '#0E5E5C', '#1C4E80', '#C8901A', '#4B2683', '#111111', '#2D7A4C', '#E8553E'], col = hues[Math.floor(r() * hues.length)], kind = Math.floor(r() * 5), t = tickerOf(c).slice(0, 3);
  const mark = [`<circle cx="32" cy="32" r="28" fill="${col}"/>`, `<path d="M32 4 L58 16 L54 44 Q46 56 32 60 Q18 56 10 44 L6 16Z" fill="${col}"/>`, `<path d="M4 54 L22 18 L32 34 L42 12 L60 54Z" fill="${col}"/>`, `<rect x="6" y="6" width="52" height="52" rx="10" fill="${col}"/>`, `<circle cx="32" cy="32" r="28" fill="none" stroke="${col}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(i => { const a = i / 5 * Math.PI * 2; return `<circle cx="${32 + Math.cos(a) * 15}" cy="${32 + Math.sin(a) * 15}" r="5" fill="${col}"/>`; }).join('')}`][kind];
  const ink = kind === 4 ? col : '#fff';
  return `<svg class="logo" viewBox="0 0 64 64" width="${s}" height="${s}" role="img" aria-label="${esc(c.name)} logo">${mark}<text x="32" y="${kind === 2 ? 50 : 38}" text-anchor="middle" fill="${ink}" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="${t.length > 2 ? 15 : 18}">${esc(t)}</text></svg>`;
}
// Who runs it: the producers it trusts most, plus a few names on the board.
function structureOf(c) {
  const fav = Object.entries(c.favors).map(([k, v]) => [+k, v]).filter(([k]) => P(k) && !P(k).dead).sort((a, b) => b[1] - a[1]);
  const prods = fav.filter(([k]) => P(k).role === 'producer').map(([k]) => k), dirs = fav.filter(([k]) => P(k).role === 'director').map(([k]) => k);
  const N = NAMES[HUBS[c.hub].lang] || NAMES.en, r = hashRand(c.id * 17 + 3), nm = () => { const a = N[r() < .5 ? 'M' : 'F'][Math.floor(r() * 10)], b = N.L[Math.floor(r() * N.L.length)]; return EAST[HUBS[c.hub].lang] ? `${b} ${a}` : `${a} ${b}`; };
  const owner = c.owner !== undefined ? c.owner : null;
  return {
    ceo: owner !== null ? owner : prods[0] ?? null, ceoName: nm(), hop: prods[owner !== null ? 0 : 1] ?? null, dist: nm(), cfo: nm(), board: [nm(), nm(), nm()].slice(0, c.tier === 1 ? 3 : c.tier === 2 ? 2 : 1), partners: dirs.slice(0, 4),
    divisions: { 1: ['Studio', 'Worldwide distribution', 'Classics label', 'Television', 'International'], 2: ['Production', 'Distribution', 'Library sales'], 3: ['Production'] }[c.tier]
  };
}
function companyLore(c) {
  const out = [], films = c.films.map(i => S.films[i]).filter(f => f && f.rel !== null);
  const r = hashRand(c.id * 41 + 9), pk = a => a[Math.floor(r() * a.length)];
  out.push(['f', `Founded in ${c.founded} ${pk(['above a dry cleaner', 'in a converted warehouse', 'with money from a cousin in shipping', 'by two former agents who fell out within a year', 'after its founder lost a bet', 'in a garage that still holds the first camera'])}.`, 0]);
  if (films.length) {
    const hit = films.slice().sort((a, b) => b.total - a.total)[0], flop = films.slice().sort((a, b) => a.theatrical - b.theatrical)[0], best = films.slice().sort((a, b) => b.reviews - a.reviews)[0];
    out.push(['f', `Biggest hit: ${hit.title} (${yearOf(hit.rel)}), ${fmtM(hit.total)} worldwide.`, 0]);
    if (flop.theatrical < 0) out.push(['f', `Most expensive mistake: ${flop.title}, which lost ${fmtM(-flop.theatrical)}.`, 3]);
    out.push(['f', `Best reviewed: ${best.title} (${best.reviews}/100).`, 2]);
    const g = {}; for (const f of films) g[f.genre] = (g[f.genre] || 0) + 1; const top = Object.entries(g).sort((a, b) => b[1] - a[1])[0];
    out.push(['f', `${Math.round(top[1] / films.length * 100)}% of its films have been ${top[0].toLowerCase()}.`, 4]);
    const aw = films.reduce((s, f) => s + (f.awards || []).length, 0); if (aw) out.push(['f', `Its films have won ${aw} award${aw > 1 ? 's' : ''}.`, 2]);
  }
  out.push(['r', pk(['The founder is said to read every script that comes in, personally, on a sun lounger.', 'Insiders say the canteen is better than most restaurants in town.', 'There is reportedly a vault of unreleased films nobody is allowed to mention.', 'The logo was supposedly sketched on a napkin during a very long lunch.', 'Staff whisper that the boardroom table was a gift from a grateful star.']), 12]);
  out.push(['s', pk(['The office has a resident tortoise with a better parking space than the CFO.', 'Every new hire must sing the company song. Nobody knows the second verse.', 'The lobby fountain is rumoured to be haunted by a disgruntled screenwriter.', 'Company legend says a raccoon once sat in on a greenlight meeting and voted yes.']), 0]);
  return out;
}
function companyTerminal(c) {
  const h = c.hist || [], now = h.length ? h[h.length - 1] : companyWorth(c), sh = sharesOf(c), px = priceOf(c, now);
  const chg = k => h.length > k ? (now / h[h.length - 1 - k] - 1) * 100 : null, pct = v => v === null ? '—' : `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '▲' : '▼'} ${Math.abs(v).toFixed(1)}%</span>`;
  const films = c.films.map(i => S.films[i]).filter(Boolean), rel = films.filter(f => f.rel !== null), recent = rel.filter(f => S.week - f.rel < 156);
  const priced = rel.filter(f => typeof f.theatrical === 'number' && f.theatrical === f.theatrical), hitRate = priced.length ? Math.round(priced.filter(f => f.theatrical > 0).length / priced.length * 100) : 0, avgRev = recent.length ? Math.round(avg(recent.map(f => f.reviews))) : null;
  const slate = films.filter(f => f.rel === null && f.stage >= 0), st = structureOf(c);
  const person = (id, alt) => id !== null && id !== undefined ? pl(id) : esc(alt || '—');
  return `<div class="term">
   <div class="term-top">${logoSVG(c, 72)}<div><p class="eyebrow">${TIER[c.tier]} · ${esc(hubName(c.hub))} · founded ${c.founded}${c.owner !== undefined ? ' · privately held by ' + esc(P(c.owner).name) : ''}</p><h2>${esc(c.name)} <span class="ticker">${esc(tickerOf(c))}</span></h2>
    <p class="price">${c.closed !== null ? `<span class="bad">Closed ${c.closed}</span>` : `$${px.toFixed(2)}<small> a share</small> ${pct(chg(1))} <span class="muted small">1M</span> ${pct(chg(12))} <span class="muted small">1Y</span>`}</p></div>${sparkline(h.slice(-60))}</div>
   <div class="kpis term-k"><div><span>Value</span><b>${fmtM(now)}</b></div><div><span>Cash</span><b class="${c.cash < 0 ? 'bad' : ''}">${fmtM(c.cash)}</b></div><div><span>Shares</span><b>${sh.toFixed(1)}M</b></div><div><span>Hit rate</span><b>${hitRate}%</b></div><div><span>Critics, 3 yrs</span><b>${avgRev ?? '—'}</b></div><div><span>Films / hits</span><b>${films.length} / ${c.hits}</b></div><div><span>Library films</span><b>${libCount(c)}</b></div><div><span>Library income</span><b>${fmtM(c.libIncLast)}</b></div></div>
   <div class="cols two"><section class="panel"><h3>Who runs it</h3><div class="cr"><span>Chief executive</span><span>${person(st.ceo, st.ceoName)}</span></div><div class="cr"><span>Head of production</span><span>${person(st.hop, st.ceoName === st.dist ? '—' : 'Vacant')}</span></div><div class="cr"><span>Distribution</span><span>${esc(st.dist)}</span></div><div class="cr"><span>Finance</span><span>${esc(st.cfo)}</span></div><div class="cr"><span>Board</span><span>${st.board.map(esc).join(', ')}</span></div>${st.partners.length ? `<div class="cr"><span>Creative partners</span><span>${st.partners.map(pl).join(', ')}</span></div>` : ''}<p class="muted small">Divisions: ${st.divisions.join(' · ')}. Taste: ${Object.keys(c.taste).map(g => g.toLowerCase()).join(' and ')}.</p></section>
   <section class="panel"><h3>On the slate</h3>${slate.length ? `<ul class="plain">${slate.slice(0, 10).map(f => `<li>${fl(f.id)} ${stageCell(f)} <span class="muted small">${fmtM(f.budget)}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing in production.</p>'}
    <h4>Analysts say</h4><p class="muted">${c.closed !== null ? 'Nothing: the company is gone.' : c.cash < 0 ? 'Debt is the story here. One more flop and the lenders take the keys.' : chg(12) !== null && chg(12) > 15 ? 'Momentum is real. The question is whether the next slate can match it.' : chg(12) !== null && chg(12) < -15 ? 'A rough year. Expect cost-cutting and a safer slate.' : hitRate > 55 ? 'A steady hand: more hits than misses, few surprises.' : 'Hard to read. Everything depends on the next couple of releases.'}</p></section></div></div>`;
}
