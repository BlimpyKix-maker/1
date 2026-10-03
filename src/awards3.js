// ---------------- Every prize, properly: trophies, histories, purposes and what winning does ----------------
// Each award body gets a statuette modelled on its real-world counterpart (a mask on a plinth, a compressed block
// of metal, a bronze bust, a beetle, a swan...), a history in this world's own names, what it is for, and what
// taking its top prize does for a career: in words, and in the game (a hiring boost that fades over the years).
Object.assign(STATUETTES, {
  ariel: ['Winged woman in bronze', (c, d) => `<path d="M40 18 Q44 22 42 30 L46 62 L34 62 L38 30 Q36 22 40 18Z" fill="${c}"/><circle cx="40" cy="15" r="4" fill="${c}"/><path d="M38 30 Q20 14 12 30 Q24 30 38 36Z M42 30 Q60 14 68 30 Q56 30 42 36Z" fill="${c}" stroke="${d}" stroke-width=".6"/>`],
  mask: ['Theatre mask on a plinth', (c, d) => `<rect x="37" y="46" width="6" height="16" fill="${d}"/><path d="M24 20 Q40 12 56 20 Q58 40 40 50 Q22 40 24 20Z" fill="${c}"/><path d="M30 28 q4 -3 8 0 M42 28 q4 -3 8 0" stroke="${d}" stroke-width="2.2" fill="none"/><path d="M34 40 q6 3 12 0" stroke="${d}" stroke-width="1.6" fill="none"/>`],
  compression: ['A crushed block of gold', (c, d) => `<path d="M26 22 L52 18 L56 30 L50 40 L56 52 L48 62 L28 62 L24 50 L30 40 L22 30Z" fill="${c}"/><path d="M30 26 L48 30 M28 38 L52 36 M30 48 L50 52 M34 22 L36 60 M44 20 L46 62" stroke="${d}" stroke-width="1" opacity=".7"/>`],
  david: ['A young David in gilt bronze', (c, d) => `<circle cx="40" cy="16" r="5" fill="${c}"/><path d="M36 22 L44 22 L46 40 L44 62 L40 62 L40 46 L38 62 L34 62 L34 40Z" fill="${c}"/><path d="M44 26 L52 34 M36 26 L30 36" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M52 34 l4 3" stroke="${d}" stroke-width="2"/>`],
  lola: ['A gilded woman in flowing robes', (c, d) => `<circle cx="40" cy="15" r="4.5" fill="${c}"/><path d="M36 21 Q40 19 44 21 L48 40 Q56 52 50 62 L30 62 Q24 52 32 40Z" fill="${c}"/><path d="M44 24 Q56 18 60 10 M36 24 Q26 30 24 40" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 44 Q40 50 46 44 M32 54 Q40 58 48 54" stroke="${d}" fill="none"/>`],
  bust: ['A bronze bust of a painter', (c, d) => `<path d="M26 62 Q24 46 34 42 L46 42 Q56 46 54 62Z" fill="${c}"/><rect x="36" y="36" width="8" height="8" fill="${c}"/><ellipse cx="40" cy="27" rx="10" ry="12" fill="${c}"/><path d="M30 24 Q34 12 46 14 Q52 18 50 26" fill="${d}" opacity=".5"/><path d="M36 30 q4 2 8 0" stroke="${d}" fill="none"/>`],
  horse: ['A golden horse', (c, d) => `<path d="M22 62 L24 44 Q20 40 22 34 Q30 30 44 32 L50 22 Q56 18 60 22 L58 30 Q56 34 52 34 L52 44 L54 62 L50 62 L48 46 L30 46 L28 62Z" fill="${c}"/><path d="M50 22 L52 16 L54 22" fill="${c}"/><path d="M22 36 Q14 40 16 50" stroke="${c}" stroke-width="3" fill="none"/>`],
  figure: ['A standing figure', (c, d) => `<circle cx="40" cy="16" r="5" fill="${c}"/><path d="M34 23 L46 23 L48 44 L45 62 L35 62 L32 44Z" fill="${c}"/><path d="M34 26 L28 42 M46 26 L52 42" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`],
  dragon: ['A coiled blue dragon', (c, d) => `<path d="M24 62 Q14 50 24 40 Q34 30 30 22 Q28 14 38 12 Q50 12 52 22 Q54 30 46 34 Q38 40 46 48 Q54 56 46 62Z" fill="#5E8FD6" stroke="${d}" stroke-width="1.2"/><circle cx="44" cy="18" r="1.8" fill="#fff"/><path d="M50 14 L58 8 M52 18 L60 16" stroke="#5E8FD6" stroke-width="2"/><path d="M26 44 l-6 -2 M28 52 l-6 2" stroke="${d}"/>`],
  rooster: ['A golden rooster', (c, d) => `<path d="M24 62 L28 44 Q22 34 30 26 Q34 20 40 22 L42 16 L46 20 L48 16 L50 22 Q56 26 52 32 L48 34 Q60 30 66 18 Q68 34 58 44 L52 46 L54 62 L50 62 L46 48 L36 48 L32 62Z" fill="${c}"/><path d="M52 26 L58 28 L52 30" fill="#C8553D"/><circle cx="48" cy="25" r="1.4" fill="${d}"/>`],
  blacklady: ['A dark bronze lady, arms raised', (c, d) => `<circle cx="40" cy="20" r="4.5" fill="#3A2A20"/><path d="M36 26 Q40 24 44 26 L46 44 Q50 54 46 62 L34 62 Q30 54 34 44Z" fill="#3A2A20"/><path d="M37 27 Q30 18 32 8 M43 27 Q50 18 48 8" stroke="#3A2A20" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 40 Q40 44 44 40" stroke="${c}" stroke-width=".8" fill="none"/>`],
  ringfig: ['A figure inside a golden ring', (c, d) => `<circle cx="40" cy="36" r="22" fill="none" stroke="${c}" stroke-width="4"/><circle cx="40" cy="22" r="4" fill="${c}"/><path d="M36 27 L44 27 L45 46 L42 56 L38 56 L35 46Z" fill="${c}"/><path d="M36 30 L26 24 M44 30 L54 24" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`],
  kiwi: ['A kiwi bird', (c, d) => `<ellipse cx="38" cy="46" rx="18" ry="14" fill="${c}"/><circle cx="54" cy="34" r="7" fill="${c}"/><path d="M60 35 Q70 42 72 52" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M34 58 L32 64 M44 58 L46 64" stroke="${d}" stroke-width="2"/><circle cx="56" cy="32" r="1.2" fill="${d}"/>`],
  pyramid: ['A golden pyramid', (c, d) => `<path d="M14 62 L40 16 L66 62Z" fill="${c}"/><path d="M40 16 L46 62" stroke="${d}" stroke-width="1.2" opacity=".6"/><path d="M24 46 h32 M30 36 h20" stroke="${d}" stroke-width=".7" opacity=".5"/>`],
  condor: ['A silver condor, wings spread', (c, d) => `<path d="M40 28 Q46 30 46 38 L44 60 L36 60 L34 38 Q34 30 40 28Z" fill="${c}"/><circle cx="40" cy="24" r="4.5" fill="${c}"/><path d="M36 34 Q20 22 8 30 Q22 34 34 42Z M44 34 Q60 22 72 30 Q58 34 46 42Z" fill="${c}" stroke="${d}" stroke-width=".6"/><path d="M40 24 l3 2 l-3 1" fill="${d}"/>`],
  nike: ['Winged Victory', (c, d) => `<path d="M38 24 L44 24 L48 46 Q52 56 46 62 L34 62 Q32 52 34 44Z" fill="${c}"/><circle cx="41" cy="19" r="4" fill="${c}"/><path d="M42 26 Q60 8 70 14 Q60 22 50 34Z M40 26 Q30 12 22 18 Q30 26 38 34Z" fill="${c}" stroke="${d}" stroke-width=".6"/>`],
  beetle: ['A golden beetle', (c, d) => `<ellipse cx="40" cy="42" rx="15" ry="19" fill="${c}"/><circle cx="40" cy="22" r="7" fill="${c}"/><path d="M40 26 L40 60" stroke="${d}" stroke-width="1.2"/><path d="M26 34 L16 28 M26 44 L14 44 M26 54 L16 60 M54 34 L64 28 M54 44 L66 44 M54 54 L64 60 M36 16 L32 8 M44 16 L48 8" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`],
  lionsit: ['A seated lion', (c, d) => `<path d="M26 62 L28 44 Q24 30 34 24 Q44 18 52 26 Q58 34 52 40 L54 62 L48 62 L46 48 L36 48 L34 62Z" fill="${c}"/><circle cx="44" cy="28" r="10" fill="${c}" stroke="${d}" stroke-width="1"/><path d="M20 50 Q14 40 22 34" stroke="${c}" stroke-width="3" fill="none"/><circle cx="47" cy="27" r="1.3" fill="${d}"/>`],
  orange: ['A golden orange on a leaf', (c, d) => `<circle cx="40" cy="42" r="18" fill="${c}"/><path d="M40 24 Q48 12 58 16 Q50 24 40 24Z" fill="#5E9A4A"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${32 + (i % 3) * 8}" cy="${36 + Math.floor(i / 3) * 10}" r=".9" fill="${d}" opacity=".5"/>`).join('')}`],
  swan: ['A golden swan', (c, d) => `<path d="M18 52 Q20 40 36 42 Q30 34 34 24 Q38 14 46 16 Q52 18 50 24 L46 22 Q40 22 42 32 Q46 42 60 40 Q66 46 60 56 Q44 64 18 52Z" fill="${c}"/><path d="M50 24 L56 26 L50 27" fill="${d}"/>`],
  kite: ['A silver kite', (c, d) => `<path d="M40 12 L58 32 L40 54 L22 32Z" fill="${c}" stroke="${d}"/><path d="M40 12 L40 54 M22 32 L58 32" stroke="${d}"/><path d="M40 54 Q34 58 40 62 Q46 64 40 66" stroke="${c}" stroke-width="1.6" fill="none"/>`],
  butterfly: ['A yellow butterfly', (c, d) => `<path d="M40 26 L40 56" stroke="${d}" stroke-width="2.5" stroke-linecap="round"/><path d="M40 34 Q20 10 14 28 Q12 42 38 40Z M40 34 Q60 10 66 28 Q68 42 42 40Z M40 42 Q24 46 22 58 Q32 62 38 46Z M40 42 Q56 46 58 58 Q48 62 42 46Z" fill="#F2C94C" stroke="${d}" stroke-width=".8"/>`],
  horn: ['A silver horn', (c, d) => `<path d="M18 60 Q22 30 48 20 Q60 16 64 12 L66 22 Q58 24 52 30 Q34 44 30 62Z" fill="${c}"/><ellipse cx="65" cy="17" rx="3" ry="6" fill="${d}" opacity=".5"/>`],
  rider: ['A horse and rider in gold', (c, d) => `<path d="M22 62 L24 46 Q20 40 26 36 Q36 34 46 36 L52 28 Q58 26 60 30 L58 36 L54 38 L54 46 L56 62 L52 62 L50 50 L30 50 L28 62Z" fill="${c}"/><path d="M36 36 L36 24 L42 24 L42 36" fill="${c}"/><circle cx="39" cy="20" r="3.5" fill="${c}"/><path d="M42 26 L50 18" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`],
  starfig: ['A figure holding a star', (c, d) => `<circle cx="40" cy="22" r="4.5" fill="${c}"/><path d="M36 28 L44 28 L46 46 L43 62 L37 62 L34 46Z" fill="${c}"/><path d="M44 30 L52 18" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M54 6 L56 12 L62 12 L57 16 L59 22 L54 18 L49 22 L51 16 L46 12 L52 12Z" fill="${c}"/>`],
  typewriter: ['A golden typewriter', (c, d) => `<rect x="18" y="38" width="44" height="20" rx="3" fill="${c}"/><rect x="22" y="22" width="36" height="16" fill="#F4EEDC" stroke="${d}"/><path d="M26 28 h28 M26 32 h22" stroke="${d}" stroke-width=".8"/><rect x="16" y="34" width="48" height="4" rx="2" fill="${d}"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${23 + i * 5.5}" cy="47" r="1.8" fill="${d}"/>`).join('')}`],
  clapper: ['A golden clapperboard', (c, d) => `<rect x="18" y="32" width="44" height="28" rx="2" fill="${c}"/><path d="M18 24 L60 16 L62 24 L20 32Z" fill="${d}"/>${[0, 1, 2, 3].map(i => `<path d="M${24 + i * 10} ${22.5 - i * 1.9} L${30 + i * 10} ${29 - i * 1.9}" stroke="${c}" stroke-width="3"/>`).join('')}<path d="M24 42 h32 M24 50 h22" stroke="${d}" stroke-width="1"/>`],
  note: ['A golden note', (c, d) => `<ellipse cx="32" cy="54" rx="9" ry="6.5" fill="${c}" transform="rotate(-20 32 54)"/><rect x="38" y="16" width="4" height="38" fill="${c}"/><path d="M42 16 Q56 22 52 36 Q50 26 42 26Z" fill="${c}"/>`]
});
// The national academies' statuettes, after their real-world counterparts.
const CER_TROPHY = { US: ['oswald', 'gold'], CA: ['ringfig', 'gold'], MX: ['ariel', 'bronze'], UK: ['mask', 'bronze'], FR: ['compression', 'gold'], IT: ['david', 'gold'], DE: ['lola', 'gold'], ES: ['bust', 'bronze'], HK: ['starfig', 'gold'], TW: ['horse', 'gold'], JP: ['figure', 'gold'], KR: ['dragon', 'silver'], CN: ['rooster', 'gold'], IN: ['blacklady', 'bronze'], AU: ['ringfig', 'gold'], NZ: ['kiwi', 'bronze'], NG: ['star', 'gold'], EG: ['pyramid', 'gold'], BR: ['figure', 'bronze'], AR: ['condor', 'silver'], SU: ['nike', 'gold'], SE: ['beetle', 'gold'], DK: ['figure', 'silver'], CS: ['lionsit', 'silver'], PL: ['condor', 'gold'], HU: ['figure', 'bronze'], FI: ['figure', 'bronze'], TR: ['orange', 'gold'], IR: ['bird', 'silver'], SN: ['rider', 'gold'], PH: ['figure', 'gold'], TH: ['swan', 'gold'], VN: ['kite', 'silver'], CO: ['butterfly', 'gold'], ID: ['figure', 'gold'], ZA: ['horn', 'silver'] };
const CONTEST_TROPHY = { write: ['typewriter', 'gold'], direct: ['clapper', 'gold'], craft: ['medal', 'silver'], music: ['note', 'gold'], act: ['mask', 'silver'], produce: ['clapper', 'silver'], fun: ['cup', 'silver'], podcast: ['mic', 'silver'], creator: ['camera', 'silver'], stage: ['footlight', 'silver'] };
function bodyTrophy(b) {
  if (b.kind === 'ceremony') return CER_TROPHY[b.m] || ['star', 'gold'];
  if (b.kind === 'festival') { const F = FESTIVALS.find(x => x.k === b.fk); const p = F && F.prizes && F.prizes[0]; return p ? [p[1], /Silver/.test(p[0]) ? 'silver' : p[1] === 'mountain' ? 'bronze' : 'gold'] : ['star', 'gold']; }
  if (b.kind === 'music') return ['gramophone', 'gold'];
  if (b.kind === 'stage') return ['footlight', 'silver'];
  if (b.key === 'The Emmets') return ['emmet', 'gold'];
  if (b.key === 'The Golden Mics') return ['mic', 'gold'];
  if (b.kind === 'contest') { const c = (typeof COMPS !== 'undefined' ? COMPS : []).find(x => x.k === b.comp); const t = CONTEST_TROPHY[c && c.cat] || ['plaque', 'bronze']; return c && c.tier === 'major' ? [t[0], 'gold'] : c && c.tier === 'mid' ? [t[0], 'silver'] : [t[0], 'bronze']; }
  return ['star', 'gold'];
}
// ---- the lore: histories and purposes, in this world's own names ----
const CER_LORE = {
  US: ['The industry\'s own prize and the most famous night in show business. The first ceremony, in a hotel ballroom, took fifteen minutes and the winners had been announced three months earlier; the sealed envelopes came after a newspaper printed the results early. Television made it a global event. Three films share the record of eleven wins.', 'A win reprices a career overnight: higher fees, first refusal on scripts, and the phrase that sells every film you make afterwards.'],
  CA: ['Canada\'s screen academy began handing out awards in the late 1940s, was reborn several times under new names, and now covers film, television and digital media in a single gala in Toronto.', 'Funding bodies and broadcasters notice; it opens doors at home more than abroad.'],
  MX: ['Mexico\'s Academy has given its winged bronze since 1947, through the golden age of Mexican cinema, a long decline and a new generation that took Mexican directors to the top of the world.', 'At home, a sure way to get your next film financed; abroad, festival programmers start paying attention.'],
  UK: ['Founded after the war by a group of British filmmakers led by a director who wanted the industry to honour itself, the British Academy merged film and television in the 1950s. Its theatrical mask was designed by an American sculptor and has hardly changed since. Its date, a few weeks before the Oswalds, makes it the race\'s last great signal.', 'A strong pointer for the Oswalds; and in Britain, the end of having to explain yourself to financiers.'],
  FR: ['The French academy\'s prize is named after the sculptor who designed it: each statuette is a block of metal crushed in a hydraulic press, so no two are quite alike. It began in the mid-1970s with an actor-producer\'s dream of a French Oswald.', 'French financing, co-productions and the pick of French actors.'],
  IT: ['Italy\'s academy prize takes its name from Donatello\'s bronze youth. It began in Rome in the 1950s, at the height of neorealism and Cinecittà, and once presented its winners to the President of the Republic.', 'Respect in Rome and the European festival circuit.'],
  DE: ['The German Film Prize is the richest in Europe: alongside the gilded figure, winners take home government money that must be spent on their next film. Since 2005 the industry\'s own academy has chosen the winners.', 'Real money for the next project, and the attention of German co-producers.'],
  ES: ['Spain\'s academy prize is a bronze bust of the great painter of Spanish life. It began in the late 1980s, when Spanish film was finding a new freedom after the dictatorship.', 'Spanish-language markets on both sides of the Atlantic open up.'],
  HK: ['Hong Kong\'s awards were founded by a film magazine in the early 1980s, the golden age of the city\'s action cinema, and are now voted by the industry\'s guilds. The statuette holds up a star.', 'Asian distributors and the pan-Chinese market pay attention.'],
  TW: ['The most prestigious prize in Chinese-language cinema, held in Taipei since 1962. Its golden horse has gone to filmmakers from Taiwan, Hong Kong, the mainland and Malaysia, sometimes to the anger of governments.', 'The badge of honour for any Chinese-language filmmaker.'],
  JP: ['Japan\'s academy prize was founded in the late 1970s, modelled on the Oswalds, with the big studios\' employees as voters. It reliably rewards popular dramas and the occasional surprise.', 'Japanese studios and television networks call.'],
  KR: ['Korea\'s best-watched film awards are run by a newspaper and have been since 1963. Its silver-blue dragon is a fixture of the year-end television schedule.', 'At home, the kind of fame that sells advertising.'],
  CN: ['Mainland China\'s professional prize is a golden rooster, chosen by experts rather than audiences, alternating years with a popular-vote award.', 'Respect in a market of a billion moviegoers; access to state co-productions.'],
  IN: ['India\'s oldest popular film awards were founded by a film magazine in 1954. Its statuette, a slender figure with raised arms cast in dark bronze, is known affectionately as the Black Lady.', 'A sure sign you have arrived in the biggest film industry on Earth.'],
  AU: ['Australia\'s screen academy was reborn in 2011 from awards dating to 1958; its gold figure stands inside a ring.', 'Funding bodies and the international sales companies that represent Australian work.'],
  NZ: ['New Zealand\'s screen awards honour a small industry that punches above its weight; its trophy is a kiwi.', 'Home funding and pride.'],
  NG: ['The viewers\' choice awards of African cinema, televised across the continent, half chosen by public vote.', 'Audience love across Africa and the diaspora; streamers notice.'],
  EG: ['Egypt\'s national prize honours the largest film industry in the Arab world, once known as the Hollywood of the East.', 'The Arabic-speaking market.'],
  BR: ['The Brazilian academy\'s awards are named after a beloved comic actor; they honour Brazilian cinema\'s new wave and its revival.', 'Brazil\'s financing bodies and festivals.'],
  AR: ['The Argentine critics\' silver condor is the oldest film award in Latin America, given since 1943.', 'Critics\' attention throughout Latin America.'],
  SU: ['Russia\'s academy prize is a statuette of the goddess of victory, founded in the late Soviet years as the old studio system collapsed.', 'Respect in Russian cinema.'],
  SE: ['Sweden\'s national film awards have given a golden beetle since 1964, a strange little trophy that looks like a scarab and is treasured by its owners.', 'Scandinavian co-productions.'],
  DK: ['Denmark\'s critics\' prize is one of Europe\'s oldest, given since the 1940s; its statuette is a porcelain figure.', 'Critics\' attention across Scandinavia.'],
  CS: ['The Czech Lion was founded in 1993, after the Velvet Revolution, to honour a new Czech cinema.', 'Prague\'s studios and European co-producers.'],
  PL: ['Poland\'s academy awards an eagle, honouring a national cinema that produced some of the world\'s greatest directors.', 'Polish financing and the European festival circuit.'],
  HU: ['Hungary\'s film week has crowned the nation\'s best since 1965.', 'Respect in Budapest.'],
  FI: ['Finland\'s Jussi, a figure of a farmhand, is one of the world\'s oldest national film awards, given since 1944.', 'Finnish financing.'],
  TR: ['Turkey\'s oldest festival prize, a golden orange, has been awarded in Antalya since 1964.', 'The Turkish market.'],
  IR: ['Iran\'s national festival in Tehran awards a crystal bird from Persian myth.', 'Recognition in a cinema the world\'s festivals watch closely.'],
  SN: ['The pan-African festival\'s top prize, a golden stallion and rider after a legendary princess, has been given since 1969.', 'Distributors and festivals across Africa and Europe.'],
  PH: ['The Philippines\' oldest film awards, given since 1952.', 'The Filipino market.'],
  TH: ['Thailand\'s national film awards have given a golden swan since 1955.', 'Thai studios.'],
  VN: ['Vietnam\'s cinema association gives a silver kite.', 'Vietnamese studios.'],
  CO: ['Colombia\'s academy awards are named after the town in a famous novel; its trophy is a yellow butterfly.', 'Colombian and Latin American co-producers.'],
  ID: ['Indonesia\'s national film festival award, given since 1955.', 'The Indonesian market.'],
  ZA: ['South Africa\'s film and television awards, a silver horn.', 'South African broadcasters.']
};
const FEST_LORE = {
  mountain: ['Founded at the end of the seventies by a movie star who wanted a home for independent American film, held in a ski town in January. It made stars of first-time directors in the 1980s and 90s and became the market where small films are sold for big money.', 'Buyers bid for your film in the snow; agents sign you on the spot.'],
  cote: ['The world\'s most prestigious film festival began in 1946 on the Mediterranean; a first edition planned for 1939 was cancelled by the war. Its red steps, black tie and booing critics are legendary. The top prize was renamed after the palm trees on the town\'s coat of arms.', 'Instant worldwide recognition, sales in every territory, and a place in the history of cinema.'],
  lagoon: ['The oldest film festival in the world, founded in 1932 on an island in a lagoon. It has hosted premieres of masterpieces and fiascos alike; in recent years it has launched the Oswald season.', 'A head start in the awards race and the respect of auteurs.'],
  north: ['A big public festival in a northern city, founded in 1976. Its audience award is the best predictor of the Oswalds there is.', 'The audience prize is an Oswald bellwether; distributors queue.'],
  shorts: ['A small, friendly harbour-town festival for short films and first features, founded in 1979.', 'A first prize and a first step: agents and producers scout here.'],
  bruin: ['Founded in 1951 in a divided city as a showcase of the free world, the festival is now the most political of the big three. Its golden bear is the city\'s emblem.', 'European prestige, sales and a political platform.'],
  leopard: ['A lakeside festival founded in 1946, showing films to eight thousand people in an open-air square at night. Its leopard goes to bold, formally adventurous work.', 'The respect of cinephiles and festival programmers worldwide.'],
  shell: ['A seaside festival founded in 1953, the most important in the Spanish-speaking world. Its golden shell is a scallop.', 'The Spanish-speaking world opens up.'],
  springs: ['Founded in 1946 in a spa town, it gives a crystal globe and stars descend on its colonnades for a week each summer.', 'Central and Eastern European distribution.'],
  haeundae: ['Founded in 1996, it quickly became Asia\'s most important festival, with a market for the whole continent. Its New Currents award goes to first and second films.', 'Asian distribution and the attention of the world\'s programmers.'],
  tokyo: ['Founded in 1985, Japan\'s biggest international festival.', 'Japanese distribution.'],
  southbound: ['A music, film and tech festival in a Texas college town, founded in 1987.', 'American indie distributors and tech money.'],
  manhattan: ['A festival founded in 2002 to revive downtown after disaster.', 'New York\'s independent scene.'],
  alpine: ['The world\'s leading animation festival, on a lake in the Alps since 1960, with a market where animation is sold.', 'Every animation studio in the world notices.'],
  canal: ['The world\'s biggest documentary festival, in a canal city since 1988.', 'Documentary funds and broadcasters.'],
  hottakes: ['A documentary festival founded in 1993 in Toronto.', 'Documentary broadcasters.'],
  midnight: ['A festival of fantastic cinema on the Catalan coast, since 1968, for horror, science fiction and fantasy.', 'Genre fans, genre distributors.'],
  gateway: ['A Bay Area festival, the oldest in the Americas for its city.', 'American art-house distribution.'],
  ouaga: ['Founded in 1969 in Ouagadougou: Africa\'s most important festival, every two years, with its golden stallion.', 'Distribution and funding across Africa.'],
  tiger: ['A port-city festival founded in 1972, champion of new directors and independent cinema.', 'Bold new directors get their start.'],
  harbourhk: ['Asia\'s oldest international film festival, founded in 1977.', 'Asia notices.'],
  plata: ['Latin America\'s oldest A-list festival, since 1954.', 'Latin American distribution.'],
  londonff: ['The capital\'s festival since 1957, a festival of festivals.', 'British distribution.'],
  pass: ['A small mountain showcase founded in 1974, where the Oswald season often starts.', 'Awards-season buzz.']
};
const MEDIA_LORE = {
  'The Gramophones': ['The recording academy\'s awards began in 1959, named after the machine that started it all. The ceremony has grown into music\'s biggest night, with dozens of categories decided by thousands of voting members.', 'A Gramophone sells records for years, raises your booking fee and puts you in the conversation for the EGOF.'],
  'The Footlights': ['Theatre\'s highest honour, named after the lights along the front of the stage. Founded in 1947, it is decided by critics, producers and theatre people, and a win can keep a show open for years.', 'Ticket sales, a longer run, transfers to other cities, and a step toward the EGOF.'],
  'The Golden Mics': ['The audio industry\'s awards, founded when podcasting became a business.', 'Advertisers and networks come calling.'],
  'The Emmets': ['Television\'s academy has given its winged figure holding an atom since 1949, and now covers streaming and online video too.', 'Renewals, bigger budgets and a step toward the EGOF.']
};
function bodyLore(b) {
  if (b.kind === 'ceremony') return CER_LORE[b.m] || [`${b.about}`, 'Recognition at home.'];
  if (b.kind === 'festival') return FEST_LORE[b.fk] || [b.about || '', 'Programmers and buyers notice.'];
  if (MEDIA_LORE[b.key]) return MEDIA_LORE[b.key];
  if (b.kind === 'contest') {
    const c = (typeof COMPS !== 'undefined' ? COMPS : []).find(x => x.k === b.comp) || {}, r = hashRand([...b.name].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0), yr = 1950 + Math.floor(r() * 70);
    const origin = abPick(r, ['began as a dare in a bar and outgrew the bar', 'was started by a retired teacher who wanted newcomers to have a door to knock on', 'grew out of an evening class that refused to end', 'was founded by a producer who found his first writer in a slush pile', 'started with twelve entries and a cheque from a local cinema', 'was set up by a guild to find the next generation']);
    const tier = c.tier === 'major' ? 'Industry people take it seriously: past winners have gone on to big careers.' : c.tier === 'mid' ? 'It is a respected stepping stone; agents read the shortlist.' : 'It is mostly for the love of it, and the bragging rights.';
    return [`${b.name} ${origin} in ${yr}. ${c.d || b.about || ''} ${tier}`, c.tier === 'major' ? 'A win means meetings, representation and often a paid opportunity.' : c.tier === 'mid' ? 'A line on your CV that gets your next submission read.' : 'Bragging rights, a little standing, and a story for parties.'];
  }
  return [b.about || '', 'Recognition.'];
}
function abPick(r, L) { return L[Math.floor(r() * L.length)]; }
// What a top prize does in the game: a hiring edge that fades over years, plus the fame and standing it brings at once.
function laurelWeight(b) { return b.kind === 'ceremony' ? (b.m === 'US' ? 1.4 : b.prestige === 2 ? .8 : .5) : b.kind === 'festival' ? (b.prestige === 1 ? .9 : b.prestige === 2 ? .55 : .3) : b.kind === 'contest' ? (b.prestige === 1 ? .45 : b.prestige === 2 ? .25 : .1) : .8; }
function myLaurels() {
  if (!S.me) return [];
  const me = ME(), out = [];
  for (const s of me.awards || []) { const y = +((s.match(/\b(19|20)\d\d$/) || [])[0]) || S.year, b = awardBodies().find(x => [x.key, ...(x.alias || [])].some(k => s.startsWith(k) || s.includes(', ' + k))); if (b) out.push({ b, y, t: s }); }
  for (const e of S.me.comps || []) if (e.place === 'win') { const b = awardBodies().find(x => x.comp === e.k); if (b) out.push({ b, y: yearOf(e.w || S.week), t: b.name }); }
  return out;
}
function laurelFactors() {
  const L = myLaurels(); if (!L.length) return [];
  let v = 0, top = null;
  for (const l of L) { const w = laurelWeight(l.b) * Math.pow(.8, Math.max(0, S.year - l.y)); v += w; if (!top || w > top.w) top = { w, l }; }
  return v > .05 ? [[`Your prizes (${top.l.b.name}${L.length > 1 ? ` and ${L.length - 1} more` : ''})`, Math.min(1.6, v)]] : [];
}
function bodyLoreHTML(b) {
  const [kind, metal] = bodyTrophy(b), [hist, perk] = bodyLore(b), W = bodyWinners(b);
  const counts = {}; for (const w of W) for (const id of w.people || []) counts[id] = (counts[id] || 0) + 1;
  const topP = Object.entries(counts).sort((a, c) => c[1] - a[1]).slice(0, 6).filter(x => P(+x[0]));
  const fc = {}; for (const w of W) if (w.film !== undefined) fc[w.film] = (fc[w.film] || 0) + 1;
  const topF = Object.entries(fc).sort((a, c) => c[1] - a[1]).slice(0, 5).filter(x => S.films[+x[0]]);
  const mine = myLaurels().filter(l => l.b === b);
  const w = laurelWeight(b);
  return `<section class="panel abl"><div class="abl-grid"><figure class="abl-tro">${statuetteSVG(kind, metal, 120)}<figcaption>${esc((STATUETTES[kind] || STATUETTES.star)[0])}</figcaption></figure>
   <div><h3>History</h3><p>${esc(hist)}</p><h3>What winning does</h3><p>${esc(perk)}</p><p class="small muted">In the game: winners gain standing, fame and international reach at once, and a hiring edge worth about <b>+${Math.round(w * 100) / 100}</b> on the odds, fading by a fifth each year.</p>
   ${mine.length ? `<p class="good"><b>You've won it ${mine.length > 1 ? mine.length + ' times' : 'once'}</b>: ${mine.map(l => l.y).join(', ')}.</p>` : ''}</div></div>
   ${topP.length || topF.length ? `<div class="cols two">${topP.length ? `<div><h4>Most decorated people</h4><ol class="small">${topP.map(([id, n]) => `<li>${pl(+id)} <span class="muted">${n}</span></li>`).join('')}</ol></div>` : ''}${topF.length ? `<div><h4>Most decorated films</h4><ol class="small">${topF.map(([id, n]) => `<li>${fl(+id)} <span class="muted">${n}</span></li>`).join('')}</ol></div>` : ''}</div>` : ''}</section>`;
}
// The awards hub: a cabinet of every prize in the world, as trophies you can open.
function awardsCabinetHTML() {
  const B = awardBodies(), F = UI.abf = UI.abf || 'all', kinds = { all: 'All', ceremony: 'Film academies', festival: 'Festivals', music: 'Music', stage: 'Theatre', media: 'Screens & audio', contest: 'Competitions' };
  const q = (UI.abq || '').toLowerCase(), L = B.filter(b => (F === 'all' || b.kind === F) && (!q || b.name.toLowerCase().includes(q))).sort((a, c) => a.prestige - c.prestige || a.name.localeCompare(c.name));
  const mineIds = new Set(myLaurels().map(l => l.b.id));
  return `<section class="panel"><h3>The world's prizes <span class="count">${B.length}</span></h3><p class="small muted">Open any prize for its history, what it rewards, what winning does for a career, every category and every winner on record.</p>
   <div class="bfilter"><div class="bf-row">${Object.entries(kinds).map(([k, l]) => `<button class="pill${F === k ? ' on' : ''}" data-abf="${k}">${l}</button>`).join('')}<input id="abq" type="search" placeholder="Find a prize…" value="${esc(UI.abq || '')}"></div></div>
   <div class="abgrid">${L.map(b => { const [k, m] = bodyTrophy(b); return `<a href="#" class="abc${mineIds.has(b.id) ? ' won' : ''}" data-go="award:${b.id}">${statuetteSVG(k, m, 56)}<b>${esc(b.name)}</b><span>${esc(kinds[b.kind] || b.kind)} · ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][b.month]}</span><i>${'★'.repeat(4 - b.prestige)}</i></a>`; }).join('')}</div></section>`;
}
