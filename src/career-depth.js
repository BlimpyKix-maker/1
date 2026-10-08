// ---------------- Career depth ----------------
// The whole job catalogue as work you can apply for, jobs for everyone else, school, agents, and the events that
// happen to a life in film. Loaded after career-sim; it adds to POSTS and SCENES and is called from the week.

// ---- Your level: how far up the ladder the board reaches ----
// 0 nobody, 1 a few weeks' work, 2 finding your feet, 3 a working professional, 4 in demand, 5 established.
function careerLevel() {
  const M = S.me, me = ME();
  // time served counts a little; the quality of what you delivered counts more (job scores from the work itself)
  const work = M.past.reduce((t, p) => t + clamp(p.score || 0, -4, 6), 0) + M.jobs.reduce((t, j) => t + clamp(j.score || 0, -4, 6), 0);
  // a reputation needs something under it: without credits, released work or a senior post, it stops at 3 (and 4)
  const body = me.credits.length + (M.works || []).filter(w => w.rel !== undefined).length * .5 + (typeof corpRung === 'function' && corpRung() >= 3 ? 3 : 0);
  const base = Math.min(clamp(Math.floor(me.credits.length * .35 + me.standing / 20 + M.stats.weeks / 90 + clamp(work / 18, -1, 1.5) + (M.agent ? .5 : 0)), 0, 5), body >= 5 ? 5 : body >= 2 ? 4 : 3);
  if (base < 5) return base;
  // past the top of the craft, what counts is a name: awards, fame, a body of work, or the top of a company
  const aw = (me.awards || []).length, fame = me.fame || 0, cr = me.credits.length, rung = typeof corpRung === 'function' ? corpRung() : -1;
  if (me.standing >= 80 && M.stats.weeks >= 400 && (aw >= 2 || fame >= 70 || cr >= 20 || rung >= 7)) return 7;
  if (me.standing >= 60 && M.stats.weeks >= 200 && (aw >= 1 || fame >= 35 || cr >= 8 || rung >= 5)) return 6;
  return 5;
}
// Jobs only come in five tiers: the levels above that are about your name, not the jobs you can do.
function tierLevel() { return Math.min(5, careerLevel()); }
const LEVEL_NAME = ['Nobody yet', 'Getting work', 'Finding your feet', 'Working professional', 'In demand', 'Established', 'A name people know', 'A legend of the business'];

