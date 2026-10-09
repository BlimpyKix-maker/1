// ---------------- More prizes: contests for every field, a bigger shorts circuit, and your awards season ----------------
// Contests now cover every part of the business (online video, audio, theatre, comedy, more music, more writing and
// producing) and some judge your released work rather than a roll on a skill alone: your best song, video, episode or
// play gives the judges something to hold. The short-film circuit gains twenty festivals (genre, comedy, animation,
// documentary, queer cinema, music video, mobile, regional) and you can choose where to send each short yourself.
// The Awards page gets a season tracker for your own films and work: what's eligible, how it's likely to do.

// ---- contests ----
const MORE_COMPS = [
  // online
  { k: 'creatorawards', cat: 'online', tier: 'major', name: 'The Creator Awards', month: 10, fee: 30, stat: 'vstory', dc: 16, work: ['video', 'blip'], prize: 15000, stand: 3, fame: 6, meet: 2, d: 'The online video Oscars: a gala, a live stream, and every platform executive in one room.' },
  { k: 'essayprize', cat: 'online', tier: 'industry', name: 'The Video Essay Prize', month: 2, fee: 15, stat: 'tas', dc: 14, work: ['video'], prize: 3000, stand: 2, fame: 2, d: 'Judged by critics and film scholars: the best argument made in pictures this year.' },
  { k: 'blipfest', cat: 'online', tier: 'industry', name: 'BlipFest: the Short-Form Awards', month: 6, fee: 10, stat: 'comic', dc: 13, work: ['blip'], prize: 2000, fame: 3, meet: 1, d: 'Sixty seconds, a million judges, and a panel that decides anyway.' },
  { k: 'thumbwars', cat: 'online', tier: 'fun', name: 'Thumbnail Wars', month: 8, fee: 0, stat: 'comp', dc: 11, prize: 80, d: 'One frame, a face, three words. Make strangers click.' },
  { k: 'charitystream', cat: 'online', tier: 'fun', name: 'The 24-Hour Charity Stream', month: 11, fee: 0, stat: 'cha', dc: 11, prize: 0, energy: -25, stand: 1, fame: 1, meet: 2, d: 'Stay live for a whole day for a good cause. Somewhere around hour nineteen, something magical happens.' },
  // audio
  { k: 'audioawards', cat: 'audio', tier: 'major', name: 'The Audio Awards', month: 4, fee: 30, stat: 'voice', dc: 16, work: ['podcast'], prize: 10000, stand: 4, fame: 4, meet: 2, d: 'The podcast world\'s big night. Winners get a network meeting by Monday.' },
  { k: 'pilotpitch', cat: 'audio', tier: 'industry', name: 'The Podcast Pilot Pitch', month: 8, fee: 20, stat: 'pack', dc: 14, prize: 5000, stand: 2, meet: 2, d: 'Pitch a show to three networks on stage. One of them funds a season.' },
  { k: 'radioplay', cat: 'audio', tier: 'industry', name: 'The Radio Drama Script Prize', month: 1, fee: 20, stat: 'dial', dc: 14, prize: 2500, stand: 2, d: 'Write for the ear. The winner is produced by a national broadcaster.' },
  { k: 'soundwalk', cat: 'audio', tier: 'fun', name: 'The Night Sound Walk', month: 9, fee: 5, stat: 'sound', dc: 10, prize: 50, meet: 2, d: 'Record a city at night in one hour. The best soundscape plays at the after-party.' },
  // theatre
  { k: 'newplay', cat: 'stage', tier: 'major', name: 'The New Play Prize', month: 3, fee: 35, stat: 'struc', dc: 16, work: ['play', 'musical'], prize: 12000, stand: 5, fame: 3, meet: 2, d: 'A full production at a major theatre for the winning play. Past winners are now on syllabuses.' },
  { k: 'tenminute', cat: 'stage', tier: 'industry', name: 'The Ten-Minute Play Festival', month: 7, fee: 15, stat: 'dial', dc: 13, prize: 1000, stand: 2, meet: 2, d: 'Ten plays, ten minutes each, one night, one audience vote.' },
  { k: 'musicalwriters', cat: 'stage', tier: 'industry', name: 'The Musical Theatre Writers\' Showcase', month: 10, fee: 20, stat: 'song', dc: 14, work: ['musical', 'song'], prize: 4000, stand: 2, meet: 2, d: 'Three songs from a musical in development, sung for producers who can make it happen.' },
  { k: 'fringefirst', cat: 'stage', tier: 'industry', name: 'The Fringe First Award', month: 7, fee: 10, stat: 'tas', dc: 14, work: ['play', 'musical'], prize: 0, stand: 3, fame: 2, d: 'For the best new writing at the fringe. Transfers follow it around like gulls.' },
  { k: 'bardslam', cat: 'stage', tier: 'fun', name: 'The Shakespeare Slam', month: 3, fee: 0, stat: 'range', dc: 11, prize: 60, meet: 2, d: 'A speech from the canon, any style. Last year\'s winner did Lear as a cowboy.' },
  // comedy
  { k: 'newact', cat: 'comedy', tier: 'major', name: 'New Act of the Year', month: 9, fee: 20, stat: 'comic', dc: 16, prize: 6000, stand: 3, fame: 5, meet: 3, d: 'Five minutes in a theatre full of bookers and commissioners. Careers start here, loudly.' },
  { k: 'sketchfest', cat: 'comedy', tier: 'industry', name: 'Sketch Fest', month: 5, fee: 15, stat: 'impro', dc: 13, prize: 1500, stand: 2, meet: 2, d: 'Troupes from every city. Television scouts sit in the back with notebooks.' },
  { k: 'funnyshort', cat: 'comedy', tier: 'industry', name: 'The Funny Short Film Festival', month: 2, fee: 15, stat: 'comic', dc: 14, prize: 2000, stand: 2, fame: 2, d: 'Comedy shorts only. The audience laughs or it doesn\'t.' },
  { k: 'roastbattle', cat: 'comedy', tier: 'fun', name: 'The Roast Battle', month: 11, fee: 5, stat: 'impro', dc: 12, prize: 100, meet: 2, d: 'Insult a stranger for three minutes. They insult you back. Everyone hugs after.' },
  // music
  { k: 'songcomp', cat: 'music', tier: 'major', name: 'The International Songwriting Competition', month: 8, fee: 35, stat: 'song', dc: 16, work: ['song'], prize: 20000, stand: 3, fame: 4, meet: 2, d: 'Tens of thousands of entries, judged by songwriters with hits you know.' },
  { k: 'bandbattle', cat: 'music', tier: 'industry', name: 'Battle of the Bands', month: 4, fee: 15, stat: 'pres', dc: 13, prize: 2500, fame: 2, meet: 3, d: 'Twenty minutes, a borrowed drum kit and a label scout who leaves at nine.' },
  { k: 'mvawards', cat: 'music', tier: 'industry', name: 'The Music Video Awards: New Talent', month: 9, fee: 20, stat: 'vstory', dc: 14, work: ['mv'], prize: 3000, stand: 2, fame: 2, meet: 2, d: 'Directors and artists, judged on the video alone.' },
  { k: 'beatbattle', cat: 'music', tier: 'fun', name: 'The Beat Battle', month: 6, fee: 5, stat: 'sound', dc: 11, prize: 120, meet: 2, d: 'Same sample, ninety seconds, a crowd that knows exactly what it likes.' },
  // writing
  { k: 'tvpilotcomp', cat: 'write', tier: 'industry', name: 'The TV Pilot Competition', month: 7, fee: 40, stat: 'struc', dc: 14, need: 'script', prize: 5000, stand: 2, meet: 2, d: 'Read by showrunners. Finalists get general meetings at networks.' },
  { k: 'shortscript', cat: 'write', tier: 'industry', name: 'The Short Script Prize', month: 11, fee: 20, stat: 'orig', dc: 13, need: 'script', prize: 2000, stand: 1, d: 'The winning script is made, with you on set.' },
  { k: 'writersprog', cat: 'write', tier: 'major', name: 'The Network Writers Programme', month: 5, fee: 0, stat: 'char', dc: 17, need: 'script', prize: 40000, stand: 5, fame: 2, meet: 3, d: 'A paid year inside a network, writing on real shows. Thousands apply for eight places.' },
  // producing and directing
  { k: 'docforum', cat: 'produce', tier: 'industry', name: 'The Documentary Pitch Forum', month: 10, fee: 30, stat: 'pack', dc: 14, prize: 10000, stand: 2, meet: 3, d: 'Pitch a documentary to commissioners from twelve countries. Money changes hands on the spot.' },
  { k: 'coprodmarket', cat: 'produce', tier: 'major', name: 'The Co-Production Market', month: 1, fee: 50, stat: 'fin', dc: 16, prize: 25000, stand: 4, meet: 4, d: 'Fifty projects, every financier in Europe, and a week of very long dinners.' },
  { k: 'startupnight', cat: 'produce', tier: 'fun', name: 'Media Startup Pitch Night', month: 4, fee: 0, stat: 'fin', dc: 12, prize: 200, meet: 2, d: 'Pitch an app nobody needs to investors who fund it anyway.' },
  { k: 'midnightshorts', cat: 'direct', tier: 'industry', name: 'The Midnight Genre Shorts', month: 9, fee: 15, stat: 'tone', dc: 13, prize: 1500, stand: 1, fame: 2, meet: 2, d: 'Horror, sci-fi and weird shorts for a crowd of genre obsessives at midnight.' },
  { k: 'animprize', cat: 'direct', tier: 'industry', name: 'The Animated Short Prize', month: 5, fee: 20, stat: 'digi', dc: 14, prize: 3000, stand: 2, d: 'Hand-drawn, stop-motion, computer or cut-paper: judged by animators.' },
  { k: 'voiceshow', cat: 'act', tier: 'industry', name: 'The Voice Acting Showcase', month: 8, fee: 10, stat: 'voice', dc: 13, prize: 1000, stand: 1, meet: 2, d: 'Casting directors for games, animation and dubbing listen with their eyes closed.' }
];
for (const c of MORE_COMPS) if (!COMPS.some(x => x.k === c.k)) COMPS.push(c);
Object.assign(COMP_CAT, { online: 'Online video', audio: 'Audio', stage: 'Theatre', comedy: 'Comedy' });
const WORK_NEED_LABEL = { video: 'video', blip: 'clip', podcast: 'episode', play: 'play', musical: 'musical', song: 'song', mv: 'music video' };
function compWorkBest(c) { return (S.me.works || []).filter(w => w.rel !== undefined && c.work.includes(w.type)).reduce((m, w) => Math.max(m, w.q), -1); }
{ const _enter = enterComp;
  // contests that judge your released work: your best piece of the right kind is your entry
  enterComp = function (a) {
    const c = COMPS.find(x => x.k === a.k);
    if (c && c.work && compWorkBest(c) < 0) return false;   // the work's bonus is in compDC
    return _enter(a);
  };
}

