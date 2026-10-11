// ---------------- Inner weather: inspiration, slumps, obsessions and fears ----------------
// Creative work comes in surges and droughts, and the dice now know it.
//  · Inspired: when you're rested and calm, an idea sometimes takes hold. For three weeks you have advantage on the
//    creative crafts and learn faster.
//  · A slump: after a flop with your name on it, or a long run of rejections, the work goes flat for a while.
//    Disadvantage on the creative crafts until it lifts, sooner if you take a real break or have a win.
//  · An obsession: once in a career, at the height of an inspired spell, a film demands something specific of you (an
//    actor, a city, a piece of kit) within six months. Make that film and it's the best thing you'll ever do. Let it
//    go and the drought afterwards is long.
//  · Fears: a premiere that goes wrong, a public flop or a brutal review can leave a fear behind (stage fright, fear
//    of failure, dread of critics) that costs you on the rolls it touches until you face it.
// All of these show up with your other conditions, so you can see exactly which rolls they touch.
const INNER_CRAFT = ['struc', 'dial', 'char', 'orig', 'vstory', 'tone', 'pace', 'comp', 'light', 'theme', 'score', 'song', 'range', 'impro'];
const FEARS = { stage: { label: 'Stage fright', dis: ['pres', 'cha'], d: 'Since that night, a room full of people makes your hands shake. Disadvantage on Presence and Charisma until you face it.' },
  failure: { label: 'Fear of failure', dis: ['orig', 'vis'], d: 'You keep choosing the safe version. Disadvantage on Originality and Vision until you face it.' },
  critics: { label: 'Dread of critics', dis: ['tas', 'com'], d: 'You read every review and believe the bad ones. Disadvantage on Taste and Composure until you face it.' } };
function innerOf() { const M = S.me; return (M.inner = M.inner || { fears: [] }); }
{ const _co = conditionsOf; conditionsOf = function () {
  const C = _co(), M = S.me; if (!M || !M.party || !M.party.done) return C; const I = innerOf();
  if (I.insp && S.week < I.insp) C.push({ k: 'inspired', label: '✨ Inspired', adv: INNER_CRAFT, d: `An idea has hold of you. Advantage on the creative crafts and faster learning, until ${fmtDate(I.insp, true)}.` });
  if (I.slump && S.week < I.slump) C.push({ k: 'slump', label: '🌧️ In a slump', dis: INNER_CRAFT, d: `Everything you make feels flat. Disadvantage on the creative crafts until ${fmtDate(I.slump, true)}, sooner with a real break or a win.` });
  if (I.obs && !I.obs.done && S.week < I.obs.until) C.push({ k: 'obsessed', label: '🔥 Obsessed', adv: ['orig', 'vis'], d: `${I.obs.text} Until ${fmtDate(I.obs.until, true)}.` });
  for (const f of I.fears || []) { const F = FEARS[f.k]; if (F) C.push({ k: 'fear_' + f.k, label: `😨 ${F.label}`, dis: F.dis, d: F.d }); }
  return C; }; }
{ const _cm = condMul; condMul = function () { const v = _cm(), I = S.me && S.me.inner; return I && I.insp && S.week < I.insp ? v * 1.15 : I && I.slump && S.week < I.slump ? v * .85 : v; }; }
function innerWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return; const I = innerOf();
  if (I.insp && S.week >= I.insp) { delete I.insp; diary('The idea that had hold of you lets go. You have pages to show for it.'); }
  if (I.slump && S.week >= I.slump) { delete I.slump; diary('The slump lifts, the way they do: one morning the work is just work again.'); }
  if (I.slump && M.stress < 20 && M.energy > 80 && prnd() < .25) { delete I.slump; diary('A proper rest breaks the slump early.'); }
  // inspiration comes to the rested and the calm
  if (!I.insp && !I.slump && M.energy >= 60 && M.stress < 40 && prnd() < .015 + (40 - M.stress) / 1600) { I.insp = S.week + 3; diary('An idea arrives in the shower and won\'t leave. You\'re inspired.'); }
  // once in a career, at the height of it, an obsession
  if (I.insp && !I.obs && careerLevel() >= 2 && ['writer', 'director', 'producer'].includes(me.role) && prnd() < .04) innerObsess();
  if (I.obs && !I.obs.done && S.week >= I.obs.until) { I.obs.done = 'lost'; I.slump = S.week + 12; M.stress = clamp(M.stress + 12, 0, 100); diary('The film you were obsessed with never happened. Something goes quiet in you for a long time.'); milestone('Let an obsession go', 'life'); }
  // a fear can be faced after a while
  if ((I.fears || []).some(f => S.week - f.w >= 4) && !pending().some(it => it.kind === 'late') && prnd() < .15) lateOffer('inner');
}
function innerObsess() {
  const M = S.me, me = ME(), I = innerOf(), r = prnd();
  if (r < .45) { const q = typeof bestIn === 'function' ? bestIn(M.hub, ['actor'], q => (q.fame || 0) * .6 + q.standing * .4 + prnd() * 20) : null; if (q) { I.obs = { k: 'actor', v: q.id, until: S.week + 26, text: `A film that only works with ${q.name} in it.` }; } }
  else if (r < .75) { const L = HUB_IDS.filter(h => h !== M.hub), h = L[Math.floor(prnd() * L.length)]; I.obs = { k: 'place', v: h, until: S.week + 26, text: `A film that has to be shot in ${HUBS[h].name}.` }; }
  else { I.obs = { k: 'budget', v: 0, until: S.week + 26, text: 'A film made fast and cheap, before the feeling goes: under the money anyone would give you.' }; }
  if (I.obs) { inbox('note', 'An obsession', `${I.obs.text} You can see every frame of it. Make it within six months, through your own company, and it will be the best thing you ever do. If you don't, it will haunt you.`); milestone('Became obsessed with a film', 'life'); }
}
// the obsession is answered when your company makes the film it asked for
{ const _sf = selfFund; selfFund = function (a) {
  const M = S.me, I = M && M.inner, n0 = S.films.length, r = _sf(a); if (!r || !I || !I.obs || I.obs.done || S.week >= I.obs.until) return r;
  const f = S.films.slice(n0).find(x => x.co === M.company); if (!f) return r;
  const O = I.obs, hit = O.k === 'actor' ? (f.cast || []).includes(O.v) : O.k === 'place' ? f.hub === O.v || a.loc === O.v : O.k === 'budget' ? f.budget <= estBudget(f.genre) * .6 : false;
  if (hit) { O.done = 'made'; f.qBonus = (f.qBonus || 0) + 8; f.obsession = 1; (f.events = f.events || []).push({ w: S.week, t: 'The film you were obsessed with: every frame of it was already in your head.', q: 8 }); milestone(`Made the film you were obsessed with: ${f.title}`, 'work'); diary(`You're making it: ${f.title}, exactly as you saw it.`); }
  return r; }; }
