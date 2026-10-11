// ---------------- Pets, with lives of their own ----------------
// Every animal now has a temperament (nerve, drive, sociability, brains, looks), revealed over its first two months
// with you unless it came with papers, and a bond with you that grows when you walk it, play with it and are around.
// What it can become depends on both:
//  · Training: puppy class, the Good Citizen test (from 1989; an obedience certificate before), trick titles and a
//    screen-ready course. A private trainer halves the time.
//  · Shows, for papered dogs and pedigree cats: weekend shows win points by beating the field (bigger fields, more
//    points; 3+ is a "major"). Fifteen points with two majors makes a champion; champions campaign for season points,
//    October to September, and the top of the season is invited to the big one (Westminster in February from 1877,
//    Crufts in March from 1891, a national show elsewhere): breed, group, Best in Show. No prize money; the people
//    in the ringside seats are the prize.
//  · Working lives: a therapy team (from 1976), raising a guide-dog puppy (from 1929), two years of search-and-rescue
//    training and call-outs, donating a young dog to the police, or giving a retired one a sofa.
//  · The screen: a Screen-Ready rating, an animal agency (15%), bookings from print to features, the stand-in who
//    gets the lead when the star dog walks off, the animal awards (the PATSY 1951–86, the Palm Dog from 2001, the
//    Golden Collar 2012–18), and a breed boom when a film with your dog in it is a hit.
//  · Insurance (Sweden 1890, the UK 1947, the US 1982) pays 80% of vet bills. Flat-faced breeds can need breathing
//    surgery, big dogs their hips.
//  · From 2010 a pet can have its own following, and brands pay for posts. Too many shoots and it gets fed up.
//  · Moving abroad with animals means quarantine where the rules say so (the UK until 2000, Australia and New Zealand).
// Every chance shown on a button is the chance rolled.
PET_KINDS.push({ k: 'guidepup', n: 'Guide-dog puppy (in training)', body: 'dog', col: ['#E9C77B', '#F6E3B4'], fee: 0, wk: 17, life: 12, tier: 9, calm: 5, d: 'Yours for a year, then someone else\'s eyes.' },
  { k: 'k9', n: 'Retired police dog', body: 'dog', col: ['#5A3A22', '#C58B4D'], fee: 0, wk: 45, life: 12, tier: 9, calm: 4, d: 'Eight years of service. Now it guards the sofa.' });
