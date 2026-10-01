// ---------------- Scenes from a working life ----------------
// What actually happens in each job, day to day: real situations people in that role face, written so a choice
// teaches something about the work. Every job in the catalogue maps to one of these families; a shoot day also
// draws on the shared life of a set (lunch, the company move, magic hour). 'teach' is shown after you choose.
// Effects use the scene format: tie (by role), trust, stand, stress, energy, cash, xp {skill: amount}, due, fame.
const ROLE_SCENES = {
  set: [
    { id: 'rs_callsheet', title: 'The call sheet', text: 'The call sheet lands at 10 p.m.: call time 5:30, a company move after lunch and a night exterior.', teach: 'The call sheet, sent the night before by the second AD, is the bible of a shoot day: who is needed where and when.', opts: [
      { k: 'early', label: 'Be there at 5:15 with coffee for your team', ok: { tie: { head: 4, mates: 2 }, energy: -4 }, t: 'Being early is being on time. People notice who is.' },
      { k: 'ontime', label: 'Arrive at 5:30 on the dot', ok: {}, t: 'On time. Nobody says anything, which is the point.' }] },
    { id: 'rs_lunch', title: 'Lunch', text: 'Catering has set up under a tent. The head of department sits alone with a script. The crew table is loud and full.', teach: 'Lunch is called six hours after call; meal penalties cost productions real money if it slips.', opts: [
      { k: 'head', label: 'Ask {head} if you can join them', check: ['cha', 12], ok: { tie: { head: 7 } }, bad: { tie: { head: -2 } }, t: '{head} talks about their first job for twenty minutes. You listen to every word.', tb: '{head} is reading. You read the room too late.' },
      { k: 'crew', label: 'Sit with the crew', ok: { tie: { mates: 4 } }, t: 'Gossip, jokes and who\'s hiring next month. Crew tables run the business.' }] },
    { id: 'rs_move', title: 'The company move', text: 'Lunch is over and the whole unit has to move to a second location across town. Trucks, cables, a hundred people.', teach: 'A company move is when the whole unit relocates mid-day; it can eat an hour, so ADs plan them like military operations.', opts: [
      { k: 'help', label: 'Help the grips wrap cable', ok: { tie: { mates: 5 }, energy: -6, xp: { setm: .15 } }, t: 'Over-under, never around the elbow. They show you properly.' },
      { k: 'own', label: 'Stick to your own department', ok: { tie: { head: 2 } }, t: 'Your kit is first on the truck. Your boss approves.' }] },
    { id: 'rs_magic', title: 'Magic hour', text: 'The sun is going down and the director wants the last shot in the golden light. Twelve minutes. Everyone moves at once.', teach: 'Magic hour, just after sunrise or before sunset, gives soft warm light that lasts minutes; whole days are scheduled around it.', opts: [
      { k: 'fast', label: 'Run, and stay out of frame', check: ['eth', 11], ok: { tie: { head: 5 }, stand: .3 }, bad: { tie: { head: -4 }, stress: 4 }, t: 'You hit your marks and the shot is gorgeous. People hug.', tb: 'You trip a stand. The light goes while they reset.' },
      { k: 'watch', label: 'Watch how the department heads do it', ok: { xp: { light: .15, vstory: .1 } }, t: 'Silent, fast, every person knowing their job. That\'s a crew.' }] },
    { id: 'rs_rain', title: 'Rain day', text: 'It\'s pouring and the exterior is off. The AD calls the cover set: an interior scene nobody has rehearsed.', teach: 'A cover set is a backup interior scheduled for weather; good productions always have one ready.', opts: [
      { k: 'prep', label: 'Offer to prep the cover set', ok: { tie: { head: 4 }, xp: { setm: .1 } }, t: 'You learn more in an hour of chaos than a week of calm.' },
      { k: 'wait', label: 'Wait in the holding area', ok: { energy: 6 }, t: 'Tea, cards, a nap in a van. Not every day is busy.' }] },
    { id: 'rs_martini', title: 'The martini shot', text: '"This is the martini," the AD calls: the last shot of the day. Someone has brought beer for after.', teach: 'The last shot of the day is the martini shot (the next one is in a glass); the one before it is the Abby Singer.', opts: [
      { k: 'stay', label: 'Stay for a drink', ok: { tie: { mates: 4 }, energy: -4 }, t: 'Stories you\'ll still be telling in twenty years.' },
      { k: 'home', label: 'Go home and sleep', ok: { energy: 6 }, t: 'Tomorrow\'s call is early. Wise.' }] }
  ],
  ad: [
    { id: 'ra_makeday', title: 'Making the day', text: 'It\'s 4 p.m. and you\'re three setups behind. The first AD asks you what can be cut.', teach: 'ADs track whether the day\'s pages will be shot ("making the day"); falling behind means cutting shots or paying overtime.', opts: [
      { k: 'propose', label: 'Suggest combining two setups into one shot', check: ['setm', 12], ok: { tie: { head: 8, dir: 3 }, stand: .5 }, bad: { tie: { head: -4 } }, t: 'The director likes it. You made the day.', tb: 'The director hates it. The AD takes the heat, and remembers why.' },
      { k: 'ot', label: 'Say you\'ll prep for overtime', ok: { tie: { head: 2 }, energy: -6 }, t: 'Twelve hours becomes fourteen. Normal.' }] },
    { id: 'ra_bg', title: 'Background', text: 'Forty extras need to cross a street naturally, in a loop, for twelve takes. The first take looks like a fire drill.', teach: 'Second ADs and PAs direct background actors; their action makes or breaks how real a scene feels.', opts: [
      { k: 'give', label: 'Give each extra a reason to cross', check: ['dact', 11], ok: { tie: { head: 6, dir: 4 }, xp: { dact: .2 } }, bad: { stress: 3 }, t: 'A woman late for work, a man looking for a shop. It comes alive.', tb: 'They overact. Now it looks like a musical.' },
      { k: 'pace', label: 'Just stagger the cues', ok: { tie: { head: 2 } }, t: 'Fine. Nobody will notice, which is the job.' }] },
    { id: 'ra_safety', title: 'The safety meeting', text: 'Before a car stunt the first AD gathers everyone. A grip makes a joke and half the crew stops listening.', teach: 'Any stunt, weapon or vehicle work starts with a safety meeting led by the first AD; it is not optional.', opts: [
      { k: 'quiet', label: 'Quietly ask the joker to listen', check: ['com', 12], ok: { tie: { head: 6 }, stand: .3 }, bad: { tie: { mates: -3 } }, t: 'The meeting lands. Nobody gets hurt.', tb: 'He takes it badly. Awkward afternoon.' },
      { k: 'none', label: 'Say nothing', ok: {}, t: 'It goes fine. This time.' }] },
    { id: 'ra_walkie', title: 'Walkie etiquette', text: 'Your walkie crackles: "Copy that, who\'s on channel one?" You\'ve been talking on the wrong channel for an hour.', teach: 'Channel one is production, two is for private conversations; "copy", "going to two" and "flying in" are the language of a set.', opts: [
      { k: 'own', label: 'Own it on the channel', ok: { tie: { head: 2 }, stress: 2 }, t: 'A laugh, a lesson. Everyone did it once.' },
      { k: 'hide', label: 'Switch quietly and say nothing', ok: { stress: 3 }, t: 'Someone saw. Of course they did.' }] }
  ],
  cam: [
    { id: 'rc_focus', title: 'Soft', text: 'The take was perfect, but on the monitor the actor\'s eyes look soft. The focus puller looks at you.', teach: 'The first AC pulls focus live, by eye and tape measure; a soft take is unusable however good the performance.', opts: [
      { k: 'speak', label: 'Tell the DP before they wrap the setup', check: ['comp', 12], ok: { tie: { dp: 8, head: 4 }, stand: .4 }, bad: { tie: { head: -4 } }, t: 'They go again. The DP clocks you as someone who looks.', tb: 'It wasn\'t soft. You\'re told to watch, not talk.' },
      { k: 'quiet', label: 'Keep quiet: not your call', ok: {}, t: 'They catch it in dailies. Expensive.' }] },
    { id: 'rc_mags', title: 'Loading', text: 'You\'re trusted with the data: three cards of today\'s footage to offload and check. The truck is cold and you\'re tired.', teach: 'The DIT or loader backs up every card to two drives and checks them before a card is wiped; losing footage ends careers.', opts: [
      { k: 'check', label: 'Verify every checksum, slowly', ok: { tie: { head: 5 }, energy: -5, xp: { cont: .1 } }, t: 'All there. Twice. You sleep well.' },
      { k: 'fast', label: 'Skim it and go home', check: ['eth', 13], ok: { energy: 4 }, bad: { tie: { head: -10 }, stress: 12 }, t: 'Fine, as it happens.', tb: 'One card is corrupt. Nobody knows yet. Then everyone does.' }] },
    { id: 'rc_light', title: 'A lighting call', text: 'The gaffer asks what you\'d do with the key light for this close-up. The DP is listening.', teach: 'The gaffer runs the electrical department and shapes light to the DP\'s plan: key, fill and back light are the basics.', opts: [
      { k: 'soft', label: 'Bounce it, soft and from the window side', check: ['light', 12], ok: { tie: { head: 6, dp: 5 }, xp: { light: .25 } }, bad: { tie: { head: -2 } }, t: '"That\'s what I\'d do." From a gaffer, that\'s a medal.', tb: '"That\'s what film school says." Ouch.' },
      { k: 'ask', label: 'Ask them to show you their way', ok: { xp: { light: .2 }, tie: { head: 3 } }, t: 'Twenty minutes of the best lesson you\'ve had.' }] },
    { id: 'rc_grip', title: 'The dolly', text: 'The key grip needs someone to push the dolly on a slow move timed to a line of dialogue.', teach: 'Dolly grips move the camera on track; a good push hits the actor\'s beat as precisely as any performance.', opts: [
      { k: 'push', label: 'Do it', check: ['move', 12], ok: { tie: { head: 6 }, xp: { move: .25 } }, bad: { stress: 4 }, t: 'Smooth as glass. The operator gives you a nod.', tb: 'You bump the track. Take four.' },
      { k: 'decline', label: 'Ask to watch the dolly grip first', ok: { xp: { move: .15 } }, t: 'Sensible. Next time it\'s yours.' }] }
  ],
  snd: [
    { id: 'rn_plane', title: 'Plane overhead', text: 'A jet crosses during the best take. The director loved it. The mixer looks at you: say something?', teach: 'The sound mixer can ask for another take for noise; the director decides whether the performance is worth fixing in post (ADR).', opts: [
      { k: 'flag', label: 'Flag it: they\'ll need ADR otherwise', check: ['com', 11], ok: { tie: { head: 6 }, xp: { sdes: .15 } }, bad: { tie: { dir: -3 } }, t: 'One more take, clean. The editor will thank you.', tb: 'The director snaps. They\'ll fix it in post.' },
      { k: 'let', label: 'Let it go and grab wild lines later', ok: { xp: { sdes: .15 } }, t: 'The actor records the line alone after the take. Clever.' }] },
    { id: 'rn_boom', title: 'Boom shadow', text: 'The DP moves a light and your boom now throws a shadow across the actor\'s face.', teach: 'The boom operator keeps the microphone just out of frame and out of the light, every take, for hours.', opts: [
      { k: 'angle', label: 'Find another angle, fast', check: ['sound', 11], ok: { tie: { dp: 4, head: 4 } }, bad: { stress: 3 }, t: 'Sound and picture both happy. Rare.', tb: 'Now the mic is in the shot. Laughter.' },
      { k: 'wire', label: 'Ask to put a wireless mic on the actor', ok: { tie: { head: 2 } }, t: 'It works, but the costume rustles.' }] },
    { id: 'rn_tone', title: 'Room tone', text: '"Thirty seconds of room tone, please!" Everyone has to freeze. A PA keeps whispering.', teach: 'Room tone is a recording of the silence of a location, used by editors to smooth cuts between takes.', opts: [
      { k: 'shush', label: 'Politely shush them', ok: { tie: { head: 3 } }, t: 'Thirty seconds of perfect silence. It\'s oddly moving.' },
      { k: 'again', label: 'Ask for another thirty', ok: { tie: { head: 2, mates: -1 } }, t: 'Clean. Annoying, but clean.' }] }
  ],
  art: [
    { id: 'rt_hero', title: 'The hero prop', text: 'The hero prop, the one the lead holds in close-up, has snapped an hour before it\'s needed.', teach: 'Props departments make several copies of important props: a hero for close-ups and backups for action.', opts: [
      { k: 'fix', label: 'Fix it on the spot', check: ['sets', 12], ok: { tie: { head: 8 }, stand: .4 }, bad: { tie: { head: -5 }, stress: 4 }, t: 'Nobody will ever know. That\'s the job.', tb: 'The glue shows in the close-up. It will be seen by millions.' },
      { k: 'backup', label: 'Run for the backup', ok: { tie: { head: 3 } }, t: 'The backup is slightly different. The script supervisor notes it.' }] },
    { id: 'rt_period', title: 'Period detail', text: 'The scene is set in 1974 and you notice a plastic bottle in the background.', teach: 'Set dressers and art directors check every visible item for the period; anachronisms get spotted by audiences for decades.', opts: [
      { k: 'catch', label: 'Swap it before the take', ok: { tie: { head: 5 }, xp: { period: .2 } }, t: 'Caught. A thousand people online will never write about it.' }] },
    { id: 'rt_dress', title: 'Dress to camera', text: 'The camera has moved and now sees the whole back wall, which is empty.', teach: 'Sets are dressed "to camera": only what the lens sees matters, and it changes every setup.', opts: [
      { k: 'fill', label: 'Dress it with what\'s on the truck', check: ['world', 11], ok: { tie: { head: 6, dp: 3 }, xp: { world: .2 } }, bad: { tie: { head: -2 } }, t: 'It looks like someone lives there.', tb: 'It looks like a furniture showroom.' },
      { k: 'ask', label: 'Ask the set decorator what they want', ok: { tie: { head: 3 }, xp: { world: .1 } }, t: 'A quick lesson in how they think about character through objects.' }] }
  ],
  cos: [
    { id: 'rw_cont', title: 'Continuity', text: 'The actor\'s top button was done up in the wide shot. Now they\'ve undone it for the close-up.', teach: 'Costume and makeup keep continuity photos of every look; shots filmed hours apart must match on screen.', opts: [
      { k: 'fix', label: 'Step in before the take', check: ['wardrobe', 11], ok: { tie: { head: 6 }, xp: { wardrobe: .15 } }, bad: { tie: { lead: -3 } }, t: 'Matched. The script supervisor nods.', tb: 'The actor hates being touched before a take. Learn the moment.' }] },
    { id: 'rw_quick', title: 'A quick change', text: 'Ninety seconds to get the lead from the ball gown into travel clothes between setups.', teach: 'Quick changes are planned and rehearsed like stunts: rigged fastenings, pre-set pieces, two dressers.', opts: [
      { k: 'go', label: 'Go', check: ['eth', 12], ok: { tie: { head: 5, lead: 4 } }, bad: { stress: 5 }, t: 'Done in eighty. Applause from the camera crew.', tb: 'A zip jams. The whole set waits.' }] },
    { id: 'rw_heat', title: 'The heat', text: 'It\'s 38 degrees and the prosthetic on the villain is sliding. The actor is miserable.', teach: 'Makeup artists maintain looks all day: touch-ups between takes, prosthetics re-glued, sweat managed.', opts: [
      { k: 'care', label: 'Look after the actor first, then the makeup', ok: { tie: { lead: 6, head: 3 } }, t: 'Shade, water, a fan. Then the glue holds.' },
      { k: 'fix', label: 'Rebuild the edge, fast', check: ['mkup', 12], ok: { tie: { head: 6 }, xp: { mkup: .2 } }, bad: { tie: { head: -3 } }, t: 'Seamless. You\'re a magician.', tb: 'It shows in the close-up.' }] }
  ],
  act: [
    { id: 'rx_marks', title: 'Hitting marks', text: 'There\'s a tape cross on the floor where you have to stop, without looking down, on a line.', teach: 'Actors hit marks so they land in focus and in the light; the best do it invisibly, mid-emotion.', opts: [
      { k: 'nail', label: 'Practise it in your head until it\'s instinct', check: ['phys', 11], ok: { tie: { dp: 4, dir: 3 }, xp: { phys: .2 } }, bad: { stress: 3 }, t: 'You land it every take.', tb: 'You overshoot twice. The focus puller sighs.' }] },
    { id: 'rx_note', title: 'A note', text: 'Between takes the director says only: "Less."', teach: 'Film acting is small: the camera magnifies everything, so directors often ask for less.', opts: [
      { k: 'less', label: 'Do almost nothing and trust it', check: ['range', 12], ok: { tie: { dir: 8 }, stand: .5 }, bad: { tie: { dir: -2 } }, t: 'They print it. "That\'s the one."', tb: 'Now it\'s flat. They give you another note.' },
      { k: 'ask', label: 'Ask what they want the audience to feel', ok: { tie: { dir: 4 }, xp: { range: .15 } }, t: 'The note becomes a conversation. Better.' }] },
    { id: 'rx_wait', title: 'Waiting', text: 'You\'ve been in the trailer for seven hours. You\'re on in "twenty minutes" for the fourth time.', teach: 'Actors spend most of a shoot day waiting; staying warm and ready for the moment is part of the craft.', opts: [
      { k: 'ready', label: 'Stay in the scene: lines, breath, focus', ok: { xp: { pres: .15 }, energy: -4 }, t: 'When they finally call you, you\'re there.' },
      { k: 'rest', label: 'Sleep', ok: { energy: 8 }, t: 'You wake up groggy when they call. It takes three takes to find it.' }] },
    { id: 'rx_impro', title: 'The improvised line', text: 'A line pops into your head in the moment. It isn\'t in the script.', teach: 'Some directors love improvisation, some forbid it; the script supervisor will note any change for continuity.', opts: [
      { k: 'say', label: 'Say it', check: ['impro', 13], ok: { tie: { dir: 9 }, stand: .8 }, bad: { tie: { dir: -5, head: -2 } }, t: 'The crew laughs. It makes the trailer.', tb: '"Just the words, please."' },
      { k: 'stick', label: 'Stick to the script', ok: {}, t: 'Clean take. Safe.' }] }
  ],
  dir: [
    { id: 'rd_cut', title: 'Losing a shot', text: 'You\'re behind schedule. The producer wants you to drop the crane shot you\'ve dreamed of for months.', teach: 'Directors constantly trade ambition for time: shot lists are cut on the day, and the best plan alternatives in advance.', opts: [
      { k: 'fight', label: 'Fight for it', check: ['cha', 14], ok: { tie: { prod: -2 }, stand: 1.2, xp: { vstory: .3 } }, bad: { tie: { prod: -8 }, stress: 8 }, t: 'You get the crane. It\'s the shot everyone will remember.', tb: 'You lose the shot and the producer\'s goodwill.' },
      { k: 'rethink', label: 'Find a simpler way to say the same thing', check: ['vstory', 12], ok: { tie: { prod: 5 }, xp: { vstory: .25 } }, bad: { stress: 3 }, t: 'A handheld push-in. Arguably better.', tb: 'It works, technically.' }] },
    { id: 'rd_actors', title: 'Two actors', text: 'Your leads disagree about the scene. Each wants it played their way and looks to you.', teach: 'Directing actors is mostly listening; good directors find what both want and give them a shared objective.', opts: [
      { k: 'both', label: 'Shoot it both ways', ok: { tie: { lead: 4 }, energy: -6 }, t: 'Twice the time. You\'ll decide in the edit.' },
      { k: 'talk', label: 'Find what they agree on and build from there', check: ['dact', 13], ok: { tie: { lead: 8 }, xp: { dact: .3 }, stand: .6 }, bad: { tie: { lead: -5 } }, t: 'It clicks. The scene is better than either version.', tb: 'Neither feels heard.' }] },
    { id: 'rd_oner', title: 'Coverage or a oner', text: 'You could cover this scene in eight setups, or try it as one continuous take.', teach: 'Coverage (wide, mediums, close-ups) gives editors options; a oner commits the film to one rhythm and takes longer to rehearse.', opts: [
      { k: 'oner', label: 'Go for the oner', check: ['stag', 14], ok: { stand: 1.5, xp: { stag: .3 } }, bad: { stress: 8, tie: { prod: -4 } }, t: 'Take nine. The crew bursts into applause.', tb: 'Twenty-two takes and none usable. Coverage after lunch.' },
      { k: 'cover', label: 'Cover it properly', ok: { tie: { prod: 3 }, xp: { pace: .15 } }, t: 'Safe, and the editor will thank you.' }] }
  ],
  wri: [
    { id: 'rr_coverage', title: 'Coverage', text: 'You have to write coverage on a script by a famous writer. It\'s not good.', teach: 'Readers write coverage: a synopsis, comments and a verdict (pass, consider, recommend). It decides what executives read.', opts: [
      { k: 'honest', label: 'Pass, and say why clearly', check: ['struc', 12], ok: { tie: { head: 6 }, xp: { struc: .2 }, stand: .3 }, bad: { tie: { head: -3 } }, t: 'Your boss forwards it upstairs with "agree".', tb: 'Your reasoning is thin. They notice.' },
      { k: 'safe', label: 'Consider, to be safe', ok: {}, t: 'Nobody learns anything, including you.' }] },
    { id: 'rr_notes', title: 'The notes call', text: 'Eleven people on a call give notes on the draft. Half contradict the other half.', teach: 'Writers receive notes from producers, executives and directors; the craft is finding the note behind the note.', opts: [
      { k: 'under', label: 'Ask what they\'re feeling, not what they want changed', check: ['com', 12], ok: { tie: { head: 6 }, xp: { char: .2 } }, bad: { stress: 5 }, t: 'The real problem surfaces: the second act drags. Fixable.', tb: 'The call runs ninety minutes over.' },
      { k: 'yes', label: 'Agree with everything and sort it out later', ok: { stress: 4 }, t: 'A week of rewrites pulling in five directions.' }] },
    { id: 'rr_room', title: 'The room', text: 'The writers\' room breaks a story. You have a pitch. The showrunner looks your way.', teach: 'Writers\' rooms "break" stories together on a whiteboard; junior writers learn when to pitch and when to support.', opts: [
      { k: 'pitch', label: 'Pitch it', check: ['orig', 13], ok: { tie: { head: 8 }, stand: 1 }, bad: { tie: { head: -2 }, stress: 4 }, t: 'It goes on the board. In marker.', tb: 'Silence. Then they move on.' },
      { k: 'build', label: 'Build on someone else\'s idea', check: ['col', 11], ok: { tie: { mates: 6, head: 3 } }, bad: {}, t: 'Generous, and smart. The room trusts you.', tb: 'It gets lost in the noise.' }] }
  ],
  pro: [
    { id: 'rp_over', title: 'Over budget', text: 'The location fee has doubled overnight. The producer asks you to find the money.', teach: 'Producers and production managers move money between budget lines; contingency (around 10%) exists for days like this.', opts: [
      { k: 'find', label: 'Find savings in other lines', check: ['bud', 12], ok: { tie: { head: 8 }, xp: { bud: .25 }, stand: .5 }, bad: { tie: { head: -3 } }, t: 'A cheaper truck, a shorter day elsewhere. Balanced.', tb: 'Your savings fall apart on contact with reality.' },
      { k: 'negot', label: 'Renegotiate with the owner', check: ['cha', 13], ok: { tie: { head: 6 }, xp: { fin: .2 } }, bad: { stress: 5 }, t: 'Back to the original fee, and a free day.', tb: 'They raise it again.' }] },
    { id: 'rp_permit', title: 'The permit', text: 'The street shoot is tomorrow and the permit hasn\'t come through.', teach: 'Location managers secure permits from the city, notify residents, and arrange police for road closures.', opts: [
      { k: 'chase', label: 'Spend the day at the permit office', ok: { tie: { head: 6 }, energy: -8 }, t: 'Stamped at 4:55. Heroic.' },
      { k: 'plan', label: 'Prepare a backup location', check: ['pack', 12], ok: { tie: { head: 5 }, xp: { pack: .2 } }, bad: { stress: 4 }, t: 'Good thing: the permit is denied, and the backup is ready.', tb: 'The backup is worse. And the permit comes through.' }] },
    { id: 'rp_cash', title: 'Cash flow', text: 'The next tranche of financing is late. Payroll is Friday.', teach: 'Films are financed in tranches from investors, presales and loans; cash flow, not the total budget, decides whether a shoot survives.', opts: [
      { k: 'call', label: 'Call the financier directly', check: ['fin', 13], ok: { tie: { head: 8 }, stand: 1 }, bad: { tie: { head: -4 } }, t: 'Wired Thursday night. You get a reputation.', tb: 'Not your place, you\'re told.' },
      { k: 'defer', label: 'Draft a plan to defer some fees', ok: { xp: { fin: .2 } }, t: 'Useful. The producer uses half of it.' }] }
  ],
  cst: [
    { id: 'rk_session', title: 'Casting session', text: 'Forty actors read for one role today. The twenty-third is extraordinary and nobody else noticed.', teach: 'Casting directors run sessions, read with actors, and champion talent to directors and producers.', opts: [
      { k: 'push', label: 'Push for a callback', check: ['eye', 12], ok: { tie: { head: 7 }, xp: { eye: .25 }, stand: .5 }, bad: { tie: { head: -2 } }, t: 'Callback, then chemistry read. They get the part.', tb: 'Your boss disagrees, firmly.' },
      { k: 'note', label: 'Make a note in the system', ok: { xp: { eye: .1 } }, t: 'Maybe for the next project.' }] },
    { id: 'rk_read', title: 'Reader', text: 'You\'re reading opposite the actors: the off-camera lines. The director is watching them, not you.', teach: 'A good reader gives actors something real to play against, without competing with them.', opts: [
      { k: 'give', label: 'Give them a real scene partner', check: ['range', 11], ok: { tie: { head: 5 }, xp: { range: .15 } }, bad: {}, t: 'Better auditions all day. Your boss notices why.', tb: 'You overdo it. Upstaged by the reader, someone mutters.' }] }
  ],
  edt: [
    { id: 're_sync', title: 'Dailies', text: 'Yesterday\'s footage needs syncing and logging before the director arrives at nine.', teach: 'Assistant editors sync picture and sound, organise bins and prepare dailies; editors rely on their system completely.', opts: [
      { k: 'early', label: 'Come in at six', ok: { tie: { head: 6 }, energy: -6, xp: { cont: .15 } }, t: 'Ready at 8:50. The editor buys you breakfast.' },
      { k: 'smart', label: 'Script a faster way to batch it', check: ['cont', 12], ok: { tie: { head: 7 }, xp: { cont: .25 } }, bad: { stress: 5 }, t: 'Done in half the time, forever.', tb: 'The script mislabels two scenes. Long morning.' }] },
    { id: 're_cut', title: 'Your cut', text: 'The editor lets you cut a small scene yourself. The director will see it.', teach: 'Editing decides rhythm and meaning: where a cut falls changes what an audience feels.', opts: [
      { k: 'bold', label: 'Cut it boldly, start late and leave early', check: ['rhythm', 13], ok: { tie: { head: 6, dir: 6 }, stand: 1, xp: { rhythm: .3 } }, bad: { tie: { dir: -2 } }, t: 'They keep it as is. Your cut is in the film.', tb: 'Too clever. They recut it.' },
      { k: 'safe', label: 'Cut it cleanly and simply', ok: { xp: { rhythm: .15 } }, t: 'Fine. The editor shows you what they\'d change.' }] },
    { id: 're_test', title: 'Test screening', text: 'The audience scores are low. The studio wants the ending changed.', teach: 'Test screenings with recruited audiences shape final cuts; many famous endings changed after them.', opts: [
      { k: 'idea', label: 'Suggest a structural fix from the cards', check: ['shape', 13], ok: { tie: { head: 8 }, stand: 1 }, bad: {}, t: 'Moving one scene earlier changes everything.', tb: 'They don\'t hear the assistant.' },
      { k: 'listen', label: 'Listen to the arguments', ok: { xp: { shape: .2 } }, t: 'You learn more about story in one meeting than in a year.' }] }
  ],
  mus: [
    { id: 'rm_spot', title: 'Spotting session', text: 'You sit with the director and composer deciding where music starts and stops.', teach: 'In a spotting session the composer and director decide each music cue: where it enters, what it does, where it ends.', opts: [
      { k: 'silence', label: 'Suggest one scene plays without music', check: ['tas', 12], ok: { tie: { head: 6, dir: 5 }, xp: { score: .2 } }, bad: {}, t: 'Silence lands harder than anything you could write.', tb: 'The director needs music there. The composer shrugs.' }] },
    { id: 'rm_temp', title: 'Temp love', text: 'The director has fallen in love with the temp track: a famous score they can\'t afford.', teach: 'Editors cut to temporary music; directors fall in love with it, and composers must write something new that does the same job.', opts: [
      { k: 'write', label: 'Write something with the same pulse but its own melody', check: ['theme', 13], ok: { tie: { head: 8, dir: 4 }, stand: .8 }, bad: { stress: 5 }, t: 'They forget the temp by the third playback.', tb: 'It sounds like a copy. Back to the piano.' }] }
  ],
  vfx: [
    { id: 'rv_render', title: 'Overnight renders', text: 'The farm crashed overnight. Twelve shots are due to the client by noon.', teach: 'VFX shots render on server farms overnight; failed renders and late notes are the rhythm of the job.', opts: [
      { k: 'triage', label: 'Triage: the hardest shots first', check: ['digi', 12], ok: { tie: { head: 7 }, xp: { digi: .25 } }, bad: { stress: 6 }, t: 'Eleven of twelve delivered. The supervisor is impressed.', tb: 'You run out of time on the easy ones.' },
      { k: 'all', label: 'Pull an all-nighter', ok: { tie: { head: 5 }, energy: -15, stress: 4 }, t: 'Done. You look like a ghost.' }] },
    { id: 'rv_notes', title: 'Client notes', text: '"Can the dragon be more... majestic?" says the note on shot 43.', teach: 'VFX artists translate vague notes into concrete changes: scale, speed, light, framing.', opts: [
      { k: 'ask', label: 'Send three quick options', check: ['digi', 11], ok: { tie: { head: 5 }, xp: { digi: .2 } }, bad: {}, t: 'They pick B. Done in a day.', tb: 'They want "something between A and C".' }] }
  ],
  stn: [
    { id: 'rs_rehearse', title: 'Rehearsal', text: 'A fall down a staircase. The coordinator wants three rehearsals on pads first.', teach: 'Stunt coordinators design and rehearse every stunt for safety; the performance must look dangerous and be safe.', opts: [
      { k: 'all', label: 'Do every rehearsal properly', ok: { tie: { head: 6 }, xp: { stunt: .25 }, energy: -8 }, t: 'On the day, it\'s perfect and nobody is hurt.' },
      { k: 'skip', label: 'Say you\'ve got it and save the energy', check: ['phys', 14], ok: { tie: { head: -2 } }, bad: { energy: -25, stress: 8 }, t: 'You land it. The coordinator is not impressed by the shortcut.', tb: 'You land badly. A week of bruises.' }] }
  ],
  office: [
    { id: 'ro_phones', title: 'Rolling calls', text: 'Your boss is in the car and wants to "roll calls": you dial, connect, listen and take notes on eight calls in a row.', teach: 'Assistants in agencies and studios roll calls for their bosses and listen in; it\'s how the business is learned.', opts: [
      { k: 'notes', label: 'Take perfect notes and follow up every promise', check: ['eth', 12], ok: { tie: { head: 6 }, xp: { pack: .2 } }, bad: { stress: 4 }, t: 'You hear how deals are made, one call at a time.', tb: 'You drop a call to a very important person.' }] },
    { id: 'ro_cover', title: 'Your boss is out', text: 'Your boss is away and a big client calls angry.', teach: 'Assistants protect their bosses\' relationships; handling a difficult call well is how assistants get promoted.', opts: [
      { k: 'calm', label: 'Listen, apologise, promise a call back', check: ['com', 12], ok: { tie: { head: 5 }, stand: .4 }, bad: { tie: { head: -3 } }, t: 'The client calms down. Your boss hears about it.', tb: 'You promise something you can\'t deliver.' }] }
  ],
  cinema: [
    { id: 'rq_director', title: 'Row F', text: 'A famous director is in row F of the late show, alone, taking notes.', teach: 'Directors watch films in cinemas to see how real audiences react; many say they learn more there than anywhere.', opts: [
      { k: 'talk', label: 'Say something smart about the film afterwards', check: ['tas', 13], ok: { tie: { star: 8 }, stand: .4 }, bad: { stress: 3 }, t: 'They stop. They ask your name.', tb: 'They nod politely and leave.' },
      { k: 'leave', label: 'Leave them in peace', ok: {}, t: 'Some people come to the cinema to be alone. You respect it.' }] },
    { id: 'rq_reel', title: 'The projector', text: 'The projector fails twenty minutes into a sold-out screening. The projectionist is on a break.', teach: 'Cinemas now project from digital packages (DCPs); a projectionist still keeps the show running when it fails.', opts: [
      { k: 'fix', label: 'Try to restart it yourself', check: ['light', 12], ok: { cash: 50, stand: .1 }, bad: { stress: 4 }, t: 'Back in four minutes. The audience applauds the dark.', tb: 'You make it worse. Refunds.' },
      { k: 'run', label: 'Run for the projectionist', ok: {}, t: 'Fixed in ten. You keep the audience calm with a joke.' }] }
  ],
  intern: [
    { id: 'ri_coffee', title: 'The coffee order', text: 'Fourteen coffee orders, each with modifications, from memory.', teach: 'Internships are mostly small tasks done perfectly; reliability is the skill being tested.', opts: [
      { k: 'note', label: 'Write it down, check it twice', ok: { tie: { head: 3 } }, t: 'Every order right. Small things, noticed.' },
      { k: 'memory', label: 'Trust your memory', check: ['eth', 12], ok: { tie: { head: 5 } }, bad: { tie: { head: -2 } }, t: 'All correct. Somebody says "who is that?"', tb: 'Oat milk instead of almond. To the wrong person.' }] }
  ]
};
// Which family a job belongs to.
const DEPT_FAMILY = { 'Second Unit Director or Assistant Director': 'ad', 'Script and Continuity Department': 'ad', 'Health and Safety': 'ad', 'Intimacy Coordination': 'ad', Cinematography: 'cam', 'Camera and Electrical Department': 'cam', 'Sound Department': 'snd', 'Production Design': 'art', 'Art Direction': 'art', 'Set Decoration': 'art', 'Art Department': 'art', 'Property Department': 'art', 'Costume Design': 'cos', 'Costume and Wardrobe Department': 'cos', 'Makeup Department': 'cos', Cast: 'act', Choreography: 'act', 'Voice Actors – Dubbing': 'act', Directed: 'dir', Writing: 'wri', Produced: 'pro', 'Production Management': 'pro', 'Location Management': 'pro', 'Production Finance and Accounting': 'pro', 'Production Department': 'pro', 'Transportation Department': 'pro', 'Craft Services': 'pro', 'Additional Crew': 'pro', Legal: 'pro', Publicity: 'pro', 'Casting By': 'cst', 'Casting Department': 'cst', 'Film Editing': 'edt', 'Editorial Department': 'edt', 'Color Department': 'edt', Music: 'mus', 'Music Department': 'mus', 'Visual Effects': 'vfx', 'Special Effects': 'vfx', 'Animation Department': 'vfx', Puppetry: 'vfx', Stunts: 'stn' };
const POST_FAMILY = { usher: 'cinema', runner: 'set', rental: 'cam', screener: 'wri', setpa: 'ad', officepa: 'pro', extra: 'act', standin: 'act', reader: 'wri', asstprod: 'pro', campa: 'cam', artpa: 'art', costpa: 'cos', locpa: 'pro', postpa: 'edt', logger: 'edt', castasst: 'cst', crafty: 'pro', utilsnd: 'snd', dayplayer: 'act', ac2: 'cam', grip: 'cam', ae2: 'edt', ae1: 'edt', ad22: 'ad', dresser: 'art', boom: 'snd', makeup: 'cos', stunt: 'stn', devasst: 'wri' };
function familyOf(j) {
  const t = tmplOf(j);
  if (t && t.tier === 0) return 'intern';
  if (POST_FAMILY[j.k]) return POST_FAMILY[j.k];
  const cj = JOBS.jobs.find(x => x.id === j.jid);
  return cj && DEPT_FAMILY[cj.dept] || (j.odd ? 'office' : 'pro');
}
for (const fam in ROLE_SCENES) for (const s of ROLE_SCENES[fam]) SCENES.push(Object.assign({ role: fam, jobs: [] }, s));
// Days off the job have their moments too.
const LIFE_SCENES = {
  hustle: [
    { id: 'lh_regular', title: 'A regular', text: 'A regular at the bar turns out to be {contact}\'s line producer. They\'re three drinks in and talkative.', opts: [
      { k: 'listen', label: 'Listen and keep their glass full', check: ['cha', 11], ok: { tie: { contact: 5 }, refs: 1 }, bad: {}, t: 'At closing they write a name on a napkin: call this person.', tb: 'They forget you by the fourth drink.' },
      { k: 'pro', label: 'Stay professional', ok: { cash: 30 }, t: 'Good tips. Sometimes that\'s the win.' }] },
    { id: 'lh_late', title: 'Double shift', text: 'Your manager asks you to cover a second shift. Double pay.', opts: [
      { k: 'yes', label: 'Take it', ok: { cash: 140, energy: -15, stress: 3 }, t: 'Rent sorted. Feet destroyed.' },
      { k: 'no', label: 'Say no', ok: {}, t: 'You need the rest more than the money. This week.' }] }],
  train: [
    { id: 'lt_demo', title: 'Show us', text: 'The teacher asks someone to demonstrate in front of the class.', opts: [
      { k: 'me', label: 'Volunteer', check: ['com', 12], ok: { xp: { pres: .1 }, stand: .2, tie: { contact: 2 } }, bad: { stress: 4 }, t: 'You nail it. The teacher uses you as the example all term.', tb: 'You freeze. Everyone has been there.' },
      { k: 'watch', label: 'Let someone else go', ok: {}, t: 'You learn from their mistakes instead.' }] }],
  out: [
    { id: 'lo_party', title: 'A friend of a friend', text: 'At the bar, a friend introduces someone who works in {fieldword}.', opts: [
      { k: 'shop', label: 'Talk shop', check: ['cha', 11], ok: { meet: 1 }, bad: {}, t: 'You swap numbers. You might actually use it.', tb: 'They came out to forget work. You didn\'t read it.' },
      { k: 'fun', label: 'Just have fun', ok: { stress: -4 }, t: 'A great night. No business card required.' }] },
    { id: 'lo_late', title: 'One more', text: 'It\'s 1 a.m. and everyone wants one more round. You have an early start.', opts: [
      { k: 'stay', label: 'One more', ok: { energy: -10, stress: -4 }, t: 'It\'s never just one.' },
      { k: 'go', label: 'Go home', check: ['eth', 10], ok: { energy: 4 }, bad: { energy: -6 }, t: 'Wise. Tomorrow-you is grateful.', tb: 'You leave, then end up at a diner till three anyway.' }] }]
};
for (const k in LIFE_SCENES) for (const s of LIFE_SCENES[k]) SCENES.push(Object.assign({ event: 1, jobs: [] }, s));
function lifeScene(pool) {
  const M = S.me, recent = new Set(M.inbox.filter(x => x.kind === 'scene' && S.week - x.w < 8).map(x => x.scene));
  const L = pool.filter(s => !recent.has(s.id));
  if (!L.length) return;
  const s = ppick(L), known = Object.keys(M.known).map(Number).filter(id => !P(id).dead);
  const ctx = { head: null, film: null, mates: [], contact: known.length ? ppick(known) : null, star: null };
  if (/\{contact\}/.test(s.text) && ctx.contact === null) return;
  const text = fillScene(s.text, ctx).replace('{fieldword}', ppick(['casting', 'post-production', 'a studio\'s development office', 'an agency', 'documentaries']));
  inbox('scene', s.title, text, { scene: s.id, ctx, choices: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) });
}
// A working day: a decent chance of a scene from your job's family, or from the shared life of a shoot.
function lifeDayEvent(act) {
  const M = S.me;
  if (act === 'work') {
    const j = M.jobs.length ? M.jobs[(S.week + M.wk.day) % M.jobs.length] : null;
    if (!j || prnd() > .38) return;
    const f = j.film !== null ? S.films[j.film] : null;
    const fam = familyOf(j), pool = (ROLE_SCENES[fam] || []).concat(f && f.stage === 2 ? ROLE_SCENES.set : []);
    const recent = new Set(M.inbox.filter(x => x.kind === 'scene' && S.week - x.w < 6).map(x => x.scene));
    const L = pool.filter(s => !recent.has(s.id));
    if (!L.length) return;
    const s = ppick(L);
    const ctx = { head: j.head, film: j.film, dir: f ? f.dir : null, lead: f ? f.cast[0] : null, dp: f ? f.dp : null, prod: f ? f.prod : null, mates: j.mates || [] };
    if (/\{(dir|lead|dp|prod)\}/.test(s.text + JSON.stringify(s.opts)) && !f) return;
    inbox('scene', s.title, fillScene(s.text, ctx), { job: j.id, scene: s.id, ctx, choices: s.opts.map(o => ({ k: o.k, label: fillScene(o.label, ctx), check: o.check })) });
    return;
  }
  if (LIFE_SCENES[act] && prnd() < .2) lifeScene(LIFE_SCENES[act]);
}
function lifeMorningEvent() { interviewToday(); }
function lifeEveningEvent(k) { if (k === 'out' && prnd() < .2) lifeScene(LIFE_SCENES.out); else if (prnd() < .03) maybeEvent(); }

