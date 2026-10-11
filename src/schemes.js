// ---------------- Schemes and secrets ----------------
// After Crusader Kings 3: schemes advance week by week on your skill against the target's resistance, and every week
// they might be discovered. Secrets are leverage.
//  - Some notable people have a secret (fixed by the world seed): a buried plagiarism, a tax dodge, an affair, cruelty
//    on set, a habit, a credit they didn't earn. Digging finds it.
//  - Schemes: dig for dirt; poach (they'll take your next offer at a discount); befriend a power broker; sabotage a
//    film they're making (its hook drops); blackmail, once you hold their secret (money, or a favour).
//  - Power is your relevant skill against their standing and discretion; a Discreet target resists more, a Gossip
//    less. Discovery costs standing and makes an enemy, and a discovered blackmail is a scandal.
// At most two schemes at once. They run on your dice (prnd), so replays match.
const SECRET_KINDS = ['plagiarised an early script', 'hides money offshore', 'is having an affair with a co-star', 'is cruel to crews when the cameras stop', 'has a habit everyone covers for', 'took a credit they didn\'t earn', 'paid off a journalist', 'faked a festival selection'];
function secretOf(p) { if (!p || p.dead || (p.fame || 0) + p.standing < 60) return null; return gH(p.id, 'secret') < .3 ? SECRET_KINDS[Math.floor(gH(p.id, 'sk') * SECRET_KINDS.length)] : null; }
function knowsSecret(id) { return !!((S.me.dirt || {})[id]); }
const SCHEME = {
  dig: { n: 'Dig for dirt', stat: 'cha', risk: .025, need: p => !knowsSecret(p.id), d: 'Ask around, buy drinks, read old contracts. If there\'s something, you\'ll find it.' },
  poach: { n: 'Poach them', stat: 'cha', risk: .02, need: p => ['actor', 'director', 'writer', 'dp', 'editor', 'composer', 'designer'].includes(p.role), d: 'Make them feel undervalued where they are. Success: they take your next offer at 20% off.' },
  befriend: { n: 'Befriend them', stat: 'cha', risk: 0, need: p => p.standing >= 45, d: 'Lunches, favours, the right introductions. Success: a powerful friend.' },
  sabotage: { n: 'Sabotage their film', stat: 'pack', risk: .06, need: p => !!schFilm(p), d: 'Leaks, a rival release date, a whisper to the buyers. Success: their film\'s hook drops.' },
  blackmail: { n: 'Blackmail them', stat: 'com', risk: .08, need: p => knowsSecret(p.id), d: 'You know what they did. Success: money or a favour. Discovery: a scandal.' }
};
function schFilm(p) { for (const i of (p.credits || []).slice(-6)) { const f = S.films[i]; if (f && f.rel === null && f.stage >= 0 && f.stage <= 3 && (f.dir === p.id || (f.cast || [])[0] === p.id || f.prod === p.id)) return f; } return null; }
function schPower(k) { const s = SCHEME[k]; try { return (checkInfo(s.stat, 10).mod || 0); } catch (e) { return 0; } }
function schResist(p) { return p.standing / 12 + (has(p, 'Discreet') ? 3 : 0) - (has(p, 'Gossip') ? 2 : 0) + (opinion(p.id) > 30 ? -2 : 0); }
function schWeekly(k, p) { return clamp(12 + schPower(k) * 2 - schResist(p) * 1.5, 3, 30); }   // progress points a week, roughly
function schemeAct(a) {
  const M = S.me, p = P(+a.id), s = SCHEME[a.k]; if (!p || p.dead || p.id === M.id || !s || !s.need(p)) return false;
  M.schemes = M.schemes || []; if (M.schemes.length >= 2 || M.schemes.some(x => x.id === p.id)) return false;
  M.schemes.push({ k: a.k, id: p.id, prog: 0, w: S.week }); return true;
}
function schemeStop(a) { const M = S.me; M.schemes = (M.schemes || []).filter(x => !(x.id === +a.id && x.k === a.k)); return true; }
function schemesWeek() {
  if (!S.me || !(S.me.schemes || []).length) return; const M = S.me, me = ME();
  for (const x of M.schemes.slice()) {
    const p = P(x.id), s = SCHEME[x.k]; if (!p || p.dead || !s.need(p) && x.k !== 'dig') { M.schemes = M.schemes.filter(y => y !== x); continue; }
    x.prog += schWeekly(x.k, p) * (.6 + prnd() * .8);
    if (s.risk && prnd() < s.risk * (1 + schResist(p) / 10)) { M.schemes = M.schemes.filter(y => y !== x); schCaught(x, p); continue; }
    if (x.prog >= 100) { M.schemes = M.schemes.filter(y => y !== x); schDone(x, p); }
  }
}
function schLog(x, p, how) { const M = S.me; (M.schLog = M.schLog || []).push({ w: S.week, k: x.k, id: p.id, how }); if (M.schLog.length > 20) M.schLog.shift(); }
function schCaught(x, p) {
  const me = ME(), M = S.me; schLog(x, p, 'caught'); addTie(me, p, -25); me.standing = clamp(me.standing - (x.k === 'blackmail' ? 6 : x.k === 'sabotage' ? 4 : 2), 0, 100);
  if (x.k === 'blackmail') { (M.secrets = M.secrets || []).push({ w: S.week, risk: 8, what: `blackmailing ${p.name}` }); news('People', `${me.name} accused of trying to blackmail ${p.name}.`, { person: me.id }); }
  inbox('note', `${p.name} finds out`, `Your ${({ dig: 'digging', poach: 'attempt to poach them', befriend: 'charm offensive', sabotage: 'sabotage', blackmail: 'blackmail' })[x.k]} is discovered. ${p.name} knows exactly who was behind it${x.k === 'blackmail' ? ', and so, soon, will everyone' : ''}.`, { person: p.id });
}
function schDone(x, p) {
  const M = S.me, me = ME(); let t = ''; schLog(x, p, x.k === 'dig' && !secretOf(p) ? 'clean' : 'done');
  if (x.k === 'dig') { const s = secretOf(p); if (s) { (M.dirt = M.dirt || {})[p.id] = s; t = `You find it: ${p.name} ${s}. You could use this.`; } else t = `Weeks of digging, and ${p.name} is clean. Annoyingly clean.`; }
  if (x.k === 'poach') { (M.poached = M.poached || {})[p.id] = S.week; addTie(me, p, 10); t = `${p.name} is ready to work with you: their next fee from you is 20% lower.`; }
  if (x.k === 'befriend') { addTie(me, p, 20); meet(p.id, 'A powerful friend', 10); if (typeof trust === 'function') trust(p.id, 10); me.standing = clamp(me.standing + 1, 0, 100); t = `${p.name} is a friend now, the kind whose calls get returned.`; }
  if (x.k === 'sabotage') { const f = schFilm(p); if (f) { f.hook = clamp((f.hook || 50) - 8, 5, 99); t = `Bad buzz follows ${f.title} everywhere. Nobody can say where it started.`; } else t = 'By the time it\'s ready, there\'s nothing left to sabotage.'; }
  if (x.k === 'blackmail') { const v = usd(10000 + (p.fame || 0) * 600 + p.standing * 300); M.cash += v; addTie(me, p, -30); delete (M.dirt || {})[p.id]; t = `${p.name} pays ${fmtCash(v)} to keep it quiet, and will never forgive you.`; }
  inbox('note', `Scheme complete: ${SCHEME[x.k].n.toLowerCase()} (${p.name})`, t, { person: p.id });
}
// poached talent comes cheaper
{ const _lf = leadFee; leadFee = function (id, genre, micro) { const v = _lf(id, genre, micro), w = S.me && (S.me.poached || {})[id]; return w !== undefined && S.week - w < 52 ? v * .8 : v; }; }
// person pages: the scheme buttons
{ const _vp = viewPerson; viewPerson = function (id) {
  const h = _vp(id), p = P(id); if (!S.me || !p || id === S.me.id || p.dead) return h; const M = S.me, run = (M.schemes || []).find(x => x.id === id);
  const opts = Object.entries(SCHEME).filter(([k, s]) => s.need(p)).map(([k, s]) => `<button class="btn-s" data-scheme="${k}:${id}" title="${esc(s.d)}">${esc(s.n)} · ~${Math.ceil(100 / schWeekly(k, p))} wks${s.risk ? `, ${Math.round(s.risk * (1 + schResist(p) / 10) * 100)}%/wk risk` : ''}</button>`).join(' ');
  const box = `<section class="panel scheme"><h3>Schemes</h3>${knowsSecret(id) ? `<p class="bad small">You know: ${esc(p.name)} ${esc(M.dirt[id])}.</p>` : ''}${run ? `<p class="small">Running: <b>${esc(SCHEME[run.k].n)}</b>, ${Math.round(run.prog)}% · <button class="btn-s" data-scheme="stop:${run.k}:${id}">Call it off</button></p>` : (M.schemes || []).length >= 2 ? '<p class="small muted">Two schemes already running.</p>' : `<p class="crow">${opts}</p><p class="small muted">Your skill against their standing and discretion; every week there's a chance of being found out.</p>`}</section>`;
  return h + box; }; }
