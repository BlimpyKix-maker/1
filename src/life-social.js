// ---------------- People in your life: the phone, appointments and relationships ----------------
// Your phone buzzes as the week goes on: friends inviting you out, gossip, tips, someone who needs a hand. You can
// text anyone you know to fix a coffee, drinks, a date or a session with your mentor; the meeting lands in your
// diary as an appointment and takes that block. People drift if you never see them; friends become close friends,
// a coffee can turn into something more, a senior contact can take you under their wing. Who's in your corner shows
// up in your rolls.
const APPT_KINDS = {
  interview: { icon: '🤝', label: 'Interview', e: 6, stress: 2 },
  coffee: { icon: '☕', label: 'Coffee', e: 4, cost: 8, stress: -1 },
  drinks: { icon: '🍸', label: 'Drinks', e: 8, cost: 30, stress: -3 },
  date: { icon: '🌹', label: 'Date', e: 8, cost: 45, stress: -4 },
  mentor: { icon: '🧭', label: 'Mentor session', e: 5, stress: -1 },
  invite: { icon: '🎟️', label: 'Invitation', e: 9, stress: -2 },
  help: { icon: '📦', label: 'Helping a friend', e: 14, stress: 0 }
};
const REL = {
  partner: { label: 'Partner', icon: '❤️' }, close: { label: 'Close friend', icon: '🤞' }, mentor: { label: 'Mentor', icon: '🧭' },
  friend: { label: 'Friend', icon: '🙂' }, contact: { label: 'Contact', icon: '·' }, rival: { label: 'Rival', icon: '⚔️' },
  ex: { label: 'Ex', icon: '💔' }, cold: { label: 'On bad terms', icon: '❄️' }
};
const REL_ORDER = ['partner', 'close', 'mentor', 'friend', 'rival', 'ex', 'contact', 'cold'];
function aliveKnown() { const M = S.me; return Object.keys(M.known).map(Number).filter(id => !P(id).dead && !P(id).retired && id !== M.id); }
function relOf(id) {
  const M = S.me, r = (M.rel || {})[id];
  if (r && r.s) return r.s;
  const k = M.known[id];
  if (!k) return null;
  if (k.tags.includes('Rival')) return 'rival';
  const o = opinion(id);
  return o >= 55 && k.trust >= 55 ? 'close' : o >= 22 ? 'friend' : o <= -20 ? 'cold' : 'contact';
}
function setRel(id, s) {
  const M = S.me, q = P(id);
  M.rel = M.rel || {};
  if (!s) { delete M.rel[id]; return; }
  M.rel[id] = Object.assign(M.rel[id] || {}, { s, since: S.week, last: S.week });
  if (s === 'partner') milestone(`You and ${q.name} got together`, 'love');
  if (s === 'ex') { milestone(`You and ${q.name} split up`, 'love'); if (M.cohab === id) M.cohab = null; }
  if (s === 'mentor') milestone(`${q.name} became your mentor`, 'work');
}
function partnerOf() { const M = S.me; for (const id in M.rel || {}) if (M.rel[id].s === 'partner' && !P(+id).dead) return +id; return null; }
function mentorOf() { const M = S.me; for (const id in M.rel || {}) if (M.rel[id].s === 'mentor' && !P(+id).dead) return +id; return null; }
function canRomance(id) {
  const M = S.me, q = P(id), r = (M.rel || {})[id];
  if (q.dead || partnerOf() !== null || (r && r.s === 'ex' && S.week - r.since < 26) || (r && r.s === 'mentor')) return false;
  if (M.known[id].tags.includes('Your parent')) return false;
  return Math.abs(ageOf(q) - ageOf(ME())) <= 10 && ageOf(q) >= 18;
}
function seniorTo(id) { return P(id).standing - ME().standing >= 20; }

