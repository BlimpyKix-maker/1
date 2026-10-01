// ---------------- A life, day by day ----------------
// Seven days, each in three beats: morning, the day itself, and the evening. The advance button lives one beat at a
// time and stops whenever something needs a decision, the way a day in the business is really a string of small
// events. Energy is a daily thing now: work spends it, evenings and sleep give it back, and only a week of work plus
// late nights plus a side hustle wears you right down. How tired and how stressed you are changes your rolls.
const DAYS7 = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const BEAT_NAMES = ['Morning', 'Day', 'Evening'];
const DAY_COST = { work: 28, hunt: 14, network: 18, catchup: 10, write: 18, train: 18, hustle: 32, rest: -22, study: 18 };
const DAY_STRESS = { work: 3, hunt: 2, network: 1, catchup: -1, write: .5, train: .5, hustle: 3, rest: -6, study: 1 };
// What you do with your evenings. Venues in the city add more (life-city.js).
const EVENINGS = {
  home: { label: 'Stay in', icon: '🏠', e: -5, stress: -1.5, d: 'Cook, call home, early night. Restores a little energy.' },
  out: { label: 'Out with friends', icon: '🍻', e: 14, stress: -5, cost: 35, d: 'Friends outside the business. Costs energy, melts stress.' },
  latewrite: { label: 'Write late', icon: '🌙', e: 12, stress: 1, d: 'A few more pages while the city sleeps.' },
  read: { label: 'Read scripts and watch films', icon: '🎞️', e: -2, stress: -2, d: 'Homework that feels like a treat. A little taste every time.' }
};
// How you're doing, and what it does to you. Shown on the desk and counted in every roll.
function conditionsOf() {
  const M = S.me, out = [];
  if (!M || !M.party || !M.party.done) return out;
  if (M.energy < 20) out.push({ k: 'exhausted', label: 'Exhausted', dis: 'all', d: 'Disadvantage on everything. Mistakes at work become likely; pages come slowly.' });
  else if (M.energy < 40) out.push({ k: 'tired', label: 'Tired', dis: ['eth', 'com', 'vis'], d: 'Disadvantage on Work ethic, Composure and Vision. Fewer pages, slower learning.' });
  if (M.stress >= 75) out.push({ k: 'frayed', label: 'Frayed', dis: ['cha', 'col', 'com'], d: 'Disadvantage with people. You might snap at someone. Burnout is close.' });
  else if (M.stress >= 50) out.push({ k: 'stressed', label: 'Stressed', dis: ['com'], d: 'Disadvantage on Composure. Sleep comes harder.' });
  if (M.energy >= 75 && M.stress < 15) out.push({ k: 'zone', label: 'In the zone', adv: Object.keys(SUB2C), d: 'Advantage on craft checks and faster learning.' });
  return out;
}
function condMul() { const c = conditionsOf().map(x => x.k); return c.includes('exhausted') ? .5 : c.includes('tired') ? .75 : c.includes('zone') ? 1.2 : 1; }
function setPlan(a) {
  const M = S.me, from = M.wk ? M.wk.day + (M.wk.beat > 1 ? 1 : 0) : 0;
  if (a.plan) for (let i = from; i < 7; i++) if (a.plan[i]) M.plan[i] = a.plan[i];
  if (a.eve) for (let i = M.wk ? M.wk.day + (M.wk.beat > 2 ? 1 : 0) : 0; i < 7; i++) if (a.eve[i]) M.eve[i] = a.eve[i];
  if (a.train) M.train = a.train;
  if (a.catchWith !== undefined) M.catchWith = a.catchWith ?? null;
}
function startWeek() {
  const M = S.me, me = ME(), burnt = M.burnout > 0;
  if (burnt) { for (const j of M.jobs) { j.missed = (j.missed || 0) + 1; if (j.head !== null) addTie(me, P(j.head), -4); } M.burnout--; }
  M.wk = { day: 0, beat: 0, burnt, cashIn: 0, cashOut: 0, stress: 0, gains: {}, hunted: 0, L: [], cards: [] };
}
// Advance: one beat ('next'), to the end of the day ('day'), or to the end of the week ('end'). Always stops at a decision.
function liveOn(a) {
  setPlan(a);
  const M = S.me;
  if (!M.wk) startWeek();
  const day0 = M.wk.day, mode = a.t;
  for (let guard = 0; guard < 30; guard++) {
    const closed = beatStep(a);
    if (closed || pending().length || mode === 'next') return;
    if (mode === 'day' && M.wk.day !== day0) return;
  }
}
function card(icon, title, lines, extra = {}) { S.me.wk.cards.push({ d: S.me.wk.day, b: S.me.wk.beat, icon, title, lines: lines.filter(Boolean), ...extra }); }
function weekGain(k, v) { const W = S.me.wk, g = growSub(ME(), k, v * learnRate(ME()) * condMul()); if (g) W.gains[k] = (W.gains[k] || 0) + g; }
function dayPlan() { const p = effectivePlan(); return S.me.wk && S.me.wk.burnt ? p.map(() => 'rest') : p; }
function beatStep(a) {
  const M = S.me, W = M.wk;
  M.lastRoll = null;
  if (W.beat === 0) morningBeat(); else if (W.beat === 1) dayBeat(); else eveningBeat();
  W.beat++;
  if (W.beat > 2) { sleepNight(); W.beat = 0; W.day++; }
  if (W.day >= 7) { closeWeek(a); return true; }
  return false;
}
// ---- morning: getting there ----
function morningBeat() {
  const M = S.me, W = M.wk, act = dayPlan()[W.day], weekend = W.day >= 5;
  const v = vehicleOf();
  if (act === 'rest' || weekend && act !== 'work') { card('☀️', 'A free morning', [pickLine(MORNING_FREE, W.day)]); return; }
  const commute = v.commute[(S.week + W.day) % v.commute.length];
  M.energy = clamp(M.energy - v.e, 0, 100);
  card(v.icon, v.label || 'Getting there', [commute]);
  morningEvent();
}
// ---- the day: the plan slot ----
function dayBeat() {
  const M = S.me, me = ME(), W = M.wk, act = dayPlan()[W.day], A = ACTIVITIES[act];
  M.energy = clamp(M.energy - (DAY_COST[act] ?? 8), 0, 100);
  W.stress += DAY_STRESS[act] ?? 0;
  if (A.cost) W.cashOut += usd(A.cost);
  const L = [], n0 = W.L.length;
  switch (act) {
    case 'hunt': W.hunted++; L.push(pickLine(HUNT_LINES, W.day)); break;
    case 'network': networkDay(W.L); break;
    case 'catchup': catchupDay(W.L); break;
    case 'write': writeSession(L); break;
    case 'train': for (const k in CRAFTS[M.train].subs) weekGain(k, .02 * (homeFx().train.includes(M.train) ? 1.4 : 1)); L.push(`A class in ${CRAFTS[M.train].label.toLowerCase()}. ${pickLine(CLASS_LINES, W.day)}`); break;
    case 'study': if (M.school) { for (const k in CRAFTS[M.school.craft].subs) weekGain(k, PROGRAMS[M.school.prog].grow); L.push(pickLine(CLASS_LINES, W.day + 3)); } else L.push('You meant to study, but you aren\'t enrolled anywhere.'); break;
    case 'hustle': W.cashIn += usd(150); L.push(pickLine(HUSTLE_LINES, W.day)); break;
    case 'rest': L.push(pickLine(REST_LINES, W.day)); break;
    case 'work': L.push(...workDay()); break;
  }
  card(ACT_ICON[act] || '•', A.label, L.concat(W.L.slice(n0)), { roll: M.lastRoll });
  dayEvent(act);
}
// ---- evening ----
function eveningBeat() {
  const M = S.me, W = M.wk, k = M.eve[W.day] || 'home', E = eveningOf(k);
  M.energy = clamp(M.energy - E.e, 0, 100);
  W.stress += E.stress || 0;
  if (E.cost) W.cashOut += usd(E.cost);
  const L = [];
  if (k === 'latewrite') writeSession(L, .5);
  else if (k === 'read') { weekGain('tas', .025); L.push(pickLine(READ_LINES, W.day)); }
  else if (E.venue) L.push(...venueEvening(E));
  else L.push(pickLine(k === 'out' ? OUT_LINES : HOME_LINES, W.day));
  card(E.icon, E.label, L, { roll: M.lastRoll });
  eveningEvent(k);
}
function sleepNight() {
  const M = S.me, me = ME(), life = ORIGIN.life[M.life];
  const sleep = 19 + homeFx().energy * .8 + (M.body.stamina - 10) * .8 + life.rest * .6 + traitSum(me, 'energy') * .5 - Math.max(0, M.stress - 40) / 5;
  M.energy = clamp(M.energy + clamp(sleep, 8, 40), 0, 100);
  const stressNow = M.stress + M.wk.stress;
  if (stressNow >= 96 && !M.burnout) { M.burnout = 1; inbox('note', 'You hit the wall', 'You can\'t get out of bed. Your body has decided: next week is rest, whatever you planned.'); }
}
// ---- work days ----
function workDay() {
  const M = S.me, me = ME(), out = [];
  for (const j of M.jobs) {
    const f = j.film !== null ? S.films[j.film] : null, t = tmplOf(j);
    out.push(`${f ? f.title : j.t}: ${pickLine(f ? JOB_DAY_LINES[f.stage] || JOB_DAY_LINES[2] : OFFICE_LINES, M.wk.day + j.id)}`);
    if (M.energy < 20 && prnd() < .35) { mistakeAtWork(j); out.push('You\'re running on empty, and it shows.'); }
  }
  return out;
}
function mistakeAtWork(j) {
  const M = S.me, me = ME();
  if (j.head !== null) addTie(me, P(j.head), -3);
  M.wk.stress += 4;
  inbox('note', 'A mistake', `Exhausted, you ${pickLine(['mislabel a whole day\'s footage', 'forget the call sheet changes', 'send the wrong version to the producer', 'miss your cue', 'lose the keys to the truck'], S.week + j.id)}. ${j.head !== null ? P(j.head).name + ' notices.' : 'Someone notices.'}`);
}
// The calendar date of a day in the current week (weeks are counted from their Monday).
function dayDate(d) { const t = dateOf(S.week); const mon = new Date(t.getTime() - ((t.getUTCDay() + 6) % 7) * 864e5); return new Date(mon.getTime() + d * 864e5); }
function fmtDay(d) { const x = dayDate(d); return `${DAYS7[d]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]} ${x.getUTCFullYear()}`; }
const pickLine = (L, i) => L[Math.abs(Math.floor(i * 7 + S.week * 3)) % L.length];
const MORNING_FREE = ['A slow morning: coffee, the trades, the window.', 'You sleep in and feel human again.', 'Laundry, groceries, the small business of a life.', 'A run along the water before the heat.'];
const HUNT_LINES = ['Emails, calls, a coffee with someone who knows someone.', 'You rewrite your cover note three times and send it anyway.', 'You trawl the trades and the crew lists for anything hiring.', 'You update your reel and send it to every name in your phone.'];
const CLASS_LINES = ['The teacher is a working professional and it shows.', 'You practise until it stops feeling like practice.', 'A class full of people as hungry as you.', 'Notes, exercises, and one idea you\'ll use for years.'];
const HUSTLE_LINES = ['A bar shift. The tips are fine; the stories are better.', 'Deliveries across town. Rent is rent.', 'You pour drinks for people who make films.', 'Catering a corporate lunch. You smile a lot.'];
const REST_LINES = ['You sleep late and call home.', 'A long walk, a cheap meal, no screens.', 'Friends outside the business remind you there is an outside.', 'You do absolutely nothing, magnificently.'];
const READ_LINES = ['You read a produced script and watch the film straight after. You notice what changed.', 'A double bill from the library. Your notebook fills up.', 'An old classic you\'d never seen. You see why.'];
const OUT_LINES = ['Cheap dinner, loud bar, old friends.', 'Karaoke. Nobody films it, thankfully.', 'A friend\'s birthday in a back room somewhere.', 'Tacos at midnight and a long walk home.'];
const HOME_LINES = ['Pasta, a film, bed by eleven.', 'You call home. They ask when you\'ll be on TV.', 'You tidy the flat and feel briefly in control.', 'An early night. Your body thanks you.'];
const JOB_DAY_LINES = { 0: ['Meetings, coverage, notes on notes.', 'The script changes again. You keep up.', 'Budget top-sheets and phone calls.'], 1: ['Recces, schedules, a hundred questions.', 'The prep office hums. Everything is urgent.', 'Fittings, tests, locations, lists.'], 2: ['Call time at six, wrap at eight.', 'A long day on set. You learn three things nobody wrote down.', 'Setups, resets, coffee, more setups.', 'You keep your head down and your ears open.'], 3: ['A dark room, a timeline, the film finding itself.', 'Notes from the director, notes from the producers.', 'Hours on one scene. It\'s better for it.'] };
const OFFICE_LINES = ['Emails, meetings, a deadline that moves.', 'You learn how the business side really works.', 'A quiet day at the desk. You listen to every call.'];
// Hooks for the other life modules, defined there; safe if they aren't loaded.
function morningEvent() { if (typeof lifeMorningEvent === 'function') lifeMorningEvent(); }
function dayEvent(act) { if (typeof lifeDayEvent === 'function') lifeDayEvent(act); }
function eveningEvent(k) { if (typeof lifeEveningEvent === 'function') lifeEveningEvent(k); }
function eveningOf(k) { return EVENINGS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) || EVENINGS.home; }
function vehicleOf() { return typeof VEHICLES !== 'undefined' ? VEHICLES[S.me.vehicle || 'transit'] : { icon: '🚌', e: 2, commute: ['The bus, a podcast, a seat if you\'re lucky.'] }; }
function writeSession(L, scale = 1) { if (typeof writeOnScript === 'function') return writeOnScript(L, scale); S.me.spec.pages += Math.round((4 + ME().mind.eth / 4) * scale * condMul()); L.push('You write.'); }
function venueEvening(E) { return []; }