for (const x of PET_KINDS.slice(-2)) PET_BY[x.k] = x;
const PET_SHELTER = new Set(['mutt', 'tabby', 'blackcat', 'greyhound', 'galgo', 'indie', 'aspin', 'caramelo', 'formosan', 'criollo', 'guidepup', 'k9']);
const PET_PEDIGREE_CAT = new Set(['persian', 'bengal', 'siamese', 'mainecoon', 'forestcat', 'van', 'mau', 'persianir']);
const PET_BRACHY = new Set(['pug', 'frenchie', 'pekingese']), PET_BIG = new Set(['lab', 'newfie', 'dogo', 'ridgeback', 'samoyed', 'wolfdog', 'doodle', 'k9']);
const TEMP_BIAS = { collie: { brains: 22, drive: 20 }, lab: { social: 20, brains: 8 }, guidepup: { social: 18, nerve: 15, brains: 10 }, k9: { nerve: 25, drive: 25, brains: 12 }, wolfdog: { drive: 15, social: -15 }, shiba: { social: -15, looks: 10 }, jindo: { social: -10, drive: 10 }, ridgeback: { nerve: 18 }, greyhound: { nerve: -8, social: 8 }, pug: { looks: 8, drive: -15 }, frenchie: { looks: 10, drive: -10 }, persian: { looks: 18, drive: -15 }, bengal: { drive: 15, brains: 10 }, siamese: { social: 10, brains: 12 }, corgi: { brains: 10, looks: 8 }, doodle: { social: 15, looks: 10 }, newfie: { nerve: 15, social: 15 }, samoyed: { social: 15, looks: 15 }, mutt: { nerve: 5 }, dackel: { drive: 10, nerve: 8 }, xolo: { looks: 5, brains: 8 }, poodle: { brains: 20 } };
const TEMP_KEYS = [['nerve', 'Nerve'], ['drive', 'Drive'], ['social', 'Sociability'], ['brains', 'Brains'], ['looks', 'Looks']];
function petTemp(p) {
  if (!p.t) { const r = hashRand((p.id * 2654435761 ^ (p.w * 97 + 13)) >>> 0), B = TEMP_BIAS[p.kind] || {}; p.t = {}; for (const [k] of TEMP_KEYS) p.t[k] = Math.round(clamp(30 + r() * 45 + (B[k] || 0) + (r() - .5) * 10, 5, 98)); }
  return p.t;
}
function petPapered(p) { const x = PET_BY[p.kind]; return !PET_SHELTER.has(p.kind) && (x.body === 'dog' ? x.fee >= 300 : PET_PEDIGREE_CAT.has(p.kind)); }
// a shelter animal shows you who it is over about eight weeks; a papered one comes with a breeder's notes
function petKnown(p, k) { if (petPapered(p) || p.kind === 'k9' || p.kind === 'guidepup') return true; const i = TEMP_KEYS.findIndex(x => x[0] === k); return S.week - p.w >= 2 + i * 1.5; }
const BOND_AT = [0, 8, 20, 36, 56], BOND_NAME = ['New', 'Settling in', 'Attached', 'Devoted', 'Inseparable'];
function petBond(p) { const v = p.bondP || 0; let b = 0; for (let i = 0; i < BOND_AT.length; i++) if (v >= BOND_AT[i]) b = i; return b; }
// ---- training ----
const PET_TRAIN = {
  basic: { n: 'Puppy class', wk: 6, fee: 40, body: ['dog'], d: 'Sit, stay, come, and not eating the lead.' },
  cgc: { n: 'Good Citizen test', wk: 1, fee: 20, body: ['dog'], need: 'basic', from: 1989, alt: 'Obedience certificate', d: 'Ten things a dog in public has to cope with, tested.' },
  trick1: { n: 'Trick titles: novice', wk: 4, fee: 30, body: ['dog', 'cat'], need: 'basic', d: 'Ten tricks, on cue.' },
  trick2: { n: 'Trick titles: advanced', wk: 6, fee: 40, body: ['dog', 'cat'], need: 'trick1', d: 'Props, sequences, distance.' },
  screen: { n: 'Screen-ready course', wk: 6, fee: 60, body: ['dog', 'cat', 'bird'], need: 'trick1', d: 'Hit a mark, follow a target stick, take a cue from across a set, hold still through take nine.' }
};
function petTrainOK(p, k) { const T = PET_TRAIN[k], x = PET_BY[p.kind]; if (!T.body.includes(x.body) || (p.titles || []).includes(k) || p.train) return false; if (T.need && !(p.titles || []).includes(T.need) && !(T.need === 'basic' && x.body !== 'dog')) return false; return petAge(p) >= .3; }
function petTrainName(k) { const T = PET_TRAIN[k]; return T.from && S.year < T.from ? T.alt : T.n; }
function petPass(p, k, pro) { const t = petTemp(p); return clamp(.35 + t.brains / 250 + t.nerve / 500 + petBond(p) * .07 + (pro ? .15 : 0) - (k === 'screen' ? .1 : 0), .1, .95); }
// ---- shows ----
function petShowKind(p) { const x = PET_BY[p.kind]; return x.body === 'dog' && petPapered(p) ? 'dog' : x.body === 'cat' && petPapered(p) ? 'cat' : null; }
function petShowScore(p, pro) { const t = petTemp(p), cond = (p.health + p.mood) / 2, tr = Math.min(100, (p.titles || []).length * 20); return t.looks * .55 + cond * .15 + tr * .1 + (pro ? 80 : 30 + petBond(p) * 6) * .2; }
function petField(p, w = S.week) { return 3 + Math.floor(hashRand((p.kind.length * 977 + w * 31) >>> 0)() * 14); }
function petWinP(p, pro) { const s = petShowScore(p, pro), N = petField(p); return clamp(1 / (1 + Math.exp(-(s - 56) / 7)) * 3 / (2 + N / 4), .02, .85); }
function petPts(N) { return N >= 15 ? 5 : N >= 10 ? 4 : N >= 7 ? 3 : N >= 4 ? 2 : 1; }
function petSeasonY(w = S.week) { return woy(w) >= 39 ? yearOf(w) + 1 : yearOf(w); }   // the show year ends on 30 September
function bigShow() { const m = HUBS[S.me.hub].m; return m === 'US' || m === 'CA' ? { n: 'Westminster', where: 'New York', wk: 6, from: 1877 } : ['UK', 'FR', 'IT', 'DE', 'ES', 'SE', 'DK', 'NL', 'PL', 'CZ', 'HU', 'FI'].includes(m) ? { n: 'Crufts', where: 'London', wk: 10, from: 1891 } : { n: 'the National Championship Show', where: HUBS[S.me.hub].name, wk: 15, from: 1900 }; }
function petInviteLine(p) { return 120 + Math.round(hashRand((p.kind.length * 131 + petSeasonY()) >>> 0)() * 120); }
// ---- the screen ----
function petRating(p) { const t = petTemp(p), T = p.titles || []; return Math.round(clamp(t.nerve * .3 + t.brains * .25 + t.looks * .15 + petBond(p) * 6 + T.length * 6 + (T.includes('screen') ? 15 : 0) - 20, 0, 100)); }
function petOnSetP(p) { const t = petTemp(p); return clamp(.45 + t.nerve / 200 + petBond(p) * .05 + (p.titles || []).length * .03, .2, .95); }
function petDayRate(p) { const b = PET_BY[p.kind].body; return usd(b === 'dog' ? 450 : b === 'cat' ? 350 : 250) * (1 + (p.fame || 0) / 20); }
// ---- money and health ----
function petInsFrom() { const m = HUBS[S.me.hub].m; return m === 'SE' ? 1890 : m === 'UK' ? 1947 : 1982; }
function petInsCost() { return petsOf().reduce((t, p) => t + usd({ dog: 14, cat: 7 }[PET_BY[p.kind].body] || 4), 0); }
function petBill(c) { const M = S.me; return M.petIns ? Math.round(c * .2) : c; }
function petQuarantine(h) { return h === 'london' ? (S.year < 2000 ? 26 : 0) : ['sydney', 'wellington'].includes(h) ? (S.year < 1990 ? 26 : 4) : 0; }
const PET_AWARDS = [{ n: 'the PATSY', from: 1951, to: 1986, wk: 10 }, { n: 'the Golden Collar', from: 2012, to: 2018, wk: 8 }, { n: 'the Palm Dog', from: 2001, to: 9999, wk: 21 }];

