// ---------------- Places, redrawn ----------------
// The map now has a world under it: Natural Earth's land outline (worldland.js), in the same projection as before,
// also clipped into the Europe inset. City dots are sized by how much film gets made there (hubProd) and coloured by
// what they are to you: home (red, pulsing), cities where you know people (teal), the rest (gold). Selecting a city
// draws the flight from home. The city card leads with numbers you can compare against where you live.
// rings that cross the date line (Fiji, Chukotka) are unwrapped so the coast runs on past the edge instead of streaking across
function pmRings() { if (PM_R) return PM_R; return (PM_R = worldLand().map(r => { let off = 0, prev = null; const U = r.map(([lon, lat]) => { let L = lon + off; if (prev !== null && L - prev > 180) { off -= 360; L -= 360; } else if (prev !== null && L - prev < -180) { off += 360; L += 360; } prev = L; return [L, lat]; });
  const inView = k => U.filter(([L]) => L + k >= -180 && L + k <= 190).length, k = [0, 360, -360].sort((a, b) => inView(b) - inView(a))[0];   // re-centre on whichever turn shows most of it
  return U.map(([L, lat]) => [L + k, lat]); })); }
let PM_R = null;
function pmLand(X, Y) { return pmRings().map(r => 'M' + r.map(([lon, lat]) => `${X(lon).toFixed(1)} ${Y(lat).toFixed(1)}`).join('L') + 'Z').join(''); }
function pmSize(h) { const p = typeof hubProd === 'function' ? hubProd(h, S.year) : 10; return clamp(3 + Math.sqrt(Math.max(0, p)) * .9, 3.2, 10); }
function pmKnown(h) { return aliveKnown().filter(id => P(id) && P(id).hub === h).length; }
placesMapSVG = function () {
  const M = S.me, W = 1000, H = 420, X = lon => (lon + 170) / 350 * W, Y = lat => (68 - lat) / 115 * H, sel = UI.placeSel || M.hub;
  const inEU = h => { const [lon, lat] = HUB_XY[h]; return lon >= EU_BOX.lon0 && lon <= EU_BOX.lon1 && lat >= EU_BOX.lat0 && lat <= EU_BOX.lat1; };
  const I = { x: 8, s: 4.7 }; I.w = (EU_BOX.lon1 - EU_BOX.lon0) * I.s; I.h = (EU_BOX.lat1 - EU_BOX.lat0) * I.s * 1.3; I.y = H - I.h - 6;   // the inset sits in the empty south Pacific, clear of South America
  const IX = lon => I.x + (lon - EU_BOX.lon0) * I.s, IY = lat => I.y + (EU_BOX.lat1 - lat) * I.s * 1.3;
  const grat = []; for (let lon = -150; lon <= 180; lon += 30) grat.push(`M${X(lon)} 0V${H}`); for (let lat = -40; lat <= 60; lat += 20) grat.push(`M0 ${Y(lat)}H${W}`);
  const tip = M.placeTip && S.week - M.placeTip.w < 12 ? M.placeTip.h : null;
  const dot = (h, x, y, k = 1) => { const here = h === M.hub, on = h === sel, kn = pmKnown(h), r = (here ? Math.max(7, pmSize(h)) : pmSize(h)) * k, cls = here ? 'here' : kn ? 'known' : 'other';
    return { r, svg: `<g class="pm-dot ${cls}${on ? ' on' : ''}" data-city="${h}" tabindex="0" role="button" aria-label="${esc(HUBS[h].name)}"><title>${esc(HUBS[h].name)}${kn ? ` · you know ${kn} here` : ''}</title><circle cx="${x}" cy="${y}" r="${r + 7}" fill="transparent"/>${here ? `<circle cx="${x}" cy="${y}" r="${r + 5}" class="pm-halo"/>` : ''}${h === tip ? `<circle cx="${x}" cy="${y}" r="${r + 6}" class="pm-ping"/>` : ''}${on && !here ? `<circle cx="${x}" cy="${y}" r="${r + 4}" class="pm-sel"/>` : ''}<circle cx="${x}" cy="${y}" r="${r}" class="pm-c"/></g>` }; };
  const name = h => HUBS[h].name.split(' and ')[0] + (h === M.hub ? ' (you)' : '');
  const prio = h => (h === M.hub ? 0 : h === sel ? 1 : pmKnown(h) ? 2 : HUBS[h].minor ? 4 : 3);
  const LG = { x: 452, y: H - 16 }, taken = [{ x: I.x - 4, y: I.y - 18, w: I.w + 8, h: I.h + 22 }, { x: LG.x - 6, y: LG.y - 10, w: 345, h: 22 }];
  const world = HUB_IDS.filter(h => HUB_XY[h] && !inEU(h)).map(h => { const [lon, lat] = HUB_XY[h], x = X(lon), y = Y(lat), d = dot(h, x, y); taken.push({ x: x - d.r, y: y - d.r, w: d.r * 2, h: d.r * 2 }); return { h, x, y, r: d.r, svg: d.svg, t: name(h) }; });
  const eu = HUB_IDS.filter(h => HUB_XY[h] && inEU(h));
  const euMain = eu.map(h => { const [lon, lat] = HUB_XY[h]; return dot(h, X(lon), Y(lat), .6).svg; }).join('');
  const euIn = eu.map(h => { const [lon, lat] = HUB_XY[h], x = IX(lon), y = IY(lat), d = dot(h, x, y, .9); return { h, x, y, r: d.r, svg: d.svg, t: name(h) }; });
  const takenI = euIn.map(e => ({ x: e.x - e.r, y: e.y - e.r, w: e.r * 2, h: e.r * 2 }));
  const box = [X(EU_BOX.lon0), Y(EU_BOX.lat1), X(EU_BOX.lon1) - X(EU_BOX.lon0), Y(EU_BOX.lat0) - Y(EU_BOX.lat1)];
  // the flight from home to the selected city
  let arc = ''; if (sel !== M.hub && HUB_XY[sel] && HUB_XY[M.hub]) { const [a, b] = [HUB_XY[M.hub], HUB_XY[sel]], x1 = X(a[0]), y1 = Y(a[1]), x2 = X(b[0]), y2 = Y(b[1]), mx = (x1 + x2) / 2, my = Math.min(y1, y2) - Math.hypot(x2 - x1, y2 - y1) * .22;
    arc = `<path class="pm-arc" d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}"/>`; }
  const legend = `<g class="pm-legend" transform="translate(${LG.x} ${LG.y})"><circle cx="5" cy="0" r="5" class="pm-l here"/><text x="14" y="4">home</text><circle cx="62" cy="0" r="5" class="pm-l known"/><text x="71" y="4">you know people there</text><circle cx="205" cy="0" r="5" class="pm-l other"/><text x="214" y="4">film city · size = how much is made</text></g>`;
  return `<svg class="placemap pm2" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of film cities"><defs><linearGradient id="pmSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="pm-sea0"/><stop offset="1" class="pm-sea1"/></linearGradient><clipPath id="pmClip"><rect width="${W}" height="${H}" rx="12"/></clipPath><clipPath id="pmEuClip"><rect x="${I.x - 4}" y="${I.y - 18}" width="${I.w + 8}" height="${I.h + 22}" rx="6"/></clipPath></defs>
   <g clip-path="url(#pmClip)"><rect width="${W}" height="${H}" class="pm-sea" fill="url(#pmSea)"/><path class="pm-grat" d="${grat.join('')}"/><path class="pm-land" d="${pmLand(X, Y)}"/>
   <rect class="pm-eubox" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="4"/><path class="pm-eulink" d="M${box[0]} ${box[1] + box[3]} L${I.x + I.w} ${I.y}"/>
   <g class="pm-inset"><rect x="${I.x - 4}" y="${I.y - 18}" width="${I.w + 8}" height="${I.h + 22}" rx="6"/><g clip-path="url(#pmEuClip)"><path class="pm-land" d="${pmLand(IX, IY)}"/></g><text x="${I.x + 2}" y="${I.y - 6}" class="pm-cap">EUROPE</text></g>
   ${arc}${euMain}${world.map(w => w.svg).join('')}${euIn.map(e => e.svg).join('')}
   <g class="pm-labels">${placeLabels(world.slice().sort((a, b) => prio(a.h) - prio(b.h)), taken, W, H)}${placeLabels(euIn.slice().sort((a, b) => prio(a.h) - prio(b.h)), takenI, W, H)}</g>${legend}</g></svg>`;
};
// the city card leads with numbers, compared with home
function pmKm(a, b) { const R = Math.PI / 180, [l1, p1] = HUB_XY[a], [l2, p2] = HUB_XY[b], h = Math.sin((p2 - p1) * R / 2) ** 2 + Math.cos(p1 * R) * Math.cos(p2 * R) * Math.sin((l2 - l1) * R / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); }
function pmFlight(a, b) { const sp = S.year < 1958 ? 400 : S.year < 1970 ? 750 : 850; return Math.max(1, Math.round(pmKm(a, b) / sp + 1)); }   // propellers before the jet age
function pmStats(h) {
  const films = S.active.map(i => S.films[i]).filter(f => f && f.hub === h && f.rel === null && f.stage >= 0 && f.stage <= 2).length;
  return { films, known: pmKnown(h), inc: typeof incentiveOf === 'function' ? Math.round(incentiveOf(h) * 100) : 0, prod: Math.round(typeof hubProd === 'function' ? hubProd(h, S.year) : 0), lang: HUBS[h].lang, mkt: HUBS[h].m };
}
{ const _ph = placesHTML; placesHTML = function () {
  const h = _ph(), M = S.me; if (!M) return h; const sel = HUBS[UI.placeSel] ? UI.placeSel : M.hub, A = pmStats(sel), B = pmStats(M.hub), here = sel === M.hub;
  const tile = (l, v, b, fmt = x => x) => `<div class="pc-t"><span>${l}</span><b>${fmt(v)}</b>${!here && b !== undefined && b !== v ? `<i class="${v > b ? 'up' : 'dn'}">${v > b ? '▲' : '▼'} vs home ${fmt(b)}</i>` : ''}</div>`;
  const tiles = `<div class="pc-tiles">${tile('Films in production', A.films, B.films)}${tile('People you know', A.known, B.known)}${tile('Production incentive', A.inc, B.inc, x => x + '%')}${tile('Industry size', A.prod, B.prod)}<div class="pc-t"><span>Market</span><b>${esc(MARKETS[A.mkt].name)}</b>${!here && A.lang !== B.lang ? '<i class="dn">another language</i>' : ''}</div>${!here && HUB_XY[sel] && HUB_XY[M.hub] ? `<div class="pc-t"><span>Flight from home</span><b>${pmFlight(M.hub, sel)}h</b><i>${Math.round(pmKm(M.hub, sel)).toLocaleString()} km</i></div>` : ''}</div>`;
  return h.replace(/(<div class="placecard"><h4>[\s\S]*?<\/h4>)/, `$1${tiles}`).replace('<p class="small muted">Tap a city on the map', '<p class="small muted pc-why">Cities shape a career: what gets made there, who you meet, what the audiences love, how much the state pays productions to come. Tap a city on the map');
}; }
