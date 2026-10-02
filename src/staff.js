// ---------------- Who works there: every company, every department, everyone ----------------
// Every company in every industry now has a staff the size of the real thing: a major studio employs about twelve
// thousand people, a major label seven thousand, a podcast network a few hundred, a recording studio a dozen.
// Each company has departments with their own title ladders, a leadership team (real people from the town where
// the ladder has them), a directory you can search and page through, and a history. Every employee has a page:
// title, department, boss, team, previous employers, and the actual films, records or shows they worked on while
// they were there. Everything is fixed by the world's seed, so the same person is in the same chair every visit,
// and kept in the world's archive once looked up.
const DEPTS = {
  film: [['Executive Office', .004], ['Development', .04], ['Production', .05], ['Physical Production', .07], ['Post-production', .06], ['Visual Effects', .05], ['Marketing', .09], ['Publicity', .03], ['Theatrical Distribution', .06], ['International Sales', .04], ['Home Entertainment & Streaming', .06], ['Consumer Products', .04], ['Business & Legal Affairs', .05], ['Finance', .07], ['Human Resources', .03], ['Technology', .06], ['Studio Operations & Backlot', .1], ['Film Library & Archive', .02], ['Facilities & Security', .066]],
  label: [['Executive Office', .005], ['A&R', .06], ['Marketing', .12], ['Radio Promotion', .06], ['Streaming & Digital', .1], ['Publicity', .05], ['Artist Relations', .05], ['Touring & Live', .06], ['Sync & Licensing', .05], ['Creative Services (Video & Art)', .06], ['Catalogue', .05], ['Royalties', .07], ['Business & Legal Affairs', .06], ['Finance', .07], ['Distribution', .06], ['Human Resources', .025], ['Technology', .045]],
  publisher: [['Executive Office', .01], ['Creative (A&R)', .18], ['Sync', .14], ['Copyright Administration', .2], ['Royalties', .22], ['Legal', .1], ['Finance', .1], ['Human Resources', .05]],
  podcast: [['Executive Office', .01], ['Production', .26], ['Editorial', .14], ['Audio Engineering', .12], ['Research', .08], ['Ad Sales', .14], ['Marketing', .09], ['Talent', .06], ['Legal', .04], ['Finance', .06]],
  creator: [['Executive Office', .02], ['Production', .26], ['Editing', .2], ['Brand Partnerships', .14], ['Talent Management', .12], ['Analytics', .08], ['Design', .1], ['Finance', .08]],
  theatre: [['Executive Office', .01], ['Artistic', .06], ['Producing', .05], ['Stage Management', .07], ['Carpentry & Scenery', .1], ['Lighting & Sound', .1], ['Wardrobe', .1], ['Front of House', .16], ['Box Office', .08], ['Marketing', .07], ['Development (Fundraising)', .06], ['Education & Outreach', .05], ['Finance & Admin', .09]],
  biz: [['Management', .18], ['Staff', .82]]
};
const LADDER_T = ['Assistant', 'Coordinator', 'Senior Coordinator', 'Manager', 'Senior Manager', 'Director', 'Senior Director', 'Vice President', 'Senior Vice President', 'Executive Vice President'];
const EXEC_T = ['Chief Executive Officer', 'President', 'Chief Operating Officer', 'Chief Financial Officer', 'Chief Creative Officer', 'General Counsel', 'Chief of Staff', 'Executive Assistant to the CEO', 'Executive Assistant to the President', 'Head of Strategy', 'Chief Marketing Officer', 'Chief Technology Officer'];
const QUIRK_T = ['Senior Vice President, Being Copied on Emails', 'Head of Snacks', 'Director of Saying No Nicely', 'Chief Vibes Officer (Acting)', 'Manager, Lost Lanyards', 'Coordinator of Coordinators', 'Vice President of Going Forward', 'Senior Manager, Circling Back', 'Head of the Good Stapler', 'Director of Meetings About Meetings'];
const BIZ_T = { studio: ['Studio Manager', 'Head Engineer', 'Recording Engineer', 'Assistant Engineer', 'Runner', 'Bookings'], school: ['Principal', 'Head of Strings', 'Piano Teacher', 'Guitar Teacher', 'Voice Teacher', 'Receptionist'], theatre: ['Artistic Director', 'Producer', 'Stage Manager', 'Technician', 'Usher', 'Box Office'], channel: ['Channel Owner', 'Producer', 'Editor', 'Thumbnail Designer', 'Community Manager', 'Camera Operator'], agency: ['Partner', 'Agent', 'Associate Agent', 'Assistant', 'Office Manager', 'Bookkeeper'], cinema: ['General Manager', 'Projectionist', 'Programmer', 'Duty Manager', 'Usher', 'Concessions'], venue: ['Owner', 'Booker', 'Sound Engineer', 'Bar Manager', 'Security', 'Door'], office: ['Founder', 'Account Director', 'Producer', 'Designer', 'Office Manager', 'Intern'] };
const BIO_Q = ['Answers email at three in the morning, every morning.', 'Has a framed photo with a celebrity they refuse to name.', 'Keeps a spreadsheet of every lunch they have ever expensed.', 'Started in the post room. Mentions it often.', 'Owns eleven identical navy jumpers.', 'Once fixed a premiere\'s projector with a hairpin. Never stops telling people.', 'Has a desk plant older than most of the interns.', 'Brings homemade biscuits to every budget meeting. Nobody knows why it works.', 'Can recite the opening crawl of any film from memory.', 'Has never once been on time and has never once been late for anything important.', 'Writes a screenplay on weekends. It\'s about a person who works here.', 'Famous for a two-word email that ended a feud.', 'Moved here for a six-month contract. That was nineteen years ago.', 'The only person who knows the Wi-Fi password.', 'Keeps a bell on the desk for good news. It has been rung four times.'];
const HIST_Q = ['moves its offices into a former bowling alley; the lanes become the edit suites', 'survives a takeover bid by refusing to answer the phone for a week', 'opens an office abroad, mostly so the founder has somewhere to go in winter', 'is sued by a parrot\'s owner; settles out of court', 'loses its entire archive in a flood; finds most of it in a car park a year later', 'hires its first person whose job title has the word "digital" in it', 'celebrates a record year with a party that is still discussed in hushed tones', 'introduces casual Fridays; repeals them by Tuesday', 'buys a rival, then realises the rival had bought it first, on paper', 'names its meeting rooms after famous flops, as a lesson', 'installs a slide between floors; removes it after an incident with a producer', 'is nearly sold to a car company', 'starts a training scheme; half of today\'s executives came through it', 'moves into streaming, apologising to nobody'];
function staffKey(c) { return c.id !== undefined && S.companies[c.id] === c ? 'f' + c.id : null; }
// What company a key names, in a common shape.
function coRef(key) {
  key = String(key); const t = key[0], rest = key.slice(1);
  if (t === 'f') { const c = S.companies[+rest]; if (!c) return null; return { key, name: c.name, kind: 'film', tier: c.tier, hub: c.hub, founded: c.founded, closed: c.closed, c }; }
  if (t === 'm') { const c = MEDIA_COS[+rest]; if (!c) return null; return { key, name: c.n, kind: ['label', 'publisher', 'podcast', 'creator', 'theatre'].includes(c.type) ? c.type : 'label', tier: c.tier || 2, hub: c.hub, founded: c.f, m: c, mi: +rest }; }
  if (t === 'b') { const [name, hub] = rest.split('|'); const kind = typeof bizKind === 'function' ? bizKind(name)[1] : 'office'; const r = hashRand([...name].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0); return { key, name, kind: 'biz', bk: BIZ_T[kind] ? kind : 'office', tier: 3, hub: HUBS[hub] ? hub : 'hollywood', founded: S.year - 2 - Math.floor(r() * 40) }; }
  return null;
}
function headcount(R) {
  const r = hashRand([...R.key].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 11) >>> 0)();
  const base = { film: [0, 12000, 1800, 160], label: [0, 7000, 900, 120], publisher: [0, 1600, 300, 40], podcast: [0, 900, 220, 40], creator: [0, 260, 90, 25], theatre: [0, 480, 160, 45], biz: [0, 30, 18, 9] }[R.kind] || [0, 50, 30, 10];
  const n = base[clamp(R.tier || 3, 1, 3)] * (.75 + r * .5) * (R.closed !== null && R.closed !== undefined ? .15 : 1);
  return Math.max(4, Math.round(n));
}
// The org chart as counts: departments, and within each the number of people at each rung (a pyramid).
let ARCH = {}, ARCH_S = null;
function archive() { if (ARCH_S !== S) { ARCH = {}; ARCH_S = S; } return ARCH; }
function orgChart(R) {
  const A = archive(); const k = 'org:' + R.key; if (A[k]) return A[k];
  const H = headcount(R), D = R.kind === 'biz' ? DEPTS.biz : DEPTS[R.kind] || DEPTS.film, out = []; let start = 0;
  for (const [dept, share] of D) {
    const n = dept === 'Executive Office' ? Math.min(12, Math.max(3, Math.round(H * share))) : Math.max(1, Math.round(H * share));
    const lad = dept === 'Executive Office' ? null : R.kind === 'biz' ? null : LADDER_T.slice(0, clamp(Math.round(Math.log10(n + 1) * 3.2), 3, LADDER_T.length));
    let ranks = [];   // counts from the top rung down
    if (lad) { const L = lad.length, w = Array.from({ length: L }, (_, ri) => Math.pow(1.9, ri)), sw = w.reduce((x, y) => x + y, 0); let left = n; for (let ri = 0; ri < L; ri++) { const c = ri === L - 1 ? left : Math.max(1, Math.min(left - (L - 1 - ri), Math.round(n * w[ri] / sw))); ranks.push(c); left -= c; } }
    out.push({ dept, n, start, lad, ranks }); start += n;
  }
  return A[k] = { H: start, D: out };
}
const STAFF_FIRST = 'ABCDEFGHJKLMNOPRSTVW';
function staffAt(R, n) {
  const A = archive(), k = 'emp:' + R.key + '~' + n; if (A[k]) return A[k];
  const O = orgChart(R); if (n < 0 || n >= O.H) return null;
  const d = O.D.find(x => n >= x.start && n < x.start + x.n), i = n - d.start, r = hashRand(([...R.key].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 3) >>> 0) + n * 2654435761 % 1e9);
  let title, rank;
  if (d.dept === 'Executive Office') { title = EXEC_T[i] || 'Executive Assistant'; rank = i < 2 ? 12 : 10; }
  else if (R.kind === 'biz') { const T = BIZ_T[R.bk] || BIZ_T.office; title = n === 0 ? T[0] : T[1 + Math.floor(r() * (T.length - 1))]; rank = n === 0 ? 8 : d.dept === 'Management' ? 5 : 2; }
  else { let acc = 0, ri = 0; for (; ri < d.ranks.length; ri++) { acc += d.ranks[ri]; if (i < acc) break; } const lvl = d.lad.length - 1 - Math.min(ri, d.lad.length - 1); rank = lvl; title = `${d.lad[lvl]}, ${d.dept}`; if (lvl >= 3 && r() < .012) title = QUIRK_T[Math.floor(r() * QUIRK_T.length)]; }
  const N = NAMES[(HUBS[R.hub] || HUBS.hollywood).lang] || NAMES.en, g = r() < .5 ? 'F' : 'M', first = N[g][Math.floor(r() * N[g].length)], last = N.L[Math.floor(r() * N.L.length)] + (r() < .06 ? '-' + N.L[Math.floor(r() * N.L.length)] : '');
  const mid = r() < .55 ? ' ' + STAFF_FIRST[Math.floor(r() * STAFF_FIRST.length)] + '.' : '';
  const age = Math.round(clamp(22 + rank * 3.6 + Math.floor(r() * 14), 20, 74)), years = clamp(Math.floor(r() * (age - 21) * .6) + (rank >= 8 ? 4 : 0), 0, Math.max(0, S.year - (R.founded || S.year - 40)));
  return A[k] = { key: R.key, n, name: `${first}${mid} ${last}`, g, dept: d.dept, title, rank, age, since: S.year - years, quip: BIO_Q[Math.floor(r() * BIO_Q.length)], r: r() };
}
// Real people in the top chairs where the ladder has them.
function leadersOf(R) { if (R.kind !== 'film' || typeof staffOf !== 'function' || !R.c || R.c.closed !== null) return []; return staffOf(R.c).filter(s => s.id !== null && s.r >= 4).sort((a, b) => b.r - a.r).map(s => ({ id: s.id, title: LADDER[s.r][0] })); }
function bossOf(R, e) {
  const O = orgChart(R), d = O.D.find(x => x.dept === e.dept), ex = O.D[0];
  if (!d) return null;
  if (d.dept === 'Executive Office' || (R.kind === 'biz' && e.n === d.start)) return e.n === ex.start ? null : staffAt(R, ex.start);
  const L = []; let top = -1;
  for (let j = e.n - 1; j >= d.start && L.length < 200; j--) { const x = staffAt(R, j); if (x.rank > e.rank) { if (top < 0) top = x.rank; if (x.rank === top) L.push(x); else break; } }
  if (!L.length) return staffAt(R, ex.start + Math.min(1, ex.n - 1));
  return L[Math.floor(e.r * L.length)];
}
function empLink(R, n, label) { const e = staffAt(R, n); return e ? `<a href="#" class="lk" data-go="emp:${R.key}~${n}">${esc(label || e.name)}</a>` : ''; }
function coLink(R) { return R.kind === 'film' ? cl(R.c.id) : R.kind === 'biz' ? `<a href="#" class="lk" data-go="biz:${esc(R.key)}">${esc(R.name)}</a>` : mcoLink(R.mi); }
// What they worked on while they were there.
function empProjects(R, e) {
  const out = [], since = e.since, r = hashRand(e.n * 7919 + 13);
  if (R.kind === 'film') { const role = { Marketing: 'marketing', Publicity: 'publicity', 'Post-production': 'post-production', 'Visual Effects': 'visual effects', Development: 'development', Production: 'production', 'Physical Production': 'physical production', 'Theatrical Distribution': 'distribution', 'International Sales': 'international sales', 'Home Entertainment & Streaming': 'home release', 'Consumer Products': 'merchandise', 'Business & Legal Affairs': 'deals', Finance: 'finance' }[e.dept]; if (!role) return out; const L = R.c.films.map(i => S.films[i]).filter(f => f && f.rel !== null && yearOf(f.rel) >= since); for (const f of L) if (r() < (e.rank >= 7 ? .9 : .35) && out.length < 10) out.push(`${fl(f.id)} <span class="muted small">(${role}, ${yearOf(f.rel)})</span>`); }
  else if (R.kind !== 'biz' && R.m) { const field = { label: 'music', publisher: 'music', podcast: 'podcast', creator: 'creator', theatre: 'stage' }[R.kind]; const roster = HUB_IDS.flatMap(h => activeFigures(h, field).map(x => Object.assign({ hub: h }, x))).filter(x => { const L = figLabel(x); return L && L[1] === R.mi; }); for (const x of roster) { if (r() < .5 && out.length < 8) { const rel = figReleases(x); const s = rel.find(s2 => yearOf(s2 * 6) >= since); if (s !== undefined) out.push(`${songLink(x, s)} by ${figLink(x)} <span class="muted small">(${e.dept.toLowerCase()})</span>`); } } }
  return out;
}
function prevEmployers(R, e) {
  const r = hashRand(e.n * 104729 + 7), out = [], n = Math.min(3, Math.floor(r() * 4)), pool = S.companies.filter(c => c.hub === R.hub && c.id !== (R.c ? R.c.id : -1));
  const mpool = MEDIA_COS.map((c, i) => [c, i]).filter(([c, i]) => c.hub === R.hub && i !== R.mi);
  for (let k = 0; k < n; k++) { const film = r() < (R.kind === 'film' ? .7 : .3), y1 = e.since - 1 - Math.floor(r() * 6) - k * 3; if (y1 < 1950) break; if (film && pool.length) { const c = pool[Math.floor(r() * pool.length)]; out.push(`${cl(c.id)} <span class="muted small">until ${y1}</span>`); } else if (mpool.length) { const [c, i] = mpool[Math.floor(r() * mpool.length)]; out.push(`${mcoLink(i)} <span class="muted small">until ${y1}</span>`); } }
  return out;
}
function viewEmployee(id) {
  const [key, n] = String(id).split('~'), R = coRef(key); if (!R) return '<p class="muted">Not found.</p>';
  const e = staffAt(R, +n); if (!e) return '<p class="muted">Not found.</p>';
  const boss = bossOf(R, e), O = orgChart(R), d = O.D.find(x => x.dept === e.dept), team = []; for (let j = d.start; j < d.start + d.n && team.length < 8; j++) if (j !== e.n && Math.abs(staffAt(R, j).rank - e.rank) <= 1) team.push(j);
  const proj = empProjects(R, e), prev = prevEmployers(R, e);
  return `<div class="head"><p class="eyebrow">${esc(e.dept)} · ${coLink(R)} · ${esc(hubName(R.hub))}</p><h2>${esc(e.name)}</h2><p class="lede">${esc(e.title)}. ${e.age}, at the company since ${e.since}. ${esc(e.quip)}</p></div>
   <div class="cols two"><section class="panel"><h3>Where they sit</h3><p>${boss ? `Reports to ${empLink(R, boss.n)} <span class="muted small">(${esc(boss.title)})</span>` : 'Reports to the board.'}</p>${team.length ? `<h4>Works alongside</h4><ul class="plain small">${team.map(j => `<li>${empLink(R, j)} <span class="muted">· ${esc(staffAt(R, j).title)}</span></li>`).join('')}</ul>` : ''}<p><a href="#" class="lk" data-go="staff:${esc(R.key)}">The whole ${esc(R.name)} directory ›</a></p>${prev.length ? `<h4>Before ${esc(R.name)}</h4><ul class="plain small">${prev.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}</section>
   <section class="panel"><h3>Worked on</h3>${proj.length ? `<ul class="plain small">${proj.map(x => `<li>${x}</li>`).join('')}</ul>` : '<p class="muted small">Nothing with their name on it. Every company runs on people like this.</p>'}</section></div>`;
}
function companyHistory(R) {
  const r = hashRand([...R.key].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 5) >>> 0), out = [[R.founded || 1950, R.kind === 'biz' ? `opens its doors in ${hubName(R.hub)}` : `is founded in ${hubName(R.hub)}`]];
  for (let y = (R.founded || 1950) + 3 + Math.floor(r() * 5); y < S.year; y += 5 + Math.floor(r() * 9)) out.push([y, HIST_Q[Math.floor(r() * HIST_Q.length)]]);
  if (R.kind === 'film' && R.c) { const top = R.c.films.map(i => S.films[i]).filter(f => f && f.rel !== null).sort((a, b) => b.total - a.total).slice(0, 4); for (const f of top) out.push([yearOf(f.rel), `releases ${f.title}, which takes ${fmtM(f.total)}`, f.id]); if (R.closed !== null && R.closed !== undefined) out.push([R.closed, 'closes its doors']); }
  if (R.m) { const field = { label: 'music', publisher: 'music', podcast: 'podcast', creator: 'creator', theatre: 'stage' }[R.kind]; const big = HUB_IDS.flatMap(h => activeFigures(h, field).map(x => Object.assign({ hub: h }, x))).filter(x => { const L = figLabel(x); return L && L[1] === R.mi; }).sort((a, b) => b.fans - a.fans).slice(0, 3); for (const x of big) out.push([Math.max(R.founded, x.from), `signs ${x.name}`]); }
  return out.sort((a, b) => a[0] - b[0]);
}
function staffDirectoryHTML(R, full) {
  const O = orgChart(R), L = leadersOf(R); if (!UI.stf || UI.stf.key !== R.key) { UI.stf = { key: R.key, dept: '', page: 0 }; if (full) UI.stq = ''; } const st = UI.stf;
  const q = (UI.stq || '').toLowerCase().trim(), D = st.dept ? O.D.filter(x => x.dept === st.dept) : O.D, per = 50;
  let ids = [];
  if (q.length >= 2) { for (const d of D) for (let j = d.start; j < d.start + d.n && ids.length < 400; j++) { const e = staffAt(R, j); if (e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q)) ids.push(j); } }
  else for (const d of D) for (let j = d.start; j < d.start + d.n; j++) ids.push(j);
  const pages = Math.max(1, Math.ceil(ids.length / per)), pg = clamp(st.page || 0, 0, pages - 1), slice = ids.slice(pg * per, pg * per + per);
  const H = O.H, hist = companyHistory(R);
  if (!full) return `<section class="panel"><h3>People <span class="count">${H.toLocaleString()} staff · ${O.D.length} departments</span></h3>${L.length ? `<p class="small">Leadership: ${L.slice(0, 5).map(x => `${pl(x.id)} <span class="muted">(${esc(x.title)})</span>`).join(', ')}</p>` : `<p class="small">Leadership: ${[0, 1, 2].filter(j => j < O.D[0].n).map(j => `${empLink(R, O.D[0].start + j)} <span class="muted">(${esc(staffAt(R, O.D[0].start + j).title)})</span>`).join(', ')}</p>`}<p class="small">${O.D.map(d => `${esc(d.dept)} <b>${d.n.toLocaleString()}</b>`).join(' · ')}</p><p><a href="#" class="lk" data-go="staff:${esc(R.key)}">Open the staff directory ›</a></p><h4>History</h4><ul class="plain small">${hist.slice(-8).map(([y, t, fid]) => `<li><b>${y}</b> ${esc(R.name)} ${fid !== undefined ? t.replace(S.films[fid].title, fl(fid)) : esc(t)}</li>`).join('')}</ul></section>`;
  return `<div class="head"><p class="eyebrow">Staff directory · ${coLink(R)}</p><h2>${esc(R.name)}: everyone</h2><p class="lede">${H.toLocaleString()} people in ${O.D.length} departments, ${esc(hubName(R.hub))}.</p></div>
   <div class="cols two"><section class="panel"><h3>Departments</h3><ul class="plain small">${O.D.map(d => `<li><button class="linkish${st.dept === d.dept ? ' on' : ''}" data-stdept="${esc(d.dept)}">${esc(d.dept)}</button> <span class="muted">${d.n.toLocaleString()}</span></li>`).join('')}${st.dept ? '<li><button class="linkish" data-stdept="">All departments</button></li>' : ''}</ul>${L.length ? `<h4>Leadership (on the ladder)</h4><ul class="plain small">${L.map(x => `<li>${pl(x.id)} <span class="muted">${esc(x.title)}</span></li>`).join('')}</ul>` : ''}<h4>History</h4><ul class="plain small">${hist.map(([y, t, fid]) => `<li><b>${y}</b> ${fid !== undefined ? esc(t).replace(esc(S.films[fid].title), fl(fid)) : esc(t)}</li>`).join('')}</ul></section>
   <section class="panel"><div class="bf-row"><input id="stq" type="search" placeholder="Search names and titles…" value="${esc(UI.stq || '')}"><span class="muted small">${ids.length.toLocaleString()} people · page ${pg + 1} of ${pages}</span><button class="btn-s ghost" data-stpage="${pg - 1}" ${pg ? '' : 'disabled'}>‹</button><button class="btn-s ghost" data-stpage="${pg + 1}" ${pg < pages - 1 ? '' : 'disabled'}>›</button></div>
    <table class="grid small"><thead><tr><th>Name</th><th>Title</th><th>Since</th></tr></thead><tbody>${slice.map(j => { const e = staffAt(R, j); return `<tr><td>${empLink(R, j)}</td><td>${esc(e.title)}</td><td>${e.since}</td></tr>`; }).join('')}</tbody></table></section></div>`;
}
function staffClick(t) {
  const d = t.dataset;
  if (d.stdept !== undefined) { if (UI.stf) { UI.stf.dept = d.stdept; UI.stf.page = 0; } render(true); return true; }
  if (d.stpage !== undefined) { if (UI.stf) UI.stf.page = +d.stpage; render(true); return true; }
  return false;
}
function viewBiz(key) { const R = coRef(key); if (!R) return '<p class="muted">Not found.</p>'; return `<div class="head"><p class="eyebrow">${esc(R.bk)} · ${esc(hubName(R.hub))} · since ${R.founded}</p><h2>${esc(R.name)}</h2><p class="lede">A small ${esc(R.bk === 'office' ? 'business' : R.bk)} in ${esc(hubName(R.hub))}. ${headcount(R)} people, most of whom wear several hats.</p></div>${staffDirectoryHTML(R, false)}`; }
// Film pages: the studio people behind the release.
function filmStaffHTML(f) {
  if (f.co === null || !S.companies[f.co]) return '';
  const R = coRef('f' + f.co), O = orgChart(R), pick = (dept, k) => { const d = O.D.find(x => x.dept === dept); if (!d) return null; const r = hashRand(f.id * 31 + k)(); return d.start + Math.floor(r * Math.min(d.n, 12)); };
  const rows = [['Development', 'Development executive'], ['Marketing', 'Marketing'], ['Publicity', 'Publicity'], ['Theatrical Distribution', 'Distribution'], ['Post-production', 'Post-production supervisor']].map(([d, l], k) => [l, pick(d, k)]).filter(x => x[1] !== null);
  return `<section class="panel"><h3>At ${esc(R.name)}</h3><ul class="plain small">${rows.map(([l, n]) => `<li>${esc(l)}: ${empLink(R, n)}</li>`).join('')}</ul></section>`;
}
