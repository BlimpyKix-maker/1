// ---------------- Chatter: what people text and email about when nothing's on fire ----------------
// Friends text about their shoots, your news, the season, the city, the film they watched last night, the person
// they saw at the supermarket. The inbox fills with the rest of a life: the union, your cinema, your old school, a
// journalist, your family. Everything is filled from the world as it is that week, so it reads like it's about
// your life and not anyone's. Choices come from hashes of the week and the person, never the game's dice.

// ---- texts ----
const CHAT = {
  shoot: ['day {n} on {film}. we\'re behind, it\'s raining, and the catering is incredible', 'we got the big scene on {film} in one take today and the crew applauded. it\'s been that kind of week', 'first week on {film} done. I have slept eleven hours total', '{film} update: the lead has adopted a pigeon. it has a chair now', 'night shoots on {film} all week. I have forgotten what the sun is for', 'the director of {film} just said "one more" for the ninth time. send help', 'we\'re shooting {film} in a real hospital and I keep apologising to patients'],
  news: ['just saw the news about {mile}!! are you kidding?? proud of you', 'saw it in the trades: {mile}. look at you', 'ok so {mile}?? when were you going to tell me', 'my mum read about {mile}. she\'s telling her whole book club', 'congratulations on {mile}! drinks are on you, obviously'],
  m0: ['new year resolution: finish the script. it\'s the 4th. I have not opened the script', 'january in {city}: everyone\'s broke and pretending to be on a cleanse', 'happy new year! this is the one. I can feel it. I say that every year'],
  m1: ['awards season is my sport. who wins best film, go', 'I\'ve watched every nominee this year. I need a hobby that isn\'t films', 'my predictions for the big night are locked. loser buys dinner'],
  m2: ['spring in {city} and suddenly everyone is shooting outdoors', 'blossom everywhere. I\'ve taken forty photos of one tree', 'it\'s finally light after 6pm. I feel like a new person'],
  m5: ['too hot to think. come to the beach', 'every set in {city} is a sauna this week', 'summer blockbuster season: I\'m going to see everything with an explosion in the trailer'],
  m9: ['horror season! movie night at mine, bring something terrifying', 'I carved a pumpkin to look like a clapperboard. nobody understands it', 'watched three horror films alone last night. sleeping with the light on, no regrets'],
  m11: ['office party season. which ones are you going to', 'it\'s snowing in my heart and also on my car', 'what are you doing for the holidays? if the answer is "sleeping" I respect it'],
  city: ['found a tiny bar near {place} that only plays film scores', 'they\'re filming something on {place} and have blocked my entire street', 'the best coffee in {city} is at the laundrette near {place}. trust me', 'went for a walk round {place} and ended up as an extra in someone\'s music video', 'a man near {place} was walking a cat on a lead. the cat was in charge', 'there\'s a new noodle place by {place}. we\'re going. that\'s not a question'],
  film: ['have you seen {title}? watch it tonight and call me', 'rewatched {title}. it holds up. the ending!!', 'unpopular opinion: {title} is better than its reputation', 'just found out {title} was shot in nineteen days. how', 'can\'t stop thinking about the last shot of {title}', 'is {title} a comfort film or a cry film? asking for me'],
  gossip: ['{other} just booked something huge. don\'t tell anyone I told you', 'saw {other} at the supermarket in sunglasses. indoors. at night', 'is it me or is {other} everywhere this month', '{other} sent a 2,000-word email about a fire exit. I have so many questions', 'heard {other} has a new project. heard it\'s "a lot"'],
  life: ['bad day. tell me something good', 'I adopted a plant. it already looks disappointed in me', 'my landlord wants to "have a chat". pray for me', 'learning to cook. the smoke alarm is learning too', 'my mum asked when I\'m getting a real job. again', 'ran 5k this morning. telling everyone', 'can\'t sleep. thinking about that scene in {title}', 'I\'ve started journaling. day one: "I don\'t know what to write"', 'bought a fancy coffee machine. I am now a coffee person. it\'s my whole personality', 'my neighbour is learning the trumpet. it\'s going about as well as you\'d think'],
  biz: ['they want a "gritty reboot" of a cereal advert. I wish I was joking', 'an agent called me "kiddo" today. I am 34', 'a producer said "let\'s circle back" and then left the building', 'if one more person says "content" I\'m moving to a farm', 'got notes on my script that just said "more"', 'a casting call asked for "someone who looks like they\'ve seen things but is fun at parties"', 'the trades say the industry is "in transition". it has been in transition my whole life'],
  plan: ['brunch sunday? I\'ll book somewhere with good eggs', 'film club this month: you pick', 'double bill at the rep cinema on friday. you, me, terrible popcorn?', 'we should do a pub quiz. I need someone who knows cinematographers', 'let\'s go to a matinee like retired people. midweek, empty cinema, perfect'],
  memory: ['remember the party where we met? I still think about that dip', 'found a photo of us near {place} from ages ago. we look so young', 'I just walked past the place where we had that terrible coffee. good times', 'do you remember our first job? I still have the lanyard']
};
function chatSeed(id) { return hashRand(S.week * 977 + id * 131 + ((S.me && S.me.phoneN) || 0) * 7); }
function chatterText(id) {
  const M = S.me, q = P(id), r = chatSeed(id), pk = L => L[Math.floor(r() * L.length)];
  const f = typeof theirActive === 'function' ? theirActive(id) : null, mon = dateOf(S.week).getUTCMonth();
  const mile = (M.milestones || []).filter(m => S.week - m.w <= 3 && ['credit', 'prize', 'film', 'level', 'work'].includes(m.kind)).pop();
  const others = Object.keys(M.known).map(Number).filter(x => x !== id && P(x) && !P(x).dead);
  const films = S.films.filter(g => g.rel !== null && g.rel > S.week - 52 * 8 && (g.reviews || 0) >= 60);
  const H = HUBS[M.hub] || {}, place = (H.places || ['the high street'])[Math.floor(r() * (H.places || [1]).length)];
  const cats = ['city', 'film', 'life', 'biz', 'plan', 'memory', 'life', 'film'];
  if (f) cats.push('shoot', 'shoot', 'shoot');
  if (mile) cats.push('news', 'news', 'news', 'news');
  if (others.length) cats.push('gossip', 'gossip');
  if (CHAT['m' + mon]) cats.push('m' + mon, 'm' + mon);
  const cat = pk(cats), title = films.length ? films[Math.floor(r() * films.length)].title : 'that film';
  const day = f ? Math.max(1, Math.round((S.week - (f.stageStartW || f.stageEnd - 6 || S.week)) * 5 + r() * 4)) : 3;
  return pk(CHAT[cat]).replace('{film}', f ? f.title : 'this shoot').replace('{n}', String(clamp(day, 2, 60))).replace('{mile}', mile ? (/: (.+)$/.test(mile.t) ? mile.t.match(/: (.+)$/)[1] : 'your news') : 'your news')
    .replace(/\{city\}/g, hubName(M.hub)).replace(/\{place\}/g, String(place).replace(/^the /i, 'the ')).replace(/\{title\}/g, title).replace('{other}', others.length ? P(others[Math.floor(r() * others.length)]).name.split(' ')[0] : 'someone');
}