// flops and bad nights leave marks
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); const M = S.me; if (!M || !f || !M.party || !M.party.done) return out; const me = ME(), mine = (M.company !== undefined && f.co === M.company) || (me.credits || []).includes(f.id) || f.dir === me.id; if (!mine || f.innerSeen) return out; f.innerSeen = 1;
  const I = innerOf(), flop = f.total < (f.cost || f.budget) * .8, hit = f.total > (f.cost || f.budget) * 2.5;
  if (hit && I.slump) { delete I.slump; diary(`${f.title} is a hit, and the slump goes with it.`); }
  if (flop && prnd() < .45) { I.slump = Math.max(I.slump || 0, S.week + 6); diary(`${f.title} flops. You stop answering your phone for a bit.`); }
  if (flop && prnd() < .25 && !(I.fears || []).some(x => x.k === 'failure')) { (I.fears = I.fears || []).push({ k: 'failure', w: S.week }); }
  if ((f.reviews || 50) < 40 && prnd() < .3 && !(I.fears || []).some(x => x.k === 'critics')) { (I.fears = I.fears || []).push({ k: 'critics', w: S.week }); }
  if ((f.reviews || 50) < 35 && (f.dir === me.id || (f.cast || [])[0] === me.id) && prnd() < .3 && !(I.fears || []).some(x => x.k === 'stage')) { (I.fears = I.fears || []).push({ k: 'stage', w: S.week }); }
  return out; }; }
LATE.push(
  { id: 'inner_stage', pool: 'inner', cool: 8, need: () => (innerOf().fears || []).some(f => f.k === 'stage'), title: 'Facing the room', text: () => 'A festival has asked you to do a Q&A after a screening. Two hundred people, a microphone, no script. Since that night, the thought of it makes you feel sick.',
    opts: [{ k: 'face', label: () => 'Do it', check: ['com', 12], go: (c, ok) => { if (ok) innerCure('stage'); lateFx(ok ? { stand: .5, stress: -6 } : { stress: 8 }); return ok ? 'Your voice shakes for the first answer and then it doesn\'t. Afterwards someone says it was the best Q&A of the festival.' : 'You freeze on the second question. It\'ll take another try.'; } },
      { k: 'no', label: () => 'Say you\'re busy', go: c => 'They find someone else. The fear stays where it is.' }] },
  { id: 'inner_failure', pool: 'inner', cool: 8, need: () => (innerOf().fears || []).some(f => f.k === 'failure'), title: 'The risky version', text: () => 'You have two drafts of the same idea: the safe one everyone will like, and the strange one you actually believe in. Since the flop, you keep reaching for the safe one.',
    opts: [{ k: 'face', label: () => 'Send the strange one out', check: ['orig', 12], go: (c, ok) => { if (ok) innerCure('failure'); lateFx(ok ? { xp: { orig: .3 }, stress: -4 } : { stress: 6 }); return ok ? 'Two people hate it and one loves it, and the one who loves it has money. You remember why you do this.' : 'It comes back with a polite no. You\'ll try again.'; } },
      { k: 'no', label: () => 'Send the safe one', go: c => 'It does fine. You feel nothing about it.' }] },
  { id: 'inner_critics', pool: 'inner', cool: 8, need: () => (innerOf().fears || []).some(f => f.k === 'critics'), title: 'The reviews', text: () => 'You have a new piece of work out, and the reviews are in a tab you haven\'t opened. You know you\'ll read the worst one twenty times.',
    opts: [{ k: 'face', label: () => 'Read them once, all of them, and close the tab', check: ['com', 12], go: (c, ok) => { if (ok) innerCure('critics'); lateFx(ok ? { stress: -6 } : { stress: 6 }); return ok ? 'Some are kind, some aren\'t, none of them are about you. You close the tab and go for a walk.' : 'You read the worst one twenty times. Next time.'; } },
      { k: 'no', label: () => 'Don\'t read them at all', go: c => { lateFx({ stress: -2 }); return 'Bliss, until a friend mentions one.'; } }] }
);
for (const t of LATE.slice(-3)) LATE_BY[t.id] = t;
function innerCure(k) { const I = innerOf(); I.fears = (I.fears || []).filter(f => f.k !== k); milestone(`Faced it: ${FEARS[k].label.toLowerCase()}`, 'life'); }
