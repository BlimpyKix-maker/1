// ---------------- More to do, more to want ----------------
// One-week gigs on the board (weddings, corporate videos, voiceovers, script coverage), more evenings out, more
// contests, a marketplace on the computer (gear, books, courses, experiences, luxuries, and collectibles from real
// film history that rise and fall in value), and achievements: badges for the things a life in film collects.

// ---- gigs: quick paid work, a week or less ----
const GIGS = [
  { k: 'g_wedding', t: 'Wedding videographer', subs: ['comp', 'move'], days: 2, rate: 260, fam: 'cam', d: 'Two cameras, one couple, a drunk uncle who wants to be interviewed.' },
  { k: 'g_corporate', t: 'Corporate video shooter', subs: ['light', 'comp'], days: 2, rate: 300, fam: 'cam', d: 'A CEO says "synergy" eleven times. You light him like a movie star.' },
  { k: 'g_vo', t: 'Voiceover session', subs: ['voice', 'pres'], days: 1, rate: 350, fam: 'act', d: 'Read a supermarket ad forty ways. "Now warmer. Now less warm."' },
  { k: 'g_coverage', t: 'Script reader (coverage, five scripts)', subs: ['struc', 'tas'], days: 2, rate: 160, fam: 'wri', d: 'Read, summarise and grade five scripts for a production company. Mostly "pass".' },
  { k: 'g_extra', t: 'Background extra (one day)', subs: ['pres', 'eth'], days: 1, rate: 120, fam: 'act', d: 'Walk past the window. Again. Again. Lunch is excellent.' },
  { k: 'g_subtitle', t: 'Subtitle editor', subs: ['rhythm', 'lang'], days: 3, rate: 220, fam: 'edt', d: 'Time a foreign film\'s subtitles to the frame. Two lines, forty-two characters.' },
  { k: 'g_workshop', t: 'Weekend workshop tutor', subs: ['cha', 'tas'], days: 2, rate: 280, fam: 'pro', tier: 2, d: 'Teach twelve beginners what you wish someone had taught you.' },
  { k: 'g_scoutday', t: 'Location scout (day hire)', subs: ['comp', 'vis'], days: 1, rate: 200, fam: 'pro', d: 'Find a diner, a cliff and a 1970s kitchen by Thursday.' },
  { k: 'g_stills', t: 'Set stills photographer', subs: ['comp', 'light'], days: 3, rate: 330, fam: 'cam', d: 'The one photo on the poster might be yours.' },
  { k: 'g_drone', t: 'Drone operator', subs: ['move', 'comp'], days: 1, rate: 420, fam: 'cam', d: 'Sweeping aerials of a coastline, until the battery dies.' },
  { k: 'g_mocap', t: 'Motion-capture performer (game)', subs: ['phys', 'impro'], days: 2, rate: 380, fam: 'act', d: 'A lycra suit with dots on, fighting an imaginary dragon.' },
  { k: 'g_audiobook', t: 'Audiobook narrator', subs: ['voice', 'range'], days: 3, rate: 450, fam: 'act', d: 'Eleven hours, fourteen characters, one glass of water.' },
  { k: 'g_projection', t: 'Relief projectionist', subs: ['eth', 'tas'], days: 2, rate: 150, fam: 'cinema', d: 'Thread 35mm in a booth older than you. Don\'t let it burn.' },
  { k: 'g_archive', t: 'Film archive cataloguer', subs: ['tas', 'cont'], days: 3, rate: 170, fam: 'cinema', d: 'Label cans of film nobody has watched in fifty years. Watch some.' },
  { k: 'g_trailer', t: 'Freelance trailer editor', subs: ['rhythm', 'shape'], days: 3, rate: 480, fam: 'edt', tier: 2, d: 'Two minutes that sell two hours. "In a world…"' },
  { k: 'g_dialect', t: 'Dialect coach (short engagement)', subs: ['voice', 'lang'], days: 2, rate: 360, fam: 'act', tier: 2, d: 'Make a famous actor sound like they grew up somewhere they didn\'t.' },
  { k: 'g_colour', t: 'Colour assist (music video)', subs: ['colour', 'tas'], days: 2, rate: 240, fam: 'edt', d: 'Make it look expensive. It wasn\'t.' },
  { k: 'g_adr', t: 'ADR recordist', subs: ['sound', 'cont'], days: 2, rate: 260, fam: 'snd', d: 'Actors re-record lines in a dark booth, matching their own lips.' },
  { k: 'g_casting_reader', t: 'Casting session reader', subs: ['range', 'impro'], days: 1, rate: 140, fam: 'cst', d: 'Read opposite forty actors auditioning for the same part. Be generous every time.' },
  { k: 'g_festival_vol', t: 'Festival volunteer (one week)', subs: ['cha', 'eth'], days: 3, rate: 0, fam: 'cinema', d: 'Unpaid, but you get a lanyard, a T-shirt and every party.' },
  { k: 'g_pitchdeck', t: 'Pitch deck designer', subs: ['vis', 'mkt'], days: 2, rate: 300, fam: 'pro', d: 'Make a producer\'s dream look bankable in twelve slides.' },
  { k: 'g_tour_guide', t: 'Studio tour guide', subs: ['cha', 'tas'], days: 3, rate: 140, fam: 'cinema', d: 'Walk tourists past the famous water tower. Repeat the same jokes.' }
];
for (const g of GIGS) Object.assign(g, { tier: g.tier || 1, weeks: 1, cat: 'gig', biz: 'Gig', field: 'film' });
for (const g of GIGS) if (!ODD_BY[g.k]) { ODD_JOBS.push(g); ODD_BY[g.k] = g; }
if (typeof POST_FAMILY !== 'undefined') for (const g of GIGS) POST_FAMILY[g.k] = g.fam;
function gigPosts() {
  const M = S.me, L = GIGS.filter(g => !M.jobs.some(j => j.k === g.k)), out = [];
  const n = 2 + (prnd() < .5 ? 1 : 0);
  for (let i = 0; i < n && L.length; i++) out.push(makePost(L.splice(Math.floor(prnd() * L.length), 1)[0], null));
  return out;
}

