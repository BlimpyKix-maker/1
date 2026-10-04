// ---------------- Phone and mail you can find your way around ----------------
// What you've read is remembered with the game (not just this browser tab), unread counts mean the same thing
// everywhere, an alert opens the exact thread or email, and a conversation always opens at its newest message.
function phoneSeen() {
  const M = S.me; if (!M) return {};
  if (!M.phoneSeen) { M.phoneSeen = {}; for (const m of M.phone || []) { const k = threadOf(m); M.phoneSeen[k] = (M.phoneSeen[k] || 0) + 1; } }   // start clean
  return M.phoneSeen;
}
// unread in one thread: incoming messages after the ones you've looked at
function threadUnread(k) {
  const M = S.me, seen = phoneSeen()[k] || 0; let i = 0, u = 0;
  for (const m of M.phone || []) if (threadOf(m) === k) { i++; if (i > seen && m.from !== -1) u++; }
  return u;
}
function phoneUnread() {
  const M = S.me; if (!M || !M.phone) return 0;
  const seen = phoneSeen(), n = {}; let u = 0;
  for (const m of M.phone) { const k = threadOf(m); n[k] = (n[k] || 0) + 1; if (m.from !== -1 && n[k] > (seen[k] || 0)) u++; }
  return u;
}
// where a phone alert should land: a text that needs an answer first, then the newest unread conversation
function phoneFocus() {
  const M = S.me, st = typeof pendingStakes === 'function' ? pendingStakes() : [];
  if (st.length) { UI.thread = threadOf(st[st.length - 1]); return; }
  for (let i = (M.phone || []).length - 1; i >= 0; i--) { const m = M.phone[i], k = threadOf(m); if (m.from !== -1 && threadUnread(k)) { UI.thread = k; return; } }
}
function markAllRead() {
  const M = S.me; phoneSeen(); M.phoneSeen = {}; for (const m of M.phone || []) { const k = threadOf(m); M.phoneSeen[k] = (M.phoneSeen[k] || 0) + 1; }
  for (const m of M.mail || []) m.rd = 1;
}
// after drawing: open conversations sit at their newest message; an open email sits at the top of the view
function msgScroll() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.sms.thread').forEach(el => { el.scrollTop = el.scrollHeight; const sc = el.closest('.screen'); if (sc) sc.scrollTop = sc.scrollHeight; });
  if (UI.mailJump) { UI.mailJump = 0; const r = document.querySelector('.mread'); if (r && r.scrollIntoView) r.scrollIntoView({ block: 'nearest' }); }
}
function msgClick(t) {
  if (!S.me) return false;
  if (t.dataset.markread !== undefined) { markAllRead(); render(true); return true; }
  return false;
}
