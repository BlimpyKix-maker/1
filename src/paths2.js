// ================= Paths, readable (Round 27) =================
// The Paths page borrowed a class name that another feature styles as a grid of 220px cards, so its sections were
// squeezed into narrow columns on the left and the labs table broke its text into slivers. Now it has its own
// layout: a summary strip (your field, where you are, the next step and what it takes), full-width ladder cards with
// progress, your deals and income, and the labs and fellowships as cards sorted by when they open.
function pathsApp2() {
  const M = S.me; if (!M || !careerActive()) return '<p class="muted">Start a career to see your paths.</p>';
  const d = typeof dreamOf === 'function' ? dreamOf() : null, my = M.field || 'film', fields = Object.keys(PATHS).sort((a, b) => (b === my) - (a === my) || (d && (b === d.field) - (a === d.field)) || pathRung(b) - pathRung(a));
  const P0 = PATHS[my], i0 = pathRung(my), nx0 = P0.rungs[i0 + 1];
  const strip = `<div class="pth-strip"><div><span>Your field</span><b>${esc(P0.label)}</b></div><div><span>Where you are</span><b>${esc(P0.rungs[i0][0])}</b><small>step ${i0 + 1} of ${P0.rungs.length}</small></div><div class="wide"><span>Next step</span><b>${nx0 ? esc(nx0[0]) : 'The top'}</b><small>${nx0 ? esc(nx0[2]) : 'You\'re at the top of this ladder.'}</small></div>${d ? `<div><span>Your dream</span><b>${esc(d.label)}</b></div>` : ''}</div>`;
  const ladder = f => { const R = PATHS[f].rungs, i = pathRung(f), nx = R[i + 1], pct = Math.round(i / Math.max(1, R.length - 1) * 100);
    return `<article class="pth-l${f === my ? ' mine' : ''}"><header><b>${esc(PATHS[f].label)}</b>${f === my ? '<span class="chip good">your field</span>' : ''}${d && d.field === f ? '<span class="chip">your dream</span>' : ''}<span class="pth-pct">${i + 1}/${R.length}</span></header>
     <div class="pth-bar"><i style="width:${pct}%"></i></div>
     <ol class="pth-rungs">${R.map((r, j) => `<li class="${j < i ? 'done' : j === i ? 'on' : ''}" title="${esc(r[2])}">${j < i ? '✓ ' : ''}${esc(r[0])}</li>`).join('')}</ol>
     <p class="small">${nx ? `<b>Next: ${esc(nx[0])}.</b> <span class="muted">${esc(nx[2])}</span>` : '<span class="muted">You\'re at the top of this ladder.</span>'}</p></article>`; };
  const deals = (M.pdeals || []).map(x => `<li>${esc(({ music_label: 'Record deal', music_pub: 'Publishing', creator_mcn: 'Creator network', pod_network: 'Podcast network', stage_transfer: 'Transfer' })[x.k] || x.k)}: <b>${esc(x.pick)}</b> <span class="muted">since ${fmtDate(x.w, true)}</span></li>`), streams = (M.streams || []).filter(s => S.week <= s.to);
  const labs = LABS.filter(labFits), tried = M.labTried || {}, wy = S.week % 52;
  const labCard = L => { const open = labOpen(L), wait = tried[L[0]] !== undefined && S.week - tried[L[0]] < 40, inW = (L[4] - wy + 52) % 52, mine = M.lab && M.lab.k === L[0];
    const act = mine ? '<span class="chip good">you\'re in</span>' : wait ? '<span class="muted small">applied this year</span>' : open && !M.lab ? `<button class="btn-s" data-labapply="${L[0]}">Apply now</button>` : `<span class="pth-when">${open ? 'open now' : `opens in ${inW} wk`}</span>`;
    return `<article class="pth-lab${open ? ' open' : ''}"><header><b>${esc(L[1])}</b><span class="chip">${esc(FIELDS[L[2]] || L[2])}</span></header><p class="small">${esc(L[8])}</p><dl><div><dt>Length</dt><dd>${L[5]} weeks</dd></div><div><dt>Selection</dt><dd>${esc(checkLabel(L[6], labDC(L)))}</dd></div></dl><footer>${act}</footer></article>`; };
  labs.sort((a, b) => (labOpen(b) - labOpen(a)) || (((a[4] - wy + 52) % 52) - ((b[4] - wy + 52) % 52)));
  return `<div class="pth">${strip}
   <section class="pth-s"><h3>Your ladders</h3><p class="muted small">Every part of the business has its own steps up. Hover a step to see what it takes. Where your work takes you decides your field.</p><div class="pth-grid">${fields.map(ladder).join('')}</div></section>
   ${deals.length || streams.length || M.deal ? `<section class="pth-s"><h3>Your deals and income</h3>${deals.length ? `<ul class="plain small">${deals.join('')}</ul>` : ''}${streams.length ? `<table class="grid small"><thead><tr><th>Income</th><th class="n">A week</th><th class="n">Until</th></tr></thead><tbody>${streams.map(s => `<tr><td>${esc(s.t)}</td><td class="n">${fmtCash(s.per)}</td><td class="n">${fmtDate(s.to, true)}</td></tr>`).join('')}</tbody></table>` : ''}${M.deal ? `<p class="small">Record deal with ${esc(M.deal.lab)}: advance ${fmtCash(M.deal.adv)}, ${fmtCash(M.deal.rec)} earned back so far${M.deal.rec >= M.deal.adv ? ' (recouped: royalties now reach you)' : ''}.</p>` : ''}</section>` : ''}
   <section class="pth-s"><h3>Labs, fellowships and residencies</h3><p class="muted small">The schooling of working life. Each opens once a year for four weeks, and you can be on one at a time. Selection is a roll on the skill it cares about; a higher level and good paid work both help. Soonest first.</p>
    ${M.lab ? `<p class="note">On ${esc(LAB_BY[M.lab.k][1])} until ${fmtDate(M.lab.to, true)}.</p>` : ''}<div class="pth-labs">${labs.map(labCard).join('') || '<p class="muted">None for your fields yet.</p>'}</div>
    ${(M.labs || []).length ? `<p class="small">Alumni of: ${(M.labs || []).map(x => esc(LAB_BY[x.k][1])).join(', ')}.</p>` : ''}</section></div>`;
}
pathsApp = pathsApp2;
OS_VIEWS.paths = () => pathsApp();
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.pth{display:flex;flex-direction:column;gap:16px}
.pth-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;border:1px solid var(--os-line,var(--line,#ddd));border-radius:10px;overflow:hidden;background:var(--os-line,var(--line,#ddd))}
.pth-strip>div{background:var(--os-card,var(--panel,#fff));padding:10px 14px;display:flex;flex-direction:column;gap:2px}.pth-strip>div.wide{grid-column:span 2}
.pth-strip span{font:600 10.5px var(--f-body,system-ui);letter-spacing:.1em;text-transform:uppercase;opacity:.65}.pth-strip b{font-size:16px}.pth-strip small{font-size:12px;opacity:.75}
.pth-s h3{margin:0 0 4px}.pth-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;margin-top:8px}
.pth-l{border:1px solid var(--os-line,var(--line,#ddd));border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.pth-l.mine{border-color:#c9a227;box-shadow:inset 3px 0 0 #c9a227}
.pth-l header{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.pth-l header b{font-size:14px;letter-spacing:.04em;text-transform:uppercase}.pth-pct{margin-left:auto;font:600 12px var(--f-data,ui-monospace,monospace);opacity:.7}
.pth-bar{height:5px;border-radius:3px;background:color-mix(in srgb,currentColor 12%,transparent);overflow:hidden}.pth-bar i{display:block;height:100%;background:#c9a227}
.pth-rungs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:5px}.pth-rungs li{font-size:12px;padding:2px 9px;border-radius:10px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);opacity:.6;cursor:help}
.pth-rungs li.done{opacity:.85}.pth-rungs li.on{opacity:1;background:#c9a227;color:#1a1408;border-color:transparent;font-weight:700}
.pth-l p{margin:0}.pth-labs{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;margin-top:8px}
.pth-lab{border:1px solid var(--os-line,var(--line,#ddd));border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:6px}.pth-lab.open{border-color:var(--good,#2e7d32)}
.pth-lab header{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.pth-lab header b{font-size:14.5px}.pth-lab p{margin:0}
.pth-lab dl{display:flex;gap:18px;margin:0}.pth-lab dt{font:600 10px var(--f-body,system-ui);letter-spacing:.1em;text-transform:uppercase;opacity:.6}.pth-lab dd{margin:0;font-size:12.5px}
.pth-lab footer{margin-top:auto;padding-top:4px}.pth-when{font-size:12px;opacity:.75}
@media (max-width:640px){.pth-strip>div.wide{grid-column:auto}.pth-grid,.pth-labs{grid-template-columns:1fr}}`; document.head.appendChild(st); })();
