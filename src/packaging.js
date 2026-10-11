// ---------------- Agency packaging ----------------
// The big agencies represent most of the names that matter (each notable person's agency is fixed by the world seed,
// `agencyOf`), and they sell them in bundles. When your company makes a film, an agency can offer a package: one of
// its directors and one of its stars, together. Packages open doors (investors and foreign buyers trust a package:
// the investor roll is 3 easier and pre-sales run 8 points higher), but they cost a packaging fee (4% of the budget
// at closing) and 12% of the film's profit, and the agency's star asks 15% more because the agency is on both sides
// of the table. From 2019 the writers' guild goes to war over it: writers represented by a packaging agency are told
// to fire their agents.
function agencyOf(p) {
  if (!p || p.dead || ((p.fame || 0) < 25 && p.standing < 45)) return null;
  const fits = a => a.focus === 'all' || (a.focus === 'talent' ? p.role === 'actor' : a.focus === 'lit' ? ['writer', 'director', 'producer'].includes(p.role) : !['actor', 'writer', 'director'].includes(p.role));
  const L = agenciesIn(p.hub).filter(a => a.tier >= 2 && fits(a)); if (!L.length) return null;
  const tot = L.reduce((t, a) => t + a.tier * a.tier, 0); let r = gH(p.id, 'agency') * tot; for (const a of L) { r -= a.tier * a.tier; if (r <= 0) return a; } return L[L.length - 1];
}
function pkgOffers(genre) {
  const M = S.me, hub = M.hub, ags = agenciesIn(hub).filter(a => a.tier >= 2), out = [];
  const pool = role => (S.pool[hub][role] || []).filter(id => available(id) && id !== M.id).map(P);
  const D = pool('director'), A = pool('actor');
  for (const ag of ags) {
    const d = D.filter(p => (agencyOf(p) || {}).name === ag.name).sort((a, b) => gcraft(b, 'dir', genre) + (b.fame || 0) / 5 - gcraft(a, 'dir', genre) - (a.fame || 0) / 5)[0];
    const l = A.filter(p => (agencyOf(p) || {}).name === ag.name).sort((a, b) => (b.fame || 0) + gcraft(b, 'act', genre) - (a.fame || 0) - gcraft(a, 'act', genre))[0];
    if (d && l) out.push({ ag: ag.i, name: ag.name, tier: ag.tier, dir: d.id, lead: l.id });
  }
  return out.sort((a, b) => b.tier - a.tier || (P(b.lead).fame || 0) - (P(a.lead).fame || 0)).slice(0, 3);
}
let PKG_CTX = null;
{ const _id = investDC; investDC = function (src) { return _id(src) - (PKG_CTX ? 3 : 0); }; }
{ const _ps = presaleShare; presaleShare = function (genre, lead, dir) { const v = _ps(genre, lead, dir); return PKG_CTX && v > 0 ? v + .08 : PKG_CTX ? .08 : v; }; }
{ const _lf = leadFee; leadFee = function (id, genre, micro) { const v = _lf(id, genre, micro); return PKG_CTX && PKG_CTX.lead === id ? v * 1.15 : v; }; }
function pkgFor(a) { if (a.pkg === undefined || a.pkg === null) return null; const o = pkgOffers((((S.me.scripts || []).find(x => x.id === a.id)) || ((S.me.holdings || []).find(x => x.id === a.id)) || {}).genre || 'Drama').find(x => x.ag === +a.pkg); return o && o.dir === a.dir && o.lead === a.lead ? o : null; }
{ const _sf = selfFund; selfFund = function (a) {
  const o = pkgFor(a), M = S.me, src = a.src === 'script' ? (M.scripts || []).find(x => x.id === a.id) : (M.holdings || []).find(x => x.id === a.id), before = src ? src.made : undefined;
  PKG_CTX = o; let r; try { r = _sf(a); } finally { PKG_CTX = null; }
  if (r && o && src && src.made !== undefined && src.made !== before) { const f = S.films[src.made], c = myCo(), fee = f.budget * .04; c.cash -= fee; f.pkg = { ag: o.name, fee }; f.hook = clamp((f.hook || 50) + 3, 5, 99);
    if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `Packaged by ${o.name}: ${P(o.dir).name} directs, ${P(o.lead).name} stars. Packaging fee ${fmtM(fee)} and 12% of the profit.` }); }
  return r; }; }
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); if (!f.pkg || f.pkg.paid) return out; f.pkg.paid = 1;
  const c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null, net = (f.rentals || 0) - (f.pa || 0) - (f.cost || 0);
  if (c && net > 0) { c.cash -= net * .12; f.pkg.back = net * .12; if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `${f.pkg.ag} takes its 12% of the profit: ${fmtM(net * .12)}.` }); }
  return out; }; }
