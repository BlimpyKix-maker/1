// ---------------- Television as an industry: rooms, crews, seasons and a ladder ----------------
// Every show has a full writers' room (ranked, from staff writer to co-EP) and a crew (cinematographer, editor,
// composer, casting director). Shows that start during your career are cast and staffed from the people alive and
// working that year, breakouts from the shorts scene first, so new talent turns up on television.
// The year follows the network calendar: pilot season (Feb–Apr, extra pilot jobs), upfronts (May: renewals and
// cancellations, and your own invitation back), fall premieres (Sep: pilots you worked on that went to series), back-
// nine orders (Oct), mid-season replacements (Jan). In the room you climb: PA → staff writer → story editor → co-EP →
// showrunner, one season at a time, and each season a writer gets an episode of their own. Credits pay residuals, and a
// show that reaches syndication pays a lump sum. Shows that do well lift their stars.
const TV_CAL = [
  ['Mid-season', 'Replacements premiere in the slots of cancelled fall shows.'], ['Pilot season', 'Networks cast and shoot pilots. Pilot jobs everywhere.'], ['Pilot season', 'Networks cast and shoot pilots. Pilot jobs everywhere.'], ['Pilot season', 'The last pilots shoot; testing begins.'],
  ['Upfronts', 'Renewals, cancellations and new series orders, announced to advertisers.'], ['Rooms open', 'Writers\' rooms staff up and break the new season.'], ['Production', 'Shooting the fall season.'], ['Production', 'Shooting the fall season.'],
  ['Fall premieres', 'New shows launch; the Emmets are handed out.'], ['Back-nine', 'Promising new shows get the rest of their season ordered.'], ['Sweeps', 'Ratings month: stunts, weddings, cliffhangers.'], ['Hiatus', 'Holiday break; the bubble shows sweat.']
];
const TV_ROOM = ['Staff writer', 'Staff writer', 'Story editor', 'Producer', 'Co-executive producer'];
const TV_LADDER = ['tv_writerspa', 'tv_staffwriter', 'tv_storyed', 'tv_coep', 'tv_showrunner'], TV_ACT_LADDER = ['tv_guest', 'tv_recurring', 'tv_regular'];
// crew pools from the people who existed when television was first built (the same frozen world as the casts)
function tvCrewPools() {
  const A = archive(); if (A.tvCrewPools) return A.tvCrewPools; if (!S.tvN) tvPools();
  const P0 = {}; for (const p of S.people.slice(0, S.tvN)) { if (!['dp', 'editor', 'composer', 'casting', 'writer'].includes(p.role)) continue; const m = (HUBS[p.hub] || {}).m || 'US'; ((P0[m] = P0[m] || {})[p.role] = P0[m][p.role] || []).push(p.id); }
  return A.tvCrewPools = P0;
}
function tvPickCrew(r, m, role, y) { const L = ((tvCrewPools()[m] || tvCrewPools().US || {})[role]) || []; for (let k = 0; k < 10 && L.length; k++) { const id = L[Math.floor(r() * L.length)], p = P(id); if (p && !p.player && p.born <= y - 22 && p.born >= y - 72) return id; } return null; }
const TV_NOROOM = ['reality', 'doc', 'talk', 'variety'];
{ const _tp = tvPeople;
  tvPeople = function (s) {
    const P1 = _tp(s); if (s.mine) return P1;
    const live = S.tvPpl && S.tvPpl[s.id]; if (live && !P1.live) Object.assign(P1, live, { live: 1 });
    if (!P1.room) { const r = hashRand((s.seed || 1) + 99), m = s.m, room = [];
      if (!TV_NOROOM.includes(s.g)) { const n = 3 + Math.floor(r() * 4); for (let k = 0; k < n; k++) { const id = tvPickCrew(r, m, 'writer', s.y); if (id !== null && id !== P1.creator && id !== P1.showrunner && !room.some(x => x.id === id)) room.push({ id, rank: TV_ROOM[Math.min(TV_ROOM.length - 1, n - 1 - k)] }); } }
      P1.room = room.reverse(); P1.crew = { dp: tvPickCrew(r, m, 'dp', s.y), ed: tvPickCrew(r, m, 'editor', s.y), mus: tvPickCrew(r, m, 'composer', s.y), cst: tvPickCrew(r, m, 'casting', s.y) }; }
    return P1;
  };
}
// new shows are staffed from the living, breakouts first
let TV_LP = null;
function tvLivePools() { const P0 = {}; for (const p of S.people) { if (p.dead || p.retired || p.player || S.year - p.born < 20 || S.year - p.born > 72) continue; const m = (HUBS[p.hub] || {}).m || 'US'; ((P0[m] = P0[m] || {})[p.role] = P0[m][p.role] || []).push(p); } return P0; }
function tvLivePick(m, role, y, r, taken, pref) {
  const L = (((TV_LP || {})[m] || {})[role] || []).filter(p => !taken.has(p.id));
  if (!L.length) return null;
  const br = (S.sc && S.sc.broke) || {}, sc = p => (pref === 'young' ? -Math.abs(S.year - p.born - 30) : p.standing * .6) + (br[p.id] ? 25 : 0) + r() * 35;
  let best = null, bs = -1e9; for (const p of L) { const v = sc(p); if (v > bs) { bs = v; best = p; } }
  taken.add(best.id); return best.id;
}
function tvLiveWeek() {
  S.tvPpl = S.tvPpl || {}; if (S.tvLiveFrom === undefined) S.tvLiveFrom = S.year;
  const todo = tvAll().filter(s => s.y >= S.tvLiveFrom && !s.legend && !S.tvPpl[s.id]).slice(0, 30); if (!todo.length) return;
  TV_LP = tvLivePools();
  for (const s of todo) {
    const r = hashRand((s.seed || 1) + 7), m = s.m, taken = new Set(), noroom = TV_NOROOM.includes(s.g);
    const creator = tvLivePick(m, 'writer', s.y, r, taken), showrunner = r() < .6 ? creator : tvLivePick(m, r() < .5 ? 'writer' : 'producer', s.y, r, taken);
    const cast = []; for (let k = 0, n = noroom ? 1 : 3 + Math.floor(r() * 4); k < n; k++) { const id = tvLivePick(m, 'actor', s.y, r, taken, k >= 2 ? 'young' : null); if (id !== null) cast.push(id); }
    const dirs = []; for (let k = 0; k < 3; k++) { const id = tvLivePick(m, 'director', s.y, r, taken); if (id !== null) dirs.push(id); }
    const room = []; if (!noroom) for (let k = 0, n = 3 + Math.floor(r() * 4); k < n; k++) { const id = tvLivePick(m, 'writer', s.y, r, taken, k >= 2 ? 'young' : null); if (id !== null) room.push({ id, rank: TV_ROOM[Math.min(TV_ROOM.length - 1, n - 1 - k)] }); }
    room.reverse();
    const crew = { dp: tvLivePick(m, 'dp', s.y, r, taken), ed: tvLivePick(m, 'editor', s.y, r, taken), mus: tvLivePick(m, 'composer', s.y, r, taken), cst: tvLivePick(m, 'casting', s.y, r, taken) };
    S.tvPpl[s.id] = { creator, showrunner, cast, dirs, room, crew };
    for (const id of [...cast, ...room.map(x => x.id)]) { const p = P(id); if (p) p.standing = clamp(p.standing + .5, 0, 100); }
  }
  TV_LP = null; const A = archive(); delete A.tvByP;
}
{ tvCreditsOf = function (pid) {
    const A = archive(); if (!A.tvByP) { const m = {}; const add = (id, sid, r) => { if (id !== null && id !== undefined) (m[id] = m[id] || []).push([sid, r]); };
      for (const s of tvAll()) { const P1 = tvPeople(s); add(P1.creator, s.id, 'creator'); if (P1.showrunner !== P1.creator) add(P1.showrunner, s.id, 'showrunner'); for (const c of P1.cast) add(c, s.id, 'cast'); for (const c of P1.dirs) add(c, s.id, 'director'); for (const w of P1.room || []) add(w.id, s.id, w.rank.toLowerCase()); const C = P1.crew || {}; add(C.dp, s.id, 'cinematographer'); add(C.ed, s.id, 'editor'); add(C.mus, s.id, 'composer'); add(C.cst, s.id, 'casting'); }
      A.tvByP = m; }
    return A.tvByP[pid] || [];
  }; }
