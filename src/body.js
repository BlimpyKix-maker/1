// ---------------- Your body, over time ----------------
// Muscle and weight drift with how you live: gym, boxing, swims and hikes build muscle; stress and long desk weeks
// add weight; work on your feet takes it off. Roles can ask for more: a superhero bulks up, a famine drama slims down,
// and you commit (or don't) when you're cast. Your figure in the room and on your pages changes to match.
// M.fit = { mus: 0..10, mass: -6..+8, goal: null | { mus, mass, film, why, by } }
function fitOf() { const M = S.me; return M.fit = M.fit || { mus: 0, mass: 0, goal: null }; }
// a venue evening that works the body
function fitVenue(V) { if (!V || !V.body) return; const F = fitOf(); F.mus = clamp(F.mus + V.body * 3, 0, 10); F.mass = clamp(F.mass - V.body * 2, -6, 8); }
// once a week: drift toward the goal, or toward how you live
function fitWeek() {
  const M = S.me, F = fitOf();
  if (F.goal) {
    const G = F.goal; F.mus = clamp(F.mus + Math.sign(G.mus - F.mus) * Math.min(.45, Math.abs(G.mus - F.mus)), 0, 10); F.mass = clamp(F.mass + Math.sign(G.mass - F.mass) * Math.min(.6, Math.abs(G.mass - F.mass)), -6, 8);
    M.stress = clamp(M.stress + 1.2, 0, 100); M.energy = clamp(M.energy - 2, 0, 100);
    if (Math.abs(F.mus - G.mus) < .3 && Math.abs(F.mass - G.mass) < .3 && !G.done) { G.done = 1; diary(`You're ready for ${G.why}: the trainer says you've never looked more like the part.`); milestone(`Transformed for a role: ${G.why}`, 'work'); }
    const f = G.film !== undefined ? S.films[G.film] : null; if (!f || f.stage >= 4 || f.rel !== null || S.week - G.by > 40) { F.goal = null; diary('The role is done. You can eat like a person again.'); }
    return;
  }
  F.mus = clamp(F.mus - .05, 0, 10);   // muscle fades without the work
  const desk = M.jobs.some(j => !j.actor) ? .04 : 0, stressed = M.stress > 60 ? .08 : 0, active = (M.body.stamina - 10) * .01;
  F.mass = clamp(F.mass + desk + stressed - active - F.mass * .02, -6, 8);
}
// cast in something physical: the director asks for a transformation
const FIT_ASK = {
  Superhero: ['to look like you could lift a car', { mus: 9, mass: 4 }], Action: ['to do your own fight scenes', { mus: 7, mass: 1 }], 'Martial arts': ['to move like you were born to it', { mus: 7, mass: -1 }],
  War: ['to look like you\'ve marched a thousand miles', { mus: 4, mass: -4 }], Drama: ['to look like the part has worn you down', { mus: 1, mass: -5 }], Period: ['to look like you live without fridges', { mus: 2, mass: -2 }],
  Comedy: ['to put on some weight for the part', { mus: 0, mass: 6 }], Crime: ['to look like a heavy', { mus: 5, mass: 5 }]
};
function fitJobHook(post) {
  const M = S.me, f = post.film !== null ? S.films[post.film] : null; if (!post.actor || !f || (post.tier || 1) < 2) return;
  const A = FIT_ASK[f.genre]; if (!A || prnd() > (f.genre === 'Superhero' ? .85 : .35)) return;
  inbox('fitask', `${f.title}: a word about your body`, `The director wants you ${A[0]}. A trainer, a diet and a few months of discipline. It shows on screen, and people notice when an actor commits.`, { film: f.id, goal: A[1], why: `${f.title}`, choices: [{ k: 'yes', label: 'Commit to the transformation' }, { k: 'half', label: 'Meet them halfway' }, { k: 'no', label: 'Politely refuse' }] });
}
function fitPick(it, k) {
  if (it.kind !== 'fitask') return false;
  const M = S.me, F = fitOf(), f = S.films[it.film]; it.done = true; it.picked = k;
  if (k === 'no') { if (f && f.dir !== undefined && P(f.dir)) addTie(ME(), P(f.dir), -3); it.result = { t: 'They nod. They\'ll cheat it with costume and angles.' }; return true; }
  const g = k === 'half' ? { mus: (F.mus + it.goal.mus) / 2, mass: (F.mass + it.goal.mass) / 2 } : it.goal;
  F.goal = { mus: g.mus, mass: g.mass, film: it.film, why: it.why, by: S.week };
  if (f && P(f.dir) && k === 'yes') addTie(ME(), P(f.dir), 3);
  if (k === 'yes' && f) f.q = (f.q || 55) + 1.5;
  it.result = { t: k === 'yes' ? 'A trainer calls at 5am tomorrow. And every day after.' : 'You agree to some of it. The trainer looks disappointed.' };
  return true;
}
// the build you see, from the look you chose plus the life you've lived
function fitShape() { const F = S.me && S.me.fit; return F ? { mus: F.mus, mass: F.mass } : { mus: 0, mass: 0 }; }
function fitLabel() {
  const F = fitOf(), m = F.mus >= 7 ? 'Built' : F.mus >= 4 ? 'Toned' : F.mus >= 2 ? 'Fit-ish' : 'Soft', w = F.mass >= 4 ? 'heavier' : F.mass >= 1.5 ? 'a little heavier' : F.mass <= -4 ? 'very lean' : F.mass <= -1.5 ? 'leaner' : 'your usual weight';
  return `${m}, ${w}${F.goal ? ` · training for ${F.goal.why}` : ''}`;
}
