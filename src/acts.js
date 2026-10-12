// ---------------- The other industries, lived in: acts as people, releases as works ----------------
// Music, online video, podcasts and the stage used to be a list of names with hashed numbers behind them. Now every
// act is a person in the world, made the same way as everyone in film (skills, traits, a portrait, relationships,
// a page you can open), with a career that runs week by week:
//  · acts release on their own rhythm (a single every few months and an album now and then; a video most weeks;
//    a podcast season; a play a year or so), with quality from their skills and an audience from their fans;
//  · the charts are what was released, ranked by what it is doing this week (a release fades week by week, a good one
//    more slowly), so a number one is a real song by a real act, with its own page;
//  · fans follow good work and drift away from silence; fame follows fans;
//  · the year's awards go to the year's best work (quality × audience), and the winners keep them;
//  · new acts arrive every year and old ones stop; legends from the history of each form are in it too.
// The people are made while the world is built (before the save baseline), with hashed dice, so every load makes
// the same ones; a save from before this round loads without them and the old charts carry on.
const ACT_ROLE = { singer: 'composer', band: 'composer', rapper: 'composer', dj: 'composer', duo: 'composer', choir: 'composer', composer: 'composer', creator: 'editor', blipper: 'editor', streamer: 'editor', show: 'writer', playwright: 'writer', troupe: 'actor' };
const ACT_GROUP = new Set(['band', 'duo', 'choir', 'troupe', 'show']);
const ACT_RATE = { music: .22, creator: .85, podcast: .45, stage: .06 };   // chance of a release at each four-weekly look
const ACT_ENG = { music: 1.4, creator: 2.2, podcast: .5, stage: .02 }, ACT_CONV = { music: .05, creator: .04, podcast: .08, stage: .3 };
const ACT_DECAY = { music: .82, creator: .6, podcast: .9, stage: .93 };
// audiences drift away a little every four weeks, and growth slows as an act nears the size its field can hold
const ACT_CHURN = { music: .005, creator: .05, podcast: .005, stage: .001 }, ACT_CAP = { music: 2e7, creator: 1.5e7, podcast: 8e6, stage: 3e6 }, ACT_QUIET = { music: 26, creator: 13, podcast: 26, stage: 156 };
const ACT_KIND = { music: ['single', 'single', 'single', 'album'], creator: ['video'], podcast: ['season'], stage: ['production'] };
const ACT_SUBS = { composer: ['song', 'theme', 'score', 'orch'], editor: ['rhythm', 'shape', 'cont'], writer: ['struc', 'dial', 'char'], actor: ['range', 'pres', 'comic'] };
function actsOn() { return !!S.actsOn; }
function actSkill(p) { const L = ACT_SUBS[p.role] || []; return L.length ? L.reduce((t, k) => t + (p.sk[k] || 8), 0) / L.length : 10; }
function actFame(fans) { return clamp(Math.log10(Math.max(10, fans)) * 15 - 40, 0, 95); }
// one act, as a person
// one person per act: a star listed in two cities of the same market is the same star, and two different acts
// that happen to share a name are told apart by their home city, as real bands with the same name do
let ACT_SEEN = null;
function actSeen() { if (!ACT_SEEN) { ACT_SEEN = { id: new Map(), nm: new Set() }; for (const p of S.people) if (p && p.ind) { ACT_SEEN.nm.add(p.name); if (p.akey) ACT_SEEN.id.set(p.akey, p.id); } } return ACT_SEEN; }
function actMake(x, hub, i) {
  const key = x.name + '|' + x.kind + '|' + x.from, A0 = actSeen(); if (A0.id.has(key)) { x.pid = A0.id.get(key); return P(x.pid); }
  const prev = R; R = mulberry((hashRand(HUB_IDS.indexOf(hub) * 7919 + i * 104729 + x.name.length * 31 + (S.seed | 0))() * 4294967296) >>> 0);
  try {
    const role = ACT_ROLE[x.kind] || 'composer', age = clamp(20 + Math.floor(rnd() * 8) + (S.year - x.from), 18, 104);
    const p = makePerson(hub, role, { age, noPool: true }); if (ACT_GROUP.has(x.kind)) p.g = 'X';
    p.name = A0.nm.has(x.name) ? `${x.name} (${HUBS[hub].name})` : x.name; p.akey = key; p.ahub = hub; A0.nm.add(p.name); A0.id.set(key, p.id); p.ind = x.field; p.act = x.kind; p.fans = x.fans; p.mfrom = x.from; if (x.to) p.mto = x.to; p.debut = weekOfYear(Math.max(S.y0, x.from));
    if (x.legend) { p.legend = 1; if (typeof NEG_TRAITS !== 'undefined') p.traits = p.traits.filter(t => !NEG_TRAITS.includes(t)); }   // real people: no unflattering temperament
    const boost = Math.log10(Math.max(10, x.fans)) - 3; for (const k of ACT_SUBS[role] || []) { p.sk[k] = clamp(p.sk[k] + boost * 1.6, 1, 20); p.pot[k] = Math.max(p.pot[k], p.sk[k]); } recalc(p);
    p.fame = actFame(x.fans); p.standing = clamp(p.fame * .8 + rnd() * 10, 1, 95);
    if (x.to && x.to < S.year) { p.retired = true; p.retY = x.to; }
    if (p.born < 1925) { p.dead = true; p.retired = true; }   // the old legends: no obituary, they are simply history
    if (ACT_GROUP.has(x.kind) && x.kind !== 'show') { const N = NAMES[HUBS[hub].lang] || NAMES.en; p.members = Array.from({ length: x.kind === 'duo' ? 2 : x.kind === 'choir' ? 6 : 3 + Math.floor(rnd() * 3) }, () => `${N.F.concat(N.M)[Math.floor(rnd() * (N.F.length + N.M.length))]} ${N.L[Math.floor(rnd() * N.L.length)]}`); }
    const lab = typeof figLabel === 'function' ? figLabel(x) : null; if (lab) p.label = lab[1];
    p.rel = []; p.discN = Math.max(0, Math.round((Math.min(S.year, x.to || S.year) - x.from) * (x.field === 'music' ? 1.5 : x.field === 'creator' ? 30 : x.field === 'podcast' ? 2 : .6)));
    x.pid = p.id;
    return p;
  } finally { R = prev; }
}
// a release: quality from skills, an audience from fans, and a title from the same generator the old charts used
function actRelease(p, w, x) {
  const f = p.ind, kind = ACT_KIND[f][Math.floor(rnd() * ACT_KIND[f].length)], q = clamp(Math.round(actSkill(p) * 3.6 + 12 + gauss() * 9), 5, 98);
  const v0 = Math.round(p.fans * ACT_ENG[f] * Math.pow(q / 60, 2) * (.5 + rnd() * 1.1) * (kind === 'album' ? 1.6 : 1));
  const t = typeof workTitleFor === 'function' && x ? workTitleFor(x, w) : `${p.name} ${w}`;
  const r = { t: String(t).replace(/^"([^"]+)".*$/, '$1').replace(/ \([^)]*\)$/, ''), w, q, v0, kind };
  p.rel.push(r); if (p.rel.length > 12) p.rel.shift(); p.discN = (p.discN || 0) + 1;
  p.units = (p.units || 0) + v0 / (1 - ACT_DECAY[f]);
  p.fans = Math.max(50, p.fans + v0 * ACT_CONV[f] * (q / 70) / (1 + p.fans / ACT_CAP[f]));
  p.fame = actFame(p.fans); p.lastWork = w;
  return r;
}
function actUnits(p, r, w) { return w < r.w ? 0 : r.v0 * Math.pow(ACT_DECAY[p.ind] + (r.q - 60) / 2000, w - r.w); }
// ---- the world builds them ----
function actsInit() {
  ACT_SEEN = null; if (S.actsOn || typeof mediaFigures !== 'function') return;
  for (const h of HUB_IDS) { const L = mediaFigures(h); L.forEach((x, i) => { if (!x.pid && x.from <= S.year) actMake(x, h, i); }); }
  // a few recent releases each, so the charts have something on the first day
  const prevR = R; R = wstream('acts', 'seed', S.week);
  for (const h of HUB_IDS) for (const x of mediaFigures(h)) { const p = x.pid != null && P(x.pid); if (!p || p.retired || p.dead || (p.ahub || p.hub) !== h) continue; const n = p.ind === 'creator' ? 4 : p.ind === 'stage' ? 1 : 2; for (let k = n; k >= 1; k--) actRelease(p, S.week - Math.floor(k * (p.ind === 'creator' ? 3 : 10) * (.6 + rnd() * .8)), x); }
  S.actsOn = 1; S.actsW0 = S.week; R = prevR;
}
{ const _fw = finishWarm; finishWarm = function () { const r = _fw.apply(this, arguments); actsInit(); return r; }; }
// every week: a quarter of the acts take stock and maybe put something out
function actsWeek() {
  if (!S.actsOn) return; R = wstream('acts', S.week);
  for (const h of HUB_IDS) for (const x of mediaFigures(h)) { const p = x.pid != null ? P(x.pid) : null; if (!p || p.dead || p.retired || (p.ahub || p.hub) !== h || (p.id + S.week) % 4) continue;
    p.fans = Math.max(50, p.fans * (1 - ACT_CHURN[p.ind]));
    if (rnd() < ACT_RATE[p.ind] * (p.legend ? .6 : 1)) { const r = actRelease(p, S.week, x); if (r.v0 > 2e6 && p.ind === 'music') news('Music', `${p.name} release "${r.t}"; it is everywhere within a week.`, { person: p.id }); }
    else if (S.week - (p.lastWork || 0) > ACT_QUIET[p.ind]) p.fans *= .985; }
}
{ const _t = tick; tick = function () { const r = _t.apply(this, arguments); if (S.actsOn && !S.archiving) actsWeek(); return r; }; }
// every year: new acts arrive, some stop
function actsYear() {
  ACT_SEEN = null; if (!S.actsOn) return; R = wstream('acts', 'year', S.year);
  for (const h of HUB_IDS) { const L = mediaFigures(h); L.forEach((x, i) => { if (x.pid == null && x.from <= S.year) { const p = actMake(x, h, i); if (p.fans > 2e5) news('Music', `${p.name} arrive${ACT_GROUP.has(p.act) ? '' : 's'}: the ${(KIND_LABEL[p.act] || p.act).toLowerCase()} everyone in ${HUBS[h].name} is suddenly talking about.`, { person: p.id }); } });
    for (const x of L) { const p = x.pid != null ? P(x.pid) : null; if (p && !p.retired && x.to && x.to < S.year) { p.retired = true; p.retY = S.year; if (p.fans > 1e6) news('Music', `${p.name} ${ACT_GROUP.has(p.act) ? 'split up' : 'stop'} after ${S.year - p.mfrom} years.`, { person: p.id }); } } }
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); actsYear(); return r; }; }

