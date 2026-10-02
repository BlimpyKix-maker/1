// ---------------- Starmeter, endorsements and a proper market ----------------
// GEA's Starmeter ranks who the world is talking about this week: recent hits, prizes, fame and work. It matters:
// buzz helps actors and heads of department get hired and gets you more at the negotiating table, and brands pay
// people with buzz to stand next to their products, in line with what they do. The Ticker gets a real market:
// every listed company, your gains and losses, and the week's movers.
function starScore(p) {
  if (!p || p.dead) return 0;
  const recent = p.lastWork !== undefined && S.week - p.lastWork < 26 ? 10 : 0, aw = (p.awards || []).filter(a => a.endsWith(String(S.year)) || a.includes(` ${S.year} `) || a.includes(` ${S.year - 1}`)).length;
  let s = (p.heat || 0) * .7 + (p.fame || 0) * .5 + (p.standing || 0) * .2 + recent + aw * 8;
  if (p.player && S.me) s += Math.log10(1 + Math.max(0, ...Object.values(S.me.fol || {}))) * 6;
  return Math.round(s * 10) / 10;
}
let SM_CACHE = null, SM_KEY = '';
function starmeter() {
  const k = S.week + ':' + S.people.length + ':' + S.films.length;
  if (SM_CACHE && SM_KEY === k && SM_CACHE.S === S) return SM_CACHE.L;
  const L = S.people.filter(p => !p.dead && !p.retired && !p.player).map(p => [p.id, starScore(p)]).sort((a, b) => b[1] - a[1]);
  SM_CACHE = { S, L }; SM_KEY = k; return L;
}
function myStarRank() { const s = starScore(ME()), L = starmeter(); let lo = 0, hi = L.length; while (lo < hi) { const m = (lo + hi) >> 1; if (L[m][1] > s) lo = m + 1; else hi = m; } return lo + 1; }
function whyTrending(p) {
  const f = p.credits.map(i => S.films[i]).filter(x => x && x.rel !== null && S.week - x.rel < 40).sort((a, b) => b.rel - a.rel)[0];
  const aw = (p.awards || []).slice(-1)[0];
  return aw && /\b(20\d\d|19\d\d)\b/.test(aw) && +aw.match(/\b(20\d\d|19\d\d)\b/)[0] >= S.year - 1 ? `Won ${aw}` : f ? `${f.title}${f.hitRatio > 2 ? ', a hit' : f.reviews >= 75 ? ', loved by critics' : ''}` : p.fame > 60 ? 'Famous' : 'Working steadily';
}
function starmeterHTML() {
  const M = S.me, F = UI.smf = UI.smf || { role: 'all', where: 'all' };
  let L = starmeter();
  if (F.role !== 'all') L = L.filter(([id]) => F.role === 'crew' ? !['actor', 'director', 'writer', 'producer'].includes(P(id).role) : P(id).role === F.role);
  if (F.where === 'here') L = L.filter(([id]) => P(id).hub === M.hub);
  const rank = myStarRank();
  return `<p class="eyebrow">GEA Starmeter · who the world is talking about this week</p>
   <div class="bf-row">${[['all', 'Everyone'], ['actor', 'Actors'], ['director', 'Directors'], ['writer', 'Writers'], ['producer', 'Producers'], ['crew', 'Crew']].map(([k, l]) => `<button class="pill${F.role === k ? ' on' : ''}" data-smf="role:${k}">${l}</button>`).join('')} <button class="pill${F.where === 'here' ? ' on' : ''}" data-smf="where:${F.where === 'here' ? 'all' : 'here'}">In ${esc(hubName(M.hub))} only</button></div>
   <p class="small">You: <b>#${rank.toLocaleString()}</b> of ${starmeter().length.toLocaleString()} · buzz ${starScore(ME())}. ${rank <= 500 ? 'Agents notice the top 500.' : rank <= 5000 ? 'You\'re on the radar.' : 'Nobody\'s searching for you yet.'}</p>
   <ol class="starm">${L.slice(0, 25).map(([id, s], i) => { const p = P(id); return `<li><span class="rk">${i + 1}</span>${portraitOf(p, 34)}<span><b>${pl(id)}</b><br><span class="muted small">${esc(ROLE_LABEL[p.role])} · ${esc(hubName(p.hub))} · ${esc(whyTrending(p))}</span></span><span class="small ${p.heat > 30 ? 'good' : ''}">${p.heat > 30 ? '▲' : '•'} ${Math.round(s)}</span></li>`; }).join('')}</ol>`;
}
// buzz helps you get hired, especially in front of the camera and at the top
function starFactors(post) { const t = tmplOf(post) || {}; if (!t.actor && (post.tier || 1) < 3) return []; const s = starScore(ME()); return s >= 12 ? [['Your Starmeter buzz', clamp((s - 12) / 40, 0, t.actor ? .9 : .5)]] : []; }
// ---- endorsements: brands that fit who you are ----
const BRANDS = [
  ['Argentum Optics', 'a camera lens', ['dp', 'director'], 0], ['Field & Fern', 'an outdoor jacket', ['dp', 'stunts', 'director'], 0], ['Lumenra', 'a lighting kit', ['dp', 'creator'], 0],
  ['Hushwave', 'noise-cancelling headphones', ['composer', 'sound', 'music', 'podcast', 'editor'], 0], ['Keystroke Pro', 'an editing laptop', ['editor', 'creator', 'writer'], 0], ['Quillworks', 'a writing app', ['writer'], 0],
  ['Maison Verel', 'a luxury watch', ['actor', 'director', 'producer'], 0], ['Ochre Atelier', 'a fragrance', ['actor'], 0], ['Velvet Row', 'a fashion house\'s new line', ['actor', 'costume', 'designer'], 0],
  ['Zingo', 'an energy drink', ['creator', 'stunts', 'music'], 1], ['CoinVault', 'a crypto exchange', ['actor', 'creator', 'producer'], 2], ['GlowSkin', 'a skincare range', ['actor', 'makeup', 'creator'], 0],
  ['Northline Air', 'an airline', ['actor', 'director', 'producer', 'music'], 0], ['Paperlane', 'a stationery brand', ['writer', 'designer'], 0], ['Ridgeback Motors', 'an electric car', ['actor', 'director', 'producer', 'music'], 0],
  ['SnackStack', 'a crisps brand', ['creator', 'podcast', 'actor'], 1], ['Gamma Bet', 'a betting app', ['actor', 'creator', 'music'], 2], ['Tonic & Thyme', 'a gin', ['actor', 'music', 'writer'], 0]
];
function endorseWeek() {
  const M = S.me, me = ME(), s = starScore(me), r = hashRand(S.week * 59 + M.id);
  if (s < 18 || r() > .12 + s / 400 || (M.mail || []).some(m => m.act && m.act.k === 'endorse' && !m.done && S.week - m.w < 6)) return;
  const field = M.field && M.field !== 'film' ? M.field : null, L = BRANDS.filter(b => b[2].includes(me.role) || (field && b[2].includes(field)));
  if (!L.length) return;
  const b = L[Math.floor(r() * L.length)], fee = Math.round(usd(clamp(600 * Math.pow(s / 18, 2.2), 600, 400000)) / 50) * 50;
  mail('offers', `Partnerships, ${b[0]}`, `Be the face of ${b[1]}?`, `We think our customers would love to see you with ${b[1]}. A photo shoot, two posts and a short film for our channels. Fee: ${fmtCash(fee)}.${b[3] === 2 ? ' (Your agent mutters that this one could age badly.)' : b[3] === 1 ? ' It\'s not glamorous, but the money is real.' : ''}`, { k: 'endorse', fee, brand: b[0], shady: b[3] });
}
function endorseAccept(A) {
  const M = S.me, me = ME();
  M.cash += A.fee; me.fame = clamp((me.fame || 0) + 1.5, 0, 100); M.energy = clamp(M.energy - 6, 0, 100);
  (M.deals = M.deals || []).push({ w: S.week, brand: A.brand, fee: A.fee });
  if (A.shady === 2) (M.secrets = M.secrets || []).push({ w: S.week, risk: 3, what: `fronting ${A.brand}`, ad: 1 });
  if (A.shady && (M.flags = M.flags || {})) M.flags.sellout = S.week;
  milestone(`Became the face of ${A.brand}`, 'work');
}
// ---- the desktop itself: a menu bar and widgets, so the computer is worth opening every day ----
const WALLS = { studio: ['Studio red', 'linear-gradient(135deg, var(--slate), var(--accent))'], dusk: ['Sunset Boulevard', 'linear-gradient(160deg, #2B1B3F 0%, #7A2E5C 45%, #E8853A 100%)'], ocean: ['Pacific', 'linear-gradient(160deg, #0E2A47, #1C6E8C 60%, #8FD3F4)'], noir: ['Noir', 'repeating-linear-gradient(115deg, #111 0 22px, #1b1b1b 22px 44px)'], forest: ['Redwoods', 'linear-gradient(170deg, #12261C, #2E5A3A 55%, #A3C47A)'], marquee: ['Marquee', 'radial-gradient(circle at 30% 30%, #E3B23C 0 6%, transparent 7%), radial-gradient(circle at 70% 60%, #E3B23C 0 4%, transparent 5%), linear-gradient(135deg, #3A0F14, #7A1E28)'] };
function menuBar() {
  const M = S.me, W = M.wk, unreadMail = (M.mail || []).filter(m => S.week - m.w < 1 && m.folder !== 'spam' && m.folder !== 'news').length, unread = phoneUnread();
  const time = W ? ['8:12', '13:40', '21:05'][W.block] : '9:00';
  return `<div class="menubar"><span>🍏 <b>File</b> Edit View</span><span class="mb-r"><span title="Unread mail">✉️ ${unreadMail}</span><span title="Texts">💬 ${unread}</span><span title="Wi-Fi">📶</span><span title="Your energy">🔋 ${Math.round(M.energy)}%</span><span>${W ? fmtDay(W.day).split(' ')[0] : ''} ${time}</span></span></div>`;
}
function desktopWidgets() {
  const M = S.me, me = ME(), mails = (M.mail || []).filter(m => m.folder !== 'spam').slice(-3).reverse(), ap = (M.appts || []).filter(a => !a.done).slice(0, 3);
  const port = Object.entries(M.port || {}).filter(([, n]) => n > 0), val = port.reduce((t, [id, n]) => t + mktPrice(S.companies[+id]) * n, 0);
  const idx = [['box', '🎬'], ['music', '🎵'], ['video', '📺'], ['pod', '🎙️']].map(([k, ic]) => { const a = fieldIndex(k, S.week - 4), b = fieldIndex(k, S.week); return a > 0 ? `${ic} <span class="${b >= a ? 'good' : 'bad'}">${b >= a ? '▲' : '▼'}${Math.abs((b / a - 1) * 100).toFixed(1)}%</span>` : ''; }).filter(Boolean).join(' ');
  const top = starmeter().slice(0, 3), news0 = S.news.slice(-2).reverse(), wall = curWall();
  return `<div class="widgets">
   <div class="widget"><h5>✉️ Mail</h5>${mails.length ? mails.map(m => `<button class="linkish wl" data-app="mail" data-mailo="${m.id}">${m.act && !m.done ? '● ' : ''}${esc(m.subj)}<br><span class="muted small">${esc(m.from)}</span></button>`).join('') : '<p class="muted small">Inbox zero.</p>'}</div>
   <div class="widget"><h5>📈 Markets</h5><p class="small">${idx}</p>${port.length ? `<p class="small">Your shares: <b>${fmtCash(Math.round(val))}</b></p>` : '<p class="muted small">You own no shares.</p>'}<button class="linkish small" data-app="ticker">Open Ticker ›</button></div>
   <div class="widget"><h5>⭐ Starmeter</h5><p class="small">You: <b>#${myStarRank().toLocaleString()}</b></p>${top.map(([id], i) => `<p class="small">${i + 1}. ${pl(id)}</p>`).join('')}<button class="linkish small" data-app="gea" data-geatab="star">See the chart ›</button></div>
   <div class="widget"><h5>📅 Coming up</h5>${ap.length ? ap.map(a => `<p class="small">${esc((APPT_KINDS[a.kind] || {}).label || a.kind)}${a.who != null ? ' · ' + pl(a.who) : ''}<br><span class="muted">${esc(slotLabel(a))}</span></p>`).join('') : '<p class="muted small">Nothing booked.</p>'}</div>
   <div class="widget"><h5>🏦 Money</h5><p class="small"><b>${fmtCash(M.cash)}</b> in the bank</p><p class="small muted">Rent ${fmtCash(usd(ORIGIN.life[M.life].rent))}/wk${(M.deals || []).length ? ` · ${M.deals.length} brand deal${M.deals.length > 1 ? 's' : ''}` : ''}</p></div>
   <div class="widget wide"><h5>📰 The Daily Slate</h5>${news0.map(n => `<p class="small">${esc(n.text.slice(0, 140))}</p>`).join('')}</div>
   <div class="widget"><h5>🖼️ Wallpaper</h5><p class="small">${Object.entries(WALLS).map(([k, [l]]) => `<button class="pill${wall === k ? ' on' : ''}" data-wall="${k}">${esc(l)}</button>`).join(' ')}</p></div></div>`;
}

function curWall() { if (!UI.wall) { try { const w = typeof localStorage !== 'undefined' && localStorage.getItem('ab-wall'); UI.wall = w && WALLS[w] ? w : 'studio'; } catch (e) { UI.wall = 'studio'; } } return WALLS[UI.wall] ? UI.wall : 'studio'; }
