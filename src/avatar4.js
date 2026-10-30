// ================= Side and back views (Round 29) =================
// The avatar was only ever drawn facing you, so walking was a front-on shuffle and "writing at the desk" meant sitting
// in front of it. Now there are two more views:
//  - in profile, for walking: the head in profile (brow, nose, lips, chin, ear, the hair from the side), one arm
//    swinging against the legs, the legs in a true stride with the knee bending as the foot passes, and the shoes
//    heel to toe. The far arm and leg are drawn darker, behind.
//  - from behind, for facing things: the desk, the window, the shelf, the record player, the piano. The body is the
//    same as from the front; the head is the back of the head and hair, long hair falls down the back, the shoes show
//    their heels, and the arms reach forward out of sight.
// Every view is drawn from the same look, so the clothes, colours, hair and build always agree.
function figSideSVG(L0, age, ph, opts = {}) {
  const L = Object.assign(defaultLook(), migrateLook(Object.assign({}, L0)));
  const skin = LOOK.skin.opts[L.skin], grey = clamp((age - 44) / 26, 0, .85), hc = mixHex(LOOK.hairColor.opts[L.hairColor], '#D9D6D0', grey), cloth = LOOK.colour.opts[L.colour];
  const top = L.outfit, bot = L.bottoms || 0, shoe = L.shoes || 0, b = L.build || 0, bc = FIG_COLOURS[L.bottomColour || 0];
  const m = [.9, .95, 1, 1.06, 1.12, 1.24, .86, .88, 1.14, 1][b] + (typeof lookD === 'function' ? lookD(L, 'bWeight') * .12 : 0), dH = typeof lookD === 'function' ? lookD(L, 'bHeight') * 10 : 0;
  const line = mixHex(skin, '#1A0E0A', .5), shade = mixHex(skin, '#2A140C', .22), dkc = mixHex(cloth, '#000', .32), dkb = mixHex(bc, '#000', .32), far = c => mixHex(c, '#000', .22);
  const short = [0, 10, 13, 16, 19].includes(top), dress = top === 10, tc = top === 19 ? '#F4F2EE' : cloth;
  const SH = [['#F4F2EE', cloth], ['#C8102E', '#F4F2EE'], ['#5A3A22', '#3B2516'], ['#3B2516', '#2A1A10'], ['#151515', '#8C2E2E'], ['#B98A55', skin], ['#7A4A28', '#4E2E18'], ['#151515', '#333'], ['#B98A55', '#8C5A2E'], ['#F2C6D6', '#FFFFFF']][shoe];
  const o = [], cx = 60, sy = 58, wy = 98, hy = 116, thigh = 54 + dH * .5, shin = 43 + dH * .5, foot = 11, fy = 224 + dH;
  const rad = d => d * Math.PI / 180, P = (x, y) => `${n1(x)} ${n1(y)}`;
  // the stride: ph in 0..1 (null = standing); each leg's angle from vertical, knee bend when it swings through
  const leg = side => { if (ph === null || ph === undefined) return { a: side * 2, k: 3 }; const p = ph * Math.PI * 2 + (side > 0 ? 0 : Math.PI), sw = Math.sin(p), lift = Math.max(0, Math.cos(p)); return { a: 26 * sw, k: 4 + 46 * lift * lift, lift }; };
  const joints = g => { const H = [cx + 1, hy], K = [H[0] + Math.sin(rad(g.a)) * thigh, H[1] + Math.cos(rad(g.a)) * thigh], sa = g.a - g.k, A = [K[0] + Math.sin(rad(sa)) * shin, K[1] + Math.cos(rad(sa)) * shin]; return { H, K, A }; };
  const near = leg(1), farL = leg(-1), JN = joints(near), JF = joints(farL);
  const lowest = Math.max(JN.A[1], JF.A[1]), lift = fy - foot - lowest;   // drop the body so the planted foot meets the floor
  o.push(`<g transform="translate(0 ${n1(lift)})">`);
  const legPath = (J, w) => limbPath([[J.H[0], J.H[1] - 3], lerp2(J.H, J.K, .45), J.K, lerp2(J.K, J.A, .4), J.A], w);
  const LW = [11 * m, 7 * m, 4.6 * m, 4.6 * m, 3];
  const longLeg = [0, 1, 2, 6, 7, 8, 9].includes(bot) || top === 19;
  const drawLeg = (J, g, isFar) => {
    const sk = isFar ? far(skin) : skin, cl = isFar ? far(top === 19 ? cloth : bc) : (top === 19 ? cloth : bc);
    o.push(`<path d="${legPath(J, LW)}" fill="${sk}" stroke="${shade}" stroke-width=".4"/>`);
    if (longLeg) o.push(`<path d="${limbPath([[J.H[0], J.H[1] - 3], lerp2(J.H, J.K, .45), J.K, lerp2(J.K, J.A, .4), [J.A[0], J.A[1] + 2]], LW.map((w, i) => w + (i < 2 ? 1.6 : 1.2) + (bot === 8 && i > 2 ? 1.5 : 0)), true)}" fill="${cl}" stroke="${isFar ? far(dkb) : dkb}" stroke-width=".45"/>`);
    else if (bot === 3 && top !== 19) o.push(`<path d="${limbPath([[J.H[0], J.H[1] - 3], lerp2(J.H, J.K, .35), lerp2(J.H, J.K, .55)], [LW[0] + 1.6, LW[1] + 2.4, LW[1] + 2.4], true)}" fill="${cl}" stroke="${dkb}" stroke-width=".45"/>`);
    // the shoe: flat on the floor when planted, toe down a little when it lifts
    const tilt = g.lift ? -g.lift * 18 + (g.a > 10 ? 8 : 0) : 0;
    o.push(`<g transform="translate(${P(J.A[0], J.A[1] + foot)}) rotate(${n1(tilt)} 0 -6)${isFar ? '' : ''}">${isFar ? `<g opacity=".86">${shoeProfile(shoe, SH, far(skin), m * .95)}</g>` : shoeProfile(shoe, SH, skin, m * .95)}</g>`);
  };
  // the far arm, behind everything
  const arm = side => { const sw = ph === null || ph === undefined ? 0 : -Math.sin(ph * Math.PI * 2 + (side > 0 ? 0 : Math.PI)); const S0 = [cx - 1, sy + 6], ua = 4 + sw * 24, fa = ua + 10 + Math.max(0, sw) * 16, E = [S0[0] + Math.sin(rad(ua)) * 33, S0[1] + Math.cos(rad(ua)) * 33], W = [E[0] + Math.sin(rad(fa)) * 28, E[1] + Math.cos(rad(fa)) * 28]; return { S: S0, E, W, fa }; };
  const drawArm = (A, isFar) => {
    const sk = isFar ? far(skin) : skin, sl = isFar ? far(tc) : tc;
    o.push(`<path d="${limbPath([A.S, lerp2(A.S, A.E, .5), A.E, lerp2(A.E, A.W, .5), A.W], [5.2 * m, 4.6 * m, 3.6 * m, 3.3 * m, 2.6 * m])}" fill="${short ? sk : sl}" stroke="${short ? shade : dkc}" stroke-width=".4"/>`);
    if (short) o.push(`<path d="${limbPath([A.S, lerp2(A.S, A.E, .25), lerp2(A.S, A.E, .45)], [6 * m, 5.6 * m, 5.2 * m], true)}" fill="${sl}" stroke="${dkc}" stroke-width=".4"/>`);
    const u = [Math.sin(rad(A.fa)), Math.cos(rad(A.fa))], H0 = A.W;
    o.push(`<path d="M${P(H0[0] - u[1] * 2.6, H0[1] + u[0] * 2.6)} C${P(H0[0] + u[0] * 6, H0[1] + u[1] * 6)} ${P(H0[0] + u[0] * 9 - u[1] * 1, H0[1] + u[1] * 9)} ${P(H0[0] + u[0] * 9.5 + u[1] * 2.4, H0[1] + u[1] * 9.5 - u[0] * 2.4)} C${P(H0[0] + u[0] * 6 + u[1] * 3.2, H0[1] + u[1] * 6 - u[0] * 3)} ${P(H0[0] + u[1] * 2.8, H0[1] - u[0] * 2.8)} ${P(H0[0] + u[1] * 2.6, H0[1] - u[0] * 2.6)} Z" fill="${sk}" stroke="${shade}" stroke-width=".35"/>`);
  };
  const AF = arm(-1), AN = arm(1);
  // long hair behind the shoulders
  const longHair = [8, 9, 14, 23, 19].includes(L.hair), bob = L.hair === 7;
  drawArm(AF, true); drawLeg(JF, farL, true);
  // the torso in profile: chest forward, shoulder blades and seat behind
  const ch = 11 * m, bk = 9.5 * m, wf = 8 * m, wbk = 8.5 * m, hf = 9 * m, hbk = 11 * m;
  const hem = dress ? 170 : top === 18 ? 162 : hy + 4;
  const torso = `M${P(cx - 4, sy - 2)} C${P(cx + 4, sy - 3)} ${P(cx + ch, sy + 6)} ${P(cx + ch, sy + 16)} C${P(cx + ch + .5, sy + 26)} ${P(cx + wf + 1, wy - 12)} ${P(cx + wf, wy)} C${P(cx + wf + .5, hy - 8)} ${P(cx + hf + (dress ? 4 : 0), hem - 6)} ${P(cx + hf + (dress ? 8 : 0), hem)} L${P(cx - hbk - (dress ? 8 : 0), hem)} C${P(cx - hbk - (dress ? 4 : 1), hem - 8)} ${P(cx - wbk - 1, wy + 6)} ${P(cx - wbk, wy)} C${P(cx - wbk + 1, wy - 14)} ${P(cx - bk - 1, sy + 20)} ${P(cx - bk, sy + 10)} C${P(cx - bk, sy + 2)} ${P(cx - 9, sy - 1)} ${P(cx - 4, sy - 2)} Z`;
  // trousers' seat and the waist, under the top
  if (!dress && top !== 18) o.push(`<path d="M${P(cx - wbk - .5, wy)} L${P(cx + wf + .5, wy)} C${P(cx + hf + 1, hy - 6)} ${P(cx + hf + 1, hy + 4)} ${P(cx + 6, hy + 10)} L${P(cx - 6, hy + 10)} C${P(cx - hbk - 2, hy + 6)} ${P(cx - hbk - 1, hy - 6)} ${P(cx - wbk - .5, wy)} Z" fill="${top === 19 ? cloth : (bot === 4 || bot === 5 ? bc : bc)}" stroke="${dkb}" stroke-width=".45"/>`);
  if ((bot === 4 || bot === 5) && !dress && top !== 19) { const sk = bot === 4 ? hy + 24 : 196; o.push(`<path d="M${P(cx - wbk - .5, wy)} L${P(cx + wf + .5, wy)} L${P(cx + hf + (bot === 4 ? 5 : 9), sk)} L${P(cx - hbk - (bot === 4 ? 5 : 9), sk)} Z" fill="${bc}" stroke="${dkb}" stroke-width=".45"/>`); }
  drawLeg(JN, near, false);
  if (longHair) o.push(`<path d="M${P(cx - 6, 26)} C${P(cx - 16, 34)} ${P(cx - 15, 60)} ${P(cx - 12, L.hair === 9 || L.hair === 14 ? 92 : 80)} L${P(cx - 4, L.hair === 9 || L.hair === 14 ? 92 : 80)} C${P(cx - 6, 60)} ${P(cx - 2, 42)} ${P(cx - 2, 30)} Z" fill="${hc}" stroke="${mixHex(hc, '#000', .3)}" stroke-width=".4"/>`);
  o.push(`<path d="${torso}" fill="${tc}" stroke="${dkc}" stroke-width=".5"/>`);
  if (top === 19) o.push(`<path d="M${P(cx - 2, sy + 18)} L${P(cx + ch - 1, sy + 16)} L${P(cx + wf + .5, wy)} L${P(cx - wbk + 2, wy)} Z" fill="${cloth}"/>`);
  o.push(`<path d="M${P(cx + 2, sy + 22)} q${n1(ch - 4)} 3 ${n1(ch - 3)} 9 M${P(cx - bk + 2, wy - 6)} q4 2 9 1" stroke="${dkc}" stroke-width=".45" fill="none" opacity=".45"/>`);
  // neck and head in profile
  o.push(`<path d="M${P(cx - 3.4, 44)} L${P(cx + 3.6, 44)} L${P(cx + 4.4, sy + 1)} L${P(cx - 4.6, sy + 1)} Z" fill="${skin}" stroke="${shade}" stroke-width=".4"/>`);
  const hx = cx + 1, hyc = 31;
  const face = `M${P(hx - 9, hyc - 10)} C${P(hx - 2, hyc - 16)} ${P(hx + 8, hyc - 14)} ${P(hx + 9.6, hyc - 6)} L${P(hx + 10, hyc - 1.4)} L${P(hx + 13.2, hyc + 3.4)} Q${P(hx + 13.4, hyc + 4.6)} ${P(hx + 11, hyc + 5)} L${P(hx + 11.2, hyc + 7.4)} Q${P(hx + 12, hyc + 8.6)} ${P(hx + 10.8, hyc + 9.6)} Q${P(hx + 11.2, hyc + 11)} ${P(hx + 10.2, hyc + 12.2)} C${P(hx + 9.8, hyc + 15.4)} ${P(hx + 6, hyc + 16.4)} ${P(hx + 2.6, hyc + 15)} L${P(hx - 2, hyc + 13.6)} C${P(hx - 9, hyc + 12)} ${P(hx - 12, hyc + 4)} ${P(hx - 11.6, hyc - 3)} C${P(hx - 11.4, hyc - 7)} ${P(hx - 10.4, hyc - 9)} ${P(hx - 9, hyc - 10)} Z`;
  o.push(`<path d="${face}" fill="${skin}" stroke="${line}" stroke-width=".5"/>`);
  // ear, eye, brow, mouth
  o.push(`<ellipse cx="${n1(hx - 2.6)}" cy="${n1(hyc + 2)}" rx="2.4" ry="3.4" fill="${mixHex(skin, '#2A140C', .12)}" stroke="${line}" stroke-width=".4"/><path d="M${P(hx + 6.2, hyc - 1)} q1.8 -1.2 3.2 .2" stroke="${mixHex(skin, '#140A08', .7)}" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M${P(hx + 6.6, hyc + 1.2)} q1.2 -.9 2.4 .1 q-1.1 .9 -2.4 -.1 Z" fill="#2B1D16"/><path d="M${P(hx + 6, hyc - 3.4)} q2.4 -1.6 4.4 -.4" stroke="${mixHex(hc, '#000', .2)}" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M${P(hx + 9.6, hyc + 8.4)} l1.4 .1" stroke="${mixHex(skin, '#5A1E1E', .45)}" stroke-width=".8" stroke-linecap="round"/>`);
  if (L.facial && L.facial > 0 && L.facial < 6) o.push(`<path d="M${P(hx + 1, hyc + 6)} C${P(hx + 6, hyc + 8)} ${P(hx + 10, hyc + 10)} ${P(hx + 10.4, hyc + 12)} C${P(hx + 9.8, hyc + 15.4)} ${P(hx + 6, hyc + 16.4)} ${P(hx + 2.6, hyc + 15)} L${P(hx - 2, hyc + 13.6)} Z" fill="${hc}" opacity=".7"/>`);
  // hair from the side, by style
  const H = L.hair, hs = mixHex(hc, '#000', .3);
  const cap = (fr, bkY) => `M${P(hx - 12, hyc + 2)} C${P(hx - 13, hyc - 12)} ${P(hx - 2, hyc - 17.5)} ${P(hx + 6, hyc - 15)} C${P(hx + 10, hyc - 13)} ${P(hx + 11, hyc - 8)} ${P(hx + fr, hyc - 5.5)} C${P(hx + 4, hyc - 9)} ${P(hx - 2, hyc - 8)} ${P(hx - 5, hyc - 3)} L${P(hx - 6, bkY)} C${P(hx - 10, bkY)} ${P(hx - 12, hyc + 6)} ${P(hx - 12, hyc + 2)} Z`;
  if (H === 0) o.push(`<path d="${cap(9, hyc + 4)}" fill="${hc}" opacity=".25"/>`);
  else if (H === 6 || H === 19 || H === 5) { const r = H === 6 ? 16 : H === 19 ? 14 : 12.5; o.push(`<path d="${bumpy ? bumpy(hx - 2, hyc - 4, r, r * .95, 12, 1.4) : ''}" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`); }
  else {
    o.push(`<path d="${cap(H === 4 || H === 12 ? 11 : 9.4, H === 1 ? hyc + 4 : hyc + 9)}" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
    if (H === 4) o.push(`<path d="M${P(hx - 4, hyc - 15)} C${P(hx + 6, hyc - 22)} ${P(hx + 14, hyc - 16)} ${P(hx + 11, hyc - 9)} C${P(hx + 6, hyc - 12)} ${P(hx, hyc - 13)} ${P(hx - 4, hyc - 15)} Z" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
    if (H === 12) o.push(`<path d="M${P(hx - 9, hyc - 10)} L${P(hx - 6, hyc - 22)} L${P(hx - 2, hyc - 15)} L${P(hx + 1, hyc - 24)} L${P(hx + 4, hyc - 15)} L${P(hx + 7, hyc - 21)} L${P(hx + 8, hyc - 12)} Z" fill="${hc}"/>`);
    if (H === 10 || H === 18) o.push(`<path d="M${P(hx - 11, hyc - 6)} C${P(hx - 20, hyc - 4)} ${P(hx - 20, hyc + 14)} ${P(hx - 15, hyc + (H === 18 ? 16 : 24))} C${P(hx - 13, hyc + 12)} ${P(hx - 12, hyc + 2)} ${P(hx - 9, hyc - 2)} Z" fill="${hc}" stroke="${hs}" stroke-width=".4"/><circle cx="${n1(hx - 11.4)}" cy="${n1(hyc - 4.6)}" r="1.4" fill="${cloth}"/>`);
    if (H === 11 || H === 16 || H === 22) o.push(`<circle cx="${n1(hx - 7)}" cy="${n1(hyc - (H === 22 ? 20 : 16))}" r="${H === 22 ? 9 : 5.5}" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
    if (bob || longHair || H === 15) o.push(`<path d="M${P(hx - 12, hyc - 2)} C${P(hx - 14, hyc + 10)} ${P(hx - 12, hyc + (bob ? 16 : 22))} ${P(hx - 7, hyc + (bob ? 17 : 24))} L${P(hx - 4, hyc + 6)} Z" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
    if (bob || longHair) o.push(`<path d="M${P(hx - 4, hyc - 12)} C${P(hx + 4, hyc - 14)} ${P(hx + 10, hyc - 10)} ${P(hx + 10, hyc - 5)} C${P(hx + 6, hyc - 8)} ${P(hx + 2, hyc - 9)} ${P(hx - 3, hyc - 8)} Z" fill="${hc}"/>`);
  }
  // the near arm, in front of the body
  drawArm(AN, false);
  o.push('</g>');
  return `<svg class="portrait figure side" viewBox="0 0 120 240" width="61" height="122" role="img" aria-label="Walking">${o.join('')}</svg>`;
}
// ---- the back view: the front body, with the back of the head and long hair over it ----
function figBackOverlay(L0, age) {
  const L = Object.assign(defaultLook(), migrateLook(Object.assign({}, L0))), skin = LOOK.skin.opts[L.skin], grey = clamp((age - 44) / 26, 0, .85), hc = mixHex(LOOK.hairColor.opts[L.hairColor], '#D9D6D0', grey), hs = mixHex(hc, '#000', .3), H = L.hair, line = mixHex(skin, '#1A0E0A', .5);
  const cx = 60, cy = 33.4, rx = 11.4, ry = 15, o = [];
  // the head from behind, with ears and the nape
  o.push(`<ellipse cx="${n1(cx - rx)}" cy="${n1(cy + 1)}" rx="2.2" ry="3.4" fill="${skin}" stroke="${line}" stroke-width=".4"/><ellipse cx="${n1(cx + rx)}" cy="${n1(cy + 1)}" rx="2.2" ry="3.4" fill="${skin}" stroke="${line}" stroke-width=".4"/>`);
  o.push(`<path d="M${n1(cx - rx)} ${n1(cy)} C${n1(cx - rx)} ${n1(cy - ry - 1)} ${n1(cx + rx)} ${n1(cy - ry - 1)} ${n1(cx + rx)} ${n1(cy)} C${n1(cx + rx)} ${n1(cy + 10)} ${n1(cx + 6)} ${n1(cy + ry)} ${cx} ${n1(cy + ry)} C${n1(cx - 6)} ${n1(cy + ry)} ${n1(cx - rx)} ${n1(cy + 10)} ${n1(cx - rx)} ${n1(cy)} Z" fill="${skin}" stroke="${line}" stroke-width=".45"/>`);
  if (H === 0) return o.join('') + `<path d="M${n1(cx - rx + .5)} ${n1(cy + 4)} C${n1(cx - rx)} ${n1(cy - ry)} ${n1(cx + rx)} ${n1(cy - ry)} ${n1(cx + rx - .5)} ${n1(cy + 4)}" fill="${hc}" opacity=".22"/>`;
  const big = H === 6 ? 17 : H === 19 ? 15 : H === 5 ? 13.5 : 0;
  if (big) return o.join('') + `<path d="${bumpy(cx, cy - 3, big, big * .96, 14, 1.5)}" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`;
  const nape = H === 1 ? cy + 6 : [2, 3, 4, 13, 17, 20, 21, 12].includes(H) ? cy + 9 : cy + 11;
  o.push(`<path d="M${n1(cx - rx - .6)} ${n1(cy + 4)} C${n1(cx - rx - 1)} ${n1(cy - ry - 2)} ${n1(cx + rx + 1)} ${n1(cy - ry - 2)} ${n1(cx + rx + .6)} ${n1(cy + 4)} C${n1(cx + rx)} ${n1(nape - 2)} ${n1(cx + 5)} ${n1(nape)} ${cx} ${n1(nape)} C${n1(cx - 5)} ${n1(nape)} ${n1(cx - rx)} ${n1(nape - 2)} ${n1(cx - rx - .6)} ${n1(cy + 4)} Z" fill="${hc}" stroke="${hs}" stroke-width=".45"/><path d="M${cx} ${n1(cy - ry)} Q${n1(cx + 1)} ${n1(cy - 4)} ${cx} ${n1(nape - 1)}" stroke="${hs}" stroke-width=".5" fill="none" opacity=".45"/>`);
  if (H === 12) o.push(`<path d="M${n1(cx - 3)} ${n1(cy - ry - 1)} L${cx} ${n1(cy - ry - 9)} L${n1(cx + 3)} ${n1(cy - ry - 1)} Z" fill="${hc}"/>`);
  if (H === 10) o.push(`<path d="M${n1(cx - 3)} ${n1(cy + 4)} C${n1(cx - 5)} ${n1(cy + 18)} ${n1(cx - 2)} ${n1(cy + 30)} ${cx} ${n1(cy + 36)} C${n1(cx + 2)} ${n1(cy + 30)} ${n1(cx + 5)} ${n1(cy + 18)} ${n1(cx + 3)} ${n1(cy + 4)} Z" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
  if (H === 11 || H === 22) o.push(`<circle cx="${cx}" cy="${n1(cy - ry + (H === 22 ? -4 : 2))}" r="${H === 22 ? 10 : 6}" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
  if (H === 16 || H === 18) for (const s of [-1, 1]) o.push(H === 16 ? `<circle cx="${n1(cx + s * 9)}" cy="${n1(cy - ry + 2)}" r="5" fill="${hc}" stroke="${hs}" stroke-width=".4"/>` : `<path d="M${n1(cx + s * 9)} ${n1(cy + 2)} q${s * 6} 12 ${s * 2} 24 l${-s * 3} 0 q${s * 2} -12 ${-s * 3} -22 Z" fill="${hc}" stroke="${hs}" stroke-width=".4"/>`);
  if ([7, 8, 9, 14, 15, 23].includes(H)) { const ln = H === 7 ? cy + 22 : H === 15 ? cy + 28 : H === 9 || H === 14 ? cy + 62 : cy + 50, w = H === 7 ? rx + 2 : rx + 3;
    o.push(`<path d="M${n1(cx - w)} ${n1(cy)} C${n1(cx - w - 1)} ${n1(cy + 16)} ${n1(cx - w + 1)} ${n1(ln - 6)} ${n1(cx - w + 3)} ${n1(ln)} Q${cx} ${n1(ln + 3)} ${n1(cx + w - 3)} ${n1(ln)} C${n1(cx + w - 1)} ${n1(ln - 6)} ${n1(cx + w + 1)} ${n1(cy + 16)} ${n1(cx + w)} ${n1(cy)} Z" fill="${hc}" stroke="${hs}" stroke-width=".45"/>${H === 9 || H === 14 ? Array.from({ length: 6 }, (_, i) => `<path d="M${n1(cx - w + 3 + i * (w * 2 - 6) / 5)} ${n1(cy + 6)} L${n1(cx - w + 3 + i * (w * 2 - 6) / 5)} ${n1(ln - 1)}" stroke="${hs}" stroke-width=".5" opacity=".5"/>`).join('') : ''}`); }
  return o.join('');
}
// ---- wiring into the room's frame stack ----
{ const _fr = av3Frames; av3Frames = function (args, draw) {
  const F = _fr(args, draw); if (F.s0) return F;
  const [L, age] = args, P = av3Poses(), was = FIG_POSE;
  for (let f = 0; f < 8; f++) F['s' + f] = figSideSVG(L, age, f / 8);
  try {
    const back = (pose, extra) => { FIG_POSE = Object.assign({}, pose || {}, { back: 1 }, extra || {}); const s = draw(); return s.replace(/<\/svg>$/, `${figBackOverlay(L, age)}</svg>`); };
    const reach = { arms(A, hands, F2) { for (const s of [-1, 1]) { A[s] = [F2.Sj(s), [F2.cx + s * (F2.ww + 3.4), F2.wy - 8], [F2.cx + s * (F2.ww - 2), F2.wy - 14]]; hands[s] = 'none'; } }, front: 0 };
    F.bstand = back(null); F.bsit = back({ legs: P.sit.legs }, reach); F.breach = back(null, reach);
  } finally { FIG_POSE = was; }
  return F;
}; }
// walking uses the side view; facing furniture uses the back view
{ const _sh = av3Show; av3Show = function (g, frame) {
  const t = AV3.tg || {}; if (t.back && AV3.mode !== 'walk' && !/^s\d$/.test(frame)) frame = AV3.mode === 'sit' ? 'bsit' : t.reach ? 'breach' : 'bstand';
  return _sh.call(this, g, frame); }; }
{ const _tg = av3Targets; av3Targets = function () {
  const T = _tg.apply(this, arguments), acts = arguments[0];
  return T.map((t, i) => { const k = acts[i] && acts[i][1];
    if (k === 'write' && t.stool) return Object.assign(t, { y: 166, back: 1 });
    if (k === 'dream') return Object.assign(t, { back: 1 });
    if (k === 'script') return Object.assign(t, { back: 1, reach: 1, pose: 'stand', y: 168 });
    if (k === 'music' && t.stool) return Object.assign(t, { back: 1, y: 166 });
    if (k === 'music' || k === 'game' || k === 'coffee') return Object.assign(t, { back: 1, reach: 1, pose: 'stand', y: 168 });
    return t; }); }; }
// props held in the hands make no sense from behind; floating notes and thought bubbles still show
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.home-scene .me-walk.av3-back .act-prop[data-k="write"],.home-scene .me-walk.av3-back .act-prop[data-k="script"],.home-scene .me-walk.av3-back .act-prop[data-k="coffee"],.home-scene .me-walk.av3-back .act-prop[data-k="game"],.home-scene .me-walk.av3-back .act-prop[data-k="music"] path,.home-scene .me-walk.av3-back .act-prop[data-k="music"] rect{display:none}`; document.head.appendChild(st); })();
{ const _ap = av3Apply; av3Apply = function (g) { const r = _ap.apply(this, arguments); if (g) g.classList.toggle('av3-back', !!(AV3.tg && AV3.tg.back && AV3.mode !== 'walk')); return r; }; }
