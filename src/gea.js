// ---------------- GEA: the Global Entertainment Archive ----------------
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
  const M = S.me;
  const own = M && ((M.scripts || []).find(x => x.made === f.id) || (M.holdings || []).find(x => x.made === f.id));
  if (own && own.logline) return own.logline;
  const r = hashRand(f.id * 977 + 5), pick = a => a[Math.floor(r() * a.length)];
  if (f.genre === 'Documentary') return `${pick(['An intimate look at', 'The untold story of', 'A year inside', 'A portrait of'])} ${pick(['a family business in decline', 'the last cinema in a small town', 'a musician on the edge of fame', 'a city trying to save its river', 'an underdog football club', 'the people who clean up after disasters'])}.`;
  const th = pick(GENRE_THEMES[f.genre] || ['family']), where = LOG_WHERE[f.genre] ?? pick(['in a city that never sleeps', 'in a small town', 'over one long weekend', 'across three decades', '']);
  const t = `${pick(LOG_WHO)} ${LOG_WANT[th] || LOG_WANT.family}${where ? ' ' + where : ''}${(() => { const x = pick(LOG_TWIST); return x ? ', ' + x : ''; })()}.`;
  return t[0].toUpperCase() + t.slice(1);
}
function filmTagline(f) { const r = hashRand(f.id * 131 + 7); const L = TAGLINES[f.genre] || TAGLINES.Drama; return L[Math.floor(r() * L.length)]; }
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
function figure(x, y, s, col, pose = 0) {
  // a simple silhouette: head, body, and an arm that hints at what they're doing
  const arm = pose === 1 ? `<path d="M${x + 6 * s} ${y + 4 * s} l${10 * s} ${-9 * s}" stroke="${col}" stroke-width="${3 * s}" stroke-linecap="round"/>` : pose === 2 ? `<path d="M${x - 6 * s} ${y + 4 * s} l${-9 * s} ${7 * s}" stroke="${col}" stroke-width="${3 * s}" stroke-linecap="round"/>` : '';
  return `<circle cx="${x}" cy="${y - 7 * s}" r="${6 * s}" fill="${col}"/><rect x="${x - 7 * s}" y="${y}" width="${14 * s}" height="${24 * s}" rx="${4 * s}" fill="${col}"/>${arm}`;
}
const SHOTS = {
  room: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/><rect x="${20 + r() * 80}" y="14" width="44" height="40" fill="${T.sky}" stroke="${c.dark}" stroke-width="3"/><line x1="${42 + r() * 80}" y1="14" x2="${42 + r() * 80}" y2="54" stroke="${c.dark}" stroke-width="2" opacity=".6"/><rect y="76" width="180" height="24" fill="${c.dark}" opacity=".45"/>${figure(40 + r() * 100, 54, 1, c.dark, Math.floor(r() * 3))}`,
  street: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 32 - 4}" y="${18 + r() * 25}" width="28" height="90" fill="${c.dark}" opacity="${.6 + r() * .3}"/>${T.night ? Array.from({ length: 4 }, (_, k) => `<rect x="${i * 32 + 3 + (k % 2) * 10}" y="${30 + Math.floor(k / 2) * 14 + r() * 8}" width="5" height="6" fill="${c.light}" opacity="${r() > .4 ? .9 : .2}"/>`).join('') : ''}`).join('')}<rect y="82" width="180" height="18" fill="${c.dark}"/>${T.night ? `<line x1="128" y1="40" x2="128" y2="82" stroke="${c.mid}" stroke-width="2"/><circle cx="128" cy="40" r="5" fill="${c.light}"/><path d="M128 44 L108 82 L148 82Z" fill="${c.light}" opacity=".18"/>` : ''}${figure(60 + r() * 40, 60, .9, c.ink, 2)}`,
  twoshot: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><circle cx="58" cy="48" r="26" fill="${c.dark}"/><rect x="24" y="70" width="68" height="40" rx="18" fill="${c.dark}"/><circle cx="126" cy="44" r="24" fill="${c.mid}"/><rect x="94" y="64" width="64" height="40" rx="18" fill="${c.mid}"/><rect x="0" y="0" width="180" height="100" fill="${c.light}" opacity="${T.night ? 0 : .08}"/>`,
  closeup: (c, r, T) => `<rect width="180" height="100" fill="${c.dark}"/><ellipse cx="${80 + r() * 20}" cy="56" rx="42" ry="52" fill="${c.mid}"/><ellipse cx="${74 + r() * 20}" cy="48" rx="8" ry="4" fill="${c.dark}"/><ellipse cx="${100 + r() * 14}" cy="48" rx="8" ry="4" fill="${c.dark}"/><rect x="0" y="0" width="${40 + r() * 30}" height="100" fill="${c.dark}" opacity=".7"/>`,
  table: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/><circle cx="90" cy="18" r="6" fill="${c.light}"/><path d="M90 22 L40 70 L140 70Z" fill="${c.light}" opacity=".2"/><rect x="20" y="66" width="140" height="10" fill="${c.dark}"/>${[0, 1, 2, 3].slice(0, 2 + Math.floor(r() * 3)).map(k => figure(36 + k * 36, 46, .9, k % 2 ? c.dark : c.ink, k % 3)).join('')}`,
  car: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><rect y="0" width="180" height="100" fill="${c.dark}" opacity=".15"/><path d="M0 0 L180 0 L180 22 L150 22 L130 60 L50 60 L30 22 L0 22Z" fill="${c.dark}"/><path d="M0 100 L0 70 L180 70 L180 100Z" fill="${c.dark}"/>${figure(62, 52, 1, c.ink)}${figure(118, 52, 1, c.ink, 1)}<circle cx="90" cy="82" r="10" fill="none" stroke="${c.mid}" stroke-width="3"/>`,
  rooftop: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 16}" y="${50 + r() * 25}" width="14" height="60" fill="${c.dark}" opacity=".55"/>`).join('')}<rect y="78" width="180" height="22" fill="${c.dark}"/>${figure(70, 54, 1.1, c.ink)}${figure(96, 56, 1, c.ink, 2)}${T.night ? `<circle cx="150" cy="18" r="7" fill="${c.light}"/>` : ''}`,
  stairs: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${20 + i * 18}" y="${90 - i * 10}" width="200" height="10" fill="${c.dark}" opacity="${.3 + i * .07}"/>`).join('')}${figure(130, 24, .8, c.ink, 1)}`,
  doorway: (c, r, T) => `<rect width="180" height="100" fill="${c.dark}"/><rect x="70" y="14" width="44" height="86" fill="${c.light}" opacity=".9"/><path d="M70 100 L20 100 L70 86Z" fill="${c.light}" opacity=".25"/>${figure(92, 56, 1.3, c.dark)}`,
  landscape: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><circle cx="${30 + r() * 120}" cy="${30 + r() * 20}" r="${10 + r() * 8}" fill="${c.light}" opacity=".85"/><path d="M0 70 Q45 ${50 + r() * 15} 90 68 T180 ${60 + r() * 12} L180 100 L0 100Z" fill="${c.mid}"/><path d="M0 82 Q60 72 120 84 T180 80 L180 100 L0 100Z" fill="${c.dark}"/>${figure(40 + r() * 100, 64, .45, c.ink)}`,
  beach: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><rect y="56" width="180" height="20" fill="${c.mid}"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${i * 40} ${62 + (i % 2) * 6} q10 -3 20 0" stroke="${c.light}" fill="none" opacity=".7"/>`).join('')}<rect y="76" width="180" height="24" fill="${c.wall}"/>${figure(70 + r() * 30, 58, .8, c.ink)}${figure(100 + r() * 30, 60, .75, c.ink, 1)}`,
  crowd: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/>${Array.from({ length: 22 }, (_, i) => figure(4 + (i % 11) * 17 + r() * 4, 58 + Math.floor(i / 11) * 14, .7 + r() * .2, i % 3 ? c.dark : c.ink)).join('')}`,
  chase: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/>${Array.from({ length: 10 }, (_, i) => `<line x1="${r() * 60}" y1="${10 + i * 9}" x2="${100 + r() * 80}" y2="${10 + i * 9}" stroke="${c.light}" opacity=".35" stroke-width="2"/>`).join('')}<rect y="80" width="180" height="20" fill="${c.dark}"/>${figure(60, 58, 1, c.ink, 1)}${figure(130, 58, 1, c.dark, 2)}`,
  saloon: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/><rect y="62" width="180" height="10" fill="${c.dark}"/><rect y="72" width="180" height="28" fill="${c.dark}" opacity=".6"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${20 + i * 26}" y="40" width="6" height="22" fill="${c.light}" opacity=".7"/>`).join('')}${figure(60, 42, 1, c.ink, 1)}<path d="M120 26 h28 l-4 -8 h-20Z" fill="${c.dark}"/>${figure(134, 42, 1, c.ink)}`,
  corridor: (c, r, T) => `<rect width="180" height="100" fill="${c.dark}"/><path d="M0 0 L70 35 L110 35 L180 0 L180 100 L110 65 L70 65 L0 100Z" fill="${c.mid}" opacity=".5"/><rect x="70" y="35" width="40" height="30" fill="${c.light}" opacity=".7"/>${Array.from({ length: 5 }, (_, i) => `<line x1="${i * 14}" y1="${i * 7}" x2="${i * 14}" y2="${100 - i * 7}" stroke="${c.light}" opacity=".3"/>`).join('')}${figure(90, 48, .6, c.dark)}`,
  hallway: (c, r, T) => `<rect width="180" height="100" fill="${c.dark}"/><rect x="74" y="20" width="32" height="64" fill="${c.mid}" opacity=".4"/><rect x="80" y="26" width="20" height="58" fill="${c.dark}"/><rect x="86" y="${30 + r() * 10}" width="8" height="30" fill="${c.light}" opacity=".35"/><path d="M0 100 L74 84 L106 84 L180 100Z" fill="${c.mid}" opacity=".3"/>${figure(30, 66, 1.2, c.ink, 2)}`,
  trench: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><rect y="40" width="180" height="60" fill="${c.dark}"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 20}" y="${36 + r() * 6}" width="18" height="8" fill="${c.mid}"/>`).join('')}${figure(40, 52, 1, c.ink, 1)}${figure(80, 54, 1, c.ink)}${figure(120, 52, 1, c.ink, 2)}<circle cx="150" cy="20" r="10" fill="${c.light}" opacity=".5"/>`,
  castle: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><path d="M50 100 L50 40 L60 30 L70 40 L70 30 L80 30 L80 22 L95 10 L110 22 L110 30 L120 30 L120 40 L130 30 L140 40 L140 100Z" fill="${c.dark}"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${60 + i * 12}" y="${50 + (i % 2) * 12}" width="4" height="7" fill="${c.light}"/>`).join('')}${figure(20, 76, .6, c.ink)}`,
  stage: (c, r, T) => `<rect width="180" height="100" fill="${c.dark}"/><path d="M90 0 L50 84 L130 84Z" fill="${c.light}" opacity=".3"/><rect y="84" width="180" height="16" fill="${c.mid}"/><rect x="0" y="0" width="24" height="84" fill="${c.mid}"/><rect x="156" y="0" width="24" height="84" fill="${c.mid}"/>${figure(90, 60, 1, c.ink, 1)}`,
  dojo: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/>${Array.from({ length: 5 }, (_, i) => `<rect x="${i * 40}" y="0" width="4" height="78" fill="${c.dark}" opacity=".5"/>`).join('')}<rect y="78" width="180" height="22" fill="${c.mid}"/>${figure(66, 54, 1.05, c.ink, 1)}${figure(112, 54, 1.05, c.dark, 2)}`,
  skyline: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 19}" y="${40 + r() * 40}" width="16" height="70" fill="${c.dark}"/>`).join('')}${figure(100, 22, 1, c.light, 1)}<path d="M92 34 l-24 18 l20 -4Z" fill="${c.mid}"/>`,
  interview: (c, r, T) => `<rect width="180" height="100" fill="${c.wall}"/><rect x="0" y="0" width="180" height="100" fill="${c.dark}" opacity=".35"/><circle cx="130" cy="20" r="8" fill="${c.light}"/><rect x="66" y="58" width="40" height="34" rx="4" fill="${c.dark}"/>${figure(86, 40, 1.2, c.ink)}<text x="12" y="92" font-size="7" fill="${c.light}" font-family="Barlow, sans-serif">INTERVIEW · ARCHIVE</text>`,
  toon: (c, r, T) => `<rect width="180" height="100" fill="${T.sky}"/><circle cx="${40 + r() * 30}" cy="60" r="22" fill="${c.mid}"/><circle cx="${120 + r() * 20}" cy="58" r="18" fill="${c.light}"/><circle cx="${48 + r() * 30}" cy="54" r="4" fill="${c.ink}"/><circle cx="${126 + r() * 20}" cy="54" r="3" fill="${c.ink}"/><rect y="80" width="180" height="20" fill="${c.dark}" opacity=".7"/>`
};
const GENRE_SHOTS = { Western: ['saloon', 'landscape', 'landscape'], 'Sci-fi': ['corridor', 'corridor', 'landscape'], Horror: ['hallway', 'hallway', 'doorway'], War: ['trench', 'trench', 'landscape'], Fantasy: ['castle', 'castle', 'landscape'], Musical: ['stage', 'stage', 'street'], 'Martial arts': ['dojo', 'dojo', 'chase'], Superhero: ['skyline', 'skyline', 'chase'], Action: ['chase', 'car', 'rooftop'], Crime: ['street', 'car', 'doorway'], Thriller: ['closeup', 'stairs', 'street'], Romance: ['twoshot', 'beach', 'rooftop'], Comedy: ['table', 'room', 'crowd'], Documentary: ['interview', 'interview', 'crowd'], Animation: ['toon', 'toon', 'toon'], Period: ['room', 'table', 'stairs'], Drama: ['room', 'table', 'twoshot'] };
const ANY_SHOTS = ['room', 'street', 'twoshot', 'closeup', 'table', 'car', 'rooftop', 'stairs', 'doorway', 'landscape', 'beach', 'crowd'];
function stillSVG(f, i) {
  const g = GENRE_LOOK[f.genre] || GENRE_LOOK.Drama, r = hashRand(f.id * 71 + i * 13 + 5);
  const old = (f.rel !== null ? yearOf(f.rel) : S.year) < 1952 && f.genre !== 'Animation';
  const tint = ['#7A5C3E', '#3E5A7A', '#5C7A3E', '#7A3E5C', '#6B6B6B'][Math.floor(r() * 5)];
  const c = { dark: mixC(g[0], '#111111', .25), mid: mixC(g[1], tint, .25), light: g[2], wall: mixC(g[1], g[2], .35 + r() * .3), ink: mixC(g[0], '#000000', .55) };
  const tod = Math.floor(r() * 3), night = f.genre === 'Horror' || f.genre === 'Crime' ? r() < .7 : tod === 2;
  const T = { night, sky: night ? mixC(g[0], '#05060c', .55) : tod === 1 ? mixC(g[1], '#F2A65A', .45) : mixC(g[2], '#9CC3E6', .35) };
  const G = GENRE_SHOTS[f.genre] || [], pool = G.length && r() < (i < G.length ? .75 : .45) ? [G[i % G.length]] : ANY_SHOTS;
  const k = pool[Math.floor(r() * pool.length)], wide = r() < .5;
  const body = (SHOTS[k] || SHOTS.room)(c, r, T);
  const bars = wide ? '<rect width="180" height="9" fill="#000"/><rect y="91" width="180" height="9" fill="#000"/>' : '';
  return `<svg class="still" viewBox="0 0 180 100" width="180" height="100" role="img" aria-label="Still from ${esc(f.title)}"${old ? ' style="filter:grayscale(1) contrast(1.15)"' : ''}>${body}${bars}</svg>`;
}
const STILL_CAPTIONS = ['Between takes on day {d}.', 'Rehearsing the big scene.', 'The crew waits for the light.', 'A setup that took all morning.', 'On location, week {w}.', 'The cast, wrapped and exhausted.', '{lead} in a scene cut from the final film.', 'The shot the director fought the studio for.', '{lead}, take {t}.', 'A frame from the trailer.', 'The scene everyone quotes.', 'Shot in a single afternoon.', 'The last shot of the schedule.', 'A rare quiet moment on set.', 'The night shoot, around 3 a.m.', '{dir} called it the heart of the film.'];
function stillsHTML(f) {
  const r = hashRand(f.id * 19 + 3), n = 3 + Math.floor(r() * 3), start = Math.floor(r() * STILL_CAPTIONS.length);
  const lead = f.cast && f.cast[0] !== undefined ? P(f.cast[0]).name : 'The lead', dir = P(f.dir).name;
  return `<div class="stills">${Array.from({ length: n }, (_, i) => `<figure>${stillSVG(f, i)}<figcaption>${esc(STILL_CAPTIONS[(start + i * 3) % STILL_CAPTIONS.length].replace('{d}', 1 + Math.floor(r() * 40)).replace('{w}', 1 + Math.floor(r() * 8)).replace('{t}', 2 + Math.floor(r() * 30)).replace('{lead}', lead).replace('{dir}', dir))}</figcaption></figure>`).join('')}</div>`;
}
// ---- the trailer: one of several kinds, cut from title cards and shots, paced to be read ----
const TRAILER_KINDS = ['classic', 'quotes', 'teaser', 'cast', 'comedy', 'horror'];
const QUOTE_PRAISE = [['A triumph.', 'Unmissable.', 'The film of the year.', 'Extraordinary.', 'I laughed, I cried, I called my mother.'], ['Gripping from start to finish.', 'A real crowd-pleaser.', 'Beautifully made.', 'You won\'t forget it.'], ['Bold and strange.', 'Something different.', 'Worth the trip.']];
function trailerKind(f) {
  const r = hashRand(f.id * 29 + 11)();
  if (f.genre === 'Horror' && r < .6) return 'horror';
  if (f.genre === 'Comedy' && r < .6) return 'comedy';
  if (f.rel === null) return r < .5 ? 'teaser' : 'classic';
  if ((f.reviews || 0) >= 72 && r < .6) return 'quotes';
  return ['classic', 'cast', 'teaser', 'classic'][Math.floor(r * 4)];
}
function trailerLines(f) {
  // each card: { t: text } or { shot: i } (a frame of the film); big: the title card
  const lead = f.cast[0] !== undefined ? P(f.cast[0]).name : '', co2 = f.cast[1] !== undefined ? P(f.cast[1]).name : '', co = f.co !== null ? S.companies[f.co].name : 'An independent picture';
  const dir = P(f.dir).name, title = { t: f.title.toUpperCase(), big: 1 }, end = { t: f.rel !== null ? 'NOW SHOWING' : 'COMING SOON' }, r = hashRand(f.id * 37 + 3);
  const prev = P(f.dir).credits.map(i => S.films[i]).filter(x => x && x.id !== f.id && x.rel !== null && x.rel < (f.rel ?? S.week)).sort((a, b) => b.total - a.total)[0];
  switch (trailerKind(f)) {
    case 'quotes': {
      const band = (f.reviews || 0) >= 80 ? 0 : (f.reviews || 0) >= 65 ? 1 : 2, Q = QUOTE_PRAISE[band];
      const q = k => `“${Q[Math.floor(r() * Q.length)]}”  — ${PAPERS[(f.id + k) % PAPERS.length]}`;
      return [{ shot: 0 }, { t: q(0) }, { shot: 1 }, { t: q(3) }, { t: '★★★★' + ((f.reviews || 0) >= 82 ? '★' : '') }, { shot: 2 }, { t: q(5) }, title, end];
    }
    case 'teaser': return [{ t: co.toUpperCase() + ' PRESENTS' }, { shot: 0 }, { t: filmTagline(f) }, { shot: 2 }, title, { t: f.rel !== null ? 'NOW SHOWING' : 'COMING ' + (f.rel === null ? 'SOON' : '') }];
    case 'cast': return [{ t: 'A FILM BY ' + dir.toUpperCase() }, { shot: 0 }, { t: lead.toUpperCase() }, { shot: 1 }, co2 ? { t: co2.toUpperCase() } : { shot: 3 }, { t: filmLogline(f) }, { shot: 2 }, title, end];
    case 'comedy': return [{ t: prev ? `FROM THE DIRECTOR OF ${prev.title.toUpperCase()}` : 'FROM THE PEOPLE WHO SHOULD HAVE KNOWN BETTER' }, { shot: 0 }, { t: filmLogline(f) }, { shot: 1 }, { t: 'THIS SUMMER…' }, { t: lead.toUpperCase() + (co2 ? ' AND ' + co2.toUpperCase() : '') }, { t: filmTagline(f) }, title, end];
    case 'horror': return [{ t: 'BASED ON EVENTS NOBODY WILL TALK ABOUT' }, { shot: 0 }, { t: '…' }, { shot: 1 }, { t: filmTagline(f) }, { shot: 2 }, { t: 'DON\'T WATCH ALONE.' }, title, end];
    default: return [{ t: co.toUpperCase() + ' PRESENTS' }, { t: prev ? `FROM THE DIRECTOR OF ${prev.title.toUpperCase()}` : 'A FILM BY ' + dir.toUpperCase() }, { shot: 0 }, { t: 'IN A WORLD WHERE…' }, { t: filmLogline(f) }, { shot: 1 }, { t: lead.toUpperCase() }, { t: filmTagline(f) }, { shot: 2 }, title, end];
  }
}
// How long a card stays up: long enough to read it comfortably, never a blink.
function cardTime(card) { return card.shot !== undefined ? 2600 : Math.min(9000, 2600 + card.t.length * 70); }
function playTrailer(id) {
  const f = S.films[id]; if (!f || typeof document === 'undefined') return;
  const old = document.getElementById('trailer'); if (old) old.remove();
  const c = GENRE_LOOK[f.genre] || GENRE_LOOK.Drama, L = trailerLines(f), el = document.createElement('div');
  el.id = 'trailer'; el.style.setProperty('--tc', c[2]); el.style.setProperty('--tb', c[0]);
  el.innerHTML = `<div class="tr-box"><div class="tr-line"></div><div class="tr-dots">${L.map(() => '<i></i>').join('')}</div><div class="tr-ctl"><button class="btn-s ghost tr-prev" aria-label="Back">‹</button><button class="btn-s ghost tr-pause">Pause</button><button class="btn-s ghost tr-next" aria-label="Next">›</button><button class="btn-s tr-close">Close</button></div></div>`;
  document.body.appendChild(el);
  const line = el.querySelector('.tr-line'), dots = [...el.querySelectorAll('.tr-dots i')], pauseB = el.querySelector('.tr-pause');
  let i = 0, timer = null, paused = false;
  const show = () => {
    clearTimeout(timer);
    if (i >= L.length) { line.className = 'tr-line show'; line.innerHTML = posterSVG(f, 170); dots.forEach(d => d.className = 'on'); return; }
    const card = L[i];
    dots.forEach((d, k) => d.className = k < i ? 'on' : k === i ? 'now' : '');
    line.className = 'tr-line';
    setTimeout(() => {
      if (card.shot !== undefined) { line.innerHTML = stillSVG(f, card.shot + 7).replace('width="180" height="100"', 'width="480" height="267"'); line.className = 'tr-line show shot'; }
      else { line.textContent = card.t; line.className = 'tr-line show' + (card.big ? ' big' : '') + (card.t.length > 60 ? ' long' : ''); }
      if (!paused) timer = setTimeout(() => { i++; show(); }, cardTime(card));
    }, 450);
  };
  const close = () => { clearTimeout(timer); el.remove(); };
  el.querySelector('.tr-close').onclick = close;
  el.querySelector('.tr-next').onclick = () => { i = Math.min(L.length, i + 1); show(); };
  el.querySelector('.tr-prev').onclick = () => { i = Math.max(0, i - 1); show(); };
  pauseB.onclick = () => { paused = !paused; pauseB.textContent = paused ? 'Play' : 'Pause'; if (paused) clearTimeout(timer); else timer = setTimeout(() => { i++; show(); }, 1200); };
  el.onclick = e => { if (e.target === el) close(); };
  show();
}
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
   ${credit('Director', [f.dir])}${credit(f.wri.length > 1 ? 'Screenplay' : 'Written by', f.wri)}${credit('Story by', x.story)}${credit('Produced by', [f.prod])}${credit('Executive producers', x.eprod)}${credit('Cinematography', [f.dp])}${credit('Editor', [f.ed])}${crew.map(k => credit(CREW_LABEL[k], [f.crew[k]])).join('')}${Object.keys(f.xc || {}).filter(id => !keyIds(f).includes(+id)).map(id => credit(f.xc[id], [+id])).join('')}
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
function geaHead(cur) { return `<div class="geahead"><span class="gealogo">GEA</span><span class="muted">The Global Entertainment Archive</span><span class="seg"><button class="pill${cur === 'films' ? ' on' : ''}" data-gea="films">Films</button><button class="pill${cur === 'people' ? ' on' : ''}" data-gea="people">People</button></span></div>`; }
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
