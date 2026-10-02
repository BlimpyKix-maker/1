// ---------------- The phone, properly ----------------
// Everyone texts like themselves. A texting style comes from traits and age; familiarity warms it up (a stranger
// writes "Hi, it's…", a close friend sends three messages and a meme). Messages you get can be answered: warm,
// funny, flirty, brief, or in your own words, and they answer back in character. Replies move the relationship.
const TEXT_STYLES = {
  emoji: { label: 'emoji-happy' }, terse: { label: 'terse' }, formal: { label: 'formal' }, lower: { label: 'all lowercase' }, caps: { label: 'ALL CAPS energy' }, long: { label: 'long paragraphs' }
};
function textStyle(p) {
  const t = p.traits || [], age = S.year - p.born, r = hashRand(p.id * 89 + 4)();
  if (t.includes('Volatile') || t.includes('Reckless')) return 'caps';
  if (t.includes('Gregarious') || t.includes('Charming') || t.includes('Party animal')) return 'emoji';
  if (t.includes('Shy') || t.includes('Cynical') || t.includes('Workhorse') || t.includes('Disciplined')) return 'terse';
  if (age > 55 || t.includes('Perfectionist') || t.includes('Diplomatic')) return 'formal';
  if (t.includes('Anxious') || t.includes('Optimist')) return 'long';
  return age < 32 ? (r < .6 ? 'lower' : 'emoji') : r < .5 ? 'lower' : 'terse';
}
const EMO = { happy: ['😂', '🙌', '✨', '🥹', '😄', '🎬'], sad: ['😩', '🫠', '😭'], love: ['❤️', '😘', '🥰'], none: ['👀', '🙃', '😅'] };
function styleText(p, t, mood = 'happy') {
  const M = S.me, st = textStyle(p), o = M && M.known[p.id] ? opinion(p.id) : 0, r = hashRand(p.id * 7 + (M ? M.phoneN || 0 : 0))(), first = M ? ME().name.split(' ')[0] : '';
  let s = String(t);
  if (/^\[/.test(s)) return s;   // a photo or a voice note speaks for itself
  switch (st) {
    case 'formal': s = s[0].toUpperCase() + s.slice(1).replace(/\s*$/, ''); if (!/[.!?]$/.test(s)) s += '.'; if (o < 20) s = `Hello ${first}, ${s[0].toLowerCase()}${s.slice(1)}`; s += ` Best, ${p.name.split(' ')[0]}`; break;
    case 'terse': s = s.split(/[.!?] /)[0].toLowerCase().replace(/[.!]+$/, ''); if (s.length > 60) s = s.slice(0, 58).replace(/\s\S*$/, '') + '…'; break;
    case 'lower': s = s.toLowerCase().replace(/[.]$/, ''); break;
    case 'caps': s = s.replace(/\b([a-z]{4,})\b/g, (w, _, i) => (hashRand(i + p.id)() < .35 ? w.toUpperCase() : w)) + (r < .5 ? '!!' : '!!!'); break;
    case 'long': s = s[0].toUpperCase() + s.slice(1) + (r < .5 ? ' Anyway sorry, long message, I just think about this stuff a lot. How are YOU? Properly, I mean.' : ' Also, random, but I hope you\'re looking after yourself. This business eats people.'); break;
    case 'emoji': s += ' ' + EMO[mood][Math.floor(r * EMO[mood].length)] + (o > 40 ? EMO[mood][Math.floor(r * 7) % EMO[mood].length] : ''); break;
  }
  if (o >= 55 && st !== 'formal' && r < .4) s = (relOf(p.id) === 'partner' ? pickLine(['babe ', 'hey you ', 'love, '], p.id) : pickLine(['ok ', 'listen ', 'mate ', 'right so '], p.id)) + s;
  return s;
}
// More of everything people text about.
const MORE_HI = ['are you awake', 'I need to tell someone this and you\'re the only one who\'ll get it', 'you up for a walk sunday? I need to complain about everything', 'is it normal to dream about call sheets', 'I just saw our old film school teacher in a supermarket. he was buying 12 lemons', 'tell me something good', 'I\'ve rewatched the same film four times this week. help', 'quick: favourite opening shot of all time. go', 'my plant died. it was the only thing in my life going well', 'we should make something. a short. this summer. I\'m serious', 'I was so rude to a runner today and I feel sick about it', 'found a great café with good wifi and terrible coffee. ideal', 'are you going to the screening thing or should I also not go', 'I said your name in a meeting today. in a good way', 'what are you doing this weekend', 'I just walked past the place where we met and got weirdly emotional', 'random question: what\'s the best film you\'ve seen this year', 'did you see the trades this morning', 'need a recommendation. something sad but not TOO sad', 'my landlord is raising the rent again, I might move into the edit suite', 'I have a meeting tomorrow and nothing to wear. thoughts', 'how did the thing go', 'there\'s a screening on Thursday, free wine, you in', 'just finished a 16 hour day. I can\'t feel my feet', 'just got a parking ticket outside a studio that didn\'t hire me. poetic', 'thinking of quitting everything and opening a bakery. talk me out of it', 'you\'d have loved what happened on set today', 'are we still on for that thing', 'my mum asked about you'];
const MEMES = ['[a photo of a sunrise over a car park, captioned "magic hour"]', '[a video of a crew member asleep standing up]', '[a photo of a lunch so beige it hurts]', '[a voice note that is just someone humming a film score]', '[a screenshot of a casting call for "man, 30s, looks like he owns a boat"]', '[a photo of a fake snow machine attacking a car]', '[a selfie in a hi-vis vest, deadly serious]', '[a photo of a dog in a director\'s chair]', '[a meme about call times]', '[a blurry photo of a famous actor in a supermarket]', '[a voice note, mostly laughing]', '[a screenshot of a terrible review]', '[a photo of a craft services table, captioned "living the dream"]'];
const ASK_ADVICE = ['my boss takes credit for my ideas. do I say something or wait', 'two job offers, same week. one fun, one pays. which', 'I think I want to quit acting and go into editing. am I mad', 'is it ok to turn down a friend\'s film', 'do I move cities for this or am I running away', 'they asked me to sign an NDA for a student film. is that normal', 'how do you say no to someone famous without dying', 'should I take a job abroad if it means leaving everyone', 'do I tell the director their script has a hole in it', 'got offered more money for a worse job. thoughts', 'is it weird to ask an ex for a reference', 'they want me to work for free "for exposure". do I'];
function worldGripe() { const on = typeof worldOn === 'function' ? worldOn().filter(e => e.from <= S.week).map(e => e.k) : []; const L = { heat: 'it is TOO HOT to make films', strike: 'how are you getting anywhere with no trains', walkout: 'this strike is killing me. I\'ve rewatched every film I own', recession: 'everyone\'s cutting budgets. scary out there', boom: 'every company in town is hiring, it\'s mad', storm: 'my street is a river', flu: 'half our crew is off sick', festival: 'the festival! are you going tonight', final: 'are you watching the match' }; const k = on.find(x => L[x]); return k ? L[k] : null; }
// Extra phone traffic: called from phoneTick's quieter moments.
function phoneExtra(id) {
  const g = worldGripe(), r = prnd();
  if (g && r < .25) return sms(id, g, 'text', { replyable: 1 });
  if (r < .45) return sms(id, ppick(MEMES), 'text', { replyable: 1 });
  if (r < .6) { const i = Math.floor(prnd() * ASK_ADVICE.length); return sms(id, ASK_ADVICE[i], 'advice', { replyable: 1, topic: 'adv' + i }); }
  return sms(id, ppick(MORE_HI), 'text', { replyable: 1 });
}
// ---- replying ----
const REPLIES = {
  warm: { label: '❤️ Warm', mine: ['aw, that means a lot', 'always here for you', 'miss you, let\'s fix a date', 'you\'re the best, you know that'] },
  funny: { label: '😂 Funny', mine: ['I\'m legally obliged to say "that\'s showbiz"', 'please put that in a film', 'I\'ve read worse scripts', 'adding this to my memoir'] },
  flirty: { label: '😏 Flirty', mine: ['you\'re trouble, you know that', 'thinking about you, for the record', 'save me a seat next to you'] },
  brief: { label: '👍 Brief', mine: ['👍', 'ha, yeah', 'nice', 'ok!'] }
};
// Phone-like rendering helpers.
function phoneAvatar(k, s = 30) { return k === 'home' ? `<span class="pavatar home" style="width:${s}px;height:${s}px">🏠</span>` : `<span class="pavatar" style="width:${s}px;height:${s}px">${portraitOf(P(k), s)}</span>`; }
