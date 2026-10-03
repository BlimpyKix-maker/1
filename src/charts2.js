// ---------------- The charts, all the way down ----------------
// Every chart opens into a full page: the whole chart for any week back to when the form began, year-end charts,
// every number one, the artists (all of them, searchable), the labels and theatres ranked by what their rosters
// sell, and the people who do the work: session players, engineers, touring crews, stagehands, editors and
// producers, in numbers sized from the real workforce, each one with a page. Artists rise over their first few
// years and fade near the end, so old charts look like old charts.

// ---- more artists: a long tail in every city, including acts who have since retired ----
const HUB_W = h => ({ hollywood: 1, newyork: .9, london: .8, tokyo: .7, seoul: .5, mumbai: .5, paris: .45 })[h] || (HUBS[h] && HUBS[h].minor ? .12 : .35);
const FIG_KINDS = { music: ['singer', 'singer', 'band', 'band', 'rapper', 'dj', 'duo', 'choir'], creator: ['creator', 'creator', 'blipper', 'streamer'], podcast: ['show'], stage: ['playwright', 'playwright', 'composer', 'troupe'] };
const FIG_START = { music: 1950, creator: 2006, podcast: 2005, stage: 1940 };
function moreFigures(hub, have) {
  const taken = new Set((have || []).map(x => x.name)), H = HUBS[hub], N = NAMES[H.lang] || NAMES.en, r = hashRand(HUB_IDS.indexOf(hub) * 104729 + S.seed * 7 + 17), pick = L => L[Math.floor(r() * L.length)], out = [];
  const n = Math.round(30 + 90 * HUB_W(hub));
  for (let i = 0; i < n; i++) {
    const x = r(), field = x < .46 ? 'music' : x < .64 ? 'stage' : x < .86 ? 'creator' : 'podcast', kind = pick(FIG_KINDS[field]);
    const from = Math.max(FIG_START[field], S.year - Math.floor(Math.pow(r(), 1.4) * 60));
    if (from > S.year) continue;
    const to = from < S.year - 8 && r() < .45 ? Math.min(S.year - 1, from + 4 + Math.floor(r() * 24)) : undefined;
    const person = `${pick(N.F.concat(N.M))} ${pick(N.L)}`;
    const name = kind === 'band' ? `${pick(BAND_A)} ${pick(BAND_B)}` : kind === 'duo' ? `${pick(N.L)} & ${pick(N.L)}` : kind === 'choir' ? `The ${pick(N.L)} Singers` : kind === 'troupe' ? `The ${pick(BAND_B)} Company` : kind === 'dj' ? `DJ ${pick(N.L)}` : kind === 'show' ? `${pick(SHOW_A)} ${pick(SHOW_B)}` : person;
    if (taken.has(name)) continue; taken.add(name);
    out.push({ name, field, kind, hub, fans: Math.round(Math.pow(10, 2.6 + r() * 3.9)), from, to, tail: 1 });
  }
  return out;
}
Object.assign(KIND_LABEL, { duo: 'Duo', choir: 'Vocal group', streamer: 'Streamer', troupe: 'Theatre company' });
// How big an act is in a given year: they climb for their first five years and fade in their last few.
function figPull(x, y) { let g = clamp((y - x.from + 1) / 5, .15, 1); if (x.to) g *= clamp((x.to - y + 2) / 5, .25, 1); return g; }
// The chart for any week. Same formula as the weekly charts, so this week's matches the desk.
function chartAt(field, hub, w, n = 100) {
  const y = yearOf(w), all = mediaFigures(hub), M = S.me;
  const L = all.filter(x => x.field === field && x.from <= y && (!x.to || x.to >= y)).map(x => { const r = hashRand((x.name.length * 131 + w) * 7 + x.fans % 97)(); return { name: x.name, by: x.kind, score: x.fans * figPull(x, y) * (.4 + r), title: workTitleFor(x, w), fid: `${hub}~${all.indexOf(x)}`, slot: Math.floor(w / 6) }; });
  const plat = { music: 'spinly', creator: 'vidwire', podcast: 'podhaus' }[field];
  if (M && plat && hub === M.hub) for (const wk of (M.works || []).filter(x => WORK_TYPES[x.type].field === field && x.wk && x.wk.length && w >= x.rel && w - x.rel < 8)) { const v = wk.wk[Math.min(wk.wk.length - 1, w - wk.rel)] || 0; if (v) L.push({ name: ME().name, by: 'you', score: v * 8, title: wk.title, mine: 1, wid: wk.id }); }
  return L.sort((a, b) => b.score - a.score).slice(0, n);
}
const CHART_NAME = { music: () => `${platName('spinly')} Hot 100`, creator: () => `${platName('vidwire')} Trending`, podcast: () => `${platName('podhaus')} Top Shows`, stage: () => 'Stage Grosses' };
// Year-end: points over every week (100 for a number one, down to 1).
function chartYear(field, hub, y) {
  const A = archive(), k = `chy:${field}:${hub}:${y}`; if (A[k]) return A[k];
  const pts = {}, w0 = weekOfYear(y), w1 = Math.min(weekOfYear(y + 1), S.week + 1);
  for (let w = w0; w < w1; w++) chartAt(field, hub, w, 40).forEach((c, i) => { const id = c.fid || 'me'; (pts[id] = pts[id] || { c, p: 0, wks: 0, peak: 99 }).p += 40 - i; pts[id].wks++; pts[id].peak = Math.min(pts[id].peak, i + 1); });
  return A[k] = Object.values(pts).sort((a, b) => b.p - a.p);
}
function numberOnes(field, hub, y) {
  const A = archive(), k = `ch1:${field}:${hub}:${y}`; if (A[k]) return A[k];
  const out = [], w0 = weekOfYear(y), w1 = Math.min(weekOfYear(y + 1), S.week + 1);
  for (let w = w0; w < w1; w++) { const c = chartAt(field, hub, w, 1)[0]; if (!c) continue; const last = out[out.length - 1]; if (last && last.c.name === c.name && last.c.title === c.title) last.n++; else out.push({ w, c, n: 1 }); }
  return A[k] = out;
}
const chLink = (field, c) => c.mine ? `<a href="#" class="lk" data-go="work:${c.wid}">${esc(c.title)}</a>` : `<a href="#" class="lk" data-go="${field === 'podcast' ? 'fig:' + c.fid : 'song:' + c.fid + '~' + c.slot}">${esc(field === 'podcast' ? c.name : c.title)}</a>`;
const chBy = (field, c) => field === 'podcast' ? (c.mine ? 'your show' : esc(KIND_LABEL[c.by] || 'podcast')) : c.mine ? `${esc(c.name)} (you)` : `<a href="#" class="lk" data-go="fig:${c.fid}">${esc(c.name)}</a>`;
function chartPage(id) {
  const [field, hub0] = String(id).split('~');
  if (!UI.ch || UI.ch.id !== id) UI.ch = { id, field, hub: HUBS[hub0] ? hub0 : (S.me ? S.me.hub : 'hollywood'), tab: 'week', y: S.year, w: S.week };
  const st = UI.ch, hub = st.hub, tab = st.tab, y0 = Math.max(FIG_START[field] || 1950, S.year - 70), years = []; for (let y = S.year; y >= y0; y--) years.push(y);
  const tabs = [['week', 'The chart'], ['year', 'Year-end'], ['ones', 'Number ones'], ['artists', 'Every artist'], ['labels', field === 'stage' ? 'Theatres' : field === 'music' ? 'Labels' : 'Networks'], ['people', 'Who works in it']];
  const hubs = HUB_IDS.filter(h => mediaFigures(h).some(x => x.field === field));
  const head = `<div class="head"><p class="eyebrow">Charts · ${esc(FIELD_LABEL[field] || field)} · ${esc(hubName(hub))}</p><h2>${esc(CHART_NAME[field] ? CHART_NAME[field]() : field)}</h2><p class="lede">Every week back to ${y0}. Click a title for its page, an artist for their career.</p></div>
   <p class="bf-row">${tabs.map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-cht="${k}">${l}</button>`).join('')}</p>
   <div class="filt"><label><span>City</span>${sel('ch-hub', hubs.map(h => [h, hubName(h)]), hub)}</label>${['week', 'year', 'ones'].includes(tab) ? `<label><span>Year</span>${sel('ch-y', years.map(y => [y, String(y)]), st.y)}</label>` : ''}${tab === 'week' ? `<label><span>Week</span>${sel('ch-w', chartWeeks(st.y).map(w => [w, fmtDate(w, true)]), st.w)}</label>` : ''}${tab === 'artists' ? `<label class="filt-q"><span>Search</span><input id="chq" type="search" placeholder="Artist or act…" value="${esc(UI.chq || '')}"></label>` : ''}</div>`;
  let body = '';
  if (tab === 'week') {
    const C = chartAt(field, hub, st.w, 100), prev = chartAt(field, hub, st.w - 1, 100), pos = c => prev.findIndex(p => p.name === c.name && p.title === c.title);
    const row = (c, i) => { const p = pos(c), mv = p < 0 ? '<span class="good small">new</span>' : p > i ? `<span class="good small">▲${p - i}</span>` : p < i ? `<span class="bad small">▼${i - p}</span>` : '<span class="muted small">–</span>'; return `<tr${c.mine ? ' class="mine"' : ''}><td>${i + 1}</td><td>${mv}</td><td><b>${chLink(field, c)}</b></td><td>${chBy(field, c)}</td><td class="small muted">${p >= 0 ? '#' + (p + 1) : ''}</td></tr>`; };
    body = `<div class="tw"><table class="grid small"><thead><tr><th>#</th><th></th><th>${field === 'podcast' ? 'Show' : 'Title'}</th><th>${field === 'podcast' ? 'Kind' : 'By'}</th><th>Last week</th></tr></thead><tbody>${C.slice(0, 40).map(row).join('')}</tbody></table></div>${C.length > 40 ? `<details class="rmore"><summary>Positions 41–${C.length}</summary><table class="grid small"><tbody>${C.slice(40).map((c, i) => row(c, i + 40)).join('')}</tbody></table></details>` : ''}`;
  } else if (tab === 'year') {
    const L = chartYear(field, hub, st.y);
    body = `<p class="muted small">Points from every week of ${st.y}${st.y === S.year ? ' so far' : ''}: 40 for a number one, down to 1 for fortieth.</p><div class="tw"><table class="grid small"><thead><tr><th>#</th><th>Title</th><th>By</th><th>Peak</th><th>Weeks</th></tr></thead><tbody>${L.slice(0, 60).map((x, i) => `<tr><td>${i + 1}</td><td><b>${chLink(field, x.c)}</b></td><td>${chBy(field, x.c)}</td><td>${x.peak}</td><td>${x.wks}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">Nothing charted.</td></tr>'}</tbody></table></div>`;
  } else if (tab === 'ones') {
    const L = numberOnes(field, hub, st.y);
    body = `<p class="muted small">Every number one of ${st.y}, in order, with how many weeks it held the top.</p><ol class="plain small">${L.map(x => `<li><time>${fmtDate(x.w, true)}</time> <b>${chLink(field, x.c)}</b> · ${chBy(field, x.c)} <span class="muted">${x.n} week${x.n > 1 ? 's' : ''}</span></li>`).join('') || '<li class="muted">Nothing charted.</li>'}</ol>`;
  } else if (tab === 'artists') {
    const q = (UI.chq || '').toLowerCase().trim(), all = HUB_IDS.flatMap(h => mediaFigures(h).map((x, i) => ({ x, fid: `${h}~${i}` }))).filter(o => o.x.field === field && o.x.from <= S.year && (!q || o.x.name.toLowerCase().includes(q)));
    const seen = new Set(), L = all.filter(o => !seen.has(o.x.name) && seen.add(o.x.name)).sort((a, b) => (a.x.hub === hub ? 0 : 1) - (b.x.hub === hub ? 0 : 1) || b.x.fans - a.x.fans);
    const pg = clamp(st.pg || 0, 0, Math.max(0, Math.ceil(L.length / 60) - 1));
    body = `<p class="muted small">${L.length.toLocaleString()} acts${q ? ' matching' : ''}, ${esc(hubName(hub))} first. <button class="btn-s ghost" data-chpg="${pg - 1}" ${pg ? '' : 'disabled'}>‹</button> page ${pg + 1} <button class="btn-s ghost" data-chpg="${pg + 1}" ${(pg + 1) * 60 < L.length ? '' : 'disabled'}>›</button></p><div class="tw"><table class="grid small"><thead><tr><th>Act</th><th>Kind</th><th>City</th><th>Active</th><th>Fans</th></tr></thead><tbody>${L.slice(pg * 60, pg * 60 + 60).map(o => `<tr><td><a href="#" class="lk" data-go="fig:${o.fid}">${esc(o.x.name)}</a>${o.x.legend ? ' <span class="chip t-Award">legend</span>' : ''}</td><td>${esc(KIND_LABEL[o.x.kind] || o.x.kind)}</td><td>${esc(hubName(o.x.hub))}</td><td>${o.x.from}–${o.x.to || 'now'}</td><td>${Math.round(o.x.fans).toLocaleString()}</td></tr>`).join('')}</tbody></table></div>`;
  } else if (tab === 'labels') {
    const t = FIELD_CO[field], rows = MEDIA_COS.map((c, i) => [c, i]).filter(([c]) => c.type === t && c.f <= S.year).map(([c, i]) => { let fans = 0, acts = 0; for (const h of HUB_IDS) for (const x of activeFigures(h, field)) { const L = figLabel(x); if (L && L[1] === i) { fans += x.fans; acts++; } } return { c, i, fans, acts, staff: headcount(coRef('m' + i)) }; }).sort((a, b) => b.fans - a.fans), tot = rows.reduce((s, r) => s + r.fans, 0) || 1;
    body = `<div class="tw"><table class="grid small"><thead><tr><th>#</th><th>Company</th><th>Based in</th><th>Acts</th><th>Share of fans</th><th>Staff</th></tr></thead><tbody>${rows.map((r, k) => `<tr><td>${k + 1}</td><td><b>${mcoLink(r.i)}</b></td><td>${esc(hubName(r.c.hub))}</td><td>${r.acts}</td><td>${(r.fans / tot * 100).toFixed(1)}%</td><td><a href="#" class="lk" data-go="staff:m${r.i}">${r.staff.toLocaleString()}</a></td></tr>`).join('')}</tbody></table></div>`;
  } else body = fieldWorkHTML(field, hub);
  return head + `<section class="panel">${body}</section>`;
}
function chartWeeks(y) { const out = [], w0 = weekOfYear(y), w1 = Math.min(weekOfYear(y + 1) - 1, S.week); for (let w = w1; w >= w0; w--) out.push(w); return out; }

