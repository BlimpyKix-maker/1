// ================= Apple Box — Career (phase 2) =================
// The player is one more person in S.people, living by the same rules as everyone else: the same skill
// sheet, the same ties, the same monthly growth. On top of that sheet sits a life: cash, energy, stress,
// a calendar, an inbox, jobs, and contacts with trust and favours.
//
// Everything the player does goes through doAct(), which applies it and appends it to S.log. A save is the
// seed plus that log: loading rebuilds the world and replays the log, so the world never has to be stored.
// Player-side rolls use their own seeded stream (prnd) so the replay lands in exactly the same place.

const prnd = () => S.me.rng();
const pri = (a, b) => a + Math.floor(prnd() * (b - a + 1));
const ppick = a => a[Math.floor(prnd() * a.length)];
const pgauss = () => { let u = 0, v = 0; while (!u) u = prnd(); while (!v) v = prnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const logistic = x => 1 / (1 + Math.exp(-x));
function oddsBand(p) { return p < .3 ? 'Long shot' : p < .65 ? 'Even odds' : 'Safe bet'; }
const ME = () => S.me && P(S.me.id);
const me0 = () => P(S.me.id);

// Money in the player's world: 2027 US dollars scaled by the era's prices and the hub's cost of living.
function wageF(hub) { const y = S.year; return cpi(y) / 330 * Math.max(.12, era(MARKETS[HUBS[hub].m].cost, y)); }
function usd(v2027, hub) { return Math.round(v2027 * wageF(hub || S.me.hub) / 5) * 5; }
function fmtCash(v) { return (v < 0 ? '−$' : '$') + Math.round(Math.abs(v)).toLocaleString('en-US'); }

// ---------------- Character creation ----------------
const ORIGIN = {
  wealth: {
    broke: { label: 'Broke', d: 'Every dollar is borrowed. Hungry for any job.', cash: 400, mind: { eth: 2 } },
    scraping: { label: 'Scraping by', d: 'Two jobs back home paid for the bus ticket. Nothing more.', cash: 1200, mind: { col: 1 } },
    gettingby: { label: 'Getting by', d: 'A little saved from years of other work.', cash: 2500 },
    savings: { label: 'Working-class savings', d: 'Five years of tips in a coffee tin, and a stubborn streak.', cash: 5000, mind: { eth: 1 } },
    comfortable: { label: 'Comfortable', d: 'Parents who can help in a pinch, and a house full of books and films.', cash: 9000, mind: { tas: 2 } },
    welloff: { label: 'Well-off', d: 'Private school, summers abroad, a car. People assume things.', cash: 18000, mind: { cha: 1 }, standing: -1 },
    inheritance: { label: 'A small inheritance', d: 'A grandparent left you enough for one serious try. Spend it well.', cash: 25000, mind: { com: 1 } },
    trust: { label: 'Trust fund', d: 'A monthly allowance and no rush. Insiders can tell, and some hold it against you.', cash: 40000, allowance: 250, mind: { eth: -2 }, standing: -3 },
    estranged: { label: 'Rich, but cut off', d: 'You grew up with money and walked away from it. You kept the manners and one useful family friend.', cash: 1500, mind: { cha: 1, tas: 1 }, stress: 10, friend: 1 },
    family: { label: 'Supporting family', d: 'You send money home every week. It keeps you sharp, and tired.', cash: 2000, upkeep: 90, mind: { eth: 2, com: 1 } }
  },
  edu: {
    self: { label: 'Self-taught', d: 'Learned by shooting and cutting anything you could. No debt, no degree.', craft: { cam: 1, edt: 1 }, mind: { eth: 1 } },
    filmdir: { label: 'Film school: directing', d: 'Two years of short films and a debt to show for it. Your classmates are already working.', craft: { dir: 3, wri: 1, edt: 1 }, debt: 16000, mates: ['director', 'dp'], degree: 'film' },
    filmcam: { label: 'Film school: cinematography', d: 'You lit every thesis film in your year. The camera crew all know you.', craft: { cam: 3, edt: 1 }, debt: 16000, mates: ['dp', 'director'], degree: 'film' },
    filmpost: { label: 'Film school: editing and sound', d: 'Nights in the edit suite. You can save a film in post, and you know it.', craft: { edt: 3, fx: 1 }, debt: 15000, mates: ['editor', 'sound'], degree: 'film' },
    filmprod: { label: 'Film school: producing', d: 'Budgets, schedules and a thesis film you actually got made on time.', craft: { pro: 3, wri: 1 }, debt: 15000, mates: ['producer', 'director'], degree: 'film' },
    drama: { label: 'Drama school', d: 'Voice, movement, Chekhov. A showcase that went nowhere, yet.', craft: { act: 3 }, mind: { cha: 1 }, debt: 9000, mates: ['actor', 'actor'], degree: 'drama' },
    music: { label: 'Music conservatory', d: 'Orchestration, ear training and a portfolio of student-film scores.', craft: { mus: 3 }, mind: { tas: 1 }, debt: 12000, mates: ['composer'], degree: 'music' },
    art: { label: 'Art and design school', d: 'Sets, costumes, concept art. Your sketchbooks are full of other worlds.', craft: { des: 3, cam: 1 }, debt: 12000, mates: ['designer', 'costume'], degree: 'art' },
    uni: { label: 'University: literature', d: 'A short story in a small magazine, and a roommate who writes too.', craft: { wri: 2, pro: 1 }, mind: { tas: 1 }, debt: 10000, mates: ['writer'], degree: 'ba' },
    business: { label: 'Business school', d: 'Spreadsheets, deal structures and a network of people who will be running things.', craft: { pro: 2 }, mind: { cha: 1 }, debt: 30000, mates: ['producer'], degree: 'mba' }
  },
  arrival: {
    plusone: { label: "A friend's plus-one", d: 'A friend who works on sets brought you. You know one person in the room.' },
    bar: { label: 'Working the bar', d: 'You are being paid to pour drinks. You will see everyone, and they will see the help.', cash: 200 },
    catering: { label: 'With the caterers', d: 'Carrying trays tonight. Nobody notices you, which means you hear everything.', cash: 150 },
    photographer: { label: 'The hired photographer', d: 'Everyone wants a flattering photo. A good reason to talk to anyone.', cash: 300 },
    date: { label: "Someone's date", d: 'You came with an actor you have been seeing for three weeks. They know people.' },
    neighbour: { label: 'The neighbour', d: 'You came over to complain about the noise and got handed a drink instead.' },
    band: { label: 'With the band', d: 'You play in the band hired for the night. Musicians get fed and ignored, then remembered.', cash: 250 },
    viral: { label: 'Invited after a viral video', d: 'A short you made went around the internet. Someone here wants to meet you.' },
    crash: { label: 'Crashed it', d: 'You heard the address and walked in like you belonged. Bold, and risky.' },
    family: { label: 'Invited through family', d: 'Your family knows the host. Doors are open; expectations too.' }
  },
  build: {
    striking: { label: 'Striking', d: 'People look twice. Cameras too.', looks: 15, stamina: 9 },
    elegant: { label: 'Elegant', d: 'Poised in any room; clothes hang right on you.', looks: 14, stamina: 10, mind: { cha: 1 } },
    youthful: { label: 'Youthful', d: 'You will be playing students for another decade.', looks: 13, stamina: 12 },
    athletic: { label: 'Athletic', d: 'You can run, climb and fall well. Stunt coordinators notice.', looks: 12, stamina: 14, subs: { phys: 2, stunt: 1 } },
    rugged: { label: 'Rugged', d: 'You can work a 16-hour day and still lift a sandbag.', looks: 11, stamina: 15 },
    slight: { label: 'Slight', d: 'Easy to overlook, quick on your feet, and you fit in any camera car.', looks: 11, stamina: 10, subs: { speed: 1 } },
    everyday: { label: 'Everyday', d: 'You blend in, which is useful more often than you would think.', looks: 10, stamina: 12, mind: { col: 1 } },
    imposing: { label: 'Imposing', d: 'Tall, broad, a voice that carries. People step aside.', looks: 10, stamina: 13, subs: { pres: 1.5, voice: 1 } },
    weathered: { label: 'Weathered', d: 'You look like you have lived. Casting calls it character.', looks: 9, stamina: 12, subs: { range: 1 } },
    distinctive: { label: 'Distinctive', d: 'A face nobody forgets, for better or worse. Character-actor material.', looks: 8, stamina: 11, subs: { range: 1.5, pres: 1 } }
  },
  quirk: {
    none: { label: 'None', d: 'Nothing in your past is waiting to catch up with you.' },
    parent: { label: 'Famous parent', d: 'Your parent is a name in this town. Every door opens a crack; every success is doubted.' },
    mentor: { label: 'A mentor', d: 'An old teacher of yours now works in the business, and still believes in you.' },
    ex: { label: 'An ex in the business', d: 'You dated someone who now works here. It ended badly-ish.' },
    rival: { label: 'A rival', d: 'Someone from your past wants exactly what you want, and they are already here.' },
    viral: { label: 'Internet famous', d: 'A video of yours had millions of views once. Strangers know your face; insiders roll their eyes.' },
    debt: { label: 'A debt', d: 'You owe a loan shark $6,000, and he knows where you live.' },
    sick: { label: 'A sick parent', d: 'Medical bills back home, every week, and calls you dread.' },
    record: { label: 'A criminal record', d: 'An old conviction. Studios run background checks; independents mostly don’t.' },
    secret: { label: 'A secret', d: 'Something you did before you came here. It will come out one day.' }
  },
  life: {
    couch: { label: 'Couch-surfing', d: 'Cheap, exhausting, and a little humiliating.', rent: 150, rest: -6, stress: 3 },
    shared: { label: 'Shared flat', d: 'Three roommates, one bathroom.', rent: 430, rest: 0, stress: 0 },
    own: { label: 'Own place', d: 'Quiet, private, expensive.', rent: 820, rest: 6, stress: -2 }
  }
};
const DREAM_ROLES = ['director', 'actor', 'writer', 'producer', 'dp', 'editor', 'designer', 'costume', 'composer', 'casting'];
const SKILL_POINTS = 10, SKILL_MAX = 4;
const PLAYER_TRAITS = TRAIT_KEYS.filter(t => t !== 'Prodigy');

function startCareer(c) {
  const y = S.year, hub = c.hub, seed = (S.seed * 7919 + 13 + (c.salt | 0)) >>> 0;   // the salt makes every run's party and luck different
  const love = (c.love || []).filter(g => GENRES.includes(g)).slice(0, 3), hate = (c.hate || []).filter(g => GENRES.includes(g) && !love.includes(g)).slice(0, 2);
  S.me = { rng: mulberry(seed), hub, seq: 1, startW: S.week, quirk: c.quirk, wealth: c.wealth, edu: c.edu, arrival: c.arrival, love, hate, favs: [], look: migrateLook(Object.assign({}, c.look || {})), owned: [], home: { items: [], layout: {} }, degrees: [], body: {}, cash: 0, debt: 0, debtPay: 0, shark: 0, allowance: 0, upkeep: 0, energy: 100, stress: 10, life: c.wealth === 'trust' || c.wealth === 'welloff' ? 'own' : c.wealth === 'broke' || c.wealth === 'scraping' ? 'couch' : 'shared', focus: { day: 'balanced', eve: 'quiet', auto: true }, cal: [['hunt', 'network', 'home'], ['hunt', 'write', 'home'], ['hunt', 'write', 'read'], ['hunt', 'write', 'home'], ['hunt', 'write', 'out'], ['rest', 'read', 'out'], ['rest', 'home', 'home']], phone: [], appts: [], rel: {}, train: MAIN[c.role], catchWith: null, apps: [], jobs: [], past: [], inbox: [], known: {}, board: [], refs: {}, spec: { pages: 0, drafts: 0 }, broke: 0, burnout: 0, stats: { apps: 0, offers: 0, weeks: 0, earned: 0, credits: 0 }, diary: [], party: null, over: false };
  const M = S.me, W = ORIGIN.wealth[c.wealth], E = ORIGIN.edu[c.edu], B = ORIGIN.build[c.build], A = ORIGIN.arrival[c.arrival];
  const age = clamp(c.age | 0, 18, 45);
  const traits = [];
  for (const t of c.traits || []) if (TRAITS[t] && t !== 'Prodigy' && !traits.includes(t) && !traitClash(traits, t) && traits.length < 3) traits.push(t);
  // favourite films: each one studied closely nudges the skills its genre leans on
  const favBonus = {};
  for (const fid of (c.favs || []).slice(0, 5)) {
    const cf = S.cat.allFilms && S.cat.allFilms[fid];
    if (!cf) continue;
    M.favs.push(fid);
    const W2 = Object.entries(GENRE_W[cf.g] || {}).sort((a, b) => b[1] - a[1]).slice(0, 2);
    for (const [k] of W2) favBonus[k] = (favBonus[k] || 0) + .3;
  }
  const sk = {}, pot = {};
  for (const cr in CRAFTS) for (const k in CRAFTS[cr].subs) {
    const pts = (c.points[cr] || 0) + (E.craft && E.craft[cr] || 0) + (cr === MAIN[c.role] ? 1 : 0);
    sk[k] = clamp(2.5 + prnd() * 2 + (age - 18) * .08 + pts * .75 + ((B.subs && B.subs[k]) || 0) + (favBonus[k] || 0), 1, 12);
    const head = age < 24 ? 6 + prnd() * 7 : age < 30 ? 4 + prnd() * 6 : age < 38 ? 2.5 + prnd() * 5 : 1 + prnd() * 4;
    pot[k] = clamp(sk[k] + head + (traits.includes('Late bloomer') ? 2 : 0), sk[k], 20);
  }
  const mind = {};
  for (const k in MINDS) mind[k] = clamp(8 + prnd() * 4 + ((W.mind && W.mind[k]) || 0) + ((E.mind && E.mind[k]) || 0) + ((B.mind && B.mind[k]) || 0), 1, 20);
  if (M.favs.length >= 3 && new Set(M.favs.map(f => S.cat.allFilms[f].g)).size >= 3) mind.tas = clamp(mind.tas + 1, 1, 20);
  const p = {
    id: S.people.length, name: c.name.trim().slice(0, 40) || 'You', g: ['F', 'M', 'X'].includes(c.g) ? c.g : 'X', born: y - age, hub, role: c.role, sk, pot, mind, traits,
    standing: clamp(4 + prnd() * 4 + (W.standing || 0), 0, 100), fame: 0, intl: 0, heat: 0, busy: -1, credits: [], ties: {}, lastWork: -999,
    retired: false, dead: false, awards: [], debut: S.week, player: true
  };
  recalc(p);
  S.people.push(p);
  M.id = p.id;
  M.body = { looks: B.looks, stamina: B.stamina };
  M.cash = usd(W.cash, hub) + usd(A.cash || 0, hub);
  M.allowance = W.allowance ? usd(W.allowance, hub) : 0;
  M.upkeep = (W.upkeep ? usd(W.upkeep, hub) : 0) + (c.quirk === 'sick' ? usd(110, hub) : 0);
  M.stress += (W.stress || 0) + (c.quirk === 'sick' ? 8 : 0);
  if (E.debt) { M.debt = usd(E.debt, hub); M.debtPay = Math.max(5, Math.round(M.debt / 180)); }
  if (E.degree) M.degrees.push(E.degree);
  if (c.quirk === 'debt') M.shark = usd(6000, hub);
  if (c.quirk === 'viral') { p.fame = 9; p.standing = Math.max(0, p.standing - 2); }
  for (const r of E.mates || []) { const m = youngNPC(hub, r); meet(m.id, 'Classmate', 18 + pri(0, 12)); }
  if (W.friend) { const f = bestIn(hub, ['producer', 'director'], q => q.standing + prnd() * 20 + (S.year - q.born > 45 ? 10 : 0)); if (f) { meet(f.id, 'Family friend', 22); trust(f.id, 20); } }
  if (c.quirk === 'mentor') { const m = bestIn(hub, [c.role], q => q.standing * .7 + (S.year - q.born > 40 ? 20 : -30) + prnd() * 15); if (m) { meet(m.id, 'Your mentor', 40); trust(m.id, 35); M.refs[m.id] = 1; } }
  if (c.quirk === 'ex') { const x = youngNPC(hub, ppick(['actor', 'director', 'writer', 'producer', 'dp'])); meet(x.id, 'Your ex', -6); trust(x.id, 10); }
  M.party = makeParty(c);
  diary('You arrive in ' + HUBS[hub].name + ' with ' + fmtCash(M.cash) + (M.debt ? ' and ' + fmtCash(M.debt) + ' of student debt' : '') + '.');
  milestone(`Arrived in ${HUBS[hub].name} to become a ${ROLE_LABEL[c.role].toLowerCase()}, with ${fmtCash(M.cash)} to your name`, 'start');
  // your field: what you set out to make. Outside film, you start with a first project on the go
  S.me.field = FIELDS[c.field] ? c.field : 'film';
  const first = { music: 'song', creator: 'video', podcast: 'podcast', stage: 'play' }[S.me.field];
  if (first) { S.me.make = { type: first, title: workTitle(first, 0), prog: 0, need: WORK_TYPES[first].need, w: S.week, boost: 0 }; S.me.focus.day = 'make'; }
}

// Someone at the start of their career: a pool member with no credits, or a new arrival.
function youngNPC(hub, role) {
  const pool = S.pool[hub][role].map(P).filter(q => !q.retired && !q.dead && S.year - q.born < 31 && q.credits.length < 3 && !S.me.known[q.id]);
  if (pool.length) return ppick(pool);
  const q = makePerson(hub, role, { young: true }); q.debut = S.week; return q;
}
function bestIn(hub, roles, score) {
  let best = null, bs = -1e9;
  for (const r of roles) for (const id of S.pool[hub][r]) { const q = P(id); if (q.retired || q.dead || S.me.known[id]) continue; const s = score(q); if (s > bs) { bs = s; best = q; } }
  return best;
}

// ---------------- Contacts ----------------
function meet(id, tag, opinion = 0) {
  const M = S.me, me = ME();
  if (id === M.id) return;
  if (!M.known[id]) M.known[id] = { met: S.week, trust: 30 + traitSum(me, 'trust0'), due: 0, owe: 0, tags: [] };
  if (tag && !M.known[id].tags.includes(tag)) M.known[id].tags.push(tag);
  M.known[id].seen = S.week;
  if (opinion) addTie(me, P(id), opinion);
}
function trust(id, v) { const k = S.me.known[id]; if (k) k.trust = clamp(k.trust + v, 0, 100); }
function opinion(id) { return tie(ME(), P(id)); }

// ---------------- The New Year's Eve party ----------------
// The tutorial: five scenes on the last night of the year. Who you meet and how you handle them seeds your
// first contacts, your energy on New Year's Day, and maybe a first lead.
function makeParty(c) {
  const hub = c.hub, role = c.role;
  const g = {};
  g.host = bestIn(hub, ['producer'], q => -Math.abs(q.standing - 55) + q.fame * .1 + prnd() * 10);
  g.star = bestIn(hub, ['actor'], q => q.fame + prnd() * 8);
  g.dir = bestIn(hub, ['director'], q => -Math.abs(q.standing - 62) + prnd() * 15);
  g.vet = bestIn(hub, ['dp', 'editor', 'designer', 'sound'], q => q.standing * .6 + (S.year - q.born > 45 ? 15 : 0) + prnd() * 15);
  g.writer = bestIn(hub, ['writer'], q => -Math.abs(q.standing - 45) + prnd() * 20);
  g.coord = bestIn(hub, ['casting', 'producer', 'ad'], q => -Math.abs(q.standing - 35) + prnd() * 20);
  g.reporter = bestIn(hub, ['writer'], q => -Math.abs(q.standing - 25) + prnd() * 20);
  g.peer = youngNPC(hub, role);
  for (const k in g) if (!g[k]) g[k] = makePerson(hub, { host: 'producer', star: 'actor', dir: 'director', vet: 'dp', writer: 'writer', coord: 'casting', reporter: 'writer', peer: role }[k], {});
  const ids = {};
  for (const k in g) ids[k] = g[k].id;
  if (c.quirk === 'parent') {
    const par = bestIn(hub, [role, 'director', 'producer'], q => q.standing + q.fame * .5 + (S.year - q.born > 46 ? 30 : -50) + prnd() * 10);
    if (par) { ids.parent = par.id; meet(par.id, 'Your parent', 60); trust(par.id, 40);
      const me = S.people[S.me.id] || null; if (me && typeof familyOfP === 'function') { familyOfP(me).parent = par.id; const kids = familyOfP(par).kids = familyOfP(par).kids || []; for (const sib of kids) { meet(sib, 'Your sibling', 30); (familyOfP(me).sibs = familyOfP(me).sibs || []).push(sib); } kids.push(me.id); } }
  }
  if (c.quirk === 'rival') { const r = youngNPC(hub, role); ids.rival = r.id; meet(r.id, 'Rival', -35); }
  const arr = c.arrival;
  if (arr === 'plusone') { const f = youngNPC(hub, pick2(['ad', 'dp', 'designer', 'editor'])); ids.friend = f.id; meet(f.id, 'Old friend', 35); trust(f.id, 30); }
  if (arr === 'date') { const f = youngNPC(hub, 'actor'); ids.friend = f.id; meet(f.id, 'Your date', 30); trust(f.id, 20); }
  if (arr === 'band') { const f = youngNPC(hub, 'composer'); ids.friend = f.id; meet(f.id, 'Your bandmate', 30); trust(f.id, 30); }
  if (arr === 'family') meet(ids.host, 'Family friend', 18);
  if (arr === 'bar' || arr === 'catering') meet(ids.host, 'Hired you for the night', 4);
  if (arr === 'photographer') meet(ids.host, 'Hired you for the night', 6);
  if (arr === 'viral') { meet(ids.star, 'Saw your video', 10); }
  return { step: 'arrive', ids, drinks: 0, leads: [], flags: {}, seen: [], visits: 0 };
}
function pick2(a) { return a[Math.floor(prnd() * a.length)]; }
function partyGuest(k) { return P(S.me.party.ids[k]); }
const PARTY_VISITS = 4;

// The party is a map of the evening. Each corner introduces one of the game's systems through a person you can
// connect with. sys = the one-line lesson; opts = what you can do; res(k, ok) = what happens.
const PARTY_ARRIVE = {
  plusone: n => `Your friend ${n('friend')} squeezes your arm and vanishes toward the kitchen.`,
  bar: n => `You're behind the bar in a borrowed waistcoat. ${n('host')}, the host, nods at you without seeing you.`,
  catering: n => `You're carrying a tray of tiny tacos. In the kitchen you heard ${n('host')} complaining about a budget.`,
  photographer: n => `${n('host')} hired you to shoot the party. Everyone in the room wants a good picture of themselves.`,
  date: n => `${n('friend')}, the actor you came with, is already waving at someone across the room.`,
  neighbour: n => `You came next door to complain about the music. ${n('host')} put a glass in your hand before you finished.`,
  band: n => `You're setting up with the band. ${n('friend')} tunes beside you; the first set is at ten.`,
  viral: n => `A stranger recognises you from the video before you're through the door. ${n('star')} wants to meet you.`,
  crash: n => `Nobody stopped you at the door. Yet. ${n('host')}, the host, is scanning the room.`,
  family: n => `${n('host')}, the host, greets you by name: your family's name, really.`
};
const STATIONS = {
  star: { where: 'The fireplace', sys: 'Reputation: fame (who knows you), standing (what insiders think) and heat (recent buzz) are tracked separately in every market.',
    scene: n => ({ text: `${n('star')}, the most famous face here, is holding court. There's a gap in the circle.`, opts: [
      { k: 'praise', label: 'Tell them which of their scenes you love, specifically', check: ['tas', 11] },
      { k: 'pitch', label: 'Pitch yourself for their next project', check: ['cha', 16] },
      { k: 'photo', label: 'Offer to take their photo with the host', check: ['comp', 9] }] }),
    res: (k, ok, g, n) => k === 'praise' ? (ok ? (meet(g.star, 'Met at the party', 10), `${n('star')} stops performing for a second. "Nobody ever mentions that scene." They ask your name.`) : (meet(g.star, 'Met at the party', -2), 'You praise the wrong film. It wasn’t theirs. The circle closes.'))
      : k === 'pitch' ? (ok ? (meet(g.star, 'Met at the party', 6), lead(g.star), `Against all odds, ${n('star')} laughs and tells you to send something to their manager.`) : (meet(g.star, 'Met at the party', -8), me0().standing = Math.max(0, me0().standing - 1), S.me.stress += 6, `${n('star')}'s manager steers you away. Somebody films it.`))
      : (ok ? (meet(g.star, 'Met at the party', 5), meet(g.host, 'Met at the party', 5), 'The photo is lovely. Both of them want a copy, which means both of them want your number.') : (meet(g.star, 'Met at the party', 1), 'The photo is blurry. They are gracious about it.')) },
  host: { where: "The host's study", sys: 'Money: producers find financing, control budgets and decide who gets hired. Every film has a profit-and-loss sheet, and so do you.',
    scene: n => ({ text: `${n('host')} has slipped away from the party to argue on the phone about a budget. They hang up and see you.`, opts: [
      { k: 'ask', label: 'Ask what the fight was about', check: ['cha', 10] },
      { k: 'fix', label: 'Suggest where they could save the money', check: ['bud', 12] },
      { k: 'leave', label: 'Apologise and leave them to it' }] }),
    res: (k, ok, g, n) => k === 'ask' ? (ok ? (meet(g.host, 'Met at the party', 8), `${n('host')} explains how a film gets financed: presales, a bank loan, a tax credit and a prayer. You understand about half.`) : (meet(g.host, 'Met at the party', -3), `${n('host')} is in no mood.`))
      : k === 'fix' ? (ok ? (meet(g.host, 'Met at the party', 12), lead(g.host), `${n('host')} looks at you properly. "Call my office after the holiday."`) : (meet(g.host, 'Met at the party', -5), 'Your idea would cost twice as much. They tell you so.'))
      : (meet(g.host, 'Met at the party', 1), 'You back out. They nod; at least you have manners.') },
  kitchen: { where: 'The kitchen', sys: 'Crafts: skills grow by doing, fastest under people better than you. Working near a great cinematographer teaches camera.',
    scene: n => ({ text: `${n('vet')}, a ${ROLE_LABEL[partyGuest('vet').role].toLowerCase()} with ${partyGuest('vet').credits.length} credits, is telling war stories. A small crowd is laughing.`, opts: [
      { k: 'listen', label: 'Listen, and ask good questions', check: ['col', 9] },
      { k: 'ask', label: 'Ask if they need anyone on their next job', check: ['cha', 13] },
      { k: 'story', label: 'Top their story with one of your own', check: ['cha', 15] }] }),
    res: (k, ok, g, n) => k === 'listen' ? (ok ? (meet(g.vet, 'Met at the party', 12), learnFrom(g.vet, .3), `${n('vet')} warms to you and explains how they actually got the shot. You learn more in twenty minutes than in a semester.`) : (meet(g.vet, 'Met at the party', 3), 'Your questions are the wrong kind of clever.'))
      : k === 'ask' ? (ok ? (meet(g.vet, 'Met at the party', 6), lead(g.vet), `${n('vet')} looks you over. "Maybe. Find me in the new year."`) : (meet(g.vet, 'Met at the party', -5), `${n('vet')} has heard that question a thousand times tonight.`))
      : (ok ? (meet(g.vet, 'Met at the party', 10), 'Your story kills. People who weren’t listening start listening.') : (meet(g.vet, 'Met at the party', -10), 'Your story dies in the silence.')) },
  pool: { where: 'By the pool', sys: 'Ideas: later in the game you write pitches and loglines yourself, and they are judged on originality, clarity and fit with the listener.',
    scene: n => ({ text: `${n('writer')}, a screenwriter, is sitting on a lounger with their shoes off. "Tell me an idea," they say. "Any idea. I'm out of them."`, opts: [
      { k: 'wild', label: 'Pitch something strange and original', check: ['orig', 12] },
      { k: 'safe', label: 'Pitch a crowd-pleaser with a twist', check: ['struc', 10] },
      { k: 'turn', label: 'Ask them about theirs instead', check: ['cha', 8] }] }),
    res: (k, ok, g, n) => k === 'turn' ? (ok ? (meet(g.writer, 'Met at the party', 9), `${n('writer')} talks for an hour about the script nobody will make. You'd watch it.`) : (meet(g.writer, 'Met at the party', 2), 'They wave it away. "Too depressing to explain."'))
      : (ok ? (meet(g.writer, 'Met at the party', 10), S.me.spec.pages += 10, `${n('writer')} sits up. "That's a film." You start writing it in your head on the drive home.`) : (meet(g.writer, 'Met at the party', 0), `${n('writer')} smiles politely. "Mm. It's been done."`)) },
  garden: { where: 'The garden', sys: 'Schooling and internships: some jobs ask for a degree, and studios take interns who often become staff. Your education already counts.',
    scene: n => ({ text: `${n('coord')} runs the interns at a production company and is smoking by the hedge with two of them, who are trading horror stories.`, opts: [
      { k: 'ask', label: 'Ask how their internship program works', check: ['cha', 9] },
      { k: 'creds', label: 'Mention your training and what you can do', check: ['com', 11] },
      { k: 'joke', label: 'Swap horror stories with the interns' }] }),
    res: (k, ok, g, n) => k === 'ask' ? (ok ? (meet(g.coord, 'Met at the party', 8), lead(g.coord), `${n('coord')} says they take applications in the spring. "Remind me you're the one from the party."`) : (meet(g.coord, 'Met at the party', 1), 'They give you a website. Everyone gets the website.'))
      : k === 'creds' ? (ok ? (meet(g.coord, 'Met at the party', 8), S.me.degrees.length ? `${n('coord')} perks up at your ${ORIGIN.edu[S.me.edu].label.toLowerCase()}. "We need people who already know the basics."` : `${n('coord')} likes that you taught yourself. "Scrappy is good."`) : (meet(g.coord, 'Met at the party', -2), 'You oversell it. They notice.'))
      : (meet(g.peer, 'Met at the party', 8), `One of the interns is ${n('peer')}, who wants exactly what you want. You end up laughing together.`) },
  dance: { where: 'The dance floor', sys: 'Favours: help someone and they owe you; owe someone and they will ask. Favours turn into referrals when it counts.',
    scene: n => ({ text: `${n('peer')}, who is your age and wants what you want, has spilled red wine down the host's sofa and is panicking.`, opts: [
      { k: 'help', label: 'Help them clean it up before anyone sees', check: ['eth', 9] },
      { k: 'cover', label: 'Take the blame yourself', check: ['cha', 12] },
      { k: 'leave', label: 'Pretend you saw nothing' }] }),
    res: (k, ok, g, n) => k === 'help' ? (ok ? (meet(g.peer, 'Met at the party', 12), S.me.known[g.peer].due++, 'The stain is gone. They owe you, and say so.') : (meet(g.peer, 'Met at the party', 6), 'The stain gets bigger. At least you tried together.'))
      : k === 'cover' ? (ok ? (meet(g.peer, 'Met at the party', 16), S.me.known[g.peer].due += 2, meet(g.host, null, 2), `You charm ${n('host')} into laughing it off. ${n('peer')} won't forget this.`) : (meet(g.peer, 'Met at the party', 10), S.me.known[g.peer].due++, meet(g.host, null, -6), `${n('host')} is not amused, with you.`))
      : (meet(g.peer, 'Met at the party', -2), 'You drift away. They saw you see it.') },
  hall: { where: 'The hallway', sys: 'The rumour mill: the trade press and the tabloids run on gossip. Feeding it wins friends in the press and enemies everywhere else.',
    scene: n => ({ text: `${n('reporter')}, who writes for the trades, corners you. "Seen anything interesting tonight?"`, opts: [
      { k: 'feed', label: `Tell them about ${n('star')}'s manager drama`, check: ['com', 10] },
      { k: 'charm', label: 'Charm them without giving anything away', check: ['cha', 12] },
      { k: 'no', label: '"I only just got here."' }] }),
    res: (k, ok, g, n) => k === 'feed' ? (ok ? (meet(g.reporter, 'A source', 12), 'They write it down, and you never appear in the story. You have a friend in the press now.') : (meet(g.reporter, 'A source', 8), meet(g.star, null, -10), `Your name ends up attached to the item. ${n('star')} hears about it.`))
      : k === 'charm' ? (ok ? (meet(g.reporter, 'Met at the party', 8), 'They like you more for saying nothing. Sources who talk are cheap.') : (meet(g.reporter, 'Met at the party', 1), 'They lose interest quickly.'))
      : (meet(g.reporter, 'Met at the party', 0), 'They move on to the next person.') },
  balcony: { where: 'The balcony', sys: 'The job board: films in production post jobs for whatever stage they are in. A referral from someone inside changes your odds.',
    scene: n => ({ text: `${n('dir')}, a director, is on the balcony looking at the city lights and not at their phone.`, opts: [
      { k: 'ask', label: 'Ask what they are shooting next', check: ['cha', 11] },
      { k: 'quiet', label: 'Stand beside them and say nothing for a while', check: ['tas', 10] },
      { k: 'pitch', label: 'Tell them you want to work for them', check: ['cha', 15] }] }),
    res: (k, ok, g, n) => k === 'ask' ? (ok ? (meet(g.dir, 'Met at the party', 8), `${n('dir')} tells you about the film, the budget and the actor they can't get. You now know more than the trades.`) : (meet(g.dir, 'Met at the party', -2), `${n('dir')} is tired of talking about it.`))
      : k === 'quiet' ? (ok ? (meet(g.dir, 'Met at the party', 12), `After a long while ${n('dir')} says, "Thank you." You talk about everything but film.`) : (meet(g.dir, 'Met at the party', 1), 'The silence gets awkward.'))
      : (ok ? (meet(g.dir, 'Met at the party', 6), lead(g.dir), `${n('dir')} grins. "Everybody says that. You said it well. Call the production office."`) : (meet(g.dir, 'Met at the party', -6), `${n('dir')} goes back inside.`)) }
};
function lead(id) { const pt = S.me.party; if (!pt.leads.includes(id)) pt.leads.push(id); S.me.refs[id] = (S.me.refs[id] || 0) + 1; }
function learnFrom(id, amt) { const me = me0(), cr = MAIN[P(id).role]; for (const s in CRAFTS[cr].subs) me.sk[s] = Math.min(me.pot[s], me.sk[s] + amt); recalc(me); }
// (drawn while rendering, so it must not touch the random stream)
function favTitle() { const f = S.me.favs.length ? S.cat.allFilms[S.me.favs[0]] : null; return f ? f.t : null; }
// The scene in front of the player, whatever step the party is at.
function partyScene(pt) {
  const n = k => (pt.ids[k] !== undefined ? P(pt.ids[k]).name : 'someone');
  if (pt.step === 'arrive') return { title: 'Ten o’clock, New Year’s Eve', text: `A house in the hills above ${HUBS[S.me.hub].name}, a pool nobody swims in, and every third person works in film. ${PARTY_ARRIVE[S.me.arrival](n)}`, sys: 'Every choice that depends on your character shows a d20 roll: the difficulty, your modifier and your chance. Traits, drink and stress can give advantage or disadvantage.', opts: [
    { k: 'mingle', label: 'Grab a drink and work the room', check: ['cha', 11] },
    { k: 'watch', label: 'Find a wall and watch who talks to whom', check: ['tas', 10] },
    { k: 'work', label: S.me.arrival === 'photographer' || S.me.arrival === 'bar' || S.me.arrival === 'catering' || S.me.arrival === 'band' ? 'Do your job, and do it well' : `Introduce yourself to ${n('host')}`, check: ['cha', S.me.arrival === 'family' ? 7 : S.me.arrival === 'crash' ? 14 : 11] }] };
  if (pt.step === 'rooms') return { title: `Where next? (${PARTY_VISITS - pt.visits} before midnight)`, text: 'The party spreads through the house. You have time for a few more conversations before the countdown.', rooms: Object.keys(STATIONS).filter(k => !pt.seen.includes(k)).map(k => ({ k, where: STATIONS[k].where, who: n({ star: 'star', host: 'host', kitchen: 'vet', pool: 'writer', garden: 'coord', dance: 'peer', hall: 'reporter', balcony: 'dir' }[k]) })) };
  if (pt.step in STATIONS) { const st = STATIONS[pt.step], sc = st.scene(n); return { title: st.where, text: sc.text, sys: st.sys, opts: sc.opts }; }
  if (pt.step === 'midnight') return { title: 'Midnight', text: 'The countdown. Champagne everywhere, strangers hugging, someone crying by the pool. The night could go on until dawn.', sys: 'Energy and stress: energy limits what you can do each week; stress builds from overwork, rejection and conflict, and too much of it burns you out.', opts: [
    { k: 'party', label: 'Keep going. It’s New Year’s Eve' }, { k: 'one', label: 'One glass for the toast, then water' }, { k: 'home', label: 'Slip out after the toast and get some sleep' }] };
  if (pt.step === 'late') {
    const fav = favTitle();
    return pt.flags.home ? { title: 'Half past twelve, the taxi home', text: `On the way out you pass ${n('peer')}, who is waiting for a ride too.`, sys: 'Contacts: everyone you meet is a full person living their own career. Opinion, trust and favours run both ways.', opts: [
      { k: 'share', label: 'Offer to share the taxi', check: ['cha', 8] }, { k: 'alone', label: 'Ride home alone and think about the year ahead' }] }
      : { title: 'Three in the morning', text: `The stragglers are by the pool. ${n('dir')} is arguing with ${n('peer')} about the best film ever made. They look to you to settle it.`, sys: 'Taste: what you love shapes the jobs that energise you and the ones that grind you down.', opts: [
      { k: 'settle', label: fav ? `Make the case for ${fav}` : 'Make your case for a film you love', check: ['tas', fav ? 10 : 12] },
      { k: 'joke', label: 'Make them both laugh and change the subject', check: ['cha', 12] },
      { k: 'side', label: `Back ${n('dir')}; they have more power` }] };
  }
  return null;
}

// ---------------- Checks: a d20 plus your modifier against a difficulty ----------------
// Stats run 1-20 like Football Manager; the modifier is D&D's: (stat - 10) / 2, rounded down. A natural 20 always
// succeeds and a natural 1 always fails. Traits, drink, stress and exhaustion give advantage (roll twice, keep the
// better) or disadvantage (keep the worse). Content writes difficulty on the stat scale; the roll needs one more.
function statVal(stat) { const me = ME(); return stat in me.mind ? me.mind[stat] : stat in me.sk ? me.sk[stat] : me.c[stat] ?? 10; }
function checkMods(stat) {
  const me = ME(), M = S.me, why = [];
  const v = statVal(stat), mod = Math.floor((v - 10) / 2);
  let adv = 0;
  for (const t of me.traits) { const T = TRAITS[t]; if (T.adv && T.adv.includes(stat)) { adv++; why.push(t); } if (T.dis && T.dis.includes(stat)) { adv--; why.push(t + ' (against)'); } }
  if (M.party && !M.party.done && M.party.drinks >= 3) { adv--; why.push('drunk'); }
  if (M.party && M.party.done) for (const c of conditionsOf()) { if (c.adv && (c.adv === 'all' || c.adv.includes(stat))) { adv++; why.push(c.label); } if (c.dis && (c.dis === 'all' || c.dis.includes(stat))) { adv--; why.push(c.label); } }
  let bonus = 0;
  for (const id of worn()) { const W = WARDROBE[id], nm = LOOK[W.slot].opts[W.opt];
    if (W.adv && W.adv.includes(stat)) { adv++; why.push(nm); }
    if (W.dis && W.dis.includes(stat)) { adv--; why.push(nm + ' (against)'); }
    if (W.bonus && W.bonus[stat]) { bonus += W.bonus[stat]; why.push(`${nm} ${W.bonus[stat] > 0 ? '+' : ''}${W.bonus[stat]}`); } }
  return { v, mod: mod + bonus, adv: Math.sign(adv), why };
}
// Wardrobe pieces the player owns and has on.
function worn() { const M = S.me; if (!M || !M.owned) return []; return M.owned.filter(id => M.look[WARDROBE[id].slot] === WARDROBE[id].opt); }
function checkInfo(stat, dc) {
  const { mod, adv, why } = checkMods(stat), DC = dc + 1;
  let p = clamp((21 - (DC - mod)) / 20, .05, .95);
  if (has(ME(), 'Lucky')) p = p + (1 - p) * .05 * p;   // a natural 1 is rerolled once
  const pa = adv > 0 ? 1 - (1 - p) * (1 - p) : adv < 0 ? p * p : p;
  return { p: pa, mod, adv, DC, why };
}
function checkP(stat, dc) { return checkInfo(stat, dc).p; }
const d20 = () => 1 + Math.floor(prnd() * 20);
function roll(stat, dc) {
  const { mod, adv, DC } = checkInfo(stat, dc);
  const one = () => { let d = d20(); if (d === 1 && has(ME(), 'Lucky')) d = d20();
    if (d === 1 && worn().includes('pendant') && S.me.pendantW !== S.week) { S.me.pendantW = S.week; d = d20(); }   // once a week
    return d; };
  let d = one(), dice = [d];
  if (adv) { const e = one(); dice.push(e); d = adv > 0 ? Math.max(d, e) : Math.min(d, e); }
  const ok = d === 20 || (d !== 1 && d + mod >= DC);
  S.me.rollN = (S.me.rollN || 0) + 1;
  S.me.lastRoll = { stat, d, dice, mod, DC, adv, ok, crit: d === 20 ? 1 : d === 1 ? -1 : 0, n: S.me.rollN, why: checkInfo(stat, DC - 1).why };
  return ok;
}
function rollText(r) { if (!r) return ''; return `d20 ${r.d}${r.mod ? (r.mod > 0 ? ' + ' : ' − ') + Math.abs(r.mod) : ''} = ${r.d + r.mod} vs DC ${r.DC}${r.adv > 0 ? ' (advantage)' : r.adv < 0 ? ' (disadvantage)' : ''}${r.crit > 0 ? ' · natural 20' : r.crit < 0 ? ' · natural 1' : ''}`; }
function checkLabel(stat, dc) { const c = checkInfo(stat, dc); return `DC ${c.DC} · ${statLabel(stat)} ${c.mod >= 0 ? '+' : '−'}${Math.abs(c.mod)}${c.adv > 0 ? ' · advantage' : c.adv < 0 ? ' · disadvantage' : ''} · ${Math.round(c.p * 100)}%`; }

function partyPick(k) {
  const pt = S.me.party, M = S.me, g = pt.ids, n = x => (g[x] !== undefined ? P(g[x]).name : 'someone');
  if (pt.step === 'rooms') {
    if (!STATIONS[k] || pt.seen.includes(k)) return false;
    pt.seen.push(k); pt.step = k; return true;
  }
  const scene = partyScene(pt), opt = scene && scene.opts.find(o => o.k === k);
  if (!opt) return false;
  const ok = opt.check ? roll(opt.check[0], opt.check[1]) : true;
  let t = '';
  if (pt.step === 'arrive') {
    pt.drinks += k === 'mingle' ? 1 : 0;
    if (k === 'mingle') t = ok ? (meet(g.host, 'Met at the party', 6), meet(g.dir, 'Met at the party', 4), `You float from group to group. ${n('host')} and ${n('dir')} both remember your name.`) : (meet(g.dir, 'Met at the party', -3), `You cut into a conversation at the wrong moment. ${n('dir')} turns away.`);
    else if (k === 'watch') t = ok ? (learnTaste(), `Within an hour you know who's rising, who's sinking and who's sleeping with whom. Knowledge is power here.`) : 'You mostly watch people refill their drinks.';
    else if (ok) { meet(g.host, 'Met at the party', 10); M.cash += ['photographer', 'bar', 'catering', 'band'].includes(M.arrival) ? usd(60) : 0; t = ['photographer', 'bar', 'catering', 'band'].includes(M.arrival) ? `You're good at this, and ${n('host')} notices. A tip, and a nod that means more.` : `${n('host')} likes you. "Make yourself at home."`; }
    else if (M.arrival === 'crash') { meet(g.host, 'Met at the party', -6); pt.flags.thrown = 1; t = `${n('host')} asks who invited you. Security walks you to the garden, where the party turns out to be better anyway.`; }
    else { meet(g.host, 'Met at the party', -2); t = `${n('host')} is polite and busy. You lose them to someone more important.`; }
    pt.step = 'rooms';
    if (pt.flags.thrown) { pt.seen.push('host', 'star', 'kitchen', 'hall'); }
  } else if (pt.step in STATIONS) {
    t = STATIONS[pt.step].res(k, ok, g, n);
    pt.visits++;
    pt.step = pt.visits >= PARTY_VISITS || Object.keys(STATIONS).every(s => pt.seen.includes(s)) ? 'midnight' : 'rooms';
  } else if (pt.step === 'midnight') {
    if (k === 'party') { pt.drinks += 3; for (const x of ['host', 'peer', 'dir']) if (M.known[g[x]]) addTie(me0(), P(g[x]), 5); t = 'You dance, you hug strangers, you tell someone your dreams by the pool. It is a wonderful night.'; }
    else if (k === 'one') { pt.drinks++; t = 'One glass, then water. You keep your head.'; }
    else { pt.flags.home = 1; t = 'You leave as the fireworks start, and you are asleep by one.'; }
    pt.step = 'late';
  } else if (pt.step === 'late') {
    if (pt.flags.home) t = k === 'share' ? (ok ? (meet(g.peer, 'Shared a taxi home', 12), `${n('peer')} talks the whole way home. You trade numbers and plans.`) : (meet(g.peer, 'Met at the party', 2), 'An awkward ride.')) : 'You ride home alone and make a list of everyone you want to work with.';
    else if (k === 'settle') t = ok ? (meet(g.dir, 'Met at the party', 10), meet(g.peer, 'Met at the party', 4), lead(g.dir), `${n('dir')} goes quiet, then grins. "Good answer. What do you do?"`) : (meet(g.dir, 'Met at the party', -4), meet(g.peer, 'Met at the party', 6), `${n('dir')} thinks your pick is sentimental and says so. ${n('peer')} sticks up for you.`);
    else if (k === 'joke') t = ok ? (meet(g.dir, 'Met at the party', 6), meet(g.peer, 'Met at the party', 8), 'Both of them are laughing. The argument is forgotten; you are not.') : (meet(g.peer, 'Met at the party', 2), 'The joke lands badly.');
    else { meet(g.dir, 'Met at the party', 5); meet(g.peer, 'Met at the party', -8); t = `${n('dir')} approves. ${n('peer')} remembers.`; }
    pt.step = 'done';
  }
  if (opt.check && S.me.lastRoll.crit > 0) { me0().standing += .5; t += ' A moment people will retell.'; }
  pt.log = (pt.log || []).concat([{ title: scene.title, choice: opt.label, ok: opt.check ? ok : null, roll: opt.check ? S.me.lastRoll : null, t }]);
  if (pt.step === 'done') endParty();
  return true;
}
function learnTaste() { const me = me0(); me.mind.tas = clamp(me.mind.tas + .5, 1, 20); }
function endParty() {
  const M = S.me, pt = M.party;
  M.energy = clamp(100 - pt.drinks * 14, 25, 100);
  if (pt.drinks >= 4) {   // you don't remember everyone
    const lost = Object.keys(M.known).filter(id => M.known[id].tags.includes('Met at the party') && !pt.leads.includes(+id));
    if (lost.length) { const id = ppick(lost); delete M.known[id]; pt.forgot = +id; }
  }
  pt.done = true;
  inbox('note', 'New Year’s Day', `You wake up ${pt.drinks >= 4 ? 'at noon with a pounding head' : pt.drinks >= 2 ? 'a little slow' : 'clear-headed'}. ${Object.keys(M.known).length} names in your phone${pt.forgot != null ? ', and one you can’t place at all' : ''}. ${pt.leads.length ? `${pt.leads.length === 1 ? 'One person' : pt.leads.length + ' people'} said to get in touch: worth following up while they remember you.` : 'Nobody promised you anything. That is normal.'} Plan your first week below.`);
  refreshBoard();
}

// ---------------- Inbox ----------------
function inbox(kind, title, text, extra = {}) {
  const it = { id: S.me.seq++, w: S.week, kind, title, text, ...extra };
  S.me.inbox.push(it);
  if (kind === 'scene' && extra.scene) { const M = S.me; (M.seenSc = M.seenSc || {})[extra.scene] = S.week; (M.seenN = M.seenN || {})[extra.scene] = (M.seenN[extra.scene] || 0) + 1; }
  if (S.me.inbox.length > 140) S.me.inbox = S.me.inbox.filter(x => x.choices && !x.done).concat(S.me.inbox.filter(x => !(x.choices && !x.done)).slice(-110));
  return it;
}
// A scene you've had waits at least half a year before it can come back, and longer each time after that.
function sceneFresh(id, base = 26) { const M = S.me, w = (M.seenSc || {})[id]; return w === undefined || S.week - w >= base * Math.min(4, (M.seenN || {})[id] || 1); }
function pending() { return S.me ? S.me.inbox.filter(x => x.choices && !x.done) : []; }
function diary(t) { S.me.diary.push({ w: S.week, t }); if (S.me.diary.length > 400) S.me.diary.shift(); }

// ---------------- Jobs ----------------
// Tier 1 and 2 jobs, each tied to an entry in the researched job catalogue. head = the film slot whose
// person runs the department you work in (you learn from them and they decide whether you're asked back).
const POSTS = [
  { k: 'setpa', jid: 'c_additional_c_set_production_assistant', t: 'Set Production Assistant', tier: 1, st: [2], head: 'ad', subs: ['setm', 'talent', 'speed'], days: 5, rate: 200, cr: 1 },
  { k: 'officepa', jid: 'c_additional_c_office_production_assista', t: 'Office Production Assistant', tier: 1, st: [1], head: 'prod', subs: ['fin', 'bud', 'pack'], days: 5, rate: 180, cr: 1 },
  { k: 'extra', jid: 'c_cast_background_actor_extra', t: 'Background Actor (Extra)', tier: 1, st: [2], head: 'cst', subs: ['pres', 'phys'], days: 2, rate: 190, weeks: 1, actor: 1 },
  { k: 'standin', jid: 'c_cast_stand_in', t: 'Stand-In', tier: 1, st: [2], head: 'dp', subs: ['pres', 'phys', 'light'], days: 5, rate: 220, actor: 1 },
  { k: 'reader', jid: 'c_produced_by_story_analyst_reader', t: 'Story Analyst (Reader)', tier: 1, st: [0], head: 'prod', subs: ['struc', 'char', 'orig'], days: 2, rate: 130, weeks: 3 },
  { k: 'asstprod', jid: 'c_additional_c_assistant_to_producer_sho', t: 'Assistant to Producer', tier: 1, st: [0, 1], head: 'prod', subs: ['pack', 'talent', 'fin'], days: 5, rate: 190 },
  { k: 'campa', jid: 'c_camera_and_e_camera_production_assista', t: 'Camera Production Assistant', tier: 1, st: [2], head: 'dp', subs: ['move', 'speed', 'light'], days: 5, rate: 210, cr: 1 },
  { k: 'artpa', jid: 'c_art_departme_art_department_production', t: 'Art Department PA', tier: 1, st: [1, 2], head: 'pd', subs: ['sets', 'period', 'world'], days: 5, rate: 190, cr: 1 },
  { k: 'costpa', jid: 'c_costume_and_costume_production_assista', t: 'Costume Production Assistant', tier: 1, st: [1, 2], head: 'cos', subs: ['wardrobe', 'period'], days: 5, rate: 190, cr: 1 },
  { k: 'locpa', jid: 'c_location_man_locations_production_assi', t: 'Locations Production Assistant', tier: 1, st: [1, 2], head: 'prod', subs: ['bud', 'setm'], days: 5, rate: 210, cr: 1 },
  { k: 'postpa', jid: 'c_editorial_de_post_production_assistant', t: 'Post-Production Assistant', tier: 1, st: [3], head: 'ed', subs: ['cont', 'rhythm', 'sound'], days: 5, rate: 180, cr: 1 },
  { k: 'logger', jid: 'c_editorial_de_logger_transcriber', t: 'Logger / Transcriber', tier: 1, st: [3], head: 'ed', subs: ['cont', 'shape'], days: 3, rate: 160 },
  { k: 'castasst', jid: 'c_casting_depa_casting_assistant', t: 'Casting Assistant', tier: 1, st: [1], head: 'cst', subs: ['eye', 'talent'], days: 5, rate: 190, cr: 1 },
  { k: 'crafty', jid: 'c_craft_servic_craft_service_assistant', t: 'Craft Service Assistant', tier: 1, st: [2], head: 'prod', subs: ['talent'], days: 5, rate: 170 },
  { k: 'utilsnd', jid: 'c_sound_depart_utility_sound_technician_', t: 'Utility Sound Technician', tier: 1, st: [2], head: 'snd', subs: ['sdes', 'sound'], days: 5, rate: 260, req: 5, cr: 1 },
  { k: 'dayplayer', jid: 'c_cast_day_player_under_five', t: 'Day Player (a few lines)', tier: 2, st: [2], head: 'dir', subs: ['pres', 'range', 'comic'], days: 2, rate: 1100, weeks: 1, req: 7, cr: 1, actor: 1 },
  { k: 'ac2', jid: 'c_camera_and_e_second_assistant_camera_2', t: 'Second Assistant Camera', tier: 2, st: [2], head: 'dp', subs: ['move', 'speed', 'comp'], days: 5, rate: 550, req: 8, cr: 1 },
  { k: 'grip', jid: 'c_camera_and_e_grip', t: 'Grip', tier: 2, st: [2], head: 'dp', subs: ['light', 'move'], days: 5, rate: 500, req: 6, cr: 1 },
  { k: 'ae2', jid: 'c_editorial_de_second_assistant_editor', t: 'Second Assistant Editor', tier: 2, st: [3], head: 'ed', subs: ['cont', 'rhythm', 'shape'], days: 5, rate: 350, req: 7, cr: 1 },
  { k: 'ae1', jid: 'c_editorial_de_first_assistant_editor', t: 'First Assistant Editor', tier: 2, st: [3], head: 'ed', subs: ['shape', 'rhythm', 'sound'], days: 5, rate: 550, req: 10, cr: 1 },
  { k: 'ad22', jid: 'c_second_unit_second_second_assistant_di', t: 'Second Second Assistant Director', tier: 2, st: [2], head: 'ad', subs: ['setm', 'pace', 'talent'], days: 5, rate: 450, req: 8, cr: 1 },
  { k: 'dresser', jid: 'c_art_departme_set_dresser', t: 'Set Dresser', tier: 2, st: [1, 2], head: 'pd', subs: ['sets', 'period', 'world'], days: 5, rate: 450, req: 8, cr: 1 },
  { k: 'boom', jid: 'c_sound_depart_boom_operator', t: 'Boom Operator', tier: 2, st: [2], head: 'snd', subs: ['sdes', 'sound'], days: 5, rate: 500, req: 8, cr: 1 },
  { k: 'makeup', jid: 'c_makeup_depar_additional_makeup_artist_', t: 'Additional Makeup Artist', tier: 2, st: [2], head: 'mu', subs: ['mkup', 'wardrobe'], days: 3, rate: 400, req: 8, cr: 1 },
  { k: 'stunt', jid: 'c_stunts_stunt_performer', t: 'Stunt Performer', tier: 2, st: [2], head: 'stn', subs: ['stunt', 'phys'], days: 3, rate: 1000, req: 9, cr: 1 },
  { k: 'devasst', jid: 'c_produced_by_associate_producer', t: 'Development Assistant', tier: 2, st: [0], head: 'prod', subs: ['struc', 'pack', 'orig'], days: 5, rate: 300, req: 8 }
];
const POST_BY = Object.fromEntries(POSTS.map(p => [p.k, p]));
// Work outside the film business that keeps the lights on and puts you near it.
const ODD_JOBS = [
  { k: 'usher', jid: 'i_assistant_usher', t: 'Cinema usher', tier: 1, subs: ['tas'], days: 3, rate: 140, weeks: 8, d: 'Watch the same films forty times. Taste sharpens.' },
  { k: 'runner', jid: 'i_assistant_production_runner_live_event', t: 'Production runner (live events)', tier: 1, subs: ['setm', 'speed'], days: 2, rate: 150, weeks: 1, d: 'Concerts and award shows: run cables, run errands, run.' },
  { k: 'rental', jid: 'c_studio_facil_rental_house_technician_c', t: 'Rental house technician', tier: 1, subs: ['light', 'move'], days: 4, rate: 190, weeks: 10, d: 'Check out cameras and lights to every crew in town, and meet them all.' },
  { k: 'screener', jid: 'i_film_festi_festival_screener_intern', t: 'Festival screener (intern)', tier: 1, subs: ['tas', 'struc'], days: 2, rate: 0, weeks: 6, d: 'Unpaid. Watch submissions and write short reports for the programmers.' }
];
const ODD_BY = Object.fromEntries(ODD_JOBS.map(p => [p.k, p]));
function headOf(f, key) {
  if (key === 'dir') return f.dir;
  if (key === 'prod') return f.prod;
  if (key === 'dp') return f.dp;
  if (key === 'ed') return f.ed;
  if (key === 'wri') return f.wri[0];
  if (f.crew && f.crew[key] !== undefined) return f.crew[key];
  if (key === 'ad' || key === 'cst') return key === 'ad' ? f.dir : f.prod;
  return null;
}
function postReq(t) { return t.req || 0; }
function subScore(t) { const me = ME(); return avg(t.subs.map(s => s in me.sk ? me.sk[s] : me.mind[s] ?? 8)); }

// Work elsewhere: a few postings from other cities in your language, and a couple from abroad. Taking one means moving.
function awayBoard() {
  const M = S.me, lang = HUBS[M.hub].lang, out = [];
  const near = S.active.map(i => S.films[i]).filter(f => f.hub !== M.hub && HUBS[f.hub].lang === lang && f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 2);
  const far = S.active.map(i => S.films[i]).filter(f => HUBS[f.hub].lang !== lang && f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 2 && f.tier <= 2);
  for (const [L, n] of [[near, 5], [far, 4]]) for (let k = 0; k < n && L.length; k++) {
    const f = L.splice(Math.floor(prnd() * L.length), 1)[0], opts = POSTS.filter(t => !t.cat && t.st.includes(f.stage) && headOf(f, t.head) !== null);
    if (!opts.length) continue;
    const p = makePost(ppick(opts), f); p.away = f.hub; p.rate = Math.round(p.rate * (HUBS[f.hub].lang === lang ? 1 : 1.15)); out.push(p);
  }
  return out;
}
// The board: what you hear about this week. Films in your hub post jobs for the stage they are in.
function refreshBoard() {
  const M = S.me, hub = M.hub, out = [];
  const films = S.active.map(i => S.films[i]).filter(f => f.hub === hub && f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 1);
  const busy = new Set(M.jobs.map(j => j.film + ':' + j.k));
  for (const f of films) {
    const opts = POSTS.filter(t => !t.cat && t.st.includes(f.stage) && headOf(f, t.head) !== null && !busy.has(f.id + ':' + t.k));
    const n = Math.min(opts.length, prnd() < .5 ? 1 : prnd() < .6 ? 2 : 0);
    const chosen = new Set();
    // a contact in charge of a department makes their own job easier to hear about
    for (const t of opts) { const h = headOf(f, t.head); if (M.known[h] && opinion(h) > 25 && M.known[h].trust >= 45 && prnd() < .4) chosen.add(t); }
    const want = Math.min(opts.length, chosen.size + n);
    while (chosen.size < want) chosen.add(ppick(opts));
    for (const t of chosen) out.push(makePost(t, f));
  }
  // referrals first, then a mix: no more than two postings for the same job
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(prnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  out.sort((a, b) => (b.ref ? 1 : 0) - (a.ref ? 1 : 0));
  // how much you hear about depends on who you are: a newcomer hears of a handful; a network, a reputation and an agent widen it
  const heard = 3 + careerLevel() * 2 + Math.floor(Object.keys(M.known).length / 8) + (M.agent ? 2 : 0) + (M.school ? 1 : 0);
  const per = {}, film = out.filter(p => (per[p.k] = (per[p.k] || 0) + 1) <= 2).slice(0, Math.round(Math.min(30, heard + 8) * (typeof worldFx === 'function' ? worldFx().jobs : 1)));
  const m = dateOf(S.week).getUTCMonth();
  const odd = ODD_JOBS.filter(t => !t.cat && (t.k !== 'screener' || (m >= 7 && m <= 10)) && !M.jobs.some(j => j.k === t.k)).filter(() => prnd() < .7).map(t => makePost(t, null));
  M.board = agentBoard(films).concat(film, depthBoard(films), awayBoard(), odd);
  if (typeof worldFx === 'function' && worldFx().halt) M.board = M.board.filter(p => p.film === null || p.film === undefined);   // nobody hires during a strike
}
function makePost(t, f) {
  const head = f ? headOf(f, t.head) : null;
  const weeks = t.weeks || (f ? Math.max(1, Math.min(14, f.stageEnd - S.week + (t.st.length > 1 && f.stage === t.st[0] ? f.dur[f.stage + 1] : 0))) : 4);
  const hubComp = clamp(hubProd(S.me.hub, S.year) / 40, .3, 1.4);
  const comp = !f ? (t.cat ? .3 + t.tier * .3 : .1) : (t.tier >= 2 ? .8 : .6) * hubComp + (f.tier === 1 ? .6 : f.tier === 3 ? -.2 : 0);
  return { id: S.me.seq++, k: t.k, odd: !f, t: t.t, jid: t.jid, tier: t.tier, film: f ? f.id : null, head, days: t.days, weeks, rate: usd(t.rate), comp, ref: head !== null && (S.me.refs[head] || 0) > 0, w: S.week };
}
function tmplOf(post) { return post.odd ? ODD_BY[post.k] : POST_BY[post.k]; }

// How likely an application is to land, and why: a list of named factors in logit units.
function hireFactors(post) {
  const M = S.me, me = ME(), t = tmplOf(post), F = [];
  const lvl = careerLevel();
  F.push(['Job level', post.odd && !t.cat && post.tier <= 1 ? 1 : post.tier === 0 ? .8 : post.tier === 1 ? .25 : -1.2 - 1.1 * (post.tier - 2) + .9 * lvl]);
  if (post.tier === 0 && M.school) F.push(['You\'re a student', .7]);
  if (post.agent && M.agent) F.push(['Your agent pitched you', .5 + .25 * M.agent.tier]);
  if (M.freeRef) F.push(['A word from your old teacher', .8]);
  const sc = subScore(t), req = postReq(t);
  F.push(['Your skills for it', post.tier <= 1 ? clamp((sc - Math.max(req, 6)) * .15, -1.5, .8) : clamp((sc - Math.max(req, 8)) * .3, -2.5, 1.4)]);
  if (t.actor) F.push(['Looks and presence', (M.body.looks - 10) * .06 + (me.sk.pres - 10) * .05]);
  F.push(['Track record', Math.min(1.1, me.credits.length * .18 + M.stats.weeks * .01)]);
  F.push(['Standing', (me.standing - 10) * .035]);
  if (post.head !== null) {
    const o = opinion(post.head), k = M.known[post.head];
    if (k || o) F.push([`${P(post.head).name} knows you`, clamp(o / 22, -2, 1.8) + (k ? (k.trust - 30) / 80 : 0)]);
    if (post.ref) F.push(['Someone put in a word', 1.1]);
  }
  if (M.quirk === 'parent' && post.film !== null) F.push(['Your family name', .45]);
  if (M.wealth === 'trust') F.push(['Seen as a dabbler', -.25]);
  if (M.quirk === 'record' && post.film !== null && S.films[post.film].tier === 1) F.push(['Studio background check', -.8]);
  if (M.quirk === 'viral') F.push(['Internet fame', t.actor ? .4 : -.15]);
  if (M.degrees.length && post.tier >= 2) F.push(['Your degree', M.degrees.includes('mfa') ? .4 : .25]);
  F.push(['Competition', -post.comp]);
  F.push(['First impressions', (me.mind.cha - 10) * .05]);
  if (typeof fieldFactors === 'function') F.push(...fieldFactors(post));
  if (typeof almaFactors === 'function') F.push(...almaFactors(post));
  if (typeof starFactors === 'function') F.push(...starFactors(post));
  if (typeof codexFactors === 'function') F.push(...codexFactors(post));
  if (typeof repFactors === 'function') F.push(...repFactors(post));
  if (typeof circleFactors === 'function') F.push(...circleFactors(post));
  { const par = (S.me.known && Object.keys(S.me.known).map(Number).find(id => S.me.known[id].tags.includes('Your parent'))); if (par !== undefined && post.head !== null && post.head !== undefined && (post.head === par || tie(P(par), P(post.head)) > 30)) F.push(['Family connection', .6]); }
  return F;
}
function hireOdds(post) { return clamp(logistic(hireFactors(post).reduce((s, f) => s + f[1], 0)), .02, .96); }

// ---------------- The week ----------------
const ACTIVITIES = {
  work: { label: 'Work', e: 13, d: 'Days on the job.' },
  hunt: { label: 'Look for work', e: 7, d: 'Each day lets you send up to three applications from the board.' },
  network: { label: 'Industry mixer', e: 11, cost: 40, d: 'Meet new people in the business. Charisma decides how it goes.' },
  catchup: { label: 'Catch up with a contact', e: 7, cost: 30, d: 'Coffee or a drink with someone you know. Warms the tie; they may mention work.' },
  write: { label: 'Write', e: 9, d: 'Work on a spec script. Slow, and it grows your writing.' },
  train: { label: 'Take a class', e: 9, cost: 70, d: 'Classes and practice in one craft. Slower than work, always available.' },
  hustle: { label: 'Side hustle', e: 13, d: 'Bar shifts and deliveries. Pays the rent; teaches nothing.' },
  rest: { label: 'Rest', e: -20, d: 'Sleep, see friends outside the business. Restores energy, lowers stress.' },
  study: { label: 'Study', e: 9, d: 'Classes for the course you\'re enrolled in. Miss too many and they\'ll drop you.' }
};
const SLOT_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function jobDays() { return S.me.jobs.reduce((s, j) => s + j.days, 0); }
// The plan as it will actually run: job days fill the weekdays first.
// effectivePlan and appSlots live in life.js (the diary of blocks).


function growSub(me, k, amt) {
  if (k in me.mind) { me.mind[k] = clamp(me.mind[k] + amt * .4, 1, 20); return amt * .4; }
  const room = me.pot[k] - me.sk[k];
  if (room <= 0) return 0;
  const g = amt * clamp(room / 5, .1, 1);
  me.sk[k] += g;
  return g;
}
function learnRate(me) {
  const a = S.year - me.born;
  return (a < 25 ? 1.25 : a < 32 ? 1.05 : a < 42 ? .85 : .6) * traitMul(me, 'grow') * (.6 + me.mind.eth / 25);
}

// The week is lived in src/life.js (days, beats and sleep); closeWeek settles it.
function closeWeek(a) {
  const M = S.me, me = ME(), W = M.wk, burnt = W.burnt, L = W.L, gains = W.gains, hunted = W.hunted;
  let energy = M.energy, cashIn = W.cashIn, cashOut = W.cashOut, stress = W.stress;
  const gain = (k, v) => { const g = growSub(me, k, v * learnRate(me)); if (g) gains[k] = (gains[k] || 0) + g; };
  M.wk = null; M.closing = true;
  if (M.spec.pages >= 110) { M.spec.pages -= 110; M.spec.drafts++; L.push(`You finish draft ${M.spec.drafts} of a spec script. It goes in the drawer for when someone asks to read something.`); }
  // jobs
  const halted = worldFx().halt;
  if (halted && M.jobs.some(j => j.film !== null)) L.push('The strike holds. Your production is shut down, and nobody is paid until it ends.');
  for (const j of M.jobs.slice()) {
    if (burnt || (halted && j.film !== null)) continue;
    const t = tmplOf(j);
    const days = j.days;
    const pay = j.rate * days;
    cashIn += pay; M.stats.earned += pay;
    if (M.agent) cashOut += Math.round(pay * M.agent.cut);
    M.stats.weeks++;
    j.done++;
    me.lastWork = S.week;
    const head = j.head !== null ? P(j.head) : null;
    const teach = head ? clamp(1 + (avg(t.subs.map(s => head.sk[s] ?? head.mind[s] ?? 10)) - subScore(t)) / 14, .7, 1.7) : 1;
    const fg = j.film !== null ? S.films[j.film].genre : null, loved = fg && S.me.love.includes(fg), hated = fg && S.me.hate.includes(fg);
    if (loved) stress -= 2; if (hated) stress += 3;
    for (const s of t.subs) gain(s, .04 * days / 5 * teach * (j.shadow ? 1.8 : 1) * (loved ? 1.15 : hated ? .9 : 1));
    j.shadow = 0;
    if (head) { meet(head.id, null); addTie(me, head, 1.5 + (me.mind.col - 10) * .15 + traitSum(me, 'tie') * .2); }
    for (const id of j.mates || []) addTie(me, P(id), .8);
    if (j.odd && j.k === 'rental' && prnd() < .35) { const crew = bestIn(M.hub, ['dp', 'sound', 'designer'], q => q.standing * .3 + prnd() * 30); if (crew) { meet(crew.id, 'Met at the rental house', 6); L.push(`At the rental house you get talking to ${crew.name}, a ${ROLE_LABEL[crew.role].toLowerCase()}.`); } }
    if (j.done >= j.weeks || (j.film !== null && jobOver(j))) finishJob(j, L);
  }
  // applications
  const apps = (a.apps || []).slice(0, hunted * 3);
  const offers = [], noes = [], shortlisted = [], auto = [];
  for (const pid of apps) {
    const post = M.board.find(p => p.id === pid);
    if (!post) continue;
    const why = blockedFrom(tmplOf(post));
    if (why) { M.stats.apps++; auto.push(`${post.t}: ${why.toLowerCase()}`); continue; }
    M.stats.apps++;
    if (post.odd && !tmplOf(post).cat) { if (prnd() < hireOdds(post)) offers.push(post); else noes.push(post); }
    else if (prnd() < shortlistOdds(post)) { post.appt = bookInterview(post); shortlisted.push(post); }
    else noes.push(post);
    if (M.freeRef) M.freeRef--;
    if (post.head !== null && M.refs[post.head]) M.refs[post.head] = Math.max(0, M.refs[post.head] - 1);
  }
  if (auto.length) inbox('note', auto.length === 1 ? 'Automatic rejection' : `${auto.length} automatic rejections`, `The system filtered you out before anyone read your application. ${auto.join('; ')}.`);
  if (shortlisted.length) inbox('note', shortlisted.length === 1 ? 'Shortlisted' : `Shortlisted for ${shortlisted.length} jobs`, `${shortlisted.map(p => `${p.t}${p.film !== null ? ' on ' + S.films[p.film].title : ''} (${slotLabel(p.appt)})`).join('; ')}. It's in your diary; the interview decides it.`); for (const p of shortlisted) delete p.appt;
  if (offers.length) { M.stats.offers += offers.length; for (const o of offers) inbox('offer', `Offer: ${o.t}`, offerText(o), { post: o, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] }); }
  // a rival in the same line of work sometimes gets there first
  const rival = Object.keys(M.known).map(Number).find(id => M.known[id].tags.includes('Rival') && !P(id).dead && P(id).hub === M.hub);
  if (rival !== undefined && noes.length && prnd() < .2) { const p = ppick(noes); addTie(me, P(rival), -3); inbox('note', `${P(rival).name} again`, `You hear who got the ${p.t.toLowerCase()} job you wanted${p.film !== null ? ' on ' + S.films[p.film].title : ''}: ${P(rival).name}.`, { person: rival }); stress += 3; }
  if (noes.length) { stress += (has(me, 'Thick-skinned') ? .5 : 2) * noes.length; inbox('note', noes.length === 1 ? 'No luck' : `${noes.length} rejections`, `${noes.map(p => `${p.t}${p.film !== null ? ' on ' + S.films[p.film].title : ''}`).join('; ')}: ${noes.length === 1 ? 'they went with someone else' : 'they all went with someone else'}. ${noes.length > 2 ? 'It happens to everyone. It still stings.' : ''}`); }
  contestWeek();
  if (typeof compWeek === 'function') compWeek();
  if (typeof mediaWeek === 'function') mediaWeek();
  if (typeof mediaAwardsWeek === 'function') mediaAwardsWeek();
  if (typeof mailWeek === 'function') mailWeek();
  if (typeof campaignFilms === 'function' && campaignSeason() && M.campY !== S.year && campaignFilms().length) { M.campY = S.year; inbox('note', 'Awards season', `Campaigns are starting for this year's films. ${campaignFilms().map(f => f.title).join(', ')} ${campaignFilms().length > 1 ? 'are' : 'is'} eligible. Screeners, trade ads, Q&As: it's all on the Contests tab.`); }
  dealsWeek();
  awardsWeek();
  storyWeek();
  stress += socialWeek();
  if (typeof consequenceWeek === 'function') consequenceWeek();
  if (typeof cohortWeek === 'function') cohortWeek();
  if (typeof ambitionWeek === 'function') ambitionWeek();
  stress += livingWorldWeek();
  const fee = schoolWeek(L, gain);
  if (typeof mentorWeek === 'function') mentorWeek(gain);
  if (typeof codexWeek === 'function') codexWeek(L, gain);
  if (typeof convoWeek === 'function') convoWeek();
  if (typeof egofWeek === 'function') egofWeek();
  if (typeof corpWeek === 'function') corpWeek();
  if (fee > 0) cashOut += usd(fee); else cashIn += usd(-fee);
  // living
  const life = ORIGIN.life[M.life];
  cashOut += Math.round(usd(M.rentOverride && M.life !== 'couch' ? M.rentOverride : life.rent) * traitMul(me, 'living') * (M.cohab != null ? .6 : 1) * worldFx().rent) + M.upkeep + usd(VEHICLES[M.vehicle || 'transit'].upkeep);
  stress += hoodFx().stress || 0;
  if (M.debt > 0) { const p = Math.min(M.debt, M.debtPay); M.debt -= p; cashOut += p; }
  if (M.shark > 0) M.shark = Math.round(M.shark * 1.01);
  cashIn += M.allowance;
  M.cash += cashIn - cashOut;
  if (M.cash < 0) { M.broke++; stress += 6; } else M.broke = 0;
  const hf = homeFx();
  for (const k in hf.grow) gain(k, hf.grow[k]);
  if (hf.standing) me.standing = clamp(me.standing + hf.standing, 0, 100);
  stress += hf.stress;
  // the grind: week after week of work without real rest wears you down, even when the work is good
  if (M.jobs.length && !burnt) { M.grind = (M.grind || 0) + 1; if ((W.restN || 0) >= 11) M.grind = Math.max(0, M.grind - 3); } else M.grind = Math.max(0, (M.grind || 0) - ((W.restN || 0) >= 11 ? 3 : 1));
  if (M.grind > 6) { stress += Math.min(5, (M.grind - 6) * .6) * ((W.restN || 0) >= 8 ? .5 : 1); if (M.grind === 8) L.push('Eight weeks without a proper break. It\'s starting to show: evenings off and weekends away help.'); if (M.grind === 12) inbox('note', 'Worn down', 'Three months of work with hardly a day off. You\'re short with people and it shows. A week of rest, or a weekend away, would reset you.'); }
  stress += life.stress - 2 + (energy < 10 ? 6 : 0) + (M.cash < usd(life.rent) * 3 ? 4 : 0) + (M.debt > 0 ? 1 : 0);   // money worries weigh   // energy itself is restored night by night (life.js)
  M.energy = clamp(energy, 0, 100);
  M.stress = clamp(M.stress + stress * (stress > 0 ? traitMul(me, 'stress') * (has(me, 'Volatile') ? 1.2 : 1) : 1) * (1.1 - me.mind.com / 40), 0, 100);
  recalc(me);
  const gl = Object.entries(gains).filter(([, v]) => v >= .04).sort((x, y) => y[1] - x[1]).slice(0, 3);
  L.unshift(`Money: ${fmtCash(cashIn)} in, ${fmtCash(cashOut)} out.${gl.length ? ' You got better at ' + gl.map(([k]) => (CRAFTS[SUB2C[k]] ? CRAFTS[SUB2C[k]].subs[k] : MINDS[k]).toLowerCase()).join(', ') + '.' : ''}`);
  for (const t of L) diary(t);
  // the world moves on
  const before = S.news.length;
  tick();
  M.week = S.week;
  M.closing = false;
  if (M.focus && M.focus.auto) M.cal = autoCal();   // autopilot writes next week's diary
  afterTick(S.news.slice(before));
}
function jobOver(j) { const f = S.films[j.film]; return f.stage < 0 || f.stage >= 4 || !POST_BY[j.k].st.includes(f.stage) && f.stage > Math.max(...POST_BY[j.k].st); }
function offerText(o) {
  const f = o.film !== null ? S.films[o.film] : null, t = tmplOf(o);
  return `${f ? `${f.title} (${f.genre.toLowerCase()}, ${f.co === null ? 'independent' : S.companies[f.co].name}) wants you as ${o.t.toLowerCase()}` : `${o.t}: they can take you on`}. ${o.days} day${o.days > 1 ? 's' : ''} a week for about ${o.weeks} week${o.weeks > 1 ? 's' : ''}, ${o.rate ? fmtCash(o.rate) + ' a day' : 'unpaid'}.${o.head !== null ? ` You'd answer to ${P(o.head).name}.` : ''}${t.cr ? ' It comes with a screen credit.' : ''}`;
}
function takeJob(post) {
  const M = S.me, f = post.film !== null ? S.films[post.film] : null;
  if (post.away && post.away !== M.hub) relocate(post.away, `for ${post.t.toLowerCase()}${f ? ' on ' + f.title : ''}`);
  const mates = f ? [...slotsOf(f)].filter(([id, s]) => id !== post.head && closeness(POST_BY[post.k].head === 'ad' ? 'ad' : POST_BY[post.k].head, s) >= .75).map(([id]) => id).slice(0, 3) : [];
  const j = { ...post, done: 0, mates, started: S.week };
  M.jobs.push(j);
  if (post.head !== null) meet(post.head, 'Hired you');
  for (const id of mates) meet(id, 'Worked together');
  diary(`You start as ${post.t.toLowerCase()}${f ? ' on ' + f.title : ''}.`);
  if (!M.past.length && M.jobs.length === 1) milestone(`First job in the business: ${post.t.toLowerCase()}${f ? ' on ' + f.title : ''}`, 'work');
  else if (post.tier >= 2 && f) milestone(`Hired as ${post.t.toLowerCase()} on ${f.title}`, 'work');
}
// Moving city for work: your contacts come with you (on the phone, at least); your home and the board don't.
function relocate(hub, why) {
  const M = S.me, me = ME(), from = M.hub;
  M.hub = hub; me.hub = hub; M.rentOverride = null; M.home.layout = {}; M.hoodWhere = null;
  if (M.agent && !agenciesIn(hub).some(a => a.name === M.agent.name)) inbox('note', 'Your agent is far away now', `${M.agent.name} can still pitch you, but their best contacts are back in ${hubName(from)}.`);
  milestone(`Moved from ${hubName(from)} to ${hubName(hub)} ${why}`, 'life');
  inbox('news', `You move to ${hubName(hub)}`, `New city, new board, new people. You find a ${ORIGIN.life[M.life].label.toLowerCase()} and start learning which café the crews use.`);
}
function finishJob(j, L, quit) {
  const M = S.me, me = ME();
  M.jobs = M.jobs.filter(x => x !== j);
  const f = j.film !== null ? S.films[j.film] : null;
  const t = tmplOf(j);
  const credited = !quit && f && t.cr && j.done >= Math.min(2, j.weeks) && f.stage >= 0;
  if (credited) { f.xc = f.xc || {}; f.xc[me.id] = j.t; milestone(`${me.credits.length || M.past.some(p => p.credited) ? 'Screen credit' : 'First screen credit'}: ${j.t.toLowerCase()} on ${f.title}`, 'credit'); }
  const T = j.tasks || [];
  M.past.push({ k: j.k, t: j.t, film: j.film, head: j.head, from: j.started, to: S.week, credited, quit: !!quit, score: j.score || 0, contrib: j.contrib || 0, tasks: T.length });
  if (T.length && L) L.push(`Your work as ${j.t.toLowerCase()}: ${T.length} task${T.length > 1 ? 's' : ''} delivered, ${T.filter(x => x.pts > 0).length} good, ${T.filter(x => x.pts < 0).length} rough${f && j.contrib ? `; it moved the film ${j.contrib > 0 ? 'up' : 'down'} ${Math.abs(j.contrib).toFixed(1)} points` : ''}.`);
  if (j.head != null && P(j.head) && !quit) {
    if (!M.known[j.head]) meet(j.head);
    const o = opinion(j.head), k = M.known[j.head];
    k.trust = clamp(k.trust + (o > 10 ? 8 : 2), 0, 100);
    if (!k.tags.includes('Worked for them')) k.tags.push('Worked for them');
    if (o > 20) M.refs[j.head] = (M.refs[j.head] || 0) + 1;
  }
  const txt = quit ? `You leave ${j.t.toLowerCase()}${f ? ' on ' + f.title : ''}.` : `${f ? f.title + ' wraps your part' : 'Your stint as ' + j.t.toLowerCase() + ' ends'}.${credited ? ' Your name will be in the credits.' : ''}${j.head !== null && opinion(j.head) > 20 ? ` ${P(j.head).name} says to call them for the next one.` : ''}`;
  (L ? L.push(txt) : diary(txt));
  if (!quit && f) inbox('note', f ? 'Wrapped' : 'Job done', txt);
}

function networkDay(L) {
  const M = S.me, me = ME();
  const ok = roll('cha', 11);
  const roles = ROLES.filter(r => S.pool[M.hub][r].length);
  const n = (ok ? 2 : 1) + traitSum(me, 'net');
  const names = [];
  for (let i = 0; i < n; i++) {
    const r = ppick(roles);
    const q = bestIn(M.hub, [r], q => -Math.abs(q.standing - me.standing - 12) * (ok ? .5 : 1) + prnd() * 30);
    if (!q) continue;
    meet(q.id, 'Met at a mixer', ok ? 6 + pri(0, 6) : pri(-3, 4));
    names.push(`${q.name} (${ROLE_LABEL[q.role].toLowerCase()})`);
    if (ok && prnd() < .12 && S.active.some(i => keyIds(S.films[i]).includes(q.id))) { M.refs[q.id] = (M.refs[q.id] || 0) + 1; L.push(`${q.name} mentions their film is hiring.`); }
  }
  L.push(names.length ? `${ok ? 'A good night at the mixer' : 'An awkward mixer'}: you meet ${names.join(' and ')}.` : 'The mixer is half empty.');
}
function catchupDay(L) {
  const M = S.me, me = ME(), id = M.catchWith;
  if (id === null || !M.known[id] || P(id).dead) { L.push('You meant to catch up with someone but never made the call.'); return; }
  const q = P(id), k = M.known[id];
  const ok = roll('cha', 9 - k.trust / 25);
  addTie(me, q, (ok ? 6 : 1) + tasteMatch(q) * 2); k.trust = clamp(k.trust + (ok ? 4 : 1), 0, 100);   // shared tastes make it easier
  const film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id) && f.hub === M.hub);
  if (film && opinion(id) > 10 && prnd() < .6) { M.refs[id] = (M.refs[id] || 0) + 1; L.push(`Coffee with ${q.name}: they're on ${film.title} and promise to put your name forward.`); }
  else L.push(`Coffee with ${q.name}. ${ok ? 'It goes well.' : 'They seem distracted.'}`);
}

