// ---------------- Trailers, take two: written for the film, scored for the genre ----------------
// Each trailer is now a little script built from the film itself: its title (the trailer riffs on the last word of
// it), its places, its stars, its director's last hit, its festival laurels and its reviews. Characters speak in
// subtitles; a narrator does the voice-over cards; comedies freeze-frame and end with a joke after the title;
// horror goes quiet before it goes loud; awards films wear their laurels; thrillers stamp case numbers. The score is
// a small sequencer that plays a different piece for each genre: pizzicato for comedy, taiko and brass for action,
// a music box for horror, piano for drama, arpeggios for sci-fi, a whistle for westerns, claps for musicals.
const TR_FAMILY = { Comedy: 'comedy', Action: 'action', 'Martial arts': 'action', Superhero: 'hero', War: 'war', Horror: 'horror', Thriller: 'crime', Crime: 'crime', Romance: 'romance', Musical: 'musical', 'Sci-fi': 'scifi', Fantasy: 'fantasy', Western: 'western', Documentary: 'doc', Animation: 'toon', Period: 'drama', Drama: 'drama' };
const TR_LINES = {
  comedy: ['I have a very particular set of skills. None of them are useful {where}.', 'Is this about the {noun}? This is about the {noun}.', 'I\'m not crying. My face is just doing a thing.', 'Okay. New plan. Same as the old plan, but louder.', 'Nobody panic. I\'ve read about this.', 'Technically, that\'s not a lie. It\'s a pre-truth.', 'You said casual! This is not casual!', 'We are not doing the {noun} thing again.'],
  comedyButton: ['…so are we still on for Tuesday?', 'I\'d like to speak to whoever\'s in charge of the {noun}.', 'Is it too late to change my answer?', 'For the record, this was not my idea.', 'Can we get that again? I blinked.'],
  action: ['They took the wrong {noun}.', 'I\'m getting too old for this. Every single time.', 'You want me to stop it? Then get out of my way.', 'There\'s one rule {where}: there are no rules.', 'I don\'t do second chances. I do second {noun}s.', 'We\'ve got ninety seconds. Make it eighty.'],
  hero: ['With great power comes a great deal of paperwork.', 'Every city needs someone to look up to.', 'I didn\'t ask for this. I\'m keeping it, though.', 'They\'re calling it the {noun}. I\'m calling it Tuesday.'],
  war: ['We hold the line. Whatever it costs.', 'Write to my mother. Tell her I was brave. Lie if you have to.', 'Nobody goes home until everybody goes home.', 'They told us it would be over by Christmas.'],
  horror: ['Did you hear that?', 'It\'s just the house settling.', 'Don\'t go {where}.', 'Who was the third person in the photo?', 'It knows your name now.', 'Mum? …Mum, is that you?', 'Why is the door open?'],
  crime: ['Everybody lies. The trick is knowing what about.', 'Follow the {noun}.', 'You don\'t walk away from this. Nobody walks away from this.', 'I want names. All of them.', 'It was a clean job. Until it wasn\'t.', 'Somebody in this room already knows.'],
  romance: ['I think I\'ve been waiting for you {where}.', 'Ask me again. I\'ll say yes this time.', 'You make the {noun} make sense.', 'We had one summer. I want all of them.', 'Is this a bad time? It\'s always a bad time.'],
  musical: ['♪ If the {noun} won\'t sing, then I will ♪', '♪ One more night {where} ♪', '♪ Don\'t stop now, the band\'s still playing ♪', 'Five, six, seven, eight!'],
  scifi: ['We are not alone. We were never alone.', 'The signal is coming from inside the {noun}.', 'How long have we been asleep?', 'Computer, run it again.', 'If you\'re hearing this, it\'s already too late.'],
  fantasy: ['The old stories were true.', 'Only the {noun} can end this.', 'Every kingdom falls. Ours doesn\'t have to.', 'Magic always comes with a price.'],
  western: ['This town ain\'t big enough for the both of us. It\'s barely big enough for me.', 'Sheriff, they\'re coming at noon.', 'I just came here for the {noun}.', 'Out here, a man\'s word is all he\'s got. That and his horse.'],
  doc: ['I never thought anyone would want to hear this story.', 'We did it because nobody else would.', 'Ten years. Every single day.', 'I still have the {noun}. I kept everything.'],
  toon: ['That\'s not how {noun}s work!', 'I can fix this! Probably! Maybe!', 'Rule number one: never trust a talking {noun}.', 'Group hug? No? Okay.'],
  drama: ['I\'ve spent my whole life waiting for permission.', 'You don\'t get to decide who I am.', 'We were happy once. I remember it.', 'Some {noun}s you carry forever.', 'Say it. Just say it out loud.', 'This family has secrets. This is the last one.']
};
const TR_VO = {
  action: ['IN A WORLD', 'WHERE ONE {NOUN}', 'COULD CHANGE EVERYTHING', 'ONE {ROLE}', 'HAS ONE CHANCE'],
  hero: ['EVERY HERO', 'HAS AN ORIGIN', 'THIS IS', 'THE {NOUN}'],
  war: ['{YEARW}', 'THEY WERE BOYS', 'THEY CAME HOME', 'SOMETHING ELSE'],
  scifi: ['INCOMING TRANSMISSION', 'ORIGIN: UNKNOWN', 'DISTANCE: CLOSER THAN YOU THINK'],
  fantasy: ['LONG AGO', 'BEFORE THE {NOUN}', 'THERE WAS A PROMISE'],
  western: ['THERE\'S A NEW {ROLE}', 'IN TOWN', 'AND NOBODY', 'ASKED FOR ONE'],
  crime: ['CASE NO. {CASE}', 'STATUS: OPEN', 'EVERYONE {WHEREU}', 'HAS A SECRET'],
  romance: ['TWO PEOPLE', 'ONE {NOUN}', 'NO GOOD TIMING'],
  drama: ['SOME STORIES', 'TAKE A LIFETIME', 'TO TELL'],
  doc: ['THE TRUE STORY', 'THAT NOBODY', 'WANTED TOLD'],
  musical: ['THIS SEASON', 'THE WHOLE TOWN', 'IS SINGING'],
  toon: ['THIS HOLIDAY', 'THE {NOUN}S', 'ARE BACK', '(THEY NEVER LEFT)'],
  horror: ['BASED ON EVENTS', 'NOBODY WILL', 'TALK ABOUT'],
  comedy: ['THIS SUMMER', 'ONE {ROLE}', 'MADE ONE BAD DECISION', 'AND THEN SEVERAL MORE']
};
const ROLE_NOUN = { action: ['COP', 'DRIVER', 'BODYGUARD', 'EX-SPY'], hero: ['HERO'], war: ['SOLDIER'], western: ['SHERIFF', 'STRANGER', 'GUN'], comedy: ['DAD', 'BRIDESMAID', 'INTERN', 'SUBSTITUTE TEACHER', 'BEST MAN'], crime: ['DETECTIVE'] };
const RATING_JOKES = ['THE FOLLOWING PREVIEW HAS BEEN APPROVED FOR AUDIENCES WHO HAVE ALREADY BOUGHT POPCORN', 'THIS PREVIEW HAS BEEN RATED: PROBABLY FINE', 'THE FOLLOWING PREVIEW CONTAINS SCENES FROM THE FILM. MOSTLY THE GOOD ONES.'];
function titleNoun(f) { const w = f.title.replace(/^(The|A|An|Le|La|Il|El|Der|Die|Das)\s+/i, '').replace(/[:,].*$/, '').replace(/['’]s\b/g, '').trim().split(/\s+/).filter(x => !/^(of|the|and|in|on|a|to|for|part|two|three|ii|iii|\d+)$/i.test(x)); return (w[w.length - 1] || 'thing').toLowerCase(); }
function plural(w) { const IR = { woman: 'women', man: 'men', child: 'children', mouse: 'mice', person: 'people', wife: 'wives', life: 'lives', wolf: 'wolves', knife: 'knives', foot: 'feet', tooth: 'teeth' }; if (IR[w]) return IR[w]; if (/(s|x|z|ch|sh)$/.test(w)) return /s$/.test(w) && w.length > 4 && !/ss$/.test(w) ? w : w + 'es'; if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'; return w + 's'; }
function heShe(id) { const p = P(id); return p && p.g === 'F' ? 'she' : p && p.g === 'M' ? 'he' : 'they'; }
function trFill(s, f, r) {
  const noun = titleNoun(f), where = SC_SETTINGS[frameOf(f, 1).setting] || 'here', fam = TR_FAMILY[f.genre] || 'drama', lg = f.cast[0] !== undefined && P(f.cast[0]) ? P(f.cast[0]).g : null, roles = fam === 'comedy' ? (lg === 'F' ? ['MUM', 'BRIDESMAID', 'INTERN', 'SUBSTITUTE TEACHER', 'MAID OF HONOUR'] : lg === 'M' ? ['DAD', 'BEST MAN', 'INTERN', 'SUBSTITUTE TEACHER'] : ['INTERN', 'SUBSTITUTE TEACHER']) : ROLE_NOUN[fam] || ['STRANGER'];
  return s.replace(/\{noun\}s/g, plural(noun)).replace(/\{NOUN\}S/g, plural(noun).toUpperCase()).replace(/\{noun\}/g, noun).replace(/\{NOUN\}/g, noun.toUpperCase()).replace(/\{where\}/g, where).replace(/\{WHEREU\}/g, where.toUpperCase()).replace(/\{ROLE\}/g, roles[Math.floor(r() * roles.length)]).replace(/\{CASE\}/g, String(1000 + (f.id * 37) % 9000)).replace(/\{YEARW\}/g, String(f.rel !== null ? yearOf(f.rel) - 30 - (f.id % 20) : 1944));
}
function laurelsOf(f) { return (f.awards || []).filter(a => /Festival|Prize|Palme|Lion|Bear|Leopard|Grand|Award|Oswald/i.test(a)).slice(0, 3); }
function laurelSVG(text) { const leaf = (x, y, a, fl) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="2.6" transform="rotate(${a} ${x} ${y})" fill="#E8C66A"${fl ? ' opacity=".9"' : ''}/>`; const L = Array.from({ length: 7 }, (_, i) => leaf(30 - i * 2.2 + i * i * .3, 80 - i * 10, -60 + i * 9)).join(''), R = Array.from({ length: 7 }, (_, i) => leaf(170 + i * 2.2 - i * i * .3, 80 - i * 10, 60 - i * 9)).join(''); return `<svg viewBox="0 0 200 100" width="300" height="150" class="tv-laurel">${L}${R}<text x="100" y="44" text-anchor="middle" font-size="10" fill="#E8C66A" font-family="Georgia, serif" letter-spacing="1">${esc(text.length > 34 ? text.slice(0, 32) + '…' : text).toUpperCase()}</text><text x="100" y="62" text-anchor="middle" font-size="8" fill="#E8C66A" font-family="Georgia, serif" opacity=".8">OFFICIAL SELECTION</text></svg>`; }
// segments: shot/text/pos/ms/move/cut as before, plus sub (a spoken line), vo (voice-over card), laurel, freeze, stinger, hush (score drops out)
function trailerPlan2(f) {
  const fam = TR_FAMILY[f.genre] || 'drama', r = hashRand(f.id * 53 + 17), pick = a => a[Math.floor(r() * a.length)], mv = () => MOVES[Math.floor(r() * MOVES.length)];
  const lead = f.cast[0] !== undefined ? P(f.cast[0]) : null, co2 = f.cast[1] !== undefined ? P(f.cast[1]) : null, co = f.co !== null ? S.companies[f.co] : null, dirP = P(f.dir);
  const prev = dirP.credits.map(i => S.films[i]).filter(x => x && x.id !== f.id && x.rel !== null && x.rel < (f.rel ?? S.week)).sort((a, b) => b.total - a.total)[0];
  const coHit = co ? co.films.map(i => S.films[i]).filter(x => x && x.id !== f.id && x.rel !== null && x.rel < (f.rel ?? S.week)).sort((a, b) => b.total - a.total)[0] : null;
  const lines = (TR_LINES[fam] || TR_LINES.drama).slice(), line = () => trFill(lines.splice(Math.floor(r() * lines.length), 1)[0] || pick(TR_LINES.drama), f, r);
  const shot = (k, o = {}) => ({ shot: k, text: o.text || null, pos: o.pos || 'low', sub: o.sub || null, ms: Math.max(o.ms || 3200, readMs(o.text || o.sub)), move: o.move || mv(), cut: o.cut || 'fade', freeze: o.freeze, hush: o.hush });
  const card = (text, o = {}) => ({ shot: o.under ?? null, text, pos: 'card', vo: o.vo, ms: Math.max(o.ms || 0, readMs(text)), move: 'push', cut: o.cut || 'fade', dim: 1, laurel: o.laurel, hush: o.hush });
  const vo = () => (TR_VO[fam] || TR_VO.drama).map(t => card(trFill(t, f, r), { vo: 1, ms: 1500, cut: 'hard' }));
  const montage = (n, hard) => Array.from({ length: n }, (_, k) => ({ shot: 10 + k, ms: Math.max(380, 820 - k * 90), move: k % 2 ? 'panl' : 'push', cut: hard ? 'hard' : 'flash' }));
  const logo = { shot: null, text: (co ? co.name : 'An independent picture').toUpperCase() + ' PRESENTS', pos: 'card', ms: 2600, cut: 'fade', logo: 1 };
  const title = { shot: null, text: f.title.toUpperCase(), pos: 'card', big: 1, ms: 4000, cut: 'flash', slam: 1 };
  const when = f.rel !== null ? 'NOW SHOWING' : (() => { const W = f.rel ?? (f.stageEnd || S.week + 20); return 'IN CINEMAS ' + fmtDate(W, true).replace(/^\d+ /, '').toUpperCase(); })();
  const end = card(when, { ms: 2600 });
  const from = prev ? card(`FROM THE DIRECTOR OF ${prev.title.toUpperCase()}`, { under: 0 }) : coHit && fam === 'toon' ? card(`FROM THE STUDIO THAT BROUGHT YOU ${coHit.title.toUpperCase()}`, { under: 0 }) : card(`A FILM BY ${dirP.name.toUpperCase()}`, { under: 0 });
  const stars = [lead, co2].filter(Boolean).map(p => p.name.toUpperCase()).join('   ·   ');
  const L = laurelsOf(f), laurels = L.length ? [card(' ', { laurel: L[0], ms: 2600 })] : [];
  const brag = f.rel !== null && (f.total || 0) > 120 ? [card(f.total > 400 ? 'THE BIGGEST FILM OF THE YEAR' : `THE #1 FILM IN ${(MARKETS[f.m] || { name: 'THE COUNTRY' }).name.toUpperCase()}`, { ms: 2400 })] : [];
  const praise = f.rel !== null && (f.reviews || 0) >= 70 ? [shot(3, { text: `“${pick(QUOTE_PRAISE[(f.reviews || 0) >= 82 ? 0 : 1])}” — ${pick(PAPERS)}`, pos: 'mid' })] : [];
  switch (fam) {
    case 'comedy': return [card(pick(RATING_JOKES), { ms: 3200 }), logo, shot(0, { sub: line() }), shot(1, { sub: line() }), from, shot(2, { freeze: 1, text: lead ? `Yep. That's ${lead.name.split(' ')[0]}.` : 'Yep. That\'s the plan.', pos: 'mid', ms: 3200, cut: 'hard' }), shot(2, { freeze: 1, text: `You're probably wondering how ${lead ? heShe(lead.id) : 'they'} got here.`, pos: 'mid', ms: 3200, cut: 'hard' }), ...vo().slice(0, 3), shot(3, { sub: line(), cut: 'hard' }), ...montage(4, true), ...praise, card(stars || ' ', { under: 4 }), shot(4, { sub: line() }), title, end, shot(5, { sub: trFill(pick(TR_LINES.comedyButton), f, r), cut: 'hard', ms: 3600 })];
    case 'horror': return [card(pick(RATING_JOKES), { ms: 3000 }), shot(0, { ms: 4400, move: 'push', sub: line(), hush: 1 }), ...vo().map(c => Object.assign(c, { hush: 1, ms: 1800, cut: 'fade' })), shot(1, { sub: line(), move: 'push', hush: 1 }), card(' ', { ms: 1600, hush: 1 }), shot(2, { cut: 'flash', ms: 900 }), ...montage(6, true), card(trFill(filmTagline(f).toUpperCase(), f, r), { ms: 2600 }), title, end, card(' ', { ms: 1800, hush: 1 }), shot(5, { sub: line(), cut: 'flash', ms: 2200 })];
    case 'action': case 'hero': case 'war': return [logo, from, shot(0, { sub: line() }), ...vo(), shot(2, { text: filmLogline(f), cut: 'hard' }), shot(1, { sub: line(), cut: 'hard' }), card(stars || ' ', { under: 2 }), ...montage(6, true), ...brag, shot(3, { sub: line(), cut: 'hard' }), ...montage(3), title, end, shot(4, { sub: trFill(pick(['Was that the last one?', 'I\'m going to need a bigger {noun}.', 'Somebody call my agent.', 'Did anyone get the plate?']), f, r), cut: 'hard', ms: 2600 })];
    case 'crime': return [logo, ...vo(), shot(0, { sub: line(), move: 'push' }), shot(1, { text: filmLogline(f) }), shot(1, { sub: line() }), from, card(lead ? `${lead.name.toUpperCase()} KNOWS TOO MUCH` : 'SOMEBODY KNOWS TOO MUCH', { under: 2 }), shot(2, { sub: line(), cut: 'hard' }), ...montage(4, true), ...praise, title, end];
    case 'scifi': return [card('INCOMING TRANSMISSION · ' + String((f.rel !== null ? yearOf(f.rel) : S.year) + 300), { ms: 2400, cut: 'hard' }), logo, shot(0, { sub: line(), move: 'push' }), ...vo(), shot(2, { text: filmLogline(f) }), shot(1, { sub: line() }), ...montage(5), card('THE FUTURE ISN\'T WHAT IT USED TO BE', { under: 3 }), shot(3, { sub: line() }), title, end];
    case 'western': return [logo, shot(0, { ms: 4200, move: 'panr' }), ...vo(), shot(1, { text: filmLogline(f) }), shot(1, { sub: line() }), shot(2, { sub: line(), cut: 'hard' }), card(stars || ' ', { under: 3 }), ...montage(4), title, end];
    case 'musical': return [logo, shot(0, { sub: line() }), ...vo(), shot(1, { sub: line() }), ...montage(6), card(stars || ' ', { under: 3 }), shot(3, { sub: line() }), ...praise, title, end];
    case 'toon': return [logo, from, shot(0, { sub: line() }), ...vo(), shot(1, { sub: line(), cut: 'hard' }), shot(2, { sub: line(), cut: 'hard' }), ...montage(4), title, end, shot(3, { sub: trFill(pick(TR_LINES.toon), f, r), ms: 2600, cut: 'hard' })];
    case 'doc': return [...laurels, shot(0, { sub: line(), move: 'push' }), ...vo(), shot(3, { text: filmLogline(f) }), shot(1, { sub: line() }), ...praise, shot(2, { sub: line() }), title, end];
    default: return [...laurels, logo, shot(0, { sub: line(), move: 'push' }), ...vo(), shot(1, { text: filmLogline(f) }), shot(1, { sub: line() }), from, ...praise, shot(2, { sub: line() }), card(stars || ' ', { under: 3 }), ...montage(3), shot(4, { sub: line() }), ...(L.length > 1 ? [card(' ', { laurel: L[1], ms: 2200 })] : []), title, end];
  }
}
// ---- the score: a different little piece for every genre ----
const TR_SCORES = {
  comedy: { bpm: 132, scale: [0, 2, 4, 5, 7, 9, 11], root: 60, mel: [0, 2, 4, 2, 5, 4, 2, -1, 0, 4, 7, 4, 5, 4, 2, 0], bass: [0, -1, 4, -1, 5, -1, 4, -1], wave: 'triangle', perc: 'tick', staccato: 1 },
  action: { bpm: 128, scale: [0, 2, 3, 5, 7, 8, 10], root: 45, mel: [-1, -1, 0, -1, -1, -1, 3, -1, -1, -1, 4, -1, 3, -1, 2, -1], bass: [0, 0, 0, 0, 0, 0, 3, 2], wave: 'sawtooth', perc: 'taiko' },
  hero: { bpm: 112, scale: [0, 2, 4, 5, 7, 9, 11], root: 48, mel: [0, -1, 4, -1, 7, -1, -1, -1, 5, -1, 4, -1, 2, -1, -1, -1], bass: [0, 0, 5, 5, 3, 3, 4, 4], wave: 'sawtooth', perc: 'taiko' },
  war: { bpm: 84, scale: [0, 2, 3, 5, 7, 8, 10], root: 43, mel: [0, -1, -1, 2, 3, -1, -1, -1, 4, -1, 3, -1, 2, -1, -1, -1], bass: [0, 0, 0, 0, 5, 5, 3, 3], wave: 'sawtooth', perc: 'snare' },
  horror: { bpm: 70, scale: [0, 1, 3, 5, 6, 8, 10], root: 72, mel: [0, -1, 4, -1, 2, -1, 1, -1, 0, -1, 6, -1, 4, -1, -1, -1], bass: [0, -1, -1, -1, 1, -1, -1, -1], wave: 'sine', perc: null, box: 1 },
  crime: { bpm: 96, scale: [0, 2, 3, 5, 7, 8, 11], root: 50, mel: [-1, -1, 0, -1, -1, 3, -1, -1, 4, -1, -1, 3, -1, 2, -1, -1], bass: [0, 0, 3, 0, 4, 0, 3, 2], wave: 'square', perc: 'clock' },
  romance: { bpm: 76, scale: [0, 2, 4, 5, 7, 9, 11], root: 60, mel: [0, 2, 4, 7, 9, 7, 4, 2, 5, 4, 2, 0, 2, 4, 2, -1], bass: [0, -1, 5, -1, 3, -1, 4, -1], wave: 'triangle', perc: null, arp: 1 },
  musical: { bpm: 120, scale: [0, 2, 4, 5, 7, 9, 11], root: 62, mel: [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0, -1], bass: [0, 4, 3, 4, 0, 4, 3, 4], wave: 'square', perc: 'clap' },
  scifi: { bpm: 110, scale: [0, 2, 3, 5, 7, 8, 10], root: 57, mel: [0, 2, 4, 7, 0, 2, 4, 7, 1, 3, 5, 8, 1, 3, 5, 8], bass: [0, 0, 0, 0, 5, 5, 3, 3], wave: 'sawtooth', perc: 'tick', arp: 1 },
  fantasy: { bpm: 90, scale: [0, 2, 3, 5, 7, 9, 10], root: 55, mel: [0, -1, 2, 4, -1, 7, -1, 6, 4, -1, 2, -1, 0, -1, -1, -1], bass: [0, 0, 3, 3, 4, 4, 2, 2], wave: 'triangle', perc: 'snare' },
  western: { bpm: 92, scale: [0, 2, 3, 5, 7, 8, 10], root: 69, mel: [0, -1, -1, 4, 3, -1, 2, -1, 0, -1, -1, -1, 4, -1, 6, -1], bass: [0, -1, 4, -1, 0, -1, 4, -1], wave: 'sine', perc: 'clop', vibrato: 1 },
  doc: { bpm: 72, scale: [0, 2, 4, 7, 9], root: 60, mel: [0, 2, 4, 2, 3, 2, 1, -1, 0, 2, 4, 3, 2, 1, 0, -1], bass: [0, -1, 3, -1, 2, -1, 4, -1], wave: 'triangle', perc: null, arp: 1 },
  toon: { bpm: 140, scale: [0, 2, 4, 5, 7, 9, 11], root: 67, mel: [0, 4, 7, 4, 0, 4, 7, 9, 7, 5, 4, 2, 0, -1, 7, -1], bass: [0, 4, 0, 4, 5, 4, 2, 4], wave: 'square', perc: 'tick', staccato: 1 },
  drama: { bpm: 70, scale: [0, 2, 3, 5, 7, 8, 10], root: 57, mel: [0, 2, 3, 2, 4, 3, 2, -1, 0, 2, 3, 5, 4, 3, 2, -1], bass: [0, -1, 5, -1, 3, -1, 4, -1], wave: 'triangle', perc: null, arp: 1 }
};
function trailerScore(f) {
  const Sc = TR_SCORES[TR_FAMILY[f.genre] || 'drama'] || TR_SCORES.drama;
  let ctx = null, master = null, timer = null, step = 0, hush = 0, level = .5, noiseBuf = null, muted = false;
  const ok = () => { if (ctx) return true; try { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = .16; master.connect(ctx.destination); noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return true; } catch (e) { return false; } };
  const hz = deg => { const n = Sc.scale.length, o = Math.floor(deg / n), s = Sc.scale[((deg % n) + n) % n]; return 440 * Math.pow(2, (Sc.root + o * 12 + s - 69) / 12); };
  const note = (freq, t, dur, vol, wave = Sc.wave, vib) => { const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = wave; o.frequency.value = freq; lp.type = 'lowpass'; lp.frequency.value = wave === 'sawtooth' ? 900 + level * 2200 : 4000; if (vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = freq * .012; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + .1); } g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0008, t + dur); o.connect(lp); lp.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05); };
  const noise = (t, dur, vol, hp) => { const s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); s.buffer = noiseBuf; fl.type = hp ? 'highpass' : 'bandpass'; fl.frequency.value = hp || 900; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur); s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + dur); };
  const boom = (t, big) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(big ? 110 : 160, t); o.frequency.exponentialRampToValueAtTime(36, t + (big ? 1.1 : .35)); g.gain.setValueAtTime(big ? 1 : .5, t); g.gain.exponentialRampToValueAtTime(.001, t + (big ? 1.5 : .45)); o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.6); };
  const tick16 = () => {
    if (!ctx || hush) { step++; return; }
    const t = ctx.currentTime + .02, sl = 60 / Sc.bpm / 4, k = step % 16, b = Sc.bass[Math.floor(step / 2) % Sc.bass.length], m = Sc.mel[k];
    if (step % 2 === 0 && b >= 0) note(hz(b - 7), t, sl * (Sc.staccato ? 1.2 : 1.9), .16 + level * .08, Sc.wave === 'sine' ? 'triangle' : Sc.wave);
    if (m >= 0 && (level > .25 || k % 4 === 0)) note(hz(m + (Sc.box ? 7 : 0)), t, Sc.staccato ? sl * .9 : Sc.box ? sl * 6 : sl * 3, Sc.box ? .08 : .1, Sc.box ? 'sine' : Sc.wave === 'sawtooth' && !Sc.arp ? 'square' : Sc.wave, Sc.vibrato);
    if (Sc.arp && level > .35 && k % 2 === 1) note(hz(Sc.mel[(k + 4) % 16] + 7), t, sl * 1.5, .04);
    const P0 = Sc.perc;
    if (P0 === 'taiko' && (k === 0 || k === 6 || k === 10 || (level > .6 && k % 4 === 2))) boom(t, false);
    if (P0 === 'snare' && (k === 4 || k === 12)) noise(t, .18, .25);
    if (P0 === 'tick' && k % 2 === 0) noise(t, .03, .12, 6000);
    if (P0 === 'clock' && k % 4 === 0) noise(t, .02, .2, 4000);
    if (P0 === 'clap' && (k === 4 || k === 12)) { noise(t, .08, .35, 1500); noise(t + .012, .08, .25, 1500); }
    if (P0 === 'clop' && (k === 0 || k === 3 || k === 8 || k === 11)) noise(t, .05, .2, 800);
    step++;
  };
  return {
    start() { if (!ok() || timer) return; timer = setInterval(tick16, 60000 / Sc.bpm / 4); },
    hit(big) { if (!ctx) return; boom(ctx.currentTime + .01, big); if (big) { noise(ctx.currentTime + .01, 1.2, .25, 200); } },
    swell(v) { level = v; },
    hush(h) { hush = h ? 1 : 0; },
    scratch() { if (!ctx) return; const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime; o.type = 'sawtooth'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(120, t + .25); g.gain.setValueAtTime(.25, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); g.connect(master); o.start(t); o.stop(t + .32); hush = 1; },
    mute(m) { muted = m; if (master) master.gain.value = m ? 0 : .16; },
    pause(p) { if (ctx) p ? ctx.suspend() : ctx.resume(); },
    stop() { clearInterval(timer); timer = null; if (ctx) { try { ctx.close(); } catch (e) { } ctx = null; } }
  };
}
