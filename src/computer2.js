// ---------------- The computer, part two ----------------
// Mail that matters (offers, fans, labels, bookings, newsletters, spam), a market app for the industry, a studio for
// songs and podcasts, an editing suite for videos, games, and an app store for tools and toys. Anything that changes
// your career goes through a logged action carrying its result, so replays agree; the fiddling stays in the page.
APPS.push(['ticker', '📈', 'Ticker'], ['studio', '🎚️', 'Studio'], ['cutroom', '🎞️', 'CutRoom'], ['store', '🛍️', 'App Store'], ['match', '🃏', 'Reel Match'], ['cue', '🥁', 'Cue Hero'], ['scramble', '🔤', 'Logline Scramble']);
const SHOP = {
  cue: { label: 'Cue Hero', d: 'A rhythm game: hit the cue on the beat.', price: 15, kind: 'game' },
  scramble: { label: 'Logline Scramble', d: 'Unscramble the film words before the clock runs out.', price: 10, kind: 'game' },
  protone: { label: 'ProTone Studio', d: 'Professional recording software. Your music sounds better (+ quality).', price: 150, kind: 'gear', gear: 'music' },
  cutpro: { label: 'CutPro Editor', d: 'A real editing suite. Your videos look better (+ quality).', price: 150, kind: 'gear', gear: 'video' },
  podsuite: { label: 'Podcaster Suite', d: 'Noise removal and levelling. Your episodes sound better (+ quality).', price: 120, kind: 'gear', gear: 'podcast' },
  mic: { label: 'A proper microphone', d: 'Large-diaphragm condenser and an interface. Music and podcasts (+ quality).', price: 260, kind: 'gear', gear: 'music', also: 'podcast' },
  camera: { label: 'Camera and ring light', d: 'A mirrorless camera, a lens and a light. Videos (+ quality).', price: 450, kind: 'gear', gear: 'video' }
};
function appLocked(k) { return SHOP[k] && SHOP[k].kind === 'game' && !((S.me.owned2 || []).includes(k)); }
function gearFor(type) { const G = S.me.gearF || {}; const f = { song: 'music', score: 'music', musical: 'music', mv: 'video', video: 'video', blip: 'video', podcast: 'podcast' }[type]; return f ? Math.min(3, G[f] || 0) : 0; }
function buyApp(a) {
  const M = S.me, it = SHOP[a.k];
  if (a.cancel) { if (!it || !(M.subs || {})[a.k]) return false; delete M.subs[a.k]; M.owned2 = M.owned2.filter(x => x !== a.k); diary(`You cancel ${it.label}.`); return true; }
  if (!it || (M.owned2 || []).includes(a.k) || (it.from && S.year < it.from) || M.cash < usd(it.price || it.sub || 0)) return false;
  M.cash -= usd(it.price || 0); (M.owned2 = M.owned2 || []).push(a.k);
  if (it.kind === 'sub') (M.subs = M.subs || {})[a.k] = S.week;
  if (it.gear) { M.gearF = M.gearF || {}; M.gearF[it.gear] = (M.gearF[it.gear] || 0) + 1; if (it.also) M.gearF[it.also] = (M.gearF[it.also] || 0) + 1; }
  diary(`You buy ${it.label}.`);
  return true;
}
// ---- mail: generated each week from what's happening to you, no dice ----
const SPAM = ['You have WON a cruise (please send bank details)', 'Hot singles in your postcode want to read your screenplay', 'URGENT: your account will be suspended', 'A prince needs a cinematographer', 'Lose ten pounds by thinking about lighting', 'Your free trial of Premium Clapperboard is ending', 'Re: Re: Re: FW: you won\'t believe this headshot'];
const FANS = ['I don\'t usually write to people but your last thing got me through a bad week.', 'my whole family argues about your stuff at dinner now', 'Please make more. Also, what microphone do you use?', 'I showed your work to my class and now they all want to do what you do', 'You probably won\'t read this but thank you.'];
function mail(folder, from, subj, body, act) { const M = S.me; M.mail = M.mail || []; M.mail.push({ id: (M.mailN = (M.mailN || 0) + 1), w: S.week, folder, from, subj, body, act: act || null }); if (M.mail.length > 90) M.mail.splice(0, M.mail.length - 90); }
function mailWeek() {
  const M = S.me, r = hashRand(S.week * 53 + M.id), fol = k => followers(k);
  const top = []; for (let i = S.news.length - 1; i >= 0 && top.length < 3; i--) if (S.week - S.news[i].w < 2) top.push(S.news[i].text);
  if (top.length) mail('news', 'The Daily Slate', 'This week in the trades', top.map(t => '• ' + t).join('\n'));
  if (r() < .35) mail('spam', ['noreply@winn3r.biz', 'prince.hollywood@mail.example', 'support@totally-real.co'][Math.floor(r() * 3)], SPAM[Math.floor(r() * SPAM.length)], 'Click here.');
  if (S.week % 4 === 0 && M.board.length) mail('news', 'CrewList', 'Jobs picked for you', M.board.slice(0, 3).map(p => `• ${p.t}${p.film !== null && p.film !== undefined ? ' on ' + S.films[p.film].title : p.mco ? ' at ' + p.mco : ''} (${fmtCash(p.rate)}/day)`).join('\n'));
  const bigF = Object.keys(PLATFORMS).filter(k => fol(k) >= 800);
  if (bigF.length && r() < .5) { const N = NAMES[HUBS[M.hub].lang] || NAMES.en; mail('fans', `${N.F[Math.floor(r() * N.F.length)]} ${N.L[Math.floor(r() * N.L.length)]}`, 'a message from a fan', FANS[Math.floor(r() * FANS.length)]); }
  const songs = (M.works || []).filter(w => w.type === 'song'), streams = songs.reduce((t, w) => t + w.units, 0);
  if (!M.deal && streams > 15000 && S.week % 6 === 0 && !(M.mail || []).some(m => m.act && m.act.k === 'label' && !m.done && S.week - m.w < 12)) {
    const L = MEDIA_COS.filter(c => c.type === 'label' && c.f <= S.year), lab = L[Math.floor(r() * L.length)], adv = Math.round(usd(streams > 200000 ? 60000 : streams > 60000 ? 20000 : 6000) / 500) * 500;
    mail('offers', `A&R, ${lab.n}`, 'We\'d like to sign you', `We've been listening. We'd like to offer a record deal: an advance of ${fmtCash(adv)}, recoupable against your royalties, and our promotion behind your next releases. Your share per stream drops, but far more people will hear you. Think about it.`, { k: 'label', lab: lab.n, adv });
  }
  if (fol('spinly') >= 500 && r() < .3) { const fee = Math.round(usd(clamp(fol('spinly') / 20, 120, 4000)) / 10) * 10; mail('offers', 'Bookings, The Velvet Room', 'Can you play a show?', `We have a slot on a Friday. ${fmtCash(fee)} guarantee, you keep your merch money.`, { k: 'gig', fee }); }
  if (fol('podhaus') >= 300 && r() < .25) mail('offers', 'Producer, a bigger show', 'Guest spot on our podcast?', 'We love your show and think our listeners would too. An hour, remote is fine.', { k: 'guest' });
  if (fol('vidwire') + fol('blip') >= 2000 && r() < .25) { const N = NAMES[HUBS[M.hub].lang] || NAMES.en; mail('offers', `${N.F[Math.floor(r() * N.F.length)]} ${N.L[Math.floor(r() * N.L.length)]} (creator)`, 'Collab?', 'Big fan. Want to make something together? I\'ll bring my audience, you bring yours.', { k: 'collab' }); }
  const play = (M.works || []).find(w => w.plat === 'stage' && w.q >= 70 && S.week - w.rel === 3);
  if (play) mail('offers', 'Literary department, a regional theatre', `About ${play.title}`, 'Someone from our team saw your play. We\'d love to read whatever you write next, and we have a small commissioning fund.', { k: 'commission', fee: Math.round(usd(2500) / 10) * 10 });
  { const ids = Object.keys(M.known).map(Number).filter(id => !P(id).dead && opinion(id) > 5 && !P(id).player); if (ids.length && r() < .22) { const id = ids[Math.floor(r() * ids.length)], q = P(id), F = FAVOURS[Math.floor(r() * FAVOURS.length)]; mail('inbox', `${q.name} (${ROLE_LABEL[q.role].toLowerCase()})`, F[0], F[1].replace('{me}', ME().name.split(' ')[0]).replace('{them}', q.name.split(' ')[0]), { k: 'favour', id }); } }
  if (typeof endorseWeek === 'function') endorseWeek();
  if (S.week % 4 === 2) mail('news', 'Your bank', 'Your monthly statement', `Balance: ${fmtCash(M.cash)}. ${M.cash < 0 ? 'You are overdrawn. Fees apply.' : 'Thank you for banking with us.'}`);
}
const FAVOURS = [
  ['Could you read something?', 'Hi {me}, I\'ve finished a draft and I trust your eye more than anyone\'s. Would you read it and tell me the truth? Twenty pages. {them}'],
  ['A reference?', 'Hi {me}, I\'m up for a job and they want two references. Could I put you down? They might call. {them}'],
  ['Panel next month', 'Hi {me}, I\'m moderating a panel for new filmmakers and someone dropped out. Would you come and say true things for an hour? {them}'],
  ['Short film, one day', 'Hi {me}, we\'re shooting a short on Saturday and our person fell through. One day, food provided, eternal gratitude. {them}'],
  ['Feedback on my reel', 'Hi {me}, I\'ve recut my reel. Would you watch it and tell me what to lose? It\'s three minutes, I promise. {them}'],
  ['Moving day', 'Hi {me}, this is not glamorous, but I\'m moving flats on Sunday and I have a van and no friends with arms. Pizza is involved. {them}'],
  ['An introduction?', 'Hi {me}, you know people I don\'t. Would you introduce me to someone at a company? No pressure at all. {them}'],
  ['Test screening', 'Hi {me}, we\'re testing our cut on twenty people on Thursday. Would you come and fill in the card honestly? {them}']
];
function mailAct(a) {
  const M = S.me, me = ME(), m = (M.mail || []).find(x => x.id === a.id);
  if (m && a.k === 'fan' && m.folder === 'fans' && !m.replied) { m.replied = 1; for (const k in M.fol || {}) M.fol[k] = M.fol[k] + 2; M.stress = clamp(M.stress - 1, 0, 100); return true; }
  if (!m || !m.act || m.done) return false;
  if (m.act.opts && typeof mailOptAct === 'function') return mailOptAct(m, a.k);
  const A = m.act, pay = A.fee !== undefined ? 'fee' : A.adv !== undefined ? 'adv' : null, re = 'Re: ' + m.subj.replace(/^Re: /, '');
  if (a.k === 'more') {
    if (!pay || A.pushed) return false;
    m.done = 'more';
    const p = clamp(.3 + me.standing / 120 + (M.agent ? .15 : 0) + Object.values(M.fol || {}).reduce((t, v) => t + v, 0) / 400000, .1, .85), x = prnd();
    if (x < p) { const B = Object.assign({}, A, { [pay]: Math.round(A[pay] * (1.2 + prnd() * .2) / 10) * 10, pushed: 1 }); mail(m.folder, m.from, re, pickLine(['Fine. We can stretch to {v}. That really is the ceiling.', 'You drive a hard bargain. {v}, and we shake on it.', 'Our finance people winced, but yes: {v}.'], m.id).replace('{v}', fmtCash(B[pay])), B); }
    else if (x > .85) mail(m.folder, m.from, re, 'Thanks for coming back to us. We\'ve decided to go in another direction. Best of luck.', null);
    else mail(m.folder, m.from, re, pickLine(['That\'s our best offer, honestly. It stands for now.', 'We can\'t move on the number, but the offer is still open.'], m.id), Object.assign({}, A, { pushed: 1 }));
    return true;
  }
  if (a.k === 'ask') {
    if (A.asked) return false;
    m.done = 'asked';
    const info = { label: `The advance is paid on signing. You keep 18% of royalties after it's earned back, and we take your next two releases. Marketing is on us.`, gig: `Doors at 8, you're on at 9:30 for forty minutes. Two drink tickets. Sound check at 6, don't be late.`, guest: `We record on Tuesdays, an hour, video optional. We'll send questions a week ahead.`, collab: `I'm thinking one video each, on each other's channels, same week. Split costs. I have a camera person.`, commission: `It's a development commission: a first draft in six months, a reading at the end. The fee is half on signing.`, favour: `It would take an afternoon. I'd owe you, properly.` }[A.k] || 'Happy to answer anything. The offer stands.';
    mail(m.folder, m.from, re, info, Object.assign({}, A, { asked: 1 }));
    return true;
  }
  m.done = a.k;
  if (A.k === 'favour') { const id = A.id; if (!M.known[id] || P(id).dead) return true; if (a.k === 'yes') { M.energy = clamp(M.energy - 12, 0, 100); addTie(me, P(id), 5); M.known[id].owe = (M.known[id].owe || 0) + 1; trust(id, 4); sms(id, pickLine(['you\'re a lifesaver. I owe you one', 'thank you. seriously. I won\'t forget it', 'that was so kind. drinks are on me forever'], id + S.week), 'text'); } else { addTie(me, P(id), -1.5); } return true; }
  if (a.k !== 'yes') return true;
  if (A.k === 'label') { M.deal = { lab: A.lab, adv: A.adv, rec: 0, w: S.week }; M.cash += A.adv; milestone(`Signed a record deal with ${A.lab}`, 'work'); }
  else if (A.k === 'gig') { M.cash += A.fee; M.energy = clamp(M.energy - 10, 0, 100); M.fol.spinly = (M.fol.spinly || 0) * 1.03 + 20; }
  else if (A.k === 'guest') { M.fol.podhaus = (M.fol.podhaus || 0) * 1.08 + 40; }
  else if (A.k === 'collab') { for (const k of ['vidwire', 'blip']) if (M.fol[k]) M.fol[k] = M.fol[k] * 1.06 + 50; }
  else if (A.k === 'endorse' && typeof endorseAccept === 'function') endorseAccept(A);
  else if (A.k === 'commission') { M.cash += A.fee; (M.flags = M.flags || {}).commissioned = S.week; }
  return true;
}
function mailApp() {
  const M = S.me, L = (M.mail || []).slice().reverse(), f = UI.mailf || 'inbox';
  const F = { inbox: 'Everything', offers: 'Offers', fans: 'Fan mail', news: 'Newsletters', sent: 'Sent', spam: 'Spam' };
  const list = f === 'compose' ? L.filter(m => m.folder === 'sent') : f === 'inbox' ? L.filter(m => m.folder !== 'spam' && m.folder !== 'sent') : L.filter(m => m.folder === f), open = L.find(m => m.id === UI.mailo);
  const cnt = k => L.filter(m => (k === 'inbox' ? m.folder !== 'spam' && m.folder !== 'sent' : m.folder === k) && k !== 'sent' && S.week - m.w < 2).length;
  return `<div class="mailapp"><div class="mfold"><button class="btn-s${f === 'compose' ? '' : ' ghost'}" data-mailf="compose">✏️ New email</button>${Object.entries(F).map(([k, l]) => `<button class="linkish${f === k ? ' on' : ''}" data-mailf="${k}">${l}${cnt(k) ? ` <span class="dn">${cnt(k)}</span>` : ''}</button>`).join('')}<button class="linkish" data-mailf="old">Old inbox</button></div>
   <div class="mlist">${f === 'old' ? `<ul class="inbox">${M.inbox.slice(-10).reverse().map(it => `<li class="msg ${it.kind}">${inboxCard(it)}</li>`).join('')}</ul>` : list.slice(0, 30).map(m => `<button class="mrow${open === m ? ' on' : ''}${m.act && !m.done ? ' act' : ''}" data-mailo="${m.id}"><b>${esc(m.from)}</b><span>${esc(m.subj)}</span><small class="muted">${fmtDate(m.w, true)}</small></button>`).join('') || '<p class="muted">Nothing here.</p>'}</div>
   ${f === 'compose' && typeof composeMailHTML === 'function' ? composeMailHTML() : ''}${open && f !== 'old' && f !== 'compose' ? `<div class="mread"><p class="muted small">From ${esc(open.from)} · ${fmtDate(open.w, true)}</p><h4>${esc(open.subj)}</h4><p style="white-space:pre-line">${esc(open.body)}</p>${open.folder === 'fans' ? (open.replied ? '<p class="muted">You wrote back. It made their week.</p>' : `<p><button class="btn-s ghost" data-mailact="${open.id}:fan">Write back</button></p>`) : ''}${open.act ? (open.done ? `<p class="muted">${open.doneT ? esc(open.doneT) : { yes: 'You said yes.', more: 'You asked for more. See their reply.', asked: 'You asked a question. See their reply.' }[open.done] || 'You declined.'}</p>` : open.act.opts ? `<p>${open.act.opts.map(([k, l], i) => `<button class="btn-s${i ? ' ghost' : ''}" data-mailact="${open.id}:${k}">${esc(l)}</button>`).join(' ')}</p>` : `<p><button class="btn-s" data-mailact="${open.id}:yes">${open.act.k === 'favour' ? 'Help them' : 'Accept'}</button> ${(open.act.fee !== undefined || open.act.adv !== undefined) && !open.act.pushed ? `<button class="btn-s ghost" data-mailact="${open.id}:more" title="Ask for more money. They might say yes, hold firm, or walk away.">Negotiate</button> ` : ''}${!open.act.asked ? `<button class="btn-s ghost" data-mailact="${open.id}:ask">Ask a question</button> ` : ''}<button class="btn-s ghost" data-mailact="${open.id}:no">Decline</button></p>`) : ''}</div>` : ''}</div>`;
}
// ---- Ticker: the industry's market and its trends ----
function fieldIndex(field, w) {
  const y = yearOf(w), start = { box: 1900, music: 1950, video: 2005, pod: 2005 }[field];
  if (y < start) return 0;
  const growth = { box: 1 + (y - 1950) * .02, music: y < 1999 ? 1 + (y - 1950) * .03 : y < 2015 ? 2.5 - (y - 1999) * .05 : 1.7 + (y - 2015) * .12, video: Math.pow(1.35, y - 2005), pod: y < 2014 ? 1 + (y - 2005) * .05 : 1.5 * Math.pow(1.22, y - 2014) }[field];
  const r = hashRand(Math.floor(w / 4) * 31 + field.length)();
  return growth * (.92 + r * .16) * (y === 2020 && field === 'box' ? .25 : 1);
}
function tickerApp() { return marketApp(); }
// ---- Studio: a step sequencer for songs, a waveform cutter for podcasts ----
const SEQ_ROWS = ['Kick', 'Snare', 'Bass', 'Chords', 'Melody'], SEQ_N = 8;
function seqGrid() { UI.seq = UI.seq || SEQ_ROWS.map(() => Array(SEQ_N).fill(0)); return UI.seq; }
function seqScore(G) {
  let s = 0; const d = r => G[r].filter(Boolean).length;
  if (G[0][0] && G[0][4]) s += 2; if (G[1][2] && G[1][6]) s += 2;
  if (d(2) >= 3 && d(2) <= 5) s += 2; if (d(3) >= 2 && d(3) <= 4) s += 1; if (d(4) >= 3 && d(4) <= 6) s += 2;
  if (G[4].join('') !== G[2].join('')) s += 1; if (G.flat().filter(Boolean).length > 32) s -= 3;
  return clamp(s, 0, 10);
}
function playSeq() {
  if (typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) return;
  const ctx = UI.actx = UI.actx || new (window.AudioContext || window.webkitAudioContext)(), G = seqGrid(), t0 = ctx.currentTime + .05, step = .22;
  const freq = [55, 180, 98, 262, 523], type = ['sine', 'square', 'triangle', 'sawtooth', 'triangle'], melody = [523, 587, 659, 784, 659, 587, 523, 440];
  for (let r = 0; r < SEQ_ROWS.length; r++) for (let c = 0; c < SEQ_N; c++) if (G[r][c]) {
    const o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + c * step;
    o.type = type[r]; o.frequency.value = r === 4 ? melody[c] : r === 3 ? [262, 262, 220, 220, 175, 175, 196, 196][c] : freq[r];
    if (r === 0) o.frequency.exponentialRampToValueAtTime(30, t + .15);
    g.gain.setValueAtTime(r === 1 ? .08 : .18, t); g.gain.exponentialRampToValueAtTime(.001, t + (r === 3 ? .4 : .18));
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .45);
  }
}
function podSegs() { const r = hashRand(S.week * 17 + (S.me.make ? S.me.make.prog : 0)); return Array.from({ length: 24 }, () => { const x = r(); return x < .2 ? 'um' : x < .32 ? 'gap' : 'talk'; }); }
function studioApp() {
  const k = S.me.make, T = k && WORK_TYPES[k.type];
  if (!k || !['song', 'score', 'musical', 'podcast'].includes(k.type)) return `<p>Open a song, score, musical or podcast project on the Create tab, then work on it here.</p><p><button class="btn-s" data-dtab="create">Go to Create</button></p>`;
  const done = S.me.sessD === S.week * 7 + (S.me.wk ? S.me.wk.day : 0);
  if (k.type === 'podcast') {
    const segs = podSegs(), cut = UI.cuts || [];
    return `<p><b>${esc(k.title)}</b> · cut the ums and dead air, keep the talk.</p><div class="wave">${segs.map((s, i) => `<button class="seg ${s}${cut.includes(i) ? ' cut' : ''}" data-podcut="${i}" title="${s === 'um' ? 'um…' : s === 'gap' ? 'silence' : 'talking'}"><i style="height:${s === 'talk' ? 26 + (i * 7) % 14 : s === 'um' ? 14 : 3}px"></i></button>`).join('')}</div>
     <p>${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="podcut">Export the edit</button>`} <span class="muted small">Tall, varied bars are talk; short stubs are ums; flat lines are silence.</span></p>`;
  }
  const G = seqGrid();
  return `<p><b>${esc(k.title)}</b> · build the groove, play it back, bounce it when it feels right.</p><div class="seq">${SEQ_ROWS.map((row, r) => `<div class="srow"><span>${row}</span>${G[r].map((v, c) => `<button class="step${v ? ' on' : ''}${c % 4 === 0 ? ' downbeat' : ''}" data-seq="${r}:${c}"></button>`).join('')}</div>`).join('')}</div>
   <p><button class="btn-s ghost" data-seqplay="1">▶ Play</button> ${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="studio">Bounce the take</button>`} <span class="muted small">Kick on the one, snare on the backbeat, a bassline and a melody that aren't the same.</span></p>`;
}
// ---- CutRoom: arrange the clips, choose the thumbnail ----
const CLIPS = ['Hook', 'Intro', 'Main point', 'Joke', 'Payoff', 'Outro'];
function cutOrder() { if (!UI.order || UI.orderW !== S.week) { const r = hashRand(S.week * 71 + 3); UI.order = CLIPS.slice().sort(() => r() - .5); UI.orderW = S.week; UI.pickC = null; } return UI.order; }
function cutScore(O, thumb) { let s = 0; if (O[0] === 'Hook') s += 3; if (O[O.length - 1] === 'Outro') s += 2; if (O.indexOf('Payoff') > O.indexOf('Main point')) s += 2; if (O.indexOf('Intro') <= 2) s += 1; if (thumb === 0) s += 2; return clamp(s, 0, 10); }
function cutroomApp() {
  const k = S.me.make;
  if (!k || !['video', 'blip', 'mv'].includes(k.type)) return `<p>Open a video, Blip clip or music video project on the Create tab, then cut it here.</p><p><button class="btn-s" data-dtab="create">Go to Create</button></p>`;
  const O = cutOrder(), th = UI.thumb ?? null, done = S.me.sessD === S.week * 7 + (S.me.wk ? S.me.wk.day : 0);
  return `<p><b>${esc(k.title)}</b> · click two clips to swap them. Hook first, payoff after the main point, outro last.</p><div class="timeline">${O.map((c, i) => `<button class="clip2${UI.pickC === i ? ' on' : ''}" data-clip="${i}">${esc(c)}</button>`).join('')}</div>
   <p class="small">Thumbnail: ${['😲 Big face, big arrow', '🌄 A pretty landscape', '🔤 Just the title'].map((t, i) => `<button class="btn-s${th === i ? '' : ' ghost'}" data-thumb="${i}">${t}</button>`).join(' ')}</p>
   <p>${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="edit" ${th === null ? 'disabled' : ''}>Render the cut</button>`}</p>`;
}
// a session from the apps: counts as two sessions of work, and the score adds quality
function appSession(a) {
  const M = S.me, k = M.make, day = S.week * 7 + (M.wk ? M.wk.day : 0);
  if (!k || M.sessD === day || !(a.score >= 0)) return false;
  M.sessD = day; const sc = clamp(Math.round(a.score), 0, 10);
  k.prog = Math.min(k.need, k.prog + 2); k.boost += (sc - 4) / 2;
  if (k.prog >= k.need) k.ready = 1;
  M.energy = clamp(M.energy - 6, 0, 100);
  diary(`${k.title}: a session on the computer (${sc >= 7 ? 'it sounds great' : sc >= 4 ? 'decent work' : 'not your best'}).`);
  return true;
}
// ---- games ----
const MATCH_ICONS = ['🎬', '🎥', '🍿', '🎞️', '🎭', '🎤'];
function matchApp() {
  if (!UI.match) { const L = MATCH_ICONS.concat(MATCH_ICONS); for (let i = L.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [L[i], L[j]] = [L[j], L[i]]; } UI.match = { L, open: [], got: [], tries: 0 }; }
  const G = UI.match, won = G.got.length === G.L.length;
  return `<p class="small">${won ? `Matched them all in ${G.tries} tries. <button class="btn-s ghost" data-mem="new">Again</button>` : `Find the pairs. Tries: ${G.tries}`}</p><div class="memgrid">${G.L.map((x, i) => `<button class="mem${G.open.includes(i) || G.got.includes(i) ? ' up' : ''}" data-mem="${i}">${G.open.includes(i) || G.got.includes(i) ? x : '?'}</button>`).join('')}</div>`;
}
function cueApp() {
  UI.cue = UI.cue || { hits: 0, n: 0, on: false };
  const G = UI.cue;
  return `<p class="small">Hit the drum when the light flashes. ${G.n ? `${G.hits} of ${G.n} on the beat.` : ''}</p><div class="cuepad"><span class="cuelight" id="cuelight"></span><button class="btn-s" data-cue="tap">🥁 Hit</button> <button class="btn-s ghost" data-cue="start">${G.on ? 'Restart' : 'Start'}</button></div>`;
}
const SCRAMBLE = ['DIRECTOR', 'CLAPPER', 'TRAILER', 'PREMIERE', 'MONTAGE', 'CLOSEUP', 'CASTING', 'SOUNDTRACK', 'STUNTMAN', 'SPOTLIGHT', 'SCREENPLAY', 'PODCAST', 'CHORUS', 'ENCORE'];
function scrambleApp() {
  if (!UI.scr) { const w = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]; UI.scr = { w, s: w.split('').sort(() => Math.random() - .5).join(''), got: 0, n: 0 }; }
  const G = UI.scr;
  return `<p class="big" style="letter-spacing:.3em">${G.s}</p><p><input id="scr-in" type="text" maxlength="14" autocomplete="off"> <button class="btn-s" data-scr="go">Check</button> <button class="btn-s ghost" data-scr="skip">Skip</button></p><p class="small muted">${G.n ? `${G.got} of ${G.n} solved.` : 'A film word, shuffled.'}</p>`;
}
function playGame(a) { const M = S.me, day = S.week * 7 + (M.wk ? M.wk.day : 0); if (M.playD === day) return false; M.playD = day; M.stress = clamp(M.stress - clamp(a.score || 1, 1, 4), 0, 100); return true; }
function storeApp() {
  const M = S.me; if (typeof storeHTML === 'function') return storeHTML();
  return `<p class="small muted">Games for the bad days; tools that make your work better.</p><div class="shop">${Object.entries(SHOP).map(([k, it]) => { const own = (M.owned2 || []).includes(k); return `<div class="sitem"><b>${esc(it.label)}</b><p class="small">${esc(it.d)}</p>${own ? '<span class="good small">Owned</span>' : `<button class="btn-s" data-buyapp="${k}" ${M.cash < usd(it.price) ? 'disabled' : ''}>Buy ${fmtCash(usd(it.price))}</button>`}</div>`; }).join('')}</div>`;
}
function appWindow2(k) {
  if (appLocked(k)) return `<p>${esc(SHOP[k].label)} isn't installed. <button class="btn-s" data-app="store">Get it in the App Store</button></p>`;
  switch (k) {
    case 'ticker': return tickerApp();
    case 'studio': return studioApp();
    case 'cutroom': return cutroomApp();
    case 'store': return storeApp();
    case 'bazaar': return typeof bazaarApp === 'function' ? bazaarApp() : '';
    case 'match': return matchApp();
    case 'cue': return cueApp();
    case 'scramble': return scrambleApp();
  }
  return '';
}
// clicks for the computer, called from the career click handler
function computerClick(t) {
  const d = t.dataset;
  if (typeof msgClick === 'function' && msgClick(t)) return true;
  if (typeof depthClick === 'function' && depthClick(t)) return true;
  if (typeof relicClick === 'function' && relicClick(t)) return true;
  if (typeof chartClick === 'function' && chartClick(t)) return true;
  if (typeof boardroomClick === 'function' && boardroomClick(t)) return true;
  if (typeof gamesClick === 'function' && gamesClick(t)) return true;
  if (typeof osClick === 'function' && osClick(t)) return true;
  if (typeof osFoldClick === 'function' && osFoldClick(t)) return true;
  if (typeof libClick === 'function' && libClick(t)) return true;
  if (typeof rogerClick === 'function' && rogerClick(t)) return true;
  if (typeof bankClick === 'function' && bankClick(t)) return true;
  if (typeof paperClick === 'function' && paperClick(t)) return true;
  if (d.mailf) { UI.mailf = d.mailf; UI.mailo = null; render(true); return true; }
  if (d.mailo) { UI.mailo = +d.mailo; render(true); return true; }
  if (d.app && (d.mailo || d.geatab)) UI.app = d.app;
  if (d.wmax) { UI.wmax = !UI.wmax; render(true); return true; }
  if (d.wall) { UI.wall = d.wall; try { localStorage.setItem('ab-wall', d.wall); } catch (e) { } render(true); return true; }
  if (typeof marketClick === 'function' && marketClick(t)) return true;
  if (d.smf) { const [k, v] = d.smf.split(':'); (UI.smf = UI.smf || { role: 'all', where: 'all' })[k] = v; render(true); return true; }
  if (d.mkf) { UI.mkf = d.mkf; render(true); return true; }
  if (d.geatab) { UI.geatab = d.geatab; render(true); return true; }
  if (d.mailact) { const [id, k] = d.mailact.split(':'); doAct({ t: 'mail', id: +id, k }); render(true); return true; }
  if (d.trade) { const [co, n] = d.trade.split(':'); doAct({ t: 'trade', co: +co, n: +n }); render(true); return true; }
  if (d.seq) { const [r, c] = d.seq.split(':').map(Number), G = seqGrid(); G[r][c] = G[r][c] ? 0 : 1; render(true); return true; }
  if (d.seqplay) { playSeq(); return true; }
  if (d.podcut) { const i = +d.podcut; UI.cuts = UI.cuts || []; UI.cuts = UI.cuts.includes(i) ? UI.cuts.filter(x => x !== i) : UI.cuts.concat(i); render(true); return true; }
  if (d.clip !== undefined) { const i = +d.clip; if (UI.pickC === null || UI.pickC === undefined) UI.pickC = i; else { const O = UI.order; [O[UI.pickC], O[i]] = [O[i], O[UI.pickC]]; UI.pickC = null; } render(true); return true; }
  if (d.thumb !== undefined) { UI.thumb = +d.thumb; render(true); return true; }
  if (d.session) {
    let score = 0;
    if (d.session === 'studio') score = seqScore(seqGrid());
    else if (d.session === 'podcut') { const segs = podSegs(), cut = UI.cuts || []; score = clamp(Math.round(cut.reduce((t, i) => t + (segs[i] === 'talk' ? -2 : 1), 0) / Math.max(1, segs.filter(s => s !== 'talk').length) * 10), 0, 10); UI.cuts = []; }
    else if (d.session === 'edit') { score = cutScore(cutOrder(), UI.thumb); UI.thumb = null; UI.orderW = -1; }
    doAct({ t: 'session', score }); render(true); return true;
  }
  if (d.buyapp) { doAct({ t: 'buyapp', k: d.buyapp }); render(true); return true; }
  if (d.mem) {
    if (d.mem === 'new') { UI.match = null; render(true); return true; }
    const G = UI.match, i = +d.mem; if (!G || G.got.includes(i) || G.open.includes(i)) return true;
    if (G.open.length === 2) G.open = [];
    G.open.push(i);
    if (G.open.length === 2) { G.tries++; if (G.L[G.open[0]] === G.L[G.open[1]]) { G.got.push(...G.open); G.open = []; if (G.got.length === G.L.length) doAct({ t: 'play', game: 'match', score: G.tries <= 9 ? 3 : 2 }); } }
    render(true); return true;
  }
  if (d.cue) {
    const G = UI.cue = UI.cue || { hits: 0, n: 0 };
    if (d.cue === 'start') { clearInterval(UI.cueT); Object.assign(G, { hits: 0, n: 0, on: true, lit: 0 }); UI.cueT = setInterval(() => { G.lit = performance.now(); const el = document.getElementById('cuelight'); if (el) { el.classList.add('lit'); setTimeout(() => el.classList.remove('lit'), 180); } }, 900); render(true); return true; }
    if (G.on) { G.n++; if (performance.now() - G.lit < 260) G.hits++; if (G.n >= 12) { clearInterval(UI.cueT); G.on = false; doAct({ t: 'play', game: 'cue', score: G.hits >= 9 ? 4 : G.hits >= 6 ? 2 : 1 }); } render(true); }
    return true;
  }
  if (d.scr) {
    const G = UI.scr; if (!G) return true;
    if (d.scr === 'go') { const v = (($('#scr-in') || {}).value || '').trim().toUpperCase(); G.n++; if (v === G.w) { G.got++; if (G.got % 3 === 0) doAct({ t: 'play', game: 'scramble', score: 2 }); } }
    else G.n++;
    const w = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]; Object.assign(G, { w, s: w.split('').sort(() => Math.random() - .5).join('') });
    render(true); return true;
  }
  return false;
}
const COMPUTER_CLICKS = '[data-board],[data-brt],[data-cht],[data-chpg],[data-relic],[data-hl],[data-yq],[data-unsub],[data-storef],[data-osback],[data-osclose],[data-bank],[data-sec],[data-rt],[data-libf],[data-numdec],[data-npt],[data-paper],[data-osf],[data-osthread],[data-bz],[data-bzt],[data-mailsend],[data-wmax],[data-mkt],[data-wall],[data-smf],[data-mkf],[data-geatab],[data-mailf],[data-mailo],[data-mailact],[data-trade],[data-seq],[data-seqplay],[data-podcut],[data-clip],[data-thumb],[data-session],[data-buyapp],[data-mem],[data-cue],[data-scr]';
