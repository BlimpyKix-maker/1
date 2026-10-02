// ---------------- Every prize, every category, every year ----------------
// National ceremonies now hand out a full slate (film, direction, four acting prizes, both screenplays, every
// craft, animation, documentary, international, debut), worked out from the films that actually opened in that
// market that year. Music, theatre, podcast and creator awards have full histories with the performers and
// works of their day. Contests have past winners from the industry. Every winner links to the film, the people,
// the performer or the song; every table can be filtered by category and year and sorted.
const CER_CATS = [
  ['Best Film', f => [f.dir, f.prod], 0], ['Best Director', f => [f.dir], 1], ['Best Actor', f => leadOf(f, 'M', 0), 2], ['Best Actress', f => leadOf(f, 'F', 0), 3],
  ['Best Supporting Actor', f => leadOf(f, 'M', 1), 4], ['Best Supporting Actress', f => leadOf(f, 'F', 1), 5], ['Best Original Screenplay', f => f.wri || [], 6], ['Best Adapted Screenplay', f => f.wri || [], 7],
  ['Best Cinematography', f => [f.dp], 8], ['Best Editing', f => [f.ed], 9], ['Best Original Score', f => [crewOf(f, 'mus')], 10], ['Best Production Design', f => [crewOf(f, 'pd')], 11],
  ['Best Costume Design', f => [crewOf(f, 'cos')], 12], ['Best Makeup', f => [crewOf(f, 'mkp')], 13], ['Best Sound', f => [crewOf(f, 'snd')], 14], ['Best Visual Effects', f => [crewOf(f, 'vfx')], 15],
  ['Best Animated Film', f => [f.dir], 16, 'Animation'], ['Best Documentary', f => [f.dir], 17, 'Documentary'], ['Best Debut', f => [f.dir], 18]
];
const CER_ALIAS = { 'Best Film': ['Best Picture'], 'Best Director': ['Director', 'Directing'], 'Best Actor': ['Actor', 'Actor in a Leading Role'], 'Best Actress': ['Actress', 'Actress in a Leading Role'], 'Best Supporting Actor': ['Supporting Actor', 'Actor in a Supporting Role'], 'Best Supporting Actress': ['Supporting Actress', 'Actress in a Supporting Role'], 'Best Original Screenplay': ['Original Screenplay', 'Writing (Original Screenplay)'], 'Best Adapted Screenplay': ['Adapted Screenplay', 'Writing (Adapted Screenplay)'], 'Best Cinematography': ['Cinematography'], 'Best Editing': ['Film Editing'], 'Best Original Score': ['Original Score', 'Music (Original Score)'], 'Best Production Design': ['Production Design', 'Art Direction'], 'Best Costume Design': ['Costume Design'], 'Best Makeup': ['Makeup and Hairstyling', 'Makeup'], 'Best Sound': ['Sound', 'Sound Mixing'], 'Best Visual Effects': ['Visual Effects'], 'Best Animated Film': ['Animated Feature', 'Animated Feature Film'], 'Best Documentary': ['Documentary Feature', 'Documentary'] };
Object.assign(CER_ALIAS, { 'Best Original Song': ['Original Song', 'Music (Original Song)'], 'Best International Film': ['International Feature', 'Foreign Language Film', 'Honorary award (foreign film)', 'International Feature Film'] });
CER_ALIAS['Best Film'].push('Best Motion Picture', 'Outstanding Picture', 'Outstanding Motion Picture', 'Outstanding Production', 'Unique and Artistic Production');
CER_ALIAS['Best Editing'].push('Editing'); CER_ALIAS['Best Actress'].push('Best Actress (tie)', 'Actress (tie)'); CER_ALIAS['Best Actor'].push('Best Actor (tie)', 'Actor (tie)');
CER_ALIAS['Best Original Screenplay'].push('Screenplay', 'Story and Screenplay', 'Original Story', 'Writing (Story and Screenplay)'); CER_ALIAS['Best Adapted Screenplay'].push('Adaptation');
CER_ALIAS['Best Sound'].push('Sound Editing', 'Sound Effects Editing', 'Sound Effects'); CER_ALIAS['Best Director'].push('Comedy Direction', 'Dramatic Direction');
const CER_CANON = {}; for (const k in CER_ALIAS) for (const a of CER_ALIAS[k]) CER_CANON[a] = k;
const CER_START = { 'Best Supporting Actor': 1936, 'Best Supporting Actress': 1936, 'Best Original Screenplay': 1940, 'Best Adapted Screenplay': 1940, 'Best Cinematography': 1928, 'Best Editing': 1934, 'Best Original Score': 1934, 'Best Costume Design': 1948, 'Best Makeup': 1981, 'Best Sound': 1930, 'Best Visual Effects': 1940, 'Best Animated Film': 2001, 'Best Documentary': 1942, 'Best Debut': 1960 };
function leadOf(f, g, n) { const L = (f.cast || []).filter(id => P(id) && P(id).g === g); return L[n] !== undefined ? [L[n]] : []; }
function crewOf(f, k) { const c = f.crew || {}; return c[k] !== undefined ? c[k] : null; }
const MEDIA_CATS = {
  music: ['Record of the Year', 'Album of the Year', 'Song of the Year', 'Best New Artist', 'Best Pop Performance', 'Best Rock Album', 'Best Rap Album', 'Best Dance Recording', 'Best Live Act'],
  stage: ['Best New Play', 'Best Musical', 'Best Revival', 'Best Leading Performance', 'Best Supporting Performance', 'Best Direction', 'Best Design'],
  podcast: ['Podcast of the Year', 'Best New Show', 'Best Comedy Podcast', 'Best True Crime', 'Best Interview Show', 'Best Narrative Series'],
  creator: ['Creator of the Year', 'Breakout Creator', 'Best Short-form', 'Best Series', 'Best Educational Channel', 'Best Collab']
};
const AW2 = new Map();
function awKey(b) { return b.id + ':' + S.films.length + ':' + S.year + ':' + (S.awards || []).length + ':' + (S.mawards || []).length; }
function debutOf(f) { const d = P(f.dir); if (!d || !d.credits) return false; const first = d.credits.map(i => S.films[i]).filter(x => x && x.rel !== null).sort((a, b) => a.rel - b.rel)[0]; return first && first.id === f.id; }
function ceremonyRecord(b) {
  const out = [], by = typeof filmsByYear === 'function' ? filmsByYear() : {}, rec = (typeof filmAwardIndex === 'function' ? filmAwardIndex()[b.key] : null) || [];
  const y0 = Math.max(b.founded || 1929, 1929);
  for (let y = S.year - 1; y >= y0; y--) {
    const pool = (by[y] || []).filter(f => f.m === b.m && f.q !== null && f.q !== undefined); if (!pool.length) continue;
    const got = rec.filter(x => x.y === y).map(x => { const c0 = x.cat.replace(/ \d{4}$/, ''), cat = CER_CANON[c0] || c0, C = CER_CATS.find(z => z[0] === cat), f = S.films[x.film]; return Object.assign({}, x, { cat, people: x.people && x.people.length ? x.people : C && f ? C[1](f).filter(id => id !== null && id !== undefined && P(id)) : [] }); });
    const dd = {}; for (const x of got) { const o = dd[x.cat]; if (!o || (!(S.films[o.film] || {}).archive && (S.films[x.film] || {}).archive)) dd[x.cat] = x; }
    const have = new Set(Object.keys(dd)); out.push(...Object.values(dd));
    for (const [cat, who, seed, genre] of CER_CATS) {
      if (have.has(cat) || y < (CER_START[cat] || 0)) continue;
      let L = genre ? pool.filter(f => f.genre === genre) : cat === 'Best Film' ? pool.filter(f => f.genre !== 'Animation' && f.genre !== 'Documentary') : pool;
      if (cat === 'Best Debut') L = L.filter(debutOf);
      if (/Adapted/.test(cat)) L = L.filter(f => hashRand(f.id * 7)() < .35); else if (/Original Screenplay/.test(cat)) L = L.filter(f => hashRand(f.id * 7)() >= .35);
      L = L.filter(f => who(f).some(id => id !== null && id !== undefined && P(id)));
      if (!L.length) continue;
      const sc = f => f.q + (f.camp || 0) + hashRand(f.id * 31 + seed * 977 + y)() * 9;
      const f = L.reduce((a, c) => sc(c) > sc(a) ? c : a);
      out.push({ y, cat, film: f.id, people: who(f).filter(id => id !== null && id !== undefined && P(id)) });
    }
  }
  return out;
}
function mediaRecord(b) {
  const f = b.field, cats = MEDIA_CATS[f] || b.cats, out = [], real = (S.mawards || []).filter(r => r.show === b.key);
  const hubs = HUB_IDS.filter(h => HUBS[h].m === 'US' || HUBS[h].m === 'UK').slice(0, 4), all = hubs.flatMap(h => mediaFigures(h).map((x, i) => Object.assign({ hub: h, fid: `${h}~${i}` }, x))).filter(x => x.field === f);
  const y0 = { music: 1959, stage: 1947, podcast: 2005, creator: 2012 }[f] || 1990;
  for (let y = S.year - 1; y >= y0; y--) {
    const R = real.find(r => r.y === y), have = new Set();
    if (R) for (const [cat, name] of R.w) { const x = all.find(z => z.name === name); out.push({ y, cat, name, fid: x ? x.fid : undefined }); have.add(cat); }
    const act = all.filter(x => x.from <= y && (!x.to || x.to >= y)); if (!act.length) continue;
    cats.forEach((cat, i) => { if (have.has(cat)) return; const r = hashRand(y * 131 + i * 17 + f.length)(), KND = { 'Best Rap Album': ['rapper'], 'Best Rock Album': ['band'], 'Best Dance Recording': ['dj'], 'Best Pop Performance': ['singer', 'band'], 'Best Live Act': ['band', 'singer'], 'Best Short-form': ['blipper'] }[cat], L0 = KND ? act.filter(x => KND.includes(x.kind)) : act, L = /New|Breakout/.test(cat) ? L0.filter(x => y - x.from <= 2) : L0; const P2 = L.length ? L : L0.length ? L0 : act; const recent = new Set(out.filter(o => o.cat === cat && o.y > y && o.y <= y + 3).map(o => o.name).concat(out.filter(o => o.y === y).map(o => o.name))); const w = P2.map(x => Math.log10(x.fans + 10) * .8 + hashRand(x.name.length * 13 + y * 7 + i * 31)() * 4 - (recent.has(x.name) ? 6 : 0) - (y - x.from > 15 ? 1.2 : 0)); let bi = 0; for (let k = 1; k < P2.length; k++) if (w[k] > w[bi]) bi = k; const x = P2[bi]; out.push({ y, cat, name: x.name, fid: x.fid, slot: /Song|Record|Album|Recording|Play|Musical|Revival|Series|Short/.test(cat) ? Math.floor(weekOfYear(y) / 6) + 3 : undefined }); });
  }
  return out;
}
const ENTRY_A = ['The', 'A Quiet', 'Last', 'Small', 'Paper', 'Winter', 'Night', 'Glass', 'Borrowed', 'Little'], ENTRY_B = ['Harbour', 'Machines', 'Hours', 'Kingdom', 'Weather', 'Letters', 'Rooms', 'Daughters', 'Signals', 'Saints'];
function contestRecord(b) {
  const c = COMPS.find(x => x.k === b.comp), out = []; if (!c) return out;
  const role = { write: 'writer', direct: 'director', act: 'actor', craft: 'dp', music: 'composer', produce: 'producer', fun: null, creator: null, podcast: null, stage: 'writer' }[c.cat];
  const pool = S.people.filter(p => !p.player && (!role || p.role === role) && p.born < S.year - 22);
  const M = S.me;
  for (const e of (M && M.comps) || []) if (e.k === c.k && e.told) out.push({ y: yearOf(e.w || S.week), cat: { win: 'Winner', runner: 'Runner-up', final: 'Finalist', mention: 'Honourable mention' }[e.place] || 'Entered', person: M.id, title: (M.scripts || []).find(s => s.id === e.script)?.title, mine: 1 });
  const y0 = Math.max(1975, S.year - 40);
  for (let y = S.year - 1; y >= y0; y--) for (const [i, cat] of ['Winner', 'Runner-up'].entries()) {
    if (out.some(x => x.y === y && x.cat === cat)) continue;
    const r = hashRand(y * 977 + i * 31 + c.k.length * 7), cand = pool.filter(p => p.born < y - 18 && p.born > y - 45);
    if (!cand.length) continue;
    const p = cand[Math.floor(r() * cand.length)];
    out.push({ y, cat, person: p.id, title: c.need === 'script' || c.cat === 'write' ? `${ENTRY_A[Math.floor(r() * 10)]} ${ENTRY_B[Math.floor(r() * 10)]}` : undefined });
  }
  return out;
}
function allWinners(b) {
  const k = awKey(b); if (AW2.has(k)) return AW2.get(k);
  let L;
  if (b.kind === 'festival' && b.fk) L = festRecord(FESTIVALS.find(F => F.k === b.fk));
  else if (b.kind === 'ceremony') L = ceremonyRecord(b);
  else if (b.kind === 'contest') L = contestRecord(b);
  else L = mediaRecord(b);
  AW2.set(k, L); return L;
}
function bodyCats(b) { const L = allWinners(b), seen = []; for (const w of L) if (!seen.includes(w.cat)) seen.push(w.cat); return seen; }
function winnerCell(w) {
  if (w.film !== undefined && S.films[w.film]) return `${fl(w.film)}${(w.people || []).filter(id => P(id)).length ? ' · ' + w.people.filter(id => P(id)).map(pl).join(', ') : ''}`;
  if (w.person !== undefined && P(w.person)) return `${pl(w.person)}${w.title ? ` for <i>${esc(w.title)}</i>` : ''}`;
  if (w.fid) return `${figLink({ fid: w.fid, name: w.name })}${w.slot !== undefined ? ` · ${songLink(Object.assign({ fid: w.fid }, figAt(w.fid) || {}), w.slot)}` : ''}`;
  return esc(w.name || '');
}
// A winners table with category, year and sort controls (shared by every prize page).
function awardTableHTML(b) {
  const all = allWinners(b), cats = bodyCats(b), years = [...new Set(all.map(w => w.y))].sort((a, c) => c - a);
  const st = UI.abt = UI.abt && UI.abt.b === b.id ? UI.abt : { b: b.id, cat: '', y: '', sort: 'new', q: '' };
  let L = all.filter(w => (!st.cat || w.cat === st.cat) && (!st.y || w.y === +st.y));
  L = L.slice().sort((a, c) => st.sort === 'old' ? a.y - c.y || cats.indexOf(a.cat) - cats.indexOf(c.cat) : st.sort === 'cat' ? cats.indexOf(a.cat) - cats.indexOf(c.cat) || c.y - a.y : c.y - a.y || cats.indexOf(a.cat) - cats.indexOf(c.cat));
  const opt = (v, l, cur) => `<option value="${esc(String(v))}"${String(cur) === String(v) ? ' selected' : ''}>${esc(l)}</option>`;
  return `<section class="panel awtable"><h3>Winners <span class="count">${all.length} prizes · ${years.length} years · ${cats.length} categories</span></h3>
   <div class="cats">${cats.map(c => `<button class="pill${st.cat === c ? ' on' : ''}" data-abcat="${esc(c)}">${esc(c)}</button>`).join(' ')}${st.cat ? ' <button class="linkish small" data-abcat="">Show all</button>' : ''}</div>
   <div class="bf-row"><label class="small">Category <select id="ab-cat">${opt('', 'Every category', st.cat)}${cats.map(c => opt(c, c, st.cat)).join('')}</select></label><label class="small">Year <select id="ab-y">${opt('', 'Every year', st.y)}${years.map(y => opt(y, y, st.y)).join('')}</select></label><label class="small">Sort <select id="ab-sort">${opt('new', 'Newest first', st.sort)}${opt('old', 'Oldest first', st.sort)}${opt('cat', 'By category', st.sort)}</select></label><span class="muted small">${L.length} shown</span></div>
   <div class="tw" style="max-height:640px;overflow:auto"><table class="grid small"><thead><tr><th>Year</th><th>Category</th><th>Winner</th></tr></thead><tbody>${L.slice(0, 400).map(w => `<tr${w.mine ? ' class="me"' : ''}><td>${w.y}</td><td><button class="linkish" data-abcat="${esc(w.cat)}">${esc(w.cat)}</button></td><td>${winnerCell(w)}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">Nothing matches.</td></tr>'}</tbody></table></div>${L.length > 400 ? '<p class="muted small">Showing the first 400. Narrow by category or year.</p>' : ''}</section>`;
}
function awardsClick(t) { if (t.dataset.abcat !== undefined) { if (UI.abt) { UI.abt.cat = t.dataset.abcat; UI.abt.y = ''; } render(true); return true; } return false; }
function awardsChange(id, v) { if (!/^ab-(cat|y|sort)$/.test(id) || !UI.abt) return false; UI.abt[id.slice(3) === 'y' ? 'y' : id.slice(3)] = v; return true; }
// The festival line-up: what played, by section, in a given year.
function festLineup(F, y) {
  const pool = (typeof filmsByYear === 'function' ? filmsByYear()[y] || [] : []).filter(f => festFits(F, f) && f.q >= (F.bar || 50) - 14);
  const r = f => f.q + hashRand(f.id * 13 + F.k.length + y)() * 10;
  const L = pool.sort((a, b) => r(b) - r(a)).slice(0, 24), secs = F.sections || ['Competition'];
  return L.map((f, i) => ({ f, sec: secs[Math.min(secs.length - 1, Math.floor(i / Math.max(1, Math.ceil(L.length / secs.length))))] }));
}
