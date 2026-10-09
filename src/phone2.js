// ---------------- The phone, with something riding on it ----------------
// What makes a messaging loop worth playing (in games built on one): people with personalities you learn to read,
// relationships that climb visible ranks and unlock real things, replies that can land or fall flat, and the world
// texting you things you didn't expect. So:
//  - Bond ranks (0–5) per contact, from how they feel about you and how far they trust you. Each rank unlocks a perk
//    that does something: tips about work, a word in the right ear, joining your crew for less, bailing you out.
//  - Every contact has a texting personality; replies that suit it count for more, ones that don't fall flat. The
//    thread tells you what they like once you've talked a few times.
//  - Rank-ups announce themselves. Unknown numbers turn up (a wrong number that becomes a gig, a scam to spot, a fan,
//    a tip from nobody). And a late night out can end with a text you might regret: send it or delete it.
// Rolls are the player's dice at the moment of the reply; everything else is read from the relationship.

// ---- bonds ----
const BOND = [
  [0, 'Acquaintance', 'Nothing yet.'],
  [1, 'Friendly', 'They answer quickly and remember what you told them.'],
  [2, 'Tipster', 'Now and then they pass you work they hear about, before it\'s posted.'],
  [3, 'Advocate', 'They put in a word: applications to their projects get a referral.'],
  [4, 'Crew', 'They\'ll work on your projects for less, and come when you call.'],
  [5, 'Ride or die', 'Once a year, when things go badly, they show up with real help.']
];
function bondOf(id) { const M = S.me, k = M.known[id]; if (!k) return 0; const o = opinion(id), t = k.trust || 0; return o >= 55 && t >= 70 ? 5 : o >= 42 && t >= 55 ? 4 : o >= 30 && t >= 40 ? 3 : o >= 18 && t >= 25 ? 2 : o >= 8 ? 1 : 0; }
function bondProgress(id) { const o = opinion(id), steps = [8, 18, 30, 42, 55, 101], b = bondOf(id); const lo = b ? steps[b - 1] : -20, hi = steps[b]; return clamp((o - lo) / Math.max(1, hi - lo), 0, 1); }
function bondHTML(id) {
  if (id === null || id === undefined || !S.me.known[id]) return '';
  const b = bondOf(id), nx = BOND[b + 1], like = S.me.known[id].tone ? TONE_LIKES[voiceOf_(P(id))] : null;
  return `<div class="bond"><span class="bond-r">Bond ${b} · <b>${esc(BOND[b][1])}</b></span><span class="bond-bar"><i style="width:${Math.round(bondProgress(id) * 100)}%"></i></span><small>${nx ? `Next: ${esc(nx[1])} (${esc(nx[2])})` : 'As close as it gets.'}</small>${like ? `<small class="muted">Texts best with: ${esc(like[0])} · not: ${esc(like[1])}</small>` : '<small class="muted">Talk a little more to learn how they like to be texted.</small>'}</div>`;
}
// texting personalities, from the people themselves
const TONE_OF = { laugh: 'funny', meme: 'funny', flirty: 'funny', jealous: 'edge', sympathy: 'warm', congrats: 'warm', thanks: 'warm', invite: 'warm', drinks: 'warm', st_call: 'warm', st_text: 'warm', st_reassure: 'warm', st_home: 'warm', st_keep: 'warm', spill: 'gossip', nogossip: 'straight', advise: 'straight', notsure: 'straight', brief: 'brief', st_busy: 'brief', st_later: 'brief', askmore: 'business', workgood: 'business', st_in: 'business', st_jump: 'business', st_sell: 'business', st_honest: 'straight', st_fight: 'edge', st_confront: 'edge', own: 'own' };
const TONE_LIKES = { funny: ['jokes and memes', 'one-word answers'], warm: ['kindness and plans to meet', 'grumbling'], dry: ['short and straight', 'gushing'], gossip: ['the latest gossip', 'being a saint about it'], quiet: ['short, kind replies', 'big plans and noise'], plain: ['anything honest', 'nothing in particular'] };
const TONE_FIT = { funny: { funny: 1.6, brief: .4, edge: 1 }, warm: { warm: 1.5, edge: .3, brief: .6 }, dry: { brief: 1.4, straight: 1.4, warm: .7, funny: 1.1 }, gossip: { gossip: 1.8, straight: .5, funny: 1.2 }, quiet: { brief: 1.3, warm: 1.2, funny: .7, gossip: .6 }, plain: {} };
function replyFit(q, k) { const v = voiceOf_(q), t = TONE_OF[k] || (k && /^a[01]$/.test(k) ? 'straight' : null); if (!t) return 1; return (TONE_FIT[v] || {})[t] || 1; }
function replyHint(q, k) { const f = replyFit(q, k); return f >= 1.3 ? ' 💛' : f <= .6 ? ' 🧊' : ''; }
{ const _rl = replyLabel; replyLabel = function (m, k) { const base = _rl(m, k), q = m && m.from >= 0 ? P(m.from) : null; return q && S.me.known[m.from] && S.me.known[m.from].tone ? base + replyHint(q, k) : base; }; }
// called from replyText as the tie moves: tone counts, and you learn theirs by talking
function bondReply(q, k, d) {
  const M = S.me, K = M.known[q.id]; if (!K) return d;
  K.talks = (K.talks || 0) + 1; if (K.talks >= 3) K.tone = 1;
  const f = replyFit(q, k), out = d > 0 ? d * f : d * (f < 1 ? 1.4 : 1);
  return out;
}
// after the tie has moved: rank-ups
function bondCheck(id) {
  const M = S.me, K = M.known[id]; if (!K) return;
  const b = bondOf(id), was = K.bond || 0;
  if (b > was) { K.bond = b; if (b >= 2) { inbox('note', `${P(id).name}: bond ${b}, ${BOND[b][1]}`, `${BOND[b][2]}`, { person: id }); milestone(`${P(id).name} became ${['', 'friendly', 'a tipster', 'an advocate', 'crew', 'ride or die'][b]}`, 'life'); } if (typeof toast === 'function') toast(`${P(id).name}: bond ${b} · ${BOND[b][1]}`, 'good'); }
  else if (b < was) K.bond = b;
}
// ---- what the ranks do, every week ----
function bondWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return;
  const ids = aliveKnown();
  // tipsters pass on work
  if (prnd() < .25) { const T = ids.filter(id => bondOf(id) >= 2 && typeof theirActive === 'function' && theirActive(id)); if (T.length) { const id = T[Math.floor(prnd() * T.length)], f = theirActive(id), p = typeof makeLead === 'function' ? makeLead(id, f) : null; if (p) sms(id, pickLine([`heads up: ${f.title} needs a ${p.t.toLowerCase()}. not posted yet. go`, `they're about to hire for ${f.title}. I said your name. apply this week`, `quiet tip: ${p.t.toLowerCase()} on ${f.title}. you'd be great`], S.week + id), 'tip'); } }
  // advocates put a word in
  for (const id of ids) if (bondOf(id) >= 3 && !M.refs[id]) M.refs[id] = 1;
  // ride or die: once a year, when you're in trouble
  if (M.cash < 0 || M.stress > 80) { const R = ids.filter(id => bondOf(id) >= 5 && S.week - ((M.known[id] || {}).rescued || -999) > 52); if (R.length) { const id = R[0]; M.known[id].rescued = S.week; const help = Math.round(Math.max(usd(800), -M.cash * 1.1)); if (M.cash < 0) M.cash += help; M.stress = clamp(M.stress - 15, 0, 100); sms(id, M.cash >= 0 && help > 0 ? `I sent you ${fmtCash(help)}. don't argue. pay me back whenever` : 'I\'m coming over. I\'m bringing food. no arguments', 'text', { mood: 'happy' }); milestone(`${P(id).name} turned up when it mattered`, 'life'); } }
  surpriseText();
}
// ---- the world texts you ----
const UNKNOWN = [
  { k: 'wrong', t: 'hey is this the guy with the van? we need someone for a shoot saturday, cash', o: [['help', '"Not the van guy, but I can help"', 'cha', 12], ['correct', '"Wrong number, good luck!"', null, 0]] },
  { k: 'scam', t: 'URGENT: your bank account is locked. verify here within 24h: secure-bank-verify.co', o: [['ignore', 'Delete it', 'tas', 9], ['click', 'Tap the link', null, 0]] },
  { k: 'fan', t: 'sorry if this is weird. I saw your work and it made me cry on a train. that\'s all. thank you', o: [['thank', '"That means more than you know"', null, 0], ['ignore', 'Leave it on read', null, 0]] },
  { k: 'tip', t: 'you don\'t know me. a studio is about to announce layoffs on friday. sell if you own any. delete this', o: [['act', 'Act on it', 'tas', 13], ['ignore', 'Ignore it', null, 0]] },
  { k: 'vip', t: '[unknown number] this is the assistant of someone you\'d know. they want a coffee. thursday? no names over text', o: [['go', '"I\'ll be there"', 'cha', 13], ['no', '"Who is this?"', null, 0]] },
  { k: 'ex', t: 'hi. it\'s been a while. I still think about that shoot we did. are you around?', o: [['meet', '"I\'d like that"', 'cha', 11], ['no', '"I\'m good, thanks"', null, 0]] }
];
function surpriseText() {
  const M = S.me; if (prnd() > .06 || (M.unknown || []).some(x => !x.done)) return;
  const U = UNKNOWN[Math.floor(prnd() * UNKNOWN.length)];
  (M.unknown = M.unknown || []).push({ id: M.seq++, k: U.k, w: S.week, done: 0 });
  inbox('unknown', 'A text from an unknown number', U.t, { unk: M.unknown[M.unknown.length - 1].id, uk: U.k, choices: U.o.map(([k, l, st, dc]) => Object.assign({ k, label: l }, st ? { check: [st, dc] } : {})) });
}
function unknownPick(it, k) {
  if (it.kind !== 'unknown') return false;
  const M = S.me, me = ME(), x = (M.unknown || []).find(y => y.id === it.unk); if (x) x.done = 1; it.done = true;
  const U = UNKNOWN.find(u => u.k === it.uk), o = U && U.o.find(z => z[0] === k); if (!o) { it.result = { t: 'You put the phone down.' }; return true; }
  const ok = o[2] ? roll(o[2], o[3]) : true, r = o[2] ? M.lastRoll : null; let t = '';
  switch (it.uk + ':' + k) {
    case 'wrong:help': if (ok) { const v = usd(250 + prnd() * 400); M.cash += v; const q = typeof youngNPC === 'function' ? youngNPC(M.hub, 'producer') : null; if (q) meet(q.id, 'A wrong number', 8); t = `You spend Saturday on a stranger's shoot, earn ${fmtCash(v)}, and leave with a producer's number.`; } else t = 'They wanted the van more than you. Fair.'; break;
    case 'scam:ignore': t = ok ? 'Deleted. You notice the spelling of "secure" was wrong anyway.' : 'You delete it, then panic for an hour that you didn\'t.'; break;
    case 'scam:click': { const v = Math.min(Math.max(0, M.cash), usd(300 + prnd() * 1200)); M.cash -= v; M.stress = clamp(M.stress + 8, 0, 100); t = `It was what it looked like. ${fmtCash(v)} gone before the bank freezes the card.`; break; }
    case 'fan:thank': M.stress = clamp(M.stress - 5, 0, 100); me.fame = clamp((me.fame || 0) + .3, 0, 100); t = 'They send back a photo of a cat. You keep it.'; break;
    case 'tip:act': { if (ok) { const v = Math.round(Math.max(usd(200), M.cash * .01)); M.cash += v; t = `It's true. You move early and come out ${fmtCash(v)} ahead.`; } else { const v = Math.round(Math.min(Math.max(0, M.cash) * .01, usd(2000))); M.cash -= v; t = `It was nonsense. You lose ${fmtCash(v)} getting out of something that was fine.`; } break; }
    case 'vip:go': { if (ok) { const q = bestIn(M.hub, ['producer', 'director'], q => q.standing * .7 + prnd() * 30); if (q) { meet(q.id, 'A coffee nobody planned', 14); trust(q.id, 6); me.standing = clamp(me.standing + 1, 0, 100); t = `It's ${q.name}. They wanted to meet the person behind something you made. An hour becomes three.`; } else t = 'Nobody shows. A barista gives you a free muffin.'; } else t = 'They cancel by text, twice, and then go quiet.'; break; }
    case 'ex:meet': { const q = bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing) + prnd() * 40); if (q && ok) { meet(q.id, 'An old shoot', 10); t = `It's ${q.name}. You laugh about the old shoot for an hour, and they mention a job.`; } else t = 'It was lovely, and it reminded you why it ended.'; break; }
    default: t = 'You leave it there.';
  }
  it.result = { ok: o[2] ? ok : null, roll: r, t }; return true;
}
// a night out that ends with a text you might regret
function drunkText() {
  const M = S.me; if (M.party && !M.party.done) return;
  const ids = aliveKnown().filter(id => ['ex', 'rival', 'cold', 'partner', 'close'].includes(relOf(id)) || opinion(id) < -5 || opinion(id) > 35); if (!ids.length || prnd() > .25) return;
  const id = ids[Math.floor(prnd() * ids.length)], rel = relOf(id);
  const t = rel === 'rival' || opinion(id) < -5 ? `you're overrated and everyone knows it` : rel === 'ex' ? `do you ever think about us` : rel === 'partner' ? `you're the best thing that ever happened to me. I mean it. also I lost my shoe` : `I LOVE YOU. you're my favourite person in this whole business`;
  inbox('drunk', `2:14 a.m. A text to ${P(id).name}, unsent`, `"${t}"`, { person: id, txt: t, choices: [{ k: 'send', label: 'Send it. Chaos.', check: ['cha', 12] }, { k: 'delete', label: 'Delete it and go to sleep' }] });
}
function drunkPick(it, k) {
  if (it.kind !== 'drunk') return false;
  const M = S.me, me = ME(), id = it.person, q = P(id); it.done = true;
  if (k === 'delete' || !q) { it.result = { t: 'Deleted. Future you will never know how close it was.' }; return true; }
  const ok = roll('cha', 12), r = M.lastRoll; sms(-1, it.txt, 'mine', { to: id });
  const bad = opinion(id) < -5 || relOf(id) === 'rival';
  if (ok) { addTie(me, q, bad ? 6 : 5); sms(id, bad ? 'ha. ok. drinks sometime? you\'re not wrong about me' : pickLine(['😂 go to sleep. love you too', 'screenshotting this forever. ❤️', 'call me tomorrow, you menace'], S.week), 'text', { mood: 'happy' }); }
  else { addTie(me, q, -6); if (prnd() < .3) { me.fame = clamp((me.fame || 0) + 1, 0, 100); me.standing = clamp(me.standing - 1, 0, 100); } sms(id, bad ? 'wow. ok. noted.' : '…are you ok?', 'text', { mood: 'none' }); }
  it.result = { ok, roll: r, t: ok ? 'It lands. Somehow it was exactly the right thing to send.' : 'It does not land. You will think about this in the shower for a year.' };
  if (typeof bondCheck === 'function') bondCheck(id);
  return true;
}
