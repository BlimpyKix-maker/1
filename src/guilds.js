// ---------------- Guilds, contracts and strikes ----------------
// Every film market has three guild contracts, writers, performers and crew, each running about three years. Sixteen
// weeks before a contract runs out, talks open and the trades start quoting the odds of a strike. The odds move with
// how long since the last real raise, how militant that market's guilds are, streaming (residuals are what the
// fights are about now) and week-to-week noise from the bargaining table. If talks fail, the guild walks out:
//  - performers or crew: nothing shoots in that market (pre-production and shooting stop the clock), and the
//    companies that own stalled films pay to keep them alive;
//  - writers: development stops (no new scripts move, no rewrites), and writing jobs vanish from the board.
// Strikes end with a better deal than talks would have got. Every settlement lifts that guild's pay index, which
// every job board in the market pays from then on. Independents can sign an interim agreement and keep shooting.
// All the randomness is hashed from the world seed, so it never disturbs the world's or your dice.
const GUILD_KINDS = {
  wri: { n: 'Writers', base: .07, len: [10, 22], stages: [0] },
  act: { n: 'Performers', base: .05, len: [8, 18], stages: [1, 2] },
  crew: { n: 'Crew', base: .035, len: [4, 12], stages: [1, 2] }
};
const GUILD_NAMES = { US: { wri: 'Screenwriters Guild', act: 'Screen Performers Union', crew: 'Crew Alliance' }, UK: { wri: 'Writers\' Guild of Britain', act: 'Equity Players', crew: 'Broadcasting and Film Union' } };
function guildName(m, g) { return (GUILD_NAMES[m] || {})[g] || `${MARKETS[m].name} ${g === 'crew' ? 'Film Crew Union' : GUILD_KINDS[g].n + '\' Guild'}`; }
function guildOfCraft(c) { return c === 'wri' ? 'wri' : c === 'act' ? 'act' : ['cam', 'edt', 'des', 'fx', 'mus'].includes(c) ? 'crew' : null; }
function guildOfPost(p) { const t = tmplOf(p); return t && t.subs && t.subs.length ? guildOfCraft(SUB2C[t.subs[0]]) : null; }
function myGuild() { return guildOfCraft(MAIN[ME().role]); }
function gH(...k) { let h = (S.seed | 0) ^ 0x5bd1e995; for (const x of k) h = Math.imul(h ^ (typeof x === 'string' ? [...x].reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7) : x | 0), 2654435761); return hashRand(h >>> 0)(); }
function gMarkets() { return Object.keys(MARKETS).filter(m => HUB_IDS.some(h => HUBS[h].m === m)); }
function guildsInit() {
  if (S.gld) return; S.gld = {};
  for (const m of gMarkets()) { S.gld[m] = {}; for (const g in GUILD_KINDS) S.gld[m][g] = { exp: S.week + 6 + Math.floor(gH(m, g, 'exp') * 150), idx: 1, last: null, strike: null, mil: .6 + gH(m, 'mil') * .8 }; }
}
// the chance talks fail, as the trades would quote it this week
function strikeOdds(m, g, w = S.week) {
  const G = S.gld[m][g], K = GUILD_KINDS[g];
  const lag = G.last ? (G.last.raise < .04 ? .06 : G.last.strike ? -.05 : 0) : .02;   // a thin last deal makes people angry; a recent strike makes them tired
  const stream = S.year >= 2014 ? .04 : 0, wob = (gH(m, g, w) - .5) * .06;
  return clamp((K.base + lag + stream) * G.mil + wob, .02, .6);
}
function strikeOn(m, g) { const G = S.gld && S.gld[m] && S.gld[m][g]; return !!(G && G.strike && G.strike.to > S.week && G.strike.from <= S.week); }
function guildStatus(m, g) { const G = S.gld[m][g]; if (strikeOn(m, g)) return 'strike'; if (G.exp - S.week <= 16 && G.exp >= S.week) return 'talks'; return 'contract'; }
function guildWeek() {
  if (!S.me) return; guildsInit();
  const M = S.me, myM = HUBS[M.hub].m;
  for (const m in S.gld) for (const g in S.gld[m]) {
    const G = S.gld[m][g], K = GUILD_KINDS[g], name = guildName(m, g), big = m === myM || m === 'US';
    if (G.strike && G.strike.to === S.week) {   // the strike ends
      const raise = .05 + gH(m, g, 'win', S.week) * .04; G.idx *= 1 + raise - .03; G.last = { w: S.week, raise, strike: G.strike.to - G.strike.from }; G.exp = S.week + 156; G.strike = null;
      if (big) news('Industry', `The ${name} strike is over: a ${Math.round(raise * 100)}% raise and better residuals. Productions in ${MARKETS[m].name} restart.`);
      if (m === myM && g === 'wri') inbox('note', `The ${name} strike is over`, `A deal is signed in the small hours: ${Math.round(raise * 100)}% more, and better residuals. ${g === 'wri' ? 'Development opens up again.' : 'Productions restart on Monday; the board fills up again.'}`);
      continue;
    }
    if (G.strike) continue;
    if (G.exp - S.week === 16 && big) news('Industry', `Talks open between the studios and the ${name}. The contract runs out in sixteen weeks; the trades put the chance of a strike at ${Math.round(strikeOdds(m, g) * 100)}%.`);
    if (G.exp === S.week) {
      if (gH(m, g, 'roll', G.exp) < strikeOdds(m, g)) {
        const len = K.len[0] + Math.floor(gH(m, g, 'len', G.exp) * (K.len[1] - K.len[0] + 1));
        G.strike = { from: S.week + 1, to: S.week + 1 + len };
        if (big) news('Industry', `The ${name} goes on strike. ${g === 'wri' ? 'Writers\' rooms empty and development stops' : 'Sets go dark'} across ${MARKETS[m].name}.`);
        if (m === myM) guildStrikeStarts(m, g, len);
      } else {
        const raise = .03 + gH(m, g, 'deal', G.exp) * .03; G.idx *= 1 + raise - .03; G.last = { w: S.week, raise, strike: 0 }; G.exp = S.week + 156;
        if (big) news('Industry', `The ${name} reaches a deal without a strike: ${(raise * 100).toFixed(1)}% a year more for three years.`);
      }
    }
  }
  guildStall();
}
// what a strike does to productions, every week it lasts
function guildStall() {
  const M = S.me, halted = typeof worldFx === 'function' && worldFx().halt;
  const stop = {}; for (const m in S.gld) for (const g in S.gld[m]) if (strikeOn(m, g)) for (const st of GUILD_KINDS[g].stages) (stop[m] = stop[m] || new Set()).add(st);
  if (halted) for (const id of S.active) { const f = S.films[id]; if (f && f.interim && f.rel === null && f.hub === M.hub && f.stage >= 0 && f.stage < 4) f.stageEnd--; }   // signed the interim agreement: shoots on through the city's shutdown
  if (!Object.keys(stop).length) return;
  for (const id of S.active) {
    const f = S.films[id]; if (!f || f.rel !== null || f.stage < 0 || f.interim || !stop[f.m] || !stop[f.m].has(f.stage)) continue;
    if (halted && f.hub === M.hub) continue;   // already stopped by the city's strike
    f.stageEnd++; for (const p of keyPeople(f)) if (p && p.busy >= S.week) p.busy++;
    const c = f.co !== undefined && f.co !== null ? S.companies[f.co] : null; if (c && c.closed === null) c.cash -= f.budget * .004;   // keeping a stalled film alive
  }
}
function guildStrikeStarts(m, g, len) {
  const M = S.me, mine = myGuild() === g, film = g !== 'wri';
  if (film) { const W = M.world = M.world || { ev: [] }; if (!W.ev.some(e => e.k === 'walkout' && e.to > S.week)) W.ev.push({ k: 'walkout', from: S.week + 1, to: S.week + 1 + len, guild: g }); }
  const c = typeof myCo === 'function' ? myCo() : null, own = c ? c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage >= 0 && f.stage <= 2 && f.m === m) : [];
  const fee = own.reduce((t, f) => t + f.budget * .04, 0), lv = careerLevel(), ch = [];
  if (mine) ch.push({ k: 'g_picket', label: 'Walk the picket line' }, { k: 'g_abroad', label: 'Find work in another country until it\'s over', check: ['cha', 12] }, { k: 'g_scab', label: `Take a non-union job (about ${fmtCash(usd(1500 + 900 * lv))})` });
  if (own.length) ch.push({ k: 'g_interim', label: `Sign the interim agreement for ${own.length > 1 ? 'your films' : own[0].title}: agree the guild's terms now (${fmtM(fee)}) and keep shooting` });
  ch.push({ k: 'g_wait', label: mine || own.length ? 'Wait it out' : 'Noted' });
  inbox('guild', `The ${guildName(m, g)} walks out`, `Talks have collapsed. ${g === 'wri' ? 'Writers put down their pens: development stops and nobody is rewriting anything.' : 'Sets go dark across the country: nothing in pre-production or shooting moves until there\'s a deal.'} The last strike of this kind ran for months; the trades think ${len > 12 ? 'this one could be long' : 'it could be over in weeks'}.${own.length ? ` ${own.length > 1 ? 'Your films are' : own[0].title + ' is'} stalled, and a stalled film costs money every week.` : ''}`, { guild: m + ':' + g, fee, choices: ch });
}
function guildPick(it, k) {
  if (it.kind !== 'guild') return false;
  const M = S.me, me = ME(), [m, g] = (it.guild || ':').split(':'); it.done = true;
  if (k === 'g_picket') { me.standing = clamp(me.standing + 1.5, 0, 100); M.stress = clamp(M.stress + 3, 0, 100); M.picket = S.week;
    const q = typeof bestIn === 'function' ? bestIn(M.hub, ROLES, p => -Math.abs(p.standing - me.standing) + prnd() * 30) : null; if (q) meet(q.id, 'On the picket line', 8);
    it.result = { t: `Eight hours a day with a sign and a thermos. Nobody is paid, but everybody remembers who was there.${q ? ` You spend most of it talking to ${q.name}.` : ''}` }; return true; }
  if (k === 'g_abroad') { const ok = roll('cha', 12);
    if (ok) { const v = usd(1200 + 700 * careerLevel()); M.cash += v; it.result = { ok, roll: M.lastRoll, t: `A production abroad needs someone with your experience. ${fmtCash(v)} and a new city for a few weeks.` }; }
    else { M.cash -= usd(600); it.result = { ok, roll: M.lastRoll, t: 'You fly out on a promise that evaporates when you land. The flight home costs more than the flight out.' }; }
    return true; }
  if (k === 'g_scab') { const v = usd(1500 + 900 * careerLevel()); M.cash += v; me.standing = clamp(me.standing - 4, 0, 100); M.scab = S.week;
    for (const id of aliveKnown().filter(id => P(id) && guildOfCraft(MAIN[P(id).role]) === g).slice(0, 12)) addTie(me, P(id), -6);
    it.result = { t: `The money's real: ${fmtCash(v)}. So are the photos of you walking past the line. Some people won't forget.` }; return true; }
  if (k === 'g_interim') { const c = myCo(); if (!c) return true; const own = c.films.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage >= 0 && f.stage <= 2 && f.m === m);
    const fee = own.reduce((t, f) => t + f.budget * .04, 0); c.cash -= fee; for (const f of own) { f.interim = 1; if (f.fin) f.fin.log.push({ w: S.week, t: `Signed the ${guildName(m, g)} interim agreement (${fmtM(f.budget * .04)}): the film keeps shooting through the strike.`, tone: 'good' }); }
    me.standing = clamp(me.standing + .8, 0, 100);
    it.result = { t: `You sign the guild's terms before anyone else has. ${fmtM(fee)} more in pay and residuals, and your sets are the only ones working. Crews notice.` }; return true; }
  it.result = { t: 'You wait.' }; return true;
}
// a settled guild's pay index lifts what every job in that market pays
{ const _mp = makePost; makePost = function (t, f) {
  const p = _mp(t, f); if (!S.gld || !S.me) return p;
  const m = f ? f.m : HUBS[S.me.hub].m, g = guildOfPost(p), G = g && S.gld[m] && S.gld[m][g]; if (G && G.idx !== 1) p.rate = Math.round(p.rate * G.idx);
  return p; }; }
