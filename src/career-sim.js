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

// Money in the player's world: 2027 US dollars scaled by the era's prices and the hub's cost of living.
function wageF(hub) { const y = S.year; return cpi(y) / 330 * Math.max(.12, era(MARKETS[HUBS[hub].m].cost, y)); }
function usd(v2027, hub) { return Math.round(v2027 * wageF(hub || S.me.hub) / 5) * 5; }
function fmtCash(v) { return (v < 0 ? '−$' : '$') + Math.round(Math.abs(v)).toLocaleString('en-US'); }

// ---------------- Character creation ----------------
const ORIGIN = {
  wealth: {
    broke: { label: 'Broke', d: 'Every dollar is borrowed. Hungry for any job.', cash: 400, mind: { eth: 2 } },
    gettingby: { label: 'Getting by', d: 'A little saved from years of other work.', cash: 2500 },
    comfortable: { label: 'Comfortable', d: 'Parents who can help in a pinch, and taste formed by a house full of books and films.', cash: 9000, mind: { tas: 2 } },
    trust: { label: 'Trust fund', d: 'A monthly allowance and no rush. Insiders can tell, and some hold it against you.', cash: 40000, allowance: 250, mind: { eth: -2 }, standing: -3 }
  },
  edu: {
    self: { label: 'Self-taught', d: 'Learned by shooting and cutting anything you could. No debt.', craft: { cam: 1, edt: 1 }, mind: { eth: 1 } },
    film: { label: 'Film school', d: 'Two years of short films and a debt to show for it. Two classmates are already working.', craft: { dir: 2, cam: 2, edt: 2, wri: 1 }, debt: 15000, mates: ['director', 'dp'] },
    drama: { label: 'Drama school', d: 'Voice, movement, Chekhov. A showcase that went nowhere, yet.', craft: { act: 3 }, mind: { cha: 1 }, debt: 8000, mates: ['actor', 'actor'] },
    uni: { label: 'University', d: 'A literature degree, a short story in a small magazine, and a roommate who writes too.', craft: { wri: 2, pro: 1 }, mind: { tas: 1 }, debt: 10000, mates: ['writer'] }
  },
  arrival: {
    plusone: { label: "A friend's plus-one", d: 'A friend who works on sets brought you. You know one person in the room.' },
    bar: { label: 'Working the bar', d: 'You are being paid to pour drinks. You will see everyone, and they will see the help.' },
    crash: { label: 'Crashed it', d: 'You heard the address and walked in like you belonged. Bold, and risky.' },
    family: { label: 'Invited through family', d: 'Your family knows the host. Doors are open; expectations too.' }
  },
  build: {
    striking: { label: 'Striking', d: 'People look twice. Cameras too.', looks: 15, stamina: 9 },
    rugged: { label: 'Rugged', d: 'You can work a 16-hour day and still lift a sandbag.', looks: 11, stamina: 15 },
    everyday: { label: 'Everyday', d: 'You blend in, which is useful more often than you would think.', looks: 10, stamina: 12, mind: { col: 1 } },
    distinctive: { label: 'Distinctive', d: 'A face nobody forgets, for better or worse. Character-actor material.', looks: 8, stamina: 11, subs: { range: 1.5, pres: 1 } }
  },
  quirk: {
    none: { label: 'None', d: 'Nothing in your past is waiting to catch up with you.' },
    parent: { label: 'Famous parent', d: 'Your parent is a name in this town. Every door opens a crack; every success is doubted.' },
    debt: { label: 'A debt', d: 'You owe a loan shark $6,000, and he knows where you live.' },
    rival: { label: 'A rival', d: 'Someone from your past wants exactly what you want, and they are already here.' },
    secret: { label: 'A secret', d: 'Something you did before you came here. It will come out one day.' }
  },
  life: {
    couch: { label: 'Couch-surfing', d: 'Cheap, exhausting, and a little humiliating.', rent: 150, rest: -6, stress: 3 },
    shared: { label: 'Shared flat', d: 'Three roommates, one bathroom.', rent: 430, rest: 0, stress: 0 },
    own: { label: 'Own place', d: 'Quiet, private, expensive.', rent: 820, rest: 6, stress: -2 }
  }
};
const DREAM_ROLES = ['director', 'actor', 'writer', 'dp', 'editor', 'producer', 'designer', 'composer'];
const SKILL_POINTS = 10, SKILL_MAX = 4;
const PLAYER_TRAITS = TRAIT_KEYS.filter(t => t !== 'Prodigy');

