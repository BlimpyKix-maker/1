// ---------------- Home, alive ----------------
// The first screen is the one you see most, so it should move. Under your name: four live tiles (cash with its
// trend and what it costs to live, energy and stress as gauges with a word for how you are, standing with its last
// month) and an "up next" strip of what's actually coming (bookings, the job, the rent, whatever needs you).
// The room reads your life back to you: bills taped up when money's short, laundry and takeaway when you're
// frayed, envelopes when mail's waiting, script pages piling up while you write, the people you're close to pinned
// on a string, a calendar and a clock, and the weather outside the window.
// The toon stops drifting. It picks what to do from its needs, the time of day and what you do for a living, walks
// there at a pace that matches its energy, faces the way it's going, settles in, and reacts to what just happened
// (paid: a little dance; a bad week: a long look out of the window; a text: straight to the phone). Tap anything in
// the room and it goes and does that; it follows the pointer with its eyes. All of it is presentation: nothing here
// touches the game's state or its dice.

// ---- the pulse: live tiles under your name ----
function hpRing(v, col) { const c = 100.5, f = clamp(v, 0, 100) / 100 * c; return `<svg class="hp-ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" class="hp-rt"/><circle cx="20" cy="20" r="16" class="hp-rv" stroke="${col}" stroke-dasharray="${f.toFixed(1)} ${c}" transform="rotate(-90 20 20)"/><text x="20" y="24.5" text-anchor="middle">${Math.round(v)}</text></svg>`; }
function hpWord(k, v) { return k === 'energy' ? (v >= 70 ? 'Fresh' : v >= 45 ? 'Fine' : v >= 25 ? 'Tired' : 'Running on empty') : (v < 25 ? 'Calm' : v < 50 ? 'Some pressure' : v < 75 ? 'Frayed' : 'Close to burning out'); }
function hpNext() {
  const M = S.me, out = [], ap = typeof apptsAhead === 'function' ? apptsAhead() : [];
  for (const a of ap.slice(0, 2)) { const K = (typeof APPT_KINDS !== 'undefined' && APPT_KINDS[a.kind]) || {}; out.push({ i: K.icon || '•', t: `${slotLabel(a)}: ${K.label || a.kind}${a.who != null && P(a.who) ? ' with ' + P(a.who).name.split(' ')[0] : ''}`, go: 'computer:cal' }); }
  for (const j of (M.jobs || []).slice(0, 1)) { const left = Math.max(0, j.started + j.weeks - S.week); out.push({ i: '🎬', t: `${j.t}: ${left ? left + ' wk left' : 'last week'}`, go: 'computer:work' }); }
  const A = typeof hubAlerts === 'function' ? hubAlerts().filter(a => a.cls === 'bad' || a.cls === 'good') : [];
  for (const a of A.slice(0, Math.max(1, 3 - out.length))) out.push({ i: a.icon, t: a.t, go: a.go, cls: a.cls });
  const rent = usd((ORIGIN.life[M.life] || { rent: 0 }).rent);
  if (rent > 0) out.push({ i: '🏠', t: `Rent ${fmtCash(rent)} on Sunday`, go: 'computer:bank', cls: M.cash < rent ? 'bad' : '' });
  return out.slice(0, 4);
}
function heroPulse(rent) {
  const M = S.me, me = ME(), H = M.hist || [], last = H.length ? H[H.length - 1] : null, back4 = H.length ? H[Math.max(0, H.length - 4)] : null;
  const dC = last ? M.cash - last.cash : 0, dS = back4 ? me.standing - back4.st : 0, burn = typeof burnRate === 'function' ? burnRate() : 0, run = burn < 0 ? Math.floor(Math.max(0, M.cash) / -burn) : null;
  const sp = (k, n) => H.length >= 3 && typeof tSpark === 'function' ? tSpark(histSeries(k, n).concat(k === 'cash' ? [M.cash] : k === 'st' ? [me.standing] : []), 92, 20, 'hp-sp') : '<span class="hp-sp0">trend after a few weeks</span>';
  const d = (v, f) => Math.abs(v) < 1e-9 ? '<span class="hp-d">no change</span>' : `<span class="hp-d ${v > 0 ? 'up' : 'dn'}">${v > 0 ? '▲' : '▼'} ${f(Math.abs(v))}</span>`;
  const eC = M.energy < 25 ? '#E5675B' : M.energy < 50 ? '#E3B341' : '#4FB98A', sC = M.stress >= 75 ? '#E5675B' : M.stress >= 50 ? '#E3B341' : '#4FB98A';
  const N = hpNext();
  return `<div class="hp">
    <button class="hp-t" data-jump="computer:bank" title="Open the bank"><span class="hp-l">Cash</span><b class="hp-v${M.cash < 0 ? ' bad' : ''}">${fmtCash(M.cash)}</b>${d(dC, v => fmtCash(Math.round(v)) + ' this week')}${sp('cash', 26)}<small>${fmtCash(rent)}/wk to live${run !== null ? ` · ${run} wk runway` : ''}${M.shark ? ` · owe ${fmtCash(M.shark)}` : ''}</small></button>
    <button class="hp-t hp-g" data-jump="computer:week" title="Plan rest into your week">${hpRing(M.energy, eC)}<span><span class="hp-l">Energy</span><b class="hp-w">${hpWord('energy', M.energy)}</b><small>Sleep and quiet days bring it back</small></span></button>
    <button class="hp-t hp-g" data-jump="computer:terminal" title="What's weighing on you">${hpRing(M.stress, sC)}<span><span class="hp-l">Stress</span><b class="hp-w">${hpWord('stress', M.stress)}</b><small>${M.stress >= 75 ? 'Rest now or lose a week' : 'Rejection and bills build it'}</small></span></button>
    <button class="hp-t" data-jump="computer:standing" title="Reputation and ambitions"><span class="hp-l">Standing</span><b class="hp-v">${me.standing.toFixed(1)}</b>${d(dS, v => v.toFixed(1) + ' in 4 wk')}${sp('st', 26)}<small>Level ${careerLevel()} · ${esc(LEVEL_NAME[careerLevel()] || '')}</small></button>
   </div>
   <div class="hp-next"><span class="hp-nl">Up next</span>${N.length ? N.map(x => `<button class="hp-c${x.cls ? ' ' + x.cls : ''}" data-jump="${esc(x.go)}"><i>${x.i}</i>${esc(x.t)}</button>`).join('') : '<span class="muted small">Nothing booked. A free week: plan it.</span>'}</div>`;
}
// the strip under the room: the day, the light, the weather, and what the toon is doing right now
function heroSceneBar() {
  const M = S.me, W = M.wk, w = typeof wxDay === 'function' ? wxDay(M.hub, S.week, W ? W.day : 0) : null, X = w && typeof WX !== 'undefined' ? WX[w.k] : null;
  return `<div class="hs-bar"><span>${W ? DAYS7[W.day] : 'Monday'} · ${['Morning', 'Afternoon', 'Evening'][W ? W.block : 0]}${X ? ` · ${X[0]} ${w.hi}° ${esc(X[1].toLowerCase())}` : ''}</span><span class="hs-now" id="av-cap">${esc(AV.label || 'Standing about')}</span><span class="hs-tip">tap the room to send them somewhere</span></div>`;
}

