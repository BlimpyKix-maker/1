// ---------------- Say anything: start any conversation, by text or by email ----------------
// The phone's compose box offers a long list of reasons to get in touch, each with its own consequences: ask about
// work and a friend on a film may put your name in (a real posting appears on your board, marked as a lead); ask for
// an introduction and a stranger texts you hello; borrow money and you'd better pay it back; share gossip and it may
// get back to the person you gossiped about. People answer in character, often ask you something back, and some
// answers come days later. Friends also ask things of you: lend me money, read my pages, help me move. Email works
// the same way with companies and people you have never met: enquiries, pitches and cold emails, answered (or not)
// a week or two later.
const TOPICS = {
  askwork: { l: '💼 Ask if they know of any work', mine: ['hey, random one: do you know of anything going? I\'m free and I\'m good, I promise', 'is anyone you know crewing up? I could use the work', 'if you hear of anything I\'d be right for, would you think of me?'] },
  vouch: { l: '🤝 Ask them to vouch for you', mine: ['could you put in a word for me next time someone\'s hiring?', 'would you vouch for me if anyone asks? it would mean a lot'] },
  favour: { l: '🎟️ Call in the favour they owe you', mine: ['remember that thing I did for you? I\'m calling it in: put my name forward on your next job?', 'ok, I\'m cashing in that favour. next job you hear of, I\'m your person'] },
  intro: { l: '👋 Ask for an introduction', mine: ['you know everyone. who should I be talking to?', 'would you introduce me to someone useful? I\'ll behave', 'any chance you could connect me with someone in your circle?'] },
  advice: { l: '🧭 Ask for career advice', mine: ['can I ask your advice on something? where would you go next if you were me?', 'honest question: what am I doing wrong?', 'you\'ve been doing this longer than me. what do you wish you\'d known?'] },
  askabout: { l: '🎬 Ask what they\'re working on', mine: ['what are you working on at the moment?', 'so what\'s next for you?', 'tell me what you\'re up to, I want to live vicariously'] },
  congrats: { l: '🎉 Congratulate them', mine: ['just saw {film}. congratulations, honestly', '{film}!! you must be so proud', 'everyone\'s talking about {film}. well done you'] },
  compliment: { l: '✨ Compliment their work', mine: ['I rewatched {film} last night. it holds up. you\'re good, you know that?', 'what you did on {film} has been in my head all week', 'how did you do that thing in {film}? asking for my career'] },
  vent: { l: '😮‍💨 Vent about your week', mine: ['can I vent for a sec? this week has been relentless', 'everything is on fire and I just need someone to say "that sucks"', 'I\'m so tired I tried to pay for coffee with my door key'] },
  deep: { l: '🫶 Check in properly', mine: ['how are you, really? not the polite answer', 'I feel like we only ever talk about work. how are YOU?', 'you seemed off last time. everything ok?'] },
  meme: { l: '📸 Send a meme', mine: ['[a photo of a craft-services table that is just one sad grape]', '[a video of a clapperboard snapping on someone\'s fingers]', '[a screenshot of a one-star review that just says "too many feelings"]', '[a picture of a cat sitting in a director\'s chair]'] },
  gossip: { l: '👀 Share some gossip', mine: ['ok you didn\'t hear this from me but {who} is apparently a nightmare to work with', 'so I heard {who} got fired off their last job. thoughts?', 'between us: {who} has been telling everyone they\'re about to get a big role'] },
  pitch: { l: '💡 Pitch them an idea', mine: ['ok hear me out: {idea}. would you read it?', 'I\'ve got a thing. {idea}. can I send it to you?', 'pitch, thirty seconds: {idea}. go'] },
  borrow: { l: '💸 Ask to borrow money', mine: ['this is embarrassing, but could you lend me a bit until my next job pays?', 'I\'m short on rent this month. I\'d pay you back, I swear'] },
  repay: { l: '💵 Pay them back', mine: ['sending back what I owe you. thank you, really', 'paid you back. you saved me'] },
  thank: { l: '🙏 Thank them', mine: ['I never said thank you properly. for everything. so: thank you', 'just wanted to say you\'ve made a difference to me', 'thank you for being in my corner'] },
  reconnect: { l: '🕰️ Reconnect after a while', mine: ['it\'s been forever. I\'ve missed you. how\'s life?', 'I was just thinking about that job we did. how are you?', 'hello stranger. remember me?'] },
  invite: { l: '🎈 Invite them to something', mine: ['a few of us are going to a screening on Friday. come?', 'there\'s a party at a friend\'s on Saturday. you should come', 'I\'ve got a spare ticket to a gig. interested?'] },
  confess: { l: '💘 Tell them how you feel', mine: ['ok I\'m just going to say it: I like you. a lot. more than a friend', 'I can\'t stop thinking about you, and I think you should know'] },
  makeup: { l: '🕊️ Make peace', mine: ['life\'s too short. can we put it behind us?', 'I don\'t want to be on bad terms with you. truce?', 'I was wrong about some of it. maybe not all. coffee?'] },
  needle: { l: '🗡️ Needle them', mine: ['saw your last thing. bold choices', 'congrats on the job. I hear they asked everyone else first', 'loved your work. the bits I stayed awake for'] },
  breakup: { l: '💔 End things', mine: ['I think we need to talk. I don\'t think this is working', 'I\'m sorry. I can\'t do this anymore'] }
};
const PITCH_IDEAS = ['a heist film set entirely in a lift', 'a ghost story where the ghost is the landlord', 'a sports film about competitive dog grooming', 'a romance between two rival food trucks', 'a war film told by the cooks', 'a thriller about a film crew that can\'t stop shooting', 'a musical about a tax audit', 'a road movie in a car that won\'t go above thirty', 'a family drama at a wedding where nobody knows the couple', 'a sci-fi about the last video shop on Earth'];
// The last thing they made that people saw.
function theirRecent(id, within = 52) { const q = P(id); for (const fid of (q.credits || []).slice(-6).reverse()) { const f = S.films[fid]; if (f && f.rel !== null && f.rel !== undefined && S.week - f.rel >= 0 && S.week - f.rel <= within) return f; } return null; }
function theirActive(id) { return S.active.map(i => S.films[i]).find(f => f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 1 && keyIds(f).includes(id)) || null; }
function topicAvail(id) {
  const M = S.me, k = M.known[id], q = P(id), o = opinion(id), rel = relOf(id), C = convoOf(id), out = [];
  const once = (key, w) => !(C.tw && C.tw[key] !== undefined && S.week - C.tw[key] < w);
  if (rel !== 'cold' && rel !== 'rival' && once('askwork', 3)) out.push('askwork');
  if ((o >= 30 || k.trust >= 50) && once('vouch', 6)) out.push('vouch');
  if (k.due > 0) out.push('favour');
  if (o >= 5 && once('intro', 4)) out.push('intro');
  if (once('advice', 4) && q.standing >= ME().standing - 5) out.push('advice');
  out.push('askabout');
  if (theirRecent(id, 10) && once('congrats', 10)) out.push('congrats');
  if ((q.credits || []).length && once('compliment', 8)) out.push('compliment');
  if (o >= 0) out.push('vent', 'meme');
  if (o >= 15 && once('deep', 3)) out.push('deep');
  if (o >= 5 && aliveKnown().length > 2) out.push('gossip');
  if (once('pitch', 6) && ['producer', 'director', 'writer', 'actor'].includes(q.role)) out.push('pitch');
  if (o >= 25 && !(M.loans || {})[id] && once('borrow', 12)) out.push('borrow');
  if ((M.loans || {})[id]) out.push('repay');
  if (o >= 10 && once('thank', 6)) out.push('thank');
  if (k.seen !== undefined && S.week - k.seen >= 10) out.push('reconnect');
  if (o >= 0 && once('invite', 2)) out.push('invite');
  if (canRomance(id) && rel !== 'partner' && o >= 20) out.push('confess');
  if (o < -5 || rel === 'cold' || rel === 'rival') out.push('makeup');
  if (rel === 'rival' || o < -10) out.push('needle');
  if (rel === 'partner') out.push('breakup');
  return out;
}
function fillTopic(s, id, x) { return s.replace('{film}', x.film ? x.film.title : 'your last one').replace('{who}', x.who !== undefined ? P(x.who).name.split(' ')[0] : 'someone').replace('{idea}', x.idea || 'a film'); }
// A real posting on a film they're on, with your name already in.
function makeLead(id, f) {
  const M = S.me, opts = POSTS.filter(t => !t.cat && t.st.includes(f.stage) && headOf(f, t.head) !== null && !M.jobs.some(j => j.film === f.id && j.k === t.k));
  if (!opts.length) return null;
  const cand = opts.slice(0, 40).map(t => makePost(t, f));
  cand.sort((a, b) => (typeof jobRelevance === 'function' ? jobRelevance(b) - jobRelevance(a) : 0) || hireOdds(b) - hireOdds(a));
  const p = cand[0]; p.ref = true; p.lead = id; if (f.hub !== M.hub) p.away = f.hub;
  M.refs[id] = (M.refs[id] || 0) + 1; (M.flags = M.flags || {}).lead = 1;
  (M.leads = M.leads || []).push({ p, until: S.week + 3 });
  M.board.unshift(p);
  return p;
}
function leadBoard() {
  const M = S.me; M.leads = (M.leads || []).filter(l => l.until >= S.week && S.films[l.p.film] && S.films[l.p.film].stage < 4 && !M.jobs.some(j => j.film === l.p.film && j.k === l.p.k));
  return M.leads.map(l => l.p);
}
function later(x) { (S.me.msgq = S.me.msgq || []).push(x); }
// They ask you something back, so the thread keeps going.
function askBack(q, topic) {
  if (prnd() > .45) return;
  const L = { work: ['anyway. what are YOU working on?', 'and you? anything good coming up?', 'how\'s work treating you?'], chat: ['what are you up to this weekend?', 'did you see anything good lately?', 'how\'s the flat? still haunted?'], question: ['wait, are you still in touch with anyone from your first job?', 'be honest: are you happy?', 'what would you do if you weren\'t in this business?'] }[topic];
  sms(q.id, pickLine(L, q.id + S.week + S.me.phoneN), 'text', { replyable: 1, topic });
}
function topicText(a) {
  const M = S.me, me = ME(), id = a.id, q = P(id), k = M.known[id], o = opinion(id), rel = relOf(id), C = convoOf(id), T = TOPICS[a.kind];
  if (!topicAvail(id).includes(a.kind)) return false;
  C.tw = C.tw || {}; C.tw[a.kind] = S.week; (M.flags = M.flags || {})['t_' + a.kind] = 1;
  if (C.sw !== S.week) { C.sw = S.week; C.sn = 0; } C.sn++;
  const r = id * 31 + (M.phoneN || 0), x = {};
  if (a.kind === 'congrats') x.film = theirRecent(id, 10);
  if (a.kind === 'compliment') x.film = theirRecent(id, 9999) || ((q.credits || []).length ? S.films[q.credits[q.credits.length - 1]] : null);
  if (a.kind === 'gossip') { const pool = aliveKnown().filter(j => j !== id); x.who = pool[Math.floor(prnd() * pool.length)]; }
  if (a.kind === 'pitch') x.idea = PITCH_IDEAS[Math.floor(prnd() * PITCH_IDEAS.length)];
  const own = String(a.msg || '').replace(/\s+/g, ' ').trim().slice(0, 280);
  sms(-1, own || fillTopic(pickLine(T.mine, r), id, x), 'mine', { to: id });
  k.seen = S.week;
  let d = 0, back = '', mood = 'happy', ab = null;
  const say = (t, m2) => { back = t; if (m2) mood = m2; };
  if (C.sn > 4) { M.flags.spam = 1; d -= 1; say(pickLine(['you\'re blowing up my phone today 😅', 'ok slow down, I have a job', 'one at a time!!'], r), 'none'); }
  else switch (a.kind) {
    case 'askwork': {
      const f = theirActive(id), sen = seniorTo(id);
      if (f && o > -5 && prnd() < clamp(.3 + o / 70 + k.trust / 200, .1, .9)) { const p = makeLead(id, f); if (p) { d = 1; say(pickLine([`actually yes! we're crewing up on ${f.title}. there's a ${p.t.toLowerCase()} going. I've put your name in, apply`, `funny you ask. ${f.title} needs a ${p.t.toLowerCase()}. apply this week, I'll tell them you're coming`, `${f.title}. ${p.t}. I said you'd be good. don't make me a liar`], r)); break; } }
      if (o > 10 && prnd() < .5) { later({ k: 'leadlater', id, due: S.week + 1 + Math.floor(prnd() * 3) }); say(pickLine(['nothing right now but let me ask around', 'leave it with me', 'I\'ll keep my ears open. give me a week'], r)); d = .5; }
      else { d = sen && o < 10 ? -1 : 0; say(sen && o < 10 ? pickLine(['send your CV to the production office', 'I don\'t really do that, sorry', 'try the job boards'], r) : pickLine(['nothing I know of, sorry!', 'it\'s quiet for me too honestly', 'not right now. hang in there'], r), 'none'); }
      break;
    }
    case 'vouch': { const owe = k.due > 0; if (owe) k.due--; else trust(id, -3); M.refs[id] = (M.refs[id] || 0) + 1; d = owe ? 1 : .2; say(pickLine(['of course. consider it done', 'happily. you\'re easy to vouch for', 'yep. if anyone asks, you walk on water'], r)); break; }
    case 'favour': askFavour(id); d = .5; say(pickLine(['fair. I owe you. done', 'you\'ve earned it. next job, I\'ll say your name first', 'a deal\'s a deal'], r)); break;
    case 'intro': {
      const g = circleOf(q, 12).map(P).filter(x => x && !x.dead && !M.known[x.id]).sort((a2, b) => b.standing - a2.standing)[0];
      if (g && prnd() < clamp(.35 + o / 90, .1, .9)) { meet(g.id, `Introduced by ${q.name}`, 6); d = 1; say(pickLine([`you should meet ${g.name}. I'm texting them now`, `${g.name}. they're lovely and they're always hiring. I'll connect you`, `ok, introducing you to ${g.name}. be charming`], r)); later({ k: 'hello', id: g.id, via: id, due: S.week }); }
      else say(pickLine(['let me think who would actually be useful', 'hmm. most of my lot are between jobs too', 'I\'ll think about it'], r), 'none');
      break;
    }
    case 'advice': {
      const tip = typeof MENTOR_TIPS !== 'undefined' ? MENTOR_TIPS[(id + S.week) % MENTOR_TIPS.length] : 'keep going';
      d = 1.5; trust(id, 2); M.stress = clamp(M.stress - 2, 0, 100);
      say(pickLine([`honestly? ${tip.toLowerCase()}`, `what I wish I'd known: ${tip.toLowerCase()}`, `${tip} that's all I've got. it took me ten years`], r)); ab = 'question'; break;
    }
    case 'askabout': {
      const f = theirActive(id), rf = theirRecent(id, 30);
      d = .8; say(f ? pickLine([`I'm on ${f.title}. long days, good people`, `${f.title}. can't say much but it's going well`, `${f.title}, and I've not slept since it started`], r) : rf ? pickLine([`still recovering from ${rf.title} honestly`, `taking a breather after ${rf.title}`], r) : pickLine(['between things. reading a lot. panicking a little', 'nothing! it\'s terrifying', 'a couple of things I can\'t talk about yet'], r)); ab = 'work'; break;
    }
    case 'congrats': d = 2; trust(id, 1); say(pickLine(['thank you!! it\'s been a wild ride', 'stop, you\'re making me blush', 'means a lot. drinks soon?'], r)); break;
    case 'compliment': d = q.traits && q.traits.includes('Vain') ? 3 : 1.5; say(pickLine(['oh, that\'s so kind. nobody ever mentions that one', 'you noticed that? I could cry', 'ha, I was so scared on that job. thank you'], r)); break;
    case 'vent': d = o > 10 ? 1.5 : .3; M.stress = clamp(M.stress - (o > 10 ? 3 : 1), 0, 100); say(o > 10 ? pickLine(['that sucks. you\'re doing better than you think', 'ugh. come over, I have wine and opinions', 'every job has that week. you\'ll be fine'], r) : pickLine(['oh no. hope it gets better', 'that sounds rough'], r), 'sad'); ab = 'chat'; break;
    case 'deep': d = 2.5; trust(id, 3); mood = 'sad'; { const t = (q.traits || [])[0]; say(pickLine([`honestly? I'm tired. ${t ? `people think I'm ${t.toLowerCase()}, and I am, but it's exhausting` : 'but thank you for asking'}`, 'better now that someone asked', 'some days are hard. this helps'], r)); k.deep = (k.deep || 0) + 1; } ab = 'question'; break;
    case 'meme': { const ok = prnd() < .5 + me.mind.cha / 60; d = ok ? 1.5 : .2; if (ok) C.jokes++; say(ok ? pickLine(['NO 😂', 'I\'m crying', 'sending this to everyone I know'], r) : pickLine(['lol', 'ha'], r)); break; }
    case 'gossip': {
      const g = has(q, 'Gossip') || has(q, 'Gregarious'); d = g ? 2 : .3; trust(id, g ? 1 : -2);
      say(g ? pickLine(['STOP. tell me everything', 'I knew it. I KNEW it', 'ok I have more on that actually'], r) : pickLine(['huh. not sure I want to know', 'careful who you say that to', 'poor them'], r), g ? 'happy' : 'none');
      if (x.who !== undefined && prnd() < (g ? .3 : .12)) later({ k: 'leak', id: x.who, via: id, due: S.week + 1 + Math.floor(prnd() * 3) });
      break;
    }
    case 'pitch': { const keen = prnd() < clamp(.25 + o / 80 + me.mind.tas / 60, .1, .85); d = keen ? 1 : 0; say(keen ? pickLine(['ok that\'s actually good. send me something', 'I\'d watch that. write it up', 'huh. yes. send pages'], r) : pickLine(['not for me, but I like the swing', 'ha. maybe not that one', 'hm. keep thinking'], r)); if (keen) later({ k: 'pitch', id, idea: x.idea, due: S.week + 2 + Math.floor(prnd() * 3) }); break; }
    case 'borrow': {
      const amt = Math.round(usd(300 + q.standing * 40) / 50) * 50;
      if (prnd() < clamp(.25 + o / 90 + k.trust / 200, .1, .9)) { M.cash += amt; (M.loans = M.loans || {})[id] = { amt, w: S.week }; d = -.5; say(pickLine([`sent you ${fmtCash(amt)}. no rush. ok, some rush`, `done. ${fmtCash(amt)}. pay me back when you can`, `${fmtCash(amt)} on its way. don't make it weird`], r)); }
      else { d = -1; say(pickLine(['I\'m really sorry, I\'m stretched too', 'I can\'t, honestly. I\'m broke as well', 'I don\'t lend money to friends. it\'s a rule. sorry'], r), 'none'); }
      break;
    }
    case 'repay': { const L = M.loans[id]; M.cash -= L.amt; delete M.loans[id]; d = 2; trust(id, 6); say(pickLine(['you\'re a good egg', 'got it, thank you! didn\'t doubt you', 'received. you\'re officially trustworthy'], r)); break; }
    case 'thank': d = 1.5; trust(id, 2); say(pickLine(['oh stop. you did the work', 'that\'s really nice to hear', 'I\'m keeping this message'], r)); break;
    case 'reconnect': d = 3; say(pickLine(['oh my god, hi!! I was just thinking about you', 'it HAS been forever. let\'s fix that', 'you! I\'ve missed you. how are you?'], r)); ab = 'chat'; break;
    case 'invite': { const ok = prnd() < clamp(.35 + o / 70, .1, .9); d = ok ? 2 : .2; if (ok) { M.stress = clamp(M.stress - 2, 0, 100); M.energy = clamp(M.energy - 4, 0, 100); } say(ok ? pickLine(['I\'m in. that was a great night, by the way', 'yes! and then we went for noodles, remember?', 'came, saw, danced badly. thank you'], r) : pickLine(['can\'t make it, sorry! next time', 'oh, I\'m away. have fun'], r)); break; }
    case 'confess': {
      const p = clamp((o - 20) / 45, .05, .85);
      if (prnd() < p) { d = 4; mood = 'love'; setRel(id, 'partner'); say(pickLine(['I was hoping you\'d say that', 'me too. I\'ve felt the same for ages', '…yes. ok. yes. me too'], r)); }
      else { d = -2; mood = 'none'; M.stress = clamp(M.stress + 4, 0, 100); say(pickLine(['oh. I\'m flattered, honestly. but I don\'t feel the same', 'I think we\'re better as friends. I hope that\'s ok', 'I\'m seeing someone. I\'m sorry'], r)); }
      break;
    }
    case 'makeup': { const ok = prnd() < clamp(.3 + k.trust / 150 + (has(q, 'Diplomatic') ? .2 : 0) - (has(q, 'Volatile') ? .15 : 0), .1, .85); d = ok ? 8 : -1; say(ok ? pickLine(['ok. truce. I\'m tired of it too', 'fine. coffee. you\'re paying', 'water under the bridge. mostly'], r) : pickLine(['not yet', 'I\'ll think about it', 'you know what you did'], r), ok ? 'happy' : 'none'); if (ok && rel === 'rival') { k.tags = k.tags.filter(t => t !== 'Rival'); } break; }
    case 'needle': { d = -4; mood = 'none'; const s = has(me, 'Witty') ? 1 : 0; M.stress = clamp(M.stress - 2 - s, 0, 100); say(pickLine(['wow. classy', 'say that to my face', 'I\'ll remember that'], r)); break; }
    case 'breakup': { d = -12; mood = 'sad'; setRel(id, 'ex'); M.stress = clamp(M.stress + 8, 0, 100); say(pickLine(['ok. I think I knew. I\'m going to go', 'wow. by text?', 'right. I\'ll come and get my things'], r)); break; }
  }
  if (d) addTie(me, q, d);
  sms(id, back, 'text', { mood, topic: ab || 'chat', replyable: 1 });
  if (ab) askBack(q, ab);
  return true;
}
// ---- they ask things of you ----
const ASKS = [
  { k: 'lend', t: 'I hate asking, but could you lend me {amt}? I\'ll pay you back next month' },
  { k: 'move', t: 'are you free Sunday? I\'m moving flats and I have a van and no friends with arms' },
  { k: 'read', t: 'would you read my pages? twenty of them. be honest. not too honest' },
  { k: 'screen', t: 'we\'re screening our short on Thursday. would you come? I need friendly faces' },
  { k: 'cover', t: 'can you cover my shift on Saturday? it pays, it\'s easy, I\'ll owe you forever' },
  { k: 'ref', t: 'can I put you down as a reference? they might call' },
  { k: 'pet', t: 'any chance you could feed my cat for three days? he\'s mostly fine' },
  { k: 'tape', t: 'could you read opposite me for a self-tape? fifteen minutes, I promise' }
];
Object.assign(REPLY_LABELS, { askyes: '👍 Yes, of course', askno: '🙅 Sorry, can\'t', asklater: '⏳ Maybe next week' });
function askReply(q, m, k) {
  const M = S.me, A = ASKS.find(x => x.k === m.ask) || ASKS[0], r = q.id + M.phoneN;
  if (k === 'askno') return { mine: pickLine(['I\'m really sorry, I can\'t this time', 'can\'t, sorry! I\'m slammed', 'I\'d love to but no'], r), back: pickLine(['no worries', 'all good, I\'ll ask someone else', 'ok. thought I\'d try'], r), d: has(q, 'Volatile') ? -2 : -.8 };
  if (k === 'asklater') return { mine: pickLine(['ask me again next week? it\'s chaos', 'can it wait a few days?'], r), back: pickLine(['sure, no rush', 'it kind of can\'t, but ok'], r), d: -.2 };
  M.known[q.id].due = (M.known[q.id].due || 0) + 1; trust(q.id, 4);
  if (A.k === 'lend') { const amt = m.amt || 100; M.cash -= amt; later({ k: 'payback', id: q.id, amt, due: S.week + 4 + Math.floor(prnd() * 6), stiff: prnd() < (has(q, 'Reckless') ? .4 : .1) }); }
  if (A.k === 'cover') M.cash += usd(120);
  if (['move', 'cover', 'screen', 'read', 'tape'].includes(A.k)) M.energy = clamp(M.energy - (A.k === 'move' ? 12 : 5), 0, 100);
  return { mine: pickLine(['yes, of course', 'done. you owe me a coffee', 'for you? always'], r), back: pickLine(['you\'re a lifesaver', 'thank you. I won\'t forget this', 'I owe you. really'], r), d: 3 };
}
// Weekly: answers that take time, consequences that catch up, and friends who need something.
function msgWeek() {
  const M = S.me, me = ME();
  stakesWeek(); workMailWeek(); inviteMailWeek();
  for (const x of (M.msgq || []).filter(x => !x.done && x.due <= S.week)) {
    x.done = 1; const q = P(x.id); if (!q || q.dead) continue;
    if (x.k === 'leadlater' && M.known[x.id]) { const f = theirActive(x.id) || S.active.map(i => S.films[i]).find(f2 => f2.hub === M.hub && f2.stage >= 0 && f2.stage < 4 && f2.stageEnd - S.week >= 2 && keyIds(f2).some(j => tie(q, P(j)) > 25)); const p = f && prnd() < .6 ? makeLead(x.id, f) : null; sms(x.id, p ? `found you something: ${f.title} needs a ${p.t.toLowerCase()}. I've mentioned you, apply this week` : pickLine(['asked around. nothing yet, sorry. I\'ll keep trying', 'no luck so far. it\'s dead out there'], x.id + S.week), 'text', { replyable: 1, topic: p ? 'tip' : 'chat' }); }
    else if (x.k === 'hello' && M.known[x.id]) sms(x.id, pickLine([`hi! ${P(x.via).name.split(' ')[0]} said I should say hello. coffee sometime?`, `${P(x.via).name.split(' ')[0]} speaks very highly of you. nice to meet you, sort of`, `hello! I'm told we should know each other`], x.id), 'text', { replyable: 1, topic: 'chat' });
    else if (x.k === 'leak') { if (!M.known[x.id]) continue; addTie(me, q, -6); trust(x.id, -8); sms(x.id, pickLine(['heard what you said about me. nice', 'funny, someone told me what you\'ve been saying. we should talk', 'I thought we were friends'], x.id + S.week), 'text', { replyable: 1, topic: 'bad', mood: 'none' }); }
    else if (x.k === 'pitch' && M.known[x.id]) { const good = prnd() < clamp(.3 + me.mind.tas / 30 + me.mind.tas / 60, .15, .85); addTie(me, q, good ? 3 : 0); if (good) M.refs[x.id] = (M.refs[x.id] || 0) + 1; sms(x.id, good ? pickLine([`still thinking about ${x.idea}. if you write it, I want to see it first`, `told a producer friend about ${x.idea}. they want to meet you`, `that idea of yours keeps coming back to me. write it`], x.id) : pickLine(['thought about your idea. not sure it\'s a film yet. but keep going', 'it\'s not there yet. but you are, if that makes sense'], x.id), 'text', { replyable: 1, topic: good ? 'good' : 'chat' }); }
    else if (x.k === 'payback' && M.known[x.id]) { if (x.stiff) { addTie(me, q, -2); sms(x.id, pickLine(['I know I owe you. I haven\'t forgotten. soon', 'about the money. can it be a bit longer?'], x.id), 'text', { replyable: 1, topic: 'chat' }); } else { M.cash += x.amt; sms(x.id, `sent back the ${fmtCash(x.amt)}. thank you for trusting me`, 'text', { replyable: 1, topic: 'good' }); } }
    else if (x.k === 'mail') { const n0 = (M.mail || []).length; mailReply(x); if (typeof mailEchoAfter === 'function') mailEchoAfter(x, n0); }
  }
  M.msgq = (M.msgq || []).filter(x => !x.done || S.week - x.due < 4);
  // an unpaid loan sours things
  for (const id in M.loans || {}) { const L = M.loans[id]; if (S.week - L.w > 12 && (S.week - L.w) % 6 === 1 && !P(+id).dead) { addTie(me, P(+id), -3); sms(+id, pickLine(['hey, awkward, but about that money…', 'not to nag, but I could really use that money back', 'still waiting on that loan. just saying'], +id + S.week), 'text', { replyable: 1, topic: 'chat', mood: 'none' }); } }
  // a friend asks something of you
  if (S.week % 3 === (M.id || 0) % 3) {
    const IC = innerCircle(), ids = IC.filter(x => x[1] >= 2).map(x => x[0]);
    if (ids.length && prnd() < .35) { const id = ids[Math.floor(prnd() * ids.length)], A = ASKS[Math.floor(prnd() * ASKS.length)], amt = Math.round(usd(150 + prnd() * 450) / 10) * 10; sms(id, A.t.replace('{amt}', fmtCash(amt)), 'text', { replyable: 1, topic: 'ask', ask: A.k, amt }); }
  }
}
// ---- email: write to companies and people you've never met ----
const EMAIL_KINDS = {
  enquire: { l: 'Ask a company about openings', to: 'co', subj: 'Enquiry about work' },
  pitchco: { l: 'Pitch a company an idea', to: 'co', subj: 'A project you might like' },
  cold: { l: 'Cold email someone you admire', to: 'star', subj: 'A note from a fan in the business' },
  meet: { l: 'Ask a contact for a meeting', to: 'known', subj: 'Could we meet?' },
  thanks: { l: 'Send a thank-you note', to: 'known', subj: 'Thank you' },
  agent: { l: 'Ask an agency to represent you', to: 'agency', subj: 'Seeking representation' }
};
function mailTargets(kind) {
  const M = S.me, K = EMAIL_KINDS[kind];
  if (K.to === 'agency') return M.agent ? [] : agenciesIn(M.hub).map((ag, i) => ['a' + i, `${ag.name} (${AG_FOCUS[ag.focus] || 'everyone'})`]);
  if (K.to === 'co') return S.companies.filter(c => c.closed === null && c.owner === undefined && (c.hub === M.hub || c.tier === 1)).sort((a, b) => a.tier - b.tier || (a.hub === M.hub ? -1 : 1)).slice(0, 40).map(c => ['c' + c.id, c.name + (c.hub !== M.hub ? ` (${HUBS[c.hub].name})` : '')]);
  if (K.to === 'star') return S.people.filter(p => !p.dead && !p.retired && !p.player && p.hub === M.hub && !M.known[p.id] && p.standing >= 40).sort((a, b) => b.standing - a.standing).slice(0, 30).map(p => ['p' + p.id, `${p.name} (${ROLE_LABEL[p.role] || ''})`]);
  return aliveKnown().sort((a, b) => opinion(b) - opinion(a)).slice(0, 40).map(id => ['p' + id, P(id).name]);
}
function emailAct(a) {
  const M = S.me, K = EMAIL_KINDS[a.kind]; if (!K || !a.to) return false;
  const isCo = a.to[0] !== 'p', ref = +a.to.slice(1), who = a.to[0] === 'a' ? agenciesIn(M.hub)[ref] : isCo ? S.companies.find(c => c.id === ref) : P(ref);
  if (!who || (!isCo && (who.dead || (K.to === 'known' && !M.known[ref])))) return false;
  M.emailW = M.emailW || {}; const key = a.kind + a.to; if (M.emailW[key] !== undefined && S.week - M.emailW[key] < 8) return false; M.emailW[key] = S.week;
  const text = String(a.text || '').trim().slice(0, 1200), rude = readIntent(text).rude;
  mail('sent', 'You → ' + who.name, K.subj, text || `Dear ${isCo ? 'team' : who.name.split(' ')[0]},\n\n${{ enquire: 'I\'m writing to ask whether you have any openings. My work is attached.', pitchco: 'I have a project I think suits your slate. Could I send you a one-page outline?', cold: 'I\'ve admired your work for years and wanted to say so. If you ever have ten minutes for someone starting out, I\'d be grateful.', meet: 'Would you have time for a short meeting in the next few weeks? I\'d value your thoughts.', thanks: 'Just a note to say thank you. It made a real difference.', agent: 'I\'m looking for representation and I\'d love to talk. My credits and reel are attached.' }[a.kind]}\n\nBest,\n${ME().name}`);
  later({ k: 'mail', kind: a.kind, to: a.to, id: isCo ? -1 : ref, effort: Math.min(1, text.length / 400), rude, text: text.slice(0, 600), due: S.week + 1 + Math.floor(prnd() * 2) });
  return true;
}
function mailReply(x) {
  const M = S.me, me = ME(), isCo = x.to[0] !== 'p', ref = +x.to.slice(1), who = x.to[0] === 'a' ? agenciesIn(M.hub)[ref] : isCo ? S.companies.find(c => c.id === ref) : P(ref);
  if (!who || (!isCo && who.dead)) return;
  const sig = isCo ? `${who.name}` : who.name, re = 'Re: ' + EMAIL_KINDS[x.kind].subj, base = clamp(.2 + me.standing / 100 + me.credits.length * .03 + x.effort * .15 - (x.rude ? .5 : 0), .05, .9);
  if (x.kind === 'enquire') {
    const f = S.active.map(i => S.films[i]).find(f2 => f2.co === ref && f2.stage >= 0 && f2.stage < 4 && f2.stageEnd - S.week >= 2);
    const lead = f && prnd() < base ? (() => { const id = keyIds(f).find(j => P(j) && !P(j).dead); if (id === undefined) return null; meet(id, `Answered your enquiry at ${who.name}`, 4); return makeLead(id, f); })() : null;
    mail('offers', sig, re, lead ? `Thanks for getting in touch. As it happens we're crewing ${f.title} and looking for a ${lead.t.toLowerCase()}. It's on your board; mention this email when you apply.\n\nProduction office, ${who.name}` : prnd() < .5 ? `Thank you for your interest. We don't have anything suitable right now, but we'll keep your details on file.\n\n${who.name}` : 'This mailbox is not monitored. Please do not reply.', null);
  } else if (x.kind === 'pitchco') {
    const ok = prnd() < base * .7; mail('offers', sig, re, ok ? `We read your outline and we're intrigued. When it's a full draft, send it to us first. We mean that.\n\nDevelopment, ${who.name}` : `Thank you for thinking of us. We don't accept unsolicited submissions, and have deleted your attachment unread.\n\n${who.name}`, null);
    if (ok) (M.flags = M.flags || {}).firstLook = ref;
  } else if (x.kind === 'cold') {
    if (prnd() < base * .5) { meet(ref, 'Answered your email', 6); mail('inbox', who.name, re, pickLine(['That was a lovely email. I don\'t usually answer these, but I remember being where you are. Keep going. If our paths cross, say hello.', 'Thank you. Truly. Here is the only advice I have: make the thing you can make with what you have. Then make the next one.', 'I read this on a plane and it made my day. Good luck. You\'ll need less of it than you think.'], ref) + `\n\n${who.name.split(' ')[0]}`, null); }
    else if (prnd() < .4) mail('inbox', `Office of ${who.name}`, re, `Thank you for your message. ${who.name.split(' ')[0]} receives a great deal of mail and is unable to reply personally.`, null);
  } else if (x.kind === 'meet') {
    if (M.known[ref] && prnd() < clamp(base + opinion(ref) / 80, .1, .95)) { const s = freeSlot({ from: 2, blocks: [0, 1] }); if (s) { bookAppt(Object.assign({ kind: 'coffee', who: ref }, s)); mail('inbox', who.name, re, `Happy to. ${slotLabel(s)}? I'll find us somewhere quiet.\n\n${who.name.split(' ')[0]}`, null); } }
    else mail('inbox', who.name, re, `Things are mad at the moment, but let's try again in a month or two.\n\n${who.name.split(' ')[0]}`, null);
  } else if (x.kind === 'thanks') { if (M.known[ref]) { addTie(me, who, 3); trust(ref, 3); mail('inbox', who.name, re, pickLine(['You didn\'t need to, but I\'m glad you did. Onwards.', 'This made my week. Let\'s work together again soon.'], ref) + `\n\n${who.name.split(' ')[0]}`, null); } }
  else if (x.kind === 'agent') {
    if (M.agent) mail('inbox', sig, re, 'Thank you for your interest. We understand you are already represented, and we don\'t poach. Well, not by email.', null);
    else if (prnd() < clamp(queryOdds(who) + x.effort * .1 - (x.rude ? .3 : 0), .02, .9)) { mail('offers', sig, re, `We've looked at your work and we'd like to meet. Our agents hear about jobs before they're posted. Expect a call.\n\n${who.name}`, null); inbox('agentoffer', `${who.name} calls`, `They read your email and want to represent you. ${Math.round((AG_STYLE[who.style || 'nurturer'] || AG_STYLE.nurturer).cut * 100)} per cent of everything; better jobs, better money.`, { ag: who.i, choices: [{ k: 'yes', label: 'Sign with them' }, { k: 'no', label: 'Not yet' }] }); }
    else mail('inbox', sig, re, `Thank you for reaching out. Our list is full at present. We wish you every success.\n\n${who.name}`, null);
  }
}
function composeMailHTML() {
  const C = UI.mc = UI.mc || { kind: 'enquire', to: '' }, T = mailTargets(C.kind);
  if (!T.some(t => t[0] === C.to)) C.to = T.length ? T[0][0] : '';
  return `<div class="mread mcompose"><h4>✏️ New email</h4><label class="small">What about ${sel('mc-kind', Object.entries(EMAIL_KINDS).map(([k, v]) => [k, v.l]), C.kind)}</label><label class="small">To ${T.length ? sel('mc-to', T, C.to) : '<span class="muted">nobody suitable yet</span>'}</label><textarea id="mc-text" rows="6" maxlength="1200" placeholder="Write it yourself, or leave blank for a polite standard note. Effort shows; rudeness shows more.">${esc(C.text || '')}</textarea><p><button class="btn-s" data-mailsend="1"${T.length ? '' : ' disabled'}>Send</button> <span class="muted small">Replies take a week or two, if they come.</span></p></div>`;
}
function msgClick(t) {
  const d = t.dataset;
  if (d.mailsend) { const C = UI.mc || {}; C.text = ($('#mc-text') || {}).value || ''; doAct({ t: 'email', kind: C.kind, to: C.to, text: C.text }); UI.mc = { kind: C.kind, to: '', text: '' }; UI.mailf = 'sent'; render(true); return true; }
  return false;
}
// ---- who texts you, and why it matters ----
// The phone is quieter now. Most texts come from your inner circle: your partner, close friends, your mentor,
// people you've worked with in the last few months, and old ties. Many of them carry stakes: a friend in a
// crisis, a collaborator crewing up, a warning about a rival, a reference call. Answer, and it counts. Ignore
// one for a week, and that counts too.
function recentColleagues() {
  const M = S.me, out = new Set(), add = f => { if (f) for (const x of keyIds(f)) out.add(x); };
  for (const j of M.jobs) { if (j.head !== null && j.head !== undefined) out.add(j.head); if (j.film !== null && j.film !== undefined) add(S.films[j.film]); }
  for (const p of M.past) if (S.week - p.to <= 16) { if (p.head !== null && p.head !== undefined) out.add(p.head); if (p.film !== null && p.film !== undefined) add(S.films[p.film]); }
  return out;
}
function innerCircle() {
  const M = S.me, rec = recentColleagues();
  return aliveKnown().map(id => {
    const k = M.known[id], rel = relOf(id), o = opinion(id); let w = 0;
    w += { partner: 6, close: 4, mentor: 3, friend: 2, rival: .6, cold: .4, ex: .4 }[rel] || 0;
    if (rec.has(id)) w += 3;
    if (S.week - k.met >= 26 && o > 15) w += 1.5;
    if (S.week - (k.seen !== undefined ? k.seen : k.met) <= 2) w += .8;
    return [id, w];
  }).filter(x => x[1] > 0);
}
function pickWeighted(L) { let r = prnd() * L.reduce((s, x) => s + x[1], 0); for (const x of L) { r -= x[1]; if (r <= 0) return x[0]; } return L.length ? L[L.length - 1][0] : null; }
const STAKES = {
  crisis: { lines: ['I didn\'t get it. I\'m kind of a mess. can you call?', 'bad day. really bad. are you around?', 'I think I just got fired. I don\'t know what to do'], miss: -5, missT: 'never mind. I worked it out', opts: { st_call: '📞 Call them now', st_text: '💬 Send something kind', st_busy: '⏳ "Slammed, later?"' }, ok: id => opinion(id) > 10 },
  collab: { lines: ['I\'m putting a team together for my next one. are you in?', 'I want you on my next job. say yes before I change my mind', 'building a crew for {film}. thought of you first'], miss: -2, missT: 'guess that\'s a no then. no worries', opts: { st_in: '🙌 I\'m in', st_maybe: '🤔 Send me details', st_pass: '🙅 Can\'t, sorry' }, ok: id => opinion(id) > 5 && recentColleagues().has(id) },
  warn: { lines: ['heads up: {who} has been badmouthing you. thought you should know', 'not to stir, but {who} told people you were difficult on your last job', 'careful around {who}. they\'re saying things about you'], miss: 0, opts: { st_confront: '😤 Confront them', st_rise: '🧘 Rise above it', st_charm: '🌹 Win them over' }, ok: id => opinion(id) > 15 },
  reference: { lines: ['someone just called me about you for a job. what do you want me to say?', 'got a reference call about you. want me to lay it on thick?'], miss: -1, missT: 'told them you were fine. hope that\'s ok', opts: { st_sell: '🔥 "Sell me hard"', st_honest: '🤝 "Just be honest"' }, ok: id => opinion(id) > 10 },
  partner: { lines: ['can we talk tonight? properly', 'I feel like I never see you anymore', 'are we ok? you\'ve been somewhere else lately'], miss: -6, missT: 'ok. noted.', opts: { st_home: '🏠 "I\'ll be home early"', st_reassure: '❤️ Reassure them', st_later: '⏳ "This week is mad"' }, ok: id => relOf(id) === 'partner' },
  credit: { lines: ['so the producer is calling that idea of yours "theirs" now', 'they cut your best work and the director is taking the credit for the fix', 'you know the bit everyone loved? someone else is getting the credit'], miss: 0, opts: { st_fight: '⚔️ Fight for it', st_letgo: '🤷 Let it go' }, ok: id => recentColleagues().has(id) },
  secret: { lines: ['can you keep a secret? I\'m leaving the business', 'promise you won\'t tell anyone: I\'m up for something huge', 'don\'t tell a soul, but I think my film is going to get shut down'], miss: -1, missT: 'forget I said anything', opts: { st_keep: '🤐 "My lips are sealed"', st_tell: '👀 Tell someone anyway' }, ok: id => opinion(id) > 25 },
  scoop: { lines: ['there\'s a job going on {film} that hasn\'t been posted. want it?', 'insider tip: {film} is hiring tomorrow. move fast'], miss: -1, missT: 'filled. you snooze you lose', opts: { st_jump: '🏃 "Yes! Put me in"', st_pass: '🙅 Not for me' }, ok: id => !!theirActive(id) }
};
Object.assign(REPLY_LABELS, ...Object.values(STAKES).map(s => s.opts));
function stakeText(id) {
  const M = S.me, ks = Object.keys(STAKES).filter(k => STAKES[k].ok(id) && !(M.phone || []).some(m => m.stake === k && S.week - m.w < 12) && !(M.mail || []).some(m => m.act && m.act.stake === k && S.week - m.w < 12));
  if (!ks.length) return false;
  const k = ks[Math.floor(prnd() * ks.length)], St = STAKES[k], f = theirActive(id), pool = aliveKnown().filter(j => j !== id && (['rival', 'cold'].includes(relOf(j)) || opinion(j) < 5)), who = pool.length ? pool[Math.floor(prnd() * pool.length)] : null;
  if (k === 'warn' && who === null) return false;
  if (MAIL_STAKES[k]) return stakeMail(id, k);
  const t = pickLine(St.lines, id + S.week).replace('{film}', f ? f.title : 'my next thing').replace('{who}', who !== null ? P(who).name.split(' ')[0] : 'someone');
  sms(id, t, 'text', { replyable: 1, topic: 'stake', stake: k, who, mood: k === 'crisis' || k === 'partner' ? 'sad' : 'happy' });
  return true;
}
function stakeOpts(m) { return Object.keys((STAKES[m.stake] || STAKES.crisis).opts); }
function stakeReply(q, m, k) {
  const M = S.me, me = ME(), r = q.id + M.phoneN, who = m.who !== null && m.who !== undefined ? P(m.who) : null;
  const R = (mine, back, d) => ({ mine: pickLine(mine, r), back: pickLine(back, r + 1), d });
  switch (k) {
    case 'st_call': M.energy = clamp(M.energy - 6, 0, 100); trust(q.id, 5); return R(['calling you now', 'pick up. I\'m here'], ['…thank you. I needed that', 'you didn\'t have to. but I\'m glad you did'], 6);
    case 'st_text': return R(['I\'m so sorry. you\'re going to be ok, I promise', 'this is awful and it isn\'t your fault'], ['thank you. means a lot', 'ok. breathing. thanks'], 2.5);
    case 'st_busy': return R(['slammed today, can I call later?'], ['sure', 'ok'], -3);
    case 'st_in': { const f = theirActive(q.id); const p = f ? makeLead(q.id, f) : null; if (p) { p.comp = (p.comp || 0) - 1.2; } else later({ k: 'leadlater', id: q.id, due: S.week + 2 + Math.floor(prnd() * 3) }); trust(q.id, 3); return R(['I\'m in. obviously'], [p ? `yes!! it's the ${p.t.toLowerCase()} on ${f.title}. apply, you're basically hired` : 'yes!! I\'ll send details when the money\'s in'], 3); }
    case 'st_maybe': later({ k: 'leadlater', id: q.id, due: S.week + 1 }); return R(['send me details?'], ['will do'], .5);
    case 'st_pass': return R(['can\'t this time, sorry'], ['next time then', 'shame. ok'], -1);
    case 'st_confront': { if (!who) return R(['who?'], ['never mind'], 0); const ok = roll('cha', 12); addTie(me, who, ok ? 4 : -6); return R([`I'll talk to ${who.name.split(' ')[0]}`], [ok ? 'heard you two cleared the air. respect' : 'ooh. heard that got loud'], ok ? 1.5 : 0); }
    case 'st_rise': trust(q.id, 2); M.stress = clamp(M.stress + 2, 0, 100); me.standing = clamp(me.standing + .2, 0, 100); return R(['thanks for telling me. I\'m not going to play that game'], ['classy. people notice that'], 1.5);
    case 'st_charm': { if (!who) return R(['who?'], ['never mind'], 0); const ok = roll('cha', 13); addTie(me, who, ok ? 8 : -2); if (ok) meet(who.id, null, 0); return R([`I'm going to buy ${who.name.split(' ')[0]} a drink`], [ok ? 'and now you\'re friends?? how' : 'that did not work, I hear'], 1); }
    case 'st_sell': { const ok = roll('cha', 11); M.refs[q.id] = (M.refs[q.id] || 0) + (ok ? 2 : 0); return R(['sell me hard. I owe you'], [ok ? 'told them you walk on water. they bought it' : 'laid it on thick. maybe too thick'], 1); }
    case 'st_honest': M.refs[q.id] = (M.refs[q.id] || 0) + 1; trust(q.id, 3); return R(['just be honest. that\'s enough'], ['easy then. you\'re good'], 2);
    case 'st_home': M.energy = clamp(M.energy - 4, 0, 100); M.stress = clamp(M.stress - 3, 0, 100); return R(['I\'ll be home early. we\'ll talk'], ['ok. thank you. I love you', 'good. I\'ll cook'], 6);
    case 'st_reassure': { const ok = prnd() < .6; return R(['we\'re ok. I promise. I\'ve just been stretched'], [ok ? 'ok. I believe you' : 'you always say that'], ok ? 3 : -1); }
    case 'st_later': return R(['this week is mad. sunday?'], ['sure. sunday.', 'it\'s always next week'], -4);
    case 'st_fight': { const ok = roll('com', 13); if (ok) me.standing = clamp(me.standing + .6, 0, 100); else M.stress = clamp(M.stress + 4, 0, 100); return R(['I\'m not letting that go'], [ok ? 'it worked. everyone knows it was yours now' : 'they dug in. you made it awkward for everyone'], ok ? 2 : -1); }
    case 'st_letgo': M.stress = clamp(M.stress + 3, 0, 100); return R(['not worth the fight'], ['you\'re better than me', 'hm. ok'], .5);
    case 'st_keep': trust(q.id, 6); return R(['my lips are sealed'], ['I knew I could trust you'], 3);
    case 'st_tell': { trust(q.id, -6); if (prnd() < .5) later({ k: 'leak', id: q.id, via: q.id, due: S.week + 1 + Math.floor(prnd() * 2) }); return R(['of course'], ['thank you'], 0); }
    case 'st_jump': { const f = theirActive(q.id), p = f ? makeLead(q.id, f) : null; if (p) p.comp = (p.comp || 0) - .8; return R(['YES. put me in'], [p ? `done. ${p.t}. apply today` : 'ah, it just went. sorry!'], 1.5); }
  }
  return R(['ok'], ['ok'], 0);
}
// Unanswered stakes cost you.
function stakesWeek() {
  const M = S.me, me = ME();
  for (const m of (M.phone || []).filter(m => m.topic === 'stake' && !m.replied && !m.missed && S.week - m.w >= 1)) {
    m.missed = 1; const St = STAKES[m.stake]; if (!St || !M.known[m.from] || P(m.from).dead) continue;
    if (St.miss) addTie(me, P(m.from), St.miss);
    if (St.missT) sms(m.from, St.missT, 'text', { mood: 'none', topic: 'chat', replyable: 1 });
  }
}
function pendingStakes() { return (S.me.phone || []).filter(m => m.topic === 'stake' && !m.replied && !m.missed); }

