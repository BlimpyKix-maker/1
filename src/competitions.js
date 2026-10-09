// ---------------- Competitions ----------------
// The contest circuit, from the fellowships that change careers to the gloriously silly ones that just make good
// stories. Each has a deadline month, a fee, the thing you submit and the skill that judges it. Enter in the month
// it closes or the month before; results arrive weeks later. Your craft decides your odds; the roll decides the
// night. Major ones open doors. Fun ones mostly give you a trophy, a story and a few new friends.
// tier: major | industry | fun. stat: what's judged. need: 'script' to submit a finished script.
const COMPS = [
  // ---- writing ----
  { k: 'fellow', cat: 'write', tier: 'major', name: 'The Screenwriting Fellowship', month: 4, fee: 60, stat: 'struc', dc: 17, need: 'script', prize: 35000, stand: 4, fame: 4, d: 'A year\'s salary to write, and a room full of producers.' },
  { k: 'lab', cat: 'write', tier: 'major', name: 'The Screenwriters Lab', month: 9, fee: 40, stat: 'orig', dc: 16, need: 'script', prize: 0, stand: 5, fame: 2, meet: 2, d: 'A week in the mountains with mentors. No money; enormous doors.' },
  { k: 'festcomp', cat: 'write', tier: 'industry', name: 'The Festival Screenplay Competition', month: 2, fee: 50, stat: 'struc', dc: 14, need: 'script', prize: 5000, stand: 2, fame: 1, d: 'Prize money and a staged reading at the festival.' },
  { k: 'firstten', cat: 'write', tier: 'industry', name: 'The First Ten Pages Prize', month: 6, fee: 25, stat: 'dial', dc: 13, need: 'script', prize: 1500, stand: 1, d: 'Judges read your first ten pages and nothing else. Make them count.' },
  { k: 'horrorpages', cat: 'write', tier: 'industry', name: 'Fright Pages: the Horror Script Showdown', month: 9, fee: 30, stat: 'orig', dc: 13, need: 'script', genre: 'Horror', prize: 2500, stand: 1, d: 'Horror scripts only. The winner gets read by every genre producer in town.' },
  { k: 'comedypages', cat: 'write', tier: 'industry', name: 'The Funny Pages Comedy Script Award', month: 3, fee: 30, stat: 'dial', dc: 13, need: 'script', genre: 'Comedy', prize: 2500, stand: 1, d: 'Comedy scripts, judged by working comics. Brutal, fair, and loud.' },
  { k: 'logline', cat: 'write', tier: 'fun', name: 'The Logline Limerick Prize', month: 0, fee: 5, stat: 'orig', dc: 11, prize: 100, d: 'Pitch a film in a five-line limerick. The winner is read aloud at a pub.' },
  { k: 'baddialogue', cat: 'write', tier: 'fun', name: 'The Bad Dialogue Slam', month: 7, fee: 0, stat: 'dial', dc: 11, prize: 50, meet: 1, d: 'Write the worst line of dialogue imaginable. Performed by actors with straight faces.' },
  // ---- directing & shorts ----
  { k: 'shortfest', cat: 'direct', tier: 'major', name: 'The International Short Film Festival', month: 1, fee: 45, stat: 'vstory', dc: 17, prize: 10000, stand: 5, fame: 4, meet: 2, d: 'The short film festival that launched half the directors you admire.' },
  { k: 'microshort', cat: 'direct', tier: 'industry', name: 'The Micro-Short Competition', month: 5, fee: 15, stat: 'tone', dc: 13, prize: 1000, stand: 1, d: 'Films under three minutes. Shown before features in thirty cinemas.' },
  { k: 'fortyeight', cat: 'direct', tier: 'fun', name: 'The 48-Hour Film Race', month: 8, fee: 30, stat: 'vis', dc: 12, prize: 300, energy: -20, meet: 3, d: 'Write, shoot and cut a film in one weekend. You get a genre, a prop and a line of dialogue on Friday night.' },
  { k: 'onetake', cat: 'direct', tier: 'fun', name: 'The One-Take Wonder', month: 4, fee: 10, stat: 'stag', dc: 12, prize: 200, d: 'A whole short in a single unbroken shot. Every mistake is in the film.' },
  { k: 'phonefest', cat: 'direct', tier: 'fun', name: 'The Pocket Film Festival', month: 10, fee: 0, stat: 'vis', dc: 11, prize: 150, meet: 1, d: 'Films shot entirely on a phone. Some of them are extraordinary.' },
  { k: 'tensec', cat: 'direct', tier: 'fun', name: 'Ten-Second Horror', month: 9, fee: 0, stat: 'tone', dc: 11, prize: 100, d: 'Scare a crowd in ten seconds or less. Screened at midnight on Halloween.' },
  { k: 'worstfilm', cat: 'direct', tier: 'fun', name: 'The Golden Turkey (Intentionally Terrible Film Award)', month: 3, fee: 10, stat: 'comic', dc: 12, prize: 250, meet: 2, d: 'Make the worst film you possibly can, on purpose. Harder than it sounds.' },
  // ---- camera, editing, sound ----
  { k: 'dpshowcase', cat: 'craft', tier: 'major', name: 'The Emerging Cinematographers Showcase', month: 6, fee: 40, stat: 'light', dc: 16, prize: 5000, stand: 4, fame: 2, meet: 2, d: 'Ten new cinematographers chosen each year. Producers watch the reel.' },
  { k: 'locphoto', cat: 'craft', tier: 'fun', name: 'The Location Scout Photo Hunt', month: 5, fee: 5, stat: 'comp', dc: 11, prize: 120, d: 'One day, one city, one theme. Find the frame nobody else did.' },
  { k: 'edcutoff', cat: 'craft', tier: 'industry', name: 'The Editors\' Cut-Off', month: 3, fee: 20, stat: 'rhythm', dc: 14, prize: 2000, stand: 2, meet: 1, d: 'Everyone cuts the same raw footage. The judges are working editors.' },
  { k: 'faketrailer', cat: 'craft', tier: 'fun', name: 'Trailer for a Film That Doesn\'t Exist', month: 11, fee: 0, stat: 'shape', dc: 11, prize: 150, meet: 1, d: 'Cut a trailer from stock footage for an imaginary blockbuster. The audience votes.' },
  { k: 'foleyolympics', cat: 'craft', tier: 'fun', name: 'The Foley Olympics', month: 7, fee: 10, stat: 'sound', dc: 11, prize: 120, meet: 1, d: 'Live sound effects to a silent clip, against the clock, with a box of junk.' },
  { k: 'sounddesign', cat: 'craft', tier: 'industry', name: 'The Sound Design Remix Challenge', month: 10, fee: 15, stat: 'sound', dc: 14, prize: 1500, stand: 2, d: 'Strip a famous clip of its sound and rebuild it from scratch.' },
  // ---- design, costume, effects, stunts ----
  { k: 'miniature', cat: 'craft', tier: 'industry', name: 'The Production Design Miniature Challenge', month: 2, fee: 20, stat: 'sets', dc: 14, prize: 1500, stand: 2, d: 'Build a set in a shoebox. The best ones are shot with a periscope lens.' },
  { k: 'costumesketch', cat: 'craft', tier: 'industry', name: 'The Costume Design Sketch Prize', month: 8, fee: 20, stat: 'wardrobe', dc: 14, prize: 1500, stand: 2, d: 'Design the costumes for a classic novel nobody has filmed yet.' },
  { k: 'cosplay', cat: 'craft', tier: 'fun', name: 'Cosplay-a-Classic', month: 9, fee: 10, stat: 'wardrobe', dc: 11, prize: 150, meet: 2, d: 'Recreate a famous film costume from scratch. Points for accuracy, more for nerve.' },
  { k: 'midnightparade', cat: 'craft', tier: 'fun', name: 'The Midnight Movie Costume Parade', month: 9, fee: 0, stat: 'cha', dc: 10, prize: 60, meet: 2, d: 'Dress as anyone from a cult film and walk the aisle before the midnight screening.' },
  { k: 'vfxreel', cat: 'craft', tier: 'industry', name: 'The VFX Breakdown Reel Awards', month: 1, fee: 25, stat: 'digi', dc: 14, prize: 2000, stand: 2, d: 'Show the shot before and after. The best breakdowns go viral among artists.' },
  { k: 'puppetepic', cat: 'craft', tier: 'fun', name: 'The Paper-Bag Puppet Epic', month: 6, fee: 5, stat: 'prac', dc: 11, prize: 100, d: 'Retell a war epic with puppets made from paper bags. Somehow always moving.' },
  { k: 'stuntreel', cat: 'craft', tier: 'industry', name: 'The Stunt Reel Showcase', month: 4, fee: 20, stat: 'stunt', dc: 14, prize: 1500, stand: 2, meet: 1, d: 'Coordinators scout the year\'s new performers here.' },
  { k: 'storyboardduel', cat: 'craft', tier: 'fun', name: 'The Speed-Storyboarding Duel', month: 11, fee: 5, stat: 'vstory', dc: 11, prize: 80, meet: 1, d: 'Two artists, one scene, ten minutes, a live crowd.' },
  // ---- music ----
  { k: 'composerprize', cat: 'music', tier: 'major', name: 'The Young Film Composer Prize', month: 5, fee: 35, stat: 'score', dc: 16, prize: 7500, stand: 4, fame: 2, meet: 1, d: 'Score a five-minute scene; the winner\'s cue is recorded by a full orchestra.' },
  { k: 'scorekaraoke', cat: 'music', tier: 'fun', name: 'Film Score Karaoke Night', month: 1, fee: 0, stat: 'song', dc: 10, prize: 50, meet: 2, d: 'Sing the main themes from famous films. There are no words. That\'s the joke.' },
  { k: 'themehum', cat: 'music', tier: 'fun', name: 'Hum That Theme', month: 6, fee: 0, stat: 'theme', dc: 11, prize: 60, d: 'Write a theme so catchy a stranger can hum it back after one listen.' },
  // ---- acting ----
  { k: 'monologue', cat: 'act', tier: 'industry', name: 'The Casting Directors\' Monologue Slam', month: 2, fee: 15, stat: 'range', dc: 14, prize: 1000, stand: 2, meet: 2, d: 'Two minutes in front of twelve casting directors. Some careers start here.' },
  { k: 'selftape', cat: 'act', tier: 'industry', name: 'Self-Tape of the Year', month: 7, fee: 10, stat: 'pres', dc: 13, prize: 800, stand: 1, d: 'The best audition tape anyone sent this year, chosen by working casting teams.' },
  { k: 'silentnight', cat: 'act', tier: 'fun', name: 'Silent Film Revival Night', month: 10, fee: 5, stat: 'phys', dc: 11, prize: 100, meet: 1, d: 'Perform a silent comedy routine to a live pianist. No words allowed.' },
  { k: 'lipsync', cat: 'act', tier: 'fun', name: 'Lip-Sync a Classic Scene', month: 3, fee: 0, stat: 'pres', dc: 10, prize: 60, meet: 2, d: 'Mime a famous scene to the original soundtrack. The crowd goes feral for it.' },
  { k: 'improvwars', cat: 'act', tier: 'fun', name: 'Improv Wars: the Genre Swap', month: 8, fee: 5, stat: 'impro', dc: 11, prize: 80, meet: 2, d: 'Play a scene; the host shouts a new genre every thirty seconds.' },
  // ---- producing, taste, everyone ----
  { k: 'pitchathon', cat: 'produce', tier: 'industry', name: 'The Pitch-a-Thon', month: 0, fee: 25, stat: 'pack', dc: 14, prize: 3000, stand: 2, meet: 2, d: 'Three minutes to pitch a project to a panel of financiers. They do sometimes buy.' },
  { k: 'budgetbattle', cat: 'produce', tier: 'fun', name: 'The Micro-Budget Battle', month: 5, fee: 5, stat: 'bud', dc: 11, prize: 100, d: 'Budget a feature for the price of a used car. Most creative spreadsheet wins.' },
  { k: 'trivialeague', cat: 'fun', tier: 'fun', name: 'The Film Trivia League Final', month: 11, fee: 10, stat: 'tas', dc: 12, prize: 200, meet: 2, d: 'Teams of four in the back room of a cinema bar. Rivalries go back decades.' },
  { k: 'bakeoff', cat: 'fun', tier: 'fun', name: 'The Craft Services Bake-Off', month: 4, fee: 5, stat: 'eth', dc: 10, prize: 75, meet: 2, d: 'Crews vote on the best thing you can make for a 4 a.m. call. Bribery encouraged.' },
  { k: 'petcinema', cat: 'fun', tier: 'fun', name: 'Pet Cinema Shorts', month: 6, fee: 0, stat: 'cha', dc: 10, prize: 50, meet: 1, d: 'Films starring pets. Judged by a panel that includes a very old dog.' },
  { k: 'criticsquiz', cat: 'fun', tier: 'fun', name: 'Guess the Film from One Frame', month: 2, fee: 0, stat: 'tas', dc: 12, prize: 80, d: 'One still, ten seconds, name the film. Cinephiles weep openly.' },
  { k: 'remakepitch', cat: 'fun', tier: 'fun', name: 'Remake It Worse: the Pitch Night', month: 9, fee: 0, stat: 'comic', dc: 11, prize: 60, meet: 2, d: 'Pitch the most cynical remake of a beloved classic. The audience boos the winner.' }
];
const COMP_CAT = { all: 'All', fits: 'Fits you', write: 'Writing', direct: 'Directing & shorts', craft: 'Crafts', music: 'Music', act: 'Acting', produce: 'Producing', fun: 'Just for fun' };
const COMP_TIER = { major: ['Major', 'bad'], industry: ['Industry', 'hist'], fun: ['Just for fun', 'good'] };
function compOpen(c) { const m = dateOf(S.week).getUTCMonth(); return c.month === m || c.month === (m + 1) % 12; }
function compFits(c) { const me = ME(), main = MAIN[me.role]; return (CRAFTS[main] && CRAFTS[main].subs[c.stat] !== undefined) || (c.genre && S.me.love.includes(c.genre)); }
// the real target for an entry: the contest's bar, a little higher for majors, moved by what you send in. The odds on
// the card use exactly this number.
function compDC(c, sc) {
  let dc = c.dc + (c.tier === 'major' ? 1 : 0);
  if (c.need === 'script' && sc) dc -= Math.round((sc.score - 60) / 6) + (c.genre && sc.genre === c.genre ? 2 : c.genre ? -4 : 0);
  if (c.work && typeof compWorkBest === 'function') { const b = compWorkBest(c); if (b >= 0) dc -= Math.round((b - 60) / 6); }
  return dc;
}
function compScript(c) { const L = (S.me.scripts || []).filter(x => x.grade); const id = UI['comp-sc-' + c.k]; return L.find(x => String(x.id) === String(id)) || L[L.length - 1] || null; }
// why you can't enter right now (null when you can): every lock says what it is
function compBlock(c) {
  const M = S.me, me = ME();
  if (!compOpen(c)) return `Entries open in ${MON[(c.month + 11) % 12]}`;
  if (compEntered(c)) return 'Already entered this year';
  if (M.cash < usd(c.fee)) return `The fee is ${fmtCash(usd(c.fee))}; you have ${fmtCash(Math.max(0, M.cash))}`;
  if (c.need === 'script' && !(M.scripts || []).some(x => x.grade)) return 'Needs a finished script (write one on the Create tab)';
  if (c.work && typeof compWorkBest === 'function' && compWorkBest(c) < 0) return `Needs a released ${(typeof WORK_NEED_LABEL !== 'undefined' && WORK_NEED_LABEL[c.work[0]]) || 'work'} of yours`;
  if (c.energy && M.energy + c.energy < 5) return `Too tired: it costs ${-c.energy} energy and you have ${Math.round(M.energy)}`;
  if (c.genre && c.need === 'script' && !(M.scripts || []).some(x => x.grade && x.genre === c.genre)) return `${c.genre} scripts only: you'd be marked down without one`;
  return null;
}
function compEntered(c) { const y = yearOf(S.week); return (S.me.comps || []).some(e => e.k === c.k && e.y === y); }
// Enter: pay, roll now (the logged action carries it), learn the result when the judges are done.
function enterComp(a) {
  const M = S.me, me = ME(), c = COMPS.find(x => x.k === a.k);
  if (!c || !compOpen(c) || compEntered(c) || M.cash < usd(c.fee)) return false;
  let sc = null;
  if (c.need === 'script') { sc = (M.scripts || []).find(x => x.id === a.script && x.grade); if (!sc) return false; }
  M.cash -= usd(c.fee);
  if (c.energy) M.energy = clamp(M.energy + c.energy, 0, 100);
  const ok = roll(c.stat, compDC(c, sc)), r = M.lastRoll, margin = r.d + r.mod - r.DC;
  // a natural 20 gets you into the final; only real quality wins it
  const place = ok ? (margin >= 6 || (r.crit > 0 && margin >= 2) ? 'win' : margin >= 3 ? 'runner' : 'final') : margin >= -3 ? 'mention' : 'out';
  (M.comps = M.comps || []).push({ k: c.k, y: yearOf(S.week), w: S.week, due: S.week + (c.tier === 'fun' ? 1 : c.tier === 'industry' ? 4 : 8), place, script: sc ? sc.id : null, roll: r });
  diary(`You enter ${c.name}${sc ? ' with ' + sc.title : ''}.`);
  return true;
}
const PLACE_LABEL = { win: 'Winner', runner: 'Runner-up', final: 'Finalist', mention: 'Honourable mention', out: 'Not placed' };
function compWeek() {
  const M = S.me, me = ME();
  for (const e of (M.comps || []).filter(x => !x.told && x.due <= S.week)) {
    e.told = 1;
    const c = COMPS.find(x => x.k === e.k), sc = e.script !== null ? (M.scripts || []).find(x => x.id === e.script) : null, f = { win: 1, runner: .5, final: .3, mention: .1, out: 0 }[e.place];
    if (f > 0) {
      if (c.prize && (e.place === 'win' || e.place === 'runner')) M.cash += usd(Math.round(c.prize * (e.place === 'win' ? 1 : .3)));
      me.standing = clamp(me.standing + (c.stand || .3) * f, 0, 100); me.fame = clamp((me.fame || 0) + (c.fame || 0) * f, 0, 100);
      for (let i = 0; i < Math.round((c.meet || 0) * f + (e.place === 'win' ? .5 : 0)); i++) { const q = bestIn(M.hub, ROLES, q => -Math.abs(q.standing - me.standing - 5) + hashRand(e.w * 31 + i + c.k.length)() * 30); if (q) meet(q.id, `Met at ${c.name}`, 5); }
      if (sc && e.place === 'win') { sc.won = (sc.won || []).concat(c.name); if (c.tier !== 'fun' && typeof contestMayOption === 'function') contestMayOption(sc); }
    }
    const t = { win: c.tier === 'fun' ? `You won. There is a trophy, and it is ridiculous. ${c.prize ? fmtCash(usd(c.prize)) + ' and ' : ''}bragging rights forever.` : `You won${c.prize ? ': ' + fmtCash(usd(c.prize)) : ''}. ${c.tier === 'major' ? 'Agents start calling. Producers want meetings.' : 'Your name goes round the right rooms.'}`, runner: 'Runner-up. Close enough to taste it, and the judges remember you.', final: 'You made the final. Not this year, but you were in the room.', mention: 'An honourable mention. A small line in a long list, but a line.', out: c.tier === 'fun' ? 'You didn\'t place. You had a great night anyway.' : 'Not placed. Thousands enter. Try again next year.' }[e.place];
    inbox(e.place === 'win' || e.place === 'runner' ? 'news' : 'note', `${c.name}: ${PLACE_LABEL[e.place].toLowerCase()}`, `${sc ? sc.title + '. ' : ''}${t}`);
    if (e.place === 'win') milestone(`Won ${c.name}${sc ? ' with ' + sc.title : ''}`, c.tier === 'fun' ? 'life' : 'prize');
  }
}
// On a contest's own page: the rules, when it runs, your odds, and every time you've entered.
function contestRulesHTML(c) {
  const M = S.me, T = COMP_TIER[c.tier], mine = ((M && M.comps) || []).filter(e => e.k === c.k).slice().reverse();
  return `<section class="panel"><h3>How it works</h3><p>${chip(T[0], T[1])} ${esc(c.d)}</p>
   <p class="small">Closes in <b>${MON[c.month]}</b>, entries open the month before · entry ${c.fee ? fmtCash(usd(c.fee)) : 'free'}${c.prize ? ' · prize ' + fmtCash(usd(c.prize)) : ''} · judged on <b>${esc(statLabel(c.stat).toLowerCase())}</b>${c.need === 'script' ? ' · needs a finished script' : ''}${c.genre ? ' · ' + esc(c.genre.toLowerCase()) + ' only' : ''}${c.energy ? ' · a hard weekend' : ''}.</p>
   ${M ? `<p class="small">Your odds today: ${oddsBar(c.stat, compDC(c, c.need === 'script' ? compScript(c) : null))}${compFits(c) ? ' ' + chip('Fits you', 'good') : ''}</p><p class="small">${compOpen(c) ? (compEntered(c) ? '<b>You\'ve entered this year.</b>' : 'Entries are open now: <button class="linkish" data-dtab="compete">enter from the Contests tab</button>.') : `Entries open in ${MON[(c.month + 11) % 12]}.`}</p>
   <h4>Your entries</h4>${mine.length ? `<ul class="plain small">${mine.map(e => `<li>${e.y}: ${e.told ? `<b>${PLACE_LABEL[e.place]}</b>` : 'waiting on the judges'}</li>`).join('')}</ul>` : '<p class="muted small">You haven\'t entered yet.</p>'}` : ''}</section>`;
}
function compPanel() {
  const M = S.me, f = UI.compf || 'all', y = yearOf(S.week), scripts = (M.scripts || []).filter(x => x.grade);
  let L = COMPS.slice().sort((a, b) => ((a.month - dateOf(S.week).getUTCMonth() + 12) % 12) - ((b.month - dateOf(S.week).getUTCMonth() + 12) % 12));
  if (f === 'fits') L = L.filter(compFits); else if (f !== 'all') L = L.filter(c => f === 'fun' ? c.tier === 'fun' : c.cat === f);
  const mine = (M.comps || []).slice().reverse();
  const shelf = mine.filter(e => e.told && e.place !== 'out');
  const card = c => {
    const open = compOpen(c), done = compEntered(c), e = (M.comps || []).find(x => x.k === c.k && x.y === y), fits = compFits(c), T = COMP_TIER[c.tier];
    const scSel = c.need === 'script' ? (scripts.length ? sel('comp-sc-' + c.k, scripts.map(s => [String(s.id), `${s.title} (${s.grade})`]), UI['comp-sc-' + c.k] || String(scripts[scripts.length - 1].id)) : '<span class="muted small">Needs a finished script</span>') : c.work && typeof compWorkBest === 'function' ? (compWorkBest(c) >= 0 ? `<span class="small muted">Your best ${esc(WORK_NEED_LABEL[c.work[0]] || 'work')} (quality ${compWorkBest(c)}) is your entry</span>` : `<span class="muted small">Needs a released ${esc(WORK_NEED_LABEL[c.work[0]] || 'work')}</span>`) : '';
    return `<div class="comp${fits ? ' fits' : ''}"><div class="ch"><b>${compLink(c)}</b> ${chip(T[0], T[1])}${fits ? ' ' + chip('Fits you', 'good') : ''}</div><p class="small">${esc(c.d)}</p>
     <p class="small muted">Closes in ${MON[c.month]} · entry ${c.fee ? fmtCash(usd(c.fee)) : 'free'}${c.prize ? ' · prize ' + fmtCash(usd(c.prize)) : ''}${c.energy ? ' · a hard weekend' : ''}${c.genre ? ' · ' + esc(c.genre.toLowerCase()) + ' only' : ''} · judged on ${esc(statLabel(c.stat).toLowerCase())}</p>
     ${done ? `<p class="small"><b>Entered.</b> ${e.told ? PLACE_LABEL[e.place] : 'Waiting on the judges.'}</p>` : open ? `<div class="crow">${scSel}${oddsBar(c.stat, compDC(c, c.need === 'script' ? compScript(c) : null))}${(() => { const why = compBlock(c), soft = why && /marked down/.test(why); return `<button class="btn-s" data-comp="${c.k}" ${why && !soft ? `disabled title="${esc(why)}"` : ''}>Enter</button></div>${why ? `<p class="small ${soft ? 'muted' : 'bad'}">${esc(why)}</p>` : ''}`; })()}` : `<p class="small muted">Opens ${MON[(c.month + 11) % 12]}.</p>`}</div>`;
  };
  return `<section class="panel comps"><h3>Competitions</h3><p class="muted small">Entries open the month before each deadline. Your craft sets the odds; the roll on the day decides. Major prizes open doors; the fun ones give you trophies, stories and new friends.</p>
   <div class="fchips">${Object.entries(COMP_CAT).map(([k, l]) => `<button class="fchip${f === k ? ' on' : ''}" data-compf="${k}">${esc(l)}</button>`).join('')}</div>
   <div class="compgrid">${L.map(card).join('')}</div></section>
   <section class="panel"><h3>Your trophy shelf</h3>${shelf.length ? `<ul class="plain">${shelf.map(e => { const c = COMPS.find(x => x.k === e.k); return `<li>${e.place === 'win' ? '🏆' : e.place === 'runner' ? '🥈' : e.place === 'final' ? '🎖️' : '📜'} <b>${PLACE_LABEL[e.place]}</b>, ${compLink(c)} <span class="muted small">${e.y}</span></li>`; }).join('')}</ul>` : '<p class="muted">Nothing on the shelf yet.</p>'}</section>`;
}
