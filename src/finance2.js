// ---------------- The Bourse, the economy and the bank, grown up ----------------
// One market: every listed company in the game, studios and labels and networks and streamers and theatres, in a
// single table you can filter by industry and sort however you like. Tips come from somewhere: people you actually
// know (and what they'd know), published analysts, tracking surveys and plain hearsay, and every source keeps a
// track record you can check. The economy page says what the weather in the markets means for you. The bank grows a
// private side once you're worth something: a credit line against your portfolio, and the angels and family offices
// who put money into films, if you can get a meeting and make the case.

// ---- one market ----
function mktRows() {
  const M = S.me, rows = [];
  for (const c of listedCos()) rows.push({ k: 'c' + c.id, co: c.id, tk: tickerOf(c), name: c.name, ind: 'Film studios', px: mktPrice(c), d1: chg(c, 1), d52: chg(c, 52), cap: mcap(c), y: c.tier === 1 ? 2.4 : 0, own: (M.port || {})[c.id] || 0, spark: spark(c) });
  for (const s of SECTORS.map(x => SECTOR[x[0]]).filter(sectorOpen)) rows.push({ k: 's' + s.k, sk: s.k, tk: s.tk, name: s.name, ind: s.sec, px: sectorPrice(s), d1: sChg(s, 1), d52: sChg(s, 52), cap: null, y: sYield(s) * 100, own: (M.sport || {})[s.k] || 0, spark: sSpark(s), s });
  return rows;
}
function allMarketHTML() {
  const T = UI.mkt, M = S.me, R = mktRows(), inds = {}; for (const r of R) inds[r.ind] = (inds[r.ind] || 0) + 1;
  const f = UI.mkf || 'all', srt = UI.mks || 'cap', q = (UI.mkq || '').toLowerCase().trim();
  let L = R.filter(r => (f === 'all' || r.ind === f) && (!q || r.tk.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)));
  const key = { cap: r => r.cap ?? r.px * 2, d1: r => r.d1, d52: r => r.d52, px: r => r.px, y: r => r.y, name: r => r.name };
  L.sort((a, b) => srt === 'name' ? a.name.localeCompare(b.name) : key[srt](b) - key[srt](a));
  const movers = R.slice().sort((a, b) => b.d1 - a.d1), byInd = Object.keys(inds).map(k => { const G = R.filter(r => r.ind === k); return [k, G.reduce((t, r) => t + r.d52, 0) / G.length]; }).sort((a, b) => b[1] - a[1]);
  const trade = r => r.co !== undefined ? `<button class="btn-s" data-mkt="buy:${r.co}">Buy</button>${r.own ? ` <button class="btn-s ghost" data-mkt="sell:${r.co}">Sell</button>` : ''}` : `<button class="btn-s" data-sec="buy:${r.sk}">Buy</button>${r.own ? ` <button class="btn-s ghost" data-sec="sell:${r.sk}">Sell</button>` : ''}`;
  const nm = r => r.co !== undefined ? `<a href="#" class="lk" data-mkt="sel:${r.co}"><b>${esc(r.tk)}</b></a>` : `<b>${esc(r.tk)}</b>`;
  return `<div class="mk-sum"><div><span class="muted small">Best industry this year</span><b>${esc(byInd[0][0])} ${pctS(byInd[0][1])}</b></div><div><span class="muted small">Worst</span><b>${esc(byInd[byInd.length - 1][0])} ${pctS(byInd[byInd.length - 1][1])}</b></div><div><span class="muted small">Top movers this week</span><b class="small">${movers.slice(0, 3).map(r => `${esc(r.tk)} ${pctS(r.d1)}`).join(' · ')}</b></div></div>
   <div class="filt"><label class="filt-q"><span>Search</span><input id="mkq" type="search" placeholder="Ticker or company…" value="${esc(UI.mkq || '')}"></label><label><span>Industry</span>${sel('mk-ind', [['all', `Everything (${R.length})`], ...Object.entries(inds).sort((a, b) => b[1] - a[1]).map(([k, n]) => [k, `${k} (${n})`])], f)}</label><label><span>Sort</span>${sel('mk-sort', [['cap', 'Biggest'], ['d1', 'This week'], ['d52', 'This year'], ['y', 'Dividend yield'], ['px', 'Price'], ['name', 'Name']], srt)}</label><label><span>Shares a trade</span><input id="mkt-q" type="number" min="1" value="${T.q || 10}"></label></div>
   <div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th>Industry</th><th>6M</th><th class="n">Price</th><th class="n">1W</th><th class="n">1Y</th><th class="n">Yield</th><th class="n">Own</th><th></th></tr></thead><tbody>${L.slice(0, 120).map(r => `<tr><td>${nm(r)}</td><td class="small">${esc(r.name)}</td><td class="small muted">${esc(r.ind)}</td><td>${r.spark}</td><td class="n">$${r.px.toFixed(2)}</td><td class="n">${pctS(r.d1)}</td><td class="n">${pctS(r.d52)}</td><td class="n small">${r.y ? r.y.toFixed(1) + '%' : '–'}</td><td class="n">${r.own || ''}</td><td>${trade(r)}</td></tr>`).join('')}</tbody></table></div>
   <p class="small muted">${L.length} listings${L.length > 120 ? ', showing 120' : ''}. Studio tickers open their own page. Every company pays its dividend quarterly where it has one.</p>`;
}
function mktChange(e) { const id = e.target.id, v = e.target.value; if (id === 'mk-ind') { UI.mkf = v; render(true); return true; } if (id === 'mk-sort') { UI.mks = v; render(true); return true; } if (id === 'mkq') { UI.mkq = v; render(true); return true; } return false; }

