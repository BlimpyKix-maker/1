// ---------------- Toons: people with some life in them ----------------
// Everyone is drawn as a toon now: a big expressive head, eyes with light in them, a mouth that matches the mood,
// cheeks, freckles, face paint, and a body that strikes a pose. Your own face reacts to your week (stressed, tired,
// buzzing), a sidekick can ride along, an aura can shimmer round you, and the head bobs and the eyes blink where
// there's room for it (your desk and your room). Every old look still means what it meant: new options are appended,
// and "Classic" in the Style row brings back the old drawings.
// Drawn from the look alone (plus a stable hash for the little things NPCs never chose), so nothing here rolls dice.
LOOK.head.opts.push('Crown', 'Wizard hat', 'Propeller beanie', 'Bunny ears', 'Cat ears', 'Halo', 'Devil horns', 'Party hat', 'Chef\'s hat', 'Top hat');
LOOK.glasses.opts.push('Heart shades', 'Star shades', '3D glasses', 'Monocle');
LOOK.hair.opts.push('Pigtails', 'Big curls', 'Side shave', 'Wolf cut', 'Beehive', 'Long waves');
LOOK.hairColor.opts.push('#FF6FB5', '#6FC3FF', '#FFD23F', '#9BE564', '#FFFFFF');
Object.assign(LOOK, {
  style: { label: 'Style', opts: ['Toon', 'Classic'] },
  eyeShape: { label: 'Eyes', opts: ['Round', 'Sleepy', 'Sparkly', 'Wink', 'Cat-eye', 'Dots', 'Starry', 'Heavy-lidded'] },
  mouth: { label: 'Mouth', opts: ['Smile', 'Big grin', 'Smirk', 'Laughing', 'Cat mouth', 'Straight', 'Pout', 'Gap tooth'] },
  cheeks: { label: 'Cheeks', opts: ['Plain', 'Blush', 'Freckles', 'Freckles and blush', 'Rosy', 'Dimples'] },
  facePaint: { label: 'Face paint', opts: ['None', 'Star', 'Heart', 'Lightning', 'Glitter', 'Tear', 'Stripes'] },
  sidekick: { label: 'Sidekick', opts: ['None', 'Cat', 'Dog', 'Parrot', 'Frog', 'Tiny robot', 'Ghost', 'Duck', 'Hamster'] },
  aura: { label: 'Aura', opts: ['None', 'Sparkles', 'Hearts', 'Music notes', 'Stars', 'Flames', 'Bubbles', 'Film reel'] }
});
for (const k of ['style', 'eyeShape', 'mouth', 'cheeks', 'facePaint', 'sidekick', 'aura']) if (!LOOK_KEYS.includes(k)) LOOK_KEYS.push(k);
// how you look this week, if it's you
function toonMood(L) {
  if (L._mood) return L._mood;
  return 'calm';
}
function toonSVG(L, age, size, bare, fig) {
  const uid = 'tn' + (++PORTRAIT_UID), H = fig ? 240 : 120;
  const pr = hashRand(L.skin * 131 + L.hair * 17 + L.colour * 7 + L.face * 3 + L.outfit + L.eyes * 29 + 11);
  const pick = (k, n) => L[k] !== undefined && L[k] !== null ? L[k] : Math.floor(pr() * n);
  const eyeShape = L.eyeShape !== undefined ? L.eyeShape : [0, 0, 0, 1, 2, 4, 5, 7][Math.floor(pr() * 8)];
  const mouth0 = L.mouth !== undefined ? L.mouth : [0, 0, 1, 2, 5, 0, 4, 6][Math.floor(pr() * 8)];
  const cheeks = L.cheeks !== undefined ? L.cheeks : [0, 1, 0, 2, 1, 3][Math.floor(pr() * 6)];
  const mood = toonMood(L);
  const skin = LOOK.skin.opts[L.skin] || '#D19A72', skinD = mixHex(skin, '#000000', .16), skinL = mixHex(skin, '#FFFFFF', .2), line = mixHex(skin, '#000000', .5);
  const grey = clamp((age - 46) / 26, 0, .85), hc = mixHex(LOOK.hairColor.opts[L.hairColor] || '#3A2618', '#D9D6D0', grey), hcD = mixHex(hc, '#000000', .25);
  const cloth = LOOK.colour.opts[L.colour] || '#2C4F7C', clothD = mixHex(cloth, '#000000', .25), clothL = mixHex(cloth, '#FFFFFF', .2);
  const FT = L._fit || { mus: 0, mass: 0 };
  const shape = (L.face || 0) % 10;
  const cx = 60, cy = fig ? 48 : 54;
  const rx = [30, 33, 31, 27, 31, 30, 33, 28, 35, 26][shape] + FT.mass * .25, ry = [31, 29, 29, 34, 31, 32, 30, 32, 28, 34][shape];
  const o = [];
  // ---- defs: gradients and patterns ----
  const pat = L.pattern || 0;
  o.push(`<defs><radialGradient id="${uid}sk" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="${skinL}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${skinD}"/></radialGradient>
   <linearGradient id="${uid}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mixHex(cloth, '#FFFFFF', .78)}"/><stop offset="1" stop-color="${mixHex(cloth, '#FFFFFF', .55)}"/></linearGradient>
   <linearGradient id="${uid}cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${clothL}"/><stop offset="1" stop-color="${clothD}"/></linearGradient>
   <pattern id="${uid}pt" width="8" height="8" patternUnits="userSpaceOnUse">${[
    '', `<rect width="8" height="4" fill="${mixHex(cloth, '#fff', .35)}"/>`, `<rect width="4" height="4" fill="${mixHex(cloth, '#000', .2)}"/><rect x="4" y="4" width="4" height="4" fill="${mixHex(cloth, '#000', .2)}"/>`,
    `<circle cx="4" cy="4" r="1.6" fill="${mixHex(cloth, '#fff', .6)}"/>`, `<circle cx="3" cy="3" r="2" fill="#F28C9B"/><circle cx="3" cy="3" r=".8" fill="#FFE27A"/>`, `<circle cx="4" cy="4" r="3.5" fill="${mixHex(cloth, '#FF6FB5', .5)}" opacity=".5"/>`,
    `<circle cx="2" cy="3" r="1.5" fill="#3B2716"/><circle cx="6" cy="6" r="1.2" fill="#3B2716"/>`, `<rect x="3.6" width=".8" height="8" fill="${mixHex(cloth, '#fff', .5)}"/>`, `<circle cx="2" cy="2" r="2.5" fill="#4B5A2E"/><circle cx="6" cy="6" r="2.5" fill="#6B5A3A"/>`, `<path d="M4 1 L5 3.5 L7.5 3.6 L5.5 5 L6.3 7.5 L4 6 L1.7 7.5 L2.5 5 L.5 3.6 L3 3.5 Z" fill="#FFE27A"/>`][pat] || ''}</pattern></defs>`);
  // ---- backdrop and aura ----
  if (!bare) { o.push(`<rect width="120" height="${H}" rx="12" fill="url(#${uid}bg)"/>`); for (let i = 0; i < 7; i++) o.push(`<circle cx="${8 + pr() * 104}" cy="${8 + pr() * (H - 16)}" r="${1 + pr() * 2.5}" fill="#FFFFFF" opacity=".55"/>`); }
  const aura = L.aura || 0;
  if (aura) { const sym = ['', '✦', '♥', '♪', '★', '🔥', '◦', '🎞'][aura], col = ['', '#FFD23F', '#FF6FB5', '#6FC3FF', '#FFD23F', '#FF7A2F', '#9BE7FF', '#333'][aura]; o.push(`<g class="t-aura" fill="${col}" font-size="11" opacity=".9">${[[16, cy - 22], [100, cy - 26], [12, cy + 18], [106, cy + 12], [24, cy - 44], [94, cy + 36]].map(([x, y], i) => `<text x="${x}" y="${y}" style="animation-delay:${i * .4}s">${sym}</text>`).join('')}</g>`); }
  // ---- body ----
  const bw = [36, 38, 41, 45, 48, 52, 34, 36, 47, 44][(L.build || 0) % 10] + FT.mus * .8 + FT.mass * .6;
  if (fig) o.push(toonBody(L, uid, cx, cy + ry, bw, skin, skinD, cloth, clothD, pat, line));
  else {
    const sy = cy + ry - 4;
    o.push(`<rect x="${cx - 7}" y="${sy - 6}" width="14" height="14" fill="${skinD}"/>`);
    o.push(`<path d="M${cx - bw / 2 - 8} 122 Q${cx - bw / 2 - 4} ${sy + 6} ${cx - 12} ${sy + 2} L${cx + 12} ${sy + 2} Q${cx + bw / 2 + 4} ${sy + 6} ${cx + bw / 2 + 8} 122 Z" fill="url(#${uid}cl)"/>`);
    if (pat) o.push(`<path d="M${cx - bw / 2 - 8} 122 Q${cx - bw / 2 - 4} ${sy + 6} ${cx - 12} ${sy + 2} L${cx + 12} ${sy + 2} Q${cx + bw / 2 + 4} ${sy + 6} ${cx + bw / 2 + 8} 122 Z" fill="url(#${uid}pt)" opacity=".85"/>`);
    o.push(toonCollar(L.outfit || 0, cx, sy + 2, cloth, clothD));
  }
  // ---- the head (it bobs) ----
  o.push(`<g class="t-head">`);
  const hb = toonHair(L.hair || 0, cx, cy, rx, ry, hc, hcD, age, L.hairline === 1);
  o.push(hb[0]);
  // ears
  o.push(`<ellipse cx="${cx - rx + 1}" cy="${cy + 4}" rx="5" ry="6.5" fill="${skin}"/><ellipse cx="${cx + rx - 1}" cy="${cy + 4}" rx="5" ry="6.5" fill="${skin}"/>`);
  if (L.ears) { const ec = ['', '#E8D27A', '#E8D27A', '#C0C0C0', '#E6F4FF'][L.ears] || '#E8D27A'; o.push(L.ears === 2 ? `<circle cx="${cx - rx + 1}" cy="${cy + 12}" r="3.5" fill="none" stroke="${ec}" stroke-width="1.6"/><circle cx="${cx + rx - 1}" cy="${cy + 12}" r="3.5" fill="none" stroke="${ec}" stroke-width="1.6"/>` : `<circle cx="${cx - rx + 1}" cy="${cy + 9}" r="1.8" fill="${ec}"/><circle cx="${cx + rx - 1}" cy="${cy + 9}" r="1.8" fill="${ec}"/>`); }
  // face
  const chin = [0, 0, 3, 0, -4, -3, 0, 2, 0, 0][shape];
  o.push(`<path d="M${cx - rx} ${cy} Q${cx - rx} ${cy - ry} ${cx} ${cy - ry} Q${cx + rx} ${cy - ry} ${cx + rx} ${cy} Q${cx + rx - chin} ${cy + ry} ${cx} ${cy + ry} Q${cx - rx + chin} ${cy + ry} ${cx - rx} ${cy} Z" fill="url(#${uid}sk)"/>`);
  // cheeks, freckles, dimples
  const ey = cy + 3, ex = rx * .4;
  if (cheeks === 1 || cheeks === 3 || cheeks === 4 || mood === 'buzzing') o.push(`<ellipse cx="${cx - ex - 5}" cy="${ey + 10}" rx="6" ry="3.5" fill="#FF6F8E" opacity="${cheeks === 4 ? .55 : .35}"/><ellipse cx="${cx + ex + 5}" cy="${ey + 10}" rx="6" ry="3.5" fill="#FF6F8E" opacity="${cheeks === 4 ? .55 : .35}"/>`);
  if (cheeks === 2 || cheeks === 3 || L.mark === 3) for (const s of [-1, 1]) for (let i = 0; i < 4; i++) o.push(`<circle cx="${cx + s * (ex + 2 + (i % 2) * 4)}" cy="${ey + 7 + Math.floor(i / 2) * 3}" r=".8" fill="${mixHex(skin, '#5A2E12', .6)}"/>`);
  if (cheeks === 5) o.push(`<path d="M${cx - ex - 6} ${ey + 13} q1 2 2 0 M${cx + ex + 4} ${ey + 13} q1 2 2 0" stroke="${line}" stroke-width=".9" fill="none"/>`);
  // face paint
  const fp = L.facePaint || 0;
  if (fp) o.push([``, `<path d="M${cx + ex + 6} ${ey + 4} l1.5 3.4 3.6.3-2.8 2.3.9 3.5-3.2-1.9-3.2 1.9.9-3.5-2.8-2.3 3.6-.3z" fill="#FFD23F"/>`, `<path d="M${cx + ex + 7} ${ey + 11} c-2-3-6-1-3 2 l3 3 3-3c3-3-1-5-3-2z" fill="#FF4D79"/>`, `<path d="M${cx + ex + 6} ${ey + 3} l-3 6h3l-2 6 5-8h-3l2-4z" fill="#FFD23F" stroke="#E0A400" stroke-width=".5"/>`, [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${cx + ex + 2 + (i % 3) * 3}" cy="${ey + 8 + Math.floor(i / 3) * 3}" r=".9" fill="#B39DDB"/>`).join(''), `<path d="M${cx - ex} ${ey + 7} q-1.5 3 0 4.5 q1.5-1.5 0-4.5z" fill="#6FC3FF"/>`, `<path d="M${cx - rx + 6} ${ey + 4} l8 -2 M${cx - rx + 6} ${ey + 8} l8 -2 M${cx + rx - 6} ${ey + 4} l-8 -2 M${cx + rx - 6} ${ey + 8} l-8 -2" stroke="#E0457B" stroke-width="2" stroke-linecap="round"/>`][fp] || '');
  // eyes and brows (they blink)
  const iris = LOOK.eyes.opts[L.eyes] || '#3B2716';
  const eyeS = mood === 'tired' ? 1 : mood === 'buzzing' && eyeShape === 0 ? 2 : eyeShape;
  o.push(`<g class="t-eyes">${[-1, 1].map(s => toonEye(eyeS, cx + s * ex, ey, iris, line, skin, s)).join('')}</g>`);
  const bt = mood === 'stressed' ? [3, -1] : mood === 'tired' ? [0, 1] : [1, 0];
  o.push(`<path d="M${cx - ex - 6} ${ey - 9 + bt[1]} Q${cx - ex} ${ey - 12 - bt[0]} ${cx - ex + 6} ${ey - 9 - (mood === 'stressed' ? 2 : 0)}" stroke="${hcD}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${cx + ex - 6} ${ey - 9 - (mood === 'stressed' ? 2 : 0)} Q${cx + ex} ${ey - 12 - bt[0]} ${cx + ex + 6} ${ey - 9 + bt[1]}" stroke="${hcD}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  // nose and mouth
  o.push(`<path d="M${cx - 1.5} ${ey + 8} q1.5 1.6 3 0" stroke="${mixHex(skin, '#000', .3)}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
  const mouth = mood === 'stressed' ? 6 : mood === 'buzzing' ? 1 : mood === 'tired' ? 5 : mouth0;
  o.push(toonMouth(mouth, cx, ey + 15, line));
  if (L.mark === 1) o.push(`<circle cx="${cx + 3}" cy="${ey + 10}" r="1.6" fill="none" stroke="#C9A646" stroke-width="1"/>`);
  if (L.mark === 2) o.push(`<circle cx="${cx + 3}" cy="${ey + 9}" r=".9" fill="#E6E6E6"/>`);
  if (L.mark === 4) o.push(`<circle cx="${cx + ex + 6}" cy="${ey + 13}" r=".9" fill="#3A2416"/>`);
  if (mood === 'stressed') o.push(`<path d="M${cx + rx - 4} ${cy - 10} q3 5 0 7 q-3-2 0-7z" fill="#9BE7FF"/>`);
  if (mood === 'tired') o.push(`<text x="${cx + rx}" y="${cy - ry + 4}" font-size="9" fill="#555" font-weight="700">z</text><text x="${cx + rx + 6}" y="${cy - ry - 3}" font-size="7" fill="#555" font-weight="700">z</text>`);
  // facial hair
  if (L.facial) o.push(toonFacial(L.facial, cx, ey, rx, ry, cy, hc, hcD));
  // hair in front, then glasses, then hats
  o.push(hb[1]);
  if (L.glasses) o.push(toonGlasses(L.glasses, cx, ex, ey));
  if (L.head) o.push(toonHat(L.head, cx, cy, rx, ry, cloth, hc));
  o.push('</g>');
  // a neck piece on the bust
  if (!fig && L.neck) o.push(toonNeck(L.neck, cx, cy + ry + 2, cloth));
  // the sidekick
  if (L.sidekick) o.push(toonPet(L.sidekick, fig ? 96 : 98, fig ? 214 : 108));
  return `<svg class="portrait toon${fig ? ' figure' : ''}" viewBox="0 0 120 ${H}" width="${fig ? Math.round(size / 2) : size}" height="${size}" role="img" aria-label="${fig ? 'Full-length portrait' : 'Portrait'}">${o.join('')}</svg>`;
}
function toonEye(k, x, y, iris, line, skin, side) {
  const white = '#FFFFFF';
  switch (k) {
    case 1: return `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="5" fill="${white}"/><circle cx="${x}" cy="${y + .8}" r="3.6" fill="${iris}"/><circle cx="${x}" cy="${y + .8}" r="1.7" fill="#111"/><path d="M${x - 6} ${y - .5} Q${x} ${y - 6} ${x + 6} ${y - .5} L${x + 6} ${y - 5} L${x - 6} ${y - 5} Z" fill="${skin}"/><path d="M${x - 6} ${y - .5} Q${x} ${y - 2.5} ${x + 6} ${y - .5}" stroke="${line}" stroke-width="1.2" fill="none"/>`;
    case 2: return `<ellipse cx="${x}" cy="${y}" rx="6" ry="7" fill="${white}"/><circle cx="${x}" cy="${y + .5}" r="5" fill="${iris}"/><circle cx="${x}" cy="${y + .5}" r="2.4" fill="#111"/><circle cx="${x + 1.8}" cy="${y - 2}" r="1.9" fill="#fff"/><circle cx="${x - 1.6}" cy="${y + 2.4}" r="1" fill="#fff"/><path d="M${x + 4} ${y - 7} l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2z" fill="#FFE27A"/>`;
    case 3: return side > 0 ? `<path d="M${x - 5} ${y + 1} Q${x} ${y - 4} ${x + 5} ${y + 1}" stroke="${line}" stroke-width="2" fill="none" stroke-linecap="round"/>` : toonEye(0, x, y, iris, line, skin, side);
    case 4: return `<path d="M${x - 6} ${y + 1} Q${x} ${y - 6} ${x + 6} ${y} Q${x} ${y + 5} ${x - 6} ${y + 1} Z" fill="${white}"/><circle cx="${x}" cy="${y}" r="3.4" fill="${iris}"/><circle cx="${x}" cy="${y}" r="1.6" fill="#111"/><path d="M${x - 6} ${y + 1} Q${x} ${y - 6} ${x + 6} ${y} l${side * 3} -3" stroke="#151515" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    case 5: return `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3" fill="#151515"/><circle cx="${x + .8}" cy="${y - 1}" r=".8" fill="#fff"/>`;
    case 6: return `<ellipse cx="${x}" cy="${y}" rx="6" ry="6.5" fill="${white}"/><path d="M${x} ${y - 4.5} l1.3 3 3.2.2-2.5 2 .8 3.1-2.8-1.7-2.8 1.7.8-3.1-2.5-2 3.2-.2z" fill="${iris}"/><circle cx="${x + 2}" cy="${y - 2.5}" r="1.2" fill="#fff"/>`;
    case 7: return `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="5" fill="${white}"/><circle cx="${x}" cy="${y + 1}" r="3.8" fill="${iris}"/><circle cx="${x}" cy="${y + 1}" r="1.8" fill="#111"/><circle cx="${x + 1.3}" cy="${y - .2}" r="1" fill="#fff"/><path d="M${x - 6} ${y - 1} Q${x} ${y - 4} ${x + 6} ${y - 1} L${x + 6} ${y - 6} L${x - 6} ${y - 6} Z" fill="${mixHex(skin, '#000', .1)}"/><path d="M${x - 6} ${y - 1} Q${x} ${y - 4} ${x + 6} ${y - 1}" stroke="${line}" stroke-width="1.3" fill="none"/>`;
    default: return `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="6.4" fill="${white}"/><circle cx="${x}" cy="${y + .6}" r="4.2" fill="${iris}"/><circle cx="${x}" cy="${y + .6}" r="2" fill="#111"/><circle cx="${x + 1.5}" cy="${y - 1.2}" r="1.5" fill="#fff"/>`;
  }
}
function toonMouth(k, x, y, line) {
  switch (k) {
    case 1: return `<path d="M${x - 8} ${y - 2} Q${x} ${y + 9} ${x + 8} ${y - 2} Z" fill="#7A2230"/><path d="M${x - 6.5} ${y - 1.4} L${x + 6.5} ${y - 1.4} L${x + 5.5} ${y + 1} L${x - 5.5} ${y + 1} Z" fill="#fff"/>`;
    case 2: return `<path d="M${x - 5} ${y} Q${x + 1} ${y + 3} ${x + 6} ${y - 2}" stroke="${line}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    case 3: return `<ellipse cx="${x}" cy="${y + 1.5}" rx="6" ry="5" fill="#7A2230"/><ellipse cx="${x}" cy="${y + 4}" rx="3.5" ry="2" fill="#FF7A8A"/>`;
    case 4: return `<path d="M${x - 5} ${y} q2.5 3 5 0 q2.5 3 5 0" stroke="${line}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    case 5: return `<path d="M${x - 4} ${y + 1} L${x + 4} ${y + 1}" stroke="${line}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 6: return `<path d="M${x - 4} ${y + 2} Q${x} ${y - 2} ${x + 4} ${y + 2}" stroke="${line}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    case 7: return `<path d="M${x - 7} ${y - 1} Q${x} ${y + 7} ${x + 7} ${y - 1} Z" fill="#7A2230"/><rect x="${x - 3}" y="${y - 1}" width="2.6" height="3" fill="#fff"/><rect x="${x + .6}" y="${y - 1}" width="2.6" height="3" fill="#fff"/>`;
    default: return `<path d="M${x - 6} ${y - 1} Q${x} ${y + 5} ${x + 6} ${y - 1}" stroke="${line}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;
  }
}
// [behind the head, in front of it]
function toonHair(k, cx, cy, rx, ry, c, d, age, recedes) {
  const top = cy - ry, rec = recedes ? clamp((age - 32) / 30, 0, 1) * 8 : 0;
  const cap = (h = 10, w = 2) => `<path d="M${cx - rx - w} ${cy - 2} Q${cx - rx - w} ${top - h} ${cx} ${top - h - 2} Q${cx + rx + w} ${top - h} ${cx + rx + w} ${cy - 2} Q${cx + rx * .6} ${top + 6 + rec} ${cx} ${top + 8 + rec} Q${cx - rx * .6} ${top + 6 + rec} ${cx - rx - w} ${cy - 2} Z" fill="${c}"/>`;
  const fringe = `<path d="M${cx - rx + 2} ${cy - 8} Q${cx - rx * .5} ${top + 2} ${cx} ${top + 10 + rec} Q${cx + rx * .4} ${top + 2} ${cx + rx - 2} ${cy - 10} Q${cx + rx} ${top - 4} ${cx} ${top - 6} Q${cx - rx} ${top - 4} ${cx - rx + 2} ${cy - 8} Z" fill="${c}"/>`;
  const curl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const long = (len, w = 6) => `<path d="M${cx - rx - w} ${cy - 4} Q${cx - rx - w - 2} ${cy + len} ${cx - rx + 6} ${cy + len + 6} L${cx + rx - 6} ${cy + len + 6} Q${cx + rx + w + 2} ${cy + len} ${cx + rx + w} ${cy - 4} Q${cx + rx} ${top - 12} ${cx} ${top - 12} Q${cx - rx} ${top - 12} ${cx - rx - w} ${cy - 4} Z" fill="${c}"/>`;
  switch (k) {
    case 0: return ['', `<path d="M${cx - rx + 3} ${cy - 8} Q${cx} ${top - 3} ${cx + rx - 3} ${cy - 8}" stroke="${mixHex(c, '#ffffff', .5)}" stroke-width="2" opacity=".35" fill="none"/>`];
    case 1: return ['', `<path d="M${cx - rx + 1} ${cy - 6} Q${cx} ${top - 4} ${cx + rx - 1} ${cy - 6} Q${cx} ${top + 3} ${cx - rx + 1} ${cy - 6} Z" fill="${c}" opacity=".85"/>`];
    case 2: return ['', cap(6) + fringe];
    case 3: return ['', cap(8) + `<path d="M${cx - rx} ${cy - 8} Q${cx - rx * .3} ${top - 2} ${cx + rx} ${cy - 12} Q${cx + rx * .2} ${top + 4} ${cx - rx} ${cy - 8} Z" fill="${d}"/>`];
    case 4: return ['', cap(6) + `<path d="M${cx - 12} ${top + 4} Q${cx - 6} ${top - 22} ${cx + 18} ${top - 12} Q${cx + 4} ${top - 6} ${cx + 12} ${top + 6} Z" fill="${c}"/>`];
    case 5: return [[...Array(9)].map((_, i) => curl(cx - rx + i * rx / 4, top + 2 - Math.sin(i / 8 * Math.PI) * 10, 9)).join(''), [...Array(7)].map((_, i) => curl(cx - rx + 6 + i * rx / 3.4, top + 4, 6.5)).join('')];
    case 6: return [`<ellipse cx="${cx}" cy="${cy - 10}" rx="${rx + 16}" ry="${ry + 12}" fill="${c}"/>`, `<path d="M${cx - rx + 4} ${cy - 10} Q${cx} ${top - 2} ${cx + rx - 4} ${cy - 10}" stroke="${d}" stroke-width="3" fill="none" opacity=".4"/>`];
    case 7: return [`<path d="M${cx - rx - 6} ${cy - 6} Q${cx - rx - 8} ${cy + 22} ${cx - rx + 4} ${cy + 24} L${cx + rx - 4} ${cy + 24} Q${cx + rx + 8} ${cy + 22} ${cx + rx + 6} ${cy - 6} Z" fill="${c}"/>`, cap(10, 5) + `<path d="M${cx - rx} ${cy - 6} L${cx + rx} ${cy - 6} L${cx + rx} ${cy - 12} Q${cx} ${top - 4} ${cx - rx} ${cy - 12} Z" fill="${c}"/>`];
    case 8: return [long(40), cap(10, 5) + fringe];
    case 9: return [[-1, 1].map(s => [0, 1, 2, 3].map(i => `<rect x="${cx + s * (rx - 2 + i * 3) - 2}" y="${cy - 8}" width="5" height="${42 + i * 4}" rx="2.5" fill="${i % 2 ? c : d}"/>`).join('')).join(''), cap(10, 4) + [0, 1, 2, 3, 4].map(i => `<rect x="${cx - rx + 6 + i * rx / 2.6}" y="${top - 6}" width="5" height="14" rx="2.5" fill="${i % 2 ? c : d}"/>`).join('')];
    case 10: return [`<path d="M${cx + rx - 2} ${top + 4} Q${cx + rx + 22} ${cy - 4} ${cx + rx + 8} ${cy + 34} Q${cx + rx + 16} ${cy} ${cx + rx - 6} ${top + 12} Z" fill="${c}"/>`, cap(10, 3) + fringe];
    case 11: return [`<circle cx="${cx}" cy="${top - 10}" r="11" fill="${c}"/>`, cap(8, 3) + `<path d="M${cx - 9} ${top - 2} Q${cx} ${top - 6} ${cx + 9} ${top - 2}" stroke="${d}" stroke-width="2" fill="none"/>`];
    case 12: return ['', `<path d="M${cx - 6} ${top + 2} L${cx - 4} ${top - 22} L${cx} ${top - 16} L${cx + 3} ${top - 24} L${cx + 6} ${top + 2} Z" fill="${c}"/><path d="M${cx - rx + 2} ${cy - 6} Q${cx - rx + 4} ${top + 6} ${cx - 7} ${top + 2} M${cx + rx - 2} ${cy - 6} Q${cx + rx - 4} ${top + 6} ${cx + 7} ${top + 2}" stroke="${c}" stroke-width="2" opacity=".5" fill="none"/>`];
    case 13: return ['', cap(4, 1) + `<path d="M${cx - rx + 2} ${cy - 6} Q${cx - rx * .2} ${top + 14} ${cx + rx - 4} ${top + 4} Q${cx} ${top - 6} ${cx - rx + 2} ${cy - 6} Z" fill="${c}"/>`];
    case 14: return [[-1, 1].map(s => `<path d="M${cx + s * (rx - 2)} ${cy} Q${cx + s * (rx + 8)} ${cy + 22} ${cx + s * (rx - 2)} ${cy + 46}" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="7 2"/>`).join(''), cap(8, 3) + `<path d="M${cx} ${top - 8} L${cx} ${top + 8}" stroke="${d}" stroke-width="1.5"/>`];
    case 15: return [`<path d="M${cx - rx - 2} ${cy} Q${cx - rx} ${cy + 20} ${cx - rx + 8} ${cy + 22} L${cx + rx - 8} ${cy + 22} Q${cx + rx} ${cy + 20} ${cx + rx + 2} ${cy} Z" fill="${c}"/>`, cap(6, 2) + fringe];
    case 16: return [[-1, 1].map(s => `<circle cx="${cx + s * (rx - 6)}" cy="${top - 4}" r="10" fill="${c}"/><circle cx="${cx + s * (rx - 6)}" cy="${top - 4}" r="5" fill="${d}" opacity=".35"/>`).join(''), cap(6, 2) + fringe];
    case 17: return ['', cap(8, 3) + `<path d="M${cx - rx + 2} ${cy - 10} Q${cx} ${top - 12} ${cx + rx - 2} ${cy - 10}" stroke="${mixHex(c, '#fff', .45)}" stroke-width="2" fill="none" opacity=".6"/>`];
    case 18: return [[-1, 1].map(s => `<path d="M${cx + s * (rx + 2)} ${cy - 10} q${s * 14} 8 ${s * 10} 26" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="${cx + s * (rx + 1)}" cy="${cy - 10}" r="3" fill="#FF6FB5"/>`).join(''), cap(8, 3) + fringe];
    case 19: return [[...Array(12)].map((_, i) => curl(cx - rx - 6 + (i % 6) * (rx + 6) / 2.5, cy - 14 + Math.floor(i / 6) * 22 + (i % 2) * 4, 10)).join(''), [...Array(6)].map((_, i) => curl(cx - rx + 4 + i * rx / 2.6, top + 2, 7.5)).join('')];
    case 20: return ['', `<path d="M${cx - rx + 2} ${cy - 6} Q${cx - rx + 4} ${top + 4} ${cx - 2} ${top - 2} L${cx - 2} ${cy - 18} Z" fill="${c}" opacity=".5"/>` + `<path d="M${cx - 4} ${top - 6} Q${cx + rx + 6} ${top - 8} ${cx + rx + 4} ${cy + 8} Q${cx + rx * .4} ${top + 10} ${cx - 4} ${top + 8} Z" fill="${c}"/>`];
    case 21: return [long(18, 8), cap(12, 6) + `<path d="M${cx - rx} ${cy - 4} l6 -12 l5 9 l6 -11 l5 10 l6 -10 l5 12" stroke="${c}" stroke-width="5" fill="none" stroke-linejoin="round"/>`];
    case 22: return [`<ellipse cx="${cx}" cy="${top - 14}" rx="${rx - 4}" ry="20" fill="${c}"/>`, cap(8, 3) + `<path d="M${cx - rx + 8} ${top - 14} Q${cx} ${top - 30} ${cx + rx - 8} ${top - 14}" stroke="${d}" stroke-width="2" fill="none" opacity=".5"/>`];
    case 23: return [`<path d="M${cx - rx - 7} ${cy - 4} q-6 14 2 26 q-6 14 4 24 L${cx + rx - 1} ${cy + 46} q10 -10 4 -24 q8 -12 2 -26 Q${cx + rx} ${top - 12} ${cx} ${top - 12} Q${cx - rx} ${top - 12} ${cx - rx - 7} ${cy - 4} Z" fill="${c}"/>`, cap(10, 5) + fringe];
    default: return ['', cap(6) + fringe];
  }
}
function toonFacial(k, cx, ey, rx, ry, cy, c, d) {
  const chinY = cy + ry;
  switch (k) {
    case 1: return [...Array(14)].map((_, i) => `<circle cx="${cx - 14 + (i % 7) * 4.6}" cy="${ey + 16 + Math.floor(i / 7) * 5}" r=".6" fill="${d}" opacity=".6"/>`).join('');
    case 2: return `<path d="M${cx - 9} ${ey + 13} Q${cx} ${ey + 8} ${cx + 9} ${ey + 13} Q${cx} ${ey + 11} ${cx - 9} ${ey + 13} Z" fill="${c}"/>`;
    case 3: return `<path d="M${cx - 5} ${chinY - 7} Q${cx} ${chinY + 4} ${cx + 5} ${chinY - 7} Z" fill="${c}"/>`;
    case 4: return `<path d="M${cx - rx + 6} ${cy + 6} Q${cx - rx + 8} ${chinY + 2} ${cx} ${chinY + 3} Q${cx + rx - 8} ${chinY + 2} ${cx + rx - 6} ${cy + 6} Q${cx} ${ey + 22} ${cx - rx + 6} ${cy + 6} Z" fill="${c}" opacity=".85"/>`;
    case 5: return `<path d="M${cx - rx + 2} ${cy} Q${cx - rx + 2} ${chinY + 10} ${cx} ${chinY + 12} Q${cx + rx - 2} ${chinY + 10} ${cx + rx - 2} ${cy} Q${cx} ${ey + 20} ${cx - rx + 2} ${cy} Z" fill="${c}"/><path d="M${cx - 6} ${ey + 16} Q${cx} ${ey + 20} ${cx + 6} ${ey + 16}" stroke="#7A2230" stroke-width="1.6" fill="none"/>`;
    case 6: return `<rect x="${cx - rx + 1}" y="${cy - 4}" width="5" height="14" rx="2" fill="${c}"/><rect x="${cx + rx - 6}" y="${cy - 4}" width="5" height="14" rx="2" fill="${c}"/>`;
    case 7: return `<path d="M${cx - rx + 3} ${cy} Q${cx} ${chinY + 6} ${cx + rx - 3} ${cy}" stroke="${c}" stroke-width="3" fill="none"/>`;
    case 8: return `<path d="M${cx - 12} ${ey + 16} Q${cx - 8} ${ey + 8} ${cx} ${ey + 12} Q${cx + 8} ${ey + 8} ${cx + 12} ${ey + 16} Q${cx + 13} ${ey + 10} ${cx + 15} ${ey + 8}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${cx - 12} ${ey + 16} Q${cx - 13} ${ey + 10} ${cx - 15} ${ey + 8}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 9: return `<path d="M${cx - 2} ${ey + 21} L${cx + 2} ${ey + 21} L${cx} ${ey + 25} Z" fill="${c}"/>`;
    default: return '';
  }
}
function toonGlasses(g, cx, ex, ey) {
  const fr = g === 4 ? '#B9A06A' : '#252525';
  const L = (x, f = 'rgba(255,255,255,.15)') => ({
    1: `<circle cx="${x}" cy="${ey}" r="7" fill="${f}" stroke="${fr}" stroke-width="1.6"/>`, 2: `<rect x="${x - 7.5}" y="${ey - 6}" width="15" height="12" rx="2" fill="${f}" stroke="${fr}" stroke-width="1.6"/>`, 3: `<rect x="${x - 8}" y="${ey - 6.5}" width="16" height="13" rx="4" fill="${f}" stroke="${fr}" stroke-width="3"/>`,
    4: `<circle cx="${x}" cy="${ey}" r="6.5" fill="${f}" stroke="${fr}" stroke-width="1"/>`, 5: `<path d="M${x - 8} ${ey - 3} Q${x} ${ey - 9} ${x + 8} ${ey - 5} L${x + 6} ${ey + 5} L${x - 6} ${ey + 5} Z" fill="${f}" stroke="${fr}" stroke-width="1.8"/>`, 6: `<path d="M${x - 8} ${ey - 4} L${x + 8} ${ey - 4} L${x + 6} ${ey + 6} Q${x} ${ey + 8} ${x - 6} ${ey + 6} Z" fill="rgba(40,40,60,.75)" stroke="#C9A646" stroke-width="1"/>`,
    7: `<rect x="${x - 8}" y="${ey - 5}" width="16" height="10" rx="4" fill="#111" stroke="#111"/>`, 8: `<path d="M${x - 7} ${ey} L${x + 7} ${ey} Q${x + 7} ${ey + 6} ${x} ${ey + 6} Q${x - 7} ${ey + 6} ${x - 7} ${ey} Z" fill="${f}" stroke="${fr}" stroke-width="1.4"/>`, 9: `<rect x="${x - 7.5}" y="${ey - 5.5}" width="15" height="11" rx="3" fill="rgba(140,90,200,.45)" stroke="${fr}" stroke-width="1.4"/>`,
    10: `<path d="M${x} ${ey + 7} l-7 -7 a3.6 3.6 0 0 1 7 -4 a3.6 3.6 0 0 1 7 4 z" fill="#FF4D79" stroke="#B0003A" stroke-width="1"/>`, 11: `<path d="M${x} ${ey - 8} l2.3 5 5.4.5-4.1 3.6 1.3 5.3-4.9-2.9-4.9 2.9 1.3-5.3-4.1-3.6 5.4-.5z" fill="#FFD23F" stroke="#C99A00" stroke-width="1"/>`, 12: `<rect x="${x - 8}" y="${ey - 5}" width="16" height="10" fill="${x < 60 ? 'rgba(255,40,40,.6)' : 'rgba(40,160,255,.6)'}" stroke="#fff" stroke-width="1.5"/>`
  })[g] || '';
  if (g === 13) return `<circle cx="${cx + ex}" cy="${ey}" r="7" fill="rgba(255,255,255,.2)" stroke="#C9A646" stroke-width="1.8"/><path d="M${cx + ex + 6} ${ey + 4} q4 10 -2 22" stroke="#C9A646" stroke-width=".8" fill="none"/>`;
  return L(cx - ex) + L(cx + ex) + `<path d="M${cx - ex + 7} ${ey - 1} Q${cx} ${ey - 4} ${cx + ex - 7} ${ey - 1}" stroke="${fr}" stroke-width="1.5" fill="none"/>`;
}
function toonHat(h, cx, cy, rx, ry, cloth, hc) {
  const top = cy - ry;
  switch (h) {
    case 1: return `<path d="M${cx - rx - 2} ${top + 10} Q${cx - rx} ${top - 14} ${cx} ${top - 14} Q${cx + rx} ${top - 14} ${cx + rx + 2} ${top + 10} Z" fill="${cloth}"/><path d="M${cx - rx - 2} ${top + 10} L${cx + rx + 22} ${top + 12} Q${cx + rx + 10} ${top + 4} ${cx + rx - 4} ${top + 4}" fill="${mixHex(cloth, '#000', .25)}"/><circle cx="${cx}" cy="${top - 14}" r="2.5" fill="${mixHex(cloth, '#000', .3)}"/>`;
    case 2: return `<path d="M${cx - rx - 3} ${top + 12} Q${cx - rx} ${top - 20} ${cx} ${top - 20} Q${cx + rx} ${top - 20} ${cx + rx + 3} ${top + 12} Z" fill="${cloth}"/><rect x="${cx - rx - 4}" y="${top + 6}" width="${rx * 2 + 8}" height="9" rx="4" fill="${mixHex(cloth, '#000', .2)}"/><circle cx="${cx}" cy="${top - 22}" r="6" fill="${mixHex(cloth, '#fff', .5)}"/>`;
    case 3: return `<path d="M${cx - rx - 2} ${top + 8} Q${cx} ${top - 14} ${cx + rx + 2} ${top + 8} Z" fill="#C8553D"/>${[0, 1, 2, 3].map(i => `<circle cx="${cx - rx + 10 + i * rx / 2}" cy="${top + 2}" r="1.4" fill="#fff"/>`).join('')}<path d="M${cx + rx} ${top + 6} l10 6 l-4 -10z" fill="#C8553D"/>`;
    case 4: return `<ellipse cx="${cx}" cy="${top + 4}" rx="${rx + 16}" ry="6" fill="#4A3A2A"/><path d="M${cx - rx + 2} ${top + 4} Q${cx - rx + 4} ${top - 22} ${cx} ${top - 22} Q${cx + rx - 4} ${top - 22} ${cx + rx - 2} ${top + 4} Z" fill="#5C4632"/><rect x="${cx - rx + 2}" y="${top - 3}" width="${(rx - 2) * 2}" height="5" fill="#2A1E14"/>`;
    case 5: return `<path d="M${cx - rx - 6} ${cy} Q${cx - rx - 6} ${top - 16} ${cx} ${top - 16} Q${cx + rx + 6} ${top - 16} ${cx + rx + 6} ${cy}" stroke="#222" stroke-width="5" fill="none"/><rect x="${cx - rx - 11}" y="${cy - 8}" width="10" height="17" rx="4" fill="#E0457B"/><rect x="${cx + rx + 1}" y="${cy - 8}" width="10" height="17" rx="4" fill="#E0457B"/>`;
    case 6: return `<ellipse cx="${cx + 6}" cy="${top - 2}" rx="${rx + 6}" ry="10" fill="#7A2E2E" transform="rotate(-8 ${cx} ${top})"/><circle cx="${cx + 10}" cy="${top - 12}" r="2.5" fill="#7A2E2E"/>`;
    case 7: return `<rect x="${cx - rx - 2}" y="${top + 2}" width="${rx * 2 + 4}" height="7" rx="3.5" fill="${cloth}"/>`;
    case 8: return `<ellipse cx="${cx}" cy="${top + 2}" rx="${rx + 12}" ry="5" fill="#2E2A26"/><path d="M${cx - rx + 4} ${top + 2} Q${cx - rx + 6} ${top - 20} ${cx} ${top - 16} Q${cx + rx - 6} ${top - 20} ${cx + rx - 4} ${top + 2} Z" fill="#3A342E"/><rect x="${cx - rx + 4}" y="${top - 4}" width="${(rx - 4) * 2}" height="4" fill="#7A2E2E"/>`;
    case 9: return `<path d="M${cx - rx - 2} ${top + 10} Q${cx - rx} ${top - 12} ${cx} ${top - 12} Q${cx + rx} ${top - 12} ${cx + rx + 2} ${top + 10} Z" fill="#1E2A38"/><path d="M${cx - rx - 2} ${top + 10} L${cx - rx - 22} ${top + 14} Q${cx - rx - 8} ${top + 4} ${cx - rx + 6} ${top + 4}" fill="#151E28"/><text x="${cx}" y="${top + 3}" font-size="7" text-anchor="middle" fill="#fff" font-weight="700">DIR</text>`;
    case 10: return [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${cx - rx + 4 + i * (rx * 2 - 8) / 6}" cy="${top + 2 - Math.sin(i / 6 * Math.PI) * 6}" r="4.5" fill="${['#FF6FB5', '#FFD23F', '#9BE564', '#FF8A5B', '#B39DDB', '#FF6FB5', '#FFD23F'][i]}"/>`).join('');
    case 11: return `<path d="M${cx - rx - 8} ${top + 8} Q${cx} ${top + 2} ${cx + rx + 8} ${top + 8} L${cx + rx - 4} ${top - 10} Q${cx} ${top - 16} ${cx - rx + 4} ${top - 10} Z" fill="#C2A878"/>`;
    case 12: return `<path d="M${cx - rx - 14} ${top + 4} Q${cx} ${top + 12} ${cx + rx + 14} ${top + 4} Q${cx + rx + 6} ${top - 2} ${cx + rx - 4} ${top}" fill="#8B5A2B"/><path d="M${cx - rx + 4} ${top + 2} Q${cx - 6} ${top - 26} ${cx} ${top - 14} Q${cx + 6} ${top - 26} ${cx + rx - 4} ${top + 2} Z" fill="#9C6A3A"/>`;
    case 13: return `<path d="M${cx - rx - 2} ${top + 8} L${cx + rx + 18} ${top + 10} Q${cx + rx} ${top + 2} ${cx - rx} ${top + 2} Z" fill="#E0457B"/><rect x="${cx - rx}" y="${top + 1}" width="${rx * 2}" height="4" fill="#E0457B"/>`;
    case 14: return `<path d="M${cx - 18} ${top + 4} L${cx - 14} ${top - 16} L${cx - 6} ${top - 6} L${cx} ${top - 20} L${cx + 6} ${top - 6} L${cx + 14} ${top - 16} L${cx + 18} ${top + 4} Z" fill="#FFD23F" stroke="#C99A00" stroke-width="1"/><circle cx="${cx}" cy="${top - 2}" r="2.4" fill="#E0457B"/><circle cx="${cx - 10}" cy="${top}" r="1.8" fill="#6FC3FF"/><circle cx="${cx + 10}" cy="${top}" r="1.8" fill="#9BE564"/>`;
    case 15: return `<path d="M${cx - rx - 6} ${top + 6} L${cx + 8} ${top - 52} L${cx + rx + 6} ${top + 6} Z" fill="#4B2683"/><ellipse cx="${cx}" cy="${top + 6}" rx="${rx + 10}" ry="5" fill="#3A1D66"/>${[[cx - 4, top - 20], [cx + 6, top - 34], [cx - 8, top - 6]].map(([x, y]) => `<text x="${x}" y="${y}" font-size="7" fill="#FFD23F">★</text>`).join('')}`;
    case 16: return `<path d="M${cx - rx - 2} ${top + 10} Q${cx - rx} ${top - 12} ${cx} ${top - 12} Q${cx + rx} ${top - 12} ${cx + rx + 2} ${top + 10} Z" fill="#E63946"/><path d="M${cx - rx + 4} ${top + 2} Q${cx} ${top - 14} ${cx} ${top - 14} L${cx} ${top + 4} Z" fill="#FFD23F"/><path d="M${cx + rx - 4} ${top + 2} Q${cx} ${top - 14} ${cx} ${top - 14} L${cx} ${top + 4} Z" fill="#2F5BD3"/><rect x="${cx - 1}" y="${top - 20}" width="2" height="8" fill="#333"/><path d="M${cx - 12} ${top - 20} L${cx + 12} ${top - 20}" stroke="#E0457B" stroke-width="3" stroke-linecap="round" class="t-prop"/>`;
    case 17: return [-1, 1].map(s => `<ellipse cx="${cx + s * 12}" cy="${top - 18}" rx="6" ry="18" fill="#FFFFFF" stroke="#ddd"/><ellipse cx="${cx + s * 12}" cy="${top - 16}" rx="3" ry="12" fill="#FFB6C8"/>`).join('');
    case 18: return [-1, 1].map(s => `<path d="M${cx + s * (rx - 6)} ${top + 4} L${cx + s * (rx - 2)} ${top - 16} L${cx + s * (rx - 18)} ${top - 2} Z" fill="${hc}"/><path d="M${cx + s * (rx - 7)} ${top} L${cx + s * (rx - 4)} ${top - 10} L${cx + s * (rx - 14)} ${top - 1} Z" fill="#FFB6C8"/>`).join('');
    case 19: return `<ellipse cx="${cx}" cy="${top - 12}" rx="${rx - 4}" ry="5" fill="none" stroke="#FFD23F" stroke-width="3" class="t-halo"/>`;
    case 20: return [-1, 1].map(s => `<path d="M${cx + s * 14} ${top + 2} Q${cx + s * 20} ${top - 10} ${cx + s * 14} ${top - 18} Q${cx + s * 14} ${top - 8} ${cx + s * 8} ${top}" fill="#C0283C"/>`).join('');
    case 21: return `<path d="M${cx - 12} ${top + 2} L${cx + 4} ${top - 30} L${cx + 14} ${top + 2} Z" fill="#FF6FB5"/><path d="M${cx - 8} ${top - 6} L${cx + 11} ${top - 6} M${cx - 3} ${top - 16} L${cx + 8} ${top - 16}" stroke="#FFD23F" stroke-width="2.5"/><circle cx="${cx + 4}" cy="${top - 31}" r="3.5" fill="#FFD23F"/>`;
    case 22: return `<rect x="${cx - rx + 4}" y="${top - 6}" width="${(rx - 4) * 2}" height="12" fill="#fff" stroke="#ddd"/>${[0, 1, 2].map(i => `<circle cx="${cx - 12 + i * 12}" cy="${top - 12}" r="10" fill="#fff" stroke="#ddd"/>`).join('')}`;
    case 23: return `<ellipse cx="${cx}" cy="${top + 2}" rx="${rx + 10}" ry="5" fill="#151515"/><rect x="${cx - rx + 6}" y="${top - 30}" width="${(rx - 6) * 2}" height="32" fill="#1E1E1E"/><rect x="${cx - rx + 6}" y="${top - 6}" width="${(rx - 6) * 2}" height="5" fill="#7A2E2E"/>`;
    default: return '';
  }
}
function toonCollar(k, cx, y, cloth, d) {
  switch (k) {
    case 1: return `<path d="M${cx - 16} ${y + 2} Q${cx} ${y + 16} ${cx + 16} ${y + 2}" stroke="${d}" stroke-width="4" fill="none"/><path d="M${cx - 5} ${y + 10} l-1 14 M${cx + 5} ${y + 10} l1 14" stroke="#eee" stroke-width="1.5"/>`;
    case 5: return `<rect x="${cx - 12}" y="${y - 6}" width="24" height="12" rx="5" fill="${d}"/>`;
    case 7: case 8: case 9: return `<path d="M${cx - 12} ${y} L${cx} ${y + 18} L${cx + 12} ${y}" fill="#F3F1EC"/><path d="M${cx - 12} ${y} L${cx - 4} ${y + 26} L${cx - 14} ${y + 24} Z M${cx + 12} ${y} L${cx + 4} ${y + 26} L${cx + 14} ${y + 24} Z" fill="${d}"/>${k === 9 ? `<path d="M${cx} ${y + 6} l-3 4 3 16 3-16z" fill="#7A2E2E"/>` : ''}`;
    case 4: return `<path d="M${cx - 14} ${y} L${cx - 2} ${y + 22} L${cx - 18} ${y + 20} Z M${cx + 14} ${y} L${cx + 2} ${y + 22} L${cx + 18} ${y + 20} Z" fill="${d}"/>`;
    case 13: return `<path d="M${cx - 10} ${y} l4 6 l6 -3 l6 3 l4 -6" stroke="#111" stroke-width="2" fill="none"/><circle cx="${cx}" cy="${y + 16}" r="6" fill="#FFD23F"/>`;
    default: return `<path d="M${cx - 12} ${y} Q${cx} ${y + 10} ${cx + 12} ${y}" stroke="${d}" stroke-width="2.4" fill="none"/>`;
  }
}
function toonNeck(k, cx, y, cloth) {
  return ({ 1: `<path d="M${cx - 18} ${y + 2} Q${cx} ${y + 12} ${cx + 18} ${y + 2} L${cx + 8} ${y + 26} L${cx + 2} ${y + 12} Z" fill="#C8553D"/>`, 2: `<path d="M${cx - 12} ${y} Q${cx} ${y + 16} ${cx + 12} ${y}" stroke="#E8D27A" stroke-width="1.2" fill="none"/><circle cx="${cx}" cy="${y + 8}" r="2" fill="#E8D27A"/>`, 3: `<path d="M${cx - 13} ${y} Q${cx} ${y + 18} ${cx + 13} ${y}" stroke="#C9A646" stroke-width="2.5" fill="none" stroke-dasharray="2 1"/>`, 4: `<path d="M${cx - 9} ${y + 2} l9 4 9-4 0 8-9-4-9 4z" fill="#7A2E2E"/>`, 5: `<path d="M${cx - 12} ${y} L${cx} ${y + 26} L${cx + 12} ${y}" stroke="#2F5BD3" stroke-width="2" fill="none"/><rect x="${cx - 5}" y="${y + 24}" width="10" height="12" rx="1" fill="#fff" stroke="#2F5BD3"/>`, 6: `<path d="M${cx - 16} ${y} Q${cx} ${y + 10} ${cx + 16} ${y} L${cx + 4} ${y + 22} Z" fill="#B39DDB"/>`, 7: `<path d="M${cx - 10} ${y} Q${cx} ${y + 14} ${cx + 10} ${y}" stroke="#C9A646" stroke-width="1" fill="none"/><circle cx="${cx}" cy="${y + 8}" r="3" fill="#2EAD6B"/>` })[k] || '';
}
function toonPet(k, x, y) {
  const s = (b) => `<g class="t-pet" transform="translate(${x - 12} ${y - 22})">${b}</g>`;
  switch (k) {
    case 1: return s(`<ellipse cx="12" cy="17" rx="10" ry="7" fill="#F28C28"/><circle cx="12" cy="9" r="7" fill="#F28C28"/><path d="M6 5 l1-6 4 4z M18 5 l-1-6 -4 4z" fill="#F28C28"/><circle cx="9.5" cy="9" r="1.2" fill="#111"/><circle cx="14.5" cy="9" r="1.2" fill="#111"/><path d="M22 17 q6-2 4-9" stroke="#F28C28" stroke-width="3" fill="none"/>`);
    case 2: return s(`<ellipse cx="12" cy="17" rx="10" ry="7" fill="#C58B4D"/><circle cx="12" cy="9" r="7" fill="#C58B4D"/><ellipse cx="5" cy="9" rx="3" ry="6" fill="#8B5A2B"/><ellipse cx="19" cy="9" rx="3" ry="6" fill="#8B5A2B"/><circle cx="10" cy="9" r="1.2" fill="#111"/><circle cx="14" cy="9" r="1.2" fill="#111"/><ellipse cx="12" cy="12" rx="2" ry="1.4" fill="#111"/>`);
    case 3: return s(`<ellipse cx="12" cy="13" rx="7" ry="10" fill="#2EAD6B"/><circle cx="12" cy="6" r="6" fill="#E63946"/><path d="M16 6 l5 2 -5 2z" fill="#FFD23F"/><circle cx="13" cy="5" r="1.2" fill="#111"/><path d="M8 20 l-2 6 M14 20 l2 6" stroke="#2EAD6B" stroke-width="2"/>`);
    case 4: return s(`<ellipse cx="12" cy="16" rx="11" ry="7" fill="#6BBF59"/><circle cx="7" cy="9" r="4" fill="#6BBF59"/><circle cx="17" cy="9" r="4" fill="#6BBF59"/><circle cx="7" cy="9" r="2" fill="#fff"/><circle cx="17" cy="9" r="2" fill="#fff"/><circle cx="7" cy="9" r="1" fill="#111"/><circle cx="17" cy="9" r="1" fill="#111"/><path d="M7 17 q5 3 10 0" stroke="#2E6B22" stroke-width="1.2" fill="none"/>`);
    case 5: return s(`<rect x="3" y="8" width="18" height="15" rx="4" fill="#B5B0A6"/><rect x="6" y="11" width="12" height="6" rx="2" fill="#1E2A38"/><circle cx="9" cy="14" r="1.4" fill="#6FC3FF"/><circle cx="15" cy="14" r="1.4" fill="#6FC3FF"/><path d="M12 8 v-5" stroke="#555" stroke-width="1.2"/><circle cx="12" cy="2.5" r="1.8" fill="#E63946" class="t-blink2"/>`);
    case 6: return s(`<path d="M3 24 Q2 4 12 3 Q22 4 21 24 l-3 -3 -3 3 -3 -3 -3 3 -3 -3z" fill="#F7F7FF" stroke="#ddd"/><circle cx="9" cy="11" r="1.6" fill="#111"/><circle cx="15" cy="11" r="1.6" fill="#111"/><ellipse cx="12" cy="16" rx="2" ry="2.5" fill="#111"/>`);
    case 7: return s(`<ellipse cx="12" cy="17" rx="10" ry="7" fill="#FFE27A"/><circle cx="10" cy="8" r="6" fill="#FFE27A"/><path d="M3 9 l4 -1 0 3z" fill="#F28C28"/><circle cx="9" cy="7" r="1.1" fill="#111"/>`);
    case 8: return s(`<ellipse cx="12" cy="16" rx="10" ry="8" fill="#E3B27A"/><ellipse cx="12" cy="18" rx="6" ry="5" fill="#FFF3E0"/><circle cx="6" cy="9" r="3" fill="#E3B27A"/><circle cx="18" cy="9" r="3" fill="#E3B27A"/><circle cx="9" cy="13" r="1.2" fill="#111"/><circle cx="15" cy="13" r="1.2" fill="#111"/><circle cx="12" cy="15" r="1" fill="#FF6F8E"/>`);
    default: return '';
  }
}
// head to toe
function toonBody(L, uid, cx, neckY, bw, skin, skinD, cloth, clothD, pat, line) {
  const o = [], b = L.bottoms || 0, bc = (typeof FIG_COLOURS !== 'undefined' ? FIG_COLOURS : ['#2C4F7C'])[L.bottomColour || 0] || '#2C4F7C', bcD = mixHex(bc, '#000', .25), shoe = L.shoes || 0, pose = L.pose || 0;
  const sh = bw / 2, ty = neckY + 4, wy = ty + 52, legL = 54, fy = wy + legL;
  o.push(`<ellipse cx="${cx}" cy="${fy + 10}" rx="${sh + 6}" ry="4" fill="#000" opacity=".15"/>`);
  // legs
  const legs = (col) => `<path d="M${cx - sh + 6} ${wy} L${cx - 14} ${fy} L${cx - 3} ${fy} L${cx - 1} ${wy + 8} L${cx + 1} ${wy + 8} L${cx + 3} ${fy} L${cx + 14} ${fy} L${cx + sh - 6} ${wy} Z" fill="${col}"/>`;
  if (b === 3) o.push(legs(skin) + `<path d="M${cx - sh + 5} ${wy - 2} L${cx - 15} ${wy + 22} L${cx - 1} ${wy + 22} L${cx} ${wy + 8} L${cx + 1} ${wy + 22} L${cx + 15} ${wy + 22} L${cx + sh - 5} ${wy - 2} Z" fill="${bc}"/>`);
  else if (b === 4 || b === 5) o.push(legs(skin) + `<path d="M${cx - sh + 4} ${wy - 2} L${cx - sh - (b === 5 ? 6 : 2)} ${wy + (b === 5 ? 50 : 24)} L${cx + sh + (b === 5 ? 6 : 2)} ${wy + (b === 5 ? 50 : 24)} L${cx + sh - 4} ${wy - 2} Z" fill="${bc}"/>`);
  else if (b === 9) o.push(legs(mixHex(bc, '#000', .1)));
  else o.push(legs(bc) + `<path d="M${cx} ${wy + 8} L${cx} ${fy - 4}" stroke="${bcD}" stroke-width="1"/>`);
  // shoes
  const sc = ['#F2F2F2', '#E63946', '#4A3A2A', '#5C3A21', '#151515', '#C2A878', '#7A4A2A', '#151515', '#8B5A2B', '#FFB6C8'][shoe] || '#F2F2F2';
  o.push([-1, 1].map(s => `<path d="M${cx + s * 8.5 - 7} ${fy - 2} Q${cx + s * 8.5 - 8} ${fy + 8} ${cx + s * 8.5 + s * 9} ${fy + 8} Q${cx + s * 8.5 + s * 9} ${fy} ${cx + s * 8.5 + 6} ${fy - 2} Z" fill="${sc}" stroke="${mixHex(sc, '#000', .3)}" stroke-width=".8"/>`).join(''));
  // torso
  const torso = `<path d="M${cx - sh} ${ty + 6} Q${cx - sh} ${ty - 2} ${cx - 10} ${ty - 3} L${cx + 10} ${ty - 3} Q${cx + sh} ${ty - 2} ${cx + sh} ${ty + 6} L${cx + sh - 2} ${wy + 2} L${cx - sh + 2} ${wy + 2} Z"`;
  o.push(`<rect x="${cx - 6}" y="${neckY - 8}" width="12" height="12" fill="${skinD}"/>`);
  o.push(`${torso} fill="url(#${uid}cl)"/>`); if (pat) o.push(`${torso} fill="url(#${uid}pt)" opacity=".85"/>`);
  o.push(toonCollar(L.outfit || 0, cx, ty - 2, cloth, clothD));
  // arms by pose
  const arm = (s, d) => `<path d="${d}" stroke="${cloth}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="${skin}"/>`;
  const lx = cx - sh, rx2 = cx + sh;
  if (pose === 2) o.push(arm(-1, `M${lx + 3} ${ty + 4} Q${lx - 6} ${ty + 26} ${lx - 2} ${wy}`) + hand(lx - 2, wy + 3) + `<g class="t-wave">${arm(1, `M${rx2 - 3} ${ty + 4} Q${rx2 + 10} ${ty - 6} ${rx2 + 8} ${ty - 24}`)}${hand(rx2 + 8, ty - 27)}</g>`);
  else if (pose === 1) o.push(arm(-1, `M${lx + 3} ${ty + 4} Q${lx - 6} ${ty + 26} ${lx - 2} ${wy}`) + hand(lx - 2, wy + 3) + arm(1, `M${rx2 - 3} ${ty + 4} L${rx2 + 10} ${ty + 22} L${rx2 - 2} ${wy - 4}`) + hand(rx2 - 2, wy - 4));
  else if (pose === 3) o.push(arm(-1, `M${lx + 3} ${ty + 6} Q${lx - 2} ${ty + 22} ${cx + 8} ${ty + 24}`) + arm(1, `M${rx2 - 3} ${ty + 6} Q${rx2 + 2} ${ty + 26} ${cx - 8} ${ty + 22}`) + hand(cx + 9, ty + 24) + hand(cx - 9, ty + 22));
  else if (pose === 4) o.push(arm(-1, `M${lx + 3} ${ty + 4} Q${lx - 4} ${ty + 30} ${lx + 6} ${wy}`) + arm(1, `M${rx2 - 3} ${ty + 4} Q${rx2 + 4} ${ty + 30} ${rx2 - 6} ${wy}`));
  else o.push(arm(-1, `M${lx + 3} ${ty + 4} Q${lx - 6} ${ty + 26} ${lx - 3} ${wy + 2}`) + hand(lx - 3, wy + 5) + arm(1, `M${rx2 - 3} ${ty + 4} Q${rx2 + 6} ${ty + 26} ${rx2 + 3} ${wy + 2}`) + hand(rx2 + 3, wy + 5));
  // things you carry
  const bag = L.bag || 0;
  if (bag === 8) o.push(`<rect x="${rx2 - 1}" y="${wy - 8}" width="8" height="11" rx="2" fill="#fff" stroke="#8B5A2B"/><rect x="${rx2 - 1}" y="${wy - 6}" width="8" height="3" fill="#8B5A2B"/>`);
  if (bag === 7) o.push(`<rect x="${lx - 12}" y="${wy - 10}" width="12" height="16" fill="#FDFBF3" stroke="#ccc"/>`);
  if (bag === 1) o.push(`<path d="M${rx2 - 2} ${ty + 8} L${rx2 + 6} ${wy}" stroke="#C2A878" stroke-width="2"/><rect x="${rx2 - 2}" y="${wy - 2}" width="16" height="18" rx="2" fill="#E8DCC0"/>`);
  if (L.neck) o.push(toonNeck(L.neck, cx, ty - 2, cloth));
  if (L.tattoo === 1) o.push(`<path d="M${lx - 4} ${ty + 14} l3 4 M${lx - 5} ${ty + 22} l3 3" stroke="#2C4F7C" stroke-width="1.5"/>`);
  return o.join('');
}
// everyone gets the new look unless they chose Classic; your face shows your week
{ const _portrait = portraitSVG;
  portraitSVG = function (L, age, size = 96, bare = false, fig = false) {
    const LL = Object.assign(defaultLook(), migrateLook(Object.assign({}, L)));
    if (LL.style === 1) return _portrait(L, age, size, bare, fig);
    return toonSVG(LL, age, size, bare, fig);
  };
}
{ const _lookOf = lookOf;
  lookOf = function (p) {
    const L = _lookOf(p);
    if (p && p.player && S.me) { const M = S.me; L._mood = M.stress > 70 ? 'stressed' : M.energy < 22 ? 'tired' : (M.milestones || []).some(m => S.week - m.w <= 1 && ['prize', 'credit'].includes(m.kind)) ? 'buzzing' : 'calm'; }
    return L;
  };
}
