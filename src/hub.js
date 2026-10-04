// ---------------- Today as a hub: what needs you, one click away ----------------
// The Today page leads with alerts that jump straight to where you need to be (an offer in the mail, unread texts,
// a reward to claim, jobs that fit, a song ready to release), quick actions for the common moves, the best jobs on
// the board with apply boxes right there, and the latest texts with replies you can send without leaving the page.
function hubAlerts() {
  const M = S.me, out = [], add = (icon, t, go, cls = '') => out.push({ icon, t, go, cls });
  const pend = pending().length; if (pend) add('⚖️', `${pend} decision${pend > 1 ? 's' : ''} waiting`, 'feed', 'bad');
  const offers = (M.mail || []).filter(m => m.act && !m.done && S.week - m.w < 4);
  for (const m of offers.slice(0, 2)) add('✉️', `${m.subj} (${m.from.split(',')[0]})`, `computer:mail:${m.id}`, 'good');
  const stk = typeof pendingStakes === 'function' ? pendingStakes().length : 0; if (stk) add('⏳', `${stk} text${stk > 1 ? 's that need' : ' that needs'} an answer`, 'phone', 'bad');
  const unread = phoneUnread(); if (unread) add('💬', `${unread} unread text${unread > 1 ? 's' : ''}`, 'phone');
  const cl = typeof ambClaimable === 'function' ? ambClaimable() : []; if (cl.length) add('✦', `${cl.length} reward${cl.length > 1 ? 's' : ''} to claim`, 'standing', 'good');
  if (M.make && M.make.ready) add('🎵', `${M.make.title || 'Your work'} is ready to release`, 'create', 'good');
  const fits = M.board.filter(p => !blockedFrom(tmplOf(p)) && hireOdds(p) >= .35 && S.week - (p.w || 0) <= 1).length; if (fits && !M.jobs.length && lookingForWork()) add('💼', `${fits} new job${fits > 1 ? 's' : ''} you could get`, 'work');
  if (typeof COMPS !== 'undefined') { const c = COMPS.filter(c => compOpen(c) && !compEntered(c) && compFits(c)).length; if (c) add('🏆', `${c} contest${c > 1 ? 's open that fit' : ' open that fits'} you`, 'compete'); }
  if (M.energy < 30) add('🔋', `Energy ${Math.round(M.energy)}: plan some rest`, 'diary', 'bad');
  if (M.cash < usd(ORIGIN.life[M.life].rent) * 2) add('💸', `Money's tight: ${fmtCash(M.cash)}`, 'diary', 'bad');
  return out;
}
function bestFits(n = 4) { return typeof rankedFits === 'function' ? rankedFits(n) : S.me.board.filter(p => !blockedFrom(tmplOf(p))).map(p => [p, hireOdds(p)]).sort((a, b) => b[1] - a[1]).slice(0, n); }
function todayHub() {
  const M = S.me, A = hubAlerts(), slots = appSlots(), picked = [...UI.apps].filter(id => M.board.some(p => p.id === id)), B = bestFits();
  const lastIn = (M.phone || []).filter(m => m.from >= 0 && m.replyable && !m.replied).slice(-2).reverse();
  return `<section class="panel hub">${A.length ? `<div class="alerts">${A.map(a => `<button class="alert ${a.cls}" data-jump="${esc(a.go)}"><span>${a.icon}</span>${esc(a.t)} ›</button>`).join('')}</div>` : '<p class="muted small">All quiet. A good week to make something.</p>'}
   ${typeof autoHTML === 'function' ? autoHTML() : ''}${typeof indieHTML === 'function' ? indieHTML() : ''}<div class="qa"><b class="small">Quick actions</b> <button class="btn-s ghost" data-jump="diary">🗓️ Plan the week</button>${B.length && slots && lookingForWork() ? `<button class="btn-s ghost" data-applybest="1" title="Tick the best-odds jobs, up to your ${slots} applications">✓ Apply to the best fits</button>` : ''}<button class="btn-s ghost" data-jump="computer:mail">✉️ Mail</button><button class="btn-s ghost" data-jump="people">👥 Contacts</button><button class="btn-s ghost" data-jump="standing">⭐ Standing</button></div>
   ${B.length && !M.jobs.length && lookingForWork() ? `<h4>Best fits on the board <span class="count">${picked.length} of ${slots} applications planned</span></h4><ul class="plain fits">${B.map(([p, o]) => `<li><label class="applyl"><input type="checkbox" data-apply="${p.id}" ${UI.apps.has(p.id) ? 'checked' : ''} ${!UI.apps.has(p.id) && picked.length >= slots ? 'disabled' : ''}></label> <a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a> <span class="muted small">${p.film !== null ? esc(S.films[p.film].title) : esc(p.mco || (tmplOf(p) || {}).biz || '')} · ${fmtCash(p.rate)}/day · ${p.weeks} wk</span> <span class="chip ${o >= .6 ? 'good' : o >= .35 ? '' : 'warn'}">${Math.round(o * 100)}%</span></li>`).join('')}</ul>${!slots ? '<p class="muted small">Plan some job-hunting blocks this week to send applications.</p>' : ''}` : ''}
   ${lastIn.length ? `<h4>Texts</h4>${lastIn.map(m => `<div class="hubtxt">${phoneAvatar(m.from, 26)} <b>${esc(P(m.from).name.split(' ')[0])}</b>: ${esc(m.t.slice(0, 120))}<br>${replyOptions(m).slice(0, 4).map(k => `<button class="qr" data-reply="${m.id}:${k}">${replyLabel(m, k)}</button>`).join(' ')} <button class="linkish small" data-fthread="${m.from}">Open</button></div>`).join('')}` : ''}</section>`;
}
function hubClick(t) {
  const d = t.dataset;
  if (d.jump) { const [tab, app, x] = d.jump.split(':'); UI.tab = 'you'; UI.stack = []; UI.dtab = tab; if (d.libf) UI.libf = d.libf; if (app) { UI.app = app; if (x) UI.mailo = +x; } render(); return true; }
  if (d.applybest) { const slots = appSlots(); UI.apps = new Set([...UI.apps].filter(id => S.me.board.some(p => p.id === id))); for (const [p] of bestFits(12)) { if (UI.apps.size >= slots) break; UI.apps.add(p.id); } render(true); return true; }
  return false;
}