// ---- tips that come from somewhere ----
const ANALYSTS = ['Barnum & Wexley', 'Strand Securities', 'Quayle Partners', 'Mercer Hollis', 'Lindqvist Capital', 'Okonkwo Brothers', 'Tanaka Fairweather', 'Pell & Abernathy', 'Rosetti Kline', 'Harrow Street Research'];
const TIP_KIND = { insider: ['🤫', 'Someone on the film', .86], informed: ['🎬', 'Someone in the business', .66], exhibitor: ['🎟️', 'A cinema booker', .71], analyst: ['📊', 'Analyst note', .7], tracking: ['📈', 'Tracking survey', .73], press: ['📰', 'Trade gossip column', .58], hearsay: ['💬', 'Hearsay', .47] };
const HEARSAY = ['Clapgram chatter', 'a man at the gym', 'an online forum', 'your cousin who "knows people"', 'a taxi driver who drove the star', 'a group chat you shouldn\'t be in', 'a waiter at the studio commissary', 'your dentist', 'a fan account with 40K followers', 'a stranger at a wedding'];
const COLUMNS = ['"Overheard" in The Daily Slate', 'the Back Lot Whispers column', 'a blind item in Reel Talk', 'the Monday Morning Grosses newsletter'];
// why it will open big or flop: one story per angle, with the film's own people in it
const TIP_WHY = {
  test: [['the test audience applauded at the end', 'test scores came back in the 90s', 'the second test screening went even better than the first'], ['the test screening went badly', 'they lost a third of the test audience at the midpoint', 'test scores were so soft they\'re re-cutting the ending']],
  trailer: [['the trailer numbers are huge', 'the trailer is the most-watched in the {genre} genre this year', 'the trailer\'s last shot became a meme overnight'], ['nobody is talking about the trailer', 'the trailer got ratioed online', 'they\'ve changed the trailer twice in a month']],
  presale: [['the pre-sales are strong', 'opening-night shows are selling out in big cities', 'premium screens are already booked solid'], ['pre-sales are slow', 'cinemas are quietly moving it to smaller screens', 'premium screens went to the competition']],
  embargo: [['the review embargo lifts a week early, which means they\'re confident', 'critics at the press screening stayed for the credits'], ['the review embargo lifts the night before it opens, which is never a good sign', 'there was no press screening at all']],
  star: [['{star} is doing every talk show going', '{star} keeps calling it the best work of their life, and means it'], ['{star} is skipping half the press tour', '{star} and {dir} aren\'t speaking, apparently']],
  shoot: [['the dailies were the talk of the lot', 'they came in under budget and on time, and it shows'], ['reshoots, and the studio is nervous', 'the edit has been taken off {dir}']],
  spend: [['the studio just doubled the marketing spend', 'there are billboards for it everywhere'], ['the studio cut the marketing budget last week', 'the ads have mostly stopped']],
  slot: [['it has the weekend to itself', 'the competition moved out of its way'], ['it opens against something much bigger', 'the date has moved twice, and nobody moves a date twice for a good reason']],
  buzz: [['word of mouth is building', 'the exhibitors\' preview got a standing ovation', 'the merchandise orders came in triple'], ['tracking is soft', 'nobody is talking about it', 'exhibitors watched it in silence']]
};
const TIP_ANGLES = { insider: ['shoot', 'test', 'star', 'spend'], informed: ['test', 'shoot', 'star', 'buzz'], exhibitor: ['presale', 'slot', 'buzz'], analyst: ['presale', 'slot', 'spend', 'trailer'], tracking: ['trailer', 'presale', 'buzz'], press: ['star', 'shoot', 'embargo', 'spend'], hearsay: ['trailer', 'buzz', 'star', 'embargo'] };
const SECTOR_WHY = {
  box: [['cinema attendance is running ahead of last year', 'a crowded summer slate is coming'], ['attendance is softer than the headlines say', 'the next quarter\'s release calendar is thin']],
  prod: [['every big shoot is booked through next year', 'studios are greenlighting again'], ['productions are being pushed', 'two big shoots just shut down']],
  film: [['a wave of directors are shooting on film again', 'a big order from a festival restoration programme'], ['another lab just closed', 'the last holdouts are switching to digital']],
  kids: [['the licensing deals for the holiday films are huge', 'retailers are restocking early'], ['retailers are sitting on unsold stock', 'the big family film slipped a year']],
  music: [['streaming royalties are up again', 'a catalogue sale is being negotiated'], ['a royalty dispute is going to court', 'subscriber growth has stalled']],
  video: [['subscriber numbers will surprise people', 'a price rise is sticking'], ['they\'re losing subscribers faster than they admit', 'content spending is out of control']],
  pod: [['the ad market for audio is booming', 'a celebrity show is about to sign'], ['advertisers are pulling back', 'the top show is leaving']],
  gold: [['big money is nervous, and runs to gold', 'central banks are buying'], ['everyone is feeling brave again', 'rates are going up']]
};
function tipsThisWeek() {
  const M = S.me, out = [], r = hashRand(S.week * 2357 + 3), known = Object.keys(M.known || {}).map(Number).filter(id => P(id) && !P(id).dead);
  const up = S.films.filter(f => f.rel === null && f.stage === 3 && f.co !== null && S.companies[f.co] && S.companies[f.co].closed === null && S.companies[f.co].owner === undefined && f.stageEnd - S.week <= 4 && f.stageEnd >= S.week);
  const pk = L => L[Math.floor(r() * L.length)];
  for (let i = 0; i < 5 && up.length; i++) {
    const f = up.splice(Math.floor(r() * up.length), 1)[0], c = S.companies[f.co], q0 = f.q !== undefined ? f.q : 55, truth = q0 >= 62 ? 1 : q0 < 48 ? -1 : 0;
    const on = known.find(id => keyIds(f).includes(id)), inb = known.filter(id => P(id).hub === f.hub && opinion(id) > 0);
    const kind = on !== undefined && r() < .7 ? 'insider' : inb.length && r() < .45 ? 'informed' : pk(['analyst', 'tracking', 'exhibitor', 'press', 'hearsay', 'hearsay']);
    const who = kind === 'insider' ? on : kind === 'informed' ? inb[Math.floor(r() * inb.length)] : null;
    const role = who !== undefined && who !== null ? (f.dir === who ? 'who directed it' : f.cast.includes(who) ? 'who is in it' : f.wri.includes(who) ? 'who wrote it' : f.prod === who ? 'who produced it' : 'who worked on it') : '';
    const src = kind === 'insider' ? `${P(who).name}, ${role}` : kind === 'informed' ? `${P(who).name}, ${pk(['who saw a test screening', 'who saw a rough cut', 'who has a friend in marketing', 'who sat in on a mix'])}` : kind === 'analyst' ? `An analyst at ${pk(ANALYSTS)}` : kind === 'tracking' ? pk(['Pre-release tracking', 'The weekly awareness survey', 'Social-media tracking']) : kind === 'exhibitor' ? pk(['A booker at AMV Theatres', 'A regional cinema owner', 'A booker at Royal Regal']) : kind === 'press' ? pk(COLUMNS).replace(/^./, x => x.toUpperCase()) : pk(HEARSAY).replace(/^./, x => x.toUpperCase());
    const rel = TIP_KIND[kind][2], right = r() < rel, claim = truth === 0 ? (r() < .5 ? 1 : -1) : right ? truth : -truth;
    const angle = pk(TIP_ANGLES[kind]), star = f.cast[0] !== undefined && P(f.cast[0]) ? P(f.cast[0]).name : 'the lead', dir = P(f.dir) ? P(f.dir).name : 'the director';
    const why = pk(TIP_WHY[angle][claim > 0 ? 0 : 1]).replace('{star}', star).replace('{dir}', dir).replace('{genre}', String(f.genre || 'drama').toLowerCase());
    const sure = ['hearsay', 'tracking'].includes(kind) ? pk(['suggests', 'says']) : rel > .8 ? pk(['swears', 'is certain']) : rel > .65 ? pk(['says', 'reckons', 'thinks']) : pk(['heard', 'is fairly sure', 'has a feeling']);
    out.push({ f: f.id, co: c.id, src, who, kind, rel, insider: kind === 'insider' ? 1 : 0, claim, why, sure, angle, opens: f.stageEnd });
  }
  // and one or two about the rest of the business: the numbers coming out next month
  const S2 = SECTORS.map(x => SECTOR[x[0]]).filter(sectorOpen);
  for (let j = 0; j < (r() < .4 ? 2 : 1) && S2.length; j++) { const s = S2.splice(Math.floor(r() * S2.length), 1)[0], fut = (sectorPrice(s, S.week + 4) / sectorPrice(s) - 1), kind = pk(['analyst', 'analyst', 'press', 'hearsay']), rel = TIP_KIND[kind][2], claim = (r() < rel ? 1 : -1) * (fut >= 0 ? 1 : -1);
    const W = SECTOR_WHY[s.drv] || SECTOR_WHY.box;
    out.push({ s: s.k, src: kind === 'analyst' ? `An analyst at ${pk(ANALYSTS)}` : kind === 'press' ? pk(COLUMNS).replace(/^./, x => x.toUpperCase()) : pk(['A friend in the industry', 'Someone at a conference', 'Your accountant\'s other client']), kind, rel, insider: 0, claim, sure: kind === 'hearsay' ? 'heard' : 'says', why: `${pk(W[claim > 0 ? 0 : 1])}; next month's numbers will ${claim > 0 ? 'beat expectations' : 'disappoint'}`, opens: S.week + 4 }); }
  return out;
}
function tipJudge(t) {
  if (t.s) { if (S.week < t.opens) return null; const s = SECTOR[t.s], ch = sectorPrice(s, t.opens) / sectorPrice(s, t.w) - 1; return (ch >= 0 ? 1 : -1) === t.claim; }
  const f = S.films[t.f]; if (!f || f.rel === null || S.week < f.rel + 2) return null; const truth = (f.hitRatio || 0) >= 1.4 ? 1 : (f.hitRatio || 0) < .8 ? -1 : 0; return truth === 0 ? null : truth === t.claim;
}
function tipsHTML() {
  const M = S.me, T = tipsThisWeek(); M.tipsSeen = M.tipsSeen || []; M.tipLog = M.tipLog || [];
  for (const t of T) { const k = S.week + ':' + (t.co ?? t.s); if (!M.tipsSeen.includes(k)) { M.tipsSeen.push(k); M.tipLog.push({ w: S.week, f: t.f, s: t.s, claim: t.claim, kind: t.kind, opens: t.opens }); } }
  if (M.tipsSeen.length > 60) M.tipsSeen.splice(0, M.tipsSeen.length - 60); if (M.tipLog.length > 200) M.tipLog.splice(0, M.tipLog.length - 200);
  const rec = {}; for (const t of M.tipLog) { const j = tipJudge(t); if (j === null) continue; const x = rec[t.kind] = rec[t.kind] || [0, 0]; x[1]++; if (j) x[0]++; }
  const line = t => { const k = TIP_KIND[t.kind]; if (t.s) { const s = SECTOR[t.s]; return `<li>${k[0]} <b>${esc(t.src)}</b> ${esc(t.sure || 'says')}: ${esc(s.name)} (${esc(s.tk)}), ${esc(t.why)}. <span class="muted small">${esc(k[1])} · right about ${Math.round(t.rel * 100)}% of the time</span> <button class="linkish" data-sec="buy:${t.s}">Buy</button></li>`; }
    const f = S.films[t.f], c = S.companies[t.co]; return `<li>${k[0]} <b>${esc(t.src)}</b> ${esc(t.sure || 'says')} ${fl(f.id)} (${esc(tickerOf(c))}) will <b class="${t.claim > 0 ? 'good' : 'bad'}">${t.claim > 0 ? 'open big' : 'flop'}</b>: ${esc(t.why)}. <span class="muted small">Opens ${fmtDate(t.opens, true)} · ${esc(k[1])}, usually right ${Math.round(t.rel * 100)}% of the time${t.insider ? ' · <b class="bad">trading on this is insider dealing</b>' : ''}</span> <a href="#" class="lk" data-mkt="sel:${c.id}">Trade ›</a></li>`; };
  return `<p class="small muted">Where tips come from matters. People who worked on a film know the most, and trading on what they tell you is a crime the regulator does look for. Published analysts and tracking surveys are fair game. Hearsay is a coin toss with a story attached.</p>
   <ul class="plain mnews">${T.map(line).join('') || '<li class="muted">Quiet week. Nothing big opening soon.</li>'}</ul>
   <h4>Track record</h4><table class="grid small"><thead><tr><th>Source</th><th class="n">Right</th><th class="n">Called</th></tr></thead><tbody>${Object.entries(TIP_KIND).map(([k, v]) => { const x = rec[k] || [0, 0]; return `<tr><td>${v[0]} ${esc(v[1])}</td><td class="n">${x[1] ? Math.round(x[0] / x[1] * 100) + '%' : '–'}</td><td class="n">${x[1]}</td></tr>`; }).join('')}</tbody></table><p class="small muted">Tips you've seen, judged once the film opened or the numbers came out.</p>`;
}

