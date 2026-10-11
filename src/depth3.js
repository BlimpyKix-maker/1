// ---------------- Convictions, junkets, post-mortems and a scrapbook ----------------
//  · Convictions. Mentors and hard weeks hand you beliefs about the work ("fix it in post", "never work with friends",
//    "prep is everything"). Take one to heart and it costs you a little while you internalise it (eight weeks), then
//    it's part of you for good: advantage on the rolls it sharpens, disadvantage on the ones it blinds you to. You
//    have room for two, and one more for every two levels; to take a new one when you're full, you let an old one go.
//  · The junket. When a film you made or star in opens, the press wants you: one question, live. Charm, candour or
//    deflection, and a Charisma or Composure roll.
//  · Post-mortems. Every film your company releases is set against what the desk forecast, and you write down the
//    reason it beat or missed. Each one teaches you a little about selling films. They're on the Forecast tab.
//  · The scrapbook: your milestones as photographs, film by film, year by year.
const BELIEFS = {
  fixpost: ['Fix it in post', ['rhythm', 'shape'], ['setm'], 'Anything can be saved in the cutting room. (Advantage: rhythm, shaping a cut. Disadvantage: running a set.)'],
  friends: ['Never work with friends', ['com'], ['col'], 'Business is business. (Advantage: composure. Disadvantage: collaboration.)'],
  prototype: ['Every film is a prototype', ['orig'], ['bud'], 'Never make the same film twice. (Advantage: originality. Disadvantage: budgeting.)'],
  audience: ['The audience is never wrong', ['mkt'], ['orig'], 'If they didn\'t come, you didn\'t make it for them. (Advantage: marketing. Disadvantage: originality.)'],
  actors: ['Protect the actors, always', ['dact', 'cha'], ['bud'], 'The performance is the film. (Advantage: directing actors, charisma. Disadvantage: budgeting.)'],
  fuel: ['Money is just fuel', ['pack', 'fin'], ['tas'], 'Spend it to make the thing. (Advantage: packaging, finance. Disadvantage: taste.)'],
  prep: ['Prep is everything', ['setm', 'stag'], ['impro'], 'The day goes how the plan goes. (Advantage: set management, staging. Disadvantage: improvisation.)'],
  instinct: ['Trust your first instinct', ['impro', 'vis'], ['struc'], 'The first idea is the true one. (Advantage: improvisation, vision. Disadvantage: structure.)'],
  everyjob: ['Learn every job on the set', ['col'], ['pack'], 'Respect is knowing what the grip does. (Advantage: collaboration. Disadvantage: packaging.)'],
  sayyes: ['Say yes to everything for ten years', ['eth'], ['com'], 'Work begets work. (Advantage: work ethic. Disadvantage: composure.)']
};
function beliefsOf() { return (S.me.beliefs = S.me.beliefs || []); }
function beliefSlots() { return Math.min(5, 2 + Math.floor(careerLevel() / 2)); }
{ const _co = conditionsOf; conditionsOf = function () {
  const C = _co(), M = S.me; if (!M || !M.party || !M.party.done) return C;
  for (const b of beliefsOf()) { const B = BELIEFS[b.k]; if (!B) continue; const set = S.week >= b.set;
    C.push(set ? { k: 'bel_' + b.k, label: `💭 "${B[0]}"`, adv: B[1], dis: B[2], d: `A conviction. ${B[3]}` } : { k: 'bel_' + b.k, label: `💭 Taking in "${B[0]}"`, dis: B[1], d: `You're still making this belief your own, and it gets in the way for now: disadvantage on ${B[1].join(' and ')} until ${fmtDate(b.set, true)}.` }); }
  return C; }; }
