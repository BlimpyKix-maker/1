// ---------------- The Feed ----------------
// Everything that reached you, in one place: decisions waiting, messages, notes about your work, the trades'
// stories about people and films you know, and what's happening in the city. Filter it, act on it inline, and
// only go to the specific screens when you want the detail. Read-only: it builds from state, never changes it.
const FEED_CATS = { all: ['All', '🗂️'], needs: ['Needs you', '❗'], msg: ['Messages', '💬'], work: ['Work', '🎬'], people: ['People', '🫂'], industry: ['The trades', '📰'], world: ['City & world', '🌍'], money: ['Money', '💵'] };
function feedCatOf(it) {
  if (it.choices && !it.done) return 'needs';
  if (it.world) return 'world';
  if (['debt', 'broke'].includes(it.kind)) return 'money';
  if (['invite', 'ask', 'secret'].includes(it.kind) || (it.person !== undefined && it.film === undefined)) return 'people';
  return 'work';
}
function feedItems() {
  const M = S.me, out = [], me = ME(), mine = new Set(me.credits), knownIds = new Set(Object.keys(M.known).map(Number));
  for (const it of M.inbox.slice(-120)) out.push({ w: it.w, ord: it.id, cat: feedCatOf(it), it });
  // texts: one entry per person per week, the conversation so far
  const conv = new Map();
  for (const m of (M.phone || []).slice(-80)) { const who = m.from >= 0 ? m.from : m.to; if (who === null || who === undefined || who < 0) continue; const k = who + ':' + m.w; if (!conv.has(k)) conv.set(k, []); conv.get(k).push(m); }
  for (const [k, L] of conv) if (P(+k.split(':')[0])) out.push({ w: L[0].w, ord: 1e6 + L[L.length - 1].id, cat: 'msg', conv: L, who: +k.split(':')[0] });
  // the trades: stories that touch you, your people, your films, your company, or the way the wind blows
  for (let i = S.news.length - 1, n = 0; i >= 0 && n < 40 && S.week - S.news[i].w < 26; i--) {
    const x = S.news[i], r = x.ref || {};
    const touches = (r.person !== undefined && knownIds.has(r.person)) || (r.film !== undefined && (mine.has(r.film) || (S.films[r.film] && keyIds(S.films[r.film]).some(id => knownIds.has(id))))) || (r.company !== undefined && r.company === M.company) || ['Trend', 'Awards', 'Company'].includes(x.type);
    if (touches) { out.push({ w: x.w, ord: -i, cat: 'industry', news: x, ni: i }); n++; }
  }
  return out.sort((a, b) => b.w - a.w || b.ord - a.ord);
}
function feedEntry(e) {
  if (e.it) { const it = e.it, C = FEED_CATS[e.cat]; return `<li class="fe fe-${e.cat}${e.cat === 'needs' ? ' open' : ''}"><span class="fic" title="${esc(C[0])}">${C[1]}</span><div class="fb">${inboxCard(it)}</div></li>`; }
  if (e.conv) {
    const L = e.conv, q = P(e.who) || null, last = L.filter(m => m.from >= 0).pop() || L[L.length - 1], can = last.from >= 0 && last.replyable && !last.replied && typeof replyOptions === 'function';
    return `<li class="fe fe-msg"><span class="fic">${phoneAvatar(e.who, 32)}</span><div class="fb"><div class="mh"><time>${fmtDate(e.w, true)}</time><b>${esc(q ? q.name : 'Someone')}</b> <span class="muted small">${L.length} message${L.length > 1 ? 's' : ''}</span></div>
      <div class="fconv">${L.slice(-4).map(m => `<p class="${m.from < 0 ? 'out' : 'in'}">${esc(m.t)}</p>`).join('')}</div>
      <p class="small">${can ? replyOptions(last).slice(0, 4).map(k => `<button class="qr" data-reply="${last.id}:${k}">${REPLIES[k].label}</button>`).join(' ') + ' ' : ''}<button class="linkish" data-fthread="${e.who}">Open the thread</button></p></div></li>`;
  }
  const x = e.news;
  return `<li class="fe fe-industry"><span class="fic">📰</span><div class="fb"><div class="mh"><time>${fmtDate(x.w, true)}</time>${chip(x.type, 't-' + x.type)}</div><p><a href="#" class="lk headline" data-go="article:${e.ni}">${esc(x.text)}</a></p></div></li>`;
}
function feedPanel() {
  const M = S.me, me = ME(), f = UI.feedf || 'all', all = feedItems();
  const counts = {}; for (const e of all) counts[e.cat] = (counts[e.cat] || 0) + 1;
  // decisions waiting are pinned to the top of everything
  const L = f === 'all' ? all.filter(e => e.cat === 'needs').concat(all.filter(e => e.cat !== 'needs')) : all.filter(e => e.cat === f), n = UI.feedN || 30;
  // group by week: this week, last week, then dates
  let lastW = null; const rows = [];
  for (const e of L.slice(0, n)) { if (e.cat === 'needs' && f === 'all') { if (lastW !== 'pin') { lastW = 'pin'; rows.push('<li class="fweek bad">Waiting on you</li>'); } rows.push(feedEntry(e)); continue; } if (e.w !== lastW) { lastW = e.w; const ago = S.week - e.w; rows.push(`<li class="fweek">${ago === 0 ? 'This week' : ago === 1 ? 'Last week' : 'Week of ' + fmtDate(e.w, true)}</li>`); } rows.push(feedEntry(e)); }
  const pend = pending(), job = M.jobs[0], unread = phoneUnread(), W = M.wk;
  const upcoming = (M.appts || []).filter(a => !a.done && (a.w > S.week || (a.w === S.week && (!W || a.d * 3 + a.b >= W.day * 3 + W.block)))).slice(0, 4);
  const senders = [...new Set((M.phone || []).slice(-30).reverse().filter(m => m.from >= 0 && m.kind !== 'mine' && P(m.from)).map(m => m.from))].slice(0, 6);
  return `<div class="feedwrap"><section class="panel feedmain"><h3>Feed</h3>
    <div class="fchips">${Object.entries(FEED_CATS).map(([k, [l, ic]]) => `<button class="fchip${f === k ? ' on' : ''}" data-feedf="${k}">${ic} ${l}${k !== 'all' && counts[k] ? ` <span class="dn${k === 'needs' ? ' bad' : ''}">${counts[k]}</span>` : ''}</button>`).join('')}</div>
    <ol class="feedlist">${rows.join('') || '<li class="empty">Nothing here yet.</li>'}</ol>
    ${L.length > n ? `<p><button class="btn-s ghost" data-feedmore="1">Show older</button></p>` : ''}</section>
   <aside class="feedside">
    <section class="panel"><h4>Right now</h4><p><b>${esc(W ? fmtDay(W.day) : fmtDate(S.week))}</b></p>
     ${pend.length ? `<p class="bad">${pend.length} decision${pend.length > 1 ? 's' : ''} waiting <button class="linkish" data-feedf="needs">Show</button></p>` : `<p><button class="btn-s" data-next="1">Live on <kbd>space</kbd></button></p>`}
     <p class="small">${job ? `Working: <b>${esc(job.t)}</b>${job.film !== null && job.film !== undefined ? ' on ' + fl(job.film) : ''}${job.task ? `<br>Task: ${esc(job.task.t)} (${job.task.prog}/${job.task.need})` : ''} <button class="linkish" data-dtab="work">The work</button>` : 'Between jobs. <button class="linkish" data-dtab="work">See the board</button>'}</p>
     <p class="small">Cash <b>${fmtCash(M.cash)}</b> · energy <b>${Math.round(M.energy)}</b> · stress <b>${Math.round(M.stress)}</b>${M.grind > 6 ? ` · <span class="bad">${M.grind} weeks without a break</span>` : ''}</p>${typeof worldStrip === 'function' ? worldStrip() : ''}</section>
    ${upcoming.length ? `<section class="panel"><h4>Coming up</h4><ul class="plain small">${upcoming.map(a => { const A = APPT_KINDS[a.kind] || {}; return `<li>${A.icon || '•'} ${esc(A.label || a.kind)}${a.who != null ? ' with ' + pl(a.who) : ''} <span class="muted">${a.w === S.week ? DAYS7[a.d] : fmtDate(a.w, true)}</span></li>`; }).join('')}</ul></section>` : ''}
    ${senders.length ? `<section class="panel"><h4>Messages${unread ? ` <span class="dn good">${unread}</span>` : ''}</h4><div class="fsend">${senders.map(id => `<button class="linkish" data-fthread="${id}" title="${esc(P(id).name)}">${phoneAvatar(id, 34)}</button>`).join('')}</div></section>` : ''}
    <section class="panel"><h4>Jump to</h4><p class="small">${[['work', 'Job board'], ['create', 'Your writing & company'], ['people', 'Contacts'], ['life', 'Life & years']].map(([k, l]) => `<button class="linkish" data-dtab="${k}">${l}</button>`).join(' · ')}</p></section>
   </aside></div>`;
}
