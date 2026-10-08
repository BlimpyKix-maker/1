// ---------------- For hire: the work between the big jobs ----------------
// Most directors don't go from film to film. They pay the rent and build a reel with commercials, music videos,
// episodes of other people's shows, second unit, a corporate film for a bank, a play in a room above a pub, the
// awards-night package. Every one is a credit, a fee, people met, and a chance to be noticed (or to be forgotten).
// Two ways in:
//  - offers find you (more of them as your level, reel, agent and repeat clients grow), and you negotiate: take it,
//    push for more money, trade money for control or a share, or pass;
//  - open briefs, posted monthly, that you pitch for with a treatment (a roll you can see the odds of).
// Once you're on it there's a day on set that goes wrong in some particular way; how you handle it moves the quality,
// and the quality decides what it does for you: fee, reel, standing, awards, the client calling again, and, for the
// best of them, the feature people who saw it.
// Other crafts get the same routes where they make sense (a DP shoots commercials, an editor cuts trailers, an actor
// does a spot, a composer writes a jingle). Everything rolls on the seeded player RNG when it happens.

// t: label, roles (who gets hired, with the credit they get), lv (lowest level), w (weeks), days (a week), fee [lo, hi]
// in today's dollars at level 3, subs (what the quality comes from), field (where it lives), pres (prestige, 1-5:
// harder to win and to negotiate, more for your name), fame (reach), back (can take a share), snag (its own problems)
const GIG_TYPES = {
  spot: { label: 'Commercial', roles: { director: 'Director', dp: 'Director of photography', editor: 'Editor', actor: 'Featured performer', composer: 'Composer', designer: 'Production designer', costume: 'Stylist', vfx: 'VFX supervisor', makeup: 'Hair and make-up', casting: 'Casting', sound: 'Sound mixer', ad: '1st AD', stunts: 'Stunt coordinator' }, lv: 1, w: 2, days: 3, fee: [6000, 28000], subs: { director: ['vstory', 'setm', 'tone'], dp: ['comp', 'light'], editor: ['rhythm', 'shape'], actor: ['pres', 'comic'], composer: ['theme', 'song'] }, field: 'film', pres: 2, fame: 2, snag: 'client' },
  mv: { label: 'Music video', roles: { director: 'Director', dp: 'Director of photography', editor: 'Editor', actor: 'Lead', designer: 'Production designer', costume: 'Stylist', vfx: 'VFX', makeup: 'Hair and make-up', stunts: 'Stunts' }, lv: 0, w: 2, days: 3, fee: [1500, 9000], subs: { director: ['vstory', 'tone', 'stag'], dp: ['move', 'colour'], editor: ['rhythm', 'sound'], actor: ['phys', 'pres'] }, field: 'music', pres: 2, fame: 4, snag: 'artist' },
  tvep: { label: 'TV episode', roles: { director: 'Episode director', dp: 'Episode DP', editor: 'Episode editor', writer: 'Freelance episode writer', actor: 'Guest star', composer: 'Episode score' }, lv: 3, w: 3, days: 5, fee: [18000, 42000], subs: { director: ['dact', 'pace', 'vstory'], writer: ['struc', 'dial'], actor: ['range', 'pres'] }, field: 'film', pres: 3, fame: 2, snag: 'show' },
  unit2: { label: 'Second unit', roles: { director: 'Second unit director', dp: 'Second unit DP', stunts: 'Second unit stunt coordinator', ad: 'Second unit 1st AD' }, lv: 3, w: 4, days: 5, fee: [15000, 38000], subs: { director: ['stag', 'setm', 'move'], dp: ['move', 'speed'] }, field: 'film', pres: 3, fame: 0, snag: 'action' },
  brand: { label: 'Branded short film', roles: { director: 'Director', dp: 'DP', writer: 'Writer', editor: 'Editor', actor: 'Lead' }, lv: 2, w: 3, days: 4, fee: [8000, 30000], subs: { director: ['vstory', 'tone', 'dact'], writer: ['orig', 'struc'] }, field: 'creator', pres: 2, fame: 3, back: 0, snag: 'client' },
  corp: { label: 'Corporate film', roles: { director: 'Director', dp: 'DP', editor: 'Editor', writer: 'Scriptwriter', actor: 'Presenter', composer: 'Music' }, lv: 0, w: 1, days: 3, fee: [2500, 9000], subs: { director: ['setm', 'dact'], writer: ['struc', 'dial'], actor: ['pres', 'voice'] }, field: 'film', pres: 1, fame: 0, snag: 'client' },
  docshort: { label: 'Documentary short for a broadcaster', roles: { director: 'Director', dp: 'Camera', editor: 'Editor', producer: 'Producer', composer: 'Music' }, lv: 2, w: 5, days: 3, fee: [6000, 22000], subs: { director: ['vstory', 'tone', 'pace'], editor: ['shape', 'rhythm'] }, field: 'film', pres: 3, fame: 2, back: 1, snag: 'doc' },
  stage: { label: 'Theatre production', roles: { director: 'Director', designer: 'Set designer', costume: 'Costume designer', actor: 'Cast', composer: 'Composer and sound', writer: 'Adaptation', sound: 'Sound designer' }, lv: 1, w: 6, days: 5, fee: [3000, 16000], subs: { director: ['dact', 'stag', 'pace'], actor: ['pres', 'range'], designer: ['sets', 'world'] }, field: 'stage', pres: 3, fame: 1, back: 1, snag: 'stage' },
  live: { label: 'Live event broadcast', roles: { director: 'Live director', dp: 'Camera supervisor', sound: 'Broadcast mixer', ad: 'Floor manager', actor: 'Host' }, lv: 3, w: 1, days: 4, fee: [12000, 45000], subs: { director: ['speed', 'pace', 'stag'], dp: ['speed', 'move'] }, field: 'film', pres: 3, fame: 3, snag: 'live' },
  concert: { label: 'Concert film', roles: { director: 'Director', dp: 'DP', editor: 'Editor', sound: 'Concert mixer' }, lv: 3, w: 4, days: 4, fee: [14000, 50000], subs: { director: ['vstory', 'move', 'tone'], editor: ['rhythm', 'sound'] }, field: 'music', pres: 3, fame: 4, back: 1, snag: 'live' },
  trailer: { label: 'Trailer', roles: { editor: 'Trailer editor', director: 'Trailer director', composer: 'Trailer music', sound: 'Trailer mix', writer: 'Copywriter' }, lv: 1, w: 2, days: 4, fee: [5000, 24000], subs: { editor: ['rhythm', 'shape', 'sound'], director: ['tone', 'pace'], composer: ['theme', 'orch'] }, field: 'film', pres: 2, fame: 1, snag: 'studio' },
  titles: { label: 'Title sequence', roles: { director: 'Title designer', vfx: 'Title animator', designer: 'Title designer', editor: 'Title editor' }, lv: 2, w: 3, days: 4, fee: [8000, 30000], subs: { director: ['vstory', 'tone'], vfx: ['digi', 'sdes'], designer: ['world', 'sets'] }, field: 'film', pres: 3, fame: 1, snag: 'studio' },
  webser: { label: 'Web series', roles: { director: 'Director', writer: 'Writer', actor: 'Lead', editor: 'Editor', dp: 'DP', producer: 'Producer' }, lv: 0, w: 6, days: 3, fee: [800, 6000], subs: { director: ['dact', 'tone'], writer: ['dial', 'orig'], actor: ['comic', 'impro'] }, field: 'creator', pres: 1, fame: 3, back: 1, snag: 'shoestring' },
  anth: { label: 'Anthology segment', roles: { director: 'Segment director', writer: 'Segment writer', actor: 'Segment lead', dp: 'Segment DP' }, lv: 2, w: 3, days: 5, fee: [4000, 15000], subs: { director: ['vstory', 'tone', 'dact'], writer: ['orig', 'struc'] }, field: 'film', pres: 3, fame: 2, back: 1, snag: 'shoestring' },
  special: { label: 'Stand-up special', roles: { director: 'Director', editor: 'Editor', dp: 'DP', producer: 'Producer' }, lv: 3, w: 2, days: 4, fee: [12000, 40000], subs: { director: ['pace', 'stag', 'speed'], editor: ['rhythm', 'cont'] }, field: 'stage', pres: 3, fame: 3, snag: 'live' },
  awards: { label: 'Awards-show package', roles: { director: 'Segment director', editor: 'Package editor', writer: 'Writer', actor: 'Presenter', composer: 'Music' }, lv: 3, w: 2, days: 4, fee: [10000, 32000], subs: { director: ['tone', 'pace'], editor: ['rhythm', 'shape'], writer: ['dial', 'orig'] }, field: 'film', pres: 3, fame: 3, snag: 'live' },
  game: { label: 'Game cinematics', roles: { director: 'Cinematics director', actor: 'Performance capture', writer: 'Narrative writer', vfx: 'Cinematics artist', composer: 'Composer', editor: 'Cinematics editor' }, lv: 3, w: 6, days: 5, fee: [20000, 60000], subs: { director: ['vstory', 'dact', 'stag'], actor: ['phys', 'voice'], vfx: ['digi', 'sdes'] }, field: 'film', pres: 3, fame: 2, snag: 'studio' },
  psa: { label: 'Public information film', roles: { director: 'Director', writer: 'Writer', actor: 'Lead', editor: 'Editor' }, lv: 0, w: 1, days: 2, fee: [1200, 5000], subs: { director: ['tone', 'vstory'], writer: ['struc', 'orig'] }, field: 'film', pres: 1, fame: 1, snag: 'client' },
  fashion: { label: 'Fashion film', roles: { director: 'Director', dp: 'DP', costume: 'Stylist', makeup: 'Hair and make-up', actor: 'Model' }, lv: 2, w: 2, days: 3, fee: [7000, 35000], subs: { director: ['tone', 'setm'], dp: ['light', 'colour'], costume: ['wardrobe', 'period'] }, field: 'creator', pres: 3, fame: 3, snag: 'client' },
  pilotpres: { label: 'Pilot presentation', roles: { director: 'Director', writer: 'Writer', actor: 'Lead', producer: 'Producer' }, lv: 3, w: 3, days: 5, fee: [9000, 26000], subs: { director: ['dact', 'tone', 'vstory'], writer: ['dial', 'char'] }, field: 'film', pres: 3, fame: 1, back: 1, snag: 'studio' },
  reshoot: { label: 'Additional photography', roles: { director: 'Additional photography director', dp: 'DP', editor: 'Editor' }, lv: 4, w: 2, days: 5, fee: [25000, 70000], subs: { director: ['dact', 'vstory', 'pace'], editor: ['shape', 'cont'] }, field: 'film', pres: 4, fame: 0, snag: 'studio' },
  doctor: { label: 'Script doctoring', roles: { writer: 'Uncredited rewrite' }, lv: 4, w: 2, days: 4, fee: [30000, 120000], subs: { writer: ['dial', 'struc', 'char'] }, field: 'film', pres: 4, fame: 0, snag: 'studio' },
  opera: { label: 'Opera production', roles: { director: 'Stage director', designer: 'Designer', costume: 'Costume designer', dp: 'Lighting designer' }, lv: 4, w: 8, days: 5, fee: [20000, 65000], subs: { director: ['stag', 'dact', 'tone'], designer: ['sets', 'period'] }, field: 'stage', pres: 5, fame: 2, snag: 'stage' },
  ride: { label: 'Theme park ride film', roles: { director: 'Director', vfx: 'VFX supervisor', dp: 'DP', writer: 'Writer' }, lv: 4, w: 6, days: 5, fee: [40000, 110000], subs: { director: ['vstory', 'stag'], vfx: ['digi', 'prac'] }, field: 'film', pres: 2, fame: 1, snag: 'studio' },
  museum: { label: 'Museum installation', roles: { director: 'Artist', dp: 'Cinematographer', editor: 'Editor', composer: 'Composer', designer: 'Designer' }, lv: 3, w: 6, days: 3, fee: [8000, 30000], subs: { director: ['tone', 'vstory'], dp: ['light', 'comp'], designer: ['world'] }, field: 'stage', pres: 4, fame: 1, snag: 'doc' },
  sportsdoc: { label: 'Sports documentary episode', roles: { director: 'Director', editor: 'Editor', dp: 'Camera', producer: 'Producer' }, lv: 3, w: 6, days: 4, fee: [15000, 45000], subs: { director: ['vstory', 'pace'], editor: ['shape', 'rhythm'] }, field: 'film', pres: 3, fame: 3, back: 1, snag: 'doc' },
  truecrime: { label: 'True crime episode', roles: { director: 'Director', editor: 'Editor', writer: 'Writer', producer: 'Producer' }, lv: 2, w: 5, days: 4, fee: [9000, 28000], subs: { director: ['tone', 'vstory'], editor: ['shape', 'cont'], writer: ['struc'] }, field: 'film', pres: 2, fame: 2, snag: 'doc' },
  reality: { label: 'Reality TV block', roles: { director: 'Director', editor: 'Story editor', producer: 'Field producer', dp: 'Camera' }, lv: 1, w: 4, days: 5, fee: [6000, 20000], subs: { director: ['speed', 'pace'], editor: ['shape', 'rhythm'] }, field: 'film', pres: 1, fame: 1, snag: 'live' },
  soap: { label: 'Soap opera block', roles: { director: 'Block director', actor: 'Guest character', writer: 'Storyliner', editor: 'Editor' }, lv: 2, w: 3, days: 5, fee: [8000, 22000], subs: { director: ['speed', 'dact'], actor: ['range', 'impro'], writer: ['dial', 'struc'] }, field: 'film', pres: 1, fame: 2, snag: 'show' },
  kids: { label: "Children's TV episodes", roles: { director: 'Director', writer: 'Writer', actor: 'Presenter', composer: 'Songs', vfx: 'Puppets and effects' }, lv: 1, w: 3, days: 5, fee: [6000, 18000], subs: { director: ['pace', 'tone'], writer: ['orig', 'dial'], actor: ['comic', 'voice'] }, field: 'film', pres: 2, fame: 1, snag: 'show' },
  multicam: { label: 'Sitcom episode', roles: { director: 'Multi-camera director', writer: 'Punch-up writer', actor: 'Guest star', editor: 'Editor' }, lv: 4, w: 1, days: 5, fee: [25000, 55000], subs: { director: ['pace', 'stag', 'dact'], writer: ['dial', 'orig'], actor: ['comic', 'impro'] }, field: 'film', pres: 3, fame: 2, snag: 'show' },
  vertical: { label: 'Vertical micro-drama', roles: { director: 'Director', writer: 'Writer', actor: 'Lead', editor: 'Editor' }, lv: 0, w: 2, days: 5, fee: [1500, 6000], subs: { director: ['speed', 'tone'], writer: ['struc', 'dial'], actor: ['pres', 'range'] }, field: 'creator', pres: 1, fame: 2, back: 1, snag: 'shoestring' },
  vr: { label: 'Immersive experience', roles: { director: 'Director', vfx: 'Real-time artist', sound: 'Spatial sound', designer: 'World designer' }, lv: 3, w: 6, days: 4, fee: [12000, 40000], subs: { director: ['stag', 'vstory'], vfx: ['digi'], designer: ['world'] }, field: 'stage', pres: 3, fame: 2, back: 1, snag: 'studio' },
  launch: { label: 'Product launch keynote', roles: { director: 'Show director', dp: 'Lighting', editor: 'Video editor', actor: 'Host', sound: 'Show sound' }, lv: 3, w: 2, days: 4, fee: [15000, 55000], subs: { director: ['pace', 'stag', 'setm'], dp: ['light'] }, field: 'stage', pres: 2, fame: 1, snag: 'client' },
  campaign: { label: 'Political ad', roles: { director: 'Director', writer: 'Copywriter', editor: 'Editor', actor: 'Voice-over' }, lv: 2, w: 1, days: 3, fee: [6000, 30000], subs: { director: ['tone', 'vstory'], writer: ['dial', 'orig'], actor: ['voice'] }, field: 'film', pres: 2, fame: 1, snag: 'client' },
  wedding: { label: 'Wedding film', roles: { director: 'Filmmaker', dp: 'Camera', editor: 'Editor' }, lv: 0, w: 1, days: 2, fee: [900, 4000], subs: { director: ['tone', 'speed'], dp: ['light', 'speed'], editor: ['rhythm', 'shape'] }, field: 'creator', pres: 0, fame: 0, snag: 'client' },
  audio: { label: 'Audio drama', roles: { director: 'Director', writer: 'Writer', actor: 'Voice cast', sound: 'Sound designer', composer: 'Composer' }, lv: 1, w: 3, days: 3, fee: [2000, 9000], subs: { director: ['dact', 'tone'], writer: ['dial', 'struc'], actor: ['voice', 'range'], sound: ['sound'] }, field: 'podcast', pres: 2, fame: 1, back: 1, snag: 'shoestring' },
  taping: { label: 'Live podcast taping', roles: { director: 'Director', producer: 'Producer', sound: 'Mixer', actor: 'Guest' }, lv: 1, w: 1, days: 2, fee: [1500, 7000], subs: { director: ['pace', 'speed'], actor: ['impro', 'comic'] }, field: 'podcast', pres: 1, fame: 2, snag: 'live' },
  dub: { label: 'Dubbing', roles: { director: 'Dubbing director', actor: 'Dubbing actor', writer: 'Dubbing adaptation', sound: 'Dubbing mixer' }, lv: 1, w: 2, days: 4, fee: [2500, 9000], subs: { director: ['dact', 'tone'], actor: ['voice', 'lang'], writer: ['adapt', 'dial'], sound: ['sound'] }, field: 'film', pres: 1, fame: 0, snag: 'studio' },
  club: { label: 'Comedy showcase', roles: { actor: 'Comic', writer: 'Comic', director: 'Showcase host' }, lv: 0, w: 1, days: 2, fee: [150, 900], subs: { actor: ['comic', 'impro', 'pres'], writer: ['dial', 'orig'] }, field: 'stage', pres: 1, fame: 1, snag: 'live' },
  residency: { label: 'Club residency', roles: { composer: 'Resident act', sound: 'Resident DJ', actor: 'Resident singer' }, lv: 0, w: 4, days: 2, fee: [400, 2500], subs: { composer: ['song', 'theme'], sound: ['sound', 'rhythm'], actor: ['voice', 'pres'] }, field: 'music', pres: 1, fame: 1, snag: 'live' },
  festset: { label: 'Festival set', roles: { composer: 'Performer', sound: 'DJ set', actor: 'Performer' }, lv: 2, w: 1, days: 2, fee: [2000, 15000], subs: { composer: ['song', 'orch'], sound: ['sound', 'rhythm'], actor: ['voice', 'pres'] }, field: 'music', pres: 2, fame: 3, snag: 'live' },
  jingle: { label: 'Jingle', roles: { composer: 'Composer', actor: 'Singer', sound: 'Producer' }, lv: 0, w: 1, days: 2, fee: [1500, 12000], subs: { composer: ['song', 'theme'], actor: ['voice'] }, field: 'music', pres: 1, fame: 1, back: 1, snag: 'client' }
};
const GIG_KEYS = Object.keys(GIG_TYPES);
const gigFee = { 0: .3, 1: .4, 2: .6, 3: 1, 4: 1.6, 5: 2.6, 6: 4.2, 7: 6.5 };   // early work pays little; a name pays a lot

