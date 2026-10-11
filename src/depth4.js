// ---------------- Playing age, and the slide from coping to dependency ----------------
//  · Every acting part has an age range, shown on the listing. Your playing age is your age, give or take what your
//    fitness and your face let you get away with. Outside the range, every year counts against you; before the 1990s
//    the business was harder still on anyone older than the part. Character parts are where long careers go.
//  · Coping has a cost. If drinking is how you deal with it and the stress stays high, it can become a dependency:
//    disadvantage on Composure and Work ethic, energy draining week by week, and a bad day on set waiting to happen.
//    Someone close will eventually sit you down. Rehab takes a month and works if you let it; recovery is a trait you
//    keep, with the odd week that tests it.
const PART_AGES = { 'the best friend who gets all the good lines': [20, 40], 'a detective who has seen everything': [35, 60], 'the villain\'s right hand': [25, 50], 'the love interest': [20, 38], 'a night-shift nurse': [22, 50], 'the bartender who knows everyone\'s secrets': [25, 60], 'a diplomat from somewhere else': [35, 65], 'the singer at the club': [20, 45], 'a boxer on the way down': [22, 40], 'the ghost in the house': [18, 80], 'identical twins (both of them)': [18, 50], 'the mother who holds it together': [30, 55], 'a con artist': [25, 55], 'the narrator': [30, 80], 'the comic relief': [18, 60], 'a professor who lectures in riddles': [45, 75], 'a soldier home from war': [20, 40], 'a dancer with one last chance': [18, 35], 'the grandmother who speaks no English': [60, 85], 'the rival': [20, 45], 'a wedding singer': [25, 60], 'the getaway driver': [20, 45], 'a stand-up comedian falling apart': [25, 55], 'a priest with doubts': [35, 70], 'a farmer at the end of the world': [30, 70], 'an alien learning to be human': [18, 60], 'the mayor': [40, 70], 'a child prodigy, grown up': [22, 32], 'the stuntman who wants to act': [22, 45] };
{ const _mp = makePart; makePart = function (p) { const r = _mp(p), A = PART_AGES[r.arch] || [20, 60], j = Math.round((hashRand(p.id * 131 + 7)() - .5) * 6); r.ages = [Math.max(16, A[0] + j), A[1] + j]; return r; }; }
{ const _cb = castingBoard; castingBoard = function (films) { const out = _cb(films); for (const p of out) if (p.part && p.part.ages && !/\(plays /.test(p.t)) p.t += ` (plays ${p.part.ages[0]}–${p.part.ages[1]})`; return out; }; }
function playAge() { const me = ME(), M = S.me; return ageOf(me) - clamp((skillOf(me, 'phys') - 10) * .3, -2, 3) - (M.youth || 0); }
{ const _hf = hireFactors; hireFactors = function (post) { const F = _hf(post); if (!post.part || !post.part.ages || !S.me) return F;
  const a = playAge(), [lo, hi] = post.part.ages, d = a < lo - 3 ? lo - 3 - a : a > hi + 3 ? (a - hi - 3) * (S.year < 1990 ? 1.3 : 1) : 0;
  if (d > 0) F.push([`Playing age (${Math.round(a)} for a ${lo}–${hi} part)`, -Math.min(1.4, d * .08)]); else if (a >= lo && a <= hi) F.push([`Right age for the part (${lo}–${hi})`, .1]);
  return F; }; }
// looking younger can be bought, a little
for (const [k, y] of [['s_veneers', 2], ['s_stylist', 1], ['h_trainer', 1]]) if (BZ_BY[k]) BZ_BY[k].youth = y;
{ const _ba = bazaarAct; bazaarAct = function (a) { const n = (S.me.bz || []).length, ok = _ba(a); if (ok && a.k === 'buy' && S.me.bz.length > n) { const B = BZ_BY[S.me.bz[S.me.bz.length - 1].k]; if (B && B.youth) S.me.youth = Math.min(4, (S.me.youth || 0) + B.youth); } return ok; }; }
// ---- dependency ----
TRAITS.Dependent = { stress: .95, energy: -3, dis: ['com', 'eth'], d: 'Drinking isn\'t coping any more; it\'s the day. Energy drains every week.' };
TRAITS['In recovery'] = { stress: 1.02, adv: ['com'], d: 'Sober, one day at a time. Clearer than you\'ve been in years.' };
function depWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return;
  if (me.traits.includes('In recovery') && me.traits.includes('Drinks')) { me.traits = me.traits.filter(t => t !== 'In recovery'); diary('You\'re drinking again. The recovery chip goes in a drawer.'); }
  if (me.traits.includes('Drinks') && !me.traits.includes('Dependent') && !me.traits.includes('In recovery')) { M.hiStress = M.stress >= 60 ? (M.hiStress || 0) + 1 : Math.max(0, (M.hiStress || 0) - 1);
    if (M.hiStress >= 6 && prnd() < .08) { me.traits.push('Dependent'); M.depW = S.week; diary('You notice you\'ve stopped counting the drinks. Then you notice you\'re hiding the bottles.'); } }
  if (me.traits.includes('Dependent')) {
    if (M.jobs.length && prnd() < .05) { const j = M.jobs[0], h = j.head !== null && j.head !== undefined && P(j.head) ? P(j.head) : null; if (h) addTie(me, h, -6); me.standing = clamp(me.standing - .8, 0, 100); diary(`You turn up late and wrecked to ${j.t.toLowerCase()}. ${h ? h.name + ' covers for you, once.' : 'People cover for you, once.'}`); }
    if (S.week - (M.depW || S.week) >= 10 && !pending().some(it => it.kind === 'late') && prnd() < .2) lateOffer('dep');
  }
  if (me.traits.includes('In recovery') && M.stress >= 75 && prnd() < .04 && !pending().some(it => it.kind === 'late')) lateOffer('dep');
}
LATE.push(
  { id: 'dep_intervene', pool: 'dep', cool: 12, need: () => ME().traits.includes('Dependent'), mk: c => { c.who = partnerOf() !== null ? partnerOf() : lateWho('friend'); }, needC: c => c.who !== null, title: 'An intervention', text: c => `${lname(c.who)} is at your door, and so are two other people you love. Nobody is angry. That's the worst part. They've found a place: four weeks, and they'll hold your life together while you're gone.`,
    opts: [
      { k: 'rehab', label: () => 'Go', cost: () => usd(9000), go: c => { const me = ME(); me.traits = me.traits.filter(t => t !== 'Dependent' && t !== 'Drinks'); me.traits.push('In recovery'); S.me.hiStress = 0; lateFx({ stress: -30, energy: 40, tie: 12, mile: 'Went to rehab' }, c); return 'Four weeks of early mornings, honest rooms and a garden. You come home thinner and clearer, with a phone number you can call at 3 a.m.'; } },
      { k: 'refuse', label: () => 'Tell them they\'re overreacting', check: ['cha', 15], go: (c, ok) => { lateFx(ok ? { tie: -4, stress: 4 } : { tie: -12, stress: 10, stand: -2 }, c); return ok ? 'They leave, unconvinced. You prove them wrong for a fortnight.' : 'It turns ugly. They leave. You drink.'; } }] },
  { id: 'dep_test', pool: 'dep', cool: 26, need: () => ME().traits.includes('In recovery'), title: 'A bad week', text: () => 'The kind of week that used to end with a bottle. There\'s a bar on the way home, and you know exactly where the stool is.',
    opts: [
      { k: 'call', label: () => 'Call your sponsor', check: ['com', 11], go: (c, ok) => { lateFx(ok ? { stress: -8 } : { stress: 4 }); if (!ok && prnd() < .4) { const me = ME(); me.traits = me.traits.filter(t => t !== 'In recovery'); me.traits.push('Drinks'); return 'They don\'t pick up in time. You have one. Then the rest of them. Back to the start.'; } return ok ? 'An hour on the phone. You walk past the bar.' : 'You walk past the bar, just. A long night.'; } },
      { k: 'run', label: () => 'Walk it off, all the way home', go: c => { lateFx({ stress: -4, energy: -6 }); return 'Six miles in the rain. You get home soaked and sober.'; } }] }
);
for (const t of LATE.slice(-2)) LATE_BY[t.id] = t;
