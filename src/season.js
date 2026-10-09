// ---------------- The season: festivals, shorts and contests on a real calendar, with real odds ----------------
// Festivals happen when they happen. You submit in the months before (the window opens four months out and closes a
// month before), the line-up is announced the month the festival runs, and the prizes are given there. Programmers
// see thousands of films for a few dozen slots: an A-list competition takes perhaps one submission in a hundred, a
// friendly regional festival one in ten, and quality moves those odds a long way but never to certainty. Winning is
// a further, smaller chance among the selected. Short-film festivals work the same way. Contests are a notch harder.
// The Season page (Contests app) lays the whole year out month by month so you can plan it.

// ---- feature festivals ----
function festWindow(F) {   // weeks until the festival's month starts, and whether submissions are open now
  const due = nextMonthWeek(F.month), wks = due - S.week;
  return { due, wks, open: wks >= 4 && wks <= 18 };
}
// the chance a film is selected: by the festival's bar and level, the film's quality (or how it looks before it's
// finished), and a nudge for small films at festivals that love discoveries
function festSelOdds(F, f) {
  const q = (f.q ?? preQ(f)) + ((f.tier === 3 || f.co === null) && F.small ? 4 : 0);
  const cap = [0, .55, .7, .8][F.tier || 2], floor = [0, .01, .03, .06][F.tier || 2];
  return clamp(floor + cap / (1 + Math.exp(-(q - F.bar - 3) / 3.5)), floor, cap);
}
function festWinOdds(F, f) { const q = f.q ?? preQ(f); return clamp(.03 + (q - F.bar - 4) / 45, .02, .3); }
function festChanceLabel(p) { return p >= .45 ? 'a strong chance' : p >= .25 ? 'a real chance' : p >= .1 ? 'an outside chance' : 'a long shot'; }
submitFest = function (a) {
  const M = S.me, f = S.films[a.film], F = FESTIVALS.find(x => x.k === a.k);
  if (!f || !F || !myFilms().includes(f) || !festEligible(f) || (typeof festFits === 'function' && !festFits(F, f)) || (M.fests || []).some(x => x.film === f.id && x.k === F.k) || M.cash < usd(F.fee)) return false;
  const W = festWindow(F); if (!W.open) return false;
  M.cash -= usd(F.fee);
  (M.fests = M.fests || []).push({ film: f.id, k: F.k, due: W.due, w: S.week });
  diary(`You submit ${f.title} to ${F.name}. The line-up is announced in ${MON[F.month]}.`);
  return true;
};
festWeek = function () {
  const M = S.me, me = ME();
  for (const e of (M.fests || []).filter(x => !x.done && x.due <= S.week)) {
    e.done = true;
    const f = S.films[e.film], F = FESTIVALS.find(x => x.k === e.k); if (!f || !F) continue;
    const ps = festSelOdds(F, f);
    if (prnd() >= ps) { e.res = 'passed'; inbox('note', `${F.name.replace(/^the /, 'The ')}: not selected`, `${f.title} isn't in this year's line-up. ${pickLine(['Thousands of films, a few dozen slots.', 'The programmers wanted something else this year.', 'They sent the same two-line email to four thousand people.', 'A programmer you met once says it was close. It may even be true.'], f.id + e.due)}`, { film: f.id }); continue; }
    e.sel = 1; e.res = 'selected'; f.cult = clamp((f.cult || 0) + 6, 0, 100); me.standing = clamp(me.standing + [0, 2.5, 1.5, 1][F.tier || 2], 0, 100);
    const sec = (F.sections || ['the official selection'])[Math.floor(prnd() * Math.min(2, (F.sections || ['x']).length))];
    let t = `${f.title} is in ${sec} at ${F.name}. ${F.d}`;
    if (prnd() < festWinOdds(F, f)) {
      e.res = 'won'; award(f, `${F.name.replace(/^the /, '')}: ${F.prize}`, [f.dir, f.prod].filter((x, i, A) => A.indexOf(x) === i));
      me.fame = clamp((me.fame || 0) + [0, 5, 3, 2][F.tier || 2], 0, 100); me.standing = clamp(me.standing + [0, 4, 2.5, 1.5][F.tier || 2], 0, 100);
      t += ` And it wins the ${F.prize}.`; milestone(`${f.title} won the ${F.prize} at ${F.name}`, 'prize');
    } else milestone(`${f.title} selected for ${F.name}`, 'prize');
    inbox('news', F.name.replace(/^the /, 'The '), t, { film: f.id });
    if (f.rel === null && f.co === M.company && TERRITORIES.some(tt => !(f.dist || {})[tt]) && !pending().some(x => x.kind === 'bid' && x.film === f.id)) distributorBids(f, e.res === 'won');
    const slot = freeSlot({ days: [3, 4, 5], blocks: [2], from: 1 }), host = [f.prod, f.dir, f.cast[0]].find(id => id !== me.id);
    if (slot && host !== undefined) inbox('invite', `Go to ${F.name.replace(/^the /, 'The ')}?`, `Your film is screening. The premiere is ${slotLabel(slot)}: travel, a red carpet, and everyone who buys and sells films in one place.`, { person: host, ev: 'festival', slot, what: `the premiere at ${F.name}`, choices: [{ k: 'yes', label: `Go (${slotLabel(slot)})` }, { k: 'no', label: 'Stay home' }] });
  }
};