// ---- The catalogue as postings ----
const DEPT_HEAD = { Directed: 'prod', Writing: 'prod', Cast: 'dir', Produced: 'prod', Music: 'mus', Cinematography: 'dp', 'Film Editing': 'ed', 'Casting By': 'cst', 'Production Design': 'pd', 'Art Direction': 'pd', 'Set Decoration': 'pd', 'Costume Design': 'cos', 'Makeup Department': 'mu', 'Production Management': 'prod', 'Second Unit Director or Assistant Director': 'ad', 'Art Department': 'pd', 'Property Department': 'pd', 'Sound Department': 'snd', 'Special Effects': 'vfx', 'Visual Effects': 'vfx', Stunts: 'stn', 'Camera and Electrical Department': 'dp', 'Animation Department': 'vfx', 'Casting Department': 'cst', 'Costume and Wardrobe Department': 'cos', 'Editorial Department': 'ed', 'Location Management': 'prod', 'Music Department': 'mus', 'Script and Continuity Department': 'ad', 'Transportation Department': 'prod', 'Additional Crew': 'prod', Choreography: 'dir', 'Color Department': 'ed', 'Craft Services': 'prod', 'Health and Safety': 'ad', 'Intimacy Coordination': 'ad', Legal: 'prod', 'Production Department': 'prod', 'Production Finance and Accounting': 'prod', Publicity: 'prod', Puppetry: 'vfx', 'Voice Actors – Dubbing': 'dir', 'Studio Facilities/Equipment (Additional Crew)': 'prod' };
const DEPT_STAGE = { Writing: [0], Produced: [0, 1], 'Casting By': [1], 'Casting Department': [1], 'Production Design': [1, 2], 'Art Direction': [1, 2], 'Set Decoration': [1, 2], 'Art Department': [1, 2], 'Property Department': [1, 2], 'Costume Design': [1, 2], 'Costume and Wardrobe Department': [1, 2], 'Location Management': [1, 2], 'Production Management': [1, 2], 'Production Finance and Accounting': [1, 2, 3], 'Film Editing': [3], 'Editorial Department': [3], 'Color Department': [3], 'Visual Effects': [2, 3], 'Animation Department': [2, 3], Music: [3], 'Music Department': [3], Publicity: [3], Legal: [0, 1] };
const LV_RATE = [70, 190, 380, 620, 1000, 1800], LV_REQ = [0, 0, 7, 10, 12.5, 15];
// Which sub-skills a job uses: the craft's subs that its listing mentions, else the craft's first three.
function jobSubs(j) {
  const C = CRAFTS[j.craft] || CRAFTS.pro, text = (j.t + ' ' + (j.resp || []).join(' ') + ' ' + (j.sk || []).join(' ')).toLowerCase();
  const hit = Object.entries(C.subs).filter(([, lab]) => lab.toLowerCase().split(/[ &]+/).some(w => w.length > 3 && text.includes(w))).map(([k]) => k);
  return (hit.length ? hit : Object.keys(C.subs)).slice(0, 3);
}
const needsDegree = j => (j.sk || []).some(s => /degree|bachelor|\bBA\b|\bBS\b|MFA|JD\b|law school/i.test(s));
const isIntern = j => j.lv === 0 || /intern/i.test(j.t) || j.dept === 'Internships';
// Annual or hourly pay from the listing, as a daily rate in today's dollars.
function payRate(j) {
  const m = (j.pay || '').replace(/,/g, '').match(/\$(\d+(?:\.\d+)?)(k)?/i);
  if (!m) return LV_RATE[j.lv];
  let v = +m[1] * (m[2] ? 1000 : 1);
  if (/hour|hr/i.test(j.pay)) return Math.round(v * 8);
  if (/week/i.test(j.pay)) return Math.round(v / 5);
  if (/day/i.test(j.pay)) return Math.round(v);
  return v > 1000 ? Math.round(v / 250) : LV_RATE[j.lv];
}
(function addCataloguePosts() {
  const have = new Set(POSTS.map(p => p.jid).concat(ODD_JOBS.map(p => p.jid)));
  for (const j of JOBS.jobs) {
    if (have.has(j.id) || !CRAFTS[j.craft]) continue;
    const crew = j.sec === 'Production crew';
    if (crew && !DEPT_HEAD[j.dept]) continue;
    const intern = isIntern(j), tier = intern ? 0 : clamp(j.lv, 1, 5);
    const base = { k: 'c:' + j.id, jid: j.id, t: j.t, tier, subs: jobSubs(j), rate: intern ? (/unpaid/i.test(j.pay || '') ? 0 : 60) : crew ? LV_RATE[tier] : payRate(j), req: LV_REQ[tier], cr: crew && /^yes/i.test(j.cr || '') ? 1 : 0, deg: needsDegree(j) ? 1 : 0, intern: intern ? 1 : 0, cat: 1 };
    if (crew) POSTS.push(Object.assign(base, { st: DEPT_STAGE[j.dept] || [2], head: DEPT_HEAD[j.dept], days: j.dept === 'Writing' || j.dept === 'Cast' ? (tier <= 1 ? 2 : 5) : 5, actor: j.craft === 'act' ? 1 : 0, union: j.dept === 'Second Unit Director or Assistant Director' && tier >= 2 ? 1 : 0 }));
    else ODD_JOBS.push(Object.assign(base, { biz: j.dept, days: intern ? 3 : 5, weeks: intern ? 10 : 12 + (j.lv * 7) % 30, d: (j.resp || [])[0] ? j.resp[0].charAt(0).toUpperCase() + j.resp[0].slice(1) + '.' : j.dept }));
    have.add(j.id);
  }
  for (const p of POSTS) POST_BY[p.k] = p;
  for (const p of ODD_JOBS) ODD_BY[p.k] = p;
})();
// Can you even apply? Some jobs want a degree or union training, unless your credits speak for you.
// Which jobs are union jobs: the catalogue knows each job's union.
let JOB_UNION = null;
function isUnionJob(t) { if (!JOB_UNION) { JOB_UNION = {}; for (const j of JOBS.jobs) JOB_UNION[j.id] = !!j.un && !/^(non|none)/i.test(j.un); } return !!(t && t.jid && JOB_UNION[t.jid]); }
function blockedFrom(t) {
  const M = S.me, me = ME();
  if (t.deg && !M.degrees.length && me.credits.length < 3) return 'Wants a degree';
  if (M.flags && M.flags.scab !== undefined && S.week - M.flags.scab < 104 && (t.union || isUnionJob(t))) return 'The union remembers you crossed the picket line';
  if (t.union && !M.degrees.includes('union') && me.credits.length < 4 && !(M.flags && M.flags.organiser !== undefined)) return 'Union training or 4 credits';
  if ((t.tier || 1) >= 3 && careerLevel() < t.tier - 1) return `Needs experience: level ${t.tier - 1} or more`;
  if (t.req && subScore(t) < t.req - 4) return 'Needs stronger skills for this one';
  return null;
}
// The extra listings each week: catalogue crew jobs on films around you, industry jobs at companies, internships.
// Casting calls: speaking parts are cast, not crewed, so they don't come up with the other jobs. Actors hear about a
// few parts a week on films in town that are still casting, at their level: day players first, then supporting, then leads.
function castingBoard(films) {
  const M = S.me, me = ME(); if (MAIN[me.role] !== 'act') return [];
  const L = tierLevel(), busy = new Set(M.jobs.map(j => j.film + ':' + j.k));
  // open calls reach one tier higher than ordinary postings: anyone can audition
  const parts = POSTS.filter(t => t.tier <= (t.tier <= 2 ? L + 2 : L + 1) && t.tier >= Math.max(1, L - 2) && (t.actor || (() => { const J = typeof jobRow === 'function' ? jobRow(t) : null; return J && /^Cast$/.test(J.dept) || /voice actor|dubbing actor|narrator/i.test(t.t); })()) && !/Background|Extra|Stand-In|Double|Stunt|Assistant/i.test(t.t));
  if (!parts.length) return [];
  const out = [], n = 2 + Math.floor(L / 2) + (M.agent ? 1 : 0);
  for (const f of films.slice().sort(() => prnd() - .5)) {
    if (out.length >= n) break;
    if (f.stage > 2 || prnd() > .45) continue;
    const opts = parts.filter(t => t.st.includes(f.stage) && headOf(f, t.head) !== null && !busy.has(f.id + ':' + t.k));
    if (opts.length) { const p = makePost(ppick(opts), f); p.casting = 1; out.push(p); }
  }
  return out;
}
function depthBoard(films) {
  const M = S.me, L = tierLevel(), out = [];
  const busy = new Set(M.jobs.map(j => j.film + ':' + j.k));
  const fit = t => t.tier <= L + 1 && (t.tier >= L - 2 || t.tier === 0);
  for (const f of films) {
    if (out.length >= 1 + L) break;
    if (prnd() > .3) continue;
    const opts = POSTS.filter(t => t.cat && fit(t) && t.st.includes(f.stage) && headOf(f, t.head) !== null && !busy.has(f.id + ':' + t.k));
    if (opts.length) out.push(makePost(ppick(opts), f));
  }
  const biz = ODD_JOBS.filter(t => t.cat && fit(t) && !M.jobs.some(j => j.k === t.k));
  const cos = S.companies.filter(c => c.hub === M.hub && c.closed === null);
  for (let i = 0, n = biz.length ? 1 + (prnd() < .5 ? 1 : 0) + Math.floor(L / 2) : 0; i < n; i++) { const p = makePost(ppick(biz), null); if (cos.length) p.co = ppick(cos).id; out.push(p); }
  if (typeof fieldPosts === 'function') out.push(...fieldPosts());
  if (typeof corpPosts === 'function') out.push(...corpPosts());
  if (typeof tvPosts === 'function') out.push(...tvPosts());
  return out;
}

