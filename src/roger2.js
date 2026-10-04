// ---------------- Roger That, browsable ----------------
// Every list on the aggregator can be searched, filtered and sorted, and the critics get a proper directory: who they
// write for, how much their voice counts, what they love and hate, how generous they are and what they said lately.
// Display-only, like the rest of Roger That.
const RT_TEMPER = {
  warm: 'Generous and open-hearted; looks for what a film gets right.', tough: 'Hard to please; a good review from them means something.',
  acid: 'Sharp-tongued and quotable; pans are a spectator sport.', fusty: 'Old-school and proper; distrusts violence, novelty and noise.',
  auteurist: 'Reviews the director as much as the film; rewards a personal signature.', sharp: 'Precise and fair; weighs craft over hype.',
  urbane: 'Witty, worldly, hard to fool; likes wit and polish.', scholarly: 'Thinks in film history; rewards ambition and seriousness.',
  witty: 'Writes for laughs as much as verdicts; forgives a lot for a good time.', enthusiast: 'A fan first; genre films get a fair shake and then some.',
  guidebook: 'Short, steady star ratings; rarely surprised, rarely cruel.', populist: 'Reviews for the audience in the cheap seats.',
  poetic: 'Writes about feeling and image; drama and war move them.', theorist: 'Reads films as ideas; style is substance.',
  polemic: 'Picks fights for a new kind of cinema; hates the polite and the old.', contrarian: 'Likes what everyone hates, hates what everyone likes.',
  pun: 'Here for the one-liner on the poster.'
};
const RT_WEIGHT = { 1: 1.6, 2: 1.2, 3: .9 };
const RT_TIER = { 1: 'Major outlet', 2: 'Specialist outlet', 3: 'Online / popular' };
// films a critic reviewed, sampled from the archive (newest first)
function criticRecord(c) {
  RTC.S !== S && (RTC = { S, m: {} }); if (RTC.m[c.name]) return RTC.m[c.name];
  const L = [], y0 = c.from, y1 = Math.min(c.to || S.year, S.year);
  for (let i = S.films.length - 1; i >= 0 && L.length < 60; i--) { const f = S.films[i]; if (!f || f.rel === null || f.reviews === undefined || f.rel > S.week) continue; const y = yearOf(f.rel); if (y < y0 || y > y1) continue; const R = filmReviews(f); const v = R && R.list.find(x => x.who === c.name); if (v && v.sc !== null) L.push({ f: f.id, sc: v.sc, q: v.q, cons: R.score }); }
  const avg = L.length ? L.reduce((s, x) => s + x.sc, 0) / L.length : null, off = L.length ? L.reduce((s, x) => s + Math.abs(x.sc - x.cons), 0) / L.length : null;
  return RTC.m[c.name] = { L, avg, off };
}
let RTC = { S: null, m: {} };
function rtFilmRows(L) {
  const g = UI.rtg || '', d = UI.rtd || '', fl0 = UI.rtf || '', q = (UI.rtq || '').toLowerCase().trim(), mn = +UI.rtn || 0;
  let rows = L.map(f => ({ f, R: filmReviews(f) })).filter(x => x.R);
  if (g) rows = rows.filter(x => x.f.genre === g);
  if (d) rows = rows.filter(x => Math.floor(yearOf(x.f.rel) / 10) * 10 === +d);
  if (q) rows = rows.filter(x => x.f.title.toLowerCase().includes(q) || (x.f.real && x.f.real.toLowerCase().includes(q)) || (P(x.f.dir) && P(x.f.dir).name.toLowerCase().includes(q)));
  if (mn) rows = rows.filter(x => x.R.n >= mn);
  if (fl0 === 'approved') rows = rows.filter(x => x.R.thumbs >= 75 && x.R.n >= 20);
  if (fl0 === 'rotten') rows = rows.filter(x => x.R.thumbs < 40);
  if (fl0 === 'divisive') rows = rows.filter(x => Math.abs(x.R.score / 10 - x.R.aud) >= 1.8);
  if (fl0 === 'crowd') rows = rows.filter(x => x.R.aud * 10 - x.R.score >= 15);
  if (fl0 === 'critics') rows = rows.filter(x => x.R.score - x.R.aud * 10 >= 15);
  const k = UI.rts || 'thumbs', dir = UI.rtdir === 'asc' ? 1 : -1;
  const key = { thumbs: x => x.R.thumbs * 1000 + x.R.score, score: x => x.R.score, aud: x => x.R.aud, n: x => x.R.n, gap: x => Math.abs(x.R.score / 10 - x.R.aud), rel: x => x.f.rel, title: x => x.f.title }[k] || (x => x.R.thumbs);
  rows.sort((a, b) => { const A = key(a), B = key(b); return (typeof A === 'string' ? A.localeCompare(B) : A - B) * (k === 'title' ? -dir : dir); });
  return rows;
}
function rtFilmTable(L, max) {
  const rows = rtFilmRows(L), shown = rows.slice(0, (UI.rtmore || 1) * (max || 40));
  const H = (k, l, n, tip) => `<th class="${n ? 'n' : ''}"${tip ? ` title="${esc(tip)}"` : ''}><button class="linkish rt-sort${(UI.rts || 'thumbs') === k ? ' on' : ''}" data-rtsort="${k}">${l}${(UI.rts || 'thumbs') === k ? (UI.rtdir === 'asc' ? ' ▲' : ' ▼') : ''}</button></th>`;
  const badge = R => R.thumbs >= 75 && R.n >= 20 ? '<span class="rt-cert" title="Roger Approved: 75% or more of at least 20 critics liked it">✔ Approved</span>' : R.thumbs < 40 ? '<span class="rt-rot" title="Fewer than 40% of critics liked it">✖ Panned</span>' : '';
  return `<p class="small muted">${rows.length.toLocaleString()} film${rows.length === 1 ? '' : 's'} match.</p><table class="os-table rt-table"><thead><tr>${H('title', 'Film')}${H('rel', 'Released')}<th>Genre</th>${H('thumbs', 'Thumbs', 1, SCORE_HOW.thumbs)}${H('score', 'Rogerscore', 1, SCORE_HOW.roger)}${H('aud', 'Audience', 1, SCORE_HOW.aud)}${H('n', 'Critics', 1)}${H('gap', 'Gap', 1, 'How far the critics and the crowd disagree')}</tr></thead><tbody>${shown.map(({ f, R }) => `<tr><td>${fl(f.id)} ${badge(R)}</td><td class="muted">${yearOf(f.rel)}</td><td>${esc(f.genre)}</td><td class="n ${R.thumbs >= 60 ? 'good' : R.thumbs < 40 ? 'bad' : ''}">${R.thumbs}%</td><td class="n">${R.score}</td><td class="n">${R.aud.toFixed(1)}</td><td class="n muted">${R.n}</td><td class="n muted">${(Math.abs(R.score / 10 - R.aud)).toFixed(1)}</td></tr>`).join('') || '<tr><td colspan="8" class="muted">Nothing matches. Loosen a filter.</td></tr>'}</tbody></table>${rows.length > shown.length ? `<button class="os-btn" data-rtmore="1">Show more (${(rows.length - shown.length).toLocaleString()} left)</button>` : ''}`;
}
function rtFilters(decades) {
  const G = Object.keys(AMB).sort(), D = decades || [];
  return `<div class="os-tools rt-tools"><input id="rtq" type="search" data-uiq="rtq" placeholder="Search a title or director…" value="${esc(UI.rtq || '')}">
   <select data-ui="rtg" data-reset="rtmore" aria-label="Genre"><option value="">Every genre</option>${G.map(g => `<option ${UI.rtg === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
   ${D.length > 1 ? `<select data-ui="rtd" data-reset="rtmore" aria-label="Decade"><option value="">Every decade</option>${D.map(d => `<option value="${d}" ${+UI.rtd === d ? 'selected' : ''}>${d}s</option>`).join('')}</select>` : ''}
   <select data-ui="rtf" data-reset="rtmore" aria-label="Show"><option value="">All verdicts</option>${[['approved', '✔ Roger Approved'], ['rotten', '✖ Panned'], ['divisive', 'Critics vs crowd'], ['crowd', 'Crowd-pleasers critics missed'], ['critics', 'Critics\' darlings crowds skipped']].map(([k, l]) => `<option value="${k}" ${UI.rtf === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
   <select data-ui="rtn" data-reset="rtmore" aria-label="Minimum critics"><option value="0">Any number of critics</option>${[10, 20, 40, 80].map(n => `<option value="${n}" ${+UI.rtn === n ? 'selected' : ''}>${n}+ critics</option>`).join('')}</select>
   <select data-ui="rts" aria-label="Sort">${[['thumbs', 'Sort: Thumbs'], ['score', 'Sort: Rogerscore'], ['aud', 'Sort: Audience'], ['n', 'Sort: most reviewed'], ['gap', 'Sort: most divisive'], ['rel', 'Sort: newest'], ['title', 'Sort: title']].map(([k, l]) => `<option value="${k}" ${(UI.rts || 'thumbs') === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
   ${UI.rtg || UI.rtd || UI.rtf || +UI.rtn || UI.rtq ? '<button class="os-btn" data-rtclear="1">Clear filters</button>' : ''}</div>`;
}
function rtCritics() {
  const y = S.year, st = UI.rtcs || 'active', ty = UI.rtct || '', tm = UI.rtcm || '', q = (UI.rtcq || '').toLowerCase().trim(), so = UI.rtco || 'weight';
  let L = CRITICS.map(c => CRITIC[c[0]]).filter(c => c.from <= y);
  if (st === 'active') L = L.filter(c => c.to === null || c.to >= y); else if (st === 'past') L = L.filter(c => c.to !== null && c.to < y);
  if (ty) L = L.filter(c => String(OUTLET[c.out].tier) === ty);
  if (tm) L = L.filter(c => c.style === tm);
  if (q) L = L.filter(c => c.name.toLowerCase().includes(q) || OUTLET[c.out].name.toLowerCase().includes(q));
  const rec = c => criticRecord(c);
  const sorter = { weight: (a, b) => OUTLET[a.out].tier - OUTLET[b.out].tier || a.name.localeCompare(b.name), name: (a, b) => a.name.localeCompare(b.name), kind: (a, b) => (rec(b).avg ?? 0) - (rec(a).avg ?? 0), harsh: (a, b) => (rec(a).avg ?? 99) - (rec(b).avg ?? 99), maverick: (a, b) => (rec(b).off ?? 0) - (rec(a).off ?? 0), long: (a, b) => ((b.to || y) - b.from) - ((a.to || y) - a.from) }[so];
  L.sort(sorter);
  const styles = [...new Set(CRITICS.map(c => c[4]))].sort();
  const card = c => { const O = OUTLET[c.out], R = rec(c), loves = Object.entries(c.taste).filter(e => e[1] > 0).sort((a, b) => b[1] - a[1]).map(e => e[0]), hates = Object.entries(c.taste).filter(e => e[1] < 0).sort((a, b) => a[1] - b[1]).map(e => e[0]), last = R.L.slice(0, 3);
    return `<article class="rt-critic"><header><span class="rt-ini">${esc(c.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span><div><b>${esc(c.name)}</b><span class="muted small">${esc(O.name)} · ${esc(O.kind)} · ${c.from}–${c.to && c.to < y ? c.to : 'now'}</span></div><span class="rt-w" title="How much one review from this outlet counts in the Rogerscore">×${RT_WEIGHT[O.tier]}</span></header>
     <p class="small"><b>${esc(c.style[0].toUpperCase() + c.style.slice(1))}.</b> <span class="muted">${esc(RT_TEMPER[c.style] || '')}</span></p>
     <div class="rt-cstats"><div><b>${R.avg === null ? '–' : Math.round(R.avg)}</b><span>average score</span></div><div><b>${R.off === null ? '–' : Math.round(R.off)}</b><span>points from consensus</span></div><div><b>${R.L.length}${R.L.length >= 60 ? '+' : ''}</b><span>reviews on file</span></div><div><b>${esc(RT_TIER[O.tier])}</b><span>counts in Rogerscore</span></div></div>
     ${loves.length || hates.length ? `<p class="small">${loves.length ? `<span class="good">♥ ${loves.map(esc).join(', ')}</span>` : ''}${loves.length && hates.length ? ' · ' : ''}${hates.length ? `<span class="bad">✖ ${hates.map(esc).join(', ')}</span>` : ''}</p>` : '<p class="small muted">No favourite genre: takes each film as it comes.</p>'}
     ${last.length ? `<ul class="rt-list mini">${last.map(v => `<li><span class="rt-s ${v.sc >= 60 ? 'good' : v.sc < 40 ? 'bad' : ''}">${v.sc}</span><div>${fl(v.f)} <q>${esc(v.q)}</q></div></li>`).join('')}</ul>` : ''}</article>`; };
  return `<div class="rt-explain"><p><b>Who counts.</b> Every review counts toward <b>Thumbs</b> (the share that liked it). Only the named critics below make the <b>Rogerscore</b>, and a review counts more from a bigger outlet: major papers, magazines and broadcasters ×1.6, specialist outlets ×1.2, online and popular outlets ×0.9. Famous takes on the classics count double. <b>Audience</b> is ticket buyers alone.</p></div>
   <div class="os-tools rt-tools"><input id="rtcq" type="search" data-uiq="rtcq" placeholder="Search a critic or outlet…" value="${esc(UI.rtcq || '')}">
    <select data-ui="rtcs"><option value="active" ${st === 'active' ? 'selected' : ''}>Writing now</option><option value="past" ${st === 'past' ? 'selected' : ''}>Retired</option><option value="all" ${st === 'all' ? 'selected' : ''}>Everyone</option></select>
    <select data-ui="rtct"><option value="">Every kind of outlet</option>${[1, 2, 3].map(t => `<option value="${t}" ${ty === String(t) ? 'selected' : ''}>${RT_TIER[t]} (×${RT_WEIGHT[t]})</option>`).join('')}</select>
    <select data-ui="rtcm"><option value="">Every temperament</option>${styles.map(s => `<option ${tm === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
    <select data-ui="rtco">${[['weight', 'Sort: most influential'], ['name', 'Sort: name'], ['kind', 'Sort: most generous'], ['harsh', 'Sort: harshest'], ['maverick', 'Sort: furthest from consensus'], ['long', 'Sort: longest career']].map(([k, l]) => `<option value="${k}" ${so === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
   <p class="small muted">${L.length} critic${L.length === 1 ? '' : 's'}.</p><div class="rt-critics">${L.map(card).join('') || '<div class="os-empty"><span>🧐</span><b>No critics match</b></div>'}</div>`;
}
function rtOutlets() {
  const y = S.year, L = OUTLETS.map(o => OUTLET[o[0]]).filter(o => o.from <= y).sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  return `<table class="os-table"><thead><tr><th>Outlet</th><th>Kind</th><th>Since</th><th class="n">Weight</th><th>Critics</th></tr></thead><tbody>${L.map(o => `<tr><td><b>${esc(o.name)}</b>${o.to && o.to < y ? ' <span class="muted small">(closed ' + o.to + ')</span>' : ''}</td><td class="muted">${esc(o.kind)}</td><td class="muted">${o.from}</td><td class="n">×${RT_WEIGHT[o.tier]}</td><td class="small">${CRITICS.filter(c => c[1] === o.k && c[2] <= y).map(c => esc(c[0])).join(', ') || '<span class="muted">staff reviewers</span>'}</td></tr>`).join('')}</tbody></table>`;
}
function rogerApp() {
  const t = UI.rt || 'now', y = S.year;
  const tabs = [['now', 'Now showing'], ['year', 'Best of ' + y], ['all', 'Every film'], ['critics', 'Critics'], ['outlets', 'Outlets'], ['mine', 'Your reviews']];
  const rel = S.films.filter(f => f.rel !== null && f.reviews !== undefined && f.rel <= S.week);
  let body = '';
  if (t === 'now') body = rtFilters() + rtFilmTable(rel.filter(f => S.week - f.rel < 12), 40);
  else if (t === 'year') body = rtFilters() + rtFilmTable(rel.filter(f => yearOf(f.rel) === y), 40);
  else if (t === 'all') { const D = [...new Set(rel.map(f => Math.floor(yearOf(f.rel) / 10) * 10))].sort((a, b) => b - a); body = rtFilters(D) + rtFilmTable(rel, 50); }
  else if (t === 'critics') body = rtCritics();
  else if (t === 'outlets') body = rtOutlets();
  else body = myReviewsHTML();
  return `<div class="rtapp"><div class="rt-brand"><b>Roger That</b><span>${rel.length.toLocaleString()} films · three ways to read the reviews</span></div>
   <div class="rt-how"><div><b>👍 Thumbs</b><span>${esc(SCORE_HOW.thumbs)}</span></div><div><b>🎯 Rogerscore</b><span>${esc(SCORE_HOW.roger)}</span></div><div><b>🍿 Audience</b><span>${esc(SCORE_HOW.aud)}</span></div></div>
   <div class="np-tabs">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-rt="${k}">${l}</button>`).join('')}</div>${body}</div>`;
}
function roger2Click(t) {
  if (t.dataset.rtsort) { const k = t.dataset.rtsort; if ((UI.rts || 'thumbs') === k) UI.rtdir = UI.rtdir === 'asc' ? 'desc' : 'asc'; else { UI.rts = k; UI.rtdir = k === 'title' ? 'asc' : 'desc'; } render(true); return true; }
  if (t.dataset.rtmore) { UI.rtmore = (UI.rtmore || 1) + 1; render(true); return true; }
  if (t.dataset.rtclear) { for (const k of ['rtg', 'rtd', 'rtf', 'rtn', 'rtq', 'rtmore']) UI[k] = ''; render(true); return true; }
  if (t.dataset.rt) UI.rtmore = 1;
  return false;
}
