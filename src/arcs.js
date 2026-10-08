// ---------------- Story arcs: things that unfold over weeks ----------------
// Most of what happens in a week is a moment: a scene, a text, an offer. Arcs are stories. They start from your own
// life (a friend, the film you're on, your rival, your city), come back two or three times over a month or two, and
// end differently depending on what you chose and how the dice fell. One or two run at a time; each kind comes back
// only after years, and never the same way twice, because the people, films and money in it are yours.
// Everything here runs inside the week (prnd), so replays stay identical; rendering only reads what's stored.
//
// An arc: { id, name, lv: [min, max] career level, fields?: [...], need?(), mk(c) -> false to skip, stages: {...} }.
// A stage: { t: title, x: text, o: [option...] }. An option: { k, l: label, ck?: [stat, dc], cost?: 'amt' | $,
// ok: result, no?: result when the roll fails }. A result: { t: text, fx?, n?: next stage, w?: [lo, hi] weeks, end?: line
// for your story log }. Text takes tokens: {who} {who2} {film} {co} {city} {amt} {amt2} {role} {job} and pronouns for
// {who}: {they} {them} {their} {They} {Their} {is} {was} {has} {s} (a verb ending: "{they} want{s}").
// fx: cash (2027 $, or 'amt' / '-amt' / 'amt2'), stand, fame, stress, energy, tie, tie2, trust, rel / rel2 (a
// relationship for {who} / {who2}), meet (a kind of new acquaintance), xp: { sub: v }, mile (milestone text), flag.