// ---- email: the rest of a life ----
const LIFE_MAIL = [
  ['news', 'Your union', 'Union news', 'Day rates go up {pct}% from January. A reminder that turnaround is ten hours, not "ten-ish". The annual meeting has free sandwiches and an argument about parking.'],
  ['news', 'The {city} Repertory Cinema', 'This month at the Rep', 'This month: a season of {genre} films, a silent classic with live piano, and a midnight screening of {title} that will sell out in an hour. Members get in free on Tuesdays.'],
  ['news', 'Alumni office', 'Alumni news', 'Your class is having a reunion. Three of your classmates have films out this year, one has a podcast, and one has opened a bakery that is, apparently, excellent.'],
  ['news', 'Film Society', 'Screening list', 'Coming up: {title}, a documentary about projectionists, and a quiz night where the prize is a 1970s light meter.'],
  ['news', 'Festival office', 'Submissions are open', 'Submissions for this year\'s {fest} are open. Early-bird fee until the end of the month. Please, for the love of everything, check your subtitles.'],
  ['news', 'Rental house', 'Spring sale', 'We\'re clearing out last year\'s kit: lenses, lights, a dolly with personality. Industry discount for anyone with a crew card.'],
  ['news', 'Your streaming service', 'Because you watched {title}', 'We think you\'ll like: eleven films with "{word}" in the title and a documentary about competitive gardening.'],
  ['news', 'The Daily Slate', 'Ten films to see this month', 'Our critics pick ten, starting with {title}. Number seven will divide the room. Number three will make you call your mother.'],
  ['inbox', 'A journalist, {paper}', 'A quick quote?', 'Hi {me}, I\'m writing a piece about working in {city} right now and a colleague said you\'d be honest. Ten minutes on the phone, whenever suits?'],
  ['inbox', 'A film student', 'Advice for a first-year?', 'Hi {me}, sorry to email out of the blue. I\'m in my first year and I love your work. If you could tell your younger self one thing, what would it be? I\'ll understand if you\'re too busy.'],
  ['inbox', 'Home', 'Call your mother', 'She says you haven\'t called in a fortnight and she saw a programme about how dangerous {city} is. Also the dog misses you. Love, everyone.'],
  ['inbox', 'Your old teacher', 'I saw your name', 'I saw your name in a newspaper and told my whole class I taught you. They were not as impressed as I was. I hope you\'re well, and eating properly.'],
  ['inbox', 'Your landlord', 'Boiler service, Thursday', 'An engineer will be round on Thursday between 8am and 6pm to look at the boiler. Please make sure there is access. Please also stop leaving film reels in the hallway.'],
  ['inbox', 'The dental practice', 'Appointment reminder', 'This is a reminder that you are overdue a check-up. We know you\'re busy. Teeth don\'t care.'],
  ['inbox', 'Your bank', 'A new card is on its way', 'Your new card will arrive within five working days. Your old card will keep working until it doesn\'t.'],
  ['inbox', 'A neighbour', 'Your parcel', 'Hi, I\'ve got a parcel for you. It\'s heavy and it clanks. I\'m in most evenings. No rush, but it\'s in my hallway and the cat has opinions about it.'],
  ['inbox', 'A podcast producer', 'Would you come on the show?', 'Hi {me}, we do a show about how films actually get made, and we\'d love an hour with you. Remote is fine. The host asks good questions and laughs too loudly.'],
  ['inbox', 'Your old flatmate', 'Guess who', 'Remember me? I\'m back in {city} for a week and I still owe you for that pizza. Coffee? I\'ll bring the money and an apology.'],
  ['inbox', 'Museum of the Moving Image', 'Would you donate something?', 'We\'re building a collection about working film crews and wondered if you had a call sheet, a lanyard or a story we could keep.'],
  ['inbox', 'A screenwriting group', 'You\'re invited', 'We meet every other Wednesday in the back room of a pub near {place}. Ten pages each, honest notes, no egos. Well, small egos.'],
  ['news', 'The {city} film commission', 'New incentives', 'The city has announced new incentives for productions shooting locally. Expect more crews, more blocked streets and more jobs.'],
  ['news', 'Weekend weather', 'Sunshine this weekend', 'Bright and warm in {city} all weekend. Perfect for exterior shoots, picnics and pretending you\'re not checking your email.'],
  ['news', 'Box office report', 'The weekend\'s numbers', '{title} led the weekend. Two newcomers opened soft, a horror film doubled its budget, and somebody\'s passion project quietly found its audience.'],
  ['inbox', 'Your gym', 'We miss you', 'It\'s been a while! Your membership is still active, which is to say we\'re still taking your money. Come back. The rowing machine misses you.'],
  ['inbox', 'Charity screening committee', 'Volunteers needed', 'We need volunteers for a charity screening next month: ushering, raffle, holding a bucket and smiling. All proceeds go to the children\'s hospital.']
];
const PAPERS_CH = ['The Daily Slate', 'Screen Weekly', 'The Hollywood Ledger', 'The Evening Courier', 'Reel World'];
function chatterMailWeek(r) {
  const M = S.me; if (!M || r() > .45) return;
  const T = LIFE_MAIL[Math.floor(r() * LIFE_MAIL.length)], films = S.films.filter(g => g.rel !== null && g.rel > S.week - 52 * 6 && (g.reviews || 0) >= 55);
  const H = HUBS[M.hub] || {}, place = (H.places || ['the high street'])[Math.floor(r() * (H.places || [1]).length)], fest = typeof FESTIVALS !== 'undefined' && FESTIVALS.length ? FESTIVALS[Math.floor(r() * FESTIVALS.length)].name : 'the festival';
  const fill = s => s.replace(/\{me\}/g, ME().name.split(' ')[0]).replace(/\{city\}/g, hubName(M.hub)).replace(/\{place\}/g, place).replace(/\{title\}/g, films.length ? films[Math.floor(r() * films.length)].title : 'the big film').replace('{genre}', String(['noir', 'musical', 'western', 'horror', 'science-fiction'][Math.floor(r() * 5)])).replace('{pct}', String(2 + Math.floor(r() * 4))).replace('{fest}', fest).replace('{paper}', PAPERS_CH[Math.floor(r() * PAPERS_CH.length)]).replace('{word}', String(TW.noun[Math.floor(r() * TW.noun.length)]));
  mail(T[0], fill(T[1]), fill(T[2]), fill(T[3]));
}