// ---- the shorts circuit, bigger ----
const MORE_SHORT_FESTS = [
  ['sundog', 'Sundog Shorts', 'hollywood', 1985, 1, 'all', 0, 1, 'Short Film Grand Jury Prize'],
  ['tribeca', 'Lower Manhattan Shorts', 'newyork', 2002, 2, 'all', 3, 1, 'Best Narrative Short'],
  ['torontoshorts', 'Toronto Shorts International', 'toronto', 2009, 2, 'all', 8, 1, 'Best Short'],
  ['hotdocsshort', 'Hot Docs Shorts', 'toronto', 1993, 2, 'doc', 3, 1, 'Best Short Documentary'],
  ['fantasia', 'Fantasia Genre Shorts', 'toronto', 1996, 2, 'genre', 6, 0, 'Golden Raven'],
  ['sitges', 'Sitges Midnight Shorts', 'madrid', 1968, 2, 'genre', 9, 0, 'Méliès d\'Argent'],
  ['zagrebanim', 'Animafest Zagreb', 'budapest', 1972, 1, 'anim', 5, 1, 'Grand Prix'],
  ['ottawaanim', 'Ottawa Animation Festival', 'toronto', 1976, 2, 'anim', 8, 1, 'Grand Prize'],
  ['hiroshima', 'Hiroshima Animation Days', 'tokyo', 1985, 2, 'anim', 7, 0, 'Hiroshima Prize'],
  ['idfashort', 'Amsterdam Documentary Shorts', 'berlin', 1988, 1, 'doc', 10, 1, 'Best Short Documentary'],
  ['outfest', 'Outfest Shorts', 'hollywood', 1982, 2, 'all', 6, 1, 'Grand Jury Award'],
  ['comedyshorts', 'The Laugh Track Shorts', 'london', 2008, 3, 'comedy', 4, 0, 'Funniest Film'],
  ['mvfest', 'Promo Reel: the Music Video Festival', 'london', 2001, 3, 'all', 2, 0, 'Video of the Year'],
  ['mobilefest', 'The Mobile Film Festival', 'paris', 2005, 3, 'all', 11, 0, 'Grand Prix'],
  ['mumbaishorts', 'Mumbai Shorts', 'mumbai', 1990, 2, 'all', 1, 0, 'Golden Conch'],
  ['seoulshorts', 'Seoul Shorts', 'seoul', 2003, 2, 'all', 8, 0, 'Best Short'],
  ['lagosshorts', 'Lagos Short Film Week', 'lagos', 2010, 3, 'all', 10, 0, 'Best Short'],
  ['bafici', 'Buenos Aires Short Cuts', 'buenosaires', 1999, 3, 'all', 3, 0, 'Best Short'],
  ['melbshorts', 'Melbourne Short Film Festival', 'sydney', 1952, 2, 'all', 7, 1, 'City of Melbourne Grand Prix'],
  ['tamperes', 'Tamperes Short Film Festival', 'helsinki', 1970, 2, 'all', 2, 1, 'Grand Prix']
];
for (const [k, name, hub, founded, tier, kind, month, qual, prize] of MORE_SHORT_FESTS) if (!SHORT_FEST[k]) { SHORT_FESTS.push([k, name, hub, founded, tier, kind, month, qual, prize]); SHORT_FEST[k] = { k, name, hub, founded, tier, kind, month, qual, prize }; }
// choose where a short goes: one festival at a time, a fee each, while the short is under a year old
function shortSubmit(a) {
  const M = S.me, w = (M.works || []).find(x => x.id === +a.w && x.type === 'short'), F = SHORT_FEST[a.fk];
  if (!w || !F || !w.circuit || S.week - w.rel > 52 || F.founded > S.year || F.kind === 'student' || (F.kind === 'anim' && ME().sk.digi < 8)) return false;
  if (w.circuit.subs.some(s => s.k === F.k)) return false;
  const fee = usd([0, 75, 50, 30][F.tier]); if (M.cash < fee) return false;
  M.cash -= fee; w.circuit.over = false;
  w.circuit.subs.push({ k: F.k, due: nextMonthWeek(F.month) });
  diary(`Money: ${fmtCash(fee)} to enter ${w.title} at ${F.name}.`);
  return true;
}
function shortsCalendarHTML() {
  const M = S.me, mo = dateOf(S.week).getUTCMonth(), MON_ = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const live = (M.works || []).filter(w => w.type === 'short' && w.circuit && S.week - w.rel <= 52);
  const pick = UI.shw !== undefined ? live.find(w => w.id === UI.shw) || live[0] : live[0];
  const order = Object.values(SHORT_FEST).filter(F => F.founded <= S.year).sort((a, b) => ((a.month - mo + 12) % 12) - ((b.month - mo + 12) % 12) || a.tier - b.tier);
  const row = F => { const sent = pick && pick.circuit.subs.find(s => s.k === F.k), odds = pick ? (typeof shortSelOdds === 'function' ? shortSelOdds(pick.q, F.tier) : .3) : null, ok = pick && F.kind !== 'student' && !(F.kind === 'anim' && ME().sk.digi < 8);
    return `<tr><td><b>${MON_[F.month]}</b></td><td><a href="#" class="lk" data-go="shortfest:${F.k}">${esc(F.name)}</a><br><span class="muted small">${esc(hubName(F.hub))} · ${['', 'A-list', 'major', 'regional'][F.tier]}${F.qual ? ' · Oswald-qualifying' : ''}${F.kind !== 'all' ? ' · ' + esc(F.kind) : ''}</span></td><td class="small">${esc(F.prize)}</td><td class="n small">${fmtCash(usd([0, 75, 50, 30][F.tier]))}</td><td class="small">${odds !== null ? Math.round(odds * 100) + '% to be selected' : ''}</td><td>${!pick ? '' : sent ? `<span class="chip ${sent.res === 'won' ? 'good' : sent.res === 'selected' ? 'good' : sent.res === 'passed' ? '' : 'hist'}">${sent.res || 'entered'}</span>` : ok ? `<button class="btn-s ghost" data-shsub="${pick.id}:${F.k}">Enter</button>` : '<span class="muted small">not eligible</span>'}</td></tr>`; };
  return `<p class="muted small">Every short-film festival, in the order their deadlines come round. Send your short where it has a chance: an A-list premiere makes a name, regional festivals collect laurels. A short stays eligible for a year.</p>
   ${live.length ? `<p>Planning for ${live.length > 1 ? sel('sh-w', live.map(w => [w.id, `${w.title} (quality ${w.q})`]), pick.id) : `<b>${esc(pick.title)}</b> (quality ${pick.q})`} · ${pick.circuit.subs.length} festivals entered · ${(pick.circuit.laurels || []).length} laurels</p>` : '<p class="small">Make a short (Create) to send it round.</p>'}
   <div class="tw"><table class="grid small"><thead><tr><th>Deadline</th><th>Festival</th><th>Top prize</th><th class="n">Fee</th><th>Your odds</th><th></th></tr></thead><tbody>${order.map(row).join('')}</tbody></table></div>`;
}
function shortsClick2(t) { const d = t.dataset; if (d.shsub) { const [w, fk] = d.shsub.split(':'); doAct({ t: 'shortsubmit', w: +w, fk }); render(true); return true; } return false; }
function shortsChange2(e) { if (e.target.id !== 'sh-w') return false; UI.shw = +e.target.value; render(true); return true; }

