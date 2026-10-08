// ---------------- The long game: money, freedom, and weeks that always have something in them ----------------
// Three things live here.
// 1. Working for yourself. With a year of savings and some standing, you don't have to look for work: the game stops
//    pushing jobs at you, and you can spend your weeks on your own projects. Toggle it on Today.
// 2. The late game. Once you have money or a name, opportunities find you: films to back, rights to buy, cinemas
//    to save, juries, salons, scholarships, a memoir. Some pay back months later, some never do.
// 3. No quiet weeks. If a week has had nothing in it by Friday, something turns up: from the late game if you can
//    afford it, from the independent life if you're between jobs, from ordinary life otherwise.
// Everything here draws on the seeded RNG (prnd) at the moment it happens, so replays stay identical.

// ---- money ----
function weeklyBurn() {
  const M = S.me, life = ORIGIN.life[M.life] || ORIGIN.life.shared;
  return Math.max(1, Math.round(usd(M.rentOverride && M.life !== 'couch' ? M.rentOverride : life.rent) + (M.upkeep || 0) + usd((VEHICLES[M.vehicle || 'transit'] || { upkeep: 0 }).upkeep)));
}
function runwayWeeks() { return Math.max(0, S.me.cash) / weeklyBurn(); }
// Comfortable: a year of living costs in the bank, or a decent sum outright.
// Real money, or a long runway and a name: the late game is for people who've made it, not a year of savings.
function lateRich() { const M = S.me; return M.cash >= usd(150000) || (runwayWeeks() >= 104 && careerLevel() >= 4); }
// Are you looking for work? You decide (the switch on Today); left alone, a year's savings and a few credits means no.
function lookingForWork() {
  const M = S.me; if (!M) return true;
  if (M.looking === 'yes') return true;
  if (M.looking === 'no') return false;
  return !(runwayWeeks() >= 52 && careerLevel() >= 2 && hasFooting());
}
// a foothold in your own line of work: credits, a year in your craft, or a name
function hasFooting() {
  const M = S.me, me = ME();
  if (careerLevel() >= 4 || me.credits.length >= 2) return true;
  const craftWeeks = (M.past || []).filter(p => typeof craftJob !== 'function' || craftJob(p)).reduce((s, p) => s + Math.max(0, (p.to || S.week) - (p.from || p.to || S.week)), 0);
  return craftWeeks >= 52 || (M.works || []).length >= 4;
}
// a round, readable amount of money: a share of what you have, inside a floor and ceiling (in today's dollars)
function lateAmt(frac, lo, hi) {
  const v = clamp(S.me.cash * frac, usd(lo), usd(hi));
  const step = v >= 1e6 ? 50000 : v >= 1e5 ? 5000 : v >= 2e4 ? 1000 : 250;
  return Math.max(step, Math.round(v / step) * step);
}

// ---- people the opportunities bring ----
function lateWho(kind) {
  const M = S.me, me = ME();
  if (kind === 'known') { const ids = Object.keys(M.known).map(Number).filter(id => !P(id).dead && id !== M.id); return ids.length ? ids[Math.floor(prnd() * ids.length)] : null; }
  if (kind === 'friend') { const ids = Object.keys(M.known).map(Number).filter(id => !P(id).dead && id !== M.id && opinion(id) > 10); return ids.length ? ids[Math.floor(prnd() * ids.length)] : lateWho('known'); }
  if (kind === 'abroad') {
    const hubs = Object.keys(HUBS).filter(h => h !== M.hub && S.pool[h]);
    const h = hubs[Math.floor(prnd() * hubs.length)], q = h && bestIn(h, ['director', 'writer', 'producer'], q => q.standing * .5 + prnd() * 30);
    return q ? q.id : null;
  }
  const roles = kind === 'young' ? ['director', 'writer', 'composer', 'dp'] : kind === 'composer' ? ['composer'] : kind === 'director' ? ['director'] : ROLES;
  const q = bestIn(M.hub, roles, kind === 'young' || kind === 'director' ? q => -Math.abs(q.standing - 18) + (q.pot || 0) * .3 + prnd() * 25 : q => q.standing + prnd() * 20 - Math.abs(q.standing - me.standing) * .2);
  return q ? q.id : null;
}
const lname = id => id !== null && id !== undefined && P(id) ? P(id).name : 'someone';

// ---- effects ----
// fx: { cash (today's $), stand, fame, intl, stress, energy, xp: {sub: v}, tie (on c.who), meet: kind, pages, flag, mile }
function lateFx(fx, c, out) {
  const M = S.me, me = ME();
  if (!fx) return;
  if (fx.cash) M.cash += Math.round(fx.cash);
  // reputation moves slowly: a good deed is a nudge, a career is many of them
  if (fx.stand) me.standing = clamp(me.standing + fx.stand * .25, 0, 100);
  if (fx.fame) me.fame = clamp((me.fame || 0) + fx.fame * .2, 0, 100);
  if (fx.intl) me.intl = clamp((me.intl || 0) + fx.intl, 0, 100);
  if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100);
  if (fx.energy) M.energy = clamp(M.energy + fx.energy, 0, 100);
  for (const k in fx.xp || {}) growSub(me, k, fx.xp[k]);
  if (fx.tie && c.who !== null && c.who !== undefined && P(c.who)) { meet(c.who, c.tag || null); addTie(me, P(c.who), fx.tie); }
  if (fx.meet) { const id = lateWho(fx.meet); if (id !== null) { meet(id, fx.meetTag || 'Met through your work', 6); if (out) out.push(`You get to know ${P(id).name}, ${ROLE_LABEL[P(id).role].toLowerCase()}.`); } }
  if (fx.pages && M.spec) M.spec.pages += fx.pages;
  if (fx.flag) (M.flags = M.flags || {})[fx.flag] = S.week;
  if (fx.mile) milestone(fx.mile, fx.mileKind || 'life');
}
// something that comes back later: a payoff, a bill, a phone call
function lateLater(weeks, f, c) { (S.me.lateQ = S.me.lateQ || []).push({ w: S.week + Math.max(1, Math.round(weeks)), f, c }); }
// a holding that earns (or costs) a little every week
function lateHold(k, name, val, net, extra = {}) { (S.me.lateA = S.me.lateA || []).push(Object.assign({ k, name, w: S.week, val: Math.round(val), net: Math.round(net) }, extra)); }
const holdings = () => S.me.lateA || [];

