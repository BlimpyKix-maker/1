// ================= Houses: labels, podcast networks, creator studios and theatres keep books =================
// Round 20. The film studios have cash, slates and failures; until now the side fields' companies were names with a
// hashed roster. Here each of them (MEDIA_COS) gets a ledger and makes the decisions its trade makes:
//  - money in from its roster's releases (units × the trade's rate, less the artist's royalty share);
//  - advances paid out on signing and earned back from the artist's royalties ("recoupment");
//  - every quarter it signs the unsigned act with the most momentum it can afford (the richest house chooses first);
//  - when a deal runs out it re-signs, loses the act to a richer rival, or drops it if it never earned back;
//  - a house that runs out of cash cuts its roster, is bought by a rival, or closes and frees its acts.
// The world's dice (wstream 'houses') drive all of it; a player signed to a house feels its fate.
const MH_RATE = { music: .004, creator: .0025, podcast: .02, stage: 9 };   // what one unit (stream, view, download, ticket) is worth to the house, gross
const MH_ROY = { music: .22, creator: .7, podcast: .5, stage: .1 };          // the act's share of that gross
const MH_TERM = { music: 208, creator: 104, podcast: 104, stage: 78 };       // weeks a deal runs
const MH_FIELD = { label: 'music', publisher: 'music', podcast: 'podcast', creator: 'creator', theatre: 'stage' };
const MH_CAP = [0, 140, 60, 35];                                              // how many acts a house of each tier can look after
const MH_FAN = { music: .25, creator: .02, podcast: .3, stage: .5 };         // the least an act's following is worth on signing, per fan
const MH_WORD = { label: 'label', publisher: 'publisher', podcast: 'network', creator: 'studio', theatre: 'theatre' };
// a publisher earns from songs in films and ads (src/sides.js), not from a roster, so it keeps no books here
function mhKeeps(i) { return MEDIA_COS[i].type !== 'publisher'; }
function mhOn() { return !!(S.mh && S.mh.length); }
function mhOpen(i) { const c = MEDIA_COS[i], h = S.mh && S.mh[i]; return !!c && c.f <= S.year && (!h || !h.closed); }
function mhField(i) { return MH_FIELD[MEDIA_COS[i].type] || 'music'; }
function mhRoster(i) { return S.people.filter(p => p && p.ind && p.label === i && !p.dead && !p.retired); }
// what an act brings in over the next four weeks, gross
function mhGross(p, w) { let u = 0; for (const r of p.rel || []) for (let k = 0; k < 4; k++) u += actUnits(p, r, w + k); return u * (MH_RATE[p.ind] || 0); }
function mhNote(i, t) { const h = S.mh[i]; (h.log = h.log || []).push({ w: S.week, t }); if (h.log.length > 24) h.log.shift(); }
// a signing price: a year of the act's projected royalties, more for momentum, more again when rivals circle
function mhAdvance(p, heat) { const g = Math.max(mhGross(p, S.week) * 13 * (MH_ROY[p.ind] || .2), p.fans * (MH_FAN[p.ind] || .1) * .3); return Math.round(g * (.7 + heat) / 100) * 100 + 500; }
// what an act earns a house in a typical year: releases a year × the audience each one finds over its life × the rate, less royalties
function mhSteady(p) { const f = p.ind, q = clamp(actSkill(p) * 3.6 + 12, 5, 98); return p.fans * ACT_ENG[f] * Math.pow(q / 60, 2) * 1.05 * ACT_RATE[f] * 13 / (1 - ACT_DECAY[f]) * MH_RATE[f] * (1 - MH_ROY[f]); }
function mhMomentum(p) { const r = (p.rel || [])[p.rel.length - 1]; if (!r) return 0; return clamp(r.v0 / Math.max(1, p.fans), 0, 3) * .4 + r.q / 100 + (S.week - r.w < 26 ? .2 : 0); }

