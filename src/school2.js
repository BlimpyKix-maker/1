// ---------------- School that counts: pearls, grades, student shorts, and the shorts circuit as a career ----------------
// Lectures drop pearls: a story about a film from the first days of cinema, a technique the greats used. Now and
// then a tutor turns it into a question, and getting it right goes on your transcript. Your taste helps (a good eye
// rules out a wrong answer or two). Grades add up to a GPA: top of the class opens doors (job boards treat you as a
// prospect, festivals see a faculty letter, you graduate with distinction); falling behind puts you on probation,
// then out. Every year of a long course ends with a student short, made your way, and the school sends it to the
// student festivals (and you can send it further). The shorts circuit grew too: the real festivals that launch
// careers, each with its own jury, sections and side doors (sales to broadcasters, talent campuses, short film
// funds that pay for the next one).

// ---- more of the circuit: the festivals that launch careers ----
// [key, name, hub, founded, tier, kind, month (0-11), qualifying, top prize]
for (const row of [
  ['tammer', 'The Tammerkoski Short Film Festival', 'stockholm', 1970, 1, 'all', 2, 1, 'Grand Prix'],
  ['snowpine', 'Snowpine Film Festival Shorts', 'hollywood', 1978, 1, 'all', 0, 1, 'Short Film Grand Jury Prize'],
  ['rivierashort', 'The Riviera Short Film Palm', 'paris', 1955, 1, 'all', 4, 1, 'Short Film Palm'],
  ['cinefond', 'The Riviera Cinéfondation', 'paris', 1998, 1, 'student', 4, 0, 'First Prize'],
  ['berlinshort', 'Berlin Shorts (the Bear competition)', 'berlin', 1956, 1, 'all', 1, 1, 'Golden Bear for Best Short'],
  ['torontocuts', 'Toronto Short Cuts', 'toronto', 1976, 2, 'all', 8, 1, 'Best Short'],
  ['brigstow', 'Brigstow Encounters', 'london', 1995, 2, 'all', 8, 1, 'Grand Prix'],
  ['ottawaanim', 'The Ottawa Animation Festival', 'toronto', 1976, 1, 'anim', 8, 1, 'Grand Prize'],
  ['animazag', 'Animafest Zagreb', 'berlin', 1972, 2, 'anim', 5, 1, 'Grand Prix'],
  ['hamburgsh', 'Hamburg Short Film Festival', 'berlin', 1985, 2, 'all', 5, 0, 'Hamburg Short Film Prize'],
  ['viennashorts', 'Vienna Shorts', 'berlin', 2004, 2, 'all', 4, 1, 'Best Short'],
  ['poitiers', 'The Poitiers Film School Encounters', 'paris', 1977, 2, 'student', 11, 0, 'Grand Prix'],
  ['sehsucht', 'Sehnsucht Student Film Festival', 'berlin', 1972, 3, 'student', 3, 0, 'Best Film'],
  ['tribshorts', 'Tribeca Shorts', 'newyork', 2002, 2, 'all', 5, 1, 'Best Narrative Short'],
  ['hollyshorts', 'HollyShorts', 'hollywood', 2005, 3, 'all', 7, 1, 'Best Short'],
  ['southby', 'South by Southwest Shorts', 'hollywood', 1994, 2, 'all', 2, 1, 'Grand Jury Award'],
  ['arbor', 'The Ann Arbor Film Festival', 'newyork', 1963, 3, 'all', 2, 1, 'Ken Burns Award for Best of the Festival']
]) { const [k, name, hub, founded, tier, kind, month, qual, prize] = row; if (!SHORT_FEST[k] && (typeof HUBS === 'undefined' || HUBS[hub])) { SHORT_FEST[k] = { k, name, hub, founded, tier, kind, month, qual, prize }; SHORT_FESTS.push(row); } }
// who decides, what else they give, and the doors they open
const SF_INFO = {
  oberhaus: ['An international jury of five, plus a church jury and a press jury.', ['International Competition', 'German Competition', 'Children\'s and Youth', 'Music Video'], 'campus'],
  clermont: ['Three juries (international, national, lab) and an audience vote, in a town of shorts fanatics.', ['International', 'National', 'Lab (experimental)'], 'market'],
  palmvalley: ['A jury of working filmmakers; the audience award is often the one that sells.', ['Live Action', 'Animation', 'Documentary', 'Student'], 'market'],
  annesse: ['Animators judge animators: a jury of five, and a festival market where studios hire.', ['Short Films', 'Graduation Films', 'Commissioned Films'], 'market'],
  studentacad: ['Members of the Academy judge, in narrative, documentary, animation and alternative categories.', ['Narrative', 'Documentary', 'Animation', 'Alternative', 'International Film Schools'], 'campus'],
  tammer: ['An international jury, a Finnish jury and an audience that queues in the snow.', ['International', 'Domestic', 'Retrospectives'], 'market'],
  snowpine: ['Programmers pick about sixty shorts from twelve thousand; a jury of five gives the prizes.', ['U.S. Fiction', 'International Fiction', 'Nonfiction', 'Animation'], 'fund'],
  rivierashort: ['The feature jury\'s own short-film panel; one Palm, sometimes a special mention.', ['Competition', 'Critics\' Week shorts', 'Directors\' Fortnight shorts'], 'feature'],
  cinefond: ['Film schools only: a jury of filmmakers, and a residency in Paris for the winner\'s first feature.', ['Selection'], 'residency'],
  berlinshort: ['An international short film jury of three; the winner is the festival\'s nominee for the European awards.', ['Shorts competition', 'Generation (youth)'], 'campus'],
  torontocuts: ['The programmers\' picks and a jury; Canadian shorts get their own prize.', ['Short Cuts'], 'market'],
  brigstow: ['A jury per strand, BAFTA- and Academy-qualifying.', ['Brief Encounters', 'Animated Encounters', 'Encounters Kids'], 'fund'],
  ottawaanim: ['Animators on the jury; studios recruit in the corridors.', ['Short Competition', 'Student', 'Commissioned'], 'market'],
  animazag: ['One of the oldest animation festivals: a jury of five and a public vote.', ['Grand Competition', 'Student', 'Croatian'], 'market'],
  hamburgsh: ['A jury, an audience prize and the famous three-minute "Quartz" category.', ['International', 'German', 'Three-Minute Quickie'], 'campus'],
  viennashorts: ['Juries per strand; a qualifying win for the Academy.', ['Fiction & Documentary', 'Animation Avantgarde', 'Music Video'], 'campus'],
  poitiers: ['Film schools from forty countries; a jury of film people and a student jury.', ['Competition'], 'residency'],
  sehsucht: ['Run by students, judged by professionals.', ['Fiction', 'Documentary', 'Animation', 'Experimental'], 'campus'],
  tribshorts: ['Programmers, a jury, and buyers from cable and streaming.', ['Narrative', 'Documentary', 'Animation', 'Student Visionary'], 'market'],
  hollyshorts: ['Agents and managers in the audience; the jury is working Hollywood.', ['Drama', 'Comedy', 'Horror', 'Animation'], 'feature'],
  southby: ['A jury per category; music videos and title design too.', ['Narrative', 'Documentary', 'Midnight', 'Animated'], 'market'],
  arbor: ['The oldest experimental festival in America; a jury of artists.', ['Competition'], 'fund']
};
function sfInfo(k) { return SF_INFO[k] || ['A jury of filmmakers and critics.', ['Competition'], 'campus']; }
{ const _vsf = viewShortFest; viewShortFest = function (fk) { const h = _vsf(fk), F = SHORT_FEST[fk]; if (!F) return h; const [jury, sec, door] = sfInfo(fk);
  const doorT = { campus: 'A talent campus: winners and some of the selected are invited to a week of masterclasses with people who hire.', market: 'A short film market: broadcasters and shorts distributors buy here.', fund: 'A short film fund: winners can get money for the next one.', feature: 'Producers in the audience: winners are asked about the feature.', residency: 'A residency: the winner gets months in a flat and money to write a first feature.' }[door];
  return h.replace('</div>', `</div><section class="panel"><h3>How it works</h3><p>${esc(jury)}</p><p class="small"><b>Sections:</b> ${sec.map(esc).join(' · ')}</p><p class="small"><b>The side door:</b> ${esc(doorT)}</p>${F.qual ? '<p class="small good">A win here qualifies a short for the Oswalds.</p>' : ''}</section>`); }; }

