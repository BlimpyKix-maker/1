// ---------------- The side industries, from sources (Round 19) ----------------
// Music, podcasts, online video, the stage, television and the boardroom, recalibrated against the research in
// docs/RESEARCH.md (Round 19) and given the moments people in those fields actually tell stories about. The money
// is meant to be honest rather than generous: most songs are heard by a few hundred people, a sync is a few
// thousand dollars unless a studio or an advert wants it, most podcasts stop before episode ten, short clips pay
// pennies, most fringe runs lose money, and board fees are taxed like any other income.
// Rolls use the player's dice (prnd/roll) in the weekly close and in decisions, so replays agree.

// ---- music: syncs priced by use (student film, indie, TV, studio, advert), and the score commission that can follow ----
// All-in fees for an unknown writer (docs/RESEARCH.md, Music §2): a known song costs more, so fame raises the price.
const SYNC_FEE = { student: 500, indie: 5000, mid: 10000, tv: 8000, studio: 20000, advert: 50000 };
const SYNC_SPIKE = { student: 60, indie: 1500, mid: 3000, tv: 8000, studio: 20000, advert: 30000 };   // streams the week it airs
const SYNC_WHERE = { student: ['the end credits of a graduation film', 'a festival short about a lighthouse keeper'], indie: ['the closing credits', 'a montage of a long drive home', 'a slow-motion goodbye'],
  mid: ['the first kiss', 'the opening scene', 'a car chase, somehow'], tv: ['the last two minutes of an episode', 'a "previously on" that makes people search for it'],
  studio: ['the montage everyone will talk about', 'the trailer and the film both'], advert: ['a car advert that runs all through the playoffs', 'a phone advert on every bus shelter in town'] };
