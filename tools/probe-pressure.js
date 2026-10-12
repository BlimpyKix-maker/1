// Pressure probe (work order 13): a working bot for N weeks; reports the weekly low of energy, how often stress passes
// 40, and burnouts. usage: [APPLEBOX_HTML=page] node tools/probe-pressure.js <seed> <weeks> [overwork]
const [seed = 2027, weeks = 104, mode = 'normal'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js'));
console.log(h.run(`(() => { newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();
  doAct({ t: 'create', c: Object.assign(ccDefaults(), { salt: ${+seed} }) }); partyAuto();
  let low = 100; { const _b = blockStep; blockStep = function (a) { const r = _b.apply(this, arguments); low = Math.min(low, S.me.energy); return r; }; }
  const lows = [], st = [], burn = []; let firstBurn = null;
  for (let w = 0; w < ${+weeks}; w++) { low = S.me.energy; const w0 = S.week;
    if ('${mode}' === 'overwork') { S.me.focus = Object.assign({}, S.me.focus || {}, { auto: false }); S.me.cal = Array.from({ length: 7 }, () => ['hustle', 'hustle', 'hustle']); }
    for (let g = 0; g < 60 && S.week === w0; g++) { autoBeforeStep(); for (const it of pending()) { const L = (it.choices || []).filter(c => !c.dis); if (L[0]) doAct({ t: 'pick', id: it.id, k: L[0].k }); else it.done = true; } doAct(endWeekAct('next')); }
    lows.push(low); st.push(S.me.stress); if (S.me.burnout && firstBurn === null) firstBurn = w; }
  const s = lows.slice().sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
  return JSON.stringify({ seed: ${+seed}, mode: '${mode}', weeks: ${+weeks}, energyLowMedian: Math.round(med), stressOver40: +(st.filter(x => x > 40).length / st.length).toFixed(2), stressMax: Math.round(Math.max(...st)), firstBurnoutWeek: firstBurn, jobs: S.me.jobs.map(j => j.t), level: careerLevel(), credits: ME().credits.length });
})()`));
