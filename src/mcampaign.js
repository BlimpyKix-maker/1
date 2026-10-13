// ================= Awards season for music, podcasts, theatre and online video =================
// Round 22. Film had a season: campaigns, voters, nominations, a night. The other fields' awards were picked in one
// step in January. Now each field's season runs like film's:
//  - October: the labels, networks and theatres decide whom to push, and pay for it out of their real books (S.mh);
//  - October to November: a player with an eligible release gets a campaign decision every fortnight (a press tour,
//    a showcase for voters, a deluxe edition…), each one a cost, a roll and some momentum;
//  - early December: nominations, five per headline category, from quality, audience, reviews and campaign;
//  - January: the ceremony picks among the nominees, the stronger a nominee the likelier, never certain.
// The world's part uses hashed or world dice; only the player's own draws use the player's dice.
const MC_STEPS = {
  music: [['mc_tour', 'A radio and press tour', 900, 'pres', 'Twelve interviews in four days. You learn to say the same thing as if for the first time.'], ['mc_show', 'A showcase for voters', 2500, 'song', 'Two hundred members in a small room. You play the quiet one last.'], ['mc_deluxe', 'A deluxe edition with two new songs', 1500, 'song', 'The streams come back for a second week.']],
  stage: [['mc_voters', 'Invite voters to a performance', 1200, 'pres', 'The company plays it like a first night. Somebody important stays for the drinks.'], ['mc_album', 'A cast recording and a press day', 2200, 'song', 'The songs get out of the theatre and into people\'s kitchens.'], ['mc_talk', 'A post-show talk with the critics', 300, 'cha', 'You answer the hardest question in the room well.']],
  podcast: [['mc_live', 'A live taping for members', 1000, 'impro', 'An hour on a stage with a microphone and a crowd that knows every running joke.'], ['mc_guest', 'Guest spots on bigger shows', 200, 'cha', 'Six shows in two weeks. Each sends you a few thousand listeners.'], ['mc_press', 'A feature in the trade press', 600, 'pres', 'A photographer, a long lunch, a good headline.']],
  creator: [['mc_collab', 'A collaboration with a bigger creator', 400, 'pres', 'Their audience meets yours. Most of them stay.'], ['mc_screen', 'A screening night for voters', 1500, 'vstory', 'Your best video on a cinema screen, which is a strange thing to see.'], ['mc_brand', 'A brand-funded push', 0, 'cha', 'The money is someone else\'s. So, slightly, is the video.']]
};
const MC_MAIN = new Proxy({}, { get: (_, f) => MEDIA_AWARDS[f] ? MEDIA_AWARDS[f][1][0] : undefined, ownKeys: () => Object.keys(MEDIA_AWARDS), getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }) });   // each field's headline category
const mcWoy = w => ((w % 52) + 52) % 52;
function mcFieldOpen(f) { return f !== 'creator' || platOpen('vidwire'); }
// the year's contenders in a field: each act's best release of the year, scored on quality, audience and reviews
function mcContenders(f, y) {
  const M = S.me, hub = M ? M.hub : 'hollywood', hubs = HUB_IDS.filter(h => h === hub || HUBS[h].m === HUBS[hub].m || HUBS[h].m === 'US'), seen = new Set(), out = [];
  for (const h of hubs) for (const x of mediaFigures(h)) { const p = x.pid != null ? P(x.pid) : null; if (!p || p.ind !== f || seen.has(p.id) || p.dead) continue; seen.add(p.id);
    let best = null; for (const rl of p.rel || []) if (yearOf(rl.w) === y) { const sc = rl.q * Math.log10(10 + rl.v0 / (1 - ACT_DECAY[f])) * (1 + ((rl.cs != null ? rl.cs : rl.q) - 60) / 200); if (!best || sc > best.sc) best = { pid: p.id, w: rl.w, t: rl.t, sc, newb: p.mfrom >= y - 2 }; }
    if (best) out.push(best); }
  return out.sort((a, b) => b.sc - a.sc);
}
function mcMine(f, y) { const M = S.me; if (!M) return null; const w = (M.works || []).filter(w => WORK_TYPES[w.type] && WORK_TYPES[w.type].field === f && w.rel !== undefined && yearOf(w.rel) === y && w.q >= 55).sort((a, b) => b.q * Math.log10(10 + (b.units || 0)) - a.q * Math.log10(10 + (a.units || 0)))[0]; return w || null; }
function mcMineScore(w, f, cp) { return w.q * Math.log10(10 + Math.max(w.units || 0, f === 'stage' ? (w.units || 0) * 40 : 0)) * (1 + ((w.cs != null ? w.cs : w.q) - 60) / 200) * (1 + cp); }
// ---- October: the houses pick whom to push and pay for it ----
function mcHouseSpend(y) {
  const C = (S.mcp = S.mcp || {})[y] = S.mcp[y] || {};
  for (const f in MC_MAIN) { if (!mcFieldOpen(f)) continue; let told = 0;
    for (const c of mcContenders(f, y).slice(0, 8)) { const p = P(c.pid), i = p.label; if (i == null || !S.mh || !S.mh[i] || S.mh[i].closed) continue; const h = S.mh[i];
      const spend = Math.round(Math.min(h.cash * .04, MEDIA_COS[i].tier === 1 ? 3e6 : 6e5) / 1000) * 1000; if (spend < 2e4) continue;
      h.cash -= spend; C[p.id] = +(.04 + Math.log10(1 + spend / 5e4) * .06).toFixed(3); mhNote(i, `Awards campaign for ${p.name} (${fmtCash(spend)})`);
      if (told < 2 && spend >= 1.5e5) { told++; news('Business', `${MEDIA_COS[i].n} spend${MEDIA_COS[i].n.endsWith('s') ? '' : 's'} ${fmtCash(spend)} on an awards campaign for ${p.name}.`, { person: p.id }); } } }
}
// ---- early December: nominations ----
function mcNominate(y) {
  const N = (S.mnoms = S.mnoms || {})[y] = {}, C = (S.mcp || {})[y] || {}, M = S.me;
  for (const f in MC_MAIN) { if (!mcFieldOpen(f)) continue;
    const L = mcContenders(f, y).map(c => Object.assign({}, c, { sc: c.sc * (1 + (C[c.pid] || 0)) })).sort((a, b) => b.sc - a.sc);
    let five = L.slice(0, 5);
    const w = mcMine(f, y), cp = M && M.mcamp && M.mcamp[y] && M.mcamp[y][f] ? M.mcamp[y][f].cp : 0;
    if (w) { const sc = mcMineScore(w, f, cp), me = { me: 1, wid: w.id, t: w.title, sc }; if (five.length < 5 || sc > five[five.length - 1].sc) { five = five.slice(0, 4).concat([me]).sort((a, b) => b.sc - a.sc); }
      if (M) mail('inbox', MEDIA_AWARDS[f][0], five.some(x => x.me) ? 'Your nomination' : 'This year\'s nominations', five.some(x => x.me) ? `${w.title} is nominated for ${MC_MAIN[f]}. The ceremony is in January. Wear something you can stand up in.` : `${w.title} was considered for ${MC_MAIN[f]} but did not make the final five. The voters' letter is very polite.`); }
    N[f] = five;
    news('Award', `${MEDIA_AWARDS[f][0]} nominations, ${MC_MAIN[f]}: ${five.map(x => x.me ? `${ME().name} (${x.t})` : P(x.pid).name).join(', ')}.`, {});
  }
}
{ const _t = tick; tick = function () { const r = _t.apply(this, arguments); if (S.actsOn && !S.archiving) { const k = mcWoy(S.week); if (k === 40) mcHouseSpend(S.year); if (k === 48) mcNominate(S.year); } return r; }; }
// ---- the player's campaign, October to November ----
function mcWeek() {
  const M = S.me; if (!M) return; const k = mcWoy(S.week); if (k < 40 || k > 47 || k % 2 || pending().some(x => x.kind === 'mcamp')) return;
  for (const f in MC_MAIN) { if (!mcFieldOpen(f)) continue; const w = mcMine(f, S.year); if (!w) continue;
    const C = ((M.mcamp = M.mcamp || {})[S.year] = M.mcamp[S.year] || {})[f] = (M.mcamp[S.year] || {})[f] || { cp: 0, n: 0 }; if (C.n >= 4) continue;
    const steps = MC_STEPS[f];
    inbox('mcamp', `${MEDIA_AWARDS[f][0]} season: ${w.title}`, `Voting opens in a few weeks. ${w.title} is eligible for ${MC_MAIN[f]}. The labels are already spending; the question is what you can do that money can't.`, { f, wid: w.id, choices: steps.map(([kk, label, cost]) => ({ k: kk, label: cost ? `${label} (${fmtCash(usd(cost))})` : label, dis: cost && M.cash < usd(cost) })).concat([{ k: 'mc_none', label: 'Let the work speak for itself' }]) });
    return; }
}
WEEK_HOOKS.push(mcWeek);
function mcPick(it, k) {
  if (it.kind !== 'mcamp') return false; it.done = true; const M = S.me, f = it.f, C = M.mcamp[S.year][f];
  C.n++; if (k === 'mc_none') { it.result = { t: 'You keep working. Some voters like that; most never hear about it.' }; return true; }
  const st = MC_STEPS[f].find(x => x[0] === k); if (!st) { it.result = { t: 'Nothing comes of it.' }; return true; }
  const [, , cost, stat, text] = st, fee = usd(cost); if (M.cash < fee) { it.result = { t: 'The money isn\'t there.' }; return true; }
  M.cash -= fee; const ok = roll(stat, 12); C.cp += ok ? .07 + cost / 40000 : .02; M.stress = Math.min(100, (M.stress || 0) + 3);
  if (k === 'mc_deluxe' || k === 'mc_album') { const w = (M.works || []).find(x => x.id === it.wid); if (w) w.units = Math.round((w.units || 0) * 1.08); }
  if (k === 'mc_brand') M.cash += usd(800);
  it.result = { t: ok ? text : 'It happens, and it is fine, and nobody mentions it again.' };
  return true;
}
PICK_HOOKS.push(mcPick);
// ---- January: the ceremony picks among the nominees ----
{ const _ma = mediaAwardsWeek; mediaAwardsWeek = function () {
  const M = S.me, y = S.year - 1; if (!S.actsOn || !M || dateOf(S.week).getUTCMonth() !== 0 || M.mAwY === S.year || !(S.mnoms && S.mnoms[y])) return _ma.apply(this, arguments);
  M.mAwY = S.year; const me = ME();
  for (const f in MEDIA_AWARDS) { if (!mcFieldOpen(f)) continue; const [show, cats] = MEDIA_AWARDS[f], noms = (S.mnoms[y] || {})[f] || [], all = mcContenders(f, y), out = [], nomIds = {};
    cats.forEach((c, k) => {
      const main = c === MC_MAIN[f] || (k === 0 && !MC_MAIN[f]);
      const L = main ? noms : (/New/.test(c) ? all.filter(x => x.newb) : all).slice(0, 5); if (!L.length) return;
      const tot = L.reduce((t, x) => t + Math.pow(x.sc, 4), 0), mine = L.some(x => x.me), r0 = mine ? prnd() : hashRand(y * 977 + k * 31 + f.length)();
      let acc = 0, win = L[L.length - 1]; for (const x of L) { acc += Math.pow(x.sc, 4) / tot; if (r0 < acc) { win = x; break; } }
      nomIds[c] = L.filter(x => !x.me).map(x => x.pid);
      if (win.me) { me.standing = clamp(me.standing + 4, 0, 100); me.fame = clamp((me.fame || 0) + 4, 0, 100); milestone(`Won at ${show}: ${c} for ${win.t}`, 'prize'); out.push([c, `${me.name}, for ${win.t}`]); inbox('news', `${show} ${y}: you won`, `${win.t} wins ${c}. You make a speech you won't remember, and thank someone you've never met.`); }
      else { const p = P(win.pid); p.awards = p.awards || []; p.awards.push(`${show} ${y}: ${c}`); p.fans *= 1.15; p.fame = actFame(p.fans); out.push([c, /Artist|Creator|Show|Performance/.test(c) ? p.name : `${win.t} (${p.name})`]);
        if (mine) { me.standing = clamp(me.standing + 1.5, 0, 100); inbox('news', `${show} ${y}: nominated`, `${c} goes to ${p.name}. You clap like you mean it, and you mostly do. The nomination goes on every bio you'll ever write.`); } }
    });
    if (!out.length) continue;
    (S.mawards = S.mawards || []).push({ y, show, w: out, nom: nomIds });
    news('Award', `${show} ${y}: ${out.map(([c, n]) => `${c}: ${n}`).join(' · ')}.`, {});
  }
}; }
if (typeof CODEX !== 'undefined') CODEX.mcampaign = ['Awards season outside film', 'cha',
  ['Each field\'s awards are voted in January for the year before; nominations come out in early December.', 'Five nominees per headline category; the winner is usually, not always, the strongest of the five.', 'Quality and audience count most; reviews add a little.'],
  ['Labels, networks and theatres pay for campaigns in October, out of the money they actually have.', 'A rich label can buy a nomination for a good record; it cannot buy one for a bad one.', 'A campaign is a few voters remembering your name at the right moment.'],
  ['An independent artist campaigns with time and nerve: tours, showcases, guest spots.', 'Each push costs money and a little peace of mind.', 'Letting the work speak for itself is a real choice, and sometimes the right one.']];