function pet2Act(a) {
  const M = S.me, me = ME(), p = petsOf().find(q => q.id === +a.id), x = p && PET_BY[p.kind];
  if (a.k === 'insure') { if (S.year < petInsFrom()) return false; M.petIns = !M.petIns; return true; }
  if (a.k === 'guide') { if (S.year < 1929 || petsOf().length >= petCap() || petsOf().some(q => q.kind === 'guidepup')) return false; M.petN = (M.petN || 0) + 1;
    const q = { id: M.petN, kind: 'guidepup', name: petName('guidepup', M.petN * 7 + S.week), w: S.week, born: S.week - 9, mood: 80, health: 90, hub: M.hub, guide: { until: S.week + 56 } };
    M.pets.push(q); diary(`A guide-dog school drops off ${q.name}, eight weeks old, with a lead, a jacket and a list of rules. You'll have them a year.`); return true; }
  if (!p) return false;
  if (a.k === 'walk') { if (p.walkW === S.week || M.energy < 4) return false; p.walkW = S.week; p.bondP = (p.bondP || 0) + 3; p.mood = clamp(p.mood + 8, 0, 100); M.stress = clamp(M.stress - 2, 0, 100); M.energy = clamp(M.energy - 2, 0, 100); return true; }
  if (a.k === 'train') { const T = PET_TRAIN[a.v]; if (!T || !petTrainOK(p, a.v) || (T.from && S.year < T.from && !T.alt)) return false; const pro = !!a.pro, wk = Math.max(1, Math.ceil(T.wk / (pro ? 2 : 1))), c = usd(T.fee) * T.wk + (pro ? usd(150) * wk : 0); if (M.cash < c) return false;
    M.cash -= c; p.train = { k: a.v, until: S.week + wk, pro }; diary(`${p.name} starts ${petTrainName(a.v).toLowerCase()}${pro ? ' with a private trainer' : ''}.`); return true; }
  if (a.k === 'show') { const sk = petShowKind(p); if (!sk || p.showW === S.week || petAge(p) < .5 || p.health < 40) return false; const pro = !!a.pro, c = usd(40) + (pro ? usd(125) : 0); if (M.cash < c || M.energy < 6) return false;
    const N = petField(p), pw = petWinP(p, pro); M.cash -= c; M.energy = clamp(M.energy - 6, 0, 100); M.stress = clamp(M.stress - 2, 0, 100); p.showW = S.week; const S2 = p.show = p.show || { pts: 0, majors: 0, n: 0, wins: 0, season: {} }; S2.n++;
    const won = prnd() < pw; let t;
    if (!won) t = `${p.name} is shown against ${N - 1} others and doesn't place.`;
    else if (!S2.ch) { const pts = petPts(N); S2.wins++; S2.pts += pts; if (pts >= 3) S2.majors++; t = `${p.name} wins the breed over ${N - 1} others: ${pts} point${pts > 1 ? 's' : ''}${pts >= 3 ? ', a major' : ''}.`;
      if (S2.pts >= 15 && S2.majors >= 2) { S2.ch = S.week; (p.titles = p.titles || []).push('ch'); t += ` That makes ${p.name} a champion.`; milestone(`${p.name} became a show champion`, 'life'); me.standing = clamp(me.standing + .5, 0, 100); } }
    else { S2.wins++; const y = petSeasonY(); let sp = N - 1; const gp = clamp(.08 + (petShowScore(p, pro) - 65) / 120, .02, .4), g = prnd() < gp; if (g) sp += 40; S2.season[y] = (S2.season[y] || 0) + sp; t = `${p.name} wins the breed${g ? ' and then the group' : ''}: ${sp} season points.`; }
    (p.log = p.log || []).push({ w: S.week, t }); diary(t); M.lastPetShow = { w: S.week, t, ok: won, p: pw }; return true; }
  if (a.k === 'therapy') { if (S.year < 1976 || x.body !== 'dog' || petAge(p) < 1 || S.week - p.w < 26 || petBond(p) < 2) return false; const W = p.work = p.work || {};
    if (W.therapy === 'cert') { if (W.visitW && S.week - W.visitW < 4) return false; W.visitW = S.week; M.stress = clamp(M.stress - 8, 0, 100); me.standing = clamp(me.standing + .15, 0, 100); p.bondP = (p.bondP || 0) + 2;
      if (prnd() < .2) { const line = pickLine(['an old projectionist who ran the same cinema for forty years', 'a veteran who was in a war film as an extra and never told anyone', 'a woman who writes to the same pen friend she had in 1962', 'a man who swears he taught a famous actor to ride'], S.week); diary(`On a visit with ${p.name}, you meet ${line}. You write it down that night: there's a film in it.`); M.stress = clamp(M.stress - 3, 0, 100); }
      else diary(`A morning of visits with ${p.name}. Nobody remembers your name; everybody remembers ${p.name}'s.`); return true; }
    if (W.therapyW && S.week - W.therapyW < 8) return false; const pp = petTherapyP(p); W.therapyW = S.week;
    if (prnd() < pp) { W.therapy = 'cert'; diary(`${p.name} passes the therapy-team evaluation.`); milestone(`${p.name} became a therapy dog`, 'life'); } else { W.therapy = 'notready'; diary(`The evaluator marks ${p.name} "not ready yet". You can try again in two months.`); } return true; }
  if (a.k === 'sar') { if (S.year < 1970 || x.body !== 'dog' || petAge(p) < 1 || (p.work && p.work.sar)) return false; const t = petTemp(p); if (t.drive < 55 || t.nerve < 55) return false; (p.work = p.work || {}).sar = { st: 'training', until: S.week + 100 }; diary(`${p.name} starts search-and-rescue training: two years of weekends in the woods.`); return true; }
  if (a.k === 'police') { const t = petTemp(p), age = petAge(p); if (x.body !== 'dog' || age < 1.5 || age > 3 || PET_BRACHY.has(p.kind) || x.small) return false; const ok = t.drive >= 75 && t.nerve >= 70 && prnd() < .5;
    if (!ok) { (p.work = p.work || {}).police = 'no'; diary(`The police K9 unit tests ${p.name} and politely says no: about two dogs in a thousand make it.`); return true; }
    p.gone = 'police'; p.goneW = S.week; M.stress = clamp(M.stress + 8, 0, 100); me.standing = clamp(me.standing + 1, 0, 100); diary(`${p.name} is selected for the police K9 unit. You hand over the lead and go home to a quiet flat.`); milestone(`Gave ${p.name} to the police K9 unit`, 'life'); return true; }
  if (a.k === 'agency') { if (p.agency || petRating(p) < 45) return false; p.agency = S.week; diary(`${p.name} signs with an animal agency. They take 15%.`); return true; }
  if (a.k === 'shoot') { if (S.year < 2010 || p.shootW === S.week || M.energy < 3) return false; p.shootW = S.week; M.energy = clamp(M.energy - 2, 0, 100); (p.shots = p.shots || []).push(S.week); p.shots = p.shots.filter(w => S.week - w < 4);
    const t = petTemp(p), F = p.follow || 0, cap = 15000 + t.looks * 400 + (p.fame || 0) * 40000, g = Math.round(((20 + t.looks * 1.2) * (1 + (p.fame || 0) / 4) + F * .02 * Math.max(0, 1 - F / cap)) * (.6 + prnd() * .8));
    p.follow = F + g; if (p.shots.length >= 3) p.mood = Math.max(Math.min(p.mood, 15), p.mood - 6); return true; }
  return false;
}
function petTherapyP(p) { const t = petTemp(p); return clamp(.25 + t.nerve / 250 + t.social / 250 + petBond(p) * .08, .1, .9); }
function petSarP(p) { const t = petTemp(p); return clamp(.4 + t.drive / 300 + petBond(p) * .05, .2, .9); }
function petGuideP(p) { const t = petTemp(p); return clamp(.35 + petBond(p) * .06 + ((p.titles || []).includes('basic') ? .1 : 0) + t.nerve / 400, .2, .85); }

