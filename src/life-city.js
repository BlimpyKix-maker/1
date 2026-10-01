// ---------------- The city: where you live, how you get around, where your evenings go ----------------
// Housing is a set of listings by neighbourhood, each with its own rent, rest, room and character; vehicles change
// your mornings; the city's venues and this week's listings are things to spend evenings and money on.
const VEHICLES = {
  transit: { label: 'Public transport', icon: '🚌', price: 0, upkeep: 12, e: 4, d: 'Buses and trains. Cheap, slow, full of strangers.', commute: ['The bus, a podcast, a seat if you\'re lucky.', 'A packed train. You read a script standing up.', 'Two buses and a walk. You know every stop now.'] },
  bike: { label: 'A second-hand bike', icon: '🚲', price: 280, upkeep: 2, e: 6, stress: -1, d: 'Free, fast in traffic, good for the head. Arrive sweaty.', commute: ['You weave through traffic, wind in your face.', 'Uphill both ways, somehow.', 'A clear head by the time you lock up.'] },
  scooter: { label: 'A scooter', icon: '🛵', price: 1400, upkeep: 15, e: 2, d: 'Nippy and cheap to run. Terrifying in the rain.', commute: ['You zip past a traffic jam, grinning.', 'Rain. Of course it rains.', 'You park right outside. Small luxuries.'] },
  car: { label: 'An old hatchback', icon: '🚗', price: 3600, upkeep: 55, e: 1, standing: 0, d: 'Gets you to any location, any hour. Sometimes.', commute: ['The radio works, the air conditioning doesn\'t.', 'You sit in traffic and run your lines.', 'It starts on the third try. A good omen.'], fx: { reach: 1 } },
  van: { label: 'A van', icon: '🚐', price: 9500, upkeep: 70, e: 1, d: 'Room for kit. Crews love a person with a van.', commute: ['You load the gear in the dark and head out.', 'Someone needs a lift and some cases moved. You\'re popular.', 'The van smells of coffee and gaffer tape.'], fx: { reach: 1, crew: 1 } },
  sleek: { label: 'Something sleek', icon: '🚘', price: 38000, upkeep: 160, e: 0, standing: 3, d: 'People notice what you drive. Some of them are hiring.', commute: ['Leather seats and silence.', 'The valet knows your name.', 'You arrive looking like you belong.'], fx: { reach: 1, status: 1 } }
};
// Places to live. Couch, shared and own are the starting three; the rest come with money.
Object.assign(ORIGIN.life, {
  studio: { label: 'Studio flat', d: 'One room, all yours. A kitchen in a cupboard.', rent: 640, rest: 4, stress: -1 },
  loft: { label: 'Loft in a converted warehouse', d: 'High ceilings, cold winters, room for a workshop.', rent: 1250, rest: 6, stress: -2 },
  house: { label: 'A house with a garden', d: 'Quiet, a room for every purpose, neighbours who wave.', rent: 2100, rest: 9, stress: -4 }
});
Object.assign(HOME_SPOTS, {
  studio: HOME_SPOTS.shared.concat([{ id: 'floorC', kind: 'floor', x: 256, y: 168 }]),
  loft: HOME_SPOTS.own.concat([{ id: 'wallC', kind: 'wall', x: 282, y: 20 }]),
  house: HOME_SPOTS.own.concat([{ id: 'wallC', kind: 'wall', x: 282, y: 20 }])
});
const HOOD_KINDS = [
  { k: 'arts', name: 'the arts district', d: 'Studios, galleries and cheap rent for now.', fx: { meet: 'creative', tas: .01 } },
  { k: 'studio', name: 'by the studios', d: 'Ten minutes from the backlots.', fx: { commute: -2, meet: 'crew' } },
  { k: 'quiet', name: 'the quiet suburbs', d: 'Long commute, deep sleep.', fx: { commute: 3, rest: 3 } },
  { k: 'downtown', name: 'downtown', d: 'Noise, bars, everyone you need within a mile.', fx: { rest: -2, meet: 'industry' } },
  { k: 'beach', name: 'by the water', d: 'A walk by the sea fixes most things.', fx: { stress: -1 } }
];
// This hub's listings, the same every visit: six homes across the range, each in a named neighbourhood.
function listingsIn(hub) {
  const r = hashRand([...hub].reduce((a, c) => a * 31 + c.charCodeAt(0), 3) >>> 0), places = HUBS[hub].places || ['the Heights', 'the Flats', 'Old Town'];
  return ['couch', 'shared', 'studio', 'own', 'loft', 'house'].map((life, i) => { const hood = HOOD_KINDS[Math.floor(r() * HOOD_KINDS.length)], place = places[Math.floor(r() * places.length)];
    return { i, life, hood: hood.k, where: `${place}, ${hood.name}`, rent: Math.round(ORIGIN.life[life].rent * (.85 + r() * .35) / 10) * 10 }; });
}
function hoodFx() { const M = S.me; return (HOOD_KINDS.find(h => h.k === M.hood) || { fx: {} }).fx; }
function moveHome(a) {
  const M = S.me, L = listingsIn(M.hub)[a.i];
  if (!L || (M.life === L.life && M.hoodWhere === L.where)) return false;
  const deposit = usd(L.rent) * 2;
  if (L.life !== 'couch' && M.cash < deposit) return false;
  if (L.life !== 'couch') M.cash -= deposit;
  M.life = L.life; M.hood = L.hood; M.hoodWhere = L.where; M.rentOverride = L.rent;
  M.home.layout = {};
  inbox('note', 'Moving day', `${ORIGIN.life[L.life].label} in ${L.where}. ${L.life === 'couch' ? 'Your things fit in two bags.' : `Two weeks' rent as a deposit, a borrowed van, and a pizza on the floor.`}`);
  (M.milestones = M.milestones || []).push({ w: S.week, t: `Moved to ${ORIGIN.life[L.life].label.toLowerCase()} in ${L.where}` });
  return true;
}
function buyVehicle(a) {
  const M = S.me, V = VEHICLES[a.v];
  if (!V || M.vehicle === a.v || M.cash < usd(V.price)) return false;
  const old = VEHICLES[M.vehicle || 'transit'];
  M.cash -= usd(V.price) - Math.round(usd(old.price) * .4);   // trade in the old one
  M.vehicle = a.v;
  if (V.standing) ME().standing = clamp(ME().standing + V.standing, 0, 100);
  inbox('note', 'New wheels', `${V.label}. ${V.d}`);
  (M.milestones = M.milestones || []).push({ w: S.week, t: `Got ${V.label.toLowerCase()}` });
  return true;
}
// ---- venues and this week's listings ----
const VENUES = {
  rep: { label: 'Repertory cinema', icon: '🎬', e: 4, stress: -3, cost: 14, d: 'Old films on a big screen. Taste, and other cinephiles.', grow: { tas: .04 } },
  bar: { label: 'The industry bar', icon: '🍸', e: 10, stress: -2, cost: 30, d: 'Where crews drink after wrap. Good for contacts.', meet: .5 },
  jazz: { label: 'Jazz club', icon: '🎷', e: 8, stress: -6, cost: 25, d: 'Live music till late. Composers and night owls.', grow: { theme: .02, tas: .01 } },
  gallery: { label: 'Gallery opening', icon: '🖼️', e: 6, stress: -3, cost: 0, d: 'Free wine, strange art, designers and directors.', grow: { vis: .04 }, meet: .25 },
  openmic: { label: 'Comedy open mic', icon: '🎤', e: 9, stress: 2, cost: 0, d: 'Five minutes on stage. Terrifying, educational.', check: ['cha', 12], grow: { comic: .06, impro: .04 } },
  theatre: { label: 'The theatre', icon: '🎭', e: 5, stress: -3, cost: 45, d: 'Actors without a safety net. You learn what presence is.', grow: { range: .04, pres: .03 } },
  gym: { label: 'Gym and a swim', icon: '🏊', e: 6, stress: -6, cost: 10, d: 'Body first. Sleep better, look better.', body: .05 }
};
function cityEveningOpts() { return Object.entries(VENUES).map(([k, V]) => ['v:' + k, `${V.label}${V.cost ? ' ($' + usd(V.cost) + ')' : ''}`]); }
function venueAsEvening(k) { const V = VENUES[(k || '').slice(2)]; return V ? Object.assign({ venue: (k || '').slice(2) }, V) : null; }
// What's on this week: a retrospective of a real director from the catalogue, a Q&A, an opening. Same for everyone.
function whatsOn() {
  const M = S.me, r = hashRand(S.week * 7 + [...M.hub].length), dirs = Object.values(S.cat.src.people).filter(p => p.r === 'director' && p.lv >= 3 && p.b < S.year - 30);
  const d = dirs.length ? dirs[Math.floor(r() * dirs.length)] : null;
  const films = d ? Object.values(S.cat.allFilms).filter(f => f.dir.includes(d.id) && f.y < S.year).slice(0, 3).map(f => f.t) : [];
  return [d && films.length ? { venue: 'rep', title: `A season of ${d.n}`, d: `${films.join(', ')}${films.length ? ' on the big screen.' : ''}` } : null,
    { venue: 'bar', title: 'Wrap party for a local shoot', d: 'Half the town\'s crew will be there.' },
    { venue: 'gallery', title: 'Opening: production design sketches', d: 'Original artwork from films you know.' }].filter(Boolean);
}
function venueEvening(E) {
  const M = S.me, me = ME(), V = VENUES[E.venue], out = [];
  for (const k in V.grow || {}) { if (k === 'theme') { const v = voiceOf(), t = ppick(THEME_KEYS); v[t] = (v[t] || 0) + .5; } else weekGain(k, V.grow[k]); }
  if (V.body) M.body.stamina = clamp(M.body.stamina + V.body, 1, 20);
  const on = whatsOn().find(x => x.venue === E.venue);
  if (on) out.push(`${on.title}. ${on.d}`); else out.push(V.d);
  if (V.check) { const ok = roll(V.check[0], V.check[1]); out.push(ok ? 'Laughs. Real ones. You float home.' : 'Silence, then a cough. You\'ll be back.'); if (ok) me.standing = clamp(me.standing + .1, 0, 100); }
  const meetP = (V.meet || 0) + (on ? .25 : 0) + (hoodFx().meet ? .1 : 0);
  if (prnd() < meetP) { const q = bestIn(M.hub, E.venue === 'jazz' ? ['composer', 'sound'] : E.venue === 'gallery' ? ['designer', 'director', 'costume'] : E.venue === 'rep' ? ['director', 'writer', 'editor'] : ROLES, q => -Math.abs(q.standing - me.standing - 12) + tasteMatch(q) * 8 + prnd() * 25);
    if (q) { meet(q.id, 'Met out', 4 + tasteMatch(q) * 3); out.push(`You get talking to ${q.name}, ${(q.occ || occupationOf(q)).toLowerCase()}${tasteMatch(q) > .5 ? '. You love the same films' : ''}.`); } }
  return out;
}
// Mornings on the road: the occasional surprise, depending on how you travel.
const ROAD_SCENES = [
  { id: 'lr_breakdown', v: ['car', 'van'], title: 'It won\'t start', text: 'The engine coughs and dies. Call time is in forty minutes.', opts: [
    { k: 'fix', label: 'Pop the bonnet and have a go', check: ['prac', 12], ok: {}, bad: { cash: -180, stress: 5 }, t: 'A loose lead. You arrive with grease on your hands and a story.', tb: 'A tow truck, a bill, and a very late arrival.' },
    { k: 'cab', label: 'Call a cab', ok: { cash: -45 }, t: 'Expensive, but on time.' }] },
  { id: 'lr_bus', v: ['transit'], title: 'The seat next to you', text: 'The person next to you on the bus is reading a screenplay. With notes.', opts: [
    { k: 'ask', label: 'Ask what they\'re reading', check: ['cha', 11], ok: { meet: 1 }, bad: {}, t: 'An assistant at a production company. Small world.', tb: 'Headphones go in. Fair enough.' },
    { k: 'peek', label: 'Read over their shoulder', ok: { xp: { tas: .05 } }, t: 'Page 40 is very good.' }] },
  { id: 'lr_rain', v: ['bike', 'scooter'], title: 'Downpour', text: 'The sky opens halfway there.', opts: [
    { k: 'ride', label: 'Ride it out', ok: { energy: -6, stress: 2 }, t: 'You arrive soaked. Someone lends you a crew hoodie.' },
    { k: 'shelter', label: 'Wait under a bridge', check: ['com', 10], ok: {}, bad: { stress: 3 }, t: 'Ten minutes, then sun. Lucky.', tb: 'Twenty minutes late anyway.' }] }
];
for (const s of ROAD_SCENES) SCENES.push(Object.assign({ event: 1, jobs: [] }, s));
function roadEvent() {
  const M = S.me, v = M.vehicle || 'transit', L = ROAD_SCENES.filter(s => s.v.includes(v));
  if (!L.length || prnd() > .05) return;
  const s = ppick(L);
  inbox('scene', s.title, s.text, { scene: s.id, ctx: { head: null, film: null, mates: [] }, choices: s.opts.map(o => ({ k: o.k, label: o.label, check: o.check })) });
}
