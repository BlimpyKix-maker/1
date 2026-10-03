// ---------------- Beyond film: music, online video, podcasts, the stage ----------------
// The rest of the entertainment business, at the scale a newcomer meets it. You make things (songs, scores, music
// videos, Vidwire videos, Blip clips, podcast episodes, plays, musicals), put them out, and the audience decides.
// Audiences follow a long tail, as in life: most things find a few hundred people; a few find millions. Pay follows
// real platform economics: fractions of a cent per stream, a few dollars per thousand views once you qualify,
// ad money for podcasts with a steady audience, and box office splits that rarely cover the venue.
// Rolls use the player's dice (prnd) inside logged actions and the weekly close, so replays agree.
const PLATFORMS = {
  spinly: { name: 'Spinly', icon: '🎧', unit: 'streams', from: 2008, pay: .003, gate: 0, d: 'Music streaming. About a third of a cent per stream reaches an independent artist.' },
  vidwire: { name: 'Vidwire', icon: '▶️', unit: 'views', from: 2005, pay: .0035, gate: 1000, d: 'Long-form video. Ads pay once you pass 1,000 subscribers: a few dollars per thousand views.' },
  blip: { name: 'Blip', icon: '⚡', unit: 'views', from: 2016, pay: .0005, gate: 10000, d: 'Short clips, endless scrolling. The creator fund pays pennies; sponsorships pay the rent.' },
  podhaus: { name: 'Podhaus', icon: '🎙️', unit: 'downloads', from: 2005, pay: .025, gate: 500, d: 'Podcasts. Advertisers pay per thousand downloads once episodes reach a few hundred listeners.' },
  library: { name: 'Music libraries', icon: '🎼', unit: 'placements', from: 1950, pay: 180, gate: 0, d: 'Production music for TV, ads and trailers: a fee each time a track is licensed.' },
  stage: { name: 'The stage', icon: '🎭', unit: 'tickets', from: 1900, pay: 0, gate: 0, d: 'Fringe theatres and festivals. You hire the room, sell tickets, split the door.' }
};
const PLAT_OLD = { spinly: 'Radio & records', vidwire: 'Public-access TV', podhaus: 'Community radio', blip: null };   // before the platforms existed
const WORK_TYPES = {
  song: { label: 'Song', icon: '🎵', subs: ['song', 'theme'], need: 8, plat: 'spinly', field: 'music', base: 120, eng: .3, conv: .002, d: 'Write, record and release a song.' },
  score: { label: 'Composition / score', icon: '🎼', subs: ['score', 'orch'], need: 10, plat: 'library', field: 'music', base: 2, eng: 0, conv: 0, d: 'A piece of instrumental music for a library, a concert or a short film.' },
  mv: { label: 'Music video', icon: '📹', subs: ['vstory', 'comp'], need: 6, plat: 'vidwire', field: 'music', base: 90, eng: .2, conv: .003, cost: 250, needs: 'song', d: 'Pictures for one of your songs. Drives streams of the song too.' },
  video: { label: 'Vidwire video', icon: '▶️', subs: ['vstory', 'rhythm', 'pres'], need: 7, plat: 'vidwire', field: 'creator', base: 60, eng: .15, conv: .004, d: 'Plan, shoot and cut a video: essays, sketches, reviews, vlogs.' },
  blip: { label: 'Blip clip', icon: '⚡', subs: ['comic', 'pres', 'impro'], need: 2, plat: 'blip', field: 'creator', base: 300, eng: .1, conv: .01, d: 'Sixty seconds or less. Cheap to make, easy to forget, sometimes enormous.' },
  podcast: { label: 'Podcast episode', icon: '🎙️', subs: ['voice', 'dial', 'cha'], need: 4, plat: 'podhaus', field: 'podcast', base: 25, eng: .6, conv: .03, d: 'Record, edit and publish an episode. Audiences grow slowly and stay.' },
  play: { label: 'Stage play', icon: '🎭', subs: ['struc', 'dial', 'char'], need: 60, plat: 'stage', field: 'stage', base: 0, eng: 0, conv: 0, cost: 3200, d: 'Write a play and put it on at a fringe venue for two weeks.' },
  musical: { label: 'Musical', icon: '🎶', subs: ['song', 'struc', 'theme'], need: 100, plat: 'stage', field: 'stage', base: 0, eng: 0, conv: 0, cost: 9000, d: 'Book, music and lyrics. The hardest thing in the business to get right.' }
};
const FIELDS = { film: 'Film & TV', music: 'Music', creator: 'Online video', podcast: 'Podcasting', stage: 'Theatre' };
function platOpen(k) { return S.year >= PLATFORMS[k].from; }
function platName(k) { return platOpen(k) ? PLATFORMS[k].name : (PLAT_OLD[k] || PLATFORMS[k].name); }
function workTypeOpen(t) { const T = WORK_TYPES[t]; return T.plat !== 'blip' || platOpen('blip'); }
function payNow(v) { return v * (typeof cpi === 'function' ? cpi(S.year) / cpi(2027) : 1); }
function skillOf(me, s) { return me.sk[s] ?? me.mind[s] ?? 10; }
function followers(k) { return Math.round((S.me.fol || {})[k] || 0); }
// ---- making ----
function startWork(a) {
  const M = S.me, T = WORK_TYPES[a.type];
  if (!T || !workTypeOpen(a.type) || M.make) return false;
  if (T.needs === 'song' && !(M.works || []).some(w => w.type === 'song' && w.rel !== undefined)) return false;
  const title = String(a.title || '').replace(/\s+/g, ' ').trim().slice(0, 60) || workTitle(a.type, (M.works || []).length);
  M.make = { type: a.type, title, prog: 0, need: T.need, w: S.week, boost: 0 };
  diary(`You start a new ${T.label.toLowerCase()}: ${title}.`);
  return true;
}
const WT_A = ['Midnight', 'Paper', 'Golden', 'Static', 'Velvet', 'Neon', 'Quiet', 'Electric', 'Borrowed', 'Northern', 'Salt', 'Broken', 'Little', 'Summer', 'Glass'];
const WT_B = ['Hearts', 'Radio', 'Season', 'Signals', 'Rooms', 'Weather', 'Machines', 'Ghosts', 'Letters', 'Lights', 'Roads', 'Dreams', 'Hours', 'Kings', 'Rivers'];
function workTitle(type, n) { const r = hashRand(S.me.id * 13 + n * 7 + type.length); const t = `${WT_A[Math.floor(r() * WT_A.length)]} ${WT_B[Math.floor(r() * WT_B.length)]}`; return type === 'podcast' ? `The ${t} Podcast, ep. ${((S.me.works || []).filter(w => w.type === 'podcast').length) + 1}` : type === 'blip' ? `${t.toLowerCase()} #${n + 1}` : t; }
// A block of making: the project moves along; a good session (a roll) adds a little quality.
function makeSession(L) {
  const M = S.me, me = ME(), k = M.make;
  if (!k) { L.push('You meant to make something, but there\'s no project on the go. Start one on the Create tab.'); return; }
  const T = WORK_TYPES[k.type];
  k.prog++;
  for (const s of T.subs) if (me.sk[s] !== undefined) weekGain(s, .012);
  if (k.prog === Math.ceil(k.need / 2) || k.need <= 2) { const ok = roll(T.subs[0], 11); k.boost += ok ? 3 : -1; L.push(`${k.title}: ${ok ? 'a good session, it\'s coming together' : 'a frustrating session, nothing quite works'}.`); }
  else L.push(`${k.title}: ${k.prog} of ${k.need} sessions done.`);
  if (k.prog >= k.need) { k.ready = 1; L.push(`${k.title} is finished. Release it from the Create tab.`); }
}
// Release: quality from your skills, the sessions and gear; first-week audience from followers plus discovery.
function releaseWork(a) {
  const M = S.me, me = ME(), k = M.make;
  if (!k || !k.ready) return false;
  const T = WORK_TYPES[k.type], promo = clamp(+a.promo || 0, 0, 2), cost = usd([0, 60, 400][promo]) + (T.cost ? usd(T.cost) : 0);
  if (M.cash < cost) return false;
  M.cash -= cost;
  const sk = T.subs.reduce((t, s) => t + skillOf(me, s), 0) / T.subs.length;
  const q = clamp(Math.round(sk * 3.6 + 12 + k.boost * 2 + gearFor(k.type) * 3 + (a.edit || 0) + pgauss() * 9), 3, 98);
  const w = { id: (M.works || []).length, type: k.type, title: k.title, q, rel: S.week, plat: T.plat, units: 0, earned: 0, wk: [], promo, cost };
  if (k.type === 'review' && typeof reviewRelease === 'function') reviewRelease(w);
  if (T.plat === 'stage') {
    // a two-week fringe run: seats × nights × how full it is
    const seats = k.type === 'musical' ? 180 : 90, nights = 12, fill = clamp(.15 + (q - 40) / 90 + pgauss() * .12, .05, 1), price = usd(k.type === 'musical' ? 22 : 15);
    w.units = Math.round(seats * nights * fill); w.earned = Math.round(w.units * price * .6);
    M.cash += w.earned; w.fill = fill;
    if (q >= 78 && fill > .75) { w.pickup = 1; M.cash += usd(k.type === 'musical' ? 6000 : 2500); }
  } else {
    const z = pgauss(), fol = followers(T.plat);
    const disc = T.base * Math.pow(10, (q - 50) / 22 + z * .75) * (1 + promo * .8) * (M.deal && ['song', 'mv'].includes(k.type) ? 2.5 : 1);   // a label's promotion
    w.v0 = Math.round(fol * T.eng + disc); w.z = z; w.df = w.v0 > 0 ? disc / w.v0 : 1;   // only newcomers become followers
    if (k.type === 'score') w.v0 = Math.max(0, Math.round((q - 35) / 12 + z));
  }
  (M.works = M.works || []).push(w);
  M.make = null;
  diary(`You release ${w.title}${T.plat === 'stage' ? '' : ' on ' + platName(T.plat)}.`);
  if (T.plat === 'stage') inbox('note', `${w.title}: the run`, `Twelve nights in a ${k.type === 'musical' ? '180' : '90'}-seat room, ${Math.round(w.fill * 100)}% full on average. Your share of the door: ${fmtCash(w.earned)}${cost ? ` against ${fmtCash(cost)} in costs` : ''}.${w.pickup ? ' And a theatre wants to stage it properly: an advance on royalties is on its way.' : w.fill < .3 ? ' Some nights there were more people on stage than in the seats.' : ''}`);
  if (w.q >= 85) milestone(`Released ${w.title} (${T.label.toLowerCase()})`, 'write');
  return true;
}
// Once a week: every release earns what it earns, and the audience moves on.
const DECAY = { song: .62, mv: .6, video: .55, blip: .25, podcast: .7, score: .85 };
function mediaWeek() {
  const M = S.me, me = ME(); if (!M.works) return;
  M.fol = M.fol || {};
  for (const w of M.works) {
    if (w.plat === 'stage' || w.done) continue;
    const T = WORK_TYPES[w.type], age = S.week - w.rel, P0 = PLATFORMS[w.plat];
    const units = Math.round(w.v0 * Math.pow(DECAY[w.type] || .6, age) + (age > 0 ? w.v0 * .01 * (w.q / 60) : 0));
    if (units < 1 && age > 8) { w.done = 1; continue; }
    w.units += units; w.wk.push(units); if (w.wk.length > 26) w.wk.shift();
    const monet = !P0.gate || followers(w.plat) >= P0.gate;
    let pay = Math.round(units * payNow(w.plat === 'spinly' && M.deal ? .0011 : P0.pay) * (monet ? 1 : 0));
    if (w.plat === 'spinly' && M.deal && M.deal.rec < M.deal.adv) { const r = Math.min(pay, M.deal.adv - M.deal.rec); M.deal.rec += r; pay -= r; }   // the advance is paid back first
    w.earned += pay; M.cash += pay;
    M.fol[w.plat] = (M.fol[w.plat] || 0) + units * (w.df ?? 1) * T.conv * (.5 + w.q / 100);
    if (w.type === 'mv') { const s = M.works.find(x => x.type === 'song' && !x.done); if (s) s.v0 += units * .002; }
    if (age === 0 && w.z > 2.1 && w.v0 > 5000) { inbox('news', `${w.title} is taking off`, `Something has happened: ${w.title} is everywhere this week. ${w.v0.toLocaleString()} ${P0.unit} and climbing. Your phone won't stop buzzing.`); milestone(`${w.title} went viral`, 'prize'); me.fame = clamp((me.fame || 0) + 4, 0, 100); }
  }
  // audiences drift away when you go quiet
  for (const k in M.fol) { const last = Math.max(-1, ...M.works.filter(w => w.plat === k).map(w => w.rel)); if (S.week - last > 4) M.fol[k] *= .99; }
  // followers bring sponsors: an offer once a month or so when you're big enough
  const big = Object.entries(M.fol).filter(([k, v]) => ['vidwire', 'blip', 'podhaus'].includes(k) && v >= 5000).sort((a, b) => b[1] - a[1])[0];
  if (big && S.week % 5 === 0 && !pending().some(x => x.kind === 'sponsor')) {
    const [k, v] = big, fee = Math.round(payNow(k === 'podhaus' ? v * .025 * 2 : v / 1000 * (k === 'blip' ? 10 : 20)) / 10) * 10;
    const brand = ['a meal-kit company', 'a mattress brand', 'a language app', 'an energy drink', 'a VPN', 'a budget airline', 'a phone game'][S.week % 7];
    inbox('sponsor', `A sponsorship offer`, `${brand.charAt(0).toUpperCase() + brand.slice(1)} wants a spot on your ${PLATFORMS[k].name} channel: ${fmtCash(fee)} for one integration.`, { fee, plat: k, choices: [{ k: 'yes', label: `Take it (${fmtCash(fee)})` }, { k: 'no', label: 'Turn it down' }] });
  }
}
function sponsorPick(it, k) {
  if (it.kind !== 'sponsor') return false;
  it.done = true; it.picked = k;
  if (k === 'yes') { S.me.cash += it.fee; S.me.fol[it.plat] *= .99; it.result = { t: `Done. ${fmtCash(it.fee)} lands; a few followers roll their eyes.` }; }
  else it.result = { t: 'You keep the channel clean. This time.' };
  return true;
}
// ---- the Create tab panel ----
function portfolioHTML() {
  const M = S.me, k = M.make, W = (M.works || []).slice().reverse();
  const types = Object.entries(WORK_TYPES).filter(([t]) => workTypeOpen(t)).map(([t, T]) => [t, `${T.icon} ${T.label}`]);
  const fol = Object.keys(PLATFORMS).filter(p => followers(p) > 0);
  const total = (M.works || []).reduce((t, w) => t + w.earned, 0);
  return `<section class="panel portfolio"><h3>Your portfolio <span class="count">${(M.works || []).length}</span></h3>
   ${fol.length ? `<div class="kpis mini">${fol.map(p => `<div><span>${PLATFORMS[p].icon} ${esc(platName(p))}</span><b>${followers(p).toLocaleString()}</b><small class="muted">${followers(p) >= PLATFORMS[p].gate ? 'earning' : `${(PLATFORMS[p].gate - followers(p)).toLocaleString()} to go before it pays`}</small></div>`).join('')}</div>` : ''}
   ${k ? `<div class="mkproj"><p><b>${WORK_TYPES[k.type].icon} ${esc(k.title)}</b> <span class="muted small">${esc(WORK_TYPES[k.type].label)}</span></p><p class="small"><span class="tbar"><i style="width:${Math.round(k.prog / k.need * 100)}%"></i></span> ${k.prog} of ${k.need} sessions${k.ready ? '' : ' · book "Make things" blocks in your week, or use the apps on your computer'}</p>
     ${k.ready ? `<p>${sel('rel-promo', [['0', 'No promotion'], ['1', `A little promotion (${fmtCash(usd(60))})`], ['2', `A proper push (${fmtCash(usd(400))})`]], UI.relPromo || '0')} <button class="btn-s" data-release-work="1">Release${WORK_TYPES[k.type].plat === 'stage' ? ` (venue ${fmtCash(usd(WORK_TYPES[k.type].cost))})` : ' on ' + esc(platName(WORK_TYPES[k.type].plat))}</button></p>` : ''}</div>`
    : `<div class="mkproj"><p class="small muted">Start something new. You'll work on it in "Make things" blocks; how good it is depends on your skills and how the sessions go.</p><p>${sel('new-work', types, UI.newWork || types[0][0])} <input id="new-work-title" type="text" maxlength="60" placeholder="Title (optional)"> <button class="btn-s" data-start-work="1">Start</button></p><p class="small muted">${esc(WORK_TYPES[UI.newWork || types[0][0]].d)}</p></div>`}
   ${W.length ? `<div class="tw"><table class="grid"><thead><tr><th>Work</th><th>Where</th><th class="n">Quality</th><th class="n">Audience</th><th class="n">Earned</th></tr></thead><tbody>${W.slice(0, 12).map(w => `<tr><td>${WORK_TYPES[w.type].icon} <a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a> <span class="muted small">${fmtDate(w.rel, true)}</span></td><td class="small">${esc(platName(w.plat))}</td><td class="n">${w.q}</td><td class="n">${w.units.toLocaleString()} <span class="muted small">${PLATFORMS[w.plat].unit}</span></td><td class="n">${fmtCash(w.earned)}${w.cost ? `<br><span class="muted small">cost ${fmtCash(w.cost)}</span>` : ''}</td></tr>`).join('')}</tbody></table></div><p class="small muted">Lifetime earnings from your work: ${fmtCash(total)}. Most releases find a few hundred people; keep going, and some find thousands.</p>` : ''}</section>`;
}
