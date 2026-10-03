// ---------------- Learning the craft: classes, the job, books, and the Craft Library ----------------
// The curriculum (CURR, in curric1-3) is taught three ways. At school, each week of study is a class: the lesson
// arrives with an exercise (a real decision with trade-offs), you choose, you roll the skill it tests, and the
// teacher's note explains what your choice did. On the job, finishing good work sometimes teaches you a lesson from
// your department, at the level of the job. Craft books from the Bazaar teach a field's opening lessons. What you
// know pays off: knowing a department's lessons makes its tasks easier. Every lesson, with its examples from this
// world's own films, is readable any time in the Craft Library.
const FAM_FIELDS = { set: ['ad', 'sup'], ad: ['ad', 'sup'], intern: ['ad'], cam: ['cam', 'light'], snd: ['snd', 'post'], art: ['des'], cos: ['cos', 'mkp'], act: ['act'], dir: ['dir', 'sup'], wri: ['wri', 'tv'], pro: ['pro', 'dist'], cst: ['cst'], office: ['pro', 'dist', 'wri'], cinema: ['dist'], edt: ['edt', 'col', 'post'], mus: ['mus'], vfx: ['vfx', 'anim'], stn: ['stn'], music: ['prodm', 'song'], creator: ['creator'], podcast: ['pod'], stage: ['stage'] };
const CRAFT_FIELDS = { dir: ['dir', 'sup', 'ad', 'doc'], wri: ['wri', 'tv'], cam: ['cam', 'light', 'col'], edt: ['edt', 'col', 'post'], pro: ['pro', 'dist'], mus: ['mus', 'prodm', 'song'], des: ['des', 'cos', 'mkp'], fx: ['vfx', 'anim', 'stn'], act: ['act', 'cst'] };
const BOOK_FIELD = { b_struct: 'wri', b_direct: 'dir', b_dp: 'cam', b_edit: 'edt', b_prod: 'pro', b_act: 'act', b_score: 'mus', b_design: 'des', b_hist: 'dist' };
const YEAR_LABEL = ['', 'Foundation', 'Practice', 'Mastery'];
function lesson(id) { const [f, i] = String(id).split(':'); const C = CURR[f]; return C && C.lessons[+i] ? { f, i: +i, C, L: C.lessons[+i] } : null; }
function projOf(id) { const [, f, k] = String(id).split(':'); const C = CURR[f]; return C && C.mods && C.mods[+k] ? { f, k: +k, C, Mo: C.mods[+k] } : null; }
function projMap() { return S.me ? (S.me.curMods = S.me.curMods || {}) : {}; }
// The term project: one of the programme's assessed projects, at your year.
function nextProject(sc, yr) {
  const fields = (CRAFT_FIELDS[sc.craft] || ['dir']).filter(f => CURR[f] && CURR[f].mods), D = projMap();
  for (const f of fields) for (let y = 1; y <= yr; y++) { const k = CURR[f].mods.findIndex((m, j) => m[0] === y && !D[f + ':' + j]); if (k >= 0) return f + ':' + k; }
  return null;
}
function curMap() { return S.me ? (S.me.cur = S.me.cur || {}) : {}; }
function fieldKnown(f) { const K = curMap(); return (CURR[f] ? CURR[f].lessons : []).filter((_, i) => K[f + ':' + i]).length; }
function currKnown(fam) { return (FAM_FIELDS[fam] || []).reduce((n, f) => n + fieldKnown(f), 0); }
// Examples name this world's films and people: the same film for the same lesson, every time.
function exampleFilm(f, i, genre) {
  const pool = S.films.filter(x => x.rel !== null && (x.q || 0) >= 55 && x.cast && x.cast.length && x.dir !== undefined && (!genre || x.genre === genre));
  const P0 = pool.length ? pool : S.films.filter(x => x.rel !== null && x.cast && x.cast.length);
  if (!P0.length) return null;
  const h = [...f].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  return P0[Math.floor(hashRand(h + i * 977)() * P0.length)];
}
function exampleHTML(f, i, text, genre) {
  if (!text) return '';
  const F = exampleFilm(f, i, genre); if (!F) return '';
  const crew = k => F.crew && F.crew[k] !== undefined && P(F.crew[k]) ? pl(F.crew[k]) : null;
  const rep = { F: fl(F.id), D: P(F.dir) ? pl(F.dir) : 'the director', P: F.dp !== undefined && P(F.dp) ? pl(F.dp) : 'the cinematographer', E: F.ed !== undefined && P(F.ed) ? pl(F.ed) : 'the editor', A: F.cast[0] !== undefined && P(F.cast[0]) ? pl(F.cast[0]) : 'the lead', W: F.wri && F.wri[0] !== undefined && P(F.wri[0]) ? pl(F.wri[0]) : 'the writer', C: F.co !== null && S.companies[F.co] ? cl(F.co) : 'the producers', Y: String(yearOf(F.rel)) };
  return esc(text).replace(/\{([FDPEAWCY])\}/g, (_, k) => rep[k]);
}
// ---- learning it ----
function learn(id, how, grade) { const K = curMap(); if (K[id]) { if (grade && (!K[id].g || grade < K[id].g)) K[id].g = grade; return false; } K[id] = { w: S.week, how, g: grade }; return true; }
// At school: one class a week, from the programme's fields, in year order.
function nextClass(sc) {
  const fields = CRAFT_FIELDS[sc.craft] || ['dir'], P0 = typeof schoolProg === 'function' ? schoolProg(sc) : { weeks: 90 }, yr = clamp(1 + Math.floor(sc.done / Math.max(1, P0.weeks / 3)), 1, 3), K = curMap();
  for (let y = 1; y <= yr; y++) for (let r = 0; r < fields.length; r++) { const f = fields[(r + S.week) % fields.length]; if (!CURR[f]) continue; const i = CURR[f].lessons.findIndex((L, k) => L[0] === y && !K[f + ':' + k]); if (i >= 0) return f + ':' + i; }
  return null;
}
function currSchoolWeek() {
  const M = S.me, sc = M.school; if (!sc || typeof schoolDays !== 'function' || schoolDays() <= 0) return;
  if (pending().some(x => x.kind === 'lesson')) return;
  const fields = CRAFT_FIELDS[sc.craft] || ['dir'], nM = fields.reduce((n, f) => n + (CURR[f] && CURR[f].mods ? CURR[f].mods.length : 0), 0);
  if (nM) {
    const P0 = typeof schoolProg === 'function' ? schoolProg(sc) : { weeks: 90 }, gap = Math.max(4, Math.round(P0.weeks / Math.min(nM, 6))), yr = clamp(1 + Math.floor(sc.done / Math.max(1, P0.weeks / 3)), 1, 3);
    const pid = sc.done >= ((sc.proj || 0) + 1) * gap ? nextProject(sc, yr) : null;
    if (pid) {
      const X = projOf('m:' + pid), [y, name, brief, dec] = X.Mo, at = sc.at && SCHOOL_BY[sc.at] ? SCHOOL_BY[sc.at][1] : 'school'; sc.proj = (sc.proj || 0) + 1;
      inbox('lesson', `Project: ${name}`, `${X.C.label} · ${YEAR_LABEL[y]} project, ${at}.\n\n${brief}\n\nThis is assessed: the whole cohort sees the result, and it goes on your reel.\n\nThe call: ${dec[0]}`, { cid: 'm:' + pid, choices: dec.slice(1).map((o, k) => ({ k: 'o' + k, label: `${o[0]} (${statLabel(o[1])})` })) });
      return;
    }
  }
  const id = nextClass(sc); if (!id) return;
  const X = lesson(id), [yr, title, idea, how, dec] = X.L, at = sc.at && SCHOOL_BY[sc.at] ? SCHOOL_BY[sc.at][1] : 'class';
  inbox('lesson', `Class: ${title}`, `${X.C.label} · ${X.C.courses[yr - 1]} (${YEAR_LABEL[yr]}), ${at}.\n\n${idea}\n\nHow it's done: ${how}\n\nIn this world: ${exampleHTML(X.f, X.i, exampleText(X.f, X.i, X.L), X.L[6]).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')}\n\nThe exercise: ${dec[0]}`, { cid: id, choices: dec.slice(1).map((o, k) => ({ k: 'o' + k, label: `${o[0]} (${statLabel(o[1])})` })) });
}
function currPick(it, k) {
  if (it.kind !== 'lesson') return false;
  if (String(it.cid).startsWith('m:')) return projPick(it, k);
  const X = lesson(it.cid); it.done = true; if (!X) return true;
  const o = X.L[4][1 + +String(k).slice(1)] || X.L[4][1], me = ME(), sc = S.me.school, tier = sc && sc.at && SCHOOL_BY[sc.at] ? SCHOOL_BY[sc.at][4] : 3;
  const ok = roll(o[1], 8 + X.L[0] * 2 - (tier === 1 ? 1 : 0)), grade = ok ? (S.me.lastRoll && S.me.lastRoll.crit > 0 ? 'A' : 'B') : 'C';
  if (o[1] in me.sk || o[1] in me.mind) growSub(me, o[1], ok ? .35 : .15);
  learn(it.cid, 'class', grade);
  const others = X.L[4].slice(1).filter(x => x !== o).map(x => `${x[0]}: ${x[2]}`).join(' ');
  it.result = { t: `${o[0]}. ${o[2]} ${ok ? pickLine(['The tutor nods: "That\'s the job."', 'Your exercise is screened for the class as a good example.', 'A strong piece of work; it goes in your reel.'], S.week) : pickLine(['The idea was right; the execution wasn\'t there yet.', 'The tutor\'s note: "You chose well. Now do it again, better."', 'It doesn\'t come together this time, but you understand why.'], S.week)} Grade ${grade}. The other choices: ${others}` };
  return true;
}
function projPick(it, k) {
  const X = projOf(it.cid); it.done = true; if (!X) return true;
  const dec = X.Mo[3], o = dec[1 + +String(k).slice(1)] || dec[1], me = ME();
  const ok = roll(o[1], 10 + X.Mo[0] * 2), grade = ok ? (S.me.lastRoll && S.me.lastRoll.crit > 0 ? 'A' : 'B') : 'C';
  if (o[1] in me.sk || o[1] in me.mind) growSub(me, o[1], ok ? .6 : .25);
  projMap()[it.cid.slice(2)] = { w: S.week, g: grade };
  const others = dec.slice(1).filter(x => x !== o).map(x => `${x[0]}: ${x[2]}`).join(' ');
  it.result = { t: `${o[0]}. ${o[2]} ${ok ? pickLine(['At the review screening the room goes quiet in the right places.', 'The tutors single it out at the crit. It goes straight on your reel.', 'Classmates ask how you did it. That\'s the best review there is.'], S.week) : pickLine(['At the crit, the tutors are kind and clear about what didn\'t work.', 'It doesn\'t land, and the review tells you exactly why.', 'A hard project. You\'ll do the next one better.'], S.week)} Project grade ${grade}. The other way: ${others}` };
  return true;
}
// On the job: good work sometimes teaches you a lesson from your department, at the level of the job.
function currWorkLearn(j, pts, out) {
  if (pts <= 0 || prnd() > .3) return;
  const fam = typeof familyOf === 'function' ? familyOf(j) : null, fields = FAM_FIELDS[fam] || []; if (!fields.length) return;
  const tier = typeof jobTier === 'function' ? jobTier(j) : 1, maxY = tier <= 1 ? 1 : tier <= 3 ? 2 : 3, K = curMap();
  for (const f of fields) { if (!CURR[f]) continue; const i = CURR[f].lessons.findIndex((L, k) => L[0] <= maxY && !K[f + ':' + k]); if (i < 0) continue; learn(f + ':' + i, 'work'); const L = CURR[f].lessons[i]; const me = ME(); const s = L[4][1][1]; if (s in me.sk || s in me.mind) growSub(me, s, .12); out.push(`📘 On the job you learn ${L[1].toLowerCase()}: ${L[2]}`); return; }
}
// Books from the Bazaar teach a field's opening lessons.
function currBook(k) { const f = BOOK_FIELD[k]; if (!f || !CURR[f]) return 0; let n = 0; CURR[f].lessons.forEach((L, i) => { if (n < 3 && learn(f + ':' + i, 'book')) n++; }); return n; }
// Knowing your department makes the work easier.
function currDCBonus(j) { const n = currKnown(typeof familyOf === 'function' ? familyOf(j) : null); return n >= 8 ? 2 : n >= 3 ? 1 : 0; }
// Lessons without a written example point at a film in this world worth studying for it.
const EX_FALL = {
  person: ['Film schools screen {F} ({Y}) for this: watch what {who} does with it.', 'For {T}, the case study in most syllabuses is {F} ({Y}), and {who}\'s work on it.', 'Tutors still play the relevant reel of {F} ({Y}) when they teach {T}; {who} got it right.'],
  role: { dir: 'D', wri: 'W', tv: 'W', cam: 'P', light: 'P', edt: 'E', col: 'P', snd: 'D', post: 'E', sup: 'E', ad: 'D', pro: 'C', dist: 'C', act: 'A', cst: 'A', des: 'D', cos: 'A', mkp: 'A', vfx: 'D', anim: 'D', stn: 'A', doc: 'D', mus: 'D', prodm: 'D', song: 'D', pod: 'D', creator: 'D', stage: 'D' }
};
function exampleText(f, i, L) { if (L[5]) return L[5]; const r = hashRand([...f].reduce((a, c) => a * 31 + c.charCodeAt(0), 3) + i * 7)(); return EX_FALL.person[Math.floor(r * 3)].replace('{who}', '{' + (EX_FALL.role[f] || 'D') + '}').replace('{T}', L[1].toLowerCase()); }
// ---- the Craft Library ----
function libraryHTML() {
  const K = curMap(), fields = Object.keys(CURR), f = CURR[UI.libf] ? UI.libf : (S.me && S.me.school && CRAFT_FIELDS[S.me.school.craft] ? CRAFT_FIELDS[S.me.school.craft][0] : 'dir'), C = CURR[f];
  const total = fields.reduce((n, k) => n + CURR[k].lessons.length, 0), mine = Object.keys(K).length;
  const how = { class: 'practised in class', work: 'learned on the job', book: 'read in a book' };
  return `<div class="lib"><p class="muted small">${mine} of ${total} lessons learned across ${fields.length} fields. Read anything here any time; you learn a lesson properly by practising it in class, picking it up on a job, or reading a craft book. What you know makes that department's work easier.</p>
   <div class="lib-fields"><button class="lib-f${UI.libf === 'nums' ? ' on' : ''}" data-libf="nums"><span>📊</span>Industry by numbers</button>${fields.map(k => { const n = fieldKnown(k), t = CURR[k].lessons.length; return `<button class="lib-f${k === f && UI.libf !== 'nums' ? ' on' : ''}" data-libf="${k}"><span>${CURR[k].icon}</span>${esc(CURR[k].label)}<i>${n}/${t}</i></button>`; }).join('')}</div>
   ${UI.libf === 'nums' && typeof numbersHTML === 'function' ? `<h3>📊 Industry by numbers</h3>${numbersHTML()}</div>` : `<h3>${C.icon} ${esc(C.label)}</h3>${C.mods ? `<div class="lib-proj"><h4>The programme's projects</h4><ol>${C.mods.map((m, k) => { const d = projMap()[f + ':' + k]; return `<li class="${d ? 'got' : ''}"><b>${esc(m[1])}</b> <span class="muted small">${YEAR_LABEL[m[0]]}${d ? ' · done, grade ' + d.g : ''}</span><br><span class="small">${esc(m[2])}</span></li>`; }).join('')}</ol></div>` : ''}${[1, 2, 3].map(y => { const L = C.lessons.map((x, i) => [x, i]).filter(([x]) => x[0] === y); if (!L.length) return ''; return `<h4>Year ${y}: ${esc(C.courses[y - 1])} <span class="muted small">(${YEAR_LABEL[y]})</span></h4>${L.map(([x, i]) => { const st = K[f + ':' + i]; return `<details class="lesson${st ? ' got' : ''}"><summary>${st ? '✓' : '○'} <b>${esc(x[1])}</b>${st ? ` <span class="muted small">${how[st.how] || 'learned'}${st.g ? ' · grade ' + st.g : ''}</span>` : ''}</summary><p>${esc(x[2])}</p><p><b>How it's done.</b> ${esc(x[3])}</p><div class="dec"><p><b>The decision.</b> ${esc(x[4][0])}</p><ul>${x[4].slice(1).map(o => `<li><b>${esc(o[0])}</b> <span class="muted small">(${esc(statLabel(o[1]))})</span>: ${esc(o[2])}</li>`).join('')}</ul></div><p class="ex"><b>In this world.</b> ${exampleHTML(f, i, exampleText(f, i, x), x[6])}</p></details>`; }).join('')}`; }).join('')}<p class="muted small lib-src">Lessons and projects are modelled on published film-school curricula (NFTS MFA course outlines, the AFI Conservatory catalogue, Berklee screen scoring courses, the DGA assistant director training programme) and on working practice. The examples come from this world's own films.</p></div>`}`;
}
function libClick(t) { if (typeof numClick === 'function' && numClick(t)) return true; if (t.dataset.libf) { UI.libf = t.dataset.libf; render(true); return true; } return false; }
// What a school programme teaches, for the school pages.
function syllabusHTML(prog) { const P0 = SCHOOL_PROGS[prog]; if (!P0) return ''; const fs = [...new Set(P0.crafts.flatMap(c => CRAFT_FIELDS[c] || []))].filter(f => CURR[f]); const pj = fs.flatMap(f => (CURR[f].mods || []).map(m => m[1])); return fs.length ? `<p class="small muted">Teaches: ${fs.map(f => `${CURR[f].icon} ${esc(CURR[f].label)} (${CURR[f].courses.join(', ').toLowerCase()})`).join(' · ')}</p>${pj.length ? `<p class="small muted">Assessed projects: ${esc(pj.join(' · '))}</p>` : ''}` : ''; }
