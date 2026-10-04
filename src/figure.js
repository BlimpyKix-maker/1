// ---------------- The whole person ----------------
// Portraits are head and shoulders, for lists and the phone. Where there's room (the creator, profiles, your
// room) people are drawn head to toe: what they wear on top and below, their shoes, a bag, a pattern, a pose.
// More style to choose from, too: louder colours, more hair, more hats. New options are appended to the old lists
// so every saved look keeps meaning what it meant.
LOOK.outfit.opts.push('Dress', 'Tracksuit top', 'Kimono jacket', 'Band tee', 'Sequin jacket', 'Cardigan', 'Hawaiian shirt', 'Puffer jacket', 'Trench coat', 'Overalls');
LOOK.colour.opts.push('#E0457B', '#1FA3A0', '#E3A72F', '#B39DDB', '#F28C28', '#2EAD6B', '#2F5BD3', '#FF7F6B', '#151515', '#F2C6D6');
LOOK.hair.opts.push('Ponytail', 'Top bun', 'Mohawk', 'Pixie', 'Braids', 'Mullet', 'Space buns', 'Slicked back');
LOOK.hairColor.opts.push('#ECE4CF', '#B5562C', '#7FD1B9', '#7B4FC9', '#E85D9A');
LOOK.head.opts.push('Flower crown', 'Bucket hat', 'Cowboy hat', 'Visor');
const FIG_COLOURS = ['#2C4F7C', '#1E1E1E', '#C2A878', '#3B3B3B', '#7A2E2E', '#2E5A3A', '#E8E4DA', '#5B3A6E', '#E0457B', '#1FA3A0', '#E3A72F', '#B39DDB', '#F28C28', '#8C6A2E', '#2F5BD3', '#FF7F6B'];
Object.assign(LOOK, {
  pattern: { label: 'Pattern on top', opts: ['Plain', 'Stripes', 'Checks', 'Polka dots', 'Florals', 'Tie-dye', 'Leopard', 'Pinstripe', 'Camouflage', 'Stars'] },
  bottoms: { label: 'Below the waist', opts: ['Jeans', 'Skinny jeans', 'Chinos', 'Shorts', 'Mini skirt', 'Long skirt', 'Suit trousers', 'Cargo trousers', 'Wide-leg trousers', 'Leggings'] },
  bottomColour: { label: 'Bottoms colour', opts: FIG_COLOURS },
  shoes: { label: 'Shoes', opts: ['Trainers', 'High-tops', 'Boots', 'Loafers', 'Heels', 'Sandals', 'Brogues', 'Platform boots', 'Cowboy boots', 'Fluffy slippers'] },
  bag: { label: 'Carrying', opts: ['Nothing', 'Tote bag', 'Backpack', 'Camera bag', 'Messenger bag', 'Clutch', 'Guitar case', 'A script', 'Coffee', 'Film canister'] },
  tattoo: { label: 'Tattoos', opts: ['None', 'Sleeve', 'Wrist', 'Hand', 'Ankle'] },
  pose: { label: 'Pose', opts: ['Standing', 'Hand on hip', 'Waving', 'Arms crossed', 'Hands in pockets'] }
});
for (const k of ['pattern', 'bottoms', 'bottomColour', 'shoes', 'bag', 'tattoo', 'pose']) if (!LOOK_KEYS.includes(k)) LOOK_KEYS.push(k);
// what everyone else wears below the waist, from a seed of their own (their face and top are untouched)
function npcFigure(p, L) {
  if (L.bottoms !== undefined) return L;
  const r = hashRand(p.id * 13 + 5), pk = n => Math.floor(r() * n), F = p.g === 'F', y = p.born + 30;
  return Object.assign(L, { pattern: r() < .7 ? 0 : 1 + pk(9), bottoms: F ? [0, 1, 2, 4, 5, 6, 8, 9][pk(8)] : [0, 1, 2, 3, 6, 7, 8][pk(7)], bottomColour: pk(FIG_COLOURS.length), shoes: y < 1960 ? [3, 6][pk(2)] : F ? [0, 1, 2, 3, 4, 5, 7][pk(7)] : [0, 1, 2, 3, 6, 8][pk(6)], bag: r() < .6 ? 0 : 1 + pk(9), tattoo: r() < .85 ? 0 : 1 + pk(4), pose: pk(5) });
}
// The body, drawn under the head. o: the portrait's list of SVG pieces; cx: the middle; skin and cloth colours.
function figureBody(L, o, uid, cx, skin, cloth, pr) {
  const b = L.build, top = L.outfit, bot = L.bottoms || 0, shoe = L.shoes || 0, pose = L.pose || 0, bag = L.bag || 0, tat = L.tattoo || 0;
  const FT = L._fit || { mus: 0, mass: 0 }, sw = [17, 18, 20, 22, 24, 26, 15, 16, 23, 20][b] + FT.mus * .55 + FT.mass * .3, ww = [12, 13, 15, 17, 19, 23, 12, 12, 17, 15][b] + FT.mass * .85 - FT.mus * .12, hp = [14, 15, 17, 19, 21, 25, 14, 14, 18, 22][b] + FT.mass * .5;
  const sy = 87, wy = 132, hy = 146, legLen = [70, 72, 70, 70, 70, 70, 62, 80, 70, 68][b], fy = hy + legLen, lw = Math.max(5, hp / 2 - 1.5);
  const bc = FIG_COLOURS[L.bottomColour || 0], dkc = mixHex(cloth, '#000', .28), dkb = mixHex(bc, '#000', .3), skinD = mixHex(skin, '#000', .15);
  const lx = cx - hp / 2 - .5, rx = cx + hp / 2 + .5;
  // backdrop shadow
  { const sh = `<ellipse cx="${cx}" cy="${fy + 7}" rx="${hp + 14}" ry="4" fill="#000" opacity=".16"/>`, gi = o.findIndex(x => typeof x === 'string' && x.startsWith('<g filter=')); if (gi >= 0) o.splice(gi, 0, sh); else o.push(sh); }   // under the ink, so it isn't outlined
  // a guitar case or backpack sits behind you
  if (bag === 6) o.push(`<g transform="rotate(14 ${cx + 6} 120)"><path d="M${cx + 2} 70 Q${cx + 14} 66 ${cx + 16} 80 L${cx + 20} 150 Q${cx + 26} 172 ${cx + 10} 178 Q${cx - 6} 172 ${cx} 150 Z" fill="#2B2B2B"/><path d="M${cx + 8} 76 L${cx + 10} 170" stroke="#555" stroke-width="1"/></g>`);
  if (bag === 2) o.push(`<rect x="${cx - sw + 2}" y="${sy + 2}" width="${(sw - 2) * 2}" height="40" rx="8" fill="${mixHex(bc, '#fff', .2)}"/>`);
  // legs: skin first, then whatever covers them
  for (const x of [lx, rx]) o.push(`<rect x="${x - lw}" y="${hy}" width="${lw * 2}" height="${legLen}" rx="${lw}" fill="${skin}"/>`);
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19;
  const legC = top === 19 ? cloth : bc, legD = top === 19 ? dkc : dkb;
  if (longLeg) {
    const flare = bot === 8 && top !== 19 ? 5 : 0, slim = (bot === 1 || bot === 9) && top !== 19 ? -1.2 : 0;
    for (const x of [lx, rx]) o.push(`<path d="M${x - lw - 1.5} ${hy - 2} L${x + lw + 1.5} ${hy - 2} L${x + lw + slim + flare} ${fy - 1} L${x - lw - slim - flare} ${fy - 1} Z" fill="${legC}" stroke="${legD}" stroke-width=".7"/><path d="M${x} ${hy + 6} L${x} ${fy - 3}" stroke="${legD}" stroke-width=".8" opacity=".6"/>`);
    if (bot === 0 && top !== 19) for (const x of [lx, rx]) o.push(`<path d="M${x - lw + 1} ${hy + 2} L${x - lw + 1} ${fy - 3}" stroke="${mixHex(bc, '#fff', .45)}" stroke-width=".6" stroke-dasharray="1.5 1.5"/>`);
    if (bot === 7) for (const x of [lx, rx]) o.push(`<rect x="${x - lw - 1}" y="${hy + 26}" width="${lw + 1}" height="10" rx="1.5" fill="${legD}"/>`);
    if (bot === 6) for (const x of [lx, rx]) o.push(`<path d="M${x} ${hy + 4} L${x} ${fy - 2}" stroke="${mixHex(bc, '#fff', .3)}" stroke-width=".9"/>`);
  } else if (bot === 3) for (const x of [lx, rx]) o.push(`<path d="M${x - lw - 1.5} ${hy - 2} L${x + lw + 1.5} ${hy - 2} L${x + lw + 2} ${hy + 22} L${x - lw - 2} ${hy + 22} Z" fill="${bc}"/>`);
  o.push(`<rect x="${cx - hp - 1}" y="${hy - 8}" width="${hp * 2 + 2}" height="${longLeg || bot === 3 ? 12 : 8}" rx="3" fill="${longLeg ? legC : bot === 3 ? bc : skin}"/>`);
  if (bot === 4 && top !== 10 && top !== 19) o.push(`<path d="M${cx - ww - 1} ${wy} L${cx + ww + 1} ${wy} L${cx + hp + 7} ${hy + 22} L${cx - hp - 7} ${hy + 22} Z" fill="${bc}"/>`);
  if (bot === 5 && top !== 10 && top !== 19) o.push(`<path d="M${cx - ww - 1} ${wy} L${cx + ww + 1} ${wy} L${cx + hp + 13} ${fy - 9} Q${cx} ${fy - 4} ${cx - hp - 13} ${fy - 9} Z" fill="${bc}"/><path d="M${cx - 4} ${hy} L${cx - 7} ${fy - 9} M${cx + 5} ${hy} L${cx + 9} ${fy - 9}" stroke="${dkb}" stroke-width=".7" opacity=".5"/>`);
  if (tat === 4) o.push(`<path d="M${lx - 2} ${fy - 10} l3 -3 l3 3 l-3 3 z" fill="#2B3A66" opacity=".7"/>`);
  // shoes
  const SH = [['#F4F2EE', cloth], ['#C8102E', '#F4F2EE'], ['#5A3A22', '#3B2516'], ['#3B2516', '#2A1A10'], ['#151515', '#8C2E2E'], ['#B98A55', skin], ['#7A4A28', '#4E2E18'], ['#151515', '#333'], ['#B98A55', '#8C5A2E'], ['#F2C6D6', '#FFFFFF']][shoe];
  for (const [x, dir] of [[lx, -1], [rx, 1]]) {
    const h = [5, 8, 12, 4, 5, 3, 4, 14, 13, 6][shoe];
    if (h > 6) o.push(`<rect x="${x - lw - .5}" y="${fy - h}" width="${lw * 2 + 1}" height="${h}" fill="${SH[0]}"/>`);
    o.push(`<path d="M${x - lw - 1 + (dir < 0 ? -4 : 0)} ${fy + 5} Q${x - lw - 1 + (dir < 0 ? -4 : 0)} ${fy - 3} ${x} ${fy - 3} Q${x + lw + 1 + (dir > 0 ? 4 : 0)} ${fy - 2} ${x + lw + 1 + (dir > 0 ? 4 : 0)} ${fy + 5} Z" fill="${SH[0]}"/><rect x="${x - lw - 1 + (dir < 0 ? -4 : 0)}" y="${fy + 3.5}" width="${lw * 2 + 6}" height="${shoe === 7 ? 4 : 2}" fill="${SH[1]}"/>`);
    if (shoe === 4) o.push(`<rect x="${x + dir * (lw - 1) - 1}" y="${fy + 3}" width="2" height="5" fill="${SH[0]}"/>`);
    if (shoe === 5) o.push(`<path d="M${x - lw} ${fy - 1} L${x + lw} ${fy + 2}" stroke="${SH[0]}" stroke-width="1.5"/>`);
    if (shoe === 9) o.push(`<ellipse cx="${x}" cy="${fy + 1}" rx="${lw + 4}" ry="5" fill="#FFFFFF" opacity=".6"/>`);
  }
  // the top: a torso, longer for dresses and coats
  const long = top === 10 ? hy + 40 : top === 18 ? hy + 34 : hy + 4, lowW = top === 10 ? hp + 12 : top === 18 ? hp + 7 : hp + 1;
  const body = `M${cx - sw} ${sy + 3} Q${cx - sw - 1} ${sy - 3} ${cx - sw + 9} ${sy - 4} L${cx - 9} 84 Q${cx} 89 ${cx + 9} 84 L${cx + sw - 9} ${sy - 4} Q${cx + sw + 1} ${sy - 3} ${cx + sw} ${sy + 3} L${cx + ww + 1} ${wy} L${cx + lowW} ${long} L${cx - lowW} ${long} L${cx - ww - 1} ${wy} Z`;
  const tc = top === 19 ? '#F4F2EE' : cloth;
  o.push(`<path d="${body}" fill="${tc}" stroke="${mixHex(tc, '#000', .35)}" stroke-width=".9"/>`);
  const shadeTop = `<defs><linearGradient id="${uid}ts" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".14"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".2"/></linearGradient></defs><path d="${body}" fill="url(#${uid}ts)"/>`;
  // pattern on top (Hawaiian shirts come patterned)
  const pat = top === 16 && !L.pattern ? 4 : top === 2 && !L.pattern ? 2 : L.pattern || 0;
  if (pat && top !== 19) { const pc = mixHex(cloth, pat === 6 ? '#3B2516' : '#FFFFFF', pat === 6 ? .6 : .55), P0 = {
      1: `<rect width="8" height="3.5" fill="${pc}"/>`, 2: `<rect width="8" height="3" fill="${pc}" opacity=".7"/><rect width="3" height="8" fill="${pc}" opacity=".7"/>`, 3: `<circle cx="4" cy="4" r="1.6" fill="${pc}"/>`,
      4: `<circle cx="4" cy="4" r="1.3" fill="#FFE27A"/><circle cx="2.3" cy="4" r="1.1" fill="${pc}"/><circle cx="5.7" cy="4" r="1.1" fill="${pc}"/><circle cx="4" cy="2.3" r="1.1" fill="${pc}"/><circle cx="4" cy="5.7" r="1.1" fill="${pc}"/>`,
      5: `<circle cx="2" cy="2" r="3" fill="#E85D9A" opacity=".5"/><circle cx="6" cy="6" r="3" fill="#1FA3A0" opacity=".5"/><circle cx="6" cy="1" r="2" fill="#E3A72F" opacity=".5"/>`,
      6: `<ellipse cx="3" cy="3" rx="1.6" ry="1.1" fill="none" stroke="${pc}" stroke-width=".9"/><ellipse cx="6.5" cy="6.5" rx="1.2" ry=".9" fill="${pc}"/>`, 7: `<rect width=".6" height="8" fill="${pc}"/>`,
      8: `<circle cx="2" cy="3" r="2.4" fill="#4E5B3A" opacity=".6"/><circle cx="6.5" cy="6" r="2.2" fill="#2F3A24" opacity=".6"/><circle cx="6" cy="1.5" r="1.4" fill="#8C8A5A" opacity=".6"/>`,
      9: `<path d="M4 1.5 l.7 1.6 l1.7 .1 l-1.3 1.1 l.4 1.7 l-1.5 -.9 l-1.5 .9 l.4 -1.7 l-1.3 -1.1 l1.7 -.1 z" fill="${pc}"/>` }[pat];
    o.push(`<defs><pattern id="${uid}pt" width="8" height="8" patternUnits="userSpaceOnUse"${pat === 1 || pat === 7 ? ' patternTransform="rotate(90)"' : ''}>${P0}</pattern></defs><path d="${body}" fill="url(#${uid}pt)"/>`); }
  o.push(shadeTop);
  // fabric folds: a crease at each armpit and two at the waist, so cloth reads as cloth
  if (top !== 19) o.push(`<path d="M${cx - sw + 5} ${sy + 12} q4 3 6 9 M${cx + sw - 5} ${sy + 12} q-4 3 -6 9 M${cx - ww + 2} ${wy - 4} q5 3 9 2 M${cx + ww - 2} ${wy - 6} q-5 3 -8 3" stroke="${mixHex(top === 19 ? '#F4F2EE' : cloth, '#000', .4)}" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".55"/>`);
  // the garment's own details
  if (top === 19) o.push(`<path d="M${cx - ww} 104 L${cx + ww} 104 L${cx + ww + 1} ${wy} L${cx + hp + 1} ${hy + 4} L${cx - hp - 1} ${hy + 4} L${cx - ww - 1} ${wy} Z" fill="${cloth}"/><path d="M${cx - ww + 2} 104 L${cx - sw + 6} ${sy - 3} M${cx + ww - 2} 104 L${cx + sw - 6} ${sy - 3}" stroke="${cloth}" stroke-width="3"/><circle cx="${cx - ww + 3}" cy="106" r="1.3" fill="#E3C27A"/><circle cx="${cx + ww - 3}" cy="106" r="1.3" fill="#E3C27A"/><rect x="${cx - 5}" y="112" width="10" height="8" rx="1" fill="${dkc}"/>`);
  if (top === 13) o.push(`<path d="M${cx + 1} 98 L${cx - 5} 112 L${cx} 112 L${cx - 3} 124 L${cx + 6} 106 L${cx + 1} 106 L${cx + 4} 98 Z" fill="#FFE27A"/><circle cx="${cx}" cy="111" r="11" fill="none" stroke="#FFFFFF" stroke-width="1" opacity=".6"/>`);
  if (top === 14) o.push(Array.from({ length: 26 }, (_, i) => `<circle cx="${cx - sw + 4 + pr() * (sw * 2 - 8)}" cy="${sy + 2 + pr() * (hy - sy - 2)}" r="${.6 + pr() * .8}" fill="#FFFFFF" opacity="${.4 + pr() * .5}"/>`).join(''));
  if (top === 15 || top === 12) o.push(`<path d="M${cx - 7} 86 L${cx - 4} ${hy + 3} L${cx + 4} ${hy + 3} L${cx + 7} 86 Z" fill="${top === 12 ? '#151515' : '#F4F2EE'}"/>${top === 15 ? [96, 108, 120, 132].map(y => `<circle cx="${cx - 6}" cy="${y}" r="1" fill="${dkc}"/>`).join('') : `<path d="M${cx - sw} ${sy + 3} L${cx - sw - 6} 124 L${cx - sw + 4} 124 Z M${cx + sw} ${sy + 3} L${cx + sw + 6} 124 L${cx + sw - 4} 124 Z" fill="${cloth}"/>`}`);
  if (top === 17) o.push([98, 108, 118, 128, 138].map(y => `<path d="M${cx - sw + 1} ${y} Q${cx} ${y + 2} ${cx + sw - 1} ${y}" stroke="${dkc}" stroke-width="1" fill="none"/>`).join(''));
  if (top === 18) o.push(`<rect x="${cx - ww - 2}" y="${wy - 2}" width="${ww * 2 + 4}" height="4" fill="${dkc}"/><rect x="${cx - 3}" y="${wy - 2.5}" width="6" height="5" fill="none" stroke="#C9A646" stroke-width="1"/><path d="M${cx} 88 L${cx} ${long}" stroke="${dkc}" stroke-width=".8"/>`);
  if (top === 4) o.push(`<path d="M${cx + 2} 90 L${cx + 1} ${hy}" stroke="#C0C0C0" stroke-width="1"/>`);
  if (top === 3) o.push(`<path d="M${cx - sw + 4} 104 Q${cx - 6} 106 ${cx - 2} 104 M${cx + 2} 104 Q${cx + 6} 106 ${cx + sw - 4} 104" stroke="${mixHex(cloth, '#fff', .35)}" stroke-width=".8" fill="none"/>`);
  if (top === 10) o.push(`<rect x="${cx - ww - 1}" y="${wy - 2}" width="${ww * 2 + 2}" height="3" fill="${dkc}"/>`);
  // arms: sleeves in the top's colour, short sleeves showing skin
  const short = [0, 10, 13, 16, 19].includes(top), sleeve = top === 19 ? '#F4F2EE' : top === 11 ? cloth : cloth, aw = [5, 5.5, 6, 6.5, 7, 7.5, 4.8, 5, 7.5, 6.3][b] + FT.mus * .22 + Math.max(0, FT.mass) * .12, wide = top === 12 ? 4 : top === 17 ? 2 : 0;
  const arm = (pts, side) => {
    const [s, e, h] = pts, path = `M${s[0]} ${s[1]} Q${e[0]} ${e[1]} ${h[0]} ${h[1]}`;
    o.push(`<path d="${path}" stroke="${mixHex(short ? skin : sleeve, '#000', .35)}" stroke-width="${aw * 2 + 1.6}" stroke-linecap="round" fill="none"/><path d="${path}" stroke="${short ? skin : sleeve}" stroke-width="${aw * 2}" stroke-linecap="round" fill="none"/>`);
    if (short) o.push(`<path d="M${s[0]} ${s[1]} L${s[0] + (e[0] - s[0]) * .45} ${s[1] + (e[1] - s[1]) * .45}" stroke="${mixHex(sleeve, '#000', .35)}" stroke-width="${aw * 2 + 2.6}" stroke-linecap="round"/><path d="M${s[0]} ${s[1]} L${s[0] + (e[0] - s[0]) * .45} ${s[1] + (e[1] - s[1]) * .45}" stroke="${sleeve}" stroke-width="${aw * 2 + 1}" stroke-linecap="round"/>`);
    else if (wide) o.push(`<path d="M${(s[0] + e[0]) / 2} ${(s[1] + e[1]) / 2} Q${e[0]} ${e[1]} ${h[0] + (side < 0 ? -1 : 1) * 1} ${h[1] - 6}" stroke="${sleeve}" stroke-width="${aw * 2 + wide * 2}" stroke-linecap="round" fill="none"/>`);
    if (top === 11) o.push(`<path d="${path}" stroke="#FFFFFF" stroke-width="1.2" fill="none" transform="translate(${side * (aw - 1.5)} 0)"/>`);
    o.push(figHand(h[0], h[1] + 2.5, aw, side, skin));
    if (tat === 1 && side < 0 && short) o.push(`<path d="M${e[0] - 2} ${e[1] + 4} q3 4 0 8 q-3 4 0 8" stroke="#2B3A66" stroke-width="1.6" fill="none" opacity=".75"/>`);
    if (tat === 2 && side < 0) o.push(`<circle cx="${h[0]}" cy="${h[1] - 4}" r="1.3" fill="#2B3A66" opacity=".75"/>`);
    if (tat === 3 && side > 0) o.push(`<path d="M${h[0] - 1.5} ${h[1] + 1} l3 0 l-1.5 2.5 z" fill="#2B3A66" opacity=".8"/>`);
    if (L.wrist && side < 0) { const band = ['', '#3B3226', '#C9A646', '#8C6A2E', '#1E1E1E'][L.wrist]; o.push(`<rect x="${h[0] - aw}" y="${h[1] - 4}" width="${aw * 2}" height="${L.wrist === 2 ? 2 : 3}" fill="${band}"/>${L.wrist !== 2 ? `<rect x="${h[0] - 2.2}" y="${h[1] - 5}" width="4.4" height="4.4" rx="${L.wrist === 4 ? 1 : 2.2}" fill="${L.wrist === 4 ? '#2C4F7C' : '#F3EFF8'}" stroke="${band}" stroke-width=".8"/>` : ''}`); }
  };
  const lS = [cx - sw + 3, sy + 3], rS = [cx + sw - 3, sy + 3];
  const down = side => [side < 0 ? lS : rS, [cx + side * (sw + 4), 118], [cx + side * (sw + 4), 146]];
  if (pose === 3) {   // arms crossed
    o.push(`<path d="M${cx - sw + 2} 112 Q${cx} 106 ${cx + sw - 2} 116" stroke="${short ? skin : sleeve}" stroke-width="${aw * 2}" stroke-linecap="round" fill="none"/><path d="M${cx + sw - 2} 110 Q${cx} 116 ${cx - sw + 2} 120" stroke="${short ? skin : sleeve}" stroke-width="${aw * 2}" stroke-linecap="round" fill="none"/><path d="M${lS[0]} ${lS[1]} L${cx - sw + 1} 112 M${rS[0]} ${rS[1]} L${cx + sw - 1} 110" stroke="${sleeve}" stroke-width="${aw * 2}" stroke-linecap="round"/>${figHand(cx + sw - 1, 116, aw, 1, skin)}${figHand(cx - sw + 1, 120, aw, -1, skin)}`);
  } else {
    arm(pose === 4 ? [lS, [cx - sw - 3, 118], [cx - hp + 3, 138]] : down(-1), -1);
    arm(pose === 1 ? [rS, [cx + sw + 12, 116], [cx + ww + 3, 132]] : pose === 2 ? [rS, [cx + sw + 12, 72], [cx + sw + 6, 50]] : pose === 4 ? [rS, [cx + sw + 3, 118], [cx + hp - 3, 138]] : down(1), 1);
  }
  // what you're carrying, in front
  const hx = cx + sw + 4, hyy = 148;
  if (bag === 1 && pose !== 3) o.push(`<path d="M${hx - 3} ${hyy} L${hx - 7} ${hyy + 6} L${hx + 9} ${hyy + 6} L${hx + 5} ${hyy}" stroke="#C9B48A" stroke-width="1.4" fill="none"/><rect x="${hx - 8}" y="${hyy + 6}" width="18" height="18" rx="1.5" fill="#E9DCC0"/><text x="${hx + 1}" y="${hyy + 17}" font-size="4" text-anchor="middle" fill="#7A2E2E" font-family="sans-serif" font-weight="700">FILM</text>`);
  if (bag === 2) o.push(`<path d="M${cx - sw + 6} ${sy - 2} L${cx - sw + 7} ${wy}" stroke="${dkb}" stroke-width="2.4"/><path d="M${cx + sw - 6} ${sy - 2} L${cx + sw - 7} ${wy}" stroke="${dkb}" stroke-width="2.4"/>`);
  if (bag === 3 || bag === 4) o.push(`<path d="M${cx - sw + 4} ${sy - 2} L${cx + hp + 4} ${hy - 4}" stroke="${bag === 3 ? '#1E1E1E' : '#6B4E3A'}" stroke-width="2.4"/><rect x="${cx + hp - 4}" y="${hy - 8}" width="${bag === 3 ? 16 : 20}" height="${bag === 3 ? 12 : 14}" rx="2" fill="${bag === 3 ? '#2B2B2B' : '#8A6A4A'}"/>${bag === 3 ? `<circle cx="${cx + hp + 4}" cy="${hy - 2}" r="3" fill="#555"/>` : `<rect x="${cx + hp - 4}" y="${hy - 8}" width="20" height="5" fill="#6B4E3A"/>`}`);
  if (bag === 5 && pose !== 3) o.push(`<rect x="${hx - 6}" y="${hyy}" width="13" height="7" rx="1.5" fill="#C9A646"/><rect x="${hx - 6}" y="${hyy}" width="13" height="2.5" fill="#A68631"/>`);
  if (bag === 7) o.push(`<g transform="rotate(-8 ${cx - sw} 118)"><rect x="${cx - sw - 8}" y="110" width="13" height="17" fill="#FFFFFF" stroke="#BBB" stroke-width=".6"/><path d="M${cx - sw - 6} 114 h9 M${cx - sw - 6} 117 h7 M${cx - sw - 6} 120 h9" stroke="#999" stroke-width=".5"/></g>`);
  if (bag === 8 && pose !== 3) o.push(`<rect x="${hx - 3.5}" y="${hyy - 4}" width="7" height="10" rx="1" fill="#F4F2EE"/><rect x="${hx - 3.5}" y="${hyy - 1}" width="7" height="3" fill="#8A5A37"/><rect x="${hx - 4}" y="${hyy - 6}" width="8" height="2.5" rx="1" fill="#2B2B2B"/>`);
  if (bag === 9 && pose !== 3) o.push(`<circle cx="${hx + 1}" cy="${hyy + 6}" r="7" fill="#B9B5AE" stroke="#8A8680" stroke-width="1"/><circle cx="${hx + 1}" cy="${hyy + 6}" r="2" fill="#8A8680"/>`);
}
// a hand: palm, a thumb towards the body, a hint of knuckles
function figHand(x, y, aw, side, skin) {
  const d = mixHex(skin, '#000', .22);
  return `<ellipse cx="${x}" cy="${y}" rx="${(aw * .72).toFixed(2)}" ry="${(aw * .95).toFixed(2)}" fill="${skin}" stroke="${d}" stroke-width=".5"/><ellipse cx="${(x - side * aw * .62).toFixed(2)}" cy="${(y - aw * .2).toFixed(2)}" rx="${(aw * .26).toFixed(2)}" ry="${(aw * .5).toFixed(2)}" transform="rotate(${side * 25} ${(x - side * aw * .62).toFixed(2)} ${(y - aw * .2).toFixed(2)})" fill="${skin}" stroke="${d}" stroke-width=".4"/><path d="M${(x - aw * .4).toFixed(2)} ${(y + aw * .55).toFixed(2)} Q${x} ${(y + aw * .8).toFixed(2)} ${(x + aw * .4).toFixed(2)} ${(y + aw * .55).toFixed(2)}" stroke="${d}" stroke-width=".4" fill="none" opacity=".7"/>`;
}
// head-to-toe, for the places with room
function figureOf(p, h) { const age = (p.dead ? yearOf(p.deathW || S.week) : S.year) - p.born; return portraitSVG(lookOf(p), p.dead ? Math.min(age, 50) : age, h, false, true); }
