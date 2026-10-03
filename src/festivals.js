// ---------------- The festival circuit ----------------
// Two dozen festivals modelled on the real circuit, each with its city, founding year, sections, real-style submission
// rules, an artistic director and programmers, a jury with a president every year, several prizes with their own
// statuette, and a full record of winners worked out from the films of each year. Win one and the statuette is yours
// to keep on the shelf, show off, or sell (except an Oswald: the Academy only buys those back, for a dollar).
// extra fields: hub, founded, tier (1 A-list … 3), kind ('feature' | 'doc' | 'anim' | 'genre' | 'shorts' | 'showcase'),
// premiere ('world' | 'international' | 'national' | 'none'), sections, prizes [[name, statuette]]
const FEST_INFO = {
  mountain: { hub: 'hollywood', founded: 1978, tier: 1, kind: 'feature', premiere: 'world', small: 1, sections: ['U.S. Dramatic', 'World Cinema', 'Midnight', 'NEXT'], prizes: [['Grand Jury Prize', 'mountain'], ['Audience Award', 'mountain'], ['Directing Award', 'star']], who: 'An institute founded by a movie star to nurture independent filmmakers, in a ski town in January.' },
  cote: { hub: 'paris', founded: 1946, tier: 1, kind: 'feature', premiere: 'world', sections: ['Competition', 'Un Certain Regard', 'Directors\' Fortnight', 'Critics\' Week', 'Midnight'], prizes: [['Palme Dorée', 'palm'], ['Grand Prix', 'palm'], ['Best Director', 'palm'], ['Jury Prize', 'palm'], ['Caméra d\'Or', 'camera']], who: 'Run by a state-backed association on the Riviera; the most powerful festival in the world.' },
  lagoon: { hub: 'rome', founded: 1932, tier: 1, kind: 'feature', premiere: 'world', sections: ['Competition', 'Horizons', 'Out of Competition'], prizes: [['Golden Lion of the Lagoon', 'lion'], ['Silver Lion', 'lion'], ['Volpi Cup for Acting', 'cup']], who: 'The oldest film festival in the world, part of a city\'s great arts biennale, on a lido across the lagoon.' },
  north: { hub: 'toronto', founded: 1976, tier: 1, kind: 'showcase', premiere: 'national', sections: ['Gala', 'Special Presentations', 'Discovery', 'Midnight Madness'], prizes: [['Audience Award', 'maple'], ['Discovery Prize', 'maple']], who: 'A huge public festival where the audience votes; its winners often go on to win Oswalds.' },
  shorts: { hub: 'paris', founded: 1979, tier: 2, kind: 'feature', premiere: 'none', small: 1, sections: ['First Films', 'International'], prizes: [['Discovery Prize', 'anchor']], who: 'A small harbour-town festival devoted to first and second films.' },
  bruin: { name: 'the Bruin Film Festival', month: 1, bar: 76, fee: 100, prize: 'Golden Bruin', d: 'Winter, politics and the boldest films of the year.', hub: 'berlin', founded: 1951, tier: 1, kind: 'feature', premiere: 'world', sections: ['Competition', 'Encounters', 'Panorama', 'Forum'], prizes: [['Golden Bruin', 'bear'], ['Silver Bruin', 'bear'], ['Best Leading Performance', 'bear']], who: 'Founded in a divided city as a window on the free world; still the most political of the great three.' },
  leopard: { name: 'the Lakeside Leopard Festival', month: 7, bar: 70, fee: 80, prize: 'Golden Leopard', d: 'Eight thousand people in a piazza watching art films under the stars.', hub: 'berlin', founded: 1946, tier: 2, kind: 'feature', premiere: 'international', sections: ['Concorso', 'Filmmakers of the Present', 'Piazza Grande'], prizes: [['Golden Leopard', 'leopard'], ['Special Jury Prize', 'leopard']], who: 'A lakeside town\'s festival with a reputation for daring, adventurous cinema.' },
  shell: { name: 'the Shell Bay Festival', month: 8, bar: 70, fee: 80, prize: 'Golden Shell', d: 'Spain\'s great festival, on a bay of white sand.', hub: 'madrid', founded: 1953, tier: 2, kind: 'feature', premiere: 'international', sections: ['Official Selection', 'New Directors', 'Horizons Latinos'], prizes: [['Golden Shell', 'shell'], ['Silver Shell', 'shell']], who: 'The biggest Spanish-language festival, a bridge to Latin American cinema.' },
  springs: { name: 'the Hot Springs Film Festival', month: 6, bar: 66, fee: 70, prize: 'Crystal Globe', d: 'A spa town full of young people sleeping in tents to see films.', hub: 'prague', founded: 1946, tier: 2, kind: 'feature', premiere: 'international', sections: ['Crystal Globe Competition', 'Proxima'], prizes: [['Crystal Globe', 'globe']], who: 'Central Europe\'s great festival, revived after the Velvet Revolution.' },
  haeundae: { name: 'the Haeundae International Film Festival', month: 9, bar: 64, fee: 60, prize: 'New Currents Award', d: 'Asia\'s biggest festival, on a beach in a port city.', hub: 'seoul', founded: 1996, tier: 2, kind: 'feature', premiere: 'international', sections: ['New Currents', 'Window on Asian Cinema', 'Gala Presentation'], prizes: [['New Currents Award', 'wave']], who: 'Founded to give Asian cinema its own showcase; now its main market too.' },
  tokyo: { name: 'the Tokyo International Film Festival', month: 9, bar: 64, fee: 60, prize: 'Tokyo Grand Prix', d: 'A city festival with a competition and a crowded market.', hub: 'tokyo', founded: 1985, tier: 2, kind: 'feature', premiere: 'international', sections: ['Competition', 'Asian Future', 'Gala'], prizes: [['Tokyo Grand Prix', 'star']], who: 'Japan\'s international festival, run with the film industry\'s support.' },
  southbound: { name: 'South by Southbound', month: 2, bar: 56, fee: 60, prize: 'Narrative Feature Award', d: 'Films, music and technology in a sweaty week in Texas.', hub: 'hollywood', founded: 1987, tier: 2, kind: 'genre', premiere: 'world', small: 1, sections: ['Narrative Feature', 'Documentary', 'Midnighters'], prizes: [['Narrative Feature Award', 'guitar'], ['Audience Award', 'guitar']], who: 'A music conference that grew a film festival and a tech fair.' },
  manhattan: { name: 'the Lower Manhattan Film Festival', month: 5, bar: 58, fee: 70, prize: 'Founders Award', d: 'Founded to bring life back downtown; now a big city festival.', hub: 'newyork', founded: 2002, tier: 2, kind: 'feature', premiere: 'world', sections: ['U.S. Narrative', 'International Narrative', 'Documentary'], prizes: [['Founders Award', 'apple']], who: 'Started by a movie star and a producer after the towers fell.' },
  alpine: { name: 'the Alpine Lake Animation Festival', month: 5, bar: 60, fee: 60, prize: 'Cristal', d: 'The capital of animation for one week a year.', hub: 'paris', founded: 1960, tier: 1, kind: 'anim', premiere: 'none', sections: ['Feature Films', 'Contrechamp', 'Shorts'], prizes: [['Cristal for a Feature Film', 'crystal']], who: 'Born from an animation week at Cannes; the whole industry comes to the lake.' },
  canal: { name: 'the Canal Documentary Festival', month: 10, bar: 60, fee: 50, prize: 'Best Feature Documentary', d: 'The world\'s biggest documentary festival, in a city of canals.', hub: 'paris', founded: 1988, tier: 1, kind: 'doc', premiere: 'international', sections: ['International Competition', 'Envision', 'Frontlight'], prizes: [['Best Feature Documentary', 'eye']], who: 'A documentary festival and market where most of the year\'s great docs are bought.' },
  hottakes: { name: 'Hot Takes Documentary Festival', month: 3, bar: 54, fee: 50, prize: 'Best International Feature', d: 'North America\'s documentary festival.', hub: 'toronto', founded: 1993, tier: 2, kind: 'doc', premiere: 'national', sections: ['Special Presentations', 'Canadian Spectrum'], prizes: [['Best International Feature', 'eye']], who: 'Run by documentary makers for documentary makers.' },
  midnight: { name: 'the Midnight Coast Fantastic Festival', month: 9, bar: 52, fee: 50, prize: 'Best Film (Fantastic)', d: 'Horror, sci-fi and fantasy on the Catalan coast; zombie walks included.', hub: 'madrid', founded: 1968, tier: 2, kind: 'genre', premiere: 'none', genres: ['Horror', 'Sci-fi', 'Fantasy', 'Thriller', 'Animation'], sections: ['Official Fantàstic', 'Midnight X-Treme'], prizes: [['Best Film (Fantastic)', 'skull']], who: 'The world\'s leading genre festival.' },
  gateway: { name: 'the Gateway Film Festival', month: 9, bar: 54, fee: 40, prize: 'Golden Gateway', d: 'Mumbai\'s festival of independent and world cinema.', hub: 'mumbai', founded: 1997, tier: 3, kind: 'feature', premiere: 'national', sections: ['South Asia Competition', 'World Cinema'], prizes: [['Golden Gateway', 'gateway']], who: 'Run by a film foundation to champion independent South Asian cinema.' },
  ouaga: { name: 'the Pan-African Film Festival', month: 1, bar: 52, fee: 30, prize: 'Golden Stallion', d: 'Every other year, Africa\'s cinema meets in Ouagadougou.', hub: 'dakar', founded: 1969, tier: 2, kind: 'feature', premiere: 'none', sections: ['Feature Competition', 'Panorama'], prizes: [['Golden Stallion', 'stallion']], who: 'The largest festival of African cinema, held in the odd years.' },
  tiger: { name: 'the Tiger Port Festival', month: 0, bar: 60, fee: 60, prize: 'Tiger Award', d: 'Adventurous independent films in a cold port city.', hub: 'berlin', founded: 1972, tier: 2, kind: 'feature', premiere: 'world', small: 1, sections: ['Tiger Competition', 'Bright Future', 'Harbour'], prizes: [['Tiger Award', 'tiger']], who: 'Founded by a critic to champion independent and experimental film.' },
  harbourhk: { name: 'the Hong Kong International Film Festival', month: 2, bar: 56, fee: 50, prize: 'Firebird Award', d: 'Asia\'s oldest festival and a market in March.', hub: 'hongkong', founded: 1977, tier: 3, kind: 'feature', premiere: 'none', sections: ['Firebird Competition', 'Gala'], prizes: [['Firebird Award', 'bird']], who: 'Run by a society that also runs the city\'s film market.' },
  plata: { name: 'the Mar de Plata Festival', month: 10, bar: 56, fee: 40, prize: 'Golden Astor', d: 'Latin America\'s A-list festival, by the sea in Argentina.', hub: 'buenosaires', founded: 1954, tier: 3, kind: 'feature', premiere: 'international', sections: ['International Competition', 'Latin American Competition'], prizes: [['Golden Astor', 'star']], who: 'Founded by the state, revived after the dictatorship.' },
  londonff: { name: 'the London Film Festival', month: 9, bar: 58, fee: 60, prize: 'Best Film', d: 'The year\'s best films, a fortnight in Leicester Square.', hub: 'london', founded: 1957, tier: 2, kind: 'showcase', premiere: 'national', sections: ['Official Competition', 'First Feature', 'Galas'], prizes: [['Best Film', 'star']], who: 'Run by the national film institute, showing the year\'s best before they open.' },
  pass: { name: 'the Mountain Pass Showcase', month: 8, bar: 78, fee: 0, prize: 'Silver Medallion', d: 'Invitation only, no competition, no announced line-up: the Oswald race starts here.', hub: 'hollywood', founded: 1974, tier: 1, kind: 'showcase', premiere: 'none', sections: ['Main Program'], prizes: [['Silver Medallion', 'medal']], who: 'A tiny mountain-town festival whose secret line-up launches awards campaigns.' }
};
for (const [k, X] of Object.entries(FEST_INFO)) { let F = FESTIVALS.find(f => f.k === k); if (!F) { F = { k, name: X.name, month: X.month, bar: X.bar, fee: X.fee, prize: X.prize, d: X.d }; FESTIVALS.push(F); } Object.assign(F, X, { name: F.name, month: F.month, bar: F.bar, fee: F.fee, prize: F.prize, d: F.d }); }
FESTIVALS.find(f => f.k === 'cote').prize = 'Palme Dorée';
// ---- the rules ----
function festFits(F, f) {
  if (F.fee === 0) return false;   // invitation only
  if (F.kind === 'doc' && f.genre !== 'Documentary') return false;
  if (F.kind === 'anim' && f.genre !== 'Animation') return false;
  if (F.kind === 'genre' && F.genres && !F.genres.includes(f.genre)) return false;
  const shown = (S.me && S.me.fests || []).filter(x => x.film === f.id && x.sel).map(x => FESTIVALS.find(y => y.k === x.k));
  if (F.premiere === 'world' && (f.rel !== null || shown.length)) return false;
  if (F.premiere === 'international' && (f.rel !== null && S.week - f.rel > 12 || shown.some(y => HUBS[y.hub] && HUBS[y.hub].m !== HUBS[f.hub].m))) return false;
  if (F.premiere === 'national' && shown.some(y => y.hub && HUBS[y.hub].m === HUBS[F.hub].m)) return false;
  return true;
}
function festRules(F) {
  const P0 = { world: 'World premiere only: the film can\'t have been released or shown at another festival.', international: 'International premiere: not yet shown outside its home country, and released no more than three months ago.', national: 'National premiere: not yet shown elsewhere in this country.', none: 'No premiere requirement.' }[F.premiere || 'none'];
  return [P0, F.kind === 'doc' ? 'Documentaries only.' : F.kind === 'anim' ? 'Animation only.' : F.kind === 'genre' ? `Genre films: ${(F.genres || ['horror, sci-fi, fantasy and thriller']).join(', ').toLowerCase()}.` : 'Feature films (over 70 minutes).', F.fee ? `Submission fee ${fmtCash(usdW(F.fee))}. Deadline about three months before the ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][F.month]} festival.` : 'No submissions: the festival invites films.', `The programmers look for films of about ${F.bar}/100 quality${F.small ? '; first features and small independent films get a real advantage' : ''}.`];
}
// ---- who runs it, who judges it: real people of the world, picked by hash for each year ----
function festPeople(F, y) {
  const r = hashRand(y * 977 + F.k.length * 31 + F.k.charCodeAt(0)), alive = id => P(id) && !P(id).dead && S.year - P(id).born < 90 && P(id).born < y - 25;
  const pick = (L, n, used) => { const out = []; for (let i = 0; i < 40 && out.length < n && L.length; i++) { const id = L[Math.floor(r() * L.length)]; if (!used.has(id) && alive(id)) { used.add(id); out.push(id); } } return out; };
  const hubPool = role => (S.pool[F.hub] && S.pool[F.hub][role] || []).concat(S.hist[F.hub] && S.hist[F.hub][role] || []);
  const stars = role => S.people.filter(p => p.role === role && p.standing >= 55 && !p.dead).map(p => p.id);
  const used = new Set(), seed = Math.floor(y / 6);   // directors serve about six years
  const rd = hashRand(seed * 131 + F.k.length), dirL = hubPool('producer').filter(alive), director = dirL.length ? dirL[Math.floor(rd() * dirL.length)] : null; if (director !== null) used.add(director);
  const programmers = pick(hubPool('writer').concat(hubPool('editor')), 3, used);
  const president = pick(stars('director'), 1, used)[0] ?? null, jury = pick(stars('actor').concat(stars('writer'), stars('dp'), stars('director')), 4, used);
  return { director, programmers, president, jury };
}
// ---- the record: winners every year, from the films of the year ----
const FEST_CACHE = new Map(); let FBY = null, FBY_K = '';
function filmsByYear() { const k = S.films.length + ':' + S.week; if (FBY && FBY_K === k && FBY.S === S) return FBY.m; const m = {}; for (const f of S.films) if (f.rel !== null && f.q !== null && f.q !== undefined) (m[yearOf(f.rel)] = m[yearOf(f.rel)] || []).push(f); FBY = { S, m }; FBY_K = k; return m; }
function festWinners(F, y) {
  const key = F.k + ':' + y + ':' + S.films.length; if (FEST_CACHE.has(key)) return FEST_CACHE.get(key);
  const pool = (filmsByYear()[y] || []).filter(f => (F.kind !== 'doc' || f.genre === 'Documentary') && (F.kind !== 'anim' || f.genre === 'Animation') && (F.kind !== 'genre' || !F.genres || F.genres.includes(f.genre)));
  const score = f => f.q + (F.small && (f.tier === 3 || f.co === null) ? 6 : 0) + (HUBS[f.hub] && HUBS[F.hub] && HUBS[f.hub].m === HUBS[F.hub].m ? 3 : 0) + hashRand(f.id * 13 + F.k.length + y)() * 8;
  const ranked = pool.filter(f => f.q >= F.bar - 8).sort((a, b) => score(b) - score(a)), out = [];
  const base = F.prizes || [[F.prize, 'star']], extra = [['Best Director', /Direct/], ['Best Performance', /Act|Perform|Volpi/], ['Best Screenplay', /Screenplay|Script|Writ/], ['Audience Award', /Audience|Public/]].filter(([, re]) => !base.some(([n]) => re.test(n))).map(([n]) => [n, 'plaque']);
  const prizes = F.tier === 3 ? base.concat(extra.filter(([n]) => n === 'Audience Award')) : base.concat(extra);
  prizes.forEach(([name], i) => { const f = ranked[i < base.length ? i : (base.length + hashRand(y * 7 + i)() * Math.min(6, ranked.length - base.length)) | 0] || ranked[i]; if (f) out.push({ y, cat: name, film: f.id, people: /Act|Perform|Volpi/.test(name) ? [f.cast[0]] : /Screenplay/.test(name) ? (f.wri || []).slice(0, 2) : [f.dir] }); });
  if (F.k === 'ouaga' && y % 2 === 0) out.length = 0;   // the pan-African festival is held in odd years
  FEST_CACHE.set(key, out); return out;
}
function festRecord(F) {
  const y0 = Math.max(F.founded || 1950, 1930), out = [], recorded = typeof filmAwardIndex === 'function' ? (filmAwardIndex()[F.name.replace(/^the /, '')] || filmAwardIndex()[F.prize] || []) : [];
  for (let y = S.year - 1; y >= y0; y--) { const rec = recorded.filter(x => x.y === y); const have = new Set(rec.map(x => x.cat)); out.push(...rec, ...festWinners(F, y).filter(x => !have.has(x.cat) && !rec.some(r => r.film === x.film && x.cat.includes(r.cat.split(',')[0])))); }
  return out;
}
// ---- the statuettes ----
const STATUETTES = {
  palm: ['Palm frond in gold', (c, d) => `<path d="M40 70 Q40 40 40 20" stroke="${d}" stroke-width="3" fill="none"/>${Array.from({ length: 9 }, (_, i) => `<path d="M40 ${24 + i * 5} q${i % 2 ? 14 : -14} -4 ${i % 2 ? 18 : -18} 2" stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('')}`],
  lion: ['Winged lion in gold', (c, d) => `<path d="M24 66 L28 46 Q30 34 40 32 Q52 30 56 40 L58 66Z" fill="${c}"/><circle cx="34" cy="30" r="9" fill="${c}" stroke="${d}"/><path d="M44 36 Q58 18 66 22 Q58 30 50 40Z" fill="${d}"/>`],
  bear: ['Standing bear cub', (c, d) => `<ellipse cx="40" cy="48" rx="13" ry="18" fill="${c}"/><circle cx="40" cy="26" r="9" fill="${c}"/><circle cx="33" cy="19" r="3.5" fill="${c}"/><circle cx="47" cy="19" r="3.5" fill="${c}"/><path d="M28 38 l-8 -8 M52 38 l8 -8" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`],
  leopard: ['Leaping leopard', (c, d) => `<path d="M14 50 Q30 30 50 36 Q62 38 68 30 L66 40 Q60 46 52 46 L46 62 L40 62 L42 48 Q30 50 24 62 L18 62Z" fill="${c}"/>${[0, 1, 2, 3].map(i => `<circle cx="${30 + i * 6}" cy="${42 + (i % 2) * 3}" r="1.6" fill="${d}"/>`).join('')}`],
  shell: ['Scallop shell', (c, d) => `<path d="M40 64 L18 34 Q40 10 62 34Z" fill="${c}"/>${[-16, -8, 0, 8, 16].map(x => `<path d="M40 64 L${40 + x * 1.3} 24" stroke="${d}" stroke-width="1.5"/>`).join('')}`],
  globe: ['Crystal globe', (c, d) => `<circle cx="40" cy="38" r="20" fill="#DDF1F7" stroke="#9FCFE0" stroke-width="2" opacity=".95"/><path d="M22 34 Q40 44 58 34 M40 18 Q32 38 40 58" stroke="#9FCFE0" fill="none"/><path d="M30 60 L50 60 L46 66 L34 66Z" fill="${c}"/>`],
  wave: ['Silver wave', (c, d) => `<path d="M16 60 Q22 30 40 28 Q58 26 60 44 Q50 36 42 44 Q34 52 44 60Z" fill="${c}"/>`],
  star: ['Star on a column', (c, d) => `<rect x="36" y="38" width="8" height="28" fill="${d}"/><path d="M40 12 L45 26 L60 26 L48 34 L52 48 L40 40 L28 48 L32 34 L20 26 L35 26Z" fill="${c}"/>`],
  mountain: ['Twin peaks in bronze', (c, d) => `<path d="M14 64 L32 26 L42 44 L50 32 L66 64Z" fill="${c}"/><path d="M28 34 L32 26 L36 34Z M47 38 L50 32 L53 38Z" fill="#fff" opacity=".8"/>`],
  camera: ['Golden camera', (c, d) => `<rect x="18" y="34" width="36" height="24" rx="3" fill="${c}"/><circle cx="30" cy="28" r="7" fill="${c}" stroke="${d}"/><circle cx="44" cy="28" r="7" fill="${c}" stroke="${d}"/><path d="M54 40 L64 34 L64 58 L54 52Z" fill="${d}"/>`],
  cup: ['Silver cup', (c, d) => `<path d="M24 22 L56 22 Q56 48 40 50 Q24 48 24 22Z" fill="${c}"/><path d="M24 26 Q14 28 18 38 Q20 42 26 40 M56 26 Q66 28 62 38 Q60 42 54 40" stroke="${c}" stroke-width="3" fill="none"/><rect x="36" y="50" width="8" height="10" fill="${d}"/>`],
  maple: ['Maple leaf', (c, d) => `<path d="M40 14 L44 26 L54 22 L50 34 L62 36 L52 44 L56 54 L44 50 L42 64 L38 64 L36 50 L24 54 L28 44 L18 36 L30 34 L26 22 L36 26Z" fill="${c}"/>`],
  anchor: ['Ship\'s anchor', (c, d) => `<circle cx="40" cy="20" r="5" fill="none" stroke="${c}" stroke-width="3"/><path d="M40 25 L40 62 M28 36 L52 36 M20 50 Q40 72 60 50" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`],
  guitar: ['Gold guitar', (c, d) => `<ellipse cx="34" cy="50" rx="12" ry="12" fill="${c}"/><ellipse cx="40" cy="38" rx="9" ry="9" fill="${c}"/><rect x="44" y="12" width="5" height="30" fill="${d}" transform="rotate(25 46 26)"/><circle cx="36" cy="46" r="3" fill="${d}"/>`],
  apple: ['Apple in glass', (c, d) => `<path d="M40 26 Q28 18 22 32 Q18 52 34 62 Q40 60 46 62 Q62 52 58 32 Q52 18 40 26Z" fill="${c}"/><path d="M40 26 Q42 16 48 14" stroke="${d}" stroke-width="2" fill="none"/>`],
  crystal: ['Faceted crystal', (c, d) => `<path d="M40 12 L58 30 L50 62 L30 62 L22 30Z" fill="#E8F4FA" stroke="#A8D4E6" stroke-width="2"/><path d="M40 12 L40 62 M22 30 L58 30" stroke="#A8D4E6"/>`],
  eye: ['Open eye', (c, d) => `<path d="M14 40 Q40 14 66 40 Q40 66 14 40Z" fill="${c}"/><circle cx="40" cy="40" r="9" fill="${d}"/><circle cx="40" cy="40" r="4" fill="#111"/>`],
  skull: ['Grinning skull', (c, d) => `<path d="M24 40 Q24 18 40 18 Q56 18 56 40 L52 48 L52 56 L28 56 L28 48Z" fill="${c}"/><circle cx="33" cy="38" r="5" fill="${d}"/><circle cx="47" cy="38" r="5" fill="${d}"/><path d="M34 50 v6 M40 50 v6 M46 50 v6" stroke="${d}" stroke-width="2"/>`],
  gateway: ['Gateway arch', (c, d) => `<path d="M18 64 L18 30 Q40 8 62 30 L62 64 L52 64 L52 36 Q40 24 28 36 L28 64Z" fill="${c}"/>`],
  stallion: ['Rearing stallion', (c, d) => `<path d="M24 64 L30 44 Q26 30 36 22 Q44 16 50 22 L54 18 L54 28 Q58 36 50 42 L48 64 L42 64 L42 48 L34 50 L30 64Z" fill="${c}"/>`],
  tiger: ['Tiger head', (c, d) => `<circle cx="40" cy="40" r="20" fill="${c}"/><circle cx="26" cy="22" r="6" fill="${c}"/><circle cx="54" cy="22" r="6" fill="${c}"/>${[-10, 0, 10].map(x => `<path d="M${40 + x} 22 l-2 8" stroke="${d}" stroke-width="3"/>`).join('')}<circle cx="33" cy="38" r="3" fill="${d}"/><circle cx="47" cy="38" r="3" fill="${d}"/>`],
  bird: ['Firebird', (c, d) => `<path d="M14 46 Q30 40 40 30 Q50 18 62 20 Q52 28 54 36 Q44 34 40 46 Q30 58 18 56 Q26 50 14 46Z" fill="${c}"/><path d="M40 46 Q42 60 34 66" stroke="${d}" stroke-width="3" fill="none"/>`],
  medal: ['Silver medallion', (c, d) => `<path d="M30 12 L40 34 L50 12" stroke="${d}" stroke-width="5" fill="none"/><circle cx="40" cy="46" r="16" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M33 46 L38 51 L48 41" stroke="${d}" stroke-width="3" fill="none"/>`],
  oswald: ['The Oswald: a knight holding a reel', (c, d) => `<ellipse cx="40" cy="62" rx="11" ry="3.5" fill="${c}"/><path d="M33 61 L47 61 M36 59 L44 64 M44 59 L36 64" stroke="${d}" stroke-width=".8"/><ellipse cx="40" cy="12" rx="4.6" ry="5.4" fill="${c}"/><path d="M37.5 17 L42.5 17 L42 20 L38 20Z" fill="${c}"/><path d="M31 22 Q40 19 49 22 L47 34 Q45 46 44 59 L36 59 Q35 46 33 34Z" fill="${c}"/><path d="M33 26 Q36 34 40 35 Q44 34 47 26" stroke="${d}" stroke-width="1" fill="none"/><path d="M40 30 L40 59" stroke="${d}" stroke-width="1.6"/><path d="M36 32 L44 32" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/><path d="M38 45 L38 58 M42 45 L42 58" stroke="${d}" stroke-width=".6" opacity=".6"/>`],
  gramophone: ['A golden gramophone', (c, d) => `<rect x="24" y="48" width="32" height="12" fill="${c}"/><path d="M40 48 L40 34 Q30 20 18 18 Q34 10 60 18 Q48 22 40 34" fill="${c}" stroke="${d}"/>`],
  footlight: ['A footlight and its glow', (c, d) => `<path d="M22 56 L58 56 L52 40 L28 40Z" fill="${c}"/><circle cx="40" cy="34" r="8" fill="#FFF3B0"/><path d="M28 22 L40 34 L52 22" stroke="#FFE07A" stroke-width="2" fill="none"/>`],
  emmet: ['Winged figure holding an atom', (c, d) => `<path d="M40 22 L36 60 L44 60Z" fill="${c}"/><path d="M38 30 Q22 22 18 34 Q28 32 38 36 M42 30 Q58 22 62 34 Q52 32 42 36" fill="${c}"/><ellipse cx="40" cy="16" rx="9" ry="4" fill="none" stroke="${d}" stroke-width="1.5"/><ellipse cx="40" cy="16" rx="9" ry="4" fill="none" stroke="${d}" stroke-width="1.5" transform="rotate(60 40 16)"/>`],
  mic: ['A golden microphone', (c, d) => `<rect x="34" y="12" width="12" height="22" rx="6" fill="${c}"/><path d="M28 28 Q28 42 40 42 Q52 42 52 28" stroke="${c}" stroke-width="3" fill="none"/><path d="M40 42 L40 58 M30 58 L50 58" stroke="${c}" stroke-width="3"/>`],
  plaque: ['An engraved plaque', (c, d) => `<rect x="20" y="16" width="40" height="46" rx="3" fill="${d}"/><rect x="25" y="21" width="30" height="36" fill="${c}"/><path d="M30 30 h20 M30 38 h20 M30 46 h14" stroke="${d}" stroke-width="2"/>`]
};
function statuetteSVG(kind, metal = 'gold', s = 80) {
  const [, draw] = STATUETTES[kind] || STATUETTES.star;
  const T = { gold: ['#7A5A12', '#C8962A', '#F6D77A', '#FFF4C8'], silver: ['#5E646C', '#A9AFB7', '#E4E8EC', '#FFFFFF'], bronze: ['#5A3315', '#A2622E', '#D9955A', '#F7CFA4'] }[metal] || ['#7A5A12', '#C8962A', '#F6D77A', '#FFF4C8'];
  const id = `st-${kind}-${metal}`, g = `url(#${id}m)`;
  return `<svg class="statuette" viewBox="0 0 80 100" width="${s}" height="${Math.round(s * 1.25)}" role="img" aria-label="${esc(STATUETTES[kind] ? STATUETTES[kind][0] : 'statuette')}"><defs>
   <linearGradient id="${id}m" x1="0" x2="1" y1="0" y2=".25"><stop offset="0" stop-color="${T[0]}"/><stop offset=".28" stop-color="${T[1]}"/><stop offset=".46" stop-color="${T[3]}"/><stop offset=".58" stop-color="${T[2]}"/><stop offset="1" stop-color="${T[0]}"/></linearGradient>
   <linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3A3A40"/><stop offset=".5" stop-color="#1C1C21"/><stop offset="1" stop-color="#0B0B0E"/></linearGradient>
   <linearGradient id="${id}t" x1="0" x2="1"><stop offset="0" stop-color="#2A2A30"/><stop offset=".5" stop-color="#55555E"/><stop offset="1" stop-color="#2A2A30"/></linearGradient>
   <radialGradient id="${id}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
   <ellipse cx="40" cy="95" rx="30" ry="4" fill="url(#${id}s)"/>
   <g stroke-linejoin="round">${draw(g, T[0])}</g>
   <rect x="26" y="66" width="28" height="4" rx="1" fill="url(#${id}t)"/>
   <path d="M22 70 H58 L60 76 H20Z" fill="url(#${id}b)"/>
   <rect x="17" y="76" width="46" height="16" rx="2" fill="url(#${id}b)"/>
   <rect x="17" y="76" width="46" height="1.2" fill="#fff" opacity=".18"/>
   <rect x="27" y="80" width="26" height="8" rx="1" fill="${g}"/>
   <path d="M30 83 h20 M32 85.5 h16" stroke="${T[0]}" stroke-width=".8" opacity=".8"/></svg>`;
}
// which statuette a prize earns
function trophyKind(name) {
  if (/Academy Oswalds/.test(name)) return ['oswald', 'gold'];
  if (/Gramophone/.test(name)) return ['gramophone', 'gold'];
  if (/Footlight/.test(name)) return ['footlight', 'silver'];
  if (/Emmet/.test(name)) return ['emmet', 'gold'];
  if (/Golden Mic/.test(name)) return ['mic', 'gold'];
  for (const F of FESTIVALS) { const p = (F.prizes || []).find(([n]) => name.includes(n)); if (p && (name.includes(F.name.replace(/^the /, '')) || name.includes(F.prize))) return [p[1], /Silver/.test(p[0]) ? 'silver' : 'gold']; }
  if (typeof bodyTrophy === 'function') { const b = awardBodies().find(x => [x.key, ...(x.alias || [])].some(k => name.startsWith(k) || name.includes(', ' + k))); if (b) return bodyTrophy(b); }
  if (/Film Awards|Awards|Prize/.test(name)) return ['star', 'gold'];
  return ['plaque', 'bronze'];
}
// ---- your trophies ----
function trophyValue(t) { const base = { oswald: 1, gramophone: 30000, footlight: 22000, emmet: 20000, palm: 120000, lion: 90000, bear: 80000, mic: 8000 }[t.kind] || (t.prestige === 1 ? 40000 : t.prestige === 2 ? 12000 : 3000); return t.kind === 'oswald' ? 1 : Math.round(usd(base) * (1 + (ME().fame || 0) / 40) * (1 + Math.min(1, (S.year - t.y) / 30))); }
function trophyWeek() {
  const M = S.me, ms = M.milestones || [], from = M.trophyMs || 0;
  for (let i = from; i < ms.length; i++) { const m = ms[i]; if (m.kind !== 'prize' || !(/^Won /.test(m.t) || / won the .+ at /.test(m.t))) continue; const [kind, metal] = trophyKind(m.t), body = typeof awardBodies === 'function' ? awardBodies().find(b => m.t.includes(b.key)) : null; (M.trophies = M.trophies || []).push({ id: (M.trophyN = (M.trophyN || 0) + 1), name: m.t.replace(/^Won (at )?/, '').replace(/^.+ won the (.+) at (the )?(.+)$/, '$1, $3'), kind, metal, y: yearOf(m.w), w: m.w, prestige: body ? body.prestige : 3 }); }
  M.trophyMs = ms.length;
}
function trophyAct(a) {
  const M = S.me, me = ME(), t = (M.trophies || []).find(x => x.id === a.id); if (!t || t.sold) return false;
  if (a.k === 'show') { if (t.shown) return false; t.shown = S.week; me.fame = clamp((me.fame || 0) + 1, 0, 100); if (M.fol) for (const k in M.fol) M.fol[k] = Math.round(M.fol[k] * 1.02 + 5); diary(`You post a photo with your ${STATUETTES[t.kind][0].toLowerCase()}. The likes pour in.`); return true; }
  if (a.k === 'sell') { const v = trophyValue(t); t.sold = S.week; M.cash += v; if (t.kind === 'oswald') { diary('The Academy buys your Oswald back for one dollar, as the rules say. You keep the photograph.'); } else { me.standing = clamp(me.standing - .5, 0, 100); news('People', `${me.name} sells a ${t.name} at auction for ${fmtCash(v)}.`, { person: me.id }); diary(`Sold at auction: ${t.name}, ${fmtCash(v)}.`); } return true; }
  return false;
}
function trophyShelfHTML() {
  const L = (S.me.trophies || []).filter(t => !t.sold), sold = (S.me.trophies || []).filter(t => t.sold);
  return `<section class="panel trophies"><h3>Trophy shelf <span class="count">${L.length}</span></h3>${L.length ? `<div class="shelf">${L.map(t => `<figure>${statuetteSVG(t.kind, t.metal, 70)}<figcaption><b>${esc(t.name)}</b><br><span class="muted small">${t.y}</span><br>${t.shown ? '<span class="muted small">shown off</span>' : `<button class="linkish small" data-trophy="show:${t.id}">Show it off</button>`} · <button class="linkish small" data-trophy="sell:${t.id}" title="${t.kind === 'oswald' ? 'Academy rules: Oswalds can only be sold back to the Academy, for $1' : 'Auction estimate'}">Sell (${fmtCash(trophyValue(t))})</button></figcaption></figure>`).join('')}</div>` : '<p class="muted">Empty for now. Win a festival prize, an award or a contest and the statuette lands here.</p>'}${sold.length ? `<p class="muted small">Sold: ${sold.map(t => esc(t.name)).join(' · ')}</p>` : ''}</section>`;
}
// ---- the festival page ----
function festivalPage(F) {
  const y = +(UI.festY || S.year), ppl = festPeople(F, y), rec = festRecord(F), years = [...new Set(rec.map(r => r.y))];
  return `<div class="cols two"><section class="panel"><h3>The festival</h3><p>${esc(F.who || F.d)}</p><p class="small muted">${esc(hubName(F.hub))} · founded ${F.founded} · ${['', 'A-list', 'major', 'regional'][F.tier]} · ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][F.month]}</p>
    <h4>Sections</h4><p class="small">${(F.sections || []).map(esc).join(' · ')}</p>
    <h4>How to get in</h4><ul class="plain small">${festRules(F).map(r => `<li>• ${esc(r)}</li>`).join('')}</ul>
    <h4>Prizes</h4><div class="shelf">${(F.prizes || []).map(([n, k]) => `<figure>${statuetteSVG(k, /Silver/.test(n) ? 'silver' : 'gold', 56)}<figcaption class="small"><b>${esc(n)}</b><br><span class="muted">${esc(STATUETTES[k][0])}</span></figcaption></figure>`).join('')}</div></section>
   <section class="panel"><h3>Who runs it, ${y}</h3><p class="small">${ppl.director !== null ? `Artistic director: ${pl(ppl.director)}` : ''}${ppl.programmers.length ? `<br>Programmers: ${ppl.programmers.map(pl).join(', ')}` : ''}</p><p class="small">${ppl.president !== null ? `Jury president: ${pl(ppl.president)}` : ''}${ppl.jury.length ? `<br>Jury: ${ppl.jury.map(pl).join(', ')}` : ''}</p>
    <label class="small">Year <select id="fest-y">${Array.from({ length: Math.min(60, S.year - F.founded + 1) }, (_, i) => S.year - i).map(v => `<option${v === y ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
    <h4>Line-up, ${y}</h4>${(() => { const LU = typeof festLineup === 'function' ? festLineup(F, y) : []; return LU.length ? `<ul class="plain small">${LU.map(x => `<li><span class="muted">${esc(x.sec)}</span> · ${fl(x.f.id)}</li>`).join('')}</ul>` : '<p class="muted small">No line-up on record for that year.</p>'; })()}<p class="muted small">${years.length} editions on record.</p></section></div>${(() => { const b = typeof awardBodies === 'function' ? awardBodies().find(x => x.fk === F.k) : null; return b && typeof awardTableHTML === 'function' ? awardTableHTML(b) : ''; })()}`;
}
function usdW(v) { return usd(v, S.me ? undefined : 'hollywood'); }
