// ---------------- A life, block by block ----------------
// Each day has three blocks, morning, afternoon and evening, planned ahead like a real diary. A job fills the
// working blocks; interviews, coffees, dates and invitations land in a block as appointments. The space bar (or
// Next) lives on until the next thing worth your attention: a decision, a message, a roll, someone new. Routine
// blocks pass quietly into the log. Energy is spent block by block and restored by sleep; how tired and stressed
// you are changes your rolls.
const DAYS7 = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const BLOCKS = ['Morning', 'Afternoon', 'Evening'], BEAT_NAMES = BLOCKS;
// What a block can hold. e: energy it costs (negative restores); stress likewise. Venues add more (life-city.js).
const BLOCK_ACTS = {
  work: { label: 'Work', icon: '🎬', e: 14, stress: 1.5 },
  hunt: { label: 'Look for work', icon: '📋', e: 7, stress: 1, d: 'Each block lets you send three applications from the board.' },
  write: { label: 'Write', icon: '✍️', e: 9, stress: .3, d: 'Work on your script. Your traits shape how it goes.' },
  train: { label: 'Take a class', icon: '🎓', e: 9, stress: .3, cost: 35, d: 'A class in one craft. Steady, always available.' },
  study: { label: 'Study', icon: '📚', e: 9, stress: .5, d: 'Classes for the course you\'re enrolled in.' },
  network: { label: 'Industry mixer', icon: '🥂', e: 9, stress: .5, cost: 40, d: 'Meet new people in the business. Charisma decides how it goes.' },
  catchup: { label: 'Catch up with a contact', icon: '☕', e: 5, stress: -1, cost: 15, d: 'Coffee with someone you know; or text them from your phone to fix a time.' },
  hustle: { label: 'Side hustle', icon: '🛵', e: 16, stress: 1.5, d: 'Bar shifts and deliveries: $75 a block. Teaches nothing.' },
  rest: { label: 'Rest', icon: '🛋️', e: -11, stress: -3, d: 'Sleep in, walk, see nobody. Restores energy.' },
  home: { label: 'Stay in', icon: '🏠', e: -5, stress: -1.5, d: 'Cook, call home, early night.' },
  out: { label: 'Out with friends', icon: '🍻', e: 12, stress: -5, cost: 35, d: 'Friends outside the business. Costs energy, melts stress.' },
  read: { label: 'Read scripts, watch films', icon: '🎞️', e: -2, stress: -2, d: 'Homework that feels like a treat. Taste grows.' }
};
const EVENINGS = { home: BLOCK_ACTS.home, out: BLOCK_ACTS.out, latewrite: Object.assign({}, BLOCK_ACTS.write, { label: 'Write late' }), read: BLOCK_ACTS.read };
const OLD_EVE = { latewrite: 'write' };
// How you're doing, and what it does to you. Shown on the desk and counted in every roll.
function conditionsOf() {
  const M = S.me, out = [];
  if (!M || !M.party || !M.party.done) return out;
  if ((M.grind || 0) >= 12) out.push({ k: 'grind', label: 'Worn down', dis: ['col', 'cha'], d: 'Weeks of work without a real break. Disadvantage on Collaboration and Charisma until you take some proper rest or a weekend away.' });
  if (M.energy < 20) out.push({ k: 'exhausted', label: 'Exhausted', dis: 'all', d: 'Disadvantage on everything. Mistakes at work become likely; pages come slowly.' });
  else if (M.energy < 40) out.push({ k: 'tired', label: 'Tired', dis: ['eth', 'com', 'vis'], d: 'Disadvantage on Work ethic, Composure and Vision. Fewer pages, slower learning.' });
  if (M.stress >= 75) out.push({ k: 'frayed', label: 'Frayed', dis: ['cha', 'col', 'com'], d: 'Disadvantage with people. You might snap at someone. Burnout is close.' });
  else if (M.stress >= 50) out.push({ k: 'stressed', label: 'Stressed', dis: ['com'], d: 'Disadvantage on Composure. Sleep comes harder.' });
  if (M.energy >= 75 && M.stress < 15) out.push({ k: 'zone', label: 'In the zone', adv: Object.keys(SUB2C), d: 'Advantage on craft checks and faster learning.' });
  if (typeof relConditions === 'function') out.push(...relConditions());
  return out;
}
function condMul() { const c = conditionsOf().map(x => x.k); return c.includes('exhausted') ? .5 : c.includes('tired') ? .75 : c.includes('zone') ? 1.2 : 1; }
// The diary: 7 days x 3 blocks. Older saves planned a day activity and an evening; those become blocks.
function calOf() {
  const M = S.me;
  if (!M.cal) M.cal = Array.from({ length: 7 }, (_, d) => { const a = (M.plan || [])[d] || 'rest', e = (M.eve || [])[d] || 'home'; return [a, a, OLD_EVE[e] || e]; });
  return M.cal;
}
// The plan as it will run: job days take the morning and afternoon of the first weekdays; burnout makes it all rest.
function planBlocks() {
  const M = S.me, cal = calOf().map(r => r.map(k => BLOCK_ACTS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) ? k : 'rest'));
  let need = jobDays();
  for (let d = 0; d < 7 && need > 0; d++, need--) { cal[d][0] = 'work'; cal[d][1] = 'work'; }   // weekdays first, then weekends
  return M.wk && M.wk.burnt ? cal.map(() => ['rest', 'rest', 'home']) : cal;
}
function effectivePlan() { return planBlocks().map(r => r[1]); }   // the day's main activity, for older callers
function countBlocks(k) { return planBlocks().reduce((n, r) => n + r.filter(x => x === k).length, 0); }
function appSlots() { return countBlocks('hunt') * 3; }
function setPlan(a) {
  const M = S.me, W = M.wk, cal = calOf();
  const fromAbs = W ? W.day * 3 + W.block : 0;
  if (a.cal) for (let d = 0; d < 7; d++) for (let b = 0; b < 3; b++) if (d * 3 + b >= fromAbs && a.cal[d] && a.cal[d][b]) cal[d][b] = a.cal[d][b];
  if (a.plan && !a.cal) for (let d = 0; d < 7; d++) for (let b = 0; b < 2; b++) if (d * 3 + b >= fromAbs && a.plan[d]) cal[d][b] = a.plan[d];
  if (a.eve && !a.cal) for (let d = 0; d < 7; d++) if (d * 3 + 2 >= fromAbs && a.eve[d]) cal[d][2] = OLD_EVE[a.eve[d]] || a.eve[d];
  if (a.train) M.train = a.train;
  if (a.catchWith !== undefined) M.catchWith = a.catchWith ?? null;
}
function startWeek() {
  const M = S.me, me = ME(), burnt = M.burnout > 0;
  if (burnt) { for (const j of M.jobs) { j.missed = (j.missed || 0) + 1; if (j.head !== null) addTie(me, P(j.head), -4); } M.burnout--; }
  M.wk = { day: 0, block: 0, burnt, cashIn: 0, cashOut: 0, stress: 0, gains: {}, hunted: 0, studied: 0, L: [], cards: [], out: -1 };
}
// Live on: 'next' until the next notable thing, 'day' to the end of the day, 'end' to the end of the week.
// All of them stop the moment something needs a decision.
function liveOn(a) {
  setPlan(a);
  const M = S.me;
  if (!M.wk) startWeek();
  const day0 = M.wk.day, mode = a.t;
  for (let guard = 0; guard < 40; guard++) {
    const n0 = M.wk.cards.length, closed = blockStep(a);
    if (closed || pending().length) return;
    if (mode === 'next' && M.wk.cards.slice(n0).some(c => c.notable)) return;
    if (mode === 'next' && M.wk.day !== day0) return;   // a new day is worth a look
    if (mode === 'day' && M.wk.day !== day0) return;
  }
}
function card(icon, title, lines, extra = {}) { const W = S.me.wk; W.cards.push({ d: W.day, b: W.block, icon, title, lines: lines.filter(Boolean), ...extra }); if (W.cards.length > 60) W.cards.splice(0, W.cards.length - 60); }
function weekGain(k, v) { const W = S.me.wk, g = growSub(ME(), k, v * learnRate(ME()) * condMul()); if (g) W.gains[k] = (W.gains[k] || 0) + g; }
function dayPlan() { return effectivePlan(); }
function blockStep(a) {
  const M = S.me, W = M.wk, d = W.day, b = W.block;
  M.lastRoll = null;
  const n0 = pending().length, ph0 = M.phoneN || 0;
  const appt = typeof apptAt === 'function' ? apptAt(d, b) : null;
  if (appt) runAppointment(appt); else runBlock(planBlocks()[d][b]);
  if (b === 0 && typeof lifeMorningEvent === 'function') lifeMorningEvent();
  if (typeof phoneTick === 'function') phoneTick(d, b);
  const last = W.cards[W.cards.length - 1];
  if (last && (pending().length > n0 || (M.phoneN || 0) > ph0 || last.roll || last.notable)) last.notable = true;
  W.block++;
  if (W.block > 2) { sleepNight(); W.block = 0; W.day++; }
  if (W.day >= 7) { closeWeek(a); return true; }
  return false;
}
// Getting out of the house costs a commute, once a day.
function commute() {
  const M = S.me, W = M.wk;
  if (W.out === W.day) return null;
  W.out = W.day;
  const v = vehicleOf();
  M.energy = clamp(M.energy - Math.max(0, v.e + (typeof hoodFx === 'function' ? hoodFx().commute || 0 : 0) + worldFx().commute), 0, 100);
  W.stress += v.stress || 0;
  return v.commute[(S.week + W.day) % v.commute.length];
}
const AT_HOME = new Set(['rest', 'home', 'write', 'read']);
// A work block costs what the job asks of you: shooting days hardest, senior jobs harder, two jobs at once hardest of all.
function workCost() {
  const M = S.me; let c = 12;
  for (const j of M.jobs) { const f = j.film !== null && j.film !== undefined ? S.films[j.film] : null, t = tmplOf(j) || {}; c = Math.max(c, (f ? (f.stage === 2 ? 17 : 14) : 12) + Math.max(0, (t.lv ?? 2) - 2)); }
  return Math.min(24, c + 4 * Math.max(0, M.jobs.length - 1));
}
const RESTFUL = new Set(['rest', 'home', 'read', 'out']);
function runBlock(k) {
  const M = S.me, me = ME(), W = M.wk, A = BLOCK_ACTS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) || BLOCK_ACTS.rest;
  M.energy = clamp(M.energy - (k === 'work' && M.jobs.length ? workCost() : A.e || 0), 0, 100);
  W.stress += A.stress || 0;
  if (RESTFUL.has(k) || A.venue) W.restN = (W.restN || 0) + 1;
  if (A.cost) W.cashOut += usd(A.cost);
  const L = [], n0 = W.L.length;
  const c = AT_HOME.has(k) || W.block === 2 ? null : commute();
  switch (k) {
    case 'work': L.push(...workDay()); break;
    case 'hunt': W.hunted++; L.push(pickLine(HUNT_LINES, W.day + W.block)); break;
    case 'network': networkDay(W.L); break;
    case 'catchup': catchupDay(W.L); break;
    case 'write': writeSession(L, .5); break;
    case 'train': for (const s in CRAFTS[M.train].subs) weekGain(s, .01 * (homeFx().train.includes(M.train) ? 1.4 : 1)); L.push(`A class in ${CRAFTS[M.train].label.toLowerCase()}. ${pickLine(CLASS_LINES, W.day + W.block)}`); break;
    case 'study': W.studied++; if (M.school) { for (const s in CRAFTS[M.school.craft].subs) weekGain(s, PROGRAMS[M.school.prog].grow / 2); L.push(pickLine(CLASS_LINES, W.day + 3)); } else L.push('You meant to study, but you aren\'t enrolled anywhere.'); break;
    case 'hustle': W.cashIn += usd(Math.round(75 * worldFx().hustle)); L.push(pickLine(HUSTLE_LINES, W.day + W.block)); break;
    case 'rest': L.push(pickLine(W.block === 0 ? MORNING_FREE : REST_LINES, W.day + W.block)); break;
    case 'home': L.push(pickLine(HOME_LINES, W.day)); break;
    case 'out': W.stress += worldFx().out; L.push(pickLine(OUT_LINES, W.day)); break;
    case 'read': weekGain('tas', .025); L.push(pickLine(READ_LINES, W.day)); break;
    default: if (A.venue && typeof venueEvening === 'function') L.push(...venueEvening(A));
  }
  const sn = W.block === 0 ? smallNews() : null;
  card(A.icon || '•', A.label, (c && W.block < 2 ? [c] : []).concat(sn ? [sn] : [], L, W.L.slice(n0)), { roll: M.lastRoll, notable: k === 'network' || !!A.venue && W.L.length > n0 });
  if (typeof lifeDayEvent === 'function') lifeDayEvent(k === 'out' || A.venue ? 'evening:' + k : k);
}
function sleepNight() {
  const M = S.me, me = ME(), life = ORIGIN.life[M.life];
  const sleep = 19 + worldFx().sleep + (typeof hoodFx === 'function' ? hoodFx().rest || 0 : 0) + homeFx().energy * .8 + (M.body.stamina - 10) * .8 + life.rest * .6 + traitSum(me, 'energy') * .5 - Math.max(0, M.stress - 40) / 5;
  M.energy = clamp(M.energy + clamp(sleep, 8, 40), 0, 100);
  const stressNow = M.stress + M.wk.stress;
  if (stressNow >= 96 && !M.burnout) { M.burnout = 1; inbox('note', 'You hit the wall', 'You can\'t get out of bed. Your body has decided: next week is rest, whatever you planned.'); }
}
// ---- work days ----
function workDay() {
  const M = S.me, me = ME(), out = [];
  for (const j of M.jobs) {
    const f = j.film !== null ? S.films[j.film] : null, t = tmplOf(j);
    out.push(`${f ? f.title : j.t}: ${pickLine(f ? JOB_DAY_LINES[f.stage] || JOB_DAY_LINES[2] : OFFICE_LINES, M.wk.day * 3 + M.wk.block + j.id)}`);
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
function eveningOf(k) { return BLOCK_ACTS[k] || EVENINGS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) || BLOCK_ACTS.home; }
function vehicleOf() { return typeof VEHICLES !== 'undefined' ? VEHICLES[S.me.vehicle || 'transit'] : { icon: '🚌', e: 2, commute: ['The bus, a podcast, a seat if you\'re lucky.'] }; }
function writeSession(L, scale = 1) { if (typeof writeOnScript === 'function') return writeOnScript(L, scale); S.me.spec.pages += Math.round((4 + ME().mind.eth / 4) * scale * condMul()); L.push('You write.'); }
// ---- Week focus and autopilot ----
// Instead of 21 choices, pick what your days are for and how you spend your evenings. Autopilot writes the diary
// for the coming week and bends it to how you are: tired means more rest, frayed means a night out, broke means
// shifts, enrolled means classes. You can still fine-tune any block by hand.
const DAY_FOCUS = {
  balanced: { label: 'Balanced', icon: '⚖️', d: 'A bit of everything: look for work, write, one class.', days: [['hunt', 'write'], ['hunt', 'network'], ['hunt', 'write'], ['train', 'hunt'], ['hunt', 'write']] },
  hunt: { label: 'Job hunting', icon: '📋', d: 'Applications every day, a mixer twice. Most applications, slow skills.', days: [['hunt', 'hunt'], ['hunt', 'network'], ['hunt', 'hunt'], ['hunt', 'network'], ['hunt', 'hunt']] },
  craft: { label: 'Get better', icon: '🎓', d: 'Classes most mornings. Skills grow fastest; costs money.', days: [['train', 'hunt'], ['train', 'read'], ['train', 'hunt'], ['train', 'read'], ['hunt', 'hunt']] },
  write: { label: 'Writing', icon: '✍️', d: 'Pages, pages, pages. Your scripts move fastest.', days: [['write', 'write'], ['write', 'hunt'], ['write', 'write'], ['write', 'hunt'], ['write', 'write']] },
  social: { label: 'Networking', icon: '🥂', d: 'Mixers and coffees. More people, warmer ties; costs money.', days: [['hunt', 'network'], ['catchup', 'network'], ['hunt', 'network'], ['catchup', 'network'], ['hunt', 'hunt']] },
  money: { label: 'Pay the rent', icon: '🛵', d: 'Side hustles most days. Money now, no progress.', days: [['hustle', 'hustle'], ['hustle', 'hunt'], ['hustle', 'hustle'], ['hustle', 'hunt'], ['hustle', 'hustle']] },
  recover: { label: 'Recover', icon: '🛋️', d: 'Rest and easy days. Energy and stress come back.', days: [['rest', 'read'], ['rest', 'hunt'], ['rest', 'read'], ['rest', 'hunt'], ['rest', 'read']] }
};
const EVE_STYLE = {
  quiet: { label: 'Quiet nights', icon: '🏠', eves: ['home', 'read', 'home', 'read', 'home', 'out', 'home'] },
  social: { label: 'Out and about', icon: '🍻', eves: ['home', 'out', 'v:bar', 'home', 'out', 'out', 'home'] },
  culture: { label: 'Culture', icon: '🎭', eves: ['v:rep', 'home', 'v:gallery', 'read', 'v:theatre', 'v:jazz', 'home'] },
  grind: { label: 'Burn the midnight oil', icon: '🌙', eves: ['write', 'write', 'hunt', 'write', 'home', 'write', 'home'] }
};
function autoCal() {
  const M = S.me, F = M.focus || {}, D = DAY_FOCUS[F.day] || DAY_FOCUS.balanced, E = EVE_STYLE[F.eve] || EVE_STYLE.quiet;
  const cal = Array.from({ length: 7 }, (_, d) => d < 5 ? [D.days[d][0], D.days[d][1], E.eves[d]] : [F.day === 'money' ? 'hustle' : 'rest', F.day === 'write' ? 'write' : 'read', E.eves[d]]);
  const life = ORIGIN.life[M.life];
  if (M.energy < 45) { cal[1][1] = 'rest'; cal[3][1] = 'rest'; }
  if ((M.grind || 0) >= 8) for (const d of [0, 2, 4, 6]) cal[d][2] = 'home';   // worn down: protect the evenings
  if (M.stress > 55) { cal[2][2] = 'out'; cal[5][0] = 'rest'; cal[6][2] = 'home'; }
  if (M.cash < usd(life.rent) * 3 && F.day !== 'money') { cal[1][1] = 'hustle'; cal[3][1] = 'hustle'; cal[5][1] = 'hustle'; }
  if (M.school) { cal[0][0] = 'study'; cal[2][0] = 'study'; if ((PROGRAMS[M.school.prog] || {}).days > 2) cal[4][0] = 'study'; }
  return cal;
}
function setFocus(a) {
  const M = S.me;
  if (a.day && !DAY_FOCUS[a.day] || a.eve && !EVE_STYLE[a.eve]) return false;
  M.focus = Object.assign({ day: 'balanced', eve: 'quiet', auto: true }, M.focus || {}, a.day ? { day: a.day } : {}, a.eve ? { eve: a.eve } : {}, a.auto !== undefined ? { auto: !!a.auto } : {});
  if (M.focus.auto) M.cal = autoCal();
  return true;
}
// What the plan will probably do: energy day by day, stress, money, applications. An estimate, not a promise.
function forecastWeek() {
  const M = S.me, run = planBlocks(), W = M.wk, d0 = W ? W.day : 0, v = vehicleOf();
  const sleep = 19 + homeFx().energy * .8 + (M.body.stamina - 10) * .8 + ORIGIN.life[M.life].rest * .6 + traitSum(ME(), 'energy') * .5;
  let e = M.energy, st = 0, spend = 0, earn = 0; const days = [];
  for (let d = d0; d < 7; d++) {
    let out = false;
    for (let b = (d === d0 && W ? W.block : 0); b < 3; b++) { const k = run[d][b], A = BLOCK_ACTS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) || BLOCK_ACTS.rest; e -= k === 'work' && M.jobs.length ? workCost() : A.e || 0; st += A.stress || 0; if (A.cost) spend += usd(A.cost); if (k === 'hustle') earn += usd(75); if (!AT_HOME.has(k) && b < 2) out = true; }
    if (out) e -= v.e;
    days.push({ d, low: Math.max(0, Math.round(e)) });
    e = clamp(e + clamp(sleep - Math.max(0, M.stress + st - 40) / 5, 8, 40), 0, 100);
  }
  const blocks = [].concat(...run.slice(d0));
  return { days, endE: Math.round(e), stress: Math.round(st), spend, earn, apps: countBlocks('hunt') * 3, writes: blocks.filter(k => k === 'write').length, classes: blocks.filter(k => k === 'train' || k === 'study').length, social: blocks.filter(k => k === 'network' || k === 'catchup' || k === 'out' || String(k).startsWith('v:')).length };
}
