// ---------------- Paths: different roads to the top, and the places you learn along the way ----------------
// Film is one ladder. Music, online video, podcasting and the stage each have their own, with their own rungs and
// their own big decisions, the ones that decide a career in real life:
//  - music: the label deal (a major's big advance and marketing against your masters, an indie's fair split, a
//    distributor who leaves you alone), sync licences, a publishing deal, the first tour;
//  - online: joining a network or an agency, merch, a book, the streamer who wants your show;
//  - podcasting: the network that wants to buy the show outright or license it, the live tour, the TV adaptation;
//  - theatre: the transfer to a commercial run (a royalty or a fee), publication and licensing, the film rights.
// Every deal changes the money that comes in afterwards (a cut, a boost, a stream of royalties for so many weeks).
// Alongside: labs, fellowships, residencies and accelerators you apply to (professional schooling for every
// field), and life at school itself (crits, showcases, teachers, rivals, scholarships).
// Everything rolls on the player's dice when it happens, inside the week or a logged action.

// ---- the ladders ----
const pathFol = k => Math.round(((S.me && S.me.fol) || {})[k] || 0);
const pathWorks = t => (S.me.works || []).filter(w => w.rel !== undefined && (!t || t.includes(w.type)));
const PATHS = {
  film: { label: 'Film & TV', rungs: [
    ['Hopeful', () => true, 'Get any job on a set, or make something of your own.'],
    ['On a set', () => S.me.stats.weeks >= 4 || (S.me.gigs || []).length > 0, 'Paid days on productions, or work for hire.'],
    ['First credit', () => ME().credits.length >= 1 || (S.me.gigs || []).length >= 3, 'A screen credit, or three jobs for hire.'],
    ['Working professional', () => careerLevel() >= 3, 'Level 3: a body of work people can check.'],
    ['Established', () => careerLevel() >= 5, 'Level 5: people ask for you.'],
    ['A name', () => careerLevel() >= 6, 'Awards, fame, a long list of credits or a senior chair.'],
    ['Legend', () => careerLevel() >= 7, 'The top of the business.']] },
  music: { label: 'Music', rungs: [
    ['Bedroom artist', () => true, 'Write and release a song.'],
    ['Released', () => pathWorks(['song', 'score']).length >= 1, 'Your first song out in the world.'],
    ['Local following', () => pathFol('spinly') >= 500, '500 listeners who come back.'],
    ['Working musician', () => pathFol('spinly') >= 3000 || (S.me.gigs || []).some(g => ['residency', 'festset', 'jingle'].includes(g.k)), '3,000 listeners, or paid gigs.'],
    ['Signed or self-made', () => !!S.me.deal || pathFol('spinly') >= 20000, 'A label deal, or 20,000 listeners without one.'],
    ['Touring', () => pathFol('spinly') >= 60000 || (S.me.pathSeen || {}).music_tour, 'A tour: 60,000 listeners.'],
    ['Star', () => pathFol('spinly') >= 400000 && (ME().fame || 0) >= 40, '400,000 listeners and a famous face.']] },
  creator: { label: 'Online video', rungs: [
    ['Lurker', () => true, 'Post your first video or clip.'],
    ['Posting', () => pathWorks(['video', 'blip']).length >= 1, 'Something of yours is up.'],
    ['Monetised', () => pathFol('vidwire') >= 1000 || pathFol('blip') >= 10000, '1,000 subscribers (or 10,000 on Blip): the ads pay.'],
    ['Creator', () => pathFol('vidwire') + pathFol('blip') >= 10000, '10,000 followers: brands start to call.'],
    ['Big channel', () => pathFol('vidwire') + pathFol('blip') >= 100000, '100,000 followers.'],
    ['Online star', () => pathFol('vidwire') + pathFol('blip') >= 1000000, 'A million followers.'],
    ['Crossover', () => pathFol('vidwire') + pathFol('blip') >= 1000000 && ((S.me.pathSeen || {}).creator_show || ME().credits.length >= 1), 'A million, and a show or a film.']] },
  podcast: { label: 'Podcasting', rungs: [
    ['Listener', () => true, 'Record and publish an episode.'],
    ['On air', () => pathWorks(['podcast']).length >= 1, 'Your first episode is out.'],
    ['Ad-supported', () => pathFol('podhaus') >= 500, '500 regular listeners: advertisers pay.'],
    ['A real show', () => pathFol('podhaus') >= 5000, '5,000 listeners: networks notice.'],
    ['Top of the charts', () => pathFol('podhaus') >= 50000, '50,000 listeners.'],
    ['Audio empire', () => pathFol('podhaus') >= 250000, '250,000 listeners, a tour, a TV deal.']] },
  stage: { label: 'Theatre', rungs: [
    ['Audience member', () => true, 'Put on a play, or get cast in one.'],
    ['Fringe', () => pathWorks(['play', 'musical']).length >= 1 || (S.me.gigs || []).some(g => ['stage', 'club'].includes(g.k)), 'A production of your own, or a part in someone else\'s.'],
    ['Full houses', () => pathWorks(['play', 'musical']).some(w => (w.fill || 0) >= .85), 'A run that sells out.'],
    ['Transferred', () => (S.me.pdeals || []).some(d => d.k === 'stage_transfer' && d.pick !== 'no'), 'A commercial transfer.'],
    ['Award-winning', () => (S.me.pdeals || []).some(d => d.k === 'stage_transfer' && d.pick !== 'no') && (ME().awards || []).length + (S.me.gigPrizes || []).length >= 1, 'A transfer and a prize.'],
    ['Theatre royalty', () => pathWorks(['play', 'musical']).filter(w => (w.fill || 0) >= .85).length >= 3 && careerLevel() >= 5, 'Three hits and a name.']] }
};
function pathRung(f) { const R = PATHS[f].rungs; let i = 0; while (i + 1 < R.length && R[i + 1][1]()) i++; return i; }

