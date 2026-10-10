// ---------------- Messages, rebuilt: a messenger and a mail client that respect your time ----------------
// Texting is a two-pane messenger: conversations on the left (filter to unread, waiting on you, or the group chat),
// the open conversation on the right with the person's card on top and one-tap invitations (coffee, drinks, a
// date), quick replies as big buttons, and your own words if you want them. With nothing open, the right side shows
// who is waiting on a reply, what's coming up, and your people. Mail is a three-pane client: smart folders
// (Needs you first), a clean list with a face or a logo for every sender, the subject and the first line, chips for
// offers and money, and a reading pane with the actions, Archive and Next. Same actions underneath as before.

function avatarDot(name, s = 34, icon) {
  const h = [...String(name || '?')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7), hue = h % 360;
  const ini = icon || String(name || '?').replace(/^the /i, '').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  return `<span class="adot" style="width:${s}px;height:${s}px;background:hsl(${hue} 45% 42%);font-size:${Math.round(s * (icon ? .5 : .38))}px">${esc(ini)}</span>`;
}
function threadNeeds(k) {
  const msgs = (S.me.phone || []).filter(m => threadOf(m) === k), last = msgs.slice().reverse().find(m => m.from !== -1);
  return !!(last && S.week - last.w <= 2 && ((last.replyable && !last.replied) || (last.topic === 'stake' && !last.replied && !last.missed)) && msgs[msgs.length - 1] === last);   // after a fortnight they've moved on
}
// the same text from the same person twice in a week is one text
{ const _sms = sms; sms = function (from, t, kind, extra) { const M = S.me, norm = x => String(x).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(), n = norm(t); if (from !== null && from !== undefined && from >= 0 && (M.phone || []).slice(-8).some(m => m.from === from && m.w === S.week && norm(m.t) === n)) return; return _sms(from, t, kind, extra); }; }
// ---- the messenger ----
phonePanel = function () {
  const M = S.me, all = M.phone || [], known = aliveKnown();
  UI.seen = typeof phoneSeen === 'function' ? phoneSeen() : (UI.seen || {});
  const threads = new Map(); all.forEach((m, i) => { const k = threadOf(m); threads.set(k, { k, last: m, i, n: ((threads.get(k) || {}).n || 0) + 1 }); });
  const unreadOf = k => typeof threadUnread === 'function' ? threadUnread(k) : 0;
  const nameOf = k => k === 'home' ? 'Home & gossip' : k === 'crew' ? 'The group chat' : P(k) ? P(k).name : 'Someone';
  const when = m => m.w === S.week ? `${DAYS7[m.d].slice(0, 3)} ${BLOCKS[m.b].toLowerCase()}` : S.week - m.w === 1 ? 'last week' : `${S.week - m.w}w`;
  const filt = UI.phf || 'all';
  let list = [...threads.values()].filter(t => t.k === 'home' || t.k === 'crew' || (P(t.k) && !P(t.k).dead));
  const needs = list.filter(t => threadNeeds(t.k));
  if (filt === 'unread') list = list.filter(t => unreadOf(t.k) > 0); else if (filt === 'reply') list = needs; else if (filt === 'group') list = list.filter(t => t.k === 'crew' || t.k === 'home');
  list.sort((a, b) => (threadNeeds(b.k) - threadNeeds(a.k)) || ((unreadOf(b.k) > 0) - (unreadOf(a.k) > 0)) || b.i - a.i);
  const byRel = {}; for (const id of known) { const r = relOf(id); (byRel[r] = byRel[r] || []).push(id); }
  const T = UI.txt = UI.txt || { id: '', kind: 'hi', slot: 0, msg: '' };
  const open = UI.thread !== undefined && UI.thread !== null && (UI.thread === 'home' || UI.thread === 'crew' || M.known[UI.thread]) ? UI.thread : null;
  if (open !== null && open !== 'home' && open !== 'crew') T.id = String(open);
  const tid = T.id === '' ? null : +T.id, trel = tid !== null && M.known[tid] ? relOf(tid) : null;
  const kinds = [['hi', 'A message'], ['coffee', 'Coffee'], ['drinks', 'Drinks']].concat(tid !== null && opinion(tid) < -5 ? [['sorry', 'Apologise']] : []).concat(trel === 'mentor' ? [['mentor', 'Mentor session']] : []).concat(tid !== null && (trel === 'partner' || canRomance(tid)) ? [['date', trel === 'partner' ? 'Date night' : 'Ask them out']] : []);
  if (tid !== null && typeof topicAvail === 'function') kinds.push(...topicAvail(tid).map(k => [k, TOPICS[k].l]));
  if (!kinds.some(k => k[0] === T.kind)) T.kind = 'hi';
  const free = T.kind === 'hi' || (typeof TOPICS !== 'undefined' && TOPICS[T.kind]);
  const slots = upcomingSlots(16), ahead = apptsAhead();
  const compose = () => tid === null ? '' : `<div class="mx-compose">${kinds.length > 1 ? `<div class="mx-kinds">${kinds.map(([k, l]) => `<button class="pill${T.kind === k ? ' on' : ''}" data-txkind="${k}">${{ hi: '💬', coffee: '☕', drinks: '🍸', sorry: '🙏', mentor: '🎓', date: '❤️' }[k] || '✨'} ${esc(l)}</button>`).join('')}</div>` : ''}
     <div class="mx-row">${free ? `<input id="tx-msg" maxlength="280" placeholder="${T.kind === 'hi' ? 'Write a message (or leave blank)' : 'In your own words (optional)'}" value="${esc(T.msg || '')}">` : `${sel('tx-slot', slots.map((s, i) => [i, slotLabel(s)]), T.slot)}`}<button class="btn-s" data-sendtext="1">${free ? 'Send' : 'Invite'}</button></div></div>`;
  const row = t => { const u = unreadOf(t.k), nd = threadNeeds(t.k), q = t.k !== 'home' && t.k !== 'crew' ? P(t.k) : null, r = q ? relOf(t.k) : null;
    return `<button class="mx-thr${open === t.k ? ' on' : ''}${u ? ' unread' : ''}" data-thread="${t.k}">${phoneAvatar(t.k, 38)}<span class="mx-tb"><span class="mx-tt"><b>${esc(nameOf(t.k))}</b>${r && REL[r] ? `<i class="mx-rel">${REL[r].icon}</i>` : ''}<time>${when(t.last)}</time></span><span class="mx-prev">${nd ? '<em class="mx-need">Waiting on you</em> ' : ''}${t.last.from === -1 ? 'You: ' : t.last.grp && P(t.last.from) ? esc(P(t.last.from).name.split(' ')[0]) + ': ' : ''}${esc(t.last.t.slice(0, 80))}</span></span>${u ? `<span class="mx-dot">${u}</span>` : ''}</button>`; };
  const left = `<div class="mx-left"><div class="mx-top"><b>Messages</b><button class="btn-s ghost" data-newmsg="1">✏️ New</button></div>
    <div class="mx-filters">${[['all', 'All'], ['unread', `Unread${phoneUnread() ? ' ' + phoneUnread() : ''}`], ['reply', `Waiting on you${needs.length ? ' ' + needs.length : ''}`], ['group', 'Group']].map(([k, l]) => `<button class="pill${filt === k ? ' on' : ''}" data-phf="${k}">${l}</button>`).join('')}</div>
    <div class="mx-list">${list.slice(0, 30).map(row).join('') || `<p class="muted small mx-empty">${filt === 'all' ? 'No messages yet. Text someone: people you met are in the New list.' : 'Nothing here.'}</p>`}</div>
    ${phoneUnread() ? '<button class="linkish small" data-markread="1">Mark everything read</button>' : ''}</div>`;
  let right;
  if (open !== null) {
    UI.seen[open] = (threads.get(open) || {}).n || 0;
    const msgs = all.filter(m => threadOf(m) === open).slice(-40), q = open === 'home' || open === 'crew' ? null : P(open), rel = q ? relOf(open) : null;
    const lastIn = msgs.slice().reverse().find(m => m.from !== -1), canReply = q && lastIn && lastIn.replyable && !lastIn.replied && lastIn.id !== undefined;
    let day = null; const bubbles = msgs.map(m => { const dl = m.w === S.week ? DAYS7[m.d] : fmtDate(m.w, true), sep = dl !== day ? `<li class="mx-day">${esc(dl)}</li>` : ''; day = dl;
      return `${sep}<li class="mx-b ${m.from === -1 ? 'me' : 'them'} ${m.kind || ''}${m.topic === 'stake' && !m.replied && !m.missed ? ' stake' : ''}">${m.grp && m.from >= 0 && P(m.from) ? `<span class="gsend">${esc(P(m.from).name.split(' ')[0])}</span>` : ''}<p>${esc(m.t)}</p>${m.topic === 'stake' && !m.replied && !m.missed ? '<span class="stakechip">⏳ needs an answer this week</span>' : ''}</li>`; }).join('');
    right = `<div class="mx-head">${phoneAvatar(open, 44)}<div class="mx-hn"><b>${esc(nameOf(open))}</b>${q ? `<small>${REL[rel].icon !== '·' ? REL[rel].icon + ' ' : ''}${esc(REL[rel].label)} · ${esc((q.occ || occupationOf(q)) || '')} · texts ${esc(TEXT_STYLES[textStyle(q)].label)}</small>` : open === 'crew' && typeof chatCrew === 'function' ? `<small>${chatCrew().map(id => esc(P(id).name.split(' ')[0])).join(', ')} and you</small>` : ''}</div>${q ? `<a href="#" class="lk small" data-go="person:${open}">Profile</a>` : ''}<button class="linkish mx-close" data-thread="">✕</button></div>
     ${q && typeof bondHTML === 'function' ? bondHTML(open) : ''}
     <ul class="mx-msgs">${bubbles || '<li class="muted small">No messages yet. Say hello.</li>'}</ul>
     ${canReply ? `<div class="mx-quick">${replyOptions(lastIn).map(k => `<button class="qr" data-reply="${lastIn.id}:${k}">${replyLabel(lastIn, k)}</button>`).join('')}</div><div class="mx-row"><input id="rp-text" maxlength="280" placeholder="Or reply in your own words…"><button class="btn-s" data-reply="${lastIn.id}:own">Send</button></div><details class="newtopic"><summary class="small">Or change the subject, or invite them out…</summary>${compose()}</details>`
       : q ? compose() : open === 'crew' && typeof crewComposeHTML === 'function' ? crewComposeHTML() : ''}`;
  } else if (UI.newmsg) {
    const pick = REL_ORDER.flatMap(r => (byRel[r] || []).map(id => [id, r]));
    right = `<div class="mx-head"><span class="adot" style="width:44px;height:44px;background:var(--accent)">✏️</span><div class="mx-hn"><b>New message</b><small>Pick someone you know</small></div><button class="linkish mx-close" data-newmsg="">✕</button></div>
     <div class="mx-people">${pick.slice(0, 60).map(([id, r]) => `<button class="mx-person" data-thread="${id}">${phoneAvatar(id, 30)}<span><b>${esc(P(id).name)}</b><small>${REL[r].icon} ${esc(REL[r].label)}</small></span></button>`).join('') || '<p class="muted small">You don\'t know anyone yet. Go out, take a class, apply for work.</p>'}</div>`;
  } else {
    right = `<div class="mx-home"><h4>Waiting on you</h4>${needs.length ? `<div class="mx-list">${needs.slice(0, 6).map(row).join('')}</div>` : '<p class="muted small">Nobody is waiting on a reply.</p>'}
     <h4>Coming up</h4>${ahead.length ? `<ul class="plain appts">${ahead.slice(0, 8).map(x => `<li>${APPT_KINDS[x.kind].icon} <b>${esc(slotLabel(x))}</b>: ${esc(APPT_KINDS[x.kind].label)}${x.who != null ? ' with ' + pl(x.who) : ''}${x.what ? ` <span class="muted">(${esc(x.what)})</span>` : ''}</li>`).join('')}</ul>` : '<p class="muted small">Nothing booked. Text someone, or say yes to the next invitation.</p>'}
     <h4>Your people</h4>${REL_ORDER.filter(r => byRel[r] && r !== 'contact').map(r => `<p class="relrow"><span class="relk">${REL[r].icon} ${esc(REL[r].label)}${byRel[r].length > 1 && r !== 'partner' ? 's' : ''}</span> ${byRel[r].slice(0, 8).map(id => `<button class="linkish" data-thread="${id}">${esc(P(id).name)}</button>`).join(', ')}${byRel[r].length > 8 ? ` <span class="muted">+${byRel[r].length - 8}</span>` : ''}</p>`).join('') || '<p class="muted small">Nobody close yet. See people often and they become friends.</p>'}
     ${byRel.contact ? `<p class="muted small">${byRel.contact.length} other contacts. People you don't see for a couple of months drift.</p>` : ''}</div>`;
  }
  return `<section class="panel mx"><div class="mx-grid${open !== null || UI.newmsg ? ' opened' : ''}">${left}<div class="mx-right">${right}</div></div></section>`;
};
// ---- the mail client ----
const MAIL_ICON = { fans: '💌', news: '🗞️', spam: '🧹', sent: '📤' };
mailApp = function () {
  const M = S.me, L = (M.mail || []).slice().reverse(), f = UI.mailf || 'needs';
  const inInbox = m => !['spam', 'sent', 'news'].includes(m.folder) && !m.arch;
  const needs = m => m.act && !m.done && m.folder !== 'sent';
  const F = [['needs', '⚡ Needs you', needs], ['inbox', '📥 Inbox', inInbox], ['offers', '🤝 Offers', m => m.folder === 'offers'], ['fans', '💌 Fan mail', m => m.folder === 'fans'], ['news', '🗞️ Newsletters', m => m.folder === 'news'], ['arch', '🗄️ Archived', m => m.arch], ['sent', '📤 Sent', m => m.folder === 'sent'], ['spam', '🧹 Spam', m => m.folder === 'spam']];
  const FD = F.find(x => x[0] === f) || F[1], list = f === 'compose' ? [] : L.filter(FD[2]);
  const cnt = fn => L.filter(m => fn(m) && !m.rd).length;
  let open = L.find(m => m.id === UI.mailo);
  if (!open && f !== 'compose' && f !== 'old' && list.length && UI.mailo !== 0) { open = list.find(m => !m.rd) || list[0]; UI.mailo = open.id; open.rd = 1; }
  const chips = m => { const A = m.act || {}, c = []; if (needs(m)) c.push('<i class="mchip act">Needs you</i>'); if (A.fee !== undefined || A.adv !== undefined) c.push(`<i class="mchip money">${fmtCash(A.fee ?? A.adv)}</i>`); if (m.folder === 'fans') c.push('<i class="mchip fan">Fan</i>'); return c.join(''); };
  const row = m => `<button class="mrow2${open === m ? ' on' : ''}${m.rd ? '' : ' unread'}" data-mailo="${m.id}">${avatarDot(m.from, 34, MAIL_ICON[m.folder])}<span class="mr-b"><span class="mr-t"><b>${esc(m.from)}</b><time>${fmtDate(m.w, true)}</time></span><span class="mr-s">${esc(m.subj)}</span><span class="mr-p">${esc(String(m.body || '').replace(/\s+/g, ' ').slice(0, 90))}</span><span class="mr-c">${chips(m)}</span></span></button>`;
  const empty = { needs: ['✅', 'Nothing needs you', 'Offers, invitations and questions that want an answer land here first.'], inbox: ['📭', 'Inbox zero', 'Replies, invitations and offers land here. Write to someone to get things moving.'], offers: ['🤝', 'No offers yet', 'Offers arrive as your name gets around.'], fans: ['💌', 'No fan mail yet', 'Make things people see, and they write back.'], news: ['🗞️', 'No newsletters', ''], arch: ['🗄️', 'Nothing archived', ''], sent: ['📤', 'Nothing sent', 'Use New email to write to anyone you know.'], spam: ['🧹', 'No spam', 'Lucky you.'] }[f] || ['📭', 'Nothing here', ''];
  const actions = m => { if (m.folder === 'fans') return m.replied ? '<p class="muted">You wrote back. It made their week.</p>' : `<button class="btn-s" data-mailact="${m.id}:fan">💌 Write back</button>`;
    if (!m.act) return ''; if (m.done) return `<p class="muted">${m.doneT ? esc(m.doneT) : { yes: 'You said yes.', more: 'You asked for more. See their reply.', asked: 'You asked a question. See their reply.' }[m.done] || 'You declined.'}</p>`;
    if (m.act.opts) return m.act.opts.map(([k, l], i) => `<button class="btn-s${i ? ' ghost' : ''}" data-mailact="${m.id}:${k}">${esc(l)}</button>`).join(' ');
    return `<button class="btn-s" data-mailact="${m.id}:yes">${m.act.k === 'favour' ? 'Help them' : 'Accept'}</button> ${(m.act.fee !== undefined || m.act.adv !== undefined) && !m.act.pushed ? `<button class="btn-s ghost" data-mailact="${m.id}:more" title="Ask for more money. They might say yes, hold firm, or walk away.">Negotiate</button> ` : ''}${!m.act.asked ? `<button class="btn-s ghost" data-mailact="${m.id}:ask">Ask a question</button> ` : ''}<button class="btn-s ghost" data-mailact="${m.id}:no">Decline</button>`; };
  const nextUnread = open ? list.find(m => !m.rd && m !== open) : null;
  const reader = f === 'compose' ? (typeof composeMailHTML === 'function' ? composeMailHTML() : '') : f === 'old' ? `<ul class="inbox">${M.inbox.slice(-10).reverse().map(it => `<li class="msg ${it.kind}">${inboxCard(it)}</li>`).join('')}</ul>` : open ? `<div class="mread2"><div class="mr-head">${avatarDot(open.from, 42, MAIL_ICON[open.folder])}<div><b>${esc(open.from)}</b><small class="muted">${fmtDate(open.w, true)}${open.folder !== 'inbox' && F.find(x => x[0] === open.folder) ? ' · ' + F.find(x => x[0] === open.folder)[1].replace(/^\S+ /, '') : ''}</small></div></div>
     <h3>${esc(open.subj)}</h3><div class="mr-body">${esc(open.body).replace(/\n/g, '<br>')}</div><div class="mr-act">${actions(open)}</div>
     <div class="mr-foot">${open.folder !== 'sent' ? `<button class="linkish" data-mailarch="${open.id}">${open.arch ? 'Move back to inbox' : '🗄️ Archive'}</button>` : ''}${nextUnread ? `<button class="linkish" data-mailo="${nextUnread.id}">Next unread ›</button>` : ''}</div></div>` : `<div class="os-empty"><span>${empty[0]}</span><b>${empty[1]}</b><p>${empty[2]}</p></div>`;
  return `<div class="mail2"><div class="m2-fold"><button class="btn-s" data-mailf="compose">✏️ New email</button>${F.map(([k, l, fn]) => { const n = k === 'sent' || k === 'spam' || k === 'arch' ? 0 : k === 'needs' ? L.filter(fn).length : cnt(fn); return `<button class="m2-f${f === k ? ' on' : ''}" data-mailf="${k}">${l}${n ? `<span class="dn">${n}</span>` : ''}</button>`; }).join('')}<button class="m2-f${f === 'old' ? ' on' : ''}" data-mailf="old">🗂️ Old notices</button>${L.some(m => !m.rd && m.folder !== 'sent' && m.folder !== 'spam') ? '<button class="linkish small" data-markread="1">Mark all read</button>' : ''}${f === 'news' && list.length ? '<button class="linkish small" data-mailarchall="news">Archive all newsletters</button>' : ''}</div>
   ${f === 'compose' || f === 'old' ? '' : `<div class="m2-list">${list.slice(0, 40).map(row).join('') || `<p class="muted small m2-none">${esc(empty[1])}.</p>`}</div>`}
   <div class="m2-read${f === 'compose' || f === 'old' ? ' wide' : ''}">${reader}</div></div>`;
};
function msg2Click(t) {
  const d = t.dataset;
  if (d.phf) { UI.phf = d.phf; render(true); return true; }
  if (d.newmsg !== undefined) { UI.newmsg = d.newmsg ? 1 : 0; UI.thread = null; render(true); return true; }
  if (d.thread !== undefined && UI.newmsg) UI.newmsg = 0;   // and fall through to open the thread
  if (d.txkind) { const T = UI.txt = UI.txt || {}; const m = document.getElementById('tx-msg'); if (m) T.msg = m.value; T.kind = d.txkind; render(true); return true; }
  if (d.mailarch) { const m = (S.me.mail || []).find(x => x.id === +d.mailarch); if (m) { m.arch = m.arch ? 0 : 1; UI.mailo = null; } render(true); return true; }
  if (d.mailarchall) { for (const m of S.me.mail || []) if (m.folder === d.mailarchall) { m.arch = 1; m.rd = 1; } render(true); return true; }
  return false;
}
