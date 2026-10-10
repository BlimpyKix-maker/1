// ---------------- Living looks: everyone changes with the day they're having ----------------
// Faces and clothes follow what's actually going on. A cold week puts a scarf on you, and snow adds a beanie. A heatwave
// browns you a little. A shoot puts a lanyard round your neck. Burnout messes your hair; no sleep gives you bags; a busy
// month leaves you unshaven. Colds, flu, a sprain from a stunt, a kitchen cut, sunburn all show until they heal. At
// home: bed hair in the morning, pyjamas at night. Other people live too: crews on a shoot wear their passes, people
// in cold cities wrap up, someone always has a cold in January, and anyone who just won something is beaming.
// Drawing only reads state and hashRand; the ailments themselves are rolled once a week with prnd.

const AILMENTS = {
  cold: { label: 'A cold', icon: '🤧', weeks: [1, 2], energy: -6, d: 'Sniffles, a red nose, a box of tissues.' },
  flu: { label: 'Flu', icon: '🤒', weeks: [1, 2], energy: -16, stress: 5, d: 'Flat on your back. Pale, aching, miserable.' },
  sprain: { label: 'A sprained wrist', icon: '🩹', weeks: [2, 4], energy: -4, d: 'Strapped up. Typing hurts.' },
  cut: { label: 'A cut', icon: '🩹', weeks: [1, 1], energy: 0, d: 'A plaster on your face and a story about a door.' },
  burn: { label: 'Sunburn', icon: '🥵', weeks: [1, 1], energy: -2, d: 'Lobster-pink. You forgot the sun cream.' },
  hangover: { label: 'A hangover', icon: '🥴', weeks: [1, 1], energy: -8, d: 'Too many nights out. Sunglasses indoors.' }
};
function ailNow() { const M = S.me, a = M && M.ail; return a && a.until > S.week ? a : null; }
function livingWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done) return;
  const a = ailNow();
  if (a) { const A = AILMENTS[a.k]; M.energy = clamp(M.energy + A.energy, 0, 100); if (A.stress) M.stress = clamp(M.stress + A.stress, 0, 100); return; }
  if (M.ail && M.ail.until <= S.week) { M.ailLast = M.ail.k; M.ail = null; }
  const wx = typeof wxDay === 'function' ? wxDay(M.hub, S.week, 2) : { hi: 18, k: 'fair' }, cold = wx.hi <= 9 || wx.k === 'snow', hot = wx.hi >= 29;
  const outs = (M.cal || []).flat().filter(x => x === 'out').length;
  const job = M.jobs.find(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 2);
  const action = job && ['Action', 'Martial arts', 'Superhero', 'War', 'Western'].includes(S.films[job.film].genre) && (POST_BY[job.k] && (POST_BY[job.k].actor || /stunt|grip|camera|rigg/i.test(job.t)));
  const P0 = [
    ['cold', .015 + (cold ? .035 : 0) + (M.stress > 70 ? .015 : 0) + (M.energy < 25 ? .015 : 0)],
    ['flu', .003 + (cold ? .008 : 0) + (M.stress > 80 ? .006 : 0)],
    ['sprain', action ? .05 : .004],
    ['cut', .006],
    ['burn', hot && wx.k !== 'rain' ? .05 : 0],
    ['hangover', outs >= 3 ? .25 : outs === 2 ? .06 : 0]
  ];
  const r = prnd(); let acc = 0;
  for (const [k, p] of P0) { acc += p; if (r < acc) {
    const A = AILMENTS[k], w = A.weeks[0] + Math.floor(prnd() * (A.weeks[1] - A.weeks[0] + 1));
    M.ail = { k, w: S.week, until: S.week + w };
    M.energy = clamp(M.energy + A.energy, 0, 100);
    const why = { cold: cold ? 'The weather got to you.' : 'Someone on the bus coughed at you.', flu: 'It came out of nowhere.', sprain: action ? `A bad landing on ${S.films[job.film].title}.` : 'You fell off a kerb looking at your phone.', cut: 'A kitchen knife and a moment of optimism.', burn: 'One long afternoon in the sun.', hangover: 'Three nights out in one week will do that.' }[k];
    if (k === 'flu' || k === 'sprain') inbox('ail', `${A.icon} ${A.label}`, `${why} ${A.d}`, { choices: [{ k: 'care', label: `Look after yourself: soup, early nights, the doctor (${fmtCash(usd(k === 'sprain' ? 120 : 40))})` }, { k: 'push', label: 'Push through it' }], ailK: k });
    else diary(`${A.icon} ${A.label}. ${why}`);
    break;
  } }
}
function ailPick(it, k) {
  if (it.kind !== 'ail') return false; const M = S.me; it.done = true;
  if (k === 'care') { M.cash -= usd(it.ailK === 'sprain' ? 120 : 40); if (M.ail) M.ail.until = Math.max(S.week + 1, M.ail.until - 1); M.stress = clamp(M.stress - 3, 0, 100); it.result = { t: 'You do it properly. It clears up faster than it would have.' }; return true; }
  M.stress = clamp(M.stress + 4, 0, 100); if (M.ail && prnd() < .35) M.ail.until += 1; it.result = { t: 'You carry on as if nothing\'s wrong. Everyone can tell.' }; return true;
}
// what the day is like where someone is
let LIVING_CTX = null;   // { home: true, day } while the room is drawn
function livingWx(hub) { if (typeof wxDay !== 'function' || !HUBS[hub]) return null; const d = LIVING_CTX ? LIVING_CTX.day : (S.me && S.me.wk ? S.me.wk.day : 2); return wxDay(hub, S.week, clamp(d || 0, 0, 6)); }
function playerCond(L) {
  const M = S.me, me = ME(), C = {}, a = ailNow(), wx = livingWx(M.hub), home = LIVING_CTX && LIVING_CTX.home, day = LIVING_CTX ? LIVING_CTX.day : 2;
  if (M.energy < 30 || M.burnout) C.bags = M.energy < 15 ? 2 : 1;
  if (M.stress > 78 || M.burnout || (home && day === 0)) C.messy = 1;
  if (!L.facial) { const busy = (typeof jobDays === 'function' ? jobDays() : 0) >= 5; C.stubble = M.burnout ? 2 : (busy && M.stress > 55) || (home && day >= 5) ? 1 : 0; }
  if (a) { if (a.k === 'cold' || a.k === 'flu') C.nose = 1; if (a.k === 'flu') C.pale = 1; if (a.k === 'cut') C.plaster = 1; if (a.k === 'burn') C.burn = 1; if (a.k === 'sprain') C.wrap = 1; if (a.k === 'hangover') { C.bags = 2; C.pale = 1; } }
  const warmLife = ['beach'].includes(M.life) || (wx && wx.hi >= 27);
  if (!C.pale && warmLife && (S.week % 52 > 20 && S.week % 52 < 40 || (CLIMATE[M.hub] || [1, 15])[1] >= 24)) C.tan = 1;
  return C;
}
function npcCond(p, L) {
  const r = hashRand(p.id * 977 + S.week * 13 + 5), C = {}, wx = livingWx(p.hub);
  const shooting = !p.retired && !p.dead && p.busy >= S.week;
  if (shooting && r() < .35) C.bags = 1;
  if (!L.facial && p.g === 'M' && r() < .3) C.stubble = 1;
  if (wx && (wx.hi <= 8 || wx.k === 'snow') && r() < .25) C.nose = 1;
  if (wx && wx.hi >= 28 && r() < .3) C.tan = 1;
  if (r() < .01) C.plaster = 1;
  return C;
}
{ const _lo = lookOf;
  lookOf = function (p) {
    let L = _lo(p); if (!p || !S.me || p.dead) return L;
    L = Object.assign({}, L);
    if (p.player) {
      const M = S.me, home = LIVING_CTX && LIVING_CTX.home, day = LIVING_CTX ? LIVING_CTX.day : 2, wx = livingWx(M.hub);
      L._cond = playerCond(L);
      if (home && day >= 5) { L.outfit = 0; L.pattern = 3; L.head = 0; L.neck = 0; L.bag = 0; L.shoes = L.shoes; L._pj = 1; }   // pyjamas
      else if (!home) {
        if (wx && (wx.hi <= 9 || wx.k === 'snow') && !L.neck) L.neck = 1;
        if (wx && wx.k === 'snow' && !L.head) L.head = 2;
        if (wx && (wx.k === 'heat' || (wx.k === 'sun' && wx.hi >= 27)) && !L.glasses && !L.head) L.glasses = 7;
        if (M.jobs.some(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 2) && !L.neck) L.neck = 5;
      }
      if (ailNow() && ailNow().k === 'hangover' && !L.glasses) L.glasses = 7;
      if (ailNow() && ['flu', 'cold'].includes(ailNow().k) && !home && !L.neck) L.neck = 1;
      if (ailNow() && ['flu', 'hangover'].includes(ailNow().k)) L._mood = 'tired';
    } else {
      const wx = livingWx(p.hub), r = hashRand(p.id * 131 + S.week * 7 + 1);
      L._cond = npcCond(p, L);
      if (!p.retired && p.busy >= S.week && !L.neck && r() < .6) L.neck = 5;
      else if (wx && (wx.hi <= 8 || wx.k === 'snow') && !L.neck && r() < .7) L.neck = 1;
      if (wx && wx.k === 'snow' && !L.head && r() < .4) L.head = 2;
      if ((p.fame || 0) > 60 && wx && wx.k === 'sun' && !L.glasses && r() < .3) L.glasses = 7;
      const won = (p.awards || []).length && S.awards && S.awards.some(a => a.y === S.year && a.w && a.w.includes && a.w.includes(p.id));
      if (won || (p.credits || []).some(i => S.films[i] && S.films[i].rel !== null && S.week - S.films[i].rel < 4 && (S.films[i].reviews || 0) >= 80)) L._mood = 'buzzing';
      else if (p.busy >= S.week && r() < .2) L._mood = 'tired';
    }
    return L;
  };
}
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) { const was = LIVING_CTX; LIVING_CTX = { home: true, day: clamp(day ?? 0, 0, 5) }; try { return _hs(day); } finally { LIVING_CTX = was; } }; }
// ---- the overlays ----
function toonCondFace(C, cx, cy, ey, ex, rx, ry, skin, line, hc, bearded) {
  const o = [];
  if (C.stubble && !bearded) { const n = C.stubble === 2 ? 34 : 20, r = hashRand(17); for (let i = 0; i < n; i++) { const t = r() * Math.PI, rr = .72 + r() * .24; o.push(`<circle cx="${(cx + Math.cos(t) * rx * .62 * rr).toFixed(1)}" cy="${(ey + 12 + Math.sin(t) * (ry * .5) * rr).toFixed(1)}" r=".55" fill="${hc}" opacity="${C.stubble === 2 ? .7 : .45}"/>`); } }
  if (C.bags) for (const s of [-1, 1]) o.push(`<path d="M${cx + s * ex - 5} ${ey + 5} q5 ${C.bags === 2 ? 4 : 2.6} 10 0" stroke="${mixHex(skin, '#5A3A5E', .45)}" stroke-width="${C.bags === 2 ? 1.6 : 1.1}" fill="none" opacity=".7" stroke-linecap="round"/>`);
  if (C.nose) o.push(`<ellipse cx="${cx}" cy="${ey + 8}" rx="3.6" ry="2.6" fill="#E0505E" opacity=".55"/>`);
  if (C.burn) o.push(`<ellipse cx="${cx}" cy="${ey + 8}" rx="4" ry="2.6" fill="#FF5A4A" opacity=".45"/><ellipse cx="${cx - ex - 4}" cy="${ey + 9}" rx="7" ry="4" fill="#FF5A4A" opacity=".35"/><ellipse cx="${cx + ex + 4}" cy="${ey + 9}" rx="7" ry="4" fill="#FF5A4A" opacity=".35"/><path d="M${cx - rx * .5} ${cy - ry * .55} q${rx * .5} -4 ${rx} 0" stroke="#FF5A4A" stroke-width="3" opacity=".3" fill="none"/>`);
  if (C.plaster) o.push(`<g transform="translate(${cx + ex + 5} ${ey - 4}) rotate(-25)"><rect x="-6" y="-2.2" width="12" height="4.4" rx="2" fill="#F2C9A0" stroke="#C99A70" stroke-width=".5"/><rect x="-2" y="-2.2" width="4" height="4.4" fill="#E8B88A"/></g>`);
  return o.join('');
}
function toonCondHair(C, cx, cy, ry, hc) {
  return `<g stroke="${hc}" stroke-width="1.8" fill="none" stroke-linecap="round">${[[-14, -2, -22, -12], [-4, 0, -6, -14], [6, 0, 10, -13], [15, -2, 23, -10], [0, 1, 2, -11]].map(([x1, y1, x2, y2]) => `<path d="M${cx + x1} ${cy - ry + 4 + y1} Q${cx + (x1 + x2) / 2 + 3} ${cy - ry + y2 + 2} ${cx + x2} ${cy - ry + 4 + y2}"/>`).join('')}</g>`;
}
function toonCondBody(C, cx, neckY, bw) {
  const sh = bw / 2, ty = neckY + 4, wy = ty + 52;
  if (C.wrap) return `<g><path d="M${cx - sh + 2} ${ty + 4} L${cx + sh - 8} ${ty + 34}" stroke="#4A7FB5" stroke-width="5" stroke-linecap="round"/><rect x="${cx - 16}" y="${ty + 28}" width="${sh + 10}" height="11" rx="4" fill="#F2F2F2" stroke="#C9C9C9"/><path d="M${cx - 12} ${ty + 31} h${sh} M${cx - 12} ${ty + 35} h${sh}" stroke="#D9D9D9"/></g>`;
  return '';
}
// how you're doing today, in a line
function livingLine() {
  const M = S.me, a = ailNow(), C = playerCond(lookOf(ME())), wx = livingWx(M.hub), bits = [];
  if (a) bits.push(`${AILMENTS[a.k].icon} ${AILMENTS[a.k].label.toLowerCase()} (till ${fmtDate(a.until, true)})`);
  if (C.bags) bits.push('bags under your eyes');
  if (C.messy) bits.push('hair everywhere');
  if (C.stubble) bits.push(C.stubble === 2 ? 'a week of beard' : 'stubble');
  if (C.tan) bits.push('a bit of a tan');
  if (wx && (wx.hi <= 9 || wx.k === 'snow')) bits.push('scarf weather'); else if (wx && wx.hi >= 28) bits.push('too hot for this');
  return bits.length ? bits.join(' · ') : 'looking like yourself';
}
{ const _ts = toonSays; toonSays = function (N) { const a = ailNow(); if (a) return { cold: 'Ugh. *sniff*. Tissues?', flu: 'Everything hurts. Soup. Bed. Now.', sprain: 'Careful with the wrist!', cut: 'It\'s just a scratch. Mostly.', burn: 'Don\'t touch my shoulders. Ever.', hangover: 'Too bright. Why is it so bright.' }[a.k]; return _ts(N); }; }