// ---- Everyone else's job titles ----
const ROLE_DEPTS = { director: ['Directed'], writer: ['Writing'], actor: ['Cast'], producer: ['Produced', 'Production Management'], dp: ['Cinematography', 'Camera and Electrical Department'], editor: ['Film Editing', 'Editorial Department', 'Color Department'], composer: ['Music', 'Music Department'], designer: ['Production Design', 'Art Direction', 'Art Department', 'Set Decoration'], costume: ['Costume Design', 'Costume and Wardrobe Department'], sound: ['Sound Department'], vfx: ['Visual Effects', 'Special Effects', 'Animation Department'], makeup: ['Makeup Department'], casting: ['Casting By', 'Casting Department'], ad: ['Second Unit Director or Assistant Director', 'Script and Continuity Department'], stunts: ['Stunts'] };
const OCC_BY_ROLE = {};
for (const r in ROLE_DEPTS) OCC_BY_ROLE[r] = JOBS.jobs.filter(j => j.sec === 'Production crew' && ROLE_DEPTS[r].includes(j.dept) && j.lv >= 1);
// What someone actually does, from their department and standing. Stable for a person; never touches the RNG.
function occupationOf(p) {
  const L = OCC_BY_ROLE[p.role];
  if (!L || !L.length) return ROLE_LABEL[p.role];
  const lv = clamp(Math.round(1 + p.standing / 22), 1, 5);
  const near = L.filter(j => j.lv === lv);
  const pool = near.length ? near : L.slice().sort((a, b) => Math.abs(a.lv - lv) - Math.abs(b.lv - lv)).slice(0, 4);
  return pool[(p.id * 2654435761 >>> 0) % pool.length].t.replace(/\s*\(see [^)]*\)/i, '');
}

