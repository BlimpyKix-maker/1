// ---------------- Autopilot: less clicking, more living ----------------
// New players shouldn't have to click through every small thing to get going. Autopilot (on by default, with a switch
// on Today) applies to the best-fit jobs when you're out of work and settles small everyday moments with the sensible
// choice, so the week flows; anything that matters (offers, interviews, deals, invitations) still waits for you.
// Every auto choice goes through the action log like a click, so saves replay the same.
function autoOn(k) { const A = (S.me && S.me.auto) || {}; return A[k] !== false; }
function autoAct(a) { const M = S.me; M.auto = M.auto || {}; if (a.k === 'oblig') { M.autoOblig = M.autoOblig === false ? true : false; return true; } if (a.k === 'looking') { M.looking = ['no', 'craft', 'yes'].includes(a.v) ? a.v : lookingForWork() ? 'no' : 'yes'; if (M.looking === 'no') M.focus.noHunt = true; else M.focus.noHunt = false; return true; } if (!['apply', 'minor'].includes(a.k)) return false; M.auto[a.k] = !autoOn(a.k); return true; }
// the sensible choice: an option with no roll and no cost, else the first
function sensibleChoice(it) { const L = (it.choices || []).filter(c => !c.dis); return (L.find(c => !c.check && !/quit|leave|skip|refuse|no thanks/i.test(c.label || '')) || L[0] || {}).k; }
function autoBeforeStep() {
  const M = S.me; if (!M || !careerActive()) return;
  if (autoOn('minor')) for (const it of pending().filter(x => x.kind === 'scene')) { const k = sensibleChoice(it); if (k) doAct({ t: 'pick', id: it.id, k, auto: 1 }); }
  // out of work, or only doing jobs outside your craft: keep applying for the work you came here to do
  if (autoOn('apply') && lookingForWork() && (!M.jobs.length || !M.jobs.some(craftJob)) && typeof appSlots === 'function') {
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
// 1: your own line of work (the department you came for); .8: next to it (shares your skills: a production lawyer,
// for a producer); .6: your industry; .3: anything else.
const CORE_WORK = {
  actor: [/^Cast$/, /\b(actor|actress|performer|day player|stand-in|ensemble|guest star|recurring role|series regular|understudy|voice actor|narrator|lead role|supporting role)\b/i, /adapter|mixer|engineer|subtitle|localization|assistant to|casting/i],
  director: [/^(Directed|Second Unit Director|Commercial Production)/, /\b(director|directing)\b/i, /(art|casting|musical|photography|development|training|creative|marketing|technical|managing|programme|program|festival|executive|sales|music) director|director (of|,)/i],
  writer: [/^(Writing|Film and TV Development)/, /\b(writer|screenwriter|showrunner|story editor|playwright|story by|script editor|staff writer|lyricist)\b/i, /sign writer/i],
  producer: [/^(Produced|Production Management|Film and TV Production|Executive Positions)/, /\b(producer|showrunner)\b/i, /record producer|podcast producer/i],
  dp: [/^(Cinematography|Camera and Electrical)/, /\b(camera|cinematograph\w*|gaffer|grip|lighting|focus puller|steadicam|best boy|director of photography)\b/i],
  editor: [/^(Film Editing|Editorial|Color Department)/, /\b(editor|editing|colou?rist|assembly)\b/i, /story editor|managing editor|magazine/i],
  designer: [/^(Production Design|Art Department|Art Direction|Set Decoration|Property)/, /\b(production designer|art director|set designer|set decorator|scenic|props?|art department)\b/i],
  costume: [/^(Costume|Makeup)/, /\b(costume|wardrobe|make-?up|hair and)\b/i],
  composer: [/^Music/, /\b(composer|composition|music\w*|song\w*|orchestrat\w*|record producer|mix engineer|session musician|arranger)\b/i, /compositor|compositing/i],
  casting: [/^Casting/, /\bcasting\b/i]
};
const JOB_ROW = {};
function jobRow(p) { const id = p.jid || (tmplOf(p) || {}).jid; if (!id) return null; if (JOB_ROW[id] === undefined) JOB_ROW[id] = (JOBS.jobs || []).find(j => j.id === id) || null; return JOB_ROW[id]; }
function coreWork(p) {
  // a dream with its own idea of the work (DJ, publicist, puppeteer) says so; the rest go by their craft
  const D = typeof dreamOf === 'function' ? dreamOf() : null, C = (D && D.core) || CORE_WORK[ME().role]; if (!C) return false;
  const J = jobRow(p), title = String(p.t || '');
  if (C[2] && C[2].test(title)) return false;
  // your own industry only (television counts as film): a theatre lighting designer is next to a DP's work, not it
  const ind = typeof postIndustry === 'function' ? postIndustry(p) : 'film', field = S.me.field || 'film';
  if (!(D && D.core) && ind !== field && !(field === 'film' && ind === 'tv') && !(field === 'tv' && ind === 'film')) return false;
  return !!((J && J.dept && C[0].test(J.dept)) || C[1].test(title));
}
function jobRelevance(p) {
  const me = ME(), t = tmplOf(p) || {}, subs = Object.keys(CRAFTS[MAIN[me.role] || 'wri'].subs), ind = typeof postIndustry === 'function' ? postIndustry(p) : 'film', field = S.me.field || 'film';
  if (coreWork(p)) return 1;
  if ((t.subs || []).some(s => subs.includes(s))) return .8;
  return ind === field ? .6 : .3;
}
// Your own craft comes first. Jobs near it (same industry) fill in; anything going (ushering, bar work) only when the
// money is running out, or while you've nothing at all. Already working outside your craft: only craft jobs.
function craftJob(p) { return jobRelevance(p) >= 1; }
function rankedFits(n) {
  const M = S.me, short = runwayWeeks() < 12, floor = careerLevel() >= 3 && !short ? tierLevel() - 1 : 0;   // established: nothing far below your level
  const L = M.board.filter(p => !blockedFrom(tmplOf(p)) && (p.tier || 1) >= floor).map(p => [p, hireOdds(p), jobRelevance(p)]);
  const wt = x => x[2] >= 1 ? 1.8 : x[2] >= .8 ? 1.2 : x[2] >= .6 ? 1 : .55;
  const want = M.jobs.length || M.looking === 'craft' ? L.filter(x => x[2] >= 1) : L.filter(x => x[2] >= .6 || short);
  const ranked = want.sort((a, b) => b[1] * wt(b) - a[1] * wt(a));
  // never leave a broke player with nothing to apply for
  const out = ranked.length || M.jobs.length || M.looking === 'craft' ? ranked : L.sort((a, b) => b[1] - a[1]);
  return out.slice(0, n).map(x => [x[0], x[1]]);
}

// the switch on the Work tab: off, only your own line of work, or anything that pays
function huntSwitchHTML() {
  const M = S.me, v = M.looking === 'no' || (!M.looking && !lookingForWork()) ? 'no' : M.looking === 'craft' ? 'craft' : 'yes';
  const L = [['no', '🛑 Not looking', 'No applications go out and no hunting blocks are planned. Offers can still find you.'], ['craft', '🎯 Only my line of work', `Applications go only to ${typeof dreamLabel === 'function' ? dreamLabel().toLowerCase() : 'your craft'} work.`], ['yes', '💼 Anything that pays', 'Your craft first, then anything near it, and odd jobs when money is short.']];
  return `<div class="huntsw"><b>Job hunting</b> ${L.map(([k, l, d]) => `<button class="pill${v === k ? ' on' : ''}" data-looking="${k}" title="${esc(d)}">${l}</button>`).join(' ')}<span class="muted small"> ${esc(L.find(x => x[0] === v)[2])}</span></div>`;
}