function startCareer(c) {
  const y = S.year, hub = c.hub, seed = (S.seed * 7919 + 13) >>> 0;
  S.me = { rng: mulberry(seed), hub, seq: 1, startW: S.week, quirk: c.quirk, wealth: c.wealth, edu: c.edu, arrival: c.arrival, love: c.love, hate: c.hate, body: {}, cash: 0, debt: 0, debtPay: 0, shark: 0, allowance: 0, energy: 100, stress: 10, life: c.wealth === 'trust' ? 'own' : c.wealth === 'broke' ? 'couch' : 'shared', plan: ['hunt', 'hunt', 'network', 'write', 'rest', 'rest'], train: MAIN[c.role], catchWith: null, apps: [], jobs: [], past: [], inbox: [], known: {}, board: [], refs: {}, spec: { pages: 0, drafts: 0 }, broke: 0, burnout: 0, stats: { apps: 0, offers: 0, weeks: 0, earned: 0, credits: 0 }, diary: [], party: null, over: false };
  const M = S.me, W = ORIGIN.wealth[c.wealth], E = ORIGIN.edu[c.edu], B = ORIGIN.build[c.build];
  const age = clamp(c.age | 0, 18, 45);
  const sk = {}, pot = {};
  for (const cr in CRAFTS) for (const k in CRAFTS[cr].subs) {
    const pts = (c.points[cr] || 0) + (E.craft && E.craft[cr] || 0) + (cr === MAIN[c.role] ? 1 : 0);
    sk[k] = clamp(2.5 + prnd() * 2 + (age - 18) * .08 + pts * .75 + ((B.subs && B.subs[k]) || 0), 1, 12);
    const head = age < 24 ? 6 + prnd() * 7 : age < 30 ? 4 + prnd() * 6 : age < 38 ? 2.5 + prnd() * 5 : 1 + prnd() * 4;
    pot[k] = clamp(sk[k] + head + (c.traits.includes('Late bloomer') ? 2 : 0), sk[k], 20);
  }
  const mind = {};
  for (const k in MINDS) mind[k] = clamp(8 + prnd() * 4 + ((W.mind && W.mind[k]) || 0) + ((E.mind && E.mind[k]) || 0) + ((B.mind && B.mind[k]) || 0), 1, 20);
  const p = {
    id: S.people.length, name: c.name.trim().slice(0, 40) || 'You', g: c.g, born: y - age, hub, role: c.role, sk, pot, mind, traits: c.traits.slice(0, 3),
    standing: clamp(4 + prnd() * 4 + (W.standing || 0), 0, 100), fame: 0, intl: 0, heat: 0, busy: -1, credits: [], ties: {}, lastWork: -999,
    retired: false, dead: false, awards: [], debut: S.week, player: true
  };
  recalc(p);
  S.people.push(p);
  M.id = p.id;
  M.body = { looks: B.looks, stamina: B.stamina };
  M.cash = usd(W.cash, hub) + (c.arrival === 'bar' ? usd(200, hub) : 0);
  M.allowance = W.allowance ? usd(W.allowance, hub) : 0;
  if (E.debt) { M.debt = usd(E.debt, hub); M.debtPay = Math.max(5, Math.round(M.debt / 180)); }
  if (c.quirk === 'debt') M.shark = usd(6000, hub);
  for (const r of E.mates || []) { const m = youngNPC(hub, r); meet(m.id, 'Classmate', 18 + pri(0, 12)); }
  M.party = makeParty(c);
  diary('You arrive in ' + HUBS[hub].name + ' with ' + fmtCash(M.cash) + (M.debt ? ' and ' + fmtCash(M.debt) + ' of student debt' : '') + '.');
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
  if (!M.known[id]) M.known[id] = { met: S.week, trust: 30, due: 0, owe: 0, tags: [] };
  if (tag && !M.known[id].tags.includes(tag)) M.known[id].tags.push(tag);
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
  g.vet = bestIn(hub, ['dp', 'editor', 'designer'], q => q.standing * .6 + (S.year - q.born > 45 ? 15 : 0) + prnd() * 15);
  g.peer = youngNPC(hub, role === 'producer' ? 'producer' : role);
  for (const k in g) if (!g[k]) g[k] = makePerson(hub, { host: 'producer', star: 'actor', dir: 'director', vet: 'dp', peer: role }[k], {});
  const ids = {};
  for (const k in g) ids[k] = g[k].id;
  if (c.quirk === 'parent') {
    const par = bestIn(hub, [role === 'actor' ? 'actor' : role, 'director', 'producer'], q => q.standing + q.fame * .5 + (S.year - q.born > 46 ? 30 : -50) + prnd() * 10);
    if (par) { ids.parent = par.id; meet(par.id, 'Your parent', 60); trust(par.id, 40); }
  }
  if (c.quirk === 'rival') { const r = youngNPC(hub, role); ids.rival = r.id; meet(r.id, 'Rival', -35); }
  if (c.arrival === 'plusone') { const f = youngNPC(hub, pick2(['ad', 'dp', 'designer', 'editor'])); ids.friend = f.id; meet(f.id, 'Old friend', 35); trust(f.id, 30); }
  if (c.arrival === 'family') meet(ids.host, 'Family friend', 18);
  if (c.arrival === 'bar') meet(ids.host, 'Hired you for the bar', 4);
  return { step: 0, ids, drinks: 0, leads: [], flags: {} };
}
function pick2(a) { return a[Math.floor(prnd() * a.length)]; }