syncWeek = function () {
  const M = S.me, me = ME(); if (!M.works || S.week % 4 !== 1) return;
  for (const w of M.works.filter(x => x.type === 'song' && x.q >= 40 && !x.syncW)) {
    const p = .003 + (w.q - 40) / 4000 + Math.log10((w.units || 0) + 10) / 400 + (M.agent ? .006 : 0);
    if (prnd() > p) continue;
    const films = S.films.filter(f => f.rel === null && f.stage >= 2 && f.stage <= 3 && f.hub === M.hub), shows = typeof tvAll === 'function' ? tvAll().filter(s => tvOnAir(s, S.year) && s.m === (HUBS[M.hub] || {}).m) : [];
    let use, f = null, s = null;
    if (w.q >= 60 && prnd() < .12) use = 'advert';
    else if (shows.length && (prnd() < .4 || !films.length)) { use = 'tv'; s = shows[Math.floor(prnd() * shows.length)]; }
    else if (films.length) { f = films[Math.floor(prnd() * films.length)]; use = f.tier === 1 ? 'studio' : f.tier === 2 ? 'mid' : f.budget < .3 ? 'student' : 'indie'; }
    else continue;
    const trailer = use === 'studio' && prnd() < .15;
    let fee = SYNC_FEE[use] * (.6 + w.q / 125) * (1 + Math.min(1.5, (me.fame || 0) / 40)) + (trailer ? 25000 : 0);
    fee = usd(Math.round(fee / 50) * 50);
    const cut = typeof pathCut === 'function' ? pathCut('library') : 1; fee = Math.round(fee * (.5 + .5 * cut));   // a publisher takes its share of the song half
    const spike = Math.round(SYNC_SPIKE[use] * (w.q / 70)), streamPay = Math.round(spike * payNow(M.deal ? (M.deal.rate || .0011) : .003));
    w.syncW = S.week; w.sync = use; M.cash += fee - taxOn(fee) + streamPay; w.earned = (w.earned || 0) + fee + streamPay; w.units = (w.units || 0) + spike; w.v0 = Math.round((w.v0 || 0) + spike * .02);
    me.fame = clamp((me.fame || 0) + (use === 'studio' || use === 'advert' ? .8 : .3), 0, 100);
    const where = f ? f.title : s ? s.title : 'an advert', what = pickLine(SYNC_WHERE[use], w.q + S.week);
    milestone(`${w.title} licensed into ${where}`, 'work');
    inbox('news', use === 'advert' ? `${w.title} sells a car` : `Your song is in ${where}`, `${use === 'advert' ? 'An agency licenses' : f ? `A music supervisor on ${f.title} licenses` : `${s.title} licenses`} ${w.title} for ${what}${trailer ? ', and the trailer people want it too' : ''}. ${fmtCash(fee)} all in (the recording and the song), before tax.${spike > 500 ? ` The week it airs, ${spike.toLocaleString()} people go looking for it.` : ''}`);
    // the bridge into scoring: an indie director who liked the song asks what else you can do
    if (f && ['indie', 'mid', 'student'].includes(use) && f.stage === 3 && !M.commish && prnd() < .25 && P(f.dir)) {
      const pay = usd(use === 'mid' ? 30000 : use === 'indie' ? 10000 : 2000);
      inbox('scorecomm', `${P(f.dir).name} wants a score`, `The director of ${f.title} heard ${w.title} in the cut and wants the whole score in the same voice. ${fmtCash(pay)} as a package: the musicians, the studio and the mix come out of it. Eight weeks, paid in halves.`, { film: f.id, pay, choices: [{ k: 'sc_yes', label: `Take it (${fmtCash(pay)})` }, { k: 'sc_no', label: 'Not now' }] });
    }
  }
};
function commishWeek() {
  const M = S.me, me = ME(), C = M.commish; if (!C || S.week < C.due) return; M.commish = null;
  const f = S.films[C.film], ok = roll('score', 13), half = C.pay - Math.round(C.pay / 2);
  M.cash += half - taxOn(half);
  if (f) { if (ok) { f.crew = f.crew || {}; f.crew.mus = me.id; if (!me.credits.includes(f.id)) me.credits.push(f.id); }
    (f.events = f.events || []).push({ w: S.week, t: ok ? `${me.name} delivers the score.` : `${me.name}'s score is mostly replaced by the temp track.` }); }
  me.standing = clamp(me.standing + (ok ? 1.5 : .3), 0, 100); growSub(me, 'score', ok ? .25 : .1);
  if (ok) milestone(`Scored ${f ? f.title : 'a feature'}`, 'work');
  inbox('note', ok ? 'The score is in' : 'The temp track wins', ok ? `${f ? f.title : 'The film'} has your music under every scene that matters. Your name goes on the credits as composer.` : `The director loves two of your cues and keeps the temp track for the rest. You're paid in full; the credit is "additional music".`);
}
// a label deal's royalty statement, twice a year: what was sold, and what is still owed before you see a cent
function statementWeek() {
  const M = S.me, D = M.deal; if (!D || S.week % 26 !== 13 || S.week - (D.w || 0) < 20) return;
  if (D.rec < D.adv) inbox('note', 'Your royalty statement', `${fmtCash(D.rec)} recouped of a ${fmtCash(D.adv)} advance. The account is unrecouped: your share pays back the label before you see another cent. Most accounts never get there.`);
  else if (!D.recouped) { D.recouped = S.week; milestone('Recouped the record advance', 'money'); inbox('note', 'Recouped', 'The statement has a number in the right-hand column for the first time. The advance is paid back; from here the royalties are yours.'); }
}
// the first release, and how quiet it is
function firstReleaseWeek() {
  const M = S.me, F = M.sideF = M.sideF || {}; if (F.first || !M.works) return;
  const w = M.works.find(x => x.type === 'song'); if (!w || S.week - w.rel < 1) return; F.first = 1;
  if (w.units < 60) inbox('note', `${w.units} plays`, `${w.title} has been out a week: ${w.units} plays, ${w.units > 7 ? 'about half of them' : 'most of them'} you, your mother and the friend who promised. Nearly half of all tracks on the platforms are played ten times or fewer in a year. It's a start.`);
}
// session work: three hours on someone else's record at union scale, the steadiest money in music
const SESSION_SCALE = 475;
function sessionWeek() {
  const M = S.me, me = ME(); if (S.week % 13 !== 4 || pending().some(x => x.kind === 'session') || prnd() > .6) return;
  if (!(me.role === 'composer' || M.field === 'music') || skillOf(me, 'song') < 8) return;
  const lead = me.standing >= 40, pay = usd(SESSION_SCALE * (lead ? 2 : 1));
  inbox('session', 'A session call', `${pickLine(['A producer', 'A singer', 'An arranger'], S.week)} needs ${lead ? 'a leader for' : 'one more player on'} a three-hour session on ${pickLine(['Thursday', 'Saturday', 'Monday'], S.week + 1)}. Scale is ${fmtCash(pay)}, plus pension.`, { pay, choices: [{ k: 'ss_yes', label: `Take it (${fmtCash(pay)})` }, { k: 'ss_no', label: 'Pass' }] });
}
// a club on the door: you carry the risk of an empty room, and the venue takes a slice of the merch it didn't sell
function doorWeek() {
  const M = S.me, fol = followers('spinly'); if (fol < 150 || S.week % 7 !== 2 || pending().some(x => x.kind === 'doorgig') || prnd() > .5) return;
  inbox('doorgig', 'A Friday at a club, on the door', `A club will give you a Friday: no guarantee, you take 80% of the door after the room's costs (${fmtCash(usd(250))}). If ${Math.round(fol * .02 + 8)} people come, you'll do fine. If they don't, you pay the sound engineer.`, { choices: [{ k: 'dg_yes', label: 'Take the night' }, { k: 'dg_no', label: 'Pass' }] });
}