// ---- more evenings ----
Object.assign(VENUES, {
  karaoke: { label: 'Karaoke bar', icon: '🎤', e: 9, stress: -5, cost: 20, d: 'Power ballads with the camera department. Bonding through humiliation.', grow: { voice: .03 }, meet: .2 },
  filmclub: { label: 'Film society screening', icon: '📽️', e: 4, stress: -2, cost: 8, d: 'A classic, then an argument about it in the bar. The best kind.', grow: { tas: .04, tone: .01 }, meet: .25 },
  improv: { label: 'Improv class', icon: '🎭', e: 8, stress: -1, cost: 25, d: '"Yes, and…" for three hours. You leave braver.', grow: { impro: .06, comic: .03 } },
  dance: { label: 'Dance class', icon: '💃', e: 9, stress: -4, cost: 18, d: 'Salsa, swing or contemporary. Your body learns to listen.', grow: { phys: .05 }, body: .03 },
  museum: { label: 'Late night at the museum', icon: '🏛️', e: 4, stress: -3, cost: 12, d: 'Old paintings by torchlight. Designers take notes.', grow: { period: .04, vis: .03 } },
  rooftop: { label: 'Rooftop cinema', icon: '🌃', e: 5, stress: -4, cost: 22, d: 'A cult film under the stars, with headphones and blankets.', grow: { tas: .02 }, meet: .15 },
  bookclub: { label: 'Screenplay reading group', icon: '📖', e: 5, stress: -1, cost: 0, d: 'Actors read a new script aloud. You hear what works and what doesn\'t.', grow: { dial: .04, char: .03 }, meet: .2 },
  boxing: { label: 'Boxing gym', icon: '🥊', e: 12, stress: -7, cost: 15, d: 'Hit something that isn\'t a producer. Stunt people train here.', grow: { phys: .04, stunt: .02 }, body: .06 },
  cooking: { label: 'Cooking class', icon: '🍳', e: 6, stress: -4, cost: 35, d: 'Make pasta from scratch with strangers. Two become friends.', meet: .15 },
  qa: { label: 'Director Q&A', icon: '🎙️', e: 4, stress: -1, cost: 16, d: 'A screening, then the director answers questions. Ask a good one.', grow: { vstory: .03, dact: .02 }, meet: .3 },
  poker: { label: 'Industry poker night', icon: '🃏', e: 10, stress: 1, cost: 60, d: 'Agents, producers and a cinematographer who never loses. High stakes, higher gossip.', check: ['com', 12], meet: .35, stake: 120, okT: 'You read the table all night and walk away $120 up, with three new numbers.', badT: 'A cinematographer with a terrible poker face takes $120 off you. Still, good gossip.' },
  choir: { label: 'Community choir', icon: '🎶', e: 6, stress: -6, cost: 5, d: 'Sixty voices, one note. Composers find each other here.', grow: { theme: .03, voice: .02 } }
});