// ---- the charts read the real releases ----
{ const _ca = chartAt; chartAt = function (field, hub, w, n = 100) {
  if (!S.actsOn || w < (S.actsW0 || 0) - 40) return _ca.apply(this, arguments);
  const all = mediaFigures(hub), out = [];
  for (let i = 0; i < all.length; i++) { const x = all[i]; if (x.field !== field || x.pid == null) continue; const p = P(x.pid); if (!p || !p.rel || !p.rel.length) continue;
    let best = null, bu = 0; for (let k = 0; k < p.rel.length; k++) { const u = actUnits(p, p.rel[k], w); if (u > bu) { bu = u; best = k; } }
    if (best !== null && bu >= 1) out.push({ name: p.name, by: p.act, score: bu, title: p.rel[best].t, fid: `${hub}~${i}`, pid: p.id, rk: best, rw: p.rel[best].w }); }
  const mine = _ca.call(this, field, hub, w, n).filter(c => c.mine); out.push(...mine);
  return out.sort((a, b) => b.score - a.score).slice(0, n);
}; }
function relLink(c) { return `<a href="#" class="lk" data-go="mrel:${c.pid}~${c.rw}">${esc(c.title)}</a>`; }
function actRel(pid, w) { const p = P(pid); return p && (p.rel || []).find(r => r.w === +w) || null; }
// ---- pages: the act is a person; a release has its own page ----
{ const _vp = viewPerson; viewPerson = function (id) { const h = _vp.apply(this, arguments), p = P(+id); return p && p.ind ? h + actSection(p) : h; }; }
function actSection(p) {
  const lab = p.label != null && typeof mcoLink === 'function' ? mcoLink(p.label) : '', aw = (typeof figAwards === 'function' ? figAwards(p.name) : []);
  const unit = { music: 'streams', creator: 'views', podcast: 'downloads', stage: 'tickets' }[p.ind] || 'plays';
  const rel = (p.rel || []).slice().reverse(), fmtN = v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'k' : Math.round(v);
  return `<section class="panel"><h3>${esc(FIELD_LABEL[p.ind] || p.ind)}: ${esc(KIND_LABEL[p.act] || p.act)}${p.legend ? ' · a legend of the form' : ''}</h3>
    <p>${p.members ? `${esc(p.members.join(', '))}. ` : ''}Active since ${p.mfrom}${p.retired ? `, until ${p.retY || p.mto || '—'}` : ''}. <b>${fmtN(p.fans)}</b> fans${lab ? ` · ${lab}` : ''}. ${(p.discN || 0).toLocaleString()} ${p.ind === 'creator' ? 'videos' : p.ind === 'podcast' ? 'seasons' : p.ind === 'stage' ? 'productions' : 'releases'} in all.</p>
    <h4>Latest</h4><ul class="plain">${rel.map(r => `<li>${relLink({ pid: p.id, rw: r.w, title: r.t })} <span class="muted small">${esc(r.kind)} · ${fmtDate(r.w, true)} · quality ${r.q} · ${fmtN(r.v0 / (1 - ACT_DECAY[p.ind]))} ${unit}</span></li>`).join('') || '<li class="muted">Nothing recent.</li>'}</ul>
    ${aw.length ? `<h4>Awards</h4><ul class="plain">${aw.map(a => `<li>🏆 ${esc(a.show)} ${a.y}: ${esc(a.c)}</li>`).join('')}</ul>` : ''}</section>`;
}
function viewRelease(id) {
  const [pid, w] = String(id).split('~'), p = P(+pid), r = actRel(pid, w); if (!p || !r) return '<p class="muted">Not found.</p>';
  const unit = { music: 'streams', creator: 'views', podcast: 'downloads', stage: 'tickets sold' }[p.ind] || 'plays', tot = r.v0 / (1 - ACT_DECAY[p.ind]), now = actUnits(p, r, S.week);
  const hr = hashRand(p.id * 131 + r.w), pool = S.people.filter(x => !x.dead && x.hub === p.hub && !x.ind && (x.role === 'composer' || x.role === 'sound' || x.role === 'producer'));
  const crew = pool.length ? [...new Set([0, 1].map(() => pool[Math.floor(hr() * pool.length)].id))] : [];
  const wk = Array.from({ length: 16 }, (_, i) => actUnits(p, r, r.w + i)), mx = Math.max(1, ...wk);
  return `<div class="head"><p class="eyebrow">${esc(FIELD_LABEL[p.ind] || '')} · ${esc(r.kind)} · ${fmtDate(r.w, true)}</p><h2>${esc(r.t)}</h2><p class="lede">By ${pl(p.id)}${p.label != null && typeof mcoLink === 'function' ? ` · ${mcoLink(p.label)}` : ''}.</p></div>
   <div class="kpis mini"><div><span>Quality</span><b>${r.q}</b></div><div><span>${unit}, first week</span><b>${Math.round(r.v0).toLocaleString()}</b></div><div><span>${unit}, so far</span><b>${Math.round(Math.min(tot, tot - now / (1 - ACT_DECAY[p.ind]))).toLocaleString()}</b></div></div>
   <section class="panel"><h3>Week by week</h3><svg viewBox="0 0 320 62" width="100%" height="90" preserveAspectRatio="none">${wk.map((v, i) => `<rect x="${i * 20}" y="${60 - v / mx * 56}" width="16" height="${v / mx * 56}" fill="var(--accent)"/>`).join('')}</svg></section>
   ${crew.length && p.ind === 'music' ? `<section class="panel"><h3>Credits</h3><p>Written by ${pl(p.id)}, with ${crew.map(pl).join(' and ')}.</p></section>` : ''}`;
}
{ const _ve = viewExtra; viewExtra = function (cur) { if (cur.kind === 'mrel') return viewRelease(cur.id); return _ve.apply(this, arguments); }; }
// links to an act go to the person
{ const _fl = figLink; figLink = function (x, label) { if (x && x.pid != null && P(x.pid)) return `<a href="#" class="lk" data-go="person:${x.pid}">${esc(label || x.name)}</a>`; return _fl.apply(this, arguments); }; }
{ const _vf = viewFigure; viewFigure = function (id) { const x = figAt(id); return x && x.pid != null && P(x.pid) ? viewPerson(x.pid) : _vf.apply(this, arguments); }; }
// people who are acts say so wherever an occupation is shown
if (typeof occupationOf === 'function') { const _oc = occupationOf; occupationOf = function (p) { return p && p.ind ? `${KIND_LABEL[p.act] || p.act} (${(FIELD_LABEL[p.ind] || p.ind).toLowerCase()})` : _oc.apply(this, arguments); }; }
// the legends are real people under other names: nothing bad happens to them
if (typeof realLiving === 'function') { const _rl = realLiving; realLiving = function (p) { return _rl.apply(this, arguments) || !!(p && p.legend && !p.dead); }; }