// ---- podcasts: the episode-seven wall ----
function podShow(t) { return String(t || '').split(', ep.')[0]; }
function podWall(w) {
  const M = S.me, show = podShow(w.title), eps = M.works.filter(x => x.type === 'podcast' && podShow(x.title) === show), F = M.sideF = M.sideF || {};
  F.wall = F.wall || {}; if (F.wall[show] || eps.length < 6 || eps.length > 9) return;
  const last = eps.slice(-3).map(x => x.v0 || 0); if (!(last[2] <= last[0] * 1.1)) return;
  F.wall[show] = S.week;
  inbox('podwall', `${show}: episode ${eps.length}`, `Downloads have flattened: ${last.join(', ')} in the first week of the last three episodes. Your co-host suggests "taking a little break". Most shows never reach episode ten, and this is usually where they stop.`, { show, choices: [{ k: 'pw_keep', label: 'Keep going, every week' }, { k: 'pw_break', label: 'A six-week break' }, { k: 'pw_end', label: 'End the show' }] });
}

// ---- online video: pennies for short clips, a demonetisation week, and the grind ----
if (PLATFORMS.blip) PLATFORMS.blip.pay = .00012;   // short clips: $0.03–0.30 per thousand views (was $0.50)
const VID_PAY = PLATFORMS.vidwire ? PLATFORMS.vidwire.pay : .0035;
function demonWindow(y) { const r = hashRand(((S.seed | 0) + y * 131) >>> 0); return r() < .7 ? { from: Math.floor(r() * 44), len: 4 + Math.floor(r() * 4) } : null; }
function videoWeek() {
  const M = S.me, me = ME(), yw = S.week % 52, D = demonWindow(Math.floor(S.week / 52)), on = !!D && yw >= D.from && yw < D.from + D.len;
  if (PLATFORMS.vidwire) PLATFORMS.vidwire.pay = on ? VID_PAY / 2 : VID_PAY;
  if (D && yw === D.from && S.year >= 2012) { news('Industry', 'Vidwire changes its advertising rules overnight. Creators across the platform report their pay per view halved.', {});
    if ((M.works || []).some(w => w.plat === 'vidwire')) inbox('note', 'The demonetisation week', 'A policy change nobody announced: half your videos are "not suitable for most advertisers" this morning. Pay per thousand views has halved. Nobody at the platform answers email.'); }
  const F = M.sideF = M.sideF || {};
  for (const w of (M.works || []).filter(x => x.type === 'blip' && S.week - x.rel === 1 && x.v0 > 1e6 && !x.viralNote)) { w.viralNote = 1; M.fol.vidwire = (M.fol.vidwire || 0) * 1.02;
    inbox('note', `${(w.v0 / 1e6).toFixed(1)} million views`, `${w.title} has been watched ${w.v0.toLocaleString()} times in a week. The creator fund pays ${fmtCash(w.earned)}. Your long-form channel picks up 2%. Strangers know your face.`); }
  // the grind: three or more uploads a month, month after month
  const recent = (M.works || []).filter(x => (x.type === 'video' || x.type === 'blip') && S.week - x.rel < 4).length;
  F.grind = recent >= 3 ? (F.grind || 0) + 1 : Math.max(0, (F.grind || 0) - 1);
  if (M.editor && S.week < M.editor) F.grind = Math.min(F.grind, 6);
  if (F.grind >= 8 && S.week % 4 === 0) M.stress = clamp(M.stress + 2, 0, 100);
  if (F.grind >= 8 && M.stress > 60 && S.week - (F.quitAsk ?? -999) > 52 && !pending().some(x => x.kind === 'quitcheck')) { F.quitAsk = S.week;
    inbox('quitcheck', 'Thinking about quitting', `${F.grind} weeks of uploading on schedule. You film, cut, post, read the comments, and start again. Half of the creators you know have burned out at least once; a third are thinking of stopping.`, { choices: [{ k: 'qc_off', label: 'A month off' }, { k: 'qc_edit', label: `Hire an editor (${fmtCash(usd(600))} a week)` }, { k: 'qc_on', label: 'Keep going' }] }); }
  if (M.editor && S.week < M.editor) M.cash -= usd(600);
}

