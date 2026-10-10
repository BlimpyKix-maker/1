// ---------------- The group chat ----------------
// Once you have a couple of friends, you're in a group chat, and it's where the world comes to you: they react to
// this week's news (a flop, a hit, who got fired, who's suddenly everywhere), people you know first. Most weeks
// someone throws something at you that you can act on: a friend's shoot needs someone like you; settle a
// which-film-was-better argument (the critics' scores are in Roger That, if you want to be right); drinks on
// Friday; a bet on the weekend's game. You can post too, once a week: share good news, ask for help, or just send
// something stupid. Nothing here is a chore: it's one thread, and the things worth doing come with a button.

function chatCrew() {
  const M = S.me, me = ME(), close = aliveKnown().filter(id => ['partner', 'close', 'friend'].includes(relOf(id)));
  let C = (M.crew || []).filter(id => close.includes(id) || (P(id) && !P(id).dead && opinion(id) >= 15));
  for (const id of close.sort((a, b) => opinion(b) - opinion(a))) { if (C.length >= 5) break; if (!C.includes(id) && relOf(id) !== 'partner') C.push(id); }
  return C;
}
const CREW_SAY = {
  Flop: ['oof. {t}', '{t} 💀', 'brutal week for some people. {t}', 'not to be dramatic but {t}'],
  Hit: ['{t} 🔥', 'good for them honestly. {t}', 'ok {t}'],
  Career: ['gossip: {t}', '{t} 👀', 'apparently {t}'],
  Award: ['{t}! deserved', '{t}. robbed tbh', 'calling it now, {t}'],
  Release: ['{t}', 'who\'s coming saturday? {t}'],
  Cult: ['{t} — told you it was good', '{t}'], Legacy: ['{t} — told you it was good'],
  Set: ['heard from set: {t}'], Trend: ['everyone\'s chasing this now: {t}']
};
function crewPost(from, t, extra = {}) { sms(from, t, 'gossip', Object.assign({ grp: 'crew', raw: 1, replyable: 0 }, extra)); }
function crewWeek() {
  const M = S.me; if (!M.party || !M.party.done) return;
  const C = chatCrew(), was = M.crew || []; M.crew = C; if (C.length < 2) return;
  for (const id of C.filter(x => !was.includes(x))) if (was.length) crewPost(C[0] === id ? C[1] : C[0], `added ${P(id).name.split(' ')[0]} 👋`);
  if (!was.length) crewPost(C[0], `ok made a group chat. ${C.slice(1).map(id => P(id).name.split(' ')[0]).join(', ')}, meet ${ME().name.split(' ')[0]}. ${ME().name.split(' ')[0]}, meet chaos`);
  // the week's news, people you know first
  const known = new Set(Object.keys(M.known).map(Number)), mine = new Set(myFilms().map(f => f.id)), mkt = (HUBS[M.hub] || {}).m;
  const seen = new Set(M.crewSeen || []);
  const N = S.news.filter(n => n.w >= S.week - 1 && CREW_SAY[n.type] && !seen.has(n.text)).map(n => { const r = n.ref || {}; const f = r.film !== undefined ? S.films[r.film] : null; let s = known.has(r.person) ? 5 : 0; if (f && mine.has(f.id)) s += 6; if (f && (f.hub === M.hub || (HUBS[f.hub] || {}).m === mkt)) s += 2; if (f && f.cast && f.cast.some(id => known.has(id))) s += 3; return [n, s + prnd() * 2]; }).sort((a, b) => b[1] - a[1]);
  const n = Math.min(N.length, 1 + Math.floor(prnd() * 3));
  for (let i = 0; i < n; i++) { const [x] = N[i], f = x.ref && x.ref.film !== undefined ? S.films[x.ref.film] : null, local = f && f.hub === M.hub, L = x.type === 'Release' && !local ? ['{t}'] : CREW_SAY[x.type], line = L[Math.floor(prnd() * L.length)].replace('{t}', x.text.replace(/\.$/, '')); crewPost(C[Math.floor(prnd() * C.length)], line); (M.crewSeen = M.crewSeen || []).push(x.text); }
  if (M.crewSeen && M.crewSeen.length > 40) M.crewSeen.splice(0, M.crewSeen.length - 40);
  // something to do
  if (prnd() < .6) crewAsk(C);
  M.crewPosted = M.crewPosted === S.week ? M.crewPosted : null;
  // settle last week's bet
  if (M.crewBet && M.crewBet.w < S.week && typeof LEAGUE !== 'undefined') { const b = M.crewBet, L = LEAGUE[b.lk], G = L && weekGames(L, b.w).find(g => g.h === b.t || g.a === b.t); M.crewBet = null;
    if (G) { const lost = G.win !== b.t; const youWin = b.side === 'lose' ? lost : !lost; M.cash += youWin ? b.amt : -b.amt; addTie(ME(), P(b.who), youWin ? -1 : 2); crewPost(b.who, youWin ? `fine. FINE. ${fmtCash(b.amt)} sent. ${leagueTeams(L)[b.t].name} are dead to me` : `${leagueTeams(L)[b.t].name} ${G.win === b.t ? 'won' : 'lost'}. pay up 💸 ${fmtCash(b.amt)}`); } }
}
function crewAsk(C) {
  const M = S.me, me = ME(), who = C[Math.floor(prnd() * C.length)], q = P(who), x = prnd(), G = (t, n) => typeof gx === 'function' ? gx(t, S.week * 7 + n) : t.replace(/\{([^|}]*)[^}]*\}/g, '$1');
  if (x < .25) {   // a friend's shoot
    const f = S.films.filter(f => f.rel === null && f.stage >= 1 && f.stage <= 2 && f.hub === M.hub).sort(() => prnd() - .5)[0]; if (!f) return;
    crewPost(who, G(`{my friend's shoot|a mate's film|this indie I know|the shoot I was on last year}{ (${f.title})| — ${f.title} —} {is looking for people|needs bodies|is short-handed|is crewing up}. {want me to pass your name on|shall I put you forward|you want in|interested}?`, who));
    inbox('crew', G(`${q.name.split(' ')[0]}: {a shoot needs people|a way in|a job going|someone's crewing up}`, who + 1), G(`${q.name} {offers to put your name forward on|can get you in the door at|knows someone hiring on} ${f.title}.`, who + 2), { person: who, ca: 'lead', film: f.id, choices: [{ k: 'yes', label: 'Yes please' }, { k: 'no', label: 'I\'m all right, thanks' }] });
  } else if (x < .5) {   // settle an argument: which film was better
    const R = S.films.filter(f => f.rel !== null && S.week - f.rel <= 10 && f.rel < S.week && (f.hub === M.hub || (HUBS[f.hub] || {}).m === (HUBS[M.hub] || {}).m)).sort(() => prnd() - .5).slice(0, 2); if (R.length < 2) return;
    crewPost(who, `settle this. ${R[0].title} or ${R[1].title}. which is better. there is a right answer`);
    inbox('crew', G('{The group chat wants an answer|Settle an argument|Which is better?|A vote, apparently|You\'re the tiebreaker}', who + 7), `${q.name.split(' ')[0]} wants to know: ${R[0].title} or ${R[1].title}? (The critics' scores are in Roger That, if you want to be right. Or you can just say what you think.)`, { person: who, ca: 'poll', films: [R[0].id, R[1].id], choices: [{ k: 'a', label: R[0].title }, { k: 'b', label: R[1].title }, { k: 'no', label: 'Haven\'t seen either' }] });
  } else if (x < .75) {   // a night out
    const place = G('{the rooftop place|karaoke, the good one|that bar with the jukebox|a house party in the hills|the dumpling place, then wherever|{a|the} {new|tiny|secret|awful|legendary} {ramen bar|tapas place|jazz cellar|roller disco|pub quiz|wine bar|taco truck|bowling alley|cinema club|beer garden} {by the river|near the studios|downtown|someone swears by|with the good chips}}', who);
    crewPost(who, G(`${place} {friday|this friday|friday night}. {everyone's coming|no excuses|be there|bring people|first round's on me}`, who + 3));
    inbox('crew', G('{Friday night|Plans for Friday|Out on Friday?|The weekend starts early|Group chat: Friday}', who + 5), `The group chat is going to ${place} on Friday.`, { person: who, ca: 'night', choices: [{ k: 'yes', label: 'I\'m in' }, { k: 'no', label: 'Can\'t this week' }] });
  } else if (typeof leaguesHere === 'function') {   // a bet on the weekend's game
    const L = leaguesHere().find(L => weekGames(L).length); if (!L || M.crewBet) return; const g = weekGames(L)[Math.floor(prnd() * weekGames(L).length)], T = leagueTeams(L), t = prnd() < .5 ? g.h : g.a, amt = Math.max(5, Math.round(usd(20) / 5) * 5);
    crewPost(who, G(`{${fmtCash(amt)} says ${T[t].name} win this weekend. anyone|who wants to lose ${fmtCash(amt)}? ${T[t].name} to win|${T[t].name} this weekend. ${fmtCash(amt)}. come on then|calling it: ${T[t].name}. ${fmtCash(amt)} to anyone brave}`, who + 4));
    inbox('crew', G('{A bet in the group chat|Put your money where your mouth is|The weekend\'s game|A friendly wager|Fancy a flutter?}', who + 6), `${q.name.split(' ')[0]} bets ${fmtCash(amt)} that ${T[t].name} win this weekend (${L.name}).`, { person: who, ca: 'bet', lk: L.k, team: t, amt, choices: [{ k: 'lose', label: `Take it: they'll lose` }, { k: 'no', label: 'Stay out of it' }] });
  }
}
function crewPick(it, k) {
  if (it.kind !== 'crew') return false;
  const M = S.me, me = ME(), q = P(it.person); it.done = true; if (!q) return true;
  let t = '';
  switch (it.ca) {
    case 'lead': if (k === 'yes') { const f = S.films[it.film], p = f && makeLead(it.person, f); t = p ? `${q.name.split(' ')[0]} passes your name on. It's on your board: ${p.t}.` : 'The shoot filled up before they could ask.'; crewPost(-1, 'yes please!! thank you'); } else t = 'You let it go.'; break;
    case 'poll': { if (k === 'no') { t = 'You plead ignorance. They mock you for an hour.'; break; } const [a, b] = it.films.map(id => S.films[id]), pick = k === 'a' ? a : b, other = k === 'a' ? b : a, right = (pick.q || 0) >= (other.q || 0);
      crewPost(-1, `${pick.title}. obviously`); if (right) { growSub(me, 'tas', .15); addTie(me, q, 2); t = `The critics agree with you. ${q.name.split(' ')[0]} concedes, grudgingly.`; crewPost(it.person, 'ugh. fine. you\'re right'); } else { addTie(me, q, -.5); t = `${q.name.split(' ')[0]} sends a link to the reviews. You were wrong. You stand by it.`; crewPost(it.person, `the reviews disagree but ok 🙃`); } break; }
    case 'night': if (k === 'yes') { M.stress = clamp(M.stress - 5, 0, 100); M.energy = clamp(M.energy - 6, 0, 100); M.cash -= usd(30); for (const id of chatCrew()) addTie(me, P(id), 2); const n2 = prnd() < .35 ? bestIn(M.hub, ROLES, x => x.standing * .3 + prnd() * 40 - (M.known[x.id] ? 999 : 0)) : null; if (n2) meet(n2.id, 'A friend of a friend', 6); t = `A great night.${n2 ? ` Someone brings ${n2.name}, ${(n2.occ || occupationOf(n2)).toLowerCase()}; you swap numbers.` : ''}`; crewPost(-1, 'omw'); } else { t = 'You miss it. The photos look fun.'; } break;
    case 'bet': if (k === 'lose') { M.crewBet = { lk: it.lk, t: it.team, amt: it.amt, w: S.week, who: it.person, side: 'lose' }; crewPost(-1, 'you\'re on'); t = 'You\'re on. Pay-up next week.'; } else t = 'You stay out of it.'; break;
  }
  it.result = { t }; return true;
}
// your turn: once a week
function crewSay(a) {
  const M = S.me, me = ME(), C = chatCrew(); if (C.length < 2 || M.crewPosted === S.week) return false; M.crewPosted = S.week;
  const recent = (M.milestones || []).filter(m => S.week - m.w <= 2).slice(-1)[0];
  if (a.k === 'news') { if (!recent) return false; crewPost(-1, `news: ${recent.t.toLowerCase()} 🎉`); for (const id of C) addTie(me, P(id), 1.5); const r = C[Math.floor(prnd() * C.length)]; crewPost(r, pickLine(['!!!!! drinks on you', 'SO proud of you', 'told you. TOLD you', 'ok who do I have to bribe to be in your next thing'], S.week)); return true; }
  if (a.k === 'help') { crewPost(-1, 'anyone hear of work going? anything. I\'m not proud'); const r = C[Math.floor(prnd() * C.length)], f = S.films.filter(f => f.rel === null && f.stage >= 1 && f.stage <= 2 && f.hub === M.hub)[0], ok = prnd() < .35 + opinion(r) / 300;
    if (ok && f) { const p = makeLead(r, f); crewPost(r, p ? `actually yes. sending you something` : 'I\'ll ask around'); } else crewPost(r, pickLine(['I\'ll ask around', 'nothing right now but I\'ll shout', 'same tbh'], S.week)); return true; }
  crewPost(-1, pickLine(['[a picture of a cat in a director\'s chair]', 'me reading my own script at 2am: [skull]', 'industry update: I bought a plant', '[voice note, 0:04, just laughing]'], S.week)); for (const id of C) addTie(me, P(id), .8); crewPost(C[Math.floor(prnd() * C.length)], pickLine(['😂😂', 'why are you like this', 'this is the best thing that\'s happened all week', 'iconic'], S.week + 1)); return true;
}
function crewComposeHTML() {
  const M = S.me, C = chatCrew(); if (C.length < 2) return '';
  const recent = (M.milestones || []).filter(m => S.week - m.w <= 2).length;
  return M.crewPosted === S.week ? '<p class="muted small">You\'ve posted this week.</p>' : `<div class="quick">${recent ? '<button class="qr" data-crewsay="news">🎉 Share your news</button>' : ''}<button class="qr" data-crewsay="help">🙏 Ask if anyone has work</button><button class="qr" data-crewsay="meme">😂 Send something stupid</button></div>`;
}
function crewClick(t) { if (t.dataset.crewsay) { doAct({ t: 'crew', k: t.dataset.crewsay }); render(true); return true; } return false; }
