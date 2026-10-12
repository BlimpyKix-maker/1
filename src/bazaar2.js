// ---------------- The Bazaar, filled out ----------------
// Seven new aisles and more in the old ones, each thing priced in today's dollars and scaled to the year, and each
// with a reason to buy it beyond having it:
//  · Style and grooming: presence, charisma and standing at the moments people are judging you.
//  · Health: memberships, a trainer, a therapist. Subscriptions charge every week until you cancel (sell) them, and
//    lapse on their own if the money runs out.
//  · Services: an assistant, a cleaner, a chef, a driver, a publicist, a lawyer. Time and energy bought with money.
//  · Gifts, to give. Everyone likes two kinds of present and dislikes one; you find out which by giving. A loved gift
//    is a real step closer, a disliked one costs a little, and one gift per person a month is the decent limit.
//  · Experiences: festival badges (from the year each festival started), premieres, masterclasses and the odd
//    skydive. Meet people, learn things, come home lighter.
//  · Art and design that holds or gains value (or doesn't), on the same drifting market as the collectibles.
//  · Tech and home, era by era: the VCR, the LaserDisc, the DVD box set, the e-reader.
// Plus period kit in Gear (a Moviola until 1975, a Steenbeck until the 90s, a Nagra, Super 8, a DV camcorder), more
// books, and grander luxuries.
bzAdd('style', '👗 Style', {
  s_haircut: { name: 'A haircut from someone good', price: 120, once: { pres: .2 }, d: 'People remember your face for the right reasons. Presence, once.' },
  s_glasses: { name: 'Designer frames', price: 700, once: { pres: .15 }, d: 'You look like you\'ve read the book. Presence, once.' },
  s_teeth: { name: 'Teeth whitening', price: 600, from: 1989, once: { pres: .25 }, d: 'The camera finds your smile. Presence, once.' },
  s_veneers: { name: 'Porcelain veneers', price: 12000, from: 1985, once: { pres: .6 }, standing: .5, d: 'The Hollywood smile. Casting notices; your dentist buys a boat.' },
  s_tux: { name: 'Black tie that actually fits', price: 1800, standing: .5, d: 'Galas, premieres, ceremonies: you stop looking like a waiter.' },
  s_stylist: { name: 'A stylist for awards season', price: 4000, standing: 1, once: { pres: .2 }, d: 'Pulled looks, fittings, a plan for every carpet. +1 standing.' },
  s_jacket: { name: 'A vintage leather jacket', price: 900, collect: 1, drift: .02, vol: .15, d: 'Broken in by someone cooler. Holds its value.' },
  s_sneakers: { name: 'Limited-run sneakers', price: 450, from: 1985, collect: 1, drift: .05, vol: .35, d: 'Never worn. Resale value: a gamble on a colourway.' },
  s_fragrance: { name: 'A signature fragrance', price: 220, once: { pres: .1 }, d: 'People mention it later. That\'s the point.' },
  s_hat: { name: 'A really good hat', price: 260, once: { pres: .1 }, d: 'You become the person in the hat.' },
  s_tailor: { name: 'A tailor on call', price: 160, sub: 40, fx: { standing: .02 }, d: 'Everything fits, always. A sliver of standing each week; $40 a week.' },
  s_coach: { name: 'A presentation coach', price: 900, once: { pres: .3, cha: .2 }, d: 'Six sessions on how to walk into a room.' }
});
bzAdd('health', '🏋️ Health', {
  h_gym: { name: 'A gym membership', price: 60, sub: 15, fx: { energy: 2, grow: { phys: .006 } }, d: 'Joining fee, then $15 a week. +2 energy a week if you go.' },
  h_studio: { name: 'A boutique fitness studio', price: 200, sub: 45, from: 2005, fx: { energy: 3, stress: -1, grow: { phys: .01 } }, d: 'Loud music, small classes. +3 energy, −1 stress; $45 a week.' },
  h_trainer: { name: 'A personal trainer', price: 300, sub: 120, fx: { energy: 3, grow: { phys: .02, stunt: .006 } }, d: 'Someone who knows when you skipped. Physicality grows fast; $120 a week.' },
  h_therapist: { name: 'A therapist, weekly', price: 150, sub: 150, fx: { stress: -4 }, d: 'An hour a week that is only about you. −4 stress a week; $150 a week.' },
  h_yoga: { name: 'Yoga classes', price: 80, sub: 25, from: 1965, fx: { stress: -2, grow: { phys: .004 } }, d: '−2 stress a week, and you can touch your toes again. $25 a week.' },
  h_swim: { name: 'A swimming club', price: 120, sub: 20, fx: { energy: 2, stress: -1 }, d: 'Lengths before work. +2 energy, −1 stress; $20 a week.' },
  h_nutrition: { name: 'A nutritionist', price: 400, sub: 30, fx: { energy: 2 }, d: 'Fewer sandwiches on set. +2 energy a week; $30 a week.' },
  h_massage: { name: 'A ten-massage package', price: 900, stress: -20, d: 'Ten hours of someone undoing a year. −20 stress now.' },
  h_acu: { name: 'Acupuncture, six sessions', price: 500, from: 1972, stress: -12, d: 'You are sceptical. You also sleep better. −12 stress.' },
  h_checkup: { name: 'An executive health check', price: 2500, stress: -6, energy: 5, d: 'They find nothing. You sleep better for a month.' },
  h_bike: { name: 'A road bike', price: 1500, fx: { energy: 1, stress: -1, grow: { phys: .006 } }, d: 'Sunday rides with people who own Lycra. +1 energy, −1 stress a week.' },
  h_rower: { name: 'A rowing machine', price: 1100, from: 1980, fx: { energy: 1, grow: { phys: .008 } }, d: 'It lives in the corner and judges you. Physicality grows.' },
  h_mattress: { name: 'A mattress that costs more than your first car', price: 3200, fx: { energy: 3 }, d: 'Eight hours that count. +3 energy every week.' }
});
bzAdd('services', '🧑‍💼 Services', {
  v_cleaner: { name: 'A cleaner, once a week', price: 120, sub: 120, fx: { stress: -1, energy: 1 }, d: 'You come home to a clean place. −1 stress, +1 energy; $120 a week.' },
  v_assistant: { name: 'A part-time assistant', price: 400, sub: 400, from: 1940, fx: { energy: 3, stress: -1 }, d: 'Your calendar stops eating you. +3 energy, −1 stress; $400 a week.' },
  v_chef: { name: 'A private chef, three nights a week', price: 900, sub: 900, fx: { energy: 3, stress: -1, standing: .01 }, d: 'Dinners people talk about. +3 energy; $900 a week.' },
  v_driver: { name: 'A driver', price: 1200, sub: 1200, fx: { energy: 3, standing: .02 }, d: 'Calls in the back seat instead of traffic. +3 energy; $1,200 a week.' },
  v_reader: { name: 'A script reader for your drafts', price: 250, sub: 250, fx: { grow: { struc: .008, dial: .006 } }, d: 'Honest notes every week. Structure and dialogue grow; $250 a week.' },
  v_actcoach: { name: 'An acting coach on retainer', price: 300, sub: 300, fx: { grow: { range: .01, pres: .006 } }, d: 'Prep for every audition. Range and presence grow; $300 a week.' },
  v_publicist: { name: 'A publicist on retainer', price: 2500, sub: 2500, fx: { standing: .03, fame: .06 }, d: 'Your name in the right columns. Fame and standing creep up; $2,500 a week.' },
  v_lawyer: { name: 'An entertainment lawyer on retainer', price: 5000, sub: 400, fx: { grow: { fin: .006, pack: .004 } }, d: 'Contracts read before you sign them. Deal sense grows; $400 a week.' },
  v_bizmgr: { name: 'A business manager', price: 2000, sub: 500, fx: { stress: -1 }, d: 'Bills paid on time, investments explained slowly. −1 stress; $500 a week.' },
  v_security: { name: 'Security for public appearances', price: 3000, sub: 1500, fx: { stress: -2 }, d: 'For when fame gets close. −2 stress; $1,500 a week.' }
});
bzAdd('gifts', '🎁 Gifts', {
  g_flowers: { name: 'Flowers, properly arranged', price: 60, gift: 'flowers', d: 'A gift to give: for someone who loves flowers.' },
  g_bonsai: { name: 'A bonsai', price: 120, gift: 'flowers', d: 'A gift to give: a small tree and a long commitment.' },
  g_wine: { name: 'A bottle of something good', price: 90, gift: 'wine', d: 'A gift to give: for someone who knows wine.' },
  g_whisky: { name: 'A very old whisky', price: 900, gift: 'wine', d: 'A gift to give: older than both of you.' },
  g_book: { name: 'A first edition', price: 400, gift: 'book', d: 'A gift to give: for a reader.' },
  g_vinyl: { name: 'A rare pressing on vinyl', price: 150, from: 1948, gift: 'music', d: 'A gift to give: for someone who listens properly.' },
  g_macarons: { name: 'A box of macarons', price: 45, gift: 'food', d: 'A gift to give: impossible to dislike. Nearly.' },
  g_hamper: { name: 'A hamper from a good grocer', price: 200, gift: 'food', d: 'A gift to give: cheese, jam, crackers, a card.' },
  g_scarf: { name: 'A cashmere scarf', price: 280, gift: 'style', d: 'A gift to give: for someone who dresses with care.' },
  g_pen: { name: 'A fountain pen', price: 320, gift: 'style', d: 'A gift to give: for someone who still writes by hand.' },
  g_tickets: { name: 'Two tickets to a show they want to see', price: 300, gift: 'exp', d: 'A gift to give: an evening, not a thing.' },
  g_dinner: { name: 'Dinner somewhere impossible to book', price: 450, gift: 'exp', d: 'A gift to give: a table, a date and your good taste.' },
  g_poster: { name: 'A framed poster of their favourite film', price: 180, gift: 'art', d: 'A gift to give: proof you listened.' },
  g_print: { name: 'A signed art print', price: 500, gift: 'art', d: 'A gift to give: for a wall that deserves it.' },
  g_gadget: { name: 'The gadget everyone wants this year', price: 600, from: 1980, gift: 'tech', d: 'A gift to give: for someone who reads the reviews.' }
});
bzAdd('exp', '🎟️ Experiences', {
  x_cannes: { name: 'A Côte market badge', price: 1800, from: 1959, meet: 3, standing: .5, energy: -10, d: 'Ten days of breakfasts, screenings and yachts you aren\'t invited onto. Three new people.' },
  x_berlin: { name: 'A Bruin festival accreditation', price: 700, from: 1951, meet: 2, energy: -8, d: 'Snow, arthouse and the European money. Two new people.' },
  x_tiff: { name: 'A Toronto festival pass', price: 900, from: 1976, meet: 2, energy: -8, d: 'Where the awards season starts. Two new people.' },
  x_sundance: { name: 'A Mountain festival pass', price: 1500, from: 1985, meet: 2, energy: -10, d: 'Independent film in the mountains, in puffer jackets. Two new people.' },
  x_premiere: { name: 'A ticket to a charity premiere', price: 1200, meet: 1, standing: .3, d: 'Black tie, a red carpet, and someone who funds films at your table.' },
  x_master: { name: 'A masterclass with a living legend', price: 800, once: { _main: .6 }, d: 'Three hours, one legend, every question answered. A real step in your main craft.' },
  x_retro: { name: 'A retrospective season pass', price: 200, once: { tas: .3 }, d: 'Thirty films by one director, in order. Taste, once.' },
  x_tour: { name: 'A studio backlot tour', price: 70, stress: -3, d: 'The famous street, the famous lake. You check the exits like a location scout.' },
  x_skydive: { name: 'A tandem skydive', price: 400, stress: -12, energy: -4, d: 'Sixty seconds of not thinking about your career at all.' },
  x_cooking: { name: 'A cooking class', price: 150, stress: -5, meet: 1, d: 'Knife skills and a new friend who also burnt the sauce.' },
  x_wine: { name: 'A wine-country weekend', price: 600, stress: -8, meet: 1, d: 'Tastings, a terrible hat, and a producer at the next table.' },
  x_balloon: { name: 'A balloon flight at dawn', price: 350, stress: -10, d: 'Silent and enormous. You think of a shot you\'ll use one day.' },
  x_openmic: { name: 'Five minutes at an open mic', price: 10, once: { comic: .2, pres: .2 }, stress: 6, d: 'Terrifying. You get one big laugh. Comedy and presence, once.' },
  x_paris: { name: 'A long weekend in Paris', price: 1600, once: { tas: .3 }, stress: -12, d: 'Cinémathèque, cafés, a lot of walking. Taste, once; −12 stress.' },
  x_symphony: { name: 'A night at the symphony', price: 150, once: { score: .15 }, stress: -4, d: 'You hear how the old film composers stole. Scoring, once.' },
  x_gallery: { name: 'A gallery opening', price: 60, meet: 1, stress: -2, d: 'Warm wine, cold art and one interesting person.' },
  x_safari: { name: 'A safari', price: 7000, stress: -25, standing: .3, d: 'Two weeks without signal. −25 stress.' }
});
bzAdd('art', '🖼️ Art', {
  a_screen: { name: 'A limited screen print', price: 400, collect: 1, drift: .03, vol: .2, d: 'Numbered, signed, slightly crooked. Might appreciate.' },
  a_photo: { name: 'A signed photograph', price: 1500, collect: 1, drift: .04, vol: .25, d: 'A great photographer\'s print. Values drift with their reputation.' },
  a_ceramic: { name: 'A studio ceramic', price: 800, collect: 1, drift: .02, vol: .2, d: 'Handmade, heavy, quietly expensive.' },
  a_neon: { name: 'A neon sign from a closed cinema', price: 2200, collect: 1, drift: .05, vol: .3, d: 'It says ORPHEUM in pink. Collectors fight over these.' },
  a_poster: { name: 'A vintage festival poster', price: 600, collect: 1, drift: .05, vol: .25, d: 'From the year a legend won. Values move with the legend.' },
  a_cel: { name: 'An original animation cel', price: 1200, from: 1937, collect: 1, drift: .06, vol: .35, d: 'Hand-painted, one frame of a famous minute.' },
  a_chair: { name: 'A design-classic chair', price: 4000, from: 1956, collect: 1, drift: .03, vol: .1, d: 'Leather, rosewood and a lot of opinions. Holds its value.' },
  a_litho: { name: 'A lithograph by an old master', price: 9000, collect: 1, drift: .03, vol: .15, d: 'The safe end of the art market.' },
  a_bronze: { name: 'A small bronze', price: 6000, collect: 1, drift: .03, vol: .3, d: 'Heavy enough to stop a door, valuable enough not to.' },
  a_hot: { name: 'A canvas by the painter everyone is talking about', price: 25000, collect: 1, drift: .08, vol: .6, d: 'Could double. Could halve. That\'s the art market.' }
});
bzAdd('tech', '💻 Tech & home', {
  t_typewriter: { name: 'An electric typewriter', price: 600, from: 1950, to: 1995, fx: { grow: { struc: .006, dial: .004 } }, d: 'Loud, fast and no internet. Structure and dialogue grow.' },
  t_vcr: { name: 'A video recorder', price: 900, from: 1977, to: 2006, fx: { grow: { tas: .006 } }, d: 'Tape films off TV and study them frame by frame. Taste grows.' },
  t_laser: { name: 'A LaserDisc player', price: 1200, from: 1980, to: 2000, fx: { grow: { tas: .008 } }, d: 'Commentary tracks! Directors explaining themselves! Taste grows.' },
  t_walkman: { name: 'A personal stereo', price: 150, from: 1979, to: 2005, fx: { stress: -1 }, d: 'Your own soundtrack on the bus. −1 stress a week.' },
  t_dvd: { name: 'A DVD player and a wall of box sets', price: 300, from: 1997, to: 2016, fx: { grow: { tas: .006, struc: .003 } }, d: 'Whole seasons in a weekend. Taste and structure grow.' },
  t_mp3: { name: 'An MP3 player with every record you own', price: 300, from: 2001, to: 2014, fx: { stress: -1 }, d: 'Ten thousand songs in your pocket. −1 stress a week.' },
  t_ereader: { name: 'An e-reader', price: 150, from: 2007, fx: { grow: { tas: .004, struc: .004 } }, d: 'Scripts and novels in your bag. Taste and structure grow.' },
  t_console: { name: 'A games console', price: 450, from: 1977, fx: { stress: -1 }, d: 'One more level. −1 stress a week.' },
  t_watch: { name: 'A smartwatch', price: 400, from: 2015, fx: { energy: 1 }, d: 'It tells you to stand up. +1 energy a week.' },
  t_noise: { name: 'A white-noise machine', price: 60, from: 1962, fx: { energy: 1 }, d: 'Rain on a loop. +1 energy a week.' },
  t_tv: { name: 'A very large television', price: 1500, from: 1998, fx: { stress: -1 }, d: 'Films the way they were meant to be seen, almost. −1 stress a week.' },
  t_projector: { name: 'A home cinema projector', price: 2500, from: 1990, fx: { grow: { tas: .008 }, stress: -1 }, d: 'A screen on the wall, friends on the sofa. Taste grows.' }
});
bzAdd('gear', '', {
  moviola: { name: 'A Moviola', price: 3000, from: 1924, to: 1975, fx: { grow: { rhythm: .014 } }, d: 'Upright, clattering, unforgiving. Rhythm grows every week.' },
  steenbeck: { name: 'A Steenbeck flatbed', price: 6000, from: 1960, to: 1998, fx: { grow: { rhythm: .016, cont: .006 } }, d: 'Six plates and a quiet hum. Rhythm and continuity grow.' },
  nagra: { name: 'A Nagra tape recorder', price: 3500, from: 1958, to: 2005, fx: { grow: { sound: .016 } }, d: 'The recorder on every set for forty years. Sound grows.' },
  super8: { name: 'A Super 8 camera', price: 400, from: 1965, to: 1990, fx: { grow: { comp: .01 } }, d: 'Three minutes a cartridge, warm and grainy. Composition grows.' },
  arri16: { name: 'A 16mm Arriflex', price: 9000, from: 1952, to: 2005, fx: { grow: { comp: .014, light: .01 } }, d: 'What documentaries and first features were shot on. Composition and lighting grow.' },
  dvcam: { name: 'A DV camcorder', price: 2500, from: 1995, to: 2010, fx: { grow: { comp: .01, move: .006 } }, d: 'Digital video for everyone. Composition and movement grow.' },
  dslr: { name: 'A DSLR with a fast lens', price: 2000, from: 2008, fx: { grow: { comp: .012, light: .006 } }, d: 'Shallow focus on a shoestring. Composition and lighting grow.' },
  phonerig: { name: 'A smartphone rig with clip-on lenses', price: 300, from: 2015, fx: { grow: { comp: .006, move: .006 } }, d: 'Festivals have shown features shot on these. Composition and movement grow.' },
  prompter: { name: 'A teleprompter', price: 700, from: 1950, fx: { grow: { voice: .006, pres: .006 } }, d: 'Read to camera like you mean it. Voice and presence grow.' },
  greenscreen: { name: 'A green screen and stands', price: 500, from: 1995, fx: { grow: { digi: .008 } }, d: 'Anywhere in the world, in your spare room. Digital effects grow.' },
  boards: { name: 'A pro storyboard pad and markers', price: 90, fx: { grow: { vstory: .008 } }, d: 'Think in frames. Visual storytelling grows every week.' }
});
bzAdd('books', '', {
  b_story: { name: 'The Story Engine', price: 30, once: { struc: .4, char: .2 }, d: 'Read once: why stories work, scene by scene.' },
  b_making: { name: 'Making Pictures, Day by Day', price: 24, once: { setm: .3, vstory: .2 }, d: 'Read once: a director\'s working week.' },
  b_rebel: { name: 'Rebel on Seven Thousand Dollars', price: 18, once: { bud: .4, fin: .2 }, d: 'Read once: a feature for the price of a used car.' },
  b_kid: { name: 'The Kid Who Stayed in the Picture', price: 22, once: { pack: .3, talent: .2 }, d: 'Read once: a producer\'s memoir, mostly true.' },
  b_easy: { name: 'Easy Money, Raging Egos', price: 26, once: { tas: .2, pack: .2 }, d: 'Read once: the decade the directors took over.' },
  b_final: { name: 'Final Cut: How a Studio Died', price: 28, once: { bud: .3, fin: .3 }, d: 'Read once: one western, one studio, gone.' },
  b_respect: { name: 'Respect the Work', price: 21, once: { range: .4, pres: .2 }, d: 'Read once: an acting teacher\'s exercises.' },
  b_cine: { name: 'Masters of Light', price: 50, once: { light: .4, comp: .3 }, d: 'Read once: cinematographers on their craft.' },
  b_dial: { name: 'The Art of Talk', price: 24, once: { dial: .5 }, d: 'Read once: how people actually speak.' },
  b_fear: { name: 'Fear, Frame by Frame', price: 26, once: { pace: .3, sdes: .2 }, d: 'Read once: how horror works on a body.' },
  b_truth: { name: 'Truth at Twenty-Four Frames', price: 30, once: { vstory: .3, tas: .2 }, d: 'Read once: documentary and its ethics.' },
  b_sitcom: { name: 'Three Cameras and a Laugh Track', price: 22, once: { comic: .3, struc: .2 }, d: 'Read once: how television comedy is built.' }
});
bzAdd('luxury', '', {
  l_racehorse: { name: 'A share in a racehorse', price: 15000, collect: 1, drift: 0, vol: .6, meet: 1, standing: .5, d: 'A leg of something fast. Owners\' enclosure, owners\' friends.' },
  l_gala: { name: 'A table at the industry gala', price: 20000, meet: 4, standing: 1.5, d: 'Ten seats, ten introductions, one speech you clap at.' },
  l_suite: { name: 'A season in a stadium suite', price: 25000, meet: 2, standing: 1, d: 'Executives talk more freely over bad food and good sport.' },
  l_island: { name: 'A week on a private island', price: 40000, stress: -30, meet: 1, standing: 1, d: 'No one can reach you. Someone famous is on the next beach.' },
  l_cellar: { name: 'A cellar of first-growth claret', price: 30000, collect: 1, drift: .07, vol: .15, d: 'It gets better every year you don\'t drink it.' },
  l_jet: { name: 'A share in a private jet', price: 150000, from: 1965, sub: 2000, fx: { energy: 3, standing: .05 }, d: 'Festivals without queues. +3 energy a week; $2,000 a week in fees.' }
});
// subscriptions charge every week; publicists move fame; things that run out of money lapse
{ const _bw = bazaarWeek; bazaarWeek = function () {
  _bw(); const M = S.me, me = ME();
  for (const it of (M.bz || []).filter(x => !x.sold && !x.used)) { const B = BZ_BY[it.k]; if (!B) continue;
    if (B.fx && B.fx.fame) me.fame = (me.fame || 0) + B.fx.fame;
    if (B.sub) { const c = usd(B.sub); if (M.cash < c) { it.sold = S.week; it.got = 0; diary(`Money: ${it.name} lapsed; you couldn't cover ${fmtCash(c)} this week.`); continue; } M.cash -= c; it.subPaid = (it.subPaid || 0) + c; } }
}; }
function bzSubTotal() { return (S.me.bz || []).filter(x => !x.sold && !x.used && (BZ_BY[x.k] || {}).sub).reduce((t, x) => t + usd(BZ_BY[x.k].sub), 0); }

