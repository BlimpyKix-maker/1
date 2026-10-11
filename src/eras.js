// ---------------- When the business changes under you ----------------
// The industry's history arrives as it happened, market by market, and some of it lands on you. Sound comes to
// Hollywood in 1927 and to Bombay in 1931; the Production Code is enforced from 1934 to 1968; war drafts the young;
// the blacklist runs from 1947 to 1960; the studios lose their cinemas in 1948; television empties the theatres in
// the fifties; home video and then digital change who can make a film and where the money comes from.
// Each card is news for everyone and a decision for the people it touches (a voice test for silent actors, the
// censor's notes for writers and directors, a subpoena for people with a name). What you choose can follow you for
// years: a failed voice test or a blacklisting shows up as its own line in your odds on every job.
const ERA_NEWS = [
  { y: 1927, wk: 40, m: ['US', 'CA'], t: 'A feature with synchronised songs and dialogue opens in New York. The audience stands up and cheers. Every studio orders sound stages.' },
  { y: 1929, wk: 14, m: ['UK', 'FR', 'DE', 'IT', 'SE', 'DK', 'ES'], t: 'The first home-grown talkies open. The silent picture business has perhaps a year left.' },
  { y: 1931, wk: 10, m: ['IN', 'JP', 'CN', 'HK', 'MX', 'BR', 'AR', 'EG'], t: 'Sound reaches the local studios: the first talkie in the national language sells out for months.' },
  { y: 1934, wk: 27, m: ['US'], t: 'The Production Code is now enforced: no film opens without a certificate. Kisses are timed, crime never pays, and married couples sleep in twin beds.' },
  { y: 1939, wk: 36, m: ['UK', 'FR', 'DE', 'PL', 'CZ'], t: 'War in Europe. Studios are requisitioned, film stock is rationed, and the newsreels become the most important films being made.' },
  { y: 1941, wk: 50, m: ['US', 'CA'], t: 'War. The studios lose their young men to the draft, raw stock goes on ration, and Washington asks Hollywood for training films and morale.' },
  { y: 1945, wk: 33, m: null, t: 'The war is over. Directors come home from the service film units with new habits: real locations, real faces, handheld cameras.' },
  { y: 1947, wk: 43, m: ['US'], t: 'A congressional committee calls Hollywood writers and directors to testify about communism. Ten refuse to answer and are cited for contempt.' },
  { y: 1948, wk: 18, m: ['US'], t: 'The Supreme Court orders the studios to sell their cinema chains. Contract lists are cut; the studio system starts coming apart.' },
  { y: 1953, wk: 38, m: ['US', 'CA', 'UK'], t: 'Television is in half of all homes and cinema attendance is falling fast. The studios answer with widescreen, colour and spectacle.' },
  { y: 1960, wk: 3, m: ['US'], t: 'A blacklisted writer\'s real name goes back on a big studio picture. The blacklist doesn\'t end in a day, but it breaks.' },
  { y: 1968, wk: 44, m: ['US'], t: 'The Production Code is replaced by a ratings system. Films can now be made for adults, and say so on the poster.' },
  { y: 1975, wk: 25, m: ['US', 'CA'], t: 'A shark film opens on hundreds of screens at once, backed by television advertising, and becomes the biggest film ever made. Summer will never be the same.' },
  { y: 1980, wk: 10, m: null, t: 'Video recorders are selling in the millions. A new business is renting films for the weekend, and old films suddenly earn again.' },
  { y: 1999, wk: 30, m: null, t: 'A feature shot on cheap digital video becomes a sensation. Anyone with a camcorder and a laptop can make a film now, and many do.' },
  { y: 2009, wk: 50, m: null, t: 'The cinemas are converting to digital projection: no more prints, no more reels. Distribution costs collapse; the projectionist\'s job goes with them.' }
];
function eraMarket() { return S.me && HUBS[S.me.hub] ? HUBS[S.me.hub].m : 'US'; }
function eraHere(L) { return !L || L.includes(eraMarket()); }
function eraMods() { return (S.me.eraMods = S.me.eraMods || {}); }
function eraActive(k) { const v = eraMods()[k]; return v !== undefined && S.year <= v; }
const eraRole = (...R) => () => R.includes(ME().role);
const eraYears = (a, b, L) => () => S.year >= a && S.year <= b && eraHere(L);
LATE.push(
  { id: 'era_voice', pool: 'era', once: 1, need: () => eraRole('actor')() && S.year <= 1933 && S.year >= ({ US: 1928, CA: 1928, UK: 1929, FR: 1929, DE: 1929, IT: 1930, SE: 1929, DK: 1929, ES: 1930 }[eraMarket()] || 1931), title: 'The voice test', text: () => 'Every actor under contract has to make a sound test this month. A microphone hangs over a table; a man in headphones listens behind glass. Stars have been finished by a single reel.',
    opts: [
      { k: 'lessons', label: () => 'Elocution lessons first, then the test', cost: () => usd(600), check: ['voice', 12], go: (c, ok) => { lateFx(ok ? { stand: 2, xp: { voice: .4 } } : { stress: 6, xp: { voice: .4 } }); if (!ok) eraMods().silent = S.year + 2; return ok ? 'Six weeks of vowels pay off. The man behind the glass gives a thumbs up.' : 'Better, but not enough. The studio quietly moves you down the call sheet.'; } },
      { k: 'asis', label: () => 'Take it as you are', check: ['voice', 14], go: (c, ok) => { lateFx(ok ? { stand: 3, fame: 2 } : { stand: -4, stress: 10 }); if (!ok) eraMods().silent = S.year + 3; return ok ? 'Your voice records beautifully. You have a talking-picture career, and some of your old co-stars don\'t.' : 'The playback is high and thin. The trades call you "a silent star". It isn\'t a compliment any more.'; } },
      { k: 'stage', label: () => 'Go back to the stage for a season and learn to speak', go: c => { lateFx({ stress: 4, xp: { voice: .8, pres: .3 } }); return 'Eight shows a week, no microphone. You come back with a voice that fills a room.'; } }] },
  { id: 'era_code', pool: 'era', cool: 156, need: () => eraRole('writer', 'director', 'producer')() && eraYears(1934, 1967, ['US'])() && ((S.me.scripts || []).length || ME().credits.length), title: 'The censor\'s notes', text: () => 'The Production Code office has read your script. Fourteen notes: the kiss is too long, the wife is too knowing, the crook gets away with it, and a word on page 40 is "unacceptable in any context".',
    opts: [
      { k: 'comply', label: () => 'Make every change', go: c => { lateFx({ stress: 3, stand: .5 }); return 'You make the changes. The film gets its certificate. Something in it has gone quiet.'; } },
      { k: 'fight', label: () => 'Go and argue the big ones', check: ['cha', 14], go: (c, ok) => { lateFx(ok ? { stand: 1, stress: 2 } : { stress: 8, stand: -1 }); return ok ? 'You keep the ending and lose the kiss. The man at the Code office says you\'re "persuasive, for a writer".' : 'They dig in. The studio sides with them, and wonders aloud whether you\'re worth the trouble.'; } },
      { k: 'subtext', label: () => 'Say it all in subtext instead', check: ['orig', 13], go: (c, ok) => { lateFx(ok ? { xp: { orig: .3, tone: .3 }, stand: 1 } : { stand: -1, stress: 5 }); return ok ? 'A glance, a cigarette, a cut to the fireworks. The censor passes it; every critic in town understands exactly what happened.' : 'They spot it. A stern letter goes to the studio, with your name underlined.'; } }] },
  { id: 'era_war', pool: 'era', once: 1, need: () => S.year >= 1942 && S.year <= 1944 && eraHere(['US', 'CA', 'UK']) && ageOf(ME()) >= 18 && ageOf(ME()) <= 40, title: 'The war wants you', text: () => `${ME().g === 'F' ? 'The women\'s services are recruiting, and the army\'s film unit needs editors and writers.' : 'Your draft notice arrives. A friend says the army\'s film unit needs people who know which end of a camera is which.'}`,
    opts: [
      { k: 'unit', label: () => 'Join the service film unit', go: c => { lateFx({ stand: 3, xp: { comp: .6, vstory: .6, setm: .4 }, stress: 8, meet: 'director', meetTag: 'Served with you in the film unit', mile: 'Made training films in the war' }); return 'Two years of training films, newsreels and one documentary that wins a prize. You come home knowing how to shoot anything, anywhere, fast.'; } },
      { k: 'defer', label: () => 'Ask for a deferment: essential industry', check: ['cha', 13], go: (c, ok) => { lateFx(ok ? { stress: 4 } : { stand: -2, stress: 10, xp: { comp: .3 } }); return ok ? 'Morale films count as essential. You keep working, and don\'t talk about it at parties.' : 'Denied. You end up in the film unit anyway, a few months late and without the friends who signed up first.'; } },
      { k: 'front', label: () => 'Enlist for the front', go: c => { lateFx({ stand: 4, stress: 20, energy: -20, mile: 'Served in the war' }); return 'You come back two years later. You don\'t talk about it. You make very different films.'; } }] },
  { id: 'era_huac', pool: 'era', once: 1, need: () => eraRole('writer', 'director', 'actor', 'producer')() && eraYears(1947, 1953, ['US'])() && ME().standing >= 15, mk: c => { c.who = lateWho('known'); }, title: 'A subpoena', text: c => `A man in a grey suit hands you an envelope at the studio gate: you're to appear before the committee. Your lawyer says they'll ask you to name people you've seen at meetings${c.who !== null ? `, and that ${lname(c.who)}'s name is already on their list` : ''}.`,
    opts: [
      { k: 'names', label: () => 'Name names', go: c => { lateFx({ stand: 1, stress: 18, mile: 'Named names to the committee' }); const L = Object.keys(S.me.known).map(Number).filter(id => P(id) && !P(id).dead && ['writer', 'director', 'actor'].includes(P(id).role)).slice(0, 6); for (const id of L) { addTie(ME(), P(id), -15); if (typeof remember === 'function') remember(id, -6, 'Named names to the committee'); } return 'You keep working. Some people cross the street when they see you, for the rest of your life.'; } },
      { k: 'refuse', label: () => 'Refuse to answer', go: c => { eraMods().blacklist = 1960; lateFx({ stand: -6, fame: 3, stress: 15, mile: 'Refused to testify; blacklisted' }); if (c.who !== null) addTie(ME(), P(c.who), 15); return 'You\'re cited for contempt. The studio lets you go the same week. Nobody in town will hire you under your own name until the blacklist breaks.'; } },
      { k: 'abroad', label: () => 'Take the next boat to Europe', go: c => { eraMods().blacklist = 1960; lateFx({ stress: 10, intl: 5, mile: 'Left for Europe ahead of the blacklist' }); return 'London, then Rome. The work is smaller and freer. Hollywood won\'t hire you until the blacklist breaks, but Europe doesn\'t care. (Places is how you\'d move.)'; } }] },
  { id: 'era_front', pool: 'era', cool: 26, need: () => eraActive('blacklist') && S.year < 1960 && ME().role === 'writer', mk: c => { c.who = lateWho('friend'); }, needC: c => c.who !== null, title: 'A front', text: c => `${lname(c.who)} has an offer: they'll put their name on your script and pass you the money, less a cut. It's done all over town.`,
    opts: [
      { k: 'yes', label: () => 'Write it under their name', go: c => { lateFx({ cash: usd(3000), xp: { struc: .2, dial: .2 }, tie: 6, mile: 'Wrote under a front\'s name' }, c); return 'The film does well. Someone else collects the credit and, one day, an award. You keep the cheque and the draft with your real name on it.'; } },
      { k: 'no', label: () => 'Not like that', go: c => { lateFx({ stress: 4 }); return 'You say no. Pride is expensive this decade.'; } }] },
  { id: 'era_decree', pool: 'era', once: 1, need: () => eraRole('actor', 'director', 'writer')() && eraYears(1948, 1950, ['US'])(), title: 'The contract list', text: () => 'With the cinemas sold off, the studio is cutting its contract list. Your agent says you can stay on at a smaller salary, or go freelance and take your chances film by film.',
    opts: [
      { k: 'free', label: () => 'Go freelance', check: ['com', 12], go: (c, ok) => { eraMods().freelance = S.year + 4; lateFx(ok ? { stand: 1, stress: 4 } : { stress: 10, cash: -usd(500) }); return ok ? 'Picture by picture, at your price. The independents are hiring.' : 'A thin year. Then the independents start calling.'; } },
      { k: 'stay', label: () => 'Take the smaller salary', go: c => { lateFx({ cash: usd(1500), stress: -2 }); return 'Security, for now. You watch friends who left get the interesting parts.'; } }] },
  { id: 'era_tv', pool: 'era', once: 1, need: () => eraYears(1953, 1958, ['US', 'CA', 'UK'])() && ME().standing >= 8, title: 'The small screen', text: () => 'A television producer wants you for a live weekly drama. In the film business, people still say "television" the way they say "a rash".',
    opts: [
      { k: 'tv', label: () => 'Take it: live, every week', check: ['com', 12], go: (c, ok) => { lateFx(ok ? { fame: 4, cash: usd(4000), xp: { pace: .3, setm: .3 } } : { stress: 10, cash: usd(2000) }); return ok ? 'Live television is terrifying and wonderful. Twenty million people know your name by the spring.' : 'A camera fails on air. You improvise for six minutes. The money is good; the nerves are shot.'; } },
      { k: 'wide', label: () => 'Stay with pictures: bet on widescreen', go: c => { lateFx({ stand: .5, xp: { comp: .3 } }); return 'You learn to fill a screen twice as wide. It\'s the right bet, for a while.'; } }] },
  { id: 'era_video', pool: 'era', once: 1, need: () => S.year >= 1980 && S.year <= 1985 && ME().credits.length >= 2, title: 'Your old films, on tape', text: () => 'A video label wants your old films for the rental shops. The contracts from back then never mentioned videotape; your lawyer thinks you\'re owed something.',
    opts: [
      { k: 'push', label: () => 'Push for a royalty', check: ['cha', 13], go: (c, ok) => { lateFx(ok ? { cash: usd(6000) } : { cash: usd(1500), stress: 4 }); return ok ? 'A royalty on every tape. Old work pays the rent, for the first time.' : 'A one-off fee and a handshake. Better than nothing.'; } },
      { k: 'sign', label: () => 'Sign what they offer', go: c => { lateFx({ cash: usd(2500) }); return 'A cheque arrives. Then your face turns up on a shelf in every corner shop.'; } }] },
  { id: 'era_digital', pool: 'era', once: 1, need: () => S.year >= 1999 && S.year <= 2004, title: 'A camera that costs less than a car', text: () => 'A friend shows you a feature they shot on a borrowed digital camcorder and cut on a laptop. It\'s rough, and it\'s in a festival.',
    opts: [
      { k: 'learn', label: () => 'Learn to shoot and cut digital', go: c => { lateFx({ xp: { comp: .3, rhythm: .3, digi: .3 }, stress: 2 }); return 'Weekends with a camcorder. The old rules about who gets to make films are breaking, and you know how.'; } },
      { k: 'film', label: () => 'Stick with film: it looks better', go: c => { lateFx({ xp: { light: .2 } }); return 'It does look better. For now.'; } }] }
);
for (const t of LATE) LATE_BY[t.id] = t;
function eraWeek() {
  const M = S.me; if (!M) return; const k = woy();
  for (const e of ERA_NEWS) if (e.y === S.year && e.wk === k && eraHere(e.m)) news('Industry', e.t);
  if (!pending().some(it => it.kind === 'late') && prnd() < .2) lateOffer('era');
}
// what an era did to you, in your odds
{ const _hf = hireFactors; hireFactors = function (post) {
  const F = _hf(post); if (!S.me) return F; const hub = post.away || (post.film !== null && post.film !== undefined && S.films[post.film] ? S.films[post.film].hub : S.me.hub), us = HUBS[hub] && HUBS[hub].m === 'US', t = tmplOf(post) || {};
  if (eraActive('blacklist') && S.year < 1960 && us) F.push(['Blacklisted', -2.4]);
  if (eraActive('silent') && ME().role === 'actor' && /act|cast|role|part/i.test((post.t || '') + (t.cat || ''))) F.push(['A silent-era voice', -.9]);
  if (eraActive('freelance')) F.push(['Freelance, film by film', .25]);
  return F; }; }