// ---- work correspondence goes by email ----
// Texts are for friends. Work arrives in the inbox: a collaborator crewing up, a reference check, a credit fight,
// an insider tip, a wrap note from your boss, a premiere invitation, the remittance for your last job. Each work
// email has reply buttons; leave one unanswered for a fortnight and the sender draws their own conclusions.
const MAIL_STAKES = {
  collab: ['Your next job?', 'Hi {me},\n\nI\'m putting a team together for {film} and I want you on it. Before I go to the agencies: are you in?\n\n{them}'],
  reference: ['Reference request', 'Hi {me},\n\nA production office just asked me for a reference on you. I\'m happy to give one. How hard do you want me to sell you?\n\n{them}'],
  credit: ['About the credit', 'Hi {me},\n\nAwkward one. Someone above us is claiming your work on the last job as theirs. I thought you\'d want to know before it gets into the trades.\n\n{them}'],
  scoop: ['Before it\'s posted', 'Hi {me},\n\n{film} is about to post a job that suits you. If you want it, say so today and I\'ll put your name in first.\n\n{them}']
};
function sigOf(q) { return `${q.name}${q.role ? ' (' + (ROLE_LABEL[q.role] || '').toLowerCase() + ')' : ''}`; }
function stakeMail(id, k) {
  const M = S.me, q = P(id), f = theirActive(id), [subj, body] = MAIL_STAKES[k];
  mail('offers', sigOf(q), subj, body.replace('{me}', ME().name.split(' ')[0]).replace('{them}', q.name.split(' ')[0]).replace('{film}', f ? f.title : 'my next film'), { k: 'opt', kind: 'stake', stake: k, id, opts: Object.entries(STAKES[k].opts) });
  return true;
}
const WRAP_OPTS = [['w_keep', 'Thank them and keep in touch'], ['w_ref', 'Ask for a reference'], ['w_next', 'Ask what they\'re doing next']];
function mailOptAct(m, k) {
  const M = S.me, me = ME(), A = m.act, q = A.id !== undefined ? P(A.id) : null, re = 'Re: ' + m.subj.replace(/^Re: /, '');
  const opt = (A.opts || []).find(o => o[0] === k); if (!opt) return false;
  m.done = k; m.doneT = `You replied: ${opt[1].replace(/^[^A-Za-z]+/, '').replace(/["“”]/g, '')}.`;
  if (A.kind === 'stake' && q && M.known[q.id]) {
    const R = stakeReply(q, { who: null, stake: A.stake }, k); addTie(me, q, R.d); M.known[q.id].seen = S.week;
    mail('inbox', sigOf(q), re, R.back.charAt(0).toUpperCase() + R.back.slice(1) + `.\n\n${q.name.split(' ')[0]}`, null);
    return true;
  }
  if (A.kind === 'wrap' && q) {
    if (k === 'w_keep') { addTie(me, q, 3); trust(q.id, 2); mail('inbox', sigOf(q), re, pickLine(['Likewise. Let\'s not leave it another five years.', 'You were a pleasure. Keep me posted.'], q.id) + `\n\n${q.name.split(' ')[0]}`, null); }
    else if (k === 'w_ref') { const ok = opinion(q.id) > 5; if (ok) M.refs[q.id] = (M.refs[q.id] || 0) + 1; else addTie(me, q, -1); mail('inbox', sigOf(q), re, ok ? 'Of course. Put my name down; I\'ll say good things because they\'re true.' : 'I\'d rather not, if that\'s all right. Nothing personal.', null); }
    else { const f = theirActive(q.id); const p = f && opinion(q.id) > 10 && prnd() < .5 ? makeLead(q.id, f) : null; mail('inbox', sigOf(q), re, p ? `Funny you ask: ${f.title}, and we need a ${p.t.toLowerCase()}. It's on your board. Apply.` : f ? `I'm on ${f.title}. Nothing for you right now, but I'll shout.` : 'Nothing yet. Resting, reading, panicking. I\'ll let you know.', null); }
    return true;
  }
  if (A.kind === 'invite') return inviteMailAct(m, k);
  if (A.kind === 'premiere') {
    const f = S.films[A.film];
    if (k === 'p_go') { M.cash -= usd(60); M.stress = clamp(M.stress - 3, 0, 100); me.standing = clamp(me.standing + .6, 0, 100); for (let i = 0; i < 2; i++) { const p2 = f ? keyIds(f).map(P).filter(x => x && !x.dead && !M.known[x.id])[i] : null; if (p2) meet(p2.id, `Met at the ${f.title} premiere`, 4); } m.doneT = `You went to the premiere of ${f ? f.title : 'the film'}. Red carpet, warm wine, two new numbers in your phone.`; }
    else m.doneT = 'You sent your regrets.';
    return true;
  }
  return true;
}
// Weekly work mail: wrap notes, remittances, premiere invitations; and unanswered work mail has consequences.
function workMailWeek() {
  const M = S.me, me = ME();
  for (const p of M.past.filter(p => p.to === S.week)) {
    const f = p.film !== null && p.film !== undefined ? S.films[p.film] : null, emp = p.mco || (p.co !== null && p.co !== undefined && S.companies[p.co] ? S.companies[p.co].name : null), where = f ? f.title : emp || 'the job';
    mail('inbox', f || emp ? `Accounts, ${where}` : 'Payroll', `Remittance: ${p.t.split(',')[0]}`, `Your final payment for ${f ? `your work on ${where}` : emp ? `your time at ${emp}` : `your work as ${p.t.toLowerCase()}`} has been sent. Please allow three to five working days. Do not reply to this email; nobody reads it.`, null);
    if (p.head !== null && p.head !== undefined && M.known[p.head] && !P(p.head).dead && !p.quit) { const q = P(p.head), good = (p.score || 0) >= 0; mail('inbox', sigOf(q), good ? `Thank you` : 'Wrapping up', good ? `Hi ${me.name.split(' ')[0]},\n\nJust wanted to say thank you for ${where}. You made my life easier, which is the highest compliment I give.\n\n${q.name.split(' ')[0]}` : `Hi ${me.name.split(' ')[0]},\n\nThat was a hard one. Thanks for sticking it out on ${where}. Let's both do better next time.\n\n${q.name.split(' ')[0]}`, { k: 'opt', kind: 'wrap', id: q.id, opts: WRAP_OPTS }); }
  }
  for (const id of me.credits) { const f = S.films[id]; if (f && f.rel === S.week) mail('offers', `${f.co !== null ? S.companies[f.co].name : 'The producers'} · Publicity`, `Invitation: the premiere of ${f.title}`, `You are warmly invited to the premiere of ${f.title}, followed by a reception. Black tie optional; enthusiasm mandatory. Please RSVP.`, { k: 'opt', kind: 'premiere', film: f.id, opts: [['p_go', 'Accept with pleasure'], ['p_no', 'Send regrets']] }); }
  for (const m of (M.mail || []).filter(m => m.act && m.act.k === 'opt' && m.act.kind === 'stake' && !m.done && S.week - m.w >= 2)) {
    m.done = 'missed'; m.doneT = 'You never replied.'; const q = P(m.act.id), St = STAKES[m.act.stake]; if (!q || !M.known[q.id]) continue;
    if (St && St.miss) addTie(me, q, St.miss);
    if (St && St.missT) mail('inbox', sigOf(q), 'Re: ' + m.subj, St.missT.charAt(0).toUpperCase() + St.missT.slice(1) + '.', null);
  }
}

