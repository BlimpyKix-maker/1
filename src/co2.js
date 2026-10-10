// ---------------- Your company, grown up: offices, key people, a name for something ----------------
// A company is its people. Hire a head of development, a head of production, a head of marketing, a head of
// talent and a money person: each one is a real person in this world with a standing, a salary and opinions, and
// how good they are is how much they help (better scripts, cheaper shoots, bigger openings, cheaper stars, better
// terms from investors). The better your office, the more of them you can house and the more seriously people take
// you. Rivals will try to poach your best people, and if the money runs out they leave. Make enough films of one
// kind and you become known for it: films in your genre open bigger.

const OFFICES = [['A spare room', 0, 0, 1], ['A shared office', 25000, 300, 2], ['A studio floor', 250000, 2500, 4], ['The lot', 3000000, 20000, 6]];   // name, price, weekly rent, key people it houses
const KEY_POSTS = {
  dev: { label: 'Head of development', icon: '📚', roles: ['writer', 'producer'], d: 'Better scripts on everything you make.' },
  prod: { label: 'Head of production', icon: '🎬', roles: ['producer', 'ad'], d: 'Shoots that come in cheaper.' },
  mkt: { label: 'Head of marketing', icon: '📣', roles: ['producer'], d: 'Bigger openings.' },
  talent: { label: 'Head of talent', icon: '🤝', roles: ['casting', 'producer'], d: 'Stars for less.' },
  cfo: { label: 'Chief financial officer', icon: '💼', roles: ['producer'], d: 'Better terms with money: +1 on finance checks.' }
};
function co2Of(c) { return c.co2 || (c.co2 = { office: 0, staff: {}, broke: 0 }); }
function keySkill(id) { const p = P(id); return p ? clamp(Math.round(p.standing / 5 + (p.fame || 0) / 20), 1, 20) : 0; }
function keySalary(id) { const p = P(id); return usd(600 + (p ? p.standing * 45 : 0)); }
function keyOf(k) { const c = myCo(); if (!c || c.closed !== null) return null; const id = co2Of(c).staff[k]; return id !== undefined && P(id) && !P(id).dead ? id : null; }
function keyCandidates(k) {
  const M = S.me, c = myCo(), C = co2Of(c), taken = new Set(Object.values(C.staff)), r = hashRand(S.week * 3 + k.length * 101 + c.id * 7);
  const L = S.people.filter(p => !p.dead && !p.retired && p.hub === M.hub && KEY_POSTS[k].roles.includes(p.role) && p.id !== M.id && !taken.has(p.id) && S.year - p.born > 28 && p.standing >= 15).map(p => [p, p.standing + (M.known[p.id] ? 15 : 0) + r() * 25]).sort((a, b) => b[1] - a[1]);
  return L.slice(0, 3).map(x => x[0]);
}
function co2Act(a) {
  const M = S.me, c = myCo(); if (!c || c.closed !== null) return false; const C = co2Of(c);
  if (a.k === 'office') { const n = C.office + 1, O = OFFICES[n]; if (!O || c.cash < usd(O[1]) / 1e6) return false; c.cash -= usd(O[1]) / 1e6; C.office = n; milestone(`${c.name} moves into ${O[0].toLowerCase()}`, 'work'); ME().standing = clamp(ME().standing + n, 0, 100); return true; }
  if (a.k === 'hire') { const P0 = KEY_POSTS[a.post], id = +a.id; if (!P0 || C.staff[a.post] !== undefined || Object.keys(C.staff).length >= OFFICES[C.office][3] || !keyCandidates(a.post).some(p => p.id === id)) return false;
    const ok = roll('cha', 8 + Math.round(P(id).standing / 10) - (M.known[id] ? 2 : 0)); if (!ok) { inbox('note', `${P(id).name} says no`, `${P(id).name} thanks you and stays where they are. Maybe when the company is bigger.`); return true; }
    C.staff[a.post] = id; meet(id, 'Works for you', 10); diary(`${P(id).name} joins ${c.name} as ${P0.label.toLowerCase()}.`); milestone(`Hired ${P(id).name} as ${P0.label.toLowerCase()}`, 'work'); return true; }
  if (a.k === 'fire') { const id = C.staff[a.post]; if (id === undefined) return false; delete C.staff[a.post]; if (P(id)) addTie(ME(), P(id), -10); return true; }
  return false;
}
function co2Week() {
  const M = S.me, c = myCo(); if (!c || c.closed !== null) return; const C = co2Of(c);
  const rent = usd(OFFICES[C.office][2]), pay = Object.values(C.staff).reduce((t, id) => t + keySalary(id) * (1 + ((C.raise || {})[id] || 0)), 0); c.cash -= (rent + pay) / 1e6;
  ME().standing = clamp(ME().standing + C.office * .02, 0, 100);
  if (c.cash < 0) { C.broke++; if (C.broke >= 4 && Object.keys(C.staff).length) { const k = Object.keys(C.staff)[0], id = C.staff[k]; delete C.staff[k]; inbox('note', `${P(id).name} leaves`, `Payroll bounced twice. ${P(id).name} has taken a job somewhere that pays.`); } } else C.broke = 0;
  for (const [k, id] of Object.entries(C.staff)) if (P(id) && (P(id).dead || P(id).retired)) delete C.staff[k];
  if (!pending().some(it => it.kind === 'copoach')) for (const [k, id] of Object.entries(C.staff)) if (prnd() < .015 + keySkill(id) / 1000) {
    inbox('copoach', `A rival wants ${P(id).name}`, `A bigger company has offered your ${KEY_POSTS[k].label.toLowerCase()} a job, for a lot more money.`, { post: k, person: id, choices: [{ k: 'match', label: `Match it (+${fmtCash(Math.round(keySalary(id) * .3))} a week)` }, { k: 'loyal', label: `Remind them what you're building · ${checkLabel('cha', 12)}`, check: ['cha', 12] }, { k: 'go', label: 'Wish them well' }] }); break; }
}
function co2Pick(it, k) {
  if (it.kind !== 'copoach') return false; it.done = true; const c = myCo(), C = c && co2Of(c), id = it.person; if (!C || C.staff[it.post] !== id) { it.result = { t: 'It no longer matters.' }; return true; }
  if (k === 'match') { C.raise = C.raise || {}; C.raise[id] = (C.raise[id] || 0) + .3; it.result = { t: `You match it. ${P(id).name} stays, and knows what they're worth.` }; return true; }
  if (k === 'loyal') { const ok = roll('cha', 12); if (ok) { addTie(ME(), P(id), 5); it.result = { ok, roll: S.me.lastRoll, t: `${P(id).name} stays. "I want to see how this ends."` }; } else { delete C.staff[it.post]; it.result = { ok, roll: S.me.lastRoll, t: `${P(id).name} takes the job. It was always going to be the money.` }; } return true; }
  delete C.staff[it.post]; addTie(ME(), P(id), 4); it.result = { t: `${P(id).name} goes, and owes you one.` }; return true;
}
// what the key people do, and what you're known for
function coBrand(c) { const L = (c.films || []).map(i => S.films[i]).filter(f => f && f.rel !== null); const n = {}; for (const f of L) n[f.genre] = (n[f.genre] || 0) + 1; const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0]; return top && top[1] >= 2 ? top[0] : null; }
{ const _ce = companyEdge;
  companyEdge = function (c, o) {
    const e = _ce(c, o); if (!S.me || c.id !== S.me.company || c.closed !== null) return e;
    const s = k => { const id = keyOf(k); return id === null ? 0 : keySkill(id); };
    e.score = (e.score || 0) + s('dev') * .4; e.qBonus += s('dev') * .08;
    e.budgetMul *= 1 - s('prod') * .004; e.hookBonus += s('mkt') * .4; e.leadMul *= 1 - s('talent') * .005;
    const b = coBrand(c); if (b && o && o.genre === b) e.hookBonus += 4;
    return e;
  };
}
{ const _cm2 = checkMods; checkMods = function (stat) { const r = _cm2(stat); if (stat === 'fin' && S.me && typeof keyOf === 'function' && S.me.company !== undefined && keyOf('cfo') !== null) { r.mod += 1; r.why.push('Your CFO +1'); } return r; }; }
function co2HTML(c) {
  if (!c || c.closed !== null) return ''; const C = co2Of(c), O = OFFICES[C.office], nx = OFFICES[C.office + 1], slots = O[3], used = Object.keys(C.staff).length, brand = coBrand(c);
  const post = ([k, D]) => { const id = keyOf(k); if (id !== null) return `<div class="kp">${portraitOf(P(id), 44)}<div><b>${esc(D.icon + ' ' + D.label)}</b><br>${pl(id)} · skill ${keySkill(id)} · ${fmtCash(keySalary(id))}/wk<br><span class="muted small">${esc(D.d)}</span> <button class="linkish" data-co2="fire:${k}">Let go</button></div></div>`;
    const L = used < slots ? keyCandidates(k) : []; return `<div class="kp empty"><span class="kpi">${D.icon}</span><div><b>${esc(D.label)}</b> <span class="muted small">${esc(D.d)}</span><br>${used >= slots ? '<span class="muted small">No room in this office.</span>' : L.map(p => `<button class="pill" data-co2="hire:${k}:${p.id}" title="Charisma roll to win them over">${esc(p.name)} · skill ${keySkill(p.id)} · ${fmtCash(keySalary(p.id))}/wk</button>`).join(' ') || '<span class="muted small">Nobody suitable in town right now.</span>'}</div></div>`; };
  return `<div class="strat"><h4>Your office: ${esc(O[0])}</h4><p class="small">${O[2] ? fmtCash(usd(O[2])) + ' a week · ' : ''}room for ${slots} key ${slots === 1 ? 'person' : 'people'}${brand ? ` · known for <b>${esc(brand.toLowerCase())}</b> (those films open bigger)` : ''}. ${nx ? `<button class="btn-s ghost" data-co2="office"${c.cash < usd(nx[1]) / 1e6 ? ' disabled' : ''}>Move to ${esc(nx[0].toLowerCase())} (${fmtCash(usd(nx[1]))}, then ${fmtCash(usd(nx[2]))}/wk)</button>` : ''}</p>
   <h4>Key people <span class="count">${used}/${slots}</span></h4><div class="kps">${Object.entries(KEY_POSTS).map(post).join('')}</div><p class="muted small">Salaries come out of the company account every week. Hiring someone is a Charisma roll; people you already know say yes more easily.</p></div>`;
}
{ const _sp = strategyPanel; strategyPanel = function (c) { return _sp(c) + co2HTML(c); }; }
function co2Click(t) { if (!t.dataset.co2) return false; const [k, post, id] = t.dataset.co2.split(':'), n0 = S.me.rollN || 0; doAct({ t: 'co2', k, post, id }); render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll); return true; }