function partyGuest(k) { return P(S.me.party.ids[k]); }
// Every scene is a function of the party so far; it returns text and options. Each option resolves to an outcome.
const PARTY = [
  pt => {
    const M = S.me, h = partyGuest('host');
    const open = { plusone: `Your friend ${P(pt.ids.friend).name} squeezes your arm and vanishes toward the kitchen.`, bar: `You're behind the bar in a borrowed waistcoat. ${h.name}, the host, nods at you without seeing you.`, crash: `Nobody stopped you at the door. Yet. ${h.name}, the host, is scanning the room.`, family: `${h.name}, the host, greets you by name: your family's name, really.` }[M.arrival];
    return { title: 'Ten o’clock, New Year’s Eve', text: `A house in the hills above ${HUBS[M.hub].name}, a pool nobody swims in, and every third person works in film. ${open}`, opts: [
      { k: 'mingle', label: 'Grab a drink and work the room', check: ['cha', 11], hint: 'Charisma' },
      { k: 'food', label: 'Head for the food table, where the nervous people are' },
      { k: 'host', label: `Introduce yourself to ${h.name}`, check: ['cha', M.arrival === 'family' ? 7 : M.arrival === 'crash' ? 14 : 12], hint: 'Charisma' }
    ] };
  },
  pt => {
    const s = partyGuest('star');
    return { title: 'Eleven o’clock', text: `${s.name} is here, the most famous face in the room${s.credits.length ? `, fresh from ${S.films[s.credits[s.credits.length - 1]].title}` : ''}, holding court by the fireplace. There's a gap in the circle.`, opts: [
      { k: 'praise', label: 'Tell them which of their scenes you love, specifically', check: ['tas', 11], hint: 'Taste' },
      { k: 'pitch', label: 'Pitch yourself: you’d be perfect for their next project', check: ['cha', 16], hint: 'Charisma' },
      { k: 'leave', label: 'Leave them be; famous people get enough of this' }
    ] };
  },
  pt => {
    const v = partyGuest('vet');
    return { title: 'Half past eleven, the kitchen', text: `${v.name}, a ${ROLE_LABEL[v.role].toLowerCase()} with ${v.credits.length} credits, is telling war stories about a shoot that went wrong in every possible way. A small crowd is laughing.`, opts: [
      { k: 'listen', label: 'Listen, and ask good questions', check: ['col', 9], hint: 'Collaboration' },
      { k: 'ask', label: 'Wait for a gap and ask if they need anyone on their next job', check: ['cha', 13], hint: 'Charisma' },
      { k: 'story', label: 'Top their story with one of your own', check: ['cha', 15], hint: 'Charisma' }
    ] };
  },
  pt => ({ title: 'Midnight', text: 'The countdown. Champagne everywhere, strangers hugging, someone crying by the pool. The night could go on until dawn.', opts: [
    { k: 'party', label: 'Keep going. It’s New Year’s Eve' },
    { k: 'one', label: 'One glass for the toast, then water' },
    { k: 'home', label: 'Slip out after the toast and get some sleep' }
  ] }),
  pt => {
    const d = partyGuest('dir'), peer = partyGuest('peer');
    const gone = pt.flags.home;
    return gone ? { title: 'Half past twelve, the taxi home', text: `On the way out you pass ${peer.name}, who is your age and wants exactly what you want. They're waiting for a ride too.`, opts: [
      { k: 'share', label: 'Offer to share the taxi', check: ['cha', 8], hint: 'Charisma' },
      { k: 'alone', label: 'Ride home alone and think about the year ahead' }
    ] } : { title: 'Three in the morning', text: `The stragglers are by the pool. ${d.name}, a director, is arguing with ${peer.name} about the best film of the year. They look to you to settle it.`, opts: [
      { k: 'settle', label: 'Make your case for a film you love', check: ['tas', 12], hint: 'Taste' },
      { k: 'joke', label: 'Make them both laugh and change the subject', check: ['cha', 12], hint: 'Charisma' },
      { k: 'side', label: `Back ${d.name}; they have more power` }
    ] };
  }
];
function checkP(stat, dc) {
  const me = ME();
  const v = stat in me.mind ? me.mind[stat] : stat in me.sk ? me.sk[stat] : me.c[stat] ?? 10;
  return clamp(logistic((v - dc) * .45 - (S.me.party && S.me.party.drinks >= 3 ? .4 : 0) - S.me.stress / 120), .03, .97);
}
function roll(stat, dc) { return prnd() < checkP(stat, dc); }

