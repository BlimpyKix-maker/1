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
function homeSkyline(hub, w, h, night) {
  const r = hashRand([...hub].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0), o = [];
  for (const [layer, op, hmin, lit] of [[0, .45, .35, .25], [1, .95, .15, .45]]) {
    let x = -4; while (x < w) { const bw = 7 + r() * 13, bh = h * (hmin + r() * (layer ? .55 : .4)), y = h - bh;
      o.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="var(--hs-city)" opacity="${layer ? 1 : .45}"${layer ? '' : ' style="filter:saturate(.6)"'}/>`);
      if (layer && r() < .25) o.push(`<rect x="${(x + bw / 2 - .5).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="1" height="5" fill="var(--hs-city)"/>`);
      if (layer) for (let wy = y + 3; wy < h - 3; wy += 4.5) for (let wx = x + 2; wx < x + bw - 2; wx += 3.5) if (r() < (night ? lit : .12)) o.push(`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="1.6" height="2" fill="${night ? '#FFD98A' : '#FFFFFF'}" opacity="${night ? .9 : .35}"/>`);
      x += bw + (layer ? .6 : 2); }
    if (!layer) o.push(`<rect width="${w}" height="${h}" fill="#FFFFFF" opacity=".08"/>`);
  }
  return o.join('');
}
// what fills an empty corner, by how well you live
const ROOM_FILL = {
  couch: [], shared: ['crate', 'rail', 'beanbag'], studio: ['crate', 'beanbag', 'rail'],
  own: ['sofa', 'sidetable', 'floorlamp', 'bigplant'], loft: ['sofa', 'bigplant', 'metalshelf', 'floorlamp'],
  house: ['sofa', 'armchair', 'sideboard', 'bigplant', 'floorlamp'], penthouse: ['sofa', 'armchair', 'sideboard', 'bigplant', 'floorlamp'], beach: ['sofa', 'armchair', 'bigplant', 'sideboard', 'floorlamp'], estate: ['sofa', 'armchair', 'sideboard', 'bigplant', 'floorlamp']
};
const FILL_W = { crate: 30, rail: 44, beanbag: 40, sofa: 92, sidetable: 30, floorlamp: 26, bigplant: 34, metalshelf: 44, armchair: 46, sideboard: 64 };
function fillPieceSVG(k, x, y, accent, wood) {
  const sh = w => `<ellipse cx="${w / 2}" cy="1" rx="${w / 2 + 4}" ry="3" fill="#000" opacity=".16"/>`;
  switch (k) {
    case 'crate': return `<g transform="translate(${x} ${y})">${sh(30)}<rect x="0" y="-24" width="30" height="24" fill="#B98A55"/>${[0, 8, 16].map(d => `<rect x="0" y="${-22 + d}" width="30" height="2" fill="#8C6236"/>`).join('')}<rect x="4" y="-32" width="10" height="8" fill="#F3EFF8"/><rect x="16" y="-30" width="9" height="6" rx="1" fill="${accent}"/></g>`;
    case 'rail': return `<g transform="translate(${x} ${y})">${sh(44)}<path d="M2 0 L2 -58 L42 -58 L42 0" stroke="#888" stroke-width="2" fill="none"/>${[6, 14, 22, 30].map((d, i) => `<path d="M${d + 2} -57 l-5 8 l0 26 l12 0 l0 -26 z" fill="${['#2C4F7C', accent, '#E8E4DA', '#3B3B3B'][i]}" opacity=".95"/>`).join('')}</g>`;
    case 'beanbag': return `<g transform="translate(${x} ${y})">${sh(40)}<path d="M2 0 Q-2 -22 18 -26 Q40 -24 38 0 Z" fill="${accent}"/><path d="M8 -18 Q18 -24 30 -16" stroke="#FFFFFF" stroke-width="1.4" opacity=".3" fill="none"/></g>`;
    case 'sofa': return `<g transform="translate(${x} ${y})">${sh(92)}<rect x="4" y="-44" width="84" height="26" rx="8" fill="${mixHex(accent, '#000', .15)}"/><rect x="0" y="-24" width="92" height="18" rx="6" fill="${accent}"/><rect x="-2" y="-34" width="14" height="28" rx="6" fill="${mixHex(accent, '#000', .08)}"/><rect x="80" y="-34" width="14" height="28" rx="6" fill="${mixHex(accent, '#000', .08)}"/><rect x="16" y="-38" width="18" height="14" rx="4" fill="#F3EFF8" transform="rotate(-8 25 -31)"/><rect x="58" y="-36" width="16" height="12" rx="4" fill="#E3C27A"/><rect x="6" y="-6" width="3" height="6" fill="${wood}"/><rect x="83" y="-6" width="3" height="6" fill="${wood}"/><path d="M14 -22 L78 -22" stroke="#FFFFFF" stroke-width="1" opacity=".18"/></g>`;
    case 'sidetable': return `<g transform="translate(${x} ${y})">${sh(30)}<rect x="0" y="-30" width="30" height="4" fill="${wood}"/><rect x="3" y="-26" width="3" height="26" fill="${mixHex(wood, '#000', .2)}"/><rect x="24" y="-26" width="3" height="26" fill="${mixHex(wood, '#000', .2)}"/><rect x="2" y="-10" width="26" height="3" fill="${mixHex(wood, '#000', .1)}"/><path d="M10 -30 L8 -46 L22 -46 L20 -30 Z" fill="#F3E2B8"/><rect x="14" y="-34" width="2" height="4" fill="#555"/><rect x="18" y="-36" width="7" height="6" rx="1" fill="${accent}" opacity=".8"/></g>`;
    case 'floorlamp': return `<g transform="translate(${x} ${y})">${sh(26)}<ellipse cx="13" cy="-1" rx="9" ry="2" fill="#333"/><path d="M13 0 L13 -84" stroke="#333" stroke-width="2"/><path d="M2 -82 L6 -98 L20 -98 L24 -82 Z" fill="#F3E2B8"/><path d="M2 -82 L24 -82" stroke="#D9C38F" stroke-width="1"/></g>`;
    case 'bigplant': return `<g transform="translate(${x} ${y})">${sh(34)}<path d="M6 -22 L28 -22 L25 0 L9 0 Z" fill="#E8E4DA"/><path d="M6 -22 L28 -22" stroke="#C9C3B6" stroke-width="2"/>${[[-26, -58], [-6, -70], [14, -62], [32, -50], [24, -76], [2, -84], [-14, -44]].map(([dx, dy], i) => `<path d="M17 -22 Q${17 + dx / 2} ${-22 + dy / 2} ${17 + dx} ${dy - 4}" stroke="#2E6B3F" stroke-width="1.4" fill="none"/><ellipse cx="${17 + dx}" cy="${dy - 4}" rx="7" ry="3.6" transform="rotate(${dx > 0 ? -30 : 30} ${17 + dx} ${dy - 4})" fill="${i % 2 ? '#3E8A50' : '#2E7A44'}"/>`).join('')}</g>`;
    case 'metalshelf': return `<g transform="translate(${x} ${y})">${sh(44)}<path d="M2 0 L2 -80 M42 0 L42 -80" stroke="#555" stroke-width="2.4"/>${[-78, -54, -30, -6].map(d => `<rect x="1" y="${d}" width="42" height="2.5" fill="#666"/>`).join('')}<rect x="6" y="-74" width="6" height="20" fill="${accent}"/><rect x="13" y="-72" width="5" height="18" fill="#E8E4DA"/><rect x="20" y="-70" width="6" height="16" fill="#2C4F7C"/><circle cx="34" cy="-37" r="6" fill="#B9B5AE"/><rect x="8" y="-26" width="28" height="20" rx="2" fill="#B98A55"/></g>`;
    case 'armchair': return `<g transform="translate(${x} ${y})">${sh(46)}<path d="M6 -50 Q23 -58 40 -50 L40 -22 L6 -22 Z" fill="${mixHex(accent, '#3B2516', .45)}"/><rect x="2" y="-24" width="42" height="16" rx="5" fill="${mixHex(accent, '#3B2516', .35)}"/><rect x="0" y="-36" width="9" height="28" rx="4" fill="${mixHex(accent, '#3B2516', .5)}"/><rect x="37" y="-36" width="9" height="28" rx="4" fill="${mixHex(accent, '#3B2516', .5)}"/><path d="M6 -8 L4 0 M40 -8 L42 0" stroke="${wood}" stroke-width="2.4"/></g>`;
    case 'sideboard': return `<g transform="translate(${x} ${y})">${sh(64)}<rect x="0" y="-34" width="64" height="28" rx="2" fill="${wood}"/><rect x="0" y="-36" width="64" height="3" fill="${mixHex(wood, '#000', .2)}"/><path d="M21.5 -32 L21.5 -8 M42.5 -32 L42.5 -8" stroke="${mixHex(wood, '#000', .25)}" stroke-width="1"/>${[11, 32, 53].map(cx => `<circle cx="${cx}" cy="-20" r="1.2" fill="#E3C27A"/>`).join('')}<path d="M4 -6 L6 0 M60 -6 L58 0" stroke="${mixHex(wood, '#000', .3)}" stroke-width="2"/><path d="M10 -36 Q8 -50 14 -54 Q20 -50 18 -36 Z" fill="${accent}" opacity=".85"/><rect x="40" y="-48" width="16" height="12" rx="1" fill="#F3EFF8" stroke="#3B3226" stroke-width="1.4"/></g>`;
  }
  return '';
}
// something on an empty wall: a clock, a mirror, a small print
function wallFillSVG(i, x, y, accent) {
  const k = i % 5;
  if (k === 3) return `<g transform="translate(${x} ${y + 14})"><rect x="0" y="0" width="44" height="3" fill="#7A5236"/><rect x="0" y="3" width="44" height="2" fill="#000" opacity=".1"/>${[0, 1, 2, 3, 4, 5].map(j => `<rect x="${3 + j * 5}" y="${-14 + (j % 3)}" width="4" height="${14 - (j % 3)}" fill="${['#2C4F7C', '#C8553D', '#E3C27A', '#2E5A3A', '#E8E4DA', accent][j]}"/>`).join('')}<path d="M34 0 L34 -6 Q37 -12 40 -6 L40 0 Z" fill="#B9B5AE"/></g>`;
  if (k === 4) return `<g transform="translate(${x + 2} ${y + 2})"><rect x="2" y="3" width="40" height="30" fill="#000" opacity=".08"/><rect width="40" height="30" fill="#F4F0E6" stroke="#C9A646" stroke-width="2"/>${[0, 1, 2].map(j => `<rect x="${5 + j * 11}" y="6" width="8" height="18" fill="${mixHex(accent, ['#FFFFFF', '#000000', '#E3C27A'][j], .35)}"/>`).join('')}</g>`;
  if (k === 0) return `<g transform="translate(${x + 8} ${y + 6})"><ellipse cx="14" cy="16" rx="15" ry="15" fill="#000" opacity=".08"/><circle cx="14" cy="14" r="13" fill="#FFFFFF" stroke="#3B3226" stroke-width="2"/><path d="M14 14 L14 6 M14 14 L19 16" stroke="#222" stroke-width="1.4" stroke-linecap="round"/>${[0, 1, 2, 3].map(j => `<circle cx="${14 + Math.cos(j * Math.PI / 2) * 10}" cy="${14 + Math.sin(j * Math.PI / 2) * 10}" r=".8" fill="#555"/>`).join('')}</g>`;
  if (k === 1) return `<g transform="translate(${x + 4} ${y})"><rect x="2" y="3" width="30" height="40" rx="14" fill="#000" opacity=".08"/><rect width="30" height="40" rx="14" fill="#C9A646"/><rect x="3" y="3" width="24" height="34" rx="11" fill="#DDE7EE"/><path d="M8 10 L20 30" stroke="#FFFFFF" stroke-width="3" opacity=".6"/></g>`;
  return `<g transform="translate(${x + 4} ${y + 2})"><rect x="2" y="3" width="34" height="26" fill="#000" opacity=".08"/><rect width="34" height="26" fill="#FFFFFF" stroke="#2B2B2B" stroke-width="1.5"/><rect x="4" y="4" width="26" height="18" fill="${mixHex(accent, '#FFFFFF', .55)}"/><circle cx="12" cy="11" r="4" fill="${accent}"/><path d="M4 22 L14 14 L20 18 L30 10 L30 22 Z" fill="${mixHex(accent, '#000', .2)}"/></g>`;
}
// The scene. day: 0–5 for the light through the window.
function homeSceneSVG(day) {
  const M = S.me, me = ME(), life = M.life, lay = homeLayout(), spots = HOME_SPOTS[life] || [], d = clamp(day ?? 0, 0, 5), night = d >= 5;
  const SKY = [['#9CC7EE', '#DDEBF7'], ['#A9CFF0', '#E6F0F8'], ['#F2C79A', '#FBE6CB'], ['#E79A6E', '#F6CFA0'], ['#B5677A', '#EBA37A'], ['#0E1730', '#26355E']][d];
  const big = !['couch', 'shared', 'studio'].includes(life);
  let wall = { couch: '#E6DCCB', shared: '#EDE4D3', studio: '#EFE8DA', own: '#F4EEE2', loft: '#D9D2C6', house: '#F3EBDD', penthouse: '#ECEBE7', beach: '#F2F0E6', estate: '#EFE6D6' }[life] || '#EDE4D3';
  let floor = { couch: '#B59A7A', shared: '#A8865F', studio: '#9C7A55', own: '#8E6B4A', loft: '#6F6A63', house: '#8A6440', penthouse: '#4A4644', beach: '#D8C4A0', estate: '#7A5536' }[life] || '#A8865F';
  const RS = (M.home && M.home.style) || {};
  if (RS.paint) wall = ROOM_STYLE.paint.opts[RS.paint];
  if (RS.floor) floor = ['', '#C9A36A', '#5A3A22', '#EDEDED', '#D8CFC2', '#3E6B4A', '#D98FA8'][RS.floor] || floor;
  const wd = mixHex(wall, '#000000', .08), accent = LOOK.colour.opts[(lookOf(me).colour) || 0] || '#2C4F7C', sofaC = mixHex(accent, '#8C8A85', .35), wood = life === 'loft' || life === 'penthouse' ? '#3B3B3B' : '#7A5236';
  const o = [`<defs>
    <linearGradient id="hs-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(wall, '#000000', .06)}"/><stop offset=".55" stop-color="${mixHex(wall, '#FFFFFF', .12)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>
    <linearGradient id="hs-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(floor, '#000000', .25)}"/><stop offset="1" stop-color="${mixHex(floor, '#FFFFFF', .06)}"/></linearGradient>
    <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY[0]}"/><stop offset="1" stop-color="${SKY[1]}"/></linearGradient>
    <linearGradient id="hs-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".12" stop-color="#000" stop-opacity="0"/><stop offset=".88" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
    <radialGradient id="hs-vig" cx=".5" cy=".55" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
    <linearGradient id="hs-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d >= 3 ? '#FFD9A0' : '#FFF6D8'}" stop-opacity=".45"/><stop offset="1" stop-color="${d >= 3 ? '#FFD9A0' : '#FFF6D8'}" stop-opacity="0"/></linearGradient>
  </defs><rect width="400" height="180" fill="url(#hs-w)"/>`];
  // the walls say where you live: peeling paint, stripes, brick, wallpaper
  if (life === 'couch') o.push(Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 55} ${20 + (i % 3) * 25} q6 -4 12 0 q-4 6 -12 0" fill="${wd}" opacity=".7"/>`).join(''));
  else if (life === 'own' || life === 'penthouse') o.push(Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" y="0" width="9" height="128" fill="${wd}" opacity=".22"/>`).join(''));
  else if (life === 'loft') o.push(Array.from({ length: 13 }, (_, r) => Array.from({ length: 14 }, (_, c) => `<rect x="${c * 30 + (r % 2) * 15 - 15}" y="${r * 10}" width="28" height="8" rx="1" fill="#A65E46" opacity="${.18 + ((r * 7 + c * 3) % 5) * .03}"/>`).join('')).join(''));
  else if (life === 'house' || life === 'estate') o.push(Array.from({ length: 60 }, (_, i) => `<path d="M${(i % 12) * 34 + 17} ${Math.floor(i / 12) * 26 + 10} l4 6 l-4 6 l-4 -6 z" fill="${wd}" opacity=".35"/>`).join(''));
  else if (life === 'beach') o.push(Array.from({ length: 26 }, (_, i) => `<rect x="${i * 16}" y="0" width="15" height="128" fill="${i % 2 ? wd : 'none'}" opacity=".18"/>`).join(''));
  else o.push(`<rect y="84" width="400" height="44" fill="${wd}" opacity=".4"/><rect y="84" width="400" height="2" fill="#FFFFFF" opacity=".5"/>`);
  o.push(roomPaperSVG(RS, wd));
  // crown moulding and a skirting board
  if (big) o.push(`<rect width="400" height="5" fill="${mixHex(wall, '#FFFFFF', .5)}"/><rect y="5" width="400" height="1.5" fill="#000" opacity=".07"/>`);
  // the window: sky, the city, frame, sill and curtains
  const wx = life === 'couch' ? 268 : 150, ww = big ? 124 : 90, wy = 16, wh = 78;
  o.push(`<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="url(#hs-sky)"/>`);
  if (night) o.push(Array.from({ length: 14 }, (_, i) => `<circle cx="${wx + 4 + (i * 37) % (ww - 8)}" cy="${wy + 3 + (i * 23) % 30}" r="${i % 4 ? .5 : .9}" fill="#FFFFFF" opacity=".8"/>`).join('') + `<circle cx="${wx + ww * .78}" cy="${wy + 14}" r="6" fill="#F4F1E1"/><circle cx="${wx + ww * .78 + 2.5}" cy="${wy + 12.5}" r="5" fill="${SKY[0]}"/>`);
  else o.push(`<circle cx="${wx + ww * (d >= 3 ? .2 : .75)}" cy="${wy + (d >= 3 ? 40 : 16)}" r="${d >= 3 ? 9 : 6}" fill="${d >= 3 ? '#FFD27A' : '#FFF6D0'}" opacity=".9"/>` + [[.2, 12], [.55, 22]].map(([fx, fy]) => `<g opacity=".8"><ellipse cx="${wx + ww * fx}" cy="${wy + fy}" rx="10" ry="3" fill="#FFFFFF"/><ellipse cx="${wx + ww * fx + 5}" cy="${wy + fy - 2}" rx="6" ry="3" fill="#FFFFFF"/></g>`).join(''));
  o.push(`<svg x="${wx}" y="${wy}" width="${ww}" height="${wh}" viewBox="0 0 ${ww} ${wh}">${homeSkyline(M.hub, ww, wh, night)}</svg>`);
  o.push(`<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/><rect x="${wx - 4}" y="${wy - 4}" width="${ww + 8}" height="${wh + 8}" fill="none" stroke="#FFFFFF" stroke-width="5"/><path d="M${wx + ww / 2} ${wy} L${wx + ww / 2} ${wy + wh} M${wx} ${wy + wh * .42} L${wx + ww} ${wy + wh * .42}" stroke="#FFFFFF" stroke-width="2.4"/><rect x="${wx - 9}" y="${wy + wh + 2}" width="${ww + 18}" height="5" rx="1" fill="#FFFFFF"/><rect x="${wx - 9}" y="${wy + wh + 7}" width="${ww + 18}" height="2" fill="#000" opacity=".1"/>`);
  if (life !== 'couch') { const cc = RS.paint ? mixHex(wall, '#000', .3) : mixHex(accent, '#FFFFFF', .35);
    o.push(`<rect x="${wx - 18}" y="${wy - 10}" width="${ww + 36}" height="3" rx="1.5" fill="#3B3226"/>${[[wx - 18, 1], [wx + ww + 2, -1]].map(([x0, s]) => `<path d="M${x0} ${wy - 8} L${x0 + 16} ${wy - 8} Q${x0 + 8 + s * 3} ${wy + 40} ${x0 + 14 - (s > 0 ? 6 : -2)} ${wy + wh + 14} L${x0} ${wy + wh + 14} Z" fill="${cc}"/><path d="M${x0 + 5} ${wy - 6} L${x0 + 4} ${wy + wh + 12} M${x0 + 10} ${wy - 6} L${x0 + 10} ${wy + wh + 12}" stroke="#000" stroke-opacity=".1" stroke-width="1.4"/>`).join('')}`); }
  if (life === 'loft') o.push(`<path d="M0 6 L400 6" stroke="#5E5A54" stroke-width="6"/><path d="M40 6 L40 128 M360 6 L360 128" stroke="#8A847C" stroke-width="5"/>`);
  if (life === 'house' || life === 'estate') o.push(`<rect x="300" y="40" width="60" height="88" fill="#8E6B4A"/><rect x="306" y="46" width="48" height="36" fill="#7A5A3C"/><rect x="306" y="86" width="48" height="36" fill="#7A5A3C"/><circle cx="350" cy="86" r="2.5" fill="#E3C27A"/>`);
  // floor: boards, skirting and the light coming in
  o.push(`<rect y="128" width="400" height="52" fill="url(#hs-f)"/>`);
  if (!RS.floor || [1, 2].includes(RS.floor)) o.push(Array.from({ length: 6 }, (_, j) => `<line x1="0" y1="${131 + j * 9 * (1 + j * .12)}" x2="400" y2="${131 + j * 9 * (1 + j * .12)}" stroke="#000" stroke-width=".5" opacity=".14"/>` + Array.from({ length: 6 }, (_, i) => `<line x1="${(i * 73 + j * 41) % 400}" y1="${131 + j * 9 * (1 + j * .12)}" x2="${(i * 73 + j * 41) % 400}" y2="${131 + (j + 1) * 9 * (1 + (j + 1) * .12)}" stroke="#000" stroke-width=".5" opacity=".12"/>`).join('')).join(''));
  if (RS.floor === 3) o.push(Array.from({ length: 20 }, (_, i) => Array.from({ length: 4 }, (_, j) => (i + j) % 2 ? `<rect x="${i * 20}" y="${130 + j * 12.5}" width="20" height="12.5" fill="#1E1E1E" opacity=".85"/>` : '').join('')).join(''));
  if (RS.floor === 4) o.push(Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${132 + (i * 29) % 46}" r="${1 + i % 3}" fill="${['#C8553D', '#2E5A3A', '#E3C27A', '#5B3A6E'][i % 4]}" opacity=".5"/>`).join(''));
  o.push(`<rect y="122" width="400" height="7" fill="${mixHex(wall, '#FFFFFF', .55)}"/><rect y="129" width="400" height="3" fill="#000" opacity=".1"/>`);
  if (big) o.push(`<rect x="372" y="112" width="7" height="10" rx="1" fill="#FFFFFF" stroke="#000" stroke-opacity=".15"/>`);
  if (!night) o.push(`<path d="M${wx} ${wy + wh + 4} L${wx + ww} ${wy + wh + 4} L${wx + ww + 50} 180 L${wx - 30} 180 Z" fill="url(#hs-beam)"/>`);
  if (life !== 'couch' && RS.rug !== 5) o.push(`<ellipse cx="202" cy="164" rx="114" ry="15" fill="#000" opacity=".08"/>` + (RS.rug ? roomRugSVG(RS.rug) : `<ellipse cx="200" cy="160" rx="110" ry="14" fill="${big ? '#8C3B3B' : '#3E5A7A'}" opacity=".6"/><ellipse cx="200" cy="160" rx="96" ry="10" fill="none" stroke="#E3C27A" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7"/>`));
  // the ceiling light
  const lx = life === 'couch' ? 120 : 300; o.push(`<line x1="${lx}" y1="0" x2="${lx}" y2="8" stroke="#3B3B3B" stroke-width="1.2"/><path d="M${lx - 8} 17 Q${lx} 4 ${lx + 8} 17 Z" fill="#3B3B3B"/><ellipse cx="${lx}" cy="17" rx="8" ry="1.8" fill="#FFE9A8" opacity="${night ? 1 : .6}"/>${night ? `<path d="M${lx - 8} 17 L${lx - 60} 180 L${lx + 60} 180 L${lx + 8} 17 Z" fill="#FFE9A8" opacity=".1"/>` : ''}`);
  if (life === 'couch') o.push(`<g transform="translate(24 168)"><ellipse cx="70" cy="1" rx="76" ry="3" fill="#000" opacity=".16"/><rect x="0" y="-44" width="140" height="30" rx="9" fill="#7A6E8E"/><rect x="0" y="-18" width="140" height="18" rx="5" fill="#5E536F"/><rect x="-4" y="-30" width="14" height="30" rx="6" fill="#6A5E80"/><rect x="130" y="-30" width="14" height="30" rx="6" fill="#6A5E80"/><rect x="40" y="-34" width="34" height="16" rx="5" fill="#F3EFF8"/><rect x="76" y="-30" width="50" height="12" rx="3" fill="var(--data)" opacity=".8"/></g><text x="94" y="120" font-size="7" text-anchor="middle" fill="#6A5E80" font-family="sans-serif">a friend's couch</text>`);
  else if (!lay.bed) o.push(`<g transform="translate(${big ? 12 : 18} 168)"><ellipse cx="44" cy="1" rx="46" ry="3" fill="#000" opacity=".15"/><rect x="0" y="-12" width="88" height="12" rx="3" fill="#FFFFFF"/><rect x="0" y="-6" width="88" height="6" rx="2" fill="${mixHex(accent, '#FFFFFF', .5)}"/><rect x="4" y="-18" width="22" height="8" rx="3" fill="#F3EFF8"/></g>`);   // a mattress on the floor until there's a bed
  // empty spots get the sort of thing people who live like this have
  const used = new Set(Object.values(lay)), fill = (ROOM_FILL[life] || []).slice(), floorSpots = spots.filter(s => s.kind === 'floor').sort((a, b) => a.x - b.x);
  for (let i = 0; i < floorSpots.length; i++) { const s = floorSpots[i]; if (used.has(s.id) || (!lay.bed && s.x < 100)) continue; const room = (floorSpots[i + 1] ? floorSpots[i + 1].x : 400) - s.x - 4, j = fill.findIndex(k => FILL_W[k] <= room && !(s.x < 230 && s.x + FILL_W[k] > 168)); if (j < 0) continue; o.push(fillPieceSVG(fill.splice(j, 1)[0], s.x, s.y, sofaC, wood)); }
  if (big) spots.filter(s => s.kind === 'wall' && !used.has(s.id) && !((life === 'house' || life === 'estate') && s.x > 262 && s.x < 362)).forEach((s, i) => o.push(wallFillSVG(i + [...(M.hub || '')].reduce((a, c) => a + c.charCodeAt(0), 0), s.x, s.y + 6, accent)));
  for (const [id, sp] of Object.entries(lay)) { const s = spots.find(x => x.id === sp); if (!s) continue; const F = FURNITURE[id]; if (F && F.kind !== 'wall') o.push(`<ellipse cx="${s.x + 24}" cy="${s.y + 1}" rx="28" ry="3" fill="#000" opacity=".14"/>`); else if (F) o.push(`<rect x="${s.x + 2}" y="${s.y + 3}" width="46" height="60" fill="#000" opacity=".07"/>`); o.push(furnitureSVG(id, s.x, s.y)); }
  if (!spots.some(s => s.id === 'sill' && used.has('sill')) && life !== 'couch') o.push(`<g transform="translate(${wx + 8} ${wy + wh + 2})"><path d="M0 0 L10 0 L9 -8 L1 -8 Z" fill="#C8553D"/><path d="M5 -8 Q0 -16 -2 -14 M5 -8 Q10 -18 13 -14 M5 -8 L5 -18" stroke="#2E7A4C" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`);
  if (me.credits.length && life !== 'couch') o.push(`<g transform="translate(${big ? 70 : 120} 104)">${me.credits.slice(0, 6).map((_, i) => `<rect x="${i * 9}" y="0" width="7" height="9" fill="#3B3226"/><rect x="${i * 9 + 1}" y="1" width="5" height="7" fill="#FFFFFF"/>`).join('')}</g>`);
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
  // you, standing in it, with a shadow
  o.push(`<ellipse cx="203" cy="175" rx="24" ry="3.5" fill="#000" opacity=".22"/><g transform="translate(173 54)">${portraitSVG(lookOf(me), S.year - me.born, 122, true, true).replace('<svg class="portrait figure"', '<svg class="portrait figure" x="0" y="0"')}</g>`);
  o.push(`<rect width="400" height="180" fill="url(#hs-side)"/>`);
  if (night) o.push(`<rect width="400" height="180" fill="#0B1020" opacity=".34"/><circle cx="${lx}" cy="60" r="70" fill="#FFE9A8" opacity=".1"/>`);
  else if (d >= 3) o.push(`<rect width="400" height="180" fill="#FF9E5E" opacity=".07"/>`);
  o.push(`<rect width="400" height="180" fill="url(#hs-vig)"/>`);
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