// After the world moves: credits land, news about people you know arrives, NPCs remember you, scenes happen.
function afterTick(fresh) {
  const M = S.me, me = ME();
  // films you worked on that just opened
  for (const pj of M.past) {
    if (pj.film === null || pj.seen) continue;
    const f = S.films[pj.film];
    if (f.stage < 0) { pj.seen = 1; continue; }
    if (f.rel === null) continue;
    pj.seen = 1;
    if (pj.credited && !me.credits.includes(f.id)) {
      me.credits.push(f.id); M.stats.credits++;
      me.standing = clamp(me.standing + .8 + (f.q - 55) * .03, 0, 100);
      inbox('news', `${f.title} opens`, `${f.title} is out: critics ${f.reviews}/100, ${fmtM(f.total)} worldwide on a ${fmtM(f.cost)} budget. Your name is in the credits as ${pj.t.toLowerCase()}.`, { film: f.id });
    }
  }
  // news about people you know
  const seen = new Set();
  for (const n of fresh) {
    const ids = n.ref && n.ref.person !== undefined ? [n.ref.person] : n.ref && n.ref.film !== undefined ? keyIds(S.films[n.ref.film]) : [];
    const who = ids.find(id => M.known[id] && !seen.has(id));
    if (who === undefined) continue;
    seen.add(who);
    inbox('news', `News: ${P(who).name}`, n.text, n.ref && n.ref.film !== undefined ? { film: n.ref.film } : { person: who });
  }
  // a contact who likes you and is starting a film remembers you
  for (const id of S.active) {
    const f = S.films[id];
    if (f.hub !== M.hub || f.gl !== S.week) continue;
    for (const pid of [f.dir, f.prod, f.dp, f.ed]) {
      if (!M.known[pid] || opinion(pid) < 25 || prnd() > .5) continue;
      M.refs[pid] = (M.refs[pid] || 0) + 1;
      inbox('lead', `A lead from ${P(pid).name}`, `${P(pid).name} has a new film, ${f.title}, and wants you around. Watch the board; your application will have a friend inside.`, { person: pid });
      break;
    }
  }
  // scenes from the jobs you're on
  agentWeek(); agentApproach(); maybeEvent();
  // life events
  if (M.quirk === 'secret' && !M.secretOut && S.week - M.startW > 20 && prnd() < .03) secretEvent();
  if (M.shark > 0 && (S.week - M.startW) % 8 === 7) inbox('debt', 'A visit about the loan', `The man you owe ${fmtCash(M.shark)} comes by. Interest is running at one percent a week.`, { choices: [{ k: 'pay', label: `Pay it all (${fmtCash(M.shark)})`, dis: M.cash < M.shark ? 'Not enough cash' : null }, { k: 'part', label: `Pay ${fmtCash(Math.round(M.shark / 4))} to buy time`, dis: M.cash < M.shark / 4 ? 'Not enough cash' : null }, { k: 'stall', label: 'Stall' }] });
  if (M.broke >= 6 && !pending().some(x => x.kind === 'broke')) inbox('broke', 'The rent is overdue', `You have been in the red for ${M.broke} weeks. Something has to give.`, { choices: [{ k: 'down', label: 'Move somewhere cheaper', dis: M.life === 'couch' ? 'Already on a couch' : null }, { k: 'borrow', label: 'Ask a friend for a loan', dis: bestFriend() === null ? 'Nobody close enough to ask' : null }, { k: 'leave', label: 'Leave the business and go home' }] });
  if (M.stress >= 90 && !M.burnout) { M.burnout = 1; me.standing = Math.max(0, me.standing - 1); if (prnd() < .25 && !has(me, 'Volatile') && me.traits.length < 6) me.traits.push('Volatile'); inbox('note', 'Burnout', 'You hit a wall. Next week you sleep, cancel everything, and call in sick to any job you have.' + (has(me, 'Volatile') ? ' Something in you has frayed: you snap at people more now.' : '')); }
  refreshBoard();
}
function bestFriend() { const M = S.me; let b = null, bs = 30; for (const id in M.known) { const o = opinion(+id) + M.known[id].trust * .3; if (o > bs && !P(+id).dead) { bs = o; b = +id; } } return b; }
function secretEvent() {
  const M = S.me, known = Object.keys(M.known).map(Number).filter(id => !P(id).dead);
  if (!known.length) return;
  const who = ppick(known);
  M.secretOut = 1;
  inbox('secret', 'Someone knows', `${P(who).name} pulls you aside: they know about what you did before you came here. They haven't told anyone. Yet.`, { person: who, choices: [{ k: 'confide', label: 'Tell them the whole story', check: ['cha', 11] }, { k: 'deny', label: 'Deny everything', check: ['com', 13] }, { k: 'pay', label: `Buy their silence (${fmtCash(usd(1500))})`, dis: M.cash < usd(1500) ? 'Not enough cash' : null }] });
}