function partyPick(k) {
  const pt = S.me.party, scene = PARTY[pt.step](pt), opt = scene.opts.find(o => o.k === k);
  if (!opt) return false;
  const ok = opt.check ? roll(opt.check[0], opt.check[1]) : true;
  const g = pt.ids, M = S.me;
  let t = '';
  const lead = (id, why) => { if (!pt.leads.includes(id)) pt.leads.push(id); M.refs[id] = (M.refs[id] || 0) + 1; return why; };
  switch (pt.step * 10 + scene.opts.indexOf(opt)) {
    case 0: pt.drinks++; if (ok) { meet(g.host, 'Met at the party', 8); meet(g.dir, 'Met at the party', 6); t = `You float from group to group. ${P(g.host).name} and ${P(g.dir).name} both remember your name.`; } else { meet(g.dir, 'Met at the party', -3); t = `You cut into a conversation at the wrong moment. ${P(g.dir).name} gives you a look and turns away.`; } break;
    case 1: meet(g.peer, 'Met at the party', 14); t = `${P(g.peer).name} is hiding by the dips too. You talk for an hour about the films that made you want to do this.`; break;
    case 2: if (ok) { meet(g.host, 'Met at the party', 12); t = lead(g.host, `${P(g.host).name} likes you. "Call my office after the holiday. We're always short of hands."`); } else { meet(g.host, 'Met at the party', -6); t = M.arrival === 'crash' ? `${P(g.host).name} asks who invited you. You don't have a good answer, and security walks you to the garden.` : `${P(g.host).name} is polite and busy. You lose them to someone more important.`; if (M.arrival === 'crash') pt.flags.thrown = 1; } break;
    case 10: if (ok) { meet(g.star, 'Met at the party', 10); t = `${P(g.star).name} stops performing for a second. "Nobody ever mentions that scene." They ask your name.`; } else { meet(g.star, 'Met at the party', -2); t = `You praise the wrong film. It wasn't theirs. The circle closes.`; } break;
    case 11: if (ok) { meet(g.star, 'Met at the party', 6); t = lead(g.star, `Against all odds, ${P(g.star).name} laughs and tells you to send something to their manager.`); } else { meet(g.star, 'Met at the party', -8); ME().standing = Math.max(0, ME().standing - 1); t = `${P(g.star).name}'s manager steers you away. Somebody films it. By morning it's a story people tell.`; M.stress += 6; } break;
    case 12: t = 'You watch from across the room. Some nights the smartest move is not to make one.'; break;
    case 20: if (ok) { meet(g.vet, 'Met at the party', 12); const me = ME(), cr = MAIN[P(g.vet).role]; for (const s in CRAFTS[cr].subs) me.sk[s] = Math.min(me.pot[s], me.sk[s] + .25); recalc(me); t = `${P(g.vet).name} warms to you and explains how they actually got the shot. You learn more in twenty minutes than in a semester.`; } else { meet(g.vet, 'Met at the party', 3); t = `Your questions are the wrong kind of clever. ${P(g.vet).name} answers politely and moves on.`; } break;
    case 21: if (ok) { meet(g.vet, 'Met at the party', 6); t = lead(g.vet, `${P(g.vet).name} looks you over. "Maybe. Find me in the new year."`); } else { meet(g.vet, 'Met at the party', -5); t = `${P(g.vet).name} has heard that question a thousand times tonight.`; } break;
    case 22: if (ok) { meet(g.vet, 'Met at the party', 10); for (const k in g) if (k !== 'star') meet(g[k], 'Met at the party', 2); t = `Your story kills. People who weren't listening start listening.`; } else { meet(g.vet, 'Met at the party', -10); t = `Your story dies in the silence. ${P(g.vet).name} raises an eyebrow and goes back to theirs.`; } break;
    case 30: pt.drinks += 3; for (const k of ['host', 'peer', 'dir']) if (M.known[g[k]]) addTie(ME(), P(g[k]), 5); t = 'You dance, you hug strangers, you tell someone your dreams by the pool. It is a wonderful night.'; break;
    case 31: pt.drinks++; t = 'One glass, then water. You watch the night go soft around you and keep your head.'; break;
    case 32: pt.flags.home = 1; t = 'You leave as the fireworks start, and you are asleep by one.'; break;
    case 40: if (pt.flags.home) { if (ok) { meet(g.peer, 'Shared a taxi home', 12); t = `${P(g.peer).name} talks the whole way home. You trade numbers and plans.`; } else { meet(g.peer, 'Met at the party', 2); t = 'An awkward ride. You both pretend to look at your phones.'; } } else { if (ok) { meet(g.dir, 'Met at the party', 10); meet(g.peer, 'Met at the party', 4); t = lead(g.dir, `${P(g.dir).name} goes quiet, then grins. "Good answer. What do you do?"`); } else { meet(g.dir, 'Met at the party', -4); meet(g.peer, 'Met at the party', 6); t = `${P(g.dir).name} thinks your pick is sentimental and says so. ${P(g.peer).name} sticks up for you.`; } } break;
    case 41: if (pt.flags.home) t = 'You ride home alone and make a list of everyone you want to work with.'; else if (ok) { meet(g.dir, 'Met at the party', 6); meet(g.peer, 'Met at the party', 8); t = 'Both of them are laughing. The argument is forgotten; you are not.'; } else { meet(g.peer, 'Met at the party', 2); t = 'The joke lands badly. The argument goes on without you.'; } break;
    case 42: meet(g.dir, 'Met at the party', 5); meet(g.peer, 'Met at the party', -8); t = `${P(g.dir).name} approves. ${P(g.peer).name} remembers.`; break;
  }
  pt.log = (pt.log || []).concat([{ title: scene.title, choice: opt.label, ok: opt.check ? ok : null, t }]);
  pt.step++;
  if (pt.flags.thrown && pt.step < 3) pt.step = 3;
  if (pt.step >= PARTY.length) endParty();
  return true;
}
function endParty() {
  const M = S.me, pt = M.party;
  M.energy = clamp(100 - pt.drinks * 14, 25, 100);
  if (pt.drinks >= 4) {   // you don't remember everyone
    const lost = Object.keys(M.known).filter(id => M.known[id].tags.includes('Met at the party') && !pt.leads.includes(+id));
    if (lost.length) { const id = ppick(lost); delete M.known[id]; pt.forgot = +id; }
  }
  pt.done = true;
  inbox('note', 'New Year’s Day', `You wake up ${pt.drinks >= 4 ? 'at noon with a pounding head' : pt.drinks >= 2 ? 'a little slow' : 'clear-headed'}. ${Object.keys(M.known).length} names in your phone${pt.forgot != null ? ', and one you can’t place at all' : ''}. ${pt.leads.length ? `${pt.leads.length === 1 ? 'One person' : pt.leads.length + ' people'} said to get in touch: worth following up while they remember you.` : 'Nobody promised you anything. That is normal.'} Plan your first week below.`);
  for (const id of pt.leads) M.refs[id] = Math.max(M.refs[id] || 0, 1);
  refreshBoard();
}

