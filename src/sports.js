// ---------------- Sports: the other show in town ----------------
// Every market has its leagues, in their real seasons: gridiron in the autumn, basketball through the winter,
// baseball all summer, football (the round-ball kind) from August to May, cricket in the spring, hockey on ice and
// rugby in the southern winter. Teams rise and fall over the years, every week has its fixtures, results and table,
// and every season ends in playoffs and a champion. It's all a pure function of the world's seed (no dice), so the
// same season plays the same way however you look at it.
// You can follow a team (their wins and losses get to you a little), go to a game (a night out, with people from the
// business in the stands, more of them in a box), bet on the weekend's games at a bookmaker's honest-ish prices,
// and work in it: stadium announcer, halftime act, anthem singer, sports camera crew, team video producer. And the
// fields meet: a song of yours can be licensed into a film or a TV show, and a big enough act gets the call for the
// championship halftime show.

const SPORT_KINDS = {
  gridiron: { label: 'American football', icon: '🏈', months: [8, 9, 10, 11, 0], score: [10, 38], draw: 0, nicks: ['Mariners', 'Ironmen', 'Stallions', 'Thunder', 'Rangers', 'Bulldogs', 'Pioneers', 'Knights', 'Hawks', 'Express', 'Grizzlies', 'Comets'] },
  hoops: { label: 'Basketball', icon: '🏀', months: [9, 10, 11, 0, 1, 2, 3, 4], score: [88, 124], draw: 0, nicks: ['Jets', 'Suns', 'Rockets', 'Flyers', 'Kings', 'Blaze', 'Waves', 'Storm', 'Comets', 'Owls', 'Foxes', 'Lynx'] },
  diamond: { label: 'Baseball', icon: '⚾', months: [3, 4, 5, 6, 7, 8], score: [0, 9], draw: 0, nicks: ['Sox', 'Pilots', 'Senators', 'Orioles', 'Mariners', 'Giants', 'Robins', 'Barons', 'Swallows', 'Tigers', 'Herons', 'Dukes'] },
  football: { label: 'Football', icon: '⚽', months: [7, 8, 9, 10, 11, 0, 1, 2, 3, 4], score: [0, 4], draw: .27, nicks: ['United', 'City', 'Rovers', 'Athletic', 'Wanderers', 'Albion', 'Town', 'Celtic', 'Sporting', 'Racing', 'Dynamo', 'Olympic'] },
  cricket: { label: 'Cricket (T20)', icon: '🏏', months: [2, 3, 4], score: [130, 215], draw: 0, nicks: ['Royals', 'Super Kings', 'Knights', 'Chargers', 'Titans', 'Warriors', 'Strikers', 'Sixers', 'Heat', 'Lions'] },
  hockey: { label: 'Ice hockey', icon: '🏒', months: [9, 10, 11, 0, 1, 2, 3, 4], score: [0, 6], draw: 0, nicks: ['Maple Blades', 'Bears', 'Wolves', 'Canucks', 'Flames', 'Senators', 'Jets', 'Oilers', 'Lumberjacks', 'Moose'] },
  rugby: { label: 'Rugby', icon: '🏉', months: [1, 2, 3, 4, 5, 6], score: [6, 40], draw: .03, nicks: ['Crusaders', 'Highlanders', 'Chiefs', 'Hurricanes', 'Blues', 'Sharks', 'Bulls', 'Stormers', 'Lions', 'Reds'] }
};
// [key, name, sport, markets, founded, teams]
const LEAGUES = [
  ['ngl', 'The National Gridiron League', 'gridiron', ['US'], 1920, 12], ['nha', 'The National Hoops Association', 'hoops', ['US', 'CA'], 1946, 12],
  ['grandlg', 'The Grand League of Baseball', 'diamond', ['US', 'CA'], 1903, 12], ['ufl', 'United Football League', 'football', ['US', 'CA'], 1996, 10],
  ['premier', 'The Premier Division', 'football', ['UK'], 1888, 12], ['ligue', 'Ligue Une', 'football', ['FR'], 1932, 12], ['serie', 'Serie Prima', 'football', ['IT'], 1929, 12],
  ['bundes', 'The Bundesliga', 'football', ['DE'], 1963, 12], ['laliga', 'La Primera', 'football', ['ES'], 1929, 12], ['brasil', 'Campeonato Nacional', 'football', ['BR'], 1971, 12],
  ['argent', 'Primera División', 'football', ['AR'], 1891, 12], ['ligamx', 'Liga Nacional', 'football', ['MX'], 1943, 12], ['jleague', 'J-League', 'football', ['JP'], 1993, 10],
  ['npb', 'The Pro Baseball League', 'diamond', ['JP', 'KR', 'TW'], 1950, 12], ['kleague', 'K-League', 'football', ['KR'], 1983, 10], ['csl', 'Super League', 'football', ['CN', 'HK'], 1994, 10],
  ['ipl', 'The Premier Cricket League', 'cricket', ['IN'], 2008, 10], ['ranji', 'The National Cricket Trophy', 'cricket', ['IN'], 1934, 10], ['bigbash', 'The Big Bash', 'cricket', ['AU'], 2011, 8],
  ['aleague', 'The A-League', 'football', ['AU', 'NZ'], 2005, 10], ['superrugby', 'Super Rugby', 'rugby', ['NZ', 'AU', 'ZA'], 1996, 10], ['nhl', 'The National Hockey League', 'hockey', ['CA', 'US'], 1917, 12],
  ['npfl', 'The Professional Football League', 'football', ['NG', 'SN'], 1972, 10], ['egypt', 'The Premier League of Egypt', 'football', ['EG', 'TR', 'IR'], 1948, 10],
  ['natl', 'The National League', 'football', ['SU', 'SE', 'DK', 'CS', 'PL', 'HU', 'FI', 'TH', 'VN', 'CO', 'ID', 'ZA', 'PH'], 1930, 10]
];
const LEAGUE = {}; for (const [k, name, sport, mk, founded, n] of LEAGUES) LEAGUE[k] = { k, name, sport, mk, founded, n };
const TEAM_CITIES = ['Harbour City', 'Riverside', 'Northgate', 'Eastfield', 'Port Royal', 'Highland', 'Lakeview', 'Bayside', 'Ironbridge', 'Westmoor', 'Granite Falls', 'Southport', 'Kingsbury', 'Fairhaven', 'Millbrook', 'Ashford', 'Stonebridge', 'Oakhurst'];
function leaguesHere(hub) { const m = (HUBS[hub || S.me.hub] || {}).m; return Object.values(LEAGUE).filter(L => L.mk.includes(m) && L.founded <= S.year); }
function leagueTeams(L) {
  const A = archive(), key = 'lt:' + L.k; if (A[key]) return A[key];
  const r = hashRand(L.k.length * 977 + L.founded * 13 + (S.seed || 1) % 997), K = SPORT_KINDS[L.sport], hub = Object.keys(HUBS).find(h => L.mk.includes(HUBS[h].m)), places = ((HUBS[hub] || {}).places || []).concat(TEAM_CITIES);
  const used = new Set(), nicks = K.nicks.slice(), out = [];
  for (let i = 0; i < L.n; i++) { let c; do { c = places[Math.floor(r() * places.length)]; } while (used.has(c) && used.size < places.length); used.add(c); const nk = nicks.splice(Math.floor(r() * nicks.length), 1)[0] || K.nicks[i % K.nicks.length]; out.push({ i, name: `${c.replace(/^the /, '')} ${nk}`, base: r() }); }
  return A[key] = out;
}
function teamStrength(L, t, season) { const r = hashRand(L.k.length * 31 + t.i * 7919 + season * 131 + (S.seed || 1) % 991); return t.base * .55 + r() * .45 + (hashRand(t.i * 17 + Math.floor(season / 5) * 3 + L.k.length)() - .5) * .2; }
// the season a week belongs to, and where it is: regular weeks, then semis and a final
function seasonOf(L, w = S.week) {
  const K = SPORT_KINDS[L.sport], inS = x => K.months.includes(dateOf(x).getUTCMonth());
  if (!inS(w)) return null;
  let w0 = w; while (w0 > w - 60 && inS(w0 - 1)) w0--;
  let total = 0; while (total < 60 && inS(w0 + total)) total++;
  const idx = w - w0, reg = Math.max(2, total - 2);
  return { season: dateOf(w0).getUTCFullYear(), idx, w0, total, reg, phase: idx < reg ? 'regular' : idx === reg ? 'semis' : 'final' };
}
// one week's games: a round robin of pairings; results from strength and a hash
function weekGames(L, w = S.week) {
  const A = archive(), key = 'lg:' + L.k + ':' + w; if (A[key]) return A[key];
  const sn = seasonOf(L, w); if (!sn || L.founded > yearOf(w)) return A[key] = [];
  const T = leagueTeams(L), K = SPORT_KINDS[L.sport], out = [];
  let pairs = [];
  if (sn.phase === 'regular') { const n = T.length, ids = T.map(t => t.i), rot = sn.idx % (n - 1), fixed = ids[0], rest = ids.slice(1); const rr = rest.slice(rot).concat(rest.slice(0, rot)), arr = [fixed, ...rr]; for (let i = 0; i < n / 2; i++) pairs.push(sn.idx % 2 ? [arr[i], arr[n - 1 - i]] : [arr[n - 1 - i], arr[i]]); }
  else { const tab = leagueTable(L, sn.w0 + sn.reg - 1); if (sn.phase === 'semis') pairs = [[tab[0].i, tab[3].i], [tab[1].i, tab[2].i]]; else { const semi = weekGames(L, w - 1); pairs = [[semi[0].win, semi[1].win]]; } }
  for (const [h, a] of pairs) {
    const r = hashRand(L.k.length * 1009 + w * 7 + h * 131 + a * 17 + (S.seed || 1) % 983), sh = teamStrength(L, T[h], sn.season) + .06, sa = teamStrength(L, T[a], sn.season);
    const pH = 1 / (1 + Math.exp(-(sh - sa) * 6)), x = r(), draw = sn.phase === 'regular' ? K.draw * (1 - Math.abs(pH - .5)) : 0;
    const res = x < draw ? 'D' : x < draw + (1 - draw) * pH ? 'H' : 'A';
    const [lo, hi] = K.score, sc = () => Math.round(lo + (hi - lo) * Math.pow(r(), 1.3));
    let hs = sc(), as = sc(); if (res === 'D') as = hs; else if (res === 'H' && hs <= as) [hs, as] = [as + (hi > 20 ? Math.ceil(r() * 7) : 1), hs]; else if (res === 'A' && as <= hs) [as, hs] = [hs + (hi > 20 ? Math.ceil(r() * 7) : 1), as];
    if (res === 'H' && hs === as) hs++; if (res === 'A' && hs === as) as++;
    out.push({ h, a, hs, as, res, pH, draw, win: res === 'H' ? h : res === 'A' ? a : null, phase: sn.phase });
  }
  return A[key] = out;
}
function leagueTable(L, uptoW = S.week) {
  const A = archive(), sn = seasonOf(L, uptoW); if (!sn) return [];
  const key = 'tb:' + L.k + ':' + uptoW; if (A[key]) return A[key];
  const T = leagueTeams(L), row = T.map(t => ({ i: t.i, name: t.name, p: 0, w: 0, d: 0, l: 0, f: 0, a: 0, pts: 0 }));
  for (let w = sn.w0; w <= Math.min(uptoW, sn.w0 + sn.reg - 1); w++) for (const g of weekGames(L, w)) { const H = row[g.h], Aw = row[g.a]; H.p++; Aw.p++; H.f += g.hs; H.a += g.as; Aw.f += g.as; Aw.a += g.hs; if (g.res === 'H') { H.w++; Aw.l++; } else if (g.res === 'A') { Aw.w++; H.l++; } else { H.d++; Aw.d++; } }
  const K = SPORT_KINDS[L.sport]; for (const x of row) x.pts = K.draw ? x.w * 3 + x.d : x.w * 2;
  return A[key] = row.sort((a, b) => b.pts - a.pts || (b.f - b.a) - (a.f - a.a) || a.i - b.i);
}
function championOf(L, season) { for (let w = S.week; w > S.week - 80; w--) { const sn = seasonOf(L, w); if (sn && sn.season === season && sn.phase === 'final' && w <= S.week) { const g = weekGames(L, w)[0]; return g ? leagueTeams(L)[g.win] : null; } } return null; }
// a bookmaker's price: fair odds with about 5% for the house
function gameOdds(g, L) { const K = SPORT_KINDS[L.sport], pD = g.draw, pH = (1 - pD) * g.pH, pA = (1 - pD) * (1 - g.pH), m = 1.05, o = p => p > 0 ? Math.max(1.05, Math.round(1 / (p * m) * 20) / 20) : null; return { H: o(pH), D: K.draw ? o(pD) : null, A: o(pA) }; }