function beliefOffer() {
  const M = S.me, have = new Set(beliefsOf().map(b => b.k)), L = Object.keys(BELIEFS).filter(k => !have.has(k)); if (!L.length) return;
  const k = L[Math.floor(prnd() * L.length)], B = BELIEFS[k], from = typeof lateWho === 'function' ? lateWho(prnd() < .5 ? 'friend' : 'known') : null, full = beliefsOf().length >= beliefSlots();
  const ch = full ? beliefsOf().map(b => ({ k: 'bel_swap_' + b.k, label: `Take it, and let go of "${BELIEFS[b.k][0]}"` })) : [{ k: 'bel_take', label: 'Take it to heart' }];
  inbox('belief', `"${B[0]}"`, `${from !== null && from !== undefined ? `${P(from).name} says it over a late dinner` : 'You hear it from someone who has been doing this for forty years'}: "${B[0].toLowerCase()}." ${B[3]} It would take a couple of months to really believe it.${full ? ` You already hold ${beliefsOf().length} convictions, all you have room for at your level.` : ''}`, { bel: k, person: from, choices: ch.concat([{ k: 'bel_no', label: 'Nod, and forget it' }]) });
}
function beliefPick(it, k) {
  if (it.kind !== 'belief') return false; it.done = true; const M = S.me, B = BELIEFS[it.bel];
  if (k === 'bel_no' || !B) { it.result = { t: 'You nod. It doesn\'t stick.' }; return true; }
  if (k.startsWith('bel_swap_')) { const old = k.slice(9); M.beliefs = beliefsOf().filter(b => b.k !== old); diary(`You stop believing "${BELIEFS[old][0].toLowerCase()}". It feels like moving out.`); }
  if (beliefsOf().length >= beliefSlots()) { it.result = { t: 'There isn\'t room in you for another conviction right now.' }; return true; }
  beliefsOf().push({ k: it.bel, w: S.week, set: S.week + 8 }); it.result = { t: `"${B[0]}." You write it on a card and pin it above your desk.` }; return true;
}
// ---- the junket ----
const OUTLETS2 = [['The Daily Slate', 'trade'], ['Silver Screen Weekly', 'fan'], ['The Spotlight', 'tabloid'], ['Cinéaste Review', 'highbrow'], ['Morning Television', 'tv']];
function junketQ(f) { const r = prnd(), lead = (f.cast || []).find(id => P(id) && id !== ME().id);
  return r < .3 ? [`There are reports of a fight on set. Is it true?`, 'feud', lead] : r < .55 ? [`The film went over budget, by most accounts. What happened?`, 'budget', null] : r < .8 ? [`What do you want audiences to take away from ${f.title}?`, 'meaning', null] : [`${lead !== undefined && P(lead) ? P(lead).name : 'Your lead'} is getting talked about for awards. Fair?`, 'praise', lead]; }
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); const M = S.me; if (!M || !f || !M.party || !M.party.done || f.junket) return out; const me = ME();
  const mine = (M.company !== undefined && f.co === M.company) || f.dir === me.id || (f.cast || [])[0] === me.id; if (!mine || (me.fame || 0) < 3 && me.standing < 20) return out; f.junket = 1;
  const [q, k, who] = junketQ(f), O = OUTLETS2[Math.floor(prnd() * OUTLETS2.length)];
  inbox('junket', `${O[0]} on ${f.title}`, `The junket for ${f.title}: twelve interviews, four minutes each. ${O[0]} asks: "${q}"`, { film: f.id, jq: k, who, outlet: O[0], choices: [{ k: 'j_charm', label: `Charm them · ${checkLabel('cha', 12)}`, check: ['cha', 12] }, { k: 'j_candid', label: `Answer candidly · ${checkLabel('com', 13)}`, check: ['com', 13] }, { k: 'j_deflect', label: 'Deflect, politely' }] });
  // and the film's lessons
  if (M.company !== undefined && f.co === M.company && typeof fcRun === 'function') { const R = fcRun({ id: f.id, m: f.m, genre: f.genre, tier: f.tier || 3, budget: f.budget, asOf: f.rel }), x = f.total / Math.max(.01, R.mid);
    const why = x >= 1.5 ? ((f.reviews || 0) >= 70 ? 'the reviews: word of mouth carried it' : (f.hook || 50) >= 65 ? 'the hook: it sold itself' : (P(f.cast[0]) && (P(f.cast[0]).fame || 0) >= 50) ? 'the star' : 'timing and luck, mostly; don\'t bank on it twice')
      : x <= .67 ? ((f.reviews || 50) < 45 ? 'the reviews: nothing survives bad word of mouth' : (f.hook || 50) < 40 ? 'a hard sell: nobody knew what it was from the poster' : 'the date and the competition that week') : 'nothing in particular: the desk was right';
    (M.lessons = M.lessons || []).push({ w: S.week, f: f.id, x: Math.round(x * 100) / 100, t: `${f.title}: ${x >= 1.5 ? `beat the desk ×${x.toFixed(1)}` : x <= .67 ? `missed the desk (×${x.toFixed(2)})` : 'landed near the desk'}. Why: ${why}.` });
    growSub(me, 'mkt', .12); growSub(me, 'dist', .08); }
  return out; }; }
