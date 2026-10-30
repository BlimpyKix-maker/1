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
// Fine-tuning, as in the big character creators: sliders from 0 to 100 (50 is the middle) that shape the face and
// the body continuously. Everyone else gets their own values from their id, so no two strangers share a face.
const LOOK_SLIDERS = [['bHeight', 'Height'], ['bWeight', 'Weight'], ['bMuscle', 'Muscle'], ['bShoulder', 'Shoulders'], ['fLen', 'Face length'], ['fCheek', 'Cheekbones'], ['fJaw', 'Jaw'], ['fChin', 'Chin'], ['fEyeS', 'Eye size'], ['fEyeW', 'Eye spacing'], ['fBrow', 'Brows'], ['fNoseW', 'Nose width'], ['fNoseL', 'Nose length'], ['fLip', 'Lips'], ['fMouth', 'Mouth width'], ['fEar', 'Ears']];
for (const [k, label] of LOOK_SLIDERS) { LOOK[k] = { label, opts: Array.from({ length: 101 }, (_, i) => String(i)), slider: 1 }; if (!LOOK_KEYS.includes(k)) LOOK_KEYS.push(k); }
const lookD = (L, k) => clamp(((L[k] ?? 50) - 50) / 50, -1, 1);   // a slider as -1…1
{ const _dl = defaultLook; defaultLook = function () { const L = _dl.apply(this, arguments); for (const [k] of LOOK_SLIDERS) L[k] = 50; return L; }; }
// what everyone else wears below the waist, from a seed of their own (their face and top are untouched)
function npcFigure(p, L) {
  { const r = hashRand(p.id * 29 + 11); for (const [k] of LOOK_SLIDERS) if (L[k] === undefined) L[k] = clamp(Math.round(50 + (r() + r() + r() - 1.5) * 26), 4, 96); }
  if (L.bottoms !== undefined) return L;
  const r = hashRand(p.id * 13 + 5), pk = n => Math.floor(r() * n), F = p.g === 'F', y = p.born + 30;
  return Object.assign(L, { pattern: r() < .7 ? 0 : 1 + pk(9), bottoms: F ? [0, 1, 2, 4, 5, 6, 8, 9][pk(8)] : [0, 1, 2, 3, 6, 7, 8][pk(7)], bottomColour: pk(FIG_COLOURS.length), shoes: y < 1960 ? [3, 6][pk(2)] : F ? [0, 1, 2, 3, 4, 5, 7][pk(7)] : [0, 1, 2, 3, 6, 8][pk(6)], bag: r() < .6 ? 0 : 1 + pk(9), tattoo: r() < .85 ? 0 : 1 + pk(4), pose: pk(5) });
}
// The body, drawn under the head in the full-length frame (120 × 240). People are drawn about seven and a half
// heads tall: the shoulders a third of a head below the chin, the elbow at the waist, the wrist at the crotch, the
// knee halfway between hip and heel. Most people stand with their weight on one leg (contrapposto): that hip rises,
// the shoulder on the same side drops, the other leg relaxes. Arms grow out of the shoulder, behind the torso's
// edge; clothes sit a little away from the body and fold where it bends. Everything is shaded from the left.
let FIG_POSE = null;   // set while drawing a pose other than standing (Round 28): walking frames, sitting
const FIG = { sy: 57.9, wy: 98, hy: 116, cr: 125, kn: 170, an: 213, fy: 224 };
// a smooth open or closed path through points (Catmull-Rom as cubic Béziers)
function crPath(P, close) {
  const n = P.length, q = i => P[close ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${n1(P[0][0])} ${n1(P[0][1])}`;
  for (let i = 0; i < (close ? n : n - 1); i++) { const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${n1(p1[0] + (p2[0] - p0[0]) / 6)} ${n1(p1[1] + (p2[1] - p0[1]) / 6)} ${n1(p2[0] - (p3[0] - p1[0]) / 6)} ${n1(p2[1] - (p3[1] - p1[1]) / 6)} ${n1(p2[0])} ${n1(p2[1])}`; }
  return d + (close ? ' Z' : '');
}
const crTail = P => crPath(P).replace(/^M[^C]*/, ' ');
// the two edges of a limb: joints and a half-width at each
function limbEdges(J, W) {
  const L = [], Rr = [];
  for (let i = 0; i < J.length; i++) { const a = J[Math.max(0, i - 1)], b = J[Math.min(J.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    L.push([J[i][0] + nx * W[i], J[i][1] + ny * W[i]]); Rr.push([J[i][0] - nx * W[i], J[i][1] - ny * W[i]]); }
  return [L, Rr];
}
// a limb with rounded ends (skin) or cut ends (a sleeve, a trouser leg)
function limbPath(J, W, cut) {
  const [L, Rr] = limbEdges(J, W), e = J[J.length - 1], e0 = J[J.length - 2], el = Math.hypot(e[0] - e0[0], e[1] - e0[1]) || 1, ux = (e[0] - e0[0]) / el, uy = (e[1] - e0[1]) / el, we = W[W.length - 1];
  const s = J[0], s1 = J[1], sl = Math.hypot(s1[0] - s[0], s1[1] - s[1]) || 1, vx = (s[0] - s1[0]) / sl, vy = (s[1] - s1[1]) / sl, ws = W[0], RL = Rr[Rr.length - 1];
  const endJ = cut ? ` L${n1(RL[0])} ${n1(RL[1])}` : ` Q${n1(e[0] + ux * we * 1.25)} ${n1(e[1] + uy * we * 1.25)} ${n1(RL[0])} ${n1(RL[1])}`;
  const startJ = cut ? ' Z' : ` Q${n1(s[0] + vx * ws * 1.1)} ${n1(s[1] + vy * ws * 1.1)} ${n1(L[0][0])} ${n1(L[0][1])} Z`;
  return crPath(L) + endJ + crTail(Rr.slice().reverse()) + startJ;
}
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function figureBody(L, o, uid, cx, skin, cloth, pr) {
  const b = L.build || 0, top = L.outfit, bot = L.bottoms || 0, shoe = L.shoes || 0, pose = (L.pose === 4 && (top === 10 || bot === 4 || bot === 5)) ? 0 : L.pose || 0, bag = L.bag || 0, tat = L.tattoo || 0;
  const FT = L._fit || { mus: 0, mass: 0 };
  const sw0 = [19.5, 20.5, 22, 23.5, 25.5, 27, 18, 18.5, 25.5, 21][b] + FT.mus * .5 + FT.mass * .3, ww0 = [11.5, 12.5, 14, 16, 18, 21.5, 11, 11, 15, 12.5][b] + FT.mass * .8 - FT.mus * .1, hp0 = [14, 14.5, 16, 17.5, 19, 23, 13.5, 13.5, 16.5, 19.5][b] + FT.mass * .45;
  const af0 = [.92, .96, 1, 1.06, 1.12, 1.22, .88, .9, 1.16, 1][b] + FT.mus * .025 + Math.max(0, FT.mass) * .02, lf0 = [.95, .98, 1, 1.05, 1.1, 1.2, .9, .9, 1.12, 1.08][b] + Math.max(0, FT.mass) * .02;
  const dW = lookD(L, 'bWeight'), dM = lookD(L, 'bMuscle'), dS = lookD(L, 'bShoulder'), dH = lookD(L, 'bHeight');
  const sw = sw0 + dS * 4 + dM * 1.5, ww = ww0 + dW * 5.2 - dM * .4, hp = hp0 + dW * 3.6, af = af0 + dM * .16 + dW * .12, lf = lf0 + dW * .14 + dM * .08;
  const dl = (b === 7 ? 3 : b === 6 ? -5 : 0) + dH * 10, { sy, wy, cr } = FIG, kn = FIG.kn + dl * .5, an = FIG.an + dl, fy = FIG.fy + dl;
  // the stance: which leg takes the weight (some people stand square)
  const st = hashRand(L.skin * 7 + L.face * 31 + L.build * 131 + L.hair * 17 + (L.outfit || 0) * 3)(), w = pose === 3 || pose === 4 ? (st < .5 ? -1 : 1) : st < .38 ? -1 : st < .76 ? 1 : 0, tilt = w * 1.5;
  const hy = FIG.hy, nb = neckHalf(L) * .74;
  const bc = FIG_COLOURS[L.bottomColour || 0], dkc = mixHex(cloth, '#000', .3), dkb = mixHex(bc, '#000', .32), shade = mixHex(skin, '#2A140C', .24);
  const tc = top === 19 ? '#F4F2EE' : cloth, tline = mixHex(tc, '#000', .4);
  const grad = (id, c) => `<linearGradient id="${uid}${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mixHex(c, '#FFFFFF', .1)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${mixHex(c, '#1A0E0A', .22)}"/></linearGradient>`;
  o.push(`<defs>${grad('sk', skin)}${grad('cl', tc)}${grad('bt', top === 19 ? cloth : bc)}</defs>`);
  const SK = `url(#${uid}sk)`, CL = `url(#${uid}cl)`, BT = `url(#${uid}bt)`;
  o.push(`<ellipse cx="${n1(cx + w * 2)}" cy="${n1(fy + 1.5)}" rx="${n1(hp + 12)}" ry="3" fill="#000" opacity=".14"/>`);
  if (bag === 6) o.push(`<g transform="rotate(14 ${cx + 6} 112)"><path d="M${cx + 2} 50 Q${cx + 13} 46 ${cx + 15} 60 L${cx + 19} 132 Q${cx + 25} 154 ${cx + 9} 160 Q${cx - 7} 154 ${cx} 132 Z" fill="#2B2B2B"/><path d="M${cx + 8} 56 L${cx + 10} 154" stroke="#555" stroke-width=".8"/></g>`);
  if (bag === 2) o.push(`<rect x="${n1(cx - sw + 3)}" y="${sy + 4}" width="${n1((sw - 3) * 2)}" height="36" rx="7" fill="${mixHex(bc, '#fff', .15)}"/>`);
  // legs: hip joint, knee, ankle; the weight leg sits under the body, the free leg a little out and soft at the knee
  const legs = [-1, 1].map(s => {
    const weight = w === s, free = w === -s, hx = cx + s * hp * .47, hyy = hy - (weight ? tilt * s * s : free ? -tilt * s * s : 0) * .5;
    const A = [cx + s * (weight ? 2.4 : free ? hp * .5 + 3.4 : hp * .5 - .2), an - (free ? .6 : 0)], K = [lerp2([hx, hyy], A, .5)[0] + s * (free ? -1.2 : .4), kn + (free ? .8 : 0)];
    return { s, H: [hx, hyy], K, A, weight, free };
  });
  if (FIG_POSE && FIG_POSE.legs) for (const g of legs) FIG_POSE.legs(g, { cx, hy, kn, an, fy, hp });
  const legJ = g => [[g.H[0], g.H[1] - 2], lerp2(g.H, g.K, .45), g.K, lerp2(g.K, g.A, .38), g.A];
  const legW = [hp * .5 + .6, 6.2 * lf, 4.3 * lf, 4.8 * lf, 2.7];
  for (const g of legs) o.push(`<path d="${limbPath(legJ(g), legW)}" fill="${SK}" stroke="${shade}" stroke-width=".35"/><path d="M${n1(g.K[0] - 1.4)} ${n1(g.K[1] - .5)} q1.4 1.4 2.8 0" stroke="${shade}" stroke-width=".4" fill="none" opacity=".45"/>`);
  // what covers them
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19, legC = top === 19 ? cloth : bc, legD = top === 19 ? dkc : dkb;
  const seat = (dw, low) => `<path d="M${n1(cx - ww - .8)} ${wy - 1} L${n1(cx + ww + .8)} ${wy - 1} C${n1(cx + ww + .8)} ${wy + 8} ${n1(cx + hp + 1.4)} ${hy - 10} ${n1(cx + hp + 1.5 + dw)} ${hy - 1} L${n1(cx + 1)} ${n1(low)} L${n1(cx - 1)} ${n1(low)} L${n1(cx - hp - 1.5 - dw)} ${hy - 1} C${n1(cx - hp - 1.4)} ${hy - 10} ${n1(cx - ww - .8)} ${wy + 8} ${n1(cx - ww - .8)} ${wy - 1} Z" fill="${BT}"/>`;
  if (longLeg || bot === 3) {
    const ease = bot === 9 && top !== 19 ? .3 : bot === 1 && top !== 19 ? .7 : bot === 8 && top !== 19 ? 2.4 : 1.5, flare = bot === 8 && top !== 19 ? 3.5 : 0;
    for (const g of legs) { const J = legJ(g), hemT = bot === 3 && top !== 19 ? .42 : 1, Jt = bot === 3 && top !== 19 ? [J[0], J[1], lerp2(J[1], J[2], .7)] : [J[0], J[1], J[2], J[3], [J[4][0], J[4][1] + (bot === 9 || bot === 1 ? -1 : 3)]];
      const Wt = bot === 3 && top !== 19 ? [legW[0] + 1, legW[1] + 1.8, legW[1] + 1.4] : [legW[0] + ease * .6, legW[1] + ease, legW[2] + ease + flare * .3, legW[3] + ease + flare * .6, legW[3] + ease * .8 + flare - (bot === 9 || bot === 1 ? 1.4 : 0)];
      o.push(`<path d="${limbPath(Jt, Wt, true)}" fill="${BT}" stroke="${legD}" stroke-width=".45"/>`);
      if (bot !== 3 || top === 19) o.push(`<path d="M${n1(g.K[0] - 2)} ${n1(g.K[1] - 6)} q2 2 4 1 M${n1(J[4][0] - 3)} ${n1(J[4][1] - 3)} q3 1.5 6 0" stroke="${legD}" stroke-width=".45" fill="none" opacity=".5"/>`);
      void hemT; }
    o.push(seat(0, cr + 3) + `<path d="M${cx} ${wy + 2} Q${cx + .6} ${hy - 2} ${cx} ${cr}" stroke="${legD}" stroke-width=".5" fill="none" opacity=".7"/><path d="M${n1(cx - ww - .8)} ${wy + 1.2} L${n1(cx + ww + .8)} ${wy + 1.2}" stroke="${legD}" stroke-width=".6" opacity=".6"/>`);
    if (bot === 0 && top !== 19) for (const s of [-1, 1]) o.push(`<path d="M${n1(cx + s * (ww - 3))} ${wy + 1.5} Q${n1(cx + s * (ww + .5))} ${wy + 7} ${n1(cx + s * (hp + .8))} ${wy + 8}" stroke="${mixHex(bc, '#fff', .35)}" stroke-width=".45" fill="none" stroke-dasharray="1 .8"/>`);
    if (bot === 7) for (const g of legs) o.push(`<rect x="${n1(g.K[0] + g.s * 3 - 3.4)}" y="${n1(g.K[1] - 24)}" width="6.8" height="8.5" rx="1.2" fill="${legD}" opacity=".75"/>`);
    if (bot === 6) for (const g of legs) o.push(`<path d="M${n1(g.H[0])} ${hy + 2} L${n1(g.A[0])} ${n1(g.A[1] - 1)}" stroke="${mixHex(bc, '#fff', .35)}" stroke-width=".5"/>`);
  }
  if ((bot === 4 || bot === 5) && top !== 10 && top !== 19) { const hem = bot === 4 ? hy + 22 : an - 18, wd = bot === 4 ? hp + 4 : hp + 9;
    o.push(`<path d="M${n1(cx - ww - .8)} ${wy - 1} L${n1(cx + ww + .8)} ${wy - 1} C${n1(cx + ww + 1)} ${wy + 8} ${n1(cx + hp + 1.5)} ${hy - 7} ${n1(cx + hp + 1.8)} ${hy} L${n1(cx + wd)} ${n1(hem)} Q${cx} ${n1(hem + 2.2)} ${n1(cx - wd)} ${n1(hem)} L${n1(cx - hp - 1.8)} ${hy} C${n1(cx - hp - 1.5)} ${hy - 7} ${n1(cx - ww - 1)} ${wy + 8} ${n1(cx - ww - .8)} ${wy - 1} Z" fill="${BT}" stroke="${dkb}" stroke-width=".45"/><path d="M${cx - 4} ${hy} L${n1(cx - 6.5)} ${n1(hem - 1)} M${cx + 5} ${hy} L${n1(cx + 8.5)} ${n1(hem - 1)}" stroke="${dkb}" stroke-width=".45" opacity=".45"/>`); }
  if (tat === 4) o.push(`<path d="M${n1(legs[0].A[0] - 2)} ${n1(an - 8)} l2 -2 l2 2 l-2 2 z" fill="#2B3A66" opacity=".7"/>`);
  // shoes (Round 28): drawn at the size of a real foot, seen from the front and a little above, so the toe box comes
  // toward us, wider than the ankle, on a sole; g.turn turns the toes (outward when standing, toward the way you walk)
  const SH = [['#F4F2EE', cloth], ['#C8102E', '#F4F2EE'], ['#5A3A22', '#3B2516'], ['#3B2516', '#2A1A10'], ['#151515', '#8C2E2E'], ['#B98A55', skin], ['#7A4A28', '#4E2E18'], ['#151515', '#333'], ['#B98A55', '#8C5A2E'], ['#F2C6D6', '#FFFFFF']][shoe];
  for (const g of legs) o.push(figShoe(g, shoe, SH, skin, SK, g.ty !== undefined ? g.ty : fy - (g.free ? .5 : 0), lf));
  // arms: the shoulder joint sits inside the torso's edge so the sleeve grows out of the shoulder
  const puff = top === 17 ? 2 : 0, sW = sw + puff, wW = ww + puff * .8, shTilt = s => (s === w ? .9 : s === -w ? -.9 : 0);
  const short = [0, 10, 13, 16, 19].includes(top), sleeve = top === 19 ? '#F4F2EE' : cloth, sleeveD = mixHex(sleeve, '#000', .4), wide = top === 12 ? 2.4 : top === 17 ? 1.6 : 0;
  const Sj = s => [cx + s * (sW - 4.6), sy + 9 + shTilt(s)];
  const hang = s => [Sj(s), [cx + s * (Math.max(ww + 5.6, sW - 2.4) + (s === w ? .8 : 0)), wy - 3], [cx + s * (hp + 3.4 + (s === w ? 1.2 : 0)), cr - 1]];
  let A = { [-1]: hang(-1), 1: hang(1) }; const hands = { [-1]: 'rest', 1: 'rest' };
  if (pose === 1) { A[1] = [Sj(1), [cx + sw + 10, sy + 26], [cx + ww + 3.4, wy - 1]]; hands[1] = 'fist'; }
  if (pose === 2) { A[1] = [Sj(1), [cx + sw + 8.5, sy + 19], [cx + sw + 10.5, sy - 7]]; hands[1] = 'wave'; }
  if (pose === 4) for (const s of [-1, 1]) { A[s] = [Sj(s), [cx + s * (ww + 8.5), sy + 39], [cx + s * (hp - 2.2), hy + 1]]; hands[s] = 'pocket'; }
  if (FIG_POSE && FIG_POSE.arms) FIG_POSE.arms(A, hands, { cx, sy, wy, hy, cr, sw, ww, hp, Sj });
  const crossed = pose === 3 && !(FIG_POSE && FIG_POSE.arms);
  const AW = [5 * af, 4.7 * af, 3.5 * af, 3.8 * af, 2.6 * af];
  const armJ = J => [J[0], lerp2(J[0], J[1], .38), J[1], lerp2(J[1], J[2], .3), J[2]];
  const upperArm = (s, J, whole) => { const J5 = armJ(J); J5[0] = lerp2(J5[0], J5[2], .16); J5[1] = lerp2(J5[0], J5[2], .45); const up = whole ? J5 : [J5[0], J5[1], J5[2]], out = [];
    if (whole && !short) { const cuff = lerp2(J5[2], J5[4], .93); out.push(`<path d="${limbPath([J5[0], J5[1], J5[2], J5[3], cuff], [AW[0] + .5, AW[1] + .7, AW[2] + 1, AW[3] + 1.1 + wide, AW[4] + 1.2 + wide * 1.3], true)}" fill="${CL}" stroke="${sleeveD}" stroke-width=".4"/><path d="M${n1(J5[2][0] - 1.6)} ${n1(J5[2][1] - 1.2)} q1.6 1.6 3.2 .4 M${n1(J5[2][0] - 1.2)} ${n1(J5[2][1] + 1.4)} q1.4 1 2.6 0" stroke="${sleeveD}" stroke-width=".4" fill="none" opacity=".6"/>`); }
    else out.push(`<path d="${limbPath(up, whole ? AW : AW.slice(0, 3))}" fill="${short ? SK : CL}" stroke="${short ? shade : sleeveD}" stroke-width=".4"/>`);
    if (short) { const e = lerp2(J5[0], J5[2], .4); out.push(`<path d="${limbPath([J5[0], lerp2(J5[0], e, .5), e], [AW[0] + .8, AW[0] + 1, AW[1] + 1.3], true)}" fill="${CL}" stroke="${sleeveD}" stroke-width=".4"/>`); }
    if (top === 11) out.push(`<path d="M${n1(J5[0][0] + s * 2.4)} ${n1(J5[0][1] + 2)} L${n1(J5[2][0] + s * 2)} ${n1(J5[2][1])}" stroke="#FFFFFF" stroke-width=".8"/>`);
    return out.join(''); };
  const foreArm = (s, J) => { const J5 = armJ(J), fo = [J5[2], J5[3], J5[4]], out = [];
    if (short) out.push(`<path d="${limbPath(fo, AW.slice(2))}" fill="${SK}" stroke="${shade}" stroke-width=".4"/>`);
    else { const cuff = lerp2(J5[2], J5[4], .93); out.push(`<path d="${limbPath([J5[2], J5[3], cuff], [AW[2] + 1, AW[3] + 1.1 + wide, AW[4] + 1.2 + wide * 1.3], true)}" fill="${CL}" stroke="${sleeveD}" stroke-width=".4"/><path d="M${n1(J5[2][0] - 1.6)} ${n1(J5[2][1] - 1.2)} q1.6 1.6 3.2 .4 M${n1(J5[2][0] - 1.2)} ${n1(J5[2][1] + 1.4)} q1.4 1 2.6 0" stroke="${sleeveD}" stroke-width=".4" fill="none" opacity=".6"/>`); }
    return out.join(''); };
  const handAt = (s, J, kind) => { const W = J[2], E = J[1], l = Math.hypot(W[0] - E[0], W[1] - E[1]) || 1; return figHand(W, [(W[0] - E[0]) / l, (W[1] - E[1]) / l], s, skin, af, kind, SK); };
  const longTop = top === 10 || top === 18, bent = s => FIG_POSE && FIG_POSE.arms ? !!FIG_POSE.front : (pose === 1 && s === 1 || pose === 2 && s === 1 || pose === 4);
  if (!crossed) for (const s of [-1, 1]) o.push(upperArm(s, A[s], !bent(s)));
  // the torso, with its own small tilt: shoulders against the hips
  const hem = top === 10 ? kn - 4 : top === 18 ? kn - 8 : hy + 5, hW = top === 10 ? hp + 9 : top === 18 ? hp + 7 : hp + 1.6;
  const half = s => [[cx + s * (nb + 2.4), sy - .8 + shTilt(s) * .3], [cx + s * (sW - 8), sy + 2.4 + shTilt(s)], [cx + s * (sW - 2.6), sy + 5 + shTilt(s)], [cx + s * (sW - .1), sy + 9.2 + shTilt(s)], [cx + s * (sW - 1), sy + 14.6 + shTilt(s)], [cx + s * Math.max(wW + 4, sW - 2.8), sy + 21], [cx + s * (wW + 2.4), wy - 11], [cx + s * (wW + .5), wy - 1], [cx + s * (hp + 1.6), hy - 1 - (s === w ? tilt * .4 : 0)]];
  const R0 = half(1), L0 = half(-1).reverse();
  const body = crPath(R0) + ` L${n1(cx + hW)} ${n1(hem)} Q${cx} ${n1(hem + 1.6)} ${n1(cx - hW)} ${n1(hem)} L${n1(L0[0][0])} ${n1(L0[0][1])}` + crTail(L0) + ` Q${cx} ${sy + 2.6} ${n1(R0[0][0])} ${n1(R0[0][1])} Z`;
  if (top === 1) o.push(`<path d="M${n1(cx - nb - 6)} ${sy + 1} Q${n1(cx - nb - 4)} ${sy - 8} ${cx} ${sy - 9} Q${n1(cx + nb + 4)} ${sy - 8} ${n1(cx + nb + 6)} ${sy + 1} Z" fill="${dkc}"/>`);
  o.push(`<path d="${body}" fill="${CL}" stroke="${tline}" stroke-width=".5"/>`);
  // Round 25: a rounded shoulder over the joint, so the sleeve grows out of the shoulder instead of ending in a flat tab
  if (top !== 19) for (const sd of [-1, 1]) { const t0 = shTilt(sd), ox = sW + 1.4 + puff * .6, cap = `M${n1(cx + sd * (sW - 8.5))} ${n1(sy + 2.2 + t0)} C${n1(cx + sd * (sW - 3))} ${n1(sy + 3.2 + t0)} ${n1(cx + sd * (ox + .4))} ${n1(sy + 5.4 + t0)} ${n1(cx + sd * ox)} ${n1(sy + 14.5 + t0)}`;
    o.push(`<path d="${cap} L${n1(cx + sd * (sW - 4.2))} ${n1(sy + 15.5 + t0)} L${n1(cx + sd * (sW - 8.5))} ${n1(sy + 6 + t0)} Z" fill="${CL}"/><path d="${cap}" fill="none" stroke="${tline}" stroke-width=".5"/>`); }
  const pat = top === 16 && !L.pattern ? 4 : top === 2 && !L.pattern ? 2 : L.pattern || 0;
  if (pat && top !== 19) { const pc = mixHex(cloth, pat === 6 ? '#3B2516' : '#FFFFFF', pat === 6 ? .6 : .55), P0 = {
      1: `<rect width="6" height="2.6" fill="${pc}"/>`, 2: `<rect width="6" height="2.2" fill="${pc}" opacity=".6"/><rect width="2.2" height="6" fill="${pc}" opacity=".6"/>`, 3: `<circle cx="3" cy="3" r="1.1" fill="${pc}"/>`,
      4: `<circle cx="3" cy="3" r="1" fill="#FFE27A"/><circle cx="1.8" cy="3" r=".8" fill="${pc}"/><circle cx="4.2" cy="3" r=".8" fill="${pc}"/><circle cx="3" cy="1.8" r=".8" fill="${pc}"/><circle cx="3" cy="4.2" r=".8" fill="${pc}"/>`,
      5: `<circle cx="1.5" cy="1.5" r="2.2" fill="#E85D9A" opacity=".45"/><circle cx="4.5" cy="4.5" r="2.2" fill="#1FA3A0" opacity=".45"/><circle cx="4.5" cy=".8" r="1.4" fill="#E3A72F" opacity=".45"/>`,
      6: `<ellipse cx="2.2" cy="2.2" rx="1.2" ry=".8" fill="none" stroke="${pc}" stroke-width=".6"/><ellipse cx="4.8" cy="4.8" rx=".9" ry=".7" fill="${pc}"/>`, 7: `<rect width=".4" height="6" fill="${pc}"/>`,
      8: `<circle cx="1.5" cy="2.2" r="1.8" fill="#4E5B3A" opacity=".6"/><circle cx="4.8" cy="4.5" r="1.6" fill="#2F3A24" opacity=".6"/><circle cx="4.5" cy="1.1" r="1" fill="#8C8A5A" opacity=".6"/>`,
      9: `<path d="M3 1.1 l.5 1.2 l1.3 .1 l-1 .8 l.3 1.3 l-1.1 -.7 l-1.1 .7 l.3 -1.3 l-1 -.8 l1.3 -.1 z" fill="${pc}"/>` }[pat];
    o.push(`<defs><pattern id="${uid}pt" width="6" height="6" patternUnits="userSpaceOnUse"${pat === 1 || pat === 7 ? ' patternTransform="rotate(90)"' : ''}>${P0}</pattern></defs><path d="${body}" fill="url(#${uid}pt)"/>`); }
  // folds: under the arms, across the waist where the cloth gathers, the chest's soft edge
  if (top !== 19 && top !== 17) o.push(`<path d="M${n1(cx - sW + 3.4)} ${sy + 17} q1.8 4 2.6 9 M${n1(cx + sW - 3.4)} ${sy + 17} q-1.8 4 -2.6 9 M${n1(cx - wW + .6)} ${wy - 4} q4 2.4 7.5 1.6 M${n1(cx + wW - .6)} ${wy - 5} q-4 2.2 -6.8 2 M${n1(cx - sW + 6)} ${sy + 15} q${n1(sW - 6)} 4 ${n1((sW - 6) * 2)} 0" stroke="${tline}" stroke-width=".45" fill="none" stroke-linecap="round" opacity=".32"/>`);
  const placket = (x, n, c2) => Array.from({ length: n }, (_, i) => `<circle cx="${n1(x)}" cy="${n1(sy + 9 + i * (wy - sy - 6) / Math.max(1, n - 1))}" r=".65" fill="${c2}"/>`).join('');
  if (top === 19) o.push(`<path d="M${n1(cx - ww + 1)} ${sy + 19} L${n1(cx + ww - 1)} ${sy + 19} L${n1(cx + ww + .4)} ${wy} L${n1(cx + hp + 1.4)} ${hy - 2} L${n1(cx - hp - 1.4)} ${hy - 2} L${n1(cx - ww - .4)} ${wy} Z" fill="${cloth}" stroke="${dkc}" stroke-width=".5"/><path d="M${n1(cx - ww + 2.4)} ${sy + 20} L${n1(cx - sw + 6)} ${sy + 1} M${n1(cx + ww - 2.4)} ${sy + 20} L${n1(cx + sw - 6)} ${sy + 1}" stroke="${cloth}" stroke-width="2.2"/><circle cx="${n1(cx - ww + 3)}" cy="${sy + 21}" r="1" fill="#E3C27A"/><circle cx="${n1(cx + ww - 3)}" cy="${sy + 21}" r="1" fill="#E3C27A"/><rect x="${cx - 4.5}" y="${sy + 25}" width="9" height="7" rx="1" fill="${dkc}"/>`);
  if (top === 1) o.push(`<path d="M${cx - 2.4} ${sy + 3} L${cx - 2.8} ${sy + 15} M${cx + 2.4} ${sy + 3} L${cx + 2.8} ${sy + 14}" stroke="#F4F2EE" stroke-width=".6"/><path d="M${n1(cx - ww + 1.5)} ${hy - 3} L${n1(cx - ww + 3)} ${wy - 4} L${n1(cx + ww - 3)} ${wy - 4} L${n1(cx + ww - 1.5)} ${hy - 3}" stroke="${dkc}" stroke-width=".6" fill="none"/>`);
  if (top === 2 || top === 7 || top === 16) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${tline}" stroke-width=".45"/>` + placket(cx + 1.1, 5, mixHex(tc, '#fff', .5)));
  if (top === 3) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${mixHex(cloth, '#fff', .3)}" stroke-width=".5" stroke-dasharray="1 .7"/>` + [-1, 1].map(s => `<rect x="${n1(cx + s * 7 - 3.2)}" y="${sy + 11}" width="6.4" height="5.6" rx=".6" fill="none" stroke="${mixHex(cloth, '#fff', .3)}" stroke-width=".5"/>`).join(''));
  if (top === 4) o.push(`<path d="M${cx + 1.5} ${sy + 4} L${cx - 1} ${n1(hem)}" stroke="#C0C0C0" stroke-width=".7"/><path d="M${n1(cx - nb - 3)} ${sy + .5} L${cx - 3} ${sy + 12} L${n1(cx - sw + 7)} ${sy + 4} Z M${n1(cx + nb + 3)} ${sy + .5} L${cx + 4} ${sy + 12} L${n1(cx + sw - 7)} ${sy + 4} Z" fill="${dkc}"/>`);
  if (top === 6 || top === 15) o.push(`<path d="M${n1(cx - hp - 1)} ${n1(hem - 3)} L${n1(cx + hp + 1)} ${n1(hem - 3)}" stroke="${tline}" stroke-width="1.6" opacity=".3"/>`);
  if (top === 15 || top === 12) o.push(`<path d="M${cx - 5} ${sy + 2} L${cx - 3} ${n1(hem)} L${cx + 3} ${n1(hem)} L${cx + 5} ${sy + 2} Z" fill="${top === 12 ? '#151515' : '#F4F2EE'}"/>` + (top === 15 ? placket(cx - 4.3, 4, dkc) : ''));
  if (top === 8 || top === 9) o.push(`<path d="M${n1(cx - nb - 2.4)} ${sy + .4} L${cx - 1.2} ${wy - 7} L${n1(cx - 7)} ${sy + 12} L${n1(cx - 9.5)} ${sy + 10} Z M${n1(cx + nb + 2.4)} ${sy + .4} L${cx + 1.2} ${wy - 7} L${n1(cx + 7)} ${sy + 12} L${n1(cx + 9.5)} ${sy + 10} Z" fill="${mixHex(cloth, '#000', .2)}"/><circle cx="${cx}" cy="${wy - 4}" r=".8" fill="${dkc}"/><circle cx="${cx}" cy="${wy + 1}" r=".8" fill="${dkc}"/><path d="M${n1(cx + sw - 11)} ${sy + 13} l5 0" stroke="#F4F2EE" stroke-width="1.1"/>`);
  if (top === 10) o.push(`<path d="M${n1(cx - ww - .5)} ${wy} Q${cx} ${wy + 1.5} ${n1(cx + ww + .5)} ${wy}" stroke="${dkc}" stroke-width="1.3" fill="none"/><path d="M${cx - 5} ${wy + 3} L${n1(cx - 9)} ${n1(hem - 1)} M${cx + 5} ${wy + 3} L${n1(cx + 10)} ${n1(hem - 1)}" stroke="${dkc}" stroke-width=".5" opacity=".45"/>`);
  if (top === 11) o.push(`<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="#D8D8D8" stroke-width=".6"/>`);
  if (top === 13) o.push(`<path d="M${cx + 1} ${sy + 10} L${cx - 4} ${sy + 20} L${cx} ${sy + 20} L${cx - 2.5} ${sy + 29} L${cx + 5} ${sy + 16} L${cx + 1} ${sy + 16} L${cx + 3.5} ${sy + 10} Z" fill="#FFE27A"/><circle cx="${cx}" cy="${sy + 19}" r="9" fill="none" stroke="#FFFFFF" stroke-width=".7" opacity=".6"/>`);
  if (top === 14) o.push(Array.from({ length: 30 }, () => `<circle cx="${n1(cx - sw + 4 + pr() * (sw * 2 - 8))}" cy="${n1(sy + 3 + pr() * (hy - sy - 4))}" r="${n1(.4 + pr() * .6)}" fill="#FFFFFF" opacity="${n1(.4 + pr() * .5)}"/>`).join(''));
  if (top === 17) o.push([sy + 12, sy + 22, wy - 8, wy + 2, hy - 4].map(y => `<path d="M${n1(cx - sW + 2)} ${n1(y)} Q${cx} ${n1(y + 1.8)} ${n1(cx + sW - 2)} ${n1(y)}" stroke="${dkc}" stroke-width=".7" fill="none"/>`).join('') + `<path d="M${cx} ${sy + 3} L${cx} ${n1(hem)}" stroke="${dkc}" stroke-width=".6"/>`);
  if (top === 18) o.push(`<rect x="${n1(cx - ww - 1.5)}" y="${wy - 1.5}" width="${n1(ww * 2 + 3)}" height="3" fill="${dkc}"/><rect x="${cx - 2.4}" y="${wy - 2}" width="4.8" height="4" fill="none" stroke="#C9A646" stroke-width=".8"/><path d="M${cx + 2} ${sy + 4} L${cx + 3} ${n1(hem)}" stroke="${dkc}" stroke-width=".6"/><path d="M${n1(cx - nb - 2.4)} ${sy + .4} L${cx - 1} ${sy + 15} L${n1(cx - 9)} ${sy + 11} Z M${n1(cx + nb + 2.4)} ${sy + .4} L${cx + 1} ${sy + 15} L${n1(cx + 9)} ${sy + 11} Z" fill="${dkc}"/>` + [-1, 1].map(s => [sy + 18, sy + 26, wy + 5].map(y => `<circle cx="${n1(cx + s * 4.5)}" cy="${n1(y)}" r=".75" fill="${dkc}"/>`).join('')).join(''));
  // forearms and hands in front of the hips and the coat
  if (crossed) {
    const E = { [-1]: [cx - sW + 2, sy + 30], 1: [cx + sW - 2, sy + 30] }, Wl = [cx + sW - 8, sy + 26], Wr = [cx - sW + 8, sy + 21.5];
    o.push(foreArm(-1, [Sj(-1), E[-1], Wl]) + figHand(Wl, [1, -.25], -1, skin, af, 'fist', SK));
    o.push(upperArm(1, [Sj(1), E[1], Wr]) + upperArm(-1, [Sj(-1), E[-1], Wl]));
    o.push(foreArm(1, [Sj(1), E[1], Wr]) + figHand(Wr, [-1, -.3], 1, skin, af, 'fist', SK));
    A = { [-1]: [Sj(-1), E[-1], Wl], 1: [Sj(1), E[1], Wr] };
  } else for (const s of [-1, 1]) { if (bent(s) || longTop) o.push(foreArm(s, A[s])); if (hands[s] === 'none') { /* reaching forward, out of sight */ } else if (hands[s] !== 'pocket') o.push(handAt(s, A[s], hands[s])); else o.push(`<path d="M${n1(A[s][2][0] - 3.4)} ${n1(A[s][2][1] - 1)} Q${n1(A[s][2][0])} ${n1(A[s][2][1] + 1.2)} ${n1(A[s][2][0] + 3.4)} ${n1(A[s][2][1] - 1)}" stroke="${longLeg ? legD : dkb}" stroke-width=".7" fill="none"/>`); }
  { const J = A[-1], W = J[2], E = J[1];
    if (tat === 1 && short) o.push(`<path d="M${n1(E[0] - 1)} ${n1(E[1] + 3)} q2 3 0 6 q-2 3 0 6" stroke="#2B3A66" stroke-width="1" fill="none" opacity=".7"/>`);
    if (tat === 2 && !crossed) o.push(`<circle cx="${n1(W[0])}" cy="${n1(W[1] - 3)}" r=".9" fill="#2B3A66" opacity=".75"/>`);
    if (L.wrist && !crossed && hands[-1] !== 'pocket') { const band = ['', '#3B3226', '#C9A646', '#8C6A2E', '#1E1E1E'][L.wrist], l = Math.hypot(W[0] - E[0], W[1] - E[1]) || 1, dx = (W[0] - E[0]) / l, dy = (W[1] - E[1]) / l, p = [W[0] - dx * 1.6, W[1] - dy * 1.6];
      o.push(`<path d="M${n1(p[0] + dy * 2.6)} ${n1(p[1] - dx * 2.6)} L${n1(p[0] - dy * 2.6)} ${n1(p[1] + dx * 2.6)}" stroke="${band}" stroke-width="${L.wrist === 2 ? .9 : 1.4}"/>${L.wrist !== 2 ? `<rect x="${n1(p[0] - 1.5)}" y="${n1(p[1] - 1.5)}" width="3" height="3" rx="${L.wrist === 4 ? .7 : 1.5}" fill="${L.wrist === 4 ? '#2C4F7C' : '#F3EFF8'}" stroke="${band}" stroke-width=".55"/>` : ''}`); } }
  if (tat === 3 && !crossed && hands[1] !== 'pocket') { const W = A[1][2]; o.push(`<path d="M${n1(W[0] - 1)} ${n1(W[1] + 3)} l2 0 l-1 1.8 z" fill="#2B3A66" opacity=".8"/>`); }
  // what you're carrying
  const RH = A[1][2], LH = A[-1][2], free = !crossed && pose !== 4;
  if (bag === 1) { const hx = free && pose === 0 ? RH[0] : cx + hp + 3, hy2 = free && pose === 0 ? RH[1] + 7 : wy; o.push(`<path d="M${n1(hx - 2.5)} ${n1(hy2)} L${n1(hx - 5.5)} ${n1(hy2 + 5)} M${n1(hx + 2.5)} ${n1(hy2)} L${n1(hx + 5.5)} ${n1(hy2 + 5)}" stroke="#C9B48A" stroke-width="1"/><rect x="${n1(hx - 7)}" y="${n1(hy2 + 5)}" width="14" height="15" rx="1.2" fill="#E9DCC0" stroke="#C9B48A" stroke-width=".4"/><text x="${n1(hx)}" y="${n1(hy2 + 14)}" font-size="3.4" text-anchor="middle" fill="#7A2E2E" font-family="sans-serif" font-weight="700">FILM</text>`); }
  if (bag === 2) o.push(`<path d="M${n1(cx - sw + 6)} ${sy + 1} L${n1(cx - sw + 6.5)} ${wy - 4} M${n1(cx + sw - 6)} ${sy + 1} L${n1(cx + sw - 6.5)} ${wy - 4}" stroke="${dkb}" stroke-width="1.8"/>`);
  if (bag === 3 || bag === 4) o.push(`<path d="M${n1(cx - sw + 5)} ${sy + 1} L${n1(cx + hp + 2)} ${hy - 6}" stroke="${bag === 3 ? '#1E1E1E' : '#6B4E3A'}" stroke-width="1.6"/><rect x="${n1(cx + hp - 5)}" y="${hy - 9}" width="${bag === 3 ? 12 : 15}" height="${bag === 3 ? 9 : 11}" rx="1.6" fill="${bag === 3 ? '#2B2B2B' : '#8A6A4A'}"/>${bag === 3 ? `<circle cx="${n1(cx + hp + 1)}" cy="${hy - 4.5}" r="2.2" fill="#555"/>` : `<rect x="${n1(cx + hp - 5)}" y="${hy - 9}" width="15" height="4" fill="#6B4E3A"/>`}`);
  if (bag === 5 && free) o.push(`<rect x="${n1(RH[0] - 5)}" y="${n1(RH[1] + 4)}" width="10" height="5.5" rx="1.2" fill="#C9A646"/><rect x="${n1(RH[0] - 5)}" y="${n1(RH[1] + 4)}" width="10" height="2" fill="#A68631"/>`);
  if (bag === 7 && free) o.push(`<g transform="rotate(-8 ${n1(LH[0])} ${n1(LH[1] + 8)})"><rect x="${n1(LH[0] - 5)}" y="${n1(LH[1] + 3)}" width="10" height="13" fill="#FFFFFF" stroke="#BBB" stroke-width=".5"/><path d="M${n1(LH[0] - 3.5)} ${n1(LH[1] + 6)} h7 M${n1(LH[0] - 3.5)} ${n1(LH[1] + 8.5)} h5.5 M${n1(LH[0] - 3.5)} ${n1(LH[1] + 11)} h7" stroke="#999" stroke-width=".4"/></g>`);
  if (bag === 8 && free) o.push(`<path d="M${n1(RH[0] - 2.6)} ${n1(RH[1] + 3)} L${n1(RH[0] + 2.6)} ${n1(RH[1] + 3)} L${n1(RH[0] + 2.1)} ${n1(RH[1] + 11)} L${n1(RH[0] - 2.1)} ${n1(RH[1] + 11)} Z" fill="#F4F2EE"/><rect x="${n1(RH[0] - 2.4)}" y="${n1(RH[1] + 5.5)}" width="4.8" height="2.6" fill="#8A5A37"/><rect x="${n1(RH[0] - 3)}" y="${n1(RH[1] + 1.6)}" width="6" height="1.8" rx=".8" fill="#2B2B2B"/>`);
  if (bag === 9 && free) o.push(`<circle cx="${n1(RH[0])}" cy="${n1(RH[1] + 8)}" r="5.5" fill="#B9B5AE" stroke="#8A8680" stroke-width=".8"/><circle cx="${n1(RH[0])}" cy="${n1(RH[1] + 8)}" r="1.5" fill="#8A8680"/>`);
}
// Shoes (Round 29): drawn the way flat illustration draws them, in profile: a heel under the ankle, the instep, a
// toe pointing away, a sole along the ground. Standing, each foot turns out a little and is foreshortened, so the pair
// reads as feet seen from the front; the side view uses the same shoe at full length, the back view shows the heels.
// shoeProfile draws one shoe pointing toward +x with the ankle at 0 and the ground at y = 0.
function shoeProfile(shoe, SH, skin, lw, noShaft) {
  const col = SH[0], dk = mixHex(col, '#000', .38), lt = mixHex(col, '#fff', .35), k = lw || 1, L = 22 * k, o = [];
  const soleH = shoe === 7 ? 4.2 : shoe === 3 || shoe === 6 || shoe === 4 ? 1.2 : shoe === 9 ? 2 : 2.2, soleC = shoe === 0 || shoe === 1 ? '#F1EEE8' : shoe === 9 ? '#F7DCE6' : shoe === 7 ? '#262626' : mixHex(col, '#000', .55);
  const shaft = [0, 7, 15, 0, 0, 0, 0, 17, 16, 2][shoe];
  if (shoe === 4) {   // a heel: the foot arches up onto the heel, a pointed toe, the stem under the heel
    o.push(`<path d="M${n1(-4.6)} ${n1(-4.2)} L${n1(-3.6)} 0" stroke="${dk}" stroke-width="1.6" stroke-linecap="round"/>`);
    o.push(`<path d="M-5.2 -5 C-5.4 -8.6 -3.6 -11 -1 -11 L2.4 -10.6 C4.2 -7 8 -3.4 ${n1(L - 4)} -1.4 Q${n1(L)} -.6 ${n1(L - 1)} 0 L${n1(L * .45)} 0 C${n1(L * .3)} -1 4 -3.6 -1 -4.2 Z" fill="${skin}" stroke="${mixHex(skin, '#2A140C', .3)}" stroke-width=".35"/>`);
    o.push(`<path d="M-5.2 -5 C-5.4 -7.6 -4.2 -9 -2.8 -9.2 L-1.4 -4.6 Z M${n1(L * .42)} -3.2 C${n1(L * .6)} -3.6 ${n1(L - 4)} -2.4 ${n1(L - 1)} 0 L${n1(L * .45)} 0 Z" fill="${col}" stroke="${dk}" stroke-width=".35"/>`);
    return o.join('');
  }
  if (shaft && !noShaft) o.push(`<path d="M-5 ${-shaft - 9} L4 ${-shaft - 9} L4.4 -8 L-5.6 -6 Z" fill="${col}" stroke="${dk}" stroke-width=".4"/>${shoe === 8 ? `<path d="M-2.6 ${-shaft - 6} q2.6 4 0 8 M1.4 ${-shaft - 6} q-2.4 4 0 8" stroke="${SH[1]}" stroke-width=".6" fill="none"/>` : ''}`);
  const topY = shoe === 3 || shoe === 6 ? -8.6 : -10;
  const upper = shoe === 9
    ? `M-6 -1 C-7 -8 -2 -11.5 3 -10.8 C9 -10 ${n1(L - 2)} -8 ${n1(L + 1)} -3.6 C${n1(L + 2)} -1.4 ${n1(L)} 0 ${n1(L - 2)} 0 L-5 0 Z`
    : shoe === 8 ? `M-5.6 -1 C-6 -6 -5.4 ${topY} -2.6 ${topY} L3.8 ${topY} C6 -6.6 10 -5 ${n1(L - 3)} -3 L${n1(L + 2)} -.6 L${n1(L - 2)} 0 L-5 0 Z`
    : `M-5.6 -1.2 C-6.2 -5.6 -5.2 ${topY} -2.4 ${topY} L3.6 ${topY} C5.6 -7 9.6 -5.6 ${n1(L - 5)} -4.6 C${n1(L - 1)} -4 ${n1(L + .6)} -2.4 ${n1(L + .4)} -1 L${n1(L)} 0 L-5 0 Z`;
  o.push(`<path d="${upper}" fill="${col}" stroke="${dk}" stroke-width=".42" stroke-linejoin="round"/>`);
  // the details that say what kind of shoe it is
  if (shoe === 0 || shoe === 1) o.push(`<path d="M${n1(L * .52)} -4.3 Q${n1(L * .75)} -4.4 ${n1(L + .2)} -1.6 L${n1(L + .3)} -1 L${n1(L * .55)} -1 Z" fill="${shoe === 1 ? '#F4F2EE' : mixHex(col, '#000', .08)}"/><path d="M2.6 -9.4 L6.2 -6.6 M4.4 -9.2 L7.8 -6 M6.4 -8.4 L9.2 -5.4" stroke="${shoe === 1 ? '#F4F2EE' : mixHex(SH[1], '#000', .1)}" stroke-width=".7" stroke-linecap="round"/>`);
  if (shoe === 0) o.push(`<path d="M-2.6 -3.4 Q4 -7.4 ${n1(L * .62)} -3" stroke="${SH[1]}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);
  if (shoe === 1) o.push(`<circle cx="-2.4" cy="${-shaft - 4}" r="1.6" fill="#F4F2EE" stroke="${dk}" stroke-width=".3"/>`);
  if (shoe === 3) o.push(`<path d="M3.4 -7.6 Q7.4 -8.4 10.4 -5.6" stroke="${SH[1]}" stroke-width="1.4" fill="none"/>`);
  if (shoe === 6) o.push(`<path d="M${n1(L * .55)} -4.4 Q${n1(L * .7)} -5.6 ${n1(L * .66)} -1" stroke="${dk}" stroke-width=".45" fill="none" stroke-dasharray=".6 .6"/><path d="M3 -8.6 L7.6 -6.2 M4.8 -8.4 L8.6 -5.6" stroke="#2A1A10" stroke-width=".55"/>`);
  if (shoe === 5) o.push(`<path d="M-5 -2.4 C-4 -6 0 -7.4 4 -6.6 C9 -5.6 ${n1(L - 3)} -4 ${n1(L)} -1.4 L${n1(L - 1)} 0 L-5 0 Z" fill="${skin}" stroke="${mixHex(skin, '#2A140C', .3)}" stroke-width=".35"/><path d="M-1 -6.8 L1.6 -.8 M7 -5.6 L8.4 -.8 M${n1(L * .7)} -3.6 L${n1(L * .72)} -.8" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`);
  if (shoe === 9) o.push(Array.from({ length: 6 }, (_, i) => `<circle cx="${n1(-3 + i * (L / 5.4))}" cy="${n1(-8.6 + Math.sin(i) * 1.2)}" r="1.9" fill="#FFFFFF" opacity=".75"/>`).join(''));
  if (shoe !== 5 && shoe !== 9) o.push(`<path d="M0 ${topY + 1.4} Q6 ${topY + 2.4} ${n1(L * .7)} -4.6" stroke="${lt}" stroke-width=".7" fill="none" opacity=".55" stroke-linecap="round"/>`);
  // the sole
  o.push(`<path d="M-5.8 ${n1(-soleH)} L${n1(L + .6)} ${n1(-soleH * .8)} Q${n1(L + 1)} 0 ${n1(L - .4)} 0 L-5 0 Q-6.2 0 -5.8 ${n1(-soleH)} Z" fill="${soleC}" stroke="${mixHex(soleC, '#000', .35)}" stroke-width=".35"/>${[2, 8].includes(shoe) ? `<rect x="-5.6" y="${n1(-soleH - 1.6)}" width="6" height="${n1(soleH + 1.6)}" fill="${soleC}"/>` : ''}`);
  return o.join('');
}
// the shoe on a standing figure: its profile, turned out and foreshortened
function figShoe(g, shoe, SH, skin, SK, ty, lf) {
  const s = g.s, x = g.A[0], k = Math.min(1.1, Math.max(.94, lf)), back = FIG_POSE && FIG_POSE.back;
  if (back) {   // from behind: the heel counter, the back of the shaft, the sole
    const col = SH[0], dk = mixHex(col, '#000', .4), soleC = shoe === 0 || shoe === 1 ? '#F1EEE8' : mixHex(col, '#000', .55), shaft = [0, 7, 15, 0, 0, 0, 0, 17, 16, 2][shoe], w = shoe === 9 ? 6.6 : shoe === 4 ? 3.2 : 4.6;
    return `${shaft ? `<rect x="${n1(x - 4.4)}" y="${n1(ty - 9 - shaft)}" width="8.8" height="${shaft + 2}" fill="${col}" stroke="${dk}" stroke-width=".4"/>` : ''}<path d="M${n1(x - w)} ${n1(ty - 1.6)} C${n1(x - w - .4)} ${n1(ty - 7)} ${n1(x - 3)} ${n1(ty - 10)} ${n1(x)} ${n1(ty - 10)} C${n1(x + 3)} ${n1(ty - 10)} ${n1(x + w + .4)} ${n1(ty - 7)} ${n1(x + w)} ${n1(ty - 1.6)} Z" fill="${shoe === 5 || shoe === 4 ? skin : col}" stroke="${dk}" stroke-width=".4"/>${shoe === 4 ? `<rect x="${n1(x - 1)}" y="${n1(ty - 4)}" width="2" height="4" fill="${dk}"/>` : `<rect x="${n1(x - w - .3)}" y="${n1(ty - 2)}" width="${n1(w * 2 + .6)}" height="2" rx=".8" fill="${soleC}"/>`}`;
  }
  const turn = g.turn !== undefined ? Math.sign(g.turn) || s : s, fx = .5 + (g.free ? .08 : 0), shaft = [0, 7, 15, 0, 0, 0, 0, 17, 16, 2][shoe], col = SH[0], dk = mixHex(col, '#000', .38);
  const sh = shaft ? `<path d="M${n1(x - 4.6)} ${n1(ty - 9 - shaft)} L${n1(x + 4.6)} ${n1(ty - 9 - shaft)} L${n1(x + 4.8)} ${n1(ty - 7)} L${n1(x - 4.8)} ${n1(ty - 7)} Z" fill="${col}" stroke="${dk}" stroke-width=".4"/>${shoe === 8 ? `<path d="M${n1(x - 2)} ${n1(ty - 6 - shaft)} q2 4 0 8 M${n1(x + 2)} ${n1(ty - 6 - shaft)} q-2 4 0 8" stroke="${SH[1]}" stroke-width=".6" fill="none"/>` : ''}${shoe === 1 ? `<circle cx="${n1(x - s * 2.6)}" cy="${n1(ty - 5 - shaft)}" r="1.3" fill="#F4F2EE"/>` : ''}` : '';
  return `${sh}<g transform="translate(${n1(x - turn * 1.2)} ${n1(ty)}) scale(${n1(turn * fx * k)} ${n1(k * .96)})">${shoeProfile(shoe, SH, skin, 1, true)}</g>`;
}
// A hand drawn from life. Hanging at rest it is seen from the side: a narrow back of the hand, fingers that curl in
// a little, the thumb in front. W: the wrist; d: the way the hand points; side: -1 left, 1 right.
function figHand(W, d, side, skin, scale = 1, kind = 'rest', fill) {
  const l = Math.hypot(d[0], d[1]) || 1, ux = d[0] / l, uy = d[1] / l, px = -uy, py = ux, k = scale * 1.18;
  const tsg = side * (px < 0 ? 1 : -1) * (Math.abs(px) < .3 ? (side * uy > 0 ? 1 : -1) : 1);
  const P = (u, v) => `${n1(W[0] + (ux * u + px * v * tsg) * k)} ${n1(W[1] + (uy * u + py * v * tsg) * k)}`;
  const sk = mixHex(skin, '#2A140C', .3), F = fill || skin;   // k: hands are about three-quarters of a head long
  if (kind === 'fist') return `<path d="M${P(0, -2.3)} C${P(2.4, -2.8)} ${P(5, -3.3)} ${P(7.2, -3.1)} C${P(9.4, -2.9)} ${P(10.1, -1)} ${P(9.7, .9)} C${P(9.3, 2.7)} ${P(7.4, 3.1)} ${P(5.8, 2.9)} C${P(4, 2.7)} ${P(2, 2.5)} ${P(0, 2.3)} Z" fill="${F}" stroke="${sk}" stroke-width=".38"/><path d="M${P(7.4, -2.6)} L${P(7.6, 2.2)} M${P(8.7, -1.5)} L${P(8.9, 1.5)}" stroke="${sk}" stroke-width=".32" opacity=".5"/><path d="M${P(2.6, 1.9)} C${P(4.6, 3.6)} ${P(7, 3.4)} ${P(8.1, 2.3)}" stroke="${sk}" stroke-width=".42" fill="none" opacity=".7"/>`;
  if (kind === 'wave') {
    const palm = `M${P(0, -2.6)} C${P(3, -3)} ${P(6, -3.5)} ${P(8.4, -3.4)} C${P(11, -3.2)} ${P(14.2, -2.4)} ${P(15.4, -1.2)} C${P(16.2, -.3)} ${P(16.1, .9)} ${P(15, 1.5)} C${P(13.3, 2.4)} ${P(11, 2.9)} ${P(8.6, 2.7)} C${P(6.5, 2.5)} ${P(3.2, 2.4)} ${P(0, 2.6)} Z`;
    return `<path d="${palm}" fill="${F}" stroke="${sk}" stroke-width=".38"/><path d="M${P(9.4, -1.7)} L${P(14.2, -1.3)} M${P(9.8, -.1)} L${P(15.2, .15)} M${P(9.4, 1.3)} L${P(13.6, 1.6)}" stroke="${sk}" stroke-width=".3" opacity=".45" fill="none"/><path d="M${P(3, 2.2)} C${P(5, 5.4)} ${P(7.2, 7.2)} ${P(8.8, 7.3)} C${P(9.7, 7.2)} ${P(9.8, 6.4)} ${P(9.2, 5.9)} C${P(7.9, 4.8)} ${P(6, 3.5)} ${P(4.6, 2)} Z" fill="${F}" stroke="${sk}" stroke-width=".38"/>`;
  }
  // at rest: back of the hand, four fingers bunched and curling, the thumb resting along the front
  const hand = `M${P(0, -2.2)} C${P(2.4, -2.5)} ${P(4.8, -2.8)} ${P(6.6, -2.7)} C${P(9.2, -2.5)} ${P(11.6, -1.9)} ${P(12.8, -.7)} C${P(13.6, .2)} ${P(13.3, 1.4)} ${P(12.2, 1.9)} C${P(10.6, 2.5)} ${P(8.6, 2.5)} ${P(6.8, 2.3)} C${P(4.6, 2.1)} ${P(2.4, 2.1)} ${P(0, 2.2)} Z`;
  return `<path d="${hand}" fill="${F}" stroke="${sk}" stroke-width=".38"/><path d="M${P(7.4, -1.3)} C${P(9.4, -1.3)} ${P(11, -1)} ${P(12.2, -.3)} M${P(7.6, .2)} C${P(9.6, .3)} ${P(11.2, .6)} ${P(12.4, 1.1)}" stroke="${sk}" stroke-width=".3" fill="none" opacity=".45"/><path d="M${P(6.2, -2.4)} Q${P(6.6, 0)} ${P(6.4, 2.1)}" stroke="${sk}" stroke-width=".3" fill="none" opacity=".3"/><path d="M${P(2.2, 1.6)} C${P(4, 3.3)} ${P(6.4, 3.6)} ${P(8.2, 3)} C${P(8.9, 2.7)} ${P(8.7, 2)} ${P(8, 1.9)} C${P(6.4, 2)} ${P(4.6, 1.8)} ${P(3.4, 1.2)} Z" fill="${F}" stroke="${sk}" stroke-width=".38"/>`;
}
// head-to-toe, for the places with room
function figureOf(p, h) { const age = (p.dead ? yearOf(p.deathW || S.week) : S.year) - p.born; return portraitSVG(lookOf(p), p.dead ? Math.min(age, 50) : age, h, false, true); }
