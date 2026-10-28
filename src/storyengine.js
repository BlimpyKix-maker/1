// ================= The story engine (Round 24) =================
// Turns a work's story DNA (src/dna.js) into writing: a logline, a beat sheet, a synopsis, sample pages in
// screenplay format, a reader's notes, critics' lines, trailer voice-over, an awards speech, song lyrics with a
// playable chord chart, and the shape of plays, podcasts and videos. Everything is picked from the hand-written
// library (WLIB, src/wlib-*.js) by hash, so a work always reads the same, and nothing calls a model.
// Craft shows on the page: a writer's skill sets the mix of clumsy (level 1), competent (2) and sharp (3) fragments.

// ---- picking fragments ----
const WL = { idx: null };
function wlIndex() {
  if (WL.idx) return WL.idx;
  const I = {};
  for (const k in WLIB.T) {
    const m = I[k] = {};
    for (const e of WLIB.T[k]) {
      if (!e.gs) { e.gs = e[0] === '*' ? null : new Set(String(e[0]).split(',').map(x => x.trim())); e.ts = e[1] === '*' ? null : new Set(String(e[1]).split(',').map(x => x.trim())); }
      (m[e[2]] = m[e[2]] || []).push(e);
    }
  }
  return WL.idx = I;
}
function wlList(kind, tag) {
  const m = wlIndex()[kind] || {}; if (m[tag]) return m[tag];
  const out = []; for (const t in m) if (t.startsWith(tag + '.')) out.push(...m[t]); return m[tag] = out;
}
// craft 0..1 → how likely each level is
// Round 25: flatter weights, so each work draws on far more of the library (repeats were too easy to spot)
function wlDist(c) { c = clamp(c, 0, 1); const p1 = clamp(.6 - c * .75, .12, .6), p3 = clamp(c * .85 - .15, .12, .65); return { 0: 1, 1: p1, 2: Math.max(.2, 1 - p1 - p3), 3: p3 }; }
// o: { g, tone, c (craft), r, used }
function wlPick(kind, tag, o) {
  const L = wlList(kind, tag); if (!L.length) return null;
  const D = o.c === undefined ? null : wlDist(o.c), W = [];
  let tot = 0;
  for (const e of L) {
    let w = e.gs ? (o.g && e.gs.has(o.g) ? 1.8 : 0) : 1; if (!w) continue;
    w *= e.ts ? (o.tone && e.ts.has(o.tone) ? 1.5 : .55) : 1;
    w *= D ? D[e[3]] ?? .1 : 1;
    if (o.used && o.used.has(e[4])) w *= .01;
    if (w > 0) { W.push([e, w]); tot += w; }
  }
  if (!W.length) return null;
  let x = (o.r ? o.r() : Math.random()) * tot;
  for (const [e, w] of W) if ((x -= w) <= 0) { if (o.used) o.used.add(e[4]); return e; }
  const e = W[W.length - 1][0]; if (o.used) o.used.add(e[4]); return e;
}
function wlText(kind, tag, o, d) { const e = wlPick(kind, tag, o); return e ? (d ? dnaFill(e[4], d) : e[4]) : ''; }
const cap1 = s => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
const aAn = s => (/^[aeiou]/i.test(String(s)) ? 'an ' : 'a ') + s;

// ---- the shape of the story ----
function dnaLogline(d) {
  const h = d.hero, f = d.foe;
  return dnaFill(cap1(`${aAn(h.job)} who ${h.flaw} tries to ${h.want}, but ${f.who} ${f.want}.`), d);
}
function dnaBeats(d) {
  const h = d.hero, need = /^to /.test(h.need || '') ? h.need : 'to ' + (h.need || 'let go');
  return [
    ['Opening image', `We meet {H}, ${aAn(h.job)}, at {PLACE}, ${d.world.desc}${d.world.city && !d.world.desc.includes(d.world.city) && !/ in [A-Z]/.test(d.world.desc) ? ` in ${d.world.city}` : ''}. {He} ${h.flaw}.`],
    ['Inciting incident', d.inc[1]],
    ['Into act two', `{H} decides to ${h.want}, whatever it costs. In the way: ${d.foe.who}, {R}, who ${d.foe.want}.`],
    ['Fun and games', `${cap1(d.hook || 'the promise of the premise')}, with {A}, ${d.ally.who}, along for the ride.`],
    ['Midpoint', d.mid],
    ['All is lost', `Everything {H} has built falls apart, and the old wound opens again: ${h.wound}.`],
    ['Climax', `{H} faces {R} at {PLACE}. What {he} really needs is ${need}.`],
    ['Final image', `${d.end} ${cap1(d.obj.o)}, ${d.obj.how}, is the last thing we see.`]
  ].map(([k, t]) => [k, dnaFill(t, d)]);
}
function dnaSynopsis(d) {
  const B = dnaBeats(d);
  return [B[0][1], B[1][1], B[2][1], B[4][1], B[6][1], B[7][1]].join(' ') + ` ${dnaFill(d.arg, d)}`;
}
function dnaTrickLine(d) { const t = DNA_POOLS.tricks[d.trick]; return t ? t : ['Told straight', 'Beginning, middle and end, in that order.']; }

