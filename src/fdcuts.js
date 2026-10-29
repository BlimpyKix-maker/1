// ================= The Cutting Rooms, rebuilt (Round 27) =================
// The list used to be the ten biggest films in post, so it was always the same wall of tentpoles. Now it shows the
// whole range in the player's market, from studio tentpoles to micro-budget indies, a few of each, soonest first, with
// filter chips. Each film shows who made it, where it is in post (assembly, director's cut, studio notes, picture lock,
// sound and effects), how many test screenings it has had, the leaked top-two-box score, its tracking and whether it
// is an original or a sequel. A key explains every column. Display only.
const FDC_BANDS = [['tent', 'Tentpoles', 100, 1e9, 'Studio event films, $100M and up. A test score under 70% means reshoots.'], ['studio', 'Studio films', 30, 100, 'Mid-range studio releases: comedies, thrillers, dramas with stars.'], ['mid', 'Mid-budget', 8, 30, 'The squeezed middle: specialty labels and mini-majors.'], ['indie', 'Independent', 1.5, 8, 'Independents: one test screening if they can afford it.'], ['micro', 'Micro-budget', 0, 1.5, 'Shot for almost nothing; festivals decide their fate.']];
function fdcBand(f) { const b = f.budget || 0; return FDC_BANDS.find(x => b >= x[2] && b < x[3]) || FDC_BANDS[4]; }
function fdcPost(f) {
  const left = Math.max(0, f.stageEnd - S.week), tot = Math.max(4, Math.round(8 + (f.budget || 0) / 12)), done = 1 - Math.min(1, left / tot);
  return done < .2 ? ['Assembly', 'Every usable take strung together; three hours long.'] : done < .45 ? ["Director's cut", 'The director\'s ten weeks with the editor.'] : done < .65 ? ['Studio notes', 'Executives and test audiences weigh in.'] : done < .85 ? ['Picture lock', 'No more changes to the edit.'] : ['Sound & effects', 'Mix, score, colour and the last effects shots.'];
}
function fdcRow(f) {
  const leak = gH(f.id, 'leak') < .5, t2b = leak ? Math.round(clamp(fdProxyQ(f) * .85 + 12 + (gH(f.id, 'leak2') - .5) * 18, 20, 95)) : null, re = leak && t2b < 55 && gH(f.id, 'reshoot') < .6;
  const B = fdcBand(f), post = fdcPost(f), tests = B[0] === 'micro' ? 0 : Math.min(4, Math.floor(gH(f.id, 'tests') * ({ tent: 5, studio: 4, mid: 3, indie: 2 }[B[0]] || 1))), track = Math.round(clamp((f.hook || 50) * .6 + (B[0] === 'tent' ? 25 : B[0] === 'studio' ? 12 : 0) + (gH(f.id, 'trk') - .5) * 14, 3, 95));
  const d = P(f.dir), lead = f.cast && P(f.cast[0]), seq = f.seq !== undefined ? '<span class="fdc-tag seq">Sequel</span>' : f.src && /novel|book|play|comic|remake/i.test(f.src) ? `<span class="fdc-tag ad">${esc(String(f.src).split(/[ :]/)[0])}</span>` : '<span class="fdc-tag og">Original</span>';
  const co = f.co !== null && f.co !== undefined && S.companies[f.co] ? S.companies[f.co].name : 'Independent';
  return `<tr><td>${fl(f.id)} ${seq}<br><span class="tk-mut small">${esc(f.genre)} · ${esc(co)}</span></td><td class="small">${d ? pl(d.id) : '—'}${lead ? `<br><span class="tk-mut">with ${pl(lead.id)}</span>` : ''}</td><td class="n">${fmtM(f.budget)}<br><span class="tk-mut small">${esc(B[1])}</span></td>
   <td><span class="fdc-post" title="${esc(post[1])}">${esc(post[0])}</span><br><span class="tk-mut small">opens in ${Math.max(0, f.stageEnd - S.week)} wk</span></td><td class="n">${tests || '—'}</td>
   <td class="n ${t2b === null ? 'tk-mut' : t2b >= 70 ? 'up' : t2b < 55 ? 'dn' : ''}">${t2b === null ? 'no leak' : t2b + '%'}</td><td class="n"><span class="fdc-trk"><i style="width:${track}%"></i></span> ${track}%</td>
   <td class="tk-mut small">${re ? 'reshoot rumoured' : t2b !== null && t2b >= 80 ? 'studio thrilled' : t2b !== null && t2b < 60 ? 'quietly worried' : B[0] === 'micro' ? 'hoping for a festival' : ''}</td></tr>`;
}
fdWorldCuts = function () {
  const m = HUBS[S.me.hub].m, all = S.active.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3 && f.m === m), band = UI.fdcb || '';
  const by = {}; for (const f of all) (by[fdcBand(f)[0]] = by[fdcBand(f)[0]] || []).push(f);
  for (const k in by) by[k].sort((a, b) => a.stageEnd - b.stageEnd || b.budget - a.budget);
  const L = band ? (by[band] || []).slice(0, 14) : FDC_BANDS.flatMap(B => (by[B[0]] || []).slice(0, 3));
  const chips = `<p class="fdc-chips"><button class="tk-chip${!band ? ' on' : ''}" data-fdcb="">A mix (${all.length})</button>${FDC_BANDS.map(B => `<button class="tk-chip${band === B[0] ? ' on' : ''}" data-fdcb="${B[0]}" title="${esc(B[4])}">${esc(B[1])} (${(by[B[0]] || []).length})</button>`).join('')}</p>`;
  const seqN = all.filter(f => f.seq !== undefined).length;
  return `<section class="tk-p tk-wide"><h4>THE CUTTING ROOMS <span class="tk-sub">every film in post-production in ${esc(MARKETS[m].name)} · leaked test scores, unconfirmed</span></h4>
   <p class="tk-foot">${all.length} films in post: ${FDC_BANDS.map(B => `${(by[B[0]] || []).length} ${B[1].toLowerCase()}`).join(', ')}. ${seqN} sequel${seqN === 1 ? '' : 's'}.</p>${chips}
   <table class="tk-t fdc-t"><thead><tr><th>Film</th><th>Made by</th><th class="n">Budget</th><th>In post</th><th class="n" title="Test screenings held so far">Tests</th><th class="n" title="Share of a test audience rating it excellent or very good">Top-two-box</th><th class="n" title="Share of cinema-goers who know it's coming and want to see it">Tracking</th><th>Word</th></tr></thead><tbody>${L.map(fdcRow).join('') || '<tr><td colspan="8" class="tk-mut">Nobody is in post right now.</td></tr>'}</tbody></table>
   <details class="fdc-key"><summary>How to read this</summary><ul class="small">
    <li><b>In post</b>: assembly (every take strung together) → director's cut → studio notes (executives and test audiences) → picture lock (no more edits) → sound and effects (mix, score, colour).</li>
    <li><b>Tests</b>: recruited-audience screenings. Big films hold several; most independents hold one or none.</li>
    <li><b>Top-two-box</b>: the share of a test audience rating the film "excellent" or "very good". Studios want 70%; under 55% usually means recuts or reshoots.</li>
    <li><b>Tracking</b>: pre-release surveys of how many cinema-goers know about the film and want to see it. It predicts the opening weekend, not whether the film is good.</li>
    <li><b>Word</b>: what people who were in the room are saying. Leaks are rumours: about half of films leak at all.</li></ul></details></section>`;
};
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') document.addEventListener('click', e => { const t = e.target && e.target.closest ? e.target.closest('[data-fdcb]') : null; if (!t) return; e.preventDefault(); e.stopPropagation(); UI.fdcb = t.dataset.fdcb || ''; render(true); }, true);
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.fdc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.fdc-chips .tk-chip.on{background:var(--accent,#c84);color:#fff;border-color:transparent}
.fdc-t td{vertical-align:top}.fdc-tag{font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:1px 5px;border-radius:4px;margin-left:4px}
.fdc-tag.seq{background:#f1d5d5;color:#8a1c1c}.fdc-tag.og{background:#d8efe0;color:#1f6b3a}.fdc-tag.ad{background:#e2e3f7;color:#3a3f9a}
.fdc-post{display:inline-block;font-size:11.5px;padding:1px 7px;border-radius:9px;background:color-mix(in srgb,var(--accent,#c84) 15%,transparent);cursor:help}
.fdc-trk{display:inline-block;width:46px;height:6px;border-radius:3px;background:color-mix(in srgb,currentColor 15%,transparent);vertical-align:middle;overflow:hidden}.fdc-trk i{display:block;height:100%;background:var(--accent,#c84)}
.fdc-key{margin-top:8px}.fdc-key summary{cursor:pointer;font-weight:600;font-size:12.5px}.fdc-key ul{margin:6px 0 0;padding-left:18px}`; document.head.appendChild(st); })();
