// ---------------- Working for a company: names on the door, films on the slate ----------------
// Every job off a film set now has a named employer: record labels, podcast networks and theatre companies from
// the media list where one fits, otherwise a small business with a name of its own (a recording studio, a music
// school, a creator channel). Executives at a film company work on the films that company is making: each week
// your work moves your company's slate (quality and how well it sells), and the higher your rung, the bigger the
// push. From director of development up you also get the calls: release dates, test screenings, marketing angles,
// casting, overruns. What you choose, and how well you argue it, goes into the film.
const BIZ_NAMES = {
  studio: [['Blackbird', 'Copperline', 'Halfmoon', 'Echo Lane', 'Tin Roof', 'Lowlight', 'Riverside', 'Signal Hill', 'Kingfisher', 'Granary'], ['Sound', 'Studios', 'Recording', 'Audio', 'Rooms']],
  school: [['Northgate', 'St Cecilia', 'Harmony', 'Downtown', 'Westbridge', 'Little Octave', 'Brightwater', 'Crescendo'], ['Music School', 'Academy', 'Music Centre', 'Conservatory']],
  theatre: [['The Lantern', 'The Old Vic Arms', 'The Playhouse', 'The Corn Exchange', 'The Little Ash', 'The Arcade', 'The Rope Walk', 'The Mercury'], ['Theatre', 'Playhouse', 'Stage Company', '']],
  channel: [['Popcorn', 'Night Owl', 'Fresh Cut', 'Deep Focus', 'Tiny Desk', 'Loud Kitchen', 'Big Questions', 'Low Budget'], ['Channel', 'Studio', 'Media', 'TV']],
  agency: [['Halcyon', 'Northbridge', 'Crowne & Lisle', 'Vantage', 'Bluebird', 'Larkspur', 'Meridian'], ['Talent', 'Partners', 'Group', 'Management']],
  cinema: [['The Roxy', 'The Electric', 'The Rio', 'The Lux', 'The Plaza', 'The Regal', 'The Scala', 'The Ritzy'], ['Cinema', 'Picture House', 'Screens', '']],
  venue: [['The Fleece', 'The Wardrobe', 'The Junction', 'The Boardwalk', 'The Cellar', 'The Night Light'], ['', 'Live', 'Music Hall']],
  office: [['Kestrel', 'Bright Field', 'Upstream', 'Parallel', 'North Star', 'Amberline', 'Fieldwork'], ['Media', 'Creative', 'Agency', 'Productions', 'Group']]
};
function bizKind(biz) {
  const b = String(biz || '').toLowerCase();
  if (/label|publisher|sync/.test(b)) return ['co', 'label'];
  if (/podcast|radio|broadcast/.test(b)) return ['co', 'podcast'];
  if (/theatre|stage|playhouse/.test(b)) return /casting|production|commercial/.test(b) ? ['co', 'theatre'] : ['gen', 'theatre'];
  if (/vidwire|creator|channel|streamer|online|social|brand/.test(b)) return /studio|management/.test(b) ? ['co', 'creator'] : ['gen', 'channel'];
  if (/record|studio|master|session|sound|audio/.test(b)) return ['gen', 'studio'];
  if (/school|teach|lesson|academy/.test(b)) return ['gen', 'school'];
  if (/agency|management|booking/.test(b)) return ['gen', 'agency'];
  if (/cinema|exhibition|festival/.test(b)) return ['gen', 'cinema'];
  if (/tour|band|venue|gig|live/.test(b)) return ['gen', 'venue'];
  return ['gen', 'office'];
}
// Named deterministically from the job, the city and the week, so the board and a replay agree.
function nameEmployer(p) {
  if (p.film !== null && p.film !== undefined) return;
  if (p.co !== undefined && S.companies[p.co]) { p.mco = p.mco || S.companies[p.co].name; return; }
  if (p.mco) return;
  const t = tmplOf(p) || {}, [mode, kind] = bizKind(t.biz || p.t), hub = p.away || S.me.hub, r = hashRand(p.id * 2654435761 % 4294967296 + hub.length);
  if (mode === 'co') { const L = MEDIA_COS.map((c, i) => [c, i]).filter(([c]) => c.type === kind && c.f <= S.year), near = L.filter(([c]) => c.hub === hub), P2 = near.length ? near : L; if (P2.length) { const [c, i] = P2[Math.floor(r() * P2.length)]; p.mco = c.n; p.mcoi = i; return; } }
  const N = BIZ_NAMES[kind] || BIZ_NAMES.office; p.mco = `${N[0][Math.floor(r() * N[0].length)]} ${N[1][Math.floor(r() * N[1].length)]}`.trim();
}
function employerLink(p) { return p.mcoi !== undefined ? mcoLink(p.mcoi) : p.co !== undefined && S.companies[p.co] ? cl(p.co) : esc(p.mco || ''); }
function nameBoard() { for (const p of S.me.board) nameEmployer(p); }

