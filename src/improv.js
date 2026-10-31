// ---------------- Improv: the scene, from the first class to the theatre you own ----------------
// Improv had almost no presence: an evening class, a $750 bundle and three contests. Now every city with a scene has
// its theatres (a big training brand, a long-form shop, a short-form franchise, a nonprofit and an indie room), and
// there are three ways in, as in life (research in docs/RESEARCH.md, Round 20):
//  · performer: levels 1–5 at 8 weeks each ($175–$500 a level), weekly jams, house-team auditions twice a year
//    (about 400 hopefuls for a dozen spots), an indie team that rents the room, festivals at 3:40 a.m., corporate
//    "yes, and" workshops that pay the rent, cruise contracts, teaching, and the bridges out: a scout in row C, a
//    late-night sketch packet, a clip that escapes, a sketch-show cast offer;
//  · backer: open a theatre (classes are 60–80% of the money; rent, a January tax bill, a pay policy that decides
//    whether the cast writes an open letter), fund a scholarship, produce indie nights;
//  · fan: go to shows, become a regular, then a superfan who knows every team; most fans end up taking a class.
// Money passes through usd(); decisions use your dice; the theatres are hashed per city so every world has the same.
const IMP_KINDS = { big: ['training brand', 450, 'The city\'s big training theatre: five levels, a conservatory, house teams on the main stage, scouts on Thursdays.'],
  long: ['long-form shop', 350, 'Long-form purists: the forty-minute set, slow scenes, deep listening.'], short: ['short-form franchise', 250, 'Games, suggestions and a referee: family audiences, school tours, corporate bookings.'],
  nonprofit: ['nonprofit theatre', 200, 'Cheaper classes, a scholarship fund, and a board that worries about the rent.'], indie: ['indie room', 0, 'A black box above a bar. You rent it by the night.'] };
const IMP_A = ['Lantern', 'Back Row', 'Brick', 'Kettle', 'Upstairs', 'Common Ground', 'Night Owl', 'Rookery', 'Foundry', 'Velvet', 'Tin Roof', 'Little Room', 'Junction', 'Paper Moon'];
const IMP_B = ['Improv', 'Comedy Theatre', 'Playhouse', 'Box', 'Collective', 'Laboratory', 'Stage', 'Comedy Club'];
function impTheatres(hub) {
  const A = archive(); A.impT = A.impT || {}; if (A.impT[hub]) return A.impT[hub];
  const r = hashRand(HUB_IDS.indexOf(hub) * 131 + 17), H = HUBS[hub], big = hubProd(hub, S.year) > 12, out = [], used = new Set();
  const name = () => { let n; do n = `The ${IMP_A[Math.floor(r() * IMP_A.length)]} ${IMP_B[Math.floor(r() * IMP_B.length)]}`; while (used.has(n)); used.add(n); return n; };
  for (const k of big ? ['big', 'long', 'short', 'nonprofit', 'indie'] : ['long', 'short', 'indie']) out.push({ k, name: name(), price: IMP_KINDS[k][1], pays: r() < .2, from: k === 'short' ? 1985 : k === 'big' ? 1959 : 1975 });
  return A.impT[hub] = out.filter(t => t.from <= S.year);
}
function imp() { return S.me.imp = S.me.imp || { lvl: 0, scene: 0, aud: 0, fans: 0, reg: 0, sup: 0, corpY: {}, shows: 0 }; }
function impOn() { const M = S.me; return !!(M && (M.imp || M.dream === 'improv' || M.dream === 'sketch')); }
// scene people: young actors and writers in the city
function impPeers(n) { const M = S.me, L = S.people.filter(p => !p.dead && !p.retired && !p.player && !p.ind && p.hub === M.hub && (p.role === 'actor' || p.role === 'writer') && S.year - p.born < 40); const out = []; for (let i = 0; i < n && L.length; i++) out.push(L.splice(Math.floor(prnd() * L.length), 1)[0]); return out; }