// ---- the economy, explained ----
function economyHTML() {
  const ev = macroNow(), lvl = macroAt(S.week), lvlY = macroAt(S.week - 52), y = S.year, rate = rateAt(y), infl = (cpi(y) / cpi(y - 1) - 1) * 100, M = S.me;
  const prod = S.active.length, prodY = typeof fieldIndex === 'function' ? fieldIndex('box', S.week) / Math.max(.01, fieldIndex('box', S.week - 52)) : 1;
  const mood = lvl >= 1.08 ? 'Euphoric' : lvl >= 1.02 ? 'Bullish' : lvl >= .98 ? 'Calm' : lvl >= .9 ? 'Nervous' : 'Panic';
  const wfx = typeof worldFx === 'function' ? worldFx() : {};
  const rates = Array.from({ length: 21 }, (_, i) => [y - 20 + i, rateAt(y - 20 + i)]), rmax = Math.max(...rates.map(x => x[1]), 1);
  const advice = [];
  if (rate >= 4) advice.push('Rates are high: term deposits pay well and loans are expensive. Borrow only for something that earns more.');
  else if (rate <= 1.5) advice.push('Rates are low: savings earn little, borrowing is cheap. Good years to finance a film or buy property.');
  if (lvl < .92) advice.push('The market is in a panic. Prices are low for everyone, including good companies; patient money does well here.');
  if (lvl > 1.08) advice.push('The market is euphoric. Prices are stretched: a good time to take some profit, not to borrow to buy.');
  if (infl > 4) advice.push(`Inflation is running at ${infl.toFixed(1)}%: cash in a current account is quietly shrinking.`);
  if ((wfx.jobs || 1) < 1) advice.push('Fewer productions are hiring: apply widely, and keep side income going.');
  if ((wfx.jobs || 1) > 1) advice.push('Productions are hiring: a good moment to push for better jobs and better rates.');
  if (!advice.length) advice.push('Nothing unusual. Spread your money: some saved, some invested, some for the next opportunity.');
  return `<div class="kpis mini"><div><span>Interest rate</span><b>${rate.toFixed(2)}%</b></div><div><span>Inflation</span><b>${infl.toFixed(1)}%</b></div><div><span>Market mood</span><b class="${lvl >= 1 ? 'good' : 'bad'}">${mood}</b></div><div><span>Market, 1 year</span><b>${pctS((lvl / lvlY - 1) * 100)}</b></div><div><span>Box office, 1 year</span><b>${pctS((prodY - 1) * 100)}</b></div><div><span>Films in production</span><b>${prod.toLocaleString()}</b></div></div>
   <div class="cols two"><section><h4>What it means for you</h4><ul class="plain small">${advice.map(a => `<li>💡 ${esc(a)}</li>`).join('')}</ul>
    <h4>In the news</h4>${ev.length ? `<ul class="plain small">${ev.map(e => `<li><b>${esc(e.name)}</b> <span class="muted">${esc(e.d)}</span></li>`).join('')}</ul>` : '<p class="small muted">No big story moving the market right now.</p>'}</section>
   <section><h4>Interest rates, twenty years</h4><div class="eco-bars">${rates.map(([yy, v]) => `<div title="${yy}: ${v.toFixed(2)}%"><i style="height:${Math.round(v / rmax * 100)}%"></i><small>${yy % 5 === 0 ? yy : ''}</small></div>`).join('')}</div>
    <p class="small muted">Savings ${savRate().toFixed(2)}% · 1-year deposit ${cdRate(52).toFixed(2)}% · your loan rate ${loanRate(M).toFixed(1)}%.</p></section></div>`;
}

