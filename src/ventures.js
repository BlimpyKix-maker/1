// ---------------- Ventures: backing the businesses around the business ----------------
// Beside shares and savings, the bank now shows a deal flow of private companies in the entertainment world:
// a cinema chain, a VFX house, a talent agency, a streaming start-up, a festival, a record label, a sports team.
// Each has a founder (a real person in this world), a stage, a price and a hidden quality you can only guess at,
// unless you do the homework (a finance roll; do it well and you see clearly, do it badly and you see nothing).
// Every industry has its weather: streaming was a gold rush in the 2010s and a hangover after, labels nearly died
// when music went free, cinemas shut in 2020. The climate shifts year to year and moves what you hold. Most young
// companies fail; a few return the lot many times over. Stakes come with perks that reach your own work (a VFX
// house finishes your films for less, a festival you part-own looks kindly on them, a chain gives them screens),
// and the more you back, the higher your standing as an investor: more deals, better ones, and a pin on your lapel.

const VENT_KINDS = {
  cinema: { label: 'Cinema chain', from: 1905, a: ['Starlight', 'Majestic', 'Palace', 'Odeon Row', 'Bijou', 'Electric', 'Regal', 'Roxy', 'Moonbeam'], b: ['Cinemas', 'Picture Houses', 'Screens', 'Theatres'], perk: 'Your company\'s films open about 4% bigger on their screens.', pitch: ['Twelve screens in towns the big chains forgot.', 'Reclining seats, real food and a bar: people come early.', 'Buying up shuttered single-screens and making them gorgeous.'] },
  vfx: { label: 'VFX and post house', from: 1975, a: ['Pixel', 'Mothlight', 'Glassworks', 'Framestore North', 'Ghost', 'Halide', 'Northern Lights'], b: ['Digital', 'FX', 'Post', 'Labs'], perk: 'Your own films cost about 5% less to make.', pitch: ['A hundred artists, two Oscar nominations and a render farm in a converted church.', 'Cheaper than the big houses and nearly as good.', 'De-ageing and crowd work for half the going rate.'] },
  agency: { label: 'Talent agency', from: 1920, a: ['Brightside', 'Keystone', 'Vantage', 'North Star', 'Paragon', 'Marquee'], b: ['Talent', 'Artists', 'Management', 'Agency'], perk: 'Stars cost your films about 8% less.', pitch: ['Breakaway agents from a big firm, taking their best clients with them.', 'A boutique for writers and directors only.', 'They sign people at drama schools before anyone else does.'] },
  streaming: { label: 'Streaming start-up', from: 1998, a: ['Flick', 'Reel', 'Binge', 'Lumen', 'Kino', 'Popcorn', 'Arc'], b: ['Stream', 'Play', 'TV', '+', 'Now'], perk: 'Buyers circle your films: a little more buzz on each.', pitch: ['A streamer for one genre, done properly.', 'Cheap to run, ad-supported, and growing ten percent a month.', 'Classic films restored, with a loyal audience nobody else serves.'] },
  label: { label: 'Record label', from: 1915, a: ['Velvet', 'Blue Hour', 'Sidewalk', 'Paper Moon', 'Echo', 'Wax'], b: ['Records', 'Recordings', 'Music', 'Sound'], perk: 'Better soundtracks: a touch more quality on your films.', pitch: ['Three acts on the edge of breaking.', 'Back catalogue nobody bothered to license, and now everybody wants.', 'A label run like a family. The artists never leave.'] },
  rental: { label: 'Camera rental house', from: 1920, a: ['Panaglide', 'Lensworks', 'Grip & Glass', 'Dolly Bros', 'Ironside'], b: ['Rentals', 'Camera', 'Equipment', 'Kit'], perk: 'Trade prices: gear and kit cost you 5% less.', pitch: ['Every working DP in town owes them a favour.', 'Old glass, rehoused, rented to people who care.', 'They follow productions to wherever the tax credit is.'] },
  festival: { label: 'Film festival', from: 1932, a: ['Harbour', 'Sundown', 'Lighthouse', 'Midnight', 'Riverside', 'Frontier'], b: ['Film Festival', 'Fest', 'Screenings', 'International'], perk: 'Programmers look kindly on your films: a little better odds at festivals.', pitch: ['A young festival with a good reputation and no money.', 'A week by the sea, ten thousand tickets and sponsors queueing.', 'A genre festival with fans who travel.'] },
  sports: { label: 'Sports team', from: 1900, a: ['Harbour City', 'Valley', 'Metro', 'Ironworks', 'Riverside', 'Northside'], b: ['FC', 'Athletic', 'Rovers', 'United', 'Ballers'], perk: 'A box at every home game, and people you want to meet in it.', pitch: ['A lower-league side with a new stadium and a broadcast deal.', 'The city\'s second team, about to be the first.', 'A women\'s team selling out every game.'] },
  games: { label: 'Games studio', from: 1975, a: ['Pixel Moth', 'Neon Tiger', 'Lucky Cat', 'Sidequest', 'Blinkfish'], b: ['Games', 'Interactive', 'Studio', 'Play'], perk: 'None to speak of. Just the chance of a hit.', pitch: ['Their first game sold a million on a budget of nothing.', 'A team from a big studio, making the game they were never allowed to.', 'A cosy farming game with a cult following.'] },
  podcast: { label: 'Podcast network', from: 2006, a: ['Loud', 'Earful', 'Hush', 'Static', 'Mic Drop'], b: ['Audio', 'Network', 'Media', 'Pods'], perk: 'Their hosts mention you: a little standing every week.', pitch: ['Twenty shows, one of them huge.', 'True crime, comedy and film talk, with a waiting list of advertisers.', 'They own the film-nerd audience.'] },
  school: { label: 'Film school', from: 1925, a: ['Lumière', 'Golden Gate', 'Northern', 'Harbour', 'Kinetic'], b: ['Film School', 'Academy', 'Institute', 'Workshop'], perk: 'Cheaper courses, and students who want to crew for you.', pitch: ['A two-year course with an alumni list that opens doors.', 'Night classes for working crew, always full.', 'A summer school with a famous teacher.'] }
};
const VENT_STAGES = [['Seed', 1, 12], ['Series A', 4, 13], ['Growth', 16, 14]];   // label, ticket multiple, diligence DC
// how hot each corner of the business is, year by year: [from, to, warmth] windows plus a little yearly weather
const VENT_CLIMATE = {
  cinema: [[1905, 1948, .6], [1949, 1972, -.4], [1975, 2001, .4], [2002, 2019, 0], [2020, 2021, -1.4], [2022, 2099, -.2]],
  vfx: [[1975, 1989, .3], [1990, 2010, .7], [2011, 2015, -.6], [2016, 2099, .1]],
  agency: [[1920, 2099, .2]],
  streaming: [[1998, 2006, -.5], [2007, 2013, .4], [2014, 2021, 1.1], [2022, 2024, -1], [2025, 2099, .1]],
  label: [[1915, 1958, .2], [1959, 1999, .7], [2000, 2013, -1], [2014, 2099, .5]],
  rental: [[1920, 2007, .2], [2008, 2010, -.6], [2011, 2099, .2]],
  festival: [[1932, 2019, .2], [2020, 2021, -1.2], [2022, 2099, .1]],
  sports: [[1900, 2099, .35]],
  games: [[1975, 1982, .9], [1983, 1985, -1.3], [1986, 1994, .3], [1995, 2021, .7], [2022, 2024, -.6], [2025, 2099, .3]],
  podcast: [[2006, 2016, .2], [2017, 2021, 1], [2022, 2099, -.5]],
  school: [[1925, 2099, .15]]
};
const VENT_WHY = { streaming: { hot: 'Everyone is building a streamer.', cold: 'The streaming bubble burst; subscribers are cancelling.' }, cinema: { hot: 'Audiences are flocking to cinemas.', cold: 'Cinemas are empty and closing.' }, label: { hot: 'Records sell like never before.', cold: 'Music went free online; labels are bleeding.' }, games: { hot: 'Games are the hottest thing in entertainment.', cold: 'The games market has crashed.' }, podcast: { hot: 'Podcast money is everywhere.', cold: 'Podcast advertising dried up.' }, vfx: { hot: 'Effects-heavy films are booming.', cold: 'VFX houses are being squeezed to nothing.' } };
function ventClimate(k, y = S.year) {
  let w = 0; for (const [a, b, v] of VENT_CLIMATE[k] || []) if (y >= a && y <= b) w = v;
  const n = hashRand(y * 131 + Object.keys(VENT_KINDS).indexOf(k) * 7919)();
  return w + (n - .5) * .8;
}
function ventClimateLabel(c) { return c >= .7 ? ['hot', 'good'] : c >= .2 ? ['warm', 'good'] : c > -.3 ? ['steady', ''] : c > -.8 ? ['cool', 'bad'] : ['cold', 'bad']; }

