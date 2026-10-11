// ---------------- Your audience, and the crisis room ----------------
//  · An audience of your own. Every film with your name high on it (as director, lead, writer or through your
//    company) wins you fans of its genre, more the bigger it was; a film the critics loved wins cinephiles; family
//    films win families. Fans drift away slowly if you don't feed them. When your next film is in a genre your fans
//    love, they turn up on opening weekend (the film's hook goes up); switch genres and only some of them follow.
//    It's on the Standing page.
//  · The crisis room. When a secret of yours comes out, you get to answer it: deny it, apologise, lawyer up, hire a
//    fixer, or bury it under bigger news. What you choose decides how much of the damage sticks, and a bad answer
//    keeps the story alive for another week or three.
function fansOf() { return (S.me.fans = S.me.fans || {}); }
function fanTotal() { return Object.values(fansOf()).reduce((t, v) => t + v, 0); }
function fanMine(f) { const M = S.me, me = ME(); return (M.company !== undefined && f.co === M.company) || f.dir === me.id || (f.cast || [])[0] === me.id || (f.wri || []).includes(me.id); }
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); const M = S.me; if (!M || !f || !M.party || !M.party.done || f.fanIn || !fanMine(f)) return out; f.fanIn = 1;
  const F = fansOf(), n = Math.round(Math.max(0, f.total || 0) * 2500 * (f.dir === ME().id || (f.cast || [])[0] === ME().id ? 1 : .5));   // a few thousand people per million of gross remember your name
  F[f.genre] = (F[f.genre] || 0) + n; if ((f.reviews || 0) >= 75) F.Cinephiles = (F.Cinephiles || 0) + Math.round(n * .3); if (['Family', 'Animation'].includes(f.genre)) F.Families = (F.Families || 0) + Math.round(n * .4);
  return out; }; }