// ---------------- On-set scenes ----------------
// One decision a week, drawn from what the job is. {head}, {dir}, {lead}, {film}, {peer} fill in names.
const ANY = null, SHOOT = ['setpa', 'campa', 'artpa', 'costpa', 'locpa', 'crafty', 'utilsnd', 'standin', 'extra', 'dayplayer', 'ac2', 'grip', 'ad22', 'dresser', 'boom', 'makeup', 'stunt'];
const SCENES = [
  { id: 'coffee', jobs: ['setpa', 'crafty', 'locpa'], title: 'Two orders at once', text: '{dir} wants a coffee. The walkie says the AD needs you at basecamp. Now.', opts: [
    { k: 'coffee', label: 'Coffee first; directors remember', ok: { tie: { dir: 4, head: -4 } }, t: '{dir} thanks you by name. The AD does not.' },
    { k: 'base', label: 'Basecamp first; the AD is your boss', ok: { tie: { head: 4 } }, t: 'The AD clocks how fast you got there.' },
    { k: 'both', label: 'Hand the coffee to another PA and run', check: ['col', 11], ok: { tie: { head: 3, dir: 2 }, stand: .3 }, bad: { tie: { head: -3 } }, t: 'Teamwork.', tb: 'The other PA brings the wrong coffee. Somehow it’s your fault.' }] },
  { id: 'lockup', jobs: ['setpa', 'locpa', 'ad22'], title: 'Lock-up', text: 'You’re holding a street for the take. A furious local wants through, right now, with a car full of shopping.', opts: [
    { k: 'talk', label: 'Talk them down', check: ['cha', 11], ok: { tie: { head: 5 }, stand: .4 }, bad: { tie: { head: -6 }, stress: 6 }, t: 'You charm them into waiting. The take is clean.', tb: 'They drive through the shot. The AD’s voice on the walkie is very calm, which is worse.' },
    { k: 'let', label: 'Let them through and warn the set', ok: { tie: { head: -2 } }, t: 'A lost take, but nobody got hurt.' },
    { k: 'call', label: 'Call the AD for help', ok: { xp: { setm: .2 } }, t: 'The AD sorts it and shows you how they did it.' }] },
  { id: 'leadchat', jobs: SHOOT, title: 'Between setups', text: '{lead} sits down next to you and starts talking about their character. They ask what you think of the scene.', opts: [
    { k: 'honest', label: 'Give an honest note', check: ['tas', 12], ok: { tie: { lead: 10 }, tag: { lead: 'Trusted your eye' } }, bad: { tie: { lead: -6, head: -4 } }, t: '{lead} goes very still, then nods. "Nobody says that to me."', tb: '"Right." {lead} gets up. Your boss heard. Stay in your lane.' },
    { k: 'listen', label: 'Just listen', ok: { tie: { lead: 4 } }, t: 'They talk for twenty minutes and seem lighter after.' },
    { k: 'busy', label: 'Excuse yourself; you have work to do', ok: { tie: { head: 1 } }, t: 'Your boss notices you back at your post.' }] },
  { id: 'overtime', jobs: ANY, title: 'Hour fourteen', text: 'It’s been a long day on {film}. {head} asks who can stay late to wrap out.', opts: [
    { k: 'stay', label: 'Stay', ok: { tie: { head: 6 }, energy: -10, stress: 4, due: 'head' }, t: '{head} won’t forget it. Neither will your back.' },
    { k: 'go', label: 'Go home', ok: { tie: { head: -2 }, stress: -3 }, t: 'You sleep. Someone else gets the thank-you.' }] },
  { id: 'mistake', jobs: ANY, title: 'A mistake', text: 'You mislabelled something important on {film}. Nobody has noticed yet.', opts: [
    { k: 'own', label: 'Own up to {head}', ok: { tie: { head: 1 }, trust: { head: 6 } }, t: '{head} sighs, fixes it, and seems to respect you more for saying so.' },
    { k: 'quiet', label: 'Fix it quietly before anyone sees', check: ['eth', 10], ok: { xp: { cont: .1 } }, bad: { tie: { head: -10 }, trust: { head: -12 }, fire: .25 }, t: 'Fixed. Nobody ever knows.', tb: 'It surfaces at the worst possible moment, and the trail leads to you.' },
    { k: 'blame', label: 'Let it look like someone else’s mistake', check: ['com', 14], ok: {}, bad: { tie: { head: -14 }, trust: { head: -20 }, fire: .4, stand: -1 }, t: 'It blows over. You feel worse than you expected.', tb: 'Everyone knows. Sets are small towns.' }] },
  { id: 'shadow', jobs: ['campa', 'ac2', 'grip', 'artpa', 'dresser', 'postpa', 'ae2', 'ae1', 'boom', 'utilsnd', 'makeup', 'costpa', 'asstprod', 'devasst'], title: 'An invitation', text: '{head} offers to let you shadow them through a tricky stretch of work this week.', opts: [
    { k: 'yes', label: 'Jump at it', ok: { shadow: 1, energy: -6, tie: { head: 4 } }, t: 'You watch how {head} actually works, which is nothing like how the books say.' },
    { k: 'no', label: 'Politely decline; you’re stretched thin', ok: { stress: -2 }, t: 'Maybe next time.' }] },
  { id: 'fight', jobs: SHOOT, title: 'Raised voices', text: '{dir} and {lead} are arguing loudly. The whole crew has gone quiet.', opts: [
    { k: 'busy', label: 'Keep your corner working', check: ['com', 10], ok: { tie: { head: 4 }, stand: .3 }, bad: { stress: 5 }, t: 'Your department keeps moving; it gets noticed.', tb: 'You freeze along with everyone else.' },
    { k: 'listen', label: 'Listen in', ok: { tag: { dir: 'Saw them lose it' } }, t: 'You learn more about how films are made in five minutes than in a month.' },
    { k: 'leave', label: 'Find a reason to be elsewhere', ok: {}, t: 'You fetch something nobody needs, slowly.' }] },
  { id: 'coverage', jobs: ['reader', 'devasst', 'asstprod'], title: 'A script in the pile', text: 'A script from an unknown writer: messy pages, but something alive in it. {head} wants your coverage by Friday.', opts: [
    { k: 'rec', label: 'Recommend it', check: ['tas', 11], ok: { tie: { head: 6 }, stand: .5, tag: { head: 'Good eye' } }, bad: { tie: { head: -4 } }, t: '{head} reads it over the weekend and calls you on Monday.', tb: '{head} reads ten pages and asks what you were thinking.' },
    { k: 'consider', label: 'Mark it "consider"', ok: { xp: { struc: .15 } }, t: 'Safe. Your coverage is good; the script goes back in the pile.' },
    { k: 'pass', label: 'Pass', ok: {}, t: 'Another script, another pass.' }] },
  { id: 'tape', jobs: ['castasst'], title: 'The self-tape', text: 'An unknown actor’s self-tape is wonderful. The director wants names.', opts: [
    { k: 'push', label: 'Put it at the top of the pile', check: ['eye', 10], ok: { tie: { head: 5, dir: 3 }, stand: .5 }, bad: { tie: { head: -4 } }, t: 'They bring the actor in. The room changes when they start.', tb: 'The director watches eight seconds and moves on.' },
    { k: 'leave', label: 'Leave it where it is', ok: {}, t: 'Somebody else might find it.' }] },
  { id: 'backup', jobs: ['postpa', 'logger', 'ae2', 'ae1'], title: 'A drive fails', text: 'The night before a screening of {film}, a drive in the edit suite dies.', opts: [
    { k: 'night', label: 'Stay up rebuilding the project', check: ['cont', 9], ok: { tie: { head: 9 }, energy: -15, stand: .5 }, bad: { tie: { head: -5 }, energy: -15, stress: 8 }, t: 'By 6 a.m. it’s back, exactly as it was. {head} buys you breakfast.', tb: 'By 6 a.m. it mostly works. Mostly isn’t enough.' },
    { k: 'tell', label: 'Call {head} right away', ok: { tie: { head: 2 } }, t: 'Together you get it back by midnight.' }] },
  { id: 'line', jobs: ['extra', 'standin', 'dayplayer'], title: 'One line', text: '{dir} needs someone to say one line in the next take. You’re standing right there.', opts: [
    { k: 'yes', label: 'Volunteer', check: ['pres', 11], ok: { tie: { dir: 6 }, stand: 1, cash: 600, tag: { dir: 'Gave you a line' } }, bad: { tie: { dir: -3 }, stress: 5 }, t: 'You say it. They print the second take. You’re upgraded for the day.', tb: 'Your voice cracks. They give the line to someone else.' },
    { k: 'no', label: 'Stay in the background', ok: {}, t: 'Someone else gets the line, and the day rate.' }] },
  { id: 'cover', jobs: ANY, title: 'A favour', text: '{peer}, who works alongside you, begs you to cover for them so they can go to an audition.', opts: [
    { k: 'cover', label: 'Cover for them', ok: { energy: -8, tie: { peer: 12 }, due: 'peer', risk: .15 }, t: '{peer} owes you one, and knows it.' },
    { k: 'no', label: 'Say no', ok: { tie: { peer: -4 } }, t: '{peer} goes quiet for the rest of the week.' }] },
  { id: 'poster', jobs: ['officepa', 'asstprod', 'devasst'], title: 'Two posters', text: '{head} spreads two poster designs for {film} on the desk and asks which one you’d stop for.', opts: [
    { k: 'pick', label: 'Pick one and say why', check: ['mkt', 10], ok: { tie: { head: 5 }, tag: { head: 'Good instincts' } }, bad: { tie: { head: -2 } }, t: '{head} picks the same one, and quotes you in the meeting.', tb: '{head} laughs. "That one tested worst of all."' },
    { k: 'defer', label: '"Whatever you think"', ok: { tie: { head: 1 } }, t: 'Safe, and forgettable.' }] },
  { id: 'rig', jobs: ['grip', 'stunt', 'campa', 'ac2', 'boom'], title: 'Something looks wrong', text: 'A rig on the {film} set looks wrong to you, and the shot is about to roll.', opts: [
    { k: 'speak', label: 'Speak up', check: ['com', 10], ok: { tie: { head: 6 }, stand: .5, trust: { head: 6 } }, bad: { tie: { head: -3 } }, t: 'You were right. Nobody says much, but the grips nod at you after.', tb: 'It was fine. You held up the shot for nothing.' },
    { k: 'quiet', label: 'Say nothing; they know their job', ok: { risk: .1 }, t: 'It holds. This time.' }] },
  { id: 'party', jobs: ANY, title: 'Wrap drinks', text: 'The {film} crew is going out on Friday. {head} asks if you’re coming.', opts: [
    { k: 'go', label: 'Go, and stay late', ok: { energy: -8, tie: { head: 4, mates: 4 } }, t: 'Stories, karaoke, a taxi at 3 a.m. You’re one of them now.' },
    { k: 'one', label: 'One drink, then home', ok: { tie: { head: 2 } }, t: 'You show your face. That’s enough.' },
    { k: 'skip', label: 'Skip it', ok: { stress: -3 }, t: 'You sleep in on Saturday.' }] }
];
function pickScene(j) {
  // scenes written for this job come up more than generic ones, and none repeats within a couple of months
  const L = SCENES.filter(s => !s.event && (!s.jobs || s.jobs.includes(j.k)) && sceneFresh(s.id) && !(j.film === null && /\{(film|dir|lead)\}/.test(s.text + JSON.stringify(s.opts))));
  if (!L.length) return null;
  let tw = 0; const ws = L.map(s => { const w = s.jobs ? 3 : 1; tw += w; return w; });
  let r = prnd() * tw, s = L[L.length - 1];
  for (let i = 0; i < L.length; i++) { r -= ws[i]; if (r <= 0) { s = L[i]; break; } }
  const f = j.film !== null ? S.films[j.film] : null;
  const ctx = { head: j.head, film: j.film, dir: f ? f.dir : null, lead: f ? f.cast[0] : null, mates: j.mates || [] };
  if (s.text.includes('{peer}')) ctx.peer = youngNPC(S.me.hub, ppick(['ad', 'designer', 'editor', 'actor'])).id;
  if (ctx.head === null && /\{head\}/.test(s.text + JSON.stringify(s.opts))) return null;
  return { id: s.id, title: s.title, text: fillScene(s.text, ctx), ctx, opts: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check, hint: o.check ? statLabel(o.check[0]) : null })) };
}
function statLabel(k) { return MINDS[k] || (SUB2C[k] ? CRAFTS[SUB2C[k]].subs[k] : k); }
function fillScene(t, ctx) { return t.replace(/\{(\w+)\}/g, (_, k) => k === 'film' ? (ctx.film !== null ? S.films[ctx.film].title : 'the job') : ctx[k] !== undefined && ctx[k] !== null && typeof ctx[k] === 'number' ? P(ctx[k]).name : 'someone').replace(/\b([Tt]he) The /g, '$1 '); }

