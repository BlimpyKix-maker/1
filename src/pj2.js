// ---------------- On your set: morale, promises, and the censor ----------------
// More of what only the person whose name is on the company decides, on top of the production journey:
//  · Morale. How you handle people on set (the lead who calls in "sick", the crew asked for a sixth day, the fight
//    between two actors) moves the set's morale, and a happy set makes a better film: at release, morale adds to or
//    takes from the film's quality.
//  · Promises. Actors and crews ask for them: the big scene stays, top billing, no overtime. Each one goes in a
//    ledger. When the cut comes, you find out what a promise costs: keep it and lose a little film, or break it and
//    lose the person (and the rest of the set hears about it).
//  · The censor. In post, the film goes to whoever classifies films where you are: the Production Code office
//    (1934–67), the ratings board after it, the British censors, a national board. Cut for the wider certificate,
//    appeal, or take the restricted rating.
const PJ2_NEW = [
  { k: 'promise_scene', st: [1, 2], title: 'A promise about a scene', text: '{lead} pulls you aside: their big scene in {film} is why they took the part. They want your word it stays in the cut.', opts: [
    { k: 'promise', label: 'Give your word', ok: { morale: 2, promise: 'scene', t: 'They hug you. Word gets round the set that you look after actors.' } },
    { k: 'hedge', label: '"I\'ll fight for it"', check: ['cha', 12], ok: { morale: 1, t: 'They take it as a yes without you having said one.' }, bad: { morale: -2, t: 'They hear the hedge. A cooler week on set.' } },
    { k: 'no', label: 'No promises: the cut decides', ok: { morale: -1, t: 'They respect it, mostly.' } }] },
  { k: 'promise_billing', st: [0, 1], title: 'Billing', text: 'Two of the cast of {film} both believe they should be billed first. Their agents are on the phone, separately.', opts: [
    { k: 'lead', label: 'Promise {lead} top billing', ok: { morale: -1, promise: 'billing', t: '{lead} is delighted. The other one is professional about it, in a way that\'s worse.' } },
    { k: 'alpha', label: 'Bill them alphabetically', check: ['pack', 12], ok: { morale: 1, t: 'Everyone pretends to be satisfied. That\'s a win.' }, bad: { morale: -2, t: 'Both agents are unhappy now.' } }] },
  { k: 'promise_ot', st: [2], title: 'The crew asks for a promise', text: 'The crew on {film} has worked four sixty-hour weeks. The heads of department ask you to promise no more sixth days.', opts: [
    { k: 'promise', label: 'Promise: no more sixth days', ok: { morale: 3, promise: 'overtime', t: 'The atmosphere changes in an afternoon. People start bringing cakes.' } },
    { k: 'pay', label: 'Pay them double for any sixth day instead', cost: .01, ok: { morale: 2, t: 'Money isn\'t sleep, but it helps.' } },
    { k: 'no', label: 'The schedule is the schedule', ok: { morale: -4, t: 'Nobody says anything. The work gets slower.' } }] },
  { k: 'callin', st: [2], title: 'The call-in', text: '{lead} calls in sick on the day of the big scene. The rumour on set is that it\'s a hangover.', opts: [
    { k: 'around', label: 'Shoot around them today', check: ['setm', 12], ok: { morale: 1, t: 'You rejig the day and shoot inserts. Nobody loses a minute.' }, bad: { weeks: 1, morale: -1, t: 'You lose the day, then the next one.' } },
    { k: 'confront', label: 'Go to their trailer', check: ['cha', 13], ok: { morale: 2, q: 1, t: 'Twenty minutes, a coffee, a straight conversation. They\'re on set by noon and they\'re brilliant.' }, bad: { morale: -3, t: 'It turns into a row the whole set can hear.' } },
    { k: 'ignore', label: 'Say nothing, reschedule', ok: { weeks: 1, morale: -1, t: 'The crew notices that some people get away with things.' } }] },
  { k: 'feud', st: [2], title: 'A feud on set', text: 'Two of the cast of {film} have stopped speaking to each other. Their scenes together are next week.', opts: [
    { k: 'mediate', label: 'Sit them down together', check: ['cha', 13], ok: { morale: 3, q: 1, t: 'It was about a parking space. It\'s always about a parking space. They\'re friends by Friday.' }, bad: { morale: -2, t: 'It gets worse. You shoot their scenes in separate takes.' } },
    { k: 'separate', label: 'Shoot them separately', check: ['shape', 12], ok: { morale: 0, t: 'Over-the-shoulders with a stand-in. Nobody will ever know.' }, bad: { q: -1, t: 'You can see they\'re not in the same room.' } }] },
  { k: 'cut_promise', st: [3], need: f => (f.promises || []).some(p => p.k === 'scene' && !p.done), title: 'The promised scene', text: 'In the cutting room, the scene you promised {lead} would stay is slowing {film} down. The editor wants it gone.', opts: [
    { k: 'keep', label: 'Keep your word: the scene stays', ok: { q: -1, keep: 'scene', t: 'The scene stays. The film is a little longer. {lead} sends flowers to the edit suite.' } },
    { k: 'trim', label: 'Trim it hard, but keep it', check: ['rhythm', 13], ok: { q: 1, keep: 'scene', t: 'Half the length, all of the feeling. {lead} doesn\'t notice what\'s gone.' }, bad: { q: 0, keep: 'scene', t: 'It\'s shorter and still slow.' } },
    { k: 'cut', label: 'Cut it', ok: { q: 2, breaks: 'scene', t: 'The film is better. {lead} finds out at the premiere.' } }] },
  { k: 'censor', st: [3], need: f => !f.censored, title: 'The censor', text: '{board} has seen {film}. {issue}', opts: [
    { k: 'cut', label: 'Make the cuts for the wider certificate', ok: { q: -2, hook: 3, censor: 'cut', t: 'Two scenes trimmed. A certificate everyone can see.' } },
    { k: 'appeal', label: 'Appeal', check: ['cha', 13], ok: { censor: 'won', hook: 1, t: 'The appeal board sides with you. The film opens as made, for everyone.' }, bad: { hook: -3, censor: 'lost', t: 'Appeal refused, and the restricted certificate stands.' } },
    { k: 'take', label: 'Take the restricted certificate', ok: { q: 1, hook: -4, censor: 'restricted', t: 'Adults only. Critics respect it; families stay home.' } }] }
];
function pj2Board(f) { const m = HUBS[f.hub] ? HUBS[f.hub].m : 'US', y = S.year;
  if (m === 'US') return y < 1934 ? null : y < 1968 ? 'The Production Code office' : 'The ratings board';
  if (m === 'UK') return y < 1913 ? null : 'The British censors'; if (m === 'IN') return y < 1952 ? null : 'The Censor Board'; return y < 1920 ? null : 'The national censors'; }
