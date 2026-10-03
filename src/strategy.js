// ---------------- Strategy: departments, release tactics, reputation, the awards screen ----------------
// Your company is something you build: invest in departments that each make your films better or cheaper in a
// specific way, and pick how you release them. Your career has a reputation: some choices leave a mark that follows
// you into every application. And the awards screen gathers every prize and deadline in one place.
const CO_DEPTS = {
  dev: { label: 'Development team', icon: '📚', d: 'Readers and script editors. Your films\' scripts score higher.', per: 'script +4' },
  mkt: { label: 'Marketing department', icon: '📣', d: 'Trailers, posters, a publicist. Bigger openings, at a price.', per: 'audience appeal +8, marketing spend +10%' },
  post: { label: 'Post house', icon: '🎚️', d: 'Your own edit suites and mixers. The crafts come together better.', per: 'quality +2' },
  talent: { label: 'Talent relations', icon: '🤝', d: 'Someone who keeps the stars happy. Cheaper leads, better chemistry.', per: 'lead fees −12%, quality +1' },
  stage: { label: 'Sound stage', icon: '🏗️', d: 'Your own stage: no renting, fewer weather days.', per: 'budgets −7%' }
};
const DEPT_COST = [0, 150000, 400000, 900000], DEPT_UPKEEP = [0, 1200, 3000, 7000];
const RELEASE = {
  wide: { label: 'Go wide', d: 'Big marketing push, every screen we can get. Best for crowd-pleasers.', hook: 6, pa: 1.25 },
  fest: { label: 'Festivals first', d: 'Premiere at festivals, build word of mouth. Cheaper, critics love it, slower money.', hook: -4, pa: .8, fest: 1 },
  platform: { label: 'Start small and build', d: 'A few cities, then expand if it works. Low risk, modest upside.', hook: 0, pa: .7 }
};
function deptLevel(k) { const c = typeof myCo === 'function' ? myCo() : null; return c && c.depts ? c.depts[k] || 0 : 0; }
function investDept(a) {
  const c = myCo(); if (!c || c.closed !== null || !CO_DEPTS[a.k]) return false;
  c.depts = c.depts || {};
  const lv = c.depts[a.k] || 0; if (lv >= 3) return false;
  const cost = usd(DEPT_COST[lv + 1]) / 1e6; if (c.cash < cost) return false;
  c.cash -= cost; c.depts[a.k] = lv + 1;
  milestone(`${c.name} builds its ${CO_DEPTS[a.k].label.toLowerCase()} (level ${lv + 1})`, 'work');
  return true;
}
function setRelease(a) { const c = myCo(); if (!c || !RELEASE[a.k]) return false; c.release = a.k; return true; }
function deptUpkeep(c) { return Object.entries(c.depts || {}).reduce((s, [, lv]) => s + usd(DEPT_UPKEEP[lv]), 0) / 1e6; }
// What the departments and release choice do to one of your company's films, applied when it's greenlit.
function companyEdge(c, o) {
  const d = c.depts || {}, R = RELEASE[c.release || 'wide'];
  return { score: (o.score || 0) + (d.dev || 0) * 4, qBonus: (d.post || 0) * 2 + (d.talent || 0), hookBonus: (d.mkt || 0) * 8 + R.hook, paMul: (1 + (d.mkt || 0) * .1) * R.pa, budgetMul: 1 - (d.stage || 0) * .07, leadMul: 1 - (d.talent || 0) * .12, fest: !!R.fest };
}
// ---- reputation ----
const REP_FLAGS = {
  scab: { label: 'Crossed a picket line', d: 'Union crews remember. Harder to get on bigger productions.', hire: -.5, minTier: 2 },
  organiser: { label: 'Strike organiser', d: 'Crews trust you; some producers are wary.', hire: .25 },
  honest: { label: 'Straight talker', d: 'You told the truth when it cost you. Heads of department notice.', hire: .2 },
  fudger: { label: 'Fudged the numbers', d: 'Someone noticed. A small mark against you with ADs and producers.', hire: -.15 },
  mudslinger: { label: 'Mudslinger', d: 'You were caught running down a rival film in awards season. Producers are wary.', hire: -.3 },
  reliable: { label: 'Reliable', d: 'Always on time, never the reason a setup waits.', hire: .2 }
};
function repFactors(post) {
  const M = S.me, out = [];
  for (const k in M.flags || {}) { const R = REP_FLAGS[k]; if (!R || S.week - M.flags[k] > 260) continue; if (R.minTier && (post.tier || 1) < R.minTier) continue; out.push([R.label, R.hire]); }
  return out;
}
function reputationHTML() {
  const M = S.me, L = Object.entries(M.flags || {}).filter(([k]) => REP_FLAGS[k]);
  return `<section class="panel"><h3>Your reputation</h3>${L.length ? `<ul class="plain">${L.map(([k, w]) => `<li><b>${esc(REP_FLAGS[k].label)}</b> <span class="muted small">since ${fmtDate(w, true)}</span><br><span class="muted">${esc(REP_FLAGS[k].d)}</span></li>`).join('')}</ul><p class="muted small">Reputations fade after about five years.</p>` : '<p class="muted">Nothing sticks to you yet. Some choices will: how you act in a strike, whether you tell the truth on set.</p>'}</section>`;
}
// ---- the company's strategy panel ----
function strategyPanel(c) {
  if (!c || c.closed !== null) return '';
  const d = c.depts || {}, rel = c.release || 'wide';
  return `<div class="strat"><h4>Departments</h4><div class="depts">${Object.entries(CO_DEPTS).map(([k, D]) => { const lv = d[k] || 0, next = lv < 3 ? usd(DEPT_COST[lv + 1]) : null; return `<div class="dept"><span class="di">${D.icon}</span><div><b>${esc(D.label)}</b> <span class="lvl">${'●'.repeat(lv)}${'○'.repeat(3 - lv)}</span><p class="muted small">${esc(D.d)} Per level: ${esc(D.per)}.${lv ? ` Upkeep ${fmtCash(usd(DEPT_UPKEEP[lv]))}/wk.` : ''}</p>${next !== null ? `<button class="btn-s ghost" data-dept="${k}" ${c.cash * 1e6 < next ? 'disabled' : ''}>Build level ${lv + 1} · ${fmtCash(next)}</button>` : '<span class="muted small">Fully built</span>'}</div></div>`; }).join('')}</div>
   <h4>How you release films</h4><div class="seg">${Object.entries(RELEASE).map(([k, R]) => `<button class="pill${rel === k ? ' on' : ''}" data-release="${k}" title="${esc(R.d)}">${esc(R.label)}</button>`).join('')}</div><p class="muted small">${esc(RELEASE[rel].d)}</p></div>`;
}
// ---- the awards screen ----
function viewAwards() {
  const M = S.me, me = S.me ? ME() : null, st = UI.aw = UI.aw || {};
  const years = [...new Set((S.awards || []).map(a => a.y))].sort((a, b) => b - a), y = +(st.y || years[0] || S.year);
  const rows = (S.awards || []).filter(a => a.y === y && (!st.q || a.name.toLowerCase().includes(st.q.toLowerCase())));
  const mo = dateOf(S.week).getUTCMonth(), MON_ = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const cal = [].concat((typeof CONTESTS !== 'undefined' ? CONTESTS : []).map(c => ({ m: c.month, t: c.name, k: 'Screenplay contest', d: c.d })), (typeof FESTIVALS !== 'undefined' ? FESTIVALS : []).map(f => ({ m: f.month, t: f.name.replace(/^the /, 'The '), k: 'Festival', d: f.d })), [{ m: 1, t: S.me ? 'The ' + ceremony(awardsMarket()) : 'The national film awards', k: 'Awards night', d: 'Best Film, Best Performance, Best Screenplay. Invitations go to nominees, their friends and people with standing.' }]).sort((a, b) => ((a.m - mo + 12) % 12) - ((b.m - mo + 12) % 12));
  const mine = me ? (S.awards || []).filter(a => a.people.includes(me.id) || (M.past || []).some(p => p.film === a.film && p.credited)) : [];
  return `<div class="head"><h2>Awards and recognition</h2><p class="lede">Prizes, festivals and contests: the other road to a name, beside the job board.</p></div>
   <div class="cols two"><section class="panel"><h3>Coming up</h3><ul class="plain">${cal.map(x => `<li><b>${MON_[x.m]}</b> · ${typeof bodyLink === 'function' ? bodyLink(x.t.replace(/^The (?=Academy|Mountain|Festival|Lagoon|Northern|Harbour)/, '')) : esc(x.t)} <span class="chip">${esc(x.k)}</span><br><span class="muted small">${esc(x.d)}</span></li>`).join('')}</ul><p class="muted small">Enter scripts in contests and films in festivals from the Create tab.</p></section>
   <section class="panel"><h3>Your recognition</h3>${mine.length ? `<ul class="plain">${mine.map(a => `<li>✦ ${esc(a.name)} ${a.y} · ${fl(a.film)}${a.people.includes(me.id) ? ' <b>(yours)</b>' : ''}</li>`).join('')}</ul>` : '<p class="muted">Nothing yet. Work on films that win, write scripts that place, or take your own films to festivals.</p>'}
    ${M && (M.scripts || []).some(s => s.won) ? `<h4>Contests</h4><ul class="plain">${M.scripts.filter(s => s.won).map(s => `<li>${esc(s.title)}: ${esc(s.won.join(', '))}</li>`).join('')}</ul>` : ''}</section></div>
   ${typeof egofHTML === 'function' && S.me ? egofHTML() : ''}${typeof awardsCabinetHTML === 'function' ? awardsCabinetHTML() : typeof awardBodiesHTML === 'function' ? awardBodiesHTML() : ''}
   ${(() => { const c = {}; rows.forEach(a => { c[a.film] = (c[a.film] || 0) + 1; }); const top = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; if (top === undefined) return ''; const f = S.films[+top]; return `<section class="panel fotY"><h3>Film of ${y}</h3><div class="fotY-b">${typeof posterSVG === 'function' ? `<div class="fotY-p">${posterSVG(f, 110)}</div>` : ''}<div><p><b>${fl(f.id)}</b> · ${c[top]} award${c[top] === 1 ? '' : 's'}</p><p>${esc(filmLogline(f))}</p><p class="muted"><i>“${esc(filmTagline(f))}”</i></p></div></div></section>`; })()}
   <h3>Winners</h3><div class="filters">${sel('aw-y', years.map(v => [v, v]), y)}<input id="aw-q" type="search" placeholder="Filter by award or country…" value="${esc(st.q || '')}"></div>
   <div class="tw"><table class="grid"><thead><tr><th>Award</th><th>Film</th><th>Winners</th></tr></thead><tbody>${rows.map(a => `<tr><td>${typeof bodyLink === 'function' ? bodyLink(a.name) : esc(a.name)}</td><td>${fl(a.film)}</td><td>${a.people.map(pl).join(', ')}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">No awards recorded for this year yet.</td></tr>'}</tbody></table></div>`;
}
