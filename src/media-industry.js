// ---------------- The wider industry: music, online video, podcasting, theatre ----------------
// Jobs, companies, the famous and the up-and-coming, charts, awards, contests and a century of history for the
// fields beyond film. The famous are parodies of real figures (as with film), active in their real years; everyone
// else is generated per city by hash, so it costs the world no dice.

// ---- jobs: rate is a day rate in 2027 dollars; fam picks the work tasks and on-the-job scenes ----
const FIELD_JOBS = [
  // music
  { k: 'f_runner_studio', t: 'Recording studio runner', field: 'music', fam: 'music', tier: 1, subs: ['eth', 'sound'], days: 4, rate: 120, weeks: 10, biz: 'Recording studio', d: 'Make tea, wrap cables, learn everything by watching.' },
  { k: 'f_asst_engineer', t: 'Assistant recording engineer', field: 'music', fam: 'music', tier: 1, subs: ['sound', 'eth'], days: 4, rate: 160, weeks: 14, biz: 'Recording studio', d: 'Set up mics, run the session file, fix what breaks.' },
  { k: 'f_session', t: 'Session musician', field: 'music', fam: 'music', tier: 2, subs: ['song', 'orch'], days: 2, rate: 280, weeks: 6, biz: 'Recording sessions', d: 'Play on other people\'s records. Read charts, nail it in two takes.' },
  { k: 'f_wedding_band', t: 'Function band player', field: 'music', fam: 'music', tier: 1, subs: ['song', 'pres'], days: 2, rate: 220, weeks: 12, biz: 'Weddings and parties', d: 'The same forty songs every Saturday. Steady money.' },
  { k: 'f_music_teacher', t: 'Music teacher (part-time)', field: 'music', fam: 'music', tier: 1, subs: ['theme', 'cha'], days: 2, rate: 170, weeks: 20, biz: 'Music school', d: 'Teach scales to children and rock songs to their parents.' },
  { k: 'f_backline', t: 'Touring backline technician', field: 'music', fam: 'music', tier: 2, subs: ['sound', 'eth'], days: 5, rate: 240, weeks: 6, biz: 'A band on tour', d: 'Guitars, drums and amps, set up and torn down in a new city every night.' },
  { k: 'f_ar_scout', co: 1, t: 'A&R scout', field: 'music', fam: 'music', tier: 2, subs: ['tas', 'talent'], days: 4, rate: 230, weeks: 16, biz: 'Record label', d: 'Go to every gig in town and find the next big thing before anyone else.' },
  { k: 'f_staff_writer', co: 1, t: 'Staff songwriter', field: 'music', fam: 'music', tier: 3, subs: ['song', 'theme'], days: 4, rate: 420, weeks: 20, biz: 'Music publisher', d: 'Co-writing sessions every day, chasing the one song that changes everything.' },
  { k: 'f_mix_engineer', t: 'Mix engineer', field: 'music', fam: 'music', tier: 4, subs: ['sound', 'score'], days: 4, rate: 650, weeks: 10, biz: 'Recording studio', d: 'Make records sound like records. Artists trust your ears.' },
  { k: 'f_music_director', t: 'Musical director (tour)', field: 'music', fam: 'music', tier: 4, subs: ['orch', 'cha'], days: 5, rate: 800, weeks: 8, biz: 'Arena tour', d: 'Run the band, the arrangements and the in-ears for a star\'s tour.' },
  // online video
  { k: 'f_thumbs', t: 'Thumbnail designer', field: 'creator', fam: 'creator', tier: 1, subs: ['comp', 'tas'], days: 2, rate: 120, weeks: 12, biz: 'Vidwire channel', d: 'Faces, arrows, big letters. The most important image nobody respects.' },
  { k: 'f_creator_editor', t: 'Video editor for a creator', field: 'creator', fam: 'creator', tier: 1, subs: ['rhythm', 'shape'], days: 4, rate: 190, weeks: 14, biz: 'Vidwire channel', d: 'Cut three videos a week to a creator\'s exacting rhythm.' },
  { k: 'f_mod', t: 'Livestream moderator', field: 'creator', fam: 'creator', tier: 1, subs: ['com', 'cha'], days: 3, rate: 100, weeks: 10, biz: 'Glowcast streamer', d: 'Keep the chat kind, the spam out and the streamer sane.' },
  { k: 'f_social', t: 'Social media manager', field: 'creator', fam: 'creator', tier: 2, subs: ['mkt', 'tas'], days: 5, rate: 260, weeks: 20, biz: 'Brand studio', d: 'Run a brand\'s Blip and Flick accounts. Be funny on deadline.' },
  { k: 'f_channel_producer', co: 1, t: 'Channel producer', field: 'creator', fam: 'creator', tier: 3, subs: ['vstory', 'pack'], days: 5, rate: 420, weeks: 20, biz: 'Creator studio', d: 'Plan, shoot and ship a big channel\'s weekly videos with a small team.' },
  { k: 'f_brand_content', co: 1, t: 'Branded content producer', field: 'creator', fam: 'creator', tier: 3, subs: ['mkt', 'vstory'], days: 5, rate: 460, weeks: 12, biz: 'Creator agency', d: 'Make ads that don\'t feel like ads, with creators who hate ads.' },
  { k: 'f_head_content', co: 1, t: 'Head of content (creator studio)', field: 'creator', fam: 'creator', tier: 4, subs: ['pack', 'tas'], days: 5, rate: 700, weeks: 30, biz: 'Creator studio', d: 'Decide what a channel with millions of subscribers makes next.' },
  // podcasting
  { k: 'f_pod_editor', t: 'Podcast audio editor', field: 'podcast', fam: 'podcast', tier: 1, subs: ['sound', 'rhythm'], days: 3, rate: 150, weeks: 16, biz: 'Podcast studio', d: 'Cut the ums, level the guests, make two hours feel like forty minutes.' },
  { k: 'f_pod_booker', co: 1, t: 'Podcast booker', field: 'podcast', fam: 'podcast', tier: 2, subs: ['cha', 'talent'], days: 4, rate: 230, weeks: 16, biz: 'Podcast network', d: 'Find guests, charm their publicists, fill the calendar.' },
  { k: 'f_pod_producer', co: 1, t: 'Podcast producer', field: 'podcast', fam: 'podcast', tier: 2, subs: ['struc', 'voice'], days: 5, rate: 290, weeks: 20, biz: 'Podcast network', d: 'Research, script and run a weekly show for a host who improvises.' },
  { k: 'f_pod_narrative', co: 1, t: 'Narrative podcast producer', field: 'podcast', fam: 'podcast', tier: 3, subs: ['struc', 'dial'], days: 5, rate: 430, weeks: 24, biz: 'Audio studio', d: 'Report, interview and build an investigative series episode by episode.' },
  { k: 'f_pod_host', co: 1, t: 'Host (network show)', field: 'podcast', fam: 'podcast', tier: 4, subs: ['voice', 'cha'], days: 3, rate: 750, weeks: 30, biz: 'Podcast network', d: 'Your voice in a million ears every week, and an ad read in the middle.' },
  // theatre
  { k: 'f_usher_theatre', co: 1, t: 'Theatre usher', field: 'stage', fam: 'stage', tier: 1, subs: ['tas', 'com'], days: 4, rate: 110, weeks: 12, biz: 'Theatre', d: 'Watch the same show a hundred times from the back. Learn how it works.' },
  { k: 'f_box_office', co: 1, t: 'Box office assistant', field: 'stage', fam: 'stage', tier: 1, subs: ['eth', 'cha'], days: 4, rate: 120, weeks: 14, biz: 'Theatre', d: 'Sell seats, sort comps, calm people who booked the wrong night.' },
  { k: 'f_asm', co: 1, t: 'Assistant stage manager', field: 'stage', fam: 'stage', tier: 2, subs: ['setm', 'eth'], days: 6, rate: 220, weeks: 10, biz: 'Theatre company', d: 'Props tables, prompt copy, quick changes in the dark.' },
  { k: 'f_ensemble', co: 1, t: 'Ensemble member (musical)', field: 'stage', fam: 'stage', tier: 2, subs: ['song', 'phys'], days: 6, rate: 300, weeks: 16, biz: 'Musical production', d: 'Eight shows a week, three costume changes a night, one understudy line.' },
  { k: 'f_lx', co: 1, t: 'Theatre lighting technician', field: 'stage', fam: 'stage', tier: 2, subs: ['light', 'eth'], days: 5, rate: 240, weeks: 10, biz: 'Theatre', d: 'Focus the rig, run the board, fix the lamp that blew at the interval.' },
  { k: 'f_stage_manager', co: 1, t: 'Stage manager', field: 'stage', fam: 'stage', tier: 3, subs: ['setm', 'com'], days: 6, rate: 380, weeks: 12, biz: 'Theatre company', d: 'Call the show. Every cue, every night, from the prompt corner.' },
  { k: 'f_dramaturg', co: 1, t: 'Literary associate / dramaturg', field: 'stage', fam: 'stage', tier: 3, subs: ['struc', 'tas'], days: 4, rate: 330, weeks: 20, biz: 'Theatre', d: 'Read the scripts, find the voices, sharpen the new plays.' },
  { k: 'f_resident_director', co: 1, t: 'Resident director', field: 'stage', fam: 'stage', tier: 4, subs: ['dact', 'stag'], days: 6, rate: 520, weeks: 24, biz: 'Long-running musical', d: 'Keep a hit show as sharp in year three as it was on opening night.' }
];
for (const j of FIELD_JOBS) { ODD_JOBS.push(j); ODD_BY[j.k] = j; }
// a few field jobs each week; more of your own field's, and more as you rise
function fieldPosts() {
  const M = S.me, L = tierLevel(), out = [];
  const fit = t => t.tier <= L + 1 && (t.tier >= L - 2 || t.tier === 0) && !M.jobs.some(j => j.k === t.k) && (t.field !== 'creator' || platOpen('vidwire')) && (t.field !== 'podcast' || platOpen('podhaus'));
  const mine = FIELD_JOBS.filter(t => fit(t) && t.field === M.field), other = FIELD_JOBS.filter(t => fit(t) && t.field !== M.field);
  const n = (M.field && M.field !== 'film' ? 2 : 1) + (prnd() < .5 ? 1 : 0);   // other industries always post a few: people cross over
  for (let i = 0; i < n; i++) { const pool = mine.length && (i < 2 || prnd() < .5) ? mine : other; if (!pool.length) continue; const t = ppick(pool), p = makePost(t, null); if (t.co) p.mco = mediaCoFor(t.field, M.hub, p.id); out.push(p); }
  return out;
}
// ---- the work itself, for the new families ----
Object.assign(JOB_TASKS, {
  music: [['Set up the live room for a drum session', 'eth', 0], ['Label and comp the vocal takes', 'sound', 0], ['Learn the set list by Friday', 'song', 0], ['Lay down a guitar part in two takes', 'song', 1], ['Arrange the strings for the bridge', 'orch', 1], ['Mix the single', 'sound', 2], ['Produce the album\'s lead track', 'score', 2]],
  creator: [['Cut a sixty-second version for Blip', 'rhythm', 0], ['Design three thumbnails to test', 'comp', 0], ['Moderate a three-hour stream', 'com', 0], ['Script the week\'s big video', 'struc', 1], ['Shoot a brand integration that doesn\'t feel like one', 'pres', 1], ['Plan a month of uploads around a trend', 'tas', 2], ['Pitch the channel\'s first series to a streamer', 'pack', 2]],
  podcast: [['Edit a two-hour interview down to fifty minutes', 'rhythm', 0], ['Book three guests for next month', 'cha', 0], ['Write the show notes and chapter marks', 'eth', 0], ['Research and outline an episode', 'struc', 1], ['Record a tricky remote interview', 'voice', 1], ['Structure a six-part investigative series', 'struc', 2], ['Host the live show in front of an audience', 'cha', 2]],
  stage: [['Set the props table before the half', 'eth', 0], ['Run the quick change in the dark', 'phys', 0], ['Cover the understudy rehearsal', 'range', 1], ['Focus the lighting rig for a new show', 'light', 1], ['Call the show on press night', 'com', 2], ['Rehearse a new cast into a long-running hit', 'dact', 2]]
});
const FIELD_SCENES = {
  music: [
    { id: 'fm_diva', title: 'The star is late', text: 'The artist is three hours late to their own session. The studio clock is running at the label\'s expense.', teach: 'Recording studios bill by the hour or day; labels advance recording costs to artists, who then pay them back out of royalties before earning a penny.', opts: [
      { k: 'use', label: 'Use the time: get the band tracked', check: ['orch', 12], ok: { tie: { head: 5 }, stand: .3 }, bad: { tie: { head: -2 } }, t: 'By the time the star arrives the backing track is finished and great. They act like it was their idea.', tb: 'The band can\'t agree on the tempo without the star. Three hours, nothing usable.' },
      { k: 'wait', label: 'Wait it out', ok: { stress: 2 }, t: 'Tea, phones, a game of cards. The session starts at 5 p.m. and ends at 4 a.m.' }] },
    { id: 'fm_credit', title: 'The co-write', text: 'In a writing session, your melody becomes the chorus. The split sheet everyone signs gives you nothing.', teach: 'Songwriters agree "splits" (who owns what percentage of a song) at the session, on paper. Splits decide who gets paid for decades; arguing later rarely works.', opts: [
      { k: 'speak', label: 'Ask for a fair split before signing', check: ['cha', 12], ok: { cash: 300, stand: .3, flag: 'honest' }, bad: { tie: { head: -4 } }, t: 'A pause, then: "fair enough, twenty percent." That twenty percent pays your rent for a year when the song charts.', tb: 'The room cools. You\'re not invited back.' },
      { k: 'sign', label: 'Sign it; you\'ll get the next one', ok: { tie: { head: 3 } }, t: 'They like working with you. The song goes on to be a hit. You hear it in a supermarket.' }] },
    { id: 'fm_gig', title: 'Twelve people', text: 'Your band\'s headline gig. Twelve people came, four of them your friends.', opts: [
      { k: 'play', label: 'Play like it\'s a stadium', check: ['pres', 11], ok: { stress: -3, meet: 1 }, bad: { stress: 2 }, t: 'One of the eight strangers books acts for a festival. She takes your number.', tb: 'It feels hollow. You go home early.' },
      { k: 'short', label: 'Play a short set and go drinking', ok: { stress: -2, tie: { mates: 2 } }, t: 'A great night, just not on stage.' }] }
  ],
  creator: [
    { id: 'fc_comments', title: 'The comments', text: 'A video you edited is getting thousands of comments, and a lot of them are about the editing.', teach: 'Online video lives on retention: the share of viewers still watching at each second. Editors chase it with pace, jump cuts and pattern breaks, and the analytics show exactly where people leave.', opts: [
      { k: 'read', label: 'Read the retention graph, not the comments', check: ['rhythm', 11], ok: { xp: { rhythm: .1 }, tie: { head: 3 } }, bad: { stress: 2 }, t: 'Viewers left at 2:14 every time. You fix that beat in the next one and watch time jumps.', tb: 'The graph tells you nothing you can use.' },
      { k: 'reply', label: 'Reply to the critics', ok: { stress: 3, stand: -.2 }, t: 'Never reply to the critics.' }] },
    { id: 'fc_sponsor', title: 'The sponsor', text: 'The channel\'s sponsor wants their product in the first thirty seconds. The creator wants to quit.', teach: 'Sponsorships pay most creators more than ads do; platforms and advertising rules require that paid placements be clearly labelled.', opts: [
      { k: 'creative', label: 'Pitch a way to make the ad part of the joke', check: ['vstory', 12], ok: { tie: { head: 5 }, stand: .3 }, bad: { tie: { head: -2 } }, t: 'The ad becomes the most-liked part of the video. The sponsor renews for a year.', tb: 'The sponsor doesn\'t find it funny.' },
      { k: 'flat', label: 'Do it straight and move on', ok: {}, t: 'Thirty seconds of honest reading. Everyone survives.' }] }
  ],
  podcast: [
    { id: 'fp_guest', title: 'The guest who won\'t stop', text: 'Your guest has talked for forty minutes about their diet. The host is looking at you through the glass.', opts: [
      { k: 'note', label: 'Slide the host a note with a better question', check: ['struc', 11], ok: { tie: { head: 4 } }, bad: {}, t: 'One question, and the guest tells the story everyone will clip. Episode saved.', tb: 'The host reads your note aloud by accident.' },
      { k: 'edit', label: 'Fix it in the edit', ok: { energy: -6 }, t: 'Forty minutes become four. It takes you all night.' }] },
    { id: 'fp_ads', title: 'The ad read', text: 'The host refuses to read an ad for a product they think is a scam. It\'s the network\'s biggest advertiser.', teach: 'Host-read ads are the backbone of podcast money: listeners trust the host, so advertisers pay more for them, and hosts guard that trust.', opts: [
      { k: 'back', label: 'Back the host', ok: { tie: { head: 4 }, flag: 'honest', stand: .2 }, t: 'The network grumbles and finds another slot for the ad. The listeners never knew, and that was the point.' },
      { k: 'push', label: 'Persuade them to read it', check: ['cha', 13], ok: { tie: { head: -2 }, cash: 150 }, bad: { tie: { head: -5 } }, t: 'They read it, flat as a pancake. The advertiser is happy anyway.', tb: 'The host walks out of the booth.' }] }
  ],
  stage: [
    { id: 'fs_understudy', title: 'You\'re on', text: 'Half an hour to curtain, the lead has lost their voice, and you\'re the understudy who has rehearsed this twice.', teach: 'Understudies learn a role but rarely rehearse it on stage; going on with half an hour\'s notice is a rite of passage, and some careers start that night.', opts: [
      { k: 'go', label: 'Go on and own it', check: ['range', 13], ok: { stand: 1, fame: 2, meet: 1 }, bad: { stress: 5 }, t: 'A standing ovation, and a critic happened to be in. Your name is in the paper on Sunday.', tb: 'You get through it. Just. The company hugs you anyway.' },
      { k: 'safe', label: 'Play it safe and exactly as rehearsed', ok: { tie: { head: 3 } }, t: 'Solid, clean, forgettable. The stage manager thanks you.' }] },
    { id: 'fs_set', title: 'The set won\'t move', text: 'In the middle of act two, the revolving stage stops revolving.', opts: [
      { k: 'fix', label: 'Get backstage and fix it', check: ['prac', 12], ok: { tie: { head: 5 } }, bad: { stress: 3 }, t: 'A jammed wheel, a crowbar, ninety seconds. The audience thinks it was a dramatic pause.', tb: 'The show stops. The house lights come up. "Ladies and gentlemen…"' },
      { k: 'improv', label: 'Signal the actors to play the scene where they are', check: ['impro', 11], ok: { tie: { mates: 3 } }, bad: {}, t: 'They play it downstage, closer to the audience. It\'s better.', tb: 'Two actors walk into each other.' }] }
  ]
};
for (const fam in FIELD_SCENES) { (ROLE_SCENES[fam] = ROLE_SCENES[fam] || []).push(...FIELD_SCENES[fam]); for (const s of FIELD_SCENES[fam]) SCENES.push(Object.assign({ role: fam, jobs: [] }, s)); }

