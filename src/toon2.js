// ---------------- Toons, part two: a body worth dressing, and a little life at home ----------------
// The full-length toon is redrawn: builds change the silhouette (slim, broad, curvy, muscular, petite, tall), a new
// Height choice sets the legs, every top is its own garment (a T-shirt shows forearms, a hoodie has a hood and a
// pocket, a blazer opens over a tee, a dress replaces the bottoms, tracksuit stripes, kimono wrap), every pair of
// shoes has its own shape (trainers with soles, high-tops, boots, heels, sandals, platforms, cowboy boots, fluffy
// slippers), and watches, tattoos and every bag are drawn. Both feet are always whole.
// At home the toon behaves like a little creature with needs: tired means naps and coffee, stressed means stretching
// and music, lonely means the phone; tap them and they tell you what they need. People in the room are only the
// people who'd really be there: the partner you live with (or one staying over) and, in a shared flat, a roommate,
// each with a name tag.

LOOK.height = { label: 'Height', opts: ['Average', 'Short', 'Tall'] };
if (!LOOK_KEYS.includes('height')) LOOK_KEYS.push('height');

toonBody = function (L, uid, cx, neckY, bw0, skin, skinD, cloth, clothD, pat, line) {
  const o = [], b = L.bottoms || 0, FC = typeof FIG_COLOURS !== 'undefined' ? FIG_COLOURS : ['#2C4F7C'], bc = FC[L.bottomColour || 0] || '#2C4F7C', bcD = mixHex(bc, '#000', .25), bcL = mixHex(bc, '#fff', .15);
  const build = (L.build || 0) % 10, out = L.outfit || 0, shoe = (L.shoes || 0) % 10, pose = L.pose || 0, ht = L.height || 0;
  const FT = L._fit || { mus: 0, mass: 0 };
  // silhouette: shoulders, waist and hips by build
  const S = [[18, 14, 15], [19, 15, 16], [20, 17, 18], [22, 20, 20], [24, 20, 20], [24, 24, 24], [17, 13, 15], [18, 13, 14], [25, 17, 18], [20, 15, 22]][build];
  const sh = S[0] + FT.mus * .35 + FT.mass * .2, wa = S[1] + FT.mass * .5, hip = S[2] + FT.mass * .3;
  const ty = neckY + 4, wy = ty + (build === 7 ? 54 : build === 6 ? 46 : 50), legL = ([54, 46, 60][ht] || 54) + (build === 7 ? 4 : build === 6 ? -4 : 0), fy = wy + legL;
  const lc = mixHex(skin, '#000', .35);
  o.push(`<ellipse cx="${cx}" cy="${fy + 9}" rx="${hip + 8}" ry="4" fill="#000" opacity=".16"/>`);
  // ---- legs and bottoms ----
  const isDress = out === 10, gap = 3;
  const leg = (s, w0, w1, col, len = legL) => `<path d="M${cx + s * gap} ${wy} L${cx + s * (gap + w0)} ${wy} L${cx + s * (gap + w1)} ${wy + len} L${cx + s * gap * .6} ${wy + len} Z" fill="${col}"/>`;
  const legsSkin = () => [-1, 1].map(s => leg(s, hip - 3, 6.5, skin)).join('');
  const lw = hip - 3;
  if (isDress) o.push(legsSkin());
  else switch (b) {
    case 3: o.push(legsSkin() + [-1, 1].map(s => leg(s, lw + 1, 8.5, bc, legL * .42)).join('') + `<path d="M${cx - hip} ${wy} L${cx + hip} ${wy}" stroke="${bcD}" stroke-width="2"/>`); break;   // shorts
    case 4: o.push(legsSkin() + `<path d="M${cx - hip} ${wy - 2} L${cx - hip - 4} ${wy + legL * .36} L${cx + hip + 4} ${wy + legL * .36} L${cx + hip} ${wy - 2} Z" fill="${bc}"/>`); break;   // mini skirt
    case 5: o.push(legsSkin() + `<path d="M${cx - hip} ${wy - 2} L${cx - hip - 10} ${fy - 6} Q${cx} ${fy - 2} ${cx + hip + 10} ${fy - 6} L${cx + hip} ${wy - 2} Z" fill="${bc}"/><path d="M${cx - 4} ${wy + 6} L${cx - 7} ${fy - 6} M${cx + 5} ${wy + 6} L${cx + 8} ${fy - 6}" stroke="${bcD}" stroke-width="1" opacity=".5"/>`); break;   // long skirt
    case 8: o.push([-1, 1].map(s => leg(s, lw, 11, bc)).join('')); break;   // wide-leg
    case 9: o.push([-1, 1].map(s => leg(s, lw - 1, 5.5, mixHex(bc, '#000', .15))).join('')); break;   // leggings
    case 1: o.push([-1, 1].map(s => leg(s, lw, 5.5, bc)).join('')); break;   // skinny
    default: o.push([-1, 1].map(s => leg(s, lw, 7, bc)).join(''));
      if (b === 0) o.push([-1, 1].map(s => `<path d="M${cx + s * (gap + 4)} ${wy + 4} L${cx + s * (gap + 4.5)} ${fy - 2}" stroke="${bcL}" stroke-width=".9" opacity=".7"/><rect x="${cx + s * (gap + 7) - (s < 0 ? 7 : 0)}" y="${fy - 5}" width="7" height="3" fill="${bcD}"/>`).join(''));
      if (b === 2 || b === 6) o.push([-1, 1].map(s => `<path d="M${cx + s * (gap + 5)} ${wy + 2} L${cx + s * (gap + 5)} ${fy - 1}" stroke="${bcD}" stroke-width="1"/>`).join(''));
      if (b === 7) o.push([-1, 1].map(s => `<rect x="${cx + s * (gap + lw - 4) - (s < 0 ? 0 : 6)}" y="${wy + legL * .45}" width="6" height="8" rx="1" fill="${bcD}"/>`).join(''));
  }
  // ---- shoes: drawn whole, toes pointing out ----
  const SC = ['#F2F2F2', '#E63946', '#4A3A2A', '#5C3A21', '#151515', '#C2A878', '#7A4A2A', '#151515', '#8B5A2B', '#FFB6C8'][shoe], SD = mixHex(SC, '#000', .35);
  const foot = s => { const x = cx + s * 8, t = s * 7, base = fy + (shoe === 7 ? 4 : 0);
    switch (shoe) {
      case 0: return `<path d="M${x - 7} ${fy - 3} L${x + 7} ${fy - 3} Q${x + 7 + t} ${fy} ${x + 6 + t} ${fy + 4} L${x - 7} ${fy + 4} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/><rect x="${Math.min(x - 7, x + 6 + t)}" y="${fy + 3}" width="${Math.abs(t) + 13}" height="2.4" rx="1" fill="#FFF"/><path d="M${x - 3} ${fy} l${s * 6} -1" stroke="#E63946" stroke-width="1.2"/>`;
      case 1: return `<path d="M${x - 7} ${fy - 9} L${x + 6} ${fy - 9} L${x + 7} ${fy - 2} Q${x + 7 + t} ${fy} ${x + 6 + t} ${fy + 4} L${x - 7} ${fy + 4} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/><rect x="${Math.min(x - 7, x + 6 + t)}" y="${fy + 3}" width="${Math.abs(t) + 13}" height="2.4" rx="1" fill="#FFF"/><circle cx="${x}" cy="${fy - 6}" r="1.6" fill="#FFF"/>`;
      case 2: case 8: return `<path d="M${x - 7} ${fy - 14} L${x + 6} ${fy - 14} L${x + 7} ${fy - 2} Q${x + 7 + t * (shoe === 8 ? 1.3 : 1)} ${fy + (shoe === 8 ? -1 : 0)} ${x + 6 + t * (shoe === 8 ? 1.4 : 1)} ${fy + 3} L${x - 7} ${fy + 4} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/>${shoe === 8 ? `<path d="M${x - 5} ${fy - 10} q${s * 5} 3 ${s * 9} 0" stroke="#E3C27A" stroke-width="1" fill="none"/><rect x="${x - 7}" y="${fy + 2}" width="4" height="3" fill="${SD}"/>` : `<rect x="${Math.min(x - 7, x + 6 + t)}" y="${fy + 2}" width="${Math.abs(t) + 13}" height="2.6" fill="${SD}"/>`}`;
      case 3: return `<path d="M${x - 7} ${fy - 2} Q${x} ${fy - 4} ${x + 7} ${fy - 2} Q${x + 7 + t} ${fy} ${x + 6 + t} ${fy + 3} L${x - 7} ${fy + 3} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/><path d="M${x - 2} ${fy - 2} l${s * 5} 0" stroke="#E3C27A" stroke-width="1.4"/>`;
      case 4: return `<path d="M${x - 6} ${fy - 3} L${x + 5} ${fy - 2} Q${x + 7 + t * 1.2} ${fy + 1} ${x + 8 + t * 1.3} ${fy + 3} L${x + 2} ${fy + 3} L${x - 3} ${fy} Z" fill="${SC}"/><path d="M${x - 5} ${fy} L${x - 6} ${fy + 5}" stroke="${SC}" stroke-width="1.8"/>`;
      case 5: return `<path d="M${x - 6} ${fy - 2} L${x + 6} ${fy - 2} Q${x + 7 + t} ${fy + 1} ${x + 6 + t} ${fy + 3} L${x - 6} ${fy + 3} Z" fill="${skin}"/><path d="M${x - 6} ${fy + 3} L${x + 6 + t} ${fy + 3}" stroke="${SD}" stroke-width="2"/><path d="M${x - 4} ${fy - 1} l${s * 8} 2 M${x - 4} ${fy + 2} l${s * 6} -3" stroke="${SC}" stroke-width="1.6"/>`;
      case 6: return `<path d="M${x - 7} ${fy - 3} L${x + 6} ${fy - 3} Q${x + 7 + t} ${fy} ${x + 6 + t} ${fy + 4} L${x - 7} ${fy + 4} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/>${[0, 1, 2].map(i => `<circle cx="${x + s * (2 + i * 2.5)}" cy="${fy}" r=".6" fill="${SD}"/>`).join('')}`;
      case 7: return `<path d="M${x - 7} ${fy - 12} L${x + 6} ${fy - 12} L${x + 7} ${fy - 2} Q${x + 7 + t} ${fy} ${x + 6 + t} ${fy + 2} L${x - 7} ${fy + 2} Z" fill="${SC}" stroke="${SD}" stroke-width=".7"/><rect x="${Math.min(x - 8, x + 6 + t)}" y="${fy + 2}" width="${Math.abs(t) + 15}" height="${base - fy + 4}" rx="1.5" fill="#333"/>`;
      default: return `<ellipse cx="${x + s * 2}" cy="${fy + 1}" rx="10" ry="5.5" fill="${SC}"/>${[-4, 0, 4].map(d => `<circle cx="${x + s * 2 + d}" cy="${fy - 3}" r="2.6" fill="${mixHex(SC, '#fff', .4)}"/>`).join('')}`;
    } };
  o.push(foot(-1) + foot(1));
  // ---- torso ----
  const torso = `<path d="M${cx - sh} ${ty + 6} Q${cx - sh} ${ty - 2} ${cx - 10} ${ty - 3} L${cx + 10} ${ty - 3} Q${cx + sh} ${ty - 2} ${cx + sh} ${ty + 6} Q${cx + wa + 1} ${ty + 26} ${cx + hip} ${wy + 3} L${cx - hip} ${wy + 3} Q${cx - wa - 1} ${ty + 26} ${cx - sh} ${ty + 6} Z"`;
  o.push(`<rect x="${cx - 6}" y="${neckY - 8}" width="12" height="12" fill="${skinD}"/>`);
  if (out === 1) o.push(`<path d="M${cx - 15} ${ty - 2} Q${cx} ${ty - 14} ${cx + 15} ${ty - 2} Q${cx} ${ty + 4} ${cx - 15} ${ty - 2} Z" fill="${clothD}"/>`);   // the hood, behind
  if (isDress) o.push(`<path d="M${cx - hip} ${wy} L${cx - hip - 12} ${wy + legL * .62} Q${cx} ${wy + legL * .7} ${cx + hip + 12} ${wy + legL * .62} L${cx + hip} ${wy} Z" fill="url(#${uid}cl)"/>${pat ? `<path d="M${cx - hip} ${wy} L${cx - hip - 12} ${wy + legL * .62} Q${cx} ${wy + legL * .7} ${cx + hip + 12} ${wy + legL * .62} L${cx + hip} ${wy} Z" fill="url(#${uid}pt)" opacity=".85"/>` : ''}`);
  o.push(`${torso} fill="url(#${uid}cl)"/>`); if (pat || out === 2) o.push(`${torso} fill="url(#${uid}pt)" opacity="${out === 2 && !pat ? .5 : .85}"/>`);
  if (out === 2 && !pat) o.push(`${torso} fill="none" stroke="${clothD}" stroke-width=".6"/>`);
  // garment details
  const det = {
    1: `<path d="M${cx - 10} ${wy - 14} Q${cx} ${wy - 10} ${cx + 10} ${wy - 14} L${cx + 9} ${wy - 4} L${cx - 9} ${wy - 4} Z" fill="${clothD}"/><path d="M${cx - 4} ${ty + 2} l-1 12 M${cx + 4} ${ty + 2} l1 12" stroke="#F3F1EC" stroke-width="1.2"/>`,
    3: `<path d="M${cx - sh + 3} ${ty + 4} L${cx - 2} ${ty + 30} M${cx + sh - 3} ${ty + 4} L${cx + 2} ${ty + 30}" stroke="${clothD}" stroke-width="1.2"/><rect x="${cx - sh + 6}" y="${ty + 12}" width="8" height="6" rx="1" fill="none" stroke="${clothD}"/><rect x="${cx + sh - 14}" y="${ty + 12}" width="8" height="6" rx="1" fill="none" stroke="${clothD}"/>`,
    4: `<path d="M${cx} ${ty} L${cx + 2} ${wy + 2}" stroke="#C9CCD6" stroke-width="1.4"/><path d="M${cx - 12} ${ty - 2} L${cx - 4} ${ty + 16} L${cx - 14} ${ty + 12} Z M${cx + 12} ${ty - 2} L${cx + 4} ${ty + 16} L${cx + 14} ${ty + 12} Z" fill="${clothD}"/>`,
    6: [0, 1, 2].map(i => `<path d="M${cx - hip + 2} ${wy - 2 - i * 2} L${cx + hip - 2} ${wy - 2 - i * 2}" stroke="${clothD}" stroke-width=".8"/>`).join(''),
    7: [0, 1, 2, 3].map(i => `<circle cx="${cx}" cy="${ty + 6 + i * 10}" r="1.1" fill="${clothD}"/>`).join(''),
    8: `<path d="M${cx - 9} ${ty - 2} L${cx - 1} ${wy - 8} L${cx + 1} ${wy - 8} L${cx + 9} ${ty - 2} Z" fill="#F3F1EC"/><path d="M${cx - 10} ${ty - 2} L${cx - 2} ${ty + 20} L${cx - 12} ${ty + 12} Z M${cx + 10} ${ty - 2} L${cx + 2} ${ty + 20} L${cx + 12} ${ty + 12} Z" fill="${clothD}"/><circle cx="${cx}" cy="${wy - 10}" r="1.4" fill="${clothD}"/>`,
    9: `<path d="M${cx} ${ty} L${cx - 3} ${ty + 6} L${cx} ${ty + 30} L${cx + 3} ${ty + 6} Z" fill="#7A2E2E"/>`,
    11: [-1, 1].map(s => `<path d="M${cx + s * (sh - 1)} ${ty + 6} L${cx + s * (hip - 1)} ${wy}" stroke="#F3F1EC" stroke-width="1.6"/>`).join('') + `<path d="M${cx} ${ty} L${cx} ${wy}" stroke="${clothD}" stroke-width="1"/>`,
    12: `<path d="M${cx - 12} ${ty - 2} L${cx + 8} ${wy - 4} M${cx + 12} ${ty - 2} L${cx - 2} ${ty + 22}" stroke="${clothD}" stroke-width="2.4"/><rect x="${cx - hip}" y="${wy - 10}" width="${hip * 2}" height="5" fill="${clothD}"/>`,
    13: `<circle cx="${cx}" cy="${ty + 18}" r="7" fill="#111"/><path d="M${cx - 4} ${ty + 18} l3 -4 l2 6 l3 -4" stroke="#FFD23F" stroke-width="1.4" fill="none"/>`
  }[out];
  if (det) o.push(det);
  o.push(toonCollar(out, cx, ty - 2, cloth, clothD));
  // ---- arms: sleeves in cloth, forearms in skin for short sleeves ----
  const shortSl = out === 0 || out === 13 || out === 10;
  const lx = cx - sh, rx = cx + sh;
  const armSeg = (pts, col, w) => `<path d="M${pts[0][0]} ${pts[0][1]} Q${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const arm = (s, P0, P1, P2) => { const mid = [(P0[0] + P2[0]) / 2 + (P1[0] - (P0[0] + P2[0]) / 2) * .5, (P0[1] + P2[1]) / 2 + (P1[1] - (P0[1] + P2[1]) / 2) * .5];
    return shortSl ? armSeg([P0, [(P0[0] + mid[0]) / 2, (P0[1] + mid[1]) / 2], mid], cloth, 10) + armSeg([mid, [(mid[0] + P2[0]) / 2 + (P1[0] - mid[0]) * .2, (mid[1] + P2[1]) / 2], P2], skin, 7) : armSeg([P0, P1, P2], cloth, 10); };
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${skin}"/>`;
  let wristL = null;
  if (pose === 2) { o.push(arm(-1, [lx + 3, ty + 4], [lx - 6, ty + 26], [lx - 2, wy]) + hand(lx - 2, wy + 3) + `<g class="t-wave">${arm(1, [rx - 3, ty + 4], [rx + 10, ty - 6], [rx + 8, ty - 24])}${hand(rx + 8, ty - 27)}</g>`); wristL = [lx - 2, wy - 2]; }
  else if (pose === 1) { o.push(arm(-1, [lx + 3, ty + 4], [lx - 6, ty + 26], [lx - 2, wy]) + hand(lx - 2, wy + 3) + arm(1, [rx - 3, ty + 4], [rx + 12, ty + 22], [rx - 2, wy - 4]) + hand(rx - 2, wy - 4)); wristL = [lx - 2, wy - 2]; }
  else if (pose === 3) { o.push(arm(-1, [lx + 3, ty + 6], [lx - 2, ty + 22], [cx + 8, ty + 24]) + arm(1, [rx - 3, ty + 6], [rx + 2, ty + 26], [cx - 8, ty + 22]) + hand(cx + 9, ty + 24) + hand(cx - 9, ty + 22)); }
  else if (pose === 4) { o.push(arm(-1, [lx + 3, ty + 4], [lx - 4, ty + 30], [lx + 6, wy]) + arm(1, [rx - 3, ty + 4], [rx + 4, ty + 30], [rx - 6, wy])); }
  else { o.push(arm(-1, [lx + 3, ty + 4], [lx - 6, ty + 26], [lx - 3, wy + 2]) + hand(lx - 3, wy + 5) + arm(1, [rx - 3, ty + 4], [rx + 6, ty + 26], [rx + 3, wy + 2]) + hand(rx + 3, wy + 5)); wristL = [lx - 3, wy - 1]; }
  // watch and bracelets on the left wrist, tattoos on the arm
  const wr = L.wrist || 0;
  if (wristL && wr) o.push(wr === 2 ? `<path d="M${wristL[0] - 4} ${wristL[1]} l8 0" stroke="#E3C27A" stroke-width="1.6"/>` : `<rect x="${wristL[0] - 4}" y="${wristL[1] - 2}" width="8" height="4" rx="1" fill="${wr === 3 ? '#C9A646' : '#222'}"/><circle cx="${wristL[0]}" cy="${wristL[1]}" r="1.4" fill="${wr === 4 ? '#6FC3FF' : '#F3F1EC'}"/>`);
  const tat = L.tattoo || 0;
  if (tat === 1 && shortSl) o.push(`<path d="M${lx - 4} ${ty + 16} q3 4 0 8 q-3 4 0 8" stroke="#2C4F7C" stroke-width="1.6" fill="none"/>`);
  if (tat === 2 && wristL) o.push(`<path d="M${wristL[0] - 2} ${wristL[1] - 5} l4 0" stroke="#2C4F7C" stroke-width="1.2"/>`);
  if (tat === 4 && (isDress || [3, 4, 5].includes(b))) o.push(`<circle cx="${cx - 9}" cy="${fy - 7}" r="1.4" fill="#2C4F7C"/>`);
  // ---- things you carry ----
  const bag = L.bag || 0;
  const bags = {
    1: `<path d="M${rx - 2} ${ty + 8} L${rx + 6} ${wy}" stroke="#C2A878" stroke-width="2"/><rect x="${rx - 2}" y="${wy - 2}" width="16" height="18" rx="2" fill="#E8DCC0"/><path d="M${rx + 2} ${wy + 6} h8" stroke="#C2A878"/>`,
    2: `<path d="M${cx - 10} ${ty} L${cx - 12} ${wy - 4} M${cx + 10} ${ty} L${cx + 12} ${wy - 4}" stroke="#2E5A3A" stroke-width="2.4"/>`,
    3: `<path d="M${lx + 2} ${ty + 2} L${rx + 2} ${wy - 6}" stroke="#333" stroke-width="2"/><rect x="${rx - 4}" y="${wy - 10}" width="14" height="11" rx="2" fill="#333"/><circle cx="${rx + 3}" cy="${wy - 5}" r="3" fill="#555"/>`,
    4: `<path d="M${rx - 2} ${ty + 2} L${lx + 2} ${wy - 6}" stroke="#7A4A2A" stroke-width="2.4"/><rect x="${lx - 12}" y="${wy - 10}" width="16" height="12" rx="2" fill="#8B5A2B"/>`,
    5: `<rect x="${rx - 3}" y="${wy - 6}" width="12" height="7" rx="2" fill="#E0457B"/>`,
    6: `<path d="M${rx + 4} ${ty - 4} L${rx + 14} ${fy - 4}" stroke="#2B2B2B" stroke-width="9" stroke-linecap="round"/><ellipse cx="${rx + 13}" cy="${fy - 14}" rx="7" ry="9" fill="#2B2B2B"/>`,
    7: `<rect x="${lx - 12}" y="${wy - 10}" width="12" height="16" fill="#FDFBF3" stroke="#ccc"/><path d="M${lx - 10} ${wy - 6} h8 M${lx - 10} ${wy - 3} h6" stroke="#999" stroke-width=".7"/>`,
    8: `<rect x="${rx - 1}" y="${wy - 8}" width="8" height="11" rx="2" fill="#fff" stroke="#8B5A2B"/><rect x="${rx - 1}" y="${wy - 6}" width="8" height="3" fill="#8B5A2B"/>`,
    9: `<circle cx="${rx + 4}" cy="${wy - 2}" r="7" fill="#9AA0A6"/><circle cx="${rx + 4}" cy="${wy - 2}" r="2" fill="#555"/>`
  };
  if (bag === 2) o.unshift(`<rect x="${cx - 14}" y="${ty + 6}" width="28" height="32" rx="6" fill="#2E5A3A"/>`);
  if (bags[bag]) o.push(bags[bag]);
  if (L.neck) o.push(toonNeck(L.neck, cx, ty - 2, cloth));
  return o.join('');
};

