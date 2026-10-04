// ---------------- The shops, part two ----------------
// A fuller marketplace: more gear, books, courses, luxuries and things to collect; monthly limited drops, with next
// month's already in production; relics from film history, won at a quarterly auction, bought from a dealer at a
// premium or dug out of an estate sale on a lucky roll; dozens more apps, some of them subscriptions; grander homes and
// stranger vehicles; and furniture that earns its price. What you own changes your weeks, and a few things change how
// people see you across a desk, which is to say your odds.

// ---- more of everything in the bazaar ----
function bzAdd(cat, label, items) {
  if (!BAZAAR[cat]) BAZAAR[cat] = { label, items: {} };
  Object.assign(BAZAAR[cat].items, items);
  for (const k in items) BZ_BY[k] = Object.assign({ cat, k }, items[k]);
}
bzAdd('gear', '', {
  gimbal: { name: 'A handheld gimbal', price: 450, from: 2013, d: 'Floating shots on a budget. Movement grows every week.', fx: { grow: { move: .012, speed: .006 } } },
  slider: { name: 'A camera slider and dolly track', price: 600, d: 'Eighteen inches of pure production value. Composition and movement grow.', fx: { grow: { comp: .008, move: .008 } } },
  ledkit: { name: 'A three-light LED kit', price: 800, from: 2010, d: 'Key, fill, back. Lighting grows every week.', fx: { grow: { light: .016 } } },
  tablet: { name: 'A drawing tablet and stylus', price: 1100, from: 2011, d: 'Storyboards on the bus. Vision and composition grow.', fx: { grow: { comp: .008 } } },
  vrset: { name: 'A VR headset', price: 500, from: 2016, d: 'Walk through your own sets before they exist. World-building grows.', fx: { grow: { world: .012, digi: .006 } } },
  printer3d: { name: 'A 3D printer', price: 900, from: 2014, d: 'Props, prototypes, a lot of small plastic dragons. Practical effects and sets grow.', fx: { grow: { prac: .012, sets: .006 } } },
  modular: { name: 'A modular synth', price: 2400, d: 'Cables everywhere and one sound you will never find again. Sound design and themes grow.', fx: { grow: { sdes: .014, theme: .008 } } },
  lavs: { name: 'Wireless lavalier mics', price: 750, from: 2004, d: 'Clean dialogue in a noisy street. Sound grows every week.', fx: { grow: { sound: .012 } } },
  workstation: { name: 'An editing workstation', price: 3800, from: 2002, d: 'Renders before you finish your coffee. Rhythm and colour grow; −1 stress a week.', fx: { stress: -1, grow: { rhythm: .012, colour: .008 } } },
  cinecam: { name: 'A cinema camera body', price: 8500, from: 2012, d: 'The camera on half the indies at the festival. Composition, lighting and colour grow fast.', fx: { grow: { comp: .016, light: .014, colour: .01 } } },
  bolex: { name: 'A wind-up 16mm camera', price: 2600, d: 'Twenty-eight seconds a roll, every frame a decision. Composition and taste grow.', fx: { grow: { comp: .012, tas: .008 } } },
  makeupkit: { name: 'A professional make-up kit', price: 650, d: 'Prosthetics, blood, ageing. Make-up grows every week.', fx: { grow: { mkup: .016 } } },
  stuntmats: { name: 'Crash mats and a rigging harness', price: 1300, d: 'Fall properly, in your own garage. Stunts and physicality grow.', fx: { grow: { stunt: .012, phys: .008 } } },
  voicebooth: { name: 'A vocal booth in the wardrobe', price: 1200, d: 'Duvets and foam. Voice work grows every week.', fx: { grow: { voice: .016 } } },
  fxsoftware: { name: 'A compositing licence', price: 2100, from: 1998, d: 'Nodes, roto, green screens. Digital effects grow every week.', fx: { grow: { digi: .016 } } }
});
bzAdd('books', '', {
  b_save: { name: 'Save the Kitten: the Last Book on Structure You\'ll Ever Read', price: 20, once: { struc: .4 }, d: 'Read once: structure, beat by beat.' },
  b_hero: { name: 'The Writer\'s Odyssey', price: 26, once: { struc: .3, orig: .3 }, d: 'Read once: myth and structure.' },
  b_blink: { name: 'In the Blink of a Cut', price: 18, once: { rhythm: .5, cont: .2 }, d: 'Read once: why we cut when we cut.' },
  b_sculpt: { name: 'Sculpting in Moments', price: 24, once: { vstory: .4, tas: .3 }, d: 'Read once: a director on time and images.' },
  b_hitch: { name: 'The Long Interview (two directors, one week)', price: 35, once: { pace: .4, vstory: .3 }, d: 'Read once: suspense, explained by the master.' },
  b_adv: { name: 'Adventures in the Screen Trade, Still', price: 22, once: { pack: .3, char: .2, talent: .2 }, d: 'Read once: nobody knows anything.' },
  b_stan: { name: 'The Method and Its Discontents', price: 24, once: { range: .4, voice: .2 }, d: 'Read once: inside the system and out of it.' },
  b_light: { name: 'Painting with Light, the Old Way', price: 40, once: { light: .5 }, d: 'Read once: lighting from a studio-era master.' },
  b_sound: { name: 'The Sound Book: Listening for Film', price: 30, once: { sdes: .4, sound: .3 }, d: 'Read once: sound design.' },
  b_market: { name: 'Opening Weekend: How Films Are Sold', price: 32, once: { mkt: .5, dist: .3 }, d: 'Read once: marketing and release.' },
  b_law: { name: 'Clearances, Contracts and Chain of Title', price: 45, once: { fin: .3, bud: .3 }, d: 'Read once: the paperwork that kills films.' },
  b_comedy: { name: 'Why Things Are Funny', price: 19, once: { comic: .5, impro: .2 }, d: 'Read once: the rule of three, and the fourth thing.' },
  b_costume: { name: 'Dressed: a Century of Film Costume', price: 55, once: { wardrobe: .5, period: .3 }, d: 'Read once: costume design.' },
  b_vfx: { name: 'The Illusion Factory', price: 48, once: { digi: .4, prac: .3 }, d: 'Read once: how effects are made.' },
  b_crit: { name: 'A Life at the Movies (collected reviews)', price: 28, once: { tas: .5 }, d: 'Read once: taste, a thumb at a time.' },
  b_music: { name: 'On the Track', price: 42, once: { score: .4, orch: .3 }, d: 'Read once: the film composer\'s handbook.' }
});
bzAdd('courses', '', {
  c_actclass: { name: 'Ten weeks of scene study', price: 900, once: { range: .5, pres: .3 }, energy: -8, d: 'A small room, honest notes and a lot of crying.' },
  c_improv: { name: 'Improv level one, two and three', price: 750, once: { impro: .6, comic: .3 }, energy: -6, meet: 1, d: 'Yes, and. Funny people for friends.' },
  c_voice: { name: 'Voice and dialect coaching', price: 640, once: { voice: .6, lang: .2 }, d: 'Accents that won\'t embarrass a native.' },
  c_dgaprep: { name: 'An AD training placement', price: 400, once: { setm: .5, stag: .3 }, energy: -10, meet: 1, d: 'A week shadowing a first AD. You learn what a call sheet really is.' },
  c_colour: { name: 'A colour-grading intensive', price: 1100, once: { colour: .8 }, d: 'Five days in a dark room learning to see.' },
  c_producer: { name: 'A producers\' lab', price: 1500, once: { pack: .5, fin: .4 }, meet: 2, energy: -10, d: 'Ten producers, ten projects, one tired weekend.' },
  c_writersroom: { name: 'A writers\' room simulation', price: 850, once: { struc: .3, dial: .3, char: .3 }, meet: 1, d: 'Break a season in a week. Learn to pitch jokes and lose them.' },
  c_retreat: { name: 'A silent retreat', price: 1200, stress: -30, energy: 20, d: 'Ten days, no phone, no talking. Terrifying, then wonderful.' },
  c_sound: { name: 'Location sound bootcamp', price: 700, once: { sound: .6 }, d: 'Boom technique and the art of saying "quiet please".' },
  c_mba: { name: 'An executive course in media business', price: 6500, from: 1990, once: { fin: .6, dist: .5, mkt: .4 }, meet: 3, energy: -14, d: 'A week of case studies with people who run things.' }
});
bzAdd('luxury', '', {
  dinner: { name: 'Dinner at the restaurant everyone talks about', price: 700, meet: 1, stress: -6, d: 'Three-month waiting list; you know the maître d\'.' },
  tux: { name: 'Black tie, properly tailored', price: 4200, standing: 1, d: 'For the ceremonies. +1 standing once.' },
  stylist: { name: 'A stylist for awards season', price: 8000, standing: 2, d: 'Somebody else decides. You look incredible. +2 standing once.' },
  membership: { name: 'Membership of a members\' club', price: 5200, fx: { standing: .04 }, meet: 2, d: 'The same twenty people every week, and one of them is hiring.' },
  box: { name: 'A box at the big game', price: 15000, meet: 3, standing: 1, d: 'Clients, agents and an executive who loves the sport.' },
  jet: { name: 'A private jet to a festival', price: 42000, meet: 3, standing: 2, stress: -8, d: 'You arrive rested. Everybody notices which door you came through.' },
  island: { name: 'A week on a private island', price: 65000, stress: -40, energy: 30, d: 'Nobody can reach you. That is the point.' },
  patron: { name: 'Become a patron of a film archive', price: 25000, fx: { standing: .08, grow: { tas: .01 } }, d: 'Your name on a wall, a restoration you chose, and the archive\'s gratitude.' }
});
bzAdd('collect', '🗃️ Collecting', {
  vinyl: { name: 'A first-pressing soundtrack LP', price: 450, collect: 1, drift: .06, vol: .2, d: 'The sleeve has a coffee ring. Collectors say that\'s "provenance".' },
  comic: { name: 'A key-issue comic book, graded', price: 3800, collect: 1, drift: .09, vol: .45, d: 'First appearance of somebody who now has six films. Or will.' },
  leica: { name: 'A vintage rangefinder camera', price: 6200, collect: 1, drift: .05, vol: .15, fx: { grow: { comp: .006 } }, d: 'Still takes the best pictures you\'ve ever taken.' },
  firsted: { name: 'A first edition of a novel that became a classic film', price: 2400, collect: 1, drift: .05, vol: .12, fx: { grow: { adapt: .006 } }, d: 'Signed, but only by a previous owner.' },
  sneakers: { name: 'Deadstock limited sneakers', price: 1200, from: 1995, collect: 1, drift: .02, vol: .6, d: 'Never worn, never will be. Could be rent; could be a lesson.' },
  guitar: { name: 'A 1960s electric guitar', price: 14000, collect: 1, drift: .06, vol: .18, fx: { grow: { song: .008 } }, d: 'Somebody played it at a festival you\'ve heard of. Allegedly.' },
  posterset: { name: 'A set of foreign-release film posters', price: 900, collect: 1, drift: .07, vol: .25, fx: { grow: { tas: .006 } }, d: 'The same films, sold to different countries with different stars on top.' },
  cards: { name: 'A box of unopened trading cards', price: 300, collect: 1, drift: .04, vol: .7, d: 'Could be nothing. Could be a down payment.' },
  scriptlot: { name: 'A box of unproduced studio scripts', price: 1600, collect: 1, drift: .04, vol: .3, fx: { grow: { struc: .006, dial: .004 } }, d: 'Forty years of films that never happened. Some deserved to.' },
  whisky: { name: 'A cask of single malt', price: 9000, collect: 1, drift: .07, vol: .1, d: 'Ages in a warehouse in the rain. So do you.' },
  sculpt: { name: 'A bronze by a working sculptor', price: 22000, collect: 1, drift: .06, vol: .4, fx: { standing: .02 }, d: 'Heavy, abstract, and people stop talking when they see it.' },
  art2: { name: 'A work on paper by a famous painter', price: 120000, collect: 1, drift: .06, vol: .3, fx: { standing: .05 }, d: 'Small, unmistakable, insured for more than your car.' }
});