// ---- the slate: your company's films, and your hand on them ----
const SWAY = [.02, .04, .08, .15, .3, .5, .8, 1.2];   // per point of work, by rung: assistant … chair
function jobRung(j) { return /^corp_/.test(j.k) ? +j.k.slice(5) : -1; }
function slateOf(c) { return S.active.map(i => S.films[i]).filter(f => f.co === c.id && f.rel === null && f.stage < 5); }
function slateWeek() {
  const M = S.me, me = ME();
  for (const j of M.jobs) {
    const r = jobRung(j); if (r < 0) continue;
    const c = S.companies[j.co]; if (!c) continue;
    const d = (j.score || 0) - (j.scoreSeen || 0); j.scoreSeen = j.score || 0;
    const L = slateOf(c); if (!L.length) continue;
    // juniors touch one film a week; executives the whole slate
    const films = r >= 4 ? L : [L[(S.week + j.id) % L.length]];
    for (const f of films) {
      const sw = SWAY[r], cap = sw * 10, was = (f.exec || {})[M.id] || 0, now = clamp(was + (d + .25) * sw, -cap, cap), dq = now - was;
      f.exec = f.exec || {}; f.exec[M.id] = now;
      f.qBonus = (f.qBonus || 0) + dq * .6; f.hook = clamp((f.hook || 50) + dq * 1.8, 5, 99); f.you = (f.you || 0) + dq * .6;
    }
    // the calls that come with the chair
    if (r >= 3 && S.week % 4 === j.id % 4 && !pending().some(x => x.kind === 'slate')) {
      const f = L[Math.floor(hashRand(S.week * 13 + j.id)() * L.length)], DS = SLATE_CALLS.filter(x => x.stage.includes(f.stage)), D = DS[Math.floor(hashRand(S.week * 7 + j.id)() * DS.length)];
      if (D) inbox('slate', `${f.title}: ${D.title}`, D.text.replace('{film}', f.title).replace('{co}', c.name), { film: f.id, job: j.id, call: D.k, choices: D.opts.map(o => ({ k: o.k, label: o.label + (o.check ? ` (${statLabel(o.check[0])})` : '') })) });
    }
  }
}
const SLATE_CALLS = [
  { k: 'date', title: 'the release date', stage: [1, 2, 3], text: 'Distribution wants your view on {film}: the big summer weekend against a franchise, or the autumn slot where awards voters are watching.', opts: [{ k: 'summer', label: 'Go big: summer', check: ['mkt', 12], q: 0, hook: 8, risk: 1 }, { k: 'autumn', label: 'Autumn, for the awards crowd', check: ['tas', 11], q: 2, hook: 2 }, { k: 'defer', label: 'Let distribution decide', q: 0, hook: 0 }] },
  { k: 'test', title: 'the test screening', stage: [3], text: 'The test audience for {film} hated the ending. The director wants to keep it. The room is waiting for you.', opts: [{ k: 'recut', label: 'Recut the ending', check: ['shape', 11], q: -1, hook: 6 }, { k: 'back', label: 'Back the director', check: ['tas', 12], q: 4, hook: -2 }, { k: 'split', label: 'Find a middle way', check: ['com', 13], q: 2, hook: 3 }] },
  { k: 'angle', title: 'the marketing angle', stage: [2, 3], text: 'Marketing has two campaigns for {film}: sell the star, or sell the idea.', opts: [{ k: 'star', label: 'Sell the star', check: ['mkt', 11], q: 0, hook: 7 }, { k: 'idea', label: 'Sell the idea', check: ['tas', 12], q: 1, hook: 5 }, { k: 'both', label: 'Spend more and do both', q: 0, hook: 9, cost: 1 }] },
  { k: 'cast', title: 'a casting fight', stage: [0, 1], text: 'The financiers want a famous name in the second lead of {film}. The casting director has found someone unknown and perfect.', opts: [{ k: 'name', label: 'Take the name', check: ['pack', 11], q: -1, hook: 6 }, { k: 'right', label: 'Cast the right actor', check: ['talent', 12], q: 4, hook: 0 }] },
  { k: 'over', title: 'an overrun', stage: [2], text: '{film} is running eight days over. The line producer needs an answer: more money, or cut two scenes.', opts: [{ k: 'pay', label: 'Find the money', check: ['fin', 12], q: 2, hook: 0, cost: 1 }, { k: 'cut', label: 'Cut the scenes', check: ['bud', 11], q: -2, hook: 0 }, { k: 'push', label: 'Push the director to make the days', check: ['cha', 13], q: 0, hook: 0 }] },
  { k: 'fest', title: 'the festival question', stage: [3], text: 'Should {film} premiere at a festival first? It could make its name, or get eaten alive.', opts: [{ k: 'go', label: 'Festival premiere', check: ['tas', 12], q: 1, hook: 6, risk: 1 }, { k: 'skip', label: 'Straight to cinemas', q: 0, hook: 1 }] }
];
function slatePick(it, k) {
  if (it.kind !== 'slate') return false;
  const M = S.me, me = ME(), f = S.films[it.film], j = M.jobs.find(x => x.id === it.job), D = SLATE_CALLS.find(x => x.k === it.call); it.done = true;
  if (!f || !j || !D || f.rel !== null) { it.result = { t: 'Too late: the decision was made without you.' }; return true; }
  const o = D.opts.find(x => x.k === k) || D.opts[D.opts.length - 1], r = jobRung(j), sw = .4 + r * .15;
  let ok = true; if (o.check) ok = roll(o.check[0], o.check[1] + (r >= 6 ? -1 : 0));
  const dq = ok ? (o.q || 0) * sw : -Math.max(1, Math.abs(o.q || 0)) * sw * .5, dh = ok ? (o.hook || 0) * sw : -Math.max(1, Math.abs(o.hook || 0)) * sw * .5 - (o.risk ? 4 : 0);
  f.qBonus = (f.qBonus || 0) + dq; f.hook = clamp((f.hook || 50) + dh, 5, 99); f.you = (f.you || 0) + dq;
  if (o.cost) { const c = S.companies[j.co]; if (c) c.cash -= f.budget * .05; f.paMul = (f.paMul || 1) * 1.1; }
  (f.calls = f.calls || []).push({ w: S.week, who: M.id, call: D.title, pick: o.label, ok });
  j.score = (j.score || 0) + (ok ? 1 : -1);
  if (j.head !== null && j.head !== undefined && P(j.head)) addTie(me, P(j.head), ok ? 2 : -2);
  it.result = { t: `${o.label}. ${ok ? pickLine(['The room comes round to you.', 'You make the case and it lands.', 'It\'s your call, and people can see it was the right one.'], S.week) : pickLine(['You lose the room halfway through.', 'It doesn\'t land. People will remember whose idea it was.', 'The argument goes badly.'], S.week)} ${dq || dh ? `(${f.title}: quality ${dq >= 0 ? '+' : ''}${dq.toFixed(1)}, marketability ${dh >= 0 ? '+' : ''}${dh.toFixed(1)})` : ''}` };
  return true;
}
function slateHTML() {
  const M = S.me, j = M.jobs.find(x => jobRung(x) >= 0); if (!j) return '';
  const c = S.companies[j.co]; if (!c) return '';
  const r = jobRung(j), L = slateOf(c), done = c.films.map(i => S.films[i]).filter(f => f.rel !== null && f.exec && f.exec[M.id] !== undefined).slice(-6).reverse();
  return `<section class="panel slate"><h3>Your slate at ${cl(c.id)}</h3><p class="muted small">As ${esc(j.t.toLowerCase())}, ${r >= 4 ? 'you have a hand on every film the company is making' : 'you work on one of the company\'s films each week'}. Your weekly work moves quality and marketability by up to ${(SWAY[r] * 10).toFixed(1)} points a film${r >= 3 ? '; the big calls come to you too' : ''}. Climb the ladder and your say grows.</p>
   ${L.length ? `<div class="tw"><table class="grid small"><thead><tr><th>Film</th><th>Stage</th><th class="n">Budget</th><th class="n">Your mark</th><th>Calls you made</th></tr></thead><tbody>${L.map(f => { const v = (f.exec || {})[M.id] || 0; return `<tr><td>${fl(f.id)}</td><td>${esc(f.status || '')}</td><td class="n">${fmtM(f.budget)}</td><td class="n ${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${v.toFixed(1)}</td><td>${(f.calls || []).filter(x => x.who === M.id).map(x => `${esc(x.pick)}${x.ok ? '' : ' ✘'}`).join(', ') || '<span class="muted">none yet</span>'}</td></tr>`; }).join('')}</tbody></table></div>` : '<p class="muted small">Nothing in production right now. The next greenlight will land on your desk.</p>'}
   ${done.length ? `<h4>Released on your watch</h4><ul class="plain small">${done.map(f => `<li>${fl(f.id)} · ${fmtM(f.total || 0)} worldwide · reviews ${f.reviews} · your mark ${(f.exec[M.id] >= 0 ? '+' : '') + f.exec[M.id].toFixed(1)}</li>`).join('')}</ul>` : ''}</section>`;
}
// On a company's page: who they're hiring, and a way in.
function companyWorkHTML(c) {
  if (!S.me || c.closed !== null || c.owner !== undefined) return '';
  const M = S.me, posts = M.board.filter(p => p.co === c.id), j = M.jobs.find(x => x.co === c.id && jobRung(x) >= 0);
  return `<section class="panel"><h3>Working here</h3>${j ? `<p>You work here as <b>${esc(j.t)}</b>.</p>` : ''}${posts.length ? `<ul class="plain">${posts.map(p => `<li><a href="#" class="lk" data-go="post:${p.id}">${esc(p.t)}</a> <span class="muted small">${fmtCash(p.rate)}/day · ${Math.round(hireOdds(p) * 100)}% odds</span></li>`).join('')}</ul>` : '<p class="muted small">No openings on your board this week. Openings appear on CrewList; an enquiry email can shake one loose.</p>'}${slateOf(c).length ? `<p class="small">In production: ${slateOf(c).map(f => fl(f.id)).join(', ')}</p>` : ''}</section>`;
}
