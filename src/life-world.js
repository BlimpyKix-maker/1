// ---------------- A living world ----------------
// Everyone you meet has a past and goes on living while you watch. Backstories come from a hash of who they are, so
// they cost nothing until you look. Ongoing lives are rolled each week for the people you know: weddings, babies,
// break-ups, illnesses, new agents, big breaks, quiet exits. You hear through the grapevine, by text, or straight
// from them when it matters. Beyond film, the world has its own weather: heatwaves, strikes, a recession, a city
// festival, the final everyone watches. They change rent, sleep, commutes and moods.
// Real people from film history only ever get career events: their private lives are not ours to invent.
const HOMETOWNS = ['a mill town up north', 'a farming county where the nearest cinema was forty minutes away', 'the suburbs, in a house with a VCR that never left the living room', 'a port city', 'a military family that moved every two years', 'the city itself, two streets from a studio lot', 'a small island', 'a college town', 'a rust-belt town with one repertory cinema', 'the mountains, where the TV got two channels'];
const WAY_IN = ['ran errands on a commercial at nineteen and never left', 'came up through student films and a lot of unpaid weekends', 'started in theatre, then followed a director to the screen', 'shot music videos for friends\' bands until one blew up', 'did stand-up for years, badly, then wrote about it', 'was a parent\'s hand-me-down into the business and has spent years proving they belonged', 'answered phones at an agency and listened to everything', 'was an accountant until a midlife night class changed everything', 'drove a van for a rental house and learned every lens by heart', 'won a short-film contest nobody else entered'];
const SHAPED = ['a teacher who lent them books and never asked for them back', 'a brother who died young', 'a year of being broke enough to sleep in a car', 'a famous mentor who was cruel and brilliant', 'a divorce they still don\'t talk about', 'growing up translating for their parents', 'a single film seen at the wrong age', 'an injury that ended a sports career', 'a grandmother who told stories at the table', 'a bad first job that taught them what not to be'];
const QUIRK_NPC = ['keeps every call sheet in shoeboxes', 'never eats lunch on set', 'swims in the sea every morning, any season', 'collects old cameras and can\'t use most of them', 'writes everyone thank-you cards by hand', 'has a superstition about green on set', 'is famously never late', 'hums film scores without noticing', 'knows the name of every crew member\'s kid', 'keeps a notebook of overheard dialogue'];
function backstoryOf(p) {
  if (p.player) return null;
  const r = hashRand(p.id * 31 + 7), pick = a => a[Math.floor(r() * a.length)];
  if (p.catId) return { quirk: pick(QUIRK_NPC) };   // real people: no invented childhood
  return { from: pick(HOMETOWNS), way: pick(WAY_IN), shaped: pick(SHAPED), quirk: pick(QUIRK_NPC) };
}
function lifeOfHTML(p) {
  const b = backstoryOf(p);
  if (!b) return '';
  const P0 = pron(p), L = (p.life || []).slice().reverse();
  const story = b.from ? `<p>Grew up in ${esc(b.from)}. ${esc(P0[0])} ${esc(b.way)}. Shaped by ${esc(b.shaped)}. These days ${p.name.split(' ')[0]} ${esc(b.quirk)}.</p>` : `<p class="muted">${esc(p.name.split(' ')[0])} ${esc(b.quirk)}.</p>`;
  return `<section class="panel"><h3>Life</h3>${story}${L.length ? `<ul class="plain lifelist">${L.map(e => `<li><time>${fmtDate(e.w, true)}</time> ${esc(e.t)}</li>`).join('')}</ul>` : '<p class="muted small">Nothing you\'ve heard about lately.</p>'}</section>`;
}
// What can happen to someone in a week. w: weight; ok(p): can it; go(p): what changes; t: how it reads.
const NPC_EVENTS = [
  { k: 'wed', w: 3, personal: 1, ok: p => !p.spouse && ageOf(p) >= 24 && ageOf(p) <= 62, go: p => { p.spouse = spouseName(p); p.kids = p.kids || 0; }, t: p => `married ${p.spouse}`, invite: 'wedding' },
  { k: 'baby', w: 3, personal: 1, ok: p => p.spouse && ageOf(p) <= 46 && (p.kids || 0) < 3, go: p => { p.kids = (p.kids || 0) + 1; }, t: p => `had a ${(p.kids || 1) > 1 ? 'second' : 'first'} child` },
  { k: 'split', w: 2, personal: 1, ok: p => p.spouse, go: p => { p.exSpouse = p.spouse; p.spouse = null; }, t: p => `split from ${p.exSpouse}`, ask: 'a night out to take their mind off the divorce' },
  { k: 'ill', w: 1, personal: 1, ok: p => !p.ill, go: p => { p.ill = S.week; }, t: () => 'was taken ill and is off work for a while', ask: 'a visit in hospital' },
  { k: 'well', w: 6, personal: 1, ok: p => p.ill && S.week - p.ill > 3, go: p => { p.ill = 0; }, t: () => 'is back on their feet' },
  { k: 'house', w: 2, personal: 1, ok: p => p.standing > 30 && !p.house, go: p => { p.house = 1; }, t: () => 'bought a house with a garden and immediately regretted the garden', ask: 'help moving into their new house' },
  { k: 'dog', w: 2, personal: 1, ok: p => !p.dog, go: p => { p.dog = 1; }, t: () => 'got a rescue dog who now attends every meeting' },
  { k: 'marathon', w: 1, personal: 1, ok: p => ageOf(p) < 60, go: () => {}, t: () => 'ran a marathon, slowly, and won\'t stop talking about it' },
  { k: 'sober', w: 1, personal: 1, ok: p => has(p, 'Party animal') && !p.sober, go: p => { p.sober = S.week; }, t: () => 'has quit drinking, and seems happier for it' },
  { k: 'parent', w: 1, personal: 1, ok: p => ageOf(p) > 35, go: () => {}, t: () => 'lost a parent', ask: 'company at the funeral' },
  { k: 'novel', w: 1, personal: 1, ok: p => p.mind.vis > 10, go: () => {}, t: () => 'is writing a novel, which everyone says they will read' },
  { k: 'agent', w: 3, ok: p => !p.hasAgent && p.standing > 15, go: p => { p.hasAgent = 1; p.standing = clamp(p.standing + 2, 0, 100); }, t: () => 'signed with a big agency' },
  { k: 'break', w: 2, ok: p => p.standing < 60, go: p => { p.standing = clamp(p.standing + 5, 0, 100); p.fame = clamp((p.fame || 0) + 3, 0, 100); }, t: () => 'got their big break: suddenly everyone is taking their calls' },
  { k: 'teach', w: 1, ok: p => ageOf(p) > 40, go: () => {}, t: () => 'started teaching a night class at the film school' },
  { k: 'fired', w: 1, ok: p => S.active.some(i => keyIds(S.films[i]).includes(p.id)), go: p => { p.standing = clamp(p.standing - 3, 0, 100); }, t: () => 'was let go from their film after a blow-up on set' },
  { k: 'scandal', w: 1, ok: p => p.fame > 30, go: p => { p.standing = clamp(p.standing - 4, 0, 100); p.fame = clamp(p.fame + 3, 0, 100); }, t: () => 'is all over the papers for the wrong reasons' },
  { k: 'quit', w: 1, ok: p => !p.catId && ageOf(p) < 50 && p.credits.length < 3 && S.week - (p.debut || 0) > 100, go: p => { p.retired = true; p.retY = S.year; }, t: () => 'has left the business for a steady job and a pension' },
  { k: 'move', w: 1, ok: () => true, go: p => { p.hood = ppick(['by the beach', 'in the hills', 'across town', 'downtown', 'near the studios']); }, t: p => `moved ${p.hood}` }
];
function spouseName(p) { const N = NAMES[HUBS[p.hub].lang] || NAMES.en; return ppick(N.M.concat(N.F)) + ' ' + ppick(N.L); }
function npcLivesWeek() {
  const M = S.me, me = ME();
  for (const id of aliveKnown()) {
    const p = P(id);
    if (M.known[id].tags.includes('Your parent') || prnd() > .012) continue;
    const L = NPC_EVENTS.filter(e => (!e.personal || !p.catId) && e.ok(p));
    if (!L.length) continue;
    let r = prnd() * L.reduce((s, e) => s + e.w, 0), e = L[0];
    for (const x of L) { r -= x.w; if (r <= 0) { e = x; break; } }
    e.go(p);
    const t = e.t(p);
    (p.life = p.life || []).push({ w: S.week, t: t[0].toUpperCase() + t.slice(1) });
    const rel = relOf(id), close = ['partner', 'close', 'friend', 'mentor'].includes(rel);
    if (p.fame > 50 || p.standing > 65) news('People', `${p.name} ${t}.`, { person: id });
    if (close) {
      sms(id, pickLine({ wed: ['WE\'RE GETTING MARRIED', 'so... I\'m getting married!!'], baby: ['it\'s a baby!! everyone is fine, I am not', 'meet the newest member of the crew'], split: ['we\'re done. I\'m ok. I\'m not ok.', 'it\'s over. can we get a drink sometime'], ill: ['in hospital, nothing dramatic, just stuck here', 'bit unwell. don\'t worry'], break: ['YOU WILL NOT BELIEVE THE WEEK I\'M HAVING', 'I got it. I GOT IT'], fired: ['got fired. long story. need a drink'], well: ['out of hospital! never again', 'back among the living'], house: ['WE BOUGHT A HOUSE. it has a garden. what do you do with a garden', 'own a house now, apparently. come see'], dog: ['I have a dog now. his name is Biscuit. he is perfect', 'adopted a dog. sending you 40 photos'], marathon: ['I ran a marathon. I can no longer walk', 'finished! slowest time in the history of running'], sober: ['3 months sober today. feels good', 'not drinking anymore, fyi. coffee instead?'], parent: ['my dad passed this week. funeral on saturday', 'lost my mum. still taking it in'], novel: ['I\'m writing a novel. don\'t laugh', 'chapter one done. only 30 to go'], agent: ['I signed with an agency!!', 'got an agent. a real one'], teach: ['teaching a night class now, come heckle', 'I\'m a teacher now, apparently'], scandal: ['please don\'t read the papers this week', 'it\'s not what it looks like. ok it\'s a bit what it looks like'], quit: ['I\'m out. taking a real job. don\'t hate me', 'leaving the business. I\'ll miss it. I won\'t miss it'], move: [`moved ${p.hood || 'house'}! come over`, 'new place, new me'] }[e.k] || ['big news, call me'], id + S.week), 'life', { person: id });
      if (e.invite === 'wedding') { const slot = freeSlot({ days: [5], blocks: [1, 2], from: 1 }); if (slot) inbox('invite', `${p.name}'s wedding`, `${p.name} is marrying ${p.spouse}, and you're invited: ${slotLabel(slot)}. Bring a gift.`, { person: id, ev: 'wedding', slot, what: `${p.name}'s wedding`, choices: [{ k: 'yes', label: `Go (${slotLabel(slot)})` }, { k: 'no', label: 'Send a card instead' }] }); }
      else if (e.ask && rel !== 'mentor') { const slot = freeSlot({ days: [2, 3, 4, 5, 6], blocks: [2], from: 1 }); if (slot) inbox('ask', `${p.name} needs you`, `${p.name} ${t}. They could use ${e.ask}, ${slotLabel(slot)}.`, { person: id, slot, what: e.ask, choices: [{ k: 'yes', label: 'Be there' }, { k: 'no', label: 'Send your love' }] }); }
    } else {
      const from = aliveKnown().filter(x => x !== id && ['friend', 'close'].includes(relOf(x)));
      (M.gossipQ = M.gossipQ || []).push({ from: from.length ? ppick(from) : null, t: `did you hear? ${p.name} ${t}`, person: id });
    }
  }
  if ((M.gossipQ || []).length > 6) M.gossipQ.splice(0, M.gossipQ.length - 6);
}
// ---- the world beyond film ----
// fx: rent (multiplier), hustle (pay multiplier), commute (energy per trip), sleep (per night), stress (per week),
// out (stress per night out, extra), jobs (board size multiplier), gift (cash).
const WORLD_EVENTS = [
  { k: 'heat', t: 'A heatwave', d: 'The city bakes. Nobody sleeps; tempers fray on set.', wk: [2, 4], months: [5, 6, 7], fx: { sleep: -5, stress: 1 } },
  { k: 'cold', t: 'A cold snap', d: 'Pipes freeze, buses run late, exteriors get cancelled.', wk: [1, 3], months: [11, 0, 1], fx: { commute: 2, sleep: -2 } },
  { k: 'strike', t: 'A transit strike', d: 'The trains stop. Everyone is late for everything.', wk: [1, 2], fx: { commute: 5, stress: 2 } },
  { k: 'recession', t: 'A recession', d: 'Money is tight everywhere. Fewer productions, fewer tips, more nerves.', wk: [10, 26], rare: 1, fx: { hustle: .75, jobs: .8, stress: 1.5 } },
  { k: 'boom', t: 'A boom', d: 'Money everywhere: new restaurants, new productions, rents climbing fast.', wk: [10, 26], rare: 1, fx: { hustle: 1.2, jobs: 1.2, rent: 1.1 } },
  { k: 'festival', t: 'The city festival', d: 'Parades, fireworks and street food. The whole city is out.', wk: [1, 1], fx: { out: -3, stress: -2 } },
  { k: 'final', t: 'The big final', d: 'The match everyone is watching. Bars are packed; sets break early.', wk: [1, 1], fx: { out: -2, hustle: 1.4 } },
  { k: 'flu', t: 'Flu season', d: 'Half the crew is coughing. Rest matters more than usual.', wk: [2, 5], months: [0, 1, 2, 10, 11], fx: { sleep: -3 } },
  { k: 'election', t: 'An election', d: 'Arguments at every dinner table. The news is all anyone talks about.', wk: [2, 3], fx: { stress: 1 } },
  { k: 'storm', t: 'A big storm', d: 'Power cuts, flooded streets, a week of chaos.', wk: [1, 1], fx: { commute: 4, sleep: -2, stress: 2 } },
  { k: 'spring', t: 'The first warm week', d: 'Everyone is outside. The city remembers how to be happy.', wk: [1, 2], months: [2, 3, 4], fx: { stress: -2, sleep: 2 } },
  { k: 'rents', t: 'A housing squeeze', d: 'Landlords smell blood. Rents are up across the city.', wk: [8, 20], rare: 1, fx: { rent: 1.15, stress: 1 } },
  { k: 'walkout', t: 'An industry strike', d: 'The crew and writers\' unions walk out. Productions shut down across the city: nobody shoots until there\'s a deal. Film jobs stop paying; only work outside the business carries on.', wk: [6, 16], rare: 1, fx: { jobs: 0, stress: 1.5, halt: 1 } },
  { k: 'credits', t: 'A production tax credit', d: 'The city announces generous tax breaks for filming. Productions pour in and every crew list is short.', wk: [12, 30], rare: 1, fx: { jobs: 1.4 } },
  { k: 'refund', t: 'A tax rebate', d: 'The government sends everyone a little money back.', wk: [1, 1], rare: 1, fx: { gift: 150 } }
];
const SMALL_NEWS = ['On the radio: a local bakery has won a national prize and the queue is round the block.', 'The morning paper says the zoo has a new baby giraffe.', 'Your neighbour is learning the trumpet. Badly.', 'A street you walk every day is suddenly full of scaffolding.', 'Someone has painted a mural of a famous actor near the station. It looks nothing like them.', 'The coffee place on the corner has closed. A new one opens the same week.', 'The trains are running on time today. Nobody trusts it.', 'A film shoot has taken over your street. You watch for a while, professionally.', 'The local team won last night; the whole bus is singing.', 'There\'s a petition about the park. You sign it.'];
function worldOn() { const M = S.me; return ((M.world || {}).ev || []).filter(e => e.to > S.week); }
function worldFx() {
  const f = { rent: 1, hustle: 1, commute: 0, sleep: 0, stress: 0, out: 0, jobs: 1, gift: 0, halt: 0 };
  if (!S.me) return f;
  for (const e of worldOn().filter(e => e.from <= S.week)) { const x = (WORLD_EVENTS.find(w => w.k === e.k) || {}).fx || {}; for (const k in x) f[k] = k === 'rent' || k === 'hustle' || k === 'jobs' ? f[k] * x[k] : f[k] + x[k]; }
  return f;
}
// Once a week: maybe something starts; what's going on sets this week's stress. Returns stress to add.
function worldWeek() {
  const M = S.me, W = M.world = M.world || { ev: [] }, mo = dateOf(S.week).getUTCMonth();
  W.ev = W.ev.filter(e => e.to > S.week - 30);
  if (prnd() < .09) {
    const on = new Set(worldOn().map(e => e.k)), L = WORLD_EVENTS.filter(e => !on.has(e.k) && (!e.months || e.months.includes(mo)) && (!e.rare || prnd() < .25) && !(e.k === 'boom' && on.has('recession')) && !(e.k === 'recession' && on.has('boom')));
    if (L.length) {
      const e = ppick(L), len = pri(e.wk[0], e.wk[1]);
      W.ev.push({ k: e.k, from: S.week + 1, to: S.week + 1 + len });
      inbox('note', `In the world: ${e.t.toLowerCase()}`, `${e.d}${len > 1 ? ` It looks set to last ${len > 4 ? 'months' : 'a few weeks'}.` : ''}`, { world: e.k });
      if (e.fx.gift) M.cash += usd(e.fx.gift);
      if (e.k === 'walkout') { const s = SCENES.find(y => y.id === 'ev_picket'); inbox('scene', s.title, s.text, { scene: s.id, ctx: { head: null, film: null, mates: M.jobs.flatMap(j => j.mates || []), contact: null }, choices: s.opts.map(o => ({ k: o.k, label: o.label, check: o.check })) }); }
    }
  }
  // a strike stops the clock on every production in the city; when it ends, everyone goes back
  if (worldFx().halt) for (const id of S.active) { const f = S.films[id]; if (f.hub === M.hub && f.stage >= 0 && f.stage < 4) f.stageEnd++; }
  for (const e of W.ev) if (e.k === 'walkout' && e.to === S.week + 1) inbox('note', 'The strike is over', 'A deal is signed in the small hours. Productions restart on Monday; the board fills up again.');
  return worldFx().stress;
}
function smallNews() { return prnd() < .25 ? pickLine(SMALL_NEWS, S.week + S.me.wk.day * 5) : null; }
function worldStrip() {
  const on = worldOn().filter(e => e.from <= S.week);
  return on.length ? `<div class="worldstrip">${on.map(e => { const W = WORLD_EVENTS.find(x => x.k === e.k); return `<span class="chip" title="${esc(W.d)}">🌍 ${esc(W.t)}</span>`; }).join(' ')}</div>` : '';
}
// Called from closeWeek. Returns stress to add for the week.
function livingWorldWeek() { npcLivesWeek(); return worldWeek(); }
SCENES.push({ event: 1, jobs: [], id: 'ev_picket', title: 'The picket line', teach: 'Film unions bargain for whole crafts at once: when a contract runs out without a deal they strike, and crossing a picket line can follow a person for a career.', text: 'The strike is on. Outside the studio gates there\'s a picket line, a folding table of coffee and a lot of people you\'d like to work with one day.', opts: [
  { k: 'walk', label: 'Walk the line with them', check: ['col', 10], ok: { tie: { mates: 4 }, meet: 1, stand: .3, stress: -2, flag: 'organiser' }, bad: { tie: { mates: 2 }, energy: -6 }, t: 'Twelve hours, two blisters and a dozen new numbers. Solidarity is a network too.', tb: 'Long, cold and dull, but you showed up.' },
  { k: 'organise', label: 'Help organise the strike fund', check: ['cha', 13], ok: { meet: 1, stand: .8, xp: { cha: .1 } }, bad: { stress: 4 }, t: 'The union reps learn your name. That kind of thing gets remembered.', tb: 'Meetings, spreadsheets, arguments. You burn out on it.' },
  { k: 'cross', label: 'Take non-union work across town', ok: { cash: 400, stand: -1.5, flag: 'scab' }, t: 'The money helps. Someone takes a photo of you going in. It does the rounds.' }] });