// ---- the investor you are ----
const INVESTOR_TIERS = [['Saver', 0, 0, 0], ['Dabbler', 5e3, 0, 0], ['Backer', 5e4, 0, 0], ['Angel', 2.5e5, 1, 0], ['Patron', 2e6, 3, 0], ['Mogul', 2e7, 3, 1], ['Kingmaker', 2e8, 4, 2]];   // name, invested (today's money), ventures held, exits
function ventOf(M = S.me) { return M.vent || (M.vent = { deals: [], held: [], next: 0, exits: 0 }); }
function ventValue(v) { return Math.round(v.val * v.pct); }
function ventPortfolio() { const V = ventOf(); return V.held.filter(v => v.status === 'live').reduce((t, v) => t + ventValue(v), 0); }
const INV_MEMO = { k: '', v: null };
function investorTier() {
  const key = S.week + ':' + Math.round(S.me.cash) + ':' + (S.me.vent ? S.me.vent.held.length + ':' + S.me.vent.exits : 0); if (INV_MEMO.k === key && INV_MEMO.S === S) return INV_MEMO.v;
  INV_MEMO.k = key; INV_MEMO.S = S; return (INV_MEMO.v = investorTier_());
}
function investorTier_() {
  const M = S.me, nw = osNetWorth(), V = ventOf(), live = V.held.filter(v => v.status === 'live').length;
  const inv = nw.shares + ventPortfolio() + (M.coinv || []).filter(x => !x.done && !x.sold).reduce((t, x) => t + (x.amt || 0), 0);
  let t = 0; for (let i = 1; i < INVESTOR_TIERS.length; i++) { const [, need, n, ex] = INVESTOR_TIERS[i]; if (inv >= usd(need) && (live + V.exits) >= n && V.exits >= ex) t = i; }
  return { t, name: INVESTOR_TIERS[t][0], inv, next: INVESTOR_TIERS[t + 1] || null };
}
function tierPerks(t) { return [['Two small deals a month'], ['Two small deals a month'], ['Deal flow: two private deals a month'], ['Three deals a month; founders return your calls'], ['Growth-stage deals; +1 on money checks; invitations to investors\' dinners'], ['Five deals a month; the trades call you a mogul'], ['Six deals a month; you decide who gets funded']][t]; }