function mhInit() {
  if (S.mh || typeof MEDIA_COS === 'undefined' || !S.actsOn) return;
  const prev = R; R = wstream('houses', 'seed', S.seed | 0);
  try {
    // not everyone is signed: small acts and most creators are independent
    for (const p of S.people) { if (!p || !p.ind || p.label == null) continue;
      const indie = p.ind === 'creator' ? .5 : p.ind === 'stage' ? 0 : p.fans < 50000 ? .55 : p.fans < 400000 ? .2 : .05;
      if (rnd() < indie) { p.label = null; continue; }
      const adv = mhAdvance(p, .2); p.deal = { adv, rec: Math.round(adv * (.3 + rnd() * .8)), till: S.week + Math.floor(rnd() * MH_TERM[p.ind]) }; }
    S.mh = MEDIA_COS.map((c, i) => {
      const net = S.people.reduce((t, p) => t + (p && p.ind && p.label === i && !p.dead && !p.retired ? mhSteady(p) : 0), 0);
      const floor = c.tier === 1 ? 4e6 : c.tier === 2 ? 1.2e6 : 3e5;
      return { cash: Math.round(net * (.4 + rnd() * .4) + floor), over: Math.round(Math.max(floor * .6, net * (.62 + rnd() * .2))), rev: 0, cost: 0, yrRev: 0, yrCost: 0, yrNet: 0, signed: 0, dropped: 0, log: [] };
    });
  } finally { R = prev; }
}
{ const _fw = finishWarm; finishWarm = function () { const r = _fw.apply(this, arguments); mhInit(); return r; }; }

// ---- every month: the books ----
function mhMonth() {
  if (!mhOn()) return; R = wstream('houses', S.week);
  for (let i = 0; i < MEDIA_COS.length; i++) { const c = MEDIA_COS[i], h = S.mh[i]; if (!h || h.closed || c.f > S.year || !mhKeeps(i)) continue;
    let rev = 0, cost = h.over / 13, roys = 0;
    for (const p of mhRoster(i)) { const g = mhGross(p, S.week), roy = g * MH_ROY[p.ind]; rev += g;
      const d = p.deal || (p.deal = { adv: 0, rec: 0, till: S.week + MH_TERM[p.ind] });
      if (d.rec < d.adv) { const back = Math.min(roy, d.adv - d.rec); d.rec += back; cost += roy - back; roys += roy - back; } else { cost += roy; roys += roy; }   // royalties first pay back the advance
      d.earn = (d.earn || 0) + g; }
    rev = Math.round(rev); cost = Math.round(cost); h.cash += rev - cost; h.rev = rev; h.cost = cost; h.yrRev += rev; h.yrCost += cost; h.yrNet += rev - roys;
  }
  if (Math.floor(S.week / 13) !== S.mhQ) { S.mhQ = Math.floor(S.week / 13); mhQuarter(); }
}
{ const _m = monthly; monthly = function () { const r = _m.apply(this, arguments); if (!S.archiving) mhMonth(); return r; }; }