// ---- School ----
const PROGRAMS = {
  short: { label: 'Short course', d: 'Eight weeks of evenings in one craft. A certificate and a few new faces.', weeks: 8, days: 1, fee: 80, grow: .03, deg: null },
  cc: { label: 'Community college certificate', d: 'A year of practical classes, two sessions a week. Cheap and useful.', weeks: 40, days: 2, fee: 70, grow: .035, deg: 'cert' },
  ba: { label: 'Degree, part-time', d: 'Three study sessions a week for two years. Opens the doors that ask for a degree.', weeks: 100, days: 3, fee: 230, grow: .03, deg: 'ba' },
  mfa: { label: 'Film school (MFA)', d: 'Two years, four study sessions a week, a thesis film and classmates who will run the business.', weeks: 90, days: 4, fee: 520, grow: .05, deg: 'mfa', mates: 2 },
  union: { label: 'Union training programme', d: 'Paid on-set training for assistant directors. Hard to get into; the jobs that follow pay well.', weeks: 40, days: 4, fee: -260, grow: .04, deg: 'union', craft: 'dir', apply: ['eth', 13] }
};
// A course asks for study sessions a week (blocks of study, any day): `days` on a programme is that number.
function schoolDaysDone() { return studySessionsDone(); }
// Days at school this week: a day counts if you studied in any block of it. Days already lived count what you did;
// days still ahead count what's planned.
function schoolDays() {
  const W = S.me && S.me.wk, plan = planBlocks(), now = W ? W.day * 3 + W.block : 0;
  let n = studySessionsDone(); for (let a = now; a < 21; a++) if (plan[Math.floor(a / 3)][a % 3] === 'study') n++;
  return n;
}
function enrol(a) {
  const M = S.me, P0 = PROGRAMS[a.prog];
  if (!P0 || M.school || !CRAFTS[a.craft || P0.craft]) return false;
  if (P0.apply) { const ok = roll(P0.apply[0], P0.apply[1]); inbox('note', ok ? `In: ${P0.label}` : `Not this year: ${P0.label}`, ok ? 'You start next week. Your study sessions go in your diary automatically.' : 'Hundreds applied for a handful of places. You can try again in six months.', { roll: M.lastRoll }); if (!ok) { M.schoolTry = S.week; return true; } }
  M.school = { prog: a.prog, craft: a.craft || P0.craft, done: 0, missed: 0, start: S.week };
  diary(`You enrol: ${P0.label.toLowerCase()} (${CRAFTS[M.school.craft].label.toLowerCase()}).`);
  return true;
}
// Called when the week closes: fees, progress, classmates, graduation.
function schoolWeek(L, gain) {
  const M = S.me, me = ME(), sc = M.school;
  if (!sc) return 0;
  const P0 = typeof schoolProg === 'function' ? schoolProg(sc) : PROGRAMS[sc.prog], days = schoolDaysDone();   // the week is over: count the days you went
  for (const k in CRAFTS[sc.craft].subs) gain(k, P0.grow * Math.min(days, P0.days));
  if (days >= P0.days) { sc.done++; sc.missed = 0; } else if (S.week - 1 <= sc.start) { /* the week you enrolled doesn't count against you */ } else { sc.missed++; L.push(`You missed classes (${days} of ${P0.days} study sessions).`); }
  if (P0.mates && days && prnd() < .08) { const q = youngNPC(M.hub, ppick(['director', 'writer', 'dp', 'editor', 'producer', 'actor'])); meet(q.id, 'Classmate', 8); L.push(`You get to know ${q.name}, a ${ROLE_LABEL[q.role].toLowerCase()} in your year.`); }
  if (sc.missed >= 4) { inbox('note', 'Dropped out', `You missed too many weeks of ${(sc.at ? P0.label : P0.label.toLowerCase())}. The school lets you go.`); M.school = null; return 0; }
  if (sc.done >= P0.weeks) {
    if (P0.deg && !M.degrees.includes(P0.deg)) M.degrees.push(P0.deg);
    if (typeof schoolGraduate === 'function') schoolGraduate(sc);
    if ((P0.deg === 'mfa' || P0.deg === 'ba') && typeof thesisShort === 'function') thesisShort(sc);
    me.standing = clamp(me.standing + (P0.deg === 'mfa' ? 3 : 1) + (sc.at && SCHOOL_BY[sc.at] ? [0, 3, 1.5, 0][SCHOOL_BY[sc.at][4]] : 0), 0, 100);
    milestone(`Graduated: ${(sc.at ? P0.label : P0.label.toLowerCase())} in ${CRAFTS[sc.craft].label.toLowerCase()}`, 'school');
    inbox('news', 'Graduation', `You finish ${(sc.at ? P0.label : P0.label.toLowerCase())} in ${CRAFTS[sc.craft].label.toLowerCase()}.${P0.deg ? ' The certificate goes on the wall, and on every application.' : ''}`);
    M.school = null;
  }
  return P0.fee;   // a negative fee is a stipend
}