// ---- you and sport ----
function sportOf(M = S.me) { return M.sp || (M.sp = { fan: null, bets: [], seen: 0 }); }
function sportAct(a) {
  const M = S.me, SP = sportOf();
  if (a.k === 'follow') { const L = LEAGUE[a.lk]; if (!L) return false; SP.fan = a.t === null || a.t === undefined || a.t === '' ? null : { lk: a.lk, t: +a.t }; return true; }
  if (a.k === 'bet') {
    const L = LEAGUE[a.lk], w = +a.w, G = L && weekGames(L, w)[+a.g], amt = clamp(Math.round(+a.amt || 0), 1, luckStake(500)); if (!G || w < S.week || M.cash < amt || !['H', 'D', 'A'].includes(a.pick)) return false;
    if (SP.bets.some(b => b.lk === a.lk && b.w === w && b.g === +a.g && !b.done)) return false;
    const odds = gameOdds(G, L)[a.pick]; if (!odds) return false;
    M.cash -= amt; const Lk = luckOf(); Lk.spent += amt; SP.bets.push({ lk: a.lk, w, g: +a.g, pick: a.pick, amt, odds }); if (SP.bets.length > 40) SP.bets.shift();
    return true;
  }
  return false;
}
function sportsWeek() {
  const M = S.me; if (!M.party || !M.party.done) return; const SP = sportOf(), me = ME();
  // settle bets on games that have been played
  for (const b of SP.bets.filter(b => !b.done && b.w < S.week)) {
    b.done = 1; const L = LEAGUE[b.lk], G = L && weekGames(L, b.w)[b.g]; if (!G) continue;
    const won = G.res === b.pick, pay = won ? Math.round(b.amt * b.odds) : 0, T = leagueTeams(L);
    b.res = won ? 'won' : 'lost'; b.pay = pay; M.cash += pay; const Lk = luckOf(); Lk.won += pay;
    Lk.hist.push({ w: S.week, g: 'Sportsbook', bet: b.amt, win: pay, t: `${T[G.h].name} ${G.hs}–${G.as} ${T[G.a].name}` }); if (Lk.hist.length > 60) Lk.hist.shift();
  }
  // your team gets to you
  if (SP.fan) {
    const L = LEAGUE[SP.fan.lk], T = L ? leagueTeams(L) : [], t = T[SP.fan.t]; if (!t) return;
    const G = weekGames(L, S.week - 1).find(g => g.h === t.i || g.a === t.i);
    if (G) { const won = G.win === t.i, lost = G.win !== null && !won; M.stress = clamp(M.stress + (won ? -1.5 : lost ? 1.5 : 0), 0, 100);
      if (G.phase === 'final') { if (won) { milestone(`${t.name} won the ${L.name}`, 'life'); inbox('invite2', `${t.name} are champions!`, `The whole city is in the streets. There's a parade tomorrow.`, { choices: [{ k: 'parade', label: 'Go to the parade' }, { k: 'home', label: 'Watch it on TV' }] }); }
        else inbox('note', `${t.name} lose the final`, `${G.hs}–${G.as}. You don't talk about it.`); M.stress = clamp(M.stress + (won ? -8 : 5), 0, 100); }
    }
  }
}
function sportPick(it, k) {
  if (it.kind !== 'invite2') return false; it.done = true; const M = S.me;
  if (k === 'parade') { M.stress = clamp(M.stress - 6, 0, 100); M.energy = clamp(M.energy - 8, 0, 100); const q = bestIn(M.hub, ROLES, q => q.standing * .3 + prnd() * 40); if (q) meet(q.id, 'At the parade', 8); it.result = { t: `Confetti, strangers hugging, a bus with the trophy on top. You end up dancing with ${q ? q.name : 'a stranger'}, who it turns out works in film.` }; }
  else it.result = { t: 'You watch from the sofa and cheer anyway.' };
  return true;
}
// a night at the game
VENUES.game = { label: 'A game at the stadium', icon: '🏟️', e: 8, stress: -5, cost: 40, d: 'The crowd, the noise, a hot dog. Half the business has season tickets.', meet: .45 };
{ const _ve = venueEvening;
  venueEvening = function (E) {
    if (E.venue !== 'game') return _ve(E);
    const M = S.me, me = ME(), out = [], Ls = leaguesHere().filter(L => weekGames(L).length);
    if (!Ls.length) { out.push('It\'s the off-season. You watch a minor-league game with three hundred other people and love it.'); M.stress = clamp(M.stress - 2, 0, 100); return out; }
    const fan = sportOf().fan, L = fan && Ls.find(x => x.k === fan.lk) || Ls[0], T = leagueTeams(L), G = weekGames(L), g = fan && L.k === fan.lk ? G.find(x => x.h === fan.t || x.a === fan.t) || G[0] : G[0];
    out.push(`${T[g.h].name} against ${T[g.a].name}: ${g.hs}–${g.as}. ${g.res === 'D' ? 'A draw, and everyone goes home arguing.' : `${T[g.win].name} win${g.phase === 'final' ? ' the championship' : ''}.`}`);
    const box = typeof ventPerk === 'function' && ventPerk('sports'), meetP = box ? .85 : .45;
    if (prnd() < meetP) { const q = bestIn(M.hub, ['producer', 'actor', 'director'], q => (box ? q.standing : -Math.abs(q.standing - me.standing)) + prnd() * 30 - (M.known[q.id] ? 20 : 0)); if (q) { meet(q.id, box ? 'In your box at the game' : 'Sat together at the game', box ? 8 : 5); out.push(box ? `${q.name} spends the third quarter in your box, talking about everything but work, which is how work happens.` : `You end up sharing nachos with ${q.name}, ${(q.occ || occupationOf(q)).toLowerCase()}.`); } }
    return out;
  };
}
{ const _wo = typeof whatsOnMore === 'function' ? whatsOnMore : null;
  whatsOnMore = function () { const L0 = _wo ? _wo() : []; const L = leaguesHere().find(x => weekGames(x).length); if (!L) return L0; const T = leagueTeams(L), g = weekGames(L)[0]; return L0.concat([{ venue: 'game', title: `${SPORT_KINDS[L.sport].icon} ${T[g.h].name} v ${T[g.a].name}`, d: `${L.name}${g.phase !== 'regular' ? `, the ${g.phase === 'final' ? 'final' : 'semi-finals'}` : ''}.` }]); };
}

