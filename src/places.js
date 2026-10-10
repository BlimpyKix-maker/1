// ---------------- Places: where you are, where you could be, and why you'd go ----------------
// One clear place to see the world: a map of every film city, what's waiting in each (jobs shooting there, festivals,
// schools, people you know, the genres they love, animals you can only adopt there, what you'd learn faster living
// there), and two buttons: a weekend visit, or moving there for good. Your own city's shortcuts sit on top. Contacts
// in other cities sometimes text to pull you over, and festival trips now actually go to the festival's city.
const HUB_XY = {
  hollywood: [-118.3, 34.1], newyork: [-74, 40.7], toronto: [-79.4, 43.7], mexico: [-99.1, 19.4], london: [-.1, 51.5], paris: [2.35, 48.9], rome: [12.5, 41.9], berlin: [13.4, 52.5], madrid: [-3.7, 40.4],
  hongkong: [114.2, 22.3], taipei: [121.5, 25], tokyo: [139.7, 35.7], seoul: [127, 37.6], beijing: [116.4, 39.9], mumbai: [72.9, 19.1], chennai: [80.3, 13.1], sydney: [151.2, -33.9], wellington: [174.8, -41.3],
  lagos: [3.4, 6.5], cairo: [31.2, 30], rio: [-43.2, -22.9], buenosaires: [-58.4, -34.6], moscow: [37.6, 55.8], stockholm: [18.1, 59.3], copenhagen: [12.6, 55.7], kolkata: [88.4, 22.6], prague: [14.4, 50.1],
  warsaw: [21, 52.2], budapest: [19, 47.5], helsinki: [24.9, 60.2], istanbul: [29, 41], tehran: [51.4, 35.7], dakar: [-17.4, 14.7], manila: [121, 14.6], bangkok: [100.5, 13.8], hochiminh: [106.7, 10.8],
  bogota: [-74.1, 4.7], jakarta: [106.8, -6.2], johannesburg: [28, -26.2]
};
// what living somewhere teaches you faster (+25% on those skills), and the city's pitch
const HUB_EDGE = {
  hollywood: [['pack', 'mkt', 'stag'], 'Studio town: the most jobs, the biggest budgets, and everyone wants to be here.'],
  newyork: [['range', 'dial', 'impro'], 'Independent film and theatre: actors and writers sharpen fastest here.'],
  toronto: [['setm', 'bud', 'speed'], 'Service productions shoot here all year: crews are always in demand.'],
  mexico: [['colour', 'vstory', 'light'], 'Cinematographers the whole world borrows.'],
  london: [['voice', 'range', 'adapt'], 'The stage, the BBC, period drama: the actor\'s city.'],
  paris: [['orig', 'char', 'eye'], 'Auteurs, arthouse money and the world\'s greatest festival nearby.'],
  rome: [['comp', 'light', 'theme'], 'Old studios, great composers, beautiful frames.'],
  berlin: [['orig', 'shape', 'rhythm'], 'Edgy, cheap and full of co-production money.'],
  madrid: [['char', 'tone', 'comic'], 'Melodrama, comedy and directors with a voice.'],
  hongkong: [['stag', 'phys', 'speed'], 'Action and stunts: the fastest crews on earth.'],
  taipei: [['tone', 'pace', 'cont'], 'Patient, poetic filmmaking.'],
  tokyo: [['vstory', 'gcraft', 'cont'], 'Animation, genre and precision.'],
  seoul: [['struc', 'pace', 'shape'], 'Thrillers, dramas and a booming streaming market.'],
  beijing: [['bud', 'fin', 'dist'], 'Scale: the biggest audiences and the biggest budgets in Asia.'],
  mumbai: [['song', 'phys', 'pres'], 'Song, dance and stars: the most films made anywhere.'],
  chennai: [['score', 'stag', 'pres'], 'Mass entertainers and composers with stadium followings.'],
  sydney: [['move', 'phys', 'light'], 'Big foreign shoots and beautiful light.'],
  wellington: [['comp', 'setm', 'stag'], 'Effects houses and epic landscapes.'],
  lagos: [['speed', 'bud', 'impro'], 'Nollywood: fast, cheap and hugely popular.'],
  cairo: [['dial', 'comic', 'song'], 'The Arab world\'s film capital.'],
  rio: [['tone', 'colour', 'comic'], 'Telenovelas, comedies and a hungry new wave.'],
  buenosaires: [['dial', 'struc', 'char'], 'Clever scripts and a fierce independent scene.']
};
const REGION_EDGE = { Europe: [['orig', 'eye'], 'Co-productions and arthouse money.'], Asia: [['speed', 'stag'], 'Fast-growing markets and genre films.'], Africa: [['impro', 'bud'], 'Scrappy, fast and growing.'], 'Latin America': [['colour', 'tone'], 'Telenovelas and a new wave.'] };
function hubEdge(h) { return HUB_EDGE[h] || REGION_EDGE[HUBS[h].region] || [['tas'], 'A film scene of its own.']; }
{ const _gs = growSub; growSub = function (me, k, amt) { if (S.me && me && me.id === S.me.id && amt > 0 && hubEdge(S.me.hub)[0].includes(k)) amt *= 1.25; return _gs(me, k, amt); }; }
function festHub(F) { return (typeof FEST_INFO !== 'undefined' && FEST_INFO[F.k] && FEST_INFO[F.k].hub) || F.hub || null; }
// festival trips go to the festival's city
{ const _ta = tripsAvailable; tripsAvailable = function () { const L = _ta(); for (const x of L) if (x.fest && !x.hub) { const F = FESTIVALS.find(f => 'f:' + f.k === x.k); if (F) x.fh = festHub(F); } if (PLACE_TRIP && !L.some(x => x.k === 'h:' + PLACE_TRIP)) L.push({ k: 'h:' + PLACE_TRIP, label: `A weekend in ${hubName(PLACE_TRIP)}`, d: '', cost: HUBS[PLACE_TRIP].lang === HUBS[S.me.hub].lang ? 450 : 1100, hub: PLACE_TRIP }); return L; }; }
let PLACE_TRIP = null;
{ const _bt = bookTrip; bookTrip = function (a) { PLACE_TRIP = a.any && HUBS[a.any] ? a.any : null; try { return _bt(a); } finally { PLACE_TRIP = null; } }; }
function moveFee(h) { return usd(HUBS[h].lang === HUBS[S.me.hub].lang ? 1500 : 4000); }
function placeAct(a) {
  const M = S.me; if (a.k !== 'relocate' || !HUBS[a.hub] || a.hub === M.hub || M.cash < moveFee(a.hub)) return false;
  M.cash -= moveFee(a.hub); relocate(a.hub, 'by choice'); for (const p of (M.pets || [])) if (!p.gone) p.hub = a.hub; UI.placeSel = a.hub; return true;
}
// why go: everything waiting in a city
function placeReasons(h) {
  const M = S.me, me = ME(), out = [];
  const shooting = S.active.map(i => S.films[i]).filter(f => f && f.hub === h && f.stage >= 0 && f.stage <= 2).length;
  const jobs = M.board.filter(p => p.away === h || (h === M.hub && !p.away && p.film !== null && p.film !== undefined)).length;
  out.push(['🎬', `${shooting} film${shooting === 1 ? '' : 's'} in production${jobs ? `, ${jobs} job${jobs === 1 ? '' : 's'} on your board` : ''}`]);
  const mo = dateOf(S.week).getUTCMonth(), F = (typeof FESTIVALS !== 'undefined' ? FESTIVALS : []).filter(f => festHub(f) === h);
  if (F.length) out.push(['🎪', F.map(f => `${f.name.replace(/^the /, '')} (${MON[f.month]}${f.month === mo || f.month === (mo + 1) % 12 ? ', coming up' : ''})`).join(' · ')]);
  const sch = (typeof SCHOOLS !== 'undefined' ? SCHOOLS : []).filter(s => s[2] === h);
  if (sch.length) out.push(['🎓', `${sch.length} film school${sch.length > 1 ? 's' : ''}: ${sch.slice(0, 2).map(s => s[1]).join(', ')}${sch.length > 2 ? '…' : ''}`]);
  const ppl = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead && P(id).hub === h);
  if (ppl.length) out.push(['🤝', `${ppl.length} people you know: ${ppl.sort((a, b) => opinion(b) - opinion(a)).slice(0, 3).map(id => pl(id)).join(', ')}${ppl.length > 3 ? '…' : ''}`]);
  const bias = Object.entries(HUBS[h].bias || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0].toLowerCase());
  if (bias.length) out.push(['❤️', `Loves ${bias.join(', ')}`]);
  const E = hubEdge(h); out.push(['📈', `Living here: ${E[0].map(k => SUB_LABEL(k)).join(', ')} improve 25% faster`]);
  if (typeof PET_KINDS !== 'undefined') { const pets = PET_KINDS.filter(x => x.hubs && x.hubs.includes(h)); if (pets.length) out.push(['🐾', `Only here: ${pets.map(x => x.n.toLowerCase()).join(', ')}`]); }
  if (HUBS[h].lang !== HUBS[M.hub].lang) out.push(['🗣️', 'Different language: jobs pay 15% more, but it\'s a fresh start']);
  return out;
}
function SUB_LABEL(k) { for (const c in CRAFTS) if (CRAFTS[c].subs[k]) return CRAFTS[c].subs[k].toLowerCase(); return k; }
// labels never collide: each one tries right, left, above, below, and is dropped (hover still names it) if none fit
function placeLabels(items, taken, W, H) {
  const out = [], hit = (b) => taken.some(t => b.x < t.x + t.w && b.x + b.w > t.x && b.y < t.y + t.h && b.y + b.h > t.y) || b.x < 2 || b.y < 2 || b.x + b.w > W - 2 || b.y + b.h > H - 2;
  for (const it of items) {
    const w = it.t.length * 6 + 4, h = 12, r = it.r;
    const tries = [[it.x + r + 3, it.y - 6.5, 'start'], [it.x - r - 3 - w, it.y - 6.5, 'end'], [it.x - w / 2, it.y - r - 15, 'middle'], [it.x - w / 2, it.y + r + 2, 'middle'], [it.x + r, it.y - r - 12, 'start'], [it.x + r, it.y + r, 'start'], [it.x - r - w, it.y - r - 12, 'end'], [it.x - r - w, it.y + r, 'end']];
    for (const [bx, by, a] of tries) { const b = { x: bx, y: by, w, h }; if (hit(b)) continue; taken.push(b);
      const tx = a === 'start' ? bx + 1 : a === 'end' ? bx + w - 1 : bx + w / 2; out.push(`<text x="${tx.toFixed(1)}" y="${(by + 10).toFixed(1)}" text-anchor="${a}"${it.cls ? ` class="${it.cls}"` : ''}>${esc(it.t)}</text>`); break; }
  }
  return out.join('');
}
const EU_BOX = { lon0: -11, lon1: 41, lat0: 35, lat1: 63 };
function placesMapSVG() {
  const M = S.me, W = 1000, H = 420, X = lon => (lon + 170) / 350 * W, Y = lat => (68 - lat) / 115 * H, sel = UI.placeSel || M.hub;
  const inEU = h => { const [lon, lat] = HUB_XY[h]; return lon >= EU_BOX.lon0 && lon <= EU_BOX.lon1 && lat >= EU_BOX.lat0 && lat <= EU_BOX.lat1; };
  // the Europe inset, in the empty Pacific corner
  const I = { x: 14, y: 196, s: 5.4 }; I.w = (EU_BOX.lon1 - EU_BOX.lon0) * I.s; I.h = (EU_BOX.lat1 - EU_BOX.lat0) * I.s * 1.3;
  const IX = lon => I.x + (lon - EU_BOX.lon0) * I.s, IY = lat => I.y + (EU_BOX.lat1 - lat) * I.s * 1.3;
  const grid = [];
  for (let lon = -150; lon <= 180; lon += 30) grid.push(`<line x1="${X(lon)}" y1="0" x2="${X(lon)}" y2="${H}"/>`);
  for (let lat = -40; lat <= 60; lat += 20) grid.push(`<line x1="0" y1="${Y(lat)}" x2="${W}" y2="${Y(lat)}"/>`);
  const tip = M.placeTip && S.week - M.placeTip.w < 12 ? M.placeTip.h : null;
  const dot = (h, x, y, big) => { const here = h === M.hub, on = h === sel, minor = HUBS[h].minor, r = (here ? 8 : minor ? 4 : 5.5) * (big ? 1 : 1);
    return { r, svg: `<g class="pm-dot${here ? ' here' : ''}${on ? ' on' : ''}" data-city="${h}" tabindex="0" role="button" aria-label="${esc(HUBS[h].name)}"><title>${esc(HUBS[h].name)}</title><circle cx="${x}" cy="${y}" r="${r + 7}" fill="transparent"/>${h === tip ? `<circle cx="${x}" cy="${y}" r="${r + 6}" class="pm-ping"/>` : ''}<circle cx="${x}" cy="${y}" r="${r}"/></g>` }; };
  const name = h => HUBS[h].name.split(' and ')[0] + (h === M.hub ? ' (you)' : '');
  const prio = h => (h === M.hub ? 0 : h === sel ? 1 : HUBS[h].minor ? 3 : 2);
  const taken = [{ x: I.x - 4, y: I.y - 18, w: I.w + 8, h: I.h + 22 }];
  const world = HUB_IDS.filter(h => HUB_XY[h] && !inEU(h)).map(h => { const [lon, lat] = HUB_XY[h], x = X(lon), y = Y(lat), d = dot(h, x, y); taken.push({ x: x - d.r, y: y - d.r, w: d.r * 2, h: d.r * 2 }); return { h, x, y, r: d.r, svg: d.svg, t: name(h) }; });
  const eu = HUB_IDS.filter(h => HUB_XY[h] && inEU(h));
  const euMain = eu.map(h => { const [lon, lat] = HUB_XY[h]; return dot(h, X(lon), Y(lat)).svg; }).join('');
  const euIn = eu.map(h => { const [lon, lat] = HUB_XY[h], x = IX(lon), y = IY(lat), d = dot(h, x, y, true); return { h, x, y, r: d.r, svg: d.svg, t: name(h) }; });
  const takenI = euIn.map(e => ({ x: e.x - e.r, y: e.y - e.r, w: e.r * 2, h: e.r * 2 }));
  const box = [X(EU_BOX.lon0), Y(EU_BOX.lat1), X(EU_BOX.lon1) - X(EU_BOX.lon0), Y(EU_BOX.lat0) - Y(EU_BOX.lat1)];
  return `<svg class="placemap" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of film cities"><rect width="${W}" height="${H}" rx="12" class="pm-sea"/><g class="pm-grid">${grid.join('')}</g>
   <rect class="pm-eubox" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="4"/><path class="pm-eulink" d="M${box[0]} ${box[1] + box[3]} L${I.x + I.w} ${I.y}"/>
   <g class="pm-inset"><rect x="${I.x - 4}" y="${I.y - 18}" width="${I.w + 8}" height="${I.h + 22}" rx="6"/><text x="${I.x + 2}" y="${I.y - 6}" class="pm-cap">EUROPE</text></g>
   ${euMain}${world.map(w => w.svg).join('')}${euIn.map(e => e.svg).join('')}
   <g class="pm-labels">${placeLabels(world.slice().sort((a, b) => prio(a.h) - prio(b.h)), taken, W, H)}${placeLabels(euIn.slice().sort((a, b) => prio(a.h) - prio(b.h)), takenI, W, H)}</g></svg>`;
}

