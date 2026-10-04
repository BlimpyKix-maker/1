// ---------------- Conversations that answer back ----------------
// A text has a topic (a meme, a gripe, good news, a question, gossip, a request for advice) and the replies you can
// send fit it. What you write in your own words is read: a question gets an answer, an invitation gets a yes or a
// no and a time in the diary, a name gets their opinion of that person, a sharp word lands sharply, and a word of
// yours can come back to you weeks later. People remember: the advice you gave, the jokes that landed, the weeks you
// only sent a thumbs-up. All of it is decided from the logged action and the player's dice, so replays agree.
const ADVICE = [
  { q: 'boss takes credit', a: ['Say something, calmly', 'Wait and keep receipts'], kw: [/say|talk|tell|confront|speak/, /wait|keep|quiet|patient|receipt/], ok: [['talked to them like you said. they actually apologised. I\'m on the next one with my name on it', 'said something. now I\'m "difficult". off the next job. great'], ['kept quiet, kept emails. when it blew up I had everything. thank you', 'waited. they did it again. and again']] },
  { q: 'two job offers', a: ['Take the fun one', 'Take the money'], kw: [/fun|happy|joy|love|creative/, /money|pay|cash|rent|safe/], ok: [['took the fun one. best month of my working life', 'took the fun one. it got cancelled in week two. lol. lmao even'], ['took the money. paid off my card. boring and I don\'t care', 'took the money. miserable. counting the days']] },
  { q: 'quit acting and go into editing', a: ['Do it, you\'d be great', 'Don\'t burn the bridge yet'], kw: [/do it|go|yes|great|switch/, /don.t|wait|both|bridge|careful/], ok: [['started assisting in a cutting room. I think I\'ve found it', 'tried editing. turns out I hate sitting still. back to auditions'], ['doing both for now. glad I didn\'t jump', 'kept auditioning. nothing. should have jumped']] },
  { q: 'turn down a friend\'s film', a: ['Be honest, they\'ll get it', 'Do it as a favour'], kw: [/honest|no|turn|decline/, /favour|favor|yes|help|do it/], ok: [['told them. they were lovely about it. friendship intact', 'told them. they haven\'t spoken to me since'], ['did it. it was actually fun', 'did it. eighteen-hour days for nothing. never again']] },
  { q: 'move cities', a: ['Go, you can always come back', 'Stay and build here'], kw: [/go|move|leave|yes/, /stay|build|here|no/], ok: [['moved. first week was terrifying. now? I love it', 'moved. lonely. very lonely'], ['stayed. something just came through here', 'stayed. starting to think I should have gone']] },
  { q: 'NDA for a student film', a: ['Normal, sign it', 'Ask what it covers'], kw: [/sign|normal|fine/, /ask|read|check|lawyer/], ok: [['signed. it was fine. it\'s a film about a sad goose', 'signed. turns out it covered my next three ideas too'], ['asked. they rewrote it. good call', 'asked. they replaced me with someone who didn\'t ask']] },
  { q: 'say no to someone famous', a: ['Be gracious and brief', 'Say yes, it\'s too good'], kw: [/gracious|polite|no|brief|kind/, /yes|take|too good/], ok: [['said no nicely. they said "respect". I\'m still shaking', 'said no. their assistant has blocked me everywhere'], ['said yes. they remembered my name on day three!!', 'said yes. it was a nightmare. a famous nightmare']] },
  { q: 'job abroad', a: ['Go, it\'s a chance', 'Stay close to people'], kw: [/go|chance|abroad|yes/, /stay|people|home|no/], ok: [['took it. sending you a postcard. it\'s ridiculous here', 'took it. the job is great. I miss everyone'], ['stayed. glad. Sunday lunch is worth more than a credit', 'stayed. they gave it to someone else who\'s now everywhere']] },
  { q: 'script has a hole', a: ['Tell them, kindly', 'Leave it, not your job'], kw: [/tell|kind|honest|say/, /leave|not your|quiet|job/], ok: [['told them. they fixed it and thanked me in front of everyone', 'told them. they said "it\'s intentional". it was not'], ['said nothing. the critics said it for me', 'kept quiet. it worked out somehow']] },
  { q: 'more money for a worse job', a: ['Take the money', 'Hold out for better'], kw: [/money|take|yes/, /hold|wait|better|no/], ok: [['took it. my bank account says thank you', 'took it. I\'ve aged five years'], ['held out. something better came in yesterday!', 'held out. still holding. send snacks']] },
  { q: 'ask an ex for a reference', a: ['Totally fine, go for it', 'Find someone else'], kw: [/fine|go|ask|yes/, /someone else|no|don.t/], ok: [['asked. they were glowing. emotionally confusing', 'asked. the reference was… honest'], ['found someone else. smooth', 'couldn\'t find anyone else. awkward week']] },
  { q: 'work for free', a: ['Only if it helps you', 'No. Never for free'], kw: [/only|if|maybe|depends|yes/, /no|never|free|pay/], ok: [['did it. met a producer on it who\'s now paying me', 'did it. exposure is not a currency, it turns out'], ['said no. they found the budget. funny that', 'said no. they found someone who said yes']] }
];
const STOP = new Set(['about', 'there', 'their', 'would', 'could', 'should', 'which', 'these', 'those', 'think', 'thing', 'really', 'going', 'actually', 'because', 'something', 'anything', 'everything', 'nothing', 'people', 'always', 'never', 'maybe', 'still', 'sounds', 'pretty', 'right', 'today', 'tonight', 'though', 'where', 'whatever', 'honestly', 'literally', 'probably']);
function convoOf(id) { const M = S.me; M.convo = M.convo || {}; return M.convo[id] = M.convo[id] || { n: 0, brief: 0, jokes: 0, inv: 0, word: null, wordW: 0 }; }
function msgTopic(m) {
  if (m.topic) return m.topic;
  const t = String(m.t || '').toLowerCase();
  if (m.kind === 'advice') { const i = ADVICE.findIndex(A => t.includes(A.q.toLowerCase().split(' ')[0]) && t.includes(A.q.toLowerCase().split(' ').slice(-1)[0])); return i >= 0 ? 'adv' + i : 'question'; }
  if (/^\[/.test(t)) return 'meme';
  if (m.kind === 'gossip') return 'gossip';
  if (m.kind === 'tip') return 'tip';
  if (m.kind === 'love') return 'love';
  if (/fired|lost|over|hospital|dumped|died|sick|rejected|cancelled|flop|bad review|broke|miss(ed)? out/.test(t)) return 'bad';
  if (/got the|booked|cast|hired|engaged|pregnant|won|promot|greenlit|signed|yes!!|wrapped/.test(t)) return 'good';
  if (/too hot|strike|river|budgets|killing me|sick|terrible|hate|ugh|died/.test(t)) return 'gripe';
  if (/\?\s*$|^(what|how|are|do|is|should|tell me|quick)/.test(t)) return 'question';
  return 'chat';
}
const REPLY_SETS = {
  meme: ['laugh', 'meme', 'brief'], gripe: ['sympathy', 'invite', 'advise', 'brief'], bad: ['sympathy', 'invite', 'advise', 'brief'], good: ['congrats', 'drinks', 'jealous', 'brief'],
  question: ['warm', 'funny', 'invite', 'brief'], chat: ['warm', 'funny', 'invite', 'brief'], gossip: ['spill', 'nogossip', 'funny'], tip: ['thanks', 'askmore', 'brief'], love: ['warm', 'flirty', 'invite', 'brief']
};
const REPLY_LABELS = { laugh: '😂 Laugh', meme: '📸 Send one back', sympathy: '🫂 Be there', invite: '☕ Invite them out', advise: '💡 Give advice', congrats: '🎉 Celebrate', drinks: '🍾 Drinks on me', jealous: '😒 Grumble', spill: '👀 Tell me more', nogossip: '🙅 Not my business', thanks: '🙏 Thank them', askmore: '❓ Ask more', notsure: '🤷 Not sure', workgood: '😊 It\'s going great', workbad: '😩 It\'s a nightmare', worksecret: '🤐 Can\'t say' };
function replyLabel(m, k) { if (/^a[01]$/.test(k)) { const A = ADVICE[+msgTopic(m).slice(3)]; return '💬 ' + A.a[+k[1]]; } return REPLY_LABELS[k] || (REPLIES[k] ? REPLIES[k].label : k); }
function replyOptions(m) {
  const id = m.from, top = msgTopic(m);
  let o = top === 'stake' && typeof stakeOpts === 'function' ? stakeOpts(m) : top === 'ask' ? ['askyes', 'askno', 'asklater'] : /^adv\d+$/.test(top) ? ['a0', 'a1', 'notsure'] : top === 'work' ? ['workgood', 'workbad', 'worksecret'] : (REPLY_SETS[top] || REPLY_SETS.chat).slice();
  if (id >= 0 && (relOf(id) === 'partner' || canRomance(id)) && !o.includes('flirty') && ['chat', 'question', 'good'].includes(top)) o.splice(o.length - 1, 0, 'flirty');
  return o;
}
// ---- reading what you wrote ----
function readIntent(text) {
  const L = text.toLowerCase(), has = re => re.test(L);
  return {
    greet: has(/^(hi|hey|hello|yo|morning|evening|hiya)\b/), question: /\?\s*$/.test(text) || has(/^(what|how|why|when|where|who|are|do|did|can|could|will|would|should|is|any)\b/),
    invite: has(/coffee|drink|dinner|lunch|brunch|meet up|meet\b|hang|catch up|grab|come over|walk|sunday|saturday|tonight|tomorrow|weekend|this week/),
    love: has(/\blove\b|miss you|proud|adore|❤|you're the best|you are the best|thank|grateful/), sorry: has(/sorry|apolog|my bad|i was wrong/),
    funny: has(/haha|lol|lmao|😂|🤣|joke|hilarious/), rude: has(/hate you|stupid|idiot|shut up|annoying|whatever|leave me alone|get lost|boring|pathetic/),
    sympathy: has(/sorry to hear|that sucks|awful|here for you|hugs|🫂|rough|that's hard|so sorry/), congrats: has(/congrat|amazing|well done|so happy for you|brilliant|🎉|proud of you|incredible/),
    work: has(/\bjob\b|film|shoot|\bset\b|audition|script|gig|work|project|role|edit|song|album|podcast|video|show/), money: has(/money|broke|rent|pay|cash|loan/),
    yes: has(/^(yes|yeah|yep|sure|ok|okay|definitely|totally|absolutely|deal)\b/), no: has(/^(no|nope|nah|never|not really)\b/), long: text.length > 80
  };
}
function keyWord(text) { const w = text.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(x => x.length >= 6 && !STOP.has(x)); return w.sort((a, b) => b.length - a.length)[0] || null; }
function nameIn(text, exclude) { const L = text.toLowerCase(); for (const k of Object.keys(S.me.known)) { const p = P(+k); if (!p || +k === exclude) continue; const first = p.name.split(' ')[0].toLowerCase(); if (first.length >= 3 && new RegExp('\\b' + first + '\\b').test(L)) return +k; } return null; }
function tryInvite(q, kind, C, L) {
  const M = S.me, me = ME(), o = opinion(q.id), k = M.known[q.id];
  if ((M.appts || []).some(x => !x.done && x.who === q.id)) return { t: pickLine(['we already have a plan, silly', 'aren\'t we already meeting?', 'yes, we\'re already on. don\'t you dare cancel'], q.id + C.n), d: .5 };
  const s = typeof freeSlot === 'function' ? freeSlot({ from: 1, blocks: [1, 2] }) : null, p = clamp(.25 + o / 70 + k.trust / 250 - (seniorTo(q.id) ? .2 : 0) - C.inv * .05, .05, .95);
  C.inv++;
  if (!s || prnd() >= p) return { t: pickLine(o < 0 ? ['I\'m busy', 'not really', 'maybe not'] : ['ugh, slammed. rain check?', 'can\'t this week, but YES soon', 'I\'m away, but hold that thought'], q.id + C.n), d: o < 0 ? -.5 : .3 };
  if (typeof bookAppt === 'function') bookAppt(Object.assign({ kind, who: q.id }, s));
  C.inv = 0;
  return { t: pickLine(['yes! ' + slotLabel(s) + '?', 'done. ' + slotLabel(s) + ', you\'re buying', 'I\'m in. ' + slotLabel(s) + ' works', 'finally. ' + slotLabel(s) + ', don\'t be late'], q.id + C.n), d: 1.5, booked: s };
}
// How they answer: built from what you said, who they are, and what they remember.
function answerOwnBasic(q, text, m, C) {
  const I = readIntent(text), o = opinion(q.id), rel = relOf(q.id), t = q.traits || [], top = msgTopic(m), parts = [];
  let d = 1 + (I.long ? .5 : 0), mood = 'happy';
  if (I.rude) { d = t.includes('Volatile') ? -6 : -4; mood = 'none'; parts.push(t.includes('Volatile') ? pickLine(['wow. ok. noted', 'say that to my face', 'right. done talking to you for a bit'], q.id) : pickLine(['ouch', 'that was unnecessary', 'ok… I\'ll pretend I didn\'t read that'], q.id)); return { t: parts.join(' '), d, mood }; }
  if (I.sorry) { d = 2; parts.push(o < 0 ? pickLine(['…thank you for saying it', 'ok. I\'m listening'], q.id) : pickLine(['don\'t be silly, we\'re fine', 'water under the bridge', 'you\'re forgiven. obviously'], q.id + C.n)); }
  if (/^adv\d+$/.test(top)) { const i = +top.slice(3), A = ADVICE[i], pick = A.kw[0].test(text.toLowerCase()) ? 0 : A.kw[1].test(text.toLowerCase()) ? 1 : null; if (pick !== null) { scheduleAdvice(q.id, i, pick); parts.push(pickLine(['ok. you\'re right. I\'ll do it', 'that\'s what I needed to hear', 'hm. yeah. ok. thank you'], q.id + C.n)); d += 1; } else parts.push(pickLine(['so… is that a yes or a no 😅', 'very wise. very vague', 'I\'ll take that as "your call"'], q.id + C.n)); }
  if (I.congrats && top === 'good') { d += 1.5; parts.push(pickLine(['thank you!! still can\'t believe it', 'stop, I\'m blushing', 'means a lot coming from you'], q.id + C.n)); }
  if (I.sympathy && (top === 'bad' || top === 'gripe')) { d += 1.5; mood = 'sad'; parts.push(pickLine(['thank you. really', 'I needed that today', 'you\'re a good one'], q.id + C.n)); }
  if (I.love) { if (o >= 10) { d += 1.5; mood = rel === 'partner' ? 'love' : 'happy'; parts.push(pickLine(['stop it, you\'ll make me cry', 'same. always', 'ok now I\'m smiling at my phone like an idiot'], q.id + C.n)); } else { d += .3; parts.push(pickLine(['oh! that\'s… nice of you', 'ha, thanks?'], q.id)); } }
  if (I.funny && !parts.length) { const ok = prnd() < .45 + ME().mind.cha / 50; d += ok ? 1 : 0; if (ok) C.jokes++; parts.push(ok ? pickLine(['HA', 'you\'re ridiculous', 'stop, I\'m in a meeting', 'I\'m screenshotting this'], q.id + C.n) : pickLine(['lol', 'heh'], q.id + C.n)); }
  const who = nameIn(text, q.id);
  if (who !== null) { const tt = tie(q, P(who)), n = P(who).name.split(' ')[0]; parts.push(tt > 30 ? pickLine([`${n}! love ${n}`, `${n} is the best. say hi from me`, `you know ${n}? small world`], q.id + who) : tt < -15 ? pickLine([`ugh. ${n}. don't get me started`, `we don't talk about ${n}`, `${n}? I have Opinions`], q.id + who) : pickLine([`${n}? only met them once`, `don't really know ${n}`, `${n}, the one who's always on their phone?`], q.id + who)); }
  if (I.question && !I.invite && !/^adv/.test(top) && parts.length < 2) parts.push(I.work ? pickLine(['work\'s fine. mad, but fine. you?', 'don\'t ask. or do. over a drink', 'honestly? the best job I\'ve had in years'], q.id + C.n) : I.money ? pickLine(['skint, like everyone', 'I\'m ok. are you ok? do you need anything?', 'don\'t talk to me about money this month'], q.id + C.n) : pickLine(['honestly? I don\'t know. ask me after coffee', 'yes. obviously yes', 'hmm. let me think about it', 'great question. terrible timing'], q.id + C.n));
  if (I.invite) { const R = tryInvite(q, rel === 'partner' ? 'date' : /drink|bar|pub|wine|beer/.test(text.toLowerCase()) ? 'drinks' : 'coffee', C); d += R.d; parts.push(R.t); }
  if (!parts.length) { const w = keyWord(text); parts.push(w && prnd() < .7 ? pickLine([`"${w}". yes. exactly that`, `wait, ${w}? tell me more`, `ha, ${w}. I'm stealing that`, `${w}… you always find the right word`], q.id + C.n) : I.yes ? pickLine(['good. it\'s settled then', 'knew you\'d say that'], q.id + C.n) : I.no ? pickLine(['fair enough', 'your loss 😄'], q.id + C.n) : pickLine(['fair', 'true', 'this is why I text you', 'noted, wise one'], q.id + C.n)); if (w) { C.word = w; C.wordW = S.week; } }
  return { t: parts.join('. ').replace(/\.\./g, '.'), d, mood };
}
function scheduleAdvice(id, i, pick) {
  const M = S.me, good = prnd() < clamp(.45 + (ME().mind.tas - 10) / 40 + (ME().mind.com - 10) / 60, .2, .8);
  (M.advice = M.advice || []).push({ id, i, pick, good, due: S.week + 2 + Math.floor(prnd() * 5) });
}
function replyText(a) {
  const M = S.me, m = (M.phone || []).find(x => x.id === a.mid);
  if (!m || m.replied || m.from === null || m.from === undefined || m.from < 0 || !M.known[m.from] || P(m.from).dead) return false;
  const q = P(m.from), me = ME(), rel = relOf(q.id), o = opinion(q.id), C = convoOf(q.id), top = msgTopic(m), r = q.id + M.phoneN;
  m.replied = 1; C.n++;
  let mine, back, d = 0, mood = 'happy';
  if (a.kind === 'own') {
    mine = String(a.text || '').replace(/\s+/g, ' ').trim().slice(0, 280);
    if (!mine) return false;
    const R = answerOwn(q, mine, m, C); back = R.t; d = R.d; mood = R.mood; C.brief = 0;
  } else {
    const k = a.kind; if (!replyOptions(m).includes(k)) return false;
    C.brief = k === 'brief' ? C.brief + 1 : 0;
    const P2 = (L, L2) => pickLine(o >= 25 ? L : L2 || L, r);
    if (/^a[01]$/.test(k)) { const A = ADVICE[+top.slice(3)], pick = +k[1]; mine = pickLine([`honestly? ${A.a[pick].toLowerCase()}`, `${A.a[pick].toLowerCase()}. trust me`, `if it were me: ${A.a[pick].toLowerCase()}`], r); scheduleAdvice(q.id, +top.slice(3), pick); d = 1.5; back = pickLine(['ok. you\'re right', 'that\'s what I needed to hear', 'hm. yeah. ok. thank you'], r); }
    else if (/^st_/.test(k)) { const R = stakeReply(q, m, k); mine = R.mine; back = R.back; d = R.d; if (R.d < 0) mood = 'none'; }
    else if (/^ask(yes|no|later)$/.test(k)) { const R = askReply(q, m, k); mine = R.mine; back = R.back; d = R.d; if (k === 'askno') mood = 'none'; }
    else if (k === 'notsure') { mine = pickLine(['honestly I don\'t know. what does your gut say?', 'that\'s a hard one. sleep on it?'], r); d = .5; back = pickLine(['my gut says pizza', 'yeah. ok. sleeping on it'], r); }
    else if (k === 'laugh') { mine = pickLine(['😂😂😂', 'I am WHEEZING', 'this is the best thing I\'ve seen all week'], r); d = 1; back = pickLine(['knew you\'d get it', 'there\'s more where that came from', 'I have a whole folder'], r); }
    else if (k === 'meme') { mine = pickLine(['[a photo of your lunch, which is worse]', '[a video of a boom mic falling on someone]', '[a screenshot of your own terrible review]'], r); d = 1.5; C.jokes++; back = pickLine(['NO 😂', 'you win. you always win', 'ok that one\'s going in the group chat'], r); }
    else if (k === 'sympathy') { mine = pickLine(['oh no. I\'m so sorry. I\'m here, ok?', 'that\'s awful. what do you need?', 'sending you the biggest hug'], r); d = top === 'bad' ? 2.5 : 1.5; mood = 'sad'; back = P2(['thank you. really. you\'re one of the good ones', 'I needed that today', 'can I call you later?'], ['thanks', 'appreciate it']); }
    else if (k === 'advise') { mine = pickLine(['sleep, water, then decide. in that order', 'write it down, then do the opposite of what scares you least', 'call the person you\'re avoiding'], r); const ok = prnd() < .4 + me.mind.tas / 40; d = ok ? 1.5 : -.5; back = ok ? pickLine(['…that\'s actually good advice', 'ok. yes. doing that', 'when did you get wise'], r) : pickLine(['I didn\'t ask for advice', 'mm', 'easy for you to say'], r); }
    else if (k === 'congrats') { mine = pickLine(['!!!!! SO happy for you', 'you deserve this, all of it', 'told you. TOLD YOU'], r); d = 2; back = P2(['stop, I\'m crying', 'thank you!! couldn\'t have done it without you yelling at me', 'drinks soon, my treat'], ['thanks!', 'thank you!']); }
    else if (k === 'drinks') { const R = tryInvite(q, 'drinks', C); mine = pickLine(['this calls for drinks. my treat', 'we\'re celebrating. pick a night'], r); d = 1 + R.d; back = R.t; }
    else if (k === 'invite') { const R = tryInvite(q, rel === 'partner' ? 'date' : 'coffee', C); mine = pickLine(['let\'s get a coffee and talk properly', 'come out, I\'ll buy', 'when are you free? I want to see you'], r); d = R.d; back = R.t; }
    else if (k === 'jealous') { mine = pickLine(['must be nice 🙄', 'some of us are still waiting by the phone', 'ok but when is it my turn'], r); d = has(q, 'Cynical') ? .5 : -1.5; mood = 'none'; back = has(q, 'Cynical') ? pickLine(['ha. honest at least', 'your turn\'s coming. probably'], r) : pickLine(['…ok', 'I thought you\'d be happy for me', 'wow'], r); }
    else if (k === 'spill') { mine = pickLine(['WAIT. tell me everything', 'go on…', 'I need the full story. now'], r); d = 1; const g = S.people.length ? circleOf(q, 8).map(P).find(x => x && !x.dead) : null; back = g ? pickLine([`can't say more by text. but ask ${g.name.split(' ')[0]} about the yacht`, `ok but you didn't hear it from me. ${g.name.split(' ')[0]} knows the rest`, 'over a drink. not in writing'], r) : 'over a drink. not in writing'; if (g && !M.known[g.id] && prnd() < .3) meet(g.id, `Gossip via ${q.name}`, 2); }
    else if (k === 'nogossip') { mine = pickLine(['eh, not my business', 'I\'d rather not, honestly', 'poor them'], r); d = has(q, 'Gossip') ? -1 : .5; back = has(q, 'Gossip') ? pickLine(['boring', 'fine, saint'], r) : pickLine(['yeah, you\'re right', 'fair. I feel bad now'], r); trust(q.id, 2); }
    else if (k === 'thanks') { mine = pickLine(['you\'re a star, thank you', 'owe you one', 'that\'s really useful, thanks'], r); d = 1.5; back = pickLine(['anytime', 'you\'d do the same', 'now go get it'], r); trust(q.id, 2); }
    else if (k === 'askmore') { mine = pickLine(['who should I talk to?', 'any idea who\'s hiring?', 'how do I get in?'], r); d = 1; const g = circleOf(q, 10).map(P).find(x => x && !x.dead && !M.known[x.id]); if (g) { meet(g.id, `Introduced by ${q.name}`, 4); back = pickLine([`talk to ${g.name}. I'll send them your number`, `${g.name}. tell them I sent you`], r); } else back = pickLine(['that\'s all I\'ve got, sorry', 'keep your ear to the ground'], r); }
    else if (k === 'workgood') { mine = pickLine(['honestly? great. long days but great', 'best crew I\'ve had', 'going really well, touch wood'], r); d = 1; back = pickLine(['love that for you', 'told you you\'d be good at it', 'so proud of you'], r); }
    else if (k === 'workbad') { mine = pickLine(['it\'s a nightmare. send help', 'I\'m surviving. barely', 'don\'t ask. please ask. it\'s bad'], r); d = 1.5; mood = 'sad'; back = P2(['oh no. drinks after wrap? on me', 'every job has one week like this. hang in there'], ['that sucks', 'it\'ll pass']); }
    else if (k === 'worksecret') { mine = pickLine(['can\'t talk about it 🤐', 'NDA. I\'ve said too much already', 'all I can say is: big'], r); d = .5; back = pickLine(['ooh mysterious', 'fine. I\'ll find out from the trades', 'you\'re no fun'], r); }
    else {
      const R = REPLIES[k]; if (!R) return false;
      mine = pickLine(R.mine, r);
      if (k === 'warm') { d = o > 0 ? 2 : .5; back = pickLine(['❤️', 'you too. seriously', 'ok let\'s actually do it this time'], r); }
      else if (k === 'funny') { const ok = prnd() < .35 + me.mind.cha / 40 + (has(me, 'Witty') ? .2 : 0) + Math.min(.15, C.jokes * .03); d = ok ? 2 : -.5; if (ok) C.jokes++; back = ok ? pickLine(C.jokes > 3 ? ['you\'re on a roll today', 'stop, my ribs', 'every time 😂'] : ['HAHAHA', 'I\'m screenshotting this', 'you\'re wasted in this business. or perfect for it'], r) : pickLine(['…ok', 'not your best', 'I\'ll allow it'], r); }
      else if (k === 'flirty') {
        if (rel === 'partner') { d = 2.5; mood = 'love'; back = pickLine(['come home early then', 'stop, I\'m at work', 'you\'re lucky you\'re cute'], r); }
        else if (o >= 30 && canRomance(q.id)) { d = 2; mood = 'love'; back = pickLine(['…is that a hint', 'well well well', 'ask me properly sometime'], r); (M.rel = M.rel || {})[q.id] = Object.assign(M.rel[q.id] || {}, { flirt: (M.rel[q.id] || {}).flirt + 1 || 1 }); }
        else { d = -2; mood = 'none'; back = pickLine(['haha… ok', 'I think that was meant for someone else?', 'let\'s keep it professional'], r); }
      } else { d = rel === 'close' || rel === 'partner' ? -.5 : 0; mood = 'none'; back = C.brief >= 3 ? pickLine(['you ok? you\'ve been short with me lately', 'everything alright? you only ever send thumbs now', 'did I do something?'], r) : pickLine(['k', 'ok then', 'cool cool'], r); if (C.brief >= 3) d -= 1; }
    }
  }
  sms(-1, mine, 'mine', { to: q.id });
  addTie(me, q, d); M.known[q.id].seen = S.week;
  sms(q.id, back, 'text', { mood, topic: 'chat' });
  return true;
}
// Weekly: advice comes home, and now and then a word of yours comes back to you.
function convoWeek() {
  const M = S.me, me = ME();
  for (const x of (M.advice || []).filter(x => !x.done && x.due <= S.week)) {
    x.done = 1; const q = P(x.id); if (!q || q.dead || !M.known[x.id]) continue;
    const A = ADVICE[x.i], line = A.ok[x.pick][x.good ? 0 : 1];
    sms(x.id, line + (x.good ? pickLine([' you were right', ' thank you for that', ''], x.id + S.week) : pickLine([' should not have listened to you', ' not blaming you. mostly', ''], x.id + S.week)), 'text', { replyable: 1, topic: x.good ? 'good' : 'bad' });
    addTie(me, q, x.good ? 4 : -2); if (x.good) trust(x.id, 4);
  }
  M.advice = (M.advice || []).filter(x => !x.done || S.week - x.due < 8);
  if (S.week % 5 === 2) for (const id in M.convo || {}) { const C = M.convo[id]; if (C.word && S.week - C.wordW >= 4 && S.week - C.wordW <= 12 && M.known[id] && !P(+id).dead && opinion(+id) > 15) { sms(+id, pickLine([`still thinking about what you said. "${C.word}". it stuck with me`, `I used your word, "${C.word}", in a meeting today. it went down well`, `"${C.word}". you were right, you know`], +id + S.week), 'text', { replyable: 1, topic: 'chat' }); addTie(me, P(+id), 1); C.word = null; break; } }
  // someone asks about the job you're on
  const j = M.jobs[0];
  if (j && j.film !== null && j.film !== undefined && S.week % 6 === 1) { const ids = Object.keys(M.known).map(Number).filter(id => opinion(id) > 25 && !P(id).dead); if (ids.length) { const id = ids[S.week % ids.length]; sms(id, pickLine([`how's ${S.films[j.film].title} going??`, `so?? how is it on ${S.films[j.film].title}`, `tell me everything about ${S.films[j.film].title}. or nothing, I know about NDAs`], id + S.week), 'text', { replyable: 1, topic: 'work' }); } }
}