// ---- pages ----
const DNA_EXT = /STREET|ROAD|FIELD|BEACH|DESERT|ROOF|YARD|PIER|DOCK|PARK|BRIDGE|FOREST|MOUNTAIN|SQUARE|HIGHWAY|PLAIN|RIVER|SHORE|TRAIL|CAMP|TRENCH|DECK|GARDEN|LOT|PLATFORM|COURTYARD|ALLEY|CEMETERY|RANCH|CORRAL|CANYON|COAST|HARBOU?R|QUARRY|MARKET|JUNGLE|ORBIT|SURFACE|BATTLEFIELD|RUINS|VILLAGE|MOOR|LAKE|SEA\b/;
const BEAT_TAG = ['setup', 'reveal', 'conflict', 'breather', 'turn', 'conflict', 'payoff', 'payoff'];
const ROMAN = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT'];
function dnaCue(code, d) { return (code === 'H' ? d.hero.n : code === 'R' ? d.foe.n : d.ally.n).toUpperCase(); }
function dnaExch(text, d) {
  const out = [];
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim(); if (!l) continue;
    if (l.startsWith('>')) { out.push('', dnaFill(l.slice(1).trim(), d)); continue; }
    const m = /^(H|R|A):\s*(\(([^)]*)\))?\s*(.*)$/.exec(l); if (!m) { out.push('', dnaFill(l, d)); continue; }
    out.push('', dnaCue(m[1], d)); if (m[3]) out.push(`(${dnaFill(m[3], d)})`); if (m[4]) out.push(dnaFill(m[4], d));
  }
  return out;
}

// ---- generated openings and endings (Round 25) ----
// Some scenes open and close on sentences built from the work's own DNA (its place, its object, its hero's job and
// flaw) and small pools of sound, light and gesture, so they are new in every work; the library carries the rest.
var GEN_SOUND = ['a radiator knocking', 'a dog two gardens over', '~the fridge starting up', '~traffic on wet tarmac', 'a kettle working itself up', 'gulls arguing', '~a television through the wall', 'a clock with a loud tick', 'someone practising scales upstairs', '~the hum of a vending machine', '~a lorry reversing', 'church bells, slightly out of time', 'wind in a loose window', 'a tap that won\'t stop dripping', '~a far-off siren', '~a radio playing to nobody', 'crickets', '~a lift arriving on another floor', 'the creak of a ceiling fan', '~a train passing, then silence', 'pigeons on the gutter', '~a phone buzzing in another room', 'the sea, close', 'rain on a tin roof', '~a generator in the yard', 'children in a playground', '~a till drawer slamming', 'an argument, muffled', 'the hiss of a gas fire', 'a foghorn'];
var GEN_LIGHT = ['Early light, the colour of weak tea.', '~One bulb, no shade.', 'Late sun through dirty glass.', '~Blue light from a screen nobody is watching.', '~Strip lights, one of them flickering.', '~Streetlight in stripes through the blinds.', 'Grey, even light. The kind that forgives nothing.', 'Candlelight, because the power is out again.', '~Neon from the shop across the road.', 'The last of the daylight.', '~Headlights sweep the ceiling and are gone.', '~A desk lamp makes an island in the dark.', 'Winter light, low and hard.', '~Light from an open fridge.', 'Dawn, not yet committed.'];
var GEN_DO = ['turns {OBJ} over in {his} hands', 'sets {OBJ} down, squares it, sets it down again', 'wipes {OBJ} with a sleeve', 'counts something under {his} breath', 'checks {OBJ}, as if it might have changed', 'stands very still and listens', 'reads the same line twice', 'rolls up {his} sleeves and gets on with it', 'eats standing up, watching the door', 'writes something down and crosses it out', 'pockets {OBJ} and looks round to see if anyone saw', 'fixes a crooked picture that was not crooked', 'looks at {OBJ} for a long time', 'waits, which {he} is bad at', 'practises a sentence in the window\'s reflection', 'straightens chairs that nobody will sit in'];
var GEN_OPEN = [
  '{PLACE_C}. {LIGHT} {H} {DO}.', '{PLACE_C}, {DESC}. Somewhere: {SOUND}. {H} {DO}.', '{LIGHT} {PLACE_C}. {H}, still in {his} {JOB} clothes, {DO}.',
  'We hear {SOUND} before we see anything. Then: {PLACE}, and {H}, who {DO}.', '{PLACE_C}. Nobody else here yet. {H} {DO}.', '{H} has been at {PLACE} since before anyone else. {LIGHT} {He} {DO}.',
  'Close on {OBJ}. Pull back: {PLACE}, {DESC}. {H} {DO}.', '{SOUND_C}. {PLACE_C}. {H} {DO}, then thinks better of it.', '{PLACE_C} at the end of a long shift. {H} {DO}.',
  '{LIGHT} Within reach: {OBJ}. {H} {DO}.', '{H} at {PLACE}. {He} {DO}. The sound of {SOUND} fills the gap where a conversation should be.', '{PLACE_C}, {DESC}. {LIGHT}'];
