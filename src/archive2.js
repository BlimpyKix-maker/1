// ---------------- The archive, everywhere ----------------
// Every name in the music, video, podcast and stage world now has a page: performers (with a label, a
// discography, awards and press), songs (credits with real people from the database, streams, chart peak),
// media companies (roster, history, openings) and your own releases. The Daily Slate becomes a real newspaper:
// a front page, sections, a search, an archive by month, and a section of stories about you, kept forever.
const FIELD_LABEL = { music: 'Music', creator: 'Online video', podcast: 'Podcasts', stage: 'Theatre' };
const KIND_LABEL = { singer: 'Singer', band: 'Band', rapper: 'Rapper', dj: 'DJ', creator: 'Creator', blipper: 'Short-form creator', show: 'Podcast', playwright: 'Playwright', composer: 'Composer' };
const FIELD_CO = { music: 'label', creator: 'creator', podcast: 'podcast', stage: 'theatre' };
function figAt(id) { const [hub, i] = String(id).split('~'); const L = HUBS[hub] ? mediaFigures(hub) : []; return L[+i] ? Object.assign({ hub, i: +i }, L[+i]) : null; }
function figId(x) { const i = mediaFigures(x.hub).indexOf(x); return i >= 0 ? `${x.hub}~${i}` : null; }
function figLink(x, label) { const id = x.fid || figId(x); return id ? `<a href="#" class="lk" data-go="fig:${id}">${esc(label || x.name)}</a>` : esc(label || x.name); }
function figByName(name) { for (const h of HUB_IDS) { const L = mediaFigures(h), i = L.findIndex(x => x.name === name); if (i >= 0) return Object.assign({ hub: h, i, fid: `${h}~${i}` }, L[i]); } return null; }
function figLabel(x) { const t = FIELD_CO[x.field], L = MEDIA_COS.map((c, i) => [c, i]).filter(([c]) => c.type === t && c.f <= S.year), near = L.filter(([c]) => c.hub === x.hub); const P2 = near.length ? near : L; if (!P2.length) return null; const r = hashRand(x.name.length * 131 + x.fans % 101)(); return P2[Math.floor(r * P2.length)]; }
function mcoLink(i) { const c = MEDIA_COS[i]; return c ? `<a href="#" class="lk" data-go="mco:${i}">${esc(c.n)}</a>` : ''; }
// Releases: about one a year since they started, titled by the same hash the charts use.
function figReleases(x) { const out = [], start = Math.floor(weekOfYear(x.from || S.year - 3) / 6), now = Math.floor(S.week / 6), r = hashRand(x.name.length * 977 + x.fans % 89); for (let s = start + Math.floor(r() * 6); s <= now && out.length < 80; s += 6 + Math.floor(r() * 6)) if (!x.to || s * 6 <= weekOfYear(x.to + 1)) out.push(s); return out.reverse(); }
function songTitle(x, slot) { return workTitleFor(x, slot * 6); }
function songLink(x, slot) { const id = x.fid || figId(x); return id ? `<a href="#" class="lk" data-go="song:${id}~${slot}">${esc(songTitle(x, slot))}</a>` : esc(songTitle(x, slot)); }
function figAwards(name) { return (S.mawards || []).flatMap(a => a.w.filter(([, n]) => n === name).map(([c]) => ({ y: a.y, show: a.show, c }))); }
function newsAbout(text, n = 8) { const out = []; for (let i = S.news.length - 1; i >= 0 && out.length < n; i--) if (S.news[i].text.includes(text)) out.push(i); return out; }
function newsList(ids) { return ids.length ? `<ul class="plain">${ids.map(i => `<li><a href="#" class="lk" data-go="article:${i}">${esc(S.news[i].text.slice(0, 120))}</a> <span class="muted small">${fmtDate(S.news[i].w, true)}</span></li>`).join('')}</ul>` : '<p class="muted small">No coverage yet.</p>'; }
function viewFigure(id) {
  const x = figAt(id); if (!x) return '<p class="muted">Not found.</p>';
  const lab = figLabel(x), rel = figReleases(x), aw = figAwards(x.name), chart = chartFor(x.field, x.hub), pos = chart.findIndex(c => c.name === x.name);
  const peers = activeFigures(x.hub, x.field).filter(y => y.name !== x.name).slice(0, 6);
  return `<div class="head"><p class="eyebrow">${esc(FIELD_LABEL[x.field] || x.field)} · ${esc(KIND_LABEL[x.kind] || x.kind)} · ${esc(hubName(x.hub))}</p><h2>${esc(x.name)}</h2><p class="lede">${x.legend ? 'A legend of the form. ' : ''}Active since ${x.from}${x.to ? `, until ${x.to}` : ''}. ${Math.round(x.fans).toLocaleString()} fans${lab ? `, signed to ${mcoLink(lab[1])}` : ''}.${pos >= 0 ? ` Number ${pos + 1} on this week's chart.` : ''}</p></div>
   <div class="cols two"><section class="panel"><h3>${x.field === 'podcast' ? 'Episodes and seasons' : x.field === 'stage' ? 'Productions' : 'Releases'}</h3><ul class="plain">${rel.slice(0, 16).map(s => `<li>${songLink(x, s)} <span class="muted small">${fmtDate(s * 6, true)}</span></li>`).join('') || '<li class="muted">Nothing released yet.</li>'}</ul></section>
   <section class="panel"><h3>Awards</h3>${aw.length ? `<ul class="plain">${aw.map(a => `<li>🏆 ${typeof bodyLink === 'function' ? bodyLink(a.show) : esc(a.show)} ${a.y}: ${esc(a.c)}</li>`).join('')}</ul>` : '<p class="muted small">No wins yet.</p>'}<h3>In the press</h3>${newsList(newsAbout(x.name))}<h3>Also in ${esc(hubName(x.hub))}</h3><p>${peers.map(y => figLink(y)).join(' · ') || '<span class="muted">Nobody else yet.</span>'}</p></section></div>`;
}
function viewSong(id) {
  const parts = String(id).split('~'), x = figAt(parts[0] + '~' + parts[1]), slot = +parts[2]; if (!x) return '<p class="muted">Not found.</p>';
  const r = hashRand(x.name.length * 53 + slot * 7), lab = figLabel(x), age = Math.max(1, Math.floor(S.week / 6) - slot);
  const pool = S.people.filter(p => !p.dead && p.hub === x.hub && (p.role === 'composer' || p.role === 'sound' || p.role === 'producer'));
  const credit = n => { const out = []; for (let i = 0; i < n && pool.length; i++) out.push(pool[Math.floor(r() * pool.length)].id); return [...new Set(out)]; };
  const writers = credit(2), prod = credit(1), mins = 2 + Math.floor(r() * 3), secs = Math.floor(r() * 60), streams = Math.round(x.fans * (.5 + r() * 3) * Math.min(6, Math.sqrt(age)) * (x.field === 'music' ? 40 : 6)), peak = 1 + Math.floor(r() * r() * 40);
  const unit = { music: 'streams', creator: 'views', podcast: 'downloads', stage: 'tickets sold' }[x.field] || 'plays';
  return `<div class="head"><p class="eyebrow">${esc(FIELD_LABEL[x.field] || '')} · ${fmtDate(slot * 6, true)}</p><h2>${esc(songTitle(x, slot))}</h2><p class="lede">By ${figLink(x)}${lab ? ` · ${mcoLink(lab[1])}` : ''} · ${x.field === 'stage' ? 'running time ' + (80 + Math.floor(r() * 70)) + ' min' : x.field === 'podcast' ? (20 + Math.floor(r() * 60)) + ' min episodes' : `${mins}:${String(secs).padStart(2, '0')}`}</p></div>
   <div class="kpis mini"><div><span>${unit}</span><b>${streams.toLocaleString()}</b></div><div><span>Chart peak</span><b>#${peak}</b></div><div><span>Weeks charting</span><b>${Math.max(1, Math.round((41 - peak) / 4))}</b></div></div>
   <section class="panel"><h3>Credits</h3><p>${x.field === 'stage' ? 'Written by' : 'Written by'} ${figLink(x)}${writers.length ? ', ' + writers.map(pl).join(', ') : ''}${prod.length ? `<br>Produced by ${prod.map(pl).join(', ')}` : ''}</p>${lab && typeof coRef === 'function' ? (() => { const R = coRef('m' + lab[1]), O = orgChart(R), A = O.D.find(d => /A&R|Creative|Production|Artistic/.test(d.dept)), Mk = O.D.find(d => /Marketing/.test(d.dept)); return `<p class="small">At ${mcoLink(lab[1])}: ${A ? 'A&R ' + empLink(R, A.start + Math.floor(r() * Math.min(A.n, 20))) : ''}${Mk ? ' · marketing ' + empLink(R, Mk.start + Math.floor(r() * Math.min(Mk.n, 20))) : ''}</p>`; })() : ''}<h3>More by ${esc(x.name)}</h3><p>${figReleases(x).filter(s => s !== slot).slice(0, 6).map(s => songLink(x, s)).join(' · ')}</p></section>`;
}
function viewMediaCo(i) {
  const c = MEDIA_COS[+i]; if (!c) return '<p class="muted">Not found.</p>';
  const field = Object.keys(FIELD_CO).find(f => FIELD_CO[f] === c.type) || (c.type === 'publisher' ? 'music' : 'music');
  const seen = new Set(), roster = HUB_IDS.flatMap(h => activeFigures(h, field).map(x => Object.assign({ hub: h }, x))).filter(x => !seen.has(x.name) && seen.add(x.name)).filter(x => { const L = figLabel(x); return L && L[1] === +i; }).sort((a, b) => b.fans - a.fans).slice(0, 18);
  const jobs = (S.me ? S.me.board : []).filter(p => p.mco === c.n);
  return `<div class="head"><p class="eyebrow">${esc(MCO_TYPE[c.type] || c.type)} · ${esc(hubName(c.hub))} · founded ${c.f}</p><h2>${esc(c.n)}</h2><p class="lede">${esc(c.d)}</p></div>
   <div class="cols two"><section class="panel"><h3>Roster</h3>${roster.length ? `<ul class="plain">${roster.map(x => `<li>${figLink(x)} <span class="muted small">${esc(KIND_LABEL[x.kind] || x.kind)} · ${Math.round(x.fans).toLocaleString()} fans</span></li>`).join('')}</ul>` : '<p class="muted small">Nobody signed that we know of.</p>'}</section>
   <section class="panel"><h3>Hiring now</h3>${jobs.length ? `<ul class="plain">${jobs.map(p => `<li><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a> <span class="muted small">${fmtCash(p.rate)}/day</span></li>`).join('')}</ul>` : '<p class="muted small">Nothing on your board from them this week.</p>'}<h3>In the press</h3>${newsList(newsAbout(c.n))}</section></div>${typeof staffDirectoryHTML === 'function' ? staffDirectoryHTML(coRef('m' + (+i)), false) : ''}`;
}
function viewWork(id) {
  const M = S.me, w = (M.works || []).find(x => x.id === +id); if (!w) return '<p class="muted">Not found.</p>';
  const T = WORK_TYPES[w.type] || {}, wk = w.wk || [], mx = Math.max(1, ...wk);
  const bars = wk.slice(-26).map((v, i, a) => `<rect x="${i * (300 / Math.max(1, a.length))}" y="${60 - v / mx * 56}" width="${Math.max(2, 300 / Math.max(1, a.length) - 2)}" height="${v / mx * 56}" fill="var(--accent)"/>`).join('');
  return `<div class="head"><p class="eyebrow">${esc(T.label || w.type)} · released ${fmtDate(w.rel, true)}${w.plat ? ' on ' + esc(platName(w.plat)) : ''}</p><h2>${esc(w.title)}</h2><p class="lede">By ${pl(ME().id)}. ${w.q >= 80 ? 'People are calling it your best work.' : w.q >= 65 ? 'Solid. It found its people.' : 'It came and went, mostly.'}</p></div>
   <div class="kpis mini"><div><span>Quality</span><b>${Math.round(w.q)}</b></div><div><span>Audience</span><b>${Math.round(w.units || 0).toLocaleString()}</b></div><div><span>Earned</span><b>${fmtCash(Math.round(w.earned || 0))}</b></div>${w.cost ? `<div><span>Cost</span><b>${fmtCash(w.cost)}</b></div>` : ''}</div>
   ${wk.length ? `<section class="panel"><h3>Week by week</h3><svg viewBox="0 0 300 62" width="100%" height="90" preserveAspectRatio="none">${bars}</svg></section>` : ''}<section class="panel"><h3>In the press</h3>${newsList(newsAbout(w.title))}</section>`;
}
function viewExtra(cur) {
  if (cur.kind === 'fig') return viewFigure(cur.id);
  if (cur.kind === 'song') return viewSong(cur.id);
  if (cur.kind === 'mco') return viewMediaCo(cur.id);
  if (cur.kind === 'work') return viewWork(cur.id);
  if (cur.kind === 'emp' && typeof viewEmployee === 'function') return viewEmployee(cur.id);
  if (cur.kind === 'staff' && typeof staffDirectoryHTML === 'function') { const R = coRef(cur.id); return R ? staffDirectoryHTML(R, true) : ''; }
  if (cur.kind === 'biz' && typeof viewBiz === 'function') return viewBiz(cur.id);
  if (cur.kind === 'paper') return `<section class="panel">${paperHTML()}</section>`;
  return '';
}
// ---- The Daily Slate: a newspaper with an archive ----
const PAPER_SECTIONS = [['front', 'Front page'], ['film', 'Film'], ['biz', 'Business'], ['people', 'People'], ['awards', 'Awards'], ['you', 'About you'], ['archive', 'Archive']];
function paperSection(n) { const t = n.type; if (n.ref && S.me && n.ref.person === S.me.id) return 'you'; if (/Award|Festival|Prize/.test(t)) return 'awards'; if (/Company|Deal|Merger|Market|Business|Studio/.test(t) || (n.ref && n.ref.company !== undefined && n.ref.film === undefined)) return 'biz'; if (/People|Death|Obit|Birth|Family|Debut/.test(t) || (n.ref && n.ref.person !== undefined)) return 'people'; return 'film'; }
function paperHTML() {
  const sec = UI.paper || 'front', q = (UI.npq || '').toLowerCase().trim(), N = S.news.length, me = S.me ? S.me.id : -1;
  const rows = []; for (let i = N - 1; i >= 0 && rows.length < 400; i--) rows.push(i);
  const card = (i, big) => { const n = S.news[i], f = n.ref && n.ref.film !== undefined ? S.films[n.ref.film] : null, p = n.ref && n.ref.person !== undefined ? P(n.ref.person) : null; return `<a href="#" class="np-card${big ? ' big' : ''}" data-go="article:${i}">${big && f ? `<span class="np-img">${posterSVG(f, 150)}</span>` : big && p ? `<span class="np-img">${portraitOf(p, 120)}</span>` : ''}<span class="np-k">${esc(n.type)} · ${fmtDate(n.w, true)}</span><b>${esc(n.text)}</b></a>`; };
  let body;
  if (sec === 'archive' || q) {
    const types = [...new Set(rows.map(i => S.news[i].type))].sort(), ty = UI.npt || '';
    const L = rows.filter(i => (!q || S.news[i].text.toLowerCase().includes(q)) && (!ty || S.news[i].type === ty)), byM = {};
    for (const i of L.slice(0, 300)) { const k = fmtDate(S.news[i].w, true).replace(/^\d+ /, ''); (byM[k] = byM[k] || []).push(i); }
    body = `<div class="np-types">${['', ...types].map(t => `<button class="pill${ty === t ? ' on' : ''}" data-npt="${esc(t)}">${t || 'Every kind'}</button>`).join(' ')}</div>${Object.entries(byM).map(([m, ids]) => `<h4>${esc(m)}</h4><ul class="np-list">${ids.map(i => `<li><a href="#" class="lk" data-go="article:${i}">${esc(S.news[i].text)}</a> <span class="muted small">${esc(S.news[i].type)}</span></li>`).join('')}</ul>`).join('') || '<p class="muted">No stories match.</p>'}`;
  } else if (sec === 'front') {
    const recent = rows.filter(i => S.week - S.news[i].w <= 1), lead = recent.find(i => S.news[i].ref && S.news[i].ref.film !== undefined && /Hit|Award|Flop/.test(S.news[i].type)) ?? recent[0] ?? rows[0];
    const mine = rows.filter(i => (S.news[i].ref || {}).person === me).slice(0, 3);
    body = `<div class="np-front">${lead !== undefined ? card(lead, 1) : ''}<div class="np-side">${recent.filter(i => i !== lead).slice(0, 7).map(i => card(i)).join('')}</div></div>${mine.length ? `<h4>About you</h4><div class="np-grid">${mine.map(i => card(i)).join('')}</div>` : ''}`;
  } else {
    const L = rows.filter(i => paperSection(S.news[i]) === sec || (sec === 'you' && (S.news[i].ref || {}).person === me)).slice(0, 40);
    body = L.length ? `<div class="np-grid">${L.map(i => card(i)).join('')}</div>` : `<p class="muted">${sec === 'you' ? 'Nobody has written about you yet. Give them a reason: a credit, a prize, a hit.' : 'Nothing in this section yet.'}</p>`;
  }
  return `<div class="np"><div class="np-mast"><b>The Daily Slate</b><span>${fmtDate(S.week, true)} · ${N.toLocaleString()} stories on file</span></div><div class="np-tabs">${PAPER_SECTIONS.map(([k, l]) => `<button class="${sec === k && !q ? 'on' : ''}" data-paper="${k}">${l}${k === 'you' ? ` (${rows.filter(i => (S.news[i].ref || {}).person === me).length})` : ''}</button>`).join('')}<input id="npq" type="search" placeholder="Search every story…" value="${esc(UI.npq || '')}"></div>${body}</div>`;
}
function paperClick(t) { if (t.dataset.npt !== undefined) { UI.npt = t.dataset.npt; UI.paper = 'archive'; render(true); return true; } if (t.dataset.paper) { UI.paper = t.dataset.paper; UI.npq = ''; render(true); return true; } return false; }
// Stories about you read like stories: what happened, where you came from, what people say.
function playerArticle(n, r) {
  const M = S.me, me = ME(), pk = a => a[Math.floor(r() * a.length)], first = me.name.split(' ')[0];
  const cr = me.credits.map(i => S.films[i]).filter(Boolean), last = cr[cr.length - 1], yrs = Math.max(0, Math.round((S.week - M.startW) / 52));
  const friend = aliveKnown().filter(id => opinion(id) > 20).sort((a, b) => opinion(b) - opinion(a))[0], foe = aliveKnown().filter(id => opinion(id) < -10)[0];
  const out = [`${n.text}`];
  out.push(`${first}, ${ageOf(me)}, ${yrs ? `has been working in ${hubName(M.hub)} for ${yrs} year${yrs > 1 ? 's' : ''}` : `arrived in ${hubName(M.hub)} only recently`}${cr.length ? `, with ${cr.length} screen credit${cr.length > 1 ? 's' : ''} to date${last ? `, most recently ${last.title}` : ''}` : ''}. ${M.agent ? `They are represented by ${M.agent.name}.` : 'They have no agent, for now.'}`);
  if (friend !== undefined) out.push(`"${pk([`${first} is the real thing. I said that before anyone else did`, `Nobody works harder. Nobody`, `You meet ${first} once and you want them on every job`, `Watch this space`])}," says ${P(friend).name}, ${(ROLE_LABEL[P(friend).role] || '').toLowerCase()}.`);
  if (foe !== undefined && r() < .5) out.push(`Not everyone is a fan. ${P(foe).name} declined to comment, ${pk(['pointedly', 'with a long pause', 'and then commented anyway, off the record'])}.`);
  out.push(pk([`What comes next is anyone's guess. ${first} isn't saying.`, `Asked what's next, ${first} laughed: "Sleep, probably. Then the next one."`, `${first}'s next project is said to be ${pk(['already in the works', 'under wraps', 'the one people will remember'])}.`]));
  return out;
}

// ---- one search box for the whole world ----
function worldSearchHTML(q) {
  q = String(q || '').toLowerCase().trim(); if (q.length < 2) return '';
  const cos = S.companies.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  const mcos = MEDIA_COS.map((c, i) => [c, i]).filter(([c]) => c.n.toLowerCase().includes(q)).slice(0, 6);
  const figs = []; for (const h of HUB_IDS) { const L = mediaFigures(h); L.forEach((x, i) => { if (figs.length < 8 && x.name.toLowerCase().includes(q) && !figs.some(y => y.name === x.name)) figs.push(Object.assign({ hub: h, fid: h + '~' + i }, x)); }); }
  const songs = []; for (const h of HUB_IDS) { if (songs.length >= 6) break; mediaFigures(h).forEach((x, i) => { if (songs.length >= 6) return; const fx = Object.assign({ hub: h, fid: h + '~' + i }, x); for (const s of figReleases(fx).slice(0, 12)) if (songTitle(fx, s).toLowerCase().includes(q) && songs.length < 6) songs.push([fx, s]); }); }
  const prizes = typeof awardBodies === 'function' ? awardBodies().filter(b => b.name.toLowerCase().includes(q)).slice(0, 6) : [];
  const lessons = typeof CURR !== 'undefined' ? Object.entries(CURR).flatMap(([f, C]) => C.lessons.map((L, i) => [f, i, L]).filter(([, , L]) => L[1].toLowerCase().includes(q))).slice(0, 6) : [];
  const box = (t, items) => items.length ? `<div><h4>${t}</h4><ul class="plain">${items.join('')}</ul></div>` : '';
  const out = [box('Film companies', cos.map(c => `<li>${cl(c.id)} <span class="muted small">${esc(hubName(c.hub))}</span></li>`)), box('Labels, networks, theatres', mcos.map(([c, i]) => `<li>${mcoLink(i)} <span class="muted small">${esc(MCO_TYPE[c.type] || '')}</span></li>`)), box('Artists and shows', figs.map(x => `<li>${figLink(x)} <span class="muted small">${esc(KIND_LABEL[x.kind] || '')}</span></li>`)), box('Songs and works', songs.map(([x, s]) => `<li>${songLink(x, s)} <span class="muted small">by ${esc(x.name)}</span></li>`)), box('Prizes and festivals', prizes.map(b => `<li><a href="#" class="lk" data-go="award:${b.id}">${esc(b.name)}</a></li>`)), box('Craft lessons', lessons.map(([f, i, L]) => `<li><button class="linkish" data-jump="computer:library" data-libf="${f}">${esc(CURR[f].icon + ' ' + L[1])}</button></li>`))].filter(Boolean);
  return out.length ? `<div class="cols two wsearch">${out.join('')}</div>` : '';
}
