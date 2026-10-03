// ---------------- Ambitions, by the hundred ----------------
// Ladders over everything the game keeps track of: credits, jobs, contacts, money and net worth, followers on every
// platform, every kind of work and how good it was, every craft and every habit of mind, every field in the Craft
// Library, every prize, festival and contest in the world, collecting, homes and cars, years in the business, your
// own films and what they took. Progress is worked out from what you already have, so nothing new is stored but the
// date each one was reached.
Object.assign(AMB_CAT, { mastery: 'Mastery', library: 'The library', prizes: 'Every prize in the world', audience: 'Every platform, every form', collect: 'Collecting and living', life: 'A life in the business' });
// Progress is checked for hundreds of goals at once; anything costly is worked out once per check. Every caller that
// walks the list starts with ambFresh(), so a cached figure never outlives the moment it was read (replays depend on it).
let AMB_MEMO = {};
function ambFresh() { AMB_MEMO = {}; }
function ambMemo(k, fn) { return k in AMB_MEMO ? AMB_MEMO[k] : (AMB_MEMO[k] = fn()); }
const ambHave = new Set(AMBITIONS.map(A => A.k));
function amb(k, c, t, p, rw, money) { if (ambHave.has(k)) return; ambHave.add(k); AMBITIONS.push({ k, c, t, p, rw, money }); }
const nfmt = n => n >= 1e9 ? n / 1e9 + ' billion' : n >= 1e6 ? n / 1e6 + ' million' : n.toLocaleString();
const rwAt = (i, n, lo = 1, hi = 8) => Math.round(lo + (hi - lo) * (n > 1 ? i / (n - 1) : 0));
// ---- career ----
const credN = () => ambMemo('cred', () => S.me.past.filter(x => x.credited).length);
[10, 35, 50, 75, 100, 150, 250].forEach((n, i, L) => amb('x_cred' + n, 'craft', `${n} screen credits`, () => [credN(), n], rwAt(i, L.length, 3, 9)));
[10, 25, 50, 100, 200, 400].forEach((n, i, L) => amb('x_jobs' + n, 'craft', `Finish ${n} jobs`, () => [S.me.past.length, n], rwAt(i, L.length, 1, 7)));
[25, 50, 100, 200, 400, 800].forEach((n, i, L) => amb('x_known' + n, 'start', `Know ${n} people in the business`, () => [Object.keys(S.me.known).length, n], rwAt(i, L.length, 1, 6)));
[1, 3].forEach((n, i) => amb('x_mentors' + n, 'craft', n === 1 ? 'Have a mentor take you on' : 'Learn from three mentors', () => [(S.me.mentors || []).length + (S.me.mentor ? 1 : 0), n], 2 + i * 3));
[[20, 'Standing 20: people know the name'], [40, 'Standing 40: a safe pair of hands'], [60, 'Standing 60: a power player'], [95, 'Standing 95: the last word']].forEach(([n, t], i) => amb('x_stand' + n, 'power', t, () => [Math.round(ME().standing), n], [2, 4, 6, 10][i]));
[[10, 'Fame 10: recognised in a café'], [25, 'Fame 25: a face people half-know'], [75, 'Fame 75: everybody knows you'], [90, 'Fame 90: a household word in every country']].forEach(([n, t], i) => amb('x_fame' + n, 'fame', t, () => [Math.round(ME().fame || 0), n], [2, 3, 7, 10][i]));
// ---- money ----
[[250000, 4], [500000, 5], [5e6, 7], [1e7, 8], [5e7, 9], [1e8, 10], [1e9, 12]].forEach(([n, rw]) => amb('x_cash' + n, 'money', `Have $${nfmt(n)} in the bank`, () => [Math.max(0, S.me.cash), usd(n)], rw, 1));
const worth = () => ambMemo('worth', () => typeof osNetWorth === 'function' ? osNetWorth().total : S.me.cash);
[[0, 1, 'Owe nobody anything (net worth above zero)'], [50000, 2], [250000, 4], [1e6, 6], [1e7, 8], [1e8, 10], [1e9, 12]].forEach(([n, rw, t]) => amb('x_worth' + n, 'money', t || `Be worth $${nfmt(n)}`, () => [Math.max(0, worth()), n ? usd(n) : 1], rw, n ? 1 : 0));
[[10000, 2], [100000, 4], [1e6, 7]].forEach(([n, rw]) => amb('x_save' + n, 'money', `$${nfmt(n)} in savings and CDs`, () => [typeof bankOf === 'function' ? (b => b.sav + (b.cds || []).reduce((s, c) => s + (c.amt || 0), 0))(bankOf(S.me)) : 0, usd(n)], rw, 1));
// ---- audience: every platform and every form ----
for (const k of Object.keys(PLATFORMS)) { const nm = PLATFORMS[k].name || PLATFORMS[k].label || k; [1000, 10000, 100000, 1e6, 1e7].forEach((n, i) => amb(`x_fol_${k}_${n}`, 'audience', `${nfmt(n)} followers on ${nm}`, () => [typeof followers === 'function' ? followers(k) : 0, n], [1, 2, 4, 6, 9][i])); }
const worksOf = t => ambMemo('w' + t, () => (S.me.works || []).filter(w => w.type === t));
for (const [t, W] of Object.entries(WORK_TYPES)) {
  const lab = (W.label || t).toLowerCase();
  [[1, `Release your first ${lab}`], [5, `Five of them: ${lab}`], [25, `Twenty-five: ${lab}`], [100, `A hundred: ${lab}`]].forEach(([n, tt], i) => amb(`x_wk_${t}_${n}`, 'audience', tt, () => [worksOf(t).length, n], [1, 2, 4, 7][i]));
  amb(`x_wq_${t}`, 'audience', `Make a ${lab} rated 85 or better`, () => [Math.round(Math.max(0, ...worksOf(t).map(w => w.q || 0))), 85], 5);
  amb(`x_wu_${t}`, 'audience', `A ${lab} that reaches a million people`, () => [Math.max(0, ...worksOf(t).map(w => w.units || 0)), 1e6], 6);
}
// ---- mastery: every craft, every habit of mind ----
const craftAvg = c => ambMemo('ca' + c, () => { const me = ME(), K = Object.keys(CRAFTS[c].subs); return K.reduce((s, k) => s + (me.sk[k] || 0), 0) / K.length; });
const RANKS = [[8, 'Competent'], [11, 'Skilled'], [14, 'Expert'], [17, 'Master'], [20, 'Legendary']];
for (const c in CRAFTS) RANKS.forEach(([n, r], i) => amb(`x_sk_${c}_${n}`, 'mastery', `${r} at ${CRAFTS[c].label.toLowerCase()} (average ${n})`, () => [Math.floor(craftAvg(c) * 10) / 10, n], [1, 2, 4, 7, 10][i]));
for (const c in CRAFTS) for (const [k, l] of Object.entries(CRAFTS[c].subs)) amb(`x_sub_${k}`, 'mastery', `${l}: as good as it gets (18)`, () => [Math.floor((ME().sk[k] || 0) * 10) / 10, 18], 4);
for (const [k, l] of Object.entries(MINDS)) [[14, 'Sharp'], [17, 'Exceptional'], [20, 'Peerless']].forEach(([n, r], i) => amb(`x_mind_${k}_${n}`, 'mastery', `${r} ${l.toLowerCase()} (${n})`, () => [Math.floor((ME().mind[k] || 0) * 10) / 10, n], [2, 4, 8][i]));
// ---- the library: lessons in every field ----
const lessonsAll = () => ambMemo('lall', () => Object.keys(typeof curMap === 'function' ? curMap() : {}).filter(id => !/^p:/.test(id)).length);
const libTotal = () => Object.values(CURR).reduce((s, C) => s + C.lessons.length, 0);
[[10, 1], [50, 2], [100, 3], [250, 5], [500, 8]].forEach(([n, rw]) => amb('x_les' + n, 'library', `Learn ${n} lessons`, () => [lessonsAll(), n], rw));
amb('x_lesall', 'library', 'Learn every lesson in the library', () => [lessonsAll(), libTotal()], 15);
function ambLibrary() {
  for (const f in CURR) { const C = CURR[f], N = () => C.lessons.length;
    amb(`x_lf_${f}_5`, 'library', `${C.label}: five lessons`, () => [typeof fieldKnown === 'function' ? fieldKnown(f) : 0, 5], 1);
    amb(`x_lf_${f}_half`, 'library', `${C.label}: half the lessons`, () => [typeof fieldKnown === 'function' ? fieldKnown(f) : 0, Math.ceil(N() / 2)], 3);
    amb(`x_lf_${f}_all`, 'library', `${C.label}: every lesson (mastery)`, () => [typeof fieldKnown === 'function' ? fieldKnown(f) : 0, N()], 7);
    if (C.mods) amb(`x_lp_${f}`, 'library', `${C.label}: every programme project`, () => [Object.keys(typeof projMap === 'function' ? projMap() : {}).filter(k => k.startsWith(f + ':')).length, C.mods.length], 6);
  }
}
ambLibrary();
// ---- prizes: every ceremony, festival, show and contest ----
const laurelNames = () => ambMemo('laur', () => new Set((typeof myLaurels === 'function' ? myLaurels() : []).map(l => l.b.name)));
const prizeNames = [];
if (typeof CEREMONY !== 'undefined') for (const m in CEREMONY) prizeNames.push([CEREMONY[m][0], 'ceremony']);
if (typeof FESTIVALS !== 'undefined') for (const F of FESTIVALS) prizeNames.push([F.name.replace(/^the /, 'The '), 'festival']);
for (const f in MEDIA_AWARDS) prizeNames.push([MEDIA_AWARDS[f][0], 'media']);
for (const c of COMPS) prizeNames.push([c.name, c.tier === 'major' ? 'major' : c.tier === 'fun' ? 'fun' : 'contest']);
prizeNames.forEach(([n, kind], i) => amb('x_prz' + i + '_' + n.replace(/[^A-Za-z]/g, '').slice(0, 12), 'prizes', `Win ${n.startsWith('The ') ? n.replace(/^The /, 'the ') : n}`, () => [laurelNames().has(n) ? 1 : 0, 1], { ceremony: 8, festival: 6, media: 6, major: 5, contest: 3, fun: 1 }[kind]));
[[1, 2], [5, 4], [10, 6], [25, 8], [50, 11]].forEach(([n, rw]) => amb('x_laur' + n, 'prizes', `${n === 1 ? 'A prize, any prize' : n + ' prizes'}`, () => [(typeof myLaurels === 'function' ? myLaurels() : []).length, n], rw));
[[5, 1], [25, 3], [100, 6]].forEach(([n, rw]) => amb('x_ent' + n, 'prizes', `Enter ${n} competitions`, () => [(S.me.comps || []).length, n], rw));
// ---- collecting and living ----
const relicN = () => ambMemo('rel', () => typeof relicsOwned === 'function' ? relicsOwned().length : 0);
[[1, 2, 'Own a piece of film history'], [5, 4], [10, 6], [20, 9], [38, 15, 'Own every relic there is']].forEach(([n, rw, t]) => amb('x_rel' + n, 'collect', t || `Own ${n} relics`, () => [relicN(), n], rw));
if (typeof RELIC !== 'undefined') for (const R of Object.values(RELIC).filter(R => R.tier === 'grail')) amb('x_grail_' + R.k, 'collect', `Own ${R.name.replace(/^A /, 'a ').toLowerCase()}`, () => [typeof relicOwned === 'function' && relicOwned(R.k) ? 1 : 0, 1], 9);
[[10, 2], [25, 4], [60, 7]].forEach(([n, rw]) => amb('x_bz' + n, 'collect', `Buy ${n} things at the Bazaar`, () => [(S.me.bz || []).length, n], rw));
[[5, 1], [15, 3], [30, 6]].forEach(([n, rw]) => amb('x_furn' + n, 'collect', `${n} pieces of furniture`, () => [(S.me.home && S.me.home.items || []).length, n], rw));
[[5, 1], [15, 3]].forEach(([n, rw]) => amb('x_apps' + n, 'collect', `${n} apps on the computer`, () => [(S.me.owned2 || []).length, n], rw));
amb('x_flip', 'collect', 'Sell something for more than you paid', () => [(S.me.flags || {}).flip ? 1 : 0, 1], 2);
for (const [k, L] of Object.entries(ORIGIN.life)) if (k !== 'couch') amb('x_home_' + k, 'collect', `Live in ${/^(A|An) /.test(L.label) ? L.label.replace(/^A /, 'a ').replace(/^An /, 'an ') : 'a ' + L.label.toLowerCase()}`, () => [S.me.life === k || (S.me.milestones || []).some(m => m.t.startsWith('Moved to ' + L.label.toLowerCase())) ? 1 : 0, 1], Math.max(1, Math.round(Math.log10(L.rent) * 3 - 6)));
for (const [k, V] of Object.entries(VEHICLES)) if (k !== 'transit') amb('x_veh_' + k, 'collect', `Get around by ${V.label.replace(/^A /, 'a ').replace(/^An /, 'an ').toLowerCase()}`, () => [S.me.vehicle === k || (S.me.milestones || []).some(m => m.t === 'Got ' + V.label.toLowerCase()) ? 1 : 0, 1], Math.max(1, Math.round(Math.log10(V.price + V.upkeep * 52 + 10) * 2 - 5)));
// ---- a life ----
const yrsIn = () => Math.floor((S.week - (S.me.startW || 0)) / 52);
[[1, 1, 'Survive your first year'], [5, 3], [10, 5], [20, 7], [30, 9], [40, 11], [50, 14, 'Fifty years in the business']].forEach(([n, rw, t]) => amb('x_yrs' + n, 'life', t || `${n} years in the business`, () => [yrsIn(), n], rw));
[30, 40, 50, 60, 70, 80, 90].forEach((n, i) => amb('x_age' + n, 'life', `Still working at ${n}`, () => [S.me.jobs.length || S.me.past.some(p => p.end !== undefined && S.week - p.end < 52) ? S.year - ME().born : 0, n], 1 + i));
const ownFilms = () => ambMemo('own', () => (S.me.scripts || []).filter(s => s.made !== undefined).map(s => S.films[s.made]).concat((S.me.holdings || []).filter(h => h.made !== undefined).map(h => S.films[h.made])).filter(Boolean));
[[3, 4], [5, 5], [10, 7], [25, 10]].forEach(([n, rw]) => amb('x_own' + n, 'power', `${n} films of your own`, () => [ownFilms().length, n], rw));
const myGross = () => ambMemo('gross', () => (typeof myFilms === 'function' ? myFilms() : []).filter(f => f.rel !== null).reduce((s, f) => s + (typeof grossM === 'function' ? grossM(f) : 0), 0));
[[1, 2], [10, 3], [100, 5], [500, 7], [1000, 9], [5000, 12]].forEach(([n, rw]) => amb('x_gross' + n, 'power', `Films you worked on take $${n >= 1000 ? n / 1000 + ' billion' : n + ' million'}`, () => [Math.round(myGross()), n], rw));
[[1, 3], [5, 6], [10, 8], [25, 11]].forEach(([n, rw]) => amb('x_hits' + n, 'power', `${n} hit${n > 1 ? 's' : ''} from your own company`, () => [S.me.company !== undefined && S.companies[S.me.company] ? S.companies[S.me.company].hits : 0, n], rw));
[[1, 1, 'Start a review blog or column'], [10, 2], [50, 4], [200, 7]].forEach(([n, rw, t]) => amb('x_rev' + n, 'audience', t || `Publish ${n} reviews`, () => [worksOf('review').length, n], rw));
