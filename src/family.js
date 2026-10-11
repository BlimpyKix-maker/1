// ---------------- Family: marriage, children, and the family name ----------------
// A partner can become a spouse (a proposal, then a wedding that's as big as you can pay for). Children change
// the weeks: they cost money, they cost sleep while they're small, and they take the edge off everything else.
// They have moments of their own (a school play on a shoot day, wanting to be in your film, a teenage verdict on
// your work), and around eleven you see what they're into. At eighteen a child who loves film or music enters the
// business as a person in the world, with your name and your contacts behind them (and the press ready to say so);
// the others go their own way. When you retire, you can play on as one of them: they inherit what's left after
// estate tax, the family company if there is one, and a famous name, which opens doors and invites a backlash.
const FAM_FOCUS = { film: ['Film', 'They make films on your phone and storyboard the dog.'], music: ['Music', 'There is always an instrument being played badly, and then well.'], science: ['Science', 'Volcanoes, then space, then chemistry sets that worry the neighbours.'], sport: ['Sport', 'Training at six, matches every weekend, a trophy shelf of their own.'], books: ['Books', 'Torch under the duvet, three library cards.'] };
function famKids() { return (S.me.kids = S.me.kids || []); }
function famSpouse() { const id = S.me.spouse; return id !== undefined && id !== null && P(id) && !P(id).dead && partnerOf() === id ? id : null; }
function kidAge(k) { return (S.week - k.born) / 52; }
function famSurname() { const n = ME().name.trim().split(/\s+/), hub = S.me.hub; return typeof EAST !== 'undefined' && EAST[HUBS[hub].lang] ? n[0] : n[n.length - 1]; }
function famName(g) { const N = (typeof NAMES !== 'undefined' && (NAMES[HUBS[S.me.hub].lang] || NAMES.en)) || { M: ['Sam'], F: ['Alex'] }, L0 = g === 'X' ? N.M.concat(N.F) : N[g] || N.M, taken = new Set([ME().name].concat(famKids().map(k => k.name)).flatMap(n => n.split(/\s+/))), L = L0.filter(x => !taken.has(x)).length ? L0.filter(x => !taken.has(x)) : L0, f = L[Math.floor(prnd() * L.length)], s = famSurname();   // not your own name, nor a brother's or sister's
  return typeof EAST !== 'undefined' && EAST[HUBS[S.me.hub].lang] ? `${s} ${f}` : `${f} ${s}`; }