// ---- clients and names ----
const GIG_BRANDS = ['Kestrel Motors', 'Brightmilk', 'Halden Bank', 'Lumen Phones', 'Pop Fizz', 'Northwind Air', 'Greenleaf Grocers', 'Atlas Insurance', 'Velo Sportswear', 'Crisp & Co. crisps', 'Marlow Beer', 'Okto Trainers', 'Sundial Watches', 'Hearth Furniture', 'Bluefin Telecom', 'Paloma Perfume', 'Ironbark Outdoor', 'Tandem Rail', 'Quill Stationers', 'Copperline Energy', 'Mantis Games', 'Saffron Tea', 'Nimbus Streaming', 'Harbour Holidays', 'Petal Cosmetics', 'Granite Building Society', 'Zephyr Electric Cars', 'Plum Pet Food'];
const GIG_ORGS = ['the city council', 'a children\'s hospital', 'a road safety charity', 'the national blood service', 'a recycling campaign', 'a mental-health charity', 'the fire brigade', 'a literacy charity', 'an animal shelter', 'the water board'];
const GIG_CORPS = ['an insurance firm\'s sales conference', 'a pharmaceutical company\'s training video', 'a bank\'s annual meeting', 'a logistics company\'s safety film', 'a hotel chain\'s staff induction', 'a law firm\'s recruitment film', 'a supermarket\'s new-store launch', 'a university open day'];
const GIG_SPORT = ['a football club\'s season', 'a marathon runner\'s comeback', 'a boxing gym in the docks', 'a women\'s cricket team', 'a cycling team in the mountains', 'a high-school basketball final', 'a sailing crew around the world', 'a darts champion\'s last tour'];
const GIG_CRIME = ['a missing heiress in 1974', 'a forger who fooled the museums', 'a small-town poisoner', 'an unsolved bank job', 'a wrongful conviction overturned', 'a con artist who married six times'];
const GIG_EVENTS = ['the city marathon', 'a charity telethon', 'the music awards', 'New Year\'s Eve from the square', 'a royal gala', 'the national dance final', 'a festival\'s headline night', 'the film festival\'s opening ceremony'];
const GIG_PLAYS = ['a new play about two sisters and a farm', 'a revival of a 1950s drawing-room comedy', 'a one-man show about a lighthouse keeper', 'a Greek tragedy set in a car park', 'a musical about a failing bakery', 'a verbatim play about a strike', 'a Chekhov in a warehouse', 'a children\'s Christmas show'];
const GIG_OPERAS = ['a Carmen', 'a Tosca', 'a Magic Flute', 'a Don Giovanni', 'a Turandot', 'a new opera about the moon landing'];
const GIG_DOCS = ['a beekeeper who won\'t sell', 'the last cinema in a mining town', 'a choir of retired dockers', 'twins separated at birth', 'a woman who swims in the sea every day of the year', 'a family restaurant\'s final night', 'a lost rally driver', 'a forest that is moving'];
function gigClient(k) {
  const M = S.me;
  if (['spot', 'brand', 'fashion', 'launch', 'jingle'].includes(k)) return ppick(GIG_BRANDS);
  if (k === 'psa') return ppick(GIG_ORGS);
  if (k === 'corp') return ppick(GIG_CORPS);
  if (k === 'campaign') return ppick(['a mayoral candidate', 'a party\'s senate race', 'a referendum campaign', 'a union\'s campaign']);
  if (k === 'wedding') return ppick(['the Okafor-Lindqvist wedding', 'a vineyard wedding', 'a wedding in a car park, somehow lovely', 'a three-day wedding', 'a registry office and a pub']);
  if (k === 'mv' || k === 'concert') { const q = bestIn(M.hub, ['composer'], q => q.fame * .6 + prnd() * 40); return q ? q.name : 'a band on the rise'; }
  if (['tvep', 'soap', 'kids', 'multicam', 'reality'].includes(k) && typeof tvAll === 'function') {
    const L = tvAll().filter(s => tvOnAir(s, S.year) && s.y <= S.year && (k !== 'soap' || s.g === 'soap') && (k !== 'kids' || s.g === 'kids') && (k !== 'multicam' || s.g === 'sitcom') && (k !== 'reality' || ['reality', 'game', 'talk'].includes(s.g)));
    const s = L.length ? L[Math.floor(prnd() * L.length)] : null;
    if (s) return `${s.title} (${(TV_NETS[s.net] || {}).name || 'TV'})`;
  }
  if (k === 'sportsdoc') return ppick(GIG_SPORT);
  if (k === 'truecrime') return ppick(GIG_CRIME);
  if (k === 'docshort') return ppick(GIG_DOCS);
  if (k === 'live' || k === 'awards') return ppick(GIG_EVENTS);
  if (k === 'stage') return ppick(GIG_PLAYS);
  if (k === 'opera') return ppick(GIG_OPERAS);
  if (k === 'special') { const q = bestIn(M.hub, ['actor'], q => q.fame * .5 + prnd() * 40); return q ? `${q.name}'s stand-up special` : 'a comic\'s first special'; }
  if (['unit2', 'reshoot', 'doctor', 'trailer', 'titles', 'pilotpres'].includes(k)) { const f = S.films.filter(f => f.stage >= 1 && f.stage <= 3 && f.hub === M.hub); const x = f.length ? f[Math.floor(prnd() * f.length)] : null; return x ? x.title : 'a studio film in trouble'; }
  if (k === 'club') return ppick(['The Laughing Cellar', 'a basement club off the high street', 'the Thursday new-act night', 'a comedy club above a curry house', 'the industry showcase']);
  if (k === 'residency') return ppick(['a cocktail bar with a piano', 'a warehouse club', 'a hotel lobby bar', 'a rooftop bar', 'a jazz basement']);
  if (k === 'festset') return ppick(['a summer festival', 'a city weekender', 'a festival in a forest', 'a festival on a beach']);
  if (k === 'game') return ppick(['an open-world western', 'a space opera sequel', 'a horror game set in a ferry', 'a football game\'s story mode', 'a fantasy epic']);
  if (k === 'ride') return ppick(['a dinosaur ride', 'a haunted-hotel ride', 'a flying-over-the-city ride', 'a submarine ride']);
  if (k === 'museum') return ppick(['the natural history museum', 'a modern art gallery', 'a war museum', 'the maritime museum']);
  if (k === 'vr') return ppick(['a VR piece about the ocean floor', 'an immersive show in an old bank', 'a festival\'s new-media strand']);
  if (k === 'audio' || k === 'taping') return ppick(['a crime podcast', 'a horror anthology', 'a history show', 'a comedy podcast that sells out theatres']);
  if (k === 'dub') return ppick(['a Korean thriller', 'an anime series', 'a French comedy', 'a Danish crime drama', 'a Turkish soap']);
  return ppick(GIG_BRANDS);
}

