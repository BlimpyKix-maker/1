// ---------------- Your credits, all in one place ----------------
// Credit used to live in six places (finished jobs, the film's extra-credit list, your filmography on release, TV
// credits, gigs, shorts), each read by a different page, and a lot of real work never earned a line. Now:
//  - any week or more of work on a film earns a credit, including jobs that used to be uncredited (they appear as
//    additional crew), and you keep credit for work you did even if you leave once you're halfway through;
//  - every title you held on a film is kept, so "writer, director and producer" shows as all three;
//  - your company's films credit you as producer, executive producer deals credit you as one, studio executives get
//    a line too, and everything lands in your filmography when it comes out, with a note;
//  - one Credits page shows everything: in production, wrapped, out, TV, gigs, shorts, and anything that slipped
//    through, with the reason.
function crTitles(fid) { const M = S.me; return ((M.ftitles = M.ftitles || {})[fid] = M.ftitles[fid] || []); }
function crAdd(fid, t) { const L = crTitles(fid); if (t && !L.includes(t)) L.push(t); }
{ const _fj = finishJob;
  finishJob = function (j, L, quit) {
    const M = S.me, n0 = M.past.length, r = _fj.apply(this, arguments);
    const pj = M.past[n0], f = j && j.film !== null && j.film !== undefined ? S.films[j.film] : null;
    if (!pj || !f) return r;
    const done = j.done || 0, half = Math.max(2, Math.ceil((j.weeks || 2) / 2));
    if (!pj.credited && f.stage >= 0 && done >= 1 && (!quit || done >= half)) {
      pj.credited = true; pj.minor = !tmplOf(j).cr; f.xc = f.xc || {}; if (!f.xc[M.id]) f.xc[M.id] = j.t;
    }
    if (pj.credited) crAdd(f.id, j.t);
    else pj.why = f.stage < 0 ? 'The film fell apart before it was finished' : done < 1 ? 'You left before a full week' : quit ? 'You left before the halfway point' : 'Not credited';
    return r;
  };
}
// every way you can be on a film
function crRolesFor(f) {
  const M = S.me, me = ME(), R = crTitles(f.id).slice();
  const add = t => { if (t && !R.includes(t)) R.push(t); };
  if (f.dir === M.id || (f.codir || []).includes(M.id)) add('Director');
  if ((f.wri || []).includes(M.id)) add('Writer');
  if (f.prod === M.id) add('Producer');
  const c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null;
  if (c && c.owner === M.id) add('Producer (your company)');
  if (f.xc && f.xc[M.id] && !/^(Director|Writer-producer|Producer|Screenplay)$/.test(f.xc[M.id])) add(f.xc[M.id]);
  if (f.xc && f.xc[M.id] === 'Screenplay') add('Writer');
  if (f.xc && f.xc[M.id] === 'Writer-producer') { add('Writer'); add('Producer'); }
  if (f.exec && f.exec[M.id] !== undefined) add('Studio executive');
  if (S.me.pets && S.me.pets.some(p => (p.credits || []).includes(f.id))) add(`Your pet, as themself`);
  return R;
}
function crFilms() { const M = S.me, me = ME(), ids = new Set();
  for (const pj of M.past) if (pj.film !== null && pj.film !== undefined) ids.add(pj.film);
  for (const j of M.jobs) if (j.film !== null && j.film !== undefined) ids.add(j.film);
  for (const id of me.credits) ids.add(id);
  for (const k in M.ftitles || {}) ids.add(+k);
  const c = typeof myCo === 'function' ? myCo() : null; if (c) for (const id of c.films || []) ids.add(id);
  for (const s of M.scripts || []) if (s.made !== undefined && s.made !== null) ids.add(s.made);
  for (const h of M.holdings || []) if (h.made !== undefined && h.made !== null) ids.add(h.made);
  for (const f of S.active.map(i => S.films[i])) if (f && ((f.xc && f.xc[M.id]) || (f.exec && f.exec[M.id] !== undefined) || f.dir === M.id || f.prod === M.id)) ids.add(f.id);
  for (const t of M.talks || []) if (t.film !== undefined && t.film !== null) ids.add(t.film);
  return [...ids].map(i => S.films[i]).filter(Boolean);
}
function creditLedger() {
  const M = S.me, rows = [];
  for (const f of crFilms()) {
    const roles = crRolesFor(f), now = M.jobs.filter(j => j.film === f.id).map(j => j.t);
    const lost = M.past.filter(p => p.film === f.id && !p.credited);
    if (!roles.length && !now.length && !lost.length) continue;
    const status = f.stage < 0 ? 'never finished' : f.rel !== null ? 'out' : now.length ? 'working on it' : f.stage >= 3 ? 'in post' : 'in production';
    rows.push({ f, roles: roles.length ? roles : now, status, lost: roles.length ? [] : lost, w: f.rel !== null ? f.rel : S.week + 100 });
  }
  return rows.sort((a, b) => b.w - a.w);
}
// on release: everything you were credited on lands in your filmography, with a note, whatever route you got there
function creditsWeek() {
  const M = S.me, me = ME(); M.crSeen = M.crSeen || {};
  for (const f of crFilms()) {
    if (f.rel === null || f.stage < 0 || M.crSeen[f.id]) continue;
    const roles = crRolesFor(f); if (!roles.length) continue;
    M.crSeen[f.id] = 1;
    if (!me.credits.includes(f.id)) { me.credits.push(f.id); M.stats.credits++; me.standing = clamp(me.standing + .6 + (f.q - 55) * .02, 0, 100);
      inbox('news', `${f.title} is out`, `${f.title} opens: critics ${f.reviews}/100, ${fmtM(f.total)} worldwide. You're in the credits as ${roles.map(r => r.toLowerCase()).join(', ')}.`, { film: f.id }); }
  }
  // your company in the red
  const c = typeof myCo === 'function' ? myCo() : null;
  if (c && c.closed === null && c.cash < 0 && S.week - (M.coRedW || -99) >= 8) { M.coRedW = S.week; inbox('note', `${c.name} is overdrawn`, `${c.name} is ${fmtCash(Math.round(-c.cash * 1e6))} in the red. Put money in from the Bank or Create, raise money, or wind things down before suppliers stop taking your calls.`); }
}
function creditsHTML() {
  const M = S.me; if (!M) return ''; const L = creditLedger();
  const sect = (h, rows) => rows.length ? `<h4>${h}</h4><div class="tw"><table class="grid"><thead><tr><th>Year</th><th>Film</th><th>Your credit</th><th>Status</th><th class="n">Critics</th><th class="n">Gross</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.f.rel !== null ? yearOf(r.f.rel) : '—'}</td><td>${fl(r.f.id)}</td><td>${r.roles.map(esc).join(', ')}${r.lost.length ? ` <span class="small bad">${esc(r.lost.map(p => `${p.t}: ${p.why || 'no credit'}`).join('; '))}</span>` : ''}</td><td><span class="chip small">${esc(r.status)}</span></td><td class="n">${r.f.rel !== null ? reviewCell(r.f.reviews) : ''}</td><td class="n">${r.f.rel !== null ? fmtM(r.f.total) : ''}</td></tr>`).join('')}</tbody></table></div>` : '';
  const out = L.filter(r => r.status === 'out' && r.roles.length), coming = L.filter(r => r.status !== 'out' && r.status !== 'never finished' && r.roles.length), lost = L.filter(r => !r.roles.length || r.status === 'never finished');
  const gigs = (M.gigs || []).filter(g => g.credit), works = M.works || [];
  const tv = Object.entries(M.tvCred || {}).map(([id, r]) => [typeof tvShow === 'function' ? tvShow(id) : null, r]).filter(x => x[0]).concat((M.shows || []).map(s => [s, 'Creator and showrunner']));
  return `<section class="panel credits2"><h3>Your credits</h3>
   <p class="muted small">${out.length} film${out.length === 1 ? '' : 's'} out, ${coming.length} on the way${tv.length ? `, ${tv.length} in television` : ''}${gigs.length ? `, ${gigs.length} gig${gigs.length > 1 ? 's' : ''}` : ''}${works.length ? `, ${works.length} of your own works` : ''}. A week's work on a film earns a credit. Leave before the halfway point and you lose it.</p>
   ${sect('Coming up', coming)}${sect('Filmography', out)}
   ${tv.length ? `<h4>Television</h4><ul class="plain">${tv.map(([s, r]) => `<li>${typeof tvLink === 'function' ? tvLink(s) : esc(s.title)} · ${esc(String(r))}</li>`).join('')}</ul>` : ''}
   ${gigs.length ? `<h4>Gigs</h4><ul class="plain small">${gigs.slice(-20).reverse().map(g => `<li>${esc(g.credit)}${g.client ? ` · ${esc(g.client)}` : ''} <span class="muted">${fmtDate(g.w, true)}</span></li>`).join('')}</ul>` : ''}
   ${works.length ? `<h4>Your own work</h4><ul class="plain small">${works.slice(-20).reverse().map(w => `<li>${esc(w.title || 'Untitled')} <span class="muted">${esc(w.student ? 'student film' : w.type || '')}${w.rel !== undefined ? ', ' + yearOf(w.rel) : ''}</span></li>`).join('')}</ul>` : ''}
   ${(() => { const O = M.past.filter(p => p.film === null || p.film === undefined).slice(-12).reverse(); return O.length ? `<h4>Other work</h4><ul class="plain small">${O.map(p => `<li>${esc(p.t)} <span class="muted">${fmtDate(p.from, true)} – ${fmtDate(p.to, true)}${p.quit ? ', left early' : ''}</span></li>`).join('')}</ul>` : ''; })()}
   ${lost.length ? `<h4>No credit</h4><ul class="plain small">${lost.map(r => `<li>${fl(r.f.id)}: ${esc((r.lost.length ? r.lost : [{ t: '', why: r.status }]).map(p => `${p.t ? p.t + ', ' : ''}${(p.why || 'no credit').toLowerCase()}`).join('; '))}</li>`).join('')}</ul>` : ''}
   ${!L.length && !tv.length && !gigs.length && !works.length ? '<p class="muted">No credits yet. Your first job on a film will show up here the week you start.</p>' : ''}</section>`;
}
OS_EXTRA.credits = ['🎞️', 'Credits', 'Every credit you have or are earning, in films, TV, gigs and your own work'];
OS_VIEWS.credits = () => creditsHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Work'); if (g && !g[1].includes('credits')) g[1].splice(1, 0, 'credits'); }
// the player's page: films you're on now, and all your titles
{ const _vp = viewPerson; viewPerson = function (id) { const h = _vp(id); if (!S.me || id !== S.me.id) return h; const x = `<p class="small"><button class="os-link" data-app="credits">See all your credits, including what's still being made ›</button></p>`; const i = h.indexOf('<h3>Filmography</h3>'); return i < 0 ? h + x : h.slice(0, i) + x + h.slice(i); }; }