// ---- the opportunities ----
// Each: id, pool ('late' needs money or a name; 'indie' is the between-jobs life; 'life' is anyone), need() to be
// offered, mk(c) to fill the context, title/text(c), and options { k, label(c), cost(c), check, go(c, ok) -> text }.
const R2 = (lo, hi) => lo + prnd() * (hi - lo);
const lateR = (lo, hi) => lo + prnd() * (hi - lo);
const LATE = [
  // ===== the late game: money, a name, and freedom =====
  { id: 'lg_debut', pool: 'late', mk: c => { c.who = lateWho('young'); c.amt = lateAmt(.06, 20000, 1500000); }, needC: c => c.who !== null,
    title: 'A first film needs a last cheque', text: c => `${lname(c.who)} has a first feature cast, crewed and twelve days from shooting, and ${fmtCash(c.amt)} short. Their producer has your number. "We'd give you an executive producer credit and a real share of the back end."`,
    opts: [
      { k: 'all', label: c => `Close the gap: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ tie: 10, stand: .6 }, c); c.tag = 'You backed their first film'; meet(c.who, c.tag); lateLater(lateR(40, 70), 'film', { who: c.who, amt: c.amt, q: (P(c.who).pot || 50) }); return 'The money lands on a Friday. On Monday they start shooting. You get a photo from set: the clapperboard, your name on the tape.'; } },
      { k: 'half', label: c => `Put in half and help find the rest`, cost: c => Math.round(c.amt / 2), check: ['fin', 13], go: (c, ok) => { lateFx({ tie: 6, xp: { fin: .2 } }, c); lateLater(lateR(40, 70), 'film', { who: c.who, amt: Math.round(c.amt / 2), q: (P(c.who).pot || 50) - (ok ? 0 : 15) }); return ok ? 'You make three calls. A friend in equity finance takes the other half. The film shoots on time.' : 'Nobody else bites. They shoot a shorter script, with your half.'; } },
      { k: 'no', label: () => 'Wish them luck', go: c => { lateFx({ tie: -2 }, c); return 'They find it somewhere else, or they don\'t. You never quite find out.'; } }] },
  { id: 'lg_rights', pool: 'late', mk: c => { const old = S.films.filter(f => f.stage === 4 && f.ry && f.ry <= S.year - 20 && f.ry >= S.year - 70); const f = old.length ? old[Math.floor(prnd() * old.length)] : null; c.film = f ? f.id : null; c.amt = lateAmt(.05, 15000, 900000); }, needC: c => c.film !== null,
    title: 'The rights to an old film', text: c => `The estate of the producer of ${S.films[c.film].title} (${S.films[c.film].ry}) is selling the remake rights. They want ${fmtCash(c.amt)} and a promise you won't "do anything vulgar with it".`,
    opts: [
      { k: 'buy', label: c => `Buy the rights: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateLater(lateR(30, 90), 'rights', { film: c.film, amt: c.amt }); lateFx({ stand: .3 }); return `You own ${S.films[c.film].title} now, or the right to make it again. The papers come in a box tied with string.`; } },
      { k: 'haggle', label: c => `Offer two thirds`, cost: c => Math.round(c.amt * 2 / 3), check: ['pack', 14], go: (c, ok) => { if (!ok) { S.me.cash += Math.round(c.amt * 2 / 3); return 'They\'re insulted. The rights go to a studio by Christmas.'; } lateLater(lateR(30, 90), 'rights', { film: c.film, amt: Math.round(c.amt * 2 / 3) }); return 'They sigh and accept. You own a piece of film history for the price of a good car.'; } },
      { k: 'no', label: () => 'Let it go', go: c => 'Somebody else buys it. You\'ll see their trailer in two years and wince.' }] },
  { id: 'lg_cinema', pool: 'late', need: () => !holdings().some(h => h.k === 'cinema'), mk: c => { c.amt = lateAmt(.15, 90000, 4000000); c.place = ppick(['a 1920s picture palace with a Wurlitzer organ', 'the art-deco single screen where you saw your first film here', 'a neighbourhood cinema with 400 velvet seats and a leaking roof', 'a repertory house that has shown a double bill every night since 1958']); },
    title: 'A cinema for sale', text: c => `It's ${c.place}, and it's closing. The owner would rather sell to someone who'll keep it open. ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'buy', label: c => `Buy it and keep it running: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateHold('cinema', 'Your cinema', c.amt, c.amt * lateR(-.0006, .0016)); lateFx({ stand: 1.2, fame: 3, mile: 'Bought a cinema and kept it open' }); return 'You get the keys and the alarm code. On opening night under your name you sell out a fifty-year-old film and stand at the back.'; } },
      { k: 'campaign', label: () => 'Lead a campaign to save it instead', check: ['cha', 14], go: (c, ok) => { lateFx(ok ? { stand: .8, fame: 2, energy: -10 } : { energy: -10, stress: 4 }); return ok ? 'The city lists the building. A community trust buys it. They put your name on a seat.' : 'The petition gets twenty thousand names. It becomes a gym anyway.'; } },
      { k: 'no', label: () => 'Not your problem', go: c => 'It closes in March. You walk past it more often than you need to.' }] },
  { id: 'lg_scholar', pool: 'late', cool: 104, mk: c => { c.amt = lateAmt(.03, 10000, 500000); },
    title: 'A scholarship in your name', text: c => `The film school down the road asks whether you'd endow a scholarship: ${fmtCash(c.amt)}, one student a year, for ever. "Students who couldn't otherwise come. Like you, perhaps."`,
    opts: [
      { k: 'yes', label: c => `Endow it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stand: 1.5, fame: 1, meet: 'young', meetTag: 'Your scholarship student', mile: 'Endowed a scholarship' }, c, c.out = []); return 'The first scholar writes you a letter in actual ink. ' + c.out.join(' '); } },
      { k: 'teach', label: () => 'Give your time instead: a term of classes', check: ['com', 12], go: (c, ok) => { lateFx(ok ? { stand: .8, energy: -12, xp: { com: .3 }, meet: 'young', meetTag: 'Your student' } : { energy: -12, stress: 3 }, c, c.out = []); return (ok ? 'Twelve Thursday evenings. By the end the students are teaching you. ' : 'You are a worse teacher than you hoped, and you know it by week three. ') + c.out.join(' '); } },
      { k: 'no', label: () => 'Not this year', go: c => 'They thank you warmly and ask someone else.' }] },
  { id: 'lg_restore', pool: 'late', mk: c => { c.amt = lateAmt(.02, 8000, 300000); c.what = ppick(['a silent melodrama thought lost since 1931, found in a farmhouse attic', 'the only surviving print of a 1940s musical, on nitrate, in a biscuit tin', 'a censored 1960s film, uncut, from a projectionist\'s garage']); },
    title: 'A lost film turns up', text: c => `An archive has ${c.what}. It's turning to vinegar on the shelf. A restoration would cost ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'pay', label: c => `Pay for the restoration: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateLater(lateR(20, 34), 'restored', { what: c.what }); lateFx({ stand: .6 }); return 'The archivists send photos of the frames every week, like a baby scan.'; } },
      { k: 'no', label: () => 'Someone else will', go: c => 'Someone else doesn\'t. The archive keeps it cold and hopes.' }] },
  { id: 'lg_salon', pool: 'late', mk: c => { c.amt = lateAmt(.004, 2500, 40000); },
    title: 'A dinner for twelve', text: c => `You could host a dinner: twelve people, good wine, one long table, about ${fmtCash(c.amt)} all in. Who do you invite?`,
    opts: [
      { k: 'power', label: c => `The people who decide things (${fmtCash(c.amt)})`, cost: c => c.amt, check: ['cha', 14], go: (c, ok) => { c.out = []; lateFx(ok ? { stand: .8, meet: 'power', meetTag: 'At your dinner' } : { stress: 3 }, c, c.out); if (ok) lateFx({ meet: 'power', meetTag: 'At your dinner' }, c, c.out); return (ok ? 'Three studio heads stay until two in the morning arguing about endings. ' : 'Two cancel, one brings a plus-one who sells crypto. ') + c.out.join(' '); } },
      { k: 'young', label: c => `People on the way up (${fmtCash(c.amt)})`, cost: c => c.amt, go: c => { c.out = []; lateFx({ meet: 'young', meetTag: 'At your dinner' }, c, c.out); lateFx({ meet: 'young', meetTag: 'At your dinner', stand: .3 }, c, c.out); return 'The room is loud and hungry. Somebody pitches a film to somebody else over dessert, and you can tell it\'ll get made. ' + c.out.join(' '); } },
      { k: 'friends', label: c => `Old friends, nobody useful (${fmtCash(c.amt)})`, cost: c => c.amt, go: c => { for (const id of Object.keys(S.me.known).map(Number).filter(id => !P(id).dead && opinion(id) > 15).slice(0, 6)) addTie(ME(), P(id), 4); lateFx({ stress: -12 }); return 'Nobody talks about work for a whole evening. You\'d forgotten that was possible.'; } }] },
  { id: 'lg_jury', pool: 'late', need: () => careerLevel() >= 5, mk: c => { c.fest = ppick(['a festival on the Riviera', 'a festival on a lagoon', 'a festival in the mountains in January', 'a festival in a Berlin winter', 'a festival in Busan in October', 'a festival in Toronto in September']); },
    title: 'An invitation to the jury', text: c => `${c.fest.charAt(0).toUpperCase() + c.fest.slice(1)} wants you on its main jury. Twelve days, twenty films, eight strangers and a prize that can make a career.`,
    opts: [
      { k: 'yes', label: () => 'Accept', go: c => { c.out = []; lateFx({ stand: 1, intl: 4, energy: -15, xp: { tas: .3 }, meet: 'abroad', meetTag: 'On the jury with you' }, c, c.out); return 'The deliberations run until four in the morning. You win the argument that matters. ' + c.out.join(' '); } },
      { k: 'fight', label: () => 'Accept, and fight for the strange film nobody likes', check: ['cha', 15], go: (c, ok) => { lateFx(ok ? { stand: 1.6, intl: 5, fame: 2, energy: -15 } : { stand: .5, intl: 3, energy: -15, stress: 4 }); return ok ? 'It wins. The director cries on stage and thanks "the jury, and one juror in particular".' : 'You lose seven to two. The strange film gets a special mention, which is something.'; } },
      { k: 'no', label: () => 'Decline politely', go: c => 'They ask again in two years. People who decline twice don\'t get asked a third time.' }] },
  { id: 'lg_masterclass', pool: 'late', need: () => careerLevel() >= 4, mk: c => { c.fee = lateAmt(.004, 4000, 60000); c.city = ppick(['Lisbon', 'Seoul', 'Mexico City', 'Copenhagen', 'Lagos', 'Melbourne', 'Mumbai', 'Buenos Aires']); },
    title: 'A masterclass abroad', text: c => `A film academy in ${c.city} wants a three-day masterclass from you. ${fmtCash(c.fee)}, business class, and a hotel with a view of something.`,
    opts: [
      { k: 'yes', label: () => 'Go and teach', check: ['com', 12], go: (c, ok) => { c.out = []; lateFx(ok ? { cash: c.fee, intl: 4, fame: 1, energy: -8, meet: 'abroad', meetTag: 'At your masterclass' } : { cash: c.fee, intl: 2, energy: -8 }, c, c.out); return (ok ? 'The questions are better than the ones at home. You leave with a full notebook. ' : 'Jet lag eats the first day. The students are kind about it. ') + c.out.join(' '); } },
      { k: 'no', label: () => 'Too far, too busy', go: c => 'They get someone else. You see the photos: it looked lovely.' }] },
  { id: 'lg_firstlook', pool: 'late', need: () => careerLevel() >= 5 && !holdings().some(h => h.k === 'deal'), mk: c => { c.amt = Math.round(usd(1200 + careerLevel() * 600) / 50) * 50; },
    title: 'A first-look deal', text: c => `A streamer wants first look at anything you develop for two years: ${fmtCash(c.amt)} a week, an office and an assistant. They can pass on anything; anything they pass on is yours to take elsewhere.`,
    opts: [
      { k: 'yes', label: c => `Sign: ${fmtCash(c.amt)} a week`, go: c => { lateHold('deal', 'First-look deal', 0, c.amt, { until: S.week + 104 }); lateFx({ stand: 1, mile: 'Signed a first-look deal' }); return 'There is a parking space with your name on it. It\'s the smallest thing and it makes you absurdly happy.'; } },
      { k: 'more', label: () => 'Push for more money', check: ['pack', 15], go: (c, ok) => { const a = Math.round(c.amt * (ok ? 1.4 : 1)); if (ok || prnd() < .5) { lateHold('deal', 'First-look deal', 0, a, { until: S.week + 104 }); lateFx({ stand: 1 }); return ok ? `They come back at ${fmtCash(a)} a week. You sign.` : 'They hold firm. You sign anyway.'; } return 'They withdraw the offer. "We\'ll circle back." They don\'t.'; } },
      { k: 'no', label: () => 'Stay free', go: c => { lateFx({ stand: .3 }); return 'You stay independent. It feels like a principle, and also like turning down a lot of money.'; } }] },
  { id: 'lg_loan', pool: 'late', mk: c => { c.who = lateWho('friend'); c.amt = lateAmt(.01, 3000, 120000); }, needC: c => c.who !== null,
    title: 'A friend needs money', text: c => `${lname(c.who)} asks, awkwardly, over coffee: could you lend them ${fmtCash(c.amt)}? Their film's collapsed and the bank won't wait.`,
    opts: [
      { k: 'lend', label: c => `Lend it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ tie: 8 }, c); lateLater(lateR(26, 70), 'repay', { who: c.who, amt: c.amt }); return 'They hug you in the street. You try not to think about whether you\'ll see it again.'; } },
      { k: 'gift', label: c => `Give it, and say never mind paying it back`, cost: c => c.amt, go: c => { lateFx({ tie: 16 }, c); trust(c.who, 10); return 'They can\'t speak for a moment. Years later they\'ll still mention it.'; } },
      { k: 'no', label: () => 'Say you can\'t', go: c => { lateFx({ tie: -6 }, c); return 'They say they understand. They mostly do.'; } }] },
  { id: 'lg_memoir', pool: 'late', once: 1, need: () => careerLevel() >= 5 || (ME().fame || 0) >= 25, mk: c => { c.amt = Math.round(usd(40000 + (ME().fame || 0) * 4000 + careerLevel() * 15000) / 1000) * 1000; },
    title: 'A book deal', text: c => `A publisher wants your memoir. ${fmtCash(c.amt)} advance. "Honest, funny, a bit of gossip. Not too much gossip. Some gossip."`,
    opts: [
      { k: 'ghost', label: () => 'Take it, with a ghostwriter', go: c => { lateFx({ cash: c.amt * .7, fame: 4, stress: 3 }); return 'The ghostwriter interviews you for nine hours and makes you sound wittier than you are. It sells.'; } },
      { k: 'write', label: () => 'Write every word yourself', check: ['com', 14], go: (c, ok) => { lateFx(ok ? { cash: c.amt, fame: 7, stand: 1, energy: -15, xp: { com: .4 }, mile: 'Published a memoir' } : { cash: c.amt * .5, fame: 2, energy: -15, stress: 6 }); return ok ? 'It takes a year of mornings. The reviews call it "unexpectedly moving". Your mother calls it "a lot about you".' : 'You miss three deadlines. They publish it late and small.'; } },
      { k: 'no', label: () => 'Not yet: the story isn\'t finished', go: c => { lateFx({ stand: .2 }); return 'They say to call when it is.'; } }] },
  { id: 'lg_play', pool: 'late', mk: c => { c.who = lateWho('known'); c.amt = lateAmt(.04, 15000, 800000); },
    title: 'A play wants to transfer', text: c => `A small play has sold out a 90-seat theatre for six months. Its producers want ${fmtCash(c.amt)} from you to move it to a big house downtown. ${c.who !== null ? lname(c.who) + ' saw it and says it\'s the best thing in town.' : ''}`,
    opts: [
      { k: 'yes', label: c => `Back the transfer: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateLater(lateR(18, 40), 'play', { amt: c.amt }); return 'Opening night is in eleven weeks. You buy a new jacket for it.'; } },
      { k: 'no', label: () => 'Theatre is a lovely way to lose money', go: c => 'You\'re probably right. You go to see it anyway, and you\'re not sure.' }] },
  { id: 'lg_album', pool: 'late', mk: c => { c.who = lateWho('composer'); c.amt = lateAmt(.008, 5000, 90000); }, needC: c => c.who !== null,
    title: 'An album nobody will fund', text: c => `${lname(c.who)}, a composer whose scores you love, wants to make a record of their own: strings, a choir, a church. ${fmtCash(c.amt)} and no label will touch it.`,
    opts: [
      { k: 'yes', label: c => `Fund it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ tie: 10, stand: .3 }, c); lateLater(lateR(20, 40), 'album', { who: c.who, amt: c.amt }); return 'They send you rough mixes at midnight. You play them in the car with the windows down.'; } },
      { k: 'no', label: () => 'Pass', go: c => { lateFx({ tie: -1 }, c); return 'They make it anyway, on a laptop, years later.'; } }] },
  { id: 'lg_fund', pool: 'late', cool: 260, need: () => careerLevel() >= 4, mk: c => { c.amt = lateAmt(.05, 20000, 1500000); c.who = lateWho('abroad'); },
    title: 'A fund for somewhere else', text: c => `A festival programmer asks if you'd seed a fund for first-time filmmakers ${c.who !== null ? 'in ' + HUBS[P(c.who).hub].name : 'abroad'}: ${fmtCash(c.amt)}, five films over five years, your name on it.`,
    opts: [
      { k: 'yes', label: c => `Seed it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { c.tag = 'Funded by you'; lateFx({ intl: 8, stand: 1.2, fame: 2, tie: 10, mile: `Started a film fund ${c.who !== null ? 'in ' + HUBS[P(c.who).hub].name : 'abroad'}` }, c); return `The first grant goes to a script ${c.who !== null ? 'by ' + lname(c.who) : 'nobody at home would have read'}. You read it on the plane and cry at page 80.`; } },
      { k: 'no', label: () => 'Give at home instead', go: c => { lateFx({ stand: .3 }); return 'There\'s plenty to do here, you tell yourself, and it\'s true.'; } }] },
  { id: 'lg_ranch', pool: 'late', need: () => !holdings().some(h => h.k === 'ranch'), mk: c => { c.amt = lateAmt(.12, 60000, 3000000); c.place = ppick(['a ranch two hours out with a fake Western street left over from the fifties', 'a crumbling mansion that has played a haunted house in nine films', 'a disused factory with forty-foot ceilings, perfect for building sets', 'an old motel by a desert highway that every music video wants']); },
    title: 'A location for sale', text: c => `For sale: ${c.place}. ${fmtCash(c.amt)}. Productions rent it all year.`,
    opts: [
      { k: 'buy', label: c => `Buy it and rent it out: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateHold('ranch', 'Your location', c.amt, c.amt * lateR(.0008, .0022)); return 'The first booking is a car advert. The second is a horror film that sets the porch on fire, on purpose, twice.'; } },
      { k: 'no', label: () => 'Pass', go: c => 'You see it in a film a year later and feel a small, irrational pang.' }] },
  { id: 'lg_shelter', pool: 'late', mk: c => { c.amt = lateAmt(.05, 10000, 600000); },
    title: 'A clever accountant', text: c => `Your accountant has a scheme: put ${fmtCash(c.amt)} into "film production partnerships" and you'll save nearly half of it in tax. "Everyone's doing it."`,
    opts: [
      { k: 'yes', label: () => 'Do it', go: c => { lateFx({ cash: c.amt * .4 }); lateLater(lateR(40, 100), 'audit', { amt: c.amt }); return 'The tax bill shrinks. You decide not to read the small print.'; } },
      { k: 'no', label: () => 'Pay your taxes like a citizen', go: c => { lateFx({ xp: { eth: .3 }, stand: .1 }); return 'Your accountant sighs. You sleep well.'; } }] },
  { id: 'lg_auction', pool: 'late', mk: c => { c.amt = lateAmt(.02, 5000, 400000); c.what = ppick(['the dress from a famous 1950s ballroom scene', 'a spaceship model from a 1970s space opera', 'a typewriter that wrote three classic screenplays', 'the hat from a 1980s adventure film', 'a hand-painted poster for a lost 1920s epic', 'the shooting script of a great 1940s noir, with the director\'s notes']); },
    title: 'At the auction', text: c => `An auction of film memorabilia. Lot 41 is ${c.what}. The estimate is ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'bid', label: c => `Bid: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateHold('relic', c.what.replace(/^the /, 'The '), c.amt, 0); lateLater(lateR(52, 120), 'relic', { what: c.what, amt: c.amt }); return 'The hammer comes down. You own it. You have no idea where to put it.'; } },
      { k: 'museum', label: c => `Buy it for the film museum: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stand: 1, fame: 2 }); return 'It goes in a glass case with a little card that says "Gift of" and your name.'; } },
      { k: 'no', label: () => 'Watch someone else win it', go: c => 'It goes to a phone bidder in Monaco.' }] },
  { id: 'lg_startup', pool: 'late', mk: c => { c.amt = lateAmt(.03, 10000, 1000000); c.what = ppick(['automatic dubbing that keeps the actor\'s voice', 'a cinema-ticket subscription app', 'virtual sets on giant LED walls for small productions', 'a scheduling app for film shoots', 'an app that writes loglines (badly)']); },
    title: 'A start-up wants you', text: c => `Two founders in hoodies want ${fmtCash(c.amt)} for their company: ${c.what}. "You'd be our industry advisor. And an investor. Mostly an investor."`,
    opts: [
      { k: 'yes', label: c => `Invest ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateLater(lateR(50, 130), 'startup', { what: c.what, amt: c.amt }); return 'You get a hoodie. It\'s a good hoodie.'; } },
      { k: 'no', label: () => 'Not your world', go: c => 'They thank you and say they\'ll keep you posted. They don\'t.' }] },
  { id: 'lg_retro', pool: 'late', cool: 200, need: () => ME().credits.length >= 6, title: 'A retrospective', text: () => 'A museum of the moving image wants a retrospective of your work: every credit, a weekend of screenings, a conversation on stage.',
    opts: [
      { k: 'curate', label: () => 'Curate it yourself and introduce every film', check: ['com', 13], go: (c, ok) => { lateFx(ok ? { fame: 6, stand: 1.4, energy: -10, mile: 'A retrospective of your work' } : { fame: 3, stand: .5, energy: -10 }); return ok ? 'You watch your old work with strangers. They laugh at things you\'d forgotten were funny.' : 'Your introductions run long. The projectionist glares at you.'; } },
      { k: 'let', label: () => 'Let them do it; turn up for the conversation', go: c => { lateFx({ fame: 3, stand: .6 }); return 'The interviewer asks the one question you hoped nobody would. You answer it honestly.'; } },
      { k: 'no', label: () => 'Too soon for a retrospective', go: c => 'You say you\'re not done yet. Everybody likes that answer.' }] },
  { id: 'lg_lawsuit', pool: 'late', need: () => ME().credits.length >= 3, mk: c => { c.amt = lateAmt(.02, 8000, 400000); },
    title: 'A lawsuit', text: c => `A writer you've never heard of claims you stole their idea. Their lawyer would settle for ${fmtCash(c.amt)}. Your lawyer says you'd probably win in court, "probably".`,
    opts: [
      { k: 'settle', label: c => `Settle: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stress: -2 }); return 'It goes away. A gossip site calls it "an admission". It isn\'t.'; } },
      { k: 'fight', label: () => 'Fight it', check: ['eth', 13], go: (c, ok) => { lateFx(ok ? { stand: .6, stress: 6, energy: -6 } : { cash: -c.amt * 2, stress: 10, stand: -.4 }); return ok ? 'The judge throws it out in an afternoon. Your lawyer sends a bill and a bottle of champagne.' : `You lose, on a technicality, and it costs ${fmtCash(c.amt * 2)}.`; } }] },
  { id: 'lg_protege', pool: 'late', need: () => careerLevel() >= 4, mk: c => { c.who = lateWho('young'); }, needC: c => c.who !== null,
    title: 'Someone wants a mentor', text: c => `${lname(c.who)} writes you a long, careful email: they've studied your work, and would you meet them once a month, for a year?`,
    opts: [
      { k: 'yes', label: () => 'Say yes', go: c => { c.tag = 'Your protégé'; lateFx({ tie: 14, energy: -5, xp: { com: .2 } }, c); lateLater(lateR(52, 110), 'protege', { who: c.who }); return 'The first coffee runs three hours. They ask better questions than you did at their age.'; } },
      { k: 'once', label: () => 'Meet them once and give your best advice', check: ['com', 12], go: (c, ok) => { lateFx({ tie: ok ? 8 : 3 }, c); return ok ? 'You give them one piece of advice. They write it on their hand.' : 'You talk about yourself for an hour. They\'re polite about it.'; } },
      { k: 'no', label: () => 'No time', go: c => 'You don\'t answer. Later you wish you had.' }] },
  { id: 'lg_gala', pool: 'late', cool: 78, need: () => (ME().fame || 0) >= 10 || careerLevel() >= 5, title: 'Hosting the gala', text: () => 'A children\'s hospital wants you to host its gala: a ballroom, eight hundred guests, an auction and a microphone.',
    opts: [
      { k: 'yes', label: () => 'Host it, and work the room for the auction', check: ['cha', 13], go: (c, ok) => { lateFx(ok ? { fame: 4, stand: 1, energy: -8 } : { fame: 2, energy: -8, stress: 4 }); return ok ? 'You get a studio head to pay six figures for a walk-on part in your next film. The hospital gets a new wing.' : 'Your joke about the auctioneer doesn\'t land. The money still comes in.'; } },
      { k: 'give', label: c => `Just write a cheque: ${fmtCash(lateAmt(.01, 2000, 100000))}`, cost: () => lateAmt(.01, 2000, 100000), go: c => { lateFx({ stand: .5 }); return 'They read your name out. You\'re at home in your socks.'; } },
      { k: 'no', label: () => 'Not your kind of night', go: c => 'They find a comedian. The comedian is very good.' }] },
  { id: 'lg_doc', pool: 'late', mk: c => { c.amt = lateAmt(.025, 10000, 700000); c.who = lateWho('director'); c.cause = ppick(['a river being poisoned upstream of a town', 'the last projectionists in the country', 'a prison theatre company', 'a cooperative of women cinematographers in the 1970s', 'a town that lost its only cinema and built another']); }, needC: c => c.who !== null,
    title: 'A documentary', text: c => `${lname(c.who)} wants to make a documentary about ${c.cause}. No broadcaster will commit. ${fmtCash(c.amt)} would make it.`,
    opts: [
      { k: 'yes', label: c => `Commission it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ tie: 10 }, c); lateLater(lateR(30, 60), 'doc', { who: c.who, cause: c.cause, amt: c.amt }); return 'They start filming the next week. You get a field recording at 3am: rain on a tin roof, and somebody laughing.'; } },
      { k: 'no', label: () => 'Pass', go: c => 'They make a short version on their phone. It\'s quite good.' }] },
  { id: 'lg_profile', pool: 'late', cool: 104, need: () => (ME().fame || 0) >= 5 || careerLevel() >= 5, title: 'A magazine profile', text: () => 'A glossy magazine wants a long profile: two days with a writer who has a reputation for seeing through people.',
    opts: [
      { k: 'candid', label: () => 'Let them see everything', check: ['eth', 14], go: (c, ok) => { lateFx(ok ? { fame: 6, stand: .8 } : { fame: 4, stand: -.6, stress: 8 }); return ok ? 'The piece is generous and true. Strangers stop you to say they liked it.' : 'They quote the thing you said about your old boss. Your old boss reads it.'; } },
      { k: 'polish', label: () => 'Keep it polished', go: c => { lateFx({ fame: 2 }); return 'The piece is nice. Nobody remembers it a week later.'; } },
      { k: 'no', label: () => 'Decline', go: c => 'They run a shorter piece without you, headlined "Hard to reach".' }] },
  { id: 'lg_chair', pool: 'late', need: () => careerLevel() >= 5 && !holdings().some(h => h.k === 'chair'), mk: c => { c.amt = Math.round(usd(1500 + careerLevel() * 400) / 50) * 50; },
    title: 'A visiting chair', text: c => `A university offers you a visiting professorship: one term, one day a week, ${fmtCash(c.amt)} a week and a room with your name on the door.`,
    opts: [
      { k: 'yes', label: () => 'Take it', go: c => { lateHold('chair', 'Visiting professorship', 0, c.amt, { until: S.week + 15 }); c.out = []; lateFx({ stand: .8, xp: { com: .2 }, meet: 'young', meetTag: 'Your student' }, c, c.out); return 'Your first lecture is to forty students and one sleeping dog. ' + c.out.join(' '); } },
      { k: 'no', label: () => 'You\'re not ready to be an academic', go: c => 'You keep the letter, though.' }] },
  { id: 'lg_vanity', pool: 'late', cool: 78, need: () => S.me.cash >= usd(300000), mk: c => { c.amt = lateAmt(.05, 40000, 2000000); c.what = ppick(['a small vineyard with a terrible farmhouse', 'a wooden sailing boat called Second Unit', 'a cottage by the sea with a screening room', 'a vintage convertible that has been in four films']); },
    title: 'Something just for you', text: c => `You've seen it twice now: ${c.what}. ${fmtCash(c.amt)}. You don't need it. That isn't the point.`,
    opts: [
      { k: 'buy', label: c => `Buy it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateHold('toy', c.what.charAt(0).toUpperCase() + c.what.slice(1), c.amt, -c.amt * .0008); lateFx({ stress: -15, fame: 1 }); return 'You spend a whole weekend there without checking your email. It\'s like a different life.'; } },
      { k: 'no', label: () => 'Be sensible', go: c => { lateFx({ stress: 2 }); return 'You are sensible. It\'s overrated.'; } }] },
  { id: 'lg_voting', pool: 'late', once: 1, need: () => careerLevel() >= 5 && !(S.me.flags && S.me.flags.voter !== undefined), title: 'Membership of the awards body', text: () => 'A letter on heavy paper: you have been invited to become a voting member of the body that gives the big awards. Screeners every autumn, ballots every winter, forever.',
    opts: [
      { k: 'yes', label: () => 'Accept', go: c => { lateFx({ stand: 1.5, flag: 'voter', mile: 'Became a voting member of the awards body' }); return 'Your first screener arrives in October. You watch all of them, which apparently makes you unusual.'; } },
      { k: 'no', label: () => 'Decline: you don\'t believe in judging art', go: c => { lateFx({ fame: 2 }); return 'A trade paper runs your letter. It\'s quoted for years.'; } }] },
  { id: 'lg_sabbatical', pool: 'late', need: () => !S.me.jobs.length || S.me.stress >= 50, mk: c => { c.amt = lateAmt(.01, 3000, 60000); c.place = ppick(['Kyoto', 'Patagonia', 'the Hebrides', 'Oaxaca', 'Sicily', 'Hokkaido in the snow', 'a cabin with no signal']); },
    title: 'Time away', text: c => `You could go to ${c.place} for a month. Nobody needs you this month. That's the strange new thing about your life now. About ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'go', label: c => `Go: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stress: -30, energy: 25, xp: { tas: .3, vis: .3 }, pages: 40 }); return 'You fill a notebook. Half of it is about the light. The other half is a film.'; } },
      { k: 'no', label: () => 'Stay, there\'s always something', go: c => 'There is always something.' }] },
  { id: 'lg_buyout', pool: 'late', need: () => holdings().some(h => h.val > 0 && h.k !== 'relic') && careerLevel() >= 4, mk: c => { const H = holdings().filter(h => h.val > 0 && h.k !== 'relic'); c.h = H[Math.floor(prnd() * H.length)].w; c.mult = lateR(.85, 1.25); },
    title: 'An offer for what you own', text: c => { const h = holdings().find(x => x.w === c.h); return h ? `A company wants to buy ${h.name.toLowerCase()} from you for ${fmtCash(h.val * c.mult)}.` : 'An offer comes and goes.'; },
    opts: [
      { k: 'sell', label: () => 'Sell', go: c => { const i = holdings().findIndex(x => x.w === c.h); if (i < 0) return 'It\'s already gone.'; const h = holdings()[i]; S.me.lateA.splice(i, 1); S.me.cash += Math.round(h.val * c.mult); return `Sold for ${fmtCash(h.val * c.mult)}. You drive past it once, afterwards.`; } },
      { k: 'no', label: () => 'It\'s not for sale', go: c => { lateFx({ stand: .2 }); return 'They raise the offer once, then go away.'; } }] },

  // ===== producing: your money, your company, your films =====
  { id: 'pr_found', pool: 'late', need: () => S.me.company === undefined && typeof canFound === 'function' && canFound(), title: 'Your own company', text: () => `Your lawyer, over lunch: "You keep backing other people's films. Why not your own? Set up a company: an office, a bank account, your name on the door. About ${fmtCash(usd(FOUND_COST))} to start."`,
    opts: [
      { k: 'yes', label: () => 'Found it', go: c => { foundCompany({ name: '' }); const co = myCo(); return co ? `${co.name} exists. You can put money into it and make films from your Create page.` : 'The paperwork stalls. Maybe next year.'; } },
      { k: 'no', label: () => 'Stay a private investor', go: c => 'You like your freedom. Companies have meetings.' }] },
  { id: 'pr_hotspec', pool: 'late', need: () => (S.me.holdings || []).filter(h => h.made === undefined && !h.lapsed).length < 2, mk: c => { const w = bestIn(S.me.hub, ['writer'], q => q.c.wri + prnd() * 10) || null; c.who = w ? w.id : null; if (w) { c.genre = ppick(tasteOf(w).genres); c.title = titleFor(c.genre, S.me.hub); c.score = clamp(Math.round(w.c.wri * 3 + 20 + prnd() * 20), 40, 95); c.amt = Math.round(usd(700 + c.score * 35) * lateR(2.5, 4) / 500) * 500; } },
    needC: c => c.who !== null, title: 'A hot script goes out on Monday', text: c => `Every producer in town will have ${c.title}, a ${c.genre.toLowerCase()} by ${lname(c.who)}, by Monday morning. Their agent will take a pre-emptive offer tonight: ${fmtCash(c.amt)} for an eighteen-month option.`,
    opts: [
      { k: 'pre', label: c => `Pre-empt it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateOption(c, c.amt); return `It's yours, for now. ${c.title} goes in your drawer with a ribbon on it. Make it or sell it on: it's on your Create page.`; } },
      { k: 'read', label: () => 'Read it first and bid on Monday', check: ['tas', 14], go: (c, ok) => { if (!ok) return 'You read it twice and can\'t decide. By Monday lunchtime it\'s gone.'; if (S.me.cash < c.amt * .8) return 'You love it. You can\'t afford it.'; S.me.cash -= Math.round(c.amt * .8); lateOption(c, Math.round(c.amt * .8)); return `You read it at midnight and know by page ten. You win on Monday for ${fmtCash(c.amt * .8)}.`; } },
      { k: 'no', label: () => 'Let the market have it', go: c => 'It sells to a studio for a fortune. You\'ll see how they ruin it.' }] },
  { id: 'pr_star', pool: 'late', need: () => !!myCo() && ((S.me.holdings || []).some(h => h.made === undefined && !h.lapsed) || (S.me.scripts || []).some(x => x.grade && x.made === undefined)), mk: c => { const q = bestIn(S.me.hub, ['actor'], q => (q.fame || 0) + prnd() * 20); c.who = q ? q.id : null; }, needC: c => c.who !== null,
    title: 'A star wants in', text: c => `${lname(c.who)}'s manager calls: their client has heard about your project and "would love to be part of it". It's the kind of name that gets a film financed by Friday.`,
    opts: [
      { k: 'yes', label: () => 'Take the meeting and make them want it', check: ['cha', 13], go: (c, ok) => { c.tag = ok ? 'Wants to work with you' : 'Met about your project'; lateFx({ tie: ok ? 14 : 4 }, c); return ok ? `${lname(c.who)} reads the script in the car park and calls you from the motorway. They're in, if the money is.` : 'The meeting is lovely and noncommittal. They\'re "circling".'; } },
      { k: 'no', label: () => 'You want an unknown', go: c => { lateFx({ stand: .2 }); return 'The manager is baffled. You feel quietly principled.'; } }] },
  { id: 'pr_slate', pool: 'late', need: () => !!myCo() && myCo().closed === null && careerLevel() >= 4, mk: c => { c.amt = lateAmt(.3, 500000, 40000000); },
    title: 'Money for your slate', text: c => `A hedge fund that wants "exposure to content" offers to put ${fmtCash(c.amt)} into ${myCo().name}'s next films, in return for a share of everything they earn.`,
    opts: [
      { k: 'yes', label: () => 'Take the money', check: ['fin', 13], go: (c, ok) => { const co = myCo(); const a = ok ? c.amt : c.amt * .6; co.cash += a / 1e6; lateFx({ stand: .6 }); return ok ? `You negotiate a fair split. ${fmtCash(a)} lands in ${co.name}'s account.` : `They drive a hard bargain. ${fmtCash(a)}, and they want a seat at every greenlight meeting.`; } },
      { k: 'no', label: () => 'Stay independent', go: c => 'Your films stay yours, slower.' }] },
  { id: 'pr_auteur', pool: 'late', need: () => !!myCo() || careerLevel() >= 5, mk: c => { const q = bestIn(S.me.hub, ['director'], q => q.standing + prnd() * 25); c.who = q ? q.id : null; }, needC: c => c.who !== null,
    title: 'An auteur between films', text: c => `${lname(c.who)} is between films and between studios, after a public row. Their agent says they're looking for "a producer who'll protect them".`,
    opts: [
      { k: 'yes', label: () => 'Offer them a home', check: ['pack', 13], go: (c, ok) => { c.tag = ok ? 'Wants to work with you' : 'Met about a film'; lateFx({ tie: ok ? 12 : 4, stand: ok ? .5 : 0 }, c); return ok ? 'Dinner runs late. By the end they\'re sketching shots on the tablecloth for a film with your name on it.' : 'They\'re charming, and talking to three other producers.'; } },
      { k: 'no', label: () => 'Too much trouble', go: c => 'You\'ve heard the stories. You let someone else find out if they\'re true.' }] },
  { id: 'pr_pickup', pool: 'late', need: () => careerLevel() >= 4, mk: c => { c.genre = ppick(['Drama', 'Comedy', 'Horror', 'Thriller', 'Documentary', 'Romance']); c.title = titleFor(c.genre === 'Documentary' ? 'Drama' : c.genre, S.me.hub); c.amt = lateAmt(.06, 25000, 3000000); },
    title: 'A finished film, unsold', text: c => `${c.title}, a ${c.genre.toLowerCase()} that played well at a festival, still has no distributor. The filmmakers will sell you the rights for ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'buy', label: c => `Buy and release it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateLater(lateR(16, 40), 'pickup', { title: c.title, amt: c.amt }); return 'You book cinemas in twelve cities and a poster designer who works nights.'; } },
      { k: 'no', label: () => 'Pass', go: c => 'It goes straight to a streamer and disappears into the algorithm.' }] },
  { id: 'pr_pitchme', pool: 'late', mk: c => { c.who = lateWho('young'); c.genre = ppick(['Drama', 'Comedy', 'Horror', 'Thriller', 'Sci-fi', 'Romance', 'Crime', 'Western']); c.title = titleFor(c.genre, S.me.hub); c.amt = lateAmt(.015, 3000, 150000); }, needC: c => c.who !== null,
    title: 'A pitch in a lift', text: c => `${lname(c.who)} catches you in a lift and has eleven floors to pitch ${c.title}, a ${c.genre.toLowerCase()}. They need ${fmtCash(c.amt)} to write it properly.`,
    opts: [
      { k: 'fund', label: c => `Pay for the draft: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { c.tag = 'You paid for their script'; lateFx({ tie: 10 }, c); lateLater(lateR(14, 30), 'draft', { who: c.who, title: c.title, genre: c.genre }); return 'They get out at the ground floor in a daze. The draft is due in four months.'; } },
      { k: 'card', label: () => 'Give them your card', go: c => { c.tag = 'Pitched you in a lift'; lateFx({ tie: 3 }, c); return 'They email within the hour. You admire the hustle.'; } },
      { k: 'no', label: () => 'Get out at your floor', go: c => 'You get out at the fourth floor. It wasn\'t your floor.' }] },
  // ===== more of the late game =====
  { id: 'lg_town', pool: 'late', cool: 104, title: 'A small town wants you', text: () => 'A small town where you once shot something writes: their festival is dying. Would you be its patron, come every year, and lend it your name?',
    opts: [
      { k: 'yes', label: () => 'Become its patron', go: c => { lateFx({ stand: .8, fame: 1, stress: -4, flag: 'patron' }); return 'They name the closing-night award after you. The trophy is a carved wooden owl.'; } },
      { k: 'no', label: () => 'Send a donation and a nice letter', go: c => { lateFx({ cash: -usd(2000) }); return 'They read your letter out at the opening. It gets a laugh in the right place.'; } }] },
  { id: 'lg_rival_dinner', pool: 'late', cool: 60, mk: c => { const ids = Object.keys(S.me.known).map(Number).filter(id => !P(id).dead && opinion(id) < -5); c.who = ids.length ? ids[Math.floor(prnd() * ids.length)] : lateWho('power'); }, needC: c => c.who !== null,
    title: 'Dinner with a rival', text: c => `${lname(c.who)} invites you to dinner. Just the two of you. After everything.`,
    opts: [
      { k: 'peace', label: () => 'Go, and make peace', check: ['eth', 13], go: (c, ok) => { lateFx({ tie: ok ? 18 : 4, stress: ok ? -6 : 2 }, c); return ok ? 'You both apologise for different things. By dessert you\'re planning a film.' : 'It\'s civil. That\'s all it is.'; } },
      { k: 'deal', label: () => 'Go, and find out what they want', check: ['pack', 14], go: (c, ok) => { lateFx(ok ? { tie: 6, cash: lateAmt(.01, 5000, 200000) } : { tie: -4 }, c); return ok ? 'They want your help on a deal. You take a finder\'s fee and a favour.' : 'They wanted information. You gave them some without meaning to.'; } },
      { k: 'no', label: () => 'Decline', go: c => 'Some doors stay shut. This one, you shut.' }] },
  { id: 'lg_biopic', pool: 'late', once: 1, need: () => careerLevel() >= 6, title: 'They want to make a film about you', text: () => 'A writer has optioned a magazine article about your life. They want your blessing, your stories and, ideally, your old letters.',
    opts: [
      { k: 'yes', label: () => 'Help them get it right', check: ['com', 14], go: (c, ok) => { lateFx(ok ? { fame: 6, stand: 1, mile: 'Somebody made a film about your life' } : { fame: 3, stress: 6 }); return ok ? 'The actor playing you visits for a week and copies the way you hold a coffee cup. It\'s unsettling and moving.' : 'They make you nicer than you were and your enemies worse. Everyone is cross.'; } },
      { k: 'no', label: () => 'Refuse', go: c => 'They make it anyway, unauthorised. It\'s not very good, which is some comfort.' }] },
  { id: 'lg_hometown', pool: 'late', cool: 104, mk: c => { c.amt = lateAmt(.02, 10000, 500000); }, title: 'The cinema back home', text: c => `The cinema in the town where you grew up, the one where you saw everything, is up for sale. ${fmtCash(c.amt)} would save it as a community trust.`,
    opts: [
      { k: 'yes', label: c => `Save it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stand: .6, stress: -10, mile: 'Saved the cinema in your hometown' }); return 'You go back for the reopening. The usher is the same man. He remembers what you used to buy at the kiosk.'; } },
      { k: 'no', label: () => 'You can\'t save everything', go: c => 'It becomes flats. You don\'t go back for a while.' }] },
  { id: 'lg_mentorlunch', pool: 'late', cool: 52, mk: c => { const ids = Object.keys(S.me.known).map(Number).filter(id => !P(id).dead && P(id).standing > ME().standing - 5 && opinion(id) > 0); c.who = ids.length ? ids[Math.floor(prnd() * ids.length)] : null; }, needC: c => c.who !== null,
    title: 'Lunch with someone you look up to', text: c => `${lname(c.who)}, who has done everything you want to do, asks you to lunch. "No agenda. I just like your work."`,
    opts: [
      { k: 'ask', label: () => 'Ask the question you\'ve always wanted to', check: ['cha', 12], go: (c, ok) => { lateFx({ tie: ok ? 10 : 4, xp: { tas: .2, pack: .1 } }, c); return ok ? 'They answer it, and then tell you something about their own worst year that you will remember for the rest of yours.' : 'You lose your nerve and talk about restaurants. It\'s still a good lunch.'; } },
      { k: 'listen', label: () => 'Mostly listen', go: c => { lateFx({ tie: 6 }, c); return 'They talk for two hours. You take no notes and remember all of it.'; } }] },
  { id: 'lg_board_charity', pool: 'late', cool: 104, need: () => careerLevel() >= 5, title: 'A seat on a board', text: () => 'The film archive wants you on its board of trustees: four meetings a year, a lot of reading, and fundraising dinners.',
    opts: [
      { k: 'yes', label: () => 'Join', go: c => { c.out = []; lateFx({ stand: .7, energy: -4, meet: 'power', meetTag: 'On the archive board' }, c, c.out); return 'The first meeting is three hours on the boiler. The second is about saving forty films. ' + c.out.join(' '); } },
      { k: 'no', label: () => 'Not now', go: c => 'They ask someone from a bank.' }] },
  { id: 'lg_impulse', pool: 'late', cool: 40, mk: c => { c.amt = lateAmt(.004, 1000, 40000); c.what = ppick(['first-class tickets to a festival on a whim', 'a projector for the garden', 'a week of lessons with a great cinematographer', 'a dinner for your whole old crew', 'the full collection of a defunct film magazine']); },
    title: 'A small extravagance', text: c => `It would cost ${fmtCash(c.amt)}: ${c.what}.`,
    opts: [
      { k: 'yes', label: c => `Treat yourself: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ stress: -8, xp: { tas: .1 } }); return 'Worth every cent, you decide, and mostly mean it.'; } },
      { k: 'no', label: () => 'Not today', go: c => 'You close the tab.' }] },
  // ===== the independent life: between jobs, on your own terms =====
  { id: 'in_grant', pool: 'indie', mk: c => { c.amt = Math.round(usd(lateR(6000, 25000)) / 500) * 500; }, title: 'A grant deadline', text: c => `The arts council's development grant closes on Friday: up to ${fmtCash(c.amt)} for a project "of artistic ambition". The form is eleven pages long.`,
    opts: [
      { k: 'apply', label: () => 'Write the application properly', check: ['com', 13], go: (c, ok) => { lateFx(ok ? { cash: c.amt, stand: .4, energy: -6 } : { energy: -6, stress: 3 }); return ok ? `Six weeks later: yes. ${fmtCash(c.amt)} and a letter that says your project "sings".` : 'A form rejection, with a typo in your name.'; } },
      { k: 'no', label: () => 'Skip it', go: c => 'You spend Friday making the thing instead of describing it.' }] },
  { id: 'in_collab', pool: 'indie', mk: c => { c.who = lateWho('known'); }, needC: c => c.who !== null, title: 'Let\'s make something', text: c => `${lname(c.who)} calls: "We're both free. Let's make a short. This weekend. No money, no permission."`,
    opts: [
      { k: 'yes', label: () => 'Make it', check: ['vis', 12], go: (c, ok) => { lateFx(ok ? { tie: 8, xp: { vis: .3, tas: .2 }, fame: 1, energy: -10 } : { tie: 4, energy: -10 }, c); return ok ? 'Two days, one location, a borrowed camera. It\'s the best thing either of you has made in a year.' : 'It doesn\'t work, but you laugh more than you have in months.'; } },
      { k: 'no', label: () => 'Not this weekend', go: c => { lateFx({ tie: -1 }, c); return 'They make it with someone else. It\'s fine. It\'s good, actually.'; } }] },
  { id: 'in_residency', pool: 'indie', title: 'A residency', text: () => 'A foundation offers you four weeks at a residency by a lake: a room, a desk, meals at seven, other artists at dinner.',
    opts: [
      { k: 'yes', label: () => 'Go', go: c => { c.out = []; lateFx({ stress: -20, energy: 15, xp: { tas: .25, vis: .25 }, pages: 50, meet: 'young', meetTag: 'At the residency' }, c, c.out); return 'You write more in four weeks than in the last four months. A painter at dinner tells you your ending is a lie, and they\'re right. ' + c.out.join(' '); } },
      { k: 'no', label: () => 'You can\'t leave the city now', go: c => 'You stay. The city doesn\'t notice.' }] },
  { id: 'in_microcinema', pool: 'indie', title: 'A screening of your work', text: () => 'A microcinema in a former laundrette wants to show your work: one night, forty seats, a Q&A and cheap wine.',
    opts: [
      { k: 'yes', label: () => 'Do the Q&A', check: ['cha', 12], go: (c, ok) => { c.out = []; lateFx(ok ? { fame: 2, stand: .3, meet: 'known' } : { fame: 1 }, c, c.out); if (ok) lateFx({ meet: 'young', meetTag: 'At your screening' }, c, c.out); return (ok ? 'It sells out. Someone asks a question that changes how you see your own film. ' : 'Twenty-two people. They\'re the right twenty-two. ') + c.out.join(' '); } },
      { k: 'no', label: () => 'Not ready to show it', go: c => 'You keep tinkering. It\'s never quite ready.' }] },
  { id: 'in_podcast', pool: 'indie', title: 'A podcast', text: () => 'A film podcast with a cult following wants you on for an episode about the film that made you want to do this.',
    opts: [
      { k: 'yes', label: () => 'Go on and be yourself', check: ['cha', 12], go: (c, ok) => { lateFx(ok ? { fame: 3 } : { fame: 1, stress: 2 }); return ok ? 'Two hours fly by. The episode gets clipped and passed around for a week.' : 'You say "um" two hundred times. Someone counts.'; } },
      { k: 'no', label: () => 'Decline', go: c => 'They have someone else on. You listen. You\'d have been better.' }] },
  { id: 'in_brand', pool: 'indie', mk: c => { c.amt = Math.round(usd(lateR(8000, 30000) * (1 + careerLevel() * .4)) / 500) * 500; c.brand = ppick(['a sportswear company', 'a car maker', 'a bank', 'an energy drink', 'a supermarket']); }, title: 'A commercial', text: c => `${c.brand.charAt(0).toUpperCase() + c.brand.slice(1)} wants you for a commercial. ${fmtCash(c.amt)} for a week's work. The script involves a dancing mascot.`,
    opts: [
      { k: 'yes', label: () => 'Take the money', go: c => { lateFx({ cash: c.amt, stand: -.2, energy: -8 }); return 'The mascot is a man named Doug. Doug is a consummate professional.'; } },
      { k: 'yours', label: () => 'Take it, if you can rewrite the script', check: ['vis', 14], go: (c, ok) => { lateFx(ok ? { cash: c.amt, fame: 2, energy: -8 } : { stress: 3 }); return ok ? 'Your version wins an advertising award. Doug is very proud.' : 'They say thanks but no thanks, and find someone who likes mascots.'; } },
      { k: 'no', label: () => 'Turn it down', go: c => { lateFx({ stand: .1 }); return 'You turn it down, and feel righteous for a day, then poorer for a month.'; } }] },
  { id: 'in_workshop', pool: 'indie', mk: c => { c.amt = Math.round(usd(lateR(800, 3000) * (1 + careerLevel() * .3)) / 50) * 50; }, title: 'A weekend workshop', text: c => `A community arts centre wants you to teach a weekend workshop. ${fmtCash(c.amt)} and all the biscuits you can eat.`,
    opts: [
      { k: 'yes', label: () => 'Teach it', check: ['com', 11], go: (c, ok) => { c.out = []; lateFx(ok ? { cash: c.amt, xp: { com: .2 }, meet: 'young', meetTag: 'At your workshop' } : { cash: c.amt, stress: 2 }, c, c.out); return (ok ? 'A retired bus driver makes the best film of the weekend. ' : 'Nobody does the exercise you planned. ') + c.out.join(' '); } },
      { k: 'no', label: () => 'Not your thing', go: c => 'They find someone else. The biscuits go to waste.' }] },
  { id: 'in_crowd', pool: 'indie', title: 'Crowdfunding', text: () => 'You could crowdfund the passion project: a video, a target, thirty days of asking everyone you know for money.',
    opts: [
      { k: 'yes', label: () => 'Launch it', check: ['cha', 14], go: (c, ok) => { const a = Math.round(usd(lateR(8000, 40000) * (1 + (ME().fame || 0) / 30)) / 100) * 100; lateFx(ok ? { cash: a, fame: 2, energy: -10 } : { cash: a * .25, energy: -10, stress: 6 }); return ok ? `It hits its target in nine days. ${fmtCash(a)}. Strangers believe in you, which is terrifying.` : `It limps to a quarter of the target. You keep what you raised: ${fmtCash(a * .25)}, and a lot of awkward thank-you emails.`; } },
      { k: 'no', label: () => 'You hate asking for money', go: c => 'You keep saving instead. Slower, but nobody\'s watching.' }] },
  { id: 'in_lab', pool: 'indie', title: 'A festival lab', text: () => 'A festival\'s development lab is taking eight projects. A week in the mountains with mentors, if they pick yours.',
    opts: [
      { k: 'apply', label: () => 'Apply with your best project', check: ['vis', 14], go: (c, ok) => { c.out = []; lateFx(ok ? { stand: .8, xp: { vis: .3, tas: .2 }, meet: 'power', meetTag: 'Your lab mentor' } : { stress: 2 }, c, c.out); return (ok ? 'You\'re in. A week of notes from people who\'ve made films you love. ' : 'You make the shortlist of twenty, not the eight.') + c.out.join(' '); } },
      { k: 'no', label: () => 'Not this year', go: c => 'Next year, you tell yourself.' }] },
  { id: 'in_pitch', pool: 'indie', title: 'Pitch night', text: () => 'A bar, a stage, five minutes each. Twelve people pitch, three producers listen, one drink token.',
    opts: [
      { k: 'yes', label: () => 'Pitch', check: ['pack', 13], go: (c, ok) => { c.out = []; lateFx(ok ? { stand: .4, meet: 'power', meetTag: 'Heard your pitch' } : { stress: 3 }, c, c.out); return (ok ? 'A producer finds you at the bar and asks for the script. ' : 'You go blank at minute three. A kind stranger buys you a drink. ') + c.out.join(' '); } },
      { k: 'watch', label: () => 'Just watch', go: c => { lateFx({ xp: { pack: .15 } }); return 'You learn more watching twelve pitches than from any book.'; } }] },
  { id: 'in_cabin', pool: 'indie', mk: c => { c.who = lateWho('friend'); }, needC: c => c.who !== null, title: 'A cabin for a week', text: c => `${lname(c.who)} has a cabin and a free week: "Go and write. There's no internet. There's a goat."`,
    opts: [
      { k: 'yes', label: () => 'Go', go: c => { lateFx({ tie: 5, pages: 45, stress: -12 }, c); return 'You write forty pages and make friends with the goat.'; } },
      { k: 'no', label: () => 'Stay home', go: c => 'You write four pages and refresh your email a hundred times.' }] },
  { id: 'in_video', pool: 'indie', mk: c => { c.amt = Math.round(usd(lateR(3000, 15000)) / 250) * 250; }, title: 'A music video', text: c => `A band you like wants a music video. ${fmtCash(c.amt)}, a warehouse, one day and complete freedom, "within reason".`,
    opts: [
      { k: 'yes', label: () => 'Shoot something wild', check: ['vis', 13], go: (c, ok) => { lateFx(ok ? { cash: c.amt, fame: 3, xp: { vis: .3 }, energy: -10 } : { cash: c.amt, energy: -10 }); return ok ? 'It goes everywhere. The band\'s song goes everywhere with it.' : 'It\'s fine. The band likes it. Nobody else notices.'; } },
      { k: 'no', label: () => 'Pass', go: c => 'They hire someone with a drone.' }] },
  { id: 'in_coop', pool: 'indie', mk: c => { c.amt = Math.round(usd(400) / 10) * 10; }, title: 'A filmmakers\' co-op', text: c => `A co-op of independent filmmakers shares kit, an edit suite and a WhatsApp group of four hundred messages a day. Membership is ${fmtCash(c.amt)} a year.`,
    opts: [
      { k: 'join', label: c => `Join: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { c.out = []; lateFx({ meet: 'young', meetTag: 'In your co-op' }, c, c.out); lateFx({ meet: 'known', xp: { setm: .1 } }, c, c.out); return 'You borrow a lens the first week and lend your sofa the second. ' + c.out.join(' '); } },
      { k: 'no', label: () => 'You work alone', go: c => 'Alone is quieter. Not always better.' }] },
  { id: 'in_consult', pool: 'indie', need: () => careerLevel() >= 3, mk: c => { c.amt = Math.round(usd(1500 + careerLevel() * 1200) / 100) * 100; }, title: 'A day\'s consulting', text: c => `A studio wants one day of your eyes on a troubled project. ${fmtCash(c.amt)}, no commitment, no credit.`,
    opts: [
      { k: 'yes', label: () => 'Give them your honest notes', check: ['tas', 13], go: (c, ok) => { c.out = []; lateFx(ok ? { cash: c.amt, stand: .5, meet: 'power', meetTag: 'You consulted for them' } : { cash: c.amt }, c, c.out); return (ok ? 'Your three notes save the film\'s third act. They know it. ' : 'They nod and ignore everything you said. The cheque clears.') + c.out.join(' '); } },
      { k: 'no', label: () => 'Not interested', go: c => 'They find someone hungrier.' }] },

  { id: 'in_shortfest', pool: 'indie', cool: 40, title: 'A short-film festival', text: () => 'A short-film festival wants a new short from you for its showcase, in eight weeks. No fee, a good audience and a jury that matters.',
    opts: [
      { k: 'yes', label: () => 'Make something new for it', check: ['vis', 14], go: (c, ok) => { lateFx(ok ? { fame: 3, stand: .6, xp: { vis: .3 }, energy: -12 } : { energy: -12, stress: 4 }); return ok ? 'It wins the jury prize. The trophy is heavy and ugly and you love it.' : 'You finish it at 4am the night before. It plays. That\'s all.'; } },
      { k: 'old', label: () => 'Send something old', go: c => { lateFx({ fame: 1 }); return 'It plays in the afternoon slot. A student asks you about it afterwards and you\'re glad you sent it.'; } }] },
  { id: 'in_archive', pool: 'indie', cool: 52, title: 'Old footage', text: () => 'A friend clearing a relative\'s house finds boxes of home movies from the 1960s: weddings, a factory, a city that doesn\'t exist any more.',
    opts: [
      { k: 'make', label: () => 'Make something from them', check: ['tas', 13], go: (c, ok) => { lateFx(ok ? { fame: 2, xp: { tas: .3 }, stand: .4 } : { xp: { tas: .15 } }); return ok ? 'A twelve-minute film with no words. It makes people cry in three languages.' : 'You scan everything and make nothing yet. The boxes sit by your desk.'; } },
      { k: 'archive', label: () => 'Give them to the archive', go: c => 'The archivists are delighted. Someone else will make the film.' }] },
  { id: 'in_teachonline', pool: 'indie', cool: 52, mk: c => { c.amt = Math.round(usd(R2(2000, 9000) * (1 + careerLevel() * .3)) / 100) * 100; }, title: 'An online course', text: c => `A course platform wants you to film a class: eight lessons on what you know. ${fmtCash(c.amt)} up front and a share of sales.`,
    opts: [
      { k: 'yes', label: () => 'Film it properly', check: ['com', 12], go: (c, ok) => { lateFx(ok ? { cash: c.amt * 1.5, fame: 2 } : { cash: c.amt }); return ok ? 'It sells steadily for years. Strangers quote your lessons back to you.' : 'It\'s fine. You hate watching yourself on it.'; } },
      { k: 'no', label: () => 'Your secrets stay secret', go: c => 'You keep your secrets. They\'re not that secret.' }] },
  { id: 'in_collector', pool: 'indie', cool: 52, need: () => ME().credits.length >= 1 || (S.me.makes || []).length, mk: c => { c.amt = Math.round(usd(R2(1500, 8000)) / 100) * 100; }, title: 'A collector', text: c => `A collector wants to buy something of yours: an early work, a storyboard, a notebook. They offer ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'sell', label: () => 'Sell the notebook', go: c => { lateFx({ cash: c.amt }); return 'It goes to a private collection. You miss it a little.'; } },
      { k: 'no', label: () => 'Some things aren\'t for sale', go: c => 'You keep it. You never look at it, but you keep it.' }] },
  // ===== life, for anyone =====
  { id: 'lf_premiere', pool: 'life', mk: c => { const L = S.active.map(i => S.films[i]).filter(f => f.hub === S.me.hub && f.stage === 3); c.film = L.length ? L[Math.floor(prnd() * L.length)].id : null; }, needC: c => c.film !== null,
    title: 'A premiere invitation', text: c => `An invitation to the premiere of ${S.films[c.film].title}: red carpet, a screening, an after-party in a hotel ballroom.`,
    opts: [
      { k: 'go', label: () => 'Go, and stay for the party', check: ['cha', 12], go: (c, ok) => { c.out = []; lateFx(ok ? { energy: -8, meet: 'power', meetTag: 'Met at a premiere' } : { energy: -8 }, c, c.out); return (ok ? 'You end up in a corner with someone important, arguing happily about a sequel. ' : 'You leave at eleven with a goody bag and sore feet. ') + c.out.join(' '); } },
      { k: 'no', label: () => 'Stay in', go: c => { lateFx({ energy: 6 }); return 'You watch the photos come in from your sofa.'; } }] },
  { id: 'lf_oldfriend', pool: 'life', mk: c => { c.who = lateWho('friend'); }, needC: c => c.who !== null, title: 'An old friend in town', text: c => `${lname(c.who)} is in town for a night and wants dinner. Somewhere loud, they say, somewhere with noodles.`,
    opts: [
      { k: 'yes', label: () => 'Go', go: c => { lateFx({ tie: 6, stress: -6, energy: -3 }, c); return 'Three hours, two bowls of noodles, a story you\'ll tell for years.'; } },
      { k: 'no', label: () => 'Rain check', go: c => { lateFx({ tie: -2 }, c); return 'They say next time. Next time is a year away.'; } }] },
  { id: 'lf_fan', pool: 'life', need: () => ME().credits.length >= 1, title: 'A letter', text: () => 'A handwritten letter, forwarded by someone: a stranger saw your work and it got them through a hard winter.',
    opts: [
      { k: 'reply', label: () => 'Write back', go: c => { lateFx({ stress: -6 }); return 'You write back three pages. You keep their letter in a drawer.'; } },
      { k: 'keep', label: () => 'Keep it and get back to work', go: c => { lateFx({ stress: -3 }); return 'You read it twice more that week.'; } }] },
  { id: 'lf_neighbour', pool: 'life', title: 'The neighbours', text: () => 'The neighbours have started a band. They practise at eleven at night. They are not good.',
    opts: [
      { k: 'talk', label: () => 'Knock and talk', check: ['cha', 11], go: (c, ok) => { lateFx(ok ? { stress: -4 } : { stress: 4 }); return ok ? 'They agree to stop at nine and ask you to direct their music video.' : 'They play louder. Out of spite, you think.'; } },
      { k: 'join', label: () => 'Join the band', go: c => { lateFx({ stress: -6, energy: -4 }); return 'You play tambourine. You are not good either. It\'s wonderful.'; } }] },
  { id: 'lf_family', pool: 'life', mk: c => { c.amt = Math.round(usd(lateR(300, 1200)) / 10) * 10; }, title: 'A call from home', text: c => 'Your family wants you home for a weekend. Somebody\'s birthday, somebody\'s new baby, somebody\'s strong opinion about your career.',
    opts: [
      { k: 'go', label: c => `Go home (${fmtCash(c.amt)})`, cost: c => c.amt, go: c => { lateFx({ stress: -12, energy: 4 }); return 'You sleep in your old room. Everyone asks if you\'ve met anyone famous.'; } },
      { k: 'call', label: () => 'Call instead', go: c => { lateFx({ stress: 2 }); return 'The call is nice. It isn\'t the same, and everyone knows it.'; } }] },
  { id: 'lf_doctor', pool: 'life', need: () => S.me.stress >= 40, title: 'The doctor\'s advice', text: () => 'A routine check-up. The doctor looks at your blood pressure, then at you. "What do you do for work?"',
    opts: [
      { k: 'listen', label: () => 'Actually listen', go: c => { lateFx({ stress: -10, energy: 5 }); return 'You start walking to places. It helps more than you\'d admit.'; } },
      { k: 'shrug', label: () => 'Nod and ignore it', go: c => { lateFx({ stress: 2 }); return 'You nod. You ignore it. Your body files a note.'; } }] },
  { id: 'lf_class', pool: 'life', mk: c => { c.who = lateWho('power'); }, needC: c => c.who !== null, title: 'A masterclass in town', text: c => `${lname(c.who)} is giving a public masterclass. Tickets sold out in minutes; a friend has a spare.`,
    opts: [
      { k: 'ask', label: () => 'Go, and ask a question', check: ['cha', 13], go: (c, ok) => { lateFx(ok ? { xp: { tas: .2 }, tie: 4 } : { xp: { tas: .15 } }, c); return ok ? 'Your question gets a long answer and, afterwards, a handshake and a name remembered.' : 'Your question comes out wrong. The answer is still worth hearing.'; } },
      { k: 'listen', label: () => 'Go and just listen', go: c => { lateFx({ xp: { tas: .2 } }); return 'You fill four pages of notes. One line is worth all of them.'; } }] },
  { id: 'lf_books', pool: 'life', mk: c => { c.amt = Math.round(usd(lateR(60, 400)) / 5) * 5; }, title: 'A bookshop find', text: c => `A second-hand bookshop has a first edition of a great director's interviews, annotated by somebody who clearly disagreed with all of it. ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'buy', label: c => `Buy it: ${fmtCash(c.amt)}`, cost: c => c.amt, go: c => { lateFx({ xp: { tas: .25 } }); return 'The margin notes are better than the book.'; } },
      { k: 'no', label: () => 'Leave it', go: c => 'You think about it all week.' }] },
  { id: 'lf_marathon', pool: 'life', title: 'A rainy Sunday', text: () => 'It\'s pouring. A friend suggests a marathon: three films you\'ve all been meaning to see, a sofa, too much food.',
    opts: [
      { k: 'yes', label: () => 'Host it', go: c => { for (const id of Object.keys(S.me.known).map(Number).filter(id => !P(id).dead && opinion(id) > 20).slice(0, 3)) addTie(ME(), P(id), 3); lateFx({ stress: -8, xp: { tas: .15 } }); return 'The second film is a masterpiece. The third is so bad it\'s a better night than the second.'; } },
      { k: 'no', label: () => 'Work instead', go: c => 'You get a lot done. You also miss a good day.' }] },
  { id: 'lf_thesis', pool: 'life', need: () => ME().credits.length >= 1, title: 'A student\'s thesis', text: () => 'A film student is writing a thesis on people like you and wants an hour of your time on the phone.',
    opts: [
      { k: 'yes', label: () => 'Give them the hour', check: ['com', 11], go: (c, ok) => { lateFx({ xp: { com: .15 }, stand: ok ? .2 : 0 }); return ok ? 'They quote you in the abstract. Their professor emails to say thanks.' : 'They spell your name wrong in the acknowledgements, but they\'re grateful.'; } },
      { k: 'no', label: () => 'Too busy', go: c => 'They interview someone else. You\'re a footnote.' }] },
  { id: 'lf_wallet', pool: 'life', title: 'A wallet on the pavement', text: () => 'A wallet on the pavement outside a café: cash, cards, and a studio ID with a face you half recognise.',
    opts: [
      { k: 'return', label: () => 'Track them down and return it', go: c => { const id = lateWho('power'); if (id !== null) { meet(id, 'You returned their wallet', 8); return `It belongs to ${P(id).name}. They insist on buying you lunch.`; } return 'You hand it in at the café. A thank-you note arrives a week later.'; } },
      { k: 'hand', label: () => 'Hand it in at the café', go: c => 'You hand it in and forget about it.' }] },
  { id: 'lf_run', pool: 'life', title: 'A charity run', text: () => 'A colleague is organising a charity 10K for a hospice and needs runners. You haven\'t run since school.',
    opts: [
      { k: 'yes', label: () => 'Sign up and train', check: ['col', 11], go: (c, ok) => { lateFx(ok ? { energy: 6, stress: -8, stand: .1 } : { energy: -8 }); return ok ? 'You finish in fifty-eight minutes, sweaty and weirdly proud.' : 'You walk the last three kilometres. You still finish.'; } },
      { k: 'sponsor', label: () => 'Sponsor them instead', go: c => 'You sponsor them generously. They send a sweaty photo from the finish.' }] },
  { id: 'lf_lostfilm', pool: 'life', cool: 40, title: 'A film you\'d forgotten', text: () => 'Late at night, flicking through channels, you land on a film you loved at fifteen and haven\'t seen since.',
    opts: [
      { k: 'watch', label: () => 'Watch it to the end', go: c => { lateFx({ xp: { tas: .15 }, energy: -4, stress: -4 }); return 'It\'s not as good as you remembered. One scene is better.'; } },
      { k: 'bed', label: () => 'Go to bed', go: c => { lateFx({ energy: 4 }); return 'You go to bed and dream about it anyway.'; } }] },
  { id: 'lf_dog', pool: 'life', once: 1, title: 'A dog', text: () => 'A friend\'s dog has had puppies. One of them has chosen you, apparently, by falling asleep on your shoe.',
    opts: [
      { k: 'yes', label: () => 'Take it home', go: c => { lateFx({ stress: -10, mile: 'Got a dog' }); S.me.flags = S.me.flags || {}; S.me.flags.dog = S.week; return 'You name it after a cinematographer. It eats a script.'; } },
      { k: 'no', label: () => 'Your life is too busy for a dog', go: c => 'It is. You still think about the puppy.' }] },
  { id: 'lf_reunion', pool: 'life', cool: 104, title: 'A reunion', text: () => 'Your old school is holding a reunion. Twenty years of people who remember you as someone else.',
    opts: [
      { k: 'go', label: () => 'Go', check: ['cha', 11], go: (c, ok) => { lateFx(ok ? { stress: -6 } : { stress: 3 }); return ok ? 'Your old drama teacher is there. You tell them they were right about everything.' : 'Everyone wants to know which famous people you know. You start making some up.'; } },
      { k: 'no', label: () => 'Skip it', go: c => 'You look at the photos online. Everyone looks older except the drama teacher.' }] },
  { id: 'lf_volunteer', pool: 'life', cool: 52, title: 'A youth film club', text: () => 'A youth club in a rough part of town has some cameras and no one to teach. Would you give them a Saturday?',
    opts: [
      { k: 'yes', label: () => 'Give them a Saturday', go: c => { lateFx({ stress: -6, stand: .2, xp: { com: .15 } }); return 'A fourteen-year-old shoots a better tracking shot than you did at twenty-five. You tell them so.'; } },
      { k: 'regular', label: () => 'Give them every other Saturday', go: c => { lateFx({ stress: -8, stand: .4, energy: -6, flag: 'youthclub' }); return 'By spring they\'ve made a film. You sit at the back of the screening and it\'s the best night of your year.'; } }] }
];
const LATE_BY = {}; for (const t of LATE) LATE_BY[t.id] = t;
// open a 'late' item: fill the context, price the choices, grey out what you can't afford
function lateOffer(pool) {
  const M = S.me, seen = M.lateSeen = M.lateSeen || {}, cool = pool === 'late' ? 104 : 78;   // each comes round every two years or so
  const L = LATE.filter(t => t.pool === pool && (seen[t.id] === undefined || (!t.once && S.week - seen[t.id] >= (t.cool || cool))) && (!t.need || t.need()));
  for (let tries = 0; tries < 4 && L.length; tries++) {
    const i = Math.floor(prnd() * L.length), t = L.splice(i, 1)[0], c = {};
    if (t.mk) t.mk(c);
    if (t.needC && !t.needC(c)) continue;
    seen[t.id] = S.week;
    const choices = t.opts.map(o => { const cost = o.cost ? Math.round(o.cost(c)) : 0; return { k: o.k, label: o.label(c), check: o.check, cost, dis: cost && M.cash < cost ? 'Not enough in the bank' : undefined }; });
    inbox('late', t.title, t.text(c), Object.assign({ late: t.id, ctx: c, choices }, c.who !== null && c.who !== undefined ? { person: c.who } : {}, c.film !== null && c.film !== undefined ? { film: c.film } : {}));
    return true;
  }
  return false;
}
function latePick(it, k) {
  if (it.kind !== 'late') return false;
  const t = LATE_BY[it.late] || LATE_PAY_BY[it.late], c = it.ctx || {}, ch = it.choices.find(x => x.k === k), o = t && t.opts.find(x => x.k === k);
  it.done = true;
  if (!o) { it.result = { t: 'It passes.' }; return true; }
  if (ch.cost && S.me.cash < ch.cost) { it.result = { t: 'By the time you get round to it, the money isn\'t there.' }; return true; }
  if (ch.cost) S.me.cash -= ch.cost;
  const ok = o.check ? roll(o.check[0], o.check[1]) : true;
  const t2 = o.go(c, ok, it);
  recalc(ME());
  it.result = { ok: o.check ? ok : null, roll: o.check ? S.me.lastRoll : null, t: t2 };
  return true;
}

// an option on a script, the same kind your Create page uses: pitch it to a company or make it yourself
function lateOption(c, price) {
  const M = S.me, w = P(c.who);
  (M.holdings = M.holdings || []).push({ id: M.seq++, writer: c.who, title: c.title, genre: c.genre, theme: tasteOf(w).theme, score: c.score || 60, price, w: S.week, from: S.week, to: S.week + OPTION_WEEKS, pitched: {} });
  meet(c.who, 'You optioned their script', 8);
  milestone(`Optioned ${c.title} by ${w.name}`, 'work');
}
// ---- what comes back later ----
// Follow-ups that need a decision are 'late' items too (from LATE_PAY); the rest are notes.
const LATE_PAY = [
  { id: 'lp_rights', title: 'A studio calls about your rights', text: c => `A studio wants to remake ${S.films[c.film].title}. They'll buy the rights from you for ${fmtCash(c.offer)}, or give you a producer credit and less money.`,
    opts: [
      { k: 'sell', label: c => `Sell: ${fmtCash(c.offer)}`, go: c => { S.me.cash += c.offer; return 'You sell. The remake comes out in two years. It\'s fine.'; } },
      { k: 'credit', label: c => `Take ${fmtCash(c.offer * .5)} and a producer credit`, go: c => { S.me.cash += Math.round(c.offer * .5); lateFx({ stand: 1, fame: 2, mile: `Producer credit on the remake of ${S.films[c.film].title}` }); return 'Your name goes on the poster, small, near the bottom. It counts.'; } },
      { k: 'keep', label: () => 'Keep them, and develop the remake yourself', go: c => { const f = S.films[c.film], w = bestIn(S.me.hub, ['writer'], q => q.c.wri + prnd() * 10); if (w && (S.me.holdings || []).filter(h => h.made === undefined && !h.lapsed).length < 2) { lateOption({ who: w.id, title: f.title, genre: f.genre, score: clamp(Math.round(55 + w.c.wri * 1.5 + prnd() * 15), 40, 92) }, 0); return `You hire ${w.name} to write it. ${f.title} is on your Create page now, yours to pitch or make.`; } lateFx({ stand: .2 }); return 'Not for sale. You might make it yourself one day.'; } }] },
  { id: 'lp_relic', title: 'Someone wants your memorabilia', text: c => `A collector wants ${c.what} and offers ${fmtCash(c.offer)}.`,
    opts: [
      { k: 'sell', label: c => `Sell: ${fmtCash(c.offer)}`, go: c => { S.me.cash += c.offer; const i = holdings().findIndex(h => h.k === 'relic' && h.w === c.hw); if (i >= 0) S.me.lateA.splice(i, 1); return 'It goes to a climate-controlled room in another country.'; } },
      { k: 'keep', label: () => 'Keep it', go: c => 'It stays on your wall. Visitors always ask about it.' }] }
];
const LATE_PAY_BY = {}; for (const t of LATE_PAY) LATE_PAY_BY[t.id] = t;
function latePayItem(id, c) { const t = LATE_PAY_BY[id]; inbox('late', t.title, t.text(c), { late: id, ctx: c, choices: t.opts.map(o => ({ k: o.k, label: o.label(c) })) }); }
const LATE_DUE = {
  film: c => { const r = prnd() + (c.q - 50) / 120, who = lname(c.who);
    if (r > 1.05) { const m = lateR(2, 3.5); S.me.cash += Math.round(c.amt * m); lateFx({ stand: 2, fame: 4, mile: `Backed a hit: ${who}'s first film` }); if (P(c.who)) { P(c.who).standing = clamp(P(c.who).standing + 8, 0, 100); addTie(ME(), P(c.who), 8); } inbox('note', 'The first film you backed is a hit', `${who}'s film wins at a festival and sells for real money. Your share: ${fmtCash(c.amt * m)}. They thank you by name in every interview.`, { person: c.who }); }
    else if (r > .6) { const m = lateR(.8, 1.4); S.me.cash += Math.round(c.amt * m); lateFx({ stand: .8 }); inbox('note', 'The film you backed finds its audience', `${who}'s film does steady business: ${fmtCash(c.amt * m)} back to you, and good reviews.`, { person: c.who }); }
    else if (r > .3) { const m = lateR(.2, .7); S.me.cash += Math.round(c.amt * m); inbox('note', 'The film you backed', `${who}'s film comes out quietly and goes away quietly. ${fmtCash(c.amt * m)} back. They're already writing the next one.`, { person: c.who }); }
    else inbox('note', 'The film you backed', `${who}'s film doesn't find a distributor. The money is gone. It played one festival, and you were there, and it was better than they'll ever know.`, { person: c.who }); },
  rights: c => { const f = S.films[c.film]; if (!f) return; latePayItem('lp_rights', { film: c.film, offer: Math.round(c.amt * lateR(.55, 1.6)) }); },
  restored: c => { lateFx({ fame: 4, stand: 1.2, mile: 'A lost film you paid to restore premiered again' }); inbox('note', 'The restored film premieres', `The film you paid to restore, ${c.what.split(',')[0]}, plays to a full house at a festival. The pianist improvises for two hours. They thank you from the stage.`); },
  repay: c => { if (prnd() < .65) { S.me.cash += c.amt; if (P(c.who)) addTie(ME(), P(c.who), 4); inbox('note', `${lname(c.who)} pays you back`, `An envelope with ${fmtCash(c.amt)} and a note: "With interest, in gratitude."`, { person: c.who }); } else inbox('note', `${lname(c.who)} and the loan`, 'They still can\'t pay you back. They apologise every time you meet, which is less often now.', { person: c.who }); },
  play: c => { const r = prnd(); if (r > .82) { const m = lateR(2, 4); S.me.cash += Math.round(c.amt * m); lateFx({ fame: 2, stand: .6 }); inbox('note', 'The play is a smash', `The transfer sells out for a year. Your share: ${fmtCash(c.amt * m)}. You go back on closing night and cry at the curtain call.`); } else if (r > .4) { S.me.cash += Math.round(c.amt * .75); inbox('note', 'The play closes', `It runs six months and nearly breaks even: ${fmtCash(c.amt * .75)} back.`); } else inbox('note', 'The play closes early', 'Bad reviews and a hot summer. It closes in five weeks. The money is gone.'); },
  album: c => { const r = prnd(); if (r > .6) { S.me.cash += Math.round(c.amt * lateR(1.2, 3)); lateFx({ stand: .4 }); inbox('note', 'The album', `${lname(c.who)}'s record gets picked up by a label and played everywhere you go for a month.`, { person: c.who }); } else inbox('note', 'The album', `${lname(c.who)}'s record comes out. It's beautiful and almost nobody hears it. They dedicate it to you.`, { person: c.who }); if (P(c.who)) addTie(ME(), P(c.who), 4); },
  audit: c => { if (prnd() < .45) { const fine = Math.round(c.amt * .7); S.me.cash -= fine; lateFx({ stress: 12, stand: -.6 }); inbox('note', 'The tax office writes', `The film partnerships were a tax scheme, the tax office decides, and not a legal one. You owe ${fmtCash(fine)}. Your accountant has stopped answering the phone.`); } },
  relic: c => { const h = holdings().find(x => x.k === 'relic' && x.name.toLowerCase() === c.what.toLowerCase()); if (h) latePayItem('lp_relic', { what: c.what, offer: Math.round(c.amt * lateR(.6, 1.5)), hw: h.w }); },
  startup: c => { const r = prnd(); if (r > .94) { const m = lateR(4, 10); S.me.cash += Math.round(c.amt * m); lateFx({ mile: 'A start-up you backed sold for a fortune' }); inbox('note', 'The start-up sells', `The company you backed (${c.what}) is bought by a tech giant. Your stake is worth ${fmtCash(c.amt * m)}. You still have the hoodie.`); } else if (r > .65) { S.me.cash += Math.round(c.amt * lateR(.8, 1.5)); inbox('note', 'The start-up', `The company (${c.what}) is bought by a rival for a modest sum. You get your money back, roughly.`); } else inbox('note', 'The start-up folds', `The company (${c.what}) runs out of money. The founders write a heartfelt post about what they learned. You learned something too.`); },
  doc: c => { const r = prnd(); if (r > .45) { lateFx({ stand: 1.2, fame: 3 }); S.me.cash += Math.round(c.amt * lateR(.3, 1.2)); if (P(c.who)) P(c.who).standing = clamp(P(c.who).standing + 5, 0, 100); inbox('note', 'The documentary', `${lname(c.who)}'s documentary about ${c.cause} wins the audience award at a festival and gets a broadcaster. You're thanked in the credits, first.`, { person: c.who }); } else inbox('note', 'The documentary', `The documentary about ${c.cause} is finished. A few festivals, a streaming release nobody notices. The people in it love it.`, { person: c.who }); },
  pickup: c => { const r = prnd(); if (r > .82) { const m = lateR(2, 4); S.me.cash += Math.round(c.amt * m); lateFx({ stand: 1, fame: 2 }); inbox('note', `${c.title} breaks out`, `The film you picked up plays for months. ${fmtCash(c.amt * m)} back. The filmmakers send you a case of wine and their next script.`); } else if (r > .4) { S.me.cash += Math.round(c.amt * lateR(.6, 1.1)); inbox('note', `${c.title} comes and goes`, 'The film does respectable business and leaves cinemas with its dignity. You roughly break even.'); } else { S.me.cash += Math.round(c.amt * .1); inbox('note', `${c.title} struggles`, 'Opening weekend clashes with a superhero film. It\'s gone in a fortnight. A streamer buys it cheaply.'); } },
  draft: c => { if (!P(c.who)) return; const q = P(c.who), sc = clamp(Math.round((q.c ? q.c.wri : 8) * 3 + 15 + prnd() * 30), 30, 92); if ((S.me.holdings || []).filter(h => h.made === undefined && !h.lapsed).length >= 2) { inbox('note', `The draft of ${c.title}`, `${q.name} sends the draft. It's ${gradeOf(sc) <= 'B' ? 'good' : 'not there yet'}. You have no room for another project, so you send it to a friend who does.`, { person: c.who }); addTie(ME(), q, 4); return; } lateOption({ who: c.who, title: c.title, genre: c.genre, score: sc }, 0); inbox('note', `The draft of ${c.title}`, `${q.name} delivers the draft you paid for. It's yours to develop: it's on your Create page as an option.`, { person: c.who }); },
  protege: c => { if (!P(c.who)) return; P(c.who).standing = clamp(P(c.who).standing + 10, 0, 100); lateFx({ stand: 1, fame: 2 }); inbox('note', `${lname(c.who)} thanks you`, `${lname(c.who)}, your protégé, wins their first award. In the speech, before their family, they thank you.`, { person: c.who }); }
};
// once a week: holdings earn or cost, follow-ups come due, and now and then a holding has a story
function lateWeek() {
  const M = S.me; if (!M) return;
  let net = 0;
  for (let i = holdings().length - 1; i >= 0; i--) { const h = M.lateA[i]; if (h.until && S.week >= h.until) { M.lateA.splice(i, 1); inbox('note', `${h.name} ends`, h.k === 'deal' ? 'The first-look deal runs out. They offer to renew at half the money. You think about it.' : 'The term ends. The students give you a card signed by all of them.'); continue; } net += h.net; }
  if (net) M.cash += net;
  const due = (M.lateQ || []).filter(x => x.w <= S.week);
  if (due.length) { M.lateQ = M.lateQ.filter(x => x.w > S.week); for (const x of due) if (LATE_DUE[x.f]) LATE_DUE[x.f](x.c); }
  // a holding's week, now and then
  const H = holdings().filter(h => h.k === 'cinema' || h.k === 'ranch');
  if (H.length && prnd() < .04) { const h = H[Math.floor(prnd() * H.length)];
    if (h.k === 'cinema') { const good = prnd() < .55; const v = Math.round(h.val * (good ? .004 : -.006)); M.cash += v; inbox('note', good ? 'A full house at your cinema' : 'Your cinema needs a new roof', good ? `A director turns up unannounced to introduce their own film at your cinema. Word gets out; it sells out. ${fmtCash(v)} extra this week.` : `The roof finally goes in a storm. ${fmtCash(-v)} to fix it. The audience on Saturday watches with umbrellas.`); }
    else { const v = Math.round(Math.max(usd(2500), h.val * .015)); M.cash += v; inbox('note', 'A big booking at your location', `A studio books your location for a month of night shoots. ${fmtCash(v)}. They promise to repaint the barn.`); } }
}
// ---- the weekly rhythm ----
// Called each morning: on Tuesdays, a chance of a late-game opportunity if you can afford one; on Friday (and, as a
// backstop, Sunday) if the week has had nothing in it, something turns up.
function lateMorning() {
  const M = S.me, W = M && M.wk; if (!W) return;
  const L = careerLevel(), rich = lateRich();
  if (W.day === 1 && (rich || L >= 5)) { const ch = (L >= 7 ? .45 : L >= 6 ? .35 : L >= 5 ? .25 : .12) + (rich ? .1 : 0); if (prnd() < ch) lateOffer('late'); }
  if (W.day === 2 && typeof tvShowrunnerWeek === 'function') tvShowrunnerWeek();
  if (typeof ageMorning === 'function') ageMorning();
  if ((W.day === 4 || W.day === 6) && !W.beats) weekBeat();
}
function weekBeat() {
  const M = S.me, W = M.wk, rich = lateRich(), free = !M.jobs.length;
  const order = [];
  if (rich && prnd() < .6) order.push('late');
  if (free) order.push('indie');
  if (!free && prnd() < .6) order.push('work');
  order.push('scene', 'life', 'indie', 'late');
  for (const k of order) {
    if (W.beats) return;
    if (k === 'late' && !rich) continue;
    if (k === 'work') { const j = M.jobs[0], pool = (ROLE_SCENES[familyOf(j)] || []).filter(s => sceneFresh(s.id, 12)); if (pool.length) { const s = ppick(pool), f = j.film !== null ? S.films[j.film] : null, ctx = { head: j.head, film: j.film, dir: f ? f.dir : null, lead: f ? f.cast[0] : null, dp: f ? f.dp : null, prod: f ? f.prod : null, mates: j.mates || [] }; if (!/\{(dir|lead|dp|prod)\}/.test(s.text + JSON.stringify(s.opts)) || f) inbox('scene', s.title, fillScene(s.text, ctx), { job: j.id, scene: s.id, ctx, choices: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) }); } continue; }
    if (k === 'scene') { const keys = Object.keys(LIFE_SCENES); lifeScene(LIFE_SCENES[keys[Math.floor(prnd() * keys.length)]]); continue; }
    lateOffer(k);
  }
}

