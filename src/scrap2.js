// ================= The scrapbook, filled in (Round 27) =================
// It used to be milestones only, most of them an emoji on a coloured square. Now it gathers everything your life has
// left a trace of: milestones, your press clippings (as newspaper cuttings), achievements (as stamps), every new job
// and side gig, the famous people you met, and your films' stills. Each moment gets a drawn photograph that fits it
// (a set, a stage, a city at dusk, a dog in the park, a trophy under a spotlight, two people at a café table, a die
// that came up twenty...), in one of several frames (a polaroid, a postcard, a ticket stub). Filter by kind; each year
// opens with a cover. Display only, built from the save.
function scrapScene(kind, text, seed) {
  const r = hashRand(seed >>> 0), g = artId(), t = String(text || '').toLowerCase(), SK = AP(r, SKIN), day = r() < .6;
  const sky = day ? AP(r, [['#8ec5fc', '#e0c3fc'], ['#f6d365', '#fda085'], ['#a1c4fd', '#c2e9fb'], ['#fbc2eb', '#a6c1ee']]) : AP(r, [['#0f2027', '#2c5364'], ['#141e30', '#243b55'], ['#2b1055', '#7597de']]);
  const figure = (x, y, s, col) => aFig(x, y, s, col || AP(r, ['#222', '#3d405b', '#5c3b1e', '#1d3557']), r);
  const wrap = (body, bg) => svgWrap(`<rect width="320" height="180" fill="url(#${g})"/>${body}<rect width="320" height="180" fill="#fff6e0" opacity=".07"/>`, aGrad(g, (bg || sky)[0], (bg || sky)[1]));
  const S0 = {
    set: () => wrap(`<rect y="130" width="320" height="50" fill="#2b2b2b"/>${aLamp(60, 30, 1, true)}${aLamp(270, 34, .9, true)}${aCamera(170, 108, 1.2, '#1b1b1b', true)}${aClapper(214, 112, .9)}${figure(120, 150, .9)}${figure(250, 152, .8)}`, ['#1d1d22', '#3a3a46']),
    stage: () => wrap(`<rect width="320" height="180" fill="#3b0d0d"/><path d="M0 0 Q40 90 20 180 L0 180Z M320 0 Q280 90 300 180 L320 180Z" fill="#8b1a1a"/><path d="M160 0 L100 160 L220 160Z" fill="#fff6c9" opacity=".25"/><rect y="150" width="320" height="30" fill="#5c3b1e"/>${figure(160, 152, 1.1)}`, ['#120404', '#3b0d0d']),
    city: () => wrap(`${day ? aSun(250, 50, 1, '#ffd166') : `<circle cx="250" cy="40" r="12" fill="#f4f1de"/>`}${aSkyline(150, day ? '#3d4b66' : '#0b1020', r)}<rect y="150" width="320" height="30" fill="#2b2b2b"/>${figure(90, 172, 1)}<rect x="100" y="152" width="18" height="20" rx="3" fill="#8d5524"/>`),
    travel: () => wrap(`${aCloud(80, 50, 1)}${aCloud(240, 70, .8)}${aHills(140, '#6a994e', r)}<g transform="translate(${120 + r() * 60} 60) rotate(-8)"><path d="M0 10 L70 6 Q84 8 84 12 Q84 16 70 18 L0 14Z" fill="#fff"/><path d="M30 10 L18 -8 L26 -8 L44 10Z M30 14 L20 30 L28 30 L44 14Z" fill="#c1121f"/></g>`, ['#89c2ff', '#e9f5ff']),
    pet: () => wrap(`${aHills(130, '#52b788', r, 20)}<rect y="140" width="320" height="40" fill="#40916c"/>${/cat/.test(t) ? aCat(160, 160, 1.4, AP(r, ['#333', '#c97d3a', '#888', '#e9e2d0'])) : aDog(150, 160, 1.4, AP(r, ['#8d5524', '#e9c46a', '#333', '#c0a080']))}${figure(250, 168, 1)}`, ['#bde0fe', '#f1faee']),
    trophy: () => wrap(`<path d="M160 0 L90 170 L230 170Z" fill="#fff6c9" opacity=".22"/>${aConfetti(50, r)}${aTrophy(160, 150, 1.5)}<rect y="160" width="320" height="20" fill="#2b1a10"/>`, ['#1b1b2f', '#46325d']),
    people: () => [() => wrap(`${aHills(120, '#74c69d', r, 18)}<rect y="140" width="320" height="40" fill="#b7b7a4"/><path d="M0 150 Q160 138 320 150" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>${figure(140, 168, 1)}${figure(170, 168, 1, AP(r, ['#e76f51', '#6d597a', '#2a9d8f']))}<circle cx="260" cy="70" r="26" fill="#2d6a4f"/><rect x="256" y="90" width="8" height="50" fill="#5c3b1e"/>`, ['#caf0f8', '#ade8f4']),
      () => wrap(`<rect y="120" width="320" height="60" fill="#6c584c"/><rect x="40" y="30" width="100" height="70" fill="#f8f9fa" stroke="#adb5bd"/><path d="M50 90 L80 60 L100 76 L130 44" stroke="#e63946" stroke-width="3" fill="none"/>${figure(170, 170, 1)}${figure(240, 170, 1, '#222')}<path d="M188 138 h34" stroke="${SK}" stroke-width="7" stroke-linecap="round"/>`, ['#e9ecef', '#dee2e6']),
      () => wrap(`${aBulbs(30, r)}<rect x="100" y="120" width="120" height="8" rx="3" fill="#5c3b1e"/><path d="M160 128 v40" stroke="#5c3b1e" stroke-width="5"/>${figure(110, 160, 1)}${figure(210, 160, 1, AP(r, ['#e76f51', '#6d597a', '#2a9d8f']))}<rect x="132" y="112" width="10" height="10" rx="2" fill="#fff"/><rect x="178" y="112" width="10" height="10" rx="2" fill="#fff"/>`, day ? ['#f8edeb', '#fec89a'] : ['#2b2d42', '#5a4e6b'])][Math.floor(r() * 3)](),
    love: () => wrap(`${aBulbs(26, r)}${figure(140, 170, 1.05)}${figure(180, 170, 1, '#9b2226')}<path d="M160 50 c-10 -16 -32 -4 -20 12 l20 18 l20 -18 c12 -16 -10 -28 -20 -12z" fill="#e63946" opacity=".85"/>`, ['#ffafcc', '#cdb4db']),
    fallout: () => wrap(`${aRain(70, r)}${figure(90, 170, 1)}${figure(240, 170, 1)}<rect y="170" width="320" height="10" fill="#444"/>`, ['#5c677d', '#979dac']),
    luck: () => wrap(`<g transform="translate(160 92) rotate(${r() * 30 - 15})"><path d="M0 -60 L52 -30 L52 30 L0 60 L-52 30 L-52 -30Z" fill="#e63946"/><path d="M0 -60 L52 -30 L0 0 L-52 -30Z" fill="#ff6b6b"/>${aTxt(0, 14, 34, '20', '#fff', 'middle', 'Arial,sans-serif')}</g>${aConfetti(30, r)}`, ['#1d3557', '#457b9d']),
    school: () => wrap(`<rect x="40" y="26" width="240" height="96" fill="#2d4a3e" stroke="#8d5524" stroke-width="8"/>${aTxt(160, 70, 16, AP(r, ['24 fps', 'f/2.8', 'ACT ONE', 'EXT. DAY', 'I = V/R', 'BEAT SHEET']), '#fff', 'middle', 'Comic Sans MS,cursive', 400)}<path d="M70 90 h80 M70 104 h120" stroke="#fff" opacity=".6"/>${aBook(60, 140, 60, 16, '#9b2226')}${aBook(130, 136, 60, 20, '#264653')}${figure(240, 172, 1)}`, ['#e9edc9', '#ccd5ae']),
    money: () => wrap(`${[0, 1, 2, 3, 4].map(i => `<rect x="${70 + i * 8}" y="${90 - i * 6}" width="120" height="56" rx="4" fill="#52b788" stroke="#2d6a4f" transform="rotate(${-8 + i * 4} 130 118)"/>`).join('')}${aTxt(130, 124, 24, '$', '#1b4332', 'middle', 'Georgia,serif')}<circle cx="240" cy="130" r="22" fill="#e9c46a"/><circle cx="262" cy="146" r="18" fill="#e9c46a"/>`, ['#f1faee', '#d8f3dc']),
    level: () => wrap(`${aSun(250, 46, 1.2, '#ffb703')}${[0, 1, 2, 3, 4].map(i => `<rect x="${40 + i * 44}" y="${150 - i * 22}" width="44" height="${30 + i * 22}" fill="#3d405b"/>`).join('')}${figure(240, 62, .8)}`, ['#ffe5b4', '#ffc8dd']),
    office: () => wrap(`<rect x="20" y="20" width="110" height="80" fill="#cde7ff" stroke="#999"/><path d="M30 100 V60 h14 V100 M50 100 V44 h18 V100 M74 100 V70 h12 V100 M92 100 V52 h16 V100" fill="#9fb3c8"/><rect y="120" width="320" height="60" fill="#8d5524"/><rect x="150" y="110" width="80" height="6" fill="#fff"/>${figure(110, 175, 1)}${figure(250, 175, 1, '#222')}<path d="M150 130 q20 -14 40 0" stroke="${SK}" stroke-width="8" fill="none"/>`, ['#f8f9fa', '#dee2e6']),
    premiere: () => wrap(`<rect y="130" width="320" height="50" fill="#9b2226"/>${aCrowd(132, 12, '#111', r)}${[0, 1, 2, 3, 4, 5].map(() => `<circle cx="${r() * 320}" cy="${40 + r() * 70}" r="${4 + r() * 6}" fill="#fff" opacity=".9"/>`).join('')}${figure(160, 168, 1.1)}`, ['#000', '#2b2d42']),
    viral: () => wrap(`<rect x="120" y="14" width="80" height="152" rx="12" fill="#111"/><rect x="126" y="26" width="68" height="120" fill="#ffafcc"/>${figure(160, 120, .8)}${[0, 1, 2, 3, 4, 5, 6].map(() => `<path transform="translate(${40 + r() * 240} ${20 + r() * 140}) scale(${.5 + r() * .6})" d="M0 0 c-6 -10 -20 -2 -12 8 l12 10 l12 -10 c8 -10 -6 -18 -12 -8z" fill="#e63946" opacity=".8"/>`).join('')}`, ['#ffe5ec', '#ffc2d1']),
    night: () => wrap(`<rect y="120" width="320" height="60" fill="#3a2614"/><rect x="40" y="40" width="240" height="70" fill="#1b1b1b"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${52 + i * 32}" y="52" width="10" height="34" fill="${AP(r, ['#9b2226', '#bc6c25', '#2d6a4f', '#e9c46a'])}"/>`).join('')}<rect x="140" y="104" width="16" height="22" fill="#e9c46a" opacity=".8"/>${figure(220, 172, 1)}`, ['#14080e', '#49111c']),
    home: () => wrap(`${day ? aSun(60, 40, .8) : '<circle cx="60" cy="40" r="10" fill="#f4f1de"/>'}<path d="M90 100 L160 50 L230 100Z" fill="#9b2226"/><rect x="104" y="100" width="112" height="70" fill="#f1e3c8"/><rect x="146" y="128" width="28" height="42" fill="#5c3b1e"/><rect x="116" y="112" width="20" height="18" fill="${day ? '#bde0fe' : '#ffd166'}"/><rect x="184" y="112" width="20" height="18" fill="${day ? '#bde0fe' : '#ffd166'}"/><rect y="170" width="320" height="10" fill="#52b788"/>`),
    gig: () => wrap(`<rect y="140" width="320" height="40" fill="#adb5bd"/>${aCamera(110, 112, 1, '#1b1b1b', true)}<rect x="170" y="60" width="110" height="70" fill="#fff" stroke="#ccc"/>${aTxt(225, 100, 12, AP(r, ['BRAND', 'LOGO', 'SPEC', 'REEL']), '#333', 'middle', 'Arial,sans-serif')}${figure(260, 172, .9)}`, ['#e9ecef', '#ced4da'])
  };
  const k = S0[kind] ? kind : 'city';
  return S0[k]();
}
function scrapKind(m) {
  const t = m.t || '';
  const rules = [[/Arrived in|Moved from|moved to|relocat/i, 'city'], [/dog|cat\b|puppy|kitten|Adopted|pet/i, 'pet'], [/natural 20/i, 'luck'], [/Learned|school|degree|graduat|course|class/i, 'school'], [/Fell out|rival|feud|grudge/i, 'fallout'], [/viral|clip|ad about/i, 'viral'], [/Reached level|promot/i, 'level'], [/agent|Signed|contract|deal/i, 'office'],
    [/award|won |wins|prize|Best |laurel|trophy/i, 'trophy'], [/premiere|opens|released|box office/i, 'premiere'], [/married|wedding|partner|in love|date|kissed/i, 'love'], [/coping|drinks|burnout|bar\b/i, 'night'], [/father|mother|parent|family|went home|\bill\b|hospital/i, 'home'], [/cash|money|\$|debt|broke|bought|sold/i, 'money'],
    [/theatre|stage|play\b|improv|comedy club/i, 'stage'], [/mentor|champion|tipster|Helped|turned up|friend|met |introduc/i, 'people'], [/DP on|Director|job|wrap|shoot|on set|credit|camera|edit/i, 'set']];
  for (const [re, k] of rules) if (re.test(t)) return k;
  return { work: 'set', love: 'love', money: 'money', prize: 'trophy', awards: 'trophy', fame: 'premiere', school: 'school', luck: 'luck', level: 'level', start: 'city' }[m.kind] || 'people';
}
const SCRAP_FILT = [['', 'Everything'], ['work', 'Work'], ['people', 'People'], ['life', 'Life'], ['press', 'Press'], ['luck', 'Luck & milestones']];
function scrapGroup(p) { return p.src === 'press' ? 'press' : p.src === 'ach' ? 'luck' : ['set', 'stage', 'gig', 'office', 'premiere', 'trophy', 'school'].includes(p.scene) ? 'work' : ['people', 'love', 'fallout'].includes(p.scene) ? 'people' : ['luck', 'level'].includes(p.scene) ? 'luck' : 'life'; }
function scrapPages() {
  const M = S.me, me = ME(), out = [], seen = new Set(), add = p => { const k = p.t; if (seen.has(k)) return; seen.add(k); out.push(p); };
  for (const m of M.milestones || []) add({ w: m.w, t: m.t, src: 'm', scene: scrapKind(m) });
  for (const c of M.press || []) add({ w: c.w, t: c.h, sub: c.sub, paper: c.paper, src: 'press' });
  if (typeof ACH !== 'undefined') for (const [k, w] of Object.entries(M.ach || {})) { const A = ACH.find(a => a[0] === k); if (A) add({ w, t: A[2], sub: A[3], icon: A[1], src: 'ach' }); }
  const jobSeen = new Set(); for (const j of M.past || []) { if (!j.t || jobSeen.has(j.t)) continue; jobSeen.add(j.t); add({ w: j.from, t: `First week as ${j.t.toLowerCase().replace(/^(an?|the) /, '')}${j.film !== null && j.film !== undefined && S.films[j.film] ? ' on ' + S.films[j.film].title : ''}`, src: 'job', scene: /theatre|stage|usher|box office/i.test(j.t) ? 'stage' : j.film !== null && j.film !== undefined ? 'set' : 'office', film: j.film }); }
  for (const g of M.gigs || []) add({ w: g.w || g.from, t: `${g.credit || 'Crew'} on ${g.client}`, sub: g.snag ? `${g.snag}. ${g.snagGo || ''}` : '', src: 'gig', scene: 'gig' });
  for (const [id, k] of Object.entries(M.known || {})) { const p = P(+id); if (p && (p.fame || 0) >= 45 && k.met !== undefined) add({ w: k.met, t: `Met ${p.name}`, sub: (k.tags || [])[0] || '', src: 'met', scene: 'people', who: +id }); }
  return out.sort((a, b) => b.w - a.w);
}
function scrapCard(p, i) {
  const seed = (p.w * 131 + i * 17 + p.t.length * 7) >>> 0, rot = ((seed % 9) - 4) * .7, f = p.film !== undefined && p.film !== null ? S.films[p.film] : (ME().credits || []).map(id => S.films[id]).find(x => x && p.t.includes(x.title));
  if (p.src === 'press') return `<figure class="sb-clip" style="transform:rotate(${rot}deg)"><span class="sb-paper">${esc(p.paper || 'The trades')} · ${esc(fmtDate(p.w, true))}</span><b class="sb-head">${esc(p.t)}</b>${p.sub ? `<span class="sb-dek">${esc(p.sub)}</span>` : ''}<span class="sb-cols"><i></i><i></i><i></i></span></figure>`;
  if (p.src === 'ach') return `<figure class="sb-stamp" style="transform:rotate(${rot * 2}deg)"><span class="sb-ic">${p.icon || '★'}</span><b>${esc(p.t)}</b><small>${esc(p.sub || '')}</small><small class="sb-d">${esc(fmtDate(p.w, true))}</small></figure>`;
  const frame = ['polaroid', 'polaroid', 'postcard', 'ticket'][seed % 4], img = f && typeof stillSVG === 'function' ? stillSVG(f, p.w % 6, 180) : scrapScene(p.scene, p.t, seed);
  return `<figure class="sb-ph sb-${frame}" style="transform:rotate(${rot}deg)"><div class="sb-img">${img}</div><figcaption><b>${esc(fmtDate(p.w, true))}</b> ${p.who !== undefined ? 'Met ' + pl(p.who) : esc(p.t)}${p.sub ? `<small>${esc(p.sub)}</small>` : ''}</figcaption></figure>`;
}
scrapHTML = function () {
  const M = S.me, all = scrapPages(), F = UI.sbf || '', L = F ? all.filter(p => scrapGroup(p) === F) : all;
  if (!all.length) return '<p class="muted">Nothing yet. The first page is waiting.</p>';
  const by = {}; for (const p of L) (by[yearOf(p.w)] = by[yearOf(p.w)] || []).push(p);
  const chips = `<p class="sb-chips">${SCRAP_FILT.map(([k, l]) => `<button class="tk-chip${F === k ? ' on' : ''}" data-sbf="${k}">${l} (${k ? all.filter(p => scrapGroup(p) === k).length : all.length})</button>`).join('')}</p>`;
  return chips + Object.entries(by).sort((a, b) => b[0] - a[0]).map(([y, ps]) => { const n = ps.length, firsts = ps.filter(p => /^First|Arrived/.test(p.t)).length, press = ps.filter(p => p.src === 'press').length;
    return `<section class="sb-year"><header class="sb-cover"><b>${y}</b><span>${n} page${n === 1 ? '' : 's'}${firsts ? ` · ${firsts} first${firsts === 1 ? '' : 's'}` : ''}${press ? ` · ${press} clipping${press === 1 ? '' : 's'}` : ''}</span></header><div class="sb-grid">${ps.slice(0, 60).map(scrapCard).join('')}</div></section>`; }).join('');
};
OS_VIEWS.scrapbook = () => scrapHTML();
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') document.addEventListener('click', e => { const t = e.target && e.target.closest ? e.target.closest('[data-sbf]') : null; if (!t) return; e.preventDefault(); e.stopPropagation(); UI.sbf = t.dataset.sbf || ''; render(true); }, true);
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.sb-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.sb-chips .tk-chip.on{background:var(--accent,#c84);color:#fff;border-color:transparent}
.sb-year{margin:0 0 22px}.sb-cover{display:flex;align-items:baseline;gap:12px;padding:8px 14px;border-radius:8px;background:linear-gradient(90deg,#3d2c1e,#6b4b2e);color:#f6ead7;margin-bottom:12px}.sb-cover b{font:700 26px Georgia,serif}.sb-cover span{font-size:12.5px;opacity:.85}
.sb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:18px 14px;padding:6px 4px;background:repeating-linear-gradient(0deg,transparent 0 23px,rgba(120,90,50,.06) 23px 24px)}
.sb-ph{margin:0;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.18);transition:transform .15s}.sb-ph:hover{transform:rotate(0) scale(1.03)!important;z-index:2}
.sb-polaroid{padding:8px 8px 10px}.sb-postcard{padding:6px;border:1px solid #e8dcc8;background:#fdf8ef}.sb-ticket{padding:8px;background:#fff7e0;border:2px dashed #d4a373}
.sb-img{aspect-ratio:16/9;overflow:hidden;background:#ddd}.sb-img svg{width:100%;height:100%;display:block}
.sb-ph figcaption{font:13px/1.35 'Segoe Print','Bradley Hand','Comic Sans MS',cursive;color:#333;padding-top:6px}.sb-ph figcaption b{display:block;font:600 10.5px var(--f-body,system-ui);letter-spacing:.06em;color:#8a7a66;text-transform:uppercase}.sb-ph figcaption small{display:block;color:#777;font-size:11.5px;margin-top:2px}
.sb-clip{margin:0;padding:10px 12px;background:#f4efe3;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.15);font-family:Georgia,serif;clip-path:polygon(0 2%,4% 0,30% 1%,62% 0,100% 2%,99% 40%,100% 98%,70% 100%,35% 99%,2% 100%,0 60%)}
.sb-paper{display:block;font:700 9.5px var(--f-body,system-ui);letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid #222;padding-bottom:3px;margin-bottom:6px}.sb-head{display:block;font-size:17px;line-height:1.15}.sb-dek{display:block;font-style:italic;font-size:12px;color:#555;margin-top:4px}
.sb-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.sb-cols i{height:28px;background:repeating-linear-gradient(0deg,#bbb 0 1px,transparent 1px 5px)}
.sb-stamp{margin:0;align-self:center;justify-self:center;width:160px;padding:12px;border:3px double #b5523b;border-radius:50%;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#b5523b;background:rgba(181,82,59,.04)}
.sb-stamp .sb-ic{font-size:26px}.sb-stamp b{font:700 13px var(--f-body,system-ui);text-transform:uppercase;letter-spacing:.06em}.sb-stamp small{font-size:10.5px;opacity:.85}.sb-stamp .sb-d{margin-top:3px;font-weight:600}`; document.head.appendChild(st); })();
