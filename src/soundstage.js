// ================= The room is a set (Round 30) =================
// Your place is drawn as a standing set on a soundstage: the picture widens a little to show the dark stage around it,
// the raw edges of the flats and the braces holding them up, a lighting rig hanging over the top, the warm key light
// falling from the upper left onto the room (the same light that models the Call Sheet figures), a cool fill on the
// right, and coloured tape marks on the floor where you stand to do things. Everything inside the room keeps its
// coordinates, so the furniture, the walking and the tap targets all work as before.
const SS_TAPE = ['#F2C94C', '#56A8E8', '#EB5757', '#6FCF97', '#F2994A', '#BB6BD9'];
function ssBack() {
  const brace = (x, d) => `<path d="M${x} 129L${x + d * 7} 60" stroke="#3A2F28" stroke-width="2.2"/><path d="M${x + d * 7} 60L${x + d * 7} 129" stroke="#2C2420" stroke-width="1.2"/><rect x="${x - 4}" y="125" width="8" height="5" rx="1" fill="#4B4038"/>`;
  return `<g class="ss-back" pointer-events="none"><rect x="-12" y="-18" width="424" height="200" fill="#15121B"/>`
    + `<rect x="-12" y="129" width="12" height="53" fill="#272231"/><rect x="400" y="129" width="12" height="53" fill="#272231"/>`
    + `<path d="M-12 140H0M-12 156H0M400 140H412M400 156H412" stroke="#FFFFFF" stroke-opacity=".05" stroke-width=".6"/>`
    + brace(-9, 1) + brace(409, -1) + `</g>`;
}
function ssFront() {
  // the rig: a box truss with lamps hanging under it
  let truss = `<rect x="-12" y="-17" width="424" height="1.6" fill="#8A8F99"/><rect x="-12" y="-11" width="424" height="1.6" fill="#6F7480"/>`;
  let z = 'M-12 -15.4'; for (let x = -12; x < 412; x += 6) z += `L${x + 3} -9.4L${x + 6} -15.4`;
  truss += `<path d="${z}" stroke="#7A808B" stroke-width=".6" fill="none"/>`;
  const lamp = (x, rot, warm) => `<g transform="translate(${x} -9.5)"><path d="M0 0V2.2" stroke="#2A2A30" stroke-width="1.2"/><g transform="rotate(${rot} 0 4)"><path d="M-4.6 1.8Q0 -.6 4.6 1.8V5H-4.6Z" fill="#2B2B33"/><rect x="-5" y="2" width="10" height="6.6" rx="1.4" fill="#1F1F26"/><path d="M-6.4 8.4L-5 6.6H5L6.4 8.4" stroke="#3A3A44" stroke-width="1" fill="none"/><ellipse cx="0" cy="8.4" rx="4" ry="1.2" fill="${warm ? '#FFE3A8' : '#CFE0FF'}"/></g></g>`;
  const rig = `<g class="ss-rig" pointer-events="none">${truss}${lamp(34, -28, 1)}${lamp(92, -14, 1)}${lamp(318, 18, 0)}${lamp(372, 26, 0)}<path d="M-12 -2.6H412" stroke="#C9B28A" stroke-width="2.4"/><path d="M-12 -1.2H412" stroke="#8E7A5C" stroke-width=".6"/></g>`;
  // the edges of the flats: raw plywood on the cut edge
  const edges = `<g pointer-events="none"><rect x="-2.6" y="-2.6" width="2.6" height="131.6" fill="#C9B28A"/><rect x="-2.6" y="-2.6" width=".8" height="131.6" fill="#E3CFA6"/><rect x="400" y="-2.6" width="2.6" height="131.6" fill="#A8916C"/></g>`;
  // the light: a warm key from the upper left, a cool fill falling off on the right
  const light = `<g class="ss-light" pointer-events="none"><defs><radialGradient id="ss-key" cx="40" cy="-10" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFD69A" stop-opacity=".26"/><stop offset=".45" stop-color="#FFD69A" stop-opacity=".08"/><stop offset="1" stop-color="#FFD69A" stop-opacity="0"/></radialGradient><linearGradient id="ss-fill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#28306A" stop-opacity="0"/><stop offset="1" stop-color="#28306A" stop-opacity=".2"/></linearGradient></defs>`
    + `<rect x="0" y="0" width="400" height="180" fill="url(#ss-key)" style="mix-blend-mode:screen"/><rect x="240" y="0" width="160" height="180" fill="url(#ss-fill)" style="mix-blend-mode:multiply"/></g>`;
  return light + edges + rig;
}
function ssMarks(T) {
  const seen = []; let o = '', n = 0;
  for (const t of T || []) { if (!t || t.lie || typeof t.x !== 'number') continue; if (seen.some(x => Math.abs(x - t.x) < 9)) continue; seen.push(t.x);
    const c = SS_TAPE[n++ % SS_TAPE.length], y = (t.y || 170) + 1.5, s = .9 + ((t.y || 170) - 160) / 18 * .12;
    o += `<g transform="translate(${t.x} ${y.toFixed(1)}) scale(${s.toFixed(2)})" opacity=".6"><rect x="-5" y="-.7" width="10" height="1.4" fill="${c}"/><rect x="-.7" y="-.7" width="1.4" height="4" fill="${c}"/></g>`; }
  return `<g class="ss-marks" pointer-events="none">${o}</g>`;
}
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) {
  let s = _hs.apply(this, arguments); if (typeof s !== 'string' || s.indexOf('<svg class="home-scene"') !== 0) return s;
  let T = []; const m = s.match(/data-tg='([^']*)'/); if (m) try { T = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')); } catch (e) {}
  s = s.replace('<svg class="home-scene" viewBox="0 0 400 180"', '<svg class="home-scene ss-set" viewBox="-12 -18 424 200"');
  s = s.replace(/(<svg class="home-scene[^>]*>)/, '$1' + ssBack());
  const at = s.indexOf('<g class="av-decor"') >= 0 ? s.indexOf('<g class="av-decor"') : s.indexOf('<g class="me-walk"');
  if (at > 0) s = s.slice(0, at) + ssMarks(T) + s.slice(at);
  return s.replace(/<\/svg>$/, ssFront() + '</svg>');
}; }
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.home-scene.ss-set{background:#15121B}
.home-scene.ss-set .ss-rig ellipse{animation:ss-hum 7s ease-in-out infinite}
@keyframes ss-hum{50%{opacity:.82}}
@media (prefers-reduced-motion:reduce){.home-scene.ss-set .ss-rig ellipse{animation:none}}`; document.head.appendChild(st); })();
