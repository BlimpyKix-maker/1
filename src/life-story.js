// ---------------- Your story ----------------
// The record of a life in film: a résumé that reads like one, a timeline of the moments that mattered, and what
// became of the films you worked on. Milestones are written as they happen; the rest is gathered from the save.
function milestone(t, kind = 'life') { const M = S.me; (M.milestones = M.milestones || []).push({ w: S.week, t, kind }); }
// Called when the week closes: notice new levels and how your films are doing.
function storyWeek() {
  const M = S.me, L = careerLevel();
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
  return `<section class="panel story"><h3>Your story <button class="linkish" data-story="">Close</button></h3>
   <div class="kpis mini"><div><span>Since</span><b>${fmtDate(M.startW, true)}</b><small class="muted">${Math.round((S.week - M.startW) / 52 * 10) / 10} years in the business</small></div><div><span>Paid work</span><b>${weeks} weeks</b><small class="muted">${fmtCash(earned)} earned</small></div><div><span>Credits</span><b>${me.credits.length}</b><small class="muted">${M.stats.apps} applications, ${M.stats.offers} offers</small></div><div><span>People</span><b>${Object.keys(M.known).length}</b><small class="muted">${best !== undefined ? 'closest: ' + esc(P(best).name) : ''}</small></div></div>
   <h4>Résumé</h4>
   <p><b>${esc(me.name)}</b> · ${esc(ROLE_LABEL[me.role])} · ${esc(hubName(M.hub))}${M.agent ? ` · represented by ${esc(M.agent.name)}` : ''}</p>
   <p class="muted">Education: ${esc(edu ? edu.label : '—')}${M.degrees.length ? ' · ' + M.degrees.map(d => ({ ba: 'degree', mfa: 'MFA', cert: 'certificate', union: 'union training' }[d] || d)).join(', ') : ''}. Voice: ${topThemes(voiceOf()).map(k => THEMES[k].toLowerCase()).join(', ') || 'still forming'}.</p>
   ${credited.length ? `<div class="tw"><table class="grid"><thead><tr><th>Film</th><th>Your job</th><th>Under</th><th class="n">Critics</th><th class="n">Gross</th><th>Honours</th></tr></thead><tbody>${credited.map(filmRow).join('')}</tbody></table></div>` : '<p class="muted">No screen credits yet.</p>'}
   ${Object.entries(byDept).map(([fam, L]) => `<p class="resume-line"><b>${esc(FAM_NAME[fam] || fam)}:</b> ${L.map(p => `${esc(p.t)}${p.film !== null ? ' on ' + esc(S.films[p.film].title) : ''} <span class="muted">(${Math.max(1, Math.round((p.to - p.from)))} wk${p.quit ? ', left' : ''})</span>`).join('; ')}</p>`).join('')}
   ${(M.scripts || []).length ? `<p class="resume-line"><b>Scripts:</b> ${M.scripts.map(sc => `${esc(sc.title)} <span class="muted">(${esc(sc.genre.toLowerCase())}, draft ${sc.draft}${sc.grade ? ', ' + sc.grade : ', in progress'}${sc.won ? ', ' + esc(sc.won.join(', ')) : ''})</span>`).join('; ')}</p>` : ''}
   <h4>Timeline</h4><ol class="timeline">${ms.length ? ms.map(m => `<li class="tl-${m.kind || 'life'}"><time>${fmtDate(m.w, true)}</time><span>${esc(m.t)}</span></li>`).join('') : '<li class="muted">Your story starts here.</li>'}</ol></section>`;
}
