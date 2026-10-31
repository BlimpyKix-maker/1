// ================= Headshot: the character, up close (Round 31) =================
// The avatar is a still portrait now: head and shoulders, drawn large and with care, so the face and everything worn on
// it reads clearly. Soft flat colour with gentle gradient light from the upper left. Fine line work only where a
// feature needs it: lids and lashes, brows, the nostrils, the line between the lips.
// Every creator option has its own drawing:
//   - Face: shape, eyes with iris and catch-light, brows, nose and lips, all following the sliders. Age, mood, marks and freckles show.
//   - All 24 haircuts, each built from its own shapes (a back mass, the cap with its hairline, side pieces, extras such as buns and tails), with sheen and strands.
//   - Nine kinds of facial hair, 13 pairs of glasses, 23 hats, four earrings and seven things at the neck.
//   - All 20 tops, each with its own collar and details, in any of the 10 patterns.
// Coordinates are 200 × 200 with the eyes on y = 86.
let HS_UID = 0;
const hsF = v => Math.round(v * 10) / 10;
const hsSh = c => mixHex(c, '#231B3A', .32), hsDk = c => mixHex(c, '#120C1C', .55), hsHi = c => mixHex(c, '#FFF6E6', .28);
// how each haircut is put together: fringe (the hairline over the forehead), sides, back mass, texture, extras
const HS_HAIR = [
  { fr: 'none', top: 'none' },                                   // shaved
  { fr: 'buzz', top: 'buzz' },                                   // buzz cut
  { fr: 'side', sides: 'short', v: 3 },                          // short
  { fr: 'part', sides: 'short', v: 3 },                          // side part
  { fr: 'quiff', sides: 'short', v: 9, quiff: 1 },               // quiff
  { fr: 'curls', sides: 'none', v: 6, curly: 1, back: 'curlyS' },// curly
  { fr: 'curls', top: 'afro', back: 'afro' },                    // afro
  { fr: 'bangs', sides: 'bob', back: 'bob', v: 3 },              // bob
  { fr: 'part', sides: 'long', back: 'long', v: 3 },             // long
  { fr: 'part', sides: 'locs', back: 'locs', v: 4 },             // locs
  { fr: 'back', sides: 'none', v: 2, x: 'tail' },                // ponytail
  { fr: 'back', sides: 'none', v: 2, x: 'bun' },                 // top bun
  { fr: 'none', top: 'mohawk' },                                 // mohawk
  { fr: 'pixie', sides: 'short', v: 3 },                         // pixie
  { fr: 'part', sides: 'braids', back: 'braids', v: 3 },         // braids
  { fr: 'side', sides: 'short', back: 'mullet', v: 4 },          // mullet
  { fr: 'part', sides: 'none', v: 2, x: 'buns' },                // space buns
  { fr: 'slick', sides: 'none', v: 2 },                          // slicked back
  { fr: 'bangs', sides: 'none', v: 2, x: 'pigtails' },           // pigtails
  { fr: 'curls', sides: 'curls', back: 'bigcurls', v: 8, curly: 1 }, // big curls
  { fr: 'swoop', sides: 'short', v: 4, shave: 1 },               // side shave
  { fr: 'curtain', sides: 'shag', back: 'shag', v: 5, shag: 1 }, // wolf cut
  { fr: 'back', sides: 'none', v: 30, hive: 1 },                 // beehive
  { fr: 'part', sides: 'waves', back: 'waves', v: 4 }            // long waves
];
// colours for the things that have their own
const HS_HAT = [null, '#2F4A6D', '#D9A43A', '#B2342C', '#8A6A48', '#2A2A30', '#7A1F2B', '#E0567A', '#3C3A38', '#4A5A3A', null, '#C8B28A', '#7A4E2C', '#2E7D5B', '#E2B33C', '#2A3F8F', null, '#F4F1EC', '#1F1F24', '#F1C94B', '#C0262D', '#5BA3E0', '#FAFAF7', '#141416'];
const HS_TIE = ['#8B1E2D', '#1F3A66', '#2E5E3A', '#5B2A6E', '#B8862B'];
function hsBuild(L0, age) {
  const K = csLook(L0, age), { L, C, G, d } = K, hx = 100, hy = 86;
  const rx = G.rx * 3.12, ry = G.ry * 3.25, jaw = G.jaw;
  Object.assign(K, { hx, hy, rx, ry, jw: rx * (.5 + jaw * .5), cw: rx * (.1 + jaw * .2), ch: hy + ry + G.chin * 3, nw: 10.5 + (G.sw - 18) * .35 });
  K.ex = rx * .41 * (1 + d('fEyeW') * .07); K.es = 1 + d('fEyeS') * .12;
  K.my = hy + ry * .63; K.mw = 10.4 * (1 + d('fMouth') * .12) * (rx / 33); K.lt = 1 + d('fLip') * .25;
  K.nt = hy + ry * .4 * (1 + d('fNoseL') * .12); K.nsw = 6 * (1 + d('fNoseW') * .15);
  K.H = HS_HAIR[L.hair] || HS_HAIR[2];
  const hatCovers = L.head && ![5, 7, 10, 13, 14, 16, 17, 18, 19, 20].includes(L.head);
  K.vol = hatCovers ? Math.min(K.H.v || 0, 3) : (K.H.v || 0);
  K.T = hy - ry * 1.08 - 6 - K.vol;          // the top of the hair
  K.fy = hy - ry * .56 - (L.hairline === 1 ? clamp((age - 28) / 24, 0, 1) * 9 : 0);   // the hairline
  K.lip = mixHex(C.skin, '#B4504A', .42); K.lipD = mixHex(K.lip, '#3A1210', .38);
  K.brow = mixHex(C.hair, '#1A1210', .35); K.hairH = hsHi(C.hair); K.hairS = hsSh(C.hair); K.hairD = hsDk(C.hair);
  return K;
}
// ---------------- hair ----------------
function hsBumps(cx, cy, ax, ay, n, r, a0 = 0, a1 = Math.PI * 2) {
  let s = `<ellipse cx="${hsF(cx)}" cy="${hsF(cy)}" rx="${hsF(ax)}" ry="${hsF(ay)}"/>`;
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, rr = r * (.85 + ((i * 37) % 7) / 20); s += `<circle cx="${hsF(cx + Math.cos(a) * ax)}" cy="${hsF(cy + Math.sin(a) * ay)}" r="${hsF(rr)}"/>`; }
  return s;
}
function hsFringe(K, kind) {
  const { hx, rx, hy, ry } = K, fy = K.fy, R = hx + rx - .5, Lx = hx - rx + .5, sy = hy - 5;
  switch (kind) {
    case 'side': return `L${hsF(R)} ${hsF(sy)}Q${hsF(R - 1)} ${hsF(fy + 3)} ${hsF(hx + rx * .45)} ${hsF(fy - 1)}Q${hsF(hx - rx * .1)} ${hsF(fy - 3)} ${hsF(hx - rx * .55)} ${hsF(fy + 7)}Q${hsF(hx - rx * .86)} ${hsF(fy + 12)} ${hsF(Lx)} ${hsF(sy)}`;
    case 'part': { const px = hx - rx * .32; return `L${hsF(R)} ${hsF(sy)}Q${hsF(R)} ${hsF(fy)} ${hsF(hx + rx * .3)} ${hsF(fy - 2)}Q${hsF(px + 5)} ${hsF(fy - 3)} ${hsF(px)} ${hsF(fy - 7)}Q${hsF(px - 5)} ${hsF(fy - 1)} ${hsF(hx - rx * .72)} ${hsF(fy + 2)}Q${hsF(Lx)} ${hsF(fy + 5)} ${hsF(Lx)} ${hsF(sy)}`; }
    case 'quiff': return `L${hsF(R)} ${hsF(sy)}Q${hsF(R)} ${hsF(fy - 2)} ${hsF(hx + rx * .4)} ${hsF(fy - 5)}Q${hsF(hx)} ${hsF(fy - 9)} ${hsF(hx - rx * .6)} ${hsF(fy - 4)}Q${hsF(Lx)} ${hsF(fy)} ${hsF(Lx)} ${hsF(sy)}`;
    case 'back': case 'slick': case 'buzz': return `L${hsF(R)} ${hsF(sy)}Q${hsF(R - 1)} ${hsF(fy - 4)} ${hsF(hx + rx * .5)} ${hsF(fy - 8)}Q${hsF(hx)} ${hsF(fy - 11)} ${hsF(hx - rx * .5)} ${hsF(fy - 8)}Q${hsF(Lx + 1)} ${hsF(fy - 4)} ${hsF(Lx)} ${hsF(sy)}`;
    case 'bangs': { const by = hy - ry * .3; let s = `L${hsF(R)} ${hsF(sy)}L${hsF(R - 1)} ${hsF(by)}`; const n = 6, w = (R - Lx - 2) / n; for (let i = 0; i < n; i++) { const x0 = R - 1 - i * w; s += `Q${hsF(x0 - w * .5)} ${hsF(by + 3.2)} ${hsF(x0 - w)} ${hsF(by - (i % 2 ? .6 : 1.4))}`; } return s + `L${hsF(Lx)} ${hsF(sy)}`; }
    case 'swoop': return `L${hsF(R)} ${hsF(sy)}Q${hsF(R - 3)} ${hsF(fy - 6)} ${hsF(hx + rx * .4)} ${hsF(fy - 6)}Q${hsF(hx - rx * .3)} ${hsF(fy)} ${hsF(hx - rx * .78)} ${hsF(hy - ry * .2)}Q${hsF(hx - rx * .92)} ${hsF(hy - ry * .26)} ${hsF(Lx)} ${hsF(sy)}`;
    case 'curtain': return `L${hsF(R)} ${hsF(sy)}Q${hsF(hx + rx * .62)} ${hsF(hy - ry * .22)} ${hsF(hx + rx * .2)} ${hsF(fy - 1)}Q${hsF(hx + 2)} ${hsF(fy - 6)} ${hsF(hx)} ${hsF(fy - 9)}Q${hsF(hx - 2)} ${hsF(fy - 6)} ${hsF(hx - rx * .2)} ${hsF(fy - 1)}Q${hsF(hx - rx * .62)} ${hsF(hy - ry * .22)} ${hsF(Lx)} ${hsF(sy)}`;
    case 'pixie': return `L${hsF(R)} ${hsF(sy)}L${hsF(hx + rx * .72)} ${hsF(fy + 3)}L${hsF(hx + rx * .46)} ${hsF(fy - 1)}L${hsF(hx + rx * .2)} ${hsF(fy + 6)}L${hsF(hx - rx * .05)} ${hsF(fy + 1)}L${hsF(hx - rx * .3)} ${hsF(fy + 9)}L${hsF(hx - rx * .55)} ${hsF(fy + 4)}L${hsF(hx - rx * .8)} ${hsF(fy + 11)}L${hsF(Lx)} ${hsF(sy)}`;
    default: return `L${hsF(R)} ${hsF(sy)}Q${hsF(R)} ${hsF(fy)} ${hsF(hx + rx * .4)} ${hsF(fy - 2)}Q${hsF(hx)} ${hsF(fy - 4)} ${hsF(hx - rx * .4)} ${hsF(fy - 2)}Q${hsF(Lx)} ${hsF(fy)} ${hsF(Lx)} ${hsF(sy)}`;
  }
}
function hsCap(K, fr) {
  const { hx, rx, hy } = K, T = K.T, Lh = hx - rx - 5.6, Rh = hx + rx + 5.6, sy = hy - 5;
  return `M${hsF(Lh)} ${hsF(sy)}C${hsF(Lh - 1)} ${hsF(T + 20 + K.vol * .3)} ${hsF(hx - rx * .72)} ${hsF(T)} ${hsF(hx)} ${hsF(T)}C${hsF(hx + rx * .72)} ${hsF(T)} ${hsF(Rh + 1)} ${hsF(T + 20 + K.vol * .3)} ${hsF(Rh)} ${hsF(sy)}` + hsFringe(K, fr) + 'Z';
}
// strands: thin lines across a cap, and a soft sheen
function hsStrands(K, n = 4) {
  const { hx, rx } = K, T = K.T, fy = K.fy; let s = '';
  for (let i = 0; i < n; i++) { const x = hx - rx * .6 + i * rx * 1.2 / (n - 1 || 1); s += `<path d="M${hsF(x)} ${hsF(fy - 2)}Q${hsF(x + (x - hx) * .1 + 3)} ${hsF((T + fy) / 2)} ${hsF(hx + (x - hx) * .4)} ${hsF(T + 4)}" stroke="${K.hairS}" stroke-width=".8" fill="none" opacity=".55"/>`; }
  return s;
}
function hsSheen(K, y0) { const { hx, rx } = K, T = y0 ?? K.T; return `<path d="M${hsF(hx - rx * .7)} ${hsF(T + 14)}Q${hsF(hx - rx * .4)} ${hsF(T + 3)} ${hsF(hx + rx * .05)} ${hsF(T + 3.4)}" stroke="${K.hairH}" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".5"/>`; }
// a strand of locs or braids, from (x, y0) to (x2, y1)
function hsStrand(K, x, y0, x2, y1, w, braid) {
  let s = `<path d="${csCap(x, y0, w, x2, y1, w * .8)}" fill="${K.H.sides === 'braids' ? K.C.hair : K.C.hair}"/>`;
  const n = Math.floor((y1 - y0) / (braid ? 4.2 : 7));
  for (let i = 1; i < n; i++) { const t = i / n, cx = x + (x2 - x) * t, cy = y0 + (y1 - y0) * t, ww = w * (1 - t * .2);
    s += braid ? `<path d="M${hsF(cx - ww)} ${hsF(cy - 1.4)}Q${hsF(cx)} ${hsF(cy + 1.6)} ${hsF(cx + ww)} ${hsF(cy - 1.4)}" stroke="${K.hairS}" stroke-width="1" fill="none"/>` : `<path d="M${hsF(cx - ww * .8)} ${hsF(cy)}Q${hsF(cx)} ${hsF(cy + 1.2)} ${hsF(cx + ww * .8)} ${hsF(cy)}" stroke="${K.hairS}" stroke-width=".8" fill="none" opacity=".7"/>`; }
  return s + `<path d="M${hsF(x - w * .3)} ${hsF(y0 + 2)}L${hsF(x2 - w * .3)} ${hsF(y1 - 2)}" stroke="${K.hairH}" stroke-width="1" opacity=".35"/>`;
}
function hsWavy(x0, y0, x1, y1, amp, n) { let s = ''; for (let i = 1; i <= n; i++) { const t = i / n, tm = (i - .5) / n; s += `Q${hsF(x0 + (x1 - x0) * tm + (i % 2 ? amp : -amp))} ${hsF(y0 + (y1 - y0) * tm)} ${hsF(x0 + (x1 - x0) * t)} ${hsF(y0 + (y1 - y0) * t)}`; } return s; }
function hsHairBack(o, K) {
  const { hx, rx, hy, ry, C, H } = K, Lh = hx - rx - 5.6, Rh = hx + rx + 5.6, c = C.hair, cs = K.hairS, by = hy + ry * .8;
  const back = H.back;
  if (back === 'afro') { o.push(`<g fill="${cs}">${hsBumps(hx, hy - 16, rx + 22, ry + 6, 26, 9)}</g><g fill="${c}">${hsBumps(hx - 2, hy - 19, rx + 17, ry + 1, 22, 8, Math.PI * .9, Math.PI * 2.1)}</g>`); return; }
  if (back === 'curlyS') { o.push(`<g fill="${cs}">${hsBumps(hx, hy - 10, rx + 8, ry * .78, 18, 6.5, Math.PI * .05, Math.PI * .95)}</g>`); return; }
  if (back === 'bigcurls') { o.push(`<g fill="${cs}">${hsBumps(hx, hy + 8, rx + 22, ry + 26, 30, 9)}</g><g fill="${c}">${hsBumps(hx, hy - 6, rx + 16, ry + 8, 22, 8, Math.PI, Math.PI * 2)}</g>`); return; }
  if (back === 'bob') { o.push(`<path d="M${hsF(Lh - 1)} ${hsF(hy - 12)}C${hsF(Lh - 7)} ${hsF(hy + 18)} ${hsF(Lh - 6)} ${hsF(by)} ${hsF(Lh - 1)} ${hsF(by + 4)}L${hsF(Rh + 1)} ${hsF(by + 4)}C${hsF(Rh + 6)} ${hsF(by)} ${hsF(Rh + 7)} ${hsF(hy + 18)} ${hsF(Rh + 1)} ${hsF(hy - 12)}Z" fill="${cs}"/>`); return; }
  if (back === 'long' || back === 'waves' || back === 'shag') {
    const bot = back === 'shag' ? 160 : 202, sp = back === 'shag' ? 6 : 13;
    const edgeL = back === 'waves' ? hsWavy(Lh - 8, hy + 10, Lh - sp, bot, 4, 6) : back === 'shag' ? `L${hsF(Lh - 8)} ${hsF(hy + 30)}L${hsF(Lh - 3)} ${hsF(hy + 38)}L${hsF(Lh - 9)} ${hsF(bot - 12)}L${hsF(Lh - 2)} ${hsF(bot - 6)}L${hsF(Lh - sp)} ${bot}` : `C${hsF(Lh - 12)} ${hsF(hy + 40)} ${hsF(Lh - 13)} 160 ${hsF(Lh - sp)} ${bot}`;
    o.push(`<path d="M${hsF(Lh)} ${hsF(hy - 16)}L${hsF(Lh - 8)} ${hsF(hy + 10)}${edgeL}L${hsF(Rh + sp)} ${bot}${back === 'waves' ? hsWavy(Rh + sp, bot, Rh + 8, hy + 10, 4, 6) : back === 'shag' ? `L${hsF(Rh + 2)} ${hsF(bot - 6)}L${hsF(Rh + 9)} ${hsF(bot - 12)}L${hsF(Rh + 3)} ${hsF(hy + 38)}L${hsF(Rh + 8)} ${hsF(hy + 30)}` : `C${hsF(Rh + 13)} 160 ${hsF(Rh + 12)} ${hsF(hy + 40)} ${hsF(Rh + 8)} ${hsF(hy + 10)}`}L${hsF(Rh)} ${hsF(hy - 16)}Z" fill="${cs}"/>`); return; }
  if (back === 'locs' || back === 'braids') { let s = ''; for (let i = 0; i < 9; i++) { const x = Lh - 6 + i * (Rh - Lh + 12) / 8; s += hsStrand(K, x, hy - 14, x + (x - hx) * .14, 196 - (i % 3) * 6, 3.8, back === 'braids'); } o.push(`<g opacity=".92">${s}</g>`); return; }
  if (back === 'mullet') o.push(`<path d="M${hsF(hx - rx + 3)} ${hsF(hy)}C${hsF(hx - rx - 2)} ${hsF(hy + ry * .9)} ${hsF(hx - rx - 7)} 150 ${hsF(hx - rx - 5)} 164L${hsF(hx - rx + 6)} 158L${hsF(hx + rx - 6)} 158L${hsF(hx + rx + 5)} 164C${hsF(hx + rx + 7)} 150 ${hsF(hx + rx + 2)} ${hsF(hy + ry * .9)} ${hsF(hx + rx - 3)} ${hsF(hy)}Z" fill="${cs}"/>`);
  if (H.x === 'tail') o.push(`<path d="M${hsF(Rh - 6)} ${hsF(hy - 6)}C${hsF(Rh + 14)} ${hsF(hy + 4)} ${hsF(Rh + 14)} 150 ${hsF(Rh + 4)} 178C${hsF(Rh + 10)} 150 ${hsF(Rh + 2)} ${hsF(hy + 18)} ${hsF(Rh - 8)} ${hsF(hy + 6)}Z" fill="${c}"/><path d="M${hsF(Rh + 2)} ${hsF(hy + 12)}Q${hsF(Rh + 10)} ${hsF(hy + 40)} ${hsF(Rh + 6)} 165" stroke="${cs}" stroke-width="1" fill="none"/>`);
  if (H.x === 'pigtails') for (const s of [-1, 1]) { const x = hx + s * (rx + 2); o.push(`<path d="M${hsF(x)} ${hsF(hy + 2)}C${hsF(x + s * 18)} ${hsF(hy + 8)} ${hsF(x + s * 20)} ${hsF(hy + 40)} ${hsF(x + s * 10)} ${hsF(hy + 58)}C${hsF(x + s * 10)} ${hsF(hy + 36)} ${hsF(x + s * 4)} ${hsF(hy + 20)} ${hsF(x - s * 2)} ${hsF(hy + 12)}Z" fill="${c}"/><path d="M${hsF(x + s * 9)} ${hsF(hy + 20)}Q${hsF(x + s * 15)} ${hsF(hy + 34)} ${hsF(x + s * 11)} ${hsF(hy + 48)}" stroke="${cs}" stroke-width="1" fill="none"/>`); }
}
function hsHairFront(o, K) {
  const { hx, rx, hy, ry, C, H, L } = K, c = C.hair, cs = K.hairS, Lh = hx - rx - 5.6, Rh = hx + rx + 5.6;
  if (H.top === 'none') return;
  if (H.top === 'mohawk') { const T = hy - ry * 1.08; o.push(`<path d="${hsCap(K, 'buzz')}" fill="${c}" opacity=".28"/><path d="M${hsF(hx - 7)} ${hsF(K.fy - 2)}L${hsF(hx - 9)} ${hsF(T - 6)}L${hsF(hx - 4)} ${hsF(T - 14)}L${hsF(hx - 2)} ${hsF(T - 6)}L${hsF(hx + 2)} ${hsF(T - 20)}L${hsF(hx + 4)} ${hsF(T - 6)}L${hsF(hx + 8)} ${hsF(T - 13)}L${hsF(hx + 8)} ${hsF(K.fy - 2)}Z" fill="${c}"/><path d="M${hsF(hx - 2)} ${hsF(K.fy - 3)}L${hsF(hx)} ${hsF(T - 10)}" stroke="${K.hairH}" stroke-width="1.6" opacity=".5"/>`); return; }
  if (H.top === 'buzz') { o.push(`<path d="${hsCap(K, 'buzz')}" fill="${c}" opacity=".62"/>`); let d = ''; for (let i = 0; i < 26; i++) { const a = Math.PI * (1.08 + .84 * ((i * 7) % 26) / 26), r = .55 + ((i * 13) % 5) / 12; d += `<circle cx="${hsF(hx + Math.cos(a) * rx * r)}" cy="${hsF(hy - 8 + Math.sin(a) * ry * r)}" r=".55"/>`; } o.push(`<g fill="${K.hairD}" opacity=".35">${d}</g>`); return; }
  if (H.top === 'afro') { let s = ''; for (let i = 0; i < 9; i++) { const x = hx - rx * .85 + i * rx * 1.7 / 8; s += `<circle cx="${hsF(x)}" cy="${hsF(K.fy - 4 + (i % 2) * 2)}" r="${hsF(5 + (i % 3))}"/>`; } o.push(`<g fill="${c}">${s}</g>`); return; }
  // extras that sit on top of the head, behind the cap
  if (H.x === 'bun') o.push(`<circle cx="${hx}" cy="${hsF(K.T - 7)}" r="13" fill="${c}"/><path d="M${hsF(hx - 8)} ${hsF(K.T - 9)}Q${hx} ${hsF(K.T - 19)} ${hsF(hx + 8)} ${hsF(K.T - 8)}M${hsF(hx - 6)} ${hsF(K.T - 3)}Q${hx} ${hsF(K.T - 12)} ${hsF(hx + 7)} ${hsF(K.T - 2)}" stroke="${cs}" stroke-width="1.1" fill="none"/>`);
  if (H.x === 'buns') for (const s of [-1, 1]) o.push(`<circle cx="${hsF(hx + s * rx * .66)}" cy="${hsF(K.T + 4)}" r="10.5" fill="${c}"/><path d="M${hsF(hx + s * rx * .66 - 6)} ${hsF(K.T + 2)}Q${hsF(hx + s * rx * .66)} ${hsF(K.T - 6)} ${hsF(hx + s * rx * .66 + 6)} ${hsF(K.T + 3)}" stroke="${cs}" stroke-width="1" fill="none"/>`);
  // the cap and its hairline
  const cap = hsCap(K, H.fr === 'curls' ? 'back' : H.fr);
  if (H.shave) { const id = 'hs' + (++HS_UID); o.push(`<clipPath id="${id}"><rect x="${hsF(hx - rx * .35)}" y="0" width="200" height="200"/></clipPath><path d="${hsCap(K, 'buzz')}" fill="${c}" opacity=".3"/><path d="${cap}" fill="${c}" clip-path="url(#${id})"/>`); }
  else o.push(`<path d="${cap}" fill="${c}"/>`);
  if (H.hive) o.push(`<path d="M${hsF(hx - rx - 2)} ${hsF(K.fy - 2)}Q${hsF(hx)} ${hsF(K.fy - 8)} ${hsF(hx + rx + 2)} ${hsF(K.fy - 2)}" stroke="${mixHex(C.cloth, '#FFFFFF', .2)}" stroke-width="3.2" fill="none"/>`);
  if (H.quiff) o.push(`<path d="M${hsF(hx - rx * .6)} ${hsF(K.fy - 4)}C${hsF(hx - rx * .7)} ${hsF(K.T - 4)} ${hsF(hx + rx * .5)} ${hsF(K.T - 6)} ${hsF(hx + rx * .3)} ${hsF(K.T + 8)}C${hsF(hx + rx * .1)} ${hsF(K.T + 2)} ${hsF(hx - rx * .2)} ${hsF(K.T + 4)} ${hsF(hx - rx * .3)} ${hsF(K.fy - 6)}Z" fill="${K.hairH}" opacity=".55"/>`);
  if (H.curly || H.fr === 'curls') { let s = ''; for (let i = 0; i < 10; i++) { const a = Math.PI * (1.05 + .9 * i / 9); s += `<circle cx="${hsF(hx + Math.cos(a) * (rx + 2))}" cy="${hsF(hy - 8 + Math.sin(a) * (ry * .95 + K.vol * .6))}" r="${hsF(6 + (i % 3))}"/>`; }
    for (let i = 0; i < 7; i++) s += `<circle cx="${hsF(hx - rx * .8 + i * rx * 1.6 / 6)}" cy="${hsF(K.fy + 1 + (i % 2) * 2.5)}" r="${hsF(4.6 + (i % 2))}"/>`;
    o.push(`<g fill="${c}">${s}</g><g fill="none" stroke="${cs}" stroke-width=".9" opacity=".6">${[0, 1, 2, 3, 4].map(i => `<path d="M${hsF(hx - rx * .7 + i * rx * .35)} ${hsF(K.fy + 2)}a3 3 0 1 1 3 3"/>`).join('')}</g>`); }
  else { o.push(hsStrands(K, H.fr === 'slick' ? 6 : 4)); if (H.fr === 'part') { const px = hx - rx * .32; o.push(`<path d="M${hsF(px)} ${hsF(K.fy - 7)}Q${hsF(px + 1)} ${hsF(K.T + 14)} ${hsF(px + 3)} ${hsF(K.T + 4)}" stroke="${K.hairD}" stroke-width="1" fill="none" opacity=".6"/>`); } }
  o.push(hsSheen(K));
  // side pieces in front of the ears and shoulders
  const sides = H.sides || 'none', by = hy + ry * .8;
  for (const s of [-1, 1]) { const X = s < 0 ? Lh : Rh, ix = hx + s * (rx - 1.5);
    if (sides === 'short') o.push(`<path d="M${hsF(X)} ${hsF(hy - 10)}L${hsF(X - s * .5)} ${hsF(hy + 3)}Q${hsF(X - s * 3)} ${hsF(hy + 4)} ${hsF(ix)} ${hsF(hy - 1)}L${hsF(ix)} ${hsF(hy - 10)}Z" fill="${c}"/>`);
    if (sides === 'bob') o.push(`<path d="M${hsF(X)} ${hsF(hy - 10)}C${hsF(X + s * 4)} ${hsF(hy + 16)} ${hsF(X + s * 4)} ${hsF(by)} ${hsF(X + s * 2)} ${hsF(by + 4)}Q${hsF(ix - s * 3)} ${hsF(by + 6)} ${hsF(ix - s * 5)} ${hsF(by - 2)}Q${hsF(ix - s * 1)} ${hsF(hy + ry * .3)} ${hsF(ix)} ${hsF(hy - 10)}Z" fill="${c}"/><path d="M${hsF(X + s * 1)} ${hsF(hy)}Q${hsF(X + s * 2.5)} ${hsF(hy + 20)} ${hsF(X + s * 1.5)} ${hsF(by)}" stroke="${K.hairH}" stroke-width="1.6" opacity=".4" fill="none"/>`);
    if (sides === 'long' || sides === 'waves') { const bot = 196, ox = X + s * 12; const outer = sides === 'waves' ? hsWavy(X, hy - 10, ox, bot, 3.4 * s, 6) : `C${hsF(X + s * 6)} ${hsF(hy + 30)} ${hsF(X + s * 4)} 150 ${hsF(ox)} ${bot}`;
      o.push(`<path d="M${hsF(X)} ${hsF(hy - 10)}${outer}L${hsF(ix + s * 2)} ${bot}C${hsF(ix + s * 1)} 160 ${hsF(ix - s * 2)} ${hsF(hy + ry * .4)} ${hsF(ix)} ${hsF(hy - 10)}Z" fill="${c}"/><path d="M${hsF(X + s * 2)} ${hsF(hy + 2)}${sides === 'waves' ? hsWavy(X + s * 2, hy + 2, ox - s * 3, bot - 6, 2.4 * s, 6) : `Q${hsF(X + s * 4)} 140 ${hsF(ox - s * 3)} ${bot - 6}`}" stroke="${K.hairH}" stroke-width="1.4" fill="none" opacity=".4"/>`); }
    if (sides === 'locs' || sides === 'braids') for (let j = 0; j < 2; j++) o.push(hsStrand(K, X + s * (j * 4.5 - 1), hy - 8, X + s * (j * 6 + 4), 182 - j * 8, 3.6, sides === 'braids'));
    if (sides === 'shag') o.push(`<path d="M${hsF(X)} ${hsF(hy - 10)}L${hsF(X + s * 3)} ${hsF(hy + 12)}L${hsF(X)} ${hsF(hy + 16)}L${hsF(X + s * 4)} ${hsF(by + 2)}L${hsF(ix - s * 2)} ${hsF(by - 4)}L${hsF(ix + s * 1)} ${hsF(hy + 14)}L${hsF(ix - s * 2)} ${hsF(hy + 8)}L${hsF(ix)} ${hsF(hy - 10)}Z" fill="${c}"/>`);
    if (sides === 'curls') { let g = ''; for (let j = 0; j < 7; j++) g += `<circle cx="${hsF(X + s * (2 + (j % 2) * 4))}" cy="${hsF(hy - 4 + j * 11)}" r="${hsF(6.5 - j * .3)}"/>`; o.push(`<g fill="${c}">${g}</g>`); }
  }
  if (H.x === 'pigtails') for (const s of [-1, 1]) o.push(`<rect x="${hsF(hx + s * (rx + 6) - 3)}" y="${hsF(hy + 6)}" width="6" height="4" rx="2" fill="${mixHex(C.cloth, '#FFFFFF', .25)}"/>`);
  if (H.x === 'tail') o.push(`<rect x="${hsF(Rh - 5)}" y="${hsF(hy - 3)}" width="5" height="6" rx="2" fill="${mixHex(C.cloth, '#FFFFFF', .25)}" transform="rotate(-20 ${hsF(Rh - 2)} ${hy})"/>`);
}
// ---------------- the face ----------------
function hsFacePath(K) {
  const { hx, hy, rx, ry, jw, cw, ch } = K, t = hy - ry * 1.08, Lx = hx - rx, R = hx + rx;
  return `M${hsF(Lx)} ${hsF(hy - 6)}C${hsF(Lx)} ${hsF(t + ry * .1)} ${hsF(hx - rx * .62)} ${hsF(t)} ${hx} ${hsF(t)}C${hsF(hx + rx * .62)} ${hsF(t)} ${hsF(R)} ${hsF(t + ry * .1)} ${hsF(R)} ${hsF(hy - 6)}C${hsF(R + .4)} ${hsF(hy + ry * .3)} ${hsF(hx + jw)} ${hsF(hy + ry * .72)} ${hsF(hx + cw)} ${hsF(ch - 2.4)}Q${hx} ${hsF(ch + 1.4)} ${hsF(hx - cw)} ${hsF(ch - 2.4)}C${hsF(hx - jw)} ${hsF(hy + ry * .72)} ${hsF(Lx - .4)} ${hsF(hy + ry * .3)} ${hsF(Lx)} ${hsF(hy - 6)}Z`;
}
function hsEars(o, K) {
  const { hx, hy, rx, C, d } = K, e = 1 + d('fEar') * .16;
  for (const s of [-1, 1]) { const X = hx + s * (rx - 2);
    o.push(`<path d="M${hsF(X)} ${hsF(hy - 7)}C${hsF(X + s * 9 * e)} ${hsF(hy - 11 * e)} ${hsF(X + s * 10 * e)} ${hsF(hy + 8)} ${hsF(X + s * 3)} ${hsF(hy + 15 * e)}Q${hsF(X)} ${hsF(hy + 16 * e)} ${hsF(X - s * 1)} ${hsF(hy + 11)}Z" fill="${s > 0 ? hsSh(C.skin) : C.skin}"/><path d="M${hsF(X + s * 1.5)} ${hsF(hy - 4)}C${hsF(X + s * 6.5 * e)} ${hsF(hy - 6 * e)} ${hsF(X + s * 7 * e)} ${hsF(hy + 6)} ${hsF(X + s * 3)} ${hsF(hy + 9)}" stroke="${hsSh(C.skin)}" stroke-width="1.3" fill="none" opacity=".8"/>`); }
}
function hsEarrings(o, K) {
  const { hx, hy, rx, L, d } = K, e = 1 + d('fEar') * .16, k = L.ears || 0; if (!k) return;
  for (const s of [-1, 1]) { const X = hx + s * (rx + 1.4), Y = hy + 14 * e;
    if (k === 1) o.push(`<circle cx="${hsF(X)}" cy="${hsF(Y)}" r="1.9" fill="#E3B341"/><circle cx="${hsF(X - .5)}" cy="${hsF(Y - .5)}" r=".6" fill="#FFF4C8"/>`);
    if (k === 2) o.push(`<circle cx="${hsF(X + s * 1)}" cy="${hsF(Y + 5.6)}" r="5.6" fill="none" stroke="#E3B341" stroke-width="1.6"/><path d="M${hsF(X + s * 1 - 4)} ${hsF(Y + 3)}a5.6 5.6 0 0 1 3 -2.6" stroke="#FFF4C8" stroke-width=".8" fill="none"/>`);
    if (k === 3 && s < 0) o.push(`<path d="M${hsF(X - 3)} ${hsF(hy - 8)}Q${hsF(X - 8)} ${hsF(hy - 2)} ${hsF(X - 6.5)} ${hsF(hy + 5)}" stroke="#C9CED6" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="${hsF(X - 7.4)}" cy="${hsF(hy - 1)}" r="1" fill="#F2F5FA"/>`);
    if (k === 3 && s > 0) o.push(`<circle cx="${hsF(X)}" cy="${hsF(Y)}" r="1.5" fill="#C9CED6"/>`);
    if (k === 4) o.push(`<path d="M${hsF(X)} ${hsF(Y - 2.6)}L${hsF(X + 2.2)} ${hsF(Y)}L${hsF(X)} ${hsF(Y + 2.6)}L${hsF(X - 2.2)} ${hsF(Y)}Z" fill="#DDF1FF"/><path d="M${hsF(X)} ${hsF(Y - 2.6)}L${hsF(X + 2.2)} ${hsF(Y)}L${hsF(X)} ${hsF(Y)}Z" fill="#9CC9EC"/><path d="M${hsF(X + 3)} ${hsF(Y - 4)}l.6 1.4l1.4 .6l-1.4 .6l-.6 1.4l-.6 -1.4l-1.4 -.6l1.4 -.6Z" fill="#FFFFFF"/>`); }
}
function hsEyes(o, K, uid) {
  const { hx, hy, ex, es, C, mood, age, L } = K, ew = 8.2 * es, eh = (mood === 'buzzing' ? 5.3 : 4.8) * es, ink = C.ink;
  const lidDrop = mood === 'tired' ? .42 : 0, out = [];
  for (const s of [-1, 1]) { const x = hx + s * ex, y = hy, id = uid + 'e' + (s > 0 ? 'r' : 'l');
    const scl = `M${hsF(x - ew)} ${hsF(y)}Q${hsF(x - ew * .2)} ${hsF(y - eh * 1.55)} ${hsF(x + ew)} ${hsF(y - .4)}Q${hsF(x + ew * .1)} ${hsF(y + eh * 1.15)} ${hsF(x - ew)} ${hsF(y)}Z`;
    out.push(`<clipPath id="${id}"><path d="${scl}"/></clipPath><path d="${scl}" fill="#FBF7F1"/><g clip-path="url(#${id})"><circle cx="${hsF(x + .4)}" cy="${hsF(y - .3)}" r="${hsF(4.7 * es)}" fill="${C.eye}"/><circle cx="${hsF(x + .4)}" cy="${hsF(y - .3)}" r="${hsF(4.7 * es)}" fill="none" stroke="${hsDk(C.eye)}" stroke-width=".9"/><circle cx="${hsF(x + .4)}" cy="${hsF(y + 1.2)}" r="${hsF(2.6 * es)}" fill="${hsHi(C.eye)}" opacity=".35"/><circle cx="${hsF(x + .4)}" cy="${hsF(y - .3)}" r="${hsF(2.1 * es)}" fill="#120C0A"/><circle cx="${hsF(x - 1.1)}" cy="${hsF(y - 1.8)}" r="${hsF(1.15 * es)}" fill="#FFFFFF"/><circle cx="${hsF(x + 1.6)}" cy="${hsF(y + .9)}" r=".5" fill="#FFFFFF" opacity=".8"/><path d="M${hsF(x - ew)} ${hsF(y - eh * 1.6)}H${hsF(x + ew)}V${hsF(y - eh * .7)}Q${hsF(x)} ${hsF(y - eh * 1.2)} ${hsF(x - ew)} ${hsF(y - eh * .7)}Z" fill="${hsSh(C.skin)}" opacity=".18"/>`
      + (lidDrop ? `<path d="M${hsF(x - ew)} ${hsF(y - eh * 2)}H${hsF(x + ew)}V${hsF(y - eh * (1 - lidDrop * 2))}Q${hsF(x)} ${hsF(y - eh * (1.5 - lidDrop * 2.4))} ${hsF(x - ew)} ${hsF(y - eh * (.9 - lidDrop * 2))}Z" fill="${C.skin}"/>` : '') + `</g>`);
    // lids, lashes and crease
    const lidY = lidDrop ? y - eh * (1.5 - lidDrop * 2.4) : y - eh * 1.55, oc = s > 0 ? x + ew : x - ew;
    out.push(`<path d="M${hsF(x - ew - .6)} ${hsF(y + .3)}Q${hsF(x - ew * .2)} ${hsF(lidY)} ${hsF(x + ew + .6)} ${hsF(y - .5)}" stroke="${ink}" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M${hsF(oc)} ${hsF(y - .3)}l${hsF(s * 2.6)} ${hsF(-1.9)}" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M${hsF(x - ew * .7)} ${hsF(y + eh * .95)}Q${hsF(x)} ${hsF(y + eh * 1.25)} ${hsF(x + ew * .75)} ${hsF(y + eh * .8)}" stroke="${hsSh(C.skin)}" stroke-width=".8" fill="none" opacity=".75"/><path d="M${hsF(x - ew * .78)} ${hsF(y - eh * 1.3)}Q${hsF(x - ew * .1)} ${hsF(y - eh * 2.25)} ${hsF(x + ew * .86)} ${hsF(y - eh * 1.18)}" stroke="${hsSh(C.skin)}" stroke-width=".9" fill="none" opacity=".7"/>`);
    if (mood === 'tired' || age > 48) out.push(`<path d="M${hsF(x - ew * .6)} ${hsF(y + eh * 1.55)}Q${hsF(x)} ${hsF(y + eh * 2)} ${hsF(x + ew * .7)} ${hsF(y + eh * 1.45)}" stroke="${hsSh(C.skin)}" stroke-width=".8" fill="none" opacity="${mood === 'tired' ? .8 : .45}"/>`);
    if (age > 55) out.push(`<path d="M${hsF(oc + s * 2)} ${hsF(y + 1)}l${hsF(s * 3)} -1M${hsF(oc + s * 2)} ${hsF(y + 2.6)}l${hsF(s * 3)} 1.2" stroke="${hsSh(C.skin)}" stroke-width=".7" opacity=".55"/>`);
  }
  o.push(out.join(''));
  // brows
  const bt = 2.5 * (1 + K.d('fBrow') * .32), by = hy - 4.4 * es * 2.5 - 1.6, rise = mood === 'buzzing' ? -2.2 : 0, worry = mood === 'stressed' ? 3.2 : mood === 'tired' ? -.8 : 0;
  for (const s of [-1, 1]) { const x = hx + s * ex, ix = x - s * ew * 1.02, iy = by + 1.6 + rise - worry, px = x + s * ew * .3, py = by - 1.8 + rise - worry * .2, ox = x + s * ew * 1.22, oy = by + 1.2 + rise;
    o.push(`<path d="M${hsF(ix)} ${hsF(iy + bt * .55)}Q${hsF(px)} ${hsF(py + bt * .55)} ${hsF(ox)} ${hsF(oy + .4)}Q${hsF(px)} ${hsF(py - bt * .5)} ${hsF(ix)} ${hsF(iy - bt * .45)}Z" fill="${K.brow}"/>`); }
}
function hsNose(o, K) {
  const { hx, hy, nt, nsw, C } = K, sh = hsSh(C.skin);
  o.push(`<path d="M${hsF(hx + 3)} ${hsF(hy + 2)}Q${hsF(hx + 4.6)} ${hsF(nt - 9)} ${hsF(hx + nsw * .85)} ${hsF(nt - .5)}L${hsF(hx + nsw * .2)} ${hsF(nt + .6)}Q${hsF(hx + 2)} ${hsF(nt - 8)} ${hsF(hx + 1.4)} ${hsF(hy + 2)}Z" fill="${sh}" opacity=".5"/>`
    + `<ellipse cx="${hsF(hx - .6)}" cy="${hsF(nt - 2.4)}" rx="2.5" ry="1.9" fill="#FFFFFF" opacity=".22"/>`
    + `<path d="M${hsF(hx - nsw)} ${hsF(nt - 2.6)}Q${hsF(hx - nsw - 1.6)} ${hsF(nt + 1.8)} ${hsF(hx - nsw * .35)} ${hsF(nt + 2.2)}M${hsF(hx + nsw)} ${hsF(nt - 2.6)}Q${hsF(hx + nsw + 1.6)} ${hsF(nt + 1.8)} ${hsF(hx + nsw * .35)} ${hsF(nt + 2.2)}" stroke="${sh}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
    + `<ellipse cx="${hsF(hx - nsw * .42)}" cy="${hsF(nt + 1.1)}" rx="1.5" ry=".85" fill="${C.ink}" opacity=".55"/><ellipse cx="${hsF(hx + nsw * .42)}" cy="${hsF(nt + 1.1)}" rx="1.5" ry=".85" fill="${C.ink}" opacity=".55"/>`);
}
function hsMouth(o, K) {
  const { hx, my, mw, lt, mood, C } = K, c = mood === 'buzzing' ? 3.2 : mood === 'stressed' ? -1.2 : mood === 'tired' ? .2 : 1.4, cy = my - c * .4;
  o.push(`<path d="M${hsF(hx - mw)} ${hsF(cy)}C${hsF(hx - mw * .5)} ${hsF(my - 2.6 * lt)} ${hsF(hx - 2)} ${hsF(my - 3.5 * lt)} ${hx} ${hsF(my - 2.3 * lt)}C${hsF(hx + 2)} ${hsF(my - 3.5 * lt)} ${hsF(hx + mw * .5)} ${hsF(my - 2.6 * lt)} ${hsF(hx + mw)} ${hsF(cy)}Q${hx} ${hsF(my + c)} ${hsF(hx - mw)} ${hsF(cy)}Z" fill="${K.lipD}"/>`
    + (mood === 'buzzing' ? `<path d="M${hsF(hx - mw * .82)} ${hsF(cy + .5)}Q${hx} ${hsF(my + c + 3.6)} ${hsF(hx + mw * .82)} ${hsF(cy + .5)}Q${hx} ${hsF(my + c - .2)} ${hsF(hx - mw * .82)} ${hsF(cy + .5)}Z" fill="#FFFDF8"/>` : '')
    + `<path d="M${hsF(hx - mw)} ${hsF(cy)}Q${hx} ${hsF(my + c + (mood === 'buzzing' ? 3.6 : 0))} ${hsF(hx + mw)} ${hsF(cy)}C${hsF(hx + mw * .6)} ${hsF(my + 4.4 * lt + c * .5)} ${hsF(hx - mw * .6)} ${hsF(my + 4.4 * lt + c * .5)} ${hsF(hx - mw)} ${hsF(cy)}Z" fill="${K.lip}"/>`
    + `<path d="M${hsF(hx - mw)} ${hsF(cy)}Q${hx} ${hsF(my + c)} ${hsF(hx + mw)} ${hsF(cy)}" stroke="${mixHex(K.lipD, '#1A0606', .45)}" stroke-width="1.15" fill="none" stroke-linecap="round"/>`
    + `<ellipse cx="${hsF(hx - 1.5)}" cy="${hsF(my + 2.2 * lt + c * .4)}" rx="${hsF(mw * .32)}" ry="1" fill="#FFFFFF" opacity=".28"/>`
    + (c > 1 ? `<path d="M${hsF(hx - mw - 1.4)} ${hsF(cy - 1.2)}q-.8 1.4 .2 2.6M${hsF(hx + mw + 1.4)} ${hsF(cy - 1.2)}q.8 1.4 -.2 2.6" stroke="${hsSh(C.skin)}" stroke-width=".8" fill="none" opacity=".7"/>` : ''));
}
function hsFacialHair(o, K, uid, phase) {
  const { L, hx, hy, rx, ry, my, mw, lt, ch, C } = K, f = L.facial || 0, c = C.hair; if (!f) return;
  if (phase === 'under') {
    const ext = f === 5 ? 15 : 3, region = `M${hsF(hx - rx - 2)} ${hsF(hy + ry * .08)}L${hsF(hx - rx * .6)} ${hsF(hy + ry * .42)}Q${hsF(hx - mw - 5)} ${hsF(my - 8)} ${hsF(hx - K.nsw - 1)} ${hsF(my - 6.5)}L${hsF(hx + K.nsw + 1)} ${hsF(my - 6.5)}Q${hsF(hx + mw + 5)} ${hsF(my - 8)} ${hsF(hx + rx * .6)} ${hsF(hy + ry * .42)}L${hsF(hx + rx + 2)} ${hsF(hy + ry * .08)}L${hsF(hx + rx + 3)} ${hsF(ch + ext)}L${hsF(hx - rx - 3)} ${hsF(ch + ext)}Z`;
    const id = uid + 'fh'; o.push(`<clipPath id="${id}"><path d="${hsFacePath(K)}"/>${f === 5 ? `<ellipse cx="${hx}" cy="${hsF(ch + 1)}" rx="${hsF(rx * .78)}" ry="${hsF(ext)}"/>` : ''}</clipPath>`);
    if (f === 1) { let dots = ''; for (let i = 0; i < 70; i++) { const a = (i * 2.399) % (Math.PI * 2), r = Math.sqrt(((i * 37) % 70) / 70); const x = hx + Math.cos(a) * rx * .9 * r, y = my + 2 + Math.sin(a) * (ch - my + 4) * r; dots += `<circle cx="${hsF(x)}" cy="${hsF(y)}" r=".45"/>`; } o.push(`<g clip-path="url(#${id})"><path d="${region}" fill="${c}" opacity=".22"/><g fill="${hsDk(c)}" opacity=".45">${dots}</g></g>`); }
    if (f === 4 || f === 5) o.push(`<g clip-path="url(#${id})"><path d="${region}" fill="${c}"/><path d="${region}" fill="${K.hairS}" opacity=".35" transform="translate(${hsF(rx * .35)} 0)"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${hsF(hx - rx * .7 + i * rx * .28)} ${hsF(hy + ry * .55 + (i % 2) * 4)}q1 4 0 8" stroke="${K.hairD}" stroke-width=".8" fill="none" opacity=".5"/>`).join('')}</g>`);
    if (f === 6) for (const s of [-1, 1]) o.push(`<path d="M${hsF(hx + s * (rx + .5))} ${hsF(hy - 8)}L${hsF(hx + s * (rx - 6))} ${hsF(hy - 8)}L${hsF(hx + s * (rx - 5.5))} ${hsF(hy + ry * .42)}L${hsF(hx + s * (rx - 1.5))} ${hsF(hy + ry * .46)}Z" fill="${c}"/>`);
    if (f === 7) o.push(`<g clip-path="url(#${id})"><path d="M${hsF(hx - rx - 2)} ${hsF(hy + ry * .05)}Q${hsF(hx - rx * .55)} ${hsF(ch - 4)} ${hx} ${hsF(ch - 4.6)}Q${hsF(hx + rx * .55)} ${hsF(ch - 4)} ${hsF(hx + rx + 2)} ${hsF(hy + ry * .05)}L${hsF(hx + rx + 3)} ${hsF(ch + 4)}L${hsF(hx - rx - 3)} ${hsF(ch + 4)}Z" fill="${c}"/></g>`);
    if (f === 3) o.push(`<path d="M${hsF(hx - mw * .7)} ${hsF(my + 4 * lt)}Q${hsF(hx - mw * .8)} ${hsF(ch - 3)} ${hx} ${hsF(ch + 1.4)}Q${hsF(hx + mw * .8)} ${hsF(ch - 3)} ${hsF(hx + mw * .7)} ${hsF(my + 4 * lt)}Q${hx} ${hsF(my + 6 * lt)} ${hsF(hx - mw * .7)} ${hsF(my + 4 * lt)}Z" fill="${c}"/><path d="M${hsF(hx - 3)} ${hsF(ch - 6)}q3 2.4 6 0" stroke="${K.hairH}" stroke-width="1" fill="none" opacity=".4"/>`);
    return;
  }
  // over the mouth: moustaches and the soul patch
  const must = `M${hsF(hx - mw - 2.6)} ${hsF(my + .8)}Q${hsF(hx - mw * .6)} ${hsF(my - 6.4)} ${hx} ${hsF(my - 4.8)}Q${hsF(hx + mw * .6)} ${hsF(my - 6.4)} ${hsF(hx + mw + 2.6)} ${hsF(my + .8)}Q${hsF(hx + mw * .4)} ${hsF(my - 2.2)} ${hx} ${hsF(my - 2.5)}Q${hsF(hx - mw * .4)} ${hsF(my - 2.2)} ${hsF(hx - mw - 2.6)} ${hsF(my + .8)}Z`;
  if ([2, 3, 4, 5, 8].includes(f)) o.push(`<path d="${must}" fill="${c}"/><path d="M${hsF(hx - mw * .5)} ${hsF(my - 4.6)}Q${hsF(hx - mw * .2)} ${hsF(my - 5.4)} ${hsF(hx - 1)} ${hsF(my - 4.4)}" stroke="${K.hairH}" stroke-width="1" fill="none" opacity=".45"/>`);
  if (f === 8) for (const s of [-1, 1]) o.push(`<path d="M${hsF(hx + s * (mw + 2.4))} ${hsF(my + .6)}Q${hsF(hx + s * (mw + 7.5))} ${hsF(my + 1.2)} ${hsF(hx + s * (mw + 7.2))} ${hsF(my - 3.8)}Q${hsF(hx + s * (mw + 6.4))} ${hsF(my - 6.6)} ${hsF(hx + s * (mw + 4))} ${hsF(my - 5.4)}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  if (f === 9) o.push(`<path d="M${hsF(hx - 2.6)} ${hsF(my + 4.6 * lt + 1.4)}Q${hx} ${hsF(my + 11)} ${hsF(hx + 2.6)} ${hsF(my + 4.6 * lt + 1.4)}Z" fill="${c}"/>`);
}
function hsMarks(o, K) {
  const { L, hx, hy, rx, ry, nt, nsw, my, mw, C } = K;
  const fr = L.mark === 3 || (L.style === 0 && (L.cheeks === 2 || L.cheeks === 3));
  if (fr) { let s = ''; for (let i = 0; i < 22; i++) { const side = i % 2 ? 1 : -1, x = hx + side * (rx * (.22 + ((i * 7) % 11) / 30)), y = hy + 8 + ((i * 5) % 9) * 1.2; s += `<circle cx="${hsF(x)}" cy="${hsF(y)}" r="${(.5 + (i % 3) * .15).toFixed(2)}"/>`; } o.push(`<g fill="${mixHex(C.skin, '#5A2A14', .45)}" opacity=".7">${s}</g>`); }
  if (L.mark === 1) o.push(`<circle cx="${hsF(hx + nsw * .62)}" cy="${hsF(nt + 2.2)}" r="2.1" fill="none" stroke="#D9DDE3" stroke-width=".9"/>`);
  if (L.mark === 2) o.push(`<circle cx="${hsF(hx + nsw * .78)}" cy="${hsF(nt - .2)}" r="1" fill="#E8EBF0"/><circle cx="${hsF(hx + nsw * .78 - .3)}" cy="${hsF(nt - .5)}" r=".35" fill="#FFFFFF"/>`);
  if (L.mark === 4) o.push(`<circle cx="${hsF(hx - mw - 3)}" cy="${hsF(my - 6)}" r="1.1" fill="${mixHex(C.skin, '#2A140C', .7)}"/>`);
  void ry;
}
function hsAgeLines(o, K) {
  const { age, hx, hy, rx, ry, nt, nsw, my, mw, C } = K; if (age < 40) return;
  const a = clamp((age - 40) / 30, .2, .8), sh = hsSh(C.skin);
  o.push(`<g stroke="${sh}" stroke-width=".8" fill="none" opacity="${a.toFixed(2)}" stroke-linecap="round"><path d="M${hsF(hx - nsw - 2)} ${hsF(nt + 1)}Q${hsF(hx - mw - 3)} ${hsF(my - 3)} ${hsF(hx - mw - 2)} ${hsF(my + 3)}"/><path d="M${hsF(hx + nsw + 2)} ${hsF(nt + 1)}Q${hsF(hx + mw + 3)} ${hsF(my - 3)} ${hsF(hx + mw + 2)} ${hsF(my + 3)}"/>${age > 50 ? `<path d="M${hsF(hx - rx * .4)} ${hsF(hy - ry * .48)}q${hsF(rx * .4)} -2 ${hsF(rx * .8)} 0"/><path d="M${hsF(hx - rx * .3)} ${hsF(hy - ry * .4)}q${hsF(rx * .3)} -1.5 ${hsF(rx * .6)} 0"/>` : ''}</g>`);
}
// ---------------- glasses ----------------
function hsGlasses(o, K, uid) {
  const g = K.L.glasses || 0; if (!g) return;
  const { hx, hy, ex, rx } = K, y = hy;
  const lens = (x, kind) => { switch (kind) {
    case 'round': return `M${hsF(x - 9)} ${y}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z`;
    case 'square': return `M${hsF(x - 10)} ${y - 7}h20v13.5q0 1.5 -1.5 1.5h-17q-1.5 0 -1.5 -1.5Z`;
    case 'thick': return `M${hsF(x - 10.5)} ${y - 7.5}h21q1.6 0 1.6 1.6v10.6q0 4.2 -4.2 4.2h-15.8q-4.2 0 -4.2 -4.2v-10.6q0 -1.6 1.6 -1.6Z`;
    case 'wire': return `M${hsF(x - 9.5)} ${y}a9.5 7.6 0 1 0 19 0a9.5 7.6 0 1 0 -19 0Z`;
    case 'cat': { const s = x > hx ? 1 : -1; return `M${hsF(x - s * 9.5)} ${y - 4}Q${hsF(x)} ${y - 7.5} ${hsF(x + s * 11.5)} ${y - 9}Q${hsF(x + s * 11)} ${y + 6} ${hsF(x + s * 2)} ${y + 7}Q${hsF(x - s * 9)} ${y + 7} ${hsF(x - s * 9.5)} ${y - 4}Z`; }
    case 'avi': { const s = x > hx ? 1 : -1; return `M${hsF(x - s * 9)} ${y - 6.5}H${hsF(x + s * 9.5)}Q${hsF(x + s * 11)} ${y + 2} ${hsF(x + s * 4)} ${y + 9.5}Q${hsF(x - s * 4)} ${y + 11} ${hsF(x - s * 8)} ${y + 4}Q${hsF(x - s * 10)} ${y - 1} ${hsF(x - s * 9)} ${y - 6.5}Z`; }
    case 'wayf': { const s = x > hx ? 1 : -1; return `M${hsF(x - s * 10)} ${y - 6.5}H${hsF(x + s * 11)}L${hsF(x + s * 9)} ${y + 6}Q${hsF(x + s * 8)} ${y + 8} ${hsF(x + s * 5)} ${y + 8}H${hsF(x - s * 6)}Q${hsF(x - s * 9)} ${y + 8} ${hsF(x - s * 9.5)} ${y + 5}Z`; }
    case 'half': return `M${hsF(x - 9.5)} ${y + 2.5}H${hsF(x + 9.5)}Q${hsF(x + 9.5)} ${y + 10} ${x} ${y + 10}Q${hsF(x - 9.5)} ${y + 10} ${hsF(x - 9.5)} ${y + 2.5}Z`;
    case 'heart': return `M${x} ${y + 9}C${hsF(x - 14)} ${y} ${hsF(x - 9)} ${y - 10} ${x} ${y - 4}C${hsF(x + 9)} ${y - 10} ${hsF(x + 14)} ${y} ${x} ${y + 9}Z`;
    case 'star': { let s = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 4.6 : 11; s += (i ? 'L' : 'M') + hsF(x + Math.cos(a) * r) + ' ' + hsF(y + 1 + Math.sin(a) * r); } return s + 'Z'; }
    case '3d': return `M${hsF(x - 10)} ${y - 6}h20v12h-20Z`;
    default: return `M${hsF(x - 9)} ${y}a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z`; } };
  const SPEC = [null, ['round', '#2B2420', 1.6, null], ['square', '#1E1E22', 1.8, null], ['thick', '#141416', 3.2, null], ['wire', '#C9A64A', .9, null], ['cat', '#7A1F2B', 2.2, null], ['avi', '#C9A64A', 1, ['#6B4A2A', .55]], ['wayf', '#111114', 2.2, ['#141418', .93]], ['half', '#C9A64A', 1, null], ['round', '#8C6A3C', 1.4, ['#E8A23B', .4]], ['heart', '#E0567A', 1.6, ['#F06292', .82]], ['star', '#E2B33C', 1.4, ['#F7D046', .85]], ['3d', '#F4F4F2', 2.8, null], ['round', '#C9A64A', 1.3, null]][g];
  const [kind, fc, w, tint] = SPEC, out = [], mono = g === 13, half = g === 8, xs = mono ? [hx + ex] : [hx - ex, hx + ex];
  // the arms going back to the ears
  if (!mono) out.push(`<path d="M${hsF(hx - ex - 10)} ${y - 4}L${hsF(hx - rx - 1)} ${y - 3}M${hsF(hx + ex + 10)} ${y - 4}L${hsF(hx + rx + 1)} ${y - 3}" stroke="${fc}" stroke-width="${Math.min(w, 1.8)}"/>`);
  for (const x of xs) { const p = lens(x, kind), id = uid + 'g' + Math.round(x), lt = g === 12 ? (x < hx ? '#E0353A' : '#2FC3D6') : tint ? tint[0] : '#CFE3F2', lo = g === 12 ? .82 : tint ? tint[1] : .14;
    out.push(`<clipPath id="${id}"><path d="${p}"/></clipPath><path d="${p}" fill="${lt}" fill-opacity="${lo}"/><g clip-path="url(#${id})"><path d="M${hsF(x - 12)} ${y + 2}L${hsF(x - 2)} ${y - 12}L${hsF(x + 2)} ${y - 12}L${hsF(x - 8)} ${y + 2}Z" fill="#FFFFFF" opacity="${tint && tint[1] > .8 ? .32 : .4}"/></g><path d="${p}" fill="none" stroke="${fc}" stroke-width="${w}" stroke-linejoin="round"/>`); }
  if (!mono) out.push(kind === 'avi' ? `<path d="M${hsF(hx - ex + 9)} ${y - 6}H${hsF(hx + ex - 9)}M${hsF(hx - ex + 9)} ${y - 2.5}Q${hx} ${y - 5} ${hsF(hx + ex - 9)} ${y - 2.5}" stroke="${fc}" stroke-width="1" fill="none"/>` : half ? `<path d="M${hsF(hx - ex + 9.5)} ${y + 3}Q${hx} ${y} ${hsF(hx + ex - 9.5)} ${y + 3}" stroke="${fc}" stroke-width="1" fill="none"/>` : `<path d="M${hsF(hx - ex + 9)} ${y - 1.5}Q${hx} ${y - 5} ${hsF(hx + ex - 9)} ${y - 1.5}" stroke="${fc}" stroke-width="${Math.min(w, 2)}" fill="none"/>`);
  if (mono) out.push(`<path d="M${hsF(hx + ex + 7)} ${y + 6}C${hsF(hx + ex + 14)} ${y + 30} ${hsF(hx + ex + 4)} 140 ${hsF(hx + ex + 12)} 168" stroke="#C9A64A" stroke-width=".8" fill="none" stroke-dasharray="1.6 1"/>`);
  o.push(out.join(''));
}
// ---------------- hats ----------------
function hsHat(o, K) {
  const h = K.L.head || 0; if (!h) return;
  const { hx, hy, rx, ry, C } = K, hl = hy - ry * .56, hw = rx + 6, col = HS_HAT[h] || C.cloth, dk = hsSh(col), lt = hsHi(col), T = K.T, top = hy - ry * 1.08;
  const dome = (y0, H, w = hw) => `M${hsF(hx - w)} ${hsF(y0)}C${hsF(hx - w)} ${hsF(y0 - H * 1.25)} ${hsF(hx + w)} ${hsF(y0 - H * 1.25)} ${hsF(hx + w)} ${hsF(y0)}Z`;
  const p = [];
  switch (h) {
    case 1: p.push(`<path d="${dome(hl + 2, 36)}" fill="${col}"/><path d="M${hx} ${hsF(hl - 43)}V${hsF(hl + 1)}M${hsF(hx - hw * .55)} ${hsF(hl - 30)}Q${hsF(hx - hw * .3)} ${hsF(hl - 10)} ${hsF(hx - hw * .4)} ${hsF(hl + 1)}M${hsF(hx + hw * .55)} ${hsF(hl - 30)}Q${hsF(hx + hw * .3)} ${hsF(hl - 10)} ${hsF(hx + hw * .4)} ${hsF(hl + 1)}" stroke="${dk}" stroke-width=".9" fill="none"/><circle cx="${hx}" cy="${hsF(hl - 43)}" r="2.4" fill="${dk}"/><rect x="${hsF(hx - 7)}" y="${hsF(hl - 22)}" width="14" height="9" rx="2" fill="${lt}"/><path d="M${hsF(hx - hw - 3)} ${hsF(hl + 1)}Q${hx} ${hsF(hl + 13)} ${hsF(hx + hw + 3)} ${hsF(hl + 1)}Q${hx} ${hsF(hl + 4)} ${hsF(hx - hw - 3)} ${hsF(hl + 1)}Z" fill="${dk}"/><path d="M${hsF(hx - hw * .7)} ${hsF(hl - 28)}Q${hsF(hx - hw * .5)} ${hsF(hl - 38)} ${hsF(hx - hw * .1)} ${hsF(hl - 40)}" stroke="#FFFFFF" stroke-width="2.4" opacity=".2" fill="none" stroke-linecap="round"/>`); break;
    case 2: { let rib = ''; for (let i = 0; i < 13; i++) { const x = hx - hw + 1 + i * (hw * 2 - 2) / 12; rib += `M${hsF(x)} ${hsF(hl - 4)}V${hsF(hl + 6)}`; } p.push(`<path d="${dome(hl - 2, 36, hw - 1)}" fill="${col}"/><path d="M${hsF(hx - hw * .5)} ${hsF(hl - 34)}Q${hsF(hx - hw * .3)} ${hsF(hl - 14)} ${hsF(hx - hw * .35)} ${hsF(hl - 3)}M${hsF(hx + hw * .5)} ${hsF(hl - 34)}Q${hsF(hx + hw * .3)} ${hsF(hl - 14)} ${hsF(hx + hw * .35)} ${hsF(hl - 3)}M${hx} ${hsF(hl - 44)}V${hsF(hl - 3)}" stroke="${dk}" stroke-width="1" fill="none" opacity=".6"/><rect x="${hsF(hx - hw - 1)}" y="${hsF(hl - 5)}" width="${hsF(hw * 2 + 2)}" height="12" rx="4" fill="${dk}"/><path d="${rib}" stroke="${hsDk(col)}" stroke-width=".9" opacity=".6"/>`); break; }
    case 3: p.push(`<path d="M${hsF(hx - hw)} ${hsF(hl - 2)}Q${hx} ${hsF(hl - 12)} ${hsF(hx + hw)} ${hsF(hl - 2)}L${hsF(hx + hw)} ${hsF(hl + 7)}Q${hx} ${hsF(hl - 2)} ${hsF(hx - hw)} ${hsF(hl + 7)}Z" fill="${col}"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${hsF(hx - hw * .75 + i * hw * .3)}" cy="${hsF(hl - 2 + Math.abs(i - 2.5) * .9)}" r="1.1" fill="#FFF3E6" opacity=".85"/>`).join('')}<path d="M${hsF(hx + hw - 1)} ${hsF(hl)}l9 -6l1 6l-1 6Z" fill="${dk}"/><path d="M${hsF(hx + hw + 7)} ${hsF(hl + 1)}l7 10l-4 1ZM${hsF(hx + hw + 7)} ${hsF(hl + 1)}l10 5l-3 3Z" fill="${col}"/>`); break;
    case 4: p.push(`<ellipse cx="${hx}" cy="${hsF(hl - 1)}" rx="${hsF(hw + 22)}" ry="8" fill="${dk}"/><path d="${dome(hl - 2, 30, hw - 2)}" fill="${col}"/><path d="M${hsF(hx - hw + 2)} ${hsF(hl - 9)}Q${hx} ${hsF(hl - 13)} ${hsF(hx + hw - 2)} ${hsF(hl - 9)}L${hsF(hx + hw - 1)} ${hsF(hl - 3)}Q${hx} ${hsF(hl - 7)} ${hsF(hx - hw + 1)} ${hsF(hl - 3)}Z" fill="${hsDk(col)}"/><ellipse cx="${hx}" cy="${hsF(hl + 1)}" rx="${hsF(hw + 22)}" ry="4" fill="${col}" opacity=".6"/>`); break;
    case 5: { const by = K.T - 4; p.push(`<path d="M${hsF(hx - rx - 6)} ${hsF(hy - 2)}C${hsF(hx - rx - 8)} ${hsF(by - 6)} ${hsF(hx + rx + 8)} ${hsF(by - 6)} ${hsF(hx + rx + 6)} ${hsF(hy - 2)}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${hsF(hx - rx * .6)} ${hsF(by + 2)}Q${hx} ${hsF(by - 4)} ${hsF(hx + rx * .6)} ${hsF(by + 2)}" stroke="#E0567A" stroke-width="2" fill="none"/>`); for (const s of [-1, 1]) p.push(`<rect x="${hsF(hx + s * (rx + 4) - 7)}" y="${hsF(hy - 12)}" width="14" height="26" rx="6" fill="${col}"/><rect x="${hsF(hx + s * (rx + 4) - (s > 0 ? 7 : -3) - 0)}" y="${hsF(hy - 10)}" width="4" height="22" rx="2" fill="${hsDk(col)}"/><circle cx="${hsF(hx + s * (rx + 4))}" cy="${hsF(hy + 1)}" r="3.4" fill="#E0567A"/>`); break; }
    case 6: p.push(`<ellipse cx="${hsF(hx + 6)}" cy="${hsF(hl - 12)}" rx="${hsF(hw + 8)}" ry="12" fill="${col}" transform="rotate(-9 ${hsF(hx + 6)} ${hsF(hl - 12)})"/><path d="M${hsF(hx - hw + 1)} ${hsF(hl - 4)}Q${hx} ${hsF(hl - 10)} ${hsF(hx + hw - 1)} ${hsF(hl - 6)}L${hsF(hx + hw - 1)} ${hsF(hl - 2)}Q${hx} ${hsF(hl - 6)} ${hsF(hx - hw + 1)} ${hsF(hl)}Z" fill="${dk}"/><rect x="${hsF(hx + 8)}" y="${hsF(hl - 28)}" width="3" height="6" rx="1.4" fill="${dk}"/><ellipse cx="${hsF(hx - 2)}" cy="${hsF(hl - 18)}" rx="${hsF(hw * .6)}" ry="3.4" fill="#FFFFFF" opacity=".14" transform="rotate(-9 ${hx} ${hsF(hl - 18)})"/>`); break;
    case 7: p.push(`<path d="M${hsF(hx - rx - 3)} ${hsF(hy - 8)}C${hsF(hx - rx - 3)} ${hsF(T + 6)} ${hsF(hx + rx + 3)} ${hsF(T + 6)} ${hsF(hx + rx + 3)} ${hsF(hy - 8)}" stroke="${col}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M${hsF(hx - rx * .4)} ${hsF(T + 8.6)}Q${hx} ${hsF(T + 5.6)} ${hsF(hx + rx * .4)} ${hsF(T + 8.6)}" stroke="#FFFFFF" stroke-width="1" opacity=".4" fill="none"/>`); break;
    case 8: p.push(`<path d="M${hsF(hx - hw - 20)} ${hsF(hl + 1)}Q${hx} ${hsF(hl - 10)} ${hsF(hx + hw + 20)} ${hsF(hl + 1)}Q${hx} ${hsF(hl + 6)} ${hsF(hx - hw - 20)} ${hsF(hl + 1)}Z" fill="${dk}"/><path d="M${hsF(hx - hw + 3)} ${hsF(hl - 2)}L${hsF(hx - hw + 7)} ${hsF(hl - 28)}Q${hsF(hx - 8)} ${hsF(hl - 34)} ${hx} ${hsF(hl - 29)}Q${hsF(hx + 8)} ${hsF(hl - 34)} ${hsF(hx + hw - 7)} ${hsF(hl - 28)}L${hsF(hx + hw - 3)} ${hsF(hl - 2)}Z" fill="${col}"/><path d="M${hx} ${hsF(hl - 29)}Q${hsF(hx - 1)} ${hsF(hl - 18)} ${hx} ${hsF(hl - 12)}" stroke="${dk}" stroke-width="1.3" fill="none"/><path d="M${hsF(hx - hw + 4)} ${hsF(hl - 9)}L${hsF(hx + hw - 4)} ${hsF(hl - 9)}L${hsF(hx + hw - 3.4)} ${hsF(hl - 3)}L${hsF(hx - hw + 3.4)} ${hsF(hl - 3)}Z" fill="#1A1416"/>`); break;
    case 9: p.push(`<path d="M${hsF(hx - hw - 3)} ${hsF(hl)}C${hsF(hx - hw - 6)} ${hsF(hl - 30)} ${hsF(hx + hw + 10)} ${hsF(hl - 34)} ${hsF(hx + hw + 4)} ${hsF(hl - 2)}Z" fill="${col}"/><path d="M${hsF(hx - hw * .4)} ${hsF(hl - 22)}Q${hsF(hx + 4)} ${hsF(hl - 30)} ${hsF(hx + hw * .7)} ${hsF(hl - 20)}" stroke="${dk}" stroke-width="1" fill="none"/><circle cx="${hsF(hx + 3)}" cy="${hsF(hl - 27)}" r="2.2" fill="${dk}"/><path d="M${hsF(hx - hw - 2)} ${hsF(hl)}Q${hx} ${hsF(hl + 9)} ${hsF(hx + hw + 2)} ${hsF(hl - 1)}Q${hx} ${hsF(hl + 3)} ${hsF(hx - hw - 2)} ${hsF(hl)}Z" fill="${hsDk(col)}"/>`); break;
    case 10: { const fc = ['#F48FB1', '#FFF59D', '#FFFFFF', '#CE93D8', '#FFAB91']; let s = ''; for (let i = 0; i < 9; i++) { const t = i / 8, a = Math.PI * (1.12 + .76 * t), x = hx + Math.cos(a) * (rx + 3), y = (hy - 6) + Math.sin(a) * (hy - 6 - T + 2); s += `<ellipse cx="${hsF(x + 4)}" cy="${hsF(y + 3)}" rx="4" ry="2" fill="#5E9C5A" transform="rotate(30 ${hsF(x + 4)} ${hsF(y + 3)})"/>`; for (let k = 0; k < 5; k++) { const b = k * 1.2566; s += `<circle cx="${hsF(x + Math.cos(b) * 2.6)}" cy="${hsF(y + Math.sin(b) * 2.6)}" r="2.3" fill="${fc[i % 5]}"/>`; } s += `<circle cx="${hsF(x)}" cy="${hsF(y)}" r="1.5" fill="#F2B63C"/>`; } p.push(s); break; }
    case 11: p.push(`<path d="M${hsF(hx - hw + 3)} ${hsF(hl - 2)}L${hsF(hx - hw + 6)} ${hsF(hl - 28)}Q${hx} ${hsF(hl - 36)} ${hsF(hx + hw - 6)} ${hsF(hl - 28)}L${hsF(hx + hw - 3)} ${hsF(hl - 2)}Z" fill="${col}"/><path d="M${hsF(hx - hw - 1)} ${hsF(hl - 4)}L${hsF(hx + hw + 1)} ${hsF(hl - 4)}L${hsF(hx + hw + 11)} ${hsF(hl + 9)}Q${hx} ${hsF(hl + 14)} ${hsF(hx - hw - 11)} ${hsF(hl + 9)}Z" fill="${dk}"/><path d="M${hsF(hx - hw - 5)} ${hsF(hl + 3)}Q${hx} ${hsF(hl + 8)} ${hsF(hx + hw + 5)} ${hsF(hl + 3)}" stroke="${lt}" stroke-width=".8" stroke-dasharray="2 1.6" fill="none"/>`); break;
    case 12: p.push(`<path d="M${hsF(hx - hw - 24)} ${hsF(hl - 12)}Q${hsF(hx - hw - 18)} ${hsF(hl + 4)} ${hx} ${hsF(hl + 4)}Q${hsF(hx + hw + 18)} ${hsF(hl + 4)} ${hsF(hx + hw + 24)} ${hsF(hl - 12)}Q${hsF(hx + hw + 8)} ${hsF(hl - 3)} ${hx} ${hsF(hl - 3)}Q${hsF(hx - hw - 8)} ${hsF(hl - 3)} ${hsF(hx - hw - 24)} ${hsF(hl - 12)}Z" fill="${dk}"/><path d="M${hsF(hx - hw + 2)} ${hsF(hl - 2)}L${hsF(hx - hw + 4)} ${hsF(hl - 30)}Q${hsF(hx - 6)} ${hsF(hl - 36)} ${hx} ${hsF(hl - 30)}Q${hsF(hx + 6)} ${hsF(hl - 36)} ${hsF(hx + hw - 4)} ${hsF(hl - 30)}L${hsF(hx + hw - 2)} ${hsF(hl - 2)}Z" fill="${col}"/><path d="M${hsF(hx - hw + 3)} ${hsF(hl - 9)}H${hsF(hx + hw - 3)}V${hsF(hl - 4)}H${hsF(hx - hw + 3)}Z" fill="#3A2416"/>${[-2, -1, 0, 1, 2].map(i => `<circle cx="${hsF(hx + i * 7)}" cy="${hsF(hl - 6.5)}" r="1.1" fill="#D8DCE2"/>`).join('')}`); break;
    case 13: p.push(`<path d="M${hsF(hx - rx - 2)} ${hsF(hl - 1)}Q${hx} ${hsF(hl - 8)} ${hsF(hx + rx + 2)} ${hsF(hl - 1)}" stroke="${dk}" stroke-width="5" fill="none"/><path d="M${hsF(hx - hw - 2)} ${hsF(hl)}Q${hx} ${hsF(hl + 16)} ${hsF(hx + hw + 2)} ${hsF(hl)}Q${hx} ${hsF(hl + 3)} ${hsF(hx - hw - 2)} ${hsF(hl)}Z" fill="${col}" fill-opacity=".78"/>`); break;
    case 14: { const by = T + 6, s = []; for (let i = 0; i < 5; i++) { const x = hx - rx + 2 + i * (rx * 2 - 4) / 4; s.push(`${hsF(x)} ${hsF(by - (i % 2 ? 10 : 16))}`); if (i < 4) s.push(`${hsF(x + (rx * 2 - 4) / 8)} ${hsF(by - 4)}`); }
      p.push(`<path d="M${hsF(hx - rx + 1)} ${hsF(by + 6)}L${s.join('L')}L${hsF(hx + rx - 1)} ${hsF(by + 6)}Z" fill="${col}"/><rect x="${hsF(hx - rx + 1)}" y="${hsF(by)}" width="${hsF(rx * 2 - 2)}" height="6" fill="${hsSh(col)}"/>${[-1, 0, 1].map((i, j) => `<circle cx="${hsF(hx + i * rx * .55)}" cy="${hsF(by + 3)}" r="2" fill="${['#2E6FD6', '#D23A3A', '#2E9C5A'][j]}"/>`).join('')}<path d="M${hsF(hx - rx + 4)} ${hsF(by - 8)}L${hsF(hx - rx + 4)} ${hsF(by + 4)}" stroke="#FFF4C8" stroke-width="1.4" opacity=".6"/>`); break; }
    case 15: p.push(`<path d="M${hsF(hx - hw + 2)} ${hsF(hl - 4)}L${hsF(hx + 8)} ${hsF(top - 52)}Q${hsF(hx + 22)} ${hsF(top - 50)} ${hsF(hx + 26)} ${hsF(top - 40)}Q${hsF(hx + 14)} ${hsF(top - 44)} ${hsF(hx + 12)} ${hsF(top - 40)}L${hsF(hx + hw - 2)} ${hsF(hl - 4)}Z" fill="${col}"/><ellipse cx="${hx}" cy="${hsF(hl - 2)}" rx="${hsF(hw + 16)}" ry="6.5" fill="${dk}"/>${[[hx - 6, hl - 22], [hx + 6, hl - 36], [hx - 1, top - 20]].map(([x, y]) => `<path d="M${hsF(x)} ${hsF(y - 3.4)}l1 2.4l2.4 1l-2.4 1l-1 2.4l-1 -2.4l-2.4 -1l2.4 -1Z" fill="#F7D046"/>`).join('')}`); break;
    case 16: { const seg = ['#E0353A', '#F2C14E', '#2E6FD6', '#2E9C5A']; let s = ''; for (let i = 0; i < 4; i++) { const x0 = hx - hw + i * hw / 2; s += `<path d="M${hsF(x0)} ${hsF(hl)}Q${hsF(x0 + (i < 2 ? 0 : hw * .2))} ${hsF(hl - 32)} ${hx} ${hsF(hl - 38)}Q${hsF(x0 + hw / 2 - (i < 2 ? hw * .2 : 0))} ${hsF(hl - 32)} ${hsF(x0 + hw / 2)} ${hsF(hl)}Z" fill="${seg[i]}"/>`; }
      p.push(`${s}<path d="M${hsF(hx - hw - 1)} ${hsF(hl)}Q${hx} ${hsF(hl + 9)} ${hsF(hx + hw + 1)} ${hsF(hl)}Q${hx} ${hsF(hl + 3)} ${hsF(hx - hw - 1)} ${hsF(hl)}Z" fill="#2A2A30"/><path d="M${hx} ${hsF(hl - 38)}V${hsF(hl - 46)}" stroke="#2A2A30" stroke-width="1.6"/><path d="M${hsF(hx - 15)} ${hsF(hl - 48)}Q${hx} ${hsF(hl - 44)} ${hsF(hx + 15)} ${hsF(hl - 48)}Q${hx} ${hsF(hl - 50)} ${hsF(hx - 15)} ${hsF(hl - 48)}Z" fill="#E0353A"/><circle cx="${hx}" cy="${hsF(hl - 47)}" r="1.8" fill="#2A2A30"/>`); break; }
    case 17: for (const s of [-1, 1]) p.push(`<path d="M${hsF(hx + s * 8)} ${hsF(T + 8)}C${hsF(hx + s * 4)} ${hsF(T - 40)} ${hsF(hx + s * 24)} ${hsF(T - 46)} ${hsF(hx + s * 18)} ${hsF(T + 8)}Z" fill="${col}"/><path d="M${hsF(hx + s * 10.5)} ${hsF(T + 4)}C${hsF(hx + s * 8)} ${hsF(T - 30)} ${hsF(hx + s * 20)} ${hsF(T - 34)} ${hsF(hx + s * 16)} ${hsF(T + 4)}Z" fill="#F4B6C6"/>`); p.push(`<path d="M${hsF(hx - rx - 2)} ${hsF(hy - 8)}C${hsF(hx - rx - 2)} ${hsF(T + 5)} ${hsF(hx + rx + 2)} ${hsF(T + 5)} ${hsF(hx + rx + 2)} ${hsF(hy - 8)}" stroke="#F4F1EC" stroke-width="3.6" fill="none"/>`); break;
    case 18: for (const s of [-1, 1]) p.push(`<path d="M${hsF(hx + s * 9)} ${hsF(T + 8)}L${hsF(hx + s * 19)} ${hsF(T - 16)}L${hsF(hx + s * 28)} ${hsF(T + 11)}Z" fill="${col}"/><path d="M${hsF(hx + s * 13)} ${hsF(T + 7)}L${hsF(hx + s * 19)} ${hsF(T - 8)}L${hsF(hx + s * 24)} ${hsF(T + 9)}Z" fill="#F4A6B8"/>`); p.push(`<path d="M${hsF(hx - rx - 2)} ${hsF(hy - 8)}C${hsF(hx - rx - 2)} ${hsF(T + 6)} ${hsF(hx + rx + 2)} ${hsF(T + 6)} ${hsF(hx + rx + 2)} ${hsF(hy - 8)}" stroke="${col}" stroke-width="3.4" fill="none"/>`); break;
    case 19: p.push(`<ellipse cx="${hx}" cy="${hsF(T - 10)}" rx="${hsF(rx * .82)}" ry="6" fill="none" stroke="#FFF2B0" stroke-width="7" opacity=".35"/><ellipse cx="${hx}" cy="${hsF(T - 10)}" rx="${hsF(rx * .82)}" ry="6" fill="none" stroke="${col}" stroke-width="3.2"/><path d="M${hsF(hx - rx * .5)} ${hsF(T - 15)}Q${hx} ${hsF(T - 17)} ${hsF(hx + rx * .5)} ${hsF(T - 15)}" stroke="#FFFBE0" stroke-width="1.2" fill="none"/>`); break;
    case 20: for (const s of [-1, 1]) p.push(`<path d="M${hsF(hx + s * rx * .35)} ${hsF(T + 8)}Q${hsF(hx + s * rx * .55)} ${hsF(T - 12)} ${hsF(hx + s * rx * .82)} ${hsF(T - 18)}Q${hsF(hx + s * rx * .68)} ${hsF(T - 2)} ${hsF(hx + s * rx * .7)} ${hsF(T + 9)}Z" fill="${col}"/><path d="M${hsF(hx + s * rx * .48)} ${hsF(T + 2)}Q${hsF(hx + s * rx * .58)} ${hsF(T - 8)} ${hsF(hx + s * rx * .74)} ${hsF(T - 13)}" stroke="#FF8A80" stroke-width="1.2" fill="none"/>`); break;
    case 21: p.push(`<g transform="rotate(14 ${hx} ${hsF(T)})"><path d="M${hsF(hx - 15)} ${hsF(T + 8)}L${hx} ${hsF(T - 40)}L${hsF(hx + 15)} ${hsF(T + 8)}Z" fill="${col}"/><path d="M${hsF(hx - 10)} ${hsF(T - 8)}L${hsF(hx + 9)} ${hsF(T - 4)}M${hsF(hx - 6)} ${hsF(T - 20)}L${hsF(hx + 5)} ${hsF(T - 17)}M${hsF(hx - 13)} ${hsF(T + 4)}L${hsF(hx + 13)} ${hsF(T + 7)}" stroke="#F7D046" stroke-width="2.4"/><circle cx="${hx}" cy="${hsF(T - 42)}" r="4.6" fill="#E0567A"/></g><path d="M${hsF(hx + 14)} ${hsF(T + 10)}Q${hsF(hx + rx + 2)} ${hsF(hy - 10)} ${hsF(hx + rx - 2)} ${hsF(hy + ry * .7)}" stroke="#DDD" stroke-width=".6" fill="none"/>`); break;
    case 22: p.push(`<rect x="${hsF(hx - hw + 2)}" y="${hsF(hl - 14)}" width="${hsF(hw * 2 - 4)}" height="14" rx="2" fill="${col}"/><path d="M${hsF(hx - hw + 2)} ${hsF(hl - 13)}C${hsF(hx - hw - 12)} ${hsF(hl - 26)} ${hsF(hx - 14)} ${hsF(hl - 48)} ${hx} ${hsF(hl - 40)}C${hsF(hx + 14)} ${hsF(hl - 48)} ${hsF(hx + hw + 12)} ${hsF(hl - 26)} ${hsF(hx + hw - 2)} ${hsF(hl - 13)}Z" fill="${col}"/><path d="M${hsF(hx - 10)} ${hsF(hl - 14)}Q${hsF(hx - 12)} ${hsF(hl - 30)} ${hsF(hx - 6)} ${hsF(hl - 44)}M${hsF(hx + 8)} ${hsF(hl - 14)}Q${hsF(hx + 12)} ${hsF(hl - 30)} ${hsF(hx + 8)} ${hsF(hl - 44)}" stroke="#DCD8D0" stroke-width="1" fill="none"/>`); break;
    case 23: p.push(`<rect x="${hsF(hx - hw + 4)}" y="${hsF(hl - 40)}" width="${hsF(hw * 2 - 8)}" height="38" rx="2" fill="${col}"/><rect x="${hsF(hx - hw + 4)}" y="${hsF(hl - 11)}" width="${hsF(hw * 2 - 8)}" height="7" fill="#9B1D2A"/><path d="M${hsF(hx - hw - 12)} ${hsF(hl - 1)}Q${hx} ${hsF(hl - 7)} ${hsF(hx + hw + 12)} ${hsF(hl - 1)}Q${hx} ${hsF(hl + 5)} ${hsF(hx - hw - 12)} ${hsF(hl - 1)}Z" fill="#2A2A30"/><rect x="${hsF(hx - hw + 8)}" y="${hsF(hl - 38)}" width="3" height="26" fill="#FFFFFF" opacity=".12"/>`); break;
  }
  o.push(p.join(''));
}
// ---------------- clothes ----------------
function hsPattern(K, kind, base, x0, y0, w, h) {
  const a = mixHex(base, '#FFFFFF', .45), b = mixHex(base, '#120C1C', .35), out = [];
  if (kind === 1) for (let y = y0; y < y0 + h; y += 9) out.push(`<rect x="${x0}" y="${y}" width="${w}" height="3.6" fill="${a}" opacity=".55"/>`);
  if (kind === 2) { for (let y = y0; y < y0 + h; y += 12) out.push(`<rect x="${x0}" y="${y}" width="${w}" height="5" fill="${b}" opacity=".35"/>`); for (let x = x0; x < x0 + w; x += 12) out.push(`<rect x="${x}" y="${y0}" width="5" height="${h}" fill="${b}" opacity=".35"/>`); for (let y = y0 + 2; y < y0 + h; y += 12) out.push(`<rect x="${x0}" y="${y}" width="${w}" height=".8" fill="${a}" opacity=".5"/>`); }
  if (kind === 3) for (let y = y0, r = 0; y < y0 + h; y += 9, r++) for (let x = x0 + (r % 2) * 5; x < x0 + w; x += 10) out.push(`<circle cx="${x}" cy="${y}" r="2.2" fill="${a}"/>`);
  if (kind === 4) for (let y = y0 + 4, r = 0; y < y0 + h; y += 15, r++) for (let x = x0 + (r % 2) * 8; x < x0 + w; x += 16) { const pc = ['#F7D046', '#FFFFFF', '#F48FB1'][(r + x) % 3]; for (let k = 0; k < 5; k++) { const t = k * 1.2566; out.push(`<circle cx="${hsF(x + Math.cos(t) * 2.3)}" cy="${hsF(y + Math.sin(t) * 2.3)}" r="1.8" fill="${pc}" opacity=".85"/>`); } out.push(`<circle cx="${x}" cy="${y}" r="1" fill="${b}"/>`); }
  if (kind === 5) { const cs = ['#F06292', '#FFD54F', '#4FC3F7', '#81C784', '#BA68C8']; for (let i = 5; i > 0; i--) out.push(`<circle cx="${x0 + w * .55}" cy="${y0 + h * .6}" r="${i * 18}" fill="${cs[i % 5]}" opacity=".35"/>`); }
  if (kind === 6) for (let y = y0 + 3, r = 0; y < y0 + h; y += 11, r++) for (let x = x0 + (r % 2) * 7; x < x0 + w; x += 14) out.push(`<path d="M${x - 2.6} ${y}q1 -3 3.4 -2.4q2.6 .8 1.4 3.4q-1.4 2.4 -3.6 1.2q-1.8 -.8 -1.2 -2.2Z" fill="${b}" opacity=".8"/><circle cx="${x + .4}" cy="${y - .4}" r="1" fill="${mixHex(base, '#E8A23B', .5)}"/>`);
  if (kind === 7) for (let x = x0; x < x0 + w; x += 6) out.push(`<rect x="${x}" y="${y0}" width=".7" height="${h}" fill="${a}" opacity=".6"/>`);
  if (kind === 8) { const cs = ['#4B5B33', '#6E7A45', '#2F3A24', '#8A7F55']; for (let i = 0; i < 22; i++) { const x = x0 + ((i * 47) % w), y = y0 + ((i * 29) % h); out.push(`<ellipse cx="${x}" cy="${y}" rx="${9 + (i % 4) * 2}" ry="${5 + (i % 3) * 2}" fill="${cs[i % 4]}" opacity=".85" transform="rotate(${(i * 37) % 180} ${x} ${y})"/>`); } }
  if (kind === 9) for (let y = y0 + 4, r = 0; y < y0 + h; y += 13, r++) for (let x = x0 + (r % 2) * 7; x < x0 + w; x += 14) out.push(`<path d="M${x} ${y - 3}l.9 2.1l2.3 .2l-1.8 1.5l.6 2.2l-2 -1.2l-2 1.2l.6 -2.2l-1.8 -1.5l2.3 -.2Z" fill="${a}"/>`);
  return out.join('');
}
function hsTorso(o, K, uid) {
  const { L, C, hx, G } = K, top = L.outfit || 0, c = top === 19 ? C.cloth : C.cloth, sw = G.sw * 3.9 + 4, nw = K.nw;
  const neck = { 0: 14, 1: 12, 2: 16, 3: 12, 4: 12, 5: -14, 6: 10, 7: 15, 8: 30, 9: 30, 10: 22, 11: -8, 12: 26, 13: 14, 14: 30, 15: 32, 16: 20, 17: -12, 18: 34, 19: 14 }[top] ?? 14;
  const v = [8, 9, 12, 14, 15, 18].includes(top), Y = 140;
  const nl = neck < 0 ? `L${hsF(hx - nw - 1)} ${Y + neck}Q${hx} ${Y + neck - 3} ${hsF(hx + nw + 1)} ${Y + neck}` : v ? `L${hx} ${Y + neck}` : `Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}`;
  const body = `M${hsF(hx - sw - 8)} 202L${hsF(hx - sw - 6)} 178C${hsF(hx - sw - 4)} 158 ${hsF(hx - sw + 12)} 150 ${hsF(hx - 28)} 146Q${hsF(hx - 16)} 142 ${hsF(hx - nw - 3)} ${Y}${nl}${v || neck < 0 ? `L${hsF(hx + nw + 3)} ${Y}` : ''}Q${hsF(hx + 16)} 142 ${hsF(hx + 28)} 146C${hsF(hx + sw - 12)} 150 ${hsF(hx + sw + 4)} 158 ${hsF(hx + sw + 6)} 178L${hsF(hx + sw + 8)} 202Z`;
  const id = uid + 't', main = top === 19 ? '#3E5F8A' : top === 4 ? mixHex(c, '#18161A', .55) : c;
  // hood behind the neck
  if (top === 1) o.push(`<path d="M${hsF(hx - 32)} 146C${hsF(hx - 34)} 122 ${hsF(hx + 34)} 122 ${hsF(hx + 32)} 146Z" fill="${hsSh(c)}"/>`);
  // what's under an open jacket or V
  const under = { 3: '#F4F2EE', 4: '#F4F2EE', 8: '#F4F2EE', 9: '#F4F2EE', 12: '#1F1F24', 14: '#141416', 15: '#F4F2EE', 18: mixHex(c, '#FFFFFF', .5) }[top];
  if (under) o.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + 12} ${hsF(hx + nw + 3)} ${Y}L${hsF(hx + 26)} 202L${hsF(hx - 26)} 202Z" fill="${under}"/><path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + 12} ${hsF(hx + nw + 3)} ${Y}" stroke="${hsSh(under)}" stroke-width="1.6" fill="none"/>`);
  if (top === 9) o.push(`<path d="M${hsF(hx - 4)} ${Y + 6}L${hsF(hx + 4)} ${Y + 6}L${hsF(hx + 3)} ${Y + 12}L${hsF(hx - 3)} ${Y + 12}Z" fill="${HS_TIE[L.colour % 5]}"/><path d="M${hsF(hx - 3)} ${Y + 12}L${hsF(hx + 3)} ${Y + 12}L${hsF(hx + 6)} 196L${hx} 202L${hsF(hx - 6)} 196Z" fill="${HS_TIE[L.colour % 5]}"/><path d="M${hx} ${Y + 14}L${hsF(hx + 4)} 190" stroke="#FFFFFF" stroke-width=".8" opacity=".25"/>`);
  if (top === 19) o.push(`<path d="${body}" fill="${c}"/>`);
  o.push(`<clipPath id="${id}"><path d="${body}"/></clipPath><path d="${body}" fill="${main}"/>`);
  const pat = L.pattern || 0, fabric = top === 2 && !pat ? 2 : top === 16 && !pat ? 4 : top === 19 ? 0 : pat;
  if (fabric) o.push(`<g clip-path="url(#${id})">${hsPattern(K, fabric, main, 0, 136, 200, 70)}</g>`);
  // light from the upper left
  o.push(`<g clip-path="url(#${id})"><rect x="${hsF(hx + sw * .35)}" y="130" width="120" height="80" fill="url(#${uid}sh)"/><path d="M${hsF(hx - sw - 6)} 178C${hsF(hx - sw - 4)} 158 ${hsF(hx - sw + 12)} 150 ${hsF(hx - 28)} 146" stroke="#FFFFFF" stroke-width="3" opacity=".16" fill="none"/></g>`);
  const sh = hsSh(main), dk = hsDk(main), lt = hsHi(main), out = [];
  const lapels = (w, deep, notch) => { for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 3))} ${Y}L${hsF(hx + s * (nw + 9))} ${Y + 2}L${hsF(hx + s * (w + 4))} ${Y + 18}${notch ? `L${hsF(hx + s * (w - 2))} ${Y + 20}L${hsF(hx + s * (w + 2))} ${Y + 26}` : ''}L${hsF(hx + s * 4)} ${Y + deep}Z" fill="${s > 0 ? sh : lt}"/><path d="M${hsF(hx + s * (w + 2))} ${Y + 26}L${hsF(hx + s * 5)} ${Y + deep}" stroke="${dk}" stroke-width=".8" opacity=".6"/>`); };
  const collar = (col2) => { for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 2))} ${Y - 3}L${hsF(hx + s * 3)} ${Y + 13}L${hsF(hx + s * (nw + 10))} ${Y + 9}Z" fill="${s > 0 ? hsSh(col2) : col2}"/>`); };
  const buttons = (y0, n, col2, x = hx) => { for (let i = 0; i < n; i++) out.push(`<circle cx="${hsF(x)}" cy="${y0 + i * 12}" r="1.4" fill="${col2}"/>`); };
  switch (top) {
    case 0: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}" stroke="${sh}" stroke-width="2.2" fill="none"/>`); break;
    case 1: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}" stroke="${sh}" stroke-width="3" fill="none"/><path d="M${hsF(hx - 6)} ${Y + 10}Q${hsF(hx - 8)} 168 ${hsF(hx - 7)} 182M${hsF(hx + 6)} ${Y + 10}Q${hsF(hx + 8)} 168 ${hsF(hx + 7)} 182" stroke="#F4F2EE" stroke-width="1.6" fill="none"/><rect x="${hsF(hx - 8.4)}" y="181" width="2.8" height="5" rx="1" fill="#C9CED6"/><rect x="${hsF(hx + 5.6)}" y="181" width="2.8" height="5" rx="1" fill="#C9CED6"/>`); break;
    case 2: case 7: collar(top === 7 ? hsHi(main) : main); out.push(`<path d="M${hx} ${Y + 13}V202" stroke="${sh}" stroke-width="1.2"/>`); buttons(Y + 22, 4, top === 7 ? '#F4F2EE' : '#E8DCC8', hx + 2.2); break;
    case 3: collar(main); out.push(`<path d="M${hsF(hx - 26)} 202L${hsF(hx - 10)} ${Y + 12}M${hsF(hx + 26)} 202L${hsF(hx + 10)} ${Y + 12}" stroke="${lt}" stroke-width="1" stroke-dasharray="2 1.4"/>`); for (const s of [-1, 1]) out.push(`<rect x="${hsF(hx + s * 34 - 9)}" y="168" width="18" height="14" rx="2" fill="${sh}"/><path d="M${hsF(hx + s * 34 - 9)} 168h18l-9 6Z" fill="${dk}"/><circle cx="${hsF(hx + s * 34)}" cy="173" r="1.3" fill="#C9A64A"/>`); break;
    case 4: for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 3))} ${Y - 2}L${hsF(hx + s * (nw + 20))} ${Y + 6}L${hsF(hx + s * 22)} ${Y + 30}L${hsF(hx + s * 9)} 202L${hsF(hx + s * 5)} 202L${hsF(hx + s * 4)} ${Y + 12}Z" fill="${s > 0 ? dk : lt}"/>`); out.push(`<path d="M${hsF(hx + 8)} ${Y + 18}L${hsF(hx + 2)} 202" stroke="#C9CED6" stroke-width="1.6"/><path d="M${hsF(hx - sw * .6)} 162Q${hsF(hx - sw * .4)} 156 ${hsF(hx - sw * .2)} 160" stroke="#FFFFFF" stroke-width="2.4" opacity=".25" fill="none" stroke-linecap="round"/>`); break;
    case 5: out.push(`<path d="M${hsF(hx - nw - 2)} ${Y + neck}L${hsF(hx - nw - 1)} ${Y + 4}M${hsF(hx + nw + 2)} ${Y + neck}L${hsF(hx + nw + 1)} ${Y + 4}" stroke="${sh}" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M${hsF(hx - nw)} ${Y + neck + 5 + i * 5}Q${hx} ${Y + neck + 7 + i * 5} ${hsF(hx + nw)} ${Y + neck + 5 + i * 5}" stroke="${sh}" stroke-width="1.2" fill="none"/>`).join('')}`); break;
    case 6: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}" stroke="${sh}" stroke-width="4.4" fill="none"/>${[-1, 1].map(s => `<path d="M${hsF(hx + s * 22)} 158${[0, 1, 2, 3].map(i => `q${s * 3} 5 0 10`).join('')}" stroke="${sh}" stroke-width="2" fill="none"/>`).join('')}`); break;
    case 8: lapels(24, 52, 1); out.push(`<path d="M${hsF(hx - 34)} 170l8 -4l2 5Z" fill="#F4F2EE"/>`); break;
    case 9: lapels(24, 56, 1); collar('#F4F2EE'); break;
    case 10: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}" stroke="${sh}" stroke-width="1.6" fill="none"/>`); break;
    case 11: out.push(`<path d="M${hsF(hx - nw - 2)} ${Y + neck}L${hsF(hx - nw - 2)} ${Y + 6}M${hsF(hx + nw + 2)} ${Y + neck}L${hsF(hx + nw + 2)} ${Y + 6}" stroke="${sh}" stroke-width="2"/><path d="M${hx} ${Y + neck}V202" stroke="#C9CED6" stroke-width="1.6"/><rect x="${hsF(hx - 1.6)}" y="${Y + neck + 6}" width="3.2" height="7" rx="1" fill="#C9CED6"/>`); for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 8))} ${Y + 4}C${hsF(hx + s * (sw - 6))} 146 ${hsF(hx + s * (sw + 2))} 158 ${hsF(hx + s * (sw + 5))} 182" stroke="#F4F2EE" stroke-width="2.4" fill="none"/><path d="M${hsF(hx + s * (nw + 12))} ${Y + 6}C${hsF(hx + s * (sw - 2))} 150 ${hsF(hx + s * (sw + 6))} 162 ${hsF(hx + s * (sw + 8))} 186" stroke="#F4F2EE" stroke-width="2.4" fill="none"/>`); break;
    case 12: { const band = mixHex(c, '#F7D046', .55); for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 3))} ${Y - 2}L${hsF(hx + s * (nw + 11))} ${Y}L${hsF(hx - s * 6)} 202L${hsF(hx - s * 14)} 202Z" fill="${s > 0 ? hsSh(band) : band}"/>`); break; }
    case 13: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y}Q${hx} ${Y + neck * 2} ${hsF(hx + nw + 3)} ${Y}" stroke="${sh}" stroke-width="2.2" fill="none"/><circle cx="${hx}" cy="182" r="13" fill="none" stroke="#F4F2EE" stroke-width="2"/><path d="M${hsF(hx + 3)} 172L${hsF(hx - 5)} 184H${hsF(hx + 1)}L${hsF(hx - 3)} 194L${hsF(hx + 6)} 180H${hsF(hx)}Z" fill="#F7D046"/>`); break;
    case 14: { let sp = ''; for (let i = 0; i < 60; i++) { const x = hx - sw + ((i * 53) % (sw * 2)), y = 146 + ((i * 31) % 56); sp += `<circle cx="${hsF(x)}" cy="${y}" r="${(.9 + (i % 3) * .4).toFixed(1)}" fill="#FFFFFF" opacity="${(.2 + (i % 4) * .15).toFixed(2)}"/>`; } out.push(`<g clip-path="url(#${id})">${sp}</g>`); lapels(22, 50, 0); break; }
    case 15: for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 3))} ${Y}L${hx} ${Y + neck}" stroke="${sh}" stroke-width="4"/>`); buttons(Y + neck + 6, 2, hsDk(main), hx); break;
    case 16: for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * (nw + 3))} ${Y - 1}L${hsF(hx + s * (nw + 16))} ${Y + 6}L${hsF(hx + s * 6)} ${Y + neck + 2}L${hsF(hx + s * 1)} ${Y + neck}Z" fill="${s > 0 ? sh : lt}"/>`); break;
    case 17: out.push(`<path d="M${hsF(hx - nw - 3)} ${Y + neck}V${Y + 6}M${hsF(hx + nw + 3)} ${Y + neck}V${Y + 6}" stroke="${sh}" stroke-width="2"/><path d="M${hx} ${Y + neck}V202" stroke="${dk}" stroke-width="1.4"/>${[0, 1, 2, 3].map(i => `<path d="M${hsF(hx - sw - 6)} ${154 + i * 13}Q${hx} ${160 + i * 13} ${hsF(hx + sw + 6)} ${154 + i * 13}" stroke="${sh}" stroke-width="1.4" fill="none"/><path d="M${hsF(hx - sw * .7)} ${148 + i * 13}Q${hsF(hx - sw * .4)} ${146 + i * 13} ${hsF(hx - sw * .15)} ${149 + i * 13}" stroke="#FFFFFF" stroke-width="2.2" opacity=".2" fill="none" stroke-linecap="round"/>`).join('')}`); break;
    case 18: lapels(28, 46, 1); out.push(`<path d="M${hsF(hx + 8)} ${Y + 18}L${hsF(hx + 30)} ${Y + 14}L${hsF(hx + 34)} ${Y + 34}L${hsF(hx + 12)} ${Y + 40}Z" fill="${sh}" opacity=".7"/>`); buttons(184, 2, hsDk(main), hx - 16); buttons(184, 2, hsDk(main), hx + 16); break;
    case 19: { const dn = '#3E5F8A'; out.push(`<path d="M${hsF(hx - 26)} 172H${hsF(hx + 26)}V202H${hsF(hx - 26)}Z" fill="${dn}"/><rect x="${hsF(hx - 10)}" y="178" width="20" height="12" rx="2" fill="${hsSh(dn)}"/>`); for (const s of [-1, 1]) out.push(`<path d="M${hsF(hx + s * 24)} 172L${hsF(hx + s * 34)} 142L${hsF(hx + s * 42)} 144L${hsF(hx + s * 30)} 174Z" fill="${dn}"/><circle cx="${hsF(hx + s * 25)}" cy="175" r="2.2" fill="#C9A64A"/>`); break; }
  }
  o.push(out.join(''));
}
function hsNeckwear(o, K) {
  const { L, C, hx, nw } = K, k = L.neck || 0, Y = 140; if (!k) return;
  const acc = mixHex(LOOK.colour.opts[(L.colour + 9) % 20], '#FFFFFF', .1);
  switch (k) {
    case 1: o.push(`<path d="M${hsF(hx - nw - 8)} ${Y - 6}Q${hx} ${Y + 8} ${hsF(hx + nw + 8)} ${Y - 6}L${hsF(hx + nw + 9)} ${Y + 4}Q${hx} ${Y + 18} ${hsF(hx - nw - 9)} ${Y + 4}Z" fill="${acc}"/><path d="M${hsF(hx + 6)} ${Y + 8}L${hsF(hx + 16)} ${Y + 8}L${hsF(hx + 18)} 190L${hsF(hx + 7)} 190Z" fill="${hsSh(acc)}"/>${[0, 1, 2, 3].map(i => `<path d="M${hsF(hx + 8 + i * 3)} 190v5" stroke="${acc}" stroke-width="1.2"/>`).join('')}<path d="M${hsF(hx - nw - 8)} ${Y - 1}Q${hx} ${Y + 12} ${hsF(hx + nw + 8)} ${Y - 1}" stroke="${hsSh(acc)}" stroke-width="1" fill="none"/>`); break;
    case 2: o.push(`<path d="M${hsF(hx - nw - 2)} ${Y}Q${hx} ${Y + 20} ${hsF(hx + nw + 2)} ${Y}" stroke="#E3B341" stroke-width=".9" fill="none"/><path d="M${hx} ${Y + 10}l2.4 3.6l-2.4 3.6l-2.4 -3.6Z" fill="#E3B341"/>`); break;
    case 3: { let s = ''; for (let i = 0; i <= 12; i++) { const t = i / 12, x = hx - nw - 4 + t * (nw * 2 + 8), y = Y + 2 + Math.sin(t * Math.PI) * 14; s += `<ellipse cx="${hsF(x)}" cy="${hsF(y)}" rx="2" ry="1.3" fill="none" stroke="#E3B341" stroke-width="1.1" transform="rotate(${hsF((t - .5) * 50)} ${hsF(x)} ${hsF(y)})"/>`; } o.push(s); break; }
    case 4: o.push(`<path d="M${hx} ${Y + 6}L${hsF(hx - 11)} ${Y}L${hsF(hx - 11)} ${Y + 12}Z M${hx} ${Y + 6}L${hsF(hx + 11)} ${Y}L${hsF(hx + 11)} ${Y + 12}Z" fill="${acc}"/><rect x="${hsF(hx - 2.6)}" y="${Y + 3}" width="5.2" height="6" rx="1.4" fill="${hsSh(acc)}"/>`); break;
    case 5: o.push(`<path d="M${hsF(hx - nw - 3)} ${Y - 2}L${hsF(hx - 6)} 178M${hsF(hx + nw + 3)} ${Y - 2}L${hsF(hx + 6)} 178" stroke="#D23A3A" stroke-width="2.2"/><rect x="${hsF(hx - 10)}" y="176" width="20" height="26" rx="2" fill="#FAFAF7"/><rect x="${hsF(hx - 7)}" y="180" width="8" height="9" fill="${C.skin}"/><path d="M${hsF(hx + 3)} 182h5M${hsF(hx + 3)} 186h4M${hsF(hx - 7)} 194h14" stroke="#9AA0A8" stroke-width="1"/><rect x="${hsF(hx - 10)}" y="176" width="20" height="3" fill="#D23A3A"/>`); break;
    case 6: o.push(`<path d="M${hsF(hx - nw - 6)} ${Y - 4}Q${hx} ${Y + 8} ${hsF(hx + nw + 6)} ${Y - 4}L${hsF(hx + nw + 6)} ${Y + 2}Q${hx} ${Y + 14} ${hsF(hx - nw - 6)} ${Y + 2}Z" fill="${acc}"/><path d="M${hsF(hx - 2)} ${Y + 8}L${hsF(hx + 12)} ${Y + 10}L${hsF(hx + 4)} ${Y + 26}Z" fill="${hsSh(acc)}"/>${[0, 1, 2].map(i => `<circle cx="${hsF(hx - 6 + i * 6)}" cy="${Y + 6 + (i % 2) * 2}" r="1" fill="#FFFFFF" opacity=".7"/>`).join('')}`); break;
    case 7: o.push(`<path d="M${hsF(hx - nw - 2)} ${Y}Q${hx} ${Y + 24} ${hsF(hx + nw + 2)} ${Y}" stroke="#3A2A20" stroke-width="1" fill="none"/><circle cx="${hx}" cy="${Y + 14}" r="4.2" fill="#3FA77A"/><circle cx="${hx}" cy="${Y + 14}" r="1.6" fill="#1E5E44"/><circle cx="${hsF(hx - 1.4)}" cy="${Y + 12.6}" r=".9" fill="#FFFFFF" opacity=".6"/>`); break;
  }
}
// ---------------- the whole portrait ----------------
function hsBustInner(K, uid) {
  const o = [], { C, hx, hy, ry, ch, nw } = K;
  o.push(`<defs><linearGradient id="${uid}fs" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stop-color="${hsSh(C.skin)}" stop-opacity="0"/><stop offset="1" stop-color="${hsSh(C.skin)}" stop-opacity=".62"/></linearGradient><linearGradient id="${uid}sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1A1430" stop-opacity="0"/><stop offset="1" stop-color="#1A1430" stop-opacity=".32"/></linearGradient><radialGradient id="${uid}bl"><stop offset="0" stop-color="#E8705E" stop-opacity=".3"/><stop offset="1" stop-color="#E8705E" stop-opacity="0"/></radialGradient></defs>`);
  hsHairBack(o, K);
  // the neck, with the shadow under the jaw
  o.push(`<path d="M${hsF(hx - nw)} ${hsF(ch - 16)}L${hsF(hx - nw - 2)} 152L${hsF(hx + nw + 2)} 152L${hsF(hx + nw)} ${hsF(ch - 16)}Z" fill="${C.skin}"/><path d="M${hsF(hx - nw - 1)} ${hsF(ch - 8)}Q${hx} ${hsF(ch + 9)} ${hsF(hx + nw + 1)} ${hsF(ch - 8)}L${hsF(hx + nw + 1)} ${hsF(ch - 16)}L${hsF(hx - nw - 1)} ${hsF(ch - 16)}Z" fill="${hsSh(C.skin)}" opacity=".75"/><path d="M${hsF(hx + nw * .45)} ${hsF(ch - 4)}L${hsF(hx + nw + 2)} ${hsF(ch - 4)}L${hsF(hx + nw + 2)} 152L${hsF(hx + nw * .5)} 152Z" fill="${hsSh(C.skin)}" opacity=".45"/>`);
  if ([10].includes(K.L.outfit)) o.push(`<path d="M${hsF(hx - 22)} 150q10 4 18 2M${hsF(hx + 22)} 150q-10 4 -18 2" stroke="${hsSh(C.skin)}" stroke-width="1.1" fill="none"/>`);
  o.push('<g transform="translate(0 -5)">'); hsTorso(o, K, uid); hsNeckwear(o, K); o.push('</g>');
  hsEars(o, K); hsEarrings(o, K);
  const face = hsFacePath(K);
  o.push(`<clipPath id="${uid}f"><path d="${face}"/></clipPath><path d="${face}" fill="${C.skin}"/><g clip-path="url(#${uid}f)"><rect x="${hsF(hx - 2)}" y="${hsF(hy - ry * 1.2)}" width="60" height="${hsF(ry * 2.4)}" fill="url(#${uid}fs)"/><ellipse cx="${hsF(hx - K.rx * .38)}" cy="${hsF(hy - ry * .6)}" rx="${hsF(K.rx * .42)}" ry="${hsF(ry * .28)}" fill="#FFFFFF" opacity=".12"/></g>`);
  o.push(`<ellipse cx="${hsF(hx - K.rx * .55)}" cy="${hsF(hy + ry * .36)}" rx="9" ry="5.6" fill="url(#${uid}bl)"/><ellipse cx="${hsF(hx + K.rx * .55)}" cy="${hsF(hy + ry * .36)}" rx="9" ry="5.6" fill="url(#${uid}bl)"/>`);
  hsFacialHair(o, K, uid, 'under');
  hsAgeLines(o, K);
  hsEyes(o, K, uid); hsNose(o, K); hsMouth(o, K); hsMarks(o, K);
  hsFacialHair(o, K, uid, 'over');
  hsHairFront(o, K);
  hsGlasses(o, K, uid);
  hsHat(o, K);
  return o.join('');
}
function hsBustSVG(L0, age, size, bare) {
  const K = hsBuild(L0, age), uid = 'hb' + (++HS_UID), c = K.C.cloth;
  const bg = bare ? '' : `<defs><radialGradient id="${uid}bg" cx=".38" cy=".3" r=".95"><stop offset="0" stop-color="${mixHex(c, '#FFF8EC', .8)}"/><stop offset=".7" stop-color="${mixHex(c, '#C9C2D6', .66)}"/><stop offset="1" stop-color="${mixHex(c, '#8F88A6', .6)}"/></radialGradient></defs><rect x="16" y="18" width="168" height="168" rx="14" fill="url(#${uid}bg)"/><circle cx="100" cy="82" r="64" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity=".35"/>`;
  return `<svg class="portrait headshot" viewBox="16 18 168 168" width="${size}" height="${size}" role="img" aria-label="Portrait">${bg}${bare ? '' : `<clipPath id="${uid}c"><rect x="16" y="18" width="168" height="168" rx="14"/></clipPath>`}<g${bare ? '' : ` clip-path="url(#${uid}c)"`}>${hsBustInner(K, uid)}</g></svg>`;
}
// every head-and-shoulders portrait in the Call Sheet style is now a headshot
csPortraitSVG = function (L0, age, size, bare) { return hsBustSVG(L0, age, size, bare); };

