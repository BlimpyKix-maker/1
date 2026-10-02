// ---------------- Your story ----------------
// The record of a life in film: a résumé that reads like one, a timeline of the moments that mattered, and what
// became of the films you worked on. Milestones are written as they happen; the rest is gathered from the save.
function milestone(t, kind = 'life') { const M = S.me, m = { w: S.week, t, kind }; (M.milestones = M.milestones || []).push(m); if (typeof pressAboutYou === 'function' && M.id !== undefined) pressAboutYou(m); }
// Called when the week closes: notice new levels and how your films are doing.
// ---- Year in review ----
// A snapshot each New Year; when the year turns, the difference becomes a recap in the inbox and on the Life tab.
function yearSnap() { const M = S.me, me = ME(); return { y: yearOf(S.week), earned: M.stats.earned, weeks: M.stats.weeks, credits: me.credits.length, known: Object.keys(M.known).length, apps: M.stats.apps, offers: M.stats.offers, standing: me.standing, fame: me.fame || 0, cash: M.cash, ms: (M.milestones || []).length }; }
function yearHeadline(r) {
  if (r.awards) return 'A year with silverware';
  if (r.credits >= 3 && r.standing >= 4) return 'A breakthrough year';
  if (r.credits >= 2) return 'A busy year';
  if (r.weeks < 8 && r.apps > 30) return 'A year of knocking on doors';
  if (r.standing < -2) return 'A year to forget';
  if (r.known >= 15) return 'A year of new faces';
  return 'A year of finding your feet';
}
function yearWeek() {
  const M = S.me, me = ME();
  if (!M.yr) { M.yr = yearSnap(); return; }
  if (yearOf(S.week) <= M.yr.y) return;
  if (S.week - M.startW < 10) { M.yr = yearSnap(); return; }   // arrived in the last weeks of December: start counting from January
  const a = M.yr, b = yearSnap(), ms = (M.milestones || []).slice(a.ms);
  const r = { y: a.y, earned: b.earned - a.earned, weeks: Math.min(52, b.weeks - a.weeks), credits: b.credits - a.credits, known: b.known - a.known, apps: b.apps - a.apps, offers: b.offers - a.offers, standing: Math.round((b.standing - a.standing) * 10) / 10, fame: Math.round(b.fame - a.fame), cash: b.cash, awards: ms.filter(m => m.kind === 'prize').length,
    films: me.credits.map(i => S.films[i]).filter(f => f.rel !== null && yearOf(f.rel) === a.y).map(f => f.id), high: ms.filter(m => ['prize', 'level', 'credit', 'film', 'write'].includes(m.kind)).slice(-5).map(m => m.t) };
  r.head = yearHeadline(r);
  if (typeof industryYear === 'function') { r.ind = industryYear(a.y); industryNews(a.y, r.ind); }
  (M.years = M.years || []).push(r);
  inbox('note', `${a.y} in review: ${r.head.toLowerCase()}`, `${r.weeks} weeks of paid work, ${fmtCash(r.earned)} earned, ${r.credits} new credit${r.credits === 1 ? '' : 's'}, ${r.known} new people in your phone. Standing ${r.standing >= 0 ? 'up' : 'down'} ${Math.abs(r.standing)}. The full recap is on the Life tab.`);
  M.yr = b;
}
function yearsHTML() {
  const Y = (S.me.years || []).slice().reverse();
  if (!Y.length) return '';
  const sign = v => (v > 0 ? '+' : '') + v;
  return `<section class="panel years"><h3>Your years</h3>${Y.map((r, i) => `<details class="yr"${i === 0 ? ' open' : ''}><summary><b>${r.y}</b> · ${esc(r.head)}</summary>
   <div class="kpis mini"><div><span>Paid work</span><b>${r.weeks} wk</b><small class="muted">${fmtCash(r.earned)} earned</small></div><div><span>Credits</span><b>${sign(r.credits)}</b><small class="muted">${r.apps} applications, ${r.offers} offers</small></div><div><span>Standing</span><b class="${r.standing < 0 ? 'bad' : 'good'}">${sign(r.standing)}</b><small class="muted">fame ${sign(r.fame)}</small></div><div><span>People</span><b>${sign(r.known)}</b><small class="muted">ended with ${fmtCash(r.cash)}</small></div></div>
   ${r.films.length ? `<p class="small"><b>Released:</b> ${r.films.map(fl).join(', ')}</p>` : ''}${r.high.length ? `<ul class="plain small">${r.high.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}${typeof industryHTML === 'function' ? industryHTML(r.ind) : ''}</details>`).join('')}</section>`;
}
function storyWeek() {
  const M = S.me, L = careerLevel();
  yearWeek();
  if (M.lastLevel === undefined) M.lastLevel = L;
  if (L > M.lastLevel) milestone(`Reached level ${L}: ${LEVEL_NAME[L].toLowerCase()}`, 'level');
  M.lastLevel = Math.max(M.lastLevel, L);
  for (const p of M.past) {
    if (!p.credited || p.film === null || p.told) continue;
    const f = S.films[p.film];
    if (f.rel === null || S.week - f.rel < 8) continue;
    for (const x of M.past) if (x.film === p.film) x.told = 1;   // one milestone per film, however many jobs you had on it
    if ((M.scripts || []).some(sc => sc.made === p.film) || (M.holdings || []).some(h => h.made === p.film)) continue;   // your own film has its own line
    const hit = f.hitRatio > 2, flop = f.theatrical < -f.cost * .3;
    milestone(`${f.title} (${p.t.toLowerCase()}) ${hit ? 'became a hit' : flop ? 'flopped' : 'did steady business'}: ${f.reviews}/100 from critics, ${fmtM(f.total)} worldwide`, 'film');
  }
}
function storyHTML() {
  const M = S.me, me = ME();
  const ms = (M.milestones || []).slice().sort((a, b) => a.w - b.w);
  const credited = M.past.filter(p => p.credited && p.film !== null);
  const byDept = {};
  for (const p of M.past) { const fam = familyOf({ k: p.k, jid: (POST_BY[p.k] || ODD_BY[p.k] || {}).jid, odd: !POST_BY[p.k] }); (byDept[fam] = byDept[fam] || []).push(p); }
  const FAM_NAME = { ad: 'Assistant directing', cam: 'Camera and lighting', snd: 'Sound', art: 'Art department', cos: 'Costume and makeup', act: 'Acting', dir: 'Directing', wri: 'Writing and development', pro: 'Producing and production', cst: 'Casting', edt: 'Editing and post', mus: 'Music', vfx: 'Visual effects', stn: 'Stunts', office: 'Industry', intern: 'Internships', cinema: 'Cinema', set: 'On set' };
  const earned = M.stats.earned, weeks = M.stats.weeks;
  const best = Object.keys(M.known).map(Number).filter(id => !P(id).dead).sort((a, b) => opinion(b) - opinion(a))[0];
  const edu = ORIGIN.edu[M.edu];
  const filmRow = p => { const f = S.films[p.film]; return `<tr><td>${fl(f.id)}${f.rel !== null ? ` <span class="muted">${yearOf(f.rel)}</span>` : ''}</td><td>${esc(p.t)}</td><td>${p.head !== null ? pl(p.head) : ''}</td><td class="n">${f.rel !== null ? f.reviews : '—'}</td><td class="n">${f.rel !== null ? fmtM(f.total) : 'in production'}</td><td>${(f.awards || []).length ? esc(f.awards.slice(0, 2).join('; ')) : ''}</td></tr>`; };
  return `<section class="panel story"><h3>Your story</h3>
   <div class="kpis mini"><div><span>Since</span><b>${fmtDate(M.startW, true)}</b><small class="muted">${Math.round((S.week - M.startW) / 52 * 10) / 10} years in the business</small></div><div><span>Paid work</span><b>${weeks} weeks</b><small class="muted">${fmtCash(earned)} earned</small></div><div><span>Credits</span><b>${me.credits.length}</b><small class="muted">${M.stats.apps} applications, ${M.stats.offers} offers</small></div><div><span>People</span><b>${Object.keys(M.known).length}</b><small class="muted">${best !== undefined ? 'closest: ' + esc(P(best).name) : ''}</small></div></div>
   <h4>Résumé</h4>
   <p><b>${esc(me.name)}</b> · ${esc(ROLE_LABEL[me.role])} · ${esc(hubName(M.hub))}${M.agent ? ` · represented by ${esc(M.agent.name)}` : ''}</p>
   <p class="muted">Education: ${esc(edu ? edu.label : '—')}${M.degrees.length ? ' · ' + M.degrees.map(d => ({ ba: 'degree', mfa: 'MFA', cert: 'certificate', union: 'union training' }[d] || d)).join(', ') : ''}. Voice: ${topThemes(voiceOf()).map(k => THEMES[k].toLowerCase()).join(', ') || 'still forming'}.</p>
   ${credited.length ? `<div class="tw"><table class="grid"><thead><tr><th>Film</th><th>Your job</th><th>Under</th><th class="n">Critics</th><th class="n">Gross</th><th>Honours</th></tr></thead><tbody>${credited.map(filmRow).join('')}</tbody></table></div>` : '<p class="muted">No screen credits yet.</p>'}
   ${Object.entries(byDept).map(([fam, L]) => `<p class="resume-line"><b>${esc(FAM_NAME[fam] || fam)}:</b> ${L.map(p => `${esc(p.t)}${p.film !== null ? ' on ' + esc(S.films[p.film].title) : ''} <span class="muted">(${Math.max(1, Math.round((p.to - p.from)))} wk${p.quit ? ', left' : ''})</span>`).join('; ')}</p>`).join('')}
   ${(M.scripts || []).length ? `<p class="resume-line"><b>Scripts:</b> ${M.scripts.map(sc => `${esc(sc.title)} <span class="muted">(${esc(sc.genre.toLowerCase())}, draft ${sc.draft}${sc.grade ? ', ' + sc.grade : ', in progress'}${sc.won ? ', ' + esc(sc.won.join(', ')) : ''})</span>`).join('; ')}</p>` : ''}
   <h4>Timeline</h4><ol class="timeline">${ms.length ? ms.map(m => `<li class="tl-${m.kind || 'life'}"><time>${fmtDate(m.w, true)}</time><span>${esc(m.t)}</span></li>`).join('') : '<li class="muted">Your story starts here.</li>'}</ol></section>`;
}
