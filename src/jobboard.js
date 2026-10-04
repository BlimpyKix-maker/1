// ---------------- Jobs across the industries: more of them, what they involve, and a board you can sort ----------------
// The entertainment business is one big leaky building: editors cut podcasts, session players score films, stage
// managers run film sets, creators direct features. Every job belongs to an industry; experience in one counts in
// its neighbours. The board can be filtered by industry, level and fit and sorted by odds, pay or length, and every
// table in the game sorts by clicking its headers. Duties come from real postings and crew guides (EntertainmentCareers,
// Indeed and Glassdoor listings, Berklee career pages, Broadway and theatre glossaries, crew-role guides).
FIELD_JOBS.push(
  { k: 'f_tour_manager', t: 'Tour manager', field: 'music', fam: 'music', tier: 3, subs: ['setm', 'bud'], days: 6, rate: 520, weeks: 10, biz: 'Touring', d: 'Advance every show, run the money, get everyone on the bus.' },
  { k: 'f_artist_manager', t: 'Artist manager (junior)', field: 'music', fam: 'music', tier: 3, subs: ['pack', 'cha'], days: 5, rate: 380, weeks: 26, biz: 'Management company', d: 'Look after two developing artists: releases, gigs, deals, egos.' },
  { k: 'f_booking_agent', t: 'Booking agent assistant', field: 'music', fam: 'music', tier: 2, subs: ['pack', 'eth'], days: 5, rate: 220, weeks: 20, co: 1, biz: 'Booking agency', d: 'Hold dates, chase offers, route tours across a map.' },
  { k: 'f_mastering', t: 'Mastering engineer', field: 'music', fam: 'music', tier: 4, subs: ['sound', 'tas'], days: 3, rate: 700, weeks: 8, biz: 'Mastering studio', d: 'The last ears on a record: loudness, tone, the gap between songs.' },
  { k: 'f_music_sup', t: 'Music supervisor', field: 'music', fam: 'mus', tier: 3, subs: ['tas', 'pack'], days: 4, rate: 520, weeks: 12, biz: 'Film and TV music', d: 'Find the songs for a film and clear them. Half taste, half contracts.' },
  { k: 'f_sync_coord', t: 'Sync licensing coordinator', field: 'music', fam: 'music', tier: 2, subs: ['pack', 'eth'], days: 5, rate: 240, weeks: 24, co: 1, biz: 'Music publisher', d: 'Pitch the catalogue to films, ads and games; draft the licences.' },
  { k: 'f_record_producer', t: 'Record producer', field: 'music', fam: 'music', tier: 4, subs: ['song', 'sound'], days: 4, rate: 900, weeks: 8, biz: 'Album sessions', d: 'Shape an artist\'s record from demo to master. Arrangements, takes, the final call.' },
  { k: 'f_ar_manager', t: 'A&R manager', field: 'music', fam: 'music', tier: 4, subs: ['tas', 'pack'], days: 5, rate: 650, weeks: 40, co: 1, biz: 'Record label', d: 'Sign artists, match them with producers and writers, steer the album.' },
  { k: 'f_shortform', t: 'Short-form editor', field: 'creator', fam: 'creator', tier: 1, subs: ['rhythm', 'tas'], days: 4, rate: 160, weeks: 12, biz: 'Creator studio', d: 'Turn long videos into thirty-second Blip clips that hook in a second.' },
  { k: 'f_creator_writer', t: 'Creator scriptwriter', field: 'creator', fam: 'creator', tier: 2, subs: ['struc', 'dial'], days: 4, rate: 260, weeks: 16, biz: 'Vidwire channel', d: 'Write the big weekly video so it sounds unscripted.' },
  { k: 'f_creator_talent', t: 'Creator talent manager', field: 'creator', fam: 'creator', tier: 3, subs: ['pack', 'cha'], days: 5, rate: 450, weeks: 30, co: 1, biz: 'Creator management', d: 'Run a roster of creators\' deals, schedules and crises.' },
  { k: 'f_partnerships', t: 'Brand partnerships manager', field: 'creator', fam: 'creator', tier: 3, subs: ['mkt', 'pack'], days: 5, rate: 480, weeks: 30, co: 1, biz: 'Creator studio', d: 'Sell sponsorships that audiences don\'t skip.' },
  { k: 'f_pod_engineer', t: 'Podcast audio engineer', field: 'podcast', fam: 'podcast', tier: 2, subs: ['sound', 'eth'], days: 4, rate: 220, weeks: 16, co: 1, biz: 'Podcast network', d: 'Record, mix and master a slate of weekly shows.' },
  { k: 'f_pod_research', t: 'Research producer', field: 'podcast', fam: 'podcast', tier: 2, subs: ['struc', 'tas'], days: 5, rate: 220, weeks: 20, co: 1, biz: 'Podcast network', d: 'Find the story, the documents and the people for a narrative series.' },
  { k: 'f_pod_showrunner', t: 'Podcast showrunner', field: 'podcast', fam: 'podcast', tier: 4, subs: ['struc', 'pack'], days: 5, rate: 650, weeks: 30, co: 1, biz: 'Podcast network', d: 'Own a show end to end: format, team, budget, audience.' },
  { k: 'f_company_mgr', t: 'Company manager', field: 'stage', fam: 'stage', tier: 3, subs: ['bud', 'cha'], days: 6, rate: 420, weeks: 24, biz: 'Theatre production', d: 'Payroll, contracts, digs and every crisis offstage.' },
  { k: 'f_props', t: 'Props supervisor (theatre)', field: 'stage', fam: 'stage', tier: 2, subs: ['sets', 'eth'], days: 5, rate: 250, weeks: 12, biz: 'Theatre production', d: 'Source, build and maintain every object an actor touches.' },
  { k: 'f_wardrobe_sup', t: 'Wardrobe supervisor (theatre)', field: 'stage', fam: 'stage', tier: 2, subs: ['wardrobe', 'eth'], days: 6, rate: 240, weeks: 20, biz: 'Theatre production', d: 'Keep the costumes alive through eight shows a week.' },
  { k: 'f_lx_designer', t: 'Lighting designer (theatre)', field: 'stage', fam: 'stage', tier: 4, subs: ['light', 'tas'], days: 5, rate: 600, weeks: 6, biz: 'Theatre production', d: 'Design the light for a new show, from plot to press night.' },
  { k: 'f_theatre_casting', t: 'Casting associate (theatre)', field: 'stage', fam: 'stage', tier: 2, subs: ['talent', 'tas'], days: 5, rate: 230, weeks: 14, biz: 'Theatre casting', d: 'Run auditions and callbacks for a new production.' },
  { k: 'f_foh', t: 'Front of house manager', field: 'stage', fam: 'stage', tier: 2, subs: ['com', 'cha'], days: 5, rate: 200, weeks: 26, biz: 'Theatre', d: 'Run the building on show nights: ushers, bars, latecomers, emergencies.' },
  { k: 'f_theatre_producer', t: 'Theatre producer (associate)', field: 'stage', fam: 'stage', tier: 5, subs: ['fin', 'pack'], days: 5, rate: 1100, weeks: 30, biz: 'Commercial theatre', d: 'Raise the money, book the theatre, hire the team, sell the tickets.' }
);
for (const t of FIELD_JOBS) if (!ODD_JOBS.includes(t)) { ODD_JOBS.push(t); ODD_BY[t.k] = t; }
// what each job involves: duties, skills, where people come from and go next
const FIELD_GUIDE = {
  f_runner_studio: [['Book in clients and keep the studio diary', 'set up and strike mic stands, cables and headphones', 'make endless tea and keep the lounge tidy', 'watch the engineers and learn the console'], ['reliability', 'discretion', 'patience'], 'music school, gigging musician', 'assistant engineer'],
  f_asst_engineer: [['Set up mics and the patchbay before the session', 'run the DAW session: takes, comping, backups', 'fix what breaks without stopping the band', 'print stems and label everything'], ['DAW fluency (Pro Tools)', 'signal flow', 'calm under pressure'], 'studio runner, audio degree', 'recording engineer, mix engineer'],
  f_session: [['Learn charts or demos before the session', 'play parts that serve the song, in two takes', 'adapt to the producer\'s notes on the spot'], ['sight-reading', 'versatility', 'time-keeping'], 'gigging musician, conservatoire', 'musical director, producer, composer'],
  f_wedding_band: [['Learn a hundred covers and the couple\'s first dance', 'load in, sound check and play three sets', 'read the room and change the setlist'], ['repertoire', 'stamina', 'stagecraft'], 'any musician', 'session player, touring musician'],
  f_music_teacher: [['Plan lessons for students of different levels', 'prepare pupils for grade exams and recitals', 'keep parents informed'], ['patience', 'theory', 'communication'], 'music degree, performer', 'head of music, composer'],
  f_backline: [['Set up, tune and maintain the band\'s instruments and amps', 'swap broken strings mid-song', 'pack the truck in the right order'], ['instrument knowledge', 'speed', 'calm on stage'], 'roadie, guitar shop', 'stage manager (touring), production manager'],
  f_ar_scout: [['Go to three gigs a night and listen to hundreds of demos', 'track streaming and social numbers for rising artists', 'write reports and bring artists to meetings'], ['ears', 'data reading', 'networking'], 'promoter, blogger, DJ', 'A&R manager'],
  f_staff_writer: [['Write songs daily, alone and in co-writes', 'pitch songs to artists and their teams', 'track splits and registrations'], ['craft', 'collaboration', 'output'], 'artist, producer', 'hit writer, producer, publisher'],
  f_mix_engineer: [['Balance every track into a finished mix', 'shape space, dynamics and tone', 'turn notes from artist and label into revisions', 'deliver stems and instrumentals'], ['critical listening', 'DAW mastery', 'taste'], 'assistant engineer, producer', 'producer, studio owner'],
  f_music_director: [['Arrange the show\'s music and lead the band', 'run rehearsals and set the setlist', 'cue the band live, adjust on the fly'], ['leadership', 'arranging', 'playing'], 'session player, band leader', 'producer, music supervisor'],
  f_thumbs: [['Design and test thumbnails and titles', 'track click-through rates', 'keep a visual brand consistent'], ['design', 'psychology of attention', 'speed'], 'graphic designer, editor', 'creative director, channel producer'],
  f_creator_editor: [['Cut long recordings into tight videos', 'add graphics, captions and sound design', 'match the creator\'s style and pace'], ['editing software', 'rhythm', 'humour'], 'film school, assistant editor', 'channel producer, film editor'],
  f_mod: [['Remove spam and abuse in live chat', 'answer questions and flag moments for clips', 'enforce community rules'], ['composure', 'judgement', 'speed'], 'fan, community member', 'community manager, social media manager'],
  f_social: [['Plan and post across platforms', 'reply to comments and DMs in the brand\'s voice', 'report on what worked'], ['writing', 'analytics', 'trend sense'], 'marketing, journalism', 'head of audience, marketing manager'],
  f_channel_producer: [['Plan the upload schedule and formats', 'manage shoots, editors and deadlines', 'analyse retention and adapt'], ['production', 'analytics', 'management'], 'editor, producer, creator', 'head of content, showrunner'],
  f_brand_content: [['Develop ideas a sponsor and an audience both like', 'produce the shoots and approvals', 'measure the result'], ['pitching', 'production', 'diplomacy'], 'agency, producer', 'head of branded content'],
  f_head_content: [['Set the creative strategy for a slate of channels', 'hire and manage producers and editors', 'own the numbers'], ['taste', 'leadership', 'business'], 'channel producer, TV exec', 'studio head, network exec'],
  f_pod_editor: [['Edit raw recordings down to the episode', 'clean noise, ums and crosstalk', 'add music and ads'], ['audio editing', 'story sense', 'ears'], 'radio, music production', 'podcast producer, audio engineer'],
  f_pod_booker: [['Find and invite guests', 'prep guests and research notes', 'manage the calendar and publicists'], ['networking', 'persistence', 'research'], 'PR, journalism', 'podcast producer'],
  f_pod_producer: [['Plan episodes and research guests', 'run recordings and direct the host', 'manage edits, publishing and promotion'], ['editorial judgement', 'organisation', 'audio'], 'radio, journalism, editor', 'showrunner, network executive'],
  f_pod_narrative: [['Report and structure a multi-part story', 'write scripts and tape syncs', 'shape the edit with the host'], ['story structure', 'reporting', 'scriptwriting'], 'journalist, documentary', 'showrunner, documentary producer'],
  f_pod_host: [['Prepare and lead every interview', 'read ads in your own voice', 'promote the show everywhere'], ['curiosity', 'voice', 'listening'], 'journalist, comedian, actor', 'network star, TV presenter'],
  f_usher_theatre: [['Check tickets and show people to seats', 'manage latecomers and interval bars', 'handle emergencies calmly'], ['people skills', 'calm', 'reliability'], 'anyone', 'front of house manager, box office'],
  f_box_office: [['Sell and change tickets, in person and by phone', 'handle comps, press tickets and complaints', 'balance the takings'], ['accuracy', 'patience', 'systems'], 'retail, usher', 'box office manager, marketing'],
  f_asm: [['Run the props table and backstage tracks', 'prompt actors in rehearsal', 'help the stage manager keep the book'], ['organisation', 'discretion', 'quick hands'], 'drama school (stage management)', 'deputy stage manager, stage manager'],
  f_ensemble: [['Learn harmonies and choreography for a whole show', 'cover principal roles as understudy', 'perform eight shows a week'], ['singing', 'dance', 'stamina'], 'musical theatre college', 'principal roles, film musicals'],
  f_lx: [['Rig, focus and maintain lights', 'program and run the lighting desk', 'fix faults before the half'], ['electrics', 'programming', 'heights'], 'tech theatre course', 'lighting designer, film electrician'],
  f_stage_manager: [['Run rehearsals and keep the prompt book', 'call every lighting and sound cue in performance', 'keep cast and crew safe and on time'], ['organisation', 'authority', 'calm'], 'ASM, DSM', 'production manager, film 1st AD'],
  f_dramaturg: [['Read and assess new plays', 'research the world of a production', 'give the writer and director notes'], ['analysis', 'writing', 'diplomacy'], 'literature degree, critic', 'literary manager, artistic director, script editor'],
  f_resident_director: [['Maintain the show\'s direction through a long run', 'rehearse replacement casts', 'give notes after performances'], ['directing', 'diplomacy', 'memory'], 'assistant director', 'director'],
  f_tour_manager: [['Advance every show with venues and promoters', 'run the tour budget, per diems and settlements', 'manage travel, hotels and day sheets'], ['logistics', 'money', 'nerve'], 'production manager, roadie', 'artist manager, promoter'],
  f_artist_manager: [['Plan releases and tours with the artist', 'negotiate with labels, agents and brands', 'protect the artist\'s time and health'], ['negotiation', 'judgement', 'loyalty'], 'tour manager, label staff', 'senior manager, label head'],
  f_booking_agent: [['Hold dates and route tours', 'negotiate guarantees with promoters', 'issue contracts and riders'], ['negotiation', 'maps', 'relationships'], 'promoter, venue staff', 'booking agent'],
  f_mastering: [['Prepare final masters for streaming, vinyl and CD', 'set loudness and sequence', 'catch errors before release'], ['critical listening', 'technical standards', 'taste'], 'mix engineer', 'studio owner'],
  f_music_sup: [['Choose songs with the director', 'negotiate sync and master licences', 'manage the music budget and cue sheets'], ['taste', 'licensing', 'negotiation'], 'music publisher, label, DJ', 'head of music at a studio'],
  f_sync_coord: [['Pitch the catalogue to films, games and ads', 'prepare quotes and licences', 'keep metadata clean'], ['catalogue knowledge', 'admin', 'pitching'], 'label assistant', 'sync manager, music supervisor'],
  f_record_producer: [['Choose songs and arrangements with the artist', 'run sessions and choose takes', 'oversee mixing and mastering'], ['musicianship', 'leadership', 'taste'], 'engineer, musician, songwriter', 'label exec, superstar producer'],
  f_ar_manager: [['Sign artists and build their records', 'pair them with writers and producers', 'champion them inside the label'], ['ears', 'politics', 'stamina'], 'A&R scout, manager', 'head of A&R, label president'],
  f_shortform: [['Find the best thirty seconds in hours of footage', 'add captions and hooks', 'track retention'], ['speed', 'trend sense', 'editing'], 'editor, creator', 'channel producer'],
  f_creator_writer: [['Research and script videos', 'write hooks for the first five seconds', 'punch up with the creator'], ['writing', 'research', 'comedy'], 'comedy writer, journalist', 'head writer, TV writer'],
  f_creator_talent: [['Negotiate brand deals for a roster', 'plan creators\' schedules and launches', 'handle crises'], ['negotiation', 'patience', 'networks'], 'agency assistant', 'agency partner'],
  f_partnerships: [['Sell sponsorships across channels', 'write briefs both sides sign off', 'report results'], ['sales', 'creativity', 'relationships'], 'advertising, marketing', 'head of partnerships'],
  f_pod_engineer: [['Record in studio and remotely', 'mix and master episodes to loudness standards', 'maintain the gear'], ['audio', 'reliability', 'speed'], 'audio engineering course', 'podcast producer, studio manager'],
  f_pod_research: [['Find sources, documents and tape', 'fact-check every claim', 'book interviews'], ['research', 'tenacity', 'accuracy'], 'journalism', 'narrative producer'],
  f_pod_showrunner: [['Own a show\'s format and quality', 'hire and run the team', 'manage budget and audience growth'], ['editorial judgement', 'leadership', 'business'], 'producer, radio editor', 'network head'],
  f_company_mgr: [['Run payroll and contracts for cast and crew', 'organise housing and travel on tour', 'handle offstage emergencies'], ['finance', 'tact', 'organisation'], 'stage manager, theatre admin', 'general manager, producer'],
  f_props: [['Source, build and maintain props', 'keep a props list and track every item', 'make breakaway and food props work eight times a week'], ['making', 'research', 'problem-solving'], 'art school, ASM', 'production designer, film props master'],
  f_wardrobe_sup: [['Maintain, wash and repair costumes', 'run quick changes', 'fit replacement cast'], ['sewing', 'speed', 'calm'], 'costume course', 'costume supervisor, designer'],
  f_lx_designer: [['Design the lighting plot and cues', 'work with director and set designer', 'program and plot in tech'], ['design', 'electrics', 'storytelling'], 'lighting technician', 'film DP, opera lighting designer'],
  f_theatre_casting: [['Run audition schedules and readers', 'shortlist actors for the director', 'negotiate offers with agents'], ['taste', 'organisation', 'diplomacy'], 'casting assistant, actor', 'casting director'],
  f_foh: [['Run front of house on show nights', 'manage ushers, bars and access needs', 'handle evacuations and complaints'], ['leadership', 'calm', 'service'], 'usher, hospitality', 'theatre manager'],
  f_theatre_producer: [['Option plays and assemble the creative team', 'raise money from investors', 'book the theatre and drive ticket sales'], ['finance', 'taste', 'nerve'], 'company manager, general manager', 'lead producer, film producer']
};
const IND_LABEL = { film: 'Film & TV', music: 'Music', creator: 'Online video', podcast: 'Podcasts & radio', stage: 'Theatre', games: 'Games', business: 'Business & office', exhibition: 'Cinemas & festivals' };
for (const t of FIELD_JOBS) {
  const G = FIELD_GUIDE[t.k]; if (!G) continue;
  const id = 'g_' + t.k; t.jid = id;
  if (!JOBS.jobs.some(j => j.id === id)) JOBS.jobs.push({ id, t: t.t, sec: 'Industry', dept: IND_LABEL[t.field], lv: t.tier, to: t.biz, resp: G[0], sk: G[1], before: G[2], after: G[3], craft: SUB2C[t.subs[0]] || 'pro', ind: t.field });
}
// ---- which industry a job belongs to ----
const DEPT_IND = { Podcast: 'podcast', Radio: 'podcast', YouTube: 'creator', 'Content Creator': 'creator', 'Social Media': 'creator', 'Theater/Live Events': 'stage', 'Video Game': 'games', 'Broadcasting/Sound/Music Engineering': 'music', 'Exhibition & Distribution': 'exhibition', 'Film Festivals': 'exhibition', 'Accounting/Finance': 'business', Advertising: 'business', 'Human Resources': 'business', 'Legal and Business Affairs': 'business', 'IS/IT': 'business', 'Web Design/Development': 'business', Sales: 'business', Marketing: 'business', 'Publicity/PR': 'business', 'Executive Positions': 'business', 'Personal Assistant': 'business', Coordinator: 'business', 'Union & Trade Organizations': 'business', Fashion: 'business', Sports: 'business', 'Digital Publishing': 'business', 'Design/Graphic Design': 'business', Education: 'business' };
function postIndustry(p) {
  const t = tmplOf(p) || {};
  if (t.field) return t.field;
  if (t.biz && DEPT_IND[t.biz]) return DEPT_IND[t.biz];
  const fam = familyOf(p);
  return fam === 'cinema' ? 'exhibition' : fam === 'office' && t.biz && /agency|management/i.test(t.biz) ? 'business' : 'film';
}
// ---- experience carries across ----
const TRANSFER = { film: { stage: .6, creator: .5, music: .3, podcast: .4, games: .5, exhibition: .4, business: .3 }, music: { film: .4, stage: .6, creator: .5, podcast: .4, games: .4 }, creator: { film: .5, podcast: .6, music: .3, business: .4, games: .4 }, podcast: { creator: .6, film: .3, music: .3, business: .3 }, stage: { film: .6, music: .5, creator: .3 }, games: { film: .4, creator: .4, music: .3 }, business: { film: .3, music: .3, creator: .3, podcast: .3, stage: .3, exhibition: .5 }, exhibition: { film: .4, business: .4, stage: .3 } };
function fieldExp() {
  const M = S.me, me = ME(), E = {};
  for (const p of M.past) { const ind = postIndustry({ k: p.k, jid: (POST_BY[p.k] || ODD_BY[p.k] || {}).jid, odd: !POST_BY[p.k] }); E[ind] = (E[ind] || 0) + Math.max(1, (p.to - p.from)) / 4; }
  for (const j of M.jobs) { const ind = postIndustry(j); E[ind] = (E[ind] || 0) + j.done / 4; }
  for (const w of M.works || []) { const f = WORK_TYPES[w.type].field; E[f] = (E[f] || 0) + 1.5; }
  E.film = (E.film || 0) + me.credits.length * 3 + (M.scripts || []).filter(s => s.grade).length * 2;
  return E;
}
function fieldFactors(post) {
  const ind = postIndustry(post), E = fieldExp(), own = E[ind] || 0, F = [];
  if (own >= 2) F.push([`Experience in ${IND_LABEL[ind].toLowerCase()}`, Math.min(.9, own * .06)]);
  let best = null, bv = 0; for (const k in E) if (k !== ind) { const v = (E[k] || 0) * ((TRANSFER[k] || {})[ind] || 0); if (v > bv) { bv = v; best = k; } }
  if (best && bv >= 1.5) F.push([`Transferable: your ${IND_LABEL[best].toLowerCase()} work`, Math.min(.6, bv * .05)]);
  if (own < 1 && !best && ind !== (S.me.field || 'film') && post.tier >= 2) F.push(['New to this industry', -.5]);
  return F;
}
// ---- the board: filter, sort ----
function boardView() {
  const M = S.me, B = UI.bf = UI.bf || { ind: 'all', tier: 'all', sort: 'odds', fit: false };
  let L = M.board.slice();
  if (B.ind !== 'all') L = L.filter(p => postIndustry(p) === B.ind);
  if (B.tier !== 'all') L = L.filter(p => B.tier === 'entry' ? p.tier <= 1 : B.tier === 'mid' ? p.tier >= 2 && p.tier <= 3 : p.tier >= 4);
  if (B.fit) L = L.filter(p => !blockedFrom(tmplOf(p)) && hireOdds(p) >= .25);
  const key = { odds: p => -hireOdds(p), pay: p => -p.rate, short: p => p.weeks, long: p => -p.weeks, days: p => p.days, title: p => p.t }[B.sort] || (p => 0);
  return L.sort((a, b) => { const x = key(a), y = key(b); return typeof x === 'string' ? x.localeCompare(y) : x - y; });
}
function boardFilterHTML() {
  const M = S.me, B = UI.bf = UI.bf || { ind: 'all', tier: 'all', sort: 'odds', fit: false }, cnt = {};
  for (const p of M.board) { const i = postIndustry(p); cnt[i] = (cnt[i] || 0) + 1; }
  return `<div class="bfilter"><div class="bf-row">${[['all', 'All', M.board.length], ...Object.keys(IND_LABEL).filter(k => cnt[k]).map(k => [k, IND_LABEL[k], cnt[k]])].map(([k, l, n]) => `<button class="pill${B.ind === k ? ' on' : ''}" data-bfind="${k}">${esc(l)} <span class="count">${n}</span></button>`).join('')}</div>
   <div class="bf-row">${[['all', 'Any level'], ['entry', 'Entry'], ['mid', 'Mid'], ['senior', 'Senior']].map(([k, l]) => `<button class="pill${B.tier === k ? ' on' : ''}" data-bftier="${k}">${l}</button>`).join('')}<button class="pill${B.fit ? ' on' : ''}" data-bffit="1">✓ Good fits only</button>
   <label class="small">Sort <select id="bf-sort">${[['odds', 'Best odds'], ['pay', 'Highest pay'], ['short', 'Shortest'], ['long', 'Longest'], ['days', 'Fewest days a week'], ['title', 'Title A–Z']].map(([k, l]) => `<option value="${k}"${B.sort === k ? ' selected' : ''}>${l}</option>`).join('')}</select></label></div></div>`;
}
function boardClick(t) {
  const d = t.dataset, B = UI.bf = UI.bf || { ind: 'all', tier: 'all', sort: 'odds', fit: false };
  if (d.bfind) { B.ind = d.bfind; render(true); return true; }
  if (d.bftier) { B.tier = d.bftier; render(true); return true; }
  if (d.bffit) { B.fit = !B.fit; render(true); return true; }
  return false;
}
// ---- every table sorts: click a header; the choice sticks across redraws ----
function tableKey(tb) { return [...tb.querySelectorAll('thead th')].map(th => th.textContent.trim()).join('|').slice(0, 80); }
function cellVal(td) {
  if (!td) return '';
  if (td.dataset.v !== undefined) return +td.dataset.v;
  const t0 = td.textContent.trim(), t = t0.replace(/^▲\s*/, '').replace(/^▼\s*/, '-'), m = t.replace(/[,\s]/g, '').match(/^[−-]?[$£€¥₹]?([−-]?\d+(\.\d+)?)([kKMB%])?/);
  if (m) { let v = parseFloat(m[1].replace('−', '-')); if (/^[−-]/.test(t)) v = -Math.abs(v); const s = m[3]; if (s === 'k' || s === 'K') v *= 1e3; else if (s === 'M') v *= 1e6; else if (s === 'B') v *= 1e9; return v; }
  return t.toLowerCase();
}
function sortTable(tb, col, dir) {
  const body = tb.tBodies[0]; if (!body) return;
  const rows = [...body.rows].filter(r => !r.querySelector('td.empty'));
  rows.sort((a, b) => { const x = cellVal(a.cells[col]), y = cellVal(b.cells[col]); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir; });
  for (const r of rows) body.appendChild(r);
  tb.querySelectorAll('thead th').forEach((th, i) => { th.classList.toggle('sorted', i === col); th.dataset.dir = i === col ? (dir > 0 ? '▲' : '▼') : ''; });
}
function applyTableSorts() {
  if (typeof document === 'undefined') return;
  const T = UI.tsort = UI.tsort || {};
  document.querySelectorAll('#main table.grid').forEach(tb => { if (!tb.tHead) return; tb.classList.add('sortable'); const s = T[tableKey(tb)]; if (s) sortTable(tb, s[0], s[1]); });
}
if (typeof document !== 'undefined') document.addEventListener('click', e => {
  const th = e.target.closest && e.target.closest('#main table.grid thead th');
  if (!th || e.target.closest('a,button,input,select')) return;
  const tb = th.closest('table'), col = [...th.parentNode.children].indexOf(th), T = UI.tsort = UI.tsort || {}, k = tableKey(tb), cur = T[k];
  const dir = cur && cur[0] === col ? -cur[1] : (typeof cellVal(tb.tBodies[0] && tb.tBodies[0].rows[0] && tb.tBodies[0].rows[0].cells[col]) === 'number' ? -1 : 1);
  T[k] = [col, dir]; sortTable(tb, col, dir);
});
// On a job's page: which industry it sits in and where else its experience counts.
function jobCrossHTML(j) {
  const t = ODD_JOBS.find(x => x.jid === j.id) || POSTS.find(x => x.jid === j.id), ind = j.ind || (t ? postIndustry({ k: t.k, jid: t.jid, odd: !POSTS.includes(t) }) : 'film'), T = TRANSFER[ind] || {};
  const to = Object.entries(T).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${IND_LABEL[k]} (${Math.round(v * 100)}%)`);
  return `<p class="small"><b>${esc(IND_LABEL[ind])}</b>${to.length ? ` · experience here also counts in ${to.join(', ')}` : ''}${t ? ` · typical pay ${fmtCash(usd(t.rate))}/day` : ''}</p>`;
}
// A job posting has its own page: the job, the people, the money, why your odds are what they are.
function viewPost(id) {
  const M = S.me, p = M.board.find(x => x.id === id) || M.jobs.find(x => x.id === id);
  if (!p) return '<section class="panel"><h3>That posting has gone</h3><p class="muted">Jobs come down from the board after a few weeks. Check the board for what\'s open now.</p></section>';
  const t = tmplOf(p) || {}, f = p.film !== null && p.film !== undefined ? S.films[p.film] : null, j = p.jid ? JOBS.jobs.find(x => x.id === p.jid) : null, ind = postIndustry(p), mine = M.jobs.includes(p);
  const F = mine ? [] : hireFactors(p), odds = mine ? null : hireOdds(p), block = mine ? null : blockedFrom(t);
  return `<div class="head"><p class="eyebrow">${esc(IND_LABEL[ind])}${t.tier ? ' · ' + '★'.repeat(t.tier) : ''}${p.away ? ' · in ' + esc(hubName(p.away)) : ''}</p><h2>${esc(p.t)}</h2><p class="lede">${f ? `On ${fl(f.id)}, ${esc(f.status.toLowerCase())}${f.co !== null ? ' for ' + `<a href="#" class="lk" data-go="co:${f.co}">${esc(S.companies[f.co].name)}</a>` : ''}.` : p.mco ? `At ${esc(p.mco)} (${esc(t.biz || '')}).` : esc(t.biz || t.d || '')}${p.head !== null && p.head !== undefined ? ` You'd report to ${pl(p.head)}.` : ''}</p></div>
   <div class="cols two"><section class="panel"><h3>The job</h3>${t.d ? `<p>${esc(t.d)}</p>` : ''}${j && j.resp ? `<ul class="plain">${j.resp.map(x => `<li>• ${esc(x)}</li>`).join('')}</ul>` : ''}${j && j.sk ? `<p class="muted">What it takes: ${j.sk.map(esc).join(' · ')}</p>` : ''}${j && j.before ? `<p class="muted small">People come from: ${esc(j.before)}</p>` : ''}${j && j.after ? `<p class="muted small">It leads to: ${esc(j.after)}</p>` : ''}
    <div class="kpis mini"><div><span>Pay</span><b>${fmtCash(p.rate)}/day</b></div><div><span>Days</span><b>${p.days} a week</b></div><div><span>Length</span><b>${p.weeks} weeks</b></div><div><span>Worth</span><b>${fmtCash(p.rate * p.days * p.weeks)}</b></div></div>${j ? jobCrossHTML(j) : ''}</section>
   <section class="panel"><h3>${mine ? 'You have this job' : 'Your odds'}</h3>${mine ? `<p>Week ${p.done + 1} of about ${p.weeks}.</p>` : `<p class="big">${Math.round(odds * 100)}%</p>${block ? `<p class="bad">⚠ ${esc(block)}: you'll be filtered out.</p>` : ''}<ul class="plain small">${F.filter(x => Math.abs(x[1]) >= .05).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<li><span class="${v > 0 ? 'good' : 'bad'}">${v > 0 ? '▲' : '▼'}</span> ${esc(k)}</li>`).join('')}</ul><p class="muted small">Tick "Apply" on the board to send an application this week.</p>`}</section></div>`;
}