// ---- companies: labels, networks, studios and theatres ----
const MEDIA_COS = [
  { n: 'Omniversal Music Group', type: 'label', hub: 'hollywood', tier: 1, f: 1934, d: 'The biggest record company on earth, built from a century of mergers.' },
  { n: 'Sunny Music', type: 'label', hub: 'newyork', tier: 1, f: 1929, d: 'A major with a catalogue reaching back to the first recorded jazz.' },
  { n: 'Warden Records', type: 'label', hub: 'hollywood', tier: 1, f: 1958, d: 'Started as a film studio\'s soundtrack arm; now a pop powerhouse.' },
  { n: 'Rough Grade Records', type: 'label', hub: 'london', tier: 3, f: 1978, d: 'A shop that became a label that became a legend of independent music.' },
  { n: 'XXL Recordings', type: 'label', hub: 'london', tier: 2, f: 1989, d: 'Small roster, enormous hits. Famous for letting artists be strange.' },
  { n: 'Sub Pebble', type: 'label', hub: 'newyork', tier: 3, f: 1986, d: 'The label that sold flannel to the world, then went broke, then didn\'t.' },
  { n: 'HIVE Labels', type: 'label', hub: 'seoul', tier: 1, f: 2005, d: 'A K-pop agency that turned trainee systems into global fandoms.' },
  { n: 'SN Entertainment', type: 'label', hub: 'seoul', tier: 1, f: 1995, d: 'The company that built the idol system everyone else copied.' },
  { n: 'Maven Records', type: 'label', hub: 'lagos', tier: 2, f: 2012, d: 'The Lagos label behind half the Afrobeats you\'ve danced to.' },
  { n: 'Cocoa City Sound', type: 'label', hub: 'lagos', tier: 2, f: 2005, d: 'Hip-hop and Afropop from Lagos to the world.' },
  { n: 'Saregam Music', type: 'label', hub: 'mumbai', tier: 1, f: 1901, d: 'India\'s oldest music company: the gramophone records of a century of film songs.' },
  { n: 'Tips & Tunes', type: 'label', hub: 'mumbai', tier: 2, f: 1975, d: 'Film soundtracks and cassettes, then streams.' },
  { n: 'Apex Trax', type: 'label', hub: 'tokyo', tier: 1, f: 1988, d: 'Dance music and J-pop idols, from Tokyo clubs to stadiums.' },
  { n: 'Cosmos Discos', type: 'label', hub: 'mexico', tier: 2, f: 1970, d: 'Rancheras, boleros and the best-selling pop in Spanish.' },
  { n: 'Biscoito Doce Discos', type: 'label', hub: 'rio', tier: 3, f: 2000, d: 'Samba and bossa nova, lovingly recorded.' },
  { n: 'Head Banger Records', type: 'label', hub: 'paris', tier: 3, f: 2003, d: 'French touch and electro, cool since the first night.' },
  { n: 'Fifty-Fifty Publishing', type: 'publisher', hub: 'hollywood', tier: 2, f: 1962, d: 'Songs placed in films, ads and trailers since the sixties.' },
  { n: 'Earful Network', type: 'podcast', hub: 'hollywood', tier: 1, f: 2016, d: 'True crime, comedy and celebrity chat: the biggest podcast network on the charts.' },
  { n: 'Wonderly Audio', type: 'podcast', hub: 'hollywood', tier: 2, f: 2016, d: 'Narrative history and business stories, binge-shaped.' },
  { n: 'iBeat Podcasts', type: 'podcast', hub: 'newyork', tier: 1, f: 2014, d: 'Radio\'s giant, reinvented for earbuds.' },
  { n: 'The Gimlet Room', type: 'podcast', hub: 'newyork', tier: 3, f: 2014, d: 'A podcast company that made a podcast about starting a podcast company.' },
  { n: 'Broad Signal Audio', type: 'podcast', hub: 'london', tier: 3, f: 2017, d: 'British comedy and documentary podcasts with public-radio manners.' },
  { n: 'Creator Collective', type: 'creator', hub: 'hollywood', tier: 2, f: 2009, d: 'A network that signs Vidwire channels and sells their ads.' },
  { n: 'Beast Mode Studios', type: 'creator', hub: 'newyork', tier: 1, f: 2018, d: 'The world\'s biggest channel turned into a company with hundreds of staff.' },
  { n: 'Sidekicks Media', type: 'creator', hub: 'london', tier: 2, f: 2013, d: 'Seven friends, one channel, an empire of merch.' },
  { n: 'Seoul Shorts Lab', type: 'creator', hub: 'seoul', tier: 3, f: 2019, d: 'A Blip studio that makes dance challenges for idols.' },
  { n: 'Lagos Laughs', type: 'creator', hub: 'lagos', tier: 3, f: 2016, d: 'Skit comedy from Lagos, filmed on phones, watched by millions.' },
  { n: 'Bollyshorts', type: 'creator', hub: 'mumbai', tier: 3, f: 2020, d: 'Short-form drama in Hindi, made in a day, watched across India.' },
  { n: 'The National Stage', type: 'theatre', hub: 'london', tier: 1, f: 1963, d: 'The country\'s national theatre, on the South Bank, three stages under one roof.' },
  { n: 'The Old Victoria', type: 'theatre', hub: 'london', tier: 2, f: 1818, d: 'Two centuries old and still where the great actors want to play.' },
  { n: 'The Royal Bard Company', type: 'theatre', hub: 'london', tier: 1, f: 1961, d: 'Shakespeare and new writing, in a market town and in the capital.' },
  { n: 'The Shubertine Organization', type: 'theatre', hub: 'newyork', tier: 1, f: 1900, d: 'Owns half of Broadway\'s theatres and decides what goes in them.' },
  { n: 'Public Square Theater', type: 'theatre', hub: 'newyork', tier: 2, f: 1954, d: 'Free summer Shakespeare in the park, and the musical that changed everything.' },
  { n: 'Steppen Wolf Theatre Co.', type: 'theatre', hub: 'newyork', tier: 2, f: 1974, d: 'Ensemble theatre with muscle; its actors went to Hollywood and came back.' },
  { n: 'Théâtre du Soleil Levant', type: 'theatre', hub: 'paris', tier: 2, f: 1964, d: 'A collective that builds epics in a former munitions factory.' },
  { n: 'Takaramoto Grand Revue', type: 'theatre', hub: 'tokyo', tier: 1, f: 1914, d: 'An all-female musical revue with its own school and fans who queue for days.' },
  { n: 'Prithvika Playhouse', type: 'theatre', hub: 'mumbai', tier: 3, f: 1978, d: 'A small, beloved theatre in Juhu where film stars do plays for the love of it.' },
  { n: 'Terra Brasilis Teatro', type: 'theatre', hub: 'rio', tier: 3, f: 1982, d: 'New Brazilian plays in a converted warehouse.' }
];
const MCO_TYPE = { label: 'Record label', publisher: 'Music publisher', podcast: 'Podcast network', creator: 'Creator studio', theatre: 'Theatre company' };
function mediaCoFor(field, hub, salt) {
  const want = { music: ['label', 'publisher'], creator: ['creator'], podcast: ['podcast'], stage: ['theatre'] }[field] || [];
  const L = MEDIA_COS.filter(c => want.includes(c.type) && c.f <= S.year), here = L.filter(c => c.hub === hub);
  const pool = here.length ? here : L;
  return pool.length ? pool[(salt * 2654435761 >>> 0) % pool.length].n : null;
}
// ---- the famous: parodies of real figures, active in their real years ----
const MEDIA_LEGENDS = [
  ['Johnny Cache', 'music', 'singer', 'hollywood', 1955, 2003], ['Bob Dillon', 'music', 'singer', 'newyork', 1961, 2030], ['Aretha Franklean', 'music', 'singer', 'newyork', 1960, 2018], ['The Beadles', 'music', 'band', 'london', 1962, 1970], ['The Rolling Scones', 'music', 'band', 'london', 1962, 2030], ['Dolly Partin', 'music', 'singer', 'hollywood', 1967, 2030],
  ['David Bowey', 'music', 'singer', 'london', 1969, 2016], ['Queeen', 'music', 'band', 'london', 1973, 1991], ['Michael Jaxon', 'music', 'singer', 'hollywood', 1971, 2009], ['Prints', 'music', 'singer', 'hollywood', 1978, 2016], ['Madonnah', 'music', 'singer', 'newyork', 1983, 2030], ['Whitney Houseton', 'music', 'singer', 'newyork', 1985, 2012],
  ['Nirvanna', 'music', 'band', 'hollywood', 1988, 1994], ['Radiohed', 'music', 'band', 'london', 1993, 2030], ['Jay-Zed', 'music', 'rapper', 'newyork', 1996, 2030], ['Beyonsay', 'music', 'singer', 'hollywood', 1997, 2030], ['Amy Winemouse', 'music', 'singer', 'london', 2003, 2011], ['Tay Swiftwater', 'music', 'singer', 'hollywood', 2006, 2030],
  ['Adelle', 'music', 'singer', 'london', 2008, 2030], ['Kendrik Lamarr', 'music', 'rapper', 'hollywood', 2011, 2030], ['Billie Eyelash', 'music', 'singer', 'hollywood', 2016, 2030], ['Bangtan Boyz', 'music', 'band', 'seoul', 2013, 2030], ['BLACKPINQ', 'music', 'band', 'seoul', 2016, 2030], ['Sigh', 'music', 'singer', 'seoul', 2001, 2030],
  ['Fela Kootie', 'music', 'singer', 'lagos', 1970, 1997], ['Burna Bwoy', 'music', 'singer', 'lagos', 2012, 2030], ['Wizkidd', 'music', 'singer', 'lagos', 2010, 2030], ['Temz', 'music', 'singer', 'lagos', 2019, 2030], ['Lata Mangeskar', 'music', 'singer', 'mumbai', 1945, 2022], ['Kishore Kumarr', 'music', 'singer', 'mumbai', 1950, 1987],
  ['A.R. Rahmaan', 'music', 'composer', 'chennai', 1992, 2030], ['Arijit Singhh', 'music', 'singer', 'mumbai', 2011, 2030], ['Utada Hikaro', 'music', 'singer', 'tokyo', 1998, 2030], ['Yellow Magic Orchestrata', 'music', 'band', 'tokyo', 1978, 1993], ['Edith Piaff', 'music', 'singer', 'paris', 1935, 1963], ['Serge Gainsborrow', 'music', 'singer', 'paris', 1958, 1991],
  ['Daft Punque', 'music', 'band', 'paris', 1993, 2021], ['Juan Gabriell', 'music', 'singer', 'mexico', 1971, 2016], ['Antonio Carlos Jobeam', 'music', 'composer', 'rio', 1958, 1994], ['Anitah', 'music', 'singer', 'rio', 2012, 2030], ['ABBBA', 'music', 'band', 'stockholm', 1972, 1982], ['Robbyn', 'music', 'singer', 'stockholm', 1995, 2030],
  ['Andrew Lloyd Weaver', 'stage', 'composer', 'london', 1971, 2030], ['Stephen Sondheimer', 'stage', 'composer', 'newyork', 1957, 2021], ['Lin-Manuel Marinara', 'stage', 'composer', 'newyork', 2008, 2030], ['Caryl Churchyard', 'stage', 'playwright', 'london', 1972, 2030], ['August Wilsen', 'stage', 'playwright', 'newyork', 1982, 2005], ['Tom Stoppered', 'stage', 'playwright', 'london', 1966, 2030],
  ['MrBeest', 'creator', 'creator', 'newyork', 2012, 2030], ['PewDieGuy', 'creator', 'creator', 'stockholm', 2010, 2030], ['Lilly Single', 'creator', 'creator', 'toronto', 2010, 2030], ['Khaby Lamed', 'creator', 'blipper', 'rome', 2020, 2030], ['Charli D\'Amore', 'creator', 'blipper', 'hollywood', 2019, 2030], ['Mark Robber', 'creator', 'creator', 'hollywood', 2011, 2030],
  ['This Nation\'s Life', 'podcast', 'show', 'newyork', 1995, 2030], ['Cereal', 'podcast', 'show', 'newyork', 2014, 2030], ['The Joe Brogan Experience', 'podcast', 'show', 'hollywood', 2009, 2030], ['Call Her Mummy', 'podcast', 'show', 'newyork', 2018, 2030], ['My Dad Wrote a Thriller', 'podcast', 'show', 'london', 2015, 2030], ['Stuff You Oughta Know', 'podcast', 'show', 'newyork', 2008, 2030]
];
// ---- everyone else: generated per city by hash ----
const BAND_A = ['The', 'Glass', 'Velvet', 'Paper', 'Silver', 'Night', 'Neon', 'Electric', 'Little', 'Golden', 'Wild', 'Static'], BAND_B = ['Animals', 'Lanterns', 'Ghosts', 'Machines', 'Daughters', 'Kings', 'Signals', 'Mirrors', 'Rivers', 'Strangers', 'Hearts', 'Moons'];
const SHOW_A = ['The Late', 'Two Idiots', 'Deep', 'The Daily', 'Not Another', 'Something', 'The Long', 'Very Online', 'Quiet', 'Off the Record'], SHOW_B = ['Hour', 'Talk', 'Dive', 'Show', 'Pod', 'Conversation', 'Briefing', 'Club', 'Hours', 'Tape'];
function mediaFigures(hub) {
  S.mfig = S.mfig || {};
  if (S.mfig[hub]) return S.mfig[hub];
  const H = HUBS[hub], N = NAMES[H.lang] || NAMES.en, r = hashRand(HUB_IDS.indexOf(hub) * 7919 + S.seed);
  const pick = L => L[Math.floor(r() * L.length)], out = [];
  for (let i = 0; i < 24; i++) {
    const field = ['music', 'music', 'music', 'creator', 'creator', 'podcast', 'stage'][Math.floor(r() * 7)];
    const kind = field === 'music' ? pick(['singer', 'band', 'rapper', 'dj']) : field === 'creator' ? pick(['creator', 'blipper']) : field === 'podcast' ? 'show' : pick(['playwright', 'composer']);
    const person = `${pick(N.F.concat(N.M))} ${pick(N.L)}`;
    const name = kind === 'band' ? `${pick(BAND_A)} ${pick(BAND_B)}` : kind === 'dj' ? `DJ ${pick(N.L)}` : kind === 'show' ? `${pick(SHOW_A)} ${pick(SHOW_B)}` : person;
    out.push({ name, field, kind, hub, fans: Math.round(Math.pow(10, 3 + r() * 3.4)), from: (S.startYear || S.year) - Math.floor(r() * 12) });   // fixed by the world, not by when you first look
  }
  for (const [name, field, kind, h, from, to] of MEDIA_LEGENDS) if (h === hub || (HUBS[h] && HUBS[h].m === H.m && !HUBS[hub].lang.localeCompare(HUBS[h].lang))) out.push({ name, field, kind, hub: h, fans: 4e6 + (name.length * 7919 % 9) * 1e6, from, to, legend: 1 });
  if (typeof moreFigures === 'function') out.push(...moreFigures(hub, out));
  return (S.mfig[hub] = out);
}
function activeFigures(hub, field) { return mediaFigures(hub).filter(x => (!field || x.field === field) && x.from <= S.year && (!x.to || x.to >= S.year)); }
// ---- weekly charts: the city's figures, ranked by fans and a weekly hash; your releases if they're big enough ----
function chartFor(field, hub) {
  if (typeof chartAt === 'function') return chartAt(field, hub, S.week, 10);
  const M = S.me, all = mediaFigures(hub), L = activeFigures(hub, field).map(x => { const r = hashRand((x.name.length * 131 + S.week) * 7 + x.fans % 97)(); return { name: x.name, by: x.kind, score: x.fans * (.4 + r), title: workTitleFor(x, S.week), fid: `${hub}~${all.indexOf(x)}`, slot: Math.floor(S.week / 6) }; });
  const plat = { music: 'spinly', creator: 'vidwire', podcast: 'podhaus' }[field];
  if (M && plat) for (const w of (M.works || []).filter(w => WORK_TYPES[w.type].field === field && w.wk && w.wk.length && S.week - w.rel < 8)) L.push({ name: ME().name, by: 'you', score: w.wk[w.wk.length - 1] * 8, title: w.title, mine: 1 });
  return L.sort((a, b) => b.score - a.score).slice(0, 10);
}
// Titles are seeded by the whole name (not its length), so two acts never share a discography.
const WT_SOLO = ['Tell Me Twice', 'All Night Long Again', 'Don\'t Look Back Now', 'Slow Burn', 'Wildfire', 'Heartbeat Avenue', 'Overgrown', 'Satellite', 'Undertow', 'Afterglow', 'Holding Pattern', 'Paper Planes and Promises', 'Say It Like You Mean It', 'Rearview', 'Daylight Robbery', 'Fever Dream', 'Bad Habits, Good Intentions', 'Lighthouse', 'The Long Way Home', 'Sugar on the Radio', 'Cold Water', 'Wrong Number', 'Dance Like Nobody\'s Filming', 'Gravity', 'Old Flames', 'Cheap Champagne', 'Ten Feet Tall', 'Heavy Weather', 'Last Bus Home', 'Glow', 'Hurricane Season', 'Velvet Underground Car Park', 'Kiss the Sky Goodbye', 'Postcards', 'Fool\'s Gold', 'Static Love', 'Moonlighting', 'Nobody\'s Business', 'Sweet Disaster', 'Copper Sun'];
const PLAY_A = ['The Glass', 'The Last', 'A Winter', 'The Lonely', 'The House of', 'The Ballad of', 'Death of a', 'The Importance of', 'Waiting for', 'A Streetcar Called', 'Cat on a Hot', 'The Night of the'];
const PLAY_B = ['Mechanic', 'Salesgirl', 'Tin Shed', 'Gordon', 'Desire', 'Ironing', 'Lear', 'Bernarda', 'Being Elsewhere', 'Rain', 'Harbour', 'Orchard', 'Sisters', 'Garden', 'Ferryman', 'Inheritance'];
function nameHash(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function workTitleFor(x, w) {
  if (x.field === 'podcast') return x.name;
  const r = hashRand(nameHash(x.name) % 1e7 * 13 + Math.floor(w / 6) * 977), f = r(), pk = L => L[Math.floor(r() * L.length)];
  if (x.field === 'stage') return f < .7 ? `${pk(PLAY_A)} ${pk(PLAY_B)}` : pk(WT_SOLO);
  return f < .5 ? `${pk(WT_A)} ${pk(WT_B)}` : f < .85 ? pk(WT_SOLO) : `${pk(WT_A)} ${pk(WT_B)} (${pk(['Live', 'Remix', 'Acoustic', 'Radio Edit', 'Reprise', 'Night Version'])})`;
}
function viewCharts() {
  const hub = S.me ? S.me.hub : 'hollywood', F = [['music', `${platName('spinly')} top ten`], ['creator', `${platName('vidwire')} trending`], ['podcast', `${platName('podhaus')} top shows`], ['stage', 'On stage now']];
  return `<div class="head"><h2>Charts</h2><p class="lede">What ${esc(HUBS[hub].name)} is listening to, watching and queuing for this week. Your own releases chart if enough people find them.</p></div>
   <div class="cols two">${F.filter(([f]) => f !== 'creator' || platOpen('vidwire')).map(([f, lab]) => { const C = chartFor(f, hub); return `<section class="panel"><h3><a href="#" class="lk" data-go="chart:${f}~${hub}">${esc(lab)} ›</a></h3><ol class="chart">${C.map((c, i) => `<li${c.mine ? ' class="mine"' : ''}><span class="cn">${i + 1}</span><span><b>${c.fid ? `<a href="#" class="lk" data-go="${f === 'podcast' ? 'fig:' + c.fid : 'song:' + c.fid + '~' + c.slot}">${esc(f === 'podcast' ? c.name : c.title)}</a>` : esc(f === 'podcast' ? c.name : c.title)}</b><br><span class="muted small">${f === 'podcast' ? (c.mine ? 'your show' : 'podcast') : c.fid ? `<a href="#" class="lk" data-go="fig:${c.fid}">${esc(c.name)}</a>` : esc(c.name)}${c.mine ? ' (you)' : ''}</span></span></li>`).join('') || '<li class="muted">Nothing charting.</li>'}</ol></section>`; }).join('')}</div>
   <section class="panel"><h3>Companies in these fields</h3><div class="tw"><table class="grid"><thead><tr><th>Company</th><th>Type</th><th>Based in</th><th>Since</th><th></th></tr></thead><tbody>${MEDIA_COS.filter(c => c.f <= S.year).map(c => `<tr><td><b><a href="#" class="lk" data-go="mco:${MEDIA_COS.indexOf(c)}">${esc(c.n)}</a></b></td><td>${esc(MCO_TYPE[c.type])}</td><td>${esc(hubName(c.hub))}</td><td>${c.f}</td><td class="small muted">${esc(c.d)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
// ---- awards for the other fields, every January ----
const MEDIA_AWARDS = { music: ['The Gramophones', ['Song of the Year', 'Best New Artist', 'Album of the Year']], stage: ['The Footlights', ['Best New Play', 'Best Musical', 'Best Performance']], podcast: ['The Golden Mics', ['Podcast of the Year', 'Best New Show']], creator: ['The Vidwire Creator Awards', ['Creator of the Year', 'Breakout Creator']] };
function mediaAwardsWeek() {
  const M = S.me, me = ME(); if (!M || dateOf(S.week).getUTCMonth() !== 0 || M.mAwY === S.year) return;
  M.mAwY = S.year; const y = S.year - 1;
  for (const f in MEDIA_AWARDS) {
    const [show, cats] = MEDIA_AWARDS[f];
    if (f === 'creator' && !platOpen('vidwire')) continue;
    const mine = (M.works || []).filter(w => WORK_TYPES[w.type].field === f && yearOf(w.rel) === y).sort((a, b) => b.q * Math.log10(10 + b.units) - a.q * Math.log10(10 + a.units))[0];
    const winners = cats.map((c, i) => { const L = activeFigures(M.hub, f).concat(...HUB_IDS.filter(h => h !== M.hub && HUBS[h].m === 'US').slice(0, 2).map(h => activeFigures(h, f))); const x = L[Math.floor(hashRand(y * 31 + i * 7 + f.length)() * Math.max(1, L.length))]; return [c, x ? x.name : '—']; });
    let line = winners.map(([c, n]) => `${c}: ${n}`).join(' · ');
    if (mine && mine.q >= 72 && mine.units >= (f === 'stage' ? 400 : 20000)) {
      const won = prnd() < (mine.q - 65) / 60;
      if (won) { me.standing = clamp(me.standing + 4, 0, 100); me.fame = clamp((me.fame || 0) + 4, 0, 100); milestone(`Won at ${show}: ${cats[0]} for ${mine.title}`, 'prize'); line = `${cats[0]}: ${me.name}, for ${mine.title}! · ` + line.split(' · ').slice(1).join(' · '); }
      inbox('news', `${show} ${y}: ${won ? 'you won' : 'you were nominated'}`, `${mine.title} was nominated for ${cats[0]}.${won ? ' And it won. You make a speech you won\'t remember.' : ' You don\'t win, but the nomination goes on every bio you\'ll ever write.'}`);
      if (!won) me.standing = clamp(me.standing + 1.5, 0, 100);
    }
    (S.mawards = S.mawards || []).push({ y, show, w: line.split(' · ').map(x => [x.split(': ')[0], x.split(': ').slice(1).join(': ')]) });
    news('Award', `${show} ${y}: ${line}.`, {});
  }
}
// ---- contests for the new fields ----
COMPS.push(
  { k: 'songprize', cat: 'music', tier: 'major', name: 'The International Songwriting Prize', month: 5, fee: 35, stat: 'song', dc: 17, prize: 25000, stand: 4, fame: 3, meet: 2, d: 'Tens of thousands of entries from a hundred countries; the winners get publishing deals.' },
  { k: 'battlebands', cat: 'music', tier: 'fun', name: 'Battle of the Bands', month: 3, fee: 20, stat: 'pres', dc: 11, prize: 300, meet: 3, d: 'Six bands, one pub, one bar tab for the winner.' },
  { k: 'openmicchamp', cat: 'music', tier: 'fun', name: 'The Open Mic Championship', month: 9, fee: 0, stat: 'song', dc: 11, prize: 150, meet: 2, d: 'Every open mic in town sends its best. Three songs, no backing tracks.' },
  { k: 'remix', cat: 'music', tier: 'fun', name: 'The Remix Contest', month: 7, fee: 0, stat: 'sound', dc: 12, prize: 200, d: 'A famous producer releases the stems; the best remix goes on the deluxe edition.' },
  { k: 'busking', cat: 'music', tier: 'fun', name: 'The Busking Festival', month: 6, fee: 0, stat: 'song', dc: 10, prize: 80, meet: 2, d: 'A weekend of street pitches across the city. Judged by the coins in your case.' },
  { k: 'shanty', cat: 'music', tier: 'fun', name: 'The Sea Shanty Singalong', month: 1, fee: 0, stat: 'voice', dc: 10, prize: 40, meet: 2, d: 'Lead a pub full of strangers through a shanty. Points for volume.' },
  { k: 'filmscore', cat: 'music', tier: 'industry', name: 'The Short Film Scoring Competition', month: 10, fee: 25, stat: 'score', dc: 14, prize: 2000, stand: 2, meet: 1, d: 'Score a five-minute short; directors pick their favourite composers.' },
  { k: 'podpitch', cat: 'podcast', tier: 'industry', name: 'The Podcast Pitch Day', month: 2, fee: 15, stat: 'struc', dc: 14, prize: 3000, stand: 2, meet: 2, d: 'Pitch a series to five podcast networks in five minutes.' },
  { k: 'audiodoc', cat: 'podcast', tier: 'major', name: 'The Audio Documentary Prize', month: 8, fee: 30, stat: 'struc', dc: 17, prize: 10000, stand: 4, fame: 2, d: 'Public radio\'s top honour for a documentary told in sound.' },
  { k: 'livepod', cat: 'podcast', tier: 'fun', name: 'Live Podcast Night', month: 11, fee: 0, stat: 'impro', dc: 11, prize: 60, meet: 2, d: 'Record an episode in front of a pub audience that heckles.' },
  { k: 'creatorgrant', cat: 'creator', tier: 'industry', name: 'The Vidwire Creator Grant', month: 4, fee: 0, stat: 'vstory', dc: 15, prize: 5000, stand: 2, d: 'Cash and a production mentor for new channels with something to say.' },
  { k: 'blipchallenge', cat: 'creator', tier: 'fun', name: 'The 60-Second Blip Challenge', month: 8, fee: 0, stat: 'comic', dc: 11, prize: 100, meet: 1, d: 'One prompt, sixty seconds, a million judges with thumbs.' },
  { k: 'essayfest', cat: 'creator', tier: 'industry', name: 'The Video Essay Festival', month: 10, fee: 15, stat: 'struc', dc: 14, prize: 1500, stand: 1, d: 'Long, clever video essays screened in a real cinema.' },
  { k: 'playprize', cat: 'stage', tier: 'major', name: 'The Northlight Playwriting Prize', month: 1, fee: 0, stat: 'struc', dc: 17, prize: 16000, stand: 5, fame: 2, meet: 2, d: 'The country\'s biggest playwriting prize, judged blind. Winners get produced.' },
  { k: 'tenminute', cat: 'stage', tier: 'industry', name: 'The Ten-Minute Play Festival', month: 5, fee: 10, stat: 'dial', dc: 13, prize: 500, stand: 1, meet: 2, d: 'Twelve ten-minute plays in one night. Agents sit in the back row.' },
  { k: 'musicalwriting', cat: 'stage', tier: 'industry', name: 'The New Musical Writing Award', month: 9, fee: 20, stat: 'song', dc: 15, prize: 4000, stand: 2, d: 'Twenty minutes of a new musical, performed with piano for producers.' },
  { k: 'improvfest', cat: 'stage', tier: 'fun', name: 'The Improv Marathon', month: 7, fee: 5, stat: 'impro', dc: 11, prize: 80, meet: 3, d: 'Twenty-four hours of improvised theatre. Sleep is cheating.' }
);
Object.assign(COMP_CAT, { music: 'Music', podcast: 'Podcasting', creator: 'Online video', stage: 'Theatre' });
// ---- a century of the other fields, by region ----
const MEDIA_HISTORY = [
  [1954, 6, 'Rock and roll arrives', 'A truck driver from Memphis records a blues song fast, and teenagers lose their minds.'], [1963, 1, 'The beat boom', 'Four lads from Liverpool top the charts; British bands invade America within a year.'],
  [1967, 5, 'The summer of love', 'Psychedelic records and a festival in Monterey; music becomes the culture.'], [1968, 3, 'A rock musical opens downtown', 'A tribal love-rock musical with nudity transfers to Broadway; theatre gets young again.'],
  [1971, 8, 'Afrobeat takes shape in Lagos', 'A bandleader fuses highlife, jazz and funk into something new, and politics into the lyrics.'], [1976, 10, 'Punk', 'Three chords and a bad attitude: London clubs fill with safety pins.'],
  [1979, 7, 'The portable cassette player', 'Music goes everywhere with you, on headphones, for the first time.'], [1981, 7, 'Music television launches', 'A cable channel plays music videos all day; how an artist looks starts to matter as much as how they sound.'],
  [1982, 10, 'The compact disc', 'A shiny disc promises perfect sound forever. Everyone buys their record collection again.'], [1986, 9, 'The mega-musicals', 'A masked composer\'s spectacles fill the West End and Broadway for decades.'],
  [1992, 4, 'A film composer from Chennai breaks through', 'His first soundtrack changes how Indian film music sounds.'], [1999, 6, 'File-sharing upends the record business', 'A student\'s program lets millions swap songs for free. Sales start a fifteen-year fall.'],
  [2001, 10, 'A thousand songs in your pocket', 'A white music player with a scroll wheel makes digital music mainstream.'], [2004, 9, '"Podcasting" gets its name', 'Radio shows you download and play on your music player. A few hobbyists start talking.'],
  [2005, 4, 'Vidwire launches', 'A video-sharing site founded above a pizzeria posts its first clip: a man at the zoo.'], [2008, 10, 'Spinly launches in Stockholm', 'Stream any song, legally, for free with ads. The record business slowly stops falling.'],
  [2012, 7, 'A K-pop video breaks the internet', 'A horse-riding dance from Seoul becomes the first video watched a billion times.'], [2014, 10, 'A true-crime podcast goes mainstream', 'A reporter re-investigates a murder, one episode a week; millions binge it and podcasts go big.'],
  [2015, 8, 'A hip-hop history musical opens', 'A musical about a founding father, cast with actors of colour, becomes the hottest ticket in decades.'], [2016, 9, 'Blip launches', 'A short-video app built on lip-syncing starts to swallow the world\'s attention.'],
  [2017, 6, 'Afrobeats goes global', 'Lagos stars sell out London arenas; the sound of the city becomes the sound of the summer everywhere.'], [2019, 4, 'A K-pop band plays stadiums in America', 'Fans learn Korean lyrics phonetically and sing every word.'],
  [2020, 3, 'Stages go dark', 'Lockdowns close every theatre and venue. Musicians perform livestreams from their kitchens.'], [2020, 6, 'Short video becomes the charts', 'Songs now become hits by being danced to in fifteen-second clips.'],
  [2021, 7, 'Theatres reopen', 'Audiences return in masks; the long-running musicals relight one by one.'], [2023, 6, 'Spanish- and Korean-language songs top global streaming', 'The biggest pop in the world is no longer mostly in English.'],
  [2024, 2, 'Creators outgrow television', 'More hours of television screens show Vidwire than any broadcaster.'], [2025, 5, 'Video podcasts', 'Podcasts become shows you watch; studios fill with microphones and three cameras.']
];
for (const [y, m, t, txt] of MEDIA_HISTORY) TRENDS.push({ y, m, t, txt, fx: () => { } });
TRENDS.sort((a, b) => a.y - b.y || a.m - b.m);
// ---- regional history of music, theatre and online media: what happened where, as it happened ----
const REGIONAL_MEDIA = [
  [1956, 3, 'newyork', 'A flower-seller musical opens', 'A musical about a phonetics professor and a Covent Garden flower girl runs for six years and sells records by the million.'],
  [1957, 9, 'newyork', 'Romeo and Juliet move to the West Side', 'A musical sets the tragedy among street gangs, with dance as the fight. Broadway gets serious.'],
  [1958, 8, 'rio', 'Bossa nova is born', 'A guitarist\'s quiet new rhythm, half samba and half cool jazz, drifts out of Rio apartments and around the world.'],
  [1959, 1, 'newyork', 'A songwriter borrows $800 and starts a label', 'In Detroit, a factory worker turned songwriter starts a hit factory of his own, run like an assembly line.'],
  [1960, 10, 'lagos', 'Highlife at independence', 'Dance bands play Nigeria into independence; the clubs of Lagos are the loudest in Africa.'],
  [1962, 4, 'paris', 'Yé-yé', 'Teenage singers on French radio turn American pop into something chic. Every café jukebox plays them.'],
  [1964, 2, 'newyork', 'The British invade', 'Seventy-three million Americans watch four Liverpudlians on a Sunday-night variety show.'],
  [1965, 4, 'london', 'Pirate radio ships', 'Unlicensed stations broadcast pop from ships off the coast because the state radio barely plays it.'],
  [1969, 8, 'newyork', 'Half a million in a muddy field', 'A three-day festival upstate becomes the defining gathering of a generation.'],
  [1973, 8, 'newyork', 'Hip-hop is born at a party', 'In the Bronx, a DJ loops the drum breaks of funk records for dancers. Rappers start talking over them.'],
  [1975, 7, 'newyork', 'A musical about dancers auditioning', 'A show built from real dancers\' stories runs fifteen years and changes how musicals are made.'],
  [1977, 6, 'berlin', 'Electronic sounds from West Berlin', 'A British star records a trilogy of albums by the Wall; German machine music becomes the future.'],
  [1978, 11, 'tokyo', 'Synthesizers at the centre of pop', 'A Tokyo trio puts computers and synths in the band; Japanese pop goes electronic and exports it.'],
  [1979, 7, 'tokyo', 'Music you can walk around with', 'A portable cassette player with headphones changes how the world listens.'],
  [1981, 8, 'newyork', 'MusicVision launches', 'A cable channel plays music videos all day. Its first clip is a song about video killing radio.'],
  [1982, 11, 'hollywood', 'The best-selling album ever', 'A former child star\'s sixth album, with a zombie video, sells over sixty million copies.'],
  [1985, 7, 'london', 'Two stadiums, one concert', 'Concerts in London and Philadelphia raise millions for famine relief; a billion watch on television.'],
  [1986, 10, 'london', 'A phantom moves into the West End', 'A musical about a masked composer under the Paris Opera opens; it will run for decades and play the world.'],
  [1988, 6, 'london', 'Acid house', 'Warehouse raves and smiley faces: the second summer of love in fields around London.'],
  [1989, 3, 'mumbai', 'The cassette boom', 'Cheap tapes make film soundtracks the music everyone in India owns; a cassette label becomes a giant.'],
  [1992, 3, 'seoul', 'Rap comes to Korean pop', 'A trio fuses rap, rock and dance on a talent show and loses; within weeks they are the biggest act in the country.'],
  [1995, 2, 'seoul', 'An idol factory opens', 'A Seoul producer founds an agency that trains teenagers for years in singing, dance and languages before debut.'],
  [1996, 5, 'london', 'Cool Britannia', 'Guitar bands, Union Jack guitars and a rivalry between two of them sell papers for a summer.'],
  [1997, 1, 'paris', 'French touch', 'Two producers in robot helmets release house music made in a bedroom; Paris becomes the capital of dance music.'],
  [1997, 11, 'newyork', 'The lion musical', 'An animated film becomes a puppet-filled stage musical; it will become the highest-grossing show in history.'],
  [2001, 6, 'mexico', 'Rock en español fills stadiums', 'Bands from Mexico City and Buenos Aires tour the Americas singing in Spanish.'],
  [2003, 10, 'newyork', 'The witches\' musical', 'A prequel to a classic film, told from the witch\'s side, opens to mixed reviews and runs forever.'],
  [2005, 3, 'stockholm', 'Swedish producers write America\'s hits', 'A handful of Stockholm songwriters are behind half the pop songs on American radio.'],
  [2006, 10, 'hollywood', 'A search giant buys Vidwire', 'The video site that started with a clip at the zoo sells for $1.65 billion, nineteen months after launch.'],
  [2008, 5, 'seoul', 'K-pop\'s second wave', 'Girl groups and boy bands with perfect choreography spread across Asia through online video.'],
  [2009, 2, 'mumbai', 'A Chennai composer wins two Oswalds', 'Indian film music goes global overnight; the composer\'s song is played at the ceremony.'],
  [2010, 7, 'lagos', 'Afrobeats producers build home studios', 'Cheap laptops and software turn Lagos bedrooms into hit factories.'],
  [2011, 1, 'london', 'An album about a break-up sells thirty million', 'A Tottenham singer\'s second record, raw and huge, saves the year for the record business.'],
  [2013, 5, 'johannesburg', 'Gqom and house from Durban and Soweto', 'South African dance music spreads on file-sharing sites and taxi stereos.'],
  [2014, 8, 'london', 'Grime comes back', 'East London MCs who never left the pirate stations top the charts and sell out arenas.'],
  [2016, 4, 'lagos', 'A Lagos star on the biggest song in the world', 'An Afrobeats singer features on a Canadian rapper\'s summer hit; streaming numbers explode.'],
  [2017, 1, 'bogota', 'Reggaeton goes global', 'A slow reggaeton song from Puerto Rico becomes the most-watched video ever; Colombian stars follow it into every chart.'],
  [2017, 9, 'manila', 'Pinoy pop on Blip', 'Filipino singers and comedians build huge audiences on short video; Manila becomes a creator capital.'],
  [2018, 9, 'seoul', 'A K-pop band at the United Nations', 'Seven young men from Seoul give a speech to the UN and sell out stadiums in four continents.'],
  [2018, 12, 'mumbai', 'A hundred million streaming in India', 'Cheap mobile data turns India into the world\'s biggest audience for music and video apps.'],
  [2019, 7, 'rio', 'Funk carioca explodes', 'Baile funk from Rio\'s favelas tops Brazilian streaming and samples its way into global pop.'],
  [2020, 2, 'johannesburg', 'Amapiano spreads', 'A township house sound with log-drum bass spreads from Johannesburg parties to dancefloors everywhere.'],
  [2020, 9, 'hollywood', 'Content houses', 'Teenage Blip stars move into mansions together and film everything; the houses become brands.'],
  [2021, 4, 'london', 'Creators fill arenas', 'A boxing match between two video stars sells out an arena and millions of streams.'],
  [2022, 10, 'seoul', 'Webtoons and K-dramas everywhere', 'Korean series made for streaming top charts in ninety countries; Seoul studios hire around the clock.'],
  [2023, 5, 'hollywood', 'The writers walk out, and podcasts boom', 'With film and TV halted by strikes, actors and writers launch podcasts by the hundred.'],
  [2023, 6, 'mexico', 'Regional Mexican music tops American charts', 'Corridos with trap beats, sung by teenagers from Jalisco, become the most-streamed Spanish-language music in the US.'],
  [2024, 3, 'london', 'Record ticket prices in the West End', 'Premium seats for the hottest plays pass $500; theatres argue about who gets to go.'],
  [2025, 4, 'stockholm', 'Machines make songs', 'Streaming services fill with tracks made by software; labels and artists fight over what counts as music.']
];
{ const used = new Set(TRENDS.map(t => t.y + '-' + t.m)); for (const [y, m0, hub, t, txt] of REGIONAL_MEDIA) { let m = m0; while (used.has(y + '-' + m) && m < 11) m++; if (used.has(y + '-' + m)) continue; used.add(y + '-' + m); TRENDS.push({ y, m, t: `${HUBS[hub] ? HUBS[hub].name.split(' and ')[0] : ''}: ${t}`, txt, hub, fx: () => { } }); } TRENDS.sort((a, b) => a.y - b.y || a.m - b.m); }
