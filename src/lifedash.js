// ================= The life dashboard (Round 25) =================
// The cartoon need-meters over the room (Energy / Calm / Social / Fun) are gone. In their place, a strip of data across
// the top of your page, like the front of a good terminal: net worth, cash runway, energy, stress, standing, fame,
// your network and your level, each with its value, a 12-week line and the change over four weeks. Every number comes
// from the weekly snapshot the game already keeps (M.hist, src/terminal.js); nothing here changes the save.
{ const _hs = homeSceneSVG; homeSceneSVG = function () { return _hs.apply(this, arguments).replace(/<g class="needs">[\s\S]*?<\/g><\/svg>$/, '</svg>'); }; }
function ldSpark(vals, cls) {
  const v = vals.filter(x => x !== undefined && x !== null && isFinite(x)); if (v.length < 2) return '<svg class="ld-sp" viewBox="0 0 64 18"></svg>';
  const lo = Math.min(...v), hi = Math.max(...v), span = hi - lo || 1, pts = v.map((x, i) => `${(i / (v.length - 1) * 62 + 1).toFixed(1)},${(16 - (x - lo) / span * 14).toFixed(1)}`);
  return `<svg class="ld-sp ${cls || ''}" viewBox="0 0 64 18" preserveAspectRatio="none"><polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="1.4" vector-effect="non-scaling-stroke"/><circle cx="${pts[pts.length - 1].split(',')[0]}" cy="${pts[pts.length - 1].split(',')[1]}" r="1.6" fill="currentColor"/></svg>`;
}
function ldDelta(now, then, fmt, invert) {
  if (then === undefined || then === null || !isFinite(then)) return '<span class="ld-d">—</span>';
  const d = now - then; if (Math.abs(d) < 1e-9) return '<span class="ld-d">0</span>';
  const good = invert ? d < 0 : d > 0; return `<span class="ld-d ${good ? 'up' : 'dn'}">${d > 0 ? '▲' : '▼'} ${fmt(Math.abs(d))}</span>`;
}
function lifeDash() {
  const M = S.me, me = ME(); if (!M || !me) return '';
  const H = (M.hist || []).slice(-12), at4 = H.length >= 5 ? H[H.length - 5] : H[0], col = k => H.map(h => h[k]);
  const nw = typeof osNetWorth === 'function' ? osNetWorth().total : M.cash, burn = typeof burnRate === 'function' ? burnRate() : 0;
  const run = burn < 0 ? Math.floor(Math.max(0, M.cash) / -burn) : null, lv = typeof careerLevel === 'function' ? careerLevel() : 0;
  const credits = (M.past || []).filter(j => j.credited).length, known = Object.keys(M.known || {}).length;
  const money = v => fmtCash(Math.round(v)), num = v => (Math.round(v * 10) / 10).toLocaleString(), int = v => Math.round(v).toLocaleString();
  const cell = (label, value, sub, spark, delta, cls = '') => `<div class="ld-c ${cls}"><span class="ld-l">${label}</span><b class="ld-v">${value}</b>${spark}<span class="ld-s">${delta}${sub ? ` <i>${sub}</i>` : ''}</span></div>`;
  return `<section class="ld" aria-label="Your life in numbers"><div class="ld-h"><b>${esc(me.name)}</b><span>Week ${S.week} · ${S.year} · ${esc((HUBS[M.hub] || {}).name || '')}</span><span class="ld-hint">4-week change · 12-week trend</span></div><div class="ld-g">
    ${cell('Net worth', money(nw), '', ldSpark(col('nw')), ldDelta(nw, at4 && at4.nw, money), nw < 0 ? 'neg' : '')}
    ${cell('Cash runway', run === null ? '∞' : run + ' wk', burn < 0 ? `burn ${money(-burn)}/wk` : burn > 0 ? `+${money(burn)}/wk` : 'flat', ldSpark(col('cash')), ldDelta(M.cash, at4 && at4.cash, money), run !== null && run < 8 ? 'warn' : '')}
    ${cell('Energy', int(M.energy) + '%', M.energy < 30 ? 'rest soon' : '', ldSpark(col('energy')), ldDelta(M.energy, at4 && at4.energy, int), M.energy < 30 ? 'warn' : '')}
    ${cell('Stress', int(M.stress), M.stress > 70 ? 'near burnout' : M.stress > 45 ? 'elevated' : 'steady', ldSpark(col('stress'), 'inv'), ldDelta(M.stress, at4 && at4.stress, int, true), M.stress > 70 ? 'warn' : '')}
    ${cell('Standing', num(me.standing), '/ 100', ldSpark(col('st')), ldDelta(me.standing, at4 && at4.st, num))}
    ${cell('Fame', num(me.fame || 0), '/ 100', ldSpark(col('fame')), ldDelta(me.fame || 0, at4 && at4.fame, num))}
    ${cell('Network', int(known), 'people', ldSpark(col('known')), ldDelta(known, at4 && at4.known, int))}
    ${cell('Career', 'L' + lv, `${credits} credit${credits === 1 ? '' : 's'}`, '', '<span class="ld-d">' + esc(typeof LEVEL_NAMES !== 'undefined' && LEVEL_NAMES[lv] ? LEVEL_NAMES[lv] : '') + '</span>')}
   </div></section>`;
}
{ const _vd = viewDesk; viewDesk = function () { const h = _vd.apply(this, arguments); if (typeof h !== 'string') return h; const x = lifeDash(); if (!x) return h; return x + h; }; }
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.ld{margin:0 0 12px;border:1px solid var(--line,#ddd);border-radius:10px;background:var(--panel,#fff);overflow:hidden}
.ld-h{display:flex;gap:14px;align-items:baseline;padding:8px 14px;border-bottom:1px solid var(--line,#e6e6e6);font:600 11px var(--f-body,system-ui);letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#777)}
.ld-h b{color:var(--ink,#111);letter-spacing:.04em}.ld-hint{margin-left:auto;font-weight:500;letter-spacing:.04em;text-transform:none}
.ld-g{display:grid;grid-template-columns:repeat(8,minmax(0,1fr))}
.ld-c{padding:9px 12px 10px;border-left:1px solid var(--line,#eee);display:grid;grid-template-rows:auto auto 18px auto;gap:2px;min-width:0}.ld-c:first-child{border-left:0}
.ld-l{font:600 10px var(--f-body,system-ui);letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#888)}
.ld-v{font:600 17px/1.15 var(--f-data,ui-monospace,monospace);color:var(--ink,#111);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ld-c.neg .ld-v{color:var(--bad,#b3261e)}.ld-c.warn .ld-v{color:#b06d00}
.ld-sp{width:100%;height:18px;color:var(--accent,#c84);opacity:.85}.ld-sp.inv{color:var(--muted,#888)}
.ld-s{font:500 10.5px var(--f-data,ui-monospace,monospace);color:var(--muted,#888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ld-s i{font-style:normal}
.ld-d.up{color:var(--good,#2e7d32)}.ld-d.dn{color:var(--bad,#b3261e)}
@media (max-width:1100px){.ld-g{grid-template-columns:repeat(4,minmax(0,1fr))}.ld-c:nth-child(5){border-left:0}.ld-c:nth-child(n+5){border-top:1px solid var(--line,#eee)}}
@media (max-width:560px){.ld-g{grid-template-columns:repeat(2,minmax(0,1fr))}.ld-c:nth-child(odd){border-left:0}.ld-c:nth-child(n+3){border-top:1px solid var(--line,#eee)}.ld-hint{display:none}}`; document.head.appendChild(st); })();
