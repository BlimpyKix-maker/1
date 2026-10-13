// ================= Music, podcasts, theatre and online video at film's depth: critics, showcases, the desk =================
// Round 21. Film had critics, festivals and a desk of decisions; the other fields had charts and money. Here:
//  - critics: every notable release (an album, a season, a production, or anything from an act with a following)
//    and the player's own releases get reviews from the field's outlets, a critics' score, and a nudge to the audience;
//  - showcase festivals, one a year in each field, with lineups chosen on momentum and reviews and a breakout act
//    the labels then chase; the player can apply with their best work and play a slot;
//  - the desk: working at a label, network, creator studio or theatre brings a decision every fortnight (sign, pass,
//    drop, keep), made on the house's real books, and a verdict six months later.
// Reviews use hashed dice (they never move the world's or the player's streams); festivals use the world's dice.
const SIDE_OUTLETS = {
  music: [['Groove Quarterly', 1, 0], ['The Turntable Review', 1, -4], ['B-Side Monthly', 2, 3], ['Loud Hush', 2, -2], ['Wax & Wire', 3, 5]],
  podcast: [['The Listening Room Review', 1, -2], ['Headphone Weekly', 2, 2], ['The Long Listen', 2, 0]],
  stage: [['The Stalls Gazette', 1, -3], ['Opening Night Notes', 1, 0], ['Curtain Times', 2, 2], ['Fringe Firsts', 3, 4]],
  creator: [['Feedwatch', 1, -1], ['Scrollstop Weekly', 2, 3], ['Upload Digest', 3, 2]]
};
const SIDE_LINES = {
  rave: ['A {kind} that earns every minute.', 'The best thing {name} has made, and it isn\'t close.', 'Confident, strange and generous.', 'You will hear people talking about this for a year.'],
  good: ['Solid work with two or three great moments.', '{name} knows exactly what this is for.', 'Not a reinvention, but a real step.', 'Better each time you go back to it.'],
  mixed: ['Half of it is wonderful.', 'Pleasant, and gone the moment it ends.', 'The ideas outrun the craft.', 'There is a great {kind} in here somewhere.'],
  pan: ['A misfire from start to finish.', 'Everything here has been done better, including by {name}.', 'Hard to know who this is for.', 'A long way below what {name} can do.']
};
const SIDE_BAND = s => s >= 80 ? 'rave' : s >= 62 ? 'good' : s >= 45 ? 'mixed' : 'pan';
function sideReviews(seed, q, field, name, kind) {
  const r = hashRand(seed >>> 0), O = SIDE_OUTLETS[field] || [], list = [], used = new Set();
  for (const [n, tier, lean] of O) { if (tier === 3 && r() < .4) continue; const s = clamp(Math.round(q + (r() - .5) * 18 + lean), 5, 99), band = SIDE_BAND(s), L = SIDE_LINES[band];
    let i = Math.floor(r() * L.length); for (let k = 0; k < L.length && used.has(band + i); k++) i = (i + 1) % L.length; used.add(band + i);
    list.push([n, s, L[i].replace(/\{name\}/g, name).replace(/\{kind\}/g, kind)]); }
  const cs = list.length ? Math.round(list.reduce((t, x) => t + x[1], 0) / list.length) : q;
  return { cs, list };
}
function sideReviewHTML(R) { return R && R.list.length ? `<section class="panel"><h3>Critics: ${R.cs}/100 <span class="muted small">(${SIDE_BAND(R.cs)})</span></h3><ul class="plain">${R.list.map(([n, s, t]) => `<li><b>${s}</b> <i>${esc(n)}</i>: “${esc(t)}”</li>`).join('')}</ul></section>` : ''; }
// ---- the world's releases ----
const sideNotable = (p, r) => ['album', 'season', 'production'].includes(r.kind) || p.fans >= 2e5 || r.v0 >= 5e4;
{ const _ar = actRelease; actRelease = function (p, w) { const r = _ar.apply(this, arguments);
  if (sideNotable(p, r)) { const R2 = sideReviews(p.id * 7919 + w * 31, r.q, p.ind, p.name, r.kind); r.cs = R2.cs; p.fans = Math.max(50, p.fans * (1 + (r.cs - 60) / 900)); }
  return r; }; }
{ const _vr = viewRelease; viewRelease = function (id) { const h = _vr.apply(this, arguments), [pid, w] = String(id).split('~'), p = P(+pid), r = p && actRel(pid, w); if (!r || r.cs == null) return h; return h + sideReviewHTML(sideReviews(p.id * 7919 + r.w * 31, r.q, p.ind, p.name, r.kind)); }; }
// ---- the player's releases ----
const SIDE_REVIEWED = new Set(['song', 'video', 'podcast', 'play', 'musical']);
{ const _rw = releaseWork; releaseWork = function (a) {
  const M = S.me, n0 = (M.works || []).length, ok = _rw.apply(this, arguments); if (!ok || (M.works || []).length <= n0) return ok;
  const w = M.works[M.works.length - 1], T = WORK_TYPES[w.type]; if (!w || !SIDE_REVIEWED.has(w.type) || !T) return ok;
  const fol = followers(T.plat === 'stage' ? 'spinly' : T.plat);
  if (T.plat !== 'stage' && fol < 300 && !w.promo && w.q < 72) return ok;   // the critics have not heard of you yet
  const R2 = sideReviews(M.id * 31 + w.id * 977 + w.rel, w.q, T.field, ME().name, T.label.toLowerCase()); w.cs = R2.cs;
  const top = R2.list.slice().sort((a, b) => b[1] - a[1])[0];
  if (top) mail('news', top[0], `Review: ${w.title}`, `${top[1]}/100. “${top[2]}” Critics overall: ${R2.cs}.`);
  if (T.plat !== 'stage' && M.fol && M.fol[T.plat] !== undefined) M.fol[T.plat] = Math.max(0, M.fol[T.plat] * (1 + (R2.cs - 60) / 400));
  if (R2.cs >= 85) milestone(`Critics rave about ${w.title} (${R2.cs}/100)`, 'work');
  return ok; }; }
{ const _vw = viewWork; viewWork = function (id) { const h = _vw.apply(this, arguments), M = S.me, w = (M.works || []).find(x => x.id === +id); if (!w || w.cs == null) return h; const T = WORK_TYPES[w.type] || {}; return h + sideReviewHTML(sideReviews(M.id * 31 + w.id * 977 + w.rel, w.q, T.field, ME().name, (T.label || '').toLowerCase())); }; }