// ---------------- Inbox ----------------
function inbox(kind, title, text, extra = {}) {
  const it = { id: S.me.seq++, w: S.week, kind, title, text, ...extra };
  S.me.inbox.push(it);
  if (S.me.inbox.length > 140) S.me.inbox = S.me.inbox.filter(x => x.choices && !x.done).concat(S.me.inbox.filter(x => !(x.choices && !x.done)).slice(-110));
  return it;
}
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

// The board: what you hear about this week. Films in your hub post jobs for the stage they are in.
function refreshBoard() {
  const M = S.me, hub = M.hub, out = [];
  const films = S.active.map(i => S.films[i]).filter(f => f.hub === hub && f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 1);
  const busy = new Set(M.jobs.map(j => j.film + ':' + j.k));
  for (const f of films) {
    const opts = POSTS.filter(t => t.st.includes(f.stage) && headOf(f, t.head) !== null && !busy.has(f.id + ':' + t.k));
    const n = Math.min(opts.length, prnd() < .5 ? 1 : prnd() < .6 ? 2 : 0);
    const chosen = new Set();
    // a contact in charge of a department makes their own job easier to hear about
    for (const t of opts) { const h = headOf(f, t.head); if (M.known[h] && opinion(h) > 15 && prnd() < .5) chosen.add(t); }
    const want = Math.min(opts.length, chosen.size + n);
    while (chosen.size < want) chosen.add(ppick(opts));
    for (const t of chosen) out.push(makePost(t, f));
  }
  // referrals first, then a mix: no more than two postings for the same job
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(prnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  out.sort((a, b) => (b.ref ? 1 : 0) - (a.ref ? 1 : 0));
  const per = {}, film = out.filter(p => (per[p.k] = (per[p.k] || 0) + 1) <= 2).slice(0, 14);
  const m = dateOf(S.week).getUTCMonth();
  const odd = ODD_JOBS.filter(t => (t.k !== 'screener' || (m >= 7 && m <= 10)) && !M.jobs.some(j => j.k === t.k)).filter(() => prnd() < .7).map(t => makePost(t, null));
  M.board = film.concat(odd);
}
function makePost(t, f) {
  const head = f ? headOf(f, t.head) : null;
  const weeks = t.weeks || (f ? Math.max(1, Math.min(14, f.stageEnd - S.week + (t.st.length > 1 && f.stage === t.st[0] ? f.dur[f.stage + 1] : 0))) : 4);
  const hubComp = clamp(hubProd(S.me.hub, S.year) / 40, .3, 1.4);
  const comp = !f ? .1 : (t.tier === 2 ? .8 : .6) * hubComp + (f.tier === 1 ? .6 : f.tier === 3 ? -.2 : 0);
  return { id: S.me.seq++, k: t.k, odd: !f, t: t.t, jid: t.jid, tier: t.tier, film: f ? f.id : null, head, days: t.days, weeks, rate: usd(t.rate), comp, ref: head !== null && (S.me.refs[head] || 0) > 0, w: S.week };
}
function tmplOf(post) { return post.odd ? ODD_BY[post.k] : POST_BY[post.k]; }

// How likely an application is to land, and why: a list of named factors in logit units.
function hireFactors(post) {
  const M = S.me, me = ME(), t = tmplOf(post), F = [];
  F.push(['Job level', post.odd ? 1 : post.tier === 1 ? .25 : -1.2]);
  const sc = subScore(t), req = postReq(t);
  F.push(['Your skills for it', post.tier === 1 ? clamp((sc - Math.max(req, 6)) * .15, -1.5, .8) : clamp((sc - Math.max(req, 8)) * .3, -2.5, 1.4)]);
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
  F.push(['Competition', -post.comp]);
  F.push(['First impressions', (me.mind.cha - 10) * .05]);
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
  rest: { label: 'Rest', e: -20, d: 'Sleep, see friends outside the business. Restores energy, lowers stress.' }
};
const SLOT_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Weekend'];
function jobDays() { return S.me.jobs.reduce((s, j) => s + j.days, 0); }
// The plan as it will actually run: job days fill the weekdays first.
function effectivePlan() {
  const M = S.me, out = M.plan.slice();
  let need = jobDays();
  for (let i = 0; i < 5 && need > 0; i++, need--) out[i] = 'work';
  return out;
}
function appSlots() { return effectivePlan().filter(a => a === 'hunt').length * 3; }

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

function endWeek(a) {
  const M = S.me, me = ME();
  M.plan = a.plan.slice(0, 6); M.train = a.train || M.train; M.catchWith = a.catchWith ?? null;
  const burnt = M.burnout > 0;
  const plan = burnt ? ['rest', 'rest', 'rest', 'rest', 'rest', 'rest'] : effectivePlan();
  if (burnt) { for (const j of M.jobs) { j.missed = (j.missed || 0) + 1; if (j.head !== null) addTie(me, P(j.head), -4); } M.burnout--; }
  const L = [];   // the week's diary
  const rate = learnRate(me);
  let energy = M.energy, cashIn = 0, cashOut = 0, stress = 0;
  const gains = {};
  const gain = (k, v) => { const g = growSub(me, k, v * rate); if (g) gains[k] = (gains[k] || 0) + g; };
  let hunted = 0, workDone = false;
  for (const act of plan) {
    const A = ACTIVITIES[act];
    energy -= A.e;
    if (A.cost) cashOut += usd(A.cost);
    if (energy < 15 && A.e > 0) stress += 4;
    switch (act) {
      case 'hunt': hunted++; break;
      case 'network': networkDay(L); break;
      case 'catchup': catchupDay(L); break;
      case 'write': M.spec.pages += 4 + Math.round(me.mind.eth / 4 + prnd() * 4); for (const k of ['struc', 'dial', 'char', 'orig']) gain(k, .016); break;
      case 'train': for (const k in CRAFTS[M.train].subs) gain(k, .02); break;
      case 'hustle': cashIn += usd(150); stress += 1; break;
      case 'rest': stress -= 8; break;
      case 'work': workDone = true; break;
    }
  }
  if (M.spec.pages >= 110) { M.spec.pages -= 110; M.spec.drafts++; L.push(`You finish draft ${M.spec.drafts} of a spec script. It goes in the drawer for when someone asks to read something.`); }
  // jobs
  for (const j of M.jobs.slice()) {
    if (burnt) continue;
    const t = tmplOf(j);
    const days = j.days;
    const pay = j.rate * days;
    cashIn += pay; M.stats.earned += pay;
    M.stats.weeks++;
    j.done++;
    me.lastWork = S.week;
    const head = j.head !== null ? P(j.head) : null;
    const teach = head ? clamp(1 + (avg(t.subs.map(s => head.sk[s] ?? head.mind[s] ?? 10)) - subScore(t)) / 14, .7, 1.7) : 1;
    for (const s of t.subs) gain(s, .04 * days / 5 * teach * (j.shadow ? 1.8 : 1));
    j.shadow = 0;
    if (head) { meet(head.id, null); addTie(me, head, 1.5 + (me.mind.col - 10) * .15 + traitSum(me, 'tie') * .2); }
    for (const id of j.mates || []) addTie(me, P(id), .8);
    if (j.odd && j.k === 'rental' && prnd() < .35) { const crew = bestIn(M.hub, ['dp', 'sound', 'designer'], q => q.standing * .3 + prnd() * 30); if (crew) { meet(crew.id, 'Met at the rental house', 6); L.push(`At the rental house you get talking to ${crew.name}, a ${ROLE_LABEL[crew.role].toLowerCase()}.`); } }
    if (j.done >= j.weeks || (j.film !== null && jobOver(j))) finishJob(j, L);
  }
  // applications
  const apps = (a.apps || []).slice(0, hunted * 3);
  const offers = [], noes = [];
  for (const pid of apps) {
    const post = M.board.find(p => p.id === pid);
    if (!post) continue;
    M.stats.apps++;
    if (prnd() < hireOdds(post)) offers.push(post); else noes.push(post);
    if (post.head !== null && M.refs[post.head]) M.refs[post.head] = Math.max(0, M.refs[post.head] - 1);
  }
  if (offers.length) { M.stats.offers += offers.length; for (const o of offers) inbox('offer', `Offer: ${o.t}`, offerText(o), { post: o, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] }); }
  // a rival in the same line of work sometimes gets there first
  const rival = Object.keys(M.known).map(Number).find(id => M.known[id].tags.includes('Rival') && !P(id).dead && P(id).hub === M.hub);
  if (rival !== undefined && noes.length && prnd() < .2) { const p = ppick(noes); addTie(me, P(rival), -3); inbox('note', `${P(rival).name} again`, `You hear who got the ${p.t.toLowerCase()} job you wanted${p.film !== null ? ' on ' + S.films[p.film].title : ''}: ${P(rival).name}.`, { person: rival }); stress += 3; }
  if (noes.length) { stress += 2 * noes.length; inbox('note', noes.length === 1 ? 'No luck' : `${noes.length} rejections`, `${noes.map(p => `${p.t}${p.film !== null ? ' on ' + S.films[p.film].title : ''}`).join('; ')}: ${noes.length === 1 ? 'they went with someone else' : 'they all went with someone else'}. ${noes.length > 2 ? 'It happens to everyone. It still stings.' : ''}`); }
  // living
  const life = ORIGIN.life[M.life];
  cashOut += usd(life.rent);
  if (M.debt > 0) { const p = Math.min(M.debt, M.debtPay); M.debt -= p; cashOut += p; }
  if (M.shark > 0) M.shark = Math.round(M.shark * 1.01);
  cashIn += M.allowance;
  M.cash += cashIn - cashOut;
  if (M.cash < 0) { M.broke++; stress += 6; } else M.broke = 0;
  energy += 28 + (M.body.stamina - 10) * 1.5 + life.rest;
  stress += life.stress - 3 + (energy < 0 ? 8 : 0);
  M.energy = clamp(energy, 0, 100);
  M.stress = clamp(M.stress + stress * (has(me, 'Volatile') ? 1.2 : 1) * (1.1 - me.mind.com / 40), 0, 100);
  recalc(me);
  const gl = Object.entries(gains).filter(([, v]) => v >= .04).sort((x, y) => y[1] - x[1]).slice(0, 3);
  L.unshift(`Money: ${fmtCash(cashIn)} in, ${fmtCash(cashOut)} out.${gl.length ? ' You got better at ' + gl.map(([k]) => (CRAFTS[SUB2C[k]] ? CRAFTS[SUB2C[k]].subs[k] : MINDS[k]).toLowerCase()).join(', ') + '.' : ''}`);
  for (const t of L) diary(t);
  // the world moves on
  const before = S.news.length;
  tick();
  M.week = S.week;
  afterTick(S.news.slice(before));
}
function jobOver(j) { const f = S.films[j.film]; return f.stage < 0 || f.stage >= 4 || !POST_BY[j.k].st.includes(f.stage) && f.stage > Math.max(...POST_BY[j.k].st); }
function offerText(o) {
  const f = o.film !== null ? S.films[o.film] : null, t = tmplOf(o);
  return `${f ? `${f.title} (${f.genre.toLowerCase()}, ${f.co === null ? 'independent' : S.companies[f.co].name}) wants you as ${o.t.toLowerCase()}` : `${o.t}: they can take you on`}. ${o.days} day${o.days > 1 ? 's' : ''} a week for about ${o.weeks} week${o.weeks > 1 ? 's' : ''}, ${o.rate ? fmtCash(o.rate) + ' a day' : 'unpaid'}.${o.head !== null ? ` You'd answer to ${P(o.head).name}.` : ''}${t.cr ? ' It comes with a screen credit.' : ''}`;
}
function takeJob(post) {
  const M = S.me, f = post.film !== null ? S.films[post.film] : null;
  const mates = f ? [...slotsOf(f)].filter(([id, s]) => id !== post.head && closeness(POST_BY[post.k].head === 'ad' ? 'ad' : POST_BY[post.k].head, s) >= .75).map(([id]) => id).slice(0, 3) : [];
  const j = { ...post, done: 0, mates, started: S.week };
  M.jobs.push(j);
  if (post.head !== null) meet(post.head, 'Hired you');
  for (const id of mates) meet(id, 'Worked together');
  diary(`You start as ${post.t.toLowerCase()}${f ? ' on ' + f.title : ''}.`);
}
function finishJob(j, L, quit) {
  const M = S.me, me = ME();
  M.jobs = M.jobs.filter(x => x !== j);
  const f = j.film !== null ? S.films[j.film] : null;
  const t = tmplOf(j);
  const credited = !quit && f && t.cr && j.done >= Math.min(2, j.weeks) && f.stage >= 0;
  if (credited) { f.xc = f.xc || {}; f.xc[me.id] = j.t; }
  M.past.push({ k: j.k, t: j.t, film: j.film, head: j.head, from: j.started, to: S.week, credited, quit: !!quit });
  if (j.head !== null && !quit) {
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
  const n = ok ? 2 : 1;
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
  addTie(me, q, ok ? 6 : 1); k.trust = clamp(k.trust + (ok ? 4 : 1), 0, 100);
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
  for (const j of M.jobs) if (j.done > 0 && prnd() < .55) { const sc = pickScene(j); if (sc) inbox('scene', sc.title, sc.text, { job: j.id, scene: sc.id, ctx: sc.ctx, choices: sc.opts }); }
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
  const recent = new Set(S.me.inbox.filter(x => x.kind === 'scene' && S.week - x.w < 8).map(x => x.scene));
  const L = SCENES.filter(s => (!s.jobs || s.jobs.includes(j.k)) && !recent.has(s.id) && !(j.film === null && /\{(film|dir|lead)\}/.test(s.text + JSON.stringify(s.opts))));
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
function fillScene(t, ctx) { return t.replace(/\{(\w+)\}/g, (_, k) => k === 'film' ? (ctx.film !== null ? S.films[ctx.film].title : 'the job') : ctx[k] !== undefined && ctx[k] !== null && typeof ctx[k] === 'number' ? P(ctx[k]).name : 'someone'); }

function sceneResolve(it, k) {
  const s = SCENES.find(x => x.id === it.scene), o = s.opts.find(x => x.k === k), M = S.me, me = ME();
  const ok = o.check ? roll(o.check[0], o.check[1]) : true;
  const fx = ok ? o.ok : (o.bad || o.ok);
  const ctx = it.ctx, who = r => r === 'mates' ? ctx.mates : ctx[r] !== null && ctx[r] !== undefined ? [ctx[r]] : [];
  for (const r in fx.tie || {}) for (const id of who(r)) { meet(id, null); addTie(me, P(id), fx.tie[r]); }
  for (const r in fx.trust || {}) for (const id of who(r)) trust(id, fx.trust[r]);
  for (const r in fx.tag || {}) for (const id of who(r)) meet(id, fx.tag[r]);
  if (fx.due) for (const id of who(fx.due)) { meet(id, null); M.known[id].due++; }
  if (fx.stand) me.standing = clamp(me.standing + fx.stand, 0, 100);
  if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100);
  if (fx.energy) M.energy = clamp(M.energy + fx.energy, 0, 100);
  if (fx.cash) M.cash += usd(fx.cash);
  for (const x in fx.xp || {}) growSub(me, x, fx.xp[x]);
  const job = M.jobs.find(j => j.id === it.job);
  if (fx.shadow && job) job.shadow = 1;
  let t = fillScene(ok ? o.t : (o.tb || o.t), ctx);
  if (fx.risk && prnd() < fx.risk) { M.energy = Math.max(0, M.energy - 25); M.stress = clamp(M.stress + 8, 0, 100); t += ' It comes back to bite you: a rough few days.'; }
  if (fx.fire && job && prnd() < fx.fire) { finishJob(job, null, true); t += ' You are let go.'; me.standing = Math.max(0, me.standing - 1); }
  recalc(me);
  it.result = { ok: o.check ? ok : null, t };
}

function resolvePick(it, k) {
  const M = S.me, me = ME(), c = it.choices.find(x => x.k === k);
  if (!c || c.dis) return false;
  if (it.kind === 'offer') {
    if (k === 'yes') {
      if (jobDays() + it.post.days > 5) { it.result = { t: 'You can’t fit it around the work you already have.' }; it.done = true; return true; }
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
    if (k === 'down') { M.life = M.life === 'own' ? 'shared' : 'couch'; it.result = { t: `You move: ${ORIGIN.life[M.life].label.toLowerCase()} from now on.` }; }
    else if (k === 'borrow') { const f = bestFriend(); if (f === null) return false; const amt = Math.max(usd(800), -M.cash + usd(300)); M.cash += amt; M.known[f].owe++; addTie(me, P(f), -3); it.result = { t: `${P(f).name} lends you ${fmtCash(amt)}. You owe them, in every sense.` }; }
    else { M.over = true; me.retired = true; me.retY = S.year; it.result = { t: 'You pack up and go home. The business goes on without you.' }; }
  } else if (it.kind === 'secret') {
    const who = it.person;
    if (k === 'pay') { M.cash -= usd(1500); M.known[who].tags.push('Knows your secret'); it.result = { t: 'They take the money. You will always wonder if it was enough.' }; }
    else { const ok = roll(c.check[0], c.check[1]); if (ok) { addTie(me, P(who), k === 'confide' ? 10 : 0); M.known[who].tags.push(k === 'confide' ? 'Keeps your secret' : 'Believed your denial'); it.result = { ok, t: k === 'confide' ? 'They listen, and they keep it. A strange kind of bond.' : 'They seem to believe you.' }; } else { me.standing = Math.max(0, me.standing - 4); me.fame = clamp(me.fame + 2, 0, 100); addTie(me, P(who), -15); it.result = { ok, t: 'It gets out anyway. For a few weeks people look at you differently.' }; } }
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
    case 'party': return partyPick(a.k);
    case 'pick': { const it = S.me.inbox.find(x => x.id === a.id); return it && !it.done ? resolvePick(it, a.k) : false; }
    case 'end': if (pending().length || !S.me.party.done || S.me.over) return false; endWeek(a); return true;
    case 'quit': { const j = S.me.jobs.find(x => x.id === a.id); if (!j) return false; if (j.head !== null) addTie(ME(), P(j.head), -6); finishJob(j, null, true); refreshBoard(); return true; }
    case 'life': if (!ORIGIN.life[a.v]) return false; S.me.life = a.v; return true;
    case 'favour': return askFavour(a.id) && (refreshBoard(), true);
  }
  return false;
}
