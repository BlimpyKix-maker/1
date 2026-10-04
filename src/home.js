// ---------------- Home ----------------
// Where the player lives, drawn as a room that fills up with what they buy. Each piece has a spot on the wall or
// the floor; the game arranges them unless the player places them, or asks for a random shuffle. Some pieces help:
// a proper bed means better rest, a writing desk more pages, posters of favourite films a little taste each week.
const FURNITURE = {
  bed: { name: 'Proper bed', price: 600, kind: 'floor', fx: { energy: 4 }, d: 'Sleep that counts. +4 energy every week.' },
  desk: { name: 'Writing desk', price: 350, kind: 'floor', fx: { pages: 2 }, d: 'Somewhere to write. +2 pages every writing day.' },
  coffee: { name: 'Espresso machine', price: 280, kind: 'floor', fx: { energy: 3, stress: 1 }, d: '+3 energy a week, and a little more stress.' },
  records: { name: 'Record player', price: 220, kind: 'floor', fx: { stress: -2 }, d: 'Something to come home to. −2 stress a week.' },
  shelf: { name: 'Shelf of screenplays', price: 300, kind: 'floor', fx: { grow: { struc: .006, dial: .006 } }, d: 'Read the greats. Structure and dialogue creep up every week.' },
  camera: { name: 'Second-hand camera rig', price: 1200, kind: 'floor', fx: { grow: { comp: .008, light: .006 }, train: 'cam' }, d: 'Shoot anything, anywhere. Framing and lighting creep up; camera classes go further.' },
  lamp: { name: 'Old arc lamp', price: 150, kind: 'floor', fx: { stress: -1 }, d: 'Bought off a studio clear-out. Pure atmosphere: −1 stress a week.' },
  plant: { name: 'Pothos in a pot', price: 25, kind: 'small', fx: { stress: -1 }, d: 'Hard to kill. −1 stress a week.' },
  poster: { name: 'Poster of a favourite film', price: 40, kind: 'wall', fx: { grow: { tas: .02 } }, d: 'A reminder of why you came. Taste creeps up every week.' },
  board: { name: 'Mood board', price: 60, kind: 'wall', fx: { grow: { vis: .02 } }, d: 'Pictures, colours, a plan. Vision creeps up every week.' },
  print: { name: 'Framed festival print', price: 180, kind: 'wall', fx: { standing: .05 }, d: 'Visitors notice. A sliver of standing every week.' }
};
// Spots by place. Couch-surfing leaves you a corner of somebody else's room.
const HOME_SPOTS = {
  couch: [{ id: 'sill', kind: 'small', x: 330, y: 112 }],
  shared: [{ id: 'wallL', kind: 'wall', x: 32, y: 26 }, { id: 'floorL', kind: 'floor', x: 18, y: 168 }, { id: 'sill', kind: 'small', x: 214, y: 94 }, { id: 'floorR', kind: 'floor', x: 300, y: 168 }, { id: 'wallR', kind: 'wall', x: 318, y: 26 }],
  own: [{ id: 'wallL', kind: 'wall', x: 22, y: 24 }, { id: 'wallL2', kind: 'wall', x: 88, y: 30 }, { id: 'floorL', kind: 'floor', x: 12, y: 168 }, { id: 'corner', kind: 'floor', x: 112, y: 168 }, { id: 'sill', kind: 'small', x: 214, y: 94 }, { id: 'floorC', kind: 'floor', x: 256, y: 168 }, { id: 'floorR', kind: 'floor', x: 330, y: 168 }, { id: 'wallR', kind: 'wall', x: 316, y: 24 }]
};
const fits = (kind, spot) => kind === spot || (kind === 'small' && spot === 'floor');
// Where everything goes this week: the player's own placements first, the rest wherever there's room.
function homeLayout() {
  const M = S.me, H = M.home, spots = HOME_SPOTS[M.life] || [], out = {}, used = new Set();
  for (const id of H.items) { const sp = H.layout[id]; if (sp && !used.has(sp) && spots.some(s => s.id === sp && fits(FURNITURE[id].kind, s.kind))) { out[id] = sp; used.add(sp); } }
  for (const id of H.items) { if (out[id]) continue; const s = spots.find(s => !used.has(s.id) && fits(FURNITURE[id].kind, s.kind)); if (s) { out[id] = s.id; used.add(s.id); } }
  return out;
}
// Furniture only helps when it's in the room, not in a box under the couch.
function homeFx() {
  const out = { energy: 0, stress: 0, pages: 0, standing: 0, grow: {}, train: [] };
  if (!S.me || !S.me.home) return out;
  for (const id of Object.keys(homeLayout())) {
    const f = FURNITURE[id].fx;
    for (const k of ['energy', 'stress', 'pages', 'standing']) out[k] += f[k] || 0;
    for (const k in f.grow || {}) out.grow[k] = (out.grow[k] || 0) + f.grow[k];
    if (f.train) out.train.push(f.train);
  }
  if (typeof kitFx === 'function') kitFx(out);
  return out;
}
function homeSkyline(hub, w, h) {
  const r = hashRand([...hub].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0);
  let x = 0, o = '';
  while (x < w) { const bw = 6 + r() * 12, bh = 12 + r() * (h - 18); o += `<rect x="${x.toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="var(--hs-city)"/>`; if (r() < .5) o += `<rect x="${(x + bw / 3).toFixed(1)}" y="${(h - bh + 4).toFixed(1)}" width="2" height="2" fill="var(--hs-lit)"/>`; x += bw + 1; }
  return o;
}
function furnitureSVG(id, x, y) {
  const M = S.me;
  switch (id) {
    case 'bed': return `<g transform="translate(${x} ${y})"><rect x="0" y="-26" width="96" height="18" rx="3" fill="#FFFFFF"/><rect x="0" y="-12" width="96" height="12" rx="2" fill="var(--data)"/><rect x="4" y="-34" width="26" height="12" rx="4" fill="#F3EFF8"/><rect x="0" y="-40" width="6" height="40" fill="#6B4E3A"/><rect x="92" y="-28" width="5" height="28" fill="#6B4E3A"/></g>`;
    case 'desk': return `<g transform="translate(${x} ${y})"><rect x="0" y="-34" width="64" height="5" fill="#8A6A4A"/><rect x="2" y="-29" width="4" height="29" fill="#6B4E3A"/><rect x="58" y="-29" width="4" height="29" fill="#6B4E3A"/><rect x="20" y="-46" width="22" height="12" rx="1" fill="#2B2B2B"/><rect x="22" y="-44" width="18" height="8" fill="#E9E0F5"/><path d="M8 -36 l10 0 l-2 -5 l-6 0 z" fill="#FFFFFF"/></g>`;
    case 'coffee': return `<g transform="translate(${x} ${y})"><rect x="0" y="-22" width="34" height="22" fill="#8A6A4A"/><rect x="6" y="-40" width="20" height="18" rx="2" fill="#B9B5AE"/><rect x="10" y="-30" width="6" height="6" fill="#2B2B2B"/><circle cx="23" cy="-26" r="2" fill="var(--accent)"/></g>`;
    case 'records': return `<g transform="translate(${x} ${y})"><rect x="0" y="-26" width="44" height="26" fill="#6B4E3A"/><rect x="2" y="-34" width="40" height="8" fill="#3B3226"/><circle cx="20" cy="-30" r="9" fill="#141413"/><circle cx="20" cy="-30" r="3" fill="var(--accent)"/></g>`;
    case 'shelf': return `<g transform="translate(${x} ${y})"><rect x="0" y="-74" width="46" height="74" fill="#8A6A4A"/>${[0, 1, 2, 3].map(i => `<rect x="2" y="${-72 + i * 18}" width="42" height="2" fill="#6B4E3A"/>` + [0, 1, 2, 3, 4, 5].map(j => `<rect x="${4 + j * 6.5}" y="${-70 + i * 18}" width="5" height="15" fill="${['var(--data)', '#FFFFFF', 'var(--accent)', '#E3C27A', '#B9B5AE', '#2E5A3A'][(i + j) % 6]}"/>`).join('')).join('')}</g>`;
    case 'camera': return `<g transform="translate(${x} ${y})"><path d="M22 -36 L6 0 M22 -36 L38 0 M22 -36 L22 0" stroke="#2B2B2B" stroke-width="2"/><rect x="8" y="-52" width="30" height="16" rx="2" fill="#2B2B2B"/><circle cx="40" cy="-44" r="6" fill="#3B3B3B" stroke="#B9B5AE"/><circle cx="16" cy="-58" r="6" fill="none" stroke="#2B2B2B" stroke-width="2"/><circle cx="30" cy="-58" r="6" fill="none" stroke="#2B2B2B" stroke-width="2"/></g>`;
    case 'lamp': return `<g transform="translate(${x} ${y})"><path d="M16 0 L16 -60" stroke="#3B3B3B" stroke-width="3"/><path d="M4 0 L28 0" stroke="#3B3B3B" stroke-width="3"/><rect x="2" y="-80" width="28" height="22" rx="3" fill="#3B3B3B"/><ellipse cx="16" cy="-58" rx="12" ry="3" fill="#FFE9A8"/><path d="M4 -56 L-20 0 L52 0 L28 -56 Z" fill="#FFE9A8" opacity=".18"/></g>`;
    case 'plant': return `<g transform="translate(${x} ${y})"><rect x="0" y="-10" width="16" height="10" fill="var(--accent)"/><path d="M8 -10 Q-4 -22 -6 -14 M8 -10 Q20 -24 24 -16 M8 -10 Q8 -28 4 -30 M8 -10 Q14 -20 18 -6" stroke="#2E7A4C" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
    case 'poster': { const f = M.favs && M.favs.length ? (S.cat.allFilms[M.favs[0]] || null) : null, t = f ? f.t : 'Cinema';
      return `<g transform="translate(${x} ${y})"><rect width="44" height="62" fill="var(--data)"/><rect x="3" y="3" width="38" height="40" fill="#FFFFFF" opacity=".9"/><circle cx="22" cy="23" r="10" fill="var(--accent)"/><text x="22" y="54" font-size="5.5" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="700">${esc(t.length > 16 ? t.slice(0, 15) + '…' : t).toUpperCase()}</text></g>`; }
    case 'board': return `<g transform="translate(${x} ${y})"><rect width="58" height="44" fill="#C9A87A"/>${[[4, 4, '#FFFFFF'], [22, 6, 'var(--accent)'], [40, 4, '#E9E0F5'], [6, 24, 'var(--data)'], [26, 24, '#E3C27A'], [42, 24, '#FFFFFF']].map(([a, b, c]) => `<rect x="${a}" y="${b}" width="13" height="15" fill="${c}"/><circle cx="${a + 6}" cy="${b + 1}" r="1.2" fill="#C8102E"/>`).join('')}</g>`;
    case 'print': return `<g transform="translate(${x} ${y})"><rect width="48" height="58" fill="#3B3226"/><rect x="4" y="4" width="40" height="50" fill="#F3EFF8"/><path d="M24 14 l3 7 l7 0 l-6 4 l2 7 l-6 -4 l-6 4 l2 -7 l-6 -4 l7 0 z" fill="var(--accent)"/><text x="24" y="46" font-size="5" text-anchor="middle" fill="#1F1430" font-family="sans-serif">OFFICIAL SELECTION</text></g>`;
  }
  return typeof furnitureSVG2 === 'function' ? furnitureSVG2(id, x, y) : '';
}
// The scene. day: 0–5 for the light through the window.
function homeSceneSVG(day) {
  const M = S.me, me = ME(), life = M.life, lay = homeLayout(), spots = HOME_SPOTS[life] || [];
  const sky = ['#BFD8F2', '#CFE3F5', '#F7D9B5', '#F5C49A', '#E8A36B', '#1E2A44'][clamp(day ?? 0, 0, 5)];
  let wall = { couch: '#E6DCCB', shared: '#EDE4D3', studio: '#EFE8DA', own: '#F6F0E4', loft: '#D9D2C6', house: '#F3EBDD' }[life] || '#EDE4D3', floor = { couch: '#B59A7A', shared: '#A8865F', studio: '#9C7A55', own: '#8E6B4A', loft: '#6F6A63', house: '#8A6440' }[life] || '#A8865F';
  const RS = (M.home && M.home.style) || {};
  if (RS.paint) wall = ROOM_STYLE.paint.opts[RS.paint];
  if (RS.floor) floor = ['', '#C9A36A', '#5A3A22', '#EDEDED', '#D8CFC2', '#3E6B4A', '#D98FA8'][RS.floor] || floor;
  const night = (day ?? 0) >= 5, wd = mixHex(wall, '#000000', .08);
  const o = [`<defs><linearGradient id="hs-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(wall, '#FFFFFF', .2)}"/><stop offset="1" stop-color="${wall}"/></linearGradient><linearGradient id="hs-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(floor, '#000000', .12)}"/><stop offset="1" stop-color="${mixHex(floor, '#FFFFFF', .08)}"/></linearGradient></defs><rect width="400" height="180" fill="url(#hs-w)"/>`];
  // the walls say where you live: peeling paint, stripes, brick, wallpaper
  if (life === 'couch') o.push(Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 55} ${20 + (i % 3) * 25} q6 -4 12 0 q-4 6 -12 0" fill="${wd}" opacity=".7"/>`).join(''));
  else if (life === 'own') o.push(Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" y="0" width="9" height="128" fill="${wd}" opacity=".35"/>`).join(''));
  else if (life === 'loft') o.push(Array.from({ length: 13 }, (_, r) => Array.from({ length: 14 }, (_, c) => `<rect x="${c * 30 + (r % 2) * 15 - 15}" y="${r * 10}" width="28" height="8" rx="1" fill="#A65E46" opacity="${.18 + ((r * 7 + c * 3) % 5) * .03}"/>`).join('')).join(''));
  else if (life === 'house') o.push(Array.from({ length: 60 }, (_, i) => `<path d="M${(i % 12) * 34 + 17} ${Math.floor(i / 12) * 26 + 10} l4 6 l-4 6 l-4 -6 z" fill="${wd}" opacity=".45"/>`).join(''));
  else o.push(`<rect y="84" width="400" height="44" fill="${wd}" opacity=".45"/><rect y="84" width="400" height="2" fill="#FFFFFF" opacity=".5"/>`);
  o.push(`<rect y="130" width="400" height="50" fill="url(#hs-f)"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 50 + (i % 2) * 20}" y1="130" x2="${i * 50 + (i % 2) * 20 - 30}" y2="180" stroke="#000" stroke-width=".6" opacity=".12"/>`).join('')}<rect y="126" width="400" height="5" fill="${mixHex(wall, '#FFFFFF', .5)}"/><rect y="130" width="400" height="2" fill="#000" opacity=".08"/>`);
  o.push(roomPaperSVG(RS, wd));
  if (RS.floor === 3) o.push(Array.from({ length: 20 }, (_, i) => Array.from({ length: 4 }, (_, j) => (i + j) % 2 ? `<rect x="${i * 20}" y="${130 + j * 12.5}" width="20" height="12.5" fill="#1E1E1E" opacity=".85"/>` : '').join('')).join(''));
  if (RS.floor === 4) o.push(Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${132 + (i * 29) % 46}" r="${1 + i % 3}" fill="${['#C8553D', '#2E5A3A', '#E3C27A', '#5B3A6E'][i % 4]}" opacity=".5"/>`).join(''));
  if (life !== 'couch' && RS.rug !== 5) o.push(RS.rug ? roomRugSVG(RS.rug) : `<ellipse cx="200" cy="160" rx="110" ry="14" fill="${['house', 'own'].includes(life) ? '#8C3B3B' : '#3E5A7A'}" opacity=".55"/><ellipse cx="200" cy="160" rx="96" ry="10" fill="none" stroke="#E3C27A" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7"/>`);
  o.push(`<line x1="${life === 'couch' ? 120 : 330}" y1="0" x2="${life === 'couch' ? 120 : 330}" y2="22" stroke="#3B3B3B" stroke-width="1.2"/><path d="M${life === 'couch' ? 112 : 322} 22 h16 l-3 -6 h-10 z" fill="#3B3B3B"/><circle cx="${life === 'couch' ? 120 : 330}" cy="24" r="3" fill="#FFE9A8" opacity="${night ? 1 : .5}"/>`);
  const wx = life === 'couch' ? 268 : 160, ww = ['own', 'loft', 'house'].includes(life) ? 110 : 80;
  o.push(`<rect x="${wx}" y="18" width="${ww}" height="76" fill="${sky}"/><g transform="translate(${wx} 18)">${homeSkyline(M.hub, ww, 76)}</g><rect x="${wx - 4}" y="14" width="${ww + 8}" height="84" fill="none" stroke="#FFFFFF" stroke-width="6"/><path d="M${wx + ww / 2} 18 L${wx + ww / 2} 94" stroke="#FFFFFF" stroke-width="3"/><rect x="${wx - 8}" y="94" width="${ww + 16}" height="5" fill="#FFFFFF"/>`);
  if (!night) o.push(`<path d="M${wx} 94 L${wx + ww} 94 L${wx + ww + 40} 180 L${wx - 20} 180 Z" fill="#FFF6D8" opacity=".22"/>`);   // daylight across the floor
  if (life === 'loft') o.push(`<path d="M0 6 L400 6" stroke="#5E5A54" stroke-width="6"/><path d="M40 6 L40 128 M360 6 L360 128" stroke="#8A847C" stroke-width="5"/>`);
  if (life === 'house') o.push(`<rect x="300" y="40" width="60" height="88" fill="#8E6B4A"/><circle cx="350" cy="86" r="2.5" fill="#E3C27A"/>`);
  if (life === 'couch') o.push(`<g transform="translate(24 168)"><rect x="0" y="-40" width="140" height="28" rx="8" fill="#7A6E8E"/><rect x="0" y="-16" width="140" height="16" rx="4" fill="#5E536F"/><rect x="40" y="-34" width="34" height="16" rx="5" fill="#F3EFF8"/><rect x="76" y="-30" width="50" height="12" rx="3" fill="var(--data)" opacity=".8"/></g><text x="94" y="120" font-size="7" text-anchor="middle" fill="#6A5E80" font-family="sans-serif">a friend's couch</text>`);
  else if (!lay.bed) o.push(`<g transform="translate(${['own', 'loft', 'house'].includes(life) ? 12 : 18} 168)"><rect x="0" y="-10" width="84" height="10" rx="2" fill="#FFFFFF"/><rect x="4" y="-16" width="22" height="7" rx="3" fill="#F3EFF8"/></g>`);   // a mattress on the floor until there's a bed
  for (const [id, sp] of Object.entries(lay)) { const s = spots.find(x => x.id === sp); o.push(furnitureSVG(id, s.x, s.y)); }
  if (me.credits.length && life !== 'couch') o.push(`<g transform="translate(${life === 'own' ? 190 : 120} 104)">${me.credits.slice(0, 6).map((_, i) => `<rect x="${i * 9}" y="0" width="7" height="9" fill="#3B3226"/><rect x="${i * 9 + 1}" y="1" width="5" height="7" fill="#FFFFFF"/>`).join('')}</g>`);
  // what you've made goes on the wall: gold discs, a plaque, a play poster, trophies
  const W = M.works || [], wins = (M.comps || []).filter(e => e.place === 'win').length;
  const gold = W.filter(w => w.type === 'song' && w.units >= 100000).length, plat = W.filter(w => w.type === 'song' && w.units >= 1000000).length;
  const wall2 = []; for (let i = 0; i < Math.min(3, gold); i++) wall2.push(`<rect width="20" height="24" fill="#2B2B2B"/><circle cx="10" cy="11" r="7" fill="${i < plat ? '#D9D9E0' : '#D4AF37'}"/><circle cx="10" cy="11" r="1.5" fill="#2B2B2B"/>`);
  if (followers('vidwire') >= 100000) wall2.push(`<rect width="22" height="24" fill="#3B3B3B"/><path d="M7 7 L16 12 L7 17 Z" fill="#D9D9E0"/>`);
  for (const w of W.filter(w => w.plat === 'stage').slice(-2)) wall2.push(`<rect width="18" height="26" fill="#7A2E2E"/><rect x="2" y="2" width="14" height="14" fill="#F3EFF8"/><text x="9" y="22" font-size="3.2" text-anchor="middle" fill="#fff" font-family="sans-serif">${esc(w.title.slice(0, 10).toUpperCase())}</text>`);
  wall2.forEach((g, i) => o.push(`<g transform="translate(${life === 'couch' ? 210 + i * 26 : 290 + (i % 4) * 26} ${life === 'couch' ? 30 : 30 + Math.floor(i / 4) * 30})">${g}</g>`));
  if (wins) o.push(`<g transform="translate(${life === 'couch' ? 12 : 60} 118)">${Array.from({ length: Math.min(5, wins) }, (_, i) => `<path d="M${i * 10} 0 l6 0 l-1 5 l-2 0 l0 2 l2 0 l0 1 l-6 0 l0 -1 l2 0 l0 -2 l-2 0 z" fill="#D4AF37"/>`).join('')}<rect x="-2" y="8" width="${Math.min(5, wins) * 10 + 2}" height="2" fill="#6B4E3A"/></g>`);
  if (typeof relicSceneSVG === 'function') o.push(relicSceneSVG(lay));
  o.push(roomGlowSVG(RS, life, night), roomExtraSVG(RS, life));
  if (night) o.push(`<rect width="400" height="180" fill="#0B1020" opacity=".38"/><circle cx="${life === 'couch' ? 120 : 330}" cy="40" r="60" fill="#FFE9A8" opacity=".12"/>`);
  o.push(`<g transform="translate(178 76)">${portraitSVG(lookOf(me), S.year - me.born, 100, true, true).replace('<svg class="portrait figure"', '<svg class="portrait figure" x="0" y="0"')}</g>`);
  return `<svg class="home-scene" viewBox="0 0 400 180" role="img" aria-label="Your place">${o.join('')}</svg>`;
}