// ---- dreams ----
if (typeof DREAMS !== 'undefined') {
  if (!DREAMS.some(d => d.k === 'improv')) DREAMS.push({ k: 'improv', label: 'Improviser', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events)/, /\b(improv\w*|sketch|ensemble|house team|comedy theat\w*)\b/i], first: 'play' });
  if (!DREAMS.some(d => d.k === 'sketch')) DREAMS.push({ k: 'sketch', label: 'Sketch comedian', role: 'writer', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events)/, /\b(sketch|comed\w*|late-night|writer)\b/i], first: 'play' });
}
if (typeof DREAM_GIGS !== 'undefined') { DREAM_GIGS.improv = ['club', 'taping', 'multicam', 'spot', 'webser']; DREAM_GIGS.sketch = ['club', 'webser', 'multicam', 'taping']; }

// ---- the actions (logged, so replays agree) ----
ACT_HOOKS.imp = a => {
  const M = S.me, me = ME(), I = imp(), T = impTheatres(M.hub);
  switch (a.k) {
    case 'enrol': { const t = T.find(x => x.k === a.th && x.price); if (!t || I.cls || I.lvl >= 5) return false; const cost = usd(t.price); if (M.cash < cost) return false;
      M.cash -= cost; I.cls = { lvl: I.lvl + 1, wk: 0, th: t.k, name: t.name }; I.home = t.k; diary(`You sign up for Level ${I.lvl + 1} at ${t.name}: eight weeks, ${fmtCash(cost)}.`); return true; }
    case 'jams': I.jams = !I.jams; return true;
    case 'indie': { if (I.indie || I.lvl < 2) return false; const mates = Object.keys(M.known).map(Number).map(P).filter(p => p && !p.dead && p.hub === M.hub && (p.role === 'actor' || p.role === 'writer')).slice(0, 5).map(p => p.id);
      const peers = mates.length >= 3 ? mates : mates.concat(impPeers(3 - mates.length).map(p => (meet(p.id, 'Improv class', 5), p.id)));
      I.indie = { name: `${pickLine(['Big', 'Small', 'Loud', 'Polite', 'Midnight', 'Borrowed'], S.week)} ${pickLine(['Feelings', 'Spoons', 'Horses', 'Strangers', 'Weather', 'Chairs'], S.week + 3)}`, mates: peers, chem: 50, shows: 0, w: S.week };
      milestone(`Formed an indie improv team: ${I.indie.name}`, 'work'); return true; }
    case 'festival': { if (!(I.house || I.indie) || I.festY === S.year) return false; const fee = usd(30); M.cash -= fee; I.festY = S.year; I.festApp = S.week; diary(`You apply to the festival with ${I.house ? I.house.name : I.indie.name}. ${fmtCash(fee)} application fee.`); return true; }
    case 'teach': { if (!I.canTeach) return false; I.teach = clamp((I.teach || 0) + (a.n || 1), 0, 3); return true; }
    case 'own': { if (I.own) return false; const cost = usd(90000); if (M.cash < cost) return false; M.cash -= cost; I.own = { name: `The ${pickLine(IMP_A, S.week)} Improv Theatre`, cash: usd(20000), students: 24, price: 400, pay: 0, w: S.week, loyalty: 50 }; milestone(`Opened ${I.own.name}`, 'money'); return true; }
    case 'price': { if (!I.own) return false; I.own.price = clamp(I.own.price + (a.d || 0), 150, 900); return true; }
    case 'pay': { if (!I.own) return false; I.own.pay = clamp(a.v | 0, 0, 2); return true; }
    case 'donate': { const amt = usd(a.amt || 5000); if (M.cash < amt) return false; M.cash -= amt; I.patron = (I.patron || 0) + amt; me.standing = clamp(me.standing + amt / usd(5000) * .4, 0, 100); milestone(`Funded an improv scholarship (${fmtCash(amt)})`, 'money'); return true; }
    case 'watch': { const cost = usd(12); if (M.cash < cost) return false; M.cash -= cost; I.seen = (I.seen || 0) + 1; M.stress = clamp(M.stress - 2, 0, 100);
      const p = impPeers(1)[0]; if (p && prnd() < .4) meet(p.id, 'After an improv show', 4); if (I.seen === 10) { milestone('Became a regular at the improv theatre', 'life'); inbox('note', 'A regular', 'The box-office volunteer knows your name. You know every house team, their running jokes, and which nights to avoid. Half the people in the audience are students, and the other half will be by summer.'); } return true; }
  }
  return false;
};
CLICK_HOOKS.imp = v => { const [k, x] = v.split(':'); doAct(k === 'enrol' ? { t: 'imp', k, th: x } : k === 'price' ? { t: 'imp', k, d: +x } : k === 'pay' ? { t: 'imp', k, v: +x } : k === 'donate' ? { t: 'imp', k, amt: +x } : { t: 'imp', k }); render(); };

