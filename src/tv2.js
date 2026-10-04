// ---------------- Television, part two: a front door, credits, the work itself, running a show ----------------
// tv.js builds the world's television. This file puts it where people look: a TV tab beside the box office,
// television credits on everyone's page, shows in the search box, your own shows in the ratings, the industry
// news of a television year (upfronts in May, premieres in September, the Emmets), scenes from the writers'
// room and the stage floor, and the decisions that come with running your own show.

// ---- the TV tab ----
function viewTv() {
  const M = S.me, mkt = M ? (HUBS[M.hub] || {}).m || 'US' : 'US', on = tvAllPlus().filter(s => s.m === mkt && tvOnAir(s, S.year));
  return `<div class="head"><p class="eyebrow">Television · ${esc(MARKETS[mkt] ? MARKETS[mkt].name : mkt)} · ${S.year}</p><h2>Television</h2><p class="lede">${on.length} shows on air here this year across ${Object.values(TV_NETS).filter(n => n.founded <= S.year && (HUBS[n.hub] || {}).m === mkt).length} channels. Ratings, channels, every show ever made, the Emmets, and your own television career.</p></div>
   <section class="panel">${tvApp()}</section>`;
}
// the world's shows and yours together
function tvAllPlus() { return tvAll().concat((S.me && S.me.shows) || []); }

