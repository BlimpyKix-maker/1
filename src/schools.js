// ---------------- Schools of the world ----------------
// The great film, music, drama, animation, games, journalism and business schools, under this world's names, in the
// cities they're really in, with what they teach, how hard they are to get into and what a year costs. Apply with a
// roll (your work and skills help), win a scholarship if you blow them away, move cities to study, graduate into an
// alumni network that opens doors. Every city also has its own arts college and university for the rest of us.
// [id, name, hub, kinds, prestige 1–3, founded, entry DC, fee multiplier, what it's known for]
const SCHOOLS = [
  ['sca', 'Southern Cal School of Cinematic Arts', 'hollywood', ['film', 'animation', 'games', 'business'], 1, 1929, 16, 1.4, 'The oldest film school in America, built on studio money; its producing programme is a pipeline into the studios.'],
  ['westwood', 'Westwood School of Theater, Film & Television', 'hollywood', ['film', 'drama'], 1, 1947, 16, 1.1, 'A public university\'s film school with a famous directing MFA and a thesis-film showcase studios attend.'],
  ['afc', 'American Film Conservatory', 'hollywood', ['film'], 1, 1969, 17, 1.5, 'A two-year conservatory where fellows make films in teams by discipline: directing, cinematography, editing, producing, design.'],
  ['calarts', 'California Arts Institute', 'hollywood', ['animation', 'film', 'music'], 1, 1961, 16, 1.4, 'Founded with Disney money; its character-animation alumni run half the animation studios.'],
  ['dodge', 'Orange Grove Film School', 'hollywood', ['film'], 2, 1996, 13, 1.3, 'Big soundstages, a business-minded curriculum, and students who start shooting in week one.'],
  ['hmi', 'Hollywood Musicians Institute', 'hollywood', ['music'], 3, 1977, 10, 1, 'Practical guitar, bass, drums, vocals and production for players who want to work, not theorise.'],
  ['stark', 'Stark Producing Programme', 'hollywood', ['business'], 1, 1979, 17, 1.4, 'A small two-year course for future producers and executives: development, finance, distribution.'],
  ['tischman', 'Tischman School of the Arts', 'newyork', ['film', 'drama', 'music', 'games'], 1, 1965, 16, 1.5, 'Downtown, scrappy, star-studded: generations of independent directors started here shooting on the streets.'],
  ['morningside', 'Morningside School of the Arts', 'newyork', ['film', 'drama'], 1, 1965, 16, 1.5, 'A writing-first film programme where screenwriters and directors share every class.'],
  ['juilliard', 'The Juilliard-Hale School', 'newyork', ['music', 'drama'], 1, 1905, 18, 1.4, 'The most selective conservatory in America for music, dance and acting. Almost nobody gets in.'],
  ['eli', 'Eli School of Drama', 'newyork', ['drama'], 1, 1925, 17, .4, 'A tuition-free graduate drama school for actors, designers, directors and playwrights.'],
  ['addler', 'Stella Addler Studio of Acting', 'newyork', ['drama'], 2, 1949, 12, .9, 'Imagination over memory: actors build characters from the script and the world, not their own past.'],
  ['strasbourg', 'Strasbourg Theatre & Film Institute', 'newyork', ['drama'], 2, 1969, 11, 1, 'Home of the Method: sense memory, emotional recall, and actors who disappear into roles.'],
  ['berkley', 'Berkley College of Music', 'newyork', ['music'], 1, 1945, 14, 1.3, 'Contemporary music at scale: songwriting, production, film scoring, music business.'],
  ['curtishall', 'Curtis-Hall Institute of Music', 'newyork', ['music'], 1, 1924, 18, 0, 'Tiny and tuition-free: it takes only enough players to fill one orchestra.'],
  ['medill', 'Lakeshore School of Journalism', 'newyork', ['journalism'], 1, 1921, 15, 1.2, 'Reporting, audio and investigative journalism; a quiet engine of the podcast boom.'],
  ['morningsidej', 'Morningside School of Journalism', 'newyork', ['journalism'], 1, 1912, 16, 1.3, 'Founded by a newspaper baron; its prizes are the profession\'s highest.'],
  ['crimson', 'Crimson Business School', 'newyork', ['business'], 1, 1908, 17, 1.6, 'Case studies, power networks, and a surprising number of studio chiefs.'],
  ['wharton', 'Wharton-Penn School of Business', 'newyork', ['business'], 1, 1881, 17, 1.6, 'Finance first; its media club places graduates in every bank that funds films.'],
  ['sternsq', 'Washington Square School of Business', 'newyork', ['business'], 1, 1900, 15, 1.5, 'Media and entertainment business taught by people who still work in it.'],
  ['sheridan', 'Sheridan Animation College', 'toronto', ['animation'], 1, 1967, 15, .8, 'Canada\'s animation powerhouse: Pixar and Disney hire straight from the graduation show.'],
  ['tsc', 'Toronto Screen College', 'toronto', ['film', 'drama'], 2, 1960, 12, .8, 'Practical film and TV training in the city that doubles for every other city.'],
  ['ccc', 'Centro de Capacitación Cinematográfica', 'mexico', ['film'], 1, 1975, 15, .3, 'A state film school whose graduates won the world\'s biggest prizes three years running.'],
  ['nftc', 'National Film & Television College', 'london', ['film', 'animation', 'games'], 1, 1971, 16, 1.1, 'Britain\'s national film school, in an old studio outside town; every department taught by working professionals.'],
  ['lfa', 'London Film Academy', 'london', ['film'], 2, 1956, 13, 1.2, 'The oldest film school in Britain, in Covent Garden: students shoot on film in every term.'],
  ['radal', 'Royal Academy of Dramatic Arts & Letters', 'london', ['drama'], 1, 1904, 17, 1, 'The great British drama school; its graduates fill the West End and every period drama.'],
  ['lamda', 'London Academy of Music & Dramatic Art', 'london', ['drama'], 1, 1861, 16, 1, 'Classical training with a screen-acting edge.'],
  ['central', 'Central School of Speech & Stage', 'london', ['drama'], 2, 1906, 14, .9, 'Acting, puppetry, stage management and design under one roof.'],
  ['rasong', 'Royal Academy of Song', 'london', ['music'], 1, 1822, 17, 1, 'Britain\'s oldest conservatory; its composition department feeds film scoring.'],
  ['bimm', 'British Institute of Modern Music', 'london', ['music'], 3, 2001, 9, 1, 'Pop, rock, production and music business for working musicians.'],
  ['lipa', 'Liverpool Institute for Performing Arts', 'london', ['music', 'drama'], 2, 1996, 13, 1, 'Co-founded by a Beatle: performance, music and technical theatre in one school.'],
  ['lbs', 'London School of Business', 'london', ['business'], 1, 1964, 16, 1.4, 'Global finance, global media: its alumni sit on half the boards in the city.'],
  ['femina', 'La Fémina', 'paris', ['film'], 1, 1943, 18, .2, 'France\'s state film school: a few dozen places a year, nearly free, ferociously selective.'],
  ['gobelin', 'Gobelin School of the Image', 'paris', ['animation', 'games'], 1, 1963, 16, .5, 'The world\'s most admired animation school; its graduation shorts go viral every summer.'],
  ['consparis', 'Conservatoire de Paris-Lumière', 'paris', ['music', 'drama'], 1, 1795, 18, .2, 'Two centuries of composers, conductors and actors.'],
  ['insead', 'INSEAD-Fontainebleau Institute', 'paris', ['business'], 1, 1957, 16, 1.5, 'A one-year international business degree in a forest outside Paris.'],
  ['csc', 'Centro Sperimentale di Cinematografia Romana', 'rome', ['film'], 1, 1935, 15, .3, 'Italy\'s national film school, next to the great studios, through fascism, neorealism and beyond.'],
  ['bocconi', 'Bocconi-Milano University', 'rome', ['business'], 1, 1902, 15, 1, 'Italy\'s business school, with a media and entertainment track.'],
  ['dffb', 'Berlin Film & Television Academy', 'berlin', ['film'], 1, 1966, 15, .2, 'Political, experimental, nearly free, and the alma mater of a generation of German auteurs.'],
  ['hff', 'Munich University of Television & Film', 'berlin', ['film'], 1, 1966, 15, .2, 'German film school with a famous cinematography department.'],
  ['udk', 'Berlin University of the Arts', 'berlin', ['music', 'drama'], 1, 1696, 16, .2, 'One of the largest art universities in Europe: music, theatre, design.'],
  ['ecam', 'Madrid School of Cinema & Audiovisual', 'madrid', ['film'], 2, 1994, 13, .9, 'Spain\'s leading private film school, close to the industry.'],
  ['hkapa', 'Hong Kong Academy for Performing Arts', 'hongkong', ['film', 'drama', 'music'], 2, 1984, 14, .7, 'Film, drama, dance and music on the harbour.'],
  ['tnua', 'Taipei National University of the Arts', 'taipei', ['film', 'drama'], 2, 1982, 14, .3, 'Taiwan\'s arts university, home of its new wave and its new new wave.'],
  ['nichigei', 'Nichigei College of Art', 'tokyo', ['film', 'animation', 'drama'], 2, 1921, 13, .8, 'Japan\'s oldest film department; directors, anime artists and photographers.'],
  ['geidai', 'Tokyo University of the Arts', 'tokyo', ['music', 'film', 'animation'], 1, 1887, 17, .4, 'Japan\'s national arts university: the hardest conservatory in the country to enter.'],
  ['todai', 'Todai Graduate School of Business', 'tokyo', ['business'], 1, 1877, 16, .4, 'The elite university, and a path into the boardrooms of the great studios.'],
  ['kafa', 'Korean Film Arts Academy', 'seoul', ['film'], 1, 1984, 16, .3, 'A small state academy whose graduates built the Korean wave in cinema.'],
  ['karts', 'Korea National University of the Arts', 'seoul', ['music', 'drama', 'film'], 1, 1993, 16, .3, 'Conservatory training in every art, with a famous film school.'],
  ['bca', 'Beijing Cinema Academy', 'beijing', ['film', 'animation', 'drama'], 1, 1950, 17, .3, 'China\'s great film school: its 1982 class became the Fifth Generation.'],
  ['ccom', 'Central Conservatory of Music, Beijing', 'beijing', ['music'], 1, 1950, 17, .3, 'China\'s top conservatory.'],
  ['tsinghua', 'Tsinghua School of Economics & Management', 'beijing', ['business'], 1, 1984, 16, .5, 'China\'s elite business school.'],
  ['ftip', 'Film Institute of Pune', 'mumbai', ['film', 'drama'], 1, 1960, 16, .2, 'India\'s national film school, in the old Prabhat studios.'],
  ['nsd', 'National Drama School, Delhi', 'mumbai', ['drama'], 1, 1959, 16, .1, 'India\'s national theatre school: its actors became the backbone of serious Hindi cinema.'],
  ['whistling', 'Whistling Pines International', 'mumbai', ['film', 'drama', 'music'], 2, 2006, 12, 1, 'A film school founded by a showman director inside his own studio.'],
  ['iim', 'Indian Institute of Management', 'mumbai', ['business'], 1, 1961, 17, .4, 'India\'s most competitive business schools; the media houses recruit here.'],
  ['srfti', 'Ray Film & Television Institute', 'kolkata', ['film'], 1, 1995, 15, .2, 'Named for the city\'s master, it teaches cinema as a humane art.'],
  ['aass', 'Australian Screen School', 'sydney', ['film', 'animation'], 1, 1973, 15, .8, 'Australia\'s national film, TV and radio school.'],
  ['nidaa', 'National Institute of Dramatic Arts', 'sydney', ['drama'], 1, 1958, 17, .8, 'Australia\'s drama school; half of Hollywood\'s Australians trained here.'],
  ['toihoukura', 'Wellington Screen & Arts School', 'wellington', ['film', 'animation'], 2, 1990, 12, .6, 'In the shadow of the city\'s effects workshops.'],
  ['nfi', 'Nollywood Film Institute', 'lagos', ['film'], 3, 2003, 10, .3, 'Fast, practical training for the world\'s most prolific film industry.'],
  ['hic', 'Higher Institute of Cinema, Cairo', 'cairo', ['film'], 2, 1959, 14, .1, 'The Arab world\'s oldest film school.'],
  ['eca', 'São Paulo School of Communications & Arts', 'rio', ['film', 'journalism'], 1, 1966, 15, .2, 'Brazil\'s leading film and media school.'],
  ['enerc', 'Buenos Aires National Film School', 'buenosaires', ['film'], 2, 1965, 13, .1, 'Argentina\'s state film school, near free and fiercely political.'],
  ['vgik', 'All-Union Cinema Institute', 'moscow', ['film', 'drama', 'animation'], 1, 1919, 16, .1, 'The world\'s first film school, founded two years after the revolution.'],
  ['stockdram', 'Stockholm University of the Arts', 'stockholm', ['film', 'drama'], 1, 1964, 16, .1, 'Sweden\'s state film and drama school, free and tiny.'],
  ['dfs', 'National Film School of Denmark', 'copenhagen', ['film', 'animation'], 1, 1966, 17, .1, 'A small, free, legendary school; its graduates wrote the rules of a movement.'],
  ['famo', 'FAMO Prague Film Academy', 'prague', ['film', 'animation'], 1, 1946, 16, .2, 'Central Europe\'s great film school, home of the Czech New Wave.'],
  ['lodz', 'Łódź National Film Academy', 'warsaw', ['film', 'drama'], 1, 1948, 16, .2, 'The "Hollywoodzia": its directors and cinematographers made Polish cinema world-famous.'],
  ['szfe', 'Budapest University of Theatre & Film', 'budapest', ['film', 'drama'], 1, 1865, 15, .2, 'Hungary\'s drama and film university.'],
  ['aalto', 'Helsinki School of Arts & Design', 'helsinki', ['film', 'games'], 1, 1871, 15, .1, 'Film, design and a games programme in the country that built a games industry.'],
  ['msgsu', 'Istanbul Fine Arts University', 'istanbul', ['film'], 2, 1882, 13, .1, 'Turkey\'s oldest art school, now with a film department.'],
  ['digipen', 'DigiPen Game Institute', 'hollywood', ['games'], 2, 1988, 13, 1.2, 'Game programming and design, with studios recruiting before graduation.'],
  ['vfs', 'Vancouver Screen School', 'toronto', ['film', 'games', 'animation'], 2, 1987, 11, 1.1, 'One-year intensive programmes that feed the city\'s effects houses and game studios.']
];
const SCHOOL_BY = {}; for (const s of SCHOOLS) SCHOOL_BY[s[0]] = s;
for (const h of HUB_IDS) { const n = HUBS[h].name.split(' and ')[0]; if (!SCHOOLS.some(s => s[0] === 'arts_' + h)) { const a = ['arts_' + h, `${n} College of Art & Media`, h, ['film', 'music', 'drama', 'animation', 'journalism'], 3, 1950, 9, .5, 'The local arts college: evening classes, a decent kit room, teachers who still work.'], u = ['uni_' + h, `${n} State University`, h, ['business', 'journalism'], 3, 1900, 10, .6, 'A big public university with a business school and a journalism department.']; SCHOOLS.push(a, u); SCHOOL_BY[a[0]] = a; SCHOOL_BY[u[0]] = u; } }
// programmes by kind: label, weeks, days a week, base fee a week (2027 USD), growth, degree, crafts on offer
const SCHOOL_PROGS = {
  film: { label: 'MFA in Film', weeks: 90, days: 4, fee: 520, grow: .05, deg: 'mfa', crafts: ['dir', 'wri', 'cam', 'edt', 'pro', 'des'], mates: 2 },
  filmba: { label: 'BFA in Film & Television', weeks: 120, days: 4, fee: 380, grow: .04, deg: 'ba', crafts: ['dir', 'wri', 'cam', 'edt', 'fx', 'des'], mates: 1, kind: 'film' },
  music: { label: 'Bachelor of Music', weeks: 120, days: 4, fee: 400, grow: .045, deg: 'bmus', crafts: ['mus'], mates: 1 },
  musicma: { label: 'Master of Music (Composition & Scoring)', weeks: 80, days: 4, fee: 480, grow: .055, deg: 'mmus', crafts: ['mus'], mates: 2, kind: 'music' },
  drama: { label: 'Conservatory Acting Diploma', weeks: 120, days: 5, fee: 420, grow: .05, deg: 'bfa_act', crafts: ['act'], mates: 2 },
  animation: { label: 'BA in Character Animation', weeks: 120, days: 4, fee: 420, grow: .045, deg: 'ba_anim', crafts: ['fx', 'des'], mates: 1 },
  games: { label: 'BS in Game Design', weeks: 120, days: 4, fee: 420, grow: .04, deg: 'ba_games', crafts: ['des', 'fx', 'wri'], mates: 1 },
  journalism: { label: 'MA in Journalism & Audio', weeks: 40, days: 4, fee: 500, grow: .05, deg: 'ma_journ', crafts: ['wri'], mates: 1 },
  business: { label: 'MBA (Media & Entertainment)', weeks: 80, days: 4, fee: 760, grow: .045, deg: 'mba', crafts: ['pro'], mates: 2 }
};
const DEG_LABEL = { mfa: 'an MFA', ba: 'a degree', bmus: 'a music degree', mmus: 'a master\'s in music', bfa_act: 'a conservatory acting diploma', ba_anim: 'an animation degree', ba_games: 'a games degree', ma_journ: 'a journalism master\'s', mba: 'an MBA', cert: 'a certificate', union: 'union training' };
function progsAt(s) { const out = []; for (const k of s[3]) { out.push(k); if (k === 'film' && s[4] >= 2) out.push('filmba'); if (k === 'music' && s[4] === 1) out.push('musicma'); } return out; }
function schoolProg(sc) {
  if (PROGRAMS[sc.prog]) return PROGRAMS[sc.prog];
  const P0 = SCHOOL_PROGS[sc.prog], s = SCHOOL_BY[sc.at]; if (!P0 || !s) return PROGRAMS.short;
  return Object.assign({}, P0, { label: `${P0.label}, ${s[1]}`, fee: Math.round(P0.fee * s[7] * (sc.schol ? .4 : 1)), grow: P0.grow * [1, 1.25, 1.1, 1][s[4]] });
}
function schoolDC(s, craft) { const M = S.me, me = ME(); const portfolio = me.credits.length * .5 + (M.works || []).length * .3 + (M.scripts || []).filter(x => x.grade).length * .7; const sk = craft && CRAFTS[craft] ? avg(Object.keys(CRAFTS[craft].subs).map(k => me.sk[k])) : 10; return Math.round(clamp(s[6] - portfolio - (sk - 10) * .4 - (M.alma || []).length, 4, 19)); }
function applySchool(a) {
  const M = S.me, s = SCHOOL_BY[a.school], P0 = SCHOOL_PROGS[a.prog];
  if (!s || !P0 || M.school || !progsAt(s).includes(a.prog) || !P0.crafts.includes(a.craft) || s[5] > S.year) return false;
  if (M.schoolApp && M.schoolApp[s[0]] !== undefined && S.week - M.schoolApp[s[0]] < 26) return false;
  const fee = usd(s[4] === 1 ? 120 : 60); if (M.cash < fee) return false;
  M.cash -= fee; (M.schoolApp = M.schoolApp || {})[s[0]] = S.week;
  const dc = schoolDC(s, a.craft), ok = roll(['drama', 'music'].includes(P0.kind || a.prog) ? 'cha' : 'vis', dc), lr = M.lastRoll, schol = ok && lr && (lr.d + lr.mod >= dc + 6 || lr.crit > 0);
  if (!ok) { inbox('note', `${s[1]}: not this year`, `${pickLine(['The letter is short and kind.', 'Thousands applied for a few dozen places.', 'They encourage you to apply again.'], s[0].length + S.week)} You can apply again in six months.`, { roll: lr }); return true; }
  if (s[2] !== M.hub && typeof relocate === 'function') relocate(s[2], 'school');
  M.school = { prog: a.prog, craft: a.craft, done: 0, missed: 0, start: S.week, at: s[0], schol: schol ? 1 : 0 };
  milestone(`Accepted to ${s[1]}${schol ? ' on a scholarship' : ''}`, 'school');
  inbox('news', `You're in: ${s[1]}`, `${P0.label}, ${CRAFTS[a.craft].label.toLowerCase()} track. ${schol ? 'And they\'re paying most of it: a scholarship. ' : ''}Plan ${P0.days} study days a week; four missed weeks and you're out.`, { roll: lr });
  return true;
}
// alumni: a famous school opens doors, and classmates become your network
function almaFactors(post) { const M = S.me, A = (M.alma || []).map(id => SCHOOL_BY[id]).filter(Boolean); if (!A.length) return []; const best = A.sort((a, b) => a[4] - b[4])[0]; return best[4] <= 2 ? [[`Alumni of ${best[1]}`, best[4] === 1 ? .35 : .15]] : []; }
function schoolGraduate(sc) { const M = S.me; if (sc.at) { (M.alma = M.alma || []).push(sc.at); const P0 = SCHOOL_PROGS[sc.prog]; if (P0 && P0.deg && !M.degrees.includes(P0.deg)) M.degrees.push(P0.deg); } }
// ---- browsing ----
function schoolsHTML() {
  const M = S.me, F = UI.sch = UI.sch || { kind: 'all', where: 'all', sort: 'prestige' };
  const kinds = { all: 'All', film: 'Film', music: 'Music', drama: 'Drama', animation: 'Animation', games: 'Games', journalism: 'Journalism & audio', business: 'Business & producing' };
  let L = SCHOOLS.filter(s => s[5] <= S.year && (F.kind === 'all' || s[3].includes(F.kind)) && (F.where === 'all' || (F.where === 'here' ? s[2] === M.hub : HUBS[s[2]].m === F.where)));
  L = L.sort((a, b) => F.sort === 'prestige' ? a[4] - b[4] || a[6] - b[6] : F.sort === 'cheap' ? a[7] - b[7] : F.sort === 'easy' ? a[6] - b[6] : a[1].localeCompare(b[1]));
  const markets = [...new Set(SCHOOLS.map(s => HUBS[s[2]].m))];
  const open = SCHOOL_BY[UI.schOpen];
  return `<div class="bfilter"><div class="bf-row">${Object.entries(kinds).map(([k, l]) => `<button class="pill${F.kind === k ? ' on' : ''}" data-schk="${k}">${l}</button>`).join('')}</div>
   <div class="bf-row"><label class="small">Where <select id="sch-where"><option value="all">Anywhere</option><option value="here"${F.where === 'here' ? ' selected' : ''}>In ${esc(hubName(M.hub))}</option>${markets.map(m => `<option value="${m}"${F.where === m ? ' selected' : ''}>${esc(MARKETS[m] ? MARKETS[m].name : m)}</option>`).join('')}</select></label>
   <label class="small">Sort <select id="sch-sort">${[['prestige', 'Most prestigious'], ['easy', 'Easiest to get into'], ['cheap', 'Cheapest'], ['name', 'Name']].map(([k, l]) => `<option value="${k}"${F.sort === k ? ' selected' : ''}>${l}</option>`).join('')}</select></label> <span class="muted small">${L.length} schools</span></div></div>
   <div class="tw"><table class="grid small"><thead><tr><th>School</th><th>City</th><th>Teaches</th><th>Prestige</th><th class="n">Entry DC</th><th class="n">A year</th></tr></thead><tbody>${L.slice(0, 60).map(s => `<tr><td><a href="#" class="lk" data-schopen="${s[0]}">${esc(s[1])}</a></td><td>${esc(hubName(s[2]))}</td><td>${s[3].map(k => kinds[k].split(' ')[0]).join(', ')}</td><td data-v="${4 - s[4]}">${'★'.repeat(4 - s[4])}</td><td class="n" data-v="${s[6]}">${schoolDC(s)}</td><td class="n" data-v="${s[7]}">${s[7] === 0 ? 'free' : fmtCash(usd(Math.round(SCHOOL_PROGS[s[3][0]].fee * s[7] * 40)))}</td></tr>`).join('')}</tbody></table></div>
   ${open ? schoolPage(open) : ''}`;
}
function schoolPage(s) {
  const M = S.me, wait = M.schoolApp && M.schoolApp[s[0]] !== undefined && S.week - M.schoolApp[s[0]] < 26, alumni = (M.alma || []).includes(s[0]);
  return `<section class="panel jobd"><h3>${esc(s[1])} <button class="linkish" data-schopen="">Close</button></h3><p class="eyebrow">${esc(hubName(s[2]))} · founded ${s[5]} · ${'★'.repeat(4 - s[4])}${alumni ? ' · your alma mater' : ''}</p><p>${esc(s[8])}</p>
   ${progsAt(s).map(k => { const P0 = SCHOOL_PROGS[k], fee = Math.round(P0.fee * s[7]); return `<div class="course"><b>${esc(P0.label)}</b> <span class="muted small">${Math.round(P0.weeks / 40 * 10) / 10} years · ${P0.days} days a week · ${fee ? fmtCash(usd(fee)) + '/wk' : 'no tuition'} · leads to ${esc(DEG_LABEL[P0.deg] || 'a degree')}</span><p class="small">${P0.crafts.map(c => `<button class="btn-s ghost" data-schapply="${s[0]}:${k}:${c}" ${M.school || wait ? 'disabled' : ''}>Apply: ${esc(CRAFTS[c].label)} (DC ${schoolDC(s, c)})</button>`).join(' ')}</p></div>`; }).join('')}
   <p class="muted small">Applying costs ${fmtCash(usd(s[4] === 1 ? 120 : 60))} and rolls ${['drama', 'music'].some(k => s[3].includes(k)) ? 'Charisma for auditions or Vision for portfolios' : 'Vision for your portfolio'}. Credits, finished work and skill in the craft lower the bar. Beat it by six and you get a scholarship. ${s[2] !== M.hub ? 'Getting in means moving to ' + esc(hubName(s[2])) + '.' : ''}${wait ? ' You applied recently: wait six months.' : ''}</p></section>`;
}
function schoolClick(t) {
  const d = t.dataset, F = UI.sch = UI.sch || { kind: 'all', where: 'all', sort: 'prestige' };
  if (d.schk) { F.kind = d.schk; render(true); return true; }
  if (d.schopen !== undefined) { UI.schOpen = d.schopen || null; render(true); return true; }
  if (d.schapply) { const [school, prog, craft] = d.schapply.split(':'), n0 = S.me.rollN || 0; doAct({ t: 'school', school, prog, craft }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  return false;
}
function schoolChange(id, v) { const F = UI.sch = UI.sch || { kind: 'all', where: 'all', sort: 'prestige' }; if (id === 'sch-where') { F.where = v; return true; } if (id === 'sch-sort') { F.sort = v; return true; } return false; }