// ---- more contests ----
COMPS.push(
  { k: 'monologue', cat: 'act', tier: 'industry', name: 'The Open Monologue Slam', month: 2, fee: 15, stat: 'range', dc: 13, prize: 1200, stand: 1, meet: 2, d: 'Two minutes, one spotlight, three casting directors on the panel.' },
  { k: 'selftape', cat: 'act', tier: 'fun', name: 'The Self-Tape Showdown', month: 6, fee: 0, stat: 'pres', dc: 11, prize: 150, d: 'Everyone tapes the same scene in their bedroom. The internet votes.' },
  { k: 'voiceaward', cat: 'act', tier: 'industry', name: 'The Voice Arts Prize', month: 10, fee: 25, stat: 'voice', dc: 14, prize: 2500, stand: 2, d: 'Narration, animation and audio drama, judged blind.' },
  { k: 'stuntshow', cat: 'craft', tier: 'industry', name: 'The Stunt Showcase', month: 8, fee: 30, stat: 'stunt', dc: 14, prize: 3000, stand: 2, meet: 2, d: 'Falls, fights and fire, performed live for coordinators.' },
  { k: 'costumecon', cat: 'craft', tier: 'fun', name: 'The Costume Build-Off', month: 9, fee: 20, stat: 'wardrobe', dc: 12, prize: 400, meet: 1, d: 'Seventy-two hours to make a costume from a charity-shop bag.' },
  { k: 'setdesign', cat: 'craft', tier: 'industry', name: 'The Young Designers\' Model Box Prize', month: 4, fee: 25, stat: 'sets', dc: 14, prize: 2500, stand: 2, d: 'Design a set in miniature. Theatre and film designers judge.' },
  { k: 'vfxjam', cat: 'craft', tier: 'fun', name: 'The 72-Hour VFX Jam', month: 1, fee: 0, stat: 'digi', dc: 12, prize: 300, energy: -15, meet: 2, d: 'Make a shot that couldn\'t exist. Sleep optional.' },
  { k: 'makeupwars', cat: 'craft', tier: 'fun', name: 'Monster Makeup Wars', month: 9, fee: 15, stat: 'mkup', dc: 12, prize: 350, d: 'Turn a volunteer into a creature in four hours, live on stage.' },
  { k: 'scorechall', cat: 'music', tier: 'industry', name: 'The Film Scoring Challenge', month: 5, fee: 30, stat: 'score', dc: 14, prize: 3000, stand: 2, meet: 1, d: 'Everyone scores the same three-minute scene. Composers listen in.' },
  { k: 'pitchfest', cat: 'produce', tier: 'industry', name: 'The Pitch Pit', month: 3, fee: 40, stat: 'pack', dc: 14, prize: 5000, stand: 2, meet: 3, d: 'Five minutes to pitch a film to a room of financiers. They can say yes on the spot.' },
  { k: 'budgetbattle', cat: 'produce', tier: 'fun', name: 'The Micro-Budget Challenge', month: 7, fee: 10, stat: 'bud', dc: 12, prize: 500, d: 'Make a short for exactly one hundred dollars. Receipts are checked.' },
  { k: 'trivia', cat: 'fun', tier: 'fun', name: 'The Pub Film Quiz League', month: 0, fee: 5, stat: 'tas', dc: 11, prize: 80, meet: 1, d: 'Name the year, the director and the stunt double. Bragging rights for a month.' },
  { k: 'lookalike', cat: 'fun', tier: 'fun', name: 'The Celebrity Lookalike Contest', month: 7, fee: 5, stat: 'pres', dc: 12, prize: 200, d: 'You don\'t look like anyone. Or do you?' },
  { k: 'storyslam', cat: 'write', tier: 'fun', name: 'The True Story Slam', month: 11, fee: 0, stat: 'char', dc: 11, prize: 120, meet: 1, d: 'Five minutes, a true story, no notes. A theme each month.' },
  { k: 'adaptprize', cat: 'write', tier: 'industry', name: 'The Adaptation Prize', month: 8, fee: 35, stat: 'adapt', dc: 14, need: 'script', prize: 4000, stand: 2, d: 'Adapt a public-domain story for the screen. The estate of nobody judges.' },
  { k: 'docpitch', cat: 'direct', tier: 'industry', name: 'The Documentary Forum', month: 10, fee: 30, stat: 'vstory', dc: 14, prize: 6000, stand: 2, meet: 2, d: 'Pitch a documentary to broadcasters. The best gets development money.' }
);