// ---- every quarter: deals end, signings, trouble ----
function mhQuarter() {
  const open = MEDIA_COS.map((c, i) => i).filter(i => mhOpen(i) && S.mh[i] && mhKeeps(i));
  // deals that ran out
  for (const i of open) for (const p of mhRoster(i)) { const d = p.deal; if (!d || d.till > S.week) continue;
    const made = d.rec >= d.adv, quiet = S.week - (p.lastWork || 0) > 52;
    if (!made && (quiet || rnd() < .5)) { mhDrop(p, i, 'never earned back its advance'); continue; }
    const rival = made && p.fans > 1e5 ? open.filter(j => j !== i && mhField(j) === p.ind && MEDIA_COS[j].tier <= MEDIA_COS[i].tier && S.mh[j].cash > S.mh[i].cash * 1.4).sort((a, b) => S.mh[b].cash - S.mh[a].cash)[0] : undefined;
    const adv = mhAdvance(p, made ? .5 : .1);
    if (rival != null && rnd() < .45 && S.mh[rival].cash > adv * 2) { S.mh[rival].cash -= adv; p.label = rival; p.deal = { adv, rec: 0, till: S.week + MH_TERM[p.ind] }; S.mh[rival].signed++;
      mhNote(rival, `Signed ${p.name} away from ${MEDIA_COS[i].n}`); mhNote(i, `Lost ${p.name} to ${MEDIA_COS[rival].n}`);
      if (p.fans > 5e5) news('Business', `${p.name} leave${ACT_GROUP.has(p.act) ? '' : 's'} ${MEDIA_COS[i].n} for ${MEDIA_COS[rival].n} on a ${fmtCash(adv)} deal.`, { person: p.id }); continue; }
    if (S.mh[i].cash > adv && (mhRoster(i).length <= MH_CAP[MEDIA_COS[i].tier] || made)) { S.mh[i].cash -= adv; p.deal = { adv, rec: 0, till: S.week + MH_TERM[p.ind] }; mhNote(i, `Re-signed ${p.name} (${fmtCash(adv)})`); }
    else mhDrop(p, i, 'the money for a new deal was not there'); }
  // signings: the richest choose first
  const taken = new Set();
  for (const i of open.slice().sort((a, b) => S.mh[b].cash - S.mh[a].cash)) { const h = S.mh[i], c = MEDIA_COS[i], f = mhField(i);
    if (c.type === 'publisher' || h.cash < h.over * .3 || mhRoster(i).length >= MH_CAP[c.tier]) continue;
    const pool = S.people.filter(p => p && p.ind === f && p.label == null && !p.dead && !p.retired && !p.player && !taken.has(p.id) && (c.tier === 1 || p.hub === c.hub || rnd() < .15) && (p.rel || []).length);
    if (!pool.length) continue;
    const want = pool.map(p => [p, mhMomentum(p) + Math.log10(Math.max(10, p.fans)) * .15 + rnd() * .3]).sort((a, b) => b[1] - a[1]).slice(0, 2);
    for (const [p] of want) { const adv = mhAdvance(p, .2 + mhMomentum(p) * .3); if (adv > h.cash * .25) continue;
      h.cash -= adv; p.label = i; p.deal = { adv, rec: 0, till: S.week + MH_TERM[f] }; h.signed++; taken.add(p.id); mhNote(i, `Signed ${p.name} (${fmtCash(adv)} advance)`);
      if (p.fans > 2e5 || adv > 1e6) news('Business', `${c.n} sign${c.n.endsWith('s') ? '' : 's'} ${p.name}: a ${fmtCash(adv)} advance for the ${(KIND_LABEL[p.act] || p.act).toLowerCase()} of the moment.`, { person: p.id }); } }
  // trouble
  for (const i of open) { const h = S.mh[i], c = MEDIA_COS[i]; if (h.cash > -h.over * .3) continue;
    if (h.cut && S.week - h.cut < 52 && h.cash > -h.over * .8) continue;   // a cut needs a year to work
    const buyer = open.filter(j => j !== i && !S.mh[j].closed && MEDIA_COS[j].type === c.type && MEDIA_COS[j].tier < 3 && S.mh[j].cash > h.over * 1.5).sort((a, b) => S.mh[b].cash - S.mh[a].cash)[0];
    if (c.tier === 1 && h.cut && buyer == null) {   // too big to fold: a private-equity rescue, on hard terms
      h.cash = Math.round(h.over * .3); h.over = Math.round(h.over * .8); h.cut = S.week; h.rescued = S.week; mhNote(i, 'Rescued by private-equity money');
      news('Business', `Private-equity money rescues ${c.n}. The price: more cuts, and every act on the books reviewed.`, {}); continue; }
    if (c.tier === 3 || h.cut) {
      if (buyer != null) { const price = Math.round(h.over * .8); S.mh[buyer].cash -= price; S.mh[buyer].over += Math.round(h.over * .35); for (const p of mhRoster(i)) p.label = buyer;
        h.closed = S.week; h.by = buyer; mhNote(buyer, `Bought ${c.n} for ${fmtCash(price)}`); mhNote(i, `Sold to ${MEDIA_COS[buyer].n}`);
        news('Business', `${MEDIA_COS[buyer].n} buy${MEDIA_COS[buyer].n.endsWith('s') ? '' : 's'} the struggling ${c.n} for ${fmtCash(price)}; its roster moves across.`, {}); mhPlayer(i, buyer); }
      else { for (const p of mhRoster(i)) { p.label = null; p.deal = null; } h.closed = S.week; mhNote(i, 'Closed');
        news('Business', `${c.n} close${c.n.endsWith('s') ? '' : 's'}. Its ${MH_WORD[c.type] === 'theatre' ? 'companies' : 'acts'} are free to go.`, {}); mhPlayer(i, null); }
      continue; }
    // the first time: cut the roster and the staff
    h.cut = S.week; h.over = Math.round(h.over * .75); const R2 = mhRoster(i).sort((a, b) => (a.deal ? a.deal.earn || 0 : 0) - (b.deal ? b.deal.earn || 0 : 0)); const n = Math.ceil(R2.length / 3);
    for (const p of R2.slice(0, n)) mhDrop(p, i, 'cuts', true);
    mhNote(i, `Cuts: ${n} acts dropped, a quarter of the staff let go`); news('Business', `${c.n} cut${c.n.endsWith('s') ? '' : 's'} ${n} acts and a quarter of ${c.n.endsWith('s') ? 'their' : 'its'} staff after a bad year.`, {});
    mhPlayer(i, i, true); }
}
function mhDrop(p, i, why, quiet) { p.label = null; p.deal = null; S.mh[i].dropped++; if (!quiet) mhNote(i, `Dropped ${p.name}: ${why}`); if (!quiet && p.fans > 1e6) news('Business', `${MEDIA_COS[i].n} and ${p.name} part ways.`, { person: p.id }); }
// the player's own deal follows the house
function mhPlayer(i, to, cuts) {
  const M = S.me; if (!M || !M.deal || M.deal.lab !== MEDIA_COS[i].n) return;
  if (cuts) { const st = (M.works || []).filter(w => w.type === 'song').reduce((t, w) => t + (w.units || 0), 0);
    if (M.deal.rec < M.deal.adv * .5 && st < 100000) { mail('inbox', `A&R, ${MEDIA_COS[i].n}`, 'About your deal', `There is no easy way to say this. After a hard year the company is cutting its roster, and you are on the list. You keep the advance; the masters stay with us. Thank you for everything.`); milestone(`Dropped by ${MEDIA_COS[i].n}`, 'work'); M.deal = null; }
    else mail('inbox', `A&R, ${MEDIA_COS[i].n}`, 'Changes here', 'You will hear that we are cutting the roster. You are not on the list. Keep making records.'); return; }
  if (to != null) { mail('inbox', `Business affairs, ${MEDIA_COS[to].n}`, 'Welcome aboard', `${MEDIA_COS[to].n} has bought ${MEDIA_COS[i].n}, and your contract comes with it. Same terms, a new A&R and a bigger promotion team.`); M.deal.lab = MEDIA_COS[to].n; milestone(`Your label became part of ${MEDIA_COS[to].n}`, 'work'); }
  else { mail('inbox', `Business affairs, ${MEDIA_COS[i].n}`, 'We are closing', 'The company is closing. Your contract ends with it: what you were advanced is yours to keep, and the rights to your recordings come back to you.'); milestone(`${MEDIA_COS[i].n} closed; you are independent again`, 'work'); M.deal = null; }
}
// every year: the books roll over; new houses are founded on the calendar already
// and the staff is sized to the business: costs move a third of the way towards seventy per cent of what the roster earned the house, and shrink after a losing year
function mhYear() { if (!mhOn()) return; R = wstream('houses', 'year', S.year);
  // a closed name is worth something: after a few years, new owners may relaunch it with an empty roster
  S.mh.forEach((h, i) => { if (!h || !h.closed || h.by != null || S.week - h.closed < 104 || rnd() > .4) return; const t = MEDIA_COS[i].tier, fl = t === 1 ? 4e6 : t === 2 ? 1.2e6 : 3e5;
    Object.assign(h, { closed: 0, revived: S.week, cut: 0, cash: Math.round(fl), over: Math.round(fl * .5), yrRev: 0, yrCost: 0, yrNet: 0 }); mhNote(i, 'Relaunched under new owners');
    news('Business', `${MEDIA_COS[i].n} is back: new owners relaunch the name with an empty roster and money to sign.`, {}); });
  for (const h of S.mh) { if (!h || h.closed) continue; h.last = { rev: h.yrRev, cost: h.yrCost }; h.over = Math.round(h.yrNet > 0 ? h.over * .67 + h.yrNet * .7 * .33 : h.over * .9); h.yrRev = 0; h.yrCost = 0; h.yrNet = 0; } }
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); if (!S.archiving) mhYear(); return r; }; }