// ---- Agents ----
// Agencies differ: what they specialise in and how they treat clients.
// focus: talent (actors), lit (writers and directors), crew (heads of department and below the line), all.
// style: shark (bigger cut, more pitches, little patience), nurturer (patient, steady, opens doors), packager (puts
// you in bigger rooms), boutique (small list, personal), quiet (cheap, does little).
const AGENCY_NAMES = [['Summit Ridge Talent Group', 3, 'all', 'packager'], ['Crossroads Artists Collective', 3, 'all', 'packager'], ['Morrow & Vance', 3, 'talent', 'shark'], ['Allied Story Union', 2, 'lit', 'shark'], ['Garnet & Daughters', 2, 'lit', 'nurturer'], ['Silver Screen Associates', 2, 'talent', 'nurturer'], ['Parallax Agency', 2, 'all', 'quiet'], ['Kaplan Stewart Talent', 1, 'talent', 'boutique'], ['Lighthouse Management', 1, 'all', 'nurturer'], ['The Small Room Agency', 1, 'lit', 'boutique'], ['Second Act Artists', 1, 'talent', 'nurturer'], ['Rough Cut Representation', 1, 'crew', 'boutique'],
  ['Below the Line Partners', 2, 'crew', 'nurturer'], ['Frame & Focus Artists', 2, 'crew', 'shark'], ['Northlight Crew Agency', 1, 'crew', 'quiet'], ['Hammer & Nail Talent', 1, 'talent', 'shark'], ['Inkwell Literary', 1, 'lit', 'nurturer'], ['Marquee Management', 2, 'talent', 'packager'], ['Blue Door Artists', 1, 'all', 'boutique'], ['Coastline Talent', 1, 'talent', 'quiet'], ['Long Take Agency', 2, 'lit', 'boutique'], ['Key Light Collective', 1, 'crew', 'nurturer'], ['Atlas International Talent', 3, 'all', 'shark'], ['Wexford Banks Agency', 3, 'lit', 'packager']];
const AG_STYLE = {
  shark: { label: 'Shark', d: 'Takes 12%, pitches you hard and often, pushes rates up, drops you after twenty quiet weeks.', cut: .12, pitch: 1, pay: .06, patience: 20 },
  nurturer: { label: 'Nurturer', d: 'Takes 10%, sticks with you through dry spells and passes on referrals.', cut: .1, pitch: 0, pay: 0, patience: 45, refs: 1 },
  packager: { label: 'Packager', d: 'Takes 10%, puts you up for jobs well above your level alongside their bigger clients.', cut: .1, pitch: 0, pay: .03, patience: 30, up: 1 },
  boutique: { label: 'Boutique', d: 'Takes 10% of a small list and knows you personally. Fewer pitches, better fits.', cut: .1, pitch: 0, pay: .02, patience: 36, fit: 1 },
  quiet: { label: 'Low-key', d: 'Takes 8% and does the paperwork. Don\'t expect much hustle.', cut: .08, pitch: -1, pay: 0, patience: 30 }
};
const AG_FOCUS = { talent: 'actors', lit: 'writers and directors', crew: 'crew and heads of department', all: 'everyone' };
function agFits(ag, role) { const r = role || ME().role; return ag.focus === 'all' || (ag.focus === 'talent' ? r === 'actor' : ag.focus === 'lit' ? ['writer', 'director', 'producer'].includes(r) : !['actor', 'writer', 'director'].includes(r)); }
function agenciesIn(hub) {
  const r = hashRand([...hub].reduce((a, c) => a * 31 + c.charCodeAt(0), 11) >>> 0), L = AGENCY_NAMES.slice();
  for (let i = L.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [L[i], L[j]] = [L[j], L[i]]; }
  return L.slice(0, 9).map(([n, tier, focus, style], i) => ({ i, name: hubName(hub) === 'Hollywood' || tier < 3 ? n : n + ' ' + hubName(hub), tier, focus, style }));
}
function queryOdds(ag) {
  const M = S.me, me = ME();
  return clamp(logistic(-1.2 - (ag.tier - 1) * 1.1 + me.credits.length * .35 + (me.standing - 8) * .07 + M.spec.drafts * .25 + (M.scripts || []).filter(x => x.grade && 'AB'.includes(x.grade)).length * .3 + (me.fame || 0) * .02 + (agFits(ag) ? .5 : -1) + (ag.style === 'boutique' ? -.3 : 0)), .02, .9);
}
function queryAgency(a) {
  const M = S.me, ag = agenciesIn(M.hub)[a.ag];
  if (!ag || M.agent || (M.queried || {})[a.ag] > S.week - 12) return false;
  (M.queried = M.queried || {})[a.ag] = S.week;
  if (prnd() < queryOdds(ag)) signAgent(ag, 'They read your letter and want to meet. By Friday you have an agent.');
  else inbox('note', `${ag.name} passes`, agFits(ag) ? 'A polite form email. They are not taking on new clients at this time. Try again in a few months, with more on your reel.' : `A polite form email, and a hint: they mostly represent ${AG_FOCUS[ag.focus]}.`);
  return true;
}
function signAgent(ag, why) {
  const M = S.me, q = makePerson(M.hub, 'producer', { age: 30 + Math.floor(prnd() * 20) });
  q.occ = 'Talent agent'; q.agency = ag.name;
  const st = AG_STYLE[ag.style || 'nurturer'];
  M.agent = { ag: ag.i, name: ag.name, tier: ag.tier, id: q.id, since: S.week, lastBook: S.week, cut: st.cut, style: ag.style || 'nurturer', focus: ag.focus || 'all' };
  meet(q.id, 'Your agent', 15); trust(q.id, 20);
  milestone(`Signed with ${q.name} at ${ag.name}`, 'agent');
  inbox('news', `You have an agent: ${q.name}`, `${why} ${q.name} at ${ag.name} takes ${Math.round(st.cut * 100)}% of what you earn. ${st.d}`, { person: q.id });
}
// Extra listings your agent finds, a level above where you'd look yourself, with their pitch behind them.
function agentBoard(films) {
  const M = S.me; if (!M.agent) return [];
  const L = tierLevel(), out = [];
  for (const f of films) {
    const st = AG_STYLE[M.agent.style || 'nurturer'];
    if (out.length >= Math.max(1, M.agent.tier + 1 + st.pitch)) break;
    const opts = POSTS.filter(t => t.tier >= Math.max(1, L + (st.up || 0)) && t.tier <= L + 2 + (st.up || 0) && t.st.includes(f.stage) && headOf(f, t.head) !== null && (!st.fit || t.subs.some(k => SUB2C[k] === MAIN[ME().role])));
    if (!opts.length || prnd() > .5) continue;
    const p = makePost(ppick(opts), f);
    p.agent = 1; p.rate = Math.round(p.rate * (1.1 + .06 * M.agent.tier + st.pay));
    out.push(p);
  }
  return out;
}
function agentWeek() {
  const M = S.me; if (!M.agent) return;
  if (M.jobs.length) M.agent.lastBook = S.week;
  const st = AG_STYLE[M.agent.style || 'nurturer'];
  if (st.refs && (S.week - M.agent.since) % 8 === 7) { M.freeRef = (M.freeRef || 0) + 1; sms(M.agent.id, typeof fresh === 'function' ? fresh(['put your name in for a couple of things this week. apply and I\'ll follow up', 'two things on the board have your name on them. apply, I\'ll make calls', 'I\'ve been talking you up. check the board this week', 'a casting director owes me lunch. apply to anything good and I\'ll chase it', 'quiet week, but I got you a referral. use it'], 'agent', S.week) : 'put your name in for a couple of things this week. apply and I\'ll follow up', 'tip'); }
  if (S.week - M.agent.lastBook > st.patience) { inbox('note', 'Your agent lets you go', `${M.agent.name} drops you: too long without a booking. It isn't personal. It feels personal.`); M.agent = null; M.board = M.board.filter(p => !p.agent); }
}
function agentApproach() {
  const M = S.me, me = ME();
  if (M.agent || pending().some(x => x.kind === 'agentoffer') || me.credits.length < 1 || me.standing < 10 || prnd() > .035 + me.credits.length * .006) return;
  const L = agenciesIn(M.hub).filter(a => a.tier <= 1 + Math.floor(me.credits.length / 3) && agFits(a));
  if (!L.length) return;
  const ag = ppick(L);
  inbox('agentoffer', `${ag.name} calls`, `Someone at ${ag.name} saw your name in the credits and wants to represent you. Ten per cent of everything; better jobs, better money.`, { ag: ag.i, choices: [{ k: 'yes', label: 'Sign with them' }, { k: 'no', label: 'Not yet' }] });
}