function placesHTML() {
  const M = S.me; if (!M) return ''; const sel = HUBS[UI.placeSel] ? UI.placeSel : M.hub, here = sel === M.hub, wx = typeof wxDay === 'function' ? wxDay(sel, S.week, 2) : null;
  const R = placeReasons(sel), fee = moveFee(sel), trip = HUBS[sel].lang === HUBS[M.hub].lang ? 450 : 1100;
  const byRegion = {}; for (const h of HUB_IDS) (byRegion[HUBS[h].region] = byRegion[HUBS[h].region] || []).push(h);
  return `<section class="panel places"><h3>🗺️ Where you are: ${esc(HUBS[M.hub].name)}</h3>
   <div class="placego"><button class="btn small" data-app="week">🌙 Plan your evenings and weekend</button><button class="btn small" data-app="life">🏠 Find a new place in town</button><button class="btn small" data-app="work">🧰 Jobs here</button>${(M.pets || []).some(p => !p.gone) ? '<button class="btn small" data-app="pets">🐾 Your pets</button>' : ''}</div>
   <p class="small muted">Tap a city on the map to see what's waiting there: films shooting, festivals, schools, people you know, and what living there would teach you. Visit for a weekend, or move.</p>
   ${placesMapSVG()}
   <div class="placecard"><h4>${esc(HUBS[sel].name)} ${here ? '<span class="chip small">you live here</span>' : ''} ${wx ? `<span class="small muted">· ${wx.hi}°, ${esc(wx.k)}</span>` : ''}</h4>
    <p class="small"><i>${esc(hubEdge(sel)[1])}</i></p>
    <ul class="plain reasons">${R.map(([i, t]) => `<li>${i} ${t}</li>`).join('')}</ul>
    ${here ? '' : `<p><button class="btn" data-placetrip="${sel}" ${M.cash < usd(trip) ? 'disabled' : ''}>✈️ A weekend there (${fmtCash(usd(trip))})</button> ${UI.placeConfirm === sel ? `<button class="btn primary" data-placemove="${sel}" ${M.cash < fee ? 'disabled' : ''}>Yes, move to ${esc(HUBS[sel].name)} (${fmtCash(fee)})</button> <button class="btn ghost" data-placecancel="1">Not yet</button>` : `<button class="btn" data-placeask="${sel}">📦 Move there for good…</button>`}</p>
    <p class="small muted">A weekend visit takes Saturday and Sunday: you meet people there and see how they work. Moving takes your pets with you; your job board, contacts nearby and home all change.</p>`}</div>
   <details class="small"><summary>All cities, by region</summary>${Object.entries(byRegion).map(([r, L]) => `<p><b>${esc(r)}:</b> ${L.map(h => `<a href="#" class="lk" data-city="${h}">${esc(HUBS[h].name)}</a>`).join(', ')}</p>`).join('')}</details></section>`;
}
function placesClick(t) {
  const d = t.dataset;
  if (d.city) { UI.placeSel = d.city; UI.placeConfirm = null; UI.app = 'places'; render(true); return true; }
  if (d.placeask) { UI.placeConfirm = d.placeask; render(true); return true; }
  if (d.placecancel) { UI.placeConfirm = null; render(true); return true; }
  if (d.placemove) { UI.placeConfirm = null; doAct({ t: 'place2', k: 'relocate', hub: d.placemove }); render(true); return true; }
  if (d.placetrip) { const ok = doAct({ t: 'trip', k: 'h:' + d.placetrip, any: d.placetrip }); if (!ok) inbox('note', 'Couldn\'t book it', 'Your weekend is already full, or the money isn\'t there. Free up a weekend in Plan the week.'); render(true); return true; }
  return false;
}
// reasons arrive by themselves: someone elsewhere pulls you over
function placesWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done || prnd() > .04) return;
  const far = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead && P(id).hub !== M.hub && opinion(id) > 10);
  if (!far.length) return; const id = far[Math.floor(prnd() * far.length)], h = P(id).hub;
  const n = S.active.map(i => S.films[i]).filter(f => f && f.hub === h && f.stage >= 0 && f.stage <= 2).length;
  M.placeTip = { h, w: S.week };
  sms(id, pickLine([`you should come out to ${hubName(h)}. ${n} films shooting right now and nobody can find crew`, `${hubName(h)} misses you. well, I do. come for a weekend?`, `seriously think about ${hubName(h)}. the work here is different. better, maybe`], id + S.week), 'tip');
}
OS_EXTRA.places = ['🗺️', 'Places', 'A map of every film city: what\'s waiting in each, weekend trips, and moving'];
OS_VIEWS.places = () => placesHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Today'); if (g && !g[1].includes('places')) g[1].push('places'); }