function pj2Issue(f) { const g = f.genre;
  return ['Horror', 'Crime', 'Thriller', 'War', 'Action', 'Martial arts', 'Superhero'].includes(g) ? 'The violence goes too far for a general certificate, they say: three shots, and one sound effect.'
    : ['Romance', 'Drama', 'Musical'].includes(g) ? 'One love scene is "too frank" for a general certificate.' : 'The language, mostly: eleven words, listed.'; }
// the new calls slot into the production journey; some only make sense under conditions
for (const c of PJ2_NEW) PJ_CALLS.push(c);
{ const _pw = pjWeek; pjWeek = function () {
  const n0 = (S.me.inbox || []).length, skip = PJ_CALLS.filter(c => c.need);
  // calls whose conditions aren't met for a film are hidden from the draw by marking them used for that film, then restored
  const hidden = []; for (const f of pjOwnFilms()) for (const c of skip) if (!(f.pj || []).includes(c.k) && (!c.need(f) || (c.k === 'censor' && !pj2Board(f)))) { (f.pj = f.pj || []).push(c.k); hidden.push([f, c.k]); }
  _pw();
  for (const [f, k] of hidden) { const i = (f.pj || []).indexOf(k); if (i >= 0) f.pj.splice(i, 1); }
  for (const it of (S.me.inbox || []).slice(n0)) { if (it.kind !== 'pj') continue; const f = S.films[it.film]; if (!f) continue; const lead = (f.cast || []).find(id => P(id) && id !== ME().id), L = lead !== undefined ? P(lead).name : 'Your lead';
    const sub = t => String(t).replace(/\{lead\}/g, L).replace(/\{board\}/g, pj2Board(f) || 'The censors').replace(/\{issue\}/g, pj2Issue(f)); it.text = sub(it.text); it.title = sub(it.title); for (const c of it.choices || []) c.label = sub(c.label); it.lead = lead; }
}; }
{ const _pp = pjPick; pjPick = function (it, k) {
  if (it.kind !== 'pj') return _pp(it, k);
  const C = PJ_CALLS.find(x => x.k === it.call), f = S.films[it.film], me = ME(); const r = _pp(it, k); if (!C || !f || !PJ2_NEW.includes(C)) return r;
  const o = C.opts.find(x => x.k === k) || C.opts[C.opts.length - 1], ok = it.result && it.result.ok !== false, R = ok ? o.ok : (o.bad || o.ok), lead = it.lead, L = lead !== undefined && P(lead) ? P(lead).name : 'Your lead';
  if (it.result && it.result.t) it.result.t = it.result.t.replace(/\{lead\}/g, L);
  if (R.morale) f.morale = clamp((f.morale || 0) + R.morale, -10, 10);
  if (R.promise && lead !== undefined) { (f.promises = f.promises || []).push({ k: R.promise, who: lead, w: S.week }); if (P(lead)) addTie(me, P(lead), 4); }
  if (R.keep) { const p = (f.promises || []).find(x => x.k === R.keep && !x.done); if (p) { p.done = 'kept'; if (P(p.who)) { addTie(me, P(p.who), 5); if (typeof remember === 'function') remember(p.who, 4, 'Kept a promise about the cut'); } } }
  if (R.breaks) { const p = (f.promises || []).find(x => x.k === R.breaks && !x.done); if (p) { p.done = 'broken'; f.morale = clamp((f.morale || 0) - 3, -10, 10); me.standing = clamp(me.standing - .5, 0, 100);
    if (P(p.who)) { addTie(me, P(p.who), -15); if (typeof remember === 'function') remember(p.who, -8, 'Broke a promise about the cut'); }
    for (const id of (f.cast || []).filter(id => id !== p.who && id !== me.id && P(id)).slice(0, 4)) addTie(me, P(id), -3); } }
  if (R.censor) f.censored = R.censor;
  return r;
}; }
// a broken overtime promise: if the film runs over after you promised the crew, they remember
{ const _sp = typeof slatePick === 'function' ? slatePick : null; if (_sp) slatePick = function (it, k) { const f = S.films[it.film], r = _sp(it, k); if (f && it.call === 'over' && (f.promises || []).some(p => p.k === 'overtime' && !p.done)) { const p = f.promises.find(p => p.k === 'overtime' && !p.done); p.done = 'broken'; f.morale = clamp((f.morale || 0) - 4, -10, 10); if (it.result) it.result.t += ' The overrun means sixth days after all; the crew remembers who promised.'; } return r; }; }
// morale lands in the film when it comes out
{ const _rl = release; release = function (f) {
  if (f && f.promises) for (const p of f.promises.filter(p => !p.done)) { p.done = 'kept'; if (P(p.who) && S.me && f.co === S.me.company) addTie(ME(), P(p.who), 3); }   // promises nobody had to test were kept
  if (f && f.morale && !f.moraleIn) { f.moraleIn = 1; f.qBonus = (f.qBonus || 0) + f.morale * .3; (f.events = f.events || []).push({ w: S.week, t: `A ${f.morale > 0 ? 'happy' : 'miserable'} set (morale ${f.morale > 0 ? '+' : ''}${f.morale}) ${f.morale > 0 ? 'shows on screen' : 'shows too'}.`, q: f.morale * .3 }); } return _rl.apply(this, arguments); }; }
