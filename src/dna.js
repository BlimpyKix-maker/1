// ================= Story DNA (Round 24) =================
// Every script, film, play, song, podcast and video has a fixed set of story traits: a hero with a job, a flaw, a
// wound, a want and a need; an opponent and an ally; a specific world; the inciting incident, the midpoint reversal,
// the ending and the argument the work makes about its theme; a signature image; and the way it is told (the trick).
// Traits are drawn from hand-written pools (src/dnapools.js) by hash, so the same work always has the same DNA and no
// dice stream moves. For the player's own work, traits can come from the player's own life ("write what you know"):
// the people you have loved and fallen out with, the jobs you have done, the cities you have lived in, your pets and
// the people you have lost. The engine that turns DNA into pages, lyrics and reviews is src/storyengine.js.

const DNA_TRICK_KEYS = ['linear', 'backwards', 'onenight', 'oneroom', 'twotimes', 'mosaic', 'framed', 'unreliable', 'letters', 'chapters', 'longtake', 'dream', 'circular'];
const DNA_END_KEYS = ['triumph', 'pyrrhic', 'bittersweet', 'tragic', 'open', 'ironic', 'reunion', 'escape'];
const DNA_END_LABEL = { triumph: 'A triumph', pyrrhic: 'A win that costs everything', bittersweet: 'Bittersweet', tragic: 'Tragic', open: 'Left open', ironic: 'An ironic twist', reunion: 'A reunion', escape: 'An escape' };
// which endings each tone leans to (weights)
const DNA_TONE_END = {
  light: { triumph: 4, reunion: 4, escape: 2, ironic: 2, bittersweet: 1 },
  bittersweet: { bittersweet: 5, pyrrhic: 2, open: 2, reunion: 2, tragic: 1 },
  dark: { tragic: 4, pyrrhic: 3, ironic: 2, open: 2, escape: 1 },
  absurd: { ironic: 5, triumph: 2, open: 2, escape: 2 },
  tense: { escape: 4, pyrrhic: 3, triumph: 2, open: 2, tragic: 2 }
};
const DNA_SOURCES = { life: 'From your own life', mix: 'A bit of both', invent: 'Pure invention' };