// ---- who you are to the people hiring ----
function gigRole() { return ME().role; }
function gigsOf() { return S.me.gigs || []; }
// the reel: what you've made for hire lately, weighted by how good it was
// (a reel shows your best: the five strongest pieces of the last three years, less anything bad enough to be talked about)
function reelScore() {
  const L = gigsOf().filter(g => S.week - g.w < 156), best = L.map(g => g.q).sort((a, b) => b - a).slice(0, 5);
  return best.reduce((s, q) => s + clamp((q - 55) / 12, 0, 3), 0) - L.filter(g => g.q < 35).length * .5;
}
// what each dream goes looking for
const DREAM_GIGS = { mvdir: ['mv', 'concert'], standup: ['club', 'special', 'taping', 'multicam'], singer: ['residency', 'festset', 'jingle', 'mv'], rapper: ['residency', 'festset', 'mv'], dj: ['residency', 'festset', 'live', 'launch'], beatmaker: ['jingle', 'residency'], musician: ['residency', 'festset', 'jingle'], doc: ['docshort', 'sportsdoc', 'truecrime'], stagedir: ['stage', 'opera'], stageactor: ['stage', 'audio'], musicaltheatre: ['stage', 'awards'], playwright: ['stage', 'audio'], showrunner: ['tvep', 'pilotpres', 'soap'], host: ['live', 'awards', 'launch', 'taping'], voice: ['dub', 'audio', 'game'], podcaster: ['taping', 'audio'], radio: ['taping', 'jingle'], audiodrama: ['audio'], youtuber: ['brand', 'webser', 'vertical'], shortform: ['vertical', 'brand', 'spot'], streamer: ['launch', 'brand'], animator: ['titles', 'game'], gamedev: ['game', 'vr'], photographer: ['fashion', 'spot'], stylist: ['fashion', 'spot'], choreographer: ['mv', 'stage'], magician: ['club', 'special', 'live'], circus: ['live', 'stage'], vfx: ['titles', 'ride', 'game'], sound: ['concert', 'live'] };
const SPECIAL_ROLES = { special: { actor: 'Opening act', writer: 'Writer' }, taping: { writer: 'Writer' }, concert: { composer: 'Musical director' }, live: { composer: 'Musical director' } };
for (const k in SPECIAL_ROLES) Object.assign(GIG_TYPES[k].roles, SPECIAL_ROLES[k]);
function gigSkill(k) {
  const T = GIG_TYPES[k], me = ME(), subs = gigSubs(k).filter(s => me.sk[s] !== undefined || me.mind[s] !== undefined);
  return subs.length ? subs.reduce((s, x) => s + (me.sk[x] !== undefined ? me.sk[x] : me.mind[x]), 0) / subs.length : 8;
}
function gigSubs(k) { const T = GIG_TYPES[k], r = ME().role; return T.subs[r] || Object.keys(CRAFTS[MAIN[r]] ? CRAFTS[MAIN[r]].subs : {}).slice(0, 3); }
function gigFits(k) {
  const T = GIG_TYPES[k], me = ME(), lv = careerLevel();
  return !!T.roles[me.role] && lv >= T.lv && lv <= T.lv + 5;
}
function gigPayFor(k) {
  const T = GIG_TYPES[k], lv = careerLevel(), s = gigFee[lv] || 1, rs = 1 + clamp(reelScore() * .04, -.15, .5);
  const v = usd(T.fee[0] + prnd() * (T.fee[1] - T.fee[0])) * s * rs * (S.me.agent ? 1.1 : 1);
  const step = v >= 1e5 ? 5000 : v >= 2e4 ? 1000 : v >= 5000 ? 250 : 50;
  return Math.max(step, Math.round(v / step) * step);
}
// leverage: how much they need you (decides your odds when you push)
function gigLeverage(g) {
  const me = ME(); const cl = (S.me.clients || {})[g.client] || 0;
  return careerLevel() * .9 + me.standing / 25 + clamp(reelScore() * .5, -1, 3) + (S.me.agent ? 1.5 : 0) + cl * 1.2 - GIG_TYPES[g.k].pres * .8;
}
function newGig(k, how) {
  const T = GIG_TYPES[k], me = ME();
  return { id: S.me.seq++, k, role: me.role, credit: T.roles[me.role], client: gigClient(k), fee: gigPayFor(k), w0: S.week, how, weeks: T.w, days: T.days };
}
function gigName(g) { const T = GIG_TYPES[g.k]; return `${T.label}: ${g.client}`; }

