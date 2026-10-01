// Random careers lived day by day with random choices, school, agents and firing; reports the first exception.
// Usage: node tools/fuzz.js [careers] [weeks]
const [N = 4, WEEKS = 60] = process.argv.slice(2).map(Number);
let bad = 0;
for (let c = 0; c < N; c++) {
  delete require.cache[require.resolve('./harness.js')];
  const h = require('./harness.js'), r = s => h.run(s);
  let rs = 1234 + c * 77; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
  try {
    r(`newWorld(${2000 + c * 9}, ${7 + c}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
    const roles = ['director', 'actor', 'writer', 'dp', 'editor', 'producer', 'composer', 'designer'];
    r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Fuzz', role: '${roles[c % roles.length]}' }) })`);
    for (let i = 0; i < 30 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); const L = sc.rooms || sc.opts; return doAct({ t: 'party', k: L[${Math.floor(rnd() * 9)} % L.length].k }); })()`);
    const acts = ['hunt', 'hunt', 'network', 'write', 'rest', 'train', 'study', 'catchup', 'hustle', 'home', 'out', 'read'], eves = ['home', 'out', 'write', 'read', 'v:rep', 'v:bar', 'v:openmic', 'v:gym'];
    for (let w = 0; w < WEEKS && !r('S.me.over'); w++) {
      r(`for (const it of pending()) doAct({ t: 'pick', id: it.id, k: it.choices[${Math.floor(rnd() * 3)} % it.choices.length].k })`);
      if (rnd() < .05) r(`doAct({ t: 'enrol', prog: '${['short', 'cc', 'ba', 'mfa', 'union'][Math.floor(rnd() * 5)]}', craft: 'cam' })`);
      if (rnd() < .06) r(`doAct({ t: 'query', ag: ${Math.floor(rnd() * 6)} })`);
      if (rnd() < .03) r(`doAct({ t: 'fireagent' })`);
      if (rnd() < .03) r(`S.me.agent || signAgent(agenciesIn(S.me.hub)[0], 'fuzz')`);
      if (rnd() < .04) r(`doAct({ t: 'move', i: ${Math.floor(rnd() * 6)} })`);
      if (rnd() < .03) r(`doAct({ t: 'vehicle', v: '${['bike', 'scooter', 'car', 'transit'][Math.floor(rnd() * 4)]}' })`);
      if (rnd() < .05) r(`doAct({ t: 'newscript', genre: 'Drama', theme: 'family', tone: 'dark', premise: 'A ferryman refuses one last crossing.', hero: 'an old ferryman', setting: 'a flooded valley', notes: 'He is afraid of the water. The ending: he swims. '.repeat(${Math.floor(rnd() * 20)}) }); for (const sc of S.me.scripts || []) pagesPrompt(sc);`);
      if (rnd() < .05) r(`doAct({ t: 'furnish', id: '${['bed', 'desk', 'plant', 'poster', 'camera'][Math.floor(rnd() * 5)]}' })`);
      const cal = JSON.stringify(Array.from({ length: 7 }, () => [acts[Math.floor(rnd() * acts.length)], acts[Math.floor(rnd() * acts.length)], eves[Math.floor(rnd() * eves.length)]]));
      r(`S.me.cal = ${cal}; UI.apps = new Set(S.me.board.slice(0, appSlots()).map(p => p.id));`);
      if (rnd() < .3) r(`(() => { const ids = aliveKnown(); const s = upcomingSlots(10)[${Math.floor(rnd() * 10)}]; if (ids.length) doAct(Object.assign({ t: 'text', id: ids[${Math.floor(rnd() * 50)} % ids.length], kind: '${['hi', 'coffee', 'drinks', 'date', 'mentor'][Math.floor(rnd() * 5)]}' }, s || {})); })()`);
      if (rnd() < .1) r(`(UI.txt = { id: String(aliveKnown()[0] ?? ''), kind: 'date', slot: 0 }, phonePanel())`);
      r(`(() => { const w0 = S.week; for (let g = 0; g < 80 && S.week === w0 && !S.me.over; g++) { for (const it of pending()) doAct({ t: 'pick', id: it.id, k: it.choices[g % it.choices.length].k }); doAct(endWeekAct(g % 3 ? 'next' : 'day')); } })()`);
      r('viewDesk(); viewYou();');   // rendering must never throw
    }
    console.log(`career ${c}: ok, week ${r('S.week')}, cash ${r('S.me.cash')}, level ${r('careerLevel()')}, agent ${r('!!S.me.agent')}`);
  } catch (e) { bad++; console.log(`career ${c}: ${e.message}\n${(e.stack || '').split('\n').slice(1, 6).join('\n')}`); }
}
process.exitCode = bad ? 1 : 0;
