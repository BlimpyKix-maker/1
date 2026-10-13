// ================= Crossovers: the fields feed each other =================
// Round 23. Musicians, podcasters, playwrights and creators are people in this world now, so the world can move them
// between fields the way the real business does. Once a year, on the world's dice:
//  - a hit song from a real act lands on a big film's soundtrack (the act gains fans; the film page names the song);
//  - a studio buys the film rights to an acclaimed play (cash out of the studio's books, news, the playwright's page);
//  - a network adapts a big podcast for television;
//  - a creator with a vast audience signs a first-look deal with a studio.
// Each move is recorded on the act (p.cross) and shown on their page.
function crossNote(p, y, t) { (p.cross = p.cross || []).push({ y, t }); if (p.cross.length > 12) p.cross.shift(); }
function crossYear() {
  if (!S.actsOn) return; const y = S.year - 1, prev = R; R = wstream('cross', y);
  try {
    const acts = f => S.people.filter(p => p && p.ind === f && !p.dead && !p.retired);
    // soundtracks: the year's biggest films and the songs of the moment
    const big = S.films.filter(f => f.rel !== null && yearOf(f.rel) === y && f.tier === 1 && !f.song).sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 12);
    const songs = acts('music').map(p => [p, (p.rel || []).filter(r => yearOf(r.w) >= y - 1 && !(p.cross || []).some(x => x.t.startsWith(`“${r.t}”`))).sort((a, b) => (b.cs || b.q) - (a.cs || a.q))[0]]).filter(x => x[1]).sort((a, b) => (b[1].cs || b[1].q) * Math.log10(b[0].fans) - (a[1].cs || a[1].q) * Math.log10(a[0].fans));
    let si = 0;
    for (const f of big) { if (rnd() > .4 || si >= songs.length) continue; const [p, r] = songs[si++]; f.song = { pid: p.id, t: r.t }; p.fans *= 1.08; crossNote(p, y, `“${r.t}” on the soundtrack of ${f.title}`);
      if (si <= 2) news('Music', `${p.name}'s “${r.t}” is everywhere again, thanks to ${f.title}.`, { person: p.id }); }
    // plays bought for the screen
    for (const p of acts('stage')) { const r = (p.rel || []).filter(r => yearOf(r.w) === y && (r.cs || 0) >= 82)[0]; if (!r || rnd() > .3) continue;
      const cos = S.companies.filter(c => c.closed === null && c.tier <= 2 && c.cash > 1 && c.owner === undefined); if (!cos.length) continue; const c = cos[Math.floor(rnd() * cos.length)], price = Math.round((.2 + rnd() * .6) * 10) / 10;
      c.cash -= price * .1; crossNote(p, y, `film rights to ${r.t} bought by ${c.name}`);
      news('Business', `${c.name} buys the film rights to ${p.name}'s ${r.t}, the hit of the season.`, { company: c.id }); }
    // podcasts into television
    for (const p of acts('podcast')) { if (p.fans < 3e6 || rnd() > .18 || (p.cross || []).some(x => /television/.test(x.t))) continue;
      const nets = Object.keys(TV_NETS).filter(k => TV_NETS[k].founded <= S.year && !(typeof svcOf === 'function' && svcOf(k) && svcOf(k).closed)); if (!nets.length) continue; const n = TV_NETS[nets[Math.floor(rnd() * nets.length)]];
      crossNote(p, y, `adapted for television by ${n.name}`); news('Television', `${n.name} orders a series based on the podcast ${p.name}.`, { person: p.id }); }
    // creators into film
    for (const p of acts('creator')) { if (p.fans < 2e7 || rnd() > .12 || (p.cross || []).some(x => /first-look/.test(x.t))) continue;
      const cos = S.companies.filter(c => c.closed === null && c.tier === 1 && c.owner === undefined); if (!cos.length) continue; const c = cos[Math.floor(rnd() * cos.length)];
      crossNote(p, y, `a first-look film deal with ${c.name}`); news('Business', `${p.name} signs a first-look deal with ${c.name}: ${Math.round(p.fans / 1e6)} million subscribers, one feature film.`, { person: p.id }); }
  } finally { R = prev; }
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); if (!S.archiving) crossYear(); return r; }; }
{ const _as = actSection; actSection = function (p) { const h = _as.apply(this, arguments); if (!p.cross || !p.cross.length) return h; return h + `<section class="panel"><h3>Across the business</h3><ul class="plain small">${p.cross.slice().reverse().map(x => `<li>${x.y}: ${esc(x.t)}</li>`).join('')}</ul></section>`; }; }
