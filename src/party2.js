// ---------------- The party, wider: more rooms, more people, results that range ----------------
// The New Year's Eve party used to be the same eight rooms with the same three answers. Now sixteen rooms exist and
// eight are open on any night (each in one of its versions), something different happens at midnight, and a roll
// that beats its target by a mile can change your year, while one that misses by a mile is a story people tell
// about you. Which way it goes is your dice and your strengths: every room has more than one way in.

// who each room is about, for the big-break and foot-in-mouth moments
for (const [k, who] of Object.entries({ star: 'star', host: 'host', kitchen: 'vet', pool: 'writer', garden: 'coord', dance: 'peer', hall: 'reporter', balcony: 'dir' })) STATIONS[k].who = who;
// other versions of the first eight rooms (same choices, a different moment)
const PARTY_ALT = {
  star: [n => `${n('star')} is hiding in the coat room from their own entourage. They look up at you like a cornered deer.`, n => `${n('star')} is doing magic tricks for a children's-party crowd of grown adults. One trick goes wrong.`],
  host: [n => `${n('host')} is in the study writing a toast on a napkin, crossing out every line. They hold it out to you: "Is this funny?"`, n => `${n('host')} has locked themselves in the study to take a call from a financier who is backing out. They put it on speaker by mistake.`],
  kitchen: [n => `${n('vet')} is trying to fix the host's espresso machine with a lens cloth and real determination.`, n => `${n('vet')} is teaching three caterers how to light a cake for a photo. They're very serious about it.`],
  pool: [n => `${n('writer')} is reading their own script aloud to a pool float. "It's a table read," they explain.`, n => `${n('writer')} is lying on the diving board, staring at the sky, and announces they've given up writing. Again.`],
  garden: [n => `${n('coord')} is in the garden running a very competitive game of charades with their interns.`, n => `${n('coord')} is on the phone to an intern who has lost a hard drive. They're trying not to scream.`],
  dance: [n => `${n('peer')} has been dared to dance with the host's grandmother, and needs a partner for moral support.`, n => `${n('peer')} is at the edge of the dance floor rehearsing a speech they're too scared to give someone.`],
  hall: [n => `${n('reporter')} is in the hallway pretending to look at the art while very clearly eavesdropping.`, n => `${n('reporter')} asks if you'll go on the record about "the state of the industry". They have a recorder.`],
  balcony: [n => `${n('dir')} is on the balcony with a cigarette they're not smoking, rehearsing what they'll say to a producer who fired them.`, n => `${n('dir')} is sketching the city skyline on a napkin, framing it with their fingers.`]
};
for (const k in PARTY_ALT) { const orig = STATIONS[k].scene; STATIONS[k].scene = (n, v) => { const sc = orig(n); if (v && PARTY_ALT[k][v - 1]) sc.text = PARTY_ALT[k][v - 1](n); return sc; }; }