// ---- every week ----
function impWeek() {
  const M = S.me, me = ME(); if (!M || !M.party || !M.party.done || !M.imp) return; const I = M.imp;
  // class night
  if (I.cls) { const C = I.cls; C.wk++; growSub(me, 'impro', .06); growSub(me, 'comic', .02); if (C.wk === 2 || C.wk === 5) { const p = impPeers(1)[0]; if (p) meet(p.id, 'Improv class', 6); }
    if (C.lvl === 2 && C.wk === 4 && !I.click && roll('impro', 11)) { I.click = 1; growSub(me, 'impro', .2); inbox('note', 'The click', 'Halfway through a scene about two people waiting for a bus, you stop trying to be funny and just listen. The room roars. Your teacher says your name on the way out, which they have never done.'); }
    if (C.wk >= 8) { const repeat = C.th === 'big' && C.lvl >= 3 && !roll('impro', 9 + C.lvl); I.cls = null;
      if (repeat) inbox('note', `Level ${C.lvl}: again`, 'The teacher\'s note is kind and clear: take the level again. About a third of the class gets the same note. It stings anyway.');
      else { I.lvl = C.lvl; milestone(`Finished improv Level ${C.lvl}`, 'work'); if (I.lvl === 5) { I.grad = S.week; inbox('note', 'Level 5', 'You finish the program. A graduation show for friends and family, and then the question everyone asks: house team, indie team, or the next thing?'); } } } }
  // jams
  if (I.jams) { const x = prnd(); if (x < .1) { I.scene = clamp(I.scene + 2, 0, 100); const p = impPeers(1)[0]; if (p) meet(p.id, 'At a legendary jam', 10); inbox('note', 'The jam', `A Tuesday jam, one in the morning: a stranger, a famous alum and you build something nobody in the room will forget. ${p ? p.name + ' wants your number.' : ''}`); } else if (x < .25) M.stress = clamp(M.stress + 3, 0, 100); else growSub(me, 'impro', .025); }
  // house-team auditions, twice a year
  if (S.week % 26 === 10 && I.lvl >= 3 && !I.house && !pending().some(x => x.kind === 'impaud')) inbox('impaud', 'House-team auditions', `${(impTheatres(M.hub).find(t => t.k === 'big') || impTheatres(M.hub)[0] || {}).name || 'The theatre'} is auditioning for new house teams. About four hundred people for a dozen spots. Ten minutes, in groups of six, with people you've never met.`, { choices: [{ k: 'ia_go', label: 'Audition' }, { k: 'ia_skip', label: 'Not this time' }] });
  // a house team: a show a week, a scout now and then, a season of 26 weeks
  if (I.house) { const H = I.house, q = Math.round(skillOf(me, 'impro') * 4 + H.chem * .3 + pgauss() * 15); H.shows++; I.shows++; H.last = q;
    if (q > 75) I.scene = clamp(I.scene + 1, 0, 100); if (H.paid) { const pay = usd(q > 70 ? 150 : 75); M.cash += pay - taxOn(pay); }
    if (q >= 85 && prnd() < .05) impClip(q);
    if (S.week % 4 === 0 && prnd() < Math.max(0, q - 70) / 100) { inbox('impscout', 'A scout in row C', 'Someone from a sketch show\'s casting office was in tonight. Your team overplayed; you didn\'t. They want you to come in for a screen test.', { choices: [{ k: 'is_go', label: 'Go in' }, { k: 'is_no', label: 'Stay with the team' }] }); }
    if (S.week >= H.until) { if (prnd() < .25) { I.house = null; inbox('note', 'Cycled out', 'The email arrives at 11:58 p.m.: your team is being "cycled out" to make room for new voices. The coach says it isn\'t personal. It feels personal.'); } else { H.until = S.week + 26; H.season++; diary(`${H.name} gets another season.`); } } }
  // the indie team: a show a month, in a rented room
  if (I.indie && S.week % 4 === 1) { const D = I.indie, rent = usd(100 + prnd() * 200), crowd = Math.round(clamp(8 + I.fans * .1 + I.reg * .3 + pgauss() * 4, 3, 60)), door = crowd * usd(10), net = door - rent;
    M.cash += net; D.shows++; I.shows++; D.chem = clamp(D.chem + (prnd() - .45) * 4, 0, 100); const q = Math.round(skillOf(me, 'impro') * 4 + D.chem * .3 + pgauss() * 15);
    I.fans += Math.max(0, crowd - 8) * .1; if (q >= 80) I.reg += crowd * .02; if (q >= 85 && prnd() < .05) impClip(q);
    if (D.shows === 1 || D.shows % 6 === 0) inbox('note', `${D.name}: ${crowd} people`, `${crowd} people in a sixty-seat room. The door takes ${fmtCash(door)}; the room cost ${fmtCash(rent)}. ${net < 0 ? 'You split the difference between you, again.' : 'For once, everyone goes home with a little money.'}`); }
  // festivals: results six weeks after you apply
  if (I.festApp && S.week - I.festApp === 6) { I.festApp = null; const ok = prnd() < (I.house ? .45 : .3) + I.scene / 300;
    if (!ok) diary('The festival says no, politely. One team in three gets in.');
    else { const crowd = 50 + Math.floor(prnd() * 350); I.fans += crowd * .05; M.fol = M.fol || {}; M.fol.blip = (M.fol.blip || 0) + crowd * .005; milestone('Played an improv festival', 'work');
      inbox('note', 'Accepted', `You're in. Your slot is 3:40 a.m. on the Saturday, and ${crowd} people are still awake for it.${prnd() < .05 ? ' A manager finds you outside and asks who represents you.' : ''}`); } }
  // corporate work, teaching, cruise contracts
  if (skillOf(me, 'impro') >= 12 && S.week % 4 === 2 && prnd() < .3 && !pending().some(x => x.kind === 'impcorp')) inbox('impcorp', 'A corporate booking', 'A bank wants a workshop on "yes, and" for its sales team. Half a day pays $1,000; a full day $2,000. It isn\'t art. It is rent.', { choices: [{ k: 'ic_half', label: 'Half a day' }, { k: 'ic_full', label: 'A full day' }, { k: 'ic_no', label: 'Turn it down' }] });
  if (I.lvl >= 5 && !I.canTeach && S.week - (I.grad || S.week) >= 156) { I.canTeach = 1; inbox('note', 'They want you to teach', 'Three years after Level 5, the theatre asks if you would take a Level 1 class: $50 an hour, three hours a week. The Improv app lets you take up to three.'); }
  if (I.teach) { const pay = usd(150 * I.teach); M.cash += pay - taxOn(pay); I.reg += I.teach * .2; }
  if (I.lvl >= 3 && !I.cruiseAsk && prnd() < .01) { I.cruiseAsk = S.week; inbox('impcruise', 'Sixteen weeks at sea', 'A cruise line wants short-form improvisers: eight shows a week, the same thirty games, about $2,000 a week, and nothing to spend it on.', { choices: [{ k: 'cr_go', label: 'Sign on' }, { k: 'cr_no', label: 'Stay in the scene' }] }); }
  if (I.cruise && S.week < I.cruise) { const pay = usd(2000); M.cash += pay - taxOn(pay); me.sk.impro = Math.max(1, me.sk.impro - .02); if (S.week === I.cruise - 1) diary('The ship docks. You have money for the first time in years and a nagging feeling you have forgotten how to do a slow scene.'); }
  // a sketch packet for late night, once a year for writers and sketch people
  if ((M.dream === 'sketch' || I.lvl >= 4) && S.week % 52 === 30 && !pending().some(x => x.kind === 'imppacket')) inbox('imppacket', 'Late-night submissions are open', 'A late-night show is taking writing packets: ten pages of sketches, due in four weeks. Most people send thirty before one gets read properly.', { choices: [{ k: 'ip_send', label: 'Write and send one' }, { k: 'ip_skip', label: 'Not this year' }] });
  // fans: regulars become superfans
  if (S.week % 4 === 0) { I.sup += I.reg * .01; I.fans *= .995; }
  // the theatre you own: the month's money
  if (I.own && S.week % 4 === 3) impOwnMonth(I);
}
function impClip(q) { const M = S.me, me = ME(), n = Math.round(Math.pow(10, 3.3 + prnd() * 2)); M.fol = M.fol || {}; M.fol.blip = (M.fol.blip || 0) + n; me.fame = clamp((me.fame || 0) + 2, 0, 100);
  inbox('note', 'A clip escapes', `Someone filmed forty seconds of tonight's show and posted it. ${n.toLocaleString()} people follow you by the weekend. Strangers quote your line at you in the supermarket.`); }