// ---- the rest of the game reads the real roster ----
{ const _fl = figLabel; figLabel = function (x) { const p = mhOn() && x && x.pid != null ? P(x.pid) : null; if (p) return p.label != null && MEDIA_COS[p.label] ? [MEDIA_COS[p.label], p.label] : null; return _fl.apply(this, arguments); }; }
{ const _vm = viewMediaCo; viewMediaCo = function (i) {
  const html = _vm.apply(this, arguments); i = +i; const c = MEDIA_COS[i], h = mhOn() && S.mh[i]; if (!c || !h || !mhKeeps(i)) return html;
  const ros = mhRoster(i).sort((a, b) => b.fans - a.fans), word = MH_WORD[c.type] || 'company';
  const status = h.closed ? (h.by != null ? `Sold to ${mcoLink(h.by)} in ${yearOf(h.closed)}.` : `Closed in ${yearOf(h.closed)}.`) : h.revived ? `Relaunched under new owners in ${yearOf(h.revived)}.` : h.cut ? `Cut back in ${yearOf(h.cut)}.` : 'Trading.';
  const books = `<section class="panel"><h3>The books</h3><div class="kpis mini"><div><span>Cash</span><b>${fmtCash(h.cash)}</b></div><div><span>Last month in</span><b>${fmtCash(h.rev)}</b></div><div><span>Last month out</span><b>${fmtCash(h.cost)}</b></div><div><span>Signed / dropped</span><b>${h.signed} / ${h.dropped}</b></div></div>
    ${h.last ? `<p class="small">Last year: ${fmtCash(h.last.rev)} in, ${fmtCash(h.last.cost)} out (${h.last.rev >= h.last.cost ? 'a profit' : 'a loss'} of ${fmtCash(Math.abs(h.last.rev - h.last.cost))}).</p>` : ''}<p class="small muted">${esc(status)} Money comes in from what the roster sells; the ${word} pays each act an advance, then keeps their royalties until it is earned back. Acts that never earn back are dropped; acts that do can walk to a richer rival when the deal runs out.</p></section>`;
  const tbl = `<section class="panel"><h3>Roster (${ros.length})</h3>${ros.length ? `<div class="tw"><table class="grid small"><thead><tr><th>Act</th><th class="n">Fans</th><th class="n">Advance</th><th>Earned back</th><th>Deal ends</th></tr></thead><tbody>${ros.slice(0, 40).map(p => { const d = p.deal || {}; return `<tr><td>${pl(p.id)}</td><td class="n">${Math.round(p.fans).toLocaleString()}</td><td class="n">${fmtCash(d.adv || 0)}</td><td>${d.adv ? (d.rec >= d.adv ? 'yes' : Math.round(d.rec / d.adv * 100) + '%') : '—'}</td><td>${d.till ? fmtDate(d.till, true) : '—'}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted small">Nobody on the books.</p>'}${(h.log || []).length ? `<h3>Recent moves</h3><ul class="plain small">${h.log.slice().reverse().slice(0, 10).map(x => `<li><span class="muted">${fmtDate(x.w, true)}</span> ${esc(x.t)}</li>`).join('')}</ul>` : ''}</section>`;
  // swap the old hashed roster panel for the real one
  return html.replace(/<section class="panel"><h3>Roster<\/h3>[\s\S]*?<\/section>/, '') .replace('<div class="cols two">', books + tbl + '<div class="cols two">');
}; }
