// ---------------- Television: networks, shows, seasons, ratings, the Emmets, and a career in it ----------------
// Every market has its channels: broadcast networks, cable, premium cable, public broadcasters, kids' channels and,
// from the 2010s, streamers. Each launches shows every year, with a creator, a showrunner and a cast drawn from the
// world's real people, seasons that run until the ratings say stop, episode titles, and an Emmet now and then. TV
// history's landmark series are there under their usual parody names. You can work in it (a writers' room ladder,
// directing episodes, guest spots, a series-regular part, crew) and you can pitch your own: a pilot, a series order,
// seasons, renewals, cancellations. All of the world's TV is a pure function of the world's seed and the year.

// [key, name, kind, hub, founded, originals from, new shows a year, about]
const TV_NETS_RAW = [
  ['nbs', 'Meridian Broadcasting', 'broadcast', 'newyork', 1946, 1946, 6, 'The oldest of the big three networks: comedies, cop shows and the late-night institution.'],
  ['cbn', 'Keystone Television', 'broadcast', 'newyork', 1948, 1948, 6, 'The "Tiffany network": sitcoms, procedurals and the audience that never changes the channel.'],
  ['abn', 'Lighthouse Network', 'broadcast', 'hollywood', 1948, 1948, 6, 'Third of the big three; family comedies, soaps and the odd glorious experiment.'],
  ['vix', 'Redwood Network', 'broadcast', 'hollywood', 1986, 1986, 4, 'The upstart fourth network: animation, reality and shows the others wouldn\'t touch.'],
  ['seen', 'Ninefold', 'broadcast', 'hollywood', 2006, 2006, 3, 'Young-adult drama and superheroes on a budget.'],
  ['pbn', 'Commons Public TV', 'public', 'newyork', 1970, 1970, 2, 'Public television: documentaries, imported period drama and the best children\'s programming in the world.'],
  ['hbx', 'Velvet', 'premium', 'newyork', 1972, 1983, 2, 'Premium cable that decided it wasn\'t television, and changed what television could be.'],
  ['showtyme', 'Marquee Premium', 'premium', 'newyork', 1976, 1986, 1, 'The other premium channel: darker, stranger, often brilliant.'],
  ['amx', 'Ampersand', 'cable', 'newyork', 1984, 2007, 1, 'Old films on a loop, until a drama about advertising men made it a prestige network.'],
  ['fxn', 'Blue Ember', 'cable', 'hollywood', 1994, 2002, 2, 'Basic cable with premium ambitions.'],
  ['comedyc', 'Giggle Box', 'cable', 'newyork', 1991, 1992, 1, 'Stand-up, sketch, satire and one very rude cartoon.'],
  ['mtvee', 'Jukebox TV', 'cable', 'newyork', 1981, 1992, 1, 'Music videos, then reality television, then reality television about music videos.'],
  ['nickel', 'Treehouse Kids', 'kids', 'newyork', 1979, 1980, 1, 'Television for children, made to be slimed.'],
  ['toonx', 'Inkwell Toons', 'kids', 'hollywood', 1992, 1994, 1, 'Animation around the clock, and late at night, for grown-ups.'],
  ['netflicks', 'Streamly', 'streaming', 'hollywood', 2013, 2013, 6, 'The red envelope company that became the biggest channel in the world.'],
  ['hula', 'Couchwave', 'streaming', 'hollywood', 2012, 2014, 2, 'Network television the day after, and then shows of its own.'],
  ['prime', 'Parcel Plus', 'streaming', 'hollywood', 2015, 2015, 3, 'A shopping company\'s streaming service, with fantasy budgets.'],
  ['dizplus', 'Castle+', 'streaming', 'hollywood', 2019, 2019, 3, 'Every princess, every superhero, every galaxy far away.'],
  ['peartv', 'Orchard+', 'streaming', 'hollywood', 2019, 2019, 2, 'A phone company\'s streamer: few shows, expensive ones.'],
  ['bbx', 'Albion One', 'public', 'london', 1946, 1946, 4, 'Britain\'s public broadcaster: period drama, sitcoms, a time-travelling doctor.'],
  ['itvee', 'Tower Television', 'broadcast', 'london', 1955, 1955, 3, 'Commercial television for Britain: soaps, quizzes and stately homes.'],
  ['chan4', 'Signal Four', 'broadcast', 'london', 1982, 1982, 2, 'Public-service but commercial, and pleased to shock.'],
  ['nkh', 'Kumo Public Broadcasting', 'public', 'tokyo', 1953, 1953, 2, 'Japan\'s public broadcaster: the morning drama every household watches with breakfast.'],
  ['fujitv', 'Sakura Telecast', 'broadcast', 'tokyo', 1959, 1959, 2, 'Trendy dramas and game shows with very elaborate punishments.'],
  ['kbx', 'Hanbit Broadcasting', 'broadcast', 'seoul', 1961, 1961, 2, 'Korean drama: sixteen episodes, one great love, a truck.'],
  ['sbx', 'Namsan TV', 'broadcast', 'seoul', 1991, 1991, 2, 'Korea\'s commercial network, where K-drama became a global export.'],
  ['dooradarshan', 'Bharat Vision', 'public', 'mumbai', 1959, 1959, 2, 'India\'s public broadcaster, whose epics emptied the streets on Sunday mornings.'],
  ['starplus', 'Comet Plus', 'broadcast', 'mumbai', 1992, 1992, 2, 'Daily family serials, saas-bahu sagas, thousands of episodes.'],
  ['globus', 'Rede Estrela', 'broadcast', 'rio', 1965, 1965, 3, 'The telenovela factory of Brazil: the whole country watches at nine.'],
  ['televista', 'Telesol', 'broadcast', 'mexico', 1955, 1955, 3, 'Mexico\'s giant: telenovelas exported to half the planet.'],
  ['tfun', 'Tricolore Un', 'broadcast', 'paris', 1975, 1975, 1, 'France\'s biggest channel: crime dramas set in pretty towns.'],
  ['ardeins', 'Ostwind Eins', 'public', 'berlin', 1954, 1954, 1, 'German public television and its Sunday-night crime show, unbroken since 1970.'],
  ['raiuno', 'Tevere Uno', 'public', 'rome', 1954, 1954, 1, 'Italy\'s public channel: variety, period drama and the song contest.'],
  ['maple', 'Northern Lights Network', 'public', 'toronto', 1952, 1952, 1, 'Canada\'s public broadcaster: hockey, comedy and very polite drama.'],
  ['ausbc', 'Southern Cross Broadcasting', 'public', 'sydney', 1956, 1956, 1, 'Australia\'s public broadcaster: comedy, crime and the odd children\'s cartoon about dogs.']
];
const TV_NETS = {}; for (const [k, name, kind, hub, founded, orig, per, d] of TV_NETS_RAW) TV_NETS[k] = { k, name, kind, hub, founded, orig, per, d };
// What kind of shows each kind of channel makes (weights), and the genres' shapes.
const TV_GENRES = {
  sitcom: { label: 'Sitcom', eps: 22 }, procedural: { label: 'Procedural', eps: 22 }, drama: { label: 'Drama', eps: 18 }, prestige: { label: 'Prestige drama', eps: 10 },
  limited: { label: 'Limited series', eps: 6, one: 1 }, reality: { label: 'Reality', eps: 13, from: 2000 }, animation: { label: 'Animated comedy', eps: 20, from: 1960 }, kids: { label: 'Children\'s', eps: 26 },
  soap: { label: 'Daytime soap', eps: 250 }, variety: { label: 'Variety show', eps: 30, to: 1985 }, talk: { label: 'Talk show', eps: 200 }, doc: { label: 'Docuseries', eps: 6, from: 1990 },
  telenovela: { label: 'Telenovela', eps: 160, one: 1 }, kdrama: { label: 'K-drama', eps: 16, one: 1 }, asadora: { label: 'Morning drama', eps: 150, one: 1 }, serial: { label: 'Daily serial', eps: 260 },
  period: { label: 'Period drama', eps: 8 }, scifi: { label: 'Sci-fi and fantasy', eps: 12 }, crime: { label: 'Crime drama', eps: 8 }
};
const TV_MIX = {
  broadcast: { sitcom: 5, procedural: 5, drama: 4, reality: 2, animation: 1, soap: 1, variety: 2, talk: 1, scifi: 1 },
  cable: { drama: 3, prestige: 3, sitcom: 2, reality: 3, animation: 1, limited: 1, crime: 1 },
  premium: { prestige: 5, sitcom: 2, limited: 3, doc: 1, scifi: 1, crime: 1 },
  streaming: { prestige: 3, drama: 3, sitcom: 2, limited: 3, doc: 2, scifi: 2, reality: 1, animation: 1, crime: 1 },
  public: { period: 3, doc: 3, kids: 2, sitcom: 2, drama: 2, crime: 2 },
  kids: { kids: 5, animation: 3 }
};
const TV_LOCAL = { globus: 'telenovela', televista: 'telenovela', kbx: 'kdrama', sbx: 'kdrama', nkh: 'asadora', starplus: 'serial', dooradarshan: 'serial' };
// ---- titles ----
const TVT = {
  city: ['Harbor City', 'Bay Street', 'Lakeside', 'Northfield', 'Riverside', 'Silver Creek', 'Port Haven', 'Eastgate', 'Westbrook', 'Crescent Falls', 'Pine Ridge', 'Kingsbridge'],
  unit: ['Homicide', 'Medical', 'Fire', 'Vice', 'General', 'Law', 'Trauma', 'Unit 9', 'Rescue', 'Special Victims', 'Precinct', 'Emergency'],
  noun: ['Inheritance', 'Kingdom', 'Reckoning', 'Undertow', 'Tribe', 'Succession', 'Covenant', 'Frontier', 'Compound', 'Estate', 'Cartel', 'Garden', 'Signal', 'Harvest', 'Ministry', 'Dynasty'],
  sit: ['Happy Days Ahead', 'Two and a Half Roommates', 'Everybody Loves Raymondo', 'Family Business', 'The Neighbours Upstairs', 'Night Shift', 'Life of the Party', 'Brothers & Sisters-in-Law', 'Corner Shop', 'Mixed Company', 'Late Bloomers', 'Office Hours', 'Just Married, Again', 'Parental Guidance', 'The Bookshop', 'Out of Office'],
  sfx: ['Signal', 'Orbit', 'Station Nine', 'The Gate', 'Parallel', 'Afterlight', 'Colony', 'Dark Matter', 'The Ninth Sphere', 'Event Horizon Road'],
  kids: ['Puddle Jumpers', 'The Busy Burrow', 'Captain Crumb', 'Moon Mice', 'Robo Pals', 'Doodle Street', 'The Wobbly Bus', 'Little Lighthouse'],
  real: ['Island of Strangers', 'Kitchen Wars', 'Love on Lockdown', 'The Big Renovation', 'Survivor Ridge', 'Real Lives of the Hills', 'Bake Off the Wall', 'Top Talent'],
  doc: ['The Last Season', 'Making a Monster', 'Planet Wild', 'Inside the Cult', 'The Unsolved', 'The Food Chain', 'Wild Coast'],
  tel: ['Amor de Verano', 'La Herencia', 'Corazón Salvaje', 'Avenida Central', 'Rosa de Fuego', 'El Patrón', 'Destino', 'Mulheres do Mar', 'Laços de Família', 'A Favorita'],
  kd: ['Winter Letters', 'Crash Landing on Love', 'My Secret CEO', 'Goblin Guardian', 'The Heirs Apparent', 'Moonlight Palace', 'Reply 1994', 'Hospital Playlist No. 2'],
  ser: ['Kyunki Saas Bhi', 'Ghar Ki Laxmi', 'Do Dil Ek Jaan', 'Pavitra Bandhan', 'Sapno Ki Duniya', 'Rishton Ka Mela'],
  per: ['Pride and Property', 'North and Southwark', 'Middlemarch Lane', 'The Pallisers\' Daughter', 'Bleak House Party', 'Cranford Street']
};
function tvTitle(g, r, N) {
  const pk = L => L[Math.floor(r() * L.length)], surname = pk(N.L);
  switch (g) {
    case 'procedural': return r() < .5 ? `${pk(TVT.city)} ${pk(TVT.unit)}` : `${pk(TVT.unit)}: ${pk(TVT.city)}`;
    case 'sitcom': case 'animation': return r() < .45 ? pk(TVT.sit) : r() < .5 ? `The ${surname}s` : `${pk(N.F.concat(N.M))} & ${pk(N.F.concat(N.M))}`;
    case 'scifi': return pk(TVT.sfx);
    case 'kids': return pk(TVT.kids);
    case 'reality': return pk(TVT.real);
    case 'doc': return pk(TVT.doc);
    case 'telenovela': return pk(TVT.tel);
    case 'kdrama': return pk(TVT.kd);
    case 'serial': case 'soap': return g === 'serial' ? pk(TVT.ser) : `The ${pk(['Bold', 'Restless', 'Young', 'Beautiful', 'Guiding', 'General'])} and the ${pk(['Beautiful', 'Restless', 'Damned', 'Rich', 'Brave'])}`;
    case 'asadora': return `${pk(N.F)}`;
    case 'period': return pk(TVT.per);
    case 'talk': return `Late Night with ${pk(N.F.concat(N.M))} ${surname}`;
    case 'variety': return `The ${pk(N.F.concat(N.M))} ${surname} Hour`;
    default: return r() < .6 ? `The ${pk(TVT.noun)}` : `${surname}`;
  }
}
// ---- the landmark series (parody names), with real dates and channels ----
// [title, net, first year, last year (0 = still running), genre, creator, logline]
const TV_LEGENDS = [
  ['I Love Lucie', 'cbn', 1951, 1957, 'sitcom', 'Jess Oppenheimer-Ross', 'A bandleader\'s wife schemes her way into show business, every week, and is caught every week.'],
  ['The Honeymoaners', 'cbn', 1955, 1956, 'sitcom', 'Jack Gleason', 'A bus driver with big plans and a small flat. To the moon, every episode.'],
  ['The Twilit Zone', 'cbn', 1959, 1964, 'scifi', 'Rod Sterling', 'An anthology of the uncanny, introduced by a man in a suit who knows how it ends.'],
  ['Star Track', 'nbs', 1966, 1969, 'scifi', 'Gene Rodenbury', 'A starship, a five-year mission and a very calm first officer with pointed ears.'],
  ['All in the Familia', 'cbn', 1971, 1979, 'sitcom', 'Norman Leer', 'A bigot in an armchair argues with his whole family, and loses.'],
  ['M*E*S*H', 'cbn', 1972, 1983, 'sitcom', 'Larry Gelbard', 'Army surgeons in a war they can\'t fix, joking because the alternative is worse.'],
  ['Saturday Night Lively', 'nbs', 1975, 0, 'variety', 'Lorne Michaelson', 'Live sketch comedy from New York, the launchpad for half of film comedy.'],
  ['Dalles', 'cbn', 1978, 1991, 'soap', 'David Jacobsen', 'An oil family in Texas, and the question the whole world asked one summer: who shot him?'],
  ['Hill Street Blueses', 'nbs', 1981, 1987, 'procedural', 'Steven Bochko', 'A city precinct, every storyline overlapping, every morning briefing ending "be careful out there".'],
  ['Cheerio', 'nbs', 1982, 1993, 'sitcom', 'the Charles-Burrows trio', 'A Boston bar where everybody knows your name, and nobody leaves.'],
  ['The Golden Gals', 'nbs', 1985, 1992, 'sitcom', 'Susan Harrison', 'Four women in Miami, cheesecake at midnight, no regrets worth mentioning.'],
  ['The Simpletons', 'vix', 1989, 0, 'animation', 'Matt Groaning', 'A yellow family in a town called Springfield-ish, going on four decades.'],
  ['Steinfield', 'nbs', 1989, 1998, 'sitcom', 'Larry Davidson & Jerry Steinfield', 'A show about nothing: four New Yorkers, soup, and the rules of everything.'],
  ['Law & Disorder', 'nbs', 1990, 2010, 'procedural', 'Dick Wolfson', 'The police who investigate crime and the lawyers who prosecute it. Dun dun.'],
  ['Twin Pines', 'abn', 1990, 1991, 'drama', 'David Lunch & Mark Frosty', 'A homecoming queen wrapped in plastic, and a coffee-loving FBI agent in the woods.'],
  ['The Y-Files', 'vix', 1993, 2002, 'scifi', 'Chris Carterson', 'Two agents, one believer, one sceptic, and the truth somewhere out there.'],
  ['Friendz', 'nbs', 1994, 2004, 'sitcom', 'Kauffman & Crane-Bright', 'Six friends in a city where nobody seems to work much, and a fountain.'],
  ['E.R. (Emergency Rooms)', 'nbs', 1994, 2009, 'drama', 'Michael Crichtonson', 'A Chicago emergency room in real time, the camera running down corridors.'],
  ['The Larry Sanders Shown', 'hbx', 1992, 1998, 'sitcom', 'Garry Shandlin', 'Behind the scenes of a talk show, where everything on air is a lie.'],
  ['Sex and the Citi', 'hbx', 1998, 2004, 'sitcom', 'Darren Starr', 'A columnist and her three friends, and the question she types every episode.'],
  ['The Sopranis', 'hbx', 1999, 2007, 'prestige', 'David Chaser', 'A mob boss in therapy, and the series that made television the new cinema.'],
  ['The West Wingspan', 'nbs', 1999, 2006, 'drama', 'Aaron Sorkind', 'The president\'s staff, walking and talking down very long corridors.'],
  ['Curb Your Optimism', 'hbx', 2000, 2024, 'sitcom', 'Larry Davidson', 'A rich man breaks every unwritten social rule and argues about each one.'],
  ['Survivorman Island', 'cbn', 2000, 0, 'reality', 'Mark Burnet-Hall', 'Strangers on an island vote each other off, for money and immortality.'],
  ['The Wiring', 'hbx', 2002, 2008, 'prestige', 'David Simone', 'A city seen through its drug trade, its police, its docks, its schools and its newspaper.'],
  ['American Idle', 'vix', 2002, 2016, 'reality', 'Simon Fuller-Cowl', 'A nation votes for its next pop star, and a judge says what everyone is thinking.'],
  ['Misplaced', 'abn', 2004, 2010, 'scifi', 'J.J. Abramsky & Damon Lindelhof', 'Plane crash survivors on an island with polar bears, a hatch and flashbacks.'],
  ['The Offices', 'nbs', 2005, 2013, 'sitcom', 'Greg Danielson', 'A paper company, a documentary crew, and the worst boss in Pennsylvania.'],
  ['Ad Men', 'amx', 2007, 2015, 'prestige', 'Matthew Wiener', 'An advertising man in the 1960s who sells everyone a dream and lives in none of them.'],
  ['Breaking Mad', 'amx', 2008, 2013, 'prestige', 'Vince Gilligham', 'A chemistry teacher with cancer becomes the drug lord of the south-west.'],
  ['Game of Crowns', 'hbx', 2011, 2019, 'scifi', 'Benioff & Weisz', 'Seven kingdoms, three dragons, and winter coming for eight seasons.'],
  ['Stranger Thingamajigs', 'netflicks', 2016, 2025, 'scifi', 'the Duffy brothers', 'Kids on bikes in the 1980s, a girl with powers, and a world upside down.'],
  ['The Crowne', 'netflicks', 2016, 2023, 'prestige', 'Peter Morganz', 'The reign of a queen, decade by decade, recast every two seasons.'],
  ['Succession Planning', 'hbx', 2018, 2023, 'prestige', 'Jesse Armstrongarm', 'A media dynasty\'s children fight for the throne, each worse than the last.'],
  ['Squid Gamble', 'netflicks', 2021, 2025, 'prestige', 'Hwang Dong-hyuck', 'The desperate compete in children\'s games for a fortune; losing is fatal.'],
  ['The Bearer', 'hula', 2022, 0, 'prestige', 'Christopher Storey', 'A fine-dining chef inherits his brother\'s sandwich shop and his brother\'s debts. Yes, chef.'],
  ['Monty Pythagoras\'s Flying Circus', 'bbx', 1969, 1974, 'variety', 'the Pythagoras team', 'Six men, a lot of dead parrots, and comedy that didn\'t bother with endings.'],
  ['Fawlty Towels', 'bbx', 1975, 1979, 'sitcom', 'John Cleaves & Connie Booth-Hall', 'The worst hotel in Torquay, and its furious owner. Twelve episodes. Perfect.'],
  ['Doctor When', 'bbx', 1963, 0, 'scifi', 'Sydney Newmann', 'A time traveller in a police box, regenerating whenever the actor leaves.'],
  ['Coronation Lane', 'itvee', 1960, 0, 'soap', 'Tony Warrender', 'A cobbled northern street, its pub, and sixty years of the same families.'],
  ['The Office Block', 'bbx', 2001, 2003, 'sitcom', 'Ricky Gervaise & Stephen Merchantman', 'A paper merchant\'s in Slough and its manager, who thinks he\'s a friend first.'],
  ['Sherlocke', 'bbx', 2010, 2017, 'crime', 'Moffitt & Gattiss-Hall', 'The great detective with a smartphone and a blog-writing doctor.'],
  ['Downtown Abbey', 'itvee', 2010, 2015, 'period', 'Julian Fellowes-Wright', 'An earl\'s family upstairs, their servants downstairs, and the twentieth century at the door.'],
  ['Fleabagg', 'bbx', 2016, 2019, 'sitcom', 'Phoebe Waller-Bridges', 'A woman in London talks to the camera about everything except the thing that matters.'],
  ['Oshi', 'nkh', 1983, 1984, 'asadora', 'Sugako Hashimotto', 'A girl sold into service grows into a woman who builds a business, across a whole century.'],
  ['Winter Sonnet', 'kbx', 2002, 2002, 'kdrama', 'Yoon Seok-hoe', 'First love, amnesia and snow; the drama that started the Korean wave abroad.'],
  ['Ramayana Katha', 'dooradarshan', 1987, 1988, 'serial', 'Ramanand Sagar-Rao', 'The epic retold on Sunday mornings; the streets of India emptied to watch.'],
  ['Betty the Plain', 'televista', 1999, 2001, 'telenovela', 'Fernando Gaitán-Ruiz', 'A brilliant, unfashionable secretary saves a fashion house. Remade in twenty countries.'],
  ['Avenida Brasilia', 'globus', 2012, 2012, 'telenovela', 'João Emanuel Carneiro-Lima', 'A girl raised in a rubbish tip returns to take revenge on the woman who put her there.'],
  ['Sesame Lane', 'pbn', 1970, 0, 'kids', 'Joan Ganz Cooney-Hart', 'A city street of puppets and people, teaching the alphabet to the world.']
];
// ---- generation ----
function netBaseViewers(kind, y) {   // average viewers (millions) for a solid show on that kind of channel, that year
  const era = y < 1950 ? 1.5 : y < 1955 ? 7 : y < 1960 ? 14 : y < 1980 ? 17 : y < 1995 ? 15 : y < 2005 ? 12 : y < 2015 ? 7 : 4.5;
  return { broadcast: era, public: era * .4, cable: Math.min(4, era * .35), premium: y < 1997 ? 2 : 5, streaming: 9, kids: 1.5 }[kind] || 2;
}
function tvPools() {
  const A = archive(); if (A.tvPools) return A.tvPools;
  const P0 = {}; for (const p of S.people) { if (!['actor', 'writer', 'director', 'producer'].includes(p.role)) continue; const m = (HUBS[p.hub] || {}).m || 'US'; ((P0[m] = P0[m] || {})[p.role] = P0[m][p.role] || []).push(p.id); }
  return A.tvPools = P0;
}
function tvPickPerson(r, m, role, y) {
  const L = ((tvPools()[m] || tvPools().US || {})[role]) || [];
  for (let k = 0; k < 12 && L.length; k++) { const id = L[Math.floor(r() * L.length)], p = P(id); if (p && !p.player && p.born <= y - 20 && p.born >= y - 75) return id; }
  if (!L.length) return null; const id = L[Math.floor(r() * L.length)]; return P(id) && P(id).player ? null : id;   // you are never cast in the past
}
function genreFor(net, y, r) {
  if (TV_LOCAL[net.k] && r() < .7) return TV_LOCAL[net.k];
  if (net.hub === 'london' && net.kind === 'public' && r() < .3) return 'period';
  const mix = Object.entries(TV_MIX[net.kind] || TV_MIX.broadcast).filter(([g]) => (!TV_GENRES[g].from || y >= TV_GENRES[g].from) && (!TV_GENRES[g].to || y <= TV_GENRES[g].to)), tot = mix.reduce((s, x) => s + x[1], 0);
  let x = r() * tot; for (const [g, w] of mix) { if ((x -= w) <= 0) return g; } return 'drama';
}
// Every show ever made, up to this year: generated once per world, cached.
function tvAll() {
  const A = archive(); if (A.tvAll && A.tvAllY === S.year) return A.tvAll;
  const out = [], byId = {};
  for (const net of Object.values(TV_NETS)) {
    const m = (HUBS[net.hub] || {}).m || 'US', N = NAMES[(HUBS[net.hub] || HUBS.hollywood).lang] || NAMES.en;
    for (let y = Math.max(net.orig, 1946); y <= S.year; y++) {
      const r0 = hashRand(net.k.length * 7919 + y * 131 + net.founded), n = Math.max(1, Math.round(net.per * (y < 1955 ? .5 : 1) * (.7 + r0() * .6)));
      for (let i = 0; i < n; i++) {
        const r = hashRand(y * 104729 + i * 7907 + net.k.charCodeAt(0) * 31 + net.k.length), g = genreFor(net, y, r), G = TV_GENRES[g], q = Math.round(25 + r() * 70), pop = r();
        let seasons = 1; if (!G.one) { const cont = .3 + pop * .45 + (q - 50) / 300; while (seasons < (['soap', 'talk', 'serial'].includes(g) ? 30 : 12) && r() < cont) seasons++; }
        const s = { id: `${net.k}~${y}~${i}`, net: net.k, y, g, title: tvTitle(g, r, N), q, pop, seasons, m, seed: Math.floor(r() * 1e9) };
        s.last = s.y + seasons - 1; out.push(s); byId[s.id] = s;
      }
    }
  }
  for (const [title, net, y0, y1, g, creator, log] of TV_LEGENDS) { if (!TV_NETS[net] || y0 > S.year) continue; const s = { id: 'L~' + title.replace(/[^A-Za-z]/g, '').slice(0, 20), net, y: y0, g, title, q: 92, pop: .95, seasons: (y1 || S.year) - y0 + 1, last: y1 || 9999, m: (HUBS[TV_NETS[net].hub] || {}).m || 'US', seed: title.length * 7919 + y0, legend: 1, creatorName: creator, log }; s.seasons = Math.min(y1 || S.year, S.year) - y0 + 1; out.push(s); byId[s.id] = s; }
  A.tvById = byId; A.tvAllY = S.year;
  return A.tvAll = out;
}
const tvShow = id => { tvAll(); return archive().tvById[id] || (S.me && (S.me.shows || []).find(x => x.id === id)) || null; };
const tvOnAir = (s, y) => s.y <= y && Math.min(s.last, s.seasons ? s.y + s.seasons - 1 : s.last) >= y;
const tvStatus = s => s.last >= 9999 || s.last >= S.year ? (s.y > S.year ? 'announced' : 'on air') : s.seasons <= 2 && !TV_GENRES[s.g].one ? `cancelled after ${s.seasons} season${s.seasons > 1 ? 's' : ''}` : 'ended';
// The people of a show, fixed by its seed.
function tvPeople(s) {
  if (s.mine) return { creator: ME().id, showrunner: ME().id, cast: s.cast || [], dirs: [] };
  if (s.ppl) return s.ppl;
  const r = hashRand(s.seed + 17), m = s.m;
  const creator = s.legend ? null : tvPickPerson(r, m, 'writer', s.y), showrunner = r() < .6 ? creator : tvPickPerson(r, m, r() < .5 ? 'writer' : 'producer', s.y);
  const nc = ['reality', 'doc', 'talk', 'variety'].includes(s.g) ? 1 : 3 + Math.floor(r() * 4), cast = [];
  for (let k = 0; k < nc; k++) { const id = tvPickPerson(r, m, 'actor', s.y); if (id !== null && !cast.includes(id)) cast.push(id); }
  const dirs = []; for (let k = 0; k < 3; k++) { const id = tvPickPerson(r, m, 'director', s.y); if (id !== null && !dirs.includes(id)) dirs.push(id); }
  return s.ppl = { creator, showrunner, cast, dirs };
}
function tvViewers(s, season) {   // average viewers per episode for a season, millions
  if (s.mine) return (s.seas[season - 1] || {}).v || 0;
  const net = TV_NETS[s.net], y = s.y + season - 1, r = hashRand(s.seed + season * 13)();
  const curve = season === 1 ? .9 : season <= 3 ? 1.1 : Math.pow(.92, season - 3) * 1.1;
  return Math.round(netBaseViewers(net.kind, y) * (.35 + s.pop * 1.2) * (s.q / 60) * curve * (.85 + r * .3) * (s.legend ? 1.8 : 1) * 10) / 10;
}
const EP_A = ['Pilot', 'The One Where', 'Homecoming', 'Cold Open', 'The Long Night', 'Exit Strategy', 'Blood Money', 'Second Chances', 'The Reunion', 'Fault Lines', 'Ghosts', 'Christmas Special', 'The Wedding', 'Unfinished Business', 'Lockdown', 'Day One', 'The Trial', 'Endgame', 'Old Habits', 'Small Mercies'];
function episodeTitles(s, season, n) { const r = hashRand(s.seed + season * 97); return Array.from({ length: n }, (_, i) => season === 1 && i === 0 ? 'Pilot' : EP_A[1 + Math.floor(r() * (EP_A.length - 1))] + (r() < .3 ? ` (Part ${1 + Math.floor(r() * 2)})` : '')); }
// ---- the Emmets for television: every September ----
// [category, genres that qualify, who's named (cast = the lead, cast2 = the second lead, creator, dir), what it honours]
const TV_CATS = [
  ['Outstanding Drama Series', ['prestige', 'drama', 'crime', 'scifi', 'period', 'procedural'], null, 'The year\'s best continuing drama, voted by the whole academy.'],
  ['Outstanding Comedy Series', ['sitcom', 'animation'], null, 'The best half-hour (or so) of the year, live audience or not.'],
  ['Outstanding Limited Series', ['limited'], null, 'A story told in one season and finished: the miniseries and the anthology.'],
  ['Lead Performer, Drama', ['prestige', 'drama', 'crime', 'scifi', 'period'], 'cast', 'The lead of a drama series, judged on one submitted episode.'],
  ['Supporting Performer, Drama', ['prestige', 'drama', 'crime', 'scifi', 'period', 'procedural'], 'cast2', 'The scene-stealer of a drama ensemble.'],
  ['Lead Performer, Comedy', ['sitcom'], 'cast', 'The lead of a comedy series: timing, warmth and the face that sells the joke.'],
  ['Supporting Performer, Comedy', ['sitcom'], 'cast2', 'The neighbour, the boss, the best friend who gets the biggest laughs.'],
  ['Lead Performer, Limited Series', ['limited'], 'cast', 'A star turn across a single, finished story.'],
  ['Writing for a Drama Series', ['prestige', 'drama', 'crime', 'scifi'], 'creator', 'One episode\'s script: structure, dialogue and the scene everyone talked about.'],
  ['Writing for a Comedy Series', ['sitcom', 'animation'], 'creator', 'The funniest single script of the year.'],
  ['Directing for a Drama Series', ['prestige', 'drama', 'scifi', 'crime'], 'dir', 'One episode\'s direction: the long take, the set piece, the quiet close-up.'],
  ['Directing for a Comedy Series', ['sitcom'], 'dir', 'Comedy is rhythm, and this is the episode with the best of it.'],
  ['Outstanding Animated Program', ['animation', 'kids'], null, 'Drawn, modelled or stop-motion, for adults or for everyone.'],
  ['Outstanding Documentary Series', ['doc'], null, 'Nonfiction television: true crime, nature, history and the people in it.'],
  ['Outstanding Competition Program', ['reality'], null, 'Bake-offs, talent shows and islands: the best of reality television.'],
  ['Outstanding Talk Series', ['talk', 'variety'], null, 'Late night and daytime: the desk, the band, the guest who said too much.'],
  ['Outstanding Children\'s Program', ['kids'], null, 'Television made for children that adults secretly watch too.']
];
function tvEmmets(y) {
  const A = archive(), key = 'tve:' + y; if (A[key]) return A[key];
  if (y < 1949 || y > S.year || (y === S.year && dateOf(S.week).getUTCMonth() < 8)) return A[key] = [];
  const air = tvAll().filter(s => s.m === 'US' && tvOnAir(s, y)), out = [];
  for (const [cat, gs, who] of TV_CATS) {
    const L = air.filter(s => gs.includes(s.g)).map(s => [s, s.q + (s.legend ? 25 : 0) + hashRand(s.seed + y * 7 + cat.length)() * 30]).sort((a, b) => b[1] - a[1]);
    if (!L.length) continue; const s = L[0][0], P1 = tvPeople(s);
    out.push({ cat, show: s.id, person: who === 'cast' ? P1.cast[0] : who === 'cast2' ? (P1.cast[1] ?? P1.cast[0]) : who === 'creator' ? P1.creator : who === 'dir' ? P1.dirs[0] : null, noms: L.slice(1, 5).map(x => x[0].id) });
  }
  return A[key] = out;
}
// ---- pages ----
const tvLink = s => `<a href="#" class="lk" data-go="tvshow:${s.id}">${esc(s.title)}</a>`;
const netLink = k => `<a href="#" class="lk" data-go="tvnet:${k}">${esc(TV_NETS[k].name)}</a>`;
function viewTvShow(id) {
  const s = tvShow(id); if (!s) return '<p class="muted">Not found.</p>';
  const net = TV_NETS[s.net], G = TV_GENRES[s.g], P1 = tvPeople(s), last = Math.min(s.y + s.seasons - 1, S.year), ns = Math.max(1, last - s.y + 1);
  const seas = Array.from({ length: ns }, (_, k) => ({ n: k + 1, y: s.y + k, eps: s.mine ? (s.seas[k] || {}).eps : Math.round(G.eps * (s.y + k < 1970 && G.eps === 22 ? 1.6 : s.y + k > 2010 && G.eps === 22 ? .8 : 1)), v: tvViewers(s, k + 1) }));
  const mx = Math.max(.1, ...seas.map(x => x.v)), wins = []; for (let y = s.y; y <= last; y++) for (const e of tvEmmets(y)) if (e.show === s.id) wins.push([y, e.cat]);
  return `<div class="head"><p class="eyebrow">${esc(G.label)} · ${netLink(s.net)} · ${s.y}–${tvStatus(s) === 'on air' ? 'present' : last}</p><h2>${esc(s.title)}</h2><p class="lede">${esc(s.log || tvLogline(s))} <span class="muted">${esc(tvStatus(s).charAt(0).toUpperCase() + tvStatus(s).slice(1))}${s.legend ? ' · a landmark of television' : ''}${s.mine ? ' · your show' : ''}.</span></p></div>
   <div class="cols two"><section class="panel"><h3>Seasons</h3><table class="grid small"><thead><tr><th>Season</th><th>Year</th><th>Episodes</th><th>Viewers</th><th></th></tr></thead><tbody>${seas.map(x => `<tr><td>${x.n}</td><td>${x.y}</td><td>${x.eps || '–'}</td><td>${x.v.toFixed(1)}M</td><td><span class="tbar"><i style="width:${Math.round(x.v / mx * 100)}%"></i></span></td></tr>`).join('')}</tbody></table>
    <h4>Season 1</h4><p class="small">${episodeTitles(s, 1, Math.min(8, seas[0].eps || 8)).map((t, i) => `${i + 1}. ${esc(t)}`).join(' · ')}</p></section>
   <section class="panel"><h3>Made by</h3><p>${s.legend ? `Created by ${esc(s.creatorName)}` : `Created by ${P1.creator !== null ? pl(P1.creator) : 'a writer'}`}${P1.showrunner !== null && P1.showrunner !== P1.creator && !s.legend ? `, run by ${pl(P1.showrunner)}` : ''}.</p>
    ${P1.cast.length ? `<h4>Starring</h4><p>${P1.cast.map(pl).join(' · ')}</p>` : ''}${P1.dirs.length ? `<h4>Directors</h4><p class="small">${P1.dirs.map(pl).join(' · ')}</p>` : ''}
    ${wins.length ? `<h4>Emmets</h4><ul class="plain small">${wins.map(([y, c]) => `<li>🏆 ${y}: ${esc(c)}</li>`).join('')}</ul>` : ''}${(S.me && (S.me.tvCred || {})[s.id]) ? `<p class="good small">You worked on this: ${esc(S.me.tvCred[s.id])}.</p>` : ''}</section></div>`;
}
const TV_LOGS = { procedural: 'Every week a new case; every season the team gets a little more broken.', sitcom: 'People who love each other, stuck in the same rooms, being funny about it.', drama: 'A family, a town, a secret, and five seasons of fallout.', prestige: 'A slow-burning character study the critics adored and the audience found eventually.', limited: 'One story, told once, properly.', reality: 'Real people, real cameras, carefully edited reality.', animation: 'A cartoon family that says what live-action sitcoms couldn\'t.', kids: 'Songs, lessons and a puppet with a catchphrase.', soap: 'Weddings, amnesia, evil twins and a very long lunch.', variety: 'Songs, sketches and a host in a tuxedo.', talk: 'A desk, a band and the night\'s most famous guest.', doc: 'A true story in six chapters.', telenovela: 'One great love, one great enemy, and a twist every night for six months.', kdrama: 'Sixteen episodes, a chaebol heir, a hidden past, and a truck.', asadora: 'A woman\'s life across a century, fifteen minutes every morning.', serial: 'A joint family, a scheming relative, and thousands of episodes.', period: 'Bonnets, letters and an inheritance in question.', scifi: 'A crew, a mystery and a universe bigger than the budget.', crime: 'A detective with a past, a town with a secret.' };
function tvLogline(s) { return TV_LOGS[s.g] || 'A show.'; }
function viewTvNet(k) {
  const net = TV_NETS[k]; if (!net) return '<p class="muted">Not found.</p>';
  const L = tvAll().filter(s => s.net === k), now = L.filter(s => tvOnAir(s, S.year)).sort((a, b) => tvViewers(b, S.year - b.y + 1) - tvViewers(a, S.year - a.y + 1));
  const best = L.slice().sort((a, b) => (b.legend ? 200 : 0) + b.q * b.seasons - (a.legend ? 200 : 0) - a.q * a.seasons).slice(0, 15);
  return `<div class="head"><p class="eyebrow">${esc(net.kind)} · ${esc(hubName(net.hub))} · since ${net.founded}</p><h2>${esc(net.name)}</h2><p class="lede">${esc(net.d)} ${L.length.toLocaleString()} shows since ${net.orig}.</p></div>
   <div class="cols two"><section class="panel"><h3>On air now</h3><ul class="plain small">${now.slice(0, 20).map(s => `<li>${tvLink(s)} <span class="muted">${esc(TV_GENRES[s.g].label.toLowerCase())} · season ${S.year - s.y + 1} · ${tvViewers(s, S.year - s.y + 1).toFixed(1)}M</span></li>`).join('') || '<li class="muted">Nothing.</li>'}</ul></section>
   <section class="panel"><h3>The greats</h3><ol class="small">${best.map(s => `<li>${tvLink(s)} <span class="muted">${s.y}–${tvStatus(s) === 'on air' ? 'now' : s.y + s.seasons - 1} · ${s.seasons} season${s.seasons > 1 ? 's' : ''}</span></li>`).join('')}</ol></section></div>`;
}
// ---- the app ----
function tvApp() {
  const M = S.me, tab = UI.tvt || 'now', all = typeof tvAllPlus === 'function' ? tvAllPlus() : tvAll();
  const tabs = [['now', '📺 This week'], ['nets', '📡 Channels'], ['shows', '🔎 Every show'], ['year', '📅 Year by year'], ['emmets', '🏆 The Emmets'], ['mine', '🎬 Your TV']];
  let body = '';
  if (tab === 'now') {
    const mkt = (HUBS[M.hub] || {}).m || 'US', L = all.filter(s => s.m === mkt && tvOnAir(s, S.year)).map(s => [s, tvViewers(s, S.year - s.y + 1) * (.9 + hashRand(s.seed + S.week)() * .2)]).sort((a, b) => b[1] - a[1]).slice(0, 25);
    body = (typeof primetimeHTML === 'function' ? primetimeHTML() : '') + `<h4>The ratings</h4><p class="muted small">The most-watched shows in ${esc(MARKETS[mkt] ? MARKETS[mkt].name : mkt)} this week. Streaming counts views in the first week.</p><table class="grid small"><thead><tr><th>#</th><th>Show</th><th>Channel</th><th>Season</th><th>Viewers</th></tr></thead><tbody>${L.map(([s, v], i) => `<tr${s.mine ? ' class="mine"' : ''}><td>${i + 1}</td><td>${tvLink(s)}</td><td>${netLink(s.net)}</td><td>${S.year - s.y + 1}</td><td>${v.toFixed(1)}M</td></tr>`).join('')}</tbody></table>`;
  } else if (tab === 'nets') {
    body = `<table class="grid small"><thead><tr><th>Channel</th><th>Kind</th><th>Where</th><th>Since</th><th>On air</th></tr></thead><tbody>${Object.values(TV_NETS).filter(n => n.founded <= S.year).map(n => `<tr><td>${netLink(n.k)}</td><td>${esc(n.kind)}</td><td>${esc(hubName(n.hub))}</td><td>${n.founded}</td><td>${all.filter(s => s.net === n.k && tvOnAir(s, S.year)).length}</td></tr>`).join('')}</tbody></table>`;
  } else if (tab === 'shows') {
    const q = (UI.tvq || '').toLowerCase().trim(), g = UI.tvg || '', L = all.filter(s => (!q || s.title.toLowerCase().includes(q)) && (!g || s.g === g)).sort((a, b) => (b.legend ? 1 : 0) - (a.legend ? 1 : 0) || b.y - a.y), pg = UI.tvpg || 0;
    body = `<div class="filt"><label class="filt-q"><span>Search</span><input id="tvq" type="search" placeholder="A show…" value="${esc(UI.tvq || '')}"></label><label><span>Genre</span>${sel('tv-g', [['', 'All genres'], ...Object.entries(TV_GENRES).map(([k, G]) => [k, G.label])], g)}</label></div>
     <p class="muted small">${L.length.toLocaleString()} shows. <button class="btn-s ghost" data-tvpg="${pg - 1}" ${pg ? '' : 'disabled'}>‹</button> page ${pg + 1} <button class="btn-s ghost" data-tvpg="${pg + 1}" ${(pg + 1) * 50 < L.length ? '' : 'disabled'}>›</button></p><table class="grid small"><thead><tr><th>Show</th><th>Channel</th><th>Genre</th><th>Years</th><th>Seasons</th></tr></thead><tbody>${L.slice(pg * 50, pg * 50 + 50).map(s => `<tr><td>${tvLink(s)}${s.legend ? ' <span class="chip t-Award">landmark</span>' : ''}</td><td>${netLink(s.net)}</td><td>${esc(TV_GENRES[s.g].label)}</td><td>${s.y}–${tvStatus(s) === 'on air' ? 'now' : Math.min(s.last, s.y + s.seasons - 1)}</td><td>${s.seasons}</td></tr>`).join('')}</tbody></table>`;
  } else if (tab === 'year') {
    const y = UI.tvy || S.year, ys = []; for (let k = S.year; k >= 1950; k--) ys.push(k);
    const prem = all.filter(s => s.y === y && s.m === 'US').sort((a, b) => b.q - a.q).slice(0, 15), fin = all.filter(s => s.y + s.seasons - 1 === y && s.seasons >= 3 && s.m === 'US' && s.last < 9999).slice(0, 10), top = all.filter(s => s.m === 'US' && tvOnAir(s, y)).map(s => [s, tvViewers(s, y - s.y + 1)]).sort((a, b) => b[1] - a[1]).slice(0, 10);
    body = `<div class="filt"><label><span>Year</span>${sel('tv-y', ys.map(k => [k, String(k)]), y)}</label></div><div class="cols two"><section><h4>Most watched, ${y}</h4><ol class="small">${top.map(([s, v]) => `<li>${tvLink(s)} <span class="muted">${esc(TV_NETS[s.net].name)} · ${v.toFixed(1)}M</span></li>`).join('')}</ol><h4>Final seasons</h4><ul class="plain small">${fin.map(s => `<li>${tvLink(s)} <span class="muted">after ${s.seasons} seasons</span></li>`).join('') || '<li class="muted">None of note.</li>'}</ul></section><section><h4>New shows</h4><ul class="plain small">${prem.map(s => `<li>${tvLink(s)} <span class="muted">${esc(TV_NETS[s.net].name)} · ${esc(TV_GENRES[s.g].label.toLowerCase())}</span></li>`).join('')}</ul>${tvEmmets(y).length ? `<h4>Emmets</h4><ul class="plain small">${tvEmmets(y).map(e => `<li>${esc(e.cat)}: ${tvLink(tvShow(e.show))}${e.person !== null && e.person !== undefined ? ` (${pl(e.person)})` : ''}</li>`).join('')}</ul>` : ''}</section></div>`;
  } else if (tab === 'emmets') { body = typeof emmetsHTML === 'function' ? emmetsHTML() : '';
  } else body = myTvHTML();
  return `<div class="tvapp"><p class="bf-row">${tabs.map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-tvt="${k}">${l}</button>`).join('')}</p>${body}</div>`;
}
// ---- your television: pitching, pilots, seasons ----
const PITCH_BAR = { broadcast: 30, cable: 22, premium: 40, streaming: 28, public: 18, kids: 15 };
function myTvHTML() {
  const M = S.me, me = ME(), shows = M.shows || [], dev = M.tvdev, nets = Object.values(TV_NETS).filter(n => n.orig <= S.year && (HUBS[n.hub] || {}).m === (HUBS[M.hub] || {}).m);
  const cred = Object.entries(M.tvCred || {});
  return `<h4>Your shows</h4>${shows.length ? `<ul class="plain">${shows.map(s => `<li>${tvLink(s)} <span class="muted">${esc(TV_NETS[s.net].name)} · ${s.seas.length} season${s.seas.length > 1 ? 's' : ''} · ${s.status}${s.seas.length ? ` · last season ${s.seas[s.seas.length - 1].v.toFixed(1)}M` : ''}</span></li>`).join('')}</ul>` : '<p class="muted small">None yet.</p>'}
   ${typeof tvPitchHTML === 'function' ? tvPitchHTML() : ''}
   ${cred.length ? `<h4>Your television credits</h4><ul class="plain small">${cred.map(([id, r]) => { const s = tvShow(id); return s ? `<li>${tvLink(s)} <span class="muted">${esc(r)}</span></li>` : ''; }).join('')}</ul>` : ''}`;
}
function tvAct(a) {
  const M = S.me, me = ME();
  if (a.k === 'pitch' && typeof tvPitchAct === 'function') return tvPitchAct(a);
  if (a.k === 'pitch') {
    const net = TV_NETS[a.net], g = TV_GENRES[a.g] ? a.g : 'drama'; if (!net || net.orig > S.year || M.tvdev) return false;
    M.tvPitch = M.tvPitch || {}; if (S.week - (M.tvPitch[net.k] ?? -999) < 26) return false;
    if (me.standing < (PITCH_BAR[net.kind] || 25)) return false;
    M.tvPitch[net.k] = S.week;
    const title = String(a.title || '').replace(/\s+/g, ' ').trim().slice(0, 50) || tvTitle(g, hashRand(M.id * 31 + S.week), NAMES.en);
    const script = (M.scripts || []).some(s => s.grade && 'AB'.includes(String(s.grade)[0]));
    const ok = roll('pack', 13 + ({ premium: 3, streaming: 2, broadcast: 1 }[net.kind] || 0) - (script ? 2 : 0));
    if (ok) { M.tvdev = { net: net.k, g, title, w: S.week, due: S.week + 12 }; inbox('note', `${net.name} buys your pitch`, `${title}: a pilot script and then, if it works, a pilot. The executives say they love it. They say that a lot; this time there's a cheque.`, { roll: M.lastRoll }); M.cash += usd(15000); milestone(`Sold a television pitch to ${net.name}`, 'work'); }
    else inbox('note', `${net.name} passes`, `"Not for us right now." They liked you, though, and they'll take another meeting in six months.`, { roll: M.lastRoll });
    return true;
  }
  return false;
}
function tvWeek() {
  const M = S.me, me = ME(), month = dateOf(S.week).getUTCMonth(), firstWeek = dateOf(S.week).getUTCDate() <= 7;
  // credits for TV jobs
  for (const j of M.jobs) if (j.show) (M.tvCred = M.tvCred || {})[j.show] = j.t.split(',')[0];
  // a pilot is due
  if (typeof tvDevWeek === 'function') tvDevWeek();
  const dev = M.tvdev; if (dev && (!dev.stage || dev.stage === 'pilot') && S.week >= dev.due) {
    M.tvdev = null; const net = TV_NETS[dev.net];
    const sk = ['struc', 'dial', 'char', 'vstory'].reduce((t, s) => t + skillOf(me, s), 0) / 4, q = clamp(Math.round(sk * 3.4 + 22 + me.standing / 5 + (dev.ep !== undefined ? 6 : 0) + (dev.notes || 0) + pgauss() * 10), 10, 97);
    if (prnd() < clamp((q - 45) / 40, .1, .85)) {
      const s = { id: 'me~' + ((M.shows || []).length + 1), mine: 1, net: net.k, g: dev.g, title: dev.title, y: S.year, seasons: 1, last: 9999, m: (HUBS[net.hub] || {}).m || 'US', seed: M.id * 977 + S.week, q, pop: .5, seas: [], status: 'on air', cast: [] };
      const r = hashRand(s.seed); for (let k = 0; k < 4; k++) { const id = tvPickPerson(r, s.m, 'actor', S.year); if (id !== null) s.cast.push(id); }
      tvNewSeason(s); (M.shows = M.shows || []).push(s);
      milestone(`Created a television series: ${s.title} (${net.name})`, 'credit'); me.standing = clamp(me.standing + 4, 0, 100); news('Industry', `${net.name} orders ${s.title}, a new series from ${me.name}.`, { person: me.id });
      inbox('note', `${s.title} is going to series`, `The pilot tested well enough. ${net.name} orders a season of ${s.seas[0].eps} episodes, and you're the showrunner: a writers' room, a budget, and no sleep until spring.`);
    } else inbox('note', `${net.name} passes on the pilot`, `The pilot of ${dev.title} is fine. "Fine" doesn't get on air. It goes on your reel and into a drawer.`);
  }
  // renewals each May; a new season starts with a new showrunner job
  if (month === 4 && firstWeek) for (const s of (M.shows || []).filter(x => x.status === 'on air' && x.y < S.year && !x.seas.some(z => z.y === S.year))) {
    const last = s.seas[s.seas.length - 1], bar = netBaseViewers(TV_NETS[s.net].kind, S.year) * .7;
    if (last.v >= bar * (.8 + prnd() * .4)) { tvNewSeason(s); inbox('note', `${s.title} is renewed`, `Season ${s.seas.length}. The network wants more of the same, but better, and cheaper.`); me.standing = clamp(me.standing + 1.5, 0, 100); }
    else { s.status = `cancelled after ${s.seas.length} season${s.seas.length > 1 ? 's' : ''}`; s.last = S.year - 1; news('Industry', `${TV_NETS[s.net].name} cancels ${s.title}.`, { person: me.id }); inbox('note', `${s.title} is cancelled`, `${last.v.toFixed(1)} million viewers wasn't enough. The cast finds out from the trades; you find out from your agent, ten minutes earlier.`); }
  }
  // the Emmets: your show in the running every September
  if (month === 8 && firstWeek) for (const s of (M.shows || []).filter(x => x.seas.some(z => z.y === S.year))) {
    const z = s.seas.find(x => x.y === S.year); if (z.q < 75 || z.emmet) continue; z.emmet = 1;
    if (prnd() < (z.q - 70) / 40) { const win = prnd() < .3, cat = ['sitcom', 'animation'].includes(s.g) ? 'Outstanding Comedy Series' : s.g === 'limited' ? 'Outstanding Limited Series' : 'Outstanding Drama Series';
      milestone(`${win ? 'Won' : 'Nominated'} at The Emmets: ${cat}, for ${s.title}`, 'prize'); me.standing = clamp(me.standing + (win ? 6 : 3), 0, 100); me.fame = clamp((me.fame || 0) + (win ? 5 : 2), 0, 100);
      if (win) { me.awards.push(`The Emmets ${cat} ${S.year}`); news('Award', `${s.title} wins ${cat} at the Emmets.`, { person: me.id }); } inbox('note', win ? `${s.title} wins the Emmet` : `${s.title} is nominated`, win ? 'You carry a winged statuette back to the writers\' room and put it on the coffee machine.' : 'Nominated. The party afterwards is better than the ceremony.'); }
  }
  if (typeof tvNewsWeek === 'function') tvNewsWeek();
}
function tvNewSeason(s) {
  const M = S.me, me = ME(), net = TV_NETS[s.net], G = TV_GENRES[s.g], prev = s.seas[s.seas.length - 1];
  const sk = ['struc', 'dial', 'char'].reduce((t, k) => t + skillOf(me, k), 0) / 3, q = clamp(Math.round((prev ? prev.q * .5 : s.q * .5) + sk * 1.8 + 10 + pgauss() * 8), 10, 98);
  const eps = net.kind === 'broadcast' ? (S.year > 2010 ? 13 : 22) : G.eps > 13 ? 10 : G.eps;
  const v = Math.round(netBaseViewers(net.kind, S.year) * Math.pow(q / 60, 2) * (.6 + prnd() * .8) * (prev ? Math.min(1.2, prev.v / Math.max(.1, netBaseViewers(net.kind, S.year))) * .5 + .5 : 1) * 10) / 10;
  s.seas.push({ y: S.year, q, eps, v }); s.seasons = s.seas.length;
  const t = ODD_BY.tv_showrunner; if (t && !M.jobs.some(j => j.show === s.id)) { const p = makePost(t, null); Object.assign(p, { t: `Showrunner, ${s.title} (${net.name})`, show: s.id, mco: net.name, weeks: 30 }); takeJob(p); }
}
// ---- TV jobs on the board ----
ODD_JOBS.push(
  { k: 'tv_writerspa', jid: 'tv_writers_pa', t: 'Writers\' PA', tier: 1, subs: ['struc', 'eth'], days: 5, rate: 170, weeks: 16, fam: 'wri', tv: 1, d: 'Lunch orders, script copies, and a seat at the back of the writers\' room. Listen to everything.' },
  { k: 'tv_staffwriter', jid: 'tv_staff_writer', t: 'Staff writer', tier: 2, subs: ['struc', 'dial', 'char'], days: 5, rate: 900, weeks: 20, fam: 'wri', tv: 1, d: 'The bottom rung of the room: pitch, break story, maybe write one episode.' },
  { k: 'tv_storyed', jid: 'tv_story_editor', t: 'Story editor', tier: 3, subs: ['struc', 'dial', 'char'], days: 5, rate: 1500, weeks: 24, fam: 'wri', tv: 1, d: 'Break stories, rewrite other people\'s drafts, run the room when the showrunner\'s on set.' },
  { k: 'tv_coep', jid: 'tv_co_ep', t: 'Co-executive producer (writer)', tier: 4, subs: ['struc', 'pack', 'dial'], days: 5, rate: 3200, weeks: 26, fam: 'wri', tv: 1, d: 'The showrunner\'s number two: run the room, fix scripts, cast guest roles, sit in on the edit.' },
  { k: 'tv_showrunner', jid: 'tv_showrunner', t: 'Showrunner', tier: 5, subs: ['struc', 'pack', 'dact'], days: 5, rate: 6000, weeks: 30, fam: 'wri', tv: 1, d: 'Head writer and chief executive of the show. Every decision, every day.' },
  { k: 'tv_epdir', jid: 'tv_episode_director', t: 'Episode director', tier: 3, subs: ['vstory', 'dact', 'pace'], days: 5, rate: 3000, weeks: 3, fam: 'dir', tv: 1, d: 'Prep, shoot and cut one episode in the show\'s style, in eight days.' },
  { k: 'tv_guest', jid: 'tv_guest_star', t: 'Guest star', tier: 2, subs: ['range', 'pres'], days: 3, rate: 1100, weeks: 1, fam: 'act', tv: 1, actor: 1, d: 'One episode: the suspect, the patient, the old flame. Make them remember you.' },
  { k: 'tv_recurring', jid: 'tv_recurring', t: 'Recurring role', tier: 2, subs: ['range', 'pres', 'comic'], days: 3, rate: 1800, weeks: 8, fam: 'act', tv: 1, actor: 1, d: 'A character who comes back. If the audience likes you, they keep coming back.' },
  { k: 'tv_regular', jid: 'tv_series_regular', t: 'Series regular', tier: 3, subs: ['range', 'pres', 'voice'], days: 4, rate: 4500, weeks: 22, fam: 'act', tv: 1, actor: 1, d: 'Your face in the opening titles, every week, for as long as the show lasts.' },
  { k: 'tv_pa', jid: 'tv_set_pa', t: 'Set PA (television)', tier: 1, subs: ['setm', 'eth'], days: 5, rate: 190, weeks: 12, fam: 'set', tv: 1, d: 'Lock up the set, wrangle extras, run the walkie. Television never stops shooting.' },
  { k: 'tv_camop', jid: 'tv_camera_operator', t: 'Camera operator (multi-camera)', tier: 2, subs: ['comp', 'move', 'speed'], days: 4, rate: 650, weeks: 20, fam: 'cam', tv: 1, d: 'Four cameras, a live audience, one chance at every joke.' },
  { k: 'tv_editor', jid: 'tv_editor', t: 'Television editor', tier: 3, subs: ['rhythm', 'shape', 'cont'], days: 5, rate: 900, weeks: 20, fam: 'edt', tv: 1, d: 'An episode a fortnight, to time, to the act breaks.' },
  { k: 'tv_ad', jid: 'tv_first_ad', t: 'First AD (television)', tier: 3, subs: ['setm', 'stag'], days: 5, rate: 1000, weeks: 20, fam: 'ad', tv: 1, d: 'Eight pages a day, every day, for a season.' }
);
for (const t of ODD_JOBS.filter(x => x.tv)) ODD_BY[t.k] = t;
function tvPosts() {
  const M = S.me, L = tierLevel(), mkt = (HUBS[M.hub] || {}).m || 'US', air = tvAll().filter(s => s.m === mkt && tvOnAir(s, S.year) && !s.mine), out = [];
  if (!air.length || prnd() > .7) return out;
  const T = ODD_JOBS.filter(t => t.tv && t.k !== 'tv_showrunner' && t.tier <= L + 1 && t.tier >= L - 2 && !M.jobs.some(j => j.k === t.k));
  for (let i = 0, n = 1 + Math.floor(L / 2); i < n && T.length; i++) {
    const s = air[Math.floor(prnd() * air.length)], t = T[Math.floor(prnd() * T.length)], p = makePost(t, null), P1 = tvPeople(s);
    Object.assign(p, { t: `${t.t}, ${s.title} (${TV_NETS[s.net].name})`, show: s.id, mco: TV_NETS[s.net].name, head: t.fam === 'wri' || t.fam === 'dir' ? P1.showrunner : null });
    out.push(p);
  }
  return out;
}
// ---- clicks and change ----
function tvClick(t) {
  const d = t.dataset;
  if (d.tvt) { UI.tvt = d.tvt; render(true); return true; }
  if (d.tvpg !== undefined) { UI.tvpg = +d.tvpg; render(true); return true; }
  if (d.tvpitch) { const n0 = S.me.rollN || 0; doAct({ t: 'tv', k: 'pitch', net: UI.tvpn || ($('#tvp-net') || {}).value, g: UI.tvpg2 || ($('#tvp-g') || {}).value || 'drama', title: ($('#tvp-title') || {}).value || '', route: UI.tvpr || ($('#tvp-route') || {}).value }); render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll); return true; }
  return false;
}
function tvChange(e) {
  const id = e.target.id, v = e.target.value;
  if (id === 'tv-g') { UI.tvg = v; UI.tvpg = 0; render(true); return true; }
  if (id === 'tv-y') { UI.tvy = +v; render(true); return true; }
  if (id === 'tvp-net') { UI.tvpn = v; render(true); return true; }
  if (id === 'tvp-route') { UI.tvpr = v; return true; }
  if (id === 'tvp-title') { UI.tvpt = v; return true; }
  if (id === 'em-y') { UI.emy = +v; render(true); return true; }
  if (id === 'tvp-g') { UI.tvpg2 = v; return true; }
  return false;
}
OS_EXTRA.tv = ['📺', 'The Tele-Guide', 'Every channel, every show, ratings, the Emmets and your TV career'];
OS_VIEWS.tv = () => tvApp();
for (const g of OS_GROUPS) if (g[0] === 'Industry') g[1].splice(3, 0, 'tv');
// ---- a person's television, for their page ----
function tvCreditsOf(pid) {
  const A = archive(); if (!A.tvByP) { const m = {}; for (const s of tvAll()) { const P1 = tvPeople(s); for (const [id, r] of [[P1.creator, 'creator'], [P1.showrunner, 'showrunner'], ...P1.cast.map(c => [c, 'cast']), ...P1.dirs.map(c => [c, 'director'])]) if (id !== null && id !== undefined) (m[id] = m[id] || []).push([s.id, r]); } A.tvByP = m; }
  return A.tvByP[pid] || [];
}
// ---- goals ----
amb('x_tvjob', 'craft', 'Work in television', () => [Object.keys(S.me.tvCred || {}).length, 1], 2);
amb('x_tvsold', 'craft', 'Sell a television pitch', () => [(S.me.milestones || []).some(m => /^Sold a television pitch/.test(m.t)) ? 1 : 0, 1], 4);
amb('x_tvshow', 'power', 'Create a television series', () => [(S.me.shows || []).length, 1], 7);
amb('x_tv5', 'power', 'Run a show for five seasons', () => [Math.max(0, ...(S.me.shows || []).map(s => s.seas.length)), 5], 9);