function impOwnMonth(I) {
  const M = S.me, O = I.own, rent = usd(9000), students = O.students = Math.round(clamp(O.students * (1 + (450 - O.price) / 2000) + (I.scene - 30) / 20 + pgauss() * 2, 6, 140));
  const classes = students * usd(O.price) / 2, shows = usd(10) * 70 * 16 * clamp(.3 + students / 200, .2, .9), wages = O.pay === 2 ? usd(150) * 16 * 6 : O.pay === 1 ? shows * .3 : 0;
  const tax = dateOf(S.week).getUTCMonth() === 0 ? (classes + shows) * 12 * .07 : 0, net = classes + shows * 1.4 - rent - wages - tax;
  O.cash += net; if (net > 0 && O.cash > usd(30000)) { const d = Math.round(net * .5); O.cash -= d; M.cash += d - taxOn(d); }   // the owner's share
  O.loyalty = clamp(O.loyalty + (O.pay ? 1 : -1), 0, 100);
  if (tax) diary(`${O.name}: the property-tax bill, ${fmtCash(Math.round(tax))}.`);
  if (!O.pay && O.loyalty < 30 && !O.letter && prnd() < .08) { O.letter = S.week; inbox('impletter', 'An open letter', `Thirty performers sign a letter: ${O.name} sells classes off their work and pays nothing for the shows. It is on every comedy blog by lunch.`, { choices: [{ k: 'il_pay', label: 'Start paying for shows' }, { k: 'il_door', label: 'Offer a share of the door' }, { k: 'il_hold', label: 'Hold the line' }] }); }
  if (O.cash < -usd(30000)) { I.own = null; milestone(`Closed ${O.name}`, 'life'); inbox('note', 'The lights go off', `${O.name} can't make the rent. The last show is a jam; everyone who ever took a class comes. You keep the sign.`); }
}
function impPick(it, k) {
  const M = S.me, me = ME(), I = M.imp; if (!I || !['impaud', 'impscout', 'impcorp', 'impcruise', 'imppacket', 'impletter'].includes(it.kind)) return false; it.done = true;
  if (it.kind === 'impaud') { if (k !== 'ia_go') { it.result = { t: 'You sit this one out.' }; return true; } I.aud++;
    const p = clamp(.04 + Math.max(0, skillOf(me, 'impro') - 10) * .01 + (I.aud - 1) * .03 + (Object.keys(M.known).length > 40 ? .05 : 0), .02, .6), ok = prnd() < p;
    if (ok) { const peers = impPeers(5); peers.forEach(q => meet(q.id, 'House team', 8)); I.house = { name: `${pickLine(['Glass', 'Paper', 'Velvet', 'Neon', 'Second'], S.week)} ${pickLine(['Lions', 'Sundays', 'Machines', 'Uncles', 'Mirrors'], S.week + 1)}`, mates: peers.map(q => q.id), chem: 55, shows: 0, season: 1, until: S.week + 26, paid: (impTheatres(M.hub).find(t => t.k === 'big') || {}).pays };
      milestone('Made a house team', 'work'); I.scene = clamp(I.scene + 8, 0, 100); it.result = { t: `The list goes up at 11:58 p.m. You scroll past it twice before you see your name: ${I.house.name}, Thursdays at nine.` }; }
    else it.result = { t: `The list goes up at 11:58 p.m. Your name isn't on it. ${I.aud > 1 ? 'They know your face now, though.' : 'Almost nobody\'s is.'}` };
    return true; }
  if (it.kind === 'impscout') { if (k !== 'is_go') { it.result = { t: 'You stay with the team. They notice.' }; I.house && (I.house.chem += 5); return true; }
    const ok = roll('impro', 15); if (ok && typeof ODD_BY !== 'undefined' && ODD_BY.tv_regular) { const p = makePost(ODD_BY.tv_regular, null); Object.assign(p, { t: 'Cast member, a network sketch show', weeks: 21, rate: Math.round(usd(7000) / 4) }); takeJob(p); milestone('Cast on a sketch show', 'work'); it.result = { ok, roll: M.lastRoll, t: 'The screen test goes well enough that they skip the callback. Twenty-one episodes, live, every week. Your house team throws you a party and quietly hates you a little.' }; }
    else it.result = { ok, roll: M.lastRoll, t: 'You are good in the room and forgettable on camera. They keep your tape.' };
    return true; }
  if (it.kind === 'impcorp') { if (k === 'ic_no') { it.result = { t: 'You turn it down. The theatre gives it to someone with rent due.' }; return true; }
    const pay = usd(k === 'ic_full' ? 2000 : 1000); M.cash += pay - taxOn(pay); M.stress = clamp(M.stress + 4, 0, 100); growSub(me, 'pres', .02); I.corpY[S.year] = (I.corpY[S.year] || 0) + 1; if (I.corpY[S.year] > 6) I.scene = clamp(I.scene - 1, 0, 100);
    it.result = { t: `Forty bankers learn to say "yes, and". One of them is genuinely good. ${fmtCash(pay)}.` }; return true; }
  if (it.kind === 'impcruise') { if (k === 'cr_go') { I.cruise = S.week + 16; milestone('Signed on as a cruise-ship improviser', 'work'); it.result = { t: 'Sixteen weeks, eight shows a week. You pack sunscreen and thirty games.' }; } else it.result = { t: 'You stay. The scene is where the scouts are.' }; return true; }
  if (it.kind === 'imppacket') { if (k !== 'ip_send') { it.result = { t: 'Next year.' }; return true; } growSub(me, 'dial', .05);
    const ok = prnd() < .03 + Math.max(0, skillOf(me, 'orig') - 12) * .01 + (I.lvl >= 5 ? .02 : 0);
    if (ok && ODD_BY.tv_staffwriter) { const p = makePost(ODD_BY.tv_staffwriter, null); Object.assign(p, { t: 'Staff writer, a late-night show', weeks: 20 }); takeJob(p); milestone('Hired off a late-night packet', 'work'); it.result = { t: 'Somebody read it properly. You are in a writers\' room by Monday, pitching cold opens to people you used to watch.' }; }
    else it.result = { t: 'A form rejection, three months later. Thirty-five is the usual number before one lands.' }; return true; }
  if (it.kind === 'impletter') { const O = I.own; if (!O) return true; if (k === 'il_pay') { O.pay = 2; O.loyalty += 30; it.result = { t: 'You pay $150 a show. The margin goes; the open letter becomes a thank-you post.' }; } else if (k === 'il_door') { O.pay = 1; O.loyalty += 15; it.result = { t: 'A share of the door. Some performers call it a start.' }; } else { me.standing = clamp(me.standing - 2, 0, 100); O.loyalty -= 10; if (prnd() < .3) { O.union = S.week; inbox('note', 'A union drive', `The cast at ${O.name} files to unionise. Settling will cost a third more on wages over five years.`); } it.result = { t: 'You hold the line. The blogs move on; the performers don\'t.' }; } return true; }
  return false;
}
WEEK_HOOKS.push(impWeek);
PICK_HOOKS.push(impPick);