var GEN_BUTTON = ['{H} leaves {OBJ} where {he} found it. Almost.', 'On {his} way out, {H} switches off the light. Then switches it back on.', '{SOUND_C}. Nobody moves.', '{H} pockets {OBJ}. Decision made.', 'The door closes. {OBJ} is still on the table.', '{H} laughs once, at nothing, and goes.', 'Hold on {OBJ}, {HOW}.', '{H} looks at {OBJ}, {HOW}, and doesn\'t say what {he}\'s thinking.', 'Outside, {SOUND}. {H} picks up {his} coat.', 'CUT TO BLACK on {H}\'s face, deciding.'];
var GEN_ACTION = ['{H} {DO}.', 'Somewhere: {SOUND}. {H} doesn\'t look up.', '{H} {DO}, and nobody stops {him}.', '{LIGHT} {H} {DO}.', '{H} puts {OBJ} where {he} can see it.', 'A pause long enough to hear {SOUND}.'];
const GEN_OLD = new Set(['Western', 'Fantasy', 'Period', 'War', 'Martial arts']);
function genFill(t, d, r) {
  const old = GEN_OLD.has(d.g), ok = x => !(old && x[0] === '~'), pk = a => { const L = a.filter(ok); const x = L[Math.floor(r() * L.length)]; return x[0] === '~' ? x.slice(1) : x; }, place = String(dnaFill(d.world.place, d)), sound = pk(GEN_SOUND);
  return dnaFill(t.replace(/\{DO\}/g, () => pk(GEN_DO)).replace(/\{PLACE_C\}/g, cap1(place)).replace(/\{LIGHT\}/g, () => pk(GEN_LIGHT)).replace(/\{SOUND_C\}/g, cap1(sound)).replace(/\{SOUND\}/g, sound).replace(/\{DESC\}/g, d.world.desc).replace(/\{HOW\}/g, d.obj.how), d).replace(/([.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
}
// one scene for beat b (0..7)
function dnaScene(d, b, o) {
  const r = o.r, P = { g: d.g, tone: d.tone, c: o.c, r, used: o.used }, out = [], trick = d.trick;
  let open = r() < .4 ? genFill(GEN_OPEN[Math.floor(r() * GEN_OPEN.length)], d, r) : wlText('open', 'open', P, d), slug = d.world.slug;
  const m = /^(INT\.|EXT\.|INT\.\/EXT\.)\s*([^\n]*)\n?/.exec(open);
  if (m) { open = open.slice(m[0].length).trim(); if (b !== 0 && b !== 7 && trick !== 'oneroom') slug = m[2].replace(/\s*[–-]\s*\{?TIME\}?.*$/, '').replace(/\s*[–-]\s*(DAY|NIGHT|DAWN|DUSK|CONTINUOUS).*$/, '').trim() || slug; }
  const ie = DNA_EXT.test(slug) ? 'EXT.' : 'INT.';
  let time = ['DAY', 'NIGHT', 'NIGHT', 'DAWN', 'DUSK', 'DAY'][Math.floor(r() * 6)];
  if (trick === 'onenight') time = 'NIGHT'; if (trick === 'longtake' && b > 0) time = 'CONTINUOUS';
  if (trick === 'backwards') out.push(['SUPER: THE END', 'SUPER: ONE HOUR EARLIER', 'SUPER: THE NIGHT BEFORE', 'SUPER: TWO DAYS EARLIER', 'SUPER: A WEEK EARLIER', 'SUPER: A MONTH EARLIER', 'SUPER: THAT SPRING', 'SUPER: THE BEGINNING'][7 - b] || 'SUPER: EARLIER', '');
  if (trick === 'chapters') out.push(`CHAPTER ${ROMAN[o.k || 0]}: ${['THE ' + String(d.obj.o).replace(/^(the|a|an) /i, '').split(' ').slice(-1)[0].toUpperCase(), 'WHAT ' + d.hero.n.toUpperCase() + ' WANTED', 'THE OTHER SIDE', 'WHAT IT COST'][(o.k || 0) % 4]}`, '');
  const when = trick === 'twotimes' ? ` – ${(o.k || 0) % 2 ? 'NOW' : String((S.year || 2027) - 20 - (d.seed % 15))}` : '';
  out.push(`${ie} ${slug} – ${time}${when}`, '');
  if (trick === 'onenight') out.push(`SUPER: ${['9:14 P.M.', '10:02 P.M.', '11:48 P.M.', '12:31 A.M.', '1:55 A.M.', '3:10 A.M.', '4:40 A.M.', '5:58 A.M.'][b]}`, '');
  if (trick === 'longtake' && b === 0) out.push('The camera does not cut. It will not cut until the end.', '');
  if (trick === 'framed' && b === 0) out.push(`An older ${d.hero.n} sits across from someone we never see, and pours two cups.`, '', `OLDER ${d.hero.n.toUpperCase()}`, 'You want to know how it started? It started at ' + dnaFill('{PLACE}', d) + '.', '');
  if (trick === 'mosaic' && b % 2) out.push(`We are with ${d.ally.n} now, a few streets away, at the same moment.`, '');
  if (open) out.push(open, '');
  if (trick === 'dream' && r() < .5) out.push('The light is wrong in a way nobody mentions.', '');
  const ex = wlText('exch', BEAT_TAG[b] || 'conflict', P);
  if (ex) out.push(...dnaExch(ex, d).slice(1), '');
  if (r() < .6) { const a = r() < .35 ? genFill(GEN_ACTION[Math.floor(r() * GEN_ACTION.length)], d, r) : wlText('action', 'action', P, d); if (a) out.push(a, ''); }
  if (trick === 'letters') { const t = wlText('stage', 'mono', P, d); if (t) out.push(`${d.ally.n.toUpperCase()} (V.O.)`, '(reading a letter)', t, ''); }
  if (trick === 'unreliable' && b >= 2 && r() < .55) out.push(`${d.hero.n.toUpperCase()} (V.O.)`, 'That isn\'t how it happened. Not exactly.', '');
  if (trick === 'framed' && b > 0 && r() < .5) out.push(`OLDER ${d.hero.n.toUpperCase()} (V.O.)`, 'I didn\'t know yet what it would cost.', '');
  const bt = r() < .35 ? genFill(GEN_BUTTON[Math.floor(r() * GEN_BUTTON.length)], d, r) : wlText('button', 'button', P);
  if (bt) out.push(...(/^(H|R|A):/.test(bt) ? dnaExch(bt, d).slice(1) : [dnaFill(bt, d)]), '');
  if (trick === 'circular' && b === 7 && o.first) out.push(o.first + ' Again.', '');
  return { text: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), open };
}
// sample pages: the beats you've reached (a draft in progress), or the spine of a finished work
function dnaPages(d, o) {
  const r = hashRand(d.seed * 13 + (o.draft || 1) * 101 + Math.round((o.c || 0) * 10)), used = new Set();
  const beats = o.beats || [0, 1, 4, 7], out = []; let first = '';
  beats.forEach((b, k) => { const s = dnaScene(d, b, { r, c: o.c, used, k, first }); if (k === 0) first = (s.open || '').split(/(?<=\.)\s/)[0]; out.push(s.text); });
  return (d.trick === 'longtake' ? '' : 'FADE IN:\n\n') + out.join('\n\n') + (beats.includes(7) ? '\n\nFADE OUT.' : '');
}
// the best line in a page of text (dialogue under a cue)
function dnaBestLine(text) { return typeof pageStats === 'function' ? pageStats(text).best : ''; }

// ---- craft ----
function scriptCraft(sc) {
  const me = ME(); if (!me) return .5;
  const sk = ['dial', 'struc', 'char', 'orig'].map(k => me.sk[k] ?? 6), a = sk.reduce((s, x) => s + x, 0) / sk.length;
  const punch = (sc.lines || []).length * .015, draft = ((sc.draft || 1) - 1) * .06, score = sc.score ? (sc.score - 55) / 120 : 0;
  return clamp((a - 3) / 15 + punch + draft + score, 0, 1);
}
function filmCraft(f) { const q = f.reviews ?? (f.bd ? 50 + f.bd.S : 55); return clamp((q - 25) / 70, 0, 1); }

// ---- the reader and the critics ----
const DNA_TRAITS = ['hero', 'foe', 'world', 'incident', 'mid', 'end', 'theme', 'image', 'trick', 'dialogue', 'structure'];
function dnaTraitQ(d, q, k) {
  const h = hashRand(d.seed * 7 + k.length * 131 + k.charCodeAt(0))() - .5;
  let x = q / 100 + h * .45;
  if (k === 'trick') x += d.trick === 'linear' ? 0 : (DNA_POOLS.trickFit[d.trick] || []).includes(d.g) ? .1 : -.15;
  if (k === 'end') x += ((DNA_TONE_END[d.tone] || {})[d.endK] || 0) * .03 - .05;
  if (k === 'world' && d.life.some(n => /set in|neighbourhood/.test(n))) x += .12;
  if ((k === 'hero' || k === 'foe') && d.life.length) x += .06 * d.life.length;
  return x;
}
function dnaTag(kind, good, k, d) {
  const base = (good ? 'good.' : 'bad.') + k;
  if (k === 'trick' && d.trick !== 'linear' && wlList(kind, base + '.' + d.trick).length) return base + '.' + d.trick;
  if (k === 'trick') return null;
  if (k === 'end' && wlList(kind, base + '.' + d.endK).length) return base + '.' + d.endK;
  return wlList(kind, base).length ? base : null;
}
// notes on a script: the three strongest traits and the two weakest, plus the best line
function dnaNotes(d, q, pages) {
  const r = hashRand(d.seed * 3 + q), used = new Set(), T = DNA_TRAITS.filter(k => k !== 'trick' || d.trick !== 'linear').map(k => [k, dnaTraitQ(d, q, k)]).sort((a, b) => b[1] - a[1]);
  const nGood = q >= 75 ? 4 : q >= 55 ? 3 : 2, nBad = q >= 75 ? 1 : q >= 55 ? 2 : 3, out = [];
  for (const [k, v] of T.slice(0, nGood)) { const t = dnaTag('note', v > .45, k, d); if (t) out.push([v > .45, k, wlText('note', t, { r, used }, d)]); }
  for (const [k, v] of T.slice(-nBad).reverse()) { const t = dnaTag('note', v > .7, k, d); if (t) out.push([v > .7, k, wlText('note', t, { r, used }, d)]); }
  const best = pages ? dnaBestLine(pages) : '';
  return { list: out.filter(x => x[2]), best };
}
function dnaCrit(d, sc, r, used) {
  const good = sc >= 58, keys = ['trick', 'end', 'world', 'hero', 'image', 'cast', 'look', 'score', 'foe', 'theme'].filter(k => k !== 'trick' || d.trick !== 'linear');
  for (let i = 0; i < 4; i++) { const k = keys[Math.floor(r() * keys.length)], t = dnaTag('crit', good, k, d); if (t) { const x = wlText('crit', t, { r, used }, d); if (x) return x; } }
  return '';
}
function dnaVO(d, c, r) {
  const used = new Set(), out = [String(d.world.desc).replace(/^in /, 'In ').toUpperCase(), `ONE ${d.hero.job.toUpperCase()}`];
  const v = wlText('vo', 'vo', { g: d.g, tone: d.tone, c, r, used }, d); if (v) out.push(v.toUpperCase());
  return out.map(x => dnaFill(x, d));
}
function dnaSpeech(d, r) { const used = new Set(), P = { r, used }; return ['thanks', 'story', 'close'].map(t => wlText('speech', t, P, d)).filter(Boolean).join(' '); }

// ---- songs ----
// A song has a theme, a mood, someone it's about, a key, a tempo and a chord progression; its lyric is built from
// the library, rhymed in pairs, with the title as the hook.
const SONG_KEYS = [['C', 60], ['G', 55], ['D', 62], ['A', 57], ['E', 64], ['F', 53], ['B♭', 58], ['E♭', 63]];
const SONG_PROGS = { maj: [['I', 'V', 'vi', 'IV'], ['vi', 'IV', 'I', 'V'], ['I', 'vi', 'IV', 'V'], ['I', 'IV', 'vi', 'V'], ['IV', 'I', 'V', 'vi'], ['I', 'iii', 'IV', 'V'], ['ii', 'V', 'I', 'I']], min: [['i', 'VI', 'III', 'VII'], ['i', 'iv', 'v', 'i'], ['i', 'VII', 'VI', 'VII'], ['i', 'iv', 'VII', 'III'], ['i', 'VI', 'iv', 'V']] };
const DEG = { I: [0, 'maj'], ii: [2, 'min'], iii: [4, 'min'], IV: [5, 'maj'], V: [7, 'maj'], vi: [9, 'min'], i: [0, 'min'], III: [3, 'maj'], iv: [5, 'min'], v: [7, 'min'], VI: [8, 'maj'], VII: [10, 'maj'] };
const NOTE_N = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], NOTE_F = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'C♭'];
function songOf(w, who) {
  const r = hashRand((w.id + 1) * 7717 + String(w.title).length * 31), mood = w.mood || ['light', 'bittersweet', 'dark', 'absurd', 'tense'][Math.floor(r() * 5)];
  const th = w.th || dnaPick(r, THEME_KEYS), minor = mood === 'dark' || mood === 'tense' || (mood === 'bittersweet' && r() < .5);
  const key = dnaPick(r, SONG_KEYS), prog = dnaPick(r, SONG_PROGS[minor ? 'min' : 'maj']), bpm = Math.round((mood === 'light' || mood === 'absurd' ? 104 : mood === 'tense' ? 118 : 76) + r() * 24);
  const flat = ['F', 'B♭', 'E♭'].includes(key[0]) || (minor && ['C', 'G', 'D', 'F', 'B♭', 'E♭'].includes(key[0])), NN = flat ? NOTE_F : NOTE_N, chords = prog.map(x => { const [s, q] = DEG[x]; return NN[(key[1] + s) % 12].replace('C♭', 'B') + (q === 'min' ? 'm' : ''); });
  return { r, mood, th, minor, key: key[0] + (minor ? ' minor' : ' major'), root: key[1], prog, chords, bpm, to: w.to || dnaFirst(r, 'en', r() < .5 ? 'F' : 'M') };
}
function songLyric(w, c) {
  const s = songOf(w), r = hashRand((w.id + 3) * 4111), used = new Set(), H = typeof HUBS !== 'undefined' && S.me && HUBS[S.me.hub];
  const d = { hero: { n: '', g: 'X' }, foe: { n: '', g: 'X' }, ally: { n: s.to }, world: { place: 'the old place', city: H ? H.name : 'the city' }, obj: { o: 'the photograph' }, loss: 'you', years: ['seven years', 'two summers', 'a decade', 'nineteen years'][Math.floor(r() * 4)] };
  const fillL = t => dnaFill(t, d);
  const tagged = sec => { const L = wlList('lyric', sec + '.' + s.th); return L.length ? sec + '.' + s.th : sec; };
  const pair = sec => {
    const a = wlPick('lyric', tagged(sec), { tone: s.mood, c, r, used }); if (!a) return [];
    const L = wlList('lyric', tagged(sec)).filter(e => e[5] === a[5] && e !== a && !used.has(e[4]));
    const b = L.length ? L[Math.floor(r() * L.length)] : wlPick('lyric', tagged(sec), { tone: s.mood, c, r, used }); if (b) used.add(b[4]);
    return [fillL(a[4]), b ? fillL(b[4]) : ''].filter(Boolean);
  };
  const title = String(w.title).replace(/, ep\..*$/, '');
  const verse = () => [...pair('verse'), ...pair('verse')], chorus = [title, ...pair('chorus'), title + (s.mood === 'light' ? ', oh' : '')], bridge = pair('bridge');
  return { s, parts: [['Verse 1', verse()], ['Chorus', chorus], ['Verse 2', verse()], ['Chorus', chorus], ['Bridge', bridge], ['Chorus', chorus]] };
}
// a few bars of the song, played in the browser: chords on a soft pad, a bass, and a melody from the scale
let SONG_PLAYER = null;
function songStop() { if (SONG_PLAYER) { try { clearInterval(SONG_PLAYER.t); SONG_PLAYER.ctx.close(); } catch (e) { } SONG_PLAYER = null; } }
function songPlay(w) {
  songStop();
  let ctx; try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
  const s = songOf(w), r = hashRand((w.id + 5) * 991), out = ctx.createGain(); out.gain.value = .14; out.connect(ctx.destination);
  const hz = n => 440 * Math.pow(2, (n - 69) / 12), beat = 60 / s.bpm;
  const tone = (n, t, dur, v, type) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = hz(n); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05); };
  const scale = s.minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11], mel = Array.from({ length: 16 }, () => r() < .2 ? null : scale[Math.floor(r() * 5)] + (r() < .25 ? 12 : 0));
  let bar = 0; const t0 = ctx.currentTime + .1;
  const play = () => {
    for (let i = 0; i < 4 && bar < 16; i++, bar++) {
      const ch = s.prog[bar % 4], [st, q] = DEG[ch], root = s.root + st, t = t0 + bar * 4 * beat, third = q === 'min' ? 3 : 4;
      for (const n of [root, root + third, root + 7]) tone(n, t, 4 * beat, .12, 'triangle');
      tone(root - 12, t, beat * 1.8, .25, 'sine'); tone(root - 12, t + 2 * beat, beat * 1.8, .2, 'sine');
      for (let k = 0; k < 4; k++) { const m = mel[(bar % 4) * 4 + k]; if (m !== null) tone(s.root + 12 + m, t + k * beat, beat * .9, .1, 'sine'); }
    }
    if (bar >= 16) { clearInterval(SONG_PLAYER && SONG_PLAYER.t); setTimeout(() => { if (SONG_PLAYER && SONG_PLAYER.ctx === ctx) songStop(); }, 17 * 4 * beat * 1000 - (ctx.currentTime - t0) * 1000); }
  };
  SONG_PLAYER = { ctx, t: setInterval(play, 3 * 4 * beat * 1000), w: w.id }; play();
  return true;
}