function pet2Week() {
  const M = S.me, me = ME(); if (!M || !M.pets) return; const L = petsOf(); if (!L.length) return;
  if (M.petIns && S.year >= petInsFrom()) M.cash -= petInsCost();
  for (const p of L) { const x = PET_BY[p.kind]; petTemp(p);
    // they come with you: quarantine first where the law says so
    if (p.hub !== M.hub && !p.quar) { const q = petQuarantine(M.hub); if (q) { p.quar = S.week + q; M.cash -= usd(2500); diary(`${p.name} goes into quarantine for ${q} weeks: the rules where you've moved. ${fmtCash(usd(2500))}.`); } else p.hub = M.hub; }
    if (p.quar && S.week >= p.quar) { p.hub = M.hub; delete p.quar; diary(`${p.name} is out of quarantine and home.`); }
    if (p.mood >= 60 && !p.quar) p.bondP = (p.bondP || 0) + 1;
    // training ends
    if (p.train && S.week >= p.train.until) { const k = p.train.k, ok = prnd() < petPass(p, k, p.train.pro); delete p.train;
      if (ok) { (p.titles = p.titles || []).push(k); diary(`${p.name} passes: ${petTrainName(k).toLowerCase()}.`); } else diary(`${p.name} doesn't pass ${petTrainName(k).toLowerCase()} this time. Worth another go.`); }
    // guide-dog puppy: graduation day
    if (p.guide && S.week >= p.guide.until) { const ok = prnd() < petGuideP(p); delete p.guide;
      if (ok) { p.gone = 'graduated'; p.goneW = S.week; M.stress = clamp(M.stress - 15, 0, 100); me.standing = clamp(me.standing + 1, 0, 100); me.fame = (me.fame || 0) + .3; news('People', `${p.name}, raised by ${me.name}, graduates as a guide dog.`); diary(`${p.name} graduates. At the ceremony a woman takes the harness and says "hello, you". You cry in the car park, the good kind.`); milestone(`Raised ${p.name}, now a guide dog`, 'life'); }
      else inbox('pet2ev', `${p.name} is "career-changed"`, `${p.name} won't be a guide dog: too interested in squirrels. The school asks if you'd like to keep them.`, { pet: p.id, choices: [{ k: 'keep', label: `Keep ${p.name}` }, { k: 'return', label: 'Let the school rehome them' }] }); }
    // search and rescue
    const W = p.work || {};
    if (W.sar && W.sar.st === 'training') { M.cash -= usd(20); M.energy = clamp(M.energy - 2, 0, 100); if (S.week >= W.sar.until) { if (prnd() < petSarP(p)) { W.sar = { st: 'cert', cert: S.week }; diary(`${p.name} certifies as a search-and-rescue dog.`); milestone(`${p.name} certified for search and rescue`, 'life'); } else { W.sar.until = S.week + 26; diary(`${p.name} misses certification. Six more months of training.`); } } }
    if (W.sar && W.sar.st === 'cert') { if (S.week - W.sar.cert >= 156) { W.sar = { st: 'training', until: S.week + 8 }; diary(`${p.name}'s search certificate lapses after three years; recertification training starts.`); }
      else if (prnd() < .04 && !pending().some(it => it.kind === 'pet2ev' && it.sar)) inbox('pet2ev', `Call-out: someone is missing`, `A hiker has been missing since last night. The team wants ${p.name}. It means dropping everything for two days.`, { pet: p.id, sar: 1, choices: [{ k: 'sar_go', label: `Go with ${p.name}` }, { k: 'sar_no', label: 'Not this time' }] }); }
    // the agency calls
    if (p.agency && !pending().some(it => it.kind === 'pet2ev' && it.book)) { const r = petRating(p); if (prnd() < .02 + r / 1500) {
      const filming = S.active.map(i => S.films[i]).filter(f => f && f.stage === 2 && f.hub === M.hub), f = filming.length && prnd() < .45 ? filming[Math.floor(prnd() * filming.length)] : null;
      const kind = f ? 'film' : ['print ad', 'commercial', 'television episode'][Math.floor(prnd() * 3)], days = f ? 5 : kind === 'print ad' ? 1 : kind === 'commercial' ? 2 : 3, fee = Math.round(petDayRate(p) * days), pp = petOnSetP(p);
      inbox('pet2ev', `A booking for ${p.name}: ${f ? f.title : kind}`, `${f ? `${f.title} needs a ${x.body} for a ${prnd() < .3 ? 'stand-in' : 'small part'}` : `A ${kind} wants ${p.name}`}: ${days} day${days > 1 ? 's' : ''} at ${fmtCash(Math.round(fee / days))} a day, less the agency's 15%. You handle on set.`, { pet: p.id, book: 1, film: f ? f.id : undefined, fee, days, pp, choices: [{ k: 'book_yes', label: `Take it (${Math.round(pp * 100)}% chance ${p.name} gets it done)` }, { k: 'book_no', label: 'Pass' }] }); } }
    // brand deals for a following
    if (S.year >= 2010 && (p.follow || 0) >= 10000 && prnd() < .08 && !pending().some(it => it.kind === 'pet2ev' && it.brand)) { const v = Math.round(Math.min(usd(30000), usd(225) * Math.pow(p.follow / 10000, .7)));
      inbox('pet2ev', `A brand wants ${p.name}`, `A pet-food brand wants one sponsored post from ${p.name}'s account (${Math.round(p.follow).toLocaleString()} followers): ${fmtCash(v)}.`, { pet: p.id, brand: 1, fee: v, choices: [{ k: 'brand_yes', label: `Post it (${fmtCash(v)})` }, { k: 'brand_no', label: 'Keep the account honest' }] }); }
    // breed health
    if (PET_BRACHY.has(p.kind) && !p.brachy && prnd() < .01) { p.brachy = 1; const c = usd(4000); inbox('pet2ev', `${p.name} can't breathe properly`, `The vet says ${p.name}'s airway is too narrow, common in flat-faced breeds. Surgery: ${fmtCash(c)}${M.petIns ? ` (insurance pays 80%: you pay ${fmtCash(petBill(c))})` : ''}.`, { pet: p.id, c, choices: [{ k: 'surg', label: `Operate (${fmtCash(petBill(c))})` }, { k: 'nosurg', label: 'Manage it without' }] }); }
    if (PET_BIG.has(p.kind) && !p.hips && petAge(p) > 4 && prnd() < .006) { p.hips = 1; const c = usd(3500); inbox('pet2ev', `${p.name}'s hips`, `${p.name} is stiff getting up. Hip dysplasia, the vet says, common in big dogs. Surgery: ${fmtCash(c)}${M.petIns ? ` (you pay ${fmtCash(petBill(c))} after insurance)` : ''}.`, { pet: p.id, c, choices: [{ k: 'surg', label: `Operate (${fmtCash(petBill(c))})` }, { k: 'nosurg', label: 'Painkillers and short walks' }] }); }
  }
  // the big show: invitations go to the top of the season
  const B = bigShow();
  if (S.year >= B.from && woy() === B.wk - 2) for (const p of L.filter(q => q.show && q.show.ch && petShowKind(q) === 'dog')) { const y = petSeasonY(S.week - 20), pts = (p.show.season || {})[y] || 0; if (pts >= petInviteLine(p) && p.show.invited !== S.year) { p.show.invited = S.year;
    const pro = usd(750), s = petShowScore(p, true), pB = clamp(1 / (1 + Math.exp(-(s - 62) / 6)) * .55, .05, .8), pG = clamp(.12 + (s - 70) / 100, .03, .45), pS = clamp(.14 + (s - 75) / 100, .02, .4);
    inbox('pet2ev', `${p.name} is invited to ${B.n}`, `${p.name} finished the season with ${pts} points, inside the line. ${B.n} is in two weeks in ${B.where}. A professional handler: ${fmtCash(pro)}. The odds, honestly: best of breed ${Math.round(pB * 100)}%, then the group ${Math.round(pG * 100)}%, then Best in Show ${Math.round(pS * 100)}%.`, { pet: p.id, big: 1, fee: pro, pB, pG, pS, choices: [{ k: 'big_go', label: `Go (${fmtCash(pro)})` }, { k: 'big_no', label: 'Skip it this year' }] }); } }
  // the animal awards
  for (const A of PET_AWARDS) if (S.year >= A.from && S.year <= A.to && woy() === A.wk) for (const p of L.filter(q => (q.credits || []).some(f => S.films[f] && S.films[f].ry === S.year - 1 && (S.films[f].q || 0) >= 60))) if (prnd() < (A.n === 'the Palm Dog' ? .15 : .25)) {
    p.fame = (p.fame || 0) + 3; me.fame = (me.fame || 0) + .5; (p.awards = p.awards || []).push(`${A.n} ${S.year}`); news('Award', `${p.name} wins ${A.n}.`); diary(`${p.name} wins ${A.n}. The acceptance speech is a bark.`); milestone(`${p.name} won ${A.n}`, 'awards'); }
  // a hit with your animal in it starts a breed boom; two years on, the shelters fill up
  for (const p of L) for (const fid of p.credits || []) { const f = S.films[fid]; if (!f || f.rel === null || f.rel !== S.week - 1 || !(f.total >= f.cost * 3)) continue; const BB = S.breedBoom = S.breedBoom || {}; if (BB[p.kind] && S.week - BB[p.kind].w < 104) continue;
    BB[p.kind] = { w: S.week, f: f.id }; news('Industry', `Since ${f.title}, everyone wants a ${PET_BY[p.kind].n.toLowerCase()}. Breeders have waiting lists.`); }
  for (const [k, b] of Object.entries(S.breedBoom || {})) if (S.week - b.w === 104 && PET_BY[k]) news('People', `Shelters report a wave of ${PET_BY[k].n.toLowerCase()}s surrendered: the dogs people bought after ${S.films[b.f] ? S.films[b.f].title : 'that film'} grew up.`);
  // retired police dogs need sofas
  if (['own', 'loft', 'house', 'penthouse', 'beach', 'estate'].includes(M.life) && L.length < petCap() && prnd() < .004 && !pending().some(it => it.kind === 'pet2ev' && it.k9)) inbox('pet2ev', 'A retired police dog needs a home', 'A K9 handler you know of is moving abroad and can\'t take their retired dog: eight years old, impeccably trained, suspicious of postmen. Would you?', { k9: 1, choices: [{ k: 'k9_yes', label: 'Take the dog' }, { k: 'k9_no', label: 'Not right now' }] });
}
// breeders charge more for a breed everyone wants
function petFee(x) { const b = (S.breedBoom || {})[x.k]; return usd(x.fee) * (b && S.week - b.w < 104 ? 1.4 : 1); }
{ const _pa = petAct; petAct = function (a) { if (a.k === 'adopt') { const x = PET_BY[a.kind]; if (x && x.fee) { const extra = petFee(x) - usd(x.fee); if (extra > 0) { if (S.me.cash < petFee(x)) return false; const ok = _pa(a); if (ok) S.me.cash -= extra; return ok; } } } return _pa(a); }; }
function pet2Pick(it, k) {
  if (it.kind !== 'pet2ev') return false; const M = S.me, me = ME(); it.done = true;
  if (it.k9) { if (k === 'k9_yes') { M.petN = (M.petN || 0) + 1; const q = { id: M.petN, kind: 'k9', name: pickLine(['Rex', 'Duke', 'Kaiser', 'Blue', 'Shadow', 'Nala'], S.week), w: S.week, born: S.week - 52 * 8, mood: 70, health: 75, hub: M.hub, titles: ['basic', 'cgc'] }; M.pets.push(q); it.result = { t: `${q.name} walks in, checks every room, and lies down by the door. On duty, still.` }; } else it.result = { t: 'Someone else takes the dog.' }; return true; }
  const p = petsOf().find(q => q.id === it.pet); if (!p) { it.result = { t: 'It no longer matters.' }; return true; }
  if (k === 'keep') { p.kind = p.kind === 'guidepup' ? 'lab' : p.kind; it.result = { t: `${p.name} stays. Squirrels everywhere breathe out.` }; return true; }
  if (k === 'return') { p.gone = 'rehomed'; p.goneW = S.week; it.result = { t: `${p.name} goes to a family with a big garden and no squirrels.` }; return true; }
  if (k === 'sar_go') { M.energy = clamp(M.energy - 15, 0, 100); p.bondP = (p.bondP || 0) + 4; const found = prnd() < .3; if (found) { me.fame = (me.fame || 0) + .4; me.standing = clamp(me.standing + .6, 0, 100); news('People', `A search dog called ${p.name} finds a missing hiker. Handler: ${me.name}.`); it.result = { t: `On the second morning ${p.name} goes still, then runs. The hiker is cold, frightened and alive. The local news wants a photo.` }; } else it.result = { t: 'Two days on the hill. Another team finds them. You come home soaked and proud anyway.' }; return true; }
  if (k === 'sar_no') { it.result = { t: 'The team goes without you this time.' }; return true; }
  if (k === 'book_yes') { M.energy = clamp(M.energy - 3 * it.days, 0, 100); const ok = prnd() < it.pp;
    if (!ok) { p.mood = clamp(p.mood - 5, 0, 100); it.result = { t: `${p.name} won't do it: lies down, looks at the lights, refuses. They send for another animal.` }; return true; }
    let fee = it.fee, extra = '';
    if (it.film !== undefined && prnd() < .06) { fee *= 5; p.fame = (p.fame || 0) + 5; news('Industry', `The animal star of ${S.films[it.film].title} walks off; ${p.name}, booked as the stand-in, takes over the part.`); extra = ` Then the star ${PET_BY[p.kind].body} walks off the picture and ${p.name}, the stand-in, gets the part.`; }
    const net = Math.round(fee * .85); M.cash += net; p.fame = (p.fame || 0) + (it.film !== undefined ? 1 : .3); if (it.film !== undefined) (p.credits = p.credits || []).push(it.film);
    it.result = { t: `${p.name} hits every mark.${extra} ${fmtCash(net)} after the agency's cut.` }; diary(`${p.name} works ${it.days} day${it.days > 1 ? 's' : ''}${it.film !== undefined ? ` on ${S.films[it.film].title}` : ''}: ${fmtCash(net)}.`); return true; }
  if (k === 'book_no') { it.result = { t: 'You pass. The agency sighs.' }; return true; }
  if (k === 'brand_yes') { M.cash += it.fee; p.follow = Math.round(p.follow * .97); it.result = { t: `One post, one ${fmtCash(it.fee)} cheque. A few followers leave in disgust.` }; return true; }
  if (k === 'brand_no') { p.follow = Math.round(p.follow * 1.02); it.result = { t: 'You say no. Somehow the account grows anyway.' }; return true; }
  if (k === 'surg') { M.cash -= petBill(it.c); p.health = clamp(p.health + 25, 0, 100); it.result = { t: `The operation goes well. ${p.name} is back to normal in a month.` }; return true; }
  if (k === 'nosurg') { p.health = clamp(p.health - 15, 0, 100); it.result = { t: `You manage it. ${p.name} slows down a little.` }; return true; }
  if (k === 'big_go') { if (M.cash < it.fee) { it.result = { t: 'You can\'t cover the handler.' }; return true; } M.cash -= it.fee; const B = bigShow();
    if (prnd() >= it.pB) { it.result = { t: `${p.name} shows beautifully and doesn't win the breed. Being there was the point; the people ringside talk to you anyway.` }; me.standing = clamp(me.standing + .3, 0, 100); return true; }
    if (prnd() >= it.pG) { it.result = { t: `${p.name} wins the breed at ${B.n} and goes no further. A rosette for the wall.` }; me.standing = clamp(me.standing + .6, 0, 100); (p.titles = p.titles || []).push('bob'); return true; }
    if (prnd() >= it.pS) { it.result = { t: `${p.name} wins the group at ${B.n}, in front of the cameras, and is in the final line-up for Best in Show.` }; me.fame = (me.fame || 0) + 1; me.standing = clamp(me.standing + 1, 0, 100); (p.titles = p.titles || []).push('group'); return true; }
    me.fame = (me.fame || 0) + 3; me.standing = clamp(me.standing + 2, 0, 100); p.fame = (p.fame || 0) + 6; (p.titles = p.titles || []).push('bis'); news('People', `${p.name} wins Best in Show at ${B.n}. Handler and owner ${me.name} says something incoherent on live television.`); milestone(`${p.name} won Best in Show at ${B.n}`, 'life');
    for (let i = 0; i < 2; i++) { const q = typeof bestIn === 'function' ? bestIn(M.hub, ['producer', 'exec'], q => q.standing + prnd() * 20 - (M.known[q.id] ? 99 : 0)) : null; if (q && !M.known[q.id]) meet(q.id, `Met ringside at ${B.n}`, 8); }
    it.result = { t: `Best in Show. ${p.name} stands in the spotlight like it was always the plan. Two people from the ringside seats, both of whom fund films, ask for your number.` }; return true; }
  if (k === 'big_no') { it.result = { t: 'You watch it on television instead.' }; return true; }
  return false;
}
// vet bills from the old event respect the insurance
{ const _pp = petPick; petPick = function (it, k) { const pre = S.me.cash, r = _pp(it, k); if (r && it.kind === 'petev' && k === 'vet' && S.me.petIns && it.c) S.me.cash += Math.round(it.c * .8); return r; }; }
// rosettes on the wall for the ones that won things
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) { const s = _hs(day); if (!S.me) return s; const T = petsOf().flatMap(p => (p.titles || []).filter(t => ['ch', 'bob', 'group', 'bis'].includes(t))).slice(0, 4); if (!T.length) return s;
  const R = T.map((t, i) => { const c = { ch: '#2F5BD3', bob: '#C8102E', group: '#2EAD6B', bis: '#D4AF37' }[t]; return `<g transform="translate(${362 + (i % 2) * 16} ${70 + Math.floor(i / 2) * 22})"><path d="M-3 4 l-2 9 3 -2 2 3 1 -9 M3 4 l2 9 -3 -2 -2 3 -1 -9" fill="${c}"/><circle r="6" fill="${c}"/><circle r="3.5" fill="#FFF" opacity=".85"/></g>`; }).join('');
  return s.replace(/<\/svg>$/, `<g class="rosettes"><title>Rosettes</title>${R}</g></svg>`); }; }

