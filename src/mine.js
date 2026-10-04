// ---------------- Your job and your school, as places ----------------
// Click your job or your course anywhere and you get its page: what it is, how far along you are, what it pays or
// costs, and the people in it: the production's heads of department and crew, a company's chain of command, a school's
// faculty, your year and its famous alumni. Faculty, year-mates and alumni are drawn from the town's real people, the
// same answer all year. Display-only.
const CRAFT_ROLE = { dir: 'director', wri: 'writer', cam: 'dp', edt: 'editor', pro: 'producer', des: 'designer', act: 'actor', mus: 'composer', fx: 'vfx', snd: 'sound' };
const FAC_TITLES = ['Dean of the school', 'Chair of the programme', 'Professor', 'Professor', 'Associate professor', 'Senior lecturer', 'Visiting artist', 'Adjunct lecturer'];
function personRow(id, sub, extra) {
  const p = P(id); if (!p) return '';
  const k = S.me.known[id];
  return `<li class="mn-p">${typeof phoneAvatar === 'function' ? phoneAvatar(id, 34) : ''}<div><a href="#" class="lk" data-go="person:${id}">${esc(p.name)}</a>${k ? ' <span class="chip good" title="You know them">known</span>' : ''}<br><span class="muted small">${esc(sub)}</span></div>${extra || ''}</li>`;
}
function myJobPage(id) {
  const M = S.me, j = M.jobs.find(x => x.id === +id); if (!j) return '<div class="os-empty"><span>🧳</span><b>That job is over</b><p>It\'s in your history now.</p></div>';
  const t = tmplOf(j) || {}, f = j.film !== null ? S.films[j.film] : null, c = j.co !== undefined && j.co !== null ? S.companies[j.co] : f && f.co !== null ? S.companies[f.co] : null;
  const left = Math.max(0, j.weeks - j.done), pct = Math.round(clamp(j.done / Math.max(1, j.weeks), 0, 1) * 100);
  let people = '';
  if (f) {
    const sl = [...slotsOf(f)], heads = sl.filter(([, s]) => ['dir', 'prod', 'dp', 'ed', 'wri'].includes(s)), cast = sl.filter(([, s]) => s === 'cast'), crew = sl.filter(([, s]) => !['dir', 'prod', 'dp', 'ed', 'wri', 'cast'].includes(s));
    const lab = s => ({ dir: 'Director', prod: 'Producer', dp: 'Cinematographer', ed: 'Editor', wri: 'Writer', cast: 'Cast' })[s] || CREW_LABEL[s] || s;
    people = `<div class="cols two"><section class="panel"><h3>Heads of department</h3><ul class="plain mn-list">${heads.map(([pid, s]) => personRow(pid, lab(s) + (pid === j.head ? ' · your boss' : ''))).join('')}${crew.map(([pid, s]) => personRow(pid, lab(s) + (pid === j.head ? ' · your boss' : ''))).join('')}</ul></section>
     <section class="panel"><h3>Cast</h3><ul class="plain mn-list">${cast.slice(0, 10).map(([pid]) => personRow(pid, P(pid).fame > 50 ? 'Star' : 'Cast')).join('') || '<li class="muted">Not cast yet.</li>'}</ul>
     ${(j.mates || []).length ? `<h3>The people you work beside</h3><ul class="plain mn-list">${j.mates.map(pid => personRow(pid, 'Your department')).join('')}</ul>` : ''}</section></div>`;
  } else if (c && typeof staffOf === 'function') {
    const L = staffOf(c).filter(x => x.id !== null).sort((a, b) => b.r - a.r);
    people = `<section class="panel"><h3>Who works at ${esc(c.name)}</h3><ul class="plain mn-list two">${L.slice(0, 24).map(x => personRow(x.id, LADDER[x.r] ? LADDER[x.r][0] : 'Staff')).join('') || '<li class="muted">A small office: just a handful of people.</li>'}</ul></section>`;
  } else if (j.head !== null && P(j.head)) people = `<section class="panel"><h3>Who you work for</h3><ul class="plain mn-list">${personRow(j.head, 'Your boss')}</ul></section>`;
  return `<div class="head"><p class="eyebrow">Your job${t.biz ? ' · ' + esc(t.biz) : ''} · ${esc(hubName(M.hub))}</p><h2>${esc(j.t)}</h2><p class="lede">${esc(t.d || '')}</p></div>
   <div class="kpis mini"><div><span>Pay a day</span><b>${j.rate ? fmtCash(j.rate) : 'Unpaid'}</b></div><div><span>Days a week</span><b>${j.days}</b></div><div><span>Weeks</span><b>${j.done} of ~${j.weeks}</b></div><div><span>Left</span><b>${left ? left + ' wk' : 'Wrapping'}</b></div><div><span>Screen credit</span><b>${t.cr ? 'Yes' : 'No'}</b></div>${j.head !== null && P(j.head) ? `<div><span>Boss's opinion</span><b>${Math.round(opinion(j.head))}</b></div>` : ''}</div>
   <div class="mn-bar"><i style="width:${pct}%"></i></div>
   ${f ? `<section class="panel"><h3>The production</h3><p>${fl(f.id)} · ${esc(f.genre)} · ${esc(f.status || '')}${f.budget ? ' · budget ' + fmtM(f.budget) : ''}${c ? ` · <a href="#" class="lk" data-go="co:${c.id}">${esc(c.name)}</a>` : ''}${f.stageEnd ? ` · next stage around ${fmtDate(f.stageEnd, true)}` : ''}</p>${typeof storyOf === 'function' && storyOf(f) ? `<p class="muted small">${esc((storyOf(f).logline || '').slice(0, 260))}</p>` : ''}</section>` : c ? `<section class="panel"><h3>The company</h3><p><a href="#" class="lk" data-go="co:${c.id}">${esc(c.name)}</a> · ${esc(hubName(c.hub))}</p></section>` : ''}
   ${people}
   <p>${UI.quitc === j.id ? `<button class="os-btn danger" data-quit="${j.id}">Yes, quit this job</button> <button class="os-btn" data-quitc="">Keep it</button>` : `<button class="os-btn" data-quitc="${j.id}">Quit this job…</button>`}</p>`;
}
function schoolPeople(sId, hub, crafts) {
  const roles = new Set(crafts.map(c => CRAFT_ROLE[c]).filter(Boolean)), y = S.year, r = hashRand([...sId].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) + y * 13);
  const pool = S.people.filter(p => p && !p.dead && !p.player && p.hub === hub && roles.has(p.role));
  const fac = pool.filter(p => y - p.born >= 44 && !p.retired || p.retired && y - p.born < 80).map(p => [p, p.standing + r() * 30]).sort((a, b) => b[1] - a[1]).slice(0, 7).map(x => x[0]);
  const kids = pool.filter(p => y - p.born <= 29 && y - p.born >= 19 && !fac.includes(p)).map(p => [p, r()]).sort((a, b) => a[1] - b[1]).slice(0, 10).map(x => x[0]);
  const alumni = pool.filter(p => (p.catId || p.fame > 45) && y - p.born > 30 && !fac.includes(p)).map(p => [p, (p.fame || 0) + r() * 25]).sort((a, b) => b[1] - a[1]).slice(0, 6).map(x => x[0]);
  return { fac, kids, alumni };
}
function mySchoolPage() {
  const M = S.me, sc = M.school; if (!sc) return '<div class="os-empty"><span>🎓</span><b>Not enrolled</b><p>Find a course in the Library or the schools list.</p></div>';
  const P0 = schoolProg(sc), s = sc.at ? SCHOOL_BY[sc.at] : null, crafts = s ? (SCHOOL_PROGS[sc.prog] || {}).crafts || [sc.craft] : [sc.craft], hub = s ? s[2] : M.hub;
  const name = s ? s[1] : `${hubName(M.hub)} ${sc.prog === 'cc' ? 'Community College' : sc.prog === 'short' ? 'Evening School' : 'Polytechnic'}`;
  const pct = Math.round(clamp(sc.done / Math.max(1, P0.weeks), 0, 1) * 100), X = schoolPeople(s ? s[0] : 'local-' + sc.prog, hub, crafts);
  const mates = Object.entries(M.known).filter(([, k]) => (k.tags || []).includes('Classmate')).map(([id]) => +id);
  const year = [...new Set(mates.concat(X.kids.map(p => p.id)))].slice(0, 12);
  return `<div class="head"><p class="eyebrow">Your school · ${esc(hubName(hub))}${s ? ` · founded ${s[5]} · rated ${schoolRating(s).toFixed(1)}/10` : ''}</p><h2>${esc(name)}</h2><p class="lede">${esc(s ? s[8] : (PROGRAMS[sc.prog] || {}).d || '')}</p></div>
   <div class="kpis mini"><div><span>Course</span><b>${esc((SCHOOL_PROGS[sc.prog] || PROGRAMS[sc.prog] || {}).label || P0.label)}</b></div><div><span>Your craft</span><b>${esc(CRAFTS[sc.craft].label)}</b></div><div><span>Progress</span><b>${sc.done} of ${P0.weeks} wk</b></div><div><span>Sessions a week</span><b>${P0.days}</b></div><div><span>Fees</span><b>${P0.fee > 0 ? fmtCash(usd(P0.fee)) + '/wk' : P0.fee < 0 ? 'Stipend' : 'Free'}</b></div><div><span>Missed weeks</span><b class="${sc.missed >= 2 ? 'bad' : ''}">${sc.missed || 0} of 4</b></div></div>
   <div class="mn-bar"><i style="width:${pct}%"></i></div>${sc.schol ? '<p class="good small">You\'re on a scholarship.</p>' : ''}
   ${typeof syllabusHTML === 'function' && SCHOOL_PROGS[sc.prog] ? `<section class="panel"><h3>What you study</h3>${syllabusHTML(sc.prog)}</section>` : ''}
   <div class="cols two"><section class="panel"><h3>Faculty</h3><ul class="plain mn-list">${X.fac.map((p, i) => personRow(p.id, `${FAC_TITLES[i] || 'Lecturer'} · ${ROLE_LABEL[p.role] || p.role}${p.credits && p.credits.length ? ' · ' + p.credits.length + ' credits' : ''}`)).join('') || '<li class="muted">Working professionals teach most classes here.</li>'}</ul></section>
    <section class="panel"><h3>Your year</h3><ul class="plain mn-list">${year.map(id => personRow(id, `${ROLE_LABEL[P(id).role] || ''} · ${mates.includes(id) ? 'classmate you know' : 'in your year'}`)).join('') || '<li class="muted">You haven\'t met anyone yet. Go to class.</li>'}</ul></section></div>
   ${X.alumni.length ? `<section class="panel"><h3>Famous alumni</h3><ul class="plain mn-list two">${X.alumni.map(p => personRow(p.id, `${ROLE_LABEL[p.role] || ''} · class of ${p.born + 23}`)).join('')}</ul></section>` : ''}
   <p class="small muted">Miss four weeks in a row and they let you go. Your study sessions are fitted into your diary automatically around your jobs.</p>`;
}
function viewMine(cur) {
  if (cur.kind === 'myjob') return myJobPage(cur.id);
  if (cur.kind === 'myschool') return mySchoolPage();
  return '';
}
function mineClick(t) {
  if (!S.me) return false;
  if (t.dataset.jobpage !== undefined) { UI.stack.push({ kind: 'myjob', id: +t.dataset.jobpage }); render(); return true; }
  if (t.dataset.schoolpage !== undefined) { UI.stack.push({ kind: 'myschool', id: 0 }); render(); return true; }
  return false;
}