// ---- plays, podcasts, videos, musicals ----
function stageOf(w, d, c) {
  const r = hashRand((w.id + 9) * 3301), used = new Set(), P = { g: d.g, tone: d.tone, c, r, used };
  const nums = w.type === 'musical' ? ['open', 'want', 'eleven', 'finale'].map(t => [t, wlText('num', t, P, d)]) : [];
  return { open: wlText('stage', 'open', P, d), dirs: [wlText('stage', 'direction', P, d), wlText('stage', 'direction', P, d)].filter(Boolean), mono: wlText('stage', 'mono', P, d), nums };
}
function podOf(w, c) {
  const show = String(w.title).split(', ep.')[0], rs = hashRand(show.length * 97 + show.charCodeAt(0) * 13), re = hashRand((w.id + 2) * 577), me = ME();
  const d = { hero: { n: me ? me.name.split(' ')[0] : 'the host', g: me ? me.g : 'X' }, foe: { n: '', g: 'X' }, ally: { n: dnaFirst(re, 'en', re() < .5 ? 'F' : 'M') }, world: { place: 'the studio', city: (HUBS[S.me.hub] || {}).name || 'the city' }, obj: { o: 'the microphone' }, loss: 'the old show' };
  return { format: wlText('pod', 'format', { r: rs, tone: '*' }, d), arc: wlText('pod', 'arc', { r: rs }, d), hook: wlText('pod', 'hook', { c, r: re }, d) };
}
function vidOf(w, c) {
  const r = hashRand((w.id + 4) * 811), me = ME();
  const d = { hero: { n: me ? me.name.split(' ')[0] : 'me', g: me ? me.g : 'X' }, foe: { n: '', g: 'X' }, ally: { n: dnaFirst(r, 'en', 'F') }, world: { place: 'my kitchen', city: (HUBS[S.me.hub] || {}).name || 'the city' }, obj: { o: 'the camera' }, loss: 'my old channel' };
  return { format: wlText('vid', 'format', { r }, d), hook: wlText('vid', 'hook', { c, r }, d) };
}
