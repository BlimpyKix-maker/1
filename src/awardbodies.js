// ---------------- Award bodies, festivals and contests you can open; and the EGOF ----------------
// Every prize in the game has a page: who gives it, since when, what it stands for, what its voters or juries
// actually reward, its categories, and every winner on record, from the archive and from the years you've lived.
// The grand slam of this world is the EGOF: an Emmet (screens at home), a Gramophone (music), an Oswald (cinema)
// and a Footlight (theatre). Very few people have all four.
const CEREMONY = {
  US: ['Academy Oswalds', 1929, 'The Academy of Motion Picture Arts and Letters, about ten thousand voting members in branches by craft.'], CA: ['Maple Screen Awards', 1949, 'Canada\'s screen academy.'], MX: ['Ariadna Awards', 1947, 'The Mexican Academy\'s prizes, a bronze statuette of a winged woman.'],
  UK: ['British Academy Masks', 1949, 'The British Academy of Film and Television Arts\' film awards, a mask on a plinth.'], FR: ['Césaire Awards', 1976, 'The French national film academy\'s awards, judged by four thousand professionals.'], IT: ['Donatello Davids', 1956, 'Italy\'s Academy of Cinema prizes, named after a Renaissance statue.'],
  DE: ['Lola-Berlin Film Prize', 1951, 'Germany\'s national film prize, the most richly funded in Europe.'], ES: ['Goyesca Awards', 1987, 'The Spanish Academy\'s awards, a bust of the painter.'], HK: ['Harbour Film Awards', 1982, 'Hong Kong\'s industry awards, voted by guild members.'],
  TW: ['Golden Steed Awards', 1962, 'The Chinese-language world\'s most prestigious film prize, held in Taipei.'], JP: ['Japan Academy Prize', 1978, 'Japan\'s industry academy awards.'], KR: ['Azure Dragon Awards', 1963, 'Korea\'s most watched film awards, run by a newspaper.'],
  CN: ['Golden Phoenix Awards', 1981, 'Mainland China\'s professional film prize, chosen by experts.'], IN: ['Filmfair Awards', 1954, 'India\'s oldest popular film awards, run by a film magazine.'], AU: ['Southern Cross Screen Awards', 1958, 'Australia\'s screen academy awards.'],
  NZ: ['Kiwi Screen Awards', 2005, 'New Zealand\'s screen awards.'], NG: ['Lagos Viewers\' Choice Awards', 2013, 'Africa\'s most-watched screen awards, half chosen by viewers.'], EG: ['Cairo Film Prize', 1976, 'Egypt\'s national cinema prize.'],
  BR: ['Grand Othello Prize', 2000, 'The Brazilian Film Academy\'s awards.'], AR: ['Platinum Condor Awards', 1943, 'Argentina\'s film critics\' prizes, the oldest in Latin America.'], SU: ['Nike Awards', 1988, 'Russia\'s national film academy awards.'],
  SE: ['Golden Beetle Awards', 1964, 'Sweden\'s national film awards.'], DK: ['Bodilia Awards', 1948, 'Denmark\'s critics\' prize, one of Europe\'s oldest.'], CS: ['Czech Lynx Awards', 1993, 'The Czech film academy\'s prizes.'],
  PL: ['Polish Falcons', 1999, 'The Polish Film Academy\'s awards.'], HU: ['Hungarian Film Week Prize', 1965, 'Hungary\'s national film festival awards.'], FI: ['Jussila Awards', 1944, 'Finland\'s film awards, a statuette of a farmhand.'],
  TR: ['Golden Tangerine Awards', 1964, 'Turkey\'s oldest film festival prizes, in Antalya.'], IR: ['Crystal Phoenix of Tehran', 1982, 'Iran\'s national film festival prizes.'], SN: ['Golden Stallion of Yennenga', 1969, 'The pan-African film festival\'s top prize.'],
  PH: ['Manila Gawad Awards', 1952, 'The Philippines\' oldest film awards.'], TH: ['Golden Swan Awards', 1955, 'Thailand\'s national film awards.'], VN: ['Silver Kite Awards', 2003, 'Vietnam\'s cinema association awards.'],
  CO: ['Macondo Prize', 2010, 'Colombia\'s film academy awards.'], ID: ['Citra-Jaya Awards', 1955, 'Indonesia\'s national film festival awards.'], ZA: ['Silver Horn Awards', 2006, 'South Africa\'s film and television awards.']
};
function ceremony(m) { return (CEREMONY[m] || [MARKETS[m].name + ' Film Awards'])[0]; }
// the EGOF: Emmet, Gramophone, Oswald, Footlight
MEDIA_AWARDS.creator = ['The Emmets', ['Outstanding Online Series', 'Breakout Creator', 'Outstanding Short-Form Series']];
const EGOF = [['E', 'Emmet', 'The Emmets', 'television, streaming and online video'], ['G', 'Gramophone', 'The Gramophones', 'recorded music'], ['O', 'Oswald', 'Academy Oswalds', 'cinema'], ['F', 'Footlight', 'The Footlights', 'theatre']];
function egofWins() { const M = S.me; if (!M) return {}; const W = {}; for (const m of M.milestones || []) if (m.kind === 'prize' && /^Won/.test(m.t)) for (const [k, , show] of EGOF) if (m.t.includes(show)) W[k] = W[k] || m.w; return W; }
function egofWeek() {
  const M = S.me, me = ME(), W = egofWins();
  if (M.egof || Object.keys(W).length < 4) return;
  M.egof = S.week; me.standing = clamp(me.standing + 10, 0, 100); me.fame = clamp((me.fame || 0) + 15, 0, 100);
  milestone('Completed the EGOF: an Emmet, a Gramophone, an Oswald and a Footlight', 'prize');
  news('People', `${me.name} completes the EGOF, the rarest achievement in entertainment.`, { person: me.id });
  inbox('news', 'The EGOF', 'An Emmet, a Gramophone, an Oswald and a Footlight. The papers run your photo with the four statues. Fewer than twenty people have ever done it. You put them on the same shelf and look at them for a long time.');
}
function egofHTML() {
  const W = egofWins(), M = S.me;
  return `<section class="panel egof"><h3>The EGOF ${M && M.egof ? '<span class="chip good">Complete</span>' : `<span class="count">${Object.keys(W).length} of 4</span>`}</h3><div class="egofrow">${EGOF.map(([k, n, show, what]) => `<div class="egofc${W[k] ? ' won' : ''}"><b>${k}</b><span>${n}</span><small>${esc(what)}</small><small>${W[k] ? 'Won ' + yearOf(W[k]) : linkPrizes(esc(show))}</small></div>`).join('')}</div><p class="muted small">Entertainment's grand slam. Win an Emmet (series and online video), a Gramophone (music), an Oswald (cinema, at the Academy Oswalds) and a Footlight (theatre). It takes several careers' worth of crossing over.</p></section>`;
}
// ---- the bodies ----
const BODY_SEEKS = {
  ceremony: 'Voters are working professionals. They reward ambition, big performances, period and social dramas, and films that campaigned well; genre films and comedies rarely win the top prize.',
  festival: 'Juries and programmers look for discoveries: a distinct voice, formal risk, and films that start conversations. Small independent films have an edge; polish matters less than nerve.',
  music: 'Voting members of the recording academy reward craft and cultural impact: songs that defined the year, artists who broke through, albums that hold together.',
  stage: 'Theatre critics and producers vote on the season\'s new plays, musicals and performances; a show must have opened in the city to qualify.',
  podcast: 'An industry jury listens for craft: reporting, editing, sound and a host people trust.',
  creator: 'The Emmets\' online categories reward series that build an audience and a format; numbers count, but so does craft.',
  contest: 'Readers score entries blind against a rubric; the best stand out in the first ten pages.'
};
let AB_CACHE = null, AB_FOR = null, AW_IDX = null, AW_KEY = '';
function awardBodies() {
  if (AB_CACHE && AB_FOR === S) return AB_CACHE;
  const L = [];
  for (const m in CEREMONY) { const [n, y, who] = CEREMONY[m]; L.push({ name: n, kind: 'ceremony', field: 'film', month: 1, founded: y, about: `${who} The national film awards of ${MARKETS[m].name}, held each February.`, cats: ['Best Film', 'Best Performance', 'Best Screenplay'], key: n, m, prestige: m === 'US' ? 1 : ['UK', 'FR', 'TW', 'IN', 'JP', 'KR', 'IT'].includes(m) ? 2 : 3 }); }
  const ALIAS = { lagoon: ['Lion of the Lagoon'], mountain: ['Festival Sundance', 'Mountain Film Festival'], cote: ['Festival de la Côte'], bruin: ['Golden Bruin', 'Silver Bruin'] };
  for (const F of typeof FESTIVALS !== 'undefined' ? FESTIVALS : []) L.push({ fk: F.k, founded: F.founded, alias: ALIAS[F.k] || [], name: F.name.replace(/^the /, 'The '), kind: 'festival', field: 'film', month: F.month, about: F.d, cats: [F.prize, 'Official selection'], key: F.name.replace(/^the /, ''), bar: F.bar, fee: F.fee, prestige: F.bar >= 78 ? 1 : F.bar >= 65 ? 2 : 3 });
  for (const f in MEDIA_AWARDS) { const [show, cats] = MEDIA_AWARDS[f]; L.push({ name: show, kind: f === 'creator' || f === 'podcast' ? 'media' : f, field: f, month: 0, about: { music: 'The recording academy\'s awards, the music industry\'s biggest night.', stage: 'Broadway\'s and the West End\'s prizes in this world, for the season\'s plays, musicals and performances.', podcast: 'The audio industry\'s awards, given since podcasts became a business.', creator: 'The awards for series made for screens at home: streaming, television and online video.' }[f], cats, key: show, prestige: 1, seeks: BODY_SEEKS[f] }); }
  for (const c of typeof COMPS !== 'undefined' ? COMPS : []) L.push({ name: c.name, kind: 'contest', field: c.cat, month: c.month, about: c.d, cats: [c.tier === 'major' ? 'Grand prize' : 'Winner'], key: c.name, comp: c.k, fee: c.fee, prize: c.prize, prestige: c.tier === 'major' ? 1 : c.tier === 'mid' ? 2 : 3 });
  L.forEach((b, i) => b.id = i);
  AB_FOR = S; AW_IDX = null; return AB_CACHE = L;
}
// Any prize named in a piece of (already escaped) text becomes a link to its page: awards lists, timelines,
// ambitions, trivia, the inbox. Longest names first, and never inside an existing link or tag.
let PRIZE_RX = null, PRIZE_MAP = null, PRIZE_FOR = null;
function linkPrizes(html) {
  if (!html) return html;
  const B = awardBodies();
  if (PRIZE_FOR !== B) {
    const pairs = [];
    for (const b of B) for (const n of [b.name, b.key, ...(b.alias || [])]) if (n && n.length > 7) pairs.push([esc(n), b.id]);
    pairs.sort((a, c) => c[0].length - a[0].length);
    PRIZE_MAP = new Map(); for (const [n, id] of pairs) if (!PRIZE_MAP.has(n)) PRIZE_MAP.set(n, id);
    PRIZE_RX = new RegExp('(<a[\\s>][\\s\\S]*?</a>|<button[\\s>][\\s\\S]*?</button>|<[^>]+>)|(' + [...PRIZE_MAP.keys()].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
    PRIZE_FOR = B;
  }
  return html.replace(PRIZE_RX, (m, tag, name) => tag ? tag : `<a href="#" class="lk" data-go="award:${PRIZE_MAP.get(name)}">${name}</a>`);
}
// the page for a contest in COMPS
function compLink(c, text) { const b = awardBodies().find(x => x.comp === c.k); return b ? `<a href="#" class="lk" data-go="award:${b.id}">${esc(text || c.name)}</a>` : esc(text || c.name); }
function bodyWinners(b) {
  const out = [];
  if (b.kind === 'festival' && b.fk && typeof festRecord === 'function') return festRecord(FESTIVALS.find(F => F.k === b.fk));
  if (b.kind === 'ceremony' || b.kind === 'festival') return (filmAwardIndex()[b.key] || []).slice().sort((a, c) => c.y - a.y); else if (b.kind === 'contest') { const M = S.me; for (const e of (M && M.comps) || []) if (e.k === b.comp && e.place === 'win') out.push({ y: yearOf(e.w || S.week), cat: 'Winner', name: ME().name, mine: 1 }); }
  else for (const r of S.mawards || []) if (r.show === b.key) for (const [cat, name] of r.w) out.push({ y: r.y, cat, name });
  return out.sort((a, b2) => b2.y - a.y);
}
// one pass over every film's awards, rebuilt when the record grows
function filmAwardIndex() {
  const k = S.films.length + ':' + (S.awards || []).length + ':' + S.week;
  if (AW_IDX && AW_KEY === k) return AW_IDX;
  const bs = awardBodies().filter(b => b.kind === 'ceremony' || b.kind === 'festival'), I = {};
  const add = (name, rec) => { const b = bs.find(x => [x.key, ...(x.alias || [])].some(k => name.startsWith(k) || name.includes(', ' + k))); if (b) (I[b.key] = I[b.key] || []).push(rec); };
  const seen = new Set();
  for (const a of S.awards || []) { add(a.name, { y: a.y, cat: a.name.replace(/^[^:]*: /, ''), film: a.film, people: a.people }); seen.add(a.film + '|' + a.name); }
  for (const f of S.films) if (f.archive) for (const s of f.awards || []) { const cat = s.replace(/^[^:]*: /, ''), base = s.replace(/ \d{4}(:|$)/, '$1').replace(/ \d{4}$/, ''); if (seen.has(f.id + '|' + base)) continue; add(s, { y: +((s.match(/\b(18|19|20)\d\d\b/) || [])[0]) || (f.rel !== null ? yearOf(f.rel) : 0), cat, film: f.id, people: [] }); }
  AW_KEY = k; return AW_IDX = I;
}
function bodyLink(name) { const b = awardBodies().find(x => [x.key, ...(x.alias || [])].some(k => name.startsWith(k) || name.includes(', ' + k))); return b ? `<a href="#" class="lk" data-go="award:${b.id}">${esc(name)}</a>` : esc(name); }
function viewAwardBody(id) {
  const b = awardBodies()[id]; if (!b) return '<p>Not found.</p>';
  const W = bodyWinners(b), MON_ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const kindL = { ceremony: 'National film awards', festival: 'Film festival', music: 'Music awards', stage: 'Theatre awards', media: 'Screen and audio awards', contest: 'Competition' }[b.kind];
  const cc = b.comp && typeof COMPS !== 'undefined' ? COMPS.find(c => c.k === b.comp) : null;
  const seeks = b.seeks || (cc ? `The judges look for ${statLabel(cc.stat).toLowerCase()} above all. ${cc.tier === 'major' ? 'Hundreds enter; a handful are read past the first round.' : cc.tier === 'fun' ? 'Nobody takes it too seriously, which is the point.' : 'A working jury, a real prize and a crowd that matters.'}` : null) || BODY_SEEKS[b.kind] || BODY_SEEKS.contest;
  const egof = EGOF.find(e => e[2] === b.key);
  return `<div class="head"><p class="eyebrow">${esc(kindL)}${b.founded ? ' · since ' + b.founded : ''} · ${MON_[b.month]}</p><h2>${esc(b.name)}</h2><p class="lede">${esc(b.about || '')}</p></div>${typeof bodyLoreHTML === 'function' ? bodyLoreHTML(b) : ''}
   <div class="cols two"><section class="panel"><h3>What it stands for</h3><p>${esc(seeks)}</p>${b.bar ? `<p class="small">Selection bar: films need to be about <b>${b.bar}/100</b> in quality. Small, independent films get a nudge. Entry fee ${fmtCash(usdW(b.fee))}.</p>` : ''}${b.prize ? `<p class="small">Prize: <b>${fmtCash(usdW(b.prize))}</b> · entry ${fmtCash(usdW(b.fee))} · enter from the Contests tab.</p>` : ''}${egof ? `<p class="small">One of the four EGOF prizes: the <b>${egof[1]}</b>.</p>` : ''}
    <h4>Categories</h4><p>${(typeof bodyCats === 'function' ? bodyCats(b) : b.cats).map(c => `<button class="pill" data-abcat="${esc(c)}">${esc(c)}</button>`).join(' ')}</p><p class="muted small">Prestige ${'★'.repeat(4 - b.prestige)}</p></section>
   ${b.comp && typeof contestRulesHTML === 'function' ? contestRulesHTML(COMPS.find(c => c.k === b.comp)) : ''}${b.fk && typeof festivalPage === 'function' ? '</div>' + festivalPage(FESTIVALS.find(F => F.k === b.fk)) + '<div>' : (typeof awardTableHTML === 'function' ? awardTableHTML(b) : '')}</div>`;
}
function awardBodiesHTML() {
  const B = awardBodies(), F = UI.abf = UI.abf || 'all', kinds = { all: 'All', ceremony: 'Film awards', festival: 'Festivals', music: 'Music', stage: 'Theatre', media: 'Screens & audio', contest: 'Competitions' };
  const L = B.filter(b => F === 'all' || b.kind === F);
  return `<h3>Every prize <span class="count">${B.length}</span></h3><div class="bfilter"><div class="bf-row">${Object.entries(kinds).map(([k, l]) => `<button class="pill${F === k ? ' on' : ''}" data-abf="${k}">${l}</button>`).join('')}</div></div>
   <div class="tw"><table class="grid small"><thead><tr><th>Prize</th><th>Kind</th><th>When</th><th>Prestige</th><th class="n">Winners</th></tr></thead><tbody>${L.map(b => `<tr><td><a href="#" class="lk" data-go="award:${b.id}">${esc(b.name)}</a></td><td>${esc(kinds[b.kind] || b.kind)}</td><td data-v="${b.month}">${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][b.month]}</td><td data-v="${4 - b.prestige}">${'★'.repeat(4 - b.prestige)}</td><td class="n">${b.fk ? Math.max(0, S.year - (b.founded || S.year)) + ' editions' : bodyWinners(b).length}</td></tr>`).join('')}</tbody></table></div>`;
}