function junketPick(it, k) {
  if (it.kind !== 'junket') return false; it.done = true; const M = S.me, me = ME(), f = S.films[it.film], who = it.who;
  if (k === 'j_deflect') { it.result = { t: 'You talk about the weather in the film. They print a nice paragraph nobody reads.' }; return true; }
  const ok = k === 'j_charm' ? roll('cha', 12) : roll('com', 13), r = M.lastRoll;
  if (k === 'j_charm') { if (ok) { me.fame = (me.fame || 0) + .6; it.result = { ok, roll: r, t: `The clip goes round: you, laughing, saying the right thing. ${it.outlet} calls you "the most likeable person in the business this week".` }; } else { it.result = { ok, roll: r, t: 'You try a joke. It reads badly in print.' }; me.standing = clamp(me.standing - .3, 0, 100); } return true; }
  if (ok) { me.standing = clamp(me.standing + .6, 0, 100); if (who !== null && who !== undefined && P(who)) { addTie(me, P(who), it.jq === 'feud' ? 3 : 5); if (typeof remember === 'function') remember(who, 3, 'Spoke well of them in the press'); } it.result = { ok, roll: r, t: it.jq === 'feud' ? 'You tell the truth, kindly. The story dies because there\'s nothing left to dig up.' : it.jq === 'budget' ? 'You explain exactly where the money went. Producers quote you for years.' : 'You say something true about the work. The interview is the one people share.' }; }
  else { me.fame = (me.fame || 0) + .4; me.standing = clamp(me.standing - .6, 0, 100); if (who !== null && who !== undefined && P(who) && it.jq === 'feud') { addTie(me, P(who), -6); if (typeof remember === 'function') remember(who, -4, 'Said too much to the press'); } it.result = { ok, roll: r, t: 'Too candid. The headline is a quote you\'d give anything to have back.' }; }
  return true;
}
// lessons on the Forecast tab
{ const _fh = fcHTML; fcHTML = function () { const h = _fh(), L = (S.me.lessons || []).slice(-8).reverse(); if (!L.length) return h; return h.replace(/<\/div>$/, '') + `<section class="tk-p tk-wide"><h4>YOUR POST-MORTEMS <span class="tk-sub">every film your company released, against the desk</span></h4><ul class="plain small">${L.map(l => `<li><span class="tk-mut">${esc(fmtDate(l.w, true))}</span> ${esc(l.t)}</li>`).join('')}</ul></section></div>`; }; }
function depth3Week() { const M = S.me; if (!M || !M.party || !M.party.done) return; if (!pending().some(it => it.kind === 'belief') && (!M.belW || S.week - M.belW >= 26) && prnd() < .06) { M.belW = S.week; beliefOffer(); } }
// ---- the scrapbook ----
const SCRAP_IC = { work: '🎬', love: '❤️', life: '🌱', money: '💵', prize: '🏆', awards: '🏆', fame: '⭐' };
function scrapHTML() {
  const M = S.me, L = (M.milestones || []).slice().reverse(); if (!L.length) return '<p class="muted">Nothing yet. The first page is waiting.</p>';
  const by = {}; for (const m of L) (by[yearOf(m.w)] = by[yearOf(m.w)] || []).push(m);
  const filmFor = m => { const T = m.t; return S.films.length && (ME().credits || []).map(id => S.films[id]).find(f => f && T.includes(f.title)) || null; };
  return Object.entries(by).sort((a, b) => b[0] - a[0]).map(([y, ms]) => `<h4 class="scrap-y">${y}</h4><div class="scrap">${ms.slice(0, 24).map((m, i) => { const f = filmFor(m), rot = ((m.w * 7 + i * 13) % 7) - 3;
    return `<figure class="scrap-p" style="transform:rotate(${rot}deg)">${f && typeof stillSVG === 'function' ? `<div class="scrap-i">${stillSVG(f, m.w % 6, 180)}</div>` : `<div class="scrap-i scrap-e scrap-${m.kind || 'life'}"><span>${SCRAP_IC[m.kind] || '📌'}</span></div>`}<figcaption><b>${esc(fmtDate(m.w, true))}</b> ${esc(m.t)}</figcaption></figure>`; }).join('')}</div>`).join('');
}
OS_EXTRA.scrapbook = ['📔', 'Scrapbook', 'Your milestones, as photographs'];
OS_VIEWS.scrapbook = () => scrapHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'You'); if (g && !g[1].includes('scrapbook')) g[1].push('scrapbook'); }
