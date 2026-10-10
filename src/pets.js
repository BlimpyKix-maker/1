// ---------------- Pets ----------------
// Start with the basics: a cat, a mutt from the shelter, a goldfish. As your career grows (money, a bigger place,
// time in the business) more kinds open up, and some only exist where you live: a shiba in Tokyo, a xolo in Mexico
// City, a vira-lata caramelo in Rio. Pets cost money every week and need you around; in return they take the edge off
// a bad week, drag you out to the dog park where people talk, sometimes get cast, and are always in the room.
// body: how it's drawn and how it behaves. tier 0 basic, 1 once you're settled, 2 once you're doing well.
const PET_KINDS = [
  // ---- the basics ----
  { k: 'mutt', n: 'Shelter mutt', body: 'dog', col: ['#B07A45', '#E9D2B0'], fee: 60, wk: 25, life: 13, tier: 0, calm: 4, d: 'Nobody knows what it is. Everyone loves it.' },
  { k: 'tabby', n: 'Tabby cat', body: 'cat', col: ['#C58B4D', '#7A4E25'], fee: 50, wk: 15, life: 15, tier: 0, calm: 4, stripes: 1, d: 'Sleeps on your scripts. Judges your choices.' },
  { k: 'blackcat', n: 'Black cat', body: 'cat', col: ['#22201E', '#4A4642'], fee: 40, wk: 15, life: 15, tier: 0, calm: 4, d: 'Lucky, unlucky, depends who you ask.' },
  { k: 'goldfish', n: 'Goldfish', body: 'fish', col: ['#F28C28', '#FFD23F'], fee: 10, wk: 3, life: 6, tier: 0, calm: 2, d: 'Low maintenance. Watches you work.' },
  { k: 'hamster', n: 'Hamster', body: 'small', col: ['#E3B27A', '#FFF3E0'], fee: 20, wk: 4, life: 2.5, tier: 0, calm: 2, d: 'Runs all night. Relatable.' },
  { k: 'rabbit', n: 'Rabbit', body: 'small', col: ['#D9D2C6', '#FFFFFF'], fee: 40, wk: 10, life: 9, tier: 0, calm: 3, ears: 1, d: 'Chews cables. Forgiven.' },
  { k: 'budgie', n: 'Budgie', body: 'bird', col: ['#6BBF59', '#FFE27A'], fee: 30, wk: 4, life: 8, tier: 0, calm: 2, d: 'Learns one word. It\'s a rude one.' },
  // ---- once you're settled ----
  { k: 'lab', n: 'Labrador', body: 'dog', col: ['#E9C77B', '#F6E3B4'], fee: 600, wk: 45, life: 12, tier: 1, calm: 5, d: 'Friendly to the point of being useless as a guard.' },
  { k: 'greyhound', n: 'Retired greyhound', body: 'dog', col: ['#9A9A9E', '#D9D9DC'], fee: 150, wk: 35, life: 12, tier: 1, calm: 5, lean: 1, d: 'Fast once. Now a world-class napper.' },
  { k: 'pug', n: 'Pug', body: 'dog', col: ['#D8B98A', '#2A2622'], fee: 900, wk: 40, life: 13, tier: 1, calm: 4, small: 1, d: 'Snores louder than you.' },
  { k: 'tortoise', n: 'Tortoise', body: 'reptile', col: ['#7A6A3A', '#A89A5A'], fee: 200, wk: 8, life: 80, tier: 1, calm: 3, shell: 1, d: 'Will outlive you, and knows it.' },
  { k: 'ferret', n: 'Ferret', body: 'small', col: ['#8B6A4A', '#F2E8DA'], fee: 150, wk: 15, life: 8, tier: 1, calm: 3, long: 1, d: 'Steals one sock from every pair.' },
  { k: 'gecko', n: 'Leopard gecko', body: 'reptile', col: ['#F2C14E', '#3A3A3A'], fee: 120, wk: 6, life: 18, tier: 1, calm: 2, d: 'Smiles permanently. Unclear why.' },
  { k: 'persian', n: 'Persian cat', body: 'cat', col: ['#F2EEE6', '#D9CFC2'], fee: 1200, wk: 30, life: 14, tier: 1, calm: 4, fluffy: 1, d: 'Expensive, offended, gorgeous.' },
  // ---- once you're doing well ----
  { k: 'parrot', n: 'African grey parrot', body: 'bird', col: ['#9A9EA4', '#D6303E'], fee: 2500, wk: 20, life: 50, tier: 2, calm: 3, big: 1, d: 'Repeats your phone calls back to your guests.' },
  { k: 'doodle', n: 'Designer doodle', body: 'dog', col: ['#C9A27A', '#E8D3B8'], fee: 3500, wk: 60, life: 13, tier: 2, calm: 5, fluffy: 1, d: 'Has its own groomer and a more active social calendar than you.' },
  { k: 'bengal', n: 'Bengal cat', body: 'cat', col: ['#D9A04E', '#4A2E14'], fee: 2500, wk: 30, life: 15, tier: 2, calm: 3, spots: 1, d: 'A tiny leopard who wants the curtains dead.' },
  { k: 'axolotl', n: 'Axolotl', body: 'fish', col: ['#F7B7C8', '#E0607E'], fee: 150, wk: 6, life: 12, tier: 2, calm: 3, axo: 1, from: 2005, d: 'Smiles from its tank like it knows a secret.' },
  { k: 'glider', n: 'Sugar glider', body: 'small', col: ['#8E8E96', '#F2F2F2'], fee: 600, wk: 20, life: 12, tier: 2, calm: 2, from: 1995, d: 'Lives in your hoodie pocket.' },
  { k: 'horse', n: 'A horse, stabled out of town', body: 'none', col: ['#6B3E1E', '#2A1A0E'], fee: 15000, wk: 400, life: 28, tier: 3, calm: 6, d: 'You see it at weekends. It is unimpressed by your career.' },
  // ---- where you live ----
  { k: 'shiba', n: 'Shiba inu', body: 'dog', col: ['#D9853B', '#FFF3E0'], fee: 2000, wk: 40, life: 14, tier: 0, calm: 4, curl: 1, hubs: ['tokyo'], d: 'Screams when bathed. Stares at the sea for hours.' },
  { k: 'koi', n: 'Koi', body: 'fish', col: ['#FFFFFF', '#E63946'], fee: 400, wk: 10, life: 30, tier: 1, calm: 4, hubs: ['tokyo', 'hongkong', 'taipei'], d: 'Brings luck, and a very expensive pond pump.' },
  { k: 'jindo', n: 'Jindo', body: 'dog', col: ['#F2EEE6', '#E9D2B0'], fee: 800, wk: 35, life: 14, tier: 0, calm: 4, curl: 1, hubs: ['seoul'], d: 'Loyal to one person. You, hopefully.' },
  { k: 'corgi', n: 'Corgi', body: 'dog', col: ['#D9853B', '#FFFFFF'], fee: 1500, wk: 35, life: 13, tier: 0, calm: 4, small: 1, hubs: ['london'], d: 'Short legs, royal attitude.' },
  { k: 'frenchie', n: 'French bulldog', body: 'dog', col: ['#2A2622', '#E9D2B0'], fee: 2500, wk: 40, life: 11, tier: 1, calm: 4, small: 1, hubs: ['paris'], d: 'Sits outside cafés better than you do.' },
  { k: 'piccolo', n: 'Italian greyhound', body: 'dog', col: ['#8E8E96', '#D9D9DC'], fee: 1200, wk: 30, life: 14, tier: 0, calm: 4, lean: 1, small: 1, hubs: ['rome'], d: 'Shivers dramatically in any weather.' },
  { k: 'dackel', n: 'Dachshund', body: 'dog', col: ['#8B4A1E', '#C58B4D'], fee: 900, wk: 30, life: 14, tier: 0, calm: 4, long: 1, small: 1, hubs: ['berlin'], d: 'A sausage with opinions.' },
  { k: 'galgo', n: 'Galgo, rescued', body: 'dog', col: ['#E9D2B0', '#B07A45'], fee: 100, wk: 30, life: 13, tier: 0, calm: 5, lean: 1, hubs: ['madrid'], d: 'Gentle, grateful, all legs.' },
  { k: 'xolo', n: 'Xoloitzcuintle', body: 'dog', col: ['#3A3438', '#5A5056'], fee: 1500, wk: 30, life: 15, tier: 0, calm: 5, bald: 1, hubs: ['mexico'], d: 'Hairless, ancient, guides souls (and you, to the fridge).' },
  { k: 'chihuahua', n: 'Chihuahua', body: 'dog', col: ['#E9C77B', '#FFF3E0'], fee: 500, wk: 20, life: 16, tier: 0, calm: 3, small: 1, hubs: ['mexico', 'hollywood'], d: 'Fits in a bag. Fights a bear.' },
  { k: 'caramelo', n: 'Vira-lata caramelo', body: 'dog', col: ['#D9853B', '#F2C14E'], fee: 30, wk: 20, life: 14, tier: 0, calm: 5, hubs: ['rio'], d: 'The caramel street dog of Brazil. Basically a national treasure.' },
  { k: 'dogo', n: 'Dogo argentino', body: 'dog', col: ['#FFFFFF', '#F2E8DA'], fee: 1500, wk: 50, life: 11, tier: 1, calm: 4, hubs: ['buenosaires'], d: 'Huge, white and secretly a baby.' },
  { k: 'indie', n: 'Indie street dog', body: 'dog', col: ['#C58B4D', '#F2E8DA'], fee: 0, wk: 15, life: 14, tier: 0, calm: 5, hubs: ['mumbai', 'chennai', 'kolkata'], d: 'Adopted you, really. Knows every chai stall.' },
  { k: 'myna', n: 'Myna bird', body: 'bird', col: ['#2A2622', '#FFD23F'], fee: 50, wk: 3, life: 12, tier: 0, calm: 2, hubs: ['mumbai', 'kolkata', 'bangkok'], d: 'Does a perfect impression of your ringtone.' },
  { k: 'mau', n: 'Egyptian mau', body: 'cat', col: ['#C9C2B4', '#4A4642'], fee: 400, wk: 20, life: 15, tier: 0, calm: 4, spots: 1, hubs: ['cairo'], d: 'Descended from temple cats. Behaves like it.' },
  { k: 'van', n: 'Turkish Van cat', body: 'cat', col: ['#FFFFFF', '#D9853B'], fee: 400, wk: 20, life: 15, tier: 0, calm: 4, hubs: ['istanbul'], d: 'Likes swimming. Wants to swim in your bath.' },
  { k: 'siamese', n: 'Siamese cat', body: 'cat', col: ['#F2E8DA', '#4A2E14'], fee: 600, wk: 20, life: 15, tier: 0, calm: 3, points: 1, hubs: ['bangkok'], d: 'Yells. Constantly. Lovingly.' },
  { k: 'pekingese', n: 'Pekingese', body: 'dog', col: ['#E9C77B', '#8B5A2B'], fee: 1200, wk: 30, life: 13, tier: 0, calm: 3, fluffy: 1, small: 1, hubs: ['beijing'], d: 'Bred for emperors. Has not forgotten.' },
  { k: 'arowana', n: 'Arowana', body: 'fish', col: ['#E8C24A', '#E63946'], fee: 3000, wk: 15, life: 20, tier: 1, calm: 3, long: 1, hubs: ['hongkong', 'jakarta', 'beijing'], d: 'The dragon fish. Said to bring fortune to the house.' },
  { k: 'formosan', n: 'Formosan mountain dog', body: 'dog', col: ['#2A2622', '#C58B4D'], fee: 50, wk: 25, life: 14, tier: 0, calm: 4, hubs: ['taipei'], d: 'Clever, wary, devoted once won over.' },
  { k: 'cockatoo', n: 'Sulphur-crested cockatoo', body: 'bird', col: ['#FFFFFF', '#FFD23F'], fee: 1500, wk: 15, life: 60, tier: 1, calm: 2, big: 1, hubs: ['sydney'], d: 'Screams at dawn. Dances to the radio.' },
  { k: 'collie', n: 'Border collie', body: 'dog', col: ['#22201E', '#FFFFFF'], fee: 700, wk: 35, life: 14, tier: 0, calm: 4, hubs: ['wellington', 'london'], d: 'Will herd your guests into the kitchen.' },
  { k: 'basenji', n: 'Basenji', body: 'dog', col: ['#B5602A', '#FFFFFF'], fee: 800, wk: 30, life: 14, tier: 0, calm: 4, curl: 1, hubs: ['lagos', 'dakar'], d: 'Doesn\'t bark. Yodels.' },
  { k: 'ridgeback', n: 'Rhodesian ridgeback', body: 'dog', col: ['#C5803A', '#E9C77B'], fee: 1500, wk: 50, life: 11, tier: 1, calm: 4, hubs: ['johannesburg'], d: 'Bred to face lions. Afraid of the hoover.' },
  { k: 'samoyed', n: 'Samoyed', body: 'dog', col: ['#FFFFFF', '#F2F2F2'], fee: 2000, wk: 45, life: 13, tier: 1, calm: 5, fluffy: 1, curl: 1, hubs: ['moscow', 'helsinki'], d: 'A smiling cloud that sheds a second dog every week.' },
  { k: 'forestcat', n: 'Norwegian forest cat', body: 'cat', col: ['#8B6A4A', '#F2E8DA'], fee: 900, wk: 25, life: 15, tier: 0, calm: 4, fluffy: 1, hubs: ['stockholm', 'copenhagen', 'helsinki'], d: 'Built for winters. Lives on the radiator.' },
  { k: 'wolfdog', n: 'Czechoslovakian wolfdog', body: 'dog', col: ['#8E8E96', '#D9D2C6'], fee: 1200, wk: 45, life: 13, tier: 1, calm: 3, hubs: ['prague'], d: 'Looks like a wolf. Howls like one at sirens.' },
  { k: 'lowland', n: 'Polish lowland sheepdog', body: 'dog', col: ['#D9D2C6', '#8E8E96'], fee: 900, wk: 35, life: 13, tier: 0, calm: 4, fluffy: 1, hubs: ['warsaw'], d: 'You can\'t see its eyes. It can see everything.' },
  { k: 'puli', n: 'Puli', body: 'dog', col: ['#22201E', '#3A3438'], fee: 900, wk: 35, life: 14, tier: 0, calm: 4, fluffy: 1, small: 1, hubs: ['budapest'], d: 'A mop with dreadlocks and a mission.' },
  { k: 'aspin', n: 'Aspin', body: 'dog', col: ['#C58B4D', '#2A2622'], fee: 0, wk: 15, life: 14, tier: 0, calm: 5, hubs: ['manila'], d: 'The Philippines\' own street dog. Unbreakable.' },
  { k: 'ridgevn', n: 'Phu Quoc ridgeback', body: 'dog', col: ['#8B4A1E', '#C58B4D'], fee: 900, wk: 30, life: 13, tier: 0, calm: 4, hubs: ['hochiminh'], d: 'Can climb trees. Will.' },
  { k: 'newfie', n: 'Newfoundland', body: 'dog', col: ['#22201E', '#3A3438'], fee: 1500, wk: 55, life: 10, tier: 1, calm: 6, fluffy: 1, hubs: ['toronto'], d: 'A bear that rescues people from lakes.' },
  { k: 'mainecoon', n: 'Maine coon', body: 'cat', col: ['#8B5A2B', '#E9D2B0'], fee: 1200, wk: 25, life: 14, tier: 0, calm: 4, fluffy: 1, stripes: 1, hubs: ['newyork', 'toronto'], d: 'The size of a small dog. Thinks it\'s a kitten.' },
  { k: 'persianir', n: 'Persian cat (the real thing)', body: 'cat', col: ['#F2EEE6', '#B5A48A'], fee: 300, wk: 20, life: 15, tier: 0, calm: 4, fluffy: 1, hubs: ['tehran'], d: 'From the source. Unimpressed by the copies.' },
  { k: 'criollo', n: 'Gato criollo', body: 'cat', col: ['#D9853B', '#FFFFFF'], fee: 20, wk: 12, life: 15, tier: 0, calm: 4, hubs: ['bogota'], d: 'Came in through the window. Stayed.' },
  { k: 'kintamani', n: 'Kintamani dog', body: 'dog', col: ['#FFFFFF', '#E9D2B0'], fee: 500, wk: 25, life: 13, tier: 0, calm: 4, fluffy: 1, curl: 1, hubs: ['jakarta'], d: 'From the mountains of Bali. Barks at volcanoes.' }
];
const PET_BY = Object.fromEntries(PET_KINDS.map(x => [x.k, x]));
const PET_NAMES = {
  dog: ['Biscuit', 'Gaffer', 'Dolly', 'Bogart', 'Lassie II', 'Pickles', 'Buster', 'Martini', 'Clapper', 'Rosebud', 'Scout', 'Kubrick', 'Waffles', 'Fellini'],
  cat: ['Mabel', 'Hitchcock', 'Noodle', 'Greta', 'Miso', 'Pepper', 'Bette', 'Truffaut', 'Olive', 'Velvet', 'Dorothy', 'Mr Kurosawa'],
  bird: ['Cue', 'Kiwi', 'Mango', 'Pip', 'Marlon', 'Sunny', 'Echo'],
  fish: ['Bubbles', 'Nemo', 'Splice', 'Sushi', 'Captain', 'Jaws'],
  small: ['Nibbles', 'Pip', 'Popcorn', 'Dumpling', 'Peanut', 'Tofu', 'Gremlin'],
  reptile: ['Gorgon', 'Shelly', 'Sir Toby', 'Yoda', 'Ziggy', 'Godzilla'],
  none: ['Thunder', 'Duchess', 'Rocket', 'Clementine']
};
const PET_REGION_NAMES = { tokyo: ['Mochi', 'Hachi', 'Kuro', 'Sora'], seoul: ['Bori', 'Kong', 'Duboo'], mexico: ['Frida', 'Chiquito', 'Lupe'], rio: ['Caramelo', 'Pipoca', 'Bolinha'], mumbai: ['Sheru', 'Moti', 'Rani'], paris: ['Brioche', 'Amélie', 'Gaston'], rome: ['Federico', 'Gelato'], berlin: ['Wurst', 'Fritz'], madrid: ['Churro', 'Lola'], london: ['Crumpet', 'Paddington'], beijing: ['Baozi', 'Huahua'], bangkok: ['Mali', 'Khao'] };
function petCap() { const L = S.me.life; return ['couch', 'shared'].includes(L) ? 1 : ['studio', 'own'].includes(L) ? 2 : 4; }
function petTier() { const M = S.me; return (M.cash >= 150000 || ['house', 'penthouse', 'beach', 'estate'].includes(M.life)) ? 3 : (M.cash >= 40000 || ['own', 'loft', 'house', 'penthouse', 'beach', 'estate'].includes(M.life)) ? 2 : (M.cash >= 6000 || (M.stats && M.stats.weeks >= 20)) ? 1 : 0; }
// what you could adopt here, now
function petsOnOffer() {
  const M = S.me, T = petTier();
  return PET_KINDS.filter(x => (!x.from || S.year >= x.from) && (x.hubs ? x.hubs.includes(M.hub) && x.tier <= Math.max(1, T) : x.tier <= T));
}
function petsLocked() { const M = S.me, T = petTier(); return PET_KINDS.filter(x => !x.hubs && x.tier > T && (!x.from || S.year >= x.from)); }
function petName(kind, i) { const x = PET_BY[kind], L = (PET_REGION_NAMES[S.me.hub] && x.hubs ? PET_REGION_NAMES[S.me.hub] : []).concat(PET_NAMES[x.body] || PET_NAMES.dog); return L[Math.abs(i) % L.length]; }
function petsOf() { const M = S.me; return (M.pets = M.pets || []).filter(p => !p.gone); }
function petAge(p) { return (S.week - p.born) / 52; }
function petAct(a) {
  const M = S.me, me = ME();
  if (a.k === 'adopt') {
    const x = PET_BY[a.kind]; if (!x || !petsOnOffer().includes(x) || petsOf().length >= petCap() || M.cash < x.fee) return false;
    M.cash -= x.fee; M.petN = (M.petN || 0) + 1;
    const p = { id: M.petN, kind: x.k, name: petName(x.k, M.petN * 7 + S.week), w: S.week, born: S.week - Math.round((x.body === 'dog' || x.body === 'cat' ? 26 + (M.petN * 37) % 150 : 10)), mood: 75, health: 85, hub: M.hub };
    M.pets.push(p); diary(`You bring home ${p.name}, ${/^[AEIOU]/.test(x.n) ? 'an' : 'a'} ${x.n.toLowerCase()}.`); milestone(`Adopted ${p.name} (${x.n.toLowerCase()})`, 'life'); return true;
  }
  const p = petsOf().find(q => q.id === +a.id); if (!p) return false; const x = PET_BY[p.kind];
  if (a.k === 'name') { p.nameI = (p.nameI || 0) + 1; p.name = petName(p.kind, p.id * 7 + p.nameI * 3); return true; }
  if (a.k === 'vet') { const c = usd(80 + (x.big || x.body === 'none' ? 120 : 0)); if (M.cash < c || p.vetW === S.week) return false; M.cash -= c; p.vetW = S.week; p.health = clamp(p.health + 20, 0, 100); return true; }
  if (a.k === 'spoil') { const c = usd(40); if (M.cash < c || p.spoilW === S.week) return false; M.cash -= c; p.spoilW = S.week; p.mood = clamp(p.mood + 15, 0, 100); M.stress = clamp(M.stress - 2, 0, 100); return true; }
  if (a.k === 'rehome') { p.gone = 'rehomed'; p.goneW = S.week; M.stress = clamp(M.stress + 6, 0, 100); diary(`${p.name} goes to a new home. The flat is very quiet.`); return true; }
  if (a.k === 'sitter') { M.petSitter = !M.petSitter; return true; }
  return false;
}
// each week: costs, care, comfort, and the odd surprise
function petWeek() {
  const M = S.me, me = ME(), L = petsOf(); if (!L.length) return;
  const busy = typeof jobDays === 'function' ? jobDays() : 0;
  let cost = 0;
  for (const p of L) {
    const x = PET_BY[p.kind]; cost += usd(x.wk);
    const needy = x.body === 'dog' || x.body === 'none';
    let dm = M.stress > 75 ? -4 : 2;
    if (needy && busy >= 5 && !M.petSitter) dm -= 5;
    if (M.hub !== p.hub && !M.petSitter) dm -= 3;   // you moved, or you're away: the pet feels it
    p.mood = clamp(p.mood + dm, 0, 100);
    p.health = clamp(p.health + (p.mood > 50 ? .5 : -1) - (petAge(p) > x.life * .8 ? 1 : 0), 0, 100);
    M.stress = clamp(M.stress - x.calm * p.mood / 120, 0, 100);
    if (x.body === 'dog') M.energy = clamp(M.energy + 1, 0, 100);
    // old age
    if (petAge(p) > x.life * (.9 + hashRand(p.id * 31 + 7)() * .3) || p.health <= 0) {
      p.gone = 'died'; p.goneW = S.week; M.stress = clamp(M.stress + 15, 0, 100);
      inbox('note', `Goodbye, ${p.name}`, `${p.name} died this week, ${Math.round(petAge(p))} years old, with you. The ${x.body === 'fish' ? 'tank' : 'flat'} feels enormous.`);
      milestone(`Said goodbye to ${p.name}`, 'life'); continue;
    }
  }
  if (M.petSitter) cost += usd(70);
  M.cash -= cost;
  if (pending().some(it => it.kind === 'petev')) return;
  const dogs = L.filter(p => PET_BY[p.kind].body === 'dog' && !p.gone), r = prnd();
  if (dogs.length && r < .05) {   // the dog park: people talk to people with dogs
    const q = typeof bestIn === 'function' ? bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing - 5) + prnd() * 30) : null;
    if (q) { meet(q.id, 'Met at the dog park', 6); const d = dogs[0]; sms(q.id, pickLine([`it was nice meeting you and ${d.name} this morning! same time next week?`, `${d.name} has my dog's toy. I've decided it's a gift. coffee sometime?`, `good to meet you at the park. didn't know you were in the business too`], q.id + S.week), 'text'); diary(`At the dog park, ${d.name} makes friends with ${q.name}'s dog, and you make friends with ${q.name}.`); }
    return;
  }
  const live = L.filter(p => !p.gone);
  if (live.length && r < .07) {   // a vet bill
    const p = live[Math.floor(prnd() * live.length)], x = PET_BY[p.kind], c = usd(Math.round((150 + prnd() * 700) * (x.big || x.body === 'dog' ? 1.4 : 1) / 10) * 10);
    inbox('petev', `${p.name} isn't well`, `${p.name} has been off their food. The vet wants to run tests: ${fmtCash(c)}. Or you could wait and see.`, { pet: p.id, c, choices: [{ k: 'vet', label: `Run the tests (${fmtCash(c)})` }, { k: 'wait', label: 'Wait and see' }] });
    return;
  }
  const filming = M.jobs.find(j => j.film !== null && j.film !== undefined && S.films[j.film] && S.films[j.film].stage === 2);
  const star = live.find(p => ['dog', 'cat', 'bird'].includes(PET_BY[p.kind].body));
  if (filming && star && r < .1 && !(M.petCast || {})[filming.film]) {
    const f = S.films[filming.film], fee = usd(PET_BY[star.kind].body === 'dog' ? 600 : 400);
    inbox('petev', `${f.title} needs a ${PET_BY[star.kind].body}`, `The animal booked for a scene on ${f.title} has dropped out. Someone saw a photo of ${star.name} on your phone. ${fmtCash(fee)} for the day, and a credit.`, { pet: star.id, film: f.id, fee, choices: [{ k: 'cast', label: `Bring ${star.name} in · ${checkLabel('cha', 11)}`, check: ['cha', 11] }, { k: 'no', label: `${star.name} is not a performer` }] });
    return;
  }
  if (live.length && r < .13) { const p = live[Math.floor(prnd() * live.length)], x = PET_BY[p.kind];
    const t = pickLine({ dog: [`${p.name} ate a page of your script. The good page.`, `${p.name} barked at a postman for twenty minutes. The postman has stopped coming.`, `${p.name} learned to open the fridge.`], cat: [`${p.name} sat on your keyboard and sent an email. It was an improvement.`, `${p.name} knocked an award off a shelf, looking you in the eye.`, `${p.name} has started sleeping on your face.`], bird: [`${p.name} has learned your agent's ringtone and uses it at 6am.`, `${p.name} said "action!" during a video call.`], fish: [`${p.name} watched you rehearse all evening. Unimpressed.`], small: [`${p.name} escaped and was found in a shoe.`, `${p.name} chewed the charger. Again.`], reptile: [`${p.name} moved six inches today. A big day.`], none: [`${p.name} threw the stable hand. Twice.`] }[x.body] || [`${p.name} is doing well.`], p.id + S.week);
    diary(t); if (typeof posted === 'function') {} M.stress = clamp(M.stress - 1, 0, 100); }
}
function petPick(it, k) {
  if (it.kind !== 'petev') return false; const M = S.me, p = petsOf().find(q => q.id === it.pet); it.done = true;
  if (!p) { it.result = { t: 'It no longer matters.' }; return true; }
  if (it.film !== undefined) {
    if (k === 'no') { it.result = { t: `${p.name} stays home and sleeps through it.` }; return true; }
    const ok = roll('cha', 11); (M.petCast = M.petCast || {})[it.film] = 1;
    if (ok) { M.cash += it.fee; (p.credits = p.credits || []).push(it.film); p.mood = clamp(p.mood + 10, 0, 100); diary(`${p.name} is in ${S.films[it.film].title}. Credited.`); it.result = { ok, roll: M.lastRoll, t: `${p.name} nails it in two takes. The crew wants photos. ${fmtCash(it.fee)}, and a line in the credits: "${p.name} as Themself".` }; }
    else it.result = { ok, roll: M.lastRoll, t: `${p.name} sniffs the camera, lies down and refuses to move. They find another animal.` };
    return true;
  }
  if (k === 'vet') { M.cash -= it.c; p.health = clamp(p.health + 30, 0, 100); it.result = { t: `Nothing serious, in the end: a change of food. ${p.name} is back to normal by the weekend.` }; return true; }
  if (prnd() < .6) { it.result = { t: `It passes on its own. ${p.name} is fine.` }; return true; }
  p.health = clamp(p.health - 25, 0, 100); it.result = { t: `It doesn't pass. ${p.name} is weaker, and the vet wants to see them now.` }; return true;
}
// ---- drawing ----
function petSprite(p, x, y, s = 1) {
  const X = PET_BY[p.kind], [c, c2] = X.col, b = X.body, sm = X.small ? .8 : X.big ? 1.15 : 1, k = s * sm;
  const eye = (ex, ey) => `<circle cx="${ex}" cy="${ey}" r="1.3" fill="#111"/><circle cx="${ex + .4}" cy="${ey - .4}" r=".4" fill="#fff"/>`;
  let g = '';
  if (b === 'dog') {
    const L = X.long ? 8 : 0, legH = X.lean ? 11 : 8, fl = X.fluffy;
    g = `<g class="pet-tail" style="transform-origin:${-16 - L / 2}px -${legH + 6}px">${X.curl ? `<path d="M${-16 - L / 2} ${-legH - 6} q-6 -8 2 -10 q4 2 -2 6" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M${-16 - L / 2} ${-legH - 5} q-8 -4 -9 -12" fill="none" stroke="${c}" stroke-width="${fl ? 5 : 3}" stroke-linecap="round"/>`}</g>`
      + [-12 - L / 2, -6 - L / 4, 6 + L / 4, 11 + L / 2].map(lx => `<rect x="${lx - 1.8}" y="${-legH}" width="3.6" height="${legH}" rx="1.6" fill="${X.bald ? c : mixHex(c, '#000', .12)}"/>`).join('')
      + `<ellipse cx="0" cy="${-legH - 6}" rx="${17 + L / 2}" ry="${fl ? 9 : 7.5}" fill="${c}"/><ellipse cx="2" cy="${-legH - 3}" rx="${10 + L / 3}" ry="3.5" fill="${c2}" opacity=".7"/>`
      + `<g transform="translate(${17 + L / 2} ${-legH - 13})"><ellipse cx="0" cy="0" rx="${fl ? 9 : 8}" ry="${fl ? 8.5 : 7.5}" fill="${c}"/><ellipse cx="6" cy="3" rx="5" ry="3.6" fill="${X.small && X.k === 'pug' ? '#2A2622' : c2}"/><circle cx="10" cy="2" r="1.6" fill="#111"/>${eye(2, -2)}`
      + (X.curl || X.k === 'corgi' || X.k === 'wolfdog' || X.k === 'basenji' || X.k === 'shiba' || X.k === 'jindo' ? `<path d="M-6 -5 l1 -9 6 6z" fill="${c}"/><path d="M0 -6 l3 -8 3 7z" fill="${c}"/>` : `<ellipse cx="-5" cy="1" rx="3" ry="6.5" fill="${mixHex(c, '#000', .2)}"/>`) + `</g>`;
  } else if (b === 'cat') {
    g = `<g class="pet-tail" style="transform-origin:-14px -14px"><path d="M-14 -12 q-12 -2 -10 -18" fill="none" stroke="${c}" stroke-width="${X.fluffy ? 5 : 3}" stroke-linecap="round"/></g>`
      + [-10, -5, 5, 10].map(lx => `<rect x="${lx - 1.6}" y="-7" width="3.2" height="7" rx="1.5" fill="${X.points ? c2 : c}"/>`).join('')
      + `<ellipse cx="0" cy="-12" rx="15" ry="${X.fluffy ? 8.5 : 7}" fill="${c}"/>`
      + (X.stripes ? [-8, -2, 4].map(sx => `<path d="M${sx} -18 q2 6 0 11" stroke="${c2}" stroke-width="1.6" fill="none"/>`).join('') : '')
      + (X.spots ? [[-8, -13], [-2, -15], [4, -11], [8, -14]].map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r="1.6" fill="${c2}"/>`).join('') : '')
      + `<g transform="translate(15 -19)"><circle r="7" fill="${X.points ? c2 : c}"/><circle r="5" cx="0" cy="1" fill="${c}"/><path d="M-6 -3 l1 -8 5 5z M6 -3 l-1 -8 -5 5z" fill="${X.points ? c2 : c}"/>${eye(-2.5, 0)}${eye(2.5, 0)}<path d="M-1 3 l1 1 1 -1" stroke="#7A4E25" stroke-width=".7" fill="none"/></g>`;
  } else if (b === 'bird') {
    g = `<rect x="-14" y="-46" width="28" height="44" rx="12" fill="none" stroke="#B9B5AE" stroke-width="1.2"/><path d="M-14 -24 h28 M-7 -46 v44 M0 -46 v44 M7 -46 v44" stroke="#B9B5AE" stroke-width=".5" opacity=".7"/><rect x="-16" y="-3" width="32" height="3" fill="#8C8A85"/>`
      + `<g class="pet-hop"><path d="M-8 -16 h16" stroke="#8B5A2B" stroke-width="1.5"/><ellipse cx="0" cy="-23" rx="5.5" ry="7.5" fill="${c}"/><circle cx="0" cy="-31" r="4.5" fill="${c}"/><path d="M3.5 -31 l3 1.5 -3 1.5z" fill="${X.k === 'parrot' ? '#22201E' : '#F2A93B'}"/>${eye(1.5, -32)}<path d="M-2 -18 l-3 6 4 -2z" fill="${c2}"/>${X.k === 'cockatoo' ? `<path d="M-2 -35 l-2 -6 3 3 1 -5 1 5 2 -3z" fill="${c2}"/>` : ''}</g>`;
  } else if (b === 'fish') {
    g = `<rect x="-20" y="-30" width="40" height="28" rx="3" fill="#BFE6F5" opacity=".75" stroke="#7AB8D0"/><rect x="-20" y="-30" width="40" height="5" fill="#fff" opacity=".35"/><rect x="-22" y="-2" width="44" height="3" fill="#6B5B4A"/><path d="M-14 -3 q2 -8 0 -12 M14 -3 q-3 -6 -1 -10" stroke="#2EAD6B" stroke-width="1.5" fill="none"/>`
      + `<g class="pet-swim">${X.axo ? `<ellipse cx="0" cy="-15" rx="8" ry="3.5" fill="${c}"/><path d="M5 -18 l3 -3 M6 -15 l4 0 M5 -12 l3 3" stroke="${c2}" stroke-width="1.2"/>${eye(4, -15.5)}` : `<ellipse cx="0" cy="-15" rx="${X.long ? 9 : 5.5}" ry="3.2" fill="${c}"/><path d="M${X.long ? -9 : -5} -15 l-5 -3.5 0 7z" fill="${c2}"/>${eye(X.long ? 6 : 3, -15.5)}`}</g>`;
  } else if (b === 'small') {
    g = X.long ? `<ellipse cx="0" cy="-6" rx="14" ry="4.5" fill="${c}"/><circle cx="13" cy="-8" r="4.2" fill="${c2}"/><path d="M9 -8 h6" stroke="#2A2622" stroke-width="2"/>${eye(14, -9)}<path d="M-14 -6 q-6 -1 -8 -5" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="0" cy="-7" rx="${X.ears ? 9 : 7}" ry="${X.ears ? 7 : 5.5}" fill="${c}"/><circle cx="${X.ears ? 7 : 5}" cy="-10" r="${X.ears ? 5 : 4}" fill="${c}"/>${X.ears ? `<ellipse cx="6" cy="-19" rx="1.6" ry="6" fill="${c}"/><ellipse cx="9" cy="-18" rx="1.6" ry="6" fill="${c}"/>` : `<circle cx="3" cy="-14" r="1.8" fill="${c}"/><circle cx="7" cy="-14" r="1.8" fill="${c}"/>`}<ellipse cx="0" cy="-5" rx="4" ry="2.4" fill="${c2}"/>${eye(X.ears ? 9 : 7, -11)}`;
  } else if (b === 'reptile') {
    g = X.shell ? `<ellipse cx="0" cy="-6" rx="11" ry="7" fill="${c}"/><path d="M-6 -10 l4 -2 4 2 -4 2z M2 -7 l4 -2 4 2 -4 2z M-8 -5 l4 -2 4 2 -4 2z" fill="${c2}" opacity=".7"/><ellipse cx="13" cy="-4" rx="4" ry="3" fill="#8C8A5A"/>${eye(14, -5)}<rect x="-8" y="-2" width="3" height="2.5" fill="#8C8A5A"/><rect x="5" y="-2" width="3" height="2.5" fill="#8C8A5A"/>`
      : `<rect x="-22" y="-26" width="44" height="26" rx="2" fill="#E8DCC0" opacity=".55" stroke="#B9A882"/><path d="M-22 -3 h44" stroke="#C9A060" stroke-width="3"/><ellipse cx="0" cy="-7" rx="9" ry="3" fill="${c}"/><circle cx="9" cy="-8" r="3" fill="${c}"/><path d="M-9 -7 q-7 0 -9 -4" stroke="${c}" stroke-width="2.4" fill="none"/>${[-5, -1, 3].map(sx => `<circle cx="${sx}" cy="-8" r=".9" fill="${c2}"/>`).join('')}${eye(10, -8.5)}`;
  } else return '';
  return `<g transform="translate(${x} ${y}) scale(${k})">${g}</g>`;
}
// in the room: dogs and cats wander the floor, cages and tanks sit by the window
function petsRoomSVG() {
  if (!S.me) return '';
  const L = petsOf().filter(p => PET_BY[p.kind].body !== 'none').slice(0, 3); if (!L.length) return '';
  const fixed = [[372, 128], [30, 128], [350, 128]];
  let fi = 0;
  return `<g class="pets">${L.map((p, i) => { const X = PET_BY[p.kind], b = X.body, mood = p.mood < 35 ? ' pet-sad' : '';
    const t = `<title>${esc(p.name)}, ${esc(X.n.toLowerCase())} · ${p.mood >= 70 ? 'happy' : p.mood >= 35 ? 'all right' : 'missing you'}</title>`;
    if (b === 'dog' || b === 'cat' || (b === 'small' && X.long) || (b === 'reptile' && X.shell)) { const x0 = 70 + ((p.id * 97) % 220); return `<g class="pet-roam${mood}" style="animation-duration:${16 + (p.id % 5) * 3}s;animation-delay:-${p.id * 3}s">${t}${petSprite(p, x0, 176, b === 'small' || b === 'reptile' ? .9 : .82)}</g>`; }
    const [fx, fy] = fixed[fi++ % fixed.length]; return `<g class="pet-fixed${mood}">${t}<rect x="${fx - 20}" y="${fy}" width="40" height="${176 - fy}" fill="#8C6A48"/>${petSprite(p, fx, fy, .9)}</g>`; }).join('')}</g>`;
}
{ const _hs = homeSceneSVG; homeSceneSVG = function (day) { const s = _hs(day), P2 = petsRoomSVG(); return P2 ? s.replace(/<\/svg>$/, P2 + '</svg>') : s; }; }
// ---- the page ----
function petsHTML() {
  const M = S.me; if (!M) return ''; const L = petsOf(), offer = petsOnOffer(), locked = petsLocked(), cap = petCap(), T = petTier();
  const reg = offer.filter(x => x.hubs), base = offer.filter(x => !x.hubs);
  const card = x => `<div class="petcard">${petCardSVG(x)}<div><b>${esc(x.n)}</b>${x.hubs ? ' <span class="chip small">only here</span>' : ''}<p class="small muted">${esc(x.d)}</p><p class="small">${x.fee ? fmtCash(usd(x.fee)) : 'Free'} to adopt · ${fmtCash(usd(x.wk))}/week · lives ~${x.life} years</p>${L.length >= cap ? '' : `<button class="btn small" data-pet="adopt:${x.k}" ${M.cash < usd(x.fee) ? 'disabled' : ''}>Adopt</button>`}</div></div>`;
  const mine = p => { const X = PET_BY[p.kind]; return `<div class="petcard mine">${petCardSVG(X, p)}<div><b>${esc(p.name)}</b> <span class="muted small">${esc(X.n)}, ${petAge(p) < 1 ? Math.max(1, Math.round(petAge(p) * 12)) + ' months' : Math.round(petAge(p)) + ' years'} old</span>
     <div class="ambrow"><span class="small">Mood</span><span class="tbar"><i style="width:${Math.round(p.mood)}%"></i></span></div><div class="ambrow"><span class="small">Health</span><span class="tbar"><i style="width:${Math.round(p.health)}%"></i></span></div>
     ${(p.credits || []).length ? `<p class="small">🎬 On screen in ${p.credits.map(f => fl(f)).join(', ')}</p>` : ''}
     <p><button class="btn small" data-pet="spoil:${p.id}" ${p.spoilW === S.week ? 'disabled' : ''}>Treats and a toy (${fmtCash(usd(40))})</button> <button class="btn small" data-pet="vet:${p.id}" ${p.vetW === S.week ? 'disabled' : ''}>Check-up</button> <button class="btn small ghost" data-pet="name:${p.id}">Rename</button> <button class="btn small ghost" data-pet="rehome:${p.id}">Find them a new home</button></p></div></div>`; };
  const gone = (M.pets || []).filter(p => p.gone);
  return `<section class="panel petspanel"><h3>Pets</h3>
   ${L.length ? `<div class="petgrid">${L.map(mine).join('')}</div>
     <p class="small">${L.some(p => ['dog', 'none'].includes(PET_BY[p.kind].body)) ? 'Dogs need you around: a full working week without a sitter makes them miserable. ' : ''}<label><input type="checkbox" data-pet="sitter:0" ${M.petSitter ? 'checked' : ''}> Pet sitter (${fmtCash(usd(70))}/week)</label></p>`
   : '<p class="muted">No pets yet. A pet takes the edge off bad weeks, and dogs get you talking to people at the park.</p>'}
   <p class="small muted">Room for ${cap} at your place${L.length >= cap ? ' (full: a bigger place means room for more)' : ''}.</p>
   ${L.length < cap ? `<h4>At the shelter and the breeders</h4><div class="petgrid">${base.map(card).join('')}</div>
     ${reg.length ? `<h4>Only in ${esc(HUBS[M.hub].name)}</h4><div class="petgrid">${reg.map(card).join('')}</div>` : ''}` : ''}
   ${locked.length ? `<p class="small muted">${T < 1 ? 'Once you\'re settled (some savings, or a few months in the business), more breeds open up. ' : T < 2 ? 'With real money, or your own place, rarer animals open up. ' : 'A big house opens up the biggest commitments. '}Every city has its own: ${HUB_IDS.filter(h => h !== M.hub && PET_KINDS.some(x => x.hubs && x.hubs.includes(h))).length} more cities with breeds you can only find there.</p>` : ''}
   ${gone.length ? `<p class="small muted">Remembered: ${gone.map(p => `${esc(p.name)} (${p.gone === 'died' ? '✝' : 'rehomed'} ${yearOf(p.goneW)})`).join(', ')}</p>` : ''}</section>`;
}
function petCardSVG(x, p) { return `<svg class="petpic" viewBox="-30 -50 70 54" width="84" height="64">${petSprite(p || { kind: x.k, id: 1 }, 0, 0, 1)}</svg>`; }
function petClick(t) {
  if (!t.dataset.pet) return false; const [k, v] = t.dataset.pet.split(':');
  doAct(k === 'adopt' ? { t: 'pet', k, kind: v } : { t: 'pet', k, id: +v }); render(true); return true;
}
OS_EXTRA.pets = ['🐾', 'Pets', 'Adopt, care for and show off your animals; some breeds only exist in certain cities'];
OS_VIEWS.pets = () => petsHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'You'); if (g && !g[1].includes('pets')) g[1].push('pets'); }