// ---- Events: luck, life, big moments and the tabloids ----
// Each is a scene in the inbox. lv: [min, max] career level; fame: needs that much fame. Mostly good luck, as promised.
const LIFE_EVENTS = [
  { id: 'ev_lift', kind: 'luck', lv: [0, 2], w: 3, title: 'A breakdown on Sunset', text: 'A car has died at the lights and its driver is late for a meeting. You recognise {star}.', opts: [
    { k: 'lift', label: 'Offer a lift', check: ['cha', 10], ok: { tie: { star: 12 }, tag: { star: 'Gave them a lift' } }, bad: { tie: { star: 2 } }, t: '{star} talks the whole way and takes your number.', tb: 'A polite thank-you, and silence the rest of the way.' },
    { k: 'push', label: 'Help push it to the kerb', ok: { tie: { star: 5 }, energy: -5 }, t: 'Sweaty, grateful handshake. They\'ll probably remember your face.' }] },
  { id: 'ev_wrongmail', kind: 'luck', lv: [0, 2], w: 3, title: 'Wrong recipient', text: 'An email from {contact}\'s office lands with you by mistake: a list of crew they\'re trying to fill.', opts: [
    { k: 'reply', label: 'Reply, honestly and a little cheekily', check: ['cha', 12], ok: { tie: { contact: 8 }, due: 'contact' }, bad: { tie: { contact: -3 } }, t: 'They laugh, and mention you to their producer.', tb: 'Read as presumptuous. Oh well.' },
    { k: 'forward', label: 'Point out the mistake, nothing more', ok: { tie: { contact: 3 }, trust: { contact: 5 } }, t: 'They thank you for being decent about it.' }] },
  { id: 'ev_ticket', kind: 'luck', lv: [0, 3], w: 2, title: 'A spare ticket', text: 'A friend can\'t make a premiere and hands you their ticket. The after-party is where it happens.', opts: [
    { k: 'work', label: 'Work the room', check: ['cha', 12], ok: { stand: .6, tie: { star: 6 } }, bad: { stress: 4 }, t: 'You leave with three numbers and a hangover.', tb: 'You end up talking to the caterers. Lovely people.' },
    { k: 'watch', label: 'Just watch the film', ok: { xp: { tas: .3 } }, t: 'A good film on a big screen. You remember why.' }] },
  { id: 'ev_windfall', kind: 'luck', lv: [0, 5], w: 1, title: 'Found money', text: 'A tax refund you\'d forgotten about. Or a scratch card. Either way: money.', opts: [
    { k: 'save', label: 'Put it away', ok: { cash: 350 }, t: 'Three hundred and fifty dollars between you and disaster.' },
    { k: 'spend', label: 'Take everyone out', ok: { cash: 120, stress: -8, tie: { friend: 6 } }, t: 'A long, loud dinner. Worth it.' }] },
  { id: 'ev_teacher', kind: 'luck', lv: [0, 2], w: 2, title: 'An old teacher', text: 'A teacher from your school days writes: they\'ve told a former student, now working in film, all about you.', opts: [
    { k: 'thank', label: 'Write back and thank them', ok: { refs: 1, stress: -2 }, t: 'Your next application will come with a word in someone\'s ear.' }] },
  { id: 'ev_birthday', kind: 'life', lv: [0, 5], w: 2, title: 'Your birthday', text: 'Another year. {friend} wants to throw you something.', opts: [
    { k: 'party', label: 'Let them throw a party', ok: { cash: -80, stress: -10, tie: { friend: 5 } }, t: 'Cake, friends, someone\'s guitar. You feel lucky.' },
    { k: 'quiet', label: 'A quiet dinner', ok: { stress: -5 }, t: 'Just what you needed.' },
    { k: 'work', label: 'Work through it', ok: { stress: 4 }, t: 'Nobody on the job knows. That\'s how you like it, apparently.' }] },
  { id: 'ev_family', kind: 'life', lv: [0, 5], w: 1.4, title: 'A call from home', text: 'A parent is in hospital. Not critical, they say. They\'d like to see you.', opts: [
    { k: 'go', label: 'Go home for a few days', ok: { cash: -450, energy: -10, stress: -6 }, t: 'Hospital coffee, old jokes, home cooking. They\'re going to be fine.' },
    { k: 'stay', label: 'Call every day instead', ok: { stress: 9 }, t: 'They understand. You\'re not sure you do.' }] },
  { id: 'ev_breakup', kind: 'life', lv: [0, 5], w: 1, title: 'It\'s over', text: 'The person you\'ve been seeing says you\'re married to the work.', opts: [
    { k: 'fight', label: 'Fight for it', check: ['com', 12], ok: { stress: -3 }, bad: { stress: 10 }, t: 'You promise to make time, and mean it.', tb: 'It doesn\'t work. It rarely does.' },
    { k: 'let', label: 'Let it go', ok: { stress: 6 }, t: 'A few bad nights. Then work.' }] },
  { id: 'ev_flu', kind: 'life', lv: [0, 5], w: 1.2, title: 'Flu', text: 'You wake up shivering. Everyone on the last job had it.', opts: [
    { k: 'rest', label: 'Stay in bed', ok: { energy: -10, stress: -2 }, t: 'Soup and old films. Three days lost.' },
    { k: 'push', label: 'Push through it', check: ['eth', 13], ok: { stand: .2 }, bad: { energy: -25, stress: 6 }, t: 'You make it, somehow.', tb: 'You make it worse. Much worse.' }] },
  { id: 'ev_strike', kind: 'big', lv: [1, 5], w: .5, title: 'The unions walk out', text: 'Contract talks have collapsed. The guilds call a strike, and the picket lines go up outside every studio.', opts: [
    { k: 'picket', label: 'Walk the line', ok: { stand: .8, stress: 4, cash: -100 }, t: 'Weeks of signs and solidarity. Everyone remembers who showed up.' },
    { k: 'nonunion', label: 'Take non-union work', check: ['com', 13], ok: { cash: 600 }, bad: { cash: 300, stand: -2 }, t: 'Money in a lean month, quietly.', tb: 'Someone sees you crossing. It gets around.' }] },
  { id: 'ev_festival', kind: 'big', lv: [2, 5], w: 1, title: 'A festival invitation', text: 'A film you worked on is in a festival lineup, and the producers can fly one more person out.', opts: [
    { k: 'go', label: 'Go, and network hard', check: ['cha', 13], ok: { stand: 1.5, cash: -300, tie: { star: 8 } }, bad: { cash: -300, stress: 4 }, t: 'Panels, parties, a terrace at dawn. People know your name now.', tb: 'Jet lag and a cold. You come back with a tan.' },
    { k: 'stay', label: 'Stay and work', ok: { stress: 2 }, t: 'You watch the photos online.' }] },
  { id: 'ev_awards', kind: 'big', lv: [3, 5], w: .8, title: 'Awards season', text: 'You\'re invited to a guild awards dinner. Black tie, a table near the back, and every decision-maker in town.', opts: [
    { k: 'go', label: 'Go and make an impression', check: ['cha', 14], ok: { stand: 2, tie: { star: 10 } }, bad: { stress: 5 }, t: 'You end the night at a table with people who greenlight films.', tb: 'You talk to a coat-check attendant for most of the night.' },
    { k: 'skip', label: 'Skip it', ok: { stress: -3 }, t: 'Pyjamas and the livestream.' }] },
  { id: 'ev_profile', kind: 'big', lv: [3, 5], w: .8, title: 'The trades call', text: 'A trade magazine wants to include you in a feature on people to watch.', opts: [
    { k: 'yes', label: 'Give a candid interview', check: ['cha', 12], ok: { stand: 2.5, fame: 6 }, bad: { stand: -1, stress: 6 }, t: 'A flattering profile and a good photo.', tb: 'One quote, out of context, follows you around for months.' },
    { k: 'safe', label: 'Give a safe interview', ok: { stand: 1, fame: 3 }, t: 'Bland, but out there.' }] },
  { id: 'ev_paps', kind: 'tabloid', lv: [2, 5], fame: 25, w: 1, title: 'Photographed', text: 'A photographer catches you leaving a restaurant with {star}. The picture is everywhere by morning.', opts: [
    { k: 'laugh', label: 'Laugh it off in public', check: ['com', 12], ok: { fame: 6, tie: { star: 4 } }, bad: { stress: 8, tie: { star: -6 } }, t: 'You handle it like a pro. People like you more.', tb: 'You look rattled in every follow-up shot.' },
    { k: 'silent', label: 'Say nothing', ok: { fame: 3, stress: 3 }, t: 'It blows over in a week.' }] },
  { id: 'ev_rumour', kind: 'tabloid', lv: [2, 5], fame: 20, w: 1, title: 'A rumour in the column', text: 'A gossip column claims you were difficult on your last job. It isn\'t true. Mostly.', opts: [
    { k: 'deny', label: 'Deny it on the record', check: ['cha', 13], ok: { stand: .5 }, bad: { stand: -1.5, stress: 6 }, t: 'Your denial lands well; colleagues back you.', tb: 'The denial becomes the story.' },
    { k: 'ignore', label: 'Ignore it', ok: { stand: -.5, stress: 4 }, t: 'Some people believe it. Most forget.' },
    { k: 'lean', label: 'Lean into it', check: ['com', 14], ok: { fame: 8 }, bad: { stand: -2 }, t: 'A difficult genius? Sells tickets.', tb: 'Now you are known as difficult.' }] },
  { id: 'ev_feud', kind: 'tabloid', lv: [3, 5], fame: 35, w: .6, title: 'A public feud', text: '{rival} takes a swipe at you in an interview.', opts: [
    { k: 'hit', label: 'Hit back', check: ['cha', 14], ok: { fame: 10, tie: { rival: -10 } }, bad: { fame: 4, stand: -2, tie: { rival: -10 } }, t: 'The internet decides you won.', tb: 'The internet decides you both lost.' },
    { k: 'high', label: 'Take the high road', ok: { stand: 1 }, t: 'Classy. People notice.' }] }
];
for (const e of LIFE_EVENTS) SCENES.push(Object.assign({ event: 1, jobs: [] }, e));
// One event at most a week, more often as your life fills up, never the same one within ten weeks.
function maybeEvent() {
  const M = S.me, me = ME(), L = tierLevel();
  if (prnd() > .1 + L * .02) return;
  const ok = LIFE_EVENTS.filter(e => L >= e.lv[0] && L <= e.lv[1] && sceneFresh(e.id, 40) && (!e.fame || (me.fame || 0) >= e.fame));
  if (!ok.length) return;
  let tw = ok.reduce((s, e) => s + e.w, 0), r = prnd() * tw, ev = ok[ok.length - 1];
  for (const e of ok) { r -= e.w; if (r <= 0) { ev = e; break; } }
  const known = Object.keys(M.known).map(Number).filter(id => !P(id).dead);
  const best = known.slice().sort((a, b) => opinion(b) - opinion(a));
  const ctx = { head: null, film: null, mates: [], friend: best[0] ?? null, contact: known.length ? ppick(known) : null,
    rival: known.find(id => M.known[id].tags.includes('Rival')) ?? null };
  if (/\{star\}/.test(ev.text + JSON.stringify(ev.opts))) { const s = bestIn(M.hub, ['actor', 'director'], q => q.fame + prnd() * 20); ctx.star = s ? s.id : null; }
  for (const k of ['star', 'contact', 'friend', 'rival']) if ((ev.text + JSON.stringify(ev.opts)).includes('{' + k + '}') && ctx[k] === null) return;
  inbox('scene', ev.title, fillScene(ev.text, ctx), { scene: ev.id, ctx, ev: ev.kind, choices: ev.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) });
}
