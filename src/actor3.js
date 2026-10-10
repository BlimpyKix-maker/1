// ---------------- Acting, the business end ----------------
// Actors used to be paid the same day rate whoever they were, and an offer was yes or no. Now:
//  - your quote: the best rate you've been paid. Offers for real parts come in near it, and rise with your Buzz Index;
//  - every acting offer can be negotiated: more money, points on the back end, billing, a producer credit, the lot,
//    or let your agent do it. Push too hard and they can walk;
//  - points pay out when the film's in profit; billing above the title buys fame on release; a press junket follows;
//  - a hit you led brings a franchise offer: sign for sequels now, hold out, or walk away;
//  - three parts in the same genre and you're typecast: easier to get that kind of part, harder to get others;
//  - your own company's films: star in them yourself.
function isActPost(p) { const t = p && tmplOf(p); return !!(t && t.actor && p.film !== null && p.film !== undefined && (p.tier || 1) >= 2); }
function actorQuote() { return S.me.quote || 0; }
function actLeverage(post) {
  const M = S.me, s = starScore(ME()), crd = M.past.filter(p => p.credited && tmplOf(p) && tmplOf(p).actor).length;
  return s / 9 + (M.agent ? M.agent.tier * .8 : 0) + Math.min(3, crd * .35) + (hireOdds(post) > .6 ? 1 : 0) - ((post.tier || 2) >= 4 && S.films[post.film] && S.films[post.film].tier === 1 ? 1 : 0);
}
const NEG_ASKS = {
  money: { label: 'Ask for more money (+30%)', dc: 1.5, walk: .12 },
  pts: { label: 'Ask for points on the back end', dc: 3, walk: .12 },
  bill: { label: 'Ask for top billing and a proper trailer', dc: 2, walk: .1 },
  epc: { label: 'Ask for a producer credit', dc: 4, walk: .15, need: 30 },
  all: { label: 'Go big: more money, points and billing', dc: 6, walk: .45 }
};
function negDC(post, k) { return clamp(Math.round(13 - actLeverage(post) + NEG_ASKS[k].dc), 4, 20); }
// offers for real parts carry the negotiation choices
{ const _ib = inbox;
  inbox = function (kind, title, text, extra = {}) {
    if (kind === 'offer' && extra.post && isActPost(extra.post) && extra.choices && !extra.negDone && S.me) {
      const post = extra.post, s = starScore(ME()), q = actorQuote();
      const asks = Object.keys(NEG_ASKS).filter(k => !NEG_ASKS[k].need || s >= NEG_ASKS[k].need).map(k => ({ k: 'neg_' + k, label: `${NEG_ASKS[k].label} · ${checkLabel('cha', negDC(post, k))}`, check: ['cha', negDC(post, k)] }));
      if (S.me.agent) asks.push({ k: 'neg_agent', label: `Let your agent negotiate (${['', 'small', 'solid', 'big', 'top'][S.me.agent.tier] || 'your'} agency: no roll)` });
      const ch = extra.choices.slice(); ch.splice(1, 0, ...asks);
      text = text + ` ${q ? `Your quote is ${fmtCash(q)} a day.` : 'You don\'t have a quote yet: this deal sets it.'} Your leverage: ${actLeverage(post) >= 5 ? 'strong' : actLeverage(post) >= 2.5 ? 'decent' : 'thin'}.`;
      extra = Object.assign({}, extra, { choices: ch });
    }
    return _ib(kind, title, text, extra);
  };
}
// real parts pay closer to what you're worth
{ const _mp = makePost;
  makePost = function (t, f) {
    const p = _mp(t, f);
    if (S.me && t.actor && f && (p.tier || 1) >= 2) { const s = starScore(ME()), q = actorQuote(); const base = p.rate; p.rate = usd(Math.round(Math.min(base * (2 + s / 15), Math.max(base, q * .9, base * (1 + s / 70))) / 10) * 10); }
    return p;
  };
}
function actor3Pick(it, k) {
  const M = S.me, me = ME();
  if (it.kind === 'offer' && /^neg_/.test(k)) {
    const post = it.post, ask = k.slice(4), f = S.films[post.film]; it.done = true;
    if (!f || f.stage < 0 || f.stage >= 4) { it.result = { t: 'Too late: the production has moved on.' }; return true; }
    const was = { rate: post.rate };
    const win = (a, crit) => { if (a === 'money' || a === 'all') post.rate = Math.round(post.rate * (crit ? 1.45 : 1.3)); if (a === 'pts' || a === 'all') post.pts = (post.tier || 2) >= 4 ? 2.5 : 1; if (a === 'bill' || a === 'all') post.bill = (post.tier || 2) >= 4 ? 'above the title' : 'top of the supporting cast'; if (a === 'epc') post.epc = 1; };
    const terms = () => [post.rate !== was.rate ? `${fmtCash(post.rate)} a day (was ${fmtCash(was.rate)})` : '', post.pts ? `${post.pts}% of the profits` : '', post.bill ? `billing ${post.bill}` : '', post.epc ? 'a producer credit' : ''].filter(Boolean).join(', ');
    if (ask === 'agent') { const T = M.agent.tier; post.rate = Math.round(post.rate * (1.08 + .07 * T)); if (T >= 2 && (post.tier || 2) >= 4) post.pts = 1 + (T >= 3 ? 1.5 : 0); if (T >= 3) post.bill = (post.tier || 2) >= 4 ? 'above the title' : 'top of the supporting cast';
      (M.deals3 = M.deals3 || []).push({ w: S.week, film: f.id, t: post.t, how: 'agent', terms: terms() });
      it.result = { t: `Your agent makes three calls and gets ${terms()}. Their cut comes out of it.` }; return acceptPost(it, post);
    }
    const ok = roll('cha', negDC(post, ask)), r = M.lastRoll;
    if (ok) { win(ask, r && r.crit > 0); (M.deals3 = M.deals3 || []).push({ w: S.week, film: f.id, t: post.t, how: ask, terms: terms() }); nudgeStyleSafe('amb', 1, 'Negotiated a better deal');
      it.result = { ok, roll: r, t: `They come back the same afternoon: yes. ${terms()}.` }; return acceptPost(it, post); }
    if (prnd() < NEG_ASKS[ask].walk) { (M.deals3 = M.deals3 || []).push({ w: S.week, film: f.id, t: post.t, how: ask, terms: 'they walked' }); if (post.head !== null && post.head !== undefined && P(post.head)) addTie(me, P(post.head), -3);
      it.result = { ok, roll: r, t: 'Silence for two days. Then: they\'ve gone another way. The part\'s gone.' }; return true; }
    it.result = { ok, roll: r, t: 'They won\'t move. The original offer is still there, if you want it.' };
    inbox('offer', `Offer stands: ${post.t}`, offerText(post), { post, negDone: 1, choices: [{ k: 'yes', label: 'Accept the original offer' }, { k: 'no', label: 'Walk away' }] });
    return true;
  }
  if (it.kind === 'junket') { it.done = true; const f = S.films[it.film];
    if (k === 'full') { M.energy = clamp(M.energy - 20, 0, 100); me.fame = clamp((me.fame || 0) + 2 + (it.bill ? 2 : 0), 0, 100); me.standing = clamp(me.standing + .5, 0, 100); it.result = { t: `Forty interviews in three cities. Your face is on every breakfast show. ${f.title} gets a bump.` }; f.hook = clamp((f.hook || 50) + 3, 5, 99); return true; }
    if (k === 'some') { me.fame = clamp((me.fame || 0) + 1, 0, 100); M.energy = clamp(M.energy - 6, 0, 100); it.result = { t: 'A handful of interviews. Enough.' }; return true; }
    if (k === 'wild') { const ok = roll('cha', 13); if (ok) { me.fame = clamp((me.fame || 0) + 5, 0, 100); it.result = { ok, roll: M.lastRoll, t: 'You go off-script on the biggest talk show in town. The clip has nine million views by morning.' }; } else { me.standing = clamp(me.standing - 1.5, 0, 100); it.result = { ok, roll: M.lastRoll, t: 'You go off-script, and it goes wrong. The clip has nine million views by morning, for all the wrong reasons.' }; } return true; }
    if (it.head !== undefined && it.head !== null && P(it.head)) addTie(me, P(it.head), -4); it.result = { t: 'You skip it. The studio notices.' }; return true;
  }
  if (it.kind === 'franchise') { it.done = true; const f = S.films[it.film];
    if (k === 'sign') { const adv = usd(Math.round(actorQuote() * 15 / 100) * 100); M.cash += adv; M.fr = { film: f.id, left: 2, rate: Math.round(actorQuote() * 1.4), next: S.week + 26 }; milestone(`Signed for two sequels to ${f.title}`, 'work'); it.result = { t: `You sign. ${fmtCash(adv)} up front, two more films, and a rate of ${fmtCash(M.fr.rate)} a day.` }; return true; }
    if (k === 'hold') { const ok = roll('cha', clamp(Math.round(15 - actLeverage({ tier: 4, film: f.id, head: null, id: -1, k: 'c:c_cast_lead_actor' }) * .5), 6, 18));
      if (ok) { const adv = usd(Math.round(actorQuote() * 30 / 100) * 100); M.cash += adv; M.fr = { film: f.id, left: 2, rate: Math.round(actorQuote() * 2), next: S.week + 26, pts: 5 }; milestone(`Signed a big franchise deal for ${f.title}`, 'work'); it.result = { ok, roll: M.lastRoll, t: `They blink. ${fmtCash(adv)} up front, double your quote, and 5% of the profits on every sequel.` }; }
      else it.result = { ok, roll: M.lastRoll, t: 'They recast. The sequel goes ahead without you, and does fine.' }; return true; }
    it.result = { t: 'One and done. You\'d rather not be that character for ten years.' }; return true;
  }
  return false;
}
function nudgeStyleSafe(k, v, why) { if (typeof nudgeStyle === 'function') nudgeStyle(k, v, why); }
function acceptPost(it, post) { const pre = it.result || {}; it.done = false; it.post = post; resolvePick(it, 'yes'); const res = it.result || {}; it.result = Object.assign({}, res, { ok: pre.ok !== undefined ? pre.ok : res.ok, roll: pre.roll || res.roll, t: `${pre.t || ''} ${res.t || ''}`.trim() }); it.done = true; return true; }
// what a deal carries into the job, and the quote it sets
{ const _tj = takeJob;
  takeJob = function (post) { const r = _tj(post); const M = S.me; if (isActPost(post)) { M.quote = Math.max(M.quote || 0, post.rate || 0); } return r; };
}
{ const _fj = finishJob;
  finishJob = function (j, L, quit) {
    const M = S.me, n0 = M.past.length, r = _fj.apply(this, arguments), pj = M.past[n0];
    if (pj && (j.pts || j.bill || j.epc)) { pj.pts = j.pts; pj.bill = j.bill; pj.epc = j.epc; }
    if (pj && pj.credited && j.epc && typeof crAdd === 'function') crAdd(j.film, 'Executive producer');
    if (pj && j.selfStar) pj.selfStar = 1;
    return r;
  };
}
// typecasting: three parts in one genre and that's who you are
function typecast() {
  const M = S.me, n = {}; let tot = 0;
  for (const p of M.past) if (p.credited && p.film !== null && p.film !== undefined && tmplOf(p) && tmplOf(p).actor) { const g = S.films[p.film].genre; n[g] = (n[g] || 0) + 1; tot++; }
  const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 3 && top[1] / tot >= .6 ? top[0] : null;
}
function actor3Factors(post) {
  if (!S.me || !isActPost(post)) return []; const g = typecast(), f = S.films[post.film], out = [];
  if (g && f) out.push(f.genre === g ? [`Known for ${g.toLowerCase()}`, .4] : ['Typecast', -.3]);
  return out;
}
{ const _hf = hireFactors; hireFactors = function (post) { const F = _hf(post); F.push(...actor3Factors(post)); return F; }; }
// each week: points, billing, junkets, franchises
function actor3Week() {
  const M = S.me, me = ME();
  for (const p of M.past) {
    if (p.film === null || p.film === undefined || p.a3done || !p.credited) continue;
    const f = S.films[p.film]; if (!f || f.stage < 0) { p.a3done = 1; continue; } if (f.rel === null) continue;
    p.a3done = 1; const T = tmplOf(p);
    if (p.pts) { const profit = Math.max(0, (f.rentals || 0) - (f.pa || 0) - (f.cost || 0)), pay = usd(Math.round(profit * 1e6 * p.pts / 100)); M.cash += pay; (M.ptsLog = M.ptsLog || []).push({ w: S.week, film: f.id, pts: p.pts, pay });
      inbox('note', `Your points on ${f.title}`, pay > 0 ? `${f.title} made money, and your ${p.pts}% of the profits comes to ${fmtCash(pay)}.` : `${f.title} never got into profit, on paper at least. Your ${p.pts}% comes to nothing. Ask any actor about studio accounting.`, { film: f.id }); }
    if (p.bill === 'above the title') { me.fame = clamp((me.fame || 0) + 3, 0, 100); me.heat = clamp((me.heat || 0) + 4, 0, 100); }
    if (T && T.actor && (p.tier || T.tier || 1) >= 2 && !pending().some(it => it.kind === 'junket')) {
      inbox('junket', `The press tour for ${f.title}`, `${f.title} is opening, and the studio wants you on the press tour.`, { film: f.id, bill: p.bill, head: p.head, choices: [{ k: 'full', label: 'The full tour: every city, every sofa' }, { k: 'some', label: 'A few interviews' }, { k: 'wild', label: `Go off-script on the big talk show · ${checkLabel('cha', 13)}`, check: ['cha', 13] }, { k: 'skip', label: 'Skip it' }] });
    }
    if (T && T.actor && (p.bill === 'above the title' || (T.tier || 1) >= 4) && f.total > f.cost * 2.5 && !M.fr) {
      inbox('franchise', `${f.title} 2?`, `${f.title} is a hit, and the studio wants a franchise built around you. They're offering a two-sequel deal.`, { film: f.id, choices: [{ k: 'sign', label: 'Sign for the sequels' }, { k: 'hold', label: 'Hold out for a much bigger deal' }, { k: 'pass', label: 'One and done' }] });
    }
  }
  // the next sequel
  if (M.fr && M.fr.left > 0 && S.week >= M.fr.next) {
    const f0 = S.films[M.fr.film], n = 4 - M.fr.left; M.fr.left--; M.fr.next = S.week + 40;
    const f = greenlight(f0.hub, { genre: f0.genre, title: `${f0.title} ${n === 2 ? 'II' : 'III'}`, co: f0.co === null ? undefined : f0.co, lead: me.id });
    if (f) { const post = makePost(POST_BY['c:c_cast_lead_actor'], f); post.rate = M.fr.rate; post.pts = M.fr.pts || 1.5; post.bill = 'above the title'; inbox('offer', `${f.title}: you're contracted`, `${f.title} is going ahead, built around you. Your deal: ${fmtCash(post.rate)} a day, ${post.pts}% of the profits, billing above the title.`, { post, negDone: 1, choices: [{ k: 'yes', label: 'Report for duty' }, { k: 'no', label: 'Break the contract' }] }); }
  }
}
// your own company: star in it
function selfStarFilms() { const c = typeof myCo === 'function' ? myCo() : null; if (!c || c.closed !== null) return []; return [...new Set(c.films || [])].map(i => S.films[i]).filter(f => f && f.stage >= 0 && f.stage <= 1 && !(f.cast || []).includes(S.me.id) && !S.me.jobs.some(j => j.film === f.id && tmplOf(j).actor)); }
function actor3Act(a) {
  const M = S.me, me = ME();
  if (a.k === 'star') { const f = selfStarFilms().find(x => x.id === +a.film); if (!f) return false;
    const old = f.cast[0]; if (old !== undefined && P(old)) { P(old).busy = Math.min(P(old).busy, S.week); }
    f.cast[0] = me.id; const post = makePost(POST_BY['c:c_cast_lead_actor'], f); post.rate = 0; post.pts = 10; post.bill = 'above the title'; post.selfStar = 1; post.head = f.dir === me.id ? null : f.dir;
    if (jobDays() + post.days > 7) return false;
    takeJob(post); diary(`You cast yourself as the lead in ${f.title}. No fee: ten points instead.`); milestone(`Starring in your own film, ${f.title}`, 'work'); return true; }
  return false;
}
function actingHTML() {
  const M = S.me, me = ME(); if (!M) return '';
  const s = starScore(ME()), q = actorQuote(), g = typecast(), D = (M.deals3 || []).slice(-8).reverse(), pts = (M.ptsLog || []).slice(-6).reverse(), own = selfStarFilms();
  const acting = M.past.filter(p => p.credited && tmplOf(p) && tmplOf(p).actor);
  return `<section class="panel act3"><h3>Your acting business</h3>
   <div class="kpis"><div><b>${q ? fmtCash(q) : '—'}</b><span>your quote, per day</span></div><div><b>${Math.round(s)}</b><span>Buzz Index</span></div><div><b>${acting.length}</b><span>credited parts</span></div><div><b>${M.agent ? esc(M.agent.name || 'Signed') : 'None'}</b><span>agent</span></div></div>
   <p class="small">${g ? `You're typecast in <b>${esc(g.toLowerCase())}</b>: easier to land those parts, harder to land anything else. A couple of parts in other genres breaks it.` : 'Not typecast: casting directors see range.'}</p>
   <p class="small muted">Every offer for a real part can be negotiated: more money, points, billing, a producer credit (once your Buzz Index passes 30), or let your agent do it. Leverage comes from your Buzz Index, your agent, your credits and how much they want you. Push too hard and they walk.</p>
   ${M.fr ? `<p>🎬 <b>Franchise:</b> ${fl(M.fr.film)}: ${M.fr.left} sequel${M.fr.left === 1 ? '' : 's'} to go at ${fmtCash(M.fr.rate)} a day${M.fr.left ? `, next around ${fmtDate(M.fr.next, true)}` : ''}.</p>` : ''}
   ${D.length ? `<h4>Your deals</h4><ul class="plain small">${D.map(d => `<li>${fl(d.film)} · ${esc(d.t)}: ${esc(d.terms)} <span class="muted">(${d.how === 'agent' ? 'your agent' : 'you asked: ' + d.how}, ${fmtDate(d.w, true)})</span></li>`).join('')}</ul>` : ''}
   ${pts.length ? `<h4>Back end</h4><ul class="plain small">${pts.map(x => `<li>${fl(x.film)}: ${x.pts}% → <b>${fmtCash(x.pay)}</b></li>`).join('')}</ul>` : ''}
   ${own.length ? `<h4>Star in your own films</h4><ul class="plain">${own.map(f => `<li>${fl(f.id)} <span class="muted small">${esc(f.genre)}, ${esc(f.status || '')}</span> <button class="btn small" data-act3="star:${f.id}">Cast yourself as the lead (no fee, 10 points)</button></li>`).join('')}</ul>` : M.company !== undefined ? '<p class="small muted">When your company has a film in development, you can cast yourself in it from here.</p>' : ''}</section>`;
}
function actor3Click(t) { if (!t.dataset.act3) return false; const [k, v] = t.dataset.act3.split(':'); doAct({ t: 'act3', k, film: +v }); render(true); return true; }
OS_EXTRA.acting = ['🎭', 'Acting', 'Your quote, your deals, points, franchises, typecasting, and starring in your own films'];
OS_VIEWS.acting = () => actingHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Work'); if (g && !g[1].includes('acting')) g[1].splice(2, 0, 'acting'); }
