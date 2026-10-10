// ---------------- Acting, properly: parts, auditions, callbacks and the scenes that make a career ----------------
// Every casting call is now a character with a name, a size and a thing it needs (an accent, a fight, a song,
// comic timing, a breakdown on cue), and how well you fit it counts. Auditions are played, not just rolled: play
// it as written, make a bold choice, lean into what the part needs, or bring your own life to it; leads get a
// callback, a chemistry read opposite the star. On set, the big scenes come to you as choices (stay in it all day,
// trust your technique, improvise, ask for one more, do your own stunt) and they move the film, the director's
// opinion of you, and what the critics write when it opens. Between films there's the work actors really do:
// commercials, voice sessions, mo-cap, audiobooks, understudying, murder-mystery dinners, playing patients for
// medical students.

const PART_ARCH = [
  ['the best friend who gets all the good lines', 'comic'], ['a detective who has seen everything', 'range'], ['the villain\'s right hand', 'phys'], ['the love interest', 'pres'],
  ['a night-shift nurse', 'range'], ['the bartender who knows everyone\'s secrets', 'impro'], ['a diplomat from somewhere else', 'lang'], ['the singer at the club', 'voice'],
  ['a boxer on the way down', 'phys'], ['the ghost in the house', 'pres'], ['identical twins (both of them)', 'range'], ['the mother who holds it together', 'range'],
  ['a con artist', 'impro'], ['the narrator', 'voice'], ['the comic relief', 'comic'], ['a professor who lectures in riddles', 'voice'], ['a soldier home from war', 'range'],
  ['a dancer with one last chance', 'phys'], ['the grandmother who speaks no English', 'lang'], ['the rival', 'pres'], ['a wedding singer', 'voice'], ['the getaway driver', 'phys'],
  ['a stand-up comedian falling apart', 'comic'], ['a priest with doubts', 'range'], ['the spy who is never quite lying', 'impro'], ['a farmer at the end of the world', 'range'],
  ['an alien learning to be human', 'phys'], ['the mayor', 'pres'], ['a child prodigy, grown up', 'range'], ['the stuntman who wants to act', 'phys']
];
const PART_SIZE = { 1: ['Under-five', 'Day player'], 2: ['Featured', 'Supporting'], 3: ['Second lead', 'Supporting'], 4: ['Lead', 'Co-lead'], 5: ['Lead', 'Title role'] };
const NEED_LABEL = { comic: 'comic timing', range: 'emotional range', phys: 'physicality', pres: 'screen presence', impro: 'improvisation', lang: 'a language and an accent', voice: 'voice' };
function makePart(p) {
  const r = hashRand(p.id * 7919 + 31), A = PART_ARCH[Math.floor(r() * PART_ARCH.length)], N = NAMES.en || NAMES[Object.keys(NAMES)[0]], g = /mother|grandmother/.test(A[0]) ? 'F' : r() < .5 ? 'F' : 'M';
  const nm = `${N[g][Math.floor(r() * N[g].length)]} ${N.L[Math.floor(r() * N.L.length)]}`, S0 = PART_SIZE[clamp(p.tier || 1, 1, 5)];
  return { name: nm, arch: A[0], need: A[1], size: S0[Math.floor(r() * S0.length)] };
}
// ---- the work between films ----
const ACT_GIGS = [
  { k: 'ag_ad', jid: 'ag_commercial', t: 'Commercial (national spot)', tier: 1, subs: ['pres', 'comic'], days: 1, rate: 1400, weeks: 1, d: 'Thirty seconds of being delighted by a yoghurt. It pays the rent for a month.' },
  { k: 'ag_mv', jid: 'ag_musicvideo', t: 'Music video lead', tier: 1, subs: ['pres', 'phys'], days: 2, rate: 600, weeks: 1, d: 'No lines, a wind machine, and a band who argue between takes.' },
  { k: 'ag_student', jid: 'ag_studentfilm', t: 'Student film lead (unpaid)', tier: 0, subs: ['range', 'pres'], days: 3, rate: 0, weeks: 2, d: 'A film-school thesis: no money, real material, and footage for your reel.' },
  { k: 'ag_audio', jid: 'ag_audiobook', t: 'Audiobook narrator', tier: 1, subs: ['voice', 'range'], days: 4, rate: 500, weeks: 2, d: 'Fourteen hours of a thriller, every character, alone in a booth.' },
  { k: 'ag_anim', jid: 'ag_animvoice', t: 'Voice in an animated series', tier: 2, subs: ['voice', 'comic'], days: 2, rate: 900, weeks: 6, d: 'A talking toaster with a tragic past. Session days, and residuals if it runs.' },
  { k: 'ag_mocap', jid: 'ag_mocap', t: 'Motion-capture performer (video game)', tier: 2, subs: ['phys', 'range'], days: 4, rate: 800, weeks: 4, d: 'A suit covered in dots, a bare stage, and you are a dragon.' },
  { k: 'ag_under', jid: 'ag_understudy', t: 'Theatre understudy', tier: 1, subs: ['range', 'voice'], days: 5, rate: 420, weeks: 10, d: 'Learn the whole part and wait. Sometimes the lead gets the flu.' },
  { k: 'ag_soap', jid: 'ag_soap', t: 'Soap opera day player', tier: 1, subs: ['range', 'pres'], days: 2, rate: 700, weeks: 1, d: 'Eleven pages, one take each, and a slap you have to sell.' },
  { k: 'ag_mystery', jid: 'ag_murdermystery', t: 'Murder-mystery dinner actor', tier: 0, subs: ['impro', 'comic'], days: 2, rate: 220, weeks: 6, d: 'You die at the soup course every Friday and Saturday.' },
  { k: 'ag_patient', jid: 'ag_standardised', t: 'Standardised patient (medical school)', tier: 0, subs: ['range', 'impro'], days: 2, rate: 260, weeks: 8, d: 'Play the same symptoms for thirty nervous doctors. Brilliant practice at staying in it.' },
  { k: 'ag_park', jid: 'ag_themepark', t: 'Theme park character', tier: 0, subs: ['phys', 'comic'], days: 5, rate: 300, weeks: 8, d: 'A giant mouse in thirty-degree heat, never breaking character.' },
  { k: 'ag_reenact', jid: 'ag_reenactment', t: 'Documentary reenactment', tier: 1, subs: ['pres', 'phys'], days: 2, rate: 450, weeks: 1, d: 'Walk slowly down a corridor in period costume while a narrator explains a murder.' },
  { k: 'ag_dub', jid: 'ag_dubbing', t: 'Dubbing session (foreign film)', tier: 1, subs: ['voice', 'lang'], days: 2, rate: 550, weeks: 2, d: 'Match someone else\'s mouth in someone else\'s language.' },
  { k: 'ag_trailer', jid: 'ag_trailervoice', t: 'Trailer voice-over', tier: 2, subs: ['voice', 'pres'], days: 1, rate: 1800, weeks: 1, d: '"In a world..." Twelve words, very well paid.' }
];
for (const t of ACT_GIGS) { t.actor = 1; t.fam = 'act'; t.act2 = 1; ODD_BY[t.k] = t; }
{ const _cb = castingBoard;
  castingBoard = function (films) {
    const out = _cb(films), me = ME(); if (MAIN[me.role] !== 'act') return out;
    for (const p of out) if (p.film !== null && !p.part) { p.part = makePart(p); p.t = `${p.part.size}: ${p.part.name}, ${p.part.arch}`; }
    const L = tierLevel(), M = S.me, G = ACT_GIGS.filter(t => t.tier <= L + 1 && t.tier >= L - 2 && !M.jobs.some(j => j.k === t.k));
    for (let i = 0, n = 1 + (prnd() < .5 ? 1 : 0) + (M.agent ? 1 : 0); i < n && G.length; i++) { const t = G.splice(Math.floor(prnd() * G.length), 1)[0], p = makePost(t, null); p.casting = 1; out.push(p); }
    return out;
  };
}
// how well you fit the part counts
{ const _hf = hireFactors;
  hireFactors = function (post) {
    const F = _hf(post); if (!post.part) return F;
    const v = skillOf(ME(), post.part.need); F.push([`Fit for the part (${NEED_LABEL[post.part.need]})`, clamp((v - 10) * .08, -.6, .7)]);
    return F;
  };
}