// ---- the industry writes to you: invitations with something in them ----
const INVITE_MAILS = [
  { k: 'panel', subj: 'Would you speak on a panel?', body: 'We\'re hosting "Breaking In, Staying In" next month and would love a working voice on the panel. An hour, a microphone, free sandwiches.', yes: 'Agree to speak', fx: { stand: .6, energy: -6, meet: 1 }, min: 8 },
  { k: 'screen', subj: 'Private screening invitation', body: 'A small industry screening of a film we\'re very proud of, followed by drinks. Forty seats; one is yours if you want it.', yes: 'RSVP yes', fx: { stress: -2, meet: 1, tas: .05 }, min: 0 },
  { k: 'workshop', subj: 'Masterclass: places available', body: 'Two days with a working head of department. Small group, hands on, brutally honest notes. There is a fee.', yes: 'Book a place', fx: { cost: 180, main: .3, energy: -8 }, min: 0 },
  { k: 'breakfast', subj: 'Networking breakfast', body: 'Producers, agents and a man who swears he invented the steadicam. Coffee from seven.', yes: 'Go along', fx: { cost: 25, meet: 2, energy: -4 }, min: 0 },
  { k: 'jury', subj: 'Join our short film jury?', body: 'We need one more juror for the short film competition. You\'d watch forty shorts and argue about six of them.', yes: 'Join the jury', fx: { stand: .8, energy: -10, meet: 2, tas: .08 }, min: 18 },
  { k: 'mentee', subj: 'Would you mentor a student?', body: 'Our film school pairs final-year students with working people for a term. One coffee a month, one email a week.', yes: 'Say yes', fx: { stand: .4, stress: 1, meet: 1 }, min: 14 }
];
function inviteMailWeek() {
  const M = S.me, me = ME(); if (prnd() > .3) return;
  const L = INVITE_MAILS.filter(x => me.standing >= x.min && !(M.mail || []).some(m => m.act && m.act.inv === x.k && S.week - m.w < 26)); if (!L.length) return;
  const x = L[Math.floor(prnd() * L.length)], cos = S.companies.filter(c => c.hub === M.hub && c.closed === null), c = cos.length ? cos[Math.floor(prnd() * cos.length)] : null;
  mail('offers', c ? `${c.name} · Events` : 'Events team', x.subj, `Dear ${me.name.split(' ')[0]},\n\n${x.body}\n\nWarm regards,\nThe events team${c ? ', ' + c.name : ''}`, { k: 'opt', kind: 'invite', inv: x.k, opts: [['i_yes', x.yes], ['i_no', 'Politely decline']] });
}
function inviteMailAct(m, k) {
  const M = S.me, me = ME(), x = INVITE_MAILS.find(y => y.k === m.act.inv); if (!x) return true;
  if (k !== 'i_yes') { m.doneT = 'You declined politely.'; return true; }
  const f = x.fx; if (f.cost && M.cash < usd(f.cost)) { m.done = null; m.doneT = null; return false; }
  if (f.cost) M.cash -= usd(f.cost); if (f.energy) M.energy = clamp(M.energy + f.energy, 0, 100); if (f.stress) M.stress = clamp(M.stress + f.stress, 0, 100); if (f.stand) me.standing = clamp(me.standing + f.stand, 0, 100);
  if (f.tas) growSub(me, 'tas', f.tas);
  if (f.main) { const k2 = Object.keys(CRAFTS[MAIN[me.role]].subs)[0]; for (let i = 0; i < 3; i++) growSub(me, k2, f.main / 3); }
  const met = []; for (let i = 0; i < (f.meet || 0); i++) { const q = bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing - 6) + hashRand(m.id * 7 + i)() * 30 - (M.known[q.id] ? 99 : 0)); if (q && !M.known[q.id]) { meet(q.id, `Met at ${x.subj.toLowerCase().replace(/\?$/, '')}`, 4); met.push(q.name); } }
  m.doneT = `You said yes.${met.length ? ' You met ' + met.join(' and ') + '.' : ''}`;
  return true;
}
