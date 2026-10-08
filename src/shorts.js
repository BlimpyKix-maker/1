// ---------------- Short films: where careers start ----------------
// Make a short (a new kind of work), send it round the short-film festivals, collect laurels, get noticed: agents,
// producers who want the feature version, a qualifying win that puts you in the running for an Oswald. A year on the
// circuit, then it goes online. Film school ends with a thesis short. And the world has its own shorts: every year
// the short festivals select and crown the work of young filmmakers, many of whom go on to direct the features you
// know, so every director's page can show where they started.
PLATFORMS.circuit = { name: 'The festival circuit', icon: '🎞️', unit: 'screenings', from: 1900, pay: 0, gate: 0, d: 'Short-film festivals: fees to apply, no money to speak of, and the people who hire directors in the audience.' };
WORK_TYPES.short = { label: 'Short film', icon: '🎬', subs: ['vstory', 'dact', 'comp'], need: 14, plat: 'circuit', field: 'film', base: 0, eng: 0, conv: 0, cost: 1800, d: 'Write, shoot and cut a film under twenty minutes, on favours and pizza. A year on the festival circuit, then online.' };
DECAY.short = .6;
// [key, name, hub, founded, tier, kind, month (0-11), Oswald-qualifying, top prize]
const SHORT_FESTS = [
  ['oberhaus', 'The Oberhaus Short Film Days', 'berlin', 1954, 1, 'all', 4, 1, 'Grand Prize of the City'],
  ['clermont', 'The Clermont Short Film Festival', 'paris', 1979, 1, 'all', 1, 1, 'Grand Prix'],
  ['palmvalley', 'Palm Valley ShortFest', 'hollywood', 1995, 1, 'all', 5, 1, 'Best of the Festival'],
  ['annesse', 'Lac d\'Annesse Animation Festival', 'paris', 1960, 1, 'anim', 5, 1, 'Crystal for a Short Film'],
  ['studentacad', 'The Student Academy Shorts', 'hollywood', 1973, 1, 'student', 9, 1, 'Gold Medal'],
  ['lakeland', 'The Lakeland Short Film Festival', 'stockholm', 1969, 2, 'all', 2, 1, 'Grand Prix'],
  ['aspenridge', 'Aspenridge Shortsfest', 'hollywood', 1991, 2, 'all', 3, 1, 'Best Short'],
  ['krakowshorts', 'The Kraków Film Days', 'warsaw', 1961, 2, 'doc', 4, 0, 'Golden Dragon'],
  ['shortstokyo', 'Shorts Shorts Tokyo', 'tokyo', 1999, 2, 'all', 5, 1, 'Grand Prix'],
  ['londonshorts', 'London Short Film Festival', 'london', 2004, 2, 'all', 0, 0, 'Best Short'],
  ['nightshorts', 'Berlin Shorts Night', 'berlin', 1982, 3, 'all', 10, 0, 'Audience Award'],
  ['uppsalund', 'The Uppsalund Short Film Festival', 'stockholm', 1982, 3, 'all', 9, 0, 'Grand Prix']
];
const SHORT_FEST = {}; for (const [k, name, hub, founded, tier, kind, month, qual, prize] of SHORT_FESTS) SHORT_FEST[k] = { k, name, hub, founded, tier, kind, month, qual, prize };
const SF_BAR = [0, 78, 68, 58];   // the quality a short needs for even odds of selection, by tier
const SHORT_A = ['The Last', 'Small', 'Night', 'Paper', 'A Quiet', 'Sunday', 'The Swimmer\'s', 'Borrowed', 'Salt', 'Kitchen', 'Lost', 'Winter'], SHORT_B = ['Bus', 'Hour', 'Lighthouse', 'Inventory', 'Window', 'Goodbye', 'Errand', 'Animal', 'Lesson', 'Visit', 'Tide', 'Ritual', 'Swim', 'Shift', 'Crossing', 'Harvest'];
const SHORT_LOG = ['A night-shift cleaner and a security guard play chess with the lights off.', 'Two sisters empty their mother\'s flat in an afternoon.', 'A boy tries to return a lost dog before his father notices.', 'A bus driver makes an unscheduled stop.', 'A wedding photographer is asked to delete one picture.', 'An old man teaches his grandson to swim in a river that\'s about to be dammed.', 'A call-centre worker keeps a stranger on the line all night.', 'A family dinner, in real time, in which nobody mentions the empty chair.', 'A girl builds a raft to cross a canal that isn\'t as wide as she thinks.', 'Two strangers wait out a storm in a laundrette.', 'A janitor at a planetarium.', 'A woman rehearses a phone call she never makes.', 'A refugee boy and a lighthouse keeper share a language of hand signals.', 'A dance teacher\'s last lesson before the studio closes.', 'An astronaut\'s dog, waiting.', 'A whole life, told through one kitchen table.'];
function shortTitle(seed) { const r = hashRand(seed); return `${SHORT_A[Math.floor(r() * SHORT_A.length)]} ${SHORT_B[Math.floor(r() * SHORT_B.length)]}`; }
// ---- the player's own shorts ----
function shortRelease(w) {
  const M = S.me, fests = Object.values(SHORT_FEST).filter(F => F.founded <= S.year && F.kind !== 'student' && (F.kind !== 'anim' || ME().sk.digi >= 8)).sort((a, b) => a.tier - b.tier);
  const plan = [[3, 3], [6, 2], [10, 1]][clamp(w.promo || 0, 0, 2)], pool = fests.filter(F => F.tier >= plan[1]).slice(0, plan[0]);
  if (M.school || (M.degrees || []).length && S.week - ((M.milestones || []).filter(m => m.kind === 'school').slice(-1)[0] || { w: -999 }).w < 52) { const st = SHORT_FEST.studentacad; if (st.founded <= S.year) pool.push(st); }
  const fee = usd(45), n = Math.min(pool.length, Math.floor(Math.max(0, M.cash) / fee)); M.cash -= n * fee;
  w.v0 = 0; w.circuit = { from: S.week, subs: pool.slice(0, n).map(F => ({ k: F.k, due: nextMonthWeek(F.month) })).filter(x => x.due - S.week <= 52), laurels: [] };
  diary(`Money: festival entry fees for ${w.title}, ${fmtCash(n * fee)} (${n} festivals).`);
}
function nextMonthWeek(m) { for (let w = S.week + 4; w < S.week + 60; w++) if (dateOf(w).getUTCMonth() === m && dateOf(w).getUTCDate() <= 7) return w; return S.week + 26; }
function shortWeek() {
  const M = S.me, me = ME();
  for (const w of (M.works || []).filter(x => x.type === 'short' && x.circuit && !x.circuit.over)) {
    const C = w.circuit;
    for (const s of C.subs.filter(s => !s.done && S.week >= s.due)) {
      s.done = 1; const F = SHORT_FEST[s.k], p = clamp(.5 + (w.q - SF_BAR[F.tier]) / 25, .03, .92);
      if (prnd() >= p) { s.res = 'passed'; continue; }
      s.res = 'selected'; w.units += 3 + Math.floor(prnd() * 6); me.standing = clamp(me.standing + [0, 1.2, .7, .4][F.tier], 0, 100);
      const win = prnd() < clamp((w.q - SF_BAR[F.tier] + 4) / 40, .03, .5);
      if (win) {
        s.res = 'won'; C.laurels.push({ k: F.k, y: S.year, won: 1 }); const prize = usd([0, 5000, 2500, 1000][F.tier]); M.cash += prize;
        me.standing = clamp(me.standing + [0, 4, 2.5, 1.5][F.tier], 0, 100); me.fame = clamp((me.fame || 0) + [0, 3, 1.5, .5][F.tier], 0, 100);
        milestone(`Won the ${F.prize} at ${F.name} for ${w.title}`, 'prize'); news('Festival', `${w.title}, a short by ${me.name}, wins the ${F.prize} at ${F.name}.`, { person: me.id });
        inbox('note', `${w.title} wins at ${F.name}`, `The ${F.prize}${prize ? ` and ${fmtCash(prize)}` : ''}. ${F.qual ? 'It qualifies the film for the Oswalds\' short film category. ' : ''}Your phone has a lot of new numbers in it by morning.`);
        if (F.qual) C.qual = S.year;
        if (!M.agent && typeof agenciesIn === 'function' && F.tier <= 2) { const A = agenciesIn(M.hub); if (A.length) inbox('agentoffer', 'An agent saw your short', `${A[0].name} was in the room. "We'd like to represent you. Shorts are calling cards; let's find out who's calling."`, { ag: 0, choices: [{ k: 'yes', label: 'Sign with them' }, { k: 'no', label: 'Not yet' }] }); }
        if (F.tier === 1 && !C.devOffer) { C.devOffer = 1; inbox('shortdev', `A producer wants the feature`, `"${w.title} is the first ten minutes of a feature. Let us develop it with you." An option fee of ${fmtCash(usd(6000))} and a development deal.`, { work: w.id, choices: [{ k: 'yes', label: 'Take the deal' }, { k: 'no', label: 'Keep it a short' }] }); }
      } else C.laurels.push({ k: F.k, y: S.year });
      if (prnd() < .5) { const q2 = typeof youngNPC === 'function' ? youngNPC(F.hub === M.hub ? M.hub : M.hub, ppick(['producer', 'director', 'writer', 'dp'])) : null; if (q2) meet(q2.id, `Met at ${F.name}`, 6); }
    }
    // the Oswalds: a qualifying win puts it in the running at the next ceremony
    if (C.qual && !C.oswald && dateOf(S.week).getUTCMonth() === 1 && S.year > C.qual) {
      C.oswald = 1; const nom = prnd() < clamp((w.q - 70) / 50, .05, .6);
      if (nom) { me.standing = clamp(me.standing + 4, 0, 100); me.fame = clamp((me.fame || 0) + 4, 0, 100); milestone(`Nominated at Academy Oswalds: Best Short Film, for ${w.title}`, 'prize');
        if (prnd() < .22) { me.standing = clamp(me.standing + 6, 0, 100); me.fame = clamp((me.fame || 0) + 6, 0, 100); milestone(`Won at Academy Oswalds: Best Short Film, for ${w.title}`, 'prize'); me.awards.push(`Academy Oswalds Best Short Film ${S.year}`); news('Award', `${me.name} wins the Oswald for best short film with ${w.title}.`, { person: me.id }); inbox('note', 'You won an Oswald', `For a short you made on favours and pizza. The speech lasts forty-five seconds; you thank the caterer by name.`); }
        else inbox('note', 'Nominated for an Oswald', `${w.title} is one of five nominated short films. You don't win, but "Oswald nominee" goes before your name for the rest of your life.`); }
    }
    // a year on the circuit, then online
    if (S.week - C.from >= 52 && C.subs.every(s => s.done)) {
      C.over = 1;
      if (platOpen('vidwire')) { w.plat = 'vidwire'; w.rel = S.week; const z = pgauss(); w.v0 = Math.round(followers('vidwire') * .2 + 80 * Math.pow(10, (w.q - 50) / 22 + z * .6) * (1 + C.laurels.length * .4)); w.z = z; w.df = 1; diary(`${w.title} goes online after its festival year, laurels and all.`); }
    }
  }
}
function shortPick(it, k) {
  if (it.kind !== 'shortdev') return false;
  it.done = true; const M = S.me, me = ME();
  if (k === 'yes') { const fee = usd(6000); M.cash += fee; me.standing = clamp(me.standing + 2, 0, 100); milestone('Optioned a short film for a feature', 'work'); const q = typeof youngNPC === 'function' ? youngNPC(M.hub, 'producer') : null; if (q) meet(q.id, 'Producing your feature', 12); it.result = { t: `Signed: ${fmtCash(fee)} and a development deal. Now you have to write the feature.` }; }
  else it.result = { t: 'You keep it a short. It was always meant to be one.' };
  return true;
}
// Film school ends with a thesis short: made from what you learned there, entered automatically.
function thesisShort(sc) {
  const M = S.me, me = ME(); if (!['dir', 'wri', 'cam', 'edt', 'pro', 'act', 'des', 'fx', 'mus'].includes(sc.craft)) return;
  const grades = Object.values(typeof curMap === 'function' ? curMap() : {}).map(x => x.g).filter(Boolean), gpa = grades.length ? grades.filter(g => g === 'A').length / grades.length : .3;
  const sk = ['vstory', 'dact', 'comp'].reduce((t, s) => t + skillOf(me, s), 0) / 3, q = clamp(Math.round(sk * 3.6 + 26 + gpa * 16 + pgauss() * 8), 10, 96);   // two years of school show
  const w = { id: (M.works || []).length, type: 'short', title: shortTitle(M.id * 31 + S.week), q, rel: S.week, plat: 'circuit', units: 0, earned: 0, wk: [], promo: 1, cost: 0, thesis: 1 };
  (M.works = M.works || []).push(w);
  const pool = Object.values(SHORT_FEST).filter(F => F.founded <= S.year && (F.kind === 'all' || F.kind === 'student') && F.tier >= 1).slice(0, 7);
  w.v0 = 0; w.circuit = { from: S.week, subs: pool.map(F => ({ k: F.k, due: nextMonthWeek(F.month) })).filter(x => x.due - S.week <= 52), laurels: [] };   // the school pays the entry fees
  inbox('note', `Your thesis film: ${w.title}`, `The school screens every thesis film for the industry in a single long evening. Yours plays ninth. It goes out to ${pool.length} festivals, entry fees paid by the school.`);
}
// ---- the world's shorts: line-ups and winners, year by year ----
function firstFeatureYears() {
  const A = archive(); if (A.ffy) return A.ffy;
  const out = [];
  for (const p of S.people) if (p.role === 'director' && p.credits && p.credits.length) { const ys = p.credits.map(i => S.films[i]).filter(f => f && f.rel !== null && f.dir === p.id).map(f => yearOf(f.rel)); if (ys.length) out.push([p.id, Math.min(...ys)]); }
  return A.ffy = out;
}
function shortsOf(fk, y) {
  const A = archive(), key = 'sh:' + fk + ':' + y; if (A[key]) return A[key];
  const F = SHORT_FEST[fk]; if (!F || y < F.founded || y > S.year || (y === S.year && dateOf(S.week).getUTCMonth() < F.month)) return A[key] = [];
  const r = hashRand(y * 7919 + F.k.length * 131 + F.month), FF = firstFeatureYears(), n = [0, 8, 6, 5][F.tier];
  const future = FF.filter(([, fy]) => fy > y && fy <= y + 6 && (F.tier === 1 || r() < .7)), out = [], used = new Set();
  for (let i = 0; i < n; i++) {
    let who = null; if (future.length && r() < (F.tier === 1 ? .55 : .35)) { const c = future[Math.floor(r() * future.length)]; if (!used.has(c[0])) { who = c[0]; used.add(who); } }
    const s = { fk, y, i, title: shortTitle(y * 97 + i * 13 + F.k.length * 7), who, name: who === null ? `${pickName(r, F.hub)}` : null, log: SHORT_LOG[Math.floor(r() * SHORT_LOG.length)], mins: 6 + Math.floor(r() * 22), kind: F.kind === 'anim' ? 'Animation' : F.kind === 'doc' ? 'Documentary' : r() < .15 ? 'Animation' : r() < .2 ? 'Documentary' : 'Fiction' };
    out.push(s);
  }
  // the winner: the best of them, or a future name if there is one
  const wi = Math.max(0, out.findIndex(s => s.who !== null)), w = r() < .6 ? wi : Math.floor(r() * out.length); if (out[w]) out[w].won = 1;
  return A[key] = out;
}
function pickName(r, hub) { const N = NAMES[(HUBS[hub] || HUBS.hollywood).lang] || NAMES.en, g = r() < .45 ? 'F' : 'M'; return `${N[g][Math.floor(r() * N[g].length)]} ${N.L[Math.floor(r() * N.L.length)]}`; }
const shortWho = s => s.who !== null && P(s.who) ? pl(s.who) : esc(s.name || 'unknown');
const shortLink = s => `<a href="#" class="lk" data-go="short:${s.fk}~${s.y}~${s.i}">${esc(s.title)}</a>`;
function viewShort(id) {
  const [fk, y, i] = String(id).split('~'), s = (shortsOf(fk, +y) || [])[+i], F = SHORT_FEST[fk]; if (!s) return '<p class="muted">Not found.</p>';
  const p = s.who !== null ? P(s.who) : null, next = p ? p.credits.map(k => S.films[k]).filter(f => f && f.rel !== null && f.dir === p.id).sort((a, b) => a.rel - b.rel).slice(0, 6) : [];
  return `<div class="head"><p class="eyebrow">Short film · ${esc(s.kind)} · ${s.mins} minutes · ${s.y}</p><h2>${esc(s.title)}</h2><p class="lede">${esc(s.log)}</p></div>
   <section class="panel"><p>Directed by ${shortWho(s)}. ${s.won ? `<b>Winner of the ${esc(F.prize)}</b> at` : 'Selected for'} <a href="#" class="lk" data-go="shortfest:${fk}">${esc(F.name)}</a>, ${s.y}.${F.qual && s.won ? ' The win qualified it for the Oswalds.' : ''}</p>
   ${next.length ? `<h4>Where ${esc(p.name)} went next</h4><ul class="plain small">${next.map(f => `<li>${fl(f.id)} <span class="muted">${yearOf(f.rel)}</span></li>`).join('')}</ul>` : '<p class="muted small">No features yet. Most short filmmakers never make one; the ones who do usually made a few shorts first.</p>'}</section>`;
}
function viewShortFest(fk) {
  const F = SHORT_FEST[fk]; if (!F) return '<p class="muted">Not found.</p>';
  const ys = []; for (let y = S.year; y >= Math.max(F.founded, S.year - 40); y--) ys.push(y);
  return `<div class="head"><p class="eyebrow">Short film festival · ${esc(hubName(F.hub))} · since ${F.founded} · ${['', 'A-list', 'major', 'regional'][F.tier]}</p><h2>${esc(F.name)}</h2><p class="lede">Every ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][F.month]}. Top prize: the ${esc(F.prize)}.${F.qual ? ' Its winners qualify for the Oswalds.' : ''}${F.kind === 'student' ? ' Open only to film-school students.' : F.kind === 'anim' ? ' Animation only.' : F.kind === 'doc' ? ' Documentary and short fiction.' : ''}</p></div>
   <section class="panel"><h3>Winners</h3><table class="grid small"><thead><tr><th>Year</th><th>Winner</th><th>Director</th><th>Later</th></tr></thead><tbody>${ys.map(y => { const L = shortsOf(fk, y), w = L.find(s => s.won); if (!w) return ''; const p = w.who !== null ? P(w.who) : null, nf = p ? p.credits.map(k => S.films[k]).filter(f => f && f.rel !== null && f.dir === p.id).length : 0; return `<tr><td>${y}</td><td>${shortLink(w)}</td><td>${shortWho(w)}</td><td class="muted">${nf ? nf + ' feature' + (nf > 1 ? 's' : '') : ''}</td></tr>`; }).join('')}</tbody></table></section>`;
}
function shortsApp() {
  const M = S.me, tab = UI.sht || 'now', y = UI.shy || S.year;
  const tabs = [['now', '🎞️ This year'], ['past', '📜 Year by year'], ['fests', '🏛️ The festivals'], ['cal', '🗓️ Deadlines & entries'], ['mine', `🎬 Your shorts (${(M.works || []).filter(w => w.type === 'short').length})`]];
  let body = '';
  if (tab === 'now' || tab === 'past') {
    const yy = tab === 'now' ? S.year : y, years = []; for (let k = S.year; k >= 1955; k--) years.push(k);
    body = (tab === 'past' ? `<div class="filt"><label><span>Year</span>${sel('sh-y', years.map(k => [k, String(k)]), yy)}</label></div>` : `<p class="muted small">Where the next generation of directors is coming from. Shorts that won are marked 🏆; names you might know later are linked.</p>`) +
      Object.values(SHORT_FEST).filter(F => F.founded <= yy).map(F => { const L = shortsOf(F.k, yy); return L.length ? `<h4><a href="#" class="lk" data-go="shortfest:${F.k}">${esc(F.name)}</a> <span class="muted small">${esc(hubName(F.hub))}</span></h4><ul class="plain small">${L.map(s => `<li>${s.won ? '🏆 ' : ''}${shortLink(s)} <span class="muted">by</span> ${shortWho(s)} <span class="muted">· ${s.mins} min · ${esc(s.kind.toLowerCase())}</span></li>`).join('')}</ul>` : `<h4>${esc(F.name)}</h4><p class="muted small">${yy === S.year ? 'Not held yet this year.' : 'No record.'}</p>`; }).join('');
  } else if (tab === 'cal' && typeof shortsCalendarHTML === 'function') { body = shortsCalendarHTML();
  } else if (tab === 'fests') {
    body = `<table class="grid small"><thead><tr><th>Festival</th><th>Where</th><th>Since</th><th>When</th><th>Top prize</th><th></th></tr></thead><tbody>${Object.values(SHORT_FEST).map(F => `<tr><td><a href="#" class="lk" data-go="shortfest:${F.k}">${esc(F.name)}</a></td><td>${esc(hubName(F.hub))}</td><td>${F.founded}</td><td>${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][F.month]}</td><td>${esc(F.prize)}</td><td class="muted">${F.qual ? 'Oswald-qualifying' : ''}${F.kind !== 'all' ? ' · ' + F.kind : ''}</td></tr>`).join('')}</tbody></table>`;
  } else {
    const L = (M.works || []).filter(w => w.type === 'short');
    body = L.length ? L.slice().reverse().map(w => { const C = w.circuit || { subs: [], laurels: [] }; return `<div class="deal"><b><a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a></b> <span class="muted small">${w.thesis ? 'thesis film · ' : ''}quality ${w.q}</span><p class="small">${C.laurels.map(l => `${l.won ? '🏆' : '🌿'} ${esc(SHORT_FEST[l.k].name)}`).join(' · ') || '<span class="muted">No laurels yet.</span>'}</p><p class="small muted">${C.subs.map(s => `${esc(SHORT_FEST[s.k].name)}: ${s.done ? s.res : 'decides ' + fmtDate(s.due, true)}`).join(' · ')}${C.over ? ' · now online' : ''}</p></div>`; }).join('') : `<p class="muted">No shorts yet. Start one in Create → ${WORK_TYPES.short.icon} Short film: fourteen sessions, a weekend shoot, and ${fmtCash(usd(WORK_TYPES.short.cost))} of favours and pizza. Release with more promotion to send it to more (and bigger) festivals.</p>`;
  }
  return `<div class="shorts"><p class="bf-row">${tabs.map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-sht="${k}">${l}</button>`).join('')}</p>${body}</div>`;
}
function shortsClick(t) { const d = t.dataset; if (d.sht) { UI.sht = d.sht; render(true); return true; } return false; }
function shortsChange(e) { if (e.target.id !== 'sh-y') return false; UI.shy = +e.target.value; render(true); return true; }
OS_EXTRA.shorts = ['🎞️', 'Shorts Circuit', 'Short-film festivals, winners and your shorts'];
OS_VIEWS.shorts = () => shortsApp();
for (const g of OS_GROUPS) if (g[0] === 'Industry') g[1].splice(3, 0, 'shorts');
// A director's page remembers their early shorts.
function shortsBy(pid) {
  const A = archive(), key = 'shb:' + pid; if (A[key]) return A[key];
  const out = [], FF = firstFeatureYears().find(x => x[0] === pid); if (!FF) return A[key] = out;
  for (let y = FF[1] - 6; y < FF[1]; y++) for (const F of Object.values(SHORT_FEST)) for (const s of shortsOf(F.k, y)) if (s.who === pid) out.push(s);
  return A[key] = out;
}
// ---- goals ----
const myShorts = () => (S.me.works || []).filter(w => w.type === 'short');
const shortLaurels = () => myShorts().reduce((n, w) => n + ((w.circuit || {}).laurels || []).length, 0);
amb('x_short1', 'craft', 'Make a short film', () => [myShorts().length, 1], 2);
amb('x_shortsel', 'fame', 'Get a short into a festival', () => [shortLaurels(), 1], 3);
amb('x_short10', 'fame', 'Ten festival laurels for your shorts', () => [shortLaurels(), 10], 6);
amb('x_shortwin', 'fame', 'Win a prize with a short', () => [myShorts().reduce((n, w) => n + ((w.circuit || {}).laurels || []).filter(l => l.won).length, 0), 1], 5);
amb('x_shortoswald', 'legend', 'Win the Oswald for best short film', () => [(S.me.milestones || []).some(m => /^Won at Academy Oswalds: Best Short Film/.test(m.t)) ? 1 : 0, 1], 8);
