// ---------------- Awards and contests, rebuilt around you ----------------
// The Awards page opens on you: what you've won and been nominated for, what's waiting on judges, what's open to you
// next and how good your chances are, then tabs for the calendar, the results and the cabinet of every prize in the
// world. The Contests page opens on what's open now (sorted by your odds), with what's coming, your entries and the
// full list one tab away. Contests now run in rounds, the way real ones do: a longlist, a shortlist, then the
// result, each with the size of the field, and between the shortlist and the result there's a choice that can move
// your placing (polish the entry, work the judges, or leave it alone). And awards night has its moments: nomination
// morning, the red carpet, and if they call your name, the speech.

// ---- contests in rounds ----
function entrantsOf(c, y) { const r = hashRand(c.k.length * 97 + y * 13 + c.month)(), [lo, hi] = c.tier === 'major' ? [2500, 12000] : c.tier === 'industry' ? [300, 2500] : [40, 400]; return Math.round((lo + (hi - lo) * r) / 10) * 10; }
{ const _ec = enterComp;
  enterComp = function (a) {
    const ok = _ec(a); if (!ok) return ok;
    const M = S.me, e = M.comps[M.comps.length - 1], c = COMPS.find(x => x.k === e.k);
    if (c && c.tier !== 'fun') { const span = Math.max(2, e.due - e.w); e.ls = e.w + Math.max(1, Math.round(span * .45)); e.ss = e.w + Math.max(1, Math.round(span * .75)); if (e.ss >= e.due) e.ss = e.due - 1; if (e.ls >= e.ss) e.ls = e.ss - 1; e.n = entrantsOf(c, e.y); }
    return ok;
  };
}
const PLACE_RANK = ['out', 'mention', 'final', 'runner', 'win'];
function compRoundsWeek() {
  const M = S.me;
  for (const e of (M.comps || []).filter(x => !x.told && x.ls !== undefined)) {
    const c = COMPS.find(x => x.k === e.k); if (!c) continue;
    if (!e.lsT && S.week >= e.ls) { e.lsT = 1; const n = e.n || 1000, long = Math.max(20, Math.round(n * .04));
      if (e.place === 'out') { e.told = 1; inbox('note', `${c.name}: not longlisted`, `${long} of ${n.toLocaleString()} entries made the longlist. Yours wasn't one of them. ${pickLine(['Most entries never get past the first reader.', 'Next year.', 'The readers had three minutes each.'], e.w)}`); continue; }
      inbox('note', `${c.name}: longlisted`, `You're on the longlist: ${long} of ${n.toLocaleString()} entries. The shortlist comes out ${fmtDate(e.ss, true)}.`); }
    if (e.lsT && !e.ssT && S.week >= e.ss) { e.ssT = 1; const short = c.tier === 'major' ? 8 : 6;
      if (e.place === 'mention') { inbox('note', `${c.name}: not shortlisted`, `The shortlist of ${short} is out, and you're not on it. You may still get a mention when the results come.`); continue; }
      inbox('compround', `${c.name}: you're shortlisted`, `One of ${short} left from ${(e.n || 1000).toLocaleString()} entries. The result is ${fmtDate(e.due, true)}. There's still time to do something about it, or nothing.`, { ce: e.k, cy: e.y, choices: [
        { k: 'polish', label: `Polish the entry one more time · ${checkLabel(c.stat, compDC(c, null) + 2)}`, check: [c.stat, compDC(c, null) + 2] },
        { k: 'judges', label: `Get to know the judges at the finalists' drinks · ${checkLabel('cha', 13)}`, check: ['cha', 13] },
        { k: 'leave', label: 'Leave it with the judges' }] }); }
  }
}
function compRoundPick(it, k) {
  if (it.kind !== 'compround') return false; it.done = true;
  const M = S.me, e = (M.comps || []).find(x => x.k === it.ce && x.y === it.cy && !x.told), c = COMPS.find(x => x.k === it.ce);
  if (!e || !c) { it.result = { t: 'The results are already out.' }; return true; }
  if (k === 'leave') { it.result = { t: 'You leave it alone. It is what it is.' }; return true; }
  const ok = roll(it.choices.find(x => x.k === k).check[0], it.choices.find(x => x.k === k).check[1]), r = M.lastRoll, i = PLACE_RANK.indexOf(e.place);
  if (k === 'polish') { M.energy = clamp(M.energy - 8, 0, 100); if (ok && i < 4) { e.place = PLACE_RANK[i + 1]; it.result = { ok, roll: r, t: 'Two late nights, and the version you send in is the best thing you\'ve made.' }; } else it.result = { ok, roll: r, t: 'You fiddle with it until 3am and end up sending the same thing.' }; }
  else { if (ok) { const q = bestIn(M.hub, ROLES, q => q.standing + prnd() * 20); if (q) meet(q.id, `A judge at ${c.name}`, 6); if (i < 3 && prnd() < .5) e.place = PLACE_RANK[i + 1]; it.result = { ok, roll: r, t: `You get on with one of the judges. Whatever happens, you have a new contact${q ? ': ' + q.name : ''}.` }; } else it.result = { ok, roll: r, t: 'You talk to the wrong person all night: a judge\'s plus-one with strong opinions about parking.' }; }
  return true;
}