function sceneResolve(it, k) {
  const s = SCENES.find(x => x.id === it.scene), o = s.opts.find(x => x.k === k), M = S.me, me = ME();
  const ok = o.check ? roll(o.check[0], o.check[1]) : true;
  const fx0 = ok ? o.ok : (o.bad || o.ok);
  // the harder the check, the bigger the payoff when it lands
  const hard = ok && o.check ? 1 + Math.max(0, o.check[1] - 12) * .25 : 1;
  const scale = (obj, f) => { if (!obj) return obj; const out = {}; for (const k in obj) out[k] = obj[k] > 0 ? obj[k] * f : obj[k]; return out; };
  const fx = hard > 1 ? Object.assign({}, fx0, { tie: scale(fx0.tie, hard), xp: scale(fx0.xp, hard), stand: fx0.stand > 0 ? fx0.stand * hard : fx0.stand, cash: fx0.cash > 0 ? fx0.cash * hard : fx0.cash, fame: fx0.fame > 0 ? fx0.fame * hard : fx0.fame }) : fx0;
  let t0 = hard > 1 ? ' Hard won, and worth more for it.' : '';
  const ctx = it.ctx, who = r => r === 'mates' ? ctx.mates : ctx[r] !== null && ctx[r] !== undefined ? [ctx[r]] : [];
  for (const r in fx.tie || {}) for (const id of who(r)) { meet(id, null); addTie(me, P(id), fx.tie[r]); }
  for (const r in fx.trust || {}) for (const id of who(r)) trust(id, fx.trust[r]);
  for (const r in fx.tag || {}) for (const id of who(r)) meet(id, fx.tag[r]);
  if (fx.due) for (const id of who(fx.due)) { meet(id, null); M.known[id].due++; }
  if (fx.stand) me.standing = clamp(me.standing + fx.stand, 0, 100);
  if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100);
  if (fx.energy) M.energy = clamp(M.energy + fx.energy, 0, 100);
  if (fx.cash) M.cash += usd(fx.cash);
  if (fx.fame) me.fame = clamp((me.fame || 0) + fx.fame, 0, 100);
  if (fx.refs) M.freeRef = (M.freeRef || 0) + fx.refs;
  if (fx.flag) (M.flags = M.flags || {})[fx.flag] = S.week;
  if (fx.rel && ctx.contact != null) setRel(ctx.contact, fx.rel === 'none' ? null : fx.rel);
  if (fx.cohab && ctx.contact != null) { M.cohab = ctx.contact; milestone(`Moved in with ${P(ctx.contact).name}`, 'love'); }
  if (fx.script && ctx.script) { const sc = (M.scripts || []).find(x => x.id === ctx.script && x.stage === 'writing'); if (sc) { sc.pages = clamp(sc.pages + fx.script, 0, sc.target - 1); sc.q += fx.script * avg(['struc', 'dial', 'char', 'orig'].map(k => me.sk[k])); } }
  if (fx.meet) { const q = bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing - 10) + prnd() * 30); if (q) { meet(q.id, 'Met out', 5); t0 = ` You meet ${q.name}, ${ROLE_LABEL[q.role].toLowerCase()}.`; } }
  for (const x in fx.xp || {}) growSub(me, x, fx.xp[x]);
  const job = M.jobs.find(j => j.id === it.job);
  if (fx.shadow && job) job.shadow = 1;
  let t = fillScene(ok ? o.t : (o.tb || o.t), ctx) + t0;
  if (fx.risk && prnd() < fx.risk) { M.energy = Math.max(0, M.energy - 25); M.stress = clamp(M.stress + 8, 0, 100); t += ' It comes back to bite you: a rough few days.'; }
  if (fx.fire && job && prnd() < fx.fire) { finishJob(job, null, true); t += ' You are let go.'; me.standing = Math.max(0, me.standing - 1); }
  recalc(me);
  const lr = o.check ? S.me.lastRoll : null;
  if (lr && lr.crit > 0 && lr.DC >= 13) milestone(`A natural 20 when it counted: ${it.title.toLowerCase()}`, 'luck');
  if (lr && lr.crit > 0) { me.standing = clamp(me.standing + .5, 0, 100); if (ctx.head !== null && ctx.head !== undefined) addTie(me, P(ctx.head), 3); t += ' People will talk about it.'; }
  if (lr && lr.crit < 0) { M.stress = clamp(M.stress + 5, 0, 100); t += ' It could hardly have gone worse.'; }
  // how a moment on the job goes is part of the work: it counts toward the film and your boss's opinion
  if (o.check && ctx.film !== null && ctx.film !== undefined) { const jj = M.jobs.find(x => x.film === ctx.film); if (jj && typeof jobScore === 'function') jobScore(jj, ok ? (lr.crit > 0 ? 2 : 1) : (lr.crit < 0 ? -1.5 : -.5), it.title); }
  it.result = { ok: o.check ? ok : null, roll: lr, t, teach: s.teach || null };
}