// ---- making it yours: paint, paper, floors, rugs, lights and the odd pet. Free, and only for the look of it. ----
const ROOM_STYLE = {
  paint: { label: 'Walls', opts: ['As it came', '#F6D6D6', '#CDE7E0', '#D9D2F0', '#FBE7B5', '#2E3A59', '#E8C1A0', '#BFD8F2', '#3E5A3A', '#FFF8EE'] },
  paper: { label: 'Wallpaper', opts: ['None', 'Stripes', 'Polka dots', 'Palm leaves', 'Stars', 'Zigzag', 'Film strip'] },
  floor: { label: 'Floor', opts: ['As it came', 'Light oak', 'Dark walnut', 'Black and white tiles', 'Terrazzo', 'Green carpet', 'Pink carpet'] },
  rug: { label: 'Rug', opts: ['As it came', 'Persian red', 'Sunset stripes', 'Round sheepskin', 'Retro geometric', 'No rug'] },
  glow: { label: 'Lights', opts: ['Just the lamp', 'String lights', 'Neon sign', 'Lava lamp', 'Disco ball', 'Candles everywhere'] },
  extra: { label: 'Personal touch', opts: ['Nothing', 'A sleeping cat', 'Stacks of DVDs', 'A mini fridge', 'A drum kit', 'A film projector', 'A cactus collection'] }
};
function roomStyleAct(a) { const M = S.me, R = ROOM_STYLE[a.k], v = +a.v; if (!R || !(v >= 0 && v < R.opts.length)) return false; (M.home.style = M.home.style || {})[a.k] = v; return true; }
function roomPaperSVG(RS, wd) {
  const p = RS.paper || 0, c = RS.paint === 5 || RS.paint === 8 ? '#FFFFFF' : wd; if (!p) return '';
  const tile = { 1: '<rect width="10" height="20" fill="C"/>', 2: '<circle cx="10" cy="10" r="3" fill="C"/>', 3: '<path d="M10 2 Q4 8 10 18 Q16 8 10 2 Z M10 4 L10 17" fill="C" stroke="C" stroke-width=".6"/>', 4: '<path d="M10 4 l1.5 3.5 l3.8 .3 l-2.9 2.4 l.9 3.7 l-3.3 -2 l-3.3 2 l.9 -3.7 l-2.9 -2.4 l3.8 -.3 z" fill="C"/>', 5: '<path d="M0 14 L5 6 L10 14 L15 6 L20 14" stroke="C" stroke-width="2" fill="none"/>', 6: '<rect x="2" y="2" width="16" height="16" fill="none" stroke="C" stroke-width="1.6"/><rect x="0" y="0" width="2" height="4" fill="C"/><rect x="18" y="0" width="2" height="4" fill="C"/>' }[p].replace(/C/g, c);
  return `<defs><pattern id="hs-pp" width="20" height="20" patternUnits="userSpaceOnUse">${tile}</pattern></defs><rect width="400" height="128" fill="url(#hs-pp)" opacity=".5"/>`;
}
function roomRugSVG(r) {
  if (r === 1) return `<ellipse cx="200" cy="160" rx="112" ry="15" fill="#8C2E2E"/><ellipse cx="200" cy="160" rx="96" ry="11" fill="none" stroke="#E3C27A" stroke-width="2"/><ellipse cx="200" cy="160" rx="60" ry="6" fill="#2C4F7C" opacity=".7"/>`;
  if (r === 2) return ['#F28C28', '#E0457B', '#7B4FC9', '#E3A72F'].map((c, i) => `<ellipse cx="200" cy="160" rx="${112 - i * 22}" ry="${15 - i * 3}" fill="${c}"/>`).join('');
  if (r === 3) return `<ellipse cx="200" cy="162" rx="60" ry="12" fill="#F4F0E6"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${148 + (i * 37) % 104}" cy="${155 + (i * 13) % 14}" r="2.2" fill="#FFFFFF" opacity=".8"/>`).join('')}`;
  return `<ellipse cx="200" cy="160" rx="112" ry="15" fill="#1FA3A0"/>${[-60, -20, 20, 60].map((d, i) => `<path d="M${200 + d - 12} 160 L${200 + d} 150 L${200 + d + 12} 160 L${200 + d} 170 Z" fill="${['#FFE27A', '#E0457B', '#FFFFFF', '#F28C28'][i]}"/>`).join('')}`;
}
function roomGlowSVG(RS, life, night) {
  const g = RS.glow || 0, op = night ? 1 : .75;
  if (g === 1) return `<path d="M0 10 Q50 26 100 10 Q150 26 200 10 Q250 26 300 10 Q350 26 400 10" stroke="#333" stroke-width=".8" fill="none"/>${Array.from({ length: 20 }, (_, i) => { const x = 10 + i * 20, t = (x % 100) / 100, y = 10 + 32 * t * (1 - t) + 3; return `<circle cx="${x}" cy="${y}" r="3" fill="${['#FFE27A', '#E85D9A', '#7FD1B9', '#F28C28', '#B39DDB'][i % 5]}" opacity="${op}"/>${night ? `<circle cx="${x}" cy="${y}" r="8" fill="#FFE9A8" opacity=".18"/>` : ''}`; }).join('')}`;
  if (g === 2) { const n = (ME().name || 'X')[0].toUpperCase(); return `<text x="70" y="70" font-size="34" font-family="'Brush Script MT', cursive" fill="#FF4FA3" opacity="${op}" stroke="#FFB3DA" stroke-width=".8">${esc(n)}♥</text>${night ? '<ellipse cx="88" cy="58" rx="40" ry="24" fill="#FF4FA3" opacity=".15"/>' : ''}`; }
  if (g === 3) return `<g transform="translate(${life === 'couch' ? 300 : 250} 160)"><rect x="-4" y="-6" width="8" height="6" fill="#555"/><path d="M-6 -6 L-3 -36 L3 -36 L6 -6 Z" fill="#E0457B" opacity=".85"/><circle cx="0" cy="-16" r="3" fill="#FFB347"/><circle cx="-1" cy="-27" r="2.2" fill="#FFB347"/><rect x="-4" y="-40" width="8" height="4" fill="#555"/>${night ? '<circle cx="0" cy="-20" r="22" fill="#E0457B" opacity=".18"/>' : ''}</g>`;
  if (g === 4) return `<line x1="200" y1="0" x2="200" y2="20" stroke="#888" stroke-width="1"/><circle cx="200" cy="30" r="10" fill="#C9CCD6"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${193 + (i % 4) * 4}" y="${23 + Math.floor(i / 4) * 5}" width="3" height="3" fill="#FFFFFF" opacity=".7"/>`).join('')}${night ? Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 71) % 400}" cy="${(i * 37) % 170}" r="2" fill="${['#FFE27A', '#7FD1B9', '#E85D9A'][i % 3]}" opacity=".7"/>`).join('') : ''}`;
  if (g === 5) return [60, 140, 300, 350].map(x => `<rect x="${x}" y="152" width="4" height="10" fill="#FFF6D8"/><ellipse cx="${x + 2}" cy="150" rx="1.5" ry="3" fill="#FFB347"/>${night ? `<circle cx="${x + 2}" cy="150" r="10" fill="#FFE9A8" opacity=".25"/>` : ''}`).join('');
  return '';
}
function roomExtraSVG(RS, life) {
  const e = RS.extra || 0, x = life === 'couch' ? 330 : 236;
  if (e === 1) return `<g transform="translate(${x} 166)"><ellipse cx="0" cy="0" rx="14" ry="7" fill="#E3A72F"/><circle cx="11" cy="-4" r="5.5" fill="#E3A72F"/><path d="M8 -9 l1.5 -4 l2.5 4 M13 -9 l1.5 -4 l2 4" fill="#E3A72F"/><path d="M-12 1 Q-20 -2 -16 -8" stroke="#E3A72F" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-6 -3 l4 0 M-4 1 l4 0" stroke="#B5762A" stroke-width="1"/></g>`;
  if (e === 2) return `<g transform="translate(${x} 170)">${[0, 1, 2].map(s => Array.from({ length: 6 }, (_, i) => `<rect x="${s * 14}" y="${-5 - i * 4}" width="12" height="3.5" fill="${['#2C4F7C', '#C8553D', '#1E1E1E', '#E3A72F', '#2E5A3A', '#5B3A6E'][(i + s) % 6]}"/>`).join('')).join('')}</g>`;
  if (e === 3) return `<g transform="translate(${x} 170)"><rect x="0" y="-30" width="22" height="30" rx="2" fill="#E8E4DA" stroke="#B9B5AE"/><rect x="18" y="-24" width="2" height="8" fill="#888"/><rect x="2" y="-36" width="6" height="6" fill="#C8553D"/><rect x="10" y="-34" width="5" height="4" fill="#2E5A3A"/></g>`;
  if (e === 4) return `<g transform="translate(${x} 170)"><ellipse cx="14" cy="-8" rx="14" ry="10" fill="#C8102E"/><ellipse cx="14" cy="-8" rx="10" ry="7" fill="#F4F2EE"/><ellipse cx="-4" cy="-22" rx="8" ry="3" fill="#E3C27A"/><line x1="-4" y1="-22" x2="-4" y2="0" stroke="#888"/><ellipse cx="32" cy="-26" rx="8" ry="3" fill="#E3C27A"/><line x1="32" y1="-26" x2="32" y2="0" stroke="#888"/></g>`;
  if (e === 5) return `<g transform="translate(${x} 170)"><path d="M8 -18 L2 0 M8 -18 L14 0" stroke="#333" stroke-width="1.5"/><rect x="0" y="-30" width="22" height="12" rx="2" fill="#2B2B2B"/><circle cx="4" cy="-34" r="5" fill="#2B2B2B"/><circle cx="16" cy="-34" r="5" fill="#2B2B2B"/><path d="M22 -26 L120 -60 L120 -10 Z" fill="#FFF6D8" opacity=".2"/></g>`;
  if (e === 6) return `<g transform="translate(${x} 170)">${[0, 12, 24].map((d, i) => `<rect x="${d}" y="-6" width="9" height="6" fill="#C8553D"/><path d="M${d + 4.5} -6 L${d + 4.5} ${-16 - i * 3}" stroke="#2E7A4C" stroke-width="5" stroke-linecap="round"/>${i === 1 ? `<circle cx="${d + 4.5}" cy="-21" r="2" fill="#E85D9A"/>` : ''}`).join('')}</g>`;
  return '';
}
function roomStyleHTML() {
  const RS = (S.me.home && S.me.home.style) || {};
  return `<h4>Make it yours</h4><div class="looks">${Object.entries(ROOM_STYLE).map(([k, R]) => { const v = RS[k] || 0, sw = k === 'paint';
    return `<div class="lk-row"><span class="muted">${R.label}</span>${sw ? `<span class="sw">${R.opts.map((o, i) => `<button class="swb${i === v ? ' on' : ''}" style="background:${i ? o : 'repeating-linear-gradient(45deg,#ddd 0 4px,#fff 4px 8px)'}" data-rstyle="${k}:${i}" title="${i ? '' : 'As it came'}"></button>`).join('')}</span>` : `<span class="rsb">${R.opts.map((o, i) => `<button class="pill${i === v ? ' on' : ''}" data-rstyle="${k}:${i}">${esc(o)}</button>`).join('')}</span>`}</div>`; }).join('')}</div>`;
}