// ---- limited drops: three new things a month, and next month's already in production ----
const DROPS = {
  dr_boxset: { name: 'A numbered director\'s-cut box set', price: 260, collect: 1, drift: .05, vol: .3, fx: { grow: { tas: .008 } }, d: 'Seven hours of extras. Number 412 of 2,000.' },
  dr_vinyl: { name: 'A splatter-vinyl score reissue', price: 90, collect: 1, drift: .04, vol: .4, fx: { stress: -1 }, d: 'Red and black, like the poster. Sounds like the film.' },
  dr_collab: { name: 'A designer collab jacket', price: 1400, from: 2005, collect: 1, drift: .02, vol: .5, fx: { standing: .02 }, d: 'Embroidered with a film you love. Gone in eleven minutes.' },
  dr_phone: { name: 'This year\'s phone', price: 1100, from: 2007, d: 'Slightly better camera, slightly thinner. −1 stress a week until the next one.', fx: { stress: -1 } },
  dr_proto: { name: 'A beta-unit camera (loaned, then sold to you)', price: 4200, from: 2010, fx: { grow: { comp: .012, colour: .01 } }, d: 'The manufacturer wanted feedback. You wanted the camera.' },
  dr_keys: { name: 'An artisan keyboard', price: 380, from: 2012, fx: { grow: { dial: .006 } }, d: 'Every keystroke a small, expensive click.' },
  dr_steel: { name: 'An anniversary 4K steelbook', price: 45, from: 2016, collect: 1, drift: .03, vol: .3, d: 'The same film you own three times, in a metal box.' },
  dr_arcade: { name: 'A reissued arcade cabinet', price: 2200, fx: { stress: -2 }, d: 'You will set the high score. You will not write.' },
  dr_glasses: { name: 'Smart glasses', price: 1500, from: 2014, fx: { grow: { comp: .004 } }, collect: 1, drift: -.25, vol: .3, d: 'The future. Possibly. People look at you strangely.' },
  dr_pen: { name: 'A limited fountain pen', price: 650, collect: 1, drift: .04, vol: .15, fx: { grow: { dial: .006, char: .004 } }, d: 'Writing longhand slows you down in the right way.' },
  dr_instant: { name: 'An instant camera, film edition', price: 140, fx: { grow: { comp: .006 } }, d: 'Ten shots a pack. You learn to choose.' },
  dr_figure: { name: 'An ultra-limited action figure', price: 300, collect: 1, drift: .05, vol: .7, d: 'Mint in box. The box is the point.' },
  dr_cel: { name: 'A hand-painted animation cel', price: 1800, from: 1985, collect: 1, drift: .07, vol: .3, fx: { grow: { tas: .006 } }, d: 'One frame of twenty-four in one second of a film you grew up with.' },
  dr_token: { name: 'A digital token of a film still', price: 2500, from: 2021, to: 2022, collect: 1, drift: -.6, vol: .6, d: 'Worth exactly what somebody else believes. Which is a lesson.' },
  dr_concept: { name: 'A signed concept-art print', price: 480, collect: 1, drift: .05, vol: .2, fx: { grow: { world: .008, vis: .004 } }, d: 'The spaceship before it had a name.' },
  dr_facsim: { name: 'A numbered screenplay facsimile', price: 210, collect: 1, drift: .04, vol: .2, fx: { grow: { struc: .008 } }, d: 'Coffee stains and margin notes, reproduced faithfully.' },
  dr_foley: { name: 'A boutique foley kit', price: 520, fx: { grow: { sdes: .01 } }, d: 'Coconut shells, cornflour and a squeaky door hinge in a case.' },
  dr_chair: { name: 'A monogrammed director\'s chair', price: 380, fx: { stress: -1, standing: .01 }, d: 'Canvas, your name, and a reason to sit up straight.' },
  dr_tote: { name: 'A festival-exclusive tote bag', price: 35, fx: { standing: .005 }, d: 'Proves you were there. Holds scripts.' },
  dr_mug: { name: 'A mug from a famous production', price: 25, fx: { stress: -1 }, d: 'Crew-only. Somebody sold it on. You don\'t ask.' },
  dr_kit: { name: 'A stunt-pad kit, signature edition', price: 900, fx: { grow: { stunt: .01 } }, d: 'Designed by a famous stunt co-ordinator. Hurts slightly less.' },
  dr_lens: { name: 'An anamorphic lens adapter', price: 1300, from: 2014, fx: { grow: { comp: .01, light: .004 } }, d: 'Flares, ovals and the look of an expensive film.' },
  dr_watch: { name: 'A microbrand watch, numbered', price: 950, collect: 1, drift: .03, vol: .25, d: 'A small company, a tiny run, a big waiting list.' },
  dr_robot: { name: 'A robot vacuum', price: 400, from: 2002, fx: { stress: -1, energy: 1 }, d: 'One fewer thing. It talks to the cat.' }
};
bzAdd('drops', '🆕 Drops', DROPS);
const bzEra = B => (!B.from || S.year >= B.from) && (!B.to || S.year <= B.to);
function bzDrops(mo) {
  const r = hashRand(mo * 131 + 7), L = Object.keys(DROPS).filter(k => bzEra(DROPS[k])), out = [];
  for (let i = 0; i < 40 && out.length < 3 && L.length; i++) { const k = L[Math.floor(r() * L.length)]; if (!out.includes(k)) out.push(k); }
  return out;
}
function bzDropOn(k) { return bzDrops(Math.floor(S.week / 4)).includes(k); }
function bzDropsHTML() {
  const M = S.me, mo = Math.floor(S.week / 4), now = bzDrops(mo), next = bzDrops(mo + 1).filter(k => !now.includes(k)), left = 4 - S.week % 4;
  const card = k => { const B = BZ_BY[k], have = (M.bz || []).some(x => x.k === k && !x.sold); return `<div class="bzc"><b>${esc(B.name)}</b><span class="muted small">${esc(B.d)}</span>${B.collect ? `<span class="small muted">Collectible: ${B.drift > .04 ? 'likely to appreciate' : B.drift < 0 ? 'likely to lose value' : 'holds its value, roughly'}${B.vol >= .4 ? ', wildly' : ''}.</span>` : ''}<span class="bzp">${fmtCash(usd(B.price))}</span><button class="btn-s" data-bz="buy:${k}" ${have || M.cash < usd(B.price) ? 'disabled' : ''}>${have ? 'Yours' : 'Buy before it\'s gone'}</button></div>`; };
  return `<p class="muted small">Limited runs. These go away in ${left} week${left > 1 ? 's' : ''}; nothing comes back on purpose.</p><div class="bzgrid">${now.map(card).join('')}</div>
   <h4>In production for next month</h4><ul class="plain small">${next.map(k => `<li>🏭 <b>${esc(BZ_BY[k].name)}</b> <span class="muted">· about ${fmtCash(usd(BZ_BY[k].price))}</span></li>`).join('') || '<li class="muted">Nothing announced.</li>'}</ul>`;
}