// ---- the room reads your life back to you ----
function avDecorSVG() {
  const M = S.me, me = ME(), life = M.life; if (life === 'couch') return '';
  const big = !['couch', 'shared', 'studio'].includes(life), lay = homeLayout(), used = new Set(Object.values(lay)), o = [];
  const rent = usd((ORIGIN.life[life] || { rent: 0 }).rent), W = M.wk, blk = W ? W.block : 0;
  // the people you're closest to, pinned on a string
  const IC = (typeof innerCircle === 'function' ? innerCircle() : []).filter(x => x[1] >= 2 && P(x[0]) && !P(x[0]).dead).slice(0, 6);
  const x1 = big ? 64 : 112, nIC = Math.min(IC.length, big ? 3 : 6);
  if (nIC) { o.push(`<path d="M8 96 Q${(8 + x1) / 2} 106 ${x1} 96" stroke="#6B5A48" stroke-width=".7" fill="none"/>`);
    IC.slice(0, nIC).forEach(([id], i) => { const p = P(id), L = lookOf(p), x = 15 + i * 17, t = (x - 8) / (x1 - 8), y = 96 + 20 * t * (1 - t) - 1, rot = (i % 2 ? 4 : -4);
      o.push(`<g transform="translate(${x} ${y.toFixed(1)}) rotate(${rot})"><title>${esc(p.name)}</title><rect x="-5" y="0" width="10" height="12" fill="#FBF8F0" stroke="#0002" stroke-width=".4"/><rect x="-4" y="1" width="8" height="7.5" fill="${LOOK.colour.opts[L.colour || 0] || '#2C4F7C'}"/><circle cx="0" cy="4.2" r="2.2" fill="${LOOK.skin.opts[L.skin || 0] || '#D19A72'}"/><rect x="-1" y="-1.2" width="2" height="2" fill="#C8553D"/></g>`); }); }
  // small rooms: a calendar with today ringed, a clock at the hour, and a cork board if the wall's bare
  if (!big) {
    const mon = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][typeof wxMonth === 'function' ? wxMonth(S.week) : 0], cell = (S.week % 4) * 7 + (W ? W.day : 0);
    o.push(`<g transform="translate(266 30)"><rect x="1" y="2" width="30" height="34" fill="#000" opacity=".08"/><rect width="30" height="34" fill="#FBF8F0" stroke="#0002" stroke-width=".5"/><rect width="30" height="8" fill="#C8553D"/><text x="15" y="6.2" font-size="5" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${mon}</text>${Array.from({ length: 28 }, (_, i) => `<rect x="${2 + (i % 7) * 3.8}" y="${11 + Math.floor(i / 7) * 5.6}" width="2.6" height="3.6" fill="${i < cell ? '#B9B5AE' : '#E3DED3'}"/>`).join('')}<circle cx="${3.3 + (cell % 7) * 3.8}" cy="${12.8 + Math.floor(cell / 7) * 5.6}" r="2.8" fill="none" stroke="#C8553D" stroke-width=".8"/></g>`);
    const hh = [8, 13, 21][blk], mm = [12, 40, 5][blk], ha = (hh % 12 + mm / 60) * 30, ma = mm * 6;
    o.push(`<g transform="translate(384 40)"><circle r="10" fill="#FBF8F0" stroke="#3B3226" stroke-width="1.6"/>${[0, 1, 2, 3].map(j => `<circle cx="${Math.sin(j * Math.PI / 2) * 7.5}" cy="${-Math.cos(j * Math.PI / 2) * 7.5}" r=".7" fill="#555"/>`).join('')}<path d="M0 0 L${(Math.sin(ha * Math.PI / 180) * 5).toFixed(1)} ${(-Math.cos(ha * Math.PI / 180) * 5).toFixed(1)}" stroke="#222" stroke-width="1.3" stroke-linecap="round"/><path d="M0 0 L${(Math.sin(ma * Math.PI / 180) * 7.5).toFixed(1)} ${(-Math.cos(ma * Math.PI / 180) * 7.5).toFixed(1)}" stroke="#222" stroke-width=".8" stroke-linecap="round"/><circle r="1" fill="#C8553D"/></g>`);
    if (!used.has('wallR')) { const role = MAIN[me.role] || 'wri', cards = role === 'act' ? ['#F4E3C3', '#FBF8F0', '#E9E0F5'] : ['#FBF8F0', '#FFF4B8', '#D6ECF5', '#FBF8F0', '#FFD9D0'];
      o.push(`<g transform="translate(318 30)"><rect x="1" y="2" width="46" height="36" fill="#000" opacity=".08"/><rect width="46" height="36" fill="#C9A87A" stroke="#7A5236" stroke-width="2"/>${cards.map((c, i) => `<g transform="translate(${4 + (i % 3) * 14} ${4 + Math.floor(i / 3) * 15}) rotate(${(i * 37) % 9 - 4})"><rect width="${role === 'act' ? 11 : 12}" height="${role === 'act' ? 13 : 9}" fill="${c}"/>${role === 'act' ? `<circle cx="5.5" cy="5" r="3" fill="#B98A65"/><rect x="2" y="9" width="7" height="3" fill="#555"/>` : `<path d="M2 3 h8 M2 5.5 h6" stroke="#8C8A85" stroke-width=".6"/>`}<circle cx="${role === 'act' ? 5.5 : 6}" cy="0" r="1" fill="#C8102E"/></g>`).join('')}</g>`); }
  }
  // money trouble goes on the wall where you can't miss it
  if (rent > 0 && M.cash < rent * 3) { const fin = M.cash < rent * 1.5;
    o.push(`<g transform="translate(${big ? 112 : 96} 38) rotate(-5)"><title>${fin ? 'Final notice' : 'Bills'}</title><rect width="18" height="23" fill="#FBF8F0" stroke="#0002" stroke-width=".4"/><path d="M3 4 h12 M3 7 h9 M3 10 h11" stroke="#8C8A85" stroke-width=".6"/><rect x="2" y="14" width="14" height="5" fill="none" stroke="#C8102E" stroke-width=".9" transform="rotate(-8 9 16)"/><text x="9" y="18" font-size="3.2" font-weight="700" text-anchor="middle" fill="#C8102E" font-family="sans-serif" transform="rotate(-8 9 16)">${fin ? 'FINAL' : 'DUE'}</text><rect x="6" y="-2" width="7" height="3" fill="#F3E9C6" opacity=".85"/></g>`);
    if (fin) o.push(`<g transform="translate(${big ? 132 : 116} 50) rotate(7)"><rect width="16" height="20" fill="#FFE9E2" stroke="#0002" stroke-width=".4"/><path d="M3 4 h10 M3 7 h7" stroke="#8C8A85" stroke-width=".6"/><text x="8" y="15" font-size="3" font-weight="700" text-anchor="middle" fill="#C8102E" font-family="sans-serif">OVERDUE</text><rect x="5" y="-2" width="6" height="3" fill="#F3E9C6" opacity=".85"/></g>`); }
  // a laptop by the bed, open in the evening
  o.push(`<g transform="translate(${big ? 150 : 110} 171)"><title>Your laptop</title><rect x="0" y="-2" width="20" height="2" rx=".8" fill="#9AA0A6"/>${blk === 2 || M.energy >= 30 ? `<path d="M2 -2 L4 -14 L19 -14 L17 -2 Z" fill="#3B3F45"/><path d="M4.6 -3.4 L6 -12.6 L17.6 -12.6 L16.2 -3.4 Z" fill="${blk === 2 ? '#9BE7FF' : '#D6E6F2'}" class="${blk === 2 ? 'a-glow' : ''}"/>` : '<rect x="0" y="-3.4" width="20" height="1.6" rx=".6" fill="#3B3F45"/>'}</g>`);
  // pages pile up while you're writing something
  const draft = (M.scripts || []).filter(s => !s.grade && s.made === undefined).length, pages = Math.min(10, (M.scripts || []).length * 2 + draft * 3);
  if (pages) o.push(`<g transform="translate(${big ? 174 : 134} 172)"><title>${draft ? 'A draft in progress' : 'Your scripts'}</title>${Array.from({ length: pages }, (_, i) => `<rect x="${(i * 7) % 3 - 1}" y="${-2 - i * 1.4}" width="14" height="2" fill="${i % 2 ? '#F4F1E6' : '#FBF8F0'}" stroke="#C9C2B0" stroke-width=".3"/>`).join('')}${draft ? '<path d="M15 -6 l6 -8" stroke="#E3A72F" stroke-width="1.6" stroke-linecap="round"/>' : ''}</g>`);
  // frayed: laundry and takeaway on the floor
  if (M.stress >= 55) o.push(`<g transform="translate(262 174)"><title>You've let things slide</title><path d="M0 0 Q4 -9 12 -7 Q18 -12 24 -5 Q30 -4 28 0 Z" fill="${mixHex(LOOK.colour.opts[lookOf(me).colour || 0] || '#2C4F7C', '#FFFFFF', .2)}"/><path d="M8 -5 Q14 -2 20 -6" stroke="#0003" stroke-width=".8" fill="none"/><path d="M32 0 l2 -8 l10 0 l2 8 z" fill="#F4F0E6" stroke="#B9B5AE" stroke-width=".5"/><path d="M34 -8 q5 -4 10 0" stroke="#B9B5AE" stroke-width=".6" fill="none"/>${M.stress >= 75 ? '<rect x="-14" y="-6" width="11" height="6" fill="#C8553D"/><rect x="-14" y="-6" width="11" height="2" fill="#A6412D"/>' : ''}</g>`);
  // mail waiting by the door
  const mail = (M.mail || []).filter(m => !m.rd && !['spam', 'sent', 'news'].includes(m.folder)).length;
  if (mail) o.push(`<g transform="translate(352 175)"><title>${mail} unread</title>${Array.from({ length: Math.min(4, mail) }, (_, i) => `<g transform="translate(${i * 3} ${-i * 2.2}) rotate(${(i * 23) % 11 - 5})"><rect width="14" height="9" fill="#FBF8F0" stroke="#B9B5AE" stroke-width=".5"/><path d="M0 0 L7 5 L14 0" stroke="#B9B5AE" stroke-width=".5" fill="none"/></g>`).join('')}${mail > 1 ? `<circle cx="18" cy="-10" r="4" fill="#E5675B"/><text x="18" y="-8.4" font-size="4.6" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${Math.min(99, mail)}</text>` : ''}</g>`);
  return `<g class="av-decor">${o.join('')}</g>`;
}
// rain, snow or storm outside, inside the window frame
function avWeatherSVG() {
  const M = S.me, life = M.life, big = !['couch', 'shared', 'studio'].includes(life), wx = life === 'couch' ? 268 : 150, ww = big ? 124 : 90, wy = 16, wh = 78;
  const w = typeof wxDay === 'function' ? wxDay(M.hub, S.week, M.wk ? M.wk.day : 0) : null; if (!w || !['rain', 'storm', 'snow', 'fog'].includes(w.k)) return '';
  const id = 'avwin', clip = `<clipPath id="${id}"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath>`;
  if (w.k === 'fog') return `<defs>${clip}</defs><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#E6E9EC" opacity=".55" clip-path="url(#${id})"/>`;
  const n = w.k === 'snow' ? 26 : w.k === 'storm' ? 44 : 30, drops = Array.from({ length: n }, (_, i) => { const x = wx + (i * 37) % ww, y = wy + (i * 53) % wh;
    return w.k === 'snow' ? `<circle cx="${x}" cy="${y}" r="${1 + i % 2 * .6}" fill="#FFFFFF" opacity=".9"/>` : `<path d="M${x} ${y} l-2 6" stroke="#DCE8F2" stroke-width=".8" opacity=".75"/>`; }).join('');
  return `<defs>${clip}</defs><g clip-path="url(#${id})"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#5E6E80" opacity="${w.k === 'storm' ? .35 : .18}"/><g class="${w.k === 'snow' ? 'av-snow' : 'av-rain'}">${drops}<g transform="translate(0 ${-wh})">${drops}</g></g>${w.k === 'storm' ? `<rect class="av-flash" x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#FFFFFF"/>` : ''}</g>`;
}
// what just changed since the room was last drawn: the toon reacts once
let AV_SNAP = null;
function avReact() {
  const M = S.me, me = ME(); if (!M || !me) return '';
  const cur = { w: S.week, id: me.id, cash: M.cash, st: me.standing, stress: M.stress, tx: typeof phoneUnread === 'function' ? phoneUnread() : 0, pend: typeof pending === 'function' ? pending().length : 0 };
  const p = AV_SNAP; AV_SNAP = cur; if (!p || p.id !== cur.id || p.w > cur.w) return '';
  const big = v => Math.max(usd(150), Math.abs(p.cash) * .04);
  if (cur.cash - p.cash >= big()) return 'paid';
  if (cur.st - p.st >= .4) return 'up';
  if (p.st - cur.st >= .4) return 'down';
  if (cur.stress - p.stress >= 6) return 'stress';
  if (cur.tx > p.tx) return 'text';
  if (p.cash - cur.cash >= big()) return 'spent';
  if (cur.pend > p.pend) return 'decide';
  if (cur.w !== p.w) return 'week';
  return '';
}
{ const _hs = homeSceneSVG;
  homeSceneSVG = function (day) {
    let s = _hs(day); const M = S.me; if (!M) return s;
    const acts = (() => { const m = s.match(/<g class="me-walk"[^>]*data-acts='([^']*)'/); if (!m) return []; try { return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')); } catch (e) { return []; } })();
    // tap targets over the things you can go and do (furniture and the window, not the bare floor)
    const HOT = { write: 1, music: 1, coffee: 1, script: 1, camera: 1, water: 1, game: 1, dream: 1, read: 1, pet: 1 };
    const seen = new Set(), hot = acts.map((a, i) => [a, i]).filter(([a]) => HOT[a[1]] && !seen.has(a[1]) && seen.add(a[1])).map(([a, i]) => { const cx = 203 + a[0], y = a[1] === 'dream' ? 14 : 112, h = a[1] === 'dream' ? 92 : 66;
      return `<rect class="av-hot" data-avgo="${i}" x="${(cx - 24).toFixed(0)}" y="${y}" width="48" height="${h}" rx="6" tabindex="0" role="button" aria-label="${esc(a[2])}"><title>${esc(a[2])}</title></rect>`; }).join('');
    const react = avReact(), tod = ['morning', 'afternoon', 'evening'][M.wk ? M.wk.block : 0];
    const emo = `<g class="av-emo" opacity="0"><circle cx="228" cy="46" r="9.5" fill="#FFFFFF" stroke="#0002"/><path d="M220 52 l-4 5 l7 -3 z" fill="#FFFFFF"/><text x="228" y="50" font-size="11" text-anchor="middle">·</text></g>`;
    s = s.replace('<g class="me-walk" ', `${avDecorSVG()}${avWeatherSVG()}<g class="av-hots">${hot}</g><g class="me-walk" data-react="${react}" data-tod="${tod}" `);
    s = s.replace(/(<g class="me-walk"[^>]*>)/, `$1${emo}`);
    // pick up where the toon was before this redraw instead of snapping back to the middle
    if (AV.k && AV.k !== 'idle' && acts[AV.i] && acts[AV.i][1] === AV.k) { s = s.replace('<g class="me-walk" ', `<g class="me-walk" style="transform:translateX(${AV.dx}px)" data-act="${AV.k}" data-i="${AV.i}" data-dx="${AV.dx}" `).replace(`class="act-prop" data-k="${AV.k}"`, `class="act-prop on" data-k="${AV.k}"`); }
    return s;
  };
}

