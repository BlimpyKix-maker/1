// ---------------- Portraits ----------------
// A drawn face for every person. The player builds theirs; everyone else's is generated from their id, era and
// hub. Faces age: hair greys from the mid-forties, lines arrive, some hairlines retreat. Style can change any time.
const LOOK = {
  skin: { label: 'Skin', opts: ['#F6D7C3', '#EFC3A4', '#E2AE8A', '#D19A72', '#BC8459', '#A26D45', '#8A5A37', '#714629', '#57351E', '#3E2614'] },
  face: { label: 'Face', opts: ['Oval', 'Round', 'Square', 'Long', 'Heart', 'Diamond', 'Soft', 'Angular', 'Wide', 'Narrow'] },
  build: { label: 'Body', opts: ['Slim', 'Lean', 'Average', 'Sturdy', 'Broad', 'Heavy', 'Petite', 'Tall and thin', 'Muscular', 'Curvy'] },
  hair: { label: 'Hair', opts: ['Shaved', 'Buzz cut', 'Short', 'Side part', 'Quiff', 'Curly', 'Afro', 'Bob', 'Long', 'Locs'] },
  hairColor: { label: 'Hair colour', opts: ['#16110D', '#3A2618', '#5C3A21', '#8A5A2B', '#A0522D', '#C48A4A', '#E3C27A', '#B9B5AE', '#4566B0', '#C2577F'] },
  eyes: { label: 'Eyes', opts: ['#3B2716', '#5A3B1E', '#6E5A2E', '#4E6B3A', '#3F6E7A', '#5579A8', '#7A8A99', '#2F2A26', '#8B6B3D', '#6B4E7A'] },
  facial: { label: 'Facial hair', opts: ['None', 'Stubble', 'Moustache', 'Goatee', 'Short beard', 'Full beard', 'Sideburns', 'Chin strap', 'Handlebar', 'Soul patch'] },
  glasses: { label: 'Glasses', opts: ['None', 'Round', 'Square', 'Thick frames', 'Wire rims', 'Cat-eye', 'Aviators', 'Sunglasses', 'Half-moons', 'Tinted'] },
  outfit: { label: 'Clothes', opts: ['T-shirt', 'Hoodie', 'Flannel', 'Denim jacket', 'Leather jacket', 'Turtleneck', 'Sweater', 'Dress shirt', 'Blazer', 'Suit and tie'] },
  colour: { label: 'Clothes colour', opts: ['#1E2A38', '#3B3B3B', '#7A2E2E', '#2E5A3A', '#2C4F7C', '#8C6A2E', '#5B3A6E', '#B5B0A6', '#C8553D', '#E8E4DA'] },
  head: { label: 'On your head', opts: ['Nothing', 'Cap', 'Beanie', 'Bandana', 'Hat', 'Headphones', 'Beret', 'Headband', 'Fedora', 'Director\'s cap'] },
  ears: { label: 'Ears', opts: ['Nothing', 'Studs', 'Hoops', 'Ear cuff', 'Diamond studs'] },
  mark: { label: 'Piercings and marks', opts: ['Nothing', 'Nose ring', 'Nose stud', 'Freckles', 'Beauty mark'] },
  neck: { label: 'Neck', opts: ['Nothing', 'Scarf', 'Necklace', 'Chain', 'Bow tie', 'Lanyard', 'Silk scarf', 'Lucky pendant'] },
  wrist: { label: 'Wrist', opts: ['Nothing', 'Plain watch', 'Bracelet', 'Vintage watch', 'Smartwatch'] },
  hairline: { label: 'Hairline with age', opts: ['Keeps it', 'Recedes'] }
};
const LOOK_KEYS = Object.keys(LOOK);
function defaultLook() { return { skin: 3, face: 0, build: 2, hair: 2, hairColor: 2, eyes: 1, facial: 0, glasses: 0, outfit: 0, colour: 0, head: 0, ears: 0, mark: 0, neck: 0, wrist: 0, hairline: 0 }; }
// Wardrobe pieces you have to buy. Each sits in one slot; some change your rolls when worn. Everything else in LOOK is free.
const WARDROBE = {
  fedora: { slot: 'head', opt: 8, price: 180, adv: ['cha'], dis: ['col'], d: 'Old-Hollywood swagger. Advantage on Charisma; crews read it as attitude (disadvantage on Collaboration).' },
  dircap: { slot: 'head', opt: 9, price: 60, bonus: { com: 1 }, d: 'You look like you know where the camera goes. +1 Composure.' },
  diamonds: { slot: 'ears', opt: 4, price: 1500, bonus: { cha: 1 }, standing: 2, d: 'Money in your ears. +1 Charisma, and people assume you\'re doing well.' },
  silk: { slot: 'neck', opt: 6, price: 240, adv: ['tas'], d: 'A painter\'s scarf. Advantage on Taste.' },
  pendant: { slot: 'neck', opt: 7, price: 90, lucky: true, d: 'Somebody\'s grandmother swore by it. Rerolls your first natural 1 each week.' },
  vintage: { slot: 'wrist', opt: 3, price: 650, adv: ['eth'], d: 'Never late again. Advantage on Work ethic.' },
  smart: { slot: 'wrist', opt: 4, price: 320, bonus: { eth: 1 }, dis: ['com'], d: 'Every notification at once. +1 Work ethic, disadvantage on Composure.' }
};
const WARDROBE_AT = {};
for (const id in WARDROBE) WARDROBE_AT[WARDROBE[id].slot + ':' + WARDROBE[id].opt] = id;
// Older looks had a single accessory; spread it into the slots.
function migrateLook(L) {
  if (L.extra) { const m = { 1: ['ears', 1], 2: ['head', 1], 3: ['head', 2], 4: ['neck', 1], 5: ['head', 5], 6: ['mark', 1], 7: ['head', 3], 8: ['neck', 2], 9: ['head', 4] }[L.extra]; if (m && L[m[0]] === undefined) L[m[0]] = m[1]; }
  delete L.extra;
  return L;
}
// Region-weighted skin tones, kept broad: every hub draws from the whole range.
const SKIN_BIAS = { 'North America': 3.5, Europe: 1.5, 'East Asia': 2, 'South Asia': 5, 'Southeast Asia': 4.5, Africa: 7.5, 'South America': 4, Oceania: 2.5, 'Middle East': 4 };
function hashRand(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function npcLook(p) {
  const r = hashRand(p.id * 7 + 3), pk = n => Math.floor(r() * n), y = p.born + 30;
  const region = HUBS[p.hub] ? HUBS[p.hub].region : 'Europe';
  const skin = clamp(Math.round((SKIN_BIAS[region] ?? 3) + (r() + r() + r() - 1.5) * 3), 0, 9);
  const F = p.g === 'F';
  const hair = F ? [2, 3, 5, 6, 7, 8, 8, 9][pk(8)] : [0, 1, 2, 2, 3, 4, 5, 6, 8, 9][pk(10)];
  const dark = skin >= 5 || ['East Asia', 'South Asia', 'Southeast Asia', 'Africa', 'Middle East'].includes(region);
  const hairColor = dark ? [0, 0, 1, 1, 2][pk(5)] : [0, 1, 2, 2, 3, 4, 5, 6][pk(8)];
  const outfit = y < 1950 ? [7, 8, 9, 9][pk(4)] : y < 1975 ? [5, 6, 7, 8, 9][pk(5)] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][pk(10)];
  return { skin, face: pk(10), build: pk(10), hair, hairColor, eyes: pk(10), facial: F ? 0 : r() < .45 ? 1 + pk(9) : 0, glasses: r() < .22 ? 1 + pk(9) : 0, outfit, colour: pk(10), head: r() < .14 ? 1 + pk(7) : 0, ears: r() < (F ? .45 : .12) ? 1 + pk(3) : 0, mark: r() < .1 ? 1 + pk(4) : 0, neck: r() < .14 ? 1 + pk(5) : 0, wrist: 0, hairline: !F && r() < .45 ? 1 : 0 };
}
function lookOf(p) { return p.player && S.me && S.me.look ? Object.assign(defaultLook(), migrateLook(Object.assign({}, S.me.look))) : realLook(p, npcLook(p)); }
function mixHex(a, b, t) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = k => Math.round(((pa >> k) & 255) * (1 - t) + ((pb >> k) & 255) * t); return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1); }
let PORTRAIT_UID = 0;
function portraitSVG(L, age, size = 96, bare = false) {
  L = Object.assign(defaultLook(), migrateLook(Object.assign({}, L)));
  const uid = 'pc' + (++PORTRAIT_UID);
  const skin = LOOK.skin.opts[L.skin], shade = mixHex(skin, '#000000', .18), line = mixHex(skin, '#000000', .38);
  const grey = clamp((age - 44) / 26, 0, .85), hc = mixHex(LOOK.hairColor.opts[L.hairColor], '#D9D6D0', grey), cloth = LOOK.colour.opts[L.colour];
  const fw = [30, 33, 32, 28, 31, 30, 33, 30, 35, 27][L.face], fh = [38, 35, 36, 42, 37, 38, 36, 38, 35, 40][L.face];
  const jaw = [0, 4, -3, 0, 6, 3, 4, -4, 0, 1][L.face];
  const bw = [40, 42, 46, 50, 54, 56, 38, 40, 52, 48][L.build], neck = 9 + [0, 0, 1, 2, 3, 4, 0, -1, 3, 1][L.build];
  const recede = L.hairline === 1 ? clamp((age - 32) / 30, 0, 1) : 0;
  const cx = 60, cy = 52, top = cy - fh / 2;
  const o = [];
  // light and texture: a gradient face, fabric shading, a backdrop that changes from person to person
  const pr = hashRand(L.skin * 131 + L.hair * 17 + L.colour * 7 + L.face * 3 + L.outfit + L.eyes * 29), pat = Math.floor(pr() * 4), bgc = mixHex(cloth, '#FFFFFF', .72), bgd = mixHex(cloth, '#FFFFFF', .5);
  o.push(`<defs><linearGradient id="${uid}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mixHex(skin, '#FFFFFF', .14)}"/><stop offset=".6" stop-color="${skin}"/><stop offset="1" stop-color="${mixHex(skin, '#000000', .12)}"/></linearGradient><linearGradient id="${uid}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(cloth, '#FFFFFF', .12)}"/><stop offset="1" stop-color="${mixHex(cloth, '#000000', .28)}"/></linearGradient><radialGradient id="${uid}b" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="${bgc}"/><stop offset="1" stop-color="${bgd}"/></radialGradient><radialGradient id="${uid}v" cx=".5" cy=".45" r=".72"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>`);
  if (!bare) {
    o.push(`<rect width="120" height="120" rx="10" fill="url(#${uid}b)"/>`);
    if (pat === 0) o.push(Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M60 44 L${60 + Math.cos(a) * 110} ${44 + Math.sin(a) * 110} L${60 + Math.cos(a + .2) * 110} ${44 + Math.sin(a + .2) * 110} Z" fill="#FFFFFF" opacity=".16"/>`; }).join(''));
    else if (pat === 1) o.push(Array.from({ length: 36 }, (_, i) => `<circle cx="${8 + (i % 6) * 21}" cy="${8 + Math.floor(i / 6) * 21}" r="2.2" fill="#FFFFFF" opacity=".28"/>`).join(''));
    else if (pat === 2) o.push(Array.from({ length: 8 }, (_, i) => `<rect x="${i * 16}" y="0" width="7" height="120" fill="#FFFFFF" opacity=".14"/>`).join(''));
    else o.push(`<circle cx="60" cy="40" r="46" fill="#FFFFFF" opacity=".22"/>`);
  }
  // how far the hair reaches, so headwear sits on top of it rather than inside it
  const hairTop0 = top - 3 + recede * 10;
  const hairHalf = L.hair === 6 ? fw / 2 + 12 : L.hair === 5 ? fw / 2 + 7 : [7, 8, 9].includes(L.hair) ? fw / 2 + 4 : L.hair === 0 ? fw / 2 : fw / 2 + 2;
  const hairPeak = L.hair === 6 ? top + 10 - (fw / 2 + 12) : L.hair === 4 ? hairTop0 - 12 : L.hair === 5 ? hairTop0 - 6 : L.hair === 0 ? top : hairTop0 - 4;
  const covers = [1, 2, 4, 6, 8, 9].includes(L.head);   // hats that hide the hair above the brim
  const brim = top + ([0, 8, 10, 0, 6, 0, 7, 0, 6, 8][L.head] || 0);
  const hw = Math.max(fw / 2 + 2, Math.min(hairHalf, fw / 2 + 9));   // headwear half-width: wide enough for the hair under it
  if (covers) o.push(`<defs><clipPath id="${uid}"><rect x="0" y="${brim - 1}" width="120" height="${121 - brim}"/></clipPath></defs>`);
  const hairOpen = covers ? `<g clip-path="url(#${uid})">` : '', hairClose = covers ? '</g>' : '';
  // hair behind the head
  o.push(hairOpen);
  if ([7, 8, 9].includes(L.hair)) o.push(`<path d="M${cx - fw / 2 - 4} ${cy - 8} Q${cx - fw / 2 - 8} ${cy + 30} ${cx - fw / 2 + (L.hair === 7 ? 6 : 0)} ${cy + (L.hair === 7 ? 18 : 40)} L${cx + fw / 2 - (L.hair === 7 ? 6 : 0)} ${cy + (L.hair === 7 ? 18 : 40)} Q${cx + fw / 2 + 8} ${cy + 30} ${cx + fw / 2 + 4} ${cy - 8} Z" fill="${hc}"/>`);
  if (L.hair === 6) o.push(`<circle cx="${cx}" cy="${top + 10}" r="${fw / 2 + 12}" fill="${hc}"/>`);
  o.push(hairClose);
  // body and clothes
  o.push(`<path d="M${cx - bw} 120 Q${cx - bw} 88 ${cx - neck - 8} 84 L${cx + neck + 8} 84 Q${cx + bw} 88 ${cx + bw} 120 Z" fill="url(#${uid}c)"/><path d="M${cx - bw + 3} 118 Q${cx - bw + 4} 92 ${cx - neck - 6} 87" stroke="#FFFFFF" stroke-width="1.5" opacity=".18" fill="none"/>`);
  o.push(`<rect x="${cx - neck}" y="${cy + fh / 2 - 6}" width="${neck * 2}" height="${16}" fill="${shade}"/>`);
  const collar = { 1: `<path d="M${cx - 16} 86 Q${cx} 100 ${cx + 16} 86" fill="none" stroke="${mixHex(cloth, '#000', .3)}" stroke-width="3"/>`, 2: `<path d="M${cx - 30} 100 L${cx + 30} 100 M${cx - 34} 110 L${cx + 34} 110" stroke="${mixHex(cloth, '#fff', .25)}" stroke-width="2"/>`, 3: `<path d="M${cx - 12} 85 L${cx} 98 L${cx + 12} 85" fill="none" stroke="${mixHex(cloth, '#fff', .3)}" stroke-width="2"/>`, 4: `<path d="M${cx - 14} 85 L${cx - 2} 110 M${cx + 14} 85 L${cx + 2} 110" stroke="${mixHex(cloth, '#000', .4)}" stroke-width="3"/>`, 5: `<rect x="${cx - neck - 3}" y="80" width="${neck * 2 + 6}" height="9" rx="3" fill="${cloth}"/>`, 7: `<path d="M${cx - 10} 85 L${cx} 95 L${cx + 10} 85" fill="#F1EEE8"/>`, 8: `<path d="M${cx - 10} 85 L${cx} 100 L${cx + 10} 85" fill="#F1EEE8"/><path d="M${cx - 14} 86 L${cx - 4} 112 M${cx + 14} 86 L${cx + 4} 112" stroke="${mixHex(cloth, '#000', .35)}" stroke-width="3"/>`, 9: `<path d="M${cx - 10} 85 L${cx} 100 L${cx + 10} 85" fill="#F1EEE8"/><path d="M${cx - 3} 92 L${cx + 3} 92 L${cx + 4} 112 L${cx} 116 L${cx - 4} 112 Z" fill="#8C2E2E"/>` }[L.outfit];
  if (collar) o.push(collar);
  // round the neck
  if (L.neck === 1 || L.neck === 6) { const sc = L.neck === 6 ? '#B9375A' : '#B8533A'; o.push(`<path d="M${cx - 20} 84 Q${cx} 96 ${cx + 20} 84 L${cx + 18} 92 Q${cx} 104 ${cx - 18} 92 Z" fill="${sc}"/>` + (L.neck === 6 ? `<path d="M${cx + 8} 94 L${cx + 14} 114 L${cx + 6} 112 Z" fill="${sc}"/>` : '')); }
  if (L.neck === 2) o.push(`<path d="M${cx - 10} 87 Q${cx} 97 ${cx + 10} 87" fill="none" stroke="#C9A646" stroke-width="1.5"/>`);
  if (L.neck === 3) o.push(`<path d="M${cx - 12} 86 Q${cx} 100 ${cx + 12} 86" fill="none" stroke="#D4AF37" stroke-width="2.6" stroke-dasharray="2 1"/>`);
  if (L.neck === 4) o.push(`<path d="M${cx} 89 L${cx - 7} 85 L${cx - 7} 93 Z M${cx} 89 L${cx + 7} 85 L${cx + 7} 93 Z" fill="#1E1E1E"/><circle cx="${cx}" cy="89" r="1.8" fill="#1E1E1E"/>`);
  if (L.neck === 5) o.push(`<path d="M${cx - 9} 85 L${cx - 2} 106 M${cx + 9} 85 L${cx + 2} 106" stroke="#5B2D90" stroke-width="2"/><rect x="${cx - 6}" y="105" width="12" height="9" rx="1" fill="#F4F1F8" stroke="#5B2D90" stroke-width="1"/>`);
  if (L.neck === 7) o.push(`<path d="M${cx - 9} 86 Q${cx} 98 ${cx + 9} 86" fill="none" stroke="#C9A646" stroke-width="1.2"/><circle cx="${cx}" cy="97" r="2.6" fill="#2E8B57" stroke="#C9A646" stroke-width=".8"/>`);
  // head
  o.push(`<ellipse cx="${cx - fw / 2}" cy="${cy + 2}" rx="4" ry="6" fill="${shade}"/><ellipse cx="${cx + fw / 2}" cy="${cy + 2}" rx="4" ry="6" fill="${shade}"/>`);
  o.push(`<path d="M${cx - fw / 2} ${cy - 6} Q${cx - fw / 2} ${top} ${cx} ${top} Q${cx + fw / 2} ${top} ${cx + fw / 2} ${cy - 6} L${cx + fw / 2 - 1} ${cy + 8} Q${cx + fw / 2 - 4 - jaw} ${cy + fh / 2} ${cx} ${cy + fh / 2} Q${cx - fw / 2 + 4 + jaw} ${cy + fh / 2} ${cx - fw / 2 + 1} ${cy + 8} Z" fill="url(#${uid}f)"/><ellipse cx="${cx}" cy="${cy + fh / 2 + 1}" rx="${fw / 3}" ry="2.5" fill="${shade}" opacity=".35"/>`);
  if (L.ears) { const ex2 = fw / 2 + 1, ear = L.ears === 1 ? (x => `<circle cx="${x}" cy="${cy + 9}" r="1.6" fill="#D4AF37"/>`) : L.ears === 2 ? (x => `<circle cx="${x}" cy="${cy + 12}" r="3.2" fill="none" stroke="#D4AF37" stroke-width="1.3"/>`) : L.ears === 3 ? (x => `<path d="M${x} ${cy - 2} l0 6" stroke="#C0C0C0" stroke-width="2" stroke-linecap="round"/>`) : (x => `<circle cx="${x}" cy="${cy + 9}" r="2" fill="#E8F4FF" stroke="#9FC6E8" stroke-width=".8"/>`); o.push(ear(cx - ex2) + (L.ears === 3 ? '' : ear(cx + ex2))); }
  // eyes, brows, nose, mouth
  const ey = cy - 1, ex = fw * .2, ec = LOOK.eyes.opts[L.eyes];
  o.push(`<ellipse cx="${cx - ex}" cy="${ey}" rx="3.2" ry="2.2" fill="#fff"/><ellipse cx="${cx + ex}" cy="${ey}" rx="3.2" ry="2.2" fill="#fff"/><circle cx="${cx - ex}" cy="${ey}" r="1.7" fill="${ec}"/><circle cx="${cx + ex}" cy="${ey}" r="1.7" fill="${ec}"/><circle cx="${cx - ex}" cy="${ey}" r=".8" fill="#111"/><circle cx="${cx + ex}" cy="${ey}" r=".8" fill="#111"/><circle cx="${cx - ex + .7}" cy="${ey - .7}" r=".5" fill="#fff"/><circle cx="${cx + ex + .7}" cy="${ey - .7}" r=".5" fill="#fff"/><path d="M${cx - ex - 3.4} ${ey - .6} Q${cx - ex} ${ey - 3} ${cx - ex + 3.4} ${ey - .6} M${cx + ex - 3.4} ${ey - .6} Q${cx + ex} ${ey - 3} ${cx + ex + 3.4} ${ey - .6}" stroke="${line}" stroke-width=".9" fill="none"/>`);
  o.push(`<ellipse cx="${cx - ex - 2}" cy="${ey + 7}" rx="4" ry="2.4" fill="#E07A6A" opacity=".16"/><ellipse cx="${cx + ex + 2}" cy="${ey + 7}" rx="4" ry="2.4" fill="#E07A6A" opacity=".16"/>`);
  o.push(`<path d="M${cx - ex - 4} ${ey - 5} Q${cx - ex} ${ey - 7} ${cx - ex + 4} ${ey - 5} M${cx + ex - 4} ${ey - 5} Q${cx + ex} ${ey - 7} ${cx + ex + 4} ${ey - 5}" stroke="${mixHex(hc, '#000', .2)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
  o.push(`<path d="M${cx} ${ey + 2} Q${cx - 2.5} ${ey + 9} ${cx + 1} ${ey + 10}" stroke="${line}" stroke-width="1.2" fill="none"/>`);
  { const lip = mixHex(skin, '#9A3B3B', .5); o.push(`<path d="M${cx - 6} ${ey + 15} Q${cx - 3} ${ey + 13.5} ${cx} ${ey + 14.5} Q${cx + 3} ${ey + 13.5} ${cx + 6} ${ey + 15} Q${cx} ${ey + 16} ${cx - 6} ${ey + 15} Z" fill="${mixHex(lip, '#000', .15)}"/><path d="M${cx - 6} ${ey + 15} Q${cx} ${ey + 19.5} ${cx + 6} ${ey + 15} Q${cx} ${ey + 16.5} ${cx - 6} ${ey + 15} Z" fill="${lip}"/><ellipse cx="${cx + 1}" cy="${ey + 16.8}" rx="1.8" ry=".6" fill="#FFFFFF" opacity=".3"/>`); }
  if (L.mark === 1) o.push(`<circle cx="${cx + 3}" cy="${ey + 10}" r="1.4" fill="none" stroke="#C0C0C0" stroke-width="1"/>`);
  if (L.mark === 2) o.push(`<circle cx="${cx + 2.6}" cy="${ey + 8.6}" r=".9" fill="#D9D9D9"/>`);
  if (L.mark === 3) o.push([[-9, 5], [-6, 7], [-11, 8], [9, 5], [6, 7], [11, 8], [-2, 4], [2, 4]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${ey + dy}" r=".7" fill="${mixHex(skin, '#5A3015', .5)}"/>`).join(''));
  if (L.mark === 4) o.push(`<circle cx="${cx + 7}" cy="${ey + 13}" r=".9" fill="#2A1A10"/>`);
  // age lines
  if (age >= 40) o.push(`<path d="M${cx - ex - 6} ${ey + 1} l-2 1.5 M${cx + ex + 6} ${ey + 1} l2 1.5" stroke="${line}" stroke-width=".8"/>`);
  if (age >= 52) o.push(`<path d="M${cx - 8} ${top + 9} Q${cx} ${top + 7} ${cx + 8} ${top + 9} M${cx - 9} ${ey + 11} q-2 4 0 6 M${cx + 9} ${ey + 11} q2 4 0 6" stroke="${line}" stroke-width=".8" fill="none"/>`);
  // facial hair
  const fh2 = mixHex(hc, '#000', .05);
  const beard = { 1: `<path d="M${cx - fw / 2 + 3} ${cy + 8} Q${cx} ${cy + fh / 2 + 3} ${cx + fw / 2 - 3} ${cy + 8}" stroke="${fh2}" stroke-width="5" opacity=".3" fill="none"/>`, 2: `<path d="M${cx - 8} ${ey + 13} Q${cx} ${ey + 10} ${cx + 8} ${ey + 13}" stroke="${fh2}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 3: `<path d="M${cx - 6} ${ey + 13} Q${cx} ${ey + 11} ${cx + 6} ${ey + 13} M${cx - 4} ${ey + 19} Q${cx} ${ey + 26} ${cx + 4} ${ey + 19}" stroke="${fh2}" stroke-width="3" fill="none"/>`, 4: `<path d="M${cx - fw / 2 + 2} ${cy + 6} Q${cx - fw / 2 + 4} ${cy + fh / 2 + 2} ${cx} ${cy + fh / 2 + 3} Q${cx + fw / 2 - 4} ${cy + fh / 2 + 2} ${cx + fw / 2 - 2} ${cy + 6} Q${cx} ${cy + 24} ${cx - fw / 2 + 2} ${cy + 6} Z" fill="${fh2}" opacity=".85"/>`, 5: `<path d="M${cx - fw / 2} ${cy + 2} Q${cx - fw / 2} ${cy + fh / 2 + 10} ${cx} ${cy + fh / 2 + 12} Q${cx + fw / 2} ${cy + fh / 2 + 10} ${cx + fw / 2} ${cy + 2} Q${cx} ${cy + 22} ${cx - fw / 2} ${cy + 2} Z" fill="${fh2}"/>`, 6: `<path d="M${cx - fw / 2 + 1} ${cy - 4} L${cx - fw / 2 + 2} ${cy + 12} M${cx + fw / 2 - 1} ${cy - 4} L${cx + fw / 2 - 2} ${cy + 12}" stroke="${fh2}" stroke-width="4"/>`, 7: `<path d="M${cx - fw / 2 + 1} ${cy + 2} Q${cx} ${cy + fh / 2 + 6} ${cx + fw / 2 - 1} ${cy + 2}" stroke="${fh2}" stroke-width="3" fill="none"/>`, 8: `<path d="M${cx - 10} ${ey + 18} Q${cx - 9} ${ey + 11} ${cx} ${ey + 12} Q${cx + 9} ${ey + 11} ${cx + 10} ${ey + 18}" stroke="${fh2}" stroke-width="2.6" fill="none"/>`, 9: `<path d="M${cx - 1.5} ${ey + 19} l3 0 l-1.5 4 z" fill="${fh2}"/>` }[L.facial];
  if (beard) o.push(beard);
  // hair on top
  const hairTop = hairTop0;
  const hairs = {
    1: `<path d="M${cx - fw / 2 + 1} ${cy - 6} Q${cx - fw / 2} ${hairTop} ${cx} ${hairTop} Q${cx + fw / 2} ${hairTop} ${cx + fw / 2 - 1} ${cy - 6} Q${cx} ${hairTop + 5} ${cx - fw / 2 + 1} ${cy - 6} Z" fill="${hc}" opacity=".55"/>`,
    2: `<path d="M${cx - fw / 2 - 1} ${cy - 4} Q${cx - fw / 2 - 2} ${hairTop - 3} ${cx} ${hairTop - 4} Q${cx + fw / 2 + 2} ${hairTop - 3} ${cx + fw / 2 + 1} ${cy - 4} Q${cx + 8} ${hairTop + 6} ${cx - fw / 2 - 1} ${cy - 4} Z" fill="${hc}"/>`,
    3: `<path d="M${cx - fw / 2 - 1} ${cy - 2} Q${cx - fw / 2 - 3} ${hairTop - 4} ${cx - 2} ${hairTop - 4} Q${cx + fw / 2 + 3} ${hairTop - 3} ${cx + fw / 2 + 1} ${cy - 3} Q${cx + fw / 2 - 4} ${hairTop + 5} ${cx - 6} ${hairTop + 6} Q${cx - fw / 2 + 2} ${hairTop + 9} ${cx - fw / 2 - 1} ${cy - 2} Z" fill="${hc}"/>`,
    4: `<path d="M${cx - fw / 2 - 1} ${cy - 4} Q${cx - fw / 2} ${hairTop - 10} ${cx + 4} ${hairTop - 12} Q${cx + fw / 2 + 4} ${hairTop - 6} ${cx + fw / 2 + 1} ${cy - 4} Q${cx} ${hairTop + 4} ${cx - fw / 2 - 1} ${cy - 4} Z" fill="${hc}"/>`,
    5: Array.from({ length: 9 }, (_, i) => `<circle cx="${cx - fw / 2 + 2 + i * (fw - 4) / 8}" cy="${hairTop + (i % 2) * 3}" r="6" fill="${hc}"/>`).join(''),
    6: '',
    7: `<path d="M${cx - fw / 2 - 3} ${cy + 6} Q${cx - fw / 2 - 4} ${hairTop - 4} ${cx} ${hairTop - 4} Q${cx + fw / 2 + 4} ${hairTop - 4} ${cx + fw / 2 + 3} ${cy + 6} Q${cx + fw / 2 - 2} ${hairTop + 6} ${cx} ${hairTop + 8} Q${cx - fw / 2 + 2} ${hairTop + 6} ${cx - fw / 2 - 3} ${cy + 6} Z" fill="${hc}"/>`,
    8: `<path d="M${cx - fw / 2 - 3} ${cy} Q${cx - fw / 2 - 4} ${hairTop - 4} ${cx} ${hairTop - 4} Q${cx + fw / 2 + 4} ${hairTop - 4} ${cx + fw / 2 + 3} ${cy} Q${cx + 4} ${hairTop + 4} ${cx - fw / 2 - 3} ${cy} Z" fill="${hc}"/>`,
    9: `<path d="M${cx - fw / 2 - 3} ${cy} Q${cx - fw / 2 - 4} ${hairTop - 4} ${cx} ${hairTop - 4} Q${cx + fw / 2 + 4} ${hairTop - 4} ${cx + fw / 2 + 3} ${cy} Q${cx} ${hairTop + 5} ${cx - fw / 2 - 3} ${cy} Z" fill="${hc}"/>` + [-12, -4, 4, 12].map(d => `<path d="M${cx + d} ${hairTop} L${cx + d * 1.6} ${cy + 34}" stroke="${hc}" stroke-width="5" stroke-linecap="round"/>`).join('')
  };
  if (hairs[L.hair]) o.push(hairOpen + hairs[L.hair] + ([2, 3, 4, 7, 8, 9].includes(L.hair) ? `<path d="M${cx - fw / 4} ${hairTop + 1} Q${cx} ${hairTop - 3} ${cx + fw / 4} ${hairTop + 1}" stroke="#FFFFFF" stroke-width="2" opacity=".22" fill="none" stroke-linecap="round"/>` : '') + hairClose);
  // headwear
  // headwear, sized to the hair underneath
  const capC = cloth, dk = mixHex(cloth, '#000', .3);
  if (L.head === 1) o.push(`<path d="M${cx - hw} ${brim} Q${cx - hw} ${top - 10} ${cx} ${top - 11} Q${cx + hw} ${top - 10} ${cx + hw} ${brim} Z" fill="${capC}"/><path d="M${cx - 2} ${brim - 1} L${cx + hw + 13} ${brim + 1} Q${cx + hw + 14} ${brim + 5} ${cx + hw + 6} ${brim + 5} L${cx - 2} ${brim + 3} Z" fill="${dk}"/>`);
  if (L.head === 2) o.push(`<path d="M${cx - hw - 1} ${brim + 1} Q${cx - hw} ${top - 16} ${cx} ${top - 17} Q${cx + hw} ${top - 16} ${cx + hw + 1} ${brim + 1} Z" fill="${mixHex(cloth, '#fff', .15)}"/><rect x="${cx - hw - 2}" y="${brim - 4}" width="${hw * 2 + 4}" height="7" rx="3" fill="${mixHex(cloth, '#000', .2)}"/>`);
  if (L.head === 3) o.push(`<path d="M${cx - hairHalf - 1} ${top + 9} Q${cx} ${Math.min(top - 6, hairPeak + 4)} ${cx + hairHalf + 1} ${top + 9} L${cx + hairHalf - 1} ${top + 13} Q${cx} ${top + 3} ${cx - hairHalf + 1} ${top + 13} Z" fill="#9C2B2B"/><path d="M${cx + hairHalf - 2} ${top + 10} l7 6 l-3 1 Z" fill="#9C2B2B"/>`);
  if (L.head === 4) o.push(`<ellipse cx="${cx}" cy="${brim}" rx="${hw + 10}" ry="4" fill="${dk}"/><path d="M${cx - hw + 1} ${brim} Q${cx} ${top - 18} ${cx + hw - 1} ${brim} Z" fill="${dk}"/>`);
  if (L.head === 5) { const W = Math.max(fw / 2 + 3, hairHalf + 1), T = Math.min(top - 6, hairPeak - 3); o.push(`<path d="M${cx - W} ${cy} Q${cx - W} ${T} ${cx} ${T} Q${cx + W} ${T} ${cx + W} ${cy}" stroke="#2B2B2B" stroke-width="3" fill="none"/><rect x="${cx - W - 5}" y="${cy - 6}" width="8" height="13" rx="3" fill="#2B2B2B"/><rect x="${cx + W - 3}" y="${cy - 6}" width="8" height="13" rx="3" fill="#2B2B2B"/>`); }
  if (L.head === 6) o.push(`<path d="M${cx - hw - 3} ${brim} Q${cx - hw} ${top - 12} ${cx + 4} ${top - 12} Q${cx + hw + 8} ${top - 10} ${cx + hw + 3} ${brim} Z" fill="#5B2D90"/><circle cx="${cx + 2}" cy="${top - 12}" r="1.6" fill="#3A1D66"/>`);
  if (L.head === 7) o.push(`<path d="M${cx - hairHalf} ${top + 7} Q${cx} ${top - 2} ${cx + hairHalf} ${top + 7}" stroke="#C8102E" stroke-width="4" fill="none"/>`);
  if (L.head === 8) o.push(`<ellipse cx="${cx}" cy="${brim}" rx="${hw + 12}" ry="4.5" fill="#3B3226"/><path d="M${cx - hw + 1} ${brim} L${cx - hw + 3} ${top - 12} Q${cx} ${top - 6} ${cx + hw - 3} ${top - 12} L${cx + hw - 1} ${brim} Z" fill="#3B3226"/><rect x="${cx - hw + 1}" y="${brim - 5}" width="${hw * 2 - 2}" height="4" fill="#1E1A14"/>`);
  if (L.head === 9) o.push(`<path d="M${cx - hw} ${brim} Q${cx - hw} ${top - 10} ${cx} ${top - 11} Q${cx + hw} ${top - 10} ${cx + hw} ${brim} Z" fill="#1F1430"/><path d="M${cx - 2} ${brim - 1} L${cx + hw + 13} ${brim + 1} Q${cx + hw + 14} ${brim + 5} ${cx + hw + 6} ${brim + 5} L${cx - 2} ${brim + 3} Z" fill="#000"/><text x="${cx}" y="${top + 2}" font-size="6" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="700">CREW</text>`);
  // a raised forearm shows what's on the wrist
  if (L.wrist) { const band = ['', '#3B3226', '#C9A646', '#8C6A2E', '#1E1E1E'][L.wrist], face = L.wrist === 2 ? null : L.wrist === 4 ? '#2C4F7C' : '#F3EFF8';
    o.push(`<g transform="rotate(-18 100 112)"><rect x="93" y="92" width="14" height="30" rx="6" fill="${cloth}"/><rect x="94" y="80" width="12" height="16" rx="5" fill="${skin}"/><ellipse cx="100" cy="78" rx="7" ry="6" fill="${skin}"/><rect x="93" y="88" width="14" height="${L.wrist === 2 ? 2.5 : 4}" fill="${band}"/>${face ? `<rect x="96.5" y="86.5" width="7" height="7" rx="${L.wrist === 4 ? 1.5 : 3.5}" fill="${face}" stroke="${band}" stroke-width="1"/>` : ''}</g>`); }
  // glasses
  if (L.glasses) {
    const g = L.glasses, gc = g === 4 ? '#B9A06A' : g === 7 || g === 9 ? '#222' : '#2A2A2A', fill = g === 7 ? '#1D1D1D' : g === 9 ? 'rgba(80,60,120,.35)' : 'none';
    const lens = g === 1 || g === 8 ? (x => `<circle cx="${x}" cy="${ey}" r="5" fill="${fill}" stroke="${gc}" stroke-width="1.4"/>`) : g === 5 ? (x => `<path d="M${x - 6} ${ey - 2} L${x + 6} ${ey - 4} L${x + 5} ${ey + 3} L${x - 5} ${ey + 3} Z" fill="${fill}" stroke="${gc}" stroke-width="1.4"/>`) : g === 6 ? (x => `<path d="M${x - 6} ${ey - 3} L${x + 6} ${ey - 3} L${x + 5} ${ey + 4} Q${x} ${ey + 7} ${x - 5} ${ey + 4} Z" fill="${fill}" stroke="${gc}" stroke-width="1.4"/>`) : (x => `<rect x="${x - 6}" y="${ey - 4}" width="12" height="${g === 8 ? 5 : 8}" rx="${g === 3 ? 1 : 2}" fill="${fill}" stroke="${gc}" stroke-width="${g === 3 ? 2.4 : 1.4}"/>`);
    o.push(lens(cx - ex) + lens(cx + ex) + `<path d="M${cx - ex + 5} ${ey - 1} L${cx + ex - 5} ${ey - 1}" stroke="${gc}" stroke-width="1.3"/>`);
  }
  if (!bare) o.push(`<rect width="120" height="120" rx="10" fill="url(#${uid}v)"/>`);
  return `<svg class="portrait" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Portrait">${o.join('')}</svg>`;
}
// The dead are remembered in their prime.
function portraitOf(p, size) { const age = (p.dead ? yearOf(p.deathW || S.week) : S.year) - p.born; return portraitSVG(lookOf(p), p.dead ? Math.min(age, 50) : age, size); }
