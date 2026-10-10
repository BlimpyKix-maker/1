// ---------------- Your own films: the journey ----------------
// A film your company makes is no longer a progress bar. Every few weeks, from the first draft to the last mix,
// something comes up that only the person whose name is on the company can decide: a star who wants the part made
// bigger, a tax credit in another country, a completion bond, a storm, a lead who won't come out of the trailer, a
// leaked set photo, a test audience, a composer you can't afford, a streamer waving a cheque. Each call is played
// for what you meant by it: do it well and you get what you were going for; do it badly and you get something
// else, not a punishment. Everything lands in the film itself (its quality, how well it sells, what it cost, when
// it opens) and in its story, so no two of your films are made the same way.

const PJ_CALLS = [
  // development
  { k: 'doctor', st: [0], title: 'The script needs a pass', text: 'Everyone who reads {film} says the same thing: the middle sags. Your options:', opts: [
    { k: 'hire', label: 'Hire a famous script doctor', cost: .03, check: ['pack', 11], ok: { q: 4, hook: 2, t: 'Four weeks and a lot of money later, the middle doesn\'t sag.' }, bad: { q: 1, t: 'They phone it in, but bill like they didn\'t.' } },
    { k: 'self', label: 'Do it yourself, at night', check: ['struc', 13], ok: { q: 3, t: 'You find it on the third night: one scene in the wrong place.' }, bad: { q: -1, stress: 4, t: 'You fix the middle and break the ending.' } },
    { k: 'leave', label: 'It\'s fine. Leave it', ok: { t: 'You leave it. Maybe it\'s fine.' } }] },
  { k: 'starbig', st: [0, 1], title: 'A star wants in, on conditions', text: 'A star\'s agent calls about {film}. Their client wants the part, and wants it made bigger.', opts: [
    { k: 'yes', label: 'Say yes: make it bigger', cost: .08, ok: { hook: 9, q: -2, t: 'The poster has a famous face on it. The script has a new scene in the middle that doesn\'t quite belong.' } },
    { k: 'deal', label: 'Negotiate: their name, your script', check: ['pack', 13], ok: { hook: 7, cost: .05, t: 'They sign for the part as written. Mostly.' }, bad: { hook: -1, t: 'Talks collapse in the third call. The trades report it.' } },
    { k: 'no', label: 'No. The part is the part', ok: { q: 1, hook: -2, t: 'You stay with the actor you wanted. Some people think you\'re mad.' } }] },
  { k: 'rights', st: [0], title: 'A letter from a lawyer', text: 'Someone says {film} is based on their life, and they want paying.', opts: [
    { k: 'settle', label: 'Settle quietly', cost: .02, ok: { t: 'A cheque and a confidentiality clause. It goes away.' } },
    { k: 'fight', label: 'Fight it', check: ['fin', 13], ok: { t: 'Your lawyers are better than theirs. It goes away for free.' }, bad: { cost: .04, weeks: 3, t: 'It drags on for months, and costs more than settling would have.' } },
    { k: 'change', label: 'Change the story enough to be safe', check: ['orig', 12], ok: { q: 1, t: 'The changes make it better. Funny how that happens.' }, bad: { q: -2, t: 'The changes make it worse, and safer.' } }] },
  // prep
  { k: 'where', st: [1], title: 'Where to shoot', text: 'Where does {film} shoot? The line producer has three budgets.', opts: [
    { k: 'home', label: 'Here at home, with crews you know', ok: { q: 1, t: 'Familiar faces, known locations, no surprises.' } },
    { k: 'credit', label: 'Abroad, for a tax credit', check: ['fin', 12], ok: { saving: .12, t: 'Twenty percent back from a foreign government, and the locations look expensive.' }, bad: { saving: .03, weeks: 2, t: 'The paperwork eats most of the saving, and the crew don\'t speak the language.' } },
    { k: 'stage', label: 'All on a sound stage', cost: .04, ok: { q: 1, risk: -1, t: 'No weather, no neighbours, total control.' } }] },
  { k: 'dp', st: [1], title: 'Choosing a cinematographer', text: 'Two DPs want {film}: a visionary who goes over, and a craftsman who doesn\'t.', opts: [
    { k: 'vision', label: 'The visionary', check: ['vis', 13], ok: { q: 4, cost: .03, t: 'Every frame looks like a painting. Every day runs long.' }, bad: { q: 1, cost: .05, weeks: 1, t: 'Two of you with a vision is one too many. It looks good, eventually.' } },
    { k: 'craft', label: 'The craftsman', ok: { q: 1, t: 'On time, on budget, beautifully lit.' } }] },
  { k: 'bond', st: [1], title: 'The completion bond', text: 'The financiers want a completion bond on {film}: insurance that it gets finished, for two percent.', opts: [
    { k: 'buy', label: 'Buy it', cost: .02, ok: { bonded: 1, t: 'Bonded. If it goes wrong, someone else pays.' } },
    { k: 'skip', label: 'Skip it and save the money', check: ['bud', 12], ok: { t: 'You save the fee. You\'d better not go over.' }, bad: { hook: -2, t: 'Two financiers pull out in protest. You find others, at a worse rate.' } }] },
  { k: 'unknown', st: [1], title: 'The perfect unknown', text: 'The casting director has found someone nobody\'s heard of for the second lead in {film}. The financiers want a name.', opts: [
    { k: 'unknown', label: 'Cast the unknown', check: ['tas', 12], ok: { q: 3, hook: 1, t: 'They walk into the read and the room goes silent. A star is born, maybe.' }, bad: { q: 0, hook: -2, t: 'They\'re good, not great. The financiers say nothing loudly.' } },
    { k: 'name', label: 'Cast a name', cost: .03, ok: { hook: 5, t: 'A name on the poster. Fine on screen.' } }] },
  // shoot
  { k: 'storm', st: [2], title: 'The weather turns', text: 'A week of storms is coming straight at the {film} shoot.', opts: [
    { k: 'wait', label: 'Wait it out', ok: { weeks: 1, cost: .02, t: 'You lose a week and a little money. Everyone sleeps.' } },
    { k: 'rewrite', label: 'Rewrite the scenes for the rain', check: ['orig', 13], ok: { q: 3, t: 'The rain scenes are the best thing in the film.' }, bad: { q: -1, t: 'Everyone is soaked and the scenes don\'t work.' } },
    { k: 'move', label: 'Move everything indoors', check: ['setm', 12], ok: { t: 'Indoors, on schedule, nobody notices.' }, bad: { weeks: 1, t: 'Indoors takes longer than anyone thought.' } }] },
  { k: 'meltdown', st: [2], title: 'The lead won\'t come out', text: 'Your lead is in their trailer and won\'t come out. Something about the script, or their marriage, or both.', opts: [
    { k: 'talk', label: 'Go in and talk to them', check: ['cha', 13], ok: { q: 2, t: 'An hour later they come out and give the best performance of the shoot.' }, bad: { weeks: 1, t: 'They don\'t come out until Thursday.' } },
    { k: 'wait', label: 'Shoot around them for a day', check: ['setm', 11], ok: { t: 'You shoot around them. Nobody misses a beat.' }, bad: { cost: .01, t: 'Shooting around them is harder than it sounds.' } },
    { k: 'threat', label: 'Remind their agent what\'s in the contract', check: ['com', 14], ok: { t: 'They\'re on set in twenty minutes, furious and brilliant.' }, bad: { hook: -3, t: 'It\'s in the trades by lunchtime.' } }] },
  { k: 'leak', st: [2], title: 'Set photos leak', text: 'Paparazzi shots from the {film} set are everywhere, including one that spoils the ending.', opts: [
    { k: 'lean', label: 'Lean into it: release your own', check: ['pack', 12], ok: { hook: 6, t: 'You put out better pictures than they did. The internet is excited.' }, bad: { hook: 1, t: 'Your pictures look like a press release. Theirs look like news.' } },
    { k: 'decoy', label: 'Shoot a fake ending to throw them off', cost: .01, check: ['orig', 13], ok: { hook: 4, t: 'Half the internet believes the fake. Perfect.' }, bad: { t: 'Nobody falls for it.' } },
    { k: 'ignore', label: 'Ignore it', ok: { hook: 1, t: 'It blows over in a week.' } }] },
  { k: 'extra', st: [2], title: 'One more day', text: 'The director of {film} wants one extra day for a scene that isn\'t in the schedule. They swear it\'s the film.', opts: [
    { k: 'yes', label: 'Give them the day', cost: .02, check: ['tas', 11], ok: { q: 3, t: 'It is the film. It\'s in every review.' }, bad: { q: 0, t: 'It\'s a lovely scene. It ends up on the cutting room floor.' } },
    { k: 'no', label: 'No: hold the schedule', ok: { t: 'The schedule holds. The director sulks.' } }] },
  { k: 'safety', st: [2], title: 'A near miss', text: 'A rig nearly comes down on the {film} set. Nobody\'s hurt. The crew are rattled.', opts: [
    { k: 'stop', label: 'Stop for a full safety review', ok: { weeks: 1, cost: .01, t: 'You lose two days. The crew would walk through fire for you now.', ties: 3 } },
    { k: 'push', label: 'Check it and push on', check: ['setm', 13], ok: { t: 'Checked, fixed, back on schedule.' }, bad: { hook: -2, t: 'The union hears about it. So does the press.' } }] },
  // post
  { k: 'cut', st: [3], title: 'The director\'s cut', text: 'The first cut of {film} is three hours and four minutes.', opts: [
    { k: 'tight', label: 'Cut it to under two hours', check: ['rhythm', 12], ok: { q: 2, hook: 3, t: 'It flies. Nobody misses a thing.' }, bad: { q: -2, t: 'It\'s short and you can feel what\'s missing.' } },
    { k: 'long', label: 'Release it long: it\'s an epic', check: ['tas', 14], ok: { q: 4, hook: -3, t: 'Critics call it a monument. Cinemas get two fewer shows a day.' }, bad: { q: 0, hook: -4, t: 'It\'s long. Everyone mentions how long it is.' } }] },
  { k: 'score', st: [3], title: 'The score', text: 'Who scores {film}? A famous composer, or the young one who wrote the temp track for free.', opts: [
    { k: 'famous', label: 'The famous composer', cost: .025, ok: { q: 2, hook: 2, t: 'The theme is in your head for a month.' } },
    { k: 'young', label: 'Take a chance on the young one', check: ['theme', 12], ok: { q: 3, t: 'The score is the discovery of the year.' }, bad: { q: -1, t: 'It sounds like a temp track, because it was one.' } }] },
  { k: 'vfx', st: [3], title: 'The effects aren\'t ready', text: 'The VFX shots for {film} look unfinished, and the release date is fixed.', opts: [
    { k: 'pay', label: 'Pay for another vendor to rush them', cost: .04, ok: { q: 2, t: 'They look finished. Nobody slept.' } },
    { k: 'cut', label: 'Cut around the worst of them', check: ['shape', 12], ok: { q: 1, t: 'You cut around them so well nobody notices they\'re gone.' }, bad: { q: -2, t: 'You can see where the shots used to be.' } },
    { k: 'delay', label: 'Move the release date', ok: { weeks: 4, hook: -2, t: 'Four more weeks. The marketing team weeps.' } }] },
  { k: 'title', st: [3], title: 'The title', text: 'Marketing hates the title {film}. They\'ve tested three alternatives.', opts: [
    { k: 'keep', label: 'Keep the title', ok: { t: 'The title stays. It was always the title.' } },
    { k: 'test', label: 'Go with what tested best', check: ['mkt', 11], ok: { hook: 4, t: 'The new title tests fifteen points higher. You get used to it.' }, bad: { hook: -1, t: 'It tests well and nobody can remember it.' } }] },
  { k: 'streamer', st: [3], title: 'A streamer wants it', text: 'A streamer offers to buy {film} outright: no cinemas, a guaranteed price, and it\'s gone.', opts: [
    { k: 'sell', label: 'Take the money', ok: { sell: 1, t: 'Sold. The money\'s in the bank and the film goes straight to people\'s sofas.' } },
    { k: 'haggle', label: 'Use it to push the cinema offers up', check: ['pack', 14], ok: { hook: 5, t: 'The distributors hear there\'s a streamer bid. Their offers jump.' }, bad: { t: 'The streamer walks; nobody else noticed.' } },
    { k: 'no', label: 'No: this is a cinema film', ok: { t: 'You turn it down. You\'ll find out if you were right.' } }] }
];
function pjOwnFilms() { const M = S.me; return M.company === undefined ? [] : S.films.filter(f => f.co === M.company && f.rel === null && f.stage >= 0 && f.stage <= 3); }
function pjWeek() {
  const M = S.me; if (!M.party || !M.party.done) return;
  for (const f of pjOwnFilms()) {
    if (pending().some(it => it.kind === 'pj' && it.film === f.id) || S.week < (f.pjNext || 0)) continue;
    f.pjNext = S.week + 2 + Math.floor(prnd() * 3);
    if (prnd() > .8) continue;
    const used = new Set(f.pj || []), L = PJ_CALLS.filter(c => c.st.includes(f.stage) && !used.has(c.k)); if (!L.length) continue;
    const C = L[Math.floor(prnd() * L.length)]; (f.pj = f.pj || []).push(C.k);
    inbox('pj', `${f.title}: ${C.title}`, C.text.replace('{film}', f.title), { film: f.id, call: C.k, choices: C.opts.map(o => ({ k: o.k, label: o.label + (o.cost ? ` (${fmtM(f.budget * o.cost)})` : '') + (o.check ? ` · ${checkLabel(o.check[0], o.check[1])}` : ''), check: o.check })) });
  }
}
function pjPick(it, k) {
  if (it.kind !== 'pj') return false;
  const M = S.me, me = ME(), f = S.films[it.film], C = PJ_CALLS.find(x => x.k === it.call); it.done = true;
  if (!f || !C || f.rel !== null) { it.result = { t: 'Too late: the film has moved on.' }; return true; }
  const o = C.opts.find(x => x.k === k) || C.opts[C.opts.length - 1], ok = o.check ? roll(o.check[0], o.check[1]) : true, r = o.check ? M.lastRoll : null, R = ok ? o.ok : (o.bad || o.ok), c = S.companies[f.co];
  // overruns and savings land on the film's cost; the company pays the difference when the film comes out
  const spend = x => { if (!x) return; const v = f.budget * x; if (f.cost !== undefined) f.cost += v; else if (c) c.cash -= v; };
  if (ok || !o.bad) spend(o.cost); spend(R.cost);
  if (R.saving && c) { const v = f.budget * R.saving; if (f.cost !== undefined) f.cost -= v; else c.cash += v; }
  if (R.q) { f.qBonus = (f.qBonus || 0) + R.q; f.you = (f.you || 0) + R.q; }
  if (R.hook) f.hook = clamp((f.hook || 50) + R.hook, 5, 99);
  if (R.weeks) f.stageEnd = (f.stageEnd || S.week) + R.weeks;
  if (R.bonded) f.bonded = 1;
  if (R.stress) M.stress = clamp(M.stress + R.stress, 0, 100);
  if (R.ties) for (const id of [f.dir, f.prod, ...(f.cast || [])].filter(id => id !== undefined && id !== me.id && P(id))) addTie(me, P(id), R.ties);
  if (R.sell && c) { const v = Math.max(f.budget * (1.05 + (f.hook || 50) / 400), f.budget * .9); c.cash += v; f.streamSold = v; f.hook = clamp((f.hook || 50) - 30, 5, 99); milestone(`Sold ${f.title} to a streamer for ${fmtM(v)}`, 'money'); }
  (f.events = f.events || []).push({ w: S.week, t: `${C.title}: ${o.label.toLowerCase()}. ${R.t}`, q: R.q || 0 });
  it.result = { ok: o.check ? ok : null, roll: r, t: R.t };
  return true;
}
// a bonded film that runs over: the bond pays
{ const _sp = slatePick; slatePick = function (it, k) { const f = S.films[it.film], c0 = f && f.co !== null ? S.companies[f.co].cash : 0, r = _sp(it, k); if (f && f.bonded && f.co !== null && it.call === 'over' && S.companies[f.co].cash < c0) { S.companies[f.co].cash = c0; it.result.t += ' The completion bond covers it.'; } return r; }; }
