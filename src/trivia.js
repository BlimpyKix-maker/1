// ---------------- Cinephile notes ----------------
// Every film and person has notes: the curated stories (rewritten to name only the game's own world, see
// src/fiction.js) plus notes the game writes from what actually happened in your world: overruns, flops that became
// cult hits, partnerships, firsts. How much you see depends on your Taste: a sharper eye notices more, and rumours
// only reach people who know where to listen. Invented rumours are only ever about the world's invented films and people. Nothing here touches the world's random numbers.
const RUMOURS_FILM = ['{lead} is said to have stayed in character for the entire shoot, to the crew\'s exhaustion.', 'The ending was reshot after a disastrous test screening.', 'A crew member\'s dog wanders through the background of one scene, and nobody noticed until release.', 'The script was rewritten every night of the shoot; the actors got pages at breakfast.', 'Half the budget went on a single sequence that runs four minutes.', '{dir} and {lead} stopped speaking halfway through and communicated by notes.', 'The studio wanted a different title; {dir} threatened to take their name off it.', 'A real storm hit the location; the best scene in the film was improvised around it.', 'The production lost its lead two weeks in; {lead} was a last-minute replacement.', 'The original cut ran nearly four hours.', 'Its most famous line was improvised on the day.', 'Insurance would not cover the stunt, so {lead} did it anyway.', 'The set was built twice: the first one burned down in a lighting accident.', 'Its composer wrote the main theme in a single night.', 'Somebody stole the only print of the finished film a week before release; it turned up in a taxi.'];
const RUMOURS_PERSON = ['Turns down more work than most people are offered.', 'Keeps a notebook of every bad review and reads them on birthdays.', 'Has never watched any of their own films all the way through.', 'Once walked off a set over the colour of a coffee mug.', 'Is famously generous to crews: every wrap gift is handmade.', 'Was nearly cast in a career-making role and lost it to a coin toss.', 'Learns every crew member\'s name by the end of the first day.', 'Writes letters, by hand, to people whose work they admire.', 'Insists on eating lunch with the crew, never in the trailer.', 'Refused a studio contract that would have made them rich.'];
// The rumour mill: stories so silly nobody could believe them. For fun, and labelled as such.
const SILLY_FILM = ['A pigeon in the background of the station scene now has its own fan club.', '{lead} reportedly ate 212 bananas over the course of the shoot, "for the character".', 'The catering truck appears in four shots if you pause at exactly the right moment.', 'A local cat was paid in sardines for one scene and later demanded a trailer.', 'The script was lost in a laundrette for a week and came back folded, ironed and annotated.', '{dir} is said to have directed one scene entirely through a megaphone shaped like a fish.', 'The lead\'s wig had a separate contract and a better parking space.', 'Every clock on the set was stopped at 4:17. Nobody remembers why.', 'A fan claims to have seen {title} 400 times and still disputes the ending.', 'The crew held a moustache-growing contest. The boom operator won by a landslide.', 'One extra fell asleep on camera and is clearly visible snoring in the final cut.', 'The production accidentally ordered 3,000 rubber ducks. They are in the film somewhere.', '{lead} learned the accordion for the role. The accordion scene was cut.', 'A goat wandered onto set on day two and was written into the script by day three.', 'The editor swears the film was cut on a toaster during a power cut.', 'Somebody hid a tiny plastic dinosaur in every single scene.', 'The studio\'s lawyers once wrote a memo about the main character\'s hat.', 'Legend says the sequel script is buried in a time capsule under the car park.', '{dir} insisted the crew wear socks of the same colour on Thursdays.', 'An entire scene was reshot because a seagull "gave a better performance" in the first take.'];
const SILLY_PERSON = ['Owns 41 identical grey jumpers and wears them in strict rotation.', 'Once auditioned for a commercial for a toothpaste that never existed.', 'Claims to have taught a parrot three lines of Shakespeare.', 'Keeps a lucky spoon in every trailer. It has its own case.', 'Has a recurring dream about being chased by a giant clapperboard.', 'Allegedly refuses to work on any film with a scene set in a lift.', 'Is said to have named a houseplant after every film they\'ve worked on.', 'Once got lost on a studio lot for six hours and came out with a new agent.', 'Can reportedly recite the entire crew list of their first film from memory, including the caterer\'s middle name.', 'Thinks the moon landing was filmed on location, and is very insistent about it.'];
function tasteNow() { return S.me && S.me.party && S.me.party.done ? ME().mind.tas : 20; }
// items: [kind 'f' | 'r', text, taste needed]
function triviaList(items) {
  const tas = tasteNow(), seen = items.filter(x => tas >= x[2]), hid = items.filter(x => tas < x[2]);
  const fs = seen.filter(x => x[0] === 'f'), rs = seen.filter(x => x[0] === 'r'), ss = seen.filter((x, i, a) => x[0] === 's' && a.findIndex(y => y[1] === x[1]) === i);
  const next = hid.length ? Math.min(...hid.map(x => x[2])) : null;
  return (fs.length ? `<h4>Trivia</h4><ul class="trivia">${fs.map(x => `<li>${factHTML(x[1])}</li>`).join('')}</ul>` : '')
    + (rs.length ? `<h4>Rumour has it</h4><ul class="trivia rumour">${rs.map(x => `<li>${factHTML(x[1])}</li>`).join('')}</ul><p class="muted small">Stories that went round at the time. Some are true, some grew in the telling.</p>` : '')
    + (ss.length ? `<h4>The rumour mill</h4><ul class="trivia silly">${ss.map(x => `<li>${esc(x[1])}</li>`).join('')}</ul><p class="muted small">Almost certainly nonsense.</p>` : '')
    + (hid.length ? `<p class="locked">🔒 ${hid.length} more note${hid.length > 1 ? 's' : ''} you haven't picked up on yet. A Taste of ${next} would catch the next one${S.me ? ` (yours is ${Math.floor(tas)})` : ''}. Watch films, read scripts and go to screenings to sharpen it.</p>` : '');
}
function nm(id) { return id !== null && id !== undefined && P(id) ? P(id).name : 'the lead'; }
function filmTrivia(f) {
  const out = [], key = f.cat ? f.cat.id : null;
  const note = key && FICTION.note['f:' + key];
  if (note) out.push(['f', note, 0]);
  (key && FICTION.fact[key] || []).forEach(([k, t], i) => out.push([k === 'r' ? 'r' : 'f', t, k === 'r' ? 11 + i * 2 : 6 + i * 3]));
  for (const x of productionFacts(f)) out.push(x);
  const r = hashRand(f.id * 7919 + 3), fill = t => t.replace('{lead}', nm(f.cast[0])).replace('{dir}', nm(f.dir));
  const d = P(f.dir), lead = f.cast[0] !== undefined ? P(f.cast[0]) : null;
  if (d && d.credits.length && d.credits[0] === f.id) out.push(['f', `${d.name}'s first film as director.`, 4]);
  if (f.cost > f.budget * 1.25) out.push(['f', `It went ${Math.round((f.cost / f.budget - 1) * 100)}% over budget.`, 7]);
  for (const e of (f.events || []).slice(0, 2)) if (e.t) out.push(['f', `From the set: ${e.t}`, 9]);
  if (f.rel !== null) {
    if (f.reviews >= 75 && f.hitRatio < .8) out.push(['f', `Critics loved it (${f.reviews}/100); audiences stayed away.`, 5]);
    if (f.hitRatio > 3) out.push(['f', `It earned back its cost ${Math.round(f.hitRatio)} times over at home.`, 3]);
    if (f.cult >= 40) out.push(['f', f.q < 30 ? 'Midnight crowds adopted it as a so-bad-it\'s-good ritual.' : 'Overlooked on release, it found its people later.', 8]);
    if (lead && d && lead !== d) { const both = d.credits.filter(i => keyIds(S.films[i]).includes(lead.id)).length; if (both >= 3) out.push(['f', `${d.name} and ${lead.name} made ${both} films together.`, 6]); }
    if (!f.real) out.push(['r', fill(RUMOURS_FILM[Math.floor(r() * RUMOURS_FILM.length)]), 13]);
    if (!f.real && r() < .5) out.push(['r', fill(RUMOURS_FILM[Math.floor(r() * RUMOURS_FILM.length)]), 16]);
  }
  if (typeof extraFilmTrivia === 'function') out.push(...extraFilmTrivia(f));
  return out.filter((x, i, a) => a.findIndex(y => y[1] === x[1]) === i);
}
function personTrivia(p) {
  const out = [], key = p.catId ? 'p:' + p.catId : null;
  const note = key && FICTION.note[key];
  if (note) out.push(['f', note, 0]);
  (key && FICTION.fact[key] || []).forEach(([k, t], i) => out.push([k === 'r' ? 'r' : 'f', t, k === 'r' ? 11 + i * 2 : 6 + i * 3]));
  const r = hashRand(p.id * 104729 + 11);
  const cr = p.credits.map(i => S.films[i]).filter(f => f.rel !== null);
  if (cr.length) {
    const best = cr.slice().sort((a, b) => b.reviews - a.reviews)[0], big = cr.slice().sort((a, b) => b.total - a.total)[0];
    out.push(['f', `Best reviewed: ${best.title} (${best.reviews}/100).`, 3]);
    if (big !== best) out.push(['f', `Biggest hit: ${big.title}, ${fmtM(big.total)} worldwide.`, 5]);
    const first = cr.slice().sort((a, b) => a.rel - b.rel)[0];
    out.push(['f', `First credit at ${yearOf(first.rel) - p.born}, on ${first.title}.`, 8]);
  }
  const top = Object.entries(p.ties || {}).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] > 30 && P(+top[0])) out.push(['f', `Closest collaborator: ${P(+top[0]).name}.`, 7]);
  if (p.traits && p.traits.length) out.push(['f', `Reputation in the business: ${p.traits.join(', ').toLowerCase()}.`, 4]);
  if (p.standing > 20 && !p.catId) out.push(['r', RUMOURS_PERSON[Math.floor(r() * RUMOURS_PERSON.length)], 14]);
  for (let k = 0; k < 2; k++) out.push(['s', SILLY_PERSON[Math.floor(r() * SILLY_PERSON.length)], 0]);
  if (typeof extraPersonTrivia === 'function') out.push(...extraPersonTrivia(p));
  return out.filter((x, i, a) => a.findIndex(y => y[1] === x[1]) === i);
}
// Facts from the production itself: how long, how big, firsts, the people behind it.
function productionFacts(f) {
  const r = hashRand(f.id * 4217 + 11), out = [], y = f.rel !== null ? yearOf(f.rel) : S.year, hub = hubName(f.hub);
  const rt = Math.round(({ Comedy: 95, Horror: 92, Animation: 88, Action: 118, War: 135, Period: 128, Musical: 122, Fantasy: 130, 'Sci-fi': 120, Documentary: 96 }[f.genre] || 108) + (r() - .4) * 30);
  out.push(['f', `Runs ${rt} minutes.`, 0]);
  if (f.dur && f.dur[2] > 0) out.push(['f', `Shot over ${f.dur[2]} week${f.dur[2] > 1 ? 's' : ''} in and around ${hub}${f.dur[1] > 0 ? `, after ${f.dur[1]} week${f.dur[1] > 1 ? 's' : ''} of preparation` : ''}.`, 2]);
  out.push(['f', y < 1953 ? 'Shot in black and white, in the old square frame.' : y < 1968 && r() < .5 ? 'Shot in black and white, a deliberate choice by then.' : y < 2005 ? `Shot on 35mm film${r() < .4 ? ' in widescreen' : ''}.` : r() < .2 ? 'Shot on 35mm film, unusually for its time.' : 'Shot digitally.', 3]);
  if (['Action', 'War', 'Period', 'Musical', 'Fantasy', 'Martial arts'].includes(f.genre)) out.push(['f', `Its biggest scene used ${50 + Math.floor(r() * 900)} extras.`, 5]);
  const d = P(f.dir), lead = f.cast[0] !== undefined ? P(f.cast[0]) : null;
  if (lead && d && !d.credits.some(i => i !== f.id && keyIds(S.films[i]).includes(lead.id) && S.films[i].rel !== null && (f.rel === null || S.films[i].rel < f.rel))) out.push(['f', `The first time ${d.name} and ${lead.name} worked together.`, 6]);
  if (f.crew && f.crew.mus !== undefined) out.push(['f', `${P(f.crew.mus).name} wrote the score in ${2 + Math.floor(r() * 9)} weeks.`, 7]);
  if (f.crew && f.crew.pd !== undefined) out.push(['f', `${P(f.crew.pd).name}'s team built ${2 + Math.floor(r() * 30)} sets.`, 8]);
  if (lead) { const tk = 1 + Math.floor(r() * 25); out.push(['f', tk === 1 ? `${lead.name} got the final scene in a single take.` : `${lead.name} needed ${tk} takes to get the final scene.`, 9]); }
  if (f.awards && f.awards.length) out.push(['f', `It won ${f.awards.length} award${f.awards.length > 1 ? 's' : ''}, among them ${f.awards[0].replace(/ \d{4}$/, '')}.`, 2]);
  if (f.rel !== null) { const rivals = S.films.filter(g => g.rel !== null && g.genre === f.genre && g.m === f.m && yearOf(g.rel) === y); if (rivals.length > 2 && rivals.every(g => g.total <= f.total)) out.push(['f', `The biggest ${f.genre.toLowerCase()} of ${y} in ${MARKETS[f.m].name}.`, 4]); }
  const sr = hashRand(f.id * 389 + 17), fill = t => t.replace('{lead}', lead ? lead.name : 'The lead').replace('{dir}', d ? d.name : 'The director').replace('{title}', f.title);
  const used = new Set();
  for (let k = 0; k < 3; k++) { const i = Math.floor(sr() * SILLY_FILM.length); if (!used.has(i)) { used.add(i); out.push(['s', fill(SILLY_FILM[i]), 0]); } }
  return out;
}
function filmTriviaHTML(f) { return triviaList(filmTrivia(f)); }
function personTriviaHTML(p) { return triviaList(personTrivia(p)); }