// ---- the deal flow ----
function ventFounder(k) {
  const role = { cinema: 'producer', vfx: 'editor', agency: 'producer', streaming: 'producer', label: 'composer', rental: 'dp', festival: 'producer', sports: 'producer', games: 'designer', podcast: 'writer', school: 'director' }[k] || 'producer';
  const L = S.people.filter(p => !p.dead && p.role === role && p.hub === S.me.hub && p.id !== ME().id && S.year - p.born > 24 && S.year - p.born < 64);
  return L.length ? L[Math.floor(prnd() * L.length)] : null;
}
function ventMakeDeal(stage) {
  const ks = Object.keys(VENT_KINDS).filter(k => S.year >= VENT_KINDS[k].from), k = ks[Math.floor(prnd() * ks.length)], K = VENT_KINDS[k];
  const p = ventFounder(k), clim = ventClimate(k);
  const q = clamp((prnd() + prnd() + prnd()) / 1.5 - 1 + clim * .15, -1, 1);   // hidden: how good it really is
  const ticket = usd([5000, 25000, 200000][stage] * (.6 + prnd() * .9));
  const val = Math.round(ticket * [8, 14, 30][stage] * (1 + clim * .35) * (.7 + prnd() * .6));
  const name = `${K.a[Math.floor(prnd() * K.a.length)]} ${K.b[Math.floor(prnd() * K.b.length)]}`;
  return { id: 'v' + S.week + '_' + Math.floor(prnd() * 1e6), k, name, stage, ticket, val, q, founder: p ? p.id : null, pitch: K.pitch[Math.floor(prnd() * K.pitch.length)], exp: S.week + 4 + Math.floor(prnd() * 4), dd: null };
}
function ventRefresh() {
  const V = ventOf(), T = investorTier().t; V.next = S.week + 4;
  V.deals = V.deals.filter(d => d.exp > S.week && !d.taken);
  const n = [2, 2, 2, 3, 4, 5, 6][T] - V.deals.length;
  for (let i = 0; i < n; i++) V.deals.push(ventMakeDeal(T >= 4 && prnd() < .35 ? 2 : T >= 2 && prnd() < .45 ? 1 : 0));
}
// homework: a finance roll. Done well, you know how good it is; done badly, you learn nothing (and you know it)
function ventDD(a) {
  const M = S.me, d = ventOf().deals.find(x => x.id === a.id); if (!d || d.dd) return false;
  if (M.energy < 6) return false; M.energy -= 6;
  const ok = roll('fin', VENT_STAGES[d.stage][2]), r = M.lastRoll;
  d.dd = ok ? (r.crit > 0 ? 'exact' : 'band') : 'fog';
  d.ddText = ventReadout(d);
  return true;
}
function ventReadout(d) {
  if (d.dd === 'fog') return 'The numbers don\'t add up either way. You can\'t tell if it\'s good.';
  const b = d.q >= .35 ? 'Strong: real revenue, a founder who knows the business.' : d.q >= 0 ? 'Decent: promising, with holes.' : d.q >= -.4 ? 'Shaky: the projections are optimistic.' : 'Bad: they\'re burning cash and hiding it.';
  return d.dd === 'exact' ? `${b} (You found everything: about ${Math.round((d.q + 1) * 50)} out of 100.)` : b;
}
function ventInvest(a) {
  const M = S.me, V = ventOf(), d = V.deals.find(x => x.id === a.id); if (!d || d.taken) return false;
  const amt = Math.round(d.ticket * [1, 2, 4][a.size || 0]); if (M.cash < amt) return false;
  M.cash -= amt; d.taken = 1;
  const pct = amt / (d.val + amt);
  V.held.push({ id: d.id, k: d.k, name: d.name, stage: d.stage, amt, pct, val: d.val + amt, w: S.week, q: d.q, founder: d.founder, status: 'live', log: [{ w: S.week, t: `You put in ${fmtCash(amt)} for ${(pct * 100).toFixed(pct < .01 ? 2 : 1)}%.` }], peak: d.val + amt });
  if (d.founder !== null && typeof meet === 'function') meet(d.founder, `You backed ${d.name}`, 10);
  diary(`Money: you invest ${fmtCash(amt)} in ${d.name}.`);
  milestone(`Backed ${d.name}`, 'money');
  return true;
}
function ventSell(a) {   // a secondary sale: someone will buy your stake, at a discount
  const M = S.me, v = ventOf().held.find(x => x.id === a.id && x.status === 'live'); if (!v) return false;
  const got = Math.round(ventValue(v) * (.6 + Math.max(0, v.q) * .2)); M.cash += got; v.status = 'sold'; v.got = got; v.log.push({ w: S.week, t: `Sold your stake for ${fmtCash(got)}.` });
  diary(`Money: you sell your stake in ${v.name} for ${fmtCash(got)}.`);
  return true;
}
function ventAct(a) { return a.k === 'dd' ? ventDD(a) : a.k === 'invest' ? ventInvest(a) : a.k === 'sell' ? ventSell(a) : false; }