// ---- working in sport ----
const SPORT_JOBS = [
  { k: 'sp_announce', jid: 'sp_announcer', t: 'Stadium announcer', tier: 1, subs: ['voice', 'pres'], days: 2, rate: 260, weeks: 12, d: 'Every goal, every substitution, every lost child at gate four.', who: ['actor', 'composer', 'sound'] },
  { k: 'sp_anthem', jid: 'sp_anthem', t: 'Anthem singer (one game)', tier: 1, subs: ['voice', 'song'], days: 1, rate: 500, weeks: 1, d: 'Ninety seconds, sixty thousand people, no second take.', who: ['actor', 'composer'] },
  { k: 'sp_cam', jid: 'sp_broadcast_cam', t: 'Sports broadcast camera operator', tier: 2, subs: ['comp', 'move', 'speed'], days: 2, rate: 520, weeks: 16, d: 'Follow a ball moving at a hundred miles an hour, live.', who: ['dp'] },
  { k: 'sp_video', jid: 'sp_team_video', t: 'Team video producer', tier: 1, subs: ['rhythm', 'comp'], days: 4, rate: 240, weeks: 14, d: 'Hype reels, player features, the post-match dressing room.', who: ['editor', 'director', 'producer'] },
  { k: 'sp_docedit', jid: 'sp_doc_editor', t: 'Sports documentary editor', tier: 2, subs: ['shape', 'rhythm'], days: 5, rate: 600, weeks: 10, d: 'A season in eight episodes. Find the story in two thousand hours.', who: ['editor'] },
  { k: 'sp_spot', jid: 'sp_commercial', t: 'Sports commercial (with an athlete)', tier: 2, subs: ['pres', 'comic'], days: 1, rate: 1800, weeks: 1, d: 'Act opposite a star who has never acted. Make them look good.', who: ['actor'] },
  { k: 'sp_halftime', jid: 'sp_halftime_band', t: 'Halftime entertainment', tier: 1, subs: ['song', 'pres'], days: 1, rate: 400, weeks: 6, d: 'Twelve minutes between halves, while everyone queues for beer.', who: ['composer', 'actor'] },
  { k: 'sp_writer', jid: 'sp_sports_writer', t: 'Sports writer (local paper)', tier: 1, subs: ['dial', 'struc'], days: 3, rate: 180, weeks: 16, d: 'Match reports by midnight; a column on Sundays.', who: ['writer'] }
];
for (const t of SPORT_JOBS) { t.fam = t.who.includes('actor') ? 'act' : 'set'; t.sport = 1; ODD_BY[t.k] = t; }
{ const _db = depthBoard;
  depthBoard = function (films) {
    const out = _db(films), M = S.me, me = ME(); if (!leaguesHere().length || prnd() > .45) return out;
    const L = tierLevel(), J = SPORT_JOBS.filter(t => t.who.includes(me.role) && t.tier <= L + 1 && t.tier >= L - 2 && !M.jobs.some(j => j.k === t.k));
    if (J.length) out.push(makePost(J[Math.floor(prnd() * J.length)], null));
    return out;
  };
}