// ---- a person's television ----
function tvCreditsHTML(p) {
  const rows = tvCreditsOf(p.id).map(([id, role]) => [tvShow(id), role]).filter(x => x[0]);
  if (p.player && S.me) { for (const s of S.me.shows || []) rows.push([s, 'creator and showrunner']); for (const [id, r] of Object.entries(S.me.tvCred || {})) { const s = tvShow(id); if (s && !rows.some(x => x[0] === s)) rows.push([s, r]); } }
  if (!rows.length) return '';
  const seen = new Set(), L = rows.filter(([s, r]) => { const k = s.id + r; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => b[0].y - a[0].y);
  const yrs = s => `${s.y}${s.seasons > 1 || tvStatus(s) === 'on air' ? '–' + (tvStatus(s) === 'on air' ? '' : Math.min(S.year, s.y + s.seasons - 1)) : ''}`;
  return `<h3>Television</h3><div class="tw"><table class="grid"><thead><tr><th>Years</th><th>Show</th><th>Channel</th><th>Role</th><th class="n">Seasons</th></tr></thead><tbody>${L.slice(0, 30).map(([s, r]) => `<tr><td>${yrs(s)}</td><td>${tvLink(s)}${s.legend ? ' <span class="aw">✦</span>' : ''}</td><td>${netLink(s.net)}</td><td>${esc(r.charAt(0).toUpperCase() + r.slice(1))}</td><td class="n">${s.seasons}</td></tr>`).join('')}</tbody></table></div>${L.length > 30 ? `<p class="muted small">And ${L.length - 30} more.</p>` : ''}`;
}

// ---- search ----
function tvSearchHTML(q) {
  if (!q || q.length < 2) return '';
  const shows = tvAllPlus().filter(s => s.title.toLowerCase().includes(q)).sort((a, b) => (b.legend ? 1 : 0) - (a.legend ? 1 : 0) || b.seasons - a.seasons).slice(0, 8);
  const nets = Object.values(TV_NETS).filter(n => n.name.toLowerCase().includes(q)).slice(0, 5);
  if (!shows.length && !nets.length) return '';
  return `<div><h4>Television</h4><ul class="plain">${shows.map(s => `<li>${tvLink(s)} <span class="muted small">${esc(TV_NETS[s.net].name)} · ${s.y}</span></li>`).join('')}${nets.map(n => `<li>${netLink(n.k)} <span class="muted small">${esc(n.kind)} channel</span></li>`).join('')}</ul></div>`;
}

// ---- the television year in the trade press ----
function tvNewsWeek() {
  const M = S.me; if (!M) return;
  const d = dateOf(S.week), month = d.getUTCMonth(), first = d.getUTCDate() <= 7, mkt = (HUBS[M.hub] || {}).m || 'US';
  if (!first || (month !== 4 && month !== 8)) return;
  const L = tvAll().filter(s => s.m === mkt), sr = s => { const p = tvPeople(s); return p.showrunner !== null && p.showrunner !== undefined ? { person: p.showrunner } : undefined; };
  if (month === 4) {   // the upfronts: renewals and cancellations
    const ended = L.filter(s => s.y + s.seasons - 1 === S.year - 1 && s.seasons <= 3 && s.last < 9999).sort((a, b) => b.pop - a.pop).slice(0, 2);
    const renewed = L.filter(s => tvOnAir(s, S.year) && s.y < S.year).sort((a, b) => tvViewers(b, S.year - b.y + 1) - tvViewers(a, S.year - a.y + 1)).slice(0, 2);
    for (const s of renewed) news('Industry', `Upfronts: ${TV_NETS[s.net].name} renews ${s.title} for a season ${S.year - s.y + 1}.`, sr(s));
    for (const s of ended) news('Industry', `Upfronts: ${TV_NETS[s.net].name} cancels ${s.title} after ${s.seasons} season${s.seasons > 1 ? 's' : ''}.`, sr(s));
  } else {   // September: premieres, and the Emmets
    const prem = L.filter(s => s.y === S.year).sort((a, b) => b.q - a.q).slice(0, 3);
    for (const s of prem) news('Industry', `Premiere week: ${s.title}, a new ${TV_GENRES[s.g].label.toLowerCase()} on ${TV_NETS[s.net].name}, ${s.q >= 70 ? 'opens to raves' : s.q >= 50 ? 'opens to decent notices' : 'opens to a shrug'}.`, sr(s));
    const E = tvEmmets(S.year - 0).filter(e => /Series$/.test(e.cat));
    for (const e of E.slice(0, 2)) { const s = tvShow(e.show); if (s) news('Award', `The Emmets: ${s.title} wins ${e.cat}.`, sr(s)); }
  }
}

// ---- scenes from television work: the room, the stage, the network ----
const TV_SCENES = [
  { id: 'tv_room', title: 'Breaking story', text: 'Day three of breaking episode six in the writers\' room. The whiteboard is full, the act-three turn doesn\'t work, and {head} has gone very quiet.', teach: 'TV writers "break" each episode as a group in the writers\' room, beat by beat on a whiteboard, before anyone writes a page; the showrunner decides what stays.', opts: [
    { k: 'pitch', label: 'Pitch the turn nobody wants to say out loud', check: ['struc', 13], ok: { tie: { head: 5 }, stand: .4, xp: { struc: .3 } }, bad: { stress: 4 }, t: 'Silence, then {head} says "yes. That." It goes on the board in red.', tb: 'The room moves on without comment. That\'s worse than a no.' },
    { k: 'support', label: 'Build on someone else\'s idea', check: ['col', 11], ok: { tie: { mates: 3 }, xp: { col: .2 } }, t: 'Your tweak makes their idea work. They remember who helped.' },
    { k: 'snacks', label: 'Order lunch and watch how it\'s done', ok: { xp: { struc: .15 }, energy: 3 }, t: 'You learn more listening than you would have talking. Also: the good sandwich place.' }] },
  { id: 'tv_tableread', title: 'The table read', text: 'Thirty people around a long table: cast, writers, network executives, a stenographer. Your scene is next, and the lead is reading it flat.', teach: 'Every TV episode starts with a table read: the cast reads the script aloud for writers and the network, and jokes or scenes that die in the room get rewritten that afternoon.', opts: [
    { k: 'fix', label: 'Rewrite it at lunch', check: ['dial', 13], ok: { stand: .4, xp: { dial: .3 }, tie: { head: 3 } }, bad: { stress: 4 }, t: 'Your new pages get a laugh from the network in the afternoon run.', tb: 'The rewrite is worse. The old version goes back in.' },
    { k: 'talk', label: 'Have a quiet word with the actor', check: ['cha', 13], ok: { tie: { head: 2 }, stand: .2 }, bad: { stand: -.2 }, t: 'They were tired, not bored. The next run is alive.', tb: 'They don\'t take notes from writers. Now everyone knows you tried.' }] },
  { id: 'tv_notes', title: 'Network notes', text: 'The network\'s notes arrive at 11pm: make the lead "more likeable", cut the subplot everyone in the room loves, and add a dog.', teach: 'Networks and streamers give notes on every outline, script and cut; the craft of TV is absorbing notes without losing the show.', opts: [
    { k: 'push', label: 'Push back on the subplot, give them the dog', check: ['pack', 13], ok: { tie: { head: 4 }, stand: .3, xp: { pack: .2 } }, bad: { stress: 5 }, t: 'The subplot survives. The dog is very good, honestly.', tb: 'The subplot goes. So does the dog.' },
    { k: 'take', label: 'Take all the notes', ok: { stress: 2 }, t: 'The episode is smoother and a little less itself.' }] },
  { id: 'tv_floor', title: 'Eight pages a day', text: 'It\'s 6pm on a procedural set and you\'re two scenes behind with the location lost at eight. The guest star is in hair.', teach: 'Television shoots fast: often eight or more script pages a day against a film\'s two or three, with the episode\'s director a guest who must match the show\'s house style.', opts: [
    { k: 'merge', label: 'Merge two set-ups into one moving shot', check: ['stag', 13], ok: { stand: .4, xp: { stag: .3 } }, bad: { stress: 5 }, t: 'One move covers both scenes. You wrap at 7:58.', tb: 'The shot\'s too ambitious. You lose the location and owe a day.' },
    { k: 'cut', label: 'Cut a scene and tell the writers', check: ['pack', 12], ok: { tie: { head: 2 } }, bad: { tie: { head: -3 } }, t: 'The writers grumble and fix it in the edit. Nobody misses it.', tb: 'It was the scene the episode was about.' }] },
  { id: 'tv_live', title: 'Tape night', text: 'A multi-camera sitcom in front of a live audience of two hundred. The warm-up comic is flagging and the biggest joke of the night has just died.', teach: 'Multi-camera sitcoms tape in front of a studio audience; writers rewrite jokes between takes ("punch-ups") and the audience laugh is the test.', opts: [
    { k: 'punch', label: 'Punch up the joke between takes', check: ['comic', 13], ok: { stand: .5, xp: { comic: .3 } }, bad: { stress: 3 }, t: 'The new line gets the biggest laugh of the night. It airs.', tb: 'The new line gets a smaller laugh. They use the first take.' },
    { k: 'crowd', label: 'Help the warm-up comic with the crowd', check: ['cha', 12], ok: { fame: .5, stress: -2 }, t: 'You do five minutes about the lunch truck. The room is back.' }] },
  { id: 'tv_ratings', title: 'Ratings Monday', text: 'The overnights are in. Down 12% on last week. The network is "monitoring the situation" and the room is very quiet.', teach: 'Shows live and die by the ratings: overnights the next morning, then delayed viewing over seven days; streamers measure minutes watched, and tell nobody.', opts: [
    { k: 'calm', label: 'Keep the room calm and focused', check: ['com', 12], ok: { tie: { mates: 3 }, stress: -2 }, t: 'Week two is back up. Nobody panicked, and you get some credit for that.' },
    { k: 'theory', label: 'Dig into why', check: ['tas', 13], ok: { xp: { tas: .3 }, tie: { head: 3 } }, t: 'It was the football. It\'s always the football.' }] },
  { id: 'tv_upfronts', title: 'The upfronts', text: 'A ballroom in May, a stage, the network\'s new season and a thousand advertisers drinking warm white wine. You\'re there to smile.', teach: 'At the "upfronts" each May, networks announce their autumn schedule to advertisers, who commit their money in advance; renewals and cancellations land the same week.', opts: [
    { k: 'work', label: 'Work the room', check: ['cha', 13], ok: { stand: .4, meet: 1 }, bad: { energy: -5 }, t: 'You end up talking to the network chief about a show you haven\'t written yet.', tb: 'You talk to three people in a row who sell car insurance.' },
    { k: 'leave', label: 'Smile for an hour and leave', ok: { energy: 4 }, t: 'Nobody notices you leave. That\'s fine.' }] },
  { id: 'tv_staffing', title: 'Staffing season', text: 'Spring: every show is hiring writers for next season and every writer in town is reading everything. Your agent sends you three pilots to read by Friday.', teach: '"Staffing season" each spring is when TV writers are hired for the next season\'s rooms; writers read the new pilots and meet showrunners in a frantic few weeks.', opts: [
    { k: 'read', label: 'Read them all properly', check: ['tas', 12], ok: { xp: { tas: .2 }, refs: 1 }, t: 'One of them is brilliant. You say so in the meeting, specifically. It helps.' },
    { k: 'skim', label: 'Skim and wing it', ok: { energy: 4 }, t: 'You get the names of two characters wrong. It\'s spring; everyone does.' }] },
  { id: 'tv_guest', title: 'The guest star', text: 'This week\'s guest star is a film actor slumming it, and wants their character to be "less of a cliché" on the morning of the shoot.', teach: 'TV guest stars play one-episode parts; famous guests can lift ratings, and sometimes want rewrites the schedule can\'t afford.', opts: [
    { k: 'meet', label: 'Find them a line or two that matters', check: ['char', 13], ok: { stand: .3, xp: { char: .2 }, tie: { head: 2 } }, bad: { stress: 4 }, t: 'Two new lines and a better exit. They\'re delighted and tell the press it was their idea.', tb: 'They want more than two lines. The day runs long.' },
    { k: 'no', label: 'Politely hold the line', check: ['eth', 12], ok: { tie: { head: 2 } }, t: 'They sulk for an hour and then are very good.' }] },
  { id: 'tv_finale', title: 'The finale', text: 'The season finale needs a cliffhanger that brings the audience back in September, and a network that keeps you in May.', teach: 'Season finales end on cliffhangers to bring viewers back after the summer and make the renewal case to the network.', opts: [
    { k: 'big', label: 'Kill a main character', check: ['vis', 14], ok: { stand: .6, fame: .5, xp: { vis: .3 } }, bad: { stand: -.2 }, t: 'The internet loses its mind. The network is thrilled.', tb: 'The internet loses its mind in the bad way. The actor\'s fans write letters.' },
    { k: 'quiet', label: 'A quiet, devastating last scene', check: ['char', 13], ok: { stand: .5, xp: { char: .3 } }, t: 'The critics single it out. The audience cries and comes back.' }] }
];
for (const s of TV_SCENES) SCENES.push(Object.assign({ role: 'tv', jobs: [] }, s));
ROLE_SCENES.tv = TV_SCENES;

// ---- running your own show ----
// Your show's current season, while it airs this year
function myAiring() {
  const M = S.me; if (!M) return null;
  for (const s of M.shows || []) { const z = s.seas.find(x => x.y === S.year); if (z && s.status === 'on air') return [s, z]; }
  return null;
}
function tvTweak(dq, vm) { const A = myAiring(); if (!A) return; const z = A[1]; z.q = clamp(z.q + dq, 5, 99); z.v = Math.round(z.v * vm * 10) / 10; }
const tvShowName = () => { const A = myAiring(); return A ? A[0].title : 'your show'; };
LATE.push(
  { id: 'tv_arc', pool: 'tv', need: () => !!myAiring(), title: 'What is this season about?', text: () => `The room is back for ${tvShowName()}. Before anyone writes a page, you have to say what this season is about.`,
    opts: [
      { k: 'bold', label: () => 'Something bold: blow up the premise', check: ['vis', 14], go: (c, ok) => { tvTweak(ok ? 8 : -6, ok ? 1.05 : .85); lateFx(ok ? { stand: .8, xp: { vis: .3 } } : { stress: 6 }); return ok ? 'The critics call it the best season of television this year. Some of the audience is confused, then hooked.' : 'Half the audience leaves by episode four. The other half writes essays about it.'; } },
      { k: 'deep', label: () => 'Go deeper into the characters', check: ['char', 13], go: (c, ok) => { tvTweak(ok ? 5 : -2, ok ? 1.05 : .97); lateFx({ xp: { char: .25 } }); return ok ? 'Quiet, rich, and the cast\'s best work. Viewing ticks up.' : 'It drifts. Nothing happens beautifully for six episodes.'; } },
      { k: 'safe', label: () => 'More of what worked last time', go: c => { tvTweak(-2, 1.04); return 'The audience gets what it came for. The critics notice the formula.'; } }] },
  { id: 'tv_netnotes', pool: 'tv', need: () => !!myAiring(), title: 'The network wants changes', text: () => `The network has notes on ${tvShowName()}: a younger love interest, shorter cold opens, and "a reason for teenagers to watch".`,
    opts: [
      { k: 'fight', label: () => 'Fight for the show', check: ['pack', 14], go: (c, ok) => { tvTweak(ok ? 3 : 0, ok ? 1 : .95); lateFx(ok ? { stand: .5 } : { stress: 8 }); return ok ? 'They back down on everything except the cold opens. You can live with shorter cold opens.' : 'They overrule you and remind you who owns the show. They do.'; } },
      { k: 'take', label: () => 'Give them most of it', go: c => { tvTweak(-3, 1.06); return 'Ratings tick up. The show gets a little more ordinary.'; } }] },
  { id: 'tv_raise', pool: 'tv', need: () => !!myAiring() && (myAiring()[0].cast || []).length > 0, mk: c => { const A = myAiring(); c.who = A[0].cast[0]; c.amt = lateAmt(.02, 15000, 400000); }, title: 'Your star wants a raise', text: c => `${lname(c.who)}, the lead of ${tvShowName()}, wants a raise, a producer credit and a director's chair for one episode. Their agent mentions "other offers".`,
    opts: [
      { k: 'pay', label: c => `Pay it, partly out of your own fee (${fmtCash(c.amt)})`, cost: c => c.amt, go: c => { lateFx({ tie: 10 }, c); tvTweak(1, 1.02); return 'They sign for two more seasons and direct a very good episode.'; } },
      { k: 'deal', label: () => 'Negotiate: the credit, not the money', check: ['pack', 13], go: (c, ok) => { lateFx({ tie: ok ? 4 : -8 }, c); if (!ok) tvTweak(-4, .9); return ok ? 'They take the credit and a director\'s chair. Everyone saves face.' : 'They walk. You write them out in a plane crash. The audience is furious.'; } }] },
  { id: 'tv_bottle', pool: 'tv', need: () => !!myAiring(), title: 'A bottle episode', text: () => `You're over budget on ${tvShowName()}. A "bottle episode", one set and the main cast only, would save money. Or it could be the best thing you ever make.`,
    opts: [
      { k: 'yes', label: () => 'Write it yourself, one room, one night', check: ['dial', 14], go: (c, ok) => { tvTweak(ok ? 6 : -1, 1); lateFx(ok ? { stand: .6, cash: usd(20000) } : { cash: usd(20000) }); return ok ? 'The episode people will still be talking about in ten years.' : 'It saves the money. That\'s all it does.'; } },
      { k: 'no', label: () => 'Find the money elsewhere', go: c => 'You cut the helicopter from the finale. Nobody misses the helicopter.' }] },
  { id: 'tv_slot', pool: 'tv', need: () => !!myAiring() && TV_NETS[myAiring()[0].net].kind !== 'streaming', title: 'A new time slot', text: () => `The network wants to move ${tvShowName()} to Friday nights, which everyone knows is where shows go to die.`,
    opts: [
      { k: 'fight', label: () => 'Fight the move', check: ['pack', 15], go: (c, ok) => { tvTweak(0, ok ? 1 : .8); lateFx(ok ? { stand: .4 } : { stress: 6 }); return ok ? 'You keep Tuesday. The other showrunner gets Friday.' : 'Friday it is. The audience halves.'; } },
      { k: 'campaign', label: () => 'Accept it, and rally the fans', check: ['cha', 13], go: (c, ok) => { tvTweak(0, ok ? .95 : .8); lateFx(ok ? { fame: 1 } : {}); return ok ? 'The fans follow you to Friday. The network is surprised.' : 'Some fans follow you. Not enough.'; } }] },
  { id: 'tv_spinoff', pool: 'tv', once: 1, need: () => { const A = myAiring(); return !!A && A[0].seas.length >= 3 && A[1].v >= netBaseViewers(TV_NETS[A[0].net].kind, S.year); }, title: 'A spin-off', text: () => `The network wants a spin-off of ${tvShowName()}, built around the most popular supporting character.`,
    opts: [
      { k: 'yes', label: () => 'Develop it', go: c => { lateFx({ stand: 1, cash: usd(60000), stress: 6, mile: `Developed a spin-off of ${tvShowName()}` }); return 'You write the pilot on weekends. The network loves it. Your main show suffers a little.'; } },
      { k: 'no', label: () => 'Protect the main show', go: c => { tvTweak(2, 1); return 'They give it to someone else. It runs for one season.'; } }] },
  { id: 'tv_leak', pool: 'tv', need: () => !!myAiring(), title: 'The finale leaks', text: () => `The finale of ${tvShowName()} has leaked online, a week early, all forty-four minutes.`,
    opts: [
      { k: 'own', label: () => 'Own it with a funny statement', check: ['cha', 13], go: (c, ok) => { tvTweak(0, ok ? 1.08 : .95); lateFx(ok ? { fame: 1 } : { stress: 5 }); return ok ? 'Your statement goes viral. More people watch the real broadcast than ever.' : 'Your statement reads as rattled. The broadcast numbers dip.'; } },
      { k: 'shoot', label: () => 'Shoot a different ending in four days', check: ['vstory', 15], go: (c, ok) => { tvTweak(ok ? 4 : -3, ok ? 1.12 : .95); lateFx({ energy: -20, stress: 8 }); return ok ? 'The leaked ending was a fake, you tell everyone afterwards. It wasn\'t. The new one is better.' : 'Four days wasn\'t enough. The new ending shows the seams.'; } }] },
  { id: 'tv_library', pool: 'tv', once: 1, need: () => (S.me.shows || []).some(s => s.seas.length >= 3), mk: c => { const s = (S.me.shows || []).find(x => x.seas.length >= 3); c.t = s.title; c.amt = Math.round(usd(40000 * s.seas.length) / 1000) * 1000; }, title: 'A streamer wants your back catalogue', text: c => `A streamer wants every season of ${c.t} for its library. Your share would be ${fmtCash(c.amt)}.`,
    opts: [
      { k: 'yes', label: () => 'Sign', go: c => { lateFx({ cash: c.amt, fame: 1 }); return 'A whole new generation finds the show. You get letters from teenagers.'; } },
      { k: 'hold', label: () => 'Hold out for more', check: ['fin', 14], go: (c, ok) => { lateFx(ok ? { cash: c.amt * 1.6 } : {}); return ok ? `They come back at ${fmtCash(c.amt * 1.6)}.` : 'They buy a rival show instead.'; } }] }
);
for (const t of LATE) LATE_BY[t.id] = t;
function tvShowrunnerWeek() {
  const M = S.me; if (!M || !myAiring()) return;
  if (prnd() < .12) lateOffer('tv');
}