// ---- the marketplace ----
const BAZAAR = {
  gear: { label: '🎒 Gear', items: {
    laptop: { name: 'A fast laptop', price: 1400, d: 'Everything opens instantly. −1 stress a week.', fx: { stress: -1 } },
    phones: { name: 'Noise-cancelling headphones', price: 350, d: 'The world goes quiet. −1 stress a week.', fx: { stress: -1 } },
    lens: { name: 'Vintage prime lens set', price: 2200, d: 'Glass with character. Composition and lighting grow every week.', fx: { grow: { comp: .015, light: .01 } } },
    drone: { name: 'A camera drone', price: 1600, d: 'Aerials whenever you want. Movement grows every week.', fx: { grow: { move: .015 } } },
    recorder: { name: 'Field recorder and shotgun mic', price: 900, d: 'Record the city. Sound sense grows every week.', fx: { grow: { sound: .015, sdes: .01 } } },
    panel: { name: 'Colour-grading panel', price: 1900, d: 'Three trackballs of pure power. Colour grows every week.', fx: { grow: { colour: .02 } } },
    keys: { name: 'Weighted MIDI keyboard', price: 700, d: 'Eighty-eight keys. Melody and songwriting grow every week.', fx: { grow: { theme: .015, song: .01 } } },
    sewing: { name: 'Industrial sewing machine', price: 1100, d: 'Costume and period detail grow every week.', fx: { grow: { wardrobe: .015, period: .008 } } },
    mirror: { name: 'Rehearsal mirror and lights', price: 450, d: 'Watch yourself work. Presence grows every week.', fx: { grow: { pres: .012, range: .008 } } }
  } },
  books: { label: '📚 Books', items: {
    b_struct: { name: 'The Story Bible (screenwriting classic)', price: 30, once: { struc: .5, char: .3 }, d: 'Read once: structure and character.' },
    b_direct: { name: 'Notes on Directing Actors', price: 28, once: { dact: .5, tone: .2 }, d: 'Read once: directing actors and tone.' },
    b_dp: { name: 'Masters of Light (interviews with cinematographers)', price: 45, once: { light: .5, comp: .3 }, d: 'Read once: lighting and composition.' },
    b_edit: { name: 'In the Cutting Room', price: 25, once: { rhythm: .5, shape: .3 }, d: 'Read once: rhythm and story shaping.' },
    b_prod: { name: 'Money for Films: a Producer\'s Field Guide', price: 40, once: { fin: .5, pack: .3 }, d: 'Read once: financing and packaging.' },
    b_act: { name: 'An Actor Prepares, Again', price: 22, once: { range: .5, pres: .3 }, d: 'Read once: range and presence.' },
    b_score: { name: 'Scoring for the Screen', price: 35, once: { score: .5, orch: .3 }, d: 'Read once: scoring and orchestration.' },
    b_design: { name: 'Worlds on Paper: Production Design', price: 38, once: { sets: .5, world: .3 }, d: 'Read once: sets and world-building.' },
    b_hist: { name: 'A History of Cinema in 500 Films', price: 50, once: { tas: .6 }, d: 'Read once: taste.' }
  } },
  courses: { label: '🎓 Courses & experiences', items: {
    c_master: { name: 'Weekend masterclass with a working pro', price: 600, once: { _main: 1 }, energy: -10, d: 'Two intense days in your main craft. A big step up.' },
    c_pass: { name: 'Festival industry pass', price: 450, meet: 3, energy: -8, d: 'Panels, parties and three new people who matter.' },
    c_spa: { name: 'A weekend away', price: 380, stress: -18, energy: 15, d: 'Sleep, walk, phone off. Come back human.' },
    c_trip: { name: 'A week of cinema in another city', price: 900, once: { tas: .4 }, meet: 1, stress: -8, d: 'Retrospectives, galleries and one new friend.' },
    c_therapy: { name: 'A course of therapy', price: 700, stress: -25, d: 'Six sessions. You stop grinding your teeth.' },
    c_language: { name: 'An intensive language course', price: 520, once: { lang: .8 }, energy: -6, d: 'Work abroad gets easier.' },
    c_stuntcamp: { name: 'Stunt and fight camp', price: 800, once: { stunt: .6, phys: .4 }, energy: -14, d: 'Falls, wire work and how to throw a fake punch.' },
    c_pitch: { name: 'Pitch coaching', price: 300, once: { pack: .3, cha: .3 }, d: 'Learn to tell a film in sixty seconds.' }
  } },
  luxury: { label: '✨ Luxuries', items: {
    suit: { name: 'A tailored suit', price: 2400, standing: 1, d: 'People take you seriously at premieres. +1 standing once.' },
    art: { name: 'A painting by a young artist', price: 3000, collect: 1, d: 'It might be worth something one day. Or it might not.' },
    wine: { name: 'A case of good wine', price: 600, collect: 1, d: 'It gets better. You could drink it, or sell it.' },
    season: { name: 'Season tickets to the opera', price: 1800, fx: { stress: -1 }, meet: 1, d: 'A box, some patrons, and their friends who fund films.' },
    charter: { name: 'A weekend on a chartered yacht', price: 9000, meet: 2, stress: -10, standing: 1, d: 'Festival week. The people on the next boat are famous.' },
    watch2: { name: 'A collector\'s watch', price: 12000, collect: 1, standing: 1, d: 'Holds its value better than most films.' }
  } }
};
const BZ_BY = {}; for (const c in BAZAAR) for (const k in BAZAAR[c].items) BZ_BY[k] = Object.assign({ cat: c, k }, BAZAAR[c].items[k]);
// Collectibles from real film history: a different handful of lots each month.
function bzLots() {
  const mo = Math.floor(S.week / 4), r = hashRand(mo * 977 + 13), pool = [];
  for (let i = 0; i < 60 && pool.length < 6; i++) { const f = S.films[Math.floor(r() * S.films.length)]; if (f && f.rel !== null && f.q >= 55 && S.week - f.rel > 52 && !pool.some(x => x.film === f.id)) pool.push({ film: f.id, kind: Math.floor(r() * 4) }); }
  return pool.map((x, i) => { const f = S.films[x.film], kind = ['poster', 'script', 'prop', 'still'][x.kind]; return { id: `lot${mo}-${i}`, film: f.id, kind, name: { poster: `Original one-sheet poster: ${f.title}`, script: `Shooting script: ${f.title}`, prop: `Screen-used prop from ${f.title}`, still: `Signed lobby card: ${f.title}` }[kind], price: lotBase(f, kind) }; });
}
function grossM(f) { const g = f.gross; return typeof g === 'number' ? g : g ? Object.values(g).reduce((a, b) => a + (+b || 0), 0) : 0; }
function lotBase(f, kind) { const age = Math.max(0, S.year - yearOf(f.rel)), m = { poster: 1, script: 1.6, prop: 3, still: .5 }[kind]; return Math.round((120 + Math.max(0, f.q - 50) * 25 + Math.log10(grossM(f) * 1e6 + 10) * 25 + age * 18) * m / 10) * 10; }
// What it would fetch today (2027 dollars): drifts month to month, grows slowly, jumps when the film gets talked about.
function bzValue(it) {
  const yrs = (S.week - it.w) / 52, mo = Math.floor(S.week / 4), n = hashRand((it.seed || 1) * 31 + mo)();
  if (it.film !== undefined) { const f = S.films[it.film]; return Math.round(lotBase(f, it.kind) * (1 + .06 * yrs) * (.8 + n * .45)); }
  const B = BZ_BY[it.k]; if (!B || !B.collect) return 0;
  return Math.round(B.price * (it.k === 'art' ? (.4 + n * 1.6) * (1 + .1 * yrs) : it.k === 'wine' ? (1 + .08 * yrs) * (.85 + n * .3) : (.8 + .04 * yrs) * (.9 + n * .2)));
}
function bazaarAct(a) {
  const M = S.me, me = ME(); M.bz = M.bz || [];
  if (a.k === 'buy') {
    let it;
    if (/^lot/.test(a.item)) { const L = bzLots().find(x => x.id === a.item); if (!L || M.bz.some(x => x.lot === L.id)) return false; it = { k: 'lot', lot: L.id, film: L.film, kind: L.kind, name: L.name, price: L.price }; }
    else { const B = BZ_BY[a.item]; if (!B) return false; if ((B.fx || B.once || B.cat === 'luxury') && B.cat !== 'courses' && M.bz.some(x => x.k === B.k && !x.sold)) return false; it = { k: B.k, name: B.name, price: B.price }; }
    const cost = usd(it.price); if (!(cost > 0) || M.cash < cost) return false;
    M.cash -= cost; const B = BZ_BY[it.k] || {};
    const own = { id: M.seq++, k: it.k, name: it.name, w: S.week, paid: cost, seed: M.seq * 7 + 3 };
    if (it.film !== undefined) Object.assign(own, { film: it.film, kind: it.kind, lot: it.lot });
    if (B.once) for (const s in B.once) { const k2 = s === '_main' ? Object.keys(CRAFTS[MAIN[me.role]].subs)[0] : s; if (k2 in me.sk || k2 in me.mind) for (let i = 0; i < 4; i++) growSub(me, k2, B.once[s] / 4); }
    if (B.energy) M.energy = clamp(M.energy + B.energy, 0, 100);
    if (B.stress) M.stress = clamp(M.stress + B.stress, 0, 100);
    if (B.standing) me.standing = clamp(me.standing + B.standing, 0, 100);
    for (let i = 0; i < (B.meet || 0); i++) { const q = bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing - 8) + hashRand(own.seed + i)() * 30 - (M.known[q.id] ? 99 : 0)); if (q && !M.known[q.id]) meet(q.id, `Met through ${it.name.toLowerCase()}`, 4); }
    if (B.cat === 'courses' || B.cat === 'books') own.used = 1;
    if (B.cat === 'books' && typeof currBook === 'function') { const n = currBook(B.k); if (n) diary(`You read ${it.name}: ${n} lesson${n > 1 ? 's' : ''} for the Craft Library.`); }
    M.bz.push(own);
    diary(`Money: bought ${it.name} for ${fmtCash(cost)}.`);
    return true;
  }
  if (a.k === 'sell') {
    const it = M.bz.find(x => x.id === a.id && !x.sold); if (!it || it.used) return false;
    const B = BZ_BY[it.k] || {}, v = it.film !== undefined || B.collect ? usd(bzValue(it)) : Math.round(it.paid * .4);
    const net = Math.round(v * (it.film !== undefined ? .88 : 1)); M.cash += net; it.sold = S.week; it.got = net;
    if (net > it.paid) (M.flags = M.flags || {}).flip = 1;
    diary(`Money: sold ${it.name} for ${fmtCash(net)}${it.film !== undefined ? ' (after the auction house\'s cut)' : ''}.`);
    return true;
  }
  return false;
}
function bazaarWeek() {
  const M = S.me, me = ME();
  for (const it of (M.bz || []).filter(x => !x.sold && !x.used)) {
    const fx = (BZ_BY[it.k] || {}).fx; if (!fx) continue;
    if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100);
    for (const k in fx.grow || {}) if (k in me.sk || k in me.mind) growSub(me, k, fx.grow[k]);
  }
}
function bazaarApp() {
  const M = S.me, tab = UI.bzt || 'gear', own = (M.bz || []).filter(x => !x.sold);
  const tabs = Object.entries(BAZAAR).map(([k, c]) => [k, c.label]).concat([['lots', '🏺 Collectibles'], ['mine', `📦 Yours (${own.length})`]]);
  let body;
  if (tab === 'lots') body = `<p class="muted small">Auction lots this month. Values move with the market and with how often a film is talked about; the auction house takes 12% when you sell.</p><div class="bzgrid">${bzLots().map(L => { const have = (M.bz || []).some(x => x.lot === L.id); return `<div class="bzc"><div class="bzi">${{ poster: '🖼️', script: '📜', prop: '🗝️', still: '🎞️' }[L.kind]}</div><b>${esc(L.name)}</b><span class="muted small">${yearOf(S.films[L.film].rel)} · <a href="#" class="lk" data-go="film:${L.film}">about the film</a></span><span class="bzp">${fmtCash(usd(L.price))}</span><button class="btn-s" data-bz="buy:${L.id}" ${have || M.cash < usd(L.price) ? 'disabled' : ''}>${have ? 'Yours' : 'Bid and win'}</button></div>`; }).join('')}</div>`;
  else if (tab === 'mine') body = own.length ? `<table class="grid small"><thead><tr><th>Item</th><th>Paid</th><th>Worth now</th><th></th></tr></thead><tbody>${own.map(it => { const B = BZ_BY[it.k] || {}, coll = it.film !== undefined || B.collect, v = coll ? usd(bzValue(it)) : null; return `<tr><td>${esc(it.name)}${it.used ? ' <span class="muted">(used)</span>' : ''}</td><td>${fmtCash(it.paid)}</td><td>${v !== null ? `<b class="${v >= it.paid ? 'up' : 'down'}">${fmtCash(v)}</b>` : '<span class="muted">–</span>'}</td><td>${it.used ? '' : `<button class="btn-s ghost" data-bz="sell:${it.id}">${coll ? 'Sell' : 'Sell second-hand'}</button>`}</td></tr>`; }).join('')}</tbody></table>` : '<p class="muted">You don\'t own anything from here yet.</p>';
  else body = `<div class="bzgrid">${Object.entries(BAZAAR[tab].items).map(([k, B]) => { const have = (M.bz || []).some(x => x.k === k && !x.sold) && tab !== 'courses'; return `<div class="bzc"><b>${esc(B.name)}</b><span class="muted small">${esc(B.d)}</span><span class="bzp">${fmtCash(usd(B.price))}</span><button class="btn-s" data-bz="buy:${k}" ${have || M.cash < usd(B.price) ? 'disabled' : ''}>${have ? 'Owned' : 'Buy'}</button></div>`; }).join('')}</div>`;
  return `<div class="bazaar"><p class="bf-row">${tabs.map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-bzt="${k}">${l}</button>`).join('')} <span class="muted small" style="margin-left:auto">Balance ${fmtCash(M.cash)}</span></p>${body}</div>`;
}
function depthClick(t) {
  const d = t.dataset;
  if (d.bzt) { UI.bzt = d.bzt; render(true); return true; }
  if (d.bz) { const [k, x] = d.bz.split(':'); doAct({ t: 'bazaar', k, item: k === 'buy' ? x : undefined, id: k === 'sell' ? +x : undefined }); render(true); return true; }
  return false;
}
APPS.push(['bazaar', '🏷️', 'Bazaar']);

// ---- achievements ----
const ACH = [
  // getting started
  ['first_job', '🎬', 'First day', 'Land your first job.', 'b', M => M.past.length + M.jobs.length >= 1],
  ['ten_jobs', '🧰', 'Journeyman', 'Finish ten jobs.', 's', M => M.past.length >= 10],
  ['fifty_jobs', '🏗️', 'Lifer', 'Finish fifty jobs.', 'g', M => M.past.length >= 50],
  ['credit', '🎞️', 'In the credits', 'Get your name on a film.', 'b', (M, me) => me.credits.length >= 1],
  ['credits10', '📽️', 'Filmography', 'Ten film credits.', 's', (M, me) => me.credits.length >= 10],
  ['credits40', '🗂️', 'Workhorse', 'Forty film credits.', 'g', (M, me) => me.credits.length >= 40],
  ['gig', '⚡', 'Gig economy', 'Do a one-week gig.', 'b', M => M.past.some(p => /^g_/.test(p.k)) || M.jobs.some(j => /^g_/.test(j.k))],
  ['abroad', '✈️', 'Have kit, will travel', 'Work in another city.', 's', M => M.past.some(p => p.away) || M.jobs.some(j => j.away)],
  ['year1', '🕯️', 'One year in', 'Survive a year in the business.', 'b', M => S.week - M.startW >= 52],
  ['year5', '🎂', 'Five years in', 'Still here after five years.', 's', M => S.week - M.startW >= 260],
  ['year20', '🏛️', 'Institution', 'Twenty years in the business.', 'p', M => S.week - M.startW >= 1040],
  // people
  ['contacts25', '📇', 'Rolodex', 'Know 25 people in the business.', 'b', M => Object.keys(M.known).length >= 25],
  ['contacts100', '🌐', 'Everyone knows you', 'Know 100 people.', 's', M => Object.keys(M.known).length >= 100],
  ['friends5', '🫂', 'Your people', 'Have five friends.', 's', () => aliveKnown().filter(id => ['friend', 'close', 'partner'].includes(relOf(id))).length >= 5],
  ['close3', '💛', 'Inner circle', 'Three close friends.', 'g', () => aliveKnown().filter(id => relOf(id) === 'close').length >= 3],
  ['partner', '💞', 'Someone to come home to', 'Fall in love.', 's', () => partnerOf() !== null],
  ['mentor', '🧙', 'Taken under a wing', 'Have a mentor.', 's', () => mentorOf() !== null],
  ['agent', '🤵', 'Represented', 'Sign with an agent.', 's', M => !!M.agent],
  ['lead', '📞', 'It\'s who you know', 'Get a job lead from a friend\'s text.', 's', M => !!(M.flags || {}).lead],
  ['intro', '👋', 'Small world', 'Get introduced to someone by text.', 'b', M => !!(M.flags || {}).t_intro],
  ['reconnect', '🕰️', 'Long time no see', 'Reconnect with someone you\'d lost touch with.', 'b', M => !!(M.flags || {}).t_reconnect],
  ['makeup', '🕊️', 'Bury the hatchet', 'Make peace with someone you were on bad terms with.', 's', M => !!(M.flags || {}).t_makeup],
  ['spam', '📵', 'Blowing up their phone', 'Text the same person five times in a week.', 'b', M => !!(M.flags || {}).spam, 1],
  ['needle', '🗡️', 'Petty', 'Needle a rival by text.', 'b', M => !!(M.flags || {}).t_needle, 1],
  ['breakup', '💔', 'By text?!', 'End a relationship by text.', 'b', M => !!(M.flags || {}).t_breakup, 1],
  ['cold', '📨', 'Shot in the dark', 'Get an answer to a cold email.', 's', M => (M.mail || []).some(m => /^Re: A note from a fan/.test(m.subj) && !/^Office of/.test(m.from))],
  // money
  ['cash10k', '💵', 'Rainy-day fund', 'Have $10,000 in the bank.', 'b', M => M.cash >= usd(10000)],
  ['cash100k', '💰', 'Comfortable', 'Have $100,000 in the bank.', 's', M => M.cash >= usd(100000)],
  ['cash1m', '🏦', 'Millionaire', 'Have $1,000,000 in the bank.', 'g', M => M.cash >= usd(1000000)],
  ['broke', '🥫', 'Instant noodles', 'Go into the red and come back.', 'b', M => M.broke === 0 && !!(M.flags || {}).wasBroke, 1],
  ['trade', '📈', 'Market participant', 'Make your first stock trade.', 'b', M => (M.trades || []).length >= 1],
  ['portfolio', '💹', 'Portfolio', 'Hold stocks worth $25,000.', 's', M => typeof mktPrice === 'function' && Object.entries(M.port || {}).reduce((s, [c, n]) => s + (S.companies[c] && S.companies[c].closed === null ? mktPrice(S.companies[c]) * n : 0), 0) >= usd(25000)],
  ['repaid', '🤝', 'Good for it', 'Pay back a friend\'s loan.', 'b', M => !!(M.flags || {}).t_repay],
  // home and things
  ['furnish', '🛋️', 'Nesting', 'Own five pieces of furniture.', 'b', M => ((M.home || {}).items || []).length >= 5],
  ['house', '🏡', 'A garden of your own', 'Live in a house.', 'g', M => M.life === 'house'],
  ['wheels', '🚘', 'Something sleek', 'Own the sleek car.', 's', M => M.vehicle === 'sleek'],
  ['collector', '🏺', 'Collector', 'Own three pieces of film history.', 's', M => (M.bz || []).filter(x => x.film !== undefined && !x.sold).length >= 3],
  ['flip', '🔨', 'Sold at auction', 'Sell something for more than you paid.', 's', M => !!(M.flags || {}).flip],
  ['bookworm', '📚', 'Bookworm', 'Read five craft books.', 'b', M => (M.bz || []).filter(x => /^b_/.test(x.k)).length >= 5],
  // craft and prizes
  ['script', '📝', 'The End', 'Finish a script.', 'b', M => (M.scripts || []).some(x => x.grade)],
  ['scripts5', '🗃️', 'Bottom drawer', 'Finish five scripts.', 's', M => (M.scripts || []).filter(x => x.grade).length >= 5],
  ['contest', '🎟️', 'Entered', 'Enter a contest.', 'b', M => (M.comps || []).length >= 1],
  ['contestwin', '🥇', 'Champion', 'Win a contest.', 's', M => (M.comps || []).some(e => e.told && e.place === 'win')],
  ['contest5', '🏅', 'Serial winner', 'Win five contests.', 'g', M => (M.comps || []).filter(e => e.told && e.place === 'win').length >= 5],
  ['trophy', '🏆', 'Hardware', 'Put a trophy on your shelf.', 's', M => (M.trophies || []).length >= 1],
  ['trophy5', '🗿', 'Mantelpiece', 'Five trophies.', 'g', M => (M.trophies || []).length >= 5],
  ['soldtrophy', '🪙', 'Everything has a price', 'Sell a trophy.', 'b', M => (M.trophies || []).some(t => t.sold), 1],
  ['standing25', '⭐', 'Somebody', 'Reach standing 25.', 's', (M, me) => me.standing >= 25],
  ['standing50', '🌟', 'A name', 'Reach standing 50.', 'g', (M, me) => me.standing >= 50],
  ['standing80', '👑', 'Legend', 'Reach standing 80.', 'p', (M, me) => me.standing >= 80],
  ['company', '🏢', 'Your name on the door', 'Start your own company.', 'g', () => typeof myCo === 'function' && !!myCo()],
  ['burnout', '🔥', 'Burnt out, came back', 'Recover from burnout.', 's', M => !!M.burnout && M.stress < 40, 1]
];
const ACH_TIER = { b: ['Bronze', '#B4793B', 1], s: ['Silver', '#9AA3AD', 2], g: ['Gold', '#D4A72C', 4], p: ['Platinum', '#7FB8C9', 8] };
function achWeek() {
  const M = S.me, me = ME(); M.ach = M.ach || {};
  if (M.broke > 0) (M.flags = M.flags || {}).wasBroke = 1;
  const got = [];
  for (const [k, ic, name, d, tier, test] of ACH) { if (M.ach[k] !== undefined) continue; let ok = false; try { ok = !!test(M, me); } catch (e) { ok = false; } if (ok) { M.ach[k] = S.week; got.push(`${ic} ${name}`); } }
  if (got.length) inbox('note', got.length > 1 ? `${got.length} achievements unlocked` : `Achievement: ${got[0]}`, got.join(' · '));
}
function achPoints() { const A = S.me.ach || {}; return ACH.reduce((s, a) => s + (A[a[0]] !== undefined ? ACH_TIER[a[4]][2] : 0), 0); }
function achHTML() {
  const A = S.me.ach || {}, n = Object.keys(A).length, tot = ACH.reduce((s, a) => s + ACH_TIER[a[4]][2], 0);
  return `<section class="panel achs"><h3>Achievements <span class="count">${n} of ${ACH.length} · ${achPoints()} of ${tot} points</span></h3><div class="achgrid">${ACH.map(([k, ic, name, d, tier, , secret]) => { const has = A[k] !== undefined, T = ACH_TIER[tier]; return `<div class="ach${has ? ' on' : ''}" style="--m:${T[1]}" title="${esc(T[0])}${has ? ' · unlocked ' + fmtDate(A[k], true) : ''}"><span class="achi">${has || !secret ? ic : '❔'}</span><b>${has || !secret ? esc(name) : 'Secret'}</b><small>${has || !secret ? esc(d) : 'Keep living.'}</small></div>`; }).join('')}</div></section>`;
}
