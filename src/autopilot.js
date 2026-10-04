// ---------------- Autopilot: less clicking, more living ----------------
// New players shouldn't have to click through every small thing to get going. Autopilot (on by default, with a switch
// on Today) applies to the best-fit jobs when you're out of work and settles small everyday moments with the sensible
// choice, so the week flows; anything that matters (offers, interviews, deals, invitations) still waits for you.
// Every auto choice goes through the action log like a click, so saves replay the same.
function autoOn(k) { const A = (S.me && S.me.auto) || {}; return A[k] !== false; }
function autoAct(a) { const M = S.me; M.auto = M.auto || {}; if (a.k === 'looking') { M.looking = lookingForWork() ? 'no' : 'yes'; return true; } if (!['apply', 'minor'].includes(a.k)) return false; M.auto[a.k] = !autoOn(a.k); return true; }
// the sensible choice: an option with no roll and no cost, else the first
function sensibleChoice(it) { const L = (it.choices || []).filter(c => !c.dis); return (L.find(c => !c.check && !/quit|leave|skip|refuse|no thanks/i.test(c.label || '')) || L[0] || {}).k; }
function autoBeforeStep() {
  const M = S.me; if (!M || !careerActive()) return;
  if (autoOn('minor')) for (const it of pending().filter(x => x.kind === 'scene')) { const k = sensibleChoice(it); if (k) doAct({ t: 'pick', id: it.id, k, auto: 1 }); }
  if (autoOn('apply') && !M.jobs.length && lookingForWork() && typeof appSlots === 'function') {
    const slots = appSlots(); UI.apps = new Set([...UI.apps].filter(id => M.board.some(p => p.id === id)));
    if (!UI.apps.size && slots) for (const [p] of rankedFits(slots)) UI.apps.add(p.id);
  }
}
function autoHTML() { return `<p class="small autop">🤖 Autopilot: <button class="pill${autoOn('apply') ? ' on' : ''}" data-auto="apply" title="When you're out of work, apply to the best fits each week">Apply for me</button><button class="pill${autoOn('minor') ? ' on' : ''}" data-auto="minor" title="Small everyday moments get the sensible choice; big decisions still wait for you">Handle small stuff</button><button class="pill${S.me.focus && S.me.focus.auto ? ' on' : ''}" data-autoplan="1" title="Plan your week's diary automatically">Plan my week</button></p>`; }
// the party, for people who want to get to work
function partyAuto() { const M = S.me; let n = 0; while (M.party && !M.party.done && n++ < 40) { const sc = partyScene(M.party), L = sc.rooms || sc.opts; const o = L.find(x => !x.check) || L[0]; doAct({ t: 'party', k: o.k }); } }
function autoClick(t) {
  const d = t.dataset;
  if (d.auto) { doAct({ t: 'auto', k: d.auto }); render(true); return true; }
  if (d.autoplan) { doAct({ t: 'focus', auto: !(S.me.focus && S.me.focus.auto) }); render(true); return true; }
  if (d.partyauto) { partyAuto(); render(); return true; }
  return false;
}
// how relevant a posting is to who you are: your craft first, then your industry
function jobRelevance(p) {
  const me = ME(), t = tmplOf(p) || {}, subs = Object.keys(CRAFTS[MAIN[me.role] || 'wri'].subs), ind = typeof postIndustry === 'function' ? postIndustry(p) : 'film', field = S.me.field || 'film';
  if ((t.subs || []).some(s => subs.includes(s))) return 1;
  return ind === field ? .6 : .3;
}
function rankedFits(n) { return S.me.board.filter(p => !blockedFrom(tmplOf(p))).map(p => [p, hireOdds(p)]).sort((a, b) => b[1] * (.4 + jobRelevance(b[0])) - a[1] * (.4 + jobRelevance(a[0]))).slice(0, n); }