// ---- the phone ----
function sms(from, t, kind = 'text', extra = {}) {
  const M = S.me, W = M.wk;
  M.phone = M.phone || [];
  M.phone.push({ w: S.week, d: W ? W.day : 0, b: W ? W.block : 0, from, t, kind, ...extra });
  if (M.phone.length > 120) M.phone.splice(0, M.phone.length - 120);
  M.phoneN = (M.phoneN || 0) + 1;
}
const HI_LINES = ['saw something today that made me think of you. how are you??', 'are you still alive? asking for me', 'ok who told you that you could disappear for a month', 'thinking about that night. we should do it again', 'how\'s the hustle', 'you\'ll never guess who I just stood behind in a coffee queue'];
const PARTNER_LINES = ['missing you today', 'home late, save me some of whatever that was', 'I told my mum about you. she has questions', 'you were brilliant this morning. just saying', 'pick up milk? and also me, at 8', 'proud of you. that\'s all.'];
const HOME_CALLS = ['Home calls. They want to know if you\'re eating properly.', 'Your family calls: a cousin is getting married, and are you coming?', 'A call from home. Everyone\'s fine. You feel lighter after.', 'A voicemail from home: "We saw a film. It was terrible. Call us."'];
const GOSSIP_LINES = ['{a} and {b} aren\'t speaking since the wrap party. nobody will say why', 'did you hear {a} walked off a job on Tuesday?', '{a} is apparently writing something. everyone is writing something', 'heard {a} is up for something big. don\'t say I said', '{a} turned up to a meeting in a tuxedo. no explanation', 'apparently {a} and {b} are an item now??'];
const MENTOR_TIPS = [
  'Arrive early, leave late, and never be the reason a setup waits.',
  'Learn everyone\'s name on day one. The grips remember who did.',
  'Your reel should be two minutes of your best work, not ten of all of it.',
  'Say yes to the small job with the good people over the big job with the bad ones.',
  'When you don\'t know, say so, then find out before anyone asks again.',
  'Every department is talking to every other one. Gossip travels faster than call sheets.',
  'Write down what went wrong every night. In a year it\'s a manual.',
  'The work you turn down shapes you as much as the work you take.'
];
// Each block, the phone might go. Gossip the world has queued comes first.
function phoneTick(d, b) {
  const M = S.me, known = aliveKnown();
  if (!M.party || !M.party.done) return;
  if ((M.gossipQ || []).length && prnd() < .35) { const g = M.gossipQ.shift(); sms(g.from ?? null, g.t, 'gossip', g.person !== undefined ? { person: g.person } : {}); return; }
  if (!known.length || prnd() > (b === 2 ? .16 : .07)) return;
  const friends = known.filter(id => ['friend', 'close', 'partner', 'mentor'].includes(relOf(id)));
  const onFilms = known.filter(id => S.active.some(i => keyIds(S.films[i]).includes(id) && S.films[i].hub === M.hub));
  const part = partnerOf(), men = mentorOf();
  const opts = [['gossip', 3], ['home', 1]];
  if (friends.length) opts.push(['invite', 4], ['hi', 2], ['ask', 1]);
  if (onFilms.length) opts.push(['tip', 1]);
  if (part !== null) opts.push(['partner', 3]);
  if (men !== null) opts.push(['mentor', 1]);
  let r = prnd() * opts.reduce((s, o) => s + o[1], 0), kind = opts[0][0];
  for (const [k, w] of opts) { r -= w; if (r <= 0) { kind = k; break; } }
  switch (kind) {
    case 'gossip': {
      if (known.length < 2) return;
      const a = ppick(known), b2 = ppick(known.filter(x => x !== a)), from = ppick(known.filter(x => x !== a && x !== b2).concat([null]));
      sms(from, pickLine(GOSSIP_LINES, a + b2).replace('{a}', P(a).name).replace('{b}', P(b2).name), 'gossip', { person: a });
      return;
    }
    case 'home': sms(null, pickLine(HOME_CALLS, d + b), 'home'); M.wk.stress -= 1; return;
    case 'hi': { const id = ppick(friends); sms(id, pickLine(HI_LINES, id + d), 'text'); addTie(ME(), P(id), 1); return; }
    case 'partner': sms(part, pickLine(PARTNER_LINES, d + b), 'love'); return;
    case 'mentor': { sms(men, pickLine(MENTOR_TIPS, men + S.week), 'tip'); for (const s of Object.keys(CRAFTS[MAIN[P(men).role]].subs).slice(0, 2)) weekGain(s, .01); return; }
    case 'tip': {
      const id = ppick(onFilms), f = S.active.map(i => S.films[i]).find(x => keyIds(x).includes(id));
      if (opinion(id) < 5) { sms(id, `crazy week on ${f.title}. talk soon`, 'text'); return; }
      M.refs[id] = (M.refs[id] || 0) + 1;
      sms(id, `we're hiring on ${f.title}. put your name in and I'll mention you`, 'tip');
      return;
    }
    case 'invite': return inviteFrom(ppick(friends));
    case 'ask': return askFrom(ppick(friends));
  }
}
// Invitations: something to go to, a time, yes or no.
const INVITES = [
  { k: 'birthday', t: '{who}\'s birthday drinks', meet: 1, tie: 5, stress: -4, cost: 25 },
  { k: 'dinner', t: 'a dinner party at {who}\'s', meet: 1, tie: 6, stress: -3, cost: 15 },
  { k: 'screening', t: 'a cast-and-crew screening of {film}', film: 1, meet: 2, tie: 4, xp: { tas: .06 }, stand: .2 },
  { k: 'premiere', t: 'the premiere of {film}', film: 1, senior: 1, meet: 2, tie: 4, stand: .5, cost: 40 },
  { k: 'tableread', t: 'a table read of {who}\'s new script', meet: 1, tie: 5, xp: { dial: .04, struc: .03 } },
  { k: 'football', t: 'a five-a-side game', meet: 1, tie: 3, stress: -5, e: 6 },
  { k: 'gallery', t: 'a gallery opening with {who}', meet: 1, tie: 3, xp: { vis: .05 } },
  { k: 'karaoke', t: 'karaoke with {who}\'s crew', meet: 2, tie: 5, stress: -6, cost: 20 },
  { k: 'wrap', t: 'a wrap party for {film}', film: 1, meet: 3, tie: 3, stress: -3 },
  { k: 'wedding', t: 'a wedding', never: 1, meet: 3, tie: 10, stress: -4, cost: 80 },
  { k: 'festival', t: 'a festival premiere', never: 1, senior: 1, meet: 3, tie: 4, stand: .8, cost: 200, e: 6 },
  { k: 'awards', t: 'the awards', never: 1, senior: 1, meet: 2, tie: 4, stand: .6, cost: 120, stress: -2 }
];
function inviteFrom(id) {
  const M = S.me, q = P(id);
  const film = S.films.find && S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id));
  const pool = INVITES.filter(v => !v.never && (!v.film || film) && (!v.senior || q.standing > 40));
  const v = ppick(pool), slot = freeSlot({ days: [1, 2, 3, 4], blocks: [2], from: 1 });
  if (!slot) return;
  const what = v.t.replace('{who}', q.name).replace('{film}', film ? film.title : 'the film');
  const mine = v.t.replace("{who}'s", 'my').replace(' with {who}', '').replace('{film}', film ? film.title : 'the film');
  sms(id, `${pickLine(['are you free for', 'come to', 'you HAVE to come to', 'any chance you can make'], id + S.week)} ${mine}? ${slotLabel(slot)}`, 'invite');
  inbox('invite', `${q.name} invites you`, `${q.name} asks you to ${what}, ${slotLabel(slot)}.`, { person: id, ev: v.k, film: film ? film.id : undefined, slot, what, choices: [{ k: 'yes', label: `Go (${slotLabel(slot)})` }, { k: 'no', label: 'Make an excuse' }] });
}
function askFrom(id) {
  const q = P(id), slot = freeSlot({ days: [5, 6], blocks: [0, 1], from: 1 });
  if (!slot) return;
  const what = pickLine(['help moving flat', 'a hand painting a set for their short', 'someone to run lines with before an audition', 'a lift to the airport at dawn', 'help building a bookcase that came in 140 pieces'], id + S.week);
  sms(id, `huge favour... ${what}? ${slotLabel(slot)}`, 'ask');
  inbox('ask', `${q.name} needs a favour`, `${q.name} asks for ${what}, ${slotLabel(slot)}. It'll eat the block and some energy.`, { person: id, slot, what, choices: [{ k: 'yes', label: 'Of course' }, { k: 'no', label: 'Say you can\'t' }] });
}
// Picks on the phone's decisions. Returns true if it handled the item.
function socialPick(it, k) {
  const M = S.me, me = ME();
  if (it.kind === 'invite' || it.kind === 'ask') {
    const q = P(it.person);
    if (k === 'yes') {
      if (!slotFree(it.slot)) { it.result = { t: 'You already have something then. You tell them, and they understand.' }; }
      else { bookAppt(Object.assign({ kind: it.kind === 'invite' ? 'invite' : 'help', who: it.person, ev: it.ev, film: it.film, what: it.what }, it.slot)); sms(-1, it.kind === 'invite' ? 'yes! see you there' : 'of course. I\'ll be there', 'mine', { to: it.person }); it.result = { t: `In your diary: ${it.what}, ${slotLabel(it.slot)}.` }; }
    } else { addTie(me, q, it.kind === 'ask' ? -3 : -1); sms(-1, pickLine(['so sorry, can\'t that night', 'ah, I\'m slammed. next time?', 'can\'t, sorry!! have fun'], it.id), 'mine', { to: it.person }); it.result = { t: it.kind === 'ask' ? `${q.name} says it's fine. It isn't quite.` : 'Next time.' }; }
    it.done = true; it.picked = k; return true;
  }
  return false;
}