// ---- relics: film history, lightly mocked, ruinously priced ----
// [key, name, film year, tier, price (2027 $), fx, description]
const RELICS = [
  ['slippers', 'Ruby-ish slippers', 1939, 'grail', 1800000, { standing: .15, stress: -2, hire: .3 }, 'One of several pairs of sequinned shoes from a musical about a farm girl and a tornado. Clicking the heels does nothing. You\'ve checked.'],
  ['falcon', 'A lead bird statuette', 1941, 'grail', 2400000, { standing: .15, hire: .3, grow: { tas: .01 } }, 'Black, heavy, and the stuff that dreams are made of. Weighs about as much as a small dog and twice as much as you expected.'],
  ['dress', 'A white halter dress, wind-tested', 1955, 'grail', 2600000, { standing: .18, hire: .25 }, 'It billowed over a subway grate and into history. Lives under glass, away from fans of every kind.'],
  ['sled', 'A child\'s sled with a flower painted on it', 1941, 'grail', 900000, { standing: .12, hire: .25, grow: { vstory: .008 } }, 'Most of them were burned on camera. This is one of the spares. Your guests will not stop asking what it means.'],
  ['piano', 'A small upright piano from a café in Morocco', 1942, 'grail', 1200000, { standing: .12, stress: -2, grow: { theme: .01 } }, 'Play it once, for old times\' sake. Then play it again.'],
  ['gullwing', 'A stainless gull-wing car with a flux gizmo', 1985, 'grail', 950000, { standing: .12, hire: .2 }, 'Does not reach eighty-eight miles an hour. Does not need roads, according to its owners\' club.'],
  ['hilt', 'A sword hilt built from a camera flash handle', 1977, 'grail', 450000, { standing: .1, hire: .2, grow: { prac: .008 } }, 'The prop shop made it out of a 1940s flashgun. You can tell, if you know. Nobody knows.'],
  ['fedora', 'A battered fedora and a bullwhip', 1981, 'legendary', 380000, { standing: .08, hire: .15, grow: { phys: .006 } }, 'Sweat-stained in exactly the right places. Comes with a certificate and a faint smell of snakes.'],
  ['door', 'A carved wooden panel that could have fit two', 1997, 'legendary', 420000, { standing: .08, hire: .12 }, 'The argument is settled in your living room every Thursday, and never the same way.'],
  ['tramp', 'A bowler hat, a cane and very big shoes', 1925, 'legendary', 300000, { standing: .08, grow: { comic: .01, phys: .006 } }, 'The moustache was glued on and is not included.'],
  ['moon', 'A plaster moon with a rocket in its eye', 1902, 'legendary', 210000, { standing: .07, grow: { vis: .01, prac: .006 } }, 'Painted by a stage magician who also ran a toy shop. The rocket is a later replacement; so is the eye.'],
  ['cinematographe', 'A hand-cranked camera from the very first screenings', 1895, 'legendary', 350000, { standing: .08, grow: { comp: .01, tas: .01 } }, 'It is a camera, a printer and a projector. So was the whole industry, once.'],
  ['typewriter', 'A typewriter that typed one sentence, thousands of times', 1980, 'legendary', 180000, { standing: .06, stress: 2, grow: { dial: .008 } }, 'All work and no play. Don\'t read the pages it came with; the pages are why the price is so low.'],
  ['wheel', 'Half a ship\'s wheel from a boat that was too small', 1975, 'legendary', 120000, { standing: .05, grow: { pace: .008 } }, 'Salvaged when the boat sank, which it did on purpose, eventually, after not doing it on purpose several times.'],
  ['volleyball', 'A volleyball with a handprint face', 2000, 'legendary', 260000, { standing: .06, stress: -2 }, 'It has been through a lot. Do not leave it near the sea. Do not shout its name in public.'],
  ['bike', 'A bicycle with a basket, flown once across the moon', 1982, 'legendary', 160000, { standing: .06, grow: { vstory: .006 } }, 'The basket has a towel in it. Nobody will tell you why.'],
  ['pack', 'A backpack-mounted ghost containment unit', 1984, 'legendary', 140000, { standing: .05, grow: { prac: .006 } }, 'Do not cross the streams. Do not plug it in. Never plug it in.'],
  ['arm', 'A chrome robot forearm', 1984, 'legendary', 110000, { standing: .05, hire: .08 }, 'Found in a factory, as these things are. It\'ll be back; it says so on the plinth.'],
  ['umbrella', 'A parrot-headed umbrella', 1964, 'legendary', 120000, { standing: .05, stress: -2 }, 'It does not fly. Please do not test this from the roof again.'],
  ['horse', 'A latex horse\'s head, in a hatbox', 1972, 'legendary', 65000, { hire: .12, standing: .03 }, 'People who open the box never ask you for a favour again. They do return your calls.'],
  ['spinner', 'A small metal spinning top', 2010, 'legendary', 70000, { standing: .04, grow: { struc: .006 } }, 'It hasn\'t stopped since you bought it. Probably a bearing. Probably.'],
  ['ticket', 'One golden ticket', 1971, 'legendary', 55000, { standing: .03, stress: -1 }, 'The chocolate was eaten in 1970. The tour is no longer available.'],
  ['shirt', 'A bowling shirt and a rug that really tied the room together', 1998, 'legendary', 75000, { stress: -3, standing: .03 }, 'The rug is a reproduction. The shirt abides.'],
  ['briefcase', 'A briefcase that glows when you open it', 1994, 'rare', 48000, { standing: .03, hire: .06 }, 'The bulb is extra. What\'s inside is between you and it.'],
  ['shark', 'A rubber shark tooth the size of your hand', 1975, 'rare', 18000, { grow: { prac: .006 } }, 'The mechanical shark kept sinking, so the film had to hide it, so it became a better film. A lesson in every tooth.'],
  ['carpet', 'A square of hotel carpet, hexagons', 1980, 'rare', 9000, { stress: 1, grow: { sets: .006 } }, 'Come play with us, it seems to say. You put it in the hall, then move it to the garage.'],
  ['flop', 'A clapperboard from the biggest flop of its decade', 1980, 'rare', 12000, { grow: { fin: .008, bud: .006 } }, 'A reminder. Hang it where you sign contracts.'],
  ['pill', 'A red pill set in a resin cube', 1999, 'rare', 22000, { grow: { digi: .006 } }, 'Or blue. It depends on the light, and on you.'],
  ['claw', 'A resin dinosaur claw', 1993, 'rare', 35000, { standing: .02, grow: { digi: .004, prac: .004 } }, 'Clever girl, says the label. The label is a reproduction too.'],
  ['curtain', 'A shower curtain with three rings missing', 1960, 'rare', 28000, { grow: { rhythm: .008 } }, 'Seventy-eight set-ups, fifty-two cuts and forty-five seconds. You hang it in the bathroom, briefly.'],
  ['bucket', 'A bucket from a high-school prom', 1976, 'rare', 9000, { stress: 1 }, 'Rinsed. Thoroughly. Twice.'],
  ['milk', 'A jug of blue milk from a desert farm', 1977, 'rare', 7000, { stress: -1 }, 'Do not drink. It was never milk.'],
  ['tracksuit', 'A yellow tracksuit with a black stripe', 2003, 'rare', 30000, { grow: { stunt: .008 } }, 'Previously owned by somebody else\'s tribute to somebody else.'],
  ['boom', 'A boom mic that dipped into a famous shot', 1990, 'rare', 4000, { grow: { sound: .008 } }, 'Fame of a kind. It\'s still in the film; look top left.'],
  ['crop', 'A model crop-duster', 1959, 'rare', 30000, { grow: { pace: .006, move: .004 } }, 'There\'s no crops to dust, said the man at the bus stop. He was right.'],
  ['vest', 'A prototype stabiliser vest', 1976, 'rare', 60000, { grow: { move: .012 } }, 'The first time a camera floated up a flight of museum steps, it was wearing this.'],
  ['chocbox', 'A chocolate box, empty', 1994, 'rare', 15000, { stress: -1 }, 'You never know what you\'re going to get. In this case: nothing. It\'s empty.'],
  ['eyelash', 'A bowler hat and one false eyelash', 1971, 'rare', 18000, { grow: { wardrobe: .008 } }, 'A little of the old ultraviolence, in a very small display case.']
];
const RELIC = {}; for (const [k, name, y, tier, price, fx, d] of RELICS) { RELIC['rl_' + k] = { k: 'rl_' + k, name, y, tier, price, fx, d }; BZ_BY['rl_' + k] = { cat: 'relics', k: 'rl_' + k, name, price, collect: 1, drift: .07, vol: .16, d }; }
// A relic only exists once its film has been out a few years.
function relicPool(tier) { const L = Object.values(RELIC).filter(R => R.y + 3 <= S.year); const T = tier ? L.filter(R => R.tier === tier) : L; return T.length ? T : L; }
const RELIC_TIER = { rare: ['Rare', '#5E7C78'], legendary: ['Legendary', '#7E5AA6'], grail: ['Holy grail', '#B8860B'] };
const relicOwned = k => (S.me && S.me.bz || []).some(x => x.k === k && !x.sold);
function relicsOwned() { return (S.me && S.me.bz || []).filter(x => !x.sold && RELIC[x.k]).map(x => RELIC[x.k]); }
// The quarter's headline lot at the Grand Auction, and the dealer's two pieces.
function relicAuction() {
  const q = Math.floor(S.week / 13), r = hashRand(q * 733 + 5), x = r(), tier = x < .3 ? 'grail' : x < .75 ? 'legendary' : 'rare';
  const L = relicPool(tier);
  return { q, id: L[Math.floor(r() * L.length)].k, closes: (q + 1) * 13 };
}
function relicDealer() {
  const q = Math.floor(S.week / 13), r = hashRand(q * 389 + 11), L = relicPool().filter(R => R.tier !== 'grail'), out = [];
  for (let i = 0; i < 20 && out.length < 2; i++) { const k = L[Math.floor(r() * L.length)].k; if (!out.includes(k)) out.push(k); }
  return out;
}
const BIDS = { low: ['Bid the low estimate', .9, .2], fair: ['Bid the high estimate', 1.2, .5], strong: ['Bid strong', 1.6, .8], all: ['Whatever it takes', 2.4, .97] };
function relicGive(k, paid, how) {
  const M = S.me, R = RELIC[k];
  M.bz.push({ id: M.seq++, k, name: R.name, w: S.week, paid, seed: M.seq * 7 + 3 });
  diary(paid ? `Money: ${how}: ${R.name} (${fmtCash(paid)}).` : `${how.charAt(0).toUpperCase() + how.slice(1)}: ${R.name}.`);
  milestone(`Acquired ${/^[A-Z][a-z]/.test(R.name) && !/^[A-Z][a-z]+ [A-Z]/.test(R.name) ? R.name[0].toLowerCase() + R.name.slice(1) : R.name} (${R.y})`, 'home');
}
function relicRival() {
  const r = hashRand(S.week * 17 + 3);
  for (let i = 0; i < 300; i++) { const p = S.people[Math.floor(r() * S.people.length)]; if (p && !p.dead && p.standing >= 55) return p.name; }
  return 'an anonymous telephone bidder';
}
const DIG_JUNK = ['A box of VHS tapes, all labelled "misc".', 'A lamp shaped like a film reel. It doesn\'t work. It never worked.', 'Sixty-four issues of a trade paper from 1987, mostly about mergers.', 'A signed photo of somebody nobody can identify.', 'A director\'s chair with someone else\'s name on it, and a wobble.', 'A tin of film with nothing on it but a cat, walking slowly left.', 'A whole wardrobe of shoulder pads.', 'A rubber chicken. Prop or pet? Unclear.'];
function relicAct(a) {
  const M = S.me; M.bz = M.bz || [];
  if (a.k === 'deal') {
    const R = RELIC[a.id]; if (!R || !relicDealer().includes(a.id) || relicOwned(a.id)) return false;
    const cost = usd(Math.round(R.price * 1.5)); if (M.cash < cost) return false;
    M.cash -= cost; relicGive(a.id, cost, 'bought from Velvet Rope Antiques'); return true;
  }
  if (a.k === 'bid') {
    const L = relicAuction(), B = BIDS[a.lvl]; M.auct = M.auct || {};
    if (!B || M.auct[L.q] || relicOwned(L.id)) return false;
    const R = RELIC[L.id], cost = usd(Math.round(R.price * B[1])); if (M.cash < cost) return false;
    if (prnd() < B[2]) { M.auct[L.q] = 'won'; M.cash -= cost; relicGive(L.id, cost, 'won at the Grand Auction'); inbox('note', 'Sold, to the bidder on the phone', `The hammer comes down on ${R.name.toLowerCase()} at ${fmtCash(cost)}. The room turns round to see who you are.`); if (R.tier === 'grail') { ME().standing = clamp(ME().standing + 2, 0, 100); news('Industry', `${ME().name} buys ${R.name.toLowerCase()} at auction for ${fmtCash(cost)}.`, { person: ME().id }); } }
    else { M.auct[L.q] = 'lost'; inbox('note', 'Outbid', `${R.name} goes to ${relicRival()} for more than you were willing to pay. The auction house thanks you for your interest and sends a catalogue for next quarter.`); }
    return true;
  }
  if (a.k === 'dig') {
    const fee = usd(60); if (M.digW === S.week || M.cash < fee || M.energy < 8) return false;
    M.cash -= fee; M.energy -= 8; M.digW = S.week;
    const ok = roll('tas', 14), crit = M.lastRoll.crit > 0;
    const pickTier = tier => { const L = relicPool().filter(R => R.tier === tier && !relicOwned(R.k)); return L.length ? L[Math.floor(prnd() * L.length)] : null; };
    if (crit || (ok && prnd() < .3)) { const R = pickTier(crit ? 'legendary' : 'rare'); if (R) { relicGive(R.k, fee, 'found at an estate sale'); inbox('note', 'You won\'t believe what was in the garage', `Under a dust sheet behind the boiler: ${R.name.toLowerCase()}. The family wanted ${fmtCash(fee)} for "the lot". The lot is worth about ${fmtCash(usd(R.price))}.`); return true; } }
    if (ok) {
      const pool = S.films.filter(f => f.rel !== null && f.q >= 60 && S.week - f.rel > 104), f = pool[Math.floor(prnd() * pool.length)];
      if (f) { const kind = prnd() < .6 ? 'still' : 'poster', name = kind === 'still' ? `Signed lobby card: ${f.title}` : `Original one-sheet poster: ${f.title}`; M.bz.push({ id: M.seq++, k: 'lot', name, w: S.week, paid: fee, seed: M.seq * 7 + 3, film: f.id, kind }); diary(`Money: an estate sale turned up ${name.toLowerCase()} for ${fmtCash(fee)}.`); return true; }
    }
    diary(`An estate sale: ${DIG_JUNK[Math.floor(prnd() * DIG_JUNK.length)]} Nothing worth keeping.`);
    return true;
  }
  return false;
}
function relicsHTML() {
  const M = S.me, A = relicAuction(), R = RELIC[A.id], done = (M.auct || {})[A.q], dealer = relicDealer(), mine = relicsOwned();
  const badge = t => `<span class="chip" style="background:${RELIC_TIER[t][1]};color:#fff">${RELIC_TIER[t][0]}</span>`;
  const auction = `<div class="rl-auc"><p class="eyebrow">The Grand Auction · closes ${fmtDate(A.closes, true)}</p><h4>${esc(R.name)} <span class="muted">(${R.y})</span> ${badge(R.tier)}</h4><p>${esc(R.d)}</p><p class="small">Estimate ${fmtCash(usd(R.price * .9))}–${fmtCash(usd(R.price * 1.2))}. ${relicFxText(R)}</p>
   ${relicOwned(A.id) ? '<p class="good">Yours.</p>' : done ? `<p class="muted">You ${done === 'won' ? 'won it' : 'were outbid'} this quarter. A new lot comes up on ${fmtDate(A.closes, true)}.</p>` : `<p class="bf-row">${Object.entries(BIDS).map(([k, B]) => { const c = usd(Math.round(R.price * B[1])); return `<button class="btn-s${k === 'all' ? '' : ' ghost'}" data-relic="bid:${k}" ${M.cash < c ? 'disabled' : ''} title="About a ${Math.round(B[2] * 100)}% chance">${B[0]} · ${fmtCash(c)}</button>`; }).join(' ')}</p><p class="muted small">One bid a quarter. You only pay if you win; the stronger the bid, the likelier the room folds.</p>`}</div>`;
  const deal = `<h4>Velvet Rope Antiques</h4><p class="muted small">A dealer with two pieces a quarter and no interest in haggling: half as much again as auction.</p><div class="bzgrid">${dealer.map(k => { const D = RELIC[k], c = usd(Math.round(D.price * 1.5)), have = relicOwned(k); return `<div class="bzc"><div class="bzi">🏺</div><b>${esc(D.name)}</b> ${badge(D.tier)}<span class="muted small">${D.y} · ${esc(D.d)}</span><span class="small">${relicFxText(D)}</span><span class="bzp">${fmtCash(c)}</span><button class="btn-s" data-relic="deal:${k}" ${have || M.cash < c ? 'disabled' : ''}>${have ? 'Yours' : 'Buy'}</button></div>`; }).join('')}</div>`;
  const dig = `<h4>Estate sales</h4><p class="small">Every weekend somebody\'s grandfather who worked in pictures leaves a garage full of boxes. ${fmtCash(usd(60))} and 8 energy to rummage, once a week. A taste check (DC 15) finds something real; a natural 20 finds something legendary.</p><p><button class="btn-s" data-relic="dig" ${M.digW === S.week || M.cash < usd(60) || M.energy < 8 ? 'disabled' : ''}>${M.digW === S.week ? 'Back next weekend' : 'Go rummaging'}</button></p>`;
  const coll = `<h4>Your collection (${mine.length} of ${relicPool().length})</h4>${mine.length ? `<ul class="plain small">${mine.map(D => `<li>${badge(D.tier)} <b>${esc(D.name)}</b> <span class="muted">${D.y} · ${relicFxText(D)}</span></li>`).join('')}</ul><p class="muted small">Sell from the Yours tab; values drift up over time, and the auction house takes 12%.</p>` : '<p class="muted small">Nothing yet. Collectors start with a rubber tooth and end with a pair of slippers.</p>'}
   <details><summary class="small">Every relic known to exist</summary><ul class="plain small">${relicPool().map(D => `<li>${relicOwned(D.k) ? '✅' : '▫️'} ${esc(D.name)} <span class="muted">(${D.y}, ${RELIC_TIER[D.tier][0].toLowerCase()}, about ${fmtCash(usd(D.price))})</span></li>`).join('')}</ul></details>`;
  return auction + deal + dig + coll;
}
function relicFxText(R) {
  const f = R.fx, o = [];
  if (f.standing) o.push(`+${f.standing} standing a week`);
  if (f.hire) o.push(`+${f.hire} on hiring odds (a conversation piece)`);
  if (f.stress) o.push(`${f.stress > 0 ? '+' : '−'}${Math.abs(f.stress)} stress a week`);
  for (const k in f.grow || {}) o.push(`${(CRAFTS[SUB2C[k]] ? CRAFTS[SUB2C[k]].subs[k] : MINDS[k] || k).toLowerCase()} grows`);
  return o.join(' · ');
}
function relicClick(t) {
  const d = t.dataset; if (!d.relic) return false;
  const [k, x] = d.relic.split(':'), n0 = S.me.rollN || 0;
  doAct({ t: 'relic', k, id: k === 'deal' ? x : undefined, lvl: k === 'bid' ? x : undefined });
  render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll);
  return true;
}

