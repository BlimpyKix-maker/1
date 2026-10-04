// ---------------- Conversation that listens ----------------
// What you type is read for its tone (thrilled, low, anxious, cross, joking, tired) and for what it's about: a plan
// ("I'm thinking of learning the cello"), something that happened ("I adopted a dog"), something of yours ("my
// landlord is impossible"), a feeling, or a question (what they think of a film, a person, an idea; what they're up
// to; whether you should do something). The reply takes up your words, turned round ("your cello", "you adopted a
// dog"), in the voice of who they are: cynics are dry, the kind are kind, gossips steer it somewhere juicy. They
// remember: weeks later they ask how the cello is going, and if you bring it up again they know. Lines are tracked
// per person so the same one doesn't come back to you.
// Gossip became scoops: rarer, only about people you know, told in the sender's own opinion, and sometimes worth
// something: a film crewing up (a real posting, with your name already in), a production in trouble, a cut that's
// better than anyone expects.

// a line nobody has sent you lately: each list is walked from a seeded start, skipping what this person already used
function fresh(L, key, seed) {
  const M = S.me, U = M.used = M.used || {}, u = U[key] = U[key] || [], n = L.length;
  let start = Math.abs(Math.floor(seed * 7 + S.week * 3)) % n;
  for (let i = 0; i < n; i++) { const j = (start + i) % n; if (!u.includes(j)) { u.push(j); if (u.length > Math.max(1, Math.floor(n * .7))) u.shift(); return L[j]; } }
  return L[start];
}
const SWAP = { i: 'you', "i'm": "you're", im: "you're", "i've": "you've", "i'll": "you'll", "i'd": "you'd", me: 'you', my: 'your', mine: 'yours', myself: 'yourself', am: 'are', was: 'were', "we're": "we're", our: 'our' };
function turn(s) { return s.replace(/[A-Za-z']+/g, w => { const l = w.toLowerCase(); return SWAP[l] !== undefined ? SWAP[l] : w; }).replace(/\byou were\b/g, 'you were'); }
const clean = s => s.replace(/\s+/g, ' ').replace(/^[\s,;:-]+|[\s,;:.!?-]+$/g, '').trim();
const LEADV = /^(learning|learn|playing|play|doing|do|making|make|writing|write|building|build|opening|open|starting|start|running|run|taking|take|trying|try|getting|get|buying|buy|moving|move|joining|join|becoming|become|going|go|travelling|traveling|travel|selling|sell|launching|launch|leaving|leave|adopting|adopt|studying|study|teaching|teach|training|train|visiting|visit|seeing|see|watching|watch|reading|read|cooking|cook|baking|bake|growing|grow|quitting|quit|finishing|finish)\s+/;
const TAILS = /\s+(when|because|since|so that|so|if|after|before|until|but|and then|this year|next year|soon|eventually|one day|someday|again|yesterday|today|tonight|last night|this morning|this week|last week|lately|finally|btw|honestly|lol|haha)\b.*$/;
function objOf(s) { let o = clean(s).replace(TAILS, ''); for (let i = 0; i < 2 && LEADV.test(o); i++) o = o.replace(LEADV, ''); o = o.replace(/^(to|how to)\s+/, '').replace(LEADV, '').replace(/^(into|onto|towards|toward|in|on|at|for|with|up|out)\s+/, ''); return clean(o).split(' ').slice(0, 6).join(' '); }
// put back the capitals the player used (Paris, Japanese, a film title)
function recase(raw, low) { if (!low) return low; const i = raw.toLowerCase().indexOf(low); return i >= 0 ? raw.slice(i, i + low.length) : low; }
const FEEL = {
  low: /\b(sad|down|low|lonely|miserable|depressed|gutted|heartbroken|crying|cried|awful day|rough day|bad day|hate my)\b/, anx: /\b(nervous|anxious|worried|scared|terrified|panicking|freaking out|dreading|stressed|overwhelmed)\b/,
  tired: /\b(tired|exhausted|knackered|shattered|burnt out|burned out|no sleep|sleepy|drained)\b/, cross: /\b(furious|angry|livid|fuming|so annoyed|pissed|raging|sick of|fed up)\b/,
  up: /\b(excited|thrilled|buzzing|so happy|can't wait|cannot wait|over the moon|ecstatic|stoked|pumped|yay|woo+)\b|!!|\bomg\b/, proud: /\b(proud|nailed it|did it|i got it|finally did)\b/,
  bored: /\b(bored|boring|nothing to do|so dull)\b/, joke: /\b(haha+|lol|lmao|jk|kidding)\b|😂|🤣/, flirt: /😉|😘|\b(cute|handsome|gorgeous|date me|miss your face)\b/
};
const GOODV = /^(got|bought|adopted|found|made|wrote|finished|won|booked|built|fixed|sold|passed|landed|started|joined|baked|learned|learnt|painted|planted|ran|married|met)$/, BADV = /^(lost|broke|quit|failed|crashed|missed|burnt|burned|dropped|ruined|forgot)$/;
const POSW = /\b(great|amazing|brilliant|lovely|wonderful|best|perfect|fun|hilarious|gorgeous|good|happy|better|ace)\b/, NEGW = /\b(terrible|awful|impossible|worst|broken|annoying|ill|sick|dying|dead|weird|mean|rude|horrible|bad|leaking|late)\b/;
// what a message is about
function parseMsg(text) {
  const raw = String(text || ''), L = raw.toLowerCase().replace(/[“”]/g, '"').replace(/’/g, "'"), out = { tone: [], topic: null, q: null, raw };
  for (const k in FEEL) if (FEEL[k].test(L)) out.tone.push(k);
  if (/[A-Z]{4,}/.test(raw) && !out.tone.includes('up') && /!/.test(raw)) out.tone.push('up');
  const sents = L.split(/(?<=[.!?])\s+|\n+/).map(x => x.trim()).filter(Boolean);
  for (const s of sents) {
    let m, asked = false;
    if (!out.q) { asked = true;
      if ((m = s.match(/what do you (?:think|reckon) (?:of|about) ([^?.!]+)/)) || (m = s.match(/(?:thoughts|opinion) on ([^?.!]+)/))) out.q = { k: 'opinion', x: clean(m[1]) };
      else if ((m = s.match(/(?:have|did) you (?:ever )?(seen|heard|tried|read|watched|been to|met) ([^?.!]+)/))) out.q = { k: 'tried', v: m[1], x: clean(m[2]) };
      else if ((m = s.match(/do you (like|love|hate|know|remember|miss|want) ([^?.!]+)/))) out.q = { k: 'doyou', v: m[1], x: clean(m[2]) };
      else if ((m = s.match(/should i ([^?.!]+)/))) out.q = { k: 'should', x: clean(m[1]) };
      else if (/how are (you|things)|how's (it going|life|everything)|what are you (up to|doing|working on)|what's new|wyd|how have you been/.test(s)) out.q = { k: 'status' };
      else if ((m = s.match(/(?:what's|what is|whats) your fav(?:ou?rite)? ([a-z ]+)/))) out.q = { k: 'fav', x: clean(m[1]) };
      else if (/\?\s*$/.test(s) || /^(what|how|why|when|where|who|are|do|did|can|could|will|would|is)\b/.test(s)) out.q = { k: 'any', x: clean(s) };
      else asked = false;
    }
    if (asked && out.q) continue;   // a question isn't news
    if (out.topic) continue;
    if ((m = s.match(/\b(?:i'?m|i am|we're|we are) (?:going to|gonna|thinking (?:of|about)|planning (?:to|on)|about to|trying to|hoping to|finally|off to|starting to|learning(?: to| how to)?|taking up|getting into|getting|doing|making|writing|building|training for) ([^.!?,;]+)/))) out.topic = { k: 'plan', ph: clean(m[0].replace(/^(i'?m|i am|we're|we are) /, '')), obj: objOf(m[1]) };
    else if ((m = s.match(/\bi (?:want|wanna|would love|'d love|need) to ([^.!?,;]+)/))) out.topic = { k: 'plan', ph: 'wanting to ' + clean(m[1]), obj: objOf(m[1]) || clean(m[1]) };
    else if ((m = s.match(/\b(?:i|we) (?:just |finally |accidentally |actually )?([a-z]+ed|got|bought|found|made|wrote|won|built|sold|ran|met|lost|broke|quit|forgot|learnt|burnt|took|saw|went to|tried) ([^.!?,;]+)/)) && (GOODV.test(m[1]) || BADV.test(m[1]) || /ed$/.test(m[1]))) out.topic = { k: 'did', v: m[1], obj: objOf(m[2]), good: !BADV.test(m[1]) };
    else if ((m = s.match(/\bmy ([a-z' -]{2,28}?) (is|was|has|keeps|just|won't|can't|got|did|does|loves|hates|wants|thinks|said|says) ?([^.!?,;]*)/))) out.topic = { k: 'mine', obj: clean(m[1]), rest: clean(m[2] + ' ' + m[3]), neg: NEGW.test(m[3] || '') || /won't|can't|hates/.test(m[2]), pos: POSW.test(m[3] || '') };
    else if ((m = s.match(/\b(?:i'?m|i am|i feel|feeling) (?:so |really |a bit |kind of |pretty |very )?([a-z]+)/)) && /^(happy|sad|tired|exhausted|nervous|anxious|excited|bored|lonely|stressed|angry|lost|stuck|great|good|fine|awful|terrible|sick|broke|proud|scared|overwhelmed|ok|okay|homesick|restless|inspired)$/.test(m[1])) out.topic = { k: 'feel', v: m[1] };
  }
  if (!out.topic && !out.q && !out.tone.length) { const w = keyPhrase(L); if (w) out.topic = { k: 'thing', obj: w }; }
  out.invite = /\b(coffee|a drink|drinks|dinner|lunch|brunch|meet up|hang out|catch up|grab a|come over|go for a walk|a walk|see a film|the cinema)\b/.test(L) && (/\?|let's|lets |want to|fancy|free|you around|shall we/.test(L));
  if (out.topic && out.topic.obj) out.topic.obj = recase(raw, out.topic.obj);
  if (out.q && out.q.x) out.q.x = recase(raw, out.q.x);
  return out;
}
// the most telling words in a message: a two-word phrase if there is one, else the longest word
function keyPhrase(L) {
  const words = L.replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(x => x && !/^(haha+|lol|lmao|that's|thats|it's|its|honestly|really|literally|actually|just|today|yesterday)$/.test(x));
  for (let i = 0; i < words.length - 1; i++) { const a = words[i], b = words[i + 1]; if (a.length >= 4 && b.length >= 4 && !STOP.has(a) && !STOP.has(b) && !SWAP[a] && !SWAP[b]) return a + ' ' + b; }
  const w = words.filter(x => x.length >= 5 && !STOP.has(x) && !SWAP[x]).sort((a, b) => b.length - a.length)[0];
  return w || null;
}
const has_ = (q, t) => (q.traits || []).includes(t);
function voiceOf_(q) { return has_(q, 'Cynical') || has_(q, 'Ruthless') ? 'dry' : has_(q, 'Kind') || has_(q, 'Beloved') || has_(q, 'Loyal') || has_(q, 'Optimist') ? 'warm' : has_(q, 'Witty') || has_(q, 'Party animal') || has_(q, 'Showboat') ? 'funny' : has_(q, 'Gossip') ? 'gossip' : has_(q, 'Shy') || has_(q, 'Discreet') ? 'quiet' : 'plain'; }
const R_ = {
  plan: { warm: ['{obj}? I love that for you', 'you should absolutely do it. {obj} is very you', 'ok this is the best news. {obj}!', 'do it. I mean it. {obj} suits you'], dry: ['{obj}. bold. what\'s plan B', 'sure. and when {obj} goes wrong, I\'ll be here', '{obj}? fine. just don\'t sell your camera', 'every year you have a new thing. this year it\'s {obj}'], funny: ['{obj}?? I need a front-row seat for this', 'ok but if {obj} becomes your whole personality I\'m out', 'picturing you and {obj} and I\'m crying laughing', '{obj}. I give it a month. prove me wrong'], gossip: ['{obj}? who put you up to that', 'wait, {obj}? does anyone else know?', 'ooh {obj}. I know someone who did that. long story'], quiet: ['{obj}. that sounds good', 'oh nice. {obj}', 'that\'s a lovely idea'], plain: ['{obj}? since when', 'oh nice, {obj}. how did that come about', 'ok I need to hear more about {obj}', 'you and {obj}. I can see it'] },
  didgood: { warm: ['you {v} {obj}?? that\'s brilliant', 'wait, you {v} {obj}! so happy for you', '{obj}! you deserve nice things'], dry: ['you {v} {obj}. well. look at you', 'congrats on {obj}, I suppose. what did it cost', '{obj}. huh. didn\'t see that coming'], funny: ['you {v} {obj}?? pics or it didn\'t happen', '{obj}. this is the plot of a film I\'d watch', 'excuse me, you {v} {obj} and I hear about it by TEXT?'], gossip: ['you {v} {obj}? who else knows', '{obj}! tell me everything, leave nothing out'], quiet: ['oh wow, {obj}', 'that\'s really nice. {obj}'], plain: ['you {v} {obj}? amazing', '{obj}! how is it', 'no way. {obj}. tell me everything'] },
  didbad: { warm: ['oh no, you {v} {obj}? I\'m sorry. you ok?', 'that\'s rotten. {obj} of all things', 'ugh, {obj}. want me to come over?'], dry: ['you {v} {obj}. classic you', '{obj}. well. these things happen to people like us', 'could be worse. could be {obj} AND your keys'], funny: ['you {v} {obj}?? how', 'RIP {obj}. gone too soon', 'only you. only you could lose {obj}'], gossip: ['you {v} {obj}? how did that even happen', 'wait, {obj}? what happened'], quiet: ['oh no. {obj}. sorry', 'that\'s a shame'], plain: ['ah no, {obj}? sorry', 'that sucks. {obj} too', 'oh no. what happened with {obj}'] },
  minebad: { warm: ['your {obj} {rest}? that\'s not on. you ok?', 'ugh, your {obj}. you deserve better', 'oh no. your {obj} again?'], dry: ['your {obj} {rest}. shocking. truly', 'everyone\'s {obj} is like that. it\'s the law', 'your {obj}. say no more'], funny: ['your {obj} {rest}?? fight it', 'I would watch a whole series about your {obj}', 'your {obj} needs to be stopped'], gossip: ['wait, your {obj} {rest}? since when', 'tell me more about this {obj}'], quiet: ['your {obj}? that sounds hard', 'oh no'], plain: ['your {obj} {rest}? that\'s rough', 'ugh. your {obj}', 'what are you going to do about your {obj}?'] },
  minegood: { warm: ['your {obj} {rest}! love that', 'that\'s so nice about your {obj}'], dry: ['your {obj} {rest}. good for your {obj}', 'nice. don\'t jinx it'], funny: ['your {obj} {rest}? put it in a film', 'your {obj} is thriving and I\'m not'], gossip: ['your {obj}? go on', 'ooh, tell me about your {obj}'], quiet: ['that\'s nice', 'aw, your {obj}'], plain: ['your {obj} {rest}? nice', 'that\'s good about your {obj}'] },
  mine: { warm: ['aw, your {obj} {rest}', 'your {obj} sounds lovely', 'tell your {obj} I said hello'], dry: ['your {obj}. of course', 'and your {obj} {rest}. naturally'], funny: ['your {obj} {rest}. iconic', 'I need updates on your {obj}, daily'], gossip: ['ooh, your {obj}. go on', 'wait, your {obj} {rest}?'], quiet: ['your {obj}. ok', 'hm, your {obj}'], plain: ['your {obj} {rest}? ha', 'your {obj} sounds like a character', 'what\'s the story with your {obj}'] },
  thing: { warm: ['"{obj}", I like that', 'tell me more about {obj}', '{obj}. you always make things sound good'], dry: ['"{obj}". right', '{obj}. if you say so'], funny: ['"{obj}" is my new band name', '{obj}. I\'m stealing that'], gossip: ['{obj}? who told you about that', 'wait, {obj}? go on'], quiet: ['{obj}. interesting', 'hm, {obj}'], plain: ['{obj}? go on', 'wait, {obj}? tell me more', 'ha, {obj}. yes'] }
};
const FEEL_R = {
  low: { warm: ['oh love. I\'m here, ok?', 'come here. what happened', 'that sounds like a lot. want to talk or want distracting?'], dry: ['this business does that to everyone. doesn\'t make it fun', 'that\'s grim. pub?'], funny: ['sending you one (1) emergency cat video and a hug', 'ok. sad mode. I\'m bringing snacks'], plain: ['sorry you\'re feeling like that', 'that sucks. anything I can do?', 'hey. it\'ll pass. I promise'] },
  anx: { warm: ['breathe. you\'re more ready than you think', 'it\'s going to be ok. and if it isn\'t, I\'ll be here'], dry: ['nerves mean you care. annoying, but true', 'everyone\'s winging it. everyone'], funny: ['panic is just excitement with worse PR', 'deep breaths. or shallow ones, whatever works'], plain: ['you\'ll be fine. honestly', 'what\'s worrying you most?'] },
  tired: { warm: ['go to bed. I\'m serious. the world will wait', 'rest. eat something green. text me tomorrow'], dry: ['sleep is for people with jobs that end', 'same. forever'], funny: ['you sound like you need eleven hours and a sandwich', 'medically speaking: nap'], plain: ['get some sleep', 'you need a day off'] },
  cross: { warm: ['who do I need to have words with', 'that\'s not ok. you\'re right to be cross'], dry: ['let it out. then let it go. then maybe a little revenge', 'yep. that\'d do it'], funny: ['I\'ve got your back and a strongly worded email', 'shall I key their car. metaphorically'], plain: ['ugh. that\'s annoying', 'fair enough to be cross about that'] },
  up: { warm: ['!!! this energy. love it', 'I can hear you smiling from here'], dry: ['look at you, all lit up', 'careful, happiness is contagious'], funny: ['why are we yelling. I LOVE IT', 'ok calm down. no don\'t. this is great'], plain: ['love this', 'that\'s great news'] },
  bored: { warm: ['come out then. I\'ll find something'], dry: ['bored is good. bored is where ideas come from'], funny: ['bored? write a script about a bored person. meta'], plain: ['come and do something then'] }
};
function fill(t, o) { return t.replace(/\{(\w+)\}/g, (_, k) => o[k] !== undefined ? o[k] : ''); }
// what they're up to, from their actual life
function myStatus(q) {
  const f = typeof theirActive === 'function' ? theirActive(q.id) : null, last = (q.life || []).slice(-1)[0];
  if (f) return fresh([`on ${f.title} until ${fmtDate(f.stageEnd, true).replace(/^\d+ /, '')}. long days, good people`, `${f.title} is eating my life. in a good way. mostly`, `shooting ${f.title}. ask me again when it wraps`], 'st' + q.id, q.id);
  if (last && S.week - last.w < 12) return `honestly? ${last.t.charAt(0).toLowerCase() + last.t.slice(1)}. it's been a lot`;
  return fresh(['between jobs. reading a lot. pretending it\'s on purpose', 'fine! busy-ish. you know how it is', 'a bit of this, a bit of that. waiting on a call', 'quiet. too quiet. send work'], 'st' + q.id, q.id);
}
// an opinion on anything: a film or a person they know of, or just a stance, the same one each time you ask
function opinionOn(q, x) {
  const L = x.toLowerCase(), f = S.films.find(ff => ff.rel !== null && ff.title && ff.title.toLowerCase() === L.replace(/^the film |^the movie /, ''));
  if (f) { const g = f.reviews >= 70, dry = voiceOf_(q) === 'dry'; return g ? (dry ? `${f.title}? annoyingly, it's good` : `${f.title}! loved it. that ending`) : (dry ? `${f.title}. I want those two hours back` : `${f.title}? not for me, honestly`); }
  const who = typeof nameIn === 'function' ? nameIn(x, q.id) : null;
  if (who !== null) { const t = tie(q, P(who)), n = P(who).name.split(' ')[0]; return t > 25 ? `${n}? one of the good ones` : t < -15 ? `${n}. don't get me started` : `${n}? don't know them well enough to say`; }
  const r = hashRand(q.id * 131 + [...L].reduce((a, c) => a + c.charCodeAt(0), 0))(), v = voiceOf_(q);
  return r < .4 ? fresh([`${x}? I'm a fan, honestly`, `${x}. love it. fight me`, `${x}? yes. obviously yes`], 'op' + q.id, r * 100) : r < .7 ? fresh([`${x}? I could take it or leave it`, `${x}… mixed feelings`, `${x}. depends on the day`], 'op' + q.id, r * 100) : fresh([v === 'dry' ? `${x}? overrated. there, I said it` : `${x}? not my thing, sorry`, `${x}. hard pass`, `${x}? I don't get the fuss`], 'op' + q.id, r * 100);
}
function adviceOn(q, x) {
  const v = voiceOf_(q), r = hashRand(q.id * 17 + x.length)();
  return v === 'dry' ? fresh([`should you ${x}? only if you'd regret not doing it`, `${x}? do it, but get it in writing`, `depends. who's paying`], 'adv' + q.id, r * 50)
    : v === 'warm' ? fresh([`if part of you wants to ${x}, listen to that part`, `yes. and if it goes wrong, call me`, `you already know the answer. you just want permission. granted`], 'adv' + q.id, r * 50)
    : fresh([`${x}? if it scares you a little, yes`, `sleep on it. if you still want to ${x} tomorrow, do it`, `I'd say yes. but I also once bought a canoe`], 'adv' + q.id, r * 50);
}
// The reply to something you typed.
function answerOwn(q, text, m, C) {
  const I = readIntent(text), top = msgTopic(m);
  if (I.rude || (I.sorry && !/\bsorry to hear\b/i.test(text)) || /^adv\d+$/.test(top)) return answerOwnBasic(q, text, m, C);
  const X = parseMsg(text), v = voiceOf_(q), parts = [], o = opinion(q.id);
  let d = 1 + (text.length > 80 ? .5 : 0), mood = 'happy', key = 'r' + q.id;
  const mem = C.mem = C.mem || [];
  // a strong feeling comes first
  const feel = ['low', 'anx', 'cross', 'tired', 'up', 'bored'].find(k => X.tone.includes(k)) || (X.topic && X.topic.k === 'feel' ? ({ sad: 'low', lonely: 'low', homesick: 'low', lost: 'low', stuck: 'low', awful: 'low', terrible: 'low', nervous: 'anx', anxious: 'anx', scared: 'anx', overwhelmed: 'anx', stressed: 'anx', tired: 'tired', exhausted: 'tired', angry: 'cross', excited: 'up', happy: 'up', great: 'up', proud: 'up', inspired: 'up', bored: 'bored', restless: 'bored' })[X.topic.v] : null);
  if (feel) { const F = FEEL_R[feel]; parts.push(fresh(F[v] || F.plain, key + 'f' + feel, q.id + C.n)); if (feel === 'low' || feel === 'anx') { mood = 'sad'; d += 1; } if (feel === 'up') d += .5; }
  else if (X.tone.includes('joke')) { const ok = prnd() < .45 + ME().mind.cha / 50; d += ok ? 1 : 0; if (ok) C.jokes++; parts.push(ok ? fresh(['HA', 'you\'re ridiculous', 'stop, I\'m in a meeting', 'I\'m screenshotting this', 'this is why we\'re friends'], key + 'j', q.id + C.n) : 'heh'); }
  // something you told them about before, mentioned again
  const low = text.toLowerCase(), back = mem.slice().reverse().find(x => x.obj && x.obj.length > 3 && low.includes(x.obj.toLowerCase().replace(/^(the|a|an|your) /, '')));
  if (back && !(X.topic && X.topic.k !== 'thing' && X.topic.obj && X.topic.obj.toLowerCase() !== back.obj.toLowerCase())) {
    const neg = NEGW.test(low) || /terribl|badly|not going|hate it|give up|gave up|quit/.test(low), pos = POSW.test(low) || /going well|love it|getting better|nailed/.test(low);
    parts.push(fill(fresh(neg ? ['oh no, {obj} not going well? stick with it. the first months are the worst', '{obj} giving you grief? everyone hates it before they love it', 'don\'t you dare give up on {obj}'] : pos ? ['yes! {obj}! told you', 'look at you with {obj}. proud of you', '{obj} is going well? I knew it'] : ['still {obj}? I love the commitment', 'the {obj} saga continues', 'you and {obj}. update me properly over a drink'], key + 'back' + (neg ? 'n' : pos ? 'p' : ''), q.id + C.n), { obj: back.obj.replace(/^(a|an|some) /i, 'the ') }));
    back.w = S.week; back.asked = 0; d += 1;
    X.topic = null;
  }
  // then what it's about, in your words turned round
  const T = X.topic;
  if (T && T.k !== 'feel') {
    const obj = turn(T.obj || '').slice(0, 60), again = obj && mem.find(x => x.obj === obj);
    if (again && S.week - again.w > 0) parts.push(fresh([`still {obj}? I love the commitment`, `the {obj} saga continues`, `you and {obj}. update me properly over a drink`].map(t => fill(t, { obj })), key + 'again', q.id + C.n));
    else if (obj) {
      const set = T.k === 'plan' ? R_.plan : T.k === 'did' ? (T.good ? R_.didgood : R_.didbad) : T.k === 'mine' ? (T.neg ? R_.minebad : T.pos ? R_.minegood : R_.mine) : R_.thing;
      parts.push(fill(fresh(set[v] || set.plain, key + T.k, q.id + C.n + obj.length), { obj, v: T.v || '', rest: turn(T.rest || '') }));
      if (T.k === 'did' && !T.good) { mood = 'sad'; d += .5; }
      if (T.k !== 'thing') { mem.push({ k: T.k, obj, v: T.v || '', w: S.week, asked: 0 }); if (mem.length > 8) mem.shift(); d += .5; }
    }
  }
  // a question gets an answer
  const Q = X.q;
  if (Q) {
    if (Q.k === 'status') parts.push(myStatus(q));
    else if (Q.k === 'opinion' || (Q.k === 'doyou' && /like|love|hate/.test(Q.v))) parts.push(opinionOn(q, turn(Q.x)));
    else if (Q.k === 'tried') parts.push(hashRand(q.id + Q.x.length)() < .5 ? fresh([`${turn(Q.x)}? yes! years ago`, `I have, actually. ${opinionOn(q, turn(Q.x))}`], key + 'tr', q.id) : fresh([`${turn(Q.x)}? never. should I?`, `no, but everyone keeps telling me to`], key + 'tr', q.id));
    else if (Q.k === 'doyou' && /know/.test(Q.v)) { const w = nameIn(Q.x, q.id); parts.push(w !== null ? opinionOn(q, P(w).name) : fresh([`${turn(Q.x)}? vaguely`, `remind me?`, `of course I remember ${turn(Q.x)}`], key + 'kn', q.id)); }
    else if (Q.k === 'should') parts.push(adviceOn(q, turn(Q.x)));
    else if (Q.k === 'doyou' && /want|miss/.test(Q.v)) parts.push(o > 20 ? 'yes. obviously' : 'maybe? depends what you\'re offering');
    else if (Q.k === 'fav') { const pool = S.films.filter(f => f.rel !== null && f.reviews >= 75 && (!/film|movie/.test(Q.x) || true)); const f = pool.length ? pool[Math.floor(hashRand(q.id * 29)() * pool.length)] : null; parts.push(/film|movie/.test(Q.x) && f ? fresh([`${f.title}. every time`, `probably ${f.title}. don't judge me`, `${f.title}, and I'll fight anyone who disagrees`], key + 'fav', q.id) : fresh([`my favourite ${Q.x}? too hard. ask me something easier`, `that changes weekly. today? surprise me`, `you first`], key + 'fav', q.id)); }
    else if (Q.k === 'doyou' && /remember/.test(Q.v) && nameIn(Q.x, q.id) === null) parts.push(o > 10 ? fresh([`${turn(Q.x)}? how could I forget`, `ha, ${turn(Q.x)}. never again. (again?)`, `${turn(Q.x)} lives in my head rent free`], key + 'rem', q.id) : 'remind me?');
    else if (!parts.length && !X.invite) parts.push(I.work ? fresh(['work\'s fine. mad, but fine. you?', 'don\'t ask. or do. over a drink', 'honestly? the best job I\'ve had in years'], key + 'qw', q.id + C.n) : fresh(['good question. ask me in person', 'honestly? no idea', 'hm. let me think about that one', 'yes. no. maybe. why?'], key + 'q', q.id + C.n));
  }
  // invitations, and people they know, the way they always have
  if (X.invite) { const R0 = tryInvite(q, relOf(q.id) === 'partner' ? 'date' : /drink|bar|pub|wine|beer/.test(text.toLowerCase()) ? 'drinks' : 'coffee', C); d += R0.d; parts.push(R0.t); }
  else if (!Q || Q.k === 'any') { const who = nameIn(text, q.id); if (who !== null && parts.length < 3) parts.push(opinionOn(q, P(who).name)); }
  if (!parts.length) return answerOwnBasic(q, text, m, C);
  // and sometimes a question back, so it keeps going
  if (parts.length < 3 && !Q && !/\?$/.test(parts[parts.length - 1]) && prnd() < .35) parts.push(T && T.k === 'plan' && /going to|gonna|thinking|planning|want|hoping|about to/.test(T.ph || '') ? 'when do you start?' : T && T.k === 'plan' ? 'how\'s it going so far?' : T && T.k === 'did' && T.good ? 'how does it feel?' : feel === 'low' ? 'want to get out of the house this week?' : fresh(['anyway. how are you, really?', 'what else is new?', 'tell me something good'], key + 'back', q.id + C.n));
  return { t: parts.join('. ').replace(/([?!])\./g, '$1').replace(/\.\./g, '.'), d, mood };
}
// Weeks later, they remember what you told them.
function rememberWeek() {
  const M = S.me; if (!M.convo || S.week % 2) return;
  for (const id in M.convo) {
    const C = M.convo[id], q = P(+id); if (!C.mem || !q || q.dead || !M.known[id] || opinion(+id) < 5) continue;
    const x = C.mem.find(y => !y.asked && S.week - y.w >= 3 && S.week - y.w <= 14); if (!x || prnd() > .3) continue;
    x.asked = 1;
    const t = x.k === 'plan' ? fresh([`so how's {obj} going?`, `did you ever get round to {obj}?`, `random, but I was thinking about {obj}. any progress?`], 'mem' + id, +id) : x.k === 'did' ? fresh([`how's {obj}?`, `update on {obj} please`, `still thinking about you and {obj}`], 'mem' + id, +id) : fresh([`how's your {obj} these days?`, `any news on your {obj}?`, `is your {obj} behaving?`], 'mem' + id, +id);
    sms(+id, fill(t, { obj: x.obj.replace(/^(a|an|some) /i, 'the ') }), 'text', { replyable: 1, topic: 'chat' });   // "a podcast" told, "the podcast" remembered
    return;   // one at a time
  }
}

// ---- scoops ----
function scoopText(g) {
  const s = P(g.from), p = P(g.person), n = p.name.split(' ')[0], t = tie(s, p), ev = g.ev, key = 'sc' + g.from;
  const frame = fresh([`did you hear? ${n} ${ev}`, `ok so apparently ${n} ${ev}`, `news: ${n} ${ev}`, `${n} ${ev}. just so you know`, `you'll never guess. ${n} ${ev}`, `${p.name} ${ev}. the whole town is talking`], key, g.person + S.week);
  const stance = t > 25 ? fresh(['good for them honestly', 'love that', 'deserved', 'about time'], key + 'w', g.person) : t < -15 ? fresh(['of course they did', 'karma, if you ask me', 'I\'ll say nothing. loudly', 'make of that what you will'], key + 'c', g.person) : fresh(['no idea what to make of it', 'thought you\'d want to know', 'small town', ''], key + 'n', g.person);
  return stance ? `${frame}. ${stance}` : frame;
}
// Now and then a friend has something worth knowing: a job, a production in trouble, a cut that's better than it has
// any right to be. Each one comes with what to do about it.
function scoopWeek() {
  const M = S.me; if (S.week % 3 !== 1 || prnd() > .45) return;
  const pals = aliveKnown().filter(id => opinion(id) > 10 && ['friend', 'close', 'mentor', 'contact'].includes(relOf(id)));
  if (!pals.length) return;
  const id = pals[Math.floor(prnd() * pals.length)], q = P(id), r = prnd();
  const here = S.active.map(i => S.films[i]).filter(f => f.hub === M.hub && f.stage >= 0 && f.stage < 4 && f.stageEnd - S.week >= 2);
  if (r < .45 && (!M.focus || !M.focus.noHunt)) {
    const f = here.filter(f => f.stage <= 1).sort((a, b) => hashRand(a.id + S.week)() - hashRand(b.id + S.week)())[0];
    const p = f && typeof makeLead === 'function' ? makeLead(id, f) : null;
    if (p) { sms(id, fresh([`${f.title} is crewing up and they need a ${p.t.toLowerCase()}. I put your name in. apply this week`, `heads up: ${f.title} is looking for a ${p.t.toLowerCase()}. I told them about you`, `you didn't hear it from me, but ${f.title} needs a ${p.t.toLowerCase()}. you'd be perfect. go`], 'scl' + id, f.id), 'tip', { replyable: 1, topic: 'tip', film: f.id }); return; }
  }
  if (r < .75) {
    const f = here.filter(f => f.co !== null && f.cost > f.budget * 1.12 && S.companies[f.co] && S.companies[f.co].tier <= 2)[0] || here.filter(f => f.co !== null && f.events && f.events.some(e => (e.q || 0) < -2))[0];
    if (f) { sms(id, fresh([`don't repeat this, but ${f.title} is a mess. way over budget. ${S.companies[f.co].name} are panicking`, `between us: ${f.title} is in trouble. reshoots, rows, the lot`, `friend on ${f.title} says it's a disaster. ${S.companies[f.co].name} won't be happy`], 'sct' + id, f.id), 'gossip', { replyable: 1, topic: 'chat', film: f.id }); return; }
  }
  const g = here.filter(f => f.stage === 3 && f.co !== null && (f.q || 0) >= 65)[0];
  if (g) { sms(id, fresh([`saw a rough cut of ${g.title} last night. it's REALLY good. like, people are going to talk`, `${g.title}. remember the name. the cut is special`, `ok I've seen ${g.title} and I'm not ok. it's that good`], 'scg' + id, g.id), 'gossip', { replyable: 1, topic: 'chat', film: g.id }); return; }
  const pal = circleOf(q, 10).map(P).find(x => x && !x.dead && !M.known[x.id] && x.standing > ME().standing);
  if (pal) { meet(pal.id, `Introduced by ${q.name}`, 3); sms(id, fresh([`${pal.name} asked about you. I said nice things. they'll be in touch`, `gave ${pal.name} your number. be charming`, `${pal.name} wants to meet you. don't thank me, buy me lunch`], 'sci' + id, pal.id), 'tip', { replyable: 1, topic: 'tip' }); }
}
function correspondWeek() { rememberWeek(); scoopWeek(); }

// An email answer that answers what you wrote, in an email voice.
function mailEcho(text, q) {
  if (!text || text.length < 12) return '';
  const X = parseMsg(text), T = X.topic, Q = X.q, cap = t => t.charAt(0).toUpperCase() + t.slice(1), out = [];
  if (Q && Q.k === 'opinion' && q) out.push(`You asked what I make of ${turn(Q.x)}. ${cap(opinionOn(q, turn(Q.x)))}.`);
  else if (Q && Q.k === 'should' && q) out.push(`As for whether you should ${turn(Q.x)}: ${adviceOn(q, turn(Q.x))}.`);
  if (T && T.obj) { const obj = turn(T.obj); out.push(T.k === 'plan' ? `You mentioned ${obj}. Do it: the people who make things are the ones who get asked back.` : T.k === 'did' ? (T.good ? `Congratulations on ${obj}, by the way.` : `I was sorry to read about ${obj}.`) : T.k === 'mine' ? `I hope things with your ${obj} settle down.` : `What you said about ${obj} stayed with me.`); }
  if (X.tone.includes('low') || X.tone.includes('anx')) out.push('And for what it\'s worth, everyone in this business has had the kind of month you describe. It passes.');
  if (X.tone.includes('up')) out.push('Your excitement comes through the screen. Keep that.');
  return out.slice(0, 2).join(' ');
}
function mailEchoAfter(x, n0) {
  const M = S.me, added = (M.mail || []).slice(n0).filter(m => m.folder !== 'sent' && m.folder !== 'spam' && !/^Office of /.test(m.from));
  if (!added.length || !x.text) return;
  const q = x.to && x.to[0] === 'p' ? P(+x.to.slice(1)) : null, echo = mailEcho(x.text, q); if (!echo) return;
  const m = added[added.length - 1], parts = m.body.split('\n\n');
  if (parts.length > 1) parts.splice(parts.length - 1, 0, echo); else parts.push(echo);
  m.body = parts.join('\n\n');
}