// ---- awards from the year's best work ----
{ const _ma = mediaAwardsWeek; mediaAwardsWeek = function () {
  const M = S.me; if (!S.actsOn || !M || dateOf(S.week).getUTCMonth() !== 0 || M.mAwY === S.year) return _ma.apply(this, arguments);
  const n0 = (S.mawards || []).length, r = _ma.apply(this, arguments), y = S.year - 1;
  for (let i = n0; i < (S.mawards || []).length; i++) {
    const A = S.mawards[i], f = Object.keys(MEDIA_AWARDS).find(k => MEDIA_AWARDS[k][0] === A.show); if (!f) continue;
    const hubs = HUB_IDS.filter(h => h === M.hub || HUBS[h].m === HUBS[M.hub].m || HUBS[h].m === 'US');
    const cand = []; for (const h of hubs) for (const x of mediaFigures(h)) { const p = x.pid != null ? P(x.pid) : null; if (!p || p.ind !== f) continue; for (const rl of p.rel || []) if (yearOf(rl.w) === y) cand.push([p, rl, rl.q * Math.log10(10 + rl.v0 / (1 - ACT_DECAY[f]))]); }
    if (!cand.length) continue; cand.sort((a, b) => b[2] - a[2]);
    A.w = A.w.map(([c, n], k) => { if (/you|, for /i.test(n) && n.includes(ME().name)) return [c, n];
      const L = (/New/.test(c) ? cand.filter(([p]) => p.mfrom >= y - 2) : cand).slice(0, 5); if (!L.length) return [c, n];
      const hr = hashRand(y * 977 + k * 31 + f.length)(), win = L[Math.min(L.length - 1, hr < .55 ? 0 : hr < .8 ? 1 : 2)], [p, rl] = win;
      p.awards = p.awards || []; p.awards.push(`${A.show} ${y}: ${c}`); p.fans *= 1.15; p.fame = actFame(p.fans);
      A.nom = A.nom || {}; A.nom[c] = L.map(([q]) => q.id);
      return [c, /Artist|Creator|Show|Performance/.test(c) ? p.name : `${rl.t} (${p.name})`]; });
  }
  return r; }; }

