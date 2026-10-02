// ---------------- The city, wider ----------------
// Many more places to spend an evening, sorted by kind; a what's-on built from what is actually happening in your
// city this week (films in post, directors in town, the trends); and weekend trips: festivals around the world and
// city breaks to the other film capitals, where you meet people you'd never meet at home.
Object.assign(VENUES.rep, { cat: 'culture' }); Object.assign(VENUES.bar, { cat: 'nightlife' }); Object.assign(VENUES.jazz, { cat: 'nightlife' }); Object.assign(VENUES.gallery, { cat: 'culture' }); Object.assign(VENUES.openmic, { cat: 'nightlife' }); Object.assign(VENUES.theatre, { cat: 'culture' }); Object.assign(VENUES.gym, { cat: 'wellness' });
Object.assign(VENUES, {
  quiz: { cat: 'nightlife', label: 'Film quiz at the pub', icon: '🧠', e: 5, stress: -3, cost: 8, d: 'Teams of cinephiles and one person who only knows action films.', check: ['tas', 11], grow: { tas: .03 }, meet: .2 },
  karaoke: { cat: 'nightlife', label: 'Karaoke bar', icon: '🎙️', e: 10, stress: -7, cost: 20, d: 'Power ballads and poor decisions.', grow: { voice: .03 }, meet: .2 },
  club: { cat: 'nightlife', label: 'Late club', icon: '🪩', e: 16, stress: -8, cost: 35, d: 'Loud, late, full of people who work in music videos.', meet: .35 },
  supper: { cat: 'nightlife', label: 'Supper club', icon: '🍽️', e: 6, stress: -4, cost: 55, d: 'Long tables, strangers, very good wine.', meet: .35 },
  rooftop: { cat: 'culture', label: 'Rooftop screening', icon: '🌃', e: 5, stress: -4, cost: 18, d: 'A classic under the stars, blankets provided.', grow: { tas: .02 }, meet: .25 },
  concert: { cat: 'culture', label: 'A big concert', icon: '🎸', e: 12, stress: -6, cost: 70, d: 'Twenty thousand people singing the same song.', grow: { theme: .02 } },
  opera: { cat: 'culture', label: 'The opera', icon: '🎼', e: 6, stress: -3, cost: 80, d: 'Three hours, one death, extraordinary music.', grow: { score: .04, orch: .03 } },
  museum: { cat: 'culture', label: 'Late-night museum', icon: '🏛️', e: 5, stress: -4, cost: 12, d: 'History after hours. Good for period work.', grow: { period: .04, world: .03 } },
  panel: { cat: 'industry', label: 'Industry panel', icon: '🎟️', e: 6, stress: 0, cost: 20, d: 'Producers explain the business. Free business cards.', grow: { pack: .03, fin: .02 }, meet: .45 },
  reading: { cat: 'industry', label: 'Script reading night', icon: '📜', e: 6, stress: -1, cost: 5, d: 'Actors read new scripts aloud. Writers sweat at the back.', grow: { dial: .04, struc: .03 }, meet: .3 },
  crash: { cat: 'industry', label: 'Crash a premiere after-party', icon: '🎞️', e: 10, stress: 2, cost: 0, d: 'Confidence is a dress code.', check: ['cha', 14], meet: .6 },
  volunteer: { cat: 'industry', label: 'Volunteer at a film school', icon: '🙋', e: 8, stress: -2, cost: 0, d: 'Help students on their shoots. Teaching teaches you.', grow: { col: .04 }, meet: .3 },
  market: { cat: 'outdoors', label: 'Night market', icon: '🏮', e: 6, stress: -5, cost: 15, d: 'Street food, lanterns, people-watching.', grow: { vis: .02 } },
  hike: { cat: 'outdoors', label: 'Sunset hike', icon: '🥾', e: 8, stress: -8, cost: 0, d: 'Up the hill, phone off, city below.', body: .05 },
  picnic: { cat: 'outdoors', label: 'Picnic in the park', icon: '🧺', e: 3, stress: -5, cost: 10, d: 'Cheap, slow and exactly what you needed.' },
  match: { cat: 'outdoors', label: 'Football match', icon: '⚽', e: 8, stress: -5, cost: 40, d: 'Forty thousand people and one ball.', meet: .2 },
  yoga: { cat: 'wellness', label: 'Yoga class', icon: '🧘', e: 4, stress: -8, cost: 15, d: 'Breathe. Your shoulders live somewhere near your ears.', body: .03 },
  spa: { cat: 'wellness', label: 'Spa evening', icon: '💆', e: -4, stress: -10, cost: 60, d: 'Steam, silence, someone else handling things.' },
  dance: { cat: 'wellness', label: 'Dance class', icon: '💃', e: 10, stress: -6, cost: 15, d: 'Learn to move. Actors and stunt people swear by it.', grow: { phys: .04 } }
});
const VENUE_CATS = { all: 'Everything', culture: 'Culture', nightlife: 'Nightlife', industry: 'Industry', outdoors: 'Outdoors', wellness: 'Wellness' };
const BANDS = ['The Late Edits', 'Second Unit', 'Magic Hour', 'Dolly Zoom', 'The Room Tones', 'Continuity Error', 'Golden Hour Club', 'Craft Services'];
// This week's listings: built from the world, the same for everyone in the city that week.
function whatsOnMore() {
  const M = S.me, r = hashRand(S.week * 13 + M.hub.length * 7), pk = a => a[Math.floor(r() * a.length)], out = [];
  const post = S.active.map(i => S.films[i]).filter(f => f.hub === M.hub && f.stage === 3), opened = S.films.filter(f => f.hub === M.hub && f.rel !== null && S.week - f.rel < 2);
  const dirs = S.pool[M.hub].director.map(P).filter(p => !p.dead && !p.retired && p.standing > 40);
  const writers = S.pool[M.hub].writer.map(P).filter(p => !p.dead && !p.retired);
  if (post.length) out.push({ venue: 'rooftop', title: `Sneak preview: ${pk(post).title}`, d: 'A test screening. Cards at the door; the director is watching the audience.' });
  if (dirs.length) { const d = pk(dirs); out.push({ venue: 'rep', title: `In conversation: ${d.name}`, d: 'A career retrospective and a long Q&A.', meetId: d.id }); }
  if (opened.length) out.push({ venue: 'crash', title: `After-party: ${pk(opened).title}`, d: 'The premiere is invitation-only. The after-party is less careful.' });
  if (writers.length) out.push({ venue: 'reading', title: `Reading: a new script by ${pk(writers).name}`, d: 'Actors read it cold. You can hear where it works.' });
  out.push({ venue: 'quiz', title: `Film quiz: the ${pk([1950, 1960, 1970, 1980, 1990, 2000]) }s`, d: 'Winners get a bottle of something and eternal glory.' });
  out.push({ venue: 'concert', title: `Live: ${pk(BANDS)}`, d: 'Everyone in town under thirty-five will be there.' });
  out.push({ venue: 'panel', title: pk(['Panel: "Is the theatrical window dead?"', 'Panel: financing your first feature', 'Panel: life in the writers\' room', 'Panel: below the line, above the noise']), d: 'Producers and executives, wine in plastic cups.' });
  out.push({ venue: pk(['market', 'hike', 'picnic', 'match']), title: pk(['Riverside night market', 'Full moon hike', 'Free film in the park', 'The derby']), d: 'The city at its best.' });
  return out;
}
// ---- weekend trips ----
function tripsAvailable() {
  const M = S.me, mo = dateOf(S.week).getUTCMonth(), lang = HUBS[M.hub].lang, out = [];
  for (const F of (typeof FESTIVALS !== 'undefined' ? FESTIVALS : [])) if (F.month === mo || F.month === (mo + 1) % 12) out.push({ k: 'f:' + F.k, label: `${F.name.replace(/^the /, 'The ')}`, d: F.d + ' Screenings, parties, deals.', cost: F.k === 'cote' ? 2200 : 1300, fest: 1, hub: null });
  const r = hashRand(S.week * 3 + 11), others = HUB_IDS.filter(h => h !== M.hub);
  for (let i = 0; i < 3; i++) { const h = others[Math.floor(r() * others.length)]; if (!out.some(x => x.hub === h)) out.push({ k: 'h:' + h, label: `A weekend in ${hubName(h)}`, d: `See how they make films in ${hubName(h)}, and meet the people who do.`, cost: HUBS[h].lang === lang ? 450 : 1100, hub: h }); }
  return out;
}
function bookTrip(a) {
  const M = S.me, T = tripsAvailable().find(x => x.k === a.k);
  if (!T || M.cash < usd(T.cost)) return false;
  for (const w of [curW(), curW() + 1]) {
    const slots = [[5, 0], [5, 1], [5, 2], [6, 0], [6, 1], [6, 2]].map(([d, b]) => ({ w, d, b }));
    if (!slots.every(slotFree)) continue;
    M.cash -= usd(T.cost);
    slots.forEach((s, i) => bookAppt(Object.assign({ kind: i === 0 ? 'trip' : 'tripday', who: null, trip: T.k, what: T.label }, s)));
    inbox('note', `Booked: ${T.label}`, `Flights and a bed for ${slotLabel(slots[0])} to Sunday night. ${fmtCash(usd(T.cost))}.`);
    return true;
  }
  return false;
}
function goOnTrip(x, L) {
  const M = S.me, me = ME(), T = (x.trip || '').split(':'), hub = T[0] === 'h' ? T[1] : null, F = T[0] === 'f' && typeof FESTIVALS !== 'undefined' ? FESTIVALS.find(f => f.k === T[1]) : null;
  const pool = hub || HUB_IDS[Math.floor(prnd() * HUB_IDS.length)], met = [];
  for (let i = 0; i < (F ? 3 : 2); i++) { const q = bestIn(pool, ROLES, p => -Math.abs(p.standing - me.standing - (F ? 25 : 10)) + prnd() * 30); if (q) { meet(q.id, F ? `Met at ${F.name}` : `Met in ${hubName(pool)}`, 5); met.push(`${q.name} (${(q.occ || occupationOf(q)).toLowerCase()})`); } }
  M.grind = 0;
  weekGain('tas', F ? .12 : .06); me.standing = clamp(me.standing + (F ? .6 : .2), 0, 100);
  if (F && !(M.tripsTold || {})[F.k]) { (M.tripsTold = M.tripsTold || {})[F.k] = 1; milestone(`First time at ${F.name}`, 'life'); }
  L.push(`${x.what}. ${F ? pickLine(['Three films a day and parties every night.', 'You sneak into a sold-out screening and nobody stops you.', 'A deal is signed at the table next to yours.'], S.week) : pickLine(['You visit a studio lot and a famous café.', 'A local crew adopts you for the night.', 'You eat everything and watch two local films.'], S.week)}${met.length ? ' You meet ' + met.join(', ') + '.' : ''}`);
}