// ---- offers ----
function gigOfferChance() {
  const M = S.me, me = ME(), lv = careerLevel(), dirLike = ['director', 'dp', 'editor'].includes(me.role) ? 1 : ['actor', 'writer', 'composer'].includes(me.role) ? .7 : .45;
  const cl = Object.values(M.clients || {}).reduce((s, n) => s + Math.min(n, 3), 0);
  return clamp((.05 + lv * .03 + clamp(reelScore(), -2, 8) * .012 + cl * .01 + (M.agent ? .03 + M.agent.tier * .01 : 0) + Math.max(0, me.standing - 20) * .0008) * dirLike, 0, .36);
}
function gigPickType() {
  const M = S.me, L = GIG_KEYS.filter(gigFits), lv = careerLevel(), field = M.field || 'film';
  if (!L.length) return null;
  // what's likely: your field, your level band, and the clients who liked you before
  const fav = DREAM_GIGS[M.dream] || [];
  const w = L.map(k => { const T = GIG_TYPES[k]; return (fav.includes(k) ? 3.5 : 1) * (T.field === field ? 2.2 : 1) * (lv - T.lv <= 2 ? 1.4 : .8) * (k === 'wedding' && lv >= 3 ? .2 : 1) * ((M.gigLast || {})[k] && S.week - M.gigLast[k] < 8 ? .4 : 1); });
  let x = prnd() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < L.length; i++) if ((x -= w[i]) <= 0) return L[i];
  return L[L.length - 1];
}
function gigOffer() {
  const M = S.me, k = gigPickType(); if (!k) return;
  const T = GIG_TYPES[k], g = newGig(k, 'offer');
  // repeat clients come back first
  const rep = Object.entries(M.clients || {}).filter(([c, n]) => n >= 1 && (M.clientK || {})[c] === k);
  if (rep.length && prnd() < .45) g.client = rep[Math.floor(prnd() * rep.length)][0];
  const back = (M.clients || {})[g.client] ? ` They liked what you did for them last time.` : '';
  const who = T.pres >= 4 ? 'A producer you\'ve never met' : M.agent ? 'Your agent' : ppick(['A production company', 'A producer who saw your work', 'An old contact', 'A line producer']);
  const choices = gigChoices(g);
  inbox('gig', `${T.label}: ${g.client}`, `${who} calls: ${gigPitchLine(g)} ${g.credit}, ${g.weeks} week${g.weeks > 1 ? 's' : ''} (about ${g.days} days a week), ${fmtCash(g.fee)}.${back}`, { gig: g, stage: 'offer', choices });
}
function gigPitchLine(g) {
  const T = GIG_TYPES[g.k];
  return ({ spot: `${g.client} need a thirty-second spot for a new campaign.`, mv: `${g.client} have a single coming out and a video budget.`, tvep: `${g.client} need someone for an episode mid-season.`, unit2: `${g.client} is behind and needs a second unit for the chase.`, brand: `${g.client} want a short film, not an ad: "something people would watch anyway".`, corp: `It's ${g.client}. Nobody will see it, and it pays on time.`, docshort: `A broadcaster wants a twenty-minute film about ${g.client}.`, stage: `A theatre has ${g.client} and an empty slot in the season.`, live: `They need a director in the truck for ${g.client}.`, concert: `${g.client} are filming two nights of the tour.`, trailer: `${g.client} needs a trailer that sells it.`, titles: `${g.client} wants an opening title sequence people will talk about.`, webser: `Six short episodes, almost no money, a lot of freedom.`, anth: `A horror anthology needs a twelve-minute segment.`, special: `It's ${g.client}, two shows, one night.`, awards: `${g.client} needs the in-memoriam package and two comic bits.`, club: `${g.client} has a slot on the showcase: eight minutes, and a booker in the room.`, residency: `${g.client} wants someone on Thursdays for a month.`, festset: `${g.client} has a gap on the second stage.`, game: `A studio is making ${g.client} and wants a film person for the cutscenes.`, psa: `${g.client} want a film that makes people actually do something.`, fashion: `${g.client} want a film for the new collection, three minutes, all mood.`, pilotpres: `${g.client} needs a ten-minute presentation to sell a series.`, reshoot: `${g.client} tested badly. They need someone to shoot the new ending, quietly.`, doctor: `${g.client} has a script with a third act that doesn't work. Two weeks, no credit, real money.`, opera: `An opera house wants ${g.client}, and someone from film to direct it.`, ride: `${g.client}: four minutes, a moving seat and a screen the size of a barn.`, museum: `${g.client} wants a room-sized film for a new gallery.`, sportsdoc: `A streamer is making a series about ${g.client}.`, truecrime: `A streamer is doing ${g.client}.`, reality: `${g.client} needs a director for a block.`, soap: `${g.client} needs a block director for three weeks of episodes.`, kids: `${g.client} wants a block of episodes.`, multicam: `${g.client} shoots in front of a live audience on Friday.`, vertical: `Sixty one-minute episodes for phones: a billionaire, a secret, a waitress.`, vr: `It's ${g.client}.`, launch: `${g.client} have a new product and a stage to unveil it on.`, campaign: `It's ${g.client}. Thirty seconds, and they want it angry.`, wedding: `It's ${g.client}.`, audio: `${g.client} wants a six-part audio drama.`, taping: `${g.client} is taping in front of a live audience.`, dub: `${g.client} needs a dub that doesn't sound like a dub.`, jingle: `${g.client} need four notes people can't forget.` })[g.k] || `${T.label} for ${g.client}.`;
}
function gigChoices(g) {
  const T = GIG_TYPES[g.k], M = S.me, busy = M.gig ? 'You\'re already on a job for hire' : jobDays() + g.days > 7 ? 'Your week is full: you\'d have to leave a job' : undefined;
  const L = [{ k: 'yes', label: `Take it: ${fmtCash(g.fee)}`, dis: busy }];
  const lev = gigLeverage(g), dc = clamp(Math.round(16 - lev), 6, 19);
  if (!g.pushed) L.push({ k: 'push', label: `Ask for ${fmtCash(Math.round(g.fee * 1.35 / 50) * 50)}`, check: ['cha', dc], dis: busy });
  if (!g.pushed && T.pres >= 2) L.push({ k: 'control', label: `Take ${fmtCash(Math.round(g.fee * .85 / 50) * 50)} for creative control (your crew, your cut)`, check: ['tas', clamp(dc - 2, 5, 18)], dis: busy });
  if (!g.pushed && T.back !== undefined) L.push({ k: 'share', label: `Half the fee and a share of what it earns`, dis: busy });
  L.push({ k: 'no', label: 'Pass' });
  return L;
}

