// ---------------- Clapgram ----------------
// The industry's photo app (it used to be called Flick). Everyone you know posts: call times and craft-services
// tables, wrap parties, premieres, awards, new jobs and new dogs, built from what's really happening to them, and
// studios push the films opening soon. Famous people post too, with the likes to match. Stories run along the top.
// You can post as well: followers come from who you are and what you share, comments come from your circle, and a
// photo from a closed set while you're shooting is the kind of thing producers notice.
const CG_BG = [['#f6d365', '#fda085'], ['#a1c4fd', '#c2e9fb'], ['#d4fc79', '#96e6a1'], ['#fbc2eb', '#a6c1ee'], ['#ffecd2', '#fcb69f'], ['#cfd9df', '#e2ebf0'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'], ['#5ee7df', '#b490ca']];
// [main emoji, label, captions, scene emojis scattered behind, photo style]
const CG_KIND = {
  set: ['🎬', 'On set', ['Call time 5am. Coffee number three.', 'Somewhere between setup 14 and setup 15.', 'The crew that makes it happen. {mate} carried us today.', 'Lunch is the best part of the day and I will not be taking questions.', 'Rain machine, real rain, who can tell.', 'Day {n} of {m}. Still in love with this job.', 'Waiting on the light. Again.', '{mate} just nailed it in one take. One.'], ['🎥', '💡', '🎞️', '☕'], 'warm'],
  wrap: ['🍾', 'That\'s a wrap', ['That\'s a wrap! Thank you to the best crew in the world.', 'Wrapped. Sleeping for a week. Love you all.', 'Last day. Didn\'t cry. (Cried.)', 'Wrap party survivors, {day} edition.', '{n} weeks, one family. Wrapped.'], ['🎉', '🥂', '🎊'], 'party'],
  premiere: ['🎟️', 'Premiere night', ['Premiere night. Pinch me.', 'Out this Friday. Go see it in a cinema, with strangers.', 'Red carpet, borrowed shoes.', 'My mum is here. My MUM is here.', 'Two years of work, two hours of film. Go.'], ['✨', '📸', '🌟'], 'night'],
  award: ['🏆', 'Award', ['I have no speech prepared and I\'m still shaking.', 'Thank you. Just… thank you.', 'For everyone who ever said I couldn\'t.', 'Sharing this one with {mate}. You know why.'], ['✨', '🌟', '🎖️'], 'gold'],
  job: ['💼', 'News', ['Some news: new job, new chapter.', 'Can finally say it: I\'m on a new project.', 'Day one. Pretending I know where the toilets are.', 'Signed, sealed, terrified.'], ['📝', '🤝'], 'clean'],
  life: ['✨', 'Life', ['Big week.', 'Some personal news.', 'Life, eh.'], ['💫'], 'soft'],
  food: ['🍜', 'Food', ['Craft services outdid themselves.', 'Post-shoot noodles are a human right.', 'Brunch with the best people.', 'Ranked every taco truck in {city}. Thread.', 'Cooked for twelve. Survived.', 'The secret ingredient is exhaustion.'], ['🥢', '🌮', '🍕', '🥐', '🍣'], 'warm'],
  pet: ['🐶', 'Pets', ['My dog has better taste in films than most critics.', 'Supervisor, apparently.', 'Meet the newest member of the crew.', 'He watched the whole rough cut. Didn\'t blink.', 'Script notes from management.'], ['🐾', '🦴', '🧶'], 'soft'],
  cat: ['🐈', 'Pets', ['She sat on the script. Page 47 is now hers.', 'Head of Development, feline division.', 'No thoughts, only sunbeam.'], ['🐾', '🧶', '☀️'], 'soft'],
  view: ['🌅', 'Location', ['The view from today\'s location.', 'Magic hour, as promised.', 'Not a bad office.', '{city}, you show-off.', 'We drove four hours for this shot. Worth it.'], ['🌄', '🏞️', '🌊', '🏙️'], 'sky'],
  throwback: ['📼', 'Throwback', ['Throwback to my first ever set. The hair. The confidence.', '{y}. Who remembers?', 'Found this in a box. Who remembers?', 'Ten years ago today. {mate}, you look exactly the same.'], ['📷', '🎞️'], 'sepia'],
  thought: ['💭', 'Thoughts', ['Rewatching an old favourite tonight. Some films just hold up.', 'Hot take: the intermission should come back.', 'Reading scripts in the park like a cliché.', 'Every film is a miracle. Every single one.', 'Unpopular opinion: the {genre} is the hardest genre to get right.'], ['📖', '☁️', '🖋️'], 'clean'],
  gym: ['🏋️', 'Training', ['Training for the role. Send snacks.', '5am gym, because {day}s are relentless.', 'My trainer is a sadist and I love him.'], ['💪', '🥤'], 'clean'],
  travel: ['✈️', 'Travel', ['Off to {place} for the shoot. See you in two months.', 'Airport lounge office. Living the dream.', 'Hello {place}. Be gentle.'], ['🧳', '🗺️', '🌍'], 'sky'],
  coffee: ['☕', 'Coffee', ['This café is my office now.', 'Third flat white, first good idea.', 'Writing in public like a lunatic.'], ['🥐', '📓'], 'warm'],
  gig: ['🎸', 'Night out', ['Front row. Ears ringing. Worth it.', 'Saw a band nobody\'s heard of. Next year everyone will.', 'Karaoke with the crew. Evidence deleted.'], ['🎤', '🎶', '🪩'], 'night'],
  books: ['📚', 'Reading', ['Reading the book before everyone options it.', 'Library haul. Ambitious.', 'This novel would make a perfect limited series. Just saying.'], ['🔖', '☕'], 'sepia'],
  festival: ['🎪', 'Festival', ['Lanyard on, sleep off. Festival mode.', 'Six films a day and one meal. Festival diet.', 'Queued in the rain for a midnight screening. No regrets.'], ['🎟️', '🌧️', '🎬'], 'party'],
  carpet: ['📸', 'Red carpet', ['Borrowed the suit, kept the smile.', 'Look left, look right, look like you belong.', 'Thank you to the stylist who made this happen.'], ['✨', '🌟', '💎'], 'gold'],
  gear: ['📷', 'Kit', ['New lens day. Everything looks cinematic now, including my breakfast.', 'Packing for the shoot: 40 kg of kit and one sock.', 'Old camera, new tricks.'], ['🔋', '🎞️', '🔦'], 'clean'],
  page: ['📄', 'Pages', ['Page one. The scariest page.', 'FADE IN: (that\'s all I have so far)', 'Draft {n}. It\'s getting somewhere.'], ['✏️', '☕', '🗒️'], 'paper'],
  home: ['🏡', 'Home', ['New flat. Two boxes unpacked. Forty to go.', 'Finally hung the posters.', 'Plants: 6. Plants alive: 4.'], ['🪴', '🛋️', '🖼️'], 'soft'],
  weather: ['⛈️', 'Weather', ['Biblical weather in {city} today. Shoot cancelled, mood restored.', 'Too hot to think. Too hot to write. Writing anyway.', 'Snow day! Nobody is getting anything done.'], ['🌧️', '☂️', '❄️'], 'storm'],
  promo: ['📣', 'Coming soon', ['Coming soon.', 'In cinemas this month.', 'The trailer is out. Tell your friends.', 'Tickets on sale now.'], ['🎬', '🍿', '🎟️'], 'night'],
  ad: ['🛍️', 'Sponsored', ['Shot on the only lens you\'ll ever need.', 'The notebook writers swear by.', 'Hydrate like a stunt double.'], ['✨'], 'clean']
};
const CG_STYLE = { warm: ['#f6d365', '#fda085'], party: ['#f093fb', '#f5576c'], night: ['#30cfd0', '#330867'], gold: ['#f7d774', '#b8860b'], clean: ['#e0eafc', '#cfdef3'], soft: ['#fbc2eb', '#a6c1ee'], sky: ['#4facfe', '#00f2fe'], sepia: ['#d6b98c', '#8b6b4a'], paper: ['#fdfbf3', '#e9e1c8'], storm: ['#536976', '#292e49'] };
const CG_COMMENTS = {
  any: ['obsessed', 'this!!', 'ICONIC', 'so proud of you', 'need the full story', 'when are we getting a drink', 'stop it 😭', 'legend', 'who took this, it\'s gorgeous', 'take me with you', 'deserved', 'ok but where is this', '❤️❤️', 'the energy here', 'main character behaviour'],
  set: ['what are you shooting??', 'that light though', 'hydrate!!', 'is that the {mate} I know?', 'send me the call sheet, I\'ll bring coffee'],
  wrap: ['congrats!!!', 'what a crew', 'can\'t wait to see it', 'sleep now, celebrate later'], premiere: ['save me a seat', 'buying tickets now', 'the outfit!!', 'so proud of you'], award: ['DESERVED', 'crying', 'speech!!', 'about time'],
  pet: ['I would die for this dog', 'head of development indeed', 'more pet content please', 'GOOD BOY'], cat: ['the audacity', 'she\'s the real writer', 'cat tax paid'], food: ['recipe?', 'where is this', 'I\'m starving now, thanks'],
  gym: ['ok Rocky', 'teach me', 'I got tired reading this'], travel: ['bring me back something', 'jealous', 'safe travels!'], gig: ['who is this band', 'next time take me', 'ears ok?'], festival: ['see you in the queue', 'what was the best one?'], weather: ['stay dry!', 'same here, total chaos'],
  page: ['can I read it?', 'FADE IN is the hardest part', 'go go go'], home: ['housewarming when?', 'the plants are fine, probably'], ad: ['ad?? in this economy', 'I bought one, it\'s fine', 'sponsored, sure']
};
function cgComment(k, r, mate) { const L = (CG_COMMENTS[k] || []).concat(CG_COMMENTS.any); return L[Math.floor(r() * L.length)].replace('{mate}', mate || 'one'); }
const CG_PLACES = ['Reykjavík', 'Marrakesh', 'Lisbon', 'the Highlands', 'Budapest', 'the desert', 'Cape Town', 'Kyoto', 'Patagonia', 'Sicily', 'Prague', 'Montréal'];
// fill a caption: the city, a mate, the day, a number, the genre, a place, a year
function cgFill(t, id, r) {
  const M = S.me, mates = aliveKnown().filter(x => x !== id), mate = mates.length ? '@' + cgHandle(P(mates[Math.floor(r() * mates.length)])).slice(1) : '@everyone';
  return t.replace('{city}', hubName(M.hub)).replace('{mate}', mate).replace('{day}', DAYS7[Math.floor(r() * 7)]).replace('{n}', 2 + Math.floor(r() * 30)).replace('{m}', 30 + Math.floor(r() * 30)).replace('{genre}', (Object.keys(AMB)[Math.floor(r() * Object.keys(AMB).length)] || 'drama').toLowerCase()).replace('{place}', CG_PLACES[Math.floor(r() * CG_PLACES.length)]).replace('{y}', S.year - 5 - Math.floor(r() * 20));
}
function cgHandle(p) { return '@' + p.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '').slice(0, 16); }
function cgFollowers(p) { const f = p.fame || 0; return Math.round(120 + f * f * 40 + p.standing * 25 + (hashRand(p.id * 13)() * 300)); }
function cgFmt(n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(n); }
// what everyone posted, built from their lives and their work
function cgFeed() {
  const M = S.me, out = [], ids = [...new Set(aliveKnown().concat(M.follow || []))].filter(id => P(id) && !P(id).dead);
  const tag = f => f ? '#' + f.title.replace(/[^A-Za-z0-9]+/g, '') : '';
  for (const id of ids) {
    const p = P(id), r = hashRand(((id * 2654435761) ^ (S.week * 40503 + 977)) >>> 0); r(); r();   // well-mixed, so neighbours don't all post the same thing
    for (const e of (p.life || []).filter(e => S.week - e.w < 6)) out.push({ id: `l${id}-${e.w}`, who: id, w: e.w, k: 'life', t: e.t + '.' });
    const fA = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id) && f.stage >= 0 && f.stage < 4);
    const fR = (p.credits || []).slice(-2).map(i => S.films[i]).find(f => f && f.rel !== null && S.week - f.rel >= 0 && S.week - f.rel < 3);
    if (fR) out.push({ id: `r${id}-${fR.id}`, who: id, w: fR.rel, k: 'premiere', t: cgFill(pickLine(CG_KIND.premiere[2], id), id, r) + ' ' + tag(fR), film: fR.id });
    else if (fA && fA.stage === 2 && r() < .5) out.push({ id: `s${id}-${S.week}`, who: id, w: S.week, k: r() < .7 ? 'set' : 'view', t: cgFill(pickLine(CG_KIND.set[2], id + S.week), id, r) + ' ' + tag(fA), film: fA.id });
    else if (fA && fA.stage === 3 && fA.stageEnd - S.week > 8 && r() < .2) out.push({ id: `w${id}-${fA.id}`, who: id, w: S.week, k: 'wrap', t: cgFill(pickLine(CG_KIND.wrap[2], id), id, r) + ' ' + tag(fA), film: fA.id });
    else for (let b = 0; b < 3; b++) { const wk = S.week - b, q = hashRand(((id * 2654435761) ^ (wk * 40503 + 31)) >>> 0); q(); if (q() < .3) {
      const wx = typeof wxDay === 'function' ? wxDay(p.hub || M.hub, wk, 2) : null, bad = wx && ['storm', 'snow', 'heat'].includes(wx.k);
      const pool = ['food', 'pet', 'cat', 'thought', 'throwback', 'view', 'gym', 'travel', 'coffee', 'gig', 'books', 'gear', 'home'].concat(p.role === 'writer' ? ['page', 'page'] : [], (p.fame || 0) > 40 ? ['carpet', 'festival'] : []);
      const k = bad && q() < .5 ? 'weather' : pool[Math.floor(q() * pool.length)], L = CG_KIND[k][2]; out.push({ id: `p${id}-${wk}`, who: id, w: wk, k, t: cgFill(L[Math.floor(q() * L.length)], id, q) }); break; } }   // their last post in the past three weeks
    const aw = (S.awards || []).filter(a => a.y === S.year && (a.people || []).includes(id)).slice(-1)[0];
    if (aw) out.push({ id: `a${id}-${aw.y}`, who: id, w: S.week, k: 'award', t: `${aw.name.split(':').pop().trim()}. ${cgFill(pickLine(CG_KIND.award[2], id), id, r)}`, film: aw.film });
  }
  // studios push what's opening soon
  for (const f of S.active.map(i => S.films[i]).filter(f => f.hub === M.hub && f.co !== null && f.stage === 3 && f.stageEnd - S.week <= 4 && f.stageEnd >= S.week).slice(0, 3))
    out.push({ id: `c${f.id}`, co: f.co, w: S.week, k: 'promo', t: `${cgFill(pickLine(CG_KIND.promo[2], f.id), f.id, hashRand(f.id * 7 + 3))} ${f.title}, ${fmtDate(f.stageEnd, true)}. ${tag(f)}`, film: f.id });
  const fam = S.pool[M.hub] ? Object.values(S.pool[M.hub]).flat().map(P).filter(p => p && !p.dead && (p.fame || 0) > 55 && !ids.includes(p.id)).sort((a, b) => b.fame - a.fame).slice(0, 12) : [];
  for (let i = 0; i < Math.min(2, fam.length); i++) { const p = fam[(S.week * 5 + i * 7) % fam.length], q = hashRand(p.id * 977 + S.week); const k = ['carpet', 'travel', 'gym', 'set', 'pet', 'festival'][Math.floor(q() * 6)]; out.push({ id: `f${p.id}-${S.week}`, who: p.id, w: S.week, k, t: cgFill(CG_KIND[k][2][Math.floor(q() * CG_KIND[k][2].length)], p.id, q), sugg: 1 }); }
  if (S.week % 3 === 0) { const q = hashRand(S.week * 31 + 7), brand = ['Lumenra Optics', 'Inkwell Notebooks', 'StuntFuel', 'Grip & Co.'][Math.floor(q() * 4)]; out.push({ id: `ad${S.week}`, ad: brand, w: S.week, k: 'ad', t: cgFill(CG_KIND.ad[2][Math.floor(q() * CG_KIND.ad[2].length)], 0, q) }); }
  for (const x of M.posts || []) out.push(Object.assign({ mine: 1 }, x));
  return out.sort((a, b) => b.w - a.w || (b.mine ? 1 : 0) - (a.mine ? 1 : 0)).slice(0, 30);
}
function cgLikes(x) { const base = x.mine ? x.likes : x.co !== undefined ? 800 + hashRand(x.co)() * 9000 : cgFollowers(P(x.who)) * (.04 + hashRand(x.id.length * 97 + (x.who || 0))() * .08) * (x.k === 'award' || x.k === 'premiere' ? 3 : x.k === 'pet' ? 1.6 : 1); return Math.round(base); }
function cgPhoto(x, size = 'big') {
  const K = CG_KIND[x.k] || CG_KIND.thought, r = hashRand(((x.who || x.co || 7) * 2654435761 ^ (x.w * 977 + x.id.length)) >>> 0), g = CG_STYLE[K[4]] || CG_BG[Math.floor(r() * CG_BG.length)];
  const f = x.film !== undefined ? S.films[x.film] : null, cap = f ? f.title : K[1], ang = 100 + Math.floor(r() * 80);
  const bits = (K[3] || []).map((e, i) => `<span class="cg-bit" style="left:${8 + Math.floor(r() * 80)}%;top:${8 + Math.floor(r() * 70)}%;font-size:${16 + Math.floor(r() * 18)}px;transform:rotate(${Math.floor(r() * 40) - 20}deg)">${e}</span>`).join('');
  return `<div class="cg-ph ${size} st-${K[4] || 'clean'}" style="background:linear-gradient(${ang}deg,${g[0]},${g[1]})">${size === 'big' ? bits : ''}<span class="cg-em">${K[0]}</span><span class="cg-cap">${esc(cap)}</span></div>`;
}
function cgPost(x) {
  const M = S.me;
  if (x.ad) return `<article class="cg-post"><header><span class="cg-av">🛍️</span><div><b>${esc(x.ad)}</b> <span class="muted small">Sponsored</span></div></header>${cgPhoto(x)}<p>${esc(x.t)}</p><p class="small muted">${cgComment('ad', hashRand(x.w * 3), '')}</p></article>`;
  const who = x.mine ? ME() : x.co !== undefined ? null : P(x.who), name = x.co !== undefined ? S.companies[x.co].name : who.name;
  const handle = x.co !== undefined ? '@' + S.companies[x.co].name.toLowerCase().replace(/[^a-z]+/g, '') : cgHandle(who);
  const likes = cgLikes(x) + ((M.liked || {})[x.id] ? 1 : 0), r = hashRand(x.id.length * 131 + (x.who || 0) + x.w);
  const com = x.mine ? (x.comments || []) : aliveKnown().filter(id => id !== x.who).slice(0, 12).filter(() => r() < .25).slice(0, 3).map(id => [id, cgComment(x.k, r, cgHandle(P(x.who || id)).slice(1))]);
  return `<article class="cg-post">
   <header>${x.co !== undefined ? '<span class="cg-av">🏢</span>' : phoneAvatar(x.mine ? ME().id : x.who, 30)}<div><b>${x.co !== undefined ? cl(x.co) : x.mine ? esc(name) : pl(x.who)}</b> <span class="muted small">${esc(handle)}${(who && (who.fame || 0) > 60) || x.co !== undefined ? ' ✔︎' : ''}</span><br><span class="muted small">${x.sugg ? 'Suggested for you · ' : ''}${S.week - x.w ? (S.week - x.w) + 'w ago' : 'this week'}${x.film !== undefined ? ' · ' + fl(x.film) : ''}</span></div></header>
   ${cgPhoto(x)}
   <div class="cg-act">${x.mine ? `<span>♥ ${cgFmt(likes)}</span>` : (M.liked || {})[x.id] ? `<span class="good">♥ ${cgFmt(likes)}</span>` : x.co !== undefined ? `<span>♡ ${cgFmt(likes)}</span>` : `<button class="linkish" data-like="${x.id}|${x.who}">♡ ${cgFmt(likes)}</button>`}<span class="muted small">${com.length} comment${com.length === 1 ? '' : 's'}</span></div>
   <p><b>${esc(handle.slice(1))}</b> ${esc(x.t)}</p>${com.map(([id, t]) => `<p class="small"><b>${esc(cgHandle(P(id)).slice(1))}</b> ${esc(t)}</p>`).join('')}
  </article>`;
}
// you post
function cgPostAct(a) {
  const M = S.me, me = ME(), K = CG_KIND[a.k]; if (!K || !['set', 'food', 'pet', 'cat', 'view', 'throwback', 'thought', 'job', 'gym', 'travel', 'coffee', 'gig', 'books', 'gear', 'page', 'home'].includes(a.k)) return false;
  if ((M.posts || []).some(x => x.w === S.week)) return false;   // one a week, like a person with a life
  const text = String(a.text || '').replace(/\s+/g, ' ').trim().slice(0, 160) || cgFill(pickLine(K[2], S.week), M.id, hashRand(S.week * 17 + 5));
  const fol = M.cgFol = Math.round((M.cgFol || cgFollowers(me)) * 1);
  const film = M.jobs.map(j => j.film).find(f => f !== null && f !== undefined);
  const appeal = ({ set: 1.4, view: 1.2, pet: 1.7, cat: 1.8, food: .9, throwback: 1.1, thought: .8, job: 1.5, gym: 1, travel: 1.3, coffee: .7, gig: 1.1, books: .8, gear: 1, page: .9, home: 1.1 }[a.k] || 1) * (.6 + prnd() * .9);
  const likes = Math.round(fol * .06 * appeal + 3);
  const comments = aliveKnown().filter(id => opinion(id) > 15).slice(0, 8).filter(() => prnd() < .3).slice(0, 3).map(id => [id, cgComment(a.k, prnd, '')]);
  for (const [id] of comments) addTie(me, P(id), .5);
  M.cgFol = fol + Math.round(likes * (.05 + prnd() * .1));
  me.fame = clamp((me.fame || 0) + Math.min(.3, likes / 20000), 0, 100);
  const x = { id: 'm' + S.week, w: S.week, k: a.k, t: text, likes, comments, film: a.k === 'set' && film !== undefined ? film : undefined };
  (M.posts = M.posts || []).push(x); if (M.posts.length > 40) M.posts.shift();
  // a photo from a closed set: the producer sees everything
  if (a.k === 'set' && film !== undefined && prnd() < .35) { const f = S.films[film], head = f.prod; if (head !== undefined && P(head)) { addTie(me, P(head), -6); inbox('note', 'About that photo', `${P(head).name} saw your post from the set of ${f.title}. "Closed set means closed set." It comes down; the producer remembers.`, { person: head }); x.t += ' [deleted]'; } }
  return true;
}
function clapgramApp() {
  const M = S.me, me = ME(), tab = UI.cgTab || 'feed', feed = cgFeed();
  const stories = [...new Set(feed.filter(x => S.week - x.w < 1 && x.who !== undefined && !x.mine).map(x => x.who))].slice(0, 12);
  const tabs = [['feed', 'Home'], ['explore', 'Explore'], ['me', 'You']].map(([k, l]) => `<button class="pill${tab === k ? ' on' : ''}" data-cgtab="${k}">${l}</button>`).join('');
  let body = '';
  if (tab === 'feed') body = `<div class="cg-stories">${stories.map(id => `<button class="cg-st" data-go="person:${id}">${phoneAvatar(id, 44)}<small>${esc(P(id).name.split(' ')[0])}</small></button>`).join('') || '<span class="muted small">No stories this week.</span>'}</div>
    <div class="cg-feed">${feed.map(cgPost).join('') || '<p class="muted">Nobody you know has posted yet. Meet people, or follow some on Explore.</p>'}</div>`;
  else if (tab === 'explore') {
    const tags = {}; for (const f of S.active.map(i => S.films[i]).filter(f => f.hub === M.hub && f.stage >= 2)) tags['#' + f.title.replace(/[^A-Za-z0-9]+/g, '')] = (tags['#' + f.title.replace(/[^A-Za-z0-9]+/g, '')] || 0) + (f.tier === 1 ? 5 : 2);
    for (const g of Object.keys(AMB).slice(0, 6)) tags['#' + g.replace(/\W+/g, '') + 'Films'] = 1 + hashRand(g.length + S.week)() * 3;
    const sugg = S.pool[M.hub] ? Object.values(S.pool[M.hub]).flat().map(P).filter(p => p && !p.dead && !M.known[p.id] && !(M.follow || []).includes(p.id) && (p.fame || 0) > 30).sort((a, b) => b.fame - a.fame).slice(0, 8) : [];
    body = `<h5>Trending in ${esc(hubName(M.hub))}</h5><div class="bf-row">${Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => `<span class="pill">${esc(t)}</span>`).join('')}</div>
     <h5>Accounts to follow</h5><div class="cg-sugg">${sugg.map(p => `<div class="cg-acc">${portraitOf(p, 48)}<b>${pl(p.id)}</b><span class="muted small">${esc(cgHandle(p))} · ${cgFmt(cgFollowers(p))}</span><button class="btn-s" data-cgfollow="${p.id}">Follow</button></div>`).join('') || '<p class="muted small">You follow everyone worth following.</p>'}</div>`;
  } else {
    const fol = M.cgFol || cgFollowers(me), posts = (M.posts || []).slice().reverse(), posted = posts.some(x => x.w === S.week);
    body = `<div class="cg-me">${portraitOf(me, 64)}<div><b>${esc(me.name)}</b> <span class="muted">${esc(cgHandle(me))}</span><p class="small"><b>${cgFmt(fol)}</b> followers · <b>${posts.length}</b> posts · following <b>${Object.keys(M.known).length + (M.follow || []).length}</b></p></div></div>
     <div class="cg-new"><h5>New post</h5>${posted ? '<p class="muted small">You\'ve posted this week. Leave them wanting more.</p>' : `<div class="bf-row">${['set', 'view', 'food', 'pet', 'cat', 'coffee', 'gym', 'travel', 'gig', 'books', 'gear', 'page', 'home', 'throwback', 'thought', 'job'].map(k => `<button class="pill${(UI.cgK || 'thought') === k ? ' on' : ''}" data-cgk="${k}">${CG_KIND[k][0]} ${CG_KIND[k][1]}</button>`).join('')}</div><div class="compose own"><input id="cg-text" maxlength="160" placeholder="Write a caption…" value="${esc(UI.cgText || '')}"><button class="btn-s" data-cgpost="1">Post</button></div><p class="small muted">Pets and set photos do best. A photo from a closed set can cost you with the producer.</p>`}</div>
     <div class="cg-grid">${posts.map(x => `<div title="${esc(x.t)} · ♥ ${x.likes}">${cgPhoto(x, 'small')}</div>`).join('') || '<p class="muted small">No posts yet.</p>'}</div>`;
  }
  return `<div class="cg"><div class="cg-top"><b class="cg-logo">Clapgram</b><span class="bf-row">${tabs}</span></div>${body}</div>`;
}
function cgClick(t) {
  const d = t.dataset;
  if (d.cgtab) { UI.cgTab = d.cgtab; render(true); return true; }
  if (d.cgk) { UI.cgK = d.cgk; render(true); return true; }
  if (d.cgpost) { const v = ($('#cg-text') || {}).value || ''; doAct({ t: 'cgpost', k: UI.cgK || 'thought', text: v }); UI.cgText = ''; render(true); return true; }
  if (d.cgfollow) { doAct({ t: 'cgfollow', id: +d.cgfollow }); render(true); return true; }
  return false;
}
function cgFollow(a) { const M = S.me, p = P(a.id); if (!p || p.dead || M.known[a.id]) return false; M.follow = M.follow || []; if (M.follow.includes(a.id)) return false; M.follow.push(a.id); if (M.follow.length > 60) M.follow.shift(); return true; }