// ---- the contests page, in tabs ----
{ const _cp = compPanel;
  compPanel = function () {
    const M = S.me, tab = UI.ctab || 'open', y = yearOf(S.week), mo = dateOf(S.week).getUTCMonth();
    const tabs = [['open', `Open now (${COMPS.filter(c => compOpen(c) && !compEntered(c)).length})`], ['mine', `Your entries (${(M.comps || []).filter(e => !e.told).length} waiting)`], ['soon', 'Coming up'], ['cal', 'Calendar'], ['all', 'All contests']];
    const head = `<div class="fchips ctabs">${tabs.map(([k, l]) => `<button class="fchip${tab === k ? ' on' : ''}" data-ctab="${k}">${l}</button>`).join('')}</div>`;
    if (tab === 'open') {   // the old cards, for what you can enter now: fits-you first, then the best odds
      const odds = c => { try { return checkP(c.stat, compDC(c, c.need === 'script' ? compScript(c) : null)); } catch (e) { return 0; } };
      const open = COMPS.filter(c => compOpen(c) && !compEntered(c)).sort((a, b) => (compFits(b) - compFits(a)) || odds(b) - odds(a));
      const all = COMPS.slice(), f0 = UI.compf; let grid = '';
      const mc = M.comps;   // the shelf is drawn on the Your entries tab; keep it out of this render
      try { COMPS.length = 0; COMPS.push(...open); UI.compf = 'all'; M.comps = (mc || []).filter(e => open.some(c => c.k === e.k)); const html = _cp(), i = html.indexOf('<div class="compgrid">'), j = html.indexOf('</div></section>', i); grid = i >= 0 && j > i ? html.slice(i, j + 6) : ''; }
      finally { COMPS.length = 0; COMPS.push(...all); UI.compf = f0; M.comps = mc; }
      return `<section class="panel comps"><h3>Competitions</h3>${head}<p class="muted small">Entries open the month before each deadline. Major prizes open doors; the fun ones give you trophies, stories and new friends. Results come in rounds: longlist, shortlist, then the winners.</p>${grid || '<p class="muted">Nothing open this month. See what\'s coming up.</p>'}</section>`;
    }
    if (tab === 'cal') return `<section class="panel comps"><h3>Competitions</h3>${head}</section>` + (typeof seasonHTMLFull === 'function' ? seasonHTMLFull() : '');
    if (tab === 'mine') {
      const L = (M.comps || []).slice().reverse();
      const stage = e => e.told ? `<b>${PLACE_LABEL[e.place]}</b>` : e.ls === undefined ? `result ${fmtDate(e.due, true)}` : !e.lsT ? `longlist ${fmtDate(e.ls, true)}` : !e.ssT ? `longlisted · shortlist ${fmtDate(e.ss, true)}` : `shortlisted · result ${fmtDate(e.due, true)}`;
      const bar = e => { const steps = e.ls === undefined ? 1 : 3, done = e.told ? steps : (e.lsT ? 1 : 0) + (e.ssT ? 1 : 0); return `<span class="cstep">${Array.from({ length: steps }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</span>`; };
      const shelf = L.filter(e => e.told && e.place !== 'out');
      return `<section class="panel comps"><h3>Competitions</h3>${head}
       ${L.length ? `<table class="os-table"><thead><tr><th>Contest</th><th>Entered</th><th>Field</th><th>Where it stands</th><th></th></tr></thead><tbody>${L.slice(0, 30).map(e => { const c = COMPS.find(x => x.k === e.k); return c ? `<tr><td>${compLink(c)}</td><td>${fmtDate(e.w, true)}</td><td>${e.n ? e.n.toLocaleString() : '—'}</td><td>${stage(e)}</td><td>${bar(e)}</td></tr>` : ''; }).join('')}</tbody></table>` : '<p class="muted">You haven\'t entered anything yet.</p>'}
       <h4>Your trophy shelf</h4>${shelf.length ? `<ul class="plain">${shelf.map(e => { const c = COMPS.find(x => x.k === e.k); return `<li>${e.place === 'win' ? '🏆' : e.place === 'runner' ? '🥈' : e.place === 'final' ? '🎖️' : '📜'} <b>${PLACE_LABEL[e.place]}</b>, ${compLink(c)} <span class="muted">${e.y}</span></li>`; }).join('')}</ul>` : '<p class="muted small">Empty, for now.</p>'}</section>`;
    }
    const rows = (tab === 'soon' ? COMPS.filter(c => !compOpen(c) && ((c.month - mo + 12) % 12) <= 4) : COMPS.slice()).sort((a, b) => ((a.month - mo + 12) % 12) - ((b.month - mo + 12) % 12));
    return `<section class="panel comps"><h3>Competitions</h3>${head}
     <table class="os-table small"><thead><tr><th>Contest</th><th>Kind</th><th>Closes</th><th>Judged on</th><th>Entry</th><th>Prize</th><th>Your odds</th></tr></thead><tbody>${rows.map(c => { const T = COMP_TIER[c.tier]; let p = null; try { p = checkP(c.stat, compDC(c, c.need === 'script' ? compScript(c) : null)); } catch (e) {} return `<tr${compFits(c) ? ' class="fitrow"' : ''}><td>${compLink(c)}${compFits(c) ? ' ★' : ''}</td><td>${chip(T[0], T[1])}</td><td>${MON[c.month]}${compOpen(c) ? ' <b class="good">open</b>' : ''}</td><td>${esc(statLabel(c.stat))}</td><td>${c.fee ? fmtCash(usd(c.fee)) : 'free'}</td><td>${c.prize ? fmtCash(usd(c.prize)) : '—'}</td><td>${p === null ? '—' : Math.round(p * 100) + '%'}</td></tr>`; }).join('')}</tbody></table>
     <p class="muted small">Odds are your chance of placing, shown as the roll you'd need today. Contests run in rounds: a longlist, a shortlist, then the result.</p></section>`;
  };
}
function contestsClick(t) { if (t.dataset.ctab) { UI.ctab = t.dataset.ctab; render(true); return true; } return false; }