// ---- the week: values move with the company and the weather; once a month something happens ----
function ventWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  const V = ventOf(); if (V.next <= S.week) ventRefresh();
  for (const v of V.held.filter(x => x.status === 'live')) {
    const clim = ventClimate(v.k), drift = .003 * v.q + .002 * clim, noise = (prnd() - .5) * .05;
    v.val = Math.max(1, Math.round(v.val * Math.exp(drift + noise))); v.peak = Math.max(v.peak || v.val, v.val);
    if ((S.week - v.w) % 4 !== 3) continue;
    const age = (S.week - v.w) / 52, x = prnd();
    const pFail = clamp(.016 + Math.max(0, -v.q) * .05 - clim * .004 + (v.val < v.peak * .4 ? .03 : 0) + (v.stage === 0 ? .006 : 0), .003, .1);
    const pExit = clamp((.002 + v.stage * .003 + Math.max(0, v.q) * .01 + clim * .002) * Math.min(1, age / 3), 0, .04);
    const pRound = clamp(.03 + v.q * .02 + clim * .01, .01, .08);
    if (x < pFail) { v.status = 'dead'; v.log.push({ w: S.week, t: 'Closed down.' }); inbox('news', `${v.name} shuts down`, `${pickLine(['The money ran out before the customers came.', 'The founders fell out, then the bank did.', 'A bigger rival copied them and undercut them.', 'The market turned and they couldn\'t turn with it.'], v.amt)} Your ${fmtCash(v.amt)} is gone.`); M.stress = clamp(M.stress + 3, 0, 100); continue; }
    if (x < pFail + pExit) { const mult = Math.exp(v.q * 2 + clim * .4 + (prnd() + prnd() - 1) * .9); const got = Math.round(ventValue(v) * Math.max(.3, mult)); v.status = 'exit'; v.got = got; V.exits++; M.cash += got; v.log.push({ w: S.week, t: `Bought out: you get ${fmtCash(got)}.` });
      const x2 = got / v.amt; inbox('news', `${v.name} is bought`, `${pickLine(['A giant buys them whole.', 'A rival pays a premium to make them go away.', 'A private equity fund takes them over.', 'They list on the exchange; you sell into the opening.'], v.amt)} Your ${fmtCash(v.amt)} comes back as <b>${fmtCash(got)}</b> (${x2.toFixed(1)}×).`);
      if (x2 >= 3) { milestone(`${v.name} returned ${x2.toFixed(0)}× your money`, 'money'); ME().standing = clamp(ME().standing + Math.min(4, x2 / 3), 0, 100); }
      diary(`Money: ${v.name} is bought out. You get ${fmtCash(got)}.`); continue; }
    if (x < pFail + pExit + pRound) { const brk = v.q > .55 && prnd() < .18, up = Math.exp(v.q * .8 + clim * .3 + (prnd() - .45) * .7) * (brk ? 3 : 1), dil = .82 + prnd() * .1; v.val = Math.round(v.val * up / dil); v.pct *= dil; v.stage = Math.min(2, v.stage + (up > 1 ? 1 : 0));
      if (brk) inbox('news', `${v.name} breaks out`, `Everyone wants in. The new round values them at ${fmtCash(v.val)}; your stake is worth ${fmtCash(ventValue(v))}.`);
      v.log.push({ w: S.week, t: brk ? 'A breakout year: the new round triples the price.' : up > 1 ? `Raised a new round at a higher price (×${up.toFixed(1)}). You own a little less of something worth more.` : 'A down round: new money at a lower price.' }); continue; }
    if (prnd() < .12) ventAsk(v);
  }
}
// the founder rings: what they need, and what you mean to do about it
const VENT_ASKS = [
  { k: 'intro', t: 'needs an introduction', d: 'They need someone big in the business on side, and they think you know people.', o: [['help', 'Make the call', 'cha', 12], ['work', 'Roll up your sleeves', 'fin', 13], ['no', 'Stay out of it']] },
  { k: 'bridge', t: 'is running out of cash', d: 'Payroll is due and the next round isn\'t closed. They ask the investors to put a little more in.', o: [['more', 'Put more in', null, 0], ['sale', 'Push them to sell now', 'com', 13], ['no', 'Let the others decide']] },
  { k: 'bid', t: 'has an offer for the company', d: 'A bigger company has made an early offer. The founders want to know what the investors think.', o: [['take', 'Take the money', null, 0], ['play', 'Play the bidders off', 'com', 14], ['hold', 'Hold out for more']] },
  { k: 'pivot', t: 'wants to change direction', d: 'What they built isn\'t working. They want to try something wilder.', o: [['back', 'Back the pivot', 'tas', 12], ['steady', 'Talk them into fixing what they have', 'pack', 13], ['no', 'Shrug']] }
];
function ventAsk(v) {
  const A = VENT_ASKS[Math.floor(prnd() * VENT_ASKS.length)];
  inbox('vent', `${v.name} ${A.t}`, `${A.d}${v.founder !== null && S.people[v.founder] ? ` (${S.people[v.founder].name} is the founder.)` : ''}`, { vent: v.id, va: A.k, person: v.founder, choices: A.o.map(([k, l, s, dc]) => ({ k, label: l + (s ? ` · ${checkLabel(s, dc)}` : ''), check: s ? [s, dc] : undefined })) });
}
function ventPick(it, k) {
  if (it.kind !== 'vent') return false;
  const M = S.me, v = ventOf().held.find(x => x.id === it.vent); it.done = true;
  if (!v || v.status !== 'live') { it.result = { t: 'It no longer matters.' }; return true; }
  const A = VENT_ASKS.find(x => x.k === it.va), o = A && A.o.find(x => x[0] === k); if (!o) { it.result = { t: 'You let it go.' }; return true; }
  const ok = o[2] ? roll(o[2], o[3]) : true, r = o[2] ? M.lastRoll : null; let t = '';
  switch (it.va + ':' + k) {
    case 'intro:help': if (ok) { v.q = clamp(v.q + .2, -1, 1); v.val = Math.round(v.val * 1.08); t = 'The call goes well. A distribution deal follows within the month.'; if (v.founder !== null) trust(v.founder, 6); } else { t = 'The person you call doesn\'t call back. The founder thanks you anyway.'; } break;
    case 'intro:work': if (ok) { v.q = clamp(v.q + .3, -1, 1); v.val = Math.round(v.val * 1.12); M.energy = clamp(M.energy - 10, 0, 100); t = 'You spend three evenings in their spreadsheets and find a fortune in waste.'; } else { M.energy = clamp(M.energy - 10, 0, 100); t = 'You spend three evenings in their spreadsheets and come out more confused than they were.'; } break;
    case 'bridge:more': { const add = Math.round(v.amt * .25); if (M.cash >= add) { M.cash -= add; v.amt += add; v.pct += add / v.val; v.q = clamp(v.q + .05, -1, 1); t = `You wire ${fmtCash(add)}. They make payroll, and your stake grows.`; v.log.push({ w: S.week, t: `Bridged with ${fmtCash(add)}.` }); } else { v.val = Math.round(v.val * .8); t = 'You don\'t have it. Someone else steps in, on worse terms for you.'; } break; }
    case 'bridge:sale': if (ok) { const got = Math.round(ventValue(v) * .85); M.cash += got; v.status = 'exit'; v.got = got; ventOf().exits++; t = `You find them a buyer in a fortnight. You get ${fmtCash(got)} back.`; v.log.push({ w: S.week, t: `Sold in a hurry: ${fmtCash(got)}.` }); } else { v.val = Math.round(v.val * .7); t = 'Nobody bites. The rumour that they\'re for sale makes everything worse.'; } break;
    case 'bridge:no': v.val = Math.round(v.val * (v.q > 0 ? .9 : .7)); v.pct *= .85; t = 'The others save it, and take a bigger share for the trouble.'; break;
    case 'bid:take': { const got = Math.round(ventValue(v) * (1.1 + Math.max(0, v.q) * .4)); M.cash += got; v.status = 'exit'; v.got = got; ventOf().exits++; t = `The deal closes. You get ${fmtCash(got)}.`; v.log.push({ w: S.week, t: `Sold to a bidder: ${fmtCash(got)}.` }); break; }
    case 'bid:play': if (ok) { const got = Math.round(ventValue(v) * (1.5 + Math.max(0, v.q) * .6)); M.cash += got; v.status = 'exit'; v.got = got; ventOf().exits++; t = `Two bidders, one weekend, a lot of nerve. You get ${fmtCash(got)}.`; v.log.push({ w: S.week, t: `Auctioned: ${fmtCash(got)}.` }); } else { t = 'You push too hard and both bidders walk.'; v.val = Math.round(v.val * .9); } break;
    case 'bid:hold': if (prnd() < .5 + v.q * .3) { v.val = Math.round(v.val * 1.25); t = 'You were right: the company is worth more on its own. For now.'; } else { v.val = Math.round(v.val * .8); t = 'The bidder buys a competitor instead.'; } break;
    case 'pivot:back': if (ok) { v.q = clamp(v.q + .45, -1, 1); t = 'The new idea catches. Everyone says they always believed in it.'; } else { v.q = clamp(v.q - .25, -1, 1); v.val = Math.round(v.val * .8); t = 'The new idea is wilder and worse.'; } break;
    case 'pivot:steady': if (ok) { v.q = clamp(v.q + .2, -1, 1); t = 'They fix what they had. It\'s not exciting, and it works.'; } else { t = 'They pivot anyway, without you.'; v.q = clamp(v.q + (prnd() - .5) * .6, -1, 1); } break;
    default: t = 'You let them get on with it.';
  }
  it.result = { ok: o[2] ? ok : null, roll: r, t }; return true;
}

