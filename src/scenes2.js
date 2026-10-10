// ---------------- Scenes that play differently every time ----------------
// The written scenes are the backbone; now each time one happens it can come with a twist (what's different today),
// and an extra way to play it. A twist changes the stakes for real: harder or easier checks (the odds you see are the
// odds you roll), bigger or smaller payoffs, and who is watching. Extra options are generic moves that fit any scene:
// pull a colleague in, take it straight to the boss, buy time, make a joke of it, fix it on your own dime.
const TWISTS = [
  { k: 'watch', t: 'The producer is on set today, watching everything.', dc: 1, ok: { stand: .8 }, bad: { stand: -.5 }, end: ['The producer saw it.', 'It goes in someone\'s notes upstairs.'] },
  { k: 'last', t: 'It\'s the last day of the shoot. Everyone is exhausted and sentimental.', dc: -1, ok: { tieAll: 2 }, bad: { stress: 3 }, end: ['Last-day energy.', 'People will tell this one at the wrap party.'] },
  { k: 'press', t: 'A journalist is on set for a feature about the production.', dc: 1, ok: { fame: .6 }, bad: { fame: -.2, stress: 2 }, end: ['It might make the article.', 'The journalist was taking notes.'] },
  { k: 'sick', t: 'You\'re covering for someone who called in sick.', dc: 1, ok: { stand: .5, tieHead: 3 }, bad: {}, end: ['Not even your job, and you did it.', 'Covering is harder than it looks.'] },
  { k: 'cuts', t: 'The budget was cut this morning. Nerves are thin.', dc: 1, ok: { tieHead: 3 }, bad: { tieHead: -2 }, end: ['Money talks louder than usual today.'] },
  { k: 'mood', t: 'The boss is in a foul mood.', dc: 2, ok: { tieHead: 4 }, bad: { tieHead: -3 }, end: ['You read the room right.', 'The room was not in a reading mood.'], need: 'head' },
  { k: 'mentor', t: 'Someone you look up to is in the room.', dc: 0, ok: { stand: .4, stress: -2 }, bad: { stress: 2 }, end: ['You felt them watching.'] },
  { k: 'migraine', t: 'You woke up with a headache that won\'t shift.', dc: 1, ok: { stress: -1 }, bad: { energy: -4 }, end: ['Through the headache, too.', 'The headache won.'] },
  { k: 'flow', t: 'You slept well and everything feels easy today.', dc: -1, ok: { stand: .2 }, bad: {}, end: ['One of those days.'] },
  { k: 'rival', t: 'A rival of yours happens to be around.', dc: 0, ok: { stand: .5 }, bad: { stand: -.4, stress: 3 }, end: ['Your rival noticed.', 'Your rival definitely noticed.'] },
  { k: 'makingof', t: 'The making-of crew is filming behind the scenes.', dc: 0, ok: { fame: .4 }, bad: { fame: .1 }, end: ['It\'ll be on the extras, either way.'] },
  { k: 'storm', t: 'Weather has wrecked the schedule; everything\'s being rushed.', dc: 1, ok: { tieAll: 1 }, bad: { stress: 3 }, end: ['Rushed, but done.', 'Rushed, and it shows.'] },
  { k: 'early', t: 'You\'re ahead of schedule for once.', dc: -1, ok: { stress: -2 }, bad: {}, end: ['Time to breathe, for once.'] },
  { k: 'newbie', t: 'There\'s a nervous newcomer shadowing you today.', dc: 0, ok: { stand: .2, tieAll: 1 }, bad: { stress: 1 }, end: ['The newcomer will remember how you handled it.'] },
  { k: 'vip', t: 'A big name drops by unannounced.', dc: 1, ok: { stand: .6, fame: .3 }, bad: { stress: 2 }, end: ['The big name noticed you, for a second.'] },
  { k: 'test', t: 'This is being treated as a test of whether you get kept on.', dc: 1, ok: { stand: 1, tieHead: 3 }, bad: { stand: -.6, tieHead: -2 }, end: ['You passed something, though nobody says so.', 'You can feel the verdict.'], need: 'head' },
  { k: 'friend', t: 'A friend of yours is on the crew today.', dc: -1, ok: { tieMate: 3 }, bad: { tieMate: 1 }, end: ['Easier with a friend around.'], need: 'mates' },
  { k: 'late', t: 'It\'s gone ten at night and nobody has gone home.', dc: 1, ok: { tieAll: 2 }, bad: { energy: -5 }, end: ['Late-night solidarity.', 'Too late for this.'] }
];
const LIFE_TWISTS = [
  { k: 'drinks', t: 'You\'ve had two drinks.', dc: 1, ok: { stress: -2 }, bad: { stand: -.2 }, end: ['Dutch courage, for once, worked.', 'The drinks did the talking.'] },
  { k: 'lateL', t: 'You\'re already late for something else.', dc: 1, ok: {}, bad: { stress: 3 }, end: ['And you still made it, just.', 'Now you\'re later.'] },
  { k: 'phone', t: 'Your phone is on three percent.', dc: 0, ok: { stress: -1 }, bad: { stress: 2 }, end: ['No phone needed.', 'And then the phone died.'] },
  { k: 'rainL', t: 'It\'s pouring.', dc: 0, ok: {}, bad: { energy: -2 }, end: ['Soaked, but fine.', 'Soaked, and not fine.'] },
  { k: 'goodday', t: 'It\'s been a good day so far.', dc: -1, ok: { stress: -2 }, bad: {}, end: ['The good day holds.', 'Not even a good day could save that.'] },
  { k: 'nosleep', t: 'You\'ve barely slept.', dc: 1, ok: {}, bad: { energy: -3 }, end: ['Running on nothing, and it worked.', 'Sleep would have helped.'] },
  { k: 'watched', t: 'People nearby are watching.', dc: 1, ok: { fame: .2 }, bad: { stress: 2 }, end: ['Someone filmed it, probably.', 'You can feel the eyes.'] },
  { k: 'calm', t: 'You feel strangely calm.', dc: -1, ok: { stress: -2 }, bad: {}, end: ['Calm carries you.'] }
];
const TW_TAG = { watch: 'with the producer watching', last: 'on the last day', press: 'with a journalist around', sick: 'covering for someone', cuts: 'after the budget cuts', mood: 'with the boss in a mood', mentor: 'in front of someone you admire', migraine: 'with a headache', flow: 'on a good day', rival: 'with a rival nearby', makingof: 'on camera', storm: 'in a rush', early: 'ahead of schedule', newbie: 'with a newcomer watching', vip: 'with a big name in', test: 'as a test', friend: 'with a friend on the crew', late: 'at ten at night', drinks: 'after two drinks', lateL: 'running late', phone: 'on three percent', rainL: 'in the rain', goodday: 'on a good day', nosleep: 'on no sleep', watched: 'in front of people', calm: 'strangely calm' };
const LIFE_OPTS = [
  { k: 'gx_walk', label: () => 'Walk away' },
  { k: 'gx_kind', label: () => `Do the kind thing, whatever it costs (${fmtCash(usd(30))})` },
  { k: 'gx_text', label: () => 'Text a friend and ask what they\'d do' }
];
const GX_OPTS = [
  { k: 'gx_mate', need: 'mates', label: m => `Pull ${m} in to help`, check: ['col', 11] },
  { k: 'gx_head', need: 'head', label: (m, h) => `Take it straight to ${h}`, check: ['cha', 13] },
  { k: 'gx_time', label: () => 'Buy time: say you\'ll come back to it' },
  { k: 'gx_joke', label: () => 'Make a joke of it', check: ['cha', 12] },
  { k: 'gx_cash', label: () => `Fix it yourself, on your own dime (${fmtCash(usd(60))})` }
];
{ const _ib = inbox;
  inbox = function (kind, title, text, extra = {}) {
    if (kind === 'scene' && S.me && extra && extra.scene && extra.choices && !extra.noTwist) {
      const M = S.me, seed = (M.seq || 0) * 7 + S.week * 13 + String(extra.scene).length, r = hashRand(seed), ctx = extra.ctx || {};
      const has = n => n === 'head' ? ctx.head !== null && ctx.head !== undefined && P(ctx.head) : n === 'mates' ? (ctx.mates || []).some(id => P(id)) : true;
      extra = Object.assign({}, extra, { choices: extra.choices.map(c => Object.assign({}, c, c.check ? { check: c.check.slice() } : {})) });
      const work = extra.job !== undefined; extra.work = work;
      if (r() < .55) { const L = (work ? TWISTS : LIFE_TWISTS).filter(t => !t.need || has(t.need)), T = L[Math.floor(r() * L.length)];
        if (T) { extra.twist = T.k; text = `${T.t} ${text}`; if (TW_TAG[T.k] && typeof title === 'string') title = `${title}, ${TW_TAG[T.k]}`; for (const c of extra.choices) if (c.check) c.check[1] = clamp(c.check[1] + T.dc, 4, 22); } }
      if (r() < .4 && extra.choices.length <= 4) { const L = (work ? GX_OPTS : LIFE_OPTS).filter(o => !o.need || has(o.need)), O = L[Math.floor(r() * L.length)];
        if (O) { const m = (ctx.mates || []).map(P).filter(Boolean)[0], h = ctx.head !== null && ctx.head !== undefined && P(ctx.head) ? P(ctx.head).name.split(' ')[0] : 'the boss';
          extra.choices.splice(extra.choices.length, 0, { k: O.k, label: O.label(m ? m.name.split(' ')[0] : 'someone', h), check: O.check ? O.check.slice() : undefined }); } }
    }
    return _ib(kind, title, text, extra);
  };
}
{ const _sr = sceneResolve;
  sceneResolve = function (it, k) {
    const M = S.me, me = ME(), T = it.twist ? TWISTS.concat(LIFE_TWISTS).find(t => t.k === it.twist) : null;
    if (/^gx_/.test(k)) return gxResolve(it, k, T);
    // the twist's difficulty is the one that was shown on the choice
    const s = SCENES.find(x => x.id === it.scene), o = s && s.opts.find(x => x.k === k), c = (it.choices || []).find(x => x.k === k), was = o && o.check ? o.check[1] : null;
    if (o && o.check && c && c.check) o.check[1] = c.check[1];
    try { _sr(it, k); } finally { if (o && was !== null) o.check[1] = was; }
    if (T && it.result) twistAfter(it, T, it.result.ok !== false);
  };
}
function twistAfter(it, T, ok) {
  const M = S.me, me = ME(), ctx = it.ctx || {}, fx = ok ? T.ok : T.bad;
  if (fx.stand) me.standing = clamp(me.standing + fx.stand, 0, 100); if (fx.fame) me.fame = clamp((me.fame || 0) + fx.fame, 0, 100);
  if (fx.stress) M.stress = clamp(M.stress + fx.stress, 0, 100); if (fx.energy) M.energy = clamp(M.energy + fx.energy, 0, 100);
  if (fx.tieHead && ctx.head !== null && ctx.head !== undefined && P(ctx.head)) addTie(me, P(ctx.head), fx.tieHead);
  if (fx.tieMate || fx.tieAll) for (const id of (ctx.mates || []).filter(i => P(i))) addTie(me, P(id), fx.tieMate || fx.tieAll);
  if (fx.tieAll && ctx.head !== null && ctx.head !== undefined && P(ctx.head)) addTie(me, P(ctx.head), fx.tieAll);
  const e = T.end[(ok ? 0 : 1) % T.end.length]; it.result.t = `${it.result.t} ${e}`;
}
function gxResolve(it, k, T) {
  const M = S.me, me = ME(), ctx = it.ctx || {}, O = GX_OPTS.concat(LIFE_OPTS).find(o => o.k === k), c = (it.choices || []).find(x => x.k === k);
  const j = it.job !== undefined ? M.jobs.find(x => x.id === it.job) : null, head = ctx.head !== null && ctx.head !== undefined ? P(ctx.head) : null, mate = (ctx.mates || []).map(P).filter(Boolean)[0];
  const ok = c && c.check ? roll(c.check[0], c.check[1]) : true, r = c && c.check ? M.lastRoll : null; let t = '';
  if (k === 'gx_mate') { if (mate) addTie(me, mate, ok ? 4 : -2); t = ok ? `${mate ? mate.name.split(' ')[0] : 'Your colleague'} drops what they're doing. Between you, it's sorted in half the time.` : `${mate ? mate.name.split(' ')[0] : 'Your colleague'} helps, grudgingly, and makes it worse.`; }
  else if (k === 'gx_head') { if (head) addTie(me, head, ok ? 5 : -4); if (ok) me.standing = clamp(me.standing + .4, 0, 100); t = ok ? `${head ? head.name.split(' ')[0] : 'The boss'} appreciates hearing it first, from you.` : `${head ? head.name.split(' ')[0] : 'The boss'} wanted you to handle it yourself.`; }
  else if (k === 'gx_time') { M.stress = clamp(M.stress + 2, 0, 100); t = 'You buy yourself a day. The problem waits for you, patiently.'; }
  else if (k === 'gx_joke') { if (ok) { M.stress = clamp(M.stress - 3, 0, 100); me.standing = clamp(me.standing + .3, 0, 100); } else me.standing = clamp(me.standing - .3, 0, 100); t = ok ? 'The joke lands. The tension goes out of the room and the problem looks smaller.' : 'Wrong moment. Nobody laughs, and now there are two problems.'; }
  else if (k === 'gx_walk') { t = 'You walk away. Whatever happens next happens without you.'; }
  else if (k === 'gx_kind') { M.cash -= usd(30); M.stress = clamp(M.stress - 2, 0, 100); t = 'You do the kind thing. It costs a little and feels like more than it cost.'; }
  else if (k === 'gx_text') { const L = aliveKnown().filter(id => opinion(id) > 15); const f = L.length ? P(L[Math.floor(prnd() * L.length)]) : null; if (f) addTie(me, f, 1); t = f ? `${f.name.split(' ')[0]} replies in seconds: "${gpick(['do the brave thing', 'go home, honestly', 'what would future you want', 'trust your gut', 'you already know'], (it.id || 1) + S.week)}." It helps.` : 'Nobody replies. You decide on your own.'; }
  else if (k === 'gx_cash') { M.cash -= usd(60); me.standing = clamp(me.standing + .3, 0, 100); t = 'You pay for it yourself and say nothing. Someone notices anyway.'; }
  if (j && typeof jobScore === 'function') jobScore(j, ok ? .7 : -.4, it.title);
  it.done = true; it.result = { ok: c && c.check ? ok : null, roll: r, t };
  if (T) twistAfter(it, T, ok);
}
