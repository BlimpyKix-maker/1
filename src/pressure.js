// ---------------- Pressure that binds ----------------
// The audit found energy and stress never constrained anything: the auto-schedule kept energy above 55 and stress at
// zero for years. Nights now restore a little less than a working day costs (SLEEP_BASE in life.js), and three
// pressures build stress week by week, each named in your conditions so you can see where it comes from:
//  · the job itself: more senior jobs weigh more (+0.6 a week per level; a second job +2);
//  · a deadline: a film you're on is shooting (+2 a week), or you head a department in post (+1);
//  · enemies: people who can't stand you (+0.5 each a week, up to +3);
//  · money: already counted in the week (rent you can't cover, debt).
// The ways out cost something: time off (the Recover focus), the coping habits in stress2.js, or fewer enemies.
function pressureParts() {
  const M = S.me, me = ME(), out = [];
  const shoot = M.jobs.filter(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 2).length, post = M.jobs.filter(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 3 && ((tmplOf(j) || {}).lv || 0) >= 4).length;
  if (shoot) out.push(['a shoot', 2 * Math.min(2, shoot)]); else if (post) out.push(['post-production', 1]);
  const lv = Math.max(0, ...M.jobs.map(j => (tmplOf(j) || {}).lv || 1)); if (M.jobs.length) out.push([M.jobs.length > 1 ? 'two jobs at once' : 'the job', +(lv * .6 + (M.jobs.length - 1) * 2).toFixed(1)]);
  const enemies = Object.keys(M.known || {}).map(Number).filter(id => P(id) && !P(id).dead && opinion(id) <= -30).length;
  if (enemies) out.push([`${enemies} ${enemies === 1 ? 'person who can\'t stand you' : 'people who can\'t stand you'}`, Math.min(3, enemies * .5)]);
  return out;
}
WEEK_HOOKS.push(() => { const M = S.me; if (!M || !M.party || !M.party.done) return; const P0 = pressureParts(); const add = P0.reduce((t, x) => t + x[1], 0); if (add) M.stress = clamp(M.stress + add * traitMul(ME(), 'stress'), 0, 100); M.pressure = P0; });
{ const _co = conditionsOf; conditionsOf = function () { const C = _co(), M = S.me; if (!M || !M.pressure || !M.pressure.length) return C; C.push({ k: 'pressure', label: '⏱️ Under pressure', d: `Stress building each week from ${M.pressure.map(([l, v]) => `${l} (+${v})`).join(', ')}.` }); return C; }; }
// Relief from one scene or story beat is real but short. In the probes a single choice took 14 to 19 points off
// stress, more than a week of work put on, so pressure never built at all. Only half of any relief now lands.
for (const [get, set] of [[() => sceneResolve, f => { sceneResolve = f; }], [() => lateFx, f => { lateFx = f; }]]) {
  let _f; try { _f = get(); } catch (e) { continue; } if (typeof _f !== 'function') continue;
  set(function () { const s0 = S.me ? S.me.stress : 0, r = _f.apply(this, arguments); if (S.me && S.me.stress < s0) S.me.stress = s0 - (s0 - S.me.stress) * .5; return r; });
}