// the make-film form: package offers
{ const _mf = makeFilmForm; makeFilmForm = function (c, k, x) {
  const h = _mf(c, k, x), key = k + ':' + x.id, F = (UI.mk || {})[key] || {}, O = pkgOffers(x.genre); if (!O.length) return h;
  const row = `<div class="pkg-row small"><b>Packages</b> ${O.map(o => `<button class="tk-chip${+F.pkg === o.ag && F.dir === String(o.dir) && F.lead === String(o.lead) ? ' on' : ''}" data-pkg="${key}|${o.ag}|${o.dir}|${o.lead}" title="Investors 3 easier, pre-sales +8 points, hook +4; fee 4% of budget + 12% of profit; the star asks 15% more">${esc(o.name)}: ${esc(P(o.dir).name)} + ${esc(P(o.lead).name)} (fame ${Math.round(P(o.lead).fame || 0)})</button>`).join(' ')} <span class="muted">fee 4% + 12% of profit</span></div>`;
  return h.replace('<div class="finplan small">', row + '<div class="finplan small">'); }; }
function pkgClick(t) { const d = t.dataset.pkg; if (!d) return false; const [key, ag, dir, lead] = d.split('|'), F = (UI.mk = UI.mk || {})[key] = UI.mk[key] || {};
  if (+F.pkg === +ag && F.dir === dir && F.lead === lead) { delete F.pkg; } else { F.pkg = +ag; F.dir = dir; F.lead = lead; } render(true); return true; }
// 2019: the writers' guild against packaging
function pkgWeek() {
  if (!S.me || S.year < 2019 || S.pkgWar) return; S.pkgWar = S.year;
  news('Industry', 'The writers\' guild orders its members to fire any agent whose agency takes packaging fees. Thousands do it in a week.');
  const M = S.me; if (!M.agent || (typeof myGuild === 'function' && myGuild() !== 'wri')) return;
  const ag = agenciesIn(M.hub).find(a => a.name === M.agent.name); if (!ag || ag.style !== 'packager' && ag.tier < 3) return;
  inbox('pkgwar', 'The guild says fire your agent', `${M.agent.name} takes packaging fees, and the writers' guild has told every member to leave agencies that do. Your agent calls the same afternoon: "You're not going to do this to me, are you?"`, { choices: [{ k: 'pw_fire', label: 'Fire them, with the guild' }, { k: 'pw_stay', label: 'Stay with your agent' }] });
}
function pkgPick(it, k) {
  if (it.kind !== 'pkgwar') return false; it.done = true; const M = S.me, me = ME();
  if (k === 'pw_fire') { M.agent = null; me.standing = clamp(me.standing + 1.5, 0, 100); it.result = { t: 'You send the letter the guild drafted. Writers you barely know buy you drinks for a month. Finding work is harder for a while.' }; return true; }
  me.standing = clamp(me.standing - 2, 0, 100); for (const id of aliveKnown().filter(id => P(id) && P(id).role === 'writer').slice(0, 10)) addTie(me, P(id), -4);
  it.result = { t: 'You stay. Your agent is very grateful. Some writers stop returning your calls.' }; return true;
}