// ---- the stage: runs that go on while the houses hold, closing notices, transfers and the film rights ----
function stageStart(w) {
  const M = S.me, me = ME(), musical = w.type === 'musical', seats = musical ? 180 : 90, price = usd(musical ? 22 : 15);
  if (w.q >= 82 && prnd() < .35) { w.fill = Math.min(1, (w.fill || 0) + .2); me.standing = clamp(me.standing + 1, 0, 100); w.fiveStar = 1;
    inbox('note', 'Five stars', `A critic gives ${w.title} five stars. The last nights sell out within the hour, and someone who produces in the big theatres has asked for two seats.`); }
  if ((w.fill || 0) >= .55) { w.run = { wk: 2, low: 0, high: 0, seats, price, max: 26, open: 1 }; diary(`${w.title} keeps running while the houses hold.`); }
}
function stageWeek() {
  const M = S.me, me = ME();
  for (const w of (M.works || []).filter(x => x.run && x.run.open)) {
    const R0 = w.run; R0.wk++;
    w.fill = clamp((w.fill || .5) + (w.q - 62) / 300 - R0.wk * .004 + pgauss() * .05, .05, 1);
    const sold = Math.round(R0.seats * 8 * w.fill), gross = sold * R0.price, cost = R0.seats * 8 * R0.price * .42, net = Math.round((gross - cost) * .6);
    M.cash += net > 0 ? net - taxOn(net) : net; w.earned = (w.earned || 0) + net; w.units = (w.units || 0) + sold;
    R0.low = w.fill < .7 ? R0.low + 1 : 0; R0.high = w.fill >= .9 ? R0.high + 1 : 0;
    if (R0.high >= 3 && !R0.ext && !pending().some(x => x.kind === 'stageext')) { R0.ext = 1;
      inbox('stageext', `${w.title} is selling out`, `Three weeks of full houses. A commercial producer wants to move it to a ${R0.seats * 2.5 | 0}-seat theatre: better seats, higher prices, and a running cost that eats you alive if the crowds don't follow.`, { work: w.id, choices: [{ k: 'se_move', label: 'Transfer' }, { k: 'se_stay', label: 'Stay and extend eight weeks' }, { k: 'se_close', label: 'Close on a high' }] }); }
    if (R0.low >= 4 && !R0.closeW) { R0.closeW = S.week + 2; inbox('note', 'Closing notice', `Four weeks under 70% full. The notice goes up on the callboard: two more weeks, then ${w.title} closes. The cast take it better than you do.`); }
    if ((R0.closeW && S.week >= R0.closeW) || R0.wk >= R0.max) stageClose(w);
  }
  // a film option on a play: most lapse
  const O = M.stageOpt; if (O && S.week >= O.until) { M.stageOpt = null; const w = M.works[O.work];
    if (prnd() < .3) { const buy = usd(75000); M.cash += buy - taxOn(buy); milestone(`Sold the film rights to ${w ? w.title : 'your play'}`, 'money'); inbox('note', 'They buy it', `The producer exercises the option: ${fmtCash(buy)} for the film rights to ${w ? w.title : 'your play'}. Someone else will write the screenplay unless you ask very nicely.`); }
    else inbox('note', 'The option lapses', `A year on, the producer lets the option on ${w ? w.title : 'your play'} lapse. The rights come home; you keep the money.`); }
}
function stageClose(w) {
  const M = S.me, R0 = w.run; R0.open = 0;
  diary(`${w.title} closes after ${R0.wk} weeks: ${w.units.toLocaleString()} tickets, ${fmtCash(w.earned)} to you, ${w.earned < 0 ? 'which is to say it cost you' : 'which is more than most'}.`);
  if (R0.wk >= 12) milestone(`${w.title} ran ${R0.wk} weeks`, 'work');
  if (R0.wk >= 12 && w.fill >= .75 && !M.stageOpt && prnd() < .25) inbox('stageopt', `An option on ${w.title}`, `A film producer saw ${w.title} and wants an option on the screen rights: ${fmtCash(usd(10000))} now, and the right to buy them within a year.`, { work: w.id, choices: [{ k: 'so_yes', label: `Take the option (${fmtCash(usd(10000))})` }, { k: 'so_no', label: 'Keep the rights' }] });
}

