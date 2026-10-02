// Rewrites every catalogue note and trivia line so it only names the game's fictional films, people and studios.
// Real titles and names are swapped for their in-game versions; a line that still names something real we can't
// map (an outside film, a band, a book) is dropped. Output: src/fiction.js (FICTION.note / FICTION.fact).
// Usage: node tools/fictionalise.js   (then python3 tools/build.py)
const fs = require('fs'), path = require('path');
const h = require('./harness.js');
const data = JSON.parse(h.run(`JSON.stringify({ C: CATALOGUES.map(C => ({ films: C.films || [], people: C.people || [], studios: C.studios || [], facts: C.facts || {} })), hubs: Object.values(HUBS).map(x => x.name) })`));
const swaps = new Map(), keepWords = new Set();
// phrases that are real titles but mostly mean something else here
const DENY = new Set(['Grand Prix', 'César', 'Oscar', 'Emmy', 'Broadway', 'Hollywood', 'Paris', 'London', 'Rome', 'Berlin', 'Tokyo', 'Venice', 'Cannes', 'Christmas', 'America', 'Texas', 'Chicago', 'Casino', 'Network', 'Cabaret']);
// real awards and festivals become the game's own
const AWARDS = [[/\bAcademy Awards?\b/g, m => m.endsWith('s') ? 'Academy Oswalds' : 'Academy Oswald'], [/\bOscars\b/g, 'Oswalds'], [/\bOscar\b/g, 'Oswald'], [/\bBAFTAs?\b/g, 'British Film Award'], [/\bGolden Globes?\b/g, m => m.endsWith('s') ? 'Golden Orbs' : 'Golden Orb'], [/\bEmmys?\b/g, 'television award'], [/\bPalme d['’]Or\b/g, 'Grand Prix'], [/\bCésars?\b/g, 'French Film Award'], [/\bat Cannes\b/g, 'at the Côte'], [/\bCannes\b/g, 'the Côte festival'], [/\bSundance\b/g, 'the Mountain festival']];
// words the corpus uses in lower case are ordinary words: never swap them as surnames
const lower = new Set(); for (const C of data.C) { for (const x of C.films.concat(C.people)) for (const w of (x.note || '').split(/\W+/)) if (/^[a-z]+$/.test(w)) lower.add(w); for (const k in C.facts) for (const [, t] of C.facts[k]) for (const w of t.split(/\W+/)) if (/^[a-z]+$/.test(w)) lower.add(w); }
const add = (real, fic) => { if (!real || !fic || real === fic) return; if (real.length >= 4) swaps.set(real, fic); };
const surname = n => n.split(/\s+/).pop();
const surnameCount = {};
for (const C of data.C) for (const p of C.people) if (p.real) surnameCount[surname(p.real)] = (surnameCount[surname(p.real)] || 0) + 1;
for (const C of data.C) {
  for (const f of C.films) { if (f.real && !DENY.has(f.real) && (/\s/.test(f.real) || (f.real.length >= 5 && !lower.has(f.real.toLowerCase())))) add(f.real, f.t); if (f.real && /^The /.test(f.real)) add(f.real.slice(4), f.t.replace(/^The /, '')); for (const w of (f.t || '').split(/\s+/)) keepWords.add(w); }
  for (const p of C.people) {
    add(p.real, p.n);
    if (p.real && p.n && surnameCount[surname(p.real)] === 1 && surname(p.real).length >= 4 && !lower.has(surname(p.real).toLowerCase())) add(surname(p.real), surname(p.n));
    for (const w of (p.n || '').split(/\s+/)) keepWords.add(w);
  }
  for (const s of C.studios) { add(s.real, s.n); for (const w of (s.n || '').split(/\s+/)) keepWords.add(w); }
}
const keys = [...swaps.keys()].sort((a, b) => b.length - a.length);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// one big alternation, longest first; whole words only
const RX = new RegExp(`(?<![\\w])(${keys.map(esc).join('|')})(?![\\w])`, 'g');
const fic = new Set(); for (const C of data.C) { for (const f of C.films) if (f.t) fic.add(f.t); for (const p of C.people) if (p.n) fic.add(p.n); for (const st of C.studios) if (st.n) fic.add(st.n); }
const FX = new RegExp(`(?<![\\w])(${[...fic].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![\\w])`, 'g');
// words that may stay capitalised mid-sentence: places, months, nationalities, award and industry words
const ALLOW = new Set(('I A An The Academy Oswalds Oswald Golden Palm Festival Côte Grand Prix Best Picture Director Actor Actress Oswald Oswalds Broadway Hollywood Paris London Rome Berlin Tokyo Mumbai Bombay Hong Kong New York Los Angeles America American Americans British Britain English England French France Italian Italy German Germany Japanese Japan Chinese China Indian India Mexican Mexico Spanish Spain Soviet Russia Russian Europe European Africa African Nigeria Nigerian Korea Korean Swedish Sweden Danish Denmark Brazil Brazilian Argentina Australian Australia Canada Canadian Irish Ireland Scottish Scotland Welsh Polish Czech Hungarian Iranian Egyptian Turkish Greek Jewish Catholic Christmas Easter Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December War World II I Cold Depression Great Code Production Hays Technicolor Cinemascope CinemaScope Vistavision IMAX Dolby THX Steadicam Moviola Nazi Nazis Allied Allies Navy Army Air Force Pacific Atlantic Mediterranean Alps Sahara Vegas Las Venice Toronto Biennale Lumière Studio Studios Pictures Films Film Company Records Television TV BBC Western Westerns Bollywood Nollywood Kabuki Noh Shakespeare Bible God Jesus Christ Moses Rome Roman Romans Egypt Greek Greeks Victorian Edwardian Napoleon Napoleonic Cuba Vietnam Korean Manhattan Brooklyn Bronx Harlem Chicago San Francisco Texas California Florida Alaska Hawaii Arizona Utah Nevada Philadelphia Belfast Rushmore Boston Detroit Dublin Glasgow Edinburgh Liverpool Manchester Marseille Lyon Munich Hamburg Monument Valley Sicily Naples Milan Venice Florence Madrid Barcelona Lisbon Vienna Prague Warsaw Moscow Leningrad Stockholm Copenhagen Oslo Helsinki Amsterdam Brussels Zurich Geneva Lagos Cairo Tehran Istanbul Athens Seoul Shanghai Beijing Taipei Bangkok Manila Sydney Melbourne Rio Janeiro Buenos Aires Havana Mexico City Kyoto Osaka Calcutta Kolkata Madras Chennai Leeds Yorkshire White House Pentagon Congress Senate Parliament Vatican Pope King Queen Prince Princess Emperor President Mr Mrs Ms Dr Sir Lady Lord Saint St Mount Lake River Street Avenue Hotel Theatre Theater Opera House Hall Square Park').split(' '));
for (const n of data.hubs) for (const w of n.split(/\s+/)) ALLOW.add(w);
function clean(t) {
  if (!t) return null;
  let s0 = t.replace(/^["“][^"”]*["”]\s*/, '');   // a famous line or tagline: never quote the real film
  if (!s0) return null;
  for (const [rx, to] of AWARDS) s0 = s0.replace(rx, to);
  // a single word that is also a place or ordinary word (Manhattan, Chicago, Belfast…) stays as it is
  let glued = false;
  const out = s0.replace(RX, (m, _g, off, str) => {
    if ((!/\s/.test(m) && ALLOW.has(m)) || /Mount\s$/.test(str.slice(Math.max(0, off - 6), off))) return m;
    // a swap stuck to another name ("Tamara Honeyland", "Batman Begins", "Barbie-doll") would read as nonsense
    const before = str.slice(Math.max(0, off - 30), off), after = str.slice(off + m.length, off + m.length + 30);
    if (/(?:^|[^.!?:;"“]\s)\p{Lu}[\p{L}.]*\s$/u.test(before) && !/(?:^|\s)(?:I|A|An|The)\s$/.test(before) || /^(?:\s\p{Lu}|-\p{L})/u.test(after)) glued = true;
    return swaps.get(m);
  });
  if (glued) return null;
  // what's left: any capitalised word not at a sentence start that we don't recognise means an unmapped real name
  const words = out.replace(/\{\w+\}/g, '').replace(FX, 'x').split(/(?<=[.!?:;"“”])\s+|\s+/);
  let start = true;
  for (const raw of words) {
    const w = raw.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').replace(/[’']s$/, '');
    if (!w) continue;
    const cap = /^\p{Lu}/u.test(w);
    if (cap && !start && !ALLOW.has(w) && !/^\p{Lu}{2,}$/u.test(w)) return null;
    start = /[.!?:;]["”’]?$/.test(raw);
  }
  return out;
}
const note = {}, fact = {};
let nKeep = 0, nDrop = 0, fKeep = 0, fDrop = 0;
for (const C of data.C) {
  for (const f of C.films) if (f.note) { const c = clean(f.note); if (c) { note['f:' + f.id] = c; nKeep++; } else nDrop++; }
  for (const p of C.people) if (p.note) { const c = clean(p.note); if (c) { note['p:' + p.id] = c; nKeep++; } else nDrop++; }
  for (const k in C.facts) for (const [kind, t] of C.facts[k]) { const c = clean(t); if (c) { (fact[k] = fact[k] || []).push([kind, c]); fKeep++; } else fDrop++; }
}
const body = `// ---------------- Fiction ----------------
// Generated by tools/fictionalise.js: every note and trivia line from the catalogue, rewritten so it names only the
// game's own films, people and studios. Lines that named something outside the game were left out.
const FICTION = ${JSON.stringify({ note, fact })};
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'fiction.js'), body);
console.log(`notes kept ${nKeep}, dropped ${nDrop}; facts kept ${fKeep}, dropped ${fDrop}; ${swaps.size} name swaps`);
if (process.argv[2] === 'sample') { const ks = Object.keys(note); for (let i = 0; i < 12; i++) { const k = ks[Math.floor(i * ks.length / 12)]; console.log(k, '→', note[k]); } }