// ---- the audition ----
{ const _hi = holdInterview;
  holdInterview = function (post) {
    if (!post.part && !(tmplOf(post) || {}).actor) return _hi(post);
    const M = S.me, target = clamp(hireOdds(post) / shortlistOdds(post), .1, .95), dc = st => clamp(Math.round(20 - 20 * target + checkMods(st).mod), 4, 19);
    const f = post.film !== null ? S.films[post.film] : null, P0 = post.part, who = post.head !== null && P(post.head) ? P(post.head).name : 'The casting director';
    const need = P0 ? P0.need : (tmplOf(post).subs || ['range'])[0];
    inbox('interview', `Audition: ${P0 ? P0.name : post.t}`, `${who} has you in for ${P0 ? `${P0.name}, ${P0.arch}` : post.t.toLowerCase()}${f ? ` in ${f.title} (${f.genre.toLowerCase()})` : ''}. Two pages, a reader who doesn't look up, and twelve people in the corridor who look a bit like you. How do you play it?`, { post, aud: 1, choices: [
      { k: 'written', label: `Play it exactly as written`, check: ['range', dc('range')] },
      { k: 'bold', label: `Make a bold choice nobody else will make`, check: ['impro', dc('impro') + 2] },
      { k: 'need', label: `Lean into what the part needs: ${NEED_LABEL[need] || statLabel(need).toLowerCase()}`, check: [need, dc(need) - 1] },
      { k: 'life', label: 'Bring something from your own life to it', check: ['pres', dc('pres')] }] });
  };
}
const AUD_LINES = {
  written: ['Clean, clear, every beat where it should be. The reader finally looks up.', 'You make the lines sound like they were never written.'],
  bold: ['You do the whole thing in a whisper. The room leans in.', 'You play the villain as the only one who is right. Someone writes something down.'],
  need: ['They wanted exactly that, and you have it.', 'You show them the thing the part lives or dies on.'],
  life: ['You think of your father and the scene goes somewhere real.', 'You bring the worst week of your life into the room. It\'s quiet afterwards.']
};
{ const _ri = resolveInterview;
  resolveInterview = function (it, k) {
    if (!it.aud) return _ri(it, k);
    const M = S.me, c = it.choices.find(x => x.k === k), ok = roll(c.check[0], c.check[1]), post = it.post, r = M.lastRoll; it.done = true;
    const f = post.film !== null ? S.films[post.film] : null, lead = (post.tier || 1) >= 3 && f && !it.callback;
    let t = pickLine(AUD_LINES[k] || AUD_LINES.written, post.id) + ' ';
    if (ok && lead) {   // leads get a callback: a chemistry read with the star
      const star = f.cast && f.cast.find(id => P(id) && P(id).id !== ME().id), sn = star !== undefined ? P(star).name : 'the star';
      inbox('interview', `Callback: ${post.part ? post.part.name : post.t}`, `They want to see you again, opposite ${sn}. A chemistry read: the same scene, three times, with the director watching you both.`, { post, aud: 1, callback: 1, star, choices: [
        { k: 'listen', label: `Listen to ${sn} and react; let them lead`, check: ['range', c.check[1]] },
        { k: 'match', label: 'Match their energy and push back', check: ['pres', c.check[1] + 1] },
        { k: 'laugh', label: 'Find the joke in it and make them laugh', check: ['comic', c.check[1]] }] });
      t += 'They ask you to come back.';
    } else if (ok) {
      if (k === 'bold' && r && r.d + r.mod >= r.DC + 5) { post.rate = Math.round(post.rate * 1.15); post.boldW = S.week; t += 'They\'re rewriting the part around what you did. And paying a little more for it.'; }
      if (it.callback && it.star !== undefined && P(it.star)) { addTie(ME(), P(it.star), 6); meet(it.star, 'Chemistry read', 6); t += `${P(it.star).name} hugs you in the corridor afterwards. `; }
      inbox('offer', `Offer: ${post.t}`, offerText(post), { post, choices: [{ k: 'yes', label: 'Accept' }, { k: 'no', label: 'Decline' }] }); M.stats.offers++;
      t += 'Your phone rings before you\'re home. It\'s yours.';
    } else {
      M.stress = clamp(M.stress + 2, 0, 100);
      if (k === 'bold' && prnd() < .3) { t += 'It doesn\'t land for this part, but the casting director keeps your headshot for something else.'; M.refs[post.head] = (M.refs[post.head] || 0) + 1; }
      else t += pickLine(['"Thank you, that was great." It wasn\'t, quite.', 'They go with someone taller. Or shorter. Or with more followers.', 'You find out from the trades.'], post.id + S.week);
    }
    it.result = { ok, roll: r, t };
  };
}