function schemeClick(t) { const d = t.dataset.scheme; if (!d) return false; const p = d.split(':'); const ok = p[0] === 'stop' ? doAct({ t: 'scheme', stop: 1, k: p[1], id: +p[2] }) : doAct({ t: 'scheme', k: p[0], id: +p[1] }); if (!ok) inbox('note', 'Not now', 'Two schemes at most, one per person.'); render(true); return true; }
function schemePanel() {
  const M = S.me, L = M.schemes || [], G = (M.schLog || []).slice(-4).reverse(); if (!L.length && !Object.keys(M.dirt || {}).length && !G.length) return '';
  return `<section class="tk-p"><h4>SCHEMES <span class="tk-sub">${L.length}/2 running</span></h4><table class="tk-t"><tbody>${L.map(x => { const p = P(x.id); return `<tr><td>${esc(SCHEME[x.k].n)}</td><td><a href="#" class="lk" data-go="person:${x.id}">${esc(p.name)}</a></td><td class="n">${Math.round(x.prog)}%</td><td class="n tk-mut">+${Math.round(schWeekly(x.k, p))}/wk</td></tr>`; }).join('')}</tbody></table>
   ${G.length ? `<ul class="plain small">${G.map(g => `<li><span class="${g.how === 'caught' ? 'dn' : 'up'}">${g.how}</span> ${esc(SCHEME[g.k].n.toLowerCase())} · ${esc(P(g.id).name)} <span class="tk-mut">${esc(fmtDate(g.w, true))}</span></li>`).join('')}</ul>` : ''}
   ${Object.keys(M.dirt || {}).length ? `<p class="tk-foot">You hold: ${Object.entries(M.dirt).map(([id, s]) => `<a href="#" class="lk" data-go="person:${id}">${esc(P(+id).name)}</a>`).join(', ')}</p>` : ''}</section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + schemePanel() + h.slice(i); }; }
