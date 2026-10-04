// ---------------- Weather ----------------
// Every city has a climate: its hemisphere, how warm it runs, how far the seasons swing, and when the rain comes
// (a dry Mediterranean summer, a monsoon, a northern winter of snow). Each day's weather is worked out from that and
// the date, the same every time it's asked, and the city's big weather events (a heatwave, a cold snap, a storm)
// land on top. It matters twice over: on a shoot (rain days, lost exteriors, perfect light) and at the cinema, where a
// wet, cold weekend fills the seats, a glorious one empties them unless the film is the one everyone's talking about,
// and a blizzard or a hurricane shuts the doors.
// [hemisphere 1 north / -1 south, mean °C, seasonal swing, climate kind]
const CLIMATE = {
  hollywood: [1, 19, 5, 'med'], newyork: [1, 13, 12, 'cont'], toronto: [1, 9, 14, 'cont'], mexico: [1, 17, 3, 'high'], london: [1, 11, 6, 'ocean'], paris: [1, 12, 7, 'ocean'],
  rome: [1, 16, 8, 'med'], berlin: [1, 10, 10, 'cont'], madrid: [1, 15, 10, 'med'], hongkong: [1, 23, 6, 'monsoon'], taipei: [1, 23, 6, 'monsoon'], tokyo: [1, 16, 10, 'humid'],
  seoul: [1, 13, 14, 'humid'], beijing: [1, 13, 15, 'cont'], mumbai: [1, 27, 3, 'monsoon'], chennai: [1, 29, 3, 'monsoon'], sydney: [-1, 18, 5, 'humid'], wellington: [-1, 13, 4, 'ocean'],
  lagos: [1, 27, 2, 'wet'], cairo: [1, 22, 7, 'desert'], rio: [-1, 24, 3, 'wet'], buenosaires: [-1, 18, 7, 'humid'], moscow: [1, 6, 15, 'cont'], stockholm: [1, 7, 11, 'cont'],
  copenhagen: [1, 9, 8, 'ocean'], kolkata: [1, 27, 5, 'monsoon'], prague: [1, 9, 10, 'cont'], warsaw: [1, 8, 11, 'cont'], budapest: [1, 11, 11, 'cont'], helsinki: [1, 6, 12, 'cont'],
  istanbul: [1, 15, 9, 'med'], tehran: [1, 18, 12, 'desert'], dakar: [1, 25, 3, 'wet'], manila: [1, 28, 2, 'monsoon'], bangkok: [1, 29, 2, 'monsoon'], hochiminh: [1, 28, 2, 'monsoon'],
  bogota: [1, 14, 1, 'high'], jakarta: [1, 28, 1, 'wet'], johannesburg: [-1, 16, 6, 'high']
};
// chance of a wet day by month (Jan..Dec, northern), per climate kind
const RAIN_BY = {
  med: [.28, .26, .22, .14, .07, .03, .01, .02, .07, .14, .22, .27], cont: [.3, .28, .3, .32, .35, .36, .34, .32, .3, .3, .32, .32], ocean: [.45, .4, .38, .36, .35, .33, .32, .34, .36, .42, .46, .47],
  monsoon: [.04, .04, .06, .1, .2, .6, .75, .72, .55, .25, .1, .05], humid: [.18, .2, .3, .35, .38, .45, .4, .38, .4, .3, .22, .18], wet: [.2, .22, .3, .4, .45, .45, .4, .38, .4, .42, .35, .25],
  desert: [.06, .06, .05, .04, .02, .01, .01, .01, .01, .03, .05, .06], high: [.1, .12, .15, .3, .4, .45, .45, .45, .4, .35, .2, .1]
};
const WX = { sun: ['☀️', 'Sunny'], fair: ['🌤️', 'Fair'], cloud: ['☁️', 'Overcast'], rain: ['🌧️', 'Rain'], storm: ['⛈️', 'Storms'], snow: ['❄️', 'Snow'], heat: ['🔥', 'Scorching'], fog: ['🌫️', 'Fog'], wind: ['💨', 'Gales'] };
function wxMonth(w) { return Math.floor(((w % 52) + 52) % 52 / 4.34); }
// one day's weather in one city
function wxDay(hub, w, d = 0) {
  const C = CLIMATE[hub] || [1, 15, 8, 'ocean'], [ns, mean, amp, kind] = C, idx = HUB_IDS.indexOf(hub), r = hashRand((idx + 7) * 100003 + w * 7 + d), m = wxMonth(w);
  const season = Math.cos(((w % 52) / 52 * 2 * Math.PI) - (ns > 0 ? 3.6 : .46));   // peaks in high summer for each hemisphere
  const hi = Math.round(mean + amp * season + 4 + (r() - .5) * 6), lo = Math.round(hi - 7 - r() * 4);
  const mm = ns > 0 ? m : (m + 6) % 12, wetP = RAIN_BY[kind][mm];
  let k = 'sun'; const x = r();
  if (x < wetP) k = hi <= 1 ? 'snow' : r() < (kind === 'monsoon' || kind === 'wet' ? .35 : .15) ? 'storm' : 'rain';
  else if (x < wetP + .22) k = kind === 'ocean' && r() < .3 ? 'fog' : 'cloud';
  else if (x < wetP + .4) k = 'fair';
  if (k === 'sun' && hi >= 34) k = 'heat';
  if (k === 'cloud' && r() < .08) k = 'wind';
  // the city's weather events, where you live
  const ev = S.me && S.me.hub === hub && typeof worldOn === 'function' ? worldOn().filter(e => e.from <= w && e.to > w).map(e => e.k) : [];
  let note = '';
  if (ev.includes('heat')) { k = 'heat'; note = 'heatwave'; }
  if (ev.includes('cold')) { k = hi < 4 ? 'snow' : 'cloud'; note = 'cold snap'; }
  if (ev.includes('storm')) { k = 'storm'; note = 'storm warning'; }
  return { k, hi: ev.includes('heat') ? Math.max(hi, 35) : ev.includes('cold') ? Math.min(hi, 2) : hi, lo: ev.includes('cold') ? Math.min(lo, -4) : lo, wet: Math.round(wetP * 100), note };
}
// how a day's weather treats a shoot: below 0 is lost time, above is a gift
function wxShoot(x) { return { sun: .5, fair: 1, cloud: .3, rain: -1, storm: -2.5, snow: -2, heat: -1, fog: -.5, wind: -1.5 }[x.k] || 0; }
// how a weekend's weather moves cinema crowds: a multiplier on the opening
function wxCrowd(hub, w) {
  const days = [4, 5, 6].map(d => wxDay(hub, w, d)), m = wxMonth(w), summer = (CLIMATE[hub] || [1])[0] > 0 ? m >= 5 && m <= 7 : m === 11 || m <= 1;
  let k = 1; const why = [];
  const wet = days.filter(x => x.k === 'rain' || x.k === 'cloud' || x.k === 'fog').length, nice = days.filter(x => x.k === 'sun' || x.k === 'fair').length;
  if (wet >= 2) { k += .07; why.push('a grey, wet weekend sent people indoors'); }
  if (nice >= 3 && !summer) { k -= .05; why.push('a glorious weekend kept people outside'); }
  if (days.some(x => x.k === 'heat')) { k += summer ? .06 : .02; why.push('the heat drove people into air-conditioned cinemas'); }
  if (days.some(x => x.k === 'snow')) { k -= .14; why.push('snow closed roads and kept people home'); }
  if (days.some(x => x.k === 'storm')) { k -= days.filter(x => x.k === 'storm').length >= 2 ? .2 : .08; why.push('storms shut cinemas on the opening night'); }
  return { k: Math.max(.6, k), why };
}
// the box office hook: openings in the player's time, in the film's home city
function wxBoxMul(f) {
  if (!S.me || !S.me.party) return 1;   // the world before you arrived keeps its history
  const c = wxCrowd(f.hub, S.week); if (c.k === 1) return 1;
  f.wx = { k: +c.k.toFixed(2), why: c.why[0] || '' };
  return c.k;
}
// Weekly: the weather on shoots you're part of
function weatherWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done) return;
  const days = [0, 1, 2, 3, 4].map(d => wxDay(M.hub, S.week, d)), sc = days.reduce((t, x) => t + wxShoot(x), 0);
  const filming = M.jobs.map(j => j.film !== null && j.film !== undefined ? S.films[j.film] : null).filter(f => f && f.stage === 2 && f.hub === M.hub);
  const own = typeof finFilms === 'function' ? finFilms().filter(f => f.stage === 2 && f.hub === M.hub) : [];
  for (const f of [...new Set([...filming, ...own])]) {
    if (sc <= -4) { const isOwn = own.includes(f); if (isOwn) { f.cost += f.budget * .015; if (f.fin) f.fin.log.push({ w: S.week, t: `Weather: ${days.filter(x => wxShoot(x) < 0).length} days lost to ${WX[days.find(x => wxShoot(x) < 0).k][1].toLowerCase()}. Cover sets and overtime.`, tone: 'bad' }); }
      diary(`Weather on ${f.title}: ${WX[days.find(x => wxShoot(x) < 0).k][1].toLowerCase()} most of the week. The schedule slips; everyone is soaked and short-tempered.`); W_STRESS(2); }
    else if (sc >= 3) { if (own.includes(f)) { f.qBonus = (f.qBonus || 0) + .5; if (f.fin) f.fin.log.push({ w: S.week, t: 'Weather: a perfect week of light. The exteriors look expensive.', tone: 'good' }); } diary(`Weather on ${f.title}: a perfect week. Golden hour every evening, and the dailies glow.`); }
  }
}
function W_STRESS(v) { const W = S.me.wk; if (W) W.stress = (W.stress || 0) + v; else S.me.stress = clamp(S.me.stress + v, 0, 100); }

