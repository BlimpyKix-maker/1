// ---------------- Your cohort ----------------
// The people who started when you did: a couple of friends, a rival, a wildcard from another craft. The world moves
// them along like anyone else; you hear when they land something, and you can see who's ahead. Chosen once, by
// hash and closeness, without dice: young people in your city with few credits, preferring those you've met.
function pickCohort() {
  const M = S.me, me = ME(), age = S.year - me.born;
  const young = id => { const q = P(id); return q && !q.dead && !q.retired && !q.player && Math.abs((S.year - q.born) - age) <= 6 && q.credits.length <= 3; };
  const met = Object.keys(M.known).map(Number).filter(young);
  const pool = [...new Set(met.concat(ROLES.flatMap(r => S.pool[M.hub][r]).filter(young)))];
  const score = id => (M.known[id] ? 100 : 0) + (P(id).role === me.role ? 30 : 0) - Math.abs(P(id).standing - me.standing) + hashRand(id * 17 + me.id)() * 20;
  pool.sort((a, b) => score(b) - score(a));
  const rival = met.find(id => M.known[id].tags.includes('Rival')) ?? pool.find(id => P(id).role === me.role && !M.known[id]) ?? pool[0];
  const others = pool.filter(id => id !== rival);
  const wild = others.find(id => P(id).role !== me.role && MAIN[P(id).role] !== MAIN[me.role]);
  const L = [rival].concat(others.filter(id => id !== wild).slice(0, 2), wild !== undefined ? [wild] : []).filter(x => x !== undefined);
  M.cohort = L.map(id => ({ id, kind: id === rival ? 'rival' : id === wild ? 'wild' : 'friend', cr: P(id).credits.length, since: S.week }));
  for (const c of M.cohort) { meet(c.id, c.kind === 'rival' ? 'Rival' : 'Started out together', c.kind === 'rival' ? -5 : 8); }
}
function cohortWeek() {
  const M = S.me;
  if (!M.cohort) { if (M.stats.weeks >= 0 && Object.keys(M.known).length >= 3) pickCohort(); return; }
  for (const c of M.cohort) {
    const q = P(c.id); if (!q || q.dead) continue;
    if (q.credits.length > c.cr) {
      c.cr = q.credits.length;
      const f = S.films[q.credits[q.credits.length - 1]], first = c.cr === 1;
      if (c.kind === 'rival') inbox('note', `${q.name} again`, `Your old rival ${q.name} has ${first ? 'their first screen credit' : 'another credit'}${f ? ', on ' + f.title : ''}. ${ME().credits.length >= c.cr ? 'You still have more. For now.' : 'They\'re pulling ahead.'}`, { person: c.id });
      else if (opinion(c.id) > 0) sms(c.id, pickLine(first ? ['I GOT A CREDIT. my name. on a film. I\'m shaking', 'first credit!!! drinks on me (one drink)', 'remember when we said we\'d both make it? one of us is on the way!!'] : ['another one in the bag', 'wrapped another one. tired. happy', `just finished on ${f ? f.title : 'a film'}. you'd have loved the crew`], c.id + S.week), 'life');
    }
  }
}
function cohortHTML() {
  const M = S.me, me = ME();
  if (!M.cohort || !M.cohort.length) return '';
  const rows = [{ id: me.id, kind: 'you' }].concat(M.cohort).filter(c => P(c.id));
  const sc = id => P(id).credits.length * 10 + P(id).standing;
  rows.sort((a, b) => sc(b.id) - sc(a.id));
  const ahead = M.cohort.filter(c => P(c.id) && sc(c.id) < sc(me.id)).length;
  const lab = { you: 'You', rival: '⚔️ Rival', friend: '🙂 Started with you', wild: '🎲 Another craft' };
  return `<section class="panel cohort"><h3>Your cohort</h3><p class="muted small">The people who started when you did. ${ahead === M.cohort.length ? 'You\'re ahead of all of them.' : ahead === 0 ? 'Everyone is ahead of you, for now.' : `You're ahead of ${ahead} of ${M.cohort.length}.`}</p>
   <div class="tw"><table class="grid"><thead><tr><th></th><th>Name</th><th>Craft</th><th class="n">Credits</th><th class="n">Standing</th><th>Latest</th></tr></thead><tbody>
   ${rows.map(c => { const q = P(c.id), last = q.credits.length ? S.films[q.credits[q.credits.length - 1]] : null; return `<tr${c.kind === 'you' ? ' class="me"' : ''}><td class="small">${lab[c.kind]}</td><td>${c.kind === 'you' ? '<b>' + esc(q.name) + '</b>' : pl(c.id)}${q.dead ? ' <span class="muted">(died)</span>' : q.retired ? ' <span class="muted">(left the business)</span>' : ''}</td><td>${esc(ROLE_LABEL[q.role])}</td><td class="n">${q.credits.length}</td><td class="n">${Math.round(q.standing)}</td><td>${last ? fl(last.id) : '<span class="muted">—</span>'}</td></tr>`; }).join('')}
   </tbody></table></div></section>`;
}