// ---- the awards page, in tabs ----
{ const _va = viewAwards;
  viewAwards = function () {
    const M = S.me, me = M ? ME() : null, tab = UI.awt || (M ? 'you' : 'results');
    const tabs = (M ? [['you', 'You']] : []).concat([['season', 'The season'], ['results', 'Results'], ['prizes', 'Every prize']]);
    const head = `<div class="head"><h2>Awards and recognition</h2><p class="lede">Prizes, festivals and contests: the other road to a name, beside the job board.</p></div><div class="fchips ctabs">${tabs.map(([k, l]) => `<button class="fchip${tab === k ? ' on' : ''}" data-awt="${k}">${l}</button>`).join('')}</div>`;
    if (tab === 'prizes') return head + (typeof awardsCabinetHTML === 'function' ? awardsCabinetHTML() : typeof awardBodiesHTML === 'function' ? awardBodiesHTML() : '');
    if (tab === 'season') return head + (typeof seasonHTMLFull === 'function' ? seasonHTMLFull() : '');
    if (tab === 'results') { const full = _va(), i = full.indexOf('<h3>Winners</h3>'), j = full.indexOf('<section class="panel fotY">'); return head + (j >= 0 ? full.slice(j, i >= 0 ? i : undefined) : '') + (i >= 0 ? full.slice(i) : ''); }
    // you
    const wins = (S.awards || []).filter(a => a.people.includes(me.id) || (M.past || []).some(p => p.film === a.film && p.credited));
    const ms = (M.milestones || []).filter(m => m.kind === 'prize').slice(-12).reverse();
    const waitF = (M.fests || []).filter(x => !x.done), waitC = (M.comps || []).filter(e => !e.told), waitS = (M.works || []).flatMap(w => ((w.circuit && w.circuit.subs) || []).filter(s => !s.done).map(s => [w, s]));
    const mine = typeof myFilms === 'function' ? myFilms().filter(f => typeof festEligible === 'function' && festEligible(f)) : [];
    const festOpen = []; for (const f of mine) for (const F of FESTIVALS) { if ((M.fests || []).some(x => x.film === f.id && x.k === F.k) || (typeof festFits === 'function' && !festFits(F, f))) continue; const W = typeof festWindow === 'function' ? festWindow(F) : { open: false }; if (W.open) festOpen.push([F, f, typeof festSelOdds === 'function' ? festSelOdds(F, f) : 0]); }
    festOpen.sort((a, b) => b[2] - a[2]);
    const compOpenL = COMPS.filter(c => compOpen(c) && !compEntered(c) && compFits(c)).map(c => { let p = 0; try { p = checkP(c.stat, compDC(c, c.need === 'script' ? compScript(c) : null)); } catch (e) {} return [c, p]; }).sort((a, b) => b[1] - a[1]);
    const fname = k => { const F = FESTIVALS.find(x => x.k === k); return F ? F.name.replace(/^the /, 'The ') : k; };
    return head + `<div class="aw-you">
     <section class="panel"><h3>Your recognition <span class="count">${wins.length} prize${wins.length === 1 ? '' : 's'} on your films</span></h3>${ms.length ? `<ul class="plain aw-ms">${ms.map(m => `<li>${/^Won/.test(m.t) ? '🏆' : /Nominated/.test(m.t) ? '🎗️' : /selected|Selected/.test(m.t) ? '🌿' : '✦'} ${esc(m.t)} <span class="muted small">${fmtDate(m.w, true)}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing yet. Every name you know started with a rejection letter.</p>'}${typeof egofHTML === 'function' ? egofHTML() : ''}</section>
     <section class="panel"><h3>Waiting on judges <span class="count">${waitF.length + waitC.length + waitS.length}</span></h3>${waitF.length + waitC.length + waitS.length ? `<ul class="plain small">${waitF.map(x => `<li>🎬 ${fl(x.film)} at ${esc(fname(x.k))}: line-up ${fmtDate(x.due, true)}</li>`).join('')}${waitC.map(e => { const c = COMPS.find(x => x.k === e.k); return c ? `<li>🏅 ${compLink(c)}: ${e.ssT ? 'shortlisted, result' : e.lsT ? 'longlisted, shortlist' : e.ls !== undefined ? 'longlist' : 'result'} ${fmtDate(e.ssT ? e.due : e.lsT ? e.ss : e.ls ?? e.due, true)}</li>` : ''; }).join('')}${waitS.slice(0, 8).map(([w, s]) => `<li>🎞️ ${esc(w.title)} at ${esc((SHORT_FEST[s.k] || {}).name || s.k)}: ${fmtDate(s.due, true)}</li>`).join('')}</ul>` : '<p class="muted small">Nothing out with the judges.</p>'}</section>
     <section class="panel"><h3>Open to you now</h3>
      ${festOpen.length ? `<h4>Festivals for your films</h4><ul class="plain small">${festOpen.slice(0, 6).map(([F, f, p]) => `<li>${fl(f.id)} → <b>${esc(F.name.replace(/^the /, 'The '))}</b> · ${MON[F.month]} · ${typeof festChanceLabel === 'function' ? festChanceLabel(p) : ''} (${Math.round(p * 100)}%)</li>`).join('')}</ul><p class="small"><button class="linkish" data-dtab="create">Submit from Create</button></p>` : ''}
      ${compOpenL.length ? `<h4>Contests that fit you</h4><ul class="plain small">${compOpenL.slice(0, 6).map(([c, p]) => `<li>${compLink(c)} · closes ${MON[c.month]} · ${Math.round(p * 100)}% to place</li>`).join('')}</ul><p class="small"><button class="linkish" data-app="contests">Open Contests</button></p>` : ''}
      ${!festOpen.length && !compOpenL.length ? '<p class="muted small">Nothing open that fits you this month. Check the season.</p>' : ''}</section>
     ${typeof campaignHTML === 'function' && [9, 10, 11].includes(dateOf(S.week).getUTCMonth()) ? campaignHTML() : ''}</div>`;
  };
}
function awardsTabClick(t) { if (t.dataset.awt) { UI.awt = t.dataset.awt; render(true); return true; } return false; }

// ---- awards night: nomination morning, the carpet, the speech ----
{ const _aw = awardsWeek;
  awardsWeek = function () {
    const M = S.me, y0 = M.awardsY; _aw();
    if (M.awardsY === S.year && y0 !== S.year) {
      const me = ME(), noms = typeof awardsNominees === 'function' ? awardsNominees() : [], mine = noms.filter(f => M.past.some(p => p.film === f.id) || f.wri.includes(me.id) || (typeof keyIds === 'function' && keyIds(f).includes(me.id)));
      if (mine.length) { inbox('news', 'Nomination morning', `The nominations are out, and your work is on the list: ${mine.map(f => f.title).join(', ')}. Your phone doesn't stop until lunch.`); me.standing = clamp(me.standing + 1, 0, 100); M.nomY = S.year; for (const f of mine) milestone(`${f.title} nominated at the ${ceremony(awardsMarket())}`, 'prize'); }
    }
  };
}
{ const _an = awardsNight;
  awardsNight = function (x, L) {
    const M = S.me, me = ME();
    if (M.nomY === S.year && M.carpetY !== S.year) { M.carpetY = S.year; inbox('carpet', 'The red carpet', 'Flashbulbs, a man with a microphone, and a publicist pointing at a mark on the floor. You have about forty seconds.', { choices: [{ k: 'pose', label: `Own the carpet · ${checkLabel('pres', 12)}`, check: ['pres', 12] }, { k: 'talk', label: `Give the interviewer something to use · ${checkLabel('cha', 13)}`, check: ['cha', 13] }, { k: 'skip', label: 'Slip past and find your seat' }] }); }
    const r = _an(x, L);
    const won = (typeof awardsThisYear === 'function' ? awardsThisYear() : []).find(a => a.people.includes(me.id));
    if (won && M.speechY !== S.year) { M.speechY = S.year; inbox('speech', `They call your name: ${won.name.replace(/^[^:]*: /, '')}`, 'You\'re on the stage with the statue in your hand and a thousand faces looking up. The music will start in forty-five seconds.', { choices: [
      { k: 'thanks', label: `Thank everyone who got you here · ${checkLabel('cha', 9)}`, check: ['cha', 9] }, { k: 'cause', label: `Say something that matters to you · ${checkLabel('cha', 14)}`, check: ['cha', 14] }, { k: 'joke', label: `Make the room laugh · ${checkLabel('comic', 13)}`, check: ['comic', 13] }, { k: 'short', label: '"Thank you." And walk off' }] }); }
    return r;
  };
}
function awardsMomentPick(it, k) {
  if (it.kind !== 'carpet' && it.kind !== 'speech') return false; it.done = true;
  const M = S.me, me = ME(), C = it.choices.find(x => x.k === k), ok = C && C.check ? roll(C.check[0], C.check[1]) : null, r = ok === null ? null : M.lastRoll; let t = '';
  if (it.kind === 'carpet') {
    if (k === 'pose') { if (ok) { me.fame = clamp((me.fame || 0) + 1.5, 0, 100); t = 'You hit the mark, turn, and the pictures are everywhere by morning.'; } else t = 'You blink in every photo. Every single one.'; }
    else if (k === 'talk') { if (ok) { me.standing = clamp(me.standing + 1, 0, 100); me.fame = clamp((me.fame || 0) + 1, 0, 100); t = 'Your line runs in three papers the next day.'; } else { t = 'You say something you\'ll be explaining for a week.'; M.stress = clamp(M.stress + 3, 0, 100); } }
    else t = 'You slip past the cameras and find your seat. Calm, at least.';
  } else {
    if (k === 'thanks') { if (ok) { for (const id of Object.keys(M.known).slice(0, 40).map(Number).filter(id => ['friend', 'close', 'partner', 'mentor'].includes(relOf(id)))) addTie(me, P(id), 3); t = 'You name everyone, and nobody you forgot will ever mention it. Mostly.'; } else t = 'You forget your agent. Your agent does not forget.'; }
    else if (k === 'cause') { if (ok) { me.fame = clamp((me.fame || 0) + 4, 0, 100); me.standing = clamp(me.standing + 2, 0, 100); t = 'The room goes quiet, then stands. The clip goes round the world.'; } else { me.fame = clamp((me.fame || 0) + 2, 0, 100); me.standing = clamp(me.standing - 1, 0, 100); t = 'It comes out wrong. Half the room claps; the other half writes columns.'; } }
    else if (k === 'joke') { if (ok) { me.fame = clamp((me.fame || 0) + 3, 0, 100); t = 'The biggest laugh of the night. The host steals the line later.'; } else t = 'The joke lands in a silence you can hear from space.'; }
    else { me.standing = clamp(me.standing + .5, 0, 100); t = 'Two words and gone. Somehow it\'s the most dignified thing anyone does all night.'; }
  }
  it.result = { ok, roll: r, t }; return true;
}
function awards4Week() { compRoundsWeek(); }
function awards4Pick(it, k) { return compRoundPick(it, k) || awardsMomentPick(it, k); }
function awards4Click(t) { return contestsClick(t) || awardsTabClick(t); }