const ARC_PRON = { F: ['she', 'her', 'her', 'is', 'was', 'has', 's'], M: ['he', 'him', 'his', 'is', 'was', 'has', 's'], X: ['they', 'them', 'their', 'are', 'were', 'have', ''] };
function arcFill(s, c) {
  if (typeof s === 'function') s = s(c);
  const q = c.who !== null && c.who !== undefined && P(c.who) ? P(c.who) : null, pr = ARC_PRON[q ? q.g : 'X'] || ARC_PRON.X;
  const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
  const V = {
    who: q ? q.name : 'someone', who2: c.who2 !== null && c.who2 !== undefined && P(c.who2) ? P(c.who2).name : 'someone else',
    film: c.film !== null && c.film !== undefined && S.films[c.film] ? S.films[c.film].title : (c.title || 'the film'),
    co: c.co !== null && c.co !== undefined && S.companies[c.co] ? S.companies[c.co].name : 'the company',
    city: HUBS[S.me.hub] ? HUBS[S.me.hub].name : 'town', amt: fmtCash(c.amt || 0), amt2: fmtCash(c.amt2 || 0),
    role: q && ROLE_LABEL[q.role] ? ROLE_LABEL[q.role].toLowerCase() : 'colleague', job: S.me.jobs[0] ? S.me.jobs[0].t.toLowerCase() : 'your work',
    title: c.title || '', thing: c.thing || '', place: c.place || '',
    they: pr[0], them: pr[1], their: pr[2], They: cap(pr[0]), Their: cap(pr[2]), is: pr[3], was: pr[4], has: pr[5], s: pr[6]
  };
  // a word filled in at the start of a sentence gets a capital ("Your mother is home"); the rest of the text is left alone
  let out = String(s).replace(/\{(\w+)\}/g, (m, k, at, all) => { const v = V[k]; if (v === undefined) return m; return at === 0 || /[.!?]["”]? $/.test(all.slice(Math.max(0, at - 3), at)) ? cap(v) : v; });
  // contractions after a singular pronoun ("he've" → "he's")
  return out.replace(/\b([Hh]e|[Ss]he)'(ve|re)\b/g, "$1's").replace(/\b([Tt]hey)'s\b/g, "$1're");
}
// money that means something at your level: a share of what you have, inside a floor and ceiling (2027 dollars)
function arcAmt(lo, hi, frac = .08) { const v = clamp(Math.max(S.me.cash, 0) * frac, usd(lo), usd(hi)); const st = v >= 1e5 ? 5000 : v >= 1e4 ? 500 : 50; return Math.max(st, Math.round(v / st) * st); }
// who the story is about
function arcFriend(min = 10) { const L = aliveKnown().filter(id => opinion(id) > min && !(S.me.arcWho || {})[id]); return L.length ? ppick(L) : null; }
function arcKnown() { const L = aliveKnown().filter(id => !(S.me.arcWho || {})[id]); return L.length ? ppick(L) : null; }
function arcRel(s) { const L = aliveKnown().filter(id => relOf(id) === s); return L.length ? ppick(L) : null; }
function arcStranger(roles, near = 0) { const me = ME(), q = bestIn(S.me.hub, roles, q => -Math.abs(q.standing - me.standing - near) + prnd() * 25); return q && q.id !== S.me.id ? q.id : null; }
function arcMyFilm() { const j = S.me.jobs.find(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage >= 0 && S.films[j.film].stage <= 3); return j ? j.film : null; }
function arcHubFilm() { const L = []; for (let i = S.films.length - 1; i >= 0 && L.length < 40; i--) { const f = S.films[i]; if (f.hub === S.me.hub && f.stage >= 1 && f.stage <= 3) L.push(f.id); } return L.length ? ppick(L) : null; }
function arcHubCo(tier = 3) { const L = S.companies.filter(c => c.closed === null && c.hub === S.me.hub && c.tier <= tier && c.owner === undefined); return L.length ? ppick(L).id : null; }
function arcFilmPerson(f, key) { const F = S.films[f]; if (!F) return null; const v = key === 'lead' ? F.cast[0] : F[key]; return v !== null && v !== undefined && v !== S.me.id && P(v) ? v : null; }

const ARCS = [
  // ===================== starting out =====================
  { id: 'sublet', name: 'The Sublet', lv: [0, 2], mk: c => { c.who = arcFriend(5); c.amt = arcAmt(300, 900, .1); return c.who !== null && S.me.life !== 'house'; },
    stages: {
      a: { t: 'A room going cheap', x: '{who} is going away for two months and needs someone to keep {their} place alive: water the plants, feed a cat called Projector, forward the post. {amt} for the whole stretch, and it\'s twenty minutes closer to everything.',
        o: [{ k: 'take', l: 'Take it', cost: 'amt', ok: { t: 'You move in with one bag and a lamp. Projector ignores you completely. It\'s the best you\'ve slept in a year.', fx: { energy: 10, stress: -6, tie: 4 }, n: 'b', w: [2, 4] } },
          { k: 'haggle', l: 'Offer to do it for free, as a favour', ck: ['cha', 12], ok: { t: '"Honestly? Deal. Just don\'t let Projector near the curtains."', fx: { tie: 2, energy: 6 }, n: 'b', w: [2, 4] }, no: { t: '{They} laugh{s}, then realise{s} you meant it. A cousin gets the room instead.', fx: { tie: -2 }, end: 'You talked yourself out of a cheap room.' } },
          { k: 'pass', l: 'Stay where you are', ok: { t: 'You pass. {who} finds someone through a group chat within the hour.', end: 'You stayed put.' } }] },
      b: { t: 'The landlord', x: 'A man in a fleece knocks at 8 a.m. He\'s the landlord, and he did not know about any sublet. He has a clipboard. He wants to know who you are.',
        o: [{ k: 'charm', l: 'Charm him: you\'re the best tenant he\'s ever had', ck: ['cha', 13], ok: { t: 'Twenty minutes later he\'s telling you about his son\'s band. He leaves happy and slightly confused.', fx: { stress: -3 }, n: 'c', w: [2, 3] }, no: { t: 'He writes something on the clipboard. Underlines it. Leaves.', fx: { stress: 6 }, n: 'c', w: [1, 2] } },
          { k: 'call', l: 'Call {who} and let {them} handle it', ok: { t: '{who} picks up from an airport and handles it in four minutes flat. You owe {them} one.', fx: { tie: 1, trust: -2 }, n: 'c', w: [2, 3] } },
          { k: 'honest', l: 'Tell him the truth and offer to pay a little rent', cost: 120, ok: { t: 'He takes the money and shakes your hand. "Most people lie to me." You may have made a friend.', fx: { stress: -2 }, n: 'c', w: [2, 3] } }] },
      c: { t: '{who} is back', x: '{who} gets back to a clean flat, a fat cat and a stack of post. {They} want{s} to say thanks properly.',
        o: [{ k: 'dinner', l: 'Let {them} buy you dinner', ok: { t: 'A long dinner. {They} tell{s} you about a job {they} heard of, and promise{s} to put your name in.', fx: { tie: 6, energy: 4 }, end: 'You kept {who}\'s flat alive and came out of it a closer friend.', mile: 'Kept {who}\'s place running for two months' } },
          { k: 'intro', l: 'Ask for an introduction instead', ck: ['cha', 11], ok: { t: '{They} make{s} the call that night. You get a coffee with someone who actually hires people.', fx: { tie: 2, meet: 'known' }, end: 'Turned a favour into an introduction.' }, no: { t: '{They} promise{s} to "think about who". You don\'t hear more. Still: the cat liked you.', fx: { tie: 2 }, end: 'Looked after {who}\'s flat; the introduction never came.' } }] }
    } },
  { id: 'weekend_short', name: 'The Weekend Short', lv: [0, 2], mk: c => { c.who = arcFriend(0) ?? arcStranger(['director', 'writer'], -5); c.title = ppick(['Small Hours', 'The Last Bus', 'Salt', 'Lighthouse Rules', 'Tuesday People', 'Mothwing', 'The Understudy', 'Low Tide']); return c.who !== null; },
    stages: {
      a: { t: 'Three days, no money', x: '{who} is shooting a short called {title} this weekend. No budget, a borrowed camera, pizza on Saturday if the pizza place says yes. {They} need{s} hands, and {they} asked for you by name.',
        o: [{ k: 'in', l: 'You\'re in', ok: { t: '"Call time is six. Bring gaffer tape. Bring two rolls."', fx: { tie: 3, energy: -6 }, n: 'b', w: [1, 1] } },
          { k: 'lead', l: 'Only if you get a proper role on it', ck: ['cha', 12], ok: { t: '{They} think{s} about it and give{s} you a real title on the credits. Head of something.', fx: { tie: 1, energy: -6 }, n: 'b', w: [1, 1] }, no: { t: '"It\'s a short, not a studio." {They} find{s} someone else.', fx: { tie: -3 }, end: 'Held out for a title on a no-budget short. Didn\'t get it.' } },
          { k: 'no', l: 'Your weekend is your weekend', ok: { t: 'You sleep in. On Monday the photos go up and everyone looks like they had the time of their lives.', end: 'Sat out {who}\'s short.' } }] },
      b: { t: 'Day two falls apart', x: 'Saturday, 3 p.m. The location owner wants you out by five, the lead actor has a wedding at seven, and three scenes are left. {who} is staring at the shot list like it owes {them} money.',
        o: [{ k: 'cut', l: 'Rewrite on the spot: cut it to one scene', ck: ['vis', 13], ok: { t: 'You find a way to fold three scenes into one long take. It\'s the best thing in the film. Everyone knows whose idea it was.', fx: { stand: 1, tie: 5, xp: { struc: .3 } }, n: 'c', w: [6, 10] }, no: { t: 'The one-take idea eats ninety minutes and doesn\'t cut together. You lose the scene.', fx: { stress: 5 }, n: 'c', w: [6, 10] } },
          { k: 'owner', l: 'Talk the owner into another two hours', ck: ['cha', 14], ok: { t: 'A signed poster, a promise of a thanks credit and your best smile. You get the two hours.', fx: { tie: 4 }, n: 'c', w: [6, 10] }, no: { t: 'He calls the police non-emergency line, which is impressive. You leave at five sharp.', fx: { stress: 6 }, n: 'c', w: [6, 10] } },
          { k: 'calm', l: 'Get everyone fed and calm first', ok: { t: 'Ten minutes, a pizza, a breath. The rest of the day goes faster because nobody\'s panicking.', fx: { tie: 3, stress: -2 }, n: 'c', w: [6, 10] } }] },
      c: { t: '{title} gets a screening', x: '{title} has been picked for a local shorts night. {who} wants you up on stage for the Q&A afterwards.',
        o: [{ k: 'stage', l: 'Go up and talk about it', ck: ['cha', 12], ok: { t: 'You get a laugh and a question from a programmer who stays to chat. {title} gets a small run of festival invitations.', fx: { fame: 2, stand: 1, tie: 3, meet: 'known' }, end: 'Made {title} with {who}; it played festivals.', mile: 'Your short {title} screened in {city}' }, no: { t: 'You freeze on the first question and say "lenses" four times. The film plays well anyway.', fx: { tie: 2 }, end: 'Made {title} with {who}; you froze at the Q&A, the film didn\'t.' } },
          { k: 'back', l: 'Watch from the back', ok: { t: 'The crowd laughs in the right places. Nobody knows you\'re there, which is half the fun.', fx: { tie: 2, stress: -3 }, end: 'Helped {who} make {title}.' } }] }
    } },
  { id: 'missing_credit', name: 'The Missing Credit', lv: [1, 3], mk: c => { const p = (S.me.past || []).slice().reverse().find(p => p.film !== null && p.film !== undefined && S.films[p.film] && S.films[p.film].stage >= 3); if (!p) return false; c.film = p.film; c.who = arcFilmPerson(p.film, 'prod') ?? arcFilmPerson(p.film, 'dir'); return c.who !== null; },
    stages: {
      a: { t: 'Where\'s your name?', x: 'Someone sends you a photo of the end credits of {film}. Every name from your department is there. Yours isn\'t.',
        o: [{ k: 'email', l: 'Email {who}, politely', ck: ['com', 11], ok: { t: '{They} reply{s} within the hour: an error at the vendor, being fixed for the final masters.', fx: { trust: 3 }, n: 'b', w: [2, 3] }, no: { t: 'No reply. Then an auto-response: {who} is "away until after the festival".', fx: { stress: 4 }, n: 'b', w: [2, 3] } },
          { k: 'guild', l: 'Go straight to the union rep', ck: ['cha', 13], ok: { t: 'The rep loves this kind of thing. A stern letter goes out on letterhead.', fx: { tie: -2, stand: .5 }, n: 'b', w: [2, 3] }, no: { t: 'The rep says it\'s "not really a union matter" and asks if you\'ve paid your dues.', fx: { stress: 4 }, n: 'b', w: [2, 3] } },
          { k: 'let', l: 'Let it go. It\'s one credit.', ok: { t: 'You let it go. It still stings when the film comes up.', fx: { stress: 3 }, end: 'Let a missing credit on {film} go.' } }] },
      b: { t: 'The final masters', x: 'The final version of {film} is locked. Somebody on the post team has a copy of the credit list.',
        o: [{ k: 'check', l: 'Ask to see it before it ships', ck: ['cha', 12], ok: { t: 'Your name is there, spelled right, in the correct department. You exhale for the first time in two weeks.', fx: { stand: .5, stress: -4 }, end: 'Fought for your credit on {film} and got it.' }, no: { t: 'You get your name, but in "Additional Crew", below the caterer.', fx: { stand: .2 }, end: 'Got your name onto {film}, if not where it belonged.' } },
          { k: 'trust', l: 'Trust that it\'s fixed', ok: { t: 'It\'s fixed. Mostly. Your surname has an extra L in it now.', fx: { stress: -2 }, end: 'Your credit on {film} came back with a typo.' } }] }
    } },
  { id: 'the_loan', name: 'The Loan', lv: [0, 4], mk: c => { c.who = arcFriend(15); c.amt = arcAmt(250, 6000, .12); return c.who !== null && S.me.cash > c.amt * 2; },
    stages: {
      a: { t: '{who} needs money', x: '{who} calls instead of texting, which is how you know. {They} need{s} {amt} to cover rent until a payment comes through. {They} swear{s} it\'s three weeks, tops.',
        o: [{ k: 'lend', l: 'Lend it', cost: 'amt', ok: { t: '{They} go{s} quiet, then: "I won\'t forget this."', fx: { tie: 6, trust: 3 }, n: 'b', w: [3, 6] } },
          { k: 'half', l: 'Lend half and say why', cost: 'amt2', ok: { t: 'You send half and explain. {They} understand{s}, and the money comes back a month later with a card that just says "you\'re a good one".', fx: { tie: 3, cash: 'amt2' }, end: 'Lent {who} half of what {they} asked; it came back.' } },
          { k: 'no', l: 'Say you can\'t', ok: { t: '"No, totally. Forget I asked." You both pretend that\'s possible.', fx: { tie: -5 }, end: 'Said no when {who} needed money.' } }] },
      b: { t: 'Three weeks later', x: 'Three weeks have become five. {who} hasn\'t mentioned the money, but {they} did post photos from a wedding in another country.',
        o: [{ k: 'ask', l: 'Ask about it directly', ck: ['cha', 12], ok: { t: '{They}\'re mortified. The money arrives that night, with a little extra and a long apology.', fx: { cash: 'amt', tie: 1 }, n: 'c', w: [4, 8] }, no: { t: 'It gets awkward fast. {They} send{s} half and stop{s} replying.', fx: { cash: 'amt2', tie: -6 }, end: 'Got some of your money back from {who}, and lost some of the friendship.' } },
          { k: 'wait', l: 'Give it more time', ck: ['com', 12], ok: { t: 'The money arrives two weeks later, with a bottle of something expensive.', fx: { cash: 'amt', tie: 4 }, n: 'c', w: [4, 8] }, no: { t: 'Nothing. You stop expecting it.', fx: { stress: 3 }, end: 'Lent {who} money that never came back.' } }] },
      c: { t: 'Paying it forward', x: '{who} calls again, but this time it\'s good news: {they}\'ve landed something steady, and {they} want{s} to return the favour.',
        o: [{ k: 'job', l: 'Ask {them} to keep an ear out for work', ok: { t: 'Within the month {they}\'ve put your name in three times. One of them sticks as a meeting.', fx: { tie: 4, meet: 'known' }, end: 'Lent {who} money; it came back as work.', mile: 'Helped {who} through a rough month' } },
          { k: 'drinks', l: 'Just let {them} buy the drinks', ok: { t: 'A very long night. You\'re closer than you\'ve been in years.', fx: { tie: 8, energy: -5 }, end: 'Lent {who} money and got a better friend back.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt / 2); } },
  { id: 'same_job', name: 'The Same Job', lv: [1, 4], mk: c => { c.who = arcRel('rival') ?? arcStranger([ME().role], 2); c.co = arcHubCo(3); return c.who !== null && c.co !== null; },
    stages: {
      a: { t: 'Two names on the list', x: 'You\'re on the shortlist for a good job at {co}. So is {who}. Everyone knows. The final interviews are next week.',
        o: [{ k: 'prep', l: 'Prepare like your life depends on it', ok: { t: 'You read everything the company has made in five years and come in with notes.', fx: { energy: -6, xp: { vis: .2 } }, n: 'b', w: [1, 1] } },
          { k: 'gossip', l: 'Let it be known {who} is "difficult"', ck: ['cha', 14], ok: { t: 'The rumour moves quietly and lands where you aimed it.', fx: { tie: -6 }, n: 'b2', w: [1, 1] }, no: { t: 'The rumour gets traced back to you in about a day. {who} is furious, and so is {co}.', fx: { tie: -12, stand: -1 }, end: 'Tried to knife {who} for a job at {co} and got caught.' } },
          { k: 'coffee', l: 'Ask {who} for a coffee', ok: { t: 'An odd, honest hour. You both admit you want it. You both admit the other might be better for it.', fx: { tie: 6 }, n: 'b', w: [1, 1] } }] },
      b: { t: 'The final interview', x: 'The final interview at {co}: three people, one of them eating an apple very slowly the whole time.',
        o: [{ k: 'vision', l: 'Pitch them a big idea', ck: ['vis', 14], ok: { t: 'The apple stops halfway to their mouth. That\'s how you know.', fx: { stand: 1 }, n: 'c', w: [1, 2] }, no: { t: 'Your idea is big, and so is the silence afterwards.', n: 'd', w: [1, 2] } },
          { k: 'safe', l: 'Show them you\'re reliable', ck: ['com', 12], ok: { t: 'Calm, prepared and precise. They like calm.', n: 'c', w: [1, 2] }, no: { t: 'You say "I\'m a team player" twice. They write something down.', n: 'd', w: [1, 2] } }] },
      b2: { t: 'The final interview', x: 'You walk into the final interview at {co} knowing the rumour has done its work. The panel asks how you get on with other people.',
        o: [{ k: 'smooth', l: 'Answer smoothly', ck: ['cha', 13], ok: { t: 'You\'re smooth. Very smooth.', n: 'c', w: [1, 2] }, no: { t: 'One of them knows {who}. It\'s a short interview.', n: 'd', w: [1, 2] } }] },
      c: { t: 'They chose you', x: '{co} calls: it\'s yours. A few minutes later, a text from {who}.',
        o: [{ k: 'gracious', l: 'Reply graciously', ok: { t: '"Congrats. Seriously. You\'ll be good at it." You save the message.', fx: { tie: 6, stand: 1 }, end: 'Beat {who} to the job at {co} and stayed on good terms.', mile: 'Won a shortlist against {who} at {co}' } },
          { k: 'gloat', l: 'Reply with a single emoji', ok: { t: 'The emoji is a trophy. {who} screenshots it and sends it to everyone. You\'re now that person, but you\'re also hired.', fx: { tie: -8, stand: 1, fame: 1 }, end: 'Beat {who} at {co} and enjoyed it a bit too much.', mile: 'Won a shortlist against {who} at {co}' } }] },
      d: { t: 'They chose {who}', x: '{co} chose {who}. The email is kind and very short.',
        o: [{ k: 'congrats', l: 'Send {who} congratulations', ok: { t: '{They} write{s} back: "Next one\'s yours. I\'ll put your name in when we\'re hiring." A month later, {they} do.', fx: { tie: 8, meet: 'known' }, end: 'Lost a job to {who} and gained an ally.' } },
          { k: 'sulk', l: 'Go for a long, angry run', ok: { t: 'Nine miles. Your knees file a complaint. You feel better.', fx: { stress: -6, energy: -6 }, end: 'Lost a job at {co} to {who}.' } }] }
    } },
  { id: 'the_clip', name: 'The Clip', lv: [0, 3], fields: ['film', 'creator', 'music', 'stage', 'podcast'], mk: c => { c.thing = ppick(['explaining a lens to a pigeon', 'doing a perfect impression of a famous director at the craft table', 'catching a falling light stand without spilling your coffee', 'giving a dramatic speech to a vending machine', 'dancing badly to the playback track between takes']); return true; },
    stages: {
      a: { t: 'You\'re a video now', x: 'Someone filmed you {thing}. Forty thousand views overnight. Your phone is warm.',
        o: [{ k: 'ride', l: 'Lean in: post a follow-up', ck: ['cha', 13], ok: { t: 'The follow-up does even better. People know your name, or at least your face.', fx: { fame: 4, stand: .5 }, n: 'b', w: [2, 3] }, no: { t: 'The sequel is trying too hard, and the comments say so.', fx: { fame: 1, stress: 4 }, n: 'b', w: [2, 3] } },
          { k: 'ignore', l: 'Say nothing and let it pass', ok: { t: 'It passes in a week. Mostly.', fx: { fame: 1 }, n: 'b', w: [2, 3] } },
          { k: 'down', l: 'Ask for it to be taken down', ck: ['com', 12], ok: { t: 'It comes down. A few copies live on forever, as copies do.', end: 'Got your viral moment taken down.' }, no: { t: 'Asking for it to come down becomes its own video.', fx: { fame: 2, stress: 5 }, n: 'b', w: [2, 3] } }] },
      b: { t: 'An offer, sort of', x: 'A brand of energy drinks wants you in an ad "in the spirit of the clip". The money is real. The drink tastes like a battery.',
        o: [{ k: 'take', l: 'Take the money', ok: { t: 'One day of filming, a cheque, and a fridge full of the drink. People in the business roll their eyes. Your landlord doesn\'t.', fx: { cash: 2500, fame: 2, stand: -.5 }, end: 'Turned a viral clip into an energy drink ad.', mile: 'Went viral, then did an ad about it' } },
          { k: 'counter', l: 'Counter: double, and creative control', ck: ['cha', 15], ok: { t: 'They say yes. You make a strange, funny little ad that people actually share.', fx: { cash: 5000, fame: 3, stand: .5 }, end: 'Went viral and made a genuinely good ad out of it.', mile: 'Went viral and made an ad people liked' }, no: { t: 'They go with a mime instead.', end: 'Went viral, turned down a drink ad, and a mime took it.' } },
          { k: 'no', l: 'Turn it down', ok: { t: 'You turn it down. A director you admire mentions the clip at a party and says you have "good instincts". Worth more.', fx: { stand: .5, meet: 'director' }, end: 'Went viral, said no to the money, and got noticed for it.' } }] }
    } },
  // ===================== the middle years =====================
  { id: 'the_leak', name: 'The Leak', lv: [2, 5], mk: c => { c.film = arcMyFilm(); if (c.film === null) return false; c.who = arcFilmPerson(c.film, 'prod') ?? arcFilmPerson(c.film, 'dir'); c.who2 = arcFilmPerson(c.film, 'dp') ?? arcFilmPerson(c.film, 'ed'); return c.who !== null && c.who2 !== null && c.who2 !== c.who; },
    stages: {
      a: { t: 'Pages online', x: 'Twelve pages of the {film} script are on a fan forum, with your department\'s watermark on them. {who} wants everyone in a room at nine.',
        o: [{ k: 'help', l: 'Offer to help find the source', ck: ['eth', 12], ok: { t: 'You spend a night comparing watermarks and timestamps. You find something.', fx: { trust: 4, energy: -6 }, n: 'b', w: [1, 2] }, no: { t: 'You spend a night comparing watermarks and find nothing but a headache.', fx: { energy: -6 }, n: 'c', w: [1, 2] } },
          { k: 'quiet', l: 'Keep your head down', ok: { t: 'You say as little as possible in the meeting. People notice who\'s quiet, though.', fx: { stress: 3 }, n: 'c', w: [1, 2] } }] },
      b: { t: 'The watermark', x: 'The watermark on the leaked pages matches a copy signed out to {who2}. You\'re the only one who knows.',
        o: [{ k: 'tell', l: 'Tell {who}', ok: { t: '{who2} is off the film by lunchtime. {who} thanks you quietly. Some of the crew stop talking when you walk in.', fx: { trust: 6, tie: 4, tie2: -15, stand: .5 }, end: 'Found the leak on {film} and reported it.', mile: 'Found the leak on {film}' } },
          { k: 'confront', l: 'Talk to {who2} first', ck: ['cha', 13], ok: { t: '{who2} breaks down: a fan they met online, a promise of nothing. They go to {who} themselves. The film keeps them on, just.', fx: { tie2: 8, trust: 3, stand: .5 }, end: 'Got {who2} to own up to the leak on {film}.' }, no: { t: '{who2} denies everything and tells three people you\'re trying to frame them.', fx: { tie2: -10, stress: 6 }, n: 'c', w: [1, 2] } },
          { k: 'bury', l: 'Say nothing', ok: { t: 'You keep it to yourself. Nobody ever finds the source. You think about it more than you\'d like.', fx: { stress: 4, tie2: 3 }, end: 'Knew who leaked {film} and kept it quiet.' } }] },
      c: { t: 'The suspicion', x: 'With no culprit, the suspicion spreads. Someone mentions that your department had the most copies.',
        o: [{ k: 'calm', l: 'Stay calm and keep working', ck: ['com', 13], ok: { t: 'The story moves on without you. A month later nobody remembers.', end: 'Rode out the leak on {film}.' }, no: { t: 'You snap at someone in a meeting. It doesn\'t look great.', fx: { stand: -.5, stress: 5 }, end: 'Rode out the leak on {film}, not very calmly.' } },
          { k: 'loud', l: 'Defend yourself loudly', ck: ['cha', 14], ok: { t: 'You make such a clear, furious case that people apologise to you.', fx: { stand: .5 }, end: 'Defended yourself during the leak on {film}, and won.' }, no: { t: 'The louder you are, the guiltier you look.', fx: { stand: -1, tie: -4 }, end: 'Shouted your innocence during the {film} leak. It didn\'t help.' } }] }
    } },
  { id: 'difficult_star', name: 'The Difficult Star', lv: [2, 5], mk: c => { c.film = arcMyFilm(); if (c.film === null) return false; c.who = arcFilmPerson(c.film, 'lead'); c.who2 = arcFilmPerson(c.film, 'dir'); return c.who !== null && c.who2 !== null && P(c.who).standing > ME().standing; },
    stages: {
      a: { t: 'A problem in the trailer', x: '{who}, the lead on {film}, won\'t come out of {their} trailer. {They} {has} sent word that {they} will only talk to "someone who isn\'t scared of me". The AD looks at you.',
        o: [{ k: 'go', l: 'Knock on the door', ck: ['cha', 14], ok: { t: 'Twenty minutes, one honest conversation about a scene {they} hate{s}, and {they}\'re on set. {who} remembers who knocked.', fx: { tie: 8, stand: 1 }, n: 'b', w: [2, 4] }, no: { t: 'The door opens, closes, and you hear the word "who" shouted at volume.', fx: { tie: -4, stress: 5 }, n: 'b', w: [2, 4] } },
          { k: 'dir', l: 'Go and get {who2}', ok: { t: '{who2} goes in. It takes two hours. The day runs over.', fx: { stress: 3 }, n: 'b', w: [2, 4] } }] },
      b: { t: 'The scene', x: 'The scene {who} hated is today. {They}\'ve rewritten {their} own lines on the back of a sandwich bag, and {who2} is pretending not to see.',
        o: [{ k: 'back', l: 'Back {who}\'s version', ck: ['tas', 13], ok: { t: 'The sandwich-bag version is better. {who2} grudgingly agrees. {who} won\'t stop saying your name.', fx: { tie: 6, tie2: -2 }, n: 'c', w: [8, 14] }, no: { t: 'It isn\'t better. {who2} is furious with you for encouraging it.', fx: { tie2: -6 }, n: 'c', w: [8, 14] } },
          { k: 'script', l: 'Side with the script', ck: ['com', 12], ok: { t: 'You quietly help {who2} hold the line. The scene plays as written, and it works.', fx: { tie2: 6, tie: -3 }, n: 'c', w: [8, 14] }, no: { t: 'You get caught between them. Everyone\'s a bit annoyed with you.', fx: { tie: -3, tie2: -3 }, n: 'c', w: [8, 14] } }] },
      c: { t: 'Months later', x: '{who} is promoting {film} on a talk show and gets asked about the shoot.',
        o: [{ k: 'watch', l: 'Watch it', ok: { t: c => opinion(c.who) > 10 ? '{They} tell{s} a story about "one person on the crew who wasn\'t scared of me". It\'s you. It goes round the industry like a rumour, the good kind.' : '{They} say{s} the shoot was "a family". You laugh out loud alone in your kitchen.', fx: { fame: 1 }, end: 'Survived {who} on {film}.' } }] }
    } },
  { id: 'headhunter', name: 'The Headhunter', lv: [2, 6], mk: c => { if (!S.me.jobs.length) return false; c.co = arcHubCo(2); c.who = arcStranger(['producer'], 10); c.amt = arcAmt(3000, 60000, .2); return c.co !== null && c.who !== null; },
    stages: {
      a: { t: 'A lunch you didn\'t ask for', x: '{who} from {co} wants lunch. {They} {is} very clear it\'s "just lunch". It is not just lunch.',
        o: [{ k: 'go', l: 'Go to lunch', ok: { t: 'They want you, and they\'ve done their homework. They\'ll beat your rate by {amt} a year if you start in a month.', fx: { meet: null }, n: 'b', w: [1, 2] } },
          { k: 'no', l: 'Decline politely', ok: { t: 'You decline. Somehow your current boss hears that you were asked, and likes that you said no.', fx: { stand: .5 }, end: 'Turned down a lunch with {co}.' } }] },
      b: { t: 'The counter-offer', x: 'You could take the {co} offer to your current people and see what they do.',
        o: [{ k: 'leverage', l: 'Use it as leverage', ck: ['cha', 14], ok: { t: 'Your current people match it and give you a better title. {co} sends a polite email that says "we\'ll be back".', fx: { cash: 'amt2', stand: 1 }, end: 'Used {co}\'s offer to get a raise.', mile: 'Got a counter-offer and a raise' }, no: { t: 'They call your bluff. "We\'d hate to lose you, but we understand." Now you have to decide for real.', fx: { stress: 6 }, n: 'c', w: [1, 1] } },
          { k: 'loyal', l: 'Tell {co} no, and say nothing at work', ok: { t: 'You stay. Nobody knows what you turned down except you, and that\'s fine.', fx: { stress: -2 }, end: 'Turned down {co} out of loyalty.' } },
          { k: 'jump', l: 'Think seriously about jumping', ok: { t: 'You take a week to think.', n: 'c', w: [1, 1] } }] },
      c: { t: 'Decide', x: '{co} needs an answer by Friday.',
        o: [{ k: 'go', l: 'Take the job at {co}', ok: { t: 'You hand in your notice. It\'s awkward and then it\'s done. {co} gives you a welcome lunch, which is just lunch.', fx: { cash: 'amt2', stand: 1, tie: 6, meet: 'known' }, end: 'Was headhunted by {co}.', mile: 'Headhunted by {co}' } },
          { k: 'stay', l: 'Stay', ok: { t: 'You stay. A month later your boss quietly gives you more responsibility, which feels like a thank-you.', fx: { stand: .5 }, end: 'Stayed put when {co} came calling.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt * .5); } },
  { id: 'set_romance', name: 'Something on Set', lv: [1, 5], need: () => partnerOf() === null, mk: c => { const f = arcMyFilm(); if (f === null) return false; const F = S.films[f]; const L = [F.dp, F.ed, F.dir, F.wri, ...(F.cast || []).slice(0, 4)].filter(id => id !== null && id !== undefined && id !== S.me.id && P(id) && !P(id).dead && typeof canRomance === 'function' && canRomance(id)); if (!L.length) return false; c.film = f; c.who = ppick(L); return true; },
    stages: {
      a: { t: 'Lunch, again', x: 'This is the fourth day running you and {who} have ended up eating lunch together on {film}. Nobody planned it. Everybody has noticed.',
        o: [{ k: 'ask', l: 'Ask {them} out properly', ck: ['cha', 12], ok: { t: '{They} say{s} yes before you finish the sentence.', fx: { tie: 8 }, n: 'b', w: [1, 2] }, no: { t: '{They} like{s} you, but not like that, and says so kindly. Lunch is weird for two days and then fine.', fx: { tie: 2 }, end: 'Asked {who} out on {film}. It was a no, nicely.' } },
          { k: 'slow', l: 'Let it happen slowly', ok: { t: 'You let it happen slowly. Then quickly.', fx: { tie: 6 }, n: 'b', w: [2, 3] } },
          { k: 'work', l: 'Keep it professional', ok: { t: 'You start eating at your desk. It\'s for the best, probably.', end: 'Kept things professional with {who}.' } }] },
      b: { t: 'The crew knows', x: 'You and {who} are seeing each other, and the crew of {film} has a betting pool on it.',
        o: [{ k: 'open', l: 'Be open about it', ck: ['com', 11], ok: { t: 'Nobody cares as much as you feared. Somebody wins forty dollars.', fx: { tie: 4, rel: 'partner' }, n: 'c', w: [8, 16] }, no: { t: 'A producer has "a quick word" about professionalism. It\'s mortifying, but you survive it.', fx: { stress: 5, rel: 'partner' }, n: 'c', w: [8, 16] } },
          { k: 'secret', l: 'Keep it secret until the wrap', ck: ['com', 14], ok: { t: 'You pull it off. At the wrap party you hold hands and three people scream.', fx: { tie: 6, rel: 'partner' }, n: 'c', w: [8, 16] }, no: { t: 'You\'re caught kissing behind the honeywagon by the entire camera department.', fx: { stress: 4, rel: 'partner' }, n: 'c', w: [8, 16] } }] },
      c: { t: 'After the wrap', x: 'The film\'s over. You and {who} have to work out what you are without it.',
        o: [{ k: 'stay', l: 'Make it real', ck: ['col', 12], ok: { t: 'You make it real: a key to each other\'s places, a toothbrush, a terrible shared playlist.', fx: { tie: 10, stress: -5 }, end: 'Met {who} on {film}. You\'re still together.', mile: 'Fell for {who} on {film}' }, no: { t: 'Without the film it doesn\'t quite hold. You end it as friends, more or less.', fx: { rel: 'ex', stress: 4 }, end: 'Fell for {who} on {film}; it ended with the shoot.' } },
          { k: 'end', l: 'Call it a set romance', ok: { t: 'You both agree it was perfect for what it was.', fx: { rel: 'friend' }, end: 'A set romance with {who} on {film}.' } }] }
    } },
  { id: 'the_room', name: 'The Room', lv: [2, 6], mk: c => { c.co = arcHubCo(2); c.who = arcStranger(['producer'], 12); c.title = ((S.me.scripts || []).filter(s => s.grade).slice(-1)[0] || {}).title || ppick(['Night Ferry', 'The Glass Orchard', 'Dog Years', 'Second Unit', 'The Quiet Coast']); return c.co !== null && c.who !== null; },
    stages: {
      a: { t: 'A meeting at {co}', x: '{who} at {co} has heard about {title} and wants you in the room on Thursday. Fifteen minutes. Bring your best version.',
        o: [{ k: 'deck', l: 'Build a beautiful pitch deck', ck: ['tas', 12], ok: { t: 'The deck is gorgeous: stills, colour, a page of comparisons that make sense.', fx: { energy: -5 }, n: 'b', w: [1, 1] }, no: { t: 'The deck is forty slides. You know it\'s too long, and you can\'t stop.', fx: { energy: -8 }, n: 'b', w: [1, 1] } },
          { k: 'talk', l: 'No deck. Just tell them the story.', ok: { t: 'You rehearse it out loud on long walks until it sounds like you.', n: 'b', w: [1, 1] } }] },
      b: { t: 'Fifteen minutes', x: 'You\'re in. {who}, two executives and a junior with a laptop. Someone\'s phone buzzes on the table. You begin.',
        o: [{ k: 'heart', l: 'Open with why it matters to you', ck: ['cha', 14], ok: { t: 'The junior with the laptop stops typing. That\'s the moment. They ask for the script.', fx: { stand: 1, tie: 6 }, n: 'c', w: [3, 6] }, no: { t: 'It\'s heartfelt, and they glance at the clock.', fx: { tie: 2 }, n: 'd', w: [2, 4] } },
          { k: 'market', l: 'Open with the audience and the numbers', ck: ['vis', 13], ok: { t: 'Everyone sits up when you mention what similar films made. They ask what it would cost.', fx: { stand: 1 }, n: 'c', w: [3, 6] }, no: { t: 'They know the numbers better than you do, and say so.', n: 'd', w: [2, 4] } }] },
      c: { t: 'They want to develop it', x: '{co} wants {title}. Not a green light: a development deal. Some money, lots of notes, no promises.',
        o: [{ k: 'yes', l: 'Take the deal', ok: { t: 'You sign. The notes start the next morning.', fx: { cash: 4000, stand: 1.5, fame: 1 }, end: 'Pitched {title} to {co} and got a development deal.', mile: 'Development deal for {title} at {co}' } },
          { k: 'shop', l: 'Shop it around first', ck: ['cha', 15], ok: { t: 'Two other companies get interested. {co} doubles the offer.', fx: { cash: 8000, stand: 2, fame: 1 }, end: 'Played {co} against two rivals and got {title} a better deal.', mile: 'Development deal for {title} at {co}' }, no: { t: 'Nobody else bites, and {co} has moved on to another project by the time you call back.', fx: { stress: 6 }, end: 'Pitched {title} well, then lost it by shopping it around.' } }] },
      d: { t: 'A pass', x: '{co} passes on {title}. The email says "not right for us at this time", which means no.',
        o: [{ k: 'notes', l: 'Ask {who} what didn\'t work', ck: ['cha', 11], ok: { t: '{They} give{s} you ten honest minutes on the phone. It\'s worth more than most yeses.', fx: { tie: 4, xp: { struc: .3 } }, end: 'Got a pass on {title}, and real notes.' }, no: { t: 'No reply. You frame the rejection email as a joke. Then take it down.', end: 'Pitched {title} to {co}. A pass.' } },
          { k: 'move', l: 'Move on', ok: { t: 'You move on. The next room is already in your calendar.', end: 'Pitched {title} to {co}. A pass.' } }] }
    } },
  { id: 'profile', name: 'The Profile', lv: [3, 7], mk: c => { c.who = arcStranger(['writer'], 0); c.place = ppick(['a trade magazine', 'a weekend supplement', 'a culture podcast', 'a big-city paper']); return c.who !== null && (ME().fame || 0) >= 3; },
    stages: {
      a: { t: 'A journalist calls', x: '{who}, writing for {place}, wants to profile you: two lunches, a day following you around, a photographer.',
        o: [{ k: 'yes', l: 'Say yes', ok: { t: 'The first lunch is easy. {They} laugh{s} at all the right moments, which is how you know {they}\'re good at this.', n: 'b', w: [1, 2] } },
          { k: 'terms', l: 'Say yes, with conditions', ck: ['cha', 12], ok: { t: 'Approval on photos, no questions about family. {They} agree{s}, a bit too easily.', n: 'b', w: [1, 2] }, no: { t: '"I don\'t do approval." You do the interview anyway.', n: 'b', w: [1, 2] } },
          { k: 'no', l: 'Decline', ok: { t: 'You decline. {They} write{s} a short piece anyway, built from other people\'s quotes. It\'s fine.', end: 'Declined a profile in {place}.' } }] },
      b: { t: 'The off-the-record question', x: 'Third glass of wine. {who} puts down {their} pen and asks what you really think of someone very famous you\'ve worked with. "Just between us."',
        o: [{ k: 'honest', l: 'Tell the truth', ck: ['com', 15], ok: { t: 'You tell a funny, kind, true story. It makes the piece, and the famous person sends you flowers.', fx: { fame: 3, stand: 1 }, n: 'c', w: [3, 5] }, no: { t: 'You\'re too honest. It\'s the headline.', fx: { fame: 4, stand: -1.5, stress: 8 }, n: 'c', w: [3, 5] } },
          { k: 'deflect', l: 'Deflect with a joke', ck: ['cha', 12], ok: { t: 'The joke ends up as the pull quote. People love it.', fx: { fame: 2, stand: .5 }, n: 'c', w: [3, 5] }, no: { t: 'The joke reads badly in print.', fx: { fame: 1 }, n: 'c', w: [3, 5] } }] },
      c: { t: 'It\'s out', x: 'The profile is out in {place}. Your mother has bought six copies.',
        o: [{ k: 'read', l: 'Read it', ok: { t: c => S.me.stress > 50 ? 'You read it twice. They made you sound tired, which you are.' : 'You read it twice. They made you sound like someone you\'d want to work with.', fx: { fame: 1 }, end: 'Profiled in {place}.', mile: 'Profiled in {place}' } },
          { k: 'dont', l: 'Don\'t read it', ok: { t: 'You don\'t read it. Everyone tells you what it says anyway.', fx: { stress: -2 }, end: 'Profiled in {place}; you never read it.' } }] }
    } },
  { id: 'walkout', name: 'The Walkout', lv: [1, 5], mk: c => { c.film = arcMyFilm(); if (c.film === null) return false; c.who = arcFilmPerson(c.film, 'prod'); return c.who !== null; },
    stages: {
      a: { t: 'Fourteen-hour days', x: 'The crew of {film} has done fourteen-hour days for three weeks. There\'s talk of a walkout at lunch tomorrow unless turnaround is respected.',
        o: [{ k: 'crew', l: 'Side with the crew', ok: { t: 'You put your name on the letter. So do forty other people.', fx: { stand: .5, tie: -3 }, n: 'b', w: [1, 1] } },
          { k: 'mediate', l: 'Try to broker a deal with {who}', ck: ['cha', 14], ok: { t: '{who} agrees to cap days at twelve if the crew skips the walkout. Both sides think you were on theirs.', fx: { tie: 4, stand: 1 }, end: 'Brokered a deal between the crew and {who} on {film}.', mile: 'Stopped a walkout on {film}' }, no: { t: '{who} hears "negotiation" and calls the studio. Things get worse.', fx: { tie: -4, stress: 5 }, n: 'b', w: [1, 1] } },
          { k: 'stay', l: 'Stay out of it', ok: { t: 'You keep your head down and your mouth shut.', n: 'b', w: [1, 1] } }] },
      b: { t: 'Lunch, tomorrow', x: 'Lunch. Half the crew is standing by the gate. The other half is watching to see who goes.',
        o: [{ k: 'walk', l: 'Walk', ok: { t: 'It lasts four hours. Turnaround is restored by evening, in writing.', fx: { stand: .5, tie: -4, stress: -3 }, end: 'Walked out with the crew of {film}, and won.' } },
          { k: 'work', l: 'Keep working', ok: { t: 'You keep working. {who} notices. So does everyone at the gate.', fx: { tie: 5, stand: -.5 }, end: 'Kept working during the {film} walkout.' } }] }
    } },
  { id: 'too_familiar', name: 'Too Familiar', lv: [2, 6], need: () => (S.me.scripts || []).some(s => s.grade), mk: c => { c.film = arcHubFilm(); c.title = (S.me.scripts || []).filter(s => s.grade).slice(-1)[0].title; c.who = c.film !== null ? arcFilmPerson(c.film, 'wri') ?? arcFilmPerson(c.film, 'dir') : null; return c.who !== null; },
    stages: {
      a: { t: 'That\'s your idea', x: 'The trailer for {film} has just dropped, and it looks a lot like {title}: the same twist, a very similar ending. {who} wrote it. You sent {title} around last year.',
        o: [{ k: 'lawyer', l: 'Call a lawyer', cost: 600, ok: { t: 'The lawyer listens and asks for every email you ever sent with {title} attached.', n: 'b', w: [2, 3] } },
          { k: 'call', l: 'Call {who} directly', ck: ['cha', 13], ok: { t: '{who} is genuinely shaken. {They} never saw your script, {they} say{s}, but {they} want{s} to talk.', fx: { tie: 3 }, n: 'c', w: [1, 2] }, no: { t: '{who} hangs up on you, then blocks your number.', fx: { tie: -8 }, n: 'b', w: [1, 2] } },
          { k: 'let', l: 'Ideas are in the air. Let it go.', ok: { t: 'You let it go, and quietly rewrite {title} to be stranger and better.', fx: { xp: { struc: .4 } }, end: '{film} looked a lot like {title}. You rewrote yours.' } }] },
      b: { t: 'The paper trail', x: 'Your lawyer has found an email: someone at {who}\'s agency downloaded {title} eleven months ago.',
        o: [{ k: 'settle', l: 'Push for a quiet settlement', ck: ['cha', 14], ok: { t: 'A cheque and a "story consultant" credit, and an agreement nobody talks about it.', fx: { cash: 12000, stand: 1 }, end: 'Settled with {who} over {film}.', mile: 'Settled a story claim over {film}' }, no: { t: 'Their side says the downloader never opened it. Your lawyer sends a final bill.', fx: { cash: -900, stress: 6 }, end: 'Went after {who} over {film}; it went nowhere.' } },
          { k: 'public', l: 'Go public', ck: ['com', 15], ok: { t: 'The trades run it. People take your side, and the film\'s opening suffers for it.', fx: { fame: 3, stand: .5, tie: -12 }, end: 'Went public about {film} and {title}.' }, no: { t: 'You\'re cast as bitter. The film does fine.', fx: { stand: -1, tie: -12, stress: 6 }, end: 'Went public about {film}; it backfired.' } }] },
      c: { t: 'Coffee with {who}', x: '{who} wants to meet. {They}\'ve read {title} now, and {they} {is} rattled by how close it is.',
        o: [{ k: 'collab', l: 'Suggest working together on your next one', ck: ['col', 13], ok: { t: 'It\'s the start of something. Your next script has two names on it.', fx: { tie: 10, rel: 'friend', stand: 1 }, end: 'Turned a near-plagiarism into a partnership with {who}.', mile: 'Started writing with {who}' }, no: { t: 'You don\'t click. You leave on good enough terms.', fx: { tie: 3 }, end: 'Cleared the air with {who} over {film}.' } },
          { k: 'credit', l: 'Ask for a thank-you credit', ok: { t: '{They} put{s} you in the special thanks. It\'s more than most people get.', fx: { tie: 2, stand: .5 }, end: 'Got a thank-you on {film}.' } }] }
    } },
  { id: 'friend_trouble', name: 'A Friend in Trouble', lv: [0, 7], mk: c => { c.who = arcFriend(25); return c.who !== null; },
    stages: {
      a: { t: 'Something\'s off', x: '{who} has cancelled on you three times this month, and {their} last text was just "sorry. bad week. bad month."',
        o: [{ k: 'go', l: 'Turn up at {their} door', ok: { t: '{They} let{s} you in. The place is a mess and so {is} {they}. You stay until midnight.', fx: { tie: 6, energy: -6 }, n: 'b', w: [1, 2] } },
          { k: 'text', l: 'Send a long, kind text', ok: { t: 'Three dots appear and disappear for twenty minutes. Then: "thank you. really."', fx: { tie: 3 }, n: 'b', w: [1, 2] } },
          { k: 'space', l: 'Give {them} space', ok: { t: 'You give {them} space. You think about {them} more than you text.', end: 'Gave {who} space when {they} {was} struggling.' } }] },
      b: { t: 'What {they} need{s}', x: '{who} admits it: the work dried up, the money\'s gone, and {they}\'ve been thinking about leaving the business altogether.',
        o: [{ k: 'work', l: 'Find {them} work', ck: ['cha', 13], ok: { t: 'You call in two favours and get {them} a month on a production. {They} get{s} emotional in a coffee shop, then pretend{s} {they} didn\'t.', fx: { tie: 10, rel: 'close', stand: .5 }, end: 'Pulled {who} back from quitting the business.', mile: 'Got {who} back on their feet' }, no: { t: 'The favours don\'t come through. You keep trying.', fx: { tie: 5, stress: 3 }, end: 'Tried to find {who} work; it didn\'t come together, but you showed up.' } },
          { k: 'honest', l: 'Tell {them} it\'s okay to leave', ck: ['com', 12], ok: { t: '{They} leave{s} for a job teaching. Six months later {they}\'re the happiest you\'ve ever seen {them}.', fx: { tie: 8, rel: 'close' }, end: 'Helped {who} leave the business for something better.' }, no: { t: '{They} hear{s} "give up". It stings for a while.', fx: { tie: -3 }, end: 'Told {who} it was okay to quit. It stung.' } }] }
    } },
  { id: 'call_home', name: 'A Call from Home', lv: [0, 7], mk: c => { c.thing = ppick(['your mother', 'your father', 'your grandmother', 'your oldest friend from school']); c.amt = arcAmt(400, 4000, .05); return true; },
    stages: {
      a: { t: 'Hospital', x: '{thing} is in hospital. It\'s not critical, they think, but it\'s not nothing. Home is a long way away and you have work this week.',
        o: [{ k: 'go', l: 'Go home now', cost: 'amt', ok: { t: 'You\'re there by morning. The hospital food is exactly as advertised. {thing} is so glad to see you.', fx: { stress: -4, energy: -10 }, n: 'b', w: [1, 2] } },
          { k: 'call', l: 'Call every day and go at the weekend', ok: { t: 'You call every evening. You hear the TV in the background, which is a good sign.', fx: { stress: 4 }, n: 'b', w: [1, 2] } }] },
      b: { t: 'Home again', x: '{thing} is home and recovering, and suddenly very interested in your career.',
        o: [{ k: 'stay', l: 'Stay an extra week', ok: { t: 'A week of bad TV, good cooking and old photos. You come back calmer than you\'ve been in a year.', fx: { stress: -12, energy: 10 }, end: '{thing} was ill; you went home.', mile: 'Went home when {thing} was ill' } },
          { k: 'back', l: 'Get back to work', ok: { t: 'You fly back. {thing} sends you a newspaper clipping about a film you weren\'t in, just to say hello.', fx: { stress: -3 }, end: '{thing} was ill and recovered.' } }] }
    } },
  { id: 'building_sold', name: 'The Building\'s Sold', lv: [0, 5], need: () => S.me.life !== 'couch' && S.me.life !== 'house', mk: c => { c.amt = arcAmt(800, 8000, .06); return true; },
    stages: {
      a: { t: 'A letter under the door', x: 'Your building has been sold to a company with a one-word name. The letter talks about "exciting renovations" and "a new chapter". Your rent goes up in eight weeks.',
        o: [{ k: 'organise', l: 'Organise the tenants', ck: ['cha', 13], ok: { t: 'A meeting in the lobby, twenty-two tenants and a retired lawyer from the fourth floor. You have a plan.', fx: { energy: -6 }, n: 'b', w: [3, 4] }, no: { t: 'Four people come. One brings a guitar.', fx: { energy: -4 }, n: 'c', w: [3, 4] } },
          { k: 'accept', l: 'Start looking for somewhere else', ok: { t: 'You start looking. Every flat is either perfect and gone or available and haunted.', fx: { stress: 4 }, n: 'c', w: [3, 4] } }] },
      b: { t: 'The meeting with the owners', x: 'The company sends a man in a gilet to meet the tenants. He has slides.',
        o: [{ k: 'fight', l: 'Take him apart, politely', ck: ['com', 14], ok: { t: 'The retired lawyer nods at you approvingly. The rise is cut in half and frozen for two years.', fx: { stress: -8, stand: .2 }, end: 'Led the tenants and beat the rent rise.', mile: 'Led a tenants\' fight and won' }, no: { t: 'He has better slides than you have arguments. The rise goes ahead.', fx: { stress: 6 }, n: 'c', w: [2, 3] } }] },
      c: { t: 'The new rent', x: 'The new rent starts next month. It costs you {amt} more over the year.',
        o: [{ k: 'pay', l: 'Pay it and stay', ok: { t: 'You pay. The renovations turn out to be a new doorbell.', fx: { cash: '-amt' }, end: 'Your building was sold; you stayed and paid.' } },
          { k: 'roomie', l: 'Get a flatmate', ck: ['col', 11], ok: { t: 'Your new flatmate is a sound mixer who keeps odd hours and very good coffee. It works.', fx: { meet: 'known', stress: -2 }, end: 'Your building was sold; you got a flatmate.' }, no: { t: 'Your new flatmate practises the trombone. You last six weeks.', fx: { cash: '-amt2', stress: 6 }, end: 'Your building was sold; the flatmate didn\'t work out.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt / 2); } },
  // ===================== a name, and money =====================
  { id: 'protege', name: 'The Protégé', lv: [4, 7], mk: c => { c.who = arcStranger(['director', 'writer', 'dp', 'actor', 'composer', 'editor'], -25); return c.who !== null && !S.me.known[c.who]; },
    stages: {
      a: { t: 'A letter from a stranger', x: '{who}, a young {role}, has written you a four-page letter about your work. It\'s smart, a little too intense, and ends with a request: one hour of your time.',
        o: [{ k: 'meet', l: 'Give {them} the hour', ok: { t: 'The hour becomes three. {They}\'re raw, but there\'s something there.', fx: { meet: null, tie: 6 }, n: 'b', w: [3, 6] } },
          { k: 'no', l: 'Send a kind no', ok: { t: 'You send a short, kind note. {They} frame{s} it.', end: 'Sent {who} a kind no.' } }] },
      b: { t: 'The first real job', x: '{who} has a shot at {their} first real job and needs someone to vouch for {them}. Your name would carry it.',
        o: [{ k: 'vouch', l: 'Put your name on it', ck: ['tas', 13], ok: { t: '{They} get{s} it, and {they}\'re brilliant. People start saying "one of yours".', fx: { stand: 1, tie: 10, rel: 'friend' }, n: 'c', w: [16, 30] }, no: { t: '{They} get{s} it, and struggle{s}. Your name takes a small knock.', fx: { stand: -.5, tie: 6 }, n: 'c', w: [16, 30] } },
          { k: 'earn', l: 'Tell {them} to earn it alone', ok: { t: 'That job goes to someone else, but {they} land{s} the next one alone, and tell{s} you it\'s exactly what {they} needed.', fx: { tie: 3 }, n: 'c', w: [20, 40] } }] },
      c: { t: '{who}\'s big moment', x: '{who} has a hit. In every interview, {they} get{s} asked who helped {them}.',
        o: [{ k: 'proud', l: 'Watch, quietly proud', ok: { t: c => opinion(c.who) > 20 ? '{They} say{s} your name. Twice. Your phone fills with messages.' : '{They} thank{s} {their} parents, {their} agent and a teacher. You laugh. That\'s fair.', fx: { stand: 1, fame: 1 }, end: 'Mentored {who} to a breakthrough.', mile: 'Your protégé {who} broke through' } },
          { k: 'work', l: 'Offer to work with {them}', ck: ['col', 12], ok: { t: '{They} say{s} yes immediately. The student becomes a collaborator.', fx: { tie: 8, stand: 1 }, end: 'Mentored {who}, then worked with {them}.', mile: 'Your protégé {who} broke through' }, no: { t: '{They}\'re booked for two years. {They} promise{s} the year after.', fx: { tie: 3 }, end: 'Mentored {who} to a breakthrough.' } }] }
    } },
  { id: 'old_photo', name: 'The Old Photo', lv: [4, 7], need: () => (ME().fame || 0) >= 8, mk: c => { c.thing = ppick(['a fancy-dress party from your twenties', 'a terrible student film you starred in', 'a blog you wrote at nineteen', 'a talent show performance with a recorder']); return true; },
    stages: {
      a: { t: 'It\'s everywhere', x: 'Someone has dug up {thing}, and it\'s everywhere by lunch.',
        o: [{ k: 'joke', l: 'Post it yourself, with a joke', ck: ['cha', 13], ok: { t: 'You win the internet for a day. People like you more than before.', fx: { fame: 3, stand: .5 }, end: 'Owned an embarrassing old photo and won.' }, no: { t: 'The joke lands sideways. Now there are two things circulating.', fx: { fame: 2, stress: 6 }, n: 'b', w: [1, 1] } },
          { k: 'apologise', l: 'Apologise, sincerely', ck: ['com', 12], ok: { t: 'Short, sincere, done. The story ends the same day.', fx: { stand: .2 }, end: 'Apologised for an old photo; the story died.' }, no: { t: 'The apology becomes the story.', fx: { stress: 6 }, n: 'b', w: [1, 1] } },
          { k: 'ignore', l: 'Say nothing', ck: ['com', 14], ok: { t: 'It\'s gone in three days. Nothing happened, as far as anyone remembers.', end: 'Waited out an old photo.' }, no: { t: 'It doesn\'t go away. A late-night host does five minutes on it.', fx: { fame: 2, stress: 8 }, n: 'b', w: [1, 1] } }] },
      b: { t: 'Day three', x: 'Day three. A morning show has asked you on to "talk about it".',
        o: [{ k: 'go', l: 'Go on', ck: ['cha', 14], ok: { t: 'You\'re funny, warm and quick. It\'s the best press you\'ve had all year.', fx: { fame: 4, stand: 1, stress: -6 }, end: 'Turned an old embarrassment into your best press of the year.' }, no: { t: 'You\'re defensive. It shows.', fx: { stand: -.5, stress: 4 }, end: 'An old photo dogged you for a week.' } },
          { k: 'no', l: 'Decline', ok: { t: 'You decline. It fades by the weekend.', fx: { stress: -2 }, end: 'An old photo dogged you for a week.' } }] }
    } },
  { id: 'the_gala', name: 'The Gala', lv: [4, 7], need: () => lateRich(), mk: c => { c.amt = arcAmt(5000, 150000, .04); c.who = arcStranger(['actor', 'director'], 15); c.who2 = arcStranger(['producer'], 10); return c.who !== null && c.who2 !== null && c.who !== c.who2; },
    stages: {
      a: { t: 'Host a gala?', x: 'A film preservation charity wants you to host this year\'s gala: three hundred guests, a restored print and an auction. Hosts usually give {amt} themselves.',
        o: [{ k: 'yes', l: 'Host it', cost: 'amt', ok: { t: 'You\'re on the invitation in gold letters.', fx: { stand: .5 }, n: 'b', w: [3, 5] } },
          { k: 'small', l: 'Give, but don\'t host', cost: 'amt2', ok: { t: 'A generous cheque and a thank-you in the programme.', fx: { stand: .5 }, end: 'Gave to the film preservation gala.' } },
          { k: 'no', l: 'Decline', ok: { t: 'You decline. Someone else\'s name goes on the invitation.', end: 'Declined to host the preservation gala.' } }] },
      b: { t: 'The seating chart', x: 'Four days to go. {who} and {who2} haven\'t spoken since a very public falling-out, and the seating chart has them at the same table.',
        o: [{ k: 'together', l: 'Leave them together', ck: ['cha', 14], ok: { t: 'By dessert they\'re laughing. By midnight they\'re talking about a project. The trades call it "the gala reunion".', fx: { fame: 2, stand: 1, tie: 6, tie2: 6 }, n: 'c', w: [1, 1] }, no: { t: 'A bread roll is thrown. Not hard, but in public.', fx: { fame: 2, stress: 8 }, n: 'c', w: [1, 1] } },
          { k: 'apart', l: 'Separate them', ok: { t: 'Opposite ends of the room. Peace holds.', n: 'c', w: [1, 1] } }] },
      c: { t: 'The auction', x: 'The night of the gala. The last lot is a costume from a classic film, and the bidding stalls well below what it\'s worth.',
        o: [{ k: 'bid', l: 'Bid it up yourself', cost: 'amt2', ok: { t: 'You win it, to applause. It hangs in your hallway now, and the charity breaks its record.', fx: { stand: 1, fame: 1 }, end: 'Hosted the preservation gala and broke its record.', mile: 'Hosted a record-breaking preservation gala' } },
          { k: 'speech', l: 'Make a speech to get the room going', ck: ['cha', 13], ok: { t: 'Three paddles go up at once. It goes for twice the estimate.', fx: { stand: 1.5, fame: 1 }, end: 'Hosted the preservation gala; your speech saved the auction.', mile: 'Hosted a record-breaking preservation gala' }, no: { t: 'Polite applause. It sells at the reserve.', fx: { stand: .5 }, end: 'Hosted the preservation gala.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt * .4); } },
  { id: 'comeback', name: 'The Comeback', lv: [4, 7], mk: c => { const L = []; for (const r of ['actor', 'director', 'composer']) for (const id of (S.pool[S.me.hub] || {})[r] || []) { const q = P(id); if (!q.dead && !q.retired && q.fame >= 30 && q.standing < 45 && id !== S.me.id) L.push(id); } if (!L.length) return false; c.who = ppick(L); return true; },
    stages: {
      a: { t: 'A faded name', x: '{who} was a huge name once. Now {they}\'re mostly a quiz question. {Their} agent calls you: {they}\'d love to work with you, and {they}\'d come cheap.',
        o: [{ k: 'meet', l: 'Take the meeting', ok: { t: '{They}\'re funnier and sharper than you expected, and sober, {they} tell{s} you, for four years.', fx: { meet: null, tie: 6 }, n: 'b', w: [2, 4] } },
          { k: 'no', l: 'Pass', ok: { t: 'You pass. A year later someone else casts {them}, and it\'s a sensation.', end: 'Passed on {who}\'s comeback.' } }] },
      b: { t: 'The bet', x: 'There\'s a part, or a project, that would suit {who}. Everyone you ask says it\'s a risk.',
        o: [{ k: 'bet', l: 'Bet on {them}', ck: ['tas', 14], ok: { t: '{They}\'re magnificent. The press writes the comeback story for you. You look like a genius.', fx: { stand: 2, fame: 3, tie: 12, rel: 'friend' }, end: 'Bet on {who}\'s comeback, and it was a triumph.', mile: 'Brought {who} back' }, no: { t: 'It doesn\'t click. {They}\'re gracious about it, which somehow makes it worse.', fx: { stand: -.5, tie: 4 }, end: 'Bet on {who}\'s comeback. It didn\'t take.' } },
          { k: 'small', l: 'Offer something small first', ok: { t: 'A small part, a few days. {They} steal{s} every scene. Next time it\'ll be bigger.', fx: { tie: 6, stand: .5 }, end: 'Gave {who} a small part on the way back.' } }] }
    } },
  { id: 'memoir', name: 'The Memoir', lv: [5, 7], mk: c => { c.amt = arcAmt(20000, 400000, .05); c.who = arcStranger(['writer'], -5); return c.who !== null && S.week - ((S.me.milestones || [])[0] || { w: S.week }).w > 520; },
    stages: {
      a: { t: 'A book deal', x: 'A publisher wants your memoir: {amt} up front, with {who} as your ghostwriter. They\'d like "candour".',
        o: [{ k: 'yes', l: 'Sign', ok: { t: '{who} turns up the next week with a recorder and a lot of questions.', fx: { cash: 'amt', meet: null }, n: 'b', w: [6, 10] } },
          { k: 'no', l: 'Not yet', ok: { t: 'Not yet. You have more to do first.', end: 'Turned down a memoir deal.' } }] },
      b: { t: 'The chapter about {them}', x: 'The draft is good. One chapter is about someone you fell out with years ago, and it is very, very honest.',
        o: [{ k: 'keep', l: 'Keep it', ck: ['com', 14], ok: { t: 'The book comes out. That chapter is what everyone talks about, and the person in it writes you a surprisingly decent letter.', fx: { fame: 4, stand: 1 }, end: 'Wrote an honest memoir.', mile: 'Published your memoir' }, no: { t: 'The book comes out. A lawyer\'s letter arrives the same week.', fx: { fame: 4, cash: -15000, stress: 10 }, end: 'Wrote a memoir honest enough to get sued.', mile: 'Published your memoir' } },
          { k: 'soften', l: 'Soften it', ok: { t: 'You soften it. The reviews call the book "generous". Some call it "careful".', fx: { fame: 2, stand: .5 }, end: 'Wrote a careful memoir.', mile: 'Published your memoir' } }] }
    } },
  // ===================== other fields =====================
  { id: 'support_slot', name: 'The Support Slot', lv: [0, 4], fields: ['music'], mk: c => { c.who = arcStranger(['composer'], 15); c.amt = arcAmt(300, 3000, .05); return c.who !== null; },
    stages: {
      a: { t: 'Six cities in a van', x: '{who} needs a support act for six dates. The pay is {amt} for the lot, there\'s a van, and the van has a name: Brenda.',
        o: [{ k: 'go', l: 'Get in the van', ok: { t: 'Brenda smells of crisps and ambition. You love her immediately.', fx: { tie: 4, energy: -10 }, n: 'b', w: [1, 2] } },
          { k: 'no', l: 'Pass', ok: { t: 'You pass. Their photos from the road look like a film.', end: 'Passed on a support slot with {who}.' } }] },
      b: { t: 'Brenda breaks down', x: 'Brenda breaks down outside a town with one petrol station. The gig is in five hours, eighty miles away.',
        o: [{ k: 'fix', l: 'Try to fix her', ck: ['com', 13], ok: { t: 'A Vidwire tutorial, a borrowed spanner, some swearing. Brenda lives.', fx: { tie: 6 }, n: 'c', w: [1, 1] }, no: { t: 'Brenda does not live. A farmer gives you a lift for the price of a signed CD.', fx: { stress: 6 }, n: 'c', w: [1, 1] } },
          { k: 'hitch', l: 'Call everyone you know for a lift', ck: ['cha', 12], ok: { t: 'A fan with a people carrier saves the tour. She gets a guest-list spot for life.', fx: { fame: 1 }, n: 'c', w: [1, 1] }, no: { t: 'You make it with eight minutes to spare. Nobody\'s calm.', fx: { stress: 5 }, n: 'c', w: [1, 1] } }] },
      c: { t: 'The last night', x: 'The last date, the biggest room. {who} asks if you want to come on for the encore.',
        o: [{ k: 'yes', l: 'Yes', ck: ['cha', 12], ok: { t: 'The room sings along to a song it didn\'t know an hour ago. Your follower count does something strange.', fx: { fame: 3, tie: 6 }, end: 'Toured with {who} and joined the encore.', mile: 'Played support for {who}' }, no: { t: 'You come in a bar early. It\'s fine. It\'s rock and roll.', fx: { tie: 3 }, end: 'Toured six cities with {who}.' } },
          { k: 'watch', l: 'Watch from the side of the stage', ok: { t: 'Best seat in the house.', fx: { tie: 4 }, end: 'Toured six cities with {who}.' } }] }
    } },
  { id: 'the_collab', name: 'The Collab', lv: [0, 5], fields: ['creator', 'podcast'], mk: c => { c.who = arcStranger(['editor', 'actor', 'writer'], 12); return c.who !== null; },
    stages: {
      a: { t: 'A bigger channel', x: '{who} has three times your audience and wants a collab: one video each, filmed back to back.',
        o: [{ k: 'yes', l: 'Do it', ok: { t: 'A shoot day at {their} place. {Their} set is nicer. {Their} lighting is nicer. You take notes.', fx: { tie: 4 }, n: 'b', w: [1, 2] } },
          { k: 'no', l: 'Pass', ok: { t: 'You pass. Probably fine.', end: 'Passed on a collab with {who}.' } }] },
      b: { t: 'Creative differences', x: '{who} wants the video to be a prank. You want it to be good.',
        o: [{ k: 'prank', l: 'Do the prank', ok: { t: 'The prank does numbers. You feel a bit sticky about it.', fx: { fame: 3, stand: -.3 }, n: 'c', w: [1, 2] } },
          { k: 'idea', l: 'Pitch your idea hard', ck: ['vis', 13], ok: { t: '{They} love{s} it. It\'s the best thing either of you has made this year.', fx: { fame: 3, stand: .5, tie: 4 }, n: 'c', w: [1, 2] }, no: { t: '{They} agree{s}, unenthusiastically. It shows on camera.', fx: { fame: 1, tie: -2 }, n: 'c', w: [1, 2] } }] },
      c: { t: 'Upload day', x: 'Both videos go up at noon.',
        o: [{ k: 'watch', l: 'Watch the numbers', ok: { t: 'Your subscribers jump more in a day than in the last three months.', fx: { fame: 2 }, end: 'Collaborated with {who}.', mile: 'A collab with {who}' } }] }
    } },
  { id: 'previews', name: 'Previews', lv: [1, 6], fields: ['stage'], mk: c => { c.title = ppick(['The Glass Orchard Hotel', 'Five Kings of Margate', 'A Small Revolution', 'Night Ferry', 'The Understudy\'s Understudy']); c.who = arcStranger(['director', 'actor'], 5); return c.who !== null; },
    stages: {
      a: { t: 'First preview', x: 'The first preview of {title}. The second act runs twelve minutes long and the audience coughs through all twelve of them.',
        o: [{ k: 'cut', l: 'Cut hard, tonight', ck: ['vis', 13], ok: { t: 'You cut nine minutes by 2 a.m. The second preview flies.', fx: { energy: -8, stand: .5 }, n: 'b', w: [1, 1] }, no: { t: 'You cut the wrong nine minutes. Now the plot doesn\'t make sense.', fx: { energy: -8, stress: 6 }, n: 'b', w: [1, 1] } },
          { k: 'trust', l: 'Trust it: audiences warm up', ck: ['com', 14], ok: { t: 'They do warm up. The coughing becomes laughing by the fourth night.', n: 'b', w: [1, 1] }, no: { t: 'They don\'t.', fx: { stress: 6 }, n: 'b', w: [1, 1] } }] },
      b: { t: 'Opening night', x: 'Opening night of {title}. {who} brings you a card that says only "break everything".',
        o: [{ k: 'watch', l: 'Watch from the back of the stalls', ok: { t: c => S.me.stress > 60 ? 'You watch through your fingers. The reviews are mixed. One critic loves it so much it almost makes up for the others.' : 'The room is with you from the first line. The reviews say "funny", "alive" and, once, "essential".', fx: { fame: 2, stand: 1, tie: 4 }, end: 'Opened {title}.', mile: 'Opened {title}' } },
          { k: 'pub', l: 'Wait in the pub across the road', ok: { t: 'You hear the applause through the wall. That\'s enough.', fx: { stress: -4, fame: 1, stand: .5 }, end: 'Opened {title} and listened from the pub.' } }] }
    } },
  { id: 'big_guest', name: 'The Big Guest', lv: [0, 6], fields: ['podcast'], mk: c => { c.who = arcStranger(['actor', 'director'], 30); return c.who !== null; },
    stages: {
      a: { t: 'A yes from a star', x: '{who} has said yes to your show. Actually yes. {Their} publicist wants the questions in advance.',
        o: [{ k: 'send', l: 'Send them', ok: { t: 'The publicist crosses out half of them.', n: 'b', w: [1, 2] } },
          { k: 'vague', l: 'Send something vague', ck: ['cha', 13], ok: { t: '"Great, very relaxed. Love that." You keep your real questions for the day.', n: 'b', w: [1, 2] }, no: { t: 'The publicist wants specifics, and now they don\'t trust you.', fx: { stress: 4 }, n: 'b', w: [1, 2] } }] },
      b: { t: 'Recording', x: 'Forty minutes in, {who} is bored and it\'s audible. {They} check{s} {their} phone.',
        o: [{ k: 'swerve', l: 'Ask something nobody has asked {them}', ck: ['cha', 15], ok: { t: '{They} put{s} the phone down and talk{s} for twenty minutes about {their} grandfather\'s cinema. It\'s the best episode you\'ve ever made.', fx: { fame: 4, stand: 1, tie: 6 }, end: 'Got {who} to open up on your show.', mile: '{who} on your show' }, no: { t: '{They} laugh{s} politely and answer{s} in one sentence.', fx: { fame: 2 }, end: '{who} was on your show. Politely.' } },
          { k: 'wrap', l: 'Wrap it up early', ok: { t: 'You wrap early. The episode is short and fine, and the download numbers are huge anyway.', fx: { fame: 2 }, end: '{who} was on your show.' } }] }
    } },
  // ===================== any time =====================
  { id: 'neighbour', name: 'The Neighbour', lv: [0, 6], mk: c => { const L = []; for (const r of ['director', 'actor', 'dp', 'editor', 'composer', 'writer']) for (const id of (S.pool[S.me.hub] || {})[r] || []) { const q = P(id); if (q.retired && !q.dead && !S.me.known[id]) L.push(id); } if (!L.length) return false; c.who = ppick(L); return true; },
    stages: {
      a: { t: 'Across the hall', x: 'The quiet {role} across the hall who always says good morning turns out to be {who}. You recognise the name from the back of a DVD box you\'ve owned for ten years.',
        o: [{ k: 'say', l: 'Say you know {their} work', ok: { t: '{They} look{s} surprised, then pleased. {They} invite{s} you in for tea and show{s} you a shelf of awards {they} use{s} as bookends.', fx: { meet: null, tie: 6 }, n: 'b', w: [3, 6] } },
          { k: 'cool', l: 'Play it cool', ok: { t: 'You play it cool for three weeks, then crack and ask about a specific shot. {They} laugh{s} for a long time.', fx: { meet: null, tie: 4 }, n: 'b', w: [3, 6] } }] },
      b: { t: 'Tuesdays', x: 'Tea with {who} has become a Tuesday thing. Today {they} want{s} to show you something.',
        o: [{ k: 'look', l: 'Have a look', ok: { t: c => P(c.who).role === 'writer' ? '{They} give{s} you a script {they} never made. "Somebody should." It\'s good.' : '{They} give{s} you a box of notebooks: every job, every mistake, forty years of it. "Somebody should have them."', fx: { tie: 8, stand: .5, xp: { struc: .3 } }, end: 'Became friends with {who}, who lives across the hall.', mile: 'Tea on Tuesdays with {who}' } },
          { k: 'ask', l: 'Ask {them} to come and see your work', ck: ['cha', 12], ok: { t: '{They} come{s}. {They} say{s} three things about it afterwards, and all three change how you work.', fx: { tie: 6, stand: .5, xp: { vis: .3 } }, end: 'Became friends with {who}, who lives across the hall.' }, no: { t: '"Oh, I don\'t go out." Fair enough.', fx: { tie: 2 }, end: 'Tea on Tuesdays with {who}.' } }] }
    } },
  { id: 'stolen_laptop', name: 'The Laptop', lv: [0, 7], mk: c => { c.thing = (S.me.scripts || []).length ? 'three months of writing' : S.me.make ? 'every file for the project you\'re making' : 'your reel, your contacts and your tax receipts'; c.amt = arcAmt(700, 3000, .03); return true; },
    stages: {
      a: { t: 'Gone', x: 'Your laptop is gone from a café table in the ten seconds it took to grab a napkin. It had {thing} on it.',
        o: [{ k: 'chase', l: 'Run after the most likely-looking person', ck: ['eth', 14], ok: { t: 'You catch him at the corner. He drops it and keeps running. The case is scratched. Everything else is fine.', fx: { stress: -4, energy: -6 }, end: 'Chased down your stolen laptop.', mile: 'Chased down a laptop thief' }, no: { t: 'You chase the wrong man for two blocks. He\'s very understanding about it.', fx: { energy: -6 }, n: 'b', w: [1, 1] } },
          { k: 'cloud', l: 'Check the cloud backup', ok: { t: 'The backup is from… last Tuesday. Mostly fine.', n: 'b', w: [1, 1] } }] },
      b: { t: 'Starting again', x: 'You need a new laptop, and some of the work is gone for good.',
        o: [{ k: 'buy', l: 'Buy a good one', cost: 'amt', ok: { t: 'New laptop, new backups, new paranoia. The lost work comes back better the second time.', fx: { xp: { struc: .2 } }, end: 'Lost a laptop, and rebuilt.' } },
          { k: 'cheap', l: 'Get a cheap one', cost: 'amt2', ok: { t: 'It works. The fan sounds like a small aircraft.', fx: { stress: 3 }, end: 'Lost a laptop, and rebuilt.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt / 3); } },
  { id: 'the_dog', name: 'The Dog', lv: [0, 7], need: () => !(S.me.flags || {}).dog, mk: c => { c.thing = ppick(['Biscuit', 'Kubrick', 'Mabel', 'Gaffer', 'Señor Pancake', 'Dolly']); c.amt = arcAmt(300, 1500, .02); return true; },
    stages: {
      a: { t: 'A dog for the weekend', x: 'A friend\'s foster dog needs somewhere to stay for a weekend. Her name is {thing}. She has one ear up and one ear down.',
        o: [{ k: 'yes', l: 'Yes, obviously', ok: { t: '{thing} sleeps on your feet and eats a sock. It\'s the best weekend you\'ve had in ages.', fx: { stress: -8 }, n: 'b', w: [1, 2] } },
          { k: 'no', l: 'You can\'t right now', ok: { t: 'You can\'t right now. You think about {thing} more than you\'d admit.', end: 'Didn\'t take the dog.' } }] },
      b: { t: 'Monday', x: 'Monday. Nobody has come for {thing}. {thing} has moved her bowl next to yours.',
        o: [{ k: 'keep', l: 'Keep her', cost: 'amt', ok: { t: '{thing} is yours. Within a month she\'s been on three sets and has her own fans.', fx: { stress: -10, fame: 1, flag: 'dog' }, end: 'Adopted {thing}.', mile: 'Adopted a dog called {thing}' } },
          { k: 'home', l: 'Find her a good home', ck: ['cha', 11], ok: { t: 'A retired couple with a big garden. They send you photos every month.', fx: { stress: -2 }, end: 'Found {thing} a home.' }, no: { t: 'Nobody takes her. You keep her. Obviously.', fx: { stress: -8, flag: 'dog' }, end: 'Adopted {thing}, eventually.', mile: 'Adopted a dog called {thing}' } }] }
    } },

  // ===================== second reel =====================
  { id: 'reshoots', name: 'Reshoots', lv: [2, 6], mk: c => { c.film = arcMyFilm(); if (c.film === null) return false; c.who = arcFilmPerson(c.film, 'dir'); c.who2 = arcFilmPerson(c.film, 'prod'); return c.who !== null && c.who2 !== null && c.who !== c.who2; },
    stages: {
      a: { t: 'The test screening', x: '{film} tested last night. The scores were bad, the ending scored worst, and {who2} has booked a meeting about "options". {who} hasn\'t slept.',
        o: [{ k: 'dir', l: 'Back {who}\'s ending', ck: ['tas', 13], ok: { t: 'You make a calm case in the meeting: the ending isn\'t wrong, the set-up is. {who2} listens.', fx: { tie: 6, tie2: -2 }, n: 'b', w: [2, 3] }, no: { t: 'You defend the ending and {who2} hears "difficult". The reshoots are booked anyway.', fx: { tie: 3, tie2: -4 }, n: 'b', w: [2, 3] } },
          { k: 'prod', l: 'Agree it needs a new ending', ok: { t: '{who2} nods slowly. {who} looks at you like you\'ve stolen something.', fx: { tie: -6, tie2: 5 }, n: 'b', w: [2, 3] } },
          { k: 'idea', l: 'Pitch a third way', ck: ['vis', 14], ok: { t: 'Not a new ending: a new first scene, so the old ending lands. Both of them go quiet. Then both say yes.', fx: { tie: 5, tie2: 5, stand: 1 }, n: 'b', w: [2, 3] }, no: { t: 'Your third way is a worse version of the first two. Everyone is polite about it.', fx: { stress: 4 }, n: 'b', w: [2, 3] } }] },
      b: { t: 'Four extra days', x: 'Four days of reshoots for {film}, in the rain, with half the original crew and a lead who\'s already on another job.',
        o: [{ k: 'grind', l: 'Make the four days count', ck: ['eth', 13], ok: { t: 'The new material is the best thing in the film. Somebody says so at the wrap drinks, loudly.', fx: { stand: 1, energy: -10 }, n: 'c', w: [8, 14] }, no: { t: 'You lose a day to the weather and the rest to the schedule. It\'s fine. It\'s not more than fine.', fx: { energy: -10, stress: 5 }, n: 'c', w: [8, 14] } },
          { k: 'light', l: 'Protect the crew\'s hours', ok: { t: 'Shorter days, happier crew, slightly less footage. Nobody complains, which is its own review.', fx: { stress: -2 }, n: 'c', w: [8, 14] } }] },
      c: { t: 'Opening weekend', x: '{film} opens this weekend. The reviews mention "a strong last act".',
        o: [{ k: 'read', l: 'Read the reviews', ok: { t: 'One critic singles out the new scene by description. You know whose idea that was, even if they don\'t.', fx: { stand: .5 }, end: 'Survived the reshoots on {film}.', mile: 'Reshoots on {film}' } }] }
    } },
  { id: 'festival_week', name: 'Festival Week', lv: [2, 7], mk: c => { c.place = ppick(['on the Riviera', 'in the mountains', 'by a lake', 'in a port city', 'on a volcanic island']); c.who = arcStranger(['producer', 'director'], 15); c.who2 = arcStranger(['actor', 'writer'], 5); c.amt = arcAmt(900, 6000, .03); return c.who !== null && c.who2 !== null && c.who !== c.who2; },
    stages: {
      a: { t: 'A badge and a bed', x: 'A friend has a spare accreditation for a big festival {place}: ten days of screenings, parties and very small hotel rooms. Getting there would cost about {amt}.',
        o: [{ k: 'go', l: 'Go', cost: 'amt', ok: { t: 'You land with a suitcase and a list of people you want to meet. The list is ambitious.', n: 'b', w: [1, 1] } },
          { k: 'no', l: 'Not this year', ok: { t: 'You follow it online. Someone you know wins something. You\'re happy for them, mostly.', end: 'Skipped the festival.' } }] },
      b: { t: 'The party on the boat', x: 'Day four. You\'re on a boat that belongs to someone nobody can name. {who} is by the rail, alone, looking at the sea.',
        o: [{ k: 'talk', l: 'Go and talk to {who}', ck: ['cha', 14], ok: { t: 'A long talk about everything but work. At the end, {they} ask{s} what you\'re making.', fx: { meet: null, tie: 8 }, n: 'c', w: [1, 1] }, no: { t: 'You get two sentences in before someone pulls {them} away.', fx: { meet: null, tie: 2 }, n: 'c', w: [1, 1] } },
          { k: 'dance', l: 'Dance instead', ok: { t: 'You dance with {who2} until the boat docks. A friendship, an argument about a film, a promise to work together.', fx: { tie2: 8, stress: -6, energy: -6 }, n: 'c', w: [1, 1] } }] },
      c: { t: 'The last night', x: 'The last night of the festival. Everybody is tired and sentimental and making promises.',
        o: [{ k: 'follow', l: 'Follow up properly, in writing, next week', ok: { t: c => opinion(c.who) > 10 ? 'You follow up. {who} answers within the hour, and a meeting goes in the diary.' : 'You follow up. Polite replies all round. Festivals are like that.', fx: { stand: .5 }, end: 'Ten days at a festival {place}.', mile: 'Ten days at a festival {place}' } },
          { k: 'enjoy', l: 'Just enjoy it', ok: { t: 'You stay up till sunrise on a beach with people you\'ll never see again. It\'s perfect.', fx: { stress: -8 }, end: 'Ten days at a festival {place}.' } }] }
    } },
  { id: 'agent_poach', name: 'The Big Agency', lv: [3, 6], need: () => !!S.me.agent, mk: c => { c.who = arcStranger(['producer'], 20); return c.who !== null; },
    stages: {
      a: { t: 'A call from a big agency', x: '{who} from one of the big agencies wants to "take you to lunch and talk about the next level". Your current agent took you on when nobody else would.',
        o: [{ k: 'lunch', l: 'Have the lunch', ok: { t: 'The restaurant has no prices on the menu. {who} knows your credits better than you do.', fx: { meet: null }, n: 'b', w: [1, 2] } },
          { k: 'loyal', l: 'Tell your agent about the call', ok: { t: 'Your agent goes quiet, then says thank you, and works twice as hard for a year.', fx: { stand: .5 }, end: 'Stayed loyal to your agent.' } }] },
      b: { t: 'The offer', x: '{who} wants you. Bigger rooms, bigger jobs, and you\'d be one of three hundred clients instead of thirty.',
        o: [{ k: 'jump', l: 'Sign with them', ck: ['cha', 13], ok: { t: 'You sign. Within a month you\'re in rooms you used to read about.', fx: { stand: 1.5, fame: 1, tie: 6 }, end: 'Moved to a big agency with {who}.', mile: 'Signed with a big agency' }, no: { t: 'You sign, and then hear nothing for two months. Big agencies are big.', fx: { stand: .5, stress: 5 }, end: 'Moved to a big agency, and got lost in it.' } },
          { k: 'stay', l: 'Stay where you are', ok: { t: 'You stay. Your agent hears about it anyway, and it\'s never forgotten.', fx: { stand: .3 }, end: 'Turned down a big agency.' } }] }
    } },
  { id: 'the_award', name: 'The Nomination', lv: [3, 7], need: () => ME().credits.length + (S.me.works || []).length >= 3, mk: c => { c.place = ppick(['a craft guild', 'the critics\' circle', 'a regional academy', 'an industry magazine']); c.who = arcStranger([ME().role], 5); return c.who !== null; },
    stages: {
      a: { t: 'You\'re nominated', x: '{place} has nominated you for its annual award. The other names on the list include {who}, who is everyone\'s favourite.',
        o: [{ k: 'campaign', l: 'Campaign a little', cost: 900, ok: { t: 'A few lunches, a screening, a thank-you note to everyone who voted last year.', fx: { stand: .3 }, n: 'b', w: [3, 5] } },
          { k: 'relax', l: 'Enjoy being nominated', ok: { t: 'You put it on your bio and get on with your life.', fx: { stress: -2 }, n: 'b', w: [3, 5] } }] },
      b: { t: 'The ceremony', x: 'The ceremony. Your category is after the chicken and before the comedian. Your heart is going.',
        o: [{ k: 'speech', l: 'Prepare a speech, just in case', ck: ['cha', 14], ok: { t: 'You win. The speech is short and funny and makes one person in the back cry. It gets quoted.', fx: { stand: 2, fame: 3, tie: 3 }, end: 'Won {place}\'s award.', mile: 'Won {place}\'s award' }, no: { t: '{who} wins. You clap like you mean it, which you mostly do.', fx: { tie: 3, stress: 3 }, end: 'Nominated by {place}; {who} won.' } },
          { k: 'none', l: 'Don\'t prepare anything', ck: ['com', 15], ok: { t: 'You win, and improvise something that brings the house down. Nobody believes it wasn\'t prepared.', fx: { stand: 2, fame: 4 }, end: 'Won {place}\'s award.', mile: 'Won {place}\'s award' }, no: { t: '{who} wins. You didn\'t need a speech after all, and that\'s a relief and a shame.', fx: { tie: 2 }, end: 'Nominated by {place}; {who} won.' } }] }
    } },
  { id: 'exec_crisis', name: 'The Quarter', lv: [4, 7], need: () => typeof corpRung === 'function' && S.me.jobs.some(j => /^corp_/.test(j.k)), mk: c => { const j = S.me.jobs.find(j => /^corp_/.test(j.k)); c.co = j.co !== undefined ? j.co : arcHubCo(2); c.who = arcStranger(['producer'], 15); c.amt = arcAmt(10000, 200000, .05); return c.co !== null && c.who !== null; },
    stages: {
      a: { t: 'A bad quarter', x: '{co} has had a bad quarter. The board wants cuts, and {who} has sent round a list of projects to kill. One of them is the one you care about most.',
        o: [{ k: 'fight', l: 'Fight for your project in the room', ck: ['cha', 15], ok: { t: 'You make the case with numbers and nerve. It survives; two others don\'t.', fx: { stand: 1, tie: -4 }, n: 'b', w: [6, 10] }, no: { t: 'You lose the argument and some goodwill. The project goes.', fx: { stand: -.5, stress: 6, tie: -4 }, end: 'Lost a fight over cuts at {co}.' } },
          { k: 'trade', l: 'Offer to cut something else', ck: ['fin', 13], ok: { t: 'You find savings nobody else saw. {who} takes your list over theirs.', fx: { stand: 1, tie: 4, xp: { fin: .2 } }, n: 'b', w: [6, 10] }, no: { t: 'Your savings are smaller than you thought. Your project goes, and so does one of theirs.', fx: { stress: 4 }, end: 'Tried to trade cuts at {co}.' } },
          { k: 'accept', l: 'Accept the list', ok: { t: 'You accept it. The people on the project don\'t forget who signed off.', fx: { stand: -.3 }, end: 'Signed off on cuts at {co}.' } }] },
      b: { t: 'The project you saved', x: 'The project you fought for at {co} is finished, and the first numbers are in.',
        o: [{ k: 'see', l: 'Look at the numbers', ok: { t: c => S.me.cash % 3 === 0 ? 'It\'s a modest hit. Modest is plenty. The board stops saying your name in that tone.' : 'It\'s a real hit. Your bonus this year has an extra zero, and {who} buys you lunch.', fx: { cash: 'amt', stand: 1.5 }, end: 'Saved a project at {co}; it paid off.', mile: 'Saved a project at {co}' } }] }
    } },
  { id: 'critic_feud', name: 'The Feud', lv: [1, 7], need: () => (S.me.works || []).some(w => w.type === 'review') || S.me.jobs.some(j => /critic|review/i.test(j.t)), mk: c => { c.who = arcStranger(['director', 'writer'], 10); c.film = c.who !== null ? (P(c.who).credits || []).slice(-1)[0] ?? null : null; return c.who !== null && c.film !== null; },
    stages: {
      a: { t: 'An angry email', x: '{who} has read your review of {film} and has written you a 2,000-word email. Some of it is fair. Most of it is in capitals.',
        o: [{ k: 'reply', l: 'Reply, calmly and in full', ck: ['com', 13], ok: { t: 'You reply with care. {They} write{s} back one line: "Fair enough. Coffee?"', fx: { tie: 8, meet: null }, n: 'b', w: [2, 4] }, no: { t: 'Your calm reply reads as smug. {They} post{s} it online.', fx: { tie: -6, fame: 2 }, n: 'b', w: [2, 4] } },
          { k: 'publish', l: 'Publish it, with permission', ck: ['cha', 14], ok: { t: '{They} say{s} yes. The exchange is the most-read thing you\'ve ever published.', fx: { fame: 3, stand: .5 }, n: 'b', w: [2, 4] }, no: { t: '{They} say{s} no, and now {they} hate{s} you twice.', fx: { tie: -8 }, end: 'Feuded with {who} over {film}.' } },
          { k: 'ignore', l: 'Ignore it', ok: { t: 'You ignore it. {They} write{s} two more. Then silence.', fx: { tie: -3 }, end: 'Ignored an angry email from {who}.' } }] },
      b: { t: 'The next film', x: '{who}\'s next film is out, and everybody is waiting to see what you write.',
        o: [{ k: 'honest', l: 'Review it honestly', ck: ['tas', 13], ok: { t: 'You write the review of your life: fair, generous where it\'s earned, sharp where it isn\'t. Even {who} admits it.', fx: { stand: 1, tie: 3 }, end: 'Survived a feud with {who}.', mile: 'A famous review of {who}\'s film' }, no: { t: 'Everyone reads the review as part of the feud, whatever you meant.', fx: { fame: 2, tie: -3 }, end: 'Feuded with {who} for a year.' } },
          { k: 'pass', l: 'Hand it to someone else', ok: { t: 'You recuse yourself. It\'s noticed, and respected.', fx: { stand: .5 }, end: 'Stepped back from reviewing {who}.' } }] }
    } },
  { id: 'tv_room', name: 'The Writers\' Room', lv: [2, 6], mk: c => { c.who = arcStranger(['writer'], 15); c.title = ppick(['Harbour Lights', 'The Night Desk', 'Small Town Saints', 'County Line', 'The Firm', 'Second Shift', 'Neighbours of the Year']); return c.who !== null; },
    stages: {
      a: { t: 'A seat at the table', x: '{who} is running the room for a new series, {title}, and needs one more voice for eight weeks. The pay is good and the hours are worse.',
        o: [{ k: 'yes', l: 'Take the seat', ok: { t: 'A big table, a whiteboard, a fridge full of things nobody eats. Twelve people, one show.', fx: { meet: null, tie: 4, cash: 3000 }, n: 'b', w: [2, 3] } },
          { k: 'no', l: 'Pass', ok: { t: 'You pass. {title} gets made without you.', end: 'Passed on the {title} room.' } }] },
      b: { t: 'The pitch that won\'t die', x: 'Week three. The room has spent two days on a storyline that isn\'t working. Everyone knows it. Nobody wants to tell {who}.',
        o: [{ k: 'say', l: 'Say it', ck: ['cha', 14], ok: { t: '{who} stares at you, then laughs: "Thank God." The whiteboard is wiped by lunch.', fx: { tie: 8, stand: 1 }, n: 'c', w: [3, 5] }, no: { t: 'The room goes very quiet. {who} keeps the storyline out of spite.', fx: { tie: -6, stress: 5 }, n: 'c', w: [3, 5] } },
          { k: 'fix', l: 'Pitch a fix instead of a complaint', ck: ['struc', 13], ok: { t: 'Your fix gets it moving again. It\'s your episode now.', fx: { tie: 6, stand: 1, xp: { struc: .2 } }, n: 'c', w: [3, 5] }, no: { t: 'Your fix is complicated and the room glazes over.', fx: { stress: 3 }, n: 'c', w: [3, 5] } }] },
      c: { t: 'The finale', x: '{title} wraps its first season. {who} has a question for you.',
        o: [{ k: 'listen', l: 'Hear the question', ok: { t: c => opinion(c.who) > 15 ? '"Season two. Would you co-run the room with me?" You say yes before thinking.' : '"Would you write me a reference? I\'m up for something big." You do. It\'s a good reference.', fx: { tie: 4, stand: .5 }, end: 'Wrote on {title}.', mile: 'In the room for {title}' } }] }
    } },
  { id: 'remake_rights', name: 'The Remake', lv: [4, 7], need: () => lateRich(), mk: c => { const L = S.films.filter(f => f.rel !== null && S.week - f.rel > 520 && (f.q || 0) >= 60).slice(-300); if (!L.length) return false; const f = ppick(L); c.film = f.id; c.amt = arcAmt(20000, 900000, .05); c.who = arcStranger(['director'], 5); return c.who !== null; },
    stages: {
      a: { t: 'The rights are available', x: 'The remake rights to {film}, a film you\'ve loved since you were young, are up for sale. The estate wants {amt} and someone who "understands it".',
        o: [{ k: 'buy', l: 'Buy them', cost: 'amt', ok: { t: 'You own a piece of a film you grew up with. It feels strange and wonderful.', fx: { stand: .5 }, n: 'b', w: [4, 8] } },
          { k: 'no', l: 'Leave it alone', ok: { t: 'Some films should be left alone. You leave it.', end: 'Left {film} alone.' } }] },
      b: { t: 'Who directs?', x: 'You need a director for the {film} remake. {who} wants it badly and has a radical idea.',
        o: [{ k: 'radical', l: 'Let {who} do something radical', ck: ['tas', 14], ok: { t: 'The radical version gets made, and people love it, and the old fans mostly forgive you.', fx: { stand: 2, fame: 3, tie: 8, cash: 'amt2' }, end: 'Remade {film} with {who}, boldly.', mile: 'Produced the remake of {film}' }, no: { t: 'The radical version divides everyone. Including you.', fx: { stand: -.5, fame: 2, tie: 4 }, end: 'Remade {film}; nobody agreed about it.', mile: 'Produced the remake of {film}' } },
          { k: 'faithful', l: 'Keep it faithful', ok: { t: 'A careful, handsome remake. It makes its money back and no one writes essays about it.', fx: { cash: 'amt2', stand: .5 }, end: 'Remade {film}, faithfully.', mile: 'Produced the remake of {film}' } },
          { k: 'sell', l: 'Sell the rights on at a profit', ck: ['fin', 13], ok: { t: 'A studio pays well over what you did.', fx: { cash: 'amt' }, end: 'Flipped the rights to {film}.' }, no: { t: 'You sell for about what you paid. A lesson, at least.', fx: { cash: 'amt2' }, end: 'Sold the {film} rights on.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt * .8); } },
  { id: 'the_strike', name: 'Picket Line', lv: [1, 7], need: () => typeof worldOn === 'function' && worldOn().some(e => e.k === 'strike' || e.k === 'walkout'), mk: c => { c.who = arcFriend(0) ?? arcKnown(); return c.who !== null; },
    stages: {
      a: { t: 'The strike', x: 'The strike is on. {who} is a captain on the picket line outside the big studio and has asked who\'s coming tomorrow.',
        o: [{ k: 'march', l: 'Walk the line', ok: { t: 'Six hours, a sign you made yourself, a lot of very good doughnuts from people driving past.', fx: { tie: 6, stand: .5, energy: -6 }, n: 'b', w: [2, 3] } },
          { k: 'donate', l: 'Donate to the hardship fund', cost: 200, ok: { t: 'The fund sends a handwritten thank-you. {who} sees your name on the list.', fx: { tie: 3, stand: .3 }, n: 'b', w: [2, 3] } },
          { k: 'away', l: 'Keep your head down', ok: { t: 'You keep your head down. It\'s a long few weeks.', fx: { stress: 4 }, end: 'Kept your head down during the strike.' } }] },
      b: { t: 'The deal', x: 'A deal is close. {who} says the next 48 hours are everything.',
        o: [{ k: 'there', l: 'Be there for the vote', ok: { t: 'The vote passes. People hug strangers. {who} hugs you for an uncomfortably long time.', fx: { tie: 6, stress: -6 }, end: 'Walked the picket line with {who}; the strike was won.', mile: 'Walked the picket line' } }] }
    } },
  { id: 'big_audition', name: 'The Audition', lv: [0, 4], fields: ['film', 'stage'], need: () => ME().role === 'actor', mk: c => { c.film = arcHubFilm(); c.who = c.film !== null ? arcFilmPerson(c.film, 'dir') : null; return c.who !== null; },
    stages: {
      a: { t: 'Sides for {film}', x: 'Your agent got you an audition for {film}. Five pages, a big emotional scene, and {who} will be in the room.',
        o: [{ k: 'prep', l: 'Work the scene every night', ck: ['eth', 12], ok: { t: 'You know the pages so well you could do them backwards. You might have to.', fx: { xp: { range: .2 }, energy: -6 }, n: 'b', w: [1, 1] }, no: { t: 'You over-rehearse and it goes stiff.', fx: { stress: 4 }, n: 'b', w: [1, 1] } },
          { k: 'loose', l: 'Learn it, then stay loose', ok: { t: 'You learn the lines and leave the feeling for the day.', n: 'b', w: [1, 1] } }] },
      b: { t: 'In the room', x: 'You do the scene. {who} says, "Great. Now do it like you\'ve just won the lottery."',
        o: [{ k: 'go', l: 'Throw yourself into it', ck: ['impro', 14], ok: { t: 'It\'s mad and it works. {who} laughs out loud and writes something down.', fx: { tie: 8, stand: 1 }, n: 'c', w: [1, 2] }, no: { t: 'It\'s mad and it doesn\'t work. {who} thanks you warmly, which is never good.', fx: { tie: 2 }, end: 'Auditioned for {film}. Not this time.' } },
          { k: 'ask', l: 'Ask what the lottery would change', ck: ['pres', 12], ok: { t: 'Good question. {who} talks for five minutes and you play exactly what {they} described.', fx: { tie: 6 }, n: 'c', w: [1, 2] }, no: { t: '{who} says "just play it". You do. It\'s fine.', end: 'Auditioned for {film}.' } }] },
      c: { t: 'The callback', x: 'A callback for {film}. Chemistry read with the lead.',
        o: [{ k: 'chem', l: 'Make the scene partner look good', ck: ['col', 13], ok: { t: 'The lead asks for you by name afterwards. Your agent screams down the phone.', fx: { stand: 1.5, tie: 4 }, end: 'Got a callback for {film} and the lead asked for you.', mile: 'A callback on {film}' }, no: { t: 'No spark. It happens. They go with someone else.', fx: { tie: 2 }, end: 'Got a callback for {film}.' } }] }
    } },
  { id: 'the_mentor', name: 'An Old Hand', lv: [0, 3], need: () => typeof mentorOf === 'function' && mentorOf() === null, mk: c => { c.who = arcStranger([ME().role], 35); return c.who !== null; },
    stages: {
      a: { t: 'Someone notices', x: '{who}, a veteran {role}, has watched you work twice now. Today {they} ask{s} if you\'d like to grab a coffee after wrap.',
        o: [{ k: 'yes', l: 'Yes, immediately', ok: { t: 'One coffee becomes three hours. {They} tell{s} you the mistakes {they} made at your age, with names.', fx: { meet: null, tie: 8 }, n: 'b', w: [3, 6] } },
          { k: 'shy', l: 'Say you\'re busy (you panic)', ok: { t: 'You panic and say you\'re busy. You think about it all night.', fx: { stress: 3 }, n: 'b', w: [6, 10] } }] },
      b: { t: 'A real test', x: '{who} calls: {they} {is} short a pair of hands on a job next week, and it\'s above your level.',
        o: [{ k: 'go', l: 'Say yes and prove it', ck: ['eth', 13], ok: { t: 'You\'re out of your depth for a day and then you\'re not. {who} doesn\'t say anything, which is how you know.', fx: { tie: 10, stand: 1, rel: 'mentor' }, end: '{who} took you under {their} wing.', mile: '{who} became your mentor' }, no: { t: 'You make a mess of the first day. {who} helps you clean it up and you learn more from that than from anything else.', fx: { tie: 6, rel: 'mentor' }, end: '{who} took you under {their} wing, mess and all.' } },
          { k: 'honest', l: 'Say you\'re not ready', ok: { t: '{They} appreciate{s} the honesty and send{s} you a list of things to learn first.', fx: { tie: 4, xp: { vis: .2 } }, end: 'Told {who} you weren\'t ready yet.' } }] }
    } },
  { id: 'house_hunt', name: 'Somewhere to Escape', lv: [3, 7], need: () => S.me.cash >= usd(60000) && S.me.life !== 'house', mk: c => { c.amt = arcAmt(15000, 250000, .3); c.place = ppick(['a flat above a bakery', 'a narrow house with a crooked staircase', 'a top-floor place with a roof you can climb onto', 'a converted chapel', 'a bungalow with a garden somebody loved']); return true; },
    stages: {
      a: { t: 'A viewing', x: 'You\'ve been looking, half-seriously, for a weekend place out of the city. Then you see {place}. You can\'t stop thinking about it.',
        o: [{ k: 'offer', l: 'Make an offer', ck: ['cha', 12], ok: { t: 'The sellers like you. The offer is accepted, subject to everything.', n: 'b', w: [3, 5] }, no: { t: 'Someone outbids you by a hair. You\'re surprisingly upset.', fx: { stress: 5 }, end: 'Lost {place} to a higher bid.' } },
          { k: 'wait', l: 'Keep looking', ok: { t: 'You keep looking. Nothing else is quite it.', end: 'Looked at {place}, and let it go.' } }] },
      b: { t: 'The survey', x: 'The survey on {place} finds damp, a dodgy roof and something called "historic movement".',
        o: [{ k: 'haggle', l: 'Use it to bring the price down', ck: ['fin', 13], ok: { t: 'You knock {amt2} off. The roof gets fixed and the movement stays historic.', fx: { cash: '-amt2', stress: -4 }, end: 'Bought {place} as a weekend escape.', mile: 'Bought a weekend place: {place}', flag: 'retreat' }, no: { t: 'They won\'t budge. You pay it, and the roof.', fx: { cash: '-amt', stress: 3 }, end: 'Bought {place}, roof and all.', mile: 'Bought a weekend place: {place}', flag: 'retreat' } },
          { k: 'walk', l: 'Walk away', ok: { t: 'You walk away. Two weeks later you see someone else\'s curtains in the window.', fx: { stress: 2 }, end: 'Walked away from {place}.' } }] }
    }, mkAfter: c => { c.amt2 = Math.round(c.amt * .7); } },
];
const ARC_BY = {}; for (const a of ARCS) ARC_BY[a.id] = a;

// ---- running them ----
function arcActive() { return (S.me.arcs || []).filter(x => !x.done); }
function arcStart() {
  const M = S.me, L = careerLevel(), field = M.field || 'film', seen = M.arcSeen = M.arcSeen || {};
  const ok = ARCS.filter(a => L >= a.lv[0] && L <= a.lv[1] && (!a.fields || a.fields.includes(field)) && (seen[a.id] === undefined || S.week - seen[a.id] >= (a.cool || 260)) && !arcActive().some(x => x.id === a.id) && (!a.need || a.need()));
  for (let tries = 0; tries < 4 && ok.length; tries++) {
    const a = ok.splice(Math.floor(prnd() * ok.length), 1)[0], c = {};
    if (a.mk && a.mk(c) === false) continue;
    if (a.mkAfter) a.mkAfter(c);
    seen[a.id] = S.week; M.arcN = (M.arcN || 0) + 1;
    if (c.who !== null && c.who !== undefined) (M.arcWho = M.arcWho || {})[c.who] = S.week;
    M.arcs = (M.arcs || []).filter(x => !x.done || S.week - x.w < 260);
    M.arcs.push({ n: M.arcN, id: a.id, st: 'a', w: S.week, w0: S.week, c, part: 1 });
    return true;
  }
  return false;
}
function arcShow(x) {
  const a = ARC_BY[x.id], st = a && a.stages[x.st], M = S.me; if (!st) { x.done = true; return; }
  const choices = st.o.map(o => { const cost = arcCost(o.cost, x.c); return { k: o.k, label: arcFill(o.l, x.c), check: o.ck, cost, dis: cost && M.cash < cost ? 'Not enough in the bank' : undefined }; });
  if (choices.every(c => c.dis)) choices.push({ k: '_none', label: 'You can\'t stretch to it. Let it go.' });   // never a decision you can't make
  inbox('arc', `📖 ${a.name} · ${arcFill(st.t, x.c)}`, arcFill(st.x, x.c), Object.assign({ arc: x.n, choices }, x.c.who !== null && x.c.who !== undefined ? { person: x.c.who } : {}, x.c.film !== null && x.c.film !== undefined ? { film: x.c.film } : {}));
  x.shown = S.week;
}
function arcCost(v, c) { if (!v) return 0; if (typeof v === 'string') return Math.round(c[v] || 0); return Math.round(usd(v)); }
// each morning: a stage that's due shows up (one a day); midweek, perhaps a new story begins
function arcMorning() {
  const M = S.me, W = M && M.wk; if (!W || !M.party || !M.party.done) return;
  if (W.day === 5 && (M.flags || {}).retreat) M.stress = clamp(M.stress - 2, 0, 100);   // a weekend place: Saturdays out of town
  callsMorning();
  const due = arcActive().find(x => x.w <= S.week && x.shown !== S.week && !M.inbox.some(it => it.arc === x.n && !it.done));
  if (due && (W.day === 1 || W.day === 3 || W.day === 5 || (W.day === 6 && due.w < S.week))) { arcShow(due); return; }
  if (W.day === 2) {
    const n = arcActive().length, cap = careerLevel() >= 3 || lateRich() ? 2 : 1, gap = S.week - (M.arcLast || -99);
    if (n < cap && gap >= (n ? 6 : 3) && prnd() < (n ? .25 : .45)) { if (arcStart()) { M.arcLast = S.week; arcShow(arcActive().slice(-1)[0]); } }
  }
}
function arcFx(fx, c) {
  if (!fx) return;
  const M = S.me, me = ME(), f = Object.assign({}, fx);
  if (typeof f.cash === 'string') { const neg = f.cash[0] === '-', v = Math.round(c[f.cash.replace('-', '')] || 0); f.cash = neg ? -v : v; } else if (f.cash) f.cash = Math.round(usd(f.cash));
  const tie2 = f.tie2, trust2 = f.trust, rel = f.rel, rel2 = f.rel2, mile = f.mile, meetK = f.meet;
  delete f.tie2; delete f.trust; delete f.rel; delete f.rel2; delete f.mile; delete f.meet;
  lateFx(f, c);
  if (meetK === null && c.who !== null && c.who !== undefined) meet(c.who, null);
  else if (meetK) lateFx({ meet: meetK }, c);
  if (tie2 && c.who2 !== null && c.who2 !== undefined && P(c.who2)) { meet(c.who2, null); addTie(me, P(c.who2), tie2); }
  if (trust2 && c.who !== null && c.who !== undefined && M.known[c.who]) trust(c.who, trust2);
  if (rel && c.who !== null && c.who !== undefined && P(c.who) && !P(c.who).dead) { meet(c.who, null); setRel(c.who, rel); }
  if (rel2 && c.who2 !== null && c.who2 !== undefined && P(c.who2)) { meet(c.who2, null); setRel(c.who2, rel2); }
  if (mile) milestone(arcFill(mile, c), 'life');
}
function arcPick(it, k) {
  if (it.kind !== 'arc') return false;
  const M = S.me, x = (M.arcs || []).find(y => y.n === it.arc), a = x && ARC_BY[x.id], st = a && a.stages[x.st], o = st && st.o.find(q => q.k === k), ch = it.choices.find(q => q.k === k);
  it.done = true;
  if (!o || !ch) { it.result = { t: k === '_none' ? 'You let it go. Some things have to wait.' : 'It passes.' }; if (x) { x.done = true; x.end = x.end || `${a ? a.name : 'A story'}: let it go for lack of money.`; } return true; }
  if (ch.cost && M.cash < ch.cost) { it.result = { t: 'By the time you get round to it, the money isn\'t there.' }; x.done = true; return true; }
  if (ch.cost) M.cash -= ch.cost;
  const ok = o.ck ? roll(o.ck[0], o.ck[1]) : true, R = (ok ? o.ok : o.no || o.ok) || {};
  arcFx(Object.assign({}, R.fx, R.mile ? { mile: R.mile } : {}, R.flag ? { flag: R.flag } : {}), x.c);
  recalc(ME());
  it.result = { ok: o.ck ? ok : null, roll: o.ck ? M.lastRoll : null, t: arcFill(R.t || '', x.c), quip: o.ck && typeof stanceQuip === 'function' ? stanceQuip({ label: ch.label, check: o.ck }, ok, it) : null };
  if (R.n && a.stages[R.n]) { x.st = R.n; x.part++; const w = R.w || [1, 3]; x.w = S.week + w[0] + Math.floor(prnd() * (w[1] - w[0] + 1)); }
  else { x.done = true; x.end = arcFill(R.end || R.t || '', x.c); x.w1 = S.week; (M.arcLog = M.arcLog || []).push({ id: x.id, name: a.name, w0: x.w0, w1: S.week, end: x.end, who: x.c.who, film: x.c.film }); if (M.arcLog.length > 200) M.arcLog.shift(); }
  return true;
}
// ---- the phone rings ----
// Established people don't scan job boards: work finds them. With a name (level 3+) and nothing in your own craft on,
// every couple of months someone calls with a job at your level, no interview: yes or no.
function callsMorning() {
  const M = S.me, W = M.wk; if (W.day !== 0 || careerLevel() < 3 || typeof craftJob !== 'function') return;
  if (M.jobs.some(craftJob) || S.week - (M.callW || -99) < 8 || M.inbox.some(it => it.kind === 'offer' && !it.done)) return;
  if (prnd() > (lookingForWork() ? .25 : .45)) return;
  const floor = Math.max(1, tierLevel() - 1), L = M.board.filter(p => craftJob(p) && (p.tier || 1) >= floor && !blockedFrom(tmplOf(p)) && jobDays() + p.days <= 7 && !((tmplOf(p) || {}).actor && (p.tier || 1) >= 3 && (ME().fame || 0) < 20 + (p.tier || 1) * 5));   // nobody calls an unknown to offer a lead
  if (!L.length) return;
  // your own industry first, then the most senior; the very top pick varies, so it isn't the same job every time
  const home = q => (typeof postIndustry !== 'function' || postIndustry(q) === (M.field || 'film')) ? 1 : 0;
  L.sort((a, b) => home(b) - home(a) || (b.tier || 1) - (a.tier || 1) || b.rate - a.rate);
  const p = L[Math.floor(prnd() * Math.min(3, L.length))];
  const caller = p.head !== null && p.head !== undefined && M.known[p.head] ? p.head : (() => { const ids = aliveKnown().filter(id => opinion(id) > 5); return ids.length ? ppick(ids) : p.head; })();
  const who = caller !== null && caller !== undefined && P(caller) ? P(caller).name : 'A producer';
  M.callW = S.week;
  inbox('offer', `A call: ${p.t}`, `${who} calls. ${pickLine(['They asked for you by name.', 'Your name came up in a meeting and nobody argued.', 'Someone dropped out and you were the first call.', 'They\'ve seen your work, and they want it on this.', 'No interview, no list. They want you.'], S.week + p.id)} ${offerText(p)}`, { post: p, person: caller !== null && caller !== undefined ? caller : undefined, choices: [{ k: 'yes', label: 'Take it' }, { k: 'no', label: 'Turn it down' }] });
}
// Life tab: the stories of your life so far
function arcLogHTML() {
  const M = S.me, L = (M.arcLog || []).slice().reverse(), A = arcActive();
  if (!L.length && !A.length) return '';
  return `<section class="panel"><h3>Your stories <span class="count">${L.length}</span></h3>
    ${A.length ? `<p class="small muted">Still unfolding: ${A.map(x => `<b>${esc(ARC_BY[x.id].name)}</b> (part ${x.part})`).join(', ')}</p>` : ''}
    ${L.length ? `<ul class="plain small">${L.slice(0, 30).map(x => `<li><b>${esc(x.name)}</b> <span class="muted">${fmtDate(x.w0, true)}${x.w1 > x.w0 ? ' – ' + fmtDate(x.w1, true) : ''}</span><br>${esc(x.end)}</li>`).join('')}</ul>` : ''}</section>`;
}
