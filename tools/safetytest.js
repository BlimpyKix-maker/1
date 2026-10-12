// Real-people safety test: a long career that knows hundreds of real-based people, then checks that nobody who is
// alive in reality has a negative trait, a fired/scandal/lawsuit/comeback story, a "wrong reasons" headline, a
// simulated death, or a lookalike portrait. Usage: node tools/safetytest.js [seed] [years]   (exit code 1 on failure)
const [seed = 2027, years = 15] = process.argv.slice(2).map(Number);
const h = require(require('path').join(__dirname, 'harness.js'));
const out = JSON.parse(h.run(`(() => {
  newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();
  doAct({ t: 'create', c: Object.assign(ccDefaults(), { salt: ${seed} }) }); partyAuto();
  // know a few hundred real-based people so their lives run in detail
  const real = S.people.filter(p => realLiving(p)); for (const p of real.slice(0, 400)) if (!S.me.known[p.id]) meet(p.id, 'Met somewhere', 5);
  for (let w = 0; w < ${years} * 52 && !S.me.over; w++) { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0; g++) { autoBeforeStep(); for (const it of pending()) { const L = (it.choices || []).filter(c => !c.dis); if (L[0]) doAct({ t: 'pick', id: it.id, k: L[0].k }); else it.done = true; } doAct(endWeekAct('next')); } if (S.week === w0) break; }
  const bad = [], neg = new Set(NEG_TRAITS), evText = /let go from their film|all over the papers|lawsuit|comeback|quit drinking/i;
  const living = S.people.filter(p => realLiving(p));
  for (const p of living) {
    const t = p.traits.filter(x => neg.has(x)); if (t.length) bad.push([p.name, 'trait', t.join(',')]);
    for (const e of p.life || []) if (evText.test(e.t)) bad.push([p.name, 'event', e.t]);
    if (p.dead) bad.push([p.name, 'died in the simulation', p.deathY]);
    if (REAL_LOOKS[p.real]) bad.push([p.name, 'lookalike portrait']);
  }
  const names = new Set(living.map(p => p.name));
  for (const n of S.news || []) if (/wrong reasons|all over the papers|let go from their film/i.test(n.text || '') && [...names].some(x => (n.text || '').includes(x))) bad.push(['news', n.text]);
  return JSON.stringify({ seed: ${seed}, years: ${years}, year: S.year, week: S.week, over: !!S.me.over, stuck: pending().map(i => i.kind), livingReal: living.length, known: Object.keys(S.me.known).length, lives: living.reduce((t, p) => t + (p.life || []).length, 0), bad: bad.slice(0, 30), nBad: bad.length });
})()`));
console.log(JSON.stringify(out));
if (out.nBad) process.exitCode = 1;