// ---- open briefs: work you go and get ----
// Posted at the start of each month for your craft; pitching costs an evening's work and a roll.
function gigBriefsRoll() {
  const M = S.me;
  M.briefsW = S.week; M.briefs = [];
  const n = 2 + Math.floor(prnd() * 3);
  for (let i = 0; i < n; i++) { const k = gigPickType(); if (!k) break; const g = newGig(k, 'brief'); g.rivals = 3 + Math.floor(prnd() * 12) + GIG_TYPES[k].pres * 3; M.briefs.push(g); }
}
function gigBriefs() { return S.me.briefs || []; }
function gigPitchDC(g) { return clamp(Math.round(9 + GIG_TYPES[g.k].pres * 2 + g.rivals * .2 - clamp(reelScore(), -2, 6) * .6 - ((S.me.clients || {})[g.client] ? 3 : 0)), 5, 22); }
function gigPitch(id) {
  const M = S.me, i = (M.briefs || []).findIndex(b => b.id === id); if (i < 0) return false;
  const g = M.briefs[i]; if (g.pitched || M.gig) return false;
  g.pitched = true; M.energy = clamp(M.energy - 8, 0, 100);
  const stat = ['director', 'writer'].includes(ME().role) ? 'vis' : ME().role === 'actor' ? 'cha' : 'tas';
  const ok = roll(stat, gigPitchDC(g)), r = M.lastRoll;
  if (ok) { M.briefs.splice(i, 1); g.how = 'pitch'; gigStart(g, r.crit > 0 ? 6 : 0); inbox('note', `You won the pitch: ${gigName(g)}`, `${r.crit > 0 ? 'Your treatment is the one they forward round the whole company. ' : 'Your treatment beats ' + g.rivals + ' others. '}${g.credit}, ${fmtCash(g.fee)}. You start Monday.`, { result: { ok: true, roll: r, t: 'Won.' } }); }
  else inbox('note', `Lost the pitch: ${gigName(g)}`, `${r.crit < 0 ? 'Your treatment goes out with someone else\'s name on the cover page. Mortifying.' : ppick(['They went with someone who\'d done three of these.', 'They loved it, then the client\'s nephew pitched.', 'Close. They tell you you were second, which is either true or kind.', 'They went "in a different direction", which turns out to be cheaper.'])}`, { result: { ok: false, roll: r, t: 'Lost.' } });
  return true;
}