// ---- deals that change the money ----
// M.pdeals: [{ k, pick, w, boost: { plat: x }, cut: { plat: x } }]; M.streams: [{ t, per, from, to }]
function pathBoost(plat) { let b = 1; for (const d of S.me.pdeals || []) if (d.boost && d.boost[plat]) b *= d.boost[plat]; return b; }
function pathCut(plat) { let c = 1; for (const d of S.me.pdeals || []) if (d.cut && d.cut[plat] !== undefined) c *= d.cut[plat]; return c; }
function pathStream(t, per, weeks) { (S.me.streams = S.me.streams || []).push({ t, per: Math.round(per), from: S.week, to: S.week + Math.round(weeks) }); }
const pathAmt = v => roundCash(usd(v) * (1 + careerLevel() * .15));
// the offers: when they come (once), the text, and the options with what each does
const PATH_OFFERS = [
  { k: 'music_label', when: () => !S.me.deal && pathFol('spinly') >= 3000, title: 'Three labels want to talk',
    text: c => `Your numbers have been noticed. A major label offers an advance of ${fmtCash(c.major)} for two albums: they own the masters, pay you 18% after the advance is earned back, and put real money behind you. An independent label offers ${fmtCash(c.indie)}, a 50/50 split of the profits, and you keep your masters. A distributor would take 15% and leave you alone.`,
    mk: c => { c.major = pathAmt(60000 + pathFol('spinly') * 2); c.indie = pathAmt(12000 + pathFol('spinly') * .5); },
    opts: [
      { k: 'major', label: c => `The major: ${fmtCash(c.major)} up front`, check: ['pack', 12], go: (c, ok) => { const adv = ok ? c.major : Math.round(c.major * .75); S.me.deal = { lab: 'a major label', adv, rec: 0, w: S.week, kind: 'major', rate: .0011 }; S.me.cash += adv; pathDeal('music_label', 'major', { vidwire: 1.2 }, null); milestone('Signed to a major label', 'work'); return ok ? `Signed. ${fmtCash(adv)} lands, and a marketing plan with your face on it.` : `They knock the advance down to ${fmtCash(adv)} at the last minute. You sign anyway.`; } },
      { k: 'indie', label: c => `The independent: ${fmtCash(c.indie)}, keep your masters`, go: c => { S.me.deal = { lab: 'an independent label', adv: c.indie, rec: 0, w: S.week, kind: 'indie', rate: .0019 }; S.me.cash += c.indie; pathDeal('music_label', 'indie', null, null); milestone('Signed to an independent label', 'work'); return 'Signed, with people who answer the phone. Your masters stay yours.'; } },
      { k: 'distro', label: () => 'A distribution deal: no advance, 85% to you', go: () => { pathDeal('music_label', 'distro', { spinly: 1.08 }, { spinly: .85 * 1.2 }); return 'No money now, more of it later, and nobody telling you what to release.'; } },
      { k: 'no', label: () => 'Stay fully independent', go: () => 'You turn them all down. Every stream is yours, and so is every problem.' }] },
  { k: 'music_sync', every: 52, when: () => pathWorks(['song']).some(w => w.q >= 65) && pathFol('spinly') >= 800, title: 'Your song in a film',
    text: c => `A music supervisor wants "${c.song}" for a ${c.what}. They offer ${fmtCash(c.fee)} for the licence, or a smaller fee and a credit at the end.`,
    mk: c => { const L = pathWorks(['song']).filter(w => w.q >= 65); const w = L[Math.floor(prnd() * L.length)]; c.song = w.title; c.id = w.id; c.what = ppick(['trailer', 'car advert', 'film\'s end credits', 'TV drama\'s finale', 'video game', 'phone advert']); c.fee = pathAmt(3000 + w.q * 80); },
    opts: [
      { k: 'fee', label: c => `Take ${fmtCash(c.fee)}`, go: c => { S.me.cash += c.fee - taxOn(c.fee); return 'The cheque clears. You hear it in a cinema and grip the armrest.'; } },
      { k: 'credit', label: c => `${fmtCash(Math.round(c.fee * .5))} and the end credit`, check: ['mkt', 11], go: (c, ok) => { S.me.cash += Math.round(c.fee * .5); const w = (S.me.works || []).find(x => x.id === c.id); if (w && ok) { w.v0 = Math.round((w.v0 || 0) * 1.5 + 2000); w.done = 0; } if (ok) S.me.fol.spinly = pathFol('spinly') * 1.15; return ok ? 'People Shazam it in their thousands. The song comes back to life.' : 'Nobody stays for the credits.'; } },
      { k: 'no', label: () => 'Turn it down: it\'s not that kind of song', go: () => 'You keep it pure. They use something else.' }] },
  { k: 'music_tour', when: () => pathFol('spinly') >= 20000, title: 'A tour',
    text: c => `A promoter offers you the support slot on a ${c.big}'s tour: thirty dates, ${fmtCash(c.fee)}, a van. Or you could book your own headline tour of small rooms and keep the door.`,
    mk: c => { c.big = ppick(['stadium act', 'arena band', 'cult hero', 'singer you grew up on']); c.fee = pathAmt(6000 + pathFol('spinly') * .1); },
    opts: [
      { k: 'support', label: c => `The support slot: ${fmtCash(c.fee)}`, check: ['pres', 11], go: (c, ok) => { S.me.cash += c.fee; S.me.energy = clamp(S.me.energy - 25, 0, 100); S.me.fol.spinly = pathFol('spinly') * (ok ? 1.35 : 1.1); ME().fame = clamp((ME().fame || 0) + (ok ? 3 : 1), 0, 100); return ok ? 'Thirty nights winning over people who came for someone else. You win a lot of them.' : 'They talk through your set. Every night. You learn a lot about yourself.'; } },
      { k: 'headline', label: () => 'Headline your own small tour', check: ['mkt', 13], go: (c, ok) => { const v = ok ? pathAmt(4000 + pathFol('spinly') * .25) : -pathAmt(3000); S.me.cash += v; S.me.fol.spinly = pathFol('spinly') * (ok ? 1.2 : 1.03); return ok ? `Sold out in nine cities. You clear ${fmtCash(v)}.` : `Half-empty rooms and a van that breaks down. You lose ${fmtCash(-v)}.`; } },
      { k: 'no', label: () => 'Stay home and make the next record', go: () => 'You write instead. The road will still be there.' }] },
  { k: 'music_pub', when: () => pathWorks(['song', 'score']).length >= 6, title: 'A publishing deal',
    text: c => `A music publisher offers ${fmtCash(c.adv)} against your songwriting royalties for five years: they pitch your songs to other artists, films and adverts, and keep a share.`,
    mk: c => { c.adv = pathAmt(8000 + pathWorks(['song', 'score']).length * 1500); },
    opts: [
      { k: 'yes', label: c => `Sign for ${fmtCash(c.adv)}`, go: c => { S.me.cash += c.adv; pathDeal('music_pub', 'yes', { library: 1.5, spinly: 1.05 }, { library: .7 }); return 'They start placing your songs within a month.'; } },
      { k: 'admin', label: () => 'Just an admin deal: they collect, you keep more', check: ['fin', 11], go: (c, ok) => { pathDeal('music_pub', 'admin', null, ok ? { library: 1.15 } : null); return ok ? 'Money you didn\'t know you were owed starts arriving.' : 'The paperwork never quite gets done.'; } },
      { k: 'no', label: () => 'Keep your songs', go: () => 'Every word is still yours.' }] },
  { k: 'creator_mcn', when: () => pathFol('vidwire') + pathFol('blip') >= 10000, title: 'A network wants to sign you',
    text: () => 'A creator network offers to sign you: they handle brand deals, editing help and promotion across their channels, and take 30% of your ad money. A creator talent agency would take 10% of your brand deals and nothing else.',
    opts: [
      { k: 'network', label: () => 'Join the network (30% of ads, a big push)', go: () => { pathDeal('creator_mcn', 'network', { vidwire: 1.35, blip: 1.3 }, { vidwire: .7, blip: .7 }); return 'Your videos turn up in places they never did. Your ad cheques shrink.'; } },
      { k: 'agency', label: () => 'Sign with an agency instead', check: ['cha', 12], go: (c, ok) => { pathDeal('creator_mcn', 'agency', { vidwire: ok ? 1.1 : 1 }, null); if (ok) pathStream('Brand deals through your agency', pathAmt(300 + (pathFol('vidwire') + pathFol('blip')) * .01), 52); return ok ? 'Brands start calling the agency, and the agency calls you.' : 'They sign you and forget you exist.'; } },
      { k: 'no', label: () => 'Stay independent', go: () => 'You do it yourself. It\'s slower and it\'s yours.' }] },
  { k: 'creator_merch', when: () => pathFol('vidwire') + pathFol('blip') >= 25000, title: 'Merch',
    text: c => `A merch company will make and ship a line with your name on it if you put up ${fmtCash(c.cost)} for the first run. Hoodies, a mug, a poster of your worst thumbnail.`,
    mk: c => { c.cost = pathAmt(5000); },
    opts: [
      { k: 'yes', label: c => `Put up ${fmtCash(c.cost)}`, cost: c => c.cost, check: ['mkt', 12], go: (c, ok) => { pathStream('Merch', ok ? (pathFol('vidwire') + pathFol('blip')) * .03 + 200 : 60, ok ? 104 : 26); return ok ? 'The first run sells out in a weekend. The hoodies are everywhere.' : 'You now own four hundred mugs.'; } },
      { k: 'no', label: () => 'Not yet', go: () => 'Maybe when the channel is bigger.' }] },
  { k: 'creator_book', when: () => pathFol('vidwire') + pathFol('blip') >= 50000, title: 'A book deal',
    text: c => `A publisher wants a book from you: ${fmtCash(c.adv)} advance. Ghostwriter optional.`,
    mk: c => { c.adv = pathAmt(20000 + (pathFol('vidwire') + pathFol('blip')) * .1); },
    opts: [
      { k: 'write', label: c => `Write it yourself: ${fmtCash(c.adv)}`, check: ['struc', 12], go: (c, ok) => { S.me.cash += c.adv; S.me.energy = clamp(S.me.energy - 20, 0, 100); if (ok) { ME().standing = clamp(ME().standing + 3, 0, 100); pathStream('Book royalties', pathAmt(150), 104); } return ok ? 'It\'s good. Reviewers who\'ve never seen your channel say so.' : 'It\'s fine. Your fans buy it. Nobody else does.'; } },
      { k: 'ghost', label: c => `Use a ghostwriter: ${fmtCash(Math.round(c.adv * .6))}`, go: c => { S.me.cash += Math.round(c.adv * .6); return 'A nice person you\'ve never met writes your life. It\'s weirdly accurate.'; } },
      { k: 'no', label: () => 'Turn it down', go: () => 'You\'re not a book person. Yet.' }] },
  { k: 'creator_show', when: () => pathFol('vidwire') + pathFol('blip') >= 100000, title: 'A streamer wants your show',
    text: c => `A streamer wants to turn your channel into a series. They'll buy the format outright for ${fmtCash(c.buy)}, or you host and co-produce for ${fmtCash(c.fee)} and a share.`,
    mk: c => { c.buy = pathAmt(80000 + (pathFol('vidwire') + pathFol('blip')) * .2); c.fee = Math.round(c.buy * .45); },
    opts: [
      { k: 'sell', label: c => `Sell the format: ${fmtCash(c.buy)}`, go: c => { S.me.cash += c.buy - taxOn(c.buy); return 'Someone else hosts your show. It\'s strange watching it.'; } },
      { k: 'host', label: c => `Host and co-produce: ${fmtCash(c.fee)} and a share`, check: ['pres', 13], go: (c, ok) => { S.me.cash += c.fee; ME().fame = clamp((ME().fame || 0) + (ok ? 8 : 3), 0, 100); if (ok) pathStream('Your streaming series (share)', c.buy * .01, 78); return ok ? 'It\'s a hit. People who\'ve never heard of your channel stop you in the street.' : 'It does fine, quietly, and isn\'t renewed.'; } },
      { k: 'no', label: () => 'Keep it online', go: () => 'You keep it yours.' }] },
  { k: 'pod_network', when: () => pathFol('podhaus') >= 5000, title: 'A podcast network wants your show',
    text: c => `A podcast network wants your show. They'll buy it outright: ${fmtCash(c.buy)} now and a salary of ${fmtCash(c.sal)} a week for two years to keep hosting it, but they own it. Or an exclusive licence: ${fmtCash(c.lic)} a year, you keep ownership, they sell the ads.`,
    mk: c => { c.buy = pathAmt(30000 + pathFol('podhaus') * 6); c.sal = Math.round(pathAmt(400 + pathFol('podhaus') * .05) / 10) * 10; c.lic = pathAmt(15000 + pathFol('podhaus') * 2); },
    opts: [
      { k: 'sell', label: c => `Sell it: ${fmtCash(c.buy)} and a salary`, go: c => { S.me.cash += c.buy - taxOn(c.buy); pathStream('Hosting salary (the network owns the show)', c.sal, 104); pathDeal('pod_network', 'sell', { podhaus: 1.3 }, { podhaus: 0 }); milestone('Sold your podcast to a network', 'work'); return 'You sign it away. The cheque is enormous. The show isn\'t yours any more.'; } },
      { k: 'license', label: c => `License it: ${fmtCash(c.lic)} a year`, check: ['pack', 12], go: (c, ok) => { pathStream('Podcast licence', (ok ? c.lic * 1.2 : c.lic) / 52, 104); pathDeal('pod_network', 'license', { podhaus: 1.25 }, { podhaus: .5 }); return ok ? 'You get them up by a fifth. They sell the ads; you keep the show.' : 'They hold firm on the number. You keep the show.'; } },
      { k: 'no', label: () => 'Stay independent', go: () => 'You keep selling your own ads, one awkward read at a time.' }] },
  { k: 'pod_live', when: () => pathFol('podhaus') >= 20000, title: 'A live tour',
    text: c => `A promoter wants to take your podcast on the road: twelve theatres, recorded live. You'd split the door.`,
    opts: [
      { k: 'yes', label: () => 'Do the tour', check: ['cha', 12], go: (c, ok) => { const v = ok ? pathAmt(8000 + pathFol('podhaus') * .3) : pathAmt(1500); S.me.cash += v; S.me.energy = clamp(S.me.energy - 20, 0, 100); S.me.fol.podhaus = pathFol('podhaus') * (ok ? 1.15 : 1.02); return ok ? `Twelve sold-out theatres. ${fmtCash(v)}, and episodes recorded in front of people who know every in-joke.` : `Half-full rooms, ${fmtCash(v)} after costs, and one great night in a city you didn't expect.`; } },
      { k: 'no', label: () => 'Not yet', go: () => 'You keep it in your ears.' }] },
  { k: 'pod_tv', when: () => pathFol('podhaus') >= 50000, title: 'Television wants your podcast',
    text: c => `A production company wants to option your podcast for television: ${fmtCash(c.opt)} for eighteen months. If it's made, much more.`,
    mk: c => { c.opt = pathAmt(15000); },
    opts: [
      { k: 'yes', label: c => `Take the option: ${fmtCash(c.opt)}`, go: c => { S.me.cash += c.opt; (S.me.pathLater = S.me.pathLater || []).push({ w: S.week + 52 + Math.floor(prnd() * 26), k: 'pod_tv_made', amt: c.opt * 8 }); return 'Signed. You try not to think about who\'d play you.'; } },
      { k: 'no', label: () => 'Keep it audio', go: () => 'It\'s an audio thing. You know it is.' }] },
  { k: 'stage_transfer', when: () => pathWorks(['play', 'musical']).some(w => (w.fill || 0) >= .85), title: 'A transfer',
    text: c => `A commercial producer saw ${c.title} and wants to transfer it to a proper theatre for twelve weeks. They offer a royalty (about ${fmtCash(c.roy)} a week if it sells) or a flat ${fmtCash(c.flat)}.`,
    mk: c => { const w = pathWorks(['play', 'musical']).filter(w => (w.fill || 0) >= .85).pop(); c.title = w.title; c.mus = w.type === 'musical'; c.roy = pathAmt(c.mus ? 3000 : 1200); c.flat = c.roy * 9; },
    opts: [
      { k: 'roy', label: () => 'Take the royalty', check: ['tas', 12], go: (c, ok) => { pathStream(`${c.title}: royalties from the transfer`, ok ? c.roy * 1.3 : c.roy * .5, 12); ME().standing = clamp(ME().standing + (ok ? 4 : 1), 0, 100); pathDeal('stage_transfer', 'roy', null, null); milestone(`${c.title} transferred to a commercial run`, 'work'); return ok ? 'It sells. Week after week, the royalty statements make you laugh out loud.' : 'It opens to good reviews and thin houses. The royalty is small.'; } },
      { k: 'flat', label: c => `Take ${fmtCash(c.flat)} flat`, go: c => { S.me.cash += c.flat - taxOn(c.flat); pathDeal('stage_transfer', 'flat', null, null); milestone(`${c.title} transferred to a commercial run`, 'work'); return 'Money in the bank, whatever happens.'; } },
      { k: 'no', label: () => 'Keep it small', go: () => { pathDeal('stage_transfer', 'no', null, null); return 'You keep it in the room it was made for.'; } }] },
  { k: 'stage_publish', when: () => pathWorks(['play', 'musical']).length >= 2, title: 'Publication and licensing',
    text: () => 'A theatrical publisher wants to publish your plays and license them to schools, colleges and amateur companies. Small money, for a very long time.',
    opts: [
      { k: 'yes', label: () => 'Sign', go: () => { pathStream('Licensing: schools and amateur companies', pathAmt(60 + pathWorks(['play', 'musical']).length * 15), 260); return 'Somewhere a sixth-form drama class is doing your play badly, and paying you for it.'; } },
      { k: 'no', label: () => 'Not yet', go: () => 'Maybe when there are more of them.' }] }
];
const PATH_OFFER_BY = {}; for (const o of PATH_OFFERS) PATH_OFFER_BY[o.k] = o;
function pathDeal(k, pick, boost, cut) { (S.me.pdeals = S.me.pdeals || []).push({ k, pick, w: S.week, boost: boost || null, cut: cut || null }); }
function pathOfferPick(it, k) {
  if (it.kind !== 'path') return false;
  const M = S.me, O = PATH_OFFER_BY[it.offer], o = O && O.opts.find(x => x.k === k), c = it.ctx || {}; it.done = true;
  if (!o) { it.result = { t: 'You let it pass.' }; return true; }
  const cost = o.cost ? o.cost(c) : 0; if (cost && M.cash < cost) { it.result = { t: 'The money isn\'t there any more.' }; return true; }
  if (cost) M.cash -= cost;
  const ok = o.check ? roll(o.check[0], o.check[1]) : true;
  it.result = { ok: o.check ? ok : null, roll: o.check ? M.lastRoll : null, t: o.go(c, ok) };
  (M.pathLog = M.pathLog || []).push({ w: S.week, k: it.offer, pick: k, ok });
  return true;
}
// ---- labs, fellowships, residencies: the schooling of working life ----
// [k, name, field, roles, window (week of the year it opens), weeks, stat, dc, what it gives]
const LABS = [
  ['scrlab', 'The Screenwriters Lab', 'film', ['writer', 'director'], 2, 6, 'orig', 15, 'Five days in the mountains with your script and two mentors who have won things. Half the alumni get made.'],
  ['dirlab', 'The Directors Lab', 'film', ['director'], 10, 6, 'vstory', 16, 'Shoot scenes from your feature with professional actors and crew, and get notes from directors you worship.'],
  ['tvfellow', 'The Episodic Writing Fellowship', 'film', ['writer'], 18, 20, 'dial', 15, 'A paid year writing specs with a network; the best fellows are staffed on shows.'],
  ['prodlab', 'The Producers Lab', 'film', ['producer'], 26, 8, 'pack', 14, 'Financing, packaging and sales, taught by people who closed the deals. You leave with a slate and a phone full of numbers.'],
  ['doclab', 'The Documentary Fund', 'film', ['director', 'editor', 'producer'], 34, 10, 'vstory', 14, 'Development money and editing mentorship for a documentary in progress.'],
  ['talents', 'Talent Campus at the festival', 'film', null, 6, 2, 'tas', 13, 'Two hundred young filmmakers from everywhere, a week of masterclasses and parties, and a festival pass.'],
  ['camlab', 'The Cinematographers Masterclass', 'film', ['dp', 'director'], 22, 4, 'light', 13, 'Light a scene a day for a week under one of the great DPs.'],
  ['editlab', 'The Editing Residency', 'film', ['editor'], 30, 8, 'shape', 13, 'Cut a feature that\'s gone wrong, alongside the editor who will fix it.'],
  ['actorlab', 'The Actors\' Studio sessions', 'film', ['actor'], 14, 12, 'range', 14, 'Weekly sessions with the best in the business watching. Casting directors sit in.'],
  ['anim', 'The Animation Lab', 'film', ['designer', 'vfx'], 40, 10, 'world', 13, 'Develop an animated short with a studio\'s story team.'],
  ['songcamp', 'A songwriting camp', 'music', ['composer', 'sound', 'actor'], 8, 2, 'song', 12, 'A week in a country house writing with strangers, three songs a day. Half the hits on the radio start like this.'],
  ['scorelab', 'The Film Scoring Lab', 'music', ['composer'], 24, 6, 'score', 15, 'Score a scene, then hear it played by a real orchestra on a real stage.'],
  ['showcase', 'The new music showcase', 'music', ['composer', 'sound', 'actor'], 36, 1, 'pres', 13, 'Three nights, a hundred bands, and every label\'s scouts at the bar.'],
  ['accel', 'The Creator Accelerator', 'creator', ['editor', 'actor', 'writer', 'director'], 12, 8, 'rhythm', 13, 'A platform\'s own programme: production money, a studio and promotion on the front page.'],
  ['podfellow', 'The Audio Fellowship', 'podcast', ['writer', 'actor', 'sound'], 20, 10, 'voice', 13, 'A public broadcaster trains you to report, script and mix a show, and airs the pilot.'],
  ['newwrite', 'New Writing Residency', 'stage', ['writer', 'director', 'actor'], 4, 12, 'char', 14, 'A theatre gives you a desk, a stipend and a reading with actors at the end.'],
  ['fringe', 'The festival fringe bursary', 'stage', null, 28, 4, 'cha', 12, 'Money to take a show to the biggest fringe festival in the world for a month.'],
  ['bizschool', 'The executive programme', 'film', ['producer'], 44, 6, 'fin', 14, 'An intensive in media finance and strategy at a business school; the studio people take it before a promotion.']
];
const LAB_BY = {}; for (const L of LABS) LAB_BY[L[0]] = L;
function labOpen(L) { const wy = S.week % 52; return wy >= L[4] && wy < L[4] + 4; }
function labFits(L) { const me = ME(); return !L[3] || L[3].includes(me.role); }
function labDC(L) { return clamp(L[7] - Math.floor(careerLevel() / 2) - ((S.me.gigs || []).filter(g => g.q >= 70).length >= 2 ? 1 : 0), 6, 20); }
function labApply(k) {
  const M = S.me, L = LAB_BY[k]; if (!L || !labOpen(L) || !labFits(L) || M.lab) return false;
  const tried = M.labTried = M.labTried || {}; if (tried[k] !== undefined && S.week - tried[k] < 40) return false;
  tried[k] = S.week; M.energy = clamp(M.energy - 6, 0, 100);
  const ok = roll(L[6], labDC(L)), r = M.lastRoll;
  if (ok) { M.lab = { k, from: S.week + 2, to: S.week + 2 + L[5] }; milestone(`Selected for ${L[1]}`, 'prize'); inbox('note', `You're in: ${L[1]}`, `${L[8]} It starts in two weeks and takes some of your time each week.`, { result: { ok, roll: r, t: 'Selected.' } }); }
  else inbox('note', `Not this year: ${L[1]}`, ppick(['Thousands applied for a few dozen places.', 'The letter is kind and short. Try again next year.', 'You made the longlist. Not the shortlist.']), { result: { ok, roll: r, t: 'Not selected.' } });
  return true;
}
function labWeek() {
  const M = S.me, me = ME(), x = M.lab; if (!x || S.week < x.from) return;
  const L = LAB_BY[x.k]; if (!L) { M.lab = null; return; }
  M.energy = clamp(M.energy - 3, 0, 100);
  if (me.sk[L[6]] !== undefined) growSub(me, L[6], .08); else if (me.mind[L[6]] !== undefined) growSub(me, L[6], .1);
  for (const s of Object.keys(CRAFTS[MAIN[me.role]] ? CRAFTS[MAIN[me.role]].subs : {}).slice(0, 2)) growSub(me, s, .03);
  if (S.week < x.to) return;
  // graduation: what the lab leads to
  M.lab = null; (M.labs = M.labs || []).push({ k: x.k, w: S.week });
  me.standing = clamp(me.standing + 3, 0, 100);
  const q = bestIn(M.hub, L[2] === 'music' ? ['composer'] : L[2] === 'stage' ? ['director', 'writer', 'actor'] : ['director', 'producer', 'writer'], q => q.standing * .6 + prnd() * 30);
  if (q) { meet(q.id, `Your mentor at ${L[1]}`, 14); trust(q.id, 8); }
  const out = [];
  if (x.k === 'tvfellow' || x.k === 'scrlab') out.push('Two agents have asked for your script.');
  if (['accel'].includes(x.k)) { for (const k of ['vidwire', 'blip']) M.fol[k] = (M.fol[k] || 0) * 1.3 + 2000; out.push('The platform puts you on its front page for a week.'); }
  if (x.k === 'podfellow') { M.fol.podhaus = (M.fol.podhaus || 0) * 1.25 + 800; out.push('The broadcaster airs your pilot.'); }
  if (x.k === 'showcase' || x.k === 'songcamp') { M.fol.spinly = (M.fol.spinly || 0) * 1.2 + 500; out.push('A song from the week starts doing numbers.'); }
  if (x.k === 'doclab' || x.k === 'fringe' || x.k === 'newwrite') { const g = pathAmt(4000); M.cash += g; out.push(`A grant of ${fmtCash(g)} comes with it.`); }
  if (x.k === 'bizschool' || x.k === 'prodlab') { growSub(me, 'fin', .3); growSub(me, 'pack', .2); }
  inbox('note', `${L[1]}: finished`, `It's over, and you're different. ${q ? `${q.name} says to call any time, and means it. ` : ''}${out.join(' ')}`);
}
// ---- life at school ----
const CAMPUS = [
  { k: 'crit', title: 'The crit', text: 'Your work is up on the wall for the class crit. The tutor who hates everything is in a mood.', opts: [['defend', 'Defend every choice', 'cha', 12, 'They concede two points. The class remembers you held your ground.', 'You get defensive. It doesn\'t help.'], ['listen', 'Shut up and take notes', 'tas', 10, 'Three notes you\'ll use for the rest of your life.', 'You write it all down and agree with none of it.']] },
  { k: 'showcase', title: 'The industry showcase', text: 'The school\'s showcase: agents, producers and a casting director in the third row.', opts: [['work', 'Work the room after', 'cha', 13, 'An agent takes your card and actually calls.', 'You talk to a lot of people\'s backs.'], ['show', 'Let the work speak', 'tas', 12, 'The work speaks. Someone asks who made it.', 'The work mumbles.']], good: 'agent' },
  { k: 'ta', title: 'A teaching assistant job', text: 'Your tutor offers you a TA job: marking, running a seminar, a small stipend and their ear.', opts: [['yes', 'Take it', 'com', 11, 'You\'re good at it, and the tutor becomes an ally.', 'You\'re a bit lost, but they keep you on.'], ['no', 'You need the time', null, 0, 'You keep your evenings.', '']], good: 'mentor' },
  { k: 'rival', title: 'A classmate\'s idea', text: 'A classmate pitches an idea that sounds a lot like yours, in front of everyone.', opts: [['call', 'Call it out', 'cha', 13, 'The tutor backs you. The classmate is quiet for weeks.', 'It looks like sour grapes.'], ['better', 'Make yours better', 'orig', 12, 'Yours ends up the stronger piece by a mile.', 'Theirs is better. That stings.']] },
  { k: 'scholar', title: 'A scholarship', text: 'There\'s a merit scholarship for next term. It needs an essay and a portfolio by Friday.', opts: [['apply', 'Apply', 'struc', 13, 'You get it: next term is paid for.', 'Not this time.'], ['no', 'Too busy', null, 0, 'Maybe next year.', '']], good: 'money' },
  { k: 'collab', title: 'A thesis crew', text: 'The most talked-about student in the year wants you on their thesis film.', opts: [['yes', 'Say yes', 'col', 11, 'It\'s a great shoot, and they owe you one.', 'It\'s a miserable shoot. You learn what not to do.'], ['no', 'Focus on your own work', null, 0, 'Your own work gets the time.', '']], good: 'friend' },
  { k: 'exchange', title: 'A term abroad', text: 'There\'s an exchange place at a school in another country for a term.', opts: [['go', 'Go', 'lang', 11, 'You come back with a different eye and friends in another industry.', 'You spend it homesick, mostly.'], ['no', 'Stay', null, 0, 'You stay put.', '']] },
  { k: 'allnighter', title: 'The all-nighter', text: 'The deadline is tomorrow at nine and you\'re about half done.', opts: [['push', 'Pull the all-nighter', 'speed', 12, 'You finish at 8:40 and it\'s good.', 'You finish at 8:58 and it shows.'], ['ext', 'Ask for an extension', 'cha', 11, 'Granted, with a look.', 'Refused. You hand in half.']] }
];
const CAMPUS_BY = {}; for (const c of CAMPUS) CAMPUS_BY[c.k] = c;
function campusWeek() {
  const M = S.me; if (!M.school || pending().some(it => it.kind === 'campus') || prnd() > .07) return;
  const seen = M.campusSeen = M.campusSeen || {}, L = CAMPUS.filter(c => seen[c.k] === undefined || S.week - seen[c.k] > 40); if (!L.length) return;
  const c = L[Math.floor(prnd() * L.length)]; seen[c.k] = S.week;
  inbox('campus', c.title, c.text, { campus: c.k, choices: c.opts.map(o => Object.assign({ k: o[0], label: o[1] }, o[2] ? { check: [o[2], o[3]] } : {})) });
}
function campusPick(it, k) {
  if (it.kind !== 'campus') return false;
  const M = S.me, me = ME(), c = CAMPUS_BY[it.campus], o = c && c.opts.find(x => x[0] === k); it.done = true;
  if (!o) { it.result = { t: 'Term goes on.' }; return true; }
  const ok = o[2] ? roll(o[2], o[3]) : true;
  if (o[2] && me.sk[o[2]] !== undefined) growSub(me, o[2], ok ? .15 : .06);
  if (ok && o[2] && c.good) {
    if (c.good === 'agent') me.standing = clamp(me.standing + 2, 0, 100);
    if (c.good === 'mentor') { M.cash += pathAmt(150) * 10; const q = bestIn(M.hub, [me.role], q => q.standing * .5 + (S.year - q.born > 40 ? 20 : 0) + prnd() * 20); if (q) { meet(q.id, 'Your tutor', 12); trust(q.id, 6); } }
    if (c.good === 'money') { M.cash += pathAmt(2500); }
    if (c.good === 'friend') { const q = bestIn(M.hub, ['director', 'writer'], q => -Math.abs(S.year - q.born - 25) + prnd() * 30); if (q) meet(q.id, 'Thesis crew', 10); }
  }
  M.stress = clamp(M.stress + (ok ? -1 : 3), 0, 100);
  it.result = { ok: o[2] ? ok : null, roll: o[2] ? M.lastRoll : null, t: ok ? o[4] : (o[5] || o[4]) };
  return true;
}