// ---- who does the work: freelance workforces, sized from the real numbers ----
const FREE_DEPTS = {
  music: [['Session musicians', .2, ['Session guitarist', 'Session drummer', 'Session bassist', 'Session keyboardist', 'String player', 'Horn player', 'Backing vocalist', 'Percussionist']], ['Songwriters and topliners', .16, ['Songwriter', 'Topliner', 'Lyricist', 'Staff writer']], ['Producers and beatmakers', .1, ['Record producer', 'Beatmaker', 'Co-producer', 'Vocal producer']], ['Engineers', .09, ['Recording engineer', 'Mix engineer', 'Mastering engineer', 'Assistant engineer']], ['Touring crew', .14, ['Tour manager', 'Front-of-house engineer', 'Monitor engineer', 'Guitar tech', 'Lighting director', 'Backline tech', 'Merch manager', 'Rigger']], ['Managers and agents', .06, ['Artist manager', 'Booking agent', 'Business manager', 'Road manager']], ['Teachers and church musicians', .17, ['Piano teacher', 'Guitar teacher', 'Voice coach', 'Choir director', 'Church organist']], ['Wedding and function bands', .08, ['Function band singer', 'Wedding DJ', 'Cocktail pianist', 'Cover-band guitarist']]],
  creator: [['Video editors', .28, ['Video editor', 'Short-form editor', 'Assistant editor']], ['Camera and lighting', .14, ['Camera operator', 'Videographer', 'Gaffer for hire']], ['Writers and researchers', .14, ['Scriptwriter', 'Researcher', 'Ideas producer']], ['Thumbnail and motion design', .16, ['Thumbnail designer', 'Motion designer', 'Animator']], ['Talent and brand managers', .1, ['Talent manager', 'Brand-deal manager', 'Agent']], ['Community and channel ops', .18, ['Community manager', 'Channel strategist', 'Moderator', 'Analytics lead']]],
  podcast: [['Producers', .3, ['Podcast producer', 'Senior producer', 'Associate producer']], ['Audio editors and mixers', .28, ['Audio editor', 'Sound designer', 'Mix engineer']], ['Researchers and fact-checkers', .16, ['Researcher', 'Fact-checker', 'Archive producer']], ['Hosts for hire', .1, ['Host', 'Co-host', 'Narrator']], ['Voice and ad-read talent', .16, ['Voice artist', 'Ad-read voice', 'Promo voice']]],
  stage: [['Stage actors', .28, ['Stage actor', 'Understudy', 'Swing', 'Ensemble member']], ['Stagehands and crew', .24, ['Carpenter', 'Fly operator', 'Deck electrician', 'Props master', 'Follow-spot operator', 'Automation operator']], ['Stage managers', .07, ['Production stage manager', 'Stage manager', 'Assistant stage manager']], ['Wardrobe, wigs and dressers', .11, ['Dresser', 'Wig master', 'Wardrobe supervisor', 'Stitcher']], ['Pit musicians', .1, ['Pit pianist', 'Musical director', 'Reed player', 'Pit drummer']], ['Dancers', .1, ['Dancer', 'Dance captain', 'Swing dancer']], ['Designers', .06, ['Set designer', 'Lighting designer', 'Sound designer', 'Costume designer']], ['Front of house', .04, ['House manager', 'Usher', 'Box-office clerk']]]
};
const FREE_BASE = { music: 52000, creator: 18000, podcast: 4200, stage: 26000 };
for (const f in FREE_DEPTS) DEPTS['free_' + f] = FREE_DEPTS[f].map(([d, s]) => [d, s]);
function freeHeadcount(field, hub) { return Math.round(FREE_BASE[field] * HUB_W(hub) * (field === 'stage' && hub === 'newyork' ? 1.8 : field === 'stage' && hub === 'london' ? 1.4 : 1) * (field === 'creator' && S.year < 2008 ? .1 : field === 'podcast' && S.year < 2006 ? .1 : 1)); }
// Real-world reference: roughly how many Americans do these jobs (labour statistics and industry counts, rounded).
const REAL_WORK = {
  music: [['Musicians and singers', 172000], ['Music directors and composers', 60000], ['Sound engineering technicians', 17000], ['Music teachers (private and school)', 190000], ['Agents and managers of artists', 26000], ['Touring and live-event crew (approx.)', 90000]],
  creator: [['Full-time online creators (approx.)', 50000], ['Film and video editors', 36000], ['Camera operators', 26000], ['Graphic and motion designers', 270000], ['Social media and community managers (approx.)', 100000]],
  podcast: [['Podcast producers and editors (approx.)', 15000], ['Announcers and voice talent', 35000], ['Broadcast and sound technicians', 146000]],
  stage: [['Actors (stage and screen)', 66000], ['Dancers and choreographers', 18000], ['Stage crew (union members, approx.)', 75000], ['Broadway jobs supported, incl. indirect (approx.)', 97000], ['Set and exhibit designers', 12000]]
};
function freeRef(field, hub) { return coRef('x' + field + '|' + hub); }
function fieldWorkHTML(field, hub) {
  const R = freeRef(field, hub), O = orgChart(R), t = FIELD_CO[field];
  const cos = MEDIA_COS.map((c, i) => [c, i]).filter(([c]) => c.type === t && c.f <= S.year), staff = cos.reduce((s, [, i]) => s + headcount(coRef('m' + i)), 0);
  const ppl = S.people.filter(p => !p.dead && p.hub === hub && (field === 'music' ? ['composer', 'sound'].includes(p.role) : field === 'stage' ? p.role === 'actor' && p.standing >= 20 : field === 'podcast' ? p.role === 'sound' : ['editor', 'dp'].includes(p.role))).sort((a, b) => b.standing - a.standing).slice(0, 12);
  return `<h3>Who works in ${esc((FIELD_LABEL[field] || field).toLowerCase())} in ${esc(hubName(hub))}</h3><p>About <b>${(O.H + staff).toLocaleString()}</b> people: ${O.H.toLocaleString()} freelancers and ${staff.toLocaleString()} on staff at ${cos.length} companies. Every one of them has a page.</p>
   <div class="cols two"><div><h4>Freelancers</h4><ul class="plain small">${O.D.map(d => `<li><a href="#" class="lk" data-go="staff:${esc(R.key)}">${esc(d.dept)}</a> <b>${d.n.toLocaleString()}</b></li>`).join('')}</ul><p><a href="#" class="lk" data-go="staff:${esc(R.key)}">Search every freelancer ›</a></p>
   <h4>On staff</h4><ul class="plain small">${cos.slice(0, 14).map(([c, i]) => `<li>${mcoLink(i)} <span class="muted">· <a href="#" class="lk" data-go="staff:m${i}">${headcount(coRef('m' + i)).toLocaleString()} staff</a></span></li>`).join('')}</ul></div>
   <div><h4>Names you might know</h4><ul class="plain small">${ppl.map(p => `<li>${pl(p.id)} <span class="muted">${esc(ROLE_LABEL[p.role])}</span></li>`).join('') || '<li class="muted">Nobody on the ladder yet.</li>'}</ul>
   <h4>The real numbers</h4><p class="muted small">Roughly how many people do these jobs in the United States today, from labour statistics and industry counts. The game's cities are sized in proportion.</p><ul class="plain small">${(REAL_WORK[field] || []).map(([l, n]) => `<li>${esc(l)} <b>${n.toLocaleString()}</b></li>`).join('')}</ul></div></div>`;
}
// Freelance "companies" ride on the staff directory: a key like "xmusic|hollywood".
function freeCoRef(key) {
  const [field, hub] = key.slice(1).split('|'); if (!FREE_DEPTS[field] || !HUBS[hub]) return null;
  return { key, name: `Freelance ${(FIELD_LABEL[field] || field).toLowerCase()}, ${hubName(hub)}`, kind: 'free_' + field, field, hub, tier: 3, founded: FIG_START[field], free: 1 };
}
function freeTitle(R, d, r) { const D = FREE_DEPTS[R.field].find(x => x[0] === d.dept); return D[2][Math.floor(r() * D[2].length)]; }
function freeProjects(R, e) {
  const r = hashRand(e.n * 7919 + 29), out = [], L = activeFigures(R.hub, R.field); if (!L.length) return out;
  for (let k = 0; k < 6; k++) { const x = L[Math.floor(r() * L.length)], rel = figReleases(Object.assign({ hub: R.hub }, x)).filter(s => yearOf(s * 6) >= e.since); if (rel.length) out.push(`${songLink(Object.assign({ hub: R.hub, fid: figId(x) }, x), rel[Math.floor(r() * rel.length)])} by ${figLink(Object.assign({ hub: R.hub }, x))} <span class="muted small">(${esc(e.title.toLowerCase())})</span>`); }
  return [...new Set(out)];
}
// Who played on it: a few freelancers credited on every release.
function songCrew(x, slot) {
  const R = freeRef(x.field, x.hub); if (!R) return [];
  const O = orgChart(R), r = hashRand(x.name.length * 977 + slot * 13 + 5), out = [];
  for (const d of O.D.slice(0, x.field === 'music' ? 4 : 5)) if (r() < .7) out.push(d.start + Math.floor(r() * d.n));
  return out.map(n => [R, n]);
}
// An artist's chart record, from the last few years of weekly charts.
function figChartRecord(x) {
  const A = archive(), k = 'fcr:' + x.hub + ':' + x.name; if (A[k]) return A[k];
  let best = 99, wks = 0, ones = 0; const w0 = Math.max(weekOfYear(x.from), S.week - 156), w1 = x.to ? Math.min(S.week, weekOfYear(x.to + 1)) : S.week;
  for (let w = w0; w <= w1; w += 2) { const C = chartAt(x.field, x.hub, w, 40), i = C.findIndex(c => c.name === x.name); if (i >= 0) { wks += 2; best = Math.min(best, i + 1); if (!i) ones += 2; } }
  return A[k] = { best, wks, ones };
}
function figExtraHTML(x) {
  const rec = figChartRecord(x), crew = songCrew(x, Math.floor(S.week / 6)), r = hashRand(x.name.length * 31 + x.fans % 71), N = NAMES[(HUBS[x.hub] || HUBS.hollywood).lang] || NAMES.en;
  const members = ['band', 'duo', 'choir', 'troupe'].includes(x.kind) ? Array.from({ length: x.kind === 'duo' ? 2 : 3 + Math.floor(r() * 3) }, () => `${N.F.concat(N.M)[Math.floor(r() * (N.F.length + N.M.length))]} ${N.L[Math.floor(r() * N.L.length)]}`) : [];
  return `<section class="panel"><h3>Chart record <span class="count">last three years</span></h3><p>${rec.wks ? `Peak <b>#${rec.best}</b> · about <b>${rec.wks}</b> weeks in the top 40${rec.ones ? ` · <b>${rec.ones}</b> weeks at number one` : ''}.` : 'Not in the top 40 lately.'} <a href="#" class="lk" data-go="chart:${x.field}~${x.hub}">See the chart ›</a></p>
   ${members.length ? `<h4>Members</h4><p class="small">${members.map(esc).join(' · ')}</p>` : ''}${crew.length ? `<h4>Their people</h4><p class="small">${crew.map(([R, n]) => `${empLink(R, n)} <span class="muted">(${esc(staffAt(R, n).title.toLowerCase())})</span>`).join(' · ')}</p>` : ''}</section>`;
}
function chartClick(t) {
  const d = t.dataset;
  if (d.cht) { UI.ch = UI.ch || {}; UI.ch.tab = d.cht; render(true); return true; }
  if (d.chpg !== undefined) { UI.ch.pg = +d.chpg; render(true); return true; }
  return false;
}
function chartChange(e) {
  const id = e.target.id, v = e.target.value, st = UI.ch; if (!st) return false;
  if (id === 'ch-hub') { st.hub = v; st.pg = 0; render(true); return true; }
  if (id === 'ch-y') { st.y = +v; st.w = chartWeeks(+v)[0]; render(true); return true; }
  if (id === 'ch-w') { st.w = +v; render(true); return true; }
  return false;
}