// ---- the App Store: tools, subscriptions and two more games ----
Object.assign(SHOP, {
  hilo: { label: 'Higher or Lower: Box Office', d: 'Which film made more? Your taste against the grosses.', price: 6, kind: 'game' },
  yearq: { label: 'Name the Year', d: 'A film, four years. Pick the right one.', price: 6, kind: 'game' },
  scriptdraft: { label: 'ScriptDraft', d: 'The screenwriting software everyone pretends not to need. +1 page every writing day.', price: 250, kind: 'tool', from: 1991, fx: { pages: 1 } },
  frameline: { label: 'Frameline Storyboards', d: 'Shot lists and boards that cut together. Visual storytelling grows.', price: 120, kind: 'tool', from: 2008, fx: { grow: { vstory: .008, comp: .004 } } },
  stripboard: { label: 'Stripboard Scheduler', d: 'Break down a script, schedule a shoot. Budgeting and set management grow.', price: 300, kind: 'tool', fx: { grow: { bud: .008, setm: .006 } } },
  budgetpro: { label: 'Budget Pro', d: 'Top sheets and fringes. Financing grows every week.', price: 400, kind: 'tool', fx: { grow: { fin: .008, bud: .006 } } },
  gradelab: { label: 'GradeLab', d: 'Free colour software that is better than the paid ones. Colour grows; videos look better.', price: 0, kind: 'gear', gear: 'video', from: 2011, fx: { grow: { colour: .006 } } },
  nodeworks: { label: 'Nodeworks Compositor', d: 'The compositing package on every blockbuster. Digital effects grow.', price: 900, kind: 'tool', from: 2002, fx: { grow: { digi: .012 } } },
  foleybox: { label: 'FoleyBox Library', d: 'A hundred thousand sounds, including six kinds of punch. Sound design grows.', price: 180, kind: 'tool', fx: { grow: { sdes: .01 } } },
  sides: { label: 'Sides', d: 'Learn lines with a robot scene partner who never sighs. Range and voice grow.', price: 25, kind: 'tool', from: 2010, fx: { grow: { range: .006, voice: .006 } } },
  parlez: { label: 'Parlez', d: 'Ten minutes a day, and a cartoon bird who is disappointed in you. Languages grow.', price: 0, sub: 3, kind: 'sub', from: 2012, fx: { grow: { lang: .01 } } },
  stillwater: { label: 'Stillwater', d: 'Breathing exercises in a nice voice. −2 stress a week.', price: 0, sub: 3, kind: 'sub', from: 2012, fx: { stress: -2 } },
  snooze: { label: 'Snooze', d: 'Tracks your sleep and tuts at you. +2 energy a week.', price: 0, sub: 2, kind: 'sub', from: 2014, fx: { energy: 2 } },
  repcount: { label: 'RepCount', d: 'A trainer in your pocket. +2 energy a week, and stunts come easier.', price: 0, sub: 4, kind: 'sub', from: 2013, fx: { energy: 2, grow: { phys: .006 } } },
  castnet: { label: 'CastNet', d: 'The casting site every agent checks. A better shot at acting jobs.', price: 0, sub: 6, kind: 'sub', from: 2002, hire: ['actor', .2] },
  crewpro: { label: 'CrewList Pro', d: 'Your profile at the top of every crew search. A better shot at crew jobs.', price: 0, sub: 5, kind: 'sub', from: 2005, hire: ['crew', .15] },
  linkd: { label: 'Linkd Premium', d: 'See who looked at your profile, and message executives you\'ve never met. A small edge everywhere.', price: 0, sub: 9, kind: 'sub', from: 2005, hire: ['all', .08] },
  tracking: { label: 'The Tracking Board', d: 'Every script in town, who has it and who passed. Packaging grows; executives notice you know things.', price: 0, sub: 12, kind: 'sub', from: 2001, fx: { grow: { pack: .008, talent: .006 } }, hire: ['exec', .12] },
  boxpro: { label: 'Box Office Pro', d: 'Tracking, comps and release calendars. Marketing and distribution grow.', price: 0, sub: 8, kind: 'sub', from: 2008, fx: { grow: { mkt: .008, dist: .008 } } },
  inkwell: { label: 'Inkwell Pro', d: 'Better blogging tools, a custom domain and a newsletter list. Your reviews and posts reach further.', price: 0, sub: 4, kind: 'sub', from: 2004, fx: { grow: { tas: .006 } } },
  coverage: { label: 'ReaderBot Coverage', d: 'Instant notes on your script. Usually right about structure, always wrong about jokes.', price: 0, sub: 10, kind: 'sub', from: 2023, fx: { grow: { struc: .008, dial: .004 } } },
  fanbase: { label: 'Fanbase', d: 'Tells you when your followers are awake and what they want. +1 stress, more reach.', price: 0, sub: 6, kind: 'sub', from: 2012, fx: { stress: 1, grow: { mkt: .006 } } },
  orchestrate: { label: 'Orchestra in a Box', d: 'Sampled strings that fool most directors. Orchestration grows; music sounds better.', price: 600, kind: 'gear', gear: 'music', fx: { grow: { orch: .01 } } }
});
APPS.push(['hilo', '📈', 'Higher or Lower'], ['yearq', '📅', 'Name the Year']);
OS_EXTRA.hilo = ['📈', 'Higher or Lower', 'Which film made more?']; OS_EXTRA.yearq = ['📅', 'Name the Year', 'A film, four years'];
const lockedView = (k, fn) => () => appLocked(k) ? `<p>${esc(SHOP[k].label)} isn't installed. <button class="btn-s" data-app="store">Get it in the App Store</button></p>` : fn();
function hiloPair() {
  const L = S.films.filter(f => f.rel !== null && grossM(f) > 1 && S.week - f.rel > 8), r = Math.random;
  const a = L[Math.floor(r() * L.length)]; let b = a; for (let i = 0; i < 30 && (b === a || grossM(b) === grossM(a)); i++) b = L[Math.floor(r() * L.length)];
  return [a.id, b.id];
}
OS_VIEWS.hilo = lockedView('hilo', () => {
  const G = UI.hilo = UI.hilo || { n: 0, got: 0, streak: 0, pair: hiloPair() };
  const [a, b] = G.pair.map(i => S.films[i]);
  return `<p class="small muted">Which made more at the box office, worldwide? ${G.n ? `${G.got} of ${G.n} · streak ${G.streak}` : ''}</p>${G.last ? `<p class="${G.last.ok ? 'good' : 'bad'}">${esc(G.last.t)}</p>` : ''}<div class="cols two">${[a, b].map(f => `<button class="btn-s ghost hl-c" data-hl="${f.id}"><b>${esc(f.title)}</b><br><span class="muted small">${yearOf(f.rel)} · ${esc(f.genre || '')}</span></button>`).join('')}</div>`;
});
function yearqRound() {
  const L = S.films.filter(f => f.rel !== null && f.q >= 55), f = L[Math.floor(Math.random() * L.length)], y = yearOf(f.rel), opts = new Set([y]);
  while (opts.size < 4) opts.add(y + Math.round((Math.random() - .5) * 16) || y + 1);
  return { f: f.id, opts: [...opts].sort((a, b) => a - b) };
}
OS_VIEWS.yearq = lockedView('yearq', () => {
  const G = UI.yearq = UI.yearq || { n: 0, got: 0, r: yearqRound() }, f = S.films[G.r.f];
  return `<p class="small muted">What year did it come out? ${G.n ? `${G.got} of ${G.n}` : ''}</p>${G.last ? `<p class="${G.last.ok ? 'good' : 'bad'}">${esc(G.last.t)}</p>` : ''}<p class="big">${esc(f.title)}</p><p class="bf-row">${G.r.opts.map(y => `<button class="btn-s ghost" data-yq="${y}">${y}</button>`).join(' ')}</p>`;
});
function gamesClick(t) {
  const d = t.dataset;
  if (d.hl) { const G = UI.hilo, [a, b] = G.pair.map(i => S.films[i]), pick = +d.hl, best = grossM(a) >= grossM(b) ? a : b, ok = best.id === pick; G.n++; if (ok) { G.got++; G.streak++; } else G.streak = 0;
    G.last = { ok, t: `${ok ? 'Right' : 'No'}: ${a.title} ${hiloM(grossM(a))}, ${b.title} ${hiloM(grossM(b))}.` }; G.pair = hiloPair(); if (ok && G.streak % 4 === 0) doAct({ t: 'play', game: 'hilo', score: 2 }); render(true); return true; }
  if (d.yq) { const G = UI.yearq, f = S.films[G.r.f], y = yearOf(f.rel), ok = +d.yq === y; G.n++; if (ok) G.got++; G.last = { ok, t: `${ok ? 'Right' : 'No'}: ${f.title} came out in ${y}.` }; G.r = yearqRound(); if (ok && G.got % 3 === 0) doAct({ t: 'play', game: 'yearq', score: 2 }); render(true); return true; }
  if (d.unsub) { doAct({ t: 'buyapp', k: d.unsub, cancel: 1 }); render(true); return true; }
  if (d.storef) { UI.storef = d.storef; render(true); return true; }
  return false;
}
const hiloM = m => m >= 1000 ? '$' + (m / 1000).toFixed(2) + 'bn' : '$' + Math.round(m) + 'm';
const STORE_KINDS = { all: 'Everything', tool: '🛠️ Tools', sub: '🔁 Subscriptions', gear: '🎚️ Gear', game: '🎮 Games' };
function storeHTML() {
  const M = S.me, f = UI.storef || 'all', L = Object.entries(SHOP).filter(([, it]) => bzEra(it) && (f === 'all' || it.kind === f));
  const subs = Object.keys(M.subs || {}), weekly = subs.reduce((s, k) => s + usd(SHOP[k].sub), 0);
  return `<p class="bf-row">${Object.entries(STORE_KINDS).map(([k, l]) => `<button class="pill${f === k ? ' on' : ''}" data-storef="${k}">${l}</button>`).join('')} <span class="muted small" style="margin-left:auto">${subs.length ? `Subscriptions ${fmtCash(weekly)}/wk · ` : ''}Balance ${fmtCash(M.cash)}</span></p>
   <div class="shop">${L.map(([k, it]) => { const own = (M.owned2 || []).includes(k), sub = it.kind === 'sub', price = sub ? `${fmtCash(usd(it.sub))}/wk` : it.price ? fmtCash(usd(it.price)) : 'Free';
     return `<div class="sitem"><b>${esc(it.label)}</b> <span class="muted small">${STORE_KINDS[it.kind] || ''}</span><p class="small">${esc(it.d)}</p>${own ? (sub ? `<span class="good small">Subscribed</span> <button class="linkish" data-unsub="${k}">Cancel</button>` : '<span class="good small">Owned</span>') : `<button class="btn-s" data-buyapp="${k}" ${M.cash < usd(it.price || it.sub || 0) ? 'disabled' : ''}>${sub ? 'Subscribe' : 'Get'} ${price}</button>`}</div>`; }).join('')}</div>`;
}
// Weekly effects from apps, relics, where you live and how you travel; folded into the home's effects.
function kitFx(out) {
  const M = S.me, add = f => { if (!f) return; for (const k of ['energy', 'stress', 'pages', 'standing']) out[k] += f[k] || 0; for (const k in f.grow || {}) out.grow[k] = (out.grow[k] || 0) + f.grow[k]; };
  for (const k of M.owned2 || []) if (SHOP[k] && SHOP[k].fx && (SHOP[k].kind !== 'sub' || (M.subs || {})[k])) add(SHOP[k].fx);
  for (const R of relicsOwned()) add({ standing: R.fx.standing, stress: R.fx.stress, grow: R.fx.grow });
  const life = ORIGIN.life[M.life]; if (life && life.standingW) out.standing += life.standingW;
  const V = VEHICLES[M.vehicle || 'transit']; if (V && V.read) add({ grow: V.read });
}
// What your things do for your odds.
function kitFactors(post) {
  const M = S.me, t = tmplOf(post), actor = !!t.actor, exec = post.tier >= 3 && !actor, crew = !actor && post.tier <= 2, out = [];
  let app = 0; for (const k of Object.keys(M.subs || {})) { const h = SHOP[k] && SHOP[k].hire; if (h && (h[0] === 'all' || (h[0] === 'actor' && actor) || (h[0] === 'crew' && crew) || (h[0] === 'exec' && exec))) app += h[1]; }
  if (app) out.push(['Your subscriptions', Math.min(.35, app)]);
  const V = VEHICLES[M.vehicle || 'transit'], vf = (V && V.fx) || {};
  if (vf.crew && crew) out.push([`${V.label} (crews love wheels)`, .12]);
  if (vf.status && post.tier >= 2) out.push([`Arriving in ${V.label.toLowerCase()}`, vf.status * .08]);
  const R = relicsOwned().filter(x => x.fx.hire).sort((a, b) => b.fx.hire - a.fx.hire);
  if (R.length) out.push([`Your collection (${R[0].name.toLowerCase()}${R.length > 1 ? ` and ${R.length - 1} more` : ''})`, Math.min(.45, R.reduce((s, x) => s + x.fx.hire, 0))]);
  return out;
}
// Weekly upkeep for subscriptions; gifts from wrap parties; the monthly drop newsletter.
function shopWeek() {
  const M = S.me;
  for (const k of Object.keys(M.subs || {})) { const it = SHOP[k]; if (!it) continue; const c = usd(it.sub); if (M.cash < c) { delete M.subs[k]; M.owned2 = (M.owned2 || []).filter(x => x !== k); diary(`${it.label} cancelled your subscription: the card bounced.`); } else M.cash -= c; }
  if (M.jobs.length && prnd() < .004) { const L = relicPool().filter(R => R.tier === 'rare' && !relicOwned(R.k)); if (L.length) { const R = L[Math.floor(prnd() * L.length)]; M.bz = M.bz || []; relicGive(R.k, 0, 'a wrap-party present from the props department'); inbox('note', 'From the props department, with love', `The prop master hands you a box at the wrap party: ${R.name.toLowerCase()}. "It was going in a skip. You looked like you'd appreciate it."`); } }
  if (S.week % 4 === 0 && typeof mail === 'function') { const now = bzDrops(S.week / 4).map(k => BZ_BY[k].name), lc = t => /^[A-Z][a-z]/.test(t) && !/^[A-Z][a-z]+ [A-Z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t, list = L => L.length > 1 ? L.slice(0, -1).map(lc).join(', ') + ' and ' + lc(L[L.length - 1]) : lc(L[0]); mail('news', 'The Bazaar', `New this month: ${list(now)}`, `Limited runs, gone in four weeks: ${list(now)}. Also up for auction this quarter: ${lc(RELIC[relicAuction().id].name)}.`); }
}

// ---- grander places to live ----
Object.assign(ORIGIN.life, {
  penthouse: { label: 'A penthouse', d: 'Glass on three sides, a doorman, a lift that opens into the hall.', rent: 5200, rest: 10, stress: -4, standingW: .04 },
  beach: { label: 'A beach house', d: 'Sand in everything, waves all night, a deck for long phone calls.', rent: 7400, rest: 12, stress: -7, standingW: .04 },
  estate: { label: 'An estate in the hills', d: 'Gates, a pool, a screening room and a view everybody\'s seen in films.', rent: 9800, rest: 12, stress: -6, standingW: .1 }
});
const extraSpots = (base, more) => base.concat(more.map(([id, kind, x, y]) => ({ id, kind, x, y })));
Object.assign(HOME_SPOTS, {
  penthouse: extraSpots(HOME_SPOTS.own, [['wallC', 'wall', 282, 20], ['wallM', 'wall', 150, 24], ['nook', 'floor', 70, 172], ['sill2', 'small', 250, 94]]),
  beach: extraSpots(HOME_SPOTS.own, [['wallC', 'wall', 282, 20], ['nook', 'floor', 70, 172], ['sill2', 'small', 250, 94]]),
  estate: extraSpots(HOME_SPOTS.own, [['wallC', 'wall', 282, 20], ['wallM', 'wall', 150, 24], ['nook', 'floor', 70, 172], ['sill2', 'small', 250, 94], ['floorX', 'floor', 196, 176]])
});
const HOME_ICON2 = {
  penthouse: '<rect x="18" y="4" width="24" height="44" fill="#5E7C78"/>' + [0, 1, 2, 3, 4].map(i => `<rect x="21" y="${7 + i * 8}" width="18" height="5" fill="#BFD8F2"/>`).join('') + '<rect x="16" y="2" width="28" height="3" fill="#E3C27A"/>',
  beach: '<path d="M8 26 L30 12 L52 26 Z" fill="#E8A36B"/><rect x="12" y="26" width="36" height="16" fill="#F3EBDD"/><rect x="0" y="42" width="60" height="8" fill="#F2DDA4"/><path d="M0 46 q8 -4 15 0 t15 0 t15 0 t15 0" stroke="#3F8FBF" stroke-width="2" fill="none"/>',
  estate: '<rect x="4" y="22" width="52" height="24" fill="#F3EBDD"/><path d="M2 22 L30 8 L58 22 Z" fill="#8C3B3B"/>' + [0, 1, 2, 3].map(i => `<rect x="${9 + i * 12}" y="28" width="6" height="8" fill="#FFE9A8"/>`).join('') + '<rect x="0" y="46" width="60" height="4" fill="#5DBB85"/><rect x="40" y="44" width="16" height="3" fill="#3F8FBF"/>'
};

// ---- more ways to get around ----
Object.assign(VEHICLES, {
  ebike: { label: 'An electric bike', icon: '🚲', price: 1900, upkeep: 3, e: 3, stress: -1, from: 2012, d: 'A bike that does the hills for you. Arrive un-sweaty.', commute: ['You overtake a man in Lycra without trying.', 'The battery dies a mile from home. Legs it is.', 'Wind in your face, no sweat on your shirt.'] },
  moto: { label: 'A motorbike', icon: '🏍️', price: 6500, upkeep: 25, e: 1, stress: 1, standing: 1, d: 'Fast, loud, a helmet full of hair. Insurance companies hate you.', commute: ['Filtering through traffic like water through stones.', 'A near-miss with a delivery van. Heart going.', 'You pull up and take the helmet off slowly. Somebody watches.'], fx: { reach: 1 } },
  pickup: { label: 'A pickup truck', icon: '🛻', price: 24000, upkeep: 65, e: 1, d: 'Hauls a generator, a dolly and four crew. You will be asked to help people move.', commute: ['A bed full of sandbags and a coffee in the cupholder.', 'You give the grips a lift to set. They owe you.', 'Parallel parking this thing is a skill you now have.'], fx: { reach: 1, crew: 1 } },
  ev: { label: 'An electric car', icon: '🚙', price: 42000, upkeep: 40, e: 0, stress: -1, standing: 2, from: 2012, d: 'Silent, fast and smug. Charging is a new kind of waiting.', commute: ['It drives itself on the motorway, mostly.', 'Quiet enough to rehearse a pitch out loud.', 'You find a charger and a coffee. Twenty minutes, used well.'], fx: { reach: 1, status: 1 } },
  classic: { label: 'A vintage convertible', icon: '🏎️', price: 68000, upkeep: 220, e: 1, stress: -2, standing: 5, d: 'Beautiful, temperamental, a magnet for location scouts. Breaks down in the best places.', commute: ['Top down along the coast road. Worth every repair.', 'It won\'t start. You call a cab, and then a mechanic.', 'A valet asks if he can just sit in it for a minute.'], fx: { reach: 1, status: 2 } },
  driver: { label: 'A car and driver', icon: '🚖', price: 0, upkeep: 900, e: -2, stress: -2, standing: 4, d: 'Somebody else drives. You read, nap or take calls. Expensive by the week.', commute: ['You read twenty pages on the way in.', 'A nap, and you arrive new.', 'Three calls in the back seat; you land a meeting.'], fx: { reach: 1, status: 2 }, read: { struc: .006, pack: .006 } },
  heli: { label: 'A helicopter timeshare', icon: '🚁', price: 250000, upkeep: 1800, e: 0, standing: 8, d: 'Over the traffic and into the trades. It\'s absurd, and it works.', commute: ['The city slides by underneath, silent behind your headphones.', 'Fog. You take a car like an animal.', 'You land on a roof; somebody films it on their phone.'], fx: { reach: 1, status: 3 } }
});

// ---- more furniture (drawn as icons on the wall, the floor or the sill) ----
const FURN2 = {
  sofa: ['🛋️', 'floor', 'Velvet sofa', 1400, { stress: -2, energy: 1 }, 'Somewhere to collapse. −2 stress, +1 energy a week.'],
  projector: ['📽️', 'floor', 'Home cinema projector', 2200, { grow: { tas: .02 }, stress: -1 }, 'Films the size of a wall. Taste grows; −1 stress.'],
  editbay: ['🖥️', 'floor', 'An edit-suite desk', 3200, { grow: { rhythm: .01, shape: .008 }, train: 'edt' }, 'Two monitors and a chair you can sit in for twelve hours. Editing grows; editing classes go further.'],
  upright: ['🎹', 'floor', 'An upright piano', 4200, { grow: { theme: .012, score: .008 }, train: 'mus' }, 'Slightly out of tune, like the best ones. Music grows; music classes go further.'],
  drafting: ['📐', 'floor', 'A drafting table', 700, { grow: { sets: .01, world: .006 }, train: 'des' }, 'Elbow room for floor plans. Design grows; design classes go further.'],
  barcart: ['🍸', 'floor', 'A bar cart', 900, { standing: .03, stress: -1 }, 'People stay later. A sliver of standing a week.'],
  treadmill: ['🏃', 'floor', 'A treadmill', 1100, { energy: 3 }, 'Run while you watch dailies. +3 energy a week.'],
  dressform: ['🧵', 'floor', 'A dress form', 260, { grow: { wardrobe: .01 } }, 'Pin it, drape it, start again. Costume grows.'],
  arcade: ['🕹️', 'floor', 'An arcade cabinet', 2500, { stress: -3 }, 'A quarter of an hour of nothing. −3 stress a week.'],
  seats: ['💺', 'floor', 'Two seats from an old picture palace', 1800, { grow: { tas: .01 }, standing: .02 }, 'Red velvet, numbered, rescued from a demolition.'],
  aquarium: ['🐠', 'floor', 'An aquarium', 1200, { stress: -2 }, 'Fish don\'t care about the box office. −2 stress a week.'],
  cabinet: ['🏺', 'floor', 'A lit display cabinet', 2400, { standing: .03 }, 'For trophies and relics, under glass. Things you own are shown off properly.'],
  espresso2: ['☕', 'floor', 'A café-grade espresso machine', 3800, { energy: 5, stress: 1 }, 'Twin boilers, a learning curve. +5 energy, +1 stress a week.'],
  neon: ['💡', 'wall', 'A neon sign', 650, { stress: -1, grow: { vis: .01 } }, 'Says the name of a film that doesn\'t exist yet.'],
  whiteboard: ['📋', 'wall', 'A whiteboard of index cards', 90, { grow: { struc: .012 } }, 'Act one, act two, act three, and a lot of arrows. Structure grows.'],
  onesheet: ['🖼️', 'wall', 'A framed vintage one-sheet', 400, { grow: { tas: .02 }, standing: .01 }, 'A real one, folded once for the cinema post.'],
  panels: ['🎛️', 'wall', 'Acoustic panels', 500, { grow: { sound: .01, sdes: .008 } }, 'Your room stops echoing. Sound grows.'],
  tv: ['📺', 'wall', 'A very big television', 1800, { grow: { tas: .008 }, stress: -1 }, 'Everything, all the time. −1 stress.'],
  mapwall: ['🗺️', 'wall', 'A map of locations, pinned', 60, { grow: { world: .008 } }, 'Places you\'ve shot, places you will.'],
  typewriter: ['⌨️', 'small', 'A portable typewriter', 450, { grow: { dial: .01, orig: .006 } }, 'No internet. Just you and the page. Dialogue and originality grow.'],
  bonsai: ['🌳', 'small', 'A bonsai', 180, { stress: -2 }, 'You can\'t rush it. You learn something. −2 stress a week.'],
  candle: ['🕯️', 'small', 'A candle that smells of a cinema', 20, { stress: -1 }, 'Popcorn, velvet and dust. −1 stress.'],
  luckycat: ['🐱', 'small', 'A waving lucky cat', 30, { standing: .005 }, 'It waves at everybody. Some of them wave back.'],
  clapper: ['🎬', 'small', 'A signed clapperboard', 120, { grow: { tas: .006 } }, 'From your first set, or somebody\'s.']
};
for (const [id, [icon, kind, name, price, fx, d]] of Object.entries(FURN2)) FURNITURE[id] = { name, price, kind, fx, d, icon };
function furnitureSVG2(id, x, y) {
  const F = FURNITURE[id]; if (!F || !F.icon) return '';
  if (id === 'cabinet') { const R = relicsOwned().slice(0, 6); return `<g transform="translate(${x} ${y})"><rect x="0" y="-70" width="50" height="70" fill="#3B3226"/><rect x="3" y="-67" width="44" height="60" fill="#E9F2F5" opacity=".55"/><rect x="3" y="-38" width="44" height="2" fill="#B9B5AE"/>${R.map((_, i) => `<text x="${12 + (i % 2) * 22}" y="${-46 + Math.floor(i / 2) * 26}" font-size="14" text-anchor="middle">🏺</text>`).join('')}<rect x="0" y="-72" width="50" height="3" fill="#FFE9A8" opacity=".8"/></g>`; }
  if (F.kind === 'wall') return `<g transform="translate(${x} ${y})"><rect width="44" height="44" rx="2" fill="#3B3226"/><rect x="3" y="3" width="38" height="38" fill="#F3EFF8"/><text x="22" y="31" font-size="22" text-anchor="middle">${F.icon}</text></g>`;
  if (F.kind === 'small') return `<g transform="translate(${x} ${y})"><text x="8" y="-2" font-size="18" text-anchor="middle">${F.icon}</text></g>`;
  return `<g transform="translate(${x} ${y})"><ellipse cx="24" cy="-2" rx="24" ry="4" fill="#000" opacity=".12"/><text x="24" y="-4" font-size="40" text-anchor="middle">${F.icon}</text></g>`;
}
// Relics without a cabinet sit on a shelf above the bed.
function relicSceneSVG(lay) {
  if (lay.cabinet) return '';
  const R = relicsOwned().slice(0, 4); if (!R.length) return '';
  return `<g transform="translate(110 108)"><rect x="-4" y="0" width="${R.length * 18 + 4}" height="3" fill="#6B4E3A"/>${R.map((_, i) => `<text x="${i * 18 + 7}" y="-1" font-size="13" text-anchor="middle">🏺</text>`).join('')}</g>`;
}
for (const g of OS_GROUPS) if (g[0] === 'Play') g[1].push('hilo', 'yearq');
