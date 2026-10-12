// ---------------- Scenes with causes ----------------
// A scene used to arrive by job family and the dice, blind to the moment. Now every scene:
//  · never repeats inside 26 weeks, wherever it comes from;
//  · opens with a line from what is true right now: the film you're on and where it is, what this person remembers
//    about you, what the city is going through, something that just happened to you, how you're holding up;
//  · remembers what you chose: the next scene with the same person recalls it (and what you chose counts towards how
//    they see you), and choices in a scene are kept as flags later scenes can read.
// Tools/probe-player.js counts how many scenes cite a fact (it.cites) and how many read an earlier choice (it.callback).
function sceneWho(ctx) { if (!ctx) return null; for (const k of ['person', 'head', 'contact', 'dir', 'lead', 'star']) if (typeof ctx[k] === 'number' && P(ctx[k]) && ctx[k] !== S.me.id) return ctx[k]; return null; }
function sceneFact(ctx, who) {
  const M = S.me, me = ME(), out = [];
  const f = ctx && ctx.film !== null && ctx.film !== undefined ? S.films[ctx.film] : null;
  if (f && f.rel === null) { const st = f.stage; out.push(st === 2 ? `${f.title} is in its ${Math.max(1, Math.round((S.week - (f.stageEnd - f.dur[2])) + 1))}${['st', 'nd', 'rd'][Math.max(0, Math.round(S.week - (f.stageEnd - f.dur[2])))] || 'th'} week of shooting${f.cost > f.budget * 1.08 ? ', and over budget' : ''}.` : st === 3 ? `${f.title} is in the edit; it comes out ${fmtDate(f.stageEnd, true)}.` : st <= 1 ? `${f.title} is still in ${st === 0 ? 'development' : 'prep'}.` : null); }
  if (who !== null) { const m = (M.mem || {})[who], last = m && m.n && m.n.filter(x => !x.via).slice(-1)[0]; if (last && S.week - last.w < 104) out.push(`${P(who).name.split(' ')[0]} hasn't forgotten: ${last.t.charAt(0).toLowerCase() + last.t.slice(1)}${/[.!?]$/.test(last.t) ? '' : '.'}`); }
  const st = (S.econ || {}).state, ev = typeof econEv === 'function' ? econEv(M.hub) : [];
  if (ev.some(e => e.k === 'walkout')) out.push(`The strike is in its ${Math.max(1, S.week - ev.find(e => e.k === 'walkout').from + 1)}th week; nobody in ${HUBS[M.hub].name} is shooting.`);
  else if (st === 'recession') out.push('Money is tight across the business; everyone is watching costs.');
  else if (st === 'boom') out.push('Everybody is greenlighting; there is money in every meeting.');
  const ms = (M.milestones || []).filter(x => S.week - x.w <= 4).slice(-1)[0]; if (ms) out.push(`It's ${S.week - ms.w <= 1 ? 'days' : `${S.week - ms.w} weeks`} since ${ms.t.charAt(0).toLowerCase() + ms.t.slice(1)}.`);
  if (M.stress >= 60) out.push('You haven\'t slept properly in a week.'); else if (M.energy < 25) out.push('You\'re running on empty.');
  if (M.cash < 0) out.push('Your bank account is in the red.');
  return out.filter(Boolean);
}
{ const _ib = inbox; inbox = function (kind, title, text, extra = {}) {
  const M = S.me; if (kind !== 'scene' || !M || !extra || !extra.scene) return _ib.apply(this, arguments);
  const w = (M.seenSc || {})[extra.scene]; if (w !== undefined && S.week - w < 26) { M.stats.scenesSkipped = (M.stats.scenesSkipped || 0) + 1; return null; }   // nothing repeats inside six months
  const who = sceneWho(extra.ctx) ?? (typeof extra.person === 'number' ? extra.person : null), F = sceneFact(extra.ctx, who);
  const pick = F.length ? F[hashRand(((S.week * 31) ^ (extra.scene.length * 7919)) >>> 0)() * F.length | 0] : null;
  const C = who !== null ? (M.choiceLog || []).filter(x => x.who === who && x.scene !== extra.scene).slice(-1)[0] : null;
  let t = text; if (pick) t = `${pick} ${t}`; if (C) t += ` (Last time, ${fmtDate(C.w, true)}: you chose "${C.label}".)`;
  const it = _ib.call(this, kind, title, t, extra);
  if (it) { it.cites = !!pick; it.callback = !!C; M.stats.scenesShown = (M.stats.scenesShown || 0) + 1; if (pick) M.stats.scenesCited = (M.stats.scenesCited || 0) + 1; if (C) M.stats.scenesCalled = (M.stats.scenesCalled || 0) + 1; it.who = who; }
  return it; }; }
// every choice in a scene is kept: who it involved, what you chose
{ const _aa = applyAct; applyAct = function (a) {
  const M = S.me, it = a && a.t === 'pick' && M ? M.inbox.find(x => x.id === a.id) : null, pre = it && it.kind === 'scene' && !it.done;
  const ok = _aa.apply(this, arguments);
  if (ok && pre && it.done) { const c = (it.choices || []).find(x => x.k === a.k); const L = M.choiceLog = M.choiceLog || []; L.push({ w: S.week, scene: it.scene, k: a.k, who: it.who ?? null, label: c ? memLabel(c.label).slice(0, 70) : a.k }); if (L.length > 300) L.shift();
    (M.sflags = M.sflags || {})[it.scene + ':' + a.k] = S.week; }
  return ok; }; }