function fanWeek() { const F = S.me && S.me.fans; if (!F) return; for (const k in F) { F[k] = Math.round(F[k] * .996); if (F[k] < 50) delete F[k]; } }
// your fans open your films: a bonus on the hook of the next one you make, by how many love that genre
function fanHook(genre) { const F = fansOf(), same = F[genre] || 0, rest = fanTotal() - same; const n = same + rest * .2; return n > 0 ? clamp(Math.log10(1 + n / 5000) * 4, 0, 10) : 0; }
{ const _sf = selfFund; selfFund = function (a) { const n0 = S.films.length, r = _sf(a); if (!r) return r; const f = S.films.slice(n0).find(x => x.co === S.me.company); if (f && !f.fanHook) { const b = fanHook(f.genre); if (b >= .5) { f.fanHook = b; f.hook = clamp((f.hook || 50) + b, 5, 99); (f.events = f.events || []).push({ w: S.week, t: `Your fans of ${f.genre.toLowerCase()} are waiting for it: hook +${b.toFixed(1)}.`, q: 0 }); } } return r; }; }
function fansHTML() { const F = fansOf(), L = Object.entries(F).sort((a, b) => b[1] - a[1]); if (!L.length) return ''; const mx = L[0][1];
  return `<section class="panel"><h3>Your audience <span class="muted small">${Math.round(fanTotal()).toLocaleString()} people who'd go to a film because your name is on it</span></h3><div class="tk-bars">${L.slice(0, 8).map(([g, v]) => `<div class="ambrow"><span class="small">${esc(g)}</span><span class="tbar"><i style="width:${(v / mx * 100).toFixed(0)}%"></i></span><b class="small">${Math.round(v).toLocaleString()}</b><span class="small muted">${GENRES.includes(g) ? `+${fanHook(g).toFixed(1)} hook on your next ${g.toLowerCase()} film` : ''}</span></div>`).join('')}</div><p class="small muted">Fans of a genre follow you into it; switch genres and only about a fifth of them come along. They drift away slowly between films.</p></section>`; }
{ const _st = OS_VIEWS.standing; if (_st) OS_VIEWS.standing = () => fansHTML() + _st(); }
// ---- the crisis room ----
function crisisWeek() {
  const M = S.me; if (!M || !M.secrets) return;
  for (const x of M.secrets) if (x.out && !x.crisis) { x.crisis = S.week; const fixer = usd(40000), law = usd(15000), big = (M.company !== undefined && S.films.some(f => f.co === M.company && f.rel === null && f.stage === 3)) || M.jobs.some(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 3);
    inbox('crisis', 'The story breaks', `The story is everywhere by lunchtime: ${x.what}. Your phone has 140 missed calls. Your publicist wants an answer in an hour.`, { sec: M.secrets.indexOf(x), choices: [
      { k: 'cr_deny', label: `Deny it · ${checkLabel('cha', 15)}`, check: ['cha', 15] },
      { k: 'cr_sorry', label: 'Apologise, properly' },
      { k: 'cr_law', label: `Lawyer up and say nothing (${fmtCash(law)})`, dis: M.cash < law ? 'Not enough in the bank' : undefined },
      { k: 'cr_fixer', label: `Hire a fixer (${fmtCash(fixer)}) · ${checkLabel('pack', 13)}`, check: ['pack', 13], dis: M.cash < fixer ? 'Not enough in the bank' : undefined },
      { k: 'cr_bury', label: 'Bury it under bigger news: announce your next film', dis: big ? undefined : 'Nothing big enough to announce' }] }); }
  for (const x of M.secrets) if (x.alive && S.week >= x.alive && !pending().some(it => it.kind === 'crisis')) { delete x.alive; inbox('crisis', 'The story won\'t die', `A second wave: a former colleague goes on the record about ${x.what}. Sponsors are asking questions.`, { sec: M.secrets.indexOf(x), wave: 2, choices: [{ k: 'cr_sorry', label: 'Apologise now, fully' }, { k: 'cr_ride', label: `Ride it out · ${checkLabel('com', 14)}`, check: ['com', 14] }] }); }
}
function crisisPick(it, k) {
  if (it.kind !== 'crisis') return false; it.done = true; const M = S.me, me = ME(), x = (M.secrets || [])[it.sec]; if (!x) return true;
  const back = v => { me.standing = clamp(me.standing + v, 0, 100); };
  if (k === 'cr_deny') { const ok = roll('cha', 15); if (ok) { back(5); it.result = { ok, roll: M.lastRoll, t: 'You deny it flatly, on camera, and it holds. The story fades by the weekend.' }; } else { back(-3); x.alive = S.week + 2; it.result = { ok, roll: M.lastRoll, t: 'The denial doesn\'t survive the afternoon: someone has a document. Now it\'s two stories.' }; } return true; }
  if (k === 'cr_sorry') { back(it.wave ? 2 : 4); M.stress = clamp(M.stress - 6, 0, 100); me.fame = (me.fame || 0) + .3; it.result = { t: 'You say sorry, without a "but". Some people never forgive it. Most people move on faster than you expected.' }; return true; }
  if (k === 'cr_law') { M.cash -= usd(15000); back(3); it.result = { t: '"No comment," on legal advice. The story starves for lack of new facts.' }; return true; }
  if (k === 'cr_fixer') { M.cash -= usd(40000); const ok = roll('pack', 13); if (ok) { back(7); it.result = { ok, roll: M.lastRoll, t: 'A man you never meet makes some calls. The source recants. By Thursday the story is about someone else.' }; } else { back(1); x.alive = S.week + 3; it.result = { ok, roll: M.lastRoll, t: 'The fixer\'s involvement leaks. That becomes the story.' }; } return true; }
  if (k === 'cr_bury') { back(4); me.fame = (me.fame || 0) + .5; it.result = { t: 'You announce the release date and the first image the same morning. The trades lead with that.' }; return true; }
  if (k === 'cr_ride') { const ok = roll('com', 14); if (ok) { back(2); it.result = { ok, roll: M.lastRoll, t: 'You keep working and say nothing. It burns out.' }; } else { back(-3); M.stress = clamp(M.stress + 10, 0, 100); it.result = { ok, roll: M.lastRoll, t: 'A sponsor pulls out publicly. You have a very bad month.' }; } return true; }
  return true;
}
