// ---------------- Relationships that need upkeep, and messages that vary ----------------
// Contacts fade: someone you haven't seen in two years, who isn't family, a partner, a mentor, one of your regulars or
// a confidant, drifts out of your active circle (they're still in the world; meet them again and they're back), and
// the circle has a soft cap of 240. Short replies vary: a line you've heard three times comes back reworded, or with
// something of the person in it. And offers are capped at two a week: nobody gets fifteen in a single week.
const KEEP_TAGS = ['Your regular', 'Mentor', 'Family', 'Your sibling', 'Your child', 'Rival'];
function keepContact(id) { const M = S.me, k = M.known[id], r = relOf(id); return ['partner', 'close', 'mentor', 'ex'].includes(r) || (k && k.tags.some(t => KEEP_TAGS.includes(t))) || (typeof cfdRank === 'function' && cfdRank(id) >= 2) || id === partnerOf() || (M.agent && M.agent.id === id); }
function fadeWeek() {
  const M = S.me; if (!M || S.week % 4) return; const ids = Object.keys(M.known).map(Number).filter(id => P(id) && !P(id).dead && !M.known[id].faded);
  const stale = id => S.week - (M.known[id].seen ?? M.known[id].met) > 104 && Math.abs(opinion(id)) < 40 && !keepContact(id);
  let n = 0; for (const id of ids) if (stale(id)) { M.known[id].faded = S.week; n++; }
  const live = ids.filter(id => !M.known[id].faded); if (live.length > 240) { const L = live.filter(id => !keepContact(id)).sort((a, b) => (M.known[a].seen ?? M.known[a].met) - (M.known[b].seen ?? M.known[b].met)); for (const id of L.slice(0, live.length - 240)) { M.known[id].faded = S.week; n++; } }
  if (n >= 5) diary(`${n} people you used to know drift out of your life this month. Nobody decided it; nobody called.`);
}
{ const _ak = aliveKnown; aliveKnown = function () { const M = S.me; return _ak().filter(id => !M.known[id].faded); }; }
{ const _mt = meet; meet = function (id) { const M = S.me; if (M && M.known[id] && M.known[id].faded) { delete M.known[id].faded; M.known[id].seen = S.week; } return _mt.apply(this, arguments); }; }
// ---- texts that don't repeat ----
const TX_ALT = {
  ok: ['ok', 'okay', 'ok then', 'alright', 'fine by me', 'sure', 'works for me', 'noted', 'right you are', 'deal', 'sounds good', 'yep, fine', 'if you say so', 'cool, ok'],
  yes: ['I\'ll be there', 'see you there', 'wouldn\'t miss it', 'count me in', 'I\'m in', 'yes!!', 'on my way soon', 'save me a seat', 'already putting my coat on', 'try and stop me'],
  cool: ['cool cool', 'nice', 'sweet', 'love that', 'brilliant', 'great stuff', 'ha, excellent', 'oh nice', 'perfect', 'that\'s the dream', 'yesss'],
  short: ['k', 'kk', 'ok', 'mhm', 'yep', 'got it', '👍', 'y', 'sure', 'noted', 'cheers'],
  thanks: ['thanks', 'thank you!', 'ta', 'cheers', 'you\'re a star', 'appreciate it', 'owe you one', 'thanks, really'],
  later: ['talk later', 'later!', 'speak soon', 'catch you later', 'ttyl', 'more soon', 'call you after']
};
const TX_GROUP = {}; for (const [g, L] of Object.entries(TX_ALT)) for (const x of L) TX_GROUP[x.toLowerCase()] = g;
const TX_TAIL = ['', ' x', ' 🙂', ' (running, sorry)', ' — talk properly soon', '!!', ' ha', ' 🙏', ' (on set, will call)', ' — long day', ' 🎬', ' — still laughing about last time'];
{ const _sms = sms; sms = function (from, t, kind = 'text', extra = {}) {
  const M = S.me; if (M && from !== null && from !== undefined && from >= 0 && typeof t === 'string' && t.length <= 60) {
    const seen = M.txSeen = M.txSeen || {}, key = t.toLowerCase().trim();
    if ((seen[key] || 0) >= 3) { const g = TX_GROUP[key], L = g ? TX_ALT[g] : [t], r = hashRand(((from * 7919) ^ (S.week * 104729) ^ (M.phoneN || 0)) >>> 0);
      let best = t, bn = 1e9; for (let i = 0; i < 24; i++) { const c = L[Math.floor(r() * L.length)] + TX_TAIL[Math.floor(r() * TX_TAIL.length)], n = seen[c.toLowerCase().trim()] || 0; if (n < bn) { bn = n; best = c; if (!n) break; } }
      t = best; }
    const k2 = t.toLowerCase().trim(); seen[k2] = (seen[k2] || 0) + 1; const keys = Object.keys(seen); if (keys.length > 3000) for (const k of keys.slice(0, 500)) delete seen[k];
  }
  return _sms.call(this, from, t, kind, extra); }; }
// ---- at most two offers a week ----
{ const _ib = inbox; inbox = function (kind, title, text, extra = {}) {
  const M = S.me; if (kind === 'offer' && M) { const n = M.inbox.filter(x => x.kind === 'offer' && x.w === S.week).length; if (n >= 2) { M.stats.offersCapped = (M.stats.offersCapped || 0) + 1; return null; } }
  return _ib.apply(this, arguments); }; }
WEEK_HOOKS.push(fadeWeek);
