// ---------------- Variation: the same moment almost never reads the same way twice ----------------
// A small grammar ({this|that|the other} picks one, nested freely, seeded so a replay reads identically) drives:
//  - voices: everyone you know texts like themselves: their own openers, sign-offs, pet names and a word or two from
//    home; your own texts vary the same way;
//  - gossip built from parts (who, what happened, how it's told) instead of a fixed list;
//  - scene openers that notice the weather, the hour, your mood, the room and who's in it;
//  - reactions after a choice, from someone who was there;
//  - more calls from home, more venues, more spam;
//  - encounters: small, generated situations (a place, a person, a thing that happens, three ways to play it) that
//    turn up between the bigger events.
function gx(t, seed) {
  const r = hashRand(Math.abs(Math.floor(seed)) * 7919 + 13);
  let s = String(t), guard = 0;
  while (s.includes('{') && guard++ < 40) s = s.replace(/\{([^{}]*)\}/g, (m, body) => { const L = body.split('|'); return L[Math.floor(r() * L.length)]; });
  return s.replace(/\s+([,.!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
}
const gpick = (L, seed) => L[Math.floor(hashRand(Math.abs(Math.floor(seed)) * 104729 + L.length)() * L.length)];
// ---- voices ----
const V_OPEN = ['ok so', 'honestly', 'right,', 'listen', 'so', 'hey', 'oi', 'look,', 'quick one:', 'not to be weird but', 'random but', 'ok', 'babe', 'friend,', 'update:', 'confession:', 'small thing:', 'hiya', 'morning!', 'ahem', 'news:', 'so um', 'right then', 'good news-ish:', 'PSA:', 'real talk:', 'hello hello', 'yo', 'one sec:', 'question:'];
const V_CLOSE = ['x', 'xx', 'anyway', 'love you', 'talk soon', '🙃', '✨', '😅', '🙏', 'lol', 'haha', 'ok bye', 'thoughts?', 'call me', 'more later', 'cheers', 'byeee', '(sorry)', 'no pressure', 'just saying', 'go go go', '👀', '💛', '🎬', 'ttyl', 'mwah', 'ciao', 'ok that\'s all', 'you know where I am', 'x x'];
const V_REGION = { en: [], fr: ['bisous', 'voilà', 'bon,', 'allez'], es: ['vale', 'oye', 'besos', 'venga'], it: ['dai', 'ciao ciao', 'allora', 'baci'], de: ['also', 'tschüss', 'na ja,', 'genau'], pt: ['valeu', 'beijos', 'tá', 'nossa'], hi: ['yaar', 'arre', 'acha', 'chalo'], ta: ['da', 'machi', 'seri', 'aiyo'], ja: ['ne', 'yoroshiku', 'otsukare', 'maa'], ko: ['aigoo', 'jinjja', 'hwaiting', 'daebak'], zh: ['jiayou', 'hao de', 'aiya', 'ok la'], yue: ['ok la', 'aiya', 'hou ah', 'm goi'], ru: ['nu', 'davai', 'poka'], sv: ['hej hej', 'tack', 'lagom'], yo: ['abeg', 'oya', 'ehn'], ar: ['yalla', 'habibi', 'inshallah'] };
function npcVoice(pid) {
  const p = P(pid); if (!p) return null; const r = hashRand(pid * 977 + 31), pick = (L, n) => { const out = []; for (let i = 0; i < n; i++) out.push(L[Math.floor(r() * L.length)]); return out; };
  return { open: pick(V_OPEN, 3), close: pick(V_CLOSE, 3), reg: V_REGION[(HUBS[p.hub] || {}).lang] || [], rate: .25 + r() * .4 };
}
const VOICE_KINDS = ['text', 'gossip', 'tip', 'life', 'love', 'advice', 'ask', 'invite'];
{ const _sms = sms;
  sms = function (from, t, kind = 'text', extra = {}) {
    const M = S.me;
    if (M && typeof t === 'string' && from !== null && from !== undefined && from >= 0 && VOICE_KINDS.includes(kind) && !/^\[/.test(t)) {
      const V = npcVoice(from), n = (M.phoneN || 0) + from * 3, r = hashRand(n * 131 + S.week);
      if (V && r() < V.rate && !/^(ok|so|hey|honestly|look|right)/i.test(t)) t = `${V.open[Math.floor(r() * 3)]} ${t}`;
      if (V && r() < V.rate * .8) t = `${t.replace(/[.!]$/, '')} ${r() < .3 && V.reg.length ? V.reg[Math.floor(r() * V.reg.length)] : V.close[Math.floor(r() * 3)]}`;
    }
    if (M && typeof t === 'string' && from === -1 && kind === 'mine') t = myVoice(t, (M.phoneN || 0) + S.week);
    return _sms(from, t, kind, extra);
  };
}
const MY_SWAP = [[/^hey\b/i, ['hey', 'hi', 'hiya', 'heyy', 'hello you']], [/\bthank you\b/i, ['thank you', 'thanks', 'thanks so much', 'ta', 'cheers']], [/\bsorry\b/i, ['sorry', 'so sorry', 'apologies', 'my bad']], [/\bcoffee\b/i, ['coffee', 'a coffee', 'coffee or something', 'a flat white']], [/\bdrinks?\b/i, ['a drink', 'drinks', 'a pint', 'one drink (two)']], [/\bsoon\b/i, ['soon', 'this week', 'sometime soon', 'before the month is out']], [/\bgreat\b/i, ['great', 'brilliant', 'lovely', 'amazing']], [/\bfree\b/i, ['free', 'around', 'about', 'up for it']]];
const MY_ALT = {
  'how are you doing?': ['how are you doing?', 'how are you, really?', 'how\'s life treating you?', 'you ok? haven\'t heard from you', 'what\'s new with you?', 'how\'s everything?', 'status report please'],
  'saw this and thought of you': ['saw this and thought of you', 'this made me think of you', 'this is so you', 'had to send you this', 'look what I found. you.'],
  'coffee soon?': ['coffee soon?', 'coffee this week?', 'we should get coffee', 'coffee? my treat', 'flat white and a catch-up soon?', 'tea, coffee, anything. soon?'],
  'that is amazing news!!': ['that is amazing news!!', 'WHAT. amazing!!', 'so happy for you', 'you deserve this', 'ahh congratulations!!', 'brilliant. celebrate properly'],
  'thinking of you, how\'s things': ['thinking of you, how\'s things', 'you crossed my mind today. how are you?', 'checking in. how\'s things?', 'miss you. how\'s it going?'],
  'sorry, slammed this week. next week?': ['sorry, slammed this week. next week?', 'drowning this week, can we do next?', 'can\'t this week, I\'m so sorry. next week?', 'raincheck? this week is mad'],
  '👍': ['👍', '👌', 'perfect', 'great', 'sounds good', 'deal', '🙌'],
  'nice': ['nice', 'love that', 'oh nice', 'ha, brilliant', 'excellent', 'good good'],
  'ha, same. how is the shoot going?': ['ha, same. how is the shoot going?', 'same here. how\'s the shoot?', 'tell me about it. shoot going ok?', 'haha. how\'s set life?']
};
function myVoice(t, seed) {
  const r = hashRand(seed * 53 + t.length); let s = t;
  const alt = MY_ALT[s.toLowerCase()]; if (alt) return alt[Math.floor(r() * alt.length)];
  for (const [re, L] of MY_SWAP) if (re.test(s) && r() < .6) s = s.replace(re, m => { const w = L[Math.floor(r() * L.length)]; return m[0] === m[0].toUpperCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w; });
  if (r() < .25) s = s.replace(/[.!]?$/, ['!', ' :)', '?', '', ' x'][Math.floor(r() * 5)]);
  return s;
}
// ---- gossip from parts: thousands of combinations ----
const G_WHAT = ['got into a shouting match with a {producer|caterer|parking attendant|drone operator} over {a sandwich|the call time|a parking space|lens choice}', 'quit {mid-shoot|on day two|by fax, somehow|in a voicemail}', 'is {secretly|very publicly|apparently} writing a {memoir|musical|horror film about their ex|heist film}', 'turned down {a superhero film|a perfume ad|a studio job|a role opposite @b}', 'was spotted {at the studio gates at 6am|in a wig at the airport|having lunch with @b|at three premieres in one night}', 'has a new {agent|manager|life coach|astrologer|dog}', 'and @b {are not speaking|are definitely dating|are starting a company|had a screaming row in the car park}', 'cried at {the table read|their own rushes|a test screening|the wrap party}', 'is {moving abroad|buying a vineyard|going back to school|starting a podcast}', 'got {the part|the job|the money|a second chance} everyone said they wouldn\'t', 'sent {a forty-page email|a voice note longer than the film|flowers to the whole crew|a cease and desist to a fan}', 'has been {rewriting|reshooting|recasting|re-editing} @b\'s film {without telling them|for months|from a yacht}', 'brought {a goat|their mum|a hypnotist|a dialect coach for a silent role} to set', 'won {a bet with|a prize over|a bidding war against} @b', 'is {suing|being sued by|ghosting|ghostwriting for} @b'];
const G_FRAME = ['so @a @w', '{did you hear|heard that|word is|apparently} @a @w', 'not me finding out @a @w', '@a @w. {I can\'t|incredible|of course they did|we love to see it}', 'don\'t tell anyone but @a @w', 'ok this is wild: @a @w', 'my friend on set says @a @w', '@a @w?? {thoughts|discuss|I need a drink}', 'the group chat is losing it because @a @w', 'reliable source: @a @w'];
(function moreGossip() { const seen = new Set(GOSSIP_LINES); for (let i = 0; i < 600 && seen.size < GOSSIP_LINES.length + 400; i++) { const w = gx(`{${G_WHAT.join('|')}}`, i * 3 + 1), f = gx(`{${G_FRAME.join('|')}}`, i * 7 + 2).replace('@w', w).replace(/@a/g, '{a}').replace(/@b/g, '{b}'); if (!seen.has(f)) { seen.add(f); GOSSIP_LINES.push(f); } } })();
// ---- scene openers ----
const BEAT = {
  rain: ['Rain hammers the tarps.', 'Everyone smells of wet coats.', 'The car park is a lake.', 'Umbrellas everywhere, none of them yours.'],
  storm: ['Thunder somewhere over the lot.', 'The wind has opinions about the lighting rig.', 'Half the crew is watching the sky.'],
  snow: ['Snow on the windows.', 'Everyone\'s breath shows.', 'Someone has built a snowman in the unit base.'],
  heat: ['It\'s airless.', 'The fans just move hot air around.', 'Somebody\'s handing out ice lollies.', 'The tarmac shimmers.'],
  sun: ['Bright sun through the blinds.', 'A good-light day.', 'People are eating lunch outside.'],
  fog: ['Fog sits on everything.', 'You can\'t see the end of the street.'],
  wind: ['Doors keep banging.', 'The flags outside the stage snap all day.'],
  cloud: ['A flat grey sky.', 'Nobody can tell what time it is.'],
  fair: ['A mild, forgettable day, so far.', 'Soft light, easy morning.'],
  am: ['First coffee.', 'Seven-something in the morning.', 'Before most people are awake.', 'The urn is still heating up.'],
  pm: ['Mid-afternoon slump.', 'After lunch, everyone a bit slower.', 'Four o\'clock and the day is long.'],
  eve: ['Late, and the building is emptying.', 'The cleaners have started.', 'Overtime, again.'],
  tired: ['You are running on fumes.', 'Your eyes feel sandy.', 'You\'ve had three coffees and no food.'],
  tense: ['Your jaw has been clenched since breakfast.', 'You\'re not at your most patient.', 'Something small could tip you over today.'],
  good: ['You feel sharp today.', 'Things have been going your way.', 'You slept properly for once.'],
  mate: ['{m} catches your eye across the room.', '{m} is next to you, eating crisps.', '{m} has saved you a seat.', '{m} mouths "here we go".', '{m} is already rolling their eyes.']
};
{ const _ib = inbox;
  inbox = function (kind, title, text, extra = {}) {
    if (kind === 'scene' && S.me && typeof text === 'string' && extra && extra.scene) {
      const M = S.me, seed = (M.seq || 0) * 31 + S.week, r = hashRand(seed), bits = [];
      const wx = typeof wxDay === 'function' ? wxDay(M.hub, S.week, M.wk ? M.wk.day : 2) : null, blk = M.wk ? M.wk.block : 0;
      if (wx && BEAT[wx.k] && r() < .55) bits.push(gpick(BEAT[wx.k], seed + 1));
      if (r() < .35) bits.push(gpick(BEAT[['am', 'pm', 'eve'][blk] || 'am'], seed + 2));
      if (M.energy < 30 && r() < .6) bits.push(gpick(BEAT.tired, seed + 3)); else if (M.stress > 65 && r() < .6) bits.push(gpick(BEAT.tense, seed + 4)); else if (M.energy > 70 && M.stress < 30 && r() < .3) bits.push(gpick(BEAT.good, seed + 5));
      const mates = extra.ctx && (extra.ctx.mates || []).filter(id => P(id)); if (mates && mates.length && r() < .4) bits.push(gpick(BEAT.mate, seed + 6).replace('{m}', P(mates[0]).name.split(' ')[0]));
      if (bits.length) text = `${bits.slice(0, 2).join(' ')} ${text}`;
    }
    return _ib(kind, title, text, extra);
  };
}
// ---- after a choice: someone reacts ----
const REACT = {
  ok: ['{w} gives you a small nod.', '{w} grins.', '"Nice," says {w}, quietly.', '{w} tells someone else about it within the hour.', '{w} raises an eyebrow, impressed despite themselves.', 'Later, {w} buys you a coffee without saying why.', '{w} writes something down. You hope it\'s good.'],
  bad: ['{w} looks away, kindly.', '{w} pats your shoulder on the way past.', '{w} winces on your behalf.', '"Could\'ve been worse," says {w}. It could not.', '{w} pretends not to have seen.', '{w} sends a text later: "you ok?"'],
  plain: ['{w} doesn\'t comment.', '{w} shrugs: fair enough.', '{w} seems to agree.', '{w} files it away.']
};
{ const _rp = resolvePick;
  resolvePick = function (it, k) {
    const r = _rp(it, k);
    try {
      if (r && it.result && typeof it.result.t === 'string' && it.kind === 'scene' && it.ctx) {
        const who = [...(it.ctx.mates || []), it.ctx.head, it.ctx.contact].filter(id => id !== null && id !== undefined && P(id) && id !== S.me.id)[0];
        const h = hashRand((it.id || 1) * 97 + 5);
        if (who !== undefined && h() < .45) { const L = REACT[it.result.ok === true ? 'ok' : it.result.ok === false ? 'bad' : 'plain']; it.result.t += ' ' + L[Math.floor(h() * L.length)].replace('{w}', P(who).name.split(' ')[0]); }
      }
    } catch (e) { /* a reaction is decoration; never block a choice */ }
    return r;
  };
}
// ---- more calls home, more rooms to be in, more junk mail ----
(function morePools() {
  const who = ['Your mum', 'Your dad', 'Your gran', 'Your little brother', 'Your sister', 'An aunt you forgot you had', 'Your oldest friend from school', 'Your cousin'];
  const what = ['wants to know if you\'ve met anyone famous', 'has seen an advert for a film school and thought of you', 'asks if you\'re eating vegetables', 'has opinions about your last post', 'is coming to visit "maybe in spring"', 'found your childhood camcorder in the loft', 'is learning to use video calls, badly', 'saw a film last night and needs to tell you the entire plot', 'wants you to explain what a producer actually does', 'sent a newspaper cutting about someone from your town who "made it"', 'asks whether "the film thing" pays yet', 'is proud of you and doesn\'t know how to say it', 'just called to hear your voice'];
  for (let i = 0; i < 60; i++) HOME_CALLS.push(`${gpick(who, i * 3 + 1)} ${gpick(what, i * 7 + 2)}.`);
  const adj = ['a basement', 'a rooftop', 'a disused', 'a very loud', 'a candlelit', 'a members-only', 'an old', 'a half-built', 'a fancy', 'a tiny'], noun = ['cinema', 'bowling alley', 'greenhouse', 'swimming baths', 'print shop', 'ballroom', 'record shop', 'boxing gym', 'night market', 'ferry terminal', 'diner', 'chapel', 'car showroom', 'library'];
  for (let i = 0; i < 50; i++) { const v = `${gpick(adj, i * 5 + 1)} ${gpick(noun, i * 11 + 3)}`; if (!MIXER_VENUES.includes(v)) MIXER_VENUES.push(v); }
  if (typeof SPAM !== 'undefined') { const a = ['URGENT', 'Final notice', 'You\'ve been selected', 'Congratulations', 'Exclusive', 'Act now', 'Re: your screenplay', 'Last chance'], b = ['your film qualifies for a "prestigious" award (entry fee $900)', 'a Hollywood producer wants to read your script for a small fee', 'lifetime access to 10,000 royalty-free explosions', 'claim your star on a walk of fame (not that one)', 'your headshots have been "liked" by a casting director', 'a crypto film fund wants to back your vision', 'you are a finalist in a contest you did not enter', 'buy followers, become an auteur', 'one weird trick to get an agent']; for (let i = 0; i < 40; i++) SPAM.push(`${gpick(a, i * 3 + 7)}: ${gpick(b, i * 13 + 5)}`); }
})();
// ---- encounters: small situations from parts ----
const ENCOUNTERS = [
  { t: 'At {place}, {who} drops a folder of headshots everywhere.', c: [['Help pick them up', 'gen', { tie: 4 }], ['Step over them, you\'re late', 'plain', { energy: 2 }], ['Pocket one and joke about it', 'bold', { tie: 1 }, ['cha', 11]]] },
  { t: '{who} is arguing with a ticket inspector at {place}. They\'re short on the fare.', c: [['Pay it for them', 'gen', { tie: 6, cash: -15 }], ['Talk the inspector down', 'bold', { tie: 4 }, ['cha', 12]], ['Keep your head down', 'careful', {}]] },
  { t: 'A stranger at {place} recognises you from your last job and wants a selfie.', c: [['Of course', 'gen', { fame: .3 }], ['Politely say no', 'careful', {}], ['Do a whole bit for them', 'bold', { fame: .6 }, ['pres', 11]]] },
  { t: '{who} is sitting alone at {place}, looking like they\'ve had bad news.', c: [['Sit down and ask', 'gen', { tie: 7, energy: -3 }], ['Leave them be', 'careful', {}], ['Buy them a drink and say nothing', 'gen', { tie: 5, cash: -8 }]] },
  { t: 'At {place} you overhear two producers discussing a film that needs someone exactly like you.', c: [['Introduce yourself', 'bold', { stand: .6 }, ['cha', 13]], ['Get their names and email later', 'careful', { stand: .2 }], ['Pretend you didn\'t hear', 'plain', {}]] },
  { t: '{who} asks you to read the first ten pages of their script, right now, at {place}.', c: [['Read it and be honest', 'honest', { tie: 3 }, ['tas', 11]], ['Read it and be kind', 'gen', { tie: 4 }], ['Say you\'ll read it later', 'careful', { tie: -1 }]] },
  { t: 'Your card is declined at {place}. {who} is behind you in the queue.', c: [['Laugh it off and pay cash', 'plain', { stress: 2 }], ['Let {who} cover it', 'plain', { tie: 2, stress: 3 }], ['Insist the machine is broken', 'bold', { stress: -1 }, ['cha', 12]]] },
  { t: 'A lost tourist at {place} asks you for directions in a language you barely speak.', c: [['Try anyway', 'gen', { stress: -1 }, ['lang', 10]], ['Point vaguely and smile', 'plain', {}], ['Walk them there yourself', 'gen', { energy: -3, stress: -2 }]] },
  { t: '{who} is filming something guerrilla-style at {place} and needs one more pair of hands.', c: [['Hold the reflector', 'gen', { tie: 5, energy: -4 }], ['Offer a better angle', 'bold', { tie: 3 }, ['comp', 12]], ['Wish them luck', 'careful', {}]] },
  { t: 'At {place}, someone spills coffee down your shirt. It\'s {who}.', c: [['Laugh: it happens', 'gen', { tie: 3 }], ['Make them buy you another', 'bold', { tie: 1 }], ['Go home and change', 'careful', { energy: -2 }]] },
  { t: 'A busker at {place} is playing the theme from a film you worked on, or one you love.', c: [['Tip generously', 'gen', { cash: -10, stress: -3 }], ['Request something', 'bold', { stress: -2 }], ['Keep walking, humming', 'plain', { stress: -1 }]] },
  { t: '{who} invites you to a reading at {place} tonight. You\'re exhausted.', c: [['Go anyway', 'loyal', { tie: 6, energy: -6 }], ['Send flowers instead', 'gen', { tie: 3, cash: -25 }], ['Sleep', 'careful', { energy: 5 }]] },
  { t: 'At {place} a film student asks how you got started.', c: [['Tell the true version', 'honest', { stand: .2 }], ['Tell the good version', 'plain', { stand: .2 }], ['Give them your number', 'gen', {}]] },
  { t: 'Your phone dies at {place} just as {who} was about to send you an address.', c: [['Borrow a stranger\'s phone', 'bold', {}, ['cha', 10]], ['Go home and charge it', 'careful', { energy: -2 }], ['Guess the address', 'bold', { stress: 2 }, ['tas', 13]]] },
  { t: '{who} confides at {place} that they\'re thinking of leaving the business.', c: [['Talk them out of it', 'loyal', { tie: 5 }, ['cha', 12]], ['Tell them to go if it\'s right', 'honest', { tie: 4 }], ['Offer to introduce them to someone', 'gen', { tie: 6 }]] },
  { t: 'At {place}, a critic you\'ve read for years is sitting at the next table.', c: [['Say hello', 'bold', { stand: .4 }, ['cha', 13]], ['Eavesdrop shamelessly', 'plain', {}], ['Leave a note: "you were wrong about that film"', 'bold', { stand: .2 }]] },
  { t: 'You find a wallet at {place} with a studio pass inside. The name: {who}.', c: [['Return it in person', 'honest', { tie: 8 }], ['Hand it in at the desk', 'careful', {}], ['Return it with a pitch attached', 'bold', { tie: 3, stand: .3 }, ['cha', 12]]] },
  { t: '{who} is celebrating at {place}: their first credit just came through.', c: [['Buy the round', 'gen', { tie: 6, cash: -40 }], ['Toast them and slip off', 'plain', { tie: 2 }], ['Ask who they worked for', 'ambitious', { stand: .2 }]] },
  { t: 'A power cut at {place} leaves everyone in the dark for an hour.', c: [['Start telling ghost stories', 'bold', { stress: -3 }, ['impro', 11]], ['Help find candles', 'gen', { stress: -1 }], ['Go home', 'careful', { energy: 2 }]] },
  { t: 'At {place}, {who} asks if you\'d split a taxi across town.', c: [['Yes, and talk shop the whole way', 'ambitious', { tie: 4, cash: -12 }], ['Yes, and sleep in it', 'plain', { energy: 3, cash: -12 }], ['Walk', 'careful', { energy: -2 }]] },
  { t: 'Someone at {place} is selling an old camera for almost nothing.', c: [['Buy it', 'plain', { cash: -60, stress: -2 }], ['Haggle', 'bold', { cash: -35 }, ['cha', 11]], ['Leave it', 'careful', {}]] },
  { t: '{who} at {place} has two spare tickets to a premiere tonight.', c: [['Go', 'plain', { stand: .3, energy: -4 }], ['Go and work the room', 'ambitious', { stand: .6, energy: -6 }, ['cha', 12]], ['Give your ticket to someone who needs it more', 'gen', { tie: 2 }]] },
  { t: 'At {place} you bump into an ex-colleague who still owes you money. It\'s {who}.', c: [['Mention it lightly', 'honest', { cash: 40 }, ['cha', 12]], ['Let it go', 'gen', { tie: 3 }], ['Make a scene', 'bold', { tie: -6 }]] },
  { t: 'A dog at {place} has decided you are its person.', c: [['Find the owner', 'gen', { stress: -2 }], ['Play with it for ten minutes', 'plain', { stress: -4 }], ['Walk away fast', 'careful', {}]] },
  { t: '{who} shows you a rough cut on their phone at {place} and waits.', c: [['Tell them what\'s working', 'gen', { tie: 4 }], ['Tell them what isn\'t', 'honest', { tie: 2 }, ['shape', 12]], ['Say it\'s "really interesting"', 'plain', { tie: -1 }]] },
  { t: 'At {place}, {who} offers you a script they swear is "the one". It\'s 190 pages.', c: [['Take it home', 'gen', { tie: 3, energy: -2 }], ['Ask for the first act only', 'honest', { tie: 1 }], ['Recommend a good editor', 'plain', {}]] },
  { t: 'A delivery rider at {place} turns out to be a former stunt performer with stories.', c: [['Buy them a coffee and listen', 'gen', { stress: -2, cash: -5 }], ['Ask for their number for a shoot', 'ambitious', {}], ['Tip and go', 'plain', { cash: -5 }]] },
  { t: '{who} is stuck at {place} with a broken-down van full of lighting kit.', c: [['Help push', 'gen', { tie: 6, energy: -5 }], ['Call a tow you know', 'plain', { tie: 3 }], ['Diagnose it yourself', 'bold', { tie: 4 }, ['phys', 12]]] },
  { t: 'At {place} there\'s an open-mic night and the host is begging for volunteers.', c: [['Get up and do five minutes', 'bold', { fame: .3, stress: -2 }, ['comic', 12]], ['Heckle, nicely', 'plain', { stress: -1 }], ['Hide behind your drink', 'careful', {}]] },
  { t: '{who} wants your honest opinion at {place}: should they take the safe job or the interesting one?', c: [['The interesting one', 'bold', { tie: 3 }], ['The safe one', 'careful', { tie: 2 }], ['Ask what they\'re scared of', 'gen', { tie: 5 }, ['cha', 11]]] },
  { t: 'Someone at {place} has left a notebook full of brilliant ideas on the table.', c: [['Find the owner', 'honest', { stand: .1 }], ['Read it first', 'plain', {}], ['Leave it where it is', 'careful', {}]] },
  { t: 'At {place}, {who} is being talked over by someone louder.', c: [['Back them up', 'loyal', { tie: 6 }, ['cha', 12]], ['Change the subject', 'gen', { tie: 3 }], ['Stay out of it', 'careful', { tie: -1 }]] },
  { t: 'A fire alarm empties {place}. You end up on the pavement next to {who}.', c: [['Make the most of it: talk shop', 'ambitious', { tie: 4 }], ['Small talk about the weather', 'plain', { tie: 2 }], ['Check your phone', 'careful', {}]] },
  { t: 'At {place} a kid asks if you\'re "someone off the telly".', c: [['Say yes', 'bold', { stress: -1 }], ['Say not yet', 'honest', { stress: -1 }], ['Sign their napkin anyway', 'gen', { fame: .1 }]] },
  { t: '{who} at {place} needs someone to read the other part for an audition tape. Now.', c: [['Do it properly', 'gen', { tie: 5 }, ['range', 11]], ['Read it flat, on purpose', 'plain', { tie: 2 }], ['Say you\'re not an actor', 'careful', {}]] },
  { t: 'A heatwave of opinions at {place}: two people are arguing about the best film of the year.', c: [['Join in', 'bold', { stress: -1 }, ['tas', 11]], ['Take notes for a script', 'plain', {}], ['Order another and enjoy it', 'plain', { stress: -2, cash: -6 }]] },
  { t: 'At {place} you\'re mistaken for someone else and offered a job meant for them.', c: [['Correct them', 'honest', { stand: .2 }], ['Hear them out first', 'bold', {}, ['cha', 13]], ['Leave quickly', 'careful', {}]] },
  { t: '{who} turns up at {place} with a black eye and won\'t say why.', c: [['Ask gently', 'gen', { tie: 4 }], ['Don\'t ask', 'careful', { tie: 1 }], ['Make a joke about stunt work', 'bold', { tie: 2 }, ['cha', 11]]] },
  { t: 'The barista at {place} is writing a screenplay and has a question about structure.', c: [['Answer it properly', 'gen', { stress: -1 }, ['struc', 10]], ['Recommend a book', 'plain', {}], ['Say you\'re in a rush', 'careful', {}]] },
  { t: 'At {place} a former teacher of yours is sitting alone.', c: [['Go and thank them', 'gen', { stress: -3 }], ['Wave', 'plain', {}], ['Tell them what you\'re working on', 'ambitious', { stand: .1 }]] },
  { t: '{who} has double-booked themselves at {place} and asks you to cover a meeting.', c: [['Cover it', 'loyal', { tie: 6, energy: -3 }], ['Cover it and pitch yourself while you\'re there', 'ambitious', { tie: 2, stand: .3 }, ['cha', 13]], ['Say no', 'careful', { tie: -2 }]] },
  { t: 'At {place}, an old rival of {who} starts badmouthing them to you.', c: [['Defend {who}', 'loyal', { tie: 5 }], ['Listen and say nothing', 'careful', {}], ['Tell {who} later', 'honest', { tie: 3 }]] },
  { t: 'You win a raffle at {place}. The prize is a weekend in a caravan.', c: [['Take it and actually go', 'plain', { stress: -6, energy: 4 }], ['Give it to {who}', 'gen', { tie: 5 }], ['Sell it', 'plain', { cash: 80 }]] },
  { t: '{who} at {place} has a spare plus-one for a wedding this weekend. They\'re desperate.', c: [['Go', 'gen', { tie: 6, energy: -5 }], ['Go and give a speech', 'bold', { tie: 8, energy: -6 }, ['cha', 13]], ['Make your excuses', 'careful', { tie: -1 }]] },
  { t: 'At {place} a famous face is quietly eating alone.', c: [['Leave them in peace', 'careful', {}], ['Send over a drink', 'gen', { cash: -12 }], ['Introduce yourself', 'bold', { stand: .3 }, ['cha', 14]]] },
  { t: 'A street photographer at {place} wants to take your portrait.', c: [['Let them', 'plain', { fame: .1 }], ['Ask to see their work', 'gen', {}], ['Say no', 'careful', {}]] },
  { t: '{who} invites you to help judge a student film night at {place}.', c: [['Judge honestly', 'honest', { tie: 2, stand: .2 }], ['Judge kindly', 'gen', { tie: 3 }], ['Find an excuse', 'careful', {}]] },
  { t: 'At {place} you hear your own name in someone else\'s conversation.', c: [['Listen in', 'plain', {}], ['Walk over and say hi', 'bold', {}, ['cha', 12]], ['Leave before it gets weird', 'careful', {}]] },
  { t: '{who} is moving flat this weekend and asks around at {place} for help.', c: [['Bring a van', 'gen', { tie: 7, energy: -7, cash: -30 }], ['Bring pizza', 'gen', { tie: 4, cash: -20 }], ['Be busy', 'careful', { tie: -2 }]] },
  { t: 'At {place} a stranger says your shoes are terrible.', c: [['Agree', 'honest', { stress: -1 }], ['Argue', 'bold', {}, ['cha', 11]], ['Buy new shoes', 'plain', { cash: -50 }]] }
];
function encPlace() { const M = S.me, L = (HUBS[M.hub].places || []).map(p => `a café in ${p}`).concat(MIXER_VENUES.slice(0, 40)); return gpick(L, S.week * 7 + (M.seq || 0)); }
function encounterWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  if (pending().some(it => it.kind === 'enc') || prnd() > .32) return;
  M.encW = M.encW || {}; const pool = ENCOUNTERS.map((e, i) => i).filter(i => S.week - (M.encW[i] ?? -99) >= 30); if (!pool.length) return;
  const i = pool[Math.floor(prnd() * pool.length)], E = ENCOUNTERS[i]; M.encW[i] = S.week;
  const known = aliveKnown().filter(id => P(id).hub === M.hub), who = known.length && prnd() < .7 ? known[Math.floor(prnd() * known.length)] : (typeof youngNPC === 'function' ? youngNPC(M.hub, ROLES[Math.floor(prnd() * ROLES.length)]).id : null);
  const nm = who !== null && P(who) ? P(who).name : 'someone', place = encPlace();
  const text = E.t.replace(/\{who\}/g, nm).replace(/\{place\}/g, place), cap = text.charAt(0).toUpperCase() + text.slice(1);
  inbox('enc', gx('{A moment|On the way|In passing|Out and about|Small things}', S.week + i), cap, { enc: i, person: who, choices: E.c.map(([l, st, fx, ck], j) => ({ k: 'e' + j, label: (ck ? `${l.replace(/\{who\}/g, nm.split(' ')[0])} · ${checkLabel(ck[0], ck[1])}` : l.replace(/\{who\}/g, nm.split(' ')[0])), check: ck })) });
}
function encPick(it, k) {
  if (it.kind !== 'enc') return false; const M = S.me, me = ME(), E = ENCOUNTERS[it.enc], c = E && E.c[+k.slice(1)]; it.done = true; if (!c) return true;
  const [label, st, fx0, ck] = c, ok = ck ? roll(ck[0], ck[1]) : true, fx = ok ? fx0 : { stress: 2, tie: Math.min(0, (fx0.tie || 0)) - 1 };
  const q = it.person !== null && it.person !== undefined ? P(it.person) : null;
  if (fx.tie && q) { meet(q.id, null); addTie(me, q, fx.tie); }
  if (fx.cash) M.cash += usd(fx.cash); if (fx.energy) M.energy = clamp(M.energy + fx.energy, 0, 100); if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100);
  if (fx.stand) me.standing = clamp(me.standing + fx.stand, 0, 100); if (fx.fame) me.fame = clamp((me.fame || 0) + fx.fame, 0, 100);
  const T = ok ? ['It goes about as well as these things can.', 'A small good thing, in an ordinary week.', 'You\'ll remember it, a bit.', 'It turns out to matter, a little.', 'Nice.'] : ['It doesn\'t quite work.', 'Well. You tried.', 'Awkward, but survivable.', 'Not your finest minute.'];
  it.result = { ok: ck ? ok : null, roll: ck ? M.lastRoll : null, t: gpick(T, (it.id || 1) * 3 + (ok ? 1 : 2)) + (q && fx.tie > 0 ? ` ${q.name.split(' ')[0]} won't forget it.` : '') };
  return true;
}