// ---- perks that reach your own work ----
function ventPerk(k) { const v = ventOf().held.find(x => x.k === k && x.status === 'live' && (x.pct >= .02 || ventValue(x) >= usd(25000))); return !!v; }
{ const _edge = companyEdge;
  companyEdge = function (c, o) {
    const e = _edge(c, o); if (!S.me || c.id !== S.me.company) return e;
    if (ventPerk('vfx')) e.budgetMul *= .95;
    if (ventPerk('agency')) e.leadMul *= .92;
    if (ventPerk('label')) e.qBonus += 1;
    if (ventPerk('streaming')) e.hookBonus += 3;
    return e;
  };
}
if (typeof wxBoxMul === 'function') { const _wx = wxBoxMul; wxBoxMul = function (f) { const m = _wx(f); return S.me && f.co === S.me.company && ventPerk('cinema') ? m * 1.04 : m; }; }
if (typeof festSelOdds === 'function') { const _fs = festSelOdds; festSelOdds = function (F, f) { const p = _fs(F, f); return S.me && ventPerk('festival') && myFilms().includes(f) ? Math.min(.9, p + .03) : p; }; }
if (typeof bzDiscount === 'function') { const _bd = bzDiscount; bzDiscount = function () { return Math.min(.5, _bd() + (ventPerk('rental') ? .05 : 0)); }; }
{ const _cm = checkMods;
  checkMods = function (stat) { const r = _cm(stat); if (stat === 'fin' && S.me && S.me.vent && investorTier().t >= 4) { r.mod += 1; r.why.push(`${investorTier().name} +1`); } return r; };
}
function ventPerkWeek() {
  const M = S.me, me = ME(); if (!M.vent) return;
  if (ventPerk('podcast')) me.standing = clamp(me.standing + .04, 0, 100);
  if (ventPerk('sports') && S.week % 3 === 0) { const q = bestIn(M.hub, ['producer', 'director', 'actor'], q => q.standing + prnd() * 40); if (q) { meet(q.id, 'In your box at the game', 4); } }
  if (investorTier().t >= 4 && S.week % 13 === 5) { const q = bestIn(M.hub, ['producer', 'director'], q => q.standing + prnd() * 30); if (q) { meet(q.id, 'An investors\' dinner', 6); inbox('note', 'An investors\' dinner', `Eleven people, one long table, a wine nobody can pronounce. You end up next to ${pl(q.id)}.`, { person: q.id }); } }
}