// ---- the app ----
function weatherApp() {
  const M = S.me, hub = UI.wxHub && CLIMATE[UI.wxHub] ? UI.wxHub : M.hub, W = M.wk, today = W ? W.day : 0;
  const week = [0, 1, 2, 3, 4, 5, 6].map(d => wxDay(hub, S.week, d)), next = [0, 1, 2, 3, 4, 5, 6].map(d => wxDay(hub, S.week + 1, d));
  const now = week[today], crowd = wxCrowd(hub, S.week), crowdN = wxCrowd(hub, S.week + 1), C = CLIMATE[hub] || [1, 15, 8, 'ocean'];
  const shoot = week.slice(today, 5).reduce((t, x) => t + wxShoot(x), 0);
  const day = (x, i, base) => `<div class="wxd${base + i === today && base === 0 ? ' on' : ''}"><small>${DAYS7[i].slice(0, 3)}</small><span class="wxi">${WX[x.k][0]}</span><b>${x.hi}°</b><small class="muted">${x.lo}°</small><small>${esc(WX[x.k][1])}</small></div>`;
  const months = Array.from({ length: 12 }, (_, m) => { const w = Math.round(m * 4.34 + 2), xs = [0, 2, 4, 6].map(d => wxDay(hub, w, d)); return { m, hi: Math.round(xs.reduce((t, x) => t + x.hi, 0) / xs.length), wet: xs[0].wet }; });
  const lo = Math.min(...months.map(x => x.hi)) - 2, hiT = Math.max(...months.map(x => x.hi)) + 2;
  const bars = `<div class="wxyear">${months.map(x => `<div title="${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.m]}: about ${x.hi}°, rain on ${x.wet}% of days"><i class="t" style="height:${Math.round((x.hi - lo) / Math.max(1, hiT - lo) * 100)}%"></i><i class="r" style="height:${x.wet}%"></i><small>${'JFMAMJJASOND'[x.m]}</small></div>`).join('')}</div>`;
  const ev = typeof worldOn === 'function' && hub === M.hub ? worldOn().filter(e => e.from <= S.week) : [];
  const pct = k => `${k >= 1 ? '+' : '−'}${Math.round(Math.abs(k - 1) * 100)}%`;
  const kind = { med: 'Mediterranean: dry, bright summers, mild wet winters', cont: 'Continental: hot summers, hard winters', ocean: 'Maritime: mild, changeable, often grey', monsoon: 'Monsoon: a dry season, then months of downpours', humid: 'Humid subtropical: muggy summers, storms', wet: 'Tropical: warm all year, rain any day', desert: 'Desert: hot, dry, the odd cold night', high: 'Highland: spring all year, afternoon rain in the wet season' }[C[3]];
  return `<div class="wxapp"><div class="wxnow"><div><p class="eyebrow">${esc(hubName(hub))} · ${DAYS7[today]}</p><p class="wxbig">${WX[now.k][0]} ${now.hi}°</p><p>${esc(WX[now.k][1])}, low of ${now.lo}°${now.note ? ` · <b>${esc(now.note)}</b>` : ''}</p></div>
    <label class="small">City ${sel('wx-hub', HUB_IDS.filter(h => CLIMATE[h]).map(h => [h, hubName(h)]), hub)}</label></div>
   <h5>This week</h5><div class="wxweek">${week.map((x, i) => day(x, i, 0)).join('')}</div>
   <h5>Next week</h5><div class="wxweek small">${next.map((x, i) => day(x, i, 7)).join('')}</div>
   <div class="os-grid">
    ${osCard('On set', `<p class="os-big">${shoot >= 2 ? '🎬 Good' : shoot <= -3 ? '🌧️ Rough' : '⛅ Mixed'}</p><p class="small">${shoot >= 2 ? 'Exteriors should go to plan, and the light will be kind.' : shoot <= -3 ? 'Expect lost days, cover sets and overtime. Shoots in town will slip.' : 'Some exteriors will move. Keep a cover set ready.'}</p><p class="small muted">Rain, storms, snow, gales and heat cost shooting days; a run of clear days is a gift. It shows in your own productions' budgets and quality, and in your mood on set.</p>`)}
    ${osCard('At the cinema this weekend', `<p class="os-big">${crowd.k === 1 ? 'Normal' : pct(crowd.k)}</p><p class="small">${crowd.why.length ? esc(crowd.why.join('; ')) + '.' : 'Ordinary weather: crowds as usual.'}</p><p class="small muted">Next weekend: ${crowdN.k === 1 ? 'normal' : pct(crowdN.k)}${crowdN.why.length ? ', ' + esc(crowdN.why[0]) : ''}. Openings in ${esc(hubName(hub))} feel it.</p>`)}
    ${osCard('Warnings', ev.length ? ev.map(e => { const X = WORLD_EVENTS.find(x => x.k === e.k); return `<p><b>${esc(X.t)}</b> until ${fmtDate(e.to, true)}<br><span class="small muted">${esc(X.d)}</span></p>`; }).join('') : '<p class="muted small">None in force.</p>')}
   </div>
   <h5>The year in ${esc(hubName(hub))} <span class="muted small">${esc(kind)}</span></h5>${bars}<p class="small muted">Bars: typical high temperature (gold) and how often it rains (blue), month by month.</p></div>`;
}
function weatherChange(e) { if (e.target.id === 'wx-hub') { UI.wxHub = e.target.value; render(true); return true; } return false; }