// ---- the toon's mind ----
const AV = { dx: 0, k: 'idle', i: 0, label: 'Standing about', until: 0, arrive: 0, g: null, face: 1 };
const AV_REACT = { paid: ['🤑', 'dance', 'Payday!'], up: ['✨', 'dance', 'Moving up'], down: ['😞', 'dream', 'A long look out of the window'], stress: ['😤', 'stretch', 'Trying to shake it off'], text: ['📱', 'phone', 'Checking the phone'], spent: ['💸', '', 'That hurt'], decide: ['❗', '', 'Something needs deciding'], week: ['☀️', 'stretch', 'A new week'] };
const AV_TOD = { morning: ['coffee', 'stretch', 'water', 'read'], afternoon: ['write', 'script', 'camera', 'lines', 'phone'], evening: ['music', 'dance', 'game', 'read', 'dream', 'pet'] };
const AV_ROLE = { wri: ['write', 'script'], dir: ['script', 'camera', 'dream'], act: ['lines', 'dance'], cam: ['camera'], mus: ['music'], edt: ['write', 'camera'], pro: ['phone', 'script'] };
function avPick(g, A) {
  let N = {}; try { N = JSON.parse(g.dataset.needs || '{}'); } catch (e) {}
  const low = Object.entries(N).sort((a, b) => a[1] - b[1])[0], tod = AV_TOD[g.dataset.tod] || [], role = AV_ROLE[(typeof MAIN !== 'undefined' && MAIN[ME().role]) || 'wri'] || [];
  const w = A.map(([, k], j) => { if (j === AV.i) return 0; let v = 1; if (low && low[1] < 70 && typeof NEED_ACTS !== 'undefined' && NEED_ACTS[low[0]].includes(k)) v += 4 * (70 - low[1]) / 40; if (tod.includes(k)) v += 1.6; if (role.includes(k)) v += 1.2; if (k === 'idle') v *= .5; if (k === 'nap' && g.dataset.tod !== 'evening' && !(low && low[0] === 'energy' && low[1] < 30)) v *= .2; return v; });
  let r = Math.random() * w.reduce((a, b) => a + b, 0); for (let j = 0; j < w.length; j++) { r -= w[j]; if (r <= 0) return j; } return 0;
}
function avEmote(g, e, ms = 2600) { const b = g.querySelector('.av-emo'); if (!b) return; b.querySelector('text').textContent = e; b.setAttribute('opacity', '1'); b.classList.remove('pop'); void b.getBBox(); b.classList.add('pop'); clearTimeout(b._t); b._t = setTimeout(() => b.setAttribute('opacity', '0'), ms); }
function avCaption(t) { AV.label = t; const c = document.getElementById('av-cap'); if (c) c.textContent = t; }
function avGo(g, j, dwell) {
  let A; try { A = JSON.parse(g.dataset.acts || '[]'); } catch (e) { return; } if (!A[j]) return;
  const [dx, k, what] = A[j], energy = (() => { try { return JSON.parse(g.dataset.needs || '{}').energy ?? 60; } catch (e) { return 60; } })();
  const speed = energy >= 60 ? 62 : energy >= 30 ? 42 : 26, dur = clamp(Math.abs(dx - AV.dx) / speed, .5, 4.2), step = energy >= 60 ? .26 : energy >= 30 ? .34 : .46;
  g.querySelectorAll('.act-prop').forEach(p => p.classList.remove('on')); g.dataset.act = ''; g.classList.remove('land');
  if (Math.abs(dx - AV.dx) > 2) { AV.face = dx < AV.dx ? -1 : 1; g.classList.toggle('face-l', AV.face < 0); g.classList.add('walking'); g.style.setProperty('--stp', step + 's'); avCaption('Walking over'); }
  g.style.transition = `transform ${dur.toFixed(2)}s cubic-bezier(.45,.05,.4,1)`; g.style.transform = `translateX(${dx}px)`;
  Object.assign(AV, { dx, k, i: j, arrive: Date.now() + dur * 1000, until: Date.now() + dur * 1000 + (dwell || (k === 'idle' ? 4000 : 7000 + Math.random() * 6000)) });
  g.dataset.i = j; g.dataset.dx = dx;
  clearTimeout(g._arr); g._arr = setTimeout(() => { g.classList.remove('walking', 'face-l'); g.classList.add('land'); g.dataset.act = k; const p = g.querySelector(`.act-prop[data-k="${k}"]`); if (p) p.classList.add('on'); avCaption(what); const sv = g.closest('svg'); if (sv) sv.setAttribute('aria-label', 'Your place: ' + what.toLowerCase()); }, dur * 1000 + 20);
}
if (typeof window !== 'undefined' && typeof document !== 'undefined' && window.setInterval && document.querySelector) {
  window.AV2 = true;   // the old wanderer in home.js stands down
  const still = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setInterval(() => {
    const g = document.querySelector('svg.home-scene .me-walk'); if (!g) return;
    let A; try { A = JSON.parse(g.dataset.acts || '[]'); } catch (e) { return; } if (A.length < 2) return;
    if (g !== AV.g) {   // a fresh drawing: carry on from where we were, then react to whatever just happened
      AV.g = g; if (!A[AV.i] || A[AV.i][1] !== AV.k) { AV.i = 0; AV.dx = 0; AV.k = 'idle'; }
      const R = AV_REACT[g.dataset.react];
      if (R) { avEmote(g, R[0]); avCaption(R[2]); const j = R[1] ? A.findIndex(a => a[1] === R[1]) : -1; if (j >= 0 && !still()) { avGo(g, j, 9000); return; } g.classList.remove('hop'); void g.getBBox(); g.classList.add('hop'); AV.until = Math.max(AV.until, Date.now() + 2500); return; }
    }
    if (still() || Date.now() < AV.until) return;
    avGo(g, avPick(g, A));
  }, 700);
  // tap a thing in the room: the toon goes and does it
  document.addEventListener('click', e => {
    const h = e.target && e.target.closest && e.target.closest('svg.home-scene [data-avgo]'); if (!h) return;
    const g = document.querySelector('svg.home-scene .me-walk'); if (!g) return;
    avEmote(g, '👍', 1400); avGo(g, +h.dataset.avgo, 15000);
  });
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('svg.home-scene [data-avgo]')) { e.preventDefault(); e.stopPropagation(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } }, true);
  // eyes and head follow the pointer while it's over the room
  let gz = 0; document.addEventListener('pointermove', e => {
    if (gz) return; gz = requestAnimationFrame(() => { gz = 0;
      const sv = e.target && e.target.closest && e.target.closest('svg.home-scene'), eyes = document.querySelector('svg.home-scene .me-walk .t-eyes') || document.querySelector('svg.home-scene .me-walk .pf-iris'), head = document.querySelector('svg.home-scene .me-walk .t-head'); if (!eyes) return;
      if (!sv || still()) { eyes.style.translate = ''; if (head) head.style.rotate = ''; return; }
      const b = eyes.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2), d = Math.hypot(dx, dy) || 1, f = (AV.face < 0 && document.querySelector('svg.home-scene .me-walk.face-l')) ? -1 : 1;
      const k = eyes.classList.contains('pf-iris') ? .9 : 1.3; eyes.style.translate = `${(dx / d * Math.min(k, d / 40) * f).toFixed(2)}px ${(dy / d * Math.min(k * .6, d / 50)).toFixed(2)}px`; if (head) head.style.rotate = `${clamp(dx / 60, -4, 4).toFixed(2) * f}deg`; });
  });
}

