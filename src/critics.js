// ---------------- Roger That: the review aggregator, the critics, and the critic's career ----------------
// Every released film gets a Rogerscore (the average of its reviews) and a Thumb-o-meter (the share of critics who
// liked it). Reviews come from this world's critics and outlets, each with an era, a beat and a temperament, so a 1940s
// western is reviewed by the fusty paper of record and a 2020s horror film by the website crowd. The classics carry fun
// takes on their famous real reviews. Players can review too: freelance, on staff, or on their own blog, and once you're
// read widely enough your reviews count in the score. Display-only: nothing here rolls the world's dice.
const OUTLETS = [
  ['clarion', 'The Daily Clarion', 'newspaper', 1851, null, 1], ['suntrib', 'The Chicago Sun-Tribune', 'newspaper', 1948, null, 1], ['tribulation', 'The Chicago Tribulation', 'newspaper', 1847, null, 1],
  ['newyorkish', 'The New Yorkish', 'magazine', 1925, null, 1], ['varietal', 'Varietal', 'trade paper', 1905, null, 1], ['reporterer', 'The Hollywood Reporterer', 'trade paper', 1930, null, 1],
  ['vox', 'The Village Vox', 'weekly', 1955, 2018, 2], ['timeline', 'The Los Angeles Timeline', 'newspaper', 1881, null, 1], ['guardsman', 'The Guardsman', 'newspaper', 1821, null, 1],
  ['thamestimes', 'The Thames Times', 'newspaper', 1785, null, 1], ['observant', 'The Observant', 'Sunday paper', 1791, null, 2], ['soundings', 'Sight & Soundings', 'film magazine', 1932, null, 2],
  ['cahiers', 'Cahiers du Cinémanie', 'film magazine', 1951, null, 2], ['mondain', 'Le Mondain', 'newspaper', 1944, null, 1], ['timeoff', 'Time Off', 'listings magazine', 1968, null, 2],
  ['scone', 'Rolling Scone', 'magazine', 1967, null, 1], ['empyre', 'Empyre', 'film magazine', 1989, null, 2], ['indiewired', 'IndieWired', 'website', 1996, null, 2],
  ['vulturine', 'Vulturine', 'website', 2007, null, 2], ['clubhouse', 'The A.V. Clubhouse', 'website', 1993, null, 3], ['filmmm', '/Filmmm', 'website', 2005, null, 3],
  ['timely', 'Timely Magazine', 'news magazine', 1923, null, 1], ['newsweak', 'Newsweak', 'news magazine', 1933, null, 2], ['notion', 'The Notion', 'magazine', 1865, null, 3],
  ['poster', 'The New York Poster', 'tabloid', 1801, null, 3], ['balcony', 'Balcony Seats', 'television', 1975, 2010, 1], ['junpo', 'Kinema Junpo-ish', 'film magazine', 1919, null, 2],
  ['filmfair', 'Filmfair', 'film magazine', 1952, null, 2], ['letterbox', 'Letterbocks', 'social reviews', 2011, null, 3]
];
const OUTLET = Object.fromEntries(OUTLETS.map(o => [o[0], { k: o[0], name: o[1], kind: o[2], from: o[3], to: o[4], tier: o[5] }]));
// [name in this world, outlet, from, to, temperament, genre tastes]
const CRITICS = [
  ['Roger Everett', 'suntrib', 1967, 2013, 'warm', { Documentary: 6, Drama: 4, Horror: -3 }], ['Gene Sizzle', 'tribulation', 1969, 1999, 'tough', { Drama: 3, Comedy: -2 }],
  ['Pauline Kale', 'newyorkish', 1968, 1991, 'acid', { Crime: 8, Action: 3, Musical: -8, Period: -5 }], ['Bosley Crowfoot', 'clarion', 1940, 1967, 'fusty', { Crime: -8, Horror: -10, Period: 5, War: 4 }],
  ['Andrew Sarrus', 'vox', 1960, 1989, 'auteurist', { Western: 6, Crime: 3 }], ['Molly Haskel', 'vox', 1969, 1990, 'sharp', { Romance: 4, Drama: 3 }],
  ['Vincent Candy', 'clarion', 1969, 1993, 'urbane', { Comedy: 4 }], ['Janet Muslin', 'clarion', 1977, 1999, 'urbane', { Drama: 3 }],
  ['A. O. Scotch', 'clarion', 2000, 2023, 'scholarly', { Drama: 3, Superhero: -6 }], ['Manola Dargiss', 'clarion', 2004, null, 'scholarly', { Drama: 4, Superhero: -8, Documentary: 4 }],
  ['Peter Bradshore', 'guardsman', 1999, null, 'witty', { Comedy: 2 }], ['Mark Kermudgeon', 'observant', 2013, null, 'enthusiast', { Horror: 8, Animation: 3 }],
  ['Leonard Malted', 'timely', 1969, 2025, 'guidebook', {}], ['Richard Rooper', 'suntrib', 2000, null, 'populist', { Action: 4 }],
  ['Anthony Laine', 'newyorkish', 1993, null, 'witty', { Action: -3, Period: 3 }], ['David Denbie', 'newyorkish', 1998, 2014, 'scholarly', { Drama: 3 }],
  ['Wesley Morrow', 'clarion', 2000, null, 'sharp', { Comedy: 3, Romance: 3 }], ['Justin Chung', 'timeline', 2016, null, 'scholarly', { Drama: 3 }],
  ['Kenneth Turran', 'timeline', 1991, 2020, 'warm', { Documentary: 5 }], ['James Agley', 'timely', 1941, 1948, 'poetic', { Drama: 5, War: 4 }],
  ['Dilys Pole', 'thamestimes', 1939, 1976, 'fusty', { Period: 4 }], ['C. A. Lejeunesse', 'observant', 1928, 1960, 'fusty', { Comedy: 2 }],
  ['André Bazaine', 'cahiers', 1951, 1958, 'theorist', { Drama: 5 }], ['François Trufaux', 'cahiers', 1953, 1959, 'polemic', { Crime: 4, Period: -10 }],
  ['Owen Gleibermeyer', 'varietal', 1990, null, 'populist', { Action: 3 }], ['Peter Travis', 'scone', 1989, 2020, 'enthusiast', { Action: 5 }],
  ['Kim Newmann', 'empyre', 1989, null, 'enthusiast', { Horror: 8, 'Sci-fi': 5 }], ['Alison Wilmor', 'vulturine', 2019, null, 'sharp', {}],
  ['David Ehrlichson', 'indiewired', 2014, null, 'witty', { Drama: 2 }], ['Stephanie Zachary', 'timely', 2013, null, 'warm', {}],
  ['Armond Whitish', 'poster', 1997, null, 'contrarian', {}], ['Rex Reedy', 'poster', 1968, null, 'acid', { Musical: 4 }],
  ['Gene Shallot', 'balcony', 1973, 2010, 'pun', { Comedy: 4 }], ['Judith Crisp', 'timely', 1963, 1995, 'tough', {}],
  ['Stanley Kauffmannson', 'notion', 1958, 2013, 'scholarly', { Drama: 3 }], ['Akiko Hasumi', 'junpo', 1960, null, 'theorist', {}],
  ['Anupama Chopray', 'filmfair', 1990, null, 'warm', { Musical: 5 }], ['Jean-Michel Frodo', 'mondain', 1990, null, 'scholarly', {}],
  ['Mick LaSalle-Street', 'clubhouse', 1993, null, 'populist', {}], ['@cinephile_kate', 'letterbox', 2011, null, 'snark', {}]
];
const CRITIC = Object.fromEntries(CRITICS.map(c => [c[0], { name: c[0], out: c[1], from: c[2], to: c[3], style: c[4], taste: c[5] }]));
// What each temperament sounds like, by verdict. {T} title, {D} director, {A} lead, {G} genre, {S} a scene, {Y} year.
const RV_LINES = {
  rave: {
    warm: ['{T} reminded me why I go to the movies at all.', 'I walked out of {T} and didn\'t want to talk to anyone for an hour, in the best way.', 'Four stars, and I wish I had a fifth.'],
    tough: ['{T} earns every minute. That is rarer than it sounds.', '{D} doesn\'t waste a frame.'],
    acid: ['{T} is the most exciting American movie in years, and the timid will hate it.', 'At last, a picture with blood in its veins.'],
    fusty: ['{T} is a distinguished and handsome production, tastefully done.', 'A picture of rare quality, reflecting credit on all concerned.'],
    auteurist: ['{D} signs every shot of {T}; this is personal cinema of the highest order.', 'A director\'s film, unmistakably.'],
    sharp: ['{T} knows exactly what it\'s doing and does it beautifully.', '{A} has never been better.'],
    urbane: ['{T} is elegant, assured and very much alive.', 'A thoroughly civilised entertainment.'],
    scholarly: ['{T} is a film of real ambition that earns its ambitions.', 'In the scene where {S}, {D} achieves something close to grace.'],
    witty: ['{T} is so good it made me forgive the popcorn prices.', 'Five stars. I checked twice.'],
    enthusiast: ['{T} is an absolute blast from start to finish.', 'Go. Go now. Take everyone.'],
    guidebook: ['★★★★ Superb. A must.', '★★★★ A landmark of the {G}.'],
    populist: ['{T} is the crowd-pleaser of the year, and it deserves the crowd.', 'Big, bold, satisfying.'],
    poetic: ['{T} has the texture of a remembered dream.', 'I cannot shake the image of {S}.'],
    theorist: ['{T} is pure cinema: realism become revelation.', 'The camera here does not record; it reveals.'],
    polemic: ['{T} spits on the "tradition of quality", and thank God for it.', 'This is the cinema of tomorrow.'],
    contrarian: ['Everyone else hated {T}. They\'re wrong, as usual.', 'A misunderstood masterpiece.'],
    pun: ['{T}? Make it a double!', 'This one\'s a {G} delight!'],
    snark: ['ok {T} ruined me 5/5', 'cinema is so back'],
  },
  good: {
    warm: ['{T} is warm, funny and wise, and it\'s about something.', 'Three and a half stars; flawed, but alive.'],
    tough: ['{T} works, mostly. The last act wobbles.', 'Solid, if not quite special.'],
    acid: ['{T} is better than it has any right to be.', 'Clever, slick and only occasionally tiresome.'],
    fusty: ['{T} is an agreeable enough entertainment.', 'Competently made, if somewhat overlong.'],
    auteurist: ['A minor {D}, which is still more than most.', 'Not top drawer, but recognisably the work of a director.'],
    sharp: ['{T} is smarter than it looks.', '{A} carries it.'],
    urbane: ['{T} is pleasant company for two hours.', 'Diverting, well played, slight.'],
    scholarly: ['{T} is accomplished, if a little too pleased with itself.', 'There\'s real craft here, and the scene where {S} sticks.'],
    witty: ['{T}: four stars, minus one for the ending.', 'Very good. Not great. Very good.'],
    enthusiast: ['{T} is a lot of fun.', 'Well worth the ticket.'],
    guidebook: ['★★★ Well made and absorbing.', '★★★ Good {G}.'],
    populist: ['{T} delivers.', 'Audiences will love it.'],
    poetic: ['There are moments in {T} of real loveliness.', 'Imperfect, but haunting.'],
    theorist: ['{T} gestures at something it cannot quite grasp.', 'Interesting, in its contradictions.'],
    polemic: ['{T} is better than the films around it, which isn\'t saying much.', 'Promising.'],
    contrarian: ['Overpraised, but fine.', 'Fine. Calm down, everyone.'],
    pun: ['{T} hits the spot!', 'Pass the popcorn!'],
    snark: ['{T} was good actually', 'solid 3.5'],
  },
  mixed: {
    warm: ['I wanted to love {T}, and I liked it.', 'Two and a half stars: the parts are better than the whole.'],
    tough: ['{T} has a good film inside it, trying to get out.', 'Half a movie.'],
    acid: ['{T} is the kind of picture people call important so they don\'t have to call it boring.', 'Glossy and empty.'],
    fusty: ['{T} is a curious mixture of the fine and the foolish.', 'Uneven.'],
    auteurist: ['{D} on autopilot.', 'An impersonal assignment.'],
    sharp: ['{T} can\'t decide what it wants to be.', 'Pretty, and pretty empty.'],
    urbane: ['{T} is handsome and inert.', 'More admirable than enjoyable.'],
    scholarly: ['{T} mistakes length for depth.', 'An interesting failure.'],
    witty: ['{T} is a film of two halves, both of them the first half.', 'Two stars and a shrug.'],
    enthusiast: ['{T} has its moments.', 'Wait for streaming.'],
    guidebook: ['★★½ Uneven.', '★★½ Middling {G}.'],
    populist: ['{T} is all sizzle.', 'It\'s fine.'],
    poetic: ['{T} has beauty without feeling.', 'A film I admired more than I loved.'],
    theorist: ['{T} confuses style with meaning.', 'Inert.'],
    polemic: ['{T} is the tradition of quality wearing a disguise.', 'Bourgeois.'],
    contrarian: ['Better than its reputation, worse than its budget.', 'Meh.'],
    pun: ['{T}? More like {T}-ish!', 'Half a bucket of popcorn.'],
    snark: ['{T} exists', 'fell asleep twice, woke up for the good bit'],
  },
  pan: {
    warm: ['{T} made me sad, and not in the way it intended.', 'One star. I hated hating it.'],
    tough: ['{T} is a waste of a good cast.', 'Thumbs way down.'],
    acid: ['{T} is a monument to its own self-regard.', 'I wanted to throw something at the screen. I settled for leaving.'],
    fusty: ['{T} is a cheap and tasteless affair, the sort of thing that should embarrass its makers.', 'A sorry spectacle.'],
    auteurist: ['{T} has no author, only a budget.', 'Anonymous product.'],
    sharp: ['{T} is a mess.', 'Everyone involved deserved better.'],
    urbane: ['{T} is witless and long.', 'An ordeal, pleasantly lit.'],
    scholarly: ['{T} is a film without a reason to exist.', 'Incoherent.'],
    witty: ['{T} is a film. That much is undeniable.', 'One star, for the catering.'],
    enthusiast: ['{T} is a slog.', 'Skip it.'],
    guidebook: ['★½ Dreary.', 'BOMB.'],
    populist: ['{T} is dead on arrival.', 'Nope.'],
    poetic: ['{T} is a film without a soul.', 'Nothing lingers.'],
    theorist: ['{T} is pure commerce.', 'Empty.'],
    polemic: ['{T} is everything wrong with cinema.', 'Shameful.'],
    contrarian: ['The critics loved {T}. Obviously it\'s terrible.', 'The emperor is naked.'],
    pun: ['{T}? I\'d rather watch paint dry!', 'Two thumbs, sideways and down!'],
    snark: ['{T} is what happens when nobody says no', '0.5 for the poster'],
  }
};
// Fun takes on the famous real reviews of the classics.
const CLASSIC_TAKES = {
  bonnieclyde: [['Bosley Crowfoot', 22, 'A cheap piece of bald-faced slapstick that treats the hideous depredations of that sleazy, moronic pair as though they were as full of fun and frolic as the jazz-age cut-ups.'], ['Pauline Kale', 98, 'The most excitingly American American movie since the war. Audiences will laugh and then gasp, which is exactly the point.'], ['Roger Everett', 100, 'A milestone in the history of American movies, a work of truth and brilliance.']],
  citizenkane: [['The Hurst Press', null, 'No review. The publisher forbade any mention of the film in his papers.'], ['Bosley Crowfoot', 90, 'Close to being the most sensational film ever made in Hollywood.']],
  spaceodyssey: [['Pauline Kale', 35, 'A monumentally unimaginative movie: a big, expensive, ornate head-trip.'], ['Andrew Sarrus', 40, 'A disaster. (He later changed his mind, on a second viewing, under the influence.)'], ['Roger Everett', 100, 'The film succeeds magnificently on a cosmic scale.']],
  vertigo: [['Bosley Crowfoot', 55, 'Devilishly far-fetched.'], ['Varietal', 58, 'Too long and too slow.'], ['Sight & Soundings poll, 2012', 100, 'The greatest film ever made, dethroning the newspaper baron after fifty years.']],
  psycho: [['Bosley Crowfoot', 45, 'A blot on an honourable career.'], ['C. A. Lejeunesse', 30, 'She walked out before the end and refused to go back.'], ['Andrew Sarrus', 95, 'The first American movie since the newspaper baron to be worthy of a European director.']],
  shining: [['Varietal', 45, 'The crowning blow is the performance of Jack Nickelodeon.'], ['Gene Sizzle', 40, 'A huge disappointment.'], ['The Razzberry Awards', 10, 'Nominated: Worst Director and Worst Actress.']],
  bladerunner: [['Roger Everett', 65, 'Special effects in search of a story.'], ['Pauline Kale', 40, 'It has nothing to give the audience, not even a little zing.'], ['Kim Newmann', 100, '(Years later:) The most influential science fiction film since the space odyssey.']],
  wonderfullife: [['Bosley Crowfoot', 50, 'The weaknesses of this picture are its illusory concept of life.'], ['The FBI', 0, 'A memo flags it for attacking bankers. Really.']],
  godfather: [['Vincent Candy', 95, 'One of the most brutal and moving chronicles of American life ever designed within the limits of popular entertainment.'], ['Andrew Sarrus', 70, 'Too long, too obvious, and somehow wonderful.']],
  jaws: [['Pauline Kale', 80, 'It may be the most cheerfully perverse scare movie ever made.'], ['Gene Sizzle', 85, 'A rare film that delivers on its advertising.']],
  starwars: [['Pauline Kale', 40, 'An assemblage of spare parts; it has no breather, no lyricism.'], ['Roger Everett', 100, 'An out-of-body experience.'], ['Vincent Candy', 80, 'The most elaborate, most expensive, most beautiful movie serial ever made.']],
  et: [['Roger Everett', 100, 'This is not merely a good movie. It\'s one of those movies that brush away our cautions and win our hearts.']],
  pulpfiction: [['Anthony Laine', 85, 'Pure cinema; impure everything else.'], ['Janet Muslin', 90, 'A wildly entertaining wade through a lurid landscape.']],
  shawshank: [['Varietal', 60, 'Leisurely, likeable, too long.'], ['Peter Travis', 85, 'A movie about hope, which flopped and became beloved.']],
  sunsetblvd: [['Bosley Crowfoot', 95, 'A great motion picture, mordant and pitiless.'], ['A studio boss', 0, '(At the premiere, to the director:) You have disgraced the industry that made you.']],
  casablanca: [['Bosley Crowfoot', 90, 'A picture which makes the spine tingle and the heart take a leap.'], ['James Agley', 85, 'Romantic, hokey and irresistible.']],
  rulesgame: [['Le Mondain', 20, 'Booed at its premiere; one patron set fire to his newspaper to burn down the cinema.'], ['André Bazaine', 100, '(Restored, twenty years later:) The masterpiece of French cinema.']],
  peepingtom: [['C. A. Lejeunesse', 5, 'It\'s a long time since a film disgusted me as much.']],
  heavensgate: [['Vincent Candy', 5, 'An unqualified disaster.']],
  sevensamurai: [['Bosley Crowfoot', 85, 'A rich and rewarding film.'], ['Varietal', 75, 'Long, but the action is first-rate.']],
  m31: [['Varietal', 70, 'A strange and disturbing picture.']],
  thingthe: [['Vincent Candy', 30, 'Instant junk.'], ['Kim Newmann', 100, '(A cult rescue, decades later:) The greatest monster movie of them all.']],
  clockwork: [['Pauline Kale', 30, 'Pornographic, and dull.'], ['Vincent Candy', 90, 'Brilliant, a tour de force.']],
  network: [['Vincent Candy', 85, 'Outrageous, very funny, and quite possibly prophetic.']],
  apocalypsenow: [['Andrew Sarrus', 50, 'A ten-ton turkey.'], ['Roger Everett', 100, 'A dreamy, beautiful, unsettling film.']],
  parasite: [['Manola Dargiss', 95, 'A delirious, despairing comedy of class.'], ['Mark Kermudgeon', 100, 'A film of perfect pitch.']],
  barbie: [['Peter Bradshore', 80, 'A gloriously silly, smart and pink blast.']],
  oppenheimer: [['Anthony Laine', 75, 'Loud, long and brilliant, if exhausting.']]
};
const RV_BAND = s => s >= 85 ? 'rave' : s >= 60 ? 'good' : s >= 40 ? 'mixed' : 'pan';
const THUMB_LABEL = p => p >= 90 ? 'Two Thumbs Way Up' : p >= 70 ? 'Thumbs Up' : p >= 45 ? 'Thumbs Sideways' : p >= 25 ? 'Thumbs Down' : 'Thumbs Buried';
function activeCritics(y) { return CRITICS.map(c => CRITIC[c[0]]).filter(c => c.from <= y && (c.to === null || c.to >= y)); }
// The reviews a film got, worked out from its critics' score with each critic's taste and temperament.
let RVC = { S: null, m: {} };
function filmReviews(f) {
  if (!f || f.rel === null || f.reviews === undefined) return null;
  if (RVC.S !== S) RVC = { S, m: {} };
  const key = f.id + ':' + ((S.me && S.me.myReviews) ? S.me.myReviews.length : 0);
  if (RVC.m[key]) return RVC.m[key];
  const y = yearOf(f.rel), r = hashRand(f.id * 7919 + 17), base = f.reviews, tier = f.tier || 3;
  const N = Math.round(clamp((y < 1950 ? 6 : y < 1980 ? 12 : y < 2000 ? 24 : y < 2010 ? 45 : 70) * (tier === 1 ? 1.4 : tier === 2 ? 1 : .6), 3, 120));
  const crit = activeCritics(y), out = [];
  const D = P(f.dir) ? P(f.dir).name : 'the director', A = f.cast && P(f.cast[0]) ? P(f.cast[0]).name : 'the lead';
  const st = typeof storyOf === 'function' ? storyOf(f) : null, scene = st && st.frames.length ? st.frames[Math.floor(r() * st.frames.length)].cap : 'the final scene plays out';
  const fill = t => t.replace(/\{T\}/g, f.title).replace(/\{D\}/g, D).replace(/\{A\}/g, A).replace(/\{G\}/g, f.genre.toLowerCase()).replace(/\{S\}/g, scene).replace(/\{Y\}/g, y);
  const takes = f.cat && CLASSIC_TAKES[f.cat.id] || [], used = new Set();
  for (const [who, sc, q] of takes) { out.push({ who, out: CRITIC[who] ? OUTLET[CRITIC[who].out].name : '', sc, q, famous: 1 }); used.add(who); }
  const named = crit.filter(c => !used.has(c.name)).sort(() => r() - .5).slice(0, Math.min(crit.length, Math.ceil(N * .4)));
  for (const c of named) {
    let sc = base + (c.taste[f.genre] || 0) + (r() - .5) * 26;
    if (c.style === 'contrarian') sc = 100 - sc + (r() - .5) * 10;
    sc = Math.round(clamp(sc, 2, 100));
    const L = RV_LINES[RV_BAND(sc)][c.style] || RV_LINES[RV_BAND(sc)].warm;
    out.push({ who: c.name, out: OUTLET[c.out].name, sc, q: fill(L[Math.floor(r() * L.length)]) });
  }
  const others = Math.max(0, N - out.length); let pos = out.filter(x => x.sc !== null && x.sc >= 58).length, sum = out.reduce((s, x) => s + (x.sc ?? base), 0);
  for (let i = 0; i < others; i++) { const sc = clamp(base + (r() - .5) * 30, 2, 100); sum += sc; if (sc >= 58) pos++; }
  // the player's reviews count once they're read widely enough
  const mine = S.me ? (S.me.myReviews || []).filter(v => v.film === f.id) : [];
  for (const v of mine) { out.unshift({ who: ME().name, out: v.out || 'your blog', sc: v.sc, q: v.q, mine: 1, counts: criticCounts() }); if (criticCounts()) { sum += v.sc; if (v.sc >= 58) pos++; } }
  const n = N + mine.filter(() => criticCounts()).length;
  // Rogerscore: the leading critics only, weighted by their outlet's standing (famous takes count double)
  let ws = 0, wt = 0; for (const v of out) { if (v.sc === null || (v.mine && !v.counts)) continue; const w = v.famous ? 2 : v.mine ? 1 : ({ 1: 1.6, 2: 1.2, 3: .9 }[(CRITIC[v.who] && OUTLET[CRITIC[v.who].out] || {}).tier] || 1); ws += v.sc * w; wt += w; }
  const top = wt ? Math.round(ws / wt) : Math.round(sum / Math.max(1, n));
  // Audience: what ticket buyers thought, out of ten; crowds forgive what critics don't, and the other way round
  const ar = hashRand(f.id * 389 + 5)(), gA = { Action: 8, Comedy: 6, Horror: 2, Superhero: 9, Animation: 7, Musical: 5, Romance: 4, 'Sci-fi': 4, 'Martial arts': 6, Documentary: -2, Drama: -3, Period: -4, War: 1, Western: 2 }[f.genre] || 0;
  const aud = Math.round(clamp(base * .5 + 28 + gA + Math.min(14, Math.log2(1 + (f.hitRatio || 0)) * 5) + (f.cult || 0) * .08 + (ar - .5) * 12, 12, 97)) / 10;
  return RVC.m[key] = { list: out, n, score: top, thumbs: Math.round(pos / Math.max(1, n) * 100), aud, audN: Math.round(Math.max(120, (f.total || 1) * (y < 1995 ? 400 : 6000) * (.5 + ar))) };
}
// the three numbers, side by side and the same size, each with what it is
const SCORE_HOW = { thumbs: 'Share of all counted critics, big outlets and small, who gave it a positive review (60 or better).', roger: 'Weighted average of the leading critics only: the major papers, magazines and broadcasters count most.', aud: 'Ticket buyers\' average rating out of ten. Crowds and critics often disagree.' };
function scoreTiles(R) { const cls = (v, g, b) => v >= g ? 'good' : v < b ? 'bad' : ''; return `<div class="rt-tiles"><div><b class="rt-big ${cls(R.thumbs, 60, 40)}">${R.thumbs}%</b><span>Thumbs</span><small>${R.n} critics · ${esc(THUMB_LABEL(R.thumbs))}</small><small class="muted">${SCORE_HOW.thumbs}</small></div><div><b class="rt-big ${cls(R.score, 60, 40)}">${R.score}</b><span>Rogerscore</span><small>out of 100</small><small class="muted">${SCORE_HOW.roger}</small></div><div><b class="rt-big ${cls(R.aud, 6.5, 4.5)}">${R.aud.toFixed(1)}</b><span>Audience</span><small>${R.audN.toLocaleString()} ratings</small><small class="muted">${SCORE_HOW.aud}</small></div></div>`; }
function thumbBadge(R) { const c = R.thumbs >= 70 ? 'good' : R.thumbs < 45 ? 'bad' : ''; return `<span class="rt-badge ${c}"><b>${R.thumbs}%</b> ${R.thumbs >= 60 ? '👍' : R.thumbs >= 45 ? '👉' : '👎'}</span>`; }
function rogerPanelHTML(f) {
  const R = filmReviews(f); if (!R) return '';
  return `<section class="panel rt"><h3>Roger That <span class="muted small">the review aggregator</span></h3>${scoreTiles(R)}
   <ul class="rt-list">${R.list.slice(0, 8).map(v => `<li class="${v.famous ? 'famous' : ''}${v.mine ? ' mine' : ''}"><span class="rt-s ${v.sc === null ? '' : v.sc >= 60 ? 'good' : v.sc < 40 ? 'bad' : ''}">${v.sc === null ? '—' : v.sc}</span><div><q>${esc(v.q)}</q><small>${esc(v.who)}${v.out ? ', ' + esc(v.out) : ''}${v.famous ? ' · <i>famous take</i>' : ''}${v.mine && !v.counts ? ' · not counted yet' : ''}</small></div></li>`).join('')}</ul>${R.list.length > 8 ? `<p class="muted small">And ${R.n - 8} more reviews.</p>` : ''}</section>`;
}
// ---- the app ----
function rogerApp() {
  const t = UI.rt || 'now', q = (UI.rtq || '').toLowerCase().trim(), y = S.year;
  const tabs = [['now', 'Now showing'], ['year', 'Best of ' + y], ['all', 'All-time'], ['critics', 'Critics'], ['mine', 'Your reviews']];
  let body = '';
  const row = f => { const R = filmReviews(f); return R ? `<tr><td>${fl(f.id)}</td><td class="muted">${yearOf(f.rel)}</td><td>${esc(f.genre)}</td><td class="n">${R.thumbs}%</td><td class="n">${R.score}</td><td class="n">${R.aud.toFixed(1)}</td><td class="n muted">${R.n}</td></tr>` : ''; };
  const table = L => `<table class="os-table"><thead><tr><th>Film</th><th>Year</th><th>Genre</th><th class="n" title="${SCORE_HOW.thumbs}">Thumbs</th><th class="n" title="${SCORE_HOW.roger}">Rogerscore</th><th class="n" title="${SCORE_HOW.aud}">Audience</th><th class="n">Critics</th></tr></thead><tbody>${L.map(row).join('') || '<tr><td colspan="7" class="muted">Nothing here yet.</td></tr>'}</tbody></table>`;
  const rel = S.films.filter(f => f.rel !== null && f.reviews !== undefined && f.rel <= S.week);
  if (t === 'now') body = table(rel.filter(f => S.week - f.rel < 12).sort((a, b) => b.rel - a.rel).slice(0, 40));
  else if (t === 'year') body = table(rel.filter(f => yearOf(f.rel) === y).sort((a, b) => b.reviews - a.reviews).slice(0, 50));
  else if (t === 'all') body = `<div class="os-tools"><input id="rtq" type="search" placeholder="Search any film…" value="${esc(UI.rtq || '')}"></div>${table((q ? rel.filter(f => f.title.toLowerCase().includes(q) || (f.real && f.real.toLowerCase().includes(q))) : rel.filter(f => f.reviews >= 88)).sort((a, b) => b.reviews - a.reviews).slice(0, 80))}`;
  else if (t === 'critics') body = `<table class="os-table"><thead><tr><th>Critic</th><th>Outlet</th><th>Years</th><th>Temperament</th></tr></thead><tbody>${CRITICS.map(c => CRITIC[c[0]]).filter(c => c.from <= y).map(c => `<tr><td><b>${esc(c.name)}</b></td><td>${esc(OUTLET[c.out].name)} <span class="muted small">${esc(OUTLET[c.out].kind)}</span></td><td class="muted">${c.from}–${c.to && c.to < y ? c.to : 'now'}</td><td class="muted">${esc(c.style)}</td></tr>`).join('')}</tbody></table>`;
  else body = myReviewsHTML();
  return `<div class="rtapp"><div class="rt-brand"><b>Roger That</b><span>${rel.length.toLocaleString()} films · three ways to read the reviews</span></div><p class="small muted"><b>Thumbs</b>: ${SCORE_HOW.thumbs} <b>Rogerscore</b>: ${SCORE_HOW.roger} <b>Audience</b>: ${SCORE_HOW.aud}</p><div class="np-tabs">${tabs.map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-rt="${k}">${l}</button>`).join('')}</div>${body}</div>`;
}
// ---- you, the critic ----
function criticCounts() { const M = S.me; if (!M) return false; return (M.jobs || []).some(j => /^crit_/.test(j.k)) || followers('blog') >= 5000 || (M.critic && M.critic.approved); }
function myReviewsHTML() {
  const M = S.me, L = (M.myReviews || []).slice().reverse();
  const job = (M.jobs || []).find(j => /^crit_/.test(j.k));
  return `<p class="small">${job ? `You review for a living: <b>${esc(job.t)}</b>. Your reviews count in the Rogerscore.` : criticCounts() ? 'Your blog is read widely enough that Roger That counts your reviews.' : `Write reviews from the Create tab (a film review on your blog). Once ${(5000).toLocaleString()} people follow your blog, or a paper hires you, your reviews count in the score. Critic jobs appear on the job board now and then: freelance reviewing, staff critic, chief critic.`}</p>
   <p class="small muted">Blog followers: ${followers('blog').toLocaleString()}</p>
   ${L.length ? `<ul class="rt-list">${L.slice(0, 30).map(v => `<li class="mine"><span class="rt-s ${v.sc >= 60 ? 'good' : v.sc < 40 ? 'bad' : ''}">${v.sc}</span><div>${fl(v.film)} <q>${esc(v.q)}</q><small>${esc(v.out || 'your blog')} · ${fmtDate(v.w, true)}${v.agree !== undefined ? ` · you were ${v.agree ? 'with' : 'against'} the consensus` : ''}</small></div></li>`).join('')}</ul>` : '<p class="muted">No reviews yet.</p>'}`;
}
// A review you write: your score is your taste plus a roll; landing near the consensus (or bravely, entertainingly far
// from it) builds readers.
function writeReview(M, f, outName) {
  const me = ME(), base = f.reviews, taste = (me.mind.tas || 10) - 10;
  const sc = Math.round(clamp(base + (prnd() - .5) * (40 - taste * 2), 2, 100)), band = RV_BAND(sc);
  const styles = ['warm', 'sharp', 'witty', 'enthusiast', 'scholarly'], style = styles[Math.floor(prnd() * styles.length)];
  const L = RV_LINES[band][style], D = P(f.dir) ? P(f.dir).name : 'the director', A = f.cast && P(f.cast[0]) ? P(f.cast[0]).name : 'the lead';
  const q = L[Math.floor(prnd() * L.length)].replace(/\{T\}/g, f.title).replace(/\{D\}/g, D).replace(/\{A\}/g, A).replace(/\{G\}/g, f.genre.toLowerCase()).replace(/\{S\}/g, 'the big scene plays out').replace(/\{Y\}/g, yearOf(f.rel));
  const v = { film: f.id, sc, q, w: S.week, out: outName, agree: Math.abs(sc - base) <= 15 };
  (M.myReviews = M.myReviews || []).push(v);
  return v;
}
function latestReviewable() { const L = S.films.filter(f => f.rel !== null && f.rel <= S.week && S.week - f.rel < 6 && f.reviews !== undefined).sort((a, b) => (b.tier === 1) - (a.tier === 1) || b.rel - a.rel); return L[0] || null; }
// Staff critics file a review a week; papers notice good critics.
function criticWeek() {
  const M = S.me, job = (M.jobs || []).find(j => /^crit_/.test(j.k)); if (!job) return;
  const f = latestReviewable(); if (!f || (M.myReviews || []).some(v => v.film === f.id)) return;
  const v = writeReview(M, f, job.t.replace(/^[^,]*, /, ''));
  if (v.agree) ME().standing = clamp(ME().standing + .2, 0, 100);
  M.critic = M.critic || { approved: true, filed: 0 }; M.critic.filed++;
  if (M.critic.filed % 10 === 0) inbox('note', 'Your column', `Ten more reviews filed. ${v.agree ? 'Readers trust your taste: your scores track the consensus.' : 'You\'re building a reputation as a contrarian; the letters page loves to hate you.'}`);
}
// ---- jobs, the blog and the review type of work ----
JOB_TASKS.critic = [['Write the weekend\'s capsule reviews', 'tas', 0], ['Cover a press screening and file by midnight', 'speed', 0], ['Interview a director for the Sunday section', 'cha', 1], ['File a festival dispatch every day for a week', 'speed', 1], ['Write the lead review of the year\'s big release', 'tas', 1], ['Choose the paper\'s ten best of the year', 'tas', 2], ['Defend a pan against an angry studio', 'eth', 2]];
ODD_JOBS.push(
  { k: 'crit_free', jid: 'i_critic_freelance', t: 'Freelance film reviewer, an alt-weekly', tier: 1, subs: ['tas', 'dial'], days: 1, rate: 90, weeks: 8, fam: 'critic', d: 'A review a week for a free paper. You get in to the press screenings. The pay is a joke.' },
  { k: 'crit_staff', jid: 'i_critic_staff', t: 'Staff film critic, a city daily', tier: 2, req: 10, subs: ['tas', 'dial', 'struc'], days: 3, rate: 700, weeks: 26, fam: 'critic', d: 'A byline, a column and a seat at every press screening. Studios start to care what you think.' },
  { k: 'crit_chief', jid: 'i_critic_chief', t: 'Chief film critic, a national paper', tier: 3, req: 13, subs: ['tas', 'dial', 'struc'], days: 4, rate: 1800, weeks: 52, fam: 'critic', d: 'The review that can open or sink a film. Festivals invite you; directors know your name and don\'t always like it.' },
  { k: 'crit_tv', jid: 'i_critic_tv', t: 'Co-host, a television review show', tier: 3, req: 12, subs: ['tas', 'pres', 'cha'], days: 2, rate: 2200, weeks: 26, fam: 'critic', d: 'Two critics, two thumbs, one balcony. You argue on camera every week.' }
);
for (const t of ODD_JOBS.slice(-4)) ODD_BY[t.k] = t;
PLATFORMS.blog = { name: 'Scribbler', icon: '🖋️', unit: 'reads', from: 1999, pay: .002, gate: 500, d: 'Blogs and newsletters. Ads pay a little; the readers are the point. Critics get noticed here.' };
PLAT_OLD.blog = 'Fanzines';
WORK_TYPES.review = { label: 'Film review', icon: '📝', subs: ['tas', 'dial', 'struc'], need: 2, plat: 'blog', field: 'creator', base: 40, eng: .25, conv: .012, d: 'Watch the week\'s big release and write it up on your blog. Readers come for a voice they trust.' };
function reviewRelease(w) {
  // a released blog review becomes a review of the latest film
  const f = latestReviewable(); if (!f) return;
  const v = writeReview(S.me, f, platOpen('blog') ? 'your Scribbler blog' : 'your fanzine'); w.title = `Review: ${f.title}`; w.film = f.id; v.q = v.q;
}
OS_EXTRA.roger = ['👍', 'Roger That', 'Every review of every film, one number; the critics; your own reviews'];
OS_VIEWS.roger = rogerApp;
OS_GROUPS.find(g => g[0] === 'Industry')[1].splice(1, 0, 'roger');
function rogerClick(t) { if (t.dataset.rt) { UI.rt = t.dataset.rt; render(true); return true; } return false; }
if (typeof FAM_FIELDS !== 'undefined') FAM_FIELDS.critic = ['dist', 'wri'];