const pg = k => S.me.party.ids[k];
// the new rooms
Object.assign(STATIONS, {
  bar: { who: 'agent', where: 'The bar', sys: 'Agents: an agent widens which jobs you hear about and takes a cut. They choose clients as carefully as clients choose them.',
    scene: (n, v) => ({ text: [`${n('agent')}, an agent, is at the bar with a phone in each hand, ordering for six people.`, `${n('agent')}, an agent, is complaining to the bartender that nobody at this party is "signable".`, `${n('agent')}, an agent, has lost a client tonight and is drinking about it.`][v || 0], opts: [
      { k: 'buy', label: 'Buy their round and ask what they look for', check: ['cha', 12] },
      { k: 'show', label: 'Show them something you made, on your phone', check: ['tas', 12] },
      { k: 'sign', label: 'Ask them, straight out, to represent you', check: ['cha', 16] }] }),
    res: (k, ok, g, n) => k === 'buy' ? (ok ? (meet(g.agent, 'Met at the party', 9), `${n('agent')} tells you exactly what gets someone signed: credits, a reel, and being talked about.`) : (meet(g.agent, 'Met at the party', -1), 'They take the drink and a call at the same time.'))
      : k === 'show' ? (ok ? (meet(g.agent, 'Met at the party', 12), lead(g.agent), `${n('agent')} watches the whole thing, which they never do. "Send me more."`) : (meet(g.agent, 'Met at the party', 0), 'The video won\'t load. The bar\'s signal is famously awful.'))
      : (ok ? (meet(g.agent, 'Met at the party', 10), lead(g.agent), (S.me.refs[g.agent] = (S.me.refs[g.agent] || 0) + 1), `${n('agent')} laughs, then doesn't. "Come in on Tuesday."`) : (meet(g.agent, 'Met at the party', -7), `${n('agent')} says "I'm not taking anyone new" in the voice they use for everyone.`)) },
  library: { who: 'exec', where: 'The library', sys: 'Companies: studios, labels and networks have ladders, boards and shares. Executives decide what gets made; they can be climbed, or bought.',
    scene: (n, v) => ({ text: [`${n('exec')}, who runs production at a studio, is hiding in the library from people who want things.`, `${n('exec')}, a studio executive, is reading the host's first editions with the gloves on.`, `${n('exec')}, a studio executive, is on a call about a film that's gone over budget. They mute it when you walk in.`][v || 0], opts: [
      { k: 'biz', label: 'Ask what they think the next five years look like', check: ['fin', 12] },
      { k: 'advice', label: 'Ask for one piece of career advice', check: ['cha', 10] },
      { k: 'pitch', label: 'Pitch them an idea in one sentence', check: ['orig', 15] }] }),
    res: (k, ok, g, n) => k === 'biz' ? (ok ? (meet(g.exec, 'Met at the party', 10), learnTaste(), `${n('exec')} talks for twenty minutes about streaming, cinemas and what audiences pay for. You understand the business better already.`) : (meet(g.exec, 'Met at the party', 0), 'They give you the answer they give journalists.'))
      : k === 'advice' ? (ok ? (meet(g.exec, 'Met at the party', 8), `"Be the person who makes the next call easy," ${n('exec')} says. You write it on your hand.`) : (meet(g.exec, 'Met at the party', 1), '"Work hard," they say, and leave.'))
      : (ok ? (meet(g.exec, 'Met at the party', 10), lead(g.exec), (S.me.spec.pages += 5), `${n('exec')} repeats your sentence back to you, slowly. "Write that down properly."`) : (meet(g.exec, 'Met at the party', -6), 'They\'ve heard it. They name the film it was called.')) },
  decks: { who: 'muso', where: 'The DJ booth', sys: 'Other fields: music, video, podcasts and theatre are careers here too, and people move between them. A song can lead to a film; a film to a stage.',
    scene: (n, v) => ({ text: [`${n('muso')} is DJing and losing the room. The dance floor is thinning.`, `${n('muso')}, a composer, is DJing as a favour and playing only film scores. Some people love it.`, `${n('muso')} has stopped the music to argue with someone about a key change.`][v || 0], opts: [
      { k: 'request', label: 'Suggest the record that saves the night', check: ['tas', 10] },
      { k: 'take', label: 'Offer to take over the decks for a song', check: ['rhythm', 13] },
      { k: 'score', label: 'Ask about writing music for films', check: ['cha', 11] }] }),
    res: (k, ok, g, n) => k === 'request' ? (ok ? (meet(g.muso, 'Met at the party', 10), `The floor fills. ${n('muso')} points at you over the crowd.`) : (meet(g.muso, 'Met at the party', -2), 'The floor empties completely. Nobody saw you suggest it, you hope.'))
      : k === 'take' ? (ok ? (meet(g.muso, 'Met at the party', 12), (me0().standing += .3), 'You play one song and the whole house sings it. Somebody films it.') : (meet(g.muso, 'Met at the party', -4), 'You press the wrong button. The silence is enormous.'))
      : (ok ? (meet(g.muso, 'Met at the party', 9), lead(g.muso), `${n('muso')} talks about spotting sessions and temp tracks until the song ends. "Come to the studio sometime."`) : (meet(g.muso, 'Met at the party', 1), 'It\'s too loud to hear the answer.')) },
  stairs: { who: 'creator', where: 'The stairs', sys: 'Your own work: songs, videos, shorts, podcasts and plays can be made on your own and released. Followers grow slowly and then all at once.',
    scene: (n, v) => ({ text: [`${n('creator')}, who has a big online following, is filming a video on the stairs and needs someone in it.`, `${n('creator')} is livestreaming the party to forty thousand people and narrating.`, `${n('creator')} is editing a video on their phone and swearing at it.`][v || 0], opts: [
      { k: 'join', label: 'Get in the video and be funny', check: ['cha', 11] },
      { k: 'tips', label: 'Offer a better angle and better light', check: ['comp', 11] },
      { k: 'avoid', label: 'Stay out of shot' }] }),
    res: (k, ok, g, n) => k === 'join' ? (ok ? (meet(g.creator, 'Met at the party', 10), (me0().fame = (me0().fame || 0) + 2), 'The video does numbers by morning. Strangers know your face for a week.') : (meet(g.creator, 'Met at the party', 2), 'You freeze on camera. They cut you out, kindly.'))
      : k === 'tips' ? (ok ? (meet(g.creator, 'Met at the party', 12), lead(g.creator), `${n('creator')} looks at the shot and gasps. "Do you want a job?"`) : (meet(g.creator, 'Met at the party', -2), 'Your angle shows the host\'s bathroom.'))
      : (meet(g.creator, 'Met at the party', 0), 'You stay out of it. Probably wise.') },
  porch: { who: 'critic', where: 'The porch', sys: 'Critics: reviews are gathered on Roger That. Rogerscore, thumbs and the audience each measure something different, and all three move box office.',
    scene: (n, v) => ({ text: [`${n('critic')}, a film critic, is on the porch defending a review half the party hates.`, `${n('critic')}, a critic, is writing tomorrow's column on their phone, out here in the cold.`, `${n('critic')}, a critic, asks you, deadpan, what the best film of the year was. It's a test.`][v || 0], opts: [
      { k: 'argue', label: 'Take them on about a film you love', check: ['tas', 13] },
      { k: 'ask', label: 'Ask what makes a good review', check: ['cha', 9] },
      { k: 'roast', label: 'Tell them what you really think of critics', check: ['com', 14] }] }),
    res: (k, ok, g, n) => k === 'argue' ? (ok ? (meet(g.critic, 'Met at the party', 12), learnTaste(), `${n('critic')} concedes the point, which they never do. "I'll watch it again."`) : (meet(g.critic, 'Met at the party', -3), 'They dismantle your argument with a smile.'))
      : k === 'ask' ? (ok ? (meet(g.critic, 'Met at the party', 8), `"Say what it tried to do, whether it did, and whether it was worth doing," ${n('critic')} says. It works for everything.`) : (meet(g.critic, 'Met at the party', 1), 'They talk about word counts for a long time.'))
      : (ok ? (meet(g.critic, 'Met at the party', 10), `${n('critic')} roars with laughter and quotes you in the column. Anonymously.`) : (meet(g.critic, 'Met at the party', -10), `${n('critic')} writes your name down. You don't know why. You'll find out.`)) },
  cellar: { who: 'money', where: 'The wine cellar', sys: 'Financing: films are paid for by investors, sales, tax credits and loans. Producers spend half their lives in rooms like this one.',
    scene: (n, v) => ({ text: [`${n('money')}, who funds films, has gone down to the cellar to choose the host's best bottle without asking.`, `${n('money')}, an investor, is in the cellar trying to find signal to sell some shares.`, `${n('money')}, an investor, has cornered two producers in the cellar and is cross-examining their budget.`][v || 0], opts: [
      { k: 'how', label: 'Ask how they choose what to back', check: ['fin', 12] },
      { k: 'ask', label: 'Ask them to back you', check: ['cha', 16] },
      { k: 'wine', label: 'Talk about the wine, not money', check: ['tas', 10] }] }),
    res: (k, ok, g, n) => k === 'how' ? (ok ? (meet(g.money, 'Met at the party', 10), `"Who's attached, what it costs and who already said yes," ${n('money')} says. "In that order."`) : (meet(g.money, 'Met at the party', 0), 'They say "it depends" four times.'))
      : k === 'ask' ? (ok ? (meet(g.money, 'Met at the party', 8), lead(g.money), `${n('money')} gives you a card with only a phone number on it. "When it's real."`) : (meet(g.money, 'Met at the party', -8), `${n('money')} has a rule about people who ask at parties.`))
      : (ok ? (meet(g.money, 'Met at the party', 12), `You agree about a vintage. ${n('money')} decides you're one of the interesting ones.`) : (meet(g.money, 'Met at the party', 2), 'You mispronounce the grape.')) },
  gameroom: { who: 'exec', where: 'The games room', sys: 'Luck: some breaks are pure chance. Lucky people get more of them, and everyone can make more of them by being in the room.',
    scene: (n, v) => ({ text: [`${n('exec')} is hustling everyone at the pool table for twenty dollars a game.`, `A poker game is going in the games room. ${n('exec')} is winning and gloating.`, `Somebody has set up a karaoke machine in the games room. ${n('exec')} has the microphone and won't give it back.`][v || 0], opts: [
      { k: 'beat', label: 'Take them on, and try to win', check: ['com', 12] },
      { k: 'lose', label: 'Play, and let them win gracefully', check: ['cha', 10] },
      { k: 'watch', label: 'Cheer from the sofa' }] }),
    res: (k, ok, g, n) => k === 'beat' ? (ok ? (meet(g.exec, 'Met at the party', 8), (S.me.cash += usd(40)), `You win. ${n('exec')} demands a rematch next week, which is how you get a lunch with a studio executive.`) : (meet(g.exec, 'Met at the party', 2), (S.me.cash -= usd(20)), 'You lose twenty dollars and some dignity.'))
      : k === 'lose' ? (ok ? (meet(g.exec, 'Met at the party', 10), 'Nobody can tell you let them win. You can tell they like you.') : (meet(g.exec, 'Met at the party', -2), 'It\'s obvious you let them win. They hate that.'))
      : (meet(g.exec, 'Met at the party', 1), 'You cheer. They notice, faintly.') },
  cloak: { who: 'star', where: 'The coat room', sys: 'Stories: some things that start at a party take months to play out. People remember how you handled the small moments.',
    scene: (n, v) => ({ text: [`Your coat is gone. The only one left looks a lot like it, and belongs to ${n('star')}.`, `${n('star')}'s phone is ringing in a coat that isn't theirs. The screen says "Mum".`, `${n('star')} can't find their car keys and is about to cry.`][v || 0], opts: [
      { k: 'track', label: 'Track it all down, person by person', check: ['eth', 11] },
      { k: 'joke', label: 'Make a joke of it with them', check: ['cha', 13] },
      { k: 'leave', label: 'Leave it for someone else' }] }),
    res: (k, ok, g, n) => k === 'track' ? (ok ? (meet(g.star, 'Met at the party', 12), `Twenty minutes of detective work and everything is where it should be. ${n('star')} hugs you like a sibling.`) : (meet(g.star, 'Met at the party', 2), 'You find three wrong coats and a cat.'))
      : k === 'joke' ? (ok ? (meet(g.star, 'Met at the party', 10), `${n('star')} laughs properly for the first time tonight. "You're funny. That's rare here."`) : (meet(g.star, 'Met at the party', -4), 'Wrong moment for a joke.'))
      : (meet(g.star, 'Met at the party', 0), 'Somebody else sorts it out.') }
});

