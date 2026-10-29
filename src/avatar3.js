// ================= The avatar moves through the room (Round 28) =================
// Before, the figure slid left and right along one line in a single standing pose, and "reading in bed" meant
// standing in front of the bed. Now:
//  - it walks: six frames of a real stride (the swinging leg lifts and passes, the arms swing against the legs, the
//    body rises at the passing step), stepped in time with the distance covered, facing the way it goes;
//  - it goes to things: every activity has a place and a pose. It sits on a stool at the desk or the piano, lies on
//    the bed to read or nap, sits on the couch, stands at the window, by the plant, at the shelf;
//  - the room has depth: it walks forward and back across the floor, a little smaller further from you.
// Purely visual, like the rest of the room; it never touches the game state.
const AV3 = { x: 203, y: 172, mode: 'stand', frame: 'stand', face: 1, raf: 0, walk: null, j: 0, tg: null, dist: 0 };
const AV3_WALK_N = 6;
// ---- poses for the figure (FIG_POSE hooks in figure.js) ----
function av3WalkPose(f, dir) {
  const ph0 = f / AV3_WALK_N * Math.PI * 2;
  return {
    legs(g, F) { const ph = ph0 + (g.s === 1 ? 0 : Math.PI), fwd = Math.sin(ph), lift = Math.max(0, Math.cos(ph)) * 8, hx = F.cx + g.s * (F.hp * .5 - 1.2);
      g.A = [hx + dir * 7.5 * fwd, F.an - lift]; g.K = [(g.H[0] + g.A[0]) / 2 + dir * (1.2 + lift * .5), F.kn - lift * .6]; g.ty = F.fy - lift; g.turn = dir * 3.4; g.free = false; g.weight = false; },
    arms(A, hands, F) { for (const s of [-1, 1]) { const ph = ph0 + (s === 1 ? 0 : Math.PI), sw = -Math.sin(ph), J = A[s];
      A[s] = [J[0], [J[1][0] + dir * sw * 2, J[1][1] - Math.abs(sw) * .7], [J[2][0] + dir * sw * 7.5, J[2][1] - Math.abs(sw) * 3.5]]; hands[s] = 'rest'; } }
  };
}
const AV3_HOLD = { arms(A, hands, F) { for (const s of [-1, 1]) { A[s] = [F.Sj(s), [F.cx + s * (F.ww + 5.4), F.wy + 2], [F.cx + s * 6.5, F.cr + 12]]; hands[s] = 'rest'; } }, front: 1 };
const AV3_SIT_LEGS = (g, F) => { g.K = [g.H[0] + g.s * 3.6, F.hy + 6]; g.A = [g.H[0] + g.s * 4, F.hy + 6 + (F.an - F.kn)]; g.ty = g.A[1] + (F.fy - F.an); g.turn = g.s * .8; g.free = false; };
const AV3_SIT_DROP = 49;   // in figure units: how far the body comes down when it sits (thigh length, foreshortened)
function av3Poses() {
  return {
    stand: null, hold: AV3_HOLD,
    sit: { legs: AV3_SIT_LEGS, arms(A, hands, F) { for (const s of [-1, 1]) { A[s] = [F.Sj(s), [F.cx + s * (F.ww + 5.6), F.wy + 1], [F.cx + s * (F.hp - .5), F.hy + 6]]; hands[s] = 'rest'; } }, front: 1 },
    sithold: { legs: AV3_SIT_LEGS, arms: AV3_HOLD.arms, front: 1 }
  };
}
// all the frames of the player, drawn once per look (each about 16KB of SVG)
const AV3_CACHE = { k: null, frames: null };
function av3Frames(args, draw) {
  const key = JSON.stringify(args[0]) + '|' + args[1] + '|' + (typeof LIVING_CTX !== 'undefined' && LIVING_CTX ? JSON.stringify(LIVING_CTX) : '');
  if (AV3_CACHE.k === key) return AV3_CACHE.frames;
  const out = {}, P = av3Poses(), was = FIG_POSE;
  try { for (const k of Object.keys(P)) { FIG_POSE = P[k]; out[k] = draw(); } for (let f = 0; f < AV3_WALK_N; f++) { FIG_POSE = av3WalkPose(f, 1); out['w' + f] = draw(); } } finally { FIG_POSE = was; }
  AV3_CACHE.k = key; AV3_CACHE.frames = out; return out;
}
// inside the room only: the player's full-length figure becomes a stack of frames, one shown at a time
let AV3_CTX = 0;
{ const _ps = portraitSVG; portraitSVG = function (L, age, h, toon, full) {
  if (!AV3_CTX || h !== 122 || !full) return _ps.apply(this, arguments);
  AV3_CTX = 0; const args = arguments, F = av3Frames(args, () => _ps.apply(this, args));
  return Object.entries(F).map(([k, svg]) => `<g class="av3-fr" data-f="${k}"${k === AV3.frame ? '' : ' display="none"'}>${k.startsWith('w') ? `<g transform="translate(0 ${(-Math.abs(Math.cos(+k.slice(1) / AV3_WALK_N * Math.PI * 2)) * 1.4).toFixed(2)})">${svg}</g>` : svg}</g>`).join('');
}; }
// ---- where each activity happens ----
function av3Targets(acts, life, lay, spots, wx, ww) {
  const at = id => { const sp = lay[id] && spots.find(x => x.id === lay[id]); return sp ? sp.x : null; };
  const bedX = at('bed'), bed = bedX !== null ? { x: bedX, w: 96, top: 168 - 26 } : life === 'couch' ? { x: 24, w: 140, top: 168 - 18, couch: 1 } : { x: life === 'shared' || life === 'studio' ? 18 : 12, w: 88, top: 168 - 12 };
  const plantX = at('plant') !== null ? at('plant') + 8 : wx + 12;
  return acts.map(([dx, k]) => {
    const x0 = 203 + dx;
    switch (k) {
      case 'write': return at('desk') !== null ? { x: at('desk') + 46, y: 171, pose: 'sithold', stool: 1 } : { x: x0, y: 172, pose: 'hold' };
      case 'music': return at('upright') !== null && Math.abs(x0 - at('upright') - 40) < 30 ? { x: at('upright') + 30, y: 171, pose: 'sit', stool: 1 } : { x: x0, y: 171, pose: 'stand' };
      case 'read': return bed.couch ? { x: bed.x + 70, y: 172, pose: 'sithold' } : { lie: 1, bed, pose: 'hold' };
      case 'nap': return bed.couch ? { lie: 1, bed, pose: 'stand' } : { lie: 1, bed, pose: 'stand' };
      case 'dream': return { x: wx + ww / 2, y: 163, pose: 'stand' };
      case 'water': return { x: plantX + (plantX > 300 ? -26 : 26), y: plantX > wx - 20 && plantX < wx + ww + 20 ? 164 : 170, pose: 'stand' };
      case 'coffee': case 'camera': return { x: x0, y: 170, pose: 'stand' };
      case 'script': case 'game': return { x: x0, y: 170, pose: 'hold' };
      case 'stretch': return { x: 200, y: 177, pose: 'stand' };
      case 'dance': return { x: x0, y: 175, pose: 'stand' };
      case 'phone': case 'lines': return { x: x0, y: 174, pose: 'hold' };
      case 'pet': return { x: 236, y: 176, pose: 'stand' };
      default: return { x: x0, y: 172, pose: 'stand' };
    }
  }).map(t => (t.x !== undefined && (t.x = clamp(t.x, 34, 370)), t));
}
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) {
  const M = S.me; if (!M) return _hs.apply(this, arguments);
  AV3_CTX = 1; let s; try { s = _hs.apply(this, arguments); } finally { AV3_CTX = 0; }
  const m = s.match(/<g class="me-walk"[^>]*data-acts='([^']*)'/); if (!m) return s;
  let acts = []; try { acts = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')); } catch (e) { return s; }
  const life = M.life, lay = homeLayout(), spots = HOME_SPOTS[life] || [], wx = life === 'couch' ? 268 : 150, ww = !['couch', 'shared', 'studio'].includes(life) ? 124 : 90;
  const T = av3Targets(acts, life, lay, spots, wx, ww);
  // the body (frames and what's in the hands) in one group that sits, lies down and turns together
  // regroup by position: [shadow] av3-body{ stool, av3-flip{ me-bob }, props }
  const i0 = s.indexOf('<g class="me-bob">'), i1 = s.indexOf('<g class="act-prop"', i0), ip = s.indexOf('<g class="act-prop" data-k="pet">', i0);
  if (i0 < 0 || i1 < 0 || ip < 0) return s;
  const ip2 = s.indexOf('</g>', ip) + 4;
  s = s.slice(0, i0) + '<g class="av3-body"><g class="av3-stool"></g><g class="av3-flip">' + s.slice(i0, i1) + '</g>' + s.slice(i1, ip2) + '</g>' + s.slice(ip2);
  s = s.replace(/<g class="me-walk" /, `<g class="me-walk" data-tg='${esc(JSON.stringify(T))}' transform="${av3Xf()}" `).replace(/(<g class="me-walk"[^>]*?) style="transform:translateX\([^)]*\)"/, '$1');
  return s;
}; }
// ---- drawing the state onto the DOM ----
function av3Xf() { return AV3.mode === 'lie' ? '' : `translate(${AV3.x.toFixed(1)} ${AV3.y.toFixed(1)}) scale(${(.9 + (AV3.y - 160) / 18 * .12).toFixed(3)}) translate(-203 -170)`; }
function av3Show(g, frame) { if (!g) return; AV3.frame = frame; for (const e of g.querySelectorAll('.av3-fr')) { const on = e.dataset.f === frame; if (on !== (e.getAttribute('display') !== 'none')) e.setAttribute('display', on ? 'inline' : 'none'); } }
function av3Apply(g) {
  if (!g) return; g.style.transform = ''; g.style.transition = ''; g.setAttribute('transform', av3Xf());
  const body = g.querySelector('.av3-body'), flip = g.querySelector('.av3-flip'), stool = g.querySelector('.av3-stool'), sh = g.querySelector(':scope > ellipse'); if (!body) return;
  if (flip) flip.setAttribute('transform', AV3.face < 0 && AV3.mode === 'walk' ? 'translate(406 0) scale(-1 1)' : '');
  const t = AV3.tg || {}, drop = AV3_SIT_DROP * .508;
  if (AV3.mode === 'sit') { body.setAttribute('transform', `translate(0 ${drop.toFixed(1)})`);
    const seatY = 54 + (FIG.hy + 3) * .508, floorY = 170 - drop;   // in the body's own coordinates, which have come down by drop
    stool.innerHTML = t.stool ? `<rect x="187" y="${seatY.toFixed(1)}" width="32" height="5" rx="2" fill="#6B4E3A"/><path d="M191 ${(seatY + 5).toFixed(1)} L188 ${floorY.toFixed(1)} M215 ${(seatY + 5).toFixed(1)} L218 ${floorY.toFixed(1)} M190 ${(seatY + 18).toFixed(1)} L216 ${(seatY + 18).toFixed(1)}" stroke="#4E3826" stroke-width="2.6"/>` : ''; }
  else { stool.innerHTML = ''; body.setAttribute('transform', ''); }
  if (AV3.mode === 'lie') { const B = t.bed || { x: 12, w: 88, top: 156 }, sc = Math.min(.8, (B.w - 12) / 118), fx = B.x + 10 + 118 * sc, fy = B.top - 7 * sc;
    body.setAttribute('transform', `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) rotate(-90) scale(${sc.toFixed(3)}) translate(-203 -170)`); }
  if (sh) sh.setAttribute('opacity', AV3.mode === 'lie' ? '0' : '.22');
}
// ---- the walk ----
function av3Go(g, j, dwell, what, k) {
  let T; try { T = JSON.parse(g.dataset.tg || '[]'); } catch (e) { T = []; } const t = T[j] || { x: 203, y: 172, pose: 'stand' };
  cancelAnimationFrame(AV3.raf); g.querySelectorAll('.act-prop').forEach(p => p.classList.remove('on')); g.dataset.act = '';
  // get up first if sitting or lying, standing where you were
  if (AV3.mode === 'lie') { const B = (AV3.tg && AV3.tg.bed) || { x: 60, w: 88 }; AV3.x = clamp(B.x + B.w + 14, 34, 370); AV3.y = 174; }
  AV3.mode = 'walk'; AV3.tg = t; av3Show(g, 'stand');
  const tx = t.lie ? clamp(t.bed.x + t.bed.w + 14, 34, 370) : t.x, ty = t.lie ? 174 : t.y, x0 = AV3.x, y0 = AV3.y, dist = Math.hypot(tx - x0, (ty - y0) * 2.2);
  let N = {}; try { N = JSON.parse(g.dataset.needs || '{}'); } catch (e) {}
  const speed = (N.energy ?? 60) >= 60 ? 46 : (N.energy ?? 60) >= 30 ? 34 : 24, dur = Math.max(.15, dist / speed) * 1000, stride = 7.5, t0 = performance.now();
  AV3.face = tx < x0 - 1 ? -1 : tx > x0 + 1 ? 1 : AV3.face; if (typeof avCaption === 'function' && dist > 3) avCaption('Walking over');
  const arrive = () => {
    AV3.x = tx; AV3.y = ty; AV3.mode = t.lie ? 'lie' : t.pose.startsWith('sit') ? 'sit' : 'stand';
    av3Show(g, t.pose === 'sithold' ? 'sithold' : t.pose === 'sit' ? 'sit' : t.pose === 'hold' ? 'hold' : 'stand'); av3Apply(g);
    g.dataset.act = k; const p = g.querySelector(`.act-prop[data-k="${k}"]`); if (p) p.classList.add('on');
    if (typeof avCaption === 'function') avCaption(what); const sv = g.closest('svg'); if (sv) sv.setAttribute('aria-label', 'Your place: ' + String(what).toLowerCase());
  };
  if (dist < 3) { arrive(); return dur; }
  const step = now => {
    if (!g.isConnected) return;
    const u = Math.min(1, (now - t0) / dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    AV3.x = x0 + (tx - x0) * e; AV3.y = y0 + (ty - y0) * e;
    const walked = dist * e; av3Show(g, 'w' + (Math.floor(walked / stride) % AV3_WALK_N)); av3Apply(g);
    if (u < 1) AV3.raf = requestAnimationFrame(step); else arrive();
  };
  AV3.raf = requestAnimationFrame(step); return dur;
}
// home2.js picks what to do and when; this takes over how the toon gets there
if (typeof avGo === 'function') avGo = function (g, j, dwell) {
  let A; try { A = JSON.parse(g.dataset.acts || '[]'); } catch (e) { return; } if (!A[j]) return;
  const [, k, what] = A[j], dur = av3Go(g, j, dwell, what, k) || 0;
  Object.assign(AV, { dx: 0, k, i: j, arrive: Date.now() + dur, until: Date.now() + dur + (dwell || (k === 'idle' ? 4000 : 7000 + Math.random() * 6000)) });
  g.dataset.i = j;
};
// after every redraw, put the toon back where it was, in the pose it was in
if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined' && document.body) {
  const fix = () => { const g = document.querySelector('svg.home-scene .me-walk'); if (!g || g._av3) return; g._av3 = 1; av3Show(g, AV3.mode === 'walk' ? 'stand' : AV3.frame); if (AV3.mode === 'walk') AV3.mode = 'stand'; av3Apply(g); if (AV.k && AV.k !== 'idle') { g.dataset.act = AV.k; const p = g.querySelector(`.act-prop[data-k="${AV.k}"]`); if (p) p.classList.add('on'); } };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
}
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.home-scene .me-walk.walking .me-bob,.home-scene .me-walk.land .me-bob{animation:none}.home-scene .me-walk.face-l .me-bob{scale:none}
.home-scene .me-walk{transition:none!important}`; document.head.appendChild(st); })();
