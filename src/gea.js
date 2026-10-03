// ---------------- REEL (was GEA): the Recorded Entertainment Encyclopedia & Library ----------------
// The world's film database. Every film gets a logline, a poster, set stills and a trailer card; every person a
// short bio. All of it is drawn from the simulation and a hash of the film or person, so it costs nothing until you
// look and never touches the world's random numbers. Full credits go deeper than the people the simulation casts:
// new films carry extra producers, story credits and bit parts (real people in the world, credited on release);
// older films show the same kind of list, generated for display.
const GENRE_LOOK = { Drama: ['#2B3A55', '#C9B79C', '#F2E8CF'], Comedy: ['#E8553E', '#F4B400', '#FFF6E0'], Crime: ['#151515', '#B3261E', '#E8E2D6'], Thriller: ['#0E2A3A', '#5FC0B6', '#E6F2F1'], Horror: ['#0B0B0B', '#8A0303', '#E9E1D3'], Action: ['#1A1A1A', '#F28C28', '#FFF3E0'], 'Martial arts': ['#5A0F0F', '#E8B44A', '#FFF4DC'], Western: ['#7A3E12', '#F2C14E', '#FFF1D6'], Romance: ['#5E1B3A', '#F28AB2', '#FFEAF2'], Musical: ['#2E1752', '#F2B705', '#FFF8E1'], 'Sci-fi': ['#06131F', '#4FC3F7', '#E1F5FE'], Fantasy: ['#1B3A2A', '#A5D6A7', '#F1F8E9'], War: ['#3B3B2E', '#C9C28A', '#EFEFE3'], Period: ['#4A2C2A', '#D4A373', '#FAEDCD'], Documentary: ['#263238', '#90A4AE', '#ECEFF1'], Animation: ['#FF7043', '#29B6F6', '#FFFDE7'], Superhero: ['#0D47A1', '#E53935', '#FFFFFF'] };
const TAGLINES = {
  Drama: ['Some families are chosen. Some are endured.', 'Every life has one summer.', 'What we keep is what keeps us.'], Comedy: ['One wedding. Zero plans.', 'They had one job.', 'It seemed like a good idea at the time.'],
  Crime: ['Everybody pays.', 'One last job. There\'s always one last job.', 'The city keeps its secrets. Until now.'], Thriller: ['Trust no one. Not even yourself.', 'The truth has an expiry date.', 'Someone is always watching.'],
  Horror: ['Don\'t go downstairs.', 'It remembers you.', 'Some doors stay shut for a reason.'], Action: ['No backup. No mercy. No brakes.', 'The clock is ticking.', 'This time it\'s personal.'],
  'Martial arts': ['One master. One hundred enemies.', 'Discipline is a weapon.', 'The final form.'], Western: ['The frontier has a long memory.', 'A town without a law. A man without a past.', 'Justice rides alone.'],
  Romance: ['Some loves arrive late.', 'Two hearts. One city. No timing.', 'It was always you.'], Musical: ['Life is better with a chorus.', 'Dance like the lights are on.', 'One song can change everything.'],
  'Sci-fi': ['The future is listening.', 'Out there, no one is coming.', 'Tomorrow was yesterday.'], Fantasy: ['Every kingdom falls. One rises.', 'Magic has a price.', 'Beyond the last map.'],
  War: ['No one comes home the same.', 'The line must hold.', 'Courage is a decision.'], Period: ['Society has rules. She had plans.', 'History is written by the bold.', 'Behind every portrait, a secret.'],
  Documentary: ['The true story, finally.', 'Seeing is believing.', 'You were never told the whole story.'], Animation: ['Small hero. Huge heart.', 'Adventure is out the window.', 'Every toy has a story.'], Superhero: ['Not all heroes ask permission.', 'The mask is the easy part.', 'Rise.']
};
const LOG_WHO = ['a widowed fisherman', 'a burned-out detective', 'an estranged sister', 'a teenage runaway', 'an ageing magician', 'a disgraced surgeon', 'a small-town mayor', 'a night-shift nurse', 'a charming con artist', 'a retired boxer', 'a young widow', 'a failed novelist', 'a lonely astronaut', 'a stubborn farmer', 'a getaway driver', 'a schoolteacher with a past', 'a celebrity chef', 'a reluctant heir', 'two rival siblings', 'a travelling band'];
const LOG_WANT = { family: 'must bring a scattered family back together', power: 'sets out to take control of the town that ignored them', love: 'risks everything for a second chance at love', memory: 'tries to recover a summer they can\'t remember', identity: 'discovers who they really are', justice: 'goes after the people who got away with it', survival: 'has to make it through one impossible night', faith: 'loses their faith and goes looking for it', ambition: 'will do anything to make it to the top', freedom: 'plans an escape nobody thinks is possible', loneliness: 'finds an unlikely friend', revenge: 'comes back for the people who left them for dead' };
const LOG_WHERE = { Western: 'on the frontier', 'Sci-fi': 'on a station at the edge of known space', Fantasy: 'in a kingdom running out of magic', War: 'behind enemy lines', Period: 'in a society that forbids it', Horror: 'in a house that wants them to stay', Musical: 'on the biggest stage in town', 'Martial arts': 'in a city ruled by rival schools', Superhero: 'in a city that needs a hero and doesn\'t want one', Animation: 'in a world just beyond the garden fence', Documentary: '' };
const LOG_TWIST = ['but the past won\'t stay buried', 'before time runs out', 'whatever it costs them', 'with nothing but each other', 'and the whole town is watching', 'while someone close is lying to them', ''];
function filmLogline(f) {
  if (typeof storyLog === 'function' && storyLog(f)) return storyLog(f);
  const M = S.me;
  const own = M && ((M.scripts || []).find(x => x.made === f.id) || (M.holdings || []).find(x => x.made === f.id));
  if (own && own.logline) return own.logline;
  const r = hashRand(f.id * 977 + 5), pick = a => a[Math.floor(r() * a.length)];
  if (f.genre === 'Documentary') return `${pick(['An intimate look at', 'The untold story of', 'A year inside', 'A portrait of'])} ${pick(['a family business in decline', 'the last cinema in a small town', 'a musician on the edge of fame', 'a city trying to save its river', 'an underdog football club', 'the people who clean up after disasters'])}.`;
  const th = pick(GENRE_THEMES[f.genre] || ['family']), where = LOG_WHERE[f.genre] ?? pick(['in a city that never sleeps', 'in a small town', 'over one long weekend', 'across three decades', '']);
  const t = `${pick(LOG_WHO)} ${LOG_WANT[th] || LOG_WANT.family}${where ? ' ' + where : ''}${(() => { const x = pick(LOG_TWIST); return x ? ', ' + x : ''; })()}.`;
  return t[0].toUpperCase() + t.slice(1);
}
function filmTagline(f) { if (typeof storyTag === 'function' && storyTag(f)) return storyTag(f); const r = hashRand(f.id * 131 + 7); const L = TAGLINES[f.genre] || TAGLINES.Drama; return L[Math.floor(r() * L.length)]; }
// ---- the poster ----
function posterMotif(g, c, r) {
  const [d, a, l] = c, x = 100, y = 120;
  switch (g) {
    case 'Horror': return `<circle cx="140" cy="70" r="34" fill="${l}" opacity=".9"/><path d="M40 300 L60 160 L52 150 L66 155 L70 120 L78 156 L92 140 L84 170 L100 300Z" fill="${d}"/><rect x="0" y="230" width="200" height="70" fill="${a}" opacity=".35"/>`;
    case 'Western': return `<circle cx="100" cy="150" r="48" fill="${a}"/><path d="M0 200 L40 170 L60 180 L90 150 L130 180 L160 165 L200 190 L200 300 L0 300Z" fill="${d}"/>`;
    case 'Sci-fi': return `${Array.from({ length: 24 }, () => `<circle cx="${Math.round(r() * 200)}" cy="${Math.round(r() * 200)}" r="${(r() * 1.4 + .4).toFixed(1)}" fill="${l}"/>`).join('')}<circle cx="120" cy="170" r="60" fill="${a}" opacity=".85"/><ellipse cx="120" cy="170" rx="90" ry="14" fill="none" stroke="${l}" stroke-width="3" opacity=".7"/>`;
    case 'Romance': return `<circle cx="80" cy="150" r="46" fill="${a}" opacity=".85"/><circle cx="120" cy="150" r="46" fill="${l}" opacity=".55"/>`;
    case 'Crime': return `${Array.from({ length: 9 }, (_, i) => `<rect x="0" y="${40 + i * 22}" width="200" height="10" fill="${a}" opacity=".5"/>`).join('')}<circle cx="100" cy="150" r="22" fill="${d}"/><path d="M60 300 L70 190 Q100 170 130 190 L140 300Z" fill="${d}"/>`;
    case 'Action': return `${Array.from({ length: 16 }, (_, i) => { const t = i / 16 * Math.PI * 2; return `<path d="M${x} ${y + 40} L${x + Math.cos(t) * 160} ${y + 40 + Math.sin(t) * 160} L${x + Math.cos(t + .15) * 160} ${y + 40 + Math.sin(t + .15) * 160}Z" fill="${a}" opacity=".55"/>`; }).join('')}<circle cx="100" cy="160" r="30" fill="${l}"/>`;
    case 'Comedy': return `${Array.from({ length: 7 }, (_, i) => `<path d="M${-60 + i * 50} 300 L${i * 50} 0 L${25 + i * 50} 0 L${-35 + i * 50} 300Z" fill="${a}" opacity=".35"/>`).join('')}<circle cx="100" cy="150" r="40" fill="${l}"/><path d="M80 158 Q100 178 120 158" stroke="${d}" stroke-width="5" fill="none"/><circle cx="88" cy="140" r="5" fill="${d}"/><circle cx="112" cy="140" r="5" fill="${d}"/>`;
    case 'Thriller': return `<ellipse cx="100" cy="150" rx="70" ry="34" fill="${l}"/><circle cx="100" cy="150" r="24" fill="${a}"/><circle cx="100" cy="150" r="11" fill="${d}"/>`;
    case 'Musical': return `<path d="M100 20 L40 280 L160 280Z" fill="${a}" opacity=".45"/><circle cx="100" cy="230" r="14" fill="${l}"/><path d="M90 300 L95 245 L105 245 L110 300Z" fill="${l}"/>`;
    case 'War': return `<path d="M0 220 L200 200 L200 300 L0 300Z" fill="${d}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${15 + i * 32} 210 l6 -40 l6 40" stroke="${a}" stroke-width="3" fill="none"/>`).join('')}<circle cx="150" cy="80" r="26" fill="${a}" opacity=".6"/>`;
    case 'Fantasy': return `<path d="M40 300 L40 170 L55 150 L70 170 L70 130 L90 100 L110 130 L110 170 L130 150 L145 170 L160 170 L160 300Z" fill="${d}"/><circle cx="100" cy="70" r="20" fill="${l}"/>`;
    case 'Period': return `<rect x="45" y="70" width="110" height="150" rx="55" fill="none" stroke="${a}" stroke-width="6"/><circle cx="100" cy="130" r="24" fill="${l}"/><path d="M60 220 Q100 160 140 220Z" fill="${l}"/>`;
    case 'Documentary': return `<rect x="30" y="80" width="140" height="100" fill="${l}" opacity=".9"/><rect x="40" y="90" width="120" height="80" fill="${a}"/><circle cx="100" cy="130" r="18" fill="${l}"/>`;
    case 'Animation': return `<circle cx="70" cy="160" r="40" fill="${a}"/><circle cx="130" cy="150" r="30" fill="${l}"/><circle cx="62" cy="150" r="6" fill="${d}"/><circle cx="82" cy="150" r="6" fill="${d}"/>`;
    case 'Superhero': return `<path d="M100 70 L150 90 L145 160 Q130 200 100 220 Q70 200 55 160 L50 90Z" fill="${a}"/><path d="M100 100 L110 130 L140 130 L115 148 L125 178 L100 160 L75 178 L85 148 L60 130 L90 130Z" fill="${l}"/>`;
    case 'Martial arts': return `<circle cx="100" cy="120" r="56" fill="${a}"/><path d="M95 300 L98 200 L70 170 L60 140 L75 150 L100 175 L125 140 L140 150 L112 190 L118 300Z" fill="${d}"/>`;
    default: return `<rect x="70" y="60" width="60" height="80" fill="${l}" opacity=".85"/><circle cx="100" cy="190" r="22" fill="${d}"/><path d="M60 300 L70 220 Q100 200 130 220 L140 300Z" fill="${d}"/>`;
  }
}
function wrapTitle(t, n = 13) { const W = t.toUpperCase().split(/\s+/), L = []; let cur = ''; for (const w of W) { if ((cur + ' ' + w).trim().length > n && cur) { L.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } if (cur) L.push(cur); return L.slice(0, 4); }
function posterSVG(f, w = 200) {
  const c = GENRE_LOOK[f.genre] || GENRE_LOOK.Drama, r = hashRand(f.id * 53 + 1), lines = wrapTitle(f.title);
  const lead = f.cast && f.cast[0] !== undefined ? P(f.cast[0]).name.toUpperCase() : '', yr = f.rel !== null ? yearOf(f.rel) : 'COMING SOON';
  const v = Math.floor(hashRand(f.id * 97 + 5)() * 3);   // layout: 0 title low, 1 title high, 2 framed classic
  const ty = v === 1 ? 52 : 214 - lines.length * 9, leadY = v === 1 ? 276 : v === 2 ? 30 : 22;
  return `<svg class="poster" viewBox="0 0 200 300" width="${w}" height="${w * 1.5}" role="img" aria-label="Poster for ${esc(f.title)}"><rect width="200" height="300" fill="${c[0]}"/>${posterMotif(f.genre, c, r)}
   <rect x="0" y="${ty - 26}" width="200" height="${lines.length * 21 + 36}" fill="${c[0]}" opacity=".55"/>
   <text x="100" y="${leadY}" text-anchor="middle" fill="${c[2]}" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-size="11" letter-spacing="2">${esc(lead)}</text>${v === 2 ? `<rect x="7" y="7" width="186" height="286" fill="none" stroke="${c[2]}" stroke-width="2" opacity=".85"/><rect x="11" y="11" width="178" height="278" fill="none" stroke="${c[1]}" stroke-width=".8" opacity=".7"/>` : ''}
   ${lines.map((l, i) => `<text x="100" y="${ty + i * 21}" text-anchor="middle" fill="${c[2]}" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="${l.length > 11 ? 18 : 22}" letter-spacing="1">${esc(l)}</text>`).join('')}
   <text x="100" y="${ty + lines.length * 21 + 2}" text-anchor="middle" fill="${c[1]}" font-family="Barlow, sans-serif" font-style="italic" font-size="8.5">${esc(filmTagline(f))}</text>
   <text x="100" y="${v === 2 ? 282 : 290}" text-anchor="middle" fill="${c[2]}" font-family="Barlow Condensed, sans-serif" font-size="8" letter-spacing="1" opacity=".8">${v === 2 ? 'A FILM BY ' : ''}${esc(P(f.dir).name.toUpperCase())} · ${yr}</text></svg>`;
}
// ---- stills from the set ----
// A still is a frame from the film: a shot type (picked by genre and a hash of the film), a time of day, a palette
// nudged per film, a few figures, and black-and-white for the old ones. Twenty-odd setups, so no two films look alike.
function mixC(a, b, t) { return typeof mixHex === 'function' ? mixHex(a, b, t) : a; }
// ---- extended credits ----
// Picked in a fixed order from the hub's people by a hash of the film: same answer every time, no world dice.
function extPick(f, role, n, salt, exclude) {
  const ids = (S.pool[f.hub] && S.pool[f.hub][role] || []).filter(id => !exclude.has(id) && !P(id).dead);
  const r = hashRand(f.id * 7 + salt), out = [];
  for (let k = 0; k < n && ids.length; k++) { const j = Math.floor(r() * ids.length); out.push(ids[j]); exclude.add(ids[j]); ids.splice(j, 1); }
  return out;
}
function makeExt(f) {
  const ex = new Set(keyIds(f)), r = hashRand(f.id * 11 + 2);
  return { eprod: extPick(f, 'producer', 1 + Math.floor(r() * 3), 1, ex), story: r() < .35 ? extPick(f, 'writer', 1, 2, ex) : [], bits: extPick(f, 'actor', 4 + Math.floor(r() * 6), 3, ex) };
}
// New films get theirs when they're greenlit, so the people really are credited when it opens.
function extendCredits(f) { f.ext = makeExt(f); }
function extIds(f) { return f.ext ? [...f.ext.eprod, ...f.ext.story, ...f.ext.bits] : []; }
const CREW_ROLES = ['Unit production manager', 'First assistant director', 'Script supervisor', 'Gaffer', 'Key grip', 'Location manager', 'Production coordinator', 'Set decorator', 'Property master', 'Hair department head', 'Makeup department head', 'Supervising sound editor', 'Re-recording mixer', 'Foley artist', 'Colourist', 'Visual effects supervisor', 'Stunt coordinator', 'Unit publicist', 'Still photographer', 'Catering'];
function crewNames(f) {
  const N = NAMES[HUBS[f.hub].lang] || NAMES.en, r = hashRand(f.id * 29 + 9), pk = a => a[Math.floor(r() * a.length)];
  const nm = () => { const g = r() < .5 ? 'M' : 'F', a = pk(N[g]), b = pk(N.L); return EAST[HUBS[f.hub].lang] ? `${b} ${a}` : `${a} ${b}`; };
  return CREW_ROLES.filter(() => r() < .75).map(role => [role, nm()]);
}
function fullCredits(f) {
  const credit = (l, ids) => ids.length ? `<div class="cr"><span>${l}</span><span>${ids.map(pl).join(', ')}</span></div>` : '';
  const x = f.ext || makeExt(f), crew = Object.keys(CREW_LABEL).filter(k => f.crew && f.crew[k] !== undefined);
  return `<section class="panel credits"><h3>Credits</h3>
   <div class="castgrid">${f.cast.map((id, i) => `<a href="#" class="castcard" data-go="person:${id}">${portraitOf(P(id), 56)}<b>${esc(P(id).name)}</b><span class="muted small">${f.genre === 'Documentary' ? 'Featuring' : f.genre === 'Animation' ? 'Voice' : ['Lead', 'Co-lead', 'Supporting'][i] || 'Cast'}</span></a>`).join('')}</div>
   ${credit(f.codir ? 'Directors' : 'Director', [f.dir, ...(f.codir || [])])}${credit(f.wri.length > 1 ? 'Screenplay' : 'Written by', f.wri)}${credit('Story by', x.story)}${credit('Produced by', [f.prod])}${credit('Executive producers', x.eprod)}${credit('Cinematography', [f.dp])}${credit('Editor', [f.ed])}${crew.map(k => credit(CREW_LABEL[k], [f.crew[k]])).join('')}${Object.keys(f.xc || {}).filter(id => !keyIds(f).includes(+id)).map(id => credit(f.xc[id], [+id])).join('')}
   <details class="more"><summary>Full cast and crew</summary>${credit('Also starring', x.bits)}<div class="crewlist">${crewNames(f).map(([r, n]) => `<div class="cr"><span>${esc(r)}</span><span>${esc(n)}</span></div>`).join('')}</div></details></section>`;
}
// ---- people ----
function personBio(p) {
  if (p.player) return '';
  const cr = p.credits.map(i => S.films[i]).filter(f => f && f.rel !== null).sort((a, b) => a.rel - b.rel);
  const best = cr.slice().sort((a, b) => b.reviews - a.reviews)[0], big = cr.slice().sort((a, b) => b.total - a.total)[0];
  const b = backstoryOf(p), occ = (p.occ || occupationOf(p)).toLowerCase(), P0 = pron(p);
  let t = `${p.name} is ${/^[aeiou]/.test(occ) ? 'an' : 'a'} ${occ} based in ${hubName(p.hub)}`;
  t += cr.length ? `, with ${cr.length} credit${cr.length > 1 ? 's' : ''} since ${yearOf(cr[0].rel)}.` : ', still waiting on a first credit.';
  if (best) t += ` Best known for ${best.title} (${yearOf(best.rel)})${big && big !== best ? ` and the hit ${big.title}` : ''}.`;
  if (p.awards.length) t += ` ${P0[0]} ${P0[0] === 'They' ? 'have' : 'has'} won ${p.awards.length} award${p.awards.length > 1 ? 's' : ''}.`;
  if (b && b.from) t += ` Grew up in ${b.from}.`;
  if (p.traits.length) t += ` Known for being ${p.traits.slice(0, 2).map(x => x.toLowerCase()).join(' and ')}.`;
  return t;
}
// The archive's masthead: switch between films and people.
function geaHead(cur) { return `<div class="geahead"><span class="gealogo">REEL</span><span class="muted">The Recorded Entertainment Encyclopedia &amp; Library</span><span class="seg"><button class="pill${cur === 'films' ? ' on' : ''}" data-gea="films">Films</button><button class="pill${cur === 'people' ? ' on' : ''}" data-gea="people">People</button></span></div>`; }
// ---- what the critics said: three or four notices, in the key of the film's actual reviews ----
const CRITIC_LINES = {
  rave: ['{dir} has made something close to perfect.', 'The best thing {lead} has ever done, and it isn\'t close.', 'I walked out into the street and the world looked different.', 'A {g} that will be studied for years.', 'Every frame earns its place.', 'Funny, furious and finally devastating.'],
  good: ['Smart, confident and very entertaining.', '{lead} holds the whole thing together.', 'Not flawless, but it lands where it matters.', 'A {g} with a brain and a heart.', '{dir} knows exactly what this film is.', 'The last act is worth the price of a ticket.'],
  mixed: ['Half a great film.', '{lead} deserves a better script.', 'Handsome, competent, and oddly forgettable.', 'It wants to be three films at once.', 'There\'s a sharper {g} buried in here somewhere.', 'Fine. Just fine.'],
  bad: ['A long two hours.', 'Nobody seems to know what film they are in.', '{lead} looks as lost as the audience.', 'The kind of {g} that gives the genre a bad name.', 'I checked my watch. Then I checked it again.', 'Expensive, loud and empty.']
};
const CRITIC_FIRST = ['Mara', 'Lionel', 'Priya', 'Otis', 'Greta', 'Hugo', 'Ines', 'Walt', 'Dana', 'Felix', 'June', 'Roland'], CRITIC_LAST = ['Penrose', 'Achebe', 'Lindqvist', 'Okafor', 'Delacroix', 'Mendes', 'Hartley', 'Sato', 'Brennan', 'Kowalski', 'Varga', 'Whitlow'];
function filmReviewsHTML(f) {
  if (f.rel === null || f.reviews === null || f.reviews === undefined) return '';
  const r = hashRand(f.id * 43 + 17), n = 3 + Math.floor(r() * 2), lead = f.cast[0] !== undefined ? P(f.cast[0]).name : 'the cast', dir = P(f.dir).name;
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = clamp(f.reviews + (r() - .5) * 30 + (i === n - 1 && r() < .35 ? (f.reviews > 60 ? -35 : 35) : 0), 5, 99);   // sometimes a contrarian
    const band = s >= 80 ? 'rave' : s >= 63 ? 'good' : s >= 45 ? 'mixed' : 'bad', L = CRITIC_LINES[band];
    const stars = Math.max(1, Math.round(s / 20));
    out.push(`<li><span class="stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span> “${esc(L[Math.floor(r() * L.length)].replace('{dir}', dir).replace('{lead}', lead).replace('{g}', f.genre.toLowerCase()))}” <span class="muted small">— ${CRITIC_FIRST[Math.floor(r() * 12)]} ${CRITIC_LAST[Math.floor(r() * 12)]}, ${esc(PAPERS[Math.floor(r() * PAPERS.length)])}</span></li>`);
  }
  return `<section class="panel reviews"><h3>What the critics said</h3><ul class="plain">${out.join('')}</ul></section>`;
}
// ---- the box-office run: the weekly shape of a film's takings, derived from its total and how well it held ----
function filmRun(f) {
  if (f.rel === null || !(f.total > 0)) return null;
  const q = f.q || 50, hold = clamp(.42 + q / 220 + (f.cult || 0) / 600, .35, .88), wk = 10;   // good films lose fewer viewers each week
  const w = Array.from({ length: wk }, (_, i) => Math.pow(hold, i)), sum = w.reduce((a, b) => a + b, 0);
  return w.map(x => x / sum * f.total);
}
function filmRunHTML(f) {
  const R = filmRun(f); if (!R) return '';
  const max = R[0], W = 640, H = 110, bw = W / R.length;
  const bars = R.map((v, i) => { const h = Math.max(2, v / max * (H - 18)), x = i * bw + 1, y = H - 14 - h; return `<g><title>Week ${i + 1}: ${fmtM(v)}</title><rect x="${x}" y="${y}" width="${bw - 2}" height="${h}" rx="3" fill="var(--accent)"/><rect x="${i * bw}" y="0" width="${bw}" height="${H}" fill="transparent"/></g>`; }).join('');
  const half = R.findIndex((v, i) => R.slice(0, i + 1).reduce((a, b) => a + b, 0) >= f.total / 2) + 1;
  return `<section class="panel run"><h3>Box office run</h3><svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="Weekly box office for ${esc(f.title)}">${bars}<line x1="0" y1="${H - 13}" x2="${W}" y2="${H - 13}" stroke="var(--line)"/><text x="0" y="${H - 2}" font-size="9" fill="var(--muted)">Week 1</text><text x="${W}" y="${H - 2}" font-size="9" fill="var(--muted)" text-anchor="end">Week ${R.length}</text></svg>
   <p class="small">Opening week ${fmtM(R[0])} · ${R[1] ? Math.round((1 - R[1] / R[0]) * 100) + '% drop in week two' : ''} · half its total by week ${half} · ${fmtM(f.total)} worldwide.</p></section>`;
}