// ---- how well it went: a roll that beats its target by a mile changes things; one that misses by a mile is a story ----
function partyTier(k, ok, scene) {
  const pt = S.me.party, R = S.me.lastRoll, opt = scene && scene.opts && scene.opts.find(o => o.k === k);
  if (!opt || !opt.check || !R) return '';
  const margin = R.d + R.mod - R.DC, st = STATIONS[pt.step], W = pt.step === 'midnight' && pt.wild !== undefined ? MIDNIGHT_WILD[pt.wild] : null;
  const whoK = (st && st.who) || (W && W.who) || (pt.step === 'late' ? (pt.flags.home ? 'peer' : 'dir') : 'host'), id = pt.ids[whoK];
  if (id === undefined || !P(id)) return '';
  if (ok && (R.crit > 0 || (margin >= 7 && R.d >= 14))) return ' ' + partyBreak(id);
  if (!ok && (R.crit < 0 || (margin <= -10 && R.d <= 2))) return ' ' + footInMouth(id);
  return '';
}
function partyBreak(id) {
  const M = S.me, q = P(id), nm = q.name, x = prnd();
  if (x < .3) { lead(id); M.refs[id] = (M.refs[id] || 0) + 1; return `Better still: ${nm} takes your number and means it. "I'm hiring in January. You're on the list."`; }
  if (x < .55) { M.cash += usd(350); meet(id, 'Hired you on the spot', 6); return `Better still: ${nm} needs someone on New Year's Day itself, paid double. You say yes before they finish the sentence.`; }
  if (x < .8) { meet(id, 'Took an interest in you', 14); trust(id, 15); return `Better still: ${nm} says, "Have lunch with me next month. I mean it." People here don't say that.`; }
  const a = bestIn(M.hub, ROLES, p => p.standing + prnd() * 20 - (M.known[p.id] ? 999 : 0)), b = a && bestIn(M.hub, ROLES, p => p.standing + prnd() * 20 - (M.known[p.id] || p.id === a.id ? 999 : 0));
  for (const p of [a, b]) if (p) meet(p.id, 'Introduced at the party', 7);
  return `Better still: ${nm} walks you round the room and introduces you${a ? ` to ${a.name}${b ? ` and ${b.name}` : ''}` : ''} as "someone to watch".`;
}
function footInMouth(id) {
  const M = S.me, me = me0(), q = P(id), nm = q.name, i = Math.floor(prnd() * 6);
  addTie(me, q, -10); me.standing = Math.max(0, me.standing - .6);
  if (M.known[id] && !M.known[id].tags.includes('Remembers the party')) M.known[id].tags.push('Remembers the party');
  return ['Worse: you call ' + nm + ' by the wrong name. Twice. The second time, someone corrects you.', `Worse: you tell ${nm} their last film was "brave". They know exactly what that means.`, `Worse: you knock a drink down ${nm}'s jacket, and then you laugh, which is much worse.`, `Worse: you spend five minutes explaining ${nm}'s own job to them.`, `Worse: you complain about a producer to ${nm}, who turns out to be married to them.`, `Worse: you ask ${nm} if they "do this professionally". They have two awards.`][i];
}