// ---- the week ----
function pathWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done || M.over) return;
  // income streams
  let inc = 0;
  for (const s of M.streams || []) if (S.week > s.from && S.week <= s.to) inc += s.per;
  if (inc) { M.cash += inc - taxOn(inc); M.stats.earned += inc; }
  M.streams = (M.streams || []).filter(s => S.week <= s.to + 26);
  // things that come back
  for (const x of (M.pathLater || []).filter(x => x.w <= S.week)) {
    if (x.k === 'pod_tv_made') { if (prnd() < .3) { M.cash += x.amt; ME().fame = clamp((ME().fame || 0) + 6, 0, 100); milestone('Your podcast became a TV series', 'prize'); inbox('note', 'Your podcast is going to be a TV show', `They made it. ${fmtCash(x.amt)} on the first day of photography, and an executive producer credit.`); } else inbox('note', 'The TV option lapses', 'Eighteen months, two scripts, no series. The rights come back to you.'); }
  }
  M.pathLater = (M.pathLater || []).filter(x => x.w > S.week);
  labWeek(); campusWeek();
  // a breakthrough offer, when you've earned one (one at a time)
  if (pending().some(it => it.kind === 'path')) return;
  const seen = M.pathSeen = M.pathSeen || {};
  const L = PATH_OFFERS.filter(o => (seen[o.k] === undefined || (o.every && S.week - seen[o.k] >= o.every)) && o.when());
  if (!L.length || prnd() > .35) return;
  const O = L[Math.floor(prnd() * L.length)], c = {};
  if (O.mk) O.mk(c);
  seen[O.k] = S.week;
  inbox('path', O.title, O.text(c), { offer: O.k, ctx: c, choices: O.opts.map(o => { const cost = o.cost ? o.cost(c) : 0; return Object.assign({ k: o.k, label: o.label(c), cost }, o.check ? { check: o.check } : {}, cost && M.cash < cost ? { dis: 'Not enough in the bank' } : {}); }) });
}

