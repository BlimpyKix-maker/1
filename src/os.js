// ---------------- ApplOS: the computer, rebuilt ----------------
// One dark, readable workspace instead of a toy desktop: a sidebar of apps grouped by what they're for, a header,
// and a body. Home is a working dashboard (what needs you, best jobs with apply boxes, mail, diary, money, news,
// your rank). CrewList plans your applications; Calendar shows the week and what's booked; Contacts is a little
// CRM for the people who matter; Bank adds up your net worth. Every other app opens in the same frame.
// Modules register extra apps here: OS_VIEWS[key] = () => html, OS_EXTRA[key] = [icon, name, subtitle].
const OS_VIEWS = {};
const OS_GROUPS = [
  ['Today', ['home', 'cal']],
  ['Work', ['jobs', 'mail', 'contacts']],
  ['Money', ['bank', 'ticker', 'bazaar']],
  ['Industry', ['trades', 'gea', 'flick', 'weather']],
  ['Make', ['write', 'studio', 'cutroom', 'notes']],
  ['Learn', ['library']],
  ['Play', ['sweep', 'match', 'cue', 'scramble', 'store']]
];
const OS_EXTRA = { library: ['📚', 'Craft Library', 'Every field\'s lessons: how it\'s done, the decisions, and examples from this world'], home: ['🏠', 'Home', 'Everything that needs you, at a glance'], cal: ['📅', 'Calendar', 'Your week and everything booked'], contacts: ['👥', 'Contacts', 'The people who matter, and when you last spoke'] };
const OS_SUB = { mail: 'Offers, replies and fan mail', jobs: 'Every listing you\'ve heard about, with your odds', trades: 'The trade paper: this week and the archive', gea: 'Search everything: films, people, companies, artists, songs, prizes and lessons', bank: 'Balance, net worth and where the money went', flick: 'The industry\'s photo app: sets, wraps, premieres and pets', notes: 'Saved in this browser', sweep: 'Find the clean takes', weather: 'Conditions in your city', write: 'Your scripts', ticker: 'The Bourse: shares in the companies that make films', studio: 'Record and mix', cutroom: 'Cut your video', store: 'Games and pro software', match: 'A memory game', cue: 'Hit the cue on the beat', scramble: 'Unscramble film words', bazaar: 'Gear, books, experiences and film history' };
function osApp(k) { if (OS_EXTRA[k]) return [k].concat(OS_EXTRA[k]); const A = APPS.find(a => a[0] === k); return A ? [A[0], A[1], A[2], OS_SUB[k] || ''] : null; }
function osBadge(k) {
  const M = S.me;
  if (k === 'mail') return (M.mail || []).filter(m => S.week - m.w < 1 && !['spam', 'news', 'sent'].includes(m.folder)).length;
  if (k === 'home') return typeof hubAlerts === 'function' ? hubAlerts().filter(a => a.cls === 'bad' || a.cls === 'good').length : 0;
  if (k === 'jobs') return M.jobs.length ? 0 : M.board.filter(p => S.week - (p.w || 0) <= 0).length;
  return 0;
}
function osPanel() {
  const M = S.me, W = M.wk, k = UI.app && osApp(UI.app) ? UI.app : 'home', A = osApp(k);
  const listed = new Set(OS_GROUPS.flatMap(g => g[1])), more = APPS.map(a => a[0]).filter(x => !listed.has(x));
  const groups = OS_GROUPS.concat(more.length ? [['More', more]] : []);
  const time = W ? ['08:12', '13:40', '21:05'][W.block] : '09:00';
  const side = groups.map(([g, ks]) => `<div class="os-g"><h6>${g}</h6>${ks.filter(osApp).map(x => { const a = osApp(x), b = osBadge(x), lock = typeof appLocked === 'function' && appLocked(x); return `<button class="os-i${x === k ? ' on' : ''}${lock ? ' locked' : ''}" data-app="${x}"><span class="os-ic">${a[1]}</span><span class="os-l">${esc(a[2])}</span>${b ? `<span class="os-b">${b}</span>` : lock ? '<span class="os-lock">🔒</span>' : ''}</button>`; }).join('')}</div>`).join('');
  let body;
  const stackB = typeof osStackHTML === 'function' ? osStackHTML() : null;
  if (stackB) body = stackB; else try { body = typeof OS_VIEWS !== 'undefined' && OS_VIEWS[k] ? OS_VIEWS[k]() : k === 'home' ? osHome() : k === 'cal' ? osCal() : k === 'contacts' ? osContacts() : k === 'jobs' ? osJobs() : k === 'bank' ? osBank() : k === 'library' && typeof libraryHTML === 'function' ? libraryHTML() : k === 'trades' && typeof paperHTML === 'function' ? paperHTML() : appWindow(k); }
  catch (e) { body = `<p class="muted">This app crashed: ${esc(String(e.message || e))}</p>`; }
  return `<section class="panel os-wrap"><div class="os${UI.wmax ? ' max' : ''}">
   <aside class="os-side"><div class="os-brand"><b>ApplOS</b><span>${W ? DAYS7[W.day].slice(0, 3) : ''} ${time}</span></div><div class="os-stat"><span title="Energy">🔋 ${Math.round(M.energy)}%</span><span title="Cash">💵 ${fmtCash(M.cash)}</span></div>${side}</aside>
   <div class="os-main"><header class="os-head"><div><h3>${A[1]} ${esc(A[2])}</h3><p>${esc(A[3] || '')}</p></div><div class="os-act">${k !== 'home' ? '<button class="os-btn" data-app="home">🏠 Home</button>' : ''}<button class="os-btn" data-wmax="1">${UI.wmax ? '⤡ Exit full screen' : '⤢ Full screen'}</button></div></header><div class="os-body os-${k}">${body}</div></div></div></section>`;
}
function osCard(title, inner, cls = '') { return `<div class="os-card ${cls}"><h5>${title}</h5>${inner}</div>`; }
function osHome() {
  const M = S.me, me = ME(), A = typeof hubAlerts === 'function' ? hubAlerts() : [], slots = appSlots(), B = typeof bestFits === 'function' ? bestFits(5) : [];
  const picked = [...UI.apps].filter(id => M.board.some(p => p.id === id)).length;
  const ap = typeof apptsAhead === 'function' ? apptsAhead().slice(0, 4) : [];
  const nw = osNetWorth(), news = S.news.map((n, i) => [n, i]).slice(-4).reverse();
  const kpi = (l, v, c = '') => `<div class="os-kpi"><span>${l}</span><b class="${c}">${v}</b></div>`;
  return `<div class="os-kpis">${kpi('Cash', fmtCash(M.cash), M.cash < 0 ? 'bad' : '')}${kpi('Net worth', fmtCash(nw.total))}${kpi('Energy', Math.round(M.energy) + '%', M.energy < 30 ? 'bad' : '')}${kpi('Stress', Math.round(M.stress), M.stress > 70 ? 'bad' : '')}${kpi('Standing', Math.round(me.standing))}${typeof myStarRank === 'function' ? kpi('Buzz Index', '#' + myStarRank().toLocaleString()) : ''}</div>
   <div class="os-grid">
    ${osCard('Needs you', A.length ? `<div class="os-alerts">${A.map(a => `<button class="os-alert ${a.cls}" data-jump="${esc(a.go)}"><span>${a.icon}</span>${esc(a.t)}<i>›</i></button>`).join('')}</div>` : '<p class="muted">All quiet. A good week to make something.</p>', 'wide')}
    ${!M.jobs.length && B.length ? osCard(`Best jobs for you <small>${picked} of ${slots} applications planned</small>`, `<ul class="os-list">${B.map(([p, o]) => `<li><label><input type="checkbox" data-apply="${p.id}" ${UI.apps.has(p.id) ? 'checked' : ''} ${!UI.apps.has(p.id) && picked >= slots ? 'disabled' : ''}></label><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a><span class="muted">${p.film !== null ? esc(S.films[p.film].title) : esc((tmplOf(p) || {}).biz || '')}</span><span class="os-pill ${o >= .6 ? 'good' : o >= .35 ? '' : 'bad'}">${Math.round(o * 100)}%</span></li>`).join('')}</ul>${!slots ? '<p class="muted small">Plan job-hunting blocks in your week to send applications.</p>' : ''}<button class="os-link" data-app="jobs">All listings ›</button>`, 'wide') : M.jobs.length ? osCard('On the job', `<ul class="os-list">${M.jobs.map(j => `<li><b>${esc(j.t)}</b><span class="muted">${j.film !== null && j.film !== undefined ? fl(j.film) : esc(j.mco || '')}</span><span class="os-pill">${Math.max(0, j.started + j.weeks - S.week)} wk left</span></li>`).join('')}</ul>`, 'wide') : ''}
    ${osMessages()}
    ${osCard('Coming up', ap.length ? `<ul class="os-list">${ap.map(a => `<li><span>${(APPT_KINDS[a.kind] || {}).icon || '•'}</span><b>${esc(slotLabel(a))}</b><span class="muted">${esc((APPT_KINDS[a.kind] || {}).label || a.kind)}${a.who != null ? ' · ' + esc(P(a.who).name) : ''}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing booked. Text someone.</p>', '')}
    ${osCard('Money', `<p class="os-big">${fmtCash(nw.total)}</p><p class="muted small">Cash ${fmtCash(M.cash)} · shares ${fmtCash(nw.shares)} · collectibles ${fmtCash(nw.things)}${nw.debt ? ` · owed ${fmtCash(nw.debt)}` : ''}</p><button class="os-link" data-app="bank">Open the bank ›</button>`)}
    ${osCard('Headlines', `<ul class="os-list">${news.map(([n, i]) => `<li><a href="#" class="lk" data-go="article:${i}">${esc(n.text.slice(0, 110))}</a></li>`).join('')}</ul><button class="os-link" data-app="trades">The Daily Slate ›</button>`, 'wide')}
   </div>`;
}
// Mail and texts together, on the front page: the newest from people first, with a reply right there.
function osMessages() {
  const M = S.me, texts = (M.phone || []).filter(m => m.from >= 0 && m.replyable && !m.replied && S.week - m.w < 6).slice(-4).reverse();
  const mails = (M.mail || []).filter(m => !['spam', 'sent', 'news'].includes(m.folder) && (!m.rd || (m.act && !m.done))).slice(-5).reverse();
  const tx = m => `<div class="os-txt">${phoneAvatar(m.from, 26)}<div><b>${esc(P(m.from).name)}</b> <span class="muted small">${fmtDate(m.w, true)}</span><p>${esc(m.t)}</p><div class="quick">${replyOptions(m).slice(0, 4).map(k => `<button class="qr" data-reply="${m.id}:${k}">${replyLabel(m, k)}</button>`).join('')}</div><div class="compose own"><input id="rp-text-${m.id}" maxlength="280" placeholder="Write back…"><button class="btn-s" data-reply="${m.id}:own">Send</button></div></div></div>`;
  const ml = m => `<li><button class="os-row${m.rd ? '' : ' unread'}" data-app="mail" data-mailo="${m.id}">${m.act && !m.done ? '<span class="os-dot"></span>' : ''}<b>${esc(m.subj)}</b><span class="muted">${esc(m.from)}</span></button></li>`;
  return osCard(`Messages <small>${texts.length ? texts.length + ' text' + (texts.length > 1 ? 's' : '') : ''}${texts.length && mails.length ? ' · ' : ''}${mails.length ? mails.length + ' email' + (mails.length > 1 ? 's' : '') : ''}</small>`,
    `${texts.map(tx).join('')}${mails.length ? `<ul class="os-list">${mails.map(ml).join('')}</ul>` : ''}${!texts.length && !mails.length ? '<p class="muted">Nothing new. Text someone, or write an email: <button class="os-link" data-app="phoneapp">Phone ›</button> <button class="os-link" data-app="mail">Mail ›</button></p>' : `<p><button class="os-link" data-app="mail">All mail ›</button> <button class="os-link" data-app="phoneapp">All texts ›</button></p>`}`, 'wide');
}
function osNetWorth() {
  const M = S.me, shares = Object.entries(M.port || {}).reduce((t, [id, n]) => t + (n > 0 && S.companies[+id] && S.companies[+id].closed === null && typeof mktPrice === 'function' ? mktPrice(S.companies[+id]) * n : 0), 0);
  const things = (M.bz || []).filter(x => !x.sold && (x.film !== undefined || (BZ_BY[x.k] || {}).collect)).reduce((t, x) => t + usd(bzValue(x)), 0) + (M.trophies || []).filter(t => !t.sold).reduce((t, x) => t + (typeof trophyValue === 'function' ? trophyValue(x) : 0), 0);
  const B = M.bank || { sav: 0, cds: [], loan: 0 }, banked = B.sav + B.cds.reduce((t, c) => t + c.amt, 0), sec = typeof sectorValue === 'function' ? sectorValue() : 0;
  const debt = (M.debt || 0) + (M.shark || 0) + Object.values(M.loans || {}).reduce((t, l) => t + l.amt, 0) + Math.round(B.loan || 0);
  return { shares: Math.round(shares + sec), things: Math.round(things), banked: Math.round(banked), debt, total: Math.round(M.cash + banked + shares + sec + things - debt) };
}
function osJobs() {
  const M = S.me, q = (UI.cq || '').toLowerCase(), slots = appSlots(), picked = [...UI.apps].filter(id => M.board.some(p => p.id === id)).length;
  const L = M.board.filter(p => !q || p.t.toLowerCase().includes(q) || (p.film !== null && S.films[p.film].title.toLowerCase().includes(q)) || (p.away && hubName(p.away).toLowerCase().includes(q))).map(p => [p, hireOdds(p)]).sort((a, b) => (b[0].lead !== undefined) - (a[0].lead !== undefined) || b[1] - a[1]);
  return `<div class="os-tools"><input id="cq" type="search" placeholder="Search titles, films, cities…" value="${esc(UI.cq || '')}"><span class="muted">${L.length} listings · ${picked} of ${slots} applications planned this week</span><button class="os-link" data-jump="work">Full board ›</button></div>
   <table class="os-table"><thead><tr><th></th><th>Job</th><th>Where</th><th>Pay</th><th>Length</th><th>Odds</th></tr></thead><tbody>${L.slice(0, 40).map(([p, o]) => `<tr${p.lead !== undefined ? ' class="lead"' : ''}><td><input type="checkbox" data-apply="${p.id}" ${UI.apps.has(p.id) ? 'checked' : ''} ${!UI.apps.has(p.id) && picked >= slots ? 'disabled' : ''} ${M.jobs.some(j => j.k === p.k && j.film === p.film) ? 'disabled' : ''}></td><td><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a>${p.lead !== undefined ? ` <span class="os-pill good" title="${esc(P(p.lead).name)} put your name in">lead</span>` : ''}${/^g_/.test(p.k) ? ' <span class="os-pill">gig</span>' : ''}</td><td>${p.film !== null ? fl(p.film) : typeof employerLink === 'function' && p.mco ? employerLink(p) : esc(p.mco || (tmplOf(p) || {}).biz || '')}${p.away ? ` <span class="muted">· ${esc(hubName(p.away))}</span>` : ''}</td><td>${p.rate ? fmtCash(p.rate) + '/day' : '<span class="muted">unpaid</span>'}</td><td>${p.weeks} wk · ${p.days}d</td><td><span class="os-pill ${o >= .6 ? 'good' : o >= .35 ? '' : 'bad'}">${Math.round(o * 100)}%</span></td></tr>`).join('') || '<tr><td colspan="6" class="muted">Nothing matches.</td></tr>'}</tbody></table>`;
}
function osCal() {
  const M = S.me, W = M.wk, ahead = typeof apptsAhead === 'function' ? apptsAhead() : [];
  const plan = typeof planBlocks === 'function' ? (() => { try { return planBlocks(); } catch (e) { return null; } })() : null;
  const cell = (d, b) => { const ap = ahead.find(a => a.w === S.week && a.d === d && a.b === b), act = plan && plan[d] ? plan[d][b] : null, A = act ? BLOCK_ACTS[act] || (typeof venueAsEvening === 'function' ? venueAsEvening(act) : null) : null, past = W && (d < W.day || (d === W.day && b < W.block)); return `<td class="${past ? 'past' : ''}${W && d === W.day && b === W.block ? ' now' : ''}">${ap ? `<b>${(APPT_KINDS[ap.kind] || {}).icon || '•'} ${esc((APPT_KINDS[ap.kind] || {}).label || ap.kind)}</b>${ap.who != null ? `<small>${esc(P(ap.who).name)}</small>` : ''}` : A ? `<span>${A.icon || ''} ${esc(A.label || '')}</span>` : '<span class="muted">·</span>'}</td>`; };
  return `<table class="os-table os-week"><thead><tr><th></th>${DAYS7.map((d, i) => `<th class="${W && i === W.day ? 'today' : ''}">${d.slice(0, 3)}</th>`).join('')}</tr></thead><tbody>${['Morning', 'Afternoon', 'Evening'].map((l, b) => `<tr><th>${l}</th>${DAYS7.map((_, d) => cell(d, b)).join('')}</tr>`).join('')}</tbody></table>
   <div class="os-tools"><button class="os-btn" data-jump="diary">🗓️ Change the plan</button><button class="os-btn" data-jump="phone">💬 Text someone to book something</button></div>
   <h4>Booked</h4>${ahead.length ? `<ul class="os-list">${ahead.slice(0, 12).map(a => `<li><span>${(APPT_KINDS[a.kind] || {}).icon || '•'}</span><b>${esc(slotLabel(a))}</b><span class="muted">${esc((APPT_KINDS[a.kind] || {}).label || a.kind)}${a.who != null ? ' with ' + esc(P(a.who).name) : ''}${a.what ? ' · ' + esc(a.what) : ''}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing booked.</p>'}`;
}
function osContacts() {
  const M = S.me, IC0 = typeof innerCircle === 'function' ? innerCircle() : [], f = UI.osf || (IC0.some(x => x[1] >= 2) ? 'circle' : 'all'), IC = new Map(IC0), rec = typeof recentColleagues === 'function' ? recentColleagues() : new Set();
  let L = aliveKnown();
  if (f === 'circle') L = L.filter(id => (IC.get(id) || 0) >= 2); else if (f === 'work') L = L.filter(id => rec.has(id)); else if (f === 'cold') L = L.filter(id => ['cold', 'rival', 'ex'].includes(relOf(id)));
  L.sort((a, b) => (IC.get(b) || 0) - (IC.get(a) || 0) || opinion(b) - opinion(a));
  const tabs = [['circle', 'Inner circle'], ['work', 'Worked with lately'], ['all', 'Everyone'], ['cold', 'On bad terms']];
  return `<div class="os-tools">${tabs.map(([k, l]) => `<button class="os-btn${f === k ? ' on' : ''}" data-osf="${k}">${l}</button>`).join('')}<span class="muted">${L.length} people</span></div>
   <table class="os-table"><thead><tr><th>Name</th><th>Job</th><th>You are</th><th>Feeling</th><th>Last spoke</th><th></th></tr></thead><tbody>${L.slice(0, 60).map(id => { const p = P(id), o = opinion(id), k = M.known[id], r = relOf(id), last = k.seen !== undefined ? k.seen : k.met; return `<tr><td>${phoneAvatar(id, 24)} ${pl(id)}</td><td class="muted">${esc(ROLE_LABEL[p.role] || '')}</td><td>${REL[r] ? REL[r].icon + ' ' + esc(REL[r].label) : ''}${rec.has(id) ? ' <span class="os-pill">colleague</span>' : ''}</td><td><span class="os-meter"><i style="width:${clamp(50 + o / 2, 0, 100)}%;background:${o >= 20 ? 'var(--good)' : o <= -10 ? 'var(--bad)' : 'var(--gold)'}"></i></span></td><td class="${S.week - last > 8 ? 'bad' : 'muted'}">${S.week - last ? (S.week - last) + ' wk ago' : 'this week'}</td><td><button class="os-btn" data-osthread="${id}">💬 Text</button></td></tr>`; }).join('') || '<tr><td colspan="6" class="muted">Nobody here yet.</td></tr>'}</tbody></table>`;
}
function osBank() {
  const M = S.me, life = ORIGIN.life[M.life], nw = osNetWorth(), c = typeof myCo === 'function' ? myCo() : null;
  const money = M.diary.filter(d => /^Money:/.test(d.t)).slice(-12).reverse();
  const rent = usd(life.rent), car = usd(VEHICLES[M.vehicle || 'transit'].upkeep), runway = rent + car > 0 ? Math.floor(Math.max(0, M.cash) / (rent + car + (M.upkeep || 0))) : 0;
  const kpi = (l, v, c2 = '') => `<div class="os-kpi"><span>${l}</span><b class="${c2}">${v}</b></div>`;
  return `<div class="os-kpis">${kpi('Balance', fmtCash(M.cash), M.cash < 0 ? 'bad' : '')}${kpi('Net worth', fmtCash(nw.total))}${kpi('Shares', fmtCash(nw.shares))}${kpi('Collectibles & trophies', fmtCash(nw.things))}${kpi('Owed', fmtCash(nw.debt), nw.debt ? 'bad' : '')}${kpi('Runway', runway + ' wk', runway < 4 ? 'bad' : '')}</div>
   <div class="os-grid">${osCard('Every week', `<ul class="os-list"><li><b>Rent</b><span class="muted">${esc(life.label)}</span><span>${fmtCash(rent)}</span></li><li><b>Getting around</b><span class="muted">${esc(VEHICLES[M.vehicle || 'transit'].label)}</span><span>${fmtCash(car)}</span></li>${M.upkeep ? `<li><b>Upkeep</b><span class="muted">home and things</span><span>${fmtCash(M.upkeep)}</span></li>` : ''}${M.allowance ? `<li><b>Allowance</b><span class="muted">from home</span><span class="good">+${fmtCash(M.allowance)}</span></li>` : ''}${Object.entries(M.loans || {}).map(([id, l]) => `<li><b>Owe ${esc(P(+id).name)}</b><span class="muted">since ${fmtDate(l.w, true)}</span><span class="bad">${fmtCash(l.amt)}</span></li>`).join('')}</ul>${c ? `<p class="small">${esc(c.name)} holds ${fmtCash(Math.round(c.cash * 1e6))}.</p>` : ''}`)}
   ${osCard('Statement', `<ul class="os-list">${money.map(d => `<li><time class="muted">${fmtDate(d.w, true)}</time><span>${esc(d.t.replace(/^Money: /, ''))}</span></li>`).join('') || '<li class="muted">Nothing yet.</li>'}</ul>`, 'wide')}
   ${typeof bankHTML === 'function' ? '</div>' + bankHTML() + '<div class="os-grid">' : ''}${osCard('Grow it', '<p class="small">Shares pay dividends; collectibles drift and appreciate; cash just sits there.</p><button class="os-btn" data-app="ticker">📈 The Bourse</button> <button class="os-btn" data-app="bazaar">🏷️ Bazaar</button>')}</div>`;
}
function osClick(t) {
  const d = t.dataset;
  if (d.osf) { UI.osf = d.osf; render(true); return true; }
  if (d.osthread) { UI.tab = 'you'; UI.stack = []; UI.dtab = 'phone'; UI.thread = +d.osthread; render(); return true; }
  return false;
}