// ---- who is in your room ----
roomVisitor = function () {
  const M = S.me, me = ME(); if (!M || !me || M.life === 'couch') return null;
  const r = hashRand((S.week * 2654435761 ^ (me.id * 97 + 13)) >>> 0), pid = typeof partnerOf === 'function' ? partnerOf() : null;
  if (pid !== null && pid !== undefined && S.people[pid] && !S.people[pid].dead) {
    if (M.cohab === pid) return { p: S.people[pid], why: 'home', r };
    if (r() < .3) return { p: S.people[pid], why: 'partner', r };
  }
  if (M.life === 'shared' && M.roomie !== undefined && M.roomie !== null && S.people[M.roomie] && !S.people[M.roomie].dead && r() < .6) return { p: S.people[M.roomie], why: 'roomie', r };
  return null;
};
// a roommate, named, when you move into a shared flat (and gone when you move out)
function roomieWeek() {
  const M = S.me; if (!M.party || !M.party.done) return;
  if (M.life !== 'shared') { if (M.roomie !== undefined && M.roomie !== null) { M.roomie = null; } return; }
  if (M.roomie !== undefined && M.roomie !== null && S.people[M.roomie] && !S.people[M.roomie].dead) return;
  const q = typeof youngNPC === 'function' ? youngNPC(M.hub, ['writer', 'actor', 'editor', 'composer', 'designer', 'ad'][Math.floor(prnd() * 6)]) : null;
  if (!q) return; M.roomie = q.id; meet(q.id, 'Your roommate', 6);
  sms(q.id, pickLine(['hi! I\'m the new roommate. I labelled my milk. it\'s a whole system', 'hey roomie. the shower makes a noise, ignore it', 'moved in! I make too much pasta, you\'re welcome to it'], S.week), 'text');
}
{ const _rv = roomVisitorSVG;
  roomVisitorSVG = function (acts, life, night) {
    const V = roomVisitor(); if (!V) return '';
    const h = _rv(acts, life, night); if (!h) return '';
    const tag = V.why === 'home' ? 'lives here' : V.why === 'partner' ? 'staying over' : 'your roommate';
    const m = h.match(/<g transform="translate\((\d+) 54\)">/), x = m ? +m[1] + 30.5 : 200;
    return h.replace(/<\/g>$/, `<g class="vtag"><rect x="${x - 34}" y="166" width="68" height="12" rx="6" fill="#000" opacity=".55"/><text x="${x}" y="174.5" font-size="7" text-anchor="middle" fill="#fff" font-family="sans-serif">${esc(V.p.name.split(' ')[0])} · ${tag}</text></g></g>`);
  };
}
// ---- the little creature: needs that steer what the toon does at home, and what they say when you tap them ----
function toonNeeds() {
  const M = S.me, me = ME(), k = Object.keys(M.known || {}).filter(id => S.week - ((M.known[id] || {}).seen ?? (M.known[id] || {}).met ?? -99) <= 2).length;
  return { energy: Math.round(M.energy), calm: Math.round(100 - M.stress), social: clamp(k * 18, 0, 100), fun: clamp(100 - (M.grind || 0) * 8, 0, 100) };
}
function toonSays(N) {
  const low = Object.entries(N).sort((a, b) => a[1] - b[1])[0];
  if (low[1] >= 60) return pickLine(['I\'m good! Let\'s make something.', 'Feeling great today.', 'Life\'s pretty good, actually.'], S.week);
  return { energy: ['So tired. A nap? Or coffee. Both?', 'I need a proper night\'s sleep.'], calm: ['Everything is a lot right now. Music, maybe.', 'I need a walk. Or a scream into a pillow.'], social: ['I haven\'t seen anyone in ages. Text someone?', 'A night out would do me good.'], fun: ['All work. When did I last have fun?', 'Can we do something that isn\'t work?'] }[low[0]][S.week % 2];
}
{ const _hs = homeSceneSVG;
  homeSceneSVG = function (day) {
    let s = _hs(day); const N = toonNeeds();
    const meter = (x, icon, v, col) => `<g transform="translate(${x} 6)"><rect width="46" height="12" rx="6" fill="#000" opacity=".45"/><text x="7" y="9.2" font-size="8" text-anchor="middle">${icon}</text><rect x="13" y="4" width="29" height="4" rx="2" fill="#FFFFFF" opacity=".25"/><rect x="13" y="4" width="${Math.max(1, 29 * v / 100)}" height="4" rx="2" fill="${v < 30 ? '#FF6B6B' : v < 60 ? '#FFD23F' : col}"/></g>`;
    const hud = `<g class="needs">${meter(6, '⚡', N.energy, '#7EE081')}${meter(56, '😌', N.calm, '#7EE081')}${meter(106, '💬', N.social, '#7EE081')}${meter(156, '🎈', N.fun, '#7EE081')}</g>`;
    s = s.replace(/(<g class="me-walk" data-acts=')/, `<g class="me-say" opacity="${typeof UI !== 'undefined' && UI.toonSay > Date.now() ? 1 : 0}"><rect x="150" y="18" width="120" height="22" rx="11" fill="#fff" stroke="#0002"/><path d="M200 40 l4 6 l4 -6 z" fill="#fff"/><text x="210" y="32.5" font-size="7.5" text-anchor="middle" fill="#333" font-family="sans-serif">${esc(toonSays(N))}</text></g>$1`);
    s = s.replace('<g class="me-walk" ', `<g class="me-walk" data-needs='${JSON.stringify(N)}' `);
    return s.replace(/<\/svg>$/, hud + '</svg>');
  };
}
// tap the toon: they say what they need, and do a little hop
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', e => {
  const g = e.target && e.target.closest && e.target.closest('svg.home-scene .me-walk'); if (!g) return;
  UI.toonSay = Date.now() + 3500; setTimeout(() => { const s2 = document.querySelector('svg.home-scene .me-say'); if (s2 && UI.toonSay <= Date.now()) s2.setAttribute('opacity', '0'); }, 3600);
  const sv = g.closest('svg'), say = sv && sv.querySelector('.me-say'); if (say) { say.setAttribute('opacity', '1'); clearTimeout(say._t); say._t = setTimeout(() => say.setAttribute('opacity', '0'), 3500); }
  g.classList.remove('hop'); void g.getBBox(); g.classList.add('hop');
});
// needs pick the activity: tired → nap/coffee, stressed → music/stretch, lonely → phone, bored → dance/game
const NEED_ACTS = { energy: ['nap', 'coffee', 'read'], calm: ['music', 'stretch', 'water', 'dream'], social: ['phone', 'lines'], fun: ['dance', 'game', 'pet', 'camera'] };
