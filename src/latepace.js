// ---------------- A late game tied to a body of work ----------------
// Late-game opportunities used to arrive about once a week once you had money, whatever you had made: a songwriter
// earned far more from book deals and commercials than from songs, and patrons restored the same lost film fourteen
// times. Now:
//  · every offer has a cause: patronage (a scholarship, the hometown cinema, a restored film, a fund abroad, a
//    chair, a board) needs level 5 and five credits or a released film of your own, and happens once;
//  · windfalls need a track record: a book deal wants five pieces of work behind it, a commercial wants a reel or a
//    face, slate money wants a slate (and never more than half of what it costs), crowdfunding wants a project and
//    people who'd back it (and the money is owed to that project);
//  · no late-game opportunity repeats inside three years, and they come at most one every six weeks.
function lateBody() {
  const M = S.me, me = ME(), c = typeof myCo === 'function' ? myCo() : null;
  return me.credits.length + (M.works || []).filter(w => w.rel !== undefined).length + Math.min(6, (M.gigs || []).filter(g => g.q >= 45).length * .4) + (c ? S.films.filter(f => f.co === c.id && f.rel !== null).length : 0);
}
function lateReleased() { const me = ME(), c = typeof myCo === 'function' ? myCo() : null; return me.credits.some(id => S.films[id] && S.films[id].rel !== null) || (c && S.films.some(f => f.co === c.id && f.rel !== null)) || (S.me.works || []).some(w => w.rel !== undefined); }
function lateProject() { const M = S.me; return (M.scripts || []).some(s => s.made === undefined) || (M.holdings || []).some(h => h.made === undefined && !h.lapsed) || (M.works || []).some(w => w.rel === undefined); }
const LATE_PATRON = ['lg_scholar', 'lg_restore', 'lg_fund', 'lg_hometown', 'lg_cinema', 'lg_chair', 'lg_board_charity', 'lg_voting', 'lg_town', 'lg_salon', 'lg_gala', 'lg_firstlook', 'lg_ranch', 'lg_retro'];
const LATE_CAUSE = {
  lg_memoir: () => lateBody() >= 5,
  pr_found: () => lateBody() >= 2 && careerLevel() >= 3,
  pr_slate: () => typeof slateOf === 'function' && !!myCo() && slateOf(myCo()).length >= 1,
  in_brand: () => lateBody() >= 1 || (ME().fame || 0) >= 10,
  in_crowd: () => lateProject() && Object.keys(S.me.known || {}).length >= 30,
  lg_buyout: () => lateBody() >= 2
};
for (const t of LATE) {
  const need0 = t.need;
  if (LATE_PATRON.includes(t.id)) { t.once = 1; t.need = () => (!need0 || need0()) && careerLevel() >= 5 && (ME().credits.length >= 5 || lateReleased()); }
  else if (LATE_CAUSE[t.id]) t.need = () => (!need0 || need0()) && LATE_CAUSE[t.id]();
  if (t.pool === 'late' && !t.once) t.cool = Math.max(t.cool || 0, 156);
}
// slate money is a share of what the slate costs, not a number from the air
{ const t = LATE_BY.pr_slate; if (t) { const mk = t.mk; t.mk = c => { mk(c); const L = typeof slateOf === 'function' && myCo() ? slateOf(myCo()) : []; const cap = L.reduce((s, f) => s + (f.budget || 0), 0) * 1e6 * .5; c.amt = Math.round(Math.min(c.amt, Math.max(usd(100000), cap)) / 1000) * 1000; }; } }
// crowdfunded money is owed to the project: make something within a year or the backers turn on you
{ const t = LATE_BY.in_crowd; if (t) { const o = t.opts.find(x => x.k === 'yes'); if (o) { const go = o.go; o.go = (c, ok) => { const c0 = S.me.cash, r = go(c, ok); const raised = S.me.cash - c0; if (raised > 0) S.me.crowd = { amt: raised, w: S.week, until: S.week + 52, n0: lateBody() }; return r + ' The backers expect to see the film within a year.'; }; } } }
WEEK_HOOKS.push(() => { const M = S.me, C = M && M.crowd; if (!C || S.week < C.until) return; if (lateBody() > C.n0) { diary('The backers get their film, and their names in the credits. Several of them email to say it was worth it.'); ME().standing = clamp(ME().standing + .5, 0, 100); }
  else { ME().standing = clamp(ME().standing - 2, 0, 100); M.stress = clamp(M.stress + 8, 0, 100); diary('A year since the crowdfunder and nothing to show the backers. The comments under the campaign video are not kind.'); } M.crowd = null; });
// pacing: one late-game opportunity at most every six weeks
{ const _lo = lateOffer; lateOffer = function (pool) { const M = S.me; if (pool === 'late' && S.week - (M.lateLast ?? -999) < 6) return false; const ok = _lo(pool); if (ok && pool === 'late') M.lateLast = S.week; return ok; }; }