// ---- short-film festivals: same shape ----
function shortSelOdds(q, tier) { const bar = SF_BAR[tier], cap = [0, .5, .65, .8][tier]; return clamp(.02 + cap / (1 + Math.exp(-(q - bar - 2) / 4)), .02, cap); }
function shortWinOdds(q, tier) { return clamp(.02 + (q - SF_BAR[tier] - 4) / 45, .015, .3); }

// ---- contests: a notch harder ----
for (const c of COMPS) if (!c._season) { c._season = 1; c.dc += c.tier === 'fun' ? 1 : c.tier === 'industry' ? 1 : 0; }

// ---- the season, month by month ----
function seasonEvents(m) {
  const M = S.me, out = [];
  for (const F of FESTIVALS) if (F.month === m && (F.founded || 0) <= S.year) out.push({ kind: 'Festival', name: F.name.replace(/^the /, 'The '), tier: F.tier || 2, mine: (M.fests || []).filter(x => x.k === F.k && !x.done).length, link: typeof bodyLink === 'function' ? bodyLink(F.name.replace(/^the /, 'The ')) : esc(F.name) });
  for (const F of Object.values(typeof SHORT_FEST !== 'undefined' ? SHORT_FEST : {})) if (F.month === m && F.founded <= S.year) out.push({ kind: 'Shorts', name: F.name, tier: F.tier, mine: (M.works || []).filter(w => w.circuit && w.circuit.subs.some(s => s.k === F.k && !s.done)).length, link: `<a href="#" class="lk" data-go="shortfest:${F.k}">${esc(F.name)}</a>` });
  for (const c of COMPS) if (c.month === m) out.push({ kind: 'Contest', name: c.name, tier: c.tier === 'major' ? 1 : c.tier === 'industry' ? 2 : 3, mine: (M.comps || []).some(e => e.k === c.k && e.y === yearOf(S.week) && !e.told) ? 1 : 0, link: typeof compLink === 'function' ? compLink(c) : esc(c.name), cat: c.cat });
  return out.sort((a, b) => a.tier - b.tier);
}
function seasonHTMLFull() {
  const M = S.me, mo = dateOf(S.week).getUTCMonth(), MON_ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const f = UI.seasonF || 'all';
  const months = [0, 1, 2, 3, 4, 5].map(i => (mo + i) % 12);
  const pending = (M.fests || []).filter(x => !x.done).length + (M.comps || []).filter(e => !e.told).length + (M.works || []).reduce((n, w) => n + ((w.circuit && w.circuit.subs) || []).filter(s => !s.done).length, 0);
  const cell = m => { const L = seasonEvents(m).filter(e => f === 'all' || (f === 'mine' ? e.mine : e.kind === f)); return `<div class="seam${m === mo ? ' now' : ''}"><h4>${MON_[m]}${m === mo ? ' <span class="chip good">now</span>' : ''}</h4><ul class="plain small">${L.slice(0, 14).map(e => `<li><span class="sk sk-${e.kind.toLowerCase()}">${e.kind[0]}</span> ${e.link}${e.tier === 1 ? ' ★' : ''}${e.mine ? ' <b class="good">· yours</b>' : ''}</li>`).join('') || '<li class="muted">Nothing.</li>'}${L.length > 14 ? `<li class="muted">and ${L.length - 14} more</li>` : ''}</ul></div>`; };
  return `<section class="panel"><h3>The season <span class="count">${pending} entr${pending === 1 ? 'y' : 'ies'} waiting on results</span></h3>
   <p class="muted small">The next six months: <b>F</b> feature festivals (submit 1–4 months ahead; the line-up and prizes come in the festival's month), <b>S</b> short-film festivals, <b>C</b> contests (entries open the month before the deadline). ★ = the big ones. Selection is hard everywhere: an A-list festival takes one film in a hundred.</p>
   <div class="fchips">${[['all', 'Everything'], ['mine', 'Yours'], ['Festival', 'Festivals'], ['Shorts', 'Shorts'], ['Contest', 'Contests']].map(([k, l]) => `<button class="fchip${f === k ? ' on' : ''}" data-seasonf="${k}">${l}</button>`).join('')}</div>
   <div class="seasongrid">${months.map(cell).join('')}</div></section>`;
}
function seasonClick(t) { if (t.dataset.seasonf) { UI.seasonF = t.dataset.seasonf; render(true); return true; } return false; }
