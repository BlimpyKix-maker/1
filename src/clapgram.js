// ---------------- Clapgram ----------------
// The industry's photo app (it used to be called Flick). Everyone you know posts: call times and craft-services
// tables, wrap parties, premieres, awards, new jobs and new dogs, built from what's really happening to them, and
// studios push the films opening soon. Famous people post too, with the likes to match. Stories run along the top.
// You can post as well: followers come from who you are and what you share, comments come from your circle, and a
// photo from a closed set while you're shooting is the kind of thing producers notice.
const CG_BG = [['#f6d365', '#fda085'], ['#a1c4fd', '#c2e9fb'], ['#d4fc79', '#96e6a1'], ['#fbc2eb', '#a6c1ee'], ['#ffecd2', '#fcb69f'], ['#cfd9df', '#e2ebf0'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'], ['#5ee7df', '#b490ca']];
const CG_KIND = {
  set: ['🎬', 'On set', ['Call time 5am. Coffee number three.', 'Somewhere between setup 14 and setup 15.', 'The crew that makes it happen.', 'Lunch is the best part of the day and I will not be taking questions.']],
  wrap: ['🍾', 'That\'s a wrap', ['That\'s a wrap! Thank you to the best crew in the world.', 'Wrapped. Sleeping for a week. Love you all.', 'Last day. Didn\'t cry. (Cried.)']],
  premiere: ['🎟️', 'Premiere night', ['Premiere night. Pinch me.', 'Out this Friday. Go see it in a cinema, with strangers.', 'Red carpet, borrowed shoes.']],
  award: ['🏆', 'Award', ['I have no speech prepared and I\'m still shaking.', 'Thank you. Just… thank you.', 'For everyone who ever said I couldn\'t.']],
  job: ['💼', 'News', ['Some news: new job, new chapter.', 'Can finally say it: I\'m on a new project.', 'Day one. Pretending I know where the toilets are.']],
  life: ['✨', 'Life', ['Big week.', 'Some personal news.', 'Life, eh.']],
  food: ['🍜', 'Food', ['Craft services outdid themselves.', 'Post-shoot noodles are a human right.', 'Brunch with the best people.']],
  pet: ['🐶', 'Pets', ['My dog has better taste in films than most critics.', 'Supervisor, apparently.', 'Meet the newest member of the crew.']],
  view: ['🌅', 'Location', ['The view from today\'s location.', 'Magic hour, as promised.', 'Not a bad office.']],
  throwback: ['📼', 'Throwback', ['Throwback to my first ever set. The hair. The confidence.', 'Ten years ago today.', 'Found this in a box. Who remembers?']],
  thought: ['💭', 'Thoughts', ['Rewatching an old favourite tonight. Some films just hold up.', 'Hot take: the intermission should come back.', 'Reading scripts in the park like a cliché.']],
  promo: ['📣', 'Coming soon', ['Coming soon.', 'In cinemas this month.', 'The trailer is out. Tell your friends.']]
};
const CG_COMMENTS = ['obsessed', 'this!!', 'ICONIC', 'so proud of you', 'need the full story', 'when are we getting a drink', 'stop it 😭', 'the hair though', 'legend', 'who took this, it\'s gorgeous', 'can\'t wait', 'take me with you', 'deserved', 'ok but where is this', '❤️❤️', 'save me a seat'];
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
    if (fR) out.push({ id: `r${id}-${fR.id}`, who: id, w: fR.rel, k: 'premiere', t: pickLine(CG_KIND.premiere[2], id) + ' ' + tag(fR), film: fR.id });
    else if (fA && fA.stage === 2 && r() < .5) out.push({ id: `s${id}-${S.week}`, who: id, w: S.week, k: r() < .7 ? 'set' : 'view', t: pickLine(CG_KIND.set[2], id + S.week) + ' ' + tag(fA), film: fA.id });
    else if (fA && fA.stage === 3 && fA.stageEnd - S.week > 8 && r() < .2) out.push({ id: `w${id}-${fA.id}`, who: id, w: S.week, k: 'wrap', t: pickLine(CG_KIND.wrap[2], id) + ' ' + tag(fA), film: fA.id });
    else for (let b = 0; b < 3; b++) { const wk = S.week - b, q = hashRand(((id * 2654435761) ^ (wk * 40503 + 31)) >>> 0); q(); if (q() < .28) { const k = ['food', 'pet', 'thought', 'throwback', 'view'][Math.floor(q() * 5)], L = CG_KIND[k][2]; out.push({ id: `p${id}-${wk}`, who: id, w: wk, k, t: L[Math.floor(q() * L.length)] }); break; } }   // their last post in the past three weeks
    const aw = (S.awards || []).filter(a => a.y === S.year && (a.people || []).includes(id)).slice(-1)[0];
    if (aw) out.push({ id: `a${id}-${aw.y}`, who: id, w: S.week, k: 'award', t: `${aw.name.split(':').pop().trim()}. ${pickLine(CG_KIND.award[2], id)}`, film: aw.film });
  }
  // studios push what's opening soon
  for (const f of S.active.map(i => S.films[i]).filter(f => f.hub === M.hub && f.co !== null && f.stage === 3 && f.stageEnd - S.week <= 4 && f.stageEnd >= S.week).slice(0, 3))
    out.push({ id: `c${f.id}`, co: f.co, w: S.week, k: 'promo', t: `${pickLine(CG_KIND.promo[2], f.id)} ${f.title}, ${fmtDate(f.stageEnd, true)}. ${tag(f)}`, film: f.id });
  for (const x of M.posts || []) out.push(Object.assign({ mine: 1 }, x));
  return out.sort((a, b) => b.w - a.w || (b.mine ? 1 : 0) - (a.mine ? 1 : 0)).slice(0, 30);
}
function cgLikes(x) { const base = x.mine ? x.likes : x.co !== undefined ? 800 + hashRand(x.co)() * 9000 : cgFollowers(P(x.who)) * (.04 + hashRand(x.id.length * 97 + (x.who || 0))() * .08) * (x.k === 'award' || x.k === 'premiere' ? 3 : x.k === 'pet' ? 1.6 : 1); return Math.round(base); }
function cgPhoto(x, size = 'big') {
  const g = CG_BG[Math.abs(hashRand((x.who || x.co || 7) * 17 + x.w)() * CG_BG.length | 0)], K = CG_KIND[x.k] || CG_KIND.thought;
  const f = x.film !== undefined ? S.films[x.film] : null, cap = f ? f.title : K[1];
  return `<div class="cg-ph ${size}" style="background:linear-gradient(135deg,${g[0]},${g[1]})"><span class="cg-em">${K[0]}</span><span class="cg-cap">${esc(cap)}</span></div>`;
}
function cgPost(x) {
  const M = S.me, who = x.mine ? ME() : x.co !== undefined ? null : P(x.who), name = x.co !== undefined ? S.companies[x.co].name : who.name;
  const handle = x.co !== undefined ? '@' + S.companies[x.co].name.toLowerCase().replace(/[^a-z]+/g, '') : cgHandle(who);
  const likes = cgLikes(x) + ((M.liked || {})[x.id] ? 1 : 0), r = hashRand(x.id.length * 131 + (x.who || 0) + x.w);
  const com = x.mine ? (x.comments || []) : aliveKnown().filter(id => id !== x.who).slice(0, 12).filter(() => r() < .25).slice(0, 2).map(id => [id, CG_COMMENTS[Math.floor(r() * CG_COMMENTS.length)]]);
  return `<article class="cg-post">
   <header>${x.co !== undefined ? '<span class="cg-av">🏢</span>' : phoneAvatar(x.mine ? ME().id : x.who, 30)}<div><b>${x.co !== undefined ? cl(x.co) : x.mine ? esc(name) : pl(x.who)}</b> <span class="muted small">${esc(handle)}${(who && (who.fame || 0) > 60) || x.co !== undefined ? ' ✔︎' : ''}</span><br><span class="muted small">${S.week - x.w ? (S.week - x.w) + 'w ago' : 'this week'}${x.film !== undefined ? ' · ' + fl(x.film) : ''}</span></div></header>
   ${cgPhoto(x)}
   <div class="cg-act">${x.mine ? `<span>♥ ${cgFmt(likes)}</span>` : (M.liked || {})[x.id] ? `<span class="good">♥ ${cgFmt(likes)}</span>` : x.co !== undefined ? `<span>♡ ${cgFmt(likes)}</span>` : `<button class="linkish" data-like="${x.id}|${x.who}">♡ ${cgFmt(likes)}</button>`}<span class="muted small">${com.length} comment${com.length === 1 ? '' : 's'}</span></div>
   <p><b>${esc(handle.slice(1))}</b> ${esc(x.t)}</p>${com.map(([id, t]) => `<p class="small"><b>${esc(cgHandle(P(id)).slice(1))}</b> ${esc(t)}</p>`).join('')}
  </article>`;
}
// you post
function cgPostAct(a) {
  const M = S.me, me = ME(), K = CG_KIND[a.k]; if (!K || !['set', 'food', 'pet', 'view', 'throwback', 'thought', 'job'].includes(a.k)) return false;
  if ((M.posts || []).some(x => x.w === S.week)) return false;   // one a week, like a person with a life
  const text = String(a.text || '').replace(/\s+/g, ' ').trim().slice(0, 160) || pickLine(K[2], S.week);
  const fol = M.cgFol = Math.round((M.cgFol || cgFollowers(me)) * 1);
  const film = M.jobs.map(j => j.film).find(f => f !== null && f !== undefined);
  const appeal = { set: 1.4, view: 1.2, pet: 1.7, food: .9, throwback: 1.1, thought: .8, job: 1.5 }[a.k] * (.6 + prnd() * .9);
  const likes = Math.round(fol * .06 * appeal + 3);
  const comments = aliveKnown().filter(id => opinion(id) > 15).slice(0, 8).filter(() => prnd() < .3).slice(0, 3).map(id => [id, CG_COMMENTS[Math.floor(prnd() * CG_COMMENTS.length)]]);
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
     <div class="cg-new"><h5>New post</h5>${posted ? '<p class="muted small">You\'ve posted this week. Leave them wanting more.</p>' : `<div class="bf-row">${['set', 'view', 'food', 'pet', 'throwback', 'thought', 'job'].map(k => `<button class="pill${(UI.cgK || 'thought') === k ? ' on' : ''}" data-cgk="${k}">${CG_KIND[k][0]} ${CG_KIND[k][1]}</button>`).join('')}</div><div class="compose own"><input id="cg-text" maxlength="160" placeholder="Write a caption…" value="${esc(UI.cgText || '')}"><button class="btn-s" data-cgpost="1">Post</button></div><p class="small muted">Pets and set photos do best. A photo from a closed set can cost you with the producer.</p>`}</div>
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
