// ---------------- Standing: your ambitions and your reputation ----------------
// Two pages that answer "how am I doing?". Ambitions: every goal there is, in six groups, with progress; reach one and
// a reward waits to be claimed; pin up to three to keep them in front of you. Reputation: what the business actually
// thinks, worked out from what you've done: eight traits on a chart, the kind of player people take you for, how each
// circle sees you, and what the people who know you say behind your back.
const AMB_CAT = { start: 'Getting started', craft: 'Craft and career', money: 'Money', fame: 'Audience and fame', power: 'Industry power', legend: 'Legend' };
const AMB_CATS = { contacts: 'start', firstjob: 'start', cushion: 'money', credit: 'craft', script: 'craft', contest: 'craft', level2: 'craft', agent: 'craft', corner: 'start', five: 'craft', senior: 'craft', level3: 'craft', ownfilm: 'craft', festival: 'fame', level4: 'craft', award: 'fame' };
const maxFol = () => Math.max(0, ...Object.values(S.me.fol || {}));
const corpRung = () => { const j = S.me.jobs.find(x => /^corp_/.test(x.k)); const past = S.me.past.filter(x => /^corp_/.test(x.k)).map(x => +x.k.slice(5)); return Math.max(j ? +j.k.slice(5) : -1, ...past, -1); };
const wonShow = show => (S.me.milestones || []).some(m => m.kind === 'prize' && /^Won/.test(m.t) && m.t.includes(show));
AMBITIONS.push(
  { k: 'firstwork', c: 'start', t: 'Release something of your own', p: () => [(S.me.works || []).length + (S.me.scripts || []).filter(s => s.grade).length, 1], rw: 1 },
  { k: 'mentor', c: 'start', t: 'Find a mentor', p: () => [S.me.mentor || (S.me.mentors || []).length ? 1 : 0, 1], rw: 2 },
  { k: 'school', c: 'craft', t: 'Graduate from a school', p: () => [(S.me.alma || []).length + S.me.degrees.filter(d => d !== 'film').length > 0 ? 1 : 0, 1], rw: 2 },
  { k: 'elite', c: 'craft', t: 'Get into one of the great schools', p: () => [[S.me.school && S.me.school.at, ...(S.me.alma || [])].some(id => id && SCHOOL_BY[id] && SCHOOL_BY[id][4] === 1) ? 1 : 0, 1], rw: 3 },
  { k: 'crossover', c: 'craft', t: 'Work in three different industries', p: () => [Object.values(fieldExp()).filter(v => v >= 1).length, 3], rw: 3 },
  { k: 'mentorgrad', c: 'craft', t: 'Complete a mentorship', p: () => [(S.me.mentors || []).length, 1], rw: 3 },
  { k: 'twenty', c: 'craft', t: 'Twenty screen credits', p: () => [S.me.past.filter(x => x.credited).length, 20], rw: 5 },
  { k: 'level5', c: 'craft', t: 'Reach level 5: the top of your craft', p: () => [careerLevel(), 5], rw: 6 },
  { k: 'level6', c: 'craft', t: 'Reach level 6: a name people know', p: () => [careerLevel(), 6], rw: 8 },
  { k: 'level7', c: 'craft', t: 'Reach level 7: a legend of the business', p: () => [careerLevel(), 7], rw: 12 },
  { k: 'tenk', c: 'money', t: 'Have $10,000 in the bank', p: () => [Math.max(0, S.me.cash), usd(10000)], rw: 1, money: 1 },
  { k: 'hundredk', c: 'money', t: 'Have $100,000 in the bank', p: () => [Math.max(0, S.me.cash), usd(100000)], rw: 3, money: 1 },
  { k: 'million', c: 'money', t: 'Become a millionaire', p: () => [Math.max(0, S.me.cash), usd(1000000)], rw: 6, money: 1 },
  { k: 'fans1k', c: 'fame', t: 'A thousand followers', p: () => [maxFol(), 1000], rw: 1 },
  { k: 'fans100k', c: 'fame', t: 'A hundred thousand followers', p: () => [maxFol(), 100000], rw: 4 },
  { k: 'fans1m', c: 'fame', t: 'A million followers', p: () => [maxFol(), 1000000], rw: 7 },
  { k: 'platinum', c: 'fame', t: 'A million streams on one song', p: () => [Math.max(0, ...(S.me.works || []).filter(w => w.type === 'song').map(w => w.units)), 1000000], rw: 5 },
  { k: 'fame50', c: 'fame', t: 'Become a household name (fame 50)', p: () => [Math.round(ME().fame || 0), 50], rw: 5 },
  { k: 'corp', c: 'power', t: 'Join a company\'s ladder', p: () => [corpRung() >= 0 ? 1 : 0, 1], rw: 1 },
  { k: 'vp', c: 'power', t: 'Become a vice president', p: () => [Math.max(0, corpRung()), 4], rw: 4 },
  { k: 'president', c: 'power', t: 'Run production at a company', p: () => [Math.max(0, corpRung()), 6], rw: 6 },
  { k: 'ceo', c: 'power', t: 'Become a chief executive', p: () => [Math.max(0, corpRung()), 7], rw: 8 },
  { k: 'found', c: 'power', t: 'Found your own company', p: () => [S.me.company !== undefined ? 1 : 0, 1], rw: 3 },
  { k: 'threehits', c: 'power', t: 'Three hits from your own company', p: () => [S.me.company !== undefined ? S.companies[S.me.company].hits : 0, 3], rw: 6 },
  { k: 'titan', c: 'power', t: 'Standing 80: an industry titan', p: () => [Math.round(ME().standing), 80], rw: 7 },
  { k: 'oswald', c: 'legend', t: 'Win an Oswald', p: () => [wonShow('Academy Oswalds') ? 1 : 0, 1], rw: 8 },
  { k: 'gramophone', c: 'legend', t: 'Win a Gramophone', p: () => [wonShow('The Gramophones') ? 1 : 0, 1], rw: 6 },
  { k: 'footlight', c: 'legend', t: 'Win a Footlight', p: () => [wonShow('The Footlights') ? 1 : 0, 1], rw: 6 },
  { k: 'emmet', c: 'legend', t: 'Win an Emmet', p: () => [wonShow('The Emmets') ? 1 : 0, 1], rw: 6 },
  { k: 'egof', c: 'legend', t: 'Complete the EGOF', p: () => [Object.keys(egofWins()).length, 4], rw: 10 }
);
for (const A of AMBITIONS) A.c = A.c || AMB_CATS[A.k] || 'craft';
function claimAmb(a) {
  const M = S.me, me = ME(), A = AMBITIONS.find(x => x.k === a.k);
  if (!A || (M.amb || {})[A.k] === undefined || (M.ambClaim || {})[A.k]) return false;
  (M.ambClaim = M.ambClaim || {})[A.k] = S.week;
  me.standing = clamp(me.standing + A.rw * .15, 0, 100); M.stress = clamp(M.stress - A.rw * 3, 0, 100); M.energy = clamp(M.energy + A.rw * 2, 0, 100);
  const cash = usd(A.rw * A.rw * 60); M.cash += cash;
  if (M.ambPin) M.ambPin = M.ambPin.filter(k => k !== A.k);
  diary(`Ambition claimed: ${A.t.toLowerCase()}. +${fmtCash(cash)}, a little more standing, a little less stress.`);
  return true;
}
function pinAmb(a) { const M = S.me, L = M.ambPin = M.ambPin || []; if (!AMBITIONS.some(x => x.k === a.k)) return false; const i = L.indexOf(a.k); if (i >= 0) L.splice(i, 1); else { if (L.length >= 3) L.shift(); L.push(a.k); } return true; }
function ambClaimable() { const M = S.me; return AMBITIONS.filter(A => (M.amb || {})[A.k] !== undefined && !(M.ambClaim || {})[A.k]); }
function ambRow(A) {
  const M = S.me, done = (M.amb || {})[A.k] !== undefined, claimed = (M.ambClaim || {})[A.k], pinned = (M.ambPin || []).includes(A.k), [c, n] = A.p(), pct = clamp(c / n, 0, 1);
  return `<div class="ambrow${done ? ' done' : ''}"><span>${done ? (claimed ? '✓ ' : '★ ') : ''}${esc(A.t)}</span><span class="tbar"><i style="width:${Math.round((done ? 1 : pct) * 100)}%"></i></span><span class="small muted">${done ? (claimed ? 'claimed ' + fmtDate(claimed, true) : 'reached!') : A.money ? fmtCash(Math.min(c, n)) + ' / ' + fmtCash(n) : Math.min(c, n).toLocaleString() + ' / ' + n.toLocaleString()}</span><span>${done && !claimed ? `<button class="btn-s" data-ambclaim="${A.k}">Claim ${'✦'.repeat(Math.min(3, Math.ceil(A.rw / 3)))}</button>` : !done ? `<button class="linkish" data-ambpin="${A.k}" title="${pinned ? 'Unpin' : 'Pin to keep it in view'}">${pinned ? '📌 Pinned' : 'Pin'}</button>` : ''}</span></div>`;
}
// Within a group: rewards waiting first, then the goals you're closest to, then what's done.
function ambSorted(L) {
  const M = S.me, rank = A => { const done = (M.amb || {})[A.k] !== undefined; if (done) return (M.ambClaim || {})[A.k] ? 3 : -1; let c = 0, n = 1; try { [c, n] = A.p(); } catch (e) { /* not ready */ } return 1 - clamp(c / n, 0, 1); };
  return L.map(A => [A, rank(A)]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
}
function ambitionsPage() {
  if (typeof ambFresh === 'function') ambFresh();
  const M = S.me, done = AMBITIONS.filter(A => (M.amb || {})[A.k] !== undefined).length, pins = (M.ambPin || []).map(k => AMBITIONS.find(A => A.k === k)).filter(Boolean), cl = ambClaimable();
  return `<section class="panel amb"><h3>Ambitions <span class="count">${done} of ${AMBITIONS.length}</span></h3>
   ${cl.length ? `<div class="claimbar">✦ ${cl.length} reward${cl.length > 1 ? 's' : ''} waiting: ${cl.map(A => `<button class="btn-s" data-ambclaim="${A.k}">${esc(A.t)}</button>`).join(' ')}</div>` : ''}
   ${pins.length ? `<h4>📌 Pinned</h4>${pins.map(ambRow).join('')}` : '<p class="muted small">Pin up to three goals to keep them on your Today page.</p>'}
   ${Object.entries(AMB_CAT).map(([c, l]) => { const L = ambSorted(AMBITIONS.filter(A => A.c === c)); return L.length ? `<details class="ambcat"${c === 'start' || c === 'craft' ? ' open' : ''}><summary><b>${l}</b> <span class="count">${L.filter(A => (M.amb || {})[A.k] !== undefined).length} of ${L.length}</span></summary>${L.map(ambRow).join('')}</details>` : ''; }).join('')}
   <p class="muted small">Reach a goal and its reward waits here: standing, some cash, energy back and stress off. Bigger goals, bigger rewards.</p></section>`;
}
function pinnedAmbHTML() { if (typeof ambFresh === 'function') ambFresh(); const M = S.me, cl = ambClaimable(); let pins = (M.ambPin || []).map(k => AMBITIONS.find(A => A.k === k)).filter(Boolean), near = false;
  // nothing pinned: offer the three goals you're closest to, so there's always something within reach
  if (!pins.length) { near = true; const open = AMBITIONS.filter(A => { if ((M.amb || {})[A.k] !== undefined) return false; try { const [c, n] = A.p(); return c < n; } catch (e) { return false; } });
    for (const cat of ['start', 'craft', 'money', 'fame', 'audience', 'power', 'collect', 'life', 'library', 'prizes', 'mastery']) { if (pins.length >= 3) break; const best = ambSorted(open.filter(A => A.c === cat))[0]; if (best) pins.push(best); } }
  if (!pins.length && !cl.length) return ''; return `<section class="panel"><h4>${near ? 'Within reach' : 'Your goals'}</h4>${cl.length ? `<p class="small">✦ <button class="linkish" data-dtab="standing">${cl.length} reward${cl.length > 1 ? 's' : ''} to claim</button></p>` : ''}${pins.map(ambRow).join('')}</section>`; }
// ---- reputation ----
const FACETS = [['talent', 'Talent'], ['reliability', 'Reliability'], ['bankability', 'Bankability'], ['prestige', 'Prestige'], ['warmth', 'Warmth'], ['integrity', 'Integrity'], ['fame', 'Fame'], ['power', 'Power']];
function facets() {
  const M = S.me, me = ME(), F = M.flags || {}, cr = MAIN[me.role] || 'wri';
  const known = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead), avgO = known.length ? avg(known.map(id => opinion(id))) : 0;
  const myF = typeof myFilms === 'function' ? myFilms().filter(f => f.rel !== null) : [], hits = myF.filter(f => f.hitRatio > 2).length, rev = myF.length ? avg(myF.map(f => f.reviews || 50)) : 50;
  const secrets = M.secrets || [], out = secrets.filter(x => x.out).length, prizes = (M.milestones || []).filter(m => m.kind === 'prize').length;
  return {
    talent: clamp(avg(Object.keys(CRAFTS[cr].subs).map(k => me.sk[k])) * 5, 0, 100),
    reliability: clamp(45 + (F.reliable !== undefined ? 15 : 0) + Math.min(30, M.past.filter(x => !x.quit).length * 3) - M.past.filter(x => x.quit).length * 8 - (F.fudger !== undefined ? 15 : 0), 0, 100),
    bankability: clamp(hits * 15 + Math.log10(1 + maxFol()) * 8 + (S.me.works || []).filter(w => w.units > 100000).length * 6, 0, 100),
    prestige: clamp(prizes * 14 + (rev - 50) * 1.2 + (M.alma || []).length * 6, 0, 100),
    warmth: clamp(50 + avgO, 0, 100),
    integrity: clamp(70 - out * 25 - secrets.length * 5 - (F.mudslinger !== undefined ? 20 : 0) + (F.whistle !== undefined ? 10 : 0) - Object.keys(M.black || {}).length * 4, 0, 100),
    fame: clamp(me.fame || 0, 0, 100),
    power: clamp(me.standing * .8 + Math.max(0, corpRung()) * 4 + (M.company !== undefined ? 8 : 0), 0, 100)
  };
}
const ARCHETYPES = {
  'talent+reliability': 'The craftsperson everyone wants on their crew', 'talent+prestige': 'An artist on the rise', 'talent+bankability': 'A rare thing: good and commercial', 'talent+warmth': 'Gifted, and kind with it',
  'reliability+warmth': 'The safe pair of hands', 'reliability+power': 'The operator', 'bankability+fame': 'A box-office draw', 'bankability+power': 'A deal-maker', 'prestige+fame': 'A festival darling turned star',
  'power+fame': 'A mogul in the making', 'warmth+fame': 'Everybody\'s favourite', 'integrity+warmth': 'The conscience of the room', 'integrity+talent': 'The real thing', 'power+integrity': 'A fair boss, which is rare',
  'prestige+integrity': 'An auteur of principle', 'reliability+integrity': 'Solid as a rock', 'bankability+reliability': 'A sure bet', 'fame+talent': 'A star with chops'
};
function archetype(F) { const top = Object.entries(F).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]); if (F[top[0]] < 25) return 'An unknown quantity'; if (F.integrity < 30) return F.power > 40 ? 'A shark, and people know it' : 'Someone people are careful around'; return ARCHETYPES[top.join('+')] || ARCHETYPES[top.slice().reverse().join('+')] || `Known for ${FACETS.find(f => f[0] === top[0])[1].toLowerCase()}`; }
function radarSVG(F, s = 240) {
  const c = s / 2, R = s / 2 - 52, n = FACETS.length, pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * R * v / 100, c + Math.sin(a) * R * v / 100]; };
  const ring = v => FACETS.map((_, i) => pt(i, v).map(x => x.toFixed(1)).join(',')).join(' ');
  return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="radar" style="overflow:visible" role="img" aria-label="Reputation chart">${[25, 50, 75, 100].map(v => `<polygon points="${ring(v)}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join('')}${FACETS.map((_, i) => { const [x, y] = pt(i, 100); return `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="var(--line)"/>`; }).join('')}
   <polygon points="${FACETS.map(([k], i) => pt(i, Math.max(4, F[k])).map(x => x.toFixed(1)).join(',')).join(' ')}" fill="var(--accent)" fill-opacity=".25" stroke="var(--accent)" stroke-width="2"/>
   ${FACETS.map(([k, l], i) => { const [x, y] = pt(i, 122); return `<text x="${x}" y="${y + 3}" text-anchor="middle" font-size="10" font-family="Barlow, sans-serif" fill="var(--ink, #333)">${l} ${Math.round(F[k])}</text>`; }).join('')}</svg>`;
}
const SAYS = {
  talent: [['Honestly the best I\'ve worked with at that level.', 'They make it look easy. It isn\'t.'], ['Talented? Sure. Not as much as they think.']],
  reliability: [['If they say Thursday, it\'s Thursday.', 'Never once the reason we waited.'], ['Brilliant when they turn up.']],
  warmth: [['Remembers your kids\' names. Who does that?', 'They brought soup when I was ill. Soup!'], ['Cold. Polite, but cold.']],
  integrity: [['Straight with you, even when it costs them.', 'Never heard them badmouth anyone.'], ['I\'d check my wallet after the meeting.', 'Watch what you say around them.']],
  power: [['When they call, people pick up.', 'One word from them and a film gets made.'], ['They\'d step on you to reach a shelf.']],
  fame: [['My mother asked for their autograph.', 'You can\'t walk down the street with them anymore.'], ['Famous for being around, mostly.']],
  bankability: [['Their name on a poster sells tickets.', 'Money follows them.'], ['They need a hit, and soon.']],
  prestige: [['The critics adore them. So do I.', 'Their work will outlast all of ours.'], ['A bit pleased with their reviews.']]
};
function circlesOf() {
  const M = S.me, by = { crew: [], executives: [], artists: [] };
  for (const id of Object.keys(M.known).map(Number)) { const p = P(id); if (!p || p.dead) continue; const g = ['producer', 'casting'].includes(p.role) ? 'executives' : ['actor', 'director', 'writer', 'composer'].includes(p.role) ? 'artists' : 'crew'; by[g].push(opinion(id)); }
  const myF = typeof myFilms === 'function' ? myFilms().filter(f => f.rel !== null) : [];
  return [['Crews', by.crew.length ? 50 + avg(by.crew) : null, 'the people on set and in the cutting room'], ['Executives', by.executives.length ? 50 + avg(by.executives) : null, 'producers and the people with the money'], ['Artists', by.artists.length ? 50 + avg(by.artists) : null, 'actors, directors, writers and composers'], ['Critics', myF.length ? avg(myF.map(f => f.reviews || 50)) : null, 'from the reviews of your work'], ['Audiences', Math.min(100, (ME().fame || 0) + Math.log10(1 + maxFol()) * 8), 'fame and followers']];
}
function reputationPage() {
  const M = S.me, me = ME(), F = facets(), arch = archetype(F);
  const known = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead), sorted = known.slice().sort((a, b) => opinion(b) - opinion(a));
  const strongest = Object.entries(F).sort((a, b) => b[1] - a[1])[0][0], weakest = Object.entries(F).sort((a, b) => a[1] - b[1])[0][0];
  const quotes = [...sorted.slice(0, 2).filter(id => opinion(id) > 15).map(id => [id, SAYS[strongest][0][id % SAYS[strongest][0].length]]), ...sorted.slice(-1).filter(id => opinion(id) < -5).map(id => [id, SAYS[weakest][1][id % SAYS[weakest][1].length]])];
  const C = circlesOf(), flags = Object.entries(M.flags || {}).filter(([k]) => REP_FLAGS[k]);
  return `<section class="panel reppanel"><h3>Your reputation</h3><div class="repgrid"><div>${radarSVG(F)}</div><div><p class="eyebrow">What the business takes you for</p><h2 class="arch">${esc(arch)}</h2>
    <p>Strongest: <b>${FACETS.find(f => f[0] === strongest)[1]}</b>. Weakest: <b>${FACETS.find(f => f[0] === weakest)[1]}</b>.</p>
    <h4>In the rooms you're not in</h4>${C.map(([l, v, d]) => `<div class="ambrow"><span>${l} <span class="muted small">${d}</span></span><span class="tbar"><i style="width:${v === null ? 0 : Math.round(clamp(v, 0, 100))}%"></i></span><span class="small muted">${v === null ? 'don\'t know you yet' : l === 'Audiences' ? (v >= 70 ? 'love you' : v >= 40 ? 'know you' : v >= 15 ? 'noticing you' : 'never heard of you') : l === 'Critics' ? (v >= 75 ? 'admire you' : v >= 60 ? 'like your work' : v >= 45 ? 'mixed' : 'unkind') : v >= 70 ? 'fans' : v >= 55 ? 'warm' : v >= 45 ? 'neutral' : v >= 30 ? 'wary' : 'hostile'}</span></div>`).join('')}</div></div>
   ${quotes.length ? `<h4>What people say about you</h4>${quotes.map(([id, q]) => `<blockquote class="say">“${esc(q)}” <span class="muted small">— ${pl(id)}, ${esc(ROLE_LABEL[P(id).role].toLowerCase())}</span></blockquote>`).join('')}` : ''}
   ${flags.length ? `<h4>What sticks to you</h4><ul class="plain">${flags.map(([k, w]) => `<li><b>${esc(REP_FLAGS[k].label)}</b> <span class="muted small">since ${fmtDate(w, true)}</span> · <span class="muted">${esc(REP_FLAGS[k].d)}</span></li>`).join('')}</ul>` : ''}
   ${(M.secrets || []).filter(x => !x.out).length ? `<p class="small bad">You have ${(M.secrets || []).filter(x => !x.out).length} secret${(M.secrets || []).filter(x => !x.out).length > 1 ? 's' : ''} that could come out.</p>` : ''}
   <p class="muted small">Every trait is worked out from what you've done: your skills, finished jobs, hits, prizes, what your contacts think, any secrets, your fame and your seat at the table. It changes as you do.</p></section>`;
}
function standingHTML() { return reputationPage() + (typeof egofHTML === 'function' ? egofHTML() : '') + (typeof trophyShelfHTML === 'function' ? trophyShelfHTML() : '') + (typeof achHTML === 'function' ? achHTML() : '') + ambitionsPage() + (typeof codexHTML === 'function' ? codexHTML() : ''); }
function standingClick(t) {
  const d = t.dataset;
  if (d.ambclaim) { doAct({ t: 'claimamb', k: d.ambclaim }); render(true); return true; }
  if (d.ambpin) { doAct({ t: 'pinamb', k: d.ambpin }); render(true); return true; }
  return false;
}