// ---- television: script fees, the created-by royalty, and the week before renewals ----
{ const ADJ = { tv_staffwriter: 1100, tv_storyed: 1700, tv_epdir: 3800 };   // guild minimums: about $5.5k and $8.5k a week; an hour episode
  for (const t of ODD_JOBS) if (ADJ[t.k]) t.rate = ADJ[t.k]; }
{ const _p = tvepPick; tvepPick = function (it, k) {
  if (it.kind !== 'tvep') return false; const r = _p.apply(this, arguments), M = S.me, e = (M.tvEps || [])[(M.tvEps || []).length - 1], s = typeof tvShow === 'function' ? tvShow(it.show) : null;
  if (e && e.y === S.year && it.result) { const half = s && ['sitcom', 'animation'].includes(s.g), fee = Math.round(usd(half ? 32000 : 47000) * (k === 'share' ? .5 : 1)); M.cash += fee - taxOn(fee); it.result.t += ` Script fee: ${fmtCash(fee)}${k === 'share' ? ' (shared)' : ''}.`; }
  return r; }; }
{ const _n = tvNewSeason; tvNewSeason = function (s) { const r = _n.apply(this, arguments), M = S.me, z = s.seas[s.seas.length - 1];
  if (z && (M.shows || []).includes(s)) { const roy = usd(2500) * z.eps; M.cash += roy - taxOn(roy); diary(`Money: the created-by royalty on season ${s.seas.length} of ${s.title}, ${fmtCash(roy)} before tax.`); }
  return r; }; }