// ---- Today: working for yourself ----
function indieHTML() {
  const M = S.me, look = lookingForWork(), rw = runwayWeeks(), H = holdings(), net = H.reduce((s, h) => s + h.net, 0);
  const tog = `<button class="pill${look ? ' on' : ''}" data-auto="looking" title="When you're not looking, the game stops pushing jobs at you. The board is still there on Work.">💼 Looking for work</button>`;
  const hold = H.length ? `<p class="small">Your holdings: ${H.map(h => `${esc(h.name)}${h.net ? ` (${h.net > 0 ? '+' : '−'}${fmtCash(Math.abs(h.net)).replace('−', '')}/wk)` : ''}`).join(' · ')}${net ? `. Net ${net > 0 ? '+' : '−'}${fmtCash(Math.abs(net)).replace('−', '')} a week.` : ''}</p>` : '';
  if (M.jobs.length || look) return `<p class="small autop">${tog}</p>${hold}`;
  return `<div class="indie"><p class="small autop">${tog}</p><h4>Working for yourself</h4><p class="small">${rw >= 520 ? 'You never have to work for anyone again.' : `${Math.floor(rw)} weeks of living costs in the bank.`} Nobody's waiting for you on Monday: make something, back someone, take the meetings you want.</p>
    <div class="qa"><button class="btn-s ghost" data-jump="create">✍️ Your projects</button><button class="btn-s ghost" data-jump="people">👥 Call someone</button><button class="btn-s ghost" data-jump="compete">🏆 Contests</button></div>${hold}</div>`;
}
