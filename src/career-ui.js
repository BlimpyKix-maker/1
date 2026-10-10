// ---------- Career: saving ----------
// Every action goes through here: it's applied, kept in the session's log, journalled since the last save (saves.js),
// and an autosave comes when the schedule turns. The old one-log-per-browser save (SAVE_KEY) is only read now, to
// bring an old career across.
const SAVE_KEY = 'applebox-career-v1';
function doAct(a) {
  const w0 = S.week;
  if (!applyAct(a)) return false;
  (S.log = S.log || []).push(a);
  if (typeof journalAdd === 'function') { journalAdd(Object.assign({ _w: w0 }, a)); autoCheck(); }
  return true;
}
function saveCareer() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 9, seed: S.seed, year: S.startYear, depth: S.depth, log: S.log || [] })); } catch (e) { /* storage unavailable: the career lasts as long as the tab */ } }
function loadSave() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return s && s.v === 9 && Array.isArray(s.log) && s.log.length ? s : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nothing to clear */ } if (typeof journalClear === 'function') journalClear(); }

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
  return { name: suggestName('hollywood', 'X'), g: 'X', age: 23, hub: 'hollywood', dream: 'director', role: 'director', field: 'film', wealth: 'gettingby', edu: 'filmdir', arrival: 'plusone', build: 'everyday', quirk: 'none', points: {}, traits: [], love: ['Drama'], hate: [], favs: [], salt: Math.floor(Math.random() * 1e9), look: defaultLook() };
}
// Randomise the basics (name, pronouns, age, hub, dream job, look) or the whole page. Display-side randomness only:
// what you end up with is what gets saved.
function randomCC(all) {
  const R0 = () => Math.random(), pk = L => L[Math.floor(R0() * L.length)];
  const c = UI.cc;
  c.g = pk(['X', 'F', 'M']); c.hub = pk(MAJOR_HUBS); { const d = pk(DREAMS); c.dream = d.k; c.role = d.role; c.field = d.field; } c.age = 18 + Math.floor(R0() * 15);
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
// Search by the game's title or the real one, but only ever show the game's version: you work out which is which.
const fold = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
function favResults() {
  const q = fold(UI.favq || '').trim(), c = UI.cc;
  if (q.length < 2) return '';
  const L = filmChoices().list.filter(f => !c.favs.includes(f.id) && (fold(f.t).includes(q) || fold(f.real).includes(q))).slice(0, 8);
  return `<ul class="favres">${L.map(f => `<li><button class="linkish" data-cc="addfav" data-v="${esc(f.id)}"><b>${esc(f.t)}</b> <span class="muted">${f.y} · ${esc(f.g.toLowerCase())}</span></button></li>`).join('') || '<li class="muted">Nothing matches. Try another word.</li>'}</ul>`;
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
function buildBanner() { return UI.building ? `<div class="buildbar"><span>${UI.ccQueued ? '✓ You\'re ready. Your career starts the moment the world is built…' : 'The world is still being built while you create your character:'} <b id="buildtxt">${esc(UI.buildTxt || '')}</b></span><span class="bb"><i id="buildfill" style="width:${(UI.buildPct || 0).toFixed(1)}%"></i></span></div>` : ''; }
function viewCreator() {
  const c = UI.cc = UI.cc || ccDefaults();
  const left = SKILL_POINTS - ccSpent(c);
  const grid = (group, src) => `<div class="opts">${Object.entries(src).map(([k, o]) => optCard(group, k, o, c[group] === k)).join('')}</div>`;
  const fc = filmChoices();
  const favRow = (i) => { const id = c.favs[i], f = id ? S.cat.allFilms[id] : null; return `<li>${f ? `<b>${esc(f.t)}</b> <span class="muted">${f.y} · ${esc(f.g.toLowerCase())}</span> <button class="linkish" data-cc="unfav" data-v="${i}">Remove</button>` : (i === c.favs.length ? `<input class="favin" id="fav-q" value="${esc(UI.favq || '')}" placeholder="Type a title, real or in-game…" aria-label="Favourite film ${i + 1}" autocomplete="off">${favResults()}` : '<span class="muted">…</span>')}</li>`; };
  const genreChip = (g, kind) => { const on = c[kind].includes(g), other = kind === 'love' ? c.hate.includes(g) : c.love.includes(g), full = !on && c[kind].length >= (kind === 'love' ? 3 : 2); return `<button class="chip trait tbtn${on ? ' on' : ''}" data-cc="${kind}" data-v="${esc(g)}" aria-pressed="${on}" ${other || full ? 'disabled' : ''}>${esc(g)}</button>`; };
  const traitBtn = t => { const on = c.traits.includes(t), blocked = !on && (c.traits.length >= 3 || traitClash(c.traits, t)); return `<button class="chip trait tbtn${on ? ' on' : ''}" data-cc="trait" data-v="${esc(t)}" aria-pressed="${on}" ${blocked ? 'disabled' : ''} title="${esc(TRAITS[t].d)}">${esc(t)} <span class="muted">· ${esc(TRAITS[t].d)}</span> ${fxBadges(TRAITS[t])}</button>`; };
  return buildBanner() + `<div class="head"><p class="eyebrow">Your career</p><h2>Who are you?</h2><p class="lede">You arrive on the last night of ${S.startYear - 1}, at a New Year's Eve party full of people who already work in film. Every choice here changes something: what you can do, who you know, what you owe. No build is best.</p><p class="lede">After that the world is yours. Thousands of people are already making films around you; you can chase a credit, a cult hit, an award, a fortune or a circle of collaborators you'd walk through fire for. Green marks show what helps a roll, red what hurts it.</p></div>
  <div class="ccrand"><button class="btn-s" data-randcc="basics">Randomise the basics</button> <button class="btn-s" data-randcc="all">Randomise everything</button> <span class="muted">Then tweak anything, or just go to the party.</span></div>
  <section class="panel cc"><h3>The basics</h3>
   <div class="ccface"><div class="pf">${portraitSVG(c.look, c.age, 300, false, true)}</div><div>
   <div class="ccrow"><label>Name <input id="cc-name" type="text" maxlength="40" value="${esc(c.name)}"></label><button class="linkish" data-cc="rename">Suggest another</button></div>
   <div class="ccrow"><label>Pronouns <select id="cc-g">${[['X', 'they/them'], ['F', 'she/her'], ['M', 'he/him']].map(([v, t]) => `<option value="${v}"${c.g === v ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
   <label>Age <input id="cc-age" type="number" min="18" max="45" value="${c.age}"></label>
   <label>Home hub ${sel('cc-hub', MAJOR_HUBS.map(h => [h, HUBS[h].name]), c.hub)}</label>
   <label>Dream ${dreamSelect(c.dream || c.role)}</label></div>
   <p class="note"><b>${esc((DREAM_BY[c.dream] || DREAM_BY.director).label)}.</b> ${esc((DREAM_BY[c.dream] || {}).blurb || `You'll train as ${(ROLE_LABEL[(DREAM_BY[c.dream] || {}).role] || 'a filmmaker').toLowerCase().replace(/^/, m => /^[aeiou]/i.test(ROLE_LABEL[(DREAM_BY[c.dream] || {}).role] || '') ? 'an ' : 'a ')}, and go after ${FIELDS[(DREAM_BY[c.dream] || {}).field || 'film'].toLowerCase()} work first.`)} You don't choose an industry: where you end up working decides it, and you can change course any time.</p>
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
  <p><button class="btn-s ghost" data-partyauto="1" title="Make the sensible choice in every scene and get to the first week">⏩ Let the night play out</button> <span class="muted small">Skip ahead to January; the party still happens, with sensible choices.</span></p>
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
// Where a message leads: the part of the desk (or the page) it's about.
function inboxLinks(it) {
  const L = [], T = it.title + ' ' + (it.text || '');
  const go = (tab, label) => L.push(`<button class="linkish" data-dtab="${tab}">${label} ›</button>`);
  if (it.kind === 'invite' || it.kind === 'ask') go('phone', 'Phone');
  else if (it.kind === 'offer' || it.kind === 'interview' || /Shortlisted|rejection|No luck|Wrapped|Job done/.test(it.title)) go('work', 'Work');
  else if (it.kind === 'option' || /script|Draft|option|Green light|festival|is a go|Festival|Producing|investors/i.test(T)) go('create', 'Create');
  else if (/agent|course|school|rent|move|Your place/i.test(T)) go('life', 'Life');
  if (/diary|Interview|Shortlisted/.test(T)) go('diary', 'Your week');
  if (it.person !== undefined && it.person !== null && P(it.person)) L.push(`<a href="#" class="lk" data-go="person:${it.person}">${esc(P(it.person).name)} ›</a>`);
  if (it.film !== undefined && it.film !== null && S.films[it.film]) L.push(`<a href="#" class="lk" data-go="film:${it.film}">${esc(S.films[it.film].title)} ›</a>`);
  return L.length ? `<p class="golinks">${L.join(' ')}</p>` : '';
}
function inboxCard(it) {
  return `<div class="mh"><time>${fmtDate(it.w, true)}</time><b>${esc(it.title)}</b></div><p>${linkPrizes(esc(it.text))}${it.film !== undefined ? ' ' + fl(it.film) : ''}</p>
    ${it.choices && !it.done ? `<div class="choices">${it.choices.map(c => `<button class="choice${c.check && c.check[1] >= 13 ? ' hard' : ''}" data-pick="${it.id}:${c.k}" ${c.dis ? 'disabled' : ''}><b>${esc(c.label)}</b>${c.dis ? `<span class="odds">${esc(c.dis)}</span>` : c.check ? oddsBar(c.check[0], c.check[1]) : '<span class="odds">No roll</span>'}</button>`).join('')}</div>` : ''}
    ${it.result ? `<div class="res">${rollCard(it.result.roll, true)}${it.result.quip ? `<p class="quip ${it.result.ok ? 'good' : 'bad'}">${esc(it.result.quip)}</p>` : ''}<p>${esc(it.result.t)}</p>${it.result.teach ? `<p class="teach"><b>How the job works:</b> ${esc(it.result.teach)}</p>` : ''}</div>` : ''}${inboxLinks(it)}`;
}
// Today, as it happens: a card for each block lived so far, any decision waiting, and what's next.
function blockLabel(d, b) {
  const ap = apptAt(d, b);
  if (ap) { const A = APPT_KINDS[ap.kind]; return [A.icon, `${A.label}${ap.who != null ? ' with ' + P(ap.who).name : ''}`]; }
  const k = planBlocks()[d][b], A = eveningOf(k);
  return [A.icon || '•', A.label];
}
function todayPanel() {
  const M = S.me, W = M.wk, d = W ? W.day : 0, b = W ? W.block : 0;
  const cards = W ? W.cards.filter(c => c.d === d) : [];
  const pend = pending();
  const [ic, lab] = blockLabel(d, b);
  const rest = [b + 1, b + 2].filter(x => x < 3).map(x => { const [i, l] = blockLabel(d, x); return `<span class="chip">${i} ${esc(BLOCKS[x])}: ${esc(l)}</span>`; }).join(' ');
  return `<section class="panel today"><h3>${esc(fmtDay(d))}</h3>${worldStrip()}
   <ol class="beats">${cards.map(c => `<li class="beat done"><span class="bi">${c.icon}</span><div><b>${BLOCKS[c.b]} · ${esc(c.title)}</b>${c.lines.map(l => `<p>${esc(l)}</p>`).join('')}${rollCard(c.roll, true)}</div></li>`).join('')}
    ${pend.length ? `<li class="beat decide"><span class="bi">❗</span><div><b>${pend.length} decision${pend.length > 1 ? 's' : ''} waiting</b><p class="muted small">In the box at the top of the screen. The day carries on once you've chosen.</p></div></li>` : ''}
    ${pend.length ? '' : `<li class="beat next"><span class="bi">${ic}</span><div><b>Next: ${BLOCKS[b]} · ${esc(lab)}</b>${rest ? `<p class="muted small">Later: ${rest}</p>` : ''}<p><button class="btn-s" data-next="1">Live on <kbd>space</kbd></button> <button class="btn-s ghost" data-day="1">Rest of the day</button></p></div></li>`}</ol>
   ${conditionsHTML()}</section>`;
}
function conditionsHTML() {
  const C = conditionsOf();
  return C.length ? `<div class="conds">${C.map(c => `<span class="cond ${c.adv ? 'up' : 'down'}" title="${esc(c.d)}"><b>${esc(c.label)}</b> ${esc(c.d)}</span>`).join('')}</div>` : '<p class="muted small">You feel fine: no effects on your rolls.</p>';
}
// The week ahead as a diary: seven days, three blocks each. Lived blocks are fixed; job days are taken;
// appointments show where they land. Everything else you can change until it happens.
function weekGrid() {
  const M = S.me, W = M.wk, cal = calOf(), OB = obligations(), run = OB.cal, now = W ? W.day * 3 + W.block : 0, burnt = M.burnout && W && W.burnt;
  const opts = b => Object.entries(BLOCK_ACTS).filter(([k]) => k !== 'work' && (k !== 'study' || M.school)).map(([k, A]) => [k, `${A.icon} ${A.label}`]).concat(b === 2 && typeof cityEveningOpts === 'function' ? cityEveningOpts() : []);
  const cell = (d, b) => {
    const abs = d * 3 + b, ap = (M.appts || []).find(x => x.w === S.week && x.d === d && x.b === b && (!x.done || abs < now)), k = run[d][b];
    if (abs < now) { const c = W.cards.filter(x => x.d === d && x.b === b).pop(); return `<td class="past"><span class="muted">${c ? c.icon + ' ' + esc(c.title) : ''}</span></td>`; }
    if (ap) { const A = APPT_KINDS[ap.kind]; return `<td class="appt${abs === now ? ' now' : ''}"><span class="chip good">${A.icon} ${esc(A.label)}${ap.who != null ? ' · ' + esc(P(ap.who).name.split(' ')[0]) : ''}</span></td>`; }
    if (burnt) return '<td><span class="bad">Rest</span></td>';
    if (k === 'work') { const j = M.jobs.length > 1 ? M.jobs.find(x => x.id === OB.job[d]) : null; return `<td class="${abs === now ? 'now' : ''}"><span class="chip" title="${j ? esc(j.t) : 'Work'}">🎬 ${j ? esc(j.t.length > 16 ? j.t.slice(0, 15) + '…' : j.t) : 'Work'}</span></td>`; }
    if (OB.forced[d + '-' + b]) return `<td class="${abs === now ? 'now' : ''}"><span class="chip good" title="Your course needs this session; fitted in automatically">📚 Study</span></td>`;
    const pin = (M.calPins || {})[d + '-' + b] !== undefined;
    return `<td class="${abs === now ? 'now' : ''}${pin ? ' pinned' : ''}"><span class="calc">${sel(`cal-${d}-${b}`, opts(b), cal[d][b])}<button class="calpin${pin ? ' on' : ''}" data-calpin="${d}-${b}" title="${pin ? 'Pinned: autopilot keeps this. Click to unpin.' : 'Pin this block so autopilot keeps it'}">📌</button></span></td>`;
  };
  return `<div class="tw"><table class="cal"><thead><tr><th></th>${DAYS7.map((dn, i) => `<th class="${W && i === W.day ? 'now' : ''}">${dn.slice(0, 3)}<small>${dayDate(i).getUTCDate()}</small></th>`).join('')}</tr></thead>
   <tbody>${BLOCKS.map((bn, b) => `<tr><th>${bn}</th>${DAYS7.map((_, d) => cell(d, b)).join('')}</tr>`).join('')}</tbody></table></div>
  ${(() => { const R = Object.keys((M.focus && M.focus.auto && M.calRested) || {}).filter(x => { const [d, b] = x.split('-').map(Number); return d * 3 + b >= now && (cal[d][b] === 'rest' || cal[d][b] === 'home'); }); return R.length ? `<p class="muted small">🛋️ Autopilot made ${R.length} block${R.length > 1 ? 's' : ''} rest (${R.map(x => { const [d, b] = x.split('-').map(Number); return DAYS7[d].slice(0, 3) + ' ' + BLOCKS[b].toLowerCase(); }).join(', ')}): otherwise you'd drop below a third of your energy. Work and school come first, then rest, then hobbies. You can still change any of them.</p>` : ''; })()}
  ${M.school || M.jobs.length > 1 ? `<p class="muted small">🗓️ Obligations are fitted in for you: each job gets its own days${M.school ? `, and your course gets its ${(schoolProg(M.school) || {}).days} study sessions in the least important free blocks. <button class="linkish" data-auto="oblig">${M.autoOblig === false ? 'Fit my study sessions for me' : 'Let me place study sessions myself'}</button>` : '.'}</p>` : ''}
  <p class="calquick muted small">Quick plans: <button class="linkish" data-calfill="grind">Job hunt all week</button> · <button class="linkish" data-calfill="craft">Craft week</button> · <button class="linkish" data-calfill="writer">Writing week</button> · <button class="linkish" data-calfill="balance">Balanced</button> · <button class="linkish" data-calfill="recover">Recover</button></p>
  <div class="skip"><span class="muted">Skip ahead with this plan (stops at any decision):</span> <button class="btn-s ghost" data-endweek="1">Rest of the week</button> <button class="btn-s ghost" data-endweek="2">2 weeks</button> <button class="btn-s ghost" data-endweek="4">4 weeks</button> <button class="btn-s ghost" data-endweek="12">12 weeks</button></div>`;
}
const CAL_PRESETS = {
  grind: [['hunt', 'hunt', 'home'], ['hunt', 'network', 'home'], ['hunt', 'hunt', 'read'], ['hunt', 'network', 'home'], ['hunt', 'hunt', 'out'], ['rest', 'read', 'out'], ['rest', 'home', 'home']],
  craft: [['train', 'hunt', 'home'], ['train', 'hunt', 'read'], ['train', 'hunt', 'home'], ['train', 'network', 'home'], ['hunt', 'hunt', 'out'], ['rest', 'read', 'out'], ['rest', 'home', 'home']],
  writer: [['write', 'write', 'read'], ['write', 'hunt', 'home'], ['write', 'write', 'read'], ['write', 'hunt', 'home'], ['write', 'write', 'out'], ['rest', 'read', 'out'], ['rest', 'write', 'home']],
  balance: [['hunt', 'write', 'home'], ['hunt', 'network', 'home'], ['hunt', 'write', 'read'], ['train', 'hunt', 'home'], ['hunt', 'write', 'out'], ['rest', 'read', 'out'], ['rest', 'home', 'home']],
  recover: [['rest', 'read', 'home'], ['rest', 'hunt', 'home'], ['rest', 'read', 'home'], ['rest', 'hunt', 'home'], ['rest', 'read', 'out'], ['rest', 'rest', 'home'], ['rest', 'home', 'home']]
};
// Your phone: conversations by person, a way to text anyone you know, your diary of appointments, and your people.
function threadOf(m) { return m.grp ? m.grp : m.from === -1 ? (m.to ?? 'home') : m.from === null || m.from === undefined ? 'home' : m.from; }
function phonePanel() {
  const M = S.me, all = M.phone || [], known = aliveKnown();
  UI.seen = typeof phoneSeen === 'function' ? phoneSeen() : (UI.seen || {});   // per thread: how many of its messages you've looked at (kept with the game)
  const threads = new Map();
  all.forEach((m, i) => { const k = threadOf(m); threads.set(k, { k, last: m, i, n: ((threads.get(k) || {}).n || 0) + 1 }); });
  const list = [...threads.values()].sort((a, b) => (typeof threadUnread === 'function' ? (threadUnread(b.k) > 0) - (threadUnread(a.k) > 0) : 0) || b.i - a.i);
  const when = m => m.w === S.week ? `${DAYS7[m.d].slice(0, 3)} ${BLOCKS[m.b].toLowerCase()}` : `${S.week - m.w}w ago`;
  const nameOf = k => k === 'home' ? 'Home & gossip' : k === 'crew' ? 'The group chat' : P(k).name;
  const byRel = {};
  for (const id of known) { const r = relOf(id); (byRel[r] = byRel[r] || []).push(id); }
  const T = UI.txt = UI.txt || { id: '', kind: 'hi', slot: 0, msg: '' };
  const open = UI.thread !== undefined && UI.thread !== null && (UI.thread === 'home' || UI.thread === 'crew' || M.known[UI.thread]) ? UI.thread : null;
  if (open !== null && open !== 'home' && open !== 'crew') T.id = String(open);
  const tid = T.id === '' ? null : +T.id, trel = tid !== null && M.known[tid] ? relOf(tid) : null;
  const kinds = [['hi', 'A message'], ['coffee', 'Coffee'], ['drinks', 'Drinks']].concat(tid !== null && opinion(tid) < -5 ? [['sorry', 'Apologise']] : []).concat(trel === 'mentor' ? [['mentor', 'Mentor session']] : []).concat(tid !== null && (trel === 'partner' || canRomance(tid)) ? [['date', trel === 'partner' ? 'Date night' : 'Ask them out']] : []);
  if (tid !== null && typeof topicAvail === 'function') kinds.push(...topicAvail(tid).map(k => [k, TOPICS[k].l]));
  if (!kinds.some(k => k[0] === T.kind)) T.kind = 'hi';
  const free = T.kind === 'hi' || (typeof TOPICS !== 'undefined' && TOPICS[T.kind]);
  const slots = upcomingSlots(16), ahead = apptsAhead();
  const compose = (fixed) => `<div class="compose">${fixed ? '' : `<label>To ${sel('tx-id', [['', 'Someone…']].concat(REL_ORDER.flatMap(r => (byRel[r] || []).map(id => [id, `${REL[r].icon} ${P(id).name}`]))), T.id)}</label>`}
     ${tid !== null ? `<label>${sel('tx-kind', kinds, T.kind)}</label>${free ? `<label class="grow"><input id="tx-msg" maxlength="280" placeholder="${T.kind === 'hi' ? 'Say something (or leave blank)' : 'In your own words (optional)'}" value="${esc(T.msg || '')}"></label>` : `<label>${sel('tx-slot', slots.map((s, i) => [i, slotLabel(s)]), T.slot)}</label>`}<button class="btn-s" data-sendtext="1">Send</button>` : ''}</div>`;
  let left;
  if (open !== null) {
    UI.seen[open] = (threads.get(open) || {}).n || 0;
    const msgs = all.filter(m => threadOf(m) === open).slice(-30);
    const q = open === 'home' || open === 'crew' ? null : P(open), rel = q ? relOf(open) : null;
    const lastIn = msgs.slice().reverse().find(m => m.from !== -1);
    const canReply = q && lastIn && lastIn.replyable && !lastIn.replied && lastIn.id !== undefined;
    left = `<div class="ph-bar"><button class="linkish" data-thread="">‹</button>${phoneAvatar(open, 28)}<div><b>${q ? esc(q.name) : open === 'crew' ? 'The group chat' : 'Home & gossip'}</b>${open === 'crew' && typeof chatCrew === 'function' ? `<small>${chatCrew().map(id => esc(P(id).name.split(' ')[0])).join(', ')} and you</small>` : ''}${q ? `<small>${REL[rel].icon} ${esc(REL[rel].label)} · texts ${esc(TEXT_STYLES[textStyle(q)].label)}</small>` : ''}</div>${q ? `<a href="#" class="lk small" data-go="person:${open}">Profile</a>` : ''}</div>
     ${typeof bondHTML === 'function' && open !== 'home' && open !== 'crew' ? bondHTML(open) : ''}<ul class="sms thread">${msgs.map(m => `<li class="${m.from === -1 ? 'me' : ''} ${m.kind}${m.topic === 'stake' && !m.replied && !m.missed ? ' stake' : ''}">${m.grp && m.from >= 0 && P(m.from) ? `<span class="gsend">${esc(P(m.from).name.split(' ')[0])}</span>` : ''}<p>${esc(m.t)}</p>${m.topic === 'stake' && !m.replied && !m.missed ? '<span class="stakechip">⏳ needs an answer this week</span>' : ''}<time>${when(m)}</time></li>`).join('') || '<li class="muted">No messages yet. Say hello.</li>'}</ul>
     ${canReply ? `<div class="quick">${replyOptions(lastIn).map(k => `<button class="qr" data-reply="${lastIn.id}:${k}">${replyLabel(lastIn, k)}</button>`).join('')}</div><div class="compose own"><input id="rp-text" maxlength="280" placeholder="Or write your own reply…"><button class="btn-s" data-reply="${lastIn.id}:own">Send</button></div><details class="newtopic"><summary class="small">Or change the subject…</summary>${compose(true)}</details>` : q ? compose(true) : open === 'crew' && typeof crewComposeHTML === 'function' ? crewComposeHTML() : ''}`;
  } else {
    left = `<div class="ph-bar"><b>Messages</b>${phoneUnread() ? ` <span class="muted small">${phoneUnread()} unread</span> <button class="linkish small" data-markread="1">Mark all read</button>` : ''}</div><ul class="threads">${list.slice(0, 14).map(t => { const unread = typeof threadUnread === 'function' ? threadUnread(t.k) : t.n - (UI.seen[t.k] || 0); return `<li><button class="thr2${unread > 0 ? ' unread' : ''}" data-thread="${t.k}">${phoneAvatar(t.k, 36)}<span class="tb"><span class="tt"><b>${esc(nameOf(t.k))}</b>${unread > 0 ? `<span class="dot">${unread}</span>` : ''}<time>${when(t.last)}</time></span><span class="prev">${t.last.from === -1 ? 'You: ' : ''}${esc(t.last.t.slice(0, 70))}</span></span></button></li>`; }).join('') || '<li class="muted">No messages yet. Text someone.</li>'}</ul>${compose(false)}`;
  }
  const W = M.wk, clock = W ? ['08:14', '14:37', '21:52'][W.block] : '09:00';
  return `<section class="panel phone"><h3>📱 Your phone</h3>
   <div class="ph-cols"><div class="device"><div class="notch"></div><div class="status"><span>${clock}</span><span>${DAYS7[W ? W.day : 0].slice(0, 3)}</span><span>▮▮▮ ${Math.max(5, Math.round(M.energy))}%</span></div><div class="screen">${left}</div><div class="homebar"></div></div>
    <div><h4>Coming up</h4>${ahead.length ? `<ul class="plain appts">${ahead.slice(0, 8).map(x => `<li>${APPT_KINDS[x.kind].icon} <b>${esc(slotLabel(x))}</b>: ${esc(APPT_KINDS[x.kind].label)}${x.who != null ? ' with ' + pl(x.who) : ''}${x.what ? ` <span class="muted">(${esc(x.what)})</span>` : ''}</li>`).join('')}</ul>` : '<p class="muted small">Nothing booked. Text someone, or say yes to the next invitation.</p>'}
     <h4>Your people</h4>${REL_ORDER.filter(r => byRel[r] && r !== 'contact').map(r => `<p class="relrow"><span class="relk">${REL[r].icon} ${esc(REL[r].label)}${byRel[r].length > 1 && r !== 'partner' ? 's' : ''}</span> ${byRel[r].slice(0, 8).map(id => `<button class="linkish" data-thread="${id}">${esc(P(id).name)}</button>`).join(', ')}${byRel[r].length > 8 ? ` <span class="muted">+${byRel[r].length - 8}</span>` : ''}</p>`).join('') || '<p class="muted small">Nobody close yet. It takes time: see people, and keep seeing them.</p>'}
     ${byRel.contact ? `<p class="muted small">${byRel.contact.length} other contacts. People you don't see for a couple of months drift.</p>` : ''}</div></div></section>`;
}
// How the game works, in one place. Opens by itself the first time you reach your desk.
function guidePanel() {
  const ex = { stat: 'cha', d: 14, dice: [14], mod: 1, DC: 12, adv: 0, ok: true, crit: 0, why: ['Charming'] };
  return `<section class="panel guide"><h3>How this works <button class="linkish" data-guide="">Close</button></h3>
   <div class="g-grid">
    <div><h4>It's your world</h4><p>There is no script. A whole film industry runs around you week by week: studios rise and fall, films open and flop, people you met at a party become famous or vanish. You're one more person in it. Pick a dream and chase it, change your mind, build a circle of collaborators and grow your own corner of the business into something you're proud of.</p>
     <p class="muted">Some goals people set themselves: a first screen credit · a film of your own · a festival prize · a home worth coming back to · a crew who follows you from job to job · a studio with your name on it.</p></div>
    <div><h4>A week</h4><p>Your week is a diary: seven days, each with a morning, an afternoon and an evening. Fill the blocks yourself or pick a quick plan. A job takes the working blocks; interviews, coffees, dates and invitations land in the diary as appointments. Press <b>Next</b> or the <kbd>space</kbd> bar to live on until something worth your attention happens: a decision, a text, a roll. <b>End day</b> and <b>End week</b> go further. The week closes with pay, replies, rent and the news.</p>
     <p class="muted">Energy drains with work and returns with sleep. Stress builds with rejection and bills. Let either run too far and you'll burn out for a week.</p></div>
    <div><h4>Your desk</h4><p>Everything about your life sits in the tabs under your portrait: <b>Today</b> (what's happening and what needs a decision), <b>Your week</b> (the diary), <b>Phone</b>, <b>Work</b> (your job and the board), <b>Create</b> (scripts, producing, your company), <b>Life</b> (school, agents, your home, your story) and <b>People</b>. Numbers on a tab mean something's waiting there.</p></div>
    <div><h4>Your phone and your people</h4><p>Friends text, invite you out, ask for favours and pass on gossip. Text anyone to fix a coffee or drinks; see people often and they become friends, close friends, maybe more. A senior contact might mentor you. Ignore people for a couple of months and they drift. A partner, good friends or a lonely spell all show up in your rolls.</p></div>
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
      <p class="muted">${esc(sc.logline)}</p>${sc.made !== undefined ? `<p class="small good">🎬 In the world: ${fl(sc.made)} · ${esc(S.films[sc.made].status)}</p>` : sc.option ? `<p class="small">📝 Optioned by ${pl(sc.option.by)} until ${fmtDate(sc.option.to, true)}. They're trying to get it made.</p>` : ''}${sc.hero || sc.setting || sc.notes ? `<details class="scnotes"><summary>Your notes</summary>${sc.hero ? `<p><b>Hero:</b> ${esc(sc.hero)}</p>` : ''}${sc.setting ? `<p><b>World:</b> ${esc(sc.setting)}</p>` : ''}${sc.notes ? `<p class="notes">${esc(sc.notes)}</p>` : ''}</details>` : ''}
      ${UI.sample && (sc.grade || sc.pages >= 10) ? `<p class="small"><button class="btn-s ghost" data-readpages="${sc.id}">📄 Read the pages</button> <span class="muted">Claude writes the opening as well, or as badly, as ${sc.grade ? 'your ' + sc.grade : 'this draft so far'} deserves.</span></p>` : ''}
      ${sc.stage === 'writing' ? `<div class="pbar"><i style="width:${pct}%"></i></div><p class="small">${sc.pages} of ${sc.target} pages${M.activeScript === sc.id ? ' · <b>writing this one</b>' : ` · <button class="linkish" data-activescript="${sc.id}">Write this one</button>`}</p>`
        : `<p class="small"><button class="btn-s ghost" data-rewrite="${sc.id}">Rewrite (draft ${sc.draft + 1})</button>
          <select data-share="${sc.id}"><option value="">Show it to…</option>${known.filter(id => !sc.shared.includes(id)).map(id => { const t = tasteOf(P(id)); return `<option value="${id}">${esc(P(id).name)}${t.genres.includes(sc.genre) ? ' ♥ ' + esc(sc.genre.toLowerCase()) : ''}</option>`; }).join('')}</select>
          <button class="btn-s ghost" data-dtab="compete">Send it to a competition</button></p>`}</div>`;
  };
  return `<section class="panel"><h3>Writing desk</h3>${L.length ? L.slice().reverse().map(row).join('') : '<p class="muted">No scripts yet. Every writer you admire started with a blank page and a stubborn idea.</p>'}
   ${L.filter(x => x.stage === 'writing').length < 2 ? `<details class="newscript"${L.length ? '' : ' open'}><summary>Start a new script</summary>
    <div class="ns"><label>Title <input id="ns-title" value="${esc(f.title)}" placeholder="Leave blank for a working title"></label>
    <label>Genre ${sel('ns-genre', GENRES.map(g => [g, g + (M.love.includes(g) ? ' ♥' : (M.hate || []).includes(g) ? ' ✗' : '')]), f.genre)}</label>
    <label>Theme ${sel('ns-theme', THEME_KEYS.map(k => [k, THEMES[k] + (topThemes(voiceOf()).includes(k) ? ' ★' : '')]), f.theme)}</label>
    <label>Tone ${sel('ns-tone', Object.entries(TONES), f.tone)}</label></div>
    <div class="ns2"><label>Premise <span class="muted small">(one or two sentences: who wants what, and what's in the way)</span><textarea id="ns-premise" rows="2" maxlength="400" placeholder="A night-shift nurse discovers her hospital is quietly selling patients' memories…">${esc(f.premise || '')}</textarea></label>
     <label>Your hero <input id="ns-hero" maxlength="120" value="${esc(f.hero || '')}" placeholder="an ageing magician with one trick left"></label>
     <label>The world <input id="ns-setting" maxlength="120" value="${esc(f.setting || '')}" placeholder="a seaside town in the off-season"></label>
     <label>Background and notes <span class="muted small">(as much as you like: characters, scenes you can see, the ending, why it matters to you)</span><textarea id="ns-notes" rows="5" maxlength="6000">${esc(f.notes || '')}</textarea></label>
     <button class="btn-s" data-newscript="1">Begin</button></div>
    <p class="muted small">♥ genres you love write better; ✗ genres you hate write worse. ★ themes are already part of your voice. Preparation helps: a premise, a hero, a world and real notes all lift the draft a little. How you write depends on who you are: ${esc(writerStyle().lines.slice(0, 2).join(' ') || 'your traits will shape the process.')} Plan writing blocks to make progress.</p></details>` : ''}</section>`;
}
// Producing: scripts looking for a home, the ones you've optioned, and where you can pitch them.
function producingPanel() {
  const M = S.me, me = ME(), mk = M.market || [], hs = (M.holdings || []).filter(h => !h.lapsed), cos = S.companies.filter(c => c.hub === M.hub && c.closed === null && c.owner === undefined).sort((a, b) => a.tier - b.tier);
  if (!mk.length && !hs.length) return `<section class="panel"><h3>Producing</h3><p class="muted">No scripts on your desk yet. As you get known (or if producing is your trade), writers will send you their specs to option.</p></section>`;
  const T = UI.pitch = UI.pitch || {};
  return `<section class="panel"><h3>Producing</h3>
   ${mk.length ? `<h4>Scripts looking for a home</h4><ul class="plain specs">${mk.map(x => { const c = coverage(x); return `<li><b>${esc(x.title)}</b> <span class="muted">${esc(x.genre)} · ${esc(THEMES[x.theme])} · by ${pl(x.writer)}</span><br><span class="small">Your read: <span class="grade g${gradeOf(c)}">${gradeOf(c)}</span> <span class="muted" title="The sharper your Taste, the closer your read is to the truth">(Taste ${Math.floor(me.mind.tas)})</span> · option for ${fmtCash(x.price)}</span> <button class="btn-s ghost" data-optionspec="${x.id}" ${M.cash < x.price || hs.filter(h => h.made === undefined).length >= 3 ? 'disabled' : ''}>Option it</button></li>`; }).join('')}</ul>` : ''}
   ${hs.length ? `<h4>Your options</h4><ul class="plain specs">${hs.map(h => h.made !== undefined ? `<li><b>${esc(h.title)}</b> 🎬 ${fl(h.made)} · ${esc(S.films[h.made].status)} · you're producing</li>` : (() => { const avail = cos.filter(c => !(M.coYes || {})[c.id] && (!h.pitched[c.id] || S.week - h.pitched[c.id] >= 8)), sel0 = avail.find(c => c.id === +T[h.id]) || avail[0]; return `<li><b>${esc(h.title)}</b> <span class="muted">by ${pl(h.writer)} · until ${fmtDate(h.to, true)}</span><br>${avail.length ? `<span class="pitchrow">${sel('pitch-' + h.id, avail.map(c => [c.id, `${c.name} ${'★'.repeat(4 - c.tier)}`]), sel0.id)} ${oddsBar('pack', pitchDC(h, sel0))} <button class="btn-s" data-pitch="${h.id}:${sel0.id}" ${M.pitchW === curW() ? 'disabled title="One pitch a week"' : ''}>Pitch</button></span>` : '<span class="muted small">Everyone has heard it recently. Try again in a few weeks.</span>'}</li>`; })()).join('')}</ul>` : ''}
   <p class="muted small">One pitch a week, and each company makes at most one of yours a year. Pitching rolls your Packaging. Bigger companies are harder to convince; a better script, more standing and an agent all help. If they say yes, the film goes into production with you as producer.</p></section>`;
}
// Your company and your films: found one, fund it, make films with it, take them to festivals.
function companyPanel() {
  const M = S.me, me = ME(), c = myCo(), films = myFilms().sort((a, b) => b.id - a.id);
  const T = UI.co = UI.co || { amt: 5000, name: '' };
  let co;
  if (!c) co = canFound() ? `<p class="muted">Start your own production company: ${fmtCash(usd(FOUND_COST))} for the lawyers, an office and a bank account. Then put money in, and it can finance your scripts (and you can direct them).</p><div class="ccrow"><label>Name <input id="co-name" maxlength="40" placeholder="${esc(me.name.split(' ').pop())} Pictures" value="${esc(T.name)}"></label> <button class="btn-s" data-found="1">Found it</button></div>`
    : `<p class="muted">One day you could run your own production company. You'll need ${fmtCash(usd(FOUND_COST))} and a first credit, an option or some standing.</p>`;
  else {
    const srcs = (M.scripts || []).filter(x => x.grade && !x.option && x.made === undefined).map(x => ['script', x]).concat((M.holdings || []).filter(h => h.made === undefined && !h.lapsed).map(h => ['holding', h]));
    co = `<p><a href="#" class="lk" data-go="co:${c.id}">${esc(c.name)}</a> ${'★'.repeat(4 - c.tier)} ${c.closed !== null ? '<span class="bad">closed</span>' : ''}· in the bank: <b class="${c.cash < 0 ? 'bad' : ''}">${fmtCash(Math.round(c.cash * 1e6))}</b> · ${c.films.length} film${c.films.length === 1 ? '' : 's'} · ${c.hits} hit${c.hits === 1 ? '' : 's'}</p>
     ${c.closed === null ? `<div class="ccrow"><label>Amount <input id="co-amt" type="number" min="100" step="100" value="${T.amt}"></label> <button class="btn-s ghost" data-comoney="invest">Put in</button> <button class="btn-s ghost" data-comoney="withdraw">Take out</button></div>
     ${strategyPanel(c)}
     ${srcs.length ? `<h4>Make a film</h4>${srcs.map(([k, x]) => makeFilmForm(c, k, x)).join('')}<p class="muted small">A micro-budget costs a quarter, and the film will feel it. A famous lead costs more and sells more tickets. Directing takes you five days a week until release, and your directing craft shapes the film.</p>` : '<p class="muted small">Finish a script or option one to make a film with your company.</p>'}` : ''}`;
  }
  const festRow = f => { const done = (M.fests || []).filter(x => x.film === f.id); return festEligible(f) ? `<span class="fests">${FESTIVALS.filter(F => done.some(x => x.k === F.k) || typeof festFits !== 'function' || festFits(F, f)).map(F => { const e = done.find(x => x.k === F.k); return e ? `<span class="chip ${e.sel ? 'good' : e.done ? '' : 'hist'}">${esc(F.name.replace(/^the /, ''))}: ${e.done ? (e.sel ? 'selected' : 'no') : 'waiting'}</span>` : (() => { const W = typeof festWindow === 'function' ? festWindow(F) : { open: true }, p = typeof festSelOdds === 'function' ? festSelOdds(F, f) : 0; return W.open ? `<button class="btn-s ghost" data-fest="${f.id}:${F.k}" title="${esc(F.d)} Entry ${fmtCash(usd(F.fee))}. Line-up announced in ${MON[F.month]}. Programmers' odds for this film: ${Math.round(p * 100)}% (${festChanceLabel(p)}).">${esc(F.name.replace(/^the /, ''))} · ${MON[F.month]} · ${Math.round(p * 100)}%</button>` : ''; })(); }).join(' ')}</span><span class="small muted"> Submissions open 1–4 months before each festival; others appear here when their window opens.</span>` : ''; };
  return `<section class="panel"><h3>Your company and films</h3>${co}
   ${films.length ? `<h4>Your films</h4><ul class="plain specs">${films.map(f => `<li>${fl(f.id)} <span class="muted">${esc((f.xc && f.xc[me.id]) || (f.dir === me.id ? 'Director' : f.prod === me.id ? 'Producer' : f.wri.includes(me.id) ? 'Writer' : 'Crew'))} · ${esc(f.status)}${f.rel !== null ? ` · ${f.reviews}/100 · ${fmtM(f.total)} worldwide · ${money(f.theatrical)} at the box office` : ''}</span>${f.rel === null && f.stage >= 0 ? `<br>${stageCell(f)} <span class="muted small">${fmtM(f.cost)} budget · ${f.stage < 4 ? 'next stage ' + fmtDate(f.stageEnd, true) : ''}${f.investors ? ` · investors take ${Math.round(f.investors.share * 100)}%` : ''}</span>` : ''}${festEligible(f) ? '<br>' + festRow(f) : ''}</li>`).join('')}</ul><p class="muted small">Released films can go to festivals for a year. Selection depends on quality; small independent films get a little extra love.</p>` : ''}${typeof finPanelHTML === 'function' ? finPanelHTML() : ''}</section>`;
}
// School and representation: the two longer roads.
function pathsPanel() {
  const M = S.me, ags = agenciesIn(M.hub).sort((x, y) => agFits(y) - agFits(x));
  const sc = M.school, P0 = sc ? (typeof schoolProg === 'function' ? schoolProg(sc) : PROGRAMS[sc.prog]) : null;
  const school = sc ? `<p><b><a href="#" class="lk" data-go="myschool:0">${esc(P0.label)}</a></b> in ${esc(CRAFTS[sc.craft].label.toLowerCase())}: week ${sc.done} of ${P0.weeks}. <b>${P0.days} study session${P0.days > 1 ? 's' : ''}</b> a week (${schoolDays()} planned this week; fitted into your diary automatically)${sc.missed ? ` <span class="bad">(missed ${sc.missed} week${sc.missed > 1 ? 's' : ''}; four and you're out)</span>` : ''}. ${P0.fee > 0 ? fmtCash(usd(P0.fee)) + ' a week.' : 'Pays ' + fmtCash(usd(-P0.fee)) + ' a week.'}</p><div class="pbar"><i style="width:${Math.round(sc.done / P0.weeks * 100)}%"></i></div><p><button class="linkish" data-dropout="1">Drop out</button></p>`
    : !UI.courses ? `<p class="muted">Courses grow one craft fast; degrees open doors that ask for one.${M.degrees.length ? ` You have: ${M.degrees.map(d => ((typeof DEG_LABEL !== 'undefined' && DEG_LABEL[d]) || 'a ' + d + ' degree')).join(', ')}.` : ''}</p><p><button class="btn-s ghost" data-courses="1">Browse courses</button></p>`
    : `<p class="muted"><button class="linkish" data-courses="">Hide courses</button> Courses grow one craft fast and degrees open doors that ask for one.${M.degrees.length ? ` You have: ${M.degrees.map(d => ((typeof DEG_LABEL !== 'undefined' && DEG_LABEL[d]) || 'a ' + d + ' degree')).join(', ')}.` : ''}</p>
      <div class="courses">${Object.entries(PROGRAMS).map(([k, P1]) => `<div class="course"><b>${esc(P1.label)}</b><p class="muted">${esc(P1.d)}</p><p class="small">${P1.weeks} weeks · ${P1.days} study session${P1.days > 1 ? 's' : ''} a week · ${P1.fee > 0 ? fmtCash(usd(P1.fee)) + '/wk' : 'paid ' + fmtCash(usd(-P1.fee)) + '/wk'}${P1.apply ? ' · ' + oddsBar(P1.apply[0], P1.apply[1]) : ''}</p>${P1.craft ? `<button class="btn-s" data-enrol="${k}:${P1.craft}"${M.schoolTry > S.week - 26 ? ' disabled title="Try again in six months"' : ''}>${P1.apply ? 'Apply' : 'Enrol'}</button>` : `<span class="enrolrow">${Object.keys(CRAFTS).map(c => `<button class="btn-s ghost" data-enrol="${k}:${c}">${esc(CRAFTS[c].label)}</button>`).join(' ')}</span>`}</div>`).join('')}</div>`;
  const agent = M.agent ? `<p>${pl(M.agent.id)} at <b>${esc(M.agent.name)}</b> ${'★'.repeat(M.agent.tier)} represents you. <b>${esc(AG_STYLE[M.agent.style || 'nurturer'].label)}</b>: ${esc(AG_STYLE[M.agent.style || 'nurturer'].d)} Last booking ${S.week - M.agent.lastBook} weeks ago${S.week - M.agent.lastBook > AG_STYLE[M.agent.style || 'nurturer'].patience - 10 ? ' <span class="bad">(they\'re getting restless)</span>' : ''}.</p><p><button class="linkish" data-fireagent="1">Leave your agent</button></p>`
    : `<p class="muted">No agent. Send a query, or get some credits and they'll call you. Each agency will look at you once every twelve weeks.</p><table class="grid small"><tbody>${ags.map(a => { const p = Math.round(queryOdds(a) * 100), wait = (M.queried || {})[a.i] > S.week - 12; return `<tr${agFits(a) ? '' : ' class="blocked"'}><td>${esc(a.name)} <span class="lvl">${'★'.repeat(a.tier)}</span><br><span class="muted small" title="${esc(AG_STYLE[a.style].d)}">${esc(AG_STYLE[a.style].label)} · for ${esc(AG_FOCUS[a.focus])}</span></td><td><span class="oddsbar"><span class="ob-t"><i style="width:${p}%" class="${p < 35 ? 'lo' : p < 65 ? 'mid' : 'hi'}"></i></span><b>${p}%</b></span></td><td>${wait ? '<span class="muted">Wait</span>' : `<button class="btn-s ghost" data-query="${a.i}">Query</button>`}</td></tr>`; }).join('')}</tbody></table>`;
  const world = typeof schoolsHTML === 'function' ? (UI.schools ? `<p><button class="linkish" data-schools="">Hide the world's schools</button></p>${schoolsHTML()}` : `<p><button class="btn-s ghost" data-schools="1">Schools around the world</button> <span class="muted small">Film, music, drama, animation, games, journalism and business schools in every city.</span></p>`) : '';
  return `<section class="panel"><h3>School</h3>${school}${M.school ? '' : world}<h3>Representation</h3>${agent}</section>`;
}
// A little drawing of each kind of home, from a couch to a house with a garden.
function homeIcon(life) {
  const b = { couch: '<rect x="8" y="30" width="44" height="14" rx="4" fill="#7A6E8E"/><rect x="8" y="24" width="44" height="10" rx="4" fill="#5E536F"/>', shared: '<rect x="14" y="10" width="32" height="38" fill="#B9A58A"/>' + [0, 1, 2].map(i => `<rect x="18" y="${14 + i * 11}" width="8" height="7" fill="#FFE9A8"/><rect x="34" y="${14 + i * 11}" width="8" height="7" fill="#5E7C78"/>`).join(''), studio: '<rect x="16" y="18" width="28" height="30" fill="#C9B79C"/><rect x="24" y="24" width="12" height="9" fill="#FFE9A8"/><rect x="26" y="38" width="8" height="10" fill="#6B4E3A"/>', own: '<rect x="12" y="16" width="36" height="32" fill="#D7C4A3"/><rect x="17" y="21" width="10" height="8" fill="#FFE9A8"/><rect x="33" y="21" width="10" height="8" fill="#FFE9A8"/><rect x="25" y="36" width="10" height="12" fill="#6B4E3A"/>', loft: '<rect x="6" y="12" width="48" height="36" fill="#8A6A5A"/>' + [0, 1, 2, 3].map(i => `<rect x="${10 + i * 11}" y="18" width="7" height="10" fill="#FFE9A8"/>`).join('') + '<rect x="6" y="10" width="48" height="4" fill="#5E5A54"/>', house: '<path d="M10 28 L30 10 L50 28 Z" fill="#B3261E"/><rect x="14" y="28" width="32" height="20" fill="#F3EBDD"/><rect x="26" y="36" width="8" height="12" fill="#6B4E3A"/><rect x="0" y="46" width="60" height="4" fill="#5DBB85"/>' }[life] || (typeof HOME_ICON2 !== 'undefined' && HOME_ICON2[life]) || '';
  return `<svg viewBox="0 0 60 50" width="72" height="60">${b}</svg>`;
}
// The city this week: what's on, and the venues you can put in your evenings.
function cityPanel() {
  const M = S.me, on = whatsOn(), cat = UI.vcat || 'all', trips = tripsAvailable();
  const V = Object.entries(VENUES).filter(([, x]) => cat === 'all' || x.cat === cat);
  const card = (k, x, title, d) => `<div class="wo"><span class="wi">${x.icon}</span><div><b>${esc(title || x.label)}</b><p class="muted">${esc(d || x.d)}${title ? ' · ' + esc(x.label) : ''}</p><p class="small muted">${x.cost ? fmtCash(usd(x.cost)) : 'free'} · energy ${x.e > 0 ? '−' + x.e : '+' + -x.e}${x.stress < 0 ? ` · stress ${x.stress}` : x.stress > 0 ? ` · stress +${x.stress}` : ''}${x.meet ? ' · good for meeting people' : ''}</p><button class="btn-s ghost" data-tonight="v:${k}">Go tonight</button></div></div>`;
  return `<section class="panel city"><h3>Out and about in ${esc(hubName(M.hub))}</h3>
   <h4>This week</h4><div class="whatson">${on.slice(0, UI.cityAll ? 99 : 3).map(x => card(x.venue, VENUES[x.venue], x.title, x.d)).join('')}</div>${on.length > 3 && !UI.cityAll ? `<p><button class="linkish" data-cityall="1">Show all ${on.length} this week</button></p>` : ''}
   <h4>Weekend away</h4><div class="whatson">${trips.map(T => `<div class="wo"><span class="wi">${T.fest ? '🎪' : '✈️'}</span><div><b>${esc(T.label)}</b><p class="muted">${esc(T.d)}</p><p class="small muted">${fmtCash(usd(T.cost))} · Saturday and Sunday</p><button class="btn-s ghost" data-trip="${T.k}" ${M.cash < usd(T.cost) ? 'disabled title="Not enough money"' : ''}>Book it</button></div></div>`).join('') || '<p class="muted">Nothing tempting this month.</p>'}</div>
   <details class="howit"${UI.vcat ? ' open' : ''}><summary><b>Every place in town</b></summary><div class="seg vcats">${Object.entries(VENUE_CATS).map(([k, l]) => `<button class="pill${cat === k ? ' on' : ''}" data-vcat="${k}">${l}</button>`).join('')}</div>
   <div class="whatson">${V.map(([k, x]) => card(k, x)).join('')}</div></details>
   <p class="muted small">"Go tonight" puts it in this evening's block; plan venues for any evening in the diary.</p></section>`;
}
// Your place: the furniture shop and where things go.
function homePanel() {
  const M = S.me, H = M.home, lay = homeLayout(), spots = HOME_SPOTS[M.life] || [];
  const spotName = { wallL: 'Left wall', wallL2: 'Left wall, by the door', wallR: 'Right wall', floorL: 'Left corner', floorC: 'By the window', floorR: 'Right corner', corner: 'Back corner', sill: 'Windowsill', wallC: 'Over the window', wallM: 'Middle wall', nook: 'The reading nook', sill2: 'Second sill', floorX: 'Middle of the room' };
  return `<section class="panel"><h3>Your place</h3>
   ${typeof roomStyleHTML === 'function' ? roomStyleHTML() : ''}
   <p class="muted">${M.life === 'couch' ? 'You\'re on a friend\'s couch: there\'s a windowsill and that\'s it. Anything bigger waits in a box until you have a room of your own.' : `${esc(ORIGIN.life[M.life].label)}: ${(HOME_SPOTS[M.life] || []).length} spots for things.`} Things only help once they're in the room.</p>
   ${H.items.length ? `<h4>Arrange</h4><div class="arr">${H.items.map(id => { const F = FURNITURE[id], ok = spots.filter(s => fits(F.kind, s.kind));
     return `<label>${esc(F.name)} <select data-place="${id}"><option value="">${lay[id] ? 'Wherever there\'s room' : 'In a box (no room)'}</option>${ok.map(s => `<option value="${s.id}"${H.layout[id] === s.id ? ' selected' : ''}>${esc(spotName[s.id] || s.id)}</option>`).join('')}</select></label>`; }).join('')}</div>
     <p><button class="btn-s ghost" data-arrange="auto">Let the game arrange it</button> <button class="btn-s ghost" data-arrange="shuffle">Shuffle it</button></p>` : ''}
   <h4>Places to live in ${esc(hubName(M.hub))}</h4><div class="listings">${listingsIn(M.hub).map(L => { const life = ORIGIN.life[L.life], here = M.life === L.life && (M.hoodWhere === L.where || !M.hoodWhere), hood = HOOD_KINDS.find(h => h.k === L.hood);
     return `<div class="listing${here ? ' here' : ''}">${homeIcon(L.life)}<div><b>${esc(life.label)}</b><p class="muted">${esc(L.where)}. ${esc(life.d)} ${esc(hood.d)}</p><p class="small">${fmtCash(usd(L.rent))}/wk · ${(HOME_SPOTS[L.life] || []).length} spots for things · rest ${life.rest >= 0 ? '+' : ''}${life.rest}</p>${here ? '<span class="chip t-Award">You live here</span>' : `<button class="btn-s" data-move="${L.i}"${L.life !== 'couch' && M.cash < usd(L.rent) * 2 ? ' disabled' : ''}>Move here${L.life !== 'couch' ? ` (deposit ${fmtCash(usd(L.rent) * 2)})` : ''}</button>`}</div></div>`; }).join('')}</div>
   <h4>Getting around</h4><div class="listings">${Object.entries(VEHICLES).filter(([k, V]) => !V.from || S.year >= V.from || (M.vehicle || 'transit') === k).sort((a, b) => a[1].price + a[1].upkeep * 20 - b[1].price - b[1].upkeep * 20).map(([k, V]) => { const mine = (M.vehicle || 'transit') === k;
     return `<div class="listing${mine ? ' here' : ''}"><span class="vi">${typeof vehicleSVG === 'function' ? vehicleSVG(k, 56) : V.icon}</span><div><b>${esc(V.label)}</b><p class="muted">${esc(V.d)}</p><p class="small">${V.price ? fmtCash(usd(V.price)) : 'no cost'} · ${fmtCash(usd(V.upkeep))}/wk to run · commute energy −${V.e}${V.standing ? ' · standing +' + V.standing : ''}</p>${mine ? '<span class="chip t-Award">Yours</span>' : `<button class="btn-s" data-vehicle="${k}"${M.cash < usd(V.price) - Math.round(usd(VEHICLES[M.vehicle || 'transit'].price) * .4) ? ' disabled' : ''}>${V.price ? 'Buy (trade in yours)' : 'Sell up and ride the bus'}</button>`}</div></div>`; }).join('')}</div>
   <h4>Furniture and things</h4><div class="shop">${Object.entries(FURNITURE).map(([id, F]) => { const own = H.items.includes(id);
     return `<div class="shop-item${own ? ' owned' : ''}"><svg viewBox="-30 -84 120 92" width="64" height="50">${furnitureSVG(id, 0, 0)}</svg><div><b>${esc(F.name)}</b><p class="muted">${esc(F.d)}</p><p>${fxBadges(F)}</p>${own ? `<span class="chip t-Award">${lay[id] ? 'In the room' : 'In a box'}</span>` : `<button class="btn-s" data-furnish="${id}"${M.cash < F.price ? ' disabled' : ''}>Buy ${usd(F.price)}</button>`}</div></div>`; }).join('')}</div></section>`;
}
// The computer is the one main screen: a desk section asked for by any link opens as its app inside it.
const DT2APP = { today: 'today', feed: 'feed', diary: 'week', phone: 'phoneapp', work: 'work', create: 'create', compete: 'contests', standing: 'standing', life: 'life', people: 'people', computer: 'home' };
function viewDesk() {
  if (!UI.inPart && UI.dtab !== 'computer') { const was = UI.dtab; UI.dtab = 'computer'; if (was) { UI.app = DT2APP[was] || 'home'; UI.osStack = []; } }
  const M = S.me, me = ME(), life = ORIGIN.life[M.life];
  const pend = pending();
  const plan = [].concat(...planBlocks()), jd = jobDays();
  const rent = usd(life.rent) + (M.debt > 0 ? Math.min(M.debt, M.debtPay) : 0) - M.allowance;
  const recent = M.inbox.filter(x => !(x.choices && !x.done)).slice(-14).reverse();
  const known = Object.keys(M.known).map(Number).filter(id => !P(id).dead || M.known[id].tags.includes('Your parent'));
  const slots = appSlots(), picked = [...UI.apps].filter(id => M.board.some(p => p.id === id));
  const lastDiary = M.diary.filter(d => d.w >= S.week - 1);
  const card = it => `<li class="msg ${it.kind}${it.choices && !it.done ? ' open' : ''}">${inboxCard(it)}</li>`;
  const boardRow = p => {
    const f = p.film !== null ? S.films[p.film] : null, odds = hireOdds(p), on = UI.apps.has(p.id), t = tmplOf(p);
    const why = hireFactors(p).filter(x => Math.abs(x[1]) >= .1).map(x => `${x[0]} ${x[1] > 0 ? '+' : '−'}`).join(', ');
    const block = blockedFrom(t);
    return `<tr${block ? ' class="blocked"' : ''}><td><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a>${p.agent ? ' ' + chip('Via your agent', 'good') : ''}${p.ref ? ' ' + chip('Referral', 'good') : ''}${t.cr ? ' ' + chip('Credit', 'hist') : ''}${p.tier === 0 ? ' ' + chip('Internship', 'hist') : ''}${t.tier >= 2 ? ` <span class="lvl" title="Job level">${'★'.repeat(t.tier)}</span>` : ''}${p.away ? ' ' + chip(`In ${hubName(p.away)}: you'd move`, HUBS[p.away].lang === HUBS[S.me.hub].lang ? 'hist' : 'warn') : ''}${block ? `<br><span class="bad small">⚠ ${esc(block)}: you'll be filtered out</span>` : ''}</td><td>${f ? fl(f.id) + ` <span class="muted">${esc(f.status.toLowerCase())}</span>` : p.mco ? `${esc(p.mco)} <span class="muted">${esc(t.biz || '')}</span>` : p.co !== undefined ? `<a href="#" class="lk" data-go="co:${p.co}">${esc(S.companies[p.co].name)}</a> <span class="muted">${esc(t.biz || '')}</span>` : `<span class="muted">${esc(t.d)}</span>`}</td><td>${p.head !== null ? pl(p.head) : '<span class="muted">—</span>'}</td><td class="n">${p.days}d × ${p.weeks}w${typeof fitChip === 'function' ? '<br>' + fitChip(p) : ''}</td><td class="n" title="Typical range for this job">${p.rate ? `${fmtCash(p.rate)}<br><span class="muted small">${fmtCash(Math.round(p.rate * .8 / 5) * 5)}–${fmtCash(Math.round(p.rate * 1.35 / 5) * 5)} · ~${fmtCash(Math.round(p.rate / 10))}/hr</span>` : 'unpaid'}</td><td><span class="odds-chip ${odds < .3 ? 'lo' : odds < .65 ? 'mid' : 'hi'}" title="${esc(why)}">${oddsBand(odds)}</span></td>
      <td>${`<label class="applyl"><input type="checkbox" data-apply="${p.id}" ${on ? 'checked' : ''} ${!on && picked.length >= slots ? 'disabled' : ''}> Apply</label>`}</td></tr>`;
  };
  const conRows_ = () => known.sort((a, b) => opinion(b) - opinion(a)).map(id => {
    const q = P(id), k = M.known[id], o = opinion(id);
    const film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id));
    return `<tr><td>${pl(id)}</td><td>${esc(q.occ || occupationOf(q))}<span class="muted"> · ${esc(hubName(q.hub))}</span></td><td class="n ${o > 10 ? 'good' : o < -10 ? 'bad' : ''}">${o > 0 ? '+' : ''}${Math.round(o)}</td><td class="n">${Math.round(k.trust)}</td><td class="n">${k.due ? `<span class="good">${k.due} owed to you</span>` : ''}${k.due && k.owe ? ', ' : ''}${k.owe ? `<span class="bad">you owe ${k.owe}</span>` : ''}</td><td class="st">${(() => { const t = tasteOf(q); return t.genres.map(g => M.love.includes(g) ? `<b class="good">♥ ${esc(g)}</b>` : esc(g)).join(', ') + ' · ' + (topThemes(voiceOf()).includes(t.theme) ? `<b class="good">${esc(THEMES[t.theme])}</b>` : esc(THEMES[t.theme])); })()}</td><td class="st">${esc(k.tags.slice(-2).join(' · '))}</td><td class="st">${film ? fl(film.id) : esc(personStatus(q))}</td>
      <td>${(k.due > 0 || k.trust >= 60) && !q.dead ? `<button class="linkish" data-favour="${id}">${k.due > 0 ? 'Call in a favour' : 'Ask for a favour'}</button>` : ''}</td></tr>`;
  }).join('');
  // a desk part (an app on the computer) skips the hero: only the tab is needed
  return `${UI.inPart ? '' : `<div class="hero"><div class="hs">${homeSceneSVG(M.wk ? M.wk.day : 0)}</div><div class="hid"><p class="eyebrow">${esc(roleTitle(me.role))} · ${esc(hubName(M.hub))} · age ${ageOf(me)}</p><h2>${esc(me.name)}</h2>
   <p class="lede">${M.stats.weeks ? `${M.stats.weeks} weeks of paid work, ${me.credits.length} screen credit${me.credits.length === 1 ? '' : 's'}.` : 'No industry work yet.'} <span class="lvlchip" title="Your level decides which jobs you hear about">Level ${careerLevel()} · ${LEVEL_NAME[careerLevel()]}</span></p>
   ${typeof dreamLine === 'function' ? dreamLine() : ''}
   <p class="voice">Your voice: ${topThemes(voiceOf()).map(k => `<span class="vt">${esc(THEMES[k])}</span>`).join(' ') || '<span class="muted">still finding it</span>'} <span class="muted">· loves ${esc(M.love.join(', ').toLowerCase() || 'everything')}</span>${typeof fitLabel === 'function' && S.me.fit && (S.me.fit.mus >= 1.5 || Math.abs(S.me.fit.mass) >= 1.5 || S.me.fit.goal) ? ` · <span class="muted">Body: ${esc(fitLabel())}</span>` : ''}</p>
   <p class="hlinks"><a href="#" class="lk" data-go="person:${me.id}">Your full sheet</a> · <button class="linkish" data-restyle="1">${UI.restyle ? 'Done changing your look' : 'Change your look'}</button> · <button class="linkish" data-dtab="life">Your place</button> · <button class="linkish" data-dtab="life">Your story</button> · <button class="linkish" data-guide="1">${UI.guide ? 'Close the guide' : 'How this works'}</button></p>
   <div class="kpis mini"><div><span>Cash</span><b class="${M.cash < 0 ? 'bad' : ''}">${fmtCash(M.cash)}</b><small class="muted">${fmtCash(rent)} a week to live${M.shark ? ` · owe ${fmtCash(M.shark)}` : ''}</small></div>
    <div><span>Energy</span>${meter('', M.energy, 'data')}</div><div><span>Stress</span>${meter('', M.stress, 'warm')}</div><div><span>Standing</span>${meter('', me.standing, 'accent')}</div></div></div></div>
  ${UI.restyle ? `<section class="panel cc"><h3>Your look</h3><p class="muted">Haircuts and new clothes. Ageing happens on its own. Pieces marked ★ were bought.</p>${lookControls({ look: Object.assign(defaultLook(), M.look) }, M.owned)}${wardrobeShop()}</section>` : ''}
  ${UI.guide || (UI.guide === undefined && !M.stats.apps && !M.stats.weeks && !M.wk) ? guidePanel() : ''}
  ${M.over ? (typeof epilogueHTML === 'function' ? epilogueHTML() : `<section class="panel"><h3>You left the business</h3><p>Your career ended in ${S.year}. The world keeps running; you can watch it from the other tabs.</p><button class="btn primary" data-startover="1">Start a new career</button></section>`) : ''}
`}
  <div class="dstack">${(() => { switch (UI.dtab || 'computer') {
    case 'feed': return feedPanel();
    case 'compete': return (typeof seasonHTMLFull === 'function' ? seasonHTMLFull() : '') + campaignHTML() + compPanel();
    case 'diary': return `<section class="panel weekp"><h3>Your week</h3>${M.burnout ? '<p class="bad">Burnt out: this week is rest, whatever you plan.</p>' : ''}
     ${focusPanel()}
     <details class="finetune"${UI.fineOpen ? ' open' : ''}><summary>Fine-tune the diary, block by block${Object.keys(M.calPins || {}).length ? ` <span class="chip">📌 ${Object.keys(M.calPins).length} pinned</span>` : ''}</summary>${typeof diaryKeepHTML === 'function' ? diaryKeepHTML() : ''}${weekGrid()}</details>
     ${plan.includes('train') ? `<div class="ccrow"><label>Class in ${sel('pl-train', Object.keys(CRAFTS).map(c => [c, CRAFTS[c].label]), M.train)}</label></div>` : ''}
     ${plan.includes('catchup') ? `<div class="ccrow"><label>Catch up with ${sel('pl-catch', [['', 'Choose someone…']].concat(known.filter(id => !P(id).dead).map(id => [id, P(id).name])), M.catchWith ?? '')}</label></div>` : ''}
     <details class="howit"><summary class="small">How the blocks work</summary><p class="note">${Object.entries(BLOCK_ACTS).filter(([k, a]) => plan.includes(k) && a.d).map(([, a]) => `<b>${a.label}:</b> ${a.d}${a.cost ? ` (${fmtCash(usd(a.cost))} a block)` : ''}`).join(' ')}</p>
     <p class="note">A block of work costs about 14 energy; a night's sleep gives back 20 to 40 depending on your bed, your home, your neighbourhood and your stress. Nights out cost energy but melt stress. Appointments you make on your phone take over the block they're in.</p></details>
     <p class="note">${esc(livingPhrase())}${M.hoodWhere ? ' in ' + esc(M.hoodWhere) : ''} and get around by ${esc(VEHICLES[M.vehicle || 'transit'].label.toLowerCase())}. <button class="linkish" data-dtab="life">Move or change how you travel</button></p></section>
     ${cityPanel()}`;
    case 'phone': return phonePanel();
    case 'computer': return computerPanel();
    case 'work': return (typeof huntSwitchHTML === 'function' ? huntSwitchHTML() : '') + (typeof workWeekHTML === 'function' ? workWeekHTML() : '') + jobWorkHTML() + (typeof gigsHTML === 'function' ? gigsHTML() : '') + (typeof slateHTML === 'function' ? slateHTML() : '') + (M.spec.pages || M.spec.drafts ? `<p class="muted">Spec script: ${M.spec.drafts ? M.spec.drafts + ' finished draft' + (M.spec.drafts > 1 ? 's' : '') + ', ' : ''}${M.spec.pages} pages into the next.</p>` : '') + `
  <h3>The board <span class="count">${picked.length} of ${slots} applications planned</span></h3>
  <p class="muted">What you've heard about this week in ${esc(hubName(M.hub))}. ${slots ? `Your ${countBlocks('hunt')} job-hunting block${countBlocks('hunt') > 1 ? 's' : ''} this week let you send ${slots} application${slots > 1 ? 's' : ''}.` : 'Plan at least two blocks of looking for work to apply.'} Hover the odds to see why.</p>
  ${typeof boardFilterHTML === 'function' ? boardFilterHTML() : ''}<div class="tw"><table class="grid"><thead><tr><th>Job</th><th>Production</th><th>Reports to</th><th class="n">Time</th><th class="n">Pay / day (range)</th><th>Odds</th><th></th></tr></thead><tbody>${(typeof boardView === 'function' ? boardView() : M.board).map(boardRow).join('') || '<tr><td colspan="7" class="empty">Nothing matches. Try another industry or level.</td></tr>'}</tbody></table></div>
  ${UI.jobinfo ? jobInfoPanel(UI.jobinfo) : ''}`;
    case 'create': return (typeof makeHubHTML === 'function' ? makeHubHTML() : '') + portfolioHTML() + writingDesk() + producingPanel() + companyPanel();
    case 'standing': return standingHTML();
    case 'life': return pathsPanel() + (typeof legacyPanel === 'function' && !M.over ? legacyPanel() : '') + (typeof arcLogHTML === 'function' ? arcLogHTML() : '') + yearsHTML() + clippingsHTML() + homePanel() + storyHTML();
    case 'people': return mentorHTML() + cohortHTML() + circleHTML() + troupePanel() + `<h3>Contacts <span class="count">${known.length}</span></h3>
  <div class="tw"><table class="grid"><thead><tr><th>Name</th><th>Job</th><th class="n">Opinion</th><th class="n">Trust</th><th class="n">Favours</th><th>Taste</th><th>History</th><th>Now</th><th></th></tr></thead><tbody>${conRows_() || '<tr><td colspan="9" class="empty">You don’t know anyone yet.</td></tr>'}</tbody></table></div>
  <p class="note">Opinion is how much they like you; trust is whether they believe you. A favour they owe makes them put in a word: your next application to them gets a referral.</p>`;
    default: return `${typeof todayHub === 'function' ? todayHub() : ''}<div class="cols two desk">
   <section class="panel"><h3>Inbox ${pend.length ? `<span class="chip bad">${pend.length} to decide</span>` : ''}</h3>
    <ul class="inbox">${recent.map(card).join('') || (pend.length ? '' : '<li class="empty">Nothing yet.</li>')}</ul></section>
   <div>${todayPanel()}
    ${lastDiary.length ? `<section class="panel"><h3>Last week</h3><ul class="plain">${lastDiary.map(d => `<li>${esc(d.t)}</li>`).join('')}</ul></section>` : ''}
   </div></div>`;
  } })()}</div>
  <p class="note"><button class="linkish" data-abandon="1">${UI.abandon ? 'Click again to delete this career for good' : 'Abandon this career'}</button></p>`;
}
function jobInfoPanel(jid) {
  const j = JOBS.jobs.find(x => x.id === jid);
  if (!j) return '';
  return `<section class="panel jobd"><h3>${esc(j.t)} <button class="linkish" data-jobinfo="">Close</button></h3>${j.resp ? `<ul class="plain">${j.resp.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${j.sk ? `<p class="muted">What it takes: ${j.sk.map(esc).join(' · ')}</p>` : ''}${j.after ? `<p class="muted">Leads to: ${esc(j.after)}</p>` : ''}${typeof jobCrossHTML === 'function' ? jobCrossHTML(j) : ''}</section>`;
}
function viewYou() {
  if (UI.replaying) return `<div class="loading"><p class="eyebrow">Loading your career</p><h2>Replaying your life so far</h2><p class="lede">${esc(UI.replaying)}</p></div>`;
  if (!S.me) return viewCreator();
  if (!S.me.party.done) return viewParty();
  return viewDesk();
}

// ---------- Career: controls ----------
function careerActive() { return S && S.me && S.me.party && S.me.party.done && !S.me.over; }
function endWeekAct(t = 'end') { return { t, cal: calOf().map(r => r.slice()), apps: [...UI.apps], train: S.me.train, catchWith: S.me.catchWith }; }
function playStep(t) {
  if (UI.busy || !careerActive()) return;
  if (typeof autoBeforeStep === 'function') autoBeforeStep();
  // wherever you were, time moves on from the main screen: the computer, on Home (or Today, with a decision waiting)
  const home = () => { UI.tab = 'you'; UI.stack = []; UI.dtab = 'computer'; UI.app = pending().length ? 'today' : 'home'; UI.osStack = []; UI.mailo = null; };
  if (pending().length) { home(); render(); return; }
  const w0 = S.week;
  doAct(endWeekAct(t));
  if (S.week !== w0) UI.apps = new Set();
  home(); render(true); if (typeof window !== 'undefined' && window.scrollY > 400) { const c = document.querySelector('.os'); if (c) c.scrollIntoView({ block: 'start' }); }
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
  if (typeof computerClick === 'function' && computerClick(t)) return true;
  if (typeof boardClick === 'function' && boardClick(t)) return true;
  if (typeof schoolClick === 'function' && schoolClick(t)) return true;
  if (typeof standingClick === 'function' && standingClick(t)) return true;
  if (typeof awardsClick === 'function' && awardsClick(t)) return true;
  if (typeof staffClick === 'function' && staffClick(t)) return true;
  if (typeof hubClick === 'function' && hubClick(t)) return true;
  if (typeof autoClick === 'function' && autoClick(t)) return true;
  if (t.dataset.trophy) { const [k, id] = t.dataset.trophy.split(':'); doAct({ t: 'trophy', k, id: +id }); render(true); return true; }
  if (t.dataset.abf) { UI.abf = t.dataset.abf; render(true); return true; }
  if (t.dataset.schools !== undefined) { UI.schools = !!t.dataset.schools; render(true); return true; }
  if (t.dataset.cc) {
    const g = t.dataset.cc, v = t.dataset.v;
    if (g === 'rename') c.name = suggestName(c.hub, c.g);
    else if (g === 'pt') { const [cr, d] = v.split(':'); const nv = clamp((c.points[cr] || 0) + +d, 0, SKILL_MAX); if (+d < 0 || ccSpent(c) < SKILL_POINTS) c.points[cr] = nv; }
    else if (g === 'trait') { if (c.traits.includes(v)) c.traits = c.traits.filter(x => x !== v); else if (c.traits.length < 3 && !traitClash(c.traits, v)) c.traits.push(v); }
    else if (g === 'love' || g === 'hate') { const L = c[g]; if (L.includes(v)) c[g] = L.filter(x => x !== v); else if (L.length < (g === 'love' ? 3 : 2)) L.push(v); }
    else if (g === 'unfav') c.favs.splice(+v, 1);
    else if (g === 'addfav') { if (S.cat.allFilms[v] && !c.favs.includes(v) && c.favs.length < 5) c.favs.push(v); UI.favq = ''; }
    else if (g === 'randfav') { if (c.favs.length >= 5) c.favs = []; while (c.favs.length < 5) { const id = randomFav(c); if (!id) break; c.favs.push(id); } }
    else if (g === 'go') {
      c.name = ($('#cc-name').value || '').trim() || suggestName(c.hub, c.g);
      if (UI.building) { UI.ccQueued = JSON.parse(JSON.stringify(c)); render(true); return true; }
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
  if (typeof dealClick === 'function' && dealClick(t)) return true;
  if (typeof weatherClick === 'function' && weatherClick(t)) return true;
  if (typeof bank2Click === 'function' && bank2Click(t)) return true;
  if (typeof shortsClick2 === 'function' && shortsClick2(t)) return true;
  if (typeof seasonClick === 'function' && seasonClick(t)) return true;
  if (t.dataset.looking) { doAct({ t: 'auto', k: 'looking', v: t.dataset.looking }); toast(t.dataset.looking === 'no' ? 'No more applications will go out.' : t.dataset.looking === 'craft' ? 'Only your own line of work from now on.' : 'Anything that pays.'); render(true); return true; }
  if (t.dataset.labapply) { doAct({ t: 'labapply', k: t.dataset.labapply }); render(true); return true; }
  if (t.dataset.gigpitch) { doAct({ t: 'gigpitch', id: +t.dataset.gigpitch }); render(true); return true; }
  if (t.dataset.gigv !== undefined) { UI.gigView = t.dataset.gigv || null; render(true); return true; }
  if (t.dataset.gigall) { UI.gigAll = !UI.gigAll; render(true); return true; }
  if (t.dataset.randcc) { randomCC(t.dataset.randcc === 'all'); render(true); return true; }
  if (t.dataset.story !== undefined) { UI.story = !!t.dataset.story && !UI.story; render(true); return true; }
  if (t.dataset.move) { doAct({ t: 'move', i: +t.dataset.move }); render(true); return true; }
  if (t.dataset.vehicle) { doAct({ t: 'vehicle', v: t.dataset.vehicle }); render(true); return true; }
  if (t.dataset.tonight) { const W = S.me.wk, d = W ? W.day : 0; calOf()[d][2] = t.dataset.tonight; render(true); return true; }
  if (t.dataset.calfill) { const P0 = CAL_PRESETS[t.dataset.calfill], W = S.me.wk, now = W ? W.day * 3 + W.block : 0, cal = calOf(); if (P0) for (let d = 0; d < 7; d++) for (let b = 0; b < 3; b++) if (d * 3 + b >= now) cal[d][b] = P0[d][b] === 'study' && !S.me.school ? 'hunt' : P0[d][b]; render(true); return true; }
  if (t.dataset.app !== undefined) { UI.app = t.dataset.app === 'jobs' ? 'work' : (t.dataset.app || null); render(true); return true; }   // CrewList lives inside Work now
  if (t.dataset.like) { const [post, who] = t.dataset.like.split('|'); doAct({ t: 'like', post, who: +who }); render(true); return true; }
  if (t.dataset.sweep) { if (t.dataset.sweep === 'new') sweepNew(); else sweepOpen(+t.dataset.sweep); render(true); return true; }
  if (t.dataset.dept) { doAct({ t: 'dept', k: t.dataset.dept }); render(true); return true; }
  if (t.dataset.release) { doAct({ t: 'release', k: t.dataset.release }); render(true); return true; }
  if (t.dataset.vcat) { UI.vcat = t.dataset.vcat; render(true); return true; }
  if (t.dataset.trip) { doAct({ t: 'trip', k: t.dataset.trip }); render(true); return true; }
  if (t.dataset.focus) { const [g, k] = t.dataset.focus.split(':'); doAct({ t: 'focus', [g]: k, auto: true }); render(true); return true; }
  if (t.dataset.reply) { const [mid, kind] = t.dataset.reply.split(':'); doAct({ t: 'reply', mid: +mid, kind, text: kind === 'own' ? ($('#rp-text-' + mid) || $('#rp-text') || {}).value || '' : undefined }); render(true); return true; }
  if (t.dataset.thread !== undefined) { UI.thread = t.dataset.thread === '' ? null : t.dataset.thread === 'home' || t.dataset.thread === 'crew' ? t.dataset.thread : +t.dataset.thread; if (UI.thread !== null && UI.thread !== 'home' && UI.thread !== 'crew') UI.txt = { id: String(UI.thread), kind: 'hi', slot: 0, msg: '' }; render(true); return true; }
  if (t.dataset.sendtext) { const T = UI.txt, s = upcomingSlots(16)[+T.slot || 0]; if (T.id === '') return true; T.msg = ($('#tx-msg') || {}).value || T.msg || ''; const a = { t: 'text', id: +T.id, kind: T.kind, msg: T.kind === 'hi' || (typeof TOPICS !== 'undefined' && TOPICS[T.kind]) ? T.msg : undefined }; if (T.kind !== 'hi' && !(typeof TOPICS !== 'undefined' && TOPICS[T.kind])) { if (!s) return true; Object.assign(a, s); } doAct(a); UI.txt = { id: T.id, kind: T.kind, slot: 0, msg: '' }; if (UI.thread === undefined || UI.thread === null) UI.thread = +T.id; render(true); return true; }
  if (t.dataset.newscript) { const f = UI.newScript, v = id => ($('#' + id) || {}).value || ''; f.title = v('ns-title'); doAct({ t: 'newscript', title: f.title, genre: f.genre, theme: f.theme, tone: f.tone, premise: v('ns-premise'), hero: v('ns-hero'), setting: v('ns-setting'), notes: v('ns-notes') }); UI.newScript = null; render(true); return true; }
  if (t.dataset.readpages) { readPages(+t.dataset.readpages); return true; }
  if (t.dataset.startWork) { doAct({ t: 'startwork', type: UI.newWork || Object.keys(WORK_TYPES).find(workTypeOpen), title: ($('#new-work-title') || {}).value || '' }); render(true); return true; }
  if (t.dataset.releaseWork) { doAct({ t: 'releasework', promo: +(UI.relPromo || 0) }); render(true); return true; }
  if (t.dataset.mentor !== undefined) { const n0 = S.me.rollN || 0; doAct({ t: 'mentor', id: +t.dataset.mentor }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.campaign) { const [film, k] = t.dataset.campaign.split(':'), n0 = S.me.rollN || 0; doAct({ t: 'campaign', film: +film, k }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.compf) { UI.compf = t.dataset.compf; render(true); return true; }
  if (t.dataset.comp) { const k = t.dataset.comp, el = document.getElementById('comp-sc-' + k), n0 = S.me.rollN || 0; const ok = doAct({ t: 'compete', k, script: el ? +el.value : (UI['comp-sc-' + k] !== undefined ? +UI['comp-sc-' + k] : ((S.me.scripts || []).filter(x => x.grade).slice(-1)[0] || {}).id) }); if (!ok && typeof toast === 'function') { const c = COMPS.find(x => x.k === k); toast((c && typeof compBlock === 'function' && compBlock(c)) || 'You can\'t enter that right now.'); } render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.feedf) { UI.feedf = t.dataset.feedf; UI.feedN = 30; UI.dtab = 'feed'; render(true); return true; }
  if (t.dataset.feedmore) { UI.feedN = (UI.feedN || 30) + 30; render(true); return true; }
  if (t.dataset.fthread !== undefined) { UI.tab = 'you'; UI.dtab = 'phone'; UI.thread = +t.dataset.fthread; UI.txt = { id: String(UI.thread), kind: 'hi', slot: 0, msg: '' }; render(); const n = document.querySelector('.desknav'); if (n) n.scrollIntoView({ block: 'start' }); return true; }
  if (t.dataset.dtab) { UI.dtab = t.dataset.dtab; UI.tab = 'you'; UI.stack = []; render(); const n = document.querySelector('.desknav'); if (n) n.scrollIntoView({ block: 'start' }); return true; }
  if (t.dataset.found) { doAct({ t: 'found', name: ($('#co-name') || {}).value || '' }); render(true); return true; }
  if (t.dataset.comoney) { const amt = +(($('#co-amt') || {}).value || 0); UI.co.amt = amt; doAct({ t: t.dataset.comoney, amount: amt }); render(true); return true; }
  if (t.dataset.greenlight) { const key = t.dataset.greenlight, [src, id] = key.split(':'), F = UI.mk[key], n0 = S.me.rollN || 0; const done = doAct({ t: 'selffund', src, id: +id, direct: F.dir === 'me', dir: F.dir && F.dir !== 'me' ? +F.dir : undefined, lead: F.lead !== '' ? +F.lead : undefined, dp: F.dp ? +F.dp : undefined, ed: F.ed ? +F.ed : undefined, mus: F.mus ? +F.mus : undefined, pd: F.pd ? +F.pd : undefined, micro: !!+F.micro, inv: !!+F.inv, rb: !!+F.rb, ps: !!+F.ps, gap: !!+F.gap && !!+F.ps }); if (!done) { UI.mkErr = UI.mkErr || {}; UI.mkErr[key] = 'Not yet: the company needs at least a quarter of its share in the bank, and investors and sales agents won\'t take the same project twice in four weeks. Put more money in, go smaller, or wait.'; } else if (UI.mkErr) delete UI.mkErr[key]; render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.coinv && finClick(t)) return true;
  if (typeof cgClick === 'function' && cgClick(t)) return true;
  if (typeof fin2Click === 'function' && fin2Click(t)) return true;
  if (typeof ventClick === 'function' && ventClick(t)) return true;
  if (typeof luckClick === 'function' && luckClick(t)) return true;
  if (typeof sportsClick === 'function' && sportsClick(t)) return true;
  if (typeof crewClick === 'function' && crewClick(t)) return true;
  if (typeof co2Click === 'function' && co2Click(t)) return true;
  if (t.dataset.cityall) { UI.cityAll = 1; render(true); return true; }
  if (typeof bkTabClick === 'function' && bkTabClick(t)) return true;
  if (t.dataset.osg) { const c = UI.osc = UI.osc || { Play: 1 }; c[t.dataset.osg] = c[t.dataset.osg] ? 0 : 1; render(true); return true; }
  if (t.dataset.selffund) { const [src, id, d, m] = t.dataset.selffund.split(':'); doAct({ t: 'selffund', src, id: +id, direct: d === '1', micro: m === '1' }); render(true); return true; }
  if (t.dataset.fest) { const [film, k] = t.dataset.fest.split(':'); doAct({ t: 'festival', film: +film, k }); render(true); return true; }
  if (t.dataset.optionspec) { doAct({ t: 'optionspec', id: +t.dataset.optionspec }); render(true); return true; }
  if (t.dataset.pitch) { const [id, co] = t.dataset.pitch.split(':').map(Number), n0 = S.me.rollN || 0; doAct({ t: 'pitch', id, co }); render(true); if ((S.me.rollN || 0) > n0) showRollOverlay(S.me.lastRoll); return true; }
  if (t.dataset.phonejump !== undefined) { UI.tab = 'you'; UI.dtab = 'phone'; UI.stack = []; if (typeof phoneFocus === 'function') phoneFocus(); render(); const el = document.querySelector('.desknav'); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); return true; }
  if (t.dataset.rewrite) { doAct({ t: 'rewrite', id: +t.dataset.rewrite }); render(true); return true; }
  if (t.dataset.contest) { const [id, c] = t.dataset.contest.split(':'); doAct({ t: 'contest', id: +id, c }); render(true); return true; }
  if (t.dataset.activescript) { doAct({ t: 'activescript', id: +t.dataset.activescript }); render(true); return true; }
  if (t.dataset.courses !== undefined) { UI.courses = !!t.dataset.courses; render(true); return true; }
  if (t.dataset.jobinfo !== undefined) { UI.jobinfo = t.dataset.jobinfo || null; render(true); return true; }
  if (t.dataset.abandon) { if (!UI.abandon) { UI.abandon = true; render(true); return true; } UI.abandon = false; clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  if (t.dataset.rstyle) { const [k, v] = t.dataset.rstyle.split(':'); doAct({ t: 'roomstyle', k, v: +v }); render(true); return true; }
  if (t.dataset.retire !== undefined) { if (t.dataset.retire === '2') { UI.retireAsk = false; doAct({ t: 'retire' }); } else UI.retireAsk = t.dataset.retire === '1'; render(true); return true; }
  if (t.dataset.nextgen) { doAct({ t: 'nextgen' }); UI.dtab = 'today'; UI.tab = 'you'; UI.stack = []; render(); return true; }
  if (t.dataset.startover) { clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  return false;
}
// what you are, as the business would put it: a hopeful at first, then simply the job, then a name
function roleTitle(role) { const L = careerLevel(), R = (role === ME().role && typeof dreamLabel === 'function' ? dreamLabel() : ROLE_LABEL[role]) || 'Filmmaker'; return L <= 1 ? `${R} hopeful` : L <= 3 ? `Working ${R.toLowerCase()}` : L <= 5 ? R : `Celebrated ${R.toLowerCase()}`; }
// Every clickable the career screens use; the page's click handler listens for these.
const CAREER_CLICKS = COMPUTER_CLICKS + ',[data-co2],[data-cityall],[data-crewsay],[data-spl],[data-spfan],[data-spbet],[data-luck],[data-luckt],[data-luckamt],[data-vent],[data-bktab],[data-looking],[data-seasonf],[data-shsub],[data-ledspan],[data-autosave],[data-wxhub],[data-labapply],[data-dealopen],[data-dealv],[data-dealsend],[data-dealtake],[data-dealwalk],[data-stakev],[data-gigpitch],[data-gigv],[data-gigall],[data-tr],[data-tspan],[data-markread],[data-swt],[data-swsave],[data-swchopen],[data-swchar],[data-swscene],[data-swpunch],[data-np2],[data-np2go],[data-stt],[data-crt],[data-st2d],[data-st2m],[data-st2b],[data-st2arr],[data-st2play],[data-st2save],[data-st2bounce],[data-pdq],[data-pd2ord],[data-tbbg],[data-tbsubj],[data-crplay],[data-cr2save],[data-cr2render],[data-nbadd],[data-nbspark],[data-nbkeep],[data-nbfrom],[data-nbk],[data-nbstar],[data-nbdel],[data-nbdev],[data-calpin],[data-calpinall],[data-calpinsnap],[data-calpinclear],[data-calsave],[data-caluse],[data-caldel],[data-caluse2],[data-calname],[data-caldel2],[data-decmin],[data-decnav],[data-quitc],[data-jobpage],[data-schoolpage],[data-rtsort],[data-rtmore],[data-rtclear],[data-coinv],[data-osg],[data-swsess],[data-swoutline],[data-arr],[data-podord],[data-clip2],[data-thumb2],[data-session],[data-angel],[data-cgtab],[data-cgk],[data-cgpost],[data-cgfollow],[data-snew],[data-sexp],[data-sload],[data-sover],[data-sdel],[data-rstyle],[data-retire],[data-nextgen],[data-stdept],[data-stpage],[data-abcat],[data-trophy],[data-auto],[data-autoplan],[data-partyauto],[data-jump],[data-applybest],[data-ambclaim],[data-ambpin],[data-abf],[data-schk],[data-schopen],[data-schapply],[data-schools],[data-bfind],[data-bftier],[data-bffit],[data-mentor],[data-start-work],[data-release-work],[data-campaign],[data-compf],[data-comp],[data-feedf],[data-feedmore],[data-fthread],[data-dept],[data-release],[data-vcat],[data-trip],[data-focus],[data-app],[data-like],[data-sweep],[data-reply],[data-greenlight],[data-dtab],[data-found],[data-comoney],[data-selffund],[data-fest],[data-optionspec],[data-pitch],[data-phonejump],[data-thread],[data-readpages],[data-calfill],[data-sendtext],[data-randcc],[data-story],[data-move],[data-vehicle],[data-tonight],[data-newscript],[data-rewrite],[data-contest],[data-activescript],[data-courses],[data-next],[data-enrol],[data-dropout],[data-query],[data-fireagent],[data-homep],[data-furnish],[data-arrange],[data-guide],[data-day],[data-buy],[data-cc],[data-party],[data-pick],[data-quit],[data-favour],[data-endweek],[data-jobinfo],[data-abandon],[data-startover],[data-look],[data-restyle]';
function setLook(k, v) {
  if (!LOOK[k] || !(v >= 0 && v < LOOK[k].opts.length)) return;
  if (S.me) { doAct({ t: 'look', k, v }); render(true); return; }
  UI.cc.look[k] = v; render(true);
}
function careerChange(e) {
  const id = e.target.id, v = e.target.value, c = UI.cc;
  if (e.target.dataset.share && v) { doAct({ t: 'share', id: +e.target.dataset.share, to: +v }); render(true); return true; }
  if (typeof schoolChange === 'function' && schoolChange(id, v)) { render(true); return true; }
  if (typeof dealChange === 'function' && dealChange(e)) { render(true); return true; }
  if (typeof bank2Change === 'function' && bank2Change(e)) { render(true); return true; }
  if (typeof shortsChange2 === 'function' && shortsChange2(e)) return true;
  if (id === 'mc-kind' || id === 'mc-to') { UI.mc = UI.mc || {}; UI.mc.text = ($('#mc-text') || {}).value || UI.mc.text || ''; UI.mc[id.slice(3)] = v; render(true); return true; }
  if (typeof awardsChange === 'function' && awardsChange(id, v)) { render(true); return true; }
  if (id === 'fest-y') { UI.festY = +v; render(true); return true; }
  if (id === 'bf-sort') { (UI.bf = UI.bf || { ind: 'all', tier: 'all', fit: false }).sort = v; render(true); return true; }
  if (/^ns-(genre|theme|tone)$/.test(id)) { UI.newScript[id.slice(3)] = v; return true; }
  if (/^ns-(premise|hero|setting|notes)$/.test(id)) { UI.newScript[id.slice(3)] = v; return true; }
  if (id === 'ns-title') { UI.newScript.title = v; return true; }
  if (e.target.dataset.place) { doAct({ t: 'place', id: e.target.dataset.place, sp: v || null }); render(true); return true; }
  if (e.target.dataset.lookk) { setLook(e.target.dataset.lookk, +v); return true; }
  if (e.target.dataset.fav !== undefined) { const fid = filmChoices().byLabel[v]; if (fid && !c.favs.includes(fid)) c.favs.push(fid); render(true); return true; }
  if (id.startsWith('cc-')) {
    const k = id.slice(3);
    if (k === 'age') c.age = clamp(+v || 23, 18, 45);
    else if (k === 'name') c.name = v;
    else if (k === 'dream') { const d = DREAM_BY[v]; if (d) { c.dream = d.k; c.role = d.role; c.field = d.field; } }
    else c[k] = v;
    if (k === 'hub' || k === 'g') c.name = $('#cc-name') && $('#cc-name').value.trim() ? $('#cc-name').value : suggestName(c.hub, c.g);
    if (k === 'age' && c.age < 26) c.traits = c.traits.filter(t => t !== 'Late bloomer');
    render(true); return true;
  }
  if (/^cal-\d-\d$/.test(id)) { UI.fineOpen = true; doAct({ t: 'calset', d: +id[4], b: +id[6], k: v }); render(true); return true; }
  if (e.target.dataset.huntpause) { doAct({ t: 'focus', noHunt: e.target.checked }); render(true); return true; }
  if (e.target.dataset.autopilot) { doAct({ t: 'focus', auto: e.target.checked }); render(true); return true; }
  if (id === 'tx-msg') { UI.txt.msg = v; return true; }
  if (/^comp-sc-/.test(id)) { UI[id] = v; return true; }
  if (id === 'new-work') { UI.newWork = v; render(true); return true; }
  if (id === 'rel-promo') { UI.relPromo = v; return true; }
  if (/^mk-(micro|dir|lead|dp|ed|mus|pd)-/.test(id)) { const [, f, ...rest] = id.split('-'); UI.mk[rest.join('-')][f] = v; render(true); return true; }
  if (e.target.dataset.mkfin) { const [a, b, f] = e.target.dataset.mkfin.split(':'); UI.mk[a + ':' + b][f] = e.target.checked ? 1 : 0; render(true); return true; }
  if (e.target.dataset.mkinv) { UI.mk[e.target.dataset.mkinv].inv = e.target.checked ? 1 : 0; render(true); return true; }
  if (id === 'co-name') { (UI.co = UI.co || {}).name = v; return true; }
  if (/^pitch-\d+$/.test(id)) { (UI.pitch = UI.pitch || {})[+id.slice(6)] = v; render(true); return true; }
  if (/^tx-(id|kind|slot)$/.test(id)) { UI.txt[id.slice(3)] = v; if (id === 'tx-id') UI.txt.slot = 0; render(true); return true; }
  if (id === 'pl-train') { S.me.train = v; return true; }
  if (id === 'dr-dream' && careerActive()) { if (DREAM_BY[v]) doAct({ t: 'dream', k: v }); render(true); return true; }
  if (id === 'pl-catch') { S.me.catchWith = v === '' ? null : +v; return true; }
  if (id === 'pl-life') { doAct({ t: 'life', v }); render(true); return true; }
  if (e.target.dataset.apply) { const pid = +e.target.dataset.apply; if (e.target.checked) UI.apps.add(pid); else UI.apps.delete(pid); render(true); return true; }
  return false;
}
// Where you live, said the way people say it.
function livingPhrase() { const M = S.me; return ({ couch: 'You\'re couch-surfing', shared: 'You live in a shared flat', studio: 'You live in a studio flat', own: 'You have your own place', loft: 'You live in a converted warehouse loft', house: 'You live in a house with a garden' })[M.life] || 'You live in ' + ORIGIN.life[M.life].label.toLowerCase(); }
// One form per script: size, who directs, who leads, investors, and what it all costs.
function makeFilmForm(c, k, x) {
  const key = k + ':' + x.id, F = (UI.mk = UI.mk || {})[key] = UI.mk[key] || { micro: 1, dir: '', lead: '', inv: 0, rb: 1, ps: 0, gap: 0 };
  const micro = !!+F.micro, est = estBudget(x.genre) * (micro ? .25 : 1), leadId = F.lead === '' ? undefined : +F.lead;
  const total = est + (leadId !== undefined ? leadFee(leadId, x.genre, micro) : 0), cash = c.cash;
  const dirId = F.dir === 'me' ? ME().id : F.dir !== '' && F.dir !== undefined ? +F.dir : undefined;
  const plan = finPlan(total, { rb: +F.rb, ps: +F.ps, gap: +F.gap, genre: x.genre, lead: leadId, dir: dirId }), need = plan.equity * .9;
  const short = cash < need, wait = x.invTry !== undefined && S.week - x.invTry < 4, canInv = cash >= plan.equity * .25 && !wait;
  const inc = incentiveOf(S.me.hub), psOK = presaleShare(x.genre, leadId, dirId) > 0;
  const fin = `<div class="finplan small"><b>The money</b>
    <label><input type="checkbox" data-mkfin="${key}:rb" ${+F.rb ? 'checked' : ''} ${inc ? '' : 'disabled'}> ${inc ? `Cash-flow the ${esc(hubName(S.me.hub))} incentive (${Math.round(inc * 100)}%)` : `No production incentive in ${esc(hubName(S.me.hub))} ${S.year < 2000 ? 'yet' : ''}`}</label>
    <label><input type="checkbox" data-mkfin="${key}:ps" ${+F.ps ? 'checked' : ''} ${psOK ? '' : 'disabled'}> ${psOK ? `Pre-sell the foreign rights (${Math.round(presaleShare(x.genre, leadId, dirId) * 100)}% of the budget) ${+F.ps ? oddsBar('pack', presaleDC(x.genre, leadId)) : ''}` : 'Pre-sales need a name: a lead with some fame, or a director people know'}</label>
    ${+F.ps && psOK ? `<label><input type="checkbox" data-mkfin="${key}:gap" ${+F.gap ? 'checked' : ''}> Gap loan against the home rights (15%)</label>` : ''}
    ${stackBar(plan.parts.map(p => [p.k === 'rebate' ? 'Incentive' : p.k === 'presale' ? 'Pre-sales' : 'Gap loan', p.amt, p.k]).concat([['Company and investors', plan.equity, 'equity']]))}
    <span class="muted">Fees, bond and insurance: ${fmtCash(Math.round(plan.feeT * 1e6))}.${plan.bonded ? ' Bank money means a completion bond: run far over budget and the guarantor takes the film.' : ''}</span></div>`;
  const dirs = dirOptions(x.genre), leads = castOptions(x.genre), M = S.me;
  const tag = p => M.known[p.id] ? (M.known[p.id].tags.includes('Your regular') ? ' ♥' : ' ★') : '';
  const crewSel = (f, role, craft, lab) => `<label>${lab} ${sel('mk-' + f + '-' + key, [['', 'Their choice']].concat(crewOptions(role, craft, x.genre).map(p => [String(p.id), `${p.name}${tag(p)} · ${Math.round(gcraft(p, craft, x.genre))}`])), F[f] || '')}</label>`;
  return `<div class="mkfilm"><b>${esc(x.title)}</b> <span class="chip" title="How audiences in your market feel about ${esc(x.genre.toLowerCase())} right now">${HEAT_LABEL[heatOf(HUBS[S.me.hub].m, x.genre)]}</span> <span class="muted">${esc(x.genre)} · ${k === 'script' ? 'your script' : 'by ' + esc(P(x.writer).name)}</span>
   <div class="mkrow"><label>Size ${sel('mk-micro-' + key, [['1', 'Micro-budget'], ['0', 'Full budget']], String(F.micro))}</label>
    <label>Director ${sel('mk-dir-' + key, [['', 'Let the producer choose'], ['me', 'You direct']].concat(dirs.map(p => [String(p.id), `${p.name}${tag(p)} · ${Math.round(gcraft(p, 'dir', x.genre))}`])), F.dir)}</label>
    <label>Lead ${sel('mk-lead-' + key, [['', 'Let the director cast']].concat(leads.map(p => [String(p.id), `${p.name}${tag(p)} · fame ${Math.round(p.fame || 0)} · +${fmtCash(Math.round(leadFee(p.id, x.genre, micro) * 1e6))}`])), F.lead)}</label>${crewSel('dp', 'dp', 'cam', 'Cinematographer')}${crewSel('ed', 'editor', 'edt', 'Editor')}${crewSel('mus', 'composer', 'mus', 'Composer')}${crewSel('pd', 'designer', 'des', 'Production designer')}</div><p class="muted small">★ someone you know · ♥ one of your regulars · the number is their craft for this genre.</p>
   ${fin}<p class="small">Budget about <b>${fmtCash(Math.round(total * 1e6))}</b> · the company's part <b>${fmtCash(Math.round(plan.equity * 1e6))}</b> · it has ${fmtCash(Math.round(cash * 1e6))}${short ? (canInv ? ` · <label><input type="checkbox" data-mkinv="${key}" ${+F.inv ? 'checked' : ''}> Bring in investors for the rest</label> ${+F.inv ? oddsBar('fin', investDC(x)) : ''}` : (wait ? ' · <span class="muted">the investors want a few weeks before you ask again</span>' : ' · <span class="bad">put in at least a quarter of the cost first</span>')) : ''}</p>
   <button class="btn-s" data-greenlight="${key}" ${short && !(canInv && +F.inv) ? 'disabled' : ''}>Greenlight it</button>${(UI.mkErr || {})[key] ? `<p class="small muted">${esc(UI.mkErr[key])}</p>` : ''}</div>`;
}
// Your regulars: the people who'd work with you again, first in line when you hire.
function troupePanel() {
  const M = S.me, me = ME(), mine = new Set(me.credits);
  const ids = Object.keys(M.known).map(Number).filter(id => M.known[id].tags.includes('Your regular') && !P(id).dead);
  if (!ids.length) return '';
  const together = id => P(id).credits.filter(f => mine.has(f)).length;
  ids.sort((a, b) => together(b) - together(a) || opinion(b) - opinion(a));
  return `<section class="panel troupe"><h3>Your regulars <span class="count">${ids.length}</span></h3><div class="tcards">${ids.map(id => { const p = P(id), free = available(id), n = together(id); return `<div class="tcard">${portraitOf(p, 56)}<div><b>${pl(id)}</b><span class="muted small">${esc(ROLE_LABEL[p.role])} · ${n} film${n === 1 ? '' : 's'} with you</span><span class="small">${free ? '<span class="good">Free now</span>' : p.retired ? 'Retired' : `Busy until ${fmtDate(p.busy, true)}`} · opinion ${Math.round(opinion(id))}</span></div></div>`; }).join('')}</div><p class="note">Crew and cast who liked working with you. They show up first (♥) when you pick a director, lead, cinematographer, editor, composer or designer.</p></section>`;
}
// Week focus: what your days are for, how your evenings go, and what that will probably do to you.
function focusPanel() {
  const M = S.me, F = M.focus || { day: 'balanced', eve: 'quiet', auto: false }, fc = forecastWeek();
  const card = (k, D, on, g) => `<button class="fcard${on ? ' on' : ''}" data-focus="${g}:${k}" title="${esc(D.d || '')}"><span>${D.icon}</span><b>${esc(D.label)}</b></button>`;
  const dd = DAY_FOCUS[F.day] || {}, ee = EVE_STYLE[F.eve] || {};
  return `<div class="focus"><h4>Your days</h4><div class="fcards">${Object.entries(DAY_FOCUS).filter(([k]) => !(F.noHunt && k === 'hunt')).map(([k, D]) => card(k, D, F.day === k, 'day')).join('')}</div>${dd.d ? `<p class="small muted fdesc">${esc(dd.d)}</p>` : ''}
   <h4>Your evenings</h4><div class="fcards eve">${Object.entries(EVE_STYLE).map(([k, D]) => card(k, D, F.eve === k, 'eve')).join('')}</div>${ee.d ? `<p class="small muted fdesc">${esc(ee.d)}</p>` : ''}
   <p><label><input type="checkbox" data-autopilot="1" ${F.auto ? 'checked' : ''}> Autopilot: write next week's diary from these, adjusting when I'm tired, stressed, broke or in school</label></p>
   <p><label><input type="checkbox" data-huntpause="1" ${F.noHunt ? 'checked' : ''}> Pause the job hunt: autopilot stops booking "Look for work" and uses those blocks ${S.me.school ? 'for study and reading' : 'for your focus (writing, classes, making things)'}. Offers and headhunters can still find you.</label></p>
   <div class="forecast"><div class="fdays">${fc.days.map(x => `<div class="fd"><span class="fbar"><i style="height:${x.low}%" class="${x.low < 20 ? 'lo' : x.low < 40 ? 'mid' : 'hi'}"></i></span><small>${DAYS7[x.d].slice(0, 2)}</small></div>`).join('')}</div>
    <p class="small">Forecast: energy dips as low as <b>${Math.min(...fc.days.map(x => x.low))}</b> and ends the week near <b>${fc.endE}</b> · stress ${fc.stress >= 0 ? '+' : ''}${fc.stress} · ${fmtCash(fc.spend)} out${fc.earn ? `, ${fmtCash(fc.earn)} in` : ''} · ${fc.apps} applications · ${fc.writes} writing, ${fc.classes} class and ${fc.social} social blocks.${Math.min(...fc.days.map(x => x.low)) < 20 ? ' <span class="bad">You\'ll be exhausted: rolls get harder and mistakes happen.</span>' : ''}</p></div></div>`;
}
// The desk's sections. Counts show what's waiting in each.
function deskNav() {
  const M = S.me, pend = pending().length, unread = phoneUnread(), cur = UI.dtab || 'computer';
  const tabs = [['today', 'Today', pend, 'bad'], ['feed', 'Feed', pend + unread, pend ? 'bad' : 'good'], ['diary', 'Your week'], ['phone', 'Phone', unread, 'good'], ['computer', 'Computer'], ['work', 'Work', M.board.length], ['create', 'Create', (M.market || []).length], ['compete', 'Contests', COMPS.filter(c => compOpen(c) && !compEntered(c) && compFits(c)).length, 'good'], ['standing', 'Standing', typeof ambClaimable === 'function' ? ambClaimable().length : 0, 'good'], ['life', 'Life'], ['people', 'People', Object.keys(M.known).length]];
  return `<nav class="desknav" aria-label="Your desk">${tabs.map(([k, l, n, c]) => `<button class="dt${cur === k ? ' on' : ''}" data-dtab="${k}" aria-current="${cur === k ? 'page' : 'false'}">${l}${n ? ` <span class="dn ${c || ''}">${n}</span>` : ''}</button>`).join('')}</nav>`;
}
// Rebuild a saved career: the world is already built from the same seed; feed it the log.
// Forgiving: a step that no longer fits (the game changed since it was taken) is settled and skipped, never a stall.
function replayCareer(log, done) {
  let i = 0, miss = 0;
  UI.replaying = 'Starting…'; S.log = [];
  const step = () => {
    const t0 = Date.now();
    while (i < log.length && Date.now() - t0 < 120) { if (!replayOne(log[i])) miss++; i++; }
    if (typeof JOURNAL !== 'undefined' && JOURNAL) { JOURNAL.log = S.log.slice(); journalWrite(); }
    UI.replaying = `${i} of ${log.length} steps${S.me ? ' · ' + fmtDate(S.week, true) : ''}`;
    try { $('#main').innerHTML = viewYou(); } catch (e) { /* the page catches up at the end */ }
    if (i < log.length) setTimeout(step, 0);
    else { UI.replaying = null; UI.seenRoll = UI.pendingSeen = S.me ? S.me.rollN || 0 : 0; done(miss); }
  };
  setTimeout(step, 0);
}

// The space bar lives on to the next thing worth seeing, as long as you aren't typing.
if (typeof document !== 'undefined') document.addEventListener('keydown', e => {
  if (e.key !== ' ' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const tg = e.target, tn = tg && tg.tagName, typ = tn === 'INPUT' ? (tg.type || 'text') : '';
  // only typing keeps the space bar: a focused button, checkbox or menu doesn't, so it works from any page
  if (tn === 'TEXTAREA' || (tn === 'INPUT' && !['checkbox', 'radio', 'button', 'submit', 'range'].includes(typ)) || (tg && tg.isContentEditable)) return;
  if (tg && tg.blur && (tn === 'BUTTON' || tn === 'SELECT' || tn === 'INPUT' || tn === 'A')) tg.blur();
  const ov = document.getElementById('rollov');
  if (ov) { e.preventDefault(); const b = ov.querySelector('.ro-ok'); if (b) b.click(); return; }
  if (typeof careerActive !== 'function' || !careerActive() || UI.busy) return;
  e.preventDefault();
  if (pending().length && UI.tab === 'you' && !UI.stack.length && UI.app === 'today') { const d = document.querySelector('.decbox'); if (d) window.scrollTo({ top: Math.max(0, d.getBoundingClientRect().top + window.scrollY - ((document.querySelector('header.slate') || {}).offsetHeight || 0) - 10), behavior: 'smooth' }); return; }
  playStep('next');
});

// ---- Reading your pages ----
// Claude writes the opening of your script at the quality the game says it has: an A reads like a professional
// draft, an F like the earnest mess it is. It runs on the viewer's own Claude account (the page's `sample`
// capability), is kept in this browser so a reread is free, and never touches the save or the simulation.
const GRADE_VOICE = {
  A: 'superb: precise, surprising and alive, with real subtext, specific images and dialogue nobody else would write. Professional, award-calibre work.',
  B: 'strong and assured, with a distinct voice, but a few soft spots: a line or two that explains too much, one familiar beat.',
  C: 'competent but conventional: clear and properly formatted, yet the dialogue is often on the nose and the beats are ones we have seen before.',
  D: 'weak: clunky exposition, characters announcing their feelings, stock phrases, an uneven rhythm and a scene that goes on too long. Sincere, though, with one moment that almost works.',
  F: 'bad: overwritten, melodramatic and cliché-ridden, with confused staging, wooden dialogue and formatting mistakes. The kind of amateur first draft that makes readers wince, but still recognisably trying.'
};
if (typeof window !== 'undefined' && window.claude && typeof window.claude.use === 'function') window.claude.use('sample').then(s => { UI.sample = s || null; if (s && typeof careerActive === 'function' && careerActive()) render(true); }).catch(() => { UI.sample = null; });
function pagesPrompt(sc) {
  const me = ME(), M = S.me, grade = sc.grade || (sc.pages >= 10 ? 'unfinished' : null);
  const raw = 38 + (sc.q / Math.max(1, sc.pages) - 6) * 5 + (sc.draft - 1) * 7, est = sc.grade ? sc.score : clamp(Math.round(raw > 72 ? 72 + (raw - 72) * .45 : raw), 5, 98);
  const g = sc.grade || (est >= 85 ? 'A' : est >= 70 ? 'B' : est >= 55 ? 'C' : est >= 40 ? 'D' : 'F');
  return `You are ghost-writing pages for a character in a film-industry life simulation game. Write the OPENING of their screenplay, about three pages (600 to 900 words), in standard screenplay format (scene headings, action, character cues, dialogue) as plain text.

THE QUALITY MUST HONESTLY MATCH THE GRADE. This draft is graded ${g} (${est}/100): ${GRADE_VOICE[g]} Do not write better than that grade. Do not write worse either.${grade === 'unfinished' ? ' The draft is unfinished; write only its opening.' : ''}

Title: ${sc.title}
Genre: ${sc.genre}. Tone: ${TONES[sc.tone]}. Theme: ${THEMES[sc.theme]}.
Logline: ${sc.logline}
${sc.hero ? 'Hero: ' + sc.hero + '\n' : ''}${sc.setting ? 'World: ' + sc.setting + '\n' : ''}${sc.notes ? 'The writer\'s own notes (use what helps, honour their intentions):\n' + sc.notes.slice(0, 4000) + '\n' : ''}
The writer: ${esc(me.name)}, ${ageOf(me)}, traits ${me.traits.join(', ')}; their voice keeps returning to ${topThemes(voiceOf()).map(k => THEMES[k].toLowerCase()).join(', ') || 'nothing yet'}. Draft ${sc.draft}. Let their traits show in the writing.
Rules: invent everything; do not mention or imitate any real film, real person or brand. Reply with the pages only, no preamble or commentary.`;
}
async function readPages(id) {
  const sc = (S.me.scripts || []).find(x => x.id === id);
  if (!sc || !UI.sample) return;
  const key = `applebox-pages-${S.seed}-${S.me.id}-${sc.id}-${sc.draft}-${sc.grade || sc.pages}`;
  const old = document.getElementById('pagesov'); if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'pagesov';
  el.innerHTML = `<div class="pg-box"><div class="pg-head"><b>${esc(sc.title)}</b> <span class="muted">draft ${sc.draft}${sc.grade ? ' · ' + sc.grade : ''}</span><span class="pg-btns"><button class="btn-s ghost pg-stop">Stop</button> <button class="btn-s pg-close">Close</button></span></div><pre class="pg-text">Thinking…</pre><p class="pg-note muted small"></p></div>`;
  document.body.appendChild(el);
  const out = el.querySelector('.pg-text'), note = el.querySelector('.pg-note'), ctl = new AbortController();
  el.querySelector('.pg-close').onclick = () => { ctl.abort(); el.remove(); };
  el.querySelector('.pg-stop').onclick = () => ctl.abort();
  let saved = null; try { saved = localStorage.getItem(key); } catch (e) { /* storage unavailable */ }
  if (saved) { out.textContent = saved; note.textContent = 'Kept from the last time you read it.'; el.querySelector('.pg-stop').remove(); return; }
  try {
    const { text, truncated } = await UI.sample(pagesPrompt(sc), { signal: ctl.signal, onText: ({ text }) => { out.textContent = text; } });
    out.textContent = text;
    if (truncated) note.textContent = 'Cut short.';
    try { localStorage.setItem(key, text); } catch (e) { /* storage unavailable */ }
  } catch (e) {
    out.textContent = e.text || '';
    const msg = { cancelled: '', not_granted: 'Reading pages needs permission to use Claude.', sampling_disabled: 'Claude isn\'t available on this account.', rate_limited: 'Too many requests just now. Try again in a little while.', refused: 'Claude wouldn\'t write these pages. Try changing the notes.' }[e.code];
    note.textContent = msg ?? 'Something went wrong. Try again.';
    if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(e.code)) { UI.sample = null; }
  }
  const st = el.querySelector('.pg-stop'); if (st) st.remove();
}

// Unread messages for the header badge: anything from someone else in a thread you haven't opened since.
function phoneUnread() {
  const M = S.me; if (!M || !M.phone) return 0;
  const seen = UI.seen || {}, n = {};
  let u = 0;
  for (const m of M.phone) { const k = threadOf(m); n[k] = (n[k] || 0) + 1; if (m.from !== -1 && n[k] > (seen[k] ?? Infinity)) u++; }
  // threads never opened in this session only count this week's news
  for (const m of M.phone) if (m.from !== -1 && seen[threadOf(m)] === undefined && m.w === S.week) u++;
  return u;
}