// ---- the page ----
function petStatusLine(p) { const W = p.work || {}, L = [];
  if (p.quar) L.push(`in quarantine until ${fmtDate(p.quar, true)}`); if (p.train) L.push(`in ${petTrainName(p.train.k).toLowerCase()} until ${fmtDate(p.train.until, true)}`); if (p.guide) L.push(`guide-dog school graduation ${fmtDate(p.guide.until, true)} (${Math.round(petGuideP(p) * 100)}% chance)`);
  if (W.therapy === 'cert') L.push('therapy dog'); if (W.sar) L.push(W.sar.st === 'cert' ? 'search-and-rescue, certified' : `search-and-rescue training until ${fmtDate(W.sar.until, true)}`); if (p.agency) L.push(`with an animal agency · Screen-Ready ${petRating(p)}`); return L.join(' · '); }
function pet2Card(p) {
  const M = S.me, X = PET_BY[p.kind], t = petTemp(p), b = petBond(p), T = p.titles || [], sk = petShowKind(p), S2 = p.show, W = p.work || {}, age = petAge(p);
  const btn = (k, l, dis, extra = '') => `<button class="pt-b" data-pet2="${k}:${p.id}${extra}" ${dis ? 'disabled' : ''}>${l}</button>`;
  const stat = (l, v, txt) => `<div class="pt-s"><span>${l}</span>${v === null ? '<em>finding out</em>' : `<i style="--v:${clamp(v, 0, 100)}%"></i><b>${txt ?? v}</b>`}</div>`;
  const stats = TEMP_KEYS.map(([k, l]) => stat(l, petKnown(p, k) ? t[k] : null)).join('') + stat('Bond', Math.min(100, (p.bondP || 0) / 56 * 100), BOND_NAME[b]);
  const row = (l, body) => body ? `<div class="pt-row"><span>${l}</span><div>${body}</div></div>` : '';
  const trains = Object.keys(PET_TRAIN).filter(k => petTrainOK(p, k) && !(PET_TRAIN[k].from && S.year < PET_TRAIN[k].from && !PET_TRAIN[k].alt)).map(k => { const P0 = PET_TRAIN[k], c = usd(P0.fee) * P0.wk; return `${btn('train', `${petTrainName(k)} · ${P0.wk} wk · ${fmtCash(c)} · ${Math.round(petPass(p, k) * 100)}% pass`, M.cash < c, ':' + k)}${btn('train', `with a trainer · ${Math.ceil(P0.wk / 2)} wk · ${Math.round(petPass(p, k, true) * 100)}%`, M.cash < c + usd(150) * Math.ceil(P0.wk / 2), ':' + k + ':pro')}`; }).join('');
  const showB = sk ? `<p class="pt-n">${S2 ? `${S2.ch ? `Champion · season ${(S2.season || {})[petSeasonY()] || 0} pts (invite line about ${petInviteLine(p)})` : `${S2.pts}/15 points, ${S2.majors}/2 majors`} · ${S2.wins} wins in ${S2.n}` : 'Never shown.'}${p.showW === S.week ? ' · shown this week' : ''}</p>${btn('show', `Weekend show, ${petField(p)} entered · ${fmtCash(usd(40))} · ${Math.round(petWinP(p) * 100)}% to win`, p.showW === S.week || age < .5 || M.energy < 6)}${btn('show', `with a handler · +${fmtCash(usd(125))} · ${Math.round(petWinP(p, true) * 100)}%`, p.showW === S.week || age < .5 || M.energy < 6, ':pro')}` : '';
  const work = X.body === 'dog' && p.kind !== 'guidepup' ? `${W.therapy === 'cert' ? btn('therapy', 'Therapy visits this morning', W.visitW && S.week - W.visitW < 4) : S.year >= 1976 ? btn('therapy', `Therapy-team evaluation · ${Math.round(petTherapyP(p) * 100)}%`, age < 1 || S.week - p.w < 26 || b < 2 || (W.therapyW && S.week - W.therapyW < 8)) + (age < 1 || S.week - p.w < 26 || b < 2 ? '<span class="pt-n">needs a year old, six months with you, an attached bond</span>' : '') : ''}${S.year >= 1970 && !W.sar ? btn('sar', 'Search-and-rescue training (2 years)', age < 1 || t.drive < 55 || t.nerve < 55 || !petKnown(p, 'drive')) : ''}${age >= 1.5 && age <= 3 && !X.small && !PET_BRACHY.has(p.kind) && W.police !== 'no' ? btn('police', 'Offer to the police K9 unit', false) : ''}` : '';
  const screen = ['dog', 'cat', 'bird'].includes(X.body) ? `<p class="pt-n">Screen-Ready ${petRating(p)}/100${(p.credits || []).length ? ` · ${p.credits.length} credit${p.credits.length > 1 ? 's' : ''}` : ''}${p.fame ? ` · fame ${p.fame.toFixed(1)}` : ''}${(p.awards || []).length ? ` · 🏆 ${p.awards.join(', ')}` : ''}${p.agency ? ' · with an animal agency' : petRating(p) < 45 ? ' · agencies want 45+: train for it' : ''}</p>${p.agency ? '' : btn('agency', 'Sign with an animal agency (15%)', petRating(p) < 45)}` : '';
  const social = S.year >= 2010 && ['dog', 'cat', 'bird', 'small', 'reptile'].includes(X.body) ? `<p class="pt-n">@${esc(p.name.toLowerCase().replace(/[^a-z0-9]/g, ''))}${X.k}: ${Math.round(p.follow || 0).toLocaleString()} followers${(p.shots || []).filter(w => S.week - w < 4).length >= 2 ? ' · one more shoot this month and they\'ll be fed up' : ''}</p>${btn('shoot', 'Photo shoot', p.shootW === S.week || M.energy < 3)}` : '';
  const chips = `${petPapered(p) ? '<span class="chip small">papered</span>' : ''}${T.map(k => `<span class="chip small">${esc({ ch: 'Champion', bob: 'Best of Breed', group: 'Group winner', bis: 'Best in Show' }[k] || petTrainName(k))}</span>`).join('')}`;
  return `<div class="pet2"><div class="pt-head"><b>${esc(p.name)}</b>${chips}${petStatusLine(p) ? `<span class="pt-n">${esc(petStatusLine(p))}</span>` : ''}</div><div class="pt-stats">${stats}</div><div class="pt-rows">
    ${row('Care', btn('walk', 'Walk and play · −2 energy, −2 stress, bond up', p.walkW === S.week || M.energy < 4))}${row('Training', trains)}${row('Shows', showB)}${row('Work', work)}${row('Screen', screen)}${row('Account', social)}</div></div>`;
}
{ const _ph = petsHTML; petsHTML = function () {
  const M = S.me; if (!M) return ''; let h = _ph(); const L = petsOf();
  for (const p of L) { const i = h.indexOf(`data-pet="spoil:${p.id}"`); if (i < 0) continue; const j = h.indexOf('</div></div>', i); if (j < 0) continue; h = h.slice(0, j + 12) + pet2Card(p) + h.slice(j + 12); }
  const B = bigShow(), ins = S.year >= petInsFrom();
  const prog = `<h4>Programmes and the calendar</h4><p class="small">${ins ? `<label><input type="checkbox" data-pet2="insure:0" ${M.petIns ? 'checked' : ''}> Pet insurance (${fmtCash(petInsCost() || usd(14))}/week now; pays 80% of vet bills)</label>` : `Pet insurance doesn't exist here yet (from ${petInsFrom()}).`}</p>
   <p class="small">${S.year >= 1929 ? `${L.some(p => p.kind === 'guidepup') ? 'You\'re raising a guide-dog puppy.' : `<button class="btn small" data-pet2="guide:0" ${L.length >= petCap() ? 'disabled' : ''}>Raise a guide-dog puppy for a year</button> <span class="muted">free, about ${fmtCash(usd(17))}/week in food; at the end it graduates or comes home for good</span>`}` : ''}</p>
   <p class="small muted">${S.year >= B.from ? `${B.n} (${B.where}) is in week ${B.wk}: the season's top dogs are invited.` : ''} The show season runs October to September.${PET_AWARDS.filter(a => S.year >= a.from && S.year <= a.to).map(a => ` ${a.n[0].toUpperCase() + a.n.slice(1)} honours an animal performance each year.`).join('')}</p>`;
  return h.replace('</section>', prog + '</section>');
}; }
function pet2Click(t) { const d = t.dataset && t.dataset.pet2; if (!d) return false; const [k, id, v, pro] = d.split(':'); const ok = doAct({ t: 'pet2', k, id: +id, v, pro: pro === 'pro' || v === 'pro' ? 1 : 0 });
  if (!ok) inbox('note', 'Not now', 'That isn\'t possible right now: check the money, your energy, or whether it\'s been done this week.');
  render(true); if (ok && k === 'show' && S.me.lastPetShow && typeof showRollOverlay !== 'function') {} return true; }
