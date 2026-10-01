// ---------------- Cinephile notes ----------------
// Every film and person has notes: the curated stories (rewritten to name only the game's own world, see
// src/fiction.js) plus notes the game writes from what actually happened in your world: overruns, flops that became
// cult hits, partnerships, firsts. How much you see depends on your Taste: a sharper eye notices more, and rumours
// only reach people who know where to listen. Invented rumours are only ever about the world's invented films and people. Nothing here touches the world's random numbers.
const RUMOURS_FILM = ['{lead} is said to have stayed in character for the entire shoot, to the crew\'s exhaustion.', 'The ending was reshot after a disastrous test screening.', 'A crew member\'s dog wanders through the background of one scene, and nobody noticed until release.', 'The script was rewritten every night of the shoot; the actors got pages at breakfast.', 'Half the budget went on a single sequence that runs four minutes.', '{dir} and {lead} stopped speaking halfway through and communicated by notes.', 'The studio wanted a different title; {dir} threatened to take their name off it.', 'A real storm hit the location; the best scene in the film was improvised around it.', 'The production lost its lead two weeks in; {lead} was a last-minute replacement.', 'The original cut ran nearly four hours.', 'Its most famous line was improvised on the day.', 'Insurance would not cover the stunt, so {lead} did it anyway.', 'The set was built twice: the first one burned down in a lighting accident.', 'Its composer wrote the main theme in a single night.', 'Somebody stole the only print of the finished film a week before release; it turned up in a taxi.'];
const RUMOURS_PERSON = ['Turns down more work than most people are offered.', 'Keeps a notebook of every bad review and reads them on birthdays.', 'Has never watched any of their own films all the way through.', 'Once walked off a set over the colour of a coffee mug.', 'Is famously generous to crews: every wrap gift is handmade.', 'Was nearly cast in a career-making role and lost it to a coin toss.', 'Learns every crew member\'s name by the end of the first day.', 'Writes letters, by hand, to people whose work they admire.', 'Insists on eating lunch with the crew, never in the trailer.', 'Refused a studio contract that would have made them rich.'];
function tasteNow() { return S.me && S.me.party && S.me.party.done ? ME().mind.tas : 20; }
// items: [kind 'f' | 'r', text, taste needed]
function triviaList(items) {
  const tas = tasteNow(), seen = items.filter(x => tas >= x[2]), hid = items.filter(x => tas < x[2]);
  const fs = seen.filter(x => x[0] === 'f'), rs = seen.filter(x => x[0] === 'r');
  const next = hid.length ? Math.min(...hid.map(x => x[2])) : null;
  return (fs.length ? `<h4>Trivia</h4><ul class="trivia">${fs.map(x => `<li>${factHTML(x[1])}</li>`).join('')}</ul>` : '')
    + (rs.length ? `<h4>Rumour has it</h4><ul class="trivia rumour">${rs.map(x => `<li>${factHTML(x[1])}</li>`).join('')}</ul><p class="muted small">Stories that went round at the time. Some are true, some grew in the telling.</p>` : '')
    + (hid.length ? `<p class="locked">🔒 ${hid.length} more note${hid.length > 1 ? 's' : ''} you haven't picked up on yet. A Taste of ${next} would catch the next one${S.me ? ` (yours is ${Math.floor(tas)})` : ''}. Watch films, read scripts and go to screenings to sharpen it.</p>` : '');
}
function nm(id) { return id !== null && id !== undefined && P(id) ? P(id).name : 'the lead'; }
function filmTrivia(f) {
  const out = [], key = f.cat ? f.cat.id : null;
  const note = key && FICTION.note['f:' + key];
  if (note) out.push(['f', note, 0]);
  (key && FICTION.fact[key] || []).forEach(([k, t], i) => out.push([k === 'r' ? 'r' : 'f', t, k === 'r' ? 11 + i * 2 : 6 + i * 3]));
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
  return out;
}
function filmTriviaHTML(f) { return triviaList(filmTrivia(f)); }
function personTriviaHTML(p) { return triviaList(personTrivia(p)); }
