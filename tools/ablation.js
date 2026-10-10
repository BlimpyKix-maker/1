// Competitive testing: does a feature actually change how a career goes? A minimal bot plays a career; each variant
// adds one optional behaviour on top. Same seeds, same roles, so differences are the feature's.
// Features: net neg shorts pets move invest agent school bold gx futures all.
// Usage: node tools/ablation.js <feature|base|all> <seedIndex> [years]  → prints one JSON line of outcomes.
const [FEAT = 'base', SI = '0', YEARS = 5] = process.argv.slice(2);
const ROLES3 = ['dp', 'actor', 'writer'], role = ROLES3[+SI % 3], seed = 4100 + (+SI) * 37;
const on = f => FEAT === f || FEAT === 'all';
const h = require('./harness.js'), r = s => h.run(s);
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Ablation', role: '${role}', hub: 'london', wealth: 'gettingby', traits: ['Charming', 'Workhorse'], salt: ${seed} }) }); partyAuto();`);
r(`doAct({ t: 'focus', auto: true, day: 'balanced', eve: 'social' })`);
if (on('school')) r(`doAct({ t: 'enrol', prog: 'mfa', craft: '${role === 'actor' ? 'act' : role === 'writer' ? 'wri' : 'cam'}' })`);
const PICK = `(it => { const L = (it.choices || []).filter(c => !c.dis); if (!L.length) return null;
  if (it.kind === 'offer') { const n = L.find(c => c.k === 'neg_money'); if (${on('neg')} && n) return n.k; return (L.find(c => c.k === 'yes') || L[0]).k; }
  if (it.kind === 'agentoffer') return ${on('agent')} ? 'yes' : 'no';
  if (${on('gx')}) { const g = L.find(c => /^gx_/.test(c.k)); if (g) return g.k; }
  if (${on('bold')}) { const b = L.find(c => stanceOf(String(c.label).split(' · ')[0]) === 'bold'); if (b) return b.k; }
  const keep = L.filter(c => !/go home|give up|retire|leave the business|quit the business/i.test(c.label || '') && !/^gx_/.test(c.k));
  return (keep[0] || L[0]).k; })`;
const answer = () => r(`(() => { for (let g = 0; g < 12; g++) { const P = pending(); if (!P.length) return; for (const it of P) { const k = ${PICK}(it); if (k) doAct({ t: 'pick', id: it.id, k }); else it.done = true; } } })()`);
const t0 = Date.now();
for (let w = 0; w < YEARS * 52; w++) {
  if (r('!!S.me.over')) break;
  try {
    answer();
    if (on('net') && w % 2 === 0) r(`(() => { const ids = aliveKnown().sort((a, b) => opinion(b) - opinion(a)); const s = upcomingSlots(10)[3]; if (ids.length && s) doAct(Object.assign({ t: 'text', id: ids[${w} % Math.min(6, ids.length)], kind: '${w % 4 ? 'coffee' : 'drinks'}' }, s)); const m = (S.me.phone || []).slice().reverse().find(m => m.replyable && !m.replied && m.from >= 0); if (m) doAct({ t: 'reply', mid: m.id, kind: 'warm', text: 'that is amazing news!!' }); })()`);
    if (on('shorts')) r(`(() => { const M = S.me; if (M.make && M.make.ready) doAct({ t: 'releasework', promo: 1 }); else if (!M.make && M.cash > 3000) { const C = shortCrewCands(); doAct({ t: 'startwork', type: 'short', plan: { kind: 'drama', budget: 1, crew: C.slice(0, 2).map((id, i) => ({ id, role: i ? 'Lead actor' : 'Camera' })) } }); } else if (M.make) makeSession([]); })()`);
    if (on('pets') && w === 8) r(`(() => { const L = petsOnOffer().filter(x => x.body === 'dog').sort((a, b) => a.fee - b.fee); if (L[0]) doAct({ t: 'pet', k: 'adopt', kind: L[0].k }); })()`);
    if (on('move') && w === 20) r(`doAct({ t: 'place2', k: 'relocate', hub: 'hollywood' })`);
    if (on('invest') && w % 8 === 0) r(`(() => { if (S.me.cash > 15000) { const L = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier <= 2).sort((a, b) => b.cash - a.cash); if (L[0]) doAct({ t: 'trade', co: L[0].id, n: 20 }); } })()`);
    if (on('futures') && w % 3 === 0) r(`(() => { if (S.me.cash < 40000) return; for (const f of futList().slice(0, 6)) { const px = futPrice(f), tr = futTrack(f); if (tr > px * 1.15 || tr < px / 1.15) doAct({ t: 'fut', film: f.id, n: tr > px ? 3 : -3 }); } })()`);
    const w0 = r('S.week');
    for (let g = 0; g < 40 && r('S.week') === w0 && !r('S.me.over'); g++) { answer(); r(`(() => { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0 && !S.me.over; g++) { autoBeforeStep(); if (pending().length) return; doAct(endWeekAct('next')); } })()`); }
  } catch (e) { console.error('ERR', w, e.message); break; }
}
const out = JSON.parse(r(`JSON.stringify((() => { const M = S.me, me = ME(); const port = Object.entries(M.port || {}).reduce((t, [id, n]) => t + (typeof mktPrice === 'function' ? n * mktPrice(S.companies[+id]) : 0), 0);
  return { feat: '${FEAT}', si: ${SI}, role: '${role}', week: S.week, worth: Math.round(M.cash + port), standing: +me.standing.toFixed(1), fame: +(me.fame || 0).toFixed(1), credits: me.credits.length, level: careerLevel(), known: Object.keys(M.known).length, prizes: (M.milestones || []).filter(m => m.kind === 'prize').length, stress: Math.round(M.stress), paths: Object.keys(M.paths || {}).length, works: (M.works || []).length, avgStress: Math.round((M.hist || []).reduce((t, h) => t + (h.stress || 0), 0) / Math.max(1, (M.hist || []).length)), futPnl: Math.round((M.futLog || []).reduce((t, x) => t + x.pnl, 0)), agent: M.agent ? S.week - M.agent.since : -1 }; })())`));
out.sec = Math.round((Date.now() - t0) / 1000);
console.log(JSON.stringify(out));