// ---- Families ----
// The business runs in families. Some newcomers are the children of established people: they carry the name, start
// with a little standing and inherit their parent's friendships, and the world's casting, which favours people with
// strong ties, does the rest. Decided by a hash of the person, so it never shifts the world's dice.
function surnameSwap(p, parent) {
  const east = EAST[HUBS[p.hub].lang], a = p.name.split(' '), b = parent.name.split(' ');
  if (a.length < 2 || b.length < 2) return;
  if (east) a[0] = b[0]; else a[a.length - 1] = b[b.length - 1];
  p.name = a.join(' ');
}
function familyOfP(p) { return p.family || (p.family = {}); }
function nepoLink(p, chance = .12) {
  if (p.catId || p.player || hashRand(p.id * 613 + 29)() > chance) return false;
  const age = S.year - p.born, ids = [];
  for (const role of ROLES) for (const id of S.pool[p.hub][role]) { const q = P(id); if (q !== p && !q.dead && !q.player && q.standing >= 22 && S.year - q.born >= age + 20 && S.year - q.born <= age + 45 && (familyOfP(q).kids || []).length < 3) ids.push(id); }
  if (!ids.length) return false;
  const parent = P(ids[Math.floor(hashRand(p.id * 37 + 1)() * ids.length)]);
  surnameSwap(p, parent);
  familyOfP(p).parent = parent.id;
  const kids = familyOfP(parent).kids = familyOfP(parent).kids || [];
  for (const sib of kids) { addTie(p, P(sib), 25); (familyOfP(p).sibs = familyOfP(p).sibs || []).push(sib); (familyOfP(P(sib)).sibs = familyOfP(P(sib)).sibs || []).push(p.id); }
  kids.push(p.id);
  addTie(p, parent, 50);
  for (const [k, v] of Object.entries(parent.ties).sort((a, b) => b[1] - a[1]).slice(0, 4)) if (v > 20 && P(+k) && !P(+k).dead) addTie(p, P(+k), 10);
  p.standing = clamp(p.standing + 4, 0, 100);
  if (S.historyEnd !== undefined && S.week > S.historyEnd && parent.fame > 40) news('Career', `${p.name}, ${pron(p)[0] === 'She' ? 'daughter' : pron(p)[0] === 'He' ? 'son' : 'child'} of ${parent.name}, ${pick0(p.id, ['makes a debut, and everyone has an opinion about it', 'signs with an agency the week they leave school', 'is suddenly in every meeting in town'])}.`, { person: p.id });
  return true;
}
function pick0(i, L) { return L[Math.floor(hashRand(i * 7 + 3)() * L.length)]; }
// At the start, some of the world's younger people already belong to its families; a few established couples are married.
function seedFamilies() {
  for (const p of S.people) if (!p.dead && !p.retired && !p.catId && S.year - p.born < 34) nepoLink(p, .07);
  for (const h of HUB_IDS) {
    const L = ROLES.flatMap(r => S.pool[h][r]).map(P).filter(q => !q.dead && !q.retired && !q.catId && S.year - q.born > 30 && !familyOfP(q).spouse);
    for (let i = 0; i + 1 < L.length; i += 2) { const a = L[i], b = L[i + 1]; if (hashRand(a.id * 5 + b.id)() < .08 && Math.abs(a.born - b.born) < 12) { familyOfP(a).spouse = b.id; familyOfP(b).spouse = a.id; addTie(a, b, 40); } }
  }
}
function familyHTML(p) {
  const F = p.family; if (!F) return '';
  const rel = [];
  if (F.parent !== undefined) rel.push(['Parent', [F.parent]]);
  if (F.spouse !== undefined) rel.push(['Married to', [F.spouse]]);
  if ((F.sibs || []).length) rel.push(['Siblings', F.sibs]);
  if ((F.kids || []).length) rel.push(['Children in the business', F.kids]);
  return rel.length ? `<p class="family">${rel.map(([l, ids]) => `<span><b>${l}:</b> ${ids.map(pl).join(', ')}</span>`).join(' · ')}</p>` : '';
}
