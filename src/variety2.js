// ---------------- Less of the same, round two ----------------
// Long playthroughs showed the group chat repeating itself: the same reply from you ("omw") dozens of times, the same
// line from friends, the same ask every week. Your replies now vary, a line nobody needs to hear twice is dropped if
// it was said in the last ten weeks, and the group chat asks something every other week at most.
const REPLY_VARIANTS = {
  'yes please!! thank you': ['yes please!! thank you', 'you\'re a legend. yes', 'yes yes yes. owe you one', 'please do. thank you!!', 'that would be amazing'],
  'omw': ['omw', 'on my way', 'leaving now', 'save me a seat', 'five minutes. ten. fifteen', 'getting a cab'],
  'you\'re on': ['you\'re on', 'deal', 'easy money', 'bet', 'prepare to pay up'],
  'ugh. fine. you\'re right': ['ugh. fine. you\'re right', 'fine. FINE.', 'I hate that you\'re right', 'ok the critics are with you this time'],
  'the reviews disagree but ok 🙃': ['the reviews disagree but ok 🙃', 'bold of you', 'the critics would like a word', 'interesting choice. wrong, but interesting']
};
{ const _sms = sms;
  sms = function (from, t, kind = 'text', extra = {}) {
    const M = S.me;
    if (M && typeof t === 'string' && REPLY_VARIANTS[t]) t = pickLine(REPLY_VARIANTS[t], (M.phoneN || 0) + (from || 0));
    if (M && kind === 'gossip' && from !== -1 && typeof t === 'string') { const seen = (M.phone || []).some(m => m.kind === 'gossip' && m.t === t && S.week - m.w < 10); if (seen) return; }
    return _sms(from, t, kind, extra);
  };
}
{ const _ca = crewAsk; crewAsk = function (C) { const M = S.me; if (S.week - (M.crewAskW ?? -99) < 2) return; M.crewAskW = S.week; return _ca(C); }; }
