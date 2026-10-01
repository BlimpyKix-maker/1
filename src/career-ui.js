// ---------- Career: saving ----------
// A save is the world's seed and settings plus the log of everything the player did.
const SAVE_KEY = 'applebox-career-v1';
function doAct(a) {
  if (!applyAct(a)) return false;
  (S.log = S.log || []).push(a);
  saveCareer();
  return true;
}
function saveCareer() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 6, seed: S.seed, year: S.startYear, depth: S.depth, log: S.log || [] })); } catch (e) { /* storage unavailable: the career lasts as long as the tab */ } }
function loadSave() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return s && s.v === 6 && Array.isArray(s.log) && s.log.length ? s : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nothing to clear */ } }

// ---------- Career: views ----------
const MAJOR_HUBS = HUB_IDS.filter(h => !HUBS[h].minor);
const PRON = { F: ['She', 'is'], M: ['He', 'is'], X: ['They', 'are'] };
function pron(p) { return PRON[p.g] || PRON.X; }
function suggestName(hub, g) {
  const N = NAMES[HUBS[hub].lang] || NAMES.en, r = a => a[Math.floor(Math.random() * a.length)];
  const f = r(g === 'X' ? N.M.concat(N.F) : N[g]), l = r(N.L);
  return EAST[HUBS[hub].lang] ? `${l} ${f}` : `${f} ${l}`;
}
function ccDefaults() {
  return { name: suggestName('hollywood', 'X'), g: 'X', age: 23, hub: 'hollywood', role: 'director', wealth: 'gettingby', edu: 'filmdir', arrival: 'plusone', build: 'everyday', quirk: 'none', points: {}, traits: [], love: ['Drama'], hate: [], favs: [], salt: Math.floor(Math.random() * 1e9), look: defaultLook() };
}
// Randomise the basics (name, pronouns, age, hub, dream job, look) or the whole page. Display-side randomness only:
// what you end up with is what gets saved.
function randomCC(all) {
  const R0 = () => Math.random(), pk = L => L[Math.floor(R0() * L.length)];
  const c = UI.cc;
  c.g = pk(['X', 'F', 'M']); c.hub = pk(MAJOR_HUBS); c.role = pk(DREAM_ROLES); c.age = 18 + Math.floor(R0() * 15);
  c.name = suggestName(c.hub, c.g);
  for (const k of LOOK_KEYS) { const opts = LOOK[k].opts.map((_, i) => i).filter(i => !WARDROBE_AT[k + ':' + i]); c.look[k] = k === 'head' || k === 'mark' || k === 'neck' || k === 'wrist' || k === 'ears' || k === 'glasses' ? (R0() < .7 ? 0 : pk(opts)) : pk(opts); }
  if (c.g === 'F') c.look.facial = 0;
  c.salt = Math.floor(R0() * 1e9);
  if (!all) return;
  for (const k of ['wealth', 'edu', 'arrival', 'build', 'quirk']) c[k] = pk(Object.keys(ORIGIN[k]));
  c.points = {}; let left = SKILL_POINTS; const crafts = Object.keys(CRAFTS);
  c.points[MAIN[c.role]] = Math.min(SKILL_MAX, 2 + Math.floor(R0() * 3)); left -= c.points[MAIN[c.role]];
  while (left > 0) { const cr = pk(crafts); if ((c.points[cr] || 0) < SKILL_MAX) { c.points[cr] = (c.points[cr] || 0) + 1; left--; } }
  c.traits = []; for (let i = 0; i < 40 && c.traits.length < 3; i++) { const t = pk(PLAYER_TRAITS); if (!c.traits.includes(t) && !traitClash(c.traits, t) && (t !== 'Late bloomer' || c.age >= 26)) c.traits.push(t); }
  const G = GENRES.slice().sort(() => R0() - .5); c.love = G.slice(0, 1 + Math.floor(R0() * 3)); c.hate = R0() < .5 ? [] : G.slice(4, 5 + Math.floor(R0() * 2));
  c.favs = []; while (c.favs.length < 5) { const id = randomFav(c); if (!id) break; c.favs.push(id); }
}
function ccSpent(c) { return Object.values(c.points).reduce((s, v) => s + v, 0); }
const optCard = (group, key, o, on) => `<button class="opt${on ? ' on' : ''}" data-cc="${group}" data-v="${esc(key)}" aria-pressed="${on}"><b>${esc(o.label)}</b><span>${esc(o.d)}</span></button>`;
// favourite films: every catalogue film made before the start, searchable by title
function filmChoices() {
  if (UI.filmIdx && UI.filmIdx.y === S.startYear) return UI.filmIdx;
  const list = Object.values(S.cat.allFilms).filter(f => f.y < S.startYear).sort((a, b) => a.t.localeCompare(b.t));
  const byLabel = {};
  for (const f of list) { byLabel[`${f.t} (${f.y})`] = f.id; byLabel[`${f.t} (${f.y}) · ${f.real}`] = f.id; }
  return (UI.filmIdx = { y: S.startYear, list, byLabel });
}
// Random favourite: leans hard toward the genres you love, but almost anything can come up, weighted by how
// widely seen and how cherished a film is.
function randomFav(c) {
  const { list } = filmChoices(), have = new Set(c.favs);
  const w = f => have.has(f.id) ? 0 : (c.love.includes(f.g) ? 5 : c.hate.includes(f.g) ? .08 : 1) * (.25 + (f.dr ? Math.log10(1 + f.dr * cpi(2027) / cpi(f.y)) : 0) + Math.max(0, f.q - 40) / 25 + (f.cult || 0) / 30 + (f.list ? 1.2 : 0));
  let t = 0; const ws = list.map(f => { const x = w(f); t += x; return x; });
  let r = Math.random() * t;
  for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i].id; }
  return null;
}
// owned: wardrobe pieces the player has bought; anything else from the shop stays off the list.
function lookControls(c, owned = []) {
  return `<div class="looks">${LOOK_KEYS.map(k => { const L = LOOK[k], v = c.look[k] ?? 0, swatch = L.opts[0].startsWith('#');
    const ok = i => { const it = WARDROBE_AT[k + ':' + i]; return !it || owned.includes(it); };
    return `<div class="lk-row"><span class="muted">${L.label}</span>${swatch ? `<span class="sw">${L.opts.map((o, i) => `<button class="swb${i === v ? ' on' : ''}" style="background:${o}" data-look="${k}:${i}" aria-label="${L.label} ${i + 1}" aria-pressed="${i === v}"></button>`).join('')}</span>` : `<select data-lookk="${k}">${L.opts.map((o, i) => ok(i) ? `<option value="${i}"${i === v ? ' selected' : ''}>${esc(o)}${WARDROBE_AT[k + ':' + i] ? ' ★' : ''}</option>` : '').join('')}</select>`}</div>`; }).join('')}</div>`;
}
// The wardrobe shop: things money buys that change how you look and, sometimes, how your rolls go.
function wardrobeShop() {
  const M = S.me;
  return `<h4>Wardrobe shop</h4><div class="shop">${Object.entries(WARDROBE).map(([id, W]) => { const own = M.owned.includes(id), nm = LOOK[W.slot].opts[W.opt];
    return `<div class="shop-item${own ? ' owned' : ''}">${portraitSVG(Object.assign(defaultLook(), M.look, { [W.slot]: W.opt }), S.year - ME().born, 56)}<div><b>${esc(nm)}</b> <span class="muted">${esc(LOOK[W.slot].label.toLowerCase())}</span><p class="muted">${esc(W.d)}</p><p>${fxBadges(W)}</p>${own ? '<span class="chip t-Award">Owned</span>' : `<button class="btn-s" data-buy="${id}"${M.cash < W.price ? ' disabled' : ''}>Buy ${usd(W.price)}</button>`}</div></div>`; }).join('')}</div>`;
}
function viewCreator() {
  const c = UI.cc = UI.cc || ccDefaults();
  const left = SKILL_POINTS - ccSpent(c);
  const grid = (group, src) => `<div class="opts">${Object.entries(src).map(([k, o]) => optCard(group, k, o, c[group] === k)).join('')}</div>`;
  const fc = filmChoices();
  const favRow = (i) => { const id = c.favs[i], f = id ? S.cat.allFilms[id] : null; return `<li>${f ? `<b>${esc(f.t)}</b> <span class="muted">${f.y} · ${esc(f.g.toLowerCase())}</span> <button class="linkish" data-cc="unfav" data-v="${i}">Remove</button>` : `<input class="favin" data-fav="${i}" list="cc-films" placeholder="Type a title, real or in-game…" aria-label="Favourite film ${i + 1}">`}</li>`; };
  const genreChip = (g, kind) => { const on = c[kind].includes(g), other = kind === 'love' ? c.hate.includes(g) : c.love.includes(g), full = !on && c[kind].length >= (kind === 'love' ? 3 : 2); return `<button class="chip trait tbtn${on ? ' on' : ''}" data-cc="${kind}" data-v="${esc(g)}" aria-pressed="${on}" ${other || full ? 'disabled' : ''}>${esc(g)}</button>`; };
  const traitBtn = t => { const on = c.traits.includes(t), blocked = !on && (c.traits.length >= 3 || traitClash(c.traits, t)); return `<button class="chip trait tbtn${on ? ' on' : ''}" data-cc="trait" data-v="${esc(t)}" aria-pressed="${on}" ${blocked ? 'disabled' : ''} title="${esc(TRAITS[t].d)}">${esc(t)} <span class="muted">· ${esc(TRAITS[t].d)}</span> ${fxBadges(TRAITS[t])}</button>`; };
  return `<div class="head"><p class="eyebrow">Your career</p><h2>Who are you?</h2><p class="lede">You arrive on the last night of ${S.startYear - 1}, at a New Year's Eve party full of people who already work in film. Every choice here changes something: what you can do, who you know, what you owe. No build is best.</p><p class="lede">After that the world is yours. Thousands of people are already making films around you; you can chase a credit, a cult hit, an award, a fortune or a circle of collaborators you'd walk through fire for. Green marks show what helps a roll, red what hurts it.</p></div>
  <div class="ccrand"><button class="btn-s" data-randcc="basics">Randomise the basics</button> <button class="btn-s" data-randcc="all">Randomise everything</button> <span class="muted">Then tweak anything, or just go to the party.</span></div>
  <section class="panel cc"><h3>The basics</h3>
   <div class="ccface"><div class="pf">${portraitSVG(c.look, c.age, 150)}</div><div>
   <div class="ccrow"><label>Name <input id="cc-name" type="text" maxlength="40" value="${esc(c.name)}"></label><button class="linkish" data-cc="rename">Suggest another</button></div>
   <div class="ccrow"><label>Pronouns <select id="cc-g">${[['X', 'they/them'], ['F', 'she/her'], ['M', 'he/him']].map(([v, t]) => `<option value="${v}"${c.g === v ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
   <label>Age <input id="cc-age" type="number" min="18" max="45" value="${c.age}"></label>
   <label>Home hub ${sel('cc-hub', MAJOR_HUBS.map(h => [h, HUBS[h].name]), c.hub)}</label>
   <label>Dream job ${sel('cc-role', DREAM_ROLES.map(r => [r, ROLE_LABEL[r]]), c.role)}</label></div>
   <p class="note">Living costs and pay follow the hub's economy in ${S.startYear}. Younger characters have more room to grow; older ones start more skilled. Your portrait ages with you, and you can change your style later.</p></div></div>
   <h4>Your look</h4>${lookControls(c)}</section>
  <section class="panel cc"><h3>Origin</h3><h4>Family money</h4>${grid('wealth', ORIGIN.wealth)}<h4>Education</h4><p class="muted">Degrees count later: some jobs and internships ask for them.</p>${grid('edu', ORIGIN.edu)}<h4>How you got to the party</h4>${grid('arrival', ORIGIN.arrival)}</section>
  <section class="panel cc"><h3>Build</h3>${grid('build', ORIGIN.build)}</section>
  <section class="panel cc"><h3>Skills <span class="count">${left} of ${SKILL_POINTS} points left</span></h3>
   <p class="muted">Everyone starts near the bottom (around 3 to 5 out of 20; 10 is a working professional). Each point raises every part of a craft by about three quarters of a point. Your education adds more. Your hidden ceiling in each skill is set when you begin.</p>
   <table class="atts">${Object.keys(CRAFTS).map(cr => { const v = c.points[cr] || 0; return `<tr><td>${CRAFTS[cr].label}${cr === MAIN[c.role] ? ' <span class="muted">(dream job +1)</span>' : ''}</td><td class="n"><button class="pm-b" data-cc="pt" data-v="${cr}:-1" ${v <= 0 ? 'disabled' : ''} aria-label="Less ${CRAFTS[cr].label}">−</button> <b>${v}</b> <button class="pm-b" data-cc="pt" data-v="${cr}:1" ${v >= SKILL_MAX || left <= 0 ? 'disabled' : ''} aria-label="More ${CRAFTS[cr].label}">+</button></td><td class="bc">${bar(v, SKILL_MAX, 'accent')}</td></tr>`; }).join('')}</table></section>
  <section class="panel cc"><h3>Personality <span class="count">${c.traits.length} of 3</span></h3><p class="muted">Pick up to three. Most cut both ways; some give advantage on certain rolls, some disadvantage. Contradictory traits can't be combined.</p>
   <div class="traits">${PLAYER_TRAITS.filter(t => t !== 'Late bloomer' || c.age >= 26).map(traitBtn).join('')}</div></section>
  <section class="panel cc"><h3>Taste</h3>
   <h4>Favourite genres <span class="count">${c.love.length} of 3</span></h4><div class="traits">${GENRES.map(g => genreChip(g, 'love')).join('')}</div>
   <h4>Genres you can't stand <span class="count">optional, ${c.hate.length} of 2</span></h4><div class="traits">${GENRES.map(g => genreChip(g, 'hate')).join('')}</div>
   <p class="note">Jobs on films in a genre you love lower your stress and teach you faster; genres you hate wear you down.</p>
   <h4>Five favourite films <span class="count">optional</span></h4>
   <ol class="favs">${[0, 1, 2, 3, 4].map(favRow).join('')}</ol>
   <datalist id="cc-films">${fc.list.map(f => `<option value="${esc(f.t)} (${f.y}) · ${esc(f.real)}">`).join('')}</datalist>
   <div class="ccrow"><button class="btn" data-cc="randfav">${c.favs.length >= 5 ? 'Reroll all five' : 'Fill the rest at random'}</button><span class="muted">Random picks lean toward your favourite genres, weighted by how widely seen and loved a film is.</span></div>
   <p class="note">Films you love sharpen the skills their genre leans on, and they come up in conversation.</p></section>
  <section class="panel cc"><h3>Something from your past</h3>${grid('quirk', ORIGIN.quirk)}</section>
  <div class="ccgo"><button class="btn primary big-btn" data-cc="go">Go to the party</button><p class="muted">Or just watch the industry run: use the other tabs and the buttons up top.</p></div>`;
}

function rollChip(r) { return r ? `<span class="roll ${r.ok ? 'good' : 'bad'}">${esc(rollText(r))}</span>` : ''; }
// A roll you can feel: the d20 itself, a track from 1 to 25 with the target marked, and a verdict. The newest roll
// tumbles in once; old ones sit still.
function d20SVG(n, cls) {
  return `<svg class="d20 ${cls || ''}" viewBox="0 0 40 40" aria-hidden="true"><polygon points="20,2 37,11 37,29 20,38 3,29 3,11" class="d20-body"/><polygon points="20,8 32,29 8,29" class="d20-face"/><path d="M20 2 L20 8 M37 11 L32 29 M3 11 L8 29 M37 29 L32 29 M3 29 L8 29 M20 38 L20 34" class="d20-edge"/><text x="20" y="25" text-anchor="middle">${n}</text></svg>`;
}
function rollCard(r, small) {
  if (!r) return '';
  const fresh = r.n && r.n > (UI.seenRoll || 0);
  if (fresh) UI.pendingSeen = Math.max(UI.pendingSeen || 0, r.n);
  const tot = r.d + r.mod, lo = 1, hi = 25, pos = v => clamp((v - lo) / (hi - lo) * 100, 0, 100);
  const verdict = r.crit > 0 ? 'Natural 20!' : r.crit < 0 ? 'Natural 1' : r.ok ? (tot - r.DC >= 5 ? 'Comfortably' : 'Made it') : (r.DC - tot <= 2 ? 'So close' : 'Missed');
  const dice = (r.dice || [r.d]).map((d, i, a) => d20SVG(d, a.length > 1 && d !== r.d ? 'spent' : (a.length > 1 && i > 0 && a[0] === d ? 'spent' : ''))).join('');
  const why = (r.why || []).length ? ` · ${r.why.join(', ')}` : '';
  return `<div class="rollcard ${r.ok ? 'win' : 'lose'}${r.crit > 0 ? ' crit' : r.crit < 0 ? ' fumble' : ''}${fresh ? ' fresh' : ''}${small ? ' small' : ''}">
    <div class="dice">${dice}</div>
    <div class="rc-body"><div class="verdict">${verdict}</div>
     <div class="track" title="${esc(rollText(r))}"><span class="need" style="left:${pos(r.DC)}%"><i>needs ${r.DC}</i></span><span class="got" style="left:${pos(tot)}%"><i>${tot}</i></span></div>
     <small>${esc(statLabel(r.stat))}: rolled ${r.d}${r.mod ? (r.mod > 0 ? ' + ' : ' − ') + Math.abs(r.mod) : ''} = ${tot}, needed ${r.DC}${r.adv > 0 ? ' · advantage' : r.adv < 0 ? ' · disadvantage' : ''}${esc(why)}</small></div></div>`;
}
// The odds before you commit, spelled out: the target, your modifier, advantage, the reasons and the chance.
function oddsBar(stat, dc) {
  const c = checkInfo(stat, dc), p = Math.round(c.p * 100), hard = c.DC >= 14;
  return `<span class="oddsbar" title="${esc(c.why.join(', '))}"><span class="ob-dc" title="Target: roll this or more on d20 plus your modifier">DC ${c.DC}</span><span class="ob-l">${esc(statLabel(stat))} ${c.mod >= 0 ? '+' : '−'}${Math.abs(c.mod)}</span>${c.adv > 0 ? '<em class="adv" title="Roll two dice, keep the higher">⚀⚀ advantage</em>' : c.adv < 0 ? '<em class="dis" title="Roll two dice, keep the lower">⚀⚀ disadvantage</em>' : ''}<span class="ob-t"><i style="width:${p}%" class="${p < 35 ? 'lo' : p < 65 ? 'mid' : 'hi'}"></i></span><b>${p}%</b>${hard ? '<em class="big">★ big reward</em>' : ''}${c.why.length ? `<span class="ob-why">${esc(c.why.join(' · '))}</span>` : ''}</span>`;
}
// The roll, full screen: the die (or two) spins through numbers, lands, the total slides to the target, then the verdict.
function showRollOverlay(r) {
  if (!r || typeof document === 'undefined' || !document.body || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const old = document.getElementById('rollov'); if (old) old.remove();
  const dice = r.dice || [r.d], tot = r.d + r.mod, pos = v => clamp((v - 1) / 24 * 100, 0, 100);
  const el = document.createElement('div');
  el.id = 'rollov';
  el.innerHTML = `<div class="ro-box ${r.ok ? 'win' : 'lose'}${r.crit > 0 ? ' crit' : r.crit < 0 ? ' fumble' : ''}"><p class="ro-what">${esc(statLabel(r.stat))} check · needs <b>${r.DC}</b>${r.adv > 0 ? ' · <span class="adv">advantage: keep the higher</span>' : r.adv < 0 ? ' · <span class="dis">disadvantage: keep the lower</span>' : ''}</p>
    <div class="ro-dice">${dice.map((d, i) => `<div class="ro-die" data-final="${d}" data-keep="${d === r.d && (i === 0 || dice[0] !== r.d) ? 1 : 0}">${d20SVG('?')}</div>`).join('')}</div>
    <p class="ro-math">roll <b class="ro-d">?</b> ${r.mod >= 0 ? '+' : '−'} ${Math.abs(r.mod)} = <b class="ro-t">?</b></p>
    <div class="track ro-track"><span class="need" style="left:${pos(r.DC)}%"><i>needs ${r.DC}</i></span><span class="got" style="left:0%"><i>…</i></span></div>
    <p class="ro-verdict"></p><p class="ro-why muted small">${esc((r.why || []).join(' · '))}</p><button class="btn-s ro-ok">Continue</button></div>`;
  document.body.appendChild(el);
  const dies = [...el.querySelectorAll('.ro-die')];
  let n = 0;
  const spin = setInterval(() => { n++; dies.forEach(d => { d.querySelector('text').textContent = 1 + Math.floor(Math.random() * 20); }); if (n > 16) { clearInterval(spin); land(); } }, 65);
  const land = () => {
    dies.forEach(d => { d.querySelector('text').textContent = d.dataset.final; d.classList.add('landed'); if (dies.length > 1 && d.dataset.keep !== '1') d.classList.add('spent'); });
    el.querySelector('.ro-d').textContent = r.d; el.querySelector('.ro-t').textContent = tot;
    setTimeout(() => { const g = el.querySelector('.ro-track .got'); g.style.left = pos(tot) + '%'; g.querySelector('i').textContent = tot; }, 250);
    setTimeout(() => { el.querySelector('.ro-verdict').textContent = r.crit > 0 ? 'Natural 20!' : r.crit < 0 ? 'Natural 1' : r.ok ? (tot - r.DC >= 5 ? 'Comfortably' : 'Made it') : (r.DC - tot <= 2 ? 'So close' : 'Missed'); el.querySelector('.ro-box').classList.add('done'); }, 700);
  };
  const close = () => { clearInterval(spin); el.remove(); };
  el.addEventListener('click', e => { if (e.target.closest('.ro-ok') || e.target === el) close(); });
}
// What a trait, garment or piece of furniture does, as badges.
function fxBadges(o) {
  const b = [];
  for (const k of o.adv || []) b.push(`<span class="fx up">▲ ${esc(statLabel(k))}</span>`);
  for (const k of o.dis || []) b.push(`<span class="fx down">▼ ${esc(statLabel(k))}</span>`);
  for (const k in o.bonus || {}) b.push(`<span class="fx ${o.bonus[k] > 0 ? 'up' : 'down'}">${o.bonus[k] > 0 ? '+' : ''}${o.bonus[k]} ${esc(statLabel(k))}</span>`);
  const f = o.fx || {};
  if (f.energy) b.push(`<span class="fx up">+${f.energy} energy/wk</span>`);
  if (f.stress) b.push(`<span class="fx ${f.stress < 0 ? 'up' : 'down'}">${f.stress > 0 ? '+' : '−'}${Math.abs(f.stress)} stress/wk</span>`);
  if (f.pages) b.push(`<span class="fx up">+${f.pages} pages/day</span>`);
  if (f.standing) b.push(`<span class="fx up">standing ↑</span>`);
  for (const k in f.grow || {}) b.push(`<span class="fx up">${esc(statLabel(k))} ↑</span>`);
  if (f.train) b.push(`<span class="fx up">${esc(CRAFTS[f.train].label)} classes ×1.4</span>`);
  if (o.lucky) b.push('<span class="fx up">reroll a natural 1</span>');
  return b.join(' ');
}
function viewParty() {
  const M = S.me, pt = M.party;
  const sc = partyScene(pt);
  const opts = sc.rooms ? `<div class="rooms">${sc.rooms.map(r => `<button class="opt" data-party="${r.k}"><b>${esc(r.where)}</b><span>${esc(r.who)} is there</span></button>`).join('')}</div>`
    : `<div class="choices">${sc.opts.map(o => `<button class="choice" data-party="${o.k}"><b>${esc(o.label)}</b>${o.check ? oddsBar(o.check[0], o.check[1]) : ''}</button>`).join('')}</div>`;
  return `<div class="head partyhead"><div class="pf">${portraitOf(ME(), 72)}</div><div><p class="eyebrow">New Year's Eve · ${S.startYear - 1}</p><h2>${esc(sc.title)}</h2></div></div>
  ${(pt.log || []).map(l => `<div class="plog"><span class="muted">${esc(l.title)}.</span> ${esc(l.choice)}${rollCard(l.roll, true)}<p>${esc(l.t)}</p></div>`).join('')}
  <section class="panel scene"><p class="big-p">${esc(sc.text)}</p>${sc.sys ? `<p class="sys"><b>How it works</b> ${esc(sc.sys)}</p>` : ''}${opts}</section>
  <p class="note">${pt.drinks >= 3 ? 'You have had a few: disadvantage on your rolls until you sober up.' : 'Rolls are a d20 plus your modifier against the difficulty. A natural 20 always works; a natural 1 never does.'}</p>`;
}

function meter(label, v, cls, txt) { return `<div class="rep"><span>${label}</span>${bar(v, 100, cls)}<b>${txt ?? Math.round(v)}</b></div>`; }
const ACT_ICON = { work: '🎬', hunt: '📋', network: '🥂', catchup: '☕', write: '✍️', train: '🎓', hustle: '🛵', rest: '🛋️' };
const DAY_FLAVOUR = {
  work: ['A long day on set. You learn three things nobody wrote down.', 'Call time at six. Wrap at eight. Worth it.', 'You keep your head down and your ears open.'],
  hunt: ['You comb the board, rewrite your cover note twice, and send nothing you\'re ashamed of.', 'Emails, calls, a coffee with a stranger who knows a guy.', 'You trawl the trades for anything hiring.'],
  write: ['The pages come slowly, then all at once.', 'You write a scene you love and a scene you\'ll cut.', 'Blank page, cold coffee, four decent pages.'],
  train: ['A class full of people as hungry as you.', 'You practise until it stops feeling like practice.', 'The teacher notices you. Small victories.'],
  hustle: ['A bar shift. The tips are fine; the stories are better.', 'Deliveries across town. Rent is rent.', 'You pour drinks for people who make films.'],
  rest: ['You sleep late and call home.', 'A long walk, a cheap meal, no screens.', 'Friends outside the business remind you there is an outside.']
};
// The week as a strip of days: lived days show what happened, today's card has the button, later days can still change.
// One inbox item: what happened, the choices if it's waiting on you, and how it turned out.
function inboxCard(it) {
  return `<div class="mh"><time>${fmtDate(it.w, true)}</time><b>${esc(it.title)}</b></div><p>${esc(it.text)}${it.film !== undefined ? ' ' + fl(it.film) : ''}</p>
    ${it.choices && !it.done ? `<div class="choices">${it.choices.map(c => `<button class="choice${c.check && c.check[1] >= 13 ? ' hard' : ''}" data-pick="${it.id}:${c.k}" ${c.dis ? 'disabled' : ''}><b>${esc(c.label)}</b>${c.dis ? `<span class="odds">${esc(c.dis)}</span>` : c.check ? oddsBar(c.check[0], c.check[1]) : '<span class="odds">No roll</span>'}</button>`).join('')}</div>` : ''}
    ${it.result ? `<div class="res">${rollCard(it.result.roll, true)}<p>${esc(it.result.t)}</p>${it.result.teach ? `<p class="teach"><b>How the job works:</b> ${esc(it.result.teach)}</p>` : ''}</div>` : ''}`;
}
// Today, as it happens: a card for each beat lived so far, any decision waiting, and what's next.
function todayPanel() {
  const M = S.me, W = M.wk, d = W ? W.day : 0, b = W ? W.beat : 0, plan = effectivePlan();
  const cards = W ? W.cards.filter(c => c.d === d) : [];
  const pend = pending();
  const nextLabel = b === 0 ? `Morning, then ${ACTIVITIES[plan[d]].label.toLowerCase()}` : b === 1 ? ACTIVITIES[plan[d]].label : eveningOf(M.eve[d] || 'home').label;
  return `<section class="panel today"><h3>${esc(fmtDay(d))}</h3>
   <ol class="beats">${cards.map(c => `<li class="beat done"><span class="bi">${c.icon}</span><div><b>${BEAT_NAMES[c.b]} · ${esc(c.title)}</b>${c.lines.map(l => `<p>${esc(l)}</p>`).join('')}${rollCard(c.roll, true)}</div></li>`).join('')}
    ${pend.map(it => `<li class="beat decide"><span class="bi">❗</span><div>${inboxCard(it)}</div></li>`).join('')}
    ${pend.length ? '' : `<li class="beat next"><span class="bi">${BEAT_NAMES[b] === 'Evening' ? '🌆' : b === 0 ? '🌅' : ACT_ICON[plan[d]] || '•'}</span><div><b>Next: ${BEAT_NAMES[b]}</b><p class="muted">${esc(nextLabel)}</p><p><button class="btn-s" data-next="1">Live it</button> <button class="btn-s ghost" data-day="1">Rest of the day</button></p></div></li>`}</ol>
   ${conditionsHTML()}</section>`;
}
function conditionsHTML() {
  const C = conditionsOf();
  return C.length ? `<div class="conds">${C.map(c => `<span class="cond ${c.adv ? 'up' : 'down'}" title="${esc(c.d)}"><b>${esc(c.label)}</b> ${esc(c.d)}</span>`).join('')}</div>` : '<p class="muted small">You feel fine: no effects on your rolls.</p>';
}
// The week ahead: what you do each day and each evening. Days already lived are fixed.
function weekGrid(actOpts) {
  const M = S.me, W = M.wk, plan = effectivePlan(), d0 = W ? W.day : 0, b0 = W ? W.beat : 0;
  const eveOpts = Object.entries(EVENINGS).map(([k, e]) => [k, e.label]).concat(typeof cityEveningOpts === 'function' ? cityEveningOpts() : []);
  return `<div class="wgrid">${DAYS7.map((dn, i) => {
    const pastDay = i < d0 || (i === d0 && b0 > 1), pastEve = i < d0;
    const a = plan[i];
    const dayCell = pastDay ? `<span class="muted">${ACT_ICON[a] || ''} ${esc(ACTIVITIES[a].label)}</span>` : a === 'work' ? `<span class="chip">Work</span>` : M.burnout && W && W.burnt ? '<span class="bad">Rest</span>' : sel('pl-' + i, actOpts, M.plan[i]);
    const eveCell = pastEve ? `<span class="muted">${esc(eveningOf(M.eve[i] || 'home').label)}</span>` : sel('ev-' + i, eveOpts, M.eve[i] || 'home');
    return `<div class="wd${i === d0 ? ' now' : ''}${pastEve ? ' past' : ''}"><b>${dn.slice(0, 3)}</b><label>Day ${dayCell}</label><label>Evening ${eveCell}</label></div>`;
  }).join('')}</div>
  <div class="skip"><span class="muted">Skip ahead with this plan (stops at any decision):</span> <button class="btn-s ghost" data-endweek="1">Rest of the week</button> <button class="btn-s ghost" data-endweek="2">2 weeks</button> <button class="btn-s ghost" data-endweek="4">4 weeks</button> <button class="btn-s ghost" data-endweek="12">12 weeks</button></div>`;
}
// How the game works, in one place. Opens by itself the first time you reach your desk.
function guidePanel() {
  const ex = { stat: 'cha', d: 14, dice: [14], mod: 1, DC: 12, adv: 0, ok: true, crit: 0, why: ['Charming'] };
  return `<section class="panel guide"><h3>How this works <button class="linkish" data-guide="">Close</button></h3>
   <div class="g-grid">
    <div><h4>It's your world</h4><p>There is no script. A whole film industry runs around you week by week: studios rise and fall, films open and flop, people you met at a party become famous or vanish. You're one more person in it. Pick a dream and chase it, change your mind, build a circle of collaborators and grow your own corner of the business into something you're proud of.</p>
     <p class="muted">Some goals people set themselves: a first screen credit · a film of your own · a festival prize · a home worth coming back to · a crew who follows you from job to job · a studio with your name on it.</p></div>
    <div><h4>A week</h4><p>Plan six slots: Monday to Friday and the weekend. Press <b>Next day</b> to live one day at a time and see how it goes, or <b>End week</b> to live the rest. The week closes with pay, replies to your applications, rent and the news. <b>Skip ahead</b> repeats your plan for longer.</p>
     <p class="muted">Energy drains with work and returns with rest. Stress builds with rejection and bills. Let either run too far and you'll burn out for a week.</p></div>
    <div><h4>Rolls</h4><p>Risky moments roll a twenty-sided die. Your stat adds or subtracts; traits, clothes and the state you're in can give <span class="fx up">▲ advantage</span> (roll twice, keep the best) or <span class="fx down">▼ disadvantage</span>. A natural 20 always works and a natural 1 always fails. Before you choose, the bar shows your odds.</p>${rollCard(ex, true)}</div>
    <div><h4>Work and people</h4><p>The board lists jobs on real productions around you. Your odds depend on your skills, who you know, your standing and luck; hover them to see why. Everyone you meet remembers you: opinion is whether they like you, trust is whether they believe you, and favours are what they owe.</p></div>
    <div><h4>Money and things</h4><p>Money pays the rent first. After that it buys clothes, a better place and things for it. Some help: a desk means more pages, a proper bed better rest, a vintage watch advantage on work ethic. Look for the green and red badges.</p></div>
    <div><h4>Real history</h4><p>The films and people of real film history are here under new names, with their real credits, trivia and rumours (switch on <i>Cinephile notes</i> on any film or person). From the day you arrive, history is yours to change.</p></div>
   </div></section>`;
}
// The writing desk: your scripts, how far along, how good, and what to do with them.
function writingDesk() {
  const M = S.me, L = M.scripts || [], known = Object.keys(M.known).map(Number).filter(id => !P(id).dead);
  const f = UI.newScript = UI.newScript || { genre: M.love[0] || 'Drama', theme: topThemes(voiceOf())[0] || 'family', tone: 'bittersweet', title: '' };
  const row = sc => {
    const pct = Math.round(sc.pages / sc.target * 100);
    return `<div class="script"><div class="sh"><b>${esc(sc.title)}</b> <span class="muted">${esc(sc.genre)} · ${esc(THEMES[sc.theme])} · ${esc(TONES[sc.tone])} · draft ${sc.draft}</span>${sc.grade ? ` <span class="grade g${sc.grade}">${sc.grade}</span>` : ''}${sc.won ? ' ' + chip('Prize', 'good') : ''}</div>
      <p class="muted">${esc(sc.logline)}</p>
      ${sc.stage === 'writing' ? `<div class="pbar"><i style="width:${pct}%"></i></div><p class="small">${sc.pages} of ${sc.target} pages${M.activeScript === sc.id ? ' · <b>writing this one</b>' : ` · <button class="linkish" data-activescript="${sc.id}">Write this one</button>`}</p>`
        : `<p class="small"><button class="btn-s ghost" data-rewrite="${sc.id}">Rewrite (draft ${sc.draft + 1})</button>
          <select data-share="${sc.id}"><option value="">Show it to…</option>${known.filter(id => !sc.shared.includes(id)).map(id => { const t = tasteOf(P(id)); return `<option value="${id}">${esc(P(id).name)}${t.genres.includes(sc.genre) ? ' ♥ ' + esc(sc.genre.toLowerCase()) : ''}</option>`; }).join('')}</select>
          ${CONTESTS.filter(c => !(sc.entered || []).includes(c.k)).map(c => `<button class="btn-s ghost" data-contest="${sc.id}:${c.k}" title="${esc(c.d)}">${esc(c.name)} (${fmtCash(usd(c.fee))})</button>`).join(' ')}</p>`}</div>`;
  };
  return `<section class="panel"><h3>Writing desk</h3>${L.length ? L.slice().reverse().map(row).join('') : '<p class="muted">No scripts yet. Every writer you admire started with a blank page and a stubborn idea.</p>'}
   ${L.filter(x => x.stage === 'writing').length < 2 ? `<details class="newscript"${L.length ? '' : ' open'}><summary>Start a new script</summary>
    <div class="ns"><label>Title <input id="ns-title" value="${esc(f.title)}" placeholder="Leave blank for a working title"></label>
    <label>Genre ${sel('ns-genre', GENRES.map(g => [g, g + (M.love.includes(g) ? ' ♥' : (M.hate || []).includes(g) ? ' ✗' : '')]), f.genre)}</label>
    <label>Theme ${sel('ns-theme', THEME_KEYS.map(k => [k, THEMES[k] + (topThemes(voiceOf()).includes(k) ? ' ★' : '')]), f.theme)}</label>
    <label>Tone ${sel('ns-tone', Object.entries(TONES), f.tone)}</label>
    <button class="btn-s" data-newscript="1">Begin</button></div>
    <p class="muted small">♥ genres you love write better; ✗ genres you hate write worse. ★ themes are already part of your voice. Plan writing days (or late-night writing) to make progress.</p></details>` : ''}</section>`;
}
// School and representation: the two longer roads.
function pathsPanel() {
  const M = S.me, ags = agenciesIn(M.hub);
  const sc = M.school, P0 = sc ? PROGRAMS[sc.prog] : null;
  const school = sc ? `<p><b>${esc(P0.label)}</b> in ${esc(CRAFTS[sc.craft].label.toLowerCase())}: week ${sc.done} of ${P0.weeks}. Plan <b>${P0.days} study day${P0.days > 1 ? 's' : ''}</b> a week${sc.missed ? ` <span class="bad">(missed ${sc.missed} week${sc.missed > 1 ? 's' : ''}; four and you're out)</span>` : ''}. ${P0.fee > 0 ? fmtCash(usd(P0.fee)) + ' a week.' : 'Pays ' + fmtCash(usd(-P0.fee)) + ' a week.'}</p><div class="pbar"><i style="width:${Math.round(sc.done / P0.weeks * 100)}%"></i></div><p><button class="linkish" data-dropout="1">Drop out</button></p>`
    : !UI.courses ? `<p class="muted">Courses grow one craft fast; degrees open doors that ask for one.${M.degrees.length ? ` You have: ${M.degrees.map(d => ({ ba: 'a degree', mfa: 'an MFA', cert: 'a certificate', union: 'union training' }[d] || 'a ' + d + ' degree')).join(', ')}.` : ''}</p><p><button class="btn-s ghost" data-courses="1">Browse courses</button></p>`
    : `<p class="muted"><button class="linkish" data-courses="">Hide courses</button> Courses grow one craft fast and degrees open doors that ask for one.${M.degrees.length ? ` You have: ${M.degrees.map(d => ({ ba: 'a degree', mfa: 'an MFA', cert: 'a certificate', union: 'union training' }[d] || 'a ' + d + ' degree')).join(', ')}.` : ''}</p>
      <div class="courses">${Object.entries(PROGRAMS).map(([k, P1]) => `<div class="course"><b>${esc(P1.label)}</b><p class="muted">${esc(P1.d)}</p><p class="small">${P1.weeks} weeks · ${P1.days} day${P1.days > 1 ? 's' : ''} a week · ${P1.fee > 0 ? fmtCash(usd(P1.fee)) + '/wk' : 'paid ' + fmtCash(usd(-P1.fee)) + '/wk'}${P1.apply ? ' · ' + oddsBar(P1.apply[0], P1.apply[1]) : ''}</p>${P1.craft ? `<button class="btn-s" data-enrol="${k}:${P1.craft}"${M.schoolTry > S.week - 26 ? ' disabled title="Try again in six months"' : ''}>${P1.apply ? 'Apply' : 'Enrol'}</button>` : `<span class="enrolrow">${Object.keys(CRAFTS).map(c => `<button class="btn-s ghost" data-enrol="${k}:${c}">${esc(CRAFTS[c].label)}</button>`).join(' ')}</span>`}</div>`).join('')}</div>`;
  const agent = M.agent ? `<p>${pl(M.agent.id)} at <b>${esc(M.agent.name)}</b> ${'★'.repeat(M.agent.tier)} represents you: takes 10%, pitches you for jobs a level up and pushes your rate. Last booking ${S.week - M.agent.lastBook} weeks ago${S.week - M.agent.lastBook > 20 ? ' <span class="bad">(they get restless after thirty)</span>' : ''}.</p><p><button class="linkish" data-fireagent="1">Leave your agent</button></p>`
    : `<p class="muted">No agent. Send a query, or get some credits and they'll call you. Each agency will look at you once every twelve weeks.</p><table class="grid small"><tbody>${ags.map(a => { const p = Math.round(queryOdds(a) * 100), wait = (M.queried || {})[a.i] > S.week - 12; return `<tr><td>${esc(a.name)} <span class="lvl">${'★'.repeat(a.tier)}</span></td><td><span class="oddsbar"><span class="ob-t"><i style="width:${p}%" class="${p < 35 ? 'lo' : p < 65 ? 'mid' : 'hi'}"></i></span><b>${p}%</b></span></td><td>${wait ? '<span class="muted">Wait</span>' : `<button class="btn-s ghost" data-query="${a.i}">Query</button>`}</td></tr>`; }).join('')}</tbody></table>`;
  return `<section class="panel"><h3>School</h3>${school}<h3>Representation</h3>${agent}</section>`;
}
// A little drawing of each kind of home, from a couch to a house with a garden.
function homeIcon(life) {
  const b = { couch: '<rect x="8" y="30" width="44" height="14" rx="4" fill="#7A6E8E"/><rect x="8" y="24" width="44" height="10" rx="4" fill="#5E536F"/>', shared: '<rect x="14" y="10" width="32" height="38" fill="#B9A58A"/>' + [0, 1, 2].map(i => `<rect x="18" y="${14 + i * 11}" width="8" height="7" fill="#FFE9A8"/><rect x="34" y="${14 + i * 11}" width="8" height="7" fill="#5E7C78"/>`).join(''), studio: '<rect x="16" y="18" width="28" height="30" fill="#C9B79C"/><rect x="24" y="24" width="12" height="9" fill="#FFE9A8"/><rect x="26" y="38" width="8" height="10" fill="#6B4E3A"/>', own: '<rect x="12" y="16" width="36" height="32" fill="#D7C4A3"/><rect x="17" y="21" width="10" height="8" fill="#FFE9A8"/><rect x="33" y="21" width="10" height="8" fill="#FFE9A8"/><rect x="25" y="36" width="10" height="12" fill="#6B4E3A"/>', loft: '<rect x="6" y="12" width="48" height="36" fill="#8A6A5A"/>' + [0, 1, 2, 3].map(i => `<rect x="${10 + i * 11}" y="18" width="7" height="10" fill="#FFE9A8"/>`).join('') + '<rect x="6" y="10" width="48" height="4" fill="#5E5A54"/>', house: '<path d="M10 28 L30 10 L50 28 Z" fill="#B3261E"/><rect x="14" y="28" width="32" height="20" fill="#F3EBDD"/><rect x="26" y="36" width="8" height="12" fill="#6B4E3A"/><rect x="0" y="46" width="60" height="4" fill="#5DBB85"/>' }[life] || '';
  return `<svg viewBox="0 0 60 50" width="72" height="60">${b}</svg>`;
}
// The city this week: what's on, and the venues you can put in your evenings.
function cityPanel() {
  const on = whatsOn();
  return `<section class="panel"><h3>The city this week</h3><div class="whatson">${on.map(x => `<div class="wo"><span class="wi">${VENUES[x.venue].icon}</span><div><b>${esc(x.title)}</b><p class="muted">${esc(x.d)} · ${esc(VENUES[x.venue].label)}</p><button class="btn-s ghost" data-tonight="v:${x.venue}">Go tonight</button></div></div>`).join('')}</div>
   <details><summary>All venues</summary><div class="venues">${Object.entries(VENUES).map(([k, V]) => `<div class="wo"><span class="wi">${V.icon}</span><div><b>${esc(V.label)}</b> <span class="muted">${V.cost ? fmtCash(usd(V.cost)) : 'free'} · energy −${V.e}${V.stress < 0 ? ` · stress ${V.stress}` : ''}</span><p class="muted">${esc(V.d)}</p><button class="btn-s ghost" data-tonight="v:${k}">Go tonight</button></div></div>`).join('')}</div></details>
   <p class="muted small">Or plan venues for any evening in Your week.</p></section>`;
}
// Your place: the furniture shop and where things go.
function homePanel() {
  const M = S.me, H = M.home, lay = homeLayout(), spots = HOME_SPOTS[M.life] || [];
  const spotName = { wallL: 'Left wall', wallL2: 'Left wall, by the door', wallR: 'Right wall', floorL: 'Left corner', floorC: 'By the window', floorR: 'Right corner', corner: 'Back corner', sill: 'Windowsill' };
  return `<section class="panel"><h3>Your place <button class="linkish" data-homep="">Close</button></h3>
   <p class="muted">${M.life === 'couch' ? 'You\'re on a friend\'s couch: there\'s a windowsill and that\'s it. Anything bigger waits in a box until you have a room of your own.' : `${esc(ORIGIN.life[M.life].label)}: ${(HOME_SPOTS[M.life] || []).length} spots for things.`} Things only help once they're in the room.</p>
   ${H.items.length ? `<h4>Arrange</h4><div class="arr">${H.items.map(id => { const F = FURNITURE[id], ok = spots.filter(s => fits(F.kind, s.kind));
     return `<label>${esc(F.name)} <select data-place="${id}"><option value="">${lay[id] ? 'Wherever there\'s room' : 'In a box (no room)'}</option>${ok.map(s => `<option value="${s.id}"${H.layout[id] === s.id ? ' selected' : ''}>${esc(spotName[s.id] || s.id)}</option>`).join('')}</select></label>`; }).join('')}</div>
     <p><button class="btn-s ghost" data-arrange="auto">Let the game arrange it</button> <button class="btn-s ghost" data-arrange="shuffle">Shuffle it</button></p>` : ''}
   <h4>Places to live in ${esc(hubName(M.hub))}</h4><div class="listings">${listingsIn(M.hub).map(L => { const life = ORIGIN.life[L.life], here = M.life === L.life && (M.hoodWhere === L.where || !M.hoodWhere), hood = HOOD_KINDS.find(h => h.k === L.hood);
     return `<div class="listing${here ? ' here' : ''}">${homeIcon(L.life)}<div><b>${esc(life.label)}</b><p class="muted">${esc(L.where)}. ${esc(life.d)} ${esc(hood.d)}</p><p class="small">${fmtCash(usd(L.rent))}/wk · ${(HOME_SPOTS[L.life] || []).length} spots for things · rest ${life.rest >= 0 ? '+' : ''}${life.rest}</p>${here ? '<span class="chip t-Award">You live here</span>' : `<button class="btn-s" data-move="${L.i}"${L.life !== 'couch' && M.cash < usd(L.rent) * 2 ? ' disabled' : ''}>Move here${L.life !== 'couch' ? ` (deposit ${fmtCash(usd(L.rent) * 2)})` : ''}</button>`}</div></div>`; }).join('')}</div>
   <h4>Getting around</h4><div class="listings">${Object.entries(VEHICLES).map(([k, V]) => { const mine = (M.vehicle || 'transit') === k;
     return `<div class="listing${mine ? ' here' : ''}"><span class="vi">${V.icon}</span><div><b>${esc(V.label)}</b><p class="muted">${esc(V.d)}</p><p class="small">${V.price ? fmtCash(usd(V.price)) : 'no cost'} · ${fmtCash(usd(V.upkeep))}/wk to run · commute energy −${V.e}${V.standing ? ' · standing +' + V.standing : ''}</p>${mine ? '<span class="chip t-Award">Yours</span>' : `<button class="btn-s" data-vehicle="${k}"${M.cash < usd(V.price) - Math.round(usd(VEHICLES[M.vehicle || 'transit'].price) * .4) ? ' disabled' : ''}>${V.price ? 'Buy (trade in yours)' : 'Sell up and ride the bus'}</button>`}</div></div>`; }).join('')}</div>
   <h4>Furniture and things</h4><div class="shop">${Object.entries(FURNITURE).map(([id, F]) => { const own = H.items.includes(id);
     return `<div class="shop-item${own ? ' owned' : ''}"><svg viewBox="-30 -84 120 92" width="64" height="50">${furnitureSVG(id, 0, 0)}</svg><div><b>${esc(F.name)}</b><p class="muted">${esc(F.d)}</p><p>${fxBadges(F)}</p>${own ? `<span class="chip t-Award">${lay[id] ? 'In the room' : 'In a box'}</span>` : `<button class="btn-s" data-furnish="${id}"${M.cash < F.price ? ' disabled' : ''}>Buy ${usd(F.price)}</button>`}</div></div>`; }).join('')}</div></section>`;
}
function viewDesk() {
  const M = S.me, me = ME(), life = ORIGIN.life[M.life];
  const pend = pending();
  const plan = effectivePlan(), jd = jobDays();
  const rent = usd(life.rent) + (M.debt > 0 ? Math.min(M.debt, M.debtPay) : 0) - M.allowance;
  const recent = M.inbox.filter(x => !(x.choices && !x.done)).slice(-14).reverse();
  const known = Object.keys(M.known).map(Number).filter(id => !P(id).dead || M.known[id].tags.includes('Your parent'));
  const slots = appSlots(), picked = [...UI.apps].filter(id => M.board.some(p => p.id === id));
  const actOpts = Object.entries(ACTIVITIES).filter(([k]) => k !== 'work').map(([k, a]) => [k, a.label]);
  const lastDiary = M.diary.filter(d => d.w >= S.week - 1);
  const card = it => `<li class="msg ${it.kind}${it.choices && !it.done ? ' open' : ''}">${inboxCard(it)}</li>`;
  const boardRow = p => {
    const f = p.film !== null ? S.films[p.film] : null, odds = hireOdds(p), on = UI.apps.has(p.id), t = tmplOf(p);
    const why = hireFactors(p).filter(x => Math.abs(x[1]) >= .1).map(x => `${x[0]} ${x[1] > 0 ? '+' : '−'}`).join(', ');
    const block = blockedFrom(t);
    return `<tr${block ? ' class="blocked"' : ''}><td><a href="#" class="lk" data-jobinfo="${esc(p.jid)}">${esc(p.t)}</a>${p.agent ? ' ' + chip('Via your agent', 'good') : ''}${p.ref ? ' ' + chip('Referral', 'good') : ''}${t.cr ? ' ' + chip('Credit', 'hist') : ''}${p.tier === 0 ? ' ' + chip('Internship', 'hist') : ''}${t.tier >= 2 ? ` <span class="lvl" title="Job level">${'★'.repeat(t.tier)}</span>` : ''}</td><td>${f ? fl(f.id) + ` <span class="muted">${esc(f.status.toLowerCase())}</span>` : p.co !== undefined ? `<a href="#" class="lk" data-go="co:${p.co}">${esc(S.companies[p.co].name)}</a> <span class="muted">${esc(t.biz || '')}</span>` : `<span class="muted">${esc(t.d)}</span>`}</td><td>${p.head !== null ? pl(p.head) : '<span class="muted">—</span>'}</td><td class="n">${p.days}d × ${p.weeks}w</td><td class="n">${p.rate ? fmtCash(p.rate) : 'unpaid'}</td><td><span class="odds-chip ${odds < .3 ? 'lo' : odds < .65 ? 'mid' : 'hi'}" title="${esc(why)}">${oddsBand(odds)}</span></td>
      <td>${block ? `<span class="muted small">${esc(block)}</span>` : `<label class="applyl"><input type="checkbox" data-apply="${p.id}" ${on ? 'checked' : ''} ${!on && picked.length >= slots ? 'disabled' : ''}> Apply</label>`}</td></tr>`;
  };
  const conRows = known.sort((a, b) => opinion(b) - opinion(a)).map(id => {
    const q = P(id), k = M.known[id], o = opinion(id);
    const film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id));
    return `<tr><td>${pl(id)}</td><td>${esc(q.occ || occupationOf(q))}<span class="muted"> · ${esc(hubName(q.hub))}</span></td><td class="n ${o > 10 ? 'good' : o < -10 ? 'bad' : ''}">${o > 0 ? '+' : ''}${Math.round(o)}</td><td class="n">${Math.round(k.trust)}</td><td class="n">${k.due ? `<span class="good">${k.due} owed to you</span>` : ''}${k.due && k.owe ? ', ' : ''}${k.owe ? `<span class="bad">you owe ${k.owe}</span>` : ''}</td><td class="st">${(() => { const t = tasteOf(q); return t.genres.map(g => M.love.includes(g) ? `<b class="good">♥ ${esc(g)}</b>` : esc(g)).join(', ') + ' · ' + (topThemes(voiceOf()).includes(t.theme) ? `<b class="good">${esc(THEMES[t.theme])}</b>` : esc(THEMES[t.theme])); })()}</td><td class="st">${esc(k.tags.slice(-2).join(' · '))}</td><td class="st">${film ? fl(film.id) : esc(personStatus(q))}</td>
      <td>${(k.due > 0 || k.trust >= 60) && !q.dead ? `<button class="linkish" data-favour="${id}">${k.due > 0 ? 'Call in a favour' : 'Ask for a favour'}</button>` : ''}</td></tr>`;
  }).join('');
  return `<div class="hero"><div class="hs">${homeSceneSVG(M.wk ? M.wk.day : 0)}</div><div class="hid"><p class="eyebrow">${esc(ROLE_LABEL[me.role])} hopeful · ${esc(hubName(M.hub))} · age ${ageOf(me)}</p><h2>${esc(me.name)}</h2>
   <p class="lede">${M.stats.weeks ? `${M.stats.weeks} weeks of paid work, ${me.credits.length} screen credit${me.credits.length === 1 ? '' : 's'}.` : 'No industry work yet.'} <span class="lvlchip" title="Your level decides which jobs you hear about">Level ${careerLevel()} · ${LEVEL_NAME[careerLevel()]}</span></p>
   <p class="voice">Your voice: ${topThemes(voiceOf()).map(k => `<span class="vt">${esc(THEMES[k])}</span>`).join(' ') || '<span class="muted">still finding it</span>'} <span class="muted">· loves ${esc(M.love.join(', ').toLowerCase() || 'everything')}</span></p>
   <p class="hlinks"><a href="#" class="lk" data-go="person:${me.id}">Your full sheet</a> · <button class="linkish" data-restyle="1">${UI.restyle ? 'Done changing your look' : 'Change your look'}</button> · <button class="linkish" data-homep="1">${UI.homep ? 'Close your place' : 'Your place'}</button> · <button class="linkish" data-story="1">${UI.story ? 'Close your story' : 'Your story'}</button> · <button class="linkish" data-guide="1">${UI.guide ? 'Close the guide' : 'How this works'}</button></p>
   <div class="kpis mini"><div><span>Cash</span><b class="${M.cash < 0 ? 'bad' : ''}">${fmtCash(M.cash)}</b><small class="muted">${fmtCash(rent)} a week to live${M.shark ? ` · owe ${fmtCash(M.shark)}` : ''}</small></div>
    <div><span>Energy</span>${meter('', M.energy, 'data')}</div><div><span>Stress</span>${meter('', M.stress, 'warm')}</div><div><span>Standing</span>${meter('', me.standing, 'accent')}</div></div></div></div>
  ${UI.restyle ? `<section class="panel cc"><h3>Your look</h3><p class="muted">Haircuts and new clothes. Ageing happens on its own. Pieces marked ★ were bought.</p>${lookControls({ look: Object.assign(defaultLook(), M.look) }, M.owned)}${wardrobeShop()}</section>` : ''}
  ${UI.guide || (UI.guide === undefined && !M.stats.apps && !M.stats.weeks && !M.wk) ? guidePanel() : ''}
  ${UI.story ? storyHTML() : ''}
  ${UI.homep ? homePanel() : ''}
  ${M.over ? `<section class="panel"><h3>You left the business</h3><p>Your career ended in ${S.year}. The world keeps running; you can watch it from the other tabs.</p><button class="btn primary" data-startover="1">Start a new career</button></section>` : ''}
  <div class="cols two desk">
   <section class="panel"><h3>Inbox ${pend.length ? `<span class="chip bad">${pend.length} to decide</span>` : ''}</h3>
    <ul class="inbox">${recent.map(card).join('') || (pend.length ? '' : '<li class="empty">Nothing yet.</li>')}</ul></section>
   <div>
    ${todayPanel()}
    <section class="panel"><h3>Your week</h3>${M.burnout ? '<p class="bad">Burnt out: this week is rest, whatever you plan.</p>' : ''}
     ${weekGrid(actOpts)}
     ${plan.includes('train') ? `<div class="ccrow"><label>Class in ${sel('pl-train', Object.keys(CRAFTS).map(c => [c, CRAFTS[c].label]), M.train)}</label></div>` : ''}
     ${plan.includes('catchup') ? `<div class="ccrow"><label>Catch up with ${sel('pl-catch', [['', 'Choose someone…']].concat(known.filter(id => !P(id).dead).map(id => [id, P(id).name])), M.catchWith ?? '')}</label></div>` : ''}
     <p class="note">${Object.entries(ACTIVITIES).filter(([k]) => plan.includes(k) && k !== 'work').map(([, a]) => `<b>${a.label}:</b> ${a.d}${a.cost ? ` (${fmtCash(usd(a.cost))})` : ''}`).join(' ')}</p>
     <p class="note">A work day costs about 28 energy; a night's sleep gives back 20 to 40 depending on your bed, your home, your neighbourhood and your stress. Evenings out cost energy but melt stress.</p>
     <p class="note">You live in ${esc(ORIGIN.life[M.life].label.toLowerCase())}${M.hoodWhere ? ' in ' + esc(M.hoodWhere) : ''} and get around by ${esc(VEHICLES[M.vehicle || 'transit'].label.toLowerCase())}. <button class="linkish" data-homep="1">Move or change how you travel</button></p></section>
    ${cityPanel()}
    <section class="panel"><h3>Work</h3>${M.jobs.length ? `<ul class="plain">${M.jobs.map(j => `<li><b>${esc(j.t)}</b>${j.film !== null ? ' on ' + fl(j.film) : ''} · ${j.days} days a week · week ${j.done + 1} of about ${j.weeks}${j.head !== null ? ' · under ' + pl(j.head) : ''} <button class="linkish" data-quit="${j.id}">Quit</button></li>`).join('')}</ul>` : '<p class="muted">No job right now. Plan days to look for work, then tick jobs on the board below.</p>'}
     ${M.spec.pages || M.spec.drafts ? `<p class="muted">Spec script: ${M.spec.drafts ? M.spec.drafts + ' finished draft' + (M.spec.drafts > 1 ? 's' : '') + ', ' : ''}${M.spec.pages} pages into the next.</p>` : ''}</section>
    ${writingDesk()}
    ${pathsPanel()}
    ${lastDiary.length ? `<section class="panel"><h3>Last week</h3><ul class="plain">${lastDiary.map(d => `<li>${esc(d.t)}</li>`).join('')}</ul></section>` : ''}
   </div></div>
  <h3>The board <span class="count">${picked.length} of ${slots} applications planned</span></h3>
  <p class="muted">What you've heard about this week in ${esc(hubName(M.hub))}. ${slots ? `Your ${slots / 3} job-hunting day${slots > 3 ? 's' : ''} let you send ${slots} applications.` : 'Plan at least one day to look for work to apply.'} Hover the odds to see why.</p>
  <div class="tw"><table class="grid"><thead><tr><th>Job</th><th>Production</th><th>Reports to</th><th class="n">Time</th><th class="n">Pay / day</th><th>Odds</th><th></th></tr></thead><tbody>${M.board.map(boardRow).join('') || '<tr><td colspan="7" class="empty">Nothing on the board this week.</td></tr>'}</tbody></table></div>
  ${UI.jobinfo ? jobInfoPanel(UI.jobinfo) : ''}
  <h3>Contacts <span class="count">${known.length}</span></h3>
  <div class="tw"><table class="grid"><thead><tr><th>Name</th><th>Job</th><th class="n">Opinion</th><th class="n">Trust</th><th class="n">Favours</th><th>Taste</th><th>History</th><th>Now</th><th></th></tr></thead><tbody>${conRows || '<tr><td colspan="9" class="empty">You don’t know anyone yet.</td></tr>'}</tbody></table></div>
  <p class="note">Opinion is how much they like you; trust is whether they believe you. A favour they owe makes them put in a word: your next application to them gets a referral.</p>
  <p class="note"><button class="linkish" data-abandon="1">${UI.abandon ? 'Click again to delete this career for good' : 'Abandon this career'}</button></p>`;
}
function jobInfoPanel(jid) {
  const j = JOBS.jobs.find(x => x.id === jid);
  if (!j) return '';
  return `<section class="panel jobd"><h3>${esc(j.t)} <button class="linkish" data-jobinfo="">Close</button></h3>${j.resp ? `<ul class="plain">${j.resp.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${j.sk ? `<p class="muted">What it takes: ${j.sk.map(esc).join(' · ')}</p>` : ''}${j.after ? `<p class="muted">Leads to: ${esc(j.after)}</p>` : ''}</section>`;
}
function viewYou() {
  if (UI.replaying) return `<div class="loading"><p class="eyebrow">Loading your career</p><h2>Replaying your life so far</h2><p class="lede">${esc(UI.replaying)}</p></div>`;
  if (!S.me) return viewCreator();
  if (!S.me.party.done) return viewParty();
  return viewDesk();
}

// ---------- Career: controls ----------
function careerActive() { return S && S.me && S.me.party && S.me.party.done && !S.me.over; }
function endWeekAct(t = 'end') { return { t, plan: S.me.plan.slice(), eve: (S.me.eve || []).slice(), apps: [...UI.apps], train: S.me.train, catchWith: S.me.catchWith }; }
function playStep(t) {
  if (UI.busy || !careerActive()) return;
  if (pending().length) { UI.tab = 'you'; UI.stack = []; render(); return; }
  const w0 = S.week;
  doAct(endWeekAct(t));
  if (S.week !== w0) UI.apps = new Set();
  UI.tab = 'you'; UI.stack = []; render(true);
}
function playWeeks(n) {
  if (UI.busy || !careerActive()) return;
  if (pending().length) { UI.tab = 'you'; UI.stack = []; render(); return; }
  let left = n;
  setBusy(true, 'Living the week…');
  const step = () => {
    doAct(endWeekAct());
    UI.apps = new Set();
    left--;
    if (left > 0 && careerActive() && !pending().length) { $('#status').textContent = `Living… ${fmtDate(S.week, true)}`; setTimeout(step, 0); }
    else { setBusy(false); UI.tab = 'you'; UI.stack = []; render(); }
  };
  setTimeout(step, 0);
}
function careerClick(t) {
  const c = UI.cc;
  if (t.dataset.cc) {
    const g = t.dataset.cc, v = t.dataset.v;
    if (g === 'rename') c.name = suggestName(c.hub, c.g);
    else if (g === 'pt') { const [cr, d] = v.split(':'); const nv = clamp((c.points[cr] || 0) + +d, 0, SKILL_MAX); if (+d < 0 || ccSpent(c) < SKILL_POINTS) c.points[cr] = nv; }
    else if (g === 'trait') { if (c.traits.includes(v)) c.traits = c.traits.filter(x => x !== v); else if (c.traits.length < 3 && !traitClash(c.traits, v)) c.traits.push(v); }
    else if (g === 'love' || g === 'hate') { const L = c[g]; if (L.includes(v)) c[g] = L.filter(x => x !== v); else if (L.length < (g === 'love' ? 3 : 2)) L.push(v); }
    else if (g === 'unfav') c.favs.splice(+v, 1);
    else if (g === 'randfav') { if (c.favs.length >= 5) c.favs = []; while (c.favs.length < 5) { const id = randomFav(c); if (!id) break; c.favs.push(id); } }
    else if (g === 'go') {
      c.name = ($('#cc-name').value || '').trim() || suggestName(c.hub, c.g);
      doAct({ t: 'create', c: JSON.parse(JSON.stringify(c)) });
      UI.apps = new Set(); UI.stack = []; render(); return true;
    } else c[g] = v;
    render(true); return true;
  }
  if (t.dataset.look) { const [k, v] = t.dataset.look.split(':'); setLook(k, +v); return true; }
  if (t.dataset.enrol) { const [prog, craft] = t.dataset.enrol.split(':'); doAct({ t: 'enrol', prog, craft }); render(true); return true; }
  if (t.dataset.dropout) { doAct({ t: 'dropout' }); render(true); return true; }
  if (t.dataset.query) { doAct({ t: 'query', ag: +t.dataset.query }); render(true); return true; }
  if (t.dataset.fireagent) { doAct({ t: 'fireagent' }); render(true); return true; }
  if (t.dataset.guide !== undefined) { UI.guide = !!t.dataset.guide && !UI.guide; render(true); return true; }
  if (t.dataset.homep !== undefined) { UI.homep = !!t.dataset.homep && !UI.homep; render(true); return true; }
  if (t.dataset.furnish) { doAct({ t: 'furnish', id: t.dataset.furnish }); render(true); return true; }
  if (t.dataset.arrange) {
    if (t.dataset.arrange === 'auto') doAct({ t: 'arrange', layout: {} });
    else { const spots = (HOME_SPOTS[S.me.life] || []).slice().sort(() => Math.random() - .5), lay = {}, used = new Set();   // the shuffle is logged, so replays match
      for (const id of S.me.home.items.slice().sort(() => Math.random() - .5)) { const sp = spots.find(s => !used.has(s.id) && fits(FURNITURE[id].kind, s.kind)); if (sp) { lay[id] = sp.id; used.add(sp.id); } }
      doAct({ t: 'arrange', layout: lay }); }
    render(true); return true;
  }
  if (t.dataset.buy) { doAct({ t: 'buy', id: t.dataset.buy }); render(true); return true; }
  if (t.dataset.restyle) { UI.restyle = !UI.restyle; render(true); return true; }
  if (t.dataset.party) { const n0 = S.me.rollN || 0; doAct({ t: 'party', k: t.dataset.party }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.pick) { const [id, k] = t.dataset.pick.split(':'), n0 = S.me.rollN || 0; doAct({ t: 'pick', id: +id, k }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.quit) { doAct({ t: 'quit', id: +t.dataset.quit }); render(true); return true; }
  if (t.dataset.favour) { doAct({ t: 'favour', id: +t.dataset.favour }); render(true); return true; }
  if (t.dataset.endweek) { playWeeks(+t.dataset.endweek); return true; }
  if (t.dataset.day) { playStep('day'); return true; }
  if (t.dataset.next) { playStep('next'); return true; }
  if (t.dataset.randcc) { randomCC(t.dataset.randcc === 'all'); render(true); return true; }
  if (t.dataset.story !== undefined) { UI.story = !!t.dataset.story && !UI.story; render(true); return true; }
  if (t.dataset.move) { doAct({ t: 'move', i: +t.dataset.move }); render(true); return true; }
  if (t.dataset.vehicle) { doAct({ t: 'vehicle', v: t.dataset.vehicle }); render(true); return true; }
  if (t.dataset.tonight) { const W = S.me.wk, d = W ? W.day + (W.beat > 2 ? 1 : 0) : 0; if (d < 7) S.me.eve[d] = t.dataset.tonight; render(true); return true; }
  if (t.dataset.newscript) { const f = UI.newScript; f.title = ($('#ns-title') || {}).value || ''; doAct({ t: 'newscript', title: f.title, genre: f.genre, theme: f.theme, tone: f.tone }); UI.newScript = null; render(true); return true; }
  if (t.dataset.rewrite) { doAct({ t: 'rewrite', id: +t.dataset.rewrite }); render(true); return true; }
  if (t.dataset.contest) { const [id, c] = t.dataset.contest.split(':'); doAct({ t: 'contest', id: +id, c }); render(true); return true; }
  if (t.dataset.activescript) { doAct({ t: 'activescript', id: +t.dataset.activescript }); render(true); return true; }
  if (t.dataset.courses !== undefined) { UI.courses = !!t.dataset.courses; render(true); return true; }
  if (t.dataset.jobinfo !== undefined) { UI.jobinfo = t.dataset.jobinfo || null; render(true); return true; }
  if (t.dataset.abandon) { if (!UI.abandon) { UI.abandon = true; render(true); return true; } UI.abandon = false; clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  if (t.dataset.startover) { clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  return false;
}
// Every clickable the career screens use; the page's click handler listens for these.
const CAREER_CLICKS = '[data-randcc],[data-story],[data-move],[data-vehicle],[data-tonight],[data-newscript],[data-rewrite],[data-contest],[data-activescript],[data-courses],[data-next],[data-enrol],[data-dropout],[data-query],[data-fireagent],[data-homep],[data-furnish],[data-arrange],[data-guide],[data-day],[data-buy],[data-cc],[data-party],[data-pick],[data-quit],[data-favour],[data-endweek],[data-jobinfo],[data-abandon],[data-startover],[data-look],[data-restyle]';
function setLook(k, v) {
  if (!LOOK[k] || !(v >= 0 && v < LOOK[k].opts.length)) return;
  if (S.me) { doAct({ t: 'look', k, v }); render(true); return; }
  UI.cc.look[k] = v; render(true);
}
function careerChange(e) {
  const id = e.target.id, v = e.target.value, c = UI.cc;
  if (e.target.dataset.share && v) { doAct({ t: 'share', id: +e.target.dataset.share, to: +v }); render(true); return true; }
  if (/^ns-(genre|theme|tone)$/.test(id)) { UI.newScript[id.slice(3)] = v; return true; }
  if (id === 'ns-title') { UI.newScript.title = v; return true; }
  if (e.target.dataset.place) { doAct({ t: 'place', id: e.target.dataset.place, sp: v || null }); render(true); return true; }
  if (e.target.dataset.lookk) { setLook(e.target.dataset.lookk, +v); return true; }
  if (e.target.dataset.fav !== undefined) { const fid = filmChoices().byLabel[v]; if (fid && !c.favs.includes(fid)) c.favs.push(fid); render(true); return true; }
  if (id.startsWith('cc-')) {
    const k = id.slice(3);
    if (k === 'age') c.age = clamp(+v || 23, 18, 45);
    else if (k === 'name') c.name = v;
    else c[k] = v;
    if (k === 'hub' || k === 'g') c.name = $('#cc-name') && $('#cc-name').value.trim() ? $('#cc-name').value : suggestName(c.hub, c.g);
    if (k === 'age' && c.age < 26) c.traits = c.traits.filter(t => t !== 'Late bloomer');
    render(true); return true;
  }
  if (/^pl-\d$/.test(id)) { S.me.plan[+id.slice(3)] = v; render(true); return true; }
  if (/^ev-\d$/.test(id)) { S.me.eve[+id.slice(3)] = v; render(true); return true; }
  if (id === 'pl-train') { S.me.train = v; return true; }
  if (id === 'pl-catch') { S.me.catchWith = v === '' ? null : +v; return true; }
  if (id === 'pl-life') { doAct({ t: 'life', v }); render(true); return true; }
  if (e.target.dataset.apply) { const pid = +e.target.dataset.apply; if (e.target.checked) UI.apps.add(pid); else UI.apps.delete(pid); render(true); return true; }
  return false;
}
// Rebuild a saved career: the world is already built from the same seed; feed it the log.
function replayCareer(log, done) {
  let i = 0;
  UI.replaying = 'Starting…';
  const step = () => {
    const t0 = Date.now();
    while (i < log.length && Date.now() - t0 < 60) { applyAct(log[i]); i++; }
    S.log = log.slice(0, i);
    UI.replaying = `${i} of ${log.length} actions · ${fmtDate(S.week, true)}`;
    $('#main').innerHTML = viewYou();
    if (i < log.length) setTimeout(step, 0);
    else { UI.replaying = null; UI.seenRoll = UI.pendingSeen = S.me ? S.me.rollN || 0 : 0; done(); }
  };
  setTimeout(step, 0);
}