// ---- something always happens at midnight ----
const MIDNIGHT_WILD = [
  { t: 'the lights go out', who: 'dir', x: n => 'Ten seconds to midnight, every light in the house dies. The countdown happens in the dark, and then a hundred phones light up at once.', o: n => [
      { k: 'candles', label: 'Find candles and keep the party going', check: ['eth', 10] }, { k: 'dark', label: `Use the dark to talk to ${n('dir')}, honestly`, check: ['cha', 12] }, { k: 'home', label: 'Take it as a sign and head home' }],
    res: (k, ok, g, n, pt) => k === 'candles' ? (pt.drinks++, ok ? (meet(g.host, null, 8), 'Twenty candles and a guitar later, it\'s the best party anyone\'s been to. The host knows who saved it.') : 'You find one candle. It\'s scented. Strongly.') : k === 'dark' ? (pt.drinks++, ok ? (meet(g.dir, 'Met at the party', 12), `${n('dir')} tells you things in the dark they've never said in daylight. You become friends in an hour.`) : (meet(g.dir, null, -2), 'You talk to the wrong person in the dark for ten minutes.')) : (pt.flags.home = 1, 'You walk home under fireworks you can see better without the lights.') },
  { t: 'someone famous walks in', who: 'star', x: n => `At the stroke of midnight, someone genuinely, globally famous walks in with ${n('star')}. The room changes shape around them.`, o: n => [
      { k: 'hello', label: 'Walk up and say hello like a normal person', check: ['cha', 15] }, { k: 'cool', label: 'Stay cool and talk to someone nobody\'s talking to', check: ['com', 10] }, { k: 'home', label: 'Leave on a high' }],
    res: (k, ok, g, n, pt) => k === 'hello' ? (pt.drinks++, ok ? (meet(g.star, 'Met at the party', 10), (me0().fame = (me0().fame || 0) + 1), 'It goes well. Someone takes a photo of the two of you laughing, and it travels.') : (meet(g.star, null, -3), 'You say "huge fan" in a voice you\'ve never heard yourself use.')) : k === 'cool' ? (pt.drinks++, ok ? (meet(g.peer, 'Met at the party', 10), `You end up with ${n('peer')}, who is far more interesting than anyone famous.`) : 'You stand alone looking cool for a long time.') : (pt.flags.home = 1, 'You leave while the night is still perfect.') },
  { t: 'a proposal by the pool', who: 'host', x: n => `Midnight, and a friend of ${n('host')} drops to one knee by the pool. The whole party holds its breath.`, o: n => [
      { k: 'cheer', label: 'Lead the applause', check: ['cha', 9] }, { k: 'film', label: 'Film it for them, properly', check: ['comp', 10] }, { k: 'home', label: 'Slip away and give them the moment' }],
    res: (k, ok, g, n, pt) => k === 'cheer' ? (pt.drinks += 2, ok ? (meet(g.host, null, 6), 'The yes, the cheer, the champagne. You start the applause at exactly the right second.') : 'You start clapping before the answer. It is, thankfully, yes.') : k === 'film' ? (pt.drinks++, ok ? (meet(g.host, null, 10), 'Your video is the one they keep. The host sends you a thank-you for months.') : 'Your thumb is over the lens for the whole thing.') : (pt.flags.home = 1, 'You leave them to it. It\'s a lovely thing to walk home after.') },
  { t: 'a fight in the garden', who: 'writer', x: n => `As the fireworks start, ${n('writer')} and ${n('dir')} are shouting at each other in the garden about who ruined whose film.`, o: n => [
      { k: 'break', label: 'Get between them and calm it down', check: ['com', 13] }, { k: 'side', label: `Take ${n('dir')}'s side`, check: ['cha', 12] }, { k: 'home', label: 'Stay well out of it and go home' }],
    res: (k, ok, g, n, pt) => k === 'break' ? (pt.drinks++, ok ? (meet(g.writer, 'Met at the party', 8), meet(g.dir, 'Met at the party', 8), 'By one o\'clock they\'re sharing a cigarette and you\'re the person who stopped it.') : (meet(g.writer, null, -4), meet(g.dir, null, -4), 'You get an elbow and both of them stop speaking to you.')) : k === 'side' ? (pt.drinks++, ok ? (meet(g.dir, 'Met at the party', 12), meet(g.writer, null, -8), `${n('dir')} won't forget you backed them. Nor will ${n('writer')}.`) : (meet(g.dir, null, -2), meet(g.writer, null, -6), 'Both of them turn on you.')) : (pt.flags.home = 1, 'You leave as the shouting turns to crying. Some nights you just go.') },
  { t: 'everybody ends up in the pool', who: 'host', x: n => `Somebody falls in at midnight, then somebody else, and then it's a movement. ${n('host')}'s phone is on the edge, about to go in.`, o: n => [
      { k: 'jump', label: 'Jump in. It\'s New Year\'s Eve', check: ['cha', 10] }, { k: 'save', label: `Save ${n('host')}'s phone`, check: ['eth', 11] }, { k: 'home', label: 'Leave dry while you still can' }],
    res: (k, ok, g, n, pt) => k === 'jump' ? (pt.drinks += 2, ok ? (meet(g.peer, 'Met at the party', 8), 'The best twenty minutes of the year. You get out freezing and famous.') : 'You lose a shoe and your dignity in the deep end.') : k === 'save' ? (pt.drinks++, ok ? (meet(g.host, null, 12), `You dive for the phone and save it. ${n('host')} remembers who rescued their contacts.`) : 'You catch the phone and fall in with it.') : (pt.flags.home = 1, 'You leave dry, which is its own kind of victory.') },
  { t: 'the police knock', who: 'host', x: n => `Midnight, and two police officers are at the door about the noise. ${n('host')} is nowhere to be seen.`, o: n => [
      { k: 'talk', label: 'Talk to them, charmingly', check: ['cha', 14] }, { k: 'find', label: `Go and find ${n('host')}`, check: ['eth', 10] }, { k: 'home', label: 'Use the moment to leave' }],
    res: (k, ok, g, n, pt) => k === 'talk' ? (pt.drinks++, ok ? (meet(g.host, null, 14), 'The officers leave with slices of cake and a promise to turn it down. You saved the party.') : (meet(g.host, null, -4), 'You make it worse. The music stops at half past twelve.')) : k === 'find' ? (pt.drinks++, ok ? (meet(g.host, null, 8), `You find ${n('host')} on the roof and get them downstairs in time.`) : 'You get lost in the house.') : (pt.flags.home = 1, 'You slip out behind the police car. Smooth.') }
];