function famBirth(adopt) {
  const M = S.me, g = ['F', 'M', 'X'][Math.floor(prnd() * 2.1)], k = { name: famName(g), g, born: S.week - (adopt ? Math.round(52 * (1 + prnd() * 4)) : 0), other: famSpouse(), adopted: adopt ? 1 : 0 };
  famKids().push(k); M.stress = clamp(M.stress + 6, 0, 100); milestone(`${adopt ? 'Adopted' : 'Became a parent to'} ${k.name.split(' ')[0]}`, 'love');
  diary(adopt ? `${k.name.split(' ')[0]} comes home with you, ${Math.round(kidAge(k))} years old, holding a backpack with everything they own.` : `${k.name.split(' ')[0]} is born. You hold them and forget, for a whole day, that you work in film.`);
  return k;
}
LATE.push(
  { id: 'fam_propose', pool: 'family', cool: 26, need: () => { const pid = partnerOf(); return pid !== null && S.me.spouse !== pid && S.me.cohab === pid && ageOf(ME()) >= 21 && (ME().ties[pid] || 0) >= 50; }, mk: c => { c.who = partnerOf(); }, title: 'A question', text: c => `A quiet night in. ${lname(c.who)} is reading; you're pretending to. You've been together long enough that the question has been in the room for months.`,
    opts: [
      { k: 'ask', label: c => `Ask ${lname(c.who).split(' ')[0]} to marry you`, check: ['cha', 8], go: (c, ok) => { if (ok) { S.me.spouse = c.who; S.me.wedPending = 1; lateFx({ stress: -10, tie: 10, mile: `Engaged to ${lname(c.who)}` }, c); return 'Yes. Then laughing, then phoning everyone. A wedding to plan.'; } lateFx({ stress: 6, tie: -2 }, c); return '"Not yet," gently. It isn\'t a no. It is a long week.'; } },
      { k: 'wait', label: () => 'Not yet', go: c => 'You let the moment pass. It will come round again.' }] },
  { id: 'fam_wedding', pool: 'family', once: 1, need: () => S.me.wedPending && famSpouse() !== null, mk: c => { c.who = famSpouse(); }, title: 'The wedding', text: c => `You and ${lname(c.who)} have a date. The question is how big.`,
    opts: [
      { k: 'big', label: () => 'A big wedding: everyone you know', cost: () => usd(30000), go: c => { S.me.wedPending = 0; lateFx({ stand: 1, stress: 8, tie: 12, meet: 'known', mile: `Married ${lname(c.who)}` }, c); for (const id of Object.keys(S.me.known).map(Number).filter(id => P(id) && !P(id).dead && opinion(id) > 15).slice(0, 8)) addTie(ME(), P(id), 3); return 'Three hundred people, one band, a speech that makes your oldest friend cry. Half your contacts were there; all of them heard about it.'; } },
      { k: 'small', label: () => 'A small one: family and close friends', cost: () => usd(6000), go: c => { S.me.wedPending = 0; lateFx({ stress: -6, tie: 14, mile: `Married ${lname(c.who)}` }, c); return 'Forty people in a garden. The best day either of you can remember.'; } },
      { k: 'elope', label: () => 'Elope', go: c => { S.me.wedPending = 0; lateFx({ stress: -10, tie: 16, mile: `Eloped with ${lname(c.who)}` }, c); return 'A registry office on a Tuesday, two strangers as witnesses, chips on the way home.'; } }] },
  { id: 'fam_kids', pool: 'family', cool: 104, need: () => (famSpouse() !== null || (partnerOf() !== null && S.me.cohab === partnerOf())) && ageOf(ME()) >= 24 && ageOf(ME()) <= 48 && famKids().length < 3 && !S.me.babyDue, mk: c => { c.who = partnerOf(); }, title: 'Talking about children', text: c => `${lname(c.who)} asks, carefully, whether you've thought about children. With your hours, your money and your career, there is no good time. People do it anyway.`,
    opts: [
      { k: 'try', label: () => 'Yes. Let\'s try', go: c => { const p = clamp(.9 - Math.max(0, ageOf(ME()) - 34) * .05, .3, .9); if (prnd() < p) { S.me.babyDue = S.week + 30 + Math.floor(prnd() * 12); return 'Months later, two lines on a test. You both sit on the bathroom floor and laugh.'; } return 'It doesn\'t happen, not this year. You\'re gentle with each other about it.'; } },
      { k: 'adopt', label: () => 'Adopt', cost: () => usd(8000), go: c => { famBirth(true); lateFx({ tie: 6 }, c); return 'Forms, interviews, a home visit, and then one afternoon a small person in your doorway.'; } },
      { k: 'notnow', label: () => 'Not now', go: c => { lateFx({ tie: -2 }, c); return 'Not now. You both know that\'s an answer that has to be given again.'; } }] },
  { id: 'fam_play', pool: 'family', cool: 52, need: () => famKids().some(k => kidAge(k) >= 5 && kidAge(k) < 12) && S.me.jobs.length > 0, mk: c => { const L = famKids().filter(k => kidAge(k) >= 5 && kidAge(k) < 12); c.kid = famKids().indexOf(L[Math.floor(prnd() * L.length)]); }, title: 'The school play', text: c => `${famKids()[c.kid].name.split(' ')[0]} is a tree in the school play on Thursday afternoon. It's a shoot day.`,
    opts: [
      { k: 'go', label: () => 'Leave set early and go', check: ['cha', 12], go: (c, ok) => { lateFx(ok ? { stress: -8 } : { stress: -6, stand: -1 }); famKids()[c.kid].bond = (famKids()[c.kid].bond || 0) + 2; return ok ? 'The first AD covers for you. The tree is magnificent.' : 'You make it, and the producer makes a point of mentioning it on Friday. The tree was worth it.'; } },
      { k: 'work', label: () => 'Stay on set and watch the video later', go: c => { lateFx({ stress: 6 }); famKids()[c.kid].bond = (famKids()[c.kid].bond || 0) - 1; return 'The video is shaky. You watch it four times in your trailer.'; } }] },
  { id: 'fam_focus', pool: 'family', once: 0, cool: 1, need: () => famKids().some(k => kidAge(k) >= 11 && !k.focus), mk: c => { c.kid = famKids().findIndex(k => kidAge(k) >= 11 && !k.focus); }, title: 'What are they into?', text: c => `${famKids()[c.kid].name.split(' ')[0]} is eleven, and has opinions. Where do you nudge them?`,
    opts: Object.entries(FAM_FOCUS).map(([k, [l]]) => ({ k, label: () => k === 'film' ? 'Film, like you (a camera for their birthday)' : `${l}`, go: c => { const K = famKids()[c.kid]; K.focus = k; return `${FAM_FOCUS[k][1]}`; } })) },
  { id: 'fam_cast', pool: 'family', cool: 104, need: () => famKids().some(k => kidAge(k) >= 7 && kidAge(k) < 17) && typeof myCo === 'function' && myCo() && myCo().films.some(i => S.films[i] && S.films[i].stage >= 0 && S.films[i].stage <= 2), mk: c => { const L = famKids().filter(k => kidAge(k) >= 7 && kidAge(k) < 17); c.kid = famKids().indexOf(L[0]); }, title: 'They want to be in your film', text: c => `${famKids()[c.kid].name.split(' ')[0]} has read your script and wants the part of the kid. They're not bad, either.`,
    opts: [
      { k: 'cast', label: () => 'Cast them', go: c => { const K = famKids()[c.kid]; K.fame = (K.fame || 0) + 2; K.bond = (K.bond || 0) + 2; lateFx({ stand: -1, stress: 3 }); return 'They\'re good. The trades are less kind about it than the audience: the word "nepotism" appears in every review.'; } },
      { k: 'no', label: () => 'Tell them to earn it like everyone else', go: c => { famKids()[c.kid].bond = (famKids()[c.kid].bond || 0) - 1; return 'They sulk for a week, then sign up for the drama club. Fair enough.'; } }] }
);
for (const t of LATE) LATE_BY[t.id] = t;
function famWeek() {
  const M = S.me, me = ME(); if (!M) return;
  if (M.babyDue && S.week >= M.babyDue) { delete M.babyDue; famBirth(false); }
  { const sp = famSpouse(); if (sp !== null && M.cohab === sp && M.rel && M.rel[sp]) { M.rel[sp].last = S.week; if (M.known[sp]) M.known[sp].seen = S.week; } }   // married and under one roof: you see each other every day
  const K = famKids();
  for (const k of K) { if (k.out) continue; const a = kidAge(k);
    M.cash -= usd(a < 5 ? 250 : a < 18 ? 150 : 0); if (a < 3) M.energy = clamp(M.energy - 3, 0, 100); if (a < 18) M.stress = clamp(M.stress - 1, 0, 100);
    if (a >= 18 && !k.grown) { k.grown = S.week;
      if (['film', 'music'].includes(k.focus) || (k.fame || 0) >= 2) { const role = k.focus === 'music' ? 'composer' : ['director', 'writer', 'actor'][Math.floor(prnd() * 3)], q = makePerson(M.hub, role, { young: true });
        q.name = k.name; q.g = k.g; q.born = S.year - 18; q.debut = S.week; q.standing = clamp(q.standing + me.standing * .15, 0, 100); q.fame = (q.fame || 0) + (k.fame || 0) + (me.fame || 0) * .1; k.pid = q.id;
        meet(q.id, 'Your child', 40); addTie(me, q, 50 + (k.bond || 0) * 3); news('People', `${me.name}'s child ${k.name} starts out as a ${(ROLE_LABEL[role] || role).toLowerCase()}. The surname opens doors; the trades are already sharpening their knives.`); diary(`${k.name.split(' ')[0]} leaves home to try the business. You give them three phone numbers and one piece of advice they won't take.`); }
      else { k.out = 1; diary(`${k.name.split(' ')[0]} leaves for university, ${({ science: 'to study physics', sport: 'on a sports scholarship', books: 'to read literature', music: 'to study music', film: 'to study film' })[k.focus] || 'to find out what they want'}. The house is too quiet.`); } } }
  if (!pending().some(it => it.kind === 'late') && prnd() < .06) lateOffer('family');
}
// ---- the family name: after you retire, play on as one of your children ----
function famHeirs() { const K = (S.me && S.me.kids) || []; return K.map((k, i) => [k, i]).filter(([k]) => !k.pid && kidAge(k) >= 16 && kidAge(k) <= 45); }
function famEstate() { const nw = typeof osNetWorth === 'function' ? osNetWorth().total : S.me.cash, ex = usd(1000000), tax = S.year < 1916 ? 0 : .4; return Math.max(0, nw <= ex ? nw : ex + (nw - ex) * (1 - tax)); }
{ const _ng = nextGenAct; nextGenAct = function () {
  const M = S.me, keep = M ? { kids: (M.kids || []).map(k => Object.assign({}, k)), estate: famEstate(), company: M.company, role: ME().role, hub: M.hub, look: Object.assign({}, M.look || {}), fame: ME().fame || 0, standing: ME().standing, love: (M.love || []).slice(), surname: famSurname() } : null;
  const ok = _ng(); if (ok && keep && S.legacy && S.legacy.length) S.legacy[S.legacy.length - 1].fam = keep; return ok; }; }