// ---- gifts ----
const GIFT_KINDS = { flowers: 'flowers', wine: 'wine and spirits', book: 'books', music: 'records', food: 'food', style: 'clothes and pens', exp: 'evenings out', art: 'art', tech: 'gadgets' };
function giftTaste(q) {
  const K = Object.keys(GIFT_KINDS), bias = { writer: 'book', composer: 'music', musician: 'music', designer: 'art', costume: 'style', actor: 'exp', producer: 'wine', exec: 'wine', dp: 'tech', editor: 'tech', vfx: 'tech' }[q.role];
  const a = bias && gH(q.id, 'gift0') < .65 ? bias : K[Math.floor(gH(q.id, 'gift1') * K.length)];
  const rest = K.filter(k => k !== a), b = rest[Math.floor(gH(q.id, 'gift2') * rest.length)], rest2 = rest.filter(k => k !== b), c = rest2[Math.floor(gH(q.id, 'gift3') * rest2.length)];
  return { love: [a, b], hate: c };
}
function giftAct(a) {
  const M = S.me, me = ME(), it = (M.bz || []).find(x => x.id === a.id && !x.sold && !x.used), B = it && BZ_BY[it.k], q = P(a.to), k = M.known && M.known[a.to];
  if (!it || !B || !B.gift || !q || q.dead || !k || a.to === me.id) return false;
  if (k.giftW !== undefined && S.week - k.giftW < 4) return false;
  const T = giftTaste(q), love = T.love.includes(B.gift), hate = T.hate === B.gift, size = clamp(Math.log10(Math.max(20, B.price)) - 1.3, 0, 2);
  const d = hate ? -3 : love ? 6 + size * 2 : 2 + size;
  addTie(me, q, d); if (typeof remember === 'function') remember(a.to, d, love ? 'Loved your gift' : hate ? 'Didn\'t like your gift' : 'Liked your gift');
  it.used = 1; it.sold = S.week; it.got = 0; k.giftW = S.week; (k.gifts = k.gifts || {})[B.gift] = love ? 2 : hate ? -1 : 1; k.seen = S.week;
  const first = q.name.split(' ')[0];
  if (typeof sms === 'function') sms(a.to, love ? `${B.gift === 'food' ? 'i ate all of it already' : 'ok this is perfect'}. how did you know?? thank you` : hate ? 'oh! that\'s… thoughtful. thank you' : 'that was really kind, thank you');
  diary(`You gave ${first} ${B.name.toLowerCase().replace(/^an? /, 'a ').replace(/^a a /, 'a ')}${love ? ': they loved it' : hate ? ': not their thing' : ''}.`);
  return true;
}
function giftPeople() {
  const M = S.me, IC = typeof innerCircle === 'function' ? innerCircle().map(x => x[0]) : [], L = IC.concat(aliveKnown().filter(id => !IC.includes(id)).sort((a, b) => opinion(b) - opinion(a)));
  return L.filter(id => P(id) && !P(id).dead && id !== ME().id).slice(0, 8);
}
{ const _ba = bazaarApp; bazaarApp = function () {
  let h = _ba(); const M = S.me, tab = UI.bzt || 'gear';
  if (tab === 'gifts') h = h.replace('<div class="bzgrid">', `<p class="small muted">Everyone likes two kinds of present and dislikes one, and you only find out by giving. A loved gift brings you a real step closer; one a month per person is the decent limit. Buy here, give from Yours.</p><div class="bzgrid">`);
  const subs = bzSubTotal(); if (subs) h = h.replace('<span class="muted small" style="margin-left:auto">', `<span class="muted small" style="margin-left:auto">Subscriptions ${fmtCash(subs)}/wk · `);
  if (tab !== 'mine') return h;
  const G = (M.bz || []).filter(x => !x.sold && !x.used && (BZ_BY[x.k] || {}).gift); if (!G.length) return h;
  const ppl = giftPeople();
  const rows = G.map(it => { const B = BZ_BY[it.k]; return `<div class="gift-row"><b>${esc(it.name)}</b> <span class="muted small">${esc(GIFT_KINDS[B.gift])}</span><div class="gift-to">${ppl.map(id => { const k = M.known[id], seen = (k.gifts || {})[B.gift], wait = k.giftW !== undefined && S.week - k.giftW < 4;
    return `<button class="pill" data-gift="${it.id}:${id}" ${wait ? 'disabled title="Gave them something recently"' : ''}>${esc(P(id).name.split(' ')[0])}${seen === 2 ? ' ♥' : seen === -1 ? ' ✗' : seen === 1 ? ' ✓' : ''}</button>`; }).join('')}</div></div>`; }).join('');
  return h.replace('<div class="bazaar">', `<div class="bazaar"><section class="gifts"><h4>Gifts to give</h4><p class="small muted">♥ loved before · ✓ liked · ✗ not their thing. One gift per person every four weeks.</p>${rows}</section>`);
}; }
function giftClick(t) { const d = t.dataset && t.dataset.gift; if (!d) return false; const [id, to] = d.split(':').map(Number); if (!doAct({ t: 'gift', id, to })) inbox('note', 'Not now', 'You gave them something recently, or that gift is gone.'); render(true); return true; }
// one-off purchases (a massage, a festival badge, a stylist) are used up when bought: nothing to sell back
{ const _act = bazaarAct; bazaarAct = function (a) {
  const n = (S.me.bz || []).length, ok = _act(a); if (!ok || a.k !== 'buy') return ok;
  const it = S.me.bz[S.me.bz.length - 1], B = it && BZ_BY[it.k]; if (S.me.bz.length > n && B && !B.fx && !B.collect && !B.sub && !B.gift && it.film === undefined) it.used = 1; return ok;
}; }