// ---------------- the home card: the character, still, with everything they wear named ----------------
const HS_KIT_ICON = {
  outfit: c => `<path d="M3 4l4 -2.5h6l4 2.5l-2 4h-2v9h-10v-9h-2Z" fill="${c}"/>`,
  bottoms: c => `<path d="M5 2h10l1 15h-4l-2 -9l-2 9h-4Z" fill="${c}"/>`,
  shoes: c => `<path d="M2 13v-5h5q2 3 6 3.5q4 .6 5 2.5v1.5h-16Z" fill="${c}"/><path d="M2 15h16" stroke="#FFFFFF" stroke-width="1.2" opacity=".6"/>`,
  head: c => `<path d="M3 13q0 -9 7 -9q7 0 7 9Z" fill="${c}"/><path d="M1 13h18" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  glasses: c => `<circle cx="5.5" cy="10" r="3.6" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="14.5" cy="10" r="3.6" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M9 9.4q1 -1 2 0" stroke="${c}" stroke-width="1.4" fill="none"/>`,
  ears: c => `<path d="M8 3q5 0 5 6q0 4 -3 6" stroke="#E7C9B2" stroke-width="2.4" fill="none"/><circle cx="10" cy="16" r="2.6" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  neck: c => `<path d="M3 4q7 11 14 0" stroke="${c}" stroke-width="1.4" fill="none"/><path d="M10 9.6l2 3l-2 3l-2 -3Z" fill="${c}"/>`,
  wrist: c => `<rect x="7.5" y="1.5" width="5" height="17" rx="2" fill="#5A5A64"/><circle cx="10" cy="10" r="4.6" fill="${c}"/><circle cx="10" cy="10" r="3.2" fill="#FAFAF7"/><path d="M10 10V8M10 10h1.6" stroke="#222" stroke-width=".8"/>`,
  bag: c => `<path d="M6 7q0 -4 4 -4q4 0 4 4" stroke="${c}" stroke-width="1.5" fill="none"/><rect x="3" y="7" width="14" height="11" rx="2" fill="${c}"/>`,
  mark: c => `<circle cx="10" cy="10" r="2" fill="${c}"/><circle cx="5" cy="7" r="1" fill="${c}"/><circle cx="14" cy="13" r="1.2" fill="${c}"/>`,
  tattoo: c => `<path d="M10 3l2 5l5 .6l-4 3.4l1.2 5l-4.2 -2.8l-4.2 2.8l1.2 -5l-4 -3.4l5 -.6Z" fill="none" stroke="${c}" stroke-width="1.3"/>`
};
function hsKit(L) {
  const C = LOOK.colour.opts[L.colour || 0], items = [['outfit', LOOK.outfit.opts[L.outfit || 0] + (L.pattern ? ', ' + LOOK.pattern.opts[L.pattern].toLowerCase() : ''), C], ['bottoms', LOOK.bottoms.opts[L.bottoms || 0], FIG_COLOURS[L.bottomColour || 0]], ['shoes', LOOK.shoes.opts[L.shoes || 0], CS_SHOE[L.shoes || 0][0]]];
  const add = (k, i, col) => { if (i) items.push([k, LOOK[k].opts[i], col]); };
  add('head', L.head, HS_HAT[L.head] || C); add('glasses', L.glasses, '#C9CED6'); add('ears', L.ears, '#E3B341'); add('neck', L.neck, mixHex(LOOK.colour.opts[(L.colour + 9) % 20], '#FFFFFF', .1)); add('wrist', L.wrist, '#C9A64A'); add('bag', L.bag, '#8A5A3A'); add('mark', L.mark, '#6A3A24'); add('tattoo', L.tattoo, '#2E4A6A');
  return items;
}
function hsHomeCard() {
  const M = S.me, me = ME(), L = lookOf(me), age = ageOf(me), K = hsBuild(L, age), uid = 'hc' + (++HS_UID), c = K.C.cloth;
  const items = hsKit(K.L), mood = K.mood, MOODS = { calm: ['Steady', '#7EE0A1'], tired: ['Running on empty', '#F2C14E'], stressed: ['Under pressure', '#FF8A7A'], buzzing: ['Buzzing', '#7FD8FF'] }, md = MOODS[mood] || MOODS.calm;
  const pet = typeof petsOf === 'function' ? petsOf()[0] : null;
  const rows = items.slice(0, 10).map(([k, label, col], i) => { const x = 214 + (i % 2) * 92, y = 50 + Math.floor(i / 2) * 25;
    return `<g transform="translate(${x} ${y})"><rect x="-3" y="-3" width="86" height="21" rx="6" fill="#FFFFFF" opacity=".05"/><g transform="translate(1 -.5) scale(.9)">${HS_KIT_ICON[k](col)}</g><text x="22" y="6.4" font-size="5" letter-spacing=".9" fill="#9AA3B2" font-family="ui-sans-serif,system-ui,sans-serif">${esc(({ outfit: 'TOP', bottoms: 'BOTTOMS', shoes: 'SHOES', head: 'ON THE HEAD', glasses: 'GLASSES', ears: 'EARS', neck: 'NECK', wrist: 'WRIST', bag: 'CARRYING', mark: 'FACE', tattoo: 'INK' })[k])}</text><text x="22" y="14.4" font-size="7" font-weight="600" fill="#EEF1F6" font-family="ui-sans-serif,system-ui,sans-serif">${esc(String(label).slice(0, 19))}</text></g>`; }).join('');
  const sw = [K.C.skin, K.C.hair, K.C.eye, c].map((x, i) => `<circle cx="${352 + i * 9}" cy="27" r="3.4" fill="${x}" stroke="#FFFFFF" stroke-opacity=".35" stroke-width=".6"/>`).join('');
  return `<svg class="home-scene av-card" viewBox="0 0 400 180" role="img" aria-label="${esc(me.name)}: ${esc(md[0].toLowerCase())}"><defs>
    <linearGradient id="${uid}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mixHex(c, '#14121C', .78)}"/><stop offset="1" stop-color="#0E0D14"/></linearGradient>
    <radialGradient id="${uid}s" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${mixHex(c, '#FFF3DE', .55)}"/><stop offset=".55" stop-color="${mixHex(c, '#3A3450', .45)}"/><stop offset="1" stop-color="${mixHex(c, '#14121C', .7)}"/></radialGradient></defs>
    <rect width="400" height="180" fill="url(#${uid}g)"/>
    <rect x="8" y="8" width="188" height="172" rx="14" fill="url(#${uid}s)"/>
    <g opacity=".22" stroke="#FFFFFF" fill="none"><circle cx="102" cy="82" r="70" stroke-width=".8"/><circle cx="102" cy="82" r="56" stroke-width=".5" stroke-dasharray="2 3"/></g>
    <clipPath id="${uid}c"><rect x="8" y="8" width="188" height="172" rx="14"/></clipPath>
    <g clip-path="url(#${uid}c)"><g transform="translate(6 6) scale(.96)">${hsBustInner(K, uid)}</g></g>
    ${pet && typeof petSprite === 'function' ? `<g transform="translate(166 172) scale(.62)">${petSprite(pet, 0, 0, 1)}</g>` : ''}
    <text x="214" y="24" font-size="6" letter-spacing="2" fill="#9AA3B2" font-family="ui-sans-serif,system-ui,sans-serif">THE LOOK</text>${sw}
    <g transform="translate(214 31)"><circle cx="2.6" cy="2.4" r="2.6" fill="${md[1]}"/><text x="9" y="4.6" font-size="6.4" fill="${md[1]}" font-family="ui-sans-serif,system-ui,sans-serif">${esc(md[0])}</text></g>
    ${rows}
  </svg>`;
}
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) { if (!S.me) return _hs.apply(this, arguments); try { return hsHomeCard(); } catch (e) { return _hs.apply(this, arguments); } }; }
{ const _hb = typeof heroSceneBar === 'function' ? heroSceneBar : null; heroSceneBar = function () {
  const M = S.me, W = M.wk, w = typeof wxDay === 'function' ? wxDay(M.hub, S.week, W ? W.day : 0) : null, X = w && typeof WX !== 'undefined' ? WX[w.k] : null;
  let say = ''; try { say = typeof toonSays === 'function' && typeof toonNeeds === 'function' ? toonSays(toonNeeds()) : ''; } catch (e) { say = ''; }
  return `<div class="hs-bar"><span>${W ? DAYS7[W.day] : 'Monday'} · ${['Morning', 'Afternoon', 'Evening'][W ? W.block : 0]}${X ? ` · ${X[0]} ${w.hi}° ${esc(X[1].toLowerCase())}` : ''}</span><span class="hs-now" id="av-cap">${esc(say)}</span></div>`; void _hb; }; }
// the creator shows the headshot large, with the full figure under it for clothes and shoes
{ const _vc = viewCreator; viewCreator = function () {
  const h = _vc.apply(this, arguments), c = UI.cc; if (!c || (c.look && c.look.style)) return h;
  return h.replace(/<div class="ccface"><div class="pf">[\s\S]*?<\/svg><\/div>/, `<div class="ccface"><div class="pf cc-shot">${hsBustSVG(c.look, c.age, 220)}<div class="cc-fig">${portraitSVG(c.look, c.age, 200, true, true)}</div></div>`);
}; }
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.home-scene.av-card{background:#0E0D14}
.ccface:has(.cc-shot){grid-template-columns:220px minmax(0,1fr)}
.cc-shot{display:flex;flex-direction:column;align-items:center;gap:8px}.cc-shot>svg{border-radius:16px;box-shadow:0 10px 26px -14px rgba(20,16,40,.6)}
.cc-fig{background:color-mix(in srgb,currentColor 5%,transparent);border-radius:12px;padding:6px 0;width:100%;display:flex;justify-content:center}
@media (max-width:560px){.ccface:has(.cc-shot){grid-template-columns:minmax(0,1fr)}.cc-shot{flex-direction:row;justify-content:center}}`; document.head.appendChild(st); })();