// ---- the calendar ----
function tvSeasonWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return;
  tvLiveWeek();
  const d = dateOf(S.week), mo = d.getUTCMonth(), first = d.getUTCDate() <= 7; M.tvH = M.tvH || {};
  const mkt = (HUBS[M.hub] || {}).m || 'US';
  // your episode
  for (const j of M.jobs.filter(j => j.show && TV_LADDER.indexOf(j.k) >= 1)) { const key = j.show + ':' + S.year; if ((M.tvEpY || {})[key] || S.week - j.started < 3 || pending().some(it => it.kind === 'tvep')) continue; (M.tvEpY = M.tvEpY || {})[key] = 1; const s = tvShow(j.show); if (!s) continue;
    inbox('tvep', `Your episode of ${s.title}`, `The showrunner gives you an episode of ${s.title} to write. Your name on the screen: "Written by". The room will break it with you; the draft is yours.`, { show: j.show, job: j.id, choices: [{ k: 'bold', label: `Pitch something they haven't done · ${checkLabel('struc', 13)}`, check: ['struc', 13] }, { k: 'safe', label: `Nail the show's voice · ${checkLabel('dial', 10)}`, check: ['dial', 10] }, { k: 'share', label: 'Co-write it with the showrunner' }] }); }
  if (!first) return;
  if (M.tvCalM === S.year * 12 + mo) return; M.tvCalM = S.year * 12 + mo;
  if (mo === 1 && careerLevel() >= 2) inbox('note', 'Pilot season', 'Every network is casting and staffing its pilots for the next three months. Expect more television on the board, most of it short jobs on shows that may never air.');
  if (mo === 4) tvUpfronts();
  if (mo === 8) tvPremieres();
  if (mo === 9) { const L = tvAll().filter(s => s.y === S.year && s.m === mkt && TV_NETS[s.net].kind === 'broadcast' && s.seasons >= 2).slice(0, 2); for (const s of L) news('Television', `${TV_NETS[s.net].name} orders the back nine of ${s.title}.`, {});
    for (const j of M.jobs.filter(j => j.show && L.some(s => s.id === j.show))) { j.weeks += 9; inbox('note', `${tvShow(j.show).title} gets its back nine`, 'Nine more episodes ordered. Your job runs nine weeks longer.'); } }
  if (mo === 0 || mo === 3 || mo === 6 || mo === 9) tvResiduals();
  if (mo === 4) tvStars();
}
// May: who comes back, and do you
function tvUpfronts() {
  const M = S.me, me = ME();
  for (const [sid, h] of Object.entries(M.tvH)) {
    if (h.y < S.year - 1 || h.upY === S.year) continue; h.upY = S.year; const s = tvShow(sid); if (!s) continue;
    if (s.last >= S.year + 1) {
      const L = h.act ? TV_ACT_LADDER : TV_LADDER, i = L.indexOf(h.k), up = (h.score >= 1.5 || h.seasons >= 2) && i >= 0 && i < L.length - 1 && L[i + 1] !== 'tv_showrunner' ? L[i + 1] : h.k, t = ODD_BY[up]; if (!t) continue;
      const p = makePost(t, null); Object.assign(p, { t: `${t.t}, ${s.title} (${TV_NETS[s.net].name})`, show: s.id, mco: TV_NETS[s.net].name, rate: Math.round(Math.max(p.rate, (h.rate || p.rate) * 1.1)), head: tvPeople(s).showrunner, ret: 1 });
      inbox('offer', up !== h.k ? `${s.title} is renewed, and you're moving up` : `${s.title} is renewed: back for another season?`, `${TV_NETS[s.net].name} renews ${s.title}. ${up !== h.k ? `They want you back as ${t.t.toLowerCase()}.` : `Same job, a little more money.`} ${fmtCash(p.rate)} a day.`, { post: p, choices: [{ k: 'yes', label: 'Sign on' }, { k: 'no', label: 'Move on' }] });
    } else if (s.last === S.year) inbox('note', `${s.title} is cancelled`, `The upfronts come and go and ${s.title} isn't on the schedule. The room scatters. Your credit stays.`);
  }
}
// September: pilots you shot that went to series
function tvPremieres() {
  const M = S.me;
  for (const pz of (M.pilots || []).filter(x => x.y === S.year && !x.told)) { pz.told = 1;
    if (!pz.show) { inbox('note', `${pz.title} isn't picked up`, `The pilot of ${pz.title} doesn't make the fall schedule. Most don't. It was paid work, and the people on it will remember you.`); continue; }
    const s = tvShow(pz.show), t = ODD_BY[pz.k]; if (!s || !t) continue; const p = makePost(t, null); Object.assign(p, { t: `${t.t}, ${s.title} (${TV_NETS[s.net].name})`, show: s.id, mco: TV_NETS[s.net].name, head: tvPeople(s).showrunner });
    inbox('offer', `${s.title} goes to series`, `The pilot you worked on, ${s.title}, premieres this fall, and they want you for the season.`, { post: p, choices: [{ k: 'yes', label: 'Sign on for the season' }, { k: 'no', label: 'Pass' }] }); }
}
function tvResiduals() {
  const M = S.me; let tot = 0; const lines = [];
  for (const [sid, h] of Object.entries(M.tvH)) { const s = tvShow(sid); if (!s) continue; const aired = Math.min(S.year, s.last) - s.y + 1; if (S.year - Math.min(S.year, s.last) > 10) continue;
    const tf = [1, 1, 1.6, 2.6, 4, 6][Math.min(5, h.tier || 1)], v = tvViewers(s, Math.max(1, aired)), pay = usd(Math.round(35 * h.seasons * tf * (1 + v / 6)));
    tot += pay; if (aired >= 5 && !h.synd) { h.synd = 1; const sy = usd(Math.round(1200 * h.seasons * tf)); tot += sy; lines.push(`${s.title} goes into syndication: ${fmtCash(sy)}`); news('Television', `${s.title} sells into syndication after ${aired} seasons.`, {}); } }
  if (!tot) return; M.cash += tot; (M.resLog = M.resLog || []).push({ w: S.week, amt: tot }); if (M.resLog.length > 20) M.resLog.shift();
  inbox('note', 'Residuals', `A cheque for ${fmtCash(tot)} in residuals from your television work.${lines.length ? ' ' + lines.join('. ') + '.' : ''}`);
}
// a hit lifts its people
function tvStars() {
  const on = tvAll().filter(s => tvOnAir(s, S.year) && !s.mine && (s.y >= S.year - 8)).map(s => [s, tvViewers(s, S.year - s.y + 1)]).sort((a, b) => b[1] - a[1]);
  for (const [s] of on.slice(0, Math.ceil(on.length * .12))) { const P1 = tvPeople(s); for (const id of [...P1.cast.slice(0, 3), P1.showrunner]) { const p = P(id); if (p && !p.dead) { p.fame = clamp((p.fame || 0) + 1.5, 0, 100); p.standing = clamp(p.standing + .8, 0, 100); } } }
}
// your history in television: every job, season by season
{ const _fj = finishJob;
  finishJob = function (j, L, quit) {
    const r = _fj.apply(this, arguments), M = S.me;
    if (j && j.show && !quit) { M.tvH = M.tvH || {}; const h = M.tvH[j.show] || (M.tvH[j.show] = { seasons: 0 }); const t = tmplOf(j) || {}; h.k = j.k; h.act = !!t.actor; h.tier = t.tier || 1; h.rate = j.rate; h.y = S.year; h.seasons++; h.score = j.score || 0; }
    if (j && j.pilot && !quit) (M.pilots = M.pilots || []).push({ show: j.show || null, title: j.pilotTitle || (j.show && tvShow(j.show) ? tvShow(j.show).title : 'the pilot'), k: j.pk, y: S.year });
    return r;
  };
}
// pilot season: more television on the board, half of it for shows that will never air
{ const _tp2 = tvPosts;
  tvPosts = function () {
    const out = _tp2(), M = S.me, mo = dateOf(S.week).getUTCMonth(); if (mo < 1 || mo > 3 || prnd() > .8) return out;
    const mkt = (HUBS[M.hub] || {}).m || 'US', fresh = tvAll().filter(s => s.y === S.year && s.m === mkt && !s.legend), L = tierLevel();
    const T = ['tv_regular', 'tv_guest', 'tv_staffwriter', 'tv_epdir', 'tv_storyed'].map(k => ODD_BY[k]).filter(t => t && t.tier <= L + 1);
    for (let i = 0; i < 2 && T.length; i++) { const t = T[Math.floor(prnd() * T.length)], real = fresh.length && prnd() < .5, s = real ? fresh[Math.floor(prnd() * fresh.length)] : null;
      const title = s ? s.title : tvTitle(['drama', 'sitcom', 'procedural'][Math.floor(prnd() * 3)], prnd, NAMES[(HUBS[M.hub] || HUBS.hollywood).lang] || NAMES.en), net = s ? TV_NETS[s.net] : Object.values(TV_NETS).filter(n => (HUBS[n.hub] || {}).m === mkt && n.founded <= S.year)[0];
      const k = t.k === 'tv_guest' ? 'tv_regular' : t.k, p = makePost(t, null);
      Object.assign(p, { t: `Pilot: ${t.k === 'tv_guest' ? 'Guest role' : t.t}, ${title}${net ? ` (${net.name})` : ''}`, show: s ? s.id : undefined, mco: net ? net.name : 'a network', pilot: 1, pilotTitle: title, pk: k, weeks: 3, head: s ? tvPeople(s).showrunner : null });
      out.push(p); }
    return out;
  };
}
function tvepPick(it, k) {
  if (it.kind !== 'tvep') return false; const M = S.me, me = ME(), s = tvShow(it.show), j = M.jobs.find(x => x.id === it.job); it.done = true;
  const season = s ? S.year - s.y + 1 : 1, title = s ? episodeTitles(s, Math.max(1, season), 20)[(hashRand(M.id + S.week)() * 20) | 0] : 'An episode';
  const credit = ok => { (M.tvEps = M.tvEps || []).push({ show: it.show, title, y: S.year, ok }); };
  if (k === 'share') { const sr = s && tvPeople(s).showrunner; if (sr !== null && sr !== undefined && P(sr)) addTie(me, P(sr), 6); credit(1); if (j) jobScore(j, .5, 'A co-written episode'); it.result = { t: `"${title}", written by you and the showrunner. They take the hard scenes; you learn how.` }; return true; }
  const ok = roll(k === 'bold' ? 'struc' : 'dial', k === 'bold' ? 13 : 10), r = M.lastRoll;
  if (ok) { credit(1); me.standing = clamp(me.standing + (k === 'bold' ? 1.2 : .6), 0, 100); if (j) jobScore(j, k === 'bold' ? 2 : 1, 'Your episode'); it.result = { ok, roll: r, t: k === 'bold' ? `"${title}" is the episode people talk about this season. Your name, on screen, alone.` : `"${title}": clean, funny in the right places, on time. The showrunner barely touches it.` }; }
  else { credit(0); if (j) jobScore(j, -.5, 'A rewritten episode'); it.result = { ok, roll: r, t: `"${title}" gets rewritten in the room. Your name stays on it; most of your words don't.` }; }
  return true;
}
// ---- pages ----
{ const _vs = viewTvShow;
  viewTvShow = function (id) {
    const h = _vs(id), s = tvShow(id); if (!s || s.mine) return h; const P1 = tvPeople(s), C = P1.crew || {};
    const x = `<div class="cols two"><section class="panel"><h3>The writers' room</h3>${(P1.room || []).length ? `<table class="grid small"><tbody>${P1.showrunner !== null ? `<tr><td>${pl(P1.showrunner)}</td><td>Showrunner</td></tr>` : ''}${P1.room.map(w => `<tr><td>${pl(w.id)}</td><td>${esc(w.rank)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted small">No writers\' room: this kind of show is produced, not written.</p>'}</section>
     <section class="panel"><h3>Crew</h3><table class="grid small"><tbody>${[['Cinematography', C.dp], ['Editing', C.ed], ['Music', C.mus], ['Casting', C.cst]].filter(([, id]) => id !== null && id !== undefined).map(([l, id]) => `<tr><td>${l}</td><td>${pl(id)}</td></tr>`).join('')}</tbody></table>
     ${P1.live ? '<p class="small muted">Staffed this year, from the people working now.</p>' : ''}</section></div>`;
    return h + x;
  };
}
function tvSeasonHTML() {
  const M = S.me, mo = dateOf(S.week).getUTCMonth(), mkt = (HUBS[M.hub] || {}).m || 'US', H = M.tvH || {};
  const strip = TV_CAL.map(([n, d], i) => `<div class="tvcal${i === mo ? ' on' : ''}" title="${esc(d)}"><b>${MON[i]}</b><span>${esc(n)}</span></div>`).join('');
  const air = tvAll().filter(s => s.m === mkt && tvOnAir(s, S.year)).map(s => [s, tvViewers(s, S.year - s.y + 1)]).sort((a, b) => b[1] - a[1]);
  const after = mo >= 4, fresh = air.filter(([s]) => s.y === S.year).slice(0, 10), bubble = air.filter(([s]) => s.y < S.year && s.last === S.year).slice(0, 8);
  const rank = (L, k) => L.map((x, i) => `<span class="ladder${x === k ? ' on' : ''}">${esc(ODD_BY[x] ? ODD_BY[x].t : x)}</span>`).join(' → ');
  const myRoom = Object.entries(H).sort((a, b) => b[1].y - a[1].y);
  return `<section class="panel"><h3>The television year</h3><div class="tvcals">${strip}</div><p class="small"><b>${esc(TV_CAL[mo][0])}:</b> ${esc(TV_CAL[mo][1])}</p></section>
   <section class="panel"><h3>Your television career</h3>
    <p class="small">Writers: ${rank(TV_LADDER, (myRoom.find(([, h]) => !h.act) || [, {}])[1].k)}</p><p class="small">Actors: ${rank(TV_ACT_LADDER, (myRoom.find(([, h]) => h.act) || [, {}])[1].k)}</p>
    ${myRoom.length ? `<table class="grid small"><thead><tr><th>Show</th><th>Last job</th><th class="n">Seasons</th><th>Status</th></tr></thead><tbody>${myRoom.map(([sid, h]) => { const s = tvShow(sid); return s ? `<tr><td>${tvLink(s)}</td><td>${esc((ODD_BY[h.k] || {}).t || '')}</td><td class="n">${h.seasons}</td><td class="small">${esc(tvStatus(s))}${h.synd ? ' · syndicated' : ''}</td></tr>` : ''; }).join('')}</tbody></table>` : '<p class="muted small">No television yet. TV jobs are on the board most weeks, and many more during pilot season.</p>'}
    ${(M.tvEps || []).length ? `<h4>Written by you</h4><ul class="plain small">${M.tvEps.slice(-10).reverse().map(e => { const s = tvShow(e.show); return `<li>"${esc(e.title)}" · ${s ? tvLink(s) : ''} (${e.y})${e.ok ? '' : ' <span class="muted">rewritten</span>'}</li>`; }).join('')}</ul>` : ''}
    ${(M.pilots || []).length ? `<h4>Pilots</h4><ul class="plain small">${M.pilots.slice(-8).reverse().map(p => `<li>${esc(p.title)} (${p.y}) · ${p.show ? (p.told ? 'went to series' : 'waiting for the fall schedule') : p.told ? 'not picked up' : 'waiting'}</li>`).join('')}</ul>` : ''}
    ${(M.resLog || []).length ? `<p class="small">Residuals so far: <b>${fmtCash(M.resLog.reduce((t, x) => t + x.amt, 0))}</b>.</p>` : ''}</section>
   <section class="panel"><h3>This season in ${esc(MARKETS[mkt] ? MARKETS[mkt].name : mkt)}</h3><div class="cols two"><div><h4>New this season</h4><ol class="small">${fresh.map(([s, v]) => `<li>${tvLink(s)} <span class="muted">${esc(TV_NETS[s.net].name)} · ${v.toFixed(1)}M</span></li>`).join('') || '<li class="muted">None yet.</li>'}</ol></div>
    <div><h4>${after ? 'Ending this year' : 'On the bubble'}</h4><ol class="small">${bubble.map(([s, v]) => `<li>${tvLink(s)} <span class="muted">${v.toFixed(1)}M${after ? ' · cancelled' : ''}</span></li>`).join('') || '<li class="muted">Nothing on the bubble.</li>'}</ol></div></div></section>`;
}
{ const _ta = tvApp;
  tvApp = function () {
    const t = UI.tvt, mineTab = t === 'season';
    if (mineTab) UI.tvt = 'nets'; const h = _ta(); if (mineTab) UI.tvt = t;
    const i = h.indexOf('<p class="bf-row">'), j = h.indexOf('</p>', i);
    let row = h.slice(i, j); if (mineTab) row = row.replace(/ on"/g, '"');
    row += `<button class="pill${mineTab ? ' on' : ''}" data-tvt="season">🗓️ The season</button>`;
    return `<div class="tvapp">${row}</p>${mineTab ? tvSeasonHTML() : h.slice(j + 4, h.lastIndexOf('</div>'))}</div>`;
  };
}