// ---- doing it ----
function gigStart(g, bonus = 0) {
  const M = S.me, T = GIG_TYPES[g.k];
  g.start = S.week; g.end = S.week + g.weeks; g.bonus = (g.bonus || 0) + bonus;
  M.gig = g; (M.gigLast = M.gigLast || {})[g.k] = S.week;
  // half up front, the rest on delivery
  const half = Math.round(g.fee * (g.share ? .5 : 1) / 2); M.cash += half; g.paid = half; M.stats.earned += half;
  milestone(`${g.credit} on ${gigName(g)}`, 'work');
}
const GIG_SNAGS = {
  client: [
    { t: 'The client wants the logo bigger', x: 'Forty minutes before the light goes, the client\'s brand manager asks for the logo bigger, the product in every shot and "more joy".', o: [['hold', 'Show them why the quiet version sells more', 'cha', 12, 7, -4], ['give', 'Give them what they want and protect one shot', null, 0, -3, 0], ['both', 'Shoot both versions, fast', 'speed', 13, 5, -6]] },
    { t: 'The talent is three hours late', x: 'Your lead turns up at eleven with a coffee and no apology. You have the location until four.', o: [['cut', 'Cut a third of the boards and shoot what matters', 'pace', 12, 5, -3], ['wait', 'Keep calm and lose the afternoon', null, 0, -5, 0], ['charm', 'Get them on side and racing', 'cha', 13, 6, -2]] },
    { t: 'Rain on the exterior day', x: 'The forecast was wrong. The whole spot is meant to be sunshine.', o: [['embrace', 'Rewrite it for rain: umbrellas, wet streets, better', 'vis', 13, 8, -2], ['cover', 'Move inside and cheat it', 'setm', 12, 3, -2], ['push', 'Wait for a break in the clouds', null, 0, -4, 3]] }],
  artist: [
    { t: 'The singer hates the treatment', x: 'On the morning of the shoot the artist\'s new manager says they "don\'t do narrative" and wants them just singing in a white room.', o: [['sell', 'Sit with the singer, alone, and sell it', 'cha', 13, 8, -4], ['white', 'Do the white room, beautifully', 'light', 12, 3, -1], ['both', 'Shoot the white room first and sneak the story in', 'speed', 14, 6, -5]] },
    { t: 'The location falls through', x: 'The diner you built the whole video around has been sold. You find out by text at six a.m.', o: [['street', 'Shoot it guerrilla on the street', 'move', 13, 7, -4], ['friend', 'Call in a favour for somewhere else', 'col', 11, 4, -2], ['studio', 'Fake it in a studio', 'sets', 12, 3, -1]] }],
  show: [
    { t: 'The star rewrites the scene', x: 'The series lead wants their big scene played a different way, and the showrunner isn\'t answering the phone.', o: [['both', 'Shoot it both ways and let the edit decide', 'speed', 12, 4, -4], ['hold', 'Hold the line for the script', 'cha', 14, 6, -2], ['give', 'Give the star the scene', 'dact', 11, 2, 0]] },
    { t: 'You\'re half a day behind', x: 'Day six of eight and you\'re half a day behind. The producer is hovering.', o: [['merge', 'Merge two scenes into one long take', 'stag', 14, 8, -3], ['drop', 'Drop the coverage and trust the edit', 'pace', 12, 3, -1], ['over', 'Go into overtime and pay for it', null, 0, 2, 5]] }],
  action: [
    { t: 'The car won\'t start', x: 'The hero car for the chase dies on the second run, and the road is only closed until noon.', o: [['tow', 'Tow it and shoot it moving anyway', 'stag', 13, 6, -3], ['cut', 'Cut around it with the second car', 'move', 12, 4, -1], ['wait', 'Wait for the mechanic', null, 0, -4, 0]] },
    { t: 'The stunt looks fake', x: 'The fall works safely, and looks it. The director wants it to hurt.', o: [['angle', 'Find the angle that sells it', 'comp', 13, 7, -2], ['again', 'Ask for one more, higher', 'stunt', 15, 8, -5], ['fine', 'Call it good enough', null, 0, -2, 0]] }],
  doc: [
    { t: 'Your subject stops talking', x: 'Halfway through, the person at the centre of the film decides they\'ve said enough.', o: [['wait', 'Give them space and come back next week', 'eth', 12, 6, -2], ['others', 'Find the story through the people around them', 'vstory', 13, 5, -3], ['press', 'Press them, gently, on camera', 'cha', 15, 8, -6]] },
    { t: 'The archive costs too much', x: 'The footage that makes the film costs more to license than your whole budget.', o: [['talk', 'Talk the archive down', 'pack', 13, 6, -2], ['recreate', 'Recreate it, honestly labelled', 'vis', 12, 4, -2], ['lose', 'Do without', null, 0, -4, 0]] }],
  stage: [
    { t: 'Your lead loses their voice', x: 'Tech week. Your lead can only whisper.', o: [['under', 'Rehearse the understudy hard', 'dact', 13, 4, -4], ['shift', 'Restage it around a quieter performance', 'stag', 14, 8, -3], ['rest', 'Rest them and pray', null, 0, -2, 0]] },
    { t: 'The set doesn\'t fit', x: 'The set was built to the old measurements. It\'s eight inches too tall for the proscenium.', o: [['cut', 'Cut it down overnight with the crew', 'sets', 12, 4, -5], ['rethink', 'Rethink the whole picture around it', 'vis', 14, 8, -3], ['live', 'Live with it', null, 0, -3, 0]] }],
  live: [
    { t: 'The feed drops', x: 'Live, a camera feed drops in the middle of the big moment.', o: [['cut', 'Cut to the wide and talk the crew through it', 'speed', 13, 6, -2], ['bold', 'Go handheld from the floor', 'move', 15, 9, -4], ['graphic', 'Throw to a graphic and recover', null, 0, -3, 0]] },
    { t: 'The host goes off script', x: 'The host starts a speech nobody has seen before. The network is in your ear.', o: [['stay', 'Stay on them: it\'s the moment', 'tone', 13, 7, -3], ['cut', 'Cut away, as told', null, 0, -1, 0], ['react', 'Find the faces in the crowd', 'pace', 12, 5, -1]] }],
  studio: [
    { t: 'Notes from above', x: 'Twelve pages of notes from a studio executive who wasn\'t in any of the meetings.', o: [['fight', 'Fight for the three notes that matter', 'cha', 13, 6, -3], ['do', 'Do all of them, cleverly', 'shape', 13, 4, -2], ['ignore', 'Ignore them and deliver early', 'tas', 15, 8, -6]] },
    { t: 'The deadline moves up', x: 'Marketing moved the date. You now have half the time.', o: [['crew', 'Bring in two more people', 'col', 11, 3, 2], ['night', 'Work nights', null, 0, 2, 7], ['focus', 'Do less, better', 'tas', 13, 6, -1]] }],
  shoestring: [
    { t: 'The money runs out early', x: 'Day three of five and the producer admits there\'s no money for days four and five.', o: [['favours', 'Call in favours and finish it', 'col', 12, 5, -4], ['rewrite', 'Rewrite the ending to shoot in a kitchen', 'orig', 13, 6, -2], ['own', 'Pay for the last day yourself', null, 0, 6, 0, 1]] },
    { t: 'Half the cast gets food poisoning', x: 'A bad lunch. Half your cast is green.', o: [['play', 'Rewrite for the ones still standing', 'impro', 13, 6, -3], ['delay', 'Push a day and eat the cost', null, 0, -1, 2], ['shoot', 'Shoot inserts and empty rooms', 'setm', 12, 3, -1]] }]
};
function gigSnag(g) {
  const L = GIG_SNAGS[GIG_TYPES[g.k].snag] || GIG_SNAGS.client, s = L[Math.floor(prnd() * L.length)];
  g.snag = s.t;
  inbox('gig', `${gigName(g)}: ${s.t.toLowerCase()}`, s.x, { gig: g, stage: 'snag', snagT: s.t, choices: s.o.map(([k, label, stat, dc]) => Object.assign({ k, label: label + (k === 'own' ? ` (${fmtCash(Math.round(g.fee * .25 / 50) * 50)})` : '') }, stat ? { check: [stat, dc] } : {})) });
}
function gigFinish(g) {
  const M = S.me, me = ME(), T = GIG_TYPES[g.k];
  const sk = gigSkill(g.k), noise = (prnd() + prnd() - 1) * 14;
  g.q = Math.round(clamp(50 + (sk - 4 - T.lv * 2) * 3.2 + (g.bonus || 0) + (g.control ? 6 : 0) + noise, 4, 98));
  const rest = Math.round(g.fee * (g.share ? .5 : 1)) - (g.paid || 0); M.cash += rest; M.stats.earned += rest; g.paid = (g.paid || 0) + rest;
  // what it did out there
  const reach = T.fame, out = [];
  g.res = {};
  if (['mv', 'brand', 'webser', 'vertical', 'fashion'].includes(g.k)) { g.res.views = Math.round(Math.pow(10, 3.6 + reach * .35 + (g.q - 50) / 22 + prnd() * .8 - .4)); out.push(`${fmtCount(g.res.views)} views in the first month`); }
  else if (['spot', 'campaign', 'psa', 'jingle'].includes(g.k)) { g.res.air = Math.round(2 + g.q / 12 + prnd() * 6); out.push(g.q >= 75 ? `it runs in prime time for ${g.res.air} weeks, and people quote it` : `it runs for ${g.res.air} weeks`); }
  else if (['tvep', 'soap', 'kids', 'multicam', 'sportsdoc', 'truecrime', 'reality'].includes(g.k)) { g.res.viewers = +(Math.max(.1, (.4 + prnd() * 3) * (.6 + g.q / 100))).toFixed(1); out.push(`${g.res.viewers}M people watch it`); }
  else if (['stage', 'opera', 'special', 'live', 'taping', 'club', 'residency', 'festset'].includes(g.k)) { g.res.house = Math.round(clamp(45 + (g.q - 50) * 1.1 + (prnd() - .5) * 20, 20, 100)); out.push(`${g.res.house}% houses`); }
  else if (['concert', 'docshort', 'anth', 'audio', 'ride', 'museum', 'game', 'vr'].includes(g.k)) { g.res.crit = Math.round(clamp(g.q + (prnd() - .5) * 18, 5, 99)); out.push(`critics: ${g.res.crit}/100`); }
  // standing and fame follow the quality; reach decides how far
  const st = (g.q - 55) / 18 * (1 + T.pres * .25);
  me.standing = clamp(me.standing + clamp(st, -1.5, 3), 0, 100);
  if (g.q >= 70 && reach) me.fame = clamp((me.fame || 0) + reach * (g.q - 60) / 40, 0, 100);
  for (const s of gigSubs(g.k)) growSub(me, s, .12 + g.weeks * .03);
  M.stats.weeks += g.weeks;
  // the client remembers
  const cl = M.clients = M.clients || {}, ck = M.clientK = M.clientK || {};
  if (g.q >= 62) { cl[g.client] = (cl[g.client] || 0) + 1; ck[g.client] = g.k; } else if (g.q < 40) delete cl[g.client];
  // a share pays later, if it worked
  if (g.share) (M.gigQ = M.gigQ || []).push({ w: S.week + 20 + Math.floor(prnd() * 30), id: g.id });
  // awards for the form: the best spots, videos and titles get shortlisted
  if (['spot', 'mv', 'titles', 'fashion', 'brand', 'psa', 'trailer'].includes(g.k) && g.q >= 82 && prnd() < .3 + (g.q - 82) * .03) {
    const prize = ({ spot: 'a Golden Reel for commercials', mv: 'a Music Video Award', titles: 'a design award for title sequences', fashion: 'a fashion film prize', brand: 'a branded content award', psa: 'a public service award', trailer: 'a Golden Trailer' })[g.k];
    g.res.prize = prize; (M.gigPrizes = M.gigPrizes || []).push({ w: S.week, t: prize, id: g.id }); me.standing = clamp(me.standing + 2, 0, 100);
    milestone(`Won ${prize} for ${gigName(g)}`, 'prize');
    out.push(`and it wins ${prize}`);
  }
  // someone notices: a person met (crew, client, artist)
  const pk = bestIn(M.hub, g.k === 'mv' || g.k === 'concert' ? ['composer'] : g.k === 'stage' || g.k === 'opera' ? ['actor', 'designer'] : ['producer', 'dp', 'editor', 'actor'], q => -Math.abs(q.standing - me.standing) + prnd() * 40);
  if (pk) { meet(pk.id, `Worked together: ${T.label.toLowerCase()}`, 6 + Math.max(0, g.q - 60) / 5); }
  const rec = { id: g.id, k: g.k, role: g.role, credit: g.credit, client: g.client, w: S.week, from: g.start, q: g.q, fee: g.fee, paid: g.paid, how: g.how, control: !!g.control, share: !!g.share, snag: g.snag || null, snagGo: g.snagGo || null, res: g.res, met: pk ? pk.id : null };
  (M.gigs = M.gigs || []).push(rec);
  M.gig = null;
  const verdict = g.q >= 85 ? 'It\'s the best thing on your reel.' : g.q >= 70 ? 'It\'s good, and people say so.' : g.q >= 50 ? 'It\'s fine. It pays, and it\'s on the reel.' : g.q >= 35 ? 'It isn\'t your best. You leave it off the reel.' : 'It\'s bad, and the client says so to people you\'d rather they didn\'t.';
  inbox('note', `Delivered: ${gigName(g)}`, `${verdict} ${out.length ? out.join(', ').replace(/^./, c => c.toUpperCase()) + '.' : ''} Quality ${g.q}/100. ${fmtCash(g.paid)} all told.${pk ? ` You got on well with ${pk.name}.` : ''}`, { gigRec: g.id });
  // the reel opens doors: strong work for hire brings feature people to you
  gigLadder(g);
}
function fmtCount(n) { return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(n); }
// from the reel to the real thing: three good ones in two years, and someone wants a meeting about a feature
function gigLadder(g) {
  const M = S.me, me = ME();
  if (g.q < 75 || (M.ladderW !== undefined && S.week - M.ladderW < 52)) return;
  const strong = gigsOf().filter(x => S.week - x.w < 104 && x.q >= 72).length;
  if (strong < 3 || prnd() > .45) return;
  M.ladderW = S.week;
  const q = bestIn(M.hub, ['producer'], q => q.standing * .5 + prnd() * 40); if (!q) return;
  meet(q.id, 'Saw your reel', 12); addTie(me, q, 6);
  me.standing = clamp(me.standing + 1.5, 0, 100);
  inbox('note', `${q.name} saw your reel`, `${q.name}, a producer, has watched your ${GIG_TYPES[g.k].label.toLowerCase()} for ${g.client} "about nine times". They want to meet about something longer. It's not a job yet, but your name is now on a list it wasn't on before.`, { person: q.id });
  milestone(`${q.name} called about a feature after seeing your reel`, 'work');
}
// shares come back: a cheque if it worked, a shrug if it didn't
function gigShares() {
  const M = S.me; if (!M.gigQ || !M.gigQ.length) return;
  for (const x of M.gigQ.filter(x => x.w <= S.week)) {
    const g = gigsOf().find(y => y.id === x.id); if (!g) continue;
    const mult = g.q >= 85 ? 1.5 + prnd() * 3 : g.q >= 70 ? .6 + prnd() * 1.2 : g.q >= 55 ? prnd() * .6 : 0;
    const amt = Math.round(g.fee * .5 * mult / 50) * 50;
    g.shareBack = amt; M.cash += amt; M.stats.earned += amt;
    inbox('note', `Your share of ${gigName(g)}`, amt > g.fee * .5 ? `It sold well past what anyone expected. Your share: ${fmtCash(amt)}, more than the half fee you gave up.` : amt > 0 ? `Your share comes in: ${fmtCash(amt)}. Less than the fee you gave up, but it came.` : 'The statement arrives: it hasn\'t made any money, and on these numbers it never will.');
  }
  M.gigQ = M.gigQ.filter(x => x.w > S.week);
}

