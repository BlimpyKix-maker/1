// ---------------- Legends: the industry's memory ----------------
// After Dwarf Fortress's Legends mode: everything the world has done since the first film is on file, and this app
// makes it readable.
//  - The Almanac: any year since cinema began. Its biggest films, prizes, debuts, deaths, studios founded and
//    closed, the trades' industry headlines, and the year in numbers.
//  - Records: all-time grosses (and the biggest hit of each era, as a share of its year), the biggest flops, the
//    most-awarded films and people, the most prolific, the longest careers.
//  - Lineage: for anyone, who they came up under, who came up under them, who they keep working with, and their
//    career year by year.
//  - Search across every film, person and studio, any era.
// And history now shows up in the news: a director's first film in years is reported as a return, with the film
// they last made.
OS_EXTRA.legends = ['📜', 'Legends', 'The industry\'s memory: any year since cinema began, all-time records, who came up under whom'];
OS_VIEWS.legends = () => legendsHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Industry'); if (g && !g[1].includes('legends')) g[1].push('legends'); }
const LG_C = { w: -1 };
function lgCache() { if (LG_C.w !== S.week || LG_C.n !== S.films.length) { LG_C.w = S.week; LG_C.n = S.films.length; LG_C.y = {}; LG_C.rec = null; LG_C.first = null; } return LG_C; }
function relYear(f) { return f.rel !== null && f.rel !== undefined ? yearOf(f.rel) : null; }
function filmsOf(y) { const C = lgCache(); if (!C.y[y]) C.y[y] = S.films.filter(f => relYear(f) === y && f.total > 0).sort((a, b) => b.total - a.total); return C.y[y]; }
function firstYear(p) { const C = lgCache(); if (!C.first) C.first = new Map(); if (!C.first.has(p.id)) { let y = null; for (const i of p.credits || []) { const ry = relYear(S.films[i] || {}); if (ry !== null && (y === null || ry < y)) y = ry; } C.first.set(p.id, y); } return C.first.get(p.id); }
function lgYears() { return [1888, S.year]; }
function legendsHTML() {
  const st = UI.lg = UI.lg || { tab: 'year', y: S.year - 1 };
  const tabs = [['year', 'Almanac'], ['rec', 'Records'], ['line', 'Lineage'], ['find', 'Search']].map(([k, l]) => `<button class="tk-chip${st.tab === k ? ' on' : ''}" data-lg="tab:${k}">${l}</button>`).join('');
  const body = st.tab === 'rec' ? lgRecords() : st.tab === 'line' ? lgLineage(st.pid) : st.tab === 'find' ? lgFind() : lgYear(st.y);
  return `<div class="tk tk-${UI.tkTheme || 'amber'} lg"><div class="tk-top"><span class="tk-brand">LEGENDS</span><span class="tk-sub">${S.films.length.toLocaleString()} films · ${S.people.length.toLocaleString()} people · ${(S.awards || []).length.toLocaleString()} prizes on file</span><span class="tk-sp"></span>${tabs}</div>${body}</div>`;
}
function lgYear(y) {
  const [y0, y1] = lgYears(); y = clamp(+y || y1 - 1, y0, y1);
  const F = filmsOf(y), tot = F.reduce((t, f) => t + f.total, 0), cost = F.filter(f => f.cost > 0), avgC = cost.length ? cost.reduce((t, f) => t + f.cost, 0) / cost.length : 0;
  const gen = {}; for (const f of F) gen[f.genre] = (gen[f.genre] || 0) + f.total; const G = Object.entries(gen).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const A = (S.awards || []).filter(a => a.y === y).slice(0, 14);
  const debut = S.people.filter(p => firstYear(p) === y && (p.credits || []).length >= 3).sort((a, b) => (b.credits.length + (b.fame || 0) / 10) - (a.credits.length + (a.fame || 0) / 10)).slice(0, 8);
  const died = S.people.filter(p => p.dead && p.deathY === y && (p.credits || []).length >= 2).sort((a, b) => b.credits.length - a.credits.length).slice(0, 8);
  const coF = S.companies.filter(c => c.founded === y).slice(0, 8), coC = S.companies.filter(c => c.closed === y).slice(0, 8);
  const hd = S.news.filter(n => n.type === 'Industry' && yearOf(n.w) === y).slice(-10).reverse();
  const nav = `<div class="lg-nav"><button class="tk-chip" data-lg="y:${y - 10}">«10</button><button class="tk-chip" data-lg="y:${y - 1}">‹</button><b class="lg-yr">${y}</b><button class="tk-chip" data-lg="y:${y + 1}">›</button><button class="tk-chip" data-lg="y:${y + 10}">10»</button><span class="tk-mut">${y1 - y ? `${y1 - y} year${y1 - y > 1 ? 's' : ''} ago` : 'this year'}</span></div>`;
  const num = (l, v) => `<div class="tk-kpi"><span>${l}</span><b class="tk-v">${v}</b></div>`;
  const lk = p => `<a href="#" class="lk" data-go="person:${p.id}">${esc(p.name)}</a> <button class="tk-chip" data-lg="p:${p.id}">lineage</button>`;
  return `${nav}<div class="tk-kpis">${num('FILMS RELEASED', F.length.toLocaleString())}${num('WORLD GROSS', fmtM(tot))}${num('AVG BUDGET', fmtM(avgC))}${num('TOP GENRE', G[0] ? esc(G[0][0]) : '—')}</div>
   <div class="tk-grid"><section class="tk-p"><h4>BIGGEST FILMS</h4><table class="tk-t"><tbody>${F.slice(0, 10).map((f, i) => `<tr><td class="n">${i + 1}</td><td>${fl(f.id)}</td><td class="tk-mut">${esc(f.genre)}</td><td class="n">${fmtM(f.total)}</td></tr>`).join('') || '<tr><td class="tk-mut">Nothing on file.</td></tr>'}</tbody></table></section>
   <section class="tk-p"><h4>PRIZES</h4><ul class="plain small">${A.map(a => `<li><b>${esc(a.name.replace(/^[A-Z]+:/, ''))}</b> ${a.film !== undefined && a.film !== null && S.films[a.film] ? fl(a.film) : ''}${(a.people || []).slice(0, 2).map(id => P(id) ? ' · ' + esc(P(id).name) : '').join('')}</li>`).join('') || '<li class="tk-mut">No prizes on file for this year.</li>'}</ul></section>
   <section class="tk-p"><h4>GENRE SHARE</h4><div class="tk-bars">${G.map(([g, v]) => `<div class="tk-bar"><span>${esc(g)}</span><i style="width:${(v / (tot || 1) * 100).toFixed(1)}%"></i><b>${Math.round(v / (tot || 1) * 100)}%</b><span></span></div>`).join('')}</div></section>
   <section class="tk-p"><h4>DEBUTS <span class="tk-sub">first screen credit, ranked by what came after</span></h4><ul class="plain small">${debut.map(p => `<li>${lk(p)} <span class="tk-mut">${esc(ROLE_LABEL[p.role] || p.role)} · ${p.credits.length} credits</span></li>`).join('') || '<li class="tk-mut">None on file.</li>'}</ul></section>
   <section class="tk-p"><h4>DEATHS</h4><ul class="plain small">${died.map(p => `<li>${lk(p)} <span class="tk-mut">${p.born ? `${p.born}–${y}` : ''} · ${p.credits.length} credits</span></li>`).join('') || '<li class="tk-mut">None on file.</li>'}</ul></section>
   <section class="tk-p"><h4>STUDIOS</h4><ul class="plain small">${coF.map(c => `<li><span class="up">founded</span> <a href="#" class="lk" data-go="company:${c.id}">${esc(c.name)}</a> <span class="tk-mut">${esc(hubName(c.hub))}</span></li>`).join('')}${coC.map(c => `<li><span class="dn">closed</span> <a href="#" class="lk" data-go="company:${c.id}">${esc(c.name)}</a> <span class="tk-mut">${c.founded ? `${y - c.founded} years old` : ''}</span></li>`).join('') || (coF.length ? '' : '<li class="tk-mut">No openings or closures on file.</li>')}</ul></section>
   ${hd.length ? `<section class="tk-p tk-wide"><h4>THE TRADES <span class="tk-sub">industry headlines that year</span></h4><ul class="plain small">${hd.map(n => `<li><span class="tk-mut">${esc(fmtDate(n.w, true))}</span> ${esc(n.text)}</li>`).join('')}</ul></section>` : ''}</div>`;
}
function lgRecords() {
  const C = lgCache();
  if (!C.rec) {
    const R = S.films.filter(f => f.rel !== null && f.total > 0), yt = {};
    for (const f of R) { const y = relYear(f); yt[y] = (yt[y] || 0) + f.total; }
    const aw = {}, ap = {}; for (const a of S.awards || []) { if (a.film !== undefined && a.film !== null) aw[a.film] = (aw[a.film] || 0) + 1; for (const id of a.people || []) ap[id] = (ap[id] || 0) + 1; }
    const span = p => { const ys = (p.credits || []).map(i => relYear(S.films[i] || {})).filter(y => y !== null); return ys.length ? Math.max(...ys) - Math.min(...ys) : 0; };
    C.rec = {
      top: R.slice().sort((a, b) => b.total - a.total).slice(0, 12),
      era: R.map(f => [f, f.total / (yt[relYear(f)] || 1)]).filter(x => relYear(x[0]) !== S.year).sort((a, b) => b[1] - a[1]).slice(0, 10),
      flop: R.filter(f => f.cost > 0).map(f => [f, f.cost + (f.pa || 0) - (f.rentals || f.total * .5)]).sort((a, b) => b[1] - a[1]).slice(0, 10),
      awF: Object.entries(aw).sort((a, b) => b[1] - a[1]).slice(0, 10),
      awP: Object.entries(ap).sort((a, b) => b[1] - a[1]).slice(0, 10),
      prol: S.people.slice().sort((a, b) => (b.credits || []).length - (a.credits || []).length).slice(0, 10),
      long: S.people.filter(p => (p.credits || []).length >= 8).map(p => [p, span(p)]).sort((a, b) => b[1] - a[1]).slice(0, 10)
    };
  }
  const X = C.rec, pl2 = id => P(+id) ? `<a href="#" class="lk" data-go="person:${id}">${esc(P(+id).name)}</a>` : '?';
  const sec = (h, sub, rows) => `<section class="tk-p"><h4>${h} <span class="tk-sub">${sub}</span></h4><table class="tk-t"><tbody>${rows}</tbody></table></section>`;
  return `<div class="tk-grid">${sec('ALL-TIME GROSSES', 'worldwide, money of the day', X.top.map((f, i) => `<tr><td class="n">${i + 1}</td><td>${fl(f.id)}</td><td class="n tk-mut">${relYear(f)}</td><td class="n">${fmtM(f.total)}</td></tr>`).join(''))}
   ${sec('HITS OF THEIR ERA', 'share of their year\'s whole box office', X.era.map(([f, s], i) => `<tr><td class="n">${i + 1}</td><td>${fl(f.id)}</td><td class="n tk-mut">${relYear(f)}</td><td class="n">${(s * 100).toFixed(1)}%</td></tr>`).join(''))}
   ${sec('BIGGEST FLOPS', 'cost and marketing not earned back', X.flop.map(([f, l], i) => `<tr><td class="n">${i + 1}</td><td>${fl(f.id)}</td><td class="n tk-mut">${relYear(f)}</td><td class="n dn">−${fmtM(l)}</td></tr>`).join(''))}
   ${sec('MOST-AWARDED FILMS', 'prizes of every kind', X.awF.map(([id, n], i) => `<tr><td class="n">${i + 1}</td><td>${fl(+id)}</td><td class="n">${n}</td></tr>`).join(''))}
   ${sec('MOST-AWARDED PEOPLE', '', X.awP.map(([id, n], i) => `<tr><td class="n">${i + 1}</td><td>${pl2(id)}</td><td class="n">${n}</td></tr>`).join(''))}
   ${sec('MOST PROLIFIC', 'screen credits', X.prol.map((p, i) => `<tr><td class="n">${i + 1}</td><td>${pl2(p.id)}</td><td class="tk-mut">${esc(ROLE_LABEL[p.role] || p.role)}</td><td class="n">${p.credits.length}</td></tr>`).join(''))}
   ${sec('LONGEST CAREERS', 'first credit to last', X.long.map(([p, n], i) => `<tr><td class="n">${i + 1}</td><td>${pl2(p.id)}</td><td class="tk-mut">${esc(ROLE_LABEL[p.role] || p.role)}</td><td class="n">${n} yrs</td></tr>`).join(''))}</div>`;
}
// who you came up under: the directors (or producers) of your first films; who came up under you: people whose
// first film was one of yours
function lgLineage(pid) {
  const p = pid !== undefined && pid !== null ? P(+pid) : ME();
  if (!p) return '<p class="tk-mut">Pick someone from the Almanac or Search.</p>';
  const films = (p.credits || []).map(i => S.films[i]).filter(f => f && f.rel !== null).sort((a, b) => a.rel - b.rel);
  const early = films.slice(0, 4), under = {}; for (const f of early) for (const id of [f.dir, f.prod]) if (id !== undefined && id !== null && id !== p.id) under[id] = (under[id] || 0) + 1;
  const mine = new Set(films.filter(f => f.dir === p.id || f.prod === p.id).map(f => f.id));
  const proteges = mine.size ? S.people.filter(q => q.id !== p.id && (q.credits || []).length >= 2 && mine.has(q.credits.slice().sort((a, b) => ((S.films[a] || {}).rel ?? 1e9) - ((S.films[b] || {}).rel ?? 1e9))[0])).sort((a, b) => b.credits.length - a.credits.length).slice(0, 10) : [];
  const co = {}; for (const f of films) for (const q of keyPeople(f)) if (q && q.id !== p.id) co[q.id] = (co[q.id] || 0) + 1;
  const coL = Object.entries(co).filter(x => x[1] >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const byY = {}; for (const f of films) { const y = relYear(f); byY[y] = (byY[y] || 0) + 1; }
  const ys = Object.keys(byY).map(Number), y0 = ys.length ? Math.min(...ys) : S.year, y1 = ys.length ? Math.max(...ys) : S.year, series = []; for (let y = y0; y <= y1; y++) series.push(byY[y] || 0);
  const aw = (S.awards || []).filter(a => (a.people || []).includes(p.id)), gross = films.reduce((t, f) => t + (f.total || 0), 0);
  const nm = id => P(+id) ? `<a href="#" class="lk" data-go="person:${id}">${esc(P(+id).name)}</a> <button class="tk-chip" data-lg="p:${id}">→</button>` : '?';
  return `<div class="lg-nav"><b class="lg-yr">${esc(p.name)}</b><span class="tk-mut">${esc(ROLE_LABEL[p.role] || p.role)} · ${p.born ? `born ${p.born}` : ''}${p.dead ? ` · died ${p.deathY}` : ''}</span><a href="#" class="lk" data-go="person:${p.id}">full page</a></div>
   <div class="tk-kpis"><div class="tk-kpi"><span>FILMS</span><b class="tk-v">${films.length}</b></div><div class="tk-kpi"><span>CAREER</span><b class="tk-v">${films.length ? `${y0}–${y1}` : '—'}</b></div><div class="tk-kpi"><span>TOTAL GROSS</span><b class="tk-v">${fmtM(gross)}</b></div><div class="tk-kpi"><span>PRIZES</span><b class="tk-v">${aw.length}</b></div></div>
   ${series.length > 1 ? `<section class="tk-p tk-wide"><h4>FILMS BY YEAR <span class="tk-sub">${y0}–${y1}</span></h4>${typeof tSpark === 'function' ? tSpark(series, 520, 40, 'wide') : ''}</section>` : ''}
   <div class="tk-grid"><section class="tk-p"><h4>CAME UP UNDER <span class="tk-sub">directors and producers of their first films</span></h4><ul class="plain small">${Object.entries(under).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => `<li>${nm(id)} <span class="tk-mut">${n} film${n > 1 ? 's' : ''}</span></li>`).join('') || '<li class="tk-mut">Nobody on file.</li>'}</ul></section>
   <section class="tk-p"><h4>CAME UP UNDER THEM <span class="tk-sub">first credit on one of their films</span></h4><ul class="plain small">${proteges.map(q => `<li>${nm(q.id)} <span class="tk-mut">${esc(ROLE_LABEL[q.role] || q.role)} · ${q.credits.length} credits</span></li>`).join('') || '<li class="tk-mut">Nobody yet.</li>'}</ul></section>
   <section class="tk-p"><h4>KEEPS WORKING WITH</h4><ul class="plain small">${coL.map(([id, n]) => `<li>${nm(id)} <span class="tk-mut">${n} films</span></li>`).join('') || '<li class="tk-mut">No regulars.</li>'}</ul></section>
   <section class="tk-p"><h4>BEST-KNOWN FILMS</h4><ul class="plain small">${films.slice().sort((a, b) => b.total - a.total).slice(0, 6).map(f => `<li>${fl(f.id)} <span class="tk-mut">${relYear(f)} · ${fmtM(f.total)}</span></li>`).join('') || '<li class="tk-mut">None yet.</li>'}</ul></section></div>`;
}
function lgFind() {
  const q = (UI.arq || '').toLowerCase().trim(), box = `<div class="lg-nav"><input id="arq" class="lg-q" placeholder="Search every film, person and studio, any era" value="${esc(UI.arq || '')}"></div>`;
  if (q.length < 2) return box + '<p class="tk-foot">Type at least two letters.</p>';
  const F = S.films.filter(f => f.title && f.title.toLowerCase().includes(q)).sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 20);
  const Pp = S.people.filter(p => p.name.toLowerCase().includes(q)).sort((a, b) => (b.credits || []).length - (a.credits || []).length).slice(0, 20);
  const C = S.companies.filter(c => c.name.toLowerCase().includes(q)).slice(0, 12);
  return `${box}<div class="tk-grid"><section class="tk-p"><h4>FILMS <span class="tk-sub">${F.length}</span></h4><ul class="plain small">${F.map(f => `<li>${fl(f.id)} <span class="tk-mut">${relYear(f) || 'in production'}${f.total ? ' · ' + fmtM(f.total) : ''}</span></li>`).join('') || '<li class="tk-mut">None.</li>'}</ul></section>
   <section class="tk-p"><h4>PEOPLE <span class="tk-sub">${Pp.length}</span></h4><ul class="plain small">${Pp.map(p => `<li><a href="#" class="lk" data-go="person:${p.id}">${esc(p.name)}</a> <span class="tk-mut">${esc(ROLE_LABEL[p.role] || p.role)} · ${(p.credits || []).length} credits</span> <button class="tk-chip" data-lg="p:${p.id}">lineage</button></li>`).join('') || '<li class="tk-mut">None.</li>'}</ul></section>
   <section class="tk-p"><h4>STUDIOS <span class="tk-sub">${C.length}</span></h4><ul class="plain small">${C.map(c => `<li><a href="#" class="lk" data-go="company:${c.id}">${esc(c.name)}</a> <span class="tk-mut">${esc(hubName(c.hub))} · ${c.founded || '?'}${c.closed ? '–' + c.closed : ''}</span></li>`).join('') || '<li class="tk-mut">None.</li>'}</ul></section></div>`;
}
function lgClick(t) {
  const d = t.dataset.lg; if (!d) return false; const [k, v] = d.split(':'); const st = UI.lg = UI.lg || { tab: 'year', y: S.year - 1 };
  if (k === 'tab') st.tab = v; else if (k === 'y') { st.y = +v; st.tab = 'year'; } else if (k === 'p') { st.pid = +v; st.tab = 'line'; }
  if (S.me) UI.app = 'legends'; render(true); const m = document.querySelector('.os-main'); if (m) m.scrollTop = 0; return true;
}
// history in the news: a director's first film in years is a return
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); if (!S.me || S.archiving) return out;
  const d = P(f.dir); if (!d || f.tier > 2) return out;
  const prev = (d.credits || []).map(i => S.films[i]).filter(x => x && x !== f && x.dir === d.id && x.rel !== null && x.rel < S.week).sort((a, b) => b.rel - a.rel)[0];
  if (prev && S.week - prev.rel >= 52 * 5) news('Industry', `${d.name} returns with ${f.title}, a first film since ${prev.title} in ${yearOf(prev.rel)}.`, { film: f.id, person: d.id });
  return out; }; }
