// ---------------- The party as a puzzle: moods, gossip, and the doors they open ----------------
// Everyone at the party is having their own night. Each guest has a mood (celebrating, stung by bad news, guarded,
// bored, competitive, chatty) and the same approach lands very differently depending on it: charm works on someone
// celebrating and grates on someone who's just been fired. You don't know anyone's mood unless you find out:
// watching the room on arrival, overhearing gossip on your way between rooms (more of it the more people have had
// to drink), or reading people well (high taste or charisma shows you the mood of whoever you walk up to). Gossip
// also opens doors: hear that the investor wants a cheap horror film, and the cellar has a new way in. Knowing helps
// your odds (you play to it, and the odds shown say so); the mood itself decides how big the win or the miss is.
// The games room and the coat room now have their own guests, so nobody turns up in two rooms at once.

const PARTY_MOODS = {
  chatty: ['in a talking mood', ['charm', 'taste'], []],
  guarded: ['guarded: too many people have wanted things from them tonight', ['help', 'taste'], ['ask', 'charm']],
  celebrating: ['celebrating: something of theirs just got a green light', ['charm', 'ask'], ['business']],
  stung: ['stung: they got bad news earlier tonight', ['help', 'nerve'], ['ask', 'charm']],
  bored: ['bored out of their mind', ['craft', 'nerve'], ['business', 'help']],
  competitive: ['competitive: they want to be challenged', ['nerve', 'craft'], ['charm']]
};
function approachOf(o) {
  if (/pitch|represent|back you|work for them|tell them you want|ask them to|take over|offer to run/i.test(o.label)) return 'ask';
  const s = o.check ? o.check[0] : null;
  return s === 'cha' ? 'charm' : s === 'tas' ? 'taste' : s === 'com' ? 'nerve' : s === 'eth' ? 'help' : s === 'fin' || s === 'pack' ? 'business' : s ? 'craft' : 'none';
}
// the two rooms that borrowed someone else's guest get their own
STATIONS.gameroom.who = 'shark'; STATIONS.cloak.who = 'celeb';
for (const [room, from, to] of [['gameroom', 'exec', 'shark'], ['cloak', 'star', 'celeb']]) {
  const st = STATIONS[room], sc = st.scene, rs = st.res;
  st.scene = (n, v) => sc(k => n(k === from ? to : k), v);
  st.res = (k, ok, g, n) => rs(k, ok, Object.assign({}, g, { [from]: g[to] !== undefined ? g[to] : g[from] }), x => n(x === from ? to : x));
}
// gossip that opens a new way in: [room, whose, what you hear, the option, what happens]
const PARTY_RUMOURS = [
  ['cellar', 'money', n => `${n('money')} wants a horror film to back: cheap, fast, this year.`, { k: 'r_horror', label: 'Pitch them a horror film you could make for nothing', check: ['orig', 11] }, (ok, g, n) => ok ? (meet(g.money, 'Met at the party', 10), lead(g.money), (S.me.spec.pages += 5), `${n('money')} leans in. "Pages by February. Don't make me wait."`) : (meet(g.money, 'Met at the party', 1), 'They\'ve heard that one. Twice tonight.')],
  ['bar', 'agent', n => `${n('agent')} lost their biggest client to a rival agency this afternoon and is furious.`, { k: 'r_gap', label: 'Tell them you\'d be the client who never leaves', check: ['cha', 11] }, (ok, g, n) => ok ? (meet(g.agent, 'Met at the party', 12), (S.me.refs[g.agent] = (S.me.refs[g.agent] || 0) + 1), `${n('agent')} laughs for the first time tonight, and takes your number.`) : (meet(g.agent, 'Met at the party', -2), 'Too soon. They change the subject.')],
  ['balcony', 'dir', n => `${n('dir')} has a shoot in March and someone on the crew just dropped out.`, { k: 'r_job', label: 'Mention, lightly, that you\'re free in March', check: ['cha', 10] }, (ok, g, n) => ok ? (meet(g.dir, 'Met at the party', 8), lead(g.dir), `${n('dir')} looks at you properly. "Call the office on the second."`) : (meet(g.dir, 'Met at the party', 0), 'They say they\'ll think about it, which means no.')],
  ['porch', 'critic', n => `${n('critic')} is writing a piece about new voices to watch this year.`, { k: 'r_voice', label: 'Tell them about what you\'re making', check: ['cha', 12] }, (ok, g, n) => ok ? (meet(g.critic, 'Met at the party', 9), (me0().fame = (me0().fame || 0) + 1.5), `You get a paragraph in ${n('critic')}'s piece. Your mother buys ten copies.`) : (meet(g.critic, 'Met at the party', -1), 'You talk too long. They stop writing.')],
  ['star', 'star', n => `It's ${n('star')}'s birthday tomorrow, and nobody here seems to know.`, { k: 'r_bday', label: 'Wish them happy birthday, quietly', check: ['cha', 8] }, (ok, g, n) => ok ? (meet(g.star, 'Met at the party', 16), trust(g.star, 10), `${n('star')} actually tears up. "How did you know?"`) : (meet(g.star, 'Met at the party', 3), 'You get the date wrong by a day. They\'re charmed anyway, slightly.')],
  ['library', 'exec', n => `${n('exec')} is in trouble with the board over last year's flop.`, { k: 'r_flop', label: 'Tell them their flop had the best scene of the year, and say which', check: ['tas', 12] }, (ok, g, n) => ok ? (meet(g.exec, 'Met at the party', 14), lead(g.exec), `${n('exec')} stares at you. "Nobody has said a kind word about that film in six months."`) : (meet(g.exec, 'Met at the party', -4), 'You name the wrong scene. It was the one they cut.')],
  ['kitchen', 'vet', n => `${n('vet')} is retiring after one last film and wants someone to pass the craft on to.`, { k: 'r_kit', label: 'Ask if they need an assistant on the last one', check: ['eth', 11] }, (ok, g, n) => ok ? (meet(g.vet, 'Met at the party', 12), lead(g.vet), learnFrom(g.vet, .3), `"Be there at six," ${n('vet')} says. "Not five past."`) : (meet(g.vet, 'Met at the party', 2), 'They already promised it to a nephew.')],
  ['decks', 'muso', n => `${n('muso')} is scoring a film and hates the temp track the director loves.`, { k: 'r_temp', label: 'Suggest the record they should steal the feeling from', check: ['tas', 11] }, (ok, g, n) => ok ? (meet(g.muso, 'Met at the party', 12), lead(g.muso), `${n('muso')} writes the name on their arm. "That's it. That's the film."`) : (meet(g.muso, 'Met at the party', 1), 'They\'ve already tried that one.')],
  ['garden', 'coord', n => `${n('coord')} is short of extras for a shoot next week.`, { k: 'r_extra', label: 'Volunteer, for the experience', check: ['eth', 8] }, (ok, g, n) => ok ? (meet(g.coord, 'Met at the party', 8), lead(g.coord), (S.me.cash += usd(150)), 'A day on set, paid. You watch everything.') : (meet(g.coord, 'Met at the party', 2), 'They filled it an hour ago.')],
  ['pool', 'writer', n => `${n('writer')} can't crack the second act of a script that's due on Monday.`, { k: 'r_act2', label: 'Offer a fix for the second act', check: ['struc', 13] }, (ok, g, n) => ok ? (meet(g.writer, 'Met at the party', 14), (S.me.refs[g.writer] = (S.me.refs[g.writer] || 0) + 1), `${n('writer')} stops pacing. "Oh. Oh, that works." You get a thank-you in the credits of something.`) : (meet(g.writer, 'Met at the party', -3), 'Your fix breaks the third act too.')],
  ['hall', 'reporter', n => `${n('reporter')} needs a quote from someone young for a New Year story.`, { k: 'r_quote', label: 'Give them a quote worth printing', check: ['cha', 12] }, (ok, g, n) => ok ? (meet(g.reporter, 'Met at the party', 8), (me0().fame = (me0().fame || 0) + 1.5), 'They print it, with your name. People quote it back to you for a month.') : (meet(g.reporter, 'Met at the party', 0), 'They print it. Without your name. Probably for the best.')],
  ['stairs', 'creator', n => `${n('creator')} is looking for a co-host for a series.`, { k: 'r_cohost', label: 'Offer to co-host an episode', check: ['cha', 12] }, (ok, g, n) => ok ? (meet(g.creator, 'Met at the party', 10), (me0().fame = (me0().fame || 0) + 2), 'The episode does well. Strangers recognise you at the supermarket.') : (meet(g.creator, 'Met at the party', 1), 'They pick someone with more followers.')],
  ['host', 'host', n => `${n('host')} is one producer short on a film that starts in the spring.`, { k: 'r_prod', label: 'Offer to run the production office', check: ['pack', 12] }, (ok, g, n) => ok ? (meet(g.host, 'Met at the party', 10), lead(g.host), `${n('host')} looks you up and down. "Monday. Bring a laptop."`) : (meet(g.host, 'Met at the party', 0), 'They need someone who has done it before.')],
  ['gameroom', 'shark', n => `${n('shark')} cheats at pool, and everyone knows it.`, { k: 'r_cheat', label: 'Call it, with a smile', check: ['com', 13] }, (ok, g, n) => ok ? (meet(g.shark, 'Met at the party', 9), (S.me.cash += usd(60)), `${n('shark')} pays up, laughing. "Nobody calls it. I like you."`) : (meet(g.shark, 'Met at the party', -8), `${n('shark')} doesn't like being called anything.`)],
  ['cloak', 'celeb', n => `${n('celeb')} lost an earring worth more than your rent somewhere in the coat room.`, { k: 'r_ear', label: 'Search the coat room properly', check: ['eth', 10] }, (ok, g, n) => ok ? (meet(g.celeb, 'Met at the party', 15), trust(g.celeb, 8), 'You find it in a scarf. They hug you like family.') : (meet(g.celeb, 'Met at the party', 2), 'You find three earrings, none of them hers.')],
  ['dance', 'peer', n => `${n('peer')} has a crush on someone across the room and can't do anything about it.`, { k: 'r_wing', label: 'Be their wingman', check: ['cha', 11] }, (ok, g, n) => ok ? (addTie(me0(), P(g.peer), 10), `By midnight ${n('peer')} is dancing with them. You have a friend for life.`) : (addTie(me0(), P(g.peer), 2), 'You make it awkward for everyone, mostly yourself.')]
];
// set the night up: new guests, everyone's mood, the gossip going round
{ const _mp = makeParty;
  makeParty = function (c) {
    const pt = _mp(c), hub = c.hub, used = new Set(Object.values(pt.ids).map(id => P(id) && P(id).name.split(' ')).flat().filter(Boolean));
    const fresh = (roles, sc) => { const q = bestIn(hub, roles, x => sc(x) - (x.name.split(' ').some(t => used.has(t)) ? 1e5 : 0) - (Object.values(pt.ids).includes(x.id) ? 1e6 : 0)); if (q) q.name.split(' ').forEach(t => used.add(t)); return q; };
    const sh = fresh(['producer', 'actor', 'ad'], q => -Math.abs(q.standing - 45) + prnd() * 35), ce = fresh(['actor', 'composer', 'director'], q => Math.min(q.fame, 65) * .4 + prnd() * 60 - (q.fame > 85 ? 40 : 0));
    if (sh) pt.ids.shark = sh.id; if (ce) pt.ids.celeb = ce.id;
    const MK = Object.keys(PARTY_MOODS); pt.moods = {}; for (const k in pt.ids) pt.moods[k] = MK[Math.floor(prnd() * MK.length)];
    pt.tells = []; pt.heard = [];
    const open = pt.open || Object.keys(STATIONS);
    pt.rumours = PARTY_RUMOURS.map((r, i) => i).filter(i => open.includes(PARTY_RUMOURS[i][0]) && pt.ids[PARTY_RUMOURS[i][1]] !== undefined).sort(() => prnd() - .5).slice(0, 6);
    return pt;
  };
}
function partyReads() { return Math.max(statVal('tas'), statVal('cha')) >= 15; }
function moodLine(pt, key, n) { const m = pt.moods && pt.moods[key]; return m ? `${n(key)} is ${PARTY_MOODS[m][0]}.` : ''; }
// what you know shows up in the scene; playing to a known mood helps the odds, and the odds show it
{ const _ps = partyScene;
  partyScene = function (pt) {
    const sc = _ps(pt); if (!sc || !pt.moods) return sc;
    const n = k => (pt.ids[k] !== undefined && P(pt.ids[k]) ? P(pt.ids[k]).name : 'someone');
    if (pt.step === 'rooms') {
      const H = (pt.heard || []).map(i => PARTY_RUMOURS[i]).filter(r => !pt.seen.includes(r[0])), T = (pt.tells || []).filter(k => pt.ids[k] !== undefined);
      if (H.length || T.length) sc.text += `\n\nWhat you've heard tonight: ${[...T.map(k => moodLine(pt, k, n)), ...H.map(r => r[2](n) + ` (${STATIONS[r[0]].where.toLowerCase()})`)].join(' ')}`;
      if (sc.rooms) sc.rooms = sc.rooms.map(r => H.some(x => x[0] === r.k) ? Object.assign({}, r, { where: r.where + ' 💬' }) : r);
      return sc;
    }
    if (pt.step in STATIONS && sc.opts) {
      const key = STATIONS[pt.step].who, mood = pt.moods[key], known = (pt.tells || []).includes(key) || partyReads();
      if (known && mood) {
        if (!(pt.tells || []).includes(key)) { sc.text += `\n\nYou read them at a glance: ${moodLine(pt, key, n)}`; } else sc.text += `\n\nYou know: ${moodLine(pt, key, n)}`;
        const [, likes, hates] = PARTY_MOODS[mood];
        sc.opts = sc.opts.map(o => { if (!o.check) return o; const a = approachOf(o); if (likes.includes(a)) return Object.assign({}, o, { check: [o.check[0], o.check[1] - 2], label: o.label + ' · plays to their mood' }); if (hates.includes(a)) return Object.assign({}, o, { label: o.label + ' · risky tonight' }); return o; });
      }
      for (const i of pt.heard || []) { const r = PARTY_RUMOURS[i]; if (r[0] === pt.step) sc.opts = sc.opts.concat([Object.assign({}, r[3], { label: '💬 ' + r[3].label })]); }
    }
    return sc;
  };
}
// after each choice: the mood decides how big it was; and on your way out you hear something
{ const _pp = partyPick;
  partyPick = function (k) {
    const pt = S.me.party; if (!pt || !pt.moods) return _pp(k);
    const step = pt.step, inRoom = step in STATIONS, scene = inRoom ? partyScene(pt) : null, opt = scene && scene.opts && scene.opts.find(o => o.k === k);
    const g = pt.ids, n = x => (g[x] !== undefined && P(g[x]) ? P(g[x]).name : 'someone');
    // a door opened by gossip
    if (inRoom && opt && String(k).startsWith('r_')) {
      const r = PARTY_RUMOURS.find(x => x[3].k === k); if (!r) return false;
      const ok = roll(opt.check[0], opt.check[1]); let t = r[4](ok, g, n) + partyTier(k, ok, scene);
      pt.visits++; pt.step = pt.visits >= PARTY_VISITS || (pt.open || Object.keys(STATIONS)).every(s => pt.seen.includes(s)) ? 'midnight' : 'rooms';
      t += partyGossip(pt, n);
      pt.log = (pt.log || []).concat([{ title: scene.title, choice: opt.label, ok, roll: S.me.lastRoll, t }]);
      return true;
    }
    const r = _pp(k); if (!r) return r;
    if (step === 'arrive' && k === 'watch' && S.me.lastRoll && S.me.lastRoll.ok) { const L = Object.keys(pt.ids).filter(x => !pt.tells.includes(x) && x !== 'peer').sort(() => prnd() - .5).slice(0, 3); pt.tells.push(...L); const H = pt.rumours.filter(i => !pt.heard.includes(i)).slice(0, 1); pt.heard.push(...H); const last = pt.log[pt.log.length - 1]; if (last) last.t += ` You clock ${L.map(x => moodLine(pt, x, n).replace(/\.$/, '')).join('; ')}.${H.length ? ' And: ' + PARTY_RUMOURS[H[0]][2](n) : ''}`; }
    if (inRoom && opt && opt.check) {
      const key = STATIONS[step].who, mood = pt.moods[key], id = g[key], last = pt.log[pt.log.length - 1], ok = last && last.ok;
      if (mood && id !== undefined && P(id) && last) {
        const [, likes, hates] = PARTY_MOODS[mood], a = approachOf(opt);
        if (likes.includes(a) && ok) { meet(id, null, 5); last.t += ` It lands even better than you hoped: they were ${PARTY_MOODS[mood][0].split(':')[0]}.`; if (prnd() < .35) lead(id); }
        else if (hates.includes(a) && !ok) { meet(id, null, -5); last.t += ` Wrong moment: they were ${PARTY_MOODS[mood][0].split(':')[0]}.`; }
        else if (hates.includes(a) && ok) last.t += ' It works, though it was a risk with them tonight.';
      }
      if (last && pt.step !== step) last.t += partyGossip(pt, n);
    }
    return r;
  };
}
// overheard on the way to the next room: a mood, or a door. People talk more after a few drinks.
function partyGossip(pt, n) {
  const out = [], tries = 1 + (pt.drinks >= 2 ? 1 : 0);
  for (let i = 0; i < tries; i++) {
    if (prnd() < .55) { const H = pt.rumours.filter(x => !pt.heard.includes(x) && !pt.seen.includes(PARTY_RUMOURS[x][0])); if (H.length) { const h = H[0]; pt.heard.push(h); out.push(PARTY_RUMOURS[h][2](n)); continue; } }
    const L = Object.keys(pt.ids).filter(x => !pt.tells.includes(x) && x !== 'peer' && pt.moods[x]); if (L.length) { const x = L[Math.floor(prnd() * L.length)]; pt.tells.push(x); out.push(moodLine(pt, x, n)); }
  }
  return out.length ? ` On your way through the house you overhear: ${out.join(' ')}` : '';
}