// the board loses writing jobs in a writers' strike, for everyone
{ const _rb = refreshBoard; refreshBoard = function () {
  const r = _rb.apply(this, arguments); const M = S.me; if (!M || !S.gld) return r;
  M.board = M.board.filter(p => { const f = p.film !== null && p.film !== undefined ? S.films[p.film] : null, m = f ? f.m : HUBS[M.hub].m, g = guildOfPost(p); return !(g && strikeOn(m, g) && (g === 'wri' || f)); });
  return r; }; }
// the random city walkout gives way to the guild cycle
{ const w = WORLD_EVENTS.find(e => e.k === 'walkout'); if (w) w.months = []; }
// Terminal: the guild desk
function guildPanel() {
  if (!S.gld) return '';
  const myM = HUBS[S.me.hub].m, L = gMarkets().sort((a, b) => (b === myM) - (a === myM) || MARKETS[b].size[2] - MARKETS[a].size[2]).slice(0, 6);
  const rows = L.flatMap(m => Object.keys(GUILD_KINDS).map(g => { const G = S.gld[m][g], st = guildStatus(m, g), odds = strikeOdds(m, g), wk = G.exp - S.week;
    return `<tr${m === myM ? ' class="tk-mine"' : ''}><td>${esc(MARKETS[m].name)}</td><td>${esc(guildName(m, g))}</td><td class="n">${st === 'strike' ? `<span class="dn">STRIKE wk ${S.week - G.strike.from + 1}</span>` : st === 'talks' ? `<span class="tk-warn">talks · ${wk}w</span>` : `${wk}w`}</td><td class="n ${odds > .3 && st !== 'contract' ? 'dn' : ''}">${st === 'strike' ? '' : st === 'talks' ? Math.round(odds * 100) + '%' : '<span class="tk-mut">' + Math.round(odds * 100) + '%</span>'}</td><td class="n">${G.idx.toFixed(3)}</td><td class="n tk-mut">${G.last ? (G.last.strike ? `strike ${G.last.strike}w, +${Math.round(G.last.raise * 100)}%` : `+${(G.last.raise * 100).toFixed(1)}%`) : ''}</td></tr>`; })).join('');
  return `<section class="tk-p tk-wide"><h4>GUILDS <span class="tk-sub">contracts, talks and strike risk · pay index lifts every job in the market</span></h4><table class="tk-t"><thead><tr><th>Market</th><th>Guild</th><th class="n">Expires</th><th class="n">Strike risk</th><th class="n">Pay idx</th><th class="n">Last deal</th></tr></thead><tbody>${rows}</tbody></table>
   <p class="tk-foot">A strike stops shooting (performers, crew) or development (writers) in that market, delays every release behind it, and costs the studios money each week: short their stock, long the films it pushes into a clear summer, or sign an interim deal and be the only set working.</p></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 || !S.gld ? h : h.slice(0, i) + guildPanel() + h.slice(i); }; }
