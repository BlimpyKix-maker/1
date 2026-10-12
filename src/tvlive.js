// ================= Live television: shows on air are made by their people and renewed on their numbers =================
// Round 20. Television history before the world starts stays as it was generated. From the first year of play,
// every show on air (and every new one) gets its quality from its people (the creator's writing, the cast's acting,
// the director, the showrunner's producing), and each spring its network decides on another season from last
// season's audience against the channel's bar, the reviews and the cost of an ageing show. Renewal rates follow the
// research (broadcast about 70%, streaming under 50%); a streamer in a profit pivot cancels more. The TV awards for
// those years go on merit, and the winners' standing and fame move as a film prize moves them.
const TVL_RENEW = { broadcast: .72, public: .75, cable: .62, premium: .6, streaming: .48, kids: .7 };
const TVL_LONG = new Set(['soap', 'talk', 'serial', 'reality', 'kids']);   // formats that run for years without tiring
function tvlOn() { return !!S.tvl; }
function tvlSkill(id, c) { const p = id != null ? P(id) : null; return p && p.c ? p.c[c] || 8 : 8; }
function tvlQ(s) {
  const P1 = tvPeople(s), cast = P1.cast.length ? P1.cast.reduce((t, id) => t + tvlSkill(id, 'act'), 0) / P1.cast.length : 10;
  const base = tvlSkill(P1.creator != null ? P1.creator : P1.showrunner, 'wri') * .35 + cast * .3 + (P1.dirs.length ? tvlSkill(P1.dirs[0], 'dir') : 10) * .15 + tvlSkill(P1.showrunner, 'pro') * .2;
  return clamp(Math.round(60 + (base - TVL_MID) * 6 + gauss() * 7), 10, 97);
}
const TVL_MID = 8.8;   // the people-score of an ordinary working team; probe-checked so live quality averages near the old 60
function tvlInit() {
  if (S.tvl || typeof tvAll !== 'function') return;
  const prev = R; R = wstream('tvlive', 'seed', S.seed | 0);
  try { S.tvl = {}; for (const s of tvAll()) if (!s.legend && !s.mine && s.y <= S.year && s.last >= S.year) S.tvl[s.id] = [S.year - s.y + 1, 0, tvlQ(s)]; }
  finally { R = prev; }
}
{ const _fw = finishWarm; finishWarm = function () { const r = _fw.apply(this, arguments); tvlInit(); return r; }; }
// the generated list, with the live shows' real seasons and quality laid over it
{ const _ta = tvAll; tvAll = function () { const out = _ta.apply(this, arguments); if (S.tvl) { const B = archive().tvById; for (const id in S.tvl) { const s = B[id], e = S.tvl[id]; if (!s) continue; s.q = e[2]; s.seasons = e[0]; s.last = s.y + e[0] - 1; s.live = 1; } } return out; }; }

function tvlYear() {
  if (!S.tvl) return; R = wstream('tvlive', S.year);
  const all = tvAll(), B = archive().tvById, y = S.year - 1;
  for (const id in S.tvl) { const e = S.tvl[id], s = B[id]; if (e[1] || !s || s.y + e[0] - 1 !== y) continue;
    const net = TV_NETS[s.net], G = TV_GENRES[s.g], svc = typeof svcOf === 'function' ? svcOf(s.net) : null;
    if (!net || G.one || (svc && svc.closed)) { e[1] = 1; continue; }
    const v = tvViewers(s, e[0]), bar = netBaseViewers(net.kind, y) * .55;
    let p = (TVL_RENEW[net.kind] || .65) + clamp(v / Math.max(.05, bar) - 1, -1, 1.5) * .3 + (e[2] - 60) / 150 - (TVL_LONG.has(s.g) ? 0 : Math.max(0, e[0] - 4) * .06);
    if (svc) p += svc.mood === 'profit pivot' ? -.12 : svc.mood === 'land grab' ? .08 : 0;
    if (rnd() < clamp(p, .04, .97)) { e[0]++; e[2] = clamp(Math.round(e[2] + gauss() * 4 - (e[0] > 6 ? 1.5 : 0)), 10, 97);
      if (e[0] === 2 && e[2] >= 82) news('Television', `${net.name} renews ${s.title} early: the critics call it the best new show of the year.`, {}); }
    else { e[1] = 1; if (e[0] >= 5 || v > bar * 1.3) news('Television', e[0] >= 5 ? `${net.name} ends ${s.title} after ${e[0]} seasons${v > bar * 1.3 ? ', still drawing ' + v.toFixed(1) + 'M viewers: it had grown too expensive' : ''}.` : `${net.name} cancels ${s.title} after ${e[0]} season${e[0] > 1 ? 's' : ''} despite ${v.toFixed(1)}M viewers: the reviews were not there.`, {});
      else if (e[0] === 1 && svc) news('Television', `${net.name} cancels ${s.title} after one season. Its fans start a petition.`, {}); }
  }
  for (const s of all) if (s.y === S.year && !s.legend && !s.mine && !S.tvl[s.id]) S.tvl[s.id] = [1, 0, tvlQ(s)];
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); if (!S.archiving) tvlYear(); return r; }; }

// ---- the awards for the live years go on merit, and they count ----
{ const _te = tvEmmets; tvEmmets = function (y) {
  if (!S.tvl || y < (S.startYear || S.year)) return _te.apply(this, arguments);
  const A = archive(), key = 'tve:' + y; if (A[key] && A[key].length) return A[key];
  if (y > S.year || (y === S.year && dateOf(S.week).getUTCMonth() < 8)) return [];
  const air = tvAll().filter(s => s.m === 'US' && tvOnAir(s, y)), out = [];
  for (const [cat, gs, who] of TV_CATS) {
    const L = air.filter(s => gs.includes(s.g)).map(s => { const k = Math.min(s.seasons, y - s.y + 1), bar = netBaseViewers(TV_NETS[s.net].kind, y) * .55; return [s, s.q + clamp(tvViewers(s, k) / Math.max(.05, bar), 0, 3) * 4 + (s.legend ? -12 : 0) + hashRand(s.seed + y * 7 + cat.length)() * 10]; }).sort((a, b) => b[1] - a[1]);
    if (!L.length) continue; const s = L[0][0], P1 = tvPeople(s);
    out.push({ cat, show: s.id, person: who === 'cast' ? P1.cast[0] : who === 'cast2' ? (P1.cast[1] ?? P1.cast[0]) : who === 'creator' ? P1.creator : who === 'dir' ? P1.dirs[0] : null, noms: L.slice(1, 5).map(x => x[0].id) });
  }
  return A[key] = out;
}; }
function tvlAwards() {
  if (!S.tvl || S.tveDone === S.year || dateOf(S.week).getUTCMonth() < 8) return; S.tveDone = S.year;
  const L = tvEmmets(S.year); let top = null;
  for (const e of L) { const s = tvShow(e.show); if (!s) continue; const P1 = tvPeople(s), ids = e.person != null ? [e.person] : [P1.creator != null ? P1.creator : P1.showrunner].filter(x => x != null);
    for (const id of ids) { const p = P(id); if (!p || p.dead) continue; (p.awards = p.awards || []).push(`Emmet, ${e.cat} ${S.year}`); p.standing = clamp(p.standing + 5, 0, 100); p.fame = clamp(p.fame + 4, 0, 100); }
    if (e.cat === 'Outstanding Drama Series') top = s; }
  if (top) news('Awards', `${top.title} wins the Emmet for Outstanding Drama Series.`, {});
}
{ const _m = monthly; monthly = function () { const r = _m.apply(this, arguments); if (!S.archiving) tvlAwards(); return r; }; }