// ---- the week ----
function gigWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done || M.over) return;
  gigShares();
  if (M.briefsW === undefined || S.week - M.briefsW >= 4) gigBriefsRoll();
  const g = M.gig;
  if (g) {
    M.energy = clamp(M.energy - 3 * g.days / 5, 0, 100);
    if (!g.snagDone && S.week >= g.start + Math.floor(g.weeks / 2) && !pending().some(it => it.kind === 'gig' && it.stage === 'snag')) { g.snagDone = true; gigSnag(g); }
    else if (S.week >= g.end && g.snagDone && !pending().some(it => it.kind === 'gig')) gigFinish(g);
    return;
  }
  if (pending().some(it => it.kind === 'gig')) return;
  if (prnd() < gigOfferChance()) gigOffer();
}
function gigPick(it, k) {
  if (it.kind !== 'gig') return false;
  const M = S.me, g = it.gig, ch = (it.choices || []).find(c => c.k === k);
  it.done = true;
  if (it.stage === 'offer') {
    if (k === 'no' || k === '_none') { it.result = { t: 'You pass. Someone else gets it, and the work goes on without you.' }; return true; }
    if (M.gig) { it.result = { t: 'You\'re already on a job for hire.' }; return true; }
    if (k === 'yes') { gigStart(g); it.result = { t: `You're on it. ${fmtCash(g.paid)} up front.` }; return true; }
    if (k === 'share') { g.share = true; gigStart(g); it.result = { t: `Half the fee and a share of the back end. ${fmtCash(g.paid)} up front.` }; return true; }
    const ok = roll(ch.check[0], ch.check[1]), r = M.lastRoll;
    if (k === 'push') {
      if (ok) { g.fee = Math.round(g.fee * (r.crit > 0 ? 1.5 : 1.35) / 50) * 50; g.pushed = true; gigStart(g); it.result = { ok, roll: r, t: r.crit > 0 ? `They say yes before you finish the sentence, and add a bit. ${fmtCash(g.fee)}.` : `A pause, a sigh, a yes: ${fmtCash(g.fee)}.` }; return true; }
      if (prnd() < .5 && r.crit >= 0) { g.pushed = true; gigStart(g); it.result = { ok, roll: r, t: `They can't go higher. You take the original ${fmtCash(g.fee)}, slightly embarrassed.` }; return true; }
      it.result = { ok, roll: r, t: 'They go with someone cheaper. It happens.' }; return true;
    }
    if (k === 'control') {
      g.fee = Math.round(g.fee * .85 / 50) * 50; g.pushed = true;
      if (ok) { g.control = true; gigStart(g, r.crit > 0 ? 3 : 0); it.result = { ok, roll: r, t: 'Your crew, your cut, their logo. You\'ll own what this is.' }; return true; }
      gigStart(g); it.result = { ok, roll: r, t: 'They take the discount and keep the control. You\'re hired, at less.' }; return true;
    }
  }
  if (it.stage === 'snag') {
    const live = M.gig && M.gig.id === g.id ? M.gig : g, T = GIG_TYPES[live.k], s = (GIG_SNAGS[T.snag] || []).find(x => x.t === it.snagT), o = s && s.o.find(x => x[0] === k);
    if (!o) { it.result = { t: 'You get through the day.' }; return true; }
    const [, label, stat, dc, gain, cost, pay] = o;
    let ok = true, r = null;
    if (stat) { ok = roll(stat, dc); r = M.lastRoll; }
    if (pay) M.cash -= Math.round(live.fee * .25 / 50) * 50;
    const d = ok ? gain + (r && r.crit > 0 ? 4 : 0) : Math.min(-2, cost - 2) + (r && r.crit < 0 ? -4 : 0);
    live.bonus = (live.bonus || 0) + d; live.snagGo = `${label}: ${ok ? 'it worked' : 'it didn\'t'}`;
    M.stress = clamp(M.stress + (ok ? 1 : 5), 0, 100);
    it.result = { ok: stat ? ok : null, roll: r, t: ok ? (d >= 6 ? 'It turns into the best thing in it.' : 'It holds. Nobody watching will ever know.') : 'It shows. Not much, but you\'ll always see it.' };
    return true;
  }
  it.result = { t: 'Done.' }; return true;
}