function heirAct(a) {
  const L = S.legacy && S.legacy[S.legacy.length - 1], F = L && L.fam; if (S.me || !F) return false; const k = F.kids[a.i]; if (!k || k.pid || k.played) return false;
  const age = clamp(Math.round((S.week - k.born) / 52), 18, 45), n = Math.max(1, F.kids.filter(x => !x.pid).length), share = F.estate / n, c = Object.assign(ccDefaults(), { name: k.name, g: k.g, age, hub: F.hub, role: F.role, dream: F.role, wealth: share >= usd(200000, F.hub) ? 'trust' : share >= usd(20000, F.hub) ? 'comfortable' : 'gettingby', look: Object.assign(defaultLook(), { skin: F.look.skin || 0, hairColor: F.look.hairColor || 0, eyes: F.look.eyes || 0, face: F.look.face || 0 }), love: F.love, salt: a.salt });
  if (!ORIGIN.wealth[c.wealth]) c.wealth = 'gettingby';
  startCareer(c); if (typeof legacyGreet === 'function') legacyGreet(); k.played = 1;
  const M = S.me, me = ME(); M.cash += Math.round(share); M.heir = { of: L.id, w: S.week }; me.fame = Math.max(me.fame || 0, F.fame * .15); me.standing = clamp(me.standing + F.standing * .1, 0, 100);
  const co = F.company !== undefined && S.companies[F.company] && S.companies[F.company].closed === null ? S.companies[F.company] : null; if (co) { M.company = co.id; co.owner = me.id; }
  for (const x of F.kids) if (x !== k && x.pid !== undefined && P(x.pid) && !P(x.pid).dead) { meet(x.pid, 'Your sibling', 30); addTie(me, P(x.pid), 40); }   // brothers and sisters already in the business
  diary(`You inherit ${fmtCash(Math.round(share))}${co ? ` and ${co.name}` : ''}, a famous surname, and a phone full of people who knew your parent.`); milestone(`Took over the family name${co ? ` and ${co.name}` : ''}`, 'life');
  return true;
}
// the name opens doors for a while, and the trades never quite let it go
{ const _hf = hireFactors; hireFactors = function (post) { const F = _hf(post); const H = S.me && S.me.heir; if (H && S.week - H.w < 156) F.push(['A famous family name', .5 * (1 - (S.week - H.w) / 156)]); return F; }; }
LATE.push({ id: 'fam_nepo', pool: 'family', once: 1, need: () => S.me.heir && S.week - S.me.heir.w > 8 && S.week - S.me.heir.w < 104, title: 'Nepo baby', text: () => 'A trade columnist runs a list of "industry kids who got the job because of their surname". You\'re fourth. There is a photograph.',
  opts: [
    { k: 'own', label: () => 'Own it, with a joke', check: ['cha', 13], go: (c, ok) => { lateFx(ok ? { fame: 3, stand: 1 } : { stand: -2, stress: 8 }); return ok ? 'You post the list with "only fourth?". It goes further than the column did.' : 'The joke lands badly. A second column runs about the first.'; } },
    { k: 'work', label: () => 'Say nothing and outwork them', go: c => { lateFx({ stress: 6, xp: { [Object.keys(CRAFTS[MAIN[ME().role]].subs)[0]]: .3 } }); return 'You stop reading the trades for a month and work twice as hard. It shows.'; } }] });