function dnaR(seed) { return hashRand((seed | 0) * 2654435761 % 2147483647 + 17); }
function dnaPick(r, a) { return a && a.length ? a[Math.floor(r() * a.length)] : undefined; }
function dnaWPick(r, W) { const k = Object.keys(W), t = k.reduce((s, x) => s + W[x], 0); let x = r() * t; for (const y of k) if ((x -= W[y]) <= 0) return y; return k[k.length - 1]; }
// a loss can be a person ('{his} brother') or a thing ('the farm'); lines that treat it as a person go to people only
const DNA_PERSON_LOSS = /\{his\} (mother|father|brother|sister|son|daughter|wife|husband|partner|best friend|friend|uncle|aunt|grandmother|grandfather|grandmother's|twin|mentor|child|baby|fianc|first love|teacher|coach|old|younger|older)/;
function dnaPickL(r, a, person) { if (!a || !a.length) return undefined; for (let i = 0; i < 8; i++) { const x = a[Math.floor(r() * a.length)], t = Array.isArray(x) ? x[1] : x; if (person || !/\{LOSS\}/.test(t)) return x; } return a.find(x => !/\{LOSS\}/.test(Array.isArray(x) ? x[1] : x)) || a[0]; }
function dnaG(g) { return DNA_POOLS.jobs[g] ? g : 'Drama'; }
function dnaFirst(r, lang, g) { const N = (typeof NAMES !== 'undefined' && (NAMES[lang] || NAMES.en)) || { M: ['Sam'], F: ['Alex'] }; return dnaPick(r, N[g] || N.M); }
// a role that names a gender ('the father who left', 'a sister who never left') decides the character's
function dnaGOf(who, g) { const t = ' ' + String(who || '').toLowerCase() + ' '; if (/ (father|man|brother|son|husband|king|uncle|grandfather|boyfriend|nephew|prince|monk|priest|lord|sir|widower|fisherman|landlord|policeman|businessman|cowboy|gentleman|duke|baron|emperor|groom|he|his|him) /.test(t)) return 'M'; if (/ (mother|woman|sister|daughter|wife|queen|aunt|grandmother|girlfriend|niece|princess|nun|lady|widow|landlady|actress|duchess|baroness|empress|bride|she|her) /.test(t)) return 'F'; return g; }
function dnaPron(g) { return g === 'F' ? ['she', 'her', 'her'] : g === 'M' ? ['he', 'him', 'his'] : ['they', 'them', 'their']; }
function dnaTheme(g, r) { return dnaPick(r, (typeof GENRE_THEMES !== 'undefined' && GENRE_THEMES[g]) || ['family']); }

// ---- the player's life, as material ----
// Each seed is something a writer could use, with a note saying where it came from.
function lifeSeeds() {
  const M = S.me; if (!M) return [];
  const me = ME(), out = [], seen = new Set(), first = n => String(n || '').split(' ')[0];
  const rel = M.rel || {};
  for (const id in rel) {
    const p = P(+id); if (!p || +id === M.id) continue; const s = rel[id].s;
    if (s === 'ex') out.push({ k: 'foe', id: +id, who: 'the one who left', note: `The ${p.g === 'F' ? 'woman' : p.g === 'M' ? 'man' : 'person'} who walks out in act one is ${first(p.name)}, more or less.` }, { k: 'loss', v: 'the life {he} planned with someone', note: `What ${first(p.name)} took with them when you split up.` });
    else if (s === 'rival') out.push({ k: 'foe', id: +id, who: 'the rival who always got there first', note: `The rival is ${first(p.name)}. They will recognise themselves.` });
    else if (s === 'partner') out.push({ k: 'ally', id: +id, who: 'the partner who keeps the lights on', note: `The love interest has ${first(p.name)}'s laugh.` });
    else if (s === 'mentor') out.push({ k: 'ally', id: +id, who: 'an old hand who sees something in {him}', note: `The mentor talks exactly like ${first(p.name)}.` });
    else if (s === 'close' || s === 'friend') out.push({ k: 'ally', id: +id, who: 'the friend who never left town', note: `The best friend is ${first(p.name)}, with the serial numbers filed off.` });
  }
  const fam = typeof familyOfP === 'function' && me ? familyOfP(me) : {};
  if (fam.parent !== undefined && P(fam.parent)) { const p = P(fam.parent); out.push(p.dead ? { k: 'loss', v: `{his} ${p.g === 'F' ? 'mother' : 'father'}`, note: `It's about your ${p.g === 'F' ? 'mother' : 'father'}. Everyone who knows you will see it.` } : { k: 'ally', id: p.id, who: `{his} ${p.g === 'F' ? 'mother' : 'father'}, who has opinions`, note: `The ${p.g === 'F' ? 'mother' : 'father'} on the page is yours, softened a little.` }); }
  for (const id of Object.keys(M.known || {})) { const k = M.known[id]; if (k && (k.tags || []).some(t => /sibling/i.test(t)) && P(+id)) { const p = P(+id); out.push({ k: 'ally', id: p.id, who: `{his} ${p.g === 'F' ? 'sister' : p.g === 'M' ? 'brother' : 'sibling'}`, note: `${first(p.name)} is in it. They will want a credit.` }); break; } }
  const past = (M.past || []).filter(j => j && j.t && !j.film).slice(0, 6);
  for (const j of past) out.push({ k: 'job', v: String(j.t).toLowerCase().replace(/^(a|an|the) /, ''), note: `The hero works your old job: ${String(j.t).toLowerCase()}. You know exactly how that feels.` });
  const H = typeof HUBS !== 'undefined' && HUBS[M.hub];
  if (H) { out.push({ k: 'city', v: H.name, note: `It's set in ${H.name}, the streets you walk every day.` }); if (H.places && H.places.length) out.push({ k: 'desc', v: `in ${H.name}, around ${H.places[(M.id || 0) % H.places.length]}`, note: `The locations are your neighbourhood.` }); }
  for (const p of (M.pets || []).slice(0, 2)) if (p && p.name) out.push({ k: 'obj', v: `the ${String(p.kind || p.n || 'dog').toLowerCase()} called ${p.name}`, how: 'who goes everywhere {he} goes', note: `${p.name} is in it, as themselves.` });
  for (const m of (M.milestones || []).filter(m => m.kind === 'life' || m.kind === 'love').slice(-30)) { if (seen.size > 3) break; if (/split up|lost|died|funeral|fired|evicted|stole|thief|fire|crash|hospital/i.test(m.t) && !seen.has(m.t)) { seen.add(m.t); out.push({ k: 'wound', v: m.t.replace(/^You /, '').replace(/^./, c => c.toLowerCase()), note: `The wound is yours: ${m.t.replace(/\.$/, '').toLowerCase()}.` }); } }
  return out;
}

// ---- making DNA ----
// o: { seed, genre, theme, tone, lang, source ('life'|'mix'|'invent'), hero (a name or a phrase the writer typed),
//      setting (typed), trick, end (chosen keys), trend (a trick in fashion) }
function dnaMake(o) {
  const P0 = DNA_POOLS, r = dnaR(o.seed), g = dnaG(o.genre), th = THEMES[o.theme] ? o.theme : dnaTheme(g, r), tone = TONES[o.tone] ? o.tone : 'bittersweet', lang = o.lang || 'en';
  const hg = r() < .5 ? 'F' : 'M', fg = r() < .5 ? 'F' : 'M', ag = r() < .5 ? 'F' : 'M';
  const typed = String(o.hero || '').trim(), typedName = /^[A-Z][a-zà-ÿ'-]+$/.test(typed.split(' ')[0] || '') && typed.split(' ').length <= 2 ? typed.split(' ')[0] : '';
  const loss0 = dnaPick(r, P0.losses);
  const d = {
    v: 1, loss: loss0, g, th, tone, seed: o.seed,
    hero: { n: typedName || dnaFirst(r, lang, hg), g: hg, job: dnaPick(r, P0.jobs[g]), flaw: dnaPick(r, P0.flaws), wound: dnaPick(r, P0.wounds), want: dnaPick(r, P0.wants[th] || P0.wants.family), need: dnaPick(r, P0.needs[th] || P0.needs.family) },
    foe: (() => { const f = dnaPick(r, P0.foes[g]) || ['a rival', 'wants the same thing'], g2 = dnaGOf(f[0], fg); return { n: dnaFirst(r, lang, g2), g: g2, who: f[0], want: f[1] }; })(),
    ally: (() => { const w = dnaPick(r, P0.allies); return { n: '', g: dnaGOf(w, ag), who: w }; })(),
    world: (() => { const w = dnaPick(r, P0.worlds[g]) || ['the town', 'MAIN STREET', 'in a small town']; return { place: w[0], slug: w[1], desc: w[2], city: o.city || '' }; })(),
    obj: (() => { const i = dnaPick(r, P0.images) || ['the photograph', 'that nobody will explain']; return { o: i[0], how: i[1] }; })(),
    inc: dnaPickL(r, P0.incidents[g], DNA_PERSON_LOSS.test(loss0)) || ['letter', 'A letter arrives.'],
    mid: dnaPickL(r, P0.reversals, DNA_PERSON_LOSS.test(loss0)),
    arg: dnaPick(r, P0.args[th] || P0.args.family),
    hook: dnaPick(r, P0.genreHooks[g]),
    life: []
  };
  for (let i = 0; i < 5 && (!d.ally.n || d.ally.n === d.hero.n || d.ally.n === d.foe.n); i++) d.ally.n = dnaFirst(r, lang, d.ally.g);
  for (let i = 0; i < 5 && d.foe.n === d.hero.n; i++) d.foe.n = dnaFirst(r, lang, d.foe.g);
  if (String(o.setting || '').trim()) d.world.desc = String(o.setting).trim().slice(0, 120);
  if (typed && !typedName) d.hero.job = typed.replace(/^(a|an|the) /i, '').slice(0, 60);
  // how it is told: most stories are linear; some tricks suit some genres; a trick in fashion is copied
  const fit = DNA_TRICK_KEYS.filter(k => k !== 'linear' && (P0.trickFit[k] || []).includes(g));
  d.trick = DNA_TRICK_KEYS.includes(o.trick) ? o.trick : o.trend && fit.includes(o.trend) && r() < .45 ? o.trend : r() < .55 || !fit.length ? 'linear' : dnaPick(r, fit);
  d.endK = DNA_END_KEYS.includes(o.end) ? o.end : dnaWPick(r, DNA_TONE_END[tone] || DNA_TONE_END.bittersweet);
  d.end = dnaPickL(r, P0.ends[d.endK], DNA_PERSON_LOSS.test(d.loss));
  // write what you know
  const src = o.source || 'invent', S0 = src === 'invent' ? [] : lifeSeeds(), take = src === 'life' ? 4 : src === 'mix' ? 2 : 0, used = new Set();
  if (S0.length && take) {
    const order = S0.map((s, i) => [s, r() + (s.k === 'foe' || s.k === 'loss' ? .3 : 0)]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    for (const s of order) {
      if (d.life.length >= take || used.has(s.k)) continue; used.add(s.k);
      if (s.k === 'foe') { d.foe.who = s.who; d.foe.from = s.id; const q = P(s.id); if (q && q.g && q.g !== d.foe.g) { d.foe.g = q.g; d.foe.n = dnaFirst(r, lang, q.g); } }
      else if (s.k === 'ally') { d.ally.who = s.who; d.ally.from = s.id; const q = P(s.id); if (q && q.g && q.g !== d.ally.g) { d.ally.g = q.g; d.ally.n = dnaFirst(r, lang, q.g); } }
      else if (s.k === 'loss') d.loss = s.v;
      else if (s.k === 'job') d.hero.job = s.v;
      else if (s.k === 'city') d.world.city = s.v;
      else if (s.k === 'desc') d.world.desc = s.v;
      else if (s.k === 'obj') d.obj = { o: s.v, how: s.how };
      else if (s.k === 'wound') d.hero.wound = s.v;
      d.life.push(s.note);
    }
  }
  return d;
}
// fit: how well the traits work together (0..1): a trick that suits the genre, an ending that suits the tone,
// material from life (the specific beats the generic), a want and need from the same theme
function dnaFit(d) {
  let s = .45;
  if (d.trick !== 'linear') s += (DNA_POOLS.trickFit[d.trick] || []).includes(d.g) ? .12 : -.12;
  s += ((DNA_TONE_END[d.tone] || {})[d.endK] || 0) * .03;
  s += Math.min(.24, d.life.length * .06);
  return clamp(s, 0, 1);
}

// ---- fill a fragment's slots from the DNA ----
function dnaSlots(d) {
  const [he, him, his] = dnaPron(d.hero.g), [rhe, rhim, rhis] = dnaPron(d.foe.g), cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const rp = s => String(s || '').replace(/\{he\}/g, he).replace(/\{him\}/g, him).replace(/\{his\}/g, his).replace(/\{He\}/g, cap(he)).replace(/\{His\}/g, cap(his));
  return { H: d.hero.n, R: d.foe.n, A: d.ally.n, he, him, his, He: cap(he), His: cap(his), rhe, rhim, rhis, Rhe: cap(rhe), JOB: rp(d.hero.job), PLACE: rp(d.world.place), CITY: d.world.city || 'town', OBJ: rp(d.obj.o), LOSS: rp(d.loss), WANT: rp(d.hero.want), TIME: 'NIGHT', YEARS: d.years || 'eleven years' };
}
function dnaFill(t, d, extra) {
  const m = Object.assign(dnaSlots(d), extra || {});
  return String(t || '').replace(/\{(\w+)\}/g, (x, k) => m[k] !== undefined ? m[k] : x).replace(/\b([Tt]hey) (was|is|has|does|wasn't|isn't|hasn't|doesn't)\b/g, (x, a, v) => a + ' ' + ({ was: 'were', is: 'are', has: 'have', does: 'do', "wasn't": "weren't", "isn't": "aren't", "hasn't": "haven't", "doesn't": "don't" })[v]);
}

// ---- DNA for works in the world ----
// The player's scripts store their DNA (sc.dna). Films made from them carry it (f.dna). Other films that the
// simulation makes get DNA from their id when first asked for, cached outside the save; historical films (f.real)
// keep their own story.
const DNA_CACHE = new Map();
const DNA_GENRE_TONE = { Comedy: 'light', Animation: 'light', Musical: 'light', Romance: 'bittersweet', Drama: 'bittersweet', Period: 'bittersweet', Horror: 'dark', Crime: 'dark', War: 'dark', Thriller: 'tense', Action: 'tense', 'Martial arts': 'tense', Superhero: 'tense', Western: 'tense', 'Sci-fi': 'tense', Fantasy: 'light', Documentary: 'bittersweet' };
function dnaToneOf(f) { const r = hashRand(f.id * 59 + 3)(); return r < .6 ? DNA_GENRE_TONE[f.genre] || 'bittersweet' : TONE_KEYS_DNA[Math.floor(r * 50) % 5]; }
const TONE_KEYS_DNA = ['light', 'bittersweet', 'dark', 'absurd', 'tense'];
// sequels are found by title ("The Haunted House 2" follows "The Haunted House")
let DNA_TITLES = null, DNA_TITLES_N = 0;
function dnaParent(f) {
  const m = /^(.*\S) (\d{1,2})$/.exec(f.title || ''); if (!m) return null;
  if (!DNA_TITLES || DNA_TITLES_N !== S.films.length) { DNA_TITLES = new Map(); for (const x of S.films) if (x && !DNA_TITLES.has(x.title)) DNA_TITLES.set(x.title, x); DNA_TITLES_N = S.films.length; }
  const p = DNA_TITLES.get(m[1]); return p && p.id !== f.id ? p : null;
}
function dnaOfFilm(f) {
  if (!f) return null;
  if (f.dna) return f.dna;
  if (f.real) return null;
  if (DNA_CACHE.has(f.id)) return DNA_CACHE.get(f.id);
  DNA_CACHE.set(f.id, null);   // guards against a title loop
  const hub = typeof HUBS !== 'undefined' && HUBS[f.hub], parF = dnaParent(f), par = parF ? dnaOfFilm(parF) : null;
  let d = dnaMake({ seed: f.id * 31 + 7, genre: f.genre, tone: dnaToneOf(f), lang: hub ? hub.lang : 'en', city: hub ? hub.name : '', trick: f.dt });
  if (par) d = dnaSequel(par, d);
  DNA_CACHE.set(f.id, d);
  return d;
}
// a sequel keeps the hero, the opponent, the world and the image, and gets a new story
function dnaSequel(par, fresh) {
  return Object.assign({}, fresh, { hero: Object.assign({}, par.hero, { want: fresh.hero.want }), foe: par.foe, ally: par.ally, world: par.world, obj: par.obj, trick: par.trick, seq: 1, life: [] });
}
// A script's DNA is made when the script is started (newScript, an action). Older scripts from before Round 24 get
// invented DNA from their id, computed for display and never written from a view.
function dnaOfScript(sc) {
  if (!sc) return null;
  if (sc.dna) return sc.dna;
  const k = 's' + sc.id + sc.genre + sc.theme;
  if (!DNA_CACHE.has(k)) DNA_CACHE.set(k, dnaMakeScript(sc, 'invent'));
  return DNA_CACHE.get(k);
}
function dnaMakeScript(sc, src) {
  const H = typeof HUBS !== 'undefined' && HUBS[S.me.hub] || {};
  return dnaMake({ seed: (sc.id + 1) * 7919 + (S.me.id || 0) * 13, genre: sc.genre, theme: sc.theme, tone: sc.tone, lang: H.lang, city: H.name, hero: sc.hero, setting: sc.setting, source: src || 'mix', trick: sc.trickK, end: sc.endK });
}
