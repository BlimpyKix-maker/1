// ---------------- Moments: the day's weather and the hour's luck ----------------
// Some days the whole city has a mood: a heatwave, a storm that cancels shoots, a premiere that fills every bar
// with industry, a full moon, a power cut, a quiet Monday when nobody calls. And some hours are yours alone: the
// second coffee kicks in, your phone is at three percent, a song is stuck in your head, an idea arrives in the
// shower, you slept badly, everything just goes your way. Each one gives advantage or disadvantage on the rolls it
// touches (and a few cost or give a little energy), for that day or that block only. They're drawn from a stable
// hash of the date and the hour, not from the dice, so looking at them never changes what happens.
const DAY_MOMENTS = [
  { k: 'heat', label: 'Heatwave', icon: '🥵', months: [5, 6, 7], dis: ['phys', 'eth'], e: -3, d: 'The city melts. Disadvantage on Physicality and Work ethic; everything takes more out of you.' },
  { k: 'storm', label: 'Storm', icon: '⛈️', dis: ['setm', 'stag', 'light'], d: 'Rain sideways, shoots on hold. Disadvantage on set management, staging and lighting.' },
  { k: 'premiere', label: 'A premiere in town', icon: '🎬', adv: ['cha', 'pack'], d: 'Every bar is full of industry tonight. Advantage on Charisma and packaging.' },
  { k: 'gridlock', label: 'Gridlock', icon: '🚗', dis: ['com'], e: -2, d: 'Nothing moves. Disadvantage on Composure, and the commute costs more.' },
  { k: 'fullmoon', label: 'Full moon', icon: '🌕', adv: ['impro', 'orig'], dis: ['com'], d: 'Everyone\'s a little strange. Advantage on improvisation and originality, disadvantage on Composure.' },
  { k: 'quiet', label: 'A quiet day', icon: '🤫', adv: ['struc', 'dial', 'char'], d: 'Nobody calls. Advantage on structure, dialogue and character.' },
  { k: 'blackout', label: 'Power cut', icon: '🔌', dis: ['digi', 'shape', 'rhythm'], d: 'The grid is down across town. Disadvantage on digital work and editing.', rare: 1 },
  { k: 'payday', label: 'Payday', icon: '💸', adv: ['cha'], dow: [4], d: 'Friday, and everyone just got paid. Advantage on Charisma.' },
  { k: 'snow', label: 'Snow day', icon: '❄️', months: [11, 0, 1], adv: ['tas', 'vis'], dis: ['phys'], d: 'The city stops. Advantage on Taste and Vision; disadvantage on Physicality.' },
  { k: 'trades', label: 'The trades are buzzing', icon: '📰', adv: ['pack', 'fin'], d: 'A big deal was announced and everyone is talking money. Advantage on packaging and finance.' },
  { k: 'strikechat', label: 'Union meeting', icon: '✊', adv: ['col'], d: 'The crews are talking. Advantage on Collaboration.' }
];
const BLOCK_MOMENTS = [
  { k: 'coffee', label: 'Second coffee', icon: '☕', adv: ['eth', 'com'], d: 'It just kicked in. Advantage on Work ethic and Composure.' },
  { k: 'phone3', label: 'Phone at 3%', icon: '🪫', dis: ['cha'], d: 'You can\'t take calls. Disadvantage on Charisma.' },
  { k: 'earworm', label: 'A song in your head', icon: '🎶', adv: ['rhythm', 'theme', 'score', 'comic'], d: 'Everything has a beat. Advantage on rhythm, music and comic timing.' },
  { k: 'shower', label: 'An idea in the shower', icon: '💡', adv: ['orig', 'vis'], d: 'Write it down! Advantage on Originality and Vision.' },
  { k: 'badnight', label: 'Slept badly', icon: '😵‍💫', dis: ['col', 'tas'], e: -2, d: 'Disadvantage on Collaboration and Taste.' },
  { k: 'flow', label: 'Everything clicks', icon: '✨', adv: 'all', rare: 1, d: 'One of those hours. Advantage on everything.' },
  { k: 'compliment', label: 'A compliment from a stranger', icon: '😊', adv: ['pres', 'cha'], d: 'It carries you. Advantage on presence and Charisma.' },
  { k: 'hangry', label: 'Forgot to eat', icon: '🥪', dis: ['com', 'col'], d: 'Disadvantage on Composure and Collaboration until you do.' },
  { k: 'secondwind', label: 'A second wind', icon: '🌬️', e: 4, adv: ['phys'], d: 'Out of nowhere, energy. Advantage on Physicality.' }
];
function momentNow() {
  const M = S.me; if (!M || !M.party || !M.party.done) return [];
  const W = M.wk, day = W ? W.day : 0, block = W ? W.block : 0, mo = dateOf(S.week).getUTCMonth(), seed = (S.seed || 1) % 100000, out = [];
  const rd = hashRand((S.week * 31 + day * 7 + seed * 13 + (M.hub || '').length * 101) >>> 0), x = rd();
  if (x < .45) { const L = DAY_MOMENTS.filter(m => (!m.months || m.months.includes(mo)) && (!m.dow || m.dow.includes(day)) && (!m.rare || rd() < .3)); if (L.length) out.push(Object.assign({ scope: 'today' }, L[Math.floor(rd() * L.length)])); }
  const rb = hashRand((S.week * 97 + day * 11 + block * 5 + seed * 7 + M.id * 3) >>> 0), y = rb();
  if (y < .3) { const L = BLOCK_MOMENTS.filter(m => !m.rare || rb() < .25); if (L.length) out.push(Object.assign({ scope: ['this morning', 'this afternoon', 'tonight'][block] || 'now' }, L[Math.floor(rb() * L.length)])); }
  return out;
}
{ const _co = conditionsOf;
  conditionsOf = function () { const C = _co(); for (const m of momentNow()) C.push({ k: 'm_' + m.k, label: `${m.icon} ${m.label}`, adv: m.adv, dis: m.dis, d: `${m.d} (${m.scope})`, moment: 1 }); return C; };
}
// the few that cost or give energy: once per block, when the block is lived
{ const _lde = typeof lifeDayEvent === 'function' ? lifeDayEvent : null;
  lifeDayEvent = function (act) {
    const M = S.me, W = M.wk;
    if (W) { const key = W.day * 3 + W.block; if ((W.momDone || -1) !== key) { W.momDone = key; for (const m of momentNow()) if (m.e && (m.scope !== 'today' || W.block === 0)) M.energy = clamp(M.energy + m.e, 0, 100); } }
    return _lde ? _lde(act) : undefined;
  };
}
