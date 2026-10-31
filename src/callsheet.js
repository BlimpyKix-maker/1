// ================= Call Sheet: the new character design (Round 30) =================
// A fresh look for everyone in the game, in the spirit of a film's key art: clean editorial illustration, flat colour
// with no outlines, lit the way a set is lit. A warm key light from the left, a cool fill falling into shadow on the
// right, a soft contact shadow on the floor. Long, elegant proportions; a simple, expressive face whose mood shows;
// clothes that read by their shapes (lapels, hoods, quilting, a trench's belt) rather than by detail.
// One renderer draws every view the game needs from the same look: the head and shoulders for lists and profiles,
// the full figure, from behind, in profile mid-stride, sitting, and holding something. Every option in the character
// creator keeps its meaning. The old styles are still there: Cartoon, and the previous realistic look as "Classic".
// Coordinates: the full figure is 120 × 240 (feet on y = 224), the portrait 120 × 120.
let CS_UID = 0;
const csM = (a, b, t) => mixHex(a, b, t);
const csSh = c => mixHex(c, '#1E1838', .3), csDeep = c => mixHex(c, '#120E22', .45), csHi = c => mixHex(c, '#FFF3DE', .2);
const n2 = v => Math.round(v * 10) / 10;
// a tapered capsule from (x1,y1) radius r1 to (x2,y2) radius r2
function csCap(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || .01, nx = -dy / l, ny = dx / l;
  return `M${n2(x1 + nx * r1)} ${n2(y1 + ny * r1)}L${n2(x2 + nx * r2)} ${n2(y2 + ny * r2)}A${n2(r2)} ${n2(r2)} 0 0 0 ${n2(x2 - nx * r2)} ${n2(y2 - ny * r2)}L${n2(x1 - nx * r1)} ${n2(y1 - ny * r1)}A${n2(r1)} ${n2(r1)} 0 0 0 ${n2(x1 + nx * r1)} ${n2(y1 + ny * r1)}Z`;
}
// a limb through joints J with radii R: the shadow first, then the lit side a little to the left and narrower
function csLimb(o, J, R, col, opts = {}) {
  const sh = opts.shade || csSh(col), lit = [];
  for (let i = 0; i < J.length - 1; i++) o.push(`<path d="${csCap(J[i][0], J[i][1], R[i], J[i + 1][0], J[i + 1][1], R[i + 1])}" fill="${sh}"/>`);
  for (let i = 0; i < J.length - 1; i++) lit.push(`<path d="${csCap(J[i][0] - R[i] * .22, J[i][1], R[i] * .74, J[i + 1][0] - R[i + 1] * .22, J[i + 1][1], R[i + 1] * .74)}" fill="${col}"/>`);
  o.push(lit.join(''));
}
// what each hairstyle is made of: volume on top, length, fringe, texture, extras
const CS_HAIR = [
  { v: 0, len: 0, fr: 'none', tex: 'shaved' }, { v: .6, len: 0, fr: 'none', tex: 'buzz' }, { v: 2.2, len: 1, fr: 'side' }, { v: 2.4, len: 1, fr: 'part' }, { v: 5, len: 1, fr: 'up' },
  { v: 4, len: 2, fr: 'full', tex: 'curly' }, { v: 9, len: 2, fr: 'none', tex: 'afro' }, { v: 2.4, len: 2, fr: 'full', bob: 1 }, { v: 2.6, len: 4, fr: 'part' }, { v: 3, len: 4, fr: 'part', tex: 'locs' },
  { v: 2.2, len: 1, fr: 'swoop', x: 'tail' }, { v: 2, len: 1, fr: 'swoop', x: 'bun' }, { v: 0, len: 0, fr: 'none', tex: 'buzz', x: 'mohawk' }, { v: 1.8, len: 1, fr: 'full' }, { v: 2.4, len: 4, fr: 'part', tex: 'braids' },
  { v: 2.4, len: 3, fr: 'side', mullet: 1 }, { v: 2, len: 1, fr: 'part', x: 'buns' }, { v: 1.4, len: 1, fr: 'none', slick: 1 }, { v: 2.2, len: 1, fr: 'part', x: 'pigtails' }, { v: 6, len: 3, fr: 'full', tex: 'curly' },
  { v: 2.6, len: 1, fr: 'side', shave: 1 }, { v: 3.6, len: 2, fr: 'full', shag: 1 }, { v: 12, len: 1, fr: 'swoop', x: 'beehive' }, { v: 3, len: 4, fr: 'part', tex: 'wave' }
];
function csLook(L0, age) {
  const L = Object.assign(defaultLook(), migrateLook(Object.assign({}, L0)));
  const d = k => typeof lookD === 'function' ? lookD(L, k) : 0, b = L.build || 0;
  const grey = clamp((age - 44) / 26, 0, .85);
  const C = {
    skin: LOOK.skin.opts[L.skin], hair: mixHex(LOOK.hairColor.opts[L.hairColor], '#D9D6D0', grey), cloth: LOOK.colour.opts[L.colour], bot: FIG_COLOURS[L.bottomColour || 0], eye: LOOK.eyes.opts[L.eyes || 0]
  };
  C.skinS = csSh(C.skin); C.hairS = csSh(C.hair); C.lip = mixHex(C.skin, '#A4473F', .4); C.ink = mixHex(C.skin, '#160C0A', .78);
  const G = {
    sw: [16.5, 17.5, 18.5, 20, 21.5, 22.5, 15.5, 16, 22.5, 18][b] + d('bShoulder') * 2.5 + d('bMuscle') * 1.2,
    ww: [10.8, 11.8, 12.8, 14.6, 16.4, 19.6, 10.4, 10.4, 14.2, 12.2][b] + d('bWeight') * 3.6 - d('bMuscle') * .4,
    hp: [12.6, 13.2, 14.2, 15.6, 17, 20.4, 12.2, 12.2, 15.4, 17.6][b] + d('bWeight') * 3,
    limb: [.9, .95, 1, 1.07, 1.13, 1.25, .88, .88, 1.16, 1.02][b] + d('bWeight') * .12 + d('bMuscle') * .1,
    hs: 1 + d('bHeight') * .05, rx: 10.4 * (1 + d('fCheek') * .05) * ([1, 1.06, 1.05, .96, 1.02, 1, 1.03, .97, 1.08, .93][L.face] || 1), ry: 12.8 * (1 + d('fLen') * .06) * ([1, .96, .98, 1.08, 1, 1.02, .98, 1.02, .95, 1.06][L.face] || 1),
    jaw: [.62, .74, .86, .6, .46, .5, .7, .78, .8, .55][L.face] + d('fJaw') * .1, chin: d('fChin')
  };
  return { L, C, G, age, d, mood: L._mood || 'calm' };
}
// ---------------- the head, front / back / side ----------------
function csHeadFront(o, K, uid, hx, hy) {
  const { L, C, G, d, age, mood } = K, rx = G.rx, ry = G.ry, jw = rx * G.jaw, H = CS_HAIR[L.hair] || CS_HAIR[2];
  const face = `M${n2(hx - rx)} ${n2(hy - 1)}C${n2(hx - rx)} ${n2(hy - ry * 1.08)} ${n2(hx + rx)} ${n2(hy - ry * 1.08)} ${n2(hx + rx)} ${n2(hy - 1)}C${n2(hx + rx)} ${n2(hy + ry * .5)} ${n2(hx + jw)} ${n2(hy + ry * .86)} ${n2(hx)} ${n2(hy + ry + G.chin * .8)}C${n2(hx - jw)} ${n2(hy + ry * .86)} ${n2(hx - rx)} ${n2(hy + ry * .5)} ${n2(hx - rx)} ${n2(hy - 1)}Z`;
  // hair that falls behind the head and shoulders
  if (!K._hb) csHairBack(o, K, hx, hy, 'front');
  // ears
  const es = 1 + d('fEar') * .2;
  for (const s of [-1, 1]) o.push(`<ellipse cx="${n2(hx + s * (rx + .4))}" cy="${n2(hy + 1.4)}" rx="${n2(2.2 * es)}" ry="${n2(3.3 * es)}" fill="${s > 0 ? C.skinS : C.skin}"/>`);
  o.push(`<clipPath id="${uid}f"><path d="${face}"/></clipPath><path d="${face}" fill="${C.skin}"/><g clip-path="url(#${uid}f)"><path d="M${n2(hx + rx * .66)} ${n2(hy - ry * 1.2)}C${n2(hx + rx * .5)} ${n2(hy - ry * .3)} ${n2(hx + rx * .56)} ${n2(hy + ry * .5)} ${n2(hx + rx * .36)} ${n2(hy + ry * 1.25)}L${n2(hx + rx * 1.4)} ${n2(hy + ry * 1.3)}L${n2(hx + rx * 1.4)} ${n2(hy - ry * 1.2)}Z" fill="${C.skinS}" opacity=".48"/><ellipse cx="${n2(hx - rx * .5)}" cy="${n2(hy - ry * .45)}" rx="${n2(rx * .5)}" ry="${n2(ry * .35)}" fill="#FFF3DE" opacity=".18"/></g>`);
  // the face: eyes, brows, nose, mouth, by mood
  const ex = 3.9 + d('fEyeW') * .7, ey = hy + .6, er = 1.25 * (1 + d('fEyeS') * .25), lidC = C.ink;
  const tired = mood === 'tired', stressed = mood === 'stressed', buzz = mood === 'buzzing';
  for (const s of [-1, 1]) {
    const x = hx + s * ex;
    o.push(`<ellipse cx="${n2(x)}" cy="${n2(ey)}" rx="${n2(er)}" ry="${n2(er * (tired ? .75 : 1.2))}" fill="${C.ink}"/><circle cx="${n2(x - .4)}" cy="${n2(ey - .5)}" r=".38" fill="#FFF" opacity=".9"/>`);
    if (tired) o.push(`<path d="M${n2(x - er - .4)} ${n2(ey - .5)}Q${n2(x)} ${n2(ey - 1.6)} ${n2(x + er + .4)} ${n2(ey - .5)}" stroke="${lidC}" stroke-width=".7" fill="none"/><path d="M${n2(x - er)} ${n2(ey + 2.1)}q${n2(er)} .9 ${n2(er * 2)} 0" stroke="${C.skinS}" stroke-width=".6" fill="none"/>`);
    const by = hy - 3.9 - d('fBrow') * .3, tilt = stressed ? -s * .9 : buzz ? s * .3 : 0;
    o.push(`<path d="M${n2(x - 2.2)} ${n2(by + (stressed ? 0 : .3) - tilt)}Q${n2(x)} ${n2(by - .7)} ${n2(x + 2.2)} ${n2(by + .2 + tilt)}" stroke="${mixHex(C.hair, '#000', .25)}" stroke-width="${n2(1.05 + d('fBrow') * .3)}" fill="none" stroke-linecap="round"/>`);
  }
  const nl = 4.6 + d('fNoseL') * 1.2, nw = 1.5 + d('fNoseW') * .5;
  o.push(`<path d="M${n2(hx + .3)} ${n2(hy + 1)}L${n2(hx + nw)} ${n2(hy + 1 + nl)}Q${n2(hx)} ${n2(hy + 1.8 + nl)} ${n2(hx - nw * .7)} ${n2(hy + .9 + nl)}" fill="${C.skinS}" opacity=".85"/>`);
  const my = hy + 1.3 + nl + 2.6, mw = 2.6 * (1 + d('fMouth') * .25), lip = .9 + d('fLip') * .4;
  if (buzz) o.push(`<path d="M${n2(hx - mw)} ${n2(my - .3)}Q${n2(hx)} ${n2(my + 3.2)} ${n2(hx + mw)} ${n2(my - .3)}Z" fill="#5A1F1F"/><path d="M${n2(hx - mw * .7)} ${n2(my + .2)}Q${n2(hx)} ${n2(my + .9)} ${n2(hx + mw * .7)} ${n2(my + .2)}" fill="#FFF" opacity=".9"/>`);
  else o.push(`<path d="M${n2(hx - mw)} ${n2(my)}Q${n2(hx)} ${n2(my + (stressed ? -.3 : tired ? .3 : 1.2))} ${n2(hx + mw)} ${n2(my)}" stroke="${C.lip}" stroke-width="${n2(lip)}" fill="none" stroke-linecap="round"/>`);
  if (L.cheeks === 1 || L.cheeks === 3 || L.cheeks === 4 || buzz) for (const s of [-1, 1]) o.push(`<ellipse cx="${n2(hx + s * (ex + .8))}" cy="${n2(hy + 4.4)}" rx="2.2" ry="1.2" fill="#E36A6A" opacity="${L.cheeks === 4 ? .35 : .2}"/>`);
  if (L.mark === 3 || L.cheeks === 2 || L.cheeks === 3) for (let i = 0; i < 8; i++) o.push(`<circle cx="${n2(hx + (i % 2 ? 1 : -1) * (2.5 + (i * 1.7) % 4))}" cy="${n2(hy + 2.6 + (i % 3) * .9)}" r=".32" fill="${C.skinS}"/>`);
  if (L.mark === 4) o.push(`<circle cx="${n2(hx + mw + .9)}" cy="${n2(my - 1.6)}" r=".45" fill="${C.ink}"/>`);
  if (L.mark === 1) o.push(`<circle cx="${n2(hx + nw * .8)}" cy="${n2(hy + 1.5 + nl)}" r=".9" fill="none" stroke="#D9D6D0" stroke-width=".45"/>`);
  if (L.mark === 2) o.push(`<circle cx="${n2(hx + nw * .9)}" cy="${n2(hy + .6 + nl)}" r=".45" fill="#D9D6D0"/>`);
  if (age > 50) o.push(`<path d="M${n2(hx - 4)} ${n2(hy - ry * .55)}q4 -.8 8 0 M${n2(hx + nw + 1)} ${n2(hy + nl)}q1.6 1.6 1.2 3.6 M${n2(hx - nw - 1)} ${n2(hy + nl)}q-1.6 1.6 -1.2 3.6" stroke="${C.skinS}" stroke-width=".45" fill="none" opacity="${n2(clamp((age - 50) / 30, .2, .7))}"/>`);
  // facial hair
  const fh = L.facial || 0, hc = C.hair, fs = `fill="${hc}"`;
  if (fh === 1) o.push(`<g clip-path="url(#${uid}f)"><path d="M${n2(hx - rx)} ${n2(hy + 3)}Q${n2(hx)} ${n2(hy + 6)} ${n2(hx + rx)} ${n2(hy + 3)}L${n2(hx + rx)} ${n2(hy + ry + 3)}L${n2(hx - rx)} ${n2(hy + ry + 3)}Z" ${fs} opacity=".22"/></g>`);
  if (fh === 2 || fh === 8) o.push(`<path d="M${n2(hx - mw - (fh === 8 ? 2.2 : .6))} ${n2(my - .4 + (fh === 8 ? -1.6 : 0))}Q${n2(hx - mw)} ${n2(my - 2.2)} ${n2(hx)} ${n2(my - 1.8)}Q${n2(hx + mw)} ${n2(my - 2.2)} ${n2(hx + mw + (fh === 8 ? 2.2 : .6))} ${n2(my - .4 + (fh === 8 ? -1.6 : 0))}Q${n2(hx)} ${n2(my - 1)} ${n2(hx - mw - .6)} ${n2(my - .4)}Z" ${fs}/>`);
  if (fh === 3 || fh === 9) o.push(`<path d="M${n2(hx - (fh === 9 ? .8 : 2))} ${n2(my + 1.2)}L${n2(hx + (fh === 9 ? .8 : 2))} ${n2(my + 1.2)}L${n2(hx)} ${n2(my + (fh === 9 ? 2.6 : 5))}Z" ${fs}/>`);
  if (fh === 4 || fh === 5 || fh === 7) o.push(`<g clip-path="url(#${uid}f)"><path d="M${n2(hx - rx - 1)} ${n2(hy + (fh === 7 ? 2 : -1))}L${n2(hx - rx + (fh === 7 ? 1.4 : 2.4))} ${n2(hy + (fh === 7 ? 2 : -1))}C${n2(hx - rx + 3)} ${n2(my + 2)} ${n2(hx - 3)} ${n2(my + 1)} ${n2(hx)} ${n2(my + 1.2)}C${n2(hx + 3)} ${n2(my + 1)} ${n2(hx + rx - 3)} ${n2(my + 2)} ${n2(hx + rx - (fh === 7 ? 1.4 : 2.4))} ${n2(hy + (fh === 7 ? 2 : -1))}L${n2(hx + rx + 1)} ${n2(hy + (fh === 7 ? 2 : -1))}L${n2(hx + rx + 1)} ${n2(hy + ry + 6)}L${n2(hx - rx - 1)} ${n2(hy + ry + 6)}Z" ${fs} opacity="${fh === 4 ? .85 : 1}"/></g>${fh === 5 ? `<path d="M${n2(hx - jw - 1)} ${n2(hy + ry * .8)}Q${n2(hx)} ${n2(hy + ry + 5)} ${n2(hx + jw + 1)} ${n2(hy + ry * .8)}Z" ${fs}/>` : ''}<path d="M${n2(hx - mw - .4)} ${n2(my - .5)}Q${n2(hx)} ${n2(my - 2)} ${n2(hx + mw + .4)} ${n2(my - .5)}" stroke="${hc}" stroke-width="1.2" fill="none"/><path d="M${n2(hx - mw)} ${n2(my)}Q${n2(hx)} ${n2(my + 1)} ${n2(hx + mw)} ${n2(my)}" stroke="${C.lip}" stroke-width=".8" fill="none"/>`);
  if (fh === 6) for (const s of [-1, 1]) o.push(`<path d="M${n2(hx + s * rx)} ${n2(hy - 2)}L${n2(hx + s * (rx - 2.4))} ${n2(hy - 2)}L${n2(hx + s * (rx - 2.2))} ${n2(hy + 5)}L${n2(hx + s * rx)} ${n2(hy + 6)}Z" ${fs}/>`);
  // hair on top, then what's on the head
  csHairFront(o, K, uid, hx, hy);
  csGlasses(o, K, hx, ey, ex);
  csEarrings(o, K, hx, hy);
  csHat(o, K, hx, hy, 'front');
}
function csHairBack(o, K, hx, hy, view) {
  const { L, C, G } = K, H = CS_HAIR[L.hair] || CS_HAIR[2], rx = G.rx, ry = G.ry, c = C.hair;
  if (view === 'front' || view === 'back') {
    if (H.tex === 'afro') o.push(`<path d="${bumpy(hx, hy - 4, rx + 8, ry + 6, 16, 1.4)}" fill="${c}"/>`);
    if (H.tex === 'curly' && H.len >= 3) o.push(`<path d="${bumpy(hx, hy + 6, rx + 7, ry + 14, 18, 1.6)}" fill="${c}"/>`);
    if (H.len >= 3 && H.tex !== 'curly') { const ln = H.len === 4 ? hy + 46 : hy + 26, w = rx + (H.tex === 'wave' ? 4.4 : 3);
      o.push(`<path d="M${n2(hx - w)} ${n2(hy - 4)}C${n2(hx - w - 2)} ${n2(hy + 16)} ${n2(hx - w + (H.mullet ? 3 : 0))} ${n2(ln - 8)} ${n2(hx - w + 4)} ${n2(ln)}L${n2(hx + w - 4)} ${n2(ln)}C${n2(hx + w - (H.mullet ? 3 : 0))} ${n2(ln - 8)} ${n2(hx + w + 2)} ${n2(hy + 16)} ${n2(hx + w)} ${n2(hy - 4)}Z" fill="${C.hairS}"/>`);
      if (H.tex === 'locs' || H.tex === 'braids') for (let i = 0; i < 7; i++) o.push(`<path d="M${n2(hx - w + 2 + i * (w * 2 - 4) / 6)} ${n2(hy + 2)}L${n2(hx - w + 3 + i * (w * 2 - 6) / 6)} ${n2(ln - 1)}" stroke="${c}" stroke-width="${H.tex === 'locs' ? 2.2 : 1.6}" ${H.tex === 'braids' ? 'stroke-dasharray="1.6 .7"' : ''} stroke-linecap="round"/>`); }
    if (H.bob) o.push(`<path d="M${n2(hx - rx - 3)} ${n2(hy - 4)}L${n2(hx - rx - 3.4)} ${n2(hy + ry * .75)}Q${n2(hx)} ${n2(hy + ry * .95)} ${n2(hx + rx + 3.4)} ${n2(hy + ry * .75)}L${n2(hx + rx + 3)} ${n2(hy - 4)}Z" fill="${C.hairS}"/>`);
    if (H.x === 'tail' && view === 'back') o.push(`<path d="M${n2(hx - 2.6)} ${n2(hy - 2)}C${n2(hx - 4)} ${n2(hy + 14)} ${n2(hx - 1)} ${n2(hy + 26)} ${n2(hx)} ${n2(hy + 32)}C${n2(hx + 1)} ${n2(hy + 26)} ${n2(hx + 4)} ${n2(hy + 14)} ${n2(hx + 2.6)} ${n2(hy - 2)}Z" fill="${c}"/>`);
    if (H.x === 'pigtails') for (const s of [-1, 1]) o.push(`<path d="M${n2(hx + s * (rx + 1))} ${n2(hy - 1)}q${s * 6} 10 ${s * 2.4} 22 l${-s * 2.6} -.6 q${s * 2.2} -10 ${-s * 2.4} -20Z" fill="${c}"/>`);
  }
}
function csHairFront(o, K, uid, hx, hy) {
  const { L, C, G, age } = K, H = CS_HAIR[L.hair] || CS_HAIR[2], rx = G.rx, ry = G.ry, c = C.hair, cs = C.hairS;
  const recede = L.hairline === 1 ? clamp((age - 32) / 30, 0, 1) * 3 : 0, top = hy - ry - H.v, line = hy - ry * .48 + recede;
  if (H.tex === 'shaved') { o.push(`<path d="M${n2(hx - rx + .4)} ${n2(hy - 3)}C${n2(hx - rx)} ${n2(hy - ry - 1)} ${n2(hx + rx)} ${n2(hy - ry - 1)} ${n2(hx + rx - .4)} ${n2(hy - 3)}" fill="${c}" opacity=".18"/>`); return; }
  if (H.tex === 'afro') { o.push(`<path d="M${n2(hx - rx - 1)} ${n2(hy - 2)}Q${n2(hx - rx + 2)} ${n2(line - 2)} ${n2(hx)} ${n2(line)}Q${n2(hx + rx - 2)} ${n2(line - 2)} ${n2(hx + rx + 1)} ${n2(hy - 2)}L${n2(hx + rx + 6)} ${n2(hy - 8)}L${n2(hx - rx - 6)} ${n2(hy - 8)}Z" fill="${c}"/>`); return; }
  // the cap: from temple to temple over the crown, with a fringe along the hairline
  const side = H.len >= 1 ? hy + (H.len >= 2 ? 3 : -1.5) : hy - 3, w = rx + (H.tex === 'buzz' ? .3 : 1.4) + (H.shag ? 1 : 0);
  const fr = {
    none: `Q${n2(hx)} ${n2(line - 1)} `, side: `Q${n2(hx + 2)} ${n2(line + 2)} ${n2(hx - 1)} ${n2(line + .5)} Q${n2(hx - 5)} ${n2(line - 1.4)} `,
    part: `Q${n2(hx + rx * .5)} ${n2(line + 3.6)} ${n2(hx - 2.2)} ${n2(line - 1.4)} Q${n2(hx - rx * .6)} ${n2(line + 2)} `, up: `Q${n2(hx + 3)} ${n2(line - 3)} ${n2(hx)} ${n2(line - 2)} Q${n2(hx - 4)} ${n2(line)} `,
    full: `Q${n2(hx + rx * .6)} ${n2(line + 5.4)} ${n2(hx)} ${n2(line + 5)} Q${n2(hx - rx * .6)} ${n2(line + 5.4)} `, swoop: `Q${n2(hx + rx * .2)} ${n2(line + 1)} ${n2(hx - rx * .4)} ${n2(line + 3.6)} Q${n2(hx - rx * .8)} ${n2(line + 2.6)} `
  }[H.fr] || `Q${n2(hx)} ${n2(line)} `;
  const cap = `M${n2(hx + w)} ${n2(side)}C${n2(hx + w + .6)} ${n2(top + 4)} ${n2(hx + rx * .5)} ${n2(top)} ${n2(hx)} ${n2(top)}C${n2(hx - rx * .5)} ${n2(top)} ${n2(hx - w - .6)} ${n2(top + 4)} ${n2(hx - w)} ${n2(side)}L${n2(hx - rx + .6)} ${n2(side)}L${n2(hx - rx + .8)} ${n2(line + 1)}${fr}${n2(hx + rx - .8)} ${n2(line + 1)}L${n2(hx + rx - .6)} ${n2(side)}Z`;
  if (H.tex === 'curly' || H.shag) o.push(`<path d="${bumpy(hx, top + (ry + H.v) * .42, w + 1, (ry + H.v) * .5, 14, 1.3)}" fill="${c}"/>`);
  o.push(`<path d="${cap}" fill="${H.tex === 'buzz' ? mixHex(c, C.skin, .45) : c}"/>`);
  if (H.tex !== 'buzz') o.push(`<path d="M${n2(hx - rx * .7)} ${n2(top + 3)}Q${n2(hx - 1)} ${n2(top + .6)} ${n2(hx + rx * .3)} ${n2(top + 2)}" stroke="#FFF3DE" stroke-width="1.1" fill="none" opacity="${H.slick ? .45 : .22}" stroke-linecap="round"/><path d="M${n2(hx + w)} ${n2(side)}C${n2(hx + w + .6)} ${n2(top + 4)} ${n2(hx + rx * .5)} ${n2(top)} ${n2(hx + 1)} ${n2(top)}L${n2(hx + 3)} ${n2(top + 3)}C${n2(hx + rx * .6)} ${n2(top + 4)} ${n2(hx + rx - .8)} ${n2(top + 7)} ${n2(hx + rx - .6)} ${n2(side)}Z" fill="${cs}" opacity=".55"/>`);
  if (H.shave) o.push(`<path d="M${n2(hx - rx + .4)} ${n2(hy - 3)}L${n2(hx - rx + .6)} ${n2(line + 1)}L${n2(hx - rx * .3)} ${n2(top + 2)}L${n2(hx - w - .6)} ${n2(top + 4)}Z" fill="${mixHex(c, C.skin, .55)}"/>`);
  if (H.x === 'mohawk') o.push(`<path d="M${n2(hx - 2.6)} ${n2(line)}L${n2(hx - 3)} ${n2(top - 7)}Q${n2(hx)} ${n2(top - 11)} ${n2(hx + 3)} ${n2(top - 7)}L${n2(hx + 2.6)} ${n2(line)}Z" fill="${c}"/>`);
  if (H.x === 'bun') o.push(`<circle cx="${hx}" cy="${n2(top - 3.6)}" r="5" fill="${c}"/><circle cx="${n2(hx + 1.6)}" cy="${n2(top - 3)}" r="3.4" fill="${cs}" opacity=".45"/>`);
  if (H.x === 'buns') for (const s of [-1, 1]) o.push(`<circle cx="${n2(hx + s * (rx - 1))}" cy="${n2(top + 1)}" r="4.4" fill="${c}"/>`);
  if (H.x === 'beehive') o.push(`<ellipse cx="${hx}" cy="${n2(top + 5)}" rx="${n2(rx + .6)}" ry="9" fill="${c}"/><path d="M${n2(hx - rx * .5)} ${n2(top + 2)}q${n2(rx * .5)} -4 ${n2(rx)} 0" stroke="#FFF3DE" stroke-width="1" fill="none" opacity=".25"/>`);
  if (H.x === 'tail') o.push(`<path d="M${n2(hx + rx)} ${n2(hy - 6)}C${n2(hx + rx + 7)} ${n2(hy - 2)} ${n2(hx + rx + 6)} ${n2(hy + 14)} ${n2(hx + rx + 2)} ${n2(hy + 20)}C${n2(hx + rx + 3)} ${n2(hy + 10)} ${n2(hx + rx + 2)} ${n2(hy)} ${n2(hx + rx - 1)} ${n2(hy - 3)}Z" fill="${c}"/>`);
  if (H.len >= 3 && H.tex !== 'curly') for (const s of [-1, 1]) o.push(`<path d="M${n2(hx + s * (rx + .5))} ${n2(hy - 4)}C${n2(hx + s * (rx + 2.5))} ${n2(hy + 8)} ${n2(hx + s * (rx + 1))} ${n2(hy + (H.len === 4 ? 30 : 20))} ${n2(hx + s * (rx + 3))} ${n2(hy + (H.len === 4 ? 34 : 22))}L${n2(hx + s * (rx - 1.2))} ${n2(hy + (H.len === 4 ? 30 : 18))}C${n2(hx + s * (rx - 1.4))} ${n2(hy + 10)} ${n2(hx + s * (rx - 1))} ${n2(hy)} ${n2(hx + s * (rx - 1.4))} ${n2(hy - 4)}Z" fill="${s > 0 ? cs : c}"/>`);
}
function csGlasses(o, K, hx, ey, ex) {
  const g = K.L.glasses || 0; if (!g) return;
  const fc = ['', '#2B2B2B', '#2B2B2B', '#151515', '#B9A060', '#7A2E4A', '#B9A060', '#151515', '#B9A060', '#5B3A6E', '#E0457B', '#E3A72F', '#FFFFFF', '#B9A060'][g], lens = g === 7 ? '#151515' : g === 9 ? '#7A5A9A' : g === 10 ? '#E0457B' : g === 11 ? '#E3A72F' : '#BFD8EC', op = g === 7 || g === 9 || g === 10 || g === 11 ? .85 : .22;
  if (g === 13) { o.push(`<circle cx="${n2(hx + ex)}" cy="${n2(ey)}" r="2.9" fill="${lens}" fill-opacity=".2" stroke="${fc}" stroke-width=".6"/><path d="M${n2(hx + ex + 2.4)} ${n2(ey + 1.6)}q2 4 1 9" stroke="${fc}" stroke-width=".35" fill="none"/>`); return; }
  for (const s of [-1, 1]) { const x = hx + s * ex;
    const shape = g === 1 || g === 4 ? `<circle cx="${n2(x)}" cy="${n2(ey)}" r="2.8"` : g === 5 ? `<path d="M${n2(x - 3)} ${n2(ey - 1.6)}L${n2(x + 3 * s * 0 + 3)} ${n2(ey - 2.2)}Q${n2(x + 2.8)} ${n2(ey + 2.4)} ${n2(x)} ${n2(ey + 2.2)}Q${n2(x - 2.8)} ${n2(ey + 2)} ${n2(x - 3)} ${n2(ey - 1.6)}Z"` : g === 6 ? `<path d="M${n2(x - 3)} ${n2(ey - 1.8)}L${n2(x + 3)} ${n2(ey - 1.8)}Q${n2(x + 3)} ${n2(ey + 3)} ${n2(x)} ${n2(ey + 2.6)}Q${n2(x - 3)} ${n2(ey + 2.2)} ${n2(x - 3)} ${n2(ey - 1.8)}Z"` : g === 8 ? `<path d="M${n2(x - 3)} ${n2(ey)}L${n2(x + 3)} ${n2(ey)}Q${n2(x + 3)} ${n2(ey + 2.6)} ${n2(x)} ${n2(ey + 2.6)}Q${n2(x - 3)} ${n2(ey + 2.6)} ${n2(x - 3)} ${n2(ey)}Z"` : g === 10 ? `<path d="M${n2(x)} ${n2(ey + 2.6)}L${n2(x - 3)} ${n2(ey - .4)}A1.5 1.5 0 0 1 ${n2(x)} ${n2(ey - 1.4)}A1.5 1.5 0 0 1 ${n2(x + 3)} ${n2(ey - .4)}Z"` : g === 11 ? `<path d="M${n2(x)} ${n2(ey - 3)}L${n2(x + .9)} ${n2(ey - .8)}L${n2(x + 3)} ${n2(ey - .6)}L${n2(x + 1.3)} ${n2(ey + .8)}L${n2(x + 1.9)} ${n2(ey + 3)}L${n2(x)} ${n2(ey + 1.7)}L${n2(x - 1.9)} ${n2(ey + 3)}L${n2(x - 1.3)} ${n2(ey + .8)}L${n2(x - 3)} ${n2(ey - .6)}L${n2(x - .9)} ${n2(ey - .8)}Z"` : `<rect x="${n2(x - 3)}" y="${n2(ey - 2.1)}" width="6" height="${g === 3 ? 4.6 : 4.2}" rx="${g === 3 ? .6 : 1}"`;
    o.push(`${shape} fill="${g === 12 ? (s < 0 ? '#E33' : '#3CC') : lens}" fill-opacity="${g === 12 ? .55 : op}" stroke="${fc}" stroke-width="${g === 3 ? 1.1 : .6}"/>`); }
  o.push(`<path d="M${n2(hx - ex + 2.8)} ${n2(ey - .6)}Q${hx} ${n2(ey - 1.6)} ${n2(hx + ex - 2.8)} ${n2(ey - .6)}" stroke="${fc}" stroke-width=".6" fill="none"/>`);
}
function csEarrings(o, K, hx, hy) {
  const e = K.L.ears || 0, rx = K.G.rx; if (!e) return;
  for (const s of [-1, 1]) { const x = hx + s * (rx + .5), y = hy + 4.2;
    o.push(e === 2 ? `<circle cx="${n2(x)}" cy="${n2(y + 1.4)}" r="1.5" fill="none" stroke="#D4AF37" stroke-width=".55"/>` : e === 3 ? `<path d="M${n2(x)} ${n2(y - 5)}q${s * 1.2} 1.6 0 3" stroke="#C9C2B0" stroke-width=".7" fill="none"/>` : `<circle cx="${n2(x)}" cy="${n2(y)}" r="${e === 4 ? .8 : .6}" fill="${e === 4 ? '#EAF6FF' : '#D4AF37'}"/>`); }
}
// headwear: drawn over the hair. 'front' and 'back' share most shapes; 'side' is simpler
function csHat(o, K, hx, hy, view) {
  const h = K.L.head || 0; if (!h) return;
  const { G, C } = K, rx = G.rx, ry = G.ry, top = hy - ry - Math.min(4, (CS_HAIR[K.L.hair] || {}).v || 0), cl = C.cloth, side = view === 'side';
  const A = (s) => o.push(s);
  switch (h) {
    case 1: A(`<path d="M${n2(hx - rx - 1)} ${n2(hy - 3)}C${n2(hx - rx - 1)} ${n2(top - 2)} ${n2(hx + rx + 1)} ${n2(top - 2)} ${n2(hx + rx + 1)} ${n2(hy - 3)}Z" fill="${cl}"/>${view === 'front' ? `<path d="M${n2(hx - rx - 1)} ${n2(hy - 3.4)}Q${hx} ${n2(hy - 1)} ${n2(hx + rx + 1)} ${n2(hy - 3.4)}L${n2(hx + rx + 2)} ${n2(hy - 1.6)}Q${hx} ${n2(hy + 2.2)} ${n2(hx - rx - 2)} ${n2(hy - 1.6)}Z" fill="${csSh(cl)}"/>` : side ? `<path d="M${n2(hx + rx)} ${n2(hy - 3.6)}L${n2(hx + rx + 8)} ${n2(hy - 2.4)}L${n2(hx + rx)} ${n2(hy - 1.6)}Z" fill="${csSh(cl)}"/>` : ''}`); break;
    case 2: case 16: A(`<path d="M${n2(hx - rx - 1.2)} ${n2(hy - 2)}C${n2(hx - rx - 1)} ${n2(top - 4)} ${n2(hx + rx + 1)} ${n2(top - 4)} ${n2(hx + rx + 1.2)} ${n2(hy - 2)}Z" fill="${cl}"/><rect x="${n2(hx - rx - 1.6)}" y="${n2(hy - 5)}" width="${n2(rx * 2 + 3.2)}" height="3.6" rx="1.4" fill="${csSh(cl)}"/>${h === 16 ? `<path d="M${hx} ${n2(top - 4)}v-3 M${n2(hx - 5)} ${n2(top - 7)}h10" stroke="#E63946" stroke-width="1.3"/>` : `<circle cx="${hx}" cy="${n2(top - 4)}" r="2.2" fill="${csHi(cl)}"/>`}`); break;
    case 3: A(`<path d="M${n2(hx - rx - 1)} ${n2(hy - 4)}C${n2(hx - rx)} ${n2(top - 1)} ${n2(hx + rx)} ${n2(top - 1)} ${n2(hx + rx + 1)} ${n2(hy - 4)}Q${hx} ${n2(hy - 6)} ${n2(hx - rx - 1)} ${n2(hy - 4)}Z" fill="#B3261E"/>${[0, 1, 2, 3].map(i => `<circle cx="${n2(hx - 6 + i * 4)}" cy="${n2(top + 3)}" r=".6" fill="#FFF"/>`).join('')}`); break;
    case 4: case 8: case 23: { const tall = h === 23 ? 13 : h === 8 ? 6 : 5, br = h === 4 ? 7 : 5; A(`<ellipse cx="${hx}" cy="${n2(hy - 6)}" rx="${n2(rx + br)}" ry="2.4" fill="${csSh(h === 23 ? '#151515' : cl)}"/><path d="M${n2(hx - rx + 1)} ${n2(hy - 6)}L${n2(hx - rx + 2)} ${n2(top - tall + 4)}Q${hx} ${n2(top - tall + 1)} ${n2(hx + rx - 2)} ${n2(top - tall + 4)}L${n2(hx + rx - 1)} ${n2(hy - 6)}Z" fill="${h === 23 ? '#151515' : cl}"/><rect x="${n2(hx - rx + 1.4)}" y="${n2(hy - 9)}" width="${n2(rx * 2 - 2.8)}" height="2" fill="${h === 23 ? '#8C2E2E' : csDeep(cl)}"/>`); break; }
    case 5: A(`<path d="M${n2(hx - rx - 2)} ${n2(hy)}C${n2(hx - rx - 2)} ${n2(top - 5)} ${n2(hx + rx + 2)} ${n2(top - 5)} ${n2(hx + rx + 2)} ${n2(hy)}" stroke="#2B2B2B" stroke-width="1.8" fill="none"/>${side ? `<rect x="${n2(hx - 3)}" y="${n2(hy - 3)}" width="6" height="8" rx="2.4" fill="#2B2B2B"/>` : [-1, 1].map(s => `<rect x="${n2(hx + s * (rx + 2) - 2.4)}" y="${n2(hy - 3)}" width="4.8" height="8" rx="2.2" fill="#2B2B2B"/>`).join('')}`); break;
    case 6: A(`<ellipse cx="${n2(hx + 2)}" cy="${n2(top + 2)}" rx="${n2(rx + 3)}" ry="4.6" fill="${cl}"/><circle cx="${n2(hx + 2)}" cy="${n2(top - 2.4)}" r=".9" fill="${csDeep(cl)}"/>`); break;
    case 7: A(`<path d="M${n2(hx - rx - .4)} ${n2(hy - 6)}Q${hx} ${n2(top + 1)} ${n2(hx + rx + .4)} ${n2(hy - 6)}" stroke="${cl}" stroke-width="2.6" fill="none"/>`); break;
    case 9: A(`<path d="M${n2(hx - rx - 1)} ${n2(hy - 3)}C${n2(hx - rx - 1)} ${n2(top - 2)} ${n2(hx + rx + 1)} ${n2(top - 2)} ${n2(hx + rx + 1)} ${n2(hy - 3)}Z" fill="#151515"/>${view !== 'back' ? `<rect x="${n2(hx - 4)}" y="${n2(top + .5)}" width="8" height="3.4" fill="#F3EFE6"/><text x="${hx}" y="${n2(top + 3.2)}" font-size="2.6" text-anchor="middle" font-family="sans-serif" font-weight="700" fill="#151515">DIR</text>` : ''}`); break;
    case 10: A([-4, -2, 0, 2, 4].map((dx, i) => `<circle cx="${n2(hx + dx * rx / 4.4)}" cy="${n2(top + 1 + Math.abs(dx) * .4)}" r="2" fill="${['#E85D9A', '#FFD23F', '#9BE564', '#FF8C42', '#B39DDB'][i]}"/>`).join('')); break;
    case 11: A(`<path d="M${n2(hx - rx - 3)} ${n2(hy - 3)}L${n2(hx - rx + 1)} ${n2(top - 1)}L${n2(hx + rx - 1)} ${n2(top - 1)}L${n2(hx + rx + 3)} ${n2(hy - 3)}Z" fill="${cl}"/>`); break;
    case 12: A(`<path d="M${n2(hx - rx - 9)} ${n2(hy - 6)}Q${hx} ${n2(hy - 2)} ${n2(hx + rx + 9)} ${n2(hy - 6)}Q${hx} ${n2(hy - 9)} ${n2(hx - rx - 9)} ${n2(hy - 6)}Z" fill="#8C5A2E"/><path d="M${n2(hx - rx + 1)} ${n2(hy - 7)}Q${n2(hx - 4)} ${n2(top - 6)} ${hx} ${n2(top - 2)}Q${n2(hx + 4)} ${n2(top - 6)} ${n2(hx + rx - 1)} ${n2(hy - 7)}Z" fill="#A0703E"/>`); break;
    case 13: A(`<path d="M${n2(hx - rx - .6)} ${n2(hy - 5)}Q${hx} ${n2(hy - 9)} ${n2(hx + rx + .6)} ${n2(hy - 5)}" stroke="${cl}" stroke-width="2.4" fill="none"/>${view === 'front' ? `<path d="M${n2(hx - rx)} ${n2(hy - 4)}Q${hx} ${n2(hy + 1)} ${n2(hx + rx)} ${n2(hy - 4)}Z" fill="${csSh(cl)}" opacity=".85"/>` : ''}`); break;
    case 14: A(`<path d="M${n2(hx - 7)} ${n2(top + 2)}L${n2(hx - 7)} ${n2(top - 5)}L${n2(hx - 3.5)} ${n2(top - 1)}L${hx} ${n2(top - 7)}L${n2(hx + 3.5)} ${n2(top - 1)}L${n2(hx + 7)} ${n2(top - 5)}L${n2(hx + 7)} ${n2(top + 2)}Z" fill="#E3B23C"/>`); break;
    case 15: A(`<path d="M${n2(hx - rx - 4)} ${n2(hy - 5)}L${n2(hx + 2)} ${n2(top - 22)}L${n2(hx + rx + 4)} ${n2(hy - 5)}Z" fill="#3B2C8C"/><circle cx="${n2(hx - 1)}" cy="${n2(top - 4)}" r="1" fill="#FFD23F"/>`); break;
    case 17: case 18: for (const s of [-1, 1]) A(h === 17 ? `<ellipse cx="${n2(hx + s * 4)}" cy="${n2(top - 8)}" rx="2.6" ry="8" fill="#F4F2EE"/><ellipse cx="${n2(hx + s * 4)}" cy="${n2(top - 8)}" rx="1.2" ry="5.4" fill="#F2C6D6"/>` : `<path d="M${n2(hx + s * 3)} ${n2(top + 1)}L${n2(hx + s * 7)} ${n2(top - 6)}L${n2(hx + s * 9)} ${n2(top + 2)}Z" fill="${C.hair}"/>`); break;
    case 19: A(`<ellipse cx="${hx}" cy="${n2(top - 6)}" rx="9" ry="2" fill="none" stroke="#FFD23F" stroke-width="1.3"/>`); break;
    case 20: for (const s of [-1, 1]) A(`<path d="M${n2(hx + s * 5)} ${n2(top + 2)}Q${n2(hx + s * 9)} ${n2(top - 3)} ${n2(hx + s * 8)} ${n2(top - 8)}Q${n2(hx + s * 6)} ${n2(top - 3)} ${n2(hx + s * 3)} ${n2(top + 1)}Z" fill="#B3261E"/>`); break;
    case 21: A(`<path d="M${n2(hx - 5)} ${n2(top + 1)}L${hx} ${n2(top - 14)}L${n2(hx + 5)} ${n2(top + 1)}Z" fill="#2F5BD3"/><circle cx="${hx}" cy="${n2(top - 14)}" r="1.4" fill="#FFD23F"/>`); break;
    case 22: A(`<rect x="${n2(hx - rx)}" y="${n2(top - 6)}" width="${n2(rx * 2)}" height="9" fill="#FFFFFF"/><path d="${bumpy(hx, top - 8, rx + 1.4, 5, 10, 1.2)}" fill="#FFFFFF"/>`); break;
  }
}
// ---------------- the body ----------------
// clothes: which have long sleeves, which reach the knee, which are open at the front
const CS_SHORT = new Set([0, 13, 16]), CS_LONGTOP = new Set([10, 18]), CS_OPEN = new Set([3, 8, 9, 12, 15, 18]);
function csTorsoPath(G, cx, sy, wy, hipY, hem, flare, puff) {
  const sw = G.sw + puff, ww = G.ww + puff * .6, hp = G.hp + puff * .4;
  return `M${n2(cx - 4)} ${n2(sy - 3)}C${n2(cx - sw + 4)} ${n2(sy - 2.6)} ${n2(cx - sw - .6)} ${n2(sy + .6)} ${n2(cx - sw)} ${n2(sy + 7)}C${n2(cx - sw + .4)} ${n2(sy + 22)} ${n2(cx - ww - .8)} ${n2(wy - 14)} ${n2(cx - ww)} ${n2(wy)}C${n2(cx - ww)} ${n2(wy + 8)} ${n2(cx - hp - flare * .4)} ${n2(hipY - 6)} ${n2(cx - hp - flare)} ${n2(hem)}L${n2(cx + hp + flare)} ${n2(hem)}C${n2(cx + hp + flare * .4)} ${n2(hipY - 6)} ${n2(cx + ww)} ${n2(wy + 8)} ${n2(cx + ww)} ${n2(wy)}C${n2(cx + ww + .8)} ${n2(wy - 14)} ${n2(cx + sw - .4)} ${n2(sy + 22)} ${n2(cx + sw)} ${n2(sy + 7)}C${n2(cx + sw + .6)} ${n2(sy + .6)} ${n2(cx + sw - 4)} ${n2(sy - 2.6)} ${n2(cx + 4)} ${n2(sy - 3)}Z`;
}
function csPattern(uid, pat, base) {
  const pc = mixHex(base, pat === 6 ? '#3B2516' : '#FFFFFF', pat === 6 ? .6 : .5);
  const P = { 1: `<rect width="6" height="2.4" fill="${pc}"/>`, 2: `<rect width="6" height="2" fill="${pc}" opacity=".6"/><rect width="2" height="6" fill="${pc}" opacity=".6"/>`, 3: `<circle cx="3" cy="3" r="1" fill="${pc}"/>`,
    4: `<circle cx="3" cy="3" r="1.1" fill="#FFE27A"/><circle cx="1.8" cy="3" r=".8" fill="${pc}"/><circle cx="4.2" cy="3" r=".8" fill="${pc}"/>`, 5: `<circle cx="1.5" cy="1.5" r="2.2" fill="#E85D9A" opacity=".4"/><circle cx="4.5" cy="4.5" r="2.2" fill="#1FA3A0" opacity=".4"/>`,
    6: `<ellipse cx="2.2" cy="2.2" rx="1.2" ry=".8" fill="none" stroke="${pc}" stroke-width=".6"/>`, 7: `<rect width=".4" height="6" fill="${pc}"/>`, 8: `<circle cx="1.5" cy="2.2" r="1.8" fill="#4E5B3A" opacity=".55"/><circle cx="4.8" cy="4.5" r="1.6" fill="#2F3A24" opacity=".55"/>`, 9: `<path d="M3 1.2l.5 1.2 1.3.1-1 .8.3 1.3-1.1-.7-1.1.7.3-1.3-1-.8 1.3-.1z" fill="${pc}"/>` }[pat];
  return P ? `<defs><pattern id="${uid}pt" width="6" height="6" patternUnits="userSpaceOnUse"${pat === 1 || pat === 7 ? ' patternTransform="rotate(90)"' : ''}>${P}</pattern></defs>` : '';
}
// shoes, front / back / side
const CS_SHOE = [['#F4F2EE', 'band'], ['#C8102E', 'top'], ['#5A3A22', 'boot'], ['#2E2018', 'low'], ['#151515', 'heel'], ['#B98A55', 'sandal'], ['#7A4A28', 'low'], ['#151515', 'plat'], ['#B98A55', 'cowboy'], ['#F2C6D6', 'fluff']];
function csShoeFront(o, K, x, ty, s) {
  const sh = K.L.shoes || 0, [col, kind] = CS_SHOE[sh], dk = csSh(col), w = kind === 'fluff' ? 6.4 : kind === 'heel' ? 3.6 : 5.2, h = kind === 'plat' ? 9 : 6.2, sole = kind === 'plat' ? 3.4 : kind === 'heel' ? .6 : 1.6;
  if (kind === 'boot' || kind === 'plat' || kind === 'cowboy' || kind === 'top') o.push(`<rect x="${n2(x - 4.2)}" y="${n2(ty - h - (kind === 'top' ? 6 : 13))}" width="8.4" height="${kind === 'top' ? 8 : 15}" rx="2" fill="${s > 0 ? dk : col}"/>`);
  if (kind === 'sandal') { o.push(`<path d="M${n2(x - w)} ${n2(ty - 1.4)}Q${n2(x - w)} ${n2(ty - h)} ${x} ${n2(ty - h)}Q${n2(x + w)} ${n2(ty - h)} ${n2(x + w)} ${n2(ty - 1.4)}Z" fill="${K.C.skin}"/><path d="M${n2(x - w + .6)} ${n2(ty - 3.6)}L${n2(x + w - .6)} ${n2(ty - 3.6)}" stroke="${col}" stroke-width="1.4"/>`); }
  else o.push(`<path d="M${n2(x - w)} ${n2(ty - sole)}Q${n2(x - w - .4)} ${n2(ty - h)} ${n2(x + s * .6)} ${n2(ty - h)}Q${n2(x + w + .4)} ${n2(ty - h)} ${n2(x + w)} ${n2(ty - sole)}Z" fill="${col}"/><path d="M${n2(x + s * .5)} ${n2(ty - h)}Q${n2(x + w + .4)} ${n2(ty - h)} ${n2(x + w)} ${n2(ty - sole)}L${n2(x + s * 1.4)} ${n2(ty - sole)}Z" fill="${dk}" opacity=".55"/>`);
  if (kind === 'band') o.push(`<path d="M${n2(x - w + 1)} ${n2(ty - 3.4)}Q${x} ${n2(ty - 4.6)} ${n2(x + w - 1)} ${n2(ty - 3.4)}" stroke="${K.C.cloth}" stroke-width="1.1" fill="none"/>`);
  if (kind === 'fluff') for (let i = 0; i < 5; i++) o.push(`<circle cx="${n2(x - w + 1.4 + i * (w * 2 - 2.8) / 4)}" cy="${n2(ty - h + .6)}" r="1.4" fill="#FFF" opacity=".75"/>`);
  if (kind !== 'heel') o.push(`<rect x="${n2(x - w - .3)}" y="${n2(ty - sole)}" width="${n2(w * 2 + .6)}" height="${n2(sole)}" rx=".7" fill="${kind === 'band' || kind === 'top' ? '#ECE8E0' : csDeep(col)}"/>`);
}
function csShoeSide(o, K, x, ty, tilt, far) {
  const sh = K.L.shoes || 0, [col0, kind] = CS_SHOE[sh], col = far ? csSh(col0) : col0, L = kind === 'heel' ? 12 : kind === 'fluff' ? 15 : 14, h = kind === 'plat' ? 8.5 : 6.4, sole = kind === 'plat' ? 3.2 : kind === 'heel' ? .6 : 1.6, toe = kind === 'cowboy' || kind === 'heel' ? 2.2 : 0;
  const shaft = kind === 'boot' || kind === 'cowboy' ? 12 : kind === 'plat' ? 13 : kind === 'top' ? 6 : 0;
  o.push(`<g transform="translate(${n2(x)} ${n2(ty)}) rotate(${n2(tilt)} 0 -4)">`);
  if (shaft) o.push(`<rect x="-4.2" y="${n2(-h - shaft)}" width="8" height="${shaft + 2}" rx="1.6" fill="${col}"/>`);
  if (kind === 'sandal') o.push(`<path d="M-4.2 -1.2Q-4.6 -5.4 -1 -6Q6 -5.6 ${L - 3} -1.6L${L - 3} 0L-4.2 0Z" fill="${far ? csSh(K.C.skin) : K.C.skin}"/><path d="M-1 -5.6L1.4 -.4M5 -4.6L6 -.4" stroke="${col}" stroke-width="1.3"/>`);
  else o.push(`<path d="M-4.6 ${n2(-sole)}Q-5 ${n2(-h)} -1.6 ${n2(-h)}L1.6 ${n2(-h)}Q4.6 ${n2(-h + 2)} ${n2(L - 4)} ${n2(-h * .62)}Q${n2(L + toe)} ${n2(-h * .5)} ${n2(L - .6 + toe)} ${n2(-sole)}Z" fill="${col}"/><path d="M1.6 ${n2(-h)}Q4.6 ${n2(-h + 2)} ${n2(L - 4)} ${n2(-h * .62)}" stroke="#FFF3DE" stroke-width=".7" fill="none" opacity=".25"/>`);
  if (kind === 'band') o.push(`<path d="M-2.6 -3.2Q4 -5.4 ${n2(L * .6)} -2.4" stroke="${K.C.cloth}" stroke-width="1.1" fill="none"/>`);
  if (kind === 'heel') o.push(`<path d="M-4.4 -.6L-3.6 ${n2(-5)}" stroke="${csDeep(col)}" stroke-width="1.4"/>`);
  else o.push(`<rect x="-5" y="${n2(-sole)}" width="${n2(L + 4.4 + toe)}" height="${n2(sole)}" rx=".7" fill="${kind === 'band' || kind === 'top' ? '#ECE8E0' : csDeep(col)}"/>`);
  o.push('</g>');
}
function csShoeBack(o, K, x, ty) {
  const sh = K.L.shoes || 0, [col, kind] = CS_SHOE[sh], w = kind === 'fluff' ? 6 : kind === 'heel' ? 3 : 4.6, shaft = kind === 'boot' || kind === 'cowboy' ? 13 : kind === 'plat' ? 13 : kind === 'top' ? 6 : 0;
  if (shaft) o.push(`<rect x="${n2(x - 4.2)}" y="${n2(ty - 6 - shaft)}" width="8.4" height="${shaft + 2}" rx="2" fill="${col}"/>`);
  o.push(`<path d="M${n2(x - w)} ${n2(ty - 1.4)}Q${n2(x - w)} ${n2(ty - 7)} ${x} ${n2(ty - 7)}Q${n2(x + w)} ${n2(ty - 7)} ${n2(x + w)} ${n2(ty - 1.4)}Z" fill="${kind === 'sandal' || kind === 'heel' ? K.C.skin : col}"/>${kind === 'heel' ? `<rect x="${n2(x - .8)}" y="${n2(ty - 4)}" width="1.6" height="4" fill="${col}"/>` : `<rect x="${n2(x - w - .2)}" y="${n2(ty - 1.8)}" width="${n2(w * 2 + .4)}" height="1.8" rx=".6" fill="${csDeep(col)}"/>`}`);
}
// legs and lower clothes, front or back; pose: 'stand' | 'sit'
function csLegs(o, K, cx, view, pose) {
  const { L, C, G } = K, bot = L.bottoms || 0, top = L.outfit, hipY = 121, lf = G.limb, legC = top === 19 ? C.cloth : C.bot;
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19, sit = pose === 'sit';
  const out = [];
  for (const s of [-1, 1]) {
    const hx = cx + s * G.hp * .5, H = [hx, hipY], K2 = sit ? [hx + s * 2.6, hipY + 11] : [hx + s * .4, 170], A = sit ? [hx + s * 2.2, 165] : [hx + s * .9, 214], ty = sit ? 175 : 224;
    const R = [6.6 * lf + (G.hp - 14) * .25, 4.6 * lf, 3.1 * lf], skin = s > 0 ? csSh(C.skin) : C.skin;
    const J = [H, K2, A];
    csLimb(out, J, R, C.skin);
    if (longLeg) { const e = bot === 1 || bot === 9 ? .3 : bot === 8 ? 1.4 : 1, Rt = [R[0] + e, R[1] + e, R[2] + e + (bot === 8 ? 2.4 : 0)]; csLimb(out, [H, K2, [A[0], A[1] + (bot === 9 || bot === 1 ? -1 : 1)]], Rt, legC);
      if (bot === 7) out.push(`<rect x="${n2(K2[0] + s * 3 - 3.2)}" y="${n2(sit ? K2[1] - 4 : K2[1] - 22)}" width="6.4" height="7" rx="1" fill="${csSh(legC)}"/>`);
      if (bot === 6) out.push(`<path d="M${n2(H[0])} ${n2(H[1] + 4)}L${n2(A[0])} ${n2(A[1] - 2)}" stroke="${csHi(legC)}" stroke-width=".5" opacity=".7"/>`); }
    else if (bot === 3 && top !== 19) csLimb(out, [H, lerp2(H, K2, sit ? .9 : .52)], [R[0] + 1.4, R[1] + 2], C.bot);
    if (sit && view !== 'back') { const lc = longLeg ? legC : C.skin, rw = R[0] + (longLeg ? 1 : 0);
      out.push(`<ellipse cx="${n2((H[0] + K2[0]) / 2)}" cy="${n2(hipY + 5)}" rx="${n2(rw + .6)}" ry="7.4" fill="${s > 0 ? lc : csHi(lc)}"/><ellipse cx="${n2(K2[0])}" cy="${n2(K2[1] + 1.4)}" rx="${n2(rw)}" ry="3.6" fill="${s > 0 ? csSh(lc) : lc}"/><path d="M${n2(K2[0] - R[1])} ${n2(K2[1] + 5)}Q${n2(K2[0])} ${n2(K2[1] + 8)} ${n2(K2[0] + R[1])} ${n2(K2[1] + 5)}" stroke="${csDeep(lc)}" stroke-width="1.6" fill="none" opacity=".55"/>`); }
    if (view === 'back') csShoeBack(out, K, A[0], ty); else csShoeFront(out, K, A[0], ty, s);
    void skin;
  }
  o.push(out.join(''));
  // the seat of the trousers, or a skirt
  if (longLeg || bot === 3) o.push(`<path d="M${n2(cx - G.ww)} ${n2(hipY - 22)}L${n2(cx + G.ww)} ${n2(hipY - 22)}C${n2(cx + G.hp + .6)} ${n2(hipY - 10)} ${n2(cx + G.hp + 1)} ${n2(hipY + 2)} ${n2(cx + 2)} ${n2(hipY + 8)}L${n2(cx - 2)} ${n2(hipY + 8)}C${n2(cx - G.hp - 1)} ${n2(hipY + 2)} ${n2(cx - G.hp - .6)} ${n2(hipY - 10)} ${n2(cx - G.ww)} ${n2(hipY - 22)}Z" fill="${legC}"/><path d="M${cx} ${n2(hipY - 18)}L${cx} ${n2(hipY + 7)}" stroke="${csSh(legC)}" stroke-width=".7"/>`);
  if ((bot === 4 || bot === 5) && top !== 19 && top !== 10) { const hem = sit ? hipY + 12 : bot === 4 ? 150 : 200, wd = bot === 4 ? G.hp + 4 : G.hp + 9;
    o.push(`<path d="M${n2(cx - G.ww)} ${n2(hipY - 22)}L${n2(cx + G.ww)} ${n2(hipY - 22)}L${n2(cx + wd)} ${n2(hem)}Q${cx} ${n2(hem + 2)} ${n2(cx - wd)} ${n2(hem)}Z" fill="${C.bot}"/><path d="M${n2(cx + G.ww * .3)} ${n2(hipY - 22)}L${n2(cx + wd * .5)} ${n2(hem)}L${n2(cx + wd)} ${n2(hem)}L${n2(cx + G.ww)} ${n2(hipY - 22)}Z" fill="${csSh(C.bot)}" opacity=".7"/>`); }
}
// arms, front or back; returns the hand positions
function csArms(o, K, cx, view, armPose, front) {
  const { L, G, C } = K, top = L.outfit, short = CS_SHORT.has(top), lf = G.limb, sl = top === 19 ? '#F4F2EE' : C.cloth, wide = top === 12 ? 2 : top === 17 ? 1.6 : 0;
  const pose = armPose || (['stand', 'hip', 'wave', 'cross', 'pocket'][L.pose || 0]);
  const res = {};
  for (const s of [-1, 1]) {
    const S0 = [cx + s * (G.sw - 3.4), 60];
    let E = [cx + s * (G.sw - .4), 96], W = [cx + s * (G.sw - 1.6 + (G.hp - G.ww) * .4), 126];
    if (pose === 'hold') { E = [cx + s * (G.ww + 4.6), 98]; W = [cx + s * 6.4, 130]; }
    if (pose === 'lap') { E = [cx + s * (G.ww + 5), 100]; W = [cx + s * (G.hp - .5), 124]; }
    if (pose === 'reach') { E = [cx + s * (G.ww + 4), 92]; W = [cx + s * (G.ww - 2), 82]; }
    if (pose === 'hip' && s > 0) { E = [cx + G.sw + 9, 86]; W = [cx + G.ww + 2, 101]; }
    if (pose === 'wave' && s > 0) { E = [cx + G.sw + 8, 76]; W = [cx + G.sw + 10, 52]; }
    if (pose === 'pocket') { E = [cx + s * (G.ww + 7.4), 97]; W = [cx + s * (G.hp - 2.6), 120]; }
    if (pose === 'cross') { E = [cx + s * (G.sw - 1), 92]; W = [cx - s * (G.ww - 2), 88]; }
    if (typeof armPose === 'object' && armPose) { const p = armPose(s); E = p[0]; W = p[1]; }
    res[s] = { S: S0, E, W };
  }
  const drawArm = (s, part) => {
    const { S: S0, E, W } = res[s], R = [4.8 * lf, 3.9 * lf, 3 * lf], out = [];
    if (part !== 'fore') { if (short) { csLimb(out, [S0, E], [R[0], R[1]], C.skin); csLimb(out, [S0, lerp2(S0, E, .45)], [R[0] + 1, R[0] + .6], sl); } else csLimb(out, [S0, E], [R[0] + .8 + wide * .3, R[1] + .9 + wide * .5], sl); }
    if (part !== 'upper') { if (short) csLimb(out, [E, W], [R[1], R[2]], C.skin); else { csLimb(out, [E, lerp2(E, W, .88)], [R[1] + .9 + wide * .5, R[2] + .9 + wide], sl); }
      if (!(pose === 'pocket' || pose === 'reach' || view === 'back' && pose === 'hold')) { const d = [W[0] - E[0], W[1] - E[1]], l = Math.hypot(d[0], d[1]) || 1, u = [d[0] / l, d[1] / l];
        out.push(`<ellipse cx="${n2(W[0] + u[0] * 3.2)}" cy="${n2(W[1] + u[1] * 3.2)}" rx="2.9" ry="4" transform="rotate(${n2(Math.atan2(u[1], u[0]) * 180 / Math.PI - 90)} ${n2(W[0] + u[0] * 3.2)} ${n2(W[1] + u[1] * 3.2)})" fill="${s > 0 ? csSh(C.skin) : C.skin}"/>`); } }
    return out.join('');
  };
  return { res, drawArm, pose };
}
function csAccessories(o, K, cx, view, hands) {
  const { L, C, G } = K, bag = L.bag || 0, n = L.neck || 0, w = L.wrist || 0, sy = 55;
  if (view !== 'back') {
    if (n === 1 || n === 6) o.push(`<path d="M${n2(cx - 6)} ${n2(sy - 3)}Q${cx} ${n2(sy + 3)} ${n2(cx + 6)} ${n2(sy - 3)}L${n2(cx + 6.6)} ${n2(sy)}Q${cx} ${n2(sy + 6)} ${n2(cx - 6.6)} ${n2(sy)}Z" fill="${n === 6 ? '#E0457B' : '#B3261E'}"/><path d="M${n2(cx + 3)} ${n2(sy + 2)}l1.4 ${n === 6 ? 12 : 16} l3 -.4 l-1.6 -15Z" fill="${n === 6 ? '#E0457B' : '#B3261E'}"/>`);
    if (n === 2 || n === 3 || n === 7) o.push(`<path d="M${n2(cx - 4.4)} ${n2(sy - 2.6)}Q${cx} ${n2(sy + (n === 3 ? 7 : 5))} ${n2(cx + 4.4)} ${n2(sy - 2.6)}" stroke="#D4AF37" stroke-width="${n === 3 ? 1 : .5}" fill="none"/>${n === 7 ? `<circle cx="${cx}" cy="${n2(sy + 4.4)}" r="1.4" fill="#1FA3A0"/>` : ''}`);
    if (n === 4) o.push(`<path d="M${n2(cx - 4)} ${n2(sy - 2)}L${cx} ${n2(sy)}L${n2(cx - 4)} ${n2(sy + 2)}Z M${n2(cx + 4)} ${n2(sy - 2)}L${cx} ${n2(sy)}L${n2(cx + 4)} ${n2(sy + 2)}Z" fill="#B3261E"/>`);
    if (n === 5) o.push(`<path d="M${n2(cx - 4)} ${n2(sy - 2.6)}L${n2(cx - 1)} ${n2(sy + 20)}M${n2(cx + 4)} ${n2(sy - 2.6)}L${n2(cx + 1)} ${n2(sy + 20)}" stroke="#2F5BD3" stroke-width=".9"/><rect x="${n2(cx - 4)}" y="${n2(sy + 19)}" width="8" height="10.4" rx="1" fill="#F4F2EE"/><rect x="${n2(cx - 4)}" y="${n2(sy + 19)}" width="8" height="3" fill="#2F5BD3"/><text x="${cx}" y="${n2(sy + 21.4)}" font-size="2.2" text-anchor="middle" fill="#FFF" font-family="sans-serif" font-weight="700">CREW</text>`);
  }
  if (w && hands && hands[-1]) { const { E, W } = hands[-1], d = [W[0] - E[0], W[1] - E[1]], l = Math.hypot(d[0], d[1]) || 1, p = [W[0] - d[0] / l * 1.4, W[1] - d[1] / l * 1.4]; o.push(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${w === 2 ? 1.6 : 1.9}" fill="${w === 2 ? 'none' : '#F3EFE6'}" stroke="${['', '#3B3226', '#D4AF37', '#8C6A2E', '#1E1E1E'][w]}" stroke-width="${w === 2 ? .7 : .9}"/>`); }
  // bags and things carried
  if (bag === 2 && view === 'back') o.push(`<rect x="${n2(cx - G.sw + 4)}" y="${sy + 4}" width="${n2((G.sw - 4) * 2)}" height="34" rx="7" fill="${csSh(C.bot)}"/><rect x="${n2(cx - G.sw + 7)}" y="${sy + 20}" width="${n2((G.sw - 7) * 2)}" height="12" rx="3" fill="${C.bot}"/>`);
  if (bag === 2 && view !== 'back') o.push(`<path d="M${n2(cx - G.sw + 6)} ${sy}L${n2(cx - G.sw + 6.5)} ${sy + 34}M${n2(cx + G.sw - 6)} ${sy}L${n2(cx + G.sw - 6.5)} ${sy + 34}" stroke="${csSh(C.bot)}" stroke-width="2"/>`);
  if (bag === 3 || bag === 4) o.push(`<path d="M${n2(cx - G.sw + 5)} ${sy}L${n2(cx + G.hp + 2)} ${sy + 52}" stroke="${bag === 3 ? '#1E1E1E' : '#6B4E3A'}" stroke-width="1.8"/><rect x="${n2(cx + G.hp - 5)}" y="${sy + 50}" width="${bag === 3 ? 13 : 15}" height="${bag === 3 ? 10 : 12}" rx="2" fill="${bag === 3 ? '#2B2B2B' : '#8A6A4A'}"/>`);
  if (bag === 6) o.push(`<path d="M${n2(cx + 6)} ${n2(sy - 6)}Q${n2(cx + 18)} ${n2(sy - 6)} ${n2(cx + 19)} ${n2(sy + 14)}L${n2(cx + 24)} ${n2(sy + 80)}Q${n2(cx + 26)} ${n2(sy + 100)} ${n2(cx + 13)} ${n2(sy + 102)}Q${n2(cx + 2)} ${n2(sy + 98)} ${n2(cx + 6)} ${n2(sy + 80)}Z" fill="#2B2B2B" opacity="${view === 'back' ? 1 : .0}"/>`);
  const R = hands && hands[1] && hands[1].W, free = R && view !== 'back';
  if (free) {
    if (bag === 1) o.push(`<path d="M${n2(R[0] - 2.6)} ${n2(R[1] + 5)}L${n2(R[0] - 5.6)} ${n2(R[1] + 10)}M${n2(R[0] + 2.6)} ${n2(R[1] + 5)}L${n2(R[0] + 5.6)} ${n2(R[1] + 10)}" stroke="#C9B48A" stroke-width="1"/><rect x="${n2(R[0] - 7)}" y="${n2(R[1] + 10)}" width="14" height="15" rx="1.4" fill="#E9DCC0"/>`);
    if (bag === 5) o.push(`<rect x="${n2(R[0] - 5)}" y="${n2(R[1] + 3)}" width="10" height="6" rx="1.4" fill="#C9A646"/>`);
    if (bag === 7) o.push(`<rect x="${n2(R[0] - 4.6)}" y="${n2(R[1] + 1)}" width="9.2" height="12.6" fill="#FDFBF3"/><path d="M${n2(R[0] - 3)} ${n2(R[1] + 4)}h6M${n2(R[0] - 3)} ${n2(R[1] + 6.6)}h4.4M${n2(R[0] - 3)} ${n2(R[1] + 9.2)}h6" stroke="#9A958A" stroke-width=".45"/>`);
    if (bag === 8) o.push(`<path d="M${n2(R[0] - 2.8)} ${n2(R[1] + 1)}L${n2(R[0] + 2.8)} ${n2(R[1] + 1)}L${n2(R[0] + 2.2)} ${n2(R[1] + 10)}L${n2(R[0] - 2.2)} ${n2(R[1] + 10)}Z" fill="#F4F2EE"/><rect x="${n2(R[0] - 2.6)}" y="${n2(R[1] + 4)}" width="5.2" height="2.6" fill="#8A5A37"/>`);
    if (bag === 9) o.push(`<circle cx="${n2(R[0])}" cy="${n2(R[1] + 7)}" r="5.6" fill="#B9B5AE"/><circle cx="${n2(R[0])}" cy="${n2(R[1] + 7)}" r="1.6" fill="#7A766F"/>`);
  }
}
// the full figure, front or back. opts: { view: 'front'|'back', pose: 'stand'|'sit', arms: 'stand'|'hold'|'lap'|'reach'|null }
function csFigure(o, K, uid, opts = {}) {
  const { L, C, G } = K, cx = 60, view = opts.view || 'front', sit = opts.pose === 'sit', top = L.outfit, sy = 55, wy = 100, hipY = 121;
  const puff = top === 17 ? 2.4 : 0, hem = CS_LONGTOP.has(top) ? (top === 10 ? 168 : 160) - (sit ? 30 : 0) : hipY + 5, flare = top === 10 ? (sit ? 8 : 12) : top === 18 ? 7 : 0;
  // the floor shadow
  o.push(`<ellipse cx="${cx}" cy="${sit ? 176 : 225}" rx="${n2(G.hp + 13)}" ry="3" fill="#120E22" opacity=".18"/>`);
  if (view !== 'back') { csHairBack(o, K, cx, 31, 'front'); K._hb = 1; }   // long hair falls behind the shoulders, not over the chest
  const arms = csArms(o, K, cx, view, opts.arms || null);
  if (L.bag === 6 && view !== 'back') o.push(`<g transform="rotate(14 ${cx + 8} 110)"><path d="M${cx + 2} 52Q${cx + 13} 48 ${cx + 15} 62L${cx + 19} 132Q${cx + 25} 154 ${cx + 9} 160Q${cx - 7} 154 ${cx} 132Z" fill="#2B2B2B"/></g>`);
  if (view === 'back') csHairBack(o, K, cx, 31, 'never');
  csLegs(o, K, cx, view, sit ? 'sit' : 'stand');
  // arms behind the body (the far parts of bent arms, or both when seen from behind and reaching)
  const behind = view === 'back' || ['cross'].includes(arms.pose) ? [] : [];
  for (const s of [-1, 1]) if (!(arms.pose === 'cross' || arms.pose === 'hold' || arms.pose === 'lap' || arms.pose === 'hip' && s > 0 || arms.pose === 'pocket') || view === 'back') o.push(arms.drawArm(s, 'all'));
  else o.push(arms.drawArm(s, 'upper'));
  void behind;
  // neck and torso
  o.push(`<path d="M${n2(cx - 3.8)} 40L${n2(cx + 3.8)} 40L${n2(cx + 4.4)} ${sy}L${n2(cx - 4.4)} ${sy}Z" fill="${C.skin}"/><path d="M${n2(cx + 1.6)} 40L${n2(cx + 3.8)} 40L${n2(cx + 4.4)} ${sy}L${n2(cx + 2.2)} ${sy}Z" fill="${C.skinS}" opacity=".8"/><path d="M${n2(cx - 3.8)} 41Q${cx} 46 ${n2(cx + 3.8)} 41" fill="${C.skinS}" opacity=".7"/>`);
  if (top === 1 && view !== 'side') o.push(`<path d="M${n2(cx - 9)} ${sy - 1}Q${n2(cx - 8)} ${sy - 9} ${cx} ${sy - 10}Q${n2(cx + 8)} ${sy - 9} ${n2(cx + 9)} ${sy - 1}Z" fill="${csSh(C.cloth)}"/>`);
  const tc = top === 19 ? '#F4F2EE' : C.cloth, torso = csTorsoPath(G, cx, sy, wy, hipY, hem, flare, puff);
  o.push(`<clipPath id="${uid}t"><path d="${torso}"/></clipPath><path d="${torso}" fill="${tc}"/>`);
  const pat = top === 16 && !L.pattern ? 4 : top === 2 && !L.pattern ? 2 : L.pattern || 0;
  if (pat && top !== 19) o.push(csPattern(uid, pat, tc) + `<path d="${torso}" fill="url(#${uid}pt)"/>`);
  // the light: a cool shadow down the right side, a warm edge on the left
  o.push(`<g clip-path="url(#${uid}t)"><path d="M${n2(cx + G.ww * .35)} 40Q${n2(cx + G.ww * .5)} 100 ${n2(cx + G.ww * .2)} 200L120 200L120 40Z" fill="${csSh(tc)}" opacity=".7"/><path d="M${n2(cx - G.sw - 2)} 50L${n2(cx - G.sw + 3)} 50L${n2(cx - G.ww + 2)} 160L${n2(cx - G.ww - 4)} 160Z" fill="#FFF3DE" opacity=".12"/>`);
  if (view !== 'back') csClothes(o, K, cx, sy, wy, hipY, hem);
  else o.push(`<path d="M${cx} ${sy + 2}L${cx} ${n2(hem - 2)}" stroke="${csSh(tc)}" stroke-width=".5" opacity=".5"/>${top === 1 ? `<path d="M${n2(cx - 9)} ${sy - 1}Q${cx} ${sy + 18} ${n2(cx + 9)} ${sy - 1}Q${cx} ${sy + 4} ${n2(cx - 9)} ${sy - 1}Z" fill="${csSh(tc)}"/>` : ''}${top === 18 ? `<rect x="${n2(cx - G.ww - 1)}" y="${wy - 1.5}" width="${n2(G.ww * 2 + 2)}" height="3" fill="${csSh(tc)}"/>` : ''}`);
  o.push('</g>');
  if (top === 19) o.push(`<path d="M${n2(cx - G.ww + 1)} ${sy + 18}L${n2(cx + G.ww - 1)} ${sy + 18}L${n2(cx + G.ww + .5)} ${wy}L${n2(cx + G.hp)} ${hipY - 2}L${n2(cx - G.hp)} ${hipY - 2}L${n2(cx - G.ww - .5)} ${wy}Z" fill="${C.cloth}"/><path d="M${n2(cx - G.ww + 2)} ${sy + 19}L${n2(cx - G.sw + 6)} ${sy}M${n2(cx + G.ww - 2)} ${sy + 19}L${n2(cx + G.sw - 6)} ${sy}" stroke="${C.cloth}" stroke-width="2.4"/>`);
  // arms in front of the body
  for (const s of [-1, 1]) if (view !== 'back' && (arms.pose === 'cross' || arms.pose === 'hold' || arms.pose === 'lap' || arms.pose === 'hip' && s > 0 || arms.pose === 'pocket')) o.push(arms.drawArm(s, arms.pose === 'cross' ? 'all' : 'fore'));
  csAccessories(o, K, cx, view, arms.res);
  // the head
  if (view === 'back') csHeadBack(o, K, uid, cx, 31); else csHeadFront(o, K, uid, cx, 31);
  return arms.res;
}
// the clothes' details, front view
function csClothes(o, K, cx, sy, wy, hipY, hem) {
  const { L, C, G } = K, top = L.outfit, c = C.cloth, d = csSh(c), dd = csDeep(c), lt = csHi(c), A = s => o.push(s);
  const vneck = (depth, inner) => A(`<path d="M${n2(cx - 4.6)} ${sy - 2.6}L${cx} ${sy + depth}L${n2(cx + 4.6)} ${sy - 2.6}Z" fill="${inner}"/>`);
  switch (top) {
    case 0: case 13: A(`<path d="M${n2(cx - 4.6)} ${sy - 2.6}Q${cx} ${sy + 3} ${n2(cx + 4.6)} ${sy - 2.6}" stroke="${d}" stroke-width="1.3" fill="none"/>`); if (top === 13) A(`<path d="M${cx + 1} ${sy + 12}L${cx - 4} ${sy + 22}L${cx} ${sy + 22}L${cx - 2.5} ${sy + 31}L${cx + 5} ${sy + 18}L${cx + 1} ${sy + 18}L${cx + 3.5} ${sy + 12}Z" fill="#FFE27A"/>`); break;
    case 1: A(`<path d="M${n2(cx - 2)} ${sy}L${n2(cx - 2.6)} ${sy + 14}M${n2(cx + 2)} ${sy}L${n2(cx + 2.6)} ${sy + 13}" stroke="#F4F2EE" stroke-width=".6"/><path d="M${n2(cx - G.ww + 2)} ${hipY - 4}L${n2(cx - G.ww + 4)} ${wy - 6}L${n2(cx + G.ww - 4)} ${wy - 6}L${n2(cx + G.ww - 2)} ${hipY - 4}" stroke="${d}" stroke-width=".8" fill="none"/>`); break;
    case 2: case 7: A(`<path d="M${n2(cx - 5)} ${sy - 3}L${cx} ${sy + 3}L${n2(cx + 5)} ${sy - 3}L${n2(cx + 4)} ${sy + 3}L${cx} ${sy + 2}L${n2(cx - 4)} ${sy + 3}Z" fill="${top === 7 ? '#F4F2EE' : lt}"/><path d="M${cx} ${sy + 3}L${cx} ${n2(hem)}" stroke="${d}" stroke-width=".5"/>${[0, 1, 2, 3].map(i => `<circle cx="${n2(cx + .9)}" cy="${n2(sy + 8 + i * 12)}" r=".6" fill="${lt}"/>`).join('')}`); break;
    case 3: case 8: case 15: case 12: { const inner = top === 12 ? lt : '#F4F2EE', tr = top === 12 ? '#E3A72F' : d;
      A(`<path d="M${n2(cx - 5)} ${sy - 3}L${n2(cx + 5)} ${sy - 3}L${n2(cx + 3)} ${n2(hem)}L${n2(cx - 3)} ${n2(hem)}Z" fill="${top === 12 ? c : inner}"/><path d="M${n2(cx - 5.4)} ${sy - 3}L${cx - 1} ${wy - 4}L${n2(cx - 7)} ${sy + 12}L${n2(cx - 9.6)} ${sy + 9}Z M${n2(cx + 5.4)} ${sy - 3}L${cx + 1} ${wy - 4}L${n2(cx + 7)} ${sy + 12}L${n2(cx + 9.6)} ${sy + 9}Z" fill="${tr}"/>`);
      if (top === 3) A([-1, 1].map(s => `<rect x="${n2(cx + s * 8 - 3.4)}" y="${sy + 12}" width="6.8" height="5.4" rx=".6" fill="none" stroke="${lt}" stroke-width=".5"/>`).join(''));
      if (top === 8 || top === 15) A(`<circle cx="${n2(cx + 1.2)}" cy="${wy - 2}" r=".9" fill="${dd}"/><circle cx="${n2(cx + 1.2)}" cy="${wy + 5}" r=".9" fill="${dd}"/>`); break; }
    case 9: vneck(16, '#F4F2EE'); A(`<path d="M${cx - 1.4} ${sy + 1}L${cx + 1.4} ${sy + 1}L${cx + 2.2} ${sy + 18}L${cx} ${sy + 21}L${cx - 2.2} ${sy + 18}Z" fill="#7A2E2E"/><path d="M${n2(cx - 5.4)} ${sy - 3}L${cx - 1} ${wy - 4}L${n2(cx - 7)} ${sy + 12}L${n2(cx - 9.6)} ${sy + 9}Z M${n2(cx + 5.4)} ${sy - 3}L${cx + 1} ${wy - 4}L${n2(cx + 7)} ${sy + 12}L${n2(cx + 9.6)} ${sy + 9}Z" fill="${d}"/>`); break;
    case 4: A(`<path d="M${n2(cx - 5)} ${sy - 3}L${cx + 3} ${sy + 10}L${cx + 2} ${n2(hem)}" stroke="${dd}" stroke-width=".8" fill="none"/><path d="M${n2(cx - 5.4)} ${sy - 3}L${n2(cx - 10)} ${sy + 10}L${n2(cx - 4)} ${sy + 8}Z" fill="${d}"/><path d="M${n2(cx - G.sw + 4)} ${sy + 6}Q${n2(cx - 4)} ${sy + 3} ${n2(cx - 2)} ${sy + 20}" stroke="#FFF" stroke-width=".7" fill="none" opacity=".25"/>`); break;
    case 5: A(`<rect x="${n2(cx - 5.4)}" y="${sy - 10}" width="10.8" height="10" rx="3" fill="${c}"/><path d="M${n2(cx - 5)} ${sy - 7}h10M${n2(cx - 5)} ${sy - 4.4}h10" stroke="${d}" stroke-width=".5"/>`); break;
    case 6: A(`<path d="M${n2(cx - 4.6)} ${sy - 2.6}Q${cx} ${sy + 3} ${n2(cx + 4.6)} ${sy - 2.6}" stroke="${d}" stroke-width="1.6" fill="none"/><path d="M${n2(cx - G.hp)} ${n2(hem - 3)}L${n2(cx + G.hp)} ${n2(hem - 3)}" stroke="${d}" stroke-width="2.4" stroke-dasharray=".8 .8"/>`); break;
    case 10: A(`<path d="M${n2(cx - 4.6)} ${sy - 2.6}Q${cx} ${sy + 5} ${n2(cx + 4.6)} ${sy - 2.6}" fill="${C.skin}"/><path d="M${n2(cx - G.ww)} ${wy}Q${cx} ${wy + 2} ${n2(cx + G.ww)} ${wy}" stroke="${dd}" stroke-width="1.2" fill="none"/>`); break;
    case 11: A(`<path d="M${cx} ${sy - 2}L${cx} ${n2(hem)}" stroke="#D8D8D8" stroke-width=".7"/><path d="M${n2(cx - 5)} ${sy - 3}Q${cx} ${sy - 1} ${n2(cx + 5)} ${sy - 3}" stroke="${d}" stroke-width="2"/>`); break;
    case 14: for (let i = 0; i < 26; i++) A(`<circle cx="${n2(cx - G.sw + 4 + ((i * 37) % 100) / 100 * (G.sw * 2 - 8))}" cy="${n2(sy + 3 + ((i * 53) % 100) / 100 * (hipY - sy - 4))}" r=".55" fill="#FFF" opacity=".7"/>`); break;
    case 16: A(`<path d="M${n2(cx - 5.4)} ${sy - 3}L${cx} ${sy + 6}L${n2(cx + 5.4)} ${sy - 3}L${n2(cx + 7)} ${sy + 4}L${cx} ${sy + 8}L${n2(cx - 7)} ${sy + 4}Z" fill="${lt}"/>`); break;
    case 17: A([sy + 12, sy + 24, wy - 8, wy + 4, hipY - 6].map(y => `<path d="M${n2(cx - G.sw - 1)} ${y}Q${cx} ${y + 2} ${n2(cx + G.sw + 1)} ${y}" stroke="${d}" stroke-width=".9" fill="none"/>`).join('') + `<path d="M${cx} ${sy - 2}L${cx} ${n2(hem)}" stroke="${dd}" stroke-width=".7"/>`); break;
    case 18: A(`<path d="M${n2(cx - 5.4)} ${sy - 3}L${cx - 1} ${sy + 16}L${n2(cx - 9)} ${sy + 11}Z M${n2(cx + 5.4)} ${sy - 3}L${cx + 1} ${sy + 16}L${n2(cx + 9)} ${sy + 11}Z" fill="${d}"/><rect x="${n2(cx - G.ww - 1.4)}" y="${wy - 1.6}" width="${n2(G.ww * 2 + 2.8)}" height="3.2" fill="${d}"/><rect x="${cx - 2.4}" y="${wy - 2}" width="4.8" height="4" fill="none" stroke="#C9A646" stroke-width=".8"/>${[sy + 20, sy + 30, wy + 8].map(y => `<circle cx="${cx - 4.6}" cy="${y}" r=".9" fill="${dd}"/><circle cx="${cx + 4.6}" cy="${y}" r=".9" fill="${dd}"/>`).join('')}`); break;
    case 19: A(`<path d="M${n2(cx - 4.6)} ${sy - 2.6}Q${cx} ${sy + 3} ${n2(cx + 4.6)} ${sy - 2.6}" stroke="#D8D4CA" stroke-width="1.2" fill="none"/>`); break;
  }
  if (L.tattoo === 1 && CS_SHORT.has(top)) A(`<path d="M${n2(cx - G.sw - 1)} ${sy + 18}q2 3 0 6q-2 3 0 6" stroke="#2B3A66" stroke-width="1" fill="none" opacity=".7"/>`);
}
function csHeadBack(o, K, uid, hx, hy) {
  const { L, C, G } = K, rx = G.rx, ry = G.ry, H = CS_HAIR[L.hair] || CS_HAIR[2];
  for (const s of [-1, 1]) o.push(`<ellipse cx="${n2(hx + s * (rx + .3))}" cy="${n2(hy + 1.4)}" rx="2.1" ry="3.2" fill="${s > 0 ? C.skinS : C.skin}"/>`);
  o.push(`<ellipse cx="${hx}" cy="${n2(hy)}" rx="${n2(rx)}" ry="${n2(ry)}" fill="${C.skin}"/><path d="M${n2(hx + rx * .3)} ${n2(hy - ry)}L${n2(hx + rx + 1)} ${n2(hy - ry)}L${n2(hx + rx + 1)} ${n2(hy + ry)}L${n2(hx + rx * .3)} ${n2(hy + ry)}Z" fill="${C.skinS}" opacity=".3"/>`);
  if (H.tex === 'shaved') { o.push(`<ellipse cx="${hx}" cy="${n2(hy - 2)}" rx="${n2(rx - .4)}" ry="${n2(ry - 2)}" fill="${C.hair}" opacity=".16"/>`); csHat(o, K, hx, hy, 'back'); return; }
  if (H.tex === 'afro' || H.tex === 'curly') o.push(`<path d="${bumpy(hx, hy - (H.tex === 'afro' ? 4 : 1), rx + (H.tex === 'afro' ? 8 : 2.6), ry + (H.tex === 'afro' ? 6 : 2), 16, 1.4)}" fill="${C.hair}"/>`);
  else { const nape = H.len >= 1 ? hy + ry * .7 : hy + ry * .4, top = hy - ry - H.v;
    o.push(`<path d="M${n2(hx - rx - 1)} ${n2(hy)}C${n2(hx - rx - 1.4)} ${n2(top + 3)} ${n2(hx - rx * .4)} ${n2(top)} ${hx} ${n2(top)}C${n2(hx + rx * .4)} ${n2(top)} ${n2(hx + rx + 1.4)} ${n2(top + 3)} ${n2(hx + rx + 1)} ${n2(hy)}C${n2(hx + rx)} ${n2(nape - 2)} ${n2(hx + 4)} ${n2(nape)} ${hx} ${n2(nape)}C${n2(hx - 4)} ${n2(nape)} ${n2(hx - rx)} ${n2(nape - 2)} ${n2(hx - rx - 1)} ${n2(hy)}Z" fill="${H.tex === 'buzz' ? mixHex(C.hair, C.skin, .45) : C.hair}"/><path d="M${n2(hx + 2)} ${n2(top + 1)}C${n2(hx + rx * .5)} ${n2(top)} ${n2(hx + rx + 1.4)} ${n2(top + 3)} ${n2(hx + rx + 1)} ${n2(hy)}C${n2(hx + rx)} ${n2(nape - 2)} ${n2(hx + 4)} ${n2(nape)} ${n2(hx + 2)} ${n2(nape)}Z" fill="${C.hairS}" opacity=".5"/>`); }
  csHairBack(o, K, hx, hy, 'back');
  if (H.x === 'bun') o.push(`<circle cx="${hx}" cy="${n2(hy - ry - H.v - 2)}" r="5" fill="${C.hair}"/>`);
  if (H.x === 'buns') for (const s of [-1, 1]) o.push(`<circle cx="${n2(hx + s * (rx - 1))}" cy="${n2(hy - ry + 1)}" r="4.4" fill="${C.hair}"/>`);
  if (H.x === 'beehive') o.push(`<ellipse cx="${hx}" cy="${n2(hy - ry - H.v + 5)}" rx="${n2(rx + .6)}" ry="9" fill="${C.hair}"/>`);
  if (H.x === 'mohawk') o.push(`<path d="M${n2(hx - 2.6)} ${n2(hy + ry * .6)}L${n2(hx - 3)} ${n2(hy - ry - 7)}Q${hx} ${n2(hy - ry - 11)} ${n2(hx + 3)} ${n2(hy - ry - 7)}L${n2(hx + 2.6)} ${n2(hy + ry * .6)}Z" fill="${C.hair}"/>`);
  csHat(o, K, hx, hy, 'back');
}
// ---------------- in profile, walking (facing right) ----------------
function csSide(o, K, uid, ph) {
  const { L, C, G } = K, top = L.outfit, bot = L.bottoms || 0, short = CS_SHORT.has(top), lf = G.limb, cx = 60, sy = 55, wy = 100, hipY = 121;
  const rad = d0 => d0 * Math.PI / 180, thigh = 50, shin = 43;
  const leg = side => { if (ph === null || ph === undefined) return { a: side * 2, k: 3, lift: 0 }; const p = ph * Math.PI * 2 + (side > 0 ? 0 : Math.PI), sw = Math.sin(p), lift = Math.max(0, Math.cos(p)); const sv = Math.max(0, Math.cos(p + .55)); return { a: 17 * sw, k: 5 + 46 * sv * sv * sv, lift: sv * sv }; };
  const joints = g => { const H = [cx + 1, hipY], K2 = [H[0] + Math.sin(rad(g.a)) * thigh, H[1] + Math.cos(rad(g.a)) * thigh], sa = g.a - g.k, A = [K2[0] + Math.sin(rad(sa)) * shin, K2[1] + Math.cos(rad(sa)) * shin]; return { H, K: K2, A }; };
  const gN = leg(1), gF = leg(-1), JN = joints(gN), JF = joints(gF), drop = 224 - 10 - Math.max(JN.A[1], JF.A[1]);
  o.push(`<ellipse cx="${cx + 2}" cy="225" rx="${n2(G.hp + 12)}" ry="3" fill="#120E22" opacity=".18"/><g transform="translate(0 ${n2(drop)})">`);
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19, legC = top === 19 ? C.cloth : C.bot, R = [6.8 * lf, 4.7 * lf, 3.2 * lf];
  const drawLeg = (J, g, far) => { const out = [], tone = c => far ? csSh(c) : c;
    csLimb(out, [J.H, J.K, J.A], R, tone(C.skin));
    if (longLeg) csLimb(out, [J.H, J.K, [J.A[0], J.A[1] + 1]], R.map(r => r + 1.1), tone(legC)); else if (bot === 3 && top !== 19) csLimb(out, [J.H, lerp2(J.H, J.K, .55)], [R[0] + 1.4, R[1] + 2], tone(C.bot));
    csShoeSide(out, K, J.A[0], J.A[1] + 10, g.lift ? -g.lift * 18 + (g.a > 10 ? 8 : 0) : 0, far); o.push(out.join('')); };
  const arm = side => { const sw = ph === null || ph === undefined ? 0 : -Math.sin(ph * Math.PI * 2 + (side > 0 ? 0 : Math.PI)), S0 = [cx - 1, sy + 6], ua = 3 + sw * 15, fa = ua + 9 + Math.max(0, sw) * 20, E = [S0[0] + Math.sin(rad(ua)) * 34, S0[1] + Math.cos(rad(ua)) * 34], W = [E[0] + Math.sin(rad(fa)) * 28, E[1] + Math.cos(rad(fa)) * 28]; return { S: S0, E, W, fa }; };
  const drawArm = (A, far) => { const out = [], tone = c => far ? csSh(c) : c, sl = top === 19 ? '#F4F2EE' : C.cloth, Rr = [4.8 * lf, 3.9 * lf, 3 * lf];
    if (short) { csLimb(out, [A.S, A.E, A.W], Rr, tone(C.skin)); csLimb(out, [A.S, lerp2(A.S, A.E, .45)], [Rr[0] + 1, Rr[0] + .6], tone(sl)); } else csLimb(out, [A.S, A.E, lerp2(A.E, A.W, .88)], Rr.map(r => r + .9), tone(sl));
    const u = [Math.sin(rad(A.fa)), Math.cos(rad(A.fa))]; out.push(`<ellipse cx="${n2(A.W[0] + u[0] * 3)}" cy="${n2(A.W[1] + u[1] * 3)}" rx="2.6" ry="3.9" transform="rotate(${n2(-A.fa)} ${n2(A.W[0] + u[0] * 3)} ${n2(A.W[1] + u[1] * 3)})" fill="${tone(C.skin)}"/>`); o.push(out.join('')); };
  const H = CS_HAIR[L.hair] || CS_HAIR[2], hx = cx + 1, hy = 31, rx = G.rx * .95, ry = G.ry;
  // long hair behind; the far arm and leg
  if (H.len >= 3 && H.tex !== 'curly') o.push(`<path d="M${n2(hx - 6)} ${n2(hy - 6)}C${n2(hx - 16)} ${n2(hy + 4)} ${n2(hx - 15)} ${n2(hy + 30)} ${n2(hx - 12)} ${n2(hy + (H.len === 4 ? 52 : 30))}L${n2(hx - 4)} ${n2(hy + (H.len === 4 ? 52 : 30))}C${n2(hx - 6)} ${n2(hy + 24)} ${n2(hx - 2)} ${n2(hy + 8)} ${n2(hx - 2)} ${n2(hy)}Z" fill="${C.hairS}"/>`);
  drawArm(arm(-1), true); drawLeg(JF, gF, true);
  // body in profile
  const ch = 10.5 * (G.ww / 12.8), bk = 9 * (G.ww / 12.8), hf = 8.6 * (G.hp / 14.2), hb = 10.6 * (G.hp / 14.2), dress = top === 10, hem = dress ? 168 : top === 18 ? 160 : hipY + 4;
  if (longLeg || bot === 3) o.push(`<path d="M${n2(cx - bk)} ${wy}L${n2(cx + ch * .8)} ${wy}C${n2(cx + hf + 1)} ${hipY - 6} ${n2(cx + hf + 1)} ${hipY + 4} ${n2(cx + 6)} ${hipY + 10}L${n2(cx - 6)} ${hipY + 10}C${n2(cx - hb - 2)} ${hipY + 6} ${n2(cx - hb - 1)} ${hipY - 6} ${n2(cx - bk)} ${wy}Z" fill="${legC}"/>`);
  if ((bot === 4 || bot === 5) && !dress && top !== 19) o.push(`<path d="M${n2(cx - bk)} ${wy}L${n2(cx + ch * .8)} ${wy}L${n2(cx + hf + 6)} ${bot === 4 ? 150 : 198}L${n2(cx - hb - 6)} ${bot === 4 ? 150 : 198}Z" fill="${C.bot}"/>`);
  drawLeg(JN, gN, false);
  const tc = top === 19 ? '#F4F2EE' : C.cloth;
  const torso = `M${cx - 4} ${sy - 3}C${n2(cx + 4)} ${sy - 4} ${n2(cx + ch)} ${sy + 6} ${n2(cx + ch)} ${sy + 16}C${n2(cx + ch + .4)} ${sy + 26} ${n2(cx + ch * .8)} ${wy - 12} ${n2(cx + ch * .78)} ${wy}C${n2(cx + ch * .8)} ${hipY - 8} ${n2(cx + hf + (dress ? 5 : 0))} ${n2(hem - 6)} ${n2(cx + hf + (dress ? 9 : 0))} ${n2(hem)}L${n2(cx - hb - (dress ? 9 : 0))} ${n2(hem)}C${n2(cx - hb - (dress ? 4 : 1))} ${n2(hem - 8)} ${n2(cx - bk - 1)} ${wy + 6} ${n2(cx - bk)} ${wy}C${n2(cx - bk + 1)} ${wy - 14} ${n2(cx - bk - 1)} ${sy + 20} ${n2(cx - bk)} ${sy + 10}C${n2(cx - bk)} ${sy + 2} ${cx - 9} ${sy - 1} ${cx - 4} ${sy - 3}Z`;
  o.push(`<clipPath id="${uid}s"><path d="${torso}"/></clipPath><path d="${torso}" fill="${tc}"/><g clip-path="url(#${uid}s)"><rect x="${n2(cx - bk - 2)}" y="40" width="${n2(bk * .8)}" height="160" fill="${csSh(tc)}" opacity=".7"/><rect x="${n2(cx + ch * .5)}" y="40" width="4" height="160" fill="#FFF3DE" opacity=".14"/></g>`);
  if (top === 19) o.push(`<path d="M${n2(cx)} ${sy + 18}L${n2(cx + ch)} ${sy + 16}L${n2(cx + ch * .8)} ${wy}L${n2(cx - bk + 2)} ${wy}Z" fill="${C.cloth}"/>`);
  // neck and head in profile
  o.push(`<path d="M${cx - 3.4} 40L${cx + 3.6} 40L${cx + 4.4} ${sy + 1}L${cx - 4.6} ${sy + 1}Z" fill="${C.skin}"/>`);
  const face = `M${n2(hx - rx)} ${n2(hy - 2)}C${n2(hx - rx)} ${n2(hy - ry - 1)} ${n2(hx + rx * .9)} ${n2(hy - ry - 1)} ${n2(hx + rx * .95)} ${n2(hy - 3)}L${n2(hx + rx + 2.6)} ${n2(hy + 3.2)}Q${n2(hx + rx + 2.8)} ${n2(hy + 4.4)} ${n2(hx + rx + .4)} ${n2(hy + 4.6)}L${n2(hx + rx + .6)} ${n2(hy + 7)}Q${n2(hx + rx + 1.2)} ${n2(hy + 8.6)} ${n2(hx + rx)} ${n2(hy + 9.6)}C${n2(hx + rx)} ${n2(hy + 13)} ${n2(hx + rx * .5)} ${n2(hy + ry)} ${n2(hx + 1)} ${n2(hy + ry)}L${n2(hx - 3)} ${n2(hy + ry - 1)}C${n2(hx - rx)} ${n2(hy + ry - 3)} ${n2(hx - rx - 1)} ${n2(hy + 6)} ${n2(hx - rx)} ${n2(hy - 2)}Z`;
  o.push(`<path d="${face}" fill="${C.skin}"/><ellipse cx="${n2(hx - 2.4)}" cy="${n2(hy + 1.6)}" rx="2.2" ry="3.2" fill="${C.skinS}"/><ellipse cx="${n2(hx + rx * .62)}" cy="${n2(hy + .4)}" rx="1" ry="1.3" fill="${C.ink}"/><path d="M${n2(hx + rx * .4)} ${n2(hy - 3.4)}q2 -1.2 3.6 -.2" stroke="${mixHex(C.hair, '#000', .25)}" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M${n2(hx + rx - .4)} ${n2(hy + 7.4)}l1.4 .1" stroke="${C.lip}" stroke-width=".9" stroke-linecap="round"/>`);
  if (L.glasses) o.push(`<rect x="${n2(hx + rx * .62 - 2.6)}" y="${n2(hy - 1.8)}" width="5" height="4" rx="1" fill="${L.glasses === 7 ? '#151515' : '#BFD8EC'}" fill-opacity="${L.glasses === 7 ? .85 : .25}" stroke="#2B2B2B" stroke-width=".6"/><path d="M${n2(hx + rx * .62 - 2.6)} ${n2(hy - .4)}L${n2(hx - 2)} ${n2(hy - .4)}" stroke="#2B2B2B" stroke-width=".6"/>`);
  if (L.facial >= 4 && L.facial <= 5) o.push(`<path d="M${n2(hx - 2)} ${n2(hy + 6)}C${n2(hx + 4)} ${n2(hy + 8)} ${n2(hx + rx)} ${n2(hy + 9.4)} ${n2(hx + rx)} ${n2(hy + 10)}C${n2(hx + rx)} ${n2(hy + 13)} ${n2(hx + rx * .5)} ${n2(hy + ry + 1)} ${n2(hx + 1)} ${n2(hy + ry + 1)}Z" fill="${C.hair}"/>`);
  // hair from the side
  const c = C.hair, cs = C.hairS, top0 = hy - ry - H.v;
  if (H.tex === 'afro' || H.tex === 'curly') o.push(`<path d="${bumpy(hx - 3, hy - 4, rx + (H.tex === 'afro' ? 7 : 2), ry + (H.tex === 'afro' ? 4 : 1), 14, 1.3)}" fill="${c}"/>`);
  else if (H.tex === 'shaved') o.push(`<path d="M${n2(hx - rx)} ${n2(hy)}C${n2(hx - rx)} ${n2(hy - ry - 1)} ${n2(hx + rx * .8)} ${n2(hy - ry - 1)} ${n2(hx + rx * .8)} ${n2(hy - 6)}" fill="${c}" opacity=".18"/>`);
  else { o.push(`<path d="M${n2(hx - rx - 1.4)} ${n2(hy + (H.len >= 1 ? 8 : 3))}C${n2(hx - rx - 2)} ${n2(top0 + 2)} ${n2(hx)} ${n2(top0 - .4)} ${n2(hx + rx * .5)} ${n2(top0 + 1)}C${n2(hx + rx + 1)} ${n2(top0 + 3)} ${n2(hx + rx + 1.6)} ${n2(hy - 6)} ${n2(hx + rx + (H.fr === 'full' ? 1.4 : .4))} ${n2(hy - (H.fr === 'full' ? 2.6 : 5))}C${n2(hx + rx * .3)} ${n2(hy - 7)} ${n2(hx - 2)} ${n2(hy - 6)} ${n2(hx - 4)} ${n2(hy - 1)}L${n2(hx - 4.4)} ${n2(hy + (H.len >= 1 ? 8 : 3))}Z" fill="${H.tex === 'buzz' ? mixHex(c, C.skin, .45) : c}"/><path d="M${n2(hx - rx)} ${n2(top0 + 5)}Q${n2(hx - 2)} ${n2(top0)} ${n2(hx + 4)} ${n2(top0 + 1)}" stroke="#FFF3DE" stroke-width="1" fill="none" opacity=".22"/>`);
    if (H.x === 'tail' || H.x === 'pigtails') o.push(`<path d="M${n2(hx - rx)} ${n2(hy - 4)}C${n2(hx - rx - 9)} ${n2(hy - 2)} ${n2(hx - rx - 9)} ${n2(hy + 16)} ${n2(hx - rx - 5)} ${n2(hy + 24)}C${n2(hx - rx - 4)} ${n2(hy + 12)} ${n2(hx - rx - 2)} ${n2(hy + 2)} ${n2(hx - rx + 1)} ${n2(hy - 1)}Z" fill="${c}"/>`);
    if (H.x === 'bun' || H.x === 'buns') o.push(`<circle cx="${n2(hx - 5)}" cy="${n2(top0 - 2)}" r="5" fill="${c}"/>`);
    if (H.x === 'beehive') o.push(`<ellipse cx="${n2(hx - 1)}" cy="${n2(top0 + 5)}" rx="${n2(rx + 1)}" ry="9" fill="${c}"/>`);
    if (H.x === 'mohawk') o.push(`<path d="M${n2(hx - rx)} ${n2(hy - 2)}Q${n2(hx - 2)} ${n2(top0 - 12)} ${n2(hx + rx)} ${n2(hy - 8)}L${n2(hx + 2)} ${n2(hy - 6)}Z" fill="${c}"/>`);
    if (H.len >= 2 && !(H.len >= 3)) o.push(`<path d="M${n2(hx - rx - 1)} ${n2(hy)}C${n2(hx - rx - 2)} ${n2(hy + 8)} ${n2(hx - rx)} ${n2(hy + 12)} ${n2(hx - 4)} ${n2(hy + 13)}L${n2(hx - 3)} ${n2(hy + 2)}Z" fill="${cs}"/>`); }
  csHat(o, K, hx, hy, 'side');
  drawArm(arm(1), false);
  o.push('</g>');
}
// ---------------- the public renderers ----------------
function csFullSVG(L0, age, size, opts = {}) {
  const K = csLook(L0, age), uid = 'cs' + (++CS_UID), o = [];
  if (opts.view === 'side') csSide(o, K, uid, opts.ph);
  else csFigure(o, K, uid, opts);
  const hs = K.G.hs, body = `<g transform="translate(60 224) scale(${n2(hs)}) translate(-60 -224)">${o.join('')}</g>`;
  const bg = opts.bare ? '' : `<rect width="120" height="240" rx="10" fill="${mixHex(K.C.cloth, '#F4EFE6', .82)}"/><rect y="196" width="120" height="44" fill="${mixHex(K.C.cloth, '#2A2440', .55)}" opacity=".12"/>`;
  return `<svg class="portrait figure callsheet${opts.view === 'side' ? ' side' : ''}" viewBox="0 0 120 240" width="${Math.round((size || 122) / 2)}" height="${size || 122}" role="img" aria-label="Full-length portrait">${bg}${body}</svg>`;
}
function csPortraitSVG(L0, age, size, bare) {
  const K = csLook(L0, age), uid = 'cs' + (++CS_UID), o = [];
  csFigure(o, K, uid, { view: 'front', arms: 'stand' });
  const c = K.C.cloth, bg = bare ? '' : `<defs><radialGradient id="${uid}bg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${mixHex(c, '#FFF7EA', .82)}"/><stop offset="1" stop-color="${mixHex(c, '#B8B2C8', .6)}"/></radialGradient></defs><rect width="120" height="120" rx="10" fill="url(#${uid}bg)"/>`;
  return `<svg class="portrait callsheet" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Portrait">${bg}<g transform="translate(60 56) scale(2.05) translate(-60 -35)">${o.join('')}</g></svg>`;
}
// the new look is everyone's unless they chose another: style 0 is now Call Sheet, 1 Cartoon, 2 the old realistic look
LOOK.style.opts = ['Call Sheet', 'Cartoon', 'Classic'];
{ const _ps = portraitSVG; portraitSVG = function (L, age, size = 96, bare = false, fig = false) {
  const st = (L && L.style) || 0;
  if (st === 1) return _ps.apply(this, arguments);
  if (st === 2) return _ps(Object.assign({}, L, { style: 0 }), age, size, bare, fig);
  if (typeof AV3_CTX !== 'undefined' && AV3_CTX && size === 122 && fig) return _ps.apply(this, arguments);   // the room asks for its stack of frames
  try { return fig ? csFullSVG(L, age, size, { bare: !!bare }) : csPortraitSVG(L, age, size, bare); } catch (e) { return _ps.apply(this, arguments); }
}; }
// the room's frames, in the new style
{ const _fr = av3Frames; av3Frames = function (args, draw) {
  const [L, age] = args; if (L && L.style) return _fr.apply(this, arguments);
  const key = 'cs|' + JSON.stringify(L) + '|' + age; if (AV3_CACHE.k === key) return AV3_CACHE.frames;
  const F = {}, f = (o) => csFullSVG(L, age, 122, Object.assign({ bare: true }, o));
  F.stand = f({ arms: 'stand' }); F.hold = f({ arms: 'hold' }); F.sit = f({ pose: 'sit', arms: 'lap' }); F.sithold = f({ pose: 'sit', arms: 'hold' });
  for (let i = 0; i < 8; i++) F['s' + i] = f({ view: 'side', ph: i / 8 });
  F.bstand = f({ view: 'back', arms: 'stand' }); F.bsit = f({ view: 'back', pose: 'sit', arms: 'reach' }); F.breach = f({ view: 'back', arms: 'reach' });
  AV3_CACHE.k = key; AV3_CACHE.frames = F; return F;
}; }