// ---- on set: the big scenes ----
const BIG_SCENES = [
  ['The breakdown', 'Page ninety: the scene everyone has been waiting for. Your character finally breaks.'],
  ['The confrontation', 'Two people, one kitchen table, twenty years of things unsaid.'],
  ['The monologue', 'Three pages, one take if you can, the camera on a slow push into your face.'],
  ['The goodbye', 'A train platform, rain machines, an extra who keeps looking at the lens.'],
  ['The reveal', 'The scene where the audience realises who you really are.'],
  ['The fight', 'The fight scene. Rehearsed for a week, shot in a day.'],
  ['The dinner party', 'Eight actors round a table, overlapping dialogue, and a director who wants it messy.'],
  ['The love scene', 'A closed set, an intimacy coordinator, and a lot of trust.']
];
function actSceneWeek() {
  const M = S.me, me = ME(); if (MAIN[me.role] !== 'act' || pending().some(it => it.kind === 'bigscene')) return;
  const j = M.jobs.find(j => { const t = tmplOf(j); return t && t.actor && j.film !== null && S.films[j.film] && S.films[j.film].stage === 2 && (j.scenes || 0) < Math.max(1, Math.min(4, (j.tier || 1))); }); if (!j || prnd() > .4) return;
  const f = S.films[j.film], B = BIG_SCENES[Math.floor(prnd() * BIG_SCENES.length)], dir = f.dir !== undefined && P(f.dir) ? P(f.dir).name : 'The director', base = 9 + (j.tier || 1) * 1.5 + (f.tier === 1 ? 1 : 0);
  const comic = /Comedy|Animation|Musical/.test(f.genre), action = /Action|Superhero|Martial|War|Western/.test(f.genre);
  j.scenes = (j.scenes || 0) + 1;
  const ch = [
    { k: 'method', label: 'Stay in it all day: no jokes, no phone, no lunch with the others', check: ['range', Math.round(base + 1)] },
    { k: 'tech', label: 'Trust your technique: hit the marks, find it fresh each take', check: ['pres', Math.round(base - 1)] },
    { k: 'impro', label: 'Throw away the script when the moment comes', check: ['impro', Math.round(base + 2)] },
    { k: 'more', label: `Ask ${dir} for one more take, your way`, check: ['com', Math.round(base)] }];
  if (comic) ch.push({ k: 'comic', label: 'Find the laugh nobody wrote', check: ['comic', Math.round(base)] });
  if (action) ch.push({ k: 'stunt', label: 'Do the stunt yourself', check: ['phys', Math.round(base + 2)] });
  inbox('bigscene', `${f.title}: ${B[0]}`, `${B[1]} ${dir} gives you a nod. How do you play it?`, { job: j.id, film: f.id, choices: ch });
}
function bigScenePick(it, k) {
  if (it.kind !== 'bigscene') return false;
  const M = S.me, me = ME(), j = M.jobs.find(x => x.id === it.job), f = S.films[it.film]; it.done = true;
  const c = it.choices.find(x => x.k === k); if (!c || !j || !f) { it.result = { t: 'The scene is cut from the schedule.' }; return true; }
  const ok = roll(c.check[0], c.check[1]), r = M.lastRoll, crit = r && r.crit > 0, dirP = f.dir !== undefined ? P(f.dir) : null;
  let pts = ok ? (crit ? 2.5 : k === 'impro' || k === 'stunt' ? 2 : k === 'tech' ? 1 : 1.5) : (k === 'tech' ? -.3 : k === 'impro' || k === 'stunt' ? -1.5 : -1), t = '';
  switch (k) {
    case 'method': M.stress = clamp(M.stress + 6, 0, 100); t = ok ? 'By the third take the crew is silent. The boom operator is crying. It\'s the best work you\'ve done.' : 'You stay in it so long you can\'t find it when the camera rolls. The crew think you\'re rude.'; if (!ok) for (const id of j.mates || []) addTie(me, P(id), -1); break;
    case 'tech': t = ok ? 'Twelve takes, all usable, each a little different. The editor will love you.' : 'Technically perfect and somehow empty. They print it anyway.'; break;
    case 'impro': t = ok ? 'You say something that isn\'t in the script and the director lets the camera run. It\'ll be in the trailer.' : `${dirP ? dirP.name : 'The director'} calls cut and asks you, quietly, to do the words.`; if (dirP) addTie(me, dirP, ok ? 4 : -3); break;
    case 'more': t = ok ? 'They give you one more. It\'s the one they use.' : 'There isn\'t time. The first AD makes sure you know it.'; if (dirP) addTie(me, dirP, ok ? 3 : -2); break;
    case 'comic': t = ok ? 'A look, a pause, a tiny thing with a cup. The crew laughs and ruins the take. They use the next one.' : 'The laugh doesn\'t come. You try it six ways. It still doesn\'t.'; break;
    case 'stunt': if (ok) { me.fame = clamp((me.fame || 0) + 1, 0, 100); t = 'You do it yourself, twice. The stunt team adopts you. Somebody posts the behind-the-scenes clip.'; } else { M.energy = clamp(M.energy - 30, 0, 100); M.stress = clamp(M.stress + 5, 0, 100); t = 'You land wrong. A week of ice packs and a stunt double finishes it.'; } break;
  }
  j.perf = (j.perf || 0) + pts; jobScore(j, pts, it.title.split(': ')[1] || 'The big scene');
  it.result = { ok, roll: r, t }; return true;
}
// what the critics write when it opens
{ const _fj = finishJob; finishJob = function (j, L, quit) { const perf = j.perf, part = j.part; _fj(j, L, quit); const last = S.me.past[S.me.past.length - 1]; if (last && last.k === j.k && last.film === j.film) { if (perf !== undefined) last.perf = perf; if (part) last.part = part; } }; }
function actNoticesWeek() {
  const M = S.me, me = ME();
  for (const p of M.past.filter(x => x.perf !== undefined && !x.noticed && x.film !== null && S.films[x.film] && S.films[x.film].rel !== null && S.week - S.films[x.film].rel <= 4)) {
    p.noticed = 1; const f = S.films[p.film], who = p.part ? p.part.name : 'your part';
    if (p.perf >= 3) { me.fame = clamp((me.fame || 0) + 3, 0, 100); me.standing = clamp(me.standing + 3, 0, 100); milestone(`Singled out by critics for ${f.title}`, 'prize'); inbox('news', `Critics notice you in ${f.title}`, `"${pickLine(['A revelation', 'Quietly devastating', 'The best thing in the film', 'Steals every scene', 'Remember the name'], p.from)}," says one review of your ${who}. Your agent's phone starts ringing.`); }
    else if (p.perf >= 1) { me.standing = clamp(me.standing + 1, 0, 100); inbox('note', `${f.title}: a mention`, `A review mentions your ${who}: "${pickLine(['Solid', 'Warm and funny', 'Does a lot with a little', 'A welcome presence'], p.from)}." It's something.`); }
    else if (p.perf <= -2) { me.standing = clamp(me.standing - 1, 0, 100); inbox('note', `${f.title}: a bad notice`, `One critic is unkind about your ${who}. You read it four times and then tell everyone you don't read reviews.`); }
  }
}
function acting2Week() { actSceneWeek(); actNoticesWeek(); }
