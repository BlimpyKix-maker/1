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
// The body, drawn under the head in the full-length frame (120 × 240). People are drawn about eight heads tall, as
// fashion illustrators do: the shoulders a head and a third below the chin, the elbow at the waist, the wrist at the
// crotch, the fingertips at mid-thigh, the knee halfway between hip and heel. Limbs are tapered shapes, not strokes.
const FIG = { sy: 54.6, wy: 93, hy: 111, cr: 121, kn: 166, an: 211, fy: 223 };
// a smooth closed or open path through points (Catmull-Rom as cubic Béziers)
function crPath(P, close) {
  const n = P.length, q = i => P[close ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${n1(P[0][0])} ${n1(P[0][1])}`;
  for (let i = 0; i < (close ? n : n - 1); i++) { const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${n1(p1[0] + (p2[0] - p0[0]) / 6)} ${n1(p1[1] + (p2[1] - p0[1]) / 6)} ${n1(p2[0] - (p3[0] - p1[0]) / 6)} ${n1(p2[1] - (p3[1] - p1[1]) / 6)} ${n1(p2[0])} ${n1(p2[1])}`; }
  return d + (close ? ' Z' : '');
}
// a limb: joints and a half-width at each, outlined smoothly with rounded ends
function limbPath(J, W) {
  const L = [], Rr = [];
  for (let i = 0; i < J.length; i++) { const a = J[Math.max(0, i - 1)], b = J[Math.min(J.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    L.push([J[i][0] + nx * W[i], J[i][1] + ny * W[i]]); Rr.push([J[i][0] - nx * W[i], J[i][1] - ny * W[i]]); }
  const e = J[J.length - 1], e0 = J[J.length - 2], el = Math.hypot(e[0] - e0[0], e[1] - e0[1]) || 1, ux = (e[0] - e0[0]) / el, uy = (e[1] - e0[1]) / el, we = W[W.length - 1];
  const s = J[0], s1 = J[1], sl = Math.hypot(s1[0] - s[0], s1[1] - s[1]) || 1, vx = (s[0] - s1[0]) / sl, vy = (s[1] - s1[1]) / sl, ws = W[0];
  return crPath(L).replace(/^M/, 'M') + ` Q${n1(e[0] + ux * we * 1.2)} ${n1(e[1] + uy * we * 1.2)} ${n1(Rr[Rr.length - 1][0])} ${n1(Rr[Rr.length - 1][1])}` + crPath(Rr.slice().reverse()).replace(/^M[^C]*/, ' ') + ` Q${n1(s[0] + vx * ws * 1.1)} ${n1(s[1] + vy * ws * 1.1)} ${n1(L[0][0])} ${n1(L[0][1])} Z`;
}
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function figureBody(L, o, uid, cx, skin, cloth, pr) {
  const b = L.build || 0, top = L.outfit, bot = L.bottoms || 0, shoe = L.shoes || 0, pose = L.pose || 0, bag = L.bag || 0, tat = L.tattoo || 0;
  const FT = L._fit || { mus: 0, mass: 0 };
  const sw = [19.5, 20.5, 22, 23.5, 25.5, 27, 18, 18.5, 25.5, 21][b] + FT.mus * .5 + FT.mass * .3, ww = [11.5, 12.5, 14, 16, 18, 21.5, 11, 11, 15, 12.5][b] + FT.mass * .8 - FT.mus * .1, hp = [14, 14.5, 16, 17.5, 19, 23, 13.5, 13.5, 16.5, 19.5][b] + FT.mass * .45;
  const af = [.92, .96, 1, 1.06, 1.12, 1.22, .88, .9, 1.16, 1][b] + FT.mus * .025 + Math.max(0, FT.mass) * .02, lf = [.95, .98, 1, 1.05, 1.1, 1.2, .9, .9, 1.12, 1.08][b] + Math.max(0, FT.mass) * .02;
  const dl = b === 7 ? 4 : b === 6 ? -5 : 0, { sy, wy, hy, cr } = FIG, kn = FIG.kn + dl * .5, an = FIG.an + dl, fy = FIG.fy + dl;
  const nb = neckHalf(L) * .7, bc = FIG_COLOURS[L.bottomColour || 0], dkc = mixHex(cloth, '#000', .3), dkb = mixHex(bc, '#000', .3), shade = mixHex(skin, '#2A140C', .22), sline = mixHex(skin, '#1A0E0A', .5);
  const tc = top === 19 ? '#F4F2EE' : cloth, tline = mixHex(tc, '#000', .38);
  // the floor shadow, under everything
  o.push(`<ellipse cx="${cx}" cy="${n1(fy + 2)}" rx="${n1(hp + 12)}" ry="3.2" fill="#000" opacity=".14"/>`);
  // behind the body: a guitar case, a backpack
  if (bag === 6) o.push(`<g transform="rotate(14 ${cx + 6} 110)"><path d="M${cx + 2} 46 Q${cx + 13} 42 ${cx + 15} 56 L${cx + 19} 128 Q${cx + 25} 150 ${cx + 9} 156 Q${cx - 7} 150 ${cx} 128 Z" fill="#2B2B2B"/><path d="M${cx + 8} 52 L${cx + 10} 150" stroke="#555" stroke-width=".8"/></g>`);
  if (bag === 2) o.push(`<rect x="${n1(cx - sw + 3)}" y="${sy + 4}" width="${n1((sw - 3) * 2)}" height="36" rx="7" fill="${mixHex(bc, '#fff', .15)}"/>`);
  // legs, skin first
  const legs = [-1, 1].map(s => { const lc = cx + s * hp * .5, w = lf;
    const P = [[cx + s * hp, hy - 2], [cx + s * (hp + .3), hy + 14], [lc + s * 6.6 * w, kn - 16], [lc + s * 5.2 * w, kn], [lc + s * 5.8 * w, kn + 15], [lc + s * 3.1, an], [lc - s * 3.1, an], [lc - s * 4.6 * w, kn + 17], [lc - s * 4.3 * w, kn], [lc - s * 5.4 * w, kn - 20], [cx + s * 1.2, cr + 2], [cx + s * .6, hy - 2]];
    return { s, lc, P }; });
  for (const g of legs) o.push(`<path d="${crPath(g.P, true)}" fill="${skin}" stroke="${shade}" stroke-width=".4"/><path d="M${n1(g.lc - g.s * 1.5)} ${n1(kn - 1)} q${n1(g.s * 1.5)} 1.6 ${n1(g.s * 3)} 0" stroke="${shade}" stroke-width=".4" fill="none" opacity=".5"/>`);
  // what covers them
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19, legC = top === 19 ? cloth : bc, legD = top === 19 ? dkc : dkb;
  const trouser = (g, ex, flare, hem) => { const s = g.s, lc = g.lc; return crPath([[cx + s * (hp + ex + .4), hy - 4], [cx + s * (hp + ex + .5), hy + 14], [lc + s * (6.6 * lf + ex), kn - 16], [lc + s * (5.4 * lf + ex), kn], [lc + s * (5.6 * lf + ex + flare * .5), kn + 18], [lc + s * (4.6 + ex + flare), hem]], false) + ` L${n1(lc - s * (4.6 + ex + flare))} ${n1(hem)} ` + crPath([[lc - s * (4.6 + ex + flare), hem], [lc - s * (4.8 * lf + ex + flare * .5), kn + 18], [lc - s * (4.5 * lf + ex), kn], [lc - s * (5.5 * lf + ex), kn - 20], [cx + s * .2, cr + 2.5]], false).replace(/^M[^C]*/, ' ') + ` L${cx} ${hy - 4} Z`; };
  if (longLeg) {
    const ex = bot === 9 && top !== 19 ? .25 : bot === 1 && top !== 19 ? .6 : bot === 8 && top !== 19 ? 1.8 : 1.2, flare = bot === 8 && top !== 19 ? 4 : 0, hem = an + (bot === 9 || bot === 1 ? 0 : 3);
    for (const g of legs) o.push(`<path d="${trouser(g, ex, flare, hem)}" fill="${legC}" stroke="${legD}" stroke-width=".5"/>`);
    o.push(`<path d="M${n1(cx - ww - 1)} ${wy - 1} L${n1(cx + ww + 1)} ${wy - 1} C${n1(cx + ww + .6)} ${wy + 7} ${n1(cx + hp + 1.4)} ${hy - 9} ${n1(cx + hp + 1.6)} ${hy} L${cx} ${cr + 2} L${n1(cx - hp - 1.6)} ${hy} C${n1(cx - hp - 1.4)} ${hy - 9} ${n1(cx - ww - .6)} ${wy + 7} ${n1(cx - ww - 1)} ${wy - 1} Z" fill="${legC}"/><path d="M${cx} ${wy + 2} L${cx} ${cr - 2}" stroke="${legD}" stroke-width=".5" opacity=".7"/>`);
    for (const g of legs) o.push(`<path d="M${n1(g.lc)} ${hy + 10} L${n1(g.lc + g.s * .4)} ${n1(an - 2)}" stroke="${legD}" stroke-width=".45" opacity=".35"/>`);
    if (bot === 0 && top !== 19) for (const g of legs) o.push(`<path d="M${n1(cx + g.s * (ww - 2))} ${wy + 1} Q${n1(cx + g.s * (ww + 1))} ${wy + 6} ${n1(cx + g.s * (hp + .5))} ${wy + 7}" stroke="${mixHex(bc, '#fff', .35)}" stroke-width=".5" fill="none" stroke-dasharray="1 .8"/>`);
    if (bot === 7) for (const g of legs) o.push(`<rect x="${n1(g.lc + g.s * 2.6 - 3.4)}" y="${n1(kn - 22)}" width="6.8" height="9" rx="1.2" fill="${legD}" opacity=".8"/>`);
    if (bot === 6) for (const g of legs) o.push(`<path d="M${n1(g.lc)} ${hy + 4} L${n1(g.lc + g.s * .4)} ${n1(an)}" stroke="${mixHex(bc, '#fff', .35)}" stroke-width=".6"/>`);
  } else if (bot === 3) for (const g of legs) o.push(`<path d="${trouser(g, 1.2, 1.5, hy + 26).replace(/kn/g, '')}" fill="${bc}" stroke="${dkb}" stroke-width=".5"/>`);
  if (bot === 3) o.push(`<path d="M${n1(cx - ww - 1)} ${wy - 1} L${n1(cx + ww + 1)} ${wy - 1} C${n1(cx + ww + .6)} ${wy + 7} ${n1(cx + hp + 1.4)} ${hy - 9} ${n1(cx + hp + 1.8)} ${hy + 6} L${cx} ${cr + 2} L${n1(cx - hp - 1.8)} ${hy + 6} C${n1(cx - hp - 1.4)} ${hy - 9} ${n1(cx - ww - .6)} ${wy + 7} ${n1(cx - ww - 1)} ${wy - 1} Z" fill="${bc}"/>`);
  if ((bot === 4 || bot === 5) && top !== 10 && top !== 19) { const hem = bot === 4 ? hy + 24 : an - 16, wd = bot === 4 ? hp + 4 : hp + 10;
    o.push(`<path d="M${n1(cx - ww - 1)} ${wy - 1} L${n1(cx + ww + 1)} ${wy - 1} C${n1(cx + ww + 1)} ${wy + 8} ${n1(cx + hp + 1.5)} ${hy - 6} ${n1(cx + hp + 1.8)} ${hy} L${n1(cx + wd)} ${n1(hem)} Q${cx} ${n1(hem + 2.5)} ${n1(cx - wd)} ${n1(hem)} L${n1(cx - hp - 1.8)} ${hy} C${n1(cx - hp - 1.5)} ${hy - 6} ${n1(cx - ww - 1)} ${wy + 8} ${n1(cx - ww - 1)} ${wy - 1} Z" fill="${bc}" stroke="${dkb}" stroke-width=".5"/>` + (bot === 5 ? `<path d="M${cx - 4} ${hy} L${cx - 7} ${n1(hem - 1)} M${cx + 5} ${hy} L${cx + 9} ${n1(hem - 1)}" stroke="${dkb}" stroke-width=".5" opacity=".5"/>` : '')); }
  if (tat === 4) o.push(`<path d="M${n1(legs[0].lc - 2)} ${n1(an - 8)} l2 -2 l2 2 l-2 2 z" fill="#2B3A66" opacity=".7"/>`);
  // shoes: a slim shape from the ankle to a toe turned slightly out
  const SH = [['#F4F2EE', cloth], ['#C8102E', '#F4F2EE'], ['#5A3A22', '#3B2516'], ['#3B2516', '#2A1A10'], ['#151515', '#8C2E2E'], ['#B98A55', skin], ['#7A4A28', '#4E2E18'], ['#151515', '#333'], ['#B98A55', '#8C5A2E'], ['#F2C6D6', '#FFFFFF']][shoe];
  for (const g of legs) { const s = g.s, lc = g.lc, shaft = [0, 6, 16, 0, 0, 0, 0, 18, 17, 3][shoe], sole = shoe === 7 ? 2.6 : shoe === 4 ? .6 : 1.1, toe = shoe === 4 ? 1.4 : 2.4;
    if (shoe === 5) { o.push(`<path d="M${n1(lc - 3)} ${n1(an + 1)} L${n1(lc + 3.2)} ${n1(an + 1)} L${n1(lc + 4 + s * toe)} ${n1(fy - 1)} L${n1(lc - 3.8 + s * 1.2)} ${n1(fy - 1)} Z" fill="${skin}"/><path d="M${n1(lc - 3.4)} ${n1(an + 4)} L${n1(lc + 3.6)} ${n1(an + 6)} M${n1(lc - 3.8)} ${n1(fy - 3.5)} L${n1(lc + 4.2 + s)} ${n1(fy - 3)}" stroke="${SH[0]}" stroke-width="1.2"/><rect x="${n1(lc - 4.4 + s * 1.2)}" y="${n1(fy - 1.2)}" width="${n1(8.8 + toe)}" height="1.4" rx=".6" fill="${mixHex(SH[0], '#000', .3)}"/>`); continue; }
    if (shaft) o.push(`<path d="M${n1(lc - 4.2)} ${n1(an - shaft)} L${n1(lc + 4.2)} ${n1(an - shaft)} L${n1(lc + 3.8)} ${n1(an + 2)} L${n1(lc - 3.8)} ${n1(an + 2)} Z" fill="${SH[0]}" stroke="${mixHex(SH[0], '#000', .4)}" stroke-width=".4"/>`);
    o.push(`<path d="M${n1(lc - 3.4)} ${n1(an + 1)} C${n1(lc - 3.8)} ${n1(an + 6)} ${n1(lc - 4.8 + s * .8)} ${n1(fy - 3)} ${n1(lc - 4.4 + s * 1)} ${n1(fy - sole)} L${n1(lc + 4.4 + s * toe)} ${n1(fy - sole)} C${n1(lc + 4.8 + s * toe)} ${n1(fy - 3.4)} ${n1(lc + 3.8)} ${n1(an + 6)} ${n1(lc + 3.4)} ${n1(an + 1)} Z" fill="${SH[0]}" stroke="${mixHex(SH[0], '#000', .45)}" stroke-width=".45"/><path d="M${n1(lc - 4.6 + s * 1)} ${n1(fy - sole)} L${n1(lc + 4.6 + s * toe)} ${n1(fy - sole)} L${n1(lc + 4.4 + s * toe)} ${n1(fy)} L${n1(lc - 4.4 + s * 1)} ${n1(fy)} Z" fill="${SH[1]}"/><path d="M${n1(lc - 1.5)} ${n1(fy - 5)} Q${n1(lc + s * .8)} ${n1(fy - 6.5)} ${n1(lc + 2.4)} ${n1(fy - 4.8)}" stroke="#FFFFFF" stroke-width=".5" fill="none" opacity=".35"/>`);
    if (shoe === 4) o.push(`<rect x="${n1(lc - s * 3.2 - .8)}" y="${n1(fy - 1)}" width="1.6" height="1.8" fill="${SH[0]}"/>`);
    if (shoe === 9) o.push(`<ellipse cx="${n1(lc + s * 1)}" cy="${n1(fy - 3)}" rx="6" ry="4.2" fill="#FFFFFF" opacity=".55"/>`);
    if (shoe === 1) o.push(`<circle cx="${n1(lc - s * 2.6)}" cy="${n1(an - 2)}" r="1.3" fill="#FFFFFF"/>`); }
  // the top: shoulders that slope from the neck, a waist, a hem at the hip (lower for dresses and coats)
  const puff = top === 17 ? 2 : 0, sW = sw + puff, wW = ww + puff * .8;
  const hem = top === 10 ? kn - 4 : top === 18 ? kn - 8 : hy + 5, hW = top === 10 ? hp + 9 : top === 18 ? hp + 7 : hp + 1.4;
  const half = s => [[cx + s * (nb + 3.2), sy], [cx + s * (sW - 6), sy + .6], [cx + s * (sW - 1), sy + 3], [cx + s * sW, sy + 8], [cx + s * (sW - 2.2), sy + 15.5], [cx + s * (wW + 2.4), wy - 12], [cx + s * (wW + .4), wy], [cx + s * (hp + 1.4), hy - 2]];
  const R0 = half(1), L0 = half(-1).reverse();
  const body = crPath(R0) + ` L${n1(cx + hW)} ${n1(hem)} Q${cx} ${n1(hem + 1.5)} ${n1(cx - hW)} ${n1(hem)} L${n1(L0[0][0])} ${n1(L0[0][1])}` + crPath(L0).replace(/^M[^C]*/, ' ') + ` Q${cx} ${sy + 3.2} ${n1(R0[0][0])} ${n1(R0[0][1])} Z`;
  if (top === 1) o.push(`<path d="M${n1(cx - nb - 6)} ${sy + 1} Q${n1(cx - nb - 4)} ${sy - 9} ${cx} ${sy - 10} Q${n1(cx + nb + 4)} ${sy - 9} ${n1(cx + nb + 6)} ${sy + 1} Z" fill="${dkc}"/>`);
  o.push(`<path d="${body}" fill="${tc}" stroke="${tline}" stroke-width=".55"/>`);
  const pat = top === 16 && !L.pattern ? 4 : top === 2 && !L.pattern ? 2 : L.pattern || 0;
  if (pat && top !== 19) { const pc = mixHex(cloth, pat === 6 ? '#3B2516' : '#FFFFFF', pat === 6 ? .6 : .55), P0 = {
      1: `<rect width="6" height="2.6" fill="${pc}"/>`, 2: `<rect width="6" height="2.2" fill="${pc}" opacity=".6"/><rect width="2.2" height="6" fill="${pc}" opacity=".6"/>`, 3: `<circle cx="3" cy="3" r="1.1" fill="${pc}"/>`,
      4: `<circle cx="3" cy="3" r="1" fill="#FFE27A"/><circle cx="1.8" cy="3" r=".8" fill="${pc}"/><circle cx="4.2" cy="3" r=".8" fill="${pc}"/><circle cx="3" cy="1.8" r=".8" fill="${pc}"/><circle cx="3" cy="4.2" r=".8" fill="${pc}"/>`,
      5: `<circle cx="1.5" cy="1.5" r="2.2" fill="#E85D9A" opacity=".45"/><circle cx="4.5" cy="4.5" r="2.2" fill="#1FA3A0" opacity=".45"/><circle cx="4.5" cy=".8" r="1.4" fill="#E3A72F" opacity=".45"/>`,
      6: `<ellipse cx="2.2" cy="2.2" rx="1.2" ry=".8" fill="none" stroke="${pc}" stroke-width=".6"/><ellipse cx="4.8" cy="4.8" rx=".9" ry=".7" fill="${pc}"/>`, 7: `<rect width=".4" height="6" fill="${pc}"/>`,
      8: `<circle cx="1.5" cy="2.2" r="1.8" fill="#4E5B3A" opacity=".6"/><circle cx="4.8" cy="4.5" r="1.6" fill="#2F3A24" opacity=".6"/><circle cx="4.5" cy="1.1" r="1" fill="#8C8A5A" opacity=".6"/>`,
      9: `<path d="M3 1.1 l.5 1.2 l1.3 .1 l-1 .8 l.3 1.3 l-1.1 -.7 l-1.1 .7 l.3 -1.3 l-1 -.8 l1.3 -.1 z" fill="${pc}"/>` }[pat];
    o.push(`<defs><pattern id="${uid}pt" width="6" height="6" patternUnits="userSpaceOnUse"${pat === 1 || pat === 7 ? ' patternTransform="rotate(90)"' : ''}>${P0}</pattern></defs><path d="${body}" fill="url(#${uid}pt)"/>`); }
  o.push(`<defs><linearGradient id="${uid}ts" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".12"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".2"/></linearGradient></defs><path d="${body}" fill="url(#${uid}ts)"/>`);
  if (top !== 19 && top !== 17) o.push(`<path d="M${n1(cx - sW + 3.5)} ${sy + 16} q2.5 3 3.5 8 M${n1(cx + sW - 3.5)} ${sy + 16} q-2.5 3 -3.5 8 M${n1(cx - wW + 1)} ${wy - 3} q4 2 7 1.4 M${n1(cx + wW - 1)} ${wy - 4} q-4 2 -6.5 2" stroke="${tline}" stroke-width=".5" fill="none" stroke-linecap="round" opacity=".45"/>`);
  // the garment's own details
  const placket = (x, n, c2) => Array.from({ length: n }, (_, i) => `<circle cx="${n1(x)}" cy="${n1(sy + 9 + i * (wy - sy - 6) / Math.max(1, n - 1))}" r=".7" fill="${c2}"/>`).join('');
  if (top === 19) o.push(`<path d="M${n1(cx - ww + 1)} ${sy + 19} L${n1(cx + ww - 1)} ${sy + 19} L${n1(cx + ww + .4)} ${wy} L${n1(cx + hp + 1.4)} ${hy - 2} L${n1(cx - hp - 1.4)} ${hy - 2} L${n1(cx - ww - .4)} ${wy} Z" fill="${cloth}" stroke="${dkc}" stroke-width=".5"/><path d="M${n1(cx - ww + 2.4)} ${sy + 20} L${n1(cx - sw + 6)} ${sy + 1} M${n1(cx + ww - 2.4)} ${sy + 20} L${n1(cx + sw - 6)} ${sy + 1}" stroke="${cloth}" stroke-width="2.4"/><circle cx="${n1(cx - ww + 3)}" cy="${sy + 21}" r="1" fill="#E3C27A"/><circle cx="${n1(cx + ww - 3)}" cy="${sy + 21}" r="1" fill="#E3C27A"/><rect x="${cx - 4.5}" y="${sy + 25}" width="9" height="7" rx="1" fill="${dkc}"/>`);
  if (top === 1) o.push(`<path d="M${cx - 2.4} ${sy + 3} L${cx - 2.8} ${sy + 15} M${cx + 2.4} ${sy + 3} L${cx + 2.8} ${sy + 14}" stroke="#F4F2EE" stroke-width=".6"/><path d="M${n1(cx - ww + 1.5)} ${hy - 3} L${n1(cx - ww + 3)} ${wy - 4} L${n1(cx + ww - 3)} ${wy - 4} L${n1(cx + ww - 1.5)} ${hy - 3}" stroke="${dkc}" stroke-width=".6" fill="none"/>`);
  if (top === 2 || top === 7 || top === 16) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${tline}" stroke-width=".45"/>` + placket(cx + 1.1, 5, mixHex(tc, '#fff', .5)));
  if (top === 3) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${mixHex(cloth, '#fff', .3)}" stroke-width=".5" stroke-dasharray="1 .7"/>` + [-1, 1].map(s => `<rect x="${n1(cx + s * 7 - 3.2)}" y="${sy + 11}" width="6.4" height="5.6" rx=".6" fill="none" stroke="${mixHex(cloth, '#fff', .3)}" stroke-width=".5"/>`).join(''));
  if (top === 4) o.push(`<path d="M${cx + 1.5} ${sy + 4} L${cx - 1} ${n1(hem)}" stroke="#C0C0C0" stroke-width=".7"/><path d="M${n1(cx - nb - 3)} ${sy + .5} L${cx - 3} ${sy + 12} L${n1(cx - sw + 7)} ${sy + 4} Z M${n1(cx + nb + 3)} ${sy + .5} L${cx + 4} ${sy + 12} L${n1(cx + sw - 7)} ${sy + 4} Z" fill="${dkc}"/>`);
  if (top === 6 || top === 15) o.push(`<path d="M${n1(cx - hp - 1)} ${n1(hem - 3)} L${n1(cx + hp + 1)} ${n1(hem - 3)}" stroke="${tline}" stroke-width="1.6" opacity=".35"/>`);
  if (top === 15 || top === 12) o.push(`<path d="M${cx - 5} ${sy + 2} L${cx - 3} ${n1(hem)} L${cx + 3} ${n1(hem)} L${cx + 5} ${sy + 2} Z" fill="${top === 12 ? '#151515' : '#F4F2EE'}"/>` + (top === 15 ? placket(cx - 4.3, 4, dkc) : ''));
  if (top === 8 || top === 9) o.push(`<path d="M${n1(cx - nb - 2.4)} ${sy + .4} L${cx - 1.2} ${wy - 7} L${n1(cx - 7)} ${sy + 12} L${n1(cx - 9.5)} ${sy + 10} Z M${n1(cx + nb + 2.4)} ${sy + .4} L${cx + 1.2} ${wy - 7} L${n1(cx + 7)} ${sy + 12} L${n1(cx + 9.5)} ${sy + 10} Z" fill="${mixHex(cloth, '#000', .2)}"/><circle cx="${cx}" cy="${wy - 4}" r=".8" fill="${dkc}"/><circle cx="${cx}" cy="${wy + 1}" r=".8" fill="${dkc}"/><path d="M${n1(cx + sw - 11)} ${sy + 13} l5 0" stroke="#F4F2EE" stroke-width="1.2"/>`);
  if (top === 10) o.push(`<path d="M${n1(cx - ww - .5)} ${wy} Q${cx} ${wy + 1.5} ${n1(cx + ww + .5)} ${wy}" stroke="${dkc}" stroke-width="1.4" fill="none"/><path d="M${cx - 5} ${wy + 3} L${n1(cx - 9)} ${n1(hem - 1)} M${cx + 5} ${wy + 3} L${n1(cx + 10)} ${n1(hem - 1)}" stroke="${dkc}" stroke-width=".5" opacity=".5"/>`);
  if (top === 11) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="#D8D8D8" stroke-width=".6"/>`);
  if (top === 13) o.push(`<path d="M${cx + 1} ${sy + 10} L${cx - 4} ${sy + 20} L${cx} ${sy + 20} L${cx - 2.5} ${sy + 29} L${cx + 5} ${sy + 16} L${cx + 1} ${sy + 16} L${cx + 3.5} ${sy + 10} Z" fill="#FFE27A"/><circle cx="${cx}" cy="${sy + 19}" r="9" fill="none" stroke="#FFFFFF" stroke-width=".7" opacity=".6"/>`);
  if (top === 14) o.push(Array.from({ length: 30 }, () => `<circle cx="${n1(cx - sw + 4 + pr() * (sw * 2 - 8))}" cy="${n1(sy + 3 + pr() * (hy - sy - 4))}" r="${n1(.4 + pr() * .6)}" fill="#FFFFFF" opacity="${n1(.4 + pr() * .5)}"/>`).join(''));
  if (top === 17) o.push([sy + 12, sy + 22, wy - 8, wy + 2, hy - 4].map(y => `<path d="M${n1(cx - sW + 2)} ${n1(y)} Q${cx} ${n1(y + 1.8)} ${n1(cx + sW - 2)} ${n1(y)}" stroke="${dkc}" stroke-width=".7" fill="none"/>`).join('') + `<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${dkc}" stroke-width=".6"/>`);
  if (top === 18) o.push(`<rect x="${n1(cx - ww - 1.5)}" y="${wy - 1.5}" width="${n1(ww * 2 + 3)}" height="3" fill="${dkc}"/><rect x="${cx - 2.4}" y="${wy - 2}" width="4.8" height="4" fill="none" stroke="#C9A646" stroke-width=".8"/><path d="M${cx + 2} ${sy + 4} L${cx + 3} ${n1(hem)}" stroke="${dkc}" stroke-width=".6"/><path d="M${n1(cx - nb - 2.4)} ${sy + .4} L${cx - 1} ${sy + 15} L${n1(cx - 9)} ${sy + 11} Z M${n1(cx + nb + 2.4)} ${sy + .4} L${cx + 1} ${sy + 15} L${n1(cx + 9)} ${sy + 11} Z" fill="${dkc}"/>` + [-1, 1].map(s => [sy + 18, sy + 26, wy + 5].map(y => `<circle cx="${n1(cx + s * 4.5)}" cy="${n1(y)}" r=".75" fill="${dkc}"/>`).join('')).join(''));
  // arms: tapered shapes from the shoulder through the elbow to the wrist, sleeves over them, then the hands
  const short = [0, 10, 13, 16, 19].includes(top), sleeve = top === 19 ? '#F4F2EE' : cloth, sleeveD = mixHex(sleeve, '#000', .38), wide = top === 12 ? 2.6 : top === 17 ? 1.8 : 0;
  const Sj = s => [cx + s * (sw - 4.2), sy + 8.4];
  const hang = s => { const S0 = Sj(s), E = [cx + s * Math.max(sw - .6, ww + 7), sy + 44], W = [cx + s * Math.max(hp + 5.4, ww + 7.6), sy + 73]; return [S0, E, W]; };
  let A = { [-1]: hang(-1), 1: hang(1) }, hands = { [-1]: 'open', 1: 'open' };
  if (pose === 1) { A[1] = [Sj(1), [cx + sw + 10.5, sy + 27], [cx + ww + 3.6, wy - 1]]; hands[1] = 'fist'; }
  if (pose === 2) { A[1] = [Sj(1), [cx + sw + 9, sy + 19], [cx + sw + 11, sy - 8]]; hands[1] = 'wave'; }
  if (pose === 4) for (const s of [-1, 1]) { A[s] = [Sj(s), [cx + s * (ww + 9), sy + 40], [cx + s * (hp - 2.4), hy + 3]]; hands[s] = 'pocket'; }
  const crossed = pose === 3;
  const armW = (J) => { const t = af; return { J: [J[0], lerp2(J[0], J[1], .35), J[1], lerp2(J[1], J[2], .3), J[2]], W: [4.1 * t, 4.1 * t, 3.1 * t, 3.4 * t, 2.35 * t] }; };
  const drawArm = (s, J, part) => {   // part: 'all' | 'upper' | 'fore'
    const { J: J5, W } = armW(J), up = [J5[0], J5[1], J5[2]], fo = [J5[2], J5[3], J5[4]], wu = W.slice(0, 3), wf = W.slice(2);
    const seg = (pts, w, col, stroke) => `<path d="${limbPath(pts, w)}" fill="${col}" stroke="${stroke}" stroke-width=".45"/>`;
    const out = [];
    if (part !== 'fore') out.push(seg(up, wu, short ? skin : sleeve, short ? shade : sleeveD));
    if (part !== 'upper') out.push(seg(fo, wf, short ? skin : sleeve, short ? shade : sleeveD));
    if (short && part !== 'fore') { const e = lerp2(J5[0], J5[2], .42); out.push(seg([J5[0], lerp2(J5[0], e, .5), e], [wu[0] + .45, wu[1] + .5, wu[1] + .45], sleeve, sleeveD)); }
    if (!short && wide && part !== 'upper') out.push(seg([lerp2(J5[2], J5[4], .2), lerp2(J5[2], J5[4], .6), lerp2(J5[2], J5[4], .92)], [wf[0] + wide * .5, wf[1] + wide, wf[2] + wide * 1.2], sleeve, sleeveD));
    if (top === 11 && part !== 'fore') out.push(`<path d="M${n1(J5[0][0] + s * 2)} ${n1(J5[0][1])} L${n1(J5[2][0] + s * 1.6)} ${n1(J5[2][1])}" stroke="#FFFFFF" stroke-width=".8"/>`);
    if (!short && part !== 'upper') { const c0 = lerp2(J5[2], J5[4], .9); out.push(`<path d="${limbPath([c0, J5[4]], [wf[2] + .5, wf[2] + .5])}" fill="${mixHex(sleeve, '#000', .15)}"/>`); }
    return out.join('');
  };
  const handAt = (s, J, kind) => { const W = J[2], E = J[1], l = Math.hypot(W[0] - E[0], W[1] - E[1]) || 1; return figHand(W, [(W[0] - E[0]) / l, (W[1] - E[1]) / l], s, skin, af, kind); };
  if (crossed) {
    const E = { [-1]: [cx - sw + 1.5, sy + 31], 1: [cx + sw - 1.5, sy + 31] }, Wl = [cx + sw - 8, sy + 27], Wr = [cx - sw + 8, sy + 22];
    const lf2 = [E[-1], lerp2(E[-1], Wl, .5), Wl], rf2 = [E[1], lerp2(E[1], Wr, .5), Wr];
    o.push(drawArm(-1, [Sj(-1), E[-1], Wl], 'fore') + figHand(Wl, [1, -.25], -1, skin, af, 'fist'));
    o.push(drawArm(1, [Sj(1), E[1], Wr], 'upper') + drawArm(-1, [Sj(-1), E[-1], Wl], 'upper'));
    o.push(drawArm(1, [Sj(1), E[1], Wr], 'fore') + figHand(Wr, [-1, -.3], 1, skin, af, 'fist'));
    A = { [-1]: [Sj(-1), E[-1], Wl], 1: [Sj(1), E[1], Wr] };
  } else for (const s of [-1, 1]) { o.push(drawArm(s, A[s], 'all')); if (hands[s] !== 'pocket') o.push(handAt(s, A[s], hands[s])); else o.push(`<path d="M${n1(A[s][2][0] - 3.6)} ${n1(A[s][2][1] - 1)} Q${n1(A[s][2][0])} ${n1(A[s][2][1] + 1.2)} ${n1(A[s][2][0] + 3.6)} ${n1(A[s][2][1] - 1)}" stroke="${longLeg ? legD : dkb}" stroke-width=".8" fill="none"/>`); }
  // on the arms: tattoos and a watch on the left wrist
  { const J = A[-1], W = J[2], E = J[1];
    if (tat === 1 && short) o.push(`<path d="M${n1(E[0] - 1)} ${n1(E[1] + 3)} q2 3 0 6 q-2 3 0 6" stroke="#2B3A66" stroke-width="1" fill="none" opacity=".7"/>`);
    if (tat === 2 && !crossed) o.push(`<circle cx="${n1(W[0])}" cy="${n1(W[1] - 3)}" r=".9" fill="#2B3A66" opacity=".75"/>`);
    if (L.wrist && !crossed && hands[-1] !== 'pocket') { const band = ['', '#3B3226', '#C9A646', '#8C6A2E', '#1E1E1E'][L.wrist], l = Math.hypot(W[0] - E[0], W[1] - E[1]) || 1, dx = (W[0] - E[0]) / l, dy = (W[1] - E[1]) / l, p = [W[0] - dx * 2.2, W[1] - dy * 2.2];
      o.push(`<path d="M${n1(p[0] + dy * 2.8)} ${n1(p[1] - dx * 2.8)} L${n1(p[0] - dy * 2.8)} ${n1(p[1] + dx * 2.8)}" stroke="${band}" stroke-width="${L.wrist === 2 ? 1 : 1.6}"/>${L.wrist !== 2 ? `<rect x="${n1(p[0] - 1.6)}" y="${n1(p[1] - 1.6)}" width="3.2" height="3.2" rx="${L.wrist === 4 ? .7 : 1.6}" fill="${L.wrist === 4 ? '#2C4F7C' : '#F3EFF8'}" stroke="${band}" stroke-width=".6"/>` : ''}`); } }
  if (tat === 3 && !crossed && hands[1] !== 'pocket') { const W = A[1][2]; o.push(`<path d="M${n1(W[0] - 1)} ${n1(W[1] + 3)} l2 0 l-1 1.8 z" fill="#2B3A66" opacity=".8"/>`); }
  // what you're carrying
  const RH = A[1][2], LH = A[-1][2], free = !crossed && pose !== 4;
  if (bag === 1) { const hx = free && pose === 0 ? RH[0] : cx + hp + 3, hy2 = free && pose === 0 ? RH[1] + 8 : wy; o.push(`<path d="M${n1(hx - 2.5)} ${n1(hy2)} L${n1(hx - 5.5)} ${n1(hy2 + 5)} M${n1(hx + 2.5)} ${n1(hy2)} L${n1(hx + 5.5)} ${n1(hy2 + 5)}" stroke="#C9B48A" stroke-width="1"/><rect x="${n1(hx - 7)}" y="${n1(hy2 + 5)}" width="14" height="15" rx="1.2" fill="#E9DCC0" stroke="#C9B48A" stroke-width=".4"/><text x="${n1(hx)}" y="${n1(hy2 + 14)}" font-size="3.4" text-anchor="middle" fill="#7A2E2E" font-family="sans-serif" font-weight="700">FILM</text>`); }
  if (bag === 2) o.push(`<path d="M${n1(cx - sw + 6)} ${sy + 1} L${n1(cx - sw + 6.5)} ${wy - 4} M${n1(cx + sw - 6)} ${sy + 1} L${n1(cx + sw - 6.5)} ${wy - 4}" stroke="${dkb}" stroke-width="1.8"/>`);
  if (bag === 3 || bag === 4) o.push(`<path d="M${n1(cx - sw + 5)} ${sy + 1} L${n1(cx + hp + 2)} ${hy - 6}" stroke="${bag === 3 ? '#1E1E1E' : '#6B4E3A'}" stroke-width="1.6"/><rect x="${n1(cx + hp - 5)}" y="${hy - 9}" width="${bag === 3 ? 12 : 15}" height="${bag === 3 ? 9 : 11}" rx="1.6" fill="${bag === 3 ? '#2B2B2B' : '#8A6A4A'}"/>${bag === 3 ? `<circle cx="${n1(cx + hp + 1)}" cy="${hy - 4.5}" r="2.2" fill="#555"/>` : `<rect x="${n1(cx + hp - 5)}" y="${hy - 9}" width="15" height="4" fill="#6B4E3A"/>`}`);
  if (bag === 5 && free) o.push(`<rect x="${n1(RH[0] - 5)}" y="${n1(RH[1] + 5)}" width="10" height="5.5" rx="1.2" fill="#C9A646"/><rect x="${n1(RH[0] - 5)}" y="${n1(RH[1] + 5)}" width="10" height="2" fill="#A68631"/>`);
  if (bag === 7 && free) o.push(`<g transform="rotate(-8 ${n1(LH[0])} ${n1(LH[1] + 8)})"><rect x="${n1(LH[0] - 5)}" y="${n1(LH[1] + 3)}" width="10" height="13" fill="#FFFFFF" stroke="#BBB" stroke-width=".5"/><path d="M${n1(LH[0] - 3.5)} ${n1(LH[1] + 6)} h7 M${n1(LH[0] - 3.5)} ${n1(LH[1] + 8.5)} h5.5 M${n1(LH[0] - 3.5)} ${n1(LH[1] + 11)} h7" stroke="#999" stroke-width=".4"/></g>`);
  if (bag === 8 && free) o.push(`<path d="M${n1(RH[0] - 2.6)} ${n1(RH[1] + 3)} L${n1(RH[0] + 2.6)} ${n1(RH[1] + 3)} L${n1(RH[0] + 2.1)} ${n1(RH[1] + 11)} L${n1(RH[0] - 2.1)} ${n1(RH[1] + 11)} Z" fill="#F4F2EE"/><rect x="${n1(RH[0] - 2.4)}" y="${n1(RH[1] + 5.5)}" width="4.8" height="2.6" fill="#8A5A37"/><rect x="${n1(RH[0] - 3)}" y="${n1(RH[1] + 1.6)}" width="6" height="1.8" rx=".8" fill="#2B2B2B"/>`);
  if (bag === 9 && free) o.push(`<circle cx="${n1(RH[0])}" cy="${n1(RH[1] + 8)}" r="5.5" fill="#B9B5AE" stroke="#8A8680" stroke-width=".8"/><circle cx="${n1(RH[0])}" cy="${n1(RH[1] + 8)}" r="1.5" fill="#8A8680"/>`);
}
// A hand drawn from life: a palm a little longer than wide, four fingers that taper together (the middle one
// longest), and a thumb along the inside. W: the wrist; d: the direction the hand points; side: -1 left, 1 right.
function figHand(W, d, side, skin, scale = 1, kind = 'open') {
  const l = Math.hypot(d[0], d[1]) || 1, ux = d[0] / l, uy = d[1] / l, px = -uy, py = ux, k = scale * .95;
  // local (u along the hand, v across it, v > 0 towards the thumb) to the page; the thumb always faces the body
  const tsg = side * (px < 0 ? 1 : -1) * (Math.abs(px) < .3 ? (side * uy > 0 ? 1 : -1) : 1);
  const P = (u, v) => `${n1(W[0] + (ux * u + px * v * tsg) * k)} ${n1(W[1] + (uy * u + py * v * tsg) * k)}`;
  const sk = mixHex(skin, '#2A140C', .28), hi = mixHex(skin, '#FFFFFF', .12);
  if (kind === 'fist') return `<path d="M${P(0, -2.5)} C${P(2.4, -3)} ${P(5, -3.5)} ${P(7.4, -3.3)} C${P(9.6, -3.1)} ${P(10.4, -1)} ${P(10, 1)} C${P(9.6, 2.8)} ${P(7.6, 3.2)} ${P(6, 3)} C${P(4, 2.8)} ${P(2, 2.6)} ${P(0, 2.5)} Z" fill="${skin}" stroke="${sk}" stroke-width=".4"/><path d="M${P(7.6, -2.8)} L${P(7.8, 2.4)} M${P(8.9, -1.6)} L${P(9.1, 1.6)}" stroke="${sk}" stroke-width=".35" opacity=".55"/><path d="M${P(2.6, 2)} C${P(4.6, 3.8)} ${P(7, 3.6)} ${P(8.2, 2.4)}" stroke="${sk}" stroke-width=".45" fill="none" opacity=".7"/>`;
  const sp = kind === 'wave' ? 1.05 : .86, v = x => x * sp;
  const palm = `M${P(0, v(-2.5))} C${P(3, v(-2.9))} ${P(6, v(-3.4))} ${P(8.4, v(-3.3))} C${P(11, v(-3.1))} ${P(14.2, v(-2.3))} ${P(15.6, v(-1.1))} C${P(16.5, v(-.2))} ${P(16.4, v(.9))} ${P(15.3, v(1.5))} C${P(13.5, v(2.4))} ${P(11, v(2.9))} ${P(8.6, v(2.6))} C${P(6.5, v(2.4))} ${P(3.2, v(2.3))} ${P(0, v(2.5))} Z`;
  const thumb = kind === 'wave' ? `M${P(3, 2.2)} C${P(5, 5.6)} ${P(7.2, 7.6)} ${P(9, 7.7)} C${P(9.9, 7.6)} ${P(10, 6.7)} ${P(9.4, 6.2)} C${P(8, 5)} ${P(6, 3.6)} ${P(4.6, 2)} Z` : `M${P(2.8, 2.2)} C${P(5, 4.3)} ${P(8, 4.7)} ${P(10.1, 3.9)} C${P(10.9, 3.5)} ${P(10.6, 2.6)} ${P(9.8, 2.5)} C${P(8, 2.5)} ${P(6, 2.3)} ${P(4.4, 1.7)} Z`;
  return `<path d="${palm}" fill="${skin}" stroke="${sk}" stroke-width=".4"/><path d="M${P(9.4, v(-1.65))} L${P(14.4, v(-1.25))} M${P(9.8, v(-.1))} L${P(15.4, v(.15))} M${P(9.4, v(1.3))} L${P(13.8, v(1.6))}" stroke="${sk}" stroke-width=".32" opacity=".45" fill="none"/><path d="M${P(1.5, v(-1.6))} C${P(4, v(-1.8))} ${P(6.6, v(-1.4))} ${P(8, v(-1.9))}" stroke="${hi}" stroke-width=".6" fill="none" opacity=".5"/><path d="${thumb}" fill="${skin}" stroke="${sk}" stroke-width=".4"/>`;
}
// head-to-toe, for the places with room
function figureOf(p, h) { const age = (p.dead ? yearOf(p.deathW || S.week) : S.year) - p.born; return portraitSVG(lookOf(p), p.dead ? Math.min(age, 50) : age, h, false, true); }