// ---- the diary of appointments ----
// A slot is { w, d, b }: a week, a day (0 = Monday) and a block (0 morning, 1 afternoon, 2 evening).
// While a week is closing, "now" is already the start of the next one.
function curW() { return S.week + (S.me.closing ? 1 : 0); }
function nowAbs() { const W = S.me.wk; return curW() * 21 + (W ? W.day * 3 + W.block : 0); }
function slotAbs(s) { return s.w * 21 + s.d * 3 + s.b; }
function slotFree(s) {
  const M = S.me;
  if (slotAbs(s) <= nowAbs() - (S.me.wk ? 0 : 1)) return false;
  if ((M.appts || []).some(x => !x.done && x.w === s.w && x.d === s.d && x.b === s.b)) return false;
  if (s.b < 2 && s.d < 5 && s.d < jobDays()) return false;   // the job has those blocks
  return true;
}
function slotLabel(s) {
  const W = S.me.wk, today = s.w === S.week && W && s.d === W.day;
  return `${today ? (s.b === 2 ? 'tonight' : 'today, ' + BLOCKS[s.b].toLowerCase()) : (s.w > curW() ? 'next ' : '') + DAYS7[s.d] + ' ' + BLOCKS[s.b].toLowerCase()}`;
}
// The first free slot from now (or `from` days on), within this week and next.
function freeSlot(o = {}) {
  const W = S.me.wk, d0 = (W ? W.day : 0) + (o.from || 0);
  for (let w = curW(); w <= curW() + 1; w++) for (const d of o.days || [0, 1, 2, 3, 4, 5, 6]) for (const b of o.blocks || [0, 1, 2]) {
    const s = { w, d, b };
    if (w === curW() && d < d0) continue;
    if (slotFree(s)) return s;
  }
  return null;
}
function upcomingSlots(n = 14) {
  const out = [];
  for (let w = curW(); w <= curW() + 1 && out.length < n; w++) for (let d = 0; d < 7 && out.length < n; d++) for (let b = 0; b < 3 && out.length < n; b++) { const s = { w, d, b }; if (slotFree(s)) out.push(s); }
  return out;
}
function bookAppt(o) { const M = S.me; M.appts = M.appts || []; const x = Object.assign({ id: M.seq++, done: false }, o); M.appts.push(x); return x; }
function apptAt(d, b) { const M = S.me; if (M.wk && M.wk.burnt) return null; return (M.appts || []).find(x => !x.done && x.w === S.week && x.d === d && x.b === b) || null; }
function apptsAhead() { const M = S.me, now = nowAbs(); return (M.appts || []).filter(x => !x.done && slotAbs(x) >= now).sort((a, b) => slotAbs(a) - slotAbs(b)); }
// An interview lands in next week's diary, in a weekday block the job doesn't already take.
function bookInterview(post) {
  const M = S.me, w = S.week + 1;
  for (const d of [0, 1, 2, 3, 4].sort(() => prnd() - .5)) for (const b of [0, 1]) {
    if ((M.appts || []).some(x => !x.done && x.w === w && x.d === d && x.b === b)) continue;
    if (d < jobDays()) continue;
    return bookAppt({ w, d, b, kind: 'interview', post, who: post.head });
  }
  return bookAppt({ w, d: 4, b: 2, kind: 'interview', post, who: post.head });
}
function runAppointment(x) {
  const M = S.me, me = ME(), W = M.wk, A = APPT_KINDS[x.kind] || APPT_KINDS.coffee;
  x.done = true;
  const q = x.who !== null && x.who !== undefined ? P(x.who) : null;
  if (q && (q.dead || (x.kind !== 'interview' && x.ev !== 'awards' && x.ev !== 'festival' && !M.known[x.who]))) { card('✖', `${A.label} called off`, [`${q.name} can't make it after all.`], { notable: true }); runBlock(planBlocks()[W.day][W.block]); return; }
  M.energy = clamp(M.energy - (A.e || 0), 0, 100);
  W.stress += A.stress || 0;
  if (A.cost) W.cashOut += usd(A.cost);
  const c = W.block < 2 ? commute() : null, L = [];
  if (q && x.kind !== 'interview') { meet(q.id, x.ev === 'awards' && !M.known[q.id] ? 'Met at the awards' : null); if (M.rel && M.rel[q.id]) M.rel[q.id].last = S.week; }
  switch (x.kind) {
    case 'interview': holdInterview(x.post); L.push(`You go in to see ${q ? q.name : 'them'} about ${x.post.t.toLowerCase()}.`); break;
    case 'coffee': case 'drinks': meetUp(q.id, L, x.kind === 'drinks'); break;
    case 'date': dateNight(q.id, L, x); break;
    case 'mentor': {
      const cr = MAIN[q.role], subs = Object.keys(CRAFTS[cr].subs);
      for (const s of subs.slice(0, 3)) weekGain(s, .03);
      addTie(me, q, 2);
      L.push(`An hour with ${q.name}. ${pickLine(MENTOR_TIPS, q.id + S.week)}`, `You come away a little better at ${CRAFTS[cr].label.toLowerCase()}.`);
      break;
    }
    case 'invite': goToInvite(x, q, L); break;
    case 'help': addTie(me, q, 8); trust(q.id, 6); L.push(`You give up the ${BLOCKS[W.block].toLowerCase()} for ${x.what}. ${q.name} won't forget it.`); M.known[q.id].due++; break;
  }
  card(A.icon, `${A.label}${q ? ' with ' + q.name : ''}`, (c ? [c] : []).concat(L), { roll: M.lastRoll, notable: true });
}
function meetUp(id, L, drinks) {
  const M = S.me, me = ME(), q = P(id), k = M.known[id];
  const ok = roll('cha', 9 - k.trust / 25 - (drinks ? 1 : 0));
  addTie(me, q, (ok ? 6 : 1) + tasteMatch(q) * 2); trust(id, ok ? 4 : 1);
  const film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id) && f.hub === M.hub);
  if (film && opinion(id) > 10 && prnd() < .5) { M.refs[id] = (M.refs[id] || 0) + 1; L.push(`${drinks ? 'Drinks' : 'Coffee'} with ${q.name}: they're on ${film.title} and promise to put your name forward.`); }
  else L.push(`${drinks ? 'Drinks' : 'Coffee'} with ${q.name}. ${ok ? pickLine(['It goes well: two hours vanish.', 'You laugh more than you expected to.', 'You talk about films until they stack the chairs.'], id) : pickLine(['They seem distracted.', 'It\'s a bit stiff. Next time.', 'They keep checking their phone.'], id)}`);
  relStory(id);
}
function dateNight(id, L, x) {
  const M = S.me, r = (M.rel || {})[id];
  if (!r || r.s !== 'partner') { relScene(id, 'rs_spark'); L.push(`A first date with ${P(id).name}. Or is it?`); return; }
  r.last = S.week; r.dates = (r.dates || 0) + 1;
  relScene(id, ppick(['rs_dinner', 'rs_walk', 'rs_film', 'rs_cook']));
  L.push(`An evening with ${P(id).name}.`);
}
function goToInvite(x, q, L) {
  const M = S.me, me = ME(), v = INVITES.find(i => i.k === x.ev) || INVITES[0];
  if (v.cost) M.wk.cashOut += usd(v.cost);
  if (v.e) M.energy = clamp(M.energy - v.e, 0, 100);
  if (v.stress) M.wk.stress += v.stress;
  addTie(me, q, v.tie || 3);
  for (const s in v.xp || {}) weekGain(s, v.xp[s]);
  if (v.stand) me.standing = clamp(me.standing + v.stand, 0, 100);
  const met = [];
  for (let i = 0; i < (v.meet || 0); i++) {
    const nq = bestIn(M.hub, ROLES, p => -Math.abs(p.standing - me.standing - (v.senior ? 25 : 8)) + tie(q, p) * .3 + prnd() * 30);
    if (nq) { meet(nq.id, `Met through ${q.name}`, 4 + pri(0, 4)); met.push(`${nq.name} (${ROLE_LABEL[nq.role].toLowerCase()})`); }
  }
  L.push(`${x.what[0].toUpperCase() + x.what.slice(1)}.${met.length ? ' You meet ' + met.join(' and ') + '.' : ''}`);
  if (v.k === 'awards' && typeof awardsNight === 'function') awardsNight(x, L);
  else if (prnd() < .25) lifeScene(LIFE_SCENES.out);
}