// ---- showcase festivals ----
const SIDE_FESTS = [
  { k: 'northbound', field: 'music', name: 'Northbound Showcase', wk: 11, hub: 'hollywood', from: 1987, slot: 'a twenty-minute set', d: 'Four days, ninety venues and a thousand acts, each hoping one person from a label is in the room.' },
  { k: 'summit', field: 'creator', name: 'Creator Summit', wk: 26, hub: 'hollywood', from: 2010, slot: 'a panel and a live show', d: 'Panels, meet-and-greets, and brand deals signed in the corridors.' },
  { k: 'fringe', field: 'stage', name: 'Fringe Fortnight', wk: 32, hub: 'london', from: 1947, slot: 'a week of late-night shows', d: 'Three weeks of shows in every room with a door. The critics walk between them all day.' },
  { k: 'listening', field: 'podcast', name: 'The Listening Room Festival', wk: 38, hub: 'newyork', from: 2015, slot: 'a live taping', d: 'Live tapings, a pitch market, and a crowd that knows every host by voice.' }
];
const SIDE_FEST = Object.fromEntries(SIDE_FESTS.map(F => [F.k, F]));
const sfWoy = w => ((w % 52) + 52) % 52;
function sideFestRun(F) {
  const R0 = R; R = wstream('sidefest', F.k, S.week);
  try {
    const pool = S.people.filter(p => p && p.ind === F.field && !p.dead && !p.retired && S.week - (p.lastWork || -999) < 52 && (p.rel || []).length);
    const sc = p => { const r = p.rel[p.rel.length - 1]; return (r.cs != null ? r.cs : r.q) / 100 + Math.log10(Math.max(10, p.fans)) * .06 + rnd() * .3; };
    const line = pool.map(p => [p, sc(p)]).sort((a, b) => b[1] - a[1]).slice(0, 12).map(x => x[0]);
    if (!line.length) return;
    const top = line.map(p => [p, (p.rel[p.rel.length - 1].cs || p.rel[p.rel.length - 1].q) + rnd() * 25 - Math.log10(Math.max(10, p.fans)) * 3]).sort((a, b) => b[1] - a[1])[0][0];
    for (const p of line) p.fans *= 1.05;
    top.fans *= 1.3; top.buzz = S.week;
    const rec = { y: S.year, line: line.map(p => p.id), top: top.id };
    (S.sfest = S.sfest || {})[F.k] = ((S.sfest[F.k] || []).concat([rec])).slice(-8);
    news(FIELD_LABEL[F.field] || 'Media', `${F.name}: ${top.name} ${ACT_GROUP.has(top.act) ? 'are' : 'is'} the breakout of the year. ${top.label == null ? 'Every label in town wants a meeting.' : ''}`.trim(), { person: top.id });
  } finally { R = R0; }
}
{ const _t = tick; tick = function () { const r = _t.apply(this, arguments); if (S.actsOn && !S.archiving) for (const F of SIDE_FESTS) if (S.year >= F.from && sfWoy(S.week) === F.wk) sideFestRun(F); return r; }; }
// a breakout is the act every label chases for the next six months
if (typeof mhMomentum === 'function') { const _mm = mhMomentum; mhMomentum = function (p) { return _mm.apply(this, arguments) + (p.buzz && S.week - p.buzz < 26 ? .4 : 0); }; }
function sideFestBest(F) { const M = S.me, ok = WORK_TYPES ? Object.keys(WORK_TYPES).filter(t => WORK_TYPES[t].field === F.field && SIDE_REVIEWED.has(t)) : []; return (M.works || []).filter(w => ok.includes(w.type) && w.rel !== undefined && S.week - w.rel < 104).sort((a, b) => (b.cs || b.q) - (a.cs || a.q))[0] || null; }
function sideFestWeek() {
  const M = S.me; if (!M) return;
  for (const F of SIDE_FESTS) { if (S.year < F.from) continue;
    if (sfWoy(S.week) === sfWoy(F.wk - 8) && !pending().some(x => x.kind === 'sfapp')) { const w = sideFestBest(F); if (w) inbox('sfapp', `${F.name}: applications open`, `${F.d} Applications close in four weeks; about two thousand acts apply for ninety slots. You could send ${w.title}.`, { fest: F.k, wid: w.id, choices: [{ k: 'sf_go', label: `Apply with ${w.title} (${fmtCash(usd(45))})` }, { k: 'sf_no', label: 'Not this year' }] }); }
    if (sfWoy(S.week) === F.wk && M.sfApp && M.sfApp.k === F.k && M.sfApp.y === S.year) { const A = M.sfApp, w = (M.works || []).find(x => x.id === A.wid); M.sfApp = null; if (!w) continue;
      const T = WORK_TYPES[w.type], fol = followers(T.plat === 'stage' ? 'spinly' : T.plat), chance = clamp(((w.cs || w.q) - 55) * 1.6 + Math.log10(1 + fol) * 4, 4, 80) / 100;
      if (prnd() < chance) inbox('sfslot', `${F.name}: you're in`, `You have ${F.slot}. The room holds two hundred; on the night it's two-thirds full, and somebody near the bar has a lanyard from a company you'd recognise.`, { fest: F.k, wid: w.id, choices: [{ k: 'sf_safe', label: 'Do what you know works' }, { k: 'sf_risk', label: 'Try the new material' }] });
      else mail('inbox', F.name, 'Your application', `Thank you for applying. We had more than two thousand applications for ninety slots and could not offer you one this year. Please apply again.`); } }
}
WEEK_HOOKS.push(sideFestWeek);
function sidePickFest(it, k) {
  const M = S.me, me = ME(); if (it.kind !== 'sfapp' && it.kind !== 'sfslot') return false; it.done = true; const F = SIDE_FEST[it.fest];
  if (it.kind === 'sfapp') { if (k !== 'sf_go') { it.result = { t: 'Maybe next year.' }; return true; } const fee = usd(45); if (M.cash < fee) { it.result = { t: 'You can\'t cover the fee this week.' }; return true; } M.cash -= fee; M.sfApp = { k: F.k, wid: it.wid, y: S.year }; it.result = { t: `Sent. ${F.name} replies in about two months.` }; return true; }
  const w = (M.works || []).find(x => x.id === it.wid), T = w && WORK_TYPES[w.type], plat = T ? (T.plat === 'stage' ? 'spinly' : T.plat) : 'spinly';
  const sub = T ? T.subs[0] : 'pres', ok = k === 'sf_safe' ? true : roll(sub, 13), big = k === 'sf_risk' && ok;
  M.fol = M.fol || {}; M.fol[plat] = (M.fol[plat] || 0) * (big ? 1.25 : ok ? 1.08 : 1.02) + (big ? 200 : ok ? 50 : 5);
  const rec = S.sfest && S.sfest[F.k] && S.sfest[F.k][S.sfest[F.k].length - 1]; if (rec && rec.y === S.year) rec.me = big ? 2 : 1;
  if (!ok) { M.stress = Math.min(100, (M.stress || 0) + 5); it.result = { t: 'The new songs aren\'t ready, and the room can tell. A polite crowd, a long walk home.' }; return true; }
  milestone(big ? `Stole the show at ${F.name}` : `Played ${F.name}`, 'work');
  if (big) {
    if (F.field === 'music' && !M.deal) { const L = MEDIA_COS.map((c, i) => [c, i]).filter(([c, i]) => c.type === 'label' && (typeof mhOpen !== 'function' || mhOpen(i))), lab = L.length ? L[Math.floor(prnd() * L.length)][0] : null; if (lab) mail('offers', `A&R, ${lab.n}`, 'We saw you last night', `We were at ${F.name}. We'd like to offer a record deal: an advance of ${fmtCash(usd(25000))}, recoupable against your royalties, and the promotion to go with it.`, { k: 'label', lab: lab.n, adv: usd(25000) }); }
    else if (F.field !== 'music') { const pay = usd(F.field === 'creator' ? 4000 : F.field === 'podcast' ? 3000 : 5000); M.cash += pay - taxOn(pay); mail('offers', F.field === 'stage' ? 'A producer' : 'Partnerships team', F.field === 'stage' ? 'A transfer' : 'A sponsorship', F.field === 'stage' ? `We want to move your show to a bigger house for a month. ${fmtCash(pay)} up front against royalties.` : `We'd like to sponsor your next run. ${fmtCash(pay)}, paid now.`); }
    it.result = { t: 'You take the risk and it lands. People film it. By morning it has been shared more times than the festival has seats.' };
  } else it.result = { t: 'A clean, confident set. A few new names on the mailing list, and a nod from someone who matters.' };
  return true;
}
PICK_HOOKS.push(sidePickFest);
// the festivals' pages
function viewSideFest(k) {
  const F = SIDE_FEST[k]; if (!F) return '<p class="muted">Not found.</p>';
  const H = ((S.sfest || {})[k] || []).slice().reverse(), cur = H[0];
  return `<div class="head"><p class="eyebrow">${esc(FIELD_LABEL[F.field] || F.field)} · ${esc(hubName(F.hub))} · every year since ${F.from}</p><h2>${esc(F.name)}</h2><p class="lede">${esc(F.d)}</p></div>
   ${cur ? `<section class="panel"><h3>${cur.y} lineup</h3><ul class="plain">${cur.line.map(id => `<li>${pl(id)}${id === cur.top ? ' <b>· breakout of the year</b>' : ''}</li>`).join('')}${cur.me ? `<li><b>You</b>${cur.me === 2 ? ' · the set everyone talked about' : ''}</li>` : ''}</ul></section>` : '<p class="muted">No festival since the world began yet.</p>'}
   ${H.length > 1 ? `<section class="panel"><h3>Past breakouts</h3><ul class="plain">${H.slice(1).map(r => `<li>${r.y}: ${pl(r.top)}</li>`).join('')}</ul></section>` : ''}`;
}
{ const _ve = viewExtra; viewExtra = function (cur) { if (cur.kind === 'sfest') return viewSideFest(cur.id); return _ve.apply(this, arguments); }; }
function sideFestPanel() { return `<section class="panel"><h3>Showcase festivals</h3><ul class="plain">${SIDE_FESTS.filter(F => S.year >= F.from).map(F => { const L = (S.sfest || {})[F.k], last = L && L[L.length - 1]; return `<li><a href="#" class="lk" data-go="sfest:${F.k}">${esc(F.name)}</a> <span class="muted small">${esc(FIELD_LABEL[F.field] || F.field)} · week ${F.wk} of the year${last ? ` · last breakout: ${esc(P(last.top).name)}` : ''}</span></li>`; }).join('')}</ul></section>`; }
if (typeof OS_VIEWS !== 'undefined' && OS_VIEWS.charts) { const _oc = OS_VIEWS.charts; OS_VIEWS.charts = function () { return _oc.apply(this, arguments) + sideFestPanel(); }; }