LATE_BY.fam_nepo = LATE[LATE.length - 1];
// the epilogue: play on as family
{ const _ep = typeof epilogueHTML === 'function' ? epilogueHTML : null; if (_ep) epilogueHTML = function () {
  const h = _ep(), H = famHeirs(); if (!H.length) return h;
  const M = S.me, n = Math.max(1, famKids().filter(x => !x.pid).length), est = famEstate(), co = M.company !== undefined && S.companies[M.company] && S.companies[M.company].closed === null ? S.companies[M.company] : null;
  const what = `<p class="small">Whoever plays on inherits ${fmtCash(Math.round(est / n))} (your estate of ${fmtCash(Math.round(est))}${S.year < 1916 ? '' : ', after 40% tax above the first ' + fmtCash(usd(1000000))}, split ${n} way${n > 1 ? 's' : ''})${co ? `, ${esc(co.name)}` : ''}${M.cin ? `, ${esc(M.cin.name)}` : ''}, and a surname that opens doors for about three years.</p>`;
  return h.replace('<button class="btn primary" data-nextgen="1">', `${what}${H.map(([k, i]) => `<button class="btn primary" data-heir="${i}">Play on as ${esc(k.name)} (${Math.round(kidAge(k))})</button> `).join('')}<button class="btn primary" data-nextgen="1">`);
}; }
function heirClick(t) { const d = t.dataset && t.dataset.heir; if (d === undefined) return false; doAct({ t: 'nextgen' }); doAct({ t: 'heir', i: +d, salt: Math.floor(Math.random() * 1e9) }); if (S.me && typeof partyAuto === 'function' && !S.me.party) {} UI.dtab = 'today'; UI.tab = 'you'; UI.stack = []; render(); return true; }
// family on the Life tab
function famHTML() {
  const M = S.me, K = famKids(), sp = famSpouse(); if (!K.length && sp === null) return '';
  return `<section class="panel"><h3>Family</h3>${sp !== null ? `<p>Married to ${pl(sp)}.</p>` : ''}${K.length ? `<ul class="plain">${K.map(k => `<li><b>${esc(k.name)}</b> <span class="muted">${Math.floor(kidAge(k))}${k.adopted ? ', adopted' : ''}${k.focus ? ' · into ' + FAM_FOCUS[k.focus][0].toLowerCase() : ''}${k.pid !== undefined ? ' · in the business' : k.out ? ' · gone their own way' : ''}</span>${k.pid !== undefined ? ` ${pl(k.pid)}` : ''}</li>`).join('')}</ul><p class="small muted">Children cost about ${fmtCash(usd(250))} a week while small and ${fmtCash(usd(150))} at school; the little ones cost sleep too.</p>` : ''}</section>`;
}
{ const _lv = OS_VIEWS.life; if (_lv) OS_VIEWS.life = () => famHTML() + _lv(); }