// ---- where the fields meet: your songs in films and shows; the halftime show ----
function syncWeek() {
  const M = S.me, me = ME(); if (!M.works || S.week % 4 !== 1) return;
  for (const w of M.works.filter(x => x.type === 'song' && x.q >= 40 && !x.syncW)) {
    const p = .02 + (w.q - 40) / 1500 + Math.log10((w.units || 0) + 10) / 150 + (M.agent ? .01 : 0);
    if (prnd() > p) continue;
    const films = S.films.filter(f => f.rel === null && f.stage >= 2 && f.stage <= 3 && f.hub === M.hub), shows = typeof tvAll === 'function' ? tvAll().filter(s => tvOnAir(s, S.year) && s.m === (HUBS[M.hub] || {}).m) : [];
    const useTv = shows.length && (prnd() < .5 || !films.length), f = !useTv && films.length ? films[Math.floor(prnd() * films.length)] : null, s = useTv ? shows[Math.floor(prnd() * shows.length)] : null; if (!f && !s) continue;
    const fee = usd(Math.round((1500 + w.q * 120 + Math.sqrt(w.units || 0) * 8) * (f && f.tier === 1 ? 3 : 1) / 50) * 50);
    w.syncW = S.week; M.cash += fee; w.earned = (w.earned || 0) + fee; w.units = Math.round((w.units || 0) * 1.25 + 2000); me.fame = clamp((me.fame || 0) + .8, 0, 100);
    milestone(`${w.title} licensed into ${f ? f.title : s.title}`, 'work');
    inbox('news', `Your song is in ${f ? f.title : s.title}`, `${f ? `A music supervisor on ${f.title} licenses ${w.title} for` : `${s.title} uses ${w.title} in`} ${pickLine(['the closing credits', 'the montage everyone will talk about', 'a slow-motion goodbye', 'the opening scene', 'a car chase, somehow'], w.q)}. ${fmtCash(fee)}, and streams jump the week it airs.`);
  }
}
function halftimeWeek() {
  const M = S.me, me = ME(); if (!['composer', 'actor'].includes(me.role)) return;
  const hits = (M.works || []).filter(w => w.type === 'song').reduce((t, w) => t + (w.units || 0), 0); if (hits < 2e6 && (me.fame || 0) < 60) return;
  for (const L of leaguesHere()) { const sn = seasonOf(L, S.week + 1); if (!sn || sn.phase !== 'final' || (M.halftimeY || 0) === sn.season) continue;
    M.halftimeY = sn.season; inbox('halftime', `The ${L.name} final: halftime`, `They want you for the halftime show at the final: thirteen minutes, a hundred million people watching, no fee to speak of (it's exposure, and for once that's true).`, { choices: [
      { k: 'big', label: `Go big: a medley, dancers, fireworks · ${checkLabel('pres', 15)}`, check: ['pres', 15] }, { k: 'live', label: `Keep it simple: one song, truly live · ${checkLabel('song', 13)}`, check: ['song', 13] }, { k: 'no', label: 'Turn it down' }] }); break; }
}
function halftimePick(it, k) {
  if (it.kind !== 'halftime') return false; it.done = true; const M = S.me, me = ME();
  if (k === 'no') { it.result = { t: 'They get someone else. You watch it and feel fine about it, mostly.' }; return true; }
  const ok = roll(k === 'big' ? 'pres' : 'song', k === 'big' ? 15 : 13), r = M.lastRoll;
  const boost = ok ? (k === 'big' ? 8 : 6) : (k === 'big' ? 1 : 2); me.fame = clamp((me.fame || 0) + boost, 0, 100); me.standing = clamp(me.standing + (ok ? 3 : 0), 0, 100);
  for (const w of (M.works || []).filter(w => w.type === 'song')) w.units = Math.round((w.units || 0) * (ok ? 1.6 : 1.1));
  if (ok) milestone('Played the halftime show', 'prize');
  it.result = { ok, roll: r, t: ok ? (k === 'big' ? 'Fireworks on the last chord. The internet talks about nothing else for two days.' : 'One song, one voice, a hundred million people quiet. People cry in bars.') : (k === 'big' ? 'The sound cuts out for the second song. Everyone remembers the dancers.' : 'A wobble on the high note, replayed forever. Your streams go up anyway.') };
  return true;
}
function sports2Week() { sportsWeek(); syncWeek(); halftimeWeek(); }
function sports2Pick(it, k) { return sportPick(it, k) || halftimePick(it, k); }

