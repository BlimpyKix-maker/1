// ---------------- Work: your week at a glance ----------------
// The Work page opens on what your week already holds: which days your jobs take, when you study, the appointments in
// the diary, and how many days are still free for another job. Each job can be left from here (twice to confirm),
// and every listing on the board says whether it fits around what you have.
function workWeekHTML() {
  const M = S.me, run = planBlocks(), OB = obligations(), W = M.wk, jd = jobDays(), free = Math.max(0, 7 - jd);
  const jobOf = d => M.jobs.find(j => j.id === OB.job[d]) || null;
  const cell = (d, b) => {
    const k = run[d][b], ap = typeof apptAt === 'function' ? apptAt(d, b) : null, past = W && (d < W.day || (d === W.day && b < W.block));
    if (k === 'work') { const j = jobOf(d); return `<span class="wk-b job${past ? ' past' : ''}" title="${esc(j ? j.t : 'Work')}">💼 ${esc(j ? j.t : 'Work')}</span>`; }
    if (ap) return `<span class="wk-b appt${past ? ' past' : ''}">${APPT_KINDS[ap.kind] ? APPT_KINDS[ap.kind].icon : '📌'} ${esc(APPT_KINDS[ap.kind] ? APPT_KINDS[ap.kind].label : 'Appointment')}</span>`;
    if (k === 'study') return `<span class="wk-b study${past ? ' past' : ''}">🎓 Study</span>`;
    const A = BLOCK_ACTS[k] || (typeof venueAsEvening === 'function' && venueAsEvening(k)) || BLOCK_ACTS.rest;
    return `<span class="wk-b free${past ? ' past' : ''}" title="Free: planned for ${esc(A.label)}">${esc(A.label)}</span>`;
  };
  const days = SLOT_NAMES.map((n, d) => `<div class="wk-day${W && d === W.day ? ' today' : ''}${OB.job[d] !== null ? ' busy' : ''}"><b>${n}</b>${[0, 1, 2].map(b => cell(d, b)).join('')}</div>`).join('');
  const school = M.school && typeof schoolProg === 'function' ? schoolProg(M.school) : null;
  const jobs = M.jobs.map(j => { const f = j.film !== null ? S.films[j.film] : null, left = Math.max(0, j.weeks - j.done), conf = UI.quitc === j.id;
    return `<article class="wk-job"><div><b><a href="#" class="lk" data-go="myjob:${j.id}">${esc(j.t)}</a></b>${f ? ` on ${fl(f.id)}` : ''}<br><span class="muted small">${j.days} day${j.days > 1 ? 's' : ''} a week · ${left ? `about ${left} week${left > 1 ? 's' : ''} left` : 'wrapping up'}${j.rate ? ` · ${fmtCash(j.rate)} a day (${fmtCash(j.rate * j.days)} a week)` : ' · unpaid'}${j.head !== null && P(j.head) ? ` · reports to ${pl(j.head)}` : ''}</span></div>
     <div class="wk-jact"><button class="os-btn" data-go="myjob:${j.id}">Details</button>${conf ? `<button class="os-btn danger" data-quit="${j.id}">Yes, quit</button><button class="os-btn" data-quitc="">Keep it</button>` : `<button class="os-btn" data-quitc="${j.id}">Quit…</button>`}</div>
     ${conf ? `<p class="small bad">Leaving early costs you some goodwill${j.head !== null && P(j.head) ? ' with ' + esc(P(j.head).name) : ''}${j.t && (tmplOf(j) || {}).cr ? ', and you won\'t get the credit' : ''}. The days free up straight away.</p>` : ''}</article>`; }).join('');
  return `<section class="panel wk-panel"><h3>Your week <span class="count">${jd} of 7 days on jobs · ${free} free</span></h3>
   <div class="wk-grid">${days}</div>
   <p class="small muted">${free >= 5 ? 'Plenty of room for a job: anything on the board up to ' + free + ' days a week fits.' : free ? `Room for a job of up to ${free} day${free > 1 ? 's' : ''} a week. Anything longer means leaving something.` : 'Your week is full of work. To take another job, leave one first.'}${school ? ` Your course needs ${school.days || 0} study session${(school.days || 0) === 1 ? '' : 's'} a week; they're fitted around your jobs.` : ''} Change the rest in <a href="#" class="lk" data-app="week">Plan the week</a>.</p>
   ${jobs ? `<div class="wk-jobs">${jobs}</div>` : '<p class="muted">No job right now. Plan blocks to look for work, then tick jobs on the board below.</p>'}</section>`;
}
// does a listing fit around the jobs you have?
function fitChip(p) { const free = 7 - jobDays(); return p.days <= free ? '<span class="fit ok" title="Fits around your current jobs">fits</span>' : `<span class="fit no" title="You'd need to leave a job first">needs ${p.days - free} more day${p.days - free > 1 ? 's' : ''}</span>`; }
// take an offer and leave whatever is in the way: the lowest-paid jobs go first
function swapForOffer(post) {
  const M = S.me; let n = 0;
  while (M.jobs.length && jobDays() + post.days > 7 && n++ < 8) { const j = M.jobs.slice().sort((a, b) => (a.rate || 0) * a.days - (b.rate || 0) * b.days)[0]; if (j.head !== null && P(j.head)) addTie(ME(), P(j.head), -6); finishJob(j, null, true); }
  return jobDays() + post.days <= 7;
}
function work2Click(t) {
  if (!S.me) return false;
  if (t.dataset.quitc !== undefined) { UI.quitc = t.dataset.quitc === '' ? null : +t.dataset.quitc; render(true); return true; }
  return false;
}