// ---- the computer's front page: different numbers from the ones under your name, with their trends ----
{ const _oh = osHome; osHome = function () {
  const h = _oh(), M = S.me, me = ME(), nw = osNetWorth(), burn = typeof burnRate === 'function' ? burnRate() : 0, run = burn < 0 ? Math.floor(Math.max(0, M.cash) / -burn) : null, H = M.hist || [];
  const sp = k => H.length >= 3 ? tSpark(histSeries(k, 26), 110, 22, 'os-sp') : '';
  const kpi = (l, v, sub, s = '', c = '') => `<div class="os-kpi"><span>${l}</span><b class="${c}">${v}</b>${sub ? `<small>${sub}</small>` : ''}${s}</div>`;
  const known = Object.keys(M.known).length, rank = typeof myStarRank === 'function' ? myStarRank() : null;
  const K = `<div class="os-kpis">${kpi('Net worth', fmtCash(nw.total), H.length ? dlt(histDelta('nw', 4), v => fmtCash(Math.round(v))) + ' 4 wk' : '', sp('nw'), nw.total < 0 ? 'bad' : '')}${kpi('Runway', run === null ? '∞' : run + ' wk', run === null ? 'earning more than you spend' : 'at this week\'s burn', '', run !== null && run < 8 ? 'bad' : '')}${kpi('Fame', (me.fame || 0).toFixed(1), H.length ? dlt(histDelta('fame', 4)) + ' 4 wk' : '', sp('fame'))}${rank ? kpi('Buzz Index', '#' + rank.toLocaleString(), 'of everyone working', sp('buzz')) : ''}${kpi('Network', known, H.length ? dlt(histDelta('known', 4), v => v.toFixed(0)) + ' 4 wk' : 'people you know', sp('known'))}</div>`;
  return h.replace(/^<div class="os-kpis">[\s\S]*?<\/div>\s*<div class="os-grid">/, K + '\n   <div class="os-grid">');
}; }
// tapped when nothing's low: something true about the week instead of "all levels above 60"
{ const _ts = toonSays; toonSays = function (N) {
  const low = Object.entries(N).sort((a, b) => a[1] - b[1])[0]; if (low && low[1] < 60) return _ts(N);
  const M = S.me, L = [], ap = typeof apptsAhead === 'function' ? apptsAhead()[0] : null, rent = usd((ORIGIN.life[M.life] || { rent: 0 }).rent);
  if (ap) L.push(`${slotLabel(ap)}: ${((typeof APPT_KINDS !== 'undefined' && APPT_KINDS[ap.kind]) || {}).label || 'booked'}`.slice(0, 36));
  if (M.jobs && M.jobs[0]) L.push(`${Math.max(0, M.jobs[0].started + M.jobs[0].weeks - S.week)} weeks left on this job`);
  if (rent > 0) L.push(M.cash < rent * 2 ? `Rent's ${fmtCash(rent)}. I've got ${fmtCash(M.cash)}.` : `${Math.floor(M.cash / rent)} weeks of rent in the bank`);
  const tx = typeof phoneUnread === 'function' ? phoneUnread() : 0; if (tx) L.push(`${tx} text${tx > 1 ? 's' : ''} I should answer`);
  if (M.dream && typeof DREAMS !== 'undefined' && DREAMS[M.dream.k]) L.push(`One day: ${DREAMS[M.dream.k].label || ''}`.slice(0, 36));
  L.push('Feeling good. Good week to push.');
  return L[Math.floor(Math.random() * L.length)];
}; }
