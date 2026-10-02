// ---------------- Mentors, your films' stories, the year in entertainment ----------------
// Someone senior who likes you can take you under their wing: a lesson every few weeks, an introduction every
// season, two years and then you graduate. Your company's films get a page that tells their whole life, script to
// ledger. And every January the trades print the year in review, next to your own.
const MENTOR_WEEKS = 104;
const MENTOR_LESSONS = {
  act: ['Stop acting with your face. The camera reads your thoughts; think the line and let it land.', 'Learn everyone\'s lines, not just yours. You\'ll know when to listen.', 'The take after the one you think is perfect is the one they use. Keep something back.'],
  dir: ['Shoot the scene you need, not the scene you planned. Cut your shot list in half on day one.', 'Actors give you what they think you want. Tell them what the character wants instead.', 'If you don\'t know where the camera goes, you don\'t know what the scene is about yet.'],
  wri: ['Write the ending first. Then you know what every page is for.', 'Read it out loud. If an actor would trip on it, cut it.', 'Every scene: who wants what, and why can\'t they have it?'],
  cam: ['Light the face, then decide what to hide.', 'Find the window. Every great interior has one, even if you have to build it.', 'Move the camera only when the story moves.'],
  edt: ['Cut the scene you love most and watch it again. You\'ll be surprised how often it\'s better.', 'Sound carries the cut. Lay the audio first.', 'Never show a director the first assembly without warning them.'],
  pro: ['Raise the money for the film you can make, not the film you want. Then make it better than its budget.', 'Read every contract yourself. Every one.', 'Your reputation is the only asset that compounds.'],
  mus: ['A theme is four notes the audience can hum walking out. Everything else is decoration.', 'Write to picture, then turn the picture off and see if it still sings.', 'Release something every month. The algorithm forgets you in six weeks.'],
  des: ['Every object in frame tells the audience something. Make sure it\'s the right thing.', 'Colour is emotion. Pick three and stick to them.', 'Budget for the thing the director will ask for on the last week.'],
  fx: ['Do it for real if you can. The camera loves weight.', 'The best effect is the one nobody notices.', 'Test it twice; it\'ll fail on the third take anyway.'],
  any: ['Say yes to the small job with the good people.', 'Nobody remembers a no. Everybody remembers how you said it.', 'Keep a list of everyone who helped you. Help them back, especially when they\'ve stopped being useful.', 'Turn up early, leave last, eat with the crew.', 'The work is the work. The rest is weather.', 'Don\'t read the reviews. Okay, read them, then forget them.', 'Find out who\'s really making the decision. It\'s rarely the person in the meeting.', 'Save half of every big cheque. There will be a dry year.']
};
function myCraft() { return MAIN[ME().role] || 'wri'; }
function mentorCandidates() {
  const M = S.me, me = ME(), c = myCraft();
  return Object.keys(M.known).map(Number).map(P).filter(p => p && !p.dead && !p.player && p.id !== M.id && p.standing >= 35 && S.year - p.born >= 35 && (MAIN[p.role] === c || p.role === me.role) && opinion(p.id) >= 15 && !(M.black || {})[p.id])
    .sort((a, b) => b.standing - a.standing).slice(0, 4);
}
function mentorDC(p) { const k = S.me.known[p.id] || { trust: 30 }; return Math.round(clamp(19 - opinion(p.id) / 6 - (k.trust - 30) / 10 + (p.standing - ME().standing) / 20, 7, 19)); }
function mentorAct(a) {
  const M = S.me, me = ME();
  if (a.id === -1) { if (!M.mentor) return false; sms(M.mentor.id, pickLine(['understood. door\'s always open', 'go well. you were a good student', 'fair enough. call me when you win something'], M.mentor.id + S.week), 'text'); M.mentor = null; return true; }
  const p = P(a.id);
  if (M.mentor || !p || !mentorCandidates().some(q => q.id === p.id) || S.week - ((M.mAsk || {})[p.id] ?? -99) < 26) return false;
  (M.mAsk = M.mAsk || {})[p.id] = S.week;
  sms(-1, pickLine(['would you ever consider mentoring me? even a coffee a month would mean a lot', 'I admire your work so much. could I learn from you?', 'this is a big ask, but would you take me under your wing?'], p.id + S.week), 'mine', { to: p.id });
  if (roll('cha', mentorDC(p))) {
    M.mentor = { id: p.id, from: S.week, n: 0 };
    addTie(me, p, 6);
    sms(p.id, pickLine(['alright. first lesson: buy the coffee. thursdays', 'someone did it for me once. ok. let\'s start next week', 'you remind me of me. god help you. yes'], p.id), 'text');
    milestone(`${p.name} became your mentor`, 'life');
    inbox('note', `${p.name} will mentor you`, `Every few weeks a lesson, every season an introduction. Two years, if you both keep at it. ${ROLE_LABEL[p.role]}s like ${p.name} don't say yes to many people.`, { person: p.id, roll: M.lastRoll });
  } else sms(p.id, pickLine(['I\'m flattered, but I can\'t give it the time right now', 'not this year. ask me again', 'I don\'t really do that. but keep in touch'], p.id), 'text');
  return true;
}
// Called when the week closes, with the same gain() that school and work use.
function mentorWeek(gain) {
  const M = S.me, me = ME(), m = M.mentor; if (!m) return;
  const p = P(m.id), age = S.week - m.from;
  if (!p || p.dead || opinion(p.id) < 0 || (M.black || {})[p.id]) { inbox('note', `No more lessons from ${p ? p.name : 'your mentor'}`, p && p.dead ? 'You go to the funeral and sit at the back. You still hear their voice on set.' : 'Things went wrong between you. The Thursday coffees stop.'); M.mentor = null; return; }
  if (age > 0 && age % 3 === 0) {
    const c = MAIN[p.role] || myCraft(), subs = Object.keys(CRAFTS[c].subs), r = hashRand(m.id * 13 + age);
    const k = subs[Math.floor(r() * subs.length)];
    gain(k, .6); m.n++;
    addTie(me, p, 1);
    const L = r() < .6 ? (MENTOR_LESSONS[c] || MENTOR_LESSONS.any) : MENTOR_LESSONS.any;
    sms(m.id, L[Math.floor(r() * L.length)].toLowerCase().replace(/\.$/, ''), 'tip');
    diary(`Coffee with ${p.name}: a lesson in ${CRAFTS[c].subs[k].toLowerCase()}.`);
  }
  if (age > 0 && age % 13 === 0) { const intro = circleOf(p, 12).find(q => !M.known[q] && q !== M.id); if (intro !== undefined) { meet(intro, `Introduced by ${p.name}`, 8); inbox('note', `${p.name} makes an introduction`, `"You should know ${P(intro).name}." A ${ROLE_LABEL[P(intro).role].toLowerCase()}, and now a number in your phone.`, { person: intro }); } }
  if (age >= MENTOR_WEEKS) {
    me.standing = clamp(me.standing + 2, 0, 100);
    (M.mentors = M.mentors || []).push({ id: m.id, from: m.from, to: S.week, n: m.n });
    M.champ = M.champ || {}; if (!M.champ[m.id]) M.champ[m.id] = S.week;
    milestone(`Graduated from ${p.name}'s mentorship`, 'school');
    inbox('note', 'Two years with ' + p.name, `${m.n} lessons, a lot of coffee. "You don't need me any more," ${p.name} says, which isn't true, but it's kind. They'll be in your corner from here on.`, { person: p.id });
    M.mentor = null;
  }
}
function mentorHTML() {
  const M = S.me, m = M.mentor, past = M.mentors || [];
  let body;
  if (m) { const p = P(m.id), left = MENTOR_WEEKS - (S.week - m.from); body = `<p>${pl(m.id)} <span class="muted">(${esc(ROLE_LABEL[p.role].toLowerCase())}, standing ${Math.round(p.standing)})</span> is mentoring you. ${m.n} lesson${m.n === 1 ? '' : 's'} so far; next in ${3 - (S.week - m.from) % 3} week${3 - (S.week - m.from) % 3 === 1 ? '' : 's'}. ${left} weeks to go.</p><p class="small muted">A lesson every three weeks grows a craft of theirs; every season they introduce you to someone from their circle. Fall out with them and it ends.</p><p><button class="linkish" data-mentor="-1">Part ways</button></p>`; }
  else {
    const C = mentorCandidates();
    body = C.length ? `<p class="muted small">Senior people in your craft who like you. Asking rolls your Charisma; each person can be asked once every six months.</p><table class="grid small"><tbody>${C.map(p => { const wait = S.week - ((M.mAsk || {})[p.id] ?? -99) < 26, dc = mentorDC(p); return `<tr><td>${pl(p.id)} <span class="muted">${esc(ROLE_LABEL[p.role])} · standing ${Math.round(p.standing)}</span></td><td>DC ${dc}</td><td><button class="btn-s ghost" data-mentor="${p.id}" ${wait ? 'disabled title="Asked recently"' : ''}>Ask</button></td></tr>`; }).join('')}</tbody></table>`
      : past.length ? '' : null;
    if (body === null) return '';   // nobody to ask yet: say nothing
  }
  return `<section class="panel"><h3>Mentor</h3>${body}${past.length ? `<p class="small muted">Past mentors: ${past.map(x => pl(x.id) + ` (${x.n} lessons)`).join(', ')}</p>` : ''}</section>`;
}
// ---- the whole story of a film you made ----
function isMyOwnFilm(f) { const M = S.me; return !!M && ((M.company !== undefined && f.co === M.company) || (M.scripts || []).some(x => x.made === f.id) || (M.holdings || []).some(x => x.made === f.id)); }
function filmStoryHTML(f) {
  const M = S.me; if (!M || !isMyOwnFilm(f)) return '';
  const me = ME(), sc = (M.scripts || []).find(x => x.made === f.id), ho = (M.holdings || []).find(x => x.made === f.id), co = f.co !== null ? S.companies[f.co] : null;
  const ev = [];
  if (sc) ev.push([sc.start ?? f.gl, `You wrote it${sc.grade ? `: the draft graded ${sc.grade}` : ''}.`]);
  else if (ho) ev.push([ho.from, `You optioned the script from ${P(ho.writer).name}${ho.price ? ` for ${fmtCash(ho.price)}` : ''}.`]);
  ev.push([f.gl, `${co ? co.name : 'A company'} greenlit it with ${fmtM(f.budget)}${f.investors ? `, ${fmtM(f.investors.amount)} of it from investors for ${Math.round(f.investors.share * 100)}% of the returns` : ''}. ${f.dir === me.id ? 'You directed.' : `${P(f.dir).name} directed.`} ${P(f.cast[0]).name} starred, with ${P(f.cast[1]).name}; ${P(f.dp).name} shot it and ${P(f.ed).name} cut it.`]);
  if (f.dur) { const s = f.gl + f.dur[0] + f.dur[1]; ev.push([s, `Cameras rolled. ${f.dur[2]} weeks of shooting.`]); }
  for (const e of f.events || []) if (e.t) ev.push([e.w, e.t + (e.q ? ` (${e.q > 0 ? 'the film got better' : 'it cost the film something'})` : '')]);
  for (const e of (M.fests || []).filter(x => x.film === f.id && x.done)) { const F = FESTIVALS.find(x => x.k === e.k); ev.push([e.due, e.sel ? `Selected for ${F.name}.` : `Turned down by ${F.name}.`]); }
  for (const t in f.dist || {}) { const d = f.dist[t]; ev.push([f.rel ?? S.week, `${S.companies[d.b].name} took the ${t === 'home' ? 'home' : 'international'} rights: ${fmtM(d.mg)} up front, ${Math.round(d.share * 100)}% of the rentals.`]); }
  if (f.rel !== null) {
    ev.push([f.rel, `Released. Critics gave it ${f.reviews}/100; it took ${fmtM(f.total)} worldwide against a ${fmtM(f.cost)} cost.`]);
    if (S.week - f.rel >= 8) ev.push([f.rel + 8, f.hitRatio > 2 ? 'A hit. The phone rings differently now.' : f.theatrical < -f.cost * .3 ? 'It flopped. You learn more from this one than from anything else.' : 'Steady business. It paid its way.']);
  } else ev.push([S.week, `Now: ${f.status.toLowerCase()}.`]);
  for (const a of f.awards || []) ev.push([f.rel ?? S.week, `Award: ${a}.`]);
  if (f.investors && f.investors.paid !== undefined) ev.push([f.rel ?? S.week, `Investors paid ${fmtM(f.investors.paid)}.`]);
  ev.sort((a, b) => a[0] - b[0]);
  const ret = f.rentals !== undefined ? f.rentals - (f.pa || 0) - (f.backend || 0) - f.cost : null;
  return `<section class="panel"><h3>The story of ${esc(f.title)}</h3>${ret !== null && f.rel !== null ? `<div class="kpis mini"><div><span>Cost</span><b>${fmtM(f.cost)}</b></div><div><span>Worldwide</span><b>${fmtM(f.total)}</b></div><div><span>Rentals less P&amp;A</span><b>${money(ret)}</b></div><div><span>Critics</span><b>${f.reviews}/100</b></div></div>` : ''}
   <ol class="timeline">${ev.map(([w, t]) => `<li class="tl-work"><time>${fmtDate(w, true)}</time><span>${esc(t)}</span></li>`).join('')}</ol></section>`;
}
// ---- the year in entertainment, printed every January next to your own year ----
function industryYear(y) {
  const M = S.me, rel = S.films.filter(f => f.rel !== null && yearOf(f.rel) === y && f.total > 0);
  const top = rel.slice().sort((a, b) => b.total - a.total).slice(0, 3).map(f => f.id);
  const crit = rel.filter(f => f.reviews !== null && f.tier <= 2).sort((a, b) => b.reviews - a.reviews)[0];
  const flop = rel.filter(f => f.tier <= 2).sort((a, b) => (a.total - a.cost * 2.5) - (b.total - b.cost * 2.5))[0];
  const home = MARKETS[HUBS[M.hub].m].name, aw = (S.awards || []).filter(a => a.y === y && /Picture|Best Film|Grand Prix|Golden/.test(a.name)).sort((a, b) => b.name.startsWith(home) - a.name.startsWith(home)).slice(0, 4).map(a => [a.name, a.film]);
  const trends = TRENDS.filter(t => t.y === y).slice(0, 4).map(t => t.t);
  const w0 = weekOfYear(y), w1 = weekOfYear(y + 1) - 1, idx = {};
  for (const [k, l] of [['box', 'Box office'], ['music', 'Music'], ['video', 'Online video'], ['pod', 'Podcasts']]) { const a = fieldIndex(k, w0), b = fieldIndex(k, w1); if (a > 0) idx[l] = Math.round((b / a - 1) * 100); }
  const songs = typeof chartFor === 'function' ? chartFor('music', M.hub).filter(x => !x.mine)[0] : null;
  return { top, crit: crit ? crit.id : null, flop: flop ? flop.id : null, aw, trends, idx, song: songs ? `${songs.title}, ${songs.name}` : null, n: rel.length };
}
function industryNews(y, I) {
  const parts = [];
  if (I.top.length) parts.push(`Biggest films: ${I.top.map(i => S.films[i].title).join(', ')}`);
  if (I.crit !== null) parts.push(`critics' favourite: ${S.films[I.crit].title}`);
  if (I.song) parts.push(`song of the year: ${I.song}`);
  news('Trade', `The year in entertainment, ${y}. ${parts.join('; ')}.`, {});
}
function industryHTML(I) {
  if (!I) return '';
  const pct = v => `<b class="${v < 0 ? 'bad' : 'good'}">${v > 0 ? '+' : ''}${v}%</b>`;
  return `<div class="indyr"><h4>The industry that year</h4>
   ${I.top.length ? `<p class="small"><b>Biggest films:</b> ${I.top.map(i => `${fl(i)} <span class="muted">${fmtM(S.films[i].total)}</span>`).join(', ')}</p>` : ''}
   ${I.crit !== null ? `<p class="small"><b>Critics' favourite:</b> ${fl(I.crit)} (${S.films[I.crit].reviews}/100)${I.flop !== null && I.flop !== I.crit ? ` · <b>Biggest disappointment:</b> ${fl(I.flop)}` : ''}</p>` : ''}
   ${I.aw.length ? `<p class="small"><b>Top prizes:</b> ${I.aw.map(([n, f]) => `${esc(n)}: ${fl(f)}`).join(' · ')}</p>` : ''}
   ${I.song ? `<p class="small"><b>Song of the year in town:</b> ${esc(I.song)}</p>` : ''}
   ${Object.keys(I.idx).length ? `<p class="small"><b>Markets:</b> ${Object.entries(I.idx).map(([k, v]) => `${esc(k)} ${pct(v)}`).join(' · ')}</p>` : ''}
   ${I.trends.length ? `<ul class="plain small">${I.trends.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</div>`;
}