// ---- relationships ----
// After you see someone, their story with you might move on: a spark, a mentor, a confidence, an old wound.
function relStory(id) {
  const M = S.me, rel = relOf(id), o = opinion(id), r = (M.rel || {})[id] || {};
  if (r.storyW && S.week - r.storyW < 4) return;
  let sid = null;
  if (rel === 'ex' && !r.metEx) { sid = 'rs_exmeet'; }
  else if (canRomance(id) && o >= 35 && prnd() < .22) sid = 'rs_spark';
  else if (seniorTo(id) && o >= 30 && mentorOf() === null && rel !== 'partner' && prnd() < .3) sid = 'rs_mentor';
  else if (rel === 'close' && prnd() < .2) sid = 'rs_confide';
  else if (rel === 'partner' && (r.dates || 0) >= 4 && S.week - r.since > 16 && M.cohab !== id && M.life !== 'couch' && prnd() < .3) sid = 'rs_movein';
  if (!sid) return;
  M.rel = M.rel || {};
  M.rel[id] = Object.assign(M.rel[id] || {}, { storyW: S.week }, sid === 'rs_exmeet' ? { metEx: 1 } : {});
  if (!M.rel[id].s) delete M.rel[id].s;
  relScene(id, sid);
}
function relScene(id, sid) {
  const s = SCENES.find(x => x.id === sid);
  if (!s) return;
  const ctx = { head: null, film: null, mates: [], contact: id };
  inbox('scene', fillScene(s.title, ctx), fillScene(s.text, ctx), { scene: s.id, ctx, person: id, choices: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) });
}
const REL_SCENES = [
  { id: 'rs_spark', title: 'Something more?', text: 'Two hours pass like twenty minutes. Outside, {contact} lingers at the corner like neither of you wants to be the first to leave.', opts: [
    { k: 'ask', label: 'Ask them out properly', check: ['cha', 12], ok: { rel: 'partner', tie: { contact: 8 }, stress: -4 }, bad: { tie: { contact: -2 }, stress: 3 }, t: '{contact} says yes before you finish the sentence.', tb: 'They let you down gently: they like you, just not like that. It stings, then it doesn\'t.' },
    { k: 'friend', label: 'Keep it a friendship', ok: { tie: { contact: 3 } }, t: 'Some friendships are worth more than a maybe.' }] },
  { id: 'rs_dinner', title: 'Dinner for two', text: '{contact} has booked somewhere with candles and a wine list you\'re scared of.', opts: [
    { k: 'listen', label: 'Ask about their week, and listen', check: ['cha', 10], ok: { tie: { contact: 6 }, stress: -3 }, bad: { tie: { contact: 1 } }, t: 'You hear things about {contact} you never knew. It\'s a lovely night.', tb: 'You drift back to your own week twice. They notice.' },
    { k: 'shop', label: 'Talk about the business all night', ok: { tie: { contact: -1 }, xp: { tas: .03 } }, t: 'They\'re patient. Mostly.' },
    { k: 'splurge', label: 'Order the good wine', ok: { cash: -60, tie: { contact: 5 }, stress: -2 }, t: 'Worth every penny you don\'t have.' }] },
  { id: 'rs_walk', title: 'A long walk', text: 'You and {contact} walk by the water until the streetlights come on. It\'s the kind of night for saying things.', opts: [
    { k: 'honest', label: 'Tell them what scares you about this business', check: ['com', 11], ok: { tie: { contact: 7 }, trust: { contact: 6 }, stress: -4 }, bad: { tie: { contact: 2 }, stress: 2 }, t: 'They take your hand. "Me too, about mine."', tb: 'It comes out wrong, more complaint than confession.' },
    { k: 'light', label: 'Keep it light', ok: { tie: { contact: 3 }, stress: -3 }, t: 'Ice cream, bad jokes, a good night.' }] },
  { id: 'rs_film', title: 'Their pick', text: '{contact} picks the film tonight. It\'s one you would never, ever choose.', opts: [
    { k: 'open', label: 'Give it a real chance', check: ['tas', 10], ok: { tie: { contact: 5 }, xp: { tas: .05 } }, bad: { tie: { contact: 2 } }, t: 'It\'s better than you thought. You see what they see in it.', tb: 'It\'s exactly as bad as you thought. You laugh about it all the way home.' },
    { k: 'critic', label: 'Tell them what you really think', check: ['cha', 13], ok: { tie: { contact: 4 } }, bad: { tie: { contact: -4 } }, t: 'A glorious argument. You both win.', tb: 'They go quiet. It was their favourite.' }] },
  { id: 'rs_cook', title: 'Staying in', text: '{contact} wants to cook together. Your kitchen has one good knife.', opts: [
    { k: 'cook', label: 'Take charge of the sauce', check: ['eth', 10], ok: { tie: { contact: 5 }, stress: -3 }, bad: { tie: { contact: 2 }, stress: -1 }, t: 'It\'s actually good. They eat a second plate.', tb: 'You burn it. Takeaway, laughing.' },
    { k: 'sous', label: 'Be the sous-chef', ok: { tie: { contact: 4 }, stress: -4 }, t: 'Chopping onions and talking. Nothing better.' }] },
  { id: 'rs_distant', title: '"We need to talk"', text: '{contact}: "I feel like I only see you between call sheets."', opts: [
    { k: 'promise', label: 'Promise a real weekend, and mean it', check: ['com', 11], ok: { tie: { contact: 6 }, stress: -2 }, bad: { tie: { contact: -3 } }, t: 'They believe you. Now keep it.', tb: '"You said that last time."' },
    { k: 'job', label: 'Tell them this is the job', check: ['cha', 14], ok: { tie: { contact: 2 }, trust: { contact: 4 } }, bad: { tie: { contact: -8 }, stress: 4 }, t: 'They understand. They chose someone in film, after all.', tb: 'They go quiet. Something has changed.' },
    { k: 'end', label: 'Maybe this isn\'t working', ok: { rel: 'ex', stress: 6 }, t: 'You end it. The flat is very quiet afterwards.' }] },
  { id: 'rs_movein', title: 'Your place or mine?', text: '{contact} has a drawer at yours, a toothbrush, opinions about your sofa. "Should we just... live together?"', opts: [
    { k: 'yes', label: 'Move in together', ok: { cohab: 1, tie: { contact: 6 }, stress: -3 }, t: 'Boxes, an argument about shelves, then home. Rent splits two ways.' },
    { k: 'notyet', label: 'Not yet', check: ['com', 10], ok: {}, bad: { tie: { contact: -5 } }, t: 'They understand. They say they do, and they mean it.', tb: 'They say they understand. They don\'t.' }] },
  { id: 'rs_mentor', title: 'Ask for help', text: 'Over coffee, {contact} gives you one piece of advice that rearranges your whole year. You could ask for more.', opts: [
    { k: 'ask', label: 'Ask {contact} to mentor you', check: ['cha', 13], ok: { rel: 'mentor', tie: { contact: 4 } }, bad: { tie: { contact: -1 } }, t: '"Call me every few weeks. Bring questions, not complaints."', tb: '"I\'m stretched too thin right now." At least you asked.' },
    { k: 'no', label: 'Just enjoy the coffee', ok: { tie: { contact: 2 } }, t: 'You write the advice on a napkin and keep it.' }] },
  { id: 'rs_confide', title: 'A late call', text: '{contact} calls late. A job fell through and the rent is due. They don\'t ask for anything, which is how you know.', opts: [
    { k: 'listen', label: 'Stay on the phone till they\'re OK', check: ['com', 10], ok: { trust: { contact: 10 }, tie: { contact: 5 } }, bad: { trust: { contact: 3 } }, t: 'Two hours. By the end they\'re laughing.', tb: 'You say the wrong thing once, but you stay on the line.' },
    { k: 'lend', label: 'Lend them $300', ok: { cash: -300, tie: { contact: 10 }, due: 'contact' }, t: 'They pay you back in a month, and owe you a great deal more.' }] },
  { id: 'rs_exmeet', title: 'Across the room', text: 'You see {contact} across the room. The last time you spoke was not your finest hour.', opts: [
    { k: 'friendly', label: 'Go over and say hello', check: ['com', 12], ok: { rel: 'none', tie: { contact: 8 } }, bad: { stress: 4 }, t: 'It\'s easier than you feared. Maybe you can be friends.', tb: 'Stiff smiles. You leave early.' },
    { k: 'avoid', label: 'Leave before they see you', ok: { stress: 2 }, t: 'You make it out. Your heart is going like a drum.' }] }
];
for (const s of REL_SCENES) SCENES.push(Object.assign({ event: 1, jobs: [] }, s));
// What the people around you do to your rolls.
function relConditions() {
  const M = S.me, out = [];
  if (!M.known) return out;
  const part = partnerOf(), lastEx = Object.keys(M.rel || {}).map(Number).filter(id => M.rel[id].s === 'ex').map(id => M.rel[id].since).sort((a, b) => b - a)[0];
  if (part !== null && opinion(part) >= 40) out.push({ k: 'love', label: 'In love', adv: ['com'], d: `${P(part).name} is in your corner. Advantage on Composure.` });
  if (lastEx !== undefined && S.week - lastEx <= 4) out.push({ k: 'heartbroken', label: 'Heartbroken', dis: ['cha'], d: 'A recent break-up. Disadvantage on Charisma for a few weeks.' });
  const known = aliveKnown(), close = known.filter(id => relOf(id) === 'close').length, friends = known.filter(id => ['friend', 'close', 'partner'].includes(relOf(id))).length;
  if (close >= 2) out.push({ k: 'circle', label: 'Good friends', adv: ['col'], d: 'People who have your back. Advantage on Collaboration.' });
  if (!friends && S.week - M.startW > 10) out.push({ k: 'lonely', label: 'Lonely', dis: ['col'], d: 'Nobody to call. Disadvantage on Collaboration. Catch up with someone.' });
  return out;
}
// Each week: ties drift without contact, partners notice when you vanish, mentors check in, friends steady you.
function socialWeek() {
  const M = S.me, me = ME(), known = aliveKnown();
  let stress = 0;
  for (const id of known) {
    const k = M.known[id], o = opinion(id);
    if (S.week - (k.seen ?? k.met) > 8 && o > 15 && !k.tags.includes('Your parent')) addTie(me, P(id), -1);   // out of sight
  }
  const part = partnerOf();
  if (part !== null) {
    const r = M.rel[part], o = opinion(part);
    if (o < 0) { setRel(part, 'ex'); stress += 10; sms(part, 'I think we both know this isn\'t working. I\'m sorry.', 'love'); inbox('note', `You and ${P(part).name} are over`, 'It ends by text, which somehow makes it worse.', { person: part }); }
    else {
      if (o >= 40) stress -= 3;
      if (S.week - r.last >= 3 && (!r.distW || S.week - r.distW >= 4)) { r.distW = S.week; addTie(me, P(part), -4); relScene(part, 'rs_distant'); }
    }
  }
  for (const id in M.rel || {}) if (M.rel[id].s === 'mentor' && (P(+id).dead || opinion(+id) < 0)) { delete M.rel[id]; inbox('note', 'No longer your mentor', `${P(+id).name} ${P(+id).dead ? 'has died. You keep their advice on a napkin by the door.' : 'stops returning your calls.'}`); }
  stress -= Math.min(3, known.filter(id => relOf(id) === 'close').length);
  for (const x of M.appts || []) if (!x.done && slotAbs(x) < (S.week + 1) * 21) { x.done = true; if (x.who !== null && x.who !== undefined && M.known[x.who]) addTie(me, P(x.who), -3); }   // missed
  M.appts = (M.appts || []).filter(x => !x.done || S.week - x.w < 2);
  if (M.cohab !== null && M.cohab !== undefined && partnerOf() !== M.cohab) M.cohab = null;
  return stress;
}
// Text someone to fix a time. The logged action carries the slot, so replays agree.
function textSomeone(a) {
  const M = S.me, me = ME(), id = a.id, k = M.known[id];
  if (!k || P(id).dead) return false;
  const q = P(id), rel = relOf(id), o = opinion(id);
  if (a.kind === 'hi') {
    sms(-1, String(a.msg || '').trim().slice(0, 280) || pickLine(['how are you doing?', 'thinking of you, how\'s things', 'coffee soon?', 'saw this and thought of you'], id + S.week), 'mine', { to: id });
    if (k.hiW !== S.week) { k.hiW = S.week; addTie(me, q, o > 0 ? 1.5 : .5); k.seen = S.week; }
    sms(id, o > 20 ? pickLine(['!!! hi! all good, crazy busy, you?', 'aw. miss you. soon?', 'ha I was literally about to text you'], id) : o > -10 ? pickLine(['hey! good thanks', 'all fine here, you?', 'busy busy'], id) : '...', 'text');
    return true;
  }
  const s = { w: a.w, d: a.d, b: a.b };
  if (!APPT_KINDS[a.kind] || a.kind === 'interview' || a.kind === 'invite' || a.kind === 'help' || !slotFree(s)) return false;
  if (a.kind === 'mentor' && rel !== 'mentor') return false;
  if (a.kind === 'date' && rel !== 'partner' && !canRomance(id)) return false;
  if ((M.appts || []).some(x => !x.done && x.who === id)) return false;
  const ask = { coffee: 'coffee', drinks: 'a drink', date: rel === 'partner' ? 'a proper date' : 'dinner, just the two of us', mentor: 'an hour of your time' }[a.kind];
  sms(-1, `${ask} ${slotLabel(s)}?`, 'mine', { to: id });
  let p = clamp(.3 + o / 70 + k.trust / 250 - (seniorTo(id) ? .2 : 0), .05, .95);
  if (a.kind === 'date' && rel !== 'partner') p = clamp((o - 20) / 45, .03, .8);
  if (rel === 'partner' || rel === 'mentor') p = Math.max(p, .8);
  if (prnd() < p) {
    bookAppt(Object.assign({ kind: a.kind, who: id }, s));
    sms(id, pickLine(a.kind === 'date' && rel !== 'partner' ? ['...yes. I\'d like that', 'oh! yes. ok. yes', 'I was wondering when you\'d ask'] : ['perfect, see you then', 'yes! been too long', 'done. you\'re buying', 'I\'ll be there'], id + S.week), 'text');
  } else {
    sms(id, a.kind === 'date' && rel !== 'partner' ? pickLine(['that\'s sweet, but I think we\'re better as friends', 'ah, I\'m seeing someone. but thank you'], id) : pickLine(['can\'t then, sorry! another time', 'slammed this week, rain check?', 'ugh, I\'m away. soon?'], id + S.week), 'text');
    if (a.kind === 'date' && rel !== 'partner') M.wk ? M.wk.stress += 2 : M.stress = clamp(M.stress + 2, 0, 100);
  }
  return true;
}
