// ---------------- REEL, all of it ----------------
// The encyclopedia covered films and people. Everything else made in this world is a credit too: every television
// series, every record, every online channel's videos, every podcast season and every play, each with a page and
// the people who made it. Your own releases sit among them. Each category has a search, a city filter, sorting and
// pages of fifty.
const REEL_CATS = [['films', 'Films'], ['people', 'People'], ['reel_tv', 'Television'], ['reel_music', 'Music'], ['reel_creator', 'Online video'], ['reel_podcast', 'Podcasts'], ['reel_stage', 'Theatre']];
function geaHead(cur) { return `<div class="geahead"><span class="gealogo">REEL</span><span class="muted">The Recorded Entertainment Encyclopedia &amp; Library</span><span class="reelseg">${REEL_CATS.map(([k, l]) => `<button class="pill${cur === k ? ' on' : ''}" data-gea="${k}">${l}</button>`).join('')}</span></div>`; }
const REEL_FIELD = { reel_music: 'music', reel_creator: 'creator', reel_podcast: 'podcast', reel_stage: 'stage' };
const REEL_UNIT = { music: 'Release', creator: 'Video', podcast: 'Season', stage: 'Production' };
let REEL_CACHE = { k: null, rows: null };
// every work by every figure in every city, newest first; cached for the week
function reelRows(field) {
  const key = field + ':' + S.week + ':' + ((S.me && S.me.works) || []).length;
  if (REEL_CACHE.k === key) return REEL_CACHE.rows;
  const rows = [], seen = new Set();
  for (const h of HUB_IDS) for (const x0 of mediaFigures(h)) {
    if (x0.field !== field || x0.from > S.year || seen.has(x0.name)) continue; seen.add(x0.name);
    const x = Object.assign({ hub: h }, x0); x.fid = figId(x) || (h + '~' + mediaFigures(h).indexOf(x0));
    for (const s of figReleases(x)) rows.push({ t: songTitle(x, s), w: s * 6, x, slot: s, hub: x.hub });
  }
  for (const w of ((S.me && S.me.works) || []).filter(w => (WORK_TYPES[w.type] || {}).field === field)) rows.push({ t: w.title, w: w.rel, mine: w, hub: S.me.hub });
  rows.sort((a, b) => b.w - a.w);
  REEL_CACHE = { k: key, rows };
  return rows;
}
function reelView(tab) {
  if (tab === 'reel_tv') return () => reelTvHTML();
  if (REEL_FIELD[tab]) return () => reelFieldHTML(tab);
  return null;
}
function reelFilters(n, hubs) {
  const pg = UI.rlpg || 0, last = Math.max(0, Math.ceil(n / 50) - 1);
  return `<div class="filt"><label class="filt-q"><span>Search</span><input id="rlq" type="search" placeholder="A title or a name…" value="${esc(UI.rlq || '')}"></label><label><span>City</span>${sel('rl-hub', [['ALL', 'Everywhere'], ...hubs.map(h => [h, hubName(h)])], UI.rlhub || 'ALL')}</label><label><span>Sort</span>${sel('rl-sort', [['new', 'Newest'], ['old', 'Oldest'], ['title', 'Title A–Z']], UI.rlsort || 'new')}</label></div>
   <p class="muted small">${n.toLocaleString()} found. <button class="btn-s ghost" data-rlpg="${pg - 1}" ${pg ? '' : 'disabled'}>‹</button> page ${Math.min(pg, last) + 1} of ${last + 1} <button class="btn-s ghost" data-rlpg="${pg + 1}" ${pg < last ? '' : 'disabled'}>›</button></p>`;
}
function reelSlice(L) {
  const s = UI.rlsort || 'new';
  if (s === 'old') L = L.slice().reverse(); else if (s === 'title') L = L.slice().sort((a, b) => a.t.localeCompare(b.t));
  const pg = Math.min(UI.rlpg || 0, Math.max(0, Math.ceil(L.length / 50) - 1));
  return L.slice(pg * 50, pg * 50 + 50);
}
function reelFieldHTML(tab) {
  const f = REEL_FIELD[tab], q = (UI.rlq || '').toLowerCase().trim(), hub = UI.rlhub || 'ALL', all = reelRows(f);
  const L = all.filter(r => (hub === 'ALL' || r.hub === hub) && (!q || r.t.toLowerCase().includes(q) || (r.x ? r.x.name : ME().name).toLowerCase().includes(q)));
  const hubs = [...new Set(all.map(r => r.hub))];
  const figs = new Set(all.filter(r => r.x).map(r => r.x.name)).size;
  const rowH = r => r.mine ? `<tr class="mine"><td><a href="#" class="lk" data-go="work:${r.mine.id}">${esc(r.t)}</a></td><td>${pl(ME().id)} <span class="chip good">You</span></td><td class="small">${esc(hubName(r.hub))}</td><td class="small">${fmtDate(r.w, true)}</td><td class="n">${Math.round(r.mine.units || 0).toLocaleString()}</td></tr>`
    : `<tr><td>${songLink(r.x, r.slot)}</td><td>${figLink(r.x)}${r.x.legend ? ' <span class="aw">✦</span>' : ''}</td><td class="small">${esc(hubName(r.hub))}</td><td class="small">${fmtDate(r.w, true)}</td><td class="n muted small">${esc(KIND_LABEL[r.x.kind] || '')}</td></tr>`;
  return geaHead(tab) + `<div class="head"><h2>${esc(FIELD_LABEL[f])}</h2><p class="lede">${all.length.toLocaleString()} ${esc(REEL_UNIT[f].toLowerCase())}s by ${figs} ${f === 'podcast' ? 'shows' : f === 'stage' ? 'writers and composers' : 'artists'} in ${hubs.length} cities. Every title has a page, with its credits.</p></div>
   <section class="panel">${reelFilters(L.length, hubs)}<div class="tw"><table class="grid small"><thead><tr><th>${REEL_UNIT[f]}</th><th>By</th><th>City</th><th>Released</th><th class="n">${f === 'music' ? '' : ''}</th></tr></thead><tbody>${reelSlice(L).map(rowH).join('') || '<tr><td colspan="5" class="empty">Nothing matches.</td></tr>'}</tbody></table></div></section>`;
}
function reelTvHTML() {
  const q = (UI.rlq || '').toLowerCase().trim(), hub = UI.rlhub || 'ALL', all = tvAllPlus().map(s => ({ s, t: s.title, w: s.y * 52, hub: TV_NETS[s.net].hub }));
  all.sort((a, b) => b.s.y - a.s.y || (b.s.legend ? 1 : 0) - (a.s.legend ? 1 : 0));
  const L = all.filter(r => (hub === 'ALL' || r.hub === hub) && (!q || r.t.toLowerCase().includes(q) || TV_NETS[r.s.net].name.toLowerCase().includes(q)));
  const hubs = [...new Set(all.map(r => r.hub))];
  const row = ({ s }) => { const P1 = tvPeople(s); return `<tr${s.mine ? ' class="mine"' : ''}><td>${tvLink(s)}${s.legend ? ' <span class="aw">✦</span>' : ''}${s.mine ? ' <span class="chip good">Yours</span>' : ''}</td><td class="small">${netLink(s.net)}</td><td class="small">${s.y}–${tvStatus(s) === 'on air' ? 'now' : Math.min(S.year, s.y + s.seasons - 1)}</td><td class="n">${s.seasons}</td><td class="small">${esc(TV_GENRES[s.g].label)}</td><td class="small">${s.legend ? esc(s.creatorName || '') : P1.creator !== null && P1.creator !== undefined ? pl(P1.creator) : ''}</td></tr>`; };
  return geaHead('reel_tv') + `<div class="head"><h2>Television</h2><p class="lede">${all.length.toLocaleString()} series on ${Object.keys(TV_NETS).length} channels since the 1940s, from the landmarks to the ones cancelled after six episodes. Each has its seasons, ratings and cast.</p></div>
   <section class="panel">${reelFilters(L.length, hubs)}<div class="tw"><table class="grid small"><thead><tr><th>Series</th><th>Channel</th><th>Years</th><th class="n">Seasons</th><th>Kind</th><th>Created by</th></tr></thead><tbody>${reelSlice(L).map(row).join('') || '<tr><td colspan="6" class="empty">Nothing matches.</td></tr>'}</tbody></table></div></section>`;
}
function reelClick(t) { if (t.dataset.rlpg !== undefined) { UI.rlpg = Math.max(0, +t.dataset.rlpg); render(true); return true; } return false; }
function reelChange(e) { const id = e.target.id; if (id === 'rl-hub' || id === 'rl-sort') { UI[id === 'rl-hub' ? 'rlhub' : 'rlsort'] = e.target.value; UI.rlpg = 0; render(true); return true; } return false; }
// your own works as credits on your profile: everything you've released, beside the films
function worksCreditsHTML(p) {
  if (!p.player || !S.me) return '';
  const W = (S.me.works || []).slice().sort((a, b) => b.rel - a.rel); if (!W.length) return '';
  return `<h3>Music, video, podcasts and stage</h3><div class="tw"><table class="grid"><thead><tr><th>Released</th><th>Title</th><th>Kind</th><th class="n">Audience</th><th class="n">Quality</th></tr></thead><tbody>${W.map(w => `<tr><td>${fmtDate(w.rel, true)}</td><td><a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a></td><td>${esc((WORK_TYPES[w.type] || {}).label || w.type)}</td><td class="n">${Math.round(w.units || 0).toLocaleString()}</td><td class="n">${Math.round(w.q)}</td></tr>`).join('')}</tbody></table></div>`;
}
