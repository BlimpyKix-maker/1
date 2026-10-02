// ---------------- Corrections: duos who are two people, and who really ran the studios ----------------
// The catalogue once filed some directing partners as one person. They are two: they share films, and some of them
// have made films apart. This splits each pair before the world is built and gives joint films both names.
// It also gives the big studios their real chain of command, so the boss on a company page is who it was that year.
const DUOS = {
  coen: [['coen_j', 'Joel Coen', 'Joel Fargo', 1954], ['coen_e', 'Ethan Coen', 'Ethan Fargo', 1957]],
  taviani: [['taviani_v', 'Vittorio Taviani', 'Vittorio Tavolini', 1929, 2018], ['taviani_p', 'Paolo Taviani', 'Paolo Tavolini', 1931, 2024]],
  maysles: [['maysles_a', 'Albert Maysles', 'Albert Mazurski', 1926, 2015], ['maysles_d', 'David Maysles', 'David Mazurski', 1931, 1987]],
  hughesbros: [['hughes_al', 'Allen Hughes', 'Allen Menace', 1972], ['hughes_ab', 'Albert Hughes', 'Albert Menace', 1972]],
  farrelly: [['farrelly_p', 'Peter Farrelly', 'Peter Dumbarton', 1956], ['farrelly_b', 'Bobby Farrelly', 'Bobby Dumbarton', 1958]],
  wachowskis: [['wachowski_la', 'Lana Wachowski', 'Lana Matrixon', 1965, null, 'F'], ['wachowski_li', 'Lilly Wachowski', 'Lilly Matrixon', 1967, null, 'F']],
  bergerpulcini: [['berman_ss', 'Shari Springer Berman', 'Shari Springer Splendor', 1964, null, 'F'], ['pulcini', 'Robert Pulcini', 'Robert Harveypekar', 1964]],
  daytonfaris: [['dayton_j', 'Jonathan Dayton', 'Jonathan Dayspring', 1957], ['faris_v', 'Valerie Faris', 'Valerie Ferris-Wheel', 1958, null, 'F']],
  dardennes: [['dardenne_jp', 'Jean-Pierre Dardenne', 'Jean-Pierre Dardanelle', 1951], ['dardenne_l', 'Luc Dardenne', 'Luc Dardanelle', 1954]],
  adilbilall: [['elarbi', 'Adil El Arbi', 'Adil El Amrani', 1988], ['fallah', 'Bilall Fallah', 'Bilall Fahmi', 1986]],
  boden_fleck: [['boden', 'Anna Boden', 'Anna Halfnelson', 1979, null, 'F'], ['fleck', 'Ryan Fleck', 'Ryan Sugarman', 1976]],
  chan_andrew: [['chan_jeff', 'Jeff Chan', 'Jeff Cheung', 1985], ['rhymer', 'Andrew Rhymer', 'Andrew Rhodes', 1985]],
  daniels: [['kwan_d', 'Daniel Kwan', 'Daniel Kwong', 1988], ['scheinert', 'Daniel Scheinert', 'Daniel Schoenfeld', 1987]],
  nakache_toledano: [['nakache', 'Olivier Nakache', 'Olivier Benhamou', 1973], ['toledano', 'Éric Toledano', 'Éric Intouchy', 1971]],
  nee_brothers: [['nee_aa', 'Aaron Nee', 'Aaron Lostcity', 1981], ['nee_ad', 'Adam Nee', 'Adam Lostcity', 1981]],
  philippous: [['philippou_d', 'Danny Philippou', 'Danny Philippakis', 1992], ['philippou_m', 'Michael Philippou', 'Michael Philippakis', 1992]],
  radiosilence: [['bettinelli', 'Matt Bettinelli-Olpin', 'Matt Bettancourt', 1978], ['gillett', 'Tyler Gillett', 'Tyler Gilliard', 1982]],
  russo: [['russo_a', 'Anthony Russo', 'Anthony Rossellini', 1970], ['russo_j', 'Joe Russo', 'Joe Rossellini', 1971]],
  safdies: [['safdie_j'], ['safdie_b']]   // already in the catalogue as two people
};
// films one of a pair made alone (catalogue film id → the half who directed it)
const DUO_SOLO = { macbeth21: 'coen_j', greenbook: 'farrelly_p' };
// films made apart after the split, added to the record
const DUO_FILMS = [
  { id: 'hudsucker', real: 'The Hudsucker Proxy', t: 'The Hula-Hoop Executive', y: 1994, hub: 'hollywood', st: 'warner', g: 'Comedy', dir: ['coen_j', 'coen_e'], wri: ['coen_j', 'coen_e'], b: 25, flop: true, q: 72, cult: 40, note: 'A screwball fable about a mailroom boy made company president; it lost most of its money.' },
  { id: 'intolerable', real: 'Intolerable Cruelty', t: 'Irreconcilable Differences, Esq.', y: 2003, hub: 'hollywood', st: 'universal', g: 'Comedy', dir: ['coen_j', 'coen_e'], cast: ['clooney', 'zetajones'], q: 64 },
  { id: 'ladykillers04', real: 'The Ladykillers', t: 'The Gentlemen Burglars', y: 2004, hub: 'hollywood', st: 'touchstone', g: 'Comedy', dir: ['coen_j', 'coen_e'], wri: ['coen_j', 'coen_e'], cast: ['hanks'], q: 56 },
  { id: 'burnafter', real: 'Burn After Reading', t: 'Destroy Once Read', y: 2008, hub: 'hollywood', st: 'focus', g: 'Comedy', dir: ['coen_j', 'coen_e'], wri: ['coen_j', 'coen_e'], cast: ['clooney', 'mcdormand', 'pitt', 'malkovich', 'swinton'], dp: 'lubezki', q: 76 },
  { id: 'hailcaesar', real: 'Hail, Caesar!', t: 'All Hail the Emperor!', y: 2016, hub: 'hollywood', st: 'universal', g: 'Comedy', dir: ['coen_j', 'coen_e'], wri: ['coen_j', 'coen_e'], cast: ['brolin', 'clooney', 'johansson', 'swinton'], dp: 'deakins', mus: 'burwell', q: 72, note: 'A day in the life of a 1950s studio fixer, with a kidnapped star in a toga.' },
  { id: 'busterscruggs', real: 'The Ballad of Buster Scruggs', t: 'The Ballad of the Singing Cowboy', y: 2018, hub: 'hollywood', st: 'netflix', g: 'Western', dir: ['coen_j', 'coen_e'], wri: ['coen_j', 'coen_e'], dp: 'delbonnel', mus: 'burwell', q: 80, note: 'Six western tales, first written over twenty-five years and finished for a streamer.' },
  { id: 'driveawaydolls', real: 'Drive-Away Dolls', t: 'The Getaway Dolls', y: 2024, hub: 'hollywood', st: 'focus', g: 'Comedy', dir: ['coen_e'], wri: ['coen_e'], cast: ['qualley'], b: 7, q: 60, note: 'Ethan\'s first narrative feature without his brother, co-written with his wife, the editor Tricia Cooke.' },
  { id: 'honeydont', real: 'Honey Don\'t!', t: 'Sweet Nothing, Detective', y: 2025, hub: 'hollywood', st: 'focus', g: 'Crime', dir: ['coen_e'], wri: ['coen_e'], cast: ['qualley'], q: 58 }
];
(function splitDuos() {
  const cats = CATALOGUES;
  const all = {}; for (const C of cats) for (const p of C.people || []) all[p.id] = p;
  for (const d in DUOS) {
    const src = all[d]; if (!src) continue;
    for (const C of cats) {
      const i = (C.people || []).indexOf(src);
      if (i < 0) continue;
      const halves = DUOS[d].filter(h => h.length > 1).map(([id, real, n, b, dd, sx]) => Object.assign({}, src, { id, real, n, b, d: dd || undefined, sx: sx || undefined, note: src.note ? src.note.replace(/^(Brothers|Twin brothers|Two [A-Za-z ]+ siblings|A [A-Za-z-]+ duo|The indie pair|Belgian brothers)/, m => 'One of ' + m.toLowerCase()) : undefined }));
      C.people.splice(i, 1, ...halves);
      if (typeof REAL_LOOKS !== 'undefined' && REAL_LOOKS[src.real]) for (const h of halves) REAL_LOOKS[h.real] = REAL_LOOKS[h.real] || REAL_LOOKS[src.real];
    }
    const ids = DUOS[d].map(h => h[0]);
    for (const C of cats) {
      for (const f of C.films || []) {
        for (const k in f) {
          const v = f[k];
          if (v === d) f[k] = ids[0];
          else if (Array.isArray(v) && v.includes(d)) { const i = v.indexOf(d); v.splice(i, 1, ...((k === 'dir' || k === 'wri') ? ids.filter(x => !v.includes(x)) : [ids[0]])); }
        }
        if (DUO_SOLO[f.id] && ids.includes(DUO_SOLO[f.id]) && f.dir) f.dir = f.dir.filter(x => !ids.includes(x) || x === DUO_SOLO[f.id]);
      }
      for (const id in C.credits || {}) for (const k in C.credits[id]) if (C.credits[id][k] === d) C.credits[id][k] = ids[0];
      for (const id in C.castAdd || {}) C.castAdd[id] = C.castAdd[id].map(x => x === d ? ids[0] : x);
    }
  }
  const have = new Set(cats.flatMap(C => (C.films || []).map(f => f.id))), ppl = new Set(cats.flatMap(C => (C.people || []).map(p => p.id)));
  for (const f of DUO_FILMS) if (!have.has(f.id)) { f.cast = (f.cast || []).filter(x => ppl.has(x)); for (const k of ['dp', 'mus', 'ed']) if (f[k] && !ppl.has(f[k])) delete f[k]; CAT6.films.push(f); have.add(f.id); }
})();
// ---- who ran the studios: [from, to, catalogue person or null, real name (never shown), name in this world, title] ----
const STUDIO_HEADS = {
  disney: [[1923, 1966, 'disney', 'Walt Disney', null, 'Founder and chief'], [1966, 1971, null, 'Roy O. Disney', 'Roy O. Dizzley', 'Chief executive'], [1984, 2005, null, 'Michael Eisner', 'Michael Eisenberg', 'Chief executive'], [1984, 1994, null, 'Jeffrey Katzenberg', 'Jeffrey Katzenburg', 'Studio chairman'], [2005, 2020, null, 'Bob Iger', 'Bob Eiger', 'Chief executive'], [2020, 2022, null, 'Bob Chapek', 'Bob Chapman', 'Chief executive'], [2022, null, null, 'Bob Iger', 'Bob Eiger', 'Chief executive']],
  marvelstudios: [[1996, 2007, null, 'Avi Arad', 'Avi Arcade', 'Chief executive'], [2007, null, null, 'Kevin Feige', 'Kevin Endgame', 'President']],
  warner: [[1923, 1956, null, 'Harry Warner', 'Harry Warden', 'President'], [1923, 1969, 'jwarner', 'Jack L. Warner', null, 'Head of production'], [1969, 1981, null, 'Ted Ashley', 'Ted Ashford', 'Chairman'], [1981, 1999, null, 'Bob Daly', 'Bob Daley', 'Chairman'], [1999, 2013, null, 'Barry Meyer', 'Barry Meyers', 'Chairman'], [2013, 2018, null, 'Kevin Tsujihara', 'Kevin Tsujimura', 'Chief executive'], [2022, null, null, 'Michael De Luca', 'Michael De Lucca', 'Co-chairman']],
  paramount: [[1916, 1964, 'zukor', 'Adolph Zukor', null, 'Chairman'], [1966, 1974, 'evans', 'Robert Evans', null, 'Head of production'], [1974, 1984, null, 'Barry Diller', 'Barry Dillon', 'Chairman'], [1992, 2004, null, 'Sherry Lansing', 'Sherry Lansdowne', 'Chairman'], [2005, 2017, null, 'Brad Grey', 'Brad Gray', 'Chairman'], [2025, null, null, 'David Ellison', 'David Ellerson', 'Chief executive']],
  mgm: [[1924, 1951, 'lbmayer', 'Louis B. Mayer', null, 'Studio chief'], [1924, 1936, null, 'Irving Thalberg', 'Irving Thalbert', 'Head of production'], [1951, 1956, null, 'Dore Schary', 'Dore Scharf', 'Studio chief'], [1969, 2010, null, 'Kirk Kerkorian', 'Kirk Kirkland', 'Owner']],
  universal: [[1912, 1936, 'laemmle', 'Carl Laemmle', null, 'Founder and president'], [1962, 1995, null, 'Lew Wasserman', 'Lew Waterman', 'Chairman'], [2013, null, null, 'Donna Langley', 'Donna Langdon', 'Chairman']],
  columbia: [[1924, 1958, 'cohn', 'Harry Cohn', null, 'President'], [1987, 1989, null, 'David Puttnam', 'David Puttenham', 'Chairman'], [2006, 2015, null, 'Amy Pascal', 'Amy Paschal', 'Chairman'], [2016, null, null, 'Tom Rothman', 'Tom Rothmere', 'Chairman']],
  fox20: [[1935, 1956, 'zanuck', 'Darryl F. Zanuck', null, 'Head of production'], [1962, 1971, 'zanuck', 'Darryl F. Zanuck', null, 'President'], [1976, 1979, null, 'Alan Ladd Jr.', 'Alan Ladder Jr.', 'President'], [2000, 2012, null, 'Tom Rothman', 'Tom Rothmere', 'Co-chairman'], [2012, 2019, null, 'Stacey Snider', 'Stacey Snyderman', 'Chairman']],
  ua: [[1951, 1978, null, 'Arthur Krim', 'Arthur Krimson', 'Chairman']],
  orion: [[1978, 1992, null, 'Arthur Krim', 'Arthur Krimson', 'Chairman']],
  lucasfilm: [[1971, 2012, 'lucas', 'George Lucas', null, 'Founder and chairman'], [2012, null, null, 'Kathleen Kennedy', 'Kathleen Kennerly', 'President']],
  pixar: [[1986, 2019, null, 'Ed Catmull', 'Ed Catmill', 'President'], [1986, 2018, 'lasseter', 'John Lasseter', null, 'Chief creative officer'], [2018, null, 'docter', 'Pete Docter', null, 'Chief creative officer']],
  miramax: [[1979, 2005, null, 'Harvey Weinstein', 'Harvey Wainwright', 'Co-chairman']],
  weinsteinco: [[2005, 2017, null, 'Harvey Weinstein', 'Harvey Wainwright', 'Co-chairman']],
  dreamworks: [[1994, 2016, 'spielberg', 'Steven Spielberg', null, 'Co-founder']],
  dwanim: [[2004, 2016, null, 'Jeffrey Katzenberg', 'Jeffrey Katzenburg', 'Chief executive']],
  amblin: [[1981, null, 'spielberg', 'Steven Spielberg', null, 'Founder']],
  newline: [[1967, 2008, null, 'Bob Shaye', 'Bob Shea', 'Founder and chairman']],
  ealing: [[1938, 1959, 'balcon', 'Michael Balcon', null, 'Head of studio']],
  shaw: [[1958, 2011, 'shaw_rr', 'Run Run Shaw', null, 'Chairman']],
  goldenharvest: [[1970, 2007, null, 'Raymond Chow', 'Raymond Chau', 'Founder and chairman']],
  ghibli: [[1985, null, null, 'Toshio Suzuki', 'Toshio Suzuka', 'Producer and president']],
  yashraj: [[1970, 2012, 'chopra_y', 'Yash Chopra', null, 'Founder'], [2012, null, 'chopra_a', 'Aditya Chopra', null, 'Chairman']],
  workingtitle: [[1983, null, null, 'Tim Bevan', 'Tim Bevin', 'Co-chairman']],
  legendary: [[2000, 2017, null, 'Thomas Tull', 'Thomas Tully', 'Founder and chief executive']],
  jerrybruckheimer: [[1995, null, 'bruckheimer', 'Jerry Bruckheimer', null, 'Founder']],
  europacorp: [[1999, null, 'besson', 'Luc Besson', null, 'Founder']],
  carolco: [[1976, 1995, null, 'Mario Kassar', 'Mario Kassab', 'Co-founder']],
  cannon: [[1979, 1994, null, 'Menahem Golan', 'Menahem Golanski', 'Co-chairman']],
  lionsgate: [[2000, null, null, 'Jon Feltheimer', 'Jon Feldheimer', 'Chief executive']],
  imagine: [[1986, null, 'howard_r', 'Ron Howard', null, 'Co-founder']],
  planb: [[2001, null, 'pitt', 'Brad Pitt', null, 'Founder']],
  zoetrope: [[1969, null, 'coppola', 'Francis Ford Coppola', null, 'Founder']],
  blumhouse: [[2000, null, null, 'Jason Blum', 'Jason Bloom', 'Founder and chief executive']],
  netflix: [[1997, 2023, null, 'Reed Hastings', 'Reed Hastings-Streamer', 'Co-founder and chief executive'], [2011, null, null, 'Ted Sarandos', 'Ted Saranwrap', 'Chief content officer, then co-CEO']],
  a24: [[2012, null, null, 'Daniel Katz', 'Daniel Kaplan', 'Co-founder']],
  neon: [[2017, null, null, 'Tom Quinn', 'Tom Quill', 'Founder and chief executive']]
};
function headsOf(c, y = S.year) { return (STUDIO_HEADS[c.catId] || []).filter(h => h[0] <= y && (h[1] === null || h[1] >= y)); }
function headName(h) { return h[2] && S.cat.src.people[h[2]] ? S.cat.src.people[h[2]].n : h[4]; }
function headLink(h) { const id = h[2] !== null && S.cat.people ? S.cat.people[h[2]] : undefined; return id !== undefined && P(id) ? pl(id) : esc(headName(h)); }
function headsHTML(c) {
  const L = STUDIO_HEADS[c.catId]; if (!L) return '';
  return `<h4>Leadership through the years</h4><ul class="plain small">${L.filter(h => h[0] <= S.year).map(h => `<li>${h[0]}–${h[1] === null ? 'today' : h[1]} · <b>${headLink(h)}</b> <span class="muted">${esc(h[5])}</span></li>`).join('')}</ul>`;
}
// one real festival name slipped into the record: it's the Mountain Film Festival in this world
for (const C of CATALOGUES) for (const f of C.films || []) if (f.aw) f.aw = f.aw.map(a => a.replace(/^Festival Sundance/, 'Mountain Film Festival'));