// ---- the page: on the Work app ----
function gigsHTML() {
  const M = S.me, me = ME(); if (!M || !careerActive()) return '';
  const fits = GIG_KEYS.filter(gigFits); if (!fits.length && !gigsOf().length) return '';
  const B = gigBriefs(), g = M.gig, rs = reelScore();
  const row = x => { const T = GIG_TYPES[x.k]; return `<tr data-gigv="${x.id}" class="clickrow"><td>${esc(T.label)}<br><small class="muted">${esc(x.client)}</small></td><td>${esc(x.credit)}</td><td class="n">${fmtDate(x.w, true)}</td><td class="n"><b class="${x.q >= 70 ? 'good' : x.q < 45 ? 'bad' : ''}">${x.q}</b></td><td class="n">${fmtCash(x.paid + (x.shareBack || 0))}</td><td>${esc(gigResLine(x))}</td></tr>`; };
  const cl = Object.entries(M.clients || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return `<section class="panel"><h3>For hire <span class="count">${gigsOf().length} credit${gigsOf().length === 1 ? '' : 's'} · reel ${rs >= 6 ? 'hot' : rs >= 2 ? 'strong' : rs > -.5 ? 'building' : 'weak'}</span></h3>
  <p class="muted">Commercials, music videos, episodes, second unit, theatre, live shows: work for other people that pays, builds your reel and gets you seen. Offers come to you (more with a level, an agent, a good reel and clients who liked you); briefs you pitch for. Your craft decides which you can do.</p>
  ${g ? `<div class="note"><b>On it now:</b> ${esc(g.credit)}, ${esc(gigName(g))}. ${g.end > S.week ? `${g.end - S.week} week${g.end - S.week > 1 ? 's' : ''} to go` : 'delivering this week'}${g.control ? ' · your cut' : ''}${g.share ? ' · on a share' : ''}.</div>` : ''}
  <h4>Open briefs this month</h4>
  ${B.length ? `<div class="tw"><table class="grid"><thead><tr><th>Brief</th><th>You'd be</th><th class="n">Weeks</th><th class="n">Fee</th><th>Pitch</th><th></th></tr></thead><tbody>${B.map(b => { const stat = ['director', 'writer'].includes(me.role) ? 'vis' : me.role === 'actor' ? 'cha' : 'tas'; return `<tr><td>${esc(GIG_TYPES[b.k].label)}<br><small class="muted">${esc(b.client)} · ${b.rivals} others pitching</small></td><td>${esc(b.credit)}</td><td class="n">${b.weeks}</td><td class="n">${fmtCash(b.fee)}</td><td><small>${esc(checkLabel(stat, gigPitchDC(b)))}</small></td><td>${b.pitched ? '<span class="muted">pitched</span>' : g ? '<span class="muted">busy</span>' : `<button class="btn-s" data-gigpitch="${b.id}">Pitch</button>`}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted">Nothing for your craft this month.</p>'}
  ${cl.length ? `<p class="small">Clients who'd hire you again: ${cl.map(([c, n]) => `${esc(c)}${n > 1 ? ' ×' + n : ''}`).join(', ')}</p>` : ''}
  ${gigsOf().length ? `<h4>Your reel</h4><div class="tw"><table class="grid"><thead><tr><th>Job</th><th>Credit</th><th class="n">When</th><th class="n">Quality</th><th class="n">Paid</th><th>How it did</th></tr></thead><tbody>${gigsOf().slice().reverse().slice(0, UI.gigAll ? 999 : 8).map(row).join('')}</tbody></table></div>${gigsOf().length > 8 ? `<button class="linkish" data-gigall="1">${UI.gigAll ? 'Show fewer' : 'Show all ' + gigsOf().length}</button>` : ''}` : ''}
  ${UI.gigView ? gigDetail(UI.gigView) : ''}</section>`;
}
function gigResLine(x) {
  const r = x.res || {};
  return [r.views ? fmtCount(r.views) + ' views' : '', r.air ? `aired ${r.air} wk` : '', r.viewers ? r.viewers + 'M viewers' : '', r.house ? r.house + '% houses' : '', r.crit ? 'critics ' + r.crit : '', r.prize ? '🏆 ' + r.prize : '', x.shareBack ? 'share ' + fmtCash(x.shareBack) : x.share ? 'share pending' : ''].filter(Boolean).join(' · ');
}
function gigDetail(id) {
  const x = gigsOf().find(g => g.id === +id); if (!x) return '';
  const T = GIG_TYPES[x.k];
  return `<div class="panel inset"><h4>${esc(T.label)}: ${esc(x.client)} <button class="linkish" data-gigv="">close</button></h4>
   <p>${esc(x.credit)}, ${fmtDate(x.from || x.w)} to ${fmtDate(x.w)}. ${x.how === 'pitch' ? 'You won it on a pitch.' : 'They came to you.'}${x.control ? ' You had creative control.' : ''}${x.share ? ' You took half the fee and a share.' : ''}</p>
   <p>${esc(gigPitchLine(x))}</p>
   ${x.snag ? `<p><b>On the day:</b> ${esc(x.snag)}. ${esc(x.snagGo || '')}.</p>` : ''}
   <div class="kpis mini"><div><span>Quality</span><b class="${x.q >= 70 ? 'good' : x.q < 45 ? 'bad' : ''}">${x.q}/100</b></div><div><span>Paid</span><b>${fmtCash(x.paid + (x.shareBack || 0))}</b><small class="muted">fee ${fmtCash(x.fee)}</small></div><div><span>Out there</span><b>${esc(gigResLine(x) || '—')}</b></div>${x.met !== null && x.met !== undefined && P(x.met) ? `<div><span>Met</span><b>${esc(P(x.met).name)}</b></div>` : ''}</div></div>`;
}
// hiring for the big jobs notices the reel
function reelFactors(post) {
  const rs = reelScore(); if (!gigsOf().length) return [];
  return Math.abs(rs) < .3 ? [] : [['Your reel', clamp(rs * .09, -.4, .7) * ((post.tier || 1) >= 2 ? 1 : .5)]];
}
// your page lists the work for hire too, under the films
function gigCreditsHTML(p) {
  if (!S.me || p.id !== S.me.id || !gigsOf().length) return '';
  return `<h3>Work for hire</h3><div class="tw"><table class="grid"><thead><tr><th>Year</th><th>Job</th><th>Credit</th><th class="n">Quality</th><th>How it did</th></tr></thead><tbody>${gigsOf().slice().reverse().map(x => `<tr><td>${yearOf(x.w)}</td><td>${esc(GIG_TYPES[x.k].label)}: ${esc(x.client)}</td><td>${esc(x.credit)}</td><td class="n">${x.q}</td><td class="small">${esc(gigResLine(x))}</td></tr>`).join('')}</tbody></table></div>`;
}
if (typeof tvCreditsHTML === 'function') { const _tvc = tvCreditsHTML; tvCreditsHTML = function (p) { return _tvc(p) + gigCreditsHTML(p); }; }
