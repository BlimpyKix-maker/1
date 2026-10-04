// ---------------- The computer on your desk ----------------
// A desktop with apps: mail, a crew job site, the trades, the archive, your bank, a social feed, notes and a game
// for when you should be writing. Most open a window onto the game; a few are just for fiddling with.
const APPS = [
  ['mail', '✉️', 'Mail'], ['jobs', '💼', 'CrewList'], ['trades', '📰', 'The Daily Slate'], ['gea', '🎞️', 'REEL'], ['bank', '🏦', 'Bank'],
  ['flick', '📸', 'Clapgram'], ['notes', '📝', 'Notes'], ['sweep', '🎬', 'Clapper Sweep'], ['weather', '⛅', 'Weather'], ['write', '✍️', 'Scriptwriter']
];
// Flick: what your contacts post. Same posts every week for the same people (hash), plus their real life events.
const FLICK_POSTS = ['On set at 5am. Coffee number three. {film}', 'Wrapped! Thank you to the best crew in the world 🎬', 'Brunch with the best people', 'New headshots. Be honest.', 'The view from today\'s location 🌅', 'Rewatching an old favourite tonight. Some films just hold up.', 'Reading scripts in the park like a cliché', 'My dog has better taste in films than most critics', 'Can\'t say what I\'m working on. But it\'s big. 🤐', 'Festival season. Send help (and snacks).', 'Grateful.', 'This sunset did NOT need to go this hard'];
function flickFeed() {
  const M = S.me, out = [];
  for (const id of aliveKnown()) {
    const p = P(id);
    for (const e of (p.life || []).filter(e => S.week - e.w < 8)) out.push({ id: `l${id}-${e.w}`, who: id, w: e.w, t: e.t + '.' });
    const r = hashRand(id * 31 + S.week), film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id));
    if (r() < .35) out.push({ id: `p${id}-${S.week}`, who: id, w: S.week, t: FLICK_POSTS[Math.floor(r() * FLICK_POSTS.length)].replace('{film}', film ? '#' + film.title.replace(/\s+/g, '') : '') });
  }
  return out.sort((a, b) => b.w - a.w).slice(0, 20);
}
function likePost(a) { const M = S.me; M.liked = M.liked || {}; if (M.liked[a.post] || !M.known[a.who]) return false; M.liked[a.post] = S.week; addTie(ME(), P(a.who), .3); return true; }
// Clapper Sweep: a little minesweeper, kept in the page only (not in your career).
function sweepNew() { const n = 8, mines = new Set(); while (mines.size < 9) mines.add(Math.floor(Math.random() * n * n)); UI.sweep = { n, mines: [...mines], open: [], flag: [], over: 0 }; }
function sweepCount(i) { const G = UI.sweep, n = G.n, x = i % n, y = Math.floor(i / n); let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if ((dx || dy) && X >= 0 && Y >= 0 && X < n && Y < n && G.mines.includes(Y * n + X)) c++; } return c; }
function sweepOpen(i) {
  const G = UI.sweep; if (G.over || G.open.includes(i)) return;
  if (G.mines.includes(i)) { G.over = -1; G.open.push(...G.mines); return; }
  const stack = [i];
  while (stack.length) { const j = stack.pop(); if (G.open.includes(j)) continue; G.open.push(j); if (!sweepCount(j)) { const n = G.n, x = j % n, y = Math.floor(j / n); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < n && Y < n) stack.push(Y * n + X); } } }
  if (G.open.length >= G.n * G.n - G.mines.length) G.over = 1;
}
function notesKey() { return `applebox-notes-${S.seed}-${S.me ? S.me.id : 0}`; }
function appWindow(k) {
  const M = S.me, me = ME();
  switch (k) {
    case 'mail': return mailApp();
    case 'jobs': { const q = (UI.cq || '').toLowerCase(); const L = M.board.filter(p => !q || p.t.toLowerCase().includes(q) || (p.away && hubName(p.away).toLowerCase().includes(q))); return `<p><input id="cq" type="search" placeholder="Search jobs, cities…" value="${esc(UI.cq || '')}"> <span class="muted small">${L.length} listings · apply from the board</span> <button class="linkish" data-dtab="work">Open the board ›</button></p><ul class="plain">${L.slice(0, 20).map(p => `<li><b>${esc(p.t)}</b> <span class="muted">${p.film !== null ? esc(S.films[p.film].title) + ' · ' : ''}${p.away ? esc(hubName(p.away)) + ' · ' : ''}${p.rate ? fmtCash(p.rate) + '/day' : 'unpaid'} · ${oddsBand(hireOdds(p))}</span></li>`).join('')}</ul>`; }
    case 'trades': { const L = []; for (let i = S.news.length - 1; i >= 0 && L.length < 14; i--) L.push(i); return `<p class="eyebrow">The Daily Slate · ${fmtDate(S.week, true)}</p><ul class="plain">${L.map(i => `<li><a href="#" class="lk" data-go="article:${i}">${esc(S.news[i].text)}</a> <span class="muted small">${esc(S.news[i].type)}</span></li>`).join('')}</ul>`; }
    case 'gea': { const tabsG = `<p class="bf-row"><span class="gealogo">REEL</span> <button class="pill${UI.geatab !== 'star' ? ' on' : ''}" data-geatab="search">Search</button><button class="pill${UI.geatab === 'star' ? ' on' : ''}" data-geatab="star">⭐ Buzz Index</button></p>`; if (UI.geatab === 'star' && typeof starmeterHTML === 'function') return tabsG + starmeterHTML(); const q = (UI.gq || '').toLowerCase().trim(); const F = q.length > 1 ? S.films.filter(f => f.title.toLowerCase().includes(q)).slice(0, 8) : [], Pp = q.length > 1 ? S.people.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8) : []; return tabsG + `<p><input id="gq" type="search" placeholder="Search everything: films, people, companies, artists, songs, prizes, lessons…" value="${esc(UI.gq || '')}"></p>${F.length || Pp.length ? `<div class="cols two"><div><h4>Films</h4><ul class="plain">${F.map(f => `<li>${fl(f.id)} <span class="muted">${f.rel !== null ? yearOf(f.rel) : 'in production'}</span></li>`).join('')}</ul></div><div><h4>People</h4><ul class="plain">${Pp.map(p => `<li>${pl(p.id)} <span class="muted">${esc(ROLE_LABEL[p.role])}</span></li>`).join('')}</ul></div></div>` : '<p class="muted">Type at least two letters.</p>'}${typeof worldSearchHTML === 'function' ? worldSearchHTML(q) : ''}<p><button class="linkish" data-gea="films">Open the full archive ›</button></p>`; }
    case 'bank': { const life = ORIGIN.life[M.life], c = typeof myCo === 'function' ? myCo() : null; const money = M.diary.filter(d => /^Money:/.test(d.t)).slice(-6).reverse(); return `<div class="kpis mini"><div><span>Balance</span><b class="${M.cash < 0 ? 'bad' : ''}">${fmtCash(M.cash)}</b></div><div><span>Rent</span><b>${fmtCash(usd(life.rent))}/wk</b></div><div><span>Owed</span><b>${fmtCash(M.debt + (M.shark || 0))}</b></div>${c ? `<div><span>${esc(c.name)}</span><b>${fmtCash(Math.round(c.cash * 1e6))}</b></div>` : ''}</div><h4>Recent weeks</h4><ul class="plain">${money.map(d => `<li><time>${fmtDate(d.w, true)}</time> ${esc(d.t.replace(/^Money: /, ''))}</li>`).join('') || '<li class="muted">Nothing yet.</li>'}</ul>`; }
    case 'flick': if (typeof clapgramApp === 'function') return clapgramApp(); { const L = flickFeed(); return `<div class="flick">${L.map(x => `<div class="post">${phoneAvatar(x.who, 34)}<div><b>${pl(x.who)}</b> <span class="muted small">${S.week - x.w ? (S.week - x.w) + 'w' : 'this week'}</span><p>${esc(x.t)}</p>${(M.liked || {})[x.id] ? '<span class="muted small">♥ Liked</span>' : `<button class="linkish" data-like="${x.id}|${x.who}">♡ Like</button>`}</div></div>`).join('') || '<p class="muted">Nobody you know has posted anything. Meet more people.</p>'}</div>`; }
    case 'notes': if (typeof notebookApp === 'function') return notebookApp(); { let v = ''; try { v = localStorage.getItem(notesKey()) || ''; } catch (e) { /* no storage */ } return `<textarea id="pc-notes" rows="12" placeholder="Ideas, names, a scene you can't stop thinking about…">${esc(v)}</textarea><p class="muted small">Saved in this browser as you type.</p>`; }
    case 'sweep': { if (!UI.sweep) sweepNew(); const G = UI.sweep; return `<p class="muted small">${G.over > 0 ? 'Cleared! That\'s a wrap.' : G.over < 0 ? 'Boom. Reshoot?' : 'Find the clean takes. Avoid the 9 bad ones.'} <button class="btn-s ghost" data-sweep="new">New game</button></p><div class="sweep" style="grid-template-columns:repeat(${G.n}, 28px)">${Array.from({ length: G.n * G.n }, (_, i) => { const o = G.open.includes(i), m = G.mines.includes(i), c = o && !m ? sweepCount(i) : 0; return `<button class="cell${o ? ' open' : ''}${o && m ? ' mine' : ''}" data-sweep="${i}" ${o || G.over ? 'disabled' : ''}>${o ? (m ? '💥' : c || '') : ''}</button>`; }).join('')}</div>`; }
    case 'weather': if (typeof weatherApp === 'function') return weatherApp(); { const on = typeof worldOn === 'function' ? worldOn().filter(e => e.from <= S.week) : []; return `<p class="big">${esc(hubName(M.hub))}</p><p>${on.length ? on.map(e => { const W = WORLD_EVENTS.find(x => x.k === e.k); return `<b>${esc(W.t)}</b>: ${esc(W.d)}`; }).join('<br>') : 'Nothing unusual this week. Good filming weather.'}</p>`; }
    case 'write': return typeof scriptwriterApp === 'function' ? scriptwriterApp() : '';
    default: return appWindow2(k);
  }
  return '';
}
function computerPanel() {
  if (typeof osPanel === 'function') return osPanel();
  const k = UI.app, A = APPS.find(a => a[0] === k), anim = k && UI.prevApp !== k; UI.prevApp = k;
  const tint = i => ['#E8553E', '#F4B400', '#2E9A6E', '#3F8FBF', '#7E5AA6', '#C2577F', '#1C4E80', '#E08A3A', '#5E7C78', '#B23A3A'][i % 10];
  const dock = `<div class="dock">${APPS.map(([k2, ic, l], i) => `<button class="dk${k === k2 ? ' on' : ''}${appLocked(k2) ? ' locked' : ''}" data-app="${k === k2 ? '' : k2}" title="${esc(l)}${appLocked(k2) ? ' (in the App Store)' : ''}" style="--t:${tint(i)}"><span>${ic}</span><em>${esc(l)}</em></button>`).join('')}</div>`;
  return `<section class="panel computer"><div class="monitor${UI.wmax ? ' max' : ''}">${typeof menuBar === 'function' ? menuBar() : ''}<div class="desktop${A ? ' haswin' : ''}" style="background:${typeof WALLS !== 'undefined' ? WALLS[curWall()][1] : ''}">
    ${A ? `<div class="window${anim ? ' anim' : ''}"><div class="wbar"><span class="lights"><button class="tl r" data-app="" title="Close"></button><button class="tl y" data-app="" title="Minimise"></button><button class="tl g" data-wmax="1" title="${UI.wmax ? 'Restore' : 'Full screen'}"></button></span><span>${A[1]} ${esc(A[2])}</span><span></span></div><div class="wbody">${appWindow(k)}</div></div>` : (typeof desktopWidgets === 'function' ? desktopWidgets() : '')}
   </div>${dock}</div></section>`;
}