function resolvePick(it, k) {
  const M = S.me, me = ME(), c = it.choices.find(x => x.k === k);
  if (!c || c.dis) return false;
  if (it.kind === 'interview') { resolveInterview(it, k); return true; }
  if (socialPick(it, k)) return true;
  if (dealPick(it, k)) return true;
  if (bidPick(it, k)) return true;
  if (typeof sponsorPick === 'function' && sponsorPick(it, k)) return true;
  if (typeof corpPick === 'function' && corpPick(it, k)) return true;
  if (it.kind === 'agentoffer') {
    if (k === 'yes' && !M.agent) signAgent(agenciesIn(M.hub)[it.ag], 'You meet them for lunch and sign before dessert.');
    it.done = true; it.result = { t: k === 'yes' ? 'Signed.' : 'You tell them you\'ll think about it.' }; return true;
  }
  if (it.kind === 'offer') {
    if (k === 'yes') {
      if (jobDays() + it.post.days > 7) { it.result = { t: 'You can’t fit it around the work you already have.' }; it.done = true; return true; }
      const f = it.post.film !== null ? S.films[it.post.film] : null;
      if (f && (f.stage < 0 || f.stage >= 4)) { it.result = { t: 'Too late: the production has moved on.' }; it.done = true; return true; }
      takeJob(it.post); it.result = { t: 'You start on Monday.' };
    } else { if (it.post.head !== null) addTie(me, P(it.post.head), -2); it.result = { t: 'You turn it down.' }; }
  } else if (it.kind === 'scene') sceneResolve(it, k);
  else if (it.kind === 'debt') {
    if (k === 'pay') { M.cash -= M.shark; M.shark = 0; it.result = { t: 'Paid in full. You never want to see him again.' }; }
    else if (k === 'part') { const p = Math.round(M.shark / 4); M.cash -= p; M.shark -= p; it.result = { t: 'He takes it and leaves. For now.' }; }
    else { M.stress = clamp(M.stress + 12, 0, 100); M.shark = Math.round(M.shark * 1.1); it.result = { t: 'He adds ten percent for your trouble and makes sure you’re scared.' }; }
  } else if (it.kind === 'broke') {
    if (k === 'down') { const ladder = ['couch', 'shared', 'studio', 'own', 'loft', 'house']; M.life = ladder[Math.max(0, ladder.indexOf(M.life) - 1)]; M.rentOverride = null; M.home.layout = {}; it.result = { t: `You move: ${ORIGIN.life[M.life].label.toLowerCase()} from now on.` }; }
    else if (k === 'borrow') { const f = bestFriend(); if (f === null) return false; const amt = Math.max(usd(800), -M.cash + usd(300)); M.cash += amt; M.known[f].owe++; addTie(me, P(f), -3); it.result = { t: `${P(f).name} lends you ${fmtCash(amt)}. You owe them, in every sense.` }; }
    else { M.over = true; me.retired = true; me.retY = S.year; it.result = { t: 'You pack up and go home. The business goes on without you.' }; }
  } else if (it.kind === 'secret') {
    const who = it.person;
    if (k === 'pay') { M.cash -= usd(1500); M.known[who].tags.push('Knows your secret'); it.result = { t: 'They take the money. You will always wonder if it was enough.' }; }
    else { const ok = roll(c.check[0], c.check[1]); if (ok) { addTie(me, P(who), k === 'confide' ? 10 : 0); M.known[who].tags.push(k === 'confide' ? 'Keeps your secret' : 'Believed your denial'); it.result = { ok, roll: S.me.lastRoll, t: k === 'confide' ? 'They listen, and they keep it. A strange kind of bond.' : 'They seem to believe you.' }; } else { me.standing = Math.max(0, me.standing - 4); me.fame = clamp(me.fame + 2, 0, 100); addTie(me, P(who), -15); it.result = { ok, roll: S.me.lastRoll, t: 'It gets out anyway. For a few weeks people look at you differently.' }; } }
  }
  it.done = true; it.picked = k;
  return true;
}