// ---- the page ----
function pathsApp() {
  const M = S.me; if (!M || !careerActive()) return '<p class="muted">Start a career to see your paths.</p>';
  const me = ME(), d = typeof dreamOf === 'function' ? dreamOf() : null;
  const ladder = f => { const R = PATHS[f].rungs, i = pathRung(f), nx = R[i + 1]; return `<div class="ladder${(M.field || 'film') === f ? ' mine' : ''}"><h4>${esc(PATHS[f].label)}${(M.field || 'film') === f ? ' <span class="chip good">your field</span>' : ''}${d && d.field === f ? ' <span class="chip">your dream</span>' : ''}</h4><ol class="rungs">${R.map((r, j) => `<li class="${j < i ? 'done' : j === i ? 'on' : ''}" title="${esc(r[2])}">${esc(r[0])}</li>`).join('')}</ol><p class="small muted">${nx ? `Next: <b>${esc(nx[0])}</b>. ${esc(nx[2])}` : 'You\'re at the top of this ladder.'}</p></div>`; };
  const deals = (M.pdeals || []).map(x => `<li>${esc(({ music_label: 'Record deal', music_pub: 'Publishing', creator_mcn: 'Creator network', pod_network: 'Podcast network', stage_transfer: 'Transfer' })[x.k] || x.k)}: <b>${esc(x.pick)}</b> <span class="muted">since ${fmtDate(x.w, true)}</span></li>`);
  const streams = (M.streams || []).filter(s => S.week <= s.to);
  const labs = LABS.filter(labFits), tried = M.labTried || {};
  const labRow = L => { const open = labOpen(L), wait = tried[L[0]] !== undefined && S.week - tried[L[0]] < 40, wy = S.week % 52, inW = (L[4] - wy + 52) % 52; return `<tr><td><b>${esc(L[1])}</b><br><span class="muted small">${esc(L[8])}</span></td><td class="small">${esc(FIELDS[L[2]] || L[2])}</td><td class="n small">${L[5]} wk</td><td class="small">${esc(checkLabel(L[6], labDC(L)))}</td><td>${M.lab && M.lab.k === L[0] ? '<span class="chip good">you\'re in</span>' : wait ? '<span class="muted small">applied this year</span>' : open && !M.lab ? `<button class="btn-s" data-labapply="${L[0]}">Apply</button>` : `<span class="muted small">opens in ${inW} wk</span>`}</td></tr>`; };
  return `<div class="paths"><section class="panel"><h3>Your paths</h3><p class="muted">Every part of the business has its own ladder, and its own big decisions on the way up. ${d ? `Your dream: <b>${esc(d.label)}</b>.` : ''} Where your work takes you decides your field.</p>
   <div class="ladders">${Object.keys(PATHS).map(ladder).join('')}</div></section>
   ${deals.length || streams.length ? `<section class="panel"><h3>Your deals and income</h3>${deals.length ? `<ul class="plain small">${deals.join('')}</ul>` : ''}${streams.length ? `<table class="grid small"><thead><tr><th>Income</th><th class="n">A week</th><th class="n">Until</th></tr></thead><tbody>${streams.map(s => `<tr><td>${esc(s.t)}</td><td class="n">${fmtCash(s.per)}</td><td class="n">${fmtDate(s.to, true)}</td></tr>`).join('')}</tbody></table>` : ''}${M.deal ? `<p class="small">Record deal with ${esc(M.deal.lab)}: advance ${fmtCash(M.deal.adv)}, ${fmtCash(M.deal.rec)} earned back so far${M.deal.rec >= M.deal.adv ? ' (recouped: royalties now reach you)' : ''}.</p>` : ''}</section>` : ''}
   <section class="panel"><h3>Labs, fellowships and residencies</h3><p class="muted small">The schooling of working life. Each opens once a year for four weeks; you can be on one at a time. Selection is a roll on the skill it cares about; a level, and good work for hire, help.</p>
   ${M.lab ? `<p class="note">On ${esc(LAB_BY[M.lab.k][1])} until ${fmtDate(M.lab.to, true)}.</p>` : ''}
   <div class="tw"><table class="grid small"><thead><tr><th>Programme</th><th>Field</th><th class="n">Length</th><th>Selection</th><th></th></tr></thead><tbody>${labs.map(labRow).join('')}</tbody></table></div>
   ${(M.labs || []).length ? `<p class="small">Alumni of: ${(M.labs || []).map(x => esc(LAB_BY[x.k][1])).join(', ')}.</p>` : ''}</section></div>`;
}
OS_EXTRA.paths = ['🧭', 'Paths', 'Your ladders in every field, the big deals on the way up, and labs and fellowships to apply to'];
OS_VIEWS.paths = () => pathsApp();
{ const g = OS_GROUPS.find(x => x[0] === 'You'); if (g && !g[1].includes('paths')) g[1].unshift('paths'); }