// ---- interviews ----
// An application now goes to a shortlist; the interview is a scene where how you play it decides the offer.
function shortlistOdds(post) { return Math.min(.95, Math.sqrt(hireOdds(post)) * 1.05); }
function interviewToday() {
  const M = S.me, d = M.wk.day, iv = d < 5 && (M.interviews || []).find(x => x.day <= d && !x.done);
  if (!iv) return;
  iv.done = true;
  const post = iv.post, t = tmplOf(post), target = clamp(hireOdds(post) / shortlistOdds(post), .1, .95);
  const sub = t.subs[0], dc = st => { const m = checkMods(st).mod; return clamp(Math.round(20 - 20 * target + m), 4, 19); };
  const f = post.film !== null ? S.films[post.film] : null;
  const who = post.head !== null ? P(post.head).name : 'the hiring manager';
  inbox('interview', `Interview: ${post.t}`, `${who} sees you about ${post.t.toLowerCase()}${f ? ' on ' + f.title : ''}. Twenty minutes, a cold coffee and a long list of other candidates. How do you play it?`, { post, choices: [
    { k: 'craft', label: `Talk about the work: ${statLabel(sub).toLowerCase()}`, check: [sub, dc(sub)] },
    { k: 'charm', label: 'Charm them', check: ['cha', dc('cha')] },
    { k: 'honest', label: 'Be straight about what you don\'t know yet', check: ['com', dc('com') - 1] },
    ...(M.spec.drafts || ME().credits.length ? [{ k: 'show', label: ME().credits.length ? 'Talk them through your credits' : 'Leave them your spec script', check: ['tas', dc('tas') - 2] }] : [])] });
}
function resolveInterview(it, k) {
  const c = it.choices.find(x => x.k === k), ok = roll(c.check[0], c.check[1]), post = it.post;
  it.done = true;
  if (ok) { inbox('offer', `Offer: ${post.t}`, offerText(post), { post, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] }); S.me.stats.offers++; }
  else S.me.wk.stress += 2;
  it.result = { ok, roll: S.me.lastRoll, t: ok ? 'They call that evening. It\'s yours if you want it.' : pickLine(['They thank you for your time. You know what that means.', 'They went with someone with more experience.', 'You hear nothing, which is also an answer.'], post.id) };
}
