// ---------------- Television, the way it really works ----------------
// Nobody walks into a network with an idea. You get into the room through someone: an agent, a producer with a
// television track record who attaches themselves, your own production company, or a name that opens doors on its
// own. Then the long road: the pitch meeting, a script order, network notes (and maybe a rewrite), a pilot order,
// the pilot, and a series order or a pass. Every stage can stall. The Emmets get the whole ceremony: every category,
// what it honours, the winner and the nominees. And the guide shows tonight's primetime, channel by channel.
function tvRoutes(net) {
  const M = S.me, me = ME(), bar = PITCH_BAR[net.kind] || 25, R = [];
  if (M.agent) R.push({ k: 'agent', label: `Your agent sets the meeting`, bonus: 1 });
  const prods = Object.keys(M.known).map(Number).filter(id => { const p = P(id); return p && !p.dead && opinion(id) >= 20 && (p.role === 'producer' || p.role === 'writer') && p.standing >= 40 && (typeof tvCreditsOf !== 'function' || tvCreditsOf(id).length || p.standing >= 60); }).sort((a, b) => P(b).standing - P(a).standing).slice(0, 3);
  for (const id of prods) R.push({ k: 'ep:' + id, label: `${P(id).name} attaches as executive producer`, bonus: 3, ep: id });
  const c = typeof myCo === 'function' ? myCo() : null; if (c && c.closed === null && (c.hits >= 1 || c.tier <= 2)) R.push({ k: 'co', label: `Pitch through ${c.name}`, bonus: 1 });
  if (me.standing >= bar + 10) R.push({ k: 'name', label: 'Your name opens the door', bonus: 2 });
  else if (me.standing >= bar && (M.agent || prods.length)) R.push({ k: 'name', label: 'Your track record', bonus: 0 });
  return R;
}
function tvWaysIn() {
  const M = S.me, me = ME(), tvFolk = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead && typeof tvCreditsOf === 'function' && tvCreditsOf(id).length).slice(0, 3);
  return `<ul class="plain small"><li>🗂️ ${M.agent ? 'You have an agent: they can get you in once your standing is close to the channel\'s bar.' : 'Get an agent. Agencies send their clients into rooms you can\'t reach alone.'}</li>
   <li>🤝 Get to know a producer or writer with television credits (opinion 20 or better), and they can attach themselves.${tvFolk.length ? ` You know ${tvFolk.map(pl).join(', ')}.` : ''}</li>
   <li>🏢 Run a production company with a hit behind it.</li><li>📺 Work on a show first: the job board has writers' rooms and TV crews.</li><li>⭐ Or build your name: standing ${Math.floor(me.standing)} now.</li></ul>`;
}
// the whole development road, one stage at a time
function tvDevWeek() {
  const M = S.me, me = ME(), dev = M.tvdev; if (!dev || !dev.stage || dev.stage === 'pilot' || S.week < dev.due) return;
  const net = TV_NETS[dev.net];
  if (dev.stage === 'script') {
    const ok = roll('tas', 13 - (dev.ep !== undefined ? 2 : 0) + (dev.rewrites ? 1 : 0));
    if (ok) { dev.stage = 'pilot'; dev.due = S.week + 14; dev.notes = (M.lastRoll.d + M.lastRoll.mod - M.lastRoll.DC) >= 5 ? 4 : 1; M.cash += usd(25000) - (typeof taxOn === 'function' ? taxOn(usd(25000)) : 0); inbox('note', `${net.name} orders a pilot`, `The notes call goes well. They want to shoot ${dev.title}: a pilot, a director, a cast. ${dev.ep !== undefined ? P(dev.ep).name + ' handles the network; you handle the show.' : 'You\'re on your own with the network. Good luck.'}`, { result: { ok, roll: M.lastRoll, t: 'Pilot order.' } }); milestone(`Pilot order: ${dev.title}`, 'work'); }
    else if (!dev.rewrites) { dev.rewrites = 1; dev.due = S.week + 6; inbox('note', `Notes on ${dev.title}`, `${net.name} has notes. Forty-one of them. "Can the lead be more likeable? Can it be funnier? Can it be set somewhere cheaper?" Six weeks for a rewrite.`, { result: { ok, roll: M.lastRoll, t: 'A rewrite.' } }); }
    else { M.tvdev = null; inbox('note', `${net.name} passes on ${dev.title}`, `After the rewrite, the executive who bought it leaves for another channel, and the new one has "a different vision". The script goes in the drawer. You keep the fee.`, { result: { ok, roll: M.lastRoll, t: 'Dead in development.' } }); }
  }
}
function tvPitchAct(a) {
  const M = S.me, me = ME(), net = TV_NETS[a.net], g = TV_GENRES[a.g] ? a.g : 'drama';
  if (!net || net.orig > S.year || M.tvdev) return false;
  M.tvPitch = M.tvPitch || {}; if (S.week - (M.tvPitch[net.k] ?? -999) < 26) return false;
  const R = tvRoutes(net), route = R.find(x => x.k === a.route) || R[0]; if (!route) return false;
  M.tvPitch[net.k] = S.week;
  const title = String(a.title || '').replace(/\s+/g, ' ').trim().slice(0, 50) || tvTitle(g, hashRand(M.id * 31 + S.week), NAMES.en);
  const script = (M.scripts || []).some(s => s.grade && 'AB'.includes(String(s.grade)[0]));
  const crowded = tvAll().filter(s => s.net === net.k && s.g === g && tvOnAir(s, S.year)).length;
  const ok = roll('pack', 14 + ({ premium: 3, streaming: 2, broadcast: 1 }[net.kind] || 0) + Math.min(3, crowded) - (script ? 2 : 0) - route.bonus);
  if (ok) {
    M.tvdev = { net: net.k, g, title, w: S.week, stage: 'script', due: S.week + 8, ep: route.ep };
    const fee = usd(route.ep !== undefined ? 30000 : 20000); M.cash += fee - (typeof taxOn === 'function' ? taxOn(fee) : 0);
    if (route.ep !== undefined) meet(route.ep, `Executive producer on ${title}`, 6);
    inbox('note', `${net.name} buys ${title}`, `${route.label}, and the room goes your way. A script order: ${fmtCash(fee)} to write the pilot, eight weeks, then the network's notes.${crowded ? ` They already have ${crowded} ${TV_GENRES[g].label.toLowerCase()}${crowded > 1 ? 's' : ''} on air, so it has to stand out.` : ''}`, { result: { ok, roll: M.lastRoll, t: 'Script order.' } });
    milestone(`Sold a television pitch to ${net.name}`, 'work');
  } else inbox('note', `${net.name} passes`, `${pickLine(['"We have something too similar in development."', '"Love you, not this."', '"Can you make it a limited series? Or a podcast?"', '"It\'s not a fit for the brand right now."'], S.week)} They'll take another meeting in six months.${crowded >= 2 ? ` (They have ${crowded} shows like it already.)` : ''}`, { result: { ok, roll: M.lastRoll, t: 'A pass.' } });
  return true;
}
function tvPitchHTML() {
  const M = S.me, dev = M.tvdev, nets = Object.values(TV_NETS).filter(n => n.orig <= S.year && (HUBS[n.hub] || {}).m === (HUBS[M.hub] || {}).m);
  if (dev) { const st = { script: 'Writing the pilot script', pilot: 'Shooting the pilot' }[dev.stage || 'pilot']; return `<h4>In development</h4><p class="small"><b>${esc(dev.title)}</b> at ${netLink(dev.net)} · ${st}, next step ${fmtDate(dev.due, true)}${dev.ep !== undefined ? ` · executive producer ${pl(dev.ep)}` : ''}${dev.rewrites ? ' · after a rewrite' : ''}</p><p class="small muted">Pitch → script order → network notes → pilot order → pilot → series order. Any step can stall.</p>`; }
  const nk = UI.tvpn && TV_NETS[UI.tvpn] ? UI.tvpn : (nets[0] || {}).k, net = TV_NETS[nk], R = net ? tvRoutes(net) : [];
  return `<h4>Pitch a show</h4><p class="small">Channels don't take pitches from strangers. You need a way into the room, and the better the way in, the better your odds. A strong finished script helps; a channel already full of shows like yours is harder.</p>
   <div class="filt"><label><span>Channel</span>${sel('tvp-net', nets.map(n => [n.k, `${n.name} (${n.kind})`]), nk)}</label><label><span>Kind of show</span>${sel('tvp-g', Object.entries(TV_GENRES).filter(([k]) => !['soap', 'talk', 'variety', 'asadora', 'serial', 'telenovela', 'kdrama'].includes(k)).map(([k, G]) => [k, G.label]), UI.tvpg2 || 'drama')}</label><label class="filt-q"><span>Title</span><input id="tvp-title" type="text" maxlength="50" placeholder="Your show's title" value="${esc(UI.tvpt || '')}"></label></div>
   ${R.length ? `<p class="small"><b>Your way in:</b> ${sel('tvp-route', R.map(x => [x.k, x.label]), UI.tvpr && R.some(x => x.k === UI.tvpr) ? UI.tvpr : R[0].k)}</p><button class="btn-s" data-tvpitch="1" ${S.week - ((M.tvPitch || {})[nk] ?? -999) < 26 ? 'disabled' : ''}>Take the meeting</button>${S.week - ((M.tvPitch || {})[nk] ?? -999) < 26 ? ' <span class="muted small">They saw you recently. Six months between pitches.</span>' : ''}` : `<p class="small bad">No way into ${net ? esc(net.name) : 'a channel'} yet.</p>${tvWaysIn()}`}`;
}
// the Emmets, all of it
function emmetsHTML() {
  const ys = []; for (let y = S.year; y >= Math.max(1949, S.year - 60); y--) ys.push(y);
  const y = UI.emy && ys.includes(UI.emy) ? UI.emy : ys.find(k => tvEmmets(k).length) || ys[0], E = tvEmmets(y);
  return `<p class="muted small">Television's academy votes every September: ${TV_CATS.length} categories, from the big series prizes to the craft and the children's shows. The statuette is a winged figure holding an atom; nobody remembers why.</p>
   <div class="filt"><label><span>Year</span>${sel('em-y', ys.map(k => [k, String(k)]), y)}</label></div>
   ${E.length ? `<div class="em-grid">${TV_CATS.map(([cat, , who, d]) => { const e = E.find(x => x.cat === cat); if (!e) return ''; const s = tvShow(e.show); return `<div class="em-cat"><h5>${esc(cat)}</h5><p class="small muted">${esc(d)}</p><p>🏆 ${who && e.person !== null && e.person !== undefined ? `${pl(e.person)}, ` : ''}${s ? tvLink(s) : ''}</p>${e.noms.length ? `<p class="small">Also nominated: ${e.noms.map(id => { const x = tvShow(id); return x ? tvLink(x) : ''; }).filter(Boolean).join(', ')}</p>` : ''}</div>`; }).join('')}</div>` : '<p class="muted">The ceremony hasn\'t happened yet this year: it\'s in September.</p>'}`;
}
// tonight's primetime on the big channels in your market
function primetimeHTML() {
  const M = S.me, mkt = (HUBS[M.hub] || {}).m || 'US', nets = Object.values(TV_NETS).filter(n => (HUBS[n.hub] || {}).m === mkt && ['broadcast', 'public', 'cable', 'premium'].includes(n.kind) && n.founded <= S.year).slice(0, 6);
  if (!nets.length) return '';
  const day = M.wk ? M.wk.day : 0, all = typeof tvAllPlus === 'function' ? tvAllPlus() : tvAll();
  const grid = nets.map(n => { const on = all.filter(s => s.net === n.k && tvOnAir(s, S.year)).sort((a, b) => hashRand(a.seed + S.week * 7 + day)() - hashRand(b.seed + S.week * 7 + day)()).slice(0, 3); return `<tr><td><b>${netLink(n.k)}</b></td>${[0, 1, 2].map(i => `<td class="small">${on[i] ? tvLink(on[i]) + `<br><span class="muted">${esc(TV_GENRES[on[i].g].label)}</span>` : '<span class="muted">Film or repeats</span>'}</td>`).join('')}</tr>`; }).join('');
  return `<h4>Tonight, ${DAYS7[day]}</h4><div class="tw"><table class="grid small"><thead><tr><th>Channel</th><th>8 pm</th><th>9 pm</th><th>10 pm</th></tr></thead><tbody>${grid}</tbody></table></div>`;
}