// ---- pearls: questions from the lecture ----
function quizFilmPool() { const A = archive(); if (A.qfp && A.qfp.y === S.year) return A.qfp.L; const L = Object.keys(FICTION.note).filter(k => k.startsWith('f:')).map(k => k.slice(2)).filter(id => S.cat.allFilms[id] && S.cat.allFilms[id].y < S.year); A.qfp = { y: S.year, L }; return L; }
function makeQuiz(craft) {
  const r = prnd(), opts = [], pick = L => L[Math.floor(prnd() * L.length)];
  let q, ans, pearl, kind;
  const fields = (typeof CRAFT_FIELDS !== 'undefined' && CRAFT_FIELDS[craft]) || Object.keys(CURR);
  if (r < .55 && quizFilmPool().length > 8) {   // film history: which film is this?
    const P = quizFilmPool(), id = pick(P), f = S.cat.allFilms[id]; kind = 'history';
    q = `"${FICTION.note['f:' + id]}" Which film is the lecturer talking about?`; ans = `${f.t} (${f.y})`; pearl = `${f.t}, ${f.y}. ${(S.cat.facts && S.cat.facts[id] && S.cat.facts[id][0] && S.cat.facts[id][0][1]) || ''}`.trim();
    const near = P.filter(x => x !== id && Math.abs(S.cat.allFilms[x].y - f.y) <= 15); for (let i = 0; i < 40 && opts.length < 3; i++) { const o = S.cat.allFilms[pick(near.length >= 3 ? near : P)]; const s = `${o.t} (${o.y})`; if (s !== ans && !opts.includes(s)) opts.push(s); }
  } else if (r < .8) {   // technique: what's it called?
    const fs = fields.filter(x => CURR[x] && CURR[x].lessons && CURR[x].lessons.length >= 4); if (!fs.length) return null;
    const f = pick(fs), Ls = CURR[f].lessons, i = Math.floor(prnd() * Ls.length), L = Ls[i]; kind = 'craft';
    const strip = s => String(s).replace(/<[^>]+>/g, '');
    q = `"${strip(L[2])}" What's the name for this?`; ans = strip(L[1]); pearl = `${strip(L[1])}: ${strip(L[3])}`;
    for (let k = 0; k < 40 && opts.length < 3; k++) { const o = strip(Ls[Math.floor(prnd() * Ls.length)][1]); if (o !== ans && !opts.includes(o)) opts.push(o); }
  } else {   // when?
    const P = quizFilmPool(); if (!P.length) return null; const id = pick(P), f = S.cat.allFilms[id], dec = Math.floor(f.y / 10) * 10; kind = 'dates';
    q = `Pop quiz: when did ${f.t} come out?`; ans = `The ${dec}s`; pearl = `${f.t} came out in ${f.y}. ${FICTION.note['f:' + id] || ''}`;
    for (const d of [dec - 20, dec - 10, dec + 10, dec + 20].filter(d => d >= 1890 && d <= S.year).sort(() => prnd() - .5)) { if (opts.length < 3) opts.push(`The ${d}s`); }
  }
  if (opts.length < 2) return null;
  const all = opts.concat([ans]).sort(() => prnd() - .5);
  return { q, ans, pearl, kind, all };
}
// how many wrong answers your eye rules out
function quizRuleOut() { const t = Math.max(statVal('tas'), statVal('vis') - 2); return t >= 17 ? 2 : t >= 13 ? 1 : 0; }
function popQuiz(src) {
  const M = S.me; if (pending().some(it => it.kind === 'quiz')) return;
  const Q = makeQuiz(M.school ? M.school.craft : 'dir'); if (!Q) return;
  const out = quizRuleOut(), wrong = Q.all.filter(a => a !== Q.ans).sort(() => prnd() - .5).slice(0, out);
  const who = src === 'class' ? 'The tutor stops mid-sentence and points at you.' : src === 'pub' ? 'Film round at the pub quiz. Your team looks at you.' : 'Someone on set tests you, half joking.';
  inbox('quiz', src === 'class' ? 'A question in class' : src === 'pub' ? 'Pub quiz: the film round' : 'A test', `${who}\n\n${Q.q}${out ? `\n\nYour eye rules out ${out === 1 ? 'one answer' : 'two answers'}.` : ''}`, { src, qz: Q, choices: Q.all.map((a, i) => ({ k: 'a' + i, label: (wrong.includes(a) ? '✗ ' : '') + a, dis: wrong.includes(a) })) });
}
function quizPick(it, k) {
  if (it.kind !== 'quiz') return false;
  const M = S.me, me = ME(), Q = it.qz; it.done = true; if (!Q) return true;
  const a = Q.all[+String(k).slice(1)], ok = a === Q.ans;
  if (ok) { growSub(me, Q.kind === 'craft' ? (M.school ? Object.keys(CRAFTS[M.school.craft].subs)[0] : 'tas') : 'tas', .12); M.stress = clamp(M.stress - 1, 0, 100); }
  if (M.school && it.src === 'class') schoolMark(ok ? 4 : 1, ok ? 'Answered in class' : 'Got it wrong in class');
  if (it.src === 'pub' && ok) { M.cash += usd(25); }
  (M.pearls = M.pearls || []).push({ w: S.week, t: Q.pearl.slice(0, 400), ok: ok ? 1 : 0 }); if (M.pearls.length > 60) M.pearls.shift();
  it.result = { ok, t: `${ok ? 'Right.' : `Not quite: it's ${Q.ans}.`} ${Q.pearl}` };
  return true;
}

// ---- grades ----
function schoolMark(v, why) { const sc = S.me.school; if (!sc) return; (sc.marks = sc.marks || []).push(v); if (sc.marks.length > 80) sc.marks.shift(); sc.lastMark = why; }
function gpaOf(sc) { const m = sc && sc.marks || []; if (!m.length) return null; return m.reduce((a, b) => a + b, 0) / m.length; }
function gpaLetter(g) { return g === null ? '—' : g >= 3.7 ? 'A' : g >= 3.3 ? 'A−' : g >= 3 ? 'B+' : g >= 2.7 ? 'B' : g >= 2.3 ? 'B−' : g >= 2 ? 'C+' : g >= 1.7 ? 'C' : g >= 1.3 ? 'D' : 'F'; }
{ const _learn = learn; learn = function (id, how, grade) { const r = _learn(id, how, grade); if (S.me && S.me.school && grade && (how === 'class' || how === 'project')) schoolMark({ A: 4, B: 3, C: 1.7 }[grade] || 2, how === 'project' ? 'Project' : 'Class exercise'); return r; }; }
// what grades do for you
{ const _hf = hireFactors; hireFactors = function (post) { const F = _hf(post), M = S.me, g = M.school ? gpaOf(M.school) : null, hon = (M.honours || []).length && S.week - M.honoursW < 104;
  if (post.tier <= 1 && ((g !== null && g >= 3.5 && (M.school.marks || []).length >= 4) || hon)) F.push([hon && !M.school ? 'Graduated with distinction' : 'Top of your class', .6]);
  else if (post.tier <= 1 && g !== null && g < 2 && (M.school.marks || []).length >= 6) F.push(['Struggling at school', -.3]);
  return F; }; }
if (typeof festSelOdds === 'function') { const _fs2 = festSelOdds; festSelOdds = function (F, f) { const p = _fs2(F, f), M = S.me; return M && (M.honours || []).length && S.week - M.honoursW < 156 && f.co === M.company ? Math.min(.9, p + .02) : p; }; }
{ const _sso = shortSelOdds; shortSelOdds = function (q, tier) { const M = S.me, g = M && M.school ? gpaOf(M.school) : null; return Math.min(.9, _sso(q, tier) + (g !== null && g >= 3.5 ? .03 : 0) + ((M && (M.honours || []).length && S.week - M.honoursW < 104) ? .02 : 0)); }; }
// probation, and the honours at the end
function gradeWeek() {
  const M = S.me, sc = M.school; if (!sc) return;
  const g = gpaOf(sc), n = (sc.marks || []).length; if (g === null) return;
  if (n >= 10 && g < 1.4 && !sc.out) { sc.out = 1; inbox('note', 'Asked to leave', `Your grades (${gpaLetter(g)}) are too low. The school lets you go at the end of term.`); milestone('Left school with poor grades', 'school'); M.school = null; return; }
  if (n >= 6 && g < 2 && !sc.prob) { sc.prob = 1; inbox('note', 'Academic probation', `Your grades are a ${gpaLetter(g)}. Bring them up or you'll be asked to leave. (Go to class; answer when they ask.)`); }
  if (sc.prob && g >= 2.3) { sc.prob = 0; inbox('note', 'Off probation', 'Your grades are back where they need to be.'); }
}
{ const _sg = typeof schoolGraduate === 'function' ? schoolGraduate : null;
  schoolGraduate = function (sc) { if (_sg) _sg(sc); const M = S.me, g = gpaOf(sc); if (g !== null && g >= 3.5) { (M.honours = M.honours || []).push(sc.prog); M.honoursW = S.week; ME().standing = clamp(ME().standing + 2, 0, 100); milestone(`Graduated with distinction (${gpaLetter(g)})`, 'school'); inbox('note', 'With distinction', `You graduate at the top of your year. The faculty write letters for you, and a lecturer says she'll call you about a job.`); } }; }
// class pops quizzes; the occasional pub quiz outside it
function quizWeek() {
  const M = S.me; if (!M.party || !M.party.done) return;
  const days = M.school && typeof schoolDaysDone === 'function' ? schoolDaysDone() : 0;
  if (M.school && days > 0 && prnd() < .45) popQuiz('class');
  else if (!M.school && prnd() < .05) popQuiz(prnd() < .6 ? 'pub' : 'set');
}

// ---- the student short: every year of a long course ----
function yearShortWeek() {
  const M = S.me, sc = M.school; if (!sc) return; const P0 = schoolProg(sc); if (!P0 || P0.weeks < 30) return;
  const per = Math.max(30, Math.round(P0.weeks / Math.max(1, Math.round(P0.weeks / 45)))), due = ((sc.ys || 0) + 1) * per;
  if (sc.done < due - 2 || sc.done >= P0.weeks - 4 || pending().some(it => it.kind === 'yearshort')) return;
  sc.ys = (sc.ys || 0) + 1;
  const crew = (M.known ? Object.entries(M.known).filter(([, k]) => (k.tags || []).includes('Classmate')).length : 0);
  inbox('yearshort', 'Your student short', `End of year ${sc.ys}: everyone makes a short. Five days, school kit, ${crew ? crew + ' classmates who owe you favours' : 'whoever will help'}. How do you make it?`, { choices: [
    { k: 'safe', label: `Make it clean and simple · ${checkLabel('comp', 11)}`, check: ['comp', 11] },
    { k: 'big', label: `Swing for something nobody's tried · ${checkLabel('vis', 15)}`, check: ['vis', 15] },
    { k: 'crew', label: `Make it with the best people in your year · ${checkLabel('col', 12)}`, check: ['col', 12] },
    { k: 'doc', label: `Shoot something true, on the street · ${checkLabel('dact', 13)}`, check: ['dact', 13] }] });
}
function yearShortPick(it, k) {
  if (it.kind !== 'yearshort') return false;
  const M = S.me, me = ME(), sc = M.school; it.done = true; if (!sc) { it.result = { t: 'You left before you made it.' }; return true; }
  const C = { safe: ['comp', 11, 6, -4], big: ['vis', 15, 16, -10], crew: ['col', 12, 9, -5], doc: ['dact', 13, 11, -6] }[k] || ['comp', 11, 6, -4];
  const ok = roll(C[0], C[1]), r = M.lastRoll, g = gpaOf(sc) ?? 2.5;
  const sk = ['vstory', 'dact', 'comp'].reduce((t, s) => t + skillOf(me, s), 0) / 3;
  const q = clamp(Math.round(sk * 3.2 + 22 + (g - 2) * 5 + (ok ? C[2] : C[3]) + (r && r.crit > 0 ? 8 : 0) + pgauss() * 7), 8, 95);
  const w = { id: (M.works || []).length, type: 'short', title: shortTitle(M.id * 53 + S.week), q, rel: S.week, plat: 'circuit', units: 0, earned: 0, wk: [], promo: 0, cost: 0, student: 1 };
  (M.works = M.works || []).push(w);
  const pool = Object.values(SHORT_FEST).filter(F => F.founded <= S.year && F.kind === 'student');
  w.v0 = 0; w.circuit = { from: S.week, subs: pool.map(F => ({ k: F.k, due: nextMonthWeek(F.month) })).filter(x => x.due - S.week <= 52), laurels: [] };
  schoolMark(q >= 70 ? 4 : q >= 55 ? 3 : q >= 40 ? 2 : 1, 'Year short');
  if (k === 'crew') for (const id of Object.entries(M.known).filter(([, kk]) => (kk.tags || []).includes('Classmate')).map(([id]) => +id).slice(0, 3)) addTie(me, P(id), ok ? 5 : 2);
  const verdict = q >= 75 ? 'The screening goes quiet in the right way. A lecturer asks for a copy.' : q >= 55 ? 'It plays well. People laugh where you hoped.' : q >= 40 ? 'It\'s fine. Everyone says it\'s fine.' : 'It doesn\'t work, and you can see exactly why. That\'s the lesson.';
  it.result = { ok, roll: r, t: `${w.title}: ${verdict} The school sends it to ${pool.length} student festival${pool.length === 1 ? '' : 's'}${q >= 60 ? '; it\'s good enough to send further, from the Shorts Circuit' : ''}.` };
  return true;
}

// ---- side doors on the circuit: sales, campuses, funds ----
function shortDoorsWeek() {
  const M = S.me, me = ME();
  for (const w of (M.works || []).filter(x => x.type === 'short' && x.circuit)) {
    const C = w.circuit, done = C.subs.filter(s => s.done && (s.res === 'selected' || s.res === 'won') && !s.door);
    for (const s of done) {
      s.door = 1; const F = SHORT_FEST[s.k]; if (!F) continue; const door = sfInfo(s.k)[2], won = s.res === 'won';
      if (door === 'market' && prnd() < (won ? .7 : .3) && !C.sold) {
        const fee = usd(Math.round((800 + Math.max(0, w.q - 40) * 120) * (4 - F.tier) * (won ? 1.6 : 1) / 10) * 10);
        inbox('shortsale', `A buyer for ${w.title}`, `At the ${F.name} market, a shorts distributor offers to represent ${w.title} to broadcasters and airlines (they keep 30%), and a broadcaster offers ${fmtCash(fee)} for the TV rights outright.`, { work: w.id, fee, choices: [{ k: 'dist', label: 'Sign with the distributor (slower, often more)' }, { k: 'tv', label: `Take the broadcaster's ${fmtCash(fee)}` }, { k: 'haggle', label: `Hold out for more · ${checkLabel('com', 13)}`, check: ['com', 13] }, { k: 'no', label: 'Keep it for an online premiere' }] });
      } else if (door === 'campus' && (won || prnd() < .25) && M.campusY !== S.year) {
        inbox('campus2', `${F.name}: the talent campus`, `${w.title} gets you invited to a week of masterclasses and pitch meetings for young filmmakers.`, { campus: F.k, choices: [{ k: 'yes', label: 'Go (a tiring week)' }, { k: 'pitch', label: `Go, and pitch your next film to everyone · ${checkLabel('pres', 13)}`, check: ['pres', 13] }, { k: 'no', label: 'Not this year' }] });
        M.campusY = S.year;
      } else if (door === 'fund' && won) {
        const g = usd(12000 + w.q * 150); M.cash += g; milestone(`Short film fund grant: ${fmtCash(g)}`, 'money'); inbox('note', 'A grant for the next one', `${F.name}'s short film fund gives you ${fmtCash(g)} toward your next short.`);
      } else if (door === 'residency' && won) {
        me.standing = clamp(me.standing + 3, 0, 100); M.energy = clamp(M.energy + 10, 0, 100); milestone(`${F.name} residency`, 'prize');
        inbox('note', 'A residency', `Four months in a flat in Paris, a stipend and a mentor, to write your first feature. You come back with a draft and a lot of opinions about bread.`);
        if (typeof growSub === 'function') { growSub(me, 'struc', .5); growSub(me, 'vis', .3); }
      } else if (door === 'feature' && won && !C.devOffer) {
        C.devOffer = 1; inbox('shortdev', 'A producer wants the feature', `"${w.title} is the first ten minutes of a feature." An option fee of ${fmtCash(usd(6000))} and a development deal.`, { work: w.id, choices: [{ k: 'yes', label: 'Take the deal' }, { k: 'no', label: 'Keep it a short' }] });
      }
    }
  }
}
function shortSalePick(it, k) {
  if (it.kind !== 'shortsale') return false;
  const M = S.me, w = (M.works || [])[it.work]; it.done = true; if (!w) return true;
  let t = '';
  if (k === 'tv') { M.cash += it.fee; w.earned = (w.earned || 0) + it.fee; w.circuit.sold = 1; t = `Sold: ${fmtCash(it.fee)}. It airs at one in the morning to an audience of insomniacs and other filmmakers.`; }
  else if (k === 'dist') { w.circuit.sold = 1; w.distTo = S.week + 40; w.distFee = Math.round(it.fee * (1.2 + prnd() * 1.4) * .7); t = `Signed. They'll sell it territory by territory over the next year.`; }
  else if (k === 'haggle') { const ok = roll('com', 13); if (ok) { const v = Math.round(it.fee * 1.5); M.cash += v; w.earned = (w.earned || 0) + v; w.circuit.sold = 1; t = `They come back with ${fmtCash(v)}.`; } else t = 'They buy somebody else\'s short instead.'; it.result = { ok, roll: M.lastRoll, t }; return true; }
  else { w.v0 = (w.v0 || 0) + 500; t = 'You keep it for the internet. A premiere online will find more people anyway.'; }
  it.result = { t }; return true;
}
function shortDistWeek() { const M = S.me; for (const w of (M.works || []).filter(x => x.distTo && !x.distPaid && S.week >= x.distTo)) { w.distPaid = 1; M.cash += w.distFee; w.earned = (w.earned || 0) + w.distFee; inbox('note', `${w.title}: the distributor pays`, `Sales to eleven broadcasters and two airlines, after their cut: ${fmtCash(w.distFee)}.`); } }

// ---- pages: the transcript ----
function transcriptHTML() {
  const M = S.me, sc = M.school; if (!sc) return '';
  const g = gpaOf(sc), n = (sc.marks || []).length, P = (M.pearls || []).slice(-5).reverse();
  return `<section class="panel"><h3>Your grades <span class="count">${n} marks</span></h3><div class="kpis mini"><div><span>GPA</span><b class="${g === null ? '' : g >= 3.5 ? 'good' : g < 2 ? 'bad' : ''}">${g === null ? '—' : g.toFixed(2)}</b></div><div><span>Grade</span><b>${gpaLetter(g)}</b></div><div><span>Standing</span><b>${g === null ? 'New' : g >= 3.5 ? 'Top of the class' : sc.prob ? 'On probation' : g >= 2.7 ? 'Good' : 'Getting by'}</b></div><div><span>Year shorts</span><b>${sc.ys || 0}</b></div></div>
   <p class="small muted">Class exercises, projects, questions in class and your year short all count. Top of the class (3.5+) helps you on job boards and at festivals, and graduates you with distinction; under 2.0 is probation.${sc.lastMark ? ` Last mark: ${esc(sc.lastMark)}.` : ''}</p>
   ${P.length ? `<h4>Pearls from the lectures</h4><ul class="plain small">${P.map(p => `<li>${p.ok ? '✅' : '📝'} ${esc(p.t)}</li>`).join('')}</ul>` : ''}</section>`;
}
{ const _msp = mySchoolPage; mySchoolPage = function () { const h = _msp(); return S.me.school ? h.replace('<div class="mn-bar">', transcriptHTML() + '<div class="mn-bar">') : h; }; }
{ const _pp = pathsPanel; pathsPanel = function () { const h = _pp(), sc = S.me.school; if (!sc) return h; const g = gpaOf(sc); return h.replace('<h3>School</h3>', `<h3>School</h3><p class="small">Grades: <b>${gpaLetter(g)}</b>${g !== null ? ` (${g.toFixed(2)})` : ''}${sc.prob ? ' · <span class="bad">on probation</span>' : g !== null && g >= 3.5 ? ' · <span class="good">top of the class</span>' : ''}</p>`); }; }
function school2Week() { quizWeek(); gradeWeek(); yearShortWeek(); shortDoorsWeek(); shortDistWeek(); }
function campus2Pick(it, k) {
  if (it.kind !== 'campus2') return false;
  const M = S.me, me = ME(); it.done = true; if (k === 'no') { it.result = { t: 'Maybe next year.' }; return true; }
  M.energy = clamp(M.energy - 15, 0, 100); me.standing = clamp(me.standing + 1.5, 0, 100);
  const met = []; for (let i = 0; i < 3; i++) { const q = bestIn(M.hub, ['producer', 'director', 'writer', 'dp'], q => q.standing * .5 + prnd() * 40 - (met.includes(q.id) ? 999 : 0)); if (q) { meet(q.id, 'At the talent campus', 8); met.push(q.id); } }
  let ok = null, t = `A week of masterclasses. You come home with ${met.length} new numbers${met.length ? ', ' + met.map(id => P(id).name).join(', ') : ''}.`;
  if (k === 'pitch') { ok = roll('pres', 13); if (ok) { me.standing = clamp(me.standing + 2, 0, 100); t += ' Your pitch is the one people talk about at the closing party.'; if (met[0] !== undefined) trust(met[0], 8); } else t += ' Your pitch runs long, and a producer checks her phone.'; }
  it.result = { ok, roll: ok === null ? null : M.lastRoll, t }; return true;
}
function school2Pick(it, k) { return quizPick(it, k) || yearShortPick(it, k) || shortSalePick(it, k) || campus2Pick(it, k); }
