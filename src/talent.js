// ---------------- The talent market: prices that move ----------------
// After Offworld Trading Company: talent is priced by supply and demand. Each week, for every market and main role,
// demand is the work in the pipeline (films in development, pre-production and shooting) and supply is the people
// free to take it. The price index is that ratio against its own long-run average, square-rooted and kept between
// ×0.75 and ×1.5: a boom makes everyone dearer, a strike or a slump makes them cheap. On top, each person carries
// heat from their bankability: a star off two hits costs more than one off two flops.
// Effects: the lead's fee on your films (leadFee), and what jobs pay you (makePost). The Terminal's TALENT MARKET shows
// the index by role with its trend, the hottest names and the bargains (good, cold, cheap), so you can hire on the dip.
const TAL_ROLES = ['actor', 'director', 'writer', 'dp', 'editor', 'composer', 'designer'];
const TAL_NEED = { actor: 3, director: 1, writer: 1, dp: 1, editor: 1, composer: 1, designer: 1 };
const TAL_CRAFT_ROLE = { act: 'actor', dir: 'director', wri: 'writer', cam: 'dp', edt: 'editor', mus: 'composer', des: 'designer' };
function tal() { return S.tal = S.tal || { ema: {}, idx: {}, h: {} }; }
function talIdx(role, m) { const T = S.tal; return T && T.idx[m] && T.idx[m][role] ? T.idx[m][role] : 1; }
function heat(p) { return p && typeof bankability === 'function' ? clamp(.75 + bankability(p) / 160, .8, 1.4) : 1; }
function talWeek() {
  if (!S.me) return; const T = tal(), mk = HUBS[S.me.hub].m, watch = new Set([mk, 'US', 'UK', 'IN', 'FR']);
  const films = {}; for (const id of S.active) { const f = S.films[id]; if (f && f.rel === null && f.stage >= 0 && f.stage <= 2 && watch.has(f.m)) films[f.m] = (films[f.m] || 0) + 1; }
  for (const m of watch) {
    const hubs = HUB_IDS.filter(h => HUBS[h].m === m && S.pool[h]); if (!hubs.length) continue;
    T.ema[m] = T.ema[m] || {}; T.idx[m] = T.idx[m] || {}; T.h[m] = T.h[m] || {};
    for (const r of TAL_ROLES) {
      let free = 0; for (const h of hubs) for (const id of S.pool[h][r] || []) if (available(id)) free++;
      const ratio = (films[m] || 0) * TAL_NEED[r] / Math.max(3, free), e = T.ema[m][r] === undefined ? ratio : T.ema[m][r] * .97 + ratio * .03;
      T.ema[m][r] = e; T.idx[m][r] = +clamp(Math.sqrt(e > 0 ? ratio / e : 1), .75, 1.5).toFixed(3);
      (T.h[m][r] = T.h[m][r] || []).push(T.idx[m][r]); if (T.h[m][r].length > 26) T.h[m][r].shift();
    }
  }
}
{ const _lf = leadFee; leadFee = function (id, genre, micro) { const v = _lf(id, genre, micro); return S.me ? v * talIdx('actor', HUBS[S.me.hub].m) * heat(P(id)) : v; }; }
{ const _mp = makePost; makePost = function (t, f) { const p = _mp(t, f); if (!S.me || !S.tal) return p; const sub = t && t.subs && t.subs[0], r = sub ? TAL_CRAFT_ROLE[SUB2C[sub]] : null; if (r) p.rate = Math.round(p.rate * talIdx(r, f ? f.m : HUBS[S.me.hub].m)); return p; }; }
function talPanel() {
  const T = S.tal; if (!T) return ''; const m = HUBS[S.me.hub].m; if (!T.idx[m]) return '';
  const rows = TAL_ROLES.map(r => { const v = T.idx[m][r] || 1, H = (T.h[m] || {})[r] || [], d = H.length > 4 ? v / H[Math.max(0, H.length - 13)] - 1 : 0;
    return `<tr><td>${esc(ROLE_LABEL[r] || r)}</td><td class="n ${v > 1.05 ? 'dn' : v < .95 ? 'up' : ''}">×${v.toFixed(2)}</td><td class="n ${d > 0 ? 'dn' : 'up'}">${H.length > 4 ? fmtPct(d * 100) : ''}</td><td>${H.length > 2 && typeof tSpark === 'function' ? tSpark(H, 90, 16) : ''}</td></tr>`; }).join('');
  const pool = HUB_IDS.filter(h => HUBS[h].m === m && S.pool[h]).flatMap(h => (S.pool[h].actor || [])).map(P).filter(p => p && !p.dead && (p.fame || 0) >= 20);
  const fee = p => leadFee(p.id, 'Drama', false);
  const hot = pool.slice().sort((a, b) => heat(b) * (b.fame || 0) - heat(a) * (a.fame || 0)).slice(0, 5);
  const cheap = pool.filter(p => available(p.id)).map(p => [p, gcraft(p, 'act', 'Drama') / Math.max(.01, fee(p))]).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
  const li = p => `<li><a href="#" class="lk" data-go="person:${p.id}">${esc(p.name)}</a> <span class="tk-mut">acting ${fogNum(p, gcraft(p, 'act', 'Drama'), 'act')} · heat ×${heat(p).toFixed(2)}</span> <b>${fmtM(fee(p))}</b></li>`;
  return `<section class="tk-p tk-wide"><h4>TALENT MARKET <span class="tk-sub">${esc(MARKETS[m].name)} · price index = work in the pipeline ÷ people free, against its own average</span></h4>
   <div class="tk-grid"><div><table class="tk-t"><thead><tr><th>Role</th><th class="n">Index</th><th class="n">13w</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
   <div><p class="small"><b>Hottest</b></p><ul class="plain small">${hot.map(li).join('')}</ul><p class="small"><b>Bargains</b> <span class="tk-mut">acting per dollar, free now</span></p><ul class="plain small">${cheap.map(li).join('')}</ul></div></div>
   <p class="tk-foot">A lead's fee follows the actor index and their heat (bankability). What jobs pay you follows your role's index. Strikes and slumps make talent cheap; booms make it dear. Acting is shown as your scouting allows.</p></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + talPanel() + h.slice(i); }; }