// ---- the desk: working at a house ----
function sideDeskHouse() { const M = S.me; for (const j of M.jobs || []) { const i = j.mcoi !== undefined ? j.mcoi : MEDIA_COS.findIndex(c => c.n === j.mco); if (i >= 0 && typeof mhKeeps === 'function' && mhKeeps(i) && S.mh && S.mh[i] && !S.mh[i].closed) return i; } return -1; }
function sideDeskWeek() {
  const M = S.me; if (!M || !S.mh) return; const D = M.sdesk = M.sdesk || { calls: [] };
  // verdicts on calls made six months ago
  for (const c of D.calls) { if (c.done || S.week - c.w < 26) continue; c.done = 1; const p = P(c.pid); if (!p) continue;
    const grow = p.fans / Math.max(1, c.fans), d = p.deal;
    let t, good;
    if (c.k === 'sign') { good = d && d.adv ? d.rec / d.adv >= .25 || grow > 1.15 : grow > 1.15; t = good ? `${p.name}, whom you pushed to sign, ${d && d.adv && d.rec >= d.adv ? 'has already earned back the advance' : 'is growing fast'}. People remember who found them.` : `${p.name}, whom you pushed to sign, has not found an audience yet. Nobody says anything. Everyone remembers.`; }
    else if (c.k === 'pass') { good = grow < 1.3; t = good ? `${p.name}, whom you passed on, has gone quiet. Good call.` : `${p.name}, whom you passed on, is everywhere now${p.label != null ? ` on ${MEDIA_COS[p.label].n}` : ''}. That one will come up at your review.`; }
    else if (c.k === 'drop') { good = grow < 1.15; t = good ? `${p.name}, dropped on your advice, has not been heard of since.` : `${p.name}, dropped on your advice, has a hit elsewhere. Your boss forwards you the chart without comment.`; }
    else { good = grow > 1.05; t = good ? `${p.name}, kept on your word, is paying their way.` : `${p.name}, kept on your word, is still losing money.`; }
    const me = ME(); me.standing = clamp(me.standing + (good ? .6 : -.4), 0, 100); diary(t); }
  D.calls = D.calls.filter(c => !c.done || S.week - c.w < 80);
  if (S.week % 2 || pending().some(x => x.kind === 'sdesk')) return;
  const i = sideDeskHouse(); if (i < 0) return;
  const c = MEDIA_COS[i], h = S.mh[i], f = mhField(i), ros = mhRoster(i);
  if (prnd() < .6 || ros.length < 4) {
    const pool = S.people.filter(p => p && p.ind === f && p.label == null && !p.dead && !p.retired && !p.player && (p.rel || []).length).sort((a, b) => mhMomentum(b) - mhMomentum(a)).slice(0, 6);
    if (!pool.length) return; const p = pool[Math.floor(prnd() * pool.length)], adv = mhAdvance(p, .3), r = p.rel[p.rel.length - 1];
    inbox('sdesk', `${c.n}: sign or pass?`, `${p.name}: ${Math.round(p.fans).toLocaleString()} fans, last release "${r.t}"${r.cs != null ? ` (critics ${r.cs})` : ''}. Their manager wants ${fmtCash(adv)}. The ${MH_WORD[c.type] || 'company'} has ${fmtCash(h.cash)} in the bank. Your boss wants your call by Friday.`, { hs: i, pid: p.id, adv, choices: [{ k: 'sd_sign', label: `Sign them for ${fmtCash(adv)}` }, { k: 'sd_pass', label: 'Pass' }] });
  } else {
    const p = ros.slice().sort((a, b) => ((a.deal || {}).rec || 0) / Math.max(1, (a.deal || {}).adv || 1) - ((b.deal || {}).rec || 0) / Math.max(1, (b.deal || {}).adv || 1))[0], d = p.deal || { adv: 0, rec: 0 };
    inbox('sdesk', `${c.n}: keep or drop?`, `${p.name} has earned back ${d.adv ? Math.round(d.rec / d.adv * 100) : 100}% of a ${fmtCash(d.adv)} advance and last released something ${Math.max(0, Math.round((S.week - (p.lastWork || S.week)) / 4.3))} months ago. Finance wants the slot. You know the act.`, { hs: i, pid: p.id, choices: [{ k: 'sd_keep', label: 'Keep them' }, { k: 'sd_drop', label: 'Drop them' }] });
  }
}
WEEK_HOOKS.push(sideDeskWeek);
function sideDeskPick(it, k) {
  if (it.kind !== 'sdesk') return false; it.done = true; const M = S.me, D = M.sdesk = M.sdesk || { calls: [] }, p = P(it.pid), i = it.hs, h = S.mh && S.mh[i];
  if (!p || !h) { it.result = { t: 'It is moot by the time you reply.' }; return true; }
  const rec = kk => D.calls.push({ w: S.week, pid: p.id, fans: p.fans, k: kk });
  if (k === 'sd_sign') { if (p.label != null) { it.result = { t: `Too late: ${p.name} signed with ${MEDIA_COS[p.label].n} on Thursday.` }; return true; }
    if (h.cash < it.adv) { it.result = { t: 'Finance says no: the money is not there this quarter.' }; return true; }
    h.cash -= it.adv; p.label = i; p.deal = { adv: it.adv, rec: 0, till: S.week + MH_TERM[p.ind] }; h.signed++; mhNote(i, `Signed ${p.name} (${fmtCash(it.adv)} advance, on your call)`); rec('sign'); it.result = { t: `Done. ${p.name} sign on Monday. It is your name on the memo.` }; return true; }
  if (k === 'sd_pass') { rec('pass'); it.result = { t: 'You pass. Someone else may not.' }; return true; }
  if (k === 'sd_drop') { mhDrop(p, i, 'dropped on a staff recommendation'); rec('drop'); it.result = { t: `${p.name} are let go. Their manager does not return your calls.` }; return true; }
  rec('keep'); it.result = { t: 'You argue for one more release. Finance gives you six months.' }; return true;
}
PICK_HOOKS.push(sideDeskPick);
if (typeof CODEX !== 'undefined') CODEX.sidecrit = ['Critics, showcases and the label desk', 'tas',
  ['Outside film, reviews still move audiences: a rave adds listeners, a pan costs a few.', 'Most critics review albums, seasons and productions; a single gets noticed only once you have a following.', 'A critics\' score is the average of the outlets that reviewed you.'],
  ['Each field has a showcase festival every year: music in March, creators in June, the fringe in August, podcasts in September.', 'About two thousand acts apply for ninety slots; reviews and recent momentum get you in.', 'The breakout of a showcase is chased by every label for six months.'],
  ['A label signs on momentum and pays an advance it hopes to earn back from royalties.', 'An act that never earns back its advance is usually dropped when the deal ends.', 'At a label, network, studio or theatre, the calls you make are judged half a year later.']];