// ---- the page ----
function venturesHTML() {
  const M = S.me, V = ventOf(), T = investorTier(), live = V.held.filter(v => v.status === 'live'), done = V.held.filter(v => v.status !== 'live');
  const ks = Object.keys(VENT_KINDS).filter(k => S.year >= VENT_KINDS[k].from);
  const climate = ks.map(k => { const c = ventClimate(k), [l, cl] = ventClimateLabel(c), why = VENT_WHY[k] && (c >= .7 ? VENT_WHY[k].hot : c <= -.8 ? VENT_WHY[k].cold : ''); return `<li><b>${esc(VENT_KINDS[k].label)}</b><span class="chip ${cl}">${l}</span>${why ? `<span class="muted small">${esc(why)}</span>` : ''}</li>`; }).join('');
  const deal = d => { const K = VENT_KINDS[d.k], p = d.founder !== null ? S.people[d.founder] : null, st = VENT_STAGES[d.stage], [cl, cc] = ventClimateLabel(ventClimate(d.k));
    return `<div class="vent"><div class="v-top">${investPinSVG(d.stage + 2, 22)}<div><b>${esc(d.name)}</b><br><span class="muted small">${esc(K.label)} · ${st[0]} · climate <span class="${cc}">${cl}</span></span></div></div>
      <p class="small">“${esc(d.pitch)}”${p ? ` <span class="muted">— ${pl(p.id)}, founder</span>` : ''}</p>
      <p class="small"><span class="muted">Valued at</span> ${fmtCash(d.val)} · <span class="muted">smallest cheque</span> <b>${fmtCash(d.ticket)}</b> · <span class="muted">open until</span> ${fmtDate(d.exp, true)}</p>
      <p class="small"><span class="muted">Perk:</span> ${esc(K.perk)}</p>
      ${d.dd ? `<p class="small ${d.dd === 'fog' ? 'muted' : ''}"><b>Your homework:</b> ${esc(d.ddText)}</p>` : `<button class="btn-s ghost" data-vent="dd:${d.id}"${M.energy < 6 ? ' disabled' : ''}>Do the homework · ${checkLabel('fin', st[2])}</button>`}
      <div class="bank-f">${[0, 1, 2].map(s => { const amt = Math.round(d.ticket * [1, 2, 4][s]); return `<button class="os-btn" data-vent="invest:${d.id}:${s}"${M.cash < amt ? ' disabled' : ''}>Invest ${fmtCash(amt)} <span class="muted">(${(amt / (d.val + amt) * 100).toFixed(1)}%)</span></button>`; }).join('')}</div></div>`; };
  const held = v => { const val = ventValue(v), x = val / v.amt, last = v.log[v.log.length - 1];
    return `<tr><td><b>${esc(v.name)}</b><br><span class="muted small">${esc(VENT_KINDS[v.k].label)}${ventPerk(v.k) ? ' · <span class="good">perk on</span>' : ''}</span></td><td>${(v.pct * 100).toFixed(v.pct < .01 ? 2 : 1)}%</td><td>${fmtCash(v.amt)}</td><td class="${x >= 1 ? 'good' : 'bad'}">${fmtCash(val)}<br><span class="small">${x.toFixed(2)}×</span></td><td class="small muted">${esc(last.t)}</td><td><button class="linkish" data-vent="sell:${v.id}">Sell</button></td></tr>`; };
  return `<div class="inv-head">${investPinSVG(T.t, 44)}<div><p class="eyebrow">Investor standing</p><h3>${esc(T.name)}</h3><p class="small">${esc(tierPerks(T.t)[0])}. Invested: <b>${fmtCash(Math.round(T.inv))}</b> across shares, private stakes and films${V.exits ? ` · ${V.exits} exit${V.exits === 1 ? '' : 's'}` : ''}.</p>${T.next ? `<p class="small muted">Next: <b>${T.next[0]}</b> at ${fmtCash(usd(T.next[1]))} invested${T.next[2] ? `, ${T.next[2]} ventures` : ''}${T.next[3] ? `, ${T.next[3]} exit${T.next[3] > 1 ? 's' : ''}` : ''}. ${esc(tierPerks(T.t + 1)[0])}.</p>` : ''}</div></div>
   <div class="os-grid">${osCard('The weather, this year', `<ul class="os-list">${climate}</ul><p class="small muted">The climate changes every year; it moves prices and the odds of a sale or a failure.</p>`)}
   ${done.length ? osCard('Finished', `<ul class="os-list">${done.slice(-8).reverse().map(v => `<li><b>${esc(v.name)}</b><span class="muted">${v.status === 'dead' ? 'closed' : v.status === 'sold' ? 'sold your stake' : 'bought out'}</span><span class="${(v.got || 0) >= v.amt ? 'good' : 'bad'}">${fmtCash(v.amt)} → ${fmtCash(v.got || 0)}</span></li>`).join('')}</ul>`) : ''}</div>
   <h4>Your stakes <span class="count">${live.length} · worth ${fmtCash(ventPortfolio())}</span></h4>
   ${live.length ? `<table class="os-table"><thead><tr><th>Company</th><th>Own</th><th>Put in</th><th>Worth</th><th>Latest</th><th></th></tr></thead><tbody>${live.map(held).join('')}</tbody></table>` : '<p class="small muted">Nothing yet. Most young companies fail; a few pay for all the rest.</p>'}
   <h4>Deal flow <span class="count">${V.deals.filter(d => !d.taken).length} open · new deals ${fmtDate(V.next, true)}</span></h4>
   <div class="vents">${V.deals.filter(d => !d.taken).map(deal).join('') || '<p class="muted">Nothing on the table this month.</p>'}</div>`;
}
// a lapel pin for the investor you are: tin, bronze, silver, gold, platinum, a diamond
function investPinSVG(t, w = 24) {
  const C = ['#B9B5AE', '#B9B5AE', '#C47E3E', '#C9CCD6', '#D4AF37', '#E5E4E2', '#9BE7FF'][t] || '#B9B5AE';
  return `<svg viewBox="0 0 24 24" width="${w}" height="${w}" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="${C}" stroke="${mixHex(C, '#000000', .35)}" stroke-width="1.4"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="${mixHex(C, '#FFFFFF', .5)}" stroke-width="1"/>${t >= 6 ? '<path d="M12 5 l4 5 l-4 9 l-4 -9 z" fill="#FFFFFF" opacity=".9"/>' : `<text x="12" y="15.5" font-size="9" text-anchor="middle" font-family="sans-serif" font-weight="700" fill="${mixHex(C, '#000000', .55)}">${'·SDBAPMK'[t] || ''}</text>`}</svg>`;
}
function ventClick(t) {
  if (!t.dataset.vent) return false;
  const [k, id, s] = t.dataset.vent.split(':'), n0 = S.me.rollN || 0;
  doAct({ t: 'vent', k, id, size: +s || 0 }); render(true);
  if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll);
  return true;
}