// ---- the Improv app ----
function improvHTML() {
  const M = S.me, I = M.imp || null, T = impTheatres(M.hub), me = ME();
  if (!T.length) return `<div class="card"><h3>Improv</h3><p class="muted">No improv scene in ${esc(HUBS[M.hub].name)} yet.</p></div>`;
  const B = (hk, label, dis) => `<button class="btn-s${dis ? ' ghost' : ''}" data-hk="imp:${hk}"${dis ? ' disabled' : ''}>${label}</button>`;
  const th = T.map(t => `<li><b>${esc(t.name)}</b> <span class="small muted">${esc(IMP_KINDS[t.k][0])}${t.price ? ` · ${fmtCash(usd(t.price))} a level` : ''}${t.pays ? ' · pays its performers' : ''}</span><br><span class="small">${esc(IMP_KINDS[t.k][2])}</span>${t.price && I !== null && !(I && I.cls) && (!I || I.lvl < 5) ? ` ${B('enrol:' + t.k, `Sign up for Level ${(I ? I.lvl : 0) + 1}`, M.cash < usd(t.price))}` : ''}</li>`).join('');
  if (!I) return `<div class="card"><h3>Improv in ${esc(HUBS[M.hub].name)}</h3><p>The scene runs on classes: five levels, eight weeks each, then auditions, teams and festivals. Go and see a show first, or sign up.</p><p>${B('watch', `See a show (${fmtCash(usd(12))})`)} ${B('enrol:' + (T.find(t => t.price) || {}).k, 'Sign up for Level 1')}</p><ul class="plain">${th}</ul></div>`;
  const status = [I.cls ? `In Level ${I.cls.lvl} at ${esc(I.cls.name)}: week ${I.cls.wk} of 8.` : I.lvl ? `Finished Level ${I.lvl}.` : 'No classes yet.', I.house ? `House team: <b>${esc(I.house.name)}</b>, season ${I.house.season} (last show ${I.house.last || '—'}/100).` : I.lvl >= 3 ? 'Eligible for house-team auditions (twice a year).' : '', I.indie ? `Indie team: <b>${esc(I.indie.name)}</b>, ${I.indie.shows} shows, chemistry ${Math.round(I.indie.chem)}.` : '', I.teach ? `Teaching ${I.teach} class${I.teach > 1 ? 'es' : ''} a week.` : '', I.cruise && S.week < I.cruise ? 'At sea until ' + fmtDate(I.cruise, true) + '.' : ''].filter(Boolean).join(' ');
  const own = I.own ? `<h4>${esc(I.own.name)}</h4><p class="small">${I.own.students} students at ${fmtCash(usd(I.own.price))} a level · theatre cash ${fmtCash(Math.round(I.own.cash))} · cast loyalty ${Math.round(I.own.loyalty)} · ${['pays nothing for shows', 'shares the door', 'pays $150 a show'][I.own.pay]}${I.own.union ? ' · unionised' : ''}.</p><p>${B('price:-50', 'Lower class prices')} ${B('price:50', 'Raise class prices')} ${B('pay:0', 'Pay nothing')} ${B('pay:1', 'Share the door')} ${B('pay:2', 'Pay per show')}</p>` : `<p class="small">Own a theatre: about ${fmtCash(usd(90000))} to open. Classes pay for everything; shows are the shop window.</p><p>${B('own', 'Open a theatre', M.cash < usd(90000))}</p>`;
  return `<div class="card"><h3>Improv in ${esc(HUBS[M.hub].name)}</h3><p>${status}</p>
    <p class="small">Scene standing <b>${Math.round(I.scene)}</b> · fans ${Math.round(I.fans)} · regulars ${Math.round(I.reg)} · superfans ${Math.round(I.sup)} · shows played ${I.shows}</p>
    <p>${B('jams', I.jams ? 'Stop going to jams' : 'Go to the weekly jams')} ${B('indie', 'Form an indie team', !!I.indie || I.lvl < 2)} ${B('festival', 'Apply to the festival ($30)', !(I.house || I.indie) || I.festY === S.year)} ${I.canTeach ? B('teach', 'Take another class to teach', (I.teach || 0) >= 3) : ''} ${B('watch', `See a show (${fmtCash(usd(12))})`)} ${B('donate:5000', 'Fund a scholarship ($5,000)', M.cash < usd(5000))}</p>
    <h4>The theatres</h4><ul class="plain">${th}</ul><h4>Backing the scene</h4>${own}</div>`;
}
OS_EXTRA.improv = ['🎭', 'Improv', 'Classes, teams, jams, festivals and the theatres'];
OS_VIEWS.improv = () => improvHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Make'); if (g && !g[1].includes('improv')) g[1].push('improv'); }
if (typeof APP_GUIDE !== 'undefined') APP_GUIDE.improv = ['The improv scene in your city.', 'Five levels of classes, eight weeks each; auditions for house teams twice a year after Level 3; an indie team that rents the room; festivals, jams, teaching and corporate bookings. Or back it: open a theatre, fund a scholarship. Or just go to shows.', 'Improv makes you better in every room: auditions, pitches, sets. It is also the most common way into sketch and late-night writing.', 'See a show, then sign up for Level 1.'];
// the shop's cheap bundle becomes what a level really costs
if (typeof SHOP2 !== 'undefined') { const x = (Array.isArray(SHOP2) ? SHOP2 : Object.values(SHOP2)).find(i => i && (i.k === 'c_improv' || i.id === 'c_improv')); if (x) { x.price = 450; x.label = 'Improv Level 1 (eight weeks)'; } }