// ---------------- Favours, quitting, lifestyle ----------------
function askFavour(id) {
  const M = S.me, k = M.known[id];
  if (!k || (k.due <= 0 && k.trust < 60)) return false;
  if (k.due > 0) k.due--; else { k.trust -= 15; k.owe++; }
  M.refs[id] = (M.refs[id] || 0) + 2;
  diary(`You ask ${P(id).name} to put in a word for you on their next job.`);
  return true;
}

// ---------------- The dispatcher ----------------
function applyAct(a) {
  switch (a.t) {
    case 'create': startCareer(a.c); return true;
    case 'startwork': return startWork(a);
    case 'mail': return mailAct(a);
    case 'trade': return tradeAct(a);
    case 'session': return appSession(a);
    case 'play': return playGame(a);
    case 'buyapp': return buyApp(a);
    case 'releasework': return releaseWork(a);
    case 'party': return partyPick(a.k);
    case 'pick': { const it = S.me.inbox.find(x => x.id === a.id); return it && !it.done ? resolvePick(it, a.k) : false; }
    case 'end': case 'day': case 'next': if (pending().length || !S.me.party.done || S.me.over) return false; liveOn(a); return true;
    case 'quit': { const j = S.me.jobs.find(x => x.id === a.id); if (!j) return false; if (j.head !== null) addTie(ME(), P(j.head), -6); finishJob(j, null, true); refreshBoard(); return true; }
    case 'life': if (!ORIGIN.life[a.v]) return false; S.me.life = a.v; return true;
    case 'look': {
      if (a.k === 'extra') { migrateLook(Object.assign(S.me.look, { extra: a.v })); return true; }   // saves from before accessory slots
      if (!LOOK[a.k] || !(a.v >= 0 && a.v < LOOK[a.k].opts.length)) return false;
      const item = WARDROBE_AT[a.k + ':' + a.v];
      if (item && !S.me.owned.includes(item)) return false;
      S.me.look[a.k] = a.v; return true;
    }
    case 'furnish': {
      const F = FURNITURE[a.id], M = S.me;
      if (!F || M.home.items.includes(a.id) || M.cash < F.price) return false;
      M.cash -= F.price; M.home.items.push(a.id); diary(`Bought for the flat: ${F.name.toLowerCase()} (${usd(F.price)}).`); return true;
    }
    case 'place': { const H = S.me.home; if (!H.items.includes(a.id)) return false; if (a.sp) H.layout[a.id] = a.sp; else delete H.layout[a.id]; return true; }
    case 'arrange': { const H = S.me.home; H.layout = {}; for (const id in a.layout || {}) if (H.items.includes(id)) H.layout[id] = a.layout[id]; return true; }
    case 'buy': {
      const W = WARDROBE[a.id], M = S.me;
      if (!W || M.owned.includes(a.id) || M.cash < W.price) return false;
      M.cash -= W.price; M.owned.push(a.id); M.look[W.slot] = W.opt;
      if (W.standing) ME().standing = clamp(ME().standing + W.standing, 0, 100);
      diary(`Bought: ${LOOK[W.slot].opts[W.opt]} (${usd(W.price)}).`);
      return true;
    }
    case 'favour': return askFavour(a.id) && (refreshBoard(), true);
    case 'text': return textSomeone(a);
    case 'reply': return replyText(a);
    case 'focus': return setFocus(a);
    case 'trip': return bookTrip(a);
    case 'dept': return investDept(a);
    case 'release': return setRelease(a);
    case 'like': return likePost(a);
    case 'optionspec': return optionSpec(a);
    case 'pitch': return pitchSpec(a);
    case 'found': return foundCompany(a);
    case 'invest': case 'withdraw': return coMoney(a);
    case 'selffund': return selfFund(a);
    case 'festival': return submitFest(a);
    case 'newscript': return newScript(a);
    case 'rewrite': return rewriteScript(a);
    case 'share': return shareScript(a);
    case 'contest': return enterContest(a);
    case 'compete': return enterComp(a);
    case 'campaign': return campaignAct(a);
    case 'mentor': return mentorAct(a);
    case 'school': return applySchool(a);
    case 'claimamb': return claimAmb(a);
    case 'auto': return autoAct(a);
    case 'pinamb': return pinAmb(a);
    case 'activescript': if (!(S.me.scripts || []).some(x => x.id === a.id && x.stage === 'writing')) return false; S.me.activeScript = a.id; return true;
    case 'move': return moveHome(a);
    case 'vehicle': return buyVehicle(a);
    case 'enrol': return enrol(a);
    case 'dropout': if (!S.me.school) return false; inbox('note', 'You leave the course', `You drop out of ${schoolProg(S.me.school).label.toLowerCase()}.`); S.me.school = null; return true;
    case 'query': return queryAgency(a);
    case 'fireagent': if (!S.me.agent) return false; inbox('note', 'You leave your agent', `You and ${S.me.agent.name} part ways.`); if (S.me.known[S.me.agent.id]) addTie(ME(), P(S.me.agent.id), -10); S.me.agent = null; S.me.board = S.me.board.filter(p => !p.agent); return true;
  }
  return false;
}