// ---- the sports page ----
function sportsApp() {
  const M = S.me, SP = sportOf(), Ls = leaguesHere(); if (!Ls.length) return '<p class="muted">No professional leagues here yet.</p>';
  const lk = UI.spL && LEAGUE[UI.spL] && Ls.includes(LEAGUE[UI.spL]) ? UI.spL : (SP.fan && Ls.some(L => L.k === SP.fan.lk) ? SP.fan.lk : Ls[0].k), L = LEAGUE[lk], K = SPORT_KINDS[L.sport], T = leagueTeams(L), sn = seasonOf(L);
  const tabs = Ls.map(x => `<button class="fchip${x.k === lk ? ' on' : ''}" data-spl="${x.k}">${SPORT_KINDS[x.sport].icon} ${esc(x.name)}</button>`).join('');
  const nm = i => `${SP.fan && SP.fan.lk === lk && SP.fan.t === i ? '⭐ ' : ''}${esc(T[i].name)}`;
  const last = sn ? weekGames(L, S.week - 1) : [], now = sn ? weekGames(L, S.week) : [];
  const amt = UI.luckAmt || luckStake(10), myBets = SP.bets.filter(b => b.lk === lk).slice(-6).reverse();
  const fixture = (g, i) => { const o = gameOdds(g, L), bet = SP.bets.find(b => b.lk === lk && b.w === S.week && b.g === i); return `<tr><td>${nm(g.h)}</td><td class="muted">v</td><td>${nm(g.a)}</td><td>${['H', 'D', 'A'].filter(p => o[p]).map(p => `<button class="pill${bet && bet.pick === p ? ' on' : ''}" data-spbet="${lk}:${S.week}:${i}:${p}"${bet || M.cash < amt ? ' disabled' : ''}>${p === 'H' ? 'Home' : p === 'D' ? 'Draw' : 'Away'} ${o[p].toFixed(2)}</button>`).join(' ')}</td></tr>`; };
  const tab = sn ? leagueTable(L, Math.min(S.week - 1, sn.w0 + sn.reg - 1)) : [];
  const champ = championOf(L, (sn ? sn.season : yearOf(S.week)) - (sn && sn.phase !== 'final' ? 1 : 0));
  return `<div class="fchips">${tabs}</div>
   <p class="small muted">${K.icon} ${K.label} · founded ${L.founded} · ${sn ? `${sn.season}${K.months[0] > K.months[K.months.length - 1] ? '–' + String(sn.season + 1).slice(2) : ''} season, ${sn.phase === 'regular' ? `week ${sn.idx + 1} of ${sn.reg}` : sn.phase === 'semis' ? 'semi-finals' : 'the final'}` : 'off-season'}${champ ? ` · last champions: <b>${esc(champ.name)}</b>` : ''}</p>
   <div class="cols two"><section class="panel"><h4>This week${sn ? '' : ' (no games)'}</h4>${now.length ? `<div class="luck-stake"><span class="muted small">Stake</span>${[5, 10, 50, 200].map(x => luckStake(x)).map(x => `<button class="pill${amt === x ? ' on' : ''}" data-luckamt="${x}">${fmtCash(x)}</button>`).join('')}</div><table class="os-table small"><tbody>${now.map(fixture).join('')}</tbody></table><p class="small muted">Decimal odds: a $10 bet at 2.50 returns $25. The prices add up to about 105%: that's the bookmaker.</p>` : '<p class="muted small">Nothing on this week.</p>'}
    ${last.length ? `<h4>Last week</h4><ul class="plain small">${last.map(g => `<li>${nm(g.h)} <b>${g.hs}–${g.as}</b> ${nm(g.a)}</li>`).join('')}</ul>` : ''}
    ${myBets.length ? `<h4>Your bets</h4><ul class="plain small">${myBets.map(b => { const G = weekGames(L, b.w)[b.g]; return `<li>${esc(T[G.h].name)} v ${esc(T[G.a].name)}: ${b.pick === 'H' ? 'home' : b.pick === 'D' ? 'draw' : 'away'} at ${b.odds.toFixed(2)}, ${fmtCash(b.amt)} · ${b.done ? (b.res === 'won' ? `<b class="good">won ${fmtCash(b.pay)}</b>` : '<span class="bad">lost</span>') : 'to play'}</li>`; }).join('')}</ul>` : ''}</section>
   <section class="panel"><h4>The table</h4>${tab.length ? `<table class="os-table small"><thead><tr><th></th><th>Team</th><th>P</th><th>W</th>${K.draw ? '<th>D</th>' : ''}<th>L</th><th>Pts</th><th></th></tr></thead><tbody>${tab.map((x, i) => `<tr${i < 4 ? ' class="good"' : ''}><td>${i + 1}</td><td>${nm(x.i)}</td><td>${x.p}</td><td>${x.w}</td>${K.draw ? `<td>${x.d}</td>` : ''}<td>${x.l}</td><td><b>${x.pts}</b></td><td><button class="linkish" data-spfan="${lk}:${x.i}">${SP.fan && SP.fan.lk === lk && SP.fan.t === x.i ? 'Unfollow' : 'Follow'}</button></td></tr>`).join('')}</tbody></table><p class="small muted">The top four go to the play-offs. Follow a team and their results get to you, a little.</p>` : '<p class="muted small">The table starts with the season.</p>'}</section></div>`;
}
function sportsClick(t) {
  const d = t.dataset;
  if (d.spl) { UI.spL = d.spl; render(true); return true; }
  if (d.spfan) { const [lk, i] = d.spfan.split(':'), SP = sportOf(), on = SP.fan && SP.fan.lk === lk && SP.fan.t === +i; doAct({ t: 'sport', k: 'follow', lk, t: on ? '' : i }); render(true); return true; }
  if (d.spbet) { const [lk, w, g, pick] = d.spbet.split(':'); doAct({ t: 'sport', k: 'bet', lk, w: +w, g: +g, pick, amt: UI.luckAmt || luckStake(10) }); render(true); return true; }
  return false;
}
OS_VIEWS.sports = sportsApp;
OS_EXTRA.sports = ['🏟️', 'The Sports Page', 'Leagues, fixtures, the table, the bookmaker, and your team'];
{ const G = OS_GROUPS.find(g => g[0] === 'Industry'); if (G && !G[1].includes('sports')) G[1].push('sports'); }