function renewalWaitWeek() {
  const M = S.me, d = dateOf(S.week), d2 = dateOf(S.week + 1); if (!(d.getUTCMonth() === 3 && d2.getUTCMonth() === 4)) return;
  const L = (M.shows || []).filter(x => x.status === 'on air'); if (L.length) inbox('note', 'Waiting for the call', `Upfronts are next week. ${L.map(x => x.title).join(' and ')} ${L.length > 1 ? 'are' : 'is'} on the bubble until somebody at the network says otherwise. You check your phone in the shower.`);
}

// ---- the boardroom: say-on-pay for your own package, and activists at your companies ----
function sayOnPayWeek() {
  const M = S.me, me = ME(), P0 = M.pkg, j = typeof corpJob === 'function' ? corpJob() : null; if (!P0 || !j || j.id !== P0.job || S.week % 52 !== 20) return;
  const c = S.companies[P0.co]; if (!c || c.closed !== null || !listedCos().includes(c)) return;
  const rich = (P0.para > 0 ? .5 : 0) + (P0.bonus > 1.5 ? 1 : 0) + (P0.grant * mktPrice(c) > P0.salary * 5 ? 1 : 0), perf = clamp(chg(c, 52) / 100, -.3, .3);
  const yes = Math.round(clamp(91 - 10 * rich + perf * 20 - (M.payFlag ? 5 : 0) + pgauss() * 4, 20, 99)); M.payFlag = 0;
  diary(`${c.name}'s annual meeting: ${yes}% of shareholders vote for your pay.`);
  if (yes < 50) { me.standing = clamp(me.standing - 3, 0, 100); news('Company', `${c.name}'s shareholders vote down ${me.name}'s pay package.`, { company: c.id }); }
  if (yes < 70) inbox('paycomm', `${100 - yes}% against`, `The morning after the annual meeting, the papers lead with it: ${100 - yes}% of ${c.name}'s shareholders voted against your pay. The compensation committee wants to know what you'd like to do.`, { co: c.id, choices: [{ k: 'pc_cut', label: 'Take a cut to the bonus' }, { k: 'pc_talk', label: 'Meet the big shareholders' }, { k: 'pc_ride', label: 'Say nothing' }] });
}
const ACT_DEMANDS = [['sell', 'sell the company or break it up'], ['sell', 'sell the company or break it up'], ['cuts', 'cut costs by a fifth'], ['cash', 'hand the cash pile back to shareholders'], ['ceo', 'replace the chief executive']];
function activistWeek() {
  const M = S.me; if (S.week % 52 !== 33 || typeof myBoards !== 'function') return;
  for (const id in myBoards()) { const c = S.companies[+id]; if (!c || c.closed !== null || pending().some(x => x.kind === 'activist')) continue;
    if (prnd() > (chg(c, 52) < -15 ? .1 : .05)) continue;
    const [dk, d] = ACT_DEMANDS[Math.floor(prnd() * ACT_DEMANDS.length)];
    inbox('activist', `A letter to ${c.name}'s board`, `A fund that has quietly bought 5% of ${c.name} writes to the board: ${d}, or it will run its own candidates for your seats at the next meeting. Most of these fights end in a settlement: two seats and a committee chair.`, { co: c.id, dk, choices: [{ k: 'ac_settle', label: 'Settle: give them two seats' }, { k: 'ac_fight', label: 'Fight it to a vote' }, { k: 'ac_side', label: 'Side with the fund' }] }); }
}

WEEK_HOOKS.push(commishWeek, statementWeek, firstReleaseWeek, sessionWeek, doorWeek, videoWeek, stageWeek, renewalWaitWeek, sayOnPayWeek, activistWeek);
{ const _rw = releaseWork; releaseWork = function (a) { const n0 = (S.me.works || []).length, ok = _rw.apply(this, arguments); const w = ok && S.me.works[n0];
  if (w && w.plat === 'stage') stageStart(w);
  if (w && w.type === 'podcast') { const F = S.me.sideF || {}; if (F.podBreak && S.week < F.podBreak) w.v0 = Math.round(w.v0 * .8); if (F.grit && S.week < F.grit) w.v0 = Math.round(w.v0 * 1.15); podWall(w); }
  return ok; }; }