// ---- the bank's private side ----
function sblLimit(M) { const nw = osNetWorth(); return Math.max(0, Math.round(nw.shares * .5)); }
// the people with money who back films: who they are, why they do it, and what they'll want for it
const ANGEL_KIND = {
  'Family office': ['Runs the money of a shipping family three generations deep.', 'Manages a fortune built on frozen food and invests it carefully.', 'Looks after a family that made its money in hotels and wants a little glamour.'],
  'Tech founder': ['Sold a payments app at thirty-one and is bored.', 'Built a dating app, sold it, and now wants to "disrupt storytelling".', 'Made a fortune in cloud software; has opinions about screenplays.'],
  'Hedge-fund manager': ['Runs a fund that bets against things; likes a film that bets on something.', 'Treats every cheque like a trade, with a stop-loss.', 'Collects art, wine and, lately, film credits.'],
  'Old money': ['Nobody is quite sure where the money came from. Nobody asks.', 'Owns a lot of farmland and a box at the opera.', 'Has backed one film a decade since before you were born.'],
  'Retired studio head': ['Ran a studio for twenty years and misses the phone ringing.', 'Greenlit three classics and a famous disaster; talks about the disaster more.', 'Left a studio with a golden parachute and a grudge.'],
  'Real-estate heir': ['Inherited half a downtown and a love of red carpets.', 'Builds car parks by day and watches art films by night.', 'Owns the building three studios rent offices in.'],
  'Music mogul': ['Signed four number-one acts and wants a soundtrack credit.', 'Ran a label through the vinyl, CD and streaming years and survived all three.', 'Started a festival in a field; now owns the field and the festival.'],
  'Sports star': ['Retired from the pitch with a good knee and a better accountant.', 'Won everything twice and now wants a different kind of trophy.', 'Has a production company with their name on it and nothing in it yet.'],
  'Restaurateur': ['Owns eleven restaurants and thinks a film is just a very long dinner service.', 'Built a burger chain from one van; loves an underdog.'],
  'Lottery winner': ['Won big, invested well, and still can\'t believe it.', 'Bought a ticket on a whim nine years ago. Now has a family office.']
};
const ANGEL_MOTIVE = { prestige: ['Wants awards', 'They want a film that wins things. Bring them something serious.'], returns: ['Wants returns', 'A spreadsheet person: your hits matter more than your pitch.'], taste: ['Backs what they love', 'Only funds the genres they love, and goes all in when they do.'], glamour: ['Wants the glamour', 'They want to be near famous people. Your fame helps.'], legacy: ['Backs new voices', 'They like backing people on the way up, not the established names.'], home: ['Loves their city', 'They want to see their city on screen.'] };
const ANGEL_ASK = { none: 'No strings. They trust you.', ep: 'An executive producer credit, in the opening titles.', cameo: 'A walk-on part. One line, maybe two.', premiere: 'Four seats at every premiere, and a photo with the cast.', nephew: 'A small part for a nephew who "has always wanted to act".', board: 'A seat on your company\'s board.', first: 'Their money comes out first, before anyone else is paid back.', notes: 'To see every cut, and to give notes on it.' };
function angelsOf(hub) {
  const r = hashRand(HUB_IDS.indexOf(hub) * 9973 + 5), N = NAMES[HUBS[hub].lang] || NAMES.en, out = [], used = new Set(), kinds = Object.keys(ANGEL_KIND), motives = Object.keys(ANGEL_MOTIVE), asks = Object.keys(ANGEL_ASK);
  const make = (i, r, isNew) => { const pk = L => L[Math.floor(r() * L.length)], g = r() < .5 ? 'M' : 'F', name = `${pk(N[g] || N.M)} ${pk(N.L)}`, kind = pk(kinds), likes = Object.keys(AMB).sort(() => r() - .5).slice(0, 2), worth = Math.round((20 + Math.pow(r(), 2) * 1500)) * 1e6;
    const motive = kind === 'Retired studio head' && r() < .6 ? 'prestige' : kind === 'Hedge-fund manager' && r() < .6 ? 'returns' : kind === 'Sports star' && r() < .5 ? 'glamour' : pk(motives);
    const ask = motive === 'glamour' ? pk(['cameo', 'premiere', 'nephew']) : motive === 'returns' ? pk(['first', 'board', 'none']) : motive === 'prestige' ? pk(['ep', 'notes', 'none']) : pk(asks);
    return { i, name, g, kind, bio: (() => { const B = ANGEL_KIND[kind], o = Math.floor(r() * B.length); for (let j = 0; j < B.length; j++) { const b = B[(o + j) % B.length]; if (!used.has(b)) { used.add(b); return b; } } return B[o]; })(), worth, likes, motive, ask, wait: 13 + Math.floor(r() * 4) * 9, appetite: .3 + r() * .6, ticket: Math.round((.1 + r() * .9) * Math.min(worth * .01, 5e6) / 5e4) * 5e4, isNew }; };
  for (let i = 0; i < 8; i++) out.push(make(i, r, 0));
  // new money arrives every year
  const rn = hashRand(HUB_IDS.indexOf(hub) * 7919 + S.year * 31 + 1); for (let i = 8; i < 10; i++) out.push(make(i, rn, 1));
  return out;
}
function angelKey(A) { return A.name + '|' + A.kind; }
// how hard the case is to make to this one
function angelDC(A) {
  const M = S.me, me = ME(), c = typeof myCo === 'function' ? myCo() : null, nw = osNetWorth().total, hits = c ? c.hits : 0, aw = (me.awards || []).length || 0;
  let dc = 18 - me.standing / 12 - hits * 2 - (nw > usd(1e6) ? 1 : 0) - A.appetite * 4 - ((M.love || []).some(g => A.likes.includes(g)) ? 1 : 0);
  if (A.motive === 'returns') dc -= hits;
  if (A.motive === 'prestige') dc -= Math.min(3, aw) - 1;
  if (A.motive === 'taste') dc += (M.love || []).some(g => A.likes.includes(g)) ? -3 : 2;
  if (A.motive === 'glamour') dc -= Math.min(3, (me.fame || 0) / 20) - 1;
  if (A.motive === 'legacy') dc -= me.standing < 40 ? 3 : -2;
  return Math.round(clamp(dc, 6, 19));
}
function angelOffer(A, why) {
  const amt = usd(A.ticket);
  inbox('note', `${A.name} is in, with terms`, `${why} ${A.name} (${A.kind.toLowerCase()}) will put ${fmtCash(amt)} into your company's next film, for a share of what it earns. They want one thing: ${ANGEL_ASK[A.ask].replace(/^./, x => x.toLowerCase())}`,
    { act: 'angeloffer', ang: angelKey(A), amt, ask: A.ask, choices: [{ k: 'yes', label: A.ask === 'none' ? 'Shake on it' : 'Agree to the terms' }, ...(A.ask === 'none' ? [] : [{ k: 'haggle', label: 'Push back on the terms', check: ['cha', 14] }]), { k: 'no', label: 'Thank them, and pass' }] });
}
function angelAct(a) {
  const M = S.me, c = typeof myCo === 'function' ? myCo() : null, A = angelsOf(M.hub)[+a.i]; if (!A || !c || c.closed !== null) return false;
  M.angelTry = M.angelTry || {}; const key = angelKey(A); if (S.week - (M.angelTry[key] ?? -999) < A.wait) return false; M.angelTry[key] = S.week;
  const ok = roll('fin', angelDC(A));
  if (ok) { const lunch = pickLine(['Lunch runs to four hours.', 'You pitch it on a golf course, badly, and they love it anyway.', 'They ask one question, about the ending, and nod.', 'Dinner at their house; the dog likes you, which seems to matter.', 'They read the script on the plane and call you from the runway.'], S.week + A.i); angelOffer(A, lunch); }
  else inbox('note', `${A.name} passes`, `${pickLine(['"I like you. I don\'t like the risk."', '"Bring me something when you\'ve had a hit."', '"Not this one. Not yet."', '"My accountant would kill me."', '"I only back what I\'d watch twice."'], S.week + A.i)} ${A.name} will take another meeting in ${Math.round(A.wait / 4.3)} months.`, { result: { ok, roll: M.lastRoll, t: 'A pass.' } });
  return true;
}
function angelPick(it, k) {
  if (it.act !== 'angeloffer') return false;
  const M = S.me, me = ME(); it.done = true; it.picked = k;
  if (k === 'no') { it.result = { t: 'You part as friends.' }; return true; }
  let amt = it.amt, ask = it.ask, t = 'Done. The money waits for your next greenlight.';
  if (k === 'haggle') { const ok = roll('cha', 14); if (ok) { amt = Math.round(amt * 1.15); ask = 'none'; t = 'They laugh, drop the condition and add a little more.'; } else { amt = Math.round(amt * .7); t = 'They keep the condition and trim the cheque.'; } it.result = { ok, roll: M.lastRoll, t }; }
  else it.result = { t };
  (M.angelFund = M.angelFund || []).push({ who: it.ang.split('|')[0], amt, w: S.week, ask });
  milestone(`${it.ang.split('|')[0]} backs your next film`, 'work'); return true;
}
// now and then the money finds you
function angelWeek() {
  const M = S.me, me = ME(), c = typeof myCo === 'function' ? myCo() : null; if (!c || c.closed !== null || S.week % 4) return;
  if ((M.inbox || []).some(x => x.act === 'angeloffer' && !x.done) || (M.angelFund || []).length >= 3) return;
  const pull = .02 + (c.hits || 0) * .02 + Math.max(0, me.standing - 40) / 600 + Math.max(0, (me.fame || 0) - 30) / 800; if (prnd() >= pull) return;
  const L = angelsOf(M.hub).filter(A => S.week - ((M.angelTry || {})[angelKey(A)] ?? -999) >= A.wait); if (!L.length) return;
  const A = L[Math.floor(prnd() * L.length)]; (M.angelTry = M.angelTry || {})[angelKey(A)] = S.week;
  angelOffer(A, pickLine([`A handwritten note arrives: "${A.name} would love to be part of whatever you do next."`, `${A.name}'s office calls. They saw your last film twice.`, `You're seated next to ${A.name} at a charity dinner. By dessert they've made an offer.`, `${A.name}'s assistant emails at 6am. Their boss "wants in".`], S.week));
}
// committed angel money goes into the next film's equity
function takeAngels() { const M = S.me, L = M.angelFund || []; if (!L.length) return 0; const t = L.reduce((s, x) => s + x.amt, 0); M.angelFund = []; return t; }
function privateBankHTML() {
  const M = S.me, B = bankOf(M), nw = osNetWorth(), lim = sblLimit(M), c = typeof myCo === 'function' ? myCo() : null, A = angelsOf(M.hub);
  const angels = A.map(a => { const wait = S.week - ((M.angelTry || {})[angelKey(a)] ?? -999) < a.wait, dc = angelDC(a), mv = ANGEL_MOTIVE[a.motive];
    return `<div class="angel"><div class="ang-top"><div><b>${esc(a.name)}</b>${a.isNew ? ' <span class="tag-new">New money</span>' : ''}<br><span class="muted small">${esc(a.kind)} · worth ${fmtM(a.worth / 1e6)}</span></div><span class="ang-dc" title="How hard the case is to make">DC ${dc}</span></div>
     <p class="small">${esc(a.bio)}</p><p class="small"><b>${esc(mv[0])}.</b> <span class="muted">${esc(mv[1])}</span></p>
     <p class="small"><span class="muted">Loves</span> ${a.likes.map(esc).join(', ')} · <span class="muted">Usual cheque</span> <b>${fmtCash(usd(a.ticket))}</b><br><span class="muted">Usually asks for</span> ${esc(ANGEL_ASK[a.ask])}</p>
     ${c && c.closed === null ? `<button class="btn-s ghost" data-angel="${a.i}" ${wait ? 'disabled' : ''}>${wait ? 'Recently met' : 'Ask for a meeting'}</button>` : '<span class="muted small">Needs a company</span>'}</div>`; }).join('');
  return `<div class="os-grid">${osCard('Securities-backed credit', `<p class="small">Borrow against your shares at ${(rateAt(S.year) + 1.5).toFixed(1)}%, up to half their value: ${fmtCash(lim)} available. If the market falls far enough, the bank sells your shares to cover it.</p><div class="bank-f"><button class="os-btn" data-bank="sbl" ${lim < 1000 ? 'disabled' : ''}>Draw ${fmtCash(Math.min(lim, Math.round(+UI.bkamt || 0)))} from the line</button></div>${B.sbl ? `<p class="small">Drawn: <b>${fmtCash(Math.round(B.sbl))}</b>. Interest comes out weekly; repay with the Repay button on Borrowing.</p>` : ''}`)}
   ${osCard('Committed to your next film', (M.angelFund || []).length ? `<ul class="os-list">${M.angelFund.map(x => `<li><b>${esc(x.who)}</b><span>${fmtCash(x.amt)}</span></li>${x.ask && x.ask !== 'none' ? `<li class="muted small">↳ ${esc(ANGEL_ASK[x.ask])}</li>` : ''}`).join('')}</ul><p class="small muted">It goes into the equity when you greenlight, and they take a share of what the film earns.</p>` : '<p class="small muted">Nothing committed yet. Ask for a meeting below, or have a hit and wait for the phone to ring.</p>')}</div>
   <h4>Angels and family offices in ${esc(hubName(M.hub))}</h4><p class="small muted">${nw.total >= usd(250000) || ME().standing >= 35 ? 'They\'ll take your call.' : 'They\'ll take your call when you\'re worth more or better known; you can still try.'} Each has their own reasons and their own price. The case you make rolls your Finance against the DC shown; hits, standing, awards, fame and shared taste move it, depending on what they care about. Two new names arrive each year.</p>
   <div class="angels">${angels}</div>`;
}
function fin2Click(t) { if (t.dataset.angel !== undefined) { const n0 = S.me.rollN || 0; doAct({ t: 'angel', i: +t.dataset.angel }); render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll); return true; } return false; }