// ---- if you work in the field, you meet them ----
WEEK_HOOKS.push(() => { const M = S.me; if (!S.actsOn || !M || !M.party || !M.party.done || S.week % 5 !== 2 || prnd() > .35) return;
  const f = { music: 'music', creator: 'creator', podcast: 'podcast', stage: 'stage' }[M.field] || (ME().role === 'composer' ? 'music' : null); if (!f) return;
  const L = mediaFigures(M.hub).map(x => x.pid != null ? P(x.pid) : null).filter(p => p && p.ind === f && !p.dead && !p.retired && !M.known[p.id]); if (!L.length) return;
  const p = L[Math.floor(prnd() * L.length)]; meet(p.id, pickLine(['At a gig', 'Backstage', 'In a green room', 'At a session', 'At a showcase'], S.week), 4); diary(`You meet ${p.name} (${(KIND_LABEL[p.act] || p.act).toLowerCase()}).`); });
// how much of each world there is (the loading screen and the almanac)
function worldsCount() {
  const out = { acts: 0, music: 0, creator: 0, podcast: 0, stage: 0, rel: 0 };
  if (S.actsOn) for (const h of HUB_IDS) for (const x of (S.mfig && S.mfig[h]) || []) { const p = x.pid != null ? P(x.pid) : null; if (!p) continue; out.acts++; out[p.ind] = (out[p.ind] || 0) + 1; out.rel += p.discN || 0; }
  out.shows = typeof tvAll === 'function' ? tvAll().length : 0;
  return out;
}
// the loading line: everything being made, not only films (the acts arrive at the end of the build)
function worldTally() {
  const y = S.archY || S.year, n = v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e4 ? Math.round(v / 1e3) + 'k' : Math.round(v).toLocaleString();
  const shows = typeof TV_NETS !== 'undefined' ? Object.values(TV_NETS).reduce((t, net) => t + Math.max(0, Math.min(y, S.year) - Math.max(net.orig, 1946)) * net.per, 0) : 0;
  const rec = Math.max(0, y - 1950) * 2600, pods = Math.max(0, y - 2005) * 900, vids = Math.max(0, y - 2006) * 40000, plays = Math.max(0, y - 1900) * 120;
  return [`${n(S.films.length)} films`, `${n(S.people.length)} people`, `${n(S.companies.length)} studios`, shows ? `${n(shows)} TV shows` : '', rec ? `${n(rec)} records` : '', plays ? `${n(plays)} stage productions` : '', pods ? `${n(pods)} podcast seasons` : '', vids ? `${n(vids)} videos` : ''].filter(Boolean).join(' · ');
}