// ---- more lives on and around the stage (research in docs/RESEARCH.md, Round 20) ----
if (typeof DREAMS !== 'undefined') for (const d of [
  { k: 'drag', label: 'Drag performer', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events)/, /\b(drag|cabaret|host|perform\w*|nightlife)\b/i], first: 'play' },
  { k: 'promoter', label: 'Comedy and live-event promoter', role: 'producer', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events|Marketing)/, /\b(promot\w*|booking|events?|tour|venue)\b/i] },
  { k: 'themepark', label: 'Theme-park performer', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events)/, /\b(entertain\w*|character|park|parade|guest)\b/i] },
  { k: 'warmup', label: 'Studio warm-up comic', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events|Television)/, /\b(warm-?up|audience|comed\w*|host)\b/i] },
  { k: 'caster', label: 'Esports caster', role: 'actor', field: 'creator', grp: 'Online', core: [/^(Video Game|Online video|Content Creator)/, /\b(cast\w*|host|commentat\w*|stream\w*|esports?)\b/i] }
]) if (!DREAMS.some(x => x.k === d.k)) DREAMS.push(d);
// the lookup table was built before these were added: register them too, or choosing one of these dreams silently fails
if (typeof DREAM_BY !== 'undefined') for (const d of DREAMS) if (!DREAM_BY[d.k]) DREAM_BY[d.k] = d;
if (typeof DREAM_GIGS !== 'undefined') Object.assign(DREAM_GIGS, { drag: ['club', 'special', 'residency', 'webser'], promoter: ['club', 'festset', 'concert'], themepark: ['club', 'spot', 'stage'], warmup: ['taping', 'multicam', 'club'], caster: ['webser', 'audio', 'spot'] });