// ---- your awards season ----
function seasonHTML() {
  const M = S.me; if (!M || !careerActive()) return '';
  const me = ME(), films = (typeof myFilms === 'function' ? myFilms() : []).filter(f => f.rel !== null && S.week - f.rel < 60);
  const works = (M.works || []).filter(w => w.rel !== undefined && S.week - w.rel < 60 && w.q >= 70);
  const gigs = (M.gigs || []).filter(g => S.week - g.w < 60 && g.q >= 80);
  if (!films.length && !works.length && !gigs.length) return '';
  const chance = q => q >= 88 ? ['Front-runner', 'good'] : q >= 80 ? ['In the conversation', 'good'] : q >= 72 ? ['Outside chance', ''] : ['Long shot', 'warm'];
  return `<section class="panel"><h3>Your awards season</h3><p class="small muted">What you made in the last year that could be in the running, and how the trades see it. A campaign (Contests) helps the films.</p><ul class="plain">
   ${films.map(f => { const [l, c] = chance(f.reviews || 0); return `<li>🎬 ${fl(f.id)} <span class="muted small">${f.reviews}/100 · ${esc((f.xc && f.xc[me.id]) || (f.dir === me.id ? 'Director' : f.prod === me.id ? 'Producer' : 'Crew'))}</span> <span class="chip ${c}">${l}</span></li>`; }).join('')}
   ${works.map(w => { const [l, c] = chance(w.q); return `<li>${WORK_TYPES[w.type].icon} <a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a> <span class="muted small">${esc(WORK_TYPES[w.type].label)} · quality ${w.q}</span> <span class="chip ${c}">${l}</span></li>`; }).join('')}
   ${gigs.map(g => `<li>🎥 ${esc(GIG_TYPES[g.k].label)}: ${esc(g.client)} <span class="muted small">quality ${g.q}</span> ${g.res && g.res.prize ? `<span class="chip good">won ${esc(g.res.prize)}</span>` : `<span class="chip">${g.q >= 88 ? 'Shortlist material' : 'Worth entering'}</span>`}</li>`).join('')}</ul></section>`;
}
{ const _va = viewAwards; viewAwards = function () { const h = _va(); const i = h.indexOf('<div class="cols two">'); return i >= 0 ? h.slice(0, i) + seasonHTML() + h.slice(i) : seasonHTML() + h; }; }