// the bank, in tabs: accounts, ventures, private banking, history
{ const _osBank = osBank;
  osBank = function () {
    const tab = UI.bkTab || 'acct', T = investorTier();
    const tabs = [['acct', 'Accounts'], ['vent', `Ventures${ventOf().deals.filter(d => !d.taken).length ? ` (${ventOf().deals.filter(d => !d.taken).length})` : ''}`], ['private', 'Private banking'], ['hist', 'History']];
    UI.bkSplit = true;
    let body;
    try { body = tab === 'vent' ? venturesHTML() : tab === 'private' ? (typeof privateBankHTML === 'function' ? privateBankHTML() : '') : tab === 'hist' ? (typeof moneyHistoryHTML === 'function' ? moneyHistoryHTML() : '') : _osBank(); }
    finally { UI.bkSplit = false; }
    return `<div class="os-tools bk-tabs">${tabs.map(([k, l]) => `<button class="os-btn${tab === k ? ' on' : ''}" data-bktab="${k}">${l}</button>`).join('')}<span class="inv-chip" title="Investor standing">${investPinSVG(T.t, 18)} ${esc(T.name)}</span></div>${body}`;
  };
}
function bkTabClick(t) { if (t.dataset.bktab) { UI.bkTab = t.dataset.bktab; render(true); return true; } return false; }