function sidePick(it, k) {
  const M = S.me, me = ME(), F = M.sideF = M.sideF || {};
  if (it.kind === 'scorecomm') { it.done = true; if (k !== 'sc_yes') { it.result = { t: 'You say you\'re flattered and busy. Both are true.' }; return true; }
    const h = Math.round(it.pay / 2); M.cash += h - taxOn(h); M.commish = { film: it.film, pay: it.pay, due: S.week + 8 }; it.result = { t: `Half up front, ${fmtCash(h)}. A locked cut arrives by courier with "spotting notes" in the margins.` }; return true; }
  if (it.kind === 'session') { it.done = true; if (k !== 'ss_yes') { it.result = { t: 'They find someone else. They always do.' }; return true; }
    M.cash += it.pay - taxOn(it.pay); M.energy = clamp(M.energy - 8, 0, 100); growSub(me, 'song', .05); it.result = { t: `Three hours, two songs, one take you're proud of. ${fmtCash(it.pay)}, and the producer saves your number.` }; return true; }
  if (it.kind === 'doorgig') { it.done = true; if (k !== 'dg_yes') { it.result = { t: 'You stay home and write instead.' }; return true; }
    const fol = followers('spinly'), crowd = Math.round(clamp(fol * .02 * (.6 + prnd() * .8) + 8, 6, 220)), door = crowd * usd(12), costs = usd(250), share = Math.round((door - costs) * .8);
    const merch = Math.round(crowd * .12) * usd(20), venueCut = Math.round(merch * .2);
    M.cash += share + merch - venueCut; M.fol.spinly = (M.fol.spinly || 0) + crowd * .3; M.energy = clamp(M.energy - 10, 0, 100);
    it.result = { t: `${crowd} people. The door takes ${fmtCash(door)}; after the room's ${fmtCash(costs)} your 80% is ${fmtCash(share)}${share < 0 ? ', so you pay the sound engineer out of your own pocket' : ''}. You sell ${fmtCash(merch)} of shirts and the venue takes ${fmtCash(venueCut)} of it for standing near the table.` }; return true; }
  if (it.kind === 'podwall') { it.done = true;
    if (k === 'pw_keep') { F.grit = S.week + 26; M.stress = clamp(M.stress + 4, 0, 100); it.result = { t: 'You book the next three guests before you can change your mind. Episode ten is going to happen.' }; }
    else if (k === 'pw_break') { F.podBreak = S.week + 6; M.fol.podhaus = (M.fol.podhaus || 0) * .9; M.stress = clamp(M.stress - 6, 0, 100); it.result = { t: 'A short note to listeners: back in six weeks. Some of them will be.' }; }
    else { (F.ended = F.ended || {})[it.show] = S.week; milestone(`Ended ${it.show}`, 'work'); it.result = { t: `${it.show} ends. The feed stays up; every so often somebody finds it and writes to ask where you went.` }; }
    return true; }
  if (it.kind === 'quitcheck') { it.done = true;
    if (k === 'qc_off') { for (const p of ['vidwire', 'blip']) M.fol[p] = (M.fol[p] || 0) * .93; M.stress = clamp(M.stress - 15, 0, 100); F.grind = 0; it.result = { t: 'A month without a camera. You lose some subscribers and find some sleep.' }; }
    else if (k === 'qc_edit') { M.editor = S.week + 12; F.grind = 4; it.result = { t: 'An editor takes the cutting. You still film every day, but you stop dreaming in timelines.' }; }
    else { M.stress = clamp(M.stress + 3, 0, 100); it.result = { t: 'You post on schedule. Nobody can tell anything is wrong, which is the point and the problem.' }; }
    return true; }
  if (it.kind === 'stageext') { it.done = true; const w = M.works[it.work]; if (!w || !w.run || !w.run.open) return true;
    if (k === 'se_move') { const ok = roll('pack', 13); w.run.seats = Math.round(w.run.seats * 2.5); w.run.price = Math.round(w.run.price * 1.5); w.run.max += 26; w.run.low = 0; if (!ok) w.fill = Math.max(.3, w.fill - .2); else me.standing = clamp(me.standing + 2, 0, 100);
      if (ok) milestone(`${w.title} transferred`, 'work'); it.result = { ok, roll: M.lastRoll, t: ok ? 'The transfer opens to a full house and the posters go up across town.' : 'The bigger room is a bigger silence. The first week is half full.' }; }
    else if (k === 'se_stay') { w.run.max += 8; it.result = { t: 'Eight more weeks in the room it was made for.' }; }
    else { w.run.closeW = S.week + 1; me.standing = clamp(me.standing + .5, 0, 100); it.result = { t: 'You close while people are still queueing. They will remember it as better than it was.' }; }
    return true; }
  if (it.kind === 'stageopt') { it.done = true; if (k === 'so_yes') { const fee = usd(10000); M.cash += fee - taxOn(fee); M.stageOpt = { work: it.work, until: S.week + 52 }; it.result = { t: `${fmtCash(fee)} for a year's option. It is the easiest money you'll ever make, unless they make the film.` }; } else it.result = { t: 'You keep the rights. Maybe you\'ll make it yourself.' }; return true; }
  if (it.kind === 'paycomm') { it.done = true; const P0 = M.pkg;
    if (k === 'pc_cut' && P0) { P0.bonus = +(P0.bonus * .75).toFixed(2); me.standing = clamp(me.standing + 1, 0, 100); it.result = { t: 'You give back a quarter of the bonus. The headlines move on in a day.' }; }
    else if (k === 'pc_talk') { const ok = roll('cha', 13); if (!ok) M.payFlag = 1; it.result = { ok, roll: M.lastRoll, t: ok ? 'Six meetings in three cities. The big holders leave saying the package is "explained".' : 'The meetings go badly. Next year\'s vote will be worse.' }; }
    else { M.payFlag = 1; me.standing = clamp(me.standing - 1, 0, 100); it.result = { t: 'You say nothing. The proxy advisers remember.' }; }
    return true; }
  if (it.kind === 'activist') { it.done = true; const c = S.companies[it.co]; if (!c) return true;
    if (k === 'ac_settle') { me.standing = clamp(me.standing + .5, 0, 100); news('Company', `${c.name} settles with an activist fund: two new directors and a strategy review.`, { company: c.id }); it.result = { t: 'Two seats and a committee chair. The new directors are polite and very well prepared.' }; }
    else if (k === 'ac_fight') { const ok = roll('cha', 14);
      if (ok) { me.standing = clamp(me.standing + 1.5, 0, 100); news('Company', `${c.name}'s board sees off an activist fund at the annual meeting.`, { company: c.id }); it.result = { ok, roll: M.lastRoll, t: 'The shareholders back the board, narrowly. You keep your seat and lose a month of sleep.' }; }
      else { const lose = !(typeof controls === 'function' && controls(c)) && prnd() < .5; if (lose) delete myBoards()[c.id]; news('Company', `An activist fund wins seats on ${c.name}'s board.`, { company: c.id }); it.result = { ok, roll: M.lastRoll, t: lose ? 'The fund\'s slate wins, and one of the seats it takes is yours.' : 'The fund wins two seats. Yours survives, just.' }; } }
    else { me.standing = clamp(me.standing - 1, 0, 100); if (it.dk === 'cash' && c.cash > 0) c.cash *= .85; news('Company', `A director at ${c.name} breaks ranks to back an activist fund.`, { company: c.id }); it.result = { t: 'You vote with the fund. The chair stops making eye contact.' }; }
    return true; }
  return false;
}
PICK_HOOKS.push(sidePick);
